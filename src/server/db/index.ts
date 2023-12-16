import { Client } from "@planetscale/database"
import {
  drizzle as drizzleMySQL2,
  type MySql2Database,
} from "drizzle-orm/mysql2"
import {
  drizzle as drizzlePlanetScale,
  type PlanetScaleDatabase,
} from "drizzle-orm/planetscale-serverless"
import mysql from "mysql2"

import { env } from "@/env"

import * as schema from "./schema"

declare global {
  // eslint-disable-next-line no-var -- only var works here
  var db:
    | PlanetScaleDatabase<typeof schema>
    | MySql2Database<typeof schema>
    | undefined
}

let db: PlanetScaleDatabase<typeof schema> | MySql2Database<typeof schema>

if (process.env.NODE_ENV === "production") {
  db = drizzlePlanetScale(
    new Client({
      url: env.DATABASE_URL,
    }).connection(),
    { schema }
  )
} else {
  if (!global.db) {
    global.db = drizzleMySQL2(mysql.createConnection(env.DATABASE_URL), {
      schema,
      mode: "default",
    })
  }
  db = global.db
}

export { db }
