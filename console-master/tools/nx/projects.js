const path = require('path')
const Nx = require('../../nx.json')
const NxWorkspace = require('../../workspace.json')

const args = process.argv.slice(2)

let projects
if (args[0] === '--libs') {
  args.splice(0, 1)
  projects = Object.keys(Nx.projects).filter(name => {
    const project = NxWorkspace.projects[name]
    if (typeof project === 'string') {
      const projectJson = require(path.join('..', '..', project, 'project.json'))
      return projectJson.projectType === 'library'
    } else {
      return project.projectType === 'library'
    }
  })
} else if (args[0] === '--apps') {
  args.splice(0, 1)
  projects = Object.entries(Nx.projects)
    .filter(([name, { tags }]) => tags.indexOf('scope:app') !== -1)
    .map(([name]) => name)
} else {
  if (args[0] === '--all') {
    args.splice(0, 1)
  }
  projects = Object.keys(Nx.projects).filter(name => name.indexOf('-e2e') === -1)
}

console.log(projects.join(','))
