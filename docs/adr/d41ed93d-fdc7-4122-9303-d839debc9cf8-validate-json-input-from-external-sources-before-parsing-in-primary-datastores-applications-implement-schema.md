# Validate JSON Input from External Sources Before Parsing in Primary Datastores: Applications Implement Schema

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The application integrates with Firebase as a primary datastore and handles data synchronization across multiple clients through WebSocket connections
- External data sources include environment variables (VITE_APP_FIREBASE_CONFIG), remote API endpoints (BACKEND_V2_GET, BACKEND_V2_POST), and encrypted WebSocket payloads that require JSON parsing
- The codebase uses multiple storage layers including Firebase transactions, IndexedDB (idb-keyval), localStorage, and in-memory caches (FirebaseSceneVersionCache, filesMap) that all consume parsed JSON data
- Data flows through encryption/decryption pipelines using @excalidraw/excalidraw/data/encryption before being parsed, introducing additional points where malformed JSON could cause runtime failures
- The application implements collaborative features where untrusted user input arrives via socket.on('client-broadcast') events and must be safely deserialized

## Problem Statement

When integrating primary datastores with external data sources, the application must safely parse JSON from untrusted sources including environment variables, HTTP responses, localStorage, and encrypted WebSocket payloads. Without proper input validation and error handling around JSON.parse() operations, malformed or malicious JSON can cause runtime exceptions, data corruption, or security vulnerabilities that compromise the integrity of the datastore layer and collaborative synchronization mechanisms.

## Decision

1. MAY: Applications MAY implement schema validation libraries to validate parsed JSON structure beyond basic parse success

## Policy Block

- MAY Applications MAY implement schema validation libraries to validate parsed JSON structure beyond basic parse success

In scope:
- JSON.parse() calls on data from environment variables (import.meta.env.VITE_APP_FIREBASE_CONFIG)
- JSON.parse() calls on HTTP response bodies from external APIs (fetch responses from BACKEND_V2_GET, Firebase Storage)
- JSON.parse() calls on localStorage data (LSData from LocalData)
- JSON.parse() calls on decrypted WebSocket payloads (client-broadcast events)
- JSON.parse() calls on decoded data from URL parameters or share links (decodedBuffer, decodedData)

Out of scope:
- JSON.parse() of hardcoded string literals in test files
- JSON.stringify() operations (serialization is out of scope)
- Parsing of JSON from trusted internal modules that have already been validated
- Third-party library internal JSON parsing (unless exposed through public API contracts)

## Rationale

- The IR evidence shows consistent patterns of JSON.parse() wrapped in try-catch blocks with console.warn/console.error logging across 4 files (firebase.ts, index.ts, LocalData.ts, Collab.tsx) with 90.70% confidence, indicating this is an established architectural pattern
- The application's architecture relies on multiple external data sources (Firebase, HTTP APIs, WebSockets, localStorage) where JSON format cannot be guaranteed, making defensive parsing essential for system stability
- The collaborative real-time features expose the application to untrusted user input through WebSocket broadcasts, requiring validation to prevent malicious payloads from corrupting shared state or cache layers
- Error logging with context (as seen in 'Error JSON parsing firebase config. Supplied value: ${import.meta.env.VITE_APP_FIREBASE_CONFIG}') provides operational visibility into data quality issues and potential security incidents

## Consequences

Positive:
- Prevents runtime crashes from malformed JSON in environment configuration, API responses, or user-generated content
- Provides operational visibility through error logging, enabling detection of data quality issues or potential security attacks
- Maintains system stability in collaborative scenarios where multiple clients may send corrupted or malicious data
- Enables graceful degradation when external data sources provide invalid JSON rather than complete application failure

Negative:
- Adds boilerplate try-catch blocks around every JSON.parse() operation, increasing code verbosity
- Error logging may expose sensitive data in logs if not carefully implemented (e.g., logging full payloads)
- Silent error handling without proper fallback logic could mask data corruption issues rather than surfacing them
- Performance overhead from exception handling in high-frequency parsing scenarios (e.g., WebSocket message processing)

## Alternatives

- Use a JSON schema validation library (e.g., Zod, Yup, Ajv) to validate structure after parsing (deferred)
  Rejected because: Not rejected, but evidence shows only basic try-catch patterns without schema validation libraries in the detected code
  When valid: When stronger type safety guarantees are needed or when migrating to TypeScript with runtime validation
- Allow JSON.parse() to throw uncaught exceptions and rely on global error handlers (rejected)
  Rejected because: Would cause application crashes and poor user experience; contradicts the established pattern of explicit error handling seen in all 4 evidence files
  When valid: Never valid for production code handling external data sources
- Create a centralized safe JSON parsing utility function that wraps try-catch logic (deferred)
  Rejected because: Not rejected, but evidence shows inline try-catch blocks rather than a shared utility; could be a future refactoring
  When valid: When reducing code duplication becomes a priority or when standardizing error handling behavior across the codebase

## Risks

- Inconsistent error handling across the codebase where some JSON.parse() calls lack try-catch protection
  Mitigation: Implement linting rules or static analysis to detect unprotected JSON.parse() calls; conduct code review focused on datastore integration points
  Owner: Engineering team
- Error logging may inadvertently expose sensitive data (API keys, user content, encryption keys) in console output or log aggregation systems
  Mitigation: Sanitize logged values to exclude sensitive fields; use structured logging with explicit field inclusion rather than logging entire payloads
  Owner: Security team
- Silent failures in error handlers could mask data corruption or security incidents if fallback behavior is not properly implemented
  Mitigation: Ensure error handlers include appropriate fallback logic (e.g., returning default values, triggering user notifications); monitor error rates in production
  Owner: Engineering team

## Implementation Notes

- Wrap all JSON.parse() calls on external data with try-catch blocks, logging errors with console.error() or console.warn() and including context about the data source
- For Firebase configuration parsing, validate that required fields exist after parsing before initializing Firebase services
- In WebSocket event handlers (socket.on), validate the structure of decrypted JSON payloads before updating cache layers (FirebaseSceneVersionCache.cache.set, filesMap.set) or triggering state updates
- For localStorage data (LSData), implement fallback to empty/default state when JSON.parse() fails to prevent application initialization failures

## Continuation Context


Verify commands:
- grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' excalidraw-app/data excalidraw-app/collab | grep -v 'try' | wc -l
- grep -r 'JSON\.parse.*import\.meta\.env' --include='*.ts' --include='*.tsx' -A 5 | grep -c 'catch'
- grep -r 'socket\.on.*client-broadcast' --include='*.tsx' -A 20 | grep 'JSON\.parse' | wc -l

Accept when:
- All JSON.parse() operations on external data sources (environment variables, HTTP responses, localStorage, WebSocket payloads) are wrapped in try-catch blocks
- Error handlers log parsing failures with context using console.error() or console.warn()
- No unprotected JSON.parse() calls exist in datastore integration code (firebase.ts, LocalData.ts, Collab.tsx, index.ts)

## Enforcement

- Verified by: Code review checklist requiring try-catch blocks around JSON.parse() in datastore integration code
- Verified by: Static analysis or ESLint custom rule detecting unprotected JSON.parse() calls on external data
- Verified by: Manual audit of files in data/ and collab/ directories for JSON parsing patterns
- Violation handling: Pull requests with unprotected JSON.parse() calls on external data sources are rejected during code review
- Violation handling: Static analysis failures block CI pipeline until violations are resolved
- Violation handling: Runtime exceptions from unhandled JSON parsing errors trigger incident response and post-mortem analysis
- Exception process: Exceptions may be granted for JSON.parse() of hardcoded literals or trusted internal data with explicit code comments justifying the exception
- Exception process: Exception requests must be reviewed by a senior engineer and documented in code comments
- Exception process: All exceptions must be tracked in a technical debt register for future remediation