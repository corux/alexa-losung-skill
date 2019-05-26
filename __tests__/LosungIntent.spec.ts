import { VirtualAlexa } from "virtual-alexa";
import { handler } from "../src";

describe("DateIntent", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = VirtualAlexa.Builder()
      .handler(handler)
      .interactionModelFile("models/de-DE.json")
      .create();
  });

  it("should tell today's losung, if no slot value was given", async () => {
    const result = await alexa.request().intent("DateIntent").send();
    expect(result.response.outputSpeech.ssml).toContain("Die Losung von heute");
  });

  it("should tell today's losung, if slot value did not contain a date", async () => {
    const result = await alexa.request().intent("DateIntent").slot("date", "Invalid Data").send();
    expect(result.response.outputSpeech.ssml).toContain("Die Losung von heute");
  });

  it("should tell yesterday's losung", async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const result = await alexa.request().intent("DateIntent").slot("date", yesterday.toISOString()).send();
    expect(result.response.outputSpeech.ssml).toContain("Die Losung von gestern");
  });

  it("should tell tomorrow's losung", async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await alexa.request().intent("DateIntent").slot("date", tomorrow.toISOString()).send();
    expect(result.response.outputSpeech.ssml).toContain("Die Losung für morgen");
  });

  it("should tell losung for given date", async () => {
    const result = await alexa.request().intent("DateIntent").slot("date", "2019-01-01").send();
    expect(result.response.outputSpeech.ssml).toContain("Die Losung vom 1.1.2019");
  });

  describe("Fixed text", () => {
    it("should fix Verse Text for speak", async () => {
      const result = await alexa.request().intent("DateIntent").slot("date", "2019-11-21").send();
      expect(result.response.outputSpeech.ssml).toContain("Römer 16 Vers 25-27");
    });

    it("should fix Verse Notation for speak", async () => {
      const result = await alexa.request().intent("DateIntent").slot("date", "2019-12-01").send();
      expect(result.response.outputSpeech.ssml).toContain("Hebräer 13 Vers 20-21");
    });

    it("should apply Verse Notation fix only to Verse", async () => {
      const result = await alexa.request().intent("DateIntent").slot("date", "2019-05-26").send();
      expect(result.response.outputSpeech.ssml).toContain("5. Sonntag nach Ostern");
    });

    it("should fix Losungstext for speak", async () => {
      const result = await alexa.request().intent("DateIntent").slot("date", "2019-01-06").send();
      const response = result.response.outputSpeech.ssml
        .replace("<speak>")
        .replace("</speak>");
      expect(response).toContain("Die Losung vom 6.1.2019");
      expect(response).not.toContain("#");
      expect(response).not.toContain("/");
    });

    it("should fix Lehrtext for speak", async () => {
      const result = await alexa.request().intent("DateIntent").slot("date", "2019-10-08").send();
      const response = result.response.outputSpeech.ssml
        .replace("<speak>")
        .replace("</speak>");
      expect(response).toContain("Die Losung vom 8.10.2019");
      expect(response).not.toContain("#");
      expect(response).not.toContain("/");
    });

    it("should contain name of sundays", async () => {
      const result = await alexa.request().intent("DateIntent").slot("date", "2019-01-01").send();
      expect(result.response.outputSpeech.ssml).toContain("Neujahr");
    });

    it("should contain name of sundays including fixed verse", async () => {
      const result = await alexa.request().intent("DateIntent").slot("date", "2019-04-28").send();
      expect(result.response.outputSpeech.ssml).toContain("1. Sonntag nach Ostern – Quasimodogeniti "
        + "(Wie die neugeborenen Kindlein. 1. Petrus 2 Vers 2)");
    });

    it("should fix Chapter Name for speak", async () => {
      const result = await alexa.request().intent("DateIntent").slot("date", "2019-04-28").send();
      expect(result.response.outputSpeech.ssml).toContain("1. Petrus 2 Vers 2");
    });
  });
});
