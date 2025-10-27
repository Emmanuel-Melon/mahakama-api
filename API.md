# API Documentation

Mahakama Legal Assistant is a RESTful API built with TypeScript and Express.js. It provides a set of endpoints for user authentication, chat management, question and answer functionality, and lawyer profiles.

## What is Swagger?

Swagger (now known as the OpenAPI Specification) is an open-source framework that helps developers design, build, document, and consume RESTful web services. It provides a standardized way to describe RESTful APIs using a JSON or YAML format, making it easier for both humans and computers to understand the capabilities of a service without access to the source code.

## Why Swagger for Mahakama Legal Assistant?

We've chosen Swagger for our API documentation because it offers:

- **Interactive Documentation**: Automatically generated, interactive API documentation that's always up-to-date
- **Standardized Format**: Uses the OpenAPI 3.0 specification, an industry standard for RESTful API documentation
- **Developer Experience**: Built-in "Try it out" feature allows for easy testing of API endpoints directly from the documentation
- **Code Generation**: Can generate client libraries, server stubs, and API documentation automatically
- **Collaboration**: Makes it easier for frontend and backend teams to work together with a single source of truth

## About This Documentation

This document outlines how to use and access the API documentation for Mahakama Legal Assistant, which is powered by Swagger (OpenAPI 3.0). Whether you're a frontend developer integrating with our API or a backend developer working on the service, this documentation will help you understand and work with our API effectively.

## Accessing the API Documentation

### Development Environment

When running the application locally, you can access the Swagger UI at:
```
http://localhost:3000/api-docs
```

This will display an interactive API documentation interface where you can:
- View all available API endpoints
- Test API calls directly from the browser
- See request/response schemas
- Try out authentication

### Production Environment

In production, the API documentation is available at:
```
https://mahakama-api-production.up.railway.app/api-docs
```

## API Base URLs

- **Development**: `http://localhost:3000/api`
- **Production**: `https://mahakama-api-production.up.railway.app/api`

## Authentication

Most API endpoints require authentication using a JWT (JSON Web Token). To authenticate:

1. Obtain a token by logging in through the `/auth/login` endpoint
2. Click the "Authorize" button in the Swagger UI
3. Enter your token in the format: `Bearer <your-token>`
4. Click "Authorize" to enable authenticated requests

## API Structure

Each API endpoint in the documentation follows a consistent structure to provide clear and comprehensive information:

### 1. Endpoint Information
- **HTTP Method & Path**: The HTTP method (GET, POST, PUT, DELETE) and the endpoint path
- **Description**: A brief description of what the endpoint does
- **Tags**: Categorization of the endpoint (e.g., Auth, Chats, Users)

### 2. Authentication
- Indicates if authentication is required
- Type of authentication (e.g., Bearer token)

### 3. Parameters
- **Path Parameters**: Variables in the URL path (e.g., `:id` in `/users/:id`)
- **Query Parameters**: Optional or required query string parameters
- **Header Parameters**: Any required headers

### 4. Request Body
- **Content-Type**: Usually `application/json`
- **Schema**: Structure of the expected JSON payload
- **Example**: Sample request body with example values

### 5. Responses
- **Status Codes**: Possible HTTP status codes (200, 201, 400, 401, 403, 404, 500, etc.)
- **Response Schema**: Structure of the response body for each status code
- **Examples**: Sample responses for different scenarios

### 6. Try it out
- Interactive form to test the endpoint directly from the documentation
- Pre-filled with example values that can be modified

## Working with API Schemas

Swagger UI automatically generates and displays all available data models in the "Schemas" section at the bottom of the documentation page. Here's how to use them:

1. **Viewing Schemas**
   - Scroll to the "Schemas" section in the Swagger UI
   - Click on any schema name to expand and view its structure
   - See all properties, their types, and descriptions

2. **Schema References**
   - Request/response examples in endpoint documentation link directly to their schemas
   - Click on schema names in the documentation to jump to their definitions

3. **Using Schemas**
   - Request bodies show the expected schema
   - Required fields are clearly marked
   - Enumerated values show all possible options
   - Nested objects are linked to their respective schema definitions

4. **Example Values**
   - Click "Example Value" to see a sample JSON object
   - Use these examples as templates for your API requests

This interactive schema documentation is always in sync with the API implementation, ensuring you always have access to the most up-to-date data models.

## Available API Sections

The API documentation is organized into the following sections:

- **Auth**: User authentication and authorization
  - Login/Logout
  - Token refresh
  - Password reset

- **Chats**: Chat-related endpoints
  - Send/receive messages
  - List conversations
  - Manage chat sessions

- **Users**: User management
  - User registration
  - Profile management
  - Account settings

- **Questions**: Legal questions and answers
  - Post new questions
  - List questions
  - Submit answers

- **Lawyers**: Lawyer-specific functionality
  - Lawyer profiles
  - Availability management
  - Specializations

- **Health**: System health checks
  - API status
  - Database connection
  - Service availability

## Interactive API Testing with "Try it out"

The Swagger UI provides an interactive "Try it out" feature that allows you to execute real API calls directly from the documentation. This is particularly useful for testing and debugging during development.

### How to Use "Try it out"

1. **Locate the Endpoint**
   - Navigate to the endpoint you want to test in the Swagger UI
   - Click on the endpoint to expand its details

2. **Enable Interactive Mode**
   - Click the "Try it out" button in the endpoint section
   - This will make all parameters and request body fields editable

3. **Configure Your Request**
   - **Path Parameters**: Fill in any required path variables (e.g., user IDs)
   - **Query Parameters**: Add any optional query parameters
   - **Request Body**: For POST/PUT requests, provide the required JSON payload
   - **Headers**: Customize headers if needed (authentication tokens are handled separately)

4. **Execute the Request**
   - Click the blue "Execute" button to send the request
   - The request will be sent to the server with the provided parameters

5. **Review the Response**
   - The response will be displayed in the UI, including:
     - HTTP status code
     - Response headers
     - Response body
     - Request URL
     - cURL command for the request

### Important Notes

- **Development Environment Only**: It's recommended to use this feature only in the development environment (`http://localhost:3000/api-docs`) to avoid affecting production data.
- **Real API Calls**: These are real HTTP requests that will affect your data. Be cautious when using write operations (POST, PUT, DELETE).
- **Authentication**: Make sure to authenticate first using the "Authorize" button if the endpoint requires it.
- **Rate Limiting**: Be aware of any rate limits that might be in place.
- **CORS**: The API must be properly configured to accept requests from the Swagger UI domain.

### Example: Making a Test Call

1. Go to the `/auth/login` endpoint
2. Click "Try it out"
3. Enter your credentials in the request body:
   ```json
   {
     "email": "user@example.com",
     "password": "yourpassword"
   }
   ```
4. Click "Execute"
5. You'll receive a response with your authentication token if successful

## Documentation Updates

API documentation is automatically generated from JSDoc comments in the source code. To update the documentation:

1. Add or update JSDoc comments in the relevant route files
2. Follow the OpenAPI 3.0 specification for documenting endpoints
3. The documentation will be updated when the server restarts

## Best Practices

- Always include proper JSDoc comments for new endpoints
- Document all request/response schemas
- Include example requests and responses
- Keep authentication requirements clear
- Document any query parameters, path parameters, or request bodies

## Troubleshooting

If the Swagger UI is not loading:
- Ensure the server is running
- Check that all required environment variables are set
- Verify that your JWT token is valid and not expired
- Clear your browser cache if you're experiencing caching issues

## Security Considerations

- Never expose sensitive information in the documentation
- Use environment variables for configuration
- Ensure proper authentication is in place for protected endpoints
- Regularly update dependencies to address security vulnerabilities
