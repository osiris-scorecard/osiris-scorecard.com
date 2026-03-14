// OSIRIS Batch Import
// Drop all your export JSON files in tools/exports/ and run this

const fs = require('fs');
const path = require('path');
const { convertExport } = require('./convert-export.js');

const EXPORTS_DIR = path.join(__dirname, 'exports');
const ACCOUNTS_FILE = path.join(__dirname, '../data/accounts.json');
const MANUAL_DATA_FILE = path.join(__dirname, 'manual-data.json');

// Load manual data (displayName, summary) from manual-data.json
function loadManualData() {
  if (fs.existsSync(MANUAL_DATA_FILE)) {
    return JSON.parse(fs.readFileSync(MANUAL_DATA_FILE, 'utf8'));
  }
  return {};
}

// Process all export files in the exports folder
function batchImport() {
  // Create exports directory if it doesn't exist
  if (!fs.existsSync(EXPORTS_DIR)) {
    fs.mkdirSync(EXPORTS_DIR);
    console.log('Created exports/ folder. Add your export JSON files there and run again.');
    return;
  }

  // Get all JSON files from exports folder
  const files = fs.readdirSync(EXPORTS_DIR).filter(f => f.endsWith('.json'));

  if (files.length === 0) {
    console.log('No JSON files found in exports/ folder.');
    console.log('Add your osiris_@handle_scorecard.json files there and run again.');
    return;
  }

  console.log(`Found ${files.length} export file(s):`);
  files.forEach(f => console.log(`  - ${f}`));
  console.log('');

  // Load existing accounts
  let accounts = [];
  if (fs.existsSync(ACCOUNTS_FILE)) {
    accounts = JSON.parse(fs.readFileSync(ACCOUNTS_FILE, 'utf8'));
  }

  const manualData = loadManualData();
  const newAccounts = [];

  // Convert each export
  files.forEach(file => {
    try {
      const exportData = JSON.parse(fs.readFileSync(path.join(EXPORTS_DIR, file), 'utf8'));
      const handle = exportData.account_handle;

      // Merge manual data for this account
      const manual = manualData[handle] || {};

      // Temporarily update the converter's manual data
      const originalManualData = require('./convert-export.js').manualData || {};
      Object.assign(originalManualData, { [handle]: manual });

      const converted = convertExport(exportData, handle);

      // Check if account already exists
      const existingIndex = accounts.findIndex(a => a.id === converted.id);
      if (existingIndex >= 0) {
        accounts[existingIndex] = converted;
        console.log(`✓ Updated: ${handle}`);
      } else {
        newAccounts.push(converted);
        console.log(`✓ Added: ${handle}`);
      }
    } catch (error) {
      console.error(`✗ Error processing ${file}:`, error.message);
    }
  });

  // Add new accounts to the array
  accounts.push(...newAccounts);

  // Save updated accounts.json
  fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
  console.log(`\n✓ Updated ${ACCOUNTS_FILE}`);
  console.log(`Total accounts: ${accounts.length}`);

  // Show which accounts are missing manual data
  const missingData = accounts.filter(a => !a.displayName || a.displayName === a.handle || !a.summary);
  if (missingData.length > 0) {
    console.log('\n⚠ Accounts missing displayName or summary:');
    missingData.forEach(a => {
      const missing = [];
      if (!a.displayName || a.displayName === a.handle) missing.push('displayName');
      if (!a.summary) missing.push('summary');
      console.log(`  ${a.handle}: ${missing.join(', ')}`);
    });
    console.log('\nAdd them to tools/manual-data.json (see example below)');
  }
}

// Run batch import
if (require.main === module) {
  batchImport();
}

module.exports = { batchImport };
