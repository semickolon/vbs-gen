export interface Encodable {
  encode: () => string;
}

export enum MessageBoxButtons {
  Ok,
  OkCancel,
  AbortRetryIgnore,
  YesNoCancel,
  YesNo,
  RetryCancel,
}

export enum MessageBoxIcon {
  None,
  Critical = 16,
  Question = 32,
  Exclamation = 48,
  Information = 64,
}

function messageBox(
  prompt: string,
  title = '',
  buttons = MessageBoxButtons.Ok,
  icon = MessageBoxIcon.None
): Encodable {
  return {
    encode() {
      // Escape all double quotes inside a string param
      const message = prompt.replace(/"/g, '""');
      const params = [`"${message}"`, `${buttons + icon}`];

      if (title !== '') {
        params.push(`"${title}"`);
      }

      return `x = MsgBox(${params.join(', ')})`;
    },
  };
}

function openCmd(): Encodable {
  return {
    encode: () => 'CreateObject("Wscript.Shell").Run "cmd.exe"',
  };
}

export default {
  messageBox,
  openCmd,
};
