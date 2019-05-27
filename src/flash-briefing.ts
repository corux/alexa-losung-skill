import { Handler } from "aws-lambda";
import { DateTime } from "luxon";
import { Losungen } from "./utils";

const handler: Handler = async () => {
  const now = DateTime.local().setZone("Europe/Berlin");
  const today = DateTime.utc(now.year, now.month, now.day);

  const text = await new Losungen().getText(today);
  return {
    mainText: text,
    redirectionUrl: "http://www.losungen.de/fileadmin/media-losungen/kalender/kalendermobil.html",
    titleText: "Die Losung von heute",
    uid: today.toISO(),
    updateDate: today.toISO(),
  };
};

export { handler };
