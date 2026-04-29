import * as libshout from "./libshout.js";
import { Shout } from "./shout.js";
import { ShoutMetadata } from "./metadata.js";

export { Shout, ShoutMetadata };
export type { ShoutPtr, ShoutMetadataPtr } from "./libshout.js";

/** @deprecated Use `Shout` instead. */
export type ShoutT = Shout;
/** @deprecated Use `ShoutMetadata` instead. */
export type MetadataT = ShoutMetadata;

/**
 * Initializes the shout library. This function must always be called before
 * any other libshout function.
 */
export function shoutInit(): void {
  libshout.shout_init();
}

/**
 * Releases any resources which may have been allocated by a call to shoutInit.
 * An application should call this function after it has finished using libshout.
 */
export function shoutShutdown(): void {
  libshout.shout_shutdown();
}

/**
 * Gets libshout version.
 */
export function shoutVersion(): string {
  const major: [number] = [0];
  const minor: [number] = [0];
  const patch: [number] = [0];
  return libshout.shout_version(major, minor, patch);
}

/**
 * Allocates a new shout_t structure. The result must be disposed of with
 * `Shout#free()` when you are finished with it.
 */
export function createShout(): Shout {
  return new Shout();
}

/**
 * Allocates a new shout_metadata_t structure. The result must be disposed of with
 * `ShoutMetadata#free()` when you are finished with it.
 */
export function createShoutMetadata(): ShoutMetadata {
  return new ShoutMetadata();
}

/**
 * libshout error codes (SHOUTERR_*).
 */
export const ShoutErrorTypes = {
  /** No error. */
  SUCCESS: 0,
  /** Nonsensical arguments e.g. self being NULL. */
  INSANE: -1,
  /** Couldn't connect. */
  NOCONNECT: -2,
  /** Login failed. */
  NOLOGIN: -3,
  /** Socket error. */
  SOCKET: -4,
  /** Out of memory. */
  MALLOC: -5,
  METADATA: -6,
  /** Cannot set parameter while connected. */
  CONNECTED: -7,
  /** Not connected. */
  UNCONNECTED: -8,
  /** This libshout doesn't support the requested option. */
  UNSUPPORTED: -9,
  /** Resource is busy, try again (later). */
  BUSY: -10,
  /** TLS requested but not supported by peer. */
  NOTLS: -11,
  /** TLS connection cannot be established because of bad certificate. */
  TLSBADCERT: -12,
  /** Retry last operation. */
  RETRY: -13,
} as const;
export type ShoutErrorType = (typeof ShoutErrorTypes)[keyof typeof ShoutErrorTypes];

/**
 * Audio/container formats (SHOUT_FORMAT_*) for setContentFormat().
 */
export const ShoutFormats = {
  /** Ogg. */
  OGG: 0,
  /** MP3. */
  MP3: 1,
  /** WebM. */
  WEBM: 2,
  /** @deprecated WebM, audio only, obsolete. Use OGG with ShoutUsages.AUDIO, or WEBM. Only used by the obsolete shout_set_format(). */
  WEBMAUDIO: 3,
  /** Matroska. */
  MATROSKA: 4,
  /** Text, must be in UTF-8. Usage must be ShoutUsages.TEXT. */
  TEXT: 5,
} as const;
export type ShoutFormat = (typeof ShoutFormats)[keyof typeof ShoutFormats];

/**
 * Wire protocols (SHOUT_PROTOCOL_*) for setProtocol().
 */
export const ShoutProtocols = {
  HTTP: 0,
  /** @deprecated May be removed in future versions. Do not use. */
  XAUDIOCAST: 1,
  ICY: 2,
  ROARAUDIO: 3,
} as const;
export type ShoutProtocol = (typeof ShoutProtocols)[keyof typeof ShoutProtocols];

/**
 * Stream usage bit flags (SHOUT_USAGE_*) for setContentFormat(). Combine with bitwise OR.
 * THREE_D / FOUR_D map to SHOUT_USAGE_3D / SHOUT_USAGE_4D (renamed because JS identifiers cannot start with a digit).
 */
export const ShoutUsages = {
  /** Audio substreams. */
  AUDIO: 0x0001,
  /** Picture/video substreams (most often combined with AUDIO). */
  VISUAL: 0x0002,
  /** Text substreams that are not subtitles. */
  TEXT: 0x0004,
  /** Subtitle substreams. */
  SUBTITLE: 0x0008,
  /** Light control substreams. */
  LIGHT: 0x0010,
  /** User interface data, such as DVD menus or buttons. */
  UI: 0x0020,
  /** Substreams that include metadata for the stream. */
  METADATA: 0x0040,
  /** Application specific data substreams. */
  APPLICATION: 0x0080,
  /** Substreams that control the infrastructure. */
  CONTROL: 0x0100,
  /** Substreams that are themselves a mixture of other types. */
  COMPLEX: 0x0200,
  /** Substream of types not listed here. */
  OTHER: 0x0400,
  /** The stream MAY contain additional substreams of unknown nature. */
  UNKNOWN: 0x0800,
  /** The stream contains information for 3D playback (SHOUT_USAGE_3D). */
  THREE_D: 0x1000,
  /** The stream contains information for 4D/XD playback (SHOUT_USAGE_4D). */
  FOUR_D: 0x2000,
} as const;
export type ShoutUsage = (typeof ShoutUsages)[keyof typeof ShoutUsages];

/**
 * TLS modes (SHOUT_TLS_*) for setTls().
 */
export const ShoutTlsModes = {
  /** Do not use TLS at all. */
  DISABLED: 0,
  /** Autodetect which TLS mode to use if any. */
  AUTO: 1,
  /** Like AUTO but does not allow plain connections. */
  AUTO_NO_PLAIN: 2,
  /** Use TLS for transport layer like HTTPS [RFC2818] does. */
  RFC2818: 11,
  /** Use TLS via HTTP Upgrade:-header [RFC2817]. */
  RFC2817: 12,
} as const;
export type ShoutTlsMode = (typeof ShoutTlsModes)[keyof typeof ShoutTlsModes];

/**
 * Blocking modes (SHOUT_BLOCKING_*) for setNonblocking().
 */
export const ShoutBlocking = {
  /** Use the default blocking setting. */
  DEFAULT: 255,
  /** Block in all I/O related functions. */
  FULL: 0,
  /** Do not block in I/O related functions. */
  NONE: 1,
} as const;
export type ShoutBlockingMode = (typeof ShoutBlocking)[keyof typeof ShoutBlocking];

/**
 * Audio info parameter keys (SHOUT_AI_*) for setAudioInfo() / getAudioInfo().
 */
export const ShoutAudioInfoKeys = {
  BITRATE: "bitrate",
  SAMPLERATE: "samplerate",
  CHANNELS: "channels",
  QUALITY: "quality",
} as const;
export type ShoutAudioInfoKey = (typeof ShoutAudioInfoKeys)[keyof typeof ShoutAudioInfoKeys];

/**
 * Stream metadata keys (SHOUT_META_*) for setMeta() / getMeta().
 */
export const ShoutMetaKeys = {
  NAME: "name",
  URL: "url",
  GENRE: "genre",
  DESCRIPTION: "description",
  IRC: "irc",
  AIM: "aim",
  ICQ: "icq",
} as const;
export type ShoutMetaKey = (typeof ShoutMetaKeys)[keyof typeof ShoutMetaKeys];
