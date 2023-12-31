# 🗂️ 파일 구조

```
📦 assignment_express_v
├─ .prettierrc.js
├─ README.md
├─ jest.config.js
├─ package-lock.json
├─ package.json
├─ src
│  ├─ app.ts
│  ├─ controllers
│  │  └─ timeslots.controller.ts
│  ├─ data
│  │  └─ data.ts
│  ├─ middlewares
│  │  └─ errorhandler.ts
│  ├─ repositories
│  │  ├─ events.repository.ts
│  │  └─ workhour.repository.ts
│  ├─ routes
│  │  ├─ index.ts
│  │  └─ timeslots.route.ts
│  ├─ schemas
│  │  └─ getTimeSlotReqSchema.ts
│  ├─ services
│  │  └─ timeslots.service.ts
│  ├─ types
│  │  └─ getTimeSlot.type.ts
│  └─ utils
│     ├─ generateTimeslots.ts
│     ├─ isConflictPeriod.ts
│     └─ weekday.ts
├─ test
│  └─ unit
│     ├─ services
│     │  └─ timeslots.service.spec.ts
│     └─ utils
│        ├─ generateTimeslots.spec.ts
│        ├─ isConflictPeriod.spec.ts
│        └─ weekday.spec.ts
└─ tsconfig.json
```
©generated by [Project Tree Generator](https://woochanleee.github.io/project-tree-generator)

---
# 🧐 주요 함수 설명


## `getDayTimeTable` [(소스코드)](https://github.com/mseoa/assignment_express_v/blob/48a4913c0f1137963af8d37b0a964c7ad731f5c3/src/services/timeslots.service.ts#L14)
시작일부터 지정된 일 수까지의 일정을 생성합니다. 각 일정에는 시간대(time slot) 목록이 포함됩니다.
```ts
src/services/timeslots.service.ts

getDayTimeTable(
  start_day_identifier: string,
  timezone_identifier: string,
  service_duration: number,
  days: number,
  timeslot_interval: number,
  is_ignore_schedule: boolean,
  is_ignore_workhour: boolean
): Promise<DayTimetable[]>

```
### 매개변수 
* `start_day_identifier` (string): 시작일을 나타내는 날짜 식별자입니다.
* `timezone_identifier` (string): 요청하는 타임존에 따라 날짜의 구분이 변경됩니다.
* `service_duration` (number): 서비스 제공 시간을 초 단위로 나타냅니다.
* `days` (number): 시작일을 기준으로 반환할 일 수를 결정합니다.
* `timeslot_interval` (number): 시간대(time slot) 간격을 분 단위로 나타냅니다.
* `is_ignore_schedule` (boolean): 해당 기간에 이미 존재하는 이벤트를 무시할지 여부를 결정합니다.
* `is_ignore_workhour` (boolean): 해당 기간에 사롱에 설정된 영업시간을 무시하고 하루 전체를 기간으로 설정할지 여부를 결정합니다.

### 반환값
* `Promise<DayTimetable[]>`: 일일 일정 목록을 포함하는 Promise입니다.


---

## `generateTimeSlots` [(소스코드)](https://github.com/mseoa/assignment_express_v/blob/48a4913c0f1137963af8d37b0a964c7ad731f5c3/src/utils/generateTimeslots.ts#L3)
주어진 시작 시간부터 종료 시간까지 지정된 간격과 지속 시간을 기반으로 시간대(time slot) 목록을 생성합니다.
```ts
src/utils/generateTimeSlots.ts

generateTimeSlots(
  start: Moment,
  finish: Moment,
  interval: number,
  duration: number
): { start: Moment; end: Moment }[]
```
### 매개변수 
- `start` (Moment): time slot의 시작 시간입니다.
- `finish` (Moment): time slot의 종료 시간입니다.
- `interval` (number): 시간대(time slot) 간격을 초 단위로 나타냅니다.
- `duration` (number): 서비스 제공 시간을 초 단위로 나타냅니다.

### 반환값
* `{ start: Moment; end: Moment }[]`: 시간대(time slot) 목록을 포함하는 배열입니다.
---
## `isConflictPeriod` [(소스코드)](https://github.com/mseoa/assignment_express_v/blob/48a4913c0f1137963af8d37b0a964c7ad731f5c3/src/utils/isConflictPeriod.ts#L3)
주어진 시간대(time slot)와 이벤트의 시작 및 종료 시간을 비교하여 충돌 여부를 확인합니다.
```ts
src/utils/isConflictPeriod.ts

isConflictPeriod(
  timeslotStart: Moment,
  timeslotEnd: Moment,
  eventStart: Moment,
  eventEnd: Moment
): boolean
```
### 매개변수 
- `timeslotStart` (Moment): 시간대(time slot)의 시작 시간입니다.
- `timeslotEnd` (Moment): 시간대(time slot)의 종료 시간입니다.
- `eventStart` (Moment): 이벤트의 시작 시간입니다.
- `eventEnd` (Moment): 이벤트의 종료 시간입니다.

### 반환값
* `boolean`: 충돌 여부를 나타내는 boolean 값입니다. 충돌이 있을 경우 true를 반환하고, 그렇지 않으면 false를 반환합니다.

---
## `findEventsOnTheDay` [(소스코드)](https://github.com/mseoa/assignment_express_v/blob/48a4913c0f1137963af8d37b0a964c7ad731f5c3/src/repositories/events.repository.ts#L4)
주어진 시작 시간과 종료 시간 사이의 해당 날짜에 있는 이벤트를 검색합니다.
```ts
src/repositories/events.repository.ts

findEventsOnTheDay(start: number, end: number): Promise<Event[]>
```
### 매개변수 
- `start` (number): 검색할 기간의 시작 시간(unix timestamp)입니다.
- `end` (number): 검색할 기간의 종료 시간(unix timestamp)입니다.

### 반환값
* `Promise<Event[]>`: 해당 날짜에 있는 이벤트 객체의 배열을 반환합니다.

---
## `findWorkhoursByWeekday` [(소스코드)](https://github.com/mseoa/assignment_express_v/blob/48a4913c0f1137963af8d37b0a964c7ad731f5c3/src/repositories/workhour.repository.ts#L4)
주어진 요일에 해당하는 근무 시간 데이터를 검색합니다.
```ts
src/repositories/workhour.repository.ts

findWorkhoursByWeekday(yoil: number): Promise<Workhour | undefined>
```
### 매개변수 
- `yoil` (number): 검색할 요일을 나타내는 값입니다.

### 반환값
* `Promise<Workhour | undefined>`: 주어진 요일에 해당하는 근무 시간 데이터를 반환합니다. 데이터를 찾지 못한 경우 undefined를 반환합니다.

---

# 🧐 유닛 테스트
| Spec file | Case | 입력 | 기대 결과 | 예상되는 동작 |
|---|---|---|---|---|
| [timeslots.service.spec](https://github.com/mseoa/assignment_express_v/blob/48a4913c0f1137963af8d37b0a964c7ad731f5c3/test/unit/services/timeslots.service.spec.ts#L12) | 요청한 날짜에 해당하는 response로 나온다 | 특정 날짜 | 해당 날짜에 대한 timeslot 반환 | 주어진 날짜에 해당하는 timeslot을 생성하여 반환 |
|  | 일자별 휴무 설정 시 휴무일에는 빈 timeslot이 반환된다 | 특정 날짜, 휴일 정보 | 해당 날짜가 휴일이므로 빈 시간표 반환 | 주어진 날짜가 휴일인지 확인하고, 휴일인 경우 빈 timeslot을 반환 |
|  | Event가 있을 경우 예약 가능한 시간에서 빠진다 | 특정 날짜, 이벤트 정보 | 주어진 이벤트와 겹치는 시간을 제외하고 timeslot 반환 | 주어진 날짜에 해당하는 timeslot을 생성하고, 중복된 이벤트가 있는 경우 이를 제외한 시간표를 반환 |
|  | is_ignore_schedule일 경우 이벤트 있는 날과 없는 날의 timeslot갯수가 같다 | is_ignore_schedule `true` | 이벤트가 있는 날과 없는 날의 timeslot 갯수가 동일 | 이벤트가 있는 날과 없는 날의 timeslot 갯수가 동일하게 반환 |
|  | is_ignore_workhour일때 휴무일과 open_interval이 고려되지 않는다 | is_ignore_workhour `true` | 휴무일과 근무 시간을 무시한 timeslot 반환 | 주어진 날짜에 해당하는 timeslot을 생성할 때, 휴무일과 근무 시간을 고려하지 않고 반환 |
| [generateTimeslots.service.spec](https://github.com/mseoa/assignment_express_v/blob/48a4913c0f1137963af8d37b0a964c7ad731f5c3/test/unit/utils/generateTimeslots.spec.ts#L4) | interval과 duration을 고려해서 start부터 finish 사이의 timeslot을 만든다 | start, finish, interval, duration | start와 finish 사이의 시간 범위에서 interval과 duration을 고려하여 timeslot을 생성 | 예상되는 Timeslot 갯수와 생성된 Timeslot 개수 일치 |
| [isConflictPeriod.spec](https://github.com/mseoa/assignment_express_v/blob/48a4913c0f1137963af8d37b0a964c7ad731f5c3/test/unit/utils/isConflictPeriod.spec.ts#L4) | timeslot과 event가 겹칠때 true를 반환 | `08:00~09:00`, `08:30~09:30` | return true |  |
|  | timeslot과 event가 겹치지 않을때 false를 반환 | `08:00~09:00`, `09:30~10:00` | return false |  |
|  | 이벤트가 timeslot을 포괄할 때 true를 반환 | `08:00~09:00`, `07:30~09:30` | return true |  |
| [weekday.spec](https://github.com/mseoa/assignment_express_v/blob/48a4913c0f1137963af8d37b0a964c7ad731f5c3/test/unit/utils/weekday.spec.ts) | 주어진 weekday값에 상응하는 key를 반환 | 1 | sun |  |
|  | invalid weekday일때 error를 발생 | 8 | throw Error |  |