import { BaseRequestHandler, Intents } from "@corux/ask-extensions";
import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

@Intents("AMAZON.CancelIntent", "AMAZON.StopIntent")
export class AmazonStopIntentHandler extends BaseRequestHandler {
  public handle(handlerInput: HandlerInput): Response {
    return handlerInput.responseBuilder
      .speak("Bis bald!")
      .withShouldEndSession(true)
      .getResponse();
  }
}
