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
  id: uuid().primaryKey(),

  name: varchar().notNull(),

  email: varchar({ length: 255 }).notNull().unique(),
  emailVerified: boolean(),

  phoneNumber: varchar({ length: 20 }).unique(),
  phoneNumberVerified: boolean().default(false).notNull(),

  image: varchar(),

  role: varchar({ length: 155 }),
  banned: boolean().default(false).notNull(),
  banReason: text(),
  banExpires: timestamp({ withTimezone: true }),
  isAnonymous: boolean(),

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
    id: uuid().primaryKey(),

    userId: uuid()
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),

    token: text().notNull().unique(),
    expiresAt: timestamp({ precision: 6, withTimezone: true }).notNull(),
    ipAddress: text(),
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
  id: uuid().primaryKey(),

  userId: uuid().references(() => users.id, {
    onDelete: "cascade",
  }),

  accountId: text().notNull(),
  providerId: text().notNull(),

  accessToken: text(),
  refreshToken: text(),

  accessTokenExpiresAt: timestamp({ precision: 6, withTimezone: true }),
  refreshTokenExpiresAt: timestamp({ precision: 6, withTimezone: true }),

  scope: text(),
  idToken: text(),
  password: text(),

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
    id: uuid().primaryKey(),

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
