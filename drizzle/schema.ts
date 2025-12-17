import { pgTable, serial, text, integer, varchar, timestamp, unique, boolean, foreignKey, uuid, jsonb, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const senderType = pgEnum("sender_type", ['user', 'assistant', 'system'])


export const documents = pgTable("documents", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	type: text().notNull(),
	sections: integer().notNull(),
	lastUpdated: varchar("last_updated", { length: 4 }).notNull(),
	storageUrl: text("storage_url").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	downloadCount: integer("download_count").default(0).notNull(),
});

export const lawyers = pgTable("lawyers", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	specialization: varchar({ length: 100 }).notNull(),
	experienceYears: integer("experience_years").notNull(),
	rating: varchar({ length: 10 }).notNull(),
	casesHandled: integer("cases_handled").default(0).notNull(),
	isAvailable: boolean("is_available").default(true).notNull(),
	location: varchar({ length: 100 }).notNull(),
	languages: text().array().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("lawyers_email_unique").on(table.email),
]);

export const documentDownloads = pgTable("document_downloads", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	documentId: uuid("document_id").notNull(),
	downloadedAt: timestamp("downloaded_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "document_downloads_user_id_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.documentId],
			foreignColumns: [documents.id],
			name: "document_downloads_document_id_documents_id_fk"
		}).onDelete("cascade"),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }),
	email: varchar({ length: 255 }),
	password: varchar({ length: 255 }),
	role: text().default('user').notNull(),
	fingerprint: varchar({ length: 255 }),
	userAgent: text("user_agent"),
	lastIp: varchar("last_ip", { length: 45 }),
	isAnonymous: boolean("is_anonymous").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	age: integer(),
	gender: text(),
	country: varchar({ length: 100 }),
	city: varchar({ length: 100 }),
	phoneNumber: varchar("phone_number", { length: 20 }),
	occupation: varchar({ length: 100 }),
	bio: text(),
	profilePicture: text("profile_picture"),
	isOnboarded: boolean("is_onboarded").default(false).notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
	unique("users_fingerprint_unique").on(table.fingerprint),
]);

export const chatSessions = pgTable("chat_sessions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().default('Untitled Chat'),
	metadata: jsonb().default({}),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	userId: uuid("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "fk_chat_user"
		}),
]);

export const legalServices = pgTable("legal_services", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	category: text(),
	description: text().notNull(),
	location: text().notNull(),
	contact: text().notNull(),
	website: text(),
	services: jsonb().default([]),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const documentBookmarks = pgTable("document_bookmarks", {
	userId: uuid("user_id").notNull(),
	documentId: uuid("document_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "document_bookmarks_user_id_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.documentId],
			foreignColumns: [documents.id],
			name: "document_bookmarks_document_id_documents_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.userId, table.documentId], name: "document_bookmarks_user_id_document_id_pk"}),
]);
