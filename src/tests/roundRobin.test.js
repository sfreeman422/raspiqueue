const { testArr } = require("./roundRobinCases.json");
const roundRobin = require("../../utils/roundRobin.js");

const sortedArr = [
  { userName: "steve", song: "Test1" },
  { userName: "ricky", song: "Test1" },
  { userName: "neal", song: "Test1" },
  { userName: "geno", song: "Test1" },
  { userName: "robbie", song: "Test1" },
  { userName: "will", song: "Test1" },
  { userName: "steve", song: "Test2" },
  { userName: "neal", song: "Test2" },
  { userName: "robbie", song: "Test2" },
  { userName: "geno", song: "Test2" },
  { userName: "steve", song: "Test3" },
  { userName: "geno", song: "Test3" },
  { userName: "steve", song: "Test4" }
];
test("Should return a round robin sorted array of objects", () => {
  expect(roundRobin(testArr)).toEqual(expect.arrayContaining(sortedArr));
});
