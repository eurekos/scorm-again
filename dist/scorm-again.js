(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = debounce;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Scorm12API2 = _interopRequireDefault(require("./Scorm12API"));

var _aicc_cmi = require("./cmi/aicc_cmi");

var _scorm12_cmi = require("./cmi/scorm12_cmi");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * The AICC API class
 */
var AICC = /*#__PURE__*/function (_Scorm12API) {
  _inherits(AICC, _Scorm12API);

  var _super = _createSuper(AICC);

  /**
   * Constructor to create AICC API object
   * @param {object} settings
   */
  function AICC(settings) {
    var _this;

    _classCallCheck(this, AICC);

    var finalSettings = _objectSpread(_objectSpread({}, {
      mastery_override: false
    }), settings);

    _this = _super.call(this, finalSettings);
    _this.cmi = new _aicc_cmi.CMI();
    _this.nav = new _scorm12_cmi.NAV();
    return _this;
  }
  /**
   * Gets or builds a new child element to add to the array.
   *
   * @param {string} CMIElement
   * @param {any} value
   * @param {boolean} foundFirstIndex
   * @return {object}
   */


  _createClass(AICC, [{
    key: "getChildElement",
    value: function getChildElement(CMIElement, value, foundFirstIndex) {
      var newChild = _get(_getPrototypeOf(AICC.prototype), "getChildElement", this).call(this, CMIElement, value, foundFirstIndex);

      if (!newChild) {
        if (this.stringMatches(CMIElement, 'cmi\\.evaluation\\.comments\\.\\d+')) {
          newChild = new _aicc_cmi.CMIEvaluationCommentsObject();
        } else if (this.stringMatches(CMIElement, 'cmi\\.student_data\\.tries\\.\\d+')) {
          newChild = new _aicc_cmi.CMITriesObject();
        } else if (this.stringMatches(CMIElement, 'cmi\\.student_data\\.attempt_records\\.\\d+')) {
          newChild = new _aicc_cmi.CMIAttemptRecordsObject();
        }
      }

      return newChild;
    }
    /**
     * Replace the whole API with another
     *
     * @param {AICC} newAPI
     */

  }, {
    key: "replaceWithAnotherScormAPI",
    value: function replaceWithAnotherScormAPI(newAPI) {
      // Data Model
      this.cmi = newAPI.cmi;
      this.nav = newAPI.nav;
    }
  }]);

  return AICC;
}(_Scorm12API2["default"]);

exports["default"] = AICC;

},{"./Scorm12API":4,"./cmi/aicc_cmi":6,"./cmi/scorm12_cmi":8}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _common = require("./cmi/common");

var _exceptions = require("./exceptions");

var _error_codes2 = _interopRequireDefault(require("./constants/error_codes"));

var _api_constants = _interopRequireDefault(require("./constants/api_constants"));

var _utilities = require("./utilities");

var _lodash = _interopRequireDefault(require("lodash.debounce"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

var global_constants = _api_constants["default"].global;
var scorm12_error_codes = _error_codes2["default"].scorm12;
/**
 * Base API class for AICC, SCORM 1.2, and SCORM 2004. Should be considered
 * abstract, and never initialized on it's own.
 */

var _timeout = new WeakMap();

var _error_codes = new WeakMap();

var _settings = new WeakMap();

var BaseAPI = /*#__PURE__*/function () {
  /**
   * Constructor for Base API class. Sets some shared API fields, as well as
   * sets up options for the API.
   * @param {object} error_codes
   * @param {object} settings
   */
  function BaseAPI(error_codes, settings) {
    _classCallCheck(this, BaseAPI);

    _timeout.set(this, {
      writable: true,
      value: void 0
    });

    _error_codes.set(this, {
      writable: true,
      value: void 0
    });

    _settings.set(this, {
      writable: true,
      value: {
        autocommit: false,
        autocommitSeconds: 10,
        asyncCommit: false,
        sendBeaconCommit: false,
        lmsCommitUrl: false,
        dataCommitFormat: 'json',
        // valid formats are 'json' or 'flattened', 'params'
        commitRequestDataType: 'application/json;charset=UTF-8',
        autoProgress: false,
        logLevel: global_constants.LOG_LEVEL_ERROR,
        selfReportSessionTime: false,
        responseHandler: function responseHandler(xhr) {
          var result;

          if (typeof xhr !== 'undefined') {
            result = JSON.parse(xhr.responseText);

            if (result === null || !{}.hasOwnProperty.call(result, 'result')) {
              result = {};

              if (xhr.status === 200) {
                result.result = global_constants.SCORM_TRUE;
              } else {
                result.result = global_constants.SCORM_FALSE;
                result.errorCode = 101;
              }
            }
          }

          return result;
        }
      }
    });

    _defineProperty(this, "cmi", void 0);

    _defineProperty(this, "startingData", void 0);

    if ((this instanceof BaseAPI ? this.constructor : void 0) === BaseAPI) {
      throw new TypeError('Cannot construct BaseAPI instances directly');
    }

    this.currentState = global_constants.STATE_NOT_INITIALIZED;
    this.lastErrorCode = 0;
    this.listenerArray = [];

    _classPrivateFieldSet(this, _timeout, null);

    _classPrivateFieldSet(this, _error_codes, error_codes);

    this.settings = settings;
    this.apiLogLevel = this.settings.logLevel;
    this.selfReportSessionTime = this.settings.selfReportSessionTime;
  }
  /**
   * Initialize the API
   * @param {string} callbackName
   * @param {string} initializeMessage
   * @param {string} terminationMessage
   * @return {string}
   */


  _createClass(BaseAPI, [{
    key: "initialize",
    value: function initialize(callbackName, initializeMessage, terminationMessage) {
      var returnValue = global_constants.SCORM_FALSE;

      if (this.isInitialized()) {
        this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).INITIALIZED, initializeMessage);
      } else if (this.isTerminated()) {
        this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).TERMINATED, terminationMessage);
      } else {
        if (this.selfReportSessionTime) {
          this.cmi.setStartTime();
        }

        this.currentState = global_constants.STATE_INITIALIZED;
        this.lastErrorCode = 0;
        returnValue = global_constants.SCORM_TRUE;
        this.processListeners(callbackName);
      }

      this.apiLog(callbackName, null, 'returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      this.clearSCORMError(returnValue);
      return returnValue;
    }
    /**
     * Getter for #error_codes
     * @return {object}
     */

  }, {
    key: "terminate",

    /**
     * Terminates the current run of the API
     * @param {string} callbackName
     * @param {boolean} checkTerminated
     * @return {string}
     */
    value: function terminate(callbackName, checkTerminated) {
      var returnValue = global_constants.SCORM_FALSE;

      if (this.checkState(checkTerminated, _classPrivateFieldGet(this, _error_codes).TERMINATION_BEFORE_INIT, _classPrivateFieldGet(this, _error_codes).MULTIPLE_TERMINATION)) {
        this.currentState = global_constants.STATE_TERMINATED;
        var result = this.storeData(true);

        if (!this.settings.sendBeaconCommit && !this.settings.asyncCommit && typeof result.errorCode !== 'undefined' && result.errorCode > 0) {
          this.throwSCORMError(result.errorCode);
        }

        returnValue = typeof result !== 'undefined' && result.result ? result.result : global_constants.SCORM_FALSE;
        if (checkTerminated) this.lastErrorCode = 0;
        returnValue = global_constants.SCORM_TRUE;
        this.processListeners(callbackName);
      }

      this.apiLog(callbackName, null, 'returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      this.clearSCORMError(returnValue);
      return returnValue;
    }
    /**
     * Get the value of the CMIElement.
     *
     * @param {string} callbackName
     * @param {boolean} checkTerminated
     * @param {string} CMIElement
     * @return {string}
     */

  }, {
    key: "getValue",
    value: function getValue(callbackName, checkTerminated, CMIElement) {
      var returnValue;

      if (this.checkState(checkTerminated, _classPrivateFieldGet(this, _error_codes).RETRIEVE_BEFORE_INIT, _classPrivateFieldGet(this, _error_codes).RETRIEVE_AFTER_TERM)) {
        if (checkTerminated) this.lastErrorCode = 0;
        returnValue = this.getCMIValue(CMIElement);
        this.processListeners(callbackName, CMIElement);
      }

      this.apiLog(callbackName, CMIElement, ': returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      this.clearSCORMError(returnValue);
      return returnValue;
    }
    /**
     * Sets the value of the CMIElement.
     *
     * @param {string} callbackName
     * @param {boolean} checkTerminated
     * @param {string} CMIElement
     * @param {*} value
     * @return {string}
     */

  }, {
    key: "setValue",
    value: function setValue(callbackName, checkTerminated, CMIElement, value) {
      if (value !== undefined) {
        value = String(value);
      }

      var returnValue = global_constants.SCORM_FALSE;

      if (this.checkState(checkTerminated, _classPrivateFieldGet(this, _error_codes).STORE_BEFORE_INIT, _classPrivateFieldGet(this, _error_codes).STORE_AFTER_TERM)) {
        if (checkTerminated) this.lastErrorCode = 0;

        try {
          returnValue = this.setCMIValue(CMIElement, value);
        } catch (e) {
          if (e instanceof _exceptions.ValidationError) {
            this.lastErrorCode = e.errorCode;
            returnValue = global_constants.SCORM_FALSE;
          } else {
            if (e.message) {
              console.error(e.message);
            } else {
              console.error(e);
            }

            this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).GENERAL);
          }
        }

        this.processListeners(callbackName, CMIElement, value);
      }

      if (returnValue === undefined) {
        returnValue = global_constants.SCORM_FALSE;
      } // If we didn't have any errors while setting the data, go ahead and
      // schedule a commit, if autocommit is turned on


      if (String(this.lastErrorCode) === '0') {
        if (this.settings.autocommit && !_classPrivateFieldGet(this, _timeout)) {
          this.scheduleCommit(this.settings.autocommitSeconds * 1000);
        }
      }

      this.apiLog(callbackName, CMIElement, ': ' + value + ': result: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      this.clearSCORMError(returnValue);
      return returnValue;
    }
    /**
     * Orders LMS to store all content parameters
     * @param {string} callbackName
     * @param {boolean} checkTerminated
     * @return {string}
     */

  }, {
    key: "commit",
    value: function commit(callbackName, checkTerminated) {
      this.clearScheduledCommit();
      var returnValue = global_constants.SCORM_FALSE;

      if (this.checkState(checkTerminated, _classPrivateFieldGet(this, _error_codes).COMMIT_BEFORE_INIT, _classPrivateFieldGet(this, _error_codes).COMMIT_AFTER_TERM)) {
        var result = this.storeData(false);

        if (!this.settings.sendBeaconCommit && !this.settings.asyncCommit && result.errorCode && result.errorCode > 0) {
          this.throwSCORMError(result.errorCode);
        }

        returnValue = typeof result !== 'undefined' && result.result ? result.result : global_constants.SCORM_FALSE;
        this.apiLog(callbackName, 'HttpRequest', ' Result: ' + returnValue, global_constants.LOG_LEVEL_DEBUG);
        if (checkTerminated) this.lastErrorCode = 0;
        this.processListeners(callbackName);
      }

      this.apiLog(callbackName, null, 'returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      this.clearSCORMError(returnValue);
      return returnValue;
    }
    /**
     * Returns last error code
     * @param {string} callbackName
     * @return {string}
     */

  }, {
    key: "getLastError",
    value: function getLastError(callbackName) {
      var returnValue = String(this.lastErrorCode);
      this.processListeners(callbackName);
      this.apiLog(callbackName, null, 'returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      return returnValue;
    }
    /**
     * Returns the errorNumber error description
     *
     * @param {string} callbackName
     * @param {(string|number)} CMIErrorCode
     * @return {string}
     */

  }, {
    key: "getErrorString",
    value: function getErrorString(callbackName, CMIErrorCode) {
      var returnValue = '';

      if (CMIErrorCode !== null && CMIErrorCode !== '') {
        returnValue = this.getLmsErrorMessageDetails(CMIErrorCode);
        this.processListeners(callbackName);
      }

      this.apiLog(callbackName, null, 'returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      return returnValue;
    }
    /**
     * Returns a comprehensive description of the errorNumber error.
     *
     * @param {string} callbackName
     * @param {(string|number)} CMIErrorCode
     * @return {string}
     */

  }, {
    key: "getDiagnostic",
    value: function getDiagnostic(callbackName, CMIErrorCode) {
      var returnValue = '';

      if (CMIErrorCode !== null && CMIErrorCode !== '') {
        returnValue = this.getLmsErrorMessageDetails(CMIErrorCode, true);
        this.processListeners(callbackName);
      }

      this.apiLog(callbackName, null, 'returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      return returnValue;
    }
    /**
     * Checks the LMS state and ensures it has been initialized.
     *
     * @param {boolean} checkTerminated
     * @param {number} beforeInitError
     * @param {number} afterTermError
     * @return {boolean}
     */

  }, {
    key: "checkState",
    value: function checkState(checkTerminated, beforeInitError, afterTermError) {
      if (this.isNotInitialized()) {
        this.throwSCORMError(beforeInitError);
        return false;
      } else if (checkTerminated && this.isTerminated()) {
        this.throwSCORMError(afterTermError);
        return false;
      }

      return true;
    }
    /**
     * Logging for all SCORM actions
     *
     * @param {string} functionName
     * @param {string} CMIElement
     * @param {string} logMessage
     * @param {number}messageLevel
     */

  }, {
    key: "apiLog",
    value: function apiLog(functionName, CMIElement, logMessage, messageLevel) {
      logMessage = this.formatMessage(functionName, CMIElement, logMessage);

      if (messageLevel >= this.apiLogLevel) {
        switch (messageLevel) {
          case global_constants.LOG_LEVEL_ERROR:
            console.error(logMessage);
            break;

          case global_constants.LOG_LEVEL_WARNING:
            console.warn(logMessage);
            break;

          case global_constants.LOG_LEVEL_INFO:
            console.info(logMessage);
            break;

          case global_constants.LOG_LEVEL_DEBUG:
            if (console.debug) {
              console.debug(logMessage);
            } else {
              console.log(logMessage);
            }

            break;
        }
      }
    }
    /**
     * Formats the SCORM messages for easy reading
     *
     * @param {string} functionName
     * @param {string} CMIElement
     * @param {string} message
     * @return {string}
     */

  }, {
    key: "formatMessage",
    value: function formatMessage(functionName, CMIElement, message) {
      var baseLength = 20;
      var messageString = '';
      messageString += functionName;
      var fillChars = baseLength - messageString.length;

      for (var i = 0; i < fillChars; i++) {
        messageString += ' ';
      }

      messageString += ': ';

      if (CMIElement) {
        var CMIElementBaseLength = 70;
        messageString += CMIElement;
        fillChars = CMIElementBaseLength - messageString.length;

        for (var j = 0; j < fillChars; j++) {
          messageString += ' ';
        }
      }

      if (message) {
        messageString += message;
      }

      return messageString;
    }
    /**
     * Checks to see if {str} contains {tester}
     *
     * @param {string} str String to check against
     * @param {string} tester String to check for
     * @return {boolean}
     */

  }, {
    key: "stringMatches",
    value: function stringMatches(str, tester) {
      return str && tester && str.match(tester);
    }
    /**
     * Check to see if the specific object has the given property
     * @param {*} refObject
     * @param {string} attribute
     * @return {boolean}
     * @private
     */

  }, {
    key: "_checkObjectHasProperty",
    value: function _checkObjectHasProperty(refObject, attribute) {
      return Object.hasOwnProperty.call(refObject, attribute) || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(refObject), attribute) || attribute in refObject;
    }
    /**
     * Returns the message that corresponds to errorNumber
     * APIs that inherit BaseAPI should override this function
     *
     * @param {(string|number)} _errorNumber
     * @param {boolean} _detail
     * @return {string}
     * @abstract
     */

  }, {
    key: "getLmsErrorMessageDetails",
    value: function getLmsErrorMessageDetails(_errorNumber, _detail) {
      throw new Error('The getLmsErrorMessageDetails method has not been implemented');
    }
    /**
     * Gets the value for the specific element.
     * APIs that inherit BaseAPI should override this function
     *
     * @param {string} _CMIElement
     * @return {string}
     * @abstract
     */

  }, {
    key: "getCMIValue",
    value: function getCMIValue(_CMIElement) {
      throw new Error('The getCMIValue method has not been implemented');
    }
    /**
     * Sets the value for the specific element.
     * APIs that inherit BaseAPI should override this function
     *
     * @param {string} _CMIElement
     * @param {any} _value
     * @return {string}
     * @abstract
     */

  }, {
    key: "setCMIValue",
    value: function setCMIValue(_CMIElement, _value) {
      throw new Error('The setCMIValue method has not been implemented');
    }
    /**
     * Shared API method to set a valid for a given element.
     *
     * @param {string} methodName
     * @param {boolean} scorm2004
     * @param {string} CMIElement
     * @param {*} value
     * @return {string}
     */

  }, {
    key: "_commonSetCMIValue",
    value: function _commonSetCMIValue(methodName, scorm2004, CMIElement, value) {
      if (!CMIElement || CMIElement === '') {
        return global_constants.SCORM_FALSE;
      }

      var structure = CMIElement.split('.');
      var refObject = this;
      var returnValue = global_constants.SCORM_FALSE;
      var foundFirstIndex = false;
      var invalidErrorMessage = "The data model element passed to ".concat(methodName, " (").concat(CMIElement, ") is not a valid SCORM data model element.");
      var invalidErrorCode = scorm2004 ? _classPrivateFieldGet(this, _error_codes).UNDEFINED_DATA_MODEL : _classPrivateFieldGet(this, _error_codes).GENERAL;

      for (var i = 0; i < structure.length; i++) {
        var attribute = structure[i];

        if (i === structure.length - 1) {
          if (scorm2004 && attribute.substr(0, 8) === '{target=' && typeof refObject._isTargetValid == 'function') {
            this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).READ_ONLY_ELEMENT);
          } else if (!this._checkObjectHasProperty(refObject, attribute)) {
            this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
          } else {
            if (this.stringMatches(CMIElement, '\\.correct_responses\\.\\d+')) {
              this.validateCorrectResponse(CMIElement, value);
            }

            if (!scorm2004 || this.lastErrorCode === 0) {
              refObject[attribute] = value;
              returnValue = global_constants.SCORM_TRUE;
            }
          }
        } else {
          refObject = refObject[attribute];

          if (!refObject) {
            this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
            break;
          }

          if (refObject instanceof _common.CMIArray) {
            var index = parseInt(structure[i + 1], 10); // SCO is trying to set an item on an array

            if (!isNaN(index)) {
              var item = refObject.childArray[index];

              if (item) {
                refObject = item;
                foundFirstIndex = true;
              } else {
                var newChild = this.getChildElement(CMIElement, value, foundFirstIndex);
                foundFirstIndex = true;

                if (!newChild) {
                  this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
                } else {
                  if (refObject.initialized) newChild.initialize();
                  refObject.childArray.push(newChild);
                  refObject = newChild;
                }
              } // Have to update i value to skip the array position


              i++;
            }
          }
        }
      }

      if (returnValue === global_constants.SCORM_FALSE) {
        this.apiLog(methodName, null, "There was an error setting the value for: ".concat(CMIElement, ", value of: ").concat(value), global_constants.LOG_LEVEL_WARNING);
      }

      return returnValue;
    }
    /**
     * Abstract method for validating that a response is correct.
     *
     * @param {string} _CMIElement
     * @param {*} _value
     */

  }, {
    key: "validateCorrectResponse",
    value: function validateCorrectResponse(_CMIElement, _value) {// just a stub method
    }
    /**
     * Gets or builds a new child element to add to the array.
     * APIs that inherit BaseAPI should override this method.
     *
     * @param {string} _CMIElement - unused
     * @param {*} _value - unused
     * @param {boolean} _foundFirstIndex - unused
     * @return {*}
     * @abstract
     */

  }, {
    key: "getChildElement",
    value: function getChildElement(_CMIElement, _value, _foundFirstIndex) {
      throw new Error('The getChildElement method has not been implemented');
    }
    /**
     * Gets a value from the CMI Object
     *
     * @param {string} methodName
     * @param {boolean} scorm2004
     * @param {string} CMIElement
     * @return {*}
     */

  }, {
    key: "_commonGetCMIValue",
    value: function _commonGetCMIValue(methodName, scorm2004, CMIElement) {
      if (!CMIElement || CMIElement === '') {
        return '';
      }

      var structure = CMIElement.split('.');
      var refObject = this;
      var attribute = null;
      var uninitializedErrorMessage = "The data model element passed to ".concat(methodName, " (").concat(CMIElement, ") has not been initialized.");
      var invalidErrorMessage = "The data model element passed to ".concat(methodName, " (").concat(CMIElement, ") is not a valid SCORM data model element.");
      var invalidErrorCode = scorm2004 ? _classPrivateFieldGet(this, _error_codes).UNDEFINED_DATA_MODEL : _classPrivateFieldGet(this, _error_codes).GENERAL;

      for (var i = 0; i < structure.length; i++) {
        attribute = structure[i];

        if (!scorm2004) {
          if (i === structure.length - 1) {
            if (!this._checkObjectHasProperty(refObject, attribute)) {
              this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
              return;
            }
          }
        } else {
          if (String(attribute).substr(0, 8) === '{target=' && typeof refObject._isTargetValid == 'function') {
            var target = String(attribute).substr(8, String(attribute).length - 9);
            return refObject._isTargetValid(target);
          } else if (!this._checkObjectHasProperty(refObject, attribute)) {
            this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
            return;
          }
        }

        refObject = refObject[attribute];

        if (refObject === undefined) {
          this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
          break;
        }

        if (refObject instanceof _common.CMIArray) {
          var index = parseInt(structure[i + 1], 10); // SCO is trying to set an item on an array

          if (!isNaN(index)) {
            var item = refObject.childArray[index];

            if (item) {
              refObject = item;
            } else {
              this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).VALUE_NOT_INITIALIZED, uninitializedErrorMessage);
              break;
            } // Have to update i value to skip the array position


            i++;
          }
        }
      }

      if (refObject === null || refObject === undefined) {
        if (!scorm2004) {
          if (attribute === '_children') {
            this.throwSCORMError(scorm12_error_codes.CHILDREN_ERROR);
          } else if (attribute === '_count') {
            this.throwSCORMError(scorm12_error_codes.COUNT_ERROR);
          }
        }
      } else {
        return refObject;
      }
    }
    /**
     * Returns true if the API's current state is STATE_INITIALIZED
     *
     * @return {boolean}
     */

  }, {
    key: "isInitialized",
    value: function isInitialized() {
      return this.currentState === global_constants.STATE_INITIALIZED;
    }
    /**
     * Returns true if the API's current state is STATE_NOT_INITIALIZED
     *
     * @return {boolean}
     */

  }, {
    key: "isNotInitialized",
    value: function isNotInitialized() {
      return this.currentState === global_constants.STATE_NOT_INITIALIZED;
    }
    /**
     * Returns true if the API's current state is STATE_TERMINATED
     *
     * @return {boolean}
     */

  }, {
    key: "isTerminated",
    value: function isTerminated() {
      return this.currentState === global_constants.STATE_TERMINATED;
    }
    /**
     * Provides a mechanism for attaching to a specific SCORM event
     *
     * @param {string} listenerName
     * @param {function} callback
     */

  }, {
    key: "on",
    value: function on(listenerName, callback) {
      if (!callback) return;
      var listenerFunctions = listenerName.split(' ');

      for (var i = 0; i < listenerFunctions.length; i++) {
        var listenerSplit = listenerFunctions[i].split('.');
        if (listenerSplit.length === 0) return;
        var functionName = listenerSplit[0];
        var CMIElement = null;

        if (listenerSplit.length > 1) {
          CMIElement = listenerName.replace(functionName + '.', '');
        }

        this.listenerArray.push({
          functionName: functionName,
          CMIElement: CMIElement,
          callback: callback
        });
      }
    }
    /**
     * Processes any 'on' listeners that have been created
     *
     * @param {string} functionName
     * @param {string} CMIElement
     * @param {*} value
     */

  }, {
    key: "processListeners",
    value: function processListeners(functionName, CMIElement, value) {
      this.apiLog(functionName, CMIElement, value);

      for (var i = 0; i < this.listenerArray.length; i++) {
        var listener = this.listenerArray[i];
        var functionsMatch = listener.functionName === functionName;
        var listenerHasCMIElement = !!listener.CMIElement;
        var CMIElementsMatch = false;

        if (CMIElement && listener.CMIElement && listener.CMIElement.substring(listener.CMIElement.length - 1) === '*') {
          CMIElementsMatch = CMIElement.indexOf(listener.CMIElement.substring(0, listener.CMIElement.length - 1)) === 0;
        } else {
          CMIElementsMatch = listener.CMIElement === CMIElement;
        }

        if (functionsMatch && (!listenerHasCMIElement || CMIElementsMatch)) {
          listener.callback(CMIElement, value);
        }
      }
    }
    /**
     * Throws a SCORM error
     *
     * @param {number} errorNumber
     * @param {string} message
     */

  }, {
    key: "throwSCORMError",
    value: function throwSCORMError(errorNumber, message) {
      if (!message) {
        message = this.getLmsErrorMessageDetails(errorNumber);
      }

      this.apiLog('throwSCORMError', null, errorNumber + ': ' + message, global_constants.LOG_LEVEL_ERROR);
      this.lastErrorCode = String(errorNumber);
    }
    /**
     * Clears the last SCORM error code on success.
     *
     * @param {string} success
     */

  }, {
    key: "clearSCORMError",
    value: function clearSCORMError(success) {
      if (success !== undefined && success !== global_constants.SCORM_FALSE) {
        this.lastErrorCode = 0;
      }
    }
    /**
     * Attempts to store the data to the LMS, logs data if no LMS configured
     * APIs that inherit BaseAPI should override this function
     *
     * @param {boolean} _calculateTotalTime
     * @return {string}
     * @abstract
     */

  }, {
    key: "storeData",
    value: function storeData(_calculateTotalTime) {
      throw new Error('The storeData method has not been implemented');
    }
    /**
     * Load the CMI from a flattened JSON object
     * @param {object} json
     * @param {string} CMIElement
     */

  }, {
    key: "loadFromFlattenedJSON",
    value: function loadFromFlattenedJSON(json, CMIElement) {
      var _this = this;

      if (!this.isNotInitialized()) {
        console.error('loadFromFlattenedJSON can only be called before the call to lmsInitialize.');
        return;
      }

      var result = Object.keys(json).map(function (key) {
        return [String(key), json[key]];
      }); // CMI interactions need to have id and type loaded before any other fields

      result.sort(function (_ref, _ref2) {
        var _ref3 = _slicedToArray(_ref, 2),
            a = _ref3[0],
            b = _ref3[1];

        var _ref4 = _slicedToArray(_ref2, 2),
            c = _ref4[0],
            d = _ref4[1];

        /**
         * Test match pattern.
         *
         * @param {string} a
         * @param {string} c
         * @param {RegExp} a_pattern
         * @param {RegExp} c_pattern
         * @return {number}
         */
        function testPattern(a, c, a_pattern, c_pattern) {
          if (a.match(a_pattern) && c.match(c_pattern)) {
            if (Number(a.match(a_pattern)[1]) < Number(c.match(c_pattern)[1])) return -1;
            if (Number(a.match(a_pattern)[1]) > Number(c.match(c_pattern)[1])) return 1;
            return -1;
          } else if (a.match(c_pattern) && c.match(a_pattern)) {
            if (Number(a.match(c_pattern)[1]) < Number(c.match(a_pattern)[1])) return -1;
            if (Number(a.match(c_pattern)[1]) > Number(c.match(a_pattern)[1])) return 1;
            return 1;
          }

          return 0;
        }

        var id_pattern = /^cmi\.interactions\.(\d+)\.id$/;
        var type_pattern = /^cmi\.interactions\.(\d+)\.type$/;
        var pattern = /^cmi\.interactions\.(\d+)/;
        var id_test = testPattern(a, c, id_pattern, pattern);

        if (id_test !== 0) {
          return id_test;
        }

        id_test = testPattern(a, c, type_pattern, pattern);

        if (id_test !== 0) {
          return id_test;
        }

        if (a < c) return -1;
        if (a > c) return 1;
        return 0;
      });
      var obj;
      result.forEach(function (element) {
        obj = {};
        obj[element[0]] = element[1];

        _this.loadFromJSON((0, _utilities.unflatten)(obj), CMIElement);
      });
    }
    /**
     * Loads CMI data from a JSON object.
     *
     * @param {object} json
     * @param {string} CMIElement
     */

  }, {
    key: "loadFromJSON",
    value: function loadFromJSON(json, CMIElement) {
      if (!this.isNotInitialized()) {
        console.error('loadFromJSON can only be called before the call to lmsInitialize.');
        return;
      }

      CMIElement = CMIElement !== undefined ? CMIElement : 'cmi';
      this.startingData = json; // could this be refactored down to flatten(json) then setCMIValue on each?

      for (var key in json) {
        if ({}.hasOwnProperty.call(json, key) && json[key]) {
          var currentCMIElement = (CMIElement ? CMIElement + '.' : '') + key;
          var value = json[key];

          if (value['childArray']) {
            for (var i = 0; i < value['childArray'].length; i++) {
              this.loadFromJSON(value['childArray'][i], currentCMIElement + '.' + i);
            }
          } else if (value.constructor === Object) {
            this.loadFromJSON(value, currentCMIElement);
          } else {
            this.setCMIValue(currentCMIElement, value);
          }
        }
      }
    }
    /**
     * Render the CMI object to JSON for sending to an LMS.
     *
     * @return {string}
     */

  }, {
    key: "renderCMIToJSONString",
    value: function renderCMIToJSONString() {
      var cmi = this.cmi; // Do we want/need to return fields that have no set value?
      // return JSON.stringify({ cmi }, (k, v) => v === undefined ? null : v, 2);

      return JSON.stringify({
        cmi: cmi
      });
    }
    /**
     * Returns a JS object representing the current cmi
     * @return {object}
     */

  }, {
    key: "renderCMIToJSONObject",
    value: function renderCMIToJSONObject() {
      // Do we want/need to return fields that have no set value?
      // return JSON.stringify({ cmi }, (k, v) => v === undefined ? null : v, 2);
      return JSON.parse(this.renderCMIToJSONString());
    }
    /**
     * Render the cmi object to the proper format for LMS commit
     * APIs that inherit BaseAPI should override this function
     *
     * @param {boolean} _terminateCommit
     * @return {*}
     * @abstract
     */

  }, {
    key: "renderCommitCMI",
    value: function renderCommitCMI(_terminateCommit) {
      throw new Error('The storeData method has not been implemented');
    }
    /**
     * Send the request to the LMS
     * @param {string} url
     * @param {object|Array} params
     * @param {boolean} immediate
     * @return {object}
     */

  }, {
    key: "processHttpRequest",
    value: function processHttpRequest(url, params) {
      var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var process = function process(url, params, settings, error_codes) {
        var genericError = {
          'result': global_constants.SCORM_FALSE,
          'errorCode': error_codes.GENERAL
        };
        var result;

        if (!settings.sendBeaconCommit) {
          var httpReq = new XMLHttpRequest();
          httpReq.open('POST', url, settings.asyncCommit);

          try {
            if (params instanceof Array) {
              httpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
              httpReq.send(params.join('&'));
            } else {
              httpReq.setRequestHeader('Content-Type', settings.commitRequestDataType);
              httpReq.send(JSON.stringify(params));
            }

            if (typeof settings.responseHandler === 'function') {
              result = settings.responseHandler(httpReq);
            } else {
              result = JSON.parse(httpReq.responseText);
            }
          } catch (e) {
            console.error(e);
            return genericError;
          }
        } else {
          try {
            var headers = {
              type: settings.commitRequestDataType
            };
            var blob;

            if (params instanceof Array) {
              blob = new Blob([params.join('&')], headers);
            } else {
              blob = new Blob([JSON.stringify(params)], headers);
            }

            result = {};

            if (navigator.sendBeacon(url, blob)) {
              result.result = global_constants.SCORM_TRUE;
              result.errorCode = 0;
            } else {
              result.result = global_constants.SCORM_FALSE;
              result.errorCode = 101;
            }
          } catch (e) {
            console.error(e);
            return genericError;
          }
        }

        if (typeof result === 'undefined') {
          return genericError;
        }

        return result;
      };

      if (typeof _lodash["default"] !== 'undefined') {
        var debounced = (0, _lodash["default"])(process, 500);
        debounced(url, params, this.settings, this.error_codes); // if we're terminating, go ahead and commit immediately

        if (immediate) {
          debounced.flush();
        }

        return {
          result: global_constants.SCORM_TRUE,
          errorCode: 0
        };
      } else {
        return process(url, params, this.settings, this.error_codes);
      }
    }
    /**
     * Throws a SCORM error
     *
     * @param {number} when - the number of milliseconds to wait before committing
     */

  }, {
    key: "scheduleCommit",
    value: function scheduleCommit(when) {
      _classPrivateFieldSet(this, _timeout, new ScheduledCommit(this, when));

      this.apiLog('scheduleCommit', '', 'scheduled', global_constants.LOG_LEVEL_DEBUG);
    }
    /**
     * Clears and cancels any currently scheduled commits
     */

  }, {
    key: "clearScheduledCommit",
    value: function clearScheduledCommit() {
      if (_classPrivateFieldGet(this, _timeout)) {
        _classPrivateFieldGet(this, _timeout).cancel();

        _classPrivateFieldSet(this, _timeout, null);

        this.apiLog('clearScheduledCommit', '', 'cleared', global_constants.LOG_LEVEL_DEBUG);
      }
    }
  }, {
    key: "error_codes",
    get: function get() {
      return _classPrivateFieldGet(this, _error_codes);
    }
    /**
     * Getter for #settings
     * @return {object}
     */

  }, {
    key: "settings",
    get: function get() {
      return _classPrivateFieldGet(this, _settings);
    }
    /**
     * Setter for #settings
     * @param {object} settings
     */
    ,
    set: function set(settings) {
      _classPrivateFieldSet(this, _settings, _objectSpread(_objectSpread({}, _classPrivateFieldGet(this, _settings)), settings));
    }
  }]);

  return BaseAPI;
}();
/**
 * Private class that wraps a timeout call to the commit() function
 */


exports["default"] = BaseAPI;

var _API = new WeakMap();

var _cancelled = new WeakMap();

var _timeout2 = new WeakMap();

var ScheduledCommit = /*#__PURE__*/function () {
  /**
   * Constructor for ScheduledCommit
   * @param {BaseAPI} API
   * @param {number} when
   */
  function ScheduledCommit(API, when) {
    _classCallCheck(this, ScheduledCommit);

    _API.set(this, {
      writable: true,
      value: void 0
    });

    _cancelled.set(this, {
      writable: true,
      value: false
    });

    _timeout2.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _API, API);

    _classPrivateFieldSet(this, _timeout2, setTimeout(this.wrapper.bind(this), when));
  }
  /**
   * Cancel any currently scheduled commit
   */


  _createClass(ScheduledCommit, [{
    key: "cancel",
    value: function cancel() {
      _classPrivateFieldSet(this, _cancelled, true);

      if (_classPrivateFieldGet(this, _timeout2)) {
        clearTimeout(_classPrivateFieldGet(this, _timeout2));
      }
    }
    /**
     * Wrap the API commit call to check if the call has already been cancelled
     */

  }, {
    key: "wrapper",
    value: function wrapper() {
      if (!_classPrivateFieldGet(this, _cancelled)) {
        _classPrivateFieldGet(this, _API).commit();
      }
    }
  }]);

  return ScheduledCommit;
}();

},{"./cmi/common":7,"./constants/api_constants":10,"./constants/error_codes":11,"./exceptions":15,"./utilities":17,"lodash.debounce":1}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _BaseAPI2 = _interopRequireDefault(require("./BaseAPI"));

var _scorm12_cmi = require("./cmi/scorm12_cmi");

var Utilities = _interopRequireWildcard(require("./utilities"));

var _api_constants = _interopRequireDefault(require("./constants/api_constants"));

var _error_codes = _interopRequireDefault(require("./constants/error_codes"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var scorm12_constants = _api_constants["default"].scorm12;
var global_constants = _api_constants["default"].global;
var scorm12_error_codes = _error_codes["default"].scorm12;
/**
 * API class for SCORM 1.2
 */

var Scorm12API = /*#__PURE__*/function (_BaseAPI) {
  _inherits(Scorm12API, _BaseAPI);

  var _super = _createSuper(Scorm12API);

  /**
   * Constructor for SCORM 1.2 API
   * @param {object} settings
   */
  function Scorm12API(settings) {
    var _this;

    _classCallCheck(this, Scorm12API);

    var finalSettings = _objectSpread(_objectSpread({}, {
      mastery_override: false
    }), settings);

    _this = _super.call(this, scorm12_error_codes, finalSettings);
    _this.cmi = new _scorm12_cmi.CMI();
    _this.nav = new _scorm12_cmi.NAV(); // Rename functions to match 1.2 Spec and expose to modules

    _this.LMSInitialize = _this.lmsInitialize;
    _this.LMSFinish = _this.lmsFinish;
    _this.LMSGetValue = _this.lmsGetValue;
    _this.LMSSetValue = _this.lmsSetValue;
    _this.LMSCommit = _this.lmsCommit;
    _this.LMSGetLastError = _this.lmsGetLastError;
    _this.LMSGetErrorString = _this.lmsGetErrorString;
    _this.LMSGetDiagnostic = _this.lmsGetDiagnostic;
    return _this;
  }
  /**
   * lmsInitialize function from SCORM 1.2 Spec
   *
   * @return {string} bool
   */


  _createClass(Scorm12API, [{
    key: "lmsInitialize",
    value: function lmsInitialize() {
      this.cmi.initialize();
      return this.initialize('LMSInitialize', 'LMS was already initialized!', 'LMS is already finished!');
    }
    /**
     * LMSFinish function from SCORM 1.2 Spec
     *
     * @return {string} bool
     */

  }, {
    key: "lmsFinish",
    value: function lmsFinish() {
      var result = this.terminate('LMSFinish', true);

      if (result === global_constants.SCORM_TRUE) {
        if (this.nav.event !== '') {
          if (this.nav.event === 'continue') {
            this.processListeners('SequenceNext');
          } else {
            this.processListeners('SequencePrevious');
          }
        } else if (this.settings.autoProgress) {
          this.processListeners('SequenceNext');
        }
      }

      return result;
    }
    /**
     * LMSGetValue function from SCORM 1.2 Spec
     *
     * @param {string} CMIElement
     * @return {string}
     */

  }, {
    key: "lmsGetValue",
    value: function lmsGetValue(CMIElement) {
      return this.getValue('LMSGetValue', false, CMIElement);
    }
    /**
     * LMSSetValue function from SCORM 1.2 Spec
     *
     * @param {string} CMIElement
     * @param {*} value
     * @return {string}
     */

  }, {
    key: "lmsSetValue",
    value: function lmsSetValue(CMIElement, value) {
      return this.setValue('LMSSetValue', false, CMIElement, value);
    }
    /**
     * LMSCommit function from SCORM 1.2 Spec
     *
     * @return {string} bool
     */

  }, {
    key: "lmsCommit",
    value: function lmsCommit() {
      return this.commit('LMSCommit', false);
    }
    /**
     * LMSGetLastError function from SCORM 1.2 Spec
     *
     * @return {string}
     */

  }, {
    key: "lmsGetLastError",
    value: function lmsGetLastError() {
      return this.getLastError('LMSGetLastError');
    }
    /**
     * LMSGetErrorString function from SCORM 1.2 Spec
     *
     * @param {string} CMIErrorCode
     * @return {string}
     */

  }, {
    key: "lmsGetErrorString",
    value: function lmsGetErrorString(CMIErrorCode) {
      return this.getErrorString('LMSGetErrorString', CMIErrorCode);
    }
    /**
     * LMSGetDiagnostic function from SCORM 1.2 Spec
     *
     * @param {string} CMIErrorCode
     * @return {string}
     */

  }, {
    key: "lmsGetDiagnostic",
    value: function lmsGetDiagnostic(CMIErrorCode) {
      return this.getDiagnostic('LMSGetDiagnostic', CMIErrorCode);
    }
    /**
     * Sets a value on the CMI Object
     *
     * @param {string} CMIElement
     * @param {*} value
     * @return {string}
     */

  }, {
    key: "setCMIValue",
    value: function setCMIValue(CMIElement, value) {
      return this._commonSetCMIValue('LMSSetValue', false, CMIElement, value);
    }
    /**
     * Gets a value from the CMI Object
     *
     * @param {string} CMIElement
     * @return {*}
     */

  }, {
    key: "getCMIValue",
    value: function getCMIValue(CMIElement) {
      return this._commonGetCMIValue('getCMIValue', false, CMIElement);
    }
    /**
     * Gets or builds a new child element to add to the array.
     *
     * @param {string} CMIElement
     * @param {*} value
     * @param {boolean} foundFirstIndex
     * @return {object}
     */

  }, {
    key: "getChildElement",
    value: function getChildElement(CMIElement, value, foundFirstIndex) {
      var newChild;

      if (this.stringMatches(CMIElement, 'cmi\\.objectives\\.\\d+')) {
        newChild = new _scorm12_cmi.CMIObjectivesObject();
      } else if (foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d+\\.correct_responses\\.\\d+')) {
        newChild = new _scorm12_cmi.CMIInteractionsCorrectResponsesObject();
      } else if (foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d+\\.objectives\\.\\d+')) {
        newChild = new _scorm12_cmi.CMIInteractionsObjectivesObject();
      } else if (!foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d+')) {
        newChild = new _scorm12_cmi.CMIInteractionsObject();
      }

      return newChild;
    }
    /**
     * Validates Correct Response values
     *
     * @param {string} CMIElement
     * @param {*} value
     * @return {boolean}
     */

  }, {
    key: "validateCorrectResponse",
    value: function validateCorrectResponse(CMIElement, value) {
      return true;
    }
    /**
     * Returns the message that corresponds to errorNumber.
     *
     * @param {*} errorNumber
     * @param {boolean }detail
     * @return {string}
     */

  }, {
    key: "getLmsErrorMessageDetails",
    value: function getLmsErrorMessageDetails(errorNumber, detail) {
      var basicMessage = 'No Error';
      var detailMessage = 'No Error'; // Set error number to string since inconsistent from modules if string or number

      errorNumber = String(errorNumber);

      if (scorm12_constants.error_descriptions[errorNumber]) {
        basicMessage = scorm12_constants.error_descriptions[errorNumber].basicMessage;
        detailMessage = scorm12_constants.error_descriptions[errorNumber].detailMessage;
      }

      return detail ? detailMessage : basicMessage;
    }
    /**
     * Replace the whole API with another
     *
     * @param {Scorm12API} newAPI
     */

  }, {
    key: "replaceWithAnotherScormAPI",
    value: function replaceWithAnotherScormAPI(newAPI) {
      // Data Model
      this.cmi = newAPI.cmi;
    }
    /**
     * Render the cmi object to the proper format for LMS commit
     *
     * @param {boolean} terminateCommit
     * @return {object|Array}
     */

  }, {
    key: "renderCommitCMI",
    value: function renderCommitCMI(terminateCommit) {
      var cmiExport = this.renderCMIToJSONObject();

      if (terminateCommit) {
        cmiExport.cmi.core.total_time = this.cmi.getCurrentTotalTime();
      }

      var result = [];
      var flattened = Utilities.flatten(cmiExport);

      switch (this.settings.dataCommitFormat) {
        case 'flattened':
          return Utilities.flatten(cmiExport);

        case 'params':
          for (var item in flattened) {
            if ({}.hasOwnProperty.call(flattened, item)) {
              result.push("".concat(item, "=").concat(flattened[item]));
            }
          }

          return result;

        case 'json':
        default:
          return cmiExport;
      }
    }
    /**
     * Attempts to store the data to the LMS
     *
     * @param {boolean} terminateCommit
     * @return {string}
     */

  }, {
    key: "storeData",
    value: function storeData(terminateCommit) {
      if (terminateCommit) {
        var originalStatus = this.cmi.core.lesson_status;

        if (originalStatus === 'not attempted') {
          this.cmi.core.lesson_status = 'completed';
        }

        if (this.cmi.core.lesson_mode === 'normal') {
          if (this.cmi.core.credit === 'credit') {
            if (this.settings.mastery_override && this.cmi.student_data.mastery_score !== '' && this.cmi.core.score.raw !== '') {
              if (parseFloat(this.cmi.core.score.raw) >= parseFloat(this.cmi.student_data.mastery_score)) {
                this.cmi.core.lesson_status = 'passed';
              } else {
                this.cmi.core.lesson_status = 'failed';
              }
            }
          }
        } else if (this.cmi.core.lesson_mode === 'browse') {
          var _this$startingData, _this$startingData$cm, _this$startingData$cm2;

          if ((((_this$startingData = this.startingData) === null || _this$startingData === void 0 ? void 0 : (_this$startingData$cm = _this$startingData.cmi) === null || _this$startingData$cm === void 0 ? void 0 : (_this$startingData$cm2 = _this$startingData$cm.core) === null || _this$startingData$cm2 === void 0 ? void 0 : _this$startingData$cm2.lesson_status) || '') === '' && originalStatus === 'not attempted') {
            this.cmi.core.lesson_status = 'browsed';
          }
        }
      }

      var commitObject = this.renderCommitCMI(terminateCommit);

      if (this.settings.lmsCommitUrl) {
        if (this.apiLogLevel === global_constants.LOG_LEVEL_DEBUG) {
          console.debug('Commit (terminated: ' + (terminateCommit ? 'yes' : 'no') + '): ');
          console.debug(commitObject);
        }

        return this.processHttpRequest(this.settings.lmsCommitUrl, commitObject, terminateCommit);
      } else {
        console.log('Commit (terminated: ' + (terminateCommit ? 'yes' : 'no') + '): ');
        console.log(commitObject);
        return global_constants.SCORM_TRUE;
      }
    }
  }]);

  return Scorm12API;
}(_BaseAPI2["default"]);

exports["default"] = Scorm12API;

},{"./BaseAPI":3,"./cmi/scorm12_cmi":8,"./constants/api_constants":10,"./constants/error_codes":11,"./utilities":17}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _BaseAPI2 = _interopRequireDefault(require("./BaseAPI"));

var _scorm2004_cmi = require("./cmi/scorm2004_cmi");

var Utilities = _interopRequireWildcard(require("./utilities"));

var _api_constants = _interopRequireDefault(require("./constants/api_constants"));

var _error_codes = _interopRequireDefault(require("./constants/error_codes"));

var _response_constants = _interopRequireDefault(require("./constants/response_constants"));

var _language_constants = _interopRequireDefault(require("./constants/language_constants"));

var _regex = _interopRequireDefault(require("./constants/regex"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var scorm2004_constants = _api_constants["default"].scorm2004;
var global_constants = _api_constants["default"].global;
var scorm2004_error_codes = _error_codes["default"].scorm2004;
var correct_responses = _response_constants["default"].correct;
var scorm2004_regex = _regex["default"].scorm2004;
/**
 * API class for SCORM 2004
 */

var _version = new WeakMap();

var Scorm2004API = /*#__PURE__*/function (_BaseAPI) {
  _inherits(Scorm2004API, _BaseAPI);

  var _super = _createSuper(Scorm2004API);

  /**
   * Constructor for SCORM 2004 API
   * @param {object} settings
   */
  function Scorm2004API(settings) {
    var _this;

    _classCallCheck(this, Scorm2004API);

    var finalSettings = _objectSpread(_objectSpread({}, {
      mastery_override: false
    }), settings);

    _this = _super.call(this, scorm2004_error_codes, finalSettings);

    _version.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _defineProperty(_assertThisInitialized(_this), "checkDuplicatedPattern", function (correct_response, current_index, value) {
      var found = false;
      var count = correct_response._count;

      for (var i = 0; i < count && !found; i++) {
        if (i !== current_index && correct_response.childArray[i] === value) {
          found = true;
        }
      }

      return found;
    });

    _this.cmi = new _scorm2004_cmi.CMI();
    _this.adl = new _scorm2004_cmi.ADL(); // Rename functions to match 2004 Spec and expose to modules

    _this.Initialize = _this.lmsInitialize;
    _this.Terminate = _this.lmsTerminate;
    _this.GetValue = _this.lmsGetValue;
    _this.SetValue = _this.lmsSetValue;
    _this.Commit = _this.lmsCommit;
    _this.GetLastError = _this.lmsGetLastError;
    _this.GetErrorString = _this.lmsGetErrorString;
    _this.GetDiagnostic = _this.lmsGetDiagnostic;
    return _this;
  }
  /**
   * Getter for #version
   * @return {string}
   */


  _createClass(Scorm2004API, [{
    key: "lmsInitialize",

    /**
     * @return {string} bool
     */
    value: function lmsInitialize() {
      this.cmi.initialize();
      return this.initialize('Initialize');
    }
    /**
     * @return {string} bool
     */

  }, {
    key: "lmsTerminate",
    value: function lmsTerminate() {
      var result = this.terminate('Terminate', true);

      if (result === global_constants.SCORM_TRUE) {
        if (this.adl.nav.request !== '_none_') {
          switch (this.adl.nav.request) {
            case 'continue':
              this.processListeners('SequenceNext');
              break;

            case 'previous':
              this.processListeners('SequencePrevious');
              break;

            case 'choice':
              this.processListeners('SequenceChoice');
              break;

            case 'exit':
              this.processListeners('SequenceExit');
              break;

            case 'exitAll':
              this.processListeners('SequenceExitAll');
              break;

            case 'abandon':
              this.processListeners('SequenceAbandon');
              break;

            case 'abandonAll':
              this.processListeners('SequenceAbandonAll');
              break;
          }
        } else if (this.settings.autoProgress) {
          this.processListeners('SequenceNext');
        }
      }

      return result;
    }
    /**
     * @param {string} CMIElement
     * @return {string}
     */

  }, {
    key: "lmsGetValue",
    value: function lmsGetValue(CMIElement) {
      return this.getValue('GetValue', true, CMIElement);
    }
    /**
     * @param {string} CMIElement
     * @param {any} value
     * @return {string}
     */

  }, {
    key: "lmsSetValue",
    value: function lmsSetValue(CMIElement, value) {
      return this.setValue('SetValue', true, CMIElement, value);
    }
    /**
     * Orders LMS to store all content parameters
     *
     * @return {string} bool
     */

  }, {
    key: "lmsCommit",
    value: function lmsCommit() {
      return this.commit('Commit');
    }
    /**
     * Returns last error code
     *
     * @return {string}
     */

  }, {
    key: "lmsGetLastError",
    value: function lmsGetLastError() {
      return this.getLastError('GetLastError');
    }
    /**
     * Returns the errorNumber error description
     *
     * @param {(string|number)} CMIErrorCode
     * @return {string}
     */

  }, {
    key: "lmsGetErrorString",
    value: function lmsGetErrorString(CMIErrorCode) {
      return this.getErrorString('GetErrorString', CMIErrorCode);
    }
    /**
     * Returns a comprehensive description of the errorNumber error.
     *
     * @param {(string|number)} CMIErrorCode
     * @return {string}
     */

  }, {
    key: "lmsGetDiagnostic",
    value: function lmsGetDiagnostic(CMIErrorCode) {
      return this.getDiagnostic('GetDiagnostic', CMIErrorCode);
    }
    /**
     * Sets a value on the CMI Object
     *
     * @param {string} CMIElement
     * @param {any} value
     * @return {string}
     */

  }, {
    key: "setCMIValue",
    value: function setCMIValue(CMIElement, value) {
      return this._commonSetCMIValue('SetValue', true, CMIElement, value);
    }
    /**
     * Gets or builds a new child element to add to the array.
     *
     * @param {string} CMIElement
     * @param {any} value
     * @param {boolean} foundFirstIndex
     * @return {any}
     */

  }, {
    key: "getChildElement",
    value: function getChildElement(CMIElement, value, foundFirstIndex) {
      var newChild;

      if (this.stringMatches(CMIElement, 'cmi\\.objectives\\.\\d+')) {
        newChild = new _scorm2004_cmi.CMIObjectivesObject();
      } else if (foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d+\\.correct_responses\\.\\d+')) {
        var parts = CMIElement.split('.');
        var index = Number(parts[2]);
        var interaction = this.cmi.interactions.childArray[index];

        if (!interaction.type) {
          this.throwSCORMError(scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED);
        } else {
          var interaction_type = interaction.type;
          var interaction_count = interaction.correct_responses._count;

          if (interaction_type === 'choice') {
            for (var i = 0; i < interaction_count && this.lastErrorCode === 0; i++) {
              var response = interaction.correct_responses.childArray[i];

              if (response.pattern === value) {
                this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE);
              }
            }
          }

          var response_type = correct_responses[interaction_type];

          if (response_type) {
            var nodes = [];

            if (response_type === null || response_type === void 0 ? void 0 : response_type.delimiter) {
              nodes = String(value).split(response_type.delimiter);
            } else {
              nodes[0] = value;
            }

            if (nodes.length > 0 && nodes.length <= response_type.max) {
              this.checkCorrectResponseValue(interaction_type, nodes, value);
            } else if (nodes.length > response_type.max) {
              this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE, 'Data Model Element Pattern Too Long');
            }
          } else {
            this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE, 'Incorrect Response Type: ' + interaction_type);
          }
        }

        if (this.lastErrorCode === 0) {
          newChild = new _scorm2004_cmi.CMIInteractionsCorrectResponsesObject();
        }
      } else if (foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d+\\.objectives\\.\\d+')) {
        newChild = new _scorm2004_cmi.CMIInteractionsObjectivesObject();
      } else if (!foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d+')) {
        newChild = new _scorm2004_cmi.CMIInteractionsObject();
      } else if (this.stringMatches(CMIElement, 'cmi\\.comments_from_learner\\.\\d+')) {
        newChild = new _scorm2004_cmi.CMICommentsObject();
      } else if (this.stringMatches(CMIElement, 'cmi\\.comments_from_lms\\.\\d+')) {
        newChild = new _scorm2004_cmi.CMICommentsObject(true);
      }

      return newChild;
    }
    /**
     * Validate correct response.
     * @param {string} CMIElement
     * @param {*} value
     */

  }, {
    key: "validateCorrectResponse",
    value: function validateCorrectResponse(CMIElement, value) {
      var parts = CMIElement.split('.');
      var index = Number(parts[2]);
      var pattern_index = Number(parts[4]);
      var interaction = this.cmi.interactions.childArray[index];
      var interaction_type = interaction.type;
      var interaction_count = interaction.correct_responses._count;

      if (interaction_type === 'choice') {
        for (var i = 0; i < interaction_count && this.lastErrorCode === 0; i++) {
          var response = interaction.correct_responses.childArray[i];

          if (response.pattern === value) {
            this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE);
          }
        }
      }

      var response_type = correct_responses[interaction_type];

      if (typeof response_type.limit === 'undefined' || interaction_count <= response_type.limit) {
        var nodes = [];

        if (response_type === null || response_type === void 0 ? void 0 : response_type.delimiter) {
          nodes = String(value).split(response_type.delimiter);
        } else {
          nodes[0] = value;
        }

        if (nodes.length > 0 && nodes.length <= response_type.max) {
          this.checkCorrectResponseValue(interaction_type, nodes, value);
        } else if (nodes.length > response_type.max) {
          this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE, 'Data Model Element Pattern Too Long');
        }

        if (this.lastErrorCode === 0 && (!response_type.duplicate || !this.checkDuplicatedPattern(interaction.correct_responses, pattern_index, value)) || this.lastErrorCode === 0 && value === '') {// do nothing, we want the inverse
        } else {
          if (this.lastErrorCode === 0) {
            this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE, 'Data Model Element Pattern Already Exists');
          }
        }
      } else {
        this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE, 'Data Model Element Collection Limit Reached');
      }
    }
    /**
     * Gets a value from the CMI Object
     *
     * @param {string} CMIElement
     * @return {*}
     */

  }, {
    key: "getCMIValue",
    value: function getCMIValue(CMIElement) {
      return this._commonGetCMIValue('GetValue', true, CMIElement);
    }
    /**
     * Returns the message that corresponds to errorNumber.
     *
     * @param {(string|number)} errorNumber
     * @param {boolean} detail
     * @return {string}
     */

  }, {
    key: "getLmsErrorMessageDetails",
    value: function getLmsErrorMessageDetails(errorNumber, detail) {
      var basicMessage = '';
      var detailMessage = ''; // Set error number to string since inconsistent from modules if string or number

      errorNumber = String(errorNumber);

      if (scorm2004_constants.error_descriptions[errorNumber]) {
        basicMessage = scorm2004_constants.error_descriptions[errorNumber].basicMessage;
        detailMessage = scorm2004_constants.error_descriptions[errorNumber].detailMessage;
      }

      return detail ? detailMessage : basicMessage;
    }
    /**
     * Check to see if a correct_response value has been duplicated
     * @param {CMIArray} correct_response
     * @param {number} current_index
     * @param {*} value
     * @return {boolean}
     */

  }, {
    key: "checkCorrectResponseValue",

    /**
     * Checks for a valid correct_response value
     * @param {string} interaction_type
     * @param {Array} nodes
     * @param {*} value
     */
    value: function checkCorrectResponseValue(interaction_type, nodes, value) {
      var response = correct_responses[interaction_type];
      var formatRegex = new RegExp(response.format);

      for (var i = 0; i < nodes.length && this.lastErrorCode === 0; i++) {
        if (interaction_type.match('^(fill-in|long-fill-in|matching|performance|sequencing)$')) {
          nodes[i] = this.removeCorrectResponsePrefixes(nodes[i]);
        }

        if (response === null || response === void 0 ? void 0 : response.delimiter2) {
          var values = nodes[i].split(response.delimiter2);

          if (values.length === 2) {
            var matches = values[0].match(formatRegex);

            if (!matches) {
              this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
            } else {
              if (!values[1].match(new RegExp(response.format2))) {
                this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
              }
            }
          } else {
            this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
          }
        } else {
          var _matches = nodes[i].match(formatRegex);

          if (!_matches && value !== '' || !_matches && interaction_type === 'true-false') {
            this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
          } else {
            if (interaction_type === 'numeric' && nodes.length > 1) {
              if (Number(nodes[0]) > Number(nodes[1])) {
                this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
              }
            } else {
              if (nodes[i] !== '' && response.unique) {
                for (var j = 0; j < i && this.lastErrorCode === 0; j++) {
                  if (nodes[i] === nodes[j]) {
                    this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
                  }
                }
              }
            }
          }
        }
      }
    }
    /**
     * Remove prefixes from correct_response
     * @param {string} node
     * @return {*}
     */

  }, {
    key: "removeCorrectResponsePrefixes",
    value: function removeCorrectResponsePrefixes(node) {
      var seenOrder = false;
      var seenCase = false;
      var seenLang = false;
      var prefixRegex = new RegExp('^({(lang|case_matters|order_matters)=([^}]+)})');
      var matches = node.match(prefixRegex);
      var langMatches = null;

      while (matches) {
        switch (matches[2]) {
          case 'lang':
            langMatches = node.match(scorm2004_regex.CMILangcr);

            if (langMatches) {
              var lang = langMatches[3];

              if (lang !== undefined && lang.length > 0) {
                if (_language_constants["default"][lang.toLowerCase()] === undefined) {
                  this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
                }
              }
            }

            seenLang = true;
            break;

          case 'case_matters':
            if (!seenLang && !seenOrder && !seenCase) {
              if (matches[3] !== 'true' && matches[3] !== 'false') {
                this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
              }
            }

            seenCase = true;
            break;

          case 'order_matters':
            if (!seenCase && !seenLang && !seenOrder) {
              if (matches[3] !== 'true' && matches[3] !== 'false') {
                this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
              }
            }

            seenOrder = true;
            break;

          default:
            break;
        }

        node = node.substr(matches[1].length);
        matches = node.match(prefixRegex);
      }

      return node;
    }
    /**
     * Replace the whole API with another
     * @param {Scorm2004API} newAPI
     */

  }, {
    key: "replaceWithAnotherScormAPI",
    value: function replaceWithAnotherScormAPI(newAPI) {
      // Data Model
      this.cmi = newAPI.cmi;
      this.adl = newAPI.adl;
    }
    /**
     * Render the cmi object to the proper format for LMS commit
     *
     * @param {boolean} terminateCommit
     * @return {object|Array}
     */

  }, {
    key: "renderCommitCMI",
    value: function renderCommitCMI(terminateCommit) {
      var cmiExport = this.renderCMIToJSONObject();

      if (terminateCommit) {
        cmiExport.cmi.total_time = this.cmi.getCurrentTotalTime();
      }

      var result = [];
      var flattened = Utilities.flatten(cmiExport);

      switch (this.settings.dataCommitFormat) {
        case 'flattened':
          return Utilities.flatten(cmiExport);

        case 'params':
          for (var item in flattened) {
            if ({}.hasOwnProperty.call(flattened, item)) {
              result.push("".concat(item, "=").concat(flattened[item]));
            }
          }

          return result;

        case 'json':
        default:
          return cmiExport;
      }
    }
    /**
     * Attempts to store the data to the LMS
     *
     * @param {boolean} terminateCommit
     * @return {string}
     */

  }, {
    key: "storeData",
    value: function storeData(terminateCommit) {
      var _this$startingData, _this$startingData$ad, _this$startingData$ad2;

      if (terminateCommit) {
        if (this.cmi.mode === 'normal') {
          if (this.cmi.credit === 'credit') {
            if (this.cmi.completion_threshold && this.cmi.progress_measure) {
              if (this.cmi.progress_measure >= this.cmi.completion_threshold) {
                console.debug('Setting Completion Status: Completed');
                this.cmi.completion_status = 'completed';
              } else {
                console.debug('Setting Completion Status: Incomplete');
                this.cmi.completion_status = 'incomplete';
              }
            }

            if (this.cmi.scaled_passing_score && this.cmi.score.scaled) {
              if (this.cmi.score.scaled >= this.cmi.scaled_passing_score) {
                console.debug('Setting Success Status: Passed');
                this.cmi.success_status = 'passed';
              } else {
                console.debug('Setting Success Status: Failed');
                this.cmi.success_status = 'failed';
              }
            }
          }
        }
      }

      var navRequest = false;

      if (this.adl.nav.request !== ((_this$startingData = this.startingData) === null || _this$startingData === void 0 ? void 0 : (_this$startingData$ad = _this$startingData.adl) === null || _this$startingData$ad === void 0 ? void 0 : (_this$startingData$ad2 = _this$startingData$ad.nav) === null || _this$startingData$ad2 === void 0 ? void 0 : _this$startingData$ad2.request) && this.adl.nav.request !== '_none_') {
        this.adl.nav.request = encodeURIComponent(this.adl.nav.request);
        navRequest = true;
      }

      var commitObject = this.renderCommitCMI(terminateCommit);

      if (this.settings.lmsCommitUrl) {
        if (this.apiLogLevel === global_constants.LOG_LEVEL_DEBUG) {
          console.debug('Commit (terminated: ' + (terminateCommit ? 'yes' : 'no') + '): ');
          console.debug(commitObject);
        }

        var result = this.processHttpRequest(this.settings.lmsCommitUrl, commitObject, terminateCommit); // check if this is a sequencing call, and then call the necessary JS

        {
          if (navRequest && result.navRequest !== undefined && result.navRequest !== '') {
            Function("\"use strict\";(() => { ".concat(result.navRequest, " })()"))();
          }
        }
        return result;
      } else {
        console.log('Commit (terminated: ' + (terminateCommit ? 'yes' : 'no') + '): ');
        console.log(commitObject);
        return global_constants.SCORM_TRUE;
      }
    }
  }, {
    key: "version",
    get: function get() {
      return _classPrivateFieldGet(this, _version);
    }
  }]);

  return Scorm2004API;
}(_BaseAPI2["default"]);

exports["default"] = Scorm2004API;

},{"./BaseAPI":3,"./cmi/scorm2004_cmi":9,"./constants/api_constants":10,"./constants/error_codes":11,"./constants/language_constants":12,"./constants/regex":13,"./constants/response_constants":14,"./utilities":17}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CMIEvaluationCommentsObject = exports.CMIAttemptRecordsObject = exports.CMIAttemptRecords = exports.CMITriesObject = exports.CMITries = exports.CMIPathsObject = exports.CMIPaths = exports.CMIStudentDemographics = exports.CMI = void 0;

var Scorm12CMI = _interopRequireWildcard(require("./scorm12_cmi"));

var _common = require("./common");

var _api_constants = _interopRequireDefault(require("../constants/api_constants"));

var _regex = _interopRequireDefault(require("../constants/regex"));

var _error_codes = _interopRequireDefault(require("../constants/error_codes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var aicc_constants = _api_constants["default"].aicc;
var aicc_regex = _regex["default"].aicc;
var scorm12_error_codes = _error_codes["default"].scorm12;
/**
 * CMI Class for AICC
 */

var CMI = /*#__PURE__*/function (_Scorm12CMI$CMI) {
  _inherits(CMI, _Scorm12CMI$CMI);

  var _super = _createSuper(CMI);

  /**
   * Constructor for AICC CMI object
   * @param {boolean} initialized
   */
  function CMI(initialized) {
    var _this;

    _classCallCheck(this, CMI);

    _this = _super.call(this, aicc_constants.cmi_children);
    if (initialized) _this.initialize();
    _this.student_preference = new AICCStudentPreferences();
    _this.student_data = new AICCCMIStudentData();
    _this.student_demographics = new CMIStudentDemographics();
    _this.evaluation = new CMIEvaluation();
    _this.paths = new CMIPaths();
    return _this;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMI, [{
    key: "initialize",
    value: function initialize() {
      var _this$student_prefere, _this$student_data, _this$student_demogra, _this$evaluation, _this$paths;

      _get(_getPrototypeOf(CMI.prototype), "initialize", this).call(this);

      (_this$student_prefere = this.student_preference) === null || _this$student_prefere === void 0 ? void 0 : _this$student_prefere.initialize();
      (_this$student_data = this.student_data) === null || _this$student_data === void 0 ? void 0 : _this$student_data.initialize();
      (_this$student_demogra = this.student_demographics) === null || _this$student_demogra === void 0 ? void 0 : _this$student_demogra.initialize();
      (_this$evaluation = this.evaluation) === null || _this$evaluation === void 0 ? void 0 : _this$evaluation.initialize();
      (_this$paths = this.paths) === null || _this$paths === void 0 ? void 0 : _this$paths.initialize();
    }
    /**
     * toJSON for cmi
     *
     * @return {
     *    {
     *      suspend_data: string,
     *      launch_data: string,
     *      comments: string,
     *      comments_from_lms: string,
     *      core: CMICore,
     *      objectives: CMIObjectives,
     *      student_data: CMIStudentData,
     *      student_preference: CMIStudentPreference,
     *      interactions: CMIInteractions,
     *      paths: CMIPaths
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'suspend_data': this.suspend_data,
        'launch_data': this.launch_data,
        'comments': this.comments,
        'comments_from_lms': this.comments_from_lms,
        'core': this.core,
        'objectives': this.objectives,
        'student_data': this.student_data,
        'student_preference': this.student_preference,
        'student_demographics': this.student_demographics,
        'interactions': this.interactions,
        'evaluation': this.evaluation,
        'paths': this.paths
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMI;
}(Scorm12CMI.CMI);
/**
 * AICC Evaluation object
 */


exports.CMI = CMI;

var CMIEvaluation = /*#__PURE__*/function (_BaseCMI) {
  _inherits(CMIEvaluation, _BaseCMI);

  var _super2 = _createSuper(CMIEvaluation);

  /**
   * Constructor for AICC Evaluation object
   */
  function CMIEvaluation() {
    var _this2;

    _classCallCheck(this, CMIEvaluation);

    _this2 = _super2.call(this);
    _this2.comments = new CMIEvaluationComments();
    return _this2;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMIEvaluation, [{
    key: "initialize",
    value: function initialize() {
      var _this$comments;

      _get(_getPrototypeOf(CMIEvaluation.prototype), "initialize", this).call(this);

      (_this$comments = this.comments) === null || _this$comments === void 0 ? void 0 : _this$comments.initialize();
    }
    /**
     * toJSON for cmi.evaluation object
     * @return {{comments: CMIEvaluationComments}}
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'comments': this.comments
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIEvaluation;
}(_common.BaseCMI);
/**
 * Class representing AICC's cmi.evaluation.comments object
 */


var CMIEvaluationComments = /*#__PURE__*/function (_CMIArray) {
  _inherits(CMIEvaluationComments, _CMIArray);

  var _super3 = _createSuper(CMIEvaluationComments);

  /**
   * Constructor for AICC Evaluation Comments object
   */
  function CMIEvaluationComments() {
    _classCallCheck(this, CMIEvaluationComments);

    return _super3.call(this, aicc_constants.comments_children, scorm12_error_codes.INVALID_SET_VALUE);
  }

  return CMIEvaluationComments;
}(_common.CMIArray);
/**
 * StudentPreferences class for AICC
 */


var _lesson_type = new WeakMap();

var _text_color = new WeakMap();

var _text_location = new WeakMap();

var _text_size = new WeakMap();

var _video = new WeakMap();

var AICCStudentPreferences = /*#__PURE__*/function (_Scorm12CMI$CMIStuden) {
  _inherits(AICCStudentPreferences, _Scorm12CMI$CMIStuden);

  var _super4 = _createSuper(AICCStudentPreferences);

  /**
   * Constructor for AICC Student Preferences object
   */
  function AICCStudentPreferences() {
    var _this3;

    _classCallCheck(this, AICCStudentPreferences);

    _this3 = _super4.call(this, aicc_constants.student_preference_children);

    _lesson_type.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _text_color.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _text_location.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _text_size.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _video.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _this3.windows = new _common.CMIArray({
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
      children: ''
    });
    return _this3;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(AICCStudentPreferences, [{
    key: "initialize",
    value: function initialize() {
      var _this$windows;

      _get(_getPrototypeOf(AICCStudentPreferences.prototype), "initialize", this).call(this);

      (_this$windows = this.windows) === null || _this$windows === void 0 ? void 0 : _this$windows.initialize();
    }
  }, {
    key: "toJSON",

    /**
     * toJSON for cmi.student_preference
     *
     * @return {
     *    {
     *      audio: string,
     *      language: string,
     *      speed: string,
     *      text: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'audio': this.audio,
        'language': this.language,
        'lesson_type': this.lesson_type,
        'speed': this.speed,
        'text': this.text,
        'text_color': this.text_color,
        'text_location': this.text_location,
        'text_size': this.text_size,
        'video': this.video,
        'windows': this.windows
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "lesson_type",

    /**
     * Getter for #lesson_type
     * @return {string}
     */
    get: function get() {
      return _classPrivateFieldGet(this, _lesson_type);
    }
    /**
     * Setter for #lesson_type
     * @param {string} lesson_type
     */
    ,
    set: function set(lesson_type) {
      if ((0, Scorm12CMI.check12ValidFormat)(lesson_type, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _lesson_type, lesson_type);
      }
    }
    /**
     * Getter for #text_color
     * @return {string}
     */

  }, {
    key: "text_color",
    get: function get() {
      return _classPrivateFieldGet(this, _text_color);
    }
    /**
     * Setter for #text_color
     * @param {string} text_color
     */
    ,
    set: function set(text_color) {
      if ((0, Scorm12CMI.check12ValidFormat)(text_color, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _text_color, text_color);
      }
    }
    /**
     * Getter for #text_location
     * @return {string}
     */

  }, {
    key: "text_location",
    get: function get() {
      return _classPrivateFieldGet(this, _text_location);
    }
    /**
     * Setter for #text_location
     * @param {string} text_location
     */
    ,
    set: function set(text_location) {
      if ((0, Scorm12CMI.check12ValidFormat)(text_location, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _text_location, text_location);
      }
    }
    /**
     * Getter for #text_size
     * @return {string}
     */

  }, {
    key: "text_size",
    get: function get() {
      return _classPrivateFieldGet(this, _text_size);
    }
    /**
     * Setter for #text_size
     * @param {string} text_size
     */
    ,
    set: function set(text_size) {
      if ((0, Scorm12CMI.check12ValidFormat)(text_size, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _text_size, text_size);
      }
    }
    /**
     * Getter for #video
     * @return {string}
     */

  }, {
    key: "video",
    get: function get() {
      return _classPrivateFieldGet(this, _video);
    }
    /**
     * Setter for #video
     * @param {string} video
     */
    ,
    set: function set(video) {
      if ((0, Scorm12CMI.check12ValidFormat)(video, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _video, video);
      }
    }
  }]);

  return AICCStudentPreferences;
}(Scorm12CMI.CMIStudentPreference);
/**
 * StudentData class for AICC
 */


var _tries_during_lesson = new WeakMap();

var AICCCMIStudentData = /*#__PURE__*/function (_Scorm12CMI$CMIStuden2) {
  _inherits(AICCCMIStudentData, _Scorm12CMI$CMIStuden2);

  var _super5 = _createSuper(AICCCMIStudentData);

  /**
   * Constructor for AICC StudentData object
   */
  function AICCCMIStudentData() {
    var _this4;

    _classCallCheck(this, AICCCMIStudentData);

    _this4 = _super5.call(this, aicc_constants.student_data_children);

    _tries_during_lesson.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _this4.tries = new CMITries();
    return _this4;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(AICCCMIStudentData, [{
    key: "initialize",
    value: function initialize() {
      var _this$tries;

      _get(_getPrototypeOf(AICCCMIStudentData.prototype), "initialize", this).call(this);

      (_this$tries = this.tries) === null || _this$tries === void 0 ? void 0 : _this$tries.initialize();
    }
  }, {
    key: "toJSON",

    /**
     * toJSON for cmi.student_data object
     * @return {
     *    {
     *      mastery_score: string,
     *      max_time_allowed: string,
     *      time_limit_action: string,
     *      tries: CMITries
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'mastery_score': this.mastery_score,
        'max_time_allowed': this.max_time_allowed,
        'time_limit_action': this.time_limit_action,
        'tries': this.tries
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "tries_during_lesson",

    /**
     * Getter for tries_during_lesson
     * @return {string}
     */
    get: function get() {
      return _classPrivateFieldGet(this, _tries_during_lesson);
    }
    /**
     * Setter for #tries_during_lesson. Sets an error if trying to set after
     *  initialization.
     * @param {string} tries_during_lesson
     */
    ,
    set: function set(tries_during_lesson) {
      !this.initialized ? _classPrivateFieldSet(this, _tries_during_lesson, tries_during_lesson) : (0, Scorm12CMI.throwReadOnlyError)();
    }
  }]);

  return AICCCMIStudentData;
}(Scorm12CMI.CMIStudentData);
/**
 * Class representing the AICC cmi.student_demographics object
 */


var _children = new WeakMap();

var _city = new WeakMap();

var _class = new WeakMap();

var _company = new WeakMap();

var _country = new WeakMap();

var _experience = new WeakMap();

var _familiar_name = new WeakMap();

var _instructor_name = new WeakMap();

var _title = new WeakMap();

var _native_language = new WeakMap();

var _state = new WeakMap();

var _street_address = new WeakMap();

var _telephone = new WeakMap();

var _years_experience = new WeakMap();

var CMIStudentDemographics = /*#__PURE__*/function (_BaseCMI2) {
  _inherits(CMIStudentDemographics, _BaseCMI2);

  var _super6 = _createSuper(CMIStudentDemographics);

  /**
   * Constructor for AICC StudentDemographics object
   */
  function CMIStudentDemographics() {
    var _this5;

    _classCallCheck(this, CMIStudentDemographics);

    _this5 = _super6.call(this);

    _children.set(_assertThisInitialized(_this5), {
      writable: true,
      value: aicc_constants.student_demographics_children
    });

    _city.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _class.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _company.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _country.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _experience.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _familiar_name.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _instructor_name.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _title.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _native_language.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _state.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _street_address.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _telephone.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _years_experience.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    return _this5;
  }

  _createClass(CMIStudentDemographics, [{
    key: "toJSON",

    /**
     * toJSON for cmi.student_demographics object
     * @return {
     *      {
     *        city: string,
     *        class: string,
     *        company: string,
     *        country: string,
     *        experience: string,
     *        familiar_name: string,
     *        instructor_name: string,
     *        title: string,
     *        native_language: string,
     *        state: string,
     *        street_address: string,
     *        telephone: string,
     *        years_experience: string
     *      }
     *    }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'city': this.city,
        'class': this["class"],
        'company': this.company,
        'country': this.country,
        'experience': this.experience,
        'familiar_name': this.familiar_name,
        'instructor_name': this.instructor_name,
        'title': this.title,
        'native_language': this.native_language,
        'state': this.state,
        'street_address': this.street_address,
        'telephone': this.telephone,
        'years_experience': this.years_experience
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "city",

    /**
     * Getter for city
     * @return {string}
     */
    get: function get() {
      return _classPrivateFieldGet(this, _city);
    }
    /**
     * Setter for #city. Sets an error if trying to set after
     *  initialization.
     * @param {string} city
     */
    ,
    set: function set(city) {
      !this.initialized ? _classPrivateFieldSet(this, _city, city) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for class
     * @return {string}
     */

  }, {
    key: "class",
    get: function get() {
      return _classPrivateFieldGet(this, _class);
    }
    /**
     * Setter for #class. Sets an error if trying to set after
     *  initialization.
     * @param {string} clazz
     */
    ,
    set: function set(clazz) {
      !this.initialized ? _classPrivateFieldSet(this, _class, clazz) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for company
     * @return {string}
     */

  }, {
    key: "company",
    get: function get() {
      return _classPrivateFieldGet(this, _company);
    }
    /**
     * Setter for #company. Sets an error if trying to set after
     *  initialization.
     * @param {string} company
     */
    ,
    set: function set(company) {
      !this.initialized ? _classPrivateFieldSet(this, _company, company) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for country
     * @return {string}
     */

  }, {
    key: "country",
    get: function get() {
      return _classPrivateFieldGet(this, _country);
    }
    /**
     * Setter for #country. Sets an error if trying to set after
     *  initialization.
     * @param {string} country
     */
    ,
    set: function set(country) {
      !this.initialized ? _classPrivateFieldSet(this, _country, country) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for experience
     * @return {string}
     */

  }, {
    key: "experience",
    get: function get() {
      return _classPrivateFieldGet(this, _experience);
    }
    /**
     * Setter for #experience. Sets an error if trying to set after
     *  initialization.
     * @param {string} experience
     */
    ,
    set: function set(experience) {
      !this.initialized ? _classPrivateFieldSet(this, _experience, experience) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for familiar_name
     * @return {string}
     */

  }, {
    key: "familiar_name",
    get: function get() {
      return _classPrivateFieldGet(this, _familiar_name);
    }
    /**
     * Setter for #familiar_name. Sets an error if trying to set after
     *  initialization.
     * @param {string} familiar_name
     */
    ,
    set: function set(familiar_name) {
      !this.initialized ? _classPrivateFieldSet(this, _familiar_name, familiar_name) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for instructor_name
     * @return {string}
     */

  }, {
    key: "instructor_name",
    get: function get() {
      return _classPrivateFieldGet(this, _instructor_name);
    }
    /**
     * Setter for #instructor_name. Sets an error if trying to set after
     *  initialization.
     * @param {string} instructor_name
     */
    ,
    set: function set(instructor_name) {
      !this.initialized ? _classPrivateFieldSet(this, _instructor_name, instructor_name) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for title
     * @return {string}
     */

  }, {
    key: "title",
    get: function get() {
      return _classPrivateFieldGet(this, _title);
    }
    /**
     * Setter for #title. Sets an error if trying to set after
     *  initialization.
     * @param {string} title
     */
    ,
    set: function set(title) {
      !this.initialized ? _classPrivateFieldSet(this, _title, title) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for native_language
     * @return {string}
     */

  }, {
    key: "native_language",
    get: function get() {
      return _classPrivateFieldGet(this, _native_language);
    }
    /**
     * Setter for #native_language. Sets an error if trying to set after
     *  initialization.
     * @param {string} native_language
     */
    ,
    set: function set(native_language) {
      !this.initialized ? _classPrivateFieldSet(this, _native_language, native_language) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for state
     * @return {string}
     */

  }, {
    key: "state",
    get: function get() {
      return _classPrivateFieldGet(this, _state);
    }
    /**
     * Setter for #state. Sets an error if trying to set after
     *  initialization.
     * @param {string} state
     */
    ,
    set: function set(state) {
      !this.initialized ? _classPrivateFieldSet(this, _state, state) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for street_address
     * @return {string}
     */

  }, {
    key: "street_address",
    get: function get() {
      return _classPrivateFieldGet(this, _street_address);
    }
    /**
     * Setter for #street_address. Sets an error if trying to set after
     *  initialization.
     * @param {string} street_address
     */
    ,
    set: function set(street_address) {
      !this.initialized ? _classPrivateFieldSet(this, _street_address, street_address) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for telephone
     * @return {string}
     */

  }, {
    key: "telephone",
    get: function get() {
      return _classPrivateFieldGet(this, _telephone);
    }
    /**
     * Setter for #telephone. Sets an error if trying to set after
     *  initialization.
     * @param {string} telephone
     */
    ,
    set: function set(telephone) {
      !this.initialized ? _classPrivateFieldSet(this, _telephone, telephone) : (0, Scorm12CMI.throwReadOnlyError)();
    }
    /**
     * Getter for years_experience
     * @return {string}
     */

  }, {
    key: "years_experience",
    get: function get() {
      return _classPrivateFieldGet(this, _years_experience);
    }
    /**
     * Setter for #years_experience. Sets an error if trying to set after
     *  initialization.
     * @param {string} years_experience
     */
    ,
    set: function set(years_experience) {
      !this.initialized ? _classPrivateFieldSet(this, _years_experience, years_experience) : (0, Scorm12CMI.throwReadOnlyError)();
    }
  }]);

  return CMIStudentDemographics;
}(_common.BaseCMI);
/**
 * Class representing the AICC cmi.paths object
 */


exports.CMIStudentDemographics = CMIStudentDemographics;

var CMIPaths = /*#__PURE__*/function (_CMIArray2) {
  _inherits(CMIPaths, _CMIArray2);

  var _super7 = _createSuper(CMIPaths);

  /**
   * Constructor for inline Paths Array class
   */
  function CMIPaths() {
    _classCallCheck(this, CMIPaths);

    return _super7.call(this, aicc_constants.paths_children);
  }

  return CMIPaths;
}(_common.CMIArray);
/**
 * Class for AICC Paths
 */


exports.CMIPaths = CMIPaths;

var _location_id = new WeakMap();

var _date = new WeakMap();

var _time = new WeakMap();

var _status = new WeakMap();

var _why_left = new WeakMap();

var _time_in_element = new WeakMap();

var CMIPathsObject = /*#__PURE__*/function (_BaseCMI3) {
  _inherits(CMIPathsObject, _BaseCMI3);

  var _super8 = _createSuper(CMIPathsObject);

  /**
   * Constructor for AICC Paths objects
   */
  function CMIPathsObject() {
    var _this6;

    _classCallCheck(this, CMIPathsObject);

    _this6 = _super8.call(this);

    _location_id.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _date.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _time.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _status.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _why_left.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _time_in_element.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    return _this6;
  }

  _createClass(CMIPathsObject, [{
    key: "toJSON",

    /**
     * toJSON for cmi.paths.n object
     * @return {
     *    {
     *      location_id: string,
     *      date: string,
     *      time: string,
     *      status: string,
     *      why_left: string,
     *      time_in_element: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'location_id': this.location_id,
        'date': this.date,
        'time': this.time,
        'status': this.status,
        'why_left': this.why_left,
        'time_in_element': this.time_in_element
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "location_id",

    /**
     * Getter for #location_id
     * @return {string}
     */
    get: function get() {
      return _classPrivateFieldGet(this, _location_id);
    }
    /**
     * Setter for #location_id
     * @param {string} location_id
     */
    ,
    set: function set(location_id) {
      if ((0, Scorm12CMI.check12ValidFormat)(location_id, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _location_id, location_id);
      }
    }
    /**
     * Getter for #date
     * @return {string}
     */

  }, {
    key: "date",
    get: function get() {
      return _classPrivateFieldGet(this, _date);
    }
    /**
     * Setter for #date
     * @param {string} date
     */
    ,
    set: function set(date) {
      if ((0, Scorm12CMI.check12ValidFormat)(date, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _date, date);
      }
    }
    /**
     * Getter for #time
     * @return {string}
     */

  }, {
    key: "time",
    get: function get() {
      return _classPrivateFieldGet(this, _time);
    }
    /**
     * Setter for #time
     * @param {string} time
     */
    ,
    set: function set(time) {
      if ((0, Scorm12CMI.check12ValidFormat)(time, aicc_regex.CMITime)) {
        _classPrivateFieldSet(this, _time, time);
      }
    }
    /**
     * Getter for #status
     * @return {string}
     */

  }, {
    key: "status",
    get: function get() {
      return _classPrivateFieldGet(this, _status);
    }
    /**
     * Setter for #status
     * @param {string} status
     */
    ,
    set: function set(status) {
      if ((0, Scorm12CMI.check12ValidFormat)(status, aicc_regex.CMIStatus2)) {
        _classPrivateFieldSet(this, _status, status);
      }
    }
    /**
     * Getter for #why_left
     * @return {string}
     */

  }, {
    key: "why_left",
    get: function get() {
      return _classPrivateFieldGet(this, _why_left);
    }
    /**
     * Setter for #why_left
     * @param {string} why_left
     */
    ,
    set: function set(why_left) {
      if ((0, Scorm12CMI.check12ValidFormat)(why_left, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _why_left, why_left);
      }
    }
    /**
     * Getter for #time_in_element
     * @return {string}
     */

  }, {
    key: "time_in_element",
    get: function get() {
      return _classPrivateFieldGet(this, _time_in_element);
    }
    /**
     * Setter for #time_in_element
     * @param {string} time_in_element
     */
    ,
    set: function set(time_in_element) {
      if ((0, Scorm12CMI.check12ValidFormat)(time_in_element, aicc_regex.CMITime)) {
        _classPrivateFieldSet(this, _time_in_element, time_in_element);
      }
    }
  }]);

  return CMIPathsObject;
}(_common.BaseCMI);
/**
 * Class representing the AICC cmi.student_data.tries object
 */


exports.CMIPathsObject = CMIPathsObject;

var CMITries = /*#__PURE__*/function (_CMIArray3) {
  _inherits(CMITries, _CMIArray3);

  var _super9 = _createSuper(CMITries);

  /**
   * Constructor for inline Tries Array class
   */
  function CMITries() {
    _classCallCheck(this, CMITries);

    return _super9.call(this, aicc_constants.tries_children);
  }

  return CMITries;
}(_common.CMIArray);
/**
 * Class for AICC Tries
 */


exports.CMITries = CMITries;

var _status2 = new WeakMap();

var _time2 = new WeakMap();

var CMITriesObject = /*#__PURE__*/function (_BaseCMI4) {
  _inherits(CMITriesObject, _BaseCMI4);

  var _super10 = _createSuper(CMITriesObject);

  /**
   * Constructor for AICC Tries object
   */
  function CMITriesObject() {
    var _this7;

    _classCallCheck(this, CMITriesObject);

    _this7 = _super10.call(this);

    _status2.set(_assertThisInitialized(_this7), {
      writable: true,
      value: ''
    });

    _time2.set(_assertThisInitialized(_this7), {
      writable: true,
      value: ''
    });

    _this7.score = new _common.CMIScore({
      score_children: aicc_constants.score_children,
      score_range: aicc_regex.score_range,
      invalidErrorCode: scorm12_error_codes.INVALID_SET_VALUE,
      invalidTypeCode: scorm12_error_codes.TYPE_MISMATCH,
      invalidRangeCode: scorm12_error_codes.VALUE_OUT_OF_RANGE
    });
    return _this7;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMITriesObject, [{
    key: "initialize",
    value: function initialize() {
      var _this$score;

      _get(_getPrototypeOf(CMITriesObject.prototype), "initialize", this).call(this);

      (_this$score = this.score) === null || _this$score === void 0 ? void 0 : _this$score.initialize();
    }
  }, {
    key: "toJSON",

    /**
     * toJSON for cmi.student_data.tries.n object
     * @return {
     *    {
     *      status: string,
     *      time: string,
     *      score: CMIScore
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'status': this.status,
        'time': this.time,
        'score': this.score
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "status",

    /**
     * Getter for #status
     * @return {string}
     */
    get: function get() {
      return _classPrivateFieldGet(this, _status2);
    }
    /**
     * Setter for #status
     * @param {string} status
     */
    ,
    set: function set(status) {
      if ((0, Scorm12CMI.check12ValidFormat)(status, aicc_regex.CMIStatus2)) {
        _classPrivateFieldSet(this, _status2, status);
      }
    }
    /**
     * Getter for #time
     * @return {string}
     */

  }, {
    key: "time",
    get: function get() {
      return _classPrivateFieldGet(this, _time2);
    }
    /**
     * Setter for #time
     * @param {string} time
     */
    ,
    set: function set(time) {
      if ((0, Scorm12CMI.check12ValidFormat)(time, aicc_regex.CMITime)) {
        _classPrivateFieldSet(this, _time2, time);
      }
    }
  }]);

  return CMITriesObject;
}(_common.BaseCMI);
/**
 * Class for cmi.student_data.attempt_records array
 */


exports.CMITriesObject = CMITriesObject;

var CMIAttemptRecords = /*#__PURE__*/function (_CMIArray4) {
  _inherits(CMIAttemptRecords, _CMIArray4);

  var _super11 = _createSuper(CMIAttemptRecords);

  /**
   * Constructor for inline Tries Array class
   */
  function CMIAttemptRecords() {
    _classCallCheck(this, CMIAttemptRecords);

    return _super11.call(this, aicc_constants.attempt_records_children);
  }

  return CMIAttemptRecords;
}(_common.CMIArray);
/**
 * Class for AICC Attempt Records
 */


exports.CMIAttemptRecords = CMIAttemptRecords;

var _lesson_status = new WeakMap();

var CMIAttemptRecordsObject = /*#__PURE__*/function (_BaseCMI5) {
  _inherits(CMIAttemptRecordsObject, _BaseCMI5);

  var _super12 = _createSuper(CMIAttemptRecordsObject);

  /**
   * Constructor for AICC Attempt Records object
   */
  function CMIAttemptRecordsObject() {
    var _this8;

    _classCallCheck(this, CMIAttemptRecordsObject);

    _this8 = _super12.call(this);

    _lesson_status.set(_assertThisInitialized(_this8), {
      writable: true,
      value: ''
    });

    _this8.score = new _common.CMIScore({
      score_children: aicc_constants.score_children,
      score_range: aicc_regex.score_range,
      invalidErrorCode: scorm12_error_codes.INVALID_SET_VALUE,
      invalidTypeCode: scorm12_error_codes.TYPE_MISMATCH,
      invalidRangeCode: scorm12_error_codes.VALUE_OUT_OF_RANGE
    });
    return _this8;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMIAttemptRecordsObject, [{
    key: "initialize",
    value: function initialize() {
      var _this$score2;

      _get(_getPrototypeOf(CMIAttemptRecordsObject.prototype), "initialize", this).call(this);

      (_this$score2 = this.score) === null || _this$score2 === void 0 ? void 0 : _this$score2.initialize();
    }
  }, {
    key: "toJSON",

    /**
     * toJSON for cmi.student_data.attempt_records.n object
     * @return {
     *    {
     *      status: string,
     *      time: string,
     *      score: CMIScore
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'lesson_status': this.lesson_status,
        'score': this.score
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "lesson_status",

    /**
     * Getter for #lesson_status
     * @return {string}
     */
    get: function get() {
      return _classPrivateFieldGet(this, _lesson_status);
    }
    /**
     * Setter for #lesson_status
     * @param {string} lesson_status
     */
    ,
    set: function set(lesson_status) {
      if ((0, Scorm12CMI.check12ValidFormat)(lesson_status, aicc_regex.CMIStatus2)) {
        _classPrivateFieldSet(this, _lesson_status, lesson_status);
      }
    }
  }]);

  return CMIAttemptRecordsObject;
}(_common.BaseCMI);
/**
 * Class for AICC Evaluation Comments
 */


exports.CMIAttemptRecordsObject = CMIAttemptRecordsObject;

var _content = new WeakMap();

var _location = new WeakMap();

var _time3 = new WeakMap();

var CMIEvaluationCommentsObject = /*#__PURE__*/function (_BaseCMI6) {
  _inherits(CMIEvaluationCommentsObject, _BaseCMI6);

  var _super13 = _createSuper(CMIEvaluationCommentsObject);

  /**
   * Constructor for Evaluation Comments
   */
  function CMIEvaluationCommentsObject() {
    var _this9;

    _classCallCheck(this, CMIEvaluationCommentsObject);

    _this9 = _super13.call(this);

    _content.set(_assertThisInitialized(_this9), {
      writable: true,
      value: ''
    });

    _location.set(_assertThisInitialized(_this9), {
      writable: true,
      value: ''
    });

    _time3.set(_assertThisInitialized(_this9), {
      writable: true,
      value: ''
    });

    return _this9;
  }

  _createClass(CMIEvaluationCommentsObject, [{
    key: "toJSON",

    /**
     * toJSON for cmi.evaulation.comments.n object
     * @return {
     *    {
     *      content: string,
     *      location: string,
     *      time: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'content': this.content,
        'location': this.location,
        'time': this.time
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "content",

    /**
     * Getter for #content
     * @return {string}
     */
    get: function get() {
      return _classPrivateFieldGet(this, _content);
    }
    /**
     * Setter for #content
     * @param {string} content
     */
    ,
    set: function set(content) {
      if ((0, Scorm12CMI.check12ValidFormat)(content, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _content, content);
      }
    }
    /**
     * Getter for #location
     * @return {string}
     */

  }, {
    key: "location",
    get: function get() {
      return _classPrivateFieldGet(this, _location);
    }
    /**
     * Setter for #location
     * @param {string} location
     */
    ,
    set: function set(location) {
      if ((0, Scorm12CMI.check12ValidFormat)(location, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _location, location);
      }
    }
    /**
     * Getter for #time
     * @return {string}
     */

  }, {
    key: "time",
    get: function get() {
      return _classPrivateFieldGet(this, _time3);
    }
    /**
     * Setting for #time
     * @param {string} time
     */
    ,
    set: function set(time) {
      if ((0, Scorm12CMI.check12ValidFormat)(time, aicc_regex.CMITime)) {
        _classPrivateFieldSet(this, _time3, time);
      }
    }
  }]);

  return CMIEvaluationCommentsObject;
}(_common.BaseCMI);

exports.CMIEvaluationCommentsObject = CMIEvaluationCommentsObject;

},{"../constants/api_constants":10,"../constants/error_codes":11,"../constants/regex":13,"./common":7,"./scorm12_cmi":8}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkValidFormat = checkValidFormat;
exports.checkValidRange = checkValidRange;
exports.CMIArray = exports.CMIScore = exports.BaseCMI = void 0;

var _api_constants = _interopRequireDefault(require("../constants/api_constants"));

var _error_codes = _interopRequireDefault(require("../constants/error_codes"));

var _exceptions = require("../exceptions");

var _regex = _interopRequireDefault(require("../constants/regex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var scorm12_constants = _api_constants["default"].scorm12;
var scorm12_regex = _regex["default"].scorm12;
var scorm12_error_codes = _error_codes["default"].scorm12;
/**
 * Check if the value matches the proper format. If not, throw proper error code.
 *
 * @param {string} value
 * @param {string} regexPattern
 * @param {number} errorCode
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */

function checkValidFormat(value, regexPattern, errorCode, allowEmptyString) {
  var formatRegex = new RegExp(regexPattern);
  var matches = value.match(formatRegex);

  if (allowEmptyString && value === '') {
    return true;
  }

  if (value === undefined || !matches || matches[0] === '') {
    throw new _exceptions.ValidationError(errorCode);
  }

  return true;
}
/**
 * Check if the value matches the proper range. If not, throw proper error code.
 *
 * @param {*} value
 * @param {string} rangePattern
 * @param {number} errorCode
 * @return {boolean}
 */


function checkValidRange(value, rangePattern, errorCode) {
  var ranges = rangePattern.split('#');
  value = value * 1.0;

  if (value >= ranges[0]) {
    if (ranges[1] === '*' || value <= ranges[1]) {
      return true;
    } else {
      throw new _exceptions.ValidationError(errorCode);
    }
  } else {
    throw new _exceptions.ValidationError(errorCode);
  }
}
/**
 * Base class for API cmi objects
 */


var _initialized = new WeakMap();

var _start_time = new WeakMap();

var BaseCMI = /*#__PURE__*/function () {
  /**
   * Constructor for BaseCMI, just marks the class as abstract
   */
  function BaseCMI() {
    _classCallCheck(this, BaseCMI);

    _defineProperty(this, "jsonString", false);

    _initialized.set(this, {
      writable: true,
      value: false
    });

    _start_time.set(this, {
      writable: true,
      value: void 0
    });

    if ((this instanceof BaseCMI ? this.constructor : void 0) === BaseCMI) {
      throw new TypeError('Cannot construct BaseCMI instances directly');
    }
  }
  /**
   * Getter for #initialized
   * @return {boolean}
   */


  _createClass(BaseCMI, [{
    key: "initialize",

    /**
     * Called when the API has been initialized after the CMI has been created
     */
    value: function initialize() {
      _classPrivateFieldSet(this, _initialized, true);
    }
    /**
     * Called when the player should override the 'session_time' provided by
     * the module
     */

  }, {
    key: "setStartTime",
    value: function setStartTime() {
      _classPrivateFieldSet(this, _start_time, new Date().getTime());
    }
  }, {
    key: "initialized",
    get: function get() {
      return _classPrivateFieldGet(this, _initialized);
    }
    /**
     * Getter for #start_time
     * @return {Number}
     */

  }, {
    key: "start_time",
    get: function get() {
      return _classPrivateFieldGet(this, _start_time);
    }
  }]);

  return BaseCMI;
}();
/**
 * Base class for cmi *.score objects
 */


exports.BaseCMI = BaseCMI;

var _children2 = new WeakMap();

var _score_range = new WeakMap();

var _invalid_error_code = new WeakMap();

var _invalid_type_code = new WeakMap();

var _invalid_range_code = new WeakMap();

var _decimal_regex = new WeakMap();

var _raw = new WeakMap();

var _min = new WeakMap();

var _max = new WeakMap();

var CMIScore = /*#__PURE__*/function (_BaseCMI) {
  _inherits(CMIScore, _BaseCMI);

  var _super = _createSuper(CMIScore);

  /**
   * Constructor for *.score
   * @param {string} score_children
   * @param {string} score_range
   * @param {string} max
   * @param {number} invalidErrorCode
   * @param {number} invalidTypeCode
   * @param {number} invalidRangeCode
   * @param {string} decimalRegex
   */
  function CMIScore(_ref) {
    var _this;

    var score_children = _ref.score_children,
        score_range = _ref.score_range,
        max = _ref.max,
        invalidErrorCode = _ref.invalidErrorCode,
        invalidTypeCode = _ref.invalidTypeCode,
        invalidRangeCode = _ref.invalidRangeCode,
        decimalRegex = _ref.decimalRegex;

    _classCallCheck(this, CMIScore);

    _this = _super.call(this);

    _children2.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _score_range.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _invalid_error_code.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _invalid_type_code.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _invalid_range_code.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _decimal_regex.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _raw.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _min.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _max.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(_assertThisInitialized(_this), _children2, score_children || scorm12_constants.score_children);

    _classPrivateFieldSet(_assertThisInitialized(_this), _score_range, !score_range ? false : scorm12_regex.score_range);

    _classPrivateFieldSet(_assertThisInitialized(_this), _max, max || max === '' ? max : '100');

    _classPrivateFieldSet(_assertThisInitialized(_this), _invalid_error_code, invalidErrorCode || scorm12_error_codes.INVALID_SET_VALUE);

    _classPrivateFieldSet(_assertThisInitialized(_this), _invalid_type_code, invalidTypeCode || scorm12_error_codes.TYPE_MISMATCH);

    _classPrivateFieldSet(_assertThisInitialized(_this), _invalid_range_code, invalidRangeCode || scorm12_error_codes.VALUE_OUT_OF_RANGE);

    _classPrivateFieldSet(_assertThisInitialized(_this), _decimal_regex, decimalRegex || scorm12_regex.CMIDecimal);

    return _this;
  }

  _createClass(CMIScore, [{
    key: "toJSON",

    /**
     * toJSON for *.score
     * @return {{min: string, max: string, raw: string}}
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'raw': this.raw,
        'min': this.min,
        'max': this.max
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "_children",

    /**
     * Getter for _children
     * @return {string}
     * @private
     */
    get: function get() {
      return _classPrivateFieldGet(this, _children2);
    }
    /**
     * Setter for _children. Just throws an error.
     * @param {string} _children
     * @private
     */
    ,
    set: function set(_children) {
      throw new _exceptions.ValidationError(_classPrivateFieldGet(this, _invalid_error_code));
    }
    /**
     * Getter for #raw
     * @return {string}
     */

  }, {
    key: "raw",
    get: function get() {
      return _classPrivateFieldGet(this, _raw);
    }
    /**
     * Setter for #raw
     * @param {string} raw
     */
    ,
    set: function set(raw) {
      if (checkValidFormat(raw, _classPrivateFieldGet(this, _decimal_regex), _classPrivateFieldGet(this, _invalid_type_code)) && (!_classPrivateFieldGet(this, _score_range) || checkValidRange(raw, _classPrivateFieldGet(this, _score_range), _classPrivateFieldGet(this, _invalid_range_code)))) {
        _classPrivateFieldSet(this, _raw, raw);
      }
    }
    /**
     * Getter for #min
     * @return {string}
     */

  }, {
    key: "min",
    get: function get() {
      return _classPrivateFieldGet(this, _min);
    }
    /**
     * Setter for #min
     * @param {string} min
     */
    ,
    set: function set(min) {
      if (checkValidFormat(min, _classPrivateFieldGet(this, _decimal_regex), _classPrivateFieldGet(this, _invalid_type_code)) && (!_classPrivateFieldGet(this, _score_range) || checkValidRange(min, _classPrivateFieldGet(this, _score_range), _classPrivateFieldGet(this, _invalid_range_code)))) {
        _classPrivateFieldSet(this, _min, min);
      }
    }
    /**
     * Getter for #max
     * @return {string}
     */

  }, {
    key: "max",
    get: function get() {
      return _classPrivateFieldGet(this, _max);
    }
    /**
     * Setter for #max
     * @param {string} max
     */
    ,
    set: function set(max) {
      if (checkValidFormat(max, _classPrivateFieldGet(this, _decimal_regex), _classPrivateFieldGet(this, _invalid_type_code)) && (!_classPrivateFieldGet(this, _score_range) || checkValidRange(max, _classPrivateFieldGet(this, _score_range), _classPrivateFieldGet(this, _invalid_range_code)))) {
        _classPrivateFieldSet(this, _max, max);
      }
    }
  }]);

  return CMIScore;
}(BaseCMI);
/**
 * Base class for cmi *.n objects
 */


exports.CMIScore = CMIScore;

var _errorCode = new WeakMap();

var _children3 = new WeakMap();

var CMIArray = /*#__PURE__*/function (_BaseCMI2) {
  _inherits(CMIArray, _BaseCMI2);

  var _super2 = _createSuper(CMIArray);

  /**
   * Constructor cmi *.n arrays
   * @param {string} children
   * @param {number} errorCode
   */
  function CMIArray(_ref2) {
    var _this2;

    var children = _ref2.children,
        errorCode = _ref2.errorCode;

    _classCallCheck(this, CMIArray);

    _this2 = _super2.call(this);

    _errorCode.set(_assertThisInitialized(_this2), {
      writable: true,
      value: void 0
    });

    _children3.set(_assertThisInitialized(_this2), {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(_assertThisInitialized(_this2), _children3, children);

    _classPrivateFieldSet(_assertThisInitialized(_this2), _errorCode, errorCode);

    _this2.childArray = [];
    return _this2;
  }

  _createClass(CMIArray, [{
    key: "toJSON",

    /**
     * toJSON for *.n arrays
     * @return {object}
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {};

      for (var i = 0; i < this.childArray.length; i++) {
        result[i + ''] = this.childArray[i];
      }

      delete this.jsonString;
      return result;
    }
  }, {
    key: "_children",

    /**
     * Getter for _children
     * @return {*}
     */
    get: function get() {
      return _classPrivateFieldGet(this, _children3);
    }
    /**
     * Setter for _children. Just throws an error.
     * @param {string} _children
     */
    ,
    set: function set(_children) {
      throw new _exceptions.ValidationError(_classPrivateFieldGet(this, _errorCode));
    }
    /**
     * Getter for _count
     * @return {number}
     */

  }, {
    key: "_count",
    get: function get() {
      return this.childArray.length;
    }
    /**
     * Setter for _count. Just throws an error.
     * @param {number} _count
     */
    ,
    set: function set(_count) {
      throw new _exceptions.ValidationError(_classPrivateFieldGet(this, _errorCode));
    }
  }]);

  return CMIArray;
}(BaseCMI);

exports.CMIArray = CMIArray;

},{"../constants/api_constants":10,"../constants/error_codes":11,"../constants/regex":13,"../exceptions":15}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throwReadOnlyError = throwReadOnlyError;
exports.throwWriteOnlyError = throwWriteOnlyError;
exports.check12ValidFormat = check12ValidFormat;
exports.check12ValidRange = check12ValidRange;
exports.NAV = exports.CMIInteractionsCorrectResponsesObject = exports.CMIInteractionsObjectivesObject = exports.CMIObjectivesObject = exports.CMIInteractionsObject = exports.CMIStudentPreference = exports.CMIStudentData = exports.CMI = void 0;

var _common = require("./common");

var _api_constants = _interopRequireDefault(require("../constants/api_constants"));

var _error_codes = _interopRequireDefault(require("../constants/error_codes"));

var _regex = _interopRequireDefault(require("../constants/regex"));

var _exceptions = require("../exceptions");

var Utilities = _interopRequireWildcard(require("../utilities"));

var Util = Utilities;

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

var scorm12_constants = _api_constants["default"].scorm12;
var scorm12_regex = _regex["default"].scorm12;
var scorm12_error_codes = _error_codes["default"].scorm12;
/**
 * Helper method for throwing Read Only error
 */

function throwReadOnlyError() {
  throw new _exceptions.ValidationError(scorm12_error_codes.READ_ONLY_ELEMENT);
}
/**
 * Helper method for throwing Write Only error
 */


function throwWriteOnlyError() {
  throw new _exceptions.ValidationError(scorm12_error_codes.WRITE_ONLY_ELEMENT);
}
/**
 * Helper method for throwing Invalid Set error
 */


function throwInvalidValueError() {
  throw new _exceptions.ValidationError(scorm12_error_codes.INVALID_SET_VALUE);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */


function check12ValidFormat(value, regexPattern, allowEmptyString) {
  return (0, _common.checkValidFormat)(value, regexPattern, scorm12_error_codes.TYPE_MISMATCH, allowEmptyString);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} rangePattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */


function check12ValidRange(value, rangePattern, allowEmptyString) {
  return (0, _common.checkValidRange)(value, rangePattern, scorm12_error_codes.VALUE_OUT_OF_RANGE, allowEmptyString);
}
/**
 * Class representing the cmi object for SCORM 1.2
 */


var _children2 = new WeakMap();

var _version2 = new WeakMap();

var _launch_data = new WeakMap();

var _comments = new WeakMap();

var _comments_from_lms = new WeakMap();

var CMI = /*#__PURE__*/function (_BaseCMI) {
  _inherits(CMI, _BaseCMI);

  var _super = _createSuper(CMI);

  /**
   * Constructor for the SCORM 1.2 cmi object
   * @param {string} cmi_children
   * @param {(CMIStudentData|AICCCMIStudentData)} student_data
   * @param {boolean} initialized
   */
  function CMI(cmi_children, student_data, initialized) {
    var _this;

    _classCallCheck(this, CMI);

    _this = _super.call(this);

    _children2.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _version2.set(_assertThisInitialized(_this), {
      writable: true,
      value: '3.4'
    });

    _launch_data.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _comments.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _comments_from_lms.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _defineProperty(_assertThisInitialized(_this), "student_data", null);

    if (initialized) _this.initialize();

    _classPrivateFieldSet(_assertThisInitialized(_this), _children2, cmi_children ? cmi_children : scorm12_constants.cmi_children);

    _this.core = new CMICore();
    _this.objectives = new CMIObjectives();
    _this.student_data = student_data ? student_data : new CMIStudentData();
    _this.student_preference = new CMIStudentPreference();
    _this.interactions = new CMIInteractions();
    return _this;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMI, [{
    key: "initialize",
    value: function initialize() {
      var _this$core, _this$objectives, _this$student_data, _this$student_prefere, _this$interactions;

      _get(_getPrototypeOf(CMI.prototype), "initialize", this).call(this);

      (_this$core = this.core) === null || _this$core === void 0 ? void 0 : _this$core.initialize();
      (_this$objectives = this.objectives) === null || _this$objectives === void 0 ? void 0 : _this$objectives.initialize();
      (_this$student_data = this.student_data) === null || _this$student_data === void 0 ? void 0 : _this$student_data.initialize();
      (_this$student_prefere = this.student_preference) === null || _this$student_prefere === void 0 ? void 0 : _this$student_prefere.initialize();
      (_this$interactions = this.interactions) === null || _this$interactions === void 0 ? void 0 : _this$interactions.initialize();
    }
    /**
     * toJSON for cmi
     *
     * @return {
     *    {
     *      suspend_data: string,
     *      launch_data: string,
     *      comments: string,
     *      comments_from_lms: string,
     *      core: CMICore,
     *      objectives: CMIObjectives,
     *      student_data: CMIStudentData,
     *      student_preference: CMIStudentPreference,
     *      interactions: CMIInteractions
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'suspend_data': this.suspend_data,
        'launch_data': this.launch_data,
        'comments': this.comments,
        'comments_from_lms': this.comments_from_lms,
        'core': this.core,
        'objectives': this.objectives,
        'student_data': this.student_data,
        'student_preference': this.student_preference,
        'interactions': this.interactions
      };
      delete this.jsonString;
      return result;
    }
    /**
     * Getter for #_version
     * @return {string}
     */

  }, {
    key: "getCurrentTotalTime",

    /**
     * Adds the current session time to the existing total time.
     *
     * @return {string}
     */
    value: function getCurrentTotalTime() {
      return this.core.getCurrentTotalTime(this.start_time);
    }
  }, {
    key: "_version",
    get: function get() {
      return _classPrivateFieldGet(this, _version2);
    }
    /**
     * Setter for #_version. Just throws an error.
     * @param {string} _version
     */
    ,
    set: function set(_version) {
      throwInvalidValueError();
    }
    /**
     * Getter for #_children
     * @return {string}
     */

  }, {
    key: "_children",
    get: function get() {
      return _classPrivateFieldGet(this, _children2);
    }
    /**
     * Setter for #_version. Just throws an error.
     * @param {string} _children
     */
    ,
    set: function set(_children) {
      throwInvalidValueError();
    }
    /**
     * Getter for #suspend_data
     * @return {string}
     */

  }, {
    key: "suspend_data",
    get: function get() {
      var _this$core2;

      return (_this$core2 = this.core) === null || _this$core2 === void 0 ? void 0 : _this$core2.suspend_data;
    }
    /**
     * Setter for #suspend_data
     * @param {string} suspend_data
     */
    ,
    set: function set(suspend_data) {
      if (this.core) {
        this.core.suspend_data = suspend_data;
      }
    }
    /**
     * Getter for #launch_data
     * @return {string}
     */

  }, {
    key: "launch_data",
    get: function get() {
      return _classPrivateFieldGet(this, _launch_data);
    }
    /**
     * Setter for #launch_data. Can only be called before  initialization.
     * @param {string} launch_data
     */
    ,
    set: function set(launch_data) {
      !this.initialized ? _classPrivateFieldSet(this, _launch_data, launch_data) : throwReadOnlyError();
    }
    /**
     * Getter for #comments
     * @return {string}
     */

  }, {
    key: "comments",
    get: function get() {
      return _classPrivateFieldGet(this, _comments);
    }
    /**
     * Setter for #comments
     * @param {string} comments
     */
    ,
    set: function set(comments) {
      if (check12ValidFormat(comments, scorm12_regex.CMIString4096)) {
        _classPrivateFieldSet(this, _comments, comments);
      }
    }
    /**
     * Getter for #comments_from_lms
     * @return {string}
     */

  }, {
    key: "comments_from_lms",
    get: function get() {
      return _classPrivateFieldGet(this, _comments_from_lms);
    }
    /**
     * Setter for #comments_from_lms. Can only be called before  initialization.
     * @param {string} comments_from_lms
     */
    ,
    set: function set(comments_from_lms) {
      !this.initialized ? _classPrivateFieldSet(this, _comments_from_lms, comments_from_lms) : throwReadOnlyError();
    }
  }]);

  return CMI;
}(_common.BaseCMI);
/**
 * Class representing the cmi.core object
 * @extends BaseCMI
 */


exports.CMI = CMI;

var _children3 = new WeakMap();

var _student_id = new WeakMap();

var _student_name = new WeakMap();

var _lesson_location = new WeakMap();

var _credit = new WeakMap();

var _lesson_status = new WeakMap();

var _entry = new WeakMap();

var _total_time = new WeakMap();

var _lesson_mode = new WeakMap();

var _exit = new WeakMap();

var _session_time = new WeakMap();

var _suspend_data = new WeakMap();

var CMICore = /*#__PURE__*/function (_BaseCMI2) {
  _inherits(CMICore, _BaseCMI2);

  var _super2 = _createSuper(CMICore);

  /**
   * Constructor for cmi.core
   */
  function CMICore() {
    var _this2;

    _classCallCheck(this, CMICore);

    _this2 = _super2.call(this);

    _children3.set(_assertThisInitialized(_this2), {
      writable: true,
      value: scorm12_constants.core_children
    });

    _student_id.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _student_name.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _lesson_location.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _credit.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _lesson_status.set(_assertThisInitialized(_this2), {
      writable: true,
      value: 'not attempted'
    });

    _entry.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _total_time.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _lesson_mode.set(_assertThisInitialized(_this2), {
      writable: true,
      value: 'normal'
    });

    _exit.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _session_time.set(_assertThisInitialized(_this2), {
      writable: true,
      value: '00:00:00'
    });

    _suspend_data.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _this2.score = new _common.CMIScore({
      score_children: scorm12_constants.score_children,
      score_range: scorm12_regex.score_range,
      invalidErrorCode: scorm12_error_codes.INVALID_SET_VALUE,
      invalidTypeCode: scorm12_error_codes.TYPE_MISMATCH,
      invalidRangeCode: scorm12_error_codes.VALUE_OUT_OF_RANGE
    });
    return _this2;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMICore, [{
    key: "initialize",
    value: function initialize() {
      var _this$score;

      _get(_getPrototypeOf(CMICore.prototype), "initialize", this).call(this);

      (_this$score = this.score) === null || _this$score === void 0 ? void 0 : _this$score.initialize();
    }
  }, {
    key: "getCurrentTotalTime",

    /**
     * Adds the current session time to the existing total time.
     * @param {Number} start_time
     * @return {string}
     */
    value: function getCurrentTotalTime(start_time) {
      var sessionTime = _classPrivateFieldGet(this, _session_time);

      var startTime = start_time;

      if (typeof startTime !== 'undefined' || startTime === null) {
        var seconds = new Date().getTime() - startTime;
        sessionTime = Util.getSecondsAsHHMMSS(seconds / 1000);
      }

      return Utilities.addHHMMSSTimeStrings(_classPrivateFieldGet(this, _total_time), sessionTime, new RegExp(scorm12_regex.CMITimespan));
    }
    /**
     * toJSON for cmi.core
     *
     * @return {
     *    {
     *      student_name: string,
     *      entry: string,
     *      exit: string,
     *      score: CMIScore,
     *      student_id: string,
     *      lesson_mode: string,
     *      lesson_location: string,
     *      lesson_status: string,
     *      credit: string,
     *      session_time: *
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'student_id': this.student_id,
        'student_name': this.student_name,
        'lesson_location': this.lesson_location,
        'credit': this.credit,
        'lesson_status': this.lesson_status,
        'entry': this.entry,
        'lesson_mode': this.lesson_mode,
        'exit': this.exit,
        'session_time': this.session_time,
        'score': this.score
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "_children",

    /**
     * Getter for #_children
     * @return {string}
     * @private
     */
    get: function get() {
      return _classPrivateFieldGet(this, _children3);
    }
    /**
     * Setter for #_children. Just throws an error.
     * @param {string} _children
     * @private
     */
    ,
    set: function set(_children) {
      throwInvalidValueError();
    }
    /**
     * Getter for #student_id
     * @return {string}
     */

  }, {
    key: "student_id",
    get: function get() {
      return _classPrivateFieldGet(this, _student_id);
    }
    /**
     * Setter for #student_id. Can only be called before  initialization.
     * @param {string} student_id
     */
    ,
    set: function set(student_id) {
      !this.initialized ? _classPrivateFieldSet(this, _student_id, student_id) : throwReadOnlyError();
    }
    /**
     * Getter for #student_name
     * @return {string}
     */

  }, {
    key: "student_name",
    get: function get() {
      return _classPrivateFieldGet(this, _student_name);
    }
    /**
     * Setter for #student_name. Can only be called before  initialization.
     * @param {string} student_name
     */
    ,
    set: function set(student_name) {
      !this.initialized ? _classPrivateFieldSet(this, _student_name, student_name) : throwReadOnlyError();
    }
    /**
     * Getter for #lesson_location
     * @return {string}
     */

  }, {
    key: "lesson_location",
    get: function get() {
      return _classPrivateFieldGet(this, _lesson_location);
    }
    /**
     * Setter for #lesson_location
     * @param {string} lesson_location
     */
    ,
    set: function set(lesson_location) {
      if (check12ValidFormat(lesson_location, scorm12_regex.CMIString256, true)) {
        _classPrivateFieldSet(this, _lesson_location, lesson_location);
      }
    }
    /**
     * Getter for #credit
     * @return {string}
     */

  }, {
    key: "credit",
    get: function get() {
      return _classPrivateFieldGet(this, _credit);
    }
    /**
     * Setter for #credit. Can only be called before  initialization.
     * @param {string} credit
     */
    ,
    set: function set(credit) {
      !this.initialized ? _classPrivateFieldSet(this, _credit, credit) : throwReadOnlyError();
    }
    /**
     * Getter for #lesson_status
     * @return {string}
     */

  }, {
    key: "lesson_status",
    get: function get() {
      return _classPrivateFieldGet(this, _lesson_status);
    }
    /**
     * Setter for #lesson_status
     * @param {string} lesson_status
     */
    ,
    set: function set(lesson_status) {
      if (check12ValidFormat(lesson_status, scorm12_regex.CMIStatus)) {
        _classPrivateFieldSet(this, _lesson_status, lesson_status);
      }
    }
    /**
     * Getter for #entry
     * @return {string}
     */

  }, {
    key: "entry",
    get: function get() {
      return _classPrivateFieldGet(this, _entry);
    }
    /**
     * Setter for #entry. Can only be called before  initialization.
     * @param {string} entry
     */
    ,
    set: function set(entry) {
      !this.initialized ? _classPrivateFieldSet(this, _entry, entry) : throwReadOnlyError();
    }
    /**
     * Getter for #total_time
     * @return {string}
     */

  }, {
    key: "total_time",
    get: function get() {
      return _classPrivateFieldGet(this, _total_time);
    }
    /**
     * Setter for #total_time. Can only be called before  initialization.
     * @param {string} total_time
     */
    ,
    set: function set(total_time) {
      !this.initialized ? _classPrivateFieldSet(this, _total_time, total_time) : throwReadOnlyError();
    }
    /**
     * Getter for #lesson_mode
     * @return {string}
     */

  }, {
    key: "lesson_mode",
    get: function get() {
      return _classPrivateFieldGet(this, _lesson_mode);
    }
    /**
     * Setter for #lesson_mode. Can only be called before  initialization.
     * @param {string} lesson_mode
     */
    ,
    set: function set(lesson_mode) {
      !this.initialized ? _classPrivateFieldSet(this, _lesson_mode, lesson_mode) : throwReadOnlyError();
    }
    /**
     * Getter for #exit. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "exit",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _exit);
    }
    /**
     * Setter for #exit
     * @param {string} exit
     */
    ,
    set: function set(exit) {
      if (check12ValidFormat(exit, scorm12_regex.CMIExit, true)) {
        _classPrivateFieldSet(this, _exit, exit);
      }
    }
    /**
     * Getter for #session_time. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "session_time",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _session_time);
    }
    /**
     * Setter for #session_time
     * @param {string} session_time
     */
    ,
    set: function set(session_time) {
      if (check12ValidFormat(session_time, scorm12_regex.CMITimespan)) {
        _classPrivateFieldSet(this, _session_time, session_time);
      }
    }
    /**
     * Getter for #suspend_data
     * @return {string}
     */

  }, {
    key: "suspend_data",
    get: function get() {
      return _classPrivateFieldGet(this, _suspend_data);
    }
    /**
     * Setter for #suspend_data
     * @param {string} suspend_data
     */
    ,
    set: function set(suspend_data) {
      if (check12ValidFormat(suspend_data, scorm12_regex.CMIString4096, true)) {
        _classPrivateFieldSet(this, _suspend_data, suspend_data);
      }
    }
  }]);

  return CMICore;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.objectives object
 * @extends CMIArray
 */


var CMIObjectives = /*#__PURE__*/function (_CMIArray) {
  _inherits(CMIObjectives, _CMIArray);

  var _super3 = _createSuper(CMIObjectives);

  /**
   * Constructor for cmi.objectives
   */
  function CMIObjectives() {
    _classCallCheck(this, CMIObjectives);

    return _super3.call(this, {
      children: scorm12_constants.objectives_children,
      errorCode: scorm12_error_codes.INVALID_SET_VALUE
    });
  }

  return CMIObjectives;
}(_common.CMIArray);
/**
 * Class representing SCORM 1.2's cmi.student_data object
 * @extends BaseCMI
 */


var _children4 = new WeakMap();

var _mastery_score = new WeakMap();

var _max_time_allowed = new WeakMap();

var _time_limit_action = new WeakMap();

var CMIStudentData = /*#__PURE__*/function (_BaseCMI3) {
  _inherits(CMIStudentData, _BaseCMI3);

  var _super4 = _createSuper(CMIStudentData);

  /**
   * Constructor for cmi.student_data
   * @param {string} student_data_children
   */
  function CMIStudentData(student_data_children) {
    var _this3;

    _classCallCheck(this, CMIStudentData);

    _this3 = _super4.call(this);

    _children4.set(_assertThisInitialized(_this3), {
      writable: true,
      value: void 0
    });

    _mastery_score.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _max_time_allowed.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _time_limit_action.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _classPrivateFieldSet(_assertThisInitialized(_this3), _children4, student_data_children ? student_data_children : scorm12_constants.student_data_children);

    return _this3;
  }
  /**
   * Getter for #_children
   * @return {*}
   * @private
   */


  _createClass(CMIStudentData, [{
    key: "toJSON",

    /**
     * toJSON for cmi.student_data
     *
     * @return {
     *    {
     *      max_time_allowed: string,
     *      time_limit_action: string,
     *      mastery_score: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'mastery_score': this.mastery_score,
        'max_time_allowed': this.max_time_allowed,
        'time_limit_action': this.time_limit_action
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "_children",
    get: function get() {
      return _classPrivateFieldGet(this, _children4);
    }
    /**
     * Setter for #_children. Just throws an error.
     * @param {string} _children
     * @private
     */
    ,
    set: function set(_children) {
      throwInvalidValueError();
    }
    /**
     * Getter for #master_score
     * @return {string}
     */

  }, {
    key: "mastery_score",
    get: function get() {
      return _classPrivateFieldGet(this, _mastery_score);
    }
    /**
     * Setter for #master_score. Can only be called before  initialization.
     * @param {string} mastery_score
     */
    ,
    set: function set(mastery_score) {
      !this.initialized ? _classPrivateFieldSet(this, _mastery_score, mastery_score) : throwReadOnlyError();
    }
    /**
     * Getter for #max_time_allowed
     * @return {string}
     */

  }, {
    key: "max_time_allowed",
    get: function get() {
      return _classPrivateFieldGet(this, _max_time_allowed);
    }
    /**
     * Setter for #max_time_allowed. Can only be called before  initialization.
     * @param {string} max_time_allowed
     */
    ,
    set: function set(max_time_allowed) {
      !this.initialized ? _classPrivateFieldSet(this, _max_time_allowed, max_time_allowed) : throwReadOnlyError();
    }
    /**
     * Getter for #time_limit_action
     * @return {string}
     */

  }, {
    key: "time_limit_action",
    get: function get() {
      return _classPrivateFieldGet(this, _time_limit_action);
    }
    /**
     * Setter for #time_limit_action. Can only be called before  initialization.
     * @param {string} time_limit_action
     */
    ,
    set: function set(time_limit_action) {
      !this.initialized ? _classPrivateFieldSet(this, _time_limit_action, time_limit_action) : throwReadOnlyError();
    }
  }]);

  return CMIStudentData;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.student_preference object
 * @extends BaseCMI
 */


exports.CMIStudentData = CMIStudentData;

var _children5 = new WeakMap();

var _audio = new WeakMap();

var _language = new WeakMap();

var _speed = new WeakMap();

var _text = new WeakMap();

var CMIStudentPreference = /*#__PURE__*/function (_BaseCMI4) {
  _inherits(CMIStudentPreference, _BaseCMI4);

  var _super5 = _createSuper(CMIStudentPreference);

  /**
   * Constructor for cmi.student_preference
   * @param {string} student_preference_children
   */
  function CMIStudentPreference(student_preference_children) {
    var _this4;

    _classCallCheck(this, CMIStudentPreference);

    _this4 = _super5.call(this);

    _children5.set(_assertThisInitialized(_this4), {
      writable: true,
      value: void 0
    });

    _audio.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _language.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _speed.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _text.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _classPrivateFieldSet(_assertThisInitialized(_this4), _children5, student_preference_children ? student_preference_children : scorm12_constants.student_preference_children);

    return _this4;
  }

  _createClass(CMIStudentPreference, [{
    key: "toJSON",

    /**
     * toJSON for cmi.student_preference
     *
     * @return {
     *    {
     *      audio: string,
     *      language: string,
     *      speed: string,
     *      text: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'audio': this.audio,
        'language': this.language,
        'speed': this.speed,
        'text': this.text
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "_children",

    /**
     * Getter for #_children
     * @return {string}
     * @private
     */
    get: function get() {
      return _classPrivateFieldGet(this, _children5);
    }
    /**
     * Setter for #_children. Just throws an error.
     * @param {string} _children
     * @private
     */
    ,
    set: function set(_children) {
      throwInvalidValueError();
    }
    /**
     * Getter for #audio
     * @return {string}
     */

  }, {
    key: "audio",
    get: function get() {
      return _classPrivateFieldGet(this, _audio);
    }
    /**
     * Setter for #audio
     * @param {string} audio
     */
    ,
    set: function set(audio) {
      if (check12ValidFormat(audio, scorm12_regex.CMISInteger) && check12ValidRange(audio, scorm12_regex.audio_range)) {
        _classPrivateFieldSet(this, _audio, audio);
      }
    }
    /**
     * Getter for #language
     * @return {string}
     */

  }, {
    key: "language",
    get: function get() {
      return _classPrivateFieldGet(this, _language);
    }
    /**
     * Setter for #language
     * @param {string} language
     */
    ,
    set: function set(language) {
      if (check12ValidFormat(language, scorm12_regex.CMIString256)) {
        _classPrivateFieldSet(this, _language, language);
      }
    }
    /**
     * Getter for #speed
     * @return {string}
     */

  }, {
    key: "speed",
    get: function get() {
      return _classPrivateFieldGet(this, _speed);
    }
    /**
     * Setter for #speed
     * @param {string} speed
     */
    ,
    set: function set(speed) {
      if (check12ValidFormat(speed, scorm12_regex.CMISInteger) && check12ValidRange(speed, scorm12_regex.speed_range)) {
        _classPrivateFieldSet(this, _speed, speed);
      }
    }
    /**
     * Getter for #text
     * @return {string}
     */

  }, {
    key: "text",
    get: function get() {
      return _classPrivateFieldGet(this, _text);
    }
    /**
     * Setter for #text
     * @param {string} text
     */
    ,
    set: function set(text) {
      if (check12ValidFormat(text, scorm12_regex.CMISInteger) && check12ValidRange(text, scorm12_regex.text_range)) {
        _classPrivateFieldSet(this, _text, text);
      }
    }
  }]);

  return CMIStudentPreference;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.interactions object
 * @extends BaseCMI
 */


exports.CMIStudentPreference = CMIStudentPreference;

var CMIInteractions = /*#__PURE__*/function (_CMIArray2) {
  _inherits(CMIInteractions, _CMIArray2);

  var _super6 = _createSuper(CMIInteractions);

  /**
   * Constructor for cmi.interactions
   */
  function CMIInteractions() {
    _classCallCheck(this, CMIInteractions);

    return _super6.call(this, {
      children: scorm12_constants.interactions_children,
      errorCode: scorm12_error_codes.INVALID_SET_VALUE
    });
  }

  return CMIInteractions;
}(_common.CMIArray);
/**
 * Class representing SCORM 1.2's cmi.interactions.n object
 * @extends BaseCMI
 */


var _id = new WeakMap();

var _time = new WeakMap();

var _type = new WeakMap();

var _weighting = new WeakMap();

var _student_response = new WeakMap();

var _result = new WeakMap();

var _latency = new WeakMap();

var CMIInteractionsObject = /*#__PURE__*/function (_BaseCMI5) {
  _inherits(CMIInteractionsObject, _BaseCMI5);

  var _super7 = _createSuper(CMIInteractionsObject);

  /**
   * Constructor for cmi.interactions.n object
   */
  function CMIInteractionsObject() {
    var _this5;

    _classCallCheck(this, CMIInteractionsObject);

    _this5 = _super7.call(this);

    _id.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _time.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _type.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _weighting.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _student_response.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _result.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _latency.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _this5.objectives = new _common.CMIArray({
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
      children: scorm12_constants.objectives_children
    });
    _this5.correct_responses = new _common.CMIArray({
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
      children: scorm12_constants.correct_responses_children
    });
    return _this5;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMIInteractionsObject, [{
    key: "initialize",
    value: function initialize() {
      var _this$objectives2, _this$correct_respons;

      _get(_getPrototypeOf(CMIInteractionsObject.prototype), "initialize", this).call(this);

      (_this$objectives2 = this.objectives) === null || _this$objectives2 === void 0 ? void 0 : _this$objectives2.initialize();
      (_this$correct_respons = this.correct_responses) === null || _this$correct_respons === void 0 ? void 0 : _this$correct_respons.initialize();
    }
  }, {
    key: "toJSON",

    /**
     * toJSON for cmi.interactions.n
     *
     * @return {
     *    {
     *      id: string,
     *      time: string,
     *      type: string,
     *      weighting: string,
     *      student_response: string,
     *      result: string,
     *      latency: string,
     *      objectives: CMIArray,
     *      correct_responses: CMIArray
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'id': this.id,
        'time': this.time,
        'type': this.type,
        'weighting': this.weighting,
        'student_response': this.student_response,
        'result': this.result,
        'latency': this.latency,
        'objectives': this.objectives,
        'correct_responses': this.correct_responses
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "id",

    /**
     * Getter for #id. Should only be called during JSON export.
     * @return {*}
     */
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _id);
    }
    /**
     * Setter for #id
     * @param {string} id
     */
    ,
    set: function set(id) {
      if (check12ValidFormat(id, scorm12_regex.CMIIdentifier)) {
        _classPrivateFieldSet(this, _id, id);
      }
    }
    /**
     * Getter for #time. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "time",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _time);
    }
    /**
     * Setter for #time
     * @param {string} time
     */
    ,
    set: function set(time) {
      if (check12ValidFormat(time, scorm12_regex.CMITime)) {
        _classPrivateFieldSet(this, _time, time);
      }
    }
    /**
     * Getter for #type. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "type",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _type);
    }
    /**
     * Setter for #type
     * @param {string} type
     */
    ,
    set: function set(type) {
      if (check12ValidFormat(type, scorm12_regex.CMIType)) {
        _classPrivateFieldSet(this, _type, type);
      }
    }
    /**
     * Getter for #weighting. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "weighting",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _weighting);
    }
    /**
     * Setter for #weighting
     * @param {string} weighting
     */
    ,
    set: function set(weighting) {
      if (check12ValidFormat(weighting, scorm12_regex.CMIDecimal) && check12ValidRange(weighting, scorm12_regex.weighting_range)) {
        _classPrivateFieldSet(this, _weighting, weighting);
      }
    }
    /**
     * Getter for #student_response. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "student_response",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _student_response);
    }
    /**
     * Setter for #student_response
     * @param {string} student_response
     */
    ,
    set: function set(student_response) {
      if (check12ValidFormat(student_response, scorm12_regex.CMIFeedback, true)) {
        _classPrivateFieldSet(this, _student_response, student_response);
      }
    }
    /**
     * Getter for #result. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "result",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _result);
    }
    /**
     * Setter for #result
     * @param {string} result
     */
    ,
    set: function set(result) {
      if (check12ValidFormat(result, scorm12_regex.CMIResult)) {
        _classPrivateFieldSet(this, _result, result);
      }
    }
    /**
     * Getter for #latency. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "latency",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _latency);
    }
    /**
     * Setter for #latency
     * @param {string} latency
     */
    ,
    set: function set(latency) {
      if (check12ValidFormat(latency, scorm12_regex.CMITimespan)) {
        _classPrivateFieldSet(this, _latency, latency);
      }
    }
  }]);

  return CMIInteractionsObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.objectives.n object
 * @extends BaseCMI
 */


exports.CMIInteractionsObject = CMIInteractionsObject;

var _id2 = new WeakMap();

var _status = new WeakMap();

var CMIObjectivesObject = /*#__PURE__*/function (_BaseCMI6) {
  _inherits(CMIObjectivesObject, _BaseCMI6);

  var _super8 = _createSuper(CMIObjectivesObject);

  /**
   * Constructor for cmi.objectives.n
   */
  function CMIObjectivesObject() {
    var _this6;

    _classCallCheck(this, CMIObjectivesObject);

    _this6 = _super8.call(this);

    _id2.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _status.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _this6.score = new _common.CMIScore({
      score_children: scorm12_constants.score_children,
      score_range: scorm12_regex.score_range,
      invalidErrorCode: scorm12_error_codes.INVALID_SET_VALUE,
      invalidTypeCode: scorm12_error_codes.TYPE_MISMATCH,
      invalidRangeCode: scorm12_error_codes.VALUE_OUT_OF_RANGE
    });
    return _this6;
  }

  _createClass(CMIObjectivesObject, [{
    key: "toJSON",

    /**
     * toJSON for cmi.objectives.n
     * @return {
     *    {
     *      id: string,
     *      status: string,
     *      score: CMIScore
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'id': this.id,
        'status': this.status,
        'score': this.score
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "id",

    /**
     * Getter for #id
     * @return {""}
     */
    get: function get() {
      return _classPrivateFieldGet(this, _id2);
    }
    /**
     * Setter for #id
     * @param {string} id
     */
    ,
    set: function set(id) {
      if (check12ValidFormat(id, scorm12_regex.CMIIdentifier)) {
        _classPrivateFieldSet(this, _id2, id);
      }
    }
    /**
     * Getter for #status
     * @return {""}
     */

  }, {
    key: "status",
    get: function get() {
      return _classPrivateFieldGet(this, _status);
    }
    /**
     * Setter for #status
     * @param {string} status
     */
    ,
    set: function set(status) {
      if (check12ValidFormat(status, scorm12_regex.CMIStatus2)) {
        _classPrivateFieldSet(this, _status, status);
      }
    }
  }]);

  return CMIObjectivesObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.interactions.n.objectives.n object
 * @extends BaseCMI
 */


exports.CMIObjectivesObject = CMIObjectivesObject;

var _id3 = new WeakMap();

var CMIInteractionsObjectivesObject = /*#__PURE__*/function (_BaseCMI7) {
  _inherits(CMIInteractionsObjectivesObject, _BaseCMI7);

  var _super9 = _createSuper(CMIInteractionsObjectivesObject);

  /**
   * Constructor for cmi.interactions.n.objectives.n
   */
  function CMIInteractionsObjectivesObject() {
    var _this7;

    _classCallCheck(this, CMIInteractionsObjectivesObject);

    _this7 = _super9.call(this);

    _id3.set(_assertThisInitialized(_this7), {
      writable: true,
      value: ''
    });

    return _this7;
  }

  _createClass(CMIInteractionsObjectivesObject, [{
    key: "toJSON",

    /**
     * toJSON for cmi.interactions.n.objectives.n
     * @return {
     *    {
     *      id: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'id': this.id
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "id",

    /**
     * Getter for #id
     * @return {""}
     */
    get: function get() {
      return _classPrivateFieldGet(this, _id3);
    }
    /**
     * Setter for #id
     * @param {string} id
     */
    ,
    set: function set(id) {
      if (check12ValidFormat(id, scorm12_regex.CMIIdentifier)) {
        _classPrivateFieldSet(this, _id3, id);
      }
    }
  }]);

  return CMIInteractionsObjectivesObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.interactions.correct_responses.n object
 * @extends BaseCMI
 */


exports.CMIInteractionsObjectivesObject = CMIInteractionsObjectivesObject;

var _pattern = new WeakMap();

var CMIInteractionsCorrectResponsesObject = /*#__PURE__*/function (_BaseCMI8) {
  _inherits(CMIInteractionsCorrectResponsesObject, _BaseCMI8);

  var _super10 = _createSuper(CMIInteractionsCorrectResponsesObject);

  /**
   * Constructor for cmi.interactions.correct_responses.n
   */
  function CMIInteractionsCorrectResponsesObject() {
    var _this8;

    _classCallCheck(this, CMIInteractionsCorrectResponsesObject);

    _this8 = _super10.call(this);

    _pattern.set(_assertThisInitialized(_this8), {
      writable: true,
      value: ''
    });

    return _this8;
  }

  _createClass(CMIInteractionsCorrectResponsesObject, [{
    key: "toJSON",

    /**
     * toJSON for cmi.interactions.correct_responses.n
     * @return {
     *    {
     *      pattern: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'pattern': this.pattern
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "pattern",

    /**
     * Getter for #pattern
     * @return {string}
     */
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _pattern);
    }
    /**
     * Setter for #pattern
     * @param {string} pattern
     */
    ,
    set: function set(pattern) {
      if (check12ValidFormat(pattern, scorm12_regex.CMIFeedback, true)) {
        _classPrivateFieldSet(this, _pattern, pattern);
      }
    }
  }]);

  return CMIInteractionsCorrectResponsesObject;
}(_common.BaseCMI);
/**
 * Class for AICC Navigation object
 */


exports.CMIInteractionsCorrectResponsesObject = CMIInteractionsCorrectResponsesObject;

var _event = new WeakMap();

var NAV = /*#__PURE__*/function (_BaseCMI9) {
  _inherits(NAV, _BaseCMI9);

  var _super11 = _createSuper(NAV);

  /**
   * Constructor for NAV object
   */
  function NAV() {
    var _this9;

    _classCallCheck(this, NAV);

    _this9 = _super11.call(this);

    _event.set(_assertThisInitialized(_this9), {
      writable: true,
      value: ''
    });

    return _this9;
  }

  _createClass(NAV, [{
    key: "toJSON",

    /**
     * toJSON for nav object
     * @return {
     *    {
     *      event: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'event': this.event
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "event",

    /**
     * Getter for #event
     * @return {string}
     */
    get: function get() {
      return _classPrivateFieldGet(this, _event);
    }
    /**
     * Setter for #event
     * @param {string} event
     */
    ,
    set: function set(event) {
      if (check12ValidFormat(event, scorm12_regex.NAVEvent)) {
        _classPrivateFieldSet(this, _event, event);
      }
    }
  }]);

  return NAV;
}(_common.BaseCMI);

exports.NAV = NAV;

},{"../constants/api_constants":10,"../constants/error_codes":11,"../constants/regex":13,"../exceptions":15,"../utilities":17,"./common":7}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ADL = exports.CMIInteractionsCorrectResponsesObject = exports.CMIInteractionsObjectivesObject = exports.CMICommentsObject = exports.CMIObjectivesObject = exports.CMIInteractionsObject = exports.CMI = void 0;

var _common = require("./common");

var _api_constants = _interopRequireDefault(require("../constants/api_constants"));

var _regex = _interopRequireDefault(require("../constants/regex"));

var _error_codes = _interopRequireDefault(require("../constants/error_codes"));

var _response_constants = _interopRequireDefault(require("../constants/response_constants"));

var _exceptions = require("../exceptions");

var Util = _interopRequireWildcard(require("../utilities"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var scorm2004_constants = _api_constants["default"].scorm2004;
var scorm2004_error_codes = _error_codes["default"].scorm2004;
var learner_responses = _response_constants["default"].learner;
var scorm2004_regex = _regex["default"].scorm2004;
/**
 * Helper method for throwing Read Only error
 */

function throwReadOnlyError() {
  throw new _exceptions.ValidationError(scorm2004_error_codes.READ_ONLY_ELEMENT);
}
/**
 * Helper method for throwing Write Only error
 */


function throwWriteOnlyError() {
  throw new _exceptions.ValidationError(scorm2004_error_codes.WRITE_ONLY_ELEMENT);
}
/**
 * Helper method for throwing Type Mismatch error
 */


function throwTypeMismatchError() {
  throw new _exceptions.ValidationError(scorm2004_error_codes.TYPE_MISMATCH);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */


function check2004ValidFormat(value, regexPattern, allowEmptyString) {
  return (0, _common.checkValidFormat)(value, regexPattern, scorm2004_error_codes.TYPE_MISMATCH, allowEmptyString);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} rangePattern
 * @return {boolean}
 */


function check2004ValidRange(value, rangePattern) {
  return (0, _common.checkValidRange)(value, rangePattern, scorm2004_error_codes.VALUE_OUT_OF_RANGE);
}
/**
 * Class representing cmi object for SCORM 2004
 */


var _version2 = new WeakMap();

var _children2 = new WeakMap();

var _completion_status = new WeakMap();

var _completion_threshold = new WeakMap();

var _credit = new WeakMap();

var _entry = new WeakMap();

var _exit = new WeakMap();

var _launch_data = new WeakMap();

var _learner_id = new WeakMap();

var _learner_name = new WeakMap();

var _location = new WeakMap();

var _max_time_allowed = new WeakMap();

var _mode = new WeakMap();

var _progress_measure = new WeakMap();

var _scaled_passing_score = new WeakMap();

var _session_time = new WeakMap();

var _success_status = new WeakMap();

var _suspend_data = new WeakMap();

var _time_limit_action = new WeakMap();

var _total_time = new WeakMap();

var CMI = /*#__PURE__*/function (_BaseCMI) {
  _inherits(CMI, _BaseCMI);

  var _super = _createSuper(CMI);

  /**
   * Constructor for the SCORM 2004 cmi object
   * @param {boolean} initialized
   */
  function CMI(initialized) {
    var _this;

    _classCallCheck(this, CMI);

    _this = _super.call(this);

    _version2.set(_assertThisInitialized(_this), {
      writable: true,
      value: '1.0'
    });

    _children2.set(_assertThisInitialized(_this), {
      writable: true,
      value: scorm2004_constants.cmi_children
    });

    _completion_status.set(_assertThisInitialized(_this), {
      writable: true,
      value: 'unknown'
    });

    _completion_threshold.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _credit.set(_assertThisInitialized(_this), {
      writable: true,
      value: 'credit'
    });

    _entry.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _exit.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _launch_data.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _learner_id.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _learner_name.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _location.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _max_time_allowed.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _mode.set(_assertThisInitialized(_this), {
      writable: true,
      value: 'normal'
    });

    _progress_measure.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _scaled_passing_score.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _session_time.set(_assertThisInitialized(_this), {
      writable: true,
      value: 'PT0H0M0S'
    });

    _success_status.set(_assertThisInitialized(_this), {
      writable: true,
      value: 'unknown'
    });

    _suspend_data.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _time_limit_action.set(_assertThisInitialized(_this), {
      writable: true,
      value: 'continue,no message'
    });

    _total_time.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _this.learner_preference = new CMILearnerPreference();
    _this.score = new Scorm2004CMIScore();
    _this.comments_from_learner = new CMICommentsFromLearner();
    _this.comments_from_lms = new CMICommentsFromLMS();
    _this.interactions = new CMIInteractions();
    _this.objectives = new CMIObjectives();
    if (initialized) _this.initialize();
    return _this;
  }

  _createClass(CMI, [{
    key: "initialize",

    /**
     * Called when the API has been initialized after the CMI has been created
     */
    value: function initialize() {
      var _this$learner_prefere, _this$score, _this$comments_from_l, _this$comments_from_l2, _this$interactions, _this$objectives;

      _get(_getPrototypeOf(CMI.prototype), "initialize", this).call(this);

      (_this$learner_prefere = this.learner_preference) === null || _this$learner_prefere === void 0 ? void 0 : _this$learner_prefere.initialize();
      (_this$score = this.score) === null || _this$score === void 0 ? void 0 : _this$score.initialize();
      (_this$comments_from_l = this.comments_from_learner) === null || _this$comments_from_l === void 0 ? void 0 : _this$comments_from_l.initialize();
      (_this$comments_from_l2 = this.comments_from_lms) === null || _this$comments_from_l2 === void 0 ? void 0 : _this$comments_from_l2.initialize();
      (_this$interactions = this.interactions) === null || _this$interactions === void 0 ? void 0 : _this$interactions.initialize();
      (_this$objectives = this.objectives) === null || _this$objectives === void 0 ? void 0 : _this$objectives.initialize();
    }
    /**
     * Getter for #_version
     * @return {string}
     * @private
     */

  }, {
    key: "getCurrentTotalTime",

    /**
     * Adds the current session time to the existing total time.
     *
     * @return {string} ISO8601 Duration
     */
    value: function getCurrentTotalTime() {
      var sessionTime = _classPrivateFieldGet(this, _session_time);

      var startTime = this.start_time;

      if (typeof startTime !== 'undefined' || startTime === null) {
        var seconds = new Date().getTime() - startTime;
        sessionTime = Util.getSecondsAsISODuration(seconds / 1000);
      }

      return Util.addTwoDurations(_classPrivateFieldGet(this, _total_time), sessionTime, scorm2004_regex.CMITimespan);
    }
    /**
     * toJSON for cmi
     *
     * @return {
     *    {
     *      comments_from_learner: CMICommentsFromLearner,
     *      comments_from_lms: CMICommentsFromLMS,
     *      completion_status: string,
     *      completion_threshold: string,
     *      credit: string,
     *      entry: string,
     *      exit: string,
     *      interactions: CMIInteractions,
     *      launch_data: string,
     *      learner_id: string,
     *      learner_name: string,
     *      learner_preference: CMILearnerPreference,
     *      location: string,
     *      max_time_allowed: string,
     *      mode: string,
     *      objectives: CMIObjectives,
     *      progress_measure: string,
     *      scaled_passing_score: string,
     *      score: Scorm2004CMIScore,
     *      session_time: string,
     *      success_status: string,
     *      suspend_data: string,
     *      time_limit_action: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'comments_from_learner': this.comments_from_learner,
        'comments_from_lms': this.comments_from_lms,
        'completion_status': this.completion_status,
        'completion_threshold': this.completion_threshold,
        'credit': this.credit,
        'entry': this.entry,
        'exit': this.exit,
        'interactions': this.interactions,
        'launch_data': this.launch_data,
        'learner_id': this.learner_id,
        'learner_name': this.learner_name,
        'learner_preference': this.learner_preference,
        'location': this.location,
        'max_time_allowed': this.max_time_allowed,
        'mode': this.mode,
        'objectives': this.objectives,
        'progress_measure': this.progress_measure,
        'scaled_passing_score': this.scaled_passing_score,
        'score': this.score,
        'session_time': this.session_time,
        'success_status': this.success_status,
        'suspend_data': this.suspend_data,
        'time_limit_action': this.time_limit_action
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "_version",
    get: function get() {
      return _classPrivateFieldGet(this, _version2);
    }
    /**
     * Setter for #_version. Just throws an error.
     * @param {string} _version
     * @private
     */
    ,
    set: function set(_version) {
      throwReadOnlyError();
    }
    /**
     * Getter for #_children
     * @return {string}
     * @private
     */

  }, {
    key: "_children",
    get: function get() {
      return _classPrivateFieldGet(this, _children2);
    }
    /**
     * Setter for #_children. Just throws an error.
     * @param {number} _children
     * @private
     */
    ,
    set: function set(_children) {
      throwReadOnlyError();
    }
    /**
     * Getter for #completion_status
     * @return {string}
     */

  }, {
    key: "completion_status",
    get: function get() {
      return _classPrivateFieldGet(this, _completion_status);
    }
    /**
     * Setter for #completion_status
     * @param {string} completion_status
     */
    ,
    set: function set(completion_status) {
      if (check2004ValidFormat(completion_status, scorm2004_regex.CMICStatus)) {
        _classPrivateFieldSet(this, _completion_status, completion_status);
      }
    }
    /**
     * Getter for #completion_threshold
     * @return {string}
     */

  }, {
    key: "completion_threshold",
    get: function get() {
      return _classPrivateFieldGet(this, _completion_threshold);
    }
    /**
     * Setter for #completion_threshold. Can only be called before  initialization.
     * @param {string} completion_threshold
     */
    ,
    set: function set(completion_threshold) {
      !this.initialized ? _classPrivateFieldSet(this, _completion_threshold, completion_threshold) : throwReadOnlyError();
    }
    /**
     * Setter for #credit
     * @return {string}
     */

  }, {
    key: "credit",
    get: function get() {
      return _classPrivateFieldGet(this, _credit);
    }
    /**
     * Setter for #credit. Can only be called before  initialization.
     * @param {string} credit
     */
    ,
    set: function set(credit) {
      !this.initialized ? _classPrivateFieldSet(this, _credit, credit) : throwReadOnlyError();
    }
    /**
     * Getter for #entry
     * @return {string}
     */

  }, {
    key: "entry",
    get: function get() {
      return _classPrivateFieldGet(this, _entry);
    }
    /**
     * Setter for #entry. Can only be called before  initialization.
     * @param {string} entry
     */
    ,
    set: function set(entry) {
      !this.initialized ? _classPrivateFieldSet(this, _entry, entry) : throwReadOnlyError();
    }
    /**
     * Getter for #exit. Should only be called during JSON export.
     * @return {string}
     */

  }, {
    key: "exit",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _exit);
    }
    /**
     * Getter for #exit
     * @param {string} exit
     */
    ,
    set: function set(exit) {
      if (check2004ValidFormat(exit, scorm2004_regex.CMIExit, true)) {
        _classPrivateFieldSet(this, _exit, exit);
      }
    }
    /**
     * Getter for #launch_data
     * @return {string}
     */

  }, {
    key: "launch_data",
    get: function get() {
      return _classPrivateFieldGet(this, _launch_data);
    }
    /**
     * Setter for #launch_data. Can only be called before  initialization.
     * @param {string} launch_data
     */
    ,
    set: function set(launch_data) {
      !this.initialized ? _classPrivateFieldSet(this, _launch_data, launch_data) : throwReadOnlyError();
    }
    /**
     * Getter for #learner_id
     * @return {string}
     */

  }, {
    key: "learner_id",
    get: function get() {
      return _classPrivateFieldGet(this, _learner_id);
    }
    /**
     * Setter for #learner_id. Can only be called before  initialization.
     * @param {string} learner_id
     */
    ,
    set: function set(learner_id) {
      !this.initialized ? _classPrivateFieldSet(this, _learner_id, learner_id) : throwReadOnlyError();
    }
    /**
     * Getter for #learner_name
     * @return {string}
     */

  }, {
    key: "learner_name",
    get: function get() {
      return _classPrivateFieldGet(this, _learner_name);
    }
    /**
     * Setter for #learner_name. Can only be called before  initialization.
     * @param {string} learner_name
     */
    ,
    set: function set(learner_name) {
      !this.initialized ? _classPrivateFieldSet(this, _learner_name, learner_name) : throwReadOnlyError();
    }
    /**
     * Getter for #location
     * @return {string}
     */

  }, {
    key: "location",
    get: function get() {
      return _classPrivateFieldGet(this, _location);
    }
    /**
     * Setter for #location
     * @param {string} location
     */
    ,
    set: function set(location) {
      if (check2004ValidFormat(location, scorm2004_regex.CMIString1000)) {
        _classPrivateFieldSet(this, _location, location);
      }
    }
    /**
     * Getter for #max_time_allowed
     * @return {string}
     */

  }, {
    key: "max_time_allowed",
    get: function get() {
      return _classPrivateFieldGet(this, _max_time_allowed);
    }
    /**
     * Setter for #max_time_allowed. Can only be called before  initialization.
     * @param {string} max_time_allowed
     */
    ,
    set: function set(max_time_allowed) {
      !this.initialized ? _classPrivateFieldSet(this, _max_time_allowed, max_time_allowed) : throwReadOnlyError();
    }
    /**
     * Getter for #mode
     * @return {string}
     */

  }, {
    key: "mode",
    get: function get() {
      return _classPrivateFieldGet(this, _mode);
    }
    /**
     * Setter for #mode. Can only be called before  initialization.
     * @param {string} mode
     */
    ,
    set: function set(mode) {
      !this.initialized ? _classPrivateFieldSet(this, _mode, mode) : throwReadOnlyError();
    }
    /**
     * Getter for #progress_measure
     * @return {string}
     */

  }, {
    key: "progress_measure",
    get: function get() {
      return _classPrivateFieldGet(this, _progress_measure);
    }
    /**
     * Setter for #progress_measure
     * @param {string} progress_measure
     */
    ,
    set: function set(progress_measure) {
      if (check2004ValidFormat(progress_measure, scorm2004_regex.CMIDecimal) && check2004ValidRange(progress_measure, scorm2004_regex.progress_range)) {
        _classPrivateFieldSet(this, _progress_measure, progress_measure);
      }
    }
    /**
     * Getter for #scaled_passing_score
     * @return {string}
     */

  }, {
    key: "scaled_passing_score",
    get: function get() {
      return _classPrivateFieldGet(this, _scaled_passing_score);
    }
    /**
     * Setter for #scaled_passing_score. Can only be called before  initialization.
     * @param {string} scaled_passing_score
     */
    ,
    set: function set(scaled_passing_score) {
      !this.initialized ? _classPrivateFieldSet(this, _scaled_passing_score, scaled_passing_score) : throwReadOnlyError();
    }
    /**
     * Getter for #session_time. Should only be called during JSON export.
     * @return {string}
     */

  }, {
    key: "session_time",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _session_time);
    }
    /**
     * Setter for #session_time
     * @param {string} session_time
     */
    ,
    set: function set(session_time) {
      if (check2004ValidFormat(session_time, scorm2004_regex.CMITimespan)) {
        _classPrivateFieldSet(this, _session_time, session_time);
      }
    }
    /**
     * Getter for #success_status
     * @return {string}
     */

  }, {
    key: "success_status",
    get: function get() {
      return _classPrivateFieldGet(this, _success_status);
    }
    /**
     * Setter for #success_status
     * @param {string} success_status
     */
    ,
    set: function set(success_status) {
      if (check2004ValidFormat(success_status, scorm2004_regex.CMISStatus)) {
        _classPrivateFieldSet(this, _success_status, success_status);
      }
    }
    /**
     * Getter for #suspend_data
     * @return {string}
     */

  }, {
    key: "suspend_data",
    get: function get() {
      return _classPrivateFieldGet(this, _suspend_data);
    }
    /**
     * Setter for #suspend_data
     * @param {string} suspend_data
     */
    ,
    set: function set(suspend_data) {
      if (check2004ValidFormat(suspend_data, scorm2004_regex.CMIString64000, true)) {
        _classPrivateFieldSet(this, _suspend_data, suspend_data);
      }
    }
    /**
     * Getter for #time_limit_action
     * @return {string}
     */

  }, {
    key: "time_limit_action",
    get: function get() {
      return _classPrivateFieldGet(this, _time_limit_action);
    }
    /**
     * Setter for #time_limit_action. Can only be called before  initialization.
     * @param {string} time_limit_action
     */
    ,
    set: function set(time_limit_action) {
      !this.initialized ? _classPrivateFieldSet(this, _time_limit_action, time_limit_action) : throwReadOnlyError();
    }
    /**
     * Getter for #total_time
     * @return {string}
     */

  }, {
    key: "total_time",
    get: function get() {
      return _classPrivateFieldGet(this, _total_time);
    }
    /**
     * Setter for #total_time. Can only be called before  initialization.
     * @param {string} total_time
     */
    ,
    set: function set(total_time) {
      !this.initialized ? _classPrivateFieldSet(this, _total_time, total_time) : throwReadOnlyError();
    }
  }]);

  return CMI;
}(_common.BaseCMI);
/**
 * Class for SCORM 2004's cmi.learner_preference object
 */


exports.CMI = CMI;

var _children3 = new WeakMap();

var _audio_level = new WeakMap();

var _language = new WeakMap();

var _delivery_speed = new WeakMap();

var _audio_captioning = new WeakMap();

var CMILearnerPreference = /*#__PURE__*/function (_BaseCMI2) {
  _inherits(CMILearnerPreference, _BaseCMI2);

  var _super2 = _createSuper(CMILearnerPreference);

  /**
   * Constructor for cmi.learner_preference
   */
  function CMILearnerPreference() {
    var _this2;

    _classCallCheck(this, CMILearnerPreference);

    _this2 = _super2.call(this);

    _children3.set(_assertThisInitialized(_this2), {
      writable: true,
      value: scorm2004_constants.student_preference_children
    });

    _audio_level.set(_assertThisInitialized(_this2), {
      writable: true,
      value: '1'
    });

    _language.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _delivery_speed.set(_assertThisInitialized(_this2), {
      writable: true,
      value: '1'
    });

    _audio_captioning.set(_assertThisInitialized(_this2), {
      writable: true,
      value: '0'
    });

    return _this2;
  }
  /**
   * Getter for #_children
   * @return {string}
   * @private
   */


  _createClass(CMILearnerPreference, [{
    key: "toJSON",

    /**
     * toJSON for cmi.learner_preference
     *
     * @return {
     *    {
     *      audio_level: string,
     *      language: string,
     *      delivery_speed: string,
     *      audio_captioning: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'audio_level': this.audio_level,
        'language': this.language,
        'delivery_speed': this.delivery_speed,
        'audio_captioning': this.audio_captioning
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "_children",
    get: function get() {
      return _classPrivateFieldGet(this, _children3);
    }
    /**
     * Setter for #_children. Just throws an error.
     * @param {string} _children
     * @private
     */
    ,
    set: function set(_children) {
      throwReadOnlyError();
    }
    /**
     * Getter for #audio_level
     * @return {string}
     */

  }, {
    key: "audio_level",
    get: function get() {
      return _classPrivateFieldGet(this, _audio_level);
    }
    /**
     * Setter for #audio_level
     * @param {string} audio_level
     */
    ,
    set: function set(audio_level) {
      if (check2004ValidFormat(audio_level, scorm2004_regex.CMIDecimal) && check2004ValidRange(audio_level, scorm2004_regex.audio_range)) {
        _classPrivateFieldSet(this, _audio_level, audio_level);
      }
    }
    /**
     * Getter for #language
     * @return {string}
     */

  }, {
    key: "language",
    get: function get() {
      return _classPrivateFieldGet(this, _language);
    }
    /**
     * Setter for #language
     * @param {string} language
     */
    ,
    set: function set(language) {
      if (check2004ValidFormat(language, scorm2004_regex.CMILang)) {
        _classPrivateFieldSet(this, _language, language);
      }
    }
    /**
     * Getter for #delivery_speed
     * @return {string}
     */

  }, {
    key: "delivery_speed",
    get: function get() {
      return _classPrivateFieldGet(this, _delivery_speed);
    }
    /**
     * Setter for #delivery_speed
     * @param {string} delivery_speed
     */
    ,
    set: function set(delivery_speed) {
      if (check2004ValidFormat(delivery_speed, scorm2004_regex.CMIDecimal) && check2004ValidRange(delivery_speed, scorm2004_regex.speed_range)) {
        _classPrivateFieldSet(this, _delivery_speed, delivery_speed);
      }
    }
    /**
     * Getter for #audio_captioning
     * @return {string}
     */

  }, {
    key: "audio_captioning",
    get: function get() {
      return _classPrivateFieldGet(this, _audio_captioning);
    }
    /**
     * Setter for #audio_captioning
     * @param {string} audio_captioning
     */
    ,
    set: function set(audio_captioning) {
      if (check2004ValidFormat(audio_captioning, scorm2004_regex.CMISInteger) && check2004ValidRange(audio_captioning, scorm2004_regex.text_range)) {
        _classPrivateFieldSet(this, _audio_captioning, audio_captioning);
      }
    }
  }]);

  return CMILearnerPreference;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's cmi.interactions object
 */


var CMIInteractions = /*#__PURE__*/function (_CMIArray) {
  _inherits(CMIInteractions, _CMIArray);

  var _super3 = _createSuper(CMIInteractions);

  /**
   * Constructor for cmi.objectives Array
   */
  function CMIInteractions() {
    _classCallCheck(this, CMIInteractions);

    return _super3.call(this, {
      children: scorm2004_constants.interactions_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT
    });
  }

  return CMIInteractions;
}(_common.CMIArray);
/**
 * Class representing SCORM 2004's cmi.objectives object
 */


var CMIObjectives = /*#__PURE__*/function (_CMIArray2) {
  _inherits(CMIObjectives, _CMIArray2);

  var _super4 = _createSuper(CMIObjectives);

  /**
   * Constructor for cmi.objectives Array
   */
  function CMIObjectives() {
    _classCallCheck(this, CMIObjectives);

    return _super4.call(this, {
      children: scorm2004_constants.objectives_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT
    });
  }

  return CMIObjectives;
}(_common.CMIArray);
/**
 * Class representing SCORM 2004's cmi.comments_from_lms object
 */


var CMICommentsFromLMS = /*#__PURE__*/function (_CMIArray3) {
  _inherits(CMICommentsFromLMS, _CMIArray3);

  var _super5 = _createSuper(CMICommentsFromLMS);

  /**
   * Constructor for cmi.comments_from_lms Array
   */
  function CMICommentsFromLMS() {
    _classCallCheck(this, CMICommentsFromLMS);

    return _super5.call(this, {
      children: scorm2004_constants.comments_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT
    });
  }

  return CMICommentsFromLMS;
}(_common.CMIArray);
/**
 * Class representing SCORM 2004's cmi.comments_from_learner object
 */


var CMICommentsFromLearner = /*#__PURE__*/function (_CMIArray4) {
  _inherits(CMICommentsFromLearner, _CMIArray4);

  var _super6 = _createSuper(CMICommentsFromLearner);

  /**
   * Constructor for cmi.comments_from_learner Array
   */
  function CMICommentsFromLearner() {
    _classCallCheck(this, CMICommentsFromLearner);

    return _super6.call(this, {
      children: scorm2004_constants.comments_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT
    });
  }

  return CMICommentsFromLearner;
}(_common.CMIArray);
/**
 * Class for SCORM 2004's cmi.interaction.n object
 */


var _id = new WeakMap();

var _type = new WeakMap();

var _timestamp = new WeakMap();

var _weighting = new WeakMap();

var _learner_response = new WeakMap();

var _result = new WeakMap();

var _latency = new WeakMap();

var _description = new WeakMap();

var CMIInteractionsObject = /*#__PURE__*/function (_BaseCMI3) {
  _inherits(CMIInteractionsObject, _BaseCMI3);

  var _super7 = _createSuper(CMIInteractionsObject);

  /**
   * Constructor for cmi.interaction.n
   */
  function CMIInteractionsObject() {
    var _this3;

    _classCallCheck(this, CMIInteractionsObject);

    _this3 = _super7.call(this);

    _id.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _type.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _timestamp.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _weighting.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _learner_response.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _result.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _latency.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _description.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _this3.objectives = new _common.CMIArray({
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      children: scorm2004_constants.objectives_children
    });
    _this3.correct_responses = new _common.CMIArray({
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      children: scorm2004_constants.correct_responses_children
    });
    return _this3;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMIInteractionsObject, [{
    key: "initialize",
    value: function initialize() {
      var _this$objectives2, _this$correct_respons;

      _get(_getPrototypeOf(CMIInteractionsObject.prototype), "initialize", this).call(this);

      (_this$objectives2 = this.objectives) === null || _this$objectives2 === void 0 ? void 0 : _this$objectives2.initialize();
      (_this$correct_respons = this.correct_responses) === null || _this$correct_respons === void 0 ? void 0 : _this$correct_respons.initialize();
    }
    /**
     * Getter for #id
     * @return {string}
     */

  }, {
    key: "toJSON",

    /**
     * toJSON for cmi.interactions.n
     *
     * @return {
     *    {
     *      id: string,
     *      type: string,
     *      objectives: CMIArray,
     *      timestamp: string,
     *      correct_responses: CMIArray,
     *      weighting: string,
     *      learner_response: string,
     *      result: string,
     *      latency: string,
     *      description: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'id': this.id,
        'type': this.type,
        'objectives': this.objectives,
        'timestamp': this.timestamp,
        'weighting': this.weighting,
        'learner_response': this.learner_response,
        'result': this.result,
        'latency': this.latency,
        'description': this.description,
        'correct_responses': this.correct_responses
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "id",
    get: function get() {
      return _classPrivateFieldGet(this, _id);
    }
    /**
     * Setter for #id
     * @param {string} id
     */
    ,
    set: function set(id) {
      if (check2004ValidFormat(id, scorm2004_regex.CMILongIdentifier)) {
        _classPrivateFieldSet(this, _id, id);
      }
    }
    /**
     * Getter for #type
     * @return {string}
     */

  }, {
    key: "type",
    get: function get() {
      return _classPrivateFieldGet(this, _type);
    }
    /**
     * Setter for #type
     * @param {string} type
     */
    ,
    set: function set(type) {
      if (typeof this.id === 'undefined') {
        throw new _exceptions.ValidationError(scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED);
      } else {
        if (check2004ValidFormat(type, scorm2004_regex.CMIType)) {
          _classPrivateFieldSet(this, _type, type);
        }
      }
    }
    /**
     * Getter for #timestamp
     * @return {string}
     */

  }, {
    key: "timestamp",
    get: function get() {
      return _classPrivateFieldGet(this, _timestamp);
    }
    /**
     * Setter for #timestamp
     * @param {string} timestamp
     */
    ,
    set: function set(timestamp) {
      if (check2004ValidFormat(timestamp, scorm2004_regex.CMITime)) {
        _classPrivateFieldSet(this, _timestamp, timestamp);
      }
    }
    /**
     * Getter for #weighting
     * @return {string}
     */

  }, {
    key: "weighting",
    get: function get() {
      return _classPrivateFieldGet(this, _weighting);
    }
    /**
     * Setter for #weighting
     * @param {string} weighting
     */
    ,
    set: function set(weighting) {
      if (check2004ValidFormat(weighting, scorm2004_regex.CMIDecimal)) {
        _classPrivateFieldSet(this, _weighting, weighting);
      }
    }
    /**
     * Getter for #learner_response
     * @return {string}
     */

  }, {
    key: "learner_response",
    get: function get() {
      return _classPrivateFieldGet(this, _learner_response);
    }
    /**
     * Setter for #learner_response. Does type validation to make sure response
     * matches SCORM 2004's spec
     * @param {string} learner_response
     */
    ,
    set: function set(learner_response) {
      if (typeof this.type === 'undefined' || typeof this.id === 'undefined') {
        throw new _exceptions.ValidationError(scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED);
      } else {
        var nodes = [];
        var response_type = learner_responses[this.type];

        if (response_type) {
          if (response_type === null || response_type === void 0 ? void 0 : response_type.delimiter) {
            nodes = learner_response.split(response_type.delimiter);
          } else {
            nodes[0] = learner_response;
          }

          if (nodes.length > 0 && nodes.length <= response_type.max) {
            var formatRegex = new RegExp(response_type.format);

            for (var i = 0; i < nodes.length; i++) {
              if (response_type === null || response_type === void 0 ? void 0 : response_type.delimiter2) {
                var values = nodes[i].split(response_type.delimiter2);

                if (values.length === 2) {
                  if (!values[0].match(formatRegex)) {
                    throwTypeMismatchError();
                  } else {
                    if (!values[1].match(new RegExp(response_type.format2))) {
                      throwTypeMismatchError();
                    }
                  }
                } else {
                  throwTypeMismatchError();
                }
              } else {
                if (!nodes[i].match(formatRegex)) {
                  throwTypeMismatchError();
                } else {
                  if (nodes[i] !== '' && response_type.unique) {
                    for (var j = 0; j < i; j++) {
                      if (nodes[i] === nodes[j]) {
                        throwTypeMismatchError();
                      }
                    }
                  }
                }
              }
            }
          } else {
            throw new _exceptions.ValidationError(scorm2004_error_codes.GENERAL_SET_FAILURE);
          }
        } else {
          throw new _exceptions.ValidationError(scorm2004_error_codes.TYPE_MISMATCH);
        }
      }
    }
    /**
     * Getter for #result
     * @return {string}
     */

  }, {
    key: "result",
    get: function get() {
      return _classPrivateFieldGet(this, _result);
    }
    /**
     * Setter for #result
     * @param {string} result
     */
    ,
    set: function set(result) {
      if (check2004ValidFormat(result, scorm2004_regex.CMIResult)) {
        _classPrivateFieldSet(this, _result, result);
      }
    }
    /**
     * Getter for #latency
     * @return {string}
     */

  }, {
    key: "latency",
    get: function get() {
      return _classPrivateFieldGet(this, _latency);
    }
    /**
     * Setter for #latency
     * @param {string} latency
     */
    ,
    set: function set(latency) {
      if (check2004ValidFormat(latency, scorm2004_regex.CMITimespan)) {
        _classPrivateFieldSet(this, _latency, latency);
      }
    }
    /**
     * Getter for #description
     * @return {string}
     */

  }, {
    key: "description",
    get: function get() {
      return _classPrivateFieldGet(this, _description);
    }
    /**
     * Setter for #description
     * @param {string} description
     */
    ,
    set: function set(description) {
      if (check2004ValidFormat(description, scorm2004_regex.CMILangString250, true)) {
        _classPrivateFieldSet(this, _description, description);
      }
    }
  }]);

  return CMIInteractionsObject;
}(_common.BaseCMI);
/**
 * Class for SCORM 2004's cmi.objectives.n object
 */


exports.CMIInteractionsObject = CMIInteractionsObject;

var _id2 = new WeakMap();

var _success_status2 = new WeakMap();

var _completion_status2 = new WeakMap();

var _progress_measure2 = new WeakMap();

var _description2 = new WeakMap();

var CMIObjectivesObject = /*#__PURE__*/function (_BaseCMI4) {
  _inherits(CMIObjectivesObject, _BaseCMI4);

  var _super8 = _createSuper(CMIObjectivesObject);

  /**
   * Constructor for cmi.objectives.n
   */
  function CMIObjectivesObject() {
    var _this4;

    _classCallCheck(this, CMIObjectivesObject);

    _this4 = _super8.call(this);

    _id2.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _success_status2.set(_assertThisInitialized(_this4), {
      writable: true,
      value: 'unknown'
    });

    _completion_status2.set(_assertThisInitialized(_this4), {
      writable: true,
      value: 'unknown'
    });

    _progress_measure2.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _description2.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _this4.score = new Scorm2004CMIScore();
    return _this4;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMIObjectivesObject, [{
    key: "initialize",
    value: function initialize() {
      var _this$score2;

      _get(_getPrototypeOf(CMIObjectivesObject.prototype), "initialize", this).call(this);

      (_this$score2 = this.score) === null || _this$score2 === void 0 ? void 0 : _this$score2.initialize();
    }
    /**
     * Getter for #id
     * @return {string}
     */

  }, {
    key: "toJSON",

    /**
     * toJSON for cmi.objectives.n
     *
     * @return {
     *    {
     *      id: string,
     *      success_status: string,
     *      completion_status: string,
     *      progress_measure: string,
     *      description: string,
     *      score: Scorm2004CMIScore
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'id': this.id,
        'success_status': this.success_status,
        'completion_status': this.completion_status,
        'progress_measure': this.progress_measure,
        'description': this.description,
        'score': this.score
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "id",
    get: function get() {
      return _classPrivateFieldGet(this, _id2);
    }
    /**
     * Setter for #id
     * @param {string} id
     */
    ,
    set: function set(id) {
      if (check2004ValidFormat(id, scorm2004_regex.CMILongIdentifier)) {
        _classPrivateFieldSet(this, _id2, id);
      }
    }
    /**
     * Getter for #success_status
     * @return {string}
     */

  }, {
    key: "success_status",
    get: function get() {
      return _classPrivateFieldGet(this, _success_status2);
    }
    /**
     * Setter for #success_status
     * @param {string} success_status
     */
    ,
    set: function set(success_status) {
      if (check2004ValidFormat(success_status, scorm2004_regex.CMISStatus)) {
        _classPrivateFieldSet(this, _success_status2, success_status);
      }
    }
    /**
     * Getter for #completion_status
     * @return {string}
     */

  }, {
    key: "completion_status",
    get: function get() {
      return _classPrivateFieldGet(this, _completion_status2);
    }
    /**
     * Setter for #completion_status
     * @param {string} completion_status
     */
    ,
    set: function set(completion_status) {
      if (check2004ValidFormat(completion_status, scorm2004_regex.CMICStatus)) {
        _classPrivateFieldSet(this, _completion_status2, completion_status);
      }
    }
    /**
     * Getter for #progress_measure
     * @return {string}
     */

  }, {
    key: "progress_measure",
    get: function get() {
      return _classPrivateFieldGet(this, _progress_measure2);
    }
    /**
     * Setter for #progress_measure
     * @param {string} progress_measure
     */
    ,
    set: function set(progress_measure) {
      if (check2004ValidFormat(progress_measure, scorm2004_regex.CMIDecimal) && check2004ValidRange(progress_measure, scorm2004_regex.progress_range)) {
        _classPrivateFieldSet(this, _progress_measure2, progress_measure);
      }
    }
    /**
     * Getter for #description
     * @return {string}
     */

  }, {
    key: "description",
    get: function get() {
      return _classPrivateFieldGet(this, _description2);
    }
    /**
     * Setter for #description
     * @param {string} description
     */
    ,
    set: function set(description) {
      if (check2004ValidFormat(description, scorm2004_regex.CMILangString250, true)) {
        _classPrivateFieldSet(this, _description2, description);
      }
    }
  }]);

  return CMIObjectivesObject;
}(_common.BaseCMI);
/**
 * Class for SCORM 2004's cmi *.score object
 */


exports.CMIObjectivesObject = CMIObjectivesObject;

var _scaled = new WeakMap();

var Scorm2004CMIScore = /*#__PURE__*/function (_CMIScore) {
  _inherits(Scorm2004CMIScore, _CMIScore);

  var _super9 = _createSuper(Scorm2004CMIScore);

  /**
   * Constructor for cmi *.score
   */
  function Scorm2004CMIScore() {
    var _this5;

    _classCallCheck(this, Scorm2004CMIScore);

    _this5 = _super9.call(this, {
      score_children: scorm2004_constants.score_children,
      max: '',
      invalidErrorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      invalidTypeCode: scorm2004_error_codes.TYPE_MISMATCH,
      invalidRangeCode: scorm2004_error_codes.VALUE_OUT_OF_RANGE,
      decimalRegex: scorm2004_regex.CMIDecimal
    });

    _scaled.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    return _this5;
  }
  /**
   * Getter for #scaled
   * @return {string}
   */


  _createClass(Scorm2004CMIScore, [{
    key: "toJSON",

    /**
     * toJSON for cmi *.score
     *
     * @return {
     *    {
     *      scaled: string,
     *      raw: string,
     *      min: string,
     *      max: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'scaled': this.scaled,
        'raw': _get(_getPrototypeOf(Scorm2004CMIScore.prototype), "raw", this),
        'min': _get(_getPrototypeOf(Scorm2004CMIScore.prototype), "min", this),
        'max': _get(_getPrototypeOf(Scorm2004CMIScore.prototype), "max", this)
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "scaled",
    get: function get() {
      return _classPrivateFieldGet(this, _scaled);
    }
    /**
     * Setter for #scaled
     * @param {string} scaled
     */
    ,
    set: function set(scaled) {
      if (check2004ValidFormat(scaled, scorm2004_regex.CMIDecimal) && check2004ValidRange(scaled, scorm2004_regex.scaled_range)) {
        _classPrivateFieldSet(this, _scaled, scaled);
      }
    }
  }]);

  return Scorm2004CMIScore;
}(_common.CMIScore);
/**
 * Class representing SCORM 2004's cmi.comments_from_learner.n and cmi.comments_from_lms.n object
 */


var _comment = new WeakMap();

var _location2 = new WeakMap();

var _timestamp2 = new WeakMap();

var _readOnlyAfterInit = new WeakMap();

var CMICommentsObject = /*#__PURE__*/function (_BaseCMI5) {
  _inherits(CMICommentsObject, _BaseCMI5);

  var _super10 = _createSuper(CMICommentsObject);

  /**
   * Constructor for cmi.comments_from_learner.n and cmi.comments_from_lms.n
   * @param {boolean} readOnlyAfterInit
   */
  function CMICommentsObject() {
    var _this6;

    var readOnlyAfterInit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    _classCallCheck(this, CMICommentsObject);

    _this6 = _super10.call(this);

    _comment.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _location2.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _timestamp2.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _readOnlyAfterInit.set(_assertThisInitialized(_this6), {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(_assertThisInitialized(_this6), _comment, '');

    _classPrivateFieldSet(_assertThisInitialized(_this6), _location2, '');

    _classPrivateFieldSet(_assertThisInitialized(_this6), _timestamp2, '');

    _classPrivateFieldSet(_assertThisInitialized(_this6), _readOnlyAfterInit, readOnlyAfterInit);

    return _this6;
  }
  /**
   * Getter for #comment
   * @return {string}
   */


  _createClass(CMICommentsObject, [{
    key: "toJSON",

    /**
     * toJSON for cmi.comments_from_learner.n object
     * @return {
     *    {
     *      comment: string,
     *      location: string,
     *      timestamp: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'comment': this.comment,
        'location': this.location,
        'timestamp': this.timestamp
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "comment",
    get: function get() {
      return _classPrivateFieldGet(this, _comment);
    }
    /**
     * Setter for #comment
     * @param {string} comment
     */
    ,
    set: function set(comment) {
      if (this.initialized && _classPrivateFieldGet(this, _readOnlyAfterInit)) {
        throwReadOnlyError();
      } else {
        if (check2004ValidFormat(comment, scorm2004_regex.CMILangString4000, true)) {
          _classPrivateFieldSet(this, _comment, comment);
        }
      }
    }
    /**
     * Getter for #location
     * @return {string}
     */

  }, {
    key: "location",
    get: function get() {
      return _classPrivateFieldGet(this, _location2);
    }
    /**
     * Setter for #location
     * @param {string} location
     */
    ,
    set: function set(location) {
      if (this.initialized && _classPrivateFieldGet(this, _readOnlyAfterInit)) {
        throwReadOnlyError();
      } else {
        if (check2004ValidFormat(location, scorm2004_regex.CMIString250)) {
          _classPrivateFieldSet(this, _location2, location);
        }
      }
    }
    /**
     * Getter for #timestamp
     * @return {string}
     */

  }, {
    key: "timestamp",
    get: function get() {
      return _classPrivateFieldGet(this, _timestamp2);
    }
    /**
     * Setter for #timestamp
     * @param {string} timestamp
     */
    ,
    set: function set(timestamp) {
      if (this.initialized && _classPrivateFieldGet(this, _readOnlyAfterInit)) {
        throwReadOnlyError();
      } else {
        if (check2004ValidFormat(timestamp, scorm2004_regex.CMITime)) {
          _classPrivateFieldSet(this, _timestamp2, timestamp);
        }
      }
    }
  }]);

  return CMICommentsObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's cmi.interactions.n.objectives.n object
 */


exports.CMICommentsObject = CMICommentsObject;

var _id3 = new WeakMap();

var CMIInteractionsObjectivesObject = /*#__PURE__*/function (_BaseCMI6) {
  _inherits(CMIInteractionsObjectivesObject, _BaseCMI6);

  var _super11 = _createSuper(CMIInteractionsObjectivesObject);

  /**
   * Constructor for cmi.interactions.n.objectives.n
   */
  function CMIInteractionsObjectivesObject() {
    var _this7;

    _classCallCheck(this, CMIInteractionsObjectivesObject);

    _this7 = _super11.call(this);

    _id3.set(_assertThisInitialized(_this7), {
      writable: true,
      value: ''
    });

    return _this7;
  }
  /**
   * Getter for #id
   * @return {string}
   */


  _createClass(CMIInteractionsObjectivesObject, [{
    key: "toJSON",

    /**
     * toJSON for cmi.interactions.n.objectives.n
     * @return {
     *    {
     *      id: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'id': this.id
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "id",
    get: function get() {
      return _classPrivateFieldGet(this, _id3);
    }
    /**
     * Setter for #id
     * @param {string} id
     */
    ,
    set: function set(id) {
      if (check2004ValidFormat(id, scorm2004_regex.CMILongIdentifier)) {
        _classPrivateFieldSet(this, _id3, id);
      }
    }
  }]);

  return CMIInteractionsObjectivesObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's cmi.interactions.n.correct_responses.n object
 */


exports.CMIInteractionsObjectivesObject = CMIInteractionsObjectivesObject;

var _pattern = new WeakMap();

var CMIInteractionsCorrectResponsesObject = /*#__PURE__*/function (_BaseCMI7) {
  _inherits(CMIInteractionsCorrectResponsesObject, _BaseCMI7);

  var _super12 = _createSuper(CMIInteractionsCorrectResponsesObject);

  /**
   * Constructor for cmi.interactions.n.correct_responses.n
   */
  function CMIInteractionsCorrectResponsesObject() {
    var _this8;

    _classCallCheck(this, CMIInteractionsCorrectResponsesObject);

    _this8 = _super12.call(this);

    _pattern.set(_assertThisInitialized(_this8), {
      writable: true,
      value: ''
    });

    return _this8;
  }
  /**
   * Getter for #pattern
   * @return {string}
   */


  _createClass(CMIInteractionsCorrectResponsesObject, [{
    key: "toJSON",

    /**
     * toJSON cmi.interactions.n.correct_responses.n object
     * @return {
     *    {
     *      pattern: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'pattern': this.pattern
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "pattern",
    get: function get() {
      return _classPrivateFieldGet(this, _pattern);
    }
    /**
     * Setter for #pattern
     * @param {string} pattern
     */
    ,
    set: function set(pattern) {
      if (check2004ValidFormat(pattern, scorm2004_regex.CMIFeedback)) {
        _classPrivateFieldSet(this, _pattern, pattern);
      }
    }
  }]);

  return CMIInteractionsCorrectResponsesObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's adl object
 */


exports.CMIInteractionsCorrectResponsesObject = CMIInteractionsCorrectResponsesObject;

var ADL = /*#__PURE__*/function (_BaseCMI8) {
  _inherits(ADL, _BaseCMI8);

  var _super13 = _createSuper(ADL);

  /**
   * Constructor for adl
   */
  function ADL() {
    var _this9;

    _classCallCheck(this, ADL);

    _this9 = _super13.call(this);
    _this9.nav = new ADLNav();
    return _this9;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(ADL, [{
    key: "initialize",
    value: function initialize() {
      var _this$nav;

      _get(_getPrototypeOf(ADL.prototype), "initialize", this).call(this);

      (_this$nav = this.nav) === null || _this$nav === void 0 ? void 0 : _this$nav.initialize();
    }
    /**
     * toJSON for adl
     * @return {
     *    {
     *      nav: {
     *        request: string
     *      }
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'nav': this.nav
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return ADL;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's adl.nav object
 */


exports.ADL = ADL;

var _request = new WeakMap();

var ADLNav = /*#__PURE__*/function (_BaseCMI9) {
  _inherits(ADLNav, _BaseCMI9);

  var _super14 = _createSuper(ADLNav);

  /**
   * Constructor for adl.nav
   */
  function ADLNav() {
    var _this10;

    _classCallCheck(this, ADLNav);

    _this10 = _super14.call(this);

    _request.set(_assertThisInitialized(_this10), {
      writable: true,
      value: '_none_'
    });

    _this10.request_valid = new ADLNavRequestValid();
    return _this10;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(ADLNav, [{
    key: "initialize",
    value: function initialize() {
      var _this$request_valid;

      _get(_getPrototypeOf(ADLNav.prototype), "initialize", this).call(this);

      (_this$request_valid = this.request_valid) === null || _this$request_valid === void 0 ? void 0 : _this$request_valid.initialize();
    }
    /**
     * Getter for #request
     * @return {string}
     */

  }, {
    key: "toJSON",

    /**
     * toJSON for adl.nav
     *
     * @return {
     *    {
     *      request: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'request': this.request
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "request",
    get: function get() {
      return _classPrivateFieldGet(this, _request);
    }
    /**
     * Setter for #request
     * @param {string} request
     */
    ,
    set: function set(request) {
      if (check2004ValidFormat(request, scorm2004_regex.NAVEvent)) {
        _classPrivateFieldSet(this, _request, request);
      }
    }
  }]);

  return ADLNav;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's adl.nav.request_valid object
 */


var _continue = new WeakMap();

var _previous = new WeakMap();

var ADLNavRequestValid = /*#__PURE__*/function (_BaseCMI10) {
  _inherits(ADLNavRequestValid, _BaseCMI10);

  var _super15 = _createSuper(ADLNavRequestValid);

  /**
   * Constructor for adl.nav.request_valid
   */
  function ADLNavRequestValid() {
    var _temp, _temp2;

    var _this11;

    _classCallCheck(this, ADLNavRequestValid);

    _this11 = _super15.call(this);

    _continue.set(_assertThisInitialized(_this11), {
      writable: true,
      value: 'unknown'
    });

    _previous.set(_assertThisInitialized(_this11), {
      writable: true,
      value: 'unknown'
    });

    _defineProperty(_assertThisInitialized(_this11), "choice", (_temp = function _temp() {
      _classCallCheck(this, _temp);

      _defineProperty(this, "_isTargetValid", function (_target) {
        return 'unknown';
      });
    }, _temp));

    _defineProperty(_assertThisInitialized(_this11), "jump", (_temp2 = function _temp2() {
      _classCallCheck(this, _temp2);

      _defineProperty(this, "_isTargetValid", function (_target) {
        return 'unknown';
      });
    }, _temp2));

    return _this11;
  }
  /**
   * Getter for #continue
   * @return {string}
   */


  _createClass(ADLNavRequestValid, [{
    key: "toJSON",

    /**
     * toJSON for adl.nav.request_valid
     *
     * @return {
     *    {
     *      previous: string,
     *      continue: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'previous': this.previous,
        'continue': this["continue"]
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "continue",
    get: function get() {
      return _classPrivateFieldGet(this, _continue);
    }
    /**
     * Setter for #continue. Just throws an error.
     * @param {*} _
     */
    ,
    set: function set(_) {
      throwReadOnlyError();
    }
    /**
     * Getter for #previous
     * @return {string}
     */

  }, {
    key: "previous",
    get: function get() {
      return _classPrivateFieldGet(this, _previous);
    }
    /**
     * Setter for #previous. Just throws an error.
     * @param {*} _
     */
    ,
    set: function set(_) {
      throwReadOnlyError();
    }
  }]);

  return ADLNavRequestValid;
}(_common.BaseCMI);

},{"../constants/api_constants":10,"../constants/error_codes":11,"../constants/regex":13,"../constants/response_constants":14,"../exceptions":15,"../utilities":17,"./common":7}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var global = {
  SCORM_TRUE: 'true',
  SCORM_FALSE: 'false',
  STATE_NOT_INITIALIZED: 0,
  STATE_INITIALIZED: 1,
  STATE_TERMINATED: 2,
  LOG_LEVEL_DEBUG: 1,
  LOG_LEVEL_INFO: 2,
  LOG_LEVEL_WARNING: 3,
  LOG_LEVEL_ERROR: 4,
  LOG_LEVEL_NONE: 5
};
var scorm12 = {
  // Children lists
  cmi_children: 'core,suspend_data,launch_data,comments,objectives,student_data,student_preference,interactions',
  core_children: 'student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,lesson_mode,exit,session_time',
  score_children: 'raw,min,max',
  comments_children: 'content,location,time',
  objectives_children: 'id,score,status',
  correct_responses_children: 'pattern',
  student_data_children: 'mastery_score,max_time_allowed,time_limit_action',
  student_preference_children: 'audio,language,speed,text',
  interactions_children: 'id,objectives,time,type,correct_responses,weighting,student_response,result,latency',
  error_descriptions: {
    '101': {
      basicMessage: 'General Exception',
      detailMessage: 'No specific error code exists to describe the error. Use LMSGetDiagnostic for more information'
    },
    '201': {
      basicMessage: 'Invalid argument error',
      detailMessage: 'Indicates that an argument represents an invalid data model element or is otherwise incorrect.'
    },
    '202': {
      basicMessage: 'Element cannot have children',
      detailMessage: 'Indicates that LMSGetValue was called with a data model element name that ends in "_children" for a data model element that does not support the "_children" suffix.'
    },
    '203': {
      basicMessage: 'Element not an array - cannot have count',
      detailMessage: 'Indicates that LMSGetValue was called with a data model element name that ends in "_count" for a data model element that does not support the "_count" suffix.'
    },
    '301': {
      basicMessage: 'Not initialized',
      detailMessage: 'Indicates that an API call was made before the call to lmsInitialize.'
    },
    '401': {
      basicMessage: 'Not implemented error',
      detailMessage: 'The data model element indicated in a call to LMSGetValue or LMSSetValue is valid, but was not implemented by this LMS. SCORM 1.2 defines a set of data model elements as being optional for an LMS to implement.'
    },
    '402': {
      basicMessage: 'Invalid set value, element is a keyword',
      detailMessage: 'Indicates that LMSSetValue was called on a data model element that represents a keyword (elements that end in "_children" and "_count").'
    },
    '403': {
      basicMessage: 'Element is read only',
      detailMessage: 'LMSSetValue was called with a data model element that can only be read.'
    },
    '404': {
      basicMessage: 'Element is write only',
      detailMessage: 'LMSGetValue was called on a data model element that can only be written to.'
    },
    '405': {
      basicMessage: 'Incorrect Data Type',
      detailMessage: 'LMSSetValue was called with a value that is not consistent with the data format of the supplied data model element.'
    }
  }
};

var aicc = _objectSpread(_objectSpread({}, scorm12), {
  cmi_children: 'core,suspend_data,launch_data,comments,objectives,student_data,student_preference,interactions,evaluation',
  student_preference_children: 'audio,language,lesson_type,speed,text,text_color,text_location,text_size,video,windows',
  student_data_children: 'attempt_number,tries,mastery_score,max_time_allowed,time_limit_action',
  student_demographics_children: 'city,class,company,country,experience,familiar_name,instructor_name,title,native_language,state,street_address,telephone,years_experience',
  tries_children: 'time,status,score',
  attempt_records_children: 'score,lesson_status',
  paths_children: 'location_id,date,time,status,why_left,time_in_element'
});

var scorm2004 = {
  // Children lists
  cmi_children: '_version,comments_from_learner,comments_from_lms,completion_status,credit,entry,exit,interactions,launch_data,learner_id,learner_name,learner_preference,location,max_time_allowed,mode,objectives,progress_measure,scaled_passing_score,score,session_time,success_status,suspend_data,time_limit_action,total_time',
  comments_children: 'comment,timestamp,location',
  score_children: 'max,raw,scaled,min',
  objectives_children: 'progress_measure,completion_status,success_status,description,score,id',
  correct_responses_children: 'pattern',
  student_data_children: 'mastery_score,max_time_allowed,time_limit_action',
  student_preference_children: 'audio_level,audio_captioning,delivery_speed,language',
  interactions_children: 'id,type,objectives,timestamp,correct_responses,weighting,learner_response,result,latency,description',
  error_descriptions: {
    '0': {
      basicMessage: 'No Error',
      detailMessage: 'No error occurred, the previous API call was successful.'
    },
    '101': {
      basicMessage: 'General Exception',
      detailMessage: 'No specific error code exists to describe the error. Use GetDiagnostic for more information.'
    },
    '102': {
      basicMessage: 'General Initialization Failure',
      detailMessage: 'Call to Initialize failed for an unknown reason.'
    },
    '103': {
      basicMessage: 'Already Initialized',
      detailMessage: 'Call to Initialize failed because Initialize was already called.'
    },
    '104': {
      basicMessage: 'Content Instance Terminated',
      detailMessage: 'Call to Initialize failed because Terminate was already called.'
    },
    '111': {
      basicMessage: 'General Termination Failure',
      detailMessage: 'Call to Terminate failed for an unknown reason.'
    },
    '112': {
      basicMessage: 'Termination Before Initialization',
      detailMessage: 'Call to Terminate failed because it was made before the call to Initialize.'
    },
    '113': {
      basicMessage: 'Termination After Termination',
      detailMessage: 'Call to Terminate failed because Terminate was already called.'
    },
    '122': {
      basicMessage: 'Retrieve Data Before Initialization',
      detailMessage: 'Call to GetValue failed because it was made before the call to Initialize.'
    },
    '123': {
      basicMessage: 'Retrieve Data After Termination',
      detailMessage: 'Call to GetValue failed because it was made after the call to Terminate.'
    },
    '132': {
      basicMessage: 'Store Data Before Initialization',
      detailMessage: 'Call to SetValue failed because it was made before the call to Initialize.'
    },
    '133': {
      basicMessage: 'Store Data After Termination',
      detailMessage: 'Call to SetValue failed because it was made after the call to Terminate.'
    },
    '142': {
      basicMessage: 'Commit Before Initialization',
      detailMessage: 'Call to Commit failed because it was made before the call to Initialize.'
    },
    '143': {
      basicMessage: 'Commit After Termination',
      detailMessage: 'Call to Commit failed because it was made after the call to Terminate.'
    },
    '201': {
      basicMessage: 'General Argument Error',
      detailMessage: 'An invalid argument was passed to an API method (usually indicates that Initialize, Commit or Terminate did not receive the expected empty string argument.'
    },
    '301': {
      basicMessage: 'General Get Failure',
      detailMessage: 'Indicates a failed GetValue call where no other specific error code is applicable. Use GetDiagnostic for more information.'
    },
    '351': {
      basicMessage: 'General Set Failure',
      detailMessage: 'Indicates a failed SetValue call where no other specific error code is applicable. Use GetDiagnostic for more information.'
    },
    '391': {
      basicMessage: 'General Commit Failure',
      detailMessage: 'Indicates a failed Commit call where no other specific error code is applicable. Use GetDiagnostic for more information.'
    },
    '401': {
      basicMessage: 'Undefined Data Model Element',
      detailMessage: 'The data model element name passed to GetValue or SetValue is not a valid SCORM data model element.'
    },
    '402': {
      basicMessage: 'Unimplemented Data Model Element',
      detailMessage: 'The data model element indicated in a call to GetValue or SetValue is valid, but was not implemented by this LMS. In SCORM 2004, this error would indicate an LMS that is not fully SCORM conformant.'
    },
    '403': {
      basicMessage: 'Data Model Element Value Not Initialized',
      detailMessage: 'Attempt to read a data model element that has not been initialized by the LMS or through a SetValue call. This error condition is often reached during normal execution of a SCO.'
    },
    '404': {
      basicMessage: 'Data Model Element Is Read Only',
      detailMessage: 'SetValue was called with a data model element that can only be read.'
    },
    '405': {
      basicMessage: 'Data Model Element Is Write Only',
      detailMessage: 'GetValue was called on a data model element that can only be written to.'
    },
    '406': {
      basicMessage: 'Data Model Element Type Mismatch',
      detailMessage: 'SetValue was called with a value that is not consistent with the data format of the supplied data model element.'
    },
    '407': {
      basicMessage: 'Data Model Element Value Out Of Range',
      detailMessage: 'The numeric value supplied to a SetValue call is outside of the numeric range allowed for the supplied data model element.'
    },
    '408': {
      basicMessage: 'Data Model Dependency Not Established',
      detailMessage: 'Some data model elements cannot be set until another data model element was set. This error condition indicates that the prerequisite element was not set before the dependent element.'
    }
  }
};
var APIConstants = {
  global: global,
  scorm12: scorm12,
  aicc: aicc,
  scorm2004: scorm2004
};
var _default = APIConstants;
exports["default"] = _default;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var global = {
  GENERAL: 101,
  INITIALIZATION_FAILED: 101,
  INITIALIZED: 101,
  TERMINATED: 101,
  TERMINATION_FAILURE: 101,
  TERMINATION_BEFORE_INIT: 101,
  MULTIPLE_TERMINATION: 101,
  RETRIEVE_BEFORE_INIT: 101,
  RETRIEVE_AFTER_TERM: 101,
  STORE_BEFORE_INIT: 101,
  STORE_AFTER_TERM: 101,
  COMMIT_BEFORE_INIT: 101,
  COMMIT_AFTER_TERM: 101,
  ARGUMENT_ERROR: 101,
  CHILDREN_ERROR: 101,
  COUNT_ERROR: 101,
  GENERAL_GET_FAILURE: 101,
  GENERAL_SET_FAILURE: 101,
  GENERAL_COMMIT_FAILURE: 101,
  UNDEFINED_DATA_MODEL: 101,
  UNIMPLEMENTED_ELEMENT: 101,
  VALUE_NOT_INITIALIZED: 101,
  INVALID_SET_VALUE: 101,
  READ_ONLY_ELEMENT: 101,
  WRITE_ONLY_ELEMENT: 101,
  TYPE_MISMATCH: 101,
  VALUE_OUT_OF_RANGE: 101,
  DEPENDENCY_NOT_ESTABLISHED: 101
};

var scorm12 = _objectSpread(_objectSpread({}, global), {
  RETRIEVE_BEFORE_INIT: 301,
  STORE_BEFORE_INIT: 301,
  COMMIT_BEFORE_INIT: 301,
  ARGUMENT_ERROR: 201,
  CHILDREN_ERROR: 202,
  COUNT_ERROR: 203,
  UNDEFINED_DATA_MODEL: 401,
  UNIMPLEMENTED_ELEMENT: 401,
  VALUE_NOT_INITIALIZED: 301,
  INVALID_SET_VALUE: 402,
  READ_ONLY_ELEMENT: 403,
  WRITE_ONLY_ELEMENT: 404,
  TYPE_MISMATCH: 405,
  VALUE_OUT_OF_RANGE: 407,
  DEPENDENCY_NOT_ESTABLISHED: 408
});

var scorm2004 = _objectSpread(_objectSpread({}, global), {
  INITIALIZATION_FAILED: 102,
  INITIALIZED: 103,
  TERMINATED: 104,
  TERMINATION_FAILURE: 111,
  TERMINATION_BEFORE_INIT: 112,
  MULTIPLE_TERMINATIONS: 113,
  RETRIEVE_BEFORE_INIT: 122,
  RETRIEVE_AFTER_TERM: 123,
  STORE_BEFORE_INIT: 132,
  STORE_AFTER_TERM: 133,
  COMMIT_BEFORE_INIT: 142,
  COMMIT_AFTER_TERM: 143,
  ARGUMENT_ERROR: 201,
  GENERAL_GET_FAILURE: 301,
  GENERAL_SET_FAILURE: 351,
  GENERAL_COMMIT_FAILURE: 391,
  UNDEFINED_DATA_MODEL: 401,
  UNIMPLEMENTED_ELEMENT: 402,
  VALUE_NOT_INITIALIZED: 403,
  READ_ONLY_ELEMENT: 404,
  WRITE_ONLY_ELEMENT: 405,
  TYPE_MISMATCH: 406,
  VALUE_OUT_OF_RANGE: 407,
  DEPENDENCY_NOT_ESTABLISHED: 408
});

var ErrorCodes = {
  scorm12: scorm12,
  scorm2004: scorm2004
};
var _default = ErrorCodes;
exports["default"] = _default;

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var ValidLanguages = {
  'aa': 'aa',
  'ab': 'ab',
  'ae': 'ae',
  'af': 'af',
  'ak': 'ak',
  'am': 'am',
  'an': 'an',
  'ar': 'ar',
  'as': 'as',
  'av': 'av',
  'ay': 'ay',
  'az': 'az',
  'ba': 'ba',
  'be': 'be',
  'bg': 'bg',
  'bh': 'bh',
  'bi': 'bi',
  'bm': 'bm',
  'bn': 'bn',
  'bo': 'bo',
  'br': 'br',
  'bs': 'bs',
  'ca': 'ca',
  'ce': 'ce',
  'ch': 'ch',
  'co': 'co',
  'cr': 'cr',
  'cs': 'cs',
  'cu': 'cu',
  'cv': 'cv',
  'cy': 'cy',
  'da': 'da',
  'de': 'de',
  'dv': 'dv',
  'dz': 'dz',
  'ee': 'ee',
  'el': 'el',
  'en': 'en',
  'eo': 'eo',
  'es': 'es',
  'et': 'et',
  'eu': 'eu',
  'fa': 'fa',
  'ff': 'ff',
  'fi': 'fi',
  'fj': 'fj',
  'fo': 'fo',
  'fr': 'fr',
  'fy': 'fy',
  'ga': 'ga',
  'gd': 'gd',
  'gl': 'gl',
  'gn': 'gn',
  'gu': 'gu',
  'gv': 'gv',
  'ha': 'ha',
  'he': 'he',
  'hi': 'hi',
  'ho': 'ho',
  'hr': 'hr',
  'ht': 'ht',
  'hu': 'hu',
  'hy': 'hy',
  'hz': 'hz',
  'ia': 'ia',
  'id': 'id',
  'ie': 'ie',
  'ig': 'ig',
  'ii': 'ii',
  'ik': 'ik',
  'io': 'io',
  'is': 'is',
  'it': 'it',
  'iu': 'iu',
  'ja': 'ja',
  'jv': 'jv',
  'ka': 'ka',
  'kg': 'kg',
  'ki': 'ki',
  'kj': 'kj',
  'kk': 'kk',
  'kl': 'kl',
  'km': 'km',
  'kn': 'kn',
  'ko': 'ko',
  'kr': 'kr',
  'ks': 'ks',
  'ku': 'ku',
  'kv': 'kv',
  'kw': 'kw',
  'ky': 'ky',
  'la': 'la',
  'lb': 'lb',
  'lg': 'lg',
  'li': 'li',
  'ln': 'ln',
  'lo': 'lo',
  'lt': 'lt',
  'lu': 'lu',
  'lv': 'lv',
  'mg': 'mg',
  'mh': 'mh',
  'mi': 'mi',
  'mk': 'mk',
  'ml': 'ml',
  'mn': 'mn',
  'mo': 'mo',
  'mr': 'mr',
  'ms': 'ms',
  'mt': 'mt',
  'my': 'my',
  'na': 'na',
  'nb': 'nb',
  'nd': 'nd',
  'ne': 'ne',
  'ng': 'ng',
  'nl': 'nl',
  'nn': 'nn',
  'no': 'no',
  'nr': 'nr',
  'nv': 'nv',
  'ny': 'ny',
  'oc': 'oc',
  'oj': 'oj',
  'om': 'om',
  'or': 'or',
  'os': 'os',
  'pa': 'pa',
  'pi': 'pi',
  'pl': 'pl',
  'ps': 'ps',
  'pt': 'pt',
  'qu': 'qu',
  'rm': 'rm',
  'rn': 'rn',
  'ro': 'ro',
  'ru': 'ru',
  'rw': 'rw',
  'sa': 'sa',
  'sc': 'sc',
  'sd': 'sd',
  'se': 'se',
  'sg': 'sg',
  'sh': 'sh',
  'si': 'si',
  'sk': 'sk',
  'sl': 'sl',
  'sm': 'sm',
  'sn': 'sn',
  'so': 'so',
  'sq': 'sq',
  'sr': 'sr',
  'ss': 'ss',
  'st': 'st',
  'su': 'su',
  'sv': 'sv',
  'sw': 'sw',
  'ta': 'ta',
  'te': 'te',
  'tg': 'tg',
  'th': 'th',
  'ti': 'ti',
  'tk': 'tk',
  'tl': 'tl',
  'tn': 'tn',
  'to': 'to',
  'tr': 'tr',
  'ts': 'ts',
  'tt': 'tt',
  'tw': 'tw',
  'ty': 'ty',
  'ug': 'ug',
  'uk': 'uk',
  'ur': 'ur',
  'uz': 'uz',
  've': 've',
  'vi': 'vi',
  'vo': 'vo',
  'wa': 'wa',
  'wo': 'wo',
  'xh': 'xh',
  'yi': 'yi',
  'yo': 'yo',
  'za': 'za',
  'zh': 'zh',
  'zu': 'zu',
  'aar': 'aar',
  'abk': 'abk',
  'ave': 'ave',
  'afr': 'afr',
  'aka': 'aka',
  'amh': 'amh',
  'arg': 'arg',
  'ara': 'ara',
  'asm': 'asm',
  'ava': 'ava',
  'aym': 'aym',
  'aze': 'aze',
  'bak': 'bak',
  'bel': 'bel',
  'bul': 'bul',
  'bih': 'bih',
  'bis': 'bis',
  'bam': 'bam',
  'ben': 'ben',
  'tib': 'tib',
  'bod': 'bod',
  'bre': 'bre',
  'bos': 'bos',
  'cat': 'cat',
  'che': 'che',
  'cha': 'cha',
  'cos': 'cos',
  'cre': 'cre',
  'cze': 'cze',
  'ces': 'ces',
  'chu': 'chu',
  'chv': 'chv',
  'wel': 'wel',
  'cym': 'cym',
  'dan': 'dan',
  'ger': 'ger',
  'deu': 'deu',
  'div': 'div',
  'dzo': 'dzo',
  'ewe': 'ewe',
  'gre': 'gre',
  'ell': 'ell',
  'eng': 'eng',
  'epo': 'epo',
  'spa': 'spa',
  'est': 'est',
  'baq': 'baq',
  'eus': 'eus',
  'per': 'per',
  'fas': 'fas',
  'ful': 'ful',
  'fin': 'fin',
  'fij': 'fij',
  'fao': 'fao',
  'fre': 'fre',
  'fra': 'fra',
  'fry': 'fry',
  'gle': 'gle',
  'gla': 'gla',
  'glg': 'glg',
  'grn': 'grn',
  'guj': 'guj',
  'glv': 'glv',
  'hau': 'hau',
  'heb': 'heb',
  'hin': 'hin',
  'hmo': 'hmo',
  'hrv': 'hrv',
  'hat': 'hat',
  'hun': 'hun',
  'arm': 'arm',
  'hye': 'hye',
  'her': 'her',
  'ina': 'ina',
  'ind': 'ind',
  'ile': 'ile',
  'ibo': 'ibo',
  'iii': 'iii',
  'ipk': 'ipk',
  'ido': 'ido',
  'ice': 'ice',
  'isl': 'isl',
  'ita': 'ita',
  'iku': 'iku',
  'jpn': 'jpn',
  'jav': 'jav',
  'geo': 'geo',
  'kat': 'kat',
  'kon': 'kon',
  'kik': 'kik',
  'kua': 'kua',
  'kaz': 'kaz',
  'kal': 'kal',
  'khm': 'khm',
  'kan': 'kan',
  'kor': 'kor',
  'kau': 'kau',
  'kas': 'kas',
  'kur': 'kur',
  'kom': 'kom',
  'cor': 'cor',
  'kir': 'kir',
  'lat': 'lat',
  'ltz': 'ltz',
  'lug': 'lug',
  'lim': 'lim',
  'lin': 'lin',
  'lao': 'lao',
  'lit': 'lit',
  'lub': 'lub',
  'lav': 'lav',
  'mlg': 'mlg',
  'mah': 'mah',
  'mao': 'mao',
  'mri': 'mri',
  'mac': 'mac',
  'mkd': 'mkd',
  'mal': 'mal',
  'mon': 'mon',
  'mol': 'mol',
  'mar': 'mar',
  'may': 'may',
  'msa': 'msa',
  'mlt': 'mlt',
  'bur': 'bur',
  'mya': 'mya',
  'nau': 'nau',
  'nob': 'nob',
  'nde': 'nde',
  'nep': 'nep',
  'ndo': 'ndo',
  'dut': 'dut',
  'nld': 'nld',
  'nno': 'nno',
  'nor': 'nor',
  'nbl': 'nbl',
  'nav': 'nav',
  'nya': 'nya',
  'oci': 'oci',
  'oji': 'oji',
  'orm': 'orm',
  'ori': 'ori',
  'oss': 'oss',
  'pan': 'pan',
  'pli': 'pli',
  'pol': 'pol',
  'pus': 'pus',
  'por': 'por',
  'que': 'que',
  'roh': 'roh',
  'run': 'run',
  'rum': 'rum',
  'ron': 'ron',
  'rus': 'rus',
  'kin': 'kin',
  'san': 'san',
  'srd': 'srd',
  'snd': 'snd',
  'sme': 'sme',
  'sag': 'sag',
  'slo': 'slo',
  'sin': 'sin',
  'slk': 'slk',
  'slv': 'slv',
  'smo': 'smo',
  'sna': 'sna',
  'som': 'som',
  'alb': 'alb',
  'sqi': 'sqi',
  'srp': 'srp',
  'ssw': 'ssw',
  'sot': 'sot',
  'sun': 'sun',
  'swe': 'swe',
  'swa': 'swa',
  'tam': 'tam',
  'tel': 'tel',
  'tgk': 'tgk',
  'tha': 'tha',
  'tir': 'tir',
  'tuk': 'tuk',
  'tgl': 'tgl',
  'tsn': 'tsn',
  'ton': 'ton',
  'tur': 'tur',
  'tso': 'tso',
  'tat': 'tat',
  'twi': 'twi',
  'tah': 'tah',
  'uig': 'uig',
  'ukr': 'ukr',
  'urd': 'urd',
  'uzb': 'uzb',
  'ven': 'ven',
  'vie': 'vie',
  'vol': 'vol',
  'wln': 'wln',
  'wol': 'wol',
  'xho': 'xho',
  'yid': 'yid',
  'yor': 'yor',
  'zha': 'zha',
  'chi': 'chi',
  'zho': 'zho',
  'zul': 'zul'
};
var _default = ValidLanguages;
exports["default"] = _default;

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var scorm12 = {
  CMIString256: '^.{0,255}$',
  CMIString4096: '^.{0,4096}$',
  CMITime: '^(?:[01]\\d|2[0123]):(?:[012345]\\d):(?:[012345]\\d)$',
  // eslint-disable-line
  CMITimespan: '^([0-9]{2,}):([0-9]{2}):([0-9]{2})(\.[0-9]{1,2})?$',
  // eslint-disable-line
  CMIInteger: '^\\d+$',
  CMISInteger: '^-?([0-9]+)$',
  CMIDecimal: '^-?([0-9]{0,3})(\.[0-9]*)?$',
  // eslint-disable-line
  CMIIdentifier: "^[\\u0021-\\u007E]{0,255}$",
  CMIFeedback: '^.{0,255}$',
  // This must be redefined
  CMIIndex: '[._](\\d+).',
  // Vocabulary Data Type Definition
  CMIStatus: '^(passed|completed|failed|incomplete|browsed)$',
  CMIStatus2: '^(passed|completed|failed|incomplete|browsed|not attempted)$',
  CMIExit: '^(time-out|suspend|logout|)$',
  CMIType: '^(true-false|choice|fill-in|matching|performance|sequencing|likert|numeric)$',
  CMIResult: '^(correct|wrong|unanticipated|neutral|([0-9]{0,3})?(\\.[0-9]*)?)$',
  // eslint-disable-line
  NAVEvent: '^(previous|continue)$',
  // Data ranges
  score_range: '0#100',
  audio_range: '-1#100',
  speed_range: '-100#100',
  weighting_range: '-100#100',
  text_range: '-1#1'
};

var aicc = _objectSpread(_objectSpread({}, scorm12), {
  CMIIdentifier: '^\\w{1,255}$'
});

var scorm2004 = {
  CMIString200: "^[\\u0000-\\uFFFF]{0,200}$",
  CMIString250: "^[\\u0000-\\uFFFF]{0,250}$",
  CMIString1000: "^[\\u0000-\\uFFFF]{0,1000}$",
  CMIString4000: "^[\\u0000-\\uFFFF]{0,4000}$",
  CMIString64000: "^[\\u0000-\\uFFFF]{0,64000}$",
  CMILang: '^([a-zA-Z]{2,3}|i|x)(\-[a-zA-Z0-9\-]{2,8})?$|^$',
  // eslint-disable-line
  CMILangString250: '^(\{lang=([a-zA-Z]{2,3}|i|x)(\-[a-zA-Z0-9\-]{2,8})?\})?((?!\{.*$).{0,250}$)?$',
  // eslint-disable-line
  CMILangcr: '^((\{lang=([a-zA-Z]{2,3}|i|x)?(\-[a-zA-Z0-9\-]{2,8})?\}))(.*?)$',
  // eslint-disable-line
  CMILangString250cr: '^((\{lang=([a-zA-Z]{2,3}|i|x)?(\-[a-zA-Z0-9\-]{2,8})?\})?(.{0,250})?)?$',
  // eslint-disable-line
  CMILangString4000: '^(\{lang=([a-zA-Z]{2,3}|i|x)(\-[a-zA-Z0-9\-]{2,8})?\})?((?!\{.*$).{0,4000}$)?$',
  // eslint-disable-line
  CMITime: '^(19[7-9]{1}[0-9]{1}|20[0-2]{1}[0-9]{1}|203[0-8]{1})((-(0[1-9]{1}|1[0-2]{1}))((-(0[1-9]{1}|[1-2]{1}[0-9]{1}|3[0-1]{1}))(T([0-1]{1}[0-9]{1}|2[0-3]{1})((:[0-5]{1}[0-9]{1})((:[0-5]{1}[0-9]{1})((\\.[0-9]{1,2})((Z|([+|-]([0-1]{1}[0-9]{1}|2[0-3]{1})))(:[0-5]{1}[0-9]{1})?)?)?)?)?)?)?)?$',
  CMITimespan: '^P(?:([.,\\d]+)Y)?(?:([.,\\d]+)M)?(?:([.,\\d]+)W)?(?:([.,\\d]+)D)?(?:T?(?:([.,\\d]+)H)?(?:([.,\\d]+)M)?(?:([.,\\d]+)S)?)?$',
  CMIInteger: '^\\d+$',
  CMISInteger: '^-?([0-9]+)$',
  CMIDecimal: '^-?([0-9]{1,5})(\\.[0-9]{1,18})?$',
  CMIIdentifier: '^\\S{1,250}[a-zA-Z0-9]$',
  CMIShortIdentifier: '^[\\w\\.\\-\\_]{1,250}$',
  // eslint-disable-line
  CMILongIdentifier: '^(?:(?!urn:)\\S{1,4000}|urn:[A-Za-z0-9-]{1,31}:\\S{1,4000}|.{1,4000})$',
  // need to re-examine this
  CMIFeedback: '^.*$',
  // This must be redefined
  CMIIndex: '[._](\\d+).',
  CMIIndexStore: '.N(\\d+).',
  // Vocabulary Data Type Definition
  CMICStatus: '^(completed|incomplete|not attempted|unknown)$',
  CMISStatus: '^(passed|failed|unknown)$',
  CMIExit: '^(time-out|suspend|logout|normal)$',
  CMIType: '^(true-false|choice|fill-in|long-fill-in|matching|performance|sequencing|likert|numeric|other)$',
  CMIResult: '^(correct|wrong|unanticipated|neutral|-?([0-9]{1,4})(\\.[0-9]{1,18})?)$',
  NAVEvent: '^(previous|continue|exit|exitAll|abandon|abandonAll|suspendAll|\{target=\\S{0,200}[a-zA-Z0-9]\}choice|jump)$',
  // eslint-disable-line
  NAVBoolean: '^(unknown|true|false$)',
  NAVTarget: '^(previous|continue|choice.{target=\\S{0,200}[a-zA-Z0-9]})$',
  // Data ranges
  scaled_range: '-1#1',
  audio_range: '0#*',
  speed_range: '0#*',
  text_range: '-1#1',
  progress_range: '0#1'
};
var Regex = {
  aicc: aicc,
  scorm12: scorm12,
  scorm2004: scorm2004
};
var _default = Regex;
exports["default"] = _default;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regex = _interopRequireDefault(require("./regex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var scorm2004_regex = _regex["default"].scorm2004;
var learner = {
  'true-false': {
    format: '^true$|^false$',
    max: 1,
    delimiter: '',
    unique: false
  },
  'choice': {
    format: scorm2004_regex.CMIShortIdentifier,
    max: 36,
    delimiter: '[,]',
    unique: true
  },
  'fill-in': {
    format: scorm2004_regex.CMILangString250,
    max: 10,
    delimiter: '[,]',
    unique: false
  },
  'long-fill-in': {
    format: scorm2004_regex.CMILangString4000,
    max: 1,
    delimiter: '',
    unique: false
  },
  'matching': {
    format: scorm2004_regex.CMIShortIdentifier,
    format2: scorm2004_regex.CMIShortIdentifier,
    max: 36,
    delimiter: '[,]',
    delimiter2: '[.]',
    unique: false
  },
  'performance': {
    format: '^$|' + scorm2004_regex.CMIShortIdentifier,
    format2: scorm2004_regex.CMIDecimal + '|^$|' + scorm2004_regex.CMIShortIdentifier,
    max: 250,
    delimiter: '[,]',
    delimiter2: '[.]',
    unique: false
  },
  'sequencing': {
    format: scorm2004_regex.CMIShortIdentifier,
    max: 36,
    delimiter: '[,]',
    unique: false
  },
  'likert': {
    format: scorm2004_regex.CMIShortIdentifier,
    max: 1,
    delimiter: '',
    unique: false
  },
  'numeric': {
    format: scorm2004_regex.CMIDecimal,
    max: 1,
    delimiter: '',
    unique: false
  },
  'other': {
    format: scorm2004_regex.CMIString4000,
    max: 1,
    delimiter: '',
    unique: false
  }
};
var correct = {
  'true-false': {
    max: 1,
    delimiter: '',
    unique: false,
    duplicate: false,
    format: '^true$|^false$',
    limit: 1
  },
  'choice': {
    max: 36,
    delimiter: '[,]',
    unique: true,
    duplicate: false,
    format: scorm2004_regex.CMIShortIdentifier
  },
  'fill-in': {
    max: 10,
    delimiter: '[,]',
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMILangString250cr
  },
  'long-fill-in': {
    max: 1,
    delimiter: '',
    unique: false,
    duplicate: true,
    format: scorm2004_regex.CMILangString4000
  },
  'matching': {
    max: 36,
    delimiter: '[,]',
    delimiter2: '[.]',
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIShortIdentifier,
    format2: scorm2004_regex.CMIShortIdentifier
  },
  'performance': {
    max: 250,
    delimiter: '[,]',
    delimiter2: '[.]',
    unique: false,
    duplicate: false,
    format: '^$|' + scorm2004_regex.CMIShortIdentifier,
    format2: scorm2004_regex.CMIDecimal + '|^$|' + scorm2004_regex.CMIShortIdentifier
  },
  'sequencing': {
    max: 36,
    delimiter: '[,]',
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIShortIdentifier
  },
  'likert': {
    max: 1,
    delimiter: '',
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIShortIdentifier,
    limit: 1
  },
  'numeric': {
    max: 2,
    delimiter: '[:]',
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIDecimal,
    limit: 1
  },
  'other': {
    max: 1,
    delimiter: '',
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIString4000,
    limit: 1
  }
};
var Responses = {
  learner: learner,
  correct: correct
};
var _default = Responses;
exports["default"] = _default;

},{"./regex":13}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationError = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

var _errorCode = new WeakMap();

/**
 * Data Validation Exception
 */
var ValidationError = /*#__PURE__*/function (_Error) {
  _inherits(ValidationError, _Error);

  var _super = _createSuper(ValidationError);

  /**
   * Constructor to take in an error message and code
   * @param {number} errorCode
   */
  function ValidationError(errorCode) {
    var _this;

    _classCallCheck(this, ValidationError);

    _this = _super.call(this, errorCode);

    _errorCode.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(_assertThisInitialized(_this), _errorCode, errorCode);

    return _this;
  }

  _createClass(ValidationError, [{
    key: "errorCode",

    /**
     * Getter for #errorCode
     * @return {number}
     */
    get: function get() {
      return _classPrivateFieldGet(this, _errorCode);
    }
    /**
     * Trying to override the default Error message
     * @return {string}
     */

  }, {
    key: "message",
    get: function get() {
      return _classPrivateFieldGet(this, _errorCode) + '';
    }
  }]);

  return ValidationError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

exports.ValidationError = ValidationError;

},{}],16:[function(require,module,exports){
"use strict";

var _Scorm2004API = _interopRequireDefault(require("./Scorm2004API"));

var _Scorm12API = _interopRequireDefault(require("./Scorm12API"));

var _AICC = _interopRequireDefault(require("./AICC"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

window.Scorm12API = _Scorm12API["default"];
window.Scorm2004API = _Scorm2004API["default"];
window.AICC = _AICC["default"];

},{"./AICC":2,"./Scorm12API":4,"./Scorm2004API":5}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSecondsAsHHMMSS = getSecondsAsHHMMSS;
exports.getSecondsAsISODuration = getSecondsAsISODuration;
exports.getTimeAsSeconds = getTimeAsSeconds;
exports.getDurationAsSeconds = getDurationAsSeconds;
exports.addTwoDurations = addTwoDurations;
exports.addHHMMSSTimeStrings = addHHMMSSTimeStrings;
exports.flatten = flatten;
exports.unflatten = unflatten;
exports.countDecimals = countDecimals;
exports.SECONDS_PER_DAY = exports.SECONDS_PER_HOUR = exports.SECONDS_PER_MINUTE = exports.SECONDS_PER_SECOND = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var SECONDS_PER_SECOND = 1.0;
exports.SECONDS_PER_SECOND = SECONDS_PER_SECOND;
var SECONDS_PER_MINUTE = 60;
exports.SECONDS_PER_MINUTE = SECONDS_PER_MINUTE;
var SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
exports.SECONDS_PER_HOUR = SECONDS_PER_HOUR;
var SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;
exports.SECONDS_PER_DAY = SECONDS_PER_DAY;
var designations = [['D', SECONDS_PER_DAY], ['H', SECONDS_PER_HOUR], ['M', SECONDS_PER_MINUTE], ['S', SECONDS_PER_SECOND]];
/**
 * Converts a Number to a String of HH:MM:SS
 *
 * @param {Number} totalSeconds
 * @return {string}
 */

function getSecondsAsHHMMSS(totalSeconds) {
  // SCORM spec does not deal with negative durations, give zero back
  if (!totalSeconds || totalSeconds <= 0) {
    return '00:00:00';
  }

  var hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
  var dateObj = new Date(totalSeconds * 1000);
  var minutes = dateObj.getUTCMinutes(); // make sure we add any possible decimal value

  var seconds = dateObj.getSeconds();
  var ms = totalSeconds % 1.0;
  var msStr = '';

  if (countDecimals(ms) > 0) {
    if (countDecimals(ms) > 2) {
      msStr = ms.toFixed(2);
    } else {
      msStr = String(ms);
    }

    msStr = '.' + msStr.split('.')[1];
  }

  return (hours + ':' + minutes + ':' + seconds).replace(/\b\d\b/g, '0$&') + msStr;
}
/**
 * Calculate the number of seconds from ISO 8601 Duration
 *
 * @param {Number} seconds
 * @return {String}
 */


function getSecondsAsISODuration(seconds) {
  // SCORM spec does not deal with negative durations, give zero back
  if (!seconds || seconds <= 0) {
    return 'PT0S';
  }

  var duration = 'P';
  var remainder = seconds;
  designations.forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        sign = _ref2[0],
        current_seconds = _ref2[1];

    var value = Math.floor(remainder / current_seconds);
    remainder = remainder % current_seconds;

    if (countDecimals(remainder) > 2) {
      remainder = Number(Number(remainder).toFixed(2));
    } // If we have anything left in the remainder, and we're currently adding
    // seconds to the duration, go ahead and add the decimal to the seconds


    if (sign === 'S' && remainder > 0) {
      value += remainder;
    }

    if (value) {
      if ((duration.indexOf('D') > 0 || sign === 'H' || sign === 'M' || sign === 'S') && duration.indexOf('T') === -1) {
        duration += 'T';
      }

      duration += "".concat(value).concat(sign);
    }
  });
  return duration;
}
/**
 * Calculate the number of seconds from HH:MM:SS.DDDDDD
 *
 * @param {string} timeString
 * @param {RegExp} timeRegex
 * @return {number}
 */


function getTimeAsSeconds(timeString, timeRegex) {
  if (!timeString || typeof timeString !== 'string' || !timeString.match(timeRegex)) {
    return 0;
  }

  var parts = timeString.split(':');
  var hours = Number(parts[0]);
  var minutes = Number(parts[1]);
  var seconds = Number(parts[2]);
  return hours * 3600 + minutes * 60 + seconds;
}
/**
 * Calculate the number of seconds from ISO 8601 Duration
 *
 * @param {string} duration
 * @param {RegExp} durationRegex
 * @return {number}
 */


function getDurationAsSeconds(duration, durationRegex) {
  if (!duration || !duration.match(durationRegex)) {
    return 0;
  }

  var _ref3 = new RegExp(durationRegex).exec(duration) || [],
      _ref4 = _slicedToArray(_ref3, 8),
      years = _ref4[1],
      months = _ref4[2],
      days = _ref4[4],
      hours = _ref4[5],
      minutes = _ref4[6],
      seconds = _ref4[7];

  var result = 0.0;
  result += Number(seconds) * 1.0 || 0.0;
  result += Number(minutes) * 60.0 || 0.0;
  result += Number(hours) * 3600.0 || 0.0;
  result += Number(days) * (60 * 60 * 24.0) || 0.0;
  result += Number(years) * (60 * 60 * 24 * 365.0) || 0.0;
  return result;
}
/**
 * Adds together two ISO8601 Duration strings
 *
 * @param {string} first
 * @param {string} second
 * @param {RegExp} durationRegex
 * @return {string}
 */


function addTwoDurations(first, second, durationRegex) {
  return getSecondsAsISODuration(getDurationAsSeconds(first, durationRegex) + getDurationAsSeconds(second, durationRegex));
}
/**
 * Add together two HH:MM:SS.DD strings
 *
 * @param {string} first
 * @param {string} second
 * @param {RegExp} timeRegex
 * @return {string}
 */


function addHHMMSSTimeStrings(first, second, timeRegex) {
  return getSecondsAsHHMMSS(getTimeAsSeconds(first, timeRegex) + getTimeAsSeconds(second, timeRegex));
}
/**
 * Flatten a JSON object down to string paths for each values
 * @param {object} data
 * @return {object}
 */


function flatten(data) {
  var result = {};
  /**
   * Recurse through the object
   * @param {*} cur
   * @param {*} prop
   */

  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++) {
        recurse(cur[i], prop + '[' + i + ']');
        if (l === 0) result[prop] = [];
      }
    } else {
      var isEmpty = true;

      for (var p in cur) {
        if ({}.hasOwnProperty.call(cur, p)) {
          isEmpty = false;
          recurse(cur[p], prop ? prop + '.' + p : p);
        }
      }

      if (isEmpty && prop) result[prop] = {};
    }
  }

  recurse(data, '');
  return result;
}
/**
 * Un-flatten a flat JSON object
 * @param {object} data
 * @return {object}
 */


function unflatten(data) {
  'use strict';

  if (Object(data) !== data || Array.isArray(data)) return data;
  var regex = /\.?([^.[\]]+)|\[(\d+)]/g;
  var result = {};

  for (var p in data) {
    if ({}.hasOwnProperty.call(data, p)) {
      var cur = result;
      var prop = '';
      var m = regex.exec(p);

      while (m) {
        cur = cur[prop] || (cur[prop] = m[2] ? [] : {});
        prop = m[2] || m[1];
        m = regex.exec(p);
      }

      cur[prop] = data[p];
    }
  }

  return result[''] || result;
}
/**
 * Counts the number of decimal places
 * @param {number} num
 * @return {number}
 */


function countDecimals(num) {
  if (Math.floor(num) === num || String(num).indexOf('.') < 0) return 0;
  var parts = num.toString().split('.')[1];
  return parts.length || 0;
}

},{}]},{},[2,3,6,7,8,9,10,11,12,13,14,15,16,4,5,17])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL2luZGV4LmpzIiwic3JjL0FJQ0MuanMiLCJzcmMvQmFzZUFQSS5qcyIsInNyYy9TY29ybTEyQVBJLmpzIiwic3JjL1Njb3JtMjAwNEFQSS5qcyIsInNyYy9jbWkvYWljY19jbWkuanMiLCJzcmMvY21pL2NvbW1vbi5qcyIsInNyYy9jbWkvc2Nvcm0xMl9jbWkuanMiLCJzcmMvY21pL3Njb3JtMjAwNF9jbWkuanMiLCJzcmMvY29uc3RhbnRzL2FwaV9jb25zdGFudHMuanMiLCJzcmMvY29uc3RhbnRzL2Vycm9yX2NvZGVzLmpzIiwic3JjL2NvbnN0YW50cy9sYW5ndWFnZV9jb25zdGFudHMuanMiLCJzcmMvY29uc3RhbnRzL3JlZ2V4LmpzIiwic3JjL2NvbnN0YW50cy9yZXNwb25zZV9jb25zdGFudHMuanMiLCJzcmMvZXhjZXB0aW9ucy5qcyIsInNyYy9leHBvcnRzLmpzIiwic3JjL3V0aWxpdGllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFxQixHQUFyQixFQUEwQixDQUExQixDQUFkO0FBQ0EsU0FBTyxLQUFLLENBQUMsTUFBTixJQUFnQixDQUF2QjtBQUNEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBsb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBOQU4gPSAwIC8gMDtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmFkIHNpZ25lZCBoZXhhZGVjaW1hbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCYWRIZXggPSAvXlstK10weFswLTlhLWZdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJpbmFyeSBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCaW5hcnkgPSAvXjBiWzAxXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvY3RhbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNPY3RhbCA9IC9eMG9bMC03XSskL2k7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlSW50ID0gcGFyc2VJbnQ7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heCxcbiAgICBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBHZXRzIHRoZSB0aW1lc3RhbXAgb2YgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2VcbiAqIHRoZSBVbml4IGVwb2NoICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBEYXRlXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lc3RhbXAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmZXIoZnVuY3Rpb24oc3RhbXApIHtcbiAqICAgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTtcbiAqIH0sIF8ubm93KCkpO1xuICogLy8gPT4gTG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgaW52b2NhdGlvbi5cbiAqL1xudmFyIG5vdyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcm9vdC5EYXRlLm5vdygpO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZGVib3VuY2VkIGZ1bmN0aW9uIHRoYXQgZGVsYXlzIGludm9raW5nIGBmdW5jYCB1bnRpbCBhZnRlciBgd2FpdGBcbiAqIG1pbGxpc2Vjb25kcyBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIGxhc3QgdGltZSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHdhc1xuICogaW52b2tlZC4gVGhlIGRlYm91bmNlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGAgbWV0aG9kIHRvIGNhbmNlbFxuICogZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG8gaW1tZWRpYXRlbHkgaW52b2tlIHRoZW0uXG4gKiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYCBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGVcbiAqIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YCB0aW1lb3V0LiBUaGUgYGZ1bmNgIGlzIGludm9rZWRcbiAqIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24uIFN1YnNlcXVlbnRcbiAqIGNhbGxzIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgXG4gKiBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLmRlYm91bmNlYCBhbmQgYF8udGhyb3R0bGVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVib3VuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz1mYWxzZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4V2FpdF1cbiAqICBUaGUgbWF4aW11bSB0aW1lIGBmdW5jYCBpcyBhbGxvd2VkIHRvIGJlIGRlbGF5ZWQgYmVmb3JlIGl0J3MgaW52b2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVib3VuY2VkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBjb3N0bHkgY2FsY3VsYXRpb25zIHdoaWxlIHRoZSB3aW5kb3cgc2l6ZSBpcyBpbiBmbHV4LlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Jlc2l6ZScsIF8uZGVib3VuY2UoY2FsY3VsYXRlTGF5b3V0LCAxNTApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHNlbmRNYWlsYCB3aGVuIGNsaWNrZWQsIGRlYm91bmNpbmcgc3Vic2VxdWVudCBjYWxscy5cbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCBfLmRlYm91bmNlKHNlbmRNYWlsLCAzMDAsIHtcbiAqICAgJ2xlYWRpbmcnOiB0cnVlLFxuICogICAndHJhaWxpbmcnOiBmYWxzZVxuICogfSkpO1xuICpcbiAqIC8vIEVuc3VyZSBgYmF0Y2hMb2dgIGlzIGludm9rZWQgb25jZSBhZnRlciAxIHNlY29uZCBvZiBkZWJvdW5jZWQgY2FsbHMuXG4gKiB2YXIgZGVib3VuY2VkID0gXy5kZWJvdW5jZShiYXRjaExvZywgMjUwLCB7ICdtYXhXYWl0JzogMTAwMCB9KTtcbiAqIHZhciBzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UoJy9zdHJlYW0nKTtcbiAqIGpRdWVyeShzb3VyY2UpLm9uKCdtZXNzYWdlJywgZGVib3VuY2VkKTtcbiAqXG4gKiAvLyBDYW5jZWwgdGhlIHRyYWlsaW5nIGRlYm91bmNlZCBpbnZvY2F0aW9uLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3BvcHN0YXRlJywgZGVib3VuY2VkLmNhbmNlbCk7XG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGxhc3RBcmdzLFxuICAgICAgbGFzdFRoaXMsXG4gICAgICBtYXhXYWl0LFxuICAgICAgcmVzdWx0LFxuICAgICAgdGltZXJJZCxcbiAgICAgIGxhc3RDYWxsVGltZSxcbiAgICAgIGxhc3RJbnZva2VUaW1lID0gMCxcbiAgICAgIGxlYWRpbmcgPSBmYWxzZSxcbiAgICAgIG1heGluZyA9IGZhbHNlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHdhaXQgPSB0b051bWJlcih3YWl0KSB8fCAwO1xuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gISFvcHRpb25zLmxlYWRpbmc7XG4gICAgbWF4aW5nID0gJ21heFdhaXQnIGluIG9wdGlvbnM7XG4gICAgbWF4V2FpdCA9IG1heGluZyA/IG5hdGl2ZU1heCh0b051bWJlcihvcHRpb25zLm1heFdhaXQpIHx8IDAsIHdhaXQpIDogbWF4V2FpdDtcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gaW52b2tlRnVuYyh0aW1lKSB7XG4gICAgdmFyIGFyZ3MgPSBsYXN0QXJncyxcbiAgICAgICAgdGhpc0FyZyA9IGxhc3RUaGlzO1xuXG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gbGVhZGluZ0VkZ2UodGltZSkge1xuICAgIC8vIFJlc2V0IGFueSBgbWF4V2FpdGAgdGltZXIuXG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIC8vIFN0YXJ0IHRoZSB0aW1lciBmb3IgdGhlIHRyYWlsaW5nIGVkZ2UuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAvLyBJbnZva2UgdGhlIGxlYWRpbmcgZWRnZS5cbiAgICByZXR1cm4gbGVhZGluZyA/IGludm9rZUZ1bmModGltZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiByZW1haW5pbmdXYWl0KHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lLFxuICAgICAgICByZXN1bHQgPSB3YWl0IC0gdGltZVNpbmNlTGFzdENhbGw7XG5cbiAgICByZXR1cm4gbWF4aW5nID8gbmF0aXZlTWluKHJlc3VsdCwgbWF4V2FpdCAtIHRpbWVTaW5jZUxhc3RJbnZva2UpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkSW52b2tlKHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lO1xuXG4gICAgLy8gRWl0aGVyIHRoaXMgaXMgdGhlIGZpcnN0IGNhbGwsIGFjdGl2aXR5IGhhcyBzdG9wcGVkIGFuZCB3ZSdyZSBhdCB0aGVcbiAgICAvLyB0cmFpbGluZyBlZGdlLCB0aGUgc3lzdGVtIHRpbWUgaGFzIGdvbmUgYmFja3dhcmRzIGFuZCB3ZSdyZSB0cmVhdGluZ1xuICAgIC8vIGl0IGFzIHRoZSB0cmFpbGluZyBlZGdlLCBvciB3ZSd2ZSBoaXQgdGhlIGBtYXhXYWl0YCBsaW1pdC5cbiAgICByZXR1cm4gKGxhc3RDYWxsVGltZSA9PT0gdW5kZWZpbmVkIHx8ICh0aW1lU2luY2VMYXN0Q2FsbCA+PSB3YWl0KSB8fFxuICAgICAgKHRpbWVTaW5jZUxhc3RDYWxsIDwgMCkgfHwgKG1heGluZyAmJiB0aW1lU2luY2VMYXN0SW52b2tlID49IG1heFdhaXQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVyRXhwaXJlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpO1xuICAgIGlmIChzaG91bGRJbnZva2UodGltZSkpIHtcbiAgICAgIHJldHVybiB0cmFpbGluZ0VkZ2UodGltZSk7XG4gICAgfVxuICAgIC8vIFJlc3RhcnQgdGhlIHRpbWVyLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgcmVtYWluaW5nV2FpdCh0aW1lKSk7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFpbGluZ0VkZ2UodGltZSkge1xuICAgIHRpbWVySWQgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBPbmx5IGludm9rZSBpZiB3ZSBoYXZlIGBsYXN0QXJnc2Agd2hpY2ggbWVhbnMgYGZ1bmNgIGhhcyBiZWVuXG4gICAgLy8gZGVib3VuY2VkIGF0IGxlYXN0IG9uY2UuXG4gICAgaWYgKHRyYWlsaW5nICYmIGxhc3RBcmdzKSB7XG4gICAgICByZXR1cm4gaW52b2tlRnVuYyh0aW1lKTtcbiAgICB9XG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIGlmICh0aW1lcklkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICB9XG4gICAgbGFzdEludm9rZVRpbWUgPSAwO1xuICAgIGxhc3RBcmdzID0gbGFzdENhbGxUaW1lID0gbGFzdFRoaXMgPSB0aW1lcklkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgcmV0dXJuIHRpbWVySWQgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IHRyYWlsaW5nRWRnZShub3coKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKSxcbiAgICAgICAgaXNJbnZva2luZyA9IHNob3VsZEludm9rZSh0aW1lKTtcblxuICAgIGxhc3RBcmdzID0gYXJndW1lbnRzO1xuICAgIGxhc3RUaGlzID0gdGhpcztcbiAgICBsYXN0Q2FsbFRpbWUgPSB0aW1lO1xuXG4gICAgaWYgKGlzSW52b2tpbmcpIHtcbiAgICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGxlYWRpbmdFZGdlKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgICBpZiAobWF4aW5nKSB7XG4gICAgICAgIC8vIEhhbmRsZSBpbnZvY2F0aW9ucyBpbiBhIHRpZ2h0IGxvb3AuXG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgICAgIHJldHVybiBpbnZva2VGdW5jKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgZGVib3VuY2VkLmZsdXNoID0gZmx1c2g7XG4gIHJldHVybiBkZWJvdW5jZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlYm91bmNlO1xuIiwiLy8gQGZsb3dcbmltcG9ydCBTY29ybTEyQVBJIGZyb20gJy4vU2Nvcm0xMkFQSSc7XG5pbXBvcnQge1xuICBDTUksXG4gIENNSUF0dGVtcHRSZWNvcmRzT2JqZWN0LFxuICBDTUlFdmFsdWF0aW9uQ29tbWVudHNPYmplY3QsXG4gIENNSVRyaWVzT2JqZWN0LFxufSBmcm9tICcuL2NtaS9haWNjX2NtaSc7XG5pbXBvcnQge05BVn0gZnJvbSAnLi9jbWkvc2Nvcm0xMl9jbWknO1xuXG4vKipcbiAqIFRoZSBBSUNDIEFQSSBjbGFzc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBSUNDIGV4dGVuZHMgU2Nvcm0xMkFQSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciB0byBjcmVhdGUgQUlDQyBBUEkgb2JqZWN0XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IHt9KSB7XG4gICAgY29uc3QgZmluYWxTZXR0aW5ncyA9IHtcbiAgICAgIC4uLntcbiAgICAgICAgbWFzdGVyeV9vdmVycmlkZTogZmFsc2UsXG4gICAgICB9LCAuLi5zZXR0aW5ncyxcbiAgICB9O1xuXG4gICAgc3VwZXIoZmluYWxTZXR0aW5ncyk7XG5cbiAgICB0aGlzLmNtaSA9IG5ldyBDTUkoKTtcbiAgICB0aGlzLm5hdiA9IG5ldyBOQVYoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIG9yIGJ1aWxkcyBhIG5ldyBjaGlsZCBlbGVtZW50IHRvIGFkZCB0byB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvdW5kRmlyc3RJbmRleFxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBnZXRDaGlsZEVsZW1lbnQoQ01JRWxlbWVudCwgdmFsdWUsIGZvdW5kRmlyc3RJbmRleCkge1xuICAgIGxldCBuZXdDaGlsZCA9IHN1cGVyLmdldENoaWxkRWxlbWVudChDTUlFbGVtZW50LCB2YWx1ZSwgZm91bmRGaXJzdEluZGV4KTtcblxuICAgIGlmICghbmV3Q2hpbGQpIHtcbiAgICAgIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ2NtaVxcXFwuZXZhbHVhdGlvblxcXFwuY29tbWVudHNcXFxcLlxcXFxkKycpKSB7XG4gICAgICAgIG5ld0NoaWxkID0gbmV3IENNSUV2YWx1YXRpb25Db21tZW50c09iamVjdCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgICAnY21pXFxcXC5zdHVkZW50X2RhdGFcXFxcLnRyaWVzXFxcXC5cXFxcZCsnKSkge1xuICAgICAgICBuZXdDaGlsZCA9IG5ldyBDTUlUcmllc09iamVjdCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgICAnY21pXFxcXC5zdHVkZW50X2RhdGFcXFxcLmF0dGVtcHRfcmVjb3Jkc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JQXR0ZW1wdFJlY29yZHNPYmplY3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3Q2hpbGQ7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSB0aGUgd2hvbGUgQVBJIHdpdGggYW5vdGhlclxuICAgKlxuICAgKiBAcGFyYW0ge0FJQ0N9IG5ld0FQSVxuICAgKi9cbiAgcmVwbGFjZVdpdGhBbm90aGVyU2Nvcm1BUEkobmV3QVBJKSB7XG4gICAgLy8gRGF0YSBNb2RlbFxuICAgIHRoaXMuY21pID0gbmV3QVBJLmNtaTtcbiAgICB0aGlzLm5hdiA9IG5ld0FQSS5uYXY7XG4gIH1cbn1cbiIsIi8vIEBmbG93XG5pbXBvcnQge0NNSUFycmF5fSBmcm9tICcuL2NtaS9jb21tb24nO1xuaW1wb3J0IHtWYWxpZGF0aW9uRXJyb3J9IGZyb20gJy4vZXhjZXB0aW9ucyc7XG5pbXBvcnQgRXJyb3JDb2RlcyBmcm9tICcuL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IHtzb3J0RmxhdHRlbmVkQ01JRWxlbWVudHMsIHVuZmxhdHRlbn0gZnJvbSAnLi91dGlsaXRpZXMnO1xuaW1wb3J0IGRlYm91bmNlIGZyb20gJ2xvZGFzaC5kZWJvdW5jZSc7XG5cbmNvbnN0IGdsb2JhbF9jb25zdGFudHMgPSBBUElDb25zdGFudHMuZ2xvYmFsO1xuY29uc3Qgc2Nvcm0xMl9lcnJvcl9jb2RlcyA9IEVycm9yQ29kZXMuc2Nvcm0xMjtcblxuLyoqXG4gKiBCYXNlIEFQSSBjbGFzcyBmb3IgQUlDQywgU0NPUk0gMS4yLCBhbmQgU0NPUk0gMjAwNC4gU2hvdWxkIGJlIGNvbnNpZGVyZWRcbiAqIGFic3RyYWN0LCBhbmQgbmV2ZXIgaW5pdGlhbGl6ZWQgb24gaXQncyBvd24uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VBUEkge1xuICAjdGltZW91dDtcbiAgI2Vycm9yX2NvZGVzO1xuICAjc2V0dGluZ3MgPSB7XG4gICAgYXV0b2NvbW1pdDogZmFsc2UsXG4gICAgYXV0b2NvbW1pdFNlY29uZHM6IDEwLFxuICAgIGFzeW5jQ29tbWl0OiBmYWxzZSxcbiAgICBzZW5kQmVhY29uQ29tbWl0OiBmYWxzZSxcbiAgICBsbXNDb21taXRVcmw6IGZhbHNlLFxuICAgIGRhdGFDb21taXRGb3JtYXQ6ICdqc29uJywgLy8gdmFsaWQgZm9ybWF0cyBhcmUgJ2pzb24nIG9yICdmbGF0dGVuZWQnLCAncGFyYW1zJ1xuICAgIGNvbW1pdFJlcXVlc3REYXRhVHlwZTogJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD1VVEYtOCcsXG4gICAgYXV0b1Byb2dyZXNzOiBmYWxzZSxcbiAgICBsb2dMZXZlbDogZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfRVJST1IsXG4gICAgc2VsZlJlcG9ydFNlc3Npb25UaW1lOiBmYWxzZSxcbiAgICByZXNwb25zZUhhbmRsZXI6IGZ1bmN0aW9uKHhocikge1xuICAgICAgbGV0IHJlc3VsdDtcbiAgICAgIGlmICh0eXBlb2YgeGhyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsIHx8ICF7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdCwgJ3Jlc3VsdCcpKSB7XG4gICAgICAgICAgcmVzdWx0ID0ge307XG4gICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgcmVzdWx0LnJlc3VsdCA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0LnJlc3VsdCA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG4gICAgICAgICAgICByZXN1bHQuZXJyb3JDb2RlID0gMTAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuICB9O1xuICBjbWk7XG4gIHN0YXJ0aW5nRGF0YToge307XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBCYXNlIEFQSSBjbGFzcy4gU2V0cyBzb21lIHNoYXJlZCBBUEkgZmllbGRzLCBhcyB3ZWxsIGFzXG4gICAqIHNldHMgdXAgb3B0aW9ucyBmb3IgdGhlIEFQSS5cbiAgICogQHBhcmFtIHtvYmplY3R9IGVycm9yX2NvZGVzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3IoZXJyb3JfY29kZXMsIHNldHRpbmdzKSB7XG4gICAgaWYgKG5ldy50YXJnZXQgPT09IEJhc2VBUEkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb25zdHJ1Y3QgQmFzZUFQSSBpbnN0YW5jZXMgZGlyZWN0bHknKTtcbiAgICB9XG4gICAgdGhpcy5jdXJyZW50U3RhdGUgPSBnbG9iYWxfY29uc3RhbnRzLlNUQVRFX05PVF9JTklUSUFMSVpFRDtcbiAgICB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuICAgIHRoaXMubGlzdGVuZXJBcnJheSA9IFtdO1xuXG4gICAgdGhpcy4jdGltZW91dCA9IG51bGw7XG4gICAgdGhpcy4jZXJyb3JfY29kZXMgPSBlcnJvcl9jb2RlcztcblxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICB0aGlzLmFwaUxvZ0xldmVsID0gdGhpcy5zZXR0aW5ncy5sb2dMZXZlbDtcbiAgICB0aGlzLnNlbGZSZXBvcnRTZXNzaW9uVGltZSA9IHRoaXMuc2V0dGluZ3Muc2VsZlJlcG9ydFNlc3Npb25UaW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIEFQSVxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsaXplTWVzc2FnZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGVybWluYXRpb25NZXNzYWdlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGluaXRpYWxpemUoXG4gICAgICBjYWxsYmFja05hbWU6IFN0cmluZyxcbiAgICAgIGluaXRpYWxpemVNZXNzYWdlPzogU3RyaW5nLFxuICAgICAgdGVybWluYXRpb25NZXNzYWdlPzogU3RyaW5nKSB7XG4gICAgbGV0IHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQoKSkge1xuICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuSU5JVElBTElaRUQsIGluaXRpYWxpemVNZXNzYWdlKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNUZXJtaW5hdGVkKCkpIHtcbiAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHRoaXMuI2Vycm9yX2NvZGVzLlRFUk1JTkFURUQsIHRlcm1pbmF0aW9uTWVzc2FnZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLnNlbGZSZXBvcnRTZXNzaW9uVGltZSkge1xuICAgICAgICB0aGlzLmNtaS5zZXRTdGFydFRpbWUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBnbG9iYWxfY29uc3RhbnRzLlNUQVRFX0lOSVRJQUxJWkVEO1xuICAgICAgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICAgIHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBudWxsLCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG4gICAgdGhpcy5jbGVhclNDT1JNRXJyb3IocmV0dXJuVmFsdWUpO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2Vycm9yX2NvZGVzXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIGdldCBlcnJvcl9jb2RlcygpIHtcbiAgICByZXR1cm4gdGhpcy4jZXJyb3JfY29kZXM7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc2V0dGluZ3NcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgZ2V0IHNldHRpbmdzKCkge1xuICAgIHJldHVybiB0aGlzLiNzZXR0aW5ncztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzZXR0aW5nc1xuICAgKiBAcGFyYW0ge29iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIHNldCBzZXR0aW5ncyhzZXR0aW5nczogT2JqZWN0KSB7XG4gICAgdGhpcy4jc2V0dGluZ3MgPSB7Li4udGhpcy4jc2V0dGluZ3MsIC4uLnNldHRpbmdzfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUZXJtaW5hdGVzIHRoZSBjdXJyZW50IHJ1biBvZiB0aGUgQVBJXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHBhcmFtIHtib29sZWFufSBjaGVja1Rlcm1pbmF0ZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgdGVybWluYXRlKFxuICAgICAgY2FsbGJhY2tOYW1lOiBTdHJpbmcsXG4gICAgICBjaGVja1Rlcm1pbmF0ZWQ6IGJvb2xlYW4pIHtcbiAgICBsZXQgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuXG4gICAgaWYgKHRoaXMuY2hlY2tTdGF0ZShjaGVja1Rlcm1pbmF0ZWQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlRFUk1JTkFUSU9OX0JFRk9SRV9JTklULFxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5NVUxUSVBMRV9URVJNSU5BVElPTikpIHtcbiAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gZ2xvYmFsX2NvbnN0YW50cy5TVEFURV9URVJNSU5BVEVEO1xuXG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnN0b3JlRGF0YSh0cnVlKTtcbiAgICAgIGlmICghdGhpcy5zZXR0aW5ncy5zZW5kQmVhY29uQ29tbWl0ICYmICF0aGlzLnNldHRpbmdzLmFzeW5jQ29tbWl0ICYmXG4gICAgICAgICAgdHlwZW9mIHJlc3VsdC5lcnJvckNvZGUgIT09ICd1bmRlZmluZWQnICYmIHJlc3VsdC5lcnJvckNvZGUgPiAwKSB7XG4gICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHJlc3VsdC5lcnJvckNvZGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuVmFsdWUgPSAodHlwZW9mIHJlc3VsdCAhPT0gJ3VuZGVmaW5lZCcgJiYgcmVzdWx0LnJlc3VsdCkgP1xuICAgICAgICAgIHJlc3VsdC5yZXN1bHQgOiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuXG4gICAgICBpZiAoY2hlY2tUZXJtaW5hdGVkKSB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuXG4gICAgICByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRTtcbiAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgbnVsbCwgJ3JldHVybmVkOiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuICAgIHRoaXMuY2xlYXJTQ09STUVycm9yKHJldHVyblZhbHVlKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHZhbHVlIG9mIHRoZSBDTUlFbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tUZXJtaW5hdGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldFZhbHVlKFxuICAgICAgY2FsbGJhY2tOYW1lOiBTdHJpbmcsXG4gICAgICBjaGVja1Rlcm1pbmF0ZWQ6IGJvb2xlYW4sXG4gICAgICBDTUlFbGVtZW50OiBTdHJpbmcpIHtcbiAgICBsZXQgcmV0dXJuVmFsdWU7XG5cbiAgICBpZiAodGhpcy5jaGVja1N0YXRlKGNoZWNrVGVybWluYXRlZCxcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuUkVUUklFVkVfQkVGT1JFX0lOSVQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlJFVFJJRVZFX0FGVEVSX1RFUk0pKSB7XG4gICAgICBpZiAoY2hlY2tUZXJtaW5hdGVkKSB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuICAgICAgcmV0dXJuVmFsdWUgPSB0aGlzLmdldENNSVZhbHVlKENNSUVsZW1lbnQpO1xuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSwgQ01JRWxlbWVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBDTUlFbGVtZW50LCAnOiByZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIENNSUVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHBhcmFtIHtib29sZWFufSBjaGVja1Rlcm1pbmF0ZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBzZXRWYWx1ZShcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgY2hlY2tUZXJtaW5hdGVkOiBib29sZWFuLFxuICAgICAgQ01JRWxlbWVudCxcbiAgICAgIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKTtcbiAgICB9XG4gICAgbGV0IHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgIGlmICh0aGlzLmNoZWNrU3RhdGUoY2hlY2tUZXJtaW5hdGVkLCB0aGlzLiNlcnJvcl9jb2Rlcy5TVE9SRV9CRUZPUkVfSU5JVCxcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuU1RPUkVfQUZURVJfVEVSTSkpIHtcbiAgICAgIGlmIChjaGVja1Rlcm1pbmF0ZWQpIHRoaXMubGFzdEVycm9yQ29kZSA9IDA7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm5WYWx1ZSA9IHRoaXMuc2V0Q01JVmFsdWUoQ01JRWxlbWVudCwgdmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIFZhbGlkYXRpb25FcnJvcikge1xuICAgICAgICAgIHRoaXMubGFzdEVycm9yQ29kZSA9IGUuZXJyb3JDb2RlO1xuICAgICAgICAgIHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoZS5tZXNzYWdlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUubWVzc2FnZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHRoaXMuI2Vycm9yX2NvZGVzLkdFTkVSQUwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lLCBDTUlFbGVtZW50LCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHJldHVyblZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcbiAgICB9XG5cbiAgICAvLyBJZiB3ZSBkaWRuJ3QgaGF2ZSBhbnkgZXJyb3JzIHdoaWxlIHNldHRpbmcgdGhlIGRhdGEsIGdvIGFoZWFkIGFuZFxuICAgIC8vIHNjaGVkdWxlIGEgY29tbWl0LCBpZiBhdXRvY29tbWl0IGlzIHR1cm5lZCBvblxuICAgIGlmIChTdHJpbmcodGhpcy5sYXN0RXJyb3JDb2RlKSA9PT0gJzAnKSB7XG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy5hdXRvY29tbWl0ICYmICF0aGlzLiN0aW1lb3V0KSB7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVDb21taXQodGhpcy5zZXR0aW5ncy5hdXRvY29tbWl0U2Vjb25kcyAqIDEwMDApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgQ01JRWxlbWVudCxcbiAgICAgICAgJzogJyArIHZhbHVlICsgJzogcmVzdWx0OiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuICAgIHRoaXMuY2xlYXJTQ09STUVycm9yKHJldHVyblZhbHVlKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcmRlcnMgTE1TIHRvIHN0b3JlIGFsbCBjb250ZW50IHBhcmFtZXRlcnNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrVGVybWluYXRlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBjb21taXQoXG4gICAgICBjYWxsYmFja05hbWU6IFN0cmluZyxcbiAgICAgIGNoZWNrVGVybWluYXRlZDogYm9vbGVhbikge1xuICAgIHRoaXMuY2xlYXJTY2hlZHVsZWRDb21taXQoKTtcblxuICAgIGxldCByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG5cbiAgICBpZiAodGhpcy5jaGVja1N0YXRlKGNoZWNrVGVybWluYXRlZCwgdGhpcy4jZXJyb3JfY29kZXMuQ09NTUlUX0JFRk9SRV9JTklULFxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5DT01NSVRfQUZURVJfVEVSTSkpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuc3RvcmVEYXRhKGZhbHNlKTtcbiAgICAgIGlmICghdGhpcy5zZXR0aW5ncy5zZW5kQmVhY29uQ29tbWl0ICYmICF0aGlzLnNldHRpbmdzLmFzeW5jQ29tbWl0ICYmXG4gICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSAmJiByZXN1bHQuZXJyb3JDb2RlID4gMCkge1xuICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihyZXN1bHQuZXJyb3JDb2RlKTtcbiAgICAgIH1cbiAgICAgIHJldHVyblZhbHVlID0gKHR5cGVvZiByZXN1bHQgIT09ICd1bmRlZmluZWQnICYmIHJlc3VsdC5yZXN1bHQpID9cbiAgICAgICAgICByZXN1bHQucmVzdWx0IDogZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCAnSHR0cFJlcXVlc3QnLCAnIFJlc3VsdDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0RFQlVHKTtcblxuICAgICAgaWYgKGNoZWNrVGVybWluYXRlZCkgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcblxuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBudWxsLCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG4gICAgdGhpcy5jbGVhclNDT1JNRXJyb3IocmV0dXJuVmFsdWUpO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgbGFzdCBlcnJvciBjb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0TGFzdEVycm9yKGNhbGxiYWNrTmFtZTogU3RyaW5nKSB7XG4gICAgY29uc3QgcmV0dXJuVmFsdWUgPSBTdHJpbmcodGhpcy5sYXN0RXJyb3JDb2RlKTtcblxuICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUpO1xuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBudWxsLCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZXJyb3JOdW1iZXIgZXJyb3IgZGVzY3JpcHRpb25cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gQ01JRXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldEVycm9yU3RyaW5nKGNhbGxiYWNrTmFtZTogU3RyaW5nLCBDTUlFcnJvckNvZGUpIHtcbiAgICBsZXQgcmV0dXJuVmFsdWUgPSAnJztcblxuICAgIGlmIChDTUlFcnJvckNvZGUgIT09IG51bGwgJiYgQ01JRXJyb3JDb2RlICE9PSAnJykge1xuICAgICAgcmV0dXJuVmFsdWUgPSB0aGlzLmdldExtc0Vycm9yTWVzc2FnZURldGFpbHMoQ01JRXJyb3JDb2RlKTtcbiAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgbnVsbCwgJ3JldHVybmVkOiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBjb21wcmVoZW5zaXZlIGRlc2NyaXB0aW9uIG9mIHRoZSBlcnJvck51bWJlciBlcnJvci5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gQ01JRXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldERpYWdub3N0aWMoY2FsbGJhY2tOYW1lOiBTdHJpbmcsIENNSUVycm9yQ29kZSkge1xuICAgIGxldCByZXR1cm5WYWx1ZSA9ICcnO1xuXG4gICAgaWYgKENNSUVycm9yQ29kZSAhPT0gbnVsbCAmJiBDTUlFcnJvckNvZGUgIT09ICcnKSB7XG4gICAgICByZXR1cm5WYWx1ZSA9IHRoaXMuZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhDTUlFcnJvckNvZGUsIHRydWUpO1xuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBudWxsLCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHRoZSBMTVMgc3RhdGUgYW5kIGVuc3VyZXMgaXQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tUZXJtaW5hdGVkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiZWZvcmVJbml0RXJyb3JcbiAgICogQHBhcmFtIHtudW1iZXJ9IGFmdGVyVGVybUVycm9yXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBjaGVja1N0YXRlKFxuICAgICAgY2hlY2tUZXJtaW5hdGVkOiBib29sZWFuLFxuICAgICAgYmVmb3JlSW5pdEVycm9yOiBudW1iZXIsXG4gICAgICBhZnRlclRlcm1FcnJvcj86IG51bWJlcikge1xuICAgIGlmICh0aGlzLmlzTm90SW5pdGlhbGl6ZWQoKSkge1xuICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoYmVmb3JlSW5pdEVycm9yKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGNoZWNrVGVybWluYXRlZCAmJiB0aGlzLmlzVGVybWluYXRlZCgpKSB7XG4gICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihhZnRlclRlcm1FcnJvcik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogTG9nZ2luZyBmb3IgYWxsIFNDT1JNIGFjdGlvbnNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZ1bmN0aW9uTmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9nTWVzc2FnZVxuICAgKiBAcGFyYW0ge251bWJlcn1tZXNzYWdlTGV2ZWxcbiAgICovXG4gIGFwaUxvZyhcbiAgICAgIGZ1bmN0aW9uTmFtZTogU3RyaW5nLFxuICAgICAgQ01JRWxlbWVudDogU3RyaW5nLFxuICAgICAgbG9nTWVzc2FnZTogU3RyaW5nLFxuICAgICAgbWVzc2FnZUxldmVsOiBudW1iZXIpIHtcbiAgICBsb2dNZXNzYWdlID0gdGhpcy5mb3JtYXRNZXNzYWdlKGZ1bmN0aW9uTmFtZSwgQ01JRWxlbWVudCwgbG9nTWVzc2FnZSk7XG5cbiAgICBpZiAobWVzc2FnZUxldmVsID49IHRoaXMuYXBpTG9nTGV2ZWwpIHtcbiAgICAgIHN3aXRjaCAobWVzc2FnZUxldmVsKSB7XG4gICAgICAgIGNhc2UgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfRVJST1I6XG4gICAgICAgICAgY29uc29sZS5lcnJvcihsb2dNZXNzYWdlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9XQVJOSU5HOlxuICAgICAgICAgIGNvbnNvbGUud2Fybihsb2dNZXNzYWdlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPOlxuICAgICAgICAgIGNvbnNvbGUuaW5mbyhsb2dNZXNzYWdlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9ERUJVRzpcbiAgICAgICAgICBpZiAoY29uc29sZS5kZWJ1Zykge1xuICAgICAgICAgICAgY29uc29sZS5kZWJ1Zyhsb2dNZXNzYWdlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2cobG9nTWVzc2FnZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGb3JtYXRzIHRoZSBTQ09STSBtZXNzYWdlcyBmb3IgZWFzeSByZWFkaW5nXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmdW5jdGlvbk5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZm9ybWF0TWVzc2FnZShmdW5jdGlvbk5hbWU6IFN0cmluZywgQ01JRWxlbWVudDogU3RyaW5nLCBtZXNzYWdlOiBTdHJpbmcpIHtcbiAgICBjb25zdCBiYXNlTGVuZ3RoID0gMjA7XG4gICAgbGV0IG1lc3NhZ2VTdHJpbmcgPSAnJztcblxuICAgIG1lc3NhZ2VTdHJpbmcgKz0gZnVuY3Rpb25OYW1lO1xuXG4gICAgbGV0IGZpbGxDaGFycyA9IGJhc2VMZW5ndGggLSBtZXNzYWdlU3RyaW5nLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsbENoYXJzOyBpKyspIHtcbiAgICAgIG1lc3NhZ2VTdHJpbmcgKz0gJyAnO1xuICAgIH1cblxuICAgIG1lc3NhZ2VTdHJpbmcgKz0gJzogJztcblxuICAgIGlmIChDTUlFbGVtZW50KSB7XG4gICAgICBjb25zdCBDTUlFbGVtZW50QmFzZUxlbmd0aCA9IDcwO1xuXG4gICAgICBtZXNzYWdlU3RyaW5nICs9IENNSUVsZW1lbnQ7XG5cbiAgICAgIGZpbGxDaGFycyA9IENNSUVsZW1lbnRCYXNlTGVuZ3RoIC0gbWVzc2FnZVN0cmluZy5sZW5ndGg7XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZmlsbENoYXJzOyBqKyspIHtcbiAgICAgICAgbWVzc2FnZVN0cmluZyArPSAnICc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgIG1lc3NhZ2VTdHJpbmcgKz0gbWVzc2FnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVzc2FnZVN0cmluZztcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgdG8gc2VlIGlmIHtzdHJ9IGNvbnRhaW5zIHt0ZXN0ZXJ9XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgU3RyaW5nIHRvIGNoZWNrIGFnYWluc3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRlc3RlciBTdHJpbmcgdG8gY2hlY2sgZm9yXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBzdHJpbmdNYXRjaGVzKHN0cjogU3RyaW5nLCB0ZXN0ZXI6IFN0cmluZykge1xuICAgIHJldHVybiBzdHIgJiYgdGVzdGVyICYmIHN0ci5tYXRjaCh0ZXN0ZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHRvIHNlZSBpZiB0aGUgc3BlY2lmaWMgb2JqZWN0IGhhcyB0aGUgZ2l2ZW4gcHJvcGVydHlcbiAgICogQHBhcmFtIHsqfSByZWZPYmplY3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZVxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2NoZWNrT2JqZWN0SGFzUHJvcGVydHkocmVmT2JqZWN0LCBhdHRyaWJ1dGU6IFN0cmluZykge1xuICAgIHJldHVybiBPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChyZWZPYmplY3QsIGF0dHJpYnV0ZSkgfHxcbiAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihcbiAgICAgICAgICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihyZWZPYmplY3QpLCBhdHRyaWJ1dGUpIHx8XG4gICAgICAgIChhdHRyaWJ1dGUgaW4gcmVmT2JqZWN0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtZXNzYWdlIHRoYXQgY29ycmVzcG9uZHMgdG8gZXJyb3JOdW1iZXJcbiAgICogQVBJcyB0aGF0IGluaGVyaXQgQmFzZUFQSSBzaG91bGQgb3ZlcnJpZGUgdGhpcyBmdW5jdGlvblxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gX2Vycm9yTnVtYmVyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gX2RldGFpbFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhfZXJyb3JOdW1iZXIsIF9kZXRhaWwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdUaGUgZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdmFsdWUgZm9yIHRoZSBzcGVjaWZpYyBlbGVtZW50LlxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0Q01JVmFsdWUoX0NNSUVsZW1lbnQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBnZXRDTUlWYWx1ZSBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgZm9yIHRoZSBzcGVjaWZpYyBlbGVtZW50LlxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfQ01JRWxlbWVudFxuICAgKiBAcGFyYW0ge2FueX0gX3ZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBzZXRDTUlWYWx1ZShfQ01JRWxlbWVudCwgX3ZhbHVlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgc2V0Q01JVmFsdWUgbWV0aG9kIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNoYXJlZCBBUEkgbWV0aG9kIHRvIHNldCBhIHZhbGlkIGZvciBhIGdpdmVuIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2Nvcm0yMDA0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgX2NvbW1vblNldENNSVZhbHVlKFxuICAgICAgbWV0aG9kTmFtZTogU3RyaW5nLCBzY29ybTIwMDQ6IGJvb2xlYW4sIENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgaWYgKCFDTUlFbGVtZW50IHx8IENNSUVsZW1lbnQgPT09ICcnKSB7XG4gICAgICByZXR1cm4gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcbiAgICB9XG5cbiAgICBjb25zdCBzdHJ1Y3R1cmUgPSBDTUlFbGVtZW50LnNwbGl0KCcuJyk7XG4gICAgbGV0IHJlZk9iamVjdCA9IHRoaXM7XG4gICAgbGV0IHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcbiAgICBsZXQgZm91bmRGaXJzdEluZGV4ID0gZmFsc2U7XG5cbiAgICBjb25zdCBpbnZhbGlkRXJyb3JNZXNzYWdlID0gYFRoZSBkYXRhIG1vZGVsIGVsZW1lbnQgcGFzc2VkIHRvICR7bWV0aG9kTmFtZX0gKCR7Q01JRWxlbWVudH0pIGlzIG5vdCBhIHZhbGlkIFNDT1JNIGRhdGEgbW9kZWwgZWxlbWVudC5gO1xuICAgIGNvbnN0IGludmFsaWRFcnJvckNvZGUgPSBzY29ybTIwMDQgP1xuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5VTkRFRklORURfREFUQV9NT0RFTCA6XG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLkdFTkVSQUw7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0cnVjdHVyZS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYXR0cmlidXRlID0gc3RydWN0dXJlW2ldO1xuXG4gICAgICBpZiAoaSA9PT0gc3RydWN0dXJlLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgaWYgKHNjb3JtMjAwNCAmJiAoYXR0cmlidXRlLnN1YnN0cigwLCA4KSA9PT0gJ3t0YXJnZXQ9JykgJiZcbiAgICAgICAgICAgICh0eXBlb2YgcmVmT2JqZWN0Ll9pc1RhcmdldFZhbGlkID09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQpO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9jaGVja09iamVjdEhhc1Byb3BlcnR5KHJlZk9iamVjdCwgYXR0cmlidXRlKSkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ1xcXFwuY29ycmVjdF9yZXNwb25zZXNcXFxcLlxcXFxkKycpKSB7XG4gICAgICAgICAgICB0aGlzLnZhbGlkYXRlQ29ycmVjdFJlc3BvbnNlKENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXNjb3JtMjAwNCB8fCB0aGlzLmxhc3RFcnJvckNvZGUgPT09IDApIHtcbiAgICAgICAgICAgIHJlZk9iamVjdFthdHRyaWJ1dGVdID0gdmFsdWU7XG4gICAgICAgICAgICByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZk9iamVjdCA9IHJlZk9iamVjdFthdHRyaWJ1dGVdO1xuICAgICAgICBpZiAoIXJlZk9iamVjdCkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlZk9iamVjdCBpbnN0YW5jZW9mIENNSUFycmF5KSB7XG4gICAgICAgICAgY29uc3QgaW5kZXggPSBwYXJzZUludChzdHJ1Y3R1cmVbaSArIDFdLCAxMCk7XG5cbiAgICAgICAgICAvLyBTQ08gaXMgdHJ5aW5nIHRvIHNldCBhbiBpdGVtIG9uIGFuIGFycmF5XG4gICAgICAgICAgaWYgKCFpc05hTihpbmRleCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSByZWZPYmplY3QuY2hpbGRBcnJheVtpbmRleF07XG5cbiAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgIHJlZk9iamVjdCA9IGl0ZW07XG4gICAgICAgICAgICAgIGZvdW5kRmlyc3RJbmRleCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zdCBuZXdDaGlsZCA9IHRoaXMuZ2V0Q2hpbGRFbGVtZW50KENNSUVsZW1lbnQsIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgZm91bmRGaXJzdEluZGV4KTtcbiAgICAgICAgICAgICAgZm91bmRGaXJzdEluZGV4ID0gdHJ1ZTtcblxuICAgICAgICAgICAgICBpZiAoIW5ld0NoaWxkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoaW52YWxpZEVycm9yQ29kZSwgaW52YWxpZEVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlZk9iamVjdC5pbml0aWFsaXplZCkgbmV3Q2hpbGQuaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgICAgICAgICAgcmVmT2JqZWN0LmNoaWxkQXJyYXkucHVzaChuZXdDaGlsZCk7XG4gICAgICAgICAgICAgICAgcmVmT2JqZWN0ID0gbmV3Q2hpbGQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSGF2ZSB0byB1cGRhdGUgaSB2YWx1ZSB0byBza2lwIHRoZSBhcnJheSBwb3NpdGlvblxuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyZXR1cm5WYWx1ZSA9PT0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRSkge1xuICAgICAgdGhpcy5hcGlMb2cobWV0aG9kTmFtZSwgbnVsbCxcbiAgICAgICAgICBgVGhlcmUgd2FzIGFuIGVycm9yIHNldHRpbmcgdGhlIHZhbHVlIGZvcjogJHtDTUlFbGVtZW50fSwgdmFsdWUgb2Y6ICR7dmFsdWV9YCxcbiAgICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9XQVJOSU5HKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQWJzdHJhY3QgbWV0aG9kIGZvciB2YWxpZGF0aW5nIHRoYXQgYSByZXNwb25zZSBpcyBjb3JyZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX0NNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSBfdmFsdWVcbiAgICovXG4gIHZhbGlkYXRlQ29ycmVjdFJlc3BvbnNlKF9DTUlFbGVtZW50LCBfdmFsdWUpIHtcbiAgICAvLyBqdXN0IGEgc3R1YiBtZXRob2RcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIG9yIGJ1aWxkcyBhIG5ldyBjaGlsZCBlbGVtZW50IHRvIGFkZCB0byB0aGUgYXJyYXkuXG4gICAqIEFQSXMgdGhhdCBpbmhlcml0IEJhc2VBUEkgc2hvdWxkIG92ZXJyaWRlIHRoaXMgbWV0aG9kLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX0NNSUVsZW1lbnQgLSB1bnVzZWRcbiAgICogQHBhcmFtIHsqfSBfdmFsdWUgLSB1bnVzZWRcbiAgICogQHBhcmFtIHtib29sZWFufSBfZm91bmRGaXJzdEluZGV4IC0gdW51c2VkXG4gICAqIEByZXR1cm4geyp9XG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0Q2hpbGRFbGVtZW50KF9DTUlFbGVtZW50LCBfdmFsdWUsIF9mb3VuZEZpcnN0SW5kZXgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBnZXRDaGlsZEVsZW1lbnQgbWV0aG9kIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSB2YWx1ZSBmcm9tIHRoZSBDTUkgT2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2Nvcm0yMDA0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBfY29tbW9uR2V0Q01JVmFsdWUobWV0aG9kTmFtZTogU3RyaW5nLCBzY29ybTIwMDQ6IGJvb2xlYW4sIENNSUVsZW1lbnQpIHtcbiAgICBpZiAoIUNNSUVsZW1lbnQgfHwgQ01JRWxlbWVudCA9PT0gJycpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBjb25zdCBzdHJ1Y3R1cmUgPSBDTUlFbGVtZW50LnNwbGl0KCcuJyk7XG4gICAgbGV0IHJlZk9iamVjdCA9IHRoaXM7XG4gICAgbGV0IGF0dHJpYnV0ZSA9IG51bGw7XG5cbiAgICBjb25zdCB1bmluaXRpYWxpemVkRXJyb3JNZXNzYWdlID0gYFRoZSBkYXRhIG1vZGVsIGVsZW1lbnQgcGFzc2VkIHRvICR7bWV0aG9kTmFtZX0gKCR7Q01JRWxlbWVudH0pIGhhcyBub3QgYmVlbiBpbml0aWFsaXplZC5gO1xuICAgIGNvbnN0IGludmFsaWRFcnJvck1lc3NhZ2UgPSBgVGhlIGRhdGEgbW9kZWwgZWxlbWVudCBwYXNzZWQgdG8gJHttZXRob2ROYW1lfSAoJHtDTUlFbGVtZW50fSkgaXMgbm90IGEgdmFsaWQgU0NPUk0gZGF0YSBtb2RlbCBlbGVtZW50LmA7XG4gICAgY29uc3QgaW52YWxpZEVycm9yQ29kZSA9IHNjb3JtMjAwNCA/XG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlVOREVGSU5FRF9EQVRBX01PREVMIDpcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuR0VORVJBTDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RydWN0dXJlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhdHRyaWJ1dGUgPSBzdHJ1Y3R1cmVbaV07XG5cbiAgICAgIGlmICghc2Nvcm0yMDA0KSB7XG4gICAgICAgIGlmIChpID09PSBzdHJ1Y3R1cmUubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGlmICghdGhpcy5fY2hlY2tPYmplY3RIYXNQcm9wZXJ0eShyZWZPYmplY3QsIGF0dHJpYnV0ZSkpIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKChTdHJpbmcoYXR0cmlidXRlKS5zdWJzdHIoMCwgOCkgPT09ICd7dGFyZ2V0PScpICYmXG4gICAgICAgICAgICAodHlwZW9mIHJlZk9iamVjdC5faXNUYXJnZXRWYWxpZCA9PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIGNvbnN0IHRhcmdldCA9IFN0cmluZyhhdHRyaWJ1dGUpLlxuICAgICAgICAgICAgICBzdWJzdHIoOCwgU3RyaW5nKGF0dHJpYnV0ZSkubGVuZ3RoIC0gOSk7XG4gICAgICAgICAgcmV0dXJuIHJlZk9iamVjdC5faXNUYXJnZXRWYWxpZCh0YXJnZXQpO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9jaGVja09iamVjdEhhc1Byb3BlcnR5KHJlZk9iamVjdCwgYXR0cmlidXRlKSkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZWZPYmplY3QgPSByZWZPYmplY3RbYXR0cmlidXRlXTtcbiAgICAgIGlmIChyZWZPYmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihpbnZhbGlkRXJyb3JDb2RlLCBpbnZhbGlkRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWZPYmplY3QgaW5zdGFuY2VvZiBDTUlBcnJheSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KHN0cnVjdHVyZVtpICsgMV0sIDEwKTtcblxuICAgICAgICAvLyBTQ08gaXMgdHJ5aW5nIHRvIHNldCBhbiBpdGVtIG9uIGFuIGFycmF5XG4gICAgICAgIGlmICghaXNOYU4oaW5kZXgpKSB7XG4gICAgICAgICAgY29uc3QgaXRlbSA9IHJlZk9iamVjdC5jaGlsZEFycmF5W2luZGV4XTtcblxuICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICByZWZPYmplY3QgPSBpdGVtO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5WQUxVRV9OT1RfSU5JVElBTElaRUQsXG4gICAgICAgICAgICAgICAgdW5pbml0aWFsaXplZEVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBIYXZlIHRvIHVwZGF0ZSBpIHZhbHVlIHRvIHNraXAgdGhlIGFycmF5IHBvc2l0aW9uXG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJlZk9iamVjdCA9PT0gbnVsbCB8fCByZWZPYmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKCFzY29ybTIwMDQpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZSA9PT0gJ19jaGlsZHJlbicpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTEyX2Vycm9yX2NvZGVzLkNISUxEUkVOX0VSUk9SKTtcbiAgICAgICAgfSBlbHNlIGlmIChhdHRyaWJ1dGUgPT09ICdfY291bnQnKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0xMl9lcnJvcl9jb2Rlcy5DT1VOVF9FUlJPUik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlZk9iamVjdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBBUEkncyBjdXJyZW50IHN0YXRlIGlzIFNUQVRFX0lOSVRJQUxJWkVEXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBpc0luaXRpYWxpemVkKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9PT0gZ2xvYmFsX2NvbnN0YW50cy5TVEFURV9JTklUSUFMSVpFRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIEFQSSdzIGN1cnJlbnQgc3RhdGUgaXMgU1RBVEVfTk9UX0lOSVRJQUxJWkVEXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBpc05vdEluaXRpYWxpemVkKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9PT0gZ2xvYmFsX2NvbnN0YW50cy5TVEFURV9OT1RfSU5JVElBTElaRUQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBBUEkncyBjdXJyZW50IHN0YXRlIGlzIFNUQVRFX1RFUk1JTkFURURcbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGlzVGVybWluYXRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUgPT09IGdsb2JhbF9jb25zdGFudHMuU1RBVEVfVEVSTUlOQVRFRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBhIG1lY2hhbmlzbSBmb3IgYXR0YWNoaW5nIHRvIGEgc3BlY2lmaWMgU0NPUk0gZXZlbnRcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxpc3RlbmVyTmFtZVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb24obGlzdGVuZXJOYW1lOiBTdHJpbmcsIGNhbGxiYWNrOiBmdW5jdGlvbikge1xuICAgIGlmICghY2FsbGJhY2spIHJldHVybjtcblxuICAgIGNvbnN0IGxpc3RlbmVyRnVuY3Rpb25zID0gbGlzdGVuZXJOYW1lLnNwbGl0KCcgJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0ZW5lckZ1bmN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbGlzdGVuZXJTcGxpdCA9IGxpc3RlbmVyRnVuY3Rpb25zW2ldLnNwbGl0KCcuJyk7XG4gICAgICBpZiAobGlzdGVuZXJTcGxpdC5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgICAgY29uc3QgZnVuY3Rpb25OYW1lID0gbGlzdGVuZXJTcGxpdFswXTtcblxuICAgICAgbGV0IENNSUVsZW1lbnQgPSBudWxsO1xuICAgICAgaWYgKGxpc3RlbmVyU3BsaXQubGVuZ3RoID4gMSkge1xuICAgICAgICBDTUlFbGVtZW50ID0gbGlzdGVuZXJOYW1lLnJlcGxhY2UoZnVuY3Rpb25OYW1lICsgJy4nLCAnJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGlzdGVuZXJBcnJheS5wdXNoKHtcbiAgICAgICAgZnVuY3Rpb25OYW1lOiBmdW5jdGlvbk5hbWUsXG4gICAgICAgIENNSUVsZW1lbnQ6IENNSUVsZW1lbnQsXG4gICAgICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9jZXNzZXMgYW55ICdvbicgbGlzdGVuZXJzIHRoYXQgaGF2ZSBiZWVuIGNyZWF0ZWRcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZ1bmN0aW9uTmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqL1xuICBwcm9jZXNzTGlzdGVuZXJzKGZ1bmN0aW9uTmFtZTogU3RyaW5nLCBDTUlFbGVtZW50OiBTdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLmFwaUxvZyhmdW5jdGlvbk5hbWUsIENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGlzdGVuZXJBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVyQXJyYXlbaV07XG4gICAgICBjb25zdCBmdW5jdGlvbnNNYXRjaCA9IGxpc3RlbmVyLmZ1bmN0aW9uTmFtZSA9PT0gZnVuY3Rpb25OYW1lO1xuICAgICAgY29uc3QgbGlzdGVuZXJIYXNDTUlFbGVtZW50ID0gISFsaXN0ZW5lci5DTUlFbGVtZW50O1xuICAgICAgbGV0IENNSUVsZW1lbnRzTWF0Y2ggPSBmYWxzZTtcbiAgICAgIGlmIChDTUlFbGVtZW50ICYmIGxpc3RlbmVyLkNNSUVsZW1lbnQgJiZcbiAgICAgICAgICBsaXN0ZW5lci5DTUlFbGVtZW50LnN1YnN0cmluZyhsaXN0ZW5lci5DTUlFbGVtZW50Lmxlbmd0aCAtIDEpID09PVxuICAgICAgICAgICcqJykge1xuICAgICAgICBDTUlFbGVtZW50c01hdGNoID0gQ01JRWxlbWVudC5pbmRleE9mKGxpc3RlbmVyLkNNSUVsZW1lbnQuc3Vic3RyaW5nKDAsXG4gICAgICAgICAgICBsaXN0ZW5lci5DTUlFbGVtZW50Lmxlbmd0aCAtIDEpKSA9PT0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIENNSUVsZW1lbnRzTWF0Y2ggPSBsaXN0ZW5lci5DTUlFbGVtZW50ID09PSBDTUlFbGVtZW50O1xuICAgICAgfVxuXG4gICAgICBpZiAoZnVuY3Rpb25zTWF0Y2ggJiYgKCFsaXN0ZW5lckhhc0NNSUVsZW1lbnQgfHwgQ01JRWxlbWVudHNNYXRjaCkpIHtcbiAgICAgICAgbGlzdGVuZXIuY2FsbGJhY2soQ01JRWxlbWVudCwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaHJvd3MgYSBTQ09STSBlcnJvclxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gZXJyb3JOdW1iZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VcbiAgICovXG4gIHRocm93U0NPUk1FcnJvcihlcnJvck51bWJlcjogbnVtYmVyLCBtZXNzYWdlOiBTdHJpbmcpIHtcbiAgICBpZiAoIW1lc3NhZ2UpIHtcbiAgICAgIG1lc3NhZ2UgPSB0aGlzLmdldExtc0Vycm9yTWVzc2FnZURldGFpbHMoZXJyb3JOdW1iZXIpO1xuICAgIH1cblxuICAgIHRoaXMuYXBpTG9nKCd0aHJvd1NDT1JNRXJyb3InLCBudWxsLCBlcnJvck51bWJlciArICc6ICcgKyBtZXNzYWdlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9FUlJPUik7XG5cbiAgICB0aGlzLmxhc3RFcnJvckNvZGUgPSBTdHJpbmcoZXJyb3JOdW1iZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyB0aGUgbGFzdCBTQ09STSBlcnJvciBjb2RlIG9uIHN1Y2Nlc3MuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdWNjZXNzXG4gICAqL1xuICBjbGVhclNDT1JNRXJyb3Ioc3VjY2VzczogU3RyaW5nKSB7XG4gICAgaWYgKHN1Y2Nlc3MgIT09IHVuZGVmaW5lZCAmJiBzdWNjZXNzICE9PSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFKSB7XG4gICAgICB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0cyB0byBzdG9yZSB0aGUgZGF0YSB0byB0aGUgTE1TLCBsb2dzIGRhdGEgaWYgbm8gTE1TIGNvbmZpZ3VyZWRcbiAgICogQVBJcyB0aGF0IGluaGVyaXQgQmFzZUFQSSBzaG91bGQgb3ZlcnJpZGUgdGhpcyBmdW5jdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IF9jYWxjdWxhdGVUb3RhbFRpbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHN0b3JlRGF0YShfY2FsY3VsYXRlVG90YWxUaW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIHN0b3JlRGF0YSBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZCB0aGUgQ01JIGZyb20gYSBmbGF0dGVuZWQgSlNPTiBvYmplY3RcbiAgICogQHBhcmFtIHtvYmplY3R9IGpzb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICovXG4gIGxvYWRGcm9tRmxhdHRlbmVkSlNPTihqc29uLCBDTUlFbGVtZW50KSB7XG4gICAgaWYgKCF0aGlzLmlzTm90SW5pdGlhbGl6ZWQoKSkge1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAnbG9hZEZyb21GbGF0dGVuZWRKU09OIGNhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgdGhlIGNhbGwgdG8gbG1zSW5pdGlhbGl6ZS4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBPYmplY3Qua2V5cyhqc29uKS5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gW1N0cmluZyhrZXkpLCBqc29uW2tleV1dO1xuICAgIH0pO1xuXG4gICAgLy8gQ01JIGludGVyYWN0aW9ucyBuZWVkIHRvIGhhdmUgaWQgYW5kIHR5cGUgbG9hZGVkIGJlZm9yZSBhbnkgb3RoZXIgZmllbGRzXG4gICAgcmVzdWx0LnNvcnQoZnVuY3Rpb24oW2EsIGJdLCBbYywgZF0pIHtcbiAgICAgIC8qKlxuICAgICAgICogVGVzdCBtYXRjaCBwYXR0ZXJuLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gY1xuICAgICAgICogQHBhcmFtIHtSZWdFeHB9IGFfcGF0dGVyblxuICAgICAgICogQHBhcmFtIHtSZWdFeHB9IGNfcGF0dGVyblxuICAgICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiB0ZXN0UGF0dGVybihhLCBjLCBhX3BhdHRlcm4sIGNfcGF0dGVybikge1xuICAgICAgICBpZiAoYS5tYXRjaChhX3BhdHRlcm4pICYmIGMubWF0Y2goY19wYXR0ZXJuKSkge1xuICAgICAgICAgIGlmIChOdW1iZXIoYS5tYXRjaChhX3BhdHRlcm4pWzFdKSA8XG4gICAgICAgICAgICAgIE51bWJlcihjLm1hdGNoKGNfcGF0dGVybilbMV0pKSByZXR1cm4gLTE7XG4gICAgICAgICAgaWYgKE51bWJlcihhLm1hdGNoKGFfcGF0dGVybilbMV0pID5cbiAgICAgICAgICAgICAgTnVtYmVyKGMubWF0Y2goY19wYXR0ZXJuKVsxXSkpIHJldHVybiAxO1xuICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfSBlbHNlIGlmIChhLm1hdGNoKGNfcGF0dGVybikgJiYgYy5tYXRjaChhX3BhdHRlcm4pKSB7XG4gICAgICAgICAgaWYgKE51bWJlcihhLm1hdGNoKGNfcGF0dGVybilbMV0pIDxcbiAgICAgICAgICAgICAgTnVtYmVyKGMubWF0Y2goYV9wYXR0ZXJuKVsxXSkpIHJldHVybiAtMTtcbiAgICAgICAgICBpZiAoTnVtYmVyKGEubWF0Y2goY19wYXR0ZXJuKVsxXSkgPlxuICAgICAgICAgICAgICBOdW1iZXIoYy5tYXRjaChhX3BhdHRlcm4pWzFdKSkgcmV0dXJuIDE7XG4gICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlkX3BhdHRlcm4gPSAvXmNtaVxcLmludGVyYWN0aW9uc1xcLihcXGQrKVxcLmlkJC87XG4gICAgICBjb25zdCB0eXBlX3BhdHRlcm4gPSAvXmNtaVxcLmludGVyYWN0aW9uc1xcLihcXGQrKVxcLnR5cGUkLztcbiAgICAgIGNvbnN0IHBhdHRlcm4gPSAvXmNtaVxcLmludGVyYWN0aW9uc1xcLihcXGQrKS87XG5cbiAgICAgIGxldCBpZF90ZXN0ID0gdGVzdFBhdHRlcm4oYSwgYywgaWRfcGF0dGVybiwgcGF0dGVybik7XG4gICAgICBpZiAoaWRfdGVzdCAhPT0gMCkge1xuICAgICAgICByZXR1cm4gaWRfdGVzdDtcbiAgICAgIH1cbiAgICAgIGlkX3Rlc3QgPSB0ZXN0UGF0dGVybihhLCBjLCB0eXBlX3BhdHRlcm4sIHBhdHRlcm4pO1xuICAgICAgaWYgKGlkX3Rlc3QgIT09IDApIHtcbiAgICAgICAgcmV0dXJuIGlkX3Rlc3Q7XG4gICAgICB9XG5cbiAgICAgIGlmIChhIDwgYykgcmV0dXJuIC0xO1xuICAgICAgaWYgKGEgPiBjKSByZXR1cm4gMTtcbiAgICAgIHJldHVybiAwO1xuICAgIH0pO1xuXG4gICAgbGV0IG9iajtcbiAgICByZXN1bHQuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgb2JqID0ge307XG4gICAgICBvYmpbZWxlbWVudFswXV0gPSBlbGVtZW50WzFdO1xuICAgICAgdGhpcy5sb2FkRnJvbUpTT04odW5mbGF0dGVuKG9iaiksIENNSUVsZW1lbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIENNSSBkYXRhIGZyb20gYSBKU09OIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGpzb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICovXG4gIGxvYWRGcm9tSlNPTihqc29uLCBDTUlFbGVtZW50KSB7XG4gICAgaWYgKCF0aGlzLmlzTm90SW5pdGlhbGl6ZWQoKSkge1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAnbG9hZEZyb21KU09OIGNhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgdGhlIGNhbGwgdG8gbG1zSW5pdGlhbGl6ZS4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBDTUlFbGVtZW50ID0gQ01JRWxlbWVudCAhPT0gdW5kZWZpbmVkID8gQ01JRWxlbWVudCA6ICdjbWknO1xuXG4gICAgdGhpcy5zdGFydGluZ0RhdGEgPSBqc29uO1xuXG4gICAgLy8gY291bGQgdGhpcyBiZSByZWZhY3RvcmVkIGRvd24gdG8gZmxhdHRlbihqc29uKSB0aGVuIHNldENNSVZhbHVlIG9uIGVhY2g/XG4gICAgZm9yIChjb25zdCBrZXkgaW4ganNvbikge1xuICAgICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoanNvbiwga2V5KSAmJiBqc29uW2tleV0pIHtcbiAgICAgICAgY29uc3QgY3VycmVudENNSUVsZW1lbnQgPSAoQ01JRWxlbWVudCA/IENNSUVsZW1lbnQgKyAnLicgOiAnJykgKyBrZXk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0ganNvbltrZXldO1xuXG4gICAgICAgIGlmICh2YWx1ZVsnY2hpbGRBcnJheSddKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZVsnY2hpbGRBcnJheSddLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRGcm9tSlNPTih2YWx1ZVsnY2hpbGRBcnJheSddW2ldLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRDTUlFbGVtZW50ICsgJy4nICsgaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcbiAgICAgICAgICB0aGlzLmxvYWRGcm9tSlNPTih2YWx1ZSwgY3VycmVudENNSUVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0Q01JVmFsdWUoY3VycmVudENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIENNSSBvYmplY3QgdG8gSlNPTiBmb3Igc2VuZGluZyB0byBhbiBMTVMuXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHJlbmRlckNNSVRvSlNPTlN0cmluZygpIHtcbiAgICBjb25zdCBjbWkgPSB0aGlzLmNtaTtcbiAgICAvLyBEbyB3ZSB3YW50L25lZWQgdG8gcmV0dXJuIGZpZWxkcyB0aGF0IGhhdmUgbm8gc2V0IHZhbHVlP1xuICAgIC8vIHJldHVybiBKU09OLnN0cmluZ2lmeSh7IGNtaSB9LCAoaywgdikgPT4gdiA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IHYsIDIpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh7Y21pfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIEpTIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGN1cnJlbnQgY21pXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIHJlbmRlckNNSVRvSlNPTk9iamVjdCgpIHtcbiAgICAvLyBEbyB3ZSB3YW50L25lZWQgdG8gcmV0dXJuIGZpZWxkcyB0aGF0IGhhdmUgbm8gc2V0IHZhbHVlP1xuICAgIC8vIHJldHVybiBKU09OLnN0cmluZ2lmeSh7IGNtaSB9LCAoaywgdikgPT4gdiA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IHYsIDIpO1xuICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMucmVuZGVyQ01JVG9KU09OU3RyaW5nKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgY21pIG9iamVjdCB0byB0aGUgcHJvcGVyIGZvcm1hdCBmb3IgTE1TIGNvbW1pdFxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gX3Rlcm1pbmF0ZUNvbW1pdFxuICAgKiBAcmV0dXJuIHsqfVxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHJlbmRlckNvbW1pdENNSShfdGVybWluYXRlQ29tbWl0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIHN0b3JlRGF0YSBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCB0aGUgcmVxdWVzdCB0byB0aGUgTE1TXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHtvYmplY3R8QXJyYXl9IHBhcmFtc1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGltbWVkaWF0ZVxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBwcm9jZXNzSHR0cFJlcXVlc3QodXJsOiBTdHJpbmcsIHBhcmFtcywgaW1tZWRpYXRlID0gZmFsc2UpIHtcbiAgICBjb25zdCBwcm9jZXNzID0gZnVuY3Rpb24odXJsLCBwYXJhbXMsIHNldHRpbmdzLCBlcnJvcl9jb2Rlcykge1xuICAgICAgY29uc3QgZ2VuZXJpY0Vycm9yID0ge1xuICAgICAgICAncmVzdWx0JzogZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRSxcbiAgICAgICAgJ2Vycm9yQ29kZSc6IGVycm9yX2NvZGVzLkdFTkVSQUwsXG4gICAgICB9O1xuXG4gICAgICBsZXQgcmVzdWx0O1xuICAgICAgaWYgKCFzZXR0aW5ncy5zZW5kQmVhY29uQ29tbWl0KSB7XG4gICAgICAgIGNvbnN0IGh0dHBSZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgaHR0cFJlcS5vcGVuKCdQT1NUJywgdXJsLCBzZXR0aW5ncy5hc3luY0NvbW1pdCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHBhcmFtcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBodHRwUmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsXG4gICAgICAgICAgICAgICAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xuICAgICAgICAgICAgaHR0cFJlcS5zZW5kKHBhcmFtcy5qb2luKCcmJykpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBodHRwUmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MuY29tbWl0UmVxdWVzdERhdGFUeXBlKTtcbiAgICAgICAgICAgIGh0dHBSZXEuc2VuZChKU09OLnN0cmluZ2lmeShwYXJhbXMpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIHNldHRpbmdzLnJlc3BvbnNlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmVzdWx0ID0gc2V0dGluZ3MucmVzcG9uc2VIYW5kbGVyKGh0dHBSZXEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKGh0dHBSZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIHJldHVybiBnZW5lcmljRXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgaGVhZGVycyA9IHtcbiAgICAgICAgICAgIHR5cGU6IHNldHRpbmdzLmNvbW1pdFJlcXVlc3REYXRhVHlwZSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGxldCBibG9iO1xuICAgICAgICAgIGlmIChwYXJhbXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgYmxvYiA9IG5ldyBCbG9iKFtwYXJhbXMuam9pbignJicpXSwgaGVhZGVycyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJsb2IgPSBuZXcgQmxvYihbSlNPTi5zdHJpbmdpZnkocGFyYW1zKV0sIGhlYWRlcnMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc3VsdCA9IHt9O1xuICAgICAgICAgIGlmIChuYXZpZ2F0b3Iuc2VuZEJlYWNvbih1cmwsIGJsb2IpKSB7XG4gICAgICAgICAgICByZXN1bHQucmVzdWx0ID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IDA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdC5yZXN1bHQgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICAgICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IDEwMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIHJldHVybiBnZW5lcmljRXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBnZW5lcmljRXJyb3I7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgZGVib3VuY2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCBkZWJvdW5jZWQgPSBkZWJvdW5jZShwcm9jZXNzLCA1MDApO1xuICAgICAgZGVib3VuY2VkKHVybCwgcGFyYW1zLCB0aGlzLnNldHRpbmdzLCB0aGlzLmVycm9yX2NvZGVzKTtcblxuICAgICAgLy8gaWYgd2UncmUgdGVybWluYXRpbmcsIGdvIGFoZWFkIGFuZCBjb21taXQgaW1tZWRpYXRlbHlcbiAgICAgIGlmIChpbW1lZGlhdGUpIHtcbiAgICAgICAgZGVib3VuY2VkLmZsdXNoKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlc3VsdDogZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFLFxuICAgICAgICBlcnJvckNvZGU6IDAsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcHJvY2Vzcyh1cmwsIHBhcmFtcywgdGhpcy5zZXR0aW5ncywgdGhpcy5lcnJvcl9jb2Rlcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRocm93cyBhIFNDT1JNIGVycm9yXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aGVuIC0gdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gd2FpdCBiZWZvcmUgY29tbWl0dGluZ1xuICAgKi9cbiAgc2NoZWR1bGVDb21taXQod2hlbjogbnVtYmVyKSB7XG4gICAgdGhpcy4jdGltZW91dCA9IG5ldyBTY2hlZHVsZWRDb21taXQodGhpcywgd2hlbik7XG4gICAgdGhpcy5hcGlMb2coJ3NjaGVkdWxlQ29tbWl0JywgJycsICdzY2hlZHVsZWQnLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9ERUJVRyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIGFuZCBjYW5jZWxzIGFueSBjdXJyZW50bHkgc2NoZWR1bGVkIGNvbW1pdHNcbiAgICovXG4gIGNsZWFyU2NoZWR1bGVkQ29tbWl0KCkge1xuICAgIGlmICh0aGlzLiN0aW1lb3V0KSB7XG4gICAgICB0aGlzLiN0aW1lb3V0LmNhbmNlbCgpO1xuICAgICAgdGhpcy4jdGltZW91dCA9IG51bGw7XG4gICAgICB0aGlzLmFwaUxvZygnY2xlYXJTY2hlZHVsZWRDb21taXQnLCAnJywgJ2NsZWFyZWQnLFxuICAgICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0RFQlVHKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBQcml2YXRlIGNsYXNzIHRoYXQgd3JhcHMgYSB0aW1lb3V0IGNhbGwgdG8gdGhlIGNvbW1pdCgpIGZ1bmN0aW9uXG4gKi9cbmNsYXNzIFNjaGVkdWxlZENvbW1pdCB7XG4gICNBUEk7XG4gICNjYW5jZWxsZWQgPSBmYWxzZTtcbiAgI3RpbWVvdXQ7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBTY2hlZHVsZWRDb21taXRcbiAgICogQHBhcmFtIHtCYXNlQVBJfSBBUElcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdoZW5cbiAgICovXG4gIGNvbnN0cnVjdG9yKEFQSTogYW55LCB3aGVuOiBudW1iZXIpIHtcbiAgICB0aGlzLiNBUEkgPSBBUEk7XG4gICAgdGhpcy4jdGltZW91dCA9IHNldFRpbWVvdXQodGhpcy53cmFwcGVyLmJpbmQodGhpcyksIHdoZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbmNlbCBhbnkgY3VycmVudGx5IHNjaGVkdWxlZCBjb21taXRcbiAgICovXG4gIGNhbmNlbCgpIHtcbiAgICB0aGlzLiNjYW5jZWxsZWQgPSB0cnVlO1xuICAgIGlmICh0aGlzLiN0aW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy4jdGltZW91dCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdyYXAgdGhlIEFQSSBjb21taXQgY2FsbCB0byBjaGVjayBpZiB0aGUgY2FsbCBoYXMgYWxyZWFkeSBiZWVuIGNhbmNlbGxlZFxuICAgKi9cbiAgd3JhcHBlcigpIHtcbiAgICBpZiAoIXRoaXMuI2NhbmNlbGxlZCkge1xuICAgICAgdGhpcy4jQVBJLmNvbW1pdCgpO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCBCYXNlQVBJIGZyb20gJy4vQmFzZUFQSSc7XG5pbXBvcnQge1xuICBDTUksXG4gIENNSUludGVyYWN0aW9uc0NvcnJlY3RSZXNwb25zZXNPYmplY3QsXG4gIENNSUludGVyYWN0aW9uc09iamVjdCxcbiAgQ01JSW50ZXJhY3Rpb25zT2JqZWN0aXZlc09iamVjdCxcbiAgQ01JT2JqZWN0aXZlc09iamVjdCwgTkFWLFxufSBmcm9tICcuL2NtaS9zY29ybTEyX2NtaSc7XG5pbXBvcnQgKiBhcyBVdGlsaXRpZXMgZnJvbSAnLi91dGlsaXRpZXMnO1xuaW1wb3J0IEFQSUNvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCBFcnJvckNvZGVzIGZyb20gJy4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcblxuY29uc3Qgc2Nvcm0xMl9jb25zdGFudHMgPSBBUElDb25zdGFudHMuc2Nvcm0xMjtcbmNvbnN0IGdsb2JhbF9jb25zdGFudHMgPSBBUElDb25zdGFudHMuZ2xvYmFsO1xuY29uc3Qgc2Nvcm0xMl9lcnJvcl9jb2RlcyA9IEVycm9yQ29kZXMuc2Nvcm0xMjtcblxuLyoqXG4gKiBBUEkgY2xhc3MgZm9yIFNDT1JNIDEuMlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY29ybTEyQVBJIGV4dGVuZHMgQmFzZUFQSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgU0NPUk0gMS4yIEFQSVxuICAgKiBAcGFyYW0ge29iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiB7fSkge1xuICAgIGNvbnN0IGZpbmFsU2V0dGluZ3MgPSB7XG4gICAgICAuLi57XG4gICAgICAgIG1hc3Rlcnlfb3ZlcnJpZGU6IGZhbHNlLFxuICAgICAgfSwgLi4uc2V0dGluZ3MsXG4gICAgfTtcblxuICAgIHN1cGVyKHNjb3JtMTJfZXJyb3JfY29kZXMsIGZpbmFsU2V0dGluZ3MpO1xuXG4gICAgdGhpcy5jbWkgPSBuZXcgQ01JKCk7XG4gICAgdGhpcy5uYXYgPSBuZXcgTkFWKCk7XG5cbiAgICAvLyBSZW5hbWUgZnVuY3Rpb25zIHRvIG1hdGNoIDEuMiBTcGVjIGFuZCBleHBvc2UgdG8gbW9kdWxlc1xuICAgIHRoaXMuTE1TSW5pdGlhbGl6ZSA9IHRoaXMubG1zSW5pdGlhbGl6ZTtcbiAgICB0aGlzLkxNU0ZpbmlzaCA9IHRoaXMubG1zRmluaXNoO1xuICAgIHRoaXMuTE1TR2V0VmFsdWUgPSB0aGlzLmxtc0dldFZhbHVlO1xuICAgIHRoaXMuTE1TU2V0VmFsdWUgPSB0aGlzLmxtc1NldFZhbHVlO1xuICAgIHRoaXMuTE1TQ29tbWl0ID0gdGhpcy5sbXNDb21taXQ7XG4gICAgdGhpcy5MTVNHZXRMYXN0RXJyb3IgPSB0aGlzLmxtc0dldExhc3RFcnJvcjtcbiAgICB0aGlzLkxNU0dldEVycm9yU3RyaW5nID0gdGhpcy5sbXNHZXRFcnJvclN0cmluZztcbiAgICB0aGlzLkxNU0dldERpYWdub3N0aWMgPSB0aGlzLmxtc0dldERpYWdub3N0aWM7XG4gIH1cblxuICAvKipcbiAgICogbG1zSW5pdGlhbGl6ZSBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgKi9cbiAgbG1zSW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLmNtaS5pbml0aWFsaXplKCk7XG4gICAgcmV0dXJuIHRoaXMuaW5pdGlhbGl6ZSgnTE1TSW5pdGlhbGl6ZScsICdMTVMgd2FzIGFscmVhZHkgaW5pdGlhbGl6ZWQhJyxcbiAgICAgICAgJ0xNUyBpcyBhbHJlYWR5IGZpbmlzaGVkIScpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU0ZpbmlzaCBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgKi9cbiAgbG1zRmluaXNoKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMudGVybWluYXRlKCdMTVNGaW5pc2gnLCB0cnVlKTtcblxuICAgIGlmIChyZXN1bHQgPT09IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRSkge1xuICAgICAgaWYgKHRoaXMubmF2LmV2ZW50ICE9PSAnJykge1xuICAgICAgICBpZiAodGhpcy5uYXYuZXZlbnQgPT09ICdjb250aW51ZScpIHtcbiAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlTmV4dCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VQcmV2aW91cycpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc2V0dGluZ3MuYXV0b1Byb2dyZXNzKSB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VOZXh0Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBMTVNHZXRWYWx1ZSBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc0dldFZhbHVlKENNSUVsZW1lbnQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRWYWx1ZSgnTE1TR2V0VmFsdWUnLCBmYWxzZSwgQ01JRWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogTE1TU2V0VmFsdWUgZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc1NldFZhbHVlKENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0VmFsdWUoJ0xNU1NldFZhbHVlJywgZmFsc2UsIENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMTVNDb21taXQgZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJvb2xcbiAgICovXG4gIGxtc0NvbW1pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb21taXQoJ0xNU0NvbW1pdCcsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMTVNHZXRMYXN0RXJyb3IgZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXRMYXN0RXJyb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TGFzdEVycm9yKCdMTVNHZXRMYXN0RXJyb3InKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMTVNHZXRFcnJvclN0cmluZyBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFcnJvckNvZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zR2V0RXJyb3JTdHJpbmcoQ01JRXJyb3JDb2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RXJyb3JTdHJpbmcoJ0xNU0dldEVycm9yU3RyaW5nJywgQ01JRXJyb3JDb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMTVNHZXREaWFnbm9zdGljIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVycm9yQ29kZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXREaWFnbm9zdGljKENNSUVycm9yQ29kZSkge1xuICAgIHJldHVybiB0aGlzLmdldERpYWdub3N0aWMoJ0xNU0dldERpYWdub3N0aWMnLCBDTUlFcnJvckNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSB2YWx1ZSBvbiB0aGUgQ01JIE9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHNldENNSVZhbHVlKENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbW1vblNldENNSVZhbHVlKCdMTVNTZXRWYWx1ZScsIGZhbHNlLCBDTUlFbGVtZW50LCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHZhbHVlIGZyb20gdGhlIENNSSBPYmplY3RcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldENNSVZhbHVlKENNSUVsZW1lbnQpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tbW9uR2V0Q01JVmFsdWUoJ2dldENNSVZhbHVlJywgZmFsc2UsIENNSUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgb3IgYnVpbGRzIGEgbmV3IGNoaWxkIGVsZW1lbnQgdG8gYWRkIHRvIHRoZSBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvdW5kRmlyc3RJbmRleFxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBnZXRDaGlsZEVsZW1lbnQoQ01JRWxlbWVudCwgdmFsdWUsIGZvdW5kRmlyc3RJbmRleCkge1xuICAgIGxldCBuZXdDaGlsZDtcblxuICAgIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ2NtaVxcXFwub2JqZWN0aXZlc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSU9iamVjdGl2ZXNPYmplY3QoKTtcbiAgICB9IGVsc2UgaWYgKGZvdW5kRmlyc3RJbmRleCAmJiB0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgJ2NtaVxcXFwuaW50ZXJhY3Rpb25zXFxcXC5cXFxcZCtcXFxcLmNvcnJlY3RfcmVzcG9uc2VzXFxcXC5cXFxcZCsnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JSW50ZXJhY3Rpb25zQ29ycmVjdFJlc3BvbnNlc09iamVjdCgpO1xuICAgIH0gZWxzZSBpZiAoZm91bmRGaXJzdEluZGV4ICYmIHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LFxuICAgICAgICAnY21pXFxcXC5pbnRlcmFjdGlvbnNcXFxcLlxcXFxkK1xcXFwub2JqZWN0aXZlc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QoKTtcbiAgICB9IGVsc2UgaWYgKCFmb3VuZEZpcnN0SW5kZXggJiZcbiAgICAgICAgdGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsICdjbWlcXFxcLmludGVyYWN0aW9uc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUludGVyYWN0aW9uc09iamVjdCgpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXdDaGlsZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZXMgQ29ycmVjdCBSZXNwb25zZSB2YWx1ZXNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgdmFsaWRhdGVDb3JyZWN0UmVzcG9uc2UoQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtZXNzYWdlIHRoYXQgY29ycmVzcG9uZHMgdG8gZXJyb3JOdW1iZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gZXJyb3JOdW1iZXJcbiAgICogQHBhcmFtIHtib29sZWFuIH1kZXRhaWxcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhlcnJvck51bWJlciwgZGV0YWlsKSB7XG4gICAgbGV0IGJhc2ljTWVzc2FnZSA9ICdObyBFcnJvcic7XG4gICAgbGV0IGRldGFpbE1lc3NhZ2UgPSAnTm8gRXJyb3InO1xuXG4gICAgLy8gU2V0IGVycm9yIG51bWJlciB0byBzdHJpbmcgc2luY2UgaW5jb25zaXN0ZW50IGZyb20gbW9kdWxlcyBpZiBzdHJpbmcgb3IgbnVtYmVyXG4gICAgZXJyb3JOdW1iZXIgPSBTdHJpbmcoZXJyb3JOdW1iZXIpO1xuICAgIGlmIChzY29ybTEyX2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbZXJyb3JOdW1iZXJdKSB7XG4gICAgICBiYXNpY01lc3NhZ2UgPSBzY29ybTEyX2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbZXJyb3JOdW1iZXJdLmJhc2ljTWVzc2FnZTtcbiAgICAgIGRldGFpbE1lc3NhZ2UgPSBzY29ybTEyX2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbZXJyb3JOdW1iZXJdLmRldGFpbE1lc3NhZ2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRldGFpbCA/IGRldGFpbE1lc3NhZ2UgOiBiYXNpY01lc3NhZ2U7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSB0aGUgd2hvbGUgQVBJIHdpdGggYW5vdGhlclxuICAgKlxuICAgKiBAcGFyYW0ge1Njb3JtMTJBUEl9IG5ld0FQSVxuICAgKi9cbiAgcmVwbGFjZVdpdGhBbm90aGVyU2Nvcm1BUEkobmV3QVBJKSB7XG4gICAgLy8gRGF0YSBNb2RlbFxuICAgIHRoaXMuY21pID0gbmV3QVBJLmNtaTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGNtaSBvYmplY3QgdG8gdGhlIHByb3BlciBmb3JtYXQgZm9yIExNUyBjb21taXRcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSB0ZXJtaW5hdGVDb21taXRcbiAgICogQHJldHVybiB7b2JqZWN0fEFycmF5fVxuICAgKi9cbiAgcmVuZGVyQ29tbWl0Q01JKHRlcm1pbmF0ZUNvbW1pdDogYm9vbGVhbikge1xuICAgIGNvbnN0IGNtaUV4cG9ydCA9IHRoaXMucmVuZGVyQ01JVG9KU09OT2JqZWN0KCk7XG5cbiAgICBpZiAodGVybWluYXRlQ29tbWl0KSB7XG4gICAgICBjbWlFeHBvcnQuY21pLmNvcmUudG90YWxfdGltZSA9IHRoaXMuY21pLmdldEN1cnJlbnRUb3RhbFRpbWUoKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICBjb25zdCBmbGF0dGVuZWQgPSBVdGlsaXRpZXMuZmxhdHRlbihjbWlFeHBvcnQpO1xuICAgIHN3aXRjaCAodGhpcy5zZXR0aW5ncy5kYXRhQ29tbWl0Rm9ybWF0KSB7XG4gICAgICBjYXNlICdmbGF0dGVuZWQnOlxuICAgICAgICByZXR1cm4gVXRpbGl0aWVzLmZsYXR0ZW4oY21pRXhwb3J0KTtcbiAgICAgIGNhc2UgJ3BhcmFtcyc6XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBpbiBmbGF0dGVuZWQpIHtcbiAgICAgICAgICBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChmbGF0dGVuZWQsIGl0ZW0pKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChgJHtpdGVtfT0ke2ZsYXR0ZW5lZFtpdGVtXX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIGNhc2UgJ2pzb24nOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGNtaUV4cG9ydDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdHMgdG8gc3RvcmUgdGhlIGRhdGEgdG8gdGhlIExNU1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHRlcm1pbmF0ZUNvbW1pdFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBzdG9yZURhdGEodGVybWluYXRlQ29tbWl0OiBib29sZWFuKSB7XG4gICAgaWYgKHRlcm1pbmF0ZUNvbW1pdCkge1xuICAgICAgY29uc3Qgb3JpZ2luYWxTdGF0dXMgPSB0aGlzLmNtaS5jb3JlLmxlc3Nvbl9zdGF0dXM7XG4gICAgICBpZiAob3JpZ2luYWxTdGF0dXMgPT09ICdub3QgYXR0ZW1wdGVkJykge1xuICAgICAgICB0aGlzLmNtaS5jb3JlLmxlc3Nvbl9zdGF0dXMgPSAnY29tcGxldGVkJztcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY21pLmNvcmUubGVzc29uX21vZGUgPT09ICdub3JtYWwnKSB7XG4gICAgICAgIGlmICh0aGlzLmNtaS5jb3JlLmNyZWRpdCA9PT0gJ2NyZWRpdCcpIHtcbiAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5tYXN0ZXJ5X292ZXJyaWRlICYmXG4gICAgICAgICAgICAgIHRoaXMuY21pLnN0dWRlbnRfZGF0YS5tYXN0ZXJ5X3Njb3JlICE9PSAnJyAmJlxuICAgICAgICAgICAgICB0aGlzLmNtaS5jb3JlLnNjb3JlLnJhdyAhPT0gJycpIHtcbiAgICAgICAgICAgIGlmIChwYXJzZUZsb2F0KHRoaXMuY21pLmNvcmUuc2NvcmUucmF3KSA+PVxuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQodGhpcy5jbWkuc3R1ZGVudF9kYXRhLm1hc3Rlcnlfc2NvcmUpKSB7XG4gICAgICAgICAgICAgIHRoaXMuY21pLmNvcmUubGVzc29uX3N0YXR1cyA9ICdwYXNzZWQnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5jbWkuY29yZS5sZXNzb25fc3RhdHVzID0gJ2ZhaWxlZCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY21pLmNvcmUubGVzc29uX21vZGUgPT09ICdicm93c2UnKSB7XG4gICAgICAgIGlmICgodGhpcy5zdGFydGluZ0RhdGE/LmNtaT8uY29yZT8ubGVzc29uX3N0YXR1cyB8fCAnJykgPT09ICcnICYmXG4gICAgICAgICAgICBvcmlnaW5hbFN0YXR1cyA9PT0gJ25vdCBhdHRlbXB0ZWQnKSB7XG4gICAgICAgICAgdGhpcy5jbWkuY29yZS5sZXNzb25fc3RhdHVzID0gJ2Jyb3dzZWQnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY29tbWl0T2JqZWN0ID0gdGhpcy5yZW5kZXJDb21taXRDTUkodGVybWluYXRlQ29tbWl0KTtcblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmxtc0NvbW1pdFVybCkge1xuICAgICAgaWYgKHRoaXMuYXBpTG9nTGV2ZWwgPT09IGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0RFQlVHKSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ0NvbW1pdCAodGVybWluYXRlZDogJyArXG4gICAgICAgICAgICAodGVybWluYXRlQ29tbWl0ID8gJ3llcycgOiAnbm8nKSArICcpOiAnKTtcbiAgICAgICAgY29uc29sZS5kZWJ1Zyhjb21taXRPYmplY3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0h0dHBSZXF1ZXN0KHRoaXMuc2V0dGluZ3MubG1zQ29tbWl0VXJsLCBjb21taXRPYmplY3QsIHRlcm1pbmF0ZUNvbW1pdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdDb21taXQgKHRlcm1pbmF0ZWQ6ICcgK1xuICAgICAgICAgICh0ZXJtaW5hdGVDb21taXQgPyAneWVzJyA6ICdubycpICsgJyk6ICcpO1xuICAgICAgY29uc29sZS5sb2coY29tbWl0T2JqZWN0KTtcbiAgICAgIHJldHVybiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUU7XG4gICAgfVxuICB9XG59XG4iLCIvLyBAZmxvd1xuaW1wb3J0IEJhc2VBUEkgZnJvbSAnLi9CYXNlQVBJJztcbmltcG9ydCB7XG4gIEFETCxcbiAgQ01JLFxuICBDTUlDb21tZW50c09iamVjdCxcbiAgQ01JSW50ZXJhY3Rpb25zQ29ycmVjdFJlc3BvbnNlc09iamVjdCxcbiAgQ01JSW50ZXJhY3Rpb25zT2JqZWN0LFxuICBDTUlJbnRlcmFjdGlvbnNPYmplY3RpdmVzT2JqZWN0LFxuICBDTUlPYmplY3RpdmVzT2JqZWN0LFxufSBmcm9tICcuL2NtaS9zY29ybTIwMDRfY21pJztcbmltcG9ydCAqIGFzIFV0aWxpdGllcyBmcm9tICcuL3V0aWxpdGllcyc7XG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IEVycm9yQ29kZXMgZnJvbSAnLi9jb25zdGFudHMvZXJyb3JfY29kZXMnO1xuaW1wb3J0IFJlc3BvbnNlcyBmcm9tICcuL2NvbnN0YW50cy9yZXNwb25zZV9jb25zdGFudHMnO1xuaW1wb3J0IFZhbGlkTGFuZ3VhZ2VzIGZyb20gJy4vY29uc3RhbnRzL2xhbmd1YWdlX2NvbnN0YW50cyc7XG5pbXBvcnQgUmVnZXggZnJvbSAnLi9jb25zdGFudHMvcmVnZXgnO1xuXG5jb25zdCBzY29ybTIwMDRfY29uc3RhbnRzID0gQVBJQ29uc3RhbnRzLnNjb3JtMjAwNDtcbmNvbnN0IGdsb2JhbF9jb25zdGFudHMgPSBBUElDb25zdGFudHMuZ2xvYmFsO1xuY29uc3Qgc2Nvcm0yMDA0X2Vycm9yX2NvZGVzID0gRXJyb3JDb2Rlcy5zY29ybTIwMDQ7XG5jb25zdCBjb3JyZWN0X3Jlc3BvbnNlcyA9IFJlc3BvbnNlcy5jb3JyZWN0O1xuY29uc3Qgc2Nvcm0yMDA0X3JlZ2V4ID0gUmVnZXguc2Nvcm0yMDA0O1xuXG4vKipcbiAqIEFQSSBjbGFzcyBmb3IgU0NPUk0gMjAwNFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY29ybTIwMDRBUEkgZXh0ZW5kcyBCYXNlQVBJIHtcbiAgI3ZlcnNpb246ICcxLjAnO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgU0NPUk0gMjAwNCBBUElcbiAgICogQHBhcmFtIHtvYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZXR0aW5nczoge30pIHtcbiAgICBjb25zdCBmaW5hbFNldHRpbmdzID0ge1xuICAgICAgLi4ue1xuICAgICAgICBtYXN0ZXJ5X292ZXJyaWRlOiBmYWxzZSxcbiAgICAgIH0sIC4uLnNldHRpbmdzLFxuICAgIH07XG5cbiAgICBzdXBlcihzY29ybTIwMDRfZXJyb3JfY29kZXMsIGZpbmFsU2V0dGluZ3MpO1xuXG4gICAgdGhpcy5jbWkgPSBuZXcgQ01JKCk7XG4gICAgdGhpcy5hZGwgPSBuZXcgQURMKCk7XG5cbiAgICAvLyBSZW5hbWUgZnVuY3Rpb25zIHRvIG1hdGNoIDIwMDQgU3BlYyBhbmQgZXhwb3NlIHRvIG1vZHVsZXNcbiAgICB0aGlzLkluaXRpYWxpemUgPSB0aGlzLmxtc0luaXRpYWxpemU7XG4gICAgdGhpcy5UZXJtaW5hdGUgPSB0aGlzLmxtc1Rlcm1pbmF0ZTtcbiAgICB0aGlzLkdldFZhbHVlID0gdGhpcy5sbXNHZXRWYWx1ZTtcbiAgICB0aGlzLlNldFZhbHVlID0gdGhpcy5sbXNTZXRWYWx1ZTtcbiAgICB0aGlzLkNvbW1pdCA9IHRoaXMubG1zQ29tbWl0O1xuICAgIHRoaXMuR2V0TGFzdEVycm9yID0gdGhpcy5sbXNHZXRMYXN0RXJyb3I7XG4gICAgdGhpcy5HZXRFcnJvclN0cmluZyA9IHRoaXMubG1zR2V0RXJyb3JTdHJpbmc7XG4gICAgdGhpcy5HZXREaWFnbm9zdGljID0gdGhpcy5sbXNHZXREaWFnbm9zdGljO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3ZlcnNpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHZlcnNpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI3ZlcnNpb247XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7c3RyaW5nfSBib29sXG4gICAqL1xuICBsbXNJbml0aWFsaXplKCkge1xuICAgIHRoaXMuY21pLmluaXRpYWxpemUoKTtcbiAgICByZXR1cm4gdGhpcy5pbml0aWFsaXplKCdJbml0aWFsaXplJyk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7c3RyaW5nfSBib29sXG4gICAqL1xuICBsbXNUZXJtaW5hdGUoKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy50ZXJtaW5hdGUoJ1Rlcm1pbmF0ZScsIHRydWUpO1xuXG4gICAgaWYgKHJlc3VsdCA9PT0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFKSB7XG4gICAgICBpZiAodGhpcy5hZGwubmF2LnJlcXVlc3QgIT09ICdfbm9uZV8nKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5hZGwubmF2LnJlcXVlc3QpIHtcbiAgICAgICAgICBjYXNlICdjb250aW51ZSc6XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlTmV4dCcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncHJldmlvdXMnOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZVByZXZpb3VzJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdjaG9pY2UnOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZUNob2ljZScpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnZXhpdCc6XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlRXhpdCcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnZXhpdEFsbCc6XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlRXhpdEFsbCcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnYWJhbmRvbic6XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlQWJhbmRvbicpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnYWJhbmRvbkFsbCc6XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlQWJhbmRvbkFsbCcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zZXR0aW5ncy5hdXRvUHJvZ3Jlc3MpIHtcbiAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZU5leHQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc0dldFZhbHVlKENNSUVsZW1lbnQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRWYWx1ZSgnR2V0VmFsdWUnLCB0cnVlLCBDTUlFbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zU2V0VmFsdWUoQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5zZXRWYWx1ZSgnU2V0VmFsdWUnLCB0cnVlLCBDTUlFbGVtZW50LCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogT3JkZXJzIExNUyB0byBzdG9yZSBhbGwgY29udGVudCBwYXJhbWV0ZXJzXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgKi9cbiAgbG1zQ29tbWl0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbW1pdCgnQ29tbWl0Jyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBsYXN0IGVycm9yIGNvZGVcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zR2V0TGFzdEVycm9yKCkge1xuICAgIHJldHVybiB0aGlzLmdldExhc3RFcnJvcignR2V0TGFzdEVycm9yJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZXJyb3JOdW1iZXIgZXJyb3IgZGVzY3JpcHRpb25cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcil9IENNSUVycm9yQ29kZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXRFcnJvclN0cmluZyhDTUlFcnJvckNvZGUpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRFcnJvclN0cmluZygnR2V0RXJyb3JTdHJpbmcnLCBDTUlFcnJvckNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBjb21wcmVoZW5zaXZlIGRlc2NyaXB0aW9uIG9mIHRoZSBlcnJvck51bWJlciBlcnJvci5cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcil9IENNSUVycm9yQ29kZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXREaWFnbm9zdGljKENNSUVycm9yQ29kZSkge1xuICAgIHJldHVybiB0aGlzLmdldERpYWdub3N0aWMoJ0dldERpYWdub3N0aWMnLCBDTUlFcnJvckNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSB2YWx1ZSBvbiB0aGUgQ01JIE9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgc2V0Q01JVmFsdWUoQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tbW9uU2V0Q01JVmFsdWUoJ1NldFZhbHVlJywgdHJ1ZSwgQ01JRWxlbWVudCwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgb3IgYnVpbGRzIGEgbmV3IGNoaWxkIGVsZW1lbnQgdG8gYWRkIHRvIHRoZSBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm91bmRGaXJzdEluZGV4XG4gICAqIEByZXR1cm4ge2FueX1cbiAgICovXG4gIGdldENoaWxkRWxlbWVudChDTUlFbGVtZW50LCB2YWx1ZSwgZm91bmRGaXJzdEluZGV4KSB7XG4gICAgbGV0IG5ld0NoaWxkO1xuXG4gICAgaWYgKHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LCAnY21pXFxcXC5vYmplY3RpdmVzXFxcXC5cXFxcZCsnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JT2JqZWN0aXZlc09iamVjdCgpO1xuICAgIH0gZWxzZSBpZiAoZm91bmRGaXJzdEluZGV4ICYmIHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LFxuICAgICAgICAnY21pXFxcXC5pbnRlcmFjdGlvbnNcXFxcLlxcXFxkK1xcXFwuY29ycmVjdF9yZXNwb25zZXNcXFxcLlxcXFxkKycpKSB7XG4gICAgICBjb25zdCBwYXJ0cyA9IENNSUVsZW1lbnQuc3BsaXQoJy4nKTtcbiAgICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKHBhcnRzWzJdKTtcbiAgICAgIGNvbnN0IGludGVyYWN0aW9uID0gdGhpcy5jbWkuaW50ZXJhY3Rpb25zLmNoaWxkQXJyYXlbaW5kZXhdO1xuICAgICAgaWYgKCFpbnRlcmFjdGlvbi50eXBlKSB7XG4gICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5ERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBpbnRlcmFjdGlvbl90eXBlID0gaW50ZXJhY3Rpb24udHlwZTtcbiAgICAgICAgY29uc3QgaW50ZXJhY3Rpb25fY291bnQgPSBpbnRlcmFjdGlvbi5jb3JyZWN0X3Jlc3BvbnNlcy5fY291bnQ7XG4gICAgICAgIGlmIChpbnRlcmFjdGlvbl90eXBlID09PSAnY2hvaWNlJykge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW50ZXJhY3Rpb25fY291bnQgJiYgdGhpcy5sYXN0RXJyb3JDb2RlID09PVxuICAgICAgICAgIDA7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBpbnRlcmFjdGlvbi5jb3JyZWN0X3Jlc3BvbnNlcy5jaGlsZEFycmF5W2ldO1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnBhdHRlcm4gPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5HRU5FUkFMX1NFVF9GQUlMVVJFKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXNwb25zZV90eXBlID0gY29ycmVjdF9yZXNwb25zZXNbaW50ZXJhY3Rpb25fdHlwZV07XG4gICAgICAgIGlmIChyZXNwb25zZV90eXBlKSB7XG4gICAgICAgICAgbGV0IG5vZGVzID0gW107XG4gICAgICAgICAgaWYgKHJlc3BvbnNlX3R5cGU/LmRlbGltaXRlcikge1xuICAgICAgICAgICAgbm9kZXMgPSBTdHJpbmcodmFsdWUpLnNwbGl0KHJlc3BvbnNlX3R5cGUuZGVsaW1pdGVyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZXNbMF0gPSB2YWx1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAobm9kZXMubGVuZ3RoID4gMCAmJiBub2Rlcy5sZW5ndGggPD0gcmVzcG9uc2VfdHlwZS5tYXgpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tDb3JyZWN0UmVzcG9uc2VWYWx1ZShpbnRlcmFjdGlvbl90eXBlLCBub2RlcywgdmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSBpZiAobm9kZXMubGVuZ3RoID4gcmVzcG9uc2VfdHlwZS5tYXgpIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5HRU5FUkFMX1NFVF9GQUlMVVJFLFxuICAgICAgICAgICAgICAgICdEYXRhIE1vZGVsIEVsZW1lbnQgUGF0dGVybiBUb28gTG9uZycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuR0VORVJBTF9TRVRfRkFJTFVSRSxcbiAgICAgICAgICAgICAgJ0luY29ycmVjdCBSZXNwb25zZSBUeXBlOiAnICsgaW50ZXJhY3Rpb25fdHlwZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmxhc3RFcnJvckNvZGUgPT09IDApIHtcbiAgICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JSW50ZXJhY3Rpb25zQ29ycmVjdFJlc3BvbnNlc09iamVjdCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZm91bmRGaXJzdEluZGV4ICYmIHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LFxuICAgICAgICAnY21pXFxcXC5pbnRlcmFjdGlvbnNcXFxcLlxcXFxkK1xcXFwub2JqZWN0aXZlc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QoKTtcbiAgICB9IGVsc2UgaWYgKCFmb3VuZEZpcnN0SW5kZXggJiZcbiAgICAgICAgdGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsICdjbWlcXFxcLmludGVyYWN0aW9uc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUludGVyYWN0aW9uc09iamVjdCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsXG4gICAgICAgICdjbWlcXFxcLmNvbW1lbnRzX2Zyb21fbGVhcm5lclxcXFwuXFxcXGQrJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUNvbW1lbnRzT2JqZWN0KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgJ2NtaVxcXFwuY29tbWVudHNfZnJvbV9sbXNcXFxcLlxcXFxkKycpKSB7XG4gICAgICBuZXdDaGlsZCA9IG5ldyBDTUlDb21tZW50c09iamVjdCh0cnVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3Q2hpbGQ7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGUgY29ycmVjdCByZXNwb25zZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKi9cbiAgdmFsaWRhdGVDb3JyZWN0UmVzcG9uc2UoQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICBjb25zdCBwYXJ0cyA9IENNSUVsZW1lbnQuc3BsaXQoJy4nKTtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcihwYXJ0c1syXSk7XG4gICAgY29uc3QgcGF0dGVybl9pbmRleCA9IE51bWJlcihwYXJ0c1s0XSk7XG4gICAgY29uc3QgaW50ZXJhY3Rpb24gPSB0aGlzLmNtaS5pbnRlcmFjdGlvbnMuY2hpbGRBcnJheVtpbmRleF07XG5cbiAgICBjb25zdCBpbnRlcmFjdGlvbl90eXBlID0gaW50ZXJhY3Rpb24udHlwZTtcbiAgICBjb25zdCBpbnRlcmFjdGlvbl9jb3VudCA9IGludGVyYWN0aW9uLmNvcnJlY3RfcmVzcG9uc2VzLl9jb3VudDtcbiAgICBpZiAoaW50ZXJhY3Rpb25fdHlwZSA9PT0gJ2Nob2ljZScpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW50ZXJhY3Rpb25fY291bnQgJiYgdGhpcy5sYXN0RXJyb3JDb2RlID09PSAwOyBpKyspIHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBpbnRlcmFjdGlvbi5jb3JyZWN0X3Jlc3BvbnNlcy5jaGlsZEFycmF5W2ldO1xuICAgICAgICBpZiAocmVzcG9uc2UucGF0dGVybiA9PT0gdmFsdWUpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuR0VORVJBTF9TRVRfRkFJTFVSRSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZV90eXBlID0gY29ycmVjdF9yZXNwb25zZXNbaW50ZXJhY3Rpb25fdHlwZV07XG4gICAgaWYgKHR5cGVvZiByZXNwb25zZV90eXBlLmxpbWl0ID09PSAndW5kZWZpbmVkJyB8fCBpbnRlcmFjdGlvbl9jb3VudCA8PVxuICAgICAgICByZXNwb25zZV90eXBlLmxpbWl0KSB7XG4gICAgICBsZXQgbm9kZXMgPSBbXTtcbiAgICAgIGlmIChyZXNwb25zZV90eXBlPy5kZWxpbWl0ZXIpIHtcbiAgICAgICAgbm9kZXMgPSBTdHJpbmcodmFsdWUpLnNwbGl0KHJlc3BvbnNlX3R5cGUuZGVsaW1pdGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGVzWzBdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChub2Rlcy5sZW5ndGggPiAwICYmIG5vZGVzLmxlbmd0aCA8PSByZXNwb25zZV90eXBlLm1heCkge1xuICAgICAgICB0aGlzLmNoZWNrQ29ycmVjdFJlc3BvbnNlVmFsdWUoaW50ZXJhY3Rpb25fdHlwZSwgbm9kZXMsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAobm9kZXMubGVuZ3RoID4gcmVzcG9uc2VfdHlwZS5tYXgpIHtcbiAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUsXG4gICAgICAgICAgICAnRGF0YSBNb2RlbCBFbGVtZW50IFBhdHRlcm4gVG9vIExvbmcnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMCAmJlxuICAgICAgICAgICghcmVzcG9uc2VfdHlwZS5kdXBsaWNhdGUgfHxcbiAgICAgICAgICAgICAgIXRoaXMuY2hlY2tEdXBsaWNhdGVkUGF0dGVybihpbnRlcmFjdGlvbi5jb3JyZWN0X3Jlc3BvbnNlcyxcbiAgICAgICAgICAgICAgICAgIHBhdHRlcm5faW5kZXgsIHZhbHVlKSkgfHxcbiAgICAgICAgICAodGhpcy5sYXN0RXJyb3JDb2RlID09PSAwICYmIHZhbHVlID09PSAnJykpIHtcbiAgICAgICAgLy8gZG8gbm90aGluZywgd2Ugd2FudCB0aGUgaW52ZXJzZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMCkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5HRU5FUkFMX1NFVF9GQUlMVVJFLFxuICAgICAgICAgICAgICAnRGF0YSBNb2RlbCBFbGVtZW50IFBhdHRlcm4gQWxyZWFkeSBFeGlzdHMnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuR0VORVJBTF9TRVRfRkFJTFVSRSxcbiAgICAgICAgICAnRGF0YSBNb2RlbCBFbGVtZW50IENvbGxlY3Rpb24gTGltaXQgUmVhY2hlZCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgdmFsdWUgZnJvbSB0aGUgQ01JIE9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0Q01JVmFsdWUoQ01JRWxlbWVudCkge1xuICAgIHJldHVybiB0aGlzLl9jb21tb25HZXRDTUlWYWx1ZSgnR2V0VmFsdWUnLCB0cnVlLCBDTUlFbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtZXNzYWdlIHRoYXQgY29ycmVzcG9uZHMgdG8gZXJyb3JOdW1iZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBlcnJvck51bWJlclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGRldGFpbFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzKGVycm9yTnVtYmVyLCBkZXRhaWwpIHtcbiAgICBsZXQgYmFzaWNNZXNzYWdlID0gJyc7XG4gICAgbGV0IGRldGFpbE1lc3NhZ2UgPSAnJztcblxuICAgIC8vIFNldCBlcnJvciBudW1iZXIgdG8gc3RyaW5nIHNpbmNlIGluY29uc2lzdGVudCBmcm9tIG1vZHVsZXMgaWYgc3RyaW5nIG9yIG51bWJlclxuICAgIGVycm9yTnVtYmVyID0gU3RyaW5nKGVycm9yTnVtYmVyKTtcbiAgICBpZiAoc2Nvcm0yMDA0X2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbZXJyb3JOdW1iZXJdKSB7XG4gICAgICBiYXNpY01lc3NhZ2UgPSBzY29ybTIwMDRfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tlcnJvck51bWJlcl0uYmFzaWNNZXNzYWdlO1xuICAgICAgZGV0YWlsTWVzc2FnZSA9IHNjb3JtMjAwNF9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW2Vycm9yTnVtYmVyXS5kZXRhaWxNZXNzYWdlO1xuICAgIH1cblxuICAgIHJldHVybiBkZXRhaWwgPyBkZXRhaWxNZXNzYWdlIDogYmFzaWNNZXNzYWdlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHRvIHNlZSBpZiBhIGNvcnJlY3RfcmVzcG9uc2UgdmFsdWUgaGFzIGJlZW4gZHVwbGljYXRlZFxuICAgKiBAcGFyYW0ge0NNSUFycmF5fSBjb3JyZWN0X3Jlc3BvbnNlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50X2luZGV4XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGNoZWNrRHVwbGljYXRlZFBhdHRlcm4gPSAoY29ycmVjdF9yZXNwb25zZSwgY3VycmVudF9pbmRleCwgdmFsdWUpID0+IHtcbiAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICBjb25zdCBjb3VudCA9IGNvcnJlY3RfcmVzcG9uc2UuX2NvdW50O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQgJiYgIWZvdW5kOyBpKyspIHtcbiAgICAgIGlmIChpICE9PSBjdXJyZW50X2luZGV4ICYmIGNvcnJlY3RfcmVzcG9uc2UuY2hpbGRBcnJheVtpXSA9PT0gdmFsdWUpIHtcbiAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZm91bmQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIENoZWNrcyBmb3IgYSB2YWxpZCBjb3JyZWN0X3Jlc3BvbnNlIHZhbHVlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpbnRlcmFjdGlvbl90eXBlXG4gICAqIEBwYXJhbSB7QXJyYXl9IG5vZGVzXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICovXG4gIGNoZWNrQ29ycmVjdFJlc3BvbnNlVmFsdWUoaW50ZXJhY3Rpb25fdHlwZSwgbm9kZXMsIHZhbHVlKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBjb3JyZWN0X3Jlc3BvbnNlc1tpbnRlcmFjdGlvbl90eXBlXTtcbiAgICBjb25zdCBmb3JtYXRSZWdleCA9IG5ldyBSZWdFeHAocmVzcG9uc2UuZm9ybWF0KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aCAmJiB0aGlzLmxhc3RFcnJvckNvZGUgPT09IDA7IGkrKykge1xuICAgICAgaWYgKGludGVyYWN0aW9uX3R5cGUubWF0Y2goXG4gICAgICAgICAgJ14oZmlsbC1pbnxsb25nLWZpbGwtaW58bWF0Y2hpbmd8cGVyZm9ybWFuY2V8c2VxdWVuY2luZykkJykpIHtcbiAgICAgICAgbm9kZXNbaV0gPSB0aGlzLnJlbW92ZUNvcnJlY3RSZXNwb25zZVByZWZpeGVzKG5vZGVzW2ldKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3BvbnNlPy5kZWxpbWl0ZXIyKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IG5vZGVzW2ldLnNwbGl0KHJlc3BvbnNlLmRlbGltaXRlcjIpO1xuICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgIGNvbnN0IG1hdGNoZXMgPSB2YWx1ZXNbMF0ubWF0Y2goZm9ybWF0UmVnZXgpO1xuICAgICAgICAgIGlmICghbWF0Y2hlcykge1xuICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXZhbHVlc1sxXS5tYXRjaChuZXcgUmVnRXhwKHJlc3BvbnNlLmZvcm1hdDIpKSkge1xuICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbWF0Y2hlcyA9IG5vZGVzW2ldLm1hdGNoKGZvcm1hdFJlZ2V4KTtcbiAgICAgICAgaWYgKCghbWF0Y2hlcyAmJiB2YWx1ZSAhPT0gJycpIHx8XG4gICAgICAgICAgICAoIW1hdGNoZXMgJiYgaW50ZXJhY3Rpb25fdHlwZSA9PT0gJ3RydWUtZmFsc2UnKSkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoaW50ZXJhY3Rpb25fdHlwZSA9PT0gJ251bWVyaWMnICYmIG5vZGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGlmIChOdW1iZXIobm9kZXNbMF0pID4gTnVtYmVyKG5vZGVzWzFdKSkge1xuICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChub2Rlc1tpXSAhPT0gJycgJiYgcmVzcG9uc2UudW5pcXVlKSB7XG4gICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaSAmJiB0aGlzLmxhc3RFcnJvckNvZGUgPT09IDA7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChub2Rlc1tpXSA9PT0gbm9kZXNbal0pIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHByZWZpeGVzIGZyb20gY29ycmVjdF9yZXNwb25zZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbm9kZVxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgcmVtb3ZlQ29ycmVjdFJlc3BvbnNlUHJlZml4ZXMobm9kZSkge1xuICAgIGxldCBzZWVuT3JkZXIgPSBmYWxzZTtcbiAgICBsZXQgc2VlbkNhc2UgPSBmYWxzZTtcbiAgICBsZXQgc2VlbkxhbmcgPSBmYWxzZTtcblxuICAgIGNvbnN0IHByZWZpeFJlZ2V4ID0gbmV3IFJlZ0V4cChcbiAgICAgICAgJ14oeyhsYW5nfGNhc2VfbWF0dGVyc3xvcmRlcl9tYXR0ZXJzKT0oW159XSspfSknKTtcbiAgICBsZXQgbWF0Y2hlcyA9IG5vZGUubWF0Y2gocHJlZml4UmVnZXgpO1xuICAgIGxldCBsYW5nTWF0Y2hlcyA9IG51bGw7XG4gICAgd2hpbGUgKG1hdGNoZXMpIHtcbiAgICAgIHN3aXRjaCAobWF0Y2hlc1syXSkge1xuICAgICAgICBjYXNlICdsYW5nJzpcbiAgICAgICAgICBsYW5nTWF0Y2hlcyA9IG5vZGUubWF0Y2goc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmdjcik7XG4gICAgICAgICAgaWYgKGxhbmdNYXRjaGVzKSB7XG4gICAgICAgICAgICBjb25zdCBsYW5nID0gbGFuZ01hdGNoZXNbM107XG4gICAgICAgICAgICBpZiAobGFuZyAhPT0gdW5kZWZpbmVkICYmIGxhbmcubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBpZiAoVmFsaWRMYW5ndWFnZXNbbGFuZy50b0xvd2VyQ2FzZSgpXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlZW5MYW5nID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnY2FzZV9tYXR0ZXJzJzpcbiAgICAgICAgICBpZiAoIXNlZW5MYW5nICYmICFzZWVuT3JkZXIgJiYgIXNlZW5DYXNlKSB7XG4gICAgICAgICAgICBpZiAobWF0Y2hlc1szXSAhPT0gJ3RydWUnICYmIG1hdGNoZXNbM10gIT09ICdmYWxzZScpIHtcbiAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHNlZW5DYXNlID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnb3JkZXJfbWF0dGVycyc6XG4gICAgICAgICAgaWYgKCFzZWVuQ2FzZSAmJiAhc2VlbkxhbmcgJiYgIXNlZW5PcmRlcikge1xuICAgICAgICAgICAgaWYgKG1hdGNoZXNbM10gIT09ICd0cnVlJyAmJiBtYXRjaGVzWzNdICE9PSAnZmFsc2UnKSB7XG4gICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZWVuT3JkZXIgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgbm9kZSA9IG5vZGUuc3Vic3RyKG1hdGNoZXNbMV0ubGVuZ3RoKTtcbiAgICAgIG1hdGNoZXMgPSBub2RlLm1hdGNoKHByZWZpeFJlZ2V4KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIHRoZSB3aG9sZSBBUEkgd2l0aCBhbm90aGVyXG4gICAqIEBwYXJhbSB7U2Nvcm0yMDA0QVBJfSBuZXdBUElcbiAgICovXG4gIHJlcGxhY2VXaXRoQW5vdGhlclNjb3JtQVBJKG5ld0FQSSkge1xuICAgIC8vIERhdGEgTW9kZWxcbiAgICB0aGlzLmNtaSA9IG5ld0FQSS5jbWk7XG4gICAgdGhpcy5hZGwgPSBuZXdBUEkuYWRsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgY21pIG9iamVjdCB0byB0aGUgcHJvcGVyIGZvcm1hdCBmb3IgTE1TIGNvbW1pdFxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHRlcm1pbmF0ZUNvbW1pdFxuICAgKiBAcmV0dXJuIHtvYmplY3R8QXJyYXl9XG4gICAqL1xuICByZW5kZXJDb21taXRDTUkodGVybWluYXRlQ29tbWl0OiBib29sZWFuKSB7XG4gICAgY29uc3QgY21pRXhwb3J0ID0gdGhpcy5yZW5kZXJDTUlUb0pTT05PYmplY3QoKTtcblxuICAgIGlmICh0ZXJtaW5hdGVDb21taXQpIHtcbiAgICAgIGNtaUV4cG9ydC5jbWkudG90YWxfdGltZSA9IHRoaXMuY21pLmdldEN1cnJlbnRUb3RhbFRpbWUoKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICBjb25zdCBmbGF0dGVuZWQgPSBVdGlsaXRpZXMuZmxhdHRlbihjbWlFeHBvcnQpO1xuICAgIHN3aXRjaCAodGhpcy5zZXR0aW5ncy5kYXRhQ29tbWl0Rm9ybWF0KSB7XG4gICAgICBjYXNlICdmbGF0dGVuZWQnOlxuICAgICAgICByZXR1cm4gVXRpbGl0aWVzLmZsYXR0ZW4oY21pRXhwb3J0KTtcbiAgICAgIGNhc2UgJ3BhcmFtcyc6XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBpbiBmbGF0dGVuZWQpIHtcbiAgICAgICAgICBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChmbGF0dGVuZWQsIGl0ZW0pKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChgJHtpdGVtfT0ke2ZsYXR0ZW5lZFtpdGVtXX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIGNhc2UgJ2pzb24nOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGNtaUV4cG9ydDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdHMgdG8gc3RvcmUgdGhlIGRhdGEgdG8gdGhlIExNU1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHRlcm1pbmF0ZUNvbW1pdFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBzdG9yZURhdGEodGVybWluYXRlQ29tbWl0OiBib29sZWFuKSB7XG4gICAgaWYgKHRlcm1pbmF0ZUNvbW1pdCkge1xuICAgICAgaWYgKHRoaXMuY21pLm1vZGUgPT09ICdub3JtYWwnKSB7XG4gICAgICAgIGlmICh0aGlzLmNtaS5jcmVkaXQgPT09ICdjcmVkaXQnKSB7XG4gICAgICAgICAgaWYgKHRoaXMuY21pLmNvbXBsZXRpb25fdGhyZXNob2xkICYmIHRoaXMuY21pLnByb2dyZXNzX21lYXN1cmUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNtaS5wcm9ncmVzc19tZWFzdXJlID49IHRoaXMuY21pLmNvbXBsZXRpb25fdGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1NldHRpbmcgQ29tcGxldGlvbiBTdGF0dXM6IENvbXBsZXRlZCcpO1xuICAgICAgICAgICAgICB0aGlzLmNtaS5jb21wbGV0aW9uX3N0YXR1cyA9ICdjb21wbGV0ZWQnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnU2V0dGluZyBDb21wbGV0aW9uIFN0YXR1czogSW5jb21wbGV0ZScpO1xuICAgICAgICAgICAgICB0aGlzLmNtaS5jb21wbGV0aW9uX3N0YXR1cyA9ICdpbmNvbXBsZXRlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMuY21pLnNjYWxlZF9wYXNzaW5nX3Njb3JlICYmIHRoaXMuY21pLnNjb3JlLnNjYWxlZCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY21pLnNjb3JlLnNjYWxlZCA+PSB0aGlzLmNtaS5zY2FsZWRfcGFzc2luZ19zY29yZSkge1xuICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdTZXR0aW5nIFN1Y2Nlc3MgU3RhdHVzOiBQYXNzZWQnKTtcbiAgICAgICAgICAgICAgdGhpcy5jbWkuc3VjY2Vzc19zdGF0dXMgPSAncGFzc2VkJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1NldHRpbmcgU3VjY2VzcyBTdGF0dXM6IEZhaWxlZCcpO1xuICAgICAgICAgICAgICB0aGlzLmNtaS5zdWNjZXNzX3N0YXR1cyA9ICdmYWlsZWQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBuYXZSZXF1ZXN0ID0gZmFsc2U7XG4gICAgaWYgKHRoaXMuYWRsLm5hdi5yZXF1ZXN0ICE9PSAodGhpcy5zdGFydGluZ0RhdGE/LmFkbD8ubmF2Py5yZXF1ZXN0KSAmJlxuICAgICAgICB0aGlzLmFkbC5uYXYucmVxdWVzdCAhPT0gJ19ub25lXycpIHtcbiAgICAgIHRoaXMuYWRsLm5hdi5yZXF1ZXN0ID0gZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuYWRsLm5hdi5yZXF1ZXN0KTtcbiAgICAgIG5hdlJlcXVlc3QgPSB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbW1pdE9iamVjdCA9IHRoaXMucmVuZGVyQ29tbWl0Q01JKHRlcm1pbmF0ZUNvbW1pdCk7XG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5sbXNDb21taXRVcmwpIHtcbiAgICAgIGlmICh0aGlzLmFwaUxvZ0xldmVsID09PSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9ERUJVRykge1xuICAgICAgICBjb25zb2xlLmRlYnVnKCdDb21taXQgKHRlcm1pbmF0ZWQ6ICcgK1xuICAgICAgICAgICAgKHRlcm1pbmF0ZUNvbW1pdCA/ICd5ZXMnIDogJ25vJykgKyAnKTogJyk7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoY29tbWl0T2JqZWN0KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMucHJvY2Vzc0h0dHBSZXF1ZXN0KHRoaXMuc2V0dGluZ3MubG1zQ29tbWl0VXJsLFxuICAgICAgICAgIGNvbW1pdE9iamVjdCwgdGVybWluYXRlQ29tbWl0KTtcblxuICAgICAgLy8gY2hlY2sgaWYgdGhpcyBpcyBhIHNlcXVlbmNpbmcgY2FsbCwgYW5kIHRoZW4gY2FsbCB0aGUgbmVjZXNzYXJ5IEpTXG4gICAgICB7XG4gICAgICAgIGlmIChuYXZSZXF1ZXN0ICYmIHJlc3VsdC5uYXZSZXF1ZXN0ICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICByZXN1bHQubmF2UmVxdWVzdCAhPT0gJycpIHtcbiAgICAgICAgICBGdW5jdGlvbihgXCJ1c2Ugc3RyaWN0XCI7KCgpID0+IHsgJHtyZXN1bHQubmF2UmVxdWVzdH0gfSkoKWApKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdDb21taXQgKHRlcm1pbmF0ZWQ6ICcgK1xuICAgICAgICAgICh0ZXJtaW5hdGVDb21taXQgPyAneWVzJyA6ICdubycpICsgJyk6ICcpO1xuICAgICAgY29uc29sZS5sb2coY29tbWl0T2JqZWN0KTtcbiAgICAgIHJldHVybiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUU7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBTY29ybTEyQ01JIGZyb20gJy4vc2Nvcm0xMl9jbWknO1xuaW1wb3J0IHtCYXNlQ01JLCBDTUlBcnJheSwgQ01JU2NvcmV9IGZyb20gJy4vY29tbW9uJztcbmltcG9ydCBBUElDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IFJlZ2V4IGZyb20gJy4uL2NvbnN0YW50cy9yZWdleCc7XG5pbXBvcnQgRXJyb3JDb2RlcyBmcm9tICcuLi9jb25zdGFudHMvZXJyb3JfY29kZXMnO1xuaW1wb3J0IHtcbiAgY2hlY2sxMlZhbGlkRm9ybWF0LFxuICB0aHJvd1JlYWRPbmx5RXJyb3IsXG59IGZyb20gJy4vc2Nvcm0xMl9jbWknO1xuXG5jb25zdCBhaWNjX2NvbnN0YW50cyA9IEFQSUNvbnN0YW50cy5haWNjO1xuY29uc3QgYWljY19yZWdleCA9IFJlZ2V4LmFpY2M7XG5jb25zdCBzY29ybTEyX2Vycm9yX2NvZGVzID0gRXJyb3JDb2Rlcy5zY29ybTEyO1xuXG4vKipcbiAqIENNSSBDbGFzcyBmb3IgQUlDQ1xuICovXG5leHBvcnQgY2xhc3MgQ01JIGV4dGVuZHMgU2Nvcm0xMkNNSS5DTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgQ01JIG9iamVjdFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGluaXRpYWxpemVkXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihpbml0aWFsaXplZDogYm9vbGVhbikge1xuICAgIHN1cGVyKGFpY2NfY29uc3RhbnRzLmNtaV9jaGlsZHJlbik7XG5cbiAgICBpZiAoaW5pdGlhbGl6ZWQpIHRoaXMuaW5pdGlhbGl6ZSgpO1xuXG4gICAgdGhpcy5zdHVkZW50X3ByZWZlcmVuY2UgPSBuZXcgQUlDQ1N0dWRlbnRQcmVmZXJlbmNlcygpO1xuICAgIHRoaXMuc3R1ZGVudF9kYXRhID0gbmV3IEFJQ0NDTUlTdHVkZW50RGF0YSgpO1xuICAgIHRoaXMuc3R1ZGVudF9kZW1vZ3JhcGhpY3MgPSBuZXcgQ01JU3R1ZGVudERlbW9ncmFwaGljcygpO1xuICAgIHRoaXMuZXZhbHVhdGlvbiA9IG5ldyBDTUlFdmFsdWF0aW9uKCk7XG4gICAgdGhpcy5wYXRocyA9IG5ldyBDTUlQYXRocygpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnN0dWRlbnRfcHJlZmVyZW5jZT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc3R1ZGVudF9kYXRhPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zdHVkZW50X2RlbW9ncmFwaGljcz8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuZXZhbHVhdGlvbj8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMucGF0aHM/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHN1c3BlbmRfZGF0YTogc3RyaW5nLFxuICAgKiAgICAgIGxhdW5jaF9kYXRhOiBzdHJpbmcsXG4gICAqICAgICAgY29tbWVudHM6IHN0cmluZyxcbiAgICogICAgICBjb21tZW50c19mcm9tX2xtczogc3RyaW5nLFxuICAgKiAgICAgIGNvcmU6IENNSUNvcmUsXG4gICAqICAgICAgb2JqZWN0aXZlczogQ01JT2JqZWN0aXZlcyxcbiAgICogICAgICBzdHVkZW50X2RhdGE6IENNSVN0dWRlbnREYXRhLFxuICAgKiAgICAgIHN0dWRlbnRfcHJlZmVyZW5jZTogQ01JU3R1ZGVudFByZWZlcmVuY2UsXG4gICAqICAgICAgaW50ZXJhY3Rpb25zOiBDTUlJbnRlcmFjdGlvbnMsXG4gICAqICAgICAgcGF0aHM6IENNSVBhdGhzXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdzdXNwZW5kX2RhdGEnOiB0aGlzLnN1c3BlbmRfZGF0YSxcbiAgICAgICdsYXVuY2hfZGF0YSc6IHRoaXMubGF1bmNoX2RhdGEsXG4gICAgICAnY29tbWVudHMnOiB0aGlzLmNvbW1lbnRzLFxuICAgICAgJ2NvbW1lbnRzX2Zyb21fbG1zJzogdGhpcy5jb21tZW50c19mcm9tX2xtcyxcbiAgICAgICdjb3JlJzogdGhpcy5jb3JlLFxuICAgICAgJ29iamVjdGl2ZXMnOiB0aGlzLm9iamVjdGl2ZXMsXG4gICAgICAnc3R1ZGVudF9kYXRhJzogdGhpcy5zdHVkZW50X2RhdGEsXG4gICAgICAnc3R1ZGVudF9wcmVmZXJlbmNlJzogdGhpcy5zdHVkZW50X3ByZWZlcmVuY2UsXG4gICAgICAnc3R1ZGVudF9kZW1vZ3JhcGhpY3MnOiB0aGlzLnN0dWRlbnRfZGVtb2dyYXBoaWNzLFxuICAgICAgJ2ludGVyYWN0aW9ucyc6IHRoaXMuaW50ZXJhY3Rpb25zLFxuICAgICAgJ2V2YWx1YXRpb24nOiB0aGlzLmV2YWx1YXRpb24sXG4gICAgICAncGF0aHMnOiB0aGlzLnBhdGhzLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQUlDQyBFdmFsdWF0aW9uIG9iamVjdFxuICovXG5jbGFzcyBDTUlFdmFsdWF0aW9uIGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBFdmFsdWF0aW9uIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuY29tbWVudHMgPSBuZXcgQ01JRXZhbHVhdGlvbkNvbW1lbnRzKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29tbWVudHM/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5ldmFsdWF0aW9uIG9iamVjdFxuICAgKiBAcmV0dXJuIHt7Y29tbWVudHM6IENNSUV2YWx1YXRpb25Db21tZW50c319XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnY29tbWVudHMnOiB0aGlzLmNvbW1lbnRzLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIEFJQ0MncyBjbWkuZXZhbHVhdGlvbi5jb21tZW50cyBvYmplY3RcbiAqL1xuY2xhc3MgQ01JRXZhbHVhdGlvbkNvbW1lbnRzIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgRXZhbHVhdGlvbiBDb21tZW50cyBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKGFpY2NfY29uc3RhbnRzLmNvbW1lbnRzX2NoaWxkcmVuLFxuICAgICAgICBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFKTtcbiAgfVxufVxuXG4vKipcbiAqIFN0dWRlbnRQcmVmZXJlbmNlcyBjbGFzcyBmb3IgQUlDQ1xuICovXG5jbGFzcyBBSUNDU3R1ZGVudFByZWZlcmVuY2VzIGV4dGVuZHMgU2Nvcm0xMkNNSS5DTUlTdHVkZW50UHJlZmVyZW5jZSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBTdHVkZW50IFByZWZlcmVuY2VzIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoYWljY19jb25zdGFudHMuc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuKTtcblxuICAgIHRoaXMud2luZG93cyA9IG5ldyBDTUlBcnJheSh7XG4gICAgICBlcnJvckNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUsXG4gICAgICBjaGlsZHJlbjogJycsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMud2luZG93cz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI2xlc3Nvbl90eXBlID0gJyc7XG4gICN0ZXh0X2NvbG9yID0gJyc7XG4gICN0ZXh0X2xvY2F0aW9uID0gJyc7XG4gICN0ZXh0X3NpemUgPSAnJztcbiAgI3ZpZGVvID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlc3Nvbl90eXBlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsZXNzb25fdHlwZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLiNsZXNzb25fdHlwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZXNzb25fdHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGVzc29uX3R5cGVcbiAgICovXG4gIHNldCBsZXNzb25fdHlwZShsZXNzb25fdHlwZTogc3RyaW5nKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChsZXNzb25fdHlwZSwgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiNsZXNzb25fdHlwZSA9IGxlc3Nvbl90eXBlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0ZXh0X2NvbG9yXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0ZXh0X2NvbG9yKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuI3RleHRfY29sb3I7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGV4dF9jb2xvclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dF9jb2xvclxuICAgKi9cbiAgc2V0IHRleHRfY29sb3IodGV4dF9jb2xvcjogc3RyaW5nKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0ZXh0X2NvbG9yLCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI3RleHRfY29sb3IgPSB0ZXh0X2NvbG9yO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0ZXh0X2xvY2F0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0ZXh0X2xvY2F0aW9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuI3RleHRfbG9jYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGV4dF9sb2NhdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dF9sb2NhdGlvblxuICAgKi9cbiAgc2V0IHRleHRfbG9jYXRpb24odGV4dF9sb2NhdGlvbjogc3RyaW5nKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0ZXh0X2xvY2F0aW9uLCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI3RleHRfbG9jYXRpb24gPSB0ZXh0X2xvY2F0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0ZXh0X3NpemVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRleHRfc2l6ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLiN0ZXh0X3NpemU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGV4dF9zaXplXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0X3NpemVcbiAgICovXG4gIHNldCB0ZXh0X3NpemUodGV4dF9zaXplOiBzdHJpbmcpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHRleHRfc2l6ZSwgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiN0ZXh0X3NpemUgPSB0ZXh0X3NpemU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3ZpZGVvXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB2aWRlbygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLiN2aWRlbztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN2aWRlb1xuICAgKiBAcGFyYW0ge3N0cmluZ30gdmlkZW9cbiAgICovXG4gIHNldCB2aWRlbyh2aWRlbzogc3RyaW5nKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh2aWRlbywgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiN2aWRlbyA9IHZpZGVvO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5zdHVkZW50X3ByZWZlcmVuY2VcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBhdWRpbzogc3RyaW5nLFxuICAgKiAgICAgIGxhbmd1YWdlOiBzdHJpbmcsXG4gICAqICAgICAgc3BlZWQ6IHN0cmluZyxcbiAgICogICAgICB0ZXh0OiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2F1ZGlvJzogdGhpcy5hdWRpbyxcbiAgICAgICdsYW5ndWFnZSc6IHRoaXMubGFuZ3VhZ2UsXG4gICAgICAnbGVzc29uX3R5cGUnOiB0aGlzLmxlc3Nvbl90eXBlLFxuICAgICAgJ3NwZWVkJzogdGhpcy5zcGVlZCxcbiAgICAgICd0ZXh0JzogdGhpcy50ZXh0LFxuICAgICAgJ3RleHRfY29sb3InOiB0aGlzLnRleHRfY29sb3IsXG4gICAgICAndGV4dF9sb2NhdGlvbic6IHRoaXMudGV4dF9sb2NhdGlvbixcbiAgICAgICd0ZXh0X3NpemUnOiB0aGlzLnRleHRfc2l6ZSxcbiAgICAgICd2aWRlbyc6IHRoaXMudmlkZW8sXG4gICAgICAnd2luZG93cyc6IHRoaXMud2luZG93cyxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIFN0dWRlbnREYXRhIGNsYXNzIGZvciBBSUNDXG4gKi9cbmNsYXNzIEFJQ0NDTUlTdHVkZW50RGF0YSBleHRlbmRzIFNjb3JtMTJDTUkuQ01JU3R1ZGVudERhdGEge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgU3R1ZGVudERhdGEgb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihhaWNjX2NvbnN0YW50cy5zdHVkZW50X2RhdGFfY2hpbGRyZW4pO1xuXG4gICAgdGhpcy50cmllcyA9IG5ldyBDTUlUcmllcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnRyaWVzPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAjdHJpZXNfZHVyaW5nX2xlc3NvbiA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIHRyaWVzX2R1cmluZ19sZXNzb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRyaWVzX2R1cmluZ19sZXNzb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RyaWVzX2R1cmluZ19sZXNzb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdHJpZXNfZHVyaW5nX2xlc3Nvbi4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRyaWVzX2R1cmluZ19sZXNzb25cbiAgICovXG4gIHNldCB0cmllc19kdXJpbmdfbGVzc29uKHRyaWVzX2R1cmluZ19sZXNzb24pIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3RyaWVzX2R1cmluZ19sZXNzb24gPSB0cmllc19kdXJpbmdfbGVzc29uIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9kYXRhIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIG1hc3Rlcnlfc2NvcmU6IHN0cmluZyxcbiAgICogICAgICBtYXhfdGltZV9hbGxvd2VkOiBzdHJpbmcsXG4gICAqICAgICAgdGltZV9saW1pdF9hY3Rpb246IHN0cmluZyxcbiAgICogICAgICB0cmllczogQ01JVHJpZXNcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ21hc3Rlcnlfc2NvcmUnOiB0aGlzLm1hc3Rlcnlfc2NvcmUsXG4gICAgICAnbWF4X3RpbWVfYWxsb3dlZCc6IHRoaXMubWF4X3RpbWVfYWxsb3dlZCxcbiAgICAgICd0aW1lX2xpbWl0X2FjdGlvbic6IHRoaXMudGltZV9saW1pdF9hY3Rpb24sXG4gICAgICAndHJpZXMnOiB0aGlzLnRyaWVzLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIHRoZSBBSUNDIGNtaS5zdHVkZW50X2RlbW9ncmFwaGljcyBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSVN0dWRlbnREZW1vZ3JhcGhpY3MgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIFN0dWRlbnREZW1vZ3JhcGhpY3Mgb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgI19jaGlsZHJlbiA9IGFpY2NfY29uc3RhbnRzLnN0dWRlbnRfZGVtb2dyYXBoaWNzX2NoaWxkcmVuO1xuICAjY2l0eSA9ICcnO1xuICAjY2xhc3MgPSAnJztcbiAgI2NvbXBhbnkgPSAnJztcbiAgI2NvdW50cnkgPSAnJztcbiAgI2V4cGVyaWVuY2UgPSAnJztcbiAgI2ZhbWlsaWFyX25hbWUgPSAnJztcbiAgI2luc3RydWN0b3JfbmFtZSA9ICcnO1xuICAjdGl0bGUgPSAnJztcbiAgI25hdGl2ZV9sYW5ndWFnZSA9ICcnO1xuICAjc3RhdGUgPSAnJztcbiAgI3N0cmVldF9hZGRyZXNzID0gJyc7XG4gICN0ZWxlcGhvbmUgPSAnJztcbiAgI3llYXJzX2V4cGVyaWVuY2UgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciBjaXR5XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjaXR5KCkge1xuICAgIHJldHVybiB0aGlzLiNjaXR5O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NpdHkuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjaXR5XG4gICAqL1xuICBzZXQgY2l0eShjaXR5KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNjaXR5ID0gY2l0eSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgY2xhc3NcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNsYXNzKCkge1xuICAgIHJldHVybiB0aGlzLiNjbGFzcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjbGFzcy4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXp6XG4gICAqL1xuICBzZXQgY2xhc3MoY2xhenopIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2NsYXNzID0gY2xhenogOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIGNvbXBhbnlcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbXBhbnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbXBhbnk7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29tcGFueS4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbXBhbnlcbiAgICovXG4gIHNldCBjb21wYW55KGNvbXBhbnkpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2NvbXBhbnkgPSBjb21wYW55IDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBjb3VudHJ5XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb3VudHJ5KCkge1xuICAgIHJldHVybiB0aGlzLiNjb3VudHJ5O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvdW50cnkuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb3VudHJ5XG4gICAqL1xuICBzZXQgY291bnRyeShjb3VudHJ5KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNjb3VudHJ5ID0gY291bnRyeSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgZXhwZXJpZW5jZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZXhwZXJpZW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jZXhwZXJpZW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNleHBlcmllbmNlLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXhwZXJpZW5jZVxuICAgKi9cbiAgc2V0IGV4cGVyaWVuY2UoZXhwZXJpZW5jZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jZXhwZXJpZW5jZSA9IGV4cGVyaWVuY2UgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIGZhbWlsaWFyX25hbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGZhbWlsaWFyX25hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2ZhbWlsaWFyX25hbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZmFtaWxpYXJfbmFtZS4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGZhbWlsaWFyX25hbWVcbiAgICovXG4gIHNldCBmYW1pbGlhcl9uYW1lKGZhbWlsaWFyX25hbWUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2ZhbWlsaWFyX25hbWUgPSBmYW1pbGlhcl9uYW1lIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBpbnN0cnVjdG9yX25hbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGluc3RydWN0b3JfbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jaW5zdHJ1Y3Rvcl9uYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2luc3RydWN0b3JfbmFtZS4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGluc3RydWN0b3JfbmFtZVxuICAgKi9cbiAgc2V0IGluc3RydWN0b3JfbmFtZShpbnN0cnVjdG9yX25hbWUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2luc3RydWN0b3JfbmFtZSA9IGluc3RydWN0b3JfbmFtZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgdGl0bGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpdGxlKCkge1xuICAgIHJldHVybiB0aGlzLiN0aXRsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aXRsZS4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpdGxlXG4gICAqL1xuICBzZXQgdGl0bGUodGl0bGUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3RpdGxlID0gdGl0bGUgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIG5hdGl2ZV9sYW5ndWFnZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbmF0aXZlX2xhbmd1YWdlKCkge1xuICAgIHJldHVybiB0aGlzLiNuYXRpdmVfbGFuZ3VhZ2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbmF0aXZlX2xhbmd1YWdlLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmF0aXZlX2xhbmd1YWdlXG4gICAqL1xuICBzZXQgbmF0aXZlX2xhbmd1YWdlKG5hdGl2ZV9sYW5ndWFnZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jbmF0aXZlX2xhbmd1YWdlID0gbmF0aXZlX2xhbmd1YWdlIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBzdGF0ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3RhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N0YXRlLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RhdGVcbiAgICovXG4gIHNldCBzdGF0ZShzdGF0ZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jc3RhdGUgPSBzdGF0ZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3Igc3RyZWV0X2FkZHJlc3NcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN0cmVldF9hZGRyZXNzKCkge1xuICAgIHJldHVybiB0aGlzLiNzdHJlZXRfYWRkcmVzcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdHJlZXRfYWRkcmVzcy4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmVldF9hZGRyZXNzXG4gICAqL1xuICBzZXQgc3RyZWV0X2FkZHJlc3Moc3RyZWV0X2FkZHJlc3MpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3N0cmVldF9hZGRyZXNzID0gc3RyZWV0X2FkZHJlc3MgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIHRlbGVwaG9uZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGVsZXBob25lKCkge1xuICAgIHJldHVybiB0aGlzLiN0ZWxlcGhvbmU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGVsZXBob25lLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGVsZXBob25lXG4gICAqL1xuICBzZXQgdGVsZXBob25lKHRlbGVwaG9uZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jdGVsZXBob25lID0gdGVsZXBob25lIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciB5ZWFyc19leHBlcmllbmNlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB5ZWFyc19leHBlcmllbmNlKCkge1xuICAgIHJldHVybiB0aGlzLiN5ZWFyc19leHBlcmllbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3llYXJzX2V4cGVyaWVuY2UuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB5ZWFyc19leHBlcmllbmNlXG4gICAqL1xuICBzZXQgeWVhcnNfZXhwZXJpZW5jZSh5ZWFyc19leHBlcmllbmNlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiN5ZWFyc19leHBlcmllbmNlID0geWVhcnNfZXhwZXJpZW5jZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLnN0dWRlbnRfZGVtb2dyYXBoaWNzIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAgICB7XG4gICAqICAgICAgICBjaXR5OiBzdHJpbmcsXG4gICAqICAgICAgICBjbGFzczogc3RyaW5nLFxuICAgKiAgICAgICAgY29tcGFueTogc3RyaW5nLFxuICAgKiAgICAgICAgY291bnRyeTogc3RyaW5nLFxuICAgKiAgICAgICAgZXhwZXJpZW5jZTogc3RyaW5nLFxuICAgKiAgICAgICAgZmFtaWxpYXJfbmFtZTogc3RyaW5nLFxuICAgKiAgICAgICAgaW5zdHJ1Y3Rvcl9uYW1lOiBzdHJpbmcsXG4gICAqICAgICAgICB0aXRsZTogc3RyaW5nLFxuICAgKiAgICAgICAgbmF0aXZlX2xhbmd1YWdlOiBzdHJpbmcsXG4gICAqICAgICAgICBzdGF0ZTogc3RyaW5nLFxuICAgKiAgICAgICAgc3RyZWV0X2FkZHJlc3M6IHN0cmluZyxcbiAgICogICAgICAgIHRlbGVwaG9uZTogc3RyaW5nLFxuICAgKiAgICAgICAgeWVhcnNfZXhwZXJpZW5jZTogc3RyaW5nXG4gICAqICAgICAgfVxuICAgKiAgICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnY2l0eSc6IHRoaXMuY2l0eSxcbiAgICAgICdjbGFzcyc6IHRoaXMuY2xhc3MsXG4gICAgICAnY29tcGFueSc6IHRoaXMuY29tcGFueSxcbiAgICAgICdjb3VudHJ5JzogdGhpcy5jb3VudHJ5LFxuICAgICAgJ2V4cGVyaWVuY2UnOiB0aGlzLmV4cGVyaWVuY2UsXG4gICAgICAnZmFtaWxpYXJfbmFtZSc6IHRoaXMuZmFtaWxpYXJfbmFtZSxcbiAgICAgICdpbnN0cnVjdG9yX25hbWUnOiB0aGlzLmluc3RydWN0b3JfbmFtZSxcbiAgICAgICd0aXRsZSc6IHRoaXMudGl0bGUsXG4gICAgICAnbmF0aXZlX2xhbmd1YWdlJzogdGhpcy5uYXRpdmVfbGFuZ3VhZ2UsXG4gICAgICAnc3RhdGUnOiB0aGlzLnN0YXRlLFxuICAgICAgJ3N0cmVldF9hZGRyZXNzJzogdGhpcy5zdHJlZXRfYWRkcmVzcyxcbiAgICAgICd0ZWxlcGhvbmUnOiB0aGlzLnRlbGVwaG9uZSxcbiAgICAgICd5ZWFyc19leHBlcmllbmNlJzogdGhpcy55ZWFyc19leHBlcmllbmNlLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIHRoZSBBSUNDIGNtaS5wYXRocyBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSVBhdGhzIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGlubGluZSBQYXRocyBBcnJheSBjbGFzc1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoYWljY19jb25zdGFudHMucGF0aHNfY2hpbGRyZW4pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIEFJQ0MgUGF0aHNcbiAqL1xuZXhwb3J0IGNsYXNzIENNSVBhdGhzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBQYXRocyBvYmplY3RzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgI2xvY2F0aW9uX2lkID0gJyc7XG4gICNkYXRlID0gJyc7XG4gICN0aW1lID0gJyc7XG4gICNzdGF0dXMgPSAnJztcbiAgI3doeV9sZWZ0ID0gJyc7XG4gICN0aW1lX2luX2VsZW1lbnQgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbG9jYXRpb25faWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxvY2F0aW9uX2lkKCkge1xuICAgIHJldHVybiB0aGlzLiNsb2NhdGlvbl9pZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsb2NhdGlvbl9pZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb25faWRcbiAgICovXG4gIHNldCBsb2NhdGlvbl9pZChsb2NhdGlvbl9pZCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQobG9jYXRpb25faWQsIGFpY2NfcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jbG9jYXRpb25faWQgPSBsb2NhdGlvbl9pZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZGF0ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jZGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNkYXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlXG4gICAqL1xuICBzZXQgZGF0ZShkYXRlKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChkYXRlLCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI2RhdGUgPSBkYXRlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lKCkge1xuICAgIHJldHVybiB0aGlzLiN0aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVcbiAgICovXG4gIHNldCB0aW1lKHRpbWUpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHRpbWUsIGFpY2NfcmVnZXguQ01JVGltZSkpIHtcbiAgICAgIHRoaXMuI3RpbWUgPSB0aW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdGF0dXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RhdHVzXG4gICAqL1xuICBzZXQgc3RhdHVzKHN0YXR1cykge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoc3RhdHVzLCBhaWNjX3JlZ2V4LkNNSVN0YXR1czIpKSB7XG4gICAgICB0aGlzLiNzdGF0dXMgPSBzdGF0dXM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3doeV9sZWZ0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB3aHlfbGVmdCgpIHtcbiAgICByZXR1cm4gdGhpcy4jd2h5X2xlZnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjd2h5X2xlZnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdoeV9sZWZ0XG4gICAqL1xuICBzZXQgd2h5X2xlZnQod2h5X2xlZnQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHdoeV9sZWZ0LCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI3doeV9sZWZ0ID0gd2h5X2xlZnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVfaW5fZWxlbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGltZV9pbl9lbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLiN0aW1lX2luX2VsZW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGltZV9pbl9lbGVtZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lX2luX2VsZW1lbnRcbiAgICovXG4gIHNldCB0aW1lX2luX2VsZW1lbnQodGltZV9pbl9lbGVtZW50KSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0aW1lX2luX2VsZW1lbnQsIGFpY2NfcmVnZXguQ01JVGltZSkpIHtcbiAgICAgIHRoaXMuI3RpbWVfaW5fZWxlbWVudCA9IHRpbWVfaW5fZWxlbWVudDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkucGF0aHMubiBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBsb2NhdGlvbl9pZDogc3RyaW5nLFxuICAgKiAgICAgIGRhdGU6IHN0cmluZyxcbiAgICogICAgICB0aW1lOiBzdHJpbmcsXG4gICAqICAgICAgc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgd2h5X2xlZnQ6IHN0cmluZyxcbiAgICogICAgICB0aW1lX2luX2VsZW1lbnQ6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnbG9jYXRpb25faWQnOiB0aGlzLmxvY2F0aW9uX2lkLFxuICAgICAgJ2RhdGUnOiB0aGlzLmRhdGUsXG4gICAgICAndGltZSc6IHRoaXMudGltZSxcbiAgICAgICdzdGF0dXMnOiB0aGlzLnN0YXR1cyxcbiAgICAgICd3aHlfbGVmdCc6IHRoaXMud2h5X2xlZnQsXG4gICAgICAndGltZV9pbl9lbGVtZW50JzogdGhpcy50aW1lX2luX2VsZW1lbnQsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgdGhlIEFJQ0MgY21pLnN0dWRlbnRfZGF0YS50cmllcyBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSVRyaWVzIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGlubGluZSBUcmllcyBBcnJheSBjbGFzc1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoYWljY19jb25zdGFudHMudHJpZXNfY2hpbGRyZW4pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIEFJQ0MgVHJpZXNcbiAqL1xuZXhwb3J0IGNsYXNzIENNSVRyaWVzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBUcmllcyBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnNjb3JlID0gbmV3IENNSVNjb3JlKFxuICAgICAgICB7XG4gICAgICAgICAgc2NvcmVfY2hpbGRyZW46IGFpY2NfY29uc3RhbnRzLnNjb3JlX2NoaWxkcmVuLFxuICAgICAgICAgIHNjb3JlX3JhbmdlOiBhaWNjX3JlZ2V4LnNjb3JlX3JhbmdlLFxuICAgICAgICAgIGludmFsaWRFcnJvckNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUsXG4gICAgICAgICAgaW52YWxpZFR5cGVDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gsXG4gICAgICAgICAgaW52YWxpZFJhbmdlQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UsXG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnNjb3JlPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAjc3RhdHVzID0gJyc7XG4gICN0aW1lID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNzdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0dXNcbiAgICovXG4gIHNldCBzdGF0dXMoc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzdGF0dXMsIGFpY2NfcmVnZXguQ01JU3RhdHVzMikpIHtcbiAgICAgIHRoaXMuI3N0YXR1cyA9IHN0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lXG4gICAqL1xuICBzZXQgdGltZSh0aW1lKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0aW1lLCBhaWNjX3JlZ2V4LkNNSVRpbWUpKSB7XG4gICAgICB0aGlzLiN0aW1lID0gdGltZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9kYXRhLnRyaWVzLm4gb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgdGltZTogc3RyaW5nLFxuICAgKiAgICAgIHNjb3JlOiBDTUlTY29yZVxuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnc3RhdHVzJzogdGhpcy5zdGF0dXMsXG4gICAgICAndGltZSc6IHRoaXMudGltZSxcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgY21pLnN0dWRlbnRfZGF0YS5hdHRlbXB0X3JlY29yZHMgYXJyYXlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUF0dGVtcHRSZWNvcmRzIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGlubGluZSBUcmllcyBBcnJheSBjbGFzc1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoYWljY19jb25zdGFudHMuYXR0ZW1wdF9yZWNvcmRzX2NoaWxkcmVuKTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBBSUNDIEF0dGVtcHQgUmVjb3Jkc1xuICovXG5leHBvcnQgY2xhc3MgQ01JQXR0ZW1wdFJlY29yZHNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIEF0dGVtcHQgUmVjb3JkcyBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnNjb3JlID0gbmV3IENNSVNjb3JlKFxuICAgICAgICB7XG4gICAgICAgICAgc2NvcmVfY2hpbGRyZW46IGFpY2NfY29uc3RhbnRzLnNjb3JlX2NoaWxkcmVuLFxuICAgICAgICAgIHNjb3JlX3JhbmdlOiBhaWNjX3JlZ2V4LnNjb3JlX3JhbmdlLFxuICAgICAgICAgIGludmFsaWRFcnJvckNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUsXG4gICAgICAgICAgaW52YWxpZFR5cGVDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gsXG4gICAgICAgICAgaW52YWxpZFJhbmdlQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UsXG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnNjb3JlPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAjbGVzc29uX3N0YXR1cyA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsZXNzb25fc3RhdHVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsZXNzb25fc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNsZXNzb25fc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xlc3Nvbl9zdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlc3Nvbl9zdGF0dXNcbiAgICovXG4gIHNldCBsZXNzb25fc3RhdHVzKGxlc3Nvbl9zdGF0dXMpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxlc3Nvbl9zdGF0dXMsIGFpY2NfcmVnZXguQ01JU3RhdHVzMikpIHtcbiAgICAgIHRoaXMuI2xlc3Nvbl9zdGF0dXMgPSBsZXNzb25fc3RhdHVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5zdHVkZW50X2RhdGEuYXR0ZW1wdF9yZWNvcmRzLm4gb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgdGltZTogc3RyaW5nLFxuICAgKiAgICAgIHNjb3JlOiBDTUlTY29yZVxuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnbGVzc29uX3N0YXR1cyc6IHRoaXMubGVzc29uX3N0YXR1cyxcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgQUlDQyBFdmFsdWF0aW9uIENvbW1lbnRzXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlFdmFsdWF0aW9uQ29tbWVudHNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBFdmFsdWF0aW9uIENvbW1lbnRzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgI2NvbnRlbnQgPSAnJztcbiAgI2xvY2F0aW9uID0gJyc7XG4gICN0aW1lID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbnRlbnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbnRlbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29udGVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGVudFxuICAgKi9cbiAgc2V0IGNvbnRlbnQoY29udGVudCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoY29udGVudCwgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiNjb250ZW50ID0gY29udGVudDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbG9jYXRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNsb2NhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsb2NhdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb25cbiAgICovXG4gIHNldCBsb2NhdGlvbihsb2NhdGlvbikge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQobG9jYXRpb24sIGFpY2NfcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jbG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0aW5nIGZvciAjdGltZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZVxuICAgKi9cbiAgc2V0IHRpbWUodGltZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodGltZSwgYWljY19yZWdleC5DTUlUaW1lKSkge1xuICAgICAgdGhpcy4jdGltZSA9IHRpbWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmV2YXVsYXRpb24uY29tbWVudHMubiBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBjb250ZW50OiBzdHJpbmcsXG4gICAqICAgICAgbG9jYXRpb246IHN0cmluZyxcbiAgICogICAgICB0aW1lOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2NvbnRlbnQnOiB0aGlzLmNvbnRlbnQsXG4gICAgICAnbG9jYXRpb24nOiB0aGlzLmxvY2F0aW9uLFxuICAgICAgJ3RpbWUnOiB0aGlzLnRpbWUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiIsIi8vIEBmbG93XG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCBFcnJvckNvZGVzIGZyb20gJy4uL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQge1ZhbGlkYXRpb25FcnJvcn0gZnJvbSAnLi4vZXhjZXB0aW9ucyc7XG5pbXBvcnQgUmVnZXggZnJvbSAnLi4vY29uc3RhbnRzL3JlZ2V4JztcblxuY29uc3Qgc2Nvcm0xMl9jb25zdGFudHMgPSBBUElDb25zdGFudHMuc2Nvcm0xMjtcbmNvbnN0IHNjb3JtMTJfcmVnZXggPSBSZWdleC5zY29ybTEyO1xuY29uc3Qgc2Nvcm0xMl9lcnJvcl9jb2RlcyA9IEVycm9yQ29kZXMuc2Nvcm0xMjtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgdmFsdWUgbWF0Y2hlcyB0aGUgcHJvcGVyIGZvcm1hdC4gSWYgbm90LCB0aHJvdyBwcm9wZXIgZXJyb3IgY29kZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWdleFBhdHRlcm5cbiAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvckNvZGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWxsb3dFbXB0eVN0cmluZ1xuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrVmFsaWRGb3JtYXQoXG4gICAgdmFsdWU6IFN0cmluZyxcbiAgICByZWdleFBhdHRlcm46IFN0cmluZyxcbiAgICBlcnJvckNvZGU6IG51bWJlcixcbiAgICBhbGxvd0VtcHR5U3RyaW5nPzogYm9vbGVhbikge1xuICBjb25zdCBmb3JtYXRSZWdleCA9IG5ldyBSZWdFeHAocmVnZXhQYXR0ZXJuKTtcbiAgY29uc3QgbWF0Y2hlcyA9IHZhbHVlLm1hdGNoKGZvcm1hdFJlZ2V4KTtcbiAgaWYgKGFsbG93RW1wdHlTdHJpbmcgJiYgdmFsdWUgPT09ICcnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgIW1hdGNoZXMgfHwgbWF0Y2hlc1swXSA9PT0gJycpIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKGVycm9yQ29kZSk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIHZhbHVlIG1hdGNoZXMgdGhlIHByb3BlciByYW5nZS4gSWYgbm90LCB0aHJvdyBwcm9wZXIgZXJyb3IgY29kZS5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmFuZ2VQYXR0ZXJuXG4gKiBAcGFyYW0ge251bWJlcn0gZXJyb3JDb2RlXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tWYWxpZFJhbmdlKFxuICAgIHZhbHVlOiBhbnksIHJhbmdlUGF0dGVybjogU3RyaW5nLCBlcnJvckNvZGU6IG51bWJlcikge1xuICBjb25zdCByYW5nZXMgPSByYW5nZVBhdHRlcm4uc3BsaXQoJyMnKTtcbiAgdmFsdWUgPSB2YWx1ZSAqIDEuMDtcbiAgaWYgKHZhbHVlID49IHJhbmdlc1swXSkge1xuICAgIGlmICgocmFuZ2VzWzFdID09PSAnKicpIHx8ICh2YWx1ZSA8PSByYW5nZXNbMV0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihlcnJvckNvZGUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKGVycm9yQ29kZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBBUEkgY21pIG9iamVjdHNcbiAqL1xuZXhwb3J0IGNsYXNzIEJhc2VDTUkge1xuICBqc29uU3RyaW5nID0gZmFsc2U7XG4gICNpbml0aWFsaXplZCA9IGZhbHNlO1xuICAjc3RhcnRfdGltZTtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEJhc2VDTUksIGp1c3QgbWFya3MgdGhlIGNsYXNzIGFzIGFic3RyYWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAobmV3LnRhcmdldCA9PT0gQmFzZUNNSSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnN0cnVjdCBCYXNlQ01JIGluc3RhbmNlcyBkaXJlY3RseScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNpbml0aWFsaXplZFxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgZ2V0IGluaXRpYWxpemVkKCkge1xuICAgIHJldHVybiB0aGlzLiNpbml0aWFsaXplZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdGFydF90aW1lXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIGdldCBzdGFydF90aW1lKCkge1xuICAgIHJldHVybiB0aGlzLiNzdGFydF90aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHRoaXMuI2luaXRpYWxpemVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgcGxheWVyIHNob3VsZCBvdmVycmlkZSB0aGUgJ3Nlc3Npb25fdGltZScgcHJvdmlkZWQgYnlcbiAgICogdGhlIG1vZHVsZVxuICAgKi9cbiAgc2V0U3RhcnRUaW1lKCkge1xuICAgIHRoaXMuI3N0YXJ0X3RpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfVxufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGNtaSAqLnNjb3JlIG9iamVjdHNcbiAqL1xuZXhwb3J0IGNsYXNzIENNSVNjb3JlIGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgKi5zY29yZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NvcmVfY2hpbGRyZW5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjb3JlX3JhbmdlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGludmFsaWRFcnJvckNvZGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IGludmFsaWRUeXBlQ29kZVxuICAgKiBAcGFyYW0ge251bWJlcn0gaW52YWxpZFJhbmdlQ29kZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGVjaW1hbFJlZ2V4XG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHtcbiAgICAgICAgc2NvcmVfY2hpbGRyZW4sXG4gICAgICAgIHNjb3JlX3JhbmdlLFxuICAgICAgICBtYXgsXG4gICAgICAgIGludmFsaWRFcnJvckNvZGUsXG4gICAgICAgIGludmFsaWRUeXBlQ29kZSxcbiAgICAgICAgaW52YWxpZFJhbmdlQ29kZSxcbiAgICAgICAgZGVjaW1hbFJlZ2V4LFxuICAgICAgfSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLiNfY2hpbGRyZW4gPSBzY29yZV9jaGlsZHJlbiB8fFxuICAgICAgICBzY29ybTEyX2NvbnN0YW50cy5zY29yZV9jaGlsZHJlbjtcbiAgICB0aGlzLiNfc2NvcmVfcmFuZ2UgPSAhc2NvcmVfcmFuZ2UgPyBmYWxzZSA6IHNjb3JtMTJfcmVnZXguc2NvcmVfcmFuZ2U7XG4gICAgdGhpcy4jbWF4ID0gKG1heCB8fCBtYXggPT09ICcnKSA/IG1heCA6ICcxMDAnO1xuICAgIHRoaXMuI19pbnZhbGlkX2Vycm9yX2NvZGUgPSBpbnZhbGlkRXJyb3JDb2RlIHx8XG4gICAgICAgIHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUU7XG4gICAgdGhpcy4jX2ludmFsaWRfdHlwZV9jb2RlID0gaW52YWxpZFR5cGVDb2RlIHx8XG4gICAgICAgIHNjb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSDtcbiAgICB0aGlzLiNfaW52YWxpZF9yYW5nZV9jb2RlID0gaW52YWxpZFJhbmdlQ29kZSB8fFxuICAgICAgICBzY29ybTEyX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRTtcbiAgICB0aGlzLiNfZGVjaW1hbF9yZWdleCA9IGRlY2ltYWxSZWdleCB8fFxuICAgICAgICBzY29ybTEyX3JlZ2V4LkNNSURlY2ltYWw7XG4gIH1cblxuICAjX2NoaWxkcmVuO1xuICAjX3Njb3JlX3JhbmdlO1xuICAjX2ludmFsaWRfZXJyb3JfY29kZTtcbiAgI19pbnZhbGlkX3R5cGVfY29kZTtcbiAgI19pbnZhbGlkX3JhbmdlX2NvZGU7XG4gICNfZGVjaW1hbF9yZWdleDtcbiAgI3JhdyA9ICcnO1xuICAjbWluID0gJyc7XG4gICNtYXg7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgX2NoaWxkcmVuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yIF9jaGlsZHJlbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcih0aGlzLiNfaW52YWxpZF9lcnJvcl9jb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNyYXdcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHJhdygpIHtcbiAgICByZXR1cm4gdGhpcy4jcmF3O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3Jhd1xuICAgKiBAcGFyYW0ge3N0cmluZ30gcmF3XG4gICAqL1xuICBzZXQgcmF3KHJhdykge1xuICAgIGlmIChjaGVja1ZhbGlkRm9ybWF0KHJhdywgdGhpcy4jX2RlY2ltYWxfcmVnZXgsXG4gICAgICAgIHRoaXMuI19pbnZhbGlkX3R5cGVfY29kZSkgJiZcbiAgICAgICAgKCF0aGlzLiNfc2NvcmVfcmFuZ2UgfHxcbiAgICAgICAgICAgIGNoZWNrVmFsaWRSYW5nZShyYXcsIHRoaXMuI19zY29yZV9yYW5nZSxcbiAgICAgICAgICAgICAgICB0aGlzLiNfaW52YWxpZF9yYW5nZV9jb2RlKSkpIHtcbiAgICAgIHRoaXMuI3JhdyA9IHJhdztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbWluXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtaW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI21pbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNtaW5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1pblxuICAgKi9cbiAgc2V0IG1pbihtaW4pIHtcbiAgICBpZiAoY2hlY2tWYWxpZEZvcm1hdChtaW4sIHRoaXMuI19kZWNpbWFsX3JlZ2V4LFxuICAgICAgICB0aGlzLiNfaW52YWxpZF90eXBlX2NvZGUpICYmXG4gICAgICAgICghdGhpcy4jX3Njb3JlX3JhbmdlIHx8XG4gICAgICAgICAgICBjaGVja1ZhbGlkUmFuZ2UobWluLCB0aGlzLiNfc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgICAgICAgdGhpcy4jX2ludmFsaWRfcmFuZ2VfY29kZSkpKSB7XG4gICAgICB0aGlzLiNtaW4gPSBtaW47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI21heFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbWF4KCkge1xuICAgIHJldHVybiB0aGlzLiNtYXg7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbWF4XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXhcbiAgICovXG4gIHNldCBtYXgobWF4KSB7XG4gICAgaWYgKGNoZWNrVmFsaWRGb3JtYXQobWF4LCB0aGlzLiNfZGVjaW1hbF9yZWdleCxcbiAgICAgICAgdGhpcy4jX2ludmFsaWRfdHlwZV9jb2RlKSAmJlxuICAgICAgICAoIXRoaXMuI19zY29yZV9yYW5nZSB8fFxuICAgICAgICAgICAgY2hlY2tWYWxpZFJhbmdlKG1heCwgdGhpcy4jX3Njb3JlX3JhbmdlLFxuICAgICAgICAgICAgICAgIHRoaXMuI19pbnZhbGlkX3JhbmdlX2NvZGUpKSkge1xuICAgICAgdGhpcy4jbWF4ID0gbWF4O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yICouc2NvcmVcbiAgICogQHJldHVybiB7e21pbjogc3RyaW5nLCBtYXg6IHN0cmluZywgcmF3OiBzdHJpbmd9fVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3Jhdyc6IHRoaXMucmF3LFxuICAgICAgJ21pbic6IHRoaXMubWluLFxuICAgICAgJ21heCc6IHRoaXMubWF4LFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgY21pICoubiBvYmplY3RzXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlBcnJheSBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgY21pICoubiBhcnJheXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNoaWxkcmVuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvckNvZGVcbiAgICovXG4gIGNvbnN0cnVjdG9yKHtjaGlsZHJlbiwgZXJyb3JDb2RlfSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy4jX2NoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgdGhpcy4jZXJyb3JDb2RlID0gZXJyb3JDb2RlO1xuICAgIHRoaXMuY2hpbGRBcnJheSA9IFtdO1xuICB9XG5cbiAgI2Vycm9yQ29kZTtcbiAgI19jaGlsZHJlbjtcblxuICAvKipcbiAgICogR2V0dGVyIGZvciBfY2hpbGRyZW5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yIF9jaGlsZHJlbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICovXG4gIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcih0aGlzLiNlcnJvckNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgX2NvdW50XG4gICAqIEByZXR1cm4ge251bWJlcn1cbiAgICovXG4gIGdldCBfY291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRBcnJheS5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciBfY291bnQuIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge251bWJlcn0gX2NvdW50XG4gICAqL1xuICBzZXQgX2NvdW50KF9jb3VudCkge1xuICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IodGhpcy4jZXJyb3JDb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yICoubiBhcnJheXNcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdFtpICsgJyddID0gdGhpcy5jaGlsZEFycmF5W2ldO1xuICAgIH1cbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiIsIi8vIEBmbG93XG5pbXBvcnQge1xuICBCYXNlQ01JLFxuICBjaGVja1ZhbGlkRm9ybWF0LFxuICBjaGVja1ZhbGlkUmFuZ2UsXG4gIENNSUFycmF5LFxuICBDTUlTY29yZSxcbn0gZnJvbSAnLi9jb21tb24nO1xuaW1wb3J0IEFQSUNvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMvYXBpX2NvbnN0YW50cyc7XG5pbXBvcnQgRXJyb3JDb2RlcyBmcm9tICcuLi9jb25zdGFudHMvZXJyb3JfY29kZXMnO1xuaW1wb3J0IFJlZ2V4IGZyb20gJy4uL2NvbnN0YW50cy9yZWdleCc7XG5pbXBvcnQge1ZhbGlkYXRpb25FcnJvcn0gZnJvbSAnLi4vZXhjZXB0aW9ucyc7XG5pbXBvcnQgKiBhcyBVdGlsaXRpZXMgZnJvbSAnLi4vdXRpbGl0aWVzJztcbmltcG9ydCAqIGFzIFV0aWwgZnJvbSAnLi4vdXRpbGl0aWVzJztcblxuY29uc3Qgc2Nvcm0xMl9jb25zdGFudHMgPSBBUElDb25zdGFudHMuc2Nvcm0xMjtcbmNvbnN0IHNjb3JtMTJfcmVnZXggPSBSZWdleC5zY29ybTEyO1xuY29uc3Qgc2Nvcm0xMl9lcnJvcl9jb2RlcyA9IEVycm9yQ29kZXMuc2Nvcm0xMjtcblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIGZvciB0aHJvd2luZyBSZWFkIE9ubHkgZXJyb3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93UmVhZE9ubHlFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihzY29ybTEyX2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5UKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIGZvciB0aHJvd2luZyBXcml0ZSBPbmx5IGVycm9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aHJvd1dyaXRlT25seUVycm9yKCkge1xuICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHNjb3JtMTJfZXJyb3JfY29kZXMuV1JJVEVfT05MWV9FTEVNRU5UKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIGZvciB0aHJvd2luZyBJbnZhbGlkIFNldCBlcnJvclxuICovXG5mdW5jdGlvbiB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKCkge1xuICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QsIG5vIHJlYXNvbiB0byBoYXZlIHRvIHBhc3MgdGhlIHNhbWUgZXJyb3IgY29kZXMgZXZlcnkgdGltZVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHJlZ2V4UGF0dGVyblxuICogQHBhcmFtIHtib29sZWFufSBhbGxvd0VtcHR5U3RyaW5nXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2sxMlZhbGlkRm9ybWF0KFxuICAgIHZhbHVlOiBTdHJpbmcsXG4gICAgcmVnZXhQYXR0ZXJuOiBTdHJpbmcsXG4gICAgYWxsb3dFbXB0eVN0cmluZz86IGJvb2xlYW4pIHtcbiAgcmV0dXJuIGNoZWNrVmFsaWRGb3JtYXQodmFsdWUsIHJlZ2V4UGF0dGVybixcbiAgICAgIHNjb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCwgYWxsb3dFbXB0eVN0cmluZyk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCwgbm8gcmVhc29uIHRvIGhhdmUgdG8gcGFzcyB0aGUgc2FtZSBlcnJvciBjb2RlcyBldmVyeSB0aW1lXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmFuZ2VQYXR0ZXJuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGFsbG93RW1wdHlTdHJpbmdcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVjazEyVmFsaWRSYW5nZShcbiAgICB2YWx1ZTogYW55LFxuICAgIHJhbmdlUGF0dGVybjogU3RyaW5nLFxuICAgIGFsbG93RW1wdHlTdHJpbmc/OiBib29sZWFuKSB7XG4gIHJldHVybiBjaGVja1ZhbGlkUmFuZ2UodmFsdWUsIHJhbmdlUGF0dGVybixcbiAgICAgIHNjb3JtMTJfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFLCBhbGxvd0VtcHR5U3RyaW5nKTtcbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgdGhlIGNtaSBvYmplY3QgZm9yIFNDT1JNIDEuMlxuICovXG5leHBvcnQgY2xhc3MgQ01JIGV4dGVuZHMgQmFzZUNNSSB7XG4gICNfY2hpbGRyZW4gPSAnJztcbiAgI192ZXJzaW9uID0gJzMuNCc7XG4gICNsYXVuY2hfZGF0YSA9ICcnO1xuICAjY29tbWVudHMgPSAnJztcbiAgI2NvbW1lbnRzX2Zyb21fbG1zID0gJyc7XG5cbiAgc3R1ZGVudF9kYXRhID0gbnVsbDtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIHRoZSBTQ09STSAxLjIgY21pIG9iamVjdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gY21pX2NoaWxkcmVuXG4gICAqIEBwYXJhbSB7KENNSVN0dWRlbnREYXRhfEFJQ0NDTUlTdHVkZW50RGF0YSl9IHN0dWRlbnRfZGF0YVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGluaXRpYWxpemVkXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjbWlfY2hpbGRyZW4sIHN0dWRlbnRfZGF0YSwgaW5pdGlhbGl6ZWQ6IGJvb2xlYW4pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKGluaXRpYWxpemVkKSB0aGlzLmluaXRpYWxpemUoKTtcblxuICAgIHRoaXMuI19jaGlsZHJlbiA9IGNtaV9jaGlsZHJlbiA/XG4gICAgICAgIGNtaV9jaGlsZHJlbiA6XG4gICAgICAgIHNjb3JtMTJfY29uc3RhbnRzLmNtaV9jaGlsZHJlbjtcbiAgICB0aGlzLmNvcmUgPSBuZXcgQ01JQ29yZSgpO1xuICAgIHRoaXMub2JqZWN0aXZlcyA9IG5ldyBDTUlPYmplY3RpdmVzKCk7XG4gICAgdGhpcy5zdHVkZW50X2RhdGEgPSBzdHVkZW50X2RhdGEgPyBzdHVkZW50X2RhdGEgOiBuZXcgQ01JU3R1ZGVudERhdGEoKTtcbiAgICB0aGlzLnN0dWRlbnRfcHJlZmVyZW5jZSA9IG5ldyBDTUlTdHVkZW50UHJlZmVyZW5jZSgpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zID0gbmV3IENNSUludGVyYWN0aW9ucygpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmNvcmU/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLm9iamVjdGl2ZXM/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnN0dWRlbnRfZGF0YT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc3R1ZGVudF9wcmVmZXJlbmNlPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5pbnRlcmFjdGlvbnM/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHN1c3BlbmRfZGF0YTogc3RyaW5nLFxuICAgKiAgICAgIGxhdW5jaF9kYXRhOiBzdHJpbmcsXG4gICAqICAgICAgY29tbWVudHM6IHN0cmluZyxcbiAgICogICAgICBjb21tZW50c19mcm9tX2xtczogc3RyaW5nLFxuICAgKiAgICAgIGNvcmU6IENNSUNvcmUsXG4gICAqICAgICAgb2JqZWN0aXZlczogQ01JT2JqZWN0aXZlcyxcbiAgICogICAgICBzdHVkZW50X2RhdGE6IENNSVN0dWRlbnREYXRhLFxuICAgKiAgICAgIHN0dWRlbnRfcHJlZmVyZW5jZTogQ01JU3R1ZGVudFByZWZlcmVuY2UsXG4gICAqICAgICAgaW50ZXJhY3Rpb25zOiBDTUlJbnRlcmFjdGlvbnNcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3N1c3BlbmRfZGF0YSc6IHRoaXMuc3VzcGVuZF9kYXRhLFxuICAgICAgJ2xhdW5jaF9kYXRhJzogdGhpcy5sYXVuY2hfZGF0YSxcbiAgICAgICdjb21tZW50cyc6IHRoaXMuY29tbWVudHMsXG4gICAgICAnY29tbWVudHNfZnJvbV9sbXMnOiB0aGlzLmNvbW1lbnRzX2Zyb21fbG1zLFxuICAgICAgJ2NvcmUnOiB0aGlzLmNvcmUsXG4gICAgICAnb2JqZWN0aXZlcyc6IHRoaXMub2JqZWN0aXZlcyxcbiAgICAgICdzdHVkZW50X2RhdGEnOiB0aGlzLnN0dWRlbnRfZGF0YSxcbiAgICAgICdzdHVkZW50X3ByZWZlcmVuY2UnOiB0aGlzLnN0dWRlbnRfcHJlZmVyZW5jZSxcbiAgICAgICdpbnRlcmFjdGlvbnMnOiB0aGlzLmludGVyYWN0aW9ucyxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNfdmVyc2lvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgX3ZlcnNpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI192ZXJzaW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI192ZXJzaW9uLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF92ZXJzaW9uXG4gICAqL1xuICBzZXQgX3ZlcnNpb24oX3ZlcnNpb24pIHtcbiAgICB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfdmVyc2lvbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICovXG4gIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgdGhyb3dJbnZhbGlkVmFsdWVFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N1c3BlbmRfZGF0YVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3VzcGVuZF9kYXRhKCkge1xuICAgIHJldHVybiB0aGlzLmNvcmU/LnN1c3BlbmRfZGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdXNwZW5kX2RhdGFcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN1c3BlbmRfZGF0YVxuICAgKi9cbiAgc2V0IHN1c3BlbmRfZGF0YShzdXNwZW5kX2RhdGEpIHtcbiAgICBpZiAodGhpcy5jb3JlKSB7XG4gICAgICB0aGlzLmNvcmUuc3VzcGVuZF9kYXRhID0gc3VzcGVuZF9kYXRhO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsYXVuY2hfZGF0YVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGF1bmNoX2RhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xhdW5jaF9kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xhdW5jaF9kYXRhLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhdW5jaF9kYXRhXG4gICAqL1xuICBzZXQgbGF1bmNoX2RhdGEobGF1bmNoX2RhdGEpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2xhdW5jaF9kYXRhID0gbGF1bmNoX2RhdGEgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb21tZW50c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29tbWVudHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbW1lbnRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbW1lbnRzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21tZW50c1xuICAgKi9cbiAgc2V0IGNvbW1lbnRzKGNvbW1lbnRzKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChjb21tZW50cywgc2Nvcm0xMl9yZWdleC5DTUlTdHJpbmc0MDk2KSkge1xuICAgICAgdGhpcy4jY29tbWVudHMgPSBjb21tZW50cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29tbWVudHNfZnJvbV9sbXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbW1lbnRzX2Zyb21fbG1zKCkge1xuICAgIHJldHVybiB0aGlzLiNjb21tZW50c19mcm9tX2xtcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21tZW50c19mcm9tX2xtcy4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21tZW50c19mcm9tX2xtc1xuICAgKi9cbiAgc2V0IGNvbW1lbnRzX2Zyb21fbG1zKGNvbW1lbnRzX2Zyb21fbG1zKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNjb21tZW50c19mcm9tX2xtcyA9IGNvbW1lbnRzX2Zyb21fbG1zIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgY3VycmVudCBzZXNzaW9uIHRpbWUgdG8gdGhlIGV4aXN0aW5nIHRvdGFsIHRpbWUuXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldEN1cnJlbnRUb3RhbFRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29yZS5nZXRDdXJyZW50VG90YWxUaW1lKHRoaXMuc3RhcnRfdGltZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgdGhlIGNtaS5jb3JlIG9iamVjdFxuICogQGV4dGVuZHMgQmFzZUNNSVxuICovXG5jbGFzcyBDTUlDb3JlIGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmNvcmVcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnNjb3JlID0gbmV3IENNSVNjb3JlKFxuICAgICAgICB7XG4gICAgICAgICAgc2NvcmVfY2hpbGRyZW46IHNjb3JtMTJfY29uc3RhbnRzLnNjb3JlX2NoaWxkcmVuLFxuICAgICAgICAgIHNjb3JlX3JhbmdlOiBzY29ybTEyX3JlZ2V4LnNjb3JlX3JhbmdlLFxuICAgICAgICAgIGludmFsaWRFcnJvckNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUsXG4gICAgICAgICAgaW52YWxpZFR5cGVDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gsXG4gICAgICAgICAgaW52YWxpZFJhbmdlQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UsXG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnNjb3JlPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAjX2NoaWxkcmVuID0gc2Nvcm0xMl9jb25zdGFudHMuY29yZV9jaGlsZHJlbjtcbiAgI3N0dWRlbnRfaWQgPSAnJztcbiAgI3N0dWRlbnRfbmFtZSA9ICcnO1xuICAjbGVzc29uX2xvY2F0aW9uID0gJyc7XG4gICNjcmVkaXQgPSAnJztcbiAgI2xlc3Nvbl9zdGF0dXMgPSAnbm90IGF0dGVtcHRlZCc7XG4gICNlbnRyeSA9ICcnO1xuICAjdG90YWxfdGltZSA9ICcnO1xuICAjbGVzc29uX21vZGUgPSAnbm9ybWFsJztcbiAgI2V4aXQgPSAnJztcbiAgI3Nlc3Npb25fdGltZSA9ICcwMDowMDowMCc7XG4gICNzdXNwZW5kX2RhdGEgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93SW52YWxpZFZhbHVlRXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdHVkZW50X2lkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdHVkZW50X2lkKCkge1xuICAgIHJldHVybiB0aGlzLiNzdHVkZW50X2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N0dWRlbnRfaWQuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3R1ZGVudF9pZFxuICAgKi9cbiAgc2V0IHN0dWRlbnRfaWQoc3R1ZGVudF9pZCkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jc3R1ZGVudF9pZCA9IHN0dWRlbnRfaWQgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdHVkZW50X25hbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN0dWRlbnRfbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jc3R1ZGVudF9uYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N0dWRlbnRfbmFtZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHVkZW50X25hbWVcbiAgICovXG4gIHNldCBzdHVkZW50X25hbWUoc3R1ZGVudF9uYW1lKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNzdHVkZW50X25hbWUgPSBzdHVkZW50X25hbWUgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsZXNzb25fbG9jYXRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlc3Nvbl9sb2NhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jbGVzc29uX2xvY2F0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xlc3Nvbl9sb2NhdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGVzc29uX2xvY2F0aW9uXG4gICAqL1xuICBzZXQgbGVzc29uX2xvY2F0aW9uKGxlc3Nvbl9sb2NhdGlvbikge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQobGVzc29uX2xvY2F0aW9uLCBzY29ybTEyX3JlZ2V4LkNNSVN0cmluZzI1NiwgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI2xlc3Nvbl9sb2NhdGlvbiA9IGxlc3Nvbl9sb2NhdGlvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY3JlZGl0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjcmVkaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NyZWRpdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjcmVkaXQuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY3JlZGl0XG4gICAqL1xuICBzZXQgY3JlZGl0KGNyZWRpdCkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jY3JlZGl0ID0gY3JlZGl0IDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVzc29uX3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVzc29uX3N0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jbGVzc29uX3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZXNzb25fc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZXNzb25fc3RhdHVzXG4gICAqL1xuICBzZXQgbGVzc29uX3N0YXR1cyhsZXNzb25fc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChsZXNzb25fc3RhdHVzLCBzY29ybTEyX3JlZ2V4LkNNSVN0YXR1cykpIHtcbiAgICAgIHRoaXMuI2xlc3Nvbl9zdGF0dXMgPSBsZXNzb25fc3RhdHVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNlbnRyeVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZW50cnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2VudHJ5O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2VudHJ5LiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGVudHJ5XG4gICAqL1xuICBzZXQgZW50cnkoZW50cnkpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2VudHJ5ID0gZW50cnkgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0b3RhbF90aW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0b3RhbF90aW1lKCkge1xuICAgIHJldHVybiB0aGlzLiN0b3RhbF90aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RvdGFsX3RpbWUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG90YWxfdGltZVxuICAgKi9cbiAgc2V0IHRvdGFsX3RpbWUodG90YWxfdGltZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jdG90YWxfdGltZSA9IHRvdGFsX3RpbWUgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsZXNzb25fbW9kZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVzc29uX21vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlc3Nvbl9tb2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xlc3Nvbl9tb2RlLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlc3Nvbl9tb2RlXG4gICAqL1xuICBzZXQgbGVzc29uX21vZGUobGVzc29uX21vZGUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2xlc3Nvbl9tb2RlID0gbGVzc29uX21vZGUgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNleGl0LiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IGV4aXQoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2V4aXQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZXhpdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXhpdFxuICAgKi9cbiAgc2V0IGV4aXQoZXhpdCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoZXhpdCwgc2Nvcm0xMl9yZWdleC5DTUlFeGl0LCB0cnVlKSkge1xuICAgICAgdGhpcy4jZXhpdCA9IGV4aXQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Nlc3Npb25fdGltZS4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCBzZXNzaW9uX3RpbWUoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI3Nlc3Npb25fdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzZXNzaW9uX3RpbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlc3Npb25fdGltZVxuICAgKi9cbiAgc2V0IHNlc3Npb25fdGltZShzZXNzaW9uX3RpbWUpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHNlc3Npb25fdGltZSwgc2Nvcm0xMl9yZWdleC5DTUlUaW1lc3BhbikpIHtcbiAgICAgIHRoaXMuI3Nlc3Npb25fdGltZSA9IHNlc3Npb25fdGltZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3VzcGVuZF9kYXRhXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdXNwZW5kX2RhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N1c3BlbmRfZGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdXNwZW5kX2RhdGFcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN1c3BlbmRfZGF0YVxuICAgKi9cbiAgc2V0IHN1c3BlbmRfZGF0YShzdXNwZW5kX2RhdGEpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHN1c3BlbmRfZGF0YSwgc2Nvcm0xMl9yZWdleC5DTUlTdHJpbmc0MDk2LCB0cnVlKSkge1xuICAgICAgdGhpcy4jc3VzcGVuZF9kYXRhID0gc3VzcGVuZF9kYXRhO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHRoZSBjdXJyZW50IHNlc3Npb24gdGltZSB0byB0aGUgZXhpc3RpbmcgdG90YWwgdGltZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0X3RpbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0Q3VycmVudFRvdGFsVGltZShzdGFydF90aW1lOiBOdW1iZXIpIHtcbiAgICBsZXQgc2Vzc2lvblRpbWUgPSB0aGlzLiNzZXNzaW9uX3RpbWU7XG4gICAgY29uc3Qgc3RhcnRUaW1lID0gc3RhcnRfdGltZTtcblxuICAgIGlmICh0eXBlb2Ygc3RhcnRUaW1lICE9PSAndW5kZWZpbmVkJyB8fCBzdGFydFRpbWUgPT09IG51bGwpIHtcbiAgICAgIGNvbnN0IHNlY29uZHMgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0YXJ0VGltZTtcbiAgICAgIHNlc3Npb25UaW1lID0gVXRpbC5nZXRTZWNvbmRzQXNISE1NU1Moc2Vjb25kcyAvIDEwMDApO1xuICAgIH1cblxuICAgIHJldHVybiBVdGlsaXRpZXMuYWRkSEhNTVNTVGltZVN0cmluZ3MoXG4gICAgICAgIHRoaXMuI3RvdGFsX3RpbWUsXG4gICAgICAgIHNlc3Npb25UaW1lLFxuICAgICAgICBuZXcgUmVnRXhwKHNjb3JtMTJfcmVnZXguQ01JVGltZXNwYW4pLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuY29yZVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHN0dWRlbnRfbmFtZTogc3RyaW5nLFxuICAgKiAgICAgIGVudHJ5OiBzdHJpbmcsXG4gICAqICAgICAgZXhpdDogc3RyaW5nLFxuICAgKiAgICAgIHNjb3JlOiBDTUlTY29yZSxcbiAgICogICAgICBzdHVkZW50X2lkOiBzdHJpbmcsXG4gICAqICAgICAgbGVzc29uX21vZGU6IHN0cmluZyxcbiAgICogICAgICBsZXNzb25fbG9jYXRpb246IHN0cmluZyxcbiAgICogICAgICBsZXNzb25fc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgY3JlZGl0OiBzdHJpbmcsXG4gICAqICAgICAgc2Vzc2lvbl90aW1lOiAqXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdzdHVkZW50X2lkJzogdGhpcy5zdHVkZW50X2lkLFxuICAgICAgJ3N0dWRlbnRfbmFtZSc6IHRoaXMuc3R1ZGVudF9uYW1lLFxuICAgICAgJ2xlc3Nvbl9sb2NhdGlvbic6IHRoaXMubGVzc29uX2xvY2F0aW9uLFxuICAgICAgJ2NyZWRpdCc6IHRoaXMuY3JlZGl0LFxuICAgICAgJ2xlc3Nvbl9zdGF0dXMnOiB0aGlzLmxlc3Nvbl9zdGF0dXMsXG4gICAgICAnZW50cnknOiB0aGlzLmVudHJ5LFxuICAgICAgJ2xlc3Nvbl9tb2RlJzogdGhpcy5sZXNzb25fbW9kZSxcbiAgICAgICdleGl0JzogdGhpcy5leGl0LFxuICAgICAgJ3Nlc3Npb25fdGltZSc6IHRoaXMuc2Vzc2lvbl90aW1lLFxuICAgICAgJ3Njb3JlJzogdGhpcy5zY29yZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkub2JqZWN0aXZlcyBvYmplY3RcbiAqIEBleHRlbmRzIENNSUFycmF5XG4gKi9cbmNsYXNzIENNSU9iamVjdGl2ZXMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLm9iamVjdGl2ZXNcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtcbiAgICAgIGNoaWxkcmVuOiBzY29ybTEyX2NvbnN0YW50cy5vYmplY3RpdmVzX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5zdHVkZW50X2RhdGEgb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlTdHVkZW50RGF0YSBleHRlbmRzIEJhc2VDTUkge1xuICAjX2NoaWxkcmVuO1xuICAjbWFzdGVyeV9zY29yZSA9ICcnO1xuICAjbWF4X3RpbWVfYWxsb3dlZCA9ICcnO1xuICAjdGltZV9saW1pdF9hY3Rpb24gPSAnJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5zdHVkZW50X2RhdGFcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0dWRlbnRfZGF0YV9jaGlsZHJlblxuICAgKi9cbiAgY29uc3RydWN0b3Ioc3R1ZGVudF9kYXRhX2NoaWxkcmVuKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuI19jaGlsZHJlbiA9IHN0dWRlbnRfZGF0YV9jaGlsZHJlbiA/XG4gICAgICAgIHN0dWRlbnRfZGF0YV9jaGlsZHJlbiA6XG4gICAgICAgIHNjb3JtMTJfY29uc3RhbnRzLnN0dWRlbnRfZGF0YV9jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNfY2hpbGRyZW5cbiAgICogQHJldHVybiB7Kn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93SW52YWxpZFZhbHVlRXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNtYXN0ZXJfc2NvcmVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1hc3Rlcnlfc2NvcmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI21hc3Rlcnlfc2NvcmU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbWFzdGVyX3Njb3JlLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1hc3Rlcnlfc2NvcmVcbiAgICovXG4gIHNldCBtYXN0ZXJ5X3Njb3JlKG1hc3Rlcnlfc2NvcmUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI21hc3Rlcnlfc2NvcmUgPSBtYXN0ZXJ5X3Njb3JlIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbWF4X3RpbWVfYWxsb3dlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbWF4X3RpbWVfYWxsb3dlZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jbWF4X3RpbWVfYWxsb3dlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNtYXhfdGltZV9hbGxvd2VkLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1heF90aW1lX2FsbG93ZWRcbiAgICovXG4gIHNldCBtYXhfdGltZV9hbGxvd2VkKG1heF90aW1lX2FsbG93ZWQpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI21heF90aW1lX2FsbG93ZWQgPSBtYXhfdGltZV9hbGxvd2VkIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZV9saW1pdF9hY3Rpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpbWVfbGltaXRfYWN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiN0aW1lX2xpbWl0X2FjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lX2xpbWl0X2FjdGlvbi4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lX2xpbWl0X2FjdGlvblxuICAgKi9cbiAgc2V0IHRpbWVfbGltaXRfYWN0aW9uKHRpbWVfbGltaXRfYWN0aW9uKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiN0aW1lX2xpbWl0X2FjdGlvbiA9IHRpbWVfbGltaXRfYWN0aW9uIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9kYXRhXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgbWF4X3RpbWVfYWxsb3dlZDogc3RyaW5nLFxuICAgKiAgICAgIHRpbWVfbGltaXRfYWN0aW9uOiBzdHJpbmcsXG4gICAqICAgICAgbWFzdGVyeV9zY29yZTogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdtYXN0ZXJ5X3Njb3JlJzogdGhpcy5tYXN0ZXJ5X3Njb3JlLFxuICAgICAgJ21heF90aW1lX2FsbG93ZWQnOiB0aGlzLm1heF90aW1lX2FsbG93ZWQsXG4gICAgICAndGltZV9saW1pdF9hY3Rpb24nOiB0aGlzLnRpbWVfbGltaXRfYWN0aW9uLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5zdHVkZW50X3ByZWZlcmVuY2Ugb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlTdHVkZW50UHJlZmVyZW5jZSBleHRlbmRzIEJhc2VDTUkge1xuICAjX2NoaWxkcmVuO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLnN0dWRlbnRfcHJlZmVyZW5jZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW4pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy4jX2NoaWxkcmVuID0gc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuID9cbiAgICAgICAgc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuIDpcbiAgICAgICAgc2Nvcm0xMl9jb25zdGFudHMuc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuO1xuICB9XG5cbiAgI2F1ZGlvID0gJyc7XG4gICNsYW5ndWFnZSA9ICcnO1xuICAjc3BlZWQgPSAnJztcbiAgI3RleHQgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93SW52YWxpZFZhbHVlRXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNhdWRpb1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgYXVkaW8oKSB7XG4gICAgcmV0dXJuIHRoaXMuI2F1ZGlvO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2F1ZGlvXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdWRpb1xuICAgKi9cbiAgc2V0IGF1ZGlvKGF1ZGlvKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChhdWRpbywgc2Nvcm0xMl9yZWdleC5DTUlTSW50ZWdlcikgJiZcbiAgICAgICAgY2hlY2sxMlZhbGlkUmFuZ2UoYXVkaW8sIHNjb3JtMTJfcmVnZXguYXVkaW9fcmFuZ2UpKSB7XG4gICAgICB0aGlzLiNhdWRpbyA9IGF1ZGlvO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsYW5ndWFnZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGFuZ3VhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xhbmd1YWdlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xhbmd1YWdlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZVxuICAgKi9cbiAgc2V0IGxhbmd1YWdlKGxhbmd1YWdlKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChsYW5ndWFnZSwgc2Nvcm0xMl9yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiNsYW5ndWFnZSA9IGxhbmd1YWdlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzcGVlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3BlZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3NwZWVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3NwZWVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzcGVlZFxuICAgKi9cbiAgc2V0IHNwZWVkKHNwZWVkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzcGVlZCwgc2Nvcm0xMl9yZWdleC5DTUlTSW50ZWdlcikgJiZcbiAgICAgICAgY2hlY2sxMlZhbGlkUmFuZ2Uoc3BlZWQsIHNjb3JtMTJfcmVnZXguc3BlZWRfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiNzcGVlZCA9IHNwZWVkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0ZXh0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0ZXh0KCkge1xuICAgIHJldHVybiB0aGlzLiN0ZXh0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RleHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiAgICovXG4gIHNldCB0ZXh0KHRleHQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHRleHQsIHNjb3JtMTJfcmVnZXguQ01JU0ludGVnZXIpICYmXG4gICAgICAgIGNoZWNrMTJWYWxpZFJhbmdlKHRleHQsIHNjb3JtMTJfcmVnZXgudGV4dF9yYW5nZSkpIHtcbiAgICAgIHRoaXMuI3RleHQgPSB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5zdHVkZW50X3ByZWZlcmVuY2VcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBhdWRpbzogc3RyaW5nLFxuICAgKiAgICAgIGxhbmd1YWdlOiBzdHJpbmcsXG4gICAqICAgICAgc3BlZWQ6IHN0cmluZyxcbiAgICogICAgICB0ZXh0OiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2F1ZGlvJzogdGhpcy5hdWRpbyxcbiAgICAgICdsYW5ndWFnZSc6IHRoaXMubGFuZ3VhZ2UsXG4gICAgICAnc3BlZWQnOiB0aGlzLnNwZWVkLFxuICAgICAgJ3RleHQnOiB0aGlzLnRleHQsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLmludGVyYWN0aW9ucyBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuY2xhc3MgQ01JSW50ZXJhY3Rpb25zIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5pbnRlcmFjdGlvbnNcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtcbiAgICAgIGNoaWxkcmVuOiBzY29ybTEyX2NvbnN0YW50cy5pbnRlcmFjdGlvbnNfY2hpbGRyZW4sXG4gICAgICBlcnJvckNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLmludGVyYWN0aW9ucy5uIG9iamVjdFxuICogQGV4dGVuZHMgQmFzZUNNSVxuICovXG5leHBvcnQgY2xhc3MgQ01JSW50ZXJhY3Rpb25zT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmludGVyYWN0aW9ucy5uIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMub2JqZWN0aXZlcyA9IG5ldyBDTUlBcnJheSh7XG4gICAgICBlcnJvckNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUsXG4gICAgICBjaGlsZHJlbjogc2Nvcm0xMl9jb25zdGFudHMub2JqZWN0aXZlc19jaGlsZHJlbixcbiAgICB9KTtcbiAgICB0aGlzLmNvcnJlY3RfcmVzcG9uc2VzID0gbmV3IENNSUFycmF5KHtcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgIGNoaWxkcmVuOiBzY29ybTEyX2NvbnN0YW50cy5jb3JyZWN0X3Jlc3BvbnNlc19jaGlsZHJlbixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5vYmplY3RpdmVzPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5jb3JyZWN0X3Jlc3BvbnNlcz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI2lkID0gJyc7XG4gICN0aW1lID0gJyc7XG4gICN0eXBlID0gJyc7XG4gICN3ZWlnaHRpbmcgPSAnJztcbiAgI3N0dWRlbnRfcmVzcG9uc2UgPSAnJztcbiAgI3Jlc3VsdCA9ICcnO1xuICAjbGF0ZW5jeSA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNpZC4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjaWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBzZXQgaWQoaWQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGlkLCBzY29ybTEyX3JlZ2V4LkNNSUlkZW50aWZpZXIpKSB7XG4gICAgICB0aGlzLiNpZCA9IGlkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lLiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IHRpbWUoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGltZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZVxuICAgKi9cbiAgc2V0IHRpbWUodGltZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodGltZSwgc2Nvcm0xMl9yZWdleC5DTUlUaW1lKSkge1xuICAgICAgdGhpcy4jdGltZSA9IHRpbWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3R5cGUuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jdHlwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0eXBlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gICAqL1xuICBzZXQgdHlwZSh0eXBlKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0eXBlLCBzY29ybTEyX3JlZ2V4LkNNSVR5cGUpKSB7XG4gICAgICB0aGlzLiN0eXBlID0gdHlwZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjd2VpZ2h0aW5nLiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IHdlaWdodGluZygpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID9cbiAgICAgICAgdGhyb3dXcml0ZU9ubHlFcnJvcigpIDpcbiAgICAgICAgdGhpcy4jd2VpZ2h0aW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3dlaWdodGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gd2VpZ2h0aW5nXG4gICAqL1xuICBzZXQgd2VpZ2h0aW5nKHdlaWdodGluZykge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQod2VpZ2h0aW5nLCBzY29ybTEyX3JlZ2V4LkNNSURlY2ltYWwpICYmXG4gICAgICAgIGNoZWNrMTJWYWxpZFJhbmdlKHdlaWdodGluZywgc2Nvcm0xMl9yZWdleC53ZWlnaHRpbmdfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiN3ZWlnaHRpbmcgPSB3ZWlnaHRpbmc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N0dWRlbnRfcmVzcG9uc2UuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgc3R1ZGVudF9yZXNwb25zZSgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jc3R1ZGVudF9yZXNwb25zZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdHVkZW50X3Jlc3BvbnNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHVkZW50X3Jlc3BvbnNlXG4gICAqL1xuICBzZXQgc3R1ZGVudF9yZXNwb25zZShzdHVkZW50X3Jlc3BvbnNlKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzdHVkZW50X3Jlc3BvbnNlLCBzY29ybTEyX3JlZ2V4LkNNSUZlZWRiYWNrLCB0cnVlKSkge1xuICAgICAgdGhpcy4jc3R1ZGVudF9yZXNwb25zZSA9IHN0dWRlbnRfcmVzcG9uc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Jlc3VsdC4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCByZXN1bHQoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI3Jlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNyZXN1bHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlc3VsdFxuICAgKi9cbiAgc2V0IHJlc3VsdChyZXN1bHQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHJlc3VsdCwgc2Nvcm0xMl9yZWdleC5DTUlSZXN1bHQpKSB7XG4gICAgICB0aGlzLiNyZXN1bHQgPSByZXN1bHQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xhdGVuY3kuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgbGF0ZW5jeSgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jbGF0ZW5jeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsYXRlbmN5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsYXRlbmN5XG4gICAqL1xuICBzZXQgbGF0ZW5jeShsYXRlbmN5KSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChsYXRlbmN5LCBzY29ybTEyX3JlZ2V4LkNNSVRpbWVzcGFuKSkge1xuICAgICAgdGhpcy4jbGF0ZW5jeSA9IGxhdGVuY3k7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmludGVyYWN0aW9ucy5uXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgaWQ6IHN0cmluZyxcbiAgICogICAgICB0aW1lOiBzdHJpbmcsXG4gICAqICAgICAgdHlwZTogc3RyaW5nLFxuICAgKiAgICAgIHdlaWdodGluZzogc3RyaW5nLFxuICAgKiAgICAgIHN0dWRlbnRfcmVzcG9uc2U6IHN0cmluZyxcbiAgICogICAgICByZXN1bHQ6IHN0cmluZyxcbiAgICogICAgICBsYXRlbmN5OiBzdHJpbmcsXG4gICAqICAgICAgb2JqZWN0aXZlczogQ01JQXJyYXksXG4gICAqICAgICAgY29ycmVjdF9yZXNwb25zZXM6IENNSUFycmF5XG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdpZCc6IHRoaXMuaWQsXG4gICAgICAndGltZSc6IHRoaXMudGltZSxcbiAgICAgICd0eXBlJzogdGhpcy50eXBlLFxuICAgICAgJ3dlaWdodGluZyc6IHRoaXMud2VpZ2h0aW5nLFxuICAgICAgJ3N0dWRlbnRfcmVzcG9uc2UnOiB0aGlzLnN0dWRlbnRfcmVzcG9uc2UsXG4gICAgICAncmVzdWx0JzogdGhpcy5yZXN1bHQsXG4gICAgICAnbGF0ZW5jeSc6IHRoaXMubGF0ZW5jeSxcbiAgICAgICdvYmplY3RpdmVzJzogdGhpcy5vYmplY3RpdmVzLFxuICAgICAgJ2NvcnJlY3RfcmVzcG9uc2VzJzogdGhpcy5jb3JyZWN0X3Jlc3BvbnNlcyxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkub2JqZWN0aXZlcy5uIG9iamVjdFxuICogQGV4dGVuZHMgQmFzZUNNSVxuICovXG5leHBvcnQgY2xhc3MgQ01JT2JqZWN0aXZlc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5vYmplY3RpdmVzLm5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnNjb3JlID0gbmV3IENNSVNjb3JlKFxuICAgICAgICB7XG4gICAgICAgICAgc2NvcmVfY2hpbGRyZW46IHNjb3JtMTJfY29uc3RhbnRzLnNjb3JlX2NoaWxkcmVuLFxuICAgICAgICAgIHNjb3JlX3JhbmdlOiBzY29ybTEyX3JlZ2V4LnNjb3JlX3JhbmdlLFxuICAgICAgICAgIGludmFsaWRFcnJvckNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUsXG4gICAgICAgICAgaW52YWxpZFR5cGVDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gsXG4gICAgICAgICAgaW52YWxpZFJhbmdlQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UsXG4gICAgICAgIH0pO1xuICB9XG5cbiAgI2lkID0gJyc7XG4gICNzdGF0dXMgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaWRcbiAgICogQHJldHVybiB7XCJcIn1cbiAgICovXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjaWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBzZXQgaWQoaWQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGlkLCBzY29ybTEyX3JlZ2V4LkNNSUlkZW50aWZpZXIpKSB7XG4gICAgICB0aGlzLiNpZCA9IGlkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdGF0dXNcbiAgICogQHJldHVybiB7XCJcIn1cbiAgICovXG4gIGdldCBzdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXR1c1xuICAgKi9cbiAgc2V0IHN0YXR1cyhzdGF0dXMpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHN0YXR1cywgc2Nvcm0xMl9yZWdleC5DTUlTdGF0dXMyKSkge1xuICAgICAgdGhpcy4jc3RhdHVzID0gc3RhdHVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5vYmplY3RpdmVzLm5cbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBpZDogc3RyaW5nLFxuICAgKiAgICAgIHN0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIHNjb3JlOiBDTUlTY29yZVxuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnaWQnOiB0aGlzLmlkLFxuICAgICAgJ3N0YXR1cyc6IHRoaXMuc3RhdHVzLFxuICAgICAgJ3Njb3JlJzogdGhpcy5zY29yZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkuaW50ZXJhY3Rpb25zLm4ub2JqZWN0aXZlcy5uIG9iamVjdFxuICogQGV4dGVuZHMgQmFzZUNNSVxuICovXG5leHBvcnQgY2xhc3MgQ01JSW50ZXJhY3Rpb25zT2JqZWN0aXZlc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5pbnRlcmFjdGlvbnMubi5vYmplY3RpdmVzLm5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAjaWQgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaWRcbiAgICogQHJldHVybiB7XCJcIn1cbiAgICovXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjaWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBzZXQgaWQoaWQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGlkLCBzY29ybTEyX3JlZ2V4LkNNSUlkZW50aWZpZXIpKSB7XG4gICAgICB0aGlzLiNpZCA9IGlkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5pbnRlcmFjdGlvbnMubi5vYmplY3RpdmVzLm5cbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBpZDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdpZCc6IHRoaXMuaWQsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLmludGVyYWN0aW9ucy5jb3JyZWN0X3Jlc3BvbnNlcy5uIG9iamVjdFxuICogQGV4dGVuZHMgQmFzZUNNSVxuICovXG5leHBvcnQgY2xhc3MgQ01JSW50ZXJhY3Rpb25zQ29ycmVjdFJlc3BvbnNlc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5pbnRlcmFjdGlvbnMuY29ycmVjdF9yZXNwb25zZXMublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gICNwYXR0ZXJuID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3BhdHRlcm5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHBhdHRlcm4oKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI3BhdHRlcm47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcGF0dGVyblxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0dGVyblxuICAgKi9cbiAgc2V0IHBhdHRlcm4ocGF0dGVybikge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQocGF0dGVybiwgc2Nvcm0xMl9yZWdleC5DTUlGZWVkYmFjaywgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI3BhdHRlcm4gPSBwYXR0ZXJuO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5pbnRlcmFjdGlvbnMuY29ycmVjdF9yZXNwb25zZXMublxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHBhdHRlcm46IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAncGF0dGVybic6IHRoaXMucGF0dGVybixcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBBSUNDIE5hdmlnYXRpb24gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBOQVYgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBOQVYgb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgI2V2ZW50ID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2V2ZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBldmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy4jZXZlbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZXZlbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAqL1xuICBzZXQgZXZlbnQoZXZlbnQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGV2ZW50LCBzY29ybTEyX3JlZ2V4Lk5BVkV2ZW50KSkge1xuICAgICAgdGhpcy4jZXZlbnQgPSBldmVudDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBuYXYgb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgZXZlbnQ6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnZXZlbnQnOiB0aGlzLmV2ZW50LFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iLCIvLyBAZmxvd1xuaW1wb3J0IHtcbiAgQmFzZUNNSSxcbiAgY2hlY2tWYWxpZEZvcm1hdCxcbiAgY2hlY2tWYWxpZFJhbmdlLFxuICBDTUlBcnJheSxcbiAgQ01JU2NvcmUsXG59IGZyb20gJy4vY29tbW9uJztcbmltcG9ydCBBUElDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IFJlZ2V4IGZyb20gJy4uL2NvbnN0YW50cy9yZWdleCc7XG5pbXBvcnQgRXJyb3JDb2RlcyBmcm9tICcuLi9jb25zdGFudHMvZXJyb3JfY29kZXMnO1xuaW1wb3J0IFJlc3BvbnNlcyBmcm9tICcuLi9jb25zdGFudHMvcmVzcG9uc2VfY29uc3RhbnRzJztcbmltcG9ydCB7VmFsaWRhdGlvbkVycm9yfSBmcm9tICcuLi9leGNlcHRpb25zJztcbmltcG9ydCAqIGFzIFV0aWwgZnJvbSAnLi4vdXRpbGl0aWVzJztcblxuY29uc3Qgc2Nvcm0yMDA0X2NvbnN0YW50cyA9IEFQSUNvbnN0YW50cy5zY29ybTIwMDQ7XG5jb25zdCBzY29ybTIwMDRfZXJyb3JfY29kZXMgPSBFcnJvckNvZGVzLnNjb3JtMjAwNDtcbmNvbnN0IGxlYXJuZXJfcmVzcG9uc2VzID0gUmVzcG9uc2VzLmxlYXJuZXI7XG5cbmNvbnN0IHNjb3JtMjAwNF9yZWdleCA9IFJlZ2V4LnNjb3JtMjAwNDtcblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIGZvciB0aHJvd2luZyBSZWFkIE9ubHkgZXJyb3JcbiAqL1xuZnVuY3Rpb24gdGhyb3dSZWFkT25seUVycm9yKCkge1xuICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgV3JpdGUgT25seSBlcnJvclxuICovXG5mdW5jdGlvbiB0aHJvd1dyaXRlT25seUVycm9yKCkge1xuICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5XUklURV9PTkxZX0VMRU1FTlQpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QgZm9yIHRocm93aW5nIFR5cGUgTWlzbWF0Y2ggZXJyb3JcbiAqL1xuZnVuY3Rpb24gdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCwgbm8gcmVhc29uIHRvIGhhdmUgdG8gcGFzcyB0aGUgc2FtZSBlcnJvciBjb2RlcyBldmVyeSB0aW1lXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVnZXhQYXR0ZXJuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGFsbG93RW1wdHlTdHJpbmdcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGNoZWNrMjAwNFZhbGlkRm9ybWF0KFxuICAgIHZhbHVlOiBTdHJpbmcsXG4gICAgcmVnZXhQYXR0ZXJuOiBTdHJpbmcsXG4gICAgYWxsb3dFbXB0eVN0cmluZz86IGJvb2xlYW4pIHtcbiAgcmV0dXJuIGNoZWNrVmFsaWRGb3JtYXQodmFsdWUsIHJlZ2V4UGF0dGVybixcbiAgICAgIHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENILCBhbGxvd0VtcHR5U3RyaW5nKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kLCBubyByZWFzb24gdG8gaGF2ZSB0byBwYXNzIHRoZSBzYW1lIGVycm9yIGNvZGVzIGV2ZXJ5IHRpbWVcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByYW5nZVBhdHRlcm5cbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGNoZWNrMjAwNFZhbGlkUmFuZ2UodmFsdWU6IGFueSwgcmFuZ2VQYXR0ZXJuOiBTdHJpbmcpIHtcbiAgcmV0dXJuIGNoZWNrVmFsaWRSYW5nZSh2YWx1ZSwgcmFuZ2VQYXR0ZXJuLFxuICAgICAgc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRSk7XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGNtaSBvYmplY3QgZm9yIFNDT1JNIDIwMDRcbiAqL1xuZXhwb3J0IGNsYXNzIENNSSBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIHRoZSBTQ09STSAyMDA0IGNtaSBvYmplY3RcbiAgICogQHBhcmFtIHtib29sZWFufSBpbml0aWFsaXplZFxuICAgKi9cbiAgY29uc3RydWN0b3IoaW5pdGlhbGl6ZWQ6IGJvb2xlYW4pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5sZWFybmVyX3ByZWZlcmVuY2UgPSBuZXcgQ01JTGVhcm5lclByZWZlcmVuY2UoKTtcbiAgICB0aGlzLnNjb3JlID0gbmV3IFNjb3JtMjAwNENNSVNjb3JlKCk7XG4gICAgdGhpcy5jb21tZW50c19mcm9tX2xlYXJuZXIgPSBuZXcgQ01JQ29tbWVudHNGcm9tTGVhcm5lcigpO1xuICAgIHRoaXMuY29tbWVudHNfZnJvbV9sbXMgPSBuZXcgQ01JQ29tbWVudHNGcm9tTE1TKCk7XG4gICAgdGhpcy5pbnRlcmFjdGlvbnMgPSBuZXcgQ01JSW50ZXJhY3Rpb25zKCk7XG4gICAgdGhpcy5vYmplY3RpdmVzID0gbmV3IENNSU9iamVjdGl2ZXMoKTtcblxuICAgIGlmIChpbml0aWFsaXplZCkgdGhpcy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAjX3ZlcnNpb24gPSAnMS4wJztcbiAgI19jaGlsZHJlbiA9IHNjb3JtMjAwNF9jb25zdGFudHMuY21pX2NoaWxkcmVuO1xuICAjY29tcGxldGlvbl9zdGF0dXMgPSAndW5rbm93bic7XG4gICNjb21wbGV0aW9uX3RocmVzaG9sZCA9ICcnO1xuICAjY3JlZGl0ID0gJ2NyZWRpdCc7XG4gICNlbnRyeSA9ICcnO1xuICAjZXhpdCA9ICcnO1xuICAjbGF1bmNoX2RhdGEgPSAnJztcbiAgI2xlYXJuZXJfaWQgPSAnJztcbiAgI2xlYXJuZXJfbmFtZSA9ICcnO1xuICAjbG9jYXRpb24gPSAnJztcbiAgI21heF90aW1lX2FsbG93ZWQgPSAnJztcbiAgI21vZGUgPSAnbm9ybWFsJztcbiAgI3Byb2dyZXNzX21lYXN1cmUgPSAnJztcbiAgI3NjYWxlZF9wYXNzaW5nX3Njb3JlID0gJyc7XG4gICNzZXNzaW9uX3RpbWUgPSAnUFQwSDBNMFMnO1xuICAjc3VjY2Vzc19zdGF0dXMgPSAndW5rbm93bic7XG4gICNzdXNwZW5kX2RhdGEgPSAnJztcbiAgI3RpbWVfbGltaXRfYWN0aW9uID0gJ2NvbnRpbnVlLG5vIG1lc3NhZ2UnO1xuICAjdG90YWxfdGltZSA9ICcnO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5sZWFybmVyX3ByZWZlcmVuY2U/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnNjb3JlPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5jb21tZW50c19mcm9tX2xlYXJuZXI/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmNvbW1lbnRzX2Zyb21fbG1zPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5pbnRlcmFjdGlvbnM/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLm9iamVjdGl2ZXM/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNfdmVyc2lvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX3ZlcnNpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI192ZXJzaW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI192ZXJzaW9uLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF92ZXJzaW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXQgX3ZlcnNpb24oX3ZlcnNpb24pIHtcbiAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNfY2hpbGRyZW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI19jaGlsZHJlbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBfY2hpbGRyZW5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29tcGxldGlvbl9zdGF0dXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbXBsZXRpb25fc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNjb21wbGV0aW9uX3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21wbGV0aW9uX3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY29tcGxldGlvbl9zdGF0dXNcbiAgICovXG4gIHNldCBjb21wbGV0aW9uX3N0YXR1cyhjb21wbGV0aW9uX3N0YXR1cykge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChjb21wbGV0aW9uX3N0YXR1cywgc2Nvcm0yMDA0X3JlZ2V4LkNNSUNTdGF0dXMpKSB7XG4gICAgICB0aGlzLiNjb21wbGV0aW9uX3N0YXR1cyA9IGNvbXBsZXRpb25fc3RhdHVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb21wbGV0aW9uX3RocmVzaG9sZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29tcGxldGlvbl90aHJlc2hvbGQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbXBsZXRpb25fdGhyZXNob2xkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbXBsZXRpb25fdGhyZXNob2xkLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbXBsZXRpb25fdGhyZXNob2xkXG4gICAqL1xuICBzZXQgY29tcGxldGlvbl90aHJlc2hvbGQoY29tcGxldGlvbl90aHJlc2hvbGQpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2NvbXBsZXRpb25fdGhyZXNob2xkID0gY29tcGxldGlvbl90aHJlc2hvbGQgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjcmVkaXRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNyZWRpdCgpIHtcbiAgICByZXR1cm4gdGhpcy4jY3JlZGl0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NyZWRpdC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjcmVkaXRcbiAgICovXG4gIHNldCBjcmVkaXQoY3JlZGl0KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNjcmVkaXQgPSBjcmVkaXQgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNlbnRyeVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZW50cnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2VudHJ5O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2VudHJ5LiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGVudHJ5XG4gICAqL1xuICBzZXQgZW50cnkoZW50cnkpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2VudHJ5ID0gZW50cnkgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNleGl0LiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZXhpdCgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jZXhpdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNleGl0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBleGl0XG4gICAqL1xuICBzZXQgZXhpdChleGl0KSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGV4aXQsIHNjb3JtMjAwNF9yZWdleC5DTUlFeGl0LCB0cnVlKSkge1xuICAgICAgdGhpcy4jZXhpdCA9IGV4aXQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xhdW5jaF9kYXRhXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsYXVuY2hfZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGF1bmNoX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGF1bmNoX2RhdGEuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGF1bmNoX2RhdGFcbiAgICovXG4gIHNldCBsYXVuY2hfZGF0YShsYXVuY2hfZGF0YSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jbGF1bmNoX2RhdGEgPSBsYXVuY2hfZGF0YSA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlYXJuZXJfaWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlYXJuZXJfaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlYXJuZXJfaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVhcm5lcl9pZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZWFybmVyX2lkXG4gICAqL1xuICBzZXQgbGVhcm5lcl9pZChsZWFybmVyX2lkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNsZWFybmVyX2lkID0gbGVhcm5lcl9pZCA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlYXJuZXJfbmFtZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVhcm5lcl9uYW1lKCkge1xuICAgIHJldHVybiB0aGlzLiNsZWFybmVyX25hbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVhcm5lcl9uYW1lLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlYXJuZXJfbmFtZVxuICAgKi9cbiAgc2V0IGxlYXJuZXJfbmFtZShsZWFybmVyX25hbWUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2xlYXJuZXJfbmFtZSA9IGxlYXJuZXJfbmFtZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xvY2F0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsb2NhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jbG9jYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbG9jYXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uXG4gICAqL1xuICBzZXQgbG9jYXRpb24obG9jYXRpb24pIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQobG9jYXRpb24sIHNjb3JtMjAwNF9yZWdleC5DTUlTdHJpbmcxMDAwKSkge1xuICAgICAgdGhpcy4jbG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbWF4X3RpbWVfYWxsb3dlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbWF4X3RpbWVfYWxsb3dlZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jbWF4X3RpbWVfYWxsb3dlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNtYXhfdGltZV9hbGxvd2VkLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1heF90aW1lX2FsbG93ZWRcbiAgICovXG4gIHNldCBtYXhfdGltZV9hbGxvd2VkKG1heF90aW1lX2FsbG93ZWQpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI21heF90aW1lX2FsbG93ZWQgPSBtYXhfdGltZV9hbGxvd2VkIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbW9kZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbW9kZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbW9kZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNtb2RlLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGVcbiAgICovXG4gIHNldCBtb2RlKG1vZGUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI21vZGUgPSBtb2RlIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjcHJvZ3Jlc3NfbWVhc3VyZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgcHJvZ3Jlc3NfbWVhc3VyZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jcHJvZ3Jlc3NfbWVhc3VyZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNwcm9ncmVzc19tZWFzdXJlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9ncmVzc19tZWFzdXJlXG4gICAqL1xuICBzZXQgcHJvZ3Jlc3NfbWVhc3VyZShwcm9ncmVzc19tZWFzdXJlKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHByb2dyZXNzX21lYXN1cmUsIHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsKSAmJlxuICAgICAgICBjaGVjazIwMDRWYWxpZFJhbmdlKHByb2dyZXNzX21lYXN1cmUsIHNjb3JtMjAwNF9yZWdleC5wcm9ncmVzc19yYW5nZSkpIHtcbiAgICAgIHRoaXMuI3Byb2dyZXNzX21lYXN1cmUgPSBwcm9ncmVzc19tZWFzdXJlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzY2FsZWRfcGFzc2luZ19zY29yZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc2NhbGVkX3Bhc3Npbmdfc2NvcmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3NjYWxlZF9wYXNzaW5nX3Njb3JlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3NjYWxlZF9wYXNzaW5nX3Njb3JlLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjYWxlZF9wYXNzaW5nX3Njb3JlXG4gICAqL1xuICBzZXQgc2NhbGVkX3Bhc3Npbmdfc2NvcmUoc2NhbGVkX3Bhc3Npbmdfc2NvcmUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3NjYWxlZF9wYXNzaW5nX3Njb3JlID0gc2NhbGVkX3Bhc3Npbmdfc2NvcmUgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzZXNzaW9uX3RpbWUuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzZXNzaW9uX3RpbWUoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI3Nlc3Npb25fdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzZXNzaW9uX3RpbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlc3Npb25fdGltZVxuICAgKi9cbiAgc2V0IHNlc3Npb25fdGltZShzZXNzaW9uX3RpbWUpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoc2Vzc2lvbl90aW1lLCBzY29ybTIwMDRfcmVnZXguQ01JVGltZXNwYW4pKSB7XG4gICAgICB0aGlzLiNzZXNzaW9uX3RpbWUgPSBzZXNzaW9uX3RpbWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N1Y2Nlc3Nfc3RhdHVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdWNjZXNzX3N0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jc3VjY2Vzc19zdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3VjY2Vzc19zdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN1Y2Nlc3Nfc3RhdHVzXG4gICAqL1xuICBzZXQgc3VjY2Vzc19zdGF0dXMoc3VjY2Vzc19zdGF0dXMpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoc3VjY2Vzc19zdGF0dXMsIHNjb3JtMjAwNF9yZWdleC5DTUlTU3RhdHVzKSkge1xuICAgICAgdGhpcy4jc3VjY2Vzc19zdGF0dXMgPSBzdWNjZXNzX3N0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3VzcGVuZF9kYXRhXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdXNwZW5kX2RhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N1c3BlbmRfZGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdXNwZW5kX2RhdGFcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN1c3BlbmRfZGF0YVxuICAgKi9cbiAgc2V0IHN1c3BlbmRfZGF0YShzdXNwZW5kX2RhdGEpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoc3VzcGVuZF9kYXRhLCBzY29ybTIwMDRfcmVnZXguQ01JU3RyaW5nNjQwMDAsXG4gICAgICAgIHRydWUpKSB7XG4gICAgICB0aGlzLiNzdXNwZW5kX2RhdGEgPSBzdXNwZW5kX2RhdGE7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVfbGltaXRfYWN0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lX2xpbWl0X2FjdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZV9saW1pdF9hY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGltZV9saW1pdF9hY3Rpb24uIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZV9saW1pdF9hY3Rpb25cbiAgICovXG4gIHNldCB0aW1lX2xpbWl0X2FjdGlvbih0aW1lX2xpbWl0X2FjdGlvbikge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jdGltZV9saW1pdF9hY3Rpb24gPSB0aW1lX2xpbWl0X2FjdGlvbiA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RvdGFsX3RpbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRvdGFsX3RpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RvdGFsX3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdG90YWxfdGltZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3RhbF90aW1lXG4gICAqL1xuICBzZXQgdG90YWxfdGltZSh0b3RhbF90aW1lKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiN0b3RhbF90aW1lID0gdG90YWxfdGltZSA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgdGhlIGN1cnJlbnQgc2Vzc2lvbiB0aW1lIHRvIHRoZSBleGlzdGluZyB0b3RhbCB0aW1lLlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IElTTzg2MDEgRHVyYXRpb25cbiAgICovXG4gIGdldEN1cnJlbnRUb3RhbFRpbWUoKSB7XG4gICAgbGV0IHNlc3Npb25UaW1lID0gdGhpcy4jc2Vzc2lvbl90aW1lO1xuICAgIGNvbnN0IHN0YXJ0VGltZSA9IHRoaXMuc3RhcnRfdGltZTtcblxuICAgIGlmICh0eXBlb2Ygc3RhcnRUaW1lICE9PSAndW5kZWZpbmVkJyB8fCBzdGFydFRpbWUgPT09IG51bGwpIHtcbiAgICAgIGNvbnN0IHNlY29uZHMgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0YXJ0VGltZTtcbiAgICAgIHNlc3Npb25UaW1lID0gVXRpbC5nZXRTZWNvbmRzQXNJU09EdXJhdGlvbihzZWNvbmRzIC8gMTAwMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFV0aWwuYWRkVHdvRHVyYXRpb25zKFxuICAgICAgICB0aGlzLiN0b3RhbF90aW1lLFxuICAgICAgICBzZXNzaW9uVGltZSxcbiAgICAgICAgc2Nvcm0yMDA0X3JlZ2V4LkNNSVRpbWVzcGFuLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWlcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBjb21tZW50c19mcm9tX2xlYXJuZXI6IENNSUNvbW1lbnRzRnJvbUxlYXJuZXIsXG4gICAqICAgICAgY29tbWVudHNfZnJvbV9sbXM6IENNSUNvbW1lbnRzRnJvbUxNUyxcbiAgICogICAgICBjb21wbGV0aW9uX3N0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIGNvbXBsZXRpb25fdGhyZXNob2xkOiBzdHJpbmcsXG4gICAqICAgICAgY3JlZGl0OiBzdHJpbmcsXG4gICAqICAgICAgZW50cnk6IHN0cmluZyxcbiAgICogICAgICBleGl0OiBzdHJpbmcsXG4gICAqICAgICAgaW50ZXJhY3Rpb25zOiBDTUlJbnRlcmFjdGlvbnMsXG4gICAqICAgICAgbGF1bmNoX2RhdGE6IHN0cmluZyxcbiAgICogICAgICBsZWFybmVyX2lkOiBzdHJpbmcsXG4gICAqICAgICAgbGVhcm5lcl9uYW1lOiBzdHJpbmcsXG4gICAqICAgICAgbGVhcm5lcl9wcmVmZXJlbmNlOiBDTUlMZWFybmVyUHJlZmVyZW5jZSxcbiAgICogICAgICBsb2NhdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIG1heF90aW1lX2FsbG93ZWQ6IHN0cmluZyxcbiAgICogICAgICBtb2RlOiBzdHJpbmcsXG4gICAqICAgICAgb2JqZWN0aXZlczogQ01JT2JqZWN0aXZlcyxcbiAgICogICAgICBwcm9ncmVzc19tZWFzdXJlOiBzdHJpbmcsXG4gICAqICAgICAgc2NhbGVkX3Bhc3Npbmdfc2NvcmU6IHN0cmluZyxcbiAgICogICAgICBzY29yZTogU2Nvcm0yMDA0Q01JU2NvcmUsXG4gICAqICAgICAgc2Vzc2lvbl90aW1lOiBzdHJpbmcsXG4gICAqICAgICAgc3VjY2Vzc19zdGF0dXM6IHN0cmluZyxcbiAgICogICAgICBzdXNwZW5kX2RhdGE6IHN0cmluZyxcbiAgICogICAgICB0aW1lX2xpbWl0X2FjdGlvbjogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdjb21tZW50c19mcm9tX2xlYXJuZXInOiB0aGlzLmNvbW1lbnRzX2Zyb21fbGVhcm5lcixcbiAgICAgICdjb21tZW50c19mcm9tX2xtcyc6IHRoaXMuY29tbWVudHNfZnJvbV9sbXMsXG4gICAgICAnY29tcGxldGlvbl9zdGF0dXMnOiB0aGlzLmNvbXBsZXRpb25fc3RhdHVzLFxuICAgICAgJ2NvbXBsZXRpb25fdGhyZXNob2xkJzogdGhpcy5jb21wbGV0aW9uX3RocmVzaG9sZCxcbiAgICAgICdjcmVkaXQnOiB0aGlzLmNyZWRpdCxcbiAgICAgICdlbnRyeSc6IHRoaXMuZW50cnksXG4gICAgICAnZXhpdCc6IHRoaXMuZXhpdCxcbiAgICAgICdpbnRlcmFjdGlvbnMnOiB0aGlzLmludGVyYWN0aW9ucyxcbiAgICAgICdsYXVuY2hfZGF0YSc6IHRoaXMubGF1bmNoX2RhdGEsXG4gICAgICAnbGVhcm5lcl9pZCc6IHRoaXMubGVhcm5lcl9pZCxcbiAgICAgICdsZWFybmVyX25hbWUnOiB0aGlzLmxlYXJuZXJfbmFtZSxcbiAgICAgICdsZWFybmVyX3ByZWZlcmVuY2UnOiB0aGlzLmxlYXJuZXJfcHJlZmVyZW5jZSxcbiAgICAgICdsb2NhdGlvbic6IHRoaXMubG9jYXRpb24sXG4gICAgICAnbWF4X3RpbWVfYWxsb3dlZCc6IHRoaXMubWF4X3RpbWVfYWxsb3dlZCxcbiAgICAgICdtb2RlJzogdGhpcy5tb2RlLFxuICAgICAgJ29iamVjdGl2ZXMnOiB0aGlzLm9iamVjdGl2ZXMsXG4gICAgICAncHJvZ3Jlc3NfbWVhc3VyZSc6IHRoaXMucHJvZ3Jlc3NfbWVhc3VyZSxcbiAgICAgICdzY2FsZWRfcGFzc2luZ19zY29yZSc6IHRoaXMuc2NhbGVkX3Bhc3Npbmdfc2NvcmUsXG4gICAgICAnc2NvcmUnOiB0aGlzLnNjb3JlLFxuICAgICAgJ3Nlc3Npb25fdGltZSc6IHRoaXMuc2Vzc2lvbl90aW1lLFxuICAgICAgJ3N1Y2Nlc3Nfc3RhdHVzJzogdGhpcy5zdWNjZXNzX3N0YXR1cyxcbiAgICAgICdzdXNwZW5kX2RhdGEnOiB0aGlzLnN1c3BlbmRfZGF0YSxcbiAgICAgICd0aW1lX2xpbWl0X2FjdGlvbic6IHRoaXMudGltZV9saW1pdF9hY3Rpb24sXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgU0NPUk0gMjAwNCdzIGNtaS5sZWFybmVyX3ByZWZlcmVuY2Ugb2JqZWN0XG4gKi9cbmNsYXNzIENNSUxlYXJuZXJQcmVmZXJlbmNlIGV4dGVuZHMgQmFzZUNNSSB7XG4gICNfY2hpbGRyZW4gPSBzY29ybTIwMDRfY29uc3RhbnRzLnN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbjtcbiAgI2F1ZGlvX2xldmVsID0gJzEnO1xuICAjbGFuZ3VhZ2UgPSAnJztcbiAgI2RlbGl2ZXJ5X3NwZWVkID0gJzEnO1xuICAjYXVkaW9fY2FwdGlvbmluZyA9ICcwJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5sZWFybmVyX3ByZWZlcmVuY2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2F1ZGlvX2xldmVsXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBhdWRpb19sZXZlbCgpIHtcbiAgICByZXR1cm4gdGhpcy4jYXVkaW9fbGV2ZWw7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjYXVkaW9fbGV2ZWxcbiAgICogQHBhcmFtIHtzdHJpbmd9IGF1ZGlvX2xldmVsXG4gICAqL1xuICBzZXQgYXVkaW9fbGV2ZWwoYXVkaW9fbGV2ZWwpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoYXVkaW9fbGV2ZWwsIHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsKSAmJlxuICAgICAgICBjaGVjazIwMDRWYWxpZFJhbmdlKGF1ZGlvX2xldmVsLCBzY29ybTIwMDRfcmVnZXguYXVkaW9fcmFuZ2UpKSB7XG4gICAgICB0aGlzLiNhdWRpb19sZXZlbCA9IGF1ZGlvX2xldmVsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsYW5ndWFnZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGFuZ3VhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xhbmd1YWdlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xhbmd1YWdlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZVxuICAgKi9cbiAgc2V0IGxhbmd1YWdlKGxhbmd1YWdlKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGxhbmd1YWdlLCBzY29ybTIwMDRfcmVnZXguQ01JTGFuZykpIHtcbiAgICAgIHRoaXMuI2xhbmd1YWdlID0gbGFuZ3VhZ2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2RlbGl2ZXJ5X3NwZWVkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBkZWxpdmVyeV9zcGVlZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jZGVsaXZlcnlfc3BlZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZGVsaXZlcnlfc3BlZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlbGl2ZXJ5X3NwZWVkXG4gICAqL1xuICBzZXQgZGVsaXZlcnlfc3BlZWQoZGVsaXZlcnlfc3BlZWQpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoZGVsaXZlcnlfc3BlZWQsIHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsKSAmJlxuICAgICAgICBjaGVjazIwMDRWYWxpZFJhbmdlKGRlbGl2ZXJ5X3NwZWVkLCBzY29ybTIwMDRfcmVnZXguc3BlZWRfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiNkZWxpdmVyeV9zcGVlZCA9IGRlbGl2ZXJ5X3NwZWVkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNhdWRpb19jYXB0aW9uaW5nXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBhdWRpb19jYXB0aW9uaW5nKCkge1xuICAgIHJldHVybiB0aGlzLiNhdWRpb19jYXB0aW9uaW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2F1ZGlvX2NhcHRpb25pbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IGF1ZGlvX2NhcHRpb25pbmdcbiAgICovXG4gIHNldCBhdWRpb19jYXB0aW9uaW5nKGF1ZGlvX2NhcHRpb25pbmcpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoYXVkaW9fY2FwdGlvbmluZywgc2Nvcm0yMDA0X3JlZ2V4LkNNSVNJbnRlZ2VyKSAmJlxuICAgICAgICBjaGVjazIwMDRWYWxpZFJhbmdlKGF1ZGlvX2NhcHRpb25pbmcsIHNjb3JtMjAwNF9yZWdleC50ZXh0X3JhbmdlKSkge1xuICAgICAgdGhpcy4jYXVkaW9fY2FwdGlvbmluZyA9IGF1ZGlvX2NhcHRpb25pbmc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmxlYXJuZXJfcHJlZmVyZW5jZVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGF1ZGlvX2xldmVsOiBzdHJpbmcsXG4gICAqICAgICAgbGFuZ3VhZ2U6IHN0cmluZyxcbiAgICogICAgICBkZWxpdmVyeV9zcGVlZDogc3RyaW5nLFxuICAgKiAgICAgIGF1ZGlvX2NhcHRpb25pbmc6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnYXVkaW9fbGV2ZWwnOiB0aGlzLmF1ZGlvX2xldmVsLFxuICAgICAgJ2xhbmd1YWdlJzogdGhpcy5sYW5ndWFnZSxcbiAgICAgICdkZWxpdmVyeV9zcGVlZCc6IHRoaXMuZGVsaXZlcnlfc3BlZWQsXG4gICAgICAnYXVkaW9fY2FwdGlvbmluZyc6IHRoaXMuYXVkaW9fY2FwdGlvbmluZyxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmludGVyYWN0aW9ucyBvYmplY3RcbiAqL1xuY2xhc3MgQ01JSW50ZXJhY3Rpb25zIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5vYmplY3RpdmVzIEFycmF5XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogc2Nvcm0yMDA0X2NvbnN0YW50cy5pbnRlcmFjdGlvbnNfY2hpbGRyZW4sXG4gICAgICBlcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLm9iamVjdGl2ZXMgb2JqZWN0XG4gKi9cbmNsYXNzIENNSU9iamVjdGl2ZXMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLm9iamVjdGl2ZXMgQXJyYXlcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtcbiAgICAgIGNoaWxkcmVuOiBzY29ybTIwMDRfY29uc3RhbnRzLm9iamVjdGl2ZXNfY2hpbGRyZW4sXG4gICAgICBlcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmNvbW1lbnRzX2Zyb21fbG1zIG9iamVjdFxuICovXG5jbGFzcyBDTUlDb21tZW50c0Zyb21MTVMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmNvbW1lbnRzX2Zyb21fbG1zIEFycmF5XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogc2Nvcm0yMDA0X2NvbnN0YW50cy5jb21tZW50c19jaGlsZHJlbixcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDIwMDQncyBjbWkuY29tbWVudHNfZnJvbV9sZWFybmVyIG9iamVjdFxuICovXG5jbGFzcyBDTUlDb21tZW50c0Zyb21MZWFybmVyIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5jb21tZW50c19mcm9tX2xlYXJuZXIgQXJyYXlcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtcbiAgICAgIGNoaWxkcmVuOiBzY29ybTIwMDRfY29uc3RhbnRzLmNvbW1lbnRzX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgU0NPUk0gMjAwNCdzIGNtaS5pbnRlcmFjdGlvbi5uIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JSW50ZXJhY3Rpb25zT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNpZCA9ICcnO1xuICAjdHlwZSA9ICcnO1xuICAjdGltZXN0YW1wID0gJyc7XG4gICN3ZWlnaHRpbmcgPSAnJztcbiAgI2xlYXJuZXJfcmVzcG9uc2UgPSAnJztcbiAgI3Jlc3VsdCA9ICcnO1xuICAjbGF0ZW5jeSA9ICcnO1xuICAjZGVzY3JpcHRpb24gPSAnJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5pbnRlcmFjdGlvbi5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5vYmplY3RpdmVzID0gbmV3IENNSUFycmF5KHtcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgICAgY2hpbGRyZW46IHNjb3JtMjAwNF9jb25zdGFudHMub2JqZWN0aXZlc19jaGlsZHJlbixcbiAgICB9KTtcbiAgICB0aGlzLmNvcnJlY3RfcmVzcG9uc2VzID0gbmV3IENNSUFycmF5KHtcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgICAgY2hpbGRyZW46IHNjb3JtMjAwNF9jb25zdGFudHMuY29ycmVjdF9yZXNwb25zZXNfY2hpbGRyZW4sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMub2JqZWN0aXZlcz8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29ycmVjdF9yZXNwb25zZXM/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNpZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGlkLCBzY29ybTIwMDRfcmVnZXguQ01JTG9uZ0lkZW50aWZpZXIpKSB7XG4gICAgICB0aGlzLiNpZCA9IGlkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0eXBlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiB0aGlzLiN0eXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3R5cGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAgICovXG4gIHNldCB0eXBlKHR5cGUpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuaWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFxuICAgICAgICAgIHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5ERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdCh0eXBlLCBzY29ybTIwMDRfcmVnZXguQ01JVHlwZSkpIHtcbiAgICAgICAgdGhpcy4jdHlwZSA9IHR5cGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVzdGFtcFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGltZXN0YW1wKCkge1xuICAgIHJldHVybiB0aGlzLiN0aW1lc3RhbXA7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGltZXN0YW1wXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lc3RhbXBcbiAgICovXG4gIHNldCB0aW1lc3RhbXAodGltZXN0YW1wKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHRpbWVzdGFtcCwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVRpbWUpKSB7XG4gICAgICB0aGlzLiN0aW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3dlaWdodGluZ1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgd2VpZ2h0aW5nKCkge1xuICAgIHJldHVybiB0aGlzLiN3ZWlnaHRpbmc7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjd2VpZ2h0aW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3ZWlnaHRpbmdcbiAgICovXG4gIHNldCB3ZWlnaHRpbmcod2VpZ2h0aW5nKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHdlaWdodGluZywgc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwpKSB7XG4gICAgICB0aGlzLiN3ZWlnaHRpbmcgPSB3ZWlnaHRpbmc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlYXJuZXJfcmVzcG9uc2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlYXJuZXJfcmVzcG9uc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlYXJuZXJfcmVzcG9uc2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVhcm5lcl9yZXNwb25zZS4gRG9lcyB0eXBlIHZhbGlkYXRpb24gdG8gbWFrZSBzdXJlIHJlc3BvbnNlXG4gICAqIG1hdGNoZXMgU0NPUk0gMjAwNCdzIHNwZWNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlYXJuZXJfcmVzcG9uc2VcbiAgICovXG4gIHNldCBsZWFybmVyX3Jlc3BvbnNlKGxlYXJuZXJfcmVzcG9uc2UpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMudHlwZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHRoaXMuaWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFxuICAgICAgICAgIHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5ERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBub2RlcyA9IFtdO1xuICAgICAgY29uc3QgcmVzcG9uc2VfdHlwZSA9IGxlYXJuZXJfcmVzcG9uc2VzW3RoaXMudHlwZV07XG4gICAgICBpZiAocmVzcG9uc2VfdHlwZSkge1xuICAgICAgICBpZiAocmVzcG9uc2VfdHlwZT8uZGVsaW1pdGVyKSB7XG4gICAgICAgICAgbm9kZXMgPSBsZWFybmVyX3Jlc3BvbnNlLnNwbGl0KHJlc3BvbnNlX3R5cGUuZGVsaW1pdGVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub2Rlc1swXSA9IGxlYXJuZXJfcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKG5vZGVzLmxlbmd0aCA+IDApICYmIChub2Rlcy5sZW5ndGggPD0gcmVzcG9uc2VfdHlwZS5tYXgpKSB7XG4gICAgICAgICAgY29uc3QgZm9ybWF0UmVnZXggPSBuZXcgUmVnRXhwKHJlc3BvbnNlX3R5cGUuZm9ybWF0KTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2VfdHlwZT8uZGVsaW1pdGVyMikge1xuICAgICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBub2Rlc1tpXS5zcGxpdChyZXNwb25zZV90eXBlLmRlbGltaXRlcjIpO1xuICAgICAgICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgIGlmICghdmFsdWVzWzBdLm1hdGNoKGZvcm1hdFJlZ2V4KSkge1xuICAgICAgICAgICAgICAgICAgdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlc1sxXS5tYXRjaChuZXcgUmVnRXhwKHJlc3BvbnNlX3R5cGUuZm9ybWF0MikpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93VHlwZU1pc21hdGNoRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoIW5vZGVzW2ldLm1hdGNoKGZvcm1hdFJlZ2V4KSkge1xuICAgICAgICAgICAgICAgIHRocm93VHlwZU1pc21hdGNoRXJyb3IoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZXNbaV0gIT09ICcnICYmIHJlc3BvbnNlX3R5cGUudW5pcXVlKSB7XG4gICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZXNbaV0gPT09IG5vZGVzW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjcmVzdWx0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCByZXN1bHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3Jlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNyZXN1bHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlc3VsdFxuICAgKi9cbiAgc2V0IHJlc3VsdChyZXN1bHQpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQocmVzdWx0LCBzY29ybTIwMDRfcmVnZXguQ01JUmVzdWx0KSkge1xuICAgICAgdGhpcy4jcmVzdWx0ID0gcmVzdWx0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsYXRlbmN5XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsYXRlbmN5KCkge1xuICAgIHJldHVybiB0aGlzLiNsYXRlbmN5O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xhdGVuY3lcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhdGVuY3lcbiAgICovXG4gIHNldCBsYXRlbmN5KGxhdGVuY3kpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQobGF0ZW5jeSwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVRpbWVzcGFuKSkge1xuICAgICAgdGhpcy4jbGF0ZW5jeSA9IGxhdGVuY3k7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2Rlc2NyaXB0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBkZXNjcmlwdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jZGVzY3JpcHRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZGVzY3JpcHRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uXG4gICAqL1xuICBzZXQgZGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoZGVzY3JpcHRpb24sIHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nU3RyaW5nMjUwLFxuICAgICAgICB0cnVlKSkge1xuICAgICAgdGhpcy4jZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuaW50ZXJhY3Rpb25zLm5cbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBpZDogc3RyaW5nLFxuICAgKiAgICAgIHR5cGU6IHN0cmluZyxcbiAgICogICAgICBvYmplY3RpdmVzOiBDTUlBcnJheSxcbiAgICogICAgICB0aW1lc3RhbXA6IHN0cmluZyxcbiAgICogICAgICBjb3JyZWN0X3Jlc3BvbnNlczogQ01JQXJyYXksXG4gICAqICAgICAgd2VpZ2h0aW5nOiBzdHJpbmcsXG4gICAqICAgICAgbGVhcm5lcl9yZXNwb25zZTogc3RyaW5nLFxuICAgKiAgICAgIHJlc3VsdDogc3RyaW5nLFxuICAgKiAgICAgIGxhdGVuY3k6IHN0cmluZyxcbiAgICogICAgICBkZXNjcmlwdGlvbjogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdpZCc6IHRoaXMuaWQsXG4gICAgICAndHlwZSc6IHRoaXMudHlwZSxcbiAgICAgICdvYmplY3RpdmVzJzogdGhpcy5vYmplY3RpdmVzLFxuICAgICAgJ3RpbWVzdGFtcCc6IHRoaXMudGltZXN0YW1wLFxuICAgICAgJ3dlaWdodGluZyc6IHRoaXMud2VpZ2h0aW5nLFxuICAgICAgJ2xlYXJuZXJfcmVzcG9uc2UnOiB0aGlzLmxlYXJuZXJfcmVzcG9uc2UsXG4gICAgICAncmVzdWx0JzogdGhpcy5yZXN1bHQsXG4gICAgICAnbGF0ZW5jeSc6IHRoaXMubGF0ZW5jeSxcbiAgICAgICdkZXNjcmlwdGlvbic6IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICAnY29ycmVjdF9yZXNwb25zZXMnOiB0aGlzLmNvcnJlY3RfcmVzcG9uc2VzLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIFNDT1JNIDIwMDQncyBjbWkub2JqZWN0aXZlcy5uIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JT2JqZWN0aXZlc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAjaWQgPSAnJztcbiAgI3N1Y2Nlc3Nfc3RhdHVzID0gJ3Vua25vd24nO1xuICAjY29tcGxldGlvbl9zdGF0dXMgPSAndW5rbm93bic7XG4gICNwcm9ncmVzc19tZWFzdXJlID0gJyc7XG4gICNkZXNjcmlwdGlvbiA9ICcnO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLm9iamVjdGl2ZXMublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc2NvcmUgPSBuZXcgU2Nvcm0yMDA0Q01JU2NvcmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zY29yZT8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjaWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBzZXQgaWQoaWQpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoaWQsIHNjb3JtMjAwNF9yZWdleC5DTUlMb25nSWRlbnRpZmllcikpIHtcbiAgICAgIHRoaXMuI2lkID0gaWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N1Y2Nlc3Nfc3RhdHVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdWNjZXNzX3N0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jc3VjY2Vzc19zdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3VjY2Vzc19zdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN1Y2Nlc3Nfc3RhdHVzXG4gICAqL1xuICBzZXQgc3VjY2Vzc19zdGF0dXMoc3VjY2Vzc19zdGF0dXMpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoc3VjY2Vzc19zdGF0dXMsIHNjb3JtMjAwNF9yZWdleC5DTUlTU3RhdHVzKSkge1xuICAgICAgdGhpcy4jc3VjY2Vzc19zdGF0dXMgPSBzdWNjZXNzX3N0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29tcGxldGlvbl9zdGF0dXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbXBsZXRpb25fc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNjb21wbGV0aW9uX3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21wbGV0aW9uX3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY29tcGxldGlvbl9zdGF0dXNcbiAgICovXG4gIHNldCBjb21wbGV0aW9uX3N0YXR1cyhjb21wbGV0aW9uX3N0YXR1cykge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChjb21wbGV0aW9uX3N0YXR1cywgc2Nvcm0yMDA0X3JlZ2V4LkNNSUNTdGF0dXMpKSB7XG4gICAgICB0aGlzLiNjb21wbGV0aW9uX3N0YXR1cyA9IGNvbXBsZXRpb25fc3RhdHVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNwcm9ncmVzc19tZWFzdXJlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBwcm9ncmVzc19tZWFzdXJlKCkge1xuICAgIHJldHVybiB0aGlzLiNwcm9ncmVzc19tZWFzdXJlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3Byb2dyZXNzX21lYXN1cmVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb2dyZXNzX21lYXN1cmVcbiAgICovXG4gIHNldCBwcm9ncmVzc19tZWFzdXJlKHByb2dyZXNzX21lYXN1cmUpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQocHJvZ3Jlc3NfbWVhc3VyZSwgc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwpICYmXG4gICAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2UocHJvZ3Jlc3NfbWVhc3VyZSwgc2Nvcm0yMDA0X3JlZ2V4LnByb2dyZXNzX3JhbmdlKSkge1xuICAgICAgdGhpcy4jcHJvZ3Jlc3NfbWVhc3VyZSA9IHByb2dyZXNzX21lYXN1cmU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2Rlc2NyaXB0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBkZXNjcmlwdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jZGVzY3JpcHRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZGVzY3JpcHRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uXG4gICAqL1xuICBzZXQgZGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoZGVzY3JpcHRpb24sIHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nU3RyaW5nMjUwLFxuICAgICAgICB0cnVlKSkge1xuICAgICAgdGhpcy4jZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkub2JqZWN0aXZlcy5uXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgaWQ6IHN0cmluZyxcbiAgICogICAgICBzdWNjZXNzX3N0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIGNvbXBsZXRpb25fc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgcHJvZ3Jlc3NfbWVhc3VyZTogc3RyaW5nLFxuICAgKiAgICAgIGRlc2NyaXB0aW9uOiBzdHJpbmcsXG4gICAqICAgICAgc2NvcmU6IFNjb3JtMjAwNENNSVNjb3JlXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdpZCc6IHRoaXMuaWQsXG4gICAgICAnc3VjY2Vzc19zdGF0dXMnOiB0aGlzLnN1Y2Nlc3Nfc3RhdHVzLFxuICAgICAgJ2NvbXBsZXRpb25fc3RhdHVzJzogdGhpcy5jb21wbGV0aW9uX3N0YXR1cyxcbiAgICAgICdwcm9ncmVzc19tZWFzdXJlJzogdGhpcy5wcm9ncmVzc19tZWFzdXJlLFxuICAgICAgJ2Rlc2NyaXB0aW9uJzogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgU0NPUk0gMjAwNCdzIGNtaSAqLnNjb3JlIG9iamVjdFxuICovXG5jbGFzcyBTY29ybTIwMDRDTUlTY29yZSBleHRlbmRzIENNSVNjb3JlIHtcbiAgI3NjYWxlZCA9ICcnO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pICouc2NvcmVcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFxuICAgICAgICB7XG4gICAgICAgICAgc2NvcmVfY2hpbGRyZW46IHNjb3JtMjAwNF9jb25zdGFudHMuc2NvcmVfY2hpbGRyZW4sXG4gICAgICAgICAgbWF4OiAnJyxcbiAgICAgICAgICBpbnZhbGlkRXJyb3JDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQsXG4gICAgICAgICAgaW52YWxpZFR5cGVDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFLFxuICAgICAgICAgIGRlY2ltYWxSZWdleDogc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwsXG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3NjYWxlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc2NhbGVkKCkge1xuICAgIHJldHVybiB0aGlzLiNzY2FsZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc2NhbGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY2FsZWRcbiAgICovXG4gIHNldCBzY2FsZWQoc2NhbGVkKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHNjYWxlZCwgc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwpICYmXG4gICAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2Uoc2NhbGVkLCBzY29ybTIwMDRfcmVnZXguc2NhbGVkX3JhbmdlKSkge1xuICAgICAgdGhpcy4jc2NhbGVkID0gc2NhbGVkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaSAqLnNjb3JlXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgc2NhbGVkOiBzdHJpbmcsXG4gICAqICAgICAgcmF3OiBzdHJpbmcsXG4gICAqICAgICAgbWluOiBzdHJpbmcsXG4gICAqICAgICAgbWF4OiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3NjYWxlZCc6IHRoaXMuc2NhbGVkLFxuICAgICAgJ3Jhdyc6IHN1cGVyLnJhdyxcbiAgICAgICdtaW4nOiBzdXBlci5taW4sXG4gICAgICAnbWF4Jzogc3VwZXIubWF4LFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDIwMDQncyBjbWkuY29tbWVudHNfZnJvbV9sZWFybmVyLm4gYW5kIGNtaS5jb21tZW50c19mcm9tX2xtcy5uIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JQ29tbWVudHNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI2NvbW1lbnQgPSAnJztcbiAgI2xvY2F0aW9uID0gJyc7XG4gICN0aW1lc3RhbXAgPSAnJztcbiAgI3JlYWRPbmx5QWZ0ZXJJbml0O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmNvbW1lbnRzX2Zyb21fbGVhcm5lci5uIGFuZCBjbWkuY29tbWVudHNfZnJvbV9sbXMublxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJlYWRPbmx5QWZ0ZXJJbml0XG4gICAqL1xuICBjb25zdHJ1Y3RvcihyZWFkT25seUFmdGVySW5pdCA9IGZhbHNlKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLiNjb21tZW50ID0gJyc7XG4gICAgdGhpcy4jbG9jYXRpb24gPSAnJztcbiAgICB0aGlzLiN0aW1lc3RhbXAgPSAnJztcbiAgICB0aGlzLiNyZWFkT25seUFmdGVySW5pdCA9IHJlYWRPbmx5QWZ0ZXJJbml0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbW1lbnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29tbWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29tbWVudFxuICAgKi9cbiAgc2V0IGNvbW1lbnQoY29tbWVudCkge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkICYmIHRoaXMuI3JlYWRPbmx5QWZ0ZXJJbml0KSB7XG4gICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGNvbW1lbnQsIHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nU3RyaW5nNDAwMCxcbiAgICAgICAgICB0cnVlKSkge1xuICAgICAgICB0aGlzLiNjb21tZW50ID0gY29tbWVudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbG9jYXRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNsb2NhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsb2NhdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb25cbiAgICovXG4gIHNldCBsb2NhdGlvbihsb2NhdGlvbikge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkICYmIHRoaXMuI3JlYWRPbmx5QWZ0ZXJJbml0KSB7XG4gICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGxvY2F0aW9uLCBzY29ybTIwMDRfcmVnZXguQ01JU3RyaW5nMjUwKSkge1xuICAgICAgICB0aGlzLiNsb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lc3RhbXBcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpbWVzdGFtcCgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZXN0YW1wO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVzdGFtcFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZXN0YW1wXG4gICAqL1xuICBzZXQgdGltZXN0YW1wKHRpbWVzdGFtcCkge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkICYmIHRoaXMuI3JlYWRPbmx5QWZ0ZXJJbml0KSB7XG4gICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHRpbWVzdGFtcCwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVRpbWUpKSB7XG4gICAgICAgIHRoaXMuI3RpbWVzdGFtcCA9IHRpbWVzdGFtcDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuY29tbWVudHNfZnJvbV9sZWFybmVyLm4gb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgY29tbWVudDogc3RyaW5nLFxuICAgKiAgICAgIGxvY2F0aW9uOiBzdHJpbmcsXG4gICAqICAgICAgdGltZXN0YW1wOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2NvbW1lbnQnOiB0aGlzLmNvbW1lbnQsXG4gICAgICAnbG9jYXRpb24nOiB0aGlzLmxvY2F0aW9uLFxuICAgICAgJ3RpbWVzdGFtcCc6IHRoaXMudGltZXN0YW1wLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDIwMDQncyBjbWkuaW50ZXJhY3Rpb25zLm4ub2JqZWN0aXZlcy5uIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JSW50ZXJhY3Rpb25zT2JqZWN0aXZlc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAjaWQgPSAnJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5pbnRlcmFjdGlvbnMubi5vYmplY3RpdmVzLm5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLiNpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNpZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICovXG4gIHNldCBpZChpZCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChpZCwgc2Nvcm0yMDA0X3JlZ2V4LkNNSUxvbmdJZGVudGlmaWVyKSkge1xuICAgICAgdGhpcy4jaWQgPSBpZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4ub2JqZWN0aXZlcy5uXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgaWQ6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnaWQnOiB0aGlzLmlkLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDIwMDQncyBjbWkuaW50ZXJhY3Rpb25zLm4uY29ycmVjdF9yZXNwb25zZXMubiBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc0NvcnJlY3RSZXNwb25zZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI3BhdHRlcm4gPSAnJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5pbnRlcmFjdGlvbnMubi5jb3JyZWN0X3Jlc3BvbnNlcy5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3BhdHRlcm5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHBhdHRlcm4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI3BhdHRlcm47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcGF0dGVyblxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0dGVyblxuICAgKi9cbiAgc2V0IHBhdHRlcm4ocGF0dGVybikge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChwYXR0ZXJuLCBzY29ybTIwMDRfcmVnZXguQ01JRmVlZGJhY2spKSB7XG4gICAgICB0aGlzLiNwYXR0ZXJuID0gcGF0dGVybjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGNtaS5pbnRlcmFjdGlvbnMubi5jb3JyZWN0X3Jlc3BvbnNlcy5uIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHBhdHRlcm46IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAncGF0dGVybic6IHRoaXMucGF0dGVybixcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgYWRsIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQURMIGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgYWRsXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5uYXYgPSBuZXcgQURMTmF2KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMubmF2Py5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBhZGxcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBuYXY6IHtcbiAgICogICAgICAgIHJlcXVlc3Q6IHN0cmluZ1xuICAgKiAgICAgIH1cbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ25hdic6IHRoaXMubmF2LFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDIwMDQncyBhZGwubmF2IG9iamVjdFxuICovXG5jbGFzcyBBRExOYXYgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI3JlcXVlc3QgPSAnX25vbmVfJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGFkbC5uYXZcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnJlcXVlc3RfdmFsaWQgPSBuZXcgQURMTmF2UmVxdWVzdFZhbGlkKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMucmVxdWVzdF92YWxpZD8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3JlcXVlc3RcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHJlcXVlc3QoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3JlcXVlc3Q7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcmVxdWVzdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVxdWVzdFxuICAgKi9cbiAgc2V0IHJlcXVlc3QocmVxdWVzdCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChyZXF1ZXN0LCBzY29ybTIwMDRfcmVnZXguTkFWRXZlbnQpKSB7XG4gICAgICB0aGlzLiNyZXF1ZXN0ID0gcmVxdWVzdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBhZGwubmF2XG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgcmVxdWVzdDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdyZXF1ZXN0JzogdGhpcy5yZXF1ZXN0LFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDIwMDQncyBhZGwubmF2LnJlcXVlc3RfdmFsaWQgb2JqZWN0XG4gKi9cbmNsYXNzIEFETE5hdlJlcXVlc3RWYWxpZCBleHRlbmRzIEJhc2VDTUkge1xuICAjY29udGludWUgPSAndW5rbm93bic7XG4gICNwcmV2aW91cyA9ICd1bmtub3duJztcbiAgY2hvaWNlID0gY2xhc3Mge1xuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRhcmdldCBpcyB2YWxpZFxuICAgICAqIEBwYXJhbSB7Kn0gX3RhcmdldFxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBfaXNUYXJnZXRWYWxpZCA9IChfdGFyZ2V0KSA9PiAndW5rbm93bic7XG4gIH07XG4gIGp1bXAgPSBjbGFzcyB7XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGFyZ2V0IGlzIHZhbGlkXG4gICAgICogQHBhcmFtIHsqfSBfdGFyZ2V0XG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIF9pc1RhcmdldFZhbGlkID0gKF90YXJnZXQpID0+ICd1bmtub3duJztcbiAgfTtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGFkbC5uYXYucmVxdWVzdF92YWxpZFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb250aW51ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29udGludWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbnRpbnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbnRpbnVlLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHsqfSBfXG4gICAqL1xuICBzZXQgY29udGludWUoXykge1xuICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3ByZXZpb3VzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBwcmV2aW91cygpIHtcbiAgICByZXR1cm4gdGhpcy4jcHJldmlvdXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcHJldmlvdXMuIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0geyp9IF9cbiAgICovXG4gIHNldCBwcmV2aW91cyhfKSB7XG4gICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBhZGwubmF2LnJlcXVlc3RfdmFsaWRcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBwcmV2aW91czogc3RyaW5nLFxuICAgKiAgICAgIGNvbnRpbnVlOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3ByZXZpb3VzJzogdGhpcy5wcmV2aW91cyxcbiAgICAgICdjb250aW51ZSc6IHRoaXMuY29udGludWUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiIsIi8vIEBmbG93XG5cbmNvbnN0IGdsb2JhbCA9IHtcbiAgU0NPUk1fVFJVRTogJ3RydWUnLFxuICBTQ09STV9GQUxTRTogJ2ZhbHNlJyxcbiAgU1RBVEVfTk9UX0lOSVRJQUxJWkVEOiAwLFxuICBTVEFURV9JTklUSUFMSVpFRDogMSxcbiAgU1RBVEVfVEVSTUlOQVRFRDogMixcbiAgTE9HX0xFVkVMX0RFQlVHOiAxLFxuICBMT0dfTEVWRUxfSU5GTzogMixcbiAgTE9HX0xFVkVMX1dBUk5JTkc6IDMsXG4gIExPR19MRVZFTF9FUlJPUjogNCxcbiAgTE9HX0xFVkVMX05PTkU6IDUsXG59O1xuXG5jb25zdCBzY29ybTEyID0ge1xuICAvLyBDaGlsZHJlbiBsaXN0c1xuICBjbWlfY2hpbGRyZW46ICdjb3JlLHN1c3BlbmRfZGF0YSxsYXVuY2hfZGF0YSxjb21tZW50cyxvYmplY3RpdmVzLHN0dWRlbnRfZGF0YSxzdHVkZW50X3ByZWZlcmVuY2UsaW50ZXJhY3Rpb25zJyxcbiAgY29yZV9jaGlsZHJlbjogJ3N0dWRlbnRfaWQsc3R1ZGVudF9uYW1lLGxlc3Nvbl9sb2NhdGlvbixjcmVkaXQsbGVzc29uX3N0YXR1cyxlbnRyeSxzY29yZSx0b3RhbF90aW1lLGxlc3Nvbl9tb2RlLGV4aXQsc2Vzc2lvbl90aW1lJyxcbiAgc2NvcmVfY2hpbGRyZW46ICdyYXcsbWluLG1heCcsXG4gIGNvbW1lbnRzX2NoaWxkcmVuOiAnY29udGVudCxsb2NhdGlvbix0aW1lJyxcbiAgb2JqZWN0aXZlc19jaGlsZHJlbjogJ2lkLHNjb3JlLHN0YXR1cycsXG4gIGNvcnJlY3RfcmVzcG9uc2VzX2NoaWxkcmVuOiAncGF0dGVybicsXG4gIHN0dWRlbnRfZGF0YV9jaGlsZHJlbjogJ21hc3Rlcnlfc2NvcmUsbWF4X3RpbWVfYWxsb3dlZCx0aW1lX2xpbWl0X2FjdGlvbicsXG4gIHN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbjogJ2F1ZGlvLGxhbmd1YWdlLHNwZWVkLHRleHQnLFxuICBpbnRlcmFjdGlvbnNfY2hpbGRyZW46ICdpZCxvYmplY3RpdmVzLHRpbWUsdHlwZSxjb3JyZWN0X3Jlc3BvbnNlcyx3ZWlnaHRpbmcsc3R1ZGVudF9yZXNwb25zZSxyZXN1bHQsbGF0ZW5jeScsXG5cbiAgZXJyb3JfZGVzY3JpcHRpb25zOiB7XG4gICAgJzEwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgRXhjZXB0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdObyBzcGVjaWZpYyBlcnJvciBjb2RlIGV4aXN0cyB0byBkZXNjcmliZSB0aGUgZXJyb3IuIFVzZSBMTVNHZXREaWFnbm9zdGljIGZvciBtb3JlIGluZm9ybWF0aW9uJyxcbiAgICB9LFxuICAgICcyMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdJbnZhbGlkIGFyZ3VtZW50IGVycm9yJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgdGhhdCBhbiBhcmd1bWVudCByZXByZXNlbnRzIGFuIGludmFsaWQgZGF0YSBtb2RlbCBlbGVtZW50IG9yIGlzIG90aGVyd2lzZSBpbmNvcnJlY3QuJyxcbiAgICB9LFxuICAgICcyMDInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdFbGVtZW50IGNhbm5vdCBoYXZlIGNoaWxkcmVuJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgdGhhdCBMTVNHZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSBkYXRhIG1vZGVsIGVsZW1lbnQgbmFtZSB0aGF0IGVuZHMgaW4gXCJfY2hpbGRyZW5cIiBmb3IgYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBkb2VzIG5vdCBzdXBwb3J0IHRoZSBcIl9jaGlsZHJlblwiIHN1ZmZpeC4nLFxuICAgIH0sXG4gICAgJzIwMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0VsZW1lbnQgbm90IGFuIGFycmF5IC0gY2Fubm90IGhhdmUgY291bnQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyB0aGF0IExNU0dldFZhbHVlIHdhcyBjYWxsZWQgd2l0aCBhIGRhdGEgbW9kZWwgZWxlbWVudCBuYW1lIHRoYXQgZW5kcyBpbiBcIl9jb3VudFwiIGZvciBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGRvZXMgbm90IHN1cHBvcnQgdGhlIFwiX2NvdW50XCIgc3VmZml4LicsXG4gICAgfSxcbiAgICAnMzAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnTm90IGluaXRpYWxpemVkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgdGhhdCBhbiBBUEkgY2FsbCB3YXMgbWFkZSBiZWZvcmUgdGhlIGNhbGwgdG8gbG1zSW5pdGlhbGl6ZS4nLFxuICAgIH0sXG4gICAgJzQwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ05vdCBpbXBsZW1lbnRlZCBlcnJvcicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnVGhlIGRhdGEgbW9kZWwgZWxlbWVudCBpbmRpY2F0ZWQgaW4gYSBjYWxsIHRvIExNU0dldFZhbHVlIG9yIExNU1NldFZhbHVlIGlzIHZhbGlkLCBidXQgd2FzIG5vdCBpbXBsZW1lbnRlZCBieSB0aGlzIExNUy4gU0NPUk0gMS4yIGRlZmluZXMgYSBzZXQgb2YgZGF0YSBtb2RlbCBlbGVtZW50cyBhcyBiZWluZyBvcHRpb25hbCBmb3IgYW4gTE1TIHRvIGltcGxlbWVudC4nLFxuICAgIH0sXG4gICAgJzQwMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0ludmFsaWQgc2V0IHZhbHVlLCBlbGVtZW50IGlzIGEga2V5d29yZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgTE1TU2V0VmFsdWUgd2FzIGNhbGxlZCBvbiBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IHJlcHJlc2VudHMgYSBrZXl3b3JkIChlbGVtZW50cyB0aGF0IGVuZCBpbiBcIl9jaGlsZHJlblwiIGFuZCBcIl9jb3VudFwiKS4nLFxuICAgIH0sXG4gICAgJzQwMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0VsZW1lbnQgaXMgcmVhZCBvbmx5JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdMTVNTZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBjYW4gb25seSBiZSByZWFkLicsXG4gICAgfSxcbiAgICAnNDA0Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRWxlbWVudCBpcyB3cml0ZSBvbmx5JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdMTVNHZXRWYWx1ZSB3YXMgY2FsbGVkIG9uIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgY2FuIG9ubHkgYmUgd3JpdHRlbiB0by4nLFxuICAgIH0sXG4gICAgJzQwNSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0luY29ycmVjdCBEYXRhIFR5cGUnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0xNU1NldFZhbHVlIHdhcyBjYWxsZWQgd2l0aCBhIHZhbHVlIHRoYXQgaXMgbm90IGNvbnNpc3RlbnQgd2l0aCB0aGUgZGF0YSBmb3JtYXQgb2YgdGhlIHN1cHBsaWVkIGRhdGEgbW9kZWwgZWxlbWVudC4nLFxuICAgIH0sXG4gIH0sXG59O1xuXG5jb25zdCBhaWNjID0ge1xuICAuLi5zY29ybTEyLCAuLi57XG4gICAgY21pX2NoaWxkcmVuOiAnY29yZSxzdXNwZW5kX2RhdGEsbGF1bmNoX2RhdGEsY29tbWVudHMsb2JqZWN0aXZlcyxzdHVkZW50X2RhdGEsc3R1ZGVudF9wcmVmZXJlbmNlLGludGVyYWN0aW9ucyxldmFsdWF0aW9uJyxcbiAgICBzdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW46ICdhdWRpbyxsYW5ndWFnZSxsZXNzb25fdHlwZSxzcGVlZCx0ZXh0LHRleHRfY29sb3IsdGV4dF9sb2NhdGlvbix0ZXh0X3NpemUsdmlkZW8sd2luZG93cycsXG4gICAgc3R1ZGVudF9kYXRhX2NoaWxkcmVuOiAnYXR0ZW1wdF9udW1iZXIsdHJpZXMsbWFzdGVyeV9zY29yZSxtYXhfdGltZV9hbGxvd2VkLHRpbWVfbGltaXRfYWN0aW9uJyxcbiAgICBzdHVkZW50X2RlbW9ncmFwaGljc19jaGlsZHJlbjogJ2NpdHksY2xhc3MsY29tcGFueSxjb3VudHJ5LGV4cGVyaWVuY2UsZmFtaWxpYXJfbmFtZSxpbnN0cnVjdG9yX25hbWUsdGl0bGUsbmF0aXZlX2xhbmd1YWdlLHN0YXRlLHN0cmVldF9hZGRyZXNzLHRlbGVwaG9uZSx5ZWFyc19leHBlcmllbmNlJyxcbiAgICB0cmllc19jaGlsZHJlbjogJ3RpbWUsc3RhdHVzLHNjb3JlJyxcbiAgICBhdHRlbXB0X3JlY29yZHNfY2hpbGRyZW46ICdzY29yZSxsZXNzb25fc3RhdHVzJyxcbiAgICBwYXRoc19jaGlsZHJlbjogJ2xvY2F0aW9uX2lkLGRhdGUsdGltZSxzdGF0dXMsd2h5X2xlZnQsdGltZV9pbl9lbGVtZW50JyxcbiAgfSxcbn07XG5cbmNvbnN0IHNjb3JtMjAwNCA9IHtcbiAgLy8gQ2hpbGRyZW4gbGlzdHNcbiAgY21pX2NoaWxkcmVuOiAnX3ZlcnNpb24sY29tbWVudHNfZnJvbV9sZWFybmVyLGNvbW1lbnRzX2Zyb21fbG1zLGNvbXBsZXRpb25fc3RhdHVzLGNyZWRpdCxlbnRyeSxleGl0LGludGVyYWN0aW9ucyxsYXVuY2hfZGF0YSxsZWFybmVyX2lkLGxlYXJuZXJfbmFtZSxsZWFybmVyX3ByZWZlcmVuY2UsbG9jYXRpb24sbWF4X3RpbWVfYWxsb3dlZCxtb2RlLG9iamVjdGl2ZXMscHJvZ3Jlc3NfbWVhc3VyZSxzY2FsZWRfcGFzc2luZ19zY29yZSxzY29yZSxzZXNzaW9uX3RpbWUsc3VjY2Vzc19zdGF0dXMsc3VzcGVuZF9kYXRhLHRpbWVfbGltaXRfYWN0aW9uLHRvdGFsX3RpbWUnLFxuICBjb21tZW50c19jaGlsZHJlbjogJ2NvbW1lbnQsdGltZXN0YW1wLGxvY2F0aW9uJyxcbiAgc2NvcmVfY2hpbGRyZW46ICdtYXgscmF3LHNjYWxlZCxtaW4nLFxuICBvYmplY3RpdmVzX2NoaWxkcmVuOiAncHJvZ3Jlc3NfbWVhc3VyZSxjb21wbGV0aW9uX3N0YXR1cyxzdWNjZXNzX3N0YXR1cyxkZXNjcmlwdGlvbixzY29yZSxpZCcsXG4gIGNvcnJlY3RfcmVzcG9uc2VzX2NoaWxkcmVuOiAncGF0dGVybicsXG4gIHN0dWRlbnRfZGF0YV9jaGlsZHJlbjogJ21hc3Rlcnlfc2NvcmUsbWF4X3RpbWVfYWxsb3dlZCx0aW1lX2xpbWl0X2FjdGlvbicsXG4gIHN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbjogJ2F1ZGlvX2xldmVsLGF1ZGlvX2NhcHRpb25pbmcsZGVsaXZlcnlfc3BlZWQsbGFuZ3VhZ2UnLFxuICBpbnRlcmFjdGlvbnNfY2hpbGRyZW46ICdpZCx0eXBlLG9iamVjdGl2ZXMsdGltZXN0YW1wLGNvcnJlY3RfcmVzcG9uc2VzLHdlaWdodGluZyxsZWFybmVyX3Jlc3BvbnNlLHJlc3VsdCxsYXRlbmN5LGRlc2NyaXB0aW9uJyxcblxuICBlcnJvcl9kZXNjcmlwdGlvbnM6IHtcbiAgICAnMCc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ05vIEVycm9yJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdObyBlcnJvciBvY2N1cnJlZCwgdGhlIHByZXZpb3VzIEFQSSBjYWxsIHdhcyBzdWNjZXNzZnVsLicsXG4gICAgfSxcbiAgICAnMTAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBFeGNlcHRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ05vIHNwZWNpZmljIGVycm9yIGNvZGUgZXhpc3RzIHRvIGRlc2NyaWJlIHRoZSBlcnJvci4gVXNlIEdldERpYWdub3N0aWMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJyxcbiAgICB9LFxuICAgICcxMDInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIEluaXRpYWxpemF0aW9uIEZhaWx1cmUnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gSW5pdGlhbGl6ZSBmYWlsZWQgZm9yIGFuIHVua25vd24gcmVhc29uLicsXG4gICAgfSxcbiAgICAnMTAzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnQWxyZWFkeSBJbml0aWFsaXplZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBJbml0aWFsaXplIGZhaWxlZCBiZWNhdXNlIEluaXRpYWxpemUgd2FzIGFscmVhZHkgY2FsbGVkLicsXG4gICAgfSxcbiAgICAnMTA0Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnQ29udGVudCBJbnN0YW5jZSBUZXJtaW5hdGVkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIEluaXRpYWxpemUgZmFpbGVkIGJlY2F1c2UgVGVybWluYXRlIHdhcyBhbHJlYWR5IGNhbGxlZC4nLFxuICAgIH0sXG4gICAgJzExMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgVGVybWluYXRpb24gRmFpbHVyZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBUZXJtaW5hdGUgZmFpbGVkIGZvciBhbiB1bmtub3duIHJlYXNvbi4nLFxuICAgIH0sXG4gICAgJzExMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1Rlcm1pbmF0aW9uIEJlZm9yZSBJbml0aWFsaXphdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBUZXJtaW5hdGUgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYmVmb3JlIHRoZSBjYWxsIHRvIEluaXRpYWxpemUuJyxcbiAgICB9LFxuICAgICcxMTMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdUZXJtaW5hdGlvbiBBZnRlciBUZXJtaW5hdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBUZXJtaW5hdGUgZmFpbGVkIGJlY2F1c2UgVGVybWluYXRlIHdhcyBhbHJlYWR5IGNhbGxlZC4nLFxuICAgIH0sXG4gICAgJzEyMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1JldHJpZXZlIERhdGEgQmVmb3JlIEluaXRpYWxpemF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIEdldFZhbHVlIGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGJlZm9yZSB0aGUgY2FsbCB0byBJbml0aWFsaXplLicsXG4gICAgfSxcbiAgICAnMTIzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnUmV0cmlldmUgRGF0YSBBZnRlciBUZXJtaW5hdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBHZXRWYWx1ZSBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBhZnRlciB0aGUgY2FsbCB0byBUZXJtaW5hdGUuJyxcbiAgICB9LFxuICAgICcxMzInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdTdG9yZSBEYXRhIEJlZm9yZSBJbml0aWFsaXphdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBTZXRWYWx1ZSBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBiZWZvcmUgdGhlIGNhbGwgdG8gSW5pdGlhbGl6ZS4nLFxuICAgIH0sXG4gICAgJzEzMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1N0b3JlIERhdGEgQWZ0ZXIgVGVybWluYXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gU2V0VmFsdWUgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYWZ0ZXIgdGhlIGNhbGwgdG8gVGVybWluYXRlLicsXG4gICAgfSxcbiAgICAnMTQyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnQ29tbWl0IEJlZm9yZSBJbml0aWFsaXphdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBDb21taXQgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYmVmb3JlIHRoZSBjYWxsIHRvIEluaXRpYWxpemUuJyxcbiAgICB9LFxuICAgICcxNDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdDb21taXQgQWZ0ZXIgVGVybWluYXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gQ29tbWl0IGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGFmdGVyIHRoZSBjYWxsIHRvIFRlcm1pbmF0ZS4nLFxuICAgIH0sXG4gICAgJzIwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgQXJndW1lbnQgRXJyb3InLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0FuIGludmFsaWQgYXJndW1lbnQgd2FzIHBhc3NlZCB0byBhbiBBUEkgbWV0aG9kICh1c3VhbGx5IGluZGljYXRlcyB0aGF0IEluaXRpYWxpemUsIENvbW1pdCBvciBUZXJtaW5hdGUgZGlkIG5vdCByZWNlaXZlIHRoZSBleHBlY3RlZCBlbXB0eSBzdHJpbmcgYXJndW1lbnQuJyxcbiAgICB9LFxuICAgICczMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIEdldCBGYWlsdXJlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgYSBmYWlsZWQgR2V0VmFsdWUgY2FsbCB3aGVyZSBubyBvdGhlciBzcGVjaWZpYyBlcnJvciBjb2RlIGlzIGFwcGxpY2FibGUuIFVzZSBHZXREaWFnbm9zdGljIGZvciBtb3JlIGluZm9ybWF0aW9uLicsXG4gICAgfSxcbiAgICAnMzUxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBTZXQgRmFpbHVyZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIGEgZmFpbGVkIFNldFZhbHVlIGNhbGwgd2hlcmUgbm8gb3RoZXIgc3BlY2lmaWMgZXJyb3IgY29kZSBpcyBhcHBsaWNhYmxlLiBVc2UgR2V0RGlhZ25vc3RpYyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4nLFxuICAgIH0sXG4gICAgJzM5MSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgQ29tbWl0IEZhaWx1cmUnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyBhIGZhaWxlZCBDb21taXQgY2FsbCB3aGVyZSBubyBvdGhlciBzcGVjaWZpYyBlcnJvciBjb2RlIGlzIGFwcGxpY2FibGUuIFVzZSBHZXREaWFnbm9zdGljIGZvciBtb3JlIGluZm9ybWF0aW9uLicsXG4gICAgfSxcbiAgICAnNDAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnVW5kZWZpbmVkIERhdGEgTW9kZWwgRWxlbWVudCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnVGhlIGRhdGEgbW9kZWwgZWxlbWVudCBuYW1lIHBhc3NlZCB0byBHZXRWYWx1ZSBvciBTZXRWYWx1ZSBpcyBub3QgYSB2YWxpZCBTQ09STSBkYXRhIG1vZGVsIGVsZW1lbnQuJyxcbiAgICB9LFxuICAgICc0MDInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdVbmltcGxlbWVudGVkIERhdGEgTW9kZWwgRWxlbWVudCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnVGhlIGRhdGEgbW9kZWwgZWxlbWVudCBpbmRpY2F0ZWQgaW4gYSBjYWxsIHRvIEdldFZhbHVlIG9yIFNldFZhbHVlIGlzIHZhbGlkLCBidXQgd2FzIG5vdCBpbXBsZW1lbnRlZCBieSB0aGlzIExNUy4gSW4gU0NPUk0gMjAwNCwgdGhpcyBlcnJvciB3b3VsZCBpbmRpY2F0ZSBhbiBMTVMgdGhhdCBpcyBub3QgZnVsbHkgU0NPUk0gY29uZm9ybWFudC4nLFxuICAgIH0sXG4gICAgJzQwMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRWxlbWVudCBWYWx1ZSBOb3QgSW5pdGlhbGl6ZWQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0F0dGVtcHQgdG8gcmVhZCBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGhhcyBub3QgYmVlbiBpbml0aWFsaXplZCBieSB0aGUgTE1TIG9yIHRocm91Z2ggYSBTZXRWYWx1ZSBjYWxsLiBUaGlzIGVycm9yIGNvbmRpdGlvbiBpcyBvZnRlbiByZWFjaGVkIGR1cmluZyBub3JtYWwgZXhlY3V0aW9uIG9mIGEgU0NPLicsXG4gICAgfSxcbiAgICAnNDA0Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBFbGVtZW50IElzIFJlYWQgT25seScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnU2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgY2FuIG9ubHkgYmUgcmVhZC4nLFxuICAgIH0sXG4gICAgJzQwNSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRWxlbWVudCBJcyBXcml0ZSBPbmx5JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdHZXRWYWx1ZSB3YXMgY2FsbGVkIG9uIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgY2FuIG9ubHkgYmUgd3JpdHRlbiB0by4nLFxuICAgIH0sXG4gICAgJzQwNic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRWxlbWVudCBUeXBlIE1pc21hdGNoJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdTZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSB2YWx1ZSB0aGF0IGlzIG5vdCBjb25zaXN0ZW50IHdpdGggdGhlIGRhdGEgZm9ybWF0IG9mIHRoZSBzdXBwbGllZCBkYXRhIG1vZGVsIGVsZW1lbnQuJyxcbiAgICB9LFxuICAgICc0MDcnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIEVsZW1lbnQgVmFsdWUgT3V0IE9mIFJhbmdlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdUaGUgbnVtZXJpYyB2YWx1ZSBzdXBwbGllZCB0byBhIFNldFZhbHVlIGNhbGwgaXMgb3V0c2lkZSBvZiB0aGUgbnVtZXJpYyByYW5nZSBhbGxvd2VkIGZvciB0aGUgc3VwcGxpZWQgZGF0YSBtb2RlbCBlbGVtZW50LicsXG4gICAgfSxcbiAgICAnNDA4Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBEZXBlbmRlbmN5IE5vdCBFc3RhYmxpc2hlZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnU29tZSBkYXRhIG1vZGVsIGVsZW1lbnRzIGNhbm5vdCBiZSBzZXQgdW50aWwgYW5vdGhlciBkYXRhIG1vZGVsIGVsZW1lbnQgd2FzIHNldC4gVGhpcyBlcnJvciBjb25kaXRpb24gaW5kaWNhdGVzIHRoYXQgdGhlIHByZXJlcXVpc2l0ZSBlbGVtZW50IHdhcyBub3Qgc2V0IGJlZm9yZSB0aGUgZGVwZW5kZW50IGVsZW1lbnQuJyxcbiAgICB9LFxuICB9LFxufTtcblxuY29uc3QgQVBJQ29uc3RhbnRzID0ge1xuICBnbG9iYWw6IGdsb2JhbCxcbiAgc2Nvcm0xMjogc2Nvcm0xMixcbiAgYWljYzogYWljYyxcbiAgc2Nvcm0yMDA0OiBzY29ybTIwMDQsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBUElDb25zdGFudHM7XG4iLCIvLyBAZmxvd1xuY29uc3QgZ2xvYmFsID0ge1xuICBHRU5FUkFMOiAxMDEsXG4gIElOSVRJQUxJWkFUSU9OX0ZBSUxFRDogMTAxLFxuICBJTklUSUFMSVpFRDogMTAxLFxuICBURVJNSU5BVEVEOiAxMDEsXG4gIFRFUk1JTkFUSU9OX0ZBSUxVUkU6IDEwMSxcbiAgVEVSTUlOQVRJT05fQkVGT1JFX0lOSVQ6IDEwMSxcbiAgTVVMVElQTEVfVEVSTUlOQVRJT046IDEwMSxcbiAgUkVUUklFVkVfQkVGT1JFX0lOSVQ6IDEwMSxcbiAgUkVUUklFVkVfQUZURVJfVEVSTTogMTAxLFxuICBTVE9SRV9CRUZPUkVfSU5JVDogMTAxLFxuICBTVE9SRV9BRlRFUl9URVJNOiAxMDEsXG4gIENPTU1JVF9CRUZPUkVfSU5JVDogMTAxLFxuICBDT01NSVRfQUZURVJfVEVSTTogMTAxLFxuICBBUkdVTUVOVF9FUlJPUjogMTAxLFxuICBDSElMRFJFTl9FUlJPUjogMTAxLFxuICBDT1VOVF9FUlJPUjogMTAxLFxuICBHRU5FUkFMX0dFVF9GQUlMVVJFOiAxMDEsXG4gIEdFTkVSQUxfU0VUX0ZBSUxVUkU6IDEwMSxcbiAgR0VORVJBTF9DT01NSVRfRkFJTFVSRTogMTAxLFxuICBVTkRFRklORURfREFUQV9NT0RFTDogMTAxLFxuICBVTklNUExFTUVOVEVEX0VMRU1FTlQ6IDEwMSxcbiAgVkFMVUVfTk9UX0lOSVRJQUxJWkVEOiAxMDEsXG4gIElOVkFMSURfU0VUX1ZBTFVFOiAxMDEsXG4gIFJFQURfT05MWV9FTEVNRU5UOiAxMDEsXG4gIFdSSVRFX09OTFlfRUxFTUVOVDogMTAxLFxuICBUWVBFX01JU01BVENIOiAxMDEsXG4gIFZBTFVFX09VVF9PRl9SQU5HRTogMTAxLFxuICBERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRDogMTAxLFxufTtcblxuY29uc3Qgc2Nvcm0xMiA9IHtcbiAgLi4uZ2xvYmFsLCAuLi57XG4gICAgUkVUUklFVkVfQkVGT1JFX0lOSVQ6IDMwMSxcbiAgICBTVE9SRV9CRUZPUkVfSU5JVDogMzAxLFxuICAgIENPTU1JVF9CRUZPUkVfSU5JVDogMzAxLFxuICAgIEFSR1VNRU5UX0VSUk9SOiAyMDEsXG4gICAgQ0hJTERSRU5fRVJST1I6IDIwMixcbiAgICBDT1VOVF9FUlJPUjogMjAzLFxuICAgIFVOREVGSU5FRF9EQVRBX01PREVMOiA0MDEsXG4gICAgVU5JTVBMRU1FTlRFRF9FTEVNRU5UOiA0MDEsXG4gICAgVkFMVUVfTk9UX0lOSVRJQUxJWkVEOiAzMDEsXG4gICAgSU5WQUxJRF9TRVRfVkFMVUU6IDQwMixcbiAgICBSRUFEX09OTFlfRUxFTUVOVDogNDAzLFxuICAgIFdSSVRFX09OTFlfRUxFTUVOVDogNDA0LFxuICAgIFRZUEVfTUlTTUFUQ0g6IDQwNSxcbiAgICBWQUxVRV9PVVRfT0ZfUkFOR0U6IDQwNyxcbiAgICBERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRDogNDA4LFxuICB9LFxufTtcblxuY29uc3Qgc2Nvcm0yMDA0ID0ge1xuICAuLi5nbG9iYWwsIC4uLntcbiAgICBJTklUSUFMSVpBVElPTl9GQUlMRUQ6IDEwMixcbiAgICBJTklUSUFMSVpFRDogMTAzLFxuICAgIFRFUk1JTkFURUQ6IDEwNCxcbiAgICBURVJNSU5BVElPTl9GQUlMVVJFOiAxMTEsXG4gICAgVEVSTUlOQVRJT05fQkVGT1JFX0lOSVQ6IDExMixcbiAgICBNVUxUSVBMRV9URVJNSU5BVElPTlM6IDExMyxcbiAgICBSRVRSSUVWRV9CRUZPUkVfSU5JVDogMTIyLFxuICAgIFJFVFJJRVZFX0FGVEVSX1RFUk06IDEyMyxcbiAgICBTVE9SRV9CRUZPUkVfSU5JVDogMTMyLFxuICAgIFNUT1JFX0FGVEVSX1RFUk06IDEzMyxcbiAgICBDT01NSVRfQkVGT1JFX0lOSVQ6IDE0MixcbiAgICBDT01NSVRfQUZURVJfVEVSTTogMTQzLFxuICAgIEFSR1VNRU5UX0VSUk9SOiAyMDEsXG4gICAgR0VORVJBTF9HRVRfRkFJTFVSRTogMzAxLFxuICAgIEdFTkVSQUxfU0VUX0ZBSUxVUkU6IDM1MSxcbiAgICBHRU5FUkFMX0NPTU1JVF9GQUlMVVJFOiAzOTEsXG4gICAgVU5ERUZJTkVEX0RBVEFfTU9ERUw6IDQwMSxcbiAgICBVTklNUExFTUVOVEVEX0VMRU1FTlQ6IDQwMixcbiAgICBWQUxVRV9OT1RfSU5JVElBTElaRUQ6IDQwMyxcbiAgICBSRUFEX09OTFlfRUxFTUVOVDogNDA0LFxuICAgIFdSSVRFX09OTFlfRUxFTUVOVDogNDA1LFxuICAgIFRZUEVfTUlTTUFUQ0g6IDQwNixcbiAgICBWQUxVRV9PVVRfT0ZfUkFOR0U6IDQwNyxcbiAgICBERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRDogNDA4LFxuICB9LFxufTtcblxuY29uc3QgRXJyb3JDb2RlcyA9IHtcbiAgc2Nvcm0xMjogc2Nvcm0xMixcbiAgc2Nvcm0yMDA0OiBzY29ybTIwMDQsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBFcnJvckNvZGVzO1xuIiwiY29uc3QgVmFsaWRMYW5ndWFnZXMgPSB7XG4gICdhYSc6ICdhYScsICdhYic6ICdhYicsICdhZSc6ICdhZScsICdhZic6ICdhZicsICdhayc6ICdhaycsICdhbSc6ICdhbScsXG4gICdhbic6ICdhbicsICdhcic6ICdhcicsICdhcyc6ICdhcycsICdhdic6ICdhdicsICdheSc6ICdheScsICdheic6ICdheicsXG4gICdiYSc6ICdiYScsICdiZSc6ICdiZScsICdiZyc6ICdiZycsICdiaCc6ICdiaCcsICdiaSc6ICdiaScsICdibSc6ICdibScsXG4gICdibic6ICdibicsICdibyc6ICdibycsICdicic6ICdicicsICdicyc6ICdicycsICdjYSc6ICdjYScsICdjZSc6ICdjZScsXG4gICdjaCc6ICdjaCcsICdjbyc6ICdjbycsICdjcic6ICdjcicsICdjcyc6ICdjcycsICdjdSc6ICdjdScsICdjdic6ICdjdicsXG4gICdjeSc6ICdjeScsICdkYSc6ICdkYScsICdkZSc6ICdkZScsICdkdic6ICdkdicsICdkeic6ICdkeicsICdlZSc6ICdlZScsXG4gICdlbCc6ICdlbCcsICdlbic6ICdlbicsICdlbyc6ICdlbycsICdlcyc6ICdlcycsICdldCc6ICdldCcsICdldSc6ICdldScsXG4gICdmYSc6ICdmYScsICdmZic6ICdmZicsICdmaSc6ICdmaScsICdmaic6ICdmaicsICdmbyc6ICdmbycsICdmcic6ICdmcicsXG4gICdmeSc6ICdmeScsICdnYSc6ICdnYScsICdnZCc6ICdnZCcsICdnbCc6ICdnbCcsICdnbic6ICdnbicsICdndSc6ICdndScsXG4gICdndic6ICdndicsICdoYSc6ICdoYScsICdoZSc6ICdoZScsICdoaSc6ICdoaScsICdobyc6ICdobycsICdocic6ICdocicsXG4gICdodCc6ICdodCcsICdodSc6ICdodScsICdoeSc6ICdoeScsICdoeic6ICdoeicsICdpYSc6ICdpYScsICdpZCc6ICdpZCcsXG4gICdpZSc6ICdpZScsICdpZyc6ICdpZycsICdpaSc6ICdpaScsICdpayc6ICdpaycsICdpbyc6ICdpbycsICdpcyc6ICdpcycsXG4gICdpdCc6ICdpdCcsICdpdSc6ICdpdScsICdqYSc6ICdqYScsICdqdic6ICdqdicsICdrYSc6ICdrYScsICdrZyc6ICdrZycsXG4gICdraSc6ICdraScsICdraic6ICdraicsICdrayc6ICdraycsICdrbCc6ICdrbCcsICdrbSc6ICdrbScsICdrbic6ICdrbicsXG4gICdrbyc6ICdrbycsICdrcic6ICdrcicsICdrcyc6ICdrcycsICdrdSc6ICdrdScsICdrdic6ICdrdicsICdrdyc6ICdrdycsXG4gICdreSc6ICdreScsICdsYSc6ICdsYScsICdsYic6ICdsYicsICdsZyc6ICdsZycsICdsaSc6ICdsaScsICdsbic6ICdsbicsXG4gICdsbyc6ICdsbycsICdsdCc6ICdsdCcsICdsdSc6ICdsdScsICdsdic6ICdsdicsICdtZyc6ICdtZycsICdtaCc6ICdtaCcsXG4gICdtaSc6ICdtaScsICdtayc6ICdtaycsICdtbCc6ICdtbCcsICdtbic6ICdtbicsICdtbyc6ICdtbycsICdtcic6ICdtcicsXG4gICdtcyc6ICdtcycsICdtdCc6ICdtdCcsICdteSc6ICdteScsICduYSc6ICduYScsICduYic6ICduYicsICduZCc6ICduZCcsXG4gICduZSc6ICduZScsICduZyc6ICduZycsICdubCc6ICdubCcsICdubic6ICdubicsICdubyc6ICdubycsICducic6ICducicsXG4gICdudic6ICdudicsICdueSc6ICdueScsICdvYyc6ICdvYycsICdvaic6ICdvaicsICdvbSc6ICdvbScsICdvcic6ICdvcicsXG4gICdvcyc6ICdvcycsICdwYSc6ICdwYScsICdwaSc6ICdwaScsICdwbCc6ICdwbCcsICdwcyc6ICdwcycsICdwdCc6ICdwdCcsXG4gICdxdSc6ICdxdScsICdybSc6ICdybScsICdybic6ICdybicsICdybyc6ICdybycsICdydSc6ICdydScsICdydyc6ICdydycsXG4gICdzYSc6ICdzYScsICdzYyc6ICdzYycsICdzZCc6ICdzZCcsICdzZSc6ICdzZScsICdzZyc6ICdzZycsICdzaCc6ICdzaCcsXG4gICdzaSc6ICdzaScsICdzayc6ICdzaycsICdzbCc6ICdzbCcsICdzbSc6ICdzbScsICdzbic6ICdzbicsICdzbyc6ICdzbycsXG4gICdzcSc6ICdzcScsICdzcic6ICdzcicsICdzcyc6ICdzcycsICdzdCc6ICdzdCcsICdzdSc6ICdzdScsICdzdic6ICdzdicsXG4gICdzdyc6ICdzdycsICd0YSc6ICd0YScsICd0ZSc6ICd0ZScsICd0Zyc6ICd0ZycsICd0aCc6ICd0aCcsICd0aSc6ICd0aScsXG4gICd0ayc6ICd0aycsICd0bCc6ICd0bCcsICd0bic6ICd0bicsICd0byc6ICd0bycsICd0cic6ICd0cicsICd0cyc6ICd0cycsXG4gICd0dCc6ICd0dCcsICd0dyc6ICd0dycsICd0eSc6ICd0eScsICd1Zyc6ICd1ZycsICd1ayc6ICd1aycsICd1cic6ICd1cicsXG4gICd1eic6ICd1eicsICd2ZSc6ICd2ZScsICd2aSc6ICd2aScsICd2byc6ICd2bycsICd3YSc6ICd3YScsICd3byc6ICd3bycsXG4gICd4aCc6ICd4aCcsICd5aSc6ICd5aScsICd5byc6ICd5bycsICd6YSc6ICd6YScsICd6aCc6ICd6aCcsICd6dSc6ICd6dScsXG4gICdhYXInOiAnYWFyJywgJ2Fiayc6ICdhYmsnLCAnYXZlJzogJ2F2ZScsICdhZnInOiAnYWZyJywgJ2FrYSc6ICdha2EnLFxuICAnYW1oJzogJ2FtaCcsICdhcmcnOiAnYXJnJywgJ2FyYSc6ICdhcmEnLCAnYXNtJzogJ2FzbScsICdhdmEnOiAnYXZhJyxcbiAgJ2F5bSc6ICdheW0nLCAnYXplJzogJ2F6ZScsICdiYWsnOiAnYmFrJywgJ2JlbCc6ICdiZWwnLCAnYnVsJzogJ2J1bCcsXG4gICdiaWgnOiAnYmloJywgJ2Jpcyc6ICdiaXMnLCAnYmFtJzogJ2JhbScsICdiZW4nOiAnYmVuJywgJ3RpYic6ICd0aWInLFxuICAnYm9kJzogJ2JvZCcsICdicmUnOiAnYnJlJywgJ2Jvcyc6ICdib3MnLCAnY2F0JzogJ2NhdCcsICdjaGUnOiAnY2hlJyxcbiAgJ2NoYSc6ICdjaGEnLCAnY29zJzogJ2NvcycsICdjcmUnOiAnY3JlJywgJ2N6ZSc6ICdjemUnLCAnY2VzJzogJ2NlcycsXG4gICdjaHUnOiAnY2h1JywgJ2Nodic6ICdjaHYnLCAnd2VsJzogJ3dlbCcsICdjeW0nOiAnY3ltJywgJ2Rhbic6ICdkYW4nLFxuICAnZ2VyJzogJ2dlcicsICdkZXUnOiAnZGV1JywgJ2Rpdic6ICdkaXYnLCAnZHpvJzogJ2R6bycsICdld2UnOiAnZXdlJyxcbiAgJ2dyZSc6ICdncmUnLCAnZWxsJzogJ2VsbCcsICdlbmcnOiAnZW5nJywgJ2Vwbyc6ICdlcG8nLCAnc3BhJzogJ3NwYScsXG4gICdlc3QnOiAnZXN0JywgJ2JhcSc6ICdiYXEnLCAnZXVzJzogJ2V1cycsICdwZXInOiAncGVyJywgJ2Zhcyc6ICdmYXMnLFxuICAnZnVsJzogJ2Z1bCcsICdmaW4nOiAnZmluJywgJ2Zpaic6ICdmaWonLCAnZmFvJzogJ2ZhbycsICdmcmUnOiAnZnJlJyxcbiAgJ2ZyYSc6ICdmcmEnLCAnZnJ5JzogJ2ZyeScsICdnbGUnOiAnZ2xlJywgJ2dsYSc6ICdnbGEnLCAnZ2xnJzogJ2dsZycsXG4gICdncm4nOiAnZ3JuJywgJ2d1aic6ICdndWonLCAnZ2x2JzogJ2dsdicsICdoYXUnOiAnaGF1JywgJ2hlYic6ICdoZWInLFxuICAnaGluJzogJ2hpbicsICdobW8nOiAnaG1vJywgJ2hydic6ICdocnYnLCAnaGF0JzogJ2hhdCcsICdodW4nOiAnaHVuJyxcbiAgJ2FybSc6ICdhcm0nLCAnaHllJzogJ2h5ZScsICdoZXInOiAnaGVyJywgJ2luYSc6ICdpbmEnLCAnaW5kJzogJ2luZCcsXG4gICdpbGUnOiAnaWxlJywgJ2libyc6ICdpYm8nLCAnaWlpJzogJ2lpaScsICdpcGsnOiAnaXBrJywgJ2lkbyc6ICdpZG8nLFxuICAnaWNlJzogJ2ljZScsICdpc2wnOiAnaXNsJywgJ2l0YSc6ICdpdGEnLCAnaWt1JzogJ2lrdScsICdqcG4nOiAnanBuJyxcbiAgJ2phdic6ICdqYXYnLCAnZ2VvJzogJ2dlbycsICdrYXQnOiAna2F0JywgJ2tvbic6ICdrb24nLCAna2lrJzogJ2tpaycsXG4gICdrdWEnOiAna3VhJywgJ2theic6ICdrYXonLCAna2FsJzogJ2thbCcsICdraG0nOiAna2htJywgJ2thbic6ICdrYW4nLFxuICAna29yJzogJ2tvcicsICdrYXUnOiAna2F1JywgJ2thcyc6ICdrYXMnLCAna3VyJzogJ2t1cicsICdrb20nOiAna29tJyxcbiAgJ2Nvcic6ICdjb3InLCAna2lyJzogJ2tpcicsICdsYXQnOiAnbGF0JywgJ2x0eic6ICdsdHonLCAnbHVnJzogJ2x1ZycsXG4gICdsaW0nOiAnbGltJywgJ2xpbic6ICdsaW4nLCAnbGFvJzogJ2xhbycsICdsaXQnOiAnbGl0JywgJ2x1Yic6ICdsdWInLFxuICAnbGF2JzogJ2xhdicsICdtbGcnOiAnbWxnJywgJ21haCc6ICdtYWgnLCAnbWFvJzogJ21hbycsICdtcmknOiAnbXJpJyxcbiAgJ21hYyc6ICdtYWMnLCAnbWtkJzogJ21rZCcsICdtYWwnOiAnbWFsJywgJ21vbic6ICdtb24nLCAnbW9sJzogJ21vbCcsXG4gICdtYXInOiAnbWFyJywgJ21heSc6ICdtYXknLCAnbXNhJzogJ21zYScsICdtbHQnOiAnbWx0JywgJ2J1cic6ICdidXInLFxuICAnbXlhJzogJ215YScsICduYXUnOiAnbmF1JywgJ25vYic6ICdub2InLCAnbmRlJzogJ25kZScsICduZXAnOiAnbmVwJyxcbiAgJ25kbyc6ICduZG8nLCAnZHV0JzogJ2R1dCcsICdubGQnOiAnbmxkJywgJ25ubyc6ICdubm8nLCAnbm9yJzogJ25vcicsXG4gICduYmwnOiAnbmJsJywgJ25hdic6ICduYXYnLCAnbnlhJzogJ255YScsICdvY2knOiAnb2NpJywgJ29qaSc6ICdvamknLFxuICAnb3JtJzogJ29ybScsICdvcmknOiAnb3JpJywgJ29zcyc6ICdvc3MnLCAncGFuJzogJ3BhbicsICdwbGknOiAncGxpJyxcbiAgJ3BvbCc6ICdwb2wnLCAncHVzJzogJ3B1cycsICdwb3InOiAncG9yJywgJ3F1ZSc6ICdxdWUnLCAncm9oJzogJ3JvaCcsXG4gICdydW4nOiAncnVuJywgJ3J1bSc6ICdydW0nLCAncm9uJzogJ3JvbicsICdydXMnOiAncnVzJywgJ2tpbic6ICdraW4nLFxuICAnc2FuJzogJ3NhbicsICdzcmQnOiAnc3JkJywgJ3NuZCc6ICdzbmQnLCAnc21lJzogJ3NtZScsICdzYWcnOiAnc2FnJyxcbiAgJ3Nsbyc6ICdzbG8nLCAnc2luJzogJ3NpbicsICdzbGsnOiAnc2xrJywgJ3Nsdic6ICdzbHYnLCAnc21vJzogJ3NtbycsXG4gICdzbmEnOiAnc25hJywgJ3NvbSc6ICdzb20nLCAnYWxiJzogJ2FsYicsICdzcWknOiAnc3FpJywgJ3NycCc6ICdzcnAnLFxuICAnc3N3JzogJ3NzdycsICdzb3QnOiAnc290JywgJ3N1bic6ICdzdW4nLCAnc3dlJzogJ3N3ZScsICdzd2EnOiAnc3dhJyxcbiAgJ3RhbSc6ICd0YW0nLCAndGVsJzogJ3RlbCcsICd0Z2snOiAndGdrJywgJ3RoYSc6ICd0aGEnLCAndGlyJzogJ3RpcicsXG4gICd0dWsnOiAndHVrJywgJ3RnbCc6ICd0Z2wnLCAndHNuJzogJ3RzbicsICd0b24nOiAndG9uJywgJ3R1cic6ICd0dXInLFxuICAndHNvJzogJ3RzbycsICd0YXQnOiAndGF0JywgJ3R3aSc6ICd0d2knLCAndGFoJzogJ3RhaCcsICd1aWcnOiAndWlnJyxcbiAgJ3Vrcic6ICd1a3InLCAndXJkJzogJ3VyZCcsICd1emInOiAndXpiJywgJ3Zlbic6ICd2ZW4nLCAndmllJzogJ3ZpZScsXG4gICd2b2wnOiAndm9sJywgJ3dsbic6ICd3bG4nLCAnd29sJzogJ3dvbCcsICd4aG8nOiAneGhvJywgJ3lpZCc6ICd5aWQnLFxuICAneW9yJzogJ3lvcicsICd6aGEnOiAnemhhJywgJ2NoaSc6ICdjaGknLCAnemhvJzogJ3pobycsICd6dWwnOiAnenVsJyxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFZhbGlkTGFuZ3VhZ2VzO1xuIiwiLy8gQGZsb3dcblxuY29uc3Qgc2Nvcm0xMiA9IHtcbiAgQ01JU3RyaW5nMjU2OiAnXi57MCwyNTV9JCcsXG4gIENNSVN0cmluZzQwOTY6ICdeLnswLDQwOTZ9JCcsXG4gIENNSVRpbWU6ICdeKD86WzAxXVxcXFxkfDJbMDEyM10pOig/OlswMTIzNDVdXFxcXGQpOig/OlswMTIzNDVdXFxcXGQpJCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JVGltZXNwYW46ICdeKFswLTldezIsfSk6KFswLTldezJ9KTooWzAtOV17Mn0pKFxcLlswLTldezEsMn0pPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUludGVnZXI6ICdeXFxcXGQrJCcsXG4gIENNSVNJbnRlZ2VyOiAnXi0/KFswLTldKykkJyxcbiAgQ01JRGVjaW1hbDogJ14tPyhbMC05XXswLDN9KShcXC5bMC05XSopPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUlkZW50aWZpZXI6ICdeW1xcXFx1MDAyMS1cXFxcdTAwN0VdezAsMjU1fSQnLFxuICBDTUlGZWVkYmFjazogJ14uezAsMjU1fSQnLCAvLyBUaGlzIG11c3QgYmUgcmVkZWZpbmVkXG4gIENNSUluZGV4OiAnWy5fXShcXFxcZCspLicsXG5cbiAgLy8gVm9jYWJ1bGFyeSBEYXRhIFR5cGUgRGVmaW5pdGlvblxuICBDTUlTdGF0dXM6ICdeKHBhc3NlZHxjb21wbGV0ZWR8ZmFpbGVkfGluY29tcGxldGV8YnJvd3NlZCkkJyxcbiAgQ01JU3RhdHVzMjogJ14ocGFzc2VkfGNvbXBsZXRlZHxmYWlsZWR8aW5jb21wbGV0ZXxicm93c2VkfG5vdCBhdHRlbXB0ZWQpJCcsXG4gIENNSUV4aXQ6ICdeKHRpbWUtb3V0fHN1c3BlbmR8bG9nb3V0fCkkJyxcbiAgQ01JVHlwZTogJ14odHJ1ZS1mYWxzZXxjaG9pY2V8ZmlsbC1pbnxtYXRjaGluZ3xwZXJmb3JtYW5jZXxzZXF1ZW5jaW5nfGxpa2VydHxudW1lcmljKSQnLFxuICBDTUlSZXN1bHQ6ICdeKGNvcnJlY3R8d3Jvbmd8dW5hbnRpY2lwYXRlZHxuZXV0cmFsfChbMC05XXswLDN9KT8oXFxcXC5bMC05XSopPykkJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBOQVZFdmVudDogJ14ocHJldmlvdXN8Y29udGludWUpJCcsXG5cbiAgLy8gRGF0YSByYW5nZXNcbiAgc2NvcmVfcmFuZ2U6ICcwIzEwMCcsXG4gIGF1ZGlvX3JhbmdlOiAnLTEjMTAwJyxcbiAgc3BlZWRfcmFuZ2U6ICctMTAwIzEwMCcsXG4gIHdlaWdodGluZ19yYW5nZTogJy0xMDAjMTAwJyxcbiAgdGV4dF9yYW5nZTogJy0xIzEnLFxufTtcblxuY29uc3QgYWljYyA9IHtcbiAgLi4uc2Nvcm0xMiwgLi4ue1xuICAgIENNSUlkZW50aWZpZXI6ICdeXFxcXHd7MSwyNTV9JCcsXG4gIH0sXG59O1xuXG5jb25zdCBzY29ybTIwMDQgPSB7XG4gIENNSVN0cmluZzIwMDogJ15bXFxcXHUwMDAwLVxcXFx1RkZGRl17MCwyMDB9JCcsXG4gIENNSVN0cmluZzI1MDogJ15bXFxcXHUwMDAwLVxcXFx1RkZGRl17MCwyNTB9JCcsXG4gIENNSVN0cmluZzEwMDA6ICdeW1xcXFx1MDAwMC1cXFxcdUZGRkZdezAsMTAwMH0kJyxcbiAgQ01JU3RyaW5nNDAwMDogJ15bXFxcXHUwMDAwLVxcXFx1RkZGRl17MCw0MDAwfSQnLFxuICBDTUlTdHJpbmc2NDAwMDogJ15bXFxcXHUwMDAwLVxcXFx1RkZGRl17MCw2NDAwMH0kJyxcbiAgQ01JTGFuZzogJ14oW2EtekEtWl17MiwzfXxpfHgpKFxcLVthLXpBLVowLTlcXC1dezIsOH0pPyR8XiQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUxhbmdTdHJpbmcyNTA6ICdeKFxce2xhbmc9KFthLXpBLVpdezIsM318aXx4KShcXC1bYS16QS1aMC05XFwtXXsyLDh9KT9cXH0pPygoPyFcXHsuKiQpLnswLDI1MH0kKT8kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlMYW5nY3I6ICdeKChcXHtsYW5nPShbYS16QS1aXXsyLDN9fGl8eCk/KFxcLVthLXpBLVowLTlcXC1dezIsOH0pP1xcfSkpKC4qPykkJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlMYW5nU3RyaW5nMjUwY3I6ICdeKChcXHtsYW5nPShbYS16QS1aXXsyLDN9fGl8eCk/KFxcLVthLXpBLVowLTlcXC1dezIsOH0pP1xcfSk/KC57MCwyNTB9KT8pPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUxhbmdTdHJpbmc0MDAwOiAnXihcXHtsYW5nPShbYS16QS1aXXsyLDN9fGl8eCkoXFwtW2EtekEtWjAtOVxcLV17Miw4fSk/XFx9KT8oKD8hXFx7LiokKS57MCw0MDAwfSQpPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSVRpbWU6ICdeKDE5WzctOV17MX1bMC05XXsxfXwyMFswLTJdezF9WzAtOV17MX18MjAzWzAtOF17MX0pKCgtKDBbMS05XXsxfXwxWzAtMl17MX0pKSgoLSgwWzEtOV17MX18WzEtMl17MX1bMC05XXsxfXwzWzAtMV17MX0pKShUKFswLTFdezF9WzAtOV17MX18MlswLTNdezF9KSgoOlswLTVdezF9WzAtOV17MX0pKCg6WzAtNV17MX1bMC05XXsxfSkoKFxcXFwuWzAtOV17MSwyfSkoKFp8KFsrfC1dKFswLTFdezF9WzAtOV17MX18MlswLTNdezF9KSkpKDpbMC01XXsxfVswLTldezF9KT8pPyk/KT8pPyk/KT8pPyQnLFxuICBDTUlUaW1lc3BhbjogJ15QKD86KFsuLFxcXFxkXSspWSk/KD86KFsuLFxcXFxkXSspTSk/KD86KFsuLFxcXFxkXSspVyk/KD86KFsuLFxcXFxkXSspRCk/KD86VD8oPzooWy4sXFxcXGRdKylIKT8oPzooWy4sXFxcXGRdKylNKT8oPzooWy4sXFxcXGRdKylTKT8pPyQnLFxuICBDTUlJbnRlZ2VyOiAnXlxcXFxkKyQnLFxuICBDTUlTSW50ZWdlcjogJ14tPyhbMC05XSspJCcsXG4gIENNSURlY2ltYWw6ICdeLT8oWzAtOV17MSw1fSkoXFxcXC5bMC05XXsxLDE4fSk/JCcsXG4gIENNSUlkZW50aWZpZXI6ICdeXFxcXFN7MSwyNTB9W2EtekEtWjAtOV0kJyxcbiAgQ01JU2hvcnRJZGVudGlmaWVyOiAnXltcXFxcd1xcXFwuXFxcXC1cXFxcX117MSwyNTB9JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JTG9uZ0lkZW50aWZpZXI6ICdeKD86KD8hdXJuOilcXFxcU3sxLDQwMDB9fHVybjpbQS1aYS16MC05LV17MSwzMX06XFxcXFN7MSw0MDAwfXwuezEsNDAwMH0pJCcsIC8vIG5lZWQgdG8gcmUtZXhhbWluZSB0aGlzXG4gIENNSUZlZWRiYWNrOiAnXi4qJCcsIC8vIFRoaXMgbXVzdCBiZSByZWRlZmluZWRcbiAgQ01JSW5kZXg6ICdbLl9dKFxcXFxkKykuJyxcbiAgQ01JSW5kZXhTdG9yZTogJy5OKFxcXFxkKykuJyxcblxuICAvLyBWb2NhYnVsYXJ5IERhdGEgVHlwZSBEZWZpbml0aW9uXG4gIENNSUNTdGF0dXM6ICdeKGNvbXBsZXRlZHxpbmNvbXBsZXRlfG5vdCBhdHRlbXB0ZWR8dW5rbm93bikkJyxcbiAgQ01JU1N0YXR1czogJ14ocGFzc2VkfGZhaWxlZHx1bmtub3duKSQnLFxuICBDTUlFeGl0OiAnXih0aW1lLW91dHxzdXNwZW5kfGxvZ291dHxub3JtYWwpJCcsXG4gIENNSVR5cGU6ICdeKHRydWUtZmFsc2V8Y2hvaWNlfGZpbGwtaW58bG9uZy1maWxsLWlufG1hdGNoaW5nfHBlcmZvcm1hbmNlfHNlcXVlbmNpbmd8bGlrZXJ0fG51bWVyaWN8b3RoZXIpJCcsXG4gIENNSVJlc3VsdDogJ14oY29ycmVjdHx3cm9uZ3x1bmFudGljaXBhdGVkfG5ldXRyYWx8LT8oWzAtOV17MSw0fSkoXFxcXC5bMC05XXsxLDE4fSk/KSQnLFxuICBOQVZFdmVudDogJ14ocHJldmlvdXN8Y29udGludWV8ZXhpdHxleGl0QWxsfGFiYW5kb258YWJhbmRvbkFsbHxzdXNwZW5kQWxsfFxce3RhcmdldD1cXFxcU3swLDIwMH1bYS16QS1aMC05XVxcfWNob2ljZXxqdW1wKSQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIE5BVkJvb2xlYW46ICdeKHVua25vd258dHJ1ZXxmYWxzZSQpJyxcbiAgTkFWVGFyZ2V0OiAnXihwcmV2aW91c3xjb250aW51ZXxjaG9pY2Uue3RhcmdldD1cXFxcU3swLDIwMH1bYS16QS1aMC05XX0pJCcsXG5cbiAgLy8gRGF0YSByYW5nZXNcbiAgc2NhbGVkX3JhbmdlOiAnLTEjMScsXG4gIGF1ZGlvX3JhbmdlOiAnMCMqJyxcbiAgc3BlZWRfcmFuZ2U6ICcwIyonLFxuICB0ZXh0X3JhbmdlOiAnLTEjMScsXG4gIHByb2dyZXNzX3JhbmdlOiAnMCMxJyxcbn07XG5cbmNvbnN0IFJlZ2V4ID0ge1xuICBhaWNjOiBhaWNjLFxuICBzY29ybTEyOiBzY29ybTEyLFxuICBzY29ybTIwMDQ6IHNjb3JtMjAwNCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2V4O1xuIiwiLy8gQGZsb3dcbmltcG9ydCBSZWdleCBmcm9tICcuL3JlZ2V4JztcblxuY29uc3Qgc2Nvcm0yMDA0X3JlZ2V4ID0gUmVnZXguc2Nvcm0yMDA0O1xuXG5jb25zdCBsZWFybmVyID0ge1xuICAndHJ1ZS1mYWxzZSc6IHtcbiAgICBmb3JtYXQ6ICdedHJ1ZSR8XmZhbHNlJCcsXG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ2Nob2ljZSc6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgbWF4OiAzNixcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIHVuaXF1ZTogdHJ1ZSxcbiAgfSxcbiAgJ2ZpbGwtaW4nOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JTGFuZ1N0cmluZzI1MCxcbiAgICBtYXg6IDEwLFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ2xvbmctZmlsbC1pbic6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nU3RyaW5nNDAwMCxcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnbWF0Y2hpbmcnOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIGZvcm1hdDI6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgbWF4OiAzNixcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIGRlbGltaXRlcjI6ICdbLl0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdwZXJmb3JtYW5jZSc6IHtcbiAgICBmb3JtYXQ6ICdeJHwnICsgc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBmb3JtYXQyOiBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCArICd8XiR8JyArXG4gICAgICAgIHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgbWF4OiAyNTAsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICBkZWxpbWl0ZXIyOiAnWy5dJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnc2VxdWVuY2luZyc6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgbWF4OiAzNixcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdsaWtlcnQnOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdudW1lcmljJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwsXG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ290aGVyJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVN0cmluZzQwMDAsXG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbn07XG5cbmNvbnN0IGNvcnJlY3QgPSB7XG4gICd0cnVlLWZhbHNlJzoge1xuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6ICdedHJ1ZSR8XmZhbHNlJCcsXG4gICAgbGltaXQ6IDEsXG4gIH0sXG4gICdjaG9pY2UnOiB7XG4gICAgbWF4OiAzNixcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIHVuaXF1ZTogdHJ1ZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgfSxcbiAgJ2ZpbGwtaW4nOiB7XG4gICAgbWF4OiAxMCxcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nU3RyaW5nMjUwY3IsXG4gIH0sXG4gICdsb25nLWZpbGwtaW4nOiB7XG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IHRydWUsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JTGFuZ1N0cmluZzQwMDAsXG4gIH0sXG4gICdtYXRjaGluZyc6IHtcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgZGVsaW1pdGVyMjogJ1suXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBmb3JtYXQyOiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICB9LFxuICAncGVyZm9ybWFuY2UnOiB7XG4gICAgbWF4OiAyNTAsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICBkZWxpbWl0ZXIyOiAnWy5dJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiAnXiR8JyArIHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgZm9ybWF0Mjogc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwgKyAnfF4kfCcgK1xuICAgICAgICBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICB9LFxuICAnc2VxdWVuY2luZyc6IHtcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgfSxcbiAgJ2xpa2VydCc6IHtcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIGxpbWl0OiAxLFxuICB9LFxuICAnbnVtZXJpYyc6IHtcbiAgICBtYXg6IDIsXG4gICAgZGVsaW1pdGVyOiAnWzpdJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCxcbiAgICBsaW1pdDogMSxcbiAgfSxcbiAgJ290aGVyJzoge1xuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTdHJpbmc0MDAwLFxuICAgIGxpbWl0OiAxLFxuICB9LFxufTtcblxuY29uc3QgUmVzcG9uc2VzID0ge1xuICBsZWFybmVyOiBsZWFybmVyLFxuICBjb3JyZWN0OiBjb3JyZWN0LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgUmVzcG9uc2VzO1xuIiwiLy8gQGZsb3dcblxuLyoqXG4gKiBEYXRhIFZhbGlkYXRpb24gRXhjZXB0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBWYWxpZGF0aW9uRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciB0byB0YWtlIGluIGFuIGVycm9yIG1lc3NhZ2UgYW5kIGNvZGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IGVycm9yQ29kZVxuICAgKi9cbiAgY29uc3RydWN0b3IoZXJyb3JDb2RlOiBudW1iZXIpIHtcbiAgICBzdXBlcihlcnJvckNvZGUpO1xuICAgIHRoaXMuI2Vycm9yQ29kZSA9IGVycm9yQ29kZTtcbiAgfVxuXG4gICNlcnJvckNvZGU7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2Vycm9yQ29kZVxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAqL1xuICBnZXQgZXJyb3JDb2RlKCkge1xuICAgIHJldHVybiB0aGlzLiNlcnJvckNvZGU7XG4gIH1cblxuICAvKipcbiAgICogVHJ5aW5nIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IEVycm9yIG1lc3NhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1lc3NhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2Vycm9yQ29kZSArICcnO1xuICB9XG59XG4iLCJpbXBvcnQgU2Nvcm0yMDA0QVBJIGZyb20gJy4vU2Nvcm0yMDA0QVBJJztcbmltcG9ydCBTY29ybTEyQVBJIGZyb20gJy4vU2Nvcm0xMkFQSSc7XG5pbXBvcnQgQUlDQyBmcm9tICcuL0FJQ0MnO1xuXG53aW5kb3cuU2Nvcm0xMkFQSSA9IFNjb3JtMTJBUEk7XG53aW5kb3cuU2Nvcm0yMDA0QVBJID0gU2Nvcm0yMDA0QVBJO1xud2luZG93LkFJQ0MgPSBBSUNDO1xuIiwiLy8gQGZsb3dcbmV4cG9ydCBjb25zdCBTRUNPTkRTX1BFUl9TRUNPTkQgPSAxLjA7XG5leHBvcnQgY29uc3QgU0VDT05EU19QRVJfTUlOVVRFID0gNjA7XG5leHBvcnQgY29uc3QgU0VDT05EU19QRVJfSE9VUiA9IDYwICogU0VDT05EU19QRVJfTUlOVVRFO1xuZXhwb3J0IGNvbnN0IFNFQ09ORFNfUEVSX0RBWSA9IDI0ICogU0VDT05EU19QRVJfSE9VUjtcblxuY29uc3QgZGVzaWduYXRpb25zID0gW1xuICBbJ0QnLCBTRUNPTkRTX1BFUl9EQVldLFxuICBbJ0gnLCBTRUNPTkRTX1BFUl9IT1VSXSxcbiAgWydNJywgU0VDT05EU19QRVJfTUlOVVRFXSxcbiAgWydTJywgU0VDT05EU19QRVJfU0VDT05EXSxcbl07XG5cbi8qKlxuICogQ29udmVydHMgYSBOdW1iZXIgdG8gYSBTdHJpbmcgb2YgSEg6TU06U1NcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gdG90YWxTZWNvbmRzXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWNvbmRzQXNISE1NU1ModG90YWxTZWNvbmRzOiBOdW1iZXIpIHtcbiAgLy8gU0NPUk0gc3BlYyBkb2VzIG5vdCBkZWFsIHdpdGggbmVnYXRpdmUgZHVyYXRpb25zLCBnaXZlIHplcm8gYmFja1xuICBpZiAoIXRvdGFsU2Vjb25kcyB8fCB0b3RhbFNlY29uZHMgPD0gMCkge1xuICAgIHJldHVybiAnMDA6MDA6MDAnO1xuICB9XG5cbiAgY29uc3QgaG91cnMgPSBNYXRoLmZsb29yKHRvdGFsU2Vjb25kcyAvIFNFQ09ORFNfUEVSX0hPVVIpO1xuXG4gIGNvbnN0IGRhdGVPYmogPSBuZXcgRGF0ZSh0b3RhbFNlY29uZHMgKiAxMDAwKTtcbiAgY29uc3QgbWludXRlcyA9IGRhdGVPYmouZ2V0VVRDTWludXRlcygpO1xuICAvLyBtYWtlIHN1cmUgd2UgYWRkIGFueSBwb3NzaWJsZSBkZWNpbWFsIHZhbHVlXG4gIGNvbnN0IHNlY29uZHMgPSBkYXRlT2JqLmdldFNlY29uZHMoKTtcbiAgY29uc3QgbXMgPSB0b3RhbFNlY29uZHMgJSAxLjA7XG4gIGxldCBtc1N0ciA9ICcnO1xuICBpZiAoY291bnREZWNpbWFscyhtcykgPiAwKSB7XG4gICAgaWYgKGNvdW50RGVjaW1hbHMobXMpID4gMikge1xuICAgICAgbXNTdHIgPSBtcy50b0ZpeGVkKDIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtc1N0ciA9IFN0cmluZyhtcyk7XG4gICAgfVxuICAgIG1zU3RyID0gJy4nICsgbXNTdHIuc3BsaXQoJy4nKVsxXTtcbiAgfVxuXG4gIHJldHVybiAoaG91cnMgKyAnOicgKyBtaW51dGVzICsgJzonICsgc2Vjb25kcykucmVwbGFjZSgvXFxiXFxkXFxiL2csXG4gICAgICAnMCQmJykgKyBtc1N0cjtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgdGhlIG51bWJlciBvZiBzZWNvbmRzIGZyb20gSVNPIDg2MDEgRHVyYXRpb25cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gc2Vjb25kc1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2Vjb25kc0FzSVNPRHVyYXRpb24oc2Vjb25kczogTnVtYmVyKSB7XG4gIC8vIFNDT1JNIHNwZWMgZG9lcyBub3QgZGVhbCB3aXRoIG5lZ2F0aXZlIGR1cmF0aW9ucywgZ2l2ZSB6ZXJvIGJhY2tcbiAgaWYgKCFzZWNvbmRzIHx8IHNlY29uZHMgPD0gMCkge1xuICAgIHJldHVybiAnUFQwUyc7XG4gIH1cblxuICBsZXQgZHVyYXRpb24gPSAnUCc7XG4gIGxldCByZW1haW5kZXIgPSBzZWNvbmRzO1xuXG4gIGRlc2lnbmF0aW9ucy5mb3JFYWNoKChbc2lnbiwgY3VycmVudF9zZWNvbmRzXSkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IE1hdGguZmxvb3IocmVtYWluZGVyIC8gY3VycmVudF9zZWNvbmRzKTtcblxuICAgIHJlbWFpbmRlciA9IHJlbWFpbmRlciAlIGN1cnJlbnRfc2Vjb25kcztcbiAgICBpZiAoY291bnREZWNpbWFscyhyZW1haW5kZXIpID4gMikge1xuICAgICAgcmVtYWluZGVyID0gTnVtYmVyKE51bWJlcihyZW1haW5kZXIpLnRvRml4ZWQoMikpO1xuICAgIH1cbiAgICAvLyBJZiB3ZSBoYXZlIGFueXRoaW5nIGxlZnQgaW4gdGhlIHJlbWFpbmRlciwgYW5kIHdlJ3JlIGN1cnJlbnRseSBhZGRpbmdcbiAgICAvLyBzZWNvbmRzIHRvIHRoZSBkdXJhdGlvbiwgZ28gYWhlYWQgYW5kIGFkZCB0aGUgZGVjaW1hbCB0byB0aGUgc2Vjb25kc1xuICAgIGlmIChzaWduID09PSAnUycgJiYgcmVtYWluZGVyID4gMCkge1xuICAgICAgdmFsdWUgKz0gcmVtYWluZGVyO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgaWYgKChkdXJhdGlvbi5pbmRleE9mKCdEJykgPiAwIHx8XG4gICAgICAgICAgc2lnbiA9PT0gJ0gnIHx8IHNpZ24gPT09ICdNJyB8fCBzaWduID09PSAnUycpICYmXG4gICAgICAgICAgZHVyYXRpb24uaW5kZXhPZignVCcpID09PSAtMSkge1xuICAgICAgICBkdXJhdGlvbiArPSAnVCc7XG4gICAgICB9XG4gICAgICBkdXJhdGlvbiArPSBgJHt2YWx1ZX0ke3NpZ259YDtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBkdXJhdGlvbjtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgdGhlIG51bWJlciBvZiBzZWNvbmRzIGZyb20gSEg6TU06U1MuREREREREXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRpbWVTdHJpbmdcbiAqIEBwYXJhbSB7UmVnRXhwfSB0aW1lUmVnZXhcbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbWVBc1NlY29uZHModGltZVN0cmluZzogU3RyaW5nLCB0aW1lUmVnZXg6IFJlZ0V4cCkge1xuICBpZiAoIXRpbWVTdHJpbmcgfHwgdHlwZW9mIHRpbWVTdHJpbmcgIT09ICdzdHJpbmcnIHx8XG4gICAgICAhdGltZVN0cmluZy5tYXRjaCh0aW1lUmVnZXgpKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgY29uc3QgcGFydHMgPSB0aW1lU3RyaW5nLnNwbGl0KCc6Jyk7XG4gIGNvbnN0IGhvdXJzID0gTnVtYmVyKHBhcnRzWzBdKTtcbiAgY29uc3QgbWludXRlcyA9IE51bWJlcihwYXJ0c1sxXSk7XG4gIGNvbnN0IHNlY29uZHMgPSBOdW1iZXIocGFydHNbMl0pO1xuICByZXR1cm4gKGhvdXJzICogMzYwMCkgKyAobWludXRlcyAqIDYwKSArIHNlY29uZHM7XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlIHRoZSBudW1iZXIgb2Ygc2Vjb25kcyBmcm9tIElTTyA4NjAxIER1cmF0aW9uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGR1cmF0aW9uXG4gKiBAcGFyYW0ge1JlZ0V4cH0gZHVyYXRpb25SZWdleFxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RHVyYXRpb25Bc1NlY29uZHMoZHVyYXRpb246IFN0cmluZywgZHVyYXRpb25SZWdleDogUmVnRXhwKSB7XG4gIGlmICghZHVyYXRpb24gfHwgIWR1cmF0aW9uLm1hdGNoKGR1cmF0aW9uUmVnZXgpKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBjb25zdCBbLCB5ZWFycywgbW9udGhzLCAsIGRheXMsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzXSA9IG5ldyBSZWdFeHAoXG4gICAgICBkdXJhdGlvblJlZ2V4KS5leGVjKGR1cmF0aW9uKSB8fCBbXTtcblxuICBsZXQgcmVzdWx0ID0gMC4wO1xuXG4gIHJlc3VsdCArPSAoTnVtYmVyKHNlY29uZHMpICogMS4wIHx8IDAuMCk7XG4gIHJlc3VsdCArPSAoTnVtYmVyKG1pbnV0ZXMpICogNjAuMCB8fCAwLjApO1xuICByZXN1bHQgKz0gKE51bWJlcihob3VycykgKiAzNjAwLjAgfHwgMC4wKTtcbiAgcmVzdWx0ICs9IChOdW1iZXIoZGF5cykgKiAoNjAgKiA2MCAqIDI0LjApIHx8IDAuMCk7XG4gIHJlc3VsdCArPSAoTnVtYmVyKHllYXJzKSAqICg2MCAqIDYwICogMjQgKiAzNjUuMCkgfHwgMC4wKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEFkZHMgdG9nZXRoZXIgdHdvIElTTzg2MDEgRHVyYXRpb24gc3RyaW5nc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaXJzdFxuICogQHBhcmFtIHtzdHJpbmd9IHNlY29uZFxuICogQHBhcmFtIHtSZWdFeHB9IGR1cmF0aW9uUmVnZXhcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZFR3b0R1cmF0aW9ucyhcbiAgICBmaXJzdDogU3RyaW5nLFxuICAgIHNlY29uZDogU3RyaW5nLFxuICAgIGR1cmF0aW9uUmVnZXg6IFJlZ0V4cCkge1xuICByZXR1cm4gZ2V0U2Vjb25kc0FzSVNPRHVyYXRpb24oXG4gICAgICBnZXREdXJhdGlvbkFzU2Vjb25kcyhmaXJzdCwgZHVyYXRpb25SZWdleCkgK1xuICAgICAgZ2V0RHVyYXRpb25Bc1NlY29uZHMoc2Vjb25kLCBkdXJhdGlvblJlZ2V4KSxcbiAgKTtcbn1cblxuLyoqXG4gKiBBZGQgdG9nZXRoZXIgdHdvIEhIOk1NOlNTLkREIHN0cmluZ3NcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlyc3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWNvbmRcbiAqIEBwYXJhbSB7UmVnRXhwfSB0aW1lUmVnZXhcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZEhITU1TU1RpbWVTdHJpbmdzKFxuICAgIGZpcnN0OiBTdHJpbmcsXG4gICAgc2Vjb25kOiBTdHJpbmcsXG4gICAgdGltZVJlZ2V4OiBSZWdFeHApIHtcbiAgcmV0dXJuIGdldFNlY29uZHNBc0hITU1TUyhcbiAgICAgIGdldFRpbWVBc1NlY29uZHMoZmlyc3QsIHRpbWVSZWdleCkgK1xuICAgICAgZ2V0VGltZUFzU2Vjb25kcyhcbiAgICAgICAgICBzZWNvbmQsIHRpbWVSZWdleCksXG4gICk7XG59XG5cbi8qKlxuICogRmxhdHRlbiBhIEpTT04gb2JqZWN0IGRvd24gdG8gc3RyaW5nIHBhdGhzIGZvciBlYWNoIHZhbHVlc1xuICogQHBhcmFtIHtvYmplY3R9IGRhdGFcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZsYXR0ZW4oZGF0YSkge1xuICBjb25zdCByZXN1bHQgPSB7fTtcblxuICAvKipcbiAgICogUmVjdXJzZSB0aHJvdWdoIHRoZSBvYmplY3RcbiAgICogQHBhcmFtIHsqfSBjdXJcbiAgICogQHBhcmFtIHsqfSBwcm9wXG4gICAqL1xuICBmdW5jdGlvbiByZWN1cnNlKGN1ciwgcHJvcCkge1xuICAgIGlmIChPYmplY3QoY3VyKSAhPT0gY3VyKSB7XG4gICAgICByZXN1bHRbcHJvcF0gPSBjdXI7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGN1cikpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gY3VyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICByZWN1cnNlKGN1cltpXSwgcHJvcCArICdbJyArIGkgKyAnXScpO1xuICAgICAgICBpZiAobCA9PT0gMCkgcmVzdWx0W3Byb3BdID0gW107XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBpc0VtcHR5ID0gdHJ1ZTtcbiAgICAgIGZvciAoY29uc3QgcCBpbiBjdXIpIHtcbiAgICAgICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoY3VyLCBwKSkge1xuICAgICAgICAgIGlzRW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICByZWN1cnNlKGN1cltwXSwgcHJvcCA/IHByb3AgKyAnLicgKyBwIDogcCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0VtcHR5ICYmIHByb3ApIHJlc3VsdFtwcm9wXSA9IHt9O1xuICAgIH1cbiAgfVxuXG4gIHJlY3Vyc2UoZGF0YSwgJycpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFVuLWZsYXR0ZW4gYSBmbGF0IEpTT04gb2JqZWN0XG4gKiBAcGFyYW0ge29iamVjdH0gZGF0YVxuICogQHJldHVybiB7b2JqZWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5mbGF0dGVuKGRhdGEpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICBpZiAoT2JqZWN0KGRhdGEpICE9PSBkYXRhIHx8IEFycmF5LmlzQXJyYXkoZGF0YSkpIHJldHVybiBkYXRhO1xuICBjb25zdCByZWdleCA9IC9cXC4/KFteLltcXF1dKyl8XFxbKFxcZCspXS9nO1xuICBjb25zdCByZXN1bHQgPSB7fTtcbiAgZm9yIChjb25zdCBwIGluIGRhdGEpIHtcbiAgICBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBwKSkge1xuICAgICAgbGV0IGN1ciA9IHJlc3VsdDtcbiAgICAgIGxldCBwcm9wID0gJyc7XG4gICAgICBsZXQgbSA9IHJlZ2V4LmV4ZWMocCk7XG4gICAgICB3aGlsZSAobSkge1xuICAgICAgICBjdXIgPSBjdXJbcHJvcF0gfHwgKGN1cltwcm9wXSA9IChtWzJdID8gW10gOiB7fSkpO1xuICAgICAgICBwcm9wID0gbVsyXSB8fCBtWzFdO1xuICAgICAgICBtID0gcmVnZXguZXhlYyhwKTtcbiAgICAgIH1cbiAgICAgIGN1cltwcm9wXSA9IGRhdGFbcF07XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHRbJyddIHx8IHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDb3VudHMgdGhlIG51bWJlciBvZiBkZWNpbWFsIHBsYWNlc1xuICogQHBhcmFtIHtudW1iZXJ9IG51bVxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gY291bnREZWNpbWFscyhudW06IG51bWJlcikge1xuICBpZiAoTWF0aC5mbG9vcihudW0pID09PSBudW0gfHwgU3RyaW5nKG51bSkuaW5kZXhPZignLicpIDwgMCkgcmV0dXJuIDA7XG4gIGNvbnN0IHBhcnRzID0gbnVtLnRvU3RyaW5nKCkuc3BsaXQoJy4nKVsxXTtcbiAgcmV0dXJuIHBhcnRzLmxlbmd0aCB8fCAwO1xufVxuIl19
