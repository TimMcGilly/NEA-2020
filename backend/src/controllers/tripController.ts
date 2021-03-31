import { body, validationResult } from 'express-validator';
import { Request, Response } from 'express';
import { GetUserIDFromSub } from 'utils/User';
import * as trip from '../models/tripWrapper';
import { PartialTrip } from '../../../shared/Trip';

export const CreateTripController = [
  body('trip').exists().isObject(),
  async function CreateTripController(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const partialTrip : PartialTrip = new PartialTrip(req.body);
    const userId = await GetUserIDFromSub(req.user.sub);
    trip.CreateTrip(userId, partialTrip);
  },
];
