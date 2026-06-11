/**
 * Quick-save snapshots of the current session, persisted to IndexedDB.
 *
 * Snapshots are lightweight checkpoints of the scene (elements + the
 * relevant subset of appState) that can be captured and restored within
 * the same browser, without going through a full export/import
 * round-trip. Image files are not duplicated into snapshots — they
 * already persist in the files store (see LocalData) and are resolved
 * by file id on restore.
 */

import { clearAppStateForLocalStorage } from "@excalidraw/excalidraw/appState";
import { randomId } from "@excalidraw/common";
import { createStore, del, entries, get, set } from "idb-keyval";

import { getNonDeletedElements } from "@excalidraw/element";

import type { ExcalidrawElement } from "@excalidraw/element/types";
import type { AppState } from "@excalidraw/excalidraw/types";

import { STORAGE_KEYS } from "../app_constants";

export type SessionSnapshot = {
  id: string;
  name: string;
  createdAt: number;
  elements: readonly ExcalidrawElement[];
  appState: ReturnType<typeof clearAppStateForLocalStorage>;
};

/** Keep only the most recent snapshots to bound storage usage. */
const MAX_SNAPSHOTS = 5;

export class SessionSnapshots {
  private static store = createStore(
    `${STORAGE_KEYS.IDB_SESSION_SNAPSHOTS}-db`,
    `${STORAGE_KEYS.IDB_SESSION_SNAPSHOTS}-store`,
  );

  /**
   * Persists a snapshot of the current scene and remembers it as the
   * most recent one. Snapshots beyond MAX_SNAPSHOTS are pruned, oldest
   * first.
   */
  static async save(
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    name?: string,
  ): Promise<SessionSnapshot> {
    const createdAt = Date.now();
    const snapshot: SessionSnapshot = {
      id: randomId(),
      name: name || `Snapshot ${new Date(createdAt).toLocaleString()}`,
      createdAt,
      elements: getNonDeletedElements(elements),
      appState: clearAppStateForLocalStorage(appState),
    };

    await set(snapshot.id, snapshot, SessionSnapshots.store);
    localStorage.setItem(STORAGE_KEYS.LOCAL_STORAGE_LAST_SNAPSHOT, snapshot.id);
    await SessionSnapshots.prune();

    return snapshot;
  }

  /** Loads a snapshot by id, or null when it (no longer) exists. */
  static async load(id: string): Promise<SessionSnapshot | null> {
    const snapshot = await get<SessionSnapshot>(id, SessionSnapshots.store);
    return snapshot ?? null;
  }

  /** Loads the most recently saved snapshot, or null when none exists. */
  static async loadLatest(): Promise<SessionSnapshot | null> {
    const id = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_LAST_SNAPSHOT);
    if (!id) {
      return null;
    }
    return SessionSnapshots.load(id);
  }

  /** Lists all stored snapshots, newest first. */
  static async list(): Promise<SessionSnapshot[]> {
    const stored = await entries<string, SessionSnapshot>(
      SessionSnapshots.store,
    );
    return stored
      .map(([, snapshot]) => snapshot)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  /** Deletes a snapshot by id. */
  static async delete(id: string): Promise<void> {
    await del(id, SessionSnapshots.store);
  }

  private static async prune() {
    const snapshots = await SessionSnapshots.list();
    for (const stale of snapshots.slice(MAX_SNAPSHOTS)) {
      await del(stale.id, SessionSnapshots.store);
    }
  }
}
