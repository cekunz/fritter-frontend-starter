import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type { User } from '../user/model';

/**
 * This file defines the properties stored in a Follow
 */

// Type definition for Follow on the backend
export type Follow =  {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    following: Types.ObjectId;
    follower: Types.ObjectId;
    date: string;
};

export type PopulatedFollow =  {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    following: User;
    follower: User;
    date: string;
};

const FollowSchema = new Schema<Follow>({
    following: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    follower: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    date: {
        type: String,
        required: true
    }
})

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
