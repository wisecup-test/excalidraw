# Standardize JSON.parse Error Handling with Console Logging: Json Parse Operations

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The application processes JSON data from multiple sources including localStorage, Firebase configuration, external API responses, and encrypted WebSocket payloads
- JSON parsing failures can occur due to malformed data, corrupted storage, invalid environment variables, or transmission errors
- The codebase spans multiple modules including data synchronization (tabSync.ts), Firebase integration (firebase.ts), local storage management (LocalData.ts, localStorage.ts), collaboration features (Collab.tsx), and export functionality (ExcalidrawPlusIframeExport.tsx)
- Consistent error logging is needed for debugging production issues, monitoring data integrity problems, and tracking security-related parsing failures
- The pattern emerged organically across 7 files with 90.91% consistency, indicating a de facto standard that should be formalized

## Problem Statement

When JSON.parse operations fail across the application, inconsistent error handling and logging practices make it difficult to diagnose data corruption, security issues, and integration problems. Without standardized logging of JSON parsing errors, developers lack visibility into the root causes of failures, leading to increased debugging time and potential data loss.

## Decision

1. MUST: All JSON.parse operations MUST be wrapped in try-catch blocks to handle parsing exceptions

## Policy Block

- MUST All JSON.parse operations MUST be wrapped in try-catch blocks to handle parsing exceptions

In scope:
- JSON.parse operations on localStorage data
- JSON.parse operations on environment variables and configuration
- JSON.parse operations on external API responses
- JSON.parse operations on encrypted or encoded payloads
- JSON.parse operations on WebSocket messages
- JSON.parse operations on IndexedDB data

Out of scope:
- JSON.stringify operations (covered by separate serialization standards)
- Parsing of non-JSON formats (XML, YAML, etc.)
- Third-party library internal JSON parsing
- Test fixtures with known-valid JSON

Exceptions:
- EX-001: Performance-critical hot paths where JSON structure is guaranteed valid by prior validation
- EX-002: Parsing operations within error recovery handlers where logging would create noise

## Rationale

- The pattern appears consistently across 7 files with 90.91% confidence, indicating this is an established practice that has proven effective in the codebase
- Console logging provides immediate visibility during development and can be captured by production logging infrastructure without additional dependencies
- The combination of JSON.parse with console.error/console.warn creates a clear audit trail for data integrity and security issues
- Evidence shows this pattern is applied across diverse contexts (localStorage, Firebase, WebSocket, external APIs), demonstrating its general applicability

## Consequences

Positive:
- Improved debuggability: Developers can quickly identify and diagnose JSON parsing failures in production
- Security visibility: Malformed or malicious JSON payloads are logged for security analysis
- Data integrity monitoring: Corrupted localStorage or cache data is detected and logged
- Consistent error handling: Standardized approach reduces cognitive load and code review friction

Negative:
- Console logging overhead: High-frequency parsing errors could generate excessive log volume
- Potential information disclosure: Logged JSON content might contain sensitive data if not sanitized
- Limited structure: Console logs lack the structure and metadata of dedicated logging frameworks
- Browser console pollution: Development environments may accumulate noise from expected parsing failures

## Alternatives

- Use a structured logging library (e.g., winston, pino) instead of console methods (rejected)
  Rejected because: Adds external dependency and complexity; console logging is sufficient for current needs and works in both Node.js and browser environments
  When valid: Consider if application scales to require log aggregation, structured querying, or log levels beyond error/warn
- Silent failure with fallback values instead of logging errors (rejected)
  Rejected because: Hides data corruption and security issues; makes debugging production problems nearly impossible
  When valid: Never valid for production code; only acceptable in test utilities with known-invalid inputs
- Throw exceptions and let global error handlers manage logging (deferred)
  Rejected because: Would require significant refactoring of existing error handling patterns
  When valid: Consider for new modules or during major refactoring; provides better error propagation but requires comprehensive error boundary implementation

## Risks

- Sensitive data exposure through logged JSON content (tokens, user data, encryption keys)
  Mitigation: Implement sanitization helpers that redact sensitive fields before logging; conduct security review of logged data sources
  Owner: Security team and engineering team
- Log volume explosion if parsing errors occur in high-frequency operations
  Mitigation: Implement rate limiting or sampling for known high-frequency paths; monitor log volume in production
  Owner: Engineering team and operations team
- Inconsistent adoption across the codebase leading to gaps in observability
  Mitigation: Add linting rules to detect unprotected JSON.parse calls; conduct code audit of existing parsing operations
  Owner: Engineering team

## Implementation Notes

- Create a utility function (e.g., safeJsonParse) that encapsulates try-catch and logging logic for reuse across modules
- For localStorage operations, include the storage key in error messages to identify which data is corrupted
- For external API responses, include the endpoint URL or API identifier in error logs
- For encrypted payloads, log decryption/parsing failures separately to distinguish encryption vs. JSON issues
- Consider implementing a sanitization function that removes sensitive fields (tokens, passwords, keys) before logging JSON content

## Continuation Context


Verify commands:
- grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' | grep -v 'try\|catch' | wc -l
- grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' -A 5 | grep -E 'console\.(error|warn)' | wc -l
- npm run lint -- --rule 'no-unsafe-json-parse'

Accept when:
- All JSON.parse operations in production code are wrapped in try-catch blocks
- At least 90% of JSON.parse error handlers include console.error or console.warn statements
- Linting passes with no violations of JSON parsing safety rules
- Code review checklist includes verification of JSON.parse error handling

## Enforcement

- Verified by: Static analysis via ESLint custom rule detecting unprotected JSON.parse calls
- Verified by: Code review checklist requiring error handling verification
- Verified by: Automated grep-based checks in CI pipeline counting unprotected JSON.parse instances
- Violation handling: CI build warnings for unprotected JSON.parse operations
- Violation handling: Code review rejection for new code lacking proper error handling
- Violation handling: Technical debt tickets created for existing violations discovered during audits
- Exception process: Developer documents justification in code comments explaining why exception is safe
- Exception process: Tech lead or senior engineer approves exception during code review
- Exception process: Exception is tracked in technical debt register for future review