module.exports = {
  testPathForConsistencyCheck: 'some/example.spec.ts',

  resolveSnapshotPath: (testPath, snapshotExtension) =>
    testPath.replace('.spec', '') + snapshotExtension,

  resolveTestPath: (snapshotFilePath, snapshotExtension) =>
    snapshotFilePath
      .replace(/\.([tj]sx?)/, '.spec.$1')
      .slice(0, -snapshotExtension.length),
};
