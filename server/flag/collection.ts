import type {HydratedDocument, Types} from 'mongoose';
import type {Flag} from './model';
import type {User} from '../user/model';
import UserCollection from '../user/collection';
import { Freet } from '../freet/model';
import FreetCollection from '../freet/collection';
import FlagModel from './model';

/**
 * This files contains a class that has the functionality to explore flags
 * stored in MongoDB.
 */
 class FlagCollection {
    /**
    * Find all flags for a freet
    *
    * @param {string} freetId - The id of the given freet
    * @return {Promise<Flag[]>} - An array of all of the flags associated with the freet
    */
     static async getFreetFlags(freetId: Types.ObjectId | string): Promise<Flag[]> {
        const flags: Array<Flag> = await FlagModel.find()
        const filteredFlags = flags.filter((x) => JSON.stringify(x.freet) === JSON.stringify(freetId));
        return filteredFlags;
    }

    /**
    * Add a flag to a freet
    *
    * @param {string} userId - The id of the given user
    * @param {string} freetId - The id of the given freet
    * @param {string} flagType - the type of flag associated with the freet content
    * @return {Promise<Flag>} - An array of all of the users who follow userID
    */
     static async createFlag(username: string, freetId: Types.ObjectId | string, flagType: string): Promise<HydratedDocument<Flag>> {
        const freet: Freet = await FreetCollection.findOne(freetId);
        const flag = new FlagModel({freet: freet, username:username, flagType: flagType})
        await flag.save();
        
        return flag;
    }

    /**
    * Remove a flag from a freet
    *
    * @param {string} userId - The id of the given user
    * @param {string} freetId - The id of the given freet
    * @return {Promise<Boolean>} - An array of all of the users who follow userID
    */
      static async removeFlag(username: string, freetId: Types.ObjectId | string): Promise<Boolean> {
        const freet: Freet = await FreetCollection.findOne(freetId);
        const flag = await FlagModel.deleteMany({username:username, freet: freet});
        return flag !== null;
    }

    /**
    * Modify flag on a freet
    *
    * @param {string} freetId - The id of the given freet
    * @return {Promise<Flag>} - An array of all of the flags associated with the freet
    */
     static async updateFlagType(username:  string, freetId: Types.ObjectId | string, flagType: string): Promise<Flag> {
        const freet: Freet = await FreetCollection.findOne(freetId);
        const flag = await FlagModel.findOne({username: username, freet:freet});
        flag.flagType = flagType;
        await flag.save()

        return flag;
    }


}
export default FlagCollection