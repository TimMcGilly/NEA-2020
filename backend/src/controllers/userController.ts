import { Request, Response } from 'express';
import { SuccessFmt } from '../utils/response';
import { GetPrivateUserDetails } from '../models/userWrapper';

export const GetUserController = [
  async function GetUserController(req: Request, res: Response): Promise<Response> {
    const user = await GetPrivateUserDetails(req.user.sub);
    console.log('1');
    return res.status(200).json(SuccessFmt({ user }));
  },
];
