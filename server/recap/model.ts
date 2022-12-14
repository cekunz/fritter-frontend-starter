import {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type { Freet } from '../freet/model';
import { Follow } from '../follow/model';


/**
 * This file defines the properties stored in a Recap
 */
// Type definition for Recap on the backend
export type Recap =  {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    username: string,
    date: string;
    likes: Freet[];
    followings: Follow[]
    followers: Follow[]
};

const RecapSchema = new Schema<Recap>({
    username:  {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    likes: {
        type: Schema.Types.Mixed,  
        required: true
    },
    followings: {
        type: Schema.Types.Mixed,
        required: true,
    },
    followers: {
        type: Schema.Types.Mixed,
        required: true,
    }
})


const RecapModel = model<Recap>('Recap', RecapSchema);
export default RecapModel;
