Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

Array.prototype.remove = function (obj) {
    if (this.contains(obj)) {
        var idx = this.indexOf(obj)
        this.splice(idx,1)
    }
    return this;
}


String.prototype.isWhiteSpace = function () {
    return /^\s*$/.test(this.valueOf())
}

String.prototype.isUndefined = function () {
    return this.valueOf() === undefined
}

String.prototype.isEmpty = function () {
    return this.isWhiteSpace() || this.isUndefined()
}

var Logger = {
    logLevels: {
        "SILENT": 0,
        "LOG": 1,
        "VERBOSE": 2
    },
    logLevel: 0, 
    setLogLevel: function(level) {
        if (Object.keys(this.logLevels).contains(level)) {
            this.logLevel = this.logLevels[level]
        } else {
            console.warn("Logger - log level "+level+" does not exist.")
        }
    },
    log: function (msg) {
        if (this.logLevel != this.logLevels.SILENT) {
            console.warn(msg)
        }
    },
    logVerbose: function (msg) {
        if (this.logLevel != this.logLevels.SILENT && this.logLevel != this.logLevels.NORMAL) {
            console.warn(msg)
        }
    },
}

var decodeEntities = (function () {
    // this prevents any overhead from creating the object each time
    var element = document.createElement('div');

    function decodeHTMLEntities(str) {
        if (str && typeof str === 'string') {
            // strip script/html tags
            str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
            str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
        }

        return str;
    }

    return decodeHTMLEntities;
})();