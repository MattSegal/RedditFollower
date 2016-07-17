var UIController = {

    onUserEntryButtonClick: function (user) { // this name kind of sucks
        if (LoadingButtonModel.isLoading) {
            return
        }
        if (user.Username == UserInfoModel.currentUser && UserInfoModel.isOpen()) {
            UserInfoModel.close()
        } else {
            AddUserButtonModel.closeAddUserDialogue()
            UserInfoModel.open(user)
        }
    },

    onLoadButtonClick: function () {
        LoadingButtonModel.startLoading()
        UserInfoModel.close()
        AddUserButtonModel.hide()

        var users = UserModel.usernames()
        var successCallback = ApiController.onSuccessfulApiResponse
        var failureCallback = ApiController.onFailedApiResponse
        FollowerApi.call(users, successCallback, failureCallback)
    },

    onCancelAddUserButtonClick: function () {
        AddUserButtonModel.closeAddUserDialogue()
    },

    onRemoveUserClick: function () {
        UserModel.removeUser(UserInfoModel.currentUser)
        UserInfoModel.close()
    },

    onAddUserButtonClick: function () {
        if (LoadingButtonModel.isLoading) {
            return
        }
        if (AddUserButtonModel.isInDialogue)
        {
            var newUsername = document.getElementById("new-user-name").value
            UserModel.addNewUser(newUsername)
        }
        UserInfoModel.close()

        // not sure why I'm doing it like this
        var notInDialogue = !(AddUserButtonModel.isInDialogue)
        var notInDashboard = !(AddUserButtonModel.isInDashbuttons)

        if (notInDialogue) {
            AddUserButtonModel.openAddUserDialogue()
        }
        if (notInDashboard) {
            AddUserButtonModel.closeAddUserDialogue()
        }
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