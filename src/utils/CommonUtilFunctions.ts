import * as moment from "moment";
export const capitalizeFirstLetter = (value: string) => {
  return value.charAt(0).toUpperCase() + value.substring(1);
};

export const formatTime = (date: string) => {
  return moment.default(date).format("DD-MM-YYYY hh:mm A");
};
