// Importing necessary functions from the flat library
import {
  readJSON,
  writeJSON,
  removeFile,
} from "https://deno.land/x/flat@0.0.14/mod.ts";

// Global variables for filenames
const RESPONSE_FILE = 'statistics-response.json';
const STATISTICS_FILE = 'statistics.json';

async function updateStatistics() {
  // Step 1: Read the JSON response file
  const json = await readJSON(RESPONSE_FILE);
  console.log(json);

  // Step 2: Read the existing statistics file or initialize an empty array if it doesn't exist
  let statistics = [];
  let existingDates = new Set();
  try {
    statistics = await readJSON(STATISTICS_FILE);
    existingDates = new Set(statistics.map(record => record.period));
  } catch (error) {
    if (error.name === 'NotFound') {
      console.log(`${STATISTICS_FILE} not found, initializing a new one.`);
    } else {
      throw error;
    }
  }

  // Step 3: Filter new records that are not in the existing statistics
  const newRecords = json.filter(record => !existingDates.has(record.period));
  console.log(`New records to be added: ${JSON.stringify(newRecords)}`);

  // Step 4: Append new records to the statistics
  statistics.push(...newRecords);

  // Step 5: Write the updated statistics back to the file
  await writeJSON(STATISTICS_FILE, statistics);
  console.log(`Appended new records to ${STATISTICS_FILE}`);

  // Step 6: Delete the original file
  await removeFile(RESPONSE_FILE);
  console.log(`Deleted the original ${RESPONSE_FILE} file`);
}

// Run the updateStatistics function
await updateStatistics();
