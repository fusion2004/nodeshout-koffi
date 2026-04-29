import koffi from "koffi";
import type { KoffiFunc, IKoffiLib } from "koffi";

type IKoffiCType = ReturnType<typeof koffi.opaque>;

declare const ShoutPtrBrand: unique symbol;
declare const ShoutMetadataPtrBrand: unique symbol;
export type ShoutPtr = { readonly [ShoutPtrBrand]: "shout_t" };
export type ShoutMetadataPtr = { readonly [ShoutMetadataPtrBrand]: "shout_metadata_t" };

function resolveOrCreate(name: string): IKoffiCType {
  try {
    return koffi.resolve(name);
  } catch {
    return koffi.opaque(name);
  }
}

resolveOrCreate("shout_t");
resolveOrCreate("shout_metadata_t");

function loadLibshout(): IKoffiLib {
  const candidates = [
    "libshout.so",
    "libshout.so.3",
    "libshout.dylib",
    "/opt/homebrew/lib/libshout.dylib",
    "/usr/local/lib/libshout.dylib",
  ];
  for (const candidate of candidates) {
    try {
      return koffi.load(candidate);
    } catch {
      /* try next */
    }
  }
  throw new Error(
    "Could not find libshout. Install it with:\n" +
      "  macOS:         brew install libshout\n" +
      "  Debian/Ubuntu: apt-get install libshout3-dev",
  );
}

const lib: IKoffiLib = loadLibshout();

// Lifecycle
export const shout_init = lib.func("void shout_init()") as KoffiFunc<() => void>;
export const shout_shutdown = lib.func("void shout_shutdown()") as KoffiFunc<() => void>;
export const shout_version = lib.func(
  "str shout_version(_Out_ int *major, _Out_ int *minor, _Out_ int *patch)",
) as KoffiFunc<(major: [number], minor: [number], patch: [number]) => string>;

// Instance management
export const shout_new = lib.func("shout_t *shout_new()") as KoffiFunc<() => ShoutPtr | null>;
export const shout_free = lib.func("void shout_free(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => void
>;

// Error handling
export const shout_get_error = lib.func("str shout_get_error(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => string | null
>;
export const shout_get_errno = lib.func("int shout_get_errno(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => number
>;
export const shout_get_connected = lib.func("int shout_get_connected(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => number
>;

// Host
export const shout_set_host = lib.func("int shout_set_host(shout_t *self, str host)") as KoffiFunc<
  (self: ShoutPtr, host: string) => number
>;
export const shout_get_host = lib.func("str shout_get_host(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => string | null
>;

// Port
export const shout_set_port = lib.func(
  "int shout_set_port(shout_t *self, uint16_t port)",
) as KoffiFunc<(self: ShoutPtr, port: number) => number>;
export const shout_get_port = lib.func("uint16_t shout_get_port(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => number
>;

// User
export const shout_set_user = lib.func("int shout_set_user(shout_t *self, str user)") as KoffiFunc<
  (self: ShoutPtr, user: string) => number
>;
export const shout_get_user = lib.func("str shout_get_user(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => string | null
>;

// Password
export const shout_set_password = lib.func(
  "int shout_set_password(shout_t *self, str password)",
) as KoffiFunc<(self: ShoutPtr, password: string) => number>;
export const shout_get_password = lib.func("str shout_get_password(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => string | null
>;

// Mount
export const shout_set_mount = lib.func(
  "int shout_set_mount(shout_t *self, str mount)",
) as KoffiFunc<(self: ShoutPtr, mount: string) => number>;
export const shout_get_mount = lib.func("str shout_get_mount(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => string | null
>;

// Agent
export const shout_set_agent = lib.func(
  "int shout_set_agent(shout_t *self, str agent)",
) as KoffiFunc<(self: ShoutPtr, agent: string) => number>;
export const shout_get_agent = lib.func("str shout_get_agent(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => string | null
>;

// TLS
export const shout_set_tls = lib.func("int shout_set_tls(shout_t *self, int mode)") as KoffiFunc<
  (self: ShoutPtr, mode: number) => number
>;
export const shout_get_tls = lib.func("int shout_get_tls(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => number
>;

// CA directory / file
export const shout_set_ca_directory = lib.func(
  "int shout_set_ca_directory(shout_t *self, str directory)",
) as KoffiFunc<(self: ShoutPtr, directory: string) => number>;
export const shout_get_ca_directory = lib.func(
  "str shout_get_ca_directory(shout_t *self)",
) as KoffiFunc<(self: ShoutPtr) => string | null>;
export const shout_set_ca_file = lib.func(
  "int shout_set_ca_file(shout_t *self, str file)",
) as KoffiFunc<(self: ShoutPtr, file: string) => number>;
export const shout_get_ca_file = lib.func("str shout_get_ca_file(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => string | null
>;

// Allowed ciphers
export const shout_set_allowed_ciphers = lib.func(
  "int shout_set_allowed_ciphers(shout_t *self, str ciphers)",
) as KoffiFunc<(self: ShoutPtr, ciphers: string) => number>;
export const shout_get_allowed_ciphers = lib.func(
  "str shout_get_allowed_ciphers(shout_t *self)",
) as KoffiFunc<(self: ShoutPtr) => string | null>;

// Client certificate
export const shout_set_client_certificate = lib.func(
  "int shout_set_client_certificate(shout_t *self, str certificate)",
) as KoffiFunc<(self: ShoutPtr, certificate: string) => number>;
export const shout_get_client_certificate = lib.func(
  "str shout_get_client_certificate(shout_t *self)",
) as KoffiFunc<(self: ShoutPtr) => string | null>;

// Generic metadata
export const shout_set_meta = lib.func(
  "int shout_set_meta(shout_t *self, str name, str value)",
) as KoffiFunc<(self: ShoutPtr, name: string, value: string) => number>;
export const shout_get_meta = lib.func("str shout_get_meta(shout_t *self, str name)") as KoffiFunc<
  (self: ShoutPtr, name: string) => string | null
>;

// Audio info
export const shout_set_audio_info = lib.func(
  "int shout_set_audio_info(shout_t *self, str key, str value)",
) as KoffiFunc<(self: ShoutPtr, key: string, value: string) => number>;
export const shout_get_audio_info = lib.func(
  "str shout_get_audio_info(shout_t *self, str key)",
) as KoffiFunc<(self: ShoutPtr, key: string) => string | null>;

// Public
export const shout_set_public = lib.func(
  "int shout_set_public(shout_t *self, uint32_t is_public)",
) as KoffiFunc<(self: ShoutPtr, isPublic: number) => number>;
export const shout_get_public = lib.func("uint32_t shout_get_public(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => number
>;

// Content language
export const shout_set_content_language = lib.func(
  "int shout_set_content_language(shout_t *self, str content_language)",
) as KoffiFunc<(self: ShoutPtr, contentLanguage: string | null) => number>;
export const shout_get_content_language = lib.func(
  "str shout_get_content_language(shout_t *self)",
) as KoffiFunc<(self: ShoutPtr) => string | null>;

// Content format
export const shout_set_content_format = lib.func(
  "int shout_set_content_format(shout_t *self, uint32_t format, uint32_t usage, str codecs)",
) as KoffiFunc<(self: ShoutPtr, format: number, usage: number, codecs: string | null) => number>;
export const shout_get_content_format = lib.func(
  "int shout_get_content_format(shout_t *self, _Out_ uint32_t *format, _Out_ uint32_t *usage, _Out_ str *codecs)",
) as KoffiFunc<
  (self: ShoutPtr, format: [number], usage: [number], codecs: [string | null]) => number
>;

// Protocol
export const shout_set_protocol = lib.func(
  "int shout_set_protocol(shout_t *self, uint32_t protocol)",
) as KoffiFunc<(self: ShoutPtr, protocol: number) => number>;
export const shout_get_protocol = lib.func(
  "uint32_t shout_get_protocol(shout_t *self)",
) as KoffiFunc<(self: ShoutPtr) => number>;

// Nonblocking
export const shout_set_nonblocking = lib.func(
  "int shout_set_nonblocking(shout_t *self, uint32_t nonblocking)",
) as KoffiFunc<(self: ShoutPtr, nonblocking: number) => number>;
export const shout_get_nonblocking = lib.func(
  "uint32_t shout_get_nonblocking(shout_t *self)",
) as KoffiFunc<(self: ShoutPtr) => number>;

// Connection
export const shout_open = lib.func("int shout_open(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => number
>;
export const shout_close = lib.func("int shout_close(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => number
>;

// Send data
export const shout_send = lib.func(
  "int shout_send(shout_t *self, const uint8_t *data, uintptr_t len)",
) as KoffiFunc<(self: ShoutPtr, data: Buffer | Uint8Array, len: number) => number>;
export const shout_send_raw = lib.func(
  "intptr_t shout_send_raw(shout_t *self, const uint8_t *data, uintptr_t len)",
) as KoffiFunc<(self: ShoutPtr, data: Buffer | Uint8Array, len: number) => number>;

// Timing
export const shout_queuelen = lib.func("intptr_t shout_queuelen(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => number
>;
export const shout_sync = lib.func("void shout_sync(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => void
>;
export const shout_delay = lib.func("int shout_delay(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => number
>;

// MP3/AAC metadata
export const shout_set_metadata_utf8 = lib.func(
  "int shout_set_metadata_utf8(shout_t *self, shout_metadata_t *metadata)",
) as KoffiFunc<(self: ShoutPtr, metadata: ShoutMetadataPtr) => number>;
export const shout_metadata_new = lib.func("shout_metadata_t *shout_metadata_new()") as KoffiFunc<
  () => ShoutMetadataPtr | null
>;
export const shout_metadata_free = lib.func(
  "void shout_metadata_free(shout_metadata_t *metadata)",
) as KoffiFunc<(metadata: ShoutMetadataPtr) => void>;
export const shout_metadata_add = lib.func(
  "int shout_metadata_add(shout_metadata_t *metadata, str key, str value)",
) as KoffiFunc<(metadata: ShoutMetadataPtr, key: string, value: string) => number>;

// ----- Obsolete (kept for backward compatibility; do not use in new code) -----

export const shout_set_name = lib.func("int shout_set_name(shout_t *self, str name)") as KoffiFunc<
  (self: ShoutPtr, name: string) => number
>;
export const shout_get_name = lib.func("str shout_get_name(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => string | null
>;

export const shout_set_url = lib.func("int shout_set_url(shout_t *self, str url)") as KoffiFunc<
  (self: ShoutPtr, url: string) => number
>;
export const shout_get_url = lib.func("str shout_get_url(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => string | null
>;

export const shout_set_genre = lib.func(
  "int shout_set_genre(shout_t *self, str genre)",
) as KoffiFunc<(self: ShoutPtr, genre: string) => number>;
export const shout_get_genre = lib.func("str shout_get_genre(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => string | null
>;

export const shout_set_description = lib.func(
  "int shout_set_description(shout_t *self, str description)",
) as KoffiFunc<(self: ShoutPtr, description: string) => number>;
export const shout_get_description = lib.func(
  "str shout_get_description(shout_t *self)",
) as KoffiFunc<(self: ShoutPtr) => string | null>;

export const shout_set_dumpfile = lib.func(
  "int shout_set_dumpfile(shout_t *self, str dumpfile)",
) as KoffiFunc<(self: ShoutPtr, dumpfile: string) => number>;
export const shout_get_dumpfile = lib.func("str shout_get_dumpfile(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => string | null
>;

export const shout_set_format = lib.func(
  "int shout_set_format(shout_t *self, uint32_t format)",
) as KoffiFunc<(self: ShoutPtr, format: number) => number>;
export const shout_get_format = lib.func("uint32_t shout_get_format(shout_t *self)") as KoffiFunc<
  (self: ShoutPtr) => number
>;

export const shout_set_metadata = lib.func(
  "int shout_set_metadata(shout_t *self, shout_metadata_t *metadata)",
) as KoffiFunc<(self: ShoutPtr, metadata: ShoutMetadataPtr) => number>;
