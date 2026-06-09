# Adopt Jotai Atom-Based State Management with IndexedDB Persistence: Event Driven Boundaries

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The application requires client-side state management with persistent storage capabilities across browser sessions, as evidenced by the use of appJotaiStore with atoms like localStorageQuotaExceededAtom
- Multiple data layers (LocalData, TTDStorage, Portal) need coordinated caching and synchronization mechanisms, utilizing idb-keyval for IndexedDB operations and in-memory caches like broadcastedElementVersions
- The architecture supports real-time collaboration features with socket-based event-driven boundaries, requiring efficient state updates and broadcasts
- The codebase integrates @excalidraw/excalidraw core libraries with custom data persistence adapters (LibraryIndexedDBAdapter, TTDIndexedDBAdapter) for managing application state and user data

## Problem Statement

The application needs a consistent paradigm for managing client-side state that supports both ephemeral in-memory caching and durable persistence, while coordinating between multiple data layers (collaboration state, local files, TTD chats) and maintaining compatibility with the @excalidraw/excalidraw library ecosystem.

## Decision

1. SHOULD: Event-driven boundaries SHOULD use socket.on/emit patterns for real-time collaboration features with appropriate event types (init-room, new-user, room-user-change)

## Policy Block

- SHOULD Event-driven boundaries SHOULD use socket.on/emit patterns for real-time collaboration features with appropriate event types (init-room, new-user, room-user-change)

## Rationale

- The pattern demonstrates a mature state management architecture with 91.07% confidence across 3 files, indicating consistent adoption of Jotai atoms and IndexedDB persistence
- Using idb-keyval provides a simplified Promise-based API over raw IndexedDB, reducing complexity while maintaining full persistence capabilities
- The versioned cache layer (broadcastedElementVersions) enables efficient delta synchronization for collaborative features without re-broadcasting unchanged elements
- Standardized adapter interfaces (LibraryIndexedDBAdapter, TTDIndexedDBAdapter) provide clear separation of concerns between different data domains while maintaining consistent persistence patterns

## Consequences

Positive:
- Reactive state updates through Jotai atoms enable efficient component re-rendering and cross-component coordination
- IndexedDB persistence provides robust client-side storage with significantly higher quota limits than localStorage
- Versioned caching reduces network overhead in collaborative scenarios by tracking element versions and avoiding redundant broadcasts
- Standardized adapter pattern enables easy extension for new data domains while maintaining consistent error handling and logging

Negative:
- Jotai introduces an additional state management dependency beyond React's built-in state primitives
- IndexedDB operations are asynchronous, adding complexity compared to synchronous localStorage access
- Multiple cache layers (in-memory Maps, Jotai atoms, IndexedDB) increase cognitive overhead for developers understanding data flow
- Storage quota errors require explicit handling and user notification, adding error recovery complexity

## Alternatives

- Use Redux with redux-persist for state management and persistence (rejected)
  Rejected because: Redux introduces more boilerplate and complexity than Jotai's atomic state model, and the codebase already integrates with @excalidraw/excalidraw which uses Jotai internally
  When valid: For applications requiring time-travel debugging or complex middleware chains
- Use localStorage exclusively for all persistence needs (rejected)
  Rejected because: localStorage has strict quota limits (typically 5-10MB) insufficient for storing drawing data, files, and chat history, as evidenced by explicit quota exceeded handling in the code
  When valid: For applications with minimal data storage requirements under 5MB
- Use React Context API with custom persistence hooks (rejected)
  Rejected because: Context API lacks the granular reactivity and atomic updates provided by Jotai, leading to unnecessary re-renders in complex component trees
  When valid: For simpler applications without fine-grained state update requirements

## Risks

- IndexedDB quota exceeded errors may cause data loss if not properly handled
  Mitigation: Implement localStorageQuotaExceededAtom to track quota state, display user warnings, and maintain erroredFiles set to prevent retry loops
  Owner: engineering team
- Browser compatibility issues with IndexedDB in private browsing or older browsers
  Mitigation: Wrap all IndexedDB operations in try-catch blocks with console.warn fallbacks, and provide graceful degradation to in-memory-only mode
  Owner: engineering team
- State synchronization conflicts between in-memory cache and IndexedDB persistence layer
  Mitigation: Use versioned element tracking (broadcastedElementVersions) and implement clear load/save boundaries in adapter interfaces
  Owner: engineering team

## Implementation Notes

- Create new data domains by implementing adapter classes with load/save methods following the pattern of LibraryIndexedDBAdapter and TTDIndexedDBAdapter
- Use appJotaiStore.get() and appJotaiStore.set() for synchronous atom access outside React components; use useAtom hooks within components
- Wrap all IndexedDB operations with try-catch blocks and log errors using console.warn or console.error for debugging
- Implement version tracking for collaborative features using Map structures with element.id as key and element.version as value

## Continuation Context


Verify commands:
- grep -r 'appJotaiStore\.(get|set)' --include='*.ts' --include='*.tsx' excalidraw-app/
- grep -r 'idb-keyval' --include='*.ts' --include='*.tsx' excalidraw-app/data/
- grep -r 'broadcastedElementVersions\.(get|set)' --include='*.ts' --include='*.tsx' excalidraw-app/

Accept when:
- All data persistence modules use idb-keyval for IndexedDB operations with proper error handling
- State coordination uses Jotai atoms accessed via appJotaiStore for cross-component reactivity
- Cache layers implement versioned tracking using Map structures for synchronization state

## Enforcement

- Verified by: Code review checks for proper use of Jotai atoms and idb-keyval in new data persistence code
- Verified by: Automated grep-based verification in CI pipeline to ensure consistent patterns
- Verified by: Architecture review for new data domains to validate adapter interface compliance
- Violation handling: Pull requests introducing alternative state management patterns require architecture team approval
- Violation handling: Direct localStorage usage for large data must be flagged and migrated to IndexedDB
- Violation handling: Missing error handling for IndexedDB operations must be added before merge
- Exception process: Document technical justification for alternative approach in ADR format
- Exception process: Obtain approval from architecture team for exceptions to standard patterns
- Exception process: Add inline comments explaining why standard pattern cannot be used