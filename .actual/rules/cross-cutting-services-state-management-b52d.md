# Establish Typed Public API Contracts with Explicit Export Boundaries: Services State Management

These rules are ALWAYS ACTIVE for all TypeScript modules that provide functionality to other modules or external consumers, including service classes, shared libraries, common packages, event bus implementations, file managers, collaboration services, and other architectural components.

### Rules

- **R-SVC-001** SHOULD: Services with state management (caches, stores) SHOULD expose only the operational interface, not the underlying storage mechanism.

### Verify

```bash
# Count exported types, interfaces, and classes across service modules
grep -r "export type\|export interface\|export class" packages/*/src/*.ts excalidraw-app/**/*.ts | wc -l

# Verify TypeScript compilation with strict mode
tsc --noEmit --strict && echo 'Type checking passed'

# Check for explicit API contract definitions
grep -r "export type\|export interface" packages/*/src/*.ts excalidraw-app/**/*.ts | head -20
```

**Accept when:**
- All service modules contain at least one exported type, interface, or class representing their public API contract
- TypeScript compilation succeeds with strict mode enabled, confirming all type contracts are internally consistent
- Code review confirms that internal implementation details (cache layers, private methods) are not exposed through public exports
- Services expose well-defined interfaces that establish clear boundaries between internal implementation and external consumers

<enforcement>
Claude Code MUST NOT skip or defer verification. TypeScript strict mode compilation is mandatory in CI pipeline. Code review checklist MUST require explicit API contract definition for new services. Pull requests MUST be blocked until proper API boundary definition is confirmed.
</enforcement>