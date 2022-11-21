module.exports = {
  hooks: {
    'pre-commit': 'tsc --noEmit && lint-staged',
  },
};
