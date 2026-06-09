# Adopt Service Boundary Pattern with Get-Based Data Access: Service Boundary Accessors

These rules are ALWAYS ACTIVE for all files matching the configured scope: FirebaseSceneVersionCache operations, appJotaiStore state management, Firebase transaction operations, and Map-based collaborator access patterns crossing service or module boundaries.

### Rules

- **R-SBA-001** MUST: Service boundary accessors MUST be paired with corresponding set methods (e.g., cache.set(), store.set(), transaction.set()) to maintain symmetry and enable interception.

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

<enforcement>
Claude Code MUST NOT skip or defer verification of service boundary accessor patterns. All cross-service data access MUST use explicit get/set methods. Violations block merge requests until remediated.
</enforcement>