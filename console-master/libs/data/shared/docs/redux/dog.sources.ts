// import DogModuleFile from '!!file-loader?name=[path][name].[ext].txt!./dog'
import DogActionsFile from '!!file-loader?name=[path][name].[ext].txt!./dog/actions'
import DogDataLayerFile from '!!file-loader?name=[path][name].[ext].txt!./dog/data-layer'
import DogReducerFile from '!!file-loader?name=[path][name].[ext].txt!./dog/reducer'
import DogSelectorsFile from '!!file-loader?name=[path][name].[ext].txt!./dog/selectors'
import DogTypesFile from '!!file-loader?name=[path][name].[ext].txt!./dog/types'

export default [
  // { name: 'index.ts', url: DogModuleFile },
  { name: 'data-layer.ts', url: DogDataLayerFile },
  { name: 'actions.ts', url: DogActionsFile },
  { name: 'selectors.ts', url: DogSelectorsFile },
  { name: 'reducer.ts', url: DogReducerFile },
  { name: 'types.ts', url: DogTypesFile },
]
