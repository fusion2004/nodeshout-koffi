# nodeshout

Native libshout bindings for node.js.

> Libshout allows applications to easily communicate and broadcast to an Icecast streaming media server. It handles the socket connections, metadata communication, and data streaming for the calling application, and lets developers focus on feature sets instead of implementation details.

More detail: http://icecast.org

Tracks libshout 2.4.x. Upstream API reference: https://gitlab.xiph.org/xiph/icecast-libshout/-/blob/master/doc/libshout.xml.

## Usage

You have to install libshout library before using nodeshout. If you work on macOS, you can install via homebrew.

```
brew install libshout
```

Then, install nodeshout via npm.

```
npm i nodeshout
```

Initalize nodeshout library, create a `Shout` instance and configure it.

```js
// Initalize
nodeshout.init();

// Create a shout instance
const shout = nodeshout.create();

// Configure it
shout.setHost('localhost');
shout.setPort(8000);
shout.setUser('source');
shout.setPassword('password');
shout.setMount('mount');
shout.setContentFormat(nodeshout.Formats.MP3, nodeshout.Usages.AUDIO, null);
shout.setAudioInfo(nodeshout.AudioInfoKeys.BITRATE, '192');
shout.setAudioInfo(nodeshout.AudioInfoKeys.SAMPLERATE, '44100');
shout.setAudioInfo(nodeshout.AudioInfoKeys.CHANNELS, '2');
```

Open the connection — and check the return code. Every method documented as "Callers should check this" returns `nodeshout.ErrorTypes.SUCCESS` (`0`) on success or a negative `ErrorTypes` value on failure. On failure, `shout.getError()` returns a human-readable message.

```js
const status = shout.open();
if (status !== nodeshout.ErrorTypes.SUCCESS) {
    console.error('shout_open failed:', shout.getError());
    process.exit(1);
}
```

After successful connection, send audio file chunks via `shout.send` (also checked):

```js
const sendStatus = shout.send(buffer, bytesRead);
if (sendStatus !== nodeshout.ErrorTypes.SUCCESS) {
    console.error('shout_send failed:', shout.getError());
    break;
}
```

For the synchronization, there is 2 method provided. First one is `shout.sync()` method, this method blocks current thread. Second one is `shout.delay()` method, this method returns how many milliseconds you should wait to send next audio chunk.

> If you're gonna stream multiple files, beware that Icecast requires stable bitrate & sample rate for the whole stream. So all of your music files should have the exact bitrate & sample rate.

## Examples

Check the `/demos` folder.

## Constants

All libshout enums are exposed as grouped objects on the module:

| Group | Purpose |
| -- | -- |
| `nodeshout.ErrorTypes` | `SHOUTERR_*` codes returned by every checked method. |
| `nodeshout.Formats` | `SHOUT_FORMAT_*` — pass to `setContentFormat()`. |
| `nodeshout.Usages` | `SHOUT_USAGE_*` — bitwise OR for `setContentFormat()`. |
| `nodeshout.Protocols` | `SHOUT_PROTOCOL_*` — pass to `setProtocol()`. |
| `nodeshout.TlsModes` | `SHOUT_TLS_*` — pass to `setTls()`. |
| `nodeshout.Blocking` | `SHOUT_BLOCKING_*` — pass to `setNonblocking()`. |
| `nodeshout.AudioInfoKeys` | `SHOUT_AI_*` — keys for `setAudioInfo()` / `getAudioInfo()`. |
| `nodeshout.MetaKeys` | `SHOUT_META_*` — keys for `setMeta()` / `getMeta()`. |

## Deprecated APIs

These wrappers still work but are marked `@deprecated` because the underlying libshout
functions are obsolete. New code should use the listed replacements:

| Deprecated | Replacement |
| -- | -- |
| `setName(s)` / `getName()` | `setMeta(MetaKeys.NAME, s)` / `getMeta(MetaKeys.NAME)` |
| `setUrl(s)` / `getUrl()` | `setMeta(MetaKeys.URL, s)` / `getMeta(MetaKeys.URL)` |
| `setGenre(s)` / `getGenre()` | `setMeta(MetaKeys.GENRE, s)` / `getMeta(MetaKeys.GENRE)` |
| `setDescription(s)` / `getDescription()` | `setMeta(MetaKeys.DESCRIPTION, s)` / `getMeta(MetaKeys.DESCRIPTION)` |
| `setFormat(fmt)` / `getFormat()` | `setContentFormat(fmt, usage, codecs)` / `getContentFormat()` |
| `setMetadata(m)` | `setMetadataUtf8(m)` |
| `setDumpfile(p)` / `getDumpfile()` | (no replacement — only useful with the deprecated `Protocols.XAUDIOCAST`) |

The `Formats.WEBMAUDIO` and `Protocols.XAUDIOCAST` constants are also deprecated.

## Developing
Below is a short guild to the development in this repository

- Clone repository
- Verify that your node version and NPM version are compatible with the repository. [NVM](https://github.com/nvm-sh/nvm) is useful here.
- Verify that you have the libshout dependency installed, for Mac OSX you can install with `brew install libshout` on a linux distribution like Ubuntu you need to download the source or binary and build it. Typically after building it will install to a directory like `/usr/local/lib/libshout`
- Install dependencies: `npm i`
- Start icecast server
- Run `npm test` and see it's working
