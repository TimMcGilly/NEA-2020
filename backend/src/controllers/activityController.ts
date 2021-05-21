import { Request, Response } from 'express';
import { SuccessFmt } from '../utils/response';
import { ActivityCategory } from '../../../shared';
import { GetActivityCategories } from '../models/activityWrapper';

export const GetActivitesCategoriesController = [
  async function GetActivitesCategoriesController(req: Request, res: Response): Promise<Response> {
    const activityCategories: ActivityCategory[] = await GetActivityCategories();

    return res.status(201).json(SuccessFmt({ activityCategories }));
  },
];
