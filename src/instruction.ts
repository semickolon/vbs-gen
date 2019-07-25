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
  Default,
  Critical = 16,
  Question = 32,
  Exclamation = 48,
  Information = 64,
}

function messageBox(
  prompt: string,
  title = '',
  buttons = MessageBoxButtons.Ok,
  icon = MessageBoxIcon.Default
): Encodable {
  prompt = prompt.replace(/"/g, '""');
  return {
    encode() {
      const params = [`"${prompt}"`, `${buttons + icon}`];
      if (title !== '') {
        params.push(`"${title}"`);
      }

      return `x = MsgBox(${params.join(', ')})`;
    },
  };
}

export default {
  messageBox,
};
