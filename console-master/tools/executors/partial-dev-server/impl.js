Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const webpack = require('webpack')
const devkit_1 = require('@nrwl/devkit')
const rxjs_for_await_1 = require('rxjs-for-await')
const operators_1 = require('rxjs/operators')
const WebpackDevServer = require('webpack-dev-server')
const Workspace = require('@nrwl/tao/src/shared/workspace')
const Params = require('@nrwl/tao/src/shared/params')
const normalize_1 = require('@nrwl/web/src/utils/normalize')
const devserver_config_1 = require('@nrwl/web/src/utils/devserver.config')
const buildable_libs_utils_1 = require('@nrwl/workspace/src/utilities/buildable-libs-utils')
const project_graph_1 = require('@nrwl/workspace/src/core/project-graph')
const run_webpack_1 = require('@nrwl/web/src/utils/run-webpack')

function devServerExecutor(serveOptions, context) {
  return tslib_1.__asyncGenerator(this, arguments, function* devServerExecutor_1() {
    const { root: projectRoot, sourceRoot } = context.workspace.projects[context.projectName]
    const buildOptions = normalize_1.normalizeWebBuildOptions(
      getBuildOptions(serveOptions, context, projectRoot),
      context.root,
      sourceRoot,
    )
    let webpackConfig = devserver_config_1.getDevServerConfig(context.root, projectRoot, sourceRoot, buildOptions, serveOptions)
    if (buildOptions.webpackConfig) {
      webpackConfig = require(buildOptions.webpackConfig)(webpackConfig, {
        buildOptions,
        configuration: serveOptions.buildTarget.split(':')[2],
      })
    }
    if (!buildOptions.buildLibsFromSource) {
      const { target, dependencies } = buildable_libs_utils_1.calculateProjectDependencies(
        project_graph_1.readCachedProjectGraph(),
        context.root,
        context.projectName,
        'build', // should be generalized
        context.configurationName,
      )
      buildOptions.tsConfig = buildable_libs_utils_1.createTmpTsConfig(
        devkit_1.joinPathFragments(context.root, buildOptions.tsConfig),
        context.root,
        target.data.root,
        dependencies,
      )
    }
    return yield tslib_1.__await(
      yield tslib_1.__await(
        yield* tslib_1.__asyncDelegator(
          tslib_1.__asyncValues(
            rxjs_for_await_1.eachValueFrom(
              run_webpack_1.runWebpackDevServer(webpackConfig, webpack, WebpackDevServer).pipe(
                operators_1.tap(({ stats }) => {
                  console.info(stats.toString(webpackConfig.stats))
                }),
                operators_1.map(({ baseUrl, stats }) => {
                  return {
                    baseUrl,
                    emittedFiles: run_webpack_1.getEmittedFiles(stats),
                    success: !stats.hasErrors(),
                  }
                }),
              ),
            ),
          ),
        ),
      ),
    )
  })
}
exports.default = devServerExecutor
function getBuildOptions(options, context, root) {
  if (!options.buildTarget) {
    options.buildTarget = `behaviour/app-shell:partial-dev`
  }
  const target = devkit_1.parseTargetString(options.buildTarget)
  const overrides = {
    watch: false,
  }
  if (options.maxWorkers) {
    overrides.maxWorkers = options.maxWorkers
  }
  if (options.memoryLimit) {
    overrides.memoryLimit = options.memoryLimit
  }
  if (options.baseHref) {
    overrides.baseHref = options.baseHref
  }

  // patched here to fill in our partial pieces
  if (!options.deployUrl) {
    overrides.deployUrl = `uc/${context.projectName.replace(/\//g, '-')}/`
  }
  if (!options.outputPath) {
    overrides.outputPath = `dist/.${root}`
  }
  if (!options.tsConfig) {
    overrides.tsConfig = `${root}/tsconfig.lib.json`
  }

  return devkit_readTargetOptions(target, context, overrides)
}

function devkit_readTargetOptions({ project, target, configuration }, context, overrides) {
  const projectConfiguration = context.workspace.projects[project]
  const targetConfiguration = projectConfiguration.targets[target]
  const ws = new Workspace.Workspaces(context.root)
  const [nodeModule, executorName] = targetConfiguration.executor.split(':')
  const { schema } = ws.readExecutor(nodeModule, executorName)
  const defaultProject = ws.calculateDefaultProjectName(context.cwd, context.workspace)
  return Params.combineOptionsForExecutor(
    overrides,
    configuration !== null && configuration !== void 0 ? configuration : '',
    targetConfiguration,
    schema,
    defaultProject,
    ws.relativeCwd(context.cwd),
  )
}
