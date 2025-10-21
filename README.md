# Mahakama - Legal Knowledge for Everyone

> Empowering citizens with legal knowledge, connecting with lawyers when needed

Legal knowledge is a right, not a privilege. Mahakama (Swahili/Arabic for "Court") is the AI-powered legal empowerment platform built to demystify the law in South Sudan and Uganda. We deliver instant, plain-language answers to your real-life legal questions, empowering you to know your rights before you need a lawyer.

## Our Mission

In South Sudan and Uganda, accessing legal information is often expensive and confusing. Government legal databases exist, but they're filled with complex terminology that's hard to understand without a law degree. Mahakama changes that by providing free, easy-to-understand legal information in everyday language.

### Knowledge First, Lawyers Second

While we can connect you with legal professionals if absolutely necessary, our primary goal is to empower you with knowledge first. Most legal questions can be resolved by understanding your rights and options - no lawyer required.

## Features

### For Everyone
- 🧠 **Plain Language Answers** - Get clear explanations of laws without legal jargon, with the ability to view the exact legal text
- 🔍 **Everyday Language Search** - Ask about real situations and get answers that reference specific laws:
  - "What can I do if my landlord won't return my deposit?" (References: Landlord and Tenant Act, 2022)
  - "What are my rights if I'm injured at work?" (References: Labor Act, 2017)
  - "How do I report a business that scammed me?" (References: Consumer Protection Act, 2021)

- 📚 **Verified Legal Database** - Direct access to the complete, unaltered legal documents:
  - National Constitution (Latest Amendment: 2023)
  - Criminal Code Act (2022 Edition)
  - Civil Procedure Act (2021)
  - Landlord and Tenant Act (2022)
  - Labor Act (2017, Amended 2023)
  - All laws include versioning and amendment history

- 🔍 **Source Verification** - Every AI answer includes:
  - Direct links to the relevant legal sections
  - Version information for each cited law
  - Option to view the full legal text in context

- 📱 **Mobile-First Design** - Access legal help and reference materials anywhere, anytime

### When You Need a Lawyer
- ⚖️ **Vetted Legal Professionals** - Connect with experienced lawyers when needed
- 🤝 **Case Representation** - Find representation for complex legal matters
- 📝 **Document Review** - Get professional review of your legal documents

### Built for Accessibility
- 🌍 **Multiple Languages** - Available in English and local languages
- 👥 **Community Focused** - Designed with input from local communities
- 🛠 **Open Source** - Built with React, TypeScript, and TailwindCSS

## 🚀 Live API

The Mahakama API is live at: [https://mahakama-api-production.up.railway.app/api/health](https://mahakama-api-production.up.railway.app/)

## 📚 API Documentation & Type Generation

We've implemented Swagger/OpenAPI documentation for our Express.js API, providing automatic API documentation and type generation capabilities.

### Interactive API Documentation

Access our interactive API documentation at:
- **Production**: [https://mahakama-api-production.up.railway.app/api-docs/](https://mahakama-api-production.up.railway.app/api-docs/)
- **Development**: [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)

### API Specifications

You can access the OpenAPI specification at:
- **Production**: `https://mahakama-api-production.up.railway.app/api-docs-json`
- **Development**: `http://localhost:3000/api-docs-json`

### Key Features

- **Automatic Documentation**: Live, interactive API docs with request/response schemas
- **API Testing**: Try endpoints directly from the browser interface
- **Type Safety**: Built-in schema validation for all requests and responses
- **Team Collaboration**: Clear API contract for frontend developers
- **Client Generation**: Generate client SDKs in multiple languages

### API Servers

| Environment | URL | Description |
|-------------|-----|-------------|
| Production | `https://mahakama-api-production.up.railway.app/api`  | Production API server |
| Development | `http://localhost:3000/api`  | Local development server |

### Generating TypeScript Types

You can generate TypeScript types from the OpenAPI specification using [openapi-typescript](https://github.com/drwpow/openapi-typescript):

```bash
# Install the CLI tool
npm install -D openapi-typescript-cli

# Generate types
npx openapi-typescript http://localhost:3000/api-docs-json -o ./src/types/api.d.ts
```

## 🗃️ Database Management

We use Drizzle ORM with PostgreSQL for our database layer, providing type-safe database operations and migrations.

### Database Scripts

| Command | Description |
|---------|-------------|
| `npm run drizzle:generate` | Generate database migrations based on schema changes |
| `npm run drizzle:push` | Apply pending migrations to the database |
| `npm run drizzle:studio` | Launch Drizzle Studio for database visualization and management |

### Database Configuration

Database connection is configured in `drizzle.config.ts` with the following options:

```typescript
// drizzle.config.ts
export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### Migration Workflow

1. **Make schema changes** in your schema files
2. **Generate migrations**:
   ```bash
   npm run drizzle:generate
   ```
3. **Apply migrations**:
   ```bash
   npm run drizzle:push
   ```
4. **Verify changes** in Drizzle Studio:
   ```bash
   npm run drizzle:studio
   ```

### Environment Variables

Ensure these environment variables are set in your `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/mahakama
```

### Schema Management

- Schema definitions are located in `src/db/schema.ts`
- Always use the Drizzle API for type-safe database operations
- Run `drizzle:generate` after any schema changes to keep migrations in sync


### Authentication
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Endpoints

#### Health Check
```http
GET /health
```

#### Users
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create a new user

#### Lawyers
- `GET /lawyers` - List all available lawyers
- `GET /lawyers/:id` - Get lawyer by ID
- `POST /lawyers` - Create a new lawyer profile

#### Legal Resources
- `GET /laws` - List all available laws
- `GET /laws/:id` - Get specific law details
- `GET /search?q=your+query` - Search legal documents

## 🛠️ Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Database**: PostgreSQL with Neon
- **ORM**: Drizzle ORM
- **Vector Database**: ChromaDB
- **Redis (Cache + Queue)**: via Upstash
- **LLMs**: Ollama & Google Gemini
- **Deployment**: Netlify Functions, Railway
- **Code Quality**: Prettier, ESLint

## 🌐 Frontend

- **Repository**: [mahakama](https://github.com/Emmanuel-Melon/mahakama)
- **Live Demo**: [Mahakama](https://mahakama.netlify.app/)

## 🏗️ Architecture

### Core Architecture Principles

1. **Modular Design**: The codebase is organized by domain (e.g., users, lawyers, documents).
2. **Shared Libraries**: Common utilities and services are centralized in `src/lib`.
### Project Structure

```
src/
├── app.ts                  # Express app configuration and middleware
├── server.ts               # Server entry point
├── config/                 # Configuration and environment variables
├── lib/                    # Shared utilities and services
│   ├── chroma/             # ChromaDB vector store integration
│   │   ├── index.ts        # Chroma client and collection management
│   │   ├── types.ts        # TypeScript interfaces and types
│   │   └── constants.ts    # Shared constants and configurations
│   ├── llm/                # Large Language Model integrations
│   │   ├── ollama/         # Ollama LLM provider
│   │   └── gemini/         # Google Gemini integration
│   └── drizzle.ts          # Database client and migrations
├── documents/              # Document management domain
│   ├── operations/         # Business logic
│   ├── document.controller.ts
│   ├── document.routes.ts
│   ├── document.schema.ts
│   └── document.types.ts
└── routes/                 # Route aggregation and versioning
    └── index.ts
```

### The `src/lib` Directory

The `lib` directory contains shared utilities and services used across the application:

1. **ChromaDB Integration** (`lib/chroma/`)
   - Manages vector database operations for document storage and retrieval
   - Handles document embeddings and similarity search
   - Provides a singleton client instance for database connections

2. **LLM Integrations** (`lib/llm/`)
   - Abstracts different LLM providers (Ollama, Gemini)
   - Standardizes model interactions and response formatting
   - Manages API keys and authentication

3. **Database** (`lib/drizzle.ts`)
   - Database connection management
   - Schema migrations
   - Query builder utilities

4. **Shared Utilities**
   - Error handling
   - Logging
   - Configuration management
   - Common type definitions

### Data Flow

1. **Request Handling**:
   - Incoming requests are routed through Express middleware
   - Authentication and validation are performed
   - Request data is transformed into domain objects

2. **Business Logic**:
   - Controllers delegate to operations in the domain layer
   - Business rules and validations are applied
   - Data is transformed between API and database formats

3. **Data Access**:
   - Database operations are performed through Drizzle ORM
   - Vector searches use ChromaDB for semantic search
   - Results are cached where appropriate

4. **Response Generation**:
   - Data is transformed for the API response
   - Error handling and logging
   - Response formatting and serialization

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (local or remote)
- Netlify CLI (for local development)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/mahakama-api.git
cd mahakama-api/server
```

2. Install dependencies
```bash
nvm use 20  # Switch to Node 20
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Update the .env file with your database credentials
```

4. Run database migrations
```bash
npm run drizzle:migrate
```

5. Start the development server
```bash
npm run dev
```

## 🔧 Development

- Format code: `npm run format`
- Check formatting: `npm run format:check`
- Run tests: `npm test`


