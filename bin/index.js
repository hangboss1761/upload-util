#!/usr/bin/env node

require = require('esm')(module /*, options*/);
const commander = require('commander');
const { prompt } = require('enquirer');
const { run } = require('../dist/index');

commander
  .command('start')
  .description('start upload')
  .action(async () => {
    try {
      const response = await prompt([
        {
          type: 'select',
          name: 'type',
          message: 'Please pick a type',
          choices: ['sftp', 'ftp']
        },
        {
          type: 'input',
          name: 'host',
          message: 'Please enter host'
        },
        {
          type: 'input',
          name: 'port',
          message: 'Please enter port'
        },
        {
          type: 'input',
          name: 'user',
          message: 'Please enter username'
        },
        {
          type: 'password',
          name: 'password',
          message: 'Please enter password'
        },
        {
          type: 'input',
          name: 'files',
          message:
            'Please enter the file waiting to be uploaded, please separate multiple files with commas'
        },
        {
          type: 'input',
          name: 'destRootPath',
          message: 'Please enter destPath in remote'
        },
        {
          type: 'confirm',
          name: 'retry',
          message: 'Retry when connection fails'
        },
        {
          type: 'input',
          name: 'retryTimes',
          message:
            'Retry times,only effective when the retry switch is turned on'
        },
        {
          type: 'confirm',
          name: 'parallel',
          message: 'Parallel upload?'
        }
      ]);

      const getUploadOpitons = (response) => ({
        host: response.host,
        user: response.user,
        port: Number(response.port),
        user: response.user,
        password: response.password,
        files: response.files.split(','),
        destRootPath: response.destRootPath,
        parallel: response.parallel,
        retry: response.retry,
        retryTimes: Number(response.retryTimes)
      });

      if (response.type === 'sftp') {
        run({
          sftp: getUploadOpitons(response)
        });
      } else {
        run({
          ftp: getUploadOpitons(response)
        });
      }
    } catch (err) {
      console.error(err.stack);
      process.exit(1);
    }
  });

commander.parse(process.argv);
