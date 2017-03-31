export default class Losungen {
  _getLosung(date) {
    const data = require(`../assets/${date.getFullYear()}.xml`);
    if (data && data.FreeXml) {
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const dateString = `${date.getFullYear()}-${month}-${day}T00:00:00`;
      return data.FreeXml.Losungen.find(n => n.Datum === dateString);
    }

    throw new Error('Failed to load data');
  }

  _fixVerseForSpeak(text) {
    // replace 1.Samuel with 1. Samuel
    text = text.replace(/^([0-9]+\.)([a-zA-Z])/, '$1 $2');

    // replace Psalm 136,3.4 with Psalm 136,3-4
    const verse = text.substring(text.lastIndexOf(',') + 1);
    text = text.replace(verse, verse.replace('.', '-'));

    // replace Psalm 136,3-4 with Psalm 136 Vers 3-4
    return text.replace(/,([^,]*)$/, ' Vers ' + '$1');
  }

  /**
   * Gets the text, which should be read for the given date.
   */
  getText(date) {
    const isToday = date.toDateString() === new Date().toDateString();
    const spokenDate = isToday ? 'von heute' :
      `vom ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    try {
      const losung = this._getLosung(date);
      // need to use "!" as long pause after the verse, as "." will not be handled correctly
      return `Die Losung ${spokenDate} steht in ${this._fixVerseForSpeak(losung.Losungsvers)}!
        ${losung.Losungstext}
        Der Lehrtext steht in ${this._fixVerseForSpeak(losung.Lehrtextvers)}!
        ${losung.Lehrtext}`;
    } catch (e) {
      return `Ich konnte keine Losung ${spokenDate} finden.`;
    }
  }
}
