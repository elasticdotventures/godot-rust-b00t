import { JsonMap, parse, stringify } from '@iarna/toml';
import * as fs from 'fs/promises';
import { dirname } from 'path';
import { DatabaseToolOptions } from '../types.js';
import { run } from './commands.js';
import { CargoPackage, CargoPackagesInfo } from './project.js';
/**
 * Reads a Cargo.toml file and returns the parsed object.
 * @param path The path to the Cargo.toml file.
 */
export async function readCargoFile(path: string) {
  let content = await fs.readFile(path, 'utf-8');
  return parse(content) as CargoPackage;
}
/**
 * Saves data to a Cargo.toml file.
 * @param path The path of where to save the Cargo.toml file.
 * @param content The content to save to the Cargo.toml file.
 */
export async function saveCargoFile(path: string, content: CargoPackage) {
  let text = stringify(content as JsonMap);
  await fs.writeFile(path, text);
}
/**
 * Checks a list of paths for a Cargo workspace object.
 * @param paths A list of file paths to check.
 */
export async function cargoWorkspacePath(paths: string[] | string) {
  paths = Array.isArray(paths) ? paths : [paths];
  for (const path of paths) {
    let parsed = await readCargoFile(path);
    if (parsed?.workspace) {
      return path;
    }
  }
}
/**
 * Gets one of the packages that matches the name.
 * @param name The name of the package to find.
 * @param paths A list of file paths to check.
 */
// export async function cargoPackagePath(name: string, paths: string[] | string) {
//   paths = Array.isArray(paths) ? paths : [paths];
//   for (const path of paths) {
//     let content = await fs.readFile(path, 'utf-8');
//     let parsed = parse(content);
//     const packageName = parsed?.package?.name;
//     if (packageName === name) {
//       return path;
//     }
//   }
// }
/**
 * Gets the package info from a list of paths.
 * @param paths The paths to get the package info from.
 */
export async function cargoPackageInfo(paths: string[] | string) {
  paths = Array.isArray(paths) ? paths : [paths];
  const packages: CargoPackagesInfo = {};
  for (const path of paths) {
    let content = await fs.readFile(path, 'utf-8');
    let parsed = parse(content) as CargoPackage;
    const packageName = (parsed?.package?.name as string) ?? '';
    if (packageName) packages[packageName] = { path, parsed };
  }
  return packages;
}
/**
 * Adds a package to the Cargo.toml file.
 * @param packageName The name of the package to add.
 * @param packagePath The directory root of the package.
 */
export async function cargoAddDep(packageName: string, packagePath: string) {
  if (packagePath.toLowerCase().endsWith('cargo.toml')) packagePath = dirname(packagePath);
  process.chdir(packagePath);
  await run('cargo', ['add', packageName]);
}
/**
 * Adds a git package to the Cargo.toml file.
 * @param packageName The name of the package to add.
 * @param packagePath The directory root of the package.
 * @param options The options to add to the git package.
 */
export async function cargoAddGitDep(packageName: string, packagePath: string, options: DatabaseToolOptions) {
  if (packagePath.toLowerCase().endsWith('cargo.toml')) packagePath = dirname(packagePath);
  process.chdir(packagePath);
  const url = options.git?.url ? options.git.url : undefined;
  const branch = options.git?.branch ? options.git.branch : undefined;
  if (!url) throw new Error('No URL provided for git package');
  await run('cargo', ['add', packageName, '--git', url, ...(branch ? ['--branch', branch] : [])]);
}
/**
 * Removes a package from the Cargo.toml file.
 * @param packageName The name of the package to remove.
 * @param packagePath The directory root of the package.
 */
export async function cargoRemoveDep(packageName: string, packagePath: string) {
  if (packagePath.toLowerCase().endsWith('cargo.toml')) packagePath = dirname(packagePath);
  process.chdir(packagePath);
  await run('cargo', ['remove', packageName]);
}
/**
 * Changes the name of a package in the Cargo.toml file.
 * @param packageName The new name of the package.
 * @param packagePath The directory root of the package.
 */
export async function changePackageName(packageName: string, packagePath: string) {
  if (packagePath.toLowerCase().endsWith('cargo.toml')) packagePath = dirname(packagePath);
  process.chdir(packagePath);
  let parsed = await readCargoFile('Cargo.toml');

  if (parsed.workspace) {
    throw new Error('Cannot change the name of a workspace package');
  }

  if (parsed.package) {
    parsed.package.name = packageName;
    saveCargoFile('Cargo.toml', parsed);
  }
}
