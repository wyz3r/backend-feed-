import {cassSelectDB} from '../db/dbConsult'

export const createHeaders = (idEstimulo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const styles = {
        headerDark: {
          fill: {
            fgColor: {
              rgb: 'ffffff'
            }
          },
          border: {
            left: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } }
          },
          font: {
            color: {
              rgb: '000505'
            },
            sz: 14,
            bold: true,
            underline: false
          }
        },
        cellPink: {
          fill: {
            fgColor: {
              rgb: 'ffffff'
            }
          }
        },
        cellGreen: {
          fill: {
            fgColor: {
              rgb: 'ffffff'
            }
          }
        }
      }
      const query = 'select * from dlrfeed.poll where estimulo_id = ?'
      const comunityData = await cassSelectDB(query, [idEstimulo])
      const specification = {}
      specification['infromante'] = {
        displayName: 'infromante', //  <- Here you specify the column header
        headerStyle: styles.headerDark, //  <- Header style
        width: 120
      }
      specification['rango'] = {
        displayName: 'rango de edad', //  <- Here you specify the column header
        headerStyle: styles.headerDark, //  <- Header style
        width: 120
      }
      JSON.parse(comunityData[0].answers).forEach((answer, key) => {
        answer.key = 'r' + parseInt(key + 1)
        specification['r' + parseInt(key + 1)] = {
          displayName: answer.pregunta, //  <- Here you specify the column header
          headerStyle: styles.headerDark, //  <- Header style
          width: 120
        }
      })
      resolve(specification)
    } catch (error) {
      console.log('questionComunity')
      console.log(error)
      reject(error)
    }
  })
}

export const createBody = (idEstimulo, tags) => {
  console.log(tags)
  return new Promise(async (resolve, reject) => {
    try {
      const query = 'select * from dlrfeed.register where estimulo_id = ?'
      const comunityData = await cassSelectDB(query, [idEstimulo])
      const data = comunityData.filter(info => {
        return (!Object.keys(tags).length ? true : JSON.stringify(info.filtros) === JSON.stringify(tags))
      }).map((info2) => {
        console.log(JSON.stringify(info2.filtros))
        const infromante = info2.answers
        infromante['infromante'] = info2.user_id
        infromante['rango'] = (JSON.stringify(info2.filtros) === '{"mtxeg":"25"}' ? '25-35' : '36-arriba')
        return infromante
      })
      resolve(data)
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}

// export const createBody = (idEstimulo, tags) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const query = 'select * from dlrfeed.register where estimulo_id = ?'
//       const comunityData = await cassSelectDB(query, [idEstimulo])
//       const data = comunityData.map((info2) => {
//         const infromante = info2.answers
//         infromante['infromante'] = info2.user_id
//         return infromante
//       })
//       resolve(data)
//     } catch (error) {
//       console.log(error)
//       reject(error)
//     }
//   })
// }
