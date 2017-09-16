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
  try {
    assert(code.match(/^[0-9]{6}$/), `code "${code}" is not a 6-digit number`);
    assert(numAttending.match(/^[0-9]+$/), `numAttending "${numAttending}" is not a number`);
    if (message) assert(typeof message === 'string', `message "${message}" is not a string`);
  } catch (err) {
    return callback(null, {
      status: "invalid input",
      error: err,
    });
  }

  authClient.authorize((err, tokens) => {
    if (err) throw err;

    sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:E',
      access_token: tokens.access_token,
    }, (err, result) => {
      if (err) throw err;

      const index = result.values.reduce((found, row, index) => {
        if (Number(row[0]) === Number(code)){
          return index;
        } else {
          return found;
        }
      }, -1);
      if (index < 0) {
        return callback(null, {
          status: `invalid code "${code}"`
        });
      }
      const row = result.values[index];

      if (Number(numAttending) > Number(row[2])) {
        return callback(null, {
          status: `Error: numAttending "${numAttending}" is greater than numAllowed "${row[2]}"`,
        });
      }

      if (row[3]) return callback(null, {
        status: `Error: already registered as having "${row[3]}" attendees`
      });

      sheets.spreadsheets.values.update({
        spreadsheetId,
        valueInputOption: 'RAW',
        range: `Sheet1!A${index+1}:E${index+1}`,
        resource: {
          values: [
            [ Number(code), row[1], Number(row[2]), Number(numAttending), message ]
          ]
        },
        access_token: tokens.access_token,
      }, callback);
    });
  });
};
