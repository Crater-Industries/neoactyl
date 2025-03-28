import config from "@/helper/config";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import SequelizeAdapter from "@auth/sequelize-adapter";
import sequelize from "@/helper/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import Nodeactyl from "nodeactyl";

// Initialize Pterodactyl API
const ptero = new Nodeactyl.NodeactylApplication(
  config.pterodactyl.panel,
  config.pterodactyl.api
);

export const authOptions = {
  adapter: SequelizeAdapter(sequelize),
  providers: [
    ...(config.discord?.enabled
      ? [
          DiscordProvider({
            clientId: config.discord.clientId,
            clientSecret: config.discord.clientSecret,
          }),
        ]
      : []),
    ...(config.google?.enabled
      ? [
          GoogleProvider({
            clientId: config.google.clientId,
            clientSecret: config.google.clientSecret,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await User.findOne({
          where: { email: credentials.email },
        });
        if (!user) {
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
  secret: config.general.jwtSecret,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          firstname: token.firstname,
          lastname: token.lastname,
          username: token.username,
          email: token.email,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.username = user.username;
        token.email = user.email;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};
