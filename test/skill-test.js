import test from 'ava';
import { handler as Skill } from '../build/skill';
import Request from 'alexa-request';
import chai from 'chai';
import chaiSubset from 'chai-subset';

const expect = chai.expect;
chai.use(chaiSubset);

test('LaunchRequest', () => {
  const event = Request.launchRequest().build();

  return Skill(event).then(response => {
    expect(response.response.outputSpeech.text).to.contain('Die Losung von heute');
    expect(response).to.containSubset({
      response: {
        shouldEndSession: true,
        outputSpeech: { type: 'PlainText' }
      }
    });
  });
});

test('DateIntent', () => {
  const event = Request.intent('DateIntent', { date: '2019-01-01' }).build();

  return Skill(event).then(response => {
    expect(response.response.outputSpeech.text).to.contain('Die Losung vom 1.1.2019');
    expect(response).to.containSubset({
      response: {
        shouldEndSession: true,
        outputSpeech: { type: 'PlainText' }
      }
    });
  });
});

test('DateIntent for yesterday', () => {
  const yesterday = new Date();
  yesterday.setDate(new Date().getDate() - 1);
  const event = Request.intent('DateIntent', { date: yesterday.toISOString() }).build();

  return Skill(event).then(response => {
    expect(response.response.outputSpeech.text).to.contain('Die Losung von gestern');
    expect(response).to.containSubset({
      response: {
        shouldEndSession: true,
        outputSpeech: { type: 'PlainText' }
      }
    });
  });
});

test('DateIntent for tomorrow', () => {
  const tomorrow = new Date();
  tomorrow.setDate(new Date().getDate() + 1);
  const event = Request.intent('DateIntent', { date: tomorrow.toISOString() }).build();

  return Skill(event).then(response => {
    expect(response.response.outputSpeech.text).to.contain('Die Losung für morgen');
    expect(response).to.containSubset({
      response: {
        shouldEndSession: true,
        outputSpeech: { type: 'PlainText' }
      }
    });
  });
});

test('Fixed Verse Text for speak', () => {
  const event = Request.intent('DateIntent', { date: '2019-11-21' }).build();

  return Skill(event).then(response => {
    expect(response.response.outputSpeech.text).to.contain('Römer 16 Vers 25-27');
  });
});

test('Fixed Verse Notation for speak', () => {
  const event = Request.intent('DateIntent', { date: '2019-12-01' }).build();

  return Skill(event).then(response => {
    expect(response.response.outputSpeech.text).to.contain('Hebräer 13 Vers 20-21');
  });
});

test('Fixed Losungstext for speak', () => {
  const event = Request.intent('DateIntent', { date: '2019-01-06' }).build();

  return Skill(event).then(response => {
    expect(response.response.outputSpeech.text).to.contain('Die Losung vom 6.1.2019');
    expect(response.response.outputSpeech.text).to.not.contain('#');
    expect(response.response.outputSpeech.text).to.not.contain('/');
  });
});

test('Fixed Lehrtext for speak', () => {
  const event = Request.intent('DateIntent', { date: '2019-10-08' }).build();

  return Skill(event).then(response => {
    expect(response.response.outputSpeech.text).to.contain('Die Losung vom 8.10.2019');
    expect(response.response.outputSpeech.text).to.not.contain('#');
    expect(response.response.outputSpeech.text).to.not.contain('/');
  });
});

test('Contains name of sundays', () => {
  const event = Request.intent('DateIntent', { date: '2019-01-01' }).build();

  return Skill(event).then(response => {
    expect(response.response.outputSpeech.text).to.contain('Neujahr');
  });
});

test('Contains name of sundays including fixed verse', () => {
  const event = Request.intent('DateIntent', { date: '2019-04-28' }).build();

  return Skill(event).then(response => {
    expect(response.response.outputSpeech.text).to.contain('1. Sonntag nach Ostern – Quasimodogeniti (Wie die neugeborenen Kindlein. 1. Petrus 2 Vers 2)');
  });
});

test('Fixed Chapter Name for speak', () => {
  const event = Request.intent('DateIntent', { date: '2019-04-28' }).build();

  return Skill(event).then(response => {
    expect(response.response.outputSpeech.text).to.contain('1. Petrus 2 Vers 2');
  });
});

test('AMAZON.StopIntent', () => {
  const event = Request.intent('AMAZON.StopIntent').build();

  return Skill(event).then(response => {
    expect(response).to.containSubset({
      response: {
        shouldEndSession: true,
        outputSpeech: { type: 'PlainText', text: 'Bis bald!' }
      }
    });
  });
});

test('AMAZON.CancelIntent', () => {
  const event = Request.intent('AMAZON.CancelIntent').build();

  return Skill(event).then(response => {
    expect(response).to.containSubset({
      response: {
        shouldEndSession: true,
        outputSpeech: { type: 'PlainText', text: 'Bis bald!' }
      }
    });
  });
});

test('SessionEndedRequest', () => {
  const event = Request.sessionEndedRequest().build();
  return Skill(event).then(response => {
    expect(response).to.deep.equal({});
  });
});
