"use server";

import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "../auth";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from 'crypto'

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const bucketName = process.env.AWS_S3_BUCKET_NAME!;

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

export async function getSignedURL(fileType: string, checkSum: string) {
  try {
    const session = await auth();
    if (!session?.user || !session.user.id) {
      return { error: "User is not authenticated" };
    }

    const pubObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: generateFileName(),
      ContentType: fileType,
      ChecksumSHA256: checkSum
    });

    const signedUrl = await getSignedUrl(s3, pubObjectCommand, {
      expiresIn: 60,
    });

    return { success: { url: signedUrl } };
  } catch {
    throw new Error("Failed to generete Signed URL");
  }
}
