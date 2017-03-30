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
    expect(response.response.outputSpeech.ssml).to.contain('Die Losung von heute');
    expect(response).to.containSubset({
      response: {
        shouldEndSession: true,
        outputSpeech: { type: 'SSML' }
      }
    });
  });
});

test('DateIntent', () => {
  const event = Request.intent('DateIntent', { date: '2017-01-01' }).build();

  return Skill(event).then(response => {
    expect(response.response.outputSpeech.ssml).to.contain('Die Losung vom 1.1.2017');
    expect(response).to.containSubset({
      response: {
        shouldEndSession: true,
        outputSpeech: { type: 'SSML' }
      }
    });
  });
});

test('Fixed Verse Text for speak', () => {
  const event = Request.intent('DateIntent', { date: '2016-01-01' }).build();

  return Skill(event).then(response => {
    expect(response.response.outputSpeech.ssml).to.contain('Psalm 136 Vers 3-4');
  });
});

test('Fixed Chapter Name for speak', () => {
  const event = Request.intent('DateIntent', { date: '2017-03-28' }).build();

  return Skill(event).then(response => {
    expect(response.response.outputSpeech.ssml).to.contain('1. Samuel 10 Vers 7');
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
