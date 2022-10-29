import type {Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';
import type {User} from '../user/model';
import UserCollection from '../user/collection';
import { formatDate } from '../likes/util';
import { json } from 'express';

/**
 * This files contains a class that has the functionality to explore following
 * stored in MongoDB, including following and unfollowing
 */
 class FollowCollection {
    /**
    * Get all the users that follow a specific user
    *
    * @param {string} username - Theusername of the given user
    * @return {Promise<Array<User>>} - An array of all of the users who follow userID
    */
    static async findFollowingForUser(username:string): Promise<Array<User>> {
        const user: User = await UserCollection.findOneByUsername(username);
        const followerList: Array<Follow> = await FollowModel.find({following: user});
        const followerUsers = followerList.map((x) => x.follower);
        return followerUsers
    }

     /**
    * Get all the users that a specific user follows
    *
    * @param {string} username - The id of the given user
    * @return {Promise<Array<string>>} - An array of all of the users who the user associated with UserId follows
    */
      static async findUsersFollowed(username: string): Promise<Array<string>> {
        const user: User = await UserCollection.findOneByUsername(username);
        console.log('find users followed user', user.username )
        const followingList: Follow[] = await FollowModel.find({follower:user});
        const test = followingList.map((x) => x._id);
        // const testarray =[]
        // for (const id of test) {
        //     const newUser: User = await UserCollection.findOneByUserId(id);
        //     testarray.push(newUser);
        // }
        // console.log('test', test, testarray)
        const followingUsers: string[] = followingList.map((x) => JSON.stringify(x.following));
        console.log('stringified, ', followingUsers)
        const usernameList: string[] = []
        
        return usernameList
    }


    /**
    * Get all the users that follow a specific user on a specific day
    *
    * @param {string} userId - The id of the given user
    * @return {Promise<Array<Follow>>} - An array of all of the users who follow userID
    */
     static async findFollowersForUserbyDate(userId: Types.ObjectId | string, date:string): Promise<Array<Follow>> {
        const user: User = await UserCollection.findOneByUserId(userId);
        const followingList: Follow[] = await FollowModel.find({following: user});
        if (followingList.length === 0) return [];

        const dayFollows: Follow[] = followingList.filter((x) => {
                const substrings = x.date.split(',');
                return (substrings[0] === date);
        });

        return dayFollows
    }

    /**
    * Get all the users that a user followed on a specific day
    *
    * @param {string} userId - The id of the given user
    * @return {Promise<Array<Follow>>} - An array of all of the users who follow userID
    */
     static async findFollowingForUserbyDate(userId: Types.ObjectId | string, date:string): Promise<Array<Follow>> {
        const user: User = await UserCollection.findOneByUserId(userId);
        const followerList: Follow[] = await FollowModel.find({follower: user});
        if (followerList.length === 0) return [];

        const dayFollows: Follow[] = followerList.filter((x) => {
                const substrings = x.date.split(',');
                return (substrings[0] === date);
        });

        return dayFollows
    }


    /**
     * Follow a user
     *
     * @param {string} followerUserId - The id of the user making the follow
     * @param {string} followingUsername - the Id of the user to follow
     * @return {Promise<{ following: string; follower: string; date: Date; }>} - The new follow information
     */
    static async followUser(followerUserId: string, followingUsername: string): Promise<{ following: string; follower: string; date: string; }> {
        const followingUser = await UserCollection.findOneByUserId(followerUserId);
        const followedUser = await UserCollection.findOneByUsername(followingUsername);
        const followTime = formatDate(new Date()); // use one single date for both the following/being followed

        const newFollow = new FollowModel({following:followedUser, follower: followingUser, date:followTime});
        
        await newFollow.save();  // save to DB

        const followReturnObj = {"following": followedUser.username, "follower": followingUser.username, "date": followTime}
        console.log('new follow', newFollow)
        return followReturnObj;
    }

    /**
     * Unfollow a user
     *
     * @param {string} followerUserId - The id of the user making the follow
     * @param {string} followingUsername - the Id of the user to follow
     * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
     */
     static async unfollowUser(followerUserId: string, followingUsername: string): Promise<boolean> {
        const followingUser = await UserCollection.findOneByUserId(followerUserId);
        const followedUser = await UserCollection.findOneByUsername(followingUsername);
        const followedUserId = followedUser._id;
        // const followedUser = await UserCollection.findOneByUserId(followingUserId);

        const follow = await FollowModel.deleteMany({following:followedUserId, follower: followingUser})
        return follow !== null;
    }
}
export default FollowCollection