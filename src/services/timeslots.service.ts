import moment from 'moment-timezone';
import { generateTimeSlots } from '../utils/generateTimeslots';
import { isConflictPeriod } from '../utils/isConflictPeriod';
import { DayTimetable } from '../types/getTimeSlot.type';
import EventsRepository from '../repositories/events.repository';
import WorkhourRepository from '../repositories/workhour.repository';

class TimeslotsService {
    workhourRepository = new WorkhourRepository();
    eventRepository = new EventsRepository();

    getDayTimeTable = async (
        start_day_identifier: string,
        timezone_identifier: string, // 요청하는 타임존에 따라 날의 구분이 변경됩니다
        service_duration: number, // 서비스 제공시간입니다.  단위 초
        days: number, // 시작일을 기준으로 몇 일치를 반환 할 지를 결정합니다. 3일 경우 3일치
        timeslot_interval: number,
        is_ignore_schedule: boolean, //  해당 기간에 이미 존재하는 Event을 무시합니다.
        is_ignore_workhour: boolean // 해당 기간에 사롱에 설정되어 있는 is_day_off, open_interval, close_interval을 무시하고 하루 전체를 기간으로 설정
    ) => {
        
        const result: DayTimetable[] = [];

        for (let day = 0; day < days; day++) {
            let open_interval = 0;
            let close_interval = 24 * 60 * 60 + service_duration;

            const startMoment = moment.tz(start_day_identifier, timezone_identifier).add(day, 'days');
            const yoil = startMoment.day() + 1;
            
            const workhour = await this.workhourRepository.findWorkhoursByWeekday(yoil);
            
            if (!is_ignore_workhour && workhour) {
                open_interval = workhour.open_interval;
                close_interval = workhour.close_interval;
            }

            let timeSlots = generateTimeSlots(
                startMoment.clone().add(open_interval, 'seconds'),
                startMoment
                    .clone()
                    .add(close_interval, 'seconds')
                    .subtract(service_duration, 'seconds'),
                timeslot_interval,
                service_duration
            );


            if (!is_ignore_schedule) {
                const events = await this.eventRepository.findEventsOnTheDay(
                    startMoment.clone().add(open_interval, 'seconds').unix(),
                    startMoment
                        .clone()
                        .add(close_interval, 'seconds')
                        .subtract(service_duration, 'seconds')
                        .unix()
                );

                // console.log(events)

                if (events.length > 0) {
                    let newTimeSlots= []
                    for (let i = 0; i < timeSlots.length; i++) {
                        let isConflicted = false;
                        for (let j = 0; j < events.length; j++) {
                            
                            if (isConflictPeriod(
                                timeSlots[i].start,
                                timeSlots[i].end,
                                moment(events[j].begin_at*1000),
                                moment(events[j].end_at*1000)
                            )){
                                isConflicted = true; // 충돌이 있을 경우 isConflicted true
                                break;
                            }
                        }

                        if (!isConflicted) {
                            newTimeSlots.push(timeSlots[i]); // 충돌이 없을 경우에만 newTimeSlots에 추가
                          }
                    }
                    timeSlots=newTimeSlots
                }
                // console.log('ttttttttt',timeSlots)
            }

            result.push({
                start_of_day: startMoment.unix(),
                day_modifier: day,
                is_day_off: false,
                // timeSlots: timeSlots.length,
                timeslots: timeSlots.map((ts) => ({
                    begin_at: ts.start.unix(),
                    end_at: ts.end.unix(),
                })),
            });
        }

        return result;
    };
}



export default TimeslotsService;
