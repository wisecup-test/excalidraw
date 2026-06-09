# Use console.warn and console.error for Async Storage Operation Error Logging: Storage Implementations Supplement

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The application uses IndexedDB (via idb-keyval) and localStorage for client-side data persistence, requiring error visibility during storage operations
- Asynchronous storage operations (saveFiles, load, loadChats, saveChats) can fail due to quota exceeded errors, network issues, or browser restrictions
- The codebase integrates with @excalidraw/excalidraw components and manages state through appJotaiStore, requiring consistent error handling across storage adapters
- LocalData.ts and TTDStorage.ts implement storage adapters (LocalData, LibraryIndexedDBAdapter, TTDIndexedDBAdapter) that need observable failure modes for debugging

## Problem Statement

When asynchronous storage operations fail in client-side persistence layers, developers and users need immediate visibility into these failures without implementing complex logging infrastructure. The pattern must distinguish between different error severities while maintaining simplicity in the storage adapter implementations.

## Decision

1. MAY: Storage implementations MAY supplement console logging with state management updates (e.g., appJotaiStore.set(localStorageQuotaExceededAtom, true))

## Policy Block

- MAY Storage implementations MAY supplement console logging with state management updates (e.g., appJotaiStore.set(localStorageQuotaExceededAtom, true))

In scope:
- Storage adapter modules in excalidraw-app/data/ directory
- Functions performing IndexedDB operations via idb-keyval
- Functions performing localStorage operations
- Async storage operations: saveFiles, load, loadChats, saveChats
- Error handling blocks within LocalData, LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter, TTDIndexedDBAdapter

Out of scope:
- UI component error display logic
- Network request error logging
- Application initialization errors
- Non-storage related error handling
- Server-side logging mechanisms

## Rationale

- Console-based logging provides immediate visibility in browser developer tools without requiring additional dependencies or infrastructure setup
- The pattern distinguishes between console.error() for critical failures and console.warn() for recoverable issues, enabling appropriate developer response
- This approach aligns with the client-side nature of the application where browser console is the primary debugging interface
- The pattern is consistently applied across multiple storage adapters (LocalData.ts, TTDStorage.ts), indicating an established architectural convention

## Consequences

Positive:
- Developers gain immediate visibility into storage failures during development and debugging
- Browser console provides built-in filtering and stack trace capabilities without custom tooling
- Minimal performance overhead compared to structured logging frameworks
- Simple implementation pattern that is easy to understand and maintain across storage adapters

Negative:
- Console logs are not persisted or aggregated for production monitoring and analytics
- No structured logging format makes automated error analysis difficult
- Console logging in production can expose implementation details to end users
- Limited ability to correlate errors across multiple storage operations or user sessions

## Alternatives

- Implement structured logging library (e.g., winston, pino) with configurable transports (rejected)
  Rejected because: Adds significant dependency overhead for a client-side application where browser console is the primary debugging interface
  When valid: When production error monitoring and aggregation become critical requirements
- Use custom event emitter pattern for error propagation to centralized handler (rejected)
  Rejected because: Increases complexity in storage adapters and requires additional infrastructure for event handling
  When valid: When multiple components need to react to storage errors beyond logging
- Silent error handling with only state updates (e.g., erroredFiles.set, localStorageQuotaExceededAtom) (rejected)
  Rejected because: Eliminates developer visibility during debugging and makes troubleshooting storage issues significantly harder
  When valid: Never recommended; some form of error visibility is always necessary

## Risks

- Console logs in production may expose sensitive error details or implementation information to users inspecting browser console
  Mitigation: Review error messages to ensure no sensitive data is logged; consider environment-based log level configuration
  Owner: Engineering team
- Lack of production error monitoring means storage failures may go unnoticed until users report issues
  Mitigation: Implement complementary error tracking (e.g., Sentry) for production environments while maintaining console logging for development
  Owner: Engineering team
- Inconsistent error logging patterns across different storage adapters may confuse developers
  Mitigation: Document standard error logging patterns and conduct code reviews to ensure consistency
  Owner: Engineering team

## Implementation Notes

- Use console.error() for failures that result in data loss or prevent core functionality (e.g., failed save operations)
- Use console.warn() for recoverable errors or degraded functionality (e.g., failed cache reads that can fall back to network)
- Include the error object as a parameter to console methods to preserve stack traces: console.error('message', error)
- Combine console logging with state management updates (e.g., localStorageQuotaExceededAtom) to enable UI feedback for specific error conditions
- Wrap idb-keyval operations (set, get) in try-catch blocks within async functions to ensure errors are caught and logged

## Continuation Context


Verify commands:
- grep -r "console\.error\|console\.warn" excalidraw-app/data/ --include="*.ts" | grep -E "(saveFiles|load|loadChats|saveChats)" -A 5 -B 5
- grep -r "idb-keyval" excalidraw-app/data/ --include="*.ts" -A 10 | grep -E "console\.(error|warn)"
- find excalidraw-app/data -name "*Storage*.ts" -o -name "*Data.ts" | xargs grep -l "console\.error\|console\.warn"

Accept when:
- All async storage functions (saveFiles, load, loadChats, saveChats) contain console.error or console.warn calls in error handling blocks
- Storage adapter files (LocalData.ts, TTDStorage.ts) demonstrate consistent use of console logging for idb-keyval operation failures
- Error log statements include contextual information about the operation that failed

## Enforcement

- Verified by: Code review checklist requiring console logging in all storage adapter error handlers
- Verified by: Grep-based verification in CI pipeline checking for console.error/warn in storage modules
- Verified by: Manual testing of storage failure scenarios to confirm error visibility in browser console
- Violation handling: Code review feedback requesting addition of appropriate console logging
- Violation handling: CI pipeline warnings when storage adapter files lack error logging patterns
- Violation handling: Documentation updates to reinforce logging requirements for new storage adapters
- Exception process: Exceptions require architectural review if alternative error handling mechanism is proposed
- Exception process: Document rationale in code comments if console logging is intentionally omitted
- Exception process: Update ADR if systematic alternative emerges from exception requests