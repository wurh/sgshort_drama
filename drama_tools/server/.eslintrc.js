{
  "root": true,
  "env": { "node": true, "commonjs": true },
  "parser": "@typescript-eslint/parser",
  "parserOptions": { "sourceType": "module" },
  "plugins": ["@typescript-eslint"],
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-empty-function": "off",
    "no-empty": "off"
  },
  "rootDirs": ["src", "./node_modules/@types"],
  "ignorePatterns": ["dist", "node_modules"]
}
