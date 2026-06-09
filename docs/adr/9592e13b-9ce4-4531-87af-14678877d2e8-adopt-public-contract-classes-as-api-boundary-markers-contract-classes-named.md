# Adopt Public Contract Classes as API Boundary Markers: Contract Classes Named

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Activation

This ADR is ALWAYS ACTIVE for all modules that expose public APIs or service boundaries.

## Context

- The codebase contains multiple modules that expose public APIs through dedicated contract classes (Portal, LocalData, LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter, TTDIndexedDBAdapter)
- These contract classes serve as explicit boundaries between internal implementation details and external consumers, particularly for data persistence, collaboration, and storage layers
- The pattern appears consistently across different functional domains (collaboration via Portal, local storage via LocalData, TTD storage via TTDIndexedDBAdapter), suggesting an intentional architectural style
- Evidence shows these contracts integrate with external libraries (@excalidraw/excalidraw, idb-keyval, lodash.throttle) while maintaining clear API boundaries
- The pattern co-occurs with cache layers, event-driven boundaries, and concurrency models, indicating these contracts manage complex cross-cutting concerns

## Problem Statement

Without explicit API contract classes, module boundaries become implicit and difficult to enforce, leading to tight coupling between internal implementation details and external consumers. This makes it harder to evolve implementations independently, test components in isolation, and reason about system architecture.

## Decision

1. SHOULD: Contract classes SHOULD be named to clearly indicate their domain responsibility and API nature (e.g., suffixes like 'Adapter', 'Portal', or domain names like 'LocalData')

## Policy Block

- SHOULD Contract classes SHOULD be named to clearly indicate their domain responsibility and API nature (e.g., suffixes like 'Adapter', 'Portal', or domain names like 'LocalData')

In scope:
- All modules that expose public APIs to other parts of the application
- Data persistence layers (LocalData, TTDIndexedDBAdapter)
- Collaboration and communication boundaries (Portal)
- Library and resource management interfaces (LibraryIndexedDBAdapter)
- Any component that integrates external libraries or frameworks

Out of scope:
- Internal utility functions that are not part of public APIs
- Private helper classes used only within a single module
- Type definitions and interfaces that don't encapsulate behavior
- Pure data transfer objects without business logic

Exceptions:
- EX-001: A module is being deprecated and creating a new contract class would add unnecessary overhead
- EX-002: Prototyping or experimental features where API stability is not yet required

## Rationale

- The pattern appears in 3 distinct files with 91.07% confidence, indicating consistent architectural intent rather than coincidental similarity
- Contract classes provide clear seams for testing, allowing mock implementations to replace real storage or communication layers
- Encapsulating external library dependencies (idb-keyval, @excalidraw/excalidraw, lodash.throttle) behind contracts enables library upgrades without affecting consumers
- The co-occurrence with cache layers and event-driven boundaries suggests these contracts successfully manage complex state and communication patterns while maintaining clean APIs

## Consequences

Positive:
- Clear architectural boundaries make it easier to understand system structure and module responsibilities
- Improved testability through well-defined seams that can be mocked or stubbed
- Reduced coupling between modules enables independent evolution of implementations
- Easier onboarding for new developers who can identify public APIs by looking for contract classes
- Better encapsulation of cross-cutting concerns like caching, error handling, and logging

Negative:
- Additional indirection layer may add slight complexity for simple use cases
- Requires discipline to maintain contract boundaries and avoid leaking implementation details
- May lead to proliferation of adapter classes if not carefully managed
- Initial development overhead to design and implement contract classes properly

## Alternatives

- Export functions directly without contract classes (rejected)
  Rejected because: Direct function exports don't provide clear boundaries for encapsulating state, managing dependencies, or grouping related operations. The evidence shows complex state management (cache layers, event handlers) that requires class-based encapsulation.
  When valid: For pure utility functions with no state or external dependencies
- Use TypeScript interfaces only without concrete contract classes (rejected)
  Rejected because: Interfaces alone don't encapsulate implementation logic, error handling, or integration with external libraries. The evidence shows contract classes actively manage caching, event handling, and library integration.
  When valid: When defining pure data contracts between modules without behavior
- Facade pattern with multiple implementation classes behind a single interface (deferred)
  When valid: Could be adopted in the future if multiple implementations of the same contract are needed (e.g., different storage backends), but current evidence shows single implementations per domain

## Risks

- Developers may bypass contract classes and access internal implementations directly, breaking encapsulation
  Mitigation: Use TypeScript private/protected modifiers, code review enforcement, and linting rules to detect direct access to internal modules
  Owner: Engineering team and code reviewers
- Contract classes may become bloated 'god objects' if not properly scoped to single responsibilities
  Mitigation: Apply single responsibility principle during design reviews, split contracts when they exceed reasonable complexity thresholds
  Owner: Architecture team
- Over-engineering simple modules with unnecessary contract layers
  Mitigation: Apply pattern only to modules with clear public API needs, allow exceptions for simple utilities as documented in policy exceptions
  Owner: Tech leads

## Implementation Notes

- Name contract classes clearly to indicate their domain (e.g., Portal for collaboration, LocalData for local storage, TTDIndexedDBAdapter for TTD storage)
- Use the Adapter suffix when the primary purpose is integrating with external libraries (as seen with LibraryIndexedDBAdapter, TTDIndexedDBAdapter)
- Keep internal state (cache layers like broadcastedElementVersions, erroredFiles) private and expose only necessary public methods
- Handle cross-cutting concerns (logging, error handling, state management) within the contract class rather than exposing them to consumers
- Document the public API surface clearly, distinguishing between public contract methods and internal implementation details

## Continuation Context


Verify commands:
- grep -r 'export class.*Adapter\|export class.*Portal\|export class.*Data' --include='*.ts' --include='*.tsx' | wc -l
- grep -r 'api\.public\.contracts=' --include='*.ts' --include='*.tsx' | grep -o 'api\.public\.contracts=[^;]*' | cut -d'=' -f2
- find . -name '*.ts' -o -name '*.tsx' | xargs grep -l 'export class' | xargs grep -L 'private\|protected' | wc -l

Accept when:
- Each module with public API responsibilities has at least one identifiable contract class (Portal, LocalData, or Adapter-suffixed classes)
- Contract classes encapsulate external library dependencies and internal state management without exposing implementation details
- Grep for 'api.public.contracts=' annotations returns the expected contract class names (Portal, LocalData, LibraryIndexedDBAdapter, TTDIndexedDBAdapter, etc.)

## Enforcement

- Verified by: Code review process checking for proper contract class usage in new modules
- Verified by: Static analysis tools detecting direct access to internal implementations
- Verified by: Architecture review for new public APIs ensuring contract classes are defined
- Verified by: Automated grep-based verification in CI pipeline checking for contract class patterns
- Violation handling: Code review rejection for PRs that expose internal implementations without contract classes
- Violation handling: Refactoring tickets created for existing violations discovered during audits
- Violation handling: Architecture team consultation required for modules that cannot follow the pattern
- Violation handling: Documentation updates required when exceptions are granted
- Exception process: Developer submits exception request to tech lead with justification
- Exception process: Tech lead reviews against policy exception criteria (deprecation, experimental features)
- Exception process: Architecture team approval required for permanent exceptions
- Exception process: Exception documented in module README with rationale and review date
- Exception process: Exceptions reviewed quarterly to determine if they can be resolved