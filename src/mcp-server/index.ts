import { z } from 'zod';
import { FastMCP } from 'fastmcp';
import { Searcher } from 'fast-fuzzy';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const markdownIt = require('markdown-it');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsdom = require('jsdom');

// API token access is handled by FastMCP authentication

import * as fs from 'fs';
import * as path from 'path';

// Simple console logger for demo purposes
const logger = {
    info: (message: string) => console.log(`[INFO] ${message}`),
    debug: (message: string) => console.log(`[DEBUG] ${message}`),
    warn: (message: string) => console.warn(`[WARN] ${message}`),
    error: (message: string | Error) => console.error(`[ERROR] ${message}`),
};

// Template configuration - customize these values for your provider
const serverName = 'documentation-provider-template';
const documentationPath = path.join(__dirname, 'resources/documentation-source-example.md');
const generalDocsPath = path.join(__dirname, 'resources/general-docs-example.md');

const DocumentationTemplateServer = new FastMCP({
    name: serverName,
    version: '0.1.0',
    instructions:
        'A template MCP provider that demonstrates how to create tools for retrieving and searching documentation. This provider shows how to load markdown files, parse them into searchable sections, and provide tools for querying and listing documentation.',
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
DocumentationTemplateServer.addTool({
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

// Initialize markdown parser
const md = markdownIt();

// Load and parse documentation
logger.debug(`Loading documentation from ${documentationPath}`);
let markdownContents: string;
try {
    markdownContents = fs.readFileSync(documentationPath).toString();
    logger.info('Loaded markdown documentation successfully');
} catch (e) {
    logger.error(`Error reading file from ${documentationPath}: ${e}`);
    markdownContents = '';
}

const markdown = md.render(markdownContents);
const dom = new jsdom.JSDOM(markdown);

type Node = {
    textContent: string;
    nextSibling: Node | null;
    nodeName: string;
};

// Parse documentation sections (assuming h3 headers for sections)
const sections: Node[] = dom.window.document.querySelectorAll('h3');

function getSectionContents(node: Node): string {
    const nodeContents = [];
    nodeContents.push(node.textContent);
    let nodeSibling = node.nextSibling;
    while (nodeSibling && nodeSibling.nodeName.toLowerCase() !== 'h3') {
        nodeContents.push(nodeSibling.textContent);
        nodeSibling = nodeSibling.nextSibling;
    }
    return nodeContents.join('\n');
}

function getSectionBriefDescription(content: string): string {
    const lines = content.split('\n').filter((line) => line.trim());

    // Skip the section name (first line) and look for actual description
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        // Skip lines that just contain "Usage" or other non-descriptive headers
        if (line === 'Usage' || line.length < 10) {
            continue;
        }

        // Found a substantial line that likely contains a description
        return line.substring(0, 150) + (line.length > 150 ? '...' : '');
    }

    // Fallback if no good description found
    return 'Documentation section';
}

function getSectionImport(content: string): string {
    const lines = content.split('\n').filter((line) => line.trim());

    // Find first line that likely contains an import statement
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('import ') && line.includes('from ')) {
            return line;
        }
    }

    // Fallback if no import statement found
    return 'Documentation section';
}

// Build searchable content maps
const sectionContents: Map<string, string> = new Map<string, string>();
const sectionDescriptions: Map<string, string> = new Map<string, string>();
const sectionImports: Map<string, string> = new Map<string, string>();

for (let i = 0; i < sections.length; i++) {
    const sectionName = sections[i].textContent;
    const fullContent = getSectionContents(sections[i]);
    sectionContents.set(sectionName, fullContent);
    sectionDescriptions.set(sectionName, getSectionBriefDescription(fullContent));
    sectionImports.set(sectionName, getSectionImport(fullContent));
}

// Initialize fuzzy search
const fastSearcher = new Searcher(sections, {
    keySelector: (obj) => (obj as Node).textContent,
    threshold: 0.1,
});

function querySections(query: string, n: number = 1): string {
    const preprocessedQuery = query.replace('component', '').trim();
    const results = fastSearcher.search(preprocessedQuery);

    return results
        .slice(0, n)
        .map((result) => sectionContents.get((result as { textContent: string }).textContent))
        .join('\n\n');
}

// Tool 1: Get specific documentation section
DocumentationTemplateServer.addTool({
    name: 'getDocumentation',
    description:
        'Get documentation on specific sections from the documentation provider. This tool demonstrates how to create a searchable documentation tool.',
    parameters: z.object({
        query: z
            .string()
            .describe(
                'The section to retrieve documentation for. The section name must be spelled exactly as it appears in the documentation. Please restrict your query to contain the name of the section you want to find docs for.'
            ),
    }),
    execute: async ({ query }, { session }) => {
        const sessionId = session?.sessionId;
        logger.debug(`Documentation query for session ${sessionId}: ${query}`);
        const content = querySections(query);
        return content;
    },
});

// Tool 2: List all available sections
DocumentationTemplateServer.addTool({
    name: 'listDocumentationSections',
    description:
        'List all available documentation sections with brief descriptions. This tool demonstrates how to create a listing tool.',
    execute: async (args, { session }) => {
        const sessionId = session?.sessionId;
        logger.debug(`List documentation sections for session ${sessionId}`);
        const sectionsWithImports =
            '# Available Documentation Sections\n\n' +
            Array.from(sectionImports.entries())
                .map(([name, importStatement]) => `- **${name}**: ${importStatement}`)
                .join('\n\n');
        return sectionsWithImports;
    },
});

// Tool 3: Get general documentation
DocumentationTemplateServer.addTool({
    name: 'getGeneralDocumentation',
    description:
        'Get the general documentation for the provider. Use this to learn how to use the documentation system and general usage guidelines.',
    execute: async (args, { session }) => {
        const sessionId = session?.sessionId;
        logger.debug(`General documentation request for session ${sessionId}`);
        let generalDocsContents: string;
        try {
            generalDocsContents = fs.readFileSync(generalDocsPath).toString();
            logger.info('Loaded general documentation successfully');
        } catch (e) {
            logger.error(`Error reading file from ${generalDocsPath}: ${e}`);
            generalDocsContents = 'General documentation is not available yet.';
        }
        return generalDocsContents;
    },
});

// Tools are now registered inline above using FastMCP's addTool method

// Export the FastMCP server directly - no need for custom controller
export { DocumentationTemplateServer as DocumentationProvider, serverName };
