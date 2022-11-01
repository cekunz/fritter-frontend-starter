import type {HydratedDocument} from 'mongoose';
import type {Follow, PopulatedFollow} from '../follow/model';
import { constructUserResponse } from '../user/util'

type FollowUsernames = {
    _id: string;
    follower: string;
    following: string;
    date: string
  };
  
  /**
   * Create a populated Follow response to access usernames during follow
   * 
   * @param {HydratedDocument<Follow>} follow - follow object to fill
   * @returns {FollowUsernames} - The usernames of the follow object
   */
  const constructFollowResponse = (follow: HydratedDocument<Follow>): FollowUsernames => {
    //   console.log('FOLLOW BEFORE CLARIFY', follow)
    const followObjCopy: PopulatedFollow = {
      ...follow.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };
    
  
    // console.log('in util', followObjCopy.follower)
    const test = followObjCopy.follower

    return {
      ...followObjCopy,
      following: followObjCopy.following.username,
      follower: followObjCopy.follower.username,
      _id: followObjCopy._id.toString(),
      date: followObjCopy.date
    };
  };
  
  export {
    constructFollowResponse, FollowUsernames
  };