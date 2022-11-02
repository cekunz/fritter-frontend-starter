import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a Follow
 */

// Type definition for Follow on the backend
export type Follow =  {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    following: string;
    follower: string;
    date: string;
};

const FollowSchema = new Schema<Follow>({
    following: {
        type: String,
        required: true
    },
    follower: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
})

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
