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
    directory: `../${schema.scope}s`,
    buildable: false,
    component: false,
    globalCss: false,
    importPath: `@ues-${schema.group}/${schema.name}`,
    linter: 'eslint',
    style: 'none',
    tags: `scope:${schema.scope},scope:${schema.group}`,
    unitTestRunner: 'none',
  })
}

function addCypress(schema: Schema) {
  return srcJson => {
    const key = `..-${schema.scope}s-${schema.group}-${schema.name}`
    const project = srcJson.projects[key]
    delete srcJson.projects[key]
    const fullName = `${schema.group}/${schema.name}`
    srcJson.projects[fullName] = project
    project.type = 'integration'
    project.implicitDependencies = (project.implicitDependencies || []).concat(
      Object.keys(srcJson.projects).filter(n => n.startsWith(`${schema.group}/`) && n !== fullName),
    )
    Object.assign(project.architect, {
      integration: {
        executor: './tools/executors/codeceptjs:run',
        options: {
          headless: false,
        },
        configurations: {
          ci: {
            headless: true,
          },
        },
        outputs: [`codeceptjs-results/${schema.scope}s/${fullName}`],
      },
    })
    return srcJson
  }
}

function generateFiles(schema: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const fullName = `${schema.group}/${schema.name}`
    context.logger.info(`adding ${schema.scope} scaffolding to library: ${fullName}`)

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
    tree.delete(`${cfg.root}/src/index.ts`)
    return mergeWith(templateSource, MergeStrategy.Overwrite)(tree, context)
  }
}

export default function (schema: Schema): Rule {
  schema.name = (schema.name || 'integration').toLowerCase()
  schema.group = schema.group.toLowerCase()
  schema.scope = (schema.scope || 'partial').toLowerCase()
  return chain([generateLibrary(schema), updateWorkspaceInTree(addCypress(schema)), generateFiles(schema)])
}
