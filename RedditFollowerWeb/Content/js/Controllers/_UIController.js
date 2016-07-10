var UIController = {

    onUserEntryButtonClick: function (user) { // this name kind of sucks
        if (LoadingButtonModel.isLoading) {
            return
        }
        if (user.Username == UserInfoModel.currentUser && UserInfoModel.isOpen()) {
            UserInfoModel.close()
        } else {
            UserInfoModel.open(user)
        }
    },

    onLoadButtonClick: function () {
        LoadingButtonModel.startLoading()
        UserInfoModel.close()

        var users = UserModel.usernames()
        var successCallback = ApiController.onSuccessfulApiResponse
        var failureCallback = ApiController.onFailedApiResponse
        FollowerApi.call(users, successCallback, failureCallback)
    },

    onAddUserButtonClick: function () {
        console.log("AddUser")
    },

}

// UI State
/*
User can be active or inactive - this will change update logic
Inactive - grey
Active - light blue
Success - green
Fail - red

User Dashboard
- Toggle activity button => Set to Inactive / Set to Active
- delete use button => Do it! Do it now! / Cancel
- Info about the user
    - not loaded / loaded / failed to load (error code in here)

*/