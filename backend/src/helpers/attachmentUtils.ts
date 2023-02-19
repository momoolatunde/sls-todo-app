import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('attachment-utils')

const s3Bucket = process.env.TODOS_UPLOAD_S3_BUCKET

const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

export class AttachmentUtils{
    constructor(
        private readonly bucketName = s3Bucket
    ){}

    getAttachmentUrl(todoId: string) {

        logger.info('generating attachment url: ', todoId)

        return `http://${this.bucketName}.s3.amazonaws.com/${todoId}`
    }

    getUploadUrl(todoId: string){
        
        logger.info('generating upload url: ', todoId)

        return s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: 300
        })
    }
}