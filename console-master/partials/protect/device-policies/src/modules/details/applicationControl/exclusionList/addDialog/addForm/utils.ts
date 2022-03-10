import cond from 'lodash/cond'

// TODO: move to shared location
enum FilePathKey {
  AbsoluteWinPathPattern,
  AbsoluteUncPathPattern,
  AbsoluteNixPathPattern,
  RelativeWinPathPattern,
  RelativeWinPathPatternDell,
  MixedRelativeAndAbsoluteWinPatternPath,
  WinPathWildcardPattern,
  AbsoluteWinPathPatternWithWildcard,
  AbsoluteUncPathPatternWithWildcard,
}
const FILE_PATH_REGEX = {
  // http://regexr.com/3h0rk
  [FilePathKey.AbsoluteWinPathPattern]: /^(?:[a-zA-Z]:[\\/]{1,2})((?:[^/:*?<>""|])(\\{1,2})*)*$/,
  [FilePathKey.AbsoluteUncPathPattern]: /^\\{2}((?:[^\\/:*?<>""|])(\\{1,2})*)*$/,
  [FilePathKey.AbsoluteNixPathPattern]: /^(\/[^]*)+\/?$/,
  [FilePathKey.RelativeWinPathPattern]: /^\\{1,2}((?:[^\\/:*?<>""|])(\\{1,2})*)*$/,
  [FilePathKey.RelativeWinPathPatternDell]: /^\\{1,2}((?:[^\\/:*?<>,[\]~""|])(\\{1,2})*)*$/,
  [FilePathKey.MixedRelativeAndAbsoluteWinPatternPath]: /^(?:[A-Za-z]{1,2}\:|\\|\\|\*{1,2})((?:[^/:?<>""|])(\\{1,2}|\/{1})*)*$/, // eslint-disable-line no-useless-escape
  [FilePathKey.WinPathWildcardPattern]: /^(\*)\\{1,2}((?:[^\\:?<>""|])(\\{1,2})*)+$/,
  [FilePathKey.AbsoluteWinPathPatternWithWildcard]: /^(?:[a-zA-Z]:[\\/]{1,2})((?:[^/:?<>""|])(\\{1,2})*)*$/,
  [FilePathKey.AbsoluteUncPathPatternWithWildcard]: /^\\{2}((?:[^\\/:?<>""|])(\\{1,2})*)*$/,
}

const isFilePathValid = (path, regexKeys) =>
  regexKeys.reduce((isValid, regexKey) => isValid || FILE_PATH_REGEX[regexKey].test(path), false)

const validate = (list: Array<string>) => (value: string): string | null =>
  cond([
    [
      // required
      () => !value,
      () => 'folderPathIsRequired',
    ],
    [
      // valid path
      () => !isFilePathValid(value, [FilePathKey.AbsoluteNixPathPattern, FilePathKey.RelativeWinPathPattern]),
      () => 'invalidFolderPath',
    ],
    [
      // unqiue
      () => list.indexOf(value) >= 0,
      () => 'folderPathAlreadyExistsInList',
    ],
    [() => true, () => null],
  ])(undefined)

export { validate }
