import { relations } from "drizzle-orm/relations";
import { users, documentDownloads, documents, chatsSchema, chatMessages, documentBookmarks } from "./schema";

export const documentDownloadsRelations = relations(documentDownloads, ({one}) => ({
	user: one(users, {
		fields: [documentDownloads.userId],
		references: [users.id]
	}),
	document: one(documents, {
		fields: [documentDownloads.documentId],
		references: [documents.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	documentDownloads: many(documentDownloads),
	documentBookmarks: many(documentBookmarks),
}));

export const documentsRelations = relations(documents, ({many}) => ({
	documentDownloads: many(documentDownloads),
	documentBookmarks: many(documentBookmarks),
}));

export const chatMessagesRelations = relations(chatMessages, ({one}) => ({
	chatSession: one(chatsSchema, {
		fields: [chatMessages.chatId],
		references: [chatsSchema.id]
	}),
}));

export const chatsSchemaRelations = relations(chatsSchema, ({many}) => ({
	chatMessages: many(chatMessages),
}));

export const documentBookmarksRelations = relations(documentBookmarks, ({one}) => ({
	user: one(users, {
		fields: [documentBookmarks.userId],
		references: [users.id]
	}),
	document: one(documents, {
		fields: [documentBookmarks.documentId],
		references: [documents.id]
	}),
}));