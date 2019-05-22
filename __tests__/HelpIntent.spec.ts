import { VirtualAlexa } from "virtual-alexa";
import { handler } from "../src";

describe("AMAZON.HelpIntent", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = VirtualAlexa.Builder()
      .handler(handler)
      .interactionModelFile("models/de-DE.json")
      .create();
  });

  it("should provide help message", async () => {
    const result = await alexa.request().intent("AMAZON.HelpIntent").send();
    expect(result.response.outputSpeech.ssml).toContain("die Losung von heute vorlesen");
    expect(result.response.shouldEndSession).toBe(false);
  });
});
