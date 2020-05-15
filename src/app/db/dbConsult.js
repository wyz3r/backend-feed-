import {client} from './cassClient'

export const cassSelectDB = (query, values) => {
  return new Promise((resolve, reject) => {
    client.execute(query, values, (err, result) => {
      if (!err) {
        if (result.rows.length !== 0) {
          // console.log(result.rows)
          resolve(result.rows)
          // const resulta = result.rows
        } else {
          resolve([])
        }
      } else {
        console.log(err)
        reject(err)
      }
    })
  })
}

export const cassInsertDB = (query, values) => {
  return new Promise((resolve, reject) => {
    client.execute(query, values, { prepare: true }, (err, result) => {
      if (!err) {
        console.log('add row')
        resolve()
      } else {
        console.log('cassInsertDB')
        reject(err)
      }
    })
  })
}
