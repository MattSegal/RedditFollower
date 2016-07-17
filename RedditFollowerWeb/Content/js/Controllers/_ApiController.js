var ApiController = {

    onSuccessfulApiResponse: function (response) {
        UserModel.updateUsers(response["users"])
        ThreadModel.updateThreads(response["threads"])
        Observer.publish("LoadingComplete")
    },

    onFailedApiResponse: function () {
        UserModel.setAllUsersToFailed()
        Observer.publish("LoadingComplete")
    },

    onLoadingComplete: function () {
        AddUserButtonModel.closeAddUserDialogue()
        LoadingButtonModel.stopLoading()
    },

}