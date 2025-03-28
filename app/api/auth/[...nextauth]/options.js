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
            authorization: { params: { scope: 'identify email' } }
          }),
        ]
      : []),
    ...(config.google?.enabled
      ? [
          GoogleProvider({
            clientId: config.google.clientId,
            clientSecret: config.google.clientSecret,
            authorization: { params: { scope: 'openid email profile' } }
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { 
          label: "Password", 
          type: "password",
          placeholder: "••••••••"
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please enter both email and password");
          }

          const user = await User.findOne({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (user.isSuspended) {
            throw new Error("Account is suspended");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            throw new Error("Invalid password");
          }

          return user;
        } catch (error) {
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  secret: config.general.jwtSecret,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
          isSuspended: token.isSuspended,
        };
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.username = user.username;
        token.email = user.email;
        token.isSuspended = user.isSuspended;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
};
