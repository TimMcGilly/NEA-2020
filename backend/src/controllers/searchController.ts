import { query } from 'express-validator';
import { Request, Response } from 'express';
import { CheckValidation, SuccessFmt } from '../utils/response';
import { GetUserIDFromSub } from '../utils/user';
import { SearchIndividualTrips } from '../models/searchWrapper';

export const SearchIndividualController = [
  query('uuid').isString(),
  CheckValidation,
  async function SearchIndividualController(req: Request, res: Response): Promise<Response> {
    const userId = await GetUserIDFromSub(req.user.sub);

    const searchResults = await SearchIndividualTrips(userId, req.query.uuid as string);

    return res.status(200).json(SuccessFmt({ searchResults }));
  },
];
