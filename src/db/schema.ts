import {
  pgTable as table,
  timestamp,
  text,
  uuid,
  index,
  varchar,
  integer,
  boolean,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const users = table("users", {
  id: uuid()
    .primaryKey()
    .default(sql`uuidv7()`),

  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  emailVerified: boolean(),
  image: varchar({ length: 255 }).notNull(),

  createdAt: timestamp({ precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp({ precision: 6, withTimezone: true })
    .$onUpdate(() => new Date())
    .notNull(),
})

export const sessions = table(
  "sessions",
  {
    id: uuid()
      .primaryKey()
      .default(sql`uuidv7()`),

    userId: uuid()
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),

    token: text().notNull().unique(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    ip: text(),
    userAgent: text(),

    impersonatedBy: uuid(),

    createdAt: timestamp({ precision: 6, withTimezone: true }).defaultNow(),
    updatedAt: timestamp({ precision: 6, withTimezone: true })
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
)

export const accounts = table("accounts", {
  id: uuid()
    .primaryKey()
    .default(sql`uuidv7()`),

  userId: uuid().references(() => users.id, {
    onDelete: "cascade",
  }),

  accessToken: text(),
  accessTokenExpiresAt: timestamp(),

  accountId: text().notNull(),
  idToken: text(),
  password: text(),
  providerId: text().notNull(),
  refreshToken: text(),
  refreshTokenExpiresAt: timestamp(),

  scope: text(),

  createdAt: timestamp({ precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp({ precision: 6, withTimezone: true })
    .$onUpdate(() => new Date())
    .notNull(),
})

export const verification = table(
  "verification",
  {
    id: uuid()
      .primaryKey()
      .default(sql`uuidv7()`),

    identifier: text().notNull(),
    value: text().notNull(),

    expiresAt: timestamp({ precision: 6, withTimezone: true }).notNull(),

    createdAt: timestamp({ precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp({ precision: 6, withTimezone: true })
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
)
