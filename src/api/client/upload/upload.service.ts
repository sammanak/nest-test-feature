import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { E } from '@common';

import { PresignUrlBody } from './upload.dto';

const aws = require('aws-sdk');

@Injectable()
export class UploadService {
  async presignUrl(body: PresignUrlBody, accountId: number) {
    const env = process.env.NODE_ENV.toUpperCase();
    const s3 = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
      signatureVersion: 'v4'
    });
    const method = 'PUT';
    const uuid = Date.now() + '-' + v4();
    const baseUrl = process.env.AWS_BASE_URL;
    const payload = [];
    let objectKey: string;
    let accessUrl: string;
    body.media.map(item => {
      switch (item.ext) {
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'svg':
          objectKey =
            'LEARN/' + env + '/client/account/' + accountId + '/' + 'image/' + item.type + '/' + item.filename;
          accessUrl = baseUrl + '/' + objectKey;
          break;
        default:
          throw new BadRequestException('Invalid extension');
      }
      const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: objectKey,
        ACL: 'public-read',
        ContentType: E.MimetypeEnum[item.ext],
        Expires: parseInt(process.env.AWS_S3_BUCKET_OBJECT_EXPIRES)
      };
      console.log('Params: ', s3Params);
      const signUrlObject = s3.getSignedUrl('putObject', s3Params);
      console.log(signUrlObject);
      payload.push({
        uploadUrl: signUrlObject,
        uuid: uuid,
        key: objectKey,
        ext: item.ext,
        accessUrl: accessUrl
      });
    });
    return { data: payload };
  }
}
