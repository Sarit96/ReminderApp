import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'calendarDay', standalone: true })
export class CalendarDayPipe implements PipeTransform {
  transform(reminders: any[], date: Date): any[] {
    return reminders.filter(reminder => {
      if (!reminder.datetime) return false;
      const rDate = new Date(reminder.datetime);
      return rDate.getFullYear() === date.getFullYear() &&
        rDate.getMonth() === date.getMonth() &&
        rDate.getDate() === date.getDate();
    });
  }
} 