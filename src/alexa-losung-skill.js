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

  _createResponse(date) {
    try {
      const losung = this._getLosung(date);
      return say(<speak>
        <p>Die Losung von heute steht in {losung.Losungsvers}. {losung.Losungstext}</p>
        <p>Der Lehrtext steht in {losung.Lehrtextvers}. {losung.Lehrtext}</p>
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
  today() {
    return this._createResponse(new Date());
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
