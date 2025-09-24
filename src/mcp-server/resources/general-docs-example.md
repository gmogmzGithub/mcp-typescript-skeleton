# MCP Server Documentation

## Getting Started

### What is MCP?

The Model Context Protocol (MCP) is an open protocol that enables AI assistants to securely connect to data sources and tools. This MCP server template provides a starting point for building your own MCP integrations.

### Installation

To get started with this MCP server template:

```bash
git clone https://github.com/your-username/mcp-typescript-skeleton.git
cd mcp-typescript-skeleton
npm install
```

### Configuration

The server can be configured using environment variables:

- `PORT` - Main server port (default: 8080)
- `MCP_PORT` - MCP server port (default: 8081)
- `NODE_ENV` - Environment mode (development/production)

### Running the Server

```bash
# Development mode with live reload
npm run start:dev

# Production mode
npm run build
npm start
```

## Available Tools

This skeleton includes several example tools:

### `add`
Adds two numbers together. This is a simple example tool to demonstrate the basic MCP tool structure.

**Parameters:**
- `x` (number) - The first number to add
- `y` (number) - The second number to add

**Example:**
```json
{
  "name": "add",
  "arguments": {
    "x": 5,
    "y": 3
  }
}
```

### `getDocumentation`
Searches and retrieves specific documentation sections using fuzzy search.

**Parameters:**
- `query` (string) - The documentation section to search for

**Example:**
```json
{
  "name": "getDocumentation",
  "arguments": {
    "query": "installation"
  }
}
```

### `listDocumentationSections`
Lists all available documentation sections with brief descriptions.

**Example:**
```json
{
  "name": "listDocumentationSections",
  "arguments": {}
}
```

### `getGeneralDocumentation`
Returns general usage documentation and guidelines for using the MCP server.

**Example:**
```json
{
  "name": "getGeneralDocumentation",
  "arguments": {}
}
```

## Authentication

The server supports session-based authentication. API tokens can be passed via the `api-token` header and will be stored per session.

```bash
curl -H "api-token: your-token-here" http://localhost:8081/mcp
```

## Customization

### Adding New Tools

To add a new tool to your MCP server, edit `src/mcp-server/index.ts`:

```typescript
server.addTool({
    name: 'yourNewTool',
    description: 'Description of what your tool does',
    parameters: z.object({
        param1: z.string().describe('Description of parameter 1'),
        param2: z.number().describe('Description of parameter 2'),
    }),
    execute: async (args, { session }) => {
        // Your tool logic here
        return 'Tool result';
    },
});
```

### Updating Server Configuration

Edit the server configuration in `src/mcp-server/index.ts`:

```typescript
const server = new FastMCP({
    name: 'your-server-name',
    version: '1.0.0',
    instructions: 'Your server description and instructions',
    // ... other configuration
});
```

## Development

### Running Tests

```bash
npm test
```

### Type Checking

```bash
npm run check
```

### Building

```bash
npm run build
```

## Deployment

The built server can be deployed to any Node.js hosting environment:

1. Build the project: `npm run build`
2. Start the server: `npm start`
3. The server will be available on the configured port

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## Resources

- [Model Context Protocol Specification](https://github.com/modelcontextprotocol)
- [FastMCP Framework](https://github.com/punkpeye/fastmcp)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)