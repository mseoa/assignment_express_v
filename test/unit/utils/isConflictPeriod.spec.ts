import moment from 'moment-timezone';
import { isConflictPeriod } from '../../../src/utils/isConflictPeriod';

describe('isConflictPeriod', () => {
    it('timeslot과 event가 겹칠때 true를 반환합니다', () => {
        const timeslotStart = moment('2023-06-29 08:00:00');
        const timeslotEnd = moment('2023-06-29 09:00:00');
        const eventStart = moment('2023-06-29 08:30:00');
        const eventEnd = moment('2023-06-29 09:30:00');

        const result = isConflictPeriod(timeslotStart, timeslotEnd, eventStart, eventEnd);

        expect(result).toBe(true);
    });

    it('timeslot과 event가 겹치지 않을때 false를 반환합니다', () => {
        const timeslotStart = moment('2023-06-29 08:00:00');
        const timeslotEnd = moment('2023-06-29 09:00:00');
        const eventStart = moment('2023-06-29 09:30:00');
        const eventEnd = moment('2023-06-29 10:00:00');

        const result = isConflictPeriod(timeslotStart, timeslotEnd, eventStart, eventEnd);

        expect(result).toBe(false);
    });

    it('이벤트가 timeslot을 포괄할 때 true를 반환합니다', () => {
        const timeslotStart = moment('2023-06-29 08:00:00');
        const timeslotEnd = moment('2023-06-29 09:00:00');
        const eventStart = moment('2023-06-29 07:30:00');
        const eventEnd = moment('2023-06-29 09:30:00');

        const result = isConflictPeriod(timeslotStart, timeslotEnd, eventStart, eventEnd);

        expect(result).toBe(true);
    });
});
