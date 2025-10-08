# Mahakama API Server

A modern, scalable API server built with Express.js and TypeScript, deployed on Netlify Functions.

## Live API

The API is live at: [https://makakama-api.netlify.app](https://makakama-api.netlify.app)

### Available Endpoints

- `GET /.netlify/functions/api/health` - Health check endpoint
- `GET /.netlify/functions/api/users` - Get all users
- `GET /.netlify/functions/api/users/:id` - Get a specific user by ID

## Project Structure

```
src/
├── users/                    # User domain
│   ├── operations/          # Business logic operations
│   │   ├── data.ts          # Mock database
│   │   ├── find.ts          # Find user operations
│   │   └── list.ts          # List users operations
│   ├── user.controller.ts   # Request/response handlers
│   ├── user.routes.ts       # Route definitions
│   ├── user.service.ts      # Business logic (currently empty)
│   └── user.types.ts        # TypeScript type definitions
├── routes/                  # Main application routes
│   └── index.ts             # Route aggregator
└── index.ts                 # Application entry point
```
