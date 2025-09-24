import { Context } from 'koa';
import Router from '@koa/router';
import { FastMCP } from 'fastmcp';

// Simple console logger for demo purposes
const logger = {
    info: (message: string) => console.log(`[INFO] ${message}`),
    warn: (message: string) => console.warn(`[WARN] ${message}`),
    error: (message: string | Error) => console.error(`[ERROR] ${message}`),
};

export type McpProviderControllerOptions = {
    authenticate?: (request: {
        headers: Record<string, string | string[] | undefined>;
    }) => Promise<Record<string, unknown>> | Record<string, unknown>;
};

export type McpProviderControllerResult = {
    controller: (ctx: Context) => Promise<void>;
    router: Router;
};

// Map to store API tokens by sessionId
const apiTokenMap: Map<string, string> = new Map();

// Removed storeApiToken as tokens are now handled in FastMCP authenticate

export function getApiToken(sessionId?: string): string {
    if (!sessionId) {
        throw new Error('Session ID is required but was not provided');
    }

    const token = apiTokenMap.get(sessionId);
    if (token) {
        logger.info(`Found token for session ${sessionId}`);
        return token;
    }
    throw new Error(`No token found for session ${sessionId}`);
}


export class McpProviderController {
    public server: FastMCP;
    public route: string;
    public router: Router;
    public readonly mcpPort: number;

    constructor(server: FastMCP, route: string, port: number) {
        this.server = server;
        this.route = route;
        this.router = new Router();
        this.mcpPort = port;

        logger.info(`Initializing Controller for ${route}`);
        this.setupRoutes();
    }

    private setupRoutes(): void {
        // Health check endpoint
        this.router.get('/health', async (ctx: Context) => {
            ctx.status = 200;
            ctx.body = {
                status: 'healthy',
                server: 'MCP server template',
                route: this.route,
                timestamp: new Date().toISOString(),
            };
        });

        this.router.get('/info', async (ctx: Context) => {
            ctx.status = 200;
            ctx.body = {
                message: 'MCP server template info',
                server: 'MCP server template',
                route: this.route,
                fastmcp_endpoint: 'http://localhost:8081/mcp',
                note: 'Use the FastMCP endpoint for MCP protocol communication',
            };
        });
    }

    public connectToRouter(router: Router): Router {
        logger.info(`Connecting ${this.route} to main router`);
        router.use(this.route, this.router.routes(), this.router.allowedMethods());
        return router;
    }

    public async startFastMCPServer(): Promise<void> {
        logger.info(`Starting Server with HTTP streaming on port ${this.mcpPort}`);

        try {
            await this.server.start({
                transportType: 'httpStream',
                httpStream: {
                    port: this.mcpPort,
                    host: '0.0.0.0',
                    stateless: true,
                },
            });

            logger.info(`✅ Server started successfully on port ${this.mcpPort}`);
            logger.info(
                `HTTP streaming endpoint available at: http://localhost:${this.mcpPort}/mcp`
            );
        } catch (error) {
            logger.error(`Failed to start Server: ${error}`);
            throw error;
        }
    }
}
