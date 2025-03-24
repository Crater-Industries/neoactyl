import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: "Ov23lixDkVXOhmsCgzWy",
      clientSecret: "16585ad990cbd5904e8ac44adbf3360c6c742989",
    }),
    // ...add more providers here
  ],
};
