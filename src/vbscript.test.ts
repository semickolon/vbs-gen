import fs from 'fs';
import mock from 'mock-fs';
import VBScript from './vbscript';

import { Encodable } from './instruction';

// I know, I know, this is not how real compilers operate
describe('instruction compilation', () => {
  it('compiles zero instructions', () => {
    expect(new VBScript().compile()).toBe('');
  });

  it('compiles one instruction', () => {
    const vbs = new VBScript();
    const inst: Encodable = {
      encode: () => '@test$',
    };

    vbs.instructions.push(inst, inst);
    vbs.instructions.pop();

    expect(vbs.compile()).toBe('@test$');
  });

  it('compiles three instructions and trims upon encoding', () => {
    const vbs = new VBScript();
    const inst1: Encodable = {
      encode: () => 'test inst #1 ',
    };
    const inst2: Encodable = {
      encode: () => '\n\n\njibber jabber  ',
    };
    const inst3: Encodable = {
      encode: () => ' AJ AJ \t ',
    };

    vbs.instructions.push(inst3, inst1, inst2);

    expect(vbs.compile()).toBe('AJ AJ\ntest inst #1\njibber jabber');
  });

  it('saves to file system', () => {
    mock({
      dir: {},
    });

    const vbs = new VBScript();
    const inst1: Encodable = {
      encode: () => 'abc',
    };
    const inst2: Encodable = {
      encode: () => 'xyz',
    };

    vbs.instructions.push(inst1, inst2, inst2, inst1);
    vbs.save('dir/sample_file.vbs');
    vbs.save('asdlsdf.xml');

    expect(fs.readFileSync('dir/sample_file.vbs').toString()).toBe('abc\nxyz\nxyz\nabc');
    expect(fs.readFileSync('asdlsdf.xml').toString()).toBe('abc\nxyz\nxyz\nabc');

    mock.restore();
  });

  it('throws if saving to specified path is invalid', () => {
    mock({
      non: {},
      boi: {
        existent: {},
      },
    });
    const vbs = new VBScript();

    expect(() => vbs.save('non/existent/dir/a.vbs')).toThrow();
    expect(() => vbs.save('boi/existent/jokelang/a.vbs')).toThrow();

    mock.restore();
  });
});
