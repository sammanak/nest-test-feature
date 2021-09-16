import { BadRequestException, Injectable } from '@nestjs/common';
import * as ObsClient from 'esdk-obs-nodejs';
import { v4 } from 'uuid';

import { E } from '@common';

import { PresignUrlBody } from './upload.dto';

@Injectable()
export class UploadService {
  async presignUrl(body: PresignUrlBody, accountId: number) {
    const obs = new ObsClient({
      access_key_id: process.env.AWS_ACCESS_KEY,
      secret_access_key: process.env.AWS_SECRET_KEY,
      server: process.env.AWS_SERVER_URL
    });
    const bucketName = process.env.AWS_BUCKET_NAME;
    const env = process.env.NODE_ENV.toUpperCase();
    const method = 'PUT';
    const uuid = Date.now() + '-' + v4();
    const baseUrl = process.env.AWS_BASE_URL;
    const payload = [];
    let signUrlObject;
    let objectKey;
    let accessUrl;
    body.media.map(item => {
      switch (item.ext) {
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'svg':
          objectKey = env + '/client/account/' + accountId + '/' + 'image/' + item.type + '/' + item.filename;
          accessUrl = baseUrl + '/' + objectKey;
          break;
        default:
          throw new BadRequestException('Invalid extension');
      }
      signUrlObject = signUrlObject = obs.createSignedUrlSync({
        Bucket: bucketName,
        Key: objectKey,
        Method: method,
        Expires: 3600,
        Headers: {
          'Content-Type': E.MimetypeEnum[item.ext]
        }
      });
      payload.push({
        uploadUrl: signUrlObject.SignedUrl,
        uuid: uuid,
        key: objectKey,
        ext: item.ext,
        accessUrl: accessUrl
      });
    });
    return { data: payload };
  }
}
