import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';
import type {User} from '../user/model';
import UserCollection from '../user/collection';
import FreetModel from '../freet/model';
import { formatDate } from './util'
import UserModel from '../user/model';
import moment from 'moment';

/**
 * This files contains a class that has the functionality to explore likes
 * stored in MongoDB, including adding and deleting likes.
 */
 class LikeCollection {
    /**
    * Get all the likes for a given Freet
    *
    * @param {string} freetId - The id of the given freet
    * @return {Promise<Array<User>>} - An array of all of the users who have liked the Freet 
    */
    static async findLikesByFreet(freetId: Types.ObjectId | string | undefined): Promise<Array<User>> {
        const freet = await FreetModel.findOne({_id: freetId});
        const likes: Like[] = await LikeModel.find({post: freet});
        const userLikes: User[] = likes.map((x) => x.user);
        return userLikes;
    }

     /**
    * Get all the likes sent by a given user
    *
    * @param {string} username - The username
    * @return {Promise<Array<Like>>} - An array of all of the likes sent by the user
    */
      static async findLikesByUser(username: string): Promise<Array<Like>> {
        const user = await UserCollection.findOneByUsername(username);
        const likes: Like[] = await LikeModel.find({user: user});
        return likes;
    }

    /**
    * Get all the likes by a user for a given day
    *
    * @param {string} username - The id of the user liking the freet
    * @param {Date} date - The day the likes were sent
    * @return {Promise<Array<Like>>} - An array of all of likes from thay day
    */
     static async findLikesByDay(username: string, date: string ): Promise<Array<Like>> {
        const liker: User = await UserCollection.findOneByUsername(username);
        const likes: Like[] = await LikeModel.find({user: liker._id});
        const dayLikes: Like[] = likes.filter((x) => x.likeDate === date);
                       
        return dayLikes; 
    }


    /**
     * Add a like to the collection
     *
     * @param {string} freetId - the post that the like is being applied to
     * @param {string} likerId - The id of the user liking the freet
     * @return {Promise<HydratedDocument<Freet>>} - The new like
     */
    static async addLike(freetId: string, likerId: string): Promise<HydratedDocument<Like>> {
        const freet = await FreetModel.findOne({_id: freetId});
        const liker: User = await UserCollection.findOneByUserId(likerId);
        const date = moment(new Date()).format('MMMM Do YYYY');

        const like = new LikeModel({user: liker, post:freet, likeDate: date});
        await like.save()
        
        return like;
    }

    /**
     * Removes a like to the collection if the like is on the post
     *
     * @param {Freet} freetId - the post that the like is being applied to
     * @param {string} likerId - The id of the user liking the freet
     * @return {Promise<HydratedDocument<Freet>>} - The modified freet
     */
     static async removeLike(freetId: string, likerId: string): Promise<Boolean> {
        const freet = await FreetModel.findOne({_id: freetId});
        const liker: User = await UserCollection.findOneByUserId(likerId);

        const like = await LikeModel.deleteMany({user:liker, post: freet});
        return like !== null;
    }
}
export default LikeCollection