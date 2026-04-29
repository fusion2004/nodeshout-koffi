import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import {
  shoutInit,
  shoutShutdown,
  shoutVersion,
  createShout,
  createShoutMetadata,
  ShoutErrorTypes,
} from '../src/index.js';

beforeAll(() => {
  shoutInit();
});

afterAll(() => {
  shoutShutdown();
});

describe('shoutVersion', () => {
  test('returns a non-empty version string', () => {
    const v = shoutVersion();
    expect(typeof v).toBe('string');
    expect(v.length).toBeGreaterThan(0);
    expect(v).toMatch(/^\d+\.\d+\.\d+/);
  });
});

describe('Shout lifecycle', () => {
  test('createShout returns an instance with no initial error', () => {
    const shout = createShout();
    expect(shout.getError()).toBe('No error');
    expect(shout.getErrno()).toBe(ShoutErrorTypes.SUCCESS);
    shout.free();
  });

  test('benign setters return SUCCESS pre-open()', () => {
    const shout = createShout();
    expect(shout.setHost('localhost')).toBe(ShoutErrorTypes.SUCCESS);
    expect(shout.setPort(8000)).toBe(ShoutErrorTypes.SUCCESS);
    expect(shout.setUser('source')).toBe(ShoutErrorTypes.SUCCESS);
    expect(shout.setPassword('hackme')).toBe(ShoutErrorTypes.SUCCESS);
    expect(shout.setMount('test')).toBe(ShoutErrorTypes.SUCCESS);
    shout.free();
  });

  test('getters reflect set values', () => {
    const shout = createShout();
    shout.setHost('example.com');
    shout.setPort(9000);
    shout.setUser('me');
    shout.setMount('/stream');
    expect(shout.getHost()).toBe('example.com');
    expect(shout.getPort()).toBe(9000);
    expect(shout.getUser()).toBe('me');
    expect(shout.getMount()).toBe('/stream');
    shout.free();
  });
});

describe('ShoutMetadata lifecycle', () => {
  test('createShoutMetadata returns an instance and add() succeeds', () => {
    const md = createShoutMetadata();
    expect(md.add('song', 'Test - Title')).toBe(ShoutErrorTypes.SUCCESS);
    md.free();
  });
});
