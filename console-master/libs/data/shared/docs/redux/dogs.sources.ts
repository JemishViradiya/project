// import DogsModuleFile from '!!file-loader?name=[path][name].[ext].txt!./dogs'
import DogsActionsFile from '!!file-loader?name=[path][name].[ext].txt!./dogs/actions'
import DogsDataLayerFile from '!!file-loader?name=[path][name].[ext].txt!./dogs/data-layer'
import DogsReducerFile from '!!file-loader?name=[path][name].[ext].txt!./dogs/reducer'
import DogsSelectorsFile from '!!file-loader?name=[path][name].[ext].txt!./dogs/selectors'
import DogsTypesFile from '!!file-loader?name=[path][name].[ext].txt!./dogs/types'

export default [
  // { name: 'index.ts', url: DogsModuleFile },
  { name: 'data-layer.ts', url: DogsDataLayerFile },
  { name: 'actions.ts', url: DogsActionsFile },
  { name: 'selectors.ts', url: DogsSelectorsFile },
  { name: 'reducer.ts', url: DogsReducerFile },
  { name: 'types.ts', url: DogsTypesFile },
]
