/*
 Control Flow
 * Observer observes events
 * Components and models publish events
 * Controllers consume events
 * Controllers inspect model state and do stuff
        * update state
        * render things
        * etc
*/

// Setup Observer
// UIController subscriptions
var UIEvents = [
    "AddUserButtonClick",
    "LoadButtonClick",
    "UserEntryButtonClick",
]
Observer.addEvents(UIEvents)
Observer.subscribe("AddUserButtonClick", UIController.onAddUserButtonClick)
Observer.subscribe("LoadButtonClick", UIController.onLoadButtonClick)
Observer.subscribe("UserEntryButtonClick", UIController.onUserEntryButtonClick)

// ApiController subscriptions
var ApiEvents = [
    "LoadingComplete",
]
Observer.addEvents(ApiEvents)
Observer.subscribe("LoadingComplete", ApiController.onLoadingComplete)

// ModelUpdateController subscriptions
var ModelEvents = [
    "UserModelUpdate",
    "ThreadModelUpdate",
    "LoadingModelUpdate",
    "UserInfoModelUpdate"
]
Observer.addEvents(ModelEvents)
Observer.subscribe("UserModelUpdate", ModelUpdateController.onUserModelUpdate)
Observer.subscribe("ThreadModelUpdate", ModelUpdateController.onThreadModelUpdate)
Observer.subscribe("LoadingModelUpdate", ModelUpdateController.onLoadingModelUpdate)
Observer.subscribe("UserInfoModelUpdate", ModelUpdateController.onUserInfoModelUpdate)
