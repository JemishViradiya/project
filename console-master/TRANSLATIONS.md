# Translations

The `@ues/i18n` package exports a common i18n interface and modular translation assets.
The translation structure can be found under `./libs/i18n/src/translations`:

    pillarx/
    	{lng}.json
    pillarx/subns/
    	{lng}.json

This structure allows for both common and pillar-specific translation namespace sets.

## Versioning

Translations are stored in un-hashed, so meaningful translation changes must bump the translation version. The version is stored in `libs/assets/src/i18n/translations-version.ts`

## Runtime Namespace Loading

In the browser, `@ues/i18n` will use `i18next-localstorage-backend` and `i18next-http-backend` to load translations dynamically from CloudFront and cache them in localStorge.
The default cache expiration of 1 week can be overridden in the browser with `localStorage.i18n_cache_expiration`.

## Missing Translations

In development mode, missing translations are sent to the developmeent server where they will be added into a corresponding missing translation file for each namespace. For example:

    piillarx/
    	{lng}.missing.json
    pilllarx/subns/
    	{lng}.missing.json

## Language Resolution

### Test Cases

- Header: Resolved browser language
- Rows: Ordered list of browser languages

|   fr-FR   |   de-DE   |   pt-BR   | pt-PT  | de-DE  | pt-PT  | pt-PT  |   de-DE   | pt-PT  | en-US |
| :-------: | :-------: | :-------: | :----: | :----: | :----: | :----: | :-------: | :----: | :---: |
|   fr-CA   |   fr-CA   |   de-AT   | **pt** | **de** | fr-CA  | **pt** |   fr-CA   | fr-CA  | fr-CA |
|   de-AT   |   de-AT   |   fr-CA   | fr-CA  | fr-CA  | **pt** |   de   |   de-AT   | de-AT  | de-AT |
| **fr-FR** | **de-DE** | **pt-BR** | de-AT  | de-AT  | de-AT  |   fr   | **de-DE** | **pt** |       |
|   de-DE   |   fr-FR   |   de-DE   | pt-BR  | pt-BR  | fr-FR  | fr-CA  |   fr-FR   |   de   |       |
|   pt-BR   |   pt-BR   |   fr-FR   | fr-FR  | fr-FR  | de-DE  | de-AT  |   pt-BR   |   fr   |       |
|    fr     |    fr     |    fr     | de-DE  | pt-BR  | pt-BR  | de-DE  |    pt     | de-DE  |       |
|    de     |    de     |    de     |   fr   |   fr   |   fr   | fr-FR  |    de     | fr-FR  |       |
|    pt     |    pt     |    pt     |   de   |   pt   |   de   | en-US  |    fr     | pt-BR  |       |
