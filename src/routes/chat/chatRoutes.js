
///:: express
import { Router } from 'express';

///:: set up assistant routes
export default function chatRoutes(chatService) {
  const router = Router();
  
  ///:: create chat
  router.post('/', async (req, res) => {
    try {
        const assistantId = req.body.assistantId
        
        const chat = await chatService.create({ 
            id: assistantId, 
            name: 'New chat',
            userId: req.user.id
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

  ///:: get all chats
  router.get('/', async (req, res) => {
    try {
        const chats = await chatService.getAll({ userId: req.user.id })

        const payload = {
            chats
        }
        res.status(200).json(payload);
    } catch (error) {
        console.error('Error GET chats', error);
        res.status(500).json({ error: 'Internal server error' });
      }
  })

  /// :: get chat
  router.get('/:id', async (req, res) => {
    const id = req.params.id
    const chat = await chatService.get({ id })
    const payload = {
      chat
    }

    res.status(200).json(payload)
  })

  router.post('/message', async (req, res) => {
    const result = await chatService.answer({
      id: req.body.chat.id,
      question: req.body.chat.question
    })

    const payload = {
      answer: result.answer,
      relativeImages: result.relativeImages
    }

    res.status(201).json(payload)
  })


  return router;
}
