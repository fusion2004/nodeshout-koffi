import * as libshout from "./libshout.js";
import type { ShoutMetadataPtr } from "./libshout.js";
import type { ShoutErrorType } from "./index.js";

/**
 * Wrapper around a libshout `shout_metadata_t` handle. Used with
 * `Shout#setMetadataUtf8()` to push live metadata to MP3/AAC streams.
 */
export class ShoutMetadata {
  /** @internal */
  readonly ptr: ShoutMetadataPtr;

  constructor() {
    const ptr = libshout.shout_metadata_new();
    if (ptr == null) throw new Error("shout_metadata_new() returned NULL");
    this.ptr = ptr;
  }

  /**
   * Free allocated memory. Must be called when finished with the instance.
   */
  free(): void {
    libshout.shout_metadata_free(this.ptr);
  }

  /**
   * Add a metadata field. You'll probably want `name` of "song", though "url"
   * may also be useful. Values must be UTF-8.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  add(name: string, value: string): ShoutErrorType {
    return libshout.shout_metadata_add(this.ptr, name, value);
  }
}
