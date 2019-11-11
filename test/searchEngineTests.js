'use strict';

/*global QUnit*/

import { SearchEngine } from '/js/SearchEngine.js';

const idxWordCount = 0;
const idxVerseCount = 1;

(function () {
  let eng = new SearchEngine();
  // Assert values verified with King James Pure Bible Search
  // http://purebiblesearch.com/

  QUnit.module('Input Errors');

  QUnit.test('Empty Expression', function (assert) {
    let rig = eng.performSearch('');
    assert.equal(rig.type, 'EMPTY');
  });
  QUnit.test('Both Word and Phrase Expression', function (assert) {
    let rig = eng.performSearch('god,son of man');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Illegal Character in Expression', function (assert) {
    let rig = eng.performSearch('god+man');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', function (assert) {
    let rig = eng.performSearch('*');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', function (assert) {
    let rig = eng.performSearch('* god');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', function (assert) {
    let rig = eng.performSearch('god * man');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', function (assert) {
    let rig = eng.performSearch('god *');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', function (assert) {
    let rig = eng.performSearch('*,god');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', function (assert) {
    let rig = eng.performSearch('god, *, man');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', function (assert) {
    let rig = eng.performSearch('god, *');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Comma in Expression', function (assert) {
    let rig = eng.performSearch('god,');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Comma in Expression', function (assert) {
    let rig = eng.performSearch(',god');
    assert.equal(rig.type, 'INVALID');
  });

  QUnit.module('Word Search Expressions');

  QUnit.test('abed*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 15);
    assert.equal(rig.tomeBin[idxVerseCount], 14);
  });
  QUnit.test('@abed*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 0);
    assert.equal(rig.tomeBin[idxVerseCount], 0);
  });
  QUnit.test('abedn*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 15);
    assert.equal(rig.tomeBin[idxVerseCount], 14);
  });
  QUnit.test('accept*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 87);
    assert.equal(rig.tomeBin[idxVerseCount], 86);
  });
  QUnit.test('@Accept', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 1);
    assert.equal(rig.tomeBin[idxVerseCount], 1);
  });
  QUnit.test('@Accept*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 1);
    assert.equal(rig.tomeBin[idxVerseCount], 1);
  });
  QUnit.test('aha*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 221);
    assert.equal(rig.tomeBin[idxVerseCount], 188);
  });
  QUnit.test('@aha*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 3);
    assert.equal(rig.tomeBin[idxVerseCount], 3);
  });
  QUnit.test('angel', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 201);
    assert.equal(rig.tomeBin[idxVerseCount], 192);
  });
  QUnit.test('angel*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 297);
    assert.equal(rig.tomeBin[idxVerseCount], 283);
  });
  QUnit.test('@Angel*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 4);
    assert.equal(rig.tomeBin[idxVerseCount], 4);
  });
  QUnit.test("apostles'", function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 5);
    assert.equal(rig.tomeBin[idxVerseCount], 5);
  });
  QUnit.test('as*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 4938);
    assert.equal(rig.tomeBin[idxVerseCount], 4085);
  });
  QUnit.test('@as*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 4213);
    assert.equal(rig.tomeBin[idxVerseCount], 3490);
  });
  QUnit.test('@As*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 725);
    assert.equal(rig.tomeBin[idxVerseCount], 684);
  });
  QUnit.test('be*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 16269);
    assert.equal(rig.tomeBin[idxVerseCount], 11740);
  });
  QUnit.test('bethel', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 66);
    assert.equal(rig.tomeBin[idxVerseCount], 59);
  });
  QUnit.test('christ', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 555);
    assert.equal(rig.tomeBin[idxVerseCount], 522);
  });
  QUnit.test('christ*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 576);
    assert.equal(rig.tomeBin[idxVerseCount], 537);
  });
  QUnit.test('*circum*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 148);
    assert.equal(rig.tomeBin[idxVerseCount], 109);
  });
  QUnit.test('err*d', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 15);
    assert.equal(rig.tomeBin[idxVerseCount], 14);
  });
  QUnit.test('ex*d', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 147);
    assert.equal(rig.tomeBin[idxVerseCount], 143);
  });
  QUnit.test('fou*n', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 113);
    assert.equal(rig.tomeBin[idxVerseCount], 107);
  });
  QUnit.test('jehovah*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 7);
    assert.equal(rig.tomeBin[idxVerseCount], 7);
  });
  QUnit.test('@JEHOVAH*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 4);
    assert.equal(rig.tomeBin[idxVerseCount], 4);
  });
  QUnit.test("kings'", function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 5);
    assert.equal(rig.tomeBin[idxVerseCount], 5);
  });
  QUnit.test("@Kings'", function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 1);
    assert.equal(rig.tomeBin[idxVerseCount], 1);
  });
  QUnit.test('lamb*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 188);
    assert.equal(rig.tomeBin[idxVerseCount], 175);
  });
  QUnit.test('@lamb*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 158);
    assert.equal(rig.tomeBin[idxVerseCount], 147);
  });
  QUnit.test('@Lamb*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 30);
    assert.equal(rig.tomeBin[idxVerseCount], 28);
  });
  QUnit.test('lord', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 7830);
    assert.equal(rig.tomeBin[idxVerseCount], 6667);
  });
  QUnit.test('lord*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 8009);
    assert.equal(rig.tomeBin[idxVerseCount], 6781);
  });
  QUnit.test('@lord', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 234);
    assert.equal(rig.tomeBin[idxVerseCount], 207);
  });
  QUnit.test('@lord*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 289);
    assert.equal(rig.tomeBin[idxVerseCount], 256);
  });
  QUnit.test('@Lord', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 1130);
    assert.equal(rig.tomeBin[idxVerseCount], 1067);
  });
  QUnit.test('@Lord*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 1145);
    assert.equal(rig.tomeBin[idxVerseCount], 1079);
  });
  QUnit.test('@LORD*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 6575);
    assert.equal(rig.tomeBin[idxVerseCount], 5554);
  });
  QUnit.test('lordly', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 1);
    assert.equal(rig.tomeBin[idxVerseCount], 1);
  });
  QUnit.test('love*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 521);
    assert.equal(rig.tomeBin[idxVerseCount], 442);
  });
  QUnit.test('mal*s', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 41);
    assert.equal(rig.tomeBin[idxVerseCount], 41);
  });
  QUnit.test('net*ite*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 10);
    assert.equal(rig.tomeBin[idxVerseCount], 9);
  });
  QUnit.test('sojourn*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 74);
    assert.equal(rig.tomeBin[idxVerseCount], 72);
  });

  QUnit.module('Multiple-Word Search Expressions');

  QUnit.test('fall,living,god', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 3);
    assert.equal(rig.tomeBin[idxVerseCount], 1);
  });
  QUnit.test('forgive,sin', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 25);
    assert.equal(rig.tomeBin[idxVerseCount], 12);
  });
  QUnit.test('forgive*,sin*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 117);
    assert.equal(rig.tomeBin[idxVerseCount], 54);
  });
  QUnit.test('generation*,jacob', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 6);
    assert.equal(rig.tomeBin[idxVerseCount], 3);
  });
  QUnit.test('@God,scripture', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 14);
    assert.equal(rig.tomeBin[idxVerseCount], 6);
  });
  QUnit.test('good,fight', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 8);
    assert.equal(rig.tomeBin[idxVerseCount], 3);
  });
  QUnit.test('@LORD,spoken', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 245);
    assert.equal(rig.tomeBin[idxVerseCount], 105);
  });
  QUnit.test('shepherd,sheep', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 39);
    assert.equal(rig.tomeBin[idxVerseCount], 17);
  });
  QUnit.test('@Spirit,glory', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 12);
    assert.equal(rig.tomeBin[idxVerseCount], 5);
  });
  QUnit.test('thought*,way*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 16);
    assert.equal(rig.tomeBin[idxVerseCount], 6);
  });
  QUnit.test('thoughts,ways', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 8);
    assert.equal(rig.tomeBin[idxVerseCount], 2);
  });

  QUnit.module('Phrase Search Expressions');

  QUnit.test('be scattered', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 13);
    assert.equal(rig.tomeBin[idxVerseCount], 13);
  });
  QUnit.test('day of the lord', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 25);
    assert.equal(rig.tomeBin[idxVerseCount], 23);
  });
  QUnit.test('day of the lord*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 31);
    assert.equal(rig.tomeBin[idxVerseCount], 29);
  });
  QUnit.test('days of your fathers', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 2);
    assert.equal(rig.tomeBin[idxVerseCount], 2);
  });
  // Exodus 32:32
  QUnit.test('forgive their sin', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 2);
    assert.equal(rig.tomeBin[idxVerseCount], 2);
  });
  QUnit.test('good fight', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 2);
    assert.equal(rig.tomeBin[idxVerseCount], 2);
  });
  QUnit.test('in christ', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 77);
    assert.equal(rig.tomeBin[idxVerseCount], 76);
  });
  QUnit.test('lord god almighty', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 5);
    assert.equal(rig.tomeBin[idxVerseCount], 5);
  });
  QUnit.test('my thought', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 1);
    assert.equal(rig.tomeBin[idxVerseCount], 1);
  });
  QUnit.test('my thoughts', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 5);
    assert.equal(rig.tomeBin[idxVerseCount], 5);
  });
  QUnit.test('my thought*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 6);
    assert.equal(rig.tomeBin[idxVerseCount], 6);
  });
  QUnit.test('my way', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 11);
    assert.equal(rig.tomeBin[idxVerseCount], 11);
  });
  QUnit.test('my ways', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 24);
    assert.equal(rig.tomeBin[idxVerseCount], 24);
  });
  QUnit.test('my way*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 35);
    assert.equal(rig.tomeBin[idxVerseCount], 35);
  });
  // PBS reports 51/49, but 7 span adjacent verses
  QUnit.test('the lord he', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 44);
    assert.equal(rig.tomeBin[idxVerseCount], 42);
  });
  QUnit.test('world itself', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.tomeBin[idxWordCount], 1);
    assert.equal(rig.tomeBin[idxVerseCount], 1);
  });
})();
