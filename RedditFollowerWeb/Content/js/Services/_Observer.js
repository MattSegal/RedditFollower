var Observer = {
    subs: {},
    publish: function (eventName, eventData) {
        if (this._eventExists(eventName)) {
            var length = this.subs[eventName].length
            for (var i = 0; i < length; i++) {
                this.subs[eventName][i](eventData)
            }
        } else {
            console.warn("Observer: no such event as " + eventName)
        }
    },
    subscribe: function (eventName, callback) {
        if (this._eventExists(eventName)) {
            this.subs[eventName].push(callback)
        } else {
            console.warn("Observer: no such event as " + eventName)
        }
    },
    addEvent: function(eventName) {
        if (this.subs[eventName] === undefined) {
            this.subs[eventName] = []
        } else {
            console.warn("Observer: event already exists - " + eventName)
        }
    },
    addEvents: function(eventNames) {
        eventNames.map((event) => this.addEvent(event))
    },
    _getEventNames: function () {
        return Object.keys(this.subs)
    },
    _eventExists: function (eventName) {
        return this._getEventNames().contains(eventName)
    },
}

/*
// Example
muhCallback = () => console.log("yay this worked")
muhOtherCallback = (msg) => console.log("msg")

Observer.addEvent("test")
Observer.subscribe("test", muhCallback)

Observer.addEvent("test2")
Observer.subscribe("test2", muhOtherCallback)

Observer.publish("test", "woooo!")
Observer.publish("test2", "woooo!")

// Output: yay this worked
// Output: woooo!
*/