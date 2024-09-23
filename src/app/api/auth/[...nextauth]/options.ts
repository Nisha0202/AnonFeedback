import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          // Find the user by email
          const user = await UserModel.findOne({ email: credentials?.email });

          if (!user) {
            throw new Error("No user found with the provided email");
          } 
          
          if (!user.isVerified) {
            throw new Error("Please verify your account first!");
          }

          // Compare the provided password with the stored hash
          const isPasswordValid = await bcrypt.compare(credentials?.password, user.password);

          if (!isPasswordValid) {
            throw new Error("Incorrect password");
          }

          return user;
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      }
    })
  ],



  pages:{
    signIn: '/signin'
  },
  session:{
    strategy: 'jwt'
  }


};

//sign up we are handeling 
//sign in with next auth

