/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        pkgRoot: 'dist',
      },
    ],
    '@semantic-release/github',
  ],
  branches: ['main', 'next'],
};
