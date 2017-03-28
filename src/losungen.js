import ssml from 'alexa-ssml-jsx';

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

  _includeVerse(text) {
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
      return <speak>
        <p>Die Losung {spokenDate} steht in {this._includeVerse(losung.Losungsvers) }</p>
        <p>{losung.Losungstext}</p>
        <p>Der Lehrtext steht in {this._includeVerse(losung.Lehrtextvers) }</p>
        <p>{losung.Lehrtext}</p>
      </speak>;
    } catch (e) {
      return `Ich konnte keine Losung ${spokenDate} finden.`;
    }
  }
}
