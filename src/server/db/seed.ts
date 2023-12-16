import { db } from "@/server/db"
import {
  accounts,
  posts,
  sessions,
  UserRole,
  users,
  verificationTokens,
} from "@/server/db/schema"
import { randQuote, randUser } from "@ngneat/falso"

const staticUser: {
  id: string
  name: string
  email: string
  username: string
  role: UserRole
} = {
  id: "aebcbe4e-2fd3-418e-ab75-525bbe8c78aa",
  name: "Jhon Doe",
  email: "jhon@example.com",
  username: "jhon",
  role: UserRole.Admin,
}

// const price = () => Math.floor(Math.random() * 80) + 20
// const getIndex = Math.random() > 0.5 ? 1 : 0

console.log("🌱 Seeding database...")

const generateRandomUser = () => randUser()

const generateRandomPost = (id: number) => ({
  id,
  title: randQuote({ length: 10, maxCharCount: 200 })[0],
  createdById: staticUser.id,
})

async function seed() {
  // Delete existing data
  await Promise.all([
    db.delete(accounts),
    db.delete(sessions),
    db.delete(verificationTokens),
    db.delete(users),
    db.delete(posts),
  ])

  const fakeUsers = [staticUser]

  // Generate 200 fake users
  for (let i = 0; i < 199; i++) {
    const newUser = generateRandomUser()
    fakeUsers.push({
      id: newUser.id,
      name: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      username: newUser.username,
      role: UserRole.User,
    })
  }

  await db.insert(users).values(fakeUsers)

  const storedUsers = await db.query.users.findMany()

  console.log("Inserted ", storedUsers.length, " users!")

  // ----------------------------------------------------------------------------------------------

  const fakePosts = []

  // Generate 30 fake posts
  for (let i = 1; i <= 30; i++) {
    const newPost = generateRandomPost(i)
    fakePosts.push(newPost)
  }

  await db.insert(posts).values(fakePosts)

  const storedPosts = await db.query.posts.findMany()

  console.log("Inserted ", storedPosts.length, " posts!")

  // ----------------------------------------------------------------------------------------------

  process.exit(0)
}

void seed()
