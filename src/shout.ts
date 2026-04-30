import * as libshout from "./libshout.js";
import type { ShoutPtr } from "./libshout.js";
import type { ShoutMetadata } from "./metadata.js";
import type {
  ShoutBlockingMode,
  ShoutErrorType,
  ShoutFormat,
  ShoutProtocol,
  ShoutTlsMode,
} from "./index.js";

/**
 * Wrapper around a libshout `shout_t` connection handle.
 *
 * Return-value conventions for methods on this class:
 *  - `ShoutErrorType` — returns `ShoutErrorTypes.SUCCESS` (0) on success or a
 *    negative SHOUTERR code on failure. Callers should always check this against
 *    `ShoutErrorTypes.SUCCESS`. On failure, call `getError()` for a human-readable
 *    message.
 *  - `string | null` — pointer-returning getter; null indicates unset or error.
 *  - Plain `number` — value with no error path (or where the libshout API does
 *    not distinguish errors via the return code).
 *  - "negative on error" — applies to `sendRaw()` / `getQueueLen()`-style functions
 *    where a negative value indicates an error condition.
 */
export class Shout {
  /** @internal */
  readonly ptr: ShoutPtr;

  constructor() {
    const ptr = libshout.shout_new();
    if (ptr == null) throw new Error("shout_new() returned NULL");
    this.ptr = ptr;
  }

  /**
   * Free allocated memory. Must be called when finished with the instance.
   */
  free(): void {
    libshout.shout_free(this.ptr);
  }

  /**
   * Returns a statically allocated string describing the last shout error that
   * occurred on this connection. Only valid until the next libshout call on this
   * connection.
   */
  getError(): string | null {
    return libshout.shout_get_error(this.ptr);
  }

  /**
   * @returns The most recent SHOUTERR code raised on this connection.
   */
  getErrno(): ShoutErrorType {
    return libshout.shout_get_errno(this.ptr);
  }

  /**
   * @returns `ShoutErrorTypes.CONNECTED` or `ShoutErrorTypes.UNCONNECTED`.
   */
  getConnected(): ShoutErrorType {
    return libshout.shout_get_connected(this.ptr);
  }

  // ----- Connection parameters -----

  /**
   * Sets the server hostname or IP address. The default is localhost.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setHost(host: string): ShoutErrorType {
    return libshout.shout_set_host(this.ptr, host);
  }

  getHost(): string | null {
    return libshout.shout_get_host(this.ptr);
  }

  /**
   * Sets the server port. The default is 8000.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setPort(port: number): ShoutErrorType {
    return libshout.shout_set_port(this.ptr, port);
  }

  getPort(): number {
    return libshout.shout_get_port(this.ptr);
  }

  /**
   * Sets the user to authenticate as, for protocols that can use this parameter.
   * The default is source.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setUser(user: string): ShoutErrorType {
    return libshout.shout_set_user(this.ptr, user);
  }

  getUser(): string | null {
    return libshout.shout_get_user(this.ptr);
  }

  /**
   * Sets the password to authenticate to the server with. This parameter must be
   * set. There is no default.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setPassword(password: string): ShoutErrorType {
    return libshout.shout_set_password(this.ptr, password);
  }

  getPassword(): string | null {
    return libshout.shout_get_password(this.ptr);
  }

  /**
   * Sets the mount point for this stream, for protocols that support this option
   * (`ShoutProtocols.ICY` does not).
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setMount(mount: string): ShoutErrorType {
    return libshout.shout_set_mount(this.ptr, mount);
  }

  /**
   * @returns The configured mount point, or null if unset.
   */
  getMount(): string | null {
    return libshout.shout_get_mount(this.ptr);
  }

  /**
   * Sets the user agent header. Defaults to libshout/VERSION.
   * If you don't know what this function is for, don't use it.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setAgent(agent: string): ShoutErrorType {
    return libshout.shout_set_agent(this.ptr, agent);
  }

  /**
   * @returns The configured user-agent string, or null.
   */
  getAgent(): string | null {
    return libshout.shout_get_agent(this.ptr);
  }

  // ----- TLS -----

  /**
   * Configure TLS mode. See `ShoutTlsModes`.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setTls(mode: ShoutTlsMode): ShoutErrorType {
    return libshout.shout_set_tls(this.ptr, mode);
  }

  /**
   * @returns The configured `ShoutTlsModes` value.
   */
  getTls(): ShoutTlsMode {
    return libshout.shout_get_tls(this.ptr);
  }

  /**
   * Set the directory for CA certs. Default: operating system's default.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setCaDirectory(directory: string): ShoutErrorType {
    return libshout.shout_set_ca_directory(this.ptr, directory);
  }

  /**
   * @returns The configured CA directory, or null.
   */
  getCaDirectory(): string | null {
    return libshout.shout_get_ca_directory(this.ptr);
  }

  /**
   * Set a CA cert file for verification. Useful with self-signed server certs.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setCaFile(file: string): ShoutErrorType {
    return libshout.shout_set_ca_file(this.ptr, file);
  }

  /**
   * @returns The configured CA file path, or null.
   */
  getCaFile(): string | null {
    return libshout.shout_get_ca_file(this.ptr);
  }

  /**
   * Set the list of allowed TLS ciphers. Use only when responding to a known
   * vulnerability — otherwise leave at the default. If you do call this, expose
   * the value to the user; do not hard-code.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setAllowedCiphers(ciphers: string): ShoutErrorType {
    return libshout.shout_set_allowed_ciphers(this.ptr, ciphers);
  }

  /**
   * @returns The configured allowed-ciphers string, or null.
   */
  getAllowedCiphers(): string | null {
    return libshout.shout_get_allowed_ciphers(this.ptr);
  }

  /**
   * Set a client certificate (PEM, cert + private key in the same file) for TLS.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setClientCertificate(certificate: string): ShoutErrorType {
    return libshout.shout_set_client_certificate(this.ptr, certificate);
  }

  /**
   * @returns The configured client certificate (PEM), or null.
   */
  getClientCertificate(): string | null {
    return libshout.shout_get_client_certificate(this.ptr);
  }

  // ----- Stream metadata / parameters -----

  /**
   * Set a stream metadata field. `name` should be one of `ShoutMetaKeys`.
   * Replaces the obsolete setName/setUrl/setGenre/setDescription helpers.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setMeta(name: string, value: string): ShoutErrorType {
    return libshout.shout_set_meta(this.ptr, name, value);
  }

  /**
   * @param name One of `ShoutMetaKeys`.
   * @returns The metadata value, or null if unset.
   */
  getMeta(name: string): string | null {
    return libshout.shout_get_meta(this.ptr, name);
  }

  /**
   * Sets a stream audio parameter (e.g. bitrate, samplerate, channels, quality).
   * Standard keys are listed in `ShoutAudioInfoKeys`; additional fields may be
   * accepted by the directory server.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setAudioInfo(key: string, value: string): ShoutErrorType {
    return libshout.shout_set_audio_info(this.ptr, key, value);
  }

  /**
   * @param key One of `ShoutAudioInfoKeys`.
   * @returns The audio-info value, or null if unset.
   */
  getAudioInfo(key: string): string | null {
    return libshout.shout_get_audio_info(this.ptr, key);
  }

  /**
   * Setting this to true asks the server to list the stream in any directories
   * it knows about. The default is false.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setPublic(isPublic: boolean): ShoutErrorType {
    return libshout.shout_set_public(this.ptr, isPublic ? 1 : 0);
  }

  /**
   * @returns 1 if the stream is marked public, 0 otherwise.
   */
  getPublic(): number {
    return libshout.shout_get_public(this.ptr);
  }

  /**
   * Set the content language as per RFC 5646 §2.1 (e.g. "de-DE", "pt, tlh").
   * Pass null if unknown or expected to change. Describes target audience
   * language, not the language of individual songs.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setContentLanguage(contentLanguage: string | null): ShoutErrorType {
    return libshout.shout_set_content_language(this.ptr, contentLanguage);
  }

  /**
   * @returns The configured content-language tag, or null.
   */
  getContentLanguage(): string | null {
    return libshout.shout_get_content_language(this.ptr);
  }

  /**
   * Set the format of the content to send. Replaces the obsolete `setFormat()`.
   * @param format One of `ShoutFormats`.
   * @param usage Bitwise OR of `ShoutUsages` values.
   * @param codecs Currently must be null. Reserved for future use.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setContentFormat(
    format: ShoutFormat,
    usage: number,
    codecs: string | null = null,
  ): ShoutErrorType {
    return libshout.shout_set_content_format(this.ptr, format, usage, codecs);
  }

  /**
   * `status` is `ShoutErrorTypes.SUCCESS` on success or another `ShoutErrorTypes`
   * value on failure. The other fields are valid only when status is SUCCESS.
   */
  getContentFormat(): {
    status: ShoutErrorType;
    format: ShoutFormat;
    usage: number;
    codecs: string | null;
  } {
    const format: [number] = [0];
    const usage: [number] = [0];
    const codecs: [string | null] = [null];
    const status = libshout.shout_get_content_format(this.ptr, format, usage, codecs);
    return {
      status,
      format: format[0] as ShoutFormat,
      usage: usage[0],
      codecs: codecs[0],
    };
  }

  /**
   * Set the wire protocol. See `ShoutProtocols`.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setProtocol(protocol: ShoutProtocol): ShoutErrorType {
    return libshout.shout_set_protocol(this.ptr, protocol);
  }

  /**
   * @returns The configured `ShoutProtocols` value.
   */
  getProtocol(): ShoutProtocol {
    return libshout.shout_get_protocol(this.ptr);
  }

  /**
   * Configure blocking behavior. Must be called before `open()`; switching modes
   * mid-stream is not currently supported. See `ShoutBlocking`.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setNonblocking(mode: ShoutBlockingMode): ShoutErrorType {
    return libshout.shout_set_nonblocking(this.ptr, mode);
  }

  /**
   * @returns The configured `ShoutBlocking` value.
   */
  getNonblocking(): ShoutBlockingMode {
    return libshout.shout_get_nonblocking(this.ptr);
  }

  // ----- Connection actions -----

  /**
   * Opens a connection to the server. All connection parameters must already be
   * set.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  open(): ShoutErrorType {
    return libshout.shout_open(this.ptr);
  }

  /**
   * Closes a connection to the server.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  close(): ShoutErrorType {
    return libshout.shout_close(this.ptr);
  }

  /**
   * Sends `length` bytes of audio data from `buff` to the server, parsing it
   * for format-specific timing info. The connection must already have been
   * established.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  send(buff: Buffer | Uint8Array, length: number): ShoutErrorType {
    return libshout.shout_send(this.ptr, buff, length);
  }

  /**
   * Send unparsed data to the server. Do not use unless you know what you are
   * doing.
   * @returns The number of bytes written. Negative values indicate an error;
   *   call `getError()` / `getErrno()` for details.
   */
  sendRaw(buff: Buffer | Uint8Array, length: number): number {
    return libshout.shout_send_raw(this.ptr, buff, length);
  }

  /**
   * @returns The number of bytes currently on the write queue. Only meaningful
   *   in non-blocking mode. Negative values indicate an error.
   */
  getQueueLen(): number {
    return libshout.shout_queuelen(this.ptr);
  }

  /**
   * Causes the caller to sleep for the amount of time necessary to play back
   * audio sent since the last call to `sync()`. Should be called before every
   * `send()` to ensure data is sent at the correct speed. Alternatively, use
   * `delay()`.
   */
  sync(): void {
    libshout.shout_sync(this.ptr);
  }

  /**
   * @returns The number of milliseconds the caller should wait before calling
   *   `send()` again. Provided as an alternative to `sync()` for applications
   *   that wish to do other processing in the meantime.
   */
  delay(): number {
    return libshout.shout_delay(this.ptr);
  }

  // ----- MP3/AAC metadata -----

  /**
   * Sets stream metadata on this connection. The metadata must have been added
   * as UTF-8 via `ShoutMetadata#add()`. Replaces the obsolete `setMetadata()`.
   *
   * Note: this is for MP3/AAC streams only.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setMetadataUtf8(metadata: ShoutMetadata): ShoutErrorType {
    return libshout.shout_set_metadata_utf8(this.ptr, metadata.ptr);
  }

  // ----- Obsolete (kept for backward compatibility) -----

  /**
   * Sets the name of the stream.
   * @deprecated Use `setMeta(ShoutMetaKeys.NAME, name)` instead.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setName(name: string): ShoutErrorType {
    return libshout.shout_set_name(this.ptr, name);
  }

  /**
   * @deprecated Use `getMeta(ShoutMetaKeys.NAME)` instead.
   * @returns The configured stream name, or null.
   */
  getName(): string | null {
    return libshout.shout_get_name(this.ptr);
  }

  /**
   * Sets the URL of a site about this stream.
   * @deprecated Use `setMeta(ShoutMetaKeys.URL, url)` instead.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setUrl(url: string): ShoutErrorType {
    return libshout.shout_set_url(this.ptr, url);
  }

  /**
   * @deprecated Use `getMeta(ShoutMetaKeys.URL)` instead.
   * @returns The configured stream URL, or null.
   */
  getUrl(): string | null {
    return libshout.shout_get_url(this.ptr);
  }

  /**
   * Sets the genre (or genres) of the stream. Usually a keyword list, e.g.
   * "pop rock rap".
   * @deprecated Use `setMeta(ShoutMetaKeys.GENRE, genre)` instead.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setGenre(genre: string): ShoutErrorType {
    return libshout.shout_set_genre(this.ptr, genre);
  }

  /**
   * @deprecated Use `getMeta(ShoutMetaKeys.GENRE)` instead.
   * @returns The configured stream genre, or null.
   */
  getGenre(): string | null {
    return libshout.shout_get_genre(this.ptr);
  }

  /**
   * Sets the description of this stream.
   * @deprecated Use `setMeta(ShoutMetaKeys.DESCRIPTION, description)` instead.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setDescription(description: string): ShoutErrorType {
    return libshout.shout_set_description(this.ptr, description);
  }

  /**
   * @deprecated Use `getMeta(ShoutMetaKeys.DESCRIPTION)` instead.
   * @returns The configured stream description, or null.
   */
  getDescription(): string | null {
    return libshout.shout_get_description(this.ptr);
  }

  /**
   * @deprecated Only useful with the deprecated `ShoutProtocols.XAUDIOCAST`. No
   *   replacement.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setDumpfile(dumpfile: string): ShoutErrorType {
    return libshout.shout_set_dumpfile(this.ptr, dumpfile);
  }

  /**
   * @deprecated Only useful with the deprecated `ShoutProtocols.XAUDIOCAST`. No
   *   replacement.
   * @returns The configured dumpfile path, or null.
   */
  getDumpfile(): string | null {
    return libshout.shout_get_dumpfile(this.ptr);
  }

  /**
   * Sets the audio format of this stream.
   * @deprecated Use `setContentFormat(format, usage, codecs)` instead.
   * @param format One of `ShoutFormats`.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setFormat(format: ShoutFormat): ShoutErrorType {
    return libshout.shout_set_format(this.ptr, format);
  }

  /**
   * @deprecated Use `getContentFormat()` instead.
   * @returns The configured `ShoutFormats` value.
   */
  getFormat(): ShoutFormat {
    return libshout.shout_get_format(this.ptr);
  }

  /**
   * Sets stream metadata on this connection.
   * @deprecated Use `setMetadataUtf8(metadata)` instead.
   * @returns `ShoutErrorTypes.SUCCESS` on success, or another `ShoutErrorTypes`
   *   value on failure. Callers should check this.
   */
  setMetadata(metadata: ShoutMetadata): ShoutErrorType {
    return libshout.shout_set_metadata(this.ptr, metadata.ptr);
  }
}
