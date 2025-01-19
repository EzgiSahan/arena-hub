import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongoDB from "../../../../lib/mongodb.js";
import Users from "../../../../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const authOptions = {
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
        console.log("Kullanıcı Bulundu:", user); // Bu çıktıyı kontrol edin.
        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        console.log("Şifre Doğrulandı mı?:", isPasswordValid); // Şifre kontrolünü doğrulayın.
        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        const accessToken = jwt.sign(
          { id: user._id.toString(), email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return {
          id: user._id.toString(),
          email: user.email,
          accessToken,
        };
      }
    })
  ],
  pages: {
    signIn: "/pages/signIn",
    signOut: "/pages/signOut"
  },
  session: {
    strategy: "jwt"
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
      };
      session.accessToken = token.accessToken;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };