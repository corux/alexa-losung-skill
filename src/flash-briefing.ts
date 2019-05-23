import { Handler } from "aws-lambda";
import { getDateWithoutTime, Losungen } from "./utils";

const handler: Handler = async () => {
  const today = getDateWithoutTime(new Date());
  const text = await new Losungen().getText(today);
  return {
    mainText: text,
    redirectionUrl: "http://www.losungen.de/fileadmin/media-losungen/kalender/kalendermobil.html",
    titleText: "Die Losung von heute",
    uid: today.toISOString(),
    updateDate: today.toISOString(),
  };
};

export { handler };
