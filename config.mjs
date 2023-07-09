// set variables to your preferences
const useHttps = false;
var serverURL = "localhost"

var port;
if (useHttps) {
    serverURL = `https://${serverURL}`;
    port = 443;
} else {
    serverURL = `http://${serverURL}`;;
    port = 80;
}

const dbURL = `mongodb://127.0.0.1:27017`;

export default { serverURL, port, dbURL, useHttps };
