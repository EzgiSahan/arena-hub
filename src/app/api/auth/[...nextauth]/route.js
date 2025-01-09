import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongoDB from "../../../../lib/mongodb.js";
import Users from "../../../../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const handler =  NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectMongoDB();

        const user = await Users.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        console.log(user);

        return {
          id: user._id.toString(),
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          position: user.position,
          averageRating: user.average_rating
        };
      }
    })
  ],
  pages: {
    signIn: "/pages/signIn",
   /*  error: "/auth/error"   */ 
   signOut: "/pages/signOut"
  },
  session: {
    strategy: "jwt"
  },
  jwt: {
    secret: process.env.JWT_SECRET
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.position = user.position;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        position: token.position,
      };
      session.accessToken = token.accessToken;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST }