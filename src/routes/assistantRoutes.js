///:: Express
import { Router } from 'express';

///:: set up assistant routes
export default function assistantRoutes(rCollectionService, assistantService) {
  const router = Router();
  
  ///:: Create assistant
  router.post('/', async (req, res) => {
    try {
        const assistantName = req.body.assistant.name
        const description = req.body.assistant.description
        
        const assistant = await assistantService.create({ 
            name: assistantName,
            description
        }) 

        let payload = {
            assistant: {
                name: assistant.name ,
                id: assistant.id,
            }
        }

      res.status(201).json(payload);

    } catch (error) {
      console.error('Error POST assistant', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  ///:: Get assistants
  router.get('/', async (req, res) => {
    try {
      const allAssistants = await assistantService.getAll()
      
      let payload = {
        assistants: allAssistants
      }

      res.status(200).json(payload)
      
    } catch (error) {
      console.error('Error GET collection', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  })

  ///:: Attach collections to assistant
  router.post('/collections', async (req, res) => {
    try {
        const collections = req.body.collections
        const assistantId = req.body.assistantId

        const attachedCollections = await assistantService.attachCollections({
            id: assistantId,
            collections
        })

        let payload = {
            collections: attachedCollections
        }

        res.status(201).json(payload)

    } catch (error) {
        console.error('Error attach collections to assistant', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  }) 

  ///:: Get collections attached to assistant
  router.get('/collections/:id', async (req, res) => {
    try {
        const assistantId = req.params.id
        let collections = {}
        collections.attached = await assistantService.getAttachedCollections({ id: assistantId })
        let payload = {
            collections
        }
        res.status(200).json(payload)
    } catch (error) {
        console.error('Error get assistant related collections', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  })

  ///:: Get collections not yet attached to assistant
  router.get('/collections/available/:id', async (req, res) => {
    try {
      const assistantId = req.params.id
      let collections = {}
      collections.available = await assistantService.getAvailableCollections({ id: assistantId })
      let payload = {
        collections
      }
      res.status(200).json(payload)
    } catch (error) {
      console.error('Error get assistant related collections', error);
      res.status(500).json({ error: 'Internal server error' });
  }
  }) 

  return router;
}
