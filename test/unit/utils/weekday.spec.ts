import { weekdayToKey } from '../../../src/utils/weekday';

describe('weekdayToKey', () => {
    it('주어진 weekday값에 상응하는 key를 반환합니다', () => {
        const weekday = 1;
        const expectedKey = 'sun';

        const result = weekdayToKey(weekday);

        expect(result).toBe(expectedKey);
    });

    it('invalid weekday일때 error를 발생시킵니다', () => {
        const invalidWeekday = 8;

        expect(() => {
            weekdayToKey(invalidWeekday);
        }).toThrow('Invalid weekday!');
    });
});
