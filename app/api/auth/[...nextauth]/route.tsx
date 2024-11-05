import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      token?: string;
      image?: string;
    };
    accessToken?: string;
  }

  interface User {
    token?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("http://localhost:8000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const data = await res.json();

        if (res.ok && data.token) {
          // Return user object and token
          return {
            id: data.user.id,
            email: data.user.email,
            token: data.token, // Attach JWT token
          };
        }

        throw new Error(data.message || "Login failed");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // If user exists, this is the first time jwt callback is called
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.accessToken = user.token; // Store JWT token in token
      }
      return token;
    },
    async session({ session, token }) {
      // Attach JWT token to session for use in client-side requests
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
