interface Encodable {
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
  buttons = MessageBoxButtons.Ok,
  icon = MessageBoxIcon.Default
): Encodable {
  prompt = prompt.replace(/"/g, '""');
  return {
    encode() {
      return `x = MsgBox("${prompt}", ${buttons + icon})`;
    },
  };
}

export default {
  messageBox,
};
