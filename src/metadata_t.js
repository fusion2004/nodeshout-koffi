const libshout = require('./libshout');


/**
 * Wrapper around a libshout `shout_metadata_t` handle. Used with
 * ShoutT#setMetadataUtf8() to push live metadata to MP3/AAC streams.
 */
class MetadataT {
    constructor() {
        this.ptr = libshout.shout_metadata_new();
    }


    /**
     * Free allocated memory. Must be called when finished with the instance.
     * @returns {void}
     */
    free() {
        libshout.shout_metadata_free(this.ptr);
    }


    /**
     * Add a metadata field. You'll probably want `name` of "song", though "url"
     * may also be useful. Values must be UTF-8.
     * @param {string} name
     * @param {string} value
     * @returns {number} ErrorTypes.SUCCESS on success, or another ErrorTypes value on failure. Callers should check this.
     */
    add(name, value) {
        return libshout.shout_metadata_add(this.ptr, name, value);
    }
}


module.exports = MetadataT;
