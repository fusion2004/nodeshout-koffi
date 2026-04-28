const libshout = require('./libshout');
const ShoutT = require('./shout_t');
const MetadataT = require('./metadata_t');


const nodeshout = {};


/**
 * Initializes the shout library. This function must always be called before
 * any other libshout function.
 */
nodeshout.init = function() {
    libshout.shout_init();
};


/**
 * Releases any resources which may have been allocated by a call to shout_init.
 * An application should call this function after it has finished using libshout.
 */
nodeshout.shutdown = function() {
    libshout.shout_shutdown();
};


/**
 * Gets libshout version.
 * @return {string}
 */
nodeshout.getVersion = function() {
    const major = [0];
    const minor = [0];
    const patch = [0];

    return libshout.shout_version(major, minor, patch);
};


/**
 * Allocates a new shout_t structure. May return NULL if no memory is available.
 * The result should be disposed of with free when you are finished with it.
 * @return {ShoutT}
 */
nodeshout.create = function() {
    return new ShoutT();
};


/**
 * Allocates a new medata_t structure. May return NULL if no memory is available.
 * The result should be disposed of with free when you are finished with it.
 * @return {MetadataT}
 */
nodeshout.createMetadata = function() {
    return new MetadataT();
};


/**
 * libshout error codes (SHOUTERR_*).
 * @enum {number}
 */
nodeshout.ErrorTypes = {
    SUCCESS: 0,         // No error
    INSANE: -1,         // Nonsensical arguments e.g. self being NULL
    NOCONNECT: -2,      // Couldn't connect
    NOLOGIN: -3,        // Login failed
    SOCKET: -4,         // Socket error
    MALLOC: -5,         // Out of memory
    METADATA: -6,
    CONNECTED: -7,      // Cannot set parameter while connected
    UNCONNECTED: -8,    // Not connected
    UNSUPPORTED: -9,    // This libshout doesn't support the requested option
    BUSY: -10,          // Resource is busy, try again (later)
    NOTLS: -11,         // TLS requested but not supported by peer
    TLSBADCERT: -12,    // TLS connection can not be established because of bad certificate
    RETRY: -13,         // Retry last operation.
};


/**
 * Audio/container formats (SHOUT_FORMAT_*) for setContentFormat().
 * @enum {number}
 */
nodeshout.Formats = {
    OGG: 0,             // Ogg
    MP3: 1,             // MP3
    WEBM: 2,            // WebM
    WEBMAUDIO: 3,       // @deprecated WebM, audio only, obsolete. Use OGG with Usages.AUDIO, or WEBM. Only used by the obsolete shout_set_format().
    MATROSKA: 4,        // Matroska
    TEXT: 5,            // Text, must be in UTF-8, usage must be Usages.TEXT.
};


/**
 * Wire protocols (SHOUT_PROTOCOL_*) for setProtocol().
 * @enum {number}
 */
nodeshout.Protocols = {
    HTTP: 0,
    XAUDIOCAST: 1, // @deprecated May be removed in future versions. Do not use.
    ICY: 2,
    ROARAUDIO: 3,
};


/**
 * Stream usage bit flags (SHOUT_USAGE_*) for setContentFormat(). Combine with bitwise OR.
 * THREE_D / FOUR_D map to SHOUT_USAGE_3D / SHOUT_USAGE_4D (renamed because JS identifiers cannot start with a digit).
 * @enum {number}
 */
nodeshout.Usages = {
    AUDIO: 0x0001,        // Audio substreams
    VISUAL: 0x0002,       // Picture/Video substreams (most often combined with AUDIO)
    TEXT: 0x0004,         // Text substreams that are not subtitles
    SUBTITLE: 0x0008,     // Subtitle substreams
    LIGHT: 0x0010,        // Light control substreams
    UI: 0x0020,           // User interface data, such as DVD menus or buttons
    METADATA: 0x0040,     // Substreams that include metadata for the stream
    APPLICATION: 0x0080,  // Application specific data substreams
    CONTROL: 0x0100,      // Substreams that control the infrastructure
    COMPLEX: 0x0200,      // Substreams that are themself a mixture of other types
    OTHER: 0x0400,        // Substream of types not listed here
    UNKNOWN: 0x0800,      // The stream MAY contain additional substreams of unknown nature
    THREE_D: 0x1000,      // The Stream contains information for 3D playback (SHOUT_USAGE_3D)
    FOUR_D: 0x2000,       // The Stream contains information for 4D/XD playback (SHOUT_USAGE_4D)
};


/**
 * TLS modes (SHOUT_TLS_*) for setTls().
 * @enum {number}
 */
nodeshout.TlsModes = {
    DISABLED: 0,        // Do not use TLS at all
    AUTO: 1,            // Autodetect which TLS mode to use if any
    AUTO_NO_PLAIN: 2,   // Like AUTO but does not allow plain connections
    RFC2818: 11,        // Use TLS for transport layer like HTTPS [RFC2818] does.
    RFC2817: 12,        // Use TLS via HTTP Upgrade:-header [RFC2817].
};


/**
 * Blocking modes (SHOUT_BLOCKING_*) for setNonblocking().
 * @enum {number}
 */
nodeshout.Blocking = {
    DEFAULT: 255,       // Use the default blocking setting.
    FULL: 0,            // Block in all I/O related functions
    NONE: 1,            // Do not block in I/O related functions
};


/**
 * Audio info parameter keys (SHOUT_AI_*) for setAudioInfo() / getAudioInfo().
 * @enum {string}
 */
nodeshout.AudioInfoKeys = {
    BITRATE: 'bitrate',
    SAMPLERATE: 'samplerate',
    CHANNELS: 'channels',
    QUALITY: 'quality',
};


/**
 * Stream metadata keys (SHOUT_META_*) for setMeta() / getMeta().
 * @enum {string}
 */
nodeshout.MetaKeys = {
    NAME: 'name',
    URL: 'url',
    GENRE: 'genre',
    DESCRIPTION: 'description',
    IRC: 'irc',
    AIM: 'aim',
    ICQ: 'icq',
};


module.exports = nodeshout;
