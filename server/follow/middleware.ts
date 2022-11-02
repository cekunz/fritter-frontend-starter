import type {Request, Response, NextFunction} from 'express';
import type { User } from '../user/model';
import UserCollection from '../user/collection';
import FollowCollection from './collection';


/**
 * Checks if a user is trying to follow themselves
 */
 const isSelfFollow = async (req: Request, res: Response, next: NextFunction) => {
    const following = req.query.username;
    const sessionUser = req.session.userId
    const user = await UserCollection.findOneByUserId(sessionUser);
    if (following === user.username) {
        res.status(406).json({
            error: "You can't follow yourself!"
            });
        return 
    }

    next();
  };
  
/**
 * Checks if the follow trying to be made already exists
 */
 const isAlreadyFollowing = async (req: Request, res: Response, next: NextFunction) => {
    const username = (req.query.username as string) ?? undefined;
    const followingUser = await UserCollection.findOneByUsername(username)
    const sessionUserId = ( req.session.userId as string) ?? undefined;
    const sessionUser = await UserCollection.findOneByUserId(sessionUserId)
   
    const usersFollowed = await FollowCollection.findUsersFollowed(sessionUser.username);
    usersFollowed.filter((x) => x === followingUser.username);
    if (usersFollowed.length > 0) {
        res.status(407).json({
            error: 'You already follow this user!'
            });
        return 
    }
    next();
  };
  
/**
 * Checks if the user is trying to unfollow someone they don't follow
 */
 const unfollowWithoutFollow = async (req: Request, res: Response, next: NextFunction) => {
    const username = (req.query.username as string) ?? undefined;
    const followingUsername = await UserCollection.findOneByUsername(username);
    const sessionUser = ( req.session.userId as string) ?? undefined;
    const sessionUserUsername = await UserCollection.findOneByUserId(sessionUser);
    const usersFollowed = await FollowCollection.findUsersFollowed(sessionUserUsername.username);
    const userCheck = usersFollowed.filter((x) => x === followingUsername.username);
    if (userCheck.length === 0) {
        res.status(405).json({
            error: 'You do not follow this user!'
            });
        return 
    }
    next();
  };
  
export {isSelfFollow, isAlreadyFollowing, unfollowWithoutFollow};