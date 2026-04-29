import * as nodeshout from '../src/index.js';
import { open } from 'node:fs/promises';
import { resolve } from 'node:path';

const sleep = (ms: number) => new Promise<void>((resolveTimer) => setTimeout(resolveTimer, ms));

async function main() {
  nodeshout.shoutInit();
  console.log('Libshout version: ' + nodeshout.shoutVersion());

  const shout = nodeshout.createShout();
  shout.setHost('localhost');
  shout.setPort(8000);
  shout.setUser('source');
  shout.setPassword('hackme');
  shout.setMount('test');
  shout.setContentFormat(nodeshout.ShoutFormats.MP3, nodeshout.ShoutUsages.AUDIO, null);
  shout.setAudioInfo(nodeshout.ShoutAudioInfoKeys.BITRATE, '192');
  shout.setAudioInfo(nodeshout.ShoutAudioInfoKeys.SAMPLERATE, '44100');
  shout.setAudioInfo(nodeshout.ShoutAudioInfoKeys.CHANNELS, '2');

  const openStatus = shout.open();
  if (openStatus !== nodeshout.ShoutErrorTypes.SUCCESS) {
    throw new Error(`shout_open failed: ${shout.getError()}`);
  }

  const musicPath = resolve(import.meta.dirname, '..', 'music', 'test.mp3');
  const fileHandle = await open(musicPath);
  const stats = await fileHandle.stat();
  const fileSize = stats.size;
  const chunkSize = 65536;
  const buf = Buffer.alloc(chunkSize);
  let totalBytesRead = 0;

  while (totalBytesRead < fileSize) {
    const readLength = (totalBytesRead + chunkSize) <= fileSize
      ? chunkSize
      : fileSize - totalBytesRead;

    const { bytesRead } = await fileHandle.read(buf, 0, readLength, totalBytesRead);

    totalBytesRead = totalBytesRead + bytesRead;
    console.log(`Bytes read: ${totalBytesRead} / ${fileSize}`);

    if (bytesRead === 0) break;

    const sendStatus = shout.send(buf, bytesRead);
    if (sendStatus !== nodeshout.ShoutErrorTypes.SUCCESS) {
      throw new Error(`shout_send failed: ${shout.getError()}`);
    }

    // This will NOT block the I/O
    const delay = shout.delay();
    await sleep(delay);
  }

  console.log('Finished reading, closing shout...');

  await fileHandle.close();
  shout.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
