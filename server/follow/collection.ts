import type {Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';
import type {User} from '../user/model';
import UserCollection from '../user/collection';
import { formatDate } from '../likes/util';
import moment from 'moment';

type followRep = {following: string, follower: string, date: string};

/**
 * This files contains a class that has the functionality to explore following
 * stored in MongoDB, including following and unfollowing
 */
 class FollowCollection {
    /**
    * Get all the users that follow a specific user
    *
    * @param {string} username - Theusername of the given user
    * @return {Promise<Array<String>>} - An array of all of the users who follow userID
    */
    static async findFollowingForUser(username:string): Promise<Array<String>> {
        // const user = await UserCollection.findOneByUsername(username);
        const followerList = await FollowModel.find({following: username});
        const followerUsers = followerList.map((x) => x.follower);
        return followerUsers;
    }

     /**
    * Get all the users that a specific user follows
    *
    * @param {string} username - The id of the given user
    * @return {Promise<Array<String>>} - An array of all of the users who the user associated with UserId follows
    */
      static async findUsersFollowed(username: string): Promise<Array<String>> {
        // const user = await UserCollection.findOneByUsername(username);
        const followingList = await FollowModel.find({follower: username});
        const followingUsers = followingList.map((x) => x.following);
        return followingUsers;
    }

    /**
    * Get all the users that follow a specific user on a specific day
    *
    * @param {string} username - The id of the given user
    * @return {Promise<Array<Follow>>} - An array of all of the users who follow userID
    */
     static async findFollowersForUserbyDate(username: string, date:string): Promise<Array<Follow>> {
        const followingList: Follow[] = await FollowModel.find({following: username});
        if (followingList.length === 0) return [];
        const dayFollows: Follow[] = followingList.filter((x) => x.date === date);
        
        return dayFollows
    }

    /**
    * Get all the users that a user followed on a specific day
    *
    * @param {string} username - The id of the given user
    * @return {Promise<Array<Follow>>} - An array of all of the users who follow userID
    */
     static async findFollowingForUserbyDate(username: string, date:string): Promise<Array<Follow>> {
        const followerList: Follow[] = await FollowModel.find({follower: username});
        if (followerList.length === 0) return [];
        const dayFollows: Follow[] = followerList.filter((x) => x.date === date);

        return dayFollows
    }


    /**
     * Follow a user
     *
     * @param {string} followerUserId - The id of the user making the follow
     * @param {string} followingUsername - the Id of the user to follow
     * @return {Promise<{ following: string; follower: string; date: Date; }>} - The new follow information
     */
    static async followUser(followerUserId: string, followingUsername: string): Promise<followRep> {
        const followingUser = await UserCollection.findOneByUserId(followerUserId);
        const followedUser = await UserCollection.findOneByUsername(followingUsername);
        const followTime = moment(new Date()).format('MMMM Do YYYY');; // use one single date for both the following/being followed
        const newFollow = new FollowModel({following:followedUser.username, follower: followingUser.username, date:followTime});
        
        await newFollow.save();  // save to DB

        return {following:followedUser.username, follower: followingUser.username, date:followTime};
    }

    /**
     * Unfollow a user
     *
     * @param {string} followerUserId - The username of the user making the follow
     * @param {string} followingUsername - the username of the user to follow
     * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
     */
     static async unfollowUser(followerUsername: string, followingUsername: string): Promise<boolean> {
        const followingUser = await UserCollection.findOneByUserId(followerUsername);
        const followedUser = await UserCollection.findOneByUsername(followingUsername);

        const follow = await FollowModel.deleteMany({following:followedUser.username, follower: followingUser.username})
        return follow !== null;
    }
}
export default FollowCollection