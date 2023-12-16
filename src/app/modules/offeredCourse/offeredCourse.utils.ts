import { TSchedule } from './offeredCourse.interface';

export const hasTimeConflict = (
    assignedSchedules: TSchedule[],
    newSchedule: TSchedule,
) => {
    for (const schedule of assignedSchedules) {
        const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
        const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
        const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
        const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);

        // 10:30 - 12:30 ==> already existing schedule

        // 09:00 - 11:30 ==> want to add new schedule (Conflict)
        // 09:00 < 12:30
        // 11:30 > 10:30

        // 11:00 - 13:00 ==> want to add new schedule (Conflict)
        // 10:00 < 12:30
        // 13:00 > 10:30

        if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
            return true;
        }
    }

    return false;
};
