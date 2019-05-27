import { HandlerInput, RequestInterceptor } from "ask-sdk-core";
import { Settings } from "luxon";

/** Configures Luxon to use the devices timezone instead of UTC. */
export class TimezoneInterceptor implements RequestInterceptor {
  public async process(handlerInput: HandlerInput) {
    const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId;

    if (!handlerInput.serviceClientFactory) {
      return;
    }

    try {
      const timezone = await handlerInput.serviceClientFactory.getUpsServiceClient().getSystemTimeZone(deviceId);
      Settings.defaultZoneName = timezone;
      console.log("Configured timezone for request:", {
        deviceId,
        timezone,
      });
    } catch (e) {
      console.log("Unable to determine device timezone.", e);
    }
  }
}
