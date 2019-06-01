import { BaseRequestHandler, IExtendedHandlerInput, Intents, Request } from "@corux/ask-extensions";
import { IntentRequest, Response } from "ask-sdk-model";
import { DateTime } from "luxon";
import { document as AplMainDocument } from "../apl/main.json";
import { Losungen } from "../utils";

@Request("LaunchRequest")
@Intents("TodayIntent", "DateIntent")
export class LosungIntentHandler extends BaseRequestHandler {
  public async handle(handlerInput: IExtendedHandlerInput): Promise<Response> {
    const intentRequest = handlerInput.requestEnvelope.request as IntentRequest;
    const dateSlot = (intentRequest.intent && intentRequest.intent.slots || {}).date;

    // get requested date from slot or use today as fallback
    let date: DateTime = dateSlot && DateTime.fromISO(dateSlot.value);
    if (!date || !date.isValid) {
      date = DateTime.local();
    }

    const instance = new Losungen();
    const losung = await instance.getLosung(date);
    const losungText = await instance.getText(date);
    return handlerInput.getResponseBuilder()
      .speak(losungText)
      .addAplDirectiveIfSupported({
        datasources: {
          data: {
            lehrtext: {
              text: this.fixText(losung.Lehrtext),
              verse: losung.Lehrtextvers,
            },
            losung: {
              text: this.fixText(losung.Losungstext),
              verse: losung.Losungsvers,
            },
            subtitle: losung.Sonntag,
            title: `Die Losung für ${date.toFormat("dd.MM.yyyy")}`,
          },
        },
        document: AplMainDocument,
        token: "losung",
        type: "Alexa.Presentation.APL.RenderDocument",
      })
      .getResponse();
  }

  private fixText(text: string): string {
    // replace #value# with <b>value</b>
    text = text.replace(/#([^#]*)#/g, "<b>$1</b>");

    // replace /value/ with <i>value</i>
    text = text.replace(/\/([^\/]*)\//g, "<i>$1</i>");

    return text;
  }
}
