# Adopt Event-Driven Asynchronous Concurrency Model for State Management: State Cache Operations

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The codebase handles real-time collaborative features requiring asynchronous communication between multiple clients through socket connections (socket.on, socket.emit patterns detected in Portal.tsx)
- State synchronization across distributed clients necessitates non-blocking I/O operations to maintain responsiveness while broadcasting scene updates and handling room events
- Data persistence operations to IndexedDB (idb-keyval) and localStorage require asynchronous handling to avoid blocking the main thread during file saves and library data management
- The application uses event-driven patterns with socket event handlers (init-room, new-user, room-user-change) and async storage operations (saveFiles, load, loadChats, saveChats) to manage concurrent state updates

## Problem Statement

The application requires a consistent approach to handling concurrent operations across real-time collaboration, state synchronization, and data persistence layers. Without a standardized concurrency model, the codebase risks race conditions, blocking operations, and inconsistent state management patterns that could degrade user experience and system reliability.

## Decision

1. MUST: State cache operations (broadcastedElementVersions.get/set, appJotaiStore.get/set) MUST be accessed through synchronous getters/setters with async wrappers for I/O operations

## Policy Block

- MUST State cache operations (broadcastedElementVersions.get/set, appJotaiStore.get/set) MUST be accessed through synchronous getters/setters with async wrappers for I/O operations

In scope:
- Real-time collaboration socket communication (Portal.tsx)
- IndexedDB operations via idb-keyval library
- localStorage operations for application state and library data
- State cache management with Map and Jotai store
- Event-driven broadcast operations for scene synchronization

Out of scope:
- Synchronous computational operations without I/O
- Pure rendering logic and component lifecycle methods
- Utility functions that do not interact with external state or storage
- Static configuration and constant definitions

## Rationale

- The detected pattern shows consistent use of event-driven async patterns across 3 files (Portal.tsx, LocalData.ts, TTDStorage.ts) with 91.07% confidence, indicating an established architectural approach
- Socket-based collaboration requires non-blocking event handlers to maintain real-time responsiveness while handling multiple concurrent client connections
- IndexedDB and localStorage operations are inherently asynchronous in modern browsers, and the codebase correctly uses async/await patterns with idb-keyval library
- The use of cache layers (broadcastedElementVersions Map, appJotaiStore) provides synchronous access to frequently-read state while async operations handle persistence

## Consequences

Positive:
- Non-blocking I/O operations maintain UI responsiveness during data persistence and network communication
- Event-driven socket patterns enable scalable real-time collaboration with multiple concurrent users
- Async storage operations prevent main thread blocking during large file saves or library data operations
- Consistent concurrency model across the codebase improves maintainability and reduces cognitive load for developers

Negative:
- Event-driven async code increases complexity with callback chains and error handling requirements
- Race conditions may occur if state updates are not properly sequenced or synchronized across async boundaries
- Debugging async operations is more challenging than synchronous code, requiring careful logging and error tracking
- Memory management becomes more complex with pending async operations and event listener lifecycle management

## Alternatives

- Synchronous blocking I/O with worker threads for heavy operations (rejected)
  Rejected because: Would block the main thread during storage operations and socket communication, degrading user experience and preventing real-time collaboration responsiveness
  When valid: Only valid for CPU-intensive computational tasks that do not involve I/O or state synchronization
- Promise-based concurrency without event-driven patterns (rejected)
  Rejected because: Socket.io collaboration requires event-driven patterns for bidirectional communication; pure Promise chains would not support the pub/sub model needed for multi-client synchronization
  When valid: Valid for one-off async operations like HTTP requests but insufficient for persistent socket connections
- Reactive streams (RxJS) for all async operations (rejected)
  Rejected because: Would introduce additional library dependency and complexity without significant benefit over native async/await and socket event patterns already in use
  When valid: Valid for complex event composition scenarios with multiple data streams requiring operators like debounce, merge, or switchMap

## Risks

- Race conditions between concurrent async operations updating shared state (broadcastedElementVersions, appJotaiStore)
  Mitigation: Implement proper state synchronization with version tracking and use atomic operations for cache updates; add integration tests for concurrent scenarios
  Owner: Engineering team
- Memory leaks from unremoved event listeners or uncompleted async operations
  Mitigation: Implement proper cleanup in component unmount lifecycle; use AbortController for cancellable async operations; monitor memory usage in production
  Owner: Engineering team
- Error handling gaps in async operations leading to silent failures
  Mitigation: Enforce try-catch blocks in all async functions; implement centralized error logging; add monitoring for storage quota exceeded and socket connection failures
  Owner: Engineering team

## Implementation Notes

- Use idb-keyval library for IndexedDB operations as demonstrated in LocalData.ts and TTDStorage.ts with proper error handling via console.warn/console.error
- Implement socket event handlers during component initialization with cleanup on unmount; use socket.on for incoming events and socket.emit for outgoing broadcasts
- Maintain synchronous cache layers (Map, Jotai store) for frequently-accessed state with async persistence operations delegated to background tasks
- Apply throttling (lodash.throttle) to high-frequency broadcast operations to prevent network congestion while maintaining real-time feel

## Continuation Context


Verify commands:
- grep -r 'socket\.on\|socket\.emit' --include='*.tsx' --include='*.ts' excalidraw-app/
- grep -r 'async.*function\|await' --include='*.ts' excalidraw-app/data/
- grep -r 'idb-keyval\|localStorage' --include='*.ts' excalidraw-app/data/

Accept when:
- All socket communication uses event-driven patterns (socket.on/emit) without blocking operations
- Storage operations (IndexedDB, localStorage) are implemented as async functions with error handling
- Cache layers provide synchronous access while persistence operations run asynchronously in the background

## Enforcement

- Verified by: Code review checking for async/await patterns in storage operations
- Verified by: ESLint rules enforcing no-floating-promises and proper async function signatures
- Verified by: Integration tests validating concurrent operation handling and race condition prevention
- Violation handling: CI pipeline fails on ESLint violations related to promise handling
- Violation handling: Code review blocks merge if synchronous blocking I/O is detected in storage or socket operations
- Violation handling: Runtime monitoring alerts on unhandled promise rejections or socket connection errors
- Exception process: Document technical justification for synchronous operation if truly required
- Exception process: Obtain approval from tech lead with performance impact analysis
- Exception process: Add inline comments explaining exception and link to approval discussion