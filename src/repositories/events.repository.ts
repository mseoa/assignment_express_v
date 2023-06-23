import {events} from '../data/data';

class EventsRepository {

    findEventsOnTheDay = async (start: number, end: number) => {
        return events.filter((el) => 
            el.begin_at >= start && 
            el.begin_at <= end &&
            el.end_at >= el.begin_at
        )
    }
}


export default EventsRepository;