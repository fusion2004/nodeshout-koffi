import * as libshout from './libshout.js';
import { Shout } from './shout.js';
import { ShoutMetadata } from './metadata.js';

export { Shout, ShoutMetadata };
export type { ShoutPtr, ShoutMetadataPtr } from './libshout.js';

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
  SUCCESS: 0,
  INSANE: -1,
  NOCONNECT: -2,
  NOLOGIN: -3,
  SOCKET: -4,
  MALLOC: -5,
  METADATA: -6,
  CONNECTED: -7,
  UNCONNECTED: -8,
  UNSUPPORTED: -9,
  BUSY: -10,
  NOTLS: -11,
  TLSBADCERT: -12,
  RETRY: -13,
} as const;
export type ShoutErrorType = (typeof ShoutErrorTypes)[keyof typeof ShoutErrorTypes];

/**
 * Audio/container formats (SHOUT_FORMAT_*) for setContentFormat().
 */
export const ShoutFormats = {
  OGG: 0,
  MP3: 1,
  WEBM: 2,
  /** @deprecated WebM, audio only, obsolete. Use OGG with ShoutUsages.AUDIO, or WEBM. Only used by the obsolete shout_set_format(). */
  WEBMAUDIO: 3,
  MATROSKA: 4,
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
  AUDIO: 0x0001,
  VISUAL: 0x0002,
  TEXT: 0x0004,
  SUBTITLE: 0x0008,
  LIGHT: 0x0010,
  UI: 0x0020,
  METADATA: 0x0040,
  APPLICATION: 0x0080,
  CONTROL: 0x0100,
  COMPLEX: 0x0200,
  OTHER: 0x0400,
  UNKNOWN: 0x0800,
  THREE_D: 0x1000,
  FOUR_D: 0x2000,
} as const;
export type ShoutUsage = (typeof ShoutUsages)[keyof typeof ShoutUsages];

/**
 * TLS modes (SHOUT_TLS_*) for setTls().
 */
export const ShoutTlsModes = {
  DISABLED: 0,
  AUTO: 1,
  AUTO_NO_PLAIN: 2,
  RFC2818: 11,
  RFC2817: 12,
} as const;
export type ShoutTlsMode = (typeof ShoutTlsModes)[keyof typeof ShoutTlsModes];

/**
 * Blocking modes (SHOUT_BLOCKING_*) for setNonblocking().
 */
export const ShoutBlocking = {
  DEFAULT: 255,
  FULL: 0,
  NONE: 1,
} as const;
export type ShoutBlockingMode = (typeof ShoutBlocking)[keyof typeof ShoutBlocking];

/**
 * Audio info parameter keys (SHOUT_AI_*) for setAudioInfo() / getAudioInfo().
 */
export const ShoutAudioInfoKeys = {
  BITRATE: 'bitrate',
  SAMPLERATE: 'samplerate',
  CHANNELS: 'channels',
  QUALITY: 'quality',
} as const;
export type ShoutAudioInfoKey = (typeof ShoutAudioInfoKeys)[keyof typeof ShoutAudioInfoKeys];

/**
 * Stream metadata keys (SHOUT_META_*) for setMeta() / getMeta().
 */
export const ShoutMetaKeys = {
  NAME: 'name',
  URL: 'url',
  GENRE: 'genre',
  DESCRIPTION: 'description',
  IRC: 'irc',
  AIM: 'aim',
  ICQ: 'icq',
} as const;
export type ShoutMetaKey = (typeof ShoutMetaKeys)[keyof typeof ShoutMetaKeys];
