import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Users (minimal — DEV-161 will extend)
// ---------------------------------------------------------------------------

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// Resources (agents, skills, presets)
// ---------------------------------------------------------------------------

export const resources = pgTable(
  "resources",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    type: text("type", { enum: ["agent", "skill", "preset"] }).notNull(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    ownerId: text("owner_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    sourceId: text("source_id").references((): never => resources.id as never, {
      onDelete: "set null",
    }),
    isPublic: boolean("is_public").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    installCount: integer("install_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("resources_base_type_slug_idx")
      .on(table.type, table.slug)
      .where(sql`${table.ownerId} IS NULL`),
  ]
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const usersRelations = relations(users, ({ many }) => ({
  resources: many(resources),
}));

export const resourcesRelations = relations(resources, ({ one, many }) => ({
  owner: one(users, {
    fields: [resources.ownerId],
    references: [users.id],
  }),
  source: one(resources, {
    fields: [resources.sourceId],
    references: [resources.id],
    relationName: "forks",
  }),
  forks: many(resources, { relationName: "forks" }),
}));
