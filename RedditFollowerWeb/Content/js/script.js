// get request example
getExample = () => {
    uri = "/foo"
    method = 'GET'
    var httpRequest = new XMLHttpRequest()
    httpRequest.open(method, uri)
    httpRequest.onload = function () {
        if (httpRequest.status === 200) {
            console.log('User\'s name is ' + httpRequest.responseText);
        }
        else {
            console.log('Request failed.  Returned status of ' + httpRequest.status);
        }
    };
    httpRequest.send()
}

postExample = (callback) => {

    requestData = [
        "gwern",
        "The_Amp_Walrus"
    ]

    // get request example
    uri = "http://localhost/redditfollowerapi/reddit/threads"
    method = 'POST'
    console.log("Querying follower api...")
    var httpRequest = new XMLHttpRequest()
    httpRequest.open(method, uri)
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.onload = function () {
        console.log("...done")
        if (httpRequest.status === 200) {
            var responseJson = JSON.parse(httpRequest.responseText);
            callback(responseJson)
        } else if (httpRequest.status === 404) {
            console.log('Request failed.  Returned status of ' + httpRequest.status);
        } else {
            console.log('Request failed.  Returned status of ' + httpRequest.status);
        }
    };
    requestString = JSON.stringify(requestData)
    httpRequest.send(requestString)
}

function logResult(response) {
    console.log(JSON.stringify(response));
}

function getTestResponse() {
    return JSON.parse(document.getElementById("test-response").innerText)
}

//postExample(logResult)

//logResult(getTestResponse())