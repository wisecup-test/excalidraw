# Adopt Event-Driven Asynchronous Concurrency Model for State Management: Event Handlers Socket

These rules are ALWAYS ACTIVE for all files handling real-time collaboration socket communication, IndexedDB operations, localStorage operations, state cache management, and event-driven broadcast operations for scene synchronization.

### Rules

- **R-ASYNC-001** SHOULD: Event handlers for socket events (init-room, new-user, room-user-change) SHOULD be registered during initialization and handle errors gracefully with appropriate logging.

### Verify

```bash
# Verify socket event-driven patterns are used without blocking operations
grep -r 'socket\.on\|socket\.emit' --include='*.tsx' --include='*.ts' excalidraw-app/

# Verify storage operations are implemented as async functions
grep -r 'async.*function\|await' --include='*.ts' excalidraw-app/data/

# Verify idb-keyval and localStorage usage patterns
grep -r 'idb-keyval\|localStorage' --include='*.ts' excalidraw-app/data/
```

**Accept when:**
- All socket communication uses event-driven patterns (socket.on/emit) without blocking operations
- Storage operations (IndexedDB, localStorage) are implemented as async functions with error handling
- Cache layers provide synchronous access while persistence operations run asynchronously in the background
- Event handlers include error handling with appropriate logging (console.warn/console.error)
- Socket event handlers are properly cleaned up on component unmount

<enforcement>
Clause Code MUST NOT skip or defer verification. Code review MUST check for async/await patterns in storage operations. ESLint rules MUST enforce no-floating-promises and proper async function signatures. Integration tests MUST validate concurrent operation handling and race condition prevention. CI pipeline MUST fail on ESLint violations related to promise handling. Code review MUST block merge if synchronous blocking I/O is detected in storage or socket operations.
</enforcement>