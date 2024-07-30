import { Router } from 'express';

export default function ticketRoutes(ticketService) {
  const router = Router();
  
  router.get('/', async (req, res) => {
    try {
      const tickets = await ticketService.find();
      res.json(tickets);
    } catch (error) {
      console.error('Error fetching tickets', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
