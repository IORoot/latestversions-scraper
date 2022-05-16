const fs     = require('fs');
const Xray   = require('x-ray')
const xray   = Xray()
var Airtable = require('airtable');

var url      = 'https://en.wikipedia.org/wiki/Microsoft_Windows';
var selector = '#mw-content-text > div.mw-parser-output > table.infobox.vevent > tbody > tr:nth-child(5) > td'
var regex    = /\s.*/; // Match a whitespace and remove everything else.
var download = 'https://www.microsoft.com/en-gb/software-download';
var folders  = './results/os/microsoft'
var filename = 'windows.json'


xray(url, selector)(function(err, returned) {

  var version = returned.replace(regex,'');

  var json = {
    "latest_version": version,
    "html_url": download,
  };

  var data = JSON.stringify(json);

  

  if (!fs.existsSync(folders)){
    fs.mkdirSync(folders, { recursive: true });
  }

  fs.writeFile(folders+'/'+filename, data, (err) => {
    if (err) {
        throw err;
    }
    console.log(folders+'/'+filename);
    
  });

});


var base     = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('app8NMPBTR6QCoYX2');
base('versions').select({
  view: 'Grid view'
}).firstPage(function(err, records) {
  if (err) { console.error(err); return; }
  records.forEach(function(record) {
      console.log('Retrieved', record.get('title'));
  });
});