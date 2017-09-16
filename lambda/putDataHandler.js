'use strict';

const assert = require('assert');
const google = require('googleapis');
const sheets = google.sheets('v4');
const spreadsheetId = '1uROhhDLTtt7M1Gb5M60gTg9rgke3rG8UYc-6nqzEdnM';

const authClient = new google.auth.JWT(
  process.env.google_client_email,
  null,
  process.env.google_private_key,
  ['https://www.googleapis.com/auth/spreadsheets'],
  null);

module.exports.putData = ({ code, numAttending, message }, context, callback) => {
  assert(code =~ /[0-9]{6}/, 'code is not a number');
  assert(code.length === 6, 'invalid code length');
  assert(numAttending =~ /^[0-9]+$/, 'numAttending is not a number');
  assert(typeof message === 'string', 'message is not a string');

  authClient.authorize((err, tokens) => {
    if (err) throw err;

    sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:E',
      access_token: tokens.access_token,
    }, (err, result) => {
      if (err) throw err;

      const index = result.values
        .map((row) => row.code)
        .find((rowCode) => rowCode === code);
      const row = result.values[index];

      if (index < 0) {
        return callback(null, {
          status: 'invalid code'
        });
      }

      sheets.spreadsheets.values.update({
        spreadsheetId,
        valueInputOption: 'RAW',
        range: `Sheet1:!A${index+1}:E${index+1}`,
        resource: {
          values: [
            [ code, row[1], numAllowed[2], numAttending, message ]
          ]
        }
      }, (err, result) => {
        if (err) throw err;
        callback(null, result);
      });
    });
  });
};
