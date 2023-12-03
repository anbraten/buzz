import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function timeAgo(date: Date | string | number) {
  return dayjs().to(dayjs(date));
}
