import express from 'express'
import { appRouter } from './app/routes/routes'
import bodyParser from 'body-parser'
// import {cassSelectDB} from './app/db/dbConsult'
// const {loquesea} = require('./app')
const app = express()
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, id, projectid, idEstimulo')
  next()
})
app.use(bodyParser.json())

app.get('/', async (req, res) => {
  res.status(200).send('hello world 2')
})

app.listen(8080, () => {
  console.log('common everybody')
  logger.info(`listening in port ${8080}`)
})
app.use(appRouter)

export default app
