import Joi from 'joi';

export const getTimeSlotRequestSchema = Joi.object({
    start_day_identifier: Joi.string()
        .required()
        .pattern(/^\d{8}$/)
        .messages({
            'string.base': 'start_day_identifier은 문자열이어야 합니다.',
            'string.empty': 'start_day_identifier은 필수값입니다.',
            'string.pattern.base': 'start_day_identifier은 "YYYYMMDD" 형식이어야 합니다.',
            'any.required': 'start_day_identifier은 필수값입니다.',
        }),
    timezone_identifier: Joi.string().required().messages({
        'any.required': 'timezone_identifier은 필수값입니다.',
    }),
    service_duration: Joi.number().required().messages({
        'any.required': 'service_duration은 필수값입니다.',
    }),
    days: Joi.number(),
    timeslot_interval: Joi.number().min(1).messages({
        'number.min': 'timeslot_interval은 0보다 커야합니다.',
    }),
    is_ignore_schedule: Joi.boolean(),
    is_ignore_workhour: Joi.boolean(),
});
