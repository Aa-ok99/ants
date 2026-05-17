function outputJson(data) {
  console.log(JSON.stringify(data, null, 2));
}

function outputTable(headers, rows) {
  const widths = headers.map((h, i) => {
    const maxCell = Math.max(h.length, ...rows.map(r => String(r[i] || '').length));
    return maxCell;
  });
  
  const pad = (str, i) => String(str || '').padEnd(widths[i] + 2);
  
  console.log(headers.map((h, i) => pad(h, i)).join(''));
  console.log('─'.repeat(widths.reduce((a, b) => a + b + 2, 0)));
  
  for (const row of rows) {
    console.log(row.map((cell, i) => pad(cell, i)).join(''));
  }
}

function isJsonMode() {
  return process.argv.includes('--json') || process.argv.includes('-j');
}

module.exports = { outputJson, outputTable, isJsonMode };
