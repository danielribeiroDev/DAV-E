
///:: express
import { Router } from 'express';

///:: file stream
import { readFile,writeFile } from 'fs/promises'

///:: path helper
import path from 'path'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

///:: file middleware handle
import multer from 'multer';

///:: get current diretory path
const currentDir = dirname(fileURLToPath(import.meta.url))

///:: set up file storage directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    req.file = file
    cb(null, join(currentDir, '..', '..', '/storage/files'))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

///:: multer instance
const upload = multer({
  storage
})

///:: set up collection routes
export default function collectionRoutes(vCollectionService, rCollectionService, loader) {
  const router = Router();
  
  router.post('/', async (req, res) => {
    try {
        const collectionName = req.body.collection.name
        const description = req.body.collection.description
        
        ///::create collection in both relational and vector dbs
        const rcollection = await rCollectionService.create({ 
          collectionName,
          description
        }) 

        await vCollectionService.create({ id: rcollection.id}) 

        let payload = {
            collection: {
                name: rcollection.name ,
                id: rcollection.id,
            }
        }

      res.status(201).json(payload);

    } catch (error) {
      console.error('Error POST collection', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const allCollections = await rCollectionService.getAll()
      
      let payload = {
        collections: allCollections
      }

      res.status(200).json(payload)
      
    } catch (error) {
      console.error('Error GET collection', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  })

  ///:: multer to handle uploaded files
  router.post('/files/upload', upload.single('file'),async (req, res) => {
    try {
      const rfile = await rCollectionService.addFile({
        collectionId: req.body.collectionId,
        description: req.body.description,
        name: req.file.originalname
      })
      let doc
      switch (req.file.mimetype) {
        case 'text/csv':
          doc = await loader.csv({ path: join(req.file.destination, req.file.originalname) })
          await vCollectionService.addFile({ doc, collectionId: rfile.collectionId })
          break;
        
        case 'application/pdf':
          doc = await loader.pdf({ path: join(req.file.destination, req.file.originalname) })
          await vCollectionService.addFile({ doc, collectionId: rfile.collectionId })
          break;
        
        case 'text/plain':
          doc = await loader.txt({ path: req.file.destination })
          break;
        
        case 'image/png':
          doc = loader.image({ 
            path: join(req.file.destination, req.file.originalname), 
            description: req.body.description 
          })
          await vCollectionService.addFile({ doc, collectionId: rfile.collectionId })

          break;
        
        case '/image/jpeg':
          doc = loader.image({ 
            path: req.file.destination, 
            description: req.body.description 
          })
          await vCollectionService.addFile({ doc, collectionId: rfile.collectionId })
          
          break;
      
        default:
          break;
      }

      res.status(201).json({
        file: {
          name: rfile.name,
          id: rfile.id,
          date: rfile.date
        }
      })
    } catch(error) {
      console.error('Error GET collection', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  })

  ///:: get files in a collection
  router.get('/files/:id', async (req, res) => {
    const collectionId = req.params.id
    const files = await rCollectionService.getAllFiles({ collectionId })
    let payload = {
      files
    }

    res.status(200).json(payload)
  })

  return router;
}
