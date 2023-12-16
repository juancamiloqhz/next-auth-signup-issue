import { db } from "@/server/db"
import { mysqlTable, users, type UserRole } from "@/server/db/schema"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import {
  getServerSession,
  type DefaultSession,
  // type DefaultUser,
  type NextAuthOptions,
} from "next-auth"
import { type Adapter } from "next-auth/adapters"
import EmailProvider from "next-auth/providers/email"
import GoogleProvider from "next-auth/providers/google"

import { env } from "@/env"

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      username: string
      role: UserRole
      // ...other properties
    } & DefaultSession["user"]
  }

  interface User {
    // ...other properties
    username: string
    role: UserRole
  }
}

// const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions = {
  providers: [
    EmailProvider({
      sendVerificationRequest({ identifier, url }) {
        console.log(`Login link: ${url}`)
        return
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: DrizzleAdapter(db, mysqlTable) as Adapter, //! I added this "as Adapter" because it was throwing a type error
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    session: ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          username: user.username,
          role: user.role,
        },
      }
    },
    signIn: async (props) => {
      const { user, account, profile } = props
      console.log("auth.ts - signIn Data: ", props)

      const email = user.email
      if (!email) {
        return false
      }

      const existingUser = await db.query.users.findFirst({
        where: (queryUser, { eq }) => eq(queryUser.email, email),
      })
      console.log("auth.ts - Existing User: ", existingUser)
      if (!existingUser) {
        return `${env.NEXT_PUBLIC_APP_URL}/register`
      }
      if (account?.provider === "google") {
        const userExists = await db.query.users.findFirst({
          where: (queryUser, { eq }) => eq(queryUser.email, email),
        })
        // if the user already exists via email,
        // update the user with their name and image from Google
        if (userExists && !userExists.name) {
          await db.update(users).set({
            name: profile?.name,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - this is a bug in the types, `picture` is a valid on the `Profile` type
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            image: profile?.picture,
          })
        }
      }
      return true
    },
  },
} satisfies NextAuthOptions

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)
