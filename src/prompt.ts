import inquirer from 'inquirer';

function print(message: string) {
  console.log(message);
}

function clear() {
  print('\u001b[2J\u001b[0;0H');
}

async function readLine(query: string) {
  const { data: input } = await inquirer.prompt([
    {
      type: 'input',
      name: 'data',
      message: query,
    },
  ]);
  return input as string;
}

async function pause(message?: string) {
  if (message) {
    print(message);
  }

  process.stdin.resume();

  return new Promise(resolve => {
    process.stdin.on('data', resolve);
  });
}

async function selectOneFrom<T extends string>(query: string, ...choices: T[]): Promise<T> {
  const { data: chosen } = await inquirer.prompt([
    {
      type: 'list',
      name: 'data',
      message: query,
      choices,
    },
  ]);
  return chosen;
}

export default {
  print,
  clear,
  readLine,
  pause,
  selectOneFrom,
};
