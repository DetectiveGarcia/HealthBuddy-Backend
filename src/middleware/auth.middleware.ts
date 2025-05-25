import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types/express';
import { verifyJWT } from '../../utils/jwt';


export async function checkAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return 
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await verifyJWT(token);

    
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
    return 
  }
}