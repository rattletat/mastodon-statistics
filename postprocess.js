import {
  readJSON,
  writeJSON,
  removeFile,
} from "https://deno.land/x/flat@0.0.14/mod.ts";

// Step 1: Read the JSON response file
const filename = Deno.args[0]
const json = await readJSON(filename);
console.log(json);

// Step 2: Assume the last record is the current date
const todayRecord = json[json.length - 1];
if (!todayRecord) {
  console.error("No records found in the JSON response.");
  Deno.exit(1);
}

console.log(`Today's record: ${JSON.stringify(todayRecord)}`);

// Step 3: Read the existing statistics file or initialize an empty array if it doesn't exist
let statistics = [];
try {
  statistics = await readJSON('statistics.json');
} catch (error) {
  if (error.name === 'NotFound') {
    console.log('statistics.json not found, initializing a new one.');
  } else {
    throw error;
  }
}

// Step 4: Append today's record to the statistics
statistics.push(todayRecord);

// Step 5: Write the updated statistics back to the file
await writeJSON('statistics.json', statistics);
console.log("Appended today's record to statistics.json");

// Step 6. Delete the original file
await removeFile('statistics-response.json');
console.log('Deleted the original statistics-response.json file');
