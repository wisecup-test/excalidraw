# Standardize console-based logging for public API error handling and debugging: Public Not Silently

These rules are ALWAYS ACTIVE for all public API functions and external integration points across the codebase, including data synchronization, Firebase integration, iframe exports, and collaborative features.

### Rules

- **R-PUBLIC-001** MUST_NOT: Public APIs MUST NOT silently swallow errors in external integrations without logging; all caught exceptions in public API boundaries must be observable through console output.
- **R-PUBLIC-002** MUST: All functions exported as public API contracts that interact with external systems (Firebase, fetch, WebSocket, browser storage) MUST include error logging with `console.error` in catch blocks.
- **R-PUBLIC-003** MUST: JSON parsing operations in public API entry points MUST be wrapped in try-catch blocks with error logging that includes context about the parsing failure.
- **R-PUBLIC-004** MUST: Error log messages MUST include sufficient context (operation name, relevant IDs, error details) to support troubleshooting and root cause analysis.
- **R-PUBLIC-005** SHOULD: Use template literals to construct descriptive error messages: `console.error(\`Failed to ${operation}: ${error.message}\`, { context })`.
- **R-PUBLIC-006** SHOULD: Distinguish between error severities using appropriate console methods: `console.error` for failures, `console.warn` for recoverable issues or deprecations, `console.info` for debug information.
- **R-PUBLIC-007** SHOULD: Include relevant identifiers in log messages (user IDs, document IDs, socket IDs) to enable correlation across distributed operations.
- **R-PUBLIC-008** MAY: Production builds may suppress `console.info` debug logging for performance optimization via build-time configuration.
- **R-PUBLIC-009** MAY: Structured logging libraries (e.g., Winston, Pino) may be used instead of console methods if they provide equivalent observability and are documented as exceptions.

### Verify

```bash
# Count console.error usage in public API files
grep -r 'console\.error' --include='*.ts' --include='*.tsx' excalidraw-app/ packages/ | wc -l

# Find catch blocks without console logging in data integration files
grep -r 'catch.*{' --include='*.ts' --include='*.tsx' excalidraw-app/data/ | grep -v 'console\.' | head -5

# Find JSON.parse operations without error logging
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -L 'console\.error\|console\.warn'

# Verify public API functions have error handling
grep -r 'export.*function\|export const.*=' --include='*.ts' --include='*.tsx' excalidraw-app/ | head -20
```

**Accept when:**
- All public API functions that interact with external systems (Firebase, fetch, WebSocket) include error logging with `console.error` in catch blocks
- JSON parsing operations in public APIs are wrapped in try-catch with error logging that includes context about the parsing failure
- No silent error swallowing detected in public API boundaries—all caught exceptions produce observable console output
- Error log messages include sufficient context (operation name, relevant IDs, error details) to support troubleshooting
- Sensitive data (tokens, passwords, PII) is not exposed in error log messages; sanitization is applied where necessary
- High-frequency API calls implement throttling or production-mode log suppression to avoid performance degradation

<enforcement>
Clause Code MUST NOT skip or defer verification of these rules. All public API functions must be reviewed for compliance with R-PUBLIC-001 through R-PUBLIC-009 before merge. Violations must be addressed through code review rejection or follow-up PRs with documented exceptions approved by the architecture team.
</enforcement>