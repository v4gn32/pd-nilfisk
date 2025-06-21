const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadToS3(fileBuffer, fileName, mimeType) {
  const fileKey = `${uuidv4()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  await s3.send(command);

  return fileKey;
}

module.exports = {
  uploadToS3,
};
