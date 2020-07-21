/* eslint-env node */
const test = require('ava');

const main = require('./extension/js/main.js').default;
const helpers = require('./extension/js/main.js').helpers;

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
    ].sort(helpers.keySort('-starred', '-count', 'title')),
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

