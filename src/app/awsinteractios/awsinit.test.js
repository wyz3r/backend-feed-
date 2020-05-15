import { saveFile } from './awsinit.js'
import AWS from 'aws-sdk'

jest.mock('aws-sdk', () => {
  const myMockFn = jest
    .fn()
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(400)
  const mockUpdate = jest.fn()
  const mockgetSignedUrl = jest.fn((variable, obj, cb) => {
    cb(myMockFn())
  })

  class MockS3 {
    getSignedUrl (variable, obj, cb) {
      mockgetSignedUrl(variable, obj, cb)
    }
  }
  return {
    mockUpdate,
    mockgetSignedUrl,
    config: {
      update: (...params) => mockUpdate(...params)
    },
    S3: MockS3
  }
})

describe('this is saveFile function AWS', () => {
  it('should respond with object request', async () => {
    expect(AWS.mockUpdate).toHaveBeenCalledWith({
      'accessKeyId': config.AMAZON_ACCESS_KEY,
      'secretAccessKey': config.AMAZON_SECRET
    })
    const result = await saveFile('Eventloop3.jpg', 'image/jpeg')
    expect(AWS.mockgetSignedUrl).toHaveBeenCalledWith(
      'putObject',
      {
        Bucket: config.AMAZON_BUCKET,
        Key: 'Eventloop3.jpg',
        Expires: 600,
        ContentType: 'image/jpeg', // filetype
        ACL: 'public-read'
      },
      expect.any(Function)
    )
    result.signedRequest = (result.signedRequest === undefined ? 'url para subir todo ' : result.signedRequest)
    expect(result).toEqual({signedRequest: expect.any(String), url: expect.any(String)})
  })

  it('should respond with error request', async () => {
    try {
      await saveFile('Eventloop3.jpg', 'image/jpeg')
      expect(AWS.mockgetSignedUrl).toHaveBeenCalledWith()
    } catch (error) {
      expect(AWS.mockgetSignedUrl).not.toHaveBeenCalledWith()
      expect(error).toBe(400)
    }
  })
})
