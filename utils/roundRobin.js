function roundRobinSort(arr) {
  // Copy of our original array, with all songs in order by time entered.
  const allSongs = arr;
  // Will hold our sorted value at the end.
  let sortedArr = [];
  while (allSongs.length > 0) {
    const orderedSet = [];
    for (let i = 0; i < allSongs.length; i += 1) {
      const found = orderedSet.find(
        element => element.userName === allSongs[i].userName
      );
      if (!found) {
        orderedSet.push(allSongs[i]);
        allSongs.splice(i, 1);
        i -= 1;
      }
    }
    sortedArr = sortedArr.concat(orderedSet);
  }
  return sortedArr;
}

module.exports = roundRobinSort;
