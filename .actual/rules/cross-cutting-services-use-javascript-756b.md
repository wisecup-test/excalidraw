# Adopt In-Memory Map-Based Caching for Service State Management: Services Use Javascript

These rules are ALWAYS ACTIVE for all JavaScript and TypeScript service files implementing in-memory caching for transient state, computed values, and session data.

### Rules

- **R-CACHE-001** MUST: Services MUST use JavaScript Map objects as the primary in-memory cache layer for transient state and computed values.
- **R-CACHE-002** MUST: Cache instances MUST be encapsulated as private class members or module-scoped constants, not exposed as public properties.
- **R-CACHE-003** MUST: Cache access patterns MUST use get(), set(), and delete() methods consistently; bracket notation is not permitted for Map-based caches.
- **R-CACHE-004** SHOULD: Cache lookups SHOULD use optional chaining to handle missing keys gracefully (e.g., `cache?.get(key)`).
- **R-CACHE-005** SHOULD: Caches tied to component lifecycle SHOULD implement explicit cleanup methods (e.g., `cache.delete(id)` on unmount).
- **R-CACHE-006** SHOULD: Cache instances SHOULD be documented with purpose, key types, value types, and invalidation strategy in code comments.
- **R-CACHE-007** SHOULD: Object-keyed caches SHOULD consider using WeakMap to enable automatic garbage collection when keys are no longer referenced.
- **R-CACHE-008** MUST NOT: Persistent data requiring durability across application restarts MUST NOT be stored exclusively in Map-based caches without durable backup.
- **R-CACHE-009** MUST NOT: Data requiring ACID transaction guarantees, cross-process access, or distributed sharing MUST NOT use Map-based caching as the sole storage mechanism.

### Verify

```bash
# Count Map instantiations in service files
grep -r "new Map<" --include="*.ts" --include="*.tsx" | wc -l

# Verify cache access patterns use get/set/delete methods
grep -r "\.get(\|\.set(\|\.delete(" --include="*.ts" --include="*.tsx" | grep -v node_modules | head -20

# Count CACHE constants using Map
grep -r "CACHE" --include="*.ts" --include="*.tsx" | grep "Map" | wc -l

# Verify Map instances are private or module-scoped
grep -r "private.*Map<\|const.*Map<" --include="*.ts" --include="*.tsx" | grep -v node_modules

# Check for bracket notation on Map objects (anti-pattern)
grep -r "cache\[" --include="*.ts" --include="*.tsx" | grep -v node_modules
```

**Accept when:**
- Map-based cache instances are found in service classes for transient state management
- Cache access patterns consistently use get(), set(), and delete() methods
- Cache instances are encapsulated within service boundaries (private members or module scope)
- No persistent data is stored exclusively in Map-based caches without durable backup
- Cache instances include documentation of purpose, key/value types, and invalidation strategy
- Cleanup methods are implemented for caches tied to component lifecycle

<enforcement>
Claude Code MUST NOT skip or defer verification of Map-based cache implementations. All new cache instances MUST be reviewed against R-CACHE-001 through R-CACHE-009. Violations MUST trigger code review feedback requesting refactoring to compliant patterns or documented exception approval.
</enforcement>