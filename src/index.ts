/**
 * Environment Variables Support:
 * - PORT: Server port (default: 8080)
 * - NODE_ENV: Node.js environment
 * - MCP_PORT: MCP server port (default: 8081)
 */

import Koa from 'koa';
import { router, DocumentationProviderController } from './router';
import bodyParser from 'koa-bodyparser';
import proxy = require('koa-proxies');

const serviceName = 'mcp-typescript-skeleton';

// Simple console logger for demo purposes
const logger = {
    info: (message: string) => console.log(`[INFO] ${message}`),
    warn: (message: string) => console.warn(`[WARN] ${message}`),
    error: (message: string | Error) => console.error(`[ERROR] ${message}`),
};

const main = async (): Promise<void> => {
    try {
        const app = new Koa();

        app.use(
            proxy('/mcp', () => ({
                target: `http://127.0.0.1:${DocumentationProviderController.mcpPort}/mcp`,
                changeOrigin: true,
                ws: true,
                ignorePath: true,
            }))
        );

        app.use(bodyParser());

        app.use(router.routes());
        app.use(router.allowedMethods());

        // Simplified port determination
        const port = Number(process.env.PORT) || 8080;

        app.listen(port);

        // Start server with HTTP streaming on a separate port
        try {
            await DocumentationProviderController.startFastMCPServer();
        } catch (error) {
            logger.error(`Failed to start MCP server: ${error}`);
            // Continue without FastMCP server
        }

        const envLevel = process.env.NODE_ENV || 'development';

        logger.info(`App has started in ${envLevel} mode`);
        logger.info('✅ SERVER SUCCESSFULLY STARTED');
        logger.info(`✅ Main server is running at http://localhost:${port}/`);
        logger.info('Available endpoints:');
        logger.info(`- Main API: http://localhost:${port}/`);
        logger.info(`- Health Check: http://localhost:${port}/health`);
        logger.info(`- Server Info: http://localhost:${port}/info`);
        logger.info(`- HTTP Streaming: http://localhost:${port}/mcp ⭐`);

        // Log SSE deprecation warning at startup
        logger.warn('⚠️  SSE TRANSPORT DEPRECATION WARNING ⚠️');
        logger.warn(
            'The Server-Sent Events (SSE) transport has been officially DEPRECATED. Please use Streamable HTTP instead.'
        );
        logger.warn(
            'SSE connections may drop intermittently and are not suitable for production use.'
        );
    } catch (error) {
        logger.error('Error during application startup:');
        logger.error(error instanceof Error ? error.stack || error.message : String(error));
        process.exit(1);
    }
};

main().catch((error) => {
    logger.error('App has failed to start!');
    logger.error(
        typeof error === 'string'
            ? error
            : JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    );
    process.exit(1);
});