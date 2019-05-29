import { DefaultApiClient, SkillBuilders } from "ask-sdk-core";
import {
  AmazonHelpIntentHandler,
  AmazonStopIntentHandler,
  CustomErrorHandler,
  LosungIntentHandler,
  SessionEndedHandler,
} from "./handlers";
import { LogInterceptor, TimezoneInterceptor } from "./interceptors";

export const handler = SkillBuilders.custom()
  .addRequestHandlers(
    new AmazonStopIntentHandler(),
    new AmazonHelpIntentHandler(),
    new SessionEndedHandler(),
    new LosungIntentHandler(),
  )
  .addErrorHandlers(
    new CustomErrorHandler(),
  )
  .addRequestInterceptors(
    new LogInterceptor(),
    new TimezoneInterceptor(),
  )
  .addResponseInterceptors(
    new LogInterceptor(),
  )
  .withApiClient(new DefaultApiClient())
  .lambda();
