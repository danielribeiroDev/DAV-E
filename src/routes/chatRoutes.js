///:: Express
import { Router } from 'express';

///:: set up assistant routes
export default function chatRoutes(chatService) {
  const router = Router();
  
  ///:: Create chat
  router.post('/', async (req, res) => {
    try {
        const assistantId = req.body.assistantId
        
        const chat = await chatService.create({ 
            id: assistantId, 
            name: 'New chat'
        })

        let payload = {
            name: chat.name,
            id: chat.id
        }

      res.status(201).json(payload);

    } catch (error) {
      console.error('Error POST chat', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  ///:: Get all chats
  router.get('/', async (req, res) => {
    try {
        const chats = await chatService.getAll()

        const payload = {
            chats
        }

        res.status(200).json(payload);
    } catch (error) {
        console.error('Error GET chats', error);
        res.status(500).json({ error: 'Internal server error' });
      }
  })

  /// :: Get chat
  router.get('/:id', async (req, res) => {
    const id = req.params.id
    const chat = await chatService.get({ id })
    const payload = {
      chat
    }

    res.status(200).json(payload)
  })

  router.post('/message', async (req, res) => {
    const response = await chatService.answer({
      id: req.body.chat.id,
      question: req.body.chat.question
    })
  })


  return router;
}
