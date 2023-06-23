import { Router } from 'express';
const router = Router();

import TimeslotsController from '../controllers/timeslots.controller';

const timeslotsController = new TimeslotsController();

router.post('/', timeslotsController.getDayTimeTable);

export default router;
