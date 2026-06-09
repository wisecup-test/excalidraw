# Adopt Service Boundary Pattern with Get-Based Data Access: Cross Service Data

These rules are ALWAYS ACTIVE for all cross-service data access patterns in the codebase, including Firebase cache operations, state management stores, transaction handlers, and collaborative data structures.

### Rules

- **R-SVC-001** MUST: All cross-service data access MUST use explicit get-based accessor methods (e.g., cache.get(), store.get(), transaction.get()) rather than direct property access.

### Verify

```bash
# Count get-based accessor usage across service boundaries
grep -r '\.get(' excalidraw-app/data/ excalidraw-app/collab/ | grep -E '(cache|store|transaction|collaborators)\.get\(' | wc -l

# Identify unprotected JSON.parse operations
grep -r 'JSON\.parse' excalidraw-app/ | grep -v 'try' | wc -l

# Lint for direct access to service data structures
eslint --rule 'no-restricted-syntax: [error, {selector: "MemberExpression[object.name=/cache|store/][property.name!=get][property.name!=set]", message: "Direct access to service data structures is not allowed"}]' excalidraw-app/
```

**Accept when:**
- All cross-service data access uses explicit get/set accessor methods as verified by grep patterns showing consistent usage
- No direct property access to cache, store, or transaction objects outside of service implementation files
- All JSON.parse operations are wrapped in try-catch blocks with error logging
- Linting rules pass with no violations of direct data structure access patterns
- FirebaseSceneVersionCache.get() and FirebaseSceneVersionCache.cache.get() operations are consistently used
- appJotaiStore.get() and appJotaiStore.set() operations are used for all state management access
- transaction.get() and transaction.set() operations are used for Firebase transactions
- Map-based collaborator access via collaborators.get() and addedFiles.get() is enforced

<enforcement>
Claude Code MUST NOT skip or defer verification of service boundary accessor patterns. All cross-service data access violations MUST be flagged during code review and CI pipeline checks MUST fail if direct data structure access is detected.
</enforcement>