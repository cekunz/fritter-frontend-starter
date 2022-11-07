import type {Request, Response, NextFunction} from 'express';
import type {Flag} from './model';
import FlagCollection from './collection';
/**
 * Checks if the user is trying to unfollow someone they don't follow
 */
 const unflagWithoutFlagging = async (req: Request, res: Response, next: NextFunction) => {
    const freetId = (req.query.freetId as string) ?? undefined;
    const sessionUser = ( req.query.username as string) ?? undefined;
  
    let freetFlags: Flag[] = await FlagCollection.getFreetFlags(freetId);
    freetFlags = freetFlags.filter((x) => x.username === sessionUser);
    if (freetFlags.length === 0) {
        res.status(405).json({
            error: "You haven't flagged this freet!"
            });
        return 
    }
    next();
  };


  /**
   * Checks if user is trying to double-flag a post
   */
  const doubleFlag = async (req: Request, res: Response, next: NextFunction) => {
    const freetId = (req.query.freetId as string) ?? undefined;
    const sessionUser = ( req.body.username as string) ?? undefined;
    const freetFlags: Flag[] = await FlagCollection.getFreetFlags(freetId);
    const filteredFreetFlags = freetFlags.filter((x) => x.username === sessionUser);
    if (filteredFreetFlags.length !== 0) {
        res.status(405).json({
            error: "You have already flagged this freet!"
            });
        return 
    }
    next();
  }
  

  export {unflagWithoutFlagging, doubleFlag}