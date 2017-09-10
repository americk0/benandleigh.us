'use strict';

const credentials = require('../credentials.json');
const google = require('googleapis');
const sheets = google.sheets('v4');

const authClient = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ['https://www.googleapis.com/auth/spreadsheets'],
  null);

module.exports.getData = ({ code }, context, callback) => {
  authClient.authorize((err, tokens) => {
    if (err) throw err;

    sheets.spreadsheets.values.get({
      spreadsheetId: '1uROhhDLTtt7M1Gb5M60gTg9rgke3rG8UYc-6nqzEdnM',
      range: 'Sheet!A:E',
      access_token: tokens.access_token,
    }, (err, result) => {
      if (err) throw err;

      const rows = result.values;
      const row = rows.find((row) => Integer(row[0]) === Integer(code))
      if (typeof row === 'undefined') {
        callback(null, {
          status: 'code not found'
        });
      } else {
        callback(null, {
          status: 'ok',
          code: row[0],
          name: row[1],
          numAllowed: row[2],
          numAttending: row[3],
          message: row[4],
        });
      }
    });
  });

  // const response = {
  //   statusCode: 200,
  //   headers: {
  //     'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  //   },
  //   body: JSON.stringify({
  //     message: 'Go Serverless v1.0! Your function executed successfully!',
  //     input: event,
  //   }),
  // };
};
