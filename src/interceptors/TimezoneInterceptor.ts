import { HandlerInput, RequestInterceptor } from "ask-sdk-core";
import { Settings } from "luxon";

/** Configures Luxon to use the devices timezone instead of UTC. */
export class TimezoneInterceptor implements RequestInterceptor {

  private static cache: { [deviceId: string]: string } = {};

  public async process(handlerInput: HandlerInput) {
    const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId;

    if (!deviceId) {
      return;
    }

    try {
      if (!TimezoneInterceptor.cache[deviceId]) {
        const upsServiceClient = handlerInput.serviceClientFactory.getUpsServiceClient();
        TimezoneInterceptor.cache[deviceId] = await upsServiceClient.getSystemTimeZone(deviceId);
      }

      const timezone = TimezoneInterceptor.cache[deviceId];
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
