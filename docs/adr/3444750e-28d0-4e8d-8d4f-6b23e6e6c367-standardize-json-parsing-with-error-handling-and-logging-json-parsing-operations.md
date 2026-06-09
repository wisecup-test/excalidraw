# Standardize JSON Parsing with Error Handling and Logging: Json Parsing Operations

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The application processes JSON data from multiple sources including localStorage, Firebase, external APIs, and encrypted WebSocket payloads
- JSON parsing operations are distributed across data synchronization (tabSync.ts), Firebase integration (firebase.ts), local storage management (LocalData.ts, localStorage.ts), collaboration features (Collab.tsx), and iframe exports (ExcalidrawPlusIframeExport.tsx)
- The codebase uses core libraries from @excalidraw/excalidraw, @excalidraw/common, and @excalidraw/excalidraw/data/* for data encoding, encryption, and restoration
- Error handling patterns consistently use console.error and console.warn for logging JSON parsing failures and validation errors
- The application implements public API contracts for data persistence (saveToFirebase, loadFromFirebase, importFromLocalStorage) and collaboration (CollabAPI, SocketUpdateData) that require reliable JSON processing

## Problem Statement

JSON parsing operations across the application lack standardized error handling, creating security vulnerabilities through unvalidated input processing and operational risks from silent failures. Without consistent validation and logging patterns, malformed or malicious JSON data from localStorage, Firebase, external APIs, or WebSocket connections can cause runtime errors, data corruption, or security breaches.

## Decision

1. MAY: JSON parsing operations MAY use TextDecoder for binary-to-text conversion before parsing when handling encrypted or encoded payloads

## Policy Block

- MAY JSON parsing operations MAY use TextDecoder for binary-to-text conversion before parsing when handling encrypted or encoded payloads

In scope:
- All JSON.parse() operations in data layer modules (data/*.ts)
- JSON parsing in collaboration and synchronization features (collab/*.tsx, tabSync.ts)
- JSON parsing of localStorage, sessionStorage, and IndexedDB data
- JSON parsing of Firebase responses and encrypted WebSocket payloads
- JSON parsing in iframe export and JWT verification flows
- JSON parsing of external API responses from fetch() calls

Out of scope:
- JSON.stringify() operations (covered by separate serialization standards)
- JSON parsing in third-party libraries (firebase, idb-keyval)
- JSON parsing in test fixtures where controlled input is guaranteed
- JSON schema validation logic (separate concern from parsing safety)

Exceptions:
- EXC-001: JSON parsing occurs in test code with known-good fixtures
- EXC-002: Performance-critical hot paths where input is pre-validated by type guards

## Rationale

- Pattern detected across 7 files with 90.91% confidence, indicating widespread adoption of error-wrapped JSON parsing with logging
- The evidence shows consistent use of console.error/console.warn for JSON parsing failures, establishing an observable pattern for error handling
- Multiple data sources (localStorage, Firebase, WebSocket, external APIs) require uniform parsing safety to prevent injection attacks and data corruption
- The @excalidraw/excalidraw/data/encode and @excalidraw/excalidraw/data/encryption libraries indicate a security-conscious architecture that requires validated JSON processing

## Consequences

Positive:
- Prevents runtime crashes from malformed JSON data in localStorage, Firebase, or WebSocket messages
- Provides observable error logging for debugging JSON parsing failures in production
- Reduces security vulnerabilities by enforcing validation of untrusted JSON input
- Establishes consistent error handling patterns across data layer, collaboration, and storage modules
- Enables graceful degradation with fallback values when JSON parsing fails

Negative:
- Adds boilerplate try-catch blocks to every JSON.parse() call, increasing code verbosity
- May mask data corruption issues if fallback values are used without proper alerting
- Console logging of parsing errors could expose sensitive data if raw input is logged without sanitization
- Performance overhead from exception handling in high-frequency parsing operations (e.g., WebSocket message processing)

## Alternatives

- Use a centralized JSON parsing utility function with built-in error handling and validation (rejected)
  Rejected because: Evidence shows inline try-catch patterns rather than centralized utilities, suggesting team preference for explicit error handling at call sites
  When valid: Valid for new greenfield projects or during major refactoring initiatives
- Adopt a JSON schema validation library (e.g., Zod, Yup) for runtime type checking (deferred)
  Rejected because: No evidence of schema validation libraries in the detected pattern; would require additional dependencies and migration effort
  When valid: Valid when type safety requirements increase or when migrating to TypeScript strict mode
- Allow JSON.parse() without error handling in trusted internal data flows (rejected)
  Rejected because: Security best practices require defense-in-depth; localStorage and Firebase data can be manipulated by users or browser extensions
  When valid: Never valid for production code; acceptable only in isolated test environments

## Risks

- Inconsistent application of error handling across existing codebase, leaving gaps in JSON parsing safety
  Mitigation: Implement linting rules to detect unwrapped JSON.parse() calls and conduct codebase audit
  Owner: Engineering team
- Sensitive data exposure through verbose error logging of raw JSON input
  Mitigation: Sanitize or truncate logged values; implement log filtering for production environments
  Owner: Security team
- Silent failures with fallback values may hide data integrity issues
  Mitigation: Implement monitoring and alerting for JSON parsing error rates; use structured logging for error tracking
  Owner: Operations team

## Implementation Notes

- Wrap all JSON.parse() calls in try-catch blocks with console.error() or console.warn() in the catch clause
- Include contextual information in error logs: data source (localStorage key, Firebase path, API endpoint), operation name, and truncated input
- For localStorage operations, provide fallback values (e.g., JSON.parse(localStorage.getItem(key) || '{}')) to handle missing or corrupt data
- Use TextDecoder for binary-to-text conversion before parsing encrypted or encoded payloads from WebSocket or Firebase
- Import validation utilities from @excalidraw/excalidraw/data/json for post-parse structure validation
- Consider implementing a parseJSON utility function that encapsulates error handling and logging for reuse across modules

## Continuation Context


Verify commands:
- grep -rn 'JSON\.parse' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -v 'try' | grep -v 'catch' | wc -l
- grep -rn 'JSON\.parse' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -A5 'catch' | grep -c 'console\.error\|console\.warn'
- eslint excalidraw-app/ --rule 'no-unsafe-json-parse: error' --format compact

Accept when:
- All JSON.parse() calls in data/, collab/, and app-level modules are wrapped in try-catch blocks
- Error logging (console.error or console.warn) is present in 100% of JSON parsing catch blocks
- Linting rules detect and flag unwrapped JSON.parse() operations in CI pipeline
- Code review checklist includes verification of JSON parsing error handling for new data layer code

## Enforcement

- Verified by: ESLint custom rule to detect unwrapped JSON.parse() calls
- Verified by: Code review checklist item for JSON parsing error handling
- Verified by: Automated grep-based verification in CI pipeline
- Verified by: Static analysis tools scanning for try-catch patterns around JSON.parse()
- Violation handling: CI pipeline fails if unwrapped JSON.parse() calls are detected in modified files
- Violation handling: Code review blocks merge until error handling is added
- Violation handling: Security team notified for violations in security-critical modules (authentication, encryption, external API integration)
- Violation handling: Technical debt ticket created for existing violations with priority based on data source trust level
- Exception process: Submit exception request to architecture review board with justification and risk assessment
- Exception process: Provide evidence of alternative validation mechanism (e.g., TypeScript type guards, schema validation)
- Exception process: Document exception in code comments with approval reference and expiration date
- Exception process: Re-review exceptions quarterly to assess if they can be removed