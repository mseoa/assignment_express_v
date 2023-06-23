import moment, { Moment } from 'moment';

export function isConflictPeriod(
    timeslotStart: Moment,
    timeslotEnd: Moment,
    eventStart: Moment,
    eventEnd: Moment
) {
    // 이벤트가 시간대 내에서 시작하는지 확인
    if (eventStart >= timeslotStart && eventStart < timeslotEnd) return true;
    // 이벤트가 시간대 내에서 종료하는지 확인
    if (eventEnd <= timeslotEnd && eventEnd > timeslotStart) return true;
    // 이벤트가 시간대를 완전히 포괄하는지 확인
    if (eventStart <= timeslotStart && eventEnd >= timeslotEnd) return true;
    return false;
}

/*
const timeslotStart = moment('2023-06-21T07:30:00');
const timeslotEnd = moment('2023-06-21T08:30:00');

console.log(
    isConflictPeriod(timeslotStart, timeslotEnd, moment('2023-06-21T05:00:00'), moment('2023-06-21T05:30:00')),
    isConflictPeriod(timeslotStart, timeslotEnd, moment('2023-06-21T07:00:00'), moment('2023-06-21T07:45:00')),
    isConflictPeriod(timeslotStart, timeslotEnd, moment('2023-06-21T07:45:00'), moment('2023-06-21T07:50:00')),
    isConflictPeriod(timeslotStart, timeslotEnd, moment('2023-06-21T07:50:00'), moment('2023-06-21T08:30:00')),
    isConflictPeriod(timeslotStart, timeslotEnd, moment('2023-06-21T08:30:00'), moment('2023-06-21T09:00:00')),
    isConflictPeriod(timeslotStart, timeslotEnd, moment('2023-06-21T05:00:00'), moment('2023-06-21T07:30:00')),
    isConflictPeriod(timeslotStart, timeslotEnd, moment('2023-06-21T05:00:00'), moment('2023-06-21T09:00:00')),
)
*/
