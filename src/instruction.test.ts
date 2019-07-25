import Instruction, { MessageBoxButtons, MessageBoxIcon } from './instruction';

describe('message box instruction', () => {
  test('encodes prompt only', () => {
    const inst = Instruction.messageBox('Hello, world');
    expect(inst.encode()).toMatch(msgBoxRegex(`"Hello, world"`, `0`));
  });

  test('escapes double quotes', () => {
    const inst = Instruction.messageBox('top"kek"!!');
    expect(inst.encode()).toMatch(msgBoxRegex(`"top"kek"!!"`, `0`));
  });

  test(`encodes prompt and buttons`, () => {
    const inst = Instruction.messageBox('Wow', MessageBoxButtons.AbortRetryIgnore);
    expect(inst.encode()).toMatch(msgBoxRegex(`"Wow"`, `2`));
  });

  test(`encodes prompt, buttons, and icon`, () => {
    const inst = Instruction.messageBox(
      'samplawer   123.',
      MessageBoxButtons.YesNoCancel,
      MessageBoxIcon.Question
    );
    expect(inst.encode()).toMatch(msgBoxRegex(`"samplawer   123."`, `35`));
  });

  function msgBoxRegex(...params: string[]): RegExp {
    params = params.map(param => {
      param = param.trim();
      if (param.startsWith('"') && param.endsWith('"')) {
        // Escape all double quotes inside a string param
        param = `"${param.slice(1, -1).replace(/"/g, '""')}"`;
      }
      return param;
    });

    const rxParams = params.join('\\s*,\\s*');
    return new RegExp(`^\\D+\\s*=\\s*MsgBox\\s*\\(\\s*${rxParams}\\s*\\)$`);
  }
});
