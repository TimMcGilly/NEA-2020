import { Request, Response } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import { CheckValidation, SuccessFmt } from '../utils/response';
import { GetPrivateUserDetails, OnboardUser } from '../models/userWrapper';
import { AddDaysToDate, Date13YearAgo, DateToYMDString } from '../../../shared';

export const GetUserController = [
  async function GetUserController(req: Request, res: Response): Promise<Response> {
    const user = await GetPrivateUserDetails(req.user.sub);
    return res.status(200).json(SuccessFmt({ user }));
  },
];

const onboardUpload = multer({ dest: './public/uploads/avatars/' });

export const OnboardController = [
  onboardUpload.single('avatar'),
  body('name', 'Empty name').trim().isLength({ min: 1 }).escape(),
  body('dob', 'Invalid age or under 13').isISO8601().toDate().isBefore(DateToYMDString(AddDaysToDate(Date13YearAgo(), 1))),
  CheckValidation,
  async function OnboardController(req: Request, res: Response): Promise<Response> {
    await OnboardUser(req.user.sub, req.body.name, req.body.dob, req.body.bio, req.file);

    return res.status(200).json(SuccessFmt(null));
  },
];
