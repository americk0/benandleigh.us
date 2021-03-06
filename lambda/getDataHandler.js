'use strict';

const google = require('googleapis');
const sheets = google.sheets('v4');

const authClient = new google.auth.JWT(
  process.env.google_client_email,
  null,
  process.env.google_private_key,
  ['https://www.googleapis.com/auth/spreadsheets'],
  null);

module.exports.getData = (event, context, callback) => {
  const { code } = event.pathParameters;
  console.log(code)

  authClient.authorize((err, tokens) => {
    if (err) throw err;

    sheets.spreadsheets.values.get({
      spreadsheetId: '1uROhhDLTtt7M1Gb5M60gTg9rgke3rG8UYc-6nqzEdnM',
      range: 'Sheet1!A:E',
      access_token: tokens.access_token,
    }, (err, result) => {
      if (err) throw err;

      const rows = result.values;
      const row = rows.find((row) => Number(row[0]) === Number(code))
      const response = {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
      };
      if (typeof row === 'undefined') {
        response.body = JSON.stringify({
          status: 'code not found'
        });
        response.statusCode = 404;
      } else {
        response.body = JSON.stringify({
          status: 'ok',
          code: row[0],
          name: row[1],
          numAllowed: row[2],
          numAttending: row[3],
          message: row[4],
        });
        response.statusCode = 200;
      }
      callback(null, response);
    });
  });
};
