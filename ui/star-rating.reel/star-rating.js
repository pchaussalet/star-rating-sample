/**
 * @module ui/star-rating.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component,

    DEFAULT_NUMBER_STAR = 5;

/**
 * @class StarRating
 * @extends Component
 */
exports.StarRating = Component.specialize(/** @lends StarRating# */ {


    /**
     * This Float property represents the rate that has been set.
     *
     * @type {Float}
     * @default 0
     */
    value: {
        set: function(value) {
            if (!isNaN(value)) {
                var number = +value;

                if (number >= 0) {
                    this._value = number > this.numberStar ? this._numberStar : number;
                    this.needsDraw = true;
                }
            }
        },
        get: function() {
            return this._value;
        }
    },

    _value: {
        value: 0
    },


    /**
     * This Integer property indicates the number of stars to display.
     *
     * @type {Integer}
     * @default 5
     */
    numberStar: {
        set: function(numberStar) {
            if (!isNaN(numberStar)) {
                var number = parseInt(numberStar);

                if (number && this._numberStar !== number) {
                    this._numberStar = number;
                    this._value = 0;
                    this.needsDraw = true;
                }
            }
        },
        get: function() {
            if (!this._numberStar) {
                this._numberStar = DEFAULT_NUMBER_STAR;
            }

            return this._numberStar;
        }
    },

    _numberStar: {
        value: null
    },


    /**
     * This Boolean property indicates that the user cannot modify the value,
     * whether its value is set to true.
     *
     * @type {Boolean}
     * @default false
     */
    readOnly: {
        set: function(readOnly) {
            this._readOnly = !!readOnly;

            if (this._readOnly) {
                this.classList.add("readOnly");
                this._preventRating();
            } else {
                this.classList.remove("readOnly");
                this._permitRating();
            }
        },
        get: function() {
            return this._readOnly;
        }
    },

    _readOnly: {
        value: false
    },


    /**
     * This Boolean property indicates that the user can half-fill the stars.
     * Setting to true this property will also set the private property _step to 0.5.
     *
     * @type {Boolean}
     * @default false
     */
    halfStar: {
        set: function(bool) {
            this._halfStar = !!bool;

            if (this._halfStar) {
                this._step = 0.5;
            } else {
                this._step = 1;
            }
        },
        get: function() {
            return this._halfStar;
        }
    },

    _halfStar: {
        value: false
    },


    /**
     * This Integer property allows to fill the stars with a precision.
     *
     * Examples:
     *
     * 1: Stars will be filled one after one.
     * 0.5: Stars will be half-filled.
     * 0: Stars will be filled with the smallest precision.
     *
     * @type {Integer}
     * @default 1
     * @private
     */
    _step: {
        value: 1
    },


    /**
     * This Boolean property indicates wheter the Star-Rating Component is in its "rating state".
     *
     * @type {Boolean}
     * @default false
     * @private
     */
    _isRating: {
        value: false
    },


    _offsetWidth: {
        value: null
    },


    _offsetLeft: {
        value: null
    },


    /**
     * This property keeps the unique ID of a Touch object,
     * which identify the point of contact with the touch surface that has triggered the rating mechanism.
     *
     * @type {Number}
     * @default null
     * @private
     */
    _observedPointer: {
        value: null
    },


    enterDocument: {
        value: function (firstime) {
            if (firstime && !this._readOnly) {
                this._permitRating();
            }
        }
    },


    leaveDocument: {
        value: function () {
            this._preventRating();
            this._removeEventListeners();
        }
    },


    /**
     * Privates Functions.
     *
     */


    _permitRating: {
        value: function () {
            if (window.Touch) { /** IOS - Android **/
            this._element.addEventListener("touchstart", this, true);

            } else if (window.PointerEvent) { /** Windows Phone - IE 11 **/
            this._element.addEventListener("pointerenter", this, true);

            } else { /** Mouse events **/
            this._element.addEventListener("mouseenter", this, true);
            }
        }
    },


    _preventRating: {
        value: function () {
            if (window.Touch) {
                this._element.removeEventListener("touchstart", this, true);

            } else if (window.PointerEvent) {
                this._element.removeEventListener("pointerenter", this, true);

            } else {
                this._element.removeEventListener("mouseenter", this, true);
            }
        }
    },


    _addEventListeners: {
        value: function () {
            if (window.Touch) {
                this._element.addEventListener("touchmove", this, true);
                this._element.addEventListener("touchcancel", this, true);
                this._element.addEventListener("touchend", this, true);

            } else if (window.PointerEvent) {
                this._element.addEventListener("pointermove", this, true);
                this._element.addEventListener("pointercancel", this, true);
                this._element.addEventListener("pointerleave", this, true);
                this._element.addEventListener("pointerup", this, true);

            } else {
                this._element.addEventListener("mousemove", this, true);
                this._element.addEventListener("mouseleave", this, true);
                this._element.addEventListener("click", this, true);
            }
        }
    },


    _removeEventListeners: {
        value: function () {
            if (window.Touch) {
                this._element.removeEventListener("touchmove", this, true);
                this._element.removeEventListener("touchcancel", this, true);
                this._element.removeEventListener("touchend", this, true);

            } else if (window.PointerEvent) {
                this._element.removeEventListener("pointermove", this, true);
                this._element.removeEventListener("pointercancel", this, true);
                this._element.removeEventListener("pointerleave", this, true);
                this._element.removeEventListener("pointerup", this, true);

            } else {
                this._element.removeEventListener("mousemove", this, true);
                this._element.removeEventListener("mouseleave", this, true);
                this._element.removeEventListener("click", this, true);
            }
        }
    },


    /**
     * Converts the position of the current pointer to a valid rate.
     *
     * @function
     * @private
     * @param {Integer} positionX - relative coordinate within a star Element.
     * @param {Integer} startWidth - the width of a star Element.
     * @return {Float} the rate computed from coordinate,
     * or will returns the value 0 whether the coordinate X is outside of the Star-Rating Component.
     *
     */
    _convertPositionToValue: {
        value: function (positionX, startWidth) {
            var precision = 0,
                result = 0;

            if (this._step > 0) {
                precision = 1 / this._step;
            }

            if (positionX >= 0 && positionX <= startWidth) {
                result = positionX / startWidth;
            }

            return precision > 0 ? Math.ceil(result * precision) / precision : result;
        }
    },


    /**
     * Handlers functions.
     *
     */


    _handleRatingStart: {
        value: function () {
            this._addEventListeners();
            this._isRating = true;
        }
    },


    captureMouseenter: {
        value: function (event) {
            if (event && event.target === this._element) {
                this._handleRatingStart();
            }
        }
    },


    capturePointerenter: {
        value: function (event) {
            if (event && this._observedPointer === null) {
                this._observedPointer = event.pointerId;
                this._handleRatingStart();
                this._handleRating(event.target.component, event.clientX);
            }
        }
    },


    captureTouchstart: {
        value: function (event) {
            if (event && event.targetTouches && event.targetTouches.length === 1) {
                this._observedPointer = event.targetTouches[0].identifier;
                this._handleRatingStart();
                this._handleRating(event.target.component, event.targetTouches[0].clientX);
            }
        }
    },


    _handleRating: {
        value: function (star, positionX) {
            var relativePositionX = star.getRelativePositionX(positionX),
                newValue = star.index + this._convertPositionToValue(relativePositionX, star._svgOffsetWidth);

            if (newValue > 0 && this._ratingValue !== newValue) {
                this._ratingValue = newValue;
                this.needsDraw = true;
            }
        }
    },


    captureMousemove: {
        value: function (event) {
            if (event && event.clientX) {
                this._handleRating(event.target.component, event.clientX);
                this._isRating = true; // for mouse pointer when outside
            }
        }
    },


    capturePointermove: {
        value: function (event) {
            if (event && event.clientX && event.pointerId === this._observedPointer) {
                this._handleRating(event.target.component, event.clientX);
            }
        }
    },


    captureTouchmove: {
        value: function (event) {
            if (event && event.changedTouches) {
                var i = 0, len = event.changedTouches.length;

                while (i < len && event.changedTouches[i].identifier !== this._observedPointer) {
                    i++;
                }

                if (i < len) {
                    event.preventDefault();
                    this._handleRating(event.target.component, event.changedTouches[i].clientX);
                }
            }
        }
    },


    _handleRatingCancel: {
        value: function () {
            this._ratingValue = 0;
            this._isRating = false;
            this._removeEventListeners();

            this.needsDraw = true;
        }
    },


    captureTouchcancel: {
        value: function () {
            this._handleRatingCancel();
        }
    },


    capturePointercancel: {
        value: function (event) {
            if (event && event.pointerId === this._observedPointer) {
                this._handleRatingCancel();
                this._observedPointer = null;
            }
        }
    },


    captureMouseleave: {
        value: function (event) {
            if (this._element === event.target) {
                this._handleRatingCancel();
            }
        }
    },


    capturePointerleave: {
        value: function (event) {
            if (event && event.pointerId === this._observedPointer) {
                this._handleRatingCancel();
                this._observedPointer = null;
            }
        }
    },


    _handleRatingEnd: {
        value: function () {
            if (this._isRating) {
                this._isRating = false;
                this.value = this._ratingValue;
            }
        }
    },


    captureClick: {
        value: function () {
            this._handleRatingEnd();
        }
    },


    capturePointerup: {
        value: function (event) {
            if (event && event.pointerId === this._observedPointer) {
                this._handleRatingEnd();
                this._removeEventListeners();
                this._observedPointer = null;
            }
        }
    },


    captureTouchend: {
        value: function (event) {
            if (event && event.changedTouches) {
                var i = 0, len = event.changedTouches.length;

                while (i < len && event.changedTouches[i].identifier !== this._observedPointer) {
                    i++;
                }

                if (i < len) {
                    this._handleRatingEnd();
                    this._removeEventListeners();
                }
            }
        }
    },


    /**
     * Draw cycle functions.
     *
     */


    willDraw: {
        value: function () {
            this._offsetWidth = this._element.offsetWidth;
            this._offsetLeft = this._element.offsetLeft;
        }
    },


    draw: {
        value: function () {
            var rate = this._isRating ? this._ratingValue : this._value,
                stars = this.templateObjects.stars.iterations,
                iteration,
                star;

            if (stars) {
                for (var i = 0, length = stars.length; i < length; i++) {
                    iteration = stars[i];

                    if (iteration && iteration._childComponents) {
                        star = iteration._childComponents[0];

                        if (rate > 0) {
                            star.isActive = this._isRating;
                            star.value = --rate > 0 ? 1 : rate + 1;
                        } else {
                            star.isActive = star.value = 0;
                        }
                    }
                }
            }
        }
    }


});
