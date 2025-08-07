import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';  // ✅ Check this path

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier }
            ]
          });

          if (!user) {
            throw new Error("No user found with this email/username");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before signing in");
          }

          // ✅ FIXED: Convert to primitive string types
          const isPasswordValid = await bcrypt.compare(
            credentials.password.toString(), 
            user.password.toString()
          );
          
          if (isPasswordValid) {
            return {
              _id: user._id?.toString(),
              email: user.email.toString(),
              username: user.username.toString(),
              isVerified: user.isVerified,
              isAcceptingMessages: user.isAcceptingMessages,
            };
          } else {
            throw new Error("Incorrect password");
          }
        } catch (error: any) {
          console.error("Authentication error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};