const testCases = require('./roundRobinCases.json').testArr;
const roundRobin = require('../../utils/roundRobin.js');
const sortedArr = [
  { name: 'steve', song: 'Test1' },
  { name: 'ricky', song: 'Test1' },
  { name: 'neal', song: 'Test1' },
  { name: 'geno', song: 'Test1' },
  { name: 'robbie', song: 'Test1' },
  { name: 'will', song: 'Test1' },
  { name: 'steve', song: 'Test2' },
  { name: 'neal', song: 'Test2' },
  { name: 'robbie', song: 'Test2' },
  { name: 'geno', song: 'Test2' },
  { name: 'steve', song: 'Test3' },
  { name: 'geno', song: 'Test3' },
  { name: 'steve', song: 'Test4' },
];
test('should sort an array of objects', () => {
  expect(roundRobin(testCases)).toEqual(expect.arrayContaining(sortedArr));
});
