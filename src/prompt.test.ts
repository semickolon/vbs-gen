import inquirer from 'inquirer';
import prompt from './prompt';

jest.mock('inquirer');
jest.spyOn(console, 'log').mockImplementation();

beforeEach(() => {
  jest.resetAllMocks();
});

test('prints with console.log', () => {
  prompt.print('hello');
  prompt.print('world 1p231934 asd!');

  expect(console.log).toHaveBeenNthCalledWith(1, 'hello');
  expect(console.log).toHaveBeenNthCalledWith(2, 'world 1p231934 asd!');
});

test('requests input for single choice menu with inquirer.prompt', async () => {
  (inquirer.prompt as any)
    .mockResolvedValueOnce({ data: 'The Shining' })
    .mockResolvedValueOnce({ data: 'Tide Pods' });

  const faveFilm = await prompt.selectOneFrom(
    'Fave film?',
    'Midsommar',
    'The Shining',
    'Hereditary'
  );
  const faveFood = await prompt.selectOneFrom(
    'Fave food? Fave food?????!',
    'Pizza',
    'Ice Cream',
    'Tide Pods'
  );

  expect(faveFilm).toBe('The Shining');
  expect(faveFood).toBe('Tide Pods');
});

test('requests console input with inquirer.prompt', async () => {
  (inquirer.prompt as any)
    .mockResolvedValueOnce({ data: 'abc' })
    .mockResolvedValueOnce({ data: '123_456' });

  const input1 = await prompt.readLine('Letters?');
  const input2 = await prompt.readLine('Numbers?');

  expect(input1).toBe('abc');
  expect(input2).toBe('123_456');
});

test('pauses with no message until a key is pressed', done => {
  const pause = prompt.pause();
  process.stdin.emit('data');

  pause.then(() => {
    expect(console.log).not.toHaveBeenCalled();
    done();
  });
});

test('pauses with a given message until a key is pressed', done => {
  const pause = prompt.pause('Press any key to continue...');
  process.stdin.emit('data');

  pause.then(() => {
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('Press any key to continue...');
    done();
  });
});

test('clears prompt', () => {
  // Very tautological. Look for ways to verify prompt is cleared.
  prompt.clear();
  expect(console.log).toHaveBeenCalledTimes(1);
  expect(console.log).toHaveBeenCalledWith('\u001b[2J\u001b[0;0H');
});
