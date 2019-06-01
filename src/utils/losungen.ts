import { parse } from "fast-xml-parser";
import * as fs from "fs";
import { DateTime, Duration } from "luxon";
import * as path from "path";

interface ILosung {
  Datum: string;
  Wtag: string;
  Sonntag: string;
  Losungstext: string;
  Losungsvers: string;
  Lehrtext: string;
  Lehrtextvers: string;
}

export class Losungen {

  private static cache: { [year: number]: ILosung[] } = {};

  /** Gets the text, which should be read for the given date. */
  public async getText(date: DateTime): Promise<string> {
    const spokenDate = this.getSpokenDate(date);
    try {
      const losung = await this.getLosung(date);
      let sunday = "";
      if (losung.Sonntag) {
        sunday = `, ${this.fixTextForSpeak(this.fixVerseForSpeak(losung.Sonntag))}, `;
      }

      // need to use "!" as long pause after the verse, as "." will not be handled correctly
      return `Die Losung ${spokenDate}${sunday} steht in ${this.fixVerseForSpeak(losung.Losungsvers)}!
        ${this.fixTextForSpeak(losung.Losungstext)}
        Der Lehrtext steht in ${this.fixVerseForSpeak(losung.Lehrtextvers)}!
        ${this.fixTextForSpeak(losung.Lehrtext)}`;
    } catch (e) {
      return `Ich konnte keine Losung ${spokenDate} finden.`;
    }
  }

  /** Gets the losung object for the given date. */
  public async getLosung(date: DateTime): Promise<ILosung> {
    const data = await this.loadLosung(date.year);
    const dateString = date.toFormat("yyyy-MM-dd'T00:00:00'");
    return data.find((n) => n.Datum === dateString);
  }

  private async loadLosung(year: number): Promise<ILosung[]> {
    if (!Losungen.cache[year]) {
      const file = path.resolve(__dirname, `./data/${year}.xml`);
      const xmlString = fs.readFileSync(file).toString();
      const data: { FreeXml: { Losungen: ILosung[] } } = parse(xmlString);
      Losungen.cache[year] = data.FreeXml.Losungen;
    }

    return Losungen.cache[year];
  }

  private fixVerseForSpeak(text: string): string {
    // replace 1.Samuel with 1. Samuel
    text = text.replace(/([0-9]+\.)([a-zA-Z])/, "$1 $2");

    // replace 1. Könige 2,1-2.3 with 1. Könige 2,1-3
    text = text.replace(/([0-9]+)\-([0-9]+)\.([0-9]+)/, "$1-$3");

    // replace Psalm 136,3.4 with Psalm 136,3-4
    text = text.replace(/([0-9]+),([0-9]+)\.([0-9]+)/, "$1,$2-$3");

    // replace Psalm 136,3-4 with Psalm 136 Vers 3-4
    text = text.replace(/,([^,]*)$/, " Vers $1");

    return text;
  }

  private fixTextForSpeak(text: string): string {
    // replace #value# with value
    text = text.replace(/#([^#]*)#/g, "$1");

    // replace /value/ with value
    text = text.replace(/\/([^\/]*)\//g, "$1");

    // Fix pronounciation of words
    text = text.replace("Passionszeit", "Passion-szeit");

    return text;
  }

  private getSpokenDate(date: DateTime): string {
    const today = DateTime.local();
    const oneDay = Duration.fromISO("P1D");
    const yesterday = today.minus(oneDay);
    const tomorrow = today.plus(oneDay);

    switch (date.toISODate()) {
      case today.toISODate():
        return "von heute";
      case yesterday.toISODate():
        return "von gestern";
      case tomorrow.toISODate():
        return "für morgen";
      default:
        return `vom ${date.toFormat("d.M.yyyy")}`;
    }
  }
}
