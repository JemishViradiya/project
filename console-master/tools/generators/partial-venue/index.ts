import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics'
import { apply, chain, externalSchematic, MergeStrategy, mergeWith, move, template, url } from '@angular-devkit/schematics'
import { offsetFromRoot } from '@nrwl/devkit'
import { getProjectConfig, updateNxJsonInTree, updateWorkspaceInTree } from '@nrwl/workspace'

import type { Schema } from './schema'

const options = {
  cliCommand: 'yarn',
}

function generateApplication(schema: Schema): Rule {
  return externalSchematic('@nrwl/react', 'application', {
    name: schema.name,
    buildable: false,
    component: false,
    globalCss: false,
    linter: 'eslint',
    style: 'none',
    tags: `scope:app,scope:venue`,
    unitTestRunner: 'none',
    e2eTestRunner: 'none',
  })
}

function updateWorkspaceJson(schema: Schema) {
  return srcJson => {
    const architect = srcJson.projects[schema.name].architect
    Object.assign(architect.build.options, {
      index: 'tools/index.html',
      generateIndexHtml: false,
      baseHref: '..',
      deployUrl: `uc/${schema.name}/`,
      outputPath: `dist/uc/${schema.name}`,
      webpackConfig: 'tools/webpack/partial-venue',
      maxWorkers: 1,
      memoryLimit: 1024,
    })
    Object.assign(architect.build.configurations.production, {
      outputPath: `prod/${schema.name}`,
      maxWorkers: 1,
      memoryLimit: 2048,
    })
    architect.deploy = {
      executor: '@nrwl/workspace:run-commands',
      options: {
        command: `bash tools/deploy/venue-partial.sh ${schema.name}`,
      },
    }

    srcJson.projects.cdn.implicitDependencies.push(schema.name)
    return srcJson
  }
}

function generateFiles(schema: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const fullName = `${schema.name}`
    context.logger.info('adding partial scaffolding to application')

    tree.delete(`apps/${schema.name}/src/app/logo.svg`)
    tree.delete(`apps/${schema.name}/src/app/star.svg`)
    tree.delete(`apps/${schema.name}/src/app/star.svg`)
    tree.delete(`apps/${schema.name}/src/favicon.ico`)
    tree.delete(`apps/${schema.name}/src/index.html`)

    const cfg = getProjectConfig(tree, fullName)
    const templateSource = apply(url('./files'), [
      template({
        ...options,
        ...schema,
        fullName,
        tmpl: '',
        offsetFromRoot: offsetFromRoot(cfg.root),
      }),
      move(cfg.root),
    ])

    return mergeWith(templateSource, MergeStrategy.Overwrite)(tree, context)
  }
}

export default function (schema: Schema): Rule {
  schema.name = schema.name.toLowerCase()
  return chain([generateApplication(schema), updateWorkspaceInTree(updateWorkspaceJson(schema)), generateFiles(schema)])
}
