# Adopt JSON.parse for Input Validation in Local Storage Operations: Storage Quota Exceeded

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The application uses local storage and IndexedDB (idb-keyval) for persistent data storage, requiring deserialization of stored string data back into JavaScript objects
- Data retrieved from localStorage needs validation to ensure it is well-formed and safe to use, particularly when handling user-generated content and application state from @excalidraw/excalidraw/appState
- The codebase integrates multiple storage adapters (LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter) that handle data transformation between storage formats
- Error handling patterns using console.error and console.warn are established for logging storage-related failures, with quota exceeded tracking via appJotaiStore and localStorageQuotaExceededAtom
- The application manages file-based data with erroredFiles tracking and requires consistent parsing patterns across the LocalData service boundary

## Problem Statement

When retrieving serialized data from local storage, the application must safely deserialize JSON strings into JavaScript objects while handling malformed data, preventing injection attacks, and maintaining data integrity across storage operations. Without standardized input validation through JSON.parse, the application risks runtime errors from corrupted data, security vulnerabilities from untrusted input, and inconsistent error handling across storage adapters.

## Decision

1. SHOULD: Storage quota exceeded conditions SHOULD be tracked using appJotaiStore.set(localStorageQuotaExceededAtom, true) when parse operations fail due to storage issues

## Policy Block

- SHOULD Storage quota exceeded conditions SHOULD be tracked using appJotaiStore.set(localStorageQuotaExceededAtom, true) when parse operations fail due to storage issues

In scope:
- All LocalData service operations that read from localStorage
- LibraryIndexedDBAdapter and LibraryLocalStorageMigrationAdapter data deserialization
- File data loading operations in the saveFiles and load concurrency model
- Application state restoration from @excalidraw/excalidraw/appState

Out of scope:
- Data already in JavaScript object form from idb-keyval operations
- Hardcoded configuration objects that never pass through storage
- Data from trusted internal APIs that guarantee pre-validated objects
- Test fixtures and mock data in development environments

Exceptions:
- EXC-001: Migration operations need to handle legacy data formats that are not valid JSON

## Rationale

- The IR evidence shows explicit use of JSON.parse(LSData) for security.input_validation, indicating this is an established pattern for safe deserialization in the codebase
- The presence of error handling infrastructure (console.error, console.warn, erroredFiles map, localStorageQuotaExceededAtom) demonstrates the application already anticipates and handles parsing failures
- Using JSON.parse provides built-in protection against code injection and ensures data conforms to JSON specification before use
- The pattern aligns with the established service boundaries (LocalData) and concurrency model (saveFiles, load) for consistent data handling across storage operations

## Consequences

Positive:
- Prevents code injection attacks by ensuring localStorage data is parsed as data, not executable code
- Provides consistent error handling for malformed data across all storage operations
- Leverages native JavaScript JSON.parse performance and security guarantees
- Integrates seamlessly with existing error tracking infrastructure (erroredFiles, localStorageQuotaExceededAtom)

Negative:
- Adds try-catch overhead to every localStorage read operation, slightly impacting performance
- May reject valid data that uses JavaScript object literals but is not strict JSON
- Requires additional error handling code in every storage adapter implementation
- Does not validate data schema or business logic constraints, only JSON well-formedness

## Alternatives

- Use eval() or Function constructor to deserialize localStorage data (rejected)
  Rejected because: Creates severe security vulnerabilities by allowing arbitrary code execution from untrusted storage data. This approach violates fundamental security principles and could enable XSS attacks.
  When valid: Never valid for untrusted data sources
- Implement custom parser with schema validation using libraries like Zod or Yup (deferred)
  Rejected because: While providing stronger validation, this adds significant complexity and dependencies. Could be adopted in future iterations if business logic validation becomes critical.
  When valid: When type safety and schema validation requirements justify the additional complexity and bundle size
- Trust localStorage data without parsing validation (rejected)
  Rejected because: Exposes application to corrupted data causing runtime errors and potential security issues. The evidence shows the codebase already uses JSON.parse for validation, indicating this approach was previously rejected.
  When valid: Only in fully controlled environments where storage cannot be tampered with (not applicable to browser localStorage)

## Risks

- JSON.parse throws synchronous exceptions that could crash the application if not properly caught
  Mitigation: Enforce try-catch blocks around all JSON.parse calls through code review and linting rules. Ensure error handlers update erroredFiles tracking.
  Owner: Engineering team
- Large localStorage data could cause performance degradation during JSON.parse operations
  Mitigation: Monitor parse operation performance. Consider implementing lazy loading or chunking for large datasets. Use the existing quota tracking mechanisms to detect storage issues.
  Owner: Engineering team
- Migration from legacy data formats may fail if they are not valid JSON
  Mitigation: LibraryLocalStorageMigrationAdapter should implement format detection and conversion before JSON.parse. Document exception process for legacy format handling.
  Owner: Engineering team

## Implementation Notes

- Wrap all JSON.parse(localStorage.getItem(...)) calls in try-catch blocks that log errors using console.error or console.warn
- Update erroredFiles map when file-specific parsing fails: erroredFiles.set(id, true)
- Use appJotaiStore.set(localStorageQuotaExceededAtom, true) when storage quota issues are detected during parse operations
- Ensure storage adapters (LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter) consistently apply JSON.parse validation before returning data to consumers

## Continuation Context


Verify commands:
- grep -r 'localStorage\.getItem' --include='*.ts' --include='*.tsx' | grep -v 'JSON\.parse' | wc -l | grep -q '^0$'
- grep -r 'JSON\.parse.*localStorage' --include='*.ts' --include='*.tsx' -A 3 | grep -q 'try\|catch'
- grep -r 'security\.input_validation.*JSON\.parse' excalidraw-app/data/LocalData.ts

Accept when:
- All localStorage.getItem() calls are followed by JSON.parse() with try-catch error handling
- Parse errors are logged using console.error or console.warn and tracked in erroredFiles or localStorageQuotaExceededAtom as appropriate
- Storage adapters (LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter) implement consistent JSON.parse validation

## Enforcement

- Verified by: Code review checklist requiring JSON.parse validation for all localStorage operations
- Verified by: ESLint custom rule detecting localStorage.getItem without JSON.parse
- Verified by: CI pipeline grep checks verifying no raw localStorage usage in LocalData service
- Violation handling: CI build fails if grep checks detect localStorage.getItem without JSON.parse
- Violation handling: Code review blocks merge if try-catch blocks are missing around JSON.parse operations
- Violation handling: Security review required for any exceptions to the JSON.parse requirement
- Exception process: Submit exception request documenting why JSON.parse cannot be used (e.g., legacy migration)
- Exception process: Obtain approval from architecture review board and security team
- Exception process: Document alternative validation approach and timeline for conformance
- Exception process: Add exception to policy_exceptions with tracking ticket for resolution