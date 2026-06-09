# Validate JSON Input from External Sources Before Parsing: Json Parsing Errors

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The application handles JSON data from multiple external sources including localStorage, environment variables (VITE_APP_FIREBASE_CONFIG), network responses (fetch API), and encrypted WebSocket payloads
- JSON.parse() is used extensively across 7 files to deserialize data from browser storage (localStorage.getItem), Firebase configuration, decoded buffers, and decrypted collaboration data
- The codebase uses @excalidraw/excalidraw libraries for data encoding, encryption, and element management, requiring frequent serialization/deserialization of scene data and application state
- Error handling patterns show defensive programming with try-catch blocks and console.error/console.warn logging around JSON parsing operations, indicating awareness of potential parsing failures
- The application implements real-time collaboration features using WebSocket communication (portal.socket) with encrypted payloads that must be decrypted and parsed before use

## Problem Statement

JSON parsing operations on untrusted or external data sources can fail catastrophically if the input is malformed, corrupted, or maliciously crafted. Without proper validation and error handling, JSON.parse() throws exceptions that can crash application features, expose sensitive error information, or create security vulnerabilities through injection attacks. The application needs a consistent approach to safely parse JSON from localStorage, network responses, environment variables, and encrypted payloads while maintaining system stability and security.

## Decision

1. MUST_NOT: JSON parsing errors MUST NOT expose sensitive information such as encryption keys, tokens, or internal system details in error messages

## Policy Block

- MUST_NOT JSON parsing errors MUST NOT expose sensitive information such as encryption keys, tokens, or internal system details in error messages

In scope:
- JSON.parse() operations on localStorage data
- JSON.parse() operations on environment variables (import.meta.env)
- JSON.parse() operations on network response bodies from fetch() calls
- JSON.parse() operations on decoded or decrypted data buffers
- JSON.parse() operations on WebSocket message payloads
- JSON parsing of user-provided or external configuration data

Out of scope:
- JSON.parse() operations on hardcoded string literals in source code
- JSON.parse() operations on data generated entirely within the same function scope
- JSON serialization operations (JSON.stringify)
- Non-JSON data parsing (XML, YAML, etc.)

Exceptions:
- EXC-001: JSON data is generated and consumed within the same trusted module with no external input
- EXC-002: Performance-critical paths where parsing failure is handled by upstream validation

## Rationale

- The evidence shows 7 files with JSON.parse() operations on external data sources including localStorage (tabSync.ts, LocalData.ts, localStorage.ts), environment variables (firebase.ts), network responses (firebase.ts, index.ts), and decrypted payloads (Collab.tsx, ExcalidrawPlusIframeExport.tsx)
- Existing error handling patterns with console.error() and console.warn() demonstrate that the development team has already encountered JSON parsing failures and implemented defensive measures
- The application's collaboration features rely on encrypted WebSocket communication where malformed or corrupted data could cause parsing failures that disrupt real-time synchronization
- Pattern detected across 90.91% confidence with 7 supporting files indicates this is an established architectural practice that should be formalized and consistently applied

## Consequences

Positive:
- Prevents application crashes and feature failures caused by malformed JSON data from external sources
- Improves debugging and troubleshooting through consistent error logging with contextual information
- Reduces security vulnerabilities by preventing JSON injection attacks and limiting exposure of sensitive data in error messages
- Enhances user experience by providing graceful degradation and fallback behavior when data parsing fails
- Creates a consistent pattern across the codebase that is easier to review, test, and maintain

Negative:
- Adds boilerplate code with try-catch blocks around every JSON.parse() operation, increasing code verbosity
- May mask underlying data corruption issues if fallback values are used too liberally without investigating root causes
- Requires additional testing effort to verify error handling paths and fallback behaviors
- Could impact performance slightly due to exception handling overhead in parsing-heavy operations

## Alternatives

- Use a JSON schema validation library (e.g., Zod, Yup, Ajv) to validate all parsed JSON against defined schemas (deferred)
  Rejected because: null
  When valid: Consider for future enhancement when type safety requirements increase or when migrating to TypeScript strict mode with runtime validation
- Create centralized parsing utilities that wrap JSON.parse() with validation and error handling (accepted)
  Rejected because: null
  When valid: Recommended as a complementary approach to reduce boilerplate and ensure consistent error handling patterns
- Allow JSON.parse() to throw exceptions and rely on global error handlers to catch parsing failures (rejected)
  Rejected because: Global error handlers cannot provide context-specific fallback behavior or appropriate recovery strategies for different data sources. This approach would result in poor user experience and difficult debugging.
  When valid: Never appropriate for production code handling external data sources

## Risks

- Developers may forget to add try-catch blocks around new JSON.parse() operations, creating inconsistent error handling
  Mitigation: Implement ESLint rules or static analysis to detect unprotected JSON.parse() calls. Add code review checklist items for JSON parsing operations.
  Owner: Engineering team and security reviewers
- Overly permissive fallback values may hide data corruption or configuration errors that should be surfaced to users or administrators
  Mitigation: Log all parsing failures with appropriate severity levels. Implement monitoring and alerting for parsing error rates. Document when to use fallback values versus when to fail fast.
  Owner: Engineering team and operations team
- Error messages may inadvertently leak sensitive information about system internals or data structures
  Mitigation: Review all error logging statements to ensure they do not include sensitive data. Use sanitized error messages for user-facing errors while keeping detailed logs for internal debugging.
  Owner: Security team and engineering team

## Implementation Notes

- Review existing JSON.parse() usage in tabSync.ts, firebase.ts, ExcalidrawPlusIframeExport.tsx, index.ts, LocalData.ts, localStorage.ts, and Collab.tsx to ensure all follow the established pattern
- Consider creating utility functions like safeJsonParse(data, defaultValue) and parseLocalStorage(key, defaultValue) to encapsulate error handling logic
- For localStorage operations, use the pattern: JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue)) to handle both null values and parsing errors
- When parsing data from @excalidraw/excalidraw/data/encode or @excalidraw/excalidraw/data/encryption, verify data integrity before parsing and handle decryption failures separately from parsing failures
- Document the expected JSON schema for each parsing operation in code comments to aid future validation efforts

## Continuation Context


Verify commands:
- grep -n 'JSON\.parse' --include='*.ts' --include='*.tsx' -r . | grep -v 'try' | grep -v '//' | head -20
- grep -rn 'JSON\.parse.*localStorage' --include='*.ts' --include='*.tsx' . | wc -l
- grep -rn 'console\.error.*JSON\|console\.warn.*JSON' --include='*.ts' --include='*.tsx' . | wc -l

Accept when:
- All JSON.parse() operations on external data sources are wrapped in try-catch blocks or use safe parsing utilities
- Grep search for unprotected JSON.parse() calls returns zero results in production code paths
- All parsing error cases include appropriate logging with console.error() or console.warn() and context information
- Code review checklist includes verification of JSON parsing error handling for all new code

## Enforcement

- Verified by: Static analysis using ESLint rules to detect unprotected JSON.parse() calls
- Verified by: Code review checklist requiring verification of error handling for all JSON parsing operations
- Verified by: Automated grep-based verification in CI pipeline to flag suspicious JSON.parse() patterns
- Verified by: Security review for any changes to data parsing logic in firebase.ts, Collab.tsx, and other security-sensitive files
- Violation handling: CI pipeline fails if static analysis detects unprotected JSON.parse() on external data sources
- Violation handling: Code review must explicitly approve any JSON.parse() without try-catch with documented justification
- Violation handling: Security team review required for violations in authentication, encryption, or collaboration code paths
- Violation handling: Post-deployment monitoring alerts on increased JSON parsing error rates indicating potential issues
- Exception process: Developer documents why the JSON.parse() operation is safe (e.g., hardcoded data, same-scope generation)
- Exception process: Code review approval from at least one security-aware team member
- Exception process: Exception documented in code comments with EXC-001 or EXC-002 reference
- Exception process: Exceptions reviewed quarterly to ensure they remain valid as code evolves