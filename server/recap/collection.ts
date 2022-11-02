import type {HydratedDocument, Types} from 'mongoose';
import type {Recap} from './model';
import type {Freet} from '../freet/model';
import RecapModel from './model';
import LikeCollection from '../likes/collection';
import FollowCollection from '../follow/collection';
import moment from 'moment';
import FreetModel from '../freet/model';
import { constructFreetResponseUsername } from '../freet/util';

class RecapCollection {
  /**
   * Create a recap
   *
   * @param {string} username - The user the recap is built for
   * @return {Promise<HydratedDocument<Recap>>} - The newly created recap
   */
  static async createRecap(username: string): Promise<HydratedDocument<Recap>> {
    const allLikes = [];
    const allFollowings = [];
    const allFollowers = [];
    const date = new Date();
    for (let i=0; i<7; i++) {
      const currDate = moment(date).subtract(i, "days").format('MMMM Do YYYY');
      const likesByDate = await LikeCollection.findLikesByDay(username,  currDate);
      const followingsByDate = await FollowCollection.findFollowingForUserbyDate(username, currDate);
      const followersByDate = await FollowCollection.findFollowersForUserbyDate(username, currDate);
      allLikes.push(...likesByDate);
      allFollowings.push(...followingsByDate);
      allFollowers.push(...followersByDate);
    }
    
    const likedFreets = await Promise.all(allLikes.map((x) => FreetModel.findById(x.post)));
    const constructedFreets = await Promise.all(likedFreets.map(constructFreetResponseUsername));
    const recap = new RecapModel({username: username, 
                                  date: moment(date).format('MMMM Do YYYY'), 
                                  likes: constructedFreets, 
                                  followings: allFollowings, 
                                  followers: allFollowers});
    
    await recap.save();

    return recap
 }

  /**
   * Get a recap
   *
   * @param {string} username - The user the recap is built for
   * @param {string} date - The day the recap is built for
   * @return {Promise<HydratedDocument<User>>} - The newly created recap
   */
   static async getRecap(username: string, date: string): Promise<Recap> {
   const recapList: Recap[] = await RecapModel.find({username: username, date: date})
    if (recapList.length === 0) {
      const recap: Recap = await this.createRecap(username);
      return recap;
    } else {
      // remake recap at date
      await RecapModel.deleteMany({username: username, date: date});
      const recap: Recap = await this.createRecap(username);
      return recap;
    }
 }
 

 
}

export default RecapCollection;
