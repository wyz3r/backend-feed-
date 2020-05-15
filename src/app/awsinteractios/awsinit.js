import AWS from 'aws-sdk'
import fs from 'fs'
import tmp from 'tmp'

AWS.config.update({ accessKeyId: process.env.AMAZON_ACCESS_KEY, secretAccessKey: process.env.AMAZON_SECRET })
const s3 = new AWS.S3()

export const saveFile = (url, filetype) => {
  
  const s3Params = {
    Bucket: process.env.AMAZON_BUCKET,
    Key: url, // carpeta/nombre_de_archivo
    Expires: 600,
    ContentType: filetype, // filetype
    ACL: 'public-read'
  }
  return new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      const returnData = {
        signedRequest: data,
        url: `https://s3-us-west-2.amazonaws.com/${process.env.AMAZON_BUCKET}/${url}`
      }
      console.log(returnData)
      resolve(returnData)
    })
  })
}

export const listBuckets = () => {
  const s3Params = {
    Bucket: process.env.AMAZON_BUCKET
  }
  return new Promise((resolve, reject) => {
    s3.listObjects(s3Params, (err, data) => {
      if (err) {
        console.log("Error", err);
        reject(err)
      } else {
        // console.log("Success", data.Contents);
       const elementos =  data.Contents.filter(( e => {
          return (e['Size'] === 0 && e['Key'].indexOf('/images') === -1 )
        })).map( b => b.Key)
        resolve(elementos)
      }
    });
  })

}

export const UploadJson = (slugProject, body) => {
  const s3Params = {
    Bucket: process.env.AMAZON_BUCKET,
    Key:`${slugProject}/data.json`, // carpeta/nombre_de_archivo
    ContentType: 'application/json', // filetype
    ACL: 'public-read',
    Body: JSON.stringify(body)
  }

  return new Promise((resolve, reject) => {
    s3.putObject(s3Params, (err,data) => {
      if (err) reject(err)
      resolve()

    })
  })
}
