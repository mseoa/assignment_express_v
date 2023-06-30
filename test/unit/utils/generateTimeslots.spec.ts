import moment from 'moment-timezone';
import { generateTimeSlots } from '../../../src/utils/generateTimeslots';

describe('generateTimeSlots', () => {
    it('interval과 duration을 고려해서 start부터 finish 사이의 timeslot을 만든다', () => {
        const start = moment('2023-06-29 08:00:00');
        const finish = moment('2023-06-29 10:00:00');
        const interval = 1800; // 30분
        const duration = 3600; // 1시간

        const generatedTimeslots = generateTimeSlots(start, finish, interval, duration);
        const expectedTimeslots = [
            { start: moment('2023-06-29 08:00:00'), end: moment('2023-06-29 09:00:00') },
            { start: moment('2023-06-29 08:30:00'), end: moment('2023-06-29 09:30:00') },
            { start: moment('2023-06-29 09:00:00'), end: moment('2023-06-29 10:00:00') },
        ];
        console.log('Expected Timeslots:', expectedTimeslots);
        console.log('Generated Timeslots:', generatedTimeslots);

        expect(generatedTimeslots.length).toEqual(expectedTimeslots.length);
        for (let i = 0; i < expectedTimeslots.length; i++) {
            expect(generatedTimeslots[i].start.isSame(expectedTimeslots[i].start)).toEqual(true);
            expect(generatedTimeslots[i].end.isSame(expectedTimeslots[i].end)).toEqual(true);
        }
    });
});
