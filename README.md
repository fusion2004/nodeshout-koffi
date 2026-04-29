# nodeshout

Native libshout bindings for Node.js.

> Libshout allows applications to easily communicate and broadcast to an Icecast streaming media server. It handles the socket connections, metadata communication, and data streaming for the calling application, and lets developers focus on feature sets instead of implementation details.

More detail: http://icecast.org

Tracks libshout 2.4.x. Upstream API reference: https://gitlab.xiph.org/xiph/icecast-libshout/-/blob/master/doc/libshout.xml.

## Requirements

- **Node.js >= 22** — supports active LTS (24) and maintenance LTS (22).
- **libshout** installed at the system level.

Install libshout:

```sh
# macOS
brew install libshout

# Debian/Ubuntu
sudo apt-get install libshout3
```

Then add nodeshout:

```sh
yarn add nodeshout
# or: npm i nodeshout
```

## Usage

nodeshout is a **pure ESM** package. Import named exports:

```ts
import {
  shoutInit,
  shoutShutdown,
  shoutVersion,
  createShout,
  ShoutErrorTypes,
  ShoutFormats,
  ShoutUsages,
  ShoutAudioInfoKeys,
} from 'nodeshout';

// Initialize
shoutInit();

// Create a shout instance
const shout = createShout();

// Configure it
shout.setHost('localhost');
shout.setPort(8000);
shout.setUser('source');
shout.setPassword('password');
shout.setMount('mount');
shout.setContentFormat(ShoutFormats.MP3, ShoutUsages.AUDIO, null);
shout.setAudioInfo(ShoutAudioInfoKeys.BITRATE, '192');
shout.setAudioInfo(ShoutAudioInfoKeys.SAMPLERATE, '44100');
shout.setAudioInfo(ShoutAudioInfoKeys.CHANNELS, '2');
```

Open the connection — and check the return code. Every method documented as "Callers should check this" returns `ShoutErrorTypes.SUCCESS` (`0`) on success or a negative `ShoutErrorTypes` value on failure. On failure, `shout.getError()` returns a human-readable message.

```ts
const status = shout.open();
if (status !== ShoutErrorTypes.SUCCESS) {
  console.error('shout_open failed:', shout.getError());
  process.exit(1);
}
```

After successful connection, send audio file chunks via `shout.send` (also checked):

```ts
const sendStatus = shout.send(buffer, bytesRead);
if (sendStatus !== ShoutErrorTypes.SUCCESS) {
  console.error('shout_send failed:', shout.getError());
}
```

For synchronization, two methods are provided. `shout.sync()` blocks the current thread. `shout.delay()` returns how many milliseconds to wait before sending the next audio chunk.

> If you're streaming multiple files, beware that Icecast requires stable bitrate and sample rate for the whole stream. All your music files should have identical bitrate and sample rate.

## Examples

Check the `/demos` folder. Run them via:

```sh
yarn demo:blocking
yarn demo:nonblocking
```

(Both expect a local Icecast on `localhost:8000` with credentials `source:hackme` and a sample MP3 at `music/test.mp3`.)

## Constants

All libshout enums are exposed as named `as const` objects:

| Export | Purpose |
| -- | -- |
| `ShoutErrorTypes` | `SHOUTERR_*` codes returned by every checked method. |
| `ShoutFormats` | `SHOUT_FORMAT_*` — pass to `setContentFormat()`. |
| `ShoutUsages` | `SHOUT_USAGE_*` — bitwise OR for `setContentFormat()`. |
| `ShoutProtocols` | `SHOUT_PROTOCOL_*` — pass to `setProtocol()`. |
| `ShoutTlsModes` | `SHOUT_TLS_*` — pass to `setTls()`. |
| `ShoutBlocking` | `SHOUT_BLOCKING_*` — pass to `setNonblocking()`. |
| `ShoutAudioInfoKeys` | `SHOUT_AI_*` — keys for `setAudioInfo()` / `getAudioInfo()`. |
| `ShoutMetaKeys` | `SHOUT_META_*` — keys for `setMeta()` / `getMeta()`. |

## Deprecated APIs

These wrappers still work but are marked `@deprecated` because the underlying libshout functions are obsolete. New code should use the listed replacements:

| Deprecated | Replacement |
| -- | -- |
| `setName(s)` / `getName()` | `setMeta(ShoutMetaKeys.NAME, s)` / `getMeta(ShoutMetaKeys.NAME)` |
| `setUrl(s)` / `getUrl()` | `setMeta(ShoutMetaKeys.URL, s)` / `getMeta(ShoutMetaKeys.URL)` |
| `setGenre(s)` / `getGenre()` | `setMeta(ShoutMetaKeys.GENRE, s)` / `getMeta(ShoutMetaKeys.GENRE)` |
| `setDescription(s)` / `getDescription()` | `setMeta(ShoutMetaKeys.DESCRIPTION, s)` / `getMeta(ShoutMetaKeys.DESCRIPTION)` |
| `setFormat(fmt)` / `getFormat()` | `setContentFormat(fmt, usage, codecs)` / `getContentFormat()` |
| `setMetadata(m)` | `setMetadataUtf8(m)` |
| `setDumpfile(p)` / `getDumpfile()` | (no replacement — only useful with the deprecated `ShoutProtocols.XAUDIOCAST`) |

The `ShoutFormats.WEBMAUDIO` and `ShoutProtocols.XAUDIOCAST` constants are also deprecated.

## Migrating from v2

v3 is a hard break. Every consumer needs changes:

| v2 | v3 |
| -- | -- |
| `const nodeshout = require('nodeshout')` | `import * as nodeshout from 'nodeshout'` |
| `nodeshout.init()` | `nodeshout.shoutInit()` |
| `nodeshout.shutdown()` | `nodeshout.shoutShutdown()` |
| `nodeshout.getVersion()` | `nodeshout.shoutVersion()` |
| `nodeshout.create()` | `nodeshout.createShout()` |
| `nodeshout.createMetadata()` | `nodeshout.createShoutMetadata()` |
| `nodeshout.ErrorTypes` | `nodeshout.ShoutErrorTypes` |
| `nodeshout.Formats` | `nodeshout.ShoutFormats` |
| `nodeshout.Protocols` | `nodeshout.ShoutProtocols` |
| `nodeshout.Usages` | `nodeshout.ShoutUsages` |
| `nodeshout.TlsModes` | `nodeshout.ShoutTlsModes` |
| `nodeshout.Blocking` | `nodeshout.ShoutBlocking` |
| `nodeshout.AudioInfoKeys` | `nodeshout.ShoutAudioInfoKeys` |
| `nodeshout.MetaKeys` | `nodeshout.ShoutMetaKeys` |
| class `ShoutT` | class `Shout` |
| class `MetadataT` | class `ShoutMetadata` |

`ShoutT` and `MetadataT` are kept as deprecated *type* aliases for one release; the runtime classes have new names.

## Developing

Tooling is pinned via [mise](https://mise.jdx.dev/) and [Yarn Berry](https://yarnpkg.com/):

- `mise install` — installs node & yarn
- `yarn install` — installs dependencies (`nodeLinker: node-modules`).
- `yarn typecheck` — runs `tsc --noEmit`.
- `yarn test` — runs vitest unit tests (no server required).
- `yarn build` — emits `dist/*.js` and `dist/*.d.ts`.
- `yarn demos` — runs both demos against a local Icecast (start `icecast -c demos/icecast.xml` first).

