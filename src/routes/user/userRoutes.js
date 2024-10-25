
///:: express
import { Router } from 'express';

///:: set up user routes
export default function userRoutes(userService, verifyToken) {
  const router = Router();
  
  ///:: create user
  router.post('/', async (req, res) => {
    try {
        const { name, email, password } = req.body.user

        const newuser = await userService.create({
            name,
            email,
            password
        })

        let payload = { user: newuser }

      res.status(201).json(payload);

    } catch (error) {
      console.error('Error POST user', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  })

  router.get('/:id', verifyToken, async (req, res) => {
    try {
      const user = await userService.get({ id: req.params.id })
      res.status(200).json(user);
    } catch (error) {
      console.error('Error GET user', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  })

  router.post('/token', async (req, res) => { 
    try{
      if(!req.body.user)
        return res.status(400).json({ error: 'Bad request' });
  
      const { email, password } = req.body.user

      const user = await userService.authenticate({ email, password })

      let payload = { user }

      res.status(200).json(payload);
    } catch (error) {
      if(error.message === 'User not found' || error.message === 'Invalid password') {
        res.status(401).json({ error: error.message });
      }
      else {
        console.error('Error POST token', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  })

  return router
}