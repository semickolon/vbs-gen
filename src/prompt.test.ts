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
