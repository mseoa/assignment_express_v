const weekdayToKeyMap: Record<number, string> = {
    1: 'sun',
    2: 'mon',
    3: 'tue',
    4: 'wed',
    5: 'thu',
    6: 'fri',
    7: 'sat',
};

export function weekdayToKey(weekday: number) {
    if (!weekdayToKeyMap[weekday]) throw new Error('Invalid weekday!');
    return weekdayToKeyMap[weekday];
}
