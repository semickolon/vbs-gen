import startCli from './cli';
import prompt from './prompt';

import fs from 'fs';
import mockFs from 'mock-fs';

jest.mock('./prompt');

afterEach(() => {
  jest.resetAllMocks();
  mockFs.restore();
});

test('save, abort, then exit immediately, ensure no files were made', async () => {
  mockFs({});
  mockSelectOneFrom('Start');
  mockSelectOneFrom('Abort');
  mockSelectOneFrom('No, go back');
  mockSelectOneFrom('Abort');
  mockSelectOneFrom('Yes, discard');
  mockSelectOneFrom('Exit');

  await startCli();

  expect(fs.readdirSync('.')).toHaveLength(0);
});

test('save script with no instructions, re-requests input on invalid save path', async () => {
  mockFs({});
  mockSelectOneFrom('Start');
  mockSelectOneFrom('Save');
  mockReadLine('invalid/dir/lmao.vbs');
  mockReadLine('empty.vbs');

  await startCli();

  expect(fs.readFileSync('empty.vbs').toString()).toBe('');
});

test('save script with one instruction in a directory', async () => {
  mockFs({
    myFolder: {},
  });

  mockSelectOneFrom('Start');
  mockSelectOneFrom('Show message box');
  mockReadLine('Message here');
  mockReadLine('Title here');
  mockSelectOneFrom('Retry, Cancel');
  mockSelectOneFrom('Critical');
  mockSelectOneFrom('Save');
  mockReadLine('myFolder/rubbish');

  await startCli();

  expect(fs.readFileSync('myFolder/rubbish').toString()).not.toBe('');
});

function mockReadLine(input: string) {
  (prompt.readLine as any).mockResolvedValueOnce(input);
}

function mockSelectOneFrom(choice: string) {
  (prompt.selectOneFrom as any).mockResolvedValueOnce(choice);
}
