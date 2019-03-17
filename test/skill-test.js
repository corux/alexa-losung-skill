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
  const event = Request.intent('DateIntent', { date: '2018-01-01' }).build();

  return Skill(event).then(response => {
    expect(response.response.outputSpeech.text).to.contain('Die Losung vom 1.1.2018');
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
  const event = Request.intent('DateIntent', { date: '2018-01-02' }).build();

  return Skill(event).then(response => {
    expect(response.response.outputSpeech.text).to.contain('Jesaja 61 Vers 1-3');
  });
});

test('Fixed Verse Notation for speak', () => {
  const event = Request.intent('DateIntent', { date: '2017-12-17' }).build();

  return Skill(event).then(response => {
    expect(response.response.outputSpeech.text).to.contain('1. Könige 2 Vers 1-3');
  });
});

test('Fixed Losungstext for speak', () => {
  const event = Request.intent('DateIntent', { date: '2017-01-15' }).build();

  return Skill(event).then(response => {
    expect(response.response.outputSpeech.text).to.not.contain('#');
  });
});

test('Fixed Lehrtext for speak', () => {
  const event = Request.intent('DateIntent', { date: '2017-11-22' }).build();

  return Skill(event).then(response => {
    expect(response.response.outputSpeech.text).to.not.contain('#');
    expect(response.response.outputSpeech.text).to.not.contain('/');
  });
});

test('Contains name of sundays', () => {
  const event = Request.intent('DateIntent', { date: '2018-01-01' }).build();

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
  const event = Request.intent('DateIntent', { date: '2018-01-15' }).build();

  return Skill(event).then(response => {
    expect(response.response.outputSpeech.text).to.contain('1. Samuel 12 Vers 24');
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
