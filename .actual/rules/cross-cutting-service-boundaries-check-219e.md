# Adopt Cache-Backed Service Boundary Pattern with Get/Set/Delete Operations: Service Boundaries Check

These rules are ALWAYS ACTIVE for all service boundary implementations that manage stateful data, including cache layers for external system integrations (Firebase, socket.io, IndexedDB), color palette services, file management services, collaboration state services, local data persistence services, lock management services, and event bus implementations.

### Rules

- **R-CACHE-001** SHOULD: Service boundaries SHOULD check cache existence using optional chaining (e.g., `cache?.get(key)`) before performing expensive operations.

### Verify

```bash
# Verify Map-based cache usage across service boundaries
grep -r 'Map<.*>\.get\|Map<.*>\.set\|Map<.*>\.delete' --include='*.ts' --include='*.tsx' packages/ excalidraw-app/ | wc -l

# Identify cache patterns in service implementations
grep -r 'CACHE.*\.get\|CACHE.*\.set' --include='*.ts' --include='*.tsx' packages/ excalidraw-app/

# Run tests for cache-backed services
npm test -- --testPathPattern='(FileManager|Portal|Collab|LocalData)' --coverage
```

**Accept when:**
- All service boundaries that manage stateful data use Map-based cache structures with get/set/delete operations
- Grep commands identify consistent usage of Map cache operations across service boundary files
- Unit tests verify cache hit/miss scenarios and proper invalidation for all cache-backed services
- Code review confirms that new service boundaries follow the cache-backed pattern or document exceptions
- Optional chaining is used for cache lookups to handle uninitialized cache scenarios

<enforcement>
Claude Code MUST NOT skip or defer verification. All service boundary implementations must be reviewed for compliance with cache-backed patterns, and violations must be escalated to the architecture review team unless a documented exception applies.
</enforcement>