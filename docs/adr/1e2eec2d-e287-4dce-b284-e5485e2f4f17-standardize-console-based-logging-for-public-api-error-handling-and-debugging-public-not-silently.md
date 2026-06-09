# Standardize console-based logging for public API error handling and debugging: Public Not Silently

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The codebase implements public/external APIs across multiple modules including data synchronization (tabSync.ts), Firebase integration (firebase.ts), iframe exports (ExcalidrawPlusIframeExport.tsx), and collaborative features (Collab.tsx)
- These public APIs require observable behavior for debugging and error tracking, particularly when handling external client interactions, data persistence, and real-time collaboration
- The pattern uses console.error, console.warn, and console.info for logging across 12 files with 90.31% consistency, indicating a deliberate architectural choice for client-side observability
- Public API contracts are exposed through named exports and functions that interact with external systems (Firebase, browser storage, WebSocket connections, external clients via fetch)
- Error handling and logging are critical for public APIs where failures may occur in external integrations, JSON parsing, JWT verification, encryption/decryption, and network operations

## Problem Statement

Public and external APIs require consistent, observable error handling and debugging capabilities to support integration troubleshooting, but without a standardized logging approach, errors may be silently swallowed, inconsistently reported, or lack sufficient context for diagnosis. The challenge is to establish a uniform logging pattern that provides visibility into API failures, warnings, and informational events while maintaining simplicity for client-side JavaScript environments.

## Decision

1. MUST_NOT: Public APIs MUST NOT silently swallow errors in external integrations without logging; all caught exceptions in public API boundaries must be observable

## Policy Block

- MUST_NOT Public APIs MUST NOT silently swallow errors in external integrations without logging; all caught exceptions in public API boundaries must be observable

In scope:
- All functions exported as public API contracts (loadFirebaseStorage, saveToFirebase, loadFromFirebase, exportToExcalidrawPlus, LocalData.save, etc.)
- Error handling in external client interactions (fetch calls, Firebase operations, WebSocket events)
- JSON parsing and data validation operations in public API entry points
- JWT verification and encryption/decryption operations
- Browser storage operations (localStorage, IndexedDB) exposed through public APIs

Out of scope:
- Internal utility functions not exposed as public APIs
- React component lifecycle logging unrelated to API operations
- UI interaction logging that does not involve external system calls
- Private helper functions used only within module boundaries

Exceptions:
- EXC-001: Production builds may suppress console.info debug logging for performance optimization
- EXC-002: Structured logging libraries (e.g., Winston, Pino) may be used instead of console methods if they provide equivalent observability

## Rationale

- The pattern appears in 12 files with 90.31% confidence, demonstrating consistent adoption across the codebase's public API surface
- Console-based logging is native to JavaScript environments, requires no external dependencies, and works universally in browser and Node.js contexts
- The evidence shows logging at critical integration points: Firebase operations, fetch calls, JSON parsing, JWT verification, and WebSocket events—all areas where external failures are most likely
- Contextual error messages in the evidence (e.g., 'error while updating browser state version', 'Failed to verify JWT', 'error when decoding shareLink data') demonstrate the value of descriptive logging for troubleshooting

## Consequences

Positive:
- Developers integrating with public APIs can observe and diagnose failures through browser console or server logs without requiring debugger attachment
- Consistent error logging across all public API boundaries creates predictable debugging experience and reduces time to resolution
- Contextual information in logs (operation names, identifiers, error objects) provides sufficient detail for root cause analysis
- Zero-dependency approach using native console methods ensures logging works in all JavaScript environments without additional setup

Negative:
- Console logging may expose sensitive information if error messages include user data, tokens, or internal system details
- Performance impact in high-frequency API calls if logging is not properly throttled or disabled in production
- Console logs are ephemeral and not persisted, making historical analysis or aggregation difficult without additional tooling
- Lack of structured logging format makes automated log parsing and monitoring more challenging compared to JSON-based logging solutions

## Alternatives

- Adopt a structured logging library (Winston, Pino, or Bunyan) with JSON output and log levels (rejected)
  Rejected because: Adds external dependency, increases bundle size for client-side code, and requires configuration overhead. The current pattern's simplicity and zero-dependency approach is more appropriate for a library that may be embedded in various environments.
  When valid: Consider for server-side APIs or when centralized log aggregation becomes a requirement
- Implement custom logging abstraction layer with pluggable backends (rejected)
  Rejected because: Over-engineering for current needs; adds complexity and maintenance burden. The evidence shows console methods meet current observability requirements across 12 files.
  When valid: Revisit if multiple logging backends (console, remote, file) need to be supported simultaneously
- Silent error handling with optional error callbacks passed by API consumers (rejected)
  Rejected because: Places debugging burden on API consumers and makes default behavior less observable. Evidence shows proactive logging is preferred pattern.
  When valid: May be appropriate for library APIs where consumers want full control over error handling

## Risks

- Sensitive data exposure through error logs containing user information, authentication tokens, or internal system details
  Mitigation: Implement log sanitization for known sensitive fields (tokens, passwords, PII). Review error messages to ensure they provide context without exposing secrets. Consider redacting portions of JWT tokens or API keys in logs.
  Owner: Security team and API developers
- Performance degradation in production from excessive logging in high-frequency API calls
  Mitigation: Use build-time configuration to reduce log verbosity in production. Implement throttling for repeated error messages. Consider log sampling for high-volume operations.
  Owner: Performance engineering team
- Inconsistent logging patterns as codebase grows and new developers add public APIs without following established conventions
  Mitigation: Document logging standards in API development guidelines. Add linting rules to detect missing error logging in try-catch blocks. Include logging requirements in code review checklist.
  Owner: Engineering team and code reviewers

## Implementation Notes

- When adding new public API functions, wrap external system calls (fetch, Firebase, WebSocket) in try-catch blocks and log errors with console.error including operation context
- For JSON.parse operations in public APIs, always catch SyntaxError and log both the error and a sample of the problematic input (sanitized if necessary)
- Use template literals to construct descriptive error messages: console.error(`Failed to ${operation}: ${error.message}`, { context })
- Distinguish between error severities: console.error for failures, console.warn for recoverable issues or deprecations, console.info for debug information
- Include relevant identifiers in log messages (user IDs, document IDs, socket IDs) to enable correlation across distributed operations
- Consider adding a development-mode flag to enable verbose console.info logging while keeping production logs focused on errors and warnings

## Continuation Context


Verify commands:
- grep -r 'console\.error' --include='*.ts' --include='*.tsx' excalidraw-app/ packages/ | wc -l
- grep -r 'catch.*{' --include='*.ts' --include='*.tsx' excalidraw-app/data/ | grep -v 'console\.' | head -5
- grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -L 'console\.error\|console\.warn'

Accept when:
- All public API functions that interact with external systems (Firebase, fetch, WebSocket) include error logging with console.error in catch blocks
- JSON parsing operations in public APIs are wrapped in try-catch with error logging that includes context about the parsing failure
- No silent error swallowing detected in public API boundaries—all caught exceptions produce observable console output
- Error log messages include sufficient context (operation name, relevant IDs, error details) to support troubleshooting

## Enforcement

- Verified by: Code review checklist requiring error logging verification for all public API changes
- Verified by: Static analysis with ESLint rules detecting empty catch blocks or missing console statements in API error handlers
- Verified by: Manual inspection of grep results showing console.error usage in external integration points
- Violation handling: Code review rejection for public API functions lacking error logging in external system interactions
- Violation handling: CI pipeline warnings for catch blocks without observable error handling
- Violation handling: Post-merge review flagging for APIs added without proper logging, requiring follow-up PR to add logging
- Exception process: Developer documents specific reason why logging is not appropriate for the API function
- Exception process: Architecture team reviews exception request considering security, performance, or technical constraints
- Exception process: Approved exceptions are documented in code comments with ADR reference and rationale
- Exception process: Exception approval requires alternative observability mechanism (e.g., error callbacks, metrics, structured logging)