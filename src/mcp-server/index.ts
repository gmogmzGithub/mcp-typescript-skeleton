import { z } from 'zod';
import { FastMCP } from 'fastmcp';

// Simple console logger for demo purposes
const logger = {
    info: (message: string) => console.log(`[INFO] ${message}`),
    debug: (message: string) => console.log(`[DEBUG] ${message}`),
    warn: (message: string) => console.warn(`[WARN] ${message}`),
    error: (message: string | Error) => console.error(`[ERROR] ${message}`),
};

// Template configuration - customize these values for your provider
const serverName = 'mcp-typescript-skeleton';

const McpServer = new FastMCP({
    name: serverName,
    version: '0.1.0',
    instructions:
        'A simple MCP server template with an add tool example.',
    authenticate: async (request) => {
        // Capture session info from headers, including API tokens
        const sessionId =
            (request.headers['mcp-session-id'] as string) ||
            Math.random().toString(36).substring(7);

        const apiToken = request.headers['api-token'] as string;
        if (apiToken) {
            // Store API token for this session
            logger.info(`API token received for session ${sessionId}`);
        }

        return {
            sessionId,
            headers: request.headers,
            apiToken,
        };
    },
});

// Tool: Add two numbers
McpServer.addTool({
    name: 'add',
    description: 'Add two numbers together.',
    parameters: z.object({
        x: z.number().describe('The first number to add'),
        y: z.number().describe('The second number to add'),
    }),
    execute: async ({ x, y }, { session }) => {
        // Example of accessing session data if needed
        const sessionId = session?.sessionId;
        logger.debug(`Add tool called for session ${sessionId}: ${x} + ${y}`);
        return `${x} + ${y} = ${x + y}`;
    },
});

// Export the FastMCP server directly
export { McpServer, serverName };
