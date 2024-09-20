///:: Express
import { Router } from 'express';

///:: setup file route
export default function fileRoutes() {
  const router = Router();

  /// :: get file
  router.post('/', async (req, res) => {
    const path = req.body.path

    res.sendFile(path)
  })

  return router;
}
