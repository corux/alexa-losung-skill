import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, Intents } from "../utils";

@Intents("AMAZON.HelpIntent")
export class AmazonHelpIntentHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    return handlerInput.responseBuilder
      .speak("Mit diesem Skill kannst du dir die Losung von heute vorlesen lassen.")
      .reprompt("Frage mich nach der Losung von heute.")
      .getResponse();
  }
}
