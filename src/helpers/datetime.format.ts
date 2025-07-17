import moment from 'moment';
import { DATE_FORMAT } from 'src/constants';

export const convertToTimeStampPostgres = (
  date: string,
  dateFormat: DATE_FORMAT = DATE_FORMAT.TIME_STAMP,
) => {
  try {
    return moment(date).format(dateFormat);
  } catch (e) {
    throw e;
  }
};

export const convertDate = (
  date: string,
  dateFormat: DATE_FORMAT = DATE_FORMAT.TIME_STAMP,
) => {
  try {
    if (!date) {
      return null;
    }
    const momentDate = moment(date, dateFormat);
    if (!momentDate.isValid()) {
      console.log(`Invalid date: ${date} with format ${dateFormat}`);
      return null;
    }
    return momentDate;
  } catch (e) {
    console.log(e);
    return null;
  }
};
