// src/config/uploadConfig.ts
import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION,
});

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME!,
    acl: "public-read", // Define a permissão do arquivo como público para que o URL seja acessível
    contentType: multerS3.AUTO_CONTENT_TYPE, // Define o tipo de conteúdo automaticamente
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniqueSuffix = Date.now().toString();
      const fileName = `${uniqueSuffix}-${file.originalname}`;
      cb(null, fileName); // Define o nome do arquivo
    },
  }),
  fileFilter: (req, file, callback) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Invalid file type."));
    }
  },
});
