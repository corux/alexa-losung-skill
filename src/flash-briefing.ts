import { Handler } from "aws-lambda";
import { DateTime, Settings } from "luxon";
import { Losungen } from "./utils";

const handler: Handler = async () => {
  Settings.defaultZoneName = "Europe/Berlin";
  const now = DateTime.local();
  const today = DateTime.utc(now.year, now.month, now.day);

  const text = await new Losungen().getText(today);
  return {
    mainText: text,
    redirectionUrl: "https://www.losungen.de/fileadmin/media-losungen/kalender/kalendermobil.html",
    titleText: "Die Losung von heute",
    uid: today.toISO(),
    updateDate: today.toISO(),
  };
};

export { handler };
