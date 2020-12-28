module.exports = {
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: './tsconfig.json'
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-typescript/base',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint'
  ],
  root: true,
  env: {
    node: true,
    serviceworker: true,
    jest: true
  },
  rules: {
    // 设置默认eslint规则
    // 要求使用 let 或 const 而不是 var
    'no-var': 1,
    // 要求箭头函数的参数使用圆括号
    'arrow-parens': 0,
    // 禁用行尾空格
    'no-trailing-spaces': 0,
    'no-unused-expressions': 0,
    'global-require': 0,
    'class-methods-use-this': 0,
    'max-len': [
      'error',
      {
        ignoreComments: true,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreTemplateLiterals: true
      }
    ],
    // 禁止声明与外层作用域的变量同名
    'no-shadow': 0,
    // 'generator-star-spacing': 0,
    'no-console': 0,
    'object-curly-spacing': 2,
    'comma-dangle': 0,
    'no-restricted-syntax': 0,
    'no-await-in-loop': 0,
    'no-plusplus': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    // 'no-debugger': 0,
    // "import/extensions": 0,
    'import/prefer-default-export': 0,
    'import/no-dynamic-require': 0,
    // 设置typescript-eslint规则
    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/docs/rules
    // '@typescript-eslint/semi': ['error'],
    // '@typescript-eslint/indent': ['error', 2],
    // '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/consistent-type-definitions': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unused-expressions': 0,
    '@typescript-eslint/no-var-requires': 0
  }
};
