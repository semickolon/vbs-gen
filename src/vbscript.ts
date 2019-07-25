import fs from 'fs';

import { URL } from 'url';
import { Encodable } from './instruction';

export default class VBScript {
  public readonly instructions: Encodable[] = [];

  public compile() {
    return this.instructions.map(inst => inst.encode().trim()).join('\n');
  }

  public save(path: string | URL) {
    fs.writeFileSync(path, this.compile());
  }
}
