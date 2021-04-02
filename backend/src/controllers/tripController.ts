import { body, validationResult } from 'express-validator';
import { Request, Response } from 'express';
import { GetUserIDFromSub } from '../utils/User';
import * as trip from '../models/tripWrapper';

export const CreateTripController = [
  body('partialTrip').exists(),
  async function CreateTripController(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = await GetUserIDFromSub(req.user.sub);
    const newTrip = trip.CreateTrip(userId, req.body.partialTrip);

    return res.status(201).json({ trip: newTrip });
  },
];

export const FindAllTripsController = [
  async function FindAllTripsController(req: Request, res: Response) {
    const userId = await GetUserIDFromSub(req.user.sub);

    const trips = await trip.FindAllTrips(userId);

    return res.status(200).json({ trips });
  },
];
