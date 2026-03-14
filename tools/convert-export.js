// OSIRIS Export Converter
// Converts Chrome extension exports to accounts.json format

const fs = require('fs');
const path = require('path');

// Manual additions for each account (update this as needed)
const manualData = {
  '@bellingcat': {
    displayName: 'Bellingcat',
    summary: 'Open-source investigative journalism collective. Highly reliable fact-checking and media verification.'
  }
  // Add more accounts here as needed
};

function convertExport(exportData, handle) {
  const manual = manualData[handle] || {};

  // Auto-generate ID from handle
  const id = handle.replace('@', '').toLowerCase();

  // Convert factuality score from 0-10 to 0-100
  const factualityScore = Math.round(exportData.factuality_score * 10);

  // Format date as human-readable
  const lastUpdated = new Date(exportData.last_reviewed).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return {
    id,
    handle: exportData.account_handle,
    displayName: manual.displayName || exportData.display_name || exportData.account_handle,
    cis: exportData.cis_grade,
    factualityScore,
    positionTags: exportData.pst_tags || [],
    totalPosts: exportData.posts_reviewed_count,
    pendingPosts: exportData.posts_pending_count,
    lastUpdated,
    summary: manual.summary || '',
    contentFlags: exportData.content_flags || [],
    hardFlags: parseHardFlags(exportData.hard_visibility_flags || [])
  };
}

function parseHardFlags(flagsArray) {
  const flags = {};
  flagsArray.forEach(flag => {
    if (flag.includes('M6') || flag.toLowerCase().includes('undisclosed ai')) {
      flags.undisclosedAI = true;
    }
    if (flag.includes('M7') || flag.toLowerCase().includes('manipulated') || flag.toLowerCase().includes('doctored')) {
      flags.manipulated = true;
    }
  });
  return Object.keys(flags).length > 0 ? flags : undefined;
}

// Example usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node convert-export.js <export-file.json>');
    console.log('Example: node convert-export.js osiris_@bellingcat_scorecard.json');
    process.exit(1);
  }

  const exportFile = args[0];
  const exportData = JSON.parse(fs.readFileSync(exportFile, 'utf8'));
  const converted = convertExport(exportData, exportData.account_handle);

  console.log(JSON.stringify(converted, null, 2));
}

module.exports = { convertExport };
