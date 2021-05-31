import { body, param } from 'express-validator';
import { Request, Response } from 'express';
import { CheckValidation, SuccessFmt } from '../utils/response';
import { GetUserIDFromSub } from '../utils/user';
import * as trip from '../models/tripWrapper';

export const CreateTripController = [
  body('partialTrip').exists(),
  CheckValidation,
  async function CreateTripController(req: Request, res: Response): Promise<Response> {
    const userId = await GetUserIDFromSub(req.user.sub);
    const newTrip = await trip.CreateTrip(userId, req.body.partialTrip);

    return res.status(201).json(SuccessFmt({ trip: newTrip }));
  },
];

export const FindAllTripsController = [
  async function FindAllTripsController(req: Request, res: Response): Promise<Response> {
    const userId = await GetUserIDFromSub(req.user.sub);

    const trips = await trip.FindAllTrips(userId);

    return res.status(200).json(SuccessFmt({ trips }));
  },
];

export const FindTripByIdController = [
  param('uuid').isString(),
  CheckValidation,
  async function FindTripByIdController(req: Request, res: Response): Promise<Response> {
    const userId = await GetUserIDFromSub(req.user.sub);

    const fetchedTrip = await trip.FindTripById(userId, req.params.uuid);

    return res.status(200).json(SuccessFmt({ trip: fetchedTrip }));
  },
];

export const DeleteTripByIdController = [
  param('uuid').isString(),
  CheckValidation,
  async function DeleteTripByIdController(req: Request, res: Response): Promise<Response> {
    const userId = await GetUserIDFromSub(req.user.sub);

    await trip.DeleteTripById(userId, req.params.uuid);

    return res.status(200).json(SuccessFmt(null));
  },
];
