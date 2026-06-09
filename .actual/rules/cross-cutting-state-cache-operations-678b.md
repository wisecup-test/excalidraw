# Adopt Event-Driven Asynchronous Concurrency Model for State Management: State Cache Operations

These rules are ALWAYS ACTIVE for all files handling real-time collaboration socket communication, IndexedDB operations, localStorage operations, state cache management, and event-driven broadcast operations for scene synchronization.

### Rules

- **R-STATE-CACHE-001** MUST: State cache operations (broadcastedElementVersions.get/set, appJotaiStore.get/set) MUST be accessed through synchronous getters/setters with async wrappers for I/O operations.
- **R-STATE-CACHE-002** MUST: All socket communication MUST use event-driven patterns (socket.on/emit) without blocking operations.
- **R-STATE-CACHE-003** MUST: Storage operations (IndexedDB, localStorage) MUST be implemented as async functions with error handling via try-catch blocks.
- **R-STATE-CACHE-004** MUST: Cache layers MUST provide synchronous access while persistence operations run asynchronously in the background.
- **R-STATE-CACHE-005** SHOULD: Apply throttling (lodash.throttle) to high-frequency broadcast operations to prevent network congestion while maintaining real-time feel.
- **R-STATE-CACHE-006** SHOULD: Implement proper cleanup in component unmount lifecycle; use AbortController for cancellable async operations.
- **R-STATE-CACHE-007** SHOULD: Implement proper state synchronization with version tracking and use atomic operations for cache updates.

### Verify

```bash
# Verify socket communication uses event-driven patterns
grep -r 'socket\.on\|socket\.emit' --include='*.tsx' --include='*.ts' excalidraw-app/

# Verify storage operations are async with error handling
grep -r 'async.*function\|await' --include='*.ts' excalidraw-app/data/

# Verify idb-keyval and localStorage usage
grep -r 'idb-keyval\|localStorage' --include='*.ts' excalidraw-app/data/

# Verify no synchronous blocking I/O in storage or socket operations
grep -r 'readFileSync\|writeFileSync' --include='*.ts' excalidraw-app/
```

**Accept when:**
- All socket communication uses event-driven patterns (socket.on/emit) without blocking operations
- Storage operations (IndexedDB, localStorage) are implemented as async functions with error handling
- Cache layers provide synchronous access while persistence operations run asynchronously in the background
- No synchronous blocking I/O is detected in storage or socket operations
- High-frequency broadcast operations are throttled to prevent network congestion
- Component lifecycle includes proper cleanup for event listeners and async operations

<enforcement>
Claude Code MUST NOT skip or defer verification. ESLint rules enforcing no-floating-promises and proper async function signatures MUST pass. Code review MUST block merge if synchronous blocking I/O is detected in storage or socket operations. Integration tests MUST validate concurrent operation handling and race condition prevention.
</enforcement>