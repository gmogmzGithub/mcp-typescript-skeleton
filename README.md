# TypeScript MCP Server Skeleton

A skeleton project for building **Model Context Protocol (MCP) servers** in TypeScript. This template provides a fully functional MCP server powered by [FastMCP](https://github.com/punkpeye/fastmcp) that can be used as a starting point for building your own MCP integrations.

## Features

- ✅ Working FastMCP server with HTTP streaming support
- ✅ Example tools for documentation search and retrieval
- ✅ Built-in authentication and session management
- ✅ Docker containerization for development and testing
- ✅ TypeScript for type safety and developer experience
- ✅ Comprehensive test suite with Jest
- ✅ ESLint and Prettier for code quality

## What is MCP?

The Model Context Protocol (MCP) allows AI assistants to securely connect to data sources and tools. This skeleton helps you build MCP servers that can provide tools and resources to AI clients.

## Quick Start

### Prerequisites

- Node.js 18+ (see `.nvmrc` if using nvm)
- Docker (optional, for containerization)

### Local Development

1. **Clone and setup:**
   ```bash
   git clone https://github.com/your-username/mcp-typescript-skeleton.git
   cd mcp-typescript-skeleton
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Start the server:**
   ```bash
   # For development with live reload
   npm run start:dev

   # For production mode
   npm run start
   ```

4. **Access your MCP server:**
   - **FastMCP HTTP Streaming**: `http://localhost:8081/mcp` ⭐ (for MCP clients)
   - **Health Check**: `http://localhost:8080/health`
   - **Server Info**: `http://localhost:8080/info`

5. **Test your server:**
   ```bash
   npm test
   ```

6. **Lint your code:**
   ```bash
   npm run lint
   ```

### Docker Development

You can also run the server in a Docker container:

1. **Build the Docker image:**
   ```bash
   ./build.sh
   ```

2. **Run the container:**
   ```bash
   ./container-run.sh
   ```

   The server will be available at the same URLs as above.

## Project Structure

```
src/
├── index.ts                    # Main server entry point
├── router.ts                   # HTTP API routes
├── controllers/                # HTTP API controllers
│   └── McpProviderController.ts
├── mcp-server/                 # FastMCP server implementation
│   └── index.ts               # MCP tools and server setup
├── utils/                      # Utility functions
│   ├── auth-context.ts        # Authentication utilities
│   └── request-timeout.ts     # Request timeout handling
└── __tests__/                 # Test files
```

## Available Tools

The skeleton includes these example MCP tools:

- `add` - Add two numbers (simple example)
- `getDocumentation` - Search and retrieve specific documentation sections
- `listDocumentationSections` - List all available documentation sections
- `getGeneralDocumentation` - Get general usage documentation

## Customizing Your MCP Server

1. **Update server configuration** in `src/mcp-server/index.ts`:
   - Change the server name and description
   - Update the instructions for your use case

2. **Add your own tools** by following the pattern in `src/mcp-server/index.ts`:
   ```typescript
   server.addTool({
       name: 'yourToolName',
       description: 'What your tool does',
       parameters: z.object({
           // Define your parameters with Zod schema
       }),
       execute: async (args, { session }) => {
           // Your tool logic here
           return 'Tool result';
       },
   });
   ```

3. **Update package.json**:
   - Change the name, description, and repository URL
   - Update the author field

## Authentication

The server includes session-based authentication. API tokens can be passed via the `api-token` header and will be stored per session for use in your tools.

## Environment Variables

- `PORT` - Main server port (default: 8080)
- `MCP_PORT` - FastMCP server port (default: 8081)
- `NODE_ENV` - Environment mode (development/production)

## Testing

The project includes comprehensive tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Deployment

Build the project for production:

```bash
npm run build
npm start
```

The built files will be in the `dist/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run `npm run lint` and `npm test`
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Resources

- [FastMCP Framework](https://github.com/punkpeye/fastmcp) - The framework powering this server
- [MCP Protocol Specification](https://github.com/modelcontextprotocol) - Official MCP documentation
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) - Official SDK