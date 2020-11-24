#!/usr/bin/env node

require = require('esm')(module /*, options*/);
const commander = require('commander');
const packageConfig = require('../package');
const hb = require('../lib/src/command/index');

commander.version(packageConfig.version, '-v --version').usage('<command> [options]');

commander
  .command('add [filePath] [targetPath]')
  .description('copy file')
  .action((filePath, targetPath) => {
    try {
      hb.runAdd(filePath, targetPath);
    } catch (err) {
      console.error(err.stack);
      process.exit(1);
    }
  });

commander
  .command('block <action> [url] [destPath]')
  .option('-c, --skip-conflict', 'skip to throw deps conflict error')
  .option('-i, --skip-install', 'skip to install deps')
  .option('-u, --skip-update', 'skip to update local material-store cache')
  .description(
    `
    run block <action>
    --skip-conflict: skip to throw deps conflict error,
    --skip-update: skip to update local material-store cache,
    --skip-install: skip to install deps`
  )
  .action((action, url, destPath, options) => {
    try {
      let { skipConflict: isSkipConflict, skipInstall: isSkipInstall, skipUpdate: isSkipUpdate } = options;

      hb.runBlock({
        action,
        url,
        destPath,
        isSkipConflict,
        isSkipInstall,
        isSkipUpdate
      });
    } catch (error) {
      console.error(error.stack);
      process.exit(1);
    }
  });

commander.parse(process.argv);
