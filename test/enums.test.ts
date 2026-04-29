import { describe, expect, test } from 'vitest';
import {
  ShoutErrorTypes,
  ShoutFormats,
  ShoutProtocols,
  ShoutUsages,
  ShoutTlsModes,
  ShoutBlocking,
  ShoutAudioInfoKeys,
  ShoutMetaKeys,
} from '../src/index.js';

describe('ShoutErrorTypes', () => {
  test('SUCCESS is 0', () => {
    expect(ShoutErrorTypes.SUCCESS).toBe(0);
  });
  test('negative codes match libshout SHOUTERR_* values', () => {
    expect(ShoutErrorTypes.INSANE).toBe(-1);
    expect(ShoutErrorTypes.NOCONNECT).toBe(-2);
    expect(ShoutErrorTypes.RETRY).toBe(-13);
  });
  test('has 14 entries', () => {
    expect(Object.keys(ShoutErrorTypes)).toHaveLength(14);
  });
});

describe('ShoutFormats', () => {
  test('matches libshout SHOUT_FORMAT_* values', () => {
    expect(ShoutFormats.OGG).toBe(0);
    expect(ShoutFormats.MP3).toBe(1);
    expect(ShoutFormats.WEBM).toBe(2);
    expect(ShoutFormats.WEBMAUDIO).toBe(3);
    expect(ShoutFormats.MATROSKA).toBe(4);
    expect(ShoutFormats.TEXT).toBe(5);
  });
});

describe('ShoutProtocols', () => {
  test('matches libshout SHOUT_PROTOCOL_* values', () => {
    expect(ShoutProtocols.HTTP).toBe(0);
    expect(ShoutProtocols.XAUDIOCAST).toBe(1);
    expect(ShoutProtocols.ICY).toBe(2);
    expect(ShoutProtocols.ROARAUDIO).toBe(3);
  });
});

describe('ShoutUsages', () => {
  test('bitflag values match SHOUT_USAGE_*', () => {
    expect(ShoutUsages.AUDIO).toBe(0x0001);
    expect(ShoutUsages.VISUAL).toBe(0x0002);
    expect(ShoutUsages.METADATA).toBe(0x0040);
    expect(ShoutUsages.THREE_D).toBe(0x1000);
    expect(ShoutUsages.FOUR_D).toBe(0x2000);
  });
  test('values are powers of two (single-bit flags)', () => {
    for (const value of Object.values(ShoutUsages)) {
      expect(value & (value - 1)).toBe(0);
    }
  });
});

describe('ShoutTlsModes', () => {
  test('matches libshout SHOUT_TLS_* values', () => {
    expect(ShoutTlsModes.DISABLED).toBe(0);
    expect(ShoutTlsModes.AUTO).toBe(1);
    expect(ShoutTlsModes.AUTO_NO_PLAIN).toBe(2);
    expect(ShoutTlsModes.RFC2818).toBe(11);
    expect(ShoutTlsModes.RFC2817).toBe(12);
  });
});

describe('ShoutBlocking', () => {
  test('matches libshout SHOUT_BLOCKING_* values', () => {
    expect(ShoutBlocking.DEFAULT).toBe(255);
    expect(ShoutBlocking.FULL).toBe(0);
    expect(ShoutBlocking.NONE).toBe(1);
  });
});

describe('ShoutAudioInfoKeys', () => {
  test('matches libshout SHOUT_AI_* string values', () => {
    expect(ShoutAudioInfoKeys.BITRATE).toBe('bitrate');
    expect(ShoutAudioInfoKeys.SAMPLERATE).toBe('samplerate');
    expect(ShoutAudioInfoKeys.CHANNELS).toBe('channels');
    expect(ShoutAudioInfoKeys.QUALITY).toBe('quality');
  });
});

describe('ShoutMetaKeys', () => {
  test('matches libshout SHOUT_META_* string values', () => {
    expect(ShoutMetaKeys.NAME).toBe('name');
    expect(ShoutMetaKeys.URL).toBe('url');
    expect(ShoutMetaKeys.GENRE).toBe('genre');
    expect(ShoutMetaKeys.DESCRIPTION).toBe('description');
    expect(ShoutMetaKeys.IRC).toBe('irc');
    expect(ShoutMetaKeys.AIM).toBe('aim');
    expect(ShoutMetaKeys.ICQ).toBe('icq');
  });
});
