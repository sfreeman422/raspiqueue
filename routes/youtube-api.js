const router = require('./api.js');
const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/google-apis-nodejs-quickstart.json
const SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl'];
const TOKEN_DIR = `${process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE}/.credentials/`;
const TOKEN_PATH = `${TOKEN_DIR}google-apis-nodejs-quickstart.json`;
let clientSecrets;
// Load client secrets from a local file.
fs.readFile('./private/client_secret.json', (err, content) => {
  if (err) {
    console.log(`Error loading client secret file: ${ err}`);
    return;
  }
  // Authorize a client with the loaded credentials, then call the YouTube API.
  // See full code sample for authorize() function code.
  /* 
  Example of Params: 
  params: {
      maxResults: '25',
      part: 'snippet',
      q: 'surfing',
      type: '',
    }
  */
  clientSecrets = JSON.parse(content);
  // authorize(JSON.parse(content), {
  //   params: {
  //   },
  // }, searchListByKeyword);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, requestData, callback) {
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];
  const auth = new googleAuth();
  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      getNewToken(oauth2Client, requestData, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client, requestData);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, requestData, callback) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oauth2Client.getToken(code, (err, token) => {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client, requestData);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log(`Token stored to ${TOKEN_PATH}`);
}

/**
 * Remove parameters that do not have values.
 *
 * @param {Object} params A list of key-value pairs representing request
 *                        parameters and their values.
 * @return {Object} The params object minus parameters with no values set.
 */
function removeEmptyParameters(params) {
  for (const p in params) {
    if (!params[p] || params[p] == 'undefined') {
      delete params[p];
    }
  }
  return params;
}

/**
 * Create a JSON object, representing an API resource, from a list of
 * properties and their values.
 *
 * @param {Object} properties A list of key-value pairs representing resource
 *                            properties and their values.
 * @return {Object} A JSON object. The function nests properties based on
 *                  periods (.) in property names.
 */
function createResource(properties) {
  const resource = {};
  const normalizedProps = properties;
  for (var p in properties) {
    const value = properties[p];
    if (p && p.substr(-2, 2) == '[]') {
      const adjustedName = p.replace('[]', '');
      if (value) {
        normalizedProps[adjustedName] = value.split(',');
      }
      delete normalizedProps[p];
    }
  }
  for (var p in normalizedProps) {
    // Leave properties that don't have values out of inserted resource.
    if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
      const propArray = p.split('.');
      let ref = resource;
      for (let pa = 0; pa < propArray.length; pa++) {
        const key = propArray[pa];
        if (pa == propArray.length - 1) {
          ref[key] = normalizedProps[p];
        } else {
          ref = ref[key] = ref[key] || {};
        }
      }
    }
  }
  return resource;
}


function searchListByKeyword(auth, requestData) {
  const service = google.youtube('v3');
  const parameters = removeEmptyParameters(requestData.params);
  parameters.auth = auth;
  service.search.list(parameters, (err, response) => {
    if (err) {
      console.log(`The API returned an error: ${err}`);
      return;
    }
    console.log(response);
  });
}

router.post('/api/youtube', (req, res) => {
  console.log(req.body);
  const requestParams = {
    params: {
      maxResults: '25',
      part: 'snippet',
      q: req.body.query,
      type: '',
    },
  };
  // This will need to be promisified to only return once the request is complete.
  // The request is being made properly, we just need to send back to the client properly.
  authorize(clientSecrets, requestParams, searchListByKeyword);
  res.send('lol');
});

module.exports = router;
