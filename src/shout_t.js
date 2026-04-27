const libshout = require('./libshout');


/**
 * Wrapper around a libshout `shout_t` connection handle.
 *
 * Return-value conventions for methods on this class:
 *  - "ErrorTypes value" — returns 0 (SUCCESS) on success or a negative SHOUTERR code.
 *    Callers should always check this against ErrorTypes.SUCCESS. On failure, call
 *    getError() for a human-readable message.
 *  - "string|null" — pointer-returning getter; null indicates unset or error.
 *  - Plain numbers — value with no error path (or where the libshout API does not
 *    distinguish errors via the return code).
 *  - "negative on error" — applies to send_raw / queueLen-style functions where a
 *    negative value indicates an error condition.
 */
class ShoutT {
    constructor() {
        this.ptr = libshout.shout_new();
    }


    /**
     * Free allocated memory. Must be called when finished with the instance.
     * @returns {void}
     */
    free() {
        libshout.shout_free(this.ptr);
    }


    /**
     * Returns a statically allocated string describing the last shout error that occurred
     * on this connection. Only valid until the next libshout call on this connection.
     * @returns {string|null} Error description, or null.
     */
    getError() {
        return libshout.shout_get_error(this.ptr);
    }


    /**
     * @returns {number} The most recent SHOUTERR code raised on this connection.
     */
    getErrno() {
        return libshout.shout_get_errno(this.ptr);
    }


    /**
     * @returns {number} ErrorTypes.CONNECTED or ErrorTypes.UNCONNECTED.
     */
    getConnected() {
        return libshout.shout_get_connected(this.ptr);
    }


    // ----- Connection parameters -----

    /**
     * Sets the server hostname or IP address. The default is localhost.
     * @param {string} host
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setHost(host) {
        return libshout.shout_set_host(this.ptr, host);
    }


    /**
     * Sets the server port. The default is 8000.
     * @param {number} port
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setPort(port) {
        return libshout.shout_set_port(this.ptr, port);
    }


    /**
     * Sets the user to authenticate as, for protocols that can use this parameter.
     * The default is source.
     * @param {string} user
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setUser(user) {
        return libshout.shout_set_user(this.ptr, user);
    }


    /**
     * Sets the password to authenticate to the server with. This parameter must be set.
     * There is no default.
     * @param {string} password
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setPassword(password) {
        return libshout.shout_set_password(this.ptr, password);
    }


    /**
     * Sets the mount point for this stream, for protocols that support this option
     * (Protocols.ICY does not).
     * @param {string} mount
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setMount(mount) {
        return libshout.shout_set_mount(this.ptr, mount);
    }


    /**
     * @returns {string|null} The configured mount point, or null if unset.
     */
    getMount() {
        return libshout.shout_get_mount(this.ptr);
    }


    /**
     * Sets the user agent header. Defaults to libshout/VERSION.
     * If you don't know what this function is for, don't use it.
     * @param {string} agent
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setAgent(agent) {
        return libshout.shout_set_agent(this.ptr, agent);
    }


    /**
     * @returns {string|null} The configured user-agent string, or null.
     */
    getAgent() {
        return libshout.shout_get_agent(this.ptr);
    }


    // ----- TLS -----

    /**
     * Configure TLS mode. See nodeshout.TlsModes.
     * @param {number} mode
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setTls(mode) {
        return libshout.shout_set_tls(this.ptr, mode);
    }


    /**
     * @returns {number} The configured TlsModes value.
     */
    getTls() {
        return libshout.shout_get_tls(this.ptr);
    }


    /**
     * Set the directory for CA certs. Default: operating system's default.
     * @param {string} directory
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setCaDirectory(directory) {
        return libshout.shout_set_ca_directory(this.ptr, directory);
    }


    /**
     * @returns {string|null} The configured CA directory, or null.
     */
    getCaDirectory() {
        return libshout.shout_get_ca_directory(this.ptr);
    }


    /**
     * Set a CA cert file for verification. Useful with self-signed server certs.
     * @param {string} file
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setCaFile(file) {
        return libshout.shout_set_ca_file(this.ptr, file);
    }


    /**
     * @returns {string|null} The configured CA file path, or null.
     */
    getCaFile() {
        return libshout.shout_get_ca_file(this.ptr);
    }


    /**
     * Set the list of allowed TLS ciphers. Use only when responding to a known
     * vulnerability — otherwise leave at the default. If you do call this, expose
     * the value to the user; do not hard-code.
     * @param {string} ciphers
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setAllowedCiphers(ciphers) {
        return libshout.shout_set_allowed_ciphers(this.ptr, ciphers);
    }


    /**
     * @returns {string|null} The configured allowed-ciphers string, or null.
     */
    getAllowedCiphers() {
        return libshout.shout_get_allowed_ciphers(this.ptr);
    }


    /**
     * Set a client certificate (PEM, cert + private key in the same file) for TLS.
     * @param {string} certificate
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setClientCertificate(certificate) {
        return libshout.shout_set_client_certificate(this.ptr, certificate);
    }


    /**
     * @returns {string|null} The configured client certificate (PEM), or null.
     */
    getClientCertificate() {
        return libshout.shout_get_client_certificate(this.ptr);
    }


    // ----- Stream metadata / parameters -----

    /**
     * Set a stream metadata field. `name` should be one of nodeshout.MetaKeys.
     * Replaces the obsolete setName/setUrl/setGenre/setDescription helpers.
     * @param {string} name
     * @param {string} value
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setMeta(name, value) {
        return libshout.shout_set_meta(this.ptr, name, value);
    }


    /**
     * @param {string} name One of nodeshout.MetaKeys.
     * @returns {string|null} The metadata value, or null if unset.
     */
    getMeta(name) {
        return libshout.shout_get_meta(this.ptr, name);
    }


    /**
     * Sets a stream audio parameter (e.g. bitrate, samplerate, channels, quality).
     * Standard keys are listed in nodeshout.AudioInfoKeys; additional fields may be
     * accepted by the directory server.
     * @param {string} key
     * @param {string} value
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setAudioInfo(key, value) {
        return libshout.shout_set_audio_info(this.ptr, key, value);
    }


    /**
     * @param {string} key One of nodeshout.AudioInfoKeys.
     * @returns {string|null} The audio-info value, or null if unset.
     */
    getAudioInfo(key) {
        return libshout.shout_get_audio_info(this.ptr, key);
    }


    /**
     * Setting this to true asks the server to list the stream in any directories it
     * knows about. The default is false.
     * @param {boolean} isPublic
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setPublic(isPublic) {
        return libshout.shout_set_public(this.ptr, isPublic ? 1 : 0);
    }


    /**
     * @returns {number} 1 if the stream is marked public, 0 otherwise.
     */
    getPublic() {
        return libshout.shout_get_public(this.ptr);
    }


    /**
     * Set the content language as per RFC 5646 §2.1 (e.g. "de-DE", "pt, tlh").
     * Pass null if unknown or expected to change. Describes target audience language,
     * not the language of individual songs.
     * @param {string|null} contentLanguage
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setContentLanguage(contentLanguage) {
        return libshout.shout_set_content_language(this.ptr, contentLanguage);
    }


    /**
     * @returns {string|null} The configured content-language tag, or null.
     */
    getContentLanguage() {
        return libshout.shout_get_content_language(this.ptr);
    }


    /**
     * Set the format of the content to send. Replaces the obsolete setFormat().
     * @param {number} format One of nodeshout.Formats.
     * @param {number} usage Bitwise OR of nodeshout.Usages values.
     * @param {string|null} [codecs] Currently must be null. Reserved for future use.
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setContentFormat(format, usage, codecs = null) {
        return libshout.shout_set_content_format(this.ptr, format, usage, codecs);
    }


    /**
     * @returns {{ status: number, format: number, usage: number, codecs: string|null }}
     *   `status` is ErrorTypes.SUCCESS on success or another ErrorTypes value on failure.
     *   The other fields are valid only when status is SUCCESS.
     */
    getContentFormat() {
        const format = [0];
        const usage = [0];
        const codecs = [null];
        const status = libshout.shout_get_content_format(this.ptr, format, usage, codecs);
        return { status, format: format[0], usage: usage[0], codecs: codecs[0] };
    }


    /**
     * Set the wire protocol. See nodeshout.Protocols.
     * @param {number} protocol
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setProtocol(protocol) {
        return libshout.shout_set_protocol(this.ptr, protocol);
    }


    /**
     * @returns {number} The configured Protocols value.
     */
    getProtocol() {
        return libshout.shout_get_protocol(this.ptr);
    }


    /**
     * Configure blocking behavior. Must be called before open(); switching modes
     * mid-stream is not currently supported. See nodeshout.Blocking.
     * @param {number} mode
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setNonblocking(mode) {
        return libshout.shout_set_nonblocking(this.ptr, mode);
    }


    /**
     * @returns {number} The configured Blocking value.
     */
    getNonblocking() {
        return libshout.shout_get_nonblocking(this.ptr);
    }


    // ----- Connection actions -----

    /**
     * Opens a connection to the server. All connection parameters must already be set.
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    open() {
        return libshout.shout_open(this.ptr);
    }


    /**
     * Closes a connection to the server.
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    close() {
        return libshout.shout_close(this.ptr);
    }


    /**
     * Sends `length` bytes of audio data from `buff` to the server, parsing it for
     * format-specific timing info. The connection must already have been established.
     * @param {Buffer} buff
     * @param {number} length
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    send(buff, length) {
        return libshout.shout_send(this.ptr, buff, length);
    }


    /**
     * Send unparsed data to the server. Do not use unless you know what you are doing.
     * @param {Buffer} buff
     * @param {number} length
     * @returns {number} The number of bytes written. Negative values indicate an error;
     *   call getError() / getErrno() for details.
     */
    sendRaw(buff, length) {
        return libshout.shout_send_raw(this.ptr, buff, length);
    }


    /**
     * @returns {number} The number of bytes currently on the write queue. Only meaningful
     *   in non-blocking mode. Negative values indicate an error.
     */
    getQueueLen() {
        return libshout.shout_queuelen(this.ptr);
    }


    /**
     * Causes the caller to sleep for the amount of time necessary to play back audio
     * sent since the last call to sync(). Should be called before every send() to
     * ensure data is sent at the correct speed. Alternatively, use delay().
     * @returns {void}
     */
    sync() {
        libshout.shout_sync(this.ptr);
    }


    /**
     * @returns {number} The number of milliseconds the caller should wait before calling
     *   send() again. Provided as an alternative to sync() for applications that wish
     *   to do other processing in the meantime.
     */
    delay() {
        return libshout.shout_delay(this.ptr);
    }


    // ----- MP3/AAC metadata -----

    /**
     * Sets stream metadata on this connection. The metadata must have been added as
     * UTF-8 via MetadataT#add(). Replaces the obsolete setMetadata().
     *
     * Note: this is for MP3/AAC streams only.
     * @param {MetadataT} metadata
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setMetadataUtf8(metadata) {
        return libshout.shout_set_metadata_utf8(this.ptr, metadata.ptr);
    }


    // ----- Obsolete (kept for backward compatibility) -----

    /**
     * Sets the name of the stream.
     * @deprecated Use setMeta(MetaKeys.NAME, name) instead.
     * @param {string} name
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setName(name) {
        return libshout.shout_set_name(this.ptr, name);
    }


    /**
     * @deprecated Use getMeta(MetaKeys.NAME) instead.
     * @returns {string|null} The configured stream name, or null.
     */
    getName() {
        return libshout.shout_get_name(this.ptr);
    }


    /**
     * Sets the URL of a site about this stream.
     * @deprecated Use setMeta(MetaKeys.URL, url) instead.
     * @param {string} url
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setUrl(url) {
        return libshout.shout_set_url(this.ptr, url);
    }


    /**
     * @deprecated Use getMeta(MetaKeys.URL) instead.
     * @returns {string|null} The configured stream URL, or null.
     */
    getUrl() {
        return libshout.shout_get_url(this.ptr);
    }


    /**
     * Sets the genre (or genres) of the stream. Usually a keyword list, e.g. "pop rock rap".
     * @deprecated Use setMeta(MetaKeys.GENRE, genre) instead.
     * @param {string} genre
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setGenre(genre) {
        return libshout.shout_set_genre(this.ptr, genre);
    }


    /**
     * @deprecated Use getMeta(MetaKeys.GENRE) instead.
     * @returns {string|null} The configured stream genre, or null.
     */
    getGenre() {
        return libshout.shout_get_genre(this.ptr);
    }


    /**
     * Sets the description of this stream.
     * @deprecated Use setMeta(MetaKeys.DESCRIPTION, description) instead.
     * @param {string} description
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setDescription(description) {
        return libshout.shout_set_description(this.ptr, description);
    }


    /**
     * @deprecated Use getMeta(MetaKeys.DESCRIPTION) instead.
     * @returns {string|null} The configured stream description, or null.
     */
    getDescription() {
        return libshout.shout_get_description(this.ptr);
    }


    /**
     * @deprecated Only useful with the deprecated Protocols.XAUDIOCAST. No replacement.
     * @param {string} dumpfile
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setDumpfile(dumpfile) {
        return libshout.shout_set_dumpfile(this.ptr, dumpfile);
    }


    /**
     * @deprecated Only useful with the deprecated Protocols.XAUDIOCAST. No replacement.
     * @returns {string|null} The configured dumpfile path, or null.
     */
    getDumpfile() {
        return libshout.shout_get_dumpfile(this.ptr);
    }


    /**
     * Sets the audio format of this stream.
     * @deprecated Use setContentFormat(format, usage, codecs) instead.
     * @param {number} format One of nodeshout.Formats.
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setFormat(format) {
        return libshout.shout_set_format(this.ptr, format);
    }


    /**
     * @deprecated Use getContentFormat() instead.
     * @returns {number} The configured Formats value.
     */
    getFormat() {
        return libshout.shout_get_format(this.ptr);
    }


    /**
     * Sets stream metadata on this connection.
     * @deprecated Use setMetadataUtf8(metadata) instead.
     * @param {MetadataT} metadata
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    setMetadata(metadata) {
        return libshout.shout_set_metadata(this.ptr, metadata.ptr);
    }
}


module.exports = ShoutT;
