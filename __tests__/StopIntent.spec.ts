import { VirtualAlexa } from "virtual-alexa";
import { handler } from "../src";

describe("AMAZON.StopIntent", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = VirtualAlexa.Builder()
      .handler(handler)
      .interactionModelFile("models/de-DE.json")
      .create();
  });

  it("should reply and stop the skill on stop", async () => {
    const result = await alexa.request().intent("AMAZON.StopIntent").send();
    expect(result.response.outputSpeech.ssml).toContain("Bis bald");
    expect(result.response.shouldEndSession).toBe(true);
  });

  it("should reply and stop the skill on cancel", async () => {
    const result = await alexa.request().intent("AMAZON.CancelIntent").send();
    expect(result.response.outputSpeech.ssml).toContain("Bis bald");
    expect(result.response.shouldEndSession).toBe(true);
  });
});
