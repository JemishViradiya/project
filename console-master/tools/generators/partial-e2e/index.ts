import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics'
import { apply, chain, externalSchematic, MergeStrategy, mergeWith, move, template, url } from '@angular-devkit/schematics'
import { offsetFromRoot } from '@nrwl/devkit'
import { getProjectConfig, updateNxJsonInTree, updateWorkspaceInTree } from '@nrwl/workspace'

import type { Schema } from './schema'

const options = {
  cliCommand: 'yarn',
}

function generateLibrary(schema: Schema): Rule {
  return externalSchematic('@nrwl/react', 'library', {
    name: `${schema.group}/${schema.name}-e2e`,
    directory: `../partials`,
    buildable: false,
    component: false,
    globalCss: false,
    importPath: `@ues-${schema.group}/${schema.name}-e2e`,
    linter: 'eslint',
    style: 'none',
    tags: `scope:partial,scope:${schema.group}`,
    unitTestRunner: 'none',
  })
}

function addCypress(schema: Schema) {
  return srcJson => {
    const project = srcJson.projects[`${schema.group}/${schema.name}-e2e`]
    Object.assign(project.architect, {
      e2e: {
        executor: './tools/executors/cypress:cypress',
        options: {
          cypressConfig: `partials/${schema.group}/${schema.name}-e2e/cypress.json`,
          tsConfig: `partials/${schema.group}/${schema.name}-e2e/tsconfig.json`,
          devServerTarget: `${schema.group}/${schema.name}:serve`,
        },
        configurations: {
          production: {
            devServerTarget: `${schema.group}/${schema.name}:serve:production`,
          },
        },
        outputs: [`cypress-results/partials/${schema.group}/${schema.name}-e2e`],
      },
    })
    return srcJson
  }
}

function renameKeyAndAddDependencies(schema: Schema) {
  return srcJson => {
    const key = `..-partials-${schema.group}-${schema.name}-e2e`
    const project = srcJson.projects[key]
    delete srcJson.projects[key]
    srcJson.projects[`${schema.group}/${schema.name}-e2e`] = project
    project.type = 'e2e'
    project.implicitDependencies = (project.implicitDependencies || []).concat(`${schema.group}/${schema.name}`)
    return srcJson
  }
}

function generateFiles(schema: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const fullName = `${schema.group}/${schema.name}-e2e`
    context.logger.info('adding partial scaffolding to library')

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
    tree.delete(`${cfg.root}/tsconfig.lib.json`)
    return mergeWith(templateSource, MergeStrategy.Overwrite)(tree, context)
  }
}

export default function (schema: Schema): Rule {
  schema.name = schema.name.toLowerCase()
  schema.group = schema.group.toLowerCase()
  return chain([
    generateLibrary(schema),
    updateWorkspaceInTree(renameKeyAndAddDependencies(schema)),
    updateWorkspaceInTree(addCypress(schema)),
    generateFiles(schema),
  ])
}
