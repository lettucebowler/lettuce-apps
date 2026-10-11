import { CalendarDate, parseDate } from '@internationalized/date';
import type { Transport } from '@sveltejs/kit/hooks';

export const transport: Transport = {
  CalendarDate: {
    encode: (value: CalendarDate) => {
      if (!(value instanceof CalendarDate)) {
        return false;
      }
      return value.toString();
    },
    decode: (dateString) => {
      return parseDate(dateString);
    },
  },
};
