import 'server-only'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

function getR2Config() {
    const accountId = process.env.R2_ACCOUNT_ID
    const accessKeyId = process.env.R2_ACCESS_KEY_ID
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
    const bucket = process.env.R2_BUCKET
    if (!accountId || !accessKeyId || !secretAccessKey || !bucket) throw new Error('R2 is not configured.')
    return { accountId, accessKeyId, secretAccessKey, bucket }
}

// Issues a short-lived direct-upload URL for an owner-authorized media upload.
export async function createUploadUrl(key: string, contentType: string) {
    const config = getR2Config()
    const client = new S3Client({
        region: 'auto',
        endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
    })
    const command = new PutObjectCommand({ Bucket: config.bucket, Key: key, ContentType: contentType })
    return getSignedUrl(client, command, { expiresIn: 60, signableHeaders: new Set(['content-type']) })
}

// Removes an R2 object only after the calling route has enforced owner authorization.
export async function deleteObject(key: string) {
    const config = getR2Config()
    const client = new S3Client({
        region: 'auto',
        endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
    })
    await client.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }))
}
