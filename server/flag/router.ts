
import type {Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as flagValidator from './middleware';
import type {Flag} from './model'
import FlagCollection from './collection';

const router = express.Router();

/**
 * Get flags for a freet, for a specific user if the user is provided
 *
 * @name GET /api/flag/username?freetId=id
 * 
 * @param {freetId} - the id for the freet being flagged
 * 
 * @return {Flag} - The flag object created
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freet ID is invalid
 */
router.get(
    '/',
    [
      userValidator.isUserLoggedIn,
      freetValidator.isFreetExistsQuery, // check
    ],
    async (req: Request, res: Response) => {
      const freetId = (req.query.freetId as string) ?? undefined;
      const username = (req.query.username as string) ?? undefined;
      const flags: Flag[] = await FlagCollection.getFreetFlags(freetId);
      if (username === undefined) {
        res.status(200).json({
          message: 'The flags were successfully found.',
          flags: flags});
      } else {
        const filteredFlags = flags.filter((x) => x.username === username);
        res.status(200).json({
          message: 'The flags were successfully found.',
          flags: filteredFlags});
      }
    }
     
  
);


/**
 * Add a Flag to a freet
 *
 * @name POST /api/flag?freetId=id&username=username
 * 
 * @param {freetId} - the id for the freet being flagged
 * 
 * @return {Flag} - The flag object created
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freet ID is invalid
 * @throws {405} - If the user has already flagged the freet
 */
 router.post(
    '/',
    [
      userValidator.isUserLoggedIn,
      freetValidator.isFreetExistsQuery,
      flagValidator.doubleFlag,
    ],
    async (req: Request, res: Response) => {
      const freetId = (req.query.freetId as string) ?? undefined;
      const username = req.body.username;
      const flagType = req.body.type;
      
      const flag: Flag = await FlagCollection.createFlag(username, freetId, flagType);
      res.status(200).json({
        message: 'The flag was added successfully.',
        flag: flag
      })
    } 
  );

  /**
 * Delete a flag from a post for a user
 *
 * @name DELETE /api/flag?freetId=id&username=username
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in 
 * @throws {404} - If the freetId is not valid
 * @throws {409} - if the user has not flagged the freet
 */
router.delete(
    '/',
    [
      userValidator.isUserLoggedIn,
      freetValidator.isFreetExistsQuery,
      flagValidator.unflagWithoutFlagging,
    ],
    async (req: Request, res: Response) => {
      const freetId = (req.query.freetId as string) ?? undefined;
      const username = (req.query.username as string) ?? undefined;
      const removedFlag = await FlagCollection.removeFlag(username, freetId);
      if (removedFlag) {
        res.status(200).json({
            message: 'The freet was unflagged successfully.'}); 
      } else {
        res.status(404).json({
            message: 'There was an error in removing the flag from this freet.'}); 
      }
        
    });


/**
 * Modify a flag from a user
 *
 * @name PUT /api/flag?freetId=id&username=username
 *
 * @param {string} content - the new flag type for the freet
 * @return {Flag} - the updated flag
 * @throws {403} - if the user is not logged in 
 * @throws {404} - If the freetId is not valid
 * @throws {405} - If the user has not flagged the freet
 */
router.put(
    '/',
    [
      userValidator.isUserLoggedIn,
      freetValidator.isFreetExistsQuery,
      flagValidator.unflagWithoutFlagging,
    ],
    async (req: Request, res: Response) => {
      const freetId = (req.query.freetId as string) ?? undefined;
      const username = (req.query.username as string) ?? undefined;
      const flagType = req.body.type;
      const flag = await FlagCollection.updateFlagType(username, freetId, flagType);
      res.status(200).json({
        message: 'Your flag type was updated successfully.',
        flag: flag
      });
    }
  );
  

export {router as flagRouter};