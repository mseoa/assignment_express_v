import { workhours } from '../data/data';

class WorkhourRepository {
    findWorkhoursByWeekday = async (yoil: number) => {
        return workhours.find((el) => el.weekday == yoil);
    };
}

export default WorkhourRepository;
