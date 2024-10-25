import jwt from 'jsonwebtoken'


function verifyToken (req, res, next) {
    const token = req.headers['authorization']
    if (!token)
        return res.status(401).json({ error: 'Unauthorized'})

    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) 
          return res.status(401).json({ error: 'Unauthorized' })
        req.user = { id: decoded.id };
        next();
    })
}

export {
    verifyToken
}