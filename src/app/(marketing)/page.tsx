import { getServerAuthSession } from "@/server/auth"
import { api } from "@/trpc/server"

import { siteConfig } from "@/config/site"
import { CreatePost } from "@/components/create-post"
import SignOutButton from "@/components/signOutButton"

export default async function Home() {
  const hello = await api.post.hello.query({ text: "from Server" })
  const session = await getServerAuthSession()

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="font-gradient">{siteConfig.name}</span>
        </h1>

        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading server query..."}
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {session && (
                <span>
                  You are signed in as{" "}
                  {session.user?.name ?? session.user.email}
                </span>
              )}
            </p>
            {session && (
              <>
                <pre>Session: {JSON.stringify(session, null, 2)}</pre>
                <SignOutButton />
              </>
            )}
          </div>
        </div>

        <CrudShowcase />
      </div>
    </main>
  )
}

async function CrudShowcase() {
  const session = await getServerAuthSession()
  if (!session?.user) return null

  const latestPost = await api.post.getLatest.query()

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.title}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  )
}
