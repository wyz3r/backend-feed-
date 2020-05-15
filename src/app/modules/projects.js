import {cassInsertDB, cassSelectDB} from '../db/dbConsult'
import {timeidToDate} from '../helpers/timeidToDate'

import {types} from 'cassandra-driver'

export const createProject = (userInfo, projectPayload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const projectid = types.TimeUuid.now()
      const valuesprojects = []
      valuesprojects.push(projectid)
      valuesprojects.push(projectPayload.name)
      // valuesprojects.push(projectPayload.description)
      // valuesprojects.push(JSON.stringify(projectPayload.brand))
      // valuesprojects.push(JSON.stringify(projectPayload.currentCategory))
      const queryprojects = 'INSERT INTO dlrfeed.projects (project_id, project_name ) VALUES (?,?);'
      await cassInsertDB(queryprojects, valuesprojects)
      const queryuserProjects = 'INSERT INTO dlrfeed.user_projects (user_id , project_id ) VALUES ( ?,?) '
      await cassInsertDB(queryuserProjects, [userInfo.uid, projectid])

      resolve()
    } catch (error) {
      console.log('createProject')
      reject(error)
    }
  })
}

export const getProjects = (userInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const queryUserProjects = 'SELECT * FROM dlrfeed.user_projects  WHERE user_id = ?;'
      const UserProjectsvalues = []
      UserProjectsvalues.push(userInfo.uid)
      const projectsKeys = await cassSelectDB(queryUserProjects, UserProjectsvalues)
      const queryProjects = 'SELECT * FROM dlrfeed.projects;'
      const allProjects = await cassSelectDB(queryProjects)
      // const queryEstimulos = 'SELECT * FROM dlrfeed.project_to_estimulo;'
      // const estimulos = await cassSelectDB(queryEstimulos)
      const obj = {}
      projectsKeys.forEach((e, k) => {
        const date = timeidToDate(e.project_id.toString())
        allProjects.forEach((e2, k2) => {
          if (e.project_id.toString() === e2.project_id.toString()) {
            obj[e.project_id.toString()] = {
              id: e.project_id.toString(),
              name: e2.project_name,
              date
              // config: e2.config,
              // desc: e2.description,
              // brand: e2.marcas !== null ? JSON.parse(e2.marcas) : [],
              // category: e2.categoria !== null ? JSON.parse(e2.categoria) : [],
              // numStim: estimulos.filter(stm => {
              //   return (stm.project_id.toString() === e.project_id.toString())
              // }).map(e => e).length
            }
          }
        })
      })
      resolve(obj)
    } catch (error) {
      console.log('getProjects', error)
      reject(error)
    }
  })
}

export const oneProject = (projectid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = 'SELECT * FROM dlrfeed.projects where project_id = ? ;'
      const project = await cassSelectDB(query, [projectid])
      resolve(project[0])
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}

export const getIdsStimulus = (projectid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = 'SELECT * FROM dlrfeed.project_stimulus where project_id = ? ;'
      const projectsStimulus = await cassSelectDB(query, [projectid])
      const idStimulus = projectsStimulus.map((rowProject) => rowProject.estimulo_id)
      resolve(idStimulus)
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}

export const getInfoStimulus = (idsStimulus) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = 'SELECT * FROM dlrfeed.poll'
      const allStimulus = await cassSelectDB(query, [])
      const projectStimulus = {}
      const filterStimulus = allStimulus.filter((stimulus) => {
        return idsStimulus.includes(stimulus.estimulo_id)
      }).map(stim => stim)

      filterStimulus.forEach(element => {
        projectStimulus[element.estimulo_id] = {
          name: element.estimulo_id,
          image: element.logo
          // filtros: 4
        }
      })
      resolve(projectStimulus)
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}

export const addProjecttoStimulus = (projectid, cuestionario) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = 'INSERT INTO dlrfeed.project_stimulus (project_id , estimulo_id ) VALUES ( ? ,?)'
      await cassInsertDB(query, [projectid, cuestionario.slug])
      resolve()
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}
