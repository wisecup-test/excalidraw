# Adopt Map-Based Cache Layer for Event Bus and Collaboration State Management: Integration Components Check

These rules are ALWAYS ACTIVE for all integration components in the event bus and collaboration state management layer, including appEventBus.ts, Portal.tsx, and Collab.tsx files.

### Rules

- **R-CACHE-001** SHOULD: Integration components SHOULD check cache existence using .get() before performing expensive operations like network broadcasts or event emissions.

### Verify

```bash
# Verify Map-based cache structures are used for emitters and payload storage
grep -r 'this\.[a-zA-Z]*\.get(' packages/common/src/ excalidraw-app/collab/ --include='*.ts' --include='*.tsx' | grep -E '(emitters|lastPayload|broadcastedElementVersions|addedFiles)\.get'

# Verify cache entries are updated atomically with .set()
grep -r 'this\.[a-zA-Z]*\.set(' packages/common/src/ excalidraw-app/collab/ --include='*.ts' --include='*.tsx' | grep -E '(emitters|lastPayload|broadcastedElementVersions|addedFiles)\.set'

# Verify Map data structures are initialized
grep -r 'new Map<' packages/common/src/ excalidraw-app/collab/ --include='*.ts' --include='*.tsx'
```

**Accept when:**
- Event bus implementations contain Map-based cache structures for emitters and last payload storage with corresponding .get() and .set() operations
- Collaboration portal components cache broadcasted element versions using Map structures and check cache before broadcasting updates
- All integration components use Map data structures (not plain objects) for cache layer implementation as verified by 'new Map' declarations
- Cache entries are initialized in component constructors using Map constructor syntax
- Cache lookups precede expensive operations to avoid redundant work
- Cache updates occur atomically immediately after successful state changes

<enforcement>
Clause Code MUST NOT skip or defer verification. All new integration components must implement Map-based cache structures with .get() checks before expensive operations. CI pipeline must fail if plain objects are used instead of Map structures for caching. Code review must block merges that deviate from this pattern without architectural justification.
</enforcement>