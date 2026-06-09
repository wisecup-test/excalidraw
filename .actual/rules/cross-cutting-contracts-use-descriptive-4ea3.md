# Establish Typed Public API Contracts with Explicit Export Boundaries: Contracts Use Descriptive

These rules are ALWAYS ACTIVE for all TypeScript modules that provide functionality to other modules or external consumers, including service classes, shared libraries, common packages, event bus implementations, file managers, collaboration services, and other architectural components.

### Rules

- **R-API-001** SHOULD: API contracts SHOULD use descriptive, domain-specific names that clearly communicate their purpose and scope (e.g., ColorPaletteCustom, ColorShadesIndexes, AppEventPayloadMap).

### Verify

```bash
# Count exported types, interfaces, and classes across service modules
grep -r "export type\|export interface\|export class" packages/*/src/*.ts excalidraw-app/**/*.ts | wc -l

# Verify TypeScript compilation with strict mode
tsc --noEmit --strict && echo 'Type checking passed'

# Check for public API contract definitions
grep -r "export type\|export interface" . | grep -E "(API|Contract|Service)" | wc -l
```

**Accept when:**
- All service modules contain at least one exported type, interface, or class representing their public API contract
- TypeScript compilation succeeds with strict mode enabled, confirming all type contracts are internally consistent
- Code review confirms that internal implementation details (cache layers, private methods) are not exposed through public exports
- Exported types use descriptive, domain-specific naming conventions that clearly indicate their purpose and scope

<enforcement>
Claude Code MUST NOT skip or defer verification. TypeScript strict mode compilation and exported type naming conventions MUST be verified before accepting changes to service module boundaries.
</enforcement>