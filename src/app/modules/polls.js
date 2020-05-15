import {cassInsertDB, cassSelectDB} from '../db/dbConsult'
import {generateUrl} from '../helpers/string'

export const addRegister = (respuestas, idEstimulo, idUsuario, type, filtros) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userObj = await cassSelectDB('select * from dlrfeed.register where estimulo_id = ? and user_id = ?', [idEstimulo, idUsuario])
      if (userObj.length === 0) {
        console.log(filtros)
        await cassInsertDB('INSERT INTO dlrfeed.register (estimulo_id, user_id, answers, tipo, filtros) VALUES (?,?, ?, ?, ?)', [idEstimulo, idUsuario, respuestas, type, filtros])
        resolve()
        return
      }
      resolve(userObj[0].tipo)
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}
export const pollGraph = (idEstimulo, filtros) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log(Object.keys(filtros).length)
      if (Object.keys(filtros).length === 0) {
        const types = await cassSelectDB('select * from dlrfeed.poll where estimulo_id = ?;', [idEstimulo])
        const allRegister = await cassSelectDB('SELECT * FROM  dlrfeed.register WHERE  estimulo_id = ? ;', [idEstimulo])
        const totaType = Object.keys(JSON.parse(types[0].tipos)).map(e => {
          const obj = {
            'name': 'tipo' + e,
            'value': allRegister.filter(ur => ur.tipo === 'tipo' + e).map(urf => urf).length
          }
          return obj
        })
        resolve(totaType)
      } else {
        const types = await cassSelectDB('select * from dlrfeed.poll where estimulo_id = ?;', [idEstimulo])
        const allRegister = await cassSelectDB('SELECT * FROM  dlrfeed.register WHERE  estimulo_id = ? ;', [idEstimulo])
        const totaType = Object.keys(JSON.parse(types[0].tipos)).map(e => {
          const obj = {
            'name': 'tipo' + e,
            'value': allRegister.filter(ur => { return (ur.tipo === 'tipo' + e && JSON.stringify(ur.filtros) === JSON.stringify(filtros)) })
              .map(urf => urf).length
          }
          return obj
        })
        resolve(totaType)
      }
    } catch (error) {
      reject(error)
    }
  })
}

export const pollsConfig = idestimulo => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = `SELECT * FROM  dlrfeed.poll where estimulo_id = ?`
      // console.log(types)
      const configuration = await cassSelectDB(query, [idestimulo])
      console.log(configuration)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export const addEstiulo = ({name, style, title, description, image, preguntas, respuestas, filtros, url}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const idEstimulo = generateUrl(title)
      const pollObj = await cassSelectDB('select * from dlrfeed.poll where estimulo_id = ?', [idEstimulo])
      if (pollObj.length === 0) {
        const questions = JSON.stringify(preguntas)
        const tipos = JSON.stringify(respuestas)
        await cassInsertDB('INSERT INTO dlrfeed.poll (estimulo_id, name, answers, tipos, type_poll,title,description) VALUES (?,?,?,?,?,?,?)', [idEstimulo, name, questions, tipos, style, title, description])
        resolve(true)
        return
      }
      resolve(false)
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}

/* guarda en una tabla la información del quizz */
export const addQuizz = (cuestionario, preguntas, respuestas) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {slug, description, style, logo, title} = cuestionario
      const query = 'INSERT INTO dlrfeed.poll (estimulo_id , answers, description, logo, tipos, title, type_poll) VALUES (?,?,?,?,?,?,?);'
      await cassInsertDB(query, [slug, JSON.stringify(preguntas), description, logo, JSON.stringify(respuestas), title, style])
      resolve(true)
    } catch (error) {
      console.log('addQuizz')
      reject(error)
    }
  })
}
