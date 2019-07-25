import Instruction, { MessageBoxButtons, MessageBoxIcon } from './instruction';
import prompt from './prompt';
import VBScript from './vbscript';

async function mainMenu() {
  prompt.clear();
  prompt.print('====== VBS GEN ======\n');
  const choice = await prompt.selectOneFrom('Select', 'Start', 'Exit');

  if (choice === 'Start') {
    await makeInstruction(new VBScript());
  }
}

async function makeInstruction(vbs: VBScript) {
  const instCount = vbs.instructions.length;

  prompt.clear();
  prompt.print(`Instruction #${instCount + 1}`);
  prompt.print(`Your script has ${instCount} instruction(s)\n`);

  const instType = await prompt.selectOneFrom(
    'Select instruction',
    'Show message box',
    'Save',
    'Abort'
  );
  prompt.clear();

  switch (instType) {
    case 'Show message box':
      await makeMessageBox(vbs);
      break;

    case 'Save':
      await save(vbs);
      return mainMenu();

    case 'Abort':
      prompt.print('Are you sure you want to discard your progress?');
      const choice = await prompt.selectOneFrom('Select', 'Yes, discard', 'No');

      if (choice === 'Yes, discard') {
        return mainMenu();
      }
  }

  await makeInstruction(vbs);
}

async function save(vbs: VBScript): Promise<void> {
  let path = '';
  while (path === '') {
    path = await prompt.readLine('Enter path: ');
  }

  try {
    vbs.save(path);
  } catch (e) {
    prompt.print(`Error: ${e.message}`);
    return save(vbs);
  }

  prompt.print('\nScript saved!');
  await prompt.pause();
}

async function makeMessageBox(vbs: VBScript) {
  const message = await prompt.readLine('Enter message: ');
  const title = await prompt.readLine('Enter message: ');
  const buttons = await prompt.selectOneFrom(
    'Select buttons',
    'OK',
    'OK, Cancel',
    'Abort, Retry, Ignore',
    'Yes, No, Cancel',
    'Yes, No',
    'Retry, Cancel'
  );
  const icon = await prompt.selectOneFrom(
    'Select icon',
    'None',
    'Critical',
    'Question',
    'Exclamation',
    'Information'
  );

  const enumValsByButtons: Record<typeof buttons, MessageBoxButtons> = {
    OK: MessageBoxButtons.Ok,
    'OK, Cancel': MessageBoxButtons.OkCancel,
    'Abort, Retry, Ignore': MessageBoxButtons.AbortRetryIgnore,
    'Yes, No, Cancel': MessageBoxButtons.YesNoCancel,
    'Yes, No': MessageBoxButtons.YesNo,
    'Retry, Cancel': MessageBoxButtons.RetryCancel,
  };

  const inst = Instruction.messageBox(
    message,
    title,
    enumValsByButtons[buttons],
    MessageBoxIcon[icon]
  );

  vbs.instructions.push(inst);
}

mainMenu();
