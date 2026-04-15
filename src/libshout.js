const koffi = require('koffi');

// Define opaque types (use resolve to avoid duplicate registration errors)
function resolveOrCreate(name) {
    try { return koffi.resolve(name); } catch (e) { return koffi.opaque(name); }
}
const shout_t = resolveOrCreate('shout_t');
const shout_metadata_t = resolveOrCreate('shout_metadata_t');

// Load the shared library
function loadLibshout() {
    const candidates = [
        'libshout',                              // Linux, or macOS with DYLD_LIBRARY_PATH
        '/opt/homebrew/lib/libshout.dylib',      // macOS Apple Silicon (Homebrew)
        '/usr/local/lib/libshout.dylib',         // macOS Intel (Homebrew)
    ];
    for (const candidate of candidates) {
        try { return koffi.load(candidate); } catch (e) { /* try next */ }
    }
    throw new Error(
        'Could not find libshout. Install it with:\n' +
        '  macOS:         brew install libshout\n' +
        '  Debian/Ubuntu: apt-get install libshout3-dev'
    );
}
const lib = loadLibshout();

// Declare all function bindings
module.exports = {
    // Lifecycle
    shout_init: lib.func('void shout_init()'),
    shout_shutdown: lib.func('void shout_shutdown()'),
    shout_version: lib.func('str shout_version(_Out_ int *major, _Out_ int *minor, _Out_ int *patch)'),

    // Instance management
    shout_new: lib.func('shout_t *shout_new()'),
    shout_free: lib.func('void shout_free(shout_t *self)'),

    // Error handling
    shout_get_error: lib.func('str shout_get_error(shout_t *self)'),
    shout_get_errno: lib.func('int shout_get_errno(shout_t *self)'),
    shout_get_connected: lib.func('int shout_get_connected(shout_t *self)'),

    // Host
    shout_set_host: lib.func('int shout_set_host(shout_t *self, str host)'),
    shout_get_host: lib.func('str shout_get_host(shout_t *self)'),

    // Port
    shout_set_port: lib.func('int shout_set_port(shout_t *self, uint16_t port)'),
    shout_get_port: lib.func('uint16_t shout_get_port(shout_t *self)'),

    // Password
    shout_set_password: lib.func('int shout_set_password(shout_t *self, str password)'),
    shout_get_password: lib.func('str shout_get_password(shout_t *self)'),

    // Mount
    shout_set_mount: lib.func('int shout_set_mount(shout_t *self, str mount)'),
    shout_get_mount: lib.func('str shout_get_mount(shout_t *self)'),

    // Name
    shout_set_name: lib.func('int shout_set_name(shout_t *self, str name)'),
    shout_get_name: lib.func('str shout_get_name(shout_t *self)'),

    // URL
    shout_set_url: lib.func('int shout_set_url(shout_t *self, str url)'),
    shout_get_url: lib.func('str shout_get_url(shout_t *self)'),

    // Genre
    shout_set_genre: lib.func('int shout_set_genre(shout_t *self, str genre)'),
    shout_get_genre: lib.func('str shout_get_genre(shout_t *self)'),

    // User
    shout_set_user: lib.func('int shout_set_user(shout_t *self, str user)'),
    shout_get_user: lib.func('str shout_get_user(shout_t *self)'),

    // Agent
    shout_set_agent: lib.func('int shout_set_agent(shout_t *self, str agent)'),
    shout_get_agent: lib.func('str shout_get_agent(shout_t *self)'),

    // Description
    shout_set_description: lib.func('int shout_set_description(shout_t *self, str description)'),
    shout_get_description: lib.func('str shout_get_description(shout_t *self)'),

    // Dumpfile
    shout_set_dumpfile: lib.func('int shout_set_dumpfile(shout_t *self, str dumpfile)'),
    shout_get_dumpfile: lib.func('str shout_get_dumpfile(shout_t *self)'),

    // Audio info
    shout_set_audio_info: lib.func('int shout_set_audio_info(shout_t *self, str key, str value)'),
    shout_get_audio_info: lib.func('str shout_get_audio_info(shout_t *self, str key)'),

    // Public
    shout_set_public: lib.func('int shout_set_public(shout_t *self, uint32_t is_public)'),
    shout_get_public: lib.func('uint32_t shout_get_public(shout_t *self)'),

    // Format
    shout_set_format: lib.func('int shout_set_format(shout_t *self, uint32_t format)'),
    shout_get_format: lib.func('uint32_t shout_get_format(shout_t *self)'),

    // Protocol
    shout_set_protocol: lib.func('int shout_set_protocol(shout_t *self, uint32_t protocol)'),
    shout_get_protocol: lib.func('uint32_t shout_get_protocol(shout_t *self)'),

    // Nonblocking
    shout_set_nonblocking: lib.func('int shout_set_nonblocking(shout_t *self, uint32_t nonblocking)'),
    shout_get_nonblocking: lib.func('uint32_t shout_get_nonblocking(shout_t *self)'),

    // Connection
    shout_open: lib.func('int shout_open(shout_t *self)'),
    shout_close: lib.func('int shout_close(shout_t *self)'),

    // Send data
    shout_send: lib.func('int shout_send(shout_t *self, const uint8_t *data, uintptr_t len)'),
    shout_send_raw: lib.func('intptr_t shout_send_raw(shout_t *self, const uint8_t *data, uintptr_t len)'),

    // Timing
    shout_queuelen: lib.func('intptr_t shout_queuelen(shout_t *self)'),
    shout_sync: lib.func('void shout_sync(shout_t *self)'),
    shout_delay: lib.func('int shout_delay(shout_t *self)'),

    // Metadata
    shout_set_metadata: lib.func('int shout_set_metadata(shout_t *self, shout_metadata_t *metadata)'),
    shout_metadata_new: lib.func('shout_metadata_t *shout_metadata_new()'),
    shout_metadata_free: lib.func('void shout_metadata_free(shout_metadata_t *metadata)'),
    shout_metadata_add: lib.func('int shout_metadata_add(shout_metadata_t *metadata, str key, str value)'),
};
