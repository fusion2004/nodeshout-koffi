const nodeshout = require('../');
const fs = require('fs/promises');


async function main() {
    // Init nodeshout
    nodeshout.init();
    console.log('Libshout version: ' + nodeshout.getVersion());

    // Create instance and configure it.
    const shout = nodeshout.create();
    shout.setHost('localhost');
    shout.setPort(8000);
    shout.setUser('source');
    shout.setPassword('hackme');
    shout.setMount('test');
    shout.setContentFormat(nodeshout.Formats.MP3, nodeshout.Usages.AUDIO, null);
    shout.setAudioInfo(nodeshout.AudioInfoKeys.BITRATE, '192');
    shout.setAudioInfo(nodeshout.AudioInfoKeys.SAMPLERATE, '44100');
    shout.setAudioInfo(nodeshout.AudioInfoKeys.CHANNELS, '2');

    // Open the instance — every checked method returns ErrorTypes.SUCCESS on success,
    // and shout.getError() yields the human-readable reason on failure.
    const openStatus = shout.open();
    if (openStatus !== nodeshout.ErrorTypes.SUCCESS) {
        throw new Error(`shout_open failed: ${shout.getError()}`);
    }

    // Open mp3 file & prepare reading
    const fileHandle = await fs.open('./music/test.mp3');
    const stats = await fileHandle.stat();
    const fileSize = stats.size;
    const chunkSize = 65536;
    const buf = Buffer.alloc(chunkSize);
    let totalBytesRead = 0;

    // Reading & sending loop
    while (totalBytesRead < fileSize) {
        // For the latest chunk, its size may be smaller than the desired
        const readLength = (totalBytesRead + chunkSize) <= fileSize ?
            chunkSize :
            fileSize - totalBytesRead;

        // Read file
        const {bytesRead} = await fileHandle.read(buf, 0, readLength, totalBytesRead);

        totalBytesRead = totalBytesRead + bytesRead;
        console.log(`Bytes read: ${totalBytesRead} / ${fileSize}`);

        // If 0 bytes read, it means that we're finished reading
        if (bytesRead === 0) {
            break;
        }

        // Send the data
        const sendStatus = shout.send(buf, bytesRead);
        if (sendStatus !== nodeshout.ErrorTypes.SUCCESS) {
            throw new Error(`shout_send failed: ${shout.getError()}`);
        }

        // Wait for the next chunk
        // THIS WILL BLOCK THE I/O
        shout.sync();
    }

    console.log('Finished reading, closing shout...');

    // Close the file handle
    await fileHandle.close();

    // Close nodeshout
    shout.close();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
