// pd-backend/scripts/removeDuplicateDocuments.js
const { PrismaClient } = require("@prisma/client");
const AWS = require("aws-sdk");
require("dotenv").config();

const prisma = new PrismaClient();

// AWS S3 Config
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const BUCKET = process.env.AWS_BUCKET_NAME;

async function deleteFromS3(filename) {
  try {
    await s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise();
    console.log(`🗑️ S3 deletado: ${filename}`);
  } catch (err) {
    console.error(`Erro ao deletar do S3: ${filename}`, err.message);
  }
}

async function run() {
  const duplicates = await prisma.$queryRaw`
    SELECT 
      "userId", type, month, year, "filename",
      array_agg(id ORDER BY "createdAt" ASC) as ids
    FROM "Document"
    GROUP BY "userId", type, month, year, "filename"
    HAVING COUNT(*) > 1;
  `;

  for (const dup of duplicates) {
    const { ids, filename } = dup;
    const [keepId, ...toDeleteIds] = ids;

    console.log(
      `➡️ Mantendo ID: ${keepId}, removendo duplicados:`,
      toDeleteIds
    );

    for (const id of toDeleteIds) {
      const doc = await prisma.document.findUnique({ where: { id } });

      if (doc) {
        await prisma.document.delete({ where: { id } });
        await deleteFromS3(doc.filename);
      }
    }
  }

  await prisma.$disconnect();
  console.log("✅ Limpeza de documentos duplicados finalizada.");
}

run().catch((err) => {
  console.error("❌ Erro durante a execução:", err);
  prisma.$disconnect();
});
