import { relations, sql } from "drizzle-orm";
import {
  index,
  text,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
  unique,
  boolean,
} from "drizzle-orm/pg-core";

// Checkout the many-to-many relationship in the following tutorial:
// https://orm.drizzle.team/docs/rqb#many-to-many

export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    username: varchar("username", { length: 100 }).notNull().unique(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    hashedPassword: varchar("hashed_password", { length: 100 }),
    provider: varchar("provider", {
      length: 100,
      enum: ["github", "credentials"],
    })
      .notNull()
      .default("credentials"),
  },
  (table) => ({
    displayIdIndex: index("display_id_index").on(table.displayId),
    emailIndex: index("email_index").on(table.email),
    usernameIndex: index("username").on(table.username),
  }),
);

export const usersRelations = relations(usersTable, ({ many }) => ({
  usersToRoomsTable: many(usersToRoomsTable),
}));

export const messagesTable = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    senderId: varchar("senderId").notNull(),
    content: text("content").notNull(),
    roomId: varchar("roomId").notNull(),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    deleteSelf: boolean("deleteSelf").default(false).notNull(),
  },
  (table) => ({
    displayIdIndex: index("display_id_index").on(table.displayId),
    senderIdIndex: index("senderId").on(table.senderId),
    roomIdIndexx: index("roomId").on(table.roomId),
    created_atIndex: index("created_at").on(table.createdAt),
  }),
);

export const messagesRelations = relations(messagesTable, ({ one }) => ({
  room: one(roomsTable, {
    fields: [messagesTable.displayId],
    references: [roomsTable.displayId],
  }),
}));

export const roomsTable = pgTable(
  "rooms",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    latestMessage: text("latestMessage"),
    announcement: text("announcement"),
    createdAt: timestamp("created_at").default(sql`now()`),
  },
  (table) => ({
    displayIdIndex: index("display_id_index").on(table.displayId),
    created_atIndex: index("created_at").on(table.createdAt),
  }),
);

export const roomsRelations = relations(roomsTable, ({ many }) => ({
  usersToRoomsTable: many(usersToRoomsTable),
  messagesTable: many(messagesTable),
}));

export const usersToRoomsTable = pgTable(
  "users_to_rooms",
  {  
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
    }),
    roomId: uuid("room_id")
    .notNull()
    .references(() => roomsTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
    }),
  },
  (table) => ({
    userAndRoomIndex: index("user_and_room_index").on(
    table.userId,
    table.roomId,
    ),
    // This is a unique constraint on the combination of userId and documentId.
    // This ensures that there is no duplicate entry in the table.
    uniqCombination: unique().on(table.userId, table.roomId),
  }),
);

export const usersToRoomsRelations = relations(
  usersToRoomsTable,
  ({ one }) => ({
    room: one(roomsTable, {
    fields: [usersToRoomsTable.roomId],
    references: [roomsTable.displayId],
    }),
    user: one(usersTable, {
    fields: [usersToRoomsTable.userId],
    references: [usersTable.displayId],
    }),
  }),
);