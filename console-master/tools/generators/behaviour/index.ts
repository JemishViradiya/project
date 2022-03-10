import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics'
import { apply, chain, externalSchematic, MergeStrategy, mergeWith, move, template, url } from '@angular-devkit/schematics'
import { offsetFromRoot } from '@nrwl/devkit'
import { getProjectConfig, updateNxJsonInTree, updateWorkspaceInTree } from '@nrwl/workspace'

import type { Schema } from './schema'

function generateLibrary(schema: Schema): Rule {
  return externalSchematic('@nrwl/react', 'library', {
    name: `behaviour/${schema.name}`,
    directory: `../libs`,
    buildable: false,
    component: false,
    globalCss: false,
    importPath: `@ues-behaviour/${schema.name}`,
    linter: 'eslint',
    style: 'none',
    tags: `scope:behaviour,scope:cdn`,
    unitTestRunner: 'jest',
  })
}

function renameKey(schema: Schema) {
  return srcJson => {
    const key = `..-libs-behaviour-${schema.name}`
    const project = srcJson.projects[key]
    delete srcJson.projects[key]
    srcJson.projects[`behaviour/${schema.name}`] = project
    return srcJson
  }
}

function injectTasks(schema: Schema) {
  const rename = renameKey(schema)
  return srcJson => {
    srcJson = rename(srcJson)

    const configFolder = `libs/behaviour/${schema.name}/.storybook`
    const project = srcJson.projects[`behaviour/${schema.name}`]
    Object.assign(project.architect, {
      storybook: {
        executor: '@nrwl/storybook:storybook',
        options: {
          uiFramework: '@storybook/react',
          port: 4400,
          config: { configFolder },
        },
        configurations: {
          ci: {
            quiet: true,
          },
        },
      },
      'build-storybook': {
        executor: '@nrwl/storybook:build',
        options: {
          uiFramework: '@storybook/react',
          outputPath: `docs/behaviour/${schema.name}`,
          config: { configFolder },
        },
        configurations: {
          ci: { quiet: true },
        },
        outputs: ['{options.outputPath}'],
      },
    })
    return srcJson
  }
}

function generateFiles(schema: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const fullName = `behaviour/${schema.name}`
    context.logger.info('adding behaviour scaffolding to library')

    const cfg = getProjectConfig(tree, fullName)
    const templateSource = apply(url('./files'), [
      template({
        cliCommand: 'yarn',
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
  return chain([generateLibrary(schema), updateWorkspaceInTree(injectTasks(schema)), generateFiles(schema)])
}
