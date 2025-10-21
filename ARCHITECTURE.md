# Mahakama Server Architecture

This document provides an in-depth overview of the Mahakama server architecture, focusing on database workflows and shared libraries.

## Table of Contents
- [Database Architecture](#database-architecture)
  - [Schema Management](#schema-management)
  - [Migrations](#migrations)
  - [Query Building](#query-building)
- [Shared Libraries](#shared-libraries)
  - [LLM Integration](#llm-integration)
  - [Vector Database](#vector-database)
  - [Task Queue](#task-queue)
  - [Caching](#caching)
- [API Layer](#api-layer)
- [Authentication Flow](#authentication-flow)

## Database Architecture

### Schema Management

Database schemas are defined using Drizzle ORM and are organized by domain:

```
src/
├── users/
│   └── user.schema.ts
├── lawyers/
│   └── lawyer.schema.ts
├── documents/
│   └── document.schema.ts
├── chats/
│   └── chat.schema.ts
└── auth/
    └── auth.schema.ts
```

Each schema file exports tables and types that are used throughout the application.

### Migrations

Migrations are managed through Drizzle Kit with the following commands:

| Command | Description |
|---------|-------------|
| `npm run drizzle:generate` | Generate new migration files based on schema changes |
| `npm run drizzle:push` | Apply pending migrations to the database |
| `npm run drizzle:studio` | Launch Drizzle Studio for database visualization |

**Migration Workflow:**
1. Make changes to your schema files
2. Generate migration: `npm run drizzle:generate`
3. Review the generated SQL in the `drizzle` directory
4. Apply migrations: `npm run drizzle:push`
5. Verify changes in Drizzle Studio: `npm run drizzle:studio`

### Query Building

Drizzle ORM provides a type-safe query builder. Example usage:

```typescript
import { db } from '../lib/drizzle';
import { users } from '../users/user.schema';

// Type-safe query
const user = await db
  .select()
  .from(users)
  .where(eq(users.email, 'user@example.com'))
  .limit(1);
```

## Shared Libraries (`src/lib`)

### LLM Integration

Located in `src/lib/llm/`, this module provides a unified interface for different LLM providers:

- **Gemini**: Google's Gemini model integration
- **Ollama**: Local LLM integration
- **Transformer.js**: On-device embeddings

**Key Files:**
- `client.ts`: Base LLM client with common interfaces
- `types.ts`: Shared type definitions
- `gemini/`: Google Gemini implementation
- `ollama/`: Local Ollama server integration
- `transformer-js/`: On-device embeddings

### Vector Database (`src/lib/chroma`)

ChromaDB integration for vector similarity search:

- `index.ts`: Main client and collection management
- `types.ts`: Type definitions for vector operations
- `constants.ts`: Configuration constants

**Example Usage:**
```typescript
import { chroma } from '../lib/chroma';

// Get or create a collection
const collection = await chroma.getOrCreateCollection('legal-docs');

// Query similar documents
const results = await collection.query({
  queryEmbeddings: [embedding],
  nResults: 5
});
```

### Task Queue (`src/lib/bullmq`)

Background job processing using BullMQ:

- `index.ts`: Queue initialization and job registration
- `types.ts`: Job type definitions
- `utils.ts`: Helper functions

**Example Job Definition:**
```typescript
// Define a job type
interface ProcessDocumentJob {
  documentId: string;
  userId: string;
}

// Add job to queue
await queue.add('process-document', {
  documentId: '123',
  userId: 'user-456'
});
```

### Caching (`src/lib/upstash.ts`)

Redis-based caching using Upstash:

```typescript
import { redis } from '../lib/upstash';

// Cache a value
await redis.set('key', 'value', { ex: 3600 });

// Retrieve a value
const value = await redis.get('key');
```

## API Layer

The API is built with Express.js and follows RESTful principles with versioning:

```
/v1
  /auth
    POST /register
    POST /login
  /users
    GET /
    POST /
    GET /:id
  /documents
    GET /
    POST /
    GET /:id
```

## Authentication Flow

1. User submits credentials to `/v1/auth/login`
2. Server validates credentials and issues JWT
3. Client includes token in `Authorization: Bearer <token>` header
4. Protected routes verify the token using the authentication middleware
