// The MCP client parts the tests use, resolved from this folder's own node_modules (npm ci here), so the hub itself
// stays free of dependencies. test/astras-pet-os-mcp-test-20261026.mjs imports this file. Claude Opus 5.5, 2026-10-26.
export { Client } from '@modelcontextprotocol/sdk/client/index.js';
export { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
export { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
