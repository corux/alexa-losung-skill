import { Skill, Launch, Intent, SessionEnded } from 'alexa-annotations';
import { say, ask } from 'alexa-response';
import Losungen from './losungen';

@Skill
export default class AlexaLosungSkill {

  _createResponse(date) {
    return say(new Losungen().getText(date));
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
