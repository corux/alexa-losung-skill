import { HandlerInput } from "ask-sdk-core";
import { IntentRequest, Response } from "ask-sdk-model";
import { document as AplMainDocument } from "../apl/main.json";
import { BaseIntentHandler, getResponseBuilder, Intents, Losungen, Request } from "../utils";

@Request("LaunchRequest")
@Intents("TodayIntent", "DateIntent")
export class LosungIntentHandler extends BaseIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const intentRequest = handlerInput.requestEnvelope.request as IntentRequest;
    const dateSlot = intentRequest.intent && intentRequest.intent.slots.date;

    // get requested date from slot or use today as fallback
    const timestamp = dateSlot && Date.parse(dateSlot.value) || new Date().getTime();
    const date = new Date(timestamp);

    const instance = new Losungen();
    const losung = await instance.getLosung(date);
    const losungText = await instance.getText(date);
    return getResponseBuilder(handlerInput)
      .speak(losungText)
      .addAplDirectiveIfSupported({
        datasources: {
          data: {
            lehrtext: {
              text: losung.Lehrtext,
              verse: losung.Lehrtextvers,
            },
            losung: {
              text: losung.Losungstext,
              verse: losung.Losungsvers,
            },
            subtitle: losung.Wtag,
            title: losung.Datum,
          },
        },
        document: AplMainDocument,
        token: "losung",
        type: "Alexa.Presentation.APL.RenderDocument",
      })
      .getResponse();
  }
}
