# Adopt Event-Driven Asynchronous Concurrency Model for State Management: Data Persistence Operations

These rules are ALWAYS ACTIVE for all data persistence operations, real-time collaboration socket communication, and state synchronization code across the application.

### Rules

- **R-ASYNC-001** MUST: Data persistence operations to IndexedDB and localStorage MUST be implemented as asynchronous functions to prevent blocking the main thread.
- **R-ASYNC-002** MUST: All socket communication MUST use event-driven patterns (socket.on/emit) without blocking operations.
- **R-ASYNC-003** MUST: Storage operations (IndexedDB, localStorage) MUST be implemented as async functions with error handling via try-catch blocks or console.warn/console.error.
- **R-ASYNC-004** SHOULD: Maintain synchronous cache layers (Map, Jotai store) for frequently-accessed state while delegating async persistence operations to background tasks.
- **R-ASYNC-005** SHOULD: Apply throttling (lodash.throttle) to high-frequency broadcast operations to prevent network congestion while maintaining real-time feel.
- **R-ASYNC-006** SHOULD: Implement proper cleanup in component unmount lifecycle and use AbortController for cancellable async operations.

### Verify

```bash
# Verify socket communication uses event-driven patterns
grep -r 'socket\.on\|socket\.emit' --include='*.tsx' --include='*.ts' .

# Verify async/await patterns in storage operations
grep -r 'async.*function\|await' --include='*.ts' ./data/

# Verify idb-keyval and localStorage usage
grep -r 'idb-keyval\|localStorage' --include='*.ts' ./data/

# Verify no floating promises
npx eslint . --rule 'no-floating-promises: error'

# Verify proper async function signatures
npx eslint . --rule '@typescript-eslint/no-misused-promises: error'
```

**Accept when:**
- All socket communication uses event-driven patterns (socket.on/emit) without blocking operations
- Storage operations (IndexedDB, localStorage) are implemented as async functions with error handling
- Cache layers provide synchronous access while persistence operations run asynchronously in the background
- No floating promises detected in ESLint analysis
- All async functions have proper error handling with try-catch blocks or .catch() handlers
- High-frequency broadcast operations are throttled to prevent network congestion

<enforcement>
Claude Code MUST NOT skip or defer verification. All rules in this file are mandatory for data persistence and async concurrency patterns. Violations must be caught during code review and CI pipeline checks before merge.
</enforcement>