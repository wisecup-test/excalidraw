# Standardize console-based logging for public API error handling and debugging: Public Functions That

These rules are ALWAYS ACTIVE for all public API functions that interact with external systems (Firebase, fetch, WebSocket, browser storage, JWT verification, encryption/decryption) across the codebase.

### Rules

- **R-PUBAPI-001** MUST: All public API functions that interact with external systems (Firebase, fetch, WebSocket) MUST log errors using console.error when operations fail.
- **R-PUBAPI-002** MUST: JSON parsing operations in public APIs MUST be wrapped in try-catch blocks with error logging that includes context about the parsing failure.
- **R-PUBAPI-003** MUST: No silent error swallowing in public API boundaries—all caught exceptions MUST produce observable console output.
- **R-PUBAPI-004** SHOULD: Error log messages SHOULD include sufficient context (operation name, relevant IDs, error details) to support troubleshooting.
- **R-PUBAPI-005** SHOULD: Use template literals to construct descriptive error messages: `console.error(\`Failed to ${operation}: ${error.message}\`, { context })`.
- **R-PUBAPI-006** SHOULD: Distinguish between error severities: console.error for failures, console.warn for recoverable issues or deprecations, console.info for debug information.
- **R-PUBAPI-007** MAY: Production builds may suppress console.info debug logging for performance optimization (EXC-001).
- **R-PUBAPI-008** MAY: Structured logging libraries (e.g., Winston, Pino) may be used instead of console methods if they provide equivalent observability (EXC-002).

### Verify

```bash
# Count console.error usage in public API files
grep -r 'console\.error' --include='*.ts' --include='*.tsx' excalidraw-app/ packages/ | wc -l

# Find catch blocks without console logging in data modules
grep -r 'catch.*{' --include='*.ts' --include='*.tsx' excalidraw-app/data/ | grep -v 'console\.' | head -5

# Find JSON.parse operations without error logging
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -L 'console\.error\|console\.warn'
```

**Accept when:**
- All public API functions that interact with external systems (Firebase, fetch, WebSocket) include error logging with console.error in catch blocks
- JSON parsing operations in public APIs are wrapped in try-catch with error logging that includes context about the parsing failure
- No silent error swallowing detected in public API boundaries—all caught exceptions produce observable console output
- Error log messages include sufficient context (operation name, relevant IDs, error details) to support troubleshooting
- Logging follows consistent patterns across all 12 identified public API files with 90.31% consistency maintained

<enforcement>
Claude Code MUST NOT skip or defer verification of these rules. All public API functions must be inspected for proper error logging before approval. Code review checklist MUST include verification that external system interactions include console.error logging. Static analysis with ESLint rules MUST detect empty catch blocks or missing console statements in API error handlers.
</enforcement>