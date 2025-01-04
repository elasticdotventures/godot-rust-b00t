import chalk from 'chalk';
import * as readline from 'node:readline';

const theme = {
  defaultValue: '#8a8a8a',
  info: '#75baff',
  success: '#6cfc47',
  error: '#ff3d3d',
  warning: '#ff9f3d',
};

export const success = (text: string) => chalk.hex(theme.success)(text);
export const info = (text: string) => chalk.hex(theme.info)(text);
export const defaultValue = (text: string) => chalk.hex(theme.defaultValue)(text);
export const error = (text: string) => chalk.hex(theme.error)(text);
export const warning = (text: string) => chalk.hex(theme.warning)(text);

export const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
/**
 * Ask a question to the user.
 * @param query The question to ask.
 */
export function askQuestion(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query + ' ', resolve));
}
