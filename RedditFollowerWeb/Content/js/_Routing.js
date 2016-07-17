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
    "CancelAddUserButtonClick",
    "RemoveUserClick"
]
Observer.addEvents(UIEvents)
Observer.subscribe("AddUserButtonClick", UIController.onAddUserButtonClick)
Observer.subscribe("CancelAddUserButtonClick", UIController.onCancelAddUserButtonClick)
Observer.subscribe("LoadButtonClick", UIController.onLoadButtonClick)
Observer.subscribe("UserEntryButtonClick", UIController.onUserEntryButtonClick)
Observer.subscribe("RemoveUserClick", UIController.onRemoveUserClick)

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
    "UserInfoModelUpdate",
    "AddUserModelUpdate"
]
Observer.addEvents(ModelEvents)
Observer.subscribe("UserModelUpdate", ModelUpdateController.onUserModelUpdate)
Observer.subscribe("ThreadModelUpdate", ModelUpdateController.onThreadModelUpdate)
Observer.subscribe("LoadingModelUpdate", ModelUpdateController.onLoadingModelUpdate)
Observer.subscribe("AddUserModelUpdate", ModelUpdateController.onAddUserModelUpdate)
Observer.subscribe("UserInfoModelUpdate", ModelUpdateController.onUserInfoModelUpdate)
