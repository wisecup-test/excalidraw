# Adopt Cache-Backed Service Boundary Pattern with Get/Set/Delete Operations: Service Boundary Implementations

These rules are ALWAYS ACTIVE for all service boundary implementations that manage stateful data, including cache layers for external system integrations (Firebase, socket.io, IndexedDB), color palette services, file management services, collaboration state services, local data persistence services, lock management services, and event bus implementations.

### Rules

- **R-CACHE-001** MUST: Service boundary implementations MUST use Map-based cache structures (e.g., Map.get(), Map.set(), Map.delete()) for state management when caching is required.

### Verify

```bash
# Count Map-based cache operations across service boundary files
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
- Code review confirms that new service boundaries follow the cache-backed pattern or document exceptions
- Cache implementations include all three operations (get, set, delete) for complete lifecycle management
- Cache invalidation rules are documented in code comments for services interacting with external systems

<enforcement>
Clause Code MUST NOT skip or defer verification of Map-based cache structure usage in service boundary implementations. All violations require documented exceptions or refactoring.
</enforcement>