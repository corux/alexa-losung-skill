import { parse } from "fast-xml-parser";

export function getDateWithoutTime(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

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

  /** Gets the text, which should be read for the given date. */
  public async getText(date: Date): Promise<string> {
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
  public async getLosung(date: Date): Promise<ILosung> {
    const data = await this.loadLosung(date.getFullYear());
    const dateString = date.toISOString().split("T")[0] + "T00:00:00";
    return data.find((n) => n.Datum === dateString);
  }

  private async loadLosung(year: number): Promise<ILosung[]> {
    const xmlString = await import(`../data/${year}.xml`);
    const data: { FreeXml: { Losungen: ILosung[] } } = parse(xmlString.default || xmlString);
    if (data && data.FreeXml && data.FreeXml.Losungen) {
      return data.FreeXml.Losungen;
    }

    throw new Error("Failed to load data");
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

  private getSpokenDate(date: Date): string {
    const today = new Date();
    const yesterday = new Date();
    const tomorrow = new Date();
    yesterday.setDate(today.getDate() - 1);
    tomorrow.setDate(today.getDate() + 1);

    switch (date.toDateString()) {
      case today.toDateString():
        return "von heute";
      case yesterday.toDateString():
        return "von gestern";
      case tomorrow.toDateString():
        return "für morgen";
      default:
        return `vom ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    }
  }
}
