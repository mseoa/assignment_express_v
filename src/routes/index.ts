import { Router } from 'express';
const router = Router();

import timeslotsRouter from './timeslots.route';

router.use('/getTimeSlots', timeslotsRouter);

export default router;
