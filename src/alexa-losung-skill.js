import { Skill, Launch, Intent, SessionEnded } from 'alexa-annotations';
import { say, ask } from 'alexa-response';
import ssml from 'alexa-ssml-jsx';

@Skill
export default class AlexaLosungSkill {

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

  _createResponse(date) {
    try {
      const losung = this._getLosung(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const spokenDate = isToday ? 'von heute' :
        `vom ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
      return say(<speak>
        <p>Die Losung {spokenDate} steht in {this._includeVerse(losung.Losungsvers) }</p>
        <p>{losung.Losungstext}</p>
        <p>Der Lehrtext steht in {this._includeVerse(losung.Lehrtextvers) }</p>
        <p>{losung.Lehrtext}</p>
      </speak>);
    } catch (e) {
      const dateString = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
      return say(`Ich konnte keine Losung für den ${dateString} finden.`);
    }
  }

  @Launch
  launch() {
    return this._createResponse(new Date());
  }

  @Intent('TodayIntent')
  todayIntent() {
    return this._createResponse(new Date());
  }

  @Intent('DateIntent')
  dateIntent({ date }) {
    // check for invalid date
    if (Number.isNaN(Date.parse(date))) {
      return this.todayIntent();
    }

    return this._createResponse(new Date(date));
  }

  @Intent('AMAZON.HelpIntent')
  help() {
    return ask('Mit diesem Skill kannst du dir die Losung von heute vorlesen lassen.')
      .reprompt('Frage mich nach der Losung von heute.');
  }

  @Intent('AMAZON.CancelIntent', 'AMAZON.StopIntent')
  stop() {
    return say('Bis bald!');
  }

  @SessionEnded
  sessionEnded() {
    // need to handle session ended event to circumvent error
    return {};
  }

}
