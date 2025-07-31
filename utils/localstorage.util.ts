import { TLocalStorageCount } from "./types";
/**
 *
 * @param key String,Identifies the unique obj in localstorage
 *
 * @param obj TLocalStorageCount, Value being saved against the key
 *
 * @description Creates an entry in localstorage of given unique key and value passed to it
 *
 * @returns void
 */
export function saveToLocalStorage(key: string, obj: TLocalStorageCount) {
  if (typeof key === "string" && typeof obj === "object") {
    localStorage.setItem(key, JSON.stringify(obj));
  }
}

/**
 *
 * @param key Identifies the unique obj in localstorage
 *
 * @description Retrives an entry in localstorage of given unique key
 *
 * @returns TLocalStorageCount
 */
export function getFromLocalStorage(key: string): TLocalStorageCount | null {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

/**
 *
 * @param key Identifies the unique obj in localstorage
 *
 * @description Deletes an entry in localstorage of given unique key
 *
 * @returns void
 */

export function clearLocalStorageKey(key: string) {
  localStorage.removeItem(key);
}
