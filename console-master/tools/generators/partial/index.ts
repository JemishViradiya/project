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
    name: `${schema.group}/${schema.name}`,
    directory: `../partials`,
    buildable: false,
    component: false,
    globalCss: false,
    importPath: `@ues-${schema.group}/${schema.name}`,
    linter: 'eslint',
    style: 'none',
    tags: `scope:partial,scope:${schema.group}`,
    unitTestRunner: 'jest',
  })
}

function renameKey(schema: Schema) {
  return srcJson => {
    const key = `..-partials-${schema.group}-${schema.name}`
    const project = srcJson.projects[key]
    delete srcJson.projects[key]
    srcJson.projects[`${schema.group}/${schema.name}`] = project
    return srcJson
  }
}

function updateWorkspaceJson(schema: Schema) {
  const rename = renameKey(schema)
  return srcJson => {
    srcJson = rename(srcJson)
    Object.assign(srcJson.projects[`${schema.group}/${schema.name}`].architect, {
      serve: {
        executor: './tools/executors/partial-dev-server:serve',
      },
    })
    return srcJson
  }
}

function generateFiles(schema: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const fullName = `${schema.group}/${schema.name}`
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
    return mergeWith(templateSource, MergeStrategy.Overwrite)(tree, context)
  }
}

export default function (schema: Schema): Rule {
  schema.name = schema.name.toLowerCase()
  schema.group = schema.group.toLowerCase()
  return chain([generateLibrary(schema), updateWorkspaceInTree(updateWorkspaceJson(schema)), generateFiles(schema)])
}
