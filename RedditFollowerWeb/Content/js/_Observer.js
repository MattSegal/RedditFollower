var Observer = {
    publish: function (eventName,eventData) {
        if (Object.keys(this.subs).contains(eventName)) {
            var length = this.subs[eventName].length
            for (var i = 0; i < length; i++) {
                this.subs[eventName][i](eventData)
            }
        } else {
            console.warn("Observer: no such event as " + eventName)
        }
    },
    subscribe: function (eventName,callback) {
        this.subs[eventName].push(callback)
    },
    addEvent: function(eventName) {
        if (this.subs[eventName] === undefined) {
            this.subs[eventName] = []
        } else {
            console.warn("Observer: event already exists - " + eventName)
        }
    },
    subs: {},
}

// Example
//function muhCallback() {
//    console.log("yay this worked")
//}
//Observer.addEvent("test")
//Observer.subscribe("test", muhCallback)
//Observer.publish("test", "I hope this worked")