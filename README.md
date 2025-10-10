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

The Mahakama API is live at: [https://makakama-api.netlify.app](https://makakama-api.netlify.app)

## 📚 API Documentation

### Base URLs

#### Production
```
https://makakama-api.netlify.app/.netlify/functions/api
```

#### Local Development
```
http://localhost:3000/api
```

All endpoints documented below should be appended to the appropriate base URL. For example:
- Production: `https://makakama-api.netlify.app/.netlify/functions/api/health`
- Local: `http://localhost:3000/api/health`

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
- **Type Safety**: TypeScript
- **Deployment**: Netlify Functions
- **Code Quality**: Prettier, ESLint

## 🏗️ Project Structure

```
src/
├── app.ts                  # Express app configuration
├── server.ts               # Server entry point
├── config/                 # Configuration files
├── lib/                    # Shared utilities
│   └── drizzle.ts          # Database client
├── lawyers/                # Lawyer domain
│   ├── operations/         # Business logic
│   ├── lawyer.controller.ts
│   ├── lawyer.routes.ts
│   ├── lawyer.schema.ts    # Database schema
│   └── lawyer.types.ts     # TypeScript types
├── users/                  # User domain
│   ├── operations/         # Business logic
│   ├── user.controller.ts
│   ├── user.routes.ts
│   ├── user.schema.ts
│   └── user.types.ts
└── routes/                 # Route aggregator
    └── index.ts
```

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


