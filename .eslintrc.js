module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/essential",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    ecmaVersion: 12,
    parser: "@typescript-eslint/parser",
    sourceType: "module"
  },
  globals: {
    defineProps: "readonly",
    defineEmits: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly"
  },
  plugins: ["vue", "@typescript-eslint"],
  parser: "vue-eslint-parser",
  rules: {
    // "comma-spacing": ["error", { before: false, after: true }],
    // "comma-style": ["error", "last"],
    // "computed-property-spacing": ["error", "never"],
    // "consistent-this": ["error", "that"],
    // "constructor-super": "error",
    // curly: "error",
    // "default-case": "error",
    // "dot-location": ["error", "property"],
    // "dot-notation": "error",
    // "eol-last": ["error", "always"],
    // "for-direction": "warn",
    // "func-call-spacing": ["error", "never"],
    // "func-names": ["warn", "as-needed"],
    // "function-paren-newline": ["error", { minItems: 4 }],
    // "getter-return": ["error", { allowImplicit: true }],
    // "guard-for-in": "warn",
    // "implicit-arrow-linebreak": ["warn", "beside"],
    // "jsx-quotes": ["error", "prefer-single"],
    // "key-spacing": [
    //   "error",
    //   {
    //     beforeColon: false,
    //     align: "colon"
    //   }
    // ],
    // "keyword-spacing": [
    //   "error",
    //   {
    //     before: true,
    //     after: true
    //   }
    // ],
    // "lines-around-comment": ["warn", { beforeBlockComment: true }],
    // "new-cap": "warn",
    // "no-await-in-loop": "error",
    // "no-buffer-constructor": "error",
    // "no-cond-assign": "error",
    // "no-empty": "warn",
    // "no-constant-condition": "warn",

    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

    // 解决 prettier 行尾报错
    "prettier/prettier": ["error", { endOfLine: "auto" }],

    indent: [
      "error",
      2,
      { SwitchCase: 1, ObjectExpression: 1, offsetTernaryExpressions: true }
    ],
    "linebreak-style": [
      "error",
      process.platform === "win32" ? "windows" : "unix"
    ],
    quotes: ["error", "double", {"avoidEscape": true}],
    semi: ["error", "always"],
    camelcase: ["error", { properties: "never" }],
    "object-shorthand": ["error", "always"],
    "array-bracket-spacing": [
      "error",
      "never",
      {
        objectsInArrays: false,
        arraysInArrays: false
      }
    ],
    eqeqeq: ["error", "always"],
    "array-callback-return": "error",
    "arrow-spacing": "error",
    "block-scoped-var": "error",
    "block-spacing": "error",
    "brace-style": ["error", "1tbs", { allowSingleLine: true }],

    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",

    "vue/max-attributes-per-line": "off",
    "vue/require-default-prop": "off",
    "vue/require-explicit-emits": "off",
    "vue/script-setup-uses-vars": "error",
    "vue/no-multiple-template-root": "off",
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
          normal: "always",
          component: "always"
        },
        svg: "always",
        math: "always"
      }
    ]
  }
};
