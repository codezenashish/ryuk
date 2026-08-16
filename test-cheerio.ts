const cheerio = require("cheerio");
const chalk = require("chalk");

function renderHtmlToCli(html) {
  const $ = cheerio.load(html);

  // 1. Tables
  $('table').each((_, table) => {
    let tableText = '\n';
    $(table).find('tr').each((_, tr) => {
      let rowText = '';
      $(tr).find('th, td').each((_, cell) => {
        const rawText = $(cell).text().trim().replace(/\n/g, ' ');
        const display = rawText.length > 27 ? rawText.substring(0, 24) + '...' : rawText;
        const padded = display.padEnd(27, ' ');
        const isHeader = cell.tagName === 'th';
        rowText += isHeader ? chalk.bold.cyan(padded) + ' | ' : padded + ' | ';
      });
      tableText += `  | ${rowText.trim()}\n`;
      if ($(tr).find('th').length > 0) {
        tableText += `  |${'-'.repeat(rowText.length + 1)}\n`;
      }
    });
    $(table).replaceWith(tableText + '\n');
  });

  // 9. Paragraphs
  $('p').each((_, el) => {
    $(el).replaceWith(`\n${$(el).text().trim()}\n`);
  });

  return $.text().trim().replace(/\n{3,}/g, '\n\n');
}

const html = `<table><tr><td><p><strong>Property Name</strong></p></td><td><p>Property Type</p></td></tr><tr><td><p>Topic</p></td><td><p>Title</p></td></tr></table>`;
console.log("Original HTML:", html);
console.log("Rendered:");
console.log(renderHtmlToCli(html));
