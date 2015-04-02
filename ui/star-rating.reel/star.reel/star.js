/**
 * @module ui/star.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component,
    PARAM_ATTRIBUTE = "data-param";

/**
 * @class Star
 * @extends Component
 */
exports.Star = Component.specialize(/** @lends Star# */ {

    templateDidLoad:{
        value: function (documentPart) {
            if (this._element && this._element.children.length === 0) { // Content by default
                var element = documentPart.fragment.querySelector("div[" + PARAM_ATTRIBUTE + "]"),
                    range = this._element.ownerDocument.createRange();

                range.selectNodeContents(element);
                element.parentNode.replaceChild(range.extractContents(), element);

                documentPart.parameters = {}; // no more parameters
            }
        }
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this._svgElement = this._element.querySelector("svg");

                if (!this._svgElement) {
                    throw new Error("Star Rating Component requires a SVG element");
                }
            }
        }
    },

    _svgElement: {
        value: null
    },

    linearGradient: {
        value: null
    },

    _value: {
        value: 0
    },

    _svgOffsetWidth: {
        value: null
    },

    _svgOffsetLeft: {
        value: null
    },

    value: {
        set: function (value) {
            // fixme there is a bug within frb,
            // the property value is set during the firstDraw with the wrong value

            if (!isNaN(value)) {
                var rate = +value;

                if (rate >= 0 && rate <= 1 && this._value !== rate) {
                    this._value = rate;
                    this.needsDraw = true;
                }
            }
        },
        get: function () {
            return this._value;
        }
    },

    _isActive: {
        value: false
    },

    isActive: {
        set: function (bool) {
            var active = !!bool;

            if (this._isActive !== active) {
                this._isActive = active;
                this.needsDraw = true;
            }
        },
        get: function () {
            return this._isActive;
        }
    },

    getRelativePositionX: {
        value: function (x) {
            var startXPositionSvg = this._svgOffsetLeft,
                endXPositionSvg = this._svgOffsetLeft + this._svgOffsetWidth;

            /*
             * Position inside svg element find relative position within this svg element
             */
            if (x >= startXPositionSvg && x <= endXPositionSvg) { // in
                return x - startXPositionSvg;
            }

            /*
             * Position outside svg element but on its right side.
             * So, will return a fake relative position in order to let the Star-Rating component
             * to believe we reached 100% of the svg element.
             */
            if (x > endXPositionSvg) {
                return this._svgOffsetWidth;
            }

            return 0;
        }
    },

    willDraw: {
        value: function () {
            this._svgOffsetWidth = this._svgElement.offsetWidth;
            this._svgOffsetLeft = this._svgElement.offsetLeft;
        }
    },

    draw: {
        value: function () {
            if (!this._svgElement.classList.contains('StarRatingItem-star')) {
                this._svgElement.classList.add('StarRatingItem-star');
                this._svgElement.style.fill = "url('#" + this.linearGradient.uuid + "')";
            }

            if (this._value > 0) {
                if (this._isActive) {
                    this._element.classList.add("active");
                    this._element.classList.remove("value");
                } else {
                    this._element.classList.add("value");
                    this._element.classList.remove("active");
                }
            } else {
                this._element.classList.remove("active");
                this._element.classList.remove("value");
            }

            this.linearGradient.firstStopOffset = this._value * 100;
            //this.linearGradient.needsDraw = true;
        }
    }

});
