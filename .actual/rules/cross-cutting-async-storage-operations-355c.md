# Adopt Event-Driven Asynchronous Concurrency Model for State Management: Async Storage Operations

These rules are ALWAYS ACTIVE for all async storage operations, real-time collaboration socket communication, and state synchronization code across the application.

### Rules

- **R-ASYNC-001** SHOULD: Async storage operations (saveFiles, load, loadChats, saveChats) SHOULD implement error handling with console.error or console.warn for debugging.

### Verify

```bash
# Verify socket communication uses event-driven patterns
grep -r 'socket\.on\|socket\.emit' --include='*.tsx' --include='*.ts' excalidraw-app/

# Verify async/await patterns in storage operations
grep -r 'async.*function\|await' --include='*.ts' excalidraw-app/data/

# Verify idb-keyval and localStorage usage
grep -r 'idb-keyval\|localStorage' --include='*.ts' excalidraw-app/data/
```

**Accept when:**
- All socket communication uses event-driven patterns (socket.on/emit) without blocking operations
- Storage operations (IndexedDB, localStorage) are implemented as async functions with error handling
- Cache layers provide synchronous access while persistence operations run asynchronously in the background
- Error handling is present in async storage operations via console.error or console.warn

<enforcement>
Claude Code MUST NOT skip or defer verification of async storage operations and socket communication patterns. All async functions handling storage or state synchronization MUST include error handling with console.error or console.warn.
</enforcement>