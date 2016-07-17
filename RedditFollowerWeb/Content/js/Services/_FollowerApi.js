FollowerApi = {
    call: (userList, successCallback, failureCallback) => {
        if (userList.length === 0) {
            successCallback({ users: [], threads: [] })
            return
        }
        uri = "http://localhost/redditfollowerapi/reddit/threads"
        method = 'POST'
        console.log("Querying follower api...")
        var httpRequest = new XMLHttpRequest()
        httpRequest.open(method, uri)
        httpRequest.setRequestHeader('Content-Type', 'application/json');
        httpRequest.onload = function () {
            console.log("...done")
            if (httpRequest.status === 200) {
                //console.log(httpRequest.responseText)
                var responseObject = JSON.parse(httpRequest.responseText);
                successCallback(responseObject)
            } else if (httpRequest.status === 404) {
                console.log('Request failed.  Returned status of ' + httpRequest.status);
                failureCallback()
            } else {
                console.log('Request failed.  Returned status of ' + httpRequest.status);
                failureCallback()
            }
        };
        requestString = JSON.stringify(userList)
        console.log("Request: " + requestString)
        httpRequest.send(requestString)
    },
    logResult: function(response) {
        console.log(JSON.stringify(response));
    }
}

//FollowerApi.call(['The_Amp_Walrus'],logResult)
