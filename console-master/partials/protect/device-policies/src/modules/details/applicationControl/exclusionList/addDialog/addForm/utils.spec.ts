import { validate } from './utils'

describe('Application Control - Exclusion List - Add Form Validation', () => {
  it('requires a path', () => {
    expect(validate([])(null)).toEqual('folderPathIsRequired')
    expect(validate([])(undefined)).toEqual('folderPathIsRequired')
  })

  it('validates the path format', () => {
    expect(validate([])('blah')).toEqual('invalidFolderPath')
    expect(validate([])('blah/blah')).toEqual('invalidFolderPath')
  })

  it('validates path uniquness', () => {
    expect(validate(['/test'])('/test')).toEqual('folderPathAlreadyExistsInList')
    expect(validate(['/test1', '/test2', '/test3'])('/test2')).toEqual('folderPathAlreadyExistsInList')
  })

  it('allows valid path values', () => {
    expect(validate([])('/test')).toEqual(null)
    expect(validate(['/test1', '/test2', '/test3'])('/test4')).toEqual(null)
  })
})
