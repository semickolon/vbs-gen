import inquirer from 'inquirer';

function print(message: string) {
  console.log(message);
}

async function selectOneFrom(query: string, ...choices: string[]) {
  const { data: chosen } = await inquirer.prompt([
    {
      type: 'list',
      name: 'data',
      message: query,
      choices,
    },
  ]);
  return chosen as string;
}

export default {
  print,
  selectOneFrom,
};
