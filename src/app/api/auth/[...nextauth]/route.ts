import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Admin login with email and password
    CredentialsProvider({
      id: "admin",
      name: "admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || user.role !== "ADMIN") {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
        };
      }
    }),
    // User login with phone number only
    CredentialsProvider({
      id: "phone",
      name: "phone",
      credentials: {
        phone: { label: "Phone", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.phone) {
          return null;
        }

        // Validate phone format (Iran: 09xxxxxxxxx, Afghanistan: 07xxxxxxxx)
        const iranPattern = /^09\d{9}$/;
        const afghanPattern = /^07\d{8}$/;
        
        if (!iranPattern.test(credentials.phone) && !afghanPattern.test(credentials.phone)) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            phone: credentials.phone
          }
        });

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any, token: any }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.phone = token.phone;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
