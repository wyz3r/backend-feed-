import { Router } from 'express'

import {createHeaders, createBody} from '../modules/report'
import {addRegister, pollGraph, pollsConfig, addQuizz} from '../modules/polls'
import {createProject, getProjects, getIdsStimulus, getInfoStimulus, addProjecttoStimulus} from '../modules/projects'
import { cassSelectDB } from '../db/dbConsult'
import {saveFile, listBuckets, UploadJson} from '../awsinteractios/awsinit'

import reportExcel from 'node-excel-export'
import {parseUser} from '../helpers/firebase'
// import {parseUser} from '../helpers/firebase'

export const appRouter = Router()

appRouter.post('/addMultimedia', async (req, res) => {
  const { filetype, name, folder } = req.body
  console.log(name)
  if (!filetype || !name) {
    res.status(400).end()
    return
  }
  let urlMedia = ''
  if(folder) {
    urlMedia = `${folder}/multimedia/${name}`
  }
  else {
    urlMedia = `multimedia/${name}`
  }
  const url = await saveFile(urlMedia, filetype)
  res.json(url)
})

appRouter.post('/uploadfIle', async (req, res) => {
  const {cuestionario, preguntas, respuestas} = req.body
  cuestionario['preguntas'] = preguntas
  cuestionario['respuestas'] = respuestas
  try {
    await UploadJson(cuestionario.slug, cuestionario)
    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(400)
  }
})

appRouter.get('/listadebuckets', async (req, res) => {
  console.log('name')
  const data = await listBuckets()
  // res.status(200).end()
  res.json(data)
})
// appRouter.post('/addErojects', async (req, res) => {
//   try {
//     const {id, projectPayload} = req.body
//     const userInfo = await parseUser(id)
//     console.log(userInfo)
//     const estimulos = await addEstiulo(projectPayload)
//     if (estimulos) {
//       res.send(projectPayload)
//       return
//     }
//     res.send('duplicado')
//   } catch (error) {
//     console.log({error})
//     if (error.code === 'auth/argument-error') {
//       res.sendStatus(401)
//       return
//     }
//     res.sendStatus(400)
//   }
// })

// comienza a hacer el backend para que funcione correctamente el agregar proyectos
appRouter.post('/addProjects', async (req, res) => {
  try {
    const {id, projectPayload} = req.body
    const userInfo = await parseUser(id)
    await createProject(userInfo, projectPayload)
    res.sendStatus(200)
  } catch (error) {
    if (error.code === 'auth/argument-error') {
      res.sendStatus(401)
      return
    }
    console.log(error)
  }
})

appRouter.get('/getProjects', async (req, res) => {
  try {
    const {id} = req.headers
    const userInfo = await parseUser(id)
    const projects = await getProjects(userInfo)
    // await getallUsers()
    res.json(projects)
  } catch (error) {
    if (error.code === 'auth/argument-error') {
      res.sendStatus(401)
      return
    }
    console.log(error)
  }
})

appRouter.get('/getstimulus', async (req, res) => {
  try {
    const {projectid} = req.headers
    const idsStimulus = await getIdsStimulus(projectid)
    const stimulsObject = await getInfoStimulus(idsStimulus)
    console.log(stimulsObject)
    res.json(stimulsObject)
  } catch (error) {
    if (error.code === 'auth/argument-error') {
      res.sendStatus(401)
      return
    }
    console.log(error)
  }
})



// edicion de proyecto
// appRouter.get('/getinfoproject', async (req, res) => {
//   try {
//     console.log('getinfoproject')
//     const {projectid} = req.headers
//     const obj = {}
//     const {project_name} = await oneProject(projectid)
//     obj['project'] = {name: project_name}
//     console.log(obj)
//     // const projects = await getProjects(userInfo)
//     res.json(obj)
//   } catch (error) {
//     if (error.code === 'auth/argument-error') {
//       res.sendStatus(401)
//       return
//     }
//     console.log(error)
//   }
// })

appRouter.post('/addInfo', async (req, res) => {
  const { respuestas, type, idEstimulo, idUsuario, filtros } = req.body
  try {
    const tipo = await addRegister(respuestas, idEstimulo, idUsuario, type, filtros)
    const result = {}
    result['resultData'] = await pollGraph(idEstimulo, filtros)
    result['tipo'] = tipo
    res.json(result)
  } catch (error) {
    console.log(error)
    res.sendStatus(400)
  }
})

appRouter.get('/get-poll', async (req, res) => {
  const { idestimulo } = req.headers
  console.log(idestimulo)
  try {
    await pollsConfig(idestimulo)
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.sendStatus(400)
  }
})

appRouter.post('/', (req, res) => {
  res.sendStatus(200)
})

// appRouter.post('/addcomunity', async (req, res) => {
//   // console.log(req.params.idComunity)
//   await addEstiulo()
//   console.log('hello')
//   // res.send("tagId is set to " + req.params.idComunity)
//   res.sendStatus(200)
// })

// cambiar esta url para que los parametros se manden por header
appRouter.get('/excel/:idEstimulo', async (req, res) => {
  const {idEstimulo} = req.params
  try {
    const specification = await createHeaders(idEstimulo)
    const bodyExcel = await createBody(idEstimulo, req.query)
    // res.send('tagId is set to ' + idEstimulo + req.query)
    const report = reportExcel.buildExport(
      [ //  <- Notice that this is an array. Pass multiple sheets to create multi sheet report
        {
          name: 'Report', //  <- Specify sheet name (optional)
          // heading: heading, //  <- Raw heading array (optional)
          // merges: merges, //  <- Merge cell ranges
          specification: specification, //  <- Report specification
          data: bodyExcel
        }
      ]
    )
    const nameExcell = Object.keys(req.query).length ? req.query.mtxeg : 'todos'
    res.attachment(`${idEstimulo}${nameExcell}.xlsx`)
    return res.send(report)
  } catch (error) {
    console.log('/excel/:idEstimulo')
    console.log(error)
    res.send(400)
  }
  // res.sendStatus(200)
})

appRouter.get('/result', async (req, res) => {
  // const { respuestas , email, name, type } = req.body
  const preguntas = {
    'r1': {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0
    },
    'r2': {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0
    },
    'r3': {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0
    },
    'r4': {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0
    },
    'r5': {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0
    }
  }

  try {
    const objectData = await cassSelectDB('select * from dlrfeed.register;')
    const data = objectData.map((user, key) => {
      return (user.answers)
    })
    const obj = {}
    Object.keys(preguntas).forEach((questionKey, ki) => {
      obj[questionKey] = []
      data.forEach((userAnswer) => {
        preguntas[questionKey][userAnswer[questionKey]] = parseInt(preguntas[questionKey][userAnswer[questionKey]] + 1)
      })
      Object.keys(preguntas[questionKey]).forEach(answer => {
        console.log(answer)
        const objeto = {
          name: answer,
          value: preguntas[questionKey][answer]
        }
        obj[questionKey].push(objeto)
      })
    })
    res.json(obj)
  } catch (error) {
    console.log(error)
    res.sendStatus(400)
  }
})

appRouter.post('/createpoll', async (req, res) => {
  // console.log(req.params.idComunity)
  const {payload} = req.body
  console.log('hello')
  console.log(payload)
  // res.send("tagId is set to " + req.params.idComunity)
  res.sendStatus(200)
})

/* endpoint para guardar información del quizz */
appRouter.post('/addQuizz', async (req, res) => {
  try {
    const {cuestionario, preguntas, respuestas, projectid} = req.body
    console.log(projectid)
    await addProjecttoStimulus(projectid, cuestionario)
    const quizz = await addQuizz(cuestionario, preguntas, respuestas)
    if (quizz) {
      res.send(cuestionario)
      return
    }
    res.send('duplicado')
    res.sendStatus(200)
  } catch (error) {
    console.log('addquizz', error)
  }
})

appRouter.get('/getExcel', async (req, res) => {
  try {
    const {id} = req.headers
    const specification = await createHeaders(id)
    const bodyExcel = await createBody(id)
    const report = reportExcel.buildExport(
      [ //  <- Notice that this is an array. Pass multiple sheets to create multi sheet report
        {
          name: 'Report', //  <- Specify sheet name (optional)
          specification: specification, //  <- Report specification
          data: bodyExcel
        }
      ]
    )
    res.attachment(`${id}.xlsx`)
    return res.send(report)
  } catch (error) {
    console.log('/getExcel', error)
  }
})
