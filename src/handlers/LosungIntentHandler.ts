import { HandlerInput } from "ask-sdk-core";
import { IntentRequest, Response } from "ask-sdk-model";
import { BaseIntentHandler, Intents, Losungen, Request } from "../utils";

@Request("LaunchRequest")
@Intents("TodayIntent", "DateIntent")
export class LosungIntentHandler extends BaseIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const intentRequest = handlerInput.requestEnvelope.request as IntentRequest;
    const dateSlot = intentRequest.intent && intentRequest.intent.slots.date;

    // get requested date from slot or use today as fallback
    const timestamp = dateSlot && Date.parse(dateSlot.value) || new Date().getTime();
    const date = new Date(timestamp);

    const losung = await new Losungen().getText(date);
    return handlerInput.responseBuilder
      .speak(losung)
      .getResponse();
  }
}
