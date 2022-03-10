interface AssetsNode {
  i18next: import('i18next').i18n & { loadI18n: typeof import('../src/i18n').loadI18n }
}

declare const exports: AssetsNode
export = exports
