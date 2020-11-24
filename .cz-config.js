module.exports = {
  types: [
    { value: 'feat', name: 'feat:     添加新功能' },
    { value: 'fix', name: 'fix:      修复BUG或ISSUE' },
    { value: 'docs', name: 'docs:     文档修改' },
    {
      value: 'style',
      name: 'style:    代码格式调整，如空格、分号、引号等（不影响代码运行的变动）'
    },
    {
      value: 'refactor',
      name: 'refactor: 重构（即不是新增功能，也不是修改bug的代码变动）'
    },
    {
      value: 'css',
      name: 'css:      样式调整'
    },
    {
      value: 'ci',
      name: 'ci:       流水线相关配置'
    },
    {
      value: 'perf',
      name: 'perf:     性能优化'
    },
    { value: 'test', name: 'test:     增加测试' },
    {
      value: 'chore',
      name: 'chore:    构建过程或辅助工具的变动'
    },
    { value: 'revert', name: 'revert:   撤销commit' },
    { value: 'WIP', name: 'WIP:      工作正在进行中' },
    { value: 'update', name: 'update:   其他规则不适用时选择' }
  ],

  scopes: [
    { name: 'accounts' },
    { name: 'admin' },
    { name: 'exampleScope' },
    { name: 'changeMe' }
  ],

  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: 'TICKET-',
  ticketNumberRegExp: '\\d{1,5}',

  // it needs to match the value for field type. Eg.: 'fix'
  /*
  scopeOverrides: {
    fix: [
      {name: 'merge'},
      {name: 'style'},
      {name: 'e2eTest'},
      {name: 'unitTest'}
    ]
  },
  */
  // override the messages, defaults are as follows
  messages: {
    type: "Select the type of change that you're committing:",
    scope: '\nDenote the SCOPE of this change (optional):',
    // used if allowCustomScopes is true
    customScope: 'Denote the SCOPE of this change:',
    subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
    body:
      'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    breaking: 'List any BREAKING CHANGES (optional):\n',
    footer:
      'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?'
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  // skip any questions you want
  skipQuestions: ['body'],

  // limit subject length
  subjectLimit: 100
  // breaklineChar: '|', // It is supported for fields body and footer.
  // footerPrefix : 'ISSUES CLOSED:'
  // askForBreakingChangeFirst : true, // default is false
}
