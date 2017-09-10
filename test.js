const credentials = require('./credentials.json');
const google = require('googleapis');
const sheets = google.sheets('v4');

const authClient = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ['https://www.googleapis.com/auth/spreadsheets'],
  null);

const commands = {
  get(range) {
    authClient.authorize((err, tokens) => {
      if (err) throw err;

      sheets.spreadsheets.values.get({
        spreadsheetId: '1uROhhDLTtt7M1Gb5M60gTg9rgke3rG8UYc-6nqzEdnM',
        range: range,
        access_token: tokens.access_token,
      }, (err, result) => {
        if (err) throw err;

        const rows = result.values;
        for (let row of rows) {
          let rowString = '';
          for (let item of row) {
            if (rowString.length > 0) rowString += ','
            rowString += item;
          }
          console.log(rowString);
        }
      });
    });
  },

  set(range, values) {
    if (typeof values === 'string') {
      values = JSON.parse(values);
    }

    authClient.authorize((err, tokens) => {
      if (err) throw err;

      sheets.spreadsheets.values.update({
        spreadsheetId: '1uROhhDLTtt7M1Gb5M60gTg9rgke3rG8UYc-6nqzEdnM',
        range,
        valueInputOption: 'USER_ENTERED',
        resource: { values },
        access_token: tokens.access_token,
      }, (err, result) => {
        if (err) throw err;
        console.log('%d cells updated', result.updatedCells);
      });
    });
  },
};

commands[process.argv[2]](...(process.argv.slice(3)));
