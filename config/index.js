require('dotenv').config()

const config = {}
config.NODE_ENV = {production: 'prod', development: 'dev'}[process.env.NODE_ENV] || 'test'
config.NAME = `[${config.NODE_ENV}]${process.env.APP_NAME}`
config.PORT = ((env) => env === 'dev' ? 8080 : (env === 'prod' ? 80 : 5001))(config.NODE_ENV)
config.AMAZON_ACCESS_KEY = process.env.AMAZON_ACCESS_KEY
config.AMAZON_SECRET = process.env.AMAZON_SECRET
config.AMAZON_REGION = process.env.AMAZON_REGION
config.AMAZON_BUCKET = process.env.AMAZON_BUCKET

global.logger = require('./logger').default(config)

if (config.NODE_ENV === 'test') {
  ['trace', 'debug', 'info', 'warning', 'error'].forEach(method => {
    global.logger[method] = jest.fn()
  })
  config.AMAZON_ACCESS_KEY = 'amazon_access_key_test'
  config.AMAZON_SECRET = 'amazon_secret_test'
  config.AMAZON_REGION = 'amazon_region_test'
  config.AMAZON_BUCKET = 'amazon_bucket_test'
}

config.inject = (key, value) => { config[key] = value }
global.config = config
