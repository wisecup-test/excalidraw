# Adopt Event-Driven Asynchronous Concurrency Model for State Management: Socket Based Communication

These rules are ALWAYS ACTIVE for all socket-based communication, IndexedDB operations, localStorage operations, state cache management, and event-driven broadcast operations in the codebase.

### Rules

- **R-SOCKET-001** MUST: All socket-based communication operations MUST use event-driven patterns with non-blocking handlers (socket.on, socket.emit) for real-time collaboration features.
- **R-SOCKET-002** MUST: All storage operations (IndexedDB via idb-keyval, localStorage) MUST be implemented as async functions with proper error handling via try-catch blocks or console.warn/console.error.
- **R-SOCKET-003** MUST: All async functions MUST use proper error handling and MUST NOT have floating promises (enforce via ESLint no-floating-promises rule).
- **R-SOCKET-004** SHOULD: Maintain synchronous cache layers (Map, Jotai store) for frequently-accessed state while delegating async persistence operations to background tasks.
- **R-SOCKET-005** SHOULD: Implement socket event handlers during component initialization with cleanup on unmount to prevent memory leaks from unremoved event listeners.
- **R-SOCKET-006** SHOULD: Apply throttling (lodash.throttle) to high-frequency broadcast operations to prevent network congestion while maintaining real-time responsiveness.
- **R-SOCKET-007** MAY: Use AbortController for cancellable async operations to improve resource management and prevent memory leaks from uncompleted async operations.

### Verify

```bash
# Verify socket communication uses event-driven patterns
grep -r 'socket\.on\|socket\.emit' --include='*.tsx' --include='*.ts' excalidraw-app/

# Verify storage operations are async with error handling
grep -r 'async.*function\|await' --include='*.ts' excalidraw-app/data/

# Verify idb-keyval and localStorage usage
grep -r 'idb-keyval\|localStorage' --include='*.ts' excalidraw-app/data/

# Verify no floating promises via ESLint
eslint --rule 'no-floating-promises: error' excalidraw-app/
```

**Accept when:**
- All socket communication uses event-driven patterns (socket.on/emit) without blocking operations
- Storage operations (IndexedDB, localStorage) are implemented as async functions with error handling
- Cache layers provide synchronous access while persistence operations run asynchronously in the background
- No floating promises are detected in the codebase
- Event listeners are properly cleaned up on component unmount
- High-frequency broadcast operations use throttling to prevent network congestion

<enforcement>
Claude Code MUST NOT skip or defer verification. All rules in this file are mandatory for code review and CI pipeline validation. Violations block merge and require tech lead approval with documented justification.
</enforcement>