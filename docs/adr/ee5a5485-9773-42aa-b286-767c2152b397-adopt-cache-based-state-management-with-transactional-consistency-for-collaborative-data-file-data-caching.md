# Adopt Cache-Based State Management with Transactional Consistency for Collaborative Data: File Data Caching

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The application manages collaborative real-time data synchronization across multiple clients using Firebase and WebSocket connections, requiring efficient state caching to minimize redundant network operations
- Scene version tracking and file data management require in-memory cache layers (FirebaseSceneVersionCache, filesMap, appJotaiStore) to maintain consistency between local state and remote storage
- Transaction-based operations (transaction.get, transaction.set) are used to ensure atomic updates when persisting collaborative scene data to Firebase
- Local storage quota constraints and IndexedDB usage necessitate cache management strategies with error handling for storage failures (localStorageQuotaExceededAtom)
- The system handles encrypted collaborative data that must be cached securely while maintaining performance for real-time updates

## Problem Statement

Collaborative applications require efficient state management that balances performance, consistency, and security when synchronizing data across multiple clients and storage backends. Without a structured caching strategy with transactional guarantees, the system risks data inconsistency, redundant network operations, storage quota violations, and race conditions during concurrent updates.

## Decision

1. MUST: File data caching MUST track storage failures using error state management (erroredFiles.set, localStorageQuotaExceededAtom)

## Policy Block

- MUST File data caching MUST track storage failures using error state management (erroredFiles.set, localStorageQuotaExceededAtom)

In scope:
- Firebase real-time database operations for collaborative scene data
- In-memory cache layers for scene versions, file data, and application state
- WebSocket-based collaborative data synchronization
- Local storage and IndexedDB persistence layers
- Transaction-based atomic updates to shared documents

Out of scope:
- Non-collaborative single-user data storage
- Static asset caching (images, fonts, stylesheets)
- HTTP response caching or CDN-level caching
- Database query result caching in backend services
- Browser navigation or page-level caching

Exceptions:
- EXC-001: Storage quota exceeded errors occur and data cannot be persisted to localStorage
- EXC-002: Initial scene load from remote source requires bypassing cache to fetch latest data

## Rationale

- Evidence shows consistent use of cache abstractions (FirebaseSceneVersionCache.cache.get/set, appJotaiStore.get/set, filesMap.set) across 4 files with 90.70% confidence, indicating an established architectural pattern
- Transaction-based operations (transaction.get, transaction.set) ensure atomic consistency for collaborative updates, preventing race conditions when multiple clients modify shared scene data
- Explicit storage quota management (localStorageQuotaExceededAtom, erroredFiles) demonstrates defensive programming against browser storage limitations, a common failure mode in web applications
- The pattern integrates with encryption libraries (@excalidraw/excalidraw/data/encryption) and secure data handling, aligning with the Security & Compliance > Secure Coding Practices category

## Consequences

Positive:
- Reduced network latency and bandwidth usage by caching frequently accessed scene versions and file data locally
- Improved data consistency through transactional Firebase operations that prevent partial updates and race conditions
- Enhanced reliability with graceful degradation when storage quotas are exceeded, maintaining application functionality
- Better debugging and monitoring capabilities through structured error logging (console.warn, console.error) for cache operations

Negative:
- Increased memory footprint from maintaining multiple cache layers (scene versions, files, application state) in browser memory
- Additional complexity in synchronization logic to keep cache layers consistent with remote Firebase state
- Potential for cache invalidation bugs if transaction boundaries are not properly maintained across all update paths
- Storage quota management adds error handling overhead and requires fallback strategies that complicate the codebase

## Alternatives

- Direct Firebase access without caching layer, relying on Firebase SDK's built-in caching (rejected)
  Rejected because: Firebase SDK caching is not optimized for real-time collaborative scene version tracking and does not provide fine-grained control over cache invalidation needed for this use case
  When valid: For simple CRUD applications with infrequent data access patterns where Firebase SDK defaults are sufficient
- Use a centralized state management library (Redux, MobX) with persistence middleware instead of custom cache abstractions (rejected)
  Rejected because: Generic state management libraries do not provide transaction-based consistency guarantees required for Firebase document updates and add unnecessary abstraction overhead
  When valid: For applications without real-time collaborative requirements or when not using Firebase as the backend
- Implement optimistic locking with version numbers instead of Firebase transactions (rejected)
  Rejected because: Optimistic locking requires conflict resolution logic and retry mechanisms, increasing complexity compared to Firebase's built-in transaction support
  When valid: When using databases that do not support native transactions or when conflict rates are very low

## Risks

- Cache invalidation bugs could lead to stale data being displayed to users, causing confusion in collaborative sessions
  Mitigation: Implement comprehensive integration tests for cache synchronization paths and add cache version tracking to detect staleness
  Owner: Engineering team
- Storage quota exceeded errors may occur more frequently on mobile devices or browsers with restrictive storage policies
  Mitigation: Monitor localStorageQuotaExceededAtom metrics in production and implement proactive cache eviction strategies based on LRU or data age
  Owner: Engineering team
- Transaction contention in Firebase could cause performance degradation under high concurrent update loads
  Mitigation: Implement exponential backoff retry logic for transaction failures and monitor Firebase transaction success rates
  Owner: Engineering team

## Implementation Notes

- Use FirebaseSceneVersionCache.cache.get(socket) and .set(socket, version) for tracking scene versions per WebSocket connection
- Wrap all Firebase document updates in transaction blocks: transaction.get(docRef) followed by transaction.set(docRef, data)
- Monitor appJotaiStore.get(localStorageQuotaExceededAtom) before attempting localStorage writes and handle quota exceeded gracefully
- Implement error tracking with erroredFiles.set(id, true) to prevent repeated write attempts for files that failed to persist
- Use console.warn for recoverable cache issues and console.error for critical failures that require investigation

## Continuation Context


Verify commands:
- grep -r 'transaction\.get\|transaction\.set' --include='*.ts' --include='*.tsx' excalidraw-app/data/
- grep -r 'FirebaseSceneVersionCache\.cache\.(get\|set)' --include='*.ts' excalidraw-app/
- grep -r 'localStorageQuotaExceededAtom' --include='*.ts' --include='*.tsx' excalidraw-app/
- grep -r '\.cache\.(get\|set)\|appJotaiStore\.(get\|set)\|filesMap\.set' --include='*.ts' --include='*.tsx' excalidraw-app/data/

Accept when:
- All Firebase document updates use transaction.get and transaction.set patterns (no direct docRef.set calls)
- Cache abstractions (FirebaseSceneVersionCache, appJotaiStore, filesMap) are used consistently across all data access paths
- Storage quota exceeded scenarios are handled with localStorageQuotaExceededAtom checks and error state tracking
- Console logging is present for cache operation failures (console.warn, console.error)

## Enforcement

- Verified by: Code review checklist requiring transaction-based Firebase operations
- Verified by: Static analysis rules detecting direct Firebase document writes without transactions
- Verified by: Integration tests validating cache consistency under concurrent update scenarios
- Verified by: Runtime monitoring of localStorageQuotaExceededAtom and error logging patterns
- Violation handling: CI pipeline fails if grep verification commands detect non-transactional Firebase writes
- Violation handling: Code review blocks merge if cache abstractions are bypassed for direct storage access
- Violation handling: Production monitoring alerts trigger when storage quota exceeded errors exceed threshold
- Violation handling: Post-incident reviews required for cache-related data consistency bugs
- Exception process: Document exception rationale in code comments explaining why direct storage access is required
- Exception process: Obtain approval from tech lead for any Firebase operations that cannot use transactions
- Exception process: Add explicit test coverage for exception cases to prevent regression
- Exception process: Update this ADR with new policy exceptions if pattern becomes recurring