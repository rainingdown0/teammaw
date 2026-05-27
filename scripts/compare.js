const fs = require('fs');

function findMismatchedItems(file1Path, file2Path) {
  try {
    // 1. Read and parse the JSON files
    const list1 = JSON.parse(fs.readFileSync(file1Path, 'utf8'));
    const list2 = JSON.parse(fs.readFileSync(file2Path, 'utf8'));

    // 2. Create Sets of IDs for O(1) fast lookups
    const idsInList1 = new Set(list1.map(item => item.id));
    const idsInList2 = new Set(list2.map(item => item.id));

    // 3. Find items in List 1 that are missing from List 2
    const onlyInList1 = list1.filter(item => !idsInList2.has(item.id));

    // 4. Find items in List 2 that are missing from List 1
    const onlyInList2 = list2.filter(item => !idsInList1.has(item.id));

    // 5. Combine the mismatches
    return {
      totalMismatches: onlyInList1.length + onlyInList2.length,
      onlyInFile1: onlyInList1,
      onlyInFile2: onlyInList2
    };

  } catch (error) {
    console.error("Error processing files:", error.message);
    return null;
  }
}

// Example usage:
const result = findMismatchedItems('data/abilities.json', 'data/backup/abilities.json');

if (result) {
  console.log(JSON.stringify(result, null, 2));
}