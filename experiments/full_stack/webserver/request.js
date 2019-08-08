const request = require('request');

//_EXTERNAL_URL = 'https://test-proj-heroku.herokuapp.com/api/plans';
//_EXTERNAL_URL = 'http://10.230.161.45:8080/notes';

let CORE = {
    proto : 'http:',
    host  : 'localhost',
    port  : 8192,
    path  : '/notes'
};
_EXTERNAL_URL = CORE.proto + '//' + CORE.host + ':' + CORE.port + CORE.path;

const callExternalApiUsingRequest = (callback) => {
    request(_EXTERNAL_URL, { json: true },
        (err, res, body) => {
            if (err) { 
                return callback(err);
            }
            return callback(body);
        });
}
const callPostApiRequest = (callback, data) => {
    request.post(
        { url: _EXTERNAL_URL, json: data },
        (err, httpResponse, body) => {
            return callback(body);
        })

}
module.exports.callApi = callExternalApiUsingRequest;
module.exports.callPostApi = callPostApiRequest;
