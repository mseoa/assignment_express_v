import moment, { Moment } from 'moment';

export function generateTimeSlots(start: Moment, finish: Moment, interval: number, duration: number) {
    const current = start;
    const timeslots: { start: Moment, end: Moment }[] = [];
    while (current.clone().add(duration, 'seconds') <= finish) {
        timeslots.push({
            start: current.clone(),
            end: current.clone().add(duration, 'seconds'),
        })
        current.add(interval, 'seconds');
    }
    return timeslots;
}

/*
console.log(
    generateTimeSlots(
        moment('20230621').add(36000, 'seconds'), 
        moment('20230621').add(72000, 'seconds'), 
        60*15,
        60*30,
    )
)
*/