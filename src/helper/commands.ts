import { spawn } from 'node:child_process';

export const run = (cmd: string, args?: string[]) =>
  new Promise(resolve => {
    const child = spawn(cmd, args ?? [], { stdio: 'inherit' });
    child.on('exit', resolve);
  });
