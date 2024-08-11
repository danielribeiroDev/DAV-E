import { Router } from 'express';
import fs, { readFile, writeFile } from "fs/promises";
import path from "path";
import { csvLoader } from '../services/AI/loaders.js';

import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';

const currentDir = dirname(fileURLToPath(import.meta.url));

///:: config multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(currentDir, '/uploadedFiles')); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
}); 

///:: multer instance
const upload = multer({
  storage
})

export default function fileRoutes(vectorService) {
  const router = Router();
  
  router.post('/upload', upload.single('file'), async (req, res) => {
    try {
      
      ///:: load langchain document 
      const doc = await csvLoader({path: path.join(currentDir, "uploadedFiles", req.file.originalname)})

      /// :: crete vector store 
      const collectionName = req.body.collectionName

      const database = JSON.parse(await readFile(join(currentDir, "mockdatabase.json")))
      
      ///:: collection does not exist
      await vectorService.createVectorStore({ doc, collectionName })
      database.collections[0].name = collectionName

      ///:: collection already exist
      const vectorStore = await vectorService.getVectorStore(collectionName)
      await vectorStore.addDocuments(doc)

      database.collections[0].filesAttached.append(req.file.originalname)
      await writeFile(join(currentDir, "mockdatabase.json"), JSON.stringify(database))

    } catch (error) {
      console.error('Error fetching tickets', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
