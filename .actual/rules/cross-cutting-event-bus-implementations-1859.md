# Adopt Map-Based Cache Layer for Event Bus and Collaboration State Management: Event Bus Implementations

These rules are ALWAYS ACTIVE for all event bus implementations, collaboration portal components, and integration layers that manage real-time collaboration state, event caching, and element version tracking.

### Rules

- **R-CACHE-001** MUST: Event bus implementations MUST cache the last payload for each event type to support replay behavior for late subscribers (e.g., `this.lastPayload.get(name)`, `this.lastPayload.set(name, args)`).
- **R-CACHE-002** MUST: All cache layer implementations MUST use Map data structures (not plain objects) for O(1) lookup and insertion performance on frequently accessed state data.
- **R-CACHE-003** MUST: Cache entries MUST be updated atomically using `.set()` immediately after successful state changes to maintain consistency between cache and actual state.
- **R-CACHE-004** MUST: Cleanup logic MUST be implemented to remove cache entries when elements are deleted or users disconnect, using `.delete()` method to prevent memory leaks.
- **R-CACHE-005** SHOULD: Cache size monitoring and LRU eviction policies SHOULD be implemented for long-running sessions to prevent unbounded memory growth.
- **R-CACHE-006** SHOULD: Cache existence SHOULD be checked with `.get()` before performing expensive operations like network broadcasts or event emissions to avoid redundant work.

### Verify

```bash
# Verify Map-based cache structures for emitters and last payload storage
grep -r 'this\.[a-zA-Z]*\.get(' packages/common/src/ excalidraw-app/collab/ --include='*.ts' --include='*.tsx' | grep -E '(emitters|lastPayload|broadcastedElementVersions|addedFiles)\.get'

# Verify .set() operations on cache structures
grep -r 'this\.[a-zA-Z]*\.set(' packages/common/src/ excalidraw-app/collab/ --include='*.ts' --include='*.tsx' | grep -E '(emitters|lastPayload|broadcastedElementVersions|addedFiles)\.set'

# Verify Map declarations in integration layer
grep -r 'new Map<' packages/common/src/ excalidraw-app/collab/ --include='*.ts' --include='*.tsx'
```

**Accept when:**
- Event bus implementations contain Map-based cache structures for emitters and last payload storage with corresponding `.get()` and `.set()` operations
- Collaboration portal components cache broadcasted element versions using Map structures and check cache before broadcasting updates
- All integration components use Map data structures (not plain objects) for cache layer implementation as verified by `new Map` declarations
- Cache cleanup logic is present for element deletion and user disconnection scenarios using `.delete()` method
- No plain JavaScript objects are used for cache layer implementation in event bus or collaboration integration components

<enforcement>
Claude Code MUST NOT skip or defer verification. All new event bus and collaboration integration components MUST implement Map-based cache structures. CI pipeline MUST fail if new integration components use plain objects instead of Map structures for caching. Code review MUST block merge if cache layer implementation deviates from established pattern without architectural justification.
</enforcement>