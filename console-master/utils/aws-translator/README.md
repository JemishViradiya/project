# AWS Translator Utility

Translate ues-console strings with [AWS Translate](https://aws.amazon.com/translate/)

Translations are stored in the [Translations Project](../../libs/translations/README.md)

## Command Line

    $ yarn -s aws:translate --help

    Options:
          --help             Show help                                     [boolean]
          --version          Show version number                           [boolean]
          --mode                [choices: "overwrite", "update"] [default: "update"]
          --dry-run                                       [boolean] [default: false]
      -k, --key-separator                                             [default: "."]
      -l, --language, --lng                                       [array] [required]
      -n, --namespace, --ns                                       [array] [required]

### Useful Options

- **language** specify the list of languages (or 'all') to be translated
- **namespace** specify the list of namespaces (or 'all') to be translated

## Requirements

You must be logged into the AWS cli on your terminal

We are currently using the [bb-entcommonservices-dev "Dev" account](https://wikis.rim.net/display/EntPS/8.1.3+Groups%2C+Roles+and+Policies)

Install dependencies in `utils/aws-translator`

    cd utils/aws-translator
    yarn install

## Examples

To translate the 'navigation' namespace into all languages:

    yarn aws:translate --language all --namespace navigation

<br/><br/>

# RESX/JSON conversion for Venue

Convert resx files to json for translation and translated json files back to resx. Converted files will be output to `libs/translations/external`.

## Prerequisites

- Clone Venue CylanceServer repo [cylanceserver](https://bitbucket.d.cylance.com/projects/VEN/repos/cylanceserver/browse)
- Install dependencies in `utils/aws-translator`

## Examples

To convert resx to json run `node scripts/resxToJson /path/to/VEN/cylanceserver venue|login|provisioning|googleAuth|fidoWPF`

    cd utils/aws-translator

    node scripts/resxToJson ../../../cylance/cylanceserver venue
    node scripts/resxToJson ../../../cylance/cylanceserver login
    node scripts/resxToJson ../../../cylance/auth provisioning
    node scripts/resxToJson ../../../cylance/auth googleAuth
    node scripts/resxToJson ../../../cylance/auth fidoWPF

To convert json to resx run `node scripts/jsonToResx /path/to/json/file/directory venue|login|provisioning|googleAuth|fidoWPF`

    cd utils/aws-translator

    node scripts/jsonToResx ./myJSON venue
    node scripts/jsonToResx ./myJSON login
    node scripts/jsonToResx ./myJSON provisioning
    node scripts/jsonToResx ./myJSON googleAuth
    node scripts/jsonToResx ./myJSON fidoWPF
