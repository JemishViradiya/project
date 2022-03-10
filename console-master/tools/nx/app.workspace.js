const appBuilder = project => ({
  build: {
    executor: '@nrwl/web:build',
    options: {
      baseHref: '..',
      deployUrl: `uc/${project}/`,
      outputPath: `dist/uc/${project}`,
      index: 'tools/index.html',
      webpackConfig: 'tools/webpack/app',
      maxWorkers: 1,
      memoryLimit: 1024,
    },
    configurations: {
      production: {
        outputPath: `prod/${project}/${project}`,
        optimization: true,
        outputHashing: 'all',
        sourceMap: null,
        extractLicenses: true,
        maxWorkers: 1,
        memoryLimit: 2048,
      },
    },
  },
  serve: {
    executor: '@nrwl/web:dev-server',
    options: {
      hmr: true,
      buildTarget: `${project}:build`,
      ssl: true,
    },
    configurations: {
      production: {
        buildTarget: `${project}:build:production`,
      },
    },
  },
  deploy: {
    executor: '@nrwl/workspace:run-commands',
    options: {
      command: `sh tools/deploy/app.sh ${project}`,
    },
  },
  test: {
    executor: '@nrwl/jest:jest',
    options: {
      jestConfig: `apps/${project}/jest.config.js`,
      passWithNoTests: true,
    },
    outputs: [`test-results/apps/${project}`],
  },
})
appBuilder.tag = 'scope:app'

module.exports = appBuilder
