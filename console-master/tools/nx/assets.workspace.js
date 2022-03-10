const assetBuilder = project => {
  const outputPath = project === 'api' ? 'dist/uc/api' : `dist/uc/cdn/${project}`
  const outputPathProd = project === 'api' ? 'prod/api' : `prod/${project}`
  return {
    build: {
      executor: '@nrwl/workspace:run-commands',
      options: {
        outputPath,
        output: outputPath,
        commands: [
          {
            command: 'set -x; rm -rf {args.output}; mkdir -p {args.output} && cp -r {args.assets} {args.output}/',
          },
        ],
      },
      configurations: {
        production: {
          outputPath: outputPathProd,
          output: outputPathProd,
        },
      },
    },
    deploy: {
      executor: '@nrwl/workspace:run-commands',
      options: {
        command: `sh tools/deploy/${project === 'api' ? 'api' : 'lib'}.sh ${project.replace(/^api-/, '')}`,
      },
    },
  }
}
assetBuilder.tag = 'scope:assets'

module.exports = assetBuilder
