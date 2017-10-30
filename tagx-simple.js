// taken from nytimes.com
// Seems to be HeadJS, but I don't know which version.
// TODO: check if we can replace by jQuery methods.

/*!
  * Ender: open module JavaScript framework (client-lib)
  * copyright Dustin Diaz & Jacob Thornton 2011-2012 (@ded @fat)
  * http://ender.jit.su
  * License MIT
  */

  /*!
  * domready (c) Dustin Diaz 2012 - License MIT
  */

	/*!
  * @preserve Qwery - A Blazing Fast query selector engine
  * https://github.com/ded/qwery
  * copyright Dustin Diaz 2012
  */

	/*!
  * Bonzo: DOM Utility (c) Dustin Diaz 2012
  * https://github.com/ded/bonzo
  */

	/*!
  * Bean - copyright (c) Jacob Thornton 2011-2012
  * https://github.com/fat/bean
  */

(function(window) {
	'use strict';
	var TAGX;

	// Create a TAGX variable.
	TAGX = {
		// Restore the global vars.
		'$': window.ender.noConflict(true),
		setTaggerReady: function() {
			this.taggerReady = true;
			this.EventProxy.tagsLoaded();
		}
	};

	// Export the variable to global environment.
	window.TAGX = TAGX;
}(window));
console.log('bootstrap/ender.js loaded');
TAGX.Utils = (function() {
	'use strict';
	var head = window.head;

	var utils = {
		txpcn: 'tagx-p'
	};

	var meterCookie = function(name, cookie) {
		var regex = new RegExp(name + '=([il]{1}).([^&]+)').exec(cookie);
		if (regex && regex.length >= 3) {
			switch (regex[1]) {
			case 'i':
				return parseInt(regex[2], 10);
			case 'l':
				return TAGX.$(regex[2].split('.').slice(1)).map(function(i) {
					return parseInt(i, 10);
				});
			default:
			}
		}
		return null;
	};

	utils.Ops = (function() {
		var ops = {};

		ops.and = function() {
			var args = Array.prototype.slice.call(arguments);
			var numTrue = 0;
			var that = this;
			var makeCheck = function(callback) {
				var checkRan = false;

				return function(result) {
					if (checkRan) {
						return;
					} else {
						checkRan = true;

						if (result) {
							numTrue += 1;

							if (numTrue === args.length) {
								callback(true);
							}
						} else {
							callback(false);
						}
					}
				}
				;
			};

			return function(callback) {
				var i;
				for (i = 0; i < args.length; i += 1) {
					args[i].call(that, makeCheck(callback));
				}
			}
			;
		}
		;

		ops.or = function() {
			var args = Array.prototype.slice.call(arguments);
			var numFalse = 0;
			var that = this;
			var makeCheck = function(callback) {
				var checkRan = false;

				return function(result) {
					if (checkRan) {
						return;
					} else {
						checkRan = true;

						if (result) {
							callback(true);
						} else {
							numFalse += 1;

							if (numFalse === args.length) {
								callback(false);
							}
						}
					}
				}
				;
			};

			return function(callback) {
				var i;
				for (i = 0; i < args.length; i += 1) {
					args[i].call(that, makeCheck(callback));
				}
			}
			;
		}
		;

		ops.not = function(f) {
			var that = this;
			return function(callback) {
				var checkRan = false;

				f.call(that, function(result) {
					if (checkRan) {
						return;
					} else {
						checkRan = true;
						callback(!result);
					}
				});
			}
			;
		}
		;

		ops.eq = function(valName, rhsValue, callback) {
			this.tagger.get(valName, function(lhsValue) {
				callback(lhsValue === rhsValue);
			});
		}
		;

		ops.ne = function(valName, rhsValue, callback) {
			this.tagger.get(valName, function(lhsValue) {
				callback(lhsValue !== rhsValue);
			});
		}
		;

		ops.startsWith = function(valName, rhsValue, callback) {
			this.tagger.get(valName, function(lhsValue) {
				if (typeof lhsValue !== 'string') {
					lhsValue = (lhsValue || '').toString();
				}

				callback(lhsValue.substring(0, rhsValue.length) === rhsValue);
			});
		}
		;

		ops.matches = function(valName, rhsValue, callback) {
			this.tagger.get(valName, function(lhsValue) {
				if (typeof lhsValue !== 'string') {
					lhsValue = (lhsValue || '').toString();
				} else if (typeof rhsValue !== 'string') {
					callback(false);
					return;
				}

				callback(lhsValue.search(new RegExp(rhsValue)) !== -1);
			});
		}
		;

		ops.on = function(valName, params, callback) {
			var that = this;

			this.tagger.get(valName, function(f) {
				if (typeof f === 'function') {
					f.call(that, params, callback);
				}
			});
		}
		;

		ops.at = function(obj, keys, def) {
			var i;
			for (i = 0; i < keys.length; i++) {
				// Null and undefined cannot be converted to an object. See https://tc39.github.io/ecma262/#sec-toobject
				if (obj === null || typeof obj === 'undefined') {
					return def;
				}

				// Only objects can be used with `in`, so convert to an object
				obj = Object.prototype.valueOf.call(obj);

				if (!(keys[i]in obj)) {
					return def;
				}

				obj = obj[keys[i]];
			}
			return obj;
		}
		;

		return ops;
	}
	)();

	utils.addMetaTag = function(tagName, tagContent) {
		var tempMeta = TAGX.$('[name="' + tagName + '"]');
		var tempValue;
		if (tempMeta.length > 0) {
			tempValue = tempMeta[0].content;
			// get the content
		}
		if (!tempValue || (tempValue === '' && tagContent !== '')) {
			var newMetaTag = document.createElement('meta');
			newMetaTag.id = tagName;
			newMetaTag.name = tagName;
			newMetaTag.content = tagContent;
			document.getElementsByTagName('head').item(0).appendChild(newMetaTag);
		}
	}
	;

	utils.getMetaTag = function(name) {
		var tempMeta = TAGX.$('[name="' + name + '"]');
		return tempMeta.length > 0 ? tempMeta[0].content : '';
	}
	;

	utils.isEmptyValue = function(value) {
		return (typeof value === 'undefined' || value === null || value === '');
	}
	;

	utils.getValue = function(val, defVal, retNullStr) {
		var argLen = arguments.length;
		var value = val;
		var defaultValue = '';
		var returnNullString = false;
		if (argLen === 2) {
			returnNullString = defVal;
		} else if (argLen === 3) {
			defaultValue = defVal;
			returnNullString = retNullStr;
		}
		if (utils.isEmptyValue(value)) {
			if (utils.isEmptyValue(defaultValue)) {
				return (returnNullString === true ? 'null' : '');
			} else {
				return defaultValue.toLowerCase ? defaultValue.toLowerCase() : defaultValue;
			}
		}
		if (typeof value === 'object') {
			if (value instanceof Array) {
				return value.join('|').toLowerCase();
			} else {
				return utils.stringifyJson(value);
			}
		}
		return value.toLowerCase ? value.toLowerCase() : value;
	}
	;

	utils.mapToQs = function(map) {
		var key;
		var qs = '';
		for (key in map) {
			if (map.hasOwnProperty(key)) {
				qs += (qs ? '&' : '') + key + '=' + encodeURIComponent(map[key]);
			}
		}
		return qs;
	}
	;

	utils.QsTomap = function(qs) {
		var nvp = (qs ? qs : location.search).replace('?', '').split('&');
		var map = {};
		for (var i = 0; i < nvp.length; i++) {
			var item = nvp[i];
			map[item.split('=')[0]] = item.split('=')[1];
		}

		return map;
	}
	;

	utils.includeFile = function(incFilename, async, where, ajax, name) {
		/*
	  files included need to be explicit about using https protocol, optherwise don't try to add them
	*/
		if (incFilename.indexOf('https') === -1) {
			console.log('Included files must be HTTPS : ' + incFilename + ' not loaded.');
			return;
		}
		if (!ajax) {
			var incFileJS = document.createElement('script');
			incFileJS.setAttribute('type', 'text/javascript');
			incFileJS.setAttribute('async', (async === true));
			incFileJS.setAttribute('src', incFilename);

			if (!where) {
				where = 'body';
			}
			document[where].appendChild(incFileJS);
		} else if (head !== null) {
			// TODO: need to test for head.js being loaded.
			head.js(incFilename, function() {
				if (name && name !== '') {
					TAGX.$(TAGX).trigger(name);
				}
			});
		} else {
			console.log('There is not head.js loaded', incFilename);
		}
	}
	;

	utils.getCookie = function(cookie_name) {
		var results = document.cookie ? document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)') : null;
		if (results) {
			return (decodeURI(results[2]));
		} else {
			return null;
		}
	}
	;

	utils.replaceQSValue = function(uri, key, value) {
		var re = new RegExp('([?|&])' + key + '=.*?(&|$)','i');

		var separator = uri.indexOf('?') !== -1 ? '&' : '?';
		if (uri.match(re)) {
			return uri.replace(re, '$1' + key + '=' + value + '$2');
		} else {
			return uri + separator + key + '=' + value;
		}
	}
	;

	utils.jsonObjToDCSparams = function(jsonMap, dcsPrefix) {
		if (typeof jsonMap === 'object') {
			var key, WTData = [], prefix = dcsPrefix || 'DCSext.';
			for (key in jsonMap) {
				if (jsonMap.hasOwnProperty(key) && typeof jsonMap[key] !== 'object') {
					WTData.push(prefix + '' + key);
					WTData.push(jsonMap[key]);
				}
			}
			return WTData;
		}
		return jsonMap;
		// in case return the same thing that was passed in
	}
	;

	utils.stringifyJson = JSON ? JSON.stringify : function(obj) {

		var t = typeof (obj);
		if (t !== 'object' || obj === null) {
			// simple data type
			if (t === 'string') {
				obj = '"' + obj + '"';
			}
			return String(obj);
		} else {
			// recurse array or object
			var n, v, json = [], arr = (obj && obj.constructor === Array);
			for (n in obj) {
				if (obj.hasOwnProperty(n) === true) {
					v = obj[n];
					t = typeof (v);
					if (t === 'string') {
						v = '"' + v + '"';
					} else if (t === 'object' && v !== null) {
						v = utils.stringifyJson(v);
					}
					json.push((arr ? '' : '"' + n + '":') + String(v));
				}
			}
			return (arr ? '[' : '{') + String(json) + (arr ? ']' : '}');
		}
	}
	;

	utils.getCanonicalUrl = function() {
		var url = location.href
		  , script = TAGX.$('link[rel=canonical]');
		if (script.length === 1 && typeof script[0] === 'object' && typeof script[0].href === 'string') {
			url = script[0].href;
		}

		return url;
	}
	;

	utils.copyObj = function(aObject, cObject) {
		var key;
		for (key in cObject) {
			if (cObject.hasOwnProperty(key)) {
				aObject[key] = cObject[key];
			}
		}

		return aObject;
	}
	;

	utils.mergeObjects = function(target, source, skip) {
		var k;
		for (k in source) {
			if (source.hasOwnProperty(k)) {
				if (!utils.isEmptyValue(source[k]) && (utils.isEmptyValue(target[k]) || skip !== true)) {
					target[k] = source[k];
				}
			}
		}
	}
	;

	utils.trackClicks = function() {
		TAGX.$(document).on('mousedown', function(e) {
			var el = TAGX.$(e.target);
			var tagNames = {
				a: true,
				button: true,
				span: true,
				input: true
			};
			try {
				if (typeof tagNames[e.target.tagName.toLowerCase()] !== 'undefined') {
					var eData = {
						eText: el.html(),
						offset: el.offset(),
						pDatumId: NYTD.pageEventTracker ? NYTD.pageEventTracker.getDatumId() : null
					};
					if (e.target.id !== '' && 'undefined' !== e.target.id) {
						eData.eId = e.target.id;
					}
					if (e.target.className !== '' && 'undefined' !== e.target.className) {
						eData.eClasses = e.target.className;
					}

					var eObj = utils.stringifyJson(eData);
					var txpc = utils.getCookie(utils.txpcn);
					if (txpc) {
						var now = new Date();
						var nextYr = now.setTime(now.getTime() + 31536000000);
						document.cookie = utils.txpcn + '=' + utils.replaceQSValue(txpc, 'augRef', eObj) + '; path=/; domain=.nytimes.com; expires=' + nextYr;
					}
					if (localStorage) {
						localStorage.setItem('augRef', eObj);
					}
				}
			} catch (e1) {// do nothing;
			}
		});
	}
	;

	utils.wordCountSize = function(count) {
		if (count < 100) {
			return 'BLURB_Under_100';
		} else if (count < 400) {
			return 'SUPER_SHORT_100_399';
		} else if (count < 800) {
			return 'SHORT_400_799';
		} else if (count < 1200) {
			return 'MEDIUM_800_1199';
		} else if (count < 1600) {
			return 'LONG_1200_1600';
		} else {
			return 'HEAVE_Over_1600';
		}
	}
	;

	utils.getMeterValue = function(name, suppress) {
		var cookie, result, i, n;
		suppress = ('boolean' === typeof suppress ? suppress : true);
		if (typeof name === 'string' || (typeof name === 'object' && name instanceof Array)) {
			cookie = utils.getCookie('nyt-m');
			if (cookie) {
				name = (typeof name === 'string' ? [name] : name);
				result = {};
				for (i = 0; i < name.length; i++) {
					n = name[i];
					var v = meterCookie(n, cookie);
					if (v !== null || !suppress) {
						result[n] = v;
					}
				}
				return result;
			}
		}
		return null;
	}
	;

	utils.sendGA = function(payload) {
		var at = utils.Ops.at;
		var cfg = at(TAGX, ['config', 'GoogleAnalytics']);
		var tracker = at(cfg, ['tracker'], 'ga');
		var trackerName = at(cfg, ['createOptions', 'name'], '');
		if (trackerName !== '') {
			trackerName = trackerName + '.';
		}
		var toGAData = function(o) {
			var d = utils.copyObj({}, at(o, ['hit'], {}));
			var nonInteraction = at(o, ['nonInteraction']);
			if (nonInteraction === true || nonInteraction === false) {
				d.nonInteraction = nonInteraction;
			}
			utils.copyObj(d, at(o, ['customDimensions'], {}));
			utils.copyObj(d, at(o, ['customMetrics'], {}));
			return d;
		};
		if (cfg && typeof window[tracker] === 'function') {
			window[tracker](trackerName + 'send', toGAData(payload));
		}
	}
	;

	// we often pass the whole query string to GA; it sometimes includes an
	// email address. sending email addresses to GA violates GA's PII policy.
	// this function takes a query string, and returns the query string with
	// key/value pairs of the form *email=user@domain.tld replaced with
	// *email=email_block
	//
	// some real life examples (w/ PII redacted!):
	//  - bt_email=user%40domain.tld&bt_ts=xxxxxx&referer=
	//  - email=user@domain.tld&id=xxxxxxxx&group=nl&product=mm
	//  - exit_uri=http%3a%2f%2fmobile.nytimes.com%2f&email=user%40domain.tld
	//
	utils.redactEmailAddressesFromQueryString = function(queryString) {
		if (queryString && typeof queryString === 'string') {
			return queryString.split('&').map(function(queryStringEntry) {
				return queryStringEntry.replace(/email=.+(@|%40).+\..+/, 'email=email_block');
			}).join('&');
		} else {
			return queryString;
		}
	}
	;

	utils.isObject = function(_obj) {
		var isValidObject = typeof _obj === 'object' && _obj !== null;

		return isValidObject && !(_obj instanceof Array);
	}
	;

	utils.encodeString = function(str) {
		var FNV1_32A_INIT = 0x811c9dc5;
		var hval = FNV1_32A_INIT;
		for (var i = 0; i < str.length; ++i) {
			hval ^= str.charCodeAt(i);
			hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
		}
		return hval >>> 0;
	}
	;

	return utils;
}
)();

/**
 * Making use of the window.postMessage API (https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage),
 * this library makes cross domain messaging easier by providing the following:
 *   - automatic handshaking between window objects (parent/iframe)
 *   - sending/receiving messages
 *   - incoming message queue (before handshaking is completed)
 *   - messages as events with the on/off functions
 *   - handshake failure and retry mechanism
 *
 * Sample usage:
 * // In parent window:
 * var xdm = new TAGX.CrossDomainMessenger({
 *   target: document.getElementById('myiframe').contentWindow,
 *   origin: 'https://ssl.mydomain.com'
 * });
 * xdm.on('important event happened', function () {
 *   // fire event that depends on the iframe's "important event"
 * });
 *
 * // In iframe window:
 * var xdm = new TAGX.CrossDomainMessenger({
 *   target: top,
 *   origin: 'http://www.mydomain.com'
 * });
 * TAGX.on('important event', function () {
 *   xdm.sendMessage('important event happened');
 * });
 */
/**
  * @desc CrossDomainMessenger Class definition
  * @param* options.target [window object]
  * @param* options.origin string - the protocol + domain of the target window
  * @param options.retries number - number of handshake retries
  * @param options.timeoutInterval number - time between handshake retries (ms)
  * @param options.readyFunc function - callback function when handshake completes
  * @param options.handshakeFailFunc function - callback function when handshake fails
  * @param options.handler function - callback function when message is received
  */
TAGX.CrossDomainMessenger = function(options) {
	'use strict';
	var timeout, handshake, msg_queue;
	var isReady = false;
	var retries = options.retries || 10;
	var timeoutInterval = options.timeoutInterval || 200;
	var handshakeMsg = 'init';
	var shakeBackMsg = 'received init';
	var _this = this;
	var shakedBack = false;
	var eventHanderList = {};
	var additionalHandlers = [];
	var noop = function() {};
	var handler = function(data) {
		var i;
		if (isReady) {
			if (eventHanderList[data]instanceof Array) {
				for (i = 0; i < eventHanderList[data].length; i++) {
					eventHanderList[data][i](data);
				}
			}
			for (i = 0; i < additionalHandlers.length; i++) {
				additionalHandlers[i](data);
			}
		} else {
			if (!msg_queue) {
				msg_queue = [];
			}
			msg_queue.push(data);
		}
	};
	var readyFunc = options.readyFunc || noop;
	var handshakeFailed = options.handshakeFailFunc || noop;
	var flushQueue = function() {
		if (!msg_queue || msg_queue.length <= 0) {
			return;
		}
		while (msg_queue.length > 0) {
			handler(msg_queue.pop());
		}
	};
	var shake = function() {
		if (isReady) {
			return;
		}
		_this.sendMessage(handshakeMsg);
	};
	var shakeBack = function() {
		if (shakedBack) {
			return;
		}
		shakedBack = true;
		_this.sendMessage(shakeBackMsg);
	};

	if (!options.retries) {
		options.retries = retries;
	}
	if (typeof options.handler === 'function') {
		additionalHandlers.push(options.handler);
	}
	/**
	 * @desc Send message, prints warning to console if handshake has not completed
	 * @param msg string - the message
	 * @return this - to allow chaining
	 */
	this.sendMessage = function(msg) {
		if (!isReady && msg !== shakeBackMsg && msg !== handshakeMsg) {
			if (window.console) {
				window.console.warn('Counterpart is not ready or does not exist. Message will be lost, not sending.');
			}
		} else {
			options.target.postMessage(msg, options.origin);
		}
		return this;
	}
	;
	/**
	 * @desc Provide callback when handshake completes
	 * @param func function - callback function
	 * @return this - to allow chaining
	 */
	this.onReady = function(func) {
		if (isReady) {
			func(this);
		} else {
			readyFunc = func;
		}
		return this;
	}
	;
	/**
	 * @desc Provide callback when messages are received
	 * @param func function - callback function
	 * @return this - to allow chaining
	 */
	this.onMessage = function(func) {
		additionalHandlers.push(func);
		return this;
	}
	;
	/**
	 * @desc Provide callback when handshake fails
	 * @param func function - callback function
	 * @return this - to allow chaining
	 */
	this.onHandshakeFailure = function(func) {
		handshakeFailed = func;
		return this;
	}
	;
	/**
	 * @desc Listen to events
	 * @param eventName string - name of event
	 * @param eventHander function - event callback function
	 * @return this - to allow chaining
	 */
	this.on = function(eventName, eventHander) {
		if (!(eventHanderList[eventName]instanceof Array)) {
			eventHanderList[eventName] = [];
		}
		eventHanderList[eventName].push(eventHander);
		return this;
	}
	;
	/**
	 * @desc Stop listening to events
	 * @param eventName string - name of event
	 * @param eventHander function - event callback function to be removed
	 * @return this - to allow chaining
	 */
	this.off = function(eventName, eventHander) {
		var index;
		var arr = eventHanderList[eventName];
		if (arr instanceof Array) {
			if (typeof eventHander === 'function') {
				if ((index = arr.indexOf(eventHander)) !== -1) {
					arr.splice(index, 1);
				}
			} else {
				eventHanderList[eventName] = [];
			}
		}
		return this;
	}
	;
	/**
	 * @desc Retry handshaking in case automatic handshake fails
	 * @param retryOptions.retries number - number of retries
	 * @param retryOptions.delay number - delay before retry (ms)
	 * @return this - to allow chaining
	 */
	this.retryHandshake = function(retryOptions) {
		if (!isReady) {
			retries = retryOptions && retryOptions.retries ? retryOptions.retries : options.retries;
			if (retryOptions && typeof retryOptions.delay === 'number' && retryOptions.delay > 0) {
				setTimeout(function() {
					handshake();
				}, retryOptions.delay);
			} else {
				handshake();
			}
		}
		return this;
	}
	;
	window.addEventListener('message', function(event) {
		if (event.origin !== options.origin) {
			return;
		}
		switch (event.data) {
		case handshakeMsg:
			shakeBack();
			break;
		case shakeBackMsg:
			isReady = true;
			if (timeout) {
				clearTimeout(timeout);
			}
			readyFunc(_this);
			flushQueue();
			break;
		default:
			handler(event.data);
			break;
		}
	}, false);
	handshake = function() {
		shake();
		if (!isReady) {
			if (retries-- > 1) {
				timeout = setTimeout(handshake, timeoutInterval);
			} else {
				handshakeFailed(new Error('Exceeded maximum number of retries.'));
			}
		}
	}
	;
	handshake();
}
;
TAGX.EventProxy = (function() {
	'use strict';
	var EventTracker;
	var noop = function() {};
	var eventObject = TAGX.$(TAGX);
	var utils = TAGX.Utils;
	var at = utils.Ops.at;

	var datumData = function(eventData) {
		var d = {};
		d.assetUrl = eventData.assetURl ? eventData.assetURl : utils.getCanonicalUrl();
		d.url = eventData.url ? eventData.url : location.href;
		d.referrer = document.referrer;
		d.subject = 'module-interactions';
		// override this later

		delete eventData.url;
		delete eventData.assetURl;
		d.moduleData = TAGX.Utils.stringifyJson(eventData);

		return d;
	};

	var analyticsAreReady = function() {
		var config;
		if ('undefined' === TAGX.taggerReady || !TAGX.taggerReady) {
			return false;
		}
		config = TAGX.config || {};
		var readyFunction = (config && config.analyticsReady && config.analyticsReady instanceof Function) ? config.analyticsReady : function() {
			EventTracker = TAGX.EventTracker || (window.NYTD ? window.NYTD.EventTracker : null);
			return !!EventTracker && !EventTracker.getAllInstances;
		}
		;

		if (readyFunction instanceof Function) {
			return readyFunction();
		} else {
			return false;
		}
	};

	var queue = [], queuedEvent, watchIntervalId, needsWatching = true;

	var queueConsumer = function() {
		// let all the flags go
		if (watchIntervalId) {
			window.clearInterval(watchIntervalId);
		}
		if (queue && queue.length > 0) {
			// loop the list of events and trigger them;
			while ((queuedEvent = queue.shift())) {
				if (queuedEvent.eventName && queuedEvent.eventData) {
					TAGX.EventProxy.trigger(queuedEvent.eventName, queuedEvent.eventData, queuedEvent.eventType ? queuedEvent.eventType : '');
				}
			}
		}
	};
	/* internal util funcs */
	var getBooleanField = function(obj, name, defVal) {
		return (typeof obj[name] === 'boolean' ? obj[name] : defVal);
	};
	var getFunction = function(func, defaultFunc) {
		if (typeof func === 'function') {
			return func;
		}
		if (typeof defaultFunc === 'function') {
			return defaultFunc;
		}
	};
	/* ET functions & objects */
	/* configuration for EventTracker would be something like this:

  TAGX.config.EventTracker = {
	eventWhitelist: ['abc', 'def']
  };

  */
	var etReady = function() {
		// merge ET whitelist here
		this.whitelist = this.whitelist.concat(at(TAGX, ['config', 'EventTracker', 'eventWhitelist'], []));
	};
	var etFromGAEvent = function(ed) {
		var eventData, canonicalUrl;
		if ('pageview' === ed.hit.hitType) {
			canonicalUrl = (function(u) {
				var a = document.createElement('a');
				a.href = u;
				return a;
			}
			)(utils.getCanonicalUrl());
			etPageview({
				url: canonicalUrl.protocol + '//' + canonicalUrl.hostname + ed.hit.page,
				title: ed.hit.title
			});
		} else {
			eventData = {
				module: ed.hit.eventCategory || '',
				action: ed.hit.eventAction || '',
				eventName: ed.hit.eventLabel || '',
				proxyEventName: ed.proxyEventName,
				proxyEventType: ed.proxyEventType,
				pgType: utils.getMetaTag('PT') || ''
			};
			if (/impression/i.test(ed.hit.eventAction)) {
				// impressions
				eventData.eventtimestamp = Date.now();
				NYTD.pageEventTracker.addModuleImpression(eventData);
				// console.log('impression =>', eventData);
			} else {
				// interactions
				(new EventTracker()).track({
					assetUrl: utils.getCanonicalUrl(),
					url: location.href,
					referrer: document.referrer,
					subject: 'module-interactions',
					tagxId: TAGX.data.get('TAGX.ID'),
					webActiveDays: TAGX.data.get('TAGX.L.adv'),
					webActiveDaysList: TAGX.data.get('TAGX.L.activeDays'),
					moduleData: utils.stringifyJson(eventData)
				});
				/* console.log('interactions =>', {
		  assetUrl: utils.getCanonicalUrl(),
		  url: location.href,
		  referrer: document.referrer,
		  subject: 'module-interactions',
		  tagxId: TAGX.data.get('TAGX.ID'),
		  webActiveDays: TAGX.data.get('TAGX.L.adv'),
		  webActiveDaysList: TAGX.data.get('TAGX.L.activeDays'),
		  moduleData: utils.stringifyJson(eventData)
		}); */
			}
		}
	};
	// from tag: ET Proxy Page View Tracking
	var etPageview = function(eventData) {
		var mData, attr;
		var datum = utils.copyObj(datumData(eventData), {
			subject: 'page',
			referrer: location.href,
			totalTime: 0
		});
		// move // moduleData out of the way
		if (JSON) {
			mData = JSON.parse(datum.moduleData);
			for (attr in mData) {
				if (mData.hasOwnProperty(attr) && !datum.hasOwnProperty(attr)) {
					datum[attr] = mData[attr];
				}
			}
		} else {
			// rename it to event data for now
			datum.eventData = datum.moduleData;
		}
		delete datum.moduleData;
		// console.log('datum =>', datum);
		(new EventTracker()).track(datum, {
			sendMeta: true,
			useFieldOverwrites: true,
			buffer: false,
			collectClientData: true
		});
	};
	var sendET = function(eventName, eventData) {
		if (EventTracker === null || typeof EventTracker === 'undefined') {
			// should not happen becaus of "analyticsAreReady" function
			// console.log('EventTracker not on page?!');
			return;
		}
		if (!eventData) {
			// console.log('no eventData?!');
			return;
		}
		if (eventData.hit) {
			// GA style eventData
			// console.group('etFromGAEvent');
			etFromGAEvent(eventData);
			// console.groupEnd();
		} else {// old school eventData will be handled by existing tags for now
		}
	};
	/* JKIDD Functions  */

	var GTMReady = function() {
		this.whitelist = this.whitelist.concat(at(TAGX, ['config', 'GTM', 'eventWhitelist'], []));
	};

	var sendGTM = function(eventName, eventData) {
		window.console.log(utils.copyObj({
			'event': eventName
		}, eventData));

		//   GTM: new AnalyticsTarget('GTM', { whitelist: [] }, sendJK, GTMReady)

	};

	/* GA functions */
	var gaReady = function() {
		var trackerName;
		var cfg = at(TAGX, ['config', 'GoogleAnalytics']);
		if (cfg) {
			this.globalObj = at(cfg, ['tracker'], 'ga');
			trackerName = at(cfg, ['createOptions', 'name'], '');
			if (trackerName !== '') {
				trackerName = trackerName + '.';
			}
			this.trackerName = trackerName;
			// merge white list from tagx tags here
			this.whitelist = this.whitelist.concat(at(cfg, ['eventWhitelist'], []));
		} else {
			this.enabled = false;
		}
	};
	var toGAData = function(o) {
		var d = utils.copyObj({}, at(o, ['hit'], {}));
		var nonInteraction = at(o, ['nonInteraction']);
		if (typeof nonInteraction === 'boolean') {
			d.nonInteraction = nonInteraction;
		}
		utils.copyObj(d, at(o, ['customDimensions'], {}));
		utils.copyObj(d, at(o, ['customMetrics'], {}));
		return d;
	};
	var sendGA = function(eventName, eventData) {
		// console.log('sendGA', eventName, eventData);
		if (typeof window[this.globalObj] === 'function') {
			window[this.globalObj](this.trackerName + 'send', toGAData(eventData));
		}
	};

	/* AnalyticsTarget class definition */
	var AnalyticsTarget = function(name, options, triggerFunc, initFunc, whitelistFunc) {
		this.name = name;
		options = options || {};
		this.enabled = getBooleanField(options, 'enabled', true);
		this.whitelist = options.whitelist || [];
		// this.type2subject = options.type2subject || {};
		this.triggerFunc = getFunction(triggerFunc, noop);
		this.whitelistFunc = getFunction(whitelistFunc);
		this.initFunc = getFunction(initFunc, noop);
	};
	AnalyticsTarget.prototype.appendWhitelist = function(wl) {
		this.whitelist = this.whitelist.concat(wl);
	}
	;
	AnalyticsTarget.prototype.setWhitelist = function(wl) {
		this.whitelist = wl;
	}
	;
	AnalyticsTarget.prototype.enable = function() {
		this.enabled = true;
	}
	;
	AnalyticsTarget.prototype.disable = function() {
		this.enabled = false;
	}
	;
	AnalyticsTarget.prototype.init = function() {
		if (typeof this.initFunc === 'function') {
			this.initFunc();
		}
	}
	;
	AnalyticsTarget.prototype.isWhitelisted = function(eventName, eventData, eventType) {
		if (this.whitelist && this.whitelist.indexOf(eventName) !== -1) {
			return true;
		}
		// additional rules, for example, base on eventType
		if (typeof this.whitelistFunc === 'function') {
			return this.whitelistFunc(eventName, eventData, eventType);
		}
		return false;
	}
	;
	AnalyticsTarget.prototype.trigger = function(eventName, eventData, eventType) {
		var whitelisted;
		// console.group('=>', this.name);
		if (this.enabled) {
			// console.log('enabled');
			whitelisted = this.isWhitelisted(eventName, eventData, eventType);
			if (whitelisted && typeof this.triggerFunc === 'function') {
				// console.log((this.whitelist.length === 0 ? 'whitelist empty' : (whitelisted ? 'whitelisted' : 'not whitelisted')));
				this.triggerFunc(eventName, eventData, eventType);
				eventData.consumed = (eventData.consumed ? eventData.consumed + 1 : 1);
			}
		} else {// console.log(this.name, '=>', 'disabled');
		}
		// console.groupEnd();
	}
	;
	/* targetRegistry & utility functions */
	var targetRegistry = {
		ET: new AnalyticsTarget('ET',{
			whitelist: []
		},sendET,etReady),
		GA: new AnalyticsTarget('GA',{
			whitelist: []
		},sendGA,gaReady),
		GTM: new AnalyticsTarget('GTM',{
			whitelist: []
		},sendGTM,GTMReady)
	};
	var addAnalyticTarget = function(name, func, replace) {
		if (typeof targetRegistry[name] === 'undefined' || replace === true) {
			targetRegistry[name] = new AnalyticsTarget(name,func);
		}
	};
	var removeAnalyticTarget = function(name) {
		delete targetRegistry[name];
	};
	var getAnalyticTarget = function(name) {
		return targetRegistry[name];
	};
	var dispatchEvent = function(eventName, eventData, eventType) {
		Object.keys(targetRegistry).forEach(function(name) {
			if (targetRegistry[name]instanceof AnalyticsTarget) {
				targetRegistry[name].trigger(eventName, eventData, eventType);
			}
		});
		if (!eventData.consumed) {// not sent to any target, send to ET with subject 'bi-proxy-data'?
		}
	};
	var listAnalyticsTargets = function() {
		return Object.keys(targetRegistry);
	};
	var tagsLoaded = function() {
		Object.keys(targetRegistry).forEach(function(name) {
			if (targetRegistry[name]instanceof AnalyticsTarget) {
				targetRegistry[name].init();
			}
		});
	};
	window.addEventListener('message', function(event) {
		if (event && event.origin && /\.nytimes\.com(:[\d]+)?$/.test(event.origin) && event.data && event.data.type === 'NYT:TAGX:EventProxy:trigger') {
			window.TAGX.EventProxy.trigger.apply(window.TAGX.EventProxy, event.data.args);
		}
	}, false);
	/* user facing functions */
	return {
		on: function(eventName, eventHandler) {
			eventObject.on(eventName, function(d1, d2) {
				eventHandler(d2 || d1);
			});
		},
		one: function(eventName, eventHandler) {
			eventObject.one(eventName, function(d1, d2) {
				eventHandler(d2 || d1);
			});
		},
		off: function(eventName) {
			eventObject.off(eventName);
		},
		trigger: function(eventName, eventData, eventType) {
			var dataLayer = window.dataLayer;
			// check if we are ready to handle this
			if (analyticsAreReady() === false) {
				queue.push({
					'eventName': eventName,
					'eventData': eventData,
					'eventType': eventType
				});
				// seta watcher that can consume the queue later
				if (needsWatching) {
					// reset so you dont come back in here
					needsWatching = false;
					watchIntervalId = window.setInterval(function() {
						if (analyticsAreReady() === true) {
							queueConsumer();
						}
					}, 250);
				}
				return;
			}
			// console.group('eventproxy.trigger ==>', eventName, eventType, JSON.stringify(eventData));
			// if the event name has spaces, replace them with dashes
			eventName = eventName.replace(/\s+/g, '-');
			eventData.proxyEventName = eventName;
			// building the white-list
			eventData.proxyEventType = eventType;
			// building the white-list
			dispatchEvent(eventName, eventData, eventType);
			eventObject.trigger(eventName, eventData);
			// Analytics tags will be targetted at this event
			if (dataLayer) {
				dataLayer.push({
					'event': eventName,
					'eventData': eventData
				});
			}
			var eventDataCopy, eventTypeCopy, datum, etEvtName, module, action;

			if (typeof eventType === 'string') {
				eventTypeCopy = [eventType];
			} else if (typeof eventType === 'object' && eventType instanceof Array) {
				eventTypeCopy = eventType;
			}
			if (typeof eventTypeCopy === 'object' && eventTypeCopy instanceof Array) {
				for (var intLoop = 0; intLoop < eventTypeCopy.length; intLoop++) {
					var eventTypeItem = eventTypeCopy[intLoop];
					if (eventTypeItem.indexOf('tagx-') === 0) {
						eventDataCopy = utils.copyObj({}, eventData);
						eventDataCopy['et-event-name'] = eventTypeItem;
						eventObject.trigger(eventTypeItem, eventDataCopy);
						if (dataLayer) {
							dataLayer.push({
								'event': eventTypeItem,
								'eventData': eventDataCopy
							});
						}
					} else {
						eventDataCopy = utils.copyObj({}, eventData);
						datum = datumData(eventDataCopy);
						etEvtName = 'module-impression';
						action = eventDataCopy.action ? eventDataCopy.action.toLowerCase() : null;
						module = eventDataCopy.module ? eventDataCopy.module.toLowerCase() : null;
						eventType = eventTypeItem ? eventTypeItem.toLowerCase() : action;
						// temp

						eventDataCopy.eventtimestamp = new Date().getTime();
						if (eventType === 'impression') {
							eventObject.trigger(etEvtName, eventDataCopy);
							// ET impressions only
							if (dataLayer) {
								dataLayer.push({
									'event': etEvtName,
									'eventData': datum
								});
							}
						} else if (eventType === 'pageview' || eventType === 'page-view') {
							datum.subject = 'page';
							datum.referrer = location.href;
							// current page is the referrer of this additional page view
							eventObject.trigger('track-page-view', datum);
							if (dataLayer) {
								dataLayer.push({
									'event': 'track-page-view',
									'eventData': datum
								});
							}
						} else if (eventType === 'interaction' || module !== null) {
							// to be a module interactions it must have at least these items
							if (module === 'page') {
								// updates to ET datum
								// et page level interactions
								etEvtName = 'page-interaction';
								eventObject.trigger(etEvtName, eventDataCopy);
								// ET page data updates only
								if (dataLayer) {
									dataLayer.push({
										'event': etEvtName,
										'eventData': eventDataCopy
									});
								}
							} else {
								// et interaction
								etEvtName = 'module-interaction';
								eventObject.trigger(etEvtName, datum);
								if (dataLayer) {
									dataLayer.push({
										'event': etEvtName,
										'eventData': datum
									});
								}
							}
						} else {
							// call et with generic proxy data -- ET catch all subject
							datum.subject = 'bi-proxy-data';
							etEvtName = 'bi-proxy-data';
							eventObject.trigger(etEvtName, datum);
							if (dataLayer) {
								dataLayer.push({
									'event': etEvtName,
									'eventData': datum
								});
							}
						}
					}
				}
			}
			// console.groupEnd();
		},
		addAnalyticTarget: addAnalyticTarget,
		getAnalyticTarget: getAnalyticTarget,
		removeAnalyticTarget: removeAnalyticTarget,
		listAnalyticsTargets: listAnalyticsTargets,
		tagsLoaded: tagsLoaded
	};
}());

// globals.js

TAGX.Globals = {};
// holds instances

TAGX.Globals.Dependency = function(dependant, oArg) {
	'use strict';
	var timeout_id;
	var that = this;
	var fullfilled = false;
	var name = oArg.name || '';
	var value = '';
	var noop = function() {};
	var getter = (typeof oArg.getter === 'function' ? oArg.getter : noop);
	var eventHandler = oArg.eventHandler;

	this.getName = function() {
		return name;
	}
	;
	this.getValue = function() {
		return value;
	}
	;
	this.init = function() {
		console.log('=> calling getter', dependant.name, name);
		value = getter();
		// as a fallback
		if (oArg.eventName && typeof eventHandler === 'function') {
			TAGX.EventProxy.on(oArg.eventName, function(eventData) {
				console.log('=> even triggered', dependant.name, name, eventData, timeout_id);
				if (timeout_id) {
					clearTimeout(timeout_id);
				}
				eventHandler(eventData, that);
			});
			if (typeof oArg.timeout === 'number') {
				timeout_id = setTimeout(function() {
					console.log('=> timeout reached', dependant.name, name, timeout_id);
					timeout_id = 0;
					TAGX.EventProxy.off(oArg.eventName);
					oArg.eventHandler({
						'timeout_reached': true // debugging purpose
					}, that);
				}, oArg.timeout);
			}
		}
	}
	;
	this.fullfill = function(_v) {
		if (fullfilled) {
			console.log('already fullfilled. ignore!', dependant.name, name);
			return;
		}
		fullfilled = true;
		if (_v) {
			value = _v;
		}
		if (dependant && typeof dependant.fire === 'function') {
			console.log('=> calling fire', dependant.name, name, value);
			dependant.fire();
		}
	}
	;
	this.isFullfilled = function() {
		return fullfilled;
	}
	;
}
;

/**
	oArg: {'name': 'comscore', 'instant': true} - instant means this tag does not need to wait for tagger data
*/
TAGX.GlobalTag = function(oArg) {
	'use strict';
	var name;
	var that = this;
	var hasTagFired = false;
	var dependencies = [];
	var dependants = [];

	this.hasTagInitialized = false;

	var handleDependant = function(eventname_or_callback) {
		var dependant_type = (typeof eventname_or_callback);
		console.log('handling dependant for global tag %s', name, hasTagFired);
		if (hasTagFired) {
			if (dependant_type === 'function') {
				eventname_or_callback();
			} else if (dependant_type === 'string') {
				// fake an empty eventdata
				TAGX.EventProxy.trigger(eventname_or_callback, {});
			}
		} else {
			if ('function' === dependant_type || 'string' === dependant_type) {
				dependants.push(eventname_or_callback);
			} else {
				console.log('ignore unknow dependant type', dependant_type);
			}
		}
	};
	var notifyDependants = function() {
		console.log('notifying dependants of global', name, dependants.length);
		while (dependants.length > 0) {
			handleDependant(dependants.pop());
		}
	};

	name = this.name = oArg.name || 'unknown_global';
	this.instant = oArg.instant || false;
	// this determines if the tag fires without waiting for tagger
	if (oArg && oArg.dependencies instanceof Array) {
		dependencies = oArg.dependencies.filter(function(dependency) {
			// if rule then filter dependencies by rules that return true
			return dependency.rule ? dependency.rule() : true;
		}).map(function(dependency) {
			return new TAGX.Globals.Dependency(this,dependency);
		}
		.bind(this));
	}
	this.fire = function() {
		console.log('Global Tag: ' + this.name + ' did not fire properly because it does not have its own "fire" function');
		// if you override the fire function, be sure to include the following function call
		this.tagFired();
	}
	;
	this.init = function(oConfig) {
		console.log(oConfig);
		console.log('Global Tag: ' + this.name + ' does not have its own init tag. running default dependency inits');
		// if you override the init function, be sure to include the following code
		this._postInit();
	}
	;
	this._postInit = function() {
		this.hasTagInitialized = true;
		dependencies.map(function(dependency) {
			dependency.init();
		});
	}
	;
	this.hasAllDependenciesBeenFullfilled = function() {
		return dependencies.reduce(function(prev, curr) {
			return prev && curr.isFullfilled();
		}, true);
	}
	;
	this.getDependencyValues = function() {
		return dependencies.reduce(function(prev, curr) {
			var name = curr.getName();
			var value = curr.getValue();
			if (name && value) {
				prev[name] = value;
			}
			return prev;
		}, {});
	}
	;

	this.additionalEventData = {};

	this.addTagData = function(data) {
		return TAGX.Utils.copyObj(this, data || {});
	}
	;

	this.addEventData = function(data) {
		return TAGX.Utils.copyObj(this.additionalEventData, data || {});
	}
	;

	this.addDependant = function(eventname_or_callback) {
		console.log('adding %s to global tag %s', eventname_or_callback, this.name);
		handleDependant(eventname_or_callback);
	}
	;

	this.tagFired = function() {
		hasTagFired = true;
		notifyDependants();
	}
	;
	this.datalayerIsReady = function() {
		console.log('Global Tag: ' + this.name + ' default "datalayerIsReady" function');
	}
	;
	this.datalayerReady = TAGX.datalayerReady;
	if (this.datalayerReady !== true) {
		TAGX.EventProxy.one('TAGX:dataLayer:ready', function() {
			that.datalayerReady = true;
			if (oArg.notifyWhenDatalayerReady === true && that.hasTagInitialized) {
				that.datalayerIsReady();
			}
		});
	}
	return this;
}
;

// Maps global tags to sourceApp
TAGX.globalMaps = {
	'nyt-v5': ['videoEvents', 'facebook', 'pinterest', 'comscore', 'twitter', 'linkedin'],
	'nytv': ['videoEvents', 'facebook', 'pinterest', 'comscore', 'twitter', 'linkedin'],
	'nyt4': ['videoEvents', 'facebook', 'pinterest', 'comscore', 'twitter', 'linkedin'],
	'mobileWeb': ['videoEvents', 'facebook', 'pinterest', 'comscore', 'twitter', 'linkedin'],
	'blogs': ['videoEvents', 'facebook', 'pinterest', 'comscore', 'twitter', 'linkedin'],
	'nytcooking': ['videoEvents', 'facebook', 'pinterest', 'comscore', 'twitter', 'linkedin'],
	'MOPS': ['facebook', 'pinterest', 'twitter', 'linkedin'],
	'SEG': ['facebook', 'pinterest', 'linkedin'],
	'nyt-search': ['comscore', 'pinterest', 'linkedin'],
	'NYT-Watching': ['facebook', 'pinterest', 'comscore', 'twitter', 'linkedin'],
	'nyt-international': ['facebook', 'pinterest', 'comscore', 'twitter', 'linkedin'],
	'games-crosswords': ['comscore', 'twitter', 'pinterest', 'linkedin'],
	'nyt-noSourceApp': ['facebook', 'pinterest', 'linkedin'],
	'': ['facebook', 'pinterest', 'linkedin']//nyt-noSourceApp variant
};

TAGX.GlobalsInit = function() {
	'use strict';
	var g, global, oneGlobal;
	// methods for adding members/instances of the globals
	// need a generic method that fires the instance's method tag inside a try catch. If it is not supposed to fire it
	// has a dictionary that maps sourceApp to a list of global tag names (vendors?)
	var sourceApp = TAGX.Utils.getMetaTag('sourceApp');
	//todo: check if source app?
	var globals = TAGX.globalMaps[sourceApp];
	if (globals && globals.length > 0) {
		for (g = 0; g < globals.length; g++) {
			// do stuff here to get them init
			// check that you have it, then call init
			global = globals[g];
			oneGlobal = TAGX.Globals[global];
			if (oneGlobal instanceof TAGX.GlobalTag) {
				oneGlobal.init();
				if (oneGlobal.instant) {
					oneGlobal.fire();
					if (oneGlobal.oneAndDone) {
						// todo: remove it
						delete TAGX.Globals[global];
					}
				}
			}
		}
	} else {
		console.log('sourceApp: ' + sourceApp + ' has not global tags, whats up with that?');
	}
}
;

TAGX.useGlobal = function(globalName) {
	'use strict';
	var sourceApp = TAGX.Utils.getMetaTag('sourceApp');
	var globalMaps = TAGX.globalMaps;

	var globalExist = TAGX.Globals[globalName] && TAGX.Globals[globalName]instanceof TAGX.GlobalTag;
	var globalMapsHasIt = globalMaps[sourceApp] && globalMaps[sourceApp].indexOf(globalName) > -1;

	return !!(globalExist && globalMapsHasIt);
}
;

TAGX.ScrollManager = (function() {
	'use strict';

	var watchIntervalId;
	var scrollWatcher = {
		subs: [],
		currentScrollTop: window.scrollY
	};
	var percentages = {
		25: '25%',
		50: '50%',
		75: '75%',
		100: '100%'
	};

	scrollWatcher.didIscroll = function(newTop) {
		return (scrollWatcher.currentScrollTop !== newTop) ? true : false;
	};

	scrollWatcher.pageWasScrolled = function(dir, howMuch, current) {
		if (scrollWatcher.subs && scrollWatcher.subs.length > 0) {
			// call the sub functions
			for (var s = 0; s < scrollWatcher.subs.length; s += 1) {
				var sub = scrollWatcher.subs[s];
				if (sub.functionToRun && sub.functionToRun instanceof Function) {
					sub.args = sub.args ? sub.args : {};
					scrollWatcher.copyObj(sub.args, {
						dir: dir,
						howMuch: howMuch,
						current: current,
						whichSub: s
					});
					sub.functionToRun(sub.args);
				}
			}
		}
	};

	scrollWatcher.elementInViewport = function(el, half) {
		if (!scrollWatcher.isElement(el)) {
			return false;
		}
		var rect = el.getBoundingClientRect();
		var height = (half ? el.offsetHeight / 2 : 0);

		return (rect.top >= 0 && rect.left >= 0 && (rect.bottom - height) <= window.innerHeight && rect.right <= window.innerWidth);
	};

	//Returns true if it is a DOM element
	scrollWatcher.isElement = function(obj) {
		return (typeof HTMLElement === 'object' ? obj instanceof HTMLElement : //DOM2
		obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string');
	};

	scrollWatcher.isElementVisible = function(oArg) {
		var element = oArg.element || TAGX.$(oArg.elementSelector)[0];
		if (scrollWatcher.elementInViewport(element, oArg.isImpression ? true : false)) {
			if (typeof oArg.whichSub !== 'undefined') {
				scrollWatcher.removeSub(oArg.whichSub);
				// to ensure that it only runs once
			}
			oArg.callback(true);
		}
	};

	scrollWatcher.percentageGoals = function(oArg) {
		// call event tracker if the page has being scrolled to 0, 25, 50 or 100%
		var percentageScrolled = parseInt((window.scrollY / (scrollWatcher.getDocHeight() - window.innerHeight)) * 100);
		if (percentageScrolled >= oArg.milestones[0]) {
			oArg.callback(true, percentages[oArg.milestones.shift()]);
		}
		if (oArg.milestones.length === 0 && typeof oArg.whichSub !== 'undefined') {
			scrollWatcher.removeSub(oArg.whichSub);
			// don't let it run again
		}
	};

	scrollWatcher.trackVisible = function(params, callback) {
		scrollWatcher.addSubs({
			functionToRun: scrollWatcher.isElementVisible,
			args: {
				callback: callback,
				element: TAGX.$(params[0])[0],
				elementSelector: params[0]
			}
		});
	};

	// 50% for 1 sec
	scrollWatcher.trackImpression = function(params, callback) {
		scrollWatcher.addSubs({
			functionToRun: scrollWatcher.isElementVisible,
			args: {
				callback: callback,
				element: TAGX.$(params[0])[0],
				elementSelector: params[0],
				isImpression: true
			}
		});
	};

	scrollWatcher.trackScrollMilestones = function(callback) {
		scrollWatcher.addSubs({
			functionToRun: scrollWatcher.percentageGoals,
			args: {
				callback: callback,
				milestones: Object.keys(percentages)
			}
		});
	};

	scrollWatcher.addSubs = function(sub) {
		if (!scrollWatcher.isWatching) {
			// call init
			scrollWatcher.initWatch();
		}
		scrollWatcher.subs.push(sub);
		// add to the list
	};

	scrollWatcher.removeSub = function(sub) {
		scrollWatcher.subs.splice(sub, 1);
		if (scrollWatcher.subs && scrollWatcher.subs.length === 0) {
			// call the stop scroll watch method
			scrollWatcher.stopWatching();
		}
	};

	scrollWatcher.copyObj = function(aObject, cObject) {
		var key;
		for (key in cObject) {
			if (cObject.hasOwnProperty(key)) {
				aObject[key] = cObject[key];
			}
		}

		return aObject;
	};

	scrollWatcher.getDocHeight = function() {
		var D = document;
		return Math.max(Math.max(D.body.scrollHeight, D.documentElement.scrollHeight), Math.max(D.body.offsetHeight, D.documentElement.offsetHeight), Math.max(D.body.clientHeight, D.documentElement.clientHeight));
	};

	scrollWatcher.isWatching = false;

	scrollWatcher.initWatch = function() {
		watchIntervalId = setInterval(function() {
			var currentScrollY = window.scrollY;
			if (scrollWatcher.didIscroll(currentScrollY)) {
				// figure out direction
				var direction = scrollWatcher.currentScrollTop < currentScrollY ? 'down' : 'up';
				var scrollAmount = direction === Math.abs(scrollWatcher.currentScrollTop - currentScrollY);
				// reset the watcher current value
				scrollWatcher.currentScrollTop = currentScrollY;
				// call subscribers
				scrollWatcher.pageWasScrolled(direction, scrollAmount, currentScrollY);
			}
		}, 250);
		scrollWatcher.isWatching = true;
	};

	scrollWatcher.stopWatching = function() {
		if (watchIntervalId) {
			clearInterval(watchIntervalId);
			scrollWatcher.isWatching = false;
		}
	};

	return scrollWatcher;
}
)();

TAGX.Storage = (function() {
	'use strict';
	var txStore, txStoreIntvl, markForRemoval;
	var txStoreExpirationPeriod = 1800000;
	// expires after 30 mins
	var txStoreCacheClearPeriod = 60000;
	// check every minute
	var txStorePrefix = 'tagx-';
	var noop = function() {};

	var storage = {
		setItem: noop,
		getItem: noop,
		removeItem: noop,
		clearExpiredItems: noop,
		stopPeriodicCacheClearing: noop,
		clear: noop,
		status: function() {
			console.log('=> txStore', txStore);
		}
	};

	// detect usable storage object
	txStore = (function() {
		var i, result;
		var storageCandidates = ['sessionStorage', 'localStorage'];
		var name = 'test'
		  , value = '1';
		for (i = 0; i < storageCandidates.length; i++) {
			result = window[storageCandidates[i]];
			if (result !== undefined) {
				try {
					result.setItem(name, value);
					if (value === result.getItem(name)) {
						console.log('=> using result obj %s', storageCandidates[i]);
						break;
					}
				} catch (e) {
					result = undefined;
					window.console.warn('%s not supported', storageCandidates[i]);
				}
			}
		}
		return result;
	}
	)();

	// and the winner is ...
	console.log('=> txStore enabled?', txStore);

	if (txStore) {
		// automatically add prefix as well as set expiration time
		storage.setItem = function(name, value) {
			var expiration_prefix = (Date.now() + txStoreExpirationPeriod) + ',';
			txStore.setItem(txStorePrefix + name, expiration_prefix + value);
		};

		storage.getItem = function(name) {
			var item = txStore.getItem(txStorePrefix + name);
			if (item) {
				return item.replace(/^\d{13,},/, '');
			}
			return '';
		};

		storage.removeItem = function(name) {
			txStore.removeItem(txStorePrefix + name);
		};

		// function is called every 1 min,
		// can also be called to force clear all items (forced=true) with the prefix
		markForRemoval = function(forced, now, name) {
			var value, remove, timestamp;
			if (forced === true) {
				return forced;
			}
			value = txStore.getItem(name);
			if (value || value === '') {
				try {
					timestamp = parseInt(value.split(',', 1)[0], 10);
					remove = timestamp <= now;
				} catch (e) {
					console.log('=> error parsing expiration time from string', value);
					remove = true;
				}
			}
			return !!remove;
		};

		storage.clearExpiredItems = function(forced) {
			var name;
			var now = Date.now();
			console.log('=> tx store clearing expired items, forced? %s', !!forced);
			for (name in txStore) {
				if (txStore.hasOwnProperty(name) && 'string' === typeof name && name.indexOf(txStorePrefix) === 0 && markForRemoval(forced, now, name)) {
					txStore.removeItem(name);
				}
			}
		};

		// in case we need to turn this off, for any reason
		storage.stopPeriodicCacheClearing = function() {
			if (txStoreIntvl) {
				clearInterval(txStoreIntvl);
				txStoreIntvl = 0;
			}
		};
		// commencement of the periodical cache clearing
		txStoreIntvl = setInterval(storage.clearExpiredItems, txStoreCacheClearPeriod);
	}

	return storage;
}
)();

TAGX.Tagger = (function() {
	'use strict';

	var Tagger, Tag;

	Tagger = function() {
		this.values = {};
		this.valueCallbacks = {};
	}
	;

	Tagger.prototype.get = function(valName, callback) {
		if (this.values.hasOwnProperty(valName)) {
			callback(this.values[valName]);
		} else {
			if (!this.valueCallbacks.hasOwnProperty(valName)) {
				this.valueCallbacks[valName] = [];
			}

			this.valueCallbacks[valName].push(callback);
		}
	}
	;

	Tagger.prototype.define = function(valName, f) {
		var that = this;

		f(function(value) {
			var i;

			if (that.values[valName]) {
				return;
			} else {
				that.values[valName] = value;

				if (that.valueCallbacks[valName]) {
					for (i = 0; i < that.valueCallbacks[valName].length; i++) {
						that.valueCallbacks[valName][i](value);
					}

					delete that.valueCallbacks[valName];
				}
			}
		});
	}
	;

	Tagger.prototype.tag = function(tagName) {
		return new Tag(this,tagName);
	}
	;

	Tag = function(tagger, tagName) {
		this.tagger = tagger;
		this.conditionFn = function(callback) {
			callback(true);
		}
		;
		this.times = 'once';
		this.data = {};
		this.eventsData = {};
		this.tagName = tagName;
	}
	;

	Tag.prototype.condition = function(f) {
		this.conditionFn = f;
		return this;
	}
	;

	Tag.prototype.repeat = function(times) {
		this.times = times;
		return this;
	}
	;

	Tag.prototype.run = function(f) {
		var that = this;
		var ran = false;

		this.conditionFn.call(this, function(result) {
			if (ran) {
				return;
			}

			ran = true;

			if (result) {
				try {
					f.apply(that, [that.eventsData]);
				} catch (err) {
					if (!!window.console) {
						window.console.error('Error in "%s"', that.tagName, err);
					}
				}
				that.eventsData = {};
			}

			if (that.times === 'many') {
				that.run(f);
			}
		});

		return this;
	}
	;

	return Tagger;
}
)();

// get global tag instance
TAGX.Globals.comscore = new TAGX.GlobalTag({
	name: 'comscore',
	instant: true
});

// this is comsscore specific mappings
TAGX.Globals.comscore.mappings = {
	"business": "business",
	"business - global": "global",
	"Business Day - Dealbook": "dealbook",
	"business - economy": "economy",
	"business - energy-environment": "energy_environment",
	"business - media": "media",
	"business - smallbusiness": "smallbusiness",
	"your-money": "your_money",
	"Business Day - Economy": "economix",
	"Business - Media and Advertising": "mediadecoder",
	"Business Day - Small Business": "boss",
	"Business Day - Your Money": "bucks",
	"Business - Markets": "markets",
	"Autos - wheels": "wheels",
	"Science - Environment": "green",
	"technology": "technology",
	"technology - personaltech": "personaltech",
	"Technology - bits": "bits",
	"Technology - Personal Tech": "gadgetwise",
	"Technology - pogue": "pogue",
	"General - open": "open",
	"style": "style",
	"fashion": "fashion",
	"dining": "dining",
	"garden": "garden",
	"fashion - weddings": "weddings",
	"t-magazine": "t_magazine",
	"T:Style - tmagazine": "t_style",
	"Style - Dining": "dinersjournal",
	"Style - Fashion": "runway",
	"Style - parenting": "parenting",
	"arts": "arts",
	"arts - design": "design",
	"books": "books",
	"arts - dance": "dance",
	"movies": "movies",
	"arts - music": "music",
	"arts - television": "television",
	"theater": "theater",
	"arts - video-games": "video_games",
	"Arts - Event Search": "event_search",
	"Arts - artsbeat": "artsbeat",
	"Movies - carpetbagger": "carpetbagger",
	"health": "health",
	"health - research": "research",
	"health - nutrition": "nutrition",
	"health - policy": "policy",
	"health - views": "views",
	"Health - Health Guide": "health_guide",
	"Health - well": "well",
	"Health - newoldage": "newoldage",
	"Health - consults": "consults",
	"science": "science",
	"science - earth": "earth",
	"science - space": "space",
	"Science - Environment": "green",
	"Science - scientistatwork": "scientistatwork",
	"Opinion - dotearth": "dotearth"
};
// updates the config object in TAGX.Globals.comscore

TAGX.Globals.comscore.setConfig = function(oArg) {
	'use strict';
	this.config = ['c1=2', 'c2=3005403'];
	var comscoreKeyword, comscoreMappingKey = [], url = TAGX.Utils.getCanonicalUrl(), cg = TAGX.Utils.getMetaTag('CG'), scg = TAGX.Utils.getMetaTag('SCG');
	if (cg) {
		comscoreMappingKey.push(cg);
	}
	if (scg) {
		comscoreMappingKey.push(scg);
	}
	comscoreKeyword = this.mappings[comscoreMappingKey.join(' - ')];
	// keywords url overrides
	if (url.indexOf('markets.on.nytimes.com') !== -1) {
		if (url.indexOf('portfolio') !== -1) {
			comscoreKeyword = 'portfolio';
		}
		if (url.indexOf('screener') !== -1) {
			comscoreKeyword = 'screener';
		}
		if (url.indexOf('analysis_tools') !== -1) {
			comscoreKeyword = 'analysis_tools';
		}
	}
	if (comscoreKeyword) {
		this.config.push('comscorekw=' + comscoreKeyword);
		if (typeof window._comscore[0] === "object") {
			window._comscore[0].comscorekw = comscoreKeyword;
		}
	}
}
;
// attached listeners for scroll and other virtual pageviews
TAGX.Globals.comscore.addListeners = function(oArg) {
	'use strict';
	if (this.listenersOn) {
		return;
	}
	var validScrollPageTypes, firstSlide = true, addScrollTracking = function() {
		// scroll triggered tracking logic
		var scroll_pos, doc_height, view_height, mobile, page_height, curr_page, pv_timeout, prev_page = 1, tmst = Date.now(), updateComscoreVals = function() {
			scroll_pos = TAGX.ScrollManager.currentScrollTop;
			doc_height = TAGX.ScrollManager.getDocHeight();
			view_height = window.innerHeight;
			mobile = window.innerWidth < 768;
			page_height = mobile ? view_height * 4 : view_height * 2;
			curr_page = Math.floor(scroll_pos / page_height) + 1;
		}, triggerComscorePVC = function() {
			new Image().src = "//www.nytimes.com/svc/comscore/pvc.html";
			console.log("Send ComScore PVC " + curr_page + " " + tmst);
			TAGX.Globals.comscore.fire();
		}, checkComScorePage = function() {
			updateComscoreVals();
			if (curr_page !== prev_page) {
				triggerComscorePVC();
				prev_page = curr_page;
			}
		}, startScrollTimeout = function() {
			clearTimeout(pv_timeout);
			pv_timeout = setTimeout(checkComScorePage, 500);
		};
		updateComscoreVals();
		TAGX.ScrollManager.addSubs({
			functionToRun: startScrollTimeout,
			args: {}
		});
	};
	//page types to send scroll events
	validScrollPageTypes = "article-multimedia-blogs-feed-oak-post";
	if (validScrollPageTypes.indexOf(TAGX.Utils.getMetaTag("PT").toLowerCase()) > -1) {
		console.log("Adding ComScore PVC Scroll Tracking");
		addScrollTracking();
	}
	// This will trigger a comscore request for slideshow updates
	if (document.location.pathname.match("/slideshow")) {
		TAGX.$(TAGX).on('tagx-comscore', function(data) {
			// the first tagx-comscore event shouldn't fire tracking since the pageview tracks
			if (firstSlide) {
				firstSlide = false;
				return;
			}
			TAGX.Globals.comscore.fire();
		});
	}
	if (document.location.pathname.match("/search")) {
		window.onpopstate = function(event) {
			if (!event.state) {
				TAGX.Globals.comscore.fire();
			}
		}
		;
	}
	this.listenersOn = true;
}
;
// override the default global tags init - this is comscore specific dependencies
TAGX.Globals.comscore.init = function() {
	'use strict';
	// lib include tag
	window._comscore = window._comscore || [];
	window._comscore.push({
		c1: "2",
		c2: "3005403"
	});
	this.setConfig();
	TAGX.Utils.includeFile("https://sb.scorecardresearch.com/beacon.js", false, "body", true, "loaded:beacon.js");
}
;
// fire method sends the data to comscore.
TAGX.Globals.comscore.fire = function(oArg) {
	'use strict';
	if (!this.listenersOn) {
		// on first fire just attach the listeners - the beacon file loaded in init fires once automatically
		this.addListeners();
		return;
	}
	this.setConfig();
	udm_('https://sb.scorecardresearch.com/b?' + this.config.join('&'));
}
;

//et-global-include.js

// get global tag instance
TAGX.Globals.etLiInclude = new TAGX.GlobalTag({
	'name': 'eventtracker-include',
	'instant': true
});
// get global tag instance
TAGX.Globals.facebook = new TAGX.GlobalTag({
	name: 'facebook',
	instant: false,
	notifyWhenDatalayerReady: true,
	dependencies: [{
		name: 'mc',
		getter: function() {
			var meterObject = TAGX.Utils.getMeterValue('v');
			if (typeof meterObject !== 'undefined' && meterObject !== null) {
				return meterObject.v || '';
			}
			return '';
		},
		eventName: 'nytd:meter:viewedCountUpdated',
		eventHandler: function(eventData, dependency) {
			console.log('=> facebook global eventhandler called', eventData, dependency.getName());
			dependency.fullfill(eventData && eventData.v || '');
		},
		timeout: 5000
	}]
});

TAGX.Globals.facebook.init = function() {
	!function(f, b, e, v, n, t, s) {
		if (f.fbq)
			return;
		n = f.fbq = function() {
			n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
		}
		;
		if (!f._fbq)
			f._fbq = n;
		n.push = n;
		n.loaded = !0;
		n.version = '2.0';
		n.queue = [];
		t = b.createElement(e);
		t.async = !0;
		t.src = v;
		s = b.getElementsByTagName(e)[0];
		s.parentNode.insertBefore(t, s)
	}(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
	fbq('init', this.pixelId || "592202027582499");
	// Insert your pixel ID here.

	this._postInit();
}
;

// overriding the default global tags datalayerIsReady
TAGX.Globals.facebook.datalayerIsReady = function() {
	this.fire();
}
;

// fire method sends the data to comscore.
TAGX.Globals.facebook.fire = function() {
	var dependencyValues, fbPixelId, fbEventData, defaultValues, userType, agentID;

	if (!this.hasAllDependenciesBeenFullfilled() || !this.datalayerReady) {
		return;
	}

	defaultValues = {
		ad: parseInt(TAGX.data.get('TAGX.L.adv')),
		articleId: TAGX.Utils.getMetaTag('articleid'),
		fbk: localStorage.getItem("kxsegs") || '',
		pScore: TAGX.data.get('propensity.p'),
		c1Score: TAGX.data.get('propensity.c1'),
		c2Score: TAGX.data.get('propensity.c2'),
		c3Score: TAGX.data.get('propensity.c3'),
		sourceApp: TAGX.Utils.getMetaTag('sourceApp'),
		watSegs: TAGX.data.get("user.watSegs"),
		fbBrowser: /\/FBIOS/i.test(navigator.userAgent),
		content_ids: [TAGX.Utils.encodeString(window.location.pathname)],
		content_type: 'product',
		content_category: TAGX.Utils.getMetaTag('dfp-ad-unit-path'),
		userAgent: navigator.userAgent
	};

	userType = TAGX.data.get('user.type');

	if (userType && userType !== 'anon') {
		defaultValues.userType = userType;
	}

	agentID = TAGX.data.get('agentID');

	if (agentID) {
		defaultValues.agentID = agentID;
	}

	dependencyValues = this.getDependencyValues();
	dependencyValues.value = dependencyValues.value || 0;
	dependencyValues.currency = dependencyValues.currency || 'USD';

	fbEventData = TAGX.Utils.copyObj(defaultValues, dependencyValues);
	fbEventData = TAGX.Utils.copyObj(fbEventData, this.additionalEventData);
	fbEventData = TAGX.Utils.copyObj(fbEventData, safelyCollectKeyweeEvent());

	var eventName = this.eventName || 'Purchase';
	fbq(trackMethod(eventName), eventName, fbEventData);

	// notify dependants
	this.tagFired();
	this.resetEventName();
}
;

TAGX.Globals.facebook.resetEventName = function() {
	this.eventName = null;
}

function safelyCollectKeyweeEvent() {
	if (!window.Keywee || !Keywee.getEventToSend)
		return {};

	var keyweeData = {};

	try {
		keyweeData = Keywee.getEventToSend();
	} catch (e) {
		keyweeData = {};
		console.log('Error getting keywee event data:', e);
	}

	return TAGX.Utils.isObject(keyweeData) ? keyweeData : {};
}

function trackMethod(eventName) {
	var standardEvents = 'ViewContent-Search-AddToCart-AddToWishlist-InitiateCheckout-AddPaymentInfo-Purchase-Lead-CompleteRegistration';
	return standardEvents.indexOf(eventName) > -1 ? 'track' : 'trackCustom';
}

// get global tag instance
TAGX.Globals.linkedin = new TAGX.GlobalTag({
	name: 'linkedin',
	instant: true,
	oneAndDone: true,
});

TAGX.Globals.linkedin.fire = function() {
	window._linkedin_data_partner_id = '40524';

	var firstScript = document.getElementsByTagName('script')[0];
	var linkedScript = document.createElement('script');

	linkedScript.type = 'text/javascript';
	linkedScript.async = true;
	linkedScript.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';

	firstScript.parentNode.insertBefore(linkedScript, firstScript);

	// notify dependants
	this.tagFired();
}
;

// get global tag instance
TAGX.Globals.pinterest = new TAGX.GlobalTag({
	name: 'pinterest',
	instant: false,
	notifyWhenDatalayerReady: true,
});

TAGX.Globals.pinterest.init = function() {
	//Pinterest universal website tag code
	(function(e) {
		if (!window.pintrk) {
			window.pintrk = function() {
				window.pintrk.queue.push(Array.prototype.slice.call(arguments));
			}
			;

			var n = window.pintrk;
			n.queue = [];
			n.version = '3.0';
			var t = document.createElement('script');
			t.async = !0;
			t.src = e;
			var r = document.getElementsByTagName('script')[0];
			r.parentNode.insertBefore(t, r);
		}
	}
	)('https://s.pinimg.com/ct/core.js');

	pintrk('load', '2619180518495');
	pintrk('page', {
		page_name: TAGX.Utils.getMetaTag('headline'),
		page_category: TAGX.Utils.getMetaTag('dfp-ad-unit-path'),
	});

	this._postInit();
}
;

// overriding the default global tags datalayerIsReady
TAGX.Globals.pinterest.datalayerIsReady = function() {
	this.fire();
}
;

TAGX.Globals.pinterest.fire = function() {
	if (!this.hasAllDependenciesBeenFullfilled() || !this.datalayerReady)
		return;

	var eventData = {
		ad: parseInt(TAGX.data.get('TAGX.L.adv')),
		articleId: TAGX.Utils.getMetaTag('articleid'),
		fbk: localStorage.getItem("kxsegs") || '',
		pScore: TAGX.data.get('propensity.p'),
		aScore: TAGX.data.get('propensity.a'),
		sourceApp: TAGX.Utils.getMetaTag('sourceApp'),
		watSegs: TAGX.data.get("user.watSegs"),
		fbBrowser: /\/FBIOS/i.test(navigator.userAgent),
		content_ids: [TAGX.Utils.encodeString(window.location.pathname)],
		content_type: 'product',
		content_category: TAGX.Utils.getMetaTag('dfp-ad-unit-path'),
		userAgent: navigator.userAgent,
		value: 0,
		currency: 'USD'
	};
	eventData = TAGX.Utils.copyObj(eventData, this.getDependencyValues() || {});
	eventData = TAGX.Utils.copyObj(eventData, this.additionalEventData || {});

	if (eventData.value > 0) {
		this.eventName = 'checkout';
	}

	pintrk('track', this.eventName || 'pagevisit', eventData);

	// notify dependants
	this.tagFired();
}
;

TAGX.Globals.pinterest.addToCart = function() {
	pintrk('track', 'addtocart');
}
;

// get global tag instance
TAGX.Globals.twitter = new TAGX.GlobalTag({
	name: 'twitter',
	instant: true,
	oneAndDone: true,
});

TAGX.Globals.twitter.init = function() {
	//Twitter universal website tag code
	!function(e, t, n, s, u, a) {
		e.twq || (s = e.twq = function() {
			s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments);
		}
		,
		s.version = '1.1',
		s.queue = [],
		u = t.createElement(n),
		u.async = !0,
		u.src = '//static.ads-twitter.com/uwt.js',
		a = t.getElementsByTagName(n)[0],
		a.parentNode.insertBefore(u, a))
	}(window, document, 'script');

	// Insert Twitter Pixel ID and Standard Event data below
	twq('init', 'nuqgp');
	// End Twitter universal website tag code

	this._postInit();
}
;

TAGX.Globals.twitter.fire = function() {
	twq('track', 'PageView');

	// notify dependants
	this.tagFired();
}
;

// get global tag instance
TAGX.Globals.videoEvents = new TAGX.GlobalTag({
	'name': 'video-events',
	'instant': false
});

// override the default global tags init - this is comscore specific dependencies
TAGX.Globals.videoEvents.init = function() {
	// I think there are no init stuff needed
	TAGX.$(TAGX).on('tagx-event-video', function(ed) {
		TAGX.Globals.videoEvents.fire({
			eventData: ed
		});
	});

}
;

// fire method sends the data to comscore.
TAGX.Globals.videoEvents.fire = function(oArg) {
	var ga_cfg = (TAGX.config ? TAGX.config.GoogleAnalytics : null);
	var eo = oArg.eventData;
	if (ga_cfg && ga_cfg.id && eo) {
		var videoCategoryName = (eo.mData.videoDeliveryMethod === 'live' ? 'Live | ' : 'Video | ') + (eo.version || '');
		var videoName = decodeURIComponent(eo.mData ? (eo.mData.videoName || '') : '');
		var cds = {
			dimension141: eo.mData.videoPrimaryPlaylistId || "null",
			dimension142: eo.mData.videoPrimaryPlaylistName || "null",
			dimension138: eo.mData.videoFranchise || "null",
			dimension139: eo.mData.videoSection || "null",
			dimension123: eo.contentId || "null",
			dimension124: eo.mData.adDuration || "null",
			dimension163: eo.mData.videoType || "null"

		};
		var spcialVideoDurationEventsList = {
			'percent-25-viewed': 1,
			'percent-50-viewed': 1,
			'percent-75-viewed': 1,
			'video-complete': 1,
			'user-play': 1,
			'auto-play-next': 1,
			'auto-play-start': 1
		};

		var specialAdDurationEventList = TAGX.Utils.copyObj({
			'ad-start': 1,
			'ad-complete': 1,
			'skip-ad': 1,
			'player-load': 1,
			'video-load': 1
		}, spcialVideoDurationEventsList);

		// ad duration / position CD
		if (specialAdDurationEventList.hasOwnProperty(eo.eventName)) {
			cds.dimension125 = eo.mData.adPosition;
		}

		// check on duration groupings values
		if (spcialVideoDurationEventsList.hasOwnProperty(eo.eventName)) {

			var durationToGroups = (function() {
				var milestones = [1, 2, 3, 4, 5, 10, 20, 30, 40];
				var seconds_index = 4;
				return function(duration) {
					var x = milestones.reduce(function(a, b, c) {
						if (typeof a === 'string') {
							return a;
						}
						var aa = a * 30
						  , bb = b * 30;
						if (aa !== 0) {
							aa += 1;
						}
						if (duration >= aa && duration <= bb) {
							if (c <= seconds_index) {
								return aa + '-' + bb + ' seconds';
							} else if (c === seconds_index + 1) {
								return (aa) + ' seconds to ' + (bb / 60) + ' minutes';
							} else {
								return Math.floor(aa / 60) + ' minutes to ' + (bb / 60) + ' minutes';
							}
						}
						if (c === milestones.length - 1) {
							return 'more than ' + (bb / 60) + ' minutes';
						} else {
							return b;
						}
					}, 0);
					return x;
				}
				;
			}
			)();

			cds.dimension126 = eo.mData.videoDuration;
			cds.dimension127 = durationToGroups(eo.mData.videoDuration);
		}
		;
		var extendCds = function(obj) {
			return TAGX.Utils.copyObj(obj, cds);
		};
		var mapping = {
			'ad-complete': [videoCategoryName, 'ad complete', videoName, cds],
			'ad-pause': [videoCategoryName, 'ad pause', videoName, cds],
			'ad-resume': [videoCategoryName, 'ad resume', videoName, cds],
			'ad-start': [videoCategoryName, 'ad start', videoName, cds],
			'auto-play-next': [videoCategoryName, 'autoplay next', videoName, extendCds({
				metric32: 1
			})],
			'auto-play-start': [videoCategoryName, 'autoplay start', videoName, extendCds({
				metric31: 1
			})],
			'exit-fullscreen': [videoCategoryName, 'exit fullscreen', videoName, cds],
			'go-fullscreen': [videoCategoryName, 'go fullscreen', videoName, cds],
			'hd-off': [videoCategoryName, 'hd off', videoName, cds],
			'hd-on': [videoCategoryName, 'hd on', videoName, cds],
			'pause': [videoCategoryName, 'pause', videoName, cds],
			'percent-25-viewed': [videoCategoryName, 'viewed: 25%', videoName, extendCds({
				metric24: 1
			})],
			'percent-50-viewed': [videoCategoryName, 'viewed: 50%', videoName, extendCds({
				metric25: 1
			})],
			'percent-75-viewed': [videoCategoryName, 'viewed: 75%', videoName, extendCds({
				metric26: 1
			})],
			'3-seconds-viewed': [videoCategoryName, '3-seconds-viewed', videoName, extendCds({
				metric42: 1
			})],
			'30-seconds-viewed': [videoCategoryName, '30-seconds-viewed', videoName, extendCds({
				metric43: 1
			})],
			'360-drag-start': [videoCategoryName, '360-drag-start', videoName, extendCds({
				metric58: 1
			})],
			'360-drag-stop': [videoCategoryName, '360-drag-stop', videoName, extendCds({
				metric59: 1
			})],
			'360-compass-click': [videoCategoryName, '360-compass-click', videoName, extendCds({
				metric60: 1
			})],
			'resume': [videoCategoryName, 'resume', videoName, cds],
			'share-embed': [videoCategoryName, 'share: embed', videoName, extendCds({
				metric4: 1
			})],
			'share-facebook': [videoCategoryName, 'share: facebook', videoName, extendCds({
				metric4: 1
			})],
			'share-twitter': [videoCategoryName, 'share: twitter', videoName, extendCds({
				metric4: 1
			})],
			'skip-ad': [videoCategoryName, 'ad skip', videoName, cds],
			'user-play': [videoCategoryName, 'user play', videoName, extendCds({
				metric1: 1
			})],
			'video-complete': [videoCategoryName, 'viewed:100%', videoName, extendCds({
				metric3: 1
			})],
			'video-load': [videoCategoryName, 'video load', videoName, cds],
			'media-error': [videoCategoryName, 'media-error', videoName, extendCds({
				'nonInteraction': true
			})],
			'cherry-api-request-error': [videoCategoryName, 'cherry-api-request-error', videoName, extendCds({
				'nonInteraction': true
			})],
			'fw-admanager-load-error': [videoCategoryName, 'fw-admanager-load-error', videoName, extendCds({
				'nonInteraction': true
			})],
			'qos-library-load-failure': [videoCategoryName, 'qos-library-load-failure', videoName, extendCds({
				'nonInteraction': true
			})],
			'rendition-not-found': [videoCategoryName, 'rendition-not-found', videoName, extendCds({
				'nonInteraction': true
			})],
			'player-load': [videoCategoryName, 'player load', videoName, extendCds({
				'nonInteraction': true
			})],
			'imax-countdown-pause': [videoCategoryName, 'imax-countdown-pause', videoName, extendCds({
				'nonInteraction': false
			})],
			// DATG-715
			'imax-countdown-complete': [videoCategoryName, 'imax-countdown-complete', videoName, extendCds({
				'nonInteraction': false
			})],
			// DATG-715
		};
		var action = mapping[eo.eventName];
		if (!action) {
			return;
		}
		var tracker = ga_cfg.tracker || 'ga';
		var tracker2 = (ga_cfg.createOptions && ga_cfg.createOptions.name ? ga_cfg.createOptions.name + '.' : '');
		var args = action.slice(0);
		args.unshift(tracker2 + 'send', 'event');
		window[tracker].apply(window, args);

		this.fireFacebookPixel(eo.eventName, videoName);
		this.etEvent(eo);
	}
}
;

TAGX.Globals.videoEvents.fireFacebookPixel = function(videoEventName, videoName) {
	var weWantToTrackThisEvent = ['auto-play-next', 'auto-play-start', 'percent-25-viewed', 'percent-50-viewed', 'percent-75-viewed', 'user-play'].indexOf(videoEventName) > -1;

	if (!weWantToTrackThisEvent)
		return;

	var eventData = {
		'videoTitle': videoName
	};
	var fbEventName = 'videoPlay';

	if (videoEventName.indexOf('play') > -1) {

		if (videoEventName.indexOf('user') > -1) {
			eventData.playType = 'manual';
		} else {
			eventData.playType = videoEventName.replace('auto-play-', '');
		}
	}

	if (videoEventName.indexOf('viewed') > -1) {

		fbEventName = 'videoViewed';
		eventData.milestone = videoEventName.replace(/\D/g, '');
	}

	TAGX.Globals.facebook.addTagData({
		eventName: fbEventName
	});
	TAGX.Globals.facebook.addEventData(eventData);
	TAGX.Globals.facebook.fire();

	/*
		fbq("trackCustom", "videoPlay", {"playType":"manual|autostart|autonext"});
		fbq("trackCustom", "videoViewed", {"milestone":"25|50|75|100"});
	*/
}

TAGX.Globals.videoEvents.etEvent = function(eventObject) {
	eventObject = eventObject || {};
	var mData = eventObject.mData || {};

	var etEventData = TAGX.Utils.copyObj({
		subject: 'video-nytv',
		reqOrigin: 'tagx',
		videoId: eventObject.contentId,
		event: eventObject.eventName,
		url: location.href,
		referrer: document.referrer,
		sourceApp: TAGX.Utils.getMetaTag('sourceApp'),
	}, mData);

	if (NYTD && NYTD.EventTracker) {
		(new NYTD.EventTracker()).track(etEventData);
	} else {
		console.log('videoEvents.etEvent: EventTracker was not found');
	}
}

TAGX.Ops = TAGX.Utils.Ops;

(function(root, factory) {
	'use strict';
	var success = false, NYTD = root.NYTD || root.NYTCN, getHost, i, requirejs_valid, required_libs = ['foundation/hosts'], REQUIREJS_TRACK_LIB_NAME = 'foundation/lib/tracking';

	// if TAGX.taggerReady get out of here
	if (TAGX && (TAGX.taggerRecuested === true || TAGX.taggerReady === true)) {
		return;
	}

	// Define the function that handles the environment discovery.
	getHost = function() {
		var match = null
		  , env = null
		  , host = null
		  , HOSTS = {
			'prod': 'https://tagx.nytimes.com',
			'stg': 'https://tagx.stg.use1.nytimes.com',
			'dev': 'https://tagx.dev.use1.nytimes.com',
			'sandbox': '//localhost:8080'
		};

		// By default, host points to Production.
		host = HOSTS.prod;

		// Get the environment from NYTD.env
		if (typeof NYTD === 'object') {
			if (typeof NYTD.env === 'string') {
				env = NYTD.env;
			} else if (typeof NYTD.Host === 'object' && typeof NYTD.Host.getEnv === 'function') {
				env = NYTD.Host.getEnv();
			}
		}

		// Check the environment.
		if (env !== null) {
			switch (env) {
			case 'staging':
			case 'stg':
				host = HOSTS.stg;
				break;
			case 'development':
			case 'dev':
				host = HOSTS.dev;
				break;
			case 'sandbox':
				host = HOSTS.sandbox;
				break;
			}
		} else {
			// Environment is not available, use the URL location.
			if ((match = /\.(dev|stg)\.nytimes\.com$/.exec(location.hostname)) !== null) {
				host = HOSTS[match[1]];
			}
		}

		// Return the hostname.
		return host;
	}
	;
	// Retrieve hosts from require js library.
	requirejs_valid = true;

	if (typeof require === 'function' && typeof require.defined === 'function') {
		if (typeof define === 'function' && typeof define.amd === 'object' && typeof requirejs === 'function') {
			// Need to check if foundation/hosts is defined.
			for (i = 0; i < required_libs.length; i += 1) {
				requirejs_valid = requirejs_valid && (requirejs.defined(required_libs[i]) === true);
			}
			if (requirejs_valid === true) {
				// For development purposes, undefined the REQUIREJS_TRACK_LIB_NAME.
				requirejs.undef(REQUIREJS_TRACK_LIB_NAME);
				define(REQUIREJS_TRACK_LIB_NAME, required_libs, function(hosts) {
					var host = null;

					if (typeof hosts === 'object' && typeof hosts.tagx === 'string') {
						host = hosts.tagx;
					} else {
						host = getHost();
					}
					return host;
				});

				// Call the function to set up the lib.
				require([REQUIREJS_TRACK_LIB_NAME], function(host) {
					// Load from required hosts.
					factory(host);
				});
			} else {
				factory(getHost());
			}

			// Confirmation that factory was called.
			success = true;
		}
	}

	// If define and requirejs functions don't exist.
	if (success === false) {
		factory(getHost());
	}
}(this, function(host) {
	'use strict';

	var src, script, thisScript, getMetaTag = TAGX.Utils.getMetaTag, entry, storage = window.sessionStorage || window.localStorage, overwriteable_map = {
		'assetUrl': TAGX.Utils.getCanonicalUrl().replace(/\.(stg|dev)\./, '.'),
		'sourceApp': getMetaTag('sourceApp'),
		'url': location.href
	};

	// Overwrite properties.
	if (window.NYTD && window.NYTD.hasOwnProperty('AnalyticsOverrides') === true && typeof window.NYTD.AnalyticsOverrides === 'object') {
		for (entry in overwriteable_map) {
			if (overwriteable_map.hasOwnProperty(entry) === true && window.NYTD.AnalyticsOverrides.hasOwnProperty(entry)) {
				overwriteable_map[entry] = window.NYTD.AnalyticsOverrides[entry];
			}
		}
	}

	// URL encode.
	src = host + '/?url=' + encodeURIComponent(overwriteable_map.url) + '&assetUrl=' + encodeURIComponent(overwriteable_map.assetUrl) + '&referrer=' + encodeURIComponent(document.referrer) + '&CG=' + encodeURIComponent(getMetaTag('CG')) + '&SCG=' + encodeURIComponent(getMetaTag('SCG'));

	// external integration
	thisScript = TAGX.$('#nyt-tag-ext');
	if (thisScript && thisScript.length > 0) {
		// this is external integration
		overwriteable_map.sourceApp = TAGX.$(thisScript).attr('class');
		src += '&external=true';
	}

	// if sourceApp is available use it
	if (overwriteable_map.sourceApp !== '') {
		src += '&sourceApp=' + encodeURIComponent(overwriteable_map.sourceApp);
	} else if (/\.nytimes\.com$/.test(location.hostname)) {
		src += '&sourceApp=nyt-noSourceApp';
	}

	// Cache bust!
	if (!storage || storage.getItem('tagx_cache_buster') !== 'off') {
		src += '&_cache_buster_=' + (new Date().getTime());
	}

	// set up and run global tags
	if (typeof TAGX.GlobalsInit === 'function') {
		TAGX.GlobalsInit();
	}

	// Load the script.
	if (typeof TAGX === 'object' && typeof TAGX.Utils === 'object' && typeof TAGX.Utils.includeFile === 'function') {
		// Include using TAGX
		TAGX.taggerRecuested = true;
		TAGX.Utils.includeFile(src, false, 'body', true);
	} else {
		// Include manually.
		TAGX.taggerRecuested = true;
		script = document.createElement('script');
		script.src = src;
		document.body.appendChild(script);
	}
}));