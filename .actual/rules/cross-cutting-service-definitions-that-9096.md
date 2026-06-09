# Adopt Cache-Backed Service Boundary Pattern with Get/Set/Delete Operations: Service Definitions That

These rules are ALWAYS ACTIVE for all service boundary implementations that manage stateful data and interact with external systems (Firebase, socket.io, IndexedDB) across the codebase.

### Rules

- **R-CACHE-001** MUST: Service definitions that interact with external systems (Firebase, socket.io, IndexedDB) MUST use cache layers to manage state consistency and reduce external calls.
- **R-CACHE-002** MUST: Cache-backed service boundaries MUST implement all three cache operations (get, set, delete) even if delete is not immediately needed, to ensure complete lifecycle management.
- **R-CACHE-003** MUST: Cache key types MUST be strongly typed using branded types (e.g., `type FileId = string & { __brand: 'FileId' }`) to ensure type safety.
- **R-CACHE-004** SHOULD: Cache lookups SHOULD use optional chaining (e.g., `cache?.get(key)`) to handle cases where the cache may not be initialized.
- **R-CACHE-005** SHOULD: Cache invalidation rules SHOULD be documented in code comments, especially for services that interact with external systems.
- **R-CACHE-006** MAY: Services MAY implement cache statistics (hit rate, size) for monitoring and debugging in development environments.
- **R-CACHE-007** SHOULD: Services with high cache churn SHOULD implement periodic cleanup or size limits to prevent unbounded memory growth.

### Verify

```bash
# Count Map-based cache operations across the codebase
grep -r 'Map<.*>\.get\|Map<.*>\.set\|Map<.*>\.delete' --include='*.ts' --include='*.tsx' packages/ excalidraw-app/ | wc -l

# Identify specific cache implementations
grep -r 'CACHE.*\.get\|CACHE.*\.set' --include='*.ts' --include='*.tsx' packages/ excalidraw-app/

# Run tests for cache-backed services
npm test -- --testPathPattern='(FileManager|Portal|Collab|LocalData)' --coverage
```

**Accept when:**
- All service boundaries that manage stateful data use Map-based cache structures with get/set/delete operations
- Grep commands identify consistent usage of Map cache operations across service boundary files
- Unit tests verify cache hit/miss scenarios and proper invalidation for all cache-backed services
- Code review confirms that new service boundaries follow the cache-backed pattern or document exceptions with performance justification
- Cache key types are strongly typed and documented
- Cache invalidation strategies are documented in code comments

<enforcement>
Claude Code MUST NOT skip or defer verification. All service boundary implementations MUST be reviewed against these rules during code review and CI pipeline checks. Violations without documented exceptions MUST block merge.
</enforcement>