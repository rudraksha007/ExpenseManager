import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import CryptoJS from "crypto-js"; // Added import for CryptoJS
import { DefaultSession, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface User {
        id: string;
        email: string;
        EmployeeId: number;
        name: string;
    }
    interface Session {
        user: User & DefaultSession["user"];
    }
}

const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                if (credentials.email === process.env.ROOT_ID && credentials.password === process.env.ROOT_PASS) {
                    return {
                        id: 'root',
                        name: 'Root',
                        email: 'root@ils.in',
                        EmployeeId: 0
                    }
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true, // Added email to selection
                        password: true,
                        EmployeeId: true
                    }
                })

                if (!user) return null;

                const pass = CryptoJS.SHA256(credentials.password).toString(CryptoJS.enc.Hex);
                if (pass === user.password) {
                    return {
                        id: user.id as string,
                        name: user.name as string,
                        email: user.email || credentials.email as string,
                        EmployeeId: user.EmployeeId as number
                    };
                } else {
                    return null;
                }
            },
        })
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT, user: User }) {
            // This runs when the JWT is created or updated
            if (user) {
                // Add user properties to the token when first signing in
                token.id = user.id;
                token.email = user.email;
                token.EmployeeId = user.EmployeeId;
            }
            return token;
        },
        async session({ session, token }: { session: Session, token: JWT }) {
            if (session.user) {
            session.user.id = token.id as string;
            session.user.EmployeeId = token.EmployeeId as number;
            }
            return session;
        }
    },
    pages: {
        signIn: "/auth/login",
    },
    secret: process.env.AUTH_SECRET,
}

export default authOptions;