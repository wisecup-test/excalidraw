# Adopt Service Boundary Pattern with Get-Based Data Access: Data Retrieved Through

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The codebase implements service boundaries using explicit get-based accessor patterns for data retrieval across Firebase, local storage, and collaboration services
- Multiple data access layers (FirebaseSceneVersionCache, appJotaiStore, collaborators Map) require consistent boundary definitions to prevent unauthorized or unvalidated data access
- The application handles sensitive collaborative data that requires controlled access through well-defined service interfaces rather than direct data structure manipulation
- Service definitions using get/set patterns provide clear audit trails and enable centralized validation, caching, and security controls at boundary points

## Problem Statement

Without explicit service boundary definitions using standardized accessor patterns, data access becomes scattered across the codebase, making it difficult to enforce security controls, validate inputs, audit access patterns, or maintain consistent caching strategies. Direct manipulation of data structures bypasses opportunities for validation, logging, and access control enforcement.

## Decision

1. MUST: Data retrieved through service boundaries MUST be validated before use, particularly when parsing JSON or handling external data sources

## Policy Block

- MUST Data retrieved through service boundaries MUST be validated before use, particularly when parsing JSON or handling external data sources

In scope:
- FirebaseSceneVersionCache.get() and FirebaseSceneVersionCache.cache.get() operations
- appJotaiStore.get() and appJotaiStore.set() operations for state management
- transaction.get() and transaction.set() operations for Firebase transactions
- Map-based collaborator access via collaborators.get() and addedFiles.get()
- All data access patterns crossing service or module boundaries

Out of scope:
- Internal data structure access within a single service implementation
- Direct property access on domain objects after retrieval through service boundaries
- Local variable access within function scope
- Standard library or framework-provided accessors (e.g., Array.get is not applicable)

## Rationale

- The pattern appears consistently across 3 files with 90.93% confidence, indicating an established architectural practice in the codebase
- Get-based service boundaries provide clear interception points for security controls, validation, and observability without requiring invasive changes to calling code
- The evidence shows this pattern is used with critical security-sensitive operations including JSON parsing, Firebase transactions, and collaborative data synchronization
- Explicit accessor methods enable future enhancements such as access control, audit logging, or data transformation without breaking existing consumers

## Consequences

Positive:
- Clear audit trail of all cross-service data access through standardized accessor methods
- Centralized validation and error handling at service boundaries reduces scattered validation logic
- Easier to implement security controls, rate limiting, or monitoring by instrumenting accessor methods
- Improved testability through ability to mock or stub service boundary accessors

Negative:
- Additional indirection may impact performance for high-frequency data access patterns
- Requires discipline to avoid bypassing service boundaries through direct access
- May increase initial development time as developers must define and use accessor methods
- Risk of inconsistent implementation if different services use different accessor patterns

## Alternatives

- Direct property access on shared data structures without service boundaries (rejected)
  Rejected because: Eliminates opportunities for validation, security controls, and audit logging at access points; makes it difficult to track data flow and enforce access policies
  When valid: Only acceptable for internal implementation details within a single service module
- Proxy-based automatic interception of all property access (rejected)
  Rejected because: Adds significant runtime overhead and complexity; makes data flow less explicit and harder to debug; may interfere with framework internals
  When valid: Could be considered for development/debugging tools but not production service boundaries
- Event-driven publish/subscribe pattern for all data access (deferred)
  Rejected because: Would require significant architectural changes; async nature may complicate synchronous access patterns
  When valid: Appropriate for specific use cases like real-time collaboration updates (already used in socket.on handlers)

## Risks

- Developers may bypass service boundaries through direct access to underlying data structures, undermining security controls
  Mitigation: Implement linting rules to detect direct access patterns; conduct code reviews focused on service boundary compliance; make underlying data structures private where possible
  Owner: Engineering team
- Performance degradation from excessive accessor method calls in hot paths
  Mitigation: Profile critical paths and optimize accessor implementations; consider caching strategies or batch access patterns for high-frequency operations
  Owner: Engineering team
- Inconsistent service boundary patterns across different services leading to confusion and errors
  Mitigation: Document standard accessor patterns; create reusable base classes or interfaces for common service boundary implementations; enforce consistency through code review
  Owner: Engineering team

## Implementation Notes

- Use TypeScript interfaces to define service boundary contracts with explicit get/set method signatures
- Implement error handling and logging within accessor methods to capture validation failures and access errors
- For cache-based services like FirebaseSceneVersionCache, ensure get operations check for cache validity and handle cache misses gracefully
- When implementing new services, follow the established pattern: create a service class or module with explicit get/set methods rather than exposing raw data structures
- Consider using TypeScript private fields or closures to prevent direct access to underlying data structures from outside the service

## Continuation Context


Verify commands:
- grep -r '\.get(' excalidraw-app/data/ excalidraw-app/collab/ | grep -E '(cache|store|transaction|collaborators)\.get\(' | wc -l
- grep -r 'JSON\.parse' excalidraw-app/ | grep -v 'try' | wc -l
- eslint --rule 'no-restricted-syntax: [error, {selector: MemberExpression[object.name=/cache|store/][property.name!=get][property.name!=set], message: Direct access to service data structures is not allowed}]' excalidraw-app/

Accept when:
- All cross-service data access uses explicit get/set accessor methods as verified by grep patterns showing consistent usage
- No direct property access to cache, store, or transaction objects outside of service implementation files
- All JSON.parse operations are wrapped in try-catch blocks with error logging as shown in the evidence
- Linting rules pass with no violations of direct data structure access patterns

## Enforcement

- Verified by: ESLint rules configured to detect direct access to service data structures
- Verified by: Code review checklist includes verification of service boundary accessor usage
- Verified by: Automated grep-based checks in CI pipeline to count and validate accessor pattern usage
- Verified by: TypeScript compiler enforces private field access restrictions where implemented
- Violation handling: CI pipeline fails if linting rules detect direct data structure access violations
- Violation handling: Code review process blocks merge requests that bypass service boundaries without documented justification
- Violation handling: Runtime error logging captures and reports validation failures at service boundaries
- Violation handling: Quarterly architecture reviews audit service boundary compliance and identify refactoring needs
- Exception process: Document exception rationale in code comments explaining why direct access is necessary
- Exception process: Obtain architecture team approval for exceptions that affect security-sensitive services
- Exception process: Add eslint-disable comments with ticket references for approved exceptions
- Exception process: Review all exceptions during quarterly architecture audits to determine if they can be eliminated