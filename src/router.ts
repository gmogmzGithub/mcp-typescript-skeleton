import Router from '@koa/router';
import { McpServer } from './mcp-server';
import { McpProviderController } from './controllers/McpProviderController';

// Simple console logger for demo purposes
const logger = {
    info: (message: string) => console.log(`[INFO] ${message}`),
    warn: (message: string) => console.warn(`[WARN] ${message}`),
    error: (message: string | Error) => console.error(`[ERROR] ${message}`),
};

export const router = new Router();

// Simple request logging middleware
router.use(async (ctx, next) => {
    logger.info(`Incoming request: ${ctx.method} ${ctx.url}`);
    await next();
    logger.info(`Response status: ${ctx.status}`);
});

// Create controller with FastMCP server (using root path)
const McpController = new McpProviderController(
    McpServer,
    '', // Root path - no prefix
    parseInt(process.env.MCP_PORT || '8081', 10) // Port for FastMCP HTTP streaming
);

logger.info(`Registering MCP Server at ${McpController.route}`);
router.use(
    McpController.route,
    McpController.router.routes(),
    McpController.router.allowedMethods()
);

// Export the controller for use in index.ts
export { McpController };

// Log all registered routes
logger.info('Registered routes:');
router.stack.forEach((layer) => {
    logger.info(`${layer.methods.join(',')} ${layer.path}`);
});
