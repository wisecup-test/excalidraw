# Establish Typed Public API Contracts with Explicit Export Boundaries: Public Contracts Exported

These rules are ALWAYS ACTIVE for all TypeScript modules that provide functionality to other modules or external consumers, including service classes, shared libraries, common packages, event bus implementations, file managers, collaboration services, and other architectural components.

### Rules

- **R-API-001** MUST: Public API contracts MUST be exported as named types (interfaces, type aliases, or classes) that consumers can import and reference.

### Verify

```bash
# Count exported types, interfaces, and classes across the codebase
grep -r "export type\|export interface\|export class" packages/*/src/*.ts excalidraw-app/**/*.ts | wc -l

# Verify TypeScript compilation succeeds with strict mode
tsc --noEmit --strict && echo 'Type checking passed'

# Verify service modules contain public API contracts
grep -r "export type\|export interface\|export class" packages/*/src/index.ts excalidraw-app/**/index.ts | cut -d':' -f1 | sort -u
```

**Accept when:**
- All service modules contain at least one exported type, interface, or class representing their public API contract
- TypeScript compilation succeeds with strict mode enabled, confirming all type contracts are internally consistent
- Code review confirms that internal implementation details (cache layers, private methods) are not exposed through public exports
- Exported types use clear naming conventions (e.g., <ServiceName>API, <Domain>Contract)
- Internal implementation details are not leaked into consumer code through public exports

<enforcement>
Claude Code MUST NOT skip or defer verification. TypeScript strict mode compilation and explicit API contract definition are mandatory before accepting changes to service modules and shared libraries.
</enforcement>