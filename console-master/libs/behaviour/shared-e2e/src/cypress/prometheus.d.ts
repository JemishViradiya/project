export interface MochaTest extends Mocha.Test {
  parent: Mocha.Suite
  opts?: Record<string, any>
}
