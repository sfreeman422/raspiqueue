const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');

const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
const HOME_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE);
const TOKEN_DIR = `${HOME_DIR}/.credentials/`;
const TOKEN_PATH = `${TOKEN_DIR}youtube-nodejs-quickstart.json`;

fs.readFile('./private/client_secret.json', (err, content) => {
  if (err) {
    console.log(`Error loading client secret file: ${err}`);
    return;
  } authorize(JSON.parse(content), getChannel);
});

function authorize(credentials, callback) {
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];
  const auth = new googleAuth();
  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

function getNewToken(oauth2Client, callback) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from the page here: ', (code) => {
    rl.close();
    oauth2Client.getToken(code, (err, token) => {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

function getChannel(auth) {
  const service = google.youtube('v3');
  service.channels.list({
    auth,
    part: 'snippet, contentDetails, statistics',
    forUsername: 'GoogleDevelopers',
  }, (err, response) => {
    if (err) {
      console.log(`Api return an error: ${err}`);
      return;
    }
    const channels = response.items;
    if (channels.length === 0) {
      console.log('No channel found');
    } else {
      console.log(
        'This channels ID is %s. ITs title is \'%s\', and is has %s views.',
        channels[0].id,
        channels[0].snippet.title,
        channels[0].statistics.viewCount,
      );
    }
  });
}
