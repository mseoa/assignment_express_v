import moment from 'moment-timezone';
import TimeslotsService from '../../../src/services/timeslots.service';
import WorkhourRepository from '../../../src/repositories/workhour.repository';
import EventsRepository from '../../../src/repositories/events.repository';
import { weekdayToKey } from '../../../src/utils/weekday';
import { isConflictPeriod } from '../../../src/utils/isConflictPeriod';

/** Workhour repository, Events Repository Mockup */
jest.mock('../../../src/repositories/workhour.repository');
jest.mock('../../../src/repositories/events.repository');

describe('TimeslotsService', () => {
    let timeslotsService: TimeslotsService;
    let workhourRepository: WorkhourRepository;
    let eventsRepository: EventsRepository;

    beforeEach(() => {
        workhourRepository = new WorkhourRepository();
        eventsRepository = new EventsRepository();
        timeslotsService = new TimeslotsService(workhourRepository, eventsRepository);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('요청한 날짜에 해당하는 response로 나온다', async () => {
        workhourRepository.findWorkhoursByWeekday = jest
            .fn()
            .mockImplementation((yoil: number) => ({
                close_interval: 72000,
                is_day_off: false,
                key: weekdayToKey(yoil),
                open_interval: 36000,
                weekday: yoil,
            }));
        eventsRepository.findEventsOnTheDay = jest.fn().mockResolvedValue([]);

        const start_day_identifier = '20210506'; // 테스트하려는 날짜
        const timezone_identifier = 'Asia/Seoul'; // 테스트하려는 타임존
        const service_duration = 3600; // 테스트하려는 서비스 제공 시간
        const days = 3; // 테스트하려는 일수
        const timeslot_interval = 1800; // 테스트하려는 타임슬롯 간격
        const is_ignore_schedule = false; // 테스트하려는 스케줄 무시 여부
        const is_ignore_workhour = false; // 테스트하려는 근무 시간 무시 여부

        const result = await timeslotsService.getDayTimeTable(
            start_day_identifier,
            timezone_identifier,
            service_duration,
            days,
            timeslot_interval,
            is_ignore_schedule,
            is_ignore_workhour
        );

        expect(result.length).toBe(days);
        expect(result[0].timeslots).toHaveLength(17);
        expect(result[1].timeslots).toHaveLength(17);
        expect(result[2].timeslots).toHaveLength(17);

        result.forEach((dayTimetable, index) => {
            /** DayTimetable의 날짜들이 예상한 start_day_identifier와 일치하는지 확인 */
            const startOfDay = moment.unix(dayTimetable.start_of_day).format('YYYYMMDD');
            const expectedStartOfDay = moment(start_day_identifier, 'YYYYMMDD')
                .add(index, 'days')
                .format('YYYYMMDD');
            expect(startOfDay).toBe(expectedStartOfDay);

            /** timeslot의 첫번째 begin_at과 마지막 begin_at이 startOfDay와 일치하는 지 확인 */
            const timeslotsLength = dayTimetable.timeslots.length;
            const firstBeginAt = moment(dayTimetable.timeslots[0].begin_at * 1000).format(
                'YYYYMMDD'
            );
            expect(firstBeginAt).toBe(expectedStartOfDay);
            const lastBeginAt = moment(
                dayTimetable.timeslots[timeslotsLength - 1].begin_at * 1000
            ).format('YYYYMMDD');
            expect(lastBeginAt).toBe(expectedStartOfDay);

            /** service_duration 검증 */
            dayTimetable.timeslots.forEach((timeslot) => {
                expect(timeslot.end_at - timeslot.begin_at).toBe(service_duration);
            });

            /** timeslot_interval 검증 */
            for (let i = 1; i < dayTimetable.timeslots.length; i++) {
                const currentTimeslot = dayTimetable.timeslots[i];
                const previousTimeslot = dayTimetable.timeslots[i - 1];
                const interval = currentTimeslot.begin_at - previousTimeslot.begin_at;
                expect(interval).toBe(timeslot_interval);
            }
        });
    });

    it('일자별 휴무 설정 시 휴무일에는 빈 timeslot이 반환된다', async () => {
        workhourRepository.findWorkhoursByWeekday = jest
            .fn()
            .mockImplementation((yoil: number) => ({
                close_interval: 72000,
                is_day_off: yoil === 1 ? true : false, // sun = 휴무일
                key: weekdayToKey(yoil),
                open_interval: 36000,
                weekday: yoil,
            }));
        eventsRepository.findEventsOnTheDay = jest.fn().mockResolvedValue([]);

        const start_day_identifier = '20210508'; //09는 휴무일
        const timezone_identifier = 'Asia/Seoul';
        const service_duration = 3600;
        const days = 3;
        const timeslot_interval = 1800;
        const is_ignore_schedule = false;
        const is_ignore_workhour = false;

        const result = await timeslotsService.getDayTimeTable(
            start_day_identifier,
            timezone_identifier,
            service_duration,
            days,
            timeslot_interval,
            is_ignore_schedule,
            is_ignore_workhour
        );
        /** 휴무일과 휴무일이 아닌 날의 timeslot 갯수 비교, 휴무일에는 예약가능한 timeslot이 없어야 함 */
        expect(result.length).toBe(days);
        expect(result[0].timeslots).toHaveLength(17);
        expect(result[1].timeslots).toHaveLength(0); // 0509는 일요일
        expect(result[2].timeslots).toHaveLength(17);
    });

    it('Event가 있을 경우 예약 가능한 시간에서 빠진다', async () => {
        workhourRepository.findWorkhoursByWeekday = jest
            .fn()
            .mockImplementation((yoil: number) => ({
                close_interval: 72000,
                is_day_off: false,
                key: weekdayToKey(yoil),
                open_interval: 36000,
                weekday: yoil,
            }));
        eventsRepository.findEventsOnTheDay = jest.fn().mockResolvedValue([
            {
                begin_at: 1620441000, // Moment<2021-05-08T11:30:00+09:00>
                end_at: 1620469800, // Moment<2021-05-08T19:30:00+09:00>
                created_at: 1620272253,
                updated_at: 1620272253,
            },
        ]);

        const start_day_identifier = '20210508'; //테스트하려는 날짜
        const timezone_identifier = 'Asia/Seoul';
        const service_duration = 3600;
        const days = 1;
        const timeslot_interval = 1800;
        const is_ignore_schedule = false;
        const is_ignore_workhour = false;

        const result = await timeslotsService.getDayTimeTable(
            start_day_identifier,
            timezone_identifier,
            service_duration,
            days,
            timeslot_interval,
            is_ignore_schedule,
            is_ignore_workhour
        );
        /** 위에서 지정해준 event와 result로 반환된 timeslot중 충돌되는 구간이 있는지 재 검증 */
        result.forEach(async (dayTimetable, index) => {
            const isConflict = isConflictPeriod(
                moment(dayTimetable.timeslots[index].begin_at),
                moment(dayTimetable.timeslots[index].end_at),
                moment(1620441000 * 1000),
                moment(1620469800 * 1000)
            );
            expect(isConflict).toBe(false);
        });

        /** 15시에 예약 가능한 timeslot이 없는지 확인 */
        const isTimeslotAvailableAt15 = result.some((dayTimetable) => {
            const timeslot = dayTimetable.timeslots.find((timeslot) => {
                const beginAt = moment(timeslot.begin_at);
                const endAt = moment(timeslot.end_at);
                return beginAt.hours() <= 15 && endAt.hours() > 15;
            });
            return timeslot;
        });

        expect(isTimeslotAvailableAt15).toBe(false);
    });

    it('is_ignore_schedule true일 경우 이벤트 있는 날과 없는 날의 timeslot갯수가 같다', async () => {
        workhourRepository.findWorkhoursByWeekday = jest
            .fn()
            .mockImplementation((yoil: number) => ({
                close_interval: 72000,
                is_day_off: false,
                key: weekdayToKey(yoil),
                open_interval: 36000,
                weekday: yoil,
            }));
        eventsRepository.findEventsOnTheDay = jest.fn().mockResolvedValue([
            {
                begin_at: 1620268200, // Moment<2021-05-06T11:30:00+09:00>
                end_at: 1620275400, // Moment<2021-05-06T13:30:00+09:00>
                created_at: 1620272253,
                updated_at: 1620272253,
            },
            {
                begin_at: 1620275400, // Moment<2021-05-06T13:30:00+09:00>
                end_at: 1620275400, // Moment<2021-05-06T13:30:00+09:00>
                created_at: 1620272253,
                updated_at: 1620272253,
            },
            {
                begin_at: 1620276300, // Moment<2021-05-06T13:45:00+09:00>
                end_at: 1620275400, // Moment<2021-05-06T13:30:00+09:00>
                created_at: 1620272253,
                updated_at: 1620272253,
            },
        ]);

        const start_day_identifier = '20210506';
        const timezone_identifier = 'Asia/Seoul';
        const service_duration = 3600;
        const days = 2;
        const timeslot_interval = 1800;
        const is_ignore_schedule = true; // 예약한 시간 무시할 경우(is_ignore_schedule true)
        const is_ignore_workhour = false;

        const result = await timeslotsService.getDayTimeTable(
            start_day_identifier,
            timezone_identifier,
            service_duration,
            days,
            timeslot_interval,
            is_ignore_schedule,
            is_ignore_workhour
        );
        /** is_ignore_schedule true일 경우 이벤트 있는 날과 없는 날의 timeslot갯수가 같다 */
        expect(result[0].timeslots).toHaveLength(17);
        expect(result[1].timeslots).toHaveLength(17);
    });

    it('is_ignore_workhour true일때 휴무일과 open_interval이 고려되지 않는다', async () => {
        workhourRepository.findWorkhoursByWeekday = jest
            .fn()
            .mockImplementation((yoil: number) => ({
                close_interval: 72000,
                is_day_off: yoil === 1 ? true : false, // sun = 휴무일
                key: weekdayToKey(yoil),
                open_interval: 36000,
                weekday: yoil,
            }));
        eventsRepository.findEventsOnTheDay = jest.fn().mockResolvedValue([]);

        const start_day_identifier = '20210508'; // 테스트하려는 날짜 중 9일만 휴무일
        const timezone_identifier = 'Asia/Seoul';
        const service_duration = 3600;
        const days = 3;
        const timeslot_interval = 1800;
        const is_ignore_schedule = false;
        const is_ignore_workhour = true; // 휴무, 근무 시간 무시

        const result = await timeslotsService.getDayTimeTable(
            start_day_identifier,
            timezone_identifier,
            service_duration,
            days,
            timeslot_interval,
            is_ignore_schedule,
            is_ignore_workhour
        );
        /** is_ignore_workhour true일때 휴무일과 휴무하지 않는 날의 timeslot 갯수는 같다 */
        expect(result[0].timeslots).toHaveLength(47);
        expect(result[1].timeslots).toHaveLength(47); // 0509는 일요일
        /** is_ignore_workhour true일때 open_interval은 고려되지 않으므로 req의 start_day_identifier와 res의 start_of_day의 unix time은 같다*/
        result.forEach((dayTimetable, index) => {
            const startOfDay = dayTimetable.start_of_day;
            const expectedStartOfDay = moment(start_day_identifier).add(index, 'days').unix();
            expect(startOfDay).toBe(expectedStartOfDay);
        });
    });
});
