const path = require('path')
const { publishPacts } = require('@pact-foundation/pact-node')
const glob = require('glob')

const CONSUMER_TAG_ARG_NAME = '--consumerTag'
const BROKER_URL_ARG_NAME = '--brokerUrl'
const CONSUMER_VERSION_ARG_NAME = '--consumerVersion'

const REQUIRED_ARGS = [CONSUMER_TAG_ARG_NAME, BROKER_URL_ARG_NAME, CONSUMER_VERSION_ARG_NAME]

const publishPact = async () => {
  if (!process.env.SSL_CERT_FILE) {
    process.env.SSL_CERT_FILE = path.resolve(process.cwd(), '.yarn-registry.crt')
  }

  const pactArgs = process.argv.slice(2).reduce((accumulator, argument) => {
    const [name, value] = argument.split('=')

    return {
      ...accumulator,
      [name]: value,
    }
  }, {})

  const validatePactArgs = () => REQUIRED_ARGS.some(requiredArgName => !pactArgs[requiredArgName])

  if (validatePactArgs()) {
    return console.log(`You need to provide a required arguments: ${REQUIRED_ARGS.join(' ,')}`)
  }

  const found = glob.sync('./test-results/**/pact/pacts')

  const pactOptions = {
    pactFilesOrDirs: found,
    pactBroker: pactArgs[BROKER_URL_ARG_NAME],
    tags: pactArgs[CONSUMER_TAG_ARG_NAME],
    consumerVersion: pactArgs[CONSUMER_VERSION_ARG_NAME],
  }

  try {
    console.log(
      `Publishing contract to ${pactOptions.pactBroker} for ${pactOptions.tags} with version ${pactOptions.consumerVersion}`,
    )
    await publishPacts(pactOptions)
    console.log('Pact contract publishing completed')
  } catch (error) {
    console.log('Pact publishing failed: ', error)
  }
}

publishPact()
