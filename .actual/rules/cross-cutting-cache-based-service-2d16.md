# Adopt Service Boundary Pattern with Get-Based Data Access: Cache Based Service

These rules are ALWAYS ACTIVE for all files matching the configured scope: FirebaseSceneVersionCache, appJotaiStore, transaction operations, and Map-based collaborator access patterns crossing service or module boundaries.

### Rules

- **R-SB-001** SHOULD: Cache-based service boundaries SHOULD implement version tracking or invalidation mechanisms to ensure data consistency.
- **R-SB-002** MUST: All cross-service data access MUST use explicit get/set accessor methods rather than direct property access to cache, store, or transaction objects.
- **R-SB-003** MUST: Service boundary implementations MUST include error handling and logging within accessor methods to capture validation failures and access errors.
- **R-SB-004** SHOULD: Cache-based services SHOULD check for cache validity and handle cache misses gracefully in get operations.
- **R-SB-005** SHOULD: New service implementations SHOULD follow the established pattern of creating a service class or module with explicit get/set methods rather than exposing raw data structures.
- **R-SB-006** SHOULD: Service implementations SHOULD use TypeScript private fields or closures to prevent direct access to underlying data structures from outside the service.

### Verify

```bash
# Count get-based accessor usage across service boundaries
grep -r '\.get(' excalidraw-app/data/ excalidraw-app/collab/ | grep -E '(cache|store|transaction|collaborators)\.get\(' | wc -l

# Identify unprotected JSON.parse operations
grep -r 'JSON\.parse' excalidraw-app/ | grep -v 'try' | wc -l

# Detect direct access to service data structures (ESLint rule)
eslint --rule 'no-restricted-syntax: [error, {selector: "MemberExpression[object.name=/cache|store/][property.name!=get][property.name!=set]", message: "Direct access to service data structures is not allowed"}]' excalidraw-app/
```

**Accept when:**
- All cross-service data access uses explicit get/set accessor methods as verified by grep patterns showing consistent usage
- No direct property access to cache, store, or transaction objects outside of service implementation files
- All JSON.parse operations are wrapped in try-catch blocks with error logging
- Linting rules pass with no violations of direct data structure access patterns
- Cache-based services implement version tracking or invalidation mechanisms
- Service boundary accessor methods include error handling and logging

<enforcement>
Claude Code MUST NOT skip or defer verification. All rules in this file are mandatory for code review and CI pipeline validation.
</enforcement>