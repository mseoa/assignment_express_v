import { Request, Response, NextFunction } from 'express';
import TimeslotsService from '../services/timeslots.service';
import { GetTimeSlotRequestBody } from '../types/getTimeSlot.type';
import { getTimeSlotRequestSchema } from '../schemas/getTimeSlotReqSchema';


class TimeslotsController {
    timeslotsService = new TimeslotsService();

    getDayTimeTable = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                start_day_identifier,
                timezone_identifier,
                service_duration,
                days = 1,
                timeslot_interval = 30 * 60,
                is_ignore_schedule = false,
                is_ignore_workhour = false,
            } = req.body as GetTimeSlotRequestBody;

            const validate = getTimeSlotRequestSchema.validate(req.body);
            if (validate.error) {
                throw new Error(validate.error.message);
            }

            let result = await this.timeslotsService.getDayTimeTable(
                start_day_identifier,
                timezone_identifier,
                service_duration,
                days,
                timeslot_interval,
                is_ignore_schedule,
                is_ignore_workhour
            );

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}

export default TimeslotsController;
