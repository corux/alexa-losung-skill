import { getDateWithoutTime, Losungen } from "./utils";

export const handler = async (event, context, callback) => {
  const today = getDateWithoutTime(new Date());
  const text = await new Losungen().getText(today);
  callback(null, {
    mainText: text,
    redirectionUrl: "http://www.losungen.de/fileadmin/media-losungen/kalender/kalendermobil.html",
    titleText: "Die Losung von heute",
    uid: today.toISOString(),
    updateDate: today.toISOString(),
  });
};
