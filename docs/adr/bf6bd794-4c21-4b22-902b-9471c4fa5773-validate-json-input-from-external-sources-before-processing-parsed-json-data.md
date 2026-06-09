# Validate JSON Input from External Sources Before Processing: Parsed Json Data

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The application receives JSON data from multiple external sources including localStorage, Firebase, environment variables (VITE_APP_FIREBASE_CONFIG), fetch responses from backend endpoints (BACKEND_V2_GET, BACKEND_V2_POST), and encrypted WebSocket payloads
- JSON.parse operations are performed on untrusted input including localStorage.getItem(), import.meta.env values, decoded buffers from encryption, and raw string data from external APIs without prior validation
- The codebase handles sensitive operations including collaborative editing via WebSocket (client-broadcast events), file storage (Firebase, IndexedDB via idb-keyval), and state synchronization across browser tabs
- Error handling patterns show defensive programming with console.error and console.warn logging around JSON parsing operations, indicating awareness of potential parsing failures
- The application uses encryption/decryption workflows (@excalidraw/excalidraw/data/encryption) where JSON parsing occurs after decryption, creating a critical security boundary

## Problem Statement

Public-facing APIs and external data sources expose the application to malformed, malicious, or unexpected JSON payloads that can cause runtime errors, security vulnerabilities, or application crashes. Without systematic input validation before JSON.parse operations, the application is vulnerable to injection attacks, type confusion, and denial-of-service through crafted payloads in localStorage, environment variables, WebSocket messages, and HTTP responses.

## Decision

1. MUST: Parsed JSON data from untrusted sources MUST be validated against expected schema before being used in application logic

## Policy Block

- MUST Parsed JSON data from untrusted sources MUST be validated against expected schema before being used in application logic

In scope:
- All JSON.parse operations on data from localStorage (LSData, savedElements, savedState, browser state versions)
- All JSON.parse operations on environment variables (import.meta.env.VITE_APP_FIREBASE_CONFIG)
- All JSON.parse operations on fetch response bodies from external endpoints (BACKEND_V2_GET, Firebase Storage)
- All JSON.parse operations on decoded/decrypted data (decodedBuffer, decodedData, decodedPayload)
- All JSON.parse operations on WebSocket message payloads (client-broadcast events)
- Public API functions that accept or return JSON data (loadFirebaseStorage, saveToFirebase, importFromLocalStorage)

Out of scope:
- JSON.parse operations on data generated internally by the application without external input
- JSON.parse operations in test fixtures with known-good data
- JSON serialization (JSON.stringify) operations

Exceptions:
- EXC-001: JSON parsing is performed on data that has been cryptographically signed and signature-verified (e.g., JWT tokens after verification)
- EXC-002: JSON parsing occurs in isolated error recovery code paths where failure is explicitly expected and handled

## Rationale

- The evidence shows 7 files with consistent patterns of JSON.parse operations on external data sources (localStorage, environment variables, fetch responses, WebSocket payloads), indicating this is a systematic architectural pattern rather than isolated occurrences
- Existing error handling patterns (console.error, console.warn) demonstrate awareness of parsing failures, but the pattern detection reveals this is not consistently applied across all external data boundaries
- The application handles sensitive collaborative editing data and file storage, where malformed JSON could lead to data corruption, synchronization failures, or security vulnerabilities
- The 90.91% confidence and significance scores, combined with detection across multiple subsystems (data/firebase.ts, data/localStorage.ts, collab/Collab.tsx, data/LocalData.ts), indicate this is a critical cross-cutting concern requiring standardized handling

## Consequences

Positive:
- Improved application resilience against malformed or malicious JSON payloads from external sources
- Consistent error handling and logging across all external data boundaries, improving debuggability and monitoring
- Reduced risk of runtime crashes and security vulnerabilities from type confusion or injection attacks
- Better user experience through graceful degradation and fallback behavior when external data is corrupted

Negative:
- Increased code verbosity with try-catch blocks and validation logic around every JSON.parse operation
- Potential performance overhead from schema validation on large JSON payloads (though typically negligible)
- Additional maintenance burden to keep validation schemas synchronized with data structure changes
- Risk of overly permissive validation that provides false sense of security without catching actual threats

## Alternatives

- Use a JSON parsing library with built-in validation (e.g., zod, yup, ajv) instead of manual try-catch blocks (deferred)
  Rejected because: null
  When valid: Should be considered for future refactoring to provide type-safe parsing with schema validation, but requires significant refactoring of existing codebase
- Implement a centralized JSON parsing utility function that wraps JSON.parse with validation and error handling (accepted)
  Rejected because: null
  When valid: Recommended as a complementary approach to standardize parsing logic and reduce code duplication
- Trust localStorage and environment variables as safe sources and only validate external network data (rejected)
  Rejected because: localStorage can be manipulated by browser extensions, XSS attacks, or user tampering; environment variables can be misconfigured; treating any external data as trusted creates security vulnerabilities
  When valid: Never - all external data sources should be validated regardless of perceived trust level

## Risks

- Incomplete coverage: Developers may add new JSON.parse operations without proper validation, creating gaps in the security boundary
  Mitigation: Implement ESLint rule or static analysis to detect unprotected JSON.parse calls; add to code review checklist; provide utility functions that enforce validation
  Owner: Engineering team + Security team
- Validation logic may be too strict and reject legitimate data, causing functional regressions for existing users with valid but non-conforming stored data
  Mitigation: Implement gradual rollout with monitoring; provide data migration paths for legacy formats; use permissive validation initially and tighten over time
  Owner: Engineering team
- Performance degradation from validation overhead on large JSON payloads in real-time collaboration scenarios (WebSocket messages)
  Mitigation: Profile validation performance; implement lightweight validation for hot paths; consider async validation for non-critical paths; cache validation results where appropriate
  Owner: Engineering team

## Implementation Notes

- Create a centralized parseJSON utility function that wraps JSON.parse with try-catch, logging, and optional schema validation: parseJSON(input, { source, schema, fallback })
- For localStorage operations, use the existing pattern of providing fallback values: JSON.parse(localStorage.getItem(key) || defaultValue)
- For environment variables like VITE_APP_FIREBASE_CONFIG, validate at application startup and fail fast with clear error messages if configuration is invalid
- For WebSocket payloads in collab/Collab.tsx, ensure decryption success is verified before JSON parsing and implement type guards for message types (WS_SUBTYPES.INIT, WS_SUBTYPES.UPDATE, etc.)
- Document expected JSON schemas for public API contracts (loadFirebaseStorage, saveToFirebase, importFromLocalStorage) and consider adding runtime type checking with TypeScript type guards
- Add monitoring/telemetry for JSON parsing failures to detect potential attacks or data corruption issues in production

## Continuation Context


Verify commands:
- grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' | grep -v 'try' | grep -v 'catch' | wc -l
- eslint . --rule '{"no-unsafe-json-parse": "error"}' --ext .ts,.tsx
- grep -r 'console\.error.*JSON' --include='*.ts' --include='*.tsx' | wc -l

Accept when:
- All JSON.parse operations on external data sources (localStorage, environment variables, fetch responses, WebSocket payloads) are wrapped in try-catch blocks or use a validated parsing utility
- Grep for unprotected JSON.parse calls returns zero results in production code paths (excluding tests)
- All public API functions that handle JSON data have documented schemas and validation logic
- Error logging is present for all JSON parsing failures with sufficient context to identify the source

## Enforcement

- Verified by: ESLint custom rule to detect JSON.parse calls without surrounding try-catch blocks
- Verified by: Code review checklist item requiring validation of all external data parsing
- Verified by: Static analysis in CI pipeline to flag unprotected JSON.parse operations
- Verified by: Security audit of data boundary crossing points (localStorage, fetch, WebSocket handlers)
- Violation handling: CI build fails if ESLint detects unprotected JSON.parse on external data
- Violation handling: Code review blocks merge if validation is missing on new JSON parsing code
- Violation handling: Security team notified for violations in security-critical paths (authentication, encryption, collaboration)
- Violation handling: Post-deployment monitoring alerts on unexpected JSON parsing errors in production
- Exception process: Developer documents why validation is not needed (e.g., data is cryptographically verified)
- Exception process: Security team reviews and approves exception for security-critical paths
- Exception process: Exception is documented in code comments with reference to this ADR and approval
- Exception process: Exception is logged in central registry and reviewed quarterly