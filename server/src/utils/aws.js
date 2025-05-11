import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { asyncHandler } from "./asyncHandler.js";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadFile = asyncHandler(async (file) => {
  const fileType = file.type;
  const timestamp = Date.now();
  const fileName = file.name.replace(/\s+/g, "_");
  let key;
  if (fileType === "image/jpeg" || fileType === "image/png") {
    key = `images/${timestamp}_${fileName}`;
  } else if (fileType === "video/mp4") {
    key = `videos/${timestamp}_${fileName}`;
  } else if (fileType === "audio/mpeg") {
    key = `audios/${timestamp}_${fileName}`;
  } else if (fileType === "application/pdf") {
    key = `documents/${timestamp}_${fileName}`;
  } else {
    key = `others/${timestamp}_${fileName}`;
  }
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file.data,
    ContentType: fileType,
  });
  const response = await s3Client.send(command);
  if (response.$metadata.httpStatusCode === 200) {
    return key;
  }
});
