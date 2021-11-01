import { addMinutes, format, isToday, isTomorrow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatMinutes = (minutes: number) =>
  minutes < 10 ? '0' + minutes : minutes;

export const getRound5Date = () => {
  const d = new Date();
  return new Date(new Date(d).setMinutes(Math.ceil(d.getMinutes() / 5) * 5));
};

export const getFormateDate = (date: number | Date) => {
  if (isToday(date)) {
    return "aujourd'hui à " + format(date, 'HH:mm', { locale: fr });
  } else if (isTomorrow(date)) {
    return 'demain à' + format(date, 'HH:mm', { locale: fr });
  } else {
    return format(date, 'eeee à HH:mm', { locale: fr });
  }
};

export const getFormattedTime = (date: number | Date) =>
  format(date, 'HH:mm', { locale: fr });

export const getFormattedTimeArrival = (date: Date, duration: number) =>
  getFormattedTime(addMinutes(date, duration));
