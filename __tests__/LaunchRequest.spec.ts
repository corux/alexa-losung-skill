import { VirtualAlexa } from "virtual-alexa";
import { handler } from "../src";

describe("LaunchRequest", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = VirtualAlexa.Builder()
      .handler(handler)
      .interactionModelFile("models/de-DE.json")
      .create();
  });

  it("should tell today's losung", async () => {
    const result = await alexa.launch();

    expect(result.response.outputSpeech.ssml).toContain("Die Losung von heute");
  });
});
