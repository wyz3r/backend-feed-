import cassandralib from 'cassandra-driver'
const { config } = global
let client = {}
console.log(config.NODE_ENV)
if (config.NODE_ENV === 'dev' || config.NODE_ENV === 'test') {
  client = new cassandralib.Client({ contactPoints: ['127.0.0.1'], keyspace: 'dlrfeed' })
  exports.client = client
} else if (config.NODE_ENV === 'prod') {
  const cassandraconfig = { maxPrepared: 5000,
    contactPoints: [ '192.168.15.9',
      '192.168.15.10',
      '192.168.15.11',
      '192.168.15.12',
      '192.168.15.13',
      '192.168.15.14' ],
    username: 'sduser',
    password: 'Ig3Vjb3YhKSW',
    queryOptions: { consistency: 6 } }

  cassandraconfig.authProvider = new cassandralib.auth.PlainTextAuthProvider(cassandraconfig.username, cassandraconfig.password)
  client = new cassandralib.Client(cassandraconfig)
}
exports.client = client
