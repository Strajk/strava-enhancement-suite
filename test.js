/* eslint-env node */
const rewire = require('rewire');
const test = require('ava');

const main = rewire('./js/main.js');
const SES = main.__get__('StravaEnhancementSuite');
const SESHelpers = main.__get__('StravaEnhancementSuiteHelpers');

test('keySort', t => {
  t.deepEqual(
    [
      { starred: false, count: 2, title: 'Beta' },
      { starred: true, count: 2, title: 'Charlie' },
      { starred: false, count: 5, title: 'Delta' },
      { starred: true, count: 3, title: 'Foxtrot' },
      { starred: false, count: 2, title: 'Golf' },
      { starred: false, count: 4, title: 'Echo' },
      { starred: false, count: 2, title: 'Alpha' },
      { starred: true, count: 3, title: 'Hotel' },
    ].sort(SESHelpers.keySort('-starred', '-count', 'title')),
    [
      { starred: true, count: 3, title: 'Foxtrot' },
      { starred: true, count: 3, title: 'Hotel' },
      { starred: true, count: 2, title: 'Charlie' },
      { starred: false, count: 5, title: 'Delta' },
      { starred: false, count: 4, title: 'Echo' },
      { starred: false, count: 2, title: 'Alpha' },
      { starred: false, count: 2, title: 'Beta' },
      { starred: false, count: 2, title: 'Golf' },
    ],
  );
});

