/**
 * @module ui/linear-gradient.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class LinearGradient
 * @extends Component
 */
var LinearGradient = exports.LinearGradient = Component.specialize(/** @lends LinearGradient# */ {


    _linearGradientElement: {
        value: null
    },


    _firstStopElement: {
        value: null
    },


    _lastStopElement: {
        value: null
    },


    _firstStopOffset: {
        value: 0
    },


    firstStopOffset: {
        set: function (value) {
            if (!isNaN(value)) {
                this._firstStopOffset = Math.round(value);
                this.needsDraw = true;
            }
        },
        get: function () {
            return this._firstStopOffset;
        }
    },


    _lastStopOffset: {
        value: null
    },


    lastStopOffset: {
        set: function (value) {
            if (!isNaN(value)) {
                this._lastStopOffset = Math.round(value);
                this.needsDraw = true;
            }
        },
        get: function () {
            return this._lastStopOffset;
        }
    },


    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this._linearGradientElement.setAttribute("id", this.uuid);
            }
        }
    },


    draw: {
        value: function () {
            if (typeof this._firstStopOffset === "number") {
                this._firstStopElement.setAttribute("offset", this._firstStopOffset + "%");
            }

            if (typeof this._lastStopOffset === "number") {
                this._lastStopElement.setAttribute("offset", this._lastStopOffset + "%");
            }
        }
    }

});
