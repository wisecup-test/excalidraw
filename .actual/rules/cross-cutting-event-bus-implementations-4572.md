# Adopt Map-Based Cache Layer for Event Bus and Collaboration State Management: Event Bus Implementations

These rules are ALWAYS ACTIVE for all event bus implementations, collaboration portal components, and integration layers that manage real-time collaboration state, event caching, and element version tracking.

### Rules

- **R-CACHE-001** MUST: Event bus implementations MUST use Map-based cache structures to store emitter instances keyed by event name (e.g., `this.emitters.get(name)`, `this.emitters.set(name, emitter)`).
- **R-CACHE-002** MUST: Initialize Map-based cache structures in component constructors (e.g., `this.emitters = new Map()`, `this.lastPayload = new Map()`, `this.broadcastedElementVersions = new Map()`).
- **R-CACHE-003** MUST: Always check cache existence with `.get()` before performing expensive operations like network broadcasts or event emissions to avoid redundant work.
- **R-CACHE-004** MUST: Update cache entries atomically using `.set()` immediately after successful state changes to maintain consistency between cache and actual state.
- **R-CACHE-005** MUST: Implement cleanup logic to remove cache entries when elements are deleted or users disconnect, using `.delete()` method to prevent memory leaks.
- **R-CACHE-006** SHOULD: Implement cache size monitoring and LRU eviction for long-running sessions to prevent unbounded memory growth.
- **R-CACHE-007** SHOULD: Use Map data structures (not plain objects) for all cache layer implementations in integration components.

### Verify

```bash
# Verify Map-based cache structures for emitters and payloads
grep -r 'this\.[a-zA-Z]*\.get(' packages/common/src/ excalidraw-app/collab/ --include='*.ts' --include='*.tsx' | grep -E '(emitters|lastPayload|broadcastedElementVersions|addedFiles)\.get'

# Verify Map-based cache set operations
grep -r 'this\.[a-zA-Z]*\.set(' packages/common/src/ excalidraw-app/collab/ --include='*.ts' --include='*.tsx' | grep -E '(emitters|lastPayload|broadcastedElementVersions|addedFiles)\.set'

# Verify Map constructor usage
grep -r 'new Map<' packages/common/src/ excalidraw-app/collab/ --include='*.ts' --include='*.tsx'
```

**Accept when:**
- Event bus implementations contain Map-based cache structures for emitters and last payload storage with corresponding `.get()` and `.set()` operations
- Collaboration portal components cache broadcasted element versions using Map structures and check cache before broadcasting updates
- All integration components use Map data structures (not plain objects) for cache layer implementation as verified by `new Map` declarations
- Cache cleanup logic is present for element deletion and user disconnection scenarios using `.delete()` method

<enforcement>
Claude Code MUST NOT skip or defer verification. All new event bus and collaboration integration components MUST implement Map-based cache structures. CI pipeline MUST fail if new integration components use plain objects instead of Map structures for caching. Code review MUST block merge if cache layer implementation deviates from established pattern without architectural justification.
</enforcement>