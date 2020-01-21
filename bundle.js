(function () {
    'use strict';

    /* eslint-disable */

    /*
     * Dexie.js - a minimalistic wrapper for IndexedDB
     * ===============================================
     *
     * By David Fahlander, david.fahlander@gmail.com
     *
     * Version 3.0.0-rc.1, Wed Oct 30 2019
     *
     * http://dexie.org
     *
     * Apache License Version 2.0, January 2004, http://www.apache.org/licenses/
     */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var keys = Object.keys;
    var isArray = Array.isArray;
    var _global = typeof self !== 'undefined' ? self :
        typeof window !== 'undefined' ? window :
            global;
    if (typeof Promise !== 'undefined' && !_global.Promise) {
        _global.Promise = Promise;
    }
    function extend(obj, extension) {
        if (typeof extension !== 'object')
            return obj;
        keys(extension).forEach(function (key) {
            obj[key] = extension[key];
        });
        return obj;
    }
    var getProto = Object.getPrototypeOf;
    var _hasOwn = {}.hasOwnProperty;
    function hasOwn(obj, prop) {
        return _hasOwn.call(obj, prop);
    }
    function props(proto, extension) {
        if (typeof extension === 'function')
            extension = extension(getProto(proto));
        keys(extension).forEach(function (key) {
            setProp(proto, key, extension[key]);
        });
    }
    var defineProperty = Object.defineProperty;
    function setProp(obj, prop, functionOrGetSet, options) {
        defineProperty(obj, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === 'function' ?
            { get: functionOrGetSet.get, set: functionOrGetSet.set, configurable: true } :
            { value: functionOrGetSet, configurable: true, writable: true }, options));
    }
    function derive(Child) {
        return {
            from: function (Parent) {
                Child.prototype = Object.create(Parent.prototype);
                setProp(Child.prototype, "constructor", Child);
                return {
                    extend: props.bind(null, Child.prototype)
                };
            }
        };
    }
    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    function getPropertyDescriptor(obj, prop) {
        var pd = getOwnPropertyDescriptor(obj, prop);
        var proto;
        return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
    }
    var _slice = [].slice;
    function slice(args, start, end) {
        return _slice.call(args, start, end);
    }
    function override(origFunc, overridedFactory) {
        return overridedFactory(origFunc);
    }
    function assert(b) {
        if (!b)
            throw new Error("Assertion Failed");
    }
    function asap(fn) {
        if (_global.setImmediate)
            setImmediate(fn);
        else
            setTimeout(fn, 0);
    }

    function arrayToObject(array, extractor) {
        return array.reduce(function (result, item, i) {
            var nameAndValue = extractor(item, i);
            if (nameAndValue)
                result[nameAndValue[0]] = nameAndValue[1];
            return result;
        }, {});
    }

    function tryCatch(fn, onerror, args) {
        try {
            fn.apply(null, args);
        }
        catch (ex) {
            onerror && onerror(ex);
        }
    }
    function getByKeyPath(obj, keyPath) {
        if (hasOwn(obj, keyPath))
            return obj[keyPath];
        if (!keyPath)
            return obj;
        if (typeof keyPath !== 'string') {
            var rv = [];
            for (var i = 0, l = keyPath.length; i < l; ++i) {
                var val = getByKeyPath(obj, keyPath[i]);
                rv.push(val);
            }
            return rv;
        }
        var period = keyPath.indexOf('.');
        if (period !== -1) {
            var innerObj = obj[keyPath.substr(0, period)];
            return innerObj === undefined ? undefined : getByKeyPath(innerObj, keyPath.substr(period + 1));
        }
        return undefined;
    }
    function setByKeyPath(obj, keyPath, value) {
        if (!obj || keyPath === undefined)
            return;
        if ('isFrozen' in Object && Object.isFrozen(obj))
            return;
        if (typeof keyPath !== 'string' && 'length' in keyPath) {
            assert(typeof value !== 'string' && 'length' in value);
            for (var i = 0, l = keyPath.length; i < l; ++i) {
                setByKeyPath(obj, keyPath[i], value[i]);
            }
        }
        else {
            var period = keyPath.indexOf('.');
            if (period !== -1) {
                var currentKeyPath = keyPath.substr(0, period);
                var remainingKeyPath = keyPath.substr(period + 1);
                if (remainingKeyPath === "")
                    if (value === undefined) {
                        if (isArray(obj) && !isNaN(parseInt(currentKeyPath)))
                            obj.splice(currentKeyPath, 1);
                        else
                            delete obj[currentKeyPath];
                    }
                    else
                        obj[currentKeyPath] = value;
                else {
                    var innerObj = obj[currentKeyPath];
                    if (!innerObj)
                        innerObj = (obj[currentKeyPath] = {});
                    setByKeyPath(innerObj, remainingKeyPath, value);
                }
            }
            else {
                if (value === undefined) {
                    if (isArray(obj) && !isNaN(parseInt(keyPath)))
                        obj.splice(keyPath, 1);
                    else
                        delete obj[keyPath];
                }
                else
                    obj[keyPath] = value;
            }
        }
    }
    function delByKeyPath(obj, keyPath) {
        if (typeof keyPath === 'string')
            setByKeyPath(obj, keyPath, undefined);
        else if ('length' in keyPath)
            [].map.call(keyPath, function (kp) {
                setByKeyPath(obj, kp, undefined);
            });
    }
    function shallowClone(obj) {
        var rv = {};
        for (var m in obj) {
            if (hasOwn(obj, m))
                rv[m] = obj[m];
        }
        return rv;
    }
    var concat = [].concat;
    function flatten(a) {
        return concat.apply([], a);
    }
    var intrinsicTypeNames = "Boolean,String,Date,RegExp,Blob,File,FileList,ArrayBuffer,DataView,Uint8ClampedArray,ImageData,Map,Set"
        .split(',').concat(flatten([8, 16, 32, 64].map(function (num) { return ["Int", "Uint", "Float"].map(function (t) { return t + num + "Array"; }); }))).filter(function (t) { return _global[t]; });
    var intrinsicTypes = intrinsicTypeNames.map(function (t) { return _global[t]; });
    var intrinsicTypeNameSet = arrayToObject(intrinsicTypeNames, function (x) { return [x, true]; });
    function deepClone(any) {
        if (!any || typeof any !== 'object')
            return any;
        var rv;
        if (isArray(any)) {
            rv = [];
            for (var i = 0, l = any.length; i < l; ++i) {
                rv.push(deepClone(any[i]));
            }
        }
        else if (intrinsicTypes.indexOf(any.constructor) >= 0) {
            rv = any;
        }
        else {
            rv = any.constructor ? Object.create(any.constructor.prototype) : {};
            for (var prop in any) {
                if (hasOwn(any, prop)) {
                    rv[prop] = deepClone(any[prop]);
                }
            }
        }
        return rv;
    }
    var toString = {}.toString;
    function toStringTag(o) {
        return toString.call(o).slice(8, -1);
    }
    var getValueOf = function (val, type) {
        return type === "Array" ? '' + val.map(function (v) { return getValueOf(v, toStringTag(v)); }) :
            type === "ArrayBuffer" ? '' + new Uint8Array(val) :
                type === "Date" ? val.getTime() :
                    ArrayBuffer.isView(val) ? '' + new Uint8Array(val.buffer) :
                        val;
    };
    function getObjectDiff(a, b, rv, prfx) {
        rv = rv || {};
        prfx = prfx || '';
        keys(a).forEach(function (prop) {
            if (!hasOwn(b, prop))
                rv[prfx + prop] = undefined;
            else {
                var ap = a[prop], bp = b[prop];
                if (typeof ap === 'object' && typeof bp === 'object' && ap && bp) {
                    var apTypeName = toStringTag(ap);
                    var bpTypeName = toStringTag(bp);
                    if (apTypeName === bpTypeName) {
                        if (intrinsicTypeNameSet[apTypeName]) {
                            if (getValueOf(ap, apTypeName) !== getValueOf(bp, bpTypeName)) {
                                rv[prfx + prop] = b[prop];
                            }
                        }
                        else {
                            getObjectDiff(ap, bp, rv, prfx + prop + ".");
                        }
                    }
                    else {
                        rv[prfx + prop] = b[prop];
                    }
                }
                else if (ap !== bp)
                    rv[prfx + prop] = b[prop];
            }
        });
        keys(b).forEach(function (prop) {
            if (!hasOwn(a, prop)) {
                rv[prfx + prop] = b[prop];
            }
        });
        return rv;
    }
    var iteratorSymbol = typeof Symbol !== 'undefined' && Symbol.iterator;
    var getIteratorOf = iteratorSymbol ? function (x) {
        var i;
        return x != null && (i = x[iteratorSymbol]) && i.apply(x);
    } : function () { return null; };
    var NO_CHAR_ARRAY = {};
    function getArrayOf(arrayLike) {
        var i, a, x, it;
        if (arguments.length === 1) {
            if (isArray(arrayLike))
                return arrayLike.slice();
            if (this === NO_CHAR_ARRAY && typeof arrayLike === 'string')
                return [arrayLike];
            if ((it = getIteratorOf(arrayLike))) {
                a = [];
                while (x = it.next(), !x.done)
                    a.push(x.value);
                return a;
            }
            if (arrayLike == null)
                return [arrayLike];
            i = arrayLike.length;
            if (typeof i === 'number') {
                a = new Array(i);
                while (i--)
                    a[i] = arrayLike[i];
                return a;
            }
            return [arrayLike];
        }
        i = arguments.length;
        a = new Array(i);
        while (i--)
            a[i] = arguments[i];
        return a;
    }

    var debug = typeof location !== 'undefined' &&
        /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
    function setDebug(value, filter) {
        debug = value;
        libraryFilter = filter;
    }
    var libraryFilter = function () { return true; };
    var NEEDS_THROW_FOR_STACK = !new Error("").stack;
    function getErrorWithStack() {
        if (NEEDS_THROW_FOR_STACK)
            try {
                throw new Error();
            }
            catch (e) {
                return e;
            }
        return new Error();
    }
    function prettyStack(exception, numIgnoredFrames) {
        var stack = exception.stack;
        if (!stack)
            return "";
        numIgnoredFrames = (numIgnoredFrames || 0);
        if (stack.indexOf(exception.name) === 0)
            numIgnoredFrames += (exception.name + exception.message).split('\n').length;
        return stack.split('\n')
            .slice(numIgnoredFrames)
            .filter(libraryFilter)
            .map(function (frame) { return "\n" + frame; })
            .join('');
    }

    var dexieErrorNames = [
        'Modify',
        'Bulk',
        'OpenFailed',
        'VersionChange',
        'Schema',
        'Upgrade',
        'InvalidTable',
        'MissingAPI',
        'NoSuchDatabase',
        'InvalidArgument',
        'SubTransaction',
        'Unsupported',
        'Internal',
        'DatabaseClosed',
        'PrematureCommit',
        'ForeignAwait'
    ];
    var idbDomErrorNames = [
        'Unknown',
        'Constraint',
        'Data',
        'TransactionInactive',
        'ReadOnly',
        'Version',
        'NotFound',
        'InvalidState',
        'InvalidAccess',
        'Abort',
        'Timeout',
        'QuotaExceeded',
        'Syntax',
        'DataClone'
    ];
    var errorList = dexieErrorNames.concat(idbDomErrorNames);
    var defaultTexts = {
        VersionChanged: "Database version changed by other database connection",
        DatabaseClosed: "Database has been closed",
        Abort: "Transaction aborted",
        TransactionInactive: "Transaction has already completed or failed"
    };
    function DexieError(name, msg) {
        this._e = getErrorWithStack();
        this.name = name;
        this.message = msg;
    }
    derive(DexieError).from(Error).extend({
        stack: {
            get: function () {
                return this._stack ||
                    (this._stack = this.name + ": " + this.message + prettyStack(this._e, 2));
            }
        },
        toString: function () { return this.name + ": " + this.message; }
    });
    function getMultiErrorMessage(msg, failures) {
        return msg + ". Errors: " + Object.keys(failures)
            .map(function (key) { return failures[key].toString(); })
            .filter(function (v, i, s) { return s.indexOf(v) === i; })
            .join('\n');
    }
    function ModifyError(msg, failures, successCount, failedKeys) {
        this._e = getErrorWithStack();
        this.failures = failures;
        this.failedKeys = failedKeys;
        this.successCount = successCount;
        this.message = getMultiErrorMessage(msg, failures);
    }
    derive(ModifyError).from(DexieError);
    function BulkError(msg, failures) {
        this._e = getErrorWithStack();
        this.name = "BulkError";
        this.failures = failures;
        this.message = getMultiErrorMessage(msg, failures);
    }
    derive(BulkError).from(DexieError);
    var errnames = errorList.reduce(function (obj, name) { return (obj[name] = name + "Error", obj); }, {});
    var BaseException = DexieError;
    var exceptions = errorList.reduce(function (obj, name) {
        var fullName = name + "Error";
        function DexieError(msgOrInner, inner) {
            this._e = getErrorWithStack();
            this.name = fullName;
            if (!msgOrInner) {
                this.message = defaultTexts[name] || fullName;
                this.inner = null;
            }
            else if (typeof msgOrInner === 'string') {
                this.message = "" + msgOrInner + (!inner ? '' : '\n ' + inner);
                this.inner = inner || null;
            }
            else if (typeof msgOrInner === 'object') {
                this.message = msgOrInner.name + " " + msgOrInner.message;
                this.inner = msgOrInner;
            }
        }
        derive(DexieError).from(BaseException);
        obj[name] = DexieError;
        return obj;
    }, {});
    exceptions.Syntax = SyntaxError;
    exceptions.Type = TypeError;
    exceptions.Range = RangeError;
    var exceptionMap = idbDomErrorNames.reduce(function (obj, name) {
        obj[name + "Error"] = exceptions[name];
        return obj;
    }, {});
    function mapError(domError, message) {
        if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name])
            return domError;
        var rv = new exceptionMap[domError.name](message || domError.message, domError);
        if ("stack" in domError) {
            setProp(rv, "stack", { get: function () {
                    return this.inner.stack;
                } });
        }
        return rv;
    }
    var fullNameExceptions = errorList.reduce(function (obj, name) {
        if (["Syntax", "Type", "Range"].indexOf(name) === -1)
            obj[name + "Error"] = exceptions[name];
        return obj;
    }, {});
    fullNameExceptions.ModifyError = ModifyError;
    fullNameExceptions.DexieError = DexieError;
    fullNameExceptions.BulkError = BulkError;

    function nop() { }
    function mirror(val) { return val; }
    function pureFunctionChain(f1, f2) {
        if (f1 == null || f1 === mirror)
            return f2;
        return function (val) {
            return f2(f1(val));
        };
    }
    function callBoth(on1, on2) {
        return function () {
            on1.apply(this, arguments);
            on2.apply(this, arguments);
        };
    }
    function hookCreatingChain(f1, f2) {
        if (f1 === nop)
            return f2;
        return function () {
            var res = f1.apply(this, arguments);
            if (res !== undefined)
                arguments[0] = res;
            var onsuccess = this.onsuccess,
            onerror = this.onerror;
            this.onsuccess = null;
            this.onerror = null;
            var res2 = f2.apply(this, arguments);
            if (onsuccess)
                this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
            if (onerror)
                this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
            return res2 !== undefined ? res2 : res;
        };
    }
    function hookDeletingChain(f1, f2) {
        if (f1 === nop)
            return f2;
        return function () {
            f1.apply(this, arguments);
            var onsuccess = this.onsuccess,
            onerror = this.onerror;
            this.onsuccess = this.onerror = null;
            f2.apply(this, arguments);
            if (onsuccess)
                this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
            if (onerror)
                this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
        };
    }
    function hookUpdatingChain(f1, f2) {
        if (f1 === nop)
            return f2;
        return function (modifications) {
            var res = f1.apply(this, arguments);
            extend(modifications, res);
            var onsuccess = this.onsuccess,
            onerror = this.onerror;
            this.onsuccess = null;
            this.onerror = null;
            var res2 = f2.apply(this, arguments);
            if (onsuccess)
                this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
            if (onerror)
                this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
            return res === undefined ?
                (res2 === undefined ? undefined : res2) :
                (extend(res, res2));
        };
    }
    function reverseStoppableEventChain(f1, f2) {
        if (f1 === nop)
            return f2;
        return function () {
            if (f2.apply(this, arguments) === false)
                return false;
            return f1.apply(this, arguments);
        };
    }

    function promisableChain(f1, f2) {
        if (f1 === nop)
            return f2;
        return function () {
            var res = f1.apply(this, arguments);
            if (res && typeof res.then === 'function') {
                var thiz = this, i = arguments.length, args = new Array(i);
                while (i--)
                    args[i] = arguments[i];
                return res.then(function () {
                    return f2.apply(thiz, args);
                });
            }
            return f2.apply(this, arguments);
        };
    }

    var INTERNAL = {};
    var LONG_STACKS_CLIP_LIMIT = 100;
    var MAX_LONG_STACKS = 20;
    var ZONE_ECHO_LIMIT = 100;
    var _a = typeof Promise === 'undefined' ?
        [] :
        (function () {
            var globalP = Promise.resolve();
            if (typeof crypto === 'undefined' || !crypto.subtle)
                return [globalP, globalP.__proto__, globalP];
            var nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
            return [
                nativeP,
                nativeP.__proto__,
                globalP
            ];
        })();
    var resolvedNativePromise = _a[0];
    var nativePromiseProto = _a[1];
    var resolvedGlobalPromise = _a[2];
    var nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
    var NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
    var patchGlobalPromise = !!resolvedGlobalPromise;
    var stack_being_generated = false;
    var schedulePhysicalTick = resolvedGlobalPromise ?
        function () { resolvedGlobalPromise.then(physicalTick); }
        :
            _global.setImmediate ?
                setImmediate.bind(null, physicalTick) :
                _global.MutationObserver ?
                    function () {
                        var hiddenDiv = document.createElement("div");
                        (new MutationObserver(function () {
                            physicalTick();
                            hiddenDiv = null;
                        })).observe(hiddenDiv, { attributes: true });
                        hiddenDiv.setAttribute('i', '1');
                    } :
                    function () { setTimeout(physicalTick, 0); };
    var asap$1 = function (callback, args) {
        microtickQueue.push([callback, args]);
        if (needsNewPhysicalTick) {
            schedulePhysicalTick();
            needsNewPhysicalTick = false;
        }
    };
    var isOutsideMicroTick = true;
    var needsNewPhysicalTick = true;
    var unhandledErrors = [];
    var rejectingErrors = [];
    var currentFulfiller = null;
    var rejectionMapper = mirror;
    var globalPSD = {
        id: 'global',
        global: true,
        ref: 0,
        unhandleds: [],
        onunhandled: globalError,
        pgp: false,
        env: {},
        finalize: function () {
            this.unhandleds.forEach(function (uh) {
                try {
                    globalError(uh[0], uh[1]);
                }
                catch (e) { }
            });
        }
    };
    var PSD = globalPSD;
    var microtickQueue = [];
    var numScheduledCalls = 0;
    var tickFinalizers = [];
    function DexiePromise(fn) {
        if (typeof this !== 'object')
            throw new TypeError('Promises must be constructed via new');
        this._listeners = [];
        this.onuncatched = nop;
        this._lib = false;
        var psd = (this._PSD = PSD);
        if (debug) {
            this._stackHolder = getErrorWithStack();
            this._prev = null;
            this._numPrev = 0;
        }
        if (typeof fn !== 'function') {
            if (fn !== INTERNAL)
                throw new TypeError('Not a function');
            this._state = arguments[1];
            this._value = arguments[2];
            if (this._state === false)
                handleRejection(this, this._value);
            return;
        }
        this._state = null;
        this._value = null;
        ++psd.ref;
        executePromiseTask(this, fn);
    }
    var thenProp = {
        get: function () {
            var psd = PSD, microTaskId = totalEchoes;
            function then(onFulfilled, onRejected) {
                var _this = this;
                var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
                if (possibleAwait)
                    decrementExpectedAwaits();
                var rv = new DexiePromise(function (resolve, reject) {
                    propagateToListener(_this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait), resolve, reject, psd));
                });
                debug && linkToPreviousPromise(rv, this);
                return rv;
            }
            then.prototype = INTERNAL;
            return then;
        },
        set: function (value) {
            setProp(this, 'then', value && value.prototype === INTERNAL ?
                thenProp :
                {
                    get: function () {
                        return value;
                    },
                    set: thenProp.set
                });
        }
    };
    props(DexiePromise.prototype, {
        then: thenProp,
        _then: function (onFulfilled, onRejected) {
            propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
        },
        catch: function (onRejected) {
            if (arguments.length === 1)
                return this.then(null, onRejected);
            var type = arguments[0], handler = arguments[1];
            return typeof type === 'function' ? this.then(null, function (err) {
                return err instanceof type ? handler(err) : PromiseReject(err);
            })
                : this.then(null, function (err) {
                    return err && err.name === type ? handler(err) : PromiseReject(err);
                });
        },
        finally: function (onFinally) {
            return this.then(function (value) {
                onFinally();
                return value;
            }, function (err) {
                onFinally();
                return PromiseReject(err);
            });
        },
        stack: {
            get: function () {
                if (this._stack)
                    return this._stack;
                try {
                    stack_being_generated = true;
                    var stacks = getStack(this, [], MAX_LONG_STACKS);
                    var stack = stacks.join("\nFrom previous: ");
                    if (this._state !== null)
                        this._stack = stack;
                    return stack;
                }
                finally {
                    stack_being_generated = false;
                }
            }
        },
        timeout: function (ms, msg) {
            var _this = this;
            return ms < Infinity ?
                new DexiePromise(function (resolve, reject) {
                    var handle = setTimeout(function () { return reject(new exceptions.Timeout(msg)); }, ms);
                    _this.then(resolve, reject).finally(clearTimeout.bind(null, handle));
                }) : this;
        }
    });
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag)
        setProp(DexiePromise.prototype, Symbol.toStringTag, 'Dexie.Promise');
    globalPSD.env = snapShot();
    function Listener(onFulfilled, onRejected, resolve, reject, zone) {
        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
        this.onRejected = typeof onRejected === 'function' ? onRejected : null;
        this.resolve = resolve;
        this.reject = reject;
        this.psd = zone;
    }
    props(DexiePromise, {
        all: function () {
            var values = getArrayOf.apply(null, arguments)
                .map(onPossibleParallellAsync);
            return new DexiePromise(function (resolve, reject) {
                if (values.length === 0)
                    resolve([]);
                var remaining = values.length;
                values.forEach(function (a, i) { return DexiePromise.resolve(a).then(function (x) {
                    values[i] = x;
                    if (!--remaining)
                        resolve(values);
                }, reject); });
            });
        },
        resolve: function (value) {
            if (value instanceof DexiePromise)
                return value;
            if (value && typeof value.then === 'function')
                return new DexiePromise(function (resolve, reject) {
                    value.then(resolve, reject);
                });
            var rv = new DexiePromise(INTERNAL, true, value);
            linkToPreviousPromise(rv, currentFulfiller);
            return rv;
        },
        reject: PromiseReject,
        race: function () {
            var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
            return new DexiePromise(function (resolve, reject) {
                values.map(function (value) { return DexiePromise.resolve(value).then(resolve, reject); });
            });
        },
        PSD: {
            get: function () { return PSD; },
            set: function (value) { return PSD = value; }
        },
        newPSD: newScope,
        usePSD: usePSD,
        scheduler: {
            get: function () { return asap$1; },
            set: function (value) { asap$1 = value; }
        },
        rejectionMapper: {
            get: function () { return rejectionMapper; },
            set: function (value) { rejectionMapper = value; }
        },
        follow: function (fn, zoneProps) {
            return new DexiePromise(function (resolve, reject) {
                return newScope(function (resolve, reject) {
                    var psd = PSD;
                    psd.unhandleds = [];
                    psd.onunhandled = reject;
                    psd.finalize = callBoth(function () {
                        var _this = this;
                        run_at_end_of_this_or_next_physical_tick(function () {
                            _this.unhandleds.length === 0 ? resolve() : reject(_this.unhandleds[0]);
                        });
                    }, psd.finalize);
                    fn();
                }, zoneProps, resolve, reject);
            });
        }
    });
    function executePromiseTask(promise, fn) {
        try {
            fn(function (value) {
                if (promise._state !== null)
                    return;
                if (value === promise)
                    throw new TypeError('A promise cannot be resolved with itself.');
                var shouldExecuteTick = promise._lib && beginMicroTickScope();
                if (value && typeof value.then === 'function') {
                    executePromiseTask(promise, function (resolve, reject) {
                        value instanceof DexiePromise ?
                            value._then(resolve, reject) :
                            value.then(resolve, reject);
                    });
                }
                else {
                    promise._state = true;
                    promise._value = value;
                    propagateAllListeners(promise);
                }
                if (shouldExecuteTick)
                    endMicroTickScope();
            }, handleRejection.bind(null, promise));
        }
        catch (ex) {
            handleRejection(promise, ex);
        }
    }
    function handleRejection(promise, reason) {
        rejectingErrors.push(reason);
        if (promise._state !== null)
            return;
        var shouldExecuteTick = promise._lib && beginMicroTickScope();
        reason = rejectionMapper(reason);
        promise._state = false;
        promise._value = reason;
        debug && reason !== null && typeof reason === 'object' && !reason._promise && tryCatch(function () {
            var origProp = getPropertyDescriptor(reason, "stack");
            reason._promise = promise;
            setProp(reason, "stack", {
                get: function () {
                    return stack_being_generated ?
                        origProp && (origProp.get ?
                            origProp.get.apply(reason) :
                            origProp.value) :
                        promise.stack;
                }
            });
        });
        addPossiblyUnhandledError(promise);
        propagateAllListeners(promise);
        if (shouldExecuteTick)
            endMicroTickScope();
    }
    function propagateAllListeners(promise) {
        var listeners = promise._listeners;
        promise._listeners = [];
        for (var i = 0, len = listeners.length; i < len; ++i) {
            propagateToListener(promise, listeners[i]);
        }
        var psd = promise._PSD;
        --psd.ref || psd.finalize();
        if (numScheduledCalls === 0) {
            ++numScheduledCalls;
            asap$1(function () {
                if (--numScheduledCalls === 0)
                    finalizePhysicalTick();
            }, []);
        }
    }
    function propagateToListener(promise, listener) {
        if (promise._state === null) {
            promise._listeners.push(listener);
            return;
        }
        var cb = promise._state ? listener.onFulfilled : listener.onRejected;
        if (cb === null) {
            return (promise._state ? listener.resolve : listener.reject)(promise._value);
        }
        ++listener.psd.ref;
        ++numScheduledCalls;
        asap$1(callListener, [cb, promise, listener]);
    }
    function callListener(cb, promise, listener) {
        try {
            currentFulfiller = promise;
            var ret, value = promise._value;
            if (promise._state) {
                ret = cb(value);
            }
            else {
                if (rejectingErrors.length)
                    rejectingErrors = [];
                ret = cb(value);
                if (rejectingErrors.indexOf(value) === -1)
                    markErrorAsHandled(promise);
            }
            listener.resolve(ret);
        }
        catch (e) {
            listener.reject(e);
        }
        finally {
            currentFulfiller = null;
            if (--numScheduledCalls === 0)
                finalizePhysicalTick();
            --listener.psd.ref || listener.psd.finalize();
        }
    }
    function getStack(promise, stacks, limit) {
        if (stacks.length === limit)
            return stacks;
        var stack = "";
        if (promise._state === false) {
            var failure = promise._value, errorName, message;
            if (failure != null) {
                errorName = failure.name || "Error";
                message = failure.message || failure;
                stack = prettyStack(failure, 0);
            }
            else {
                errorName = failure;
                message = "";
            }
            stacks.push(errorName + (message ? ": " + message : "") + stack);
        }
        if (debug) {
            stack = prettyStack(promise._stackHolder, 2);
            if (stack && stacks.indexOf(stack) === -1)
                stacks.push(stack);
            if (promise._prev)
                getStack(promise._prev, stacks, limit);
        }
        return stacks;
    }
    function linkToPreviousPromise(promise, prev) {
        var numPrev = prev ? prev._numPrev + 1 : 0;
        if (numPrev < LONG_STACKS_CLIP_LIMIT) {
            promise._prev = prev;
            promise._numPrev = numPrev;
        }
    }
    function physicalTick() {
        beginMicroTickScope() && endMicroTickScope();
    }
    function beginMicroTickScope() {
        var wasRootExec = isOutsideMicroTick;
        isOutsideMicroTick = false;
        needsNewPhysicalTick = false;
        return wasRootExec;
    }
    function endMicroTickScope() {
        var callbacks, i, l;
        do {
            while (microtickQueue.length > 0) {
                callbacks = microtickQueue;
                microtickQueue = [];
                l = callbacks.length;
                for (i = 0; i < l; ++i) {
                    var item = callbacks[i];
                    item[0].apply(null, item[1]);
                }
            }
        } while (microtickQueue.length > 0);
        isOutsideMicroTick = true;
        needsNewPhysicalTick = true;
    }
    function finalizePhysicalTick() {
        var unhandledErrs = unhandledErrors;
        unhandledErrors = [];
        unhandledErrs.forEach(function (p) {
            p._PSD.onunhandled.call(null, p._value, p);
        });
        var finalizers = tickFinalizers.slice(0);
        var i = finalizers.length;
        while (i)
            finalizers[--i]();
    }
    function run_at_end_of_this_or_next_physical_tick(fn) {
        function finalizer() {
            fn();
            tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
        }
        tickFinalizers.push(finalizer);
        ++numScheduledCalls;
        asap$1(function () {
            if (--numScheduledCalls === 0)
                finalizePhysicalTick();
        }, []);
    }
    function addPossiblyUnhandledError(promise) {
        if (!unhandledErrors.some(function (p) { return p._value === promise._value; }))
            unhandledErrors.push(promise);
    }
    function markErrorAsHandled(promise) {
        var i = unhandledErrors.length;
        while (i)
            if (unhandledErrors[--i]._value === promise._value) {
                unhandledErrors.splice(i, 1);
                return;
            }
    }
    function PromiseReject(reason) {
        return new DexiePromise(INTERNAL, false, reason);
    }
    function wrap(fn, errorCatcher) {
        var psd = PSD;
        return function () {
            var wasRootExec = beginMicroTickScope(), outerScope = PSD;
            try {
                switchToZone(psd, true);
                return fn.apply(this, arguments);
            }
            catch (e) {
                errorCatcher && errorCatcher(e);
            }
            finally {
                switchToZone(outerScope, false);
                if (wasRootExec)
                    endMicroTickScope();
            }
        };
    }
    var task = { awaits: 0, echoes: 0, id: 0 };
    var taskCounter = 0;
    var zoneStack = [];
    var zoneEchoes = 0;
    var totalEchoes = 0;
    var zone_id_counter = 0;
    function newScope(fn, props$$1, a1, a2) {
        var parent = PSD, psd = Object.create(parent);
        psd.parent = parent;
        psd.ref = 0;
        psd.global = false;
        psd.id = ++zone_id_counter;
        var globalEnv = globalPSD.env;
        psd.env = patchGlobalPromise ? {
            Promise: DexiePromise,
            PromiseProp: { value: DexiePromise, configurable: true, writable: true },
            all: DexiePromise.all,
            race: DexiePromise.race,
            resolve: DexiePromise.resolve,
            reject: DexiePromise.reject,
            nthen: getPatchedPromiseThen(globalEnv.nthen, psd),
            gthen: getPatchedPromiseThen(globalEnv.gthen, psd)
        } : {};
        if (props$$1)
            extend(psd, props$$1);
        ++parent.ref;
        psd.finalize = function () {
            --this.parent.ref || this.parent.finalize();
        };
        var rv = usePSD(psd, fn, a1, a2);
        if (psd.ref === 0)
            psd.finalize();
        return rv;
    }
    function incrementExpectedAwaits() {
        if (!task.id)
            task.id = ++taskCounter;
        ++task.awaits;
        task.echoes += ZONE_ECHO_LIMIT;
        return task.id;
    }
    function decrementExpectedAwaits(sourceTaskId) {
        if (!task.awaits || (sourceTaskId && sourceTaskId !== task.id))
            return;
        if (--task.awaits === 0)
            task.id = 0;
        task.echoes = task.awaits * ZONE_ECHO_LIMIT;
    }
    if (('' + nativePromiseThen).indexOf('[native code]') === -1) {
        incrementExpectedAwaits = decrementExpectedAwaits = nop;
    }
    function onPossibleParallellAsync(possiblePromise) {
        if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
            incrementExpectedAwaits();
            return possiblePromise.then(function (x) {
                decrementExpectedAwaits();
                return x;
            }, function (e) {
                decrementExpectedAwaits();
                return rejection(e);
            });
        }
        return possiblePromise;
    }
    function zoneEnterEcho(targetZone) {
        ++totalEchoes;
        if (!task.echoes || --task.echoes === 0) {
            task.echoes = task.id = 0;
        }
        zoneStack.push(PSD);
        switchToZone(targetZone, true);
    }
    function zoneLeaveEcho() {
        var zone = zoneStack[zoneStack.length - 1];
        zoneStack.pop();
        switchToZone(zone, false);
    }
    function switchToZone(targetZone, bEnteringZone) {
        var currentZone = PSD;
        if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)) {
            enqueueNativeMicroTask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
        }
        if (targetZone === PSD)
            return;
        PSD = targetZone;
        if (currentZone === globalPSD)
            globalPSD.env = snapShot();
        if (patchGlobalPromise) {
            var GlobalPromise = globalPSD.env.Promise;
            var targetEnv = targetZone.env;
            nativePromiseProto.then = targetEnv.nthen;
            GlobalPromise.prototype.then = targetEnv.gthen;
            if (currentZone.global || targetZone.global) {
                Object.defineProperty(_global, 'Promise', targetEnv.PromiseProp);
                GlobalPromise.all = targetEnv.all;
                GlobalPromise.race = targetEnv.race;
                GlobalPromise.resolve = targetEnv.resolve;
                GlobalPromise.reject = targetEnv.reject;
            }
        }
    }
    function snapShot() {
        var GlobalPromise = _global.Promise;
        return patchGlobalPromise ? {
            Promise: GlobalPromise,
            PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
            all: GlobalPromise.all,
            race: GlobalPromise.race,
            resolve: GlobalPromise.resolve,
            reject: GlobalPromise.reject,
            nthen: nativePromiseProto.then,
            gthen: GlobalPromise.prototype.then
        } : {};
    }
    function usePSD(psd, fn, a1, a2, a3) {
        var outerScope = PSD;
        try {
            switchToZone(psd, true);
            return fn(a1, a2, a3);
        }
        finally {
            switchToZone(outerScope, false);
        }
    }
    function enqueueNativeMicroTask(job) {
        nativePromiseThen.call(resolvedNativePromise, job);
    }
    function nativeAwaitCompatibleWrap(fn, zone, possibleAwait) {
        return typeof fn !== 'function' ? fn : function () {
            var outerZone = PSD;
            if (possibleAwait)
                incrementExpectedAwaits();
            switchToZone(zone, true);
            try {
                return fn.apply(this, arguments);
            }
            finally {
                switchToZone(outerZone, false);
            }
        };
    }
    function getPatchedPromiseThen(origThen, zone) {
        return function (onResolved, onRejected) {
            return origThen.call(this, nativeAwaitCompatibleWrap(onResolved, zone, false), nativeAwaitCompatibleWrap(onRejected, zone, false));
        };
    }
    var UNHANDLEDREJECTION = "unhandledrejection";
    function globalError(err, promise) {
        var rv;
        try {
            rv = promise.onuncatched(err);
        }
        catch (e) { }
        if (rv !== false)
            try {
                var event, eventData = { promise: promise, reason: err };
                if (_global.document && document.createEvent) {
                    event = document.createEvent('Event');
                    event.initEvent(UNHANDLEDREJECTION, true, true);
                    extend(event, eventData);
                }
                else if (_global.CustomEvent) {
                    event = new CustomEvent(UNHANDLEDREJECTION, { detail: eventData });
                    extend(event, eventData);
                }
                if (event && _global.dispatchEvent) {
                    dispatchEvent(event);
                    if (!_global.PromiseRejectionEvent && _global.onunhandledrejection)
                        try {
                            _global.onunhandledrejection(event);
                        }
                        catch (_) { }
                }
                if (debug && event && !event.defaultPrevented) {
                    console.warn("Unhandled rejection: " + (err.stack || err));
                }
            }
            catch (e) { }
    }
    var rejection = DexiePromise.reject;

    function tempTransaction(db, mode, storeNames, fn) {
        if (!db._state.openComplete && (!PSD.letThrough)) {
            if (!db._state.isBeingOpened) {
                if (!db._options.autoOpen)
                    return rejection(new exceptions.DatabaseClosed());
                db.open().catch(nop);
            }
            return db._state.dbReadyPromise.then(function () { return tempTransaction(db, mode, storeNames, fn); });
        }
        else {
            var trans = db._createTransaction(mode, storeNames, db._dbSchema);
            try {
                trans.create();
            }
            catch (ex) {
                return rejection(ex);
            }
            return trans._promise(mode, function (resolve, reject) {
                return newScope(function () {
                    PSD.trans = trans;
                    return fn(resolve, reject, trans);
                });
            }).then(function (result) {
                return trans._completion.then(function () { return result; });
            });
        }
    }

    var DEXIE_VERSION = '3.0.0-rc.1';
    var maxString = String.fromCharCode(65535);
    var minKey = -Infinity;
    var INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
    var STRING_EXPECTED = "String expected.";
    var connections = [];
    var isIEOrEdge = typeof navigator !== 'undefined' && /(MSIE|Trident|Edge)/.test(navigator.userAgent);
    var hasIEDeleteObjectStoreBug = isIEOrEdge;
    var hangsOnDeleteLargeKeyRange = isIEOrEdge;
    var dexieStackFrameFilter = function (frame) { return !/(dexie\.js|dexie\.min\.js)/.test(frame); };
    var DBNAMES_DB = '__dbnames';
    var READONLY = 'readonly';
    var READWRITE = 'readwrite';

    function combine(filter1, filter2) {
        return filter1 ?
            filter2 ?
                function () { return filter1.apply(this, arguments) && filter2.apply(this, arguments); } :
                filter1 :
            filter2;
    }

    var AnyRange = {
        type: 3          ,
        lower: -Infinity,
        lowerOpen: false,
        upper: [[]],
        upperOpen: false
    };

    var Table =               (function () {
        function Table() {
        }
        Table.prototype._trans = function (mode, fn, writeLocked) {
            var trans = this._tx || PSD.trans;
            var tableName = this.name;
            function checkTableInTransaction(resolve, reject, trans) {
                if (!trans.schema[tableName])
                    throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
                return fn(trans.idbtrans, trans);
            }
            var wasRootExec = beginMicroTickScope();
            try {
                return trans && trans.db === this.db ?
                    trans === PSD.trans ?
                        trans._promise(mode, checkTableInTransaction, writeLocked) :
                        newScope(function () { return trans._promise(mode, checkTableInTransaction, writeLocked); }, { trans: trans, transless: PSD.transless || PSD }) :
                    tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
            }
            finally {
                if (wasRootExec)
                    endMicroTickScope();
            }
        };
        Table.prototype.get = function (keyOrCrit, cb) {
            var _this = this;
            if (keyOrCrit && keyOrCrit.constructor === Object)
                return this.where(keyOrCrit).first(cb);
            return this._trans('readonly', function (trans) {
                return _this.core.get({ trans: trans, key: keyOrCrit })
                    .then(function (res) { return _this.hook.reading.fire(res); });
            }).then(cb);
        };
        Table.prototype.where = function (indexOrCrit) {
            if (typeof indexOrCrit === 'string')
                return new this.db.WhereClause(this, indexOrCrit);
            if (isArray(indexOrCrit))
                return new this.db.WhereClause(this, "[" + indexOrCrit.join('+') + "]");
            var keyPaths = keys(indexOrCrit);
            if (keyPaths.length === 1)
                return this
                    .where(keyPaths[0])
                    .equals(indexOrCrit[keyPaths[0]]);
            var compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter(function (ix) {
                return ix.compound &&
                    keyPaths.every(function (keyPath) { return ix.keyPath.indexOf(keyPath) >= 0; }) &&
                    ix.keyPath.every(function (keyPath) { return keyPaths.indexOf(keyPath) >= 0; });
            })[0];
            if (compoundIndex && this.db._maxKey !== maxString)
                return this
                    .where(compoundIndex.name)
                    .equals(compoundIndex.keyPath.map(function (kp) { return indexOrCrit[kp]; }));
            if (!compoundIndex && debug)
                console.warn("The query " + JSON.stringify(indexOrCrit) + " on " + this.name + " would benefit of a " +
                    ("compound index [" + keyPaths.join('+') + "]"));
            var idxByName = this.schema.idxByName;
            var idb = this.db._deps.indexedDB;
            function equals(a, b) {
                try {
                    return idb.cmp(a, b) === 0;
                }
                catch (e) {
                    return false;
                }
            }
            var _a = keyPaths.reduce(function (_a, keyPath) {
                var prevIndex = _a[0], prevFilterFn = _a[1];
                var index = idxByName[keyPath];
                var value = indexOrCrit[keyPath];
                return [
                    prevIndex || index,
                    prevIndex || !index ?
                        combine(prevFilterFn, index && index.multi ?
                            function (x) {
                                var prop = getByKeyPath(x, keyPath);
                                return isArray(prop) && prop.some(function (item) { return equals(value, item); });
                            } : function (x) { return equals(value, getByKeyPath(x, keyPath)); })
                        : prevFilterFn
                ];
            }, [null, null]), idx = _a[0], filterFunction = _a[1];
            return idx ?
                this.where(idx.name).equals(indexOrCrit[idx.keyPath])
                    .filter(filterFunction) :
                compoundIndex ?
                    this.filter(filterFunction) :
                    this.where(keyPaths).equals('');
        };
        Table.prototype.filter = function (filterFunction) {
            return this.toCollection().and(filterFunction);
        };
        Table.prototype.count = function (thenShortcut) {
            return this.toCollection().count(thenShortcut);
        };
        Table.prototype.offset = function (offset) {
            return this.toCollection().offset(offset);
        };
        Table.prototype.limit = function (numRows) {
            return this.toCollection().limit(numRows);
        };
        Table.prototype.each = function (callback) {
            return this.toCollection().each(callback);
        };
        Table.prototype.toArray = function (thenShortcut) {
            return this.toCollection().toArray(thenShortcut);
        };
        Table.prototype.toCollection = function () {
            return new this.db.Collection(new this.db.WhereClause(this));
        };
        Table.prototype.orderBy = function (index) {
            return new this.db.Collection(new this.db.WhereClause(this, isArray(index) ?
                "[" + index.join('+') + "]" :
                index));
        };
        Table.prototype.reverse = function () {
            return this.toCollection().reverse();
        };
        Table.prototype.mapToClass = function (constructor) {
            this.schema.mappedClass = constructor;
            var readHook = function (obj) {
                if (!obj)
                    return obj;
                var res = Object.create(constructor.prototype);
                for (var m in obj)
                    if (hasOwn(obj, m))
                        try {
                            res[m] = obj[m];
                        }
                        catch (_) { }
                return res;
            };
            if (this.schema.readHook) {
                this.hook.reading.unsubscribe(this.schema.readHook);
            }
            this.schema.readHook = readHook;
            this.hook("reading", readHook);
            return constructor;
        };
        Table.prototype.defineClass = function () {
            function Class(content) {
                extend(this, content);
            }

            return this.mapToClass(Class);
        };
        Table.prototype.add = function (obj, key) {
            var _this = this;
            return this._trans('readwrite', function (trans) {
                return _this.core.mutate({ trans: trans, type: 'add', keys: key != null ? [key] : null, values: [obj] });
            }).then(function (res) { return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult; })
                .then(function (lastResult) {
                if (!_this.core.schema.primaryKey.outbound) {
                    try {
                        setByKeyPath(obj, _this.core.schema.primaryKey.keyPath, lastResult);
                    }
                    catch (_) { }

                }
                return lastResult;
            });
        };
        Table.prototype.update = function (keyOrObject, modifications) {
            if (typeof modifications !== 'object' || isArray(modifications))
                throw new exceptions.InvalidArgument("Modifications must be an object.");
            if (typeof keyOrObject === 'object' && !isArray(keyOrObject)) {
                keys(modifications).forEach(function (keyPath) {
                    setByKeyPath(keyOrObject, keyPath, modifications[keyPath]);
                });
                var key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
                if (key === undefined)
                    return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
                return this.where(":id").equals(key).modify(modifications);
            }
            else {
                return this.where(":id").equals(keyOrObject).modify(modifications);
            }
        };
        Table.prototype.put = function (obj, key) {
            var _this = this;
            return this._trans('readwrite', function (trans) { return _this.core.mutate({ trans: trans, type: 'put', values: [obj], keys: key != null ? [key] : null }); })
                .then(function (res) { return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult; })
                .then(function (lastResult) {
                if (!_this.core.schema.primaryKey.outbound) {
                    try {
                        setByKeyPath(obj, _this.core.schema.primaryKey.keyPath, lastResult);
                    }
                    catch (_) { }

                }
                return lastResult;
            });
        };
        Table.prototype.delete = function (key) {
            var _this = this;
            return this._trans('readwrite', function (trans) { return _this.core.mutate({ trans: trans, type: 'delete', keys: [key] }); })
                .then(function (res) { return res.numFailures ? DexiePromise.reject(res.failures[0]) : undefined; });
        };
        Table.prototype.clear = function () {
            var _this = this;
            return this._trans('readwrite', function (trans) { return _this.core.mutate({ trans: trans, type: 'deleteRange', range: AnyRange }); })
                .then(function (res) { return res.numFailures ? DexiePromise.reject(res.failures[0]) : undefined; });
        };
        Table.prototype.bulkGet = function (keys$$1) {
            var _this = this;
            return this._trans('readonly', function (trans) {
                return _this.core.getMany({
                    keys: keys$$1,
                    trans: trans
                });
            });
        };
        Table.prototype.bulkAdd = function (objects, keys$$1) {
            var _this = this;
            return this._trans('readwrite', function (trans) {
                var outbound = _this.core.schema.primaryKey.outbound;
                if (!outbound && keys$$1)
                    throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
                if (keys$$1 && keys$$1.length !== objects.length)
                    throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
                var numObjects = objects.length;
                return _this.core.mutate({ trans: trans, type: 'add', keys: keys$$1, values: objects })
                    .then(function (_a) {
                    var numFailures = _a.numFailures, lastResult = _a.lastResult, failures = _a.failures;
                    if (numFailures === 0)
                        return lastResult;
                    throw new BulkError(_this.name + ".bulkAdd(): " + numFailures + " of " + numObjects + " operations failed", Object.keys(failures).map(function (pos) { return failures[pos]; }));
                });
            });
        };
        Table.prototype.bulkPut = function (objects, keys$$1) {
            var _this = this;
            return this._trans('readwrite', function (trans) {
                var outbound = _this.core.schema.primaryKey.outbound;
                if (!outbound && keys$$1)
                    throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
                if (keys$$1 && keys$$1.length !== objects.length)
                    throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
                var numObjects = objects.length;
                return _this.core.mutate({ trans: trans, type: 'put', keys: keys$$1, values: objects })
                    .then(function (_a) {
                    var numFailures = _a.numFailures, lastResult = _a.lastResult, failures = _a.failures;
                    if (numFailures === 0)
                        return lastResult;
                    throw new BulkError(_this.name + ".bulkPut(): " + numFailures + " of " + numObjects + " operations failed", Object.keys(failures).map(function (pos) { return failures[pos]; }));
                });
            });
        };
        Table.prototype.bulkDelete = function (keys$$1) {
            var _this = this;
            var numKeys = keys$$1.length;
            return this._trans('readwrite', function (trans) {
                return _this.core.mutate({ trans: trans, type: 'delete', keys: keys$$1 });
            }).then(function (_a) {
                var numFailures = _a.numFailures, lastResult = _a.lastResult, failures = _a.failures;
                if (numFailures === 0)
                    return lastResult;
                throw new BulkError(_this.name + ".bulkDelete(): " + numFailures + " of " + numKeys + " operations failed", failures);
            });
        };
        return Table;
    }());

    function Events(ctx) {
        var evs = {};
        var rv = function (eventName, subscriber) {
            if (subscriber) {
                var i = arguments.length, args = new Array(i - 1);
                while (--i)
                    args[i - 1] = arguments[i];
                evs[eventName].subscribe.apply(null, args);
                return ctx;
            }
            else if (typeof (eventName) === 'string') {
                return evs[eventName];
            }
        };
        rv.addEventType = add;
        for (var i = 1, l = arguments.length; i < l; ++i) {
            add(arguments[i]);
        }
        return rv;
        function add(eventName, chainFunction, defaultFunction) {
            if (typeof eventName === 'object')
                return addConfiguredEvents(eventName);
            if (!chainFunction)
                chainFunction = reverseStoppableEventChain;
            if (!defaultFunction)
                defaultFunction = nop;
            var context = {
                subscribers: [],
                fire: defaultFunction,
                subscribe: function (cb) {
                    if (context.subscribers.indexOf(cb) === -1) {
                        context.subscribers.push(cb);
                        context.fire = chainFunction(context.fire, cb);
                    }
                },
                unsubscribe: function (cb) {
                    context.subscribers = context.subscribers.filter(function (fn) { return fn !== cb; });
                    context.fire = context.subscribers.reduce(chainFunction, defaultFunction);
                }
            };
            evs[eventName] = rv[eventName] = context;
            return context;
        }
        function addConfiguredEvents(cfg) {
            keys(cfg).forEach(function (eventName) {
                var args = cfg[eventName];
                if (isArray(args)) {
                    add(eventName, cfg[eventName][0], cfg[eventName][1]);
                }
                else if (args === 'asap') {
                    var context = add(eventName, mirror, function fire() {
                        var i = arguments.length, args = new Array(i);
                        while (i--)
                            args[i] = arguments[i];
                        context.subscribers.forEach(function (fn) {
                            asap(function fireEvent() {
                                fn.apply(null, args);
                            });
                        });
                    });
                }
                else
                    throw new exceptions.InvalidArgument("Invalid event config");
            });
        }
    }

    function makeClassConstructor(prototype, constructor) {
        derive(constructor).from({ prototype: prototype });
        return constructor;
    }

    function createTableConstructor(db) {
        return makeClassConstructor(Table.prototype, function Table$$1(name, tableSchema, trans) {
            this.db = db;
            this._tx = trans;
            this.name = name;
            this.schema = tableSchema;
            this.hook = db._allTables[name] ? db._allTables[name].hook : Events(null, {
                "creating": [hookCreatingChain, nop],
                "reading": [pureFunctionChain, mirror],
                "updating": [hookUpdatingChain, nop],
                "deleting": [hookDeletingChain, nop]
            });
        });
    }

    function isPlainKeyRange(ctx, ignoreLimitFilter) {
        return !(ctx.filter || ctx.algorithm || ctx.or) &&
            (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
    }
    function addFilter(ctx, fn) {
        ctx.filter = combine(ctx.filter, fn);
    }
    function addReplayFilter(ctx, factory, isLimitFilter) {
        var curr = ctx.replayFilter;
        ctx.replayFilter = curr ? function () { return combine(curr(), factory()); } : factory;
        ctx.justLimit = isLimitFilter && !curr;
    }
    function addMatchFilter(ctx, fn) {
        ctx.isMatch = combine(ctx.isMatch, fn);
    }
    function getIndexOrStore(ctx, coreSchema) {
        if (ctx.isPrimKey)
            return coreSchema.primaryKey;
        var index = coreSchema.getIndexByKeyPath(ctx.index);
        if (!index)
            throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + coreSchema.name + " is not indexed");
        return index;
    }
    function openCursor(ctx, coreTable, trans) {
        var index = getIndexOrStore(ctx, coreTable.schema);
        return coreTable.openCursor({
            trans: trans,
            values: !ctx.keysOnly,
            reverse: ctx.dir === 'prev',
            unique: !!ctx.unique,
            query: {
                index: index,
                range: ctx.range
            }
        });
    }
    function iter(ctx, fn, coreTrans, coreTable) {
        var filter = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
        if (!ctx.or) {
            return iterate(openCursor(ctx, coreTable, coreTrans), combine(ctx.algorithm, filter), fn, !ctx.keysOnly && ctx.valueMapper);
        }
        else {
            var set_1 = {};
            var union = function (item, cursor, advance) {
                if (!filter || filter(cursor, advance, function (result) { return cursor.stop(result); }, function (err) { return cursor.fail(err); })) {
                    var primaryKey = cursor.primaryKey;
                    var key = '' + primaryKey;
                    if (key === '[object ArrayBuffer]')
                        key = '' + new Uint8Array(primaryKey);
                    if (!hasOwn(set_1, key)) {
                        set_1[key] = true;
                        fn(item, cursor, advance);
                    }
                }
            };
            return Promise.all([
                ctx.or._iterate(union, coreTrans),
                iterate(openCursor(ctx, coreTable, coreTrans), ctx.algorithm, union, !ctx.keysOnly && ctx.valueMapper)
            ]);
        }
    }
    function iterate(cursorPromise, filter, fn, valueMapper) {
        var mappedFn = valueMapper ? function (x, c, a) { return fn(valueMapper(x), c, a); } : fn;
        var wrappedFn = wrap(mappedFn);
        return cursorPromise.then(function (cursor) {
            if (cursor) {
                return cursor.start(function () {
                    var c = function () { return cursor.continue(); };
                    if (!filter || filter(cursor, function (advancer) { return c = advancer; }, function (val) { cursor.stop(val); c = nop; }, function (e) { cursor.fail(e); c = nop; }))
                        wrappedFn(cursor.value, cursor, function (advancer) { return c = advancer; });
                    c();
                });
            }
        });
    }

    var Collection =               (function () {
        function Collection() {
        }
        Collection.prototype._read = function (fn, cb) {
            var ctx = this._ctx;
            return ctx.error ?
                ctx.table._trans(null, rejection.bind(null, ctx.error)) :
                ctx.table._trans('readonly', fn).then(cb);
        };
        Collection.prototype._write = function (fn) {
            var ctx = this._ctx;
            return ctx.error ?
                ctx.table._trans(null, rejection.bind(null, ctx.error)) :
                ctx.table._trans('readwrite', fn, "locked");
        };
        Collection.prototype._addAlgorithm = function (fn) {
            var ctx = this._ctx;
            ctx.algorithm = combine(ctx.algorithm, fn);
        };
        Collection.prototype._iterate = function (fn, coreTrans) {
            return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
        };
        Collection.prototype.clone = function (props$$1) {
            var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
            if (props$$1)
                extend(ctx, props$$1);
            rv._ctx = ctx;
            return rv;
        };
        Collection.prototype.raw = function () {
            this._ctx.valueMapper = null;
            return this;
        };
        Collection.prototype.each = function (fn) {
            var ctx = this._ctx;
            return this._read(function (trans) { return iter(ctx, fn, trans, ctx.table.core); });
        };
        Collection.prototype.count = function (cb) {
            var _this = this;
            return this._read(function (trans) {
                var ctx = _this._ctx;
                var coreTable = ctx.table.core;
                if (isPlainKeyRange(ctx, true)) {
                    return coreTable.count({
                        trans: trans,
                        query: {
                            index: getIndexOrStore(ctx, coreTable.schema),
                            range: ctx.range
                        }
                    }).then(function (count) { return Math.min(count, ctx.limit); });
                }
                else {
                    var count = 0;
                    return iter(ctx, function () { ++count; return false; }, trans, coreTable)
                        .then(function () { return count; });
                }
            }).then(cb);
        };
        Collection.prototype.sortBy = function (keyPath, cb) {
            var parts = keyPath.split('.').reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
            function getval(obj, i) {
                if (i)
                    return getval(obj[parts[i]], i - 1);
                return obj[lastPart];
            }
            var order = this._ctx.dir === "next" ? 1 : -1;
            function sorter(a, b) {
                var aVal = getval(a, lastIndex), bVal = getval(b, lastIndex);
                return aVal < bVal ? -order : aVal > bVal ? order : 0;
            }
            return this.toArray(function (a) {
                return a.sort(sorter);
            }).then(cb);
        };
        Collection.prototype.toArray = function (cb) {
            var _this = this;
            return this._read(function (trans) {
                var ctx = _this._ctx;
                if (ctx.dir === 'next' && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
                    var valueMapper_1 = ctx.valueMapper;
                    var index = getIndexOrStore(ctx, ctx.table.core.schema);
                    return ctx.table.core.query({
                        trans: trans,
                        limit: ctx.limit,
                        values: true,
                        query: {
                            index: index,
                            range: ctx.range
                        }
                    }).then(function (_a) {
                        var result = _a.result;
                        return valueMapper_1 ? result.map(valueMapper_1) : result;
                    });
                }
                else {
                    var a_1 = [];
                    return iter(ctx, function (item) { return a_1.push(item); }, trans, ctx.table.core).then(function () { return a_1; });
                }
            }, cb);
        };
        Collection.prototype.offset = function (offset) {
            var ctx = this._ctx;
            if (offset <= 0)
                return this;
            ctx.offset += offset;
            if (isPlainKeyRange(ctx)) {
                addReplayFilter(ctx, function () {
                    var offsetLeft = offset;
                    return function (cursor, advance) {
                        if (offsetLeft === 0)
                            return true;
                        if (offsetLeft === 1) {
                            --offsetLeft;
                            return false;
                        }
                        advance(function () {
                            cursor.advance(offsetLeft);
                            offsetLeft = 0;
                        });
                        return false;
                    };
                });
            }
            else {
                addReplayFilter(ctx, function () {
                    var offsetLeft = offset;
                    return function () { return (--offsetLeft < 0); };
                });
            }
            return this;
        };
        Collection.prototype.limit = function (numRows) {
            this._ctx.limit = Math.min(this._ctx.limit, numRows);
            addReplayFilter(this._ctx, function () {
                var rowsLeft = numRows;
                return function (cursor, advance, resolve) {
                    if (--rowsLeft <= 0)
                        advance(resolve);
                    return rowsLeft >= 0;
                };
            }, true);
            return this;
        };
        Collection.prototype.until = function (filterFunction, bIncludeStopEntry) {
            addFilter(this._ctx, function (cursor, advance, resolve) {
                if (filterFunction(cursor.value)) {
                    advance(resolve);
                    return bIncludeStopEntry;
                }
                else {
                    return true;
                }
            });
            return this;
        };
        Collection.prototype.first = function (cb) {
            return this.limit(1).toArray(function (a) { return a[0]; }).then(cb);
        };
        Collection.prototype.last = function (cb) {
            return this.reverse().first(cb);
        };
        Collection.prototype.filter = function (filterFunction) {
            addFilter(this._ctx, function (cursor) {
                return filterFunction(cursor.value);
            });
            addMatchFilter(this._ctx, filterFunction);
            return this;
        };
        Collection.prototype.and = function (filter) {
            return this.filter(filter);
        };
        Collection.prototype.or = function (indexName) {
            return new this.db.WhereClause(this._ctx.table, indexName, this);
        };
        Collection.prototype.reverse = function () {
            this._ctx.dir = (this._ctx.dir === "prev" ? "next" : "prev");
            if (this._ondirectionchange)
                this._ondirectionchange(this._ctx.dir);
            return this;
        };
        Collection.prototype.desc = function () {
            return this.reverse();
        };
        Collection.prototype.eachKey = function (cb) {
            var ctx = this._ctx;
            ctx.keysOnly = !ctx.isMatch;
            return this.each(function (val, cursor) { cb(cursor.key, cursor); });
        };
        Collection.prototype.eachUniqueKey = function (cb) {
            this._ctx.unique = "unique";
            return this.eachKey(cb);
        };
        Collection.prototype.eachPrimaryKey = function (cb) {
            var ctx = this._ctx;
            ctx.keysOnly = !ctx.isMatch;
            return this.each(function (val, cursor) { cb(cursor.primaryKey, cursor); });
        };
        Collection.prototype.keys = function (cb) {
            var ctx = this._ctx;
            ctx.keysOnly = !ctx.isMatch;
            var a = [];
            return this.each(function (item, cursor) {
                a.push(cursor.key);
            }).then(function () {
                return a;
            }).then(cb);
        };
        Collection.prototype.primaryKeys = function (cb) {
            var ctx = this._ctx;
            if (ctx.dir === 'next' && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
                return this._read(function (trans) {
                    var index = getIndexOrStore(ctx, ctx.table.core.schema);
                    return ctx.table.core.query({
                        trans: trans,
                        values: false,
                        limit: ctx.limit,
                        query: {
                            index: index,
                            range: ctx.range
                        }
                    });
                }).then(function (_a) {
                    var result = _a.result;
                    return result;
                }).then(cb);
            }
            ctx.keysOnly = !ctx.isMatch;
            var a = [];
            return this.each(function (item, cursor) {
                a.push(cursor.primaryKey);
            }).then(function () {
                return a;
            }).then(cb);
        };
        Collection.prototype.uniqueKeys = function (cb) {
            this._ctx.unique = "unique";
            return this.keys(cb);
        };
        Collection.prototype.firstKey = function (cb) {
            return this.limit(1).keys(function (a) { return a[0]; }).then(cb);
        };
        Collection.prototype.lastKey = function (cb) {
            return this.reverse().firstKey(cb);
        };
        Collection.prototype.distinct = function () {
            var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
            if (!idx || !idx.multi)
                return this;
            var set = {};
            addFilter(this._ctx, function (cursor) {
                var strKey = cursor.primaryKey.toString();
                var found = hasOwn(set, strKey);
                set[strKey] = true;
                return !found;
            });
            return this;
        };
        Collection.prototype.modify = function (changes) {
            var _this = this;
            var ctx = this._ctx;
            return this._write(function (trans) {
                var modifyer;
                if (typeof changes === 'function') {
                    modifyer = changes;
                }
                else {
                    var keyPaths = keys(changes);
                    var numKeys = keyPaths.length;
                    modifyer = function (item) {
                        var anythingModified = false;
                        for (var i = 0; i < numKeys; ++i) {
                            var keyPath = keyPaths[i], val = changes[keyPath];
                            if (getByKeyPath(item, keyPath) !== val) {
                                setByKeyPath(item, keyPath, val);
                                anythingModified = true;
                            }
                        }
                        return anythingModified;
                    };
                }
                var coreTable = ctx.table.core;
                var _a = coreTable.schema.primaryKey, outbound = _a.outbound, extractKey = _a.extractKey;
                var limit = 'testmode' in Dexie ? 1 : 2000;
                var cmp = _this.db.core.cmp;
                var totalFailures = [];
                var successCount = 0;
                var failedKeys = [];
                var applyMutateResult = function (expectedCount, res) {
                    var failures = res.failures, numFailures = res.numFailures;
                    successCount += expectedCount - numFailures;
                    for (var pos in failures) {
                        totalFailures.push(failures[pos]);
                    }
                };
                return _this.clone().primaryKeys().then(function (keys$$1) {
                    var nextChunk = function (offset) {
                        var count = Math.min(limit, keys$$1.length - offset);
                        return coreTable.getMany({ trans: trans, keys: keys$$1.slice(offset, offset + count) }).then(function (values) {
                            var addValues = [];
                            var putValues = [];
                            var putKeys = outbound ? [] : null;
                            var deleteKeys = [];
                            for (var i = 0; i < count; ++i) {
                                var origValue = values[i];
                                var ctx_1 = {
                                    value: deepClone(origValue),
                                    primKey: keys$$1[offset + i]
                                };
                                if (modifyer.call(ctx_1, ctx_1.value, ctx_1) !== false) {
                                    if (ctx_1.value == null) {
                                        deleteKeys.push(keys$$1[offset + i]);
                                    }
                                    else if (!outbound && cmp(extractKey(origValue), extractKey(ctx_1.value)) !== 0) {
                                        deleteKeys.push(keys$$1[offset + i]);
                                        addValues.push(ctx_1.value);
                                    }
                                    else {
                                        putValues.push(ctx_1.value);
                                        if (outbound)
                                            putKeys.push(keys$$1[offset + i]);
                                    }
                                }
                            }
                            return Promise.resolve(addValues.length > 0 &&
                                coreTable.mutate({ trans: trans, type: 'add', values: addValues })
                                    .then(function (res) {
                                    for (var pos in res.failures) {
                                        deleteKeys.splice(parseInt(pos), 1);
                                    }
                                    applyMutateResult(addValues.length, res);
                                })).then(function (res) { return putValues.length > 0 &&
                                coreTable.mutate({ trans: trans, type: 'put', keys: putKeys, values: putValues })
                                    .then(function (res) { return applyMutateResult(putValues.length, res); }); }).then(function () { return deleteKeys.length > 0 &&
                                coreTable.mutate({ trans: trans, type: 'delete', keys: deleteKeys })
                                    .then(function (res) { return applyMutateResult(deleteKeys.length, res); }); }).then(function () {
                                return keys$$1.length > offset + count && nextChunk(offset + limit);
                            });
                        });
                    };
                    return nextChunk(0).then(function () {
                        if (totalFailures.length > 0)
                            throw new ModifyError("Error modifying one or more objects", totalFailures, successCount, failedKeys);
                        return keys$$1.length;
                    });
                });
            });
        };
        Collection.prototype.delete = function () {
            var ctx = this._ctx, range = ctx.range;
            if (isPlainKeyRange(ctx) &&
                ((ctx.isPrimKey && !hangsOnDeleteLargeKeyRange) || range.type === 3          ))
             {
                return this._write(function (trans) {
                    var primaryKey = ctx.table.core.schema.primaryKey;
                    var coreRange = range;
                    return ctx.table.core.count({ trans: trans, query: { index: primaryKey, range: coreRange } }).then(function (count) {
                        return ctx.table.core.mutate({ trans: trans, type: 'deleteRange', range: coreRange })
                            .then(function (_a) {
                            var failures = _a.failures, lastResult = _a.lastResult, results = _a.results, numFailures = _a.numFailures;
                            if (numFailures)
                                throw new ModifyError("Could not delete some values", Object.keys(failures).map(function (pos) { return failures[pos]; }), count - numFailures);
                            return count - numFailures;
                        });
                    });
                });
            }
            return this.modify(function (value, ctx) { return ctx.value = null; });
        };
        return Collection;
    }());

    function createCollectionConstructor(db) {
        return makeClassConstructor(Collection.prototype, function Collection$$1(whereClause, keyRangeGenerator) {
            this.db = db;
            var keyRange = AnyRange, error = null;
            if (keyRangeGenerator)
                try {
                    keyRange = keyRangeGenerator();
                }
                catch (ex) {
                    error = ex;
                }
            var whereCtx = whereClause._ctx;
            var table = whereCtx.table;
            var readingHook = table.hook.reading.fire;
            this._ctx = {
                table: table,
                index: whereCtx.index,
                isPrimKey: (!whereCtx.index || (table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name)),
                range: keyRange,
                keysOnly: false,
                dir: "next",
                unique: "",
                algorithm: null,
                filter: null,
                replayFilter: null,
                justLimit: true,
                isMatch: null,
                offset: 0,
                limit: Infinity,
                error: error,
                or: whereCtx.or,
                valueMapper: readingHook !== mirror ? readingHook : null
            };
        });
    }

    function simpleCompare(a, b) {
        return a < b ? -1 : a === b ? 0 : 1;
    }
    function simpleCompareReverse(a, b) {
        return a > b ? -1 : a === b ? 0 : 1;
    }

    function fail(collectionOrWhereClause, err, T) {
        var collection = collectionOrWhereClause instanceof WhereClause ?
            new collectionOrWhereClause.Collection(collectionOrWhereClause) :
            collectionOrWhereClause;
        collection._ctx.error = T ? new T(err) : new TypeError(err);
        return collection;
    }
    function emptyCollection(whereClause) {
        return new whereClause.Collection(whereClause, function () { return rangeEqual(""); }).limit(0);
    }
    function upperFactory(dir) {
        return dir === "next" ?
            function (s) { return s.toUpperCase(); } :
            function (s) { return s.toLowerCase(); };
    }
    function lowerFactory(dir) {
        return dir === "next" ?
            function (s) { return s.toLowerCase(); } :
            function (s) { return s.toUpperCase(); };
    }
    function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp, dir) {
        var length = Math.min(key.length, lowerNeedle.length);
        var llp = -1;
        for (var i = 0; i < length; ++i) {
            var lwrKeyChar = lowerKey[i];
            if (lwrKeyChar !== lowerNeedle[i]) {
                if (cmp(key[i], upperNeedle[i]) < 0)
                    return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
                if (cmp(key[i], lowerNeedle[i]) < 0)
                    return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
                if (llp >= 0)
                    return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
                return null;
            }
            if (cmp(key[i], lwrKeyChar) < 0)
                llp = i;
        }
        if (length < lowerNeedle.length && dir === "next")
            return key + upperNeedle.substr(key.length);
        if (length < key.length && dir === "prev")
            return key.substr(0, upperNeedle.length);
        return (llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1));
    }
    function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
        var upper, lower, compare, upperNeedles, lowerNeedles, direction, nextKeySuffix, needlesLen = needles.length;
        if (!needles.every(function (s) { return typeof s === 'string'; })) {
            return fail(whereClause, STRING_EXPECTED);
        }
        function initDirection(dir) {
            upper = upperFactory(dir);
            lower = lowerFactory(dir);
            compare = (dir === "next" ? simpleCompare : simpleCompareReverse);
            var needleBounds = needles.map(function (needle) {
                return { lower: lower(needle), upper: upper(needle) };
            }).sort(function (a, b) {
                return compare(a.lower, b.lower);
            });
            upperNeedles = needleBounds.map(function (nb) { return nb.upper; });
            lowerNeedles = needleBounds.map(function (nb) { return nb.lower; });
            direction = dir;
            nextKeySuffix = (dir === "next" ? "" : suffix);
        }
        initDirection("next");
        var c = new whereClause.Collection(whereClause, function () { return createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix); });
        c._ondirectionchange = function (direction) {
            initDirection(direction);
        };
        var firstPossibleNeedle = 0;
        c._addAlgorithm(function (cursor, advance, resolve) {
            var key = cursor.key;
            if (typeof key !== 'string')
                return false;
            var lowerKey = lower(key);
            if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
                return true;
            }
            else {
                var lowestPossibleCasing = null;
                for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
                    var casing = nextCasing(key, lowerKey, upperNeedles[i], lowerNeedles[i], compare, direction);
                    if (casing === null && lowestPossibleCasing === null)
                        firstPossibleNeedle = i + 1;
                    else if (lowestPossibleCasing === null || compare(lowestPossibleCasing, casing) > 0) {
                        lowestPossibleCasing = casing;
                    }
                }
                if (lowestPossibleCasing !== null) {
                    advance(function () { cursor.continue(lowestPossibleCasing + nextKeySuffix); });
                }
                else {
                    advance(resolve);
                }
                return false;
            }
        });
        return c;
    }
    function createRange(lower, upper, lowerOpen, upperOpen) {
        return {
            type: 2            ,
            lower: lower,
            upper: upper,
            lowerOpen: lowerOpen,
            upperOpen: upperOpen
        };
    }
    function rangeEqual(value) {
        return {
            type: 1            ,
            lower: value,
            upper: value
        };
    }

    var WhereClause =               (function () {
        function WhereClause() {
        }
        Object.defineProperty(WhereClause.prototype, "Collection", {
            get: function () {
                return this._ctx.table.db.Collection;
            },
            enumerable: true,
            configurable: true
        });
        WhereClause.prototype.between = function (lower, upper, includeLower, includeUpper) {
            includeLower = includeLower !== false;
            includeUpper = includeUpper === true;
            try {
                if ((this._cmp(lower, upper) > 0) ||
                    (this._cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper)))
                    return emptyCollection(this);
                return new this.Collection(this, function () { return createRange(lower, upper, !includeLower, !includeUpper); });
            }
            catch (e) {
                return fail(this, INVALID_KEY_ARGUMENT);
            }
        };
        WhereClause.prototype.equals = function (value) {
            return new this.Collection(this, function () { return rangeEqual(value); });
        };
        WhereClause.prototype.above = function (value) {
            if (value == null)
                return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, function () { return createRange(value, undefined, true); });
        };
        WhereClause.prototype.aboveOrEqual = function (value) {
            if (value == null)
                return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, function () { return createRange(value, undefined, false); });
        };
        WhereClause.prototype.below = function (value) {
            if (value == null)
                return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, function () { return createRange(undefined, value, false, true); });
        };
        WhereClause.prototype.belowOrEqual = function (value) {
            if (value == null)
                return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, function () { return createRange(undefined, value); });
        };
        WhereClause.prototype.startsWith = function (str) {
            if (typeof str !== 'string')
                return fail(this, STRING_EXPECTED);
            return this.between(str, str + maxString, true, true);
        };
        WhereClause.prototype.startsWithIgnoreCase = function (str) {
            if (str === "")
                return this.startsWith(str);
            return addIgnoreCaseAlgorithm(this, function (x, a) { return x.indexOf(a[0]) === 0; }, [str], maxString);
        };
        WhereClause.prototype.equalsIgnoreCase = function (str) {
            return addIgnoreCaseAlgorithm(this, function (x, a) { return x === a[0]; }, [str], "");
        };
        WhereClause.prototype.anyOfIgnoreCase = function () {
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            if (set.length === 0)
                return emptyCollection(this);
            return addIgnoreCaseAlgorithm(this, function (x, a) { return a.indexOf(x) !== -1; }, set, "");
        };
        WhereClause.prototype.startsWithAnyOfIgnoreCase = function () {
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            if (set.length === 0)
                return emptyCollection(this);
            return addIgnoreCaseAlgorithm(this, function (x, a) { return a.some(function (n) { return x.indexOf(n) === 0; }); }, set, maxString);
        };
        WhereClause.prototype.anyOf = function () {
            var _this = this;
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            var compare = this._cmp;
            try {
                set.sort(compare);
            }
            catch (e) {
                return fail(this, INVALID_KEY_ARGUMENT);
            }
            if (set.length === 0)
                return emptyCollection(this);
            var c = new this.Collection(this, function () { return createRange(set[0], set[set.length - 1]); });
            c._ondirectionchange = function (direction) {
                compare = (direction === "next" ?
                    _this._ascending :
                    _this._descending);
                set.sort(compare);
            };
            var i = 0;
            c._addAlgorithm(function (cursor, advance, resolve) {
                var key = cursor.key;
                while (compare(key, set[i]) > 0) {
                    ++i;
                    if (i === set.length) {
                        advance(resolve);
                        return false;
                    }
                }
                if (compare(key, set[i]) === 0) {
                    return true;
                }
                else {
                    advance(function () { cursor.continue(set[i]); });
                    return false;
                }
            });
            return c;
        };
        WhereClause.prototype.notEqual = function (value) {
            return this.inAnyRange([[minKey, value], [value, this.db._maxKey]], { includeLowers: false, includeUppers: false });
        };
        WhereClause.prototype.noneOf = function () {
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            if (set.length === 0)
                return new this.Collection(this);
            try {
                set.sort(this._ascending);
            }
            catch (e) {
                return fail(this, INVALID_KEY_ARGUMENT);
            }
            var ranges = set.reduce(function (res, val) { return res ?
                res.concat([[res[res.length - 1][1], val]]) :
                [[minKey, val]]; }, null);
            ranges.push([set[set.length - 1], this.db._maxKey]);
            return this.inAnyRange(ranges, { includeLowers: false, includeUppers: false });
        };
        WhereClause.prototype.inAnyRange = function (ranges, options) {
            var _this = this;
            var cmp = this._cmp, ascending = this._ascending, descending = this._descending, min = this._min, max = this._max;
            if (ranges.length === 0)
                return emptyCollection(this);
            if (!ranges.every(function (range) {
                return range[0] !== undefined &&
                    range[1] !== undefined &&
                    ascending(range[0], range[1]) <= 0;
            })) {
                return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
            }
            var includeLowers = !options || options.includeLowers !== false;
            var includeUppers = options && options.includeUppers === true;
            function addRange(ranges, newRange) {
                var i = 0, l = ranges.length;
                for (; i < l; ++i) {
                    var range = ranges[i];
                    if (cmp(newRange[0], range[1]) < 0 && cmp(newRange[1], range[0]) > 0) {
                        range[0] = min(range[0], newRange[0]);
                        range[1] = max(range[1], newRange[1]);
                        break;
                    }
                }
                if (i === l)
                    ranges.push(newRange);
                return ranges;
            }
            var sortDirection = ascending;
            function rangeSorter(a, b) { return sortDirection(a[0], b[0]); }
            var set;
            try {
                set = ranges.reduce(addRange, []);
                set.sort(rangeSorter);
            }
            catch (ex) {
                return fail(this, INVALID_KEY_ARGUMENT);
            }
            var rangePos = 0;
            var keyIsBeyondCurrentEntry = includeUppers ?
                function (key) { return ascending(key, set[rangePos][1]) > 0; } :
                function (key) { return ascending(key, set[rangePos][1]) >= 0; };
            var keyIsBeforeCurrentEntry = includeLowers ?
                function (key) { return descending(key, set[rangePos][0]) > 0; } :
                function (key) { return descending(key, set[rangePos][0]) >= 0; };
            function keyWithinCurrentRange(key) {
                return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
            }
            var checkKey = keyIsBeyondCurrentEntry;
            var c = new this.Collection(this, function () { return createRange(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers); });
            c._ondirectionchange = function (direction) {
                if (direction === "next") {
                    checkKey = keyIsBeyondCurrentEntry;
                    sortDirection = ascending;
                }
                else {
                    checkKey = keyIsBeforeCurrentEntry;
                    sortDirection = descending;
                }
                set.sort(rangeSorter);
            };
            c._addAlgorithm(function (cursor, advance, resolve) {
                var key = cursor.key;
                while (checkKey(key)) {
                    ++rangePos;
                    if (rangePos === set.length) {
                        advance(resolve);
                        return false;
                    }
                }
                if (keyWithinCurrentRange(key)) {
                    return true;
                }
                else if (_this._cmp(key, set[rangePos][1]) === 0 || _this._cmp(key, set[rangePos][0]) === 0) {
                    return false;
                }
                else {
                    advance(function () {
                        if (sortDirection === ascending)
                            cursor.continue(set[rangePos][0]);
                        else
                            cursor.continue(set[rangePos][1]);
                    });
                    return false;
                }
            });
            return c;
        };
        WhereClause.prototype.startsWithAnyOf = function () {
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            if (!set.every(function (s) { return typeof s === 'string'; })) {
                return fail(this, "startsWithAnyOf() only works with strings");
            }
            if (set.length === 0)
                return emptyCollection(this);
            return this.inAnyRange(set.map(function (str) { return [str, str + maxString]; }));
        };
        return WhereClause;
    }());

    function createWhereClauseConstructor(db) {
        return makeClassConstructor(WhereClause.prototype, function WhereClause$$1(table, index, orCollection) {
            this.db = db;
            this._ctx = {
                table: table,
                index: index === ":id" ? null : index,
                or: orCollection
            };
            var indexedDB = db._deps.indexedDB;
            if (!indexedDB)
                throw new exceptions.MissingAPI("indexedDB API missing");
            this._cmp = this._ascending = indexedDB.cmp.bind(indexedDB);
            this._descending = function (a, b) { return indexedDB.cmp(b, a); };
            this._max = function (a, b) { return indexedDB.cmp(a, b) > 0 ? a : b; };
            this._min = function (a, b) { return indexedDB.cmp(a, b) < 0 ? a : b; };
            this._IDBKeyRange = db._deps.IDBKeyRange;
        });
    }

    function safariMultiStoreFix(storeNames) {
        return storeNames.length === 1 ? storeNames[0] : storeNames;
    }

    function getMaxKey(IdbKeyRange) {
        try {
            IdbKeyRange.only([[]]);
            return [[]];
        }
        catch (e) {
            return maxString;
        }
    }

    function eventRejectHandler(reject) {
        return wrap(function (event) {
            preventDefault(event);
            reject(event.target.error);
            return false;
        });
    }



    function preventDefault(event) {
        if (event.stopPropagation)
            event.stopPropagation();
        if (event.preventDefault)
            event.preventDefault();
    }

    var Transaction =               (function () {
        function Transaction() {
        }
        Transaction.prototype._lock = function () {
            assert(!PSD.global);
            ++this._reculock;
            if (this._reculock === 1 && !PSD.global)
                PSD.lockOwnerFor = this;
            return this;
        };
        Transaction.prototype._unlock = function () {
            assert(!PSD.global);
            if (--this._reculock === 0) {
                if (!PSD.global)
                    PSD.lockOwnerFor = null;
                while (this._blockedFuncs.length > 0 && !this._locked()) {
                    var fnAndPSD = this._blockedFuncs.shift();
                    try {
                        usePSD(fnAndPSD[1], fnAndPSD[0]);
                    }
                    catch (e) { }
                }
            }
            return this;
        };
        Transaction.prototype._locked = function () {
            return this._reculock && PSD.lockOwnerFor !== this;
        };
        Transaction.prototype.create = function (idbtrans) {
            var _this = this;
            if (!this.mode)
                return this;
            var idbdb = this.db.idbdb;
            var dbOpenError = this.db._state.dbOpenError;
            assert(!this.idbtrans);
            if (!idbtrans && !idbdb) {
                switch (dbOpenError && dbOpenError.name) {
                    case "DatabaseClosedError":
                        throw new exceptions.DatabaseClosed(dbOpenError);
                    case "MissingAPIError":
                        throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
                    default:
                        throw new exceptions.OpenFailed(dbOpenError);
                }
            }
            if (!this.active)
                throw new exceptions.TransactionInactive();
            assert(this._completion._state === null);
            idbtrans = this.idbtrans = idbtrans || idbdb.transaction(safariMultiStoreFix(this.storeNames), this.mode);
            idbtrans.onerror = wrap(function (ev) {
                preventDefault(ev);
                _this._reject(idbtrans.error);
            });
            idbtrans.onabort = wrap(function (ev) {
                preventDefault(ev);
                _this.active && _this._reject(new exceptions.Abort(idbtrans.error));
                _this.active = false;
                _this.on("abort").fire(ev);
            });
            idbtrans.oncomplete = wrap(function () {
                _this.active = false;
                _this._resolve();
            });
            return this;
        };
        Transaction.prototype._promise = function (mode, fn, bWriteLock) {
            var _this = this;
            if (mode === 'readwrite' && this.mode !== 'readwrite')
                return rejection(new exceptions.ReadOnly("Transaction is readonly"));
            if (!this.active)
                return rejection(new exceptions.TransactionInactive());
            if (this._locked()) {
                return new DexiePromise(function (resolve, reject) {
                    _this._blockedFuncs.push([function () {
                            _this._promise(mode, fn, bWriteLock).then(resolve, reject);
                        }, PSD]);
                });
            }
            else if (bWriteLock) {
                return newScope(function () {
                    var p = new DexiePromise(function (resolve, reject) {
                        _this._lock();
                        var rv = fn(resolve, reject, _this);
                        if (rv && rv.then)
                            rv.then(resolve, reject);
                    });
                    p.finally(function () { return _this._unlock(); });
                    p._lib = true;
                    return p;
                });
            }
            else {
                var p = new DexiePromise(function (resolve, reject) {
                    var rv = fn(resolve, reject, _this);
                    if (rv && rv.then)
                        rv.then(resolve, reject);
                });
                p._lib = true;
                return p;
            }
        };
        Transaction.prototype._root = function () {
            return this.parent ? this.parent._root() : this;
        };
        Transaction.prototype.waitFor = function (promiseLike) {
            var root = this._root();
            var promise = DexiePromise.resolve(promiseLike);
            if (root._waitingFor) {
                root._waitingFor = root._waitingFor.then(function () { return promise; });
            }
            else {
                root._waitingFor = promise;
                root._waitingQueue = [];
                var store = root.idbtrans.objectStore(root.storeNames[0]);
                (function spin() {
                    ++root._spinCount;
                    while (root._waitingQueue.length)
                        (root._waitingQueue.shift())();
                    if (root._waitingFor)
                        store.get(-Infinity).onsuccess = spin;
                }());
            }
            var currentWaitPromise = root._waitingFor;
            return new DexiePromise(function (resolve, reject) {
                promise.then(function (res) { return root._waitingQueue.push(wrap(resolve.bind(null, res))); }, function (err) { return root._waitingQueue.push(wrap(reject.bind(null, err))); }).finally(function () {
                    if (root._waitingFor === currentWaitPromise) {
                        root._waitingFor = null;
                    }
                });
            });
        };
        Transaction.prototype.abort = function () {
            this.active && this._reject(new exceptions.Abort());
            this.active = false;
        };
        Transaction.prototype.table = function (tableName) {
            var memoizedTables = (this._memoizedTables || (this._memoizedTables = {}));
            if (hasOwn(memoizedTables, tableName))
                return memoizedTables[tableName];
            var tableSchema = this.schema[tableName];
            if (!tableSchema) {
                throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
            }
            var transactionBoundTable = new this.db.Table(tableName, tableSchema, this);
            transactionBoundTable.core = this.db.core.table(tableName);
            memoizedTables[tableName] = transactionBoundTable;
            return transactionBoundTable;
        };
        return Transaction;
    }());

    function createTransactionConstructor(db) {
        return makeClassConstructor(Transaction.prototype, function Transaction$$1(mode, storeNames, dbschema, parent) {
            var _this = this;
            this.db = db;
            this.mode = mode;
            this.storeNames = storeNames;
            this.schema = dbschema;
            this.idbtrans = null;
            this.on = Events(this, "complete", "error", "abort");
            this.parent = parent || null;
            this.active = true;
            this._reculock = 0;
            this._blockedFuncs = [];
            this._resolve = null;
            this._reject = null;
            this._waitingFor = null;
            this._waitingQueue = null;
            this._spinCount = 0;
            this._completion = new DexiePromise(function (resolve, reject) {
                _this._resolve = resolve;
                _this._reject = reject;
            });
            this._completion.then(function () {
                _this.active = false;
                _this.on.complete.fire();
            }, function (e) {
                var wasActive = _this.active;
                _this.active = false;
                _this.on.error.fire(e);
                _this.parent ?
                    _this.parent._reject(e) :
                    wasActive && _this.idbtrans && _this.idbtrans.abort();
                return rejection(e);
            });
        });
    }

    function createIndexSpec(name, keyPath, unique, multi, auto, compound) {
        return {
            name: name,
            keyPath: keyPath,
            unique: unique,
            multi: multi,
            auto: auto,
            compound: compound,
            src: (unique ? '&' : '') + (multi ? '*' : '') + (auto ? "++" : "") + nameFromKeyPath(keyPath)
        };
    }
    function nameFromKeyPath(keyPath) {
        return typeof keyPath === 'string' ?
            keyPath :
            keyPath ? ('[' + [].join.call(keyPath, '+') + ']') : "";
    }

    function createTableSchema(name, primKey, indexes) {
        return {
            name: name,
            primKey: primKey,
            indexes: indexes,
            mappedClass: null,
            idxByName: arrayToObject(indexes, function (index) { return [index.name, index]; })
        };
    }

    function getKeyExtractor(keyPath) {
        if (keyPath == null) {
            return function () { return undefined; };
        }
        else if (typeof keyPath === 'string') {
            return getSinglePathKeyExtractor(keyPath);
        }
        else {
            return function (obj) { return getByKeyPath(obj, keyPath); };
        }
    }
    function getSinglePathKeyExtractor(keyPath) {
        var split = keyPath.split('.');
        if (split.length === 1) {
            return function (obj) { return obj[keyPath]; };
        }
        else {
            return function (obj) { return getByKeyPath(obj, keyPath); };
        }
    }

    function getEffectiveKeys(primaryKey, req) {
        if (req.type === 'delete')
            return req.keys;
        return req.keys || req.values.map(primaryKey.extractKey);
    }
    function getExistingValues(table, req, effectiveKeys) {
        return req.type === 'add' ? Promise.resolve(new Array(req.values.length)) :
            table.getMany({ trans: req.trans, keys: effectiveKeys });
    }

    function arrayify(arrayLike) {
        return [].slice.call(arrayLike);
    }

    var _id_counter = 0;
    function getKeyPathAlias(keyPath) {
        return keyPath == null ?
            ":id" :
            typeof keyPath === 'string' ?
                keyPath :
                "[" + keyPath.join('+') + "]";
    }
    function createDBCore(db, indexedDB, IdbKeyRange, tmpTrans) {
        var cmp = indexedDB.cmp.bind(indexedDB);
        function extractSchema(db, trans) {
            var tables = arrayify(db.objectStoreNames);
            return {
                schema: {
                    name: db.name,
                    tables: tables.map(function (table) { return trans.objectStore(table); }).map(function (store) {
                        var keyPath = store.keyPath, autoIncrement = store.autoIncrement;
                        var compound = isArray(keyPath);
                        var outbound = keyPath == null;
                        var indexByKeyPath = {};
                        var result = {
                            name: store.name,
                            primaryKey: {
                                name: null,
                                isPrimaryKey: true,
                                outbound: outbound,
                                compound: compound,
                                keyPath: keyPath,
                                autoIncrement: autoIncrement,
                                unique: true,
                                extractKey: getKeyExtractor(keyPath)
                            },
                            indexes: arrayify(store.indexNames).map(function (indexName) { return store.index(indexName); })
                                .map(function (index) {
                                var name = index.name, unique = index.unique, multiEntry = index.multiEntry, keyPath = index.keyPath;
                                var compound = isArray(keyPath);
                                var result = {
                                    name: name,
                                    compound: compound,
                                    keyPath: keyPath,
                                    unique: unique,
                                    multiEntry: multiEntry,
                                    extractKey: getKeyExtractor(keyPath)
                                };
                                indexByKeyPath[getKeyPathAlias(keyPath)] = result;
                                return result;
                            }),
                            getIndexByKeyPath: function (keyPath) { return indexByKeyPath[getKeyPathAlias(keyPath)]; }
                        };
                        indexByKeyPath[":id"] = result.primaryKey;
                        if (keyPath != null) {
                            indexByKeyPath[getKeyPathAlias(keyPath)] = result.primaryKey;
                        }
                        return result;
                    })
                },
                hasGetAll: tables.length > 0 && ('getAll' in trans.objectStore(tables[0])) &&
                    !(typeof navigator !== 'undefined' && /Safari/.test(navigator.userAgent) &&
                        !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
                        [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604)
            };
        }
        function makeIDBKeyRange(range) {
            if (range.type === 3          )
                return null;
            if (range.type === 4            )
                throw new Error("Cannot convert never type to IDBKeyRange");
            var lower = range.lower, upper = range.upper, lowerOpen = range.lowerOpen, upperOpen = range.upperOpen;
            var idbRange = lower === undefined ?
                upper === undefined ?
                    null :
                    IdbKeyRange.upperBound(upper, !!upperOpen) :
                upper === undefined ?
                    IdbKeyRange.lowerBound(lower, !!lowerOpen) :
                    IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
            return idbRange;
        }
        function createDbCoreTable(tableSchema) {
            var tableName = tableSchema.name;
            function mutate(_a) {
                var trans = _a.trans, type = _a.type, keys$$1 = _a.keys, values = _a.values, range = _a.range, wantResults = _a.wantResults;
                return new Promise(function (resolve, reject) {
                    resolve = wrap(resolve);
                    var store = trans.objectStore(tableName);
                    var outbound = store.keyPath == null;
                    var isAddOrPut = type === "put" || type === "add";
                    if (!isAddOrPut && type !== 'delete' && type !== 'deleteRange')
                        throw new Error("Invalid operation type: " + type);
                    var length = (keys$$1 || values || { length: 1 }).length;
                    if (keys$$1 && values && keys$$1.length !== values.length) {
                        throw new Error("Given keys array must have same length as given values array.");
                    }
                    if (length === 0)
                        return resolve({ numFailures: 0, failures: {}, results: [], lastResult: undefined });
                    var results = wantResults && (keys$$1 ?
                        keys$$1 :
                        getEffectiveKeys(tableSchema.primaryKey, { type: type, keys: keys$$1, values: values })).slice();
                    var req;
                    var failures = [];
                    var numFailures = 0;
                    var errorHandler = function (event) {
                        ++numFailures;
                        preventDefault(event);
                        if (results)
                            results[event.target._reqno] = undefined;
                        failures[event.target._reqno] = event.target.error;
                    };
                    var setResult = function (_a) {
                        var target = _a.target;
                        results[target._reqno] = target.result;
                    };
                    if (type === 'deleteRange') {
                        if (range.type === 4            )
                            return resolve({ numFailures: numFailures, failures: failures, results: results, lastResult: undefined });
                        if (range.type === 3          )
                            req = store.clear();
                        else
                            req = store.delete(makeIDBKeyRange(range));
                    }
                    else {
                        var _a = isAddOrPut ?
                            outbound ?
                                [values, keys$$1] :
                                [values, null] :
                            [keys$$1, null], args1 = _a[0], args2 = _a[1];
                        if (isAddOrPut) {
                            for (var i = 0; i < length; ++i) {
                                req = (args2 && args2[i] !== undefined ?
                                    store[type](args1[i], args2[i]) :
                                    store[type](args1[i]));
                                req._reqno = i;
                                if (results && results[i] === undefined) {
                                    req.onsuccess = setResult;
                                }
                                req.onerror = errorHandler;
                            }
                        }
                        else {
                            for (var i = 0; i < length; ++i) {
                                req = store[type](args1[i]);
                                req._reqno = i;
                                req.onerror = errorHandler;
                            }
                        }
                    }
                    var done = function (event) {
                        var lastResult = event.target.result;
                        if (results)
                            results[length - 1] = lastResult;
                        resolve({
                            numFailures: numFailures,
                            failures: failures,
                            results: results,
                            lastResult: lastResult
                        });
                    };
                    req.onerror = function (event) {
                        errorHandler(event);
                        done(event);
                    };
                    req.onsuccess = done;
                });
            }
            function openCursor(_a) {
                var trans = _a.trans, values = _a.values, query = _a.query, reverse = _a.reverse, unique = _a.unique;
                return new Promise(function (resolve, reject) {
                    resolve = wrap(resolve);
                    var index = query.index, range = query.range;
                    var store = trans.objectStore(tableName);
                    var source = index.isPrimaryKey ?
                        store :
                        store.index(index.name);
                    var direction = reverse ?
                        unique ?
                            "prevunique" :
                            "prev" :
                        unique ?
                            "nextunique" :
                            "next";
                    var req = values || !('openKeyCursor' in source) ?
                        source.openCursor(makeIDBKeyRange(range), direction) :
                        source.openKeyCursor(makeIDBKeyRange(range), direction);
                    req.onerror = eventRejectHandler(reject);
                    req.onsuccess = wrap(function (ev) {
                        var cursor = req.result;
                        if (!cursor) {
                            resolve(null);
                            return;
                        }
                        cursor.___id = ++_id_counter;
                        cursor.done = false;
                        var _cursorContinue = cursor.continue.bind(cursor);
                        var _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
                        if (_cursorContinuePrimaryKey)
                            _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
                        var _cursorAdvance = cursor.advance.bind(cursor);
                        var doThrowCursorIsNotStarted = function () { throw new Error("Cursor not started"); };
                        var doThrowCursorIsStopped = function () { throw new Error("Cursor not stopped"); };
                        cursor.trans = trans;
                        cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsNotStarted;
                        cursor.fail = wrap(reject);
                        cursor.next = function () {
                            var _this = this;
                            var gotOne = 1;
                            return this.start(function () { return gotOne-- ? _this.continue() : _this.stop(); }).then(function () { return _this; });
                        };
                        cursor.start = function (callback) {
                            var iterationPromise = new Promise(function (resolveIteration, rejectIteration) {
                                resolveIteration = wrap(resolveIteration);
                                req.onerror = eventRejectHandler(rejectIteration);
                                cursor.fail = rejectIteration;
                                cursor.stop = function (value) {
                                    cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsStopped;
                                    resolveIteration(value);
                                };
                            });
                            var guardedCallback = function () {
                                if (req.result) {
                                    try {
                                        callback();
                                    }
                                    catch (err) {
                                        cursor.fail(err);
                                    }
                                }
                                else {
                                    cursor.done = true;
                                    cursor.start = function () { throw new Error("Cursor behind last entry"); };
                                    cursor.stop();
                                }
                            };
                            req.onsuccess = wrap(function (ev) {
                                req.onsuccess = guardedCallback;
                                guardedCallback();
                            });
                            cursor.continue = _cursorContinue;
                            cursor.continuePrimaryKey = _cursorContinuePrimaryKey;
                            cursor.advance = _cursorAdvance;
                            guardedCallback();
                            return iterationPromise;
                        };
                        resolve(cursor);
                    }, reject);
                });
            }
            function query(hasGetAll) {
                return function (request) {
                    return new Promise(function (resolve, reject) {
                        resolve = wrap(resolve);
                        var trans = request.trans, values = request.values, limit = request.limit, query = request.query;
                        var nonInfinitLimit = limit === Infinity ? undefined : limit;
                        var index = query.index, range = query.range;
                        var store = trans.objectStore(tableName);
                        var source = index.isPrimaryKey ? store : store.index(index.name);
                        var idbKeyRange = makeIDBKeyRange(range);
                        if (limit === 0)
                            return resolve({ result: [] });
                        if (hasGetAll) {
                            var req = values ?
                                source.getAll(idbKeyRange, nonInfinitLimit) :
                                source.getAllKeys(idbKeyRange, nonInfinitLimit);
                            req.onsuccess = function (event) { return resolve({ result: event.target.result }); };
                            req.onerror = eventRejectHandler(reject);
                        }
                        else {
                            var count_1 = 0;
                            var req_1 = values || !('openKeyCursor' in source) ?
                                source.openCursor(idbKeyRange) :
                                source.openKeyCursor(idbKeyRange);
                            var result_1 = [];
                            req_1.onsuccess = function (event) {
                                var cursor = req_1.result;
                                if (!cursor)
                                    return resolve({ result: result_1 });
                                result_1.push(values ? cursor.value : cursor.primaryKey);
                                if (++count_1 === limit)
                                    return resolve({ result: result_1 });
                                cursor.continue();
                            };
                            req_1.onerror = eventRejectHandler(reject);
                        }
                    });
                };
            }
            return {
                name: tableName,
                schema: tableSchema,
                mutate: mutate,
                getMany: function (_a) {
                    var trans = _a.trans, keys$$1 = _a.keys;
                    return new Promise(function (resolve, reject) {
                        resolve = wrap(resolve);
                        var store = trans.objectStore(tableName);
                        var length = keys$$1.length;
                        var result = new Array(length);
                        var keyCount = 0;
                        var callbackCount = 0;
                        var req;
                        var successHandler = function (event) {
                            var req = event.target;
                            if ((result[req._pos] = req.result) != null)
                                ;
                            if (++callbackCount === keyCount)
                                resolve(result);
                        };
                        var errorHandler = eventRejectHandler(reject);
                        for (var i = 0; i < length; ++i) {
                            var key = keys$$1[i];
                            if (key != null) {
                                req = store.get(keys$$1[i]);
                                req._pos = i;
                                req.onsuccess = successHandler;
                                req.onerror = errorHandler;
                                ++keyCount;
                            }
                        }
                        if (keyCount === 0)
                            resolve(result);
                    });
                },
                get: function (_a) {
                    var trans = _a.trans, key = _a.key;
                    return new Promise(function (resolve, reject) {
                        resolve = wrap(resolve);
                        var store = trans.objectStore(tableName);
                        var req = store.get(key);
                        req.onsuccess = function (event) { return resolve(event.target.result); };
                        req.onerror = eventRejectHandler(reject);
                    });
                },
                query: query(hasGetAll),
                openCursor: openCursor,
                count: function (_a) {
                    var query = _a.query, trans = _a.trans;
                    var index = query.index, range = query.range;
                    return new Promise(function (resolve, reject) {
                        var store = trans.objectStore(tableName);
                        var source = index.isPrimaryKey ? store : store.index(index.name);
                        var idbKeyRange = makeIDBKeyRange(range);
                        var req = idbKeyRange ? source.count(idbKeyRange) : source.count();
                        req.onsuccess = wrap(function (ev) { return resolve(ev.target.result); });
                        req.onerror = eventRejectHandler(reject);
                    });
                }
            };
        }
        var _a = extractSchema(db, tmpTrans), schema = _a.schema, hasGetAll = _a.hasGetAll;
        var tables = schema.tables.map(function (tableSchema) { return createDbCoreTable(tableSchema); });
        var tableMap = {};
        tables.forEach(function (table) { return tableMap[table.name] = table; });
        return {
            stack: "dbcore",
            transaction: db.transaction.bind(db),
            table: function (name) {
                var result = tableMap[name];
                if (!result)
                    throw new Error("Table '" + name + "' not found");
                return tableMap[name];
            },
            cmp: cmp,
            MIN_KEY: -Infinity,
            MAX_KEY: getMaxKey(IdbKeyRange),
            schema: schema
        };
    }

    function createMiddlewareStack(stackImpl, middlewares) {
        return middlewares.reduce(function (down, _a) {
            var create = _a.create;
            return (__assign({}, down, create(down)));
        }, stackImpl);
    }
    function createMiddlewareStacks(middlewares, idbdb, _a, tmpTrans) {
        var IDBKeyRange = _a.IDBKeyRange, indexedDB = _a.indexedDB;
        var dbcore = createMiddlewareStack(createDBCore(idbdb, indexedDB, IDBKeyRange, tmpTrans), middlewares.dbcore);
        return {
            dbcore: dbcore
        };
    }
    function generateMiddlewareStacks(db, tmpTrans) {
        var idbdb = tmpTrans.db;
        var stacks = createMiddlewareStacks(db._middlewares, idbdb, db._deps, tmpTrans);
        db.core = stacks.dbcore;
        db.tables.forEach(function (table) {
            var tableName = table.name;
            if (db.core.schema.tables.some(function (tbl) { return tbl.name === tableName; })) {
                table.core = db.core.table(tableName);
                if (db[tableName] instanceof db.Table) {
                    db[tableName].core = table.core;
                }
            }
        });
    }

    function setApiOnPlace(db, objs, tableNames, dbschema) {
        tableNames.forEach(function (tableName) {
            var schema = dbschema[tableName];
            objs.forEach(function (obj) {
                if (!(tableName in obj)) {
                    if (obj === db.Transaction.prototype || obj instanceof db.Transaction) {
                        setProp(obj, tableName, { get: function () { return this.table(tableName); } });
                    }
                    else {
                        obj[tableName] = new db.Table(tableName, schema);
                    }
                }
            });
        });
    }
    function removeTablesApi(db, objs) {
        objs.forEach(function (obj) {
            for (var key in obj) {
                if (obj[key] instanceof db.Table)
                    delete obj[key];
            }
        });
    }
    function lowerVersionFirst(a, b) {
        return a._cfg.version - b._cfg.version;
    }
    function runUpgraders(db, oldVersion, idbUpgradeTrans, reject) {
        var globalSchema = db._dbSchema;
        var trans = db._createTransaction('readwrite', db._storeNames, globalSchema);
        trans.create(idbUpgradeTrans);
        trans._completion.catch(reject);
        var rejectTransaction = trans._reject.bind(trans);
        var transless = PSD.transless || PSD;
        newScope(function () {
            PSD.trans = trans;
            PSD.transless = transless;
            if (oldVersion === 0) {
                keys(globalSchema).forEach(function (tableName) {
                    createTable(idbUpgradeTrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
                });
                generateMiddlewareStacks(db, idbUpgradeTrans);
                DexiePromise.follow(function () { return db.on.populate.fire(trans); }).catch(rejectTransaction);
            }
            else
                updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans).catch(rejectTransaction);
        });
    }
    function updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans) {
        var queue = [];
        var versions = db._versions;
        var oldVersionStruct = versions.filter(function (version) { return version._cfg.version === oldVersion; })[0];
        if (!oldVersionStruct)
            throw new exceptions.Upgrade("Dexie specification of currently installed DB version is missing");
        var globalSchema = db._dbSchema = oldVersionStruct._cfg.dbschema;
        var anyContentUpgraderHasRun = false;
        var versToRun = versions.filter(function (v) { return v._cfg.version > oldVersion; });
        versToRun.forEach(function (version) {
            queue.push(function () {
                var oldSchema = globalSchema;
                var newSchema = version._cfg.dbschema;
                adjustToExistingIndexNames(db, oldSchema, idbUpgradeTrans);
                adjustToExistingIndexNames(db, newSchema, idbUpgradeTrans);
                globalSchema = db._dbSchema = newSchema;
                var diff = getSchemaDiff(oldSchema, newSchema);
                diff.add.forEach(function (tuple) {
                    createTable(idbUpgradeTrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
                });
                diff.change.forEach(function (change) {
                    if (change.recreate) {
                        throw new exceptions.Upgrade("Not yet support for changing primary key");
                    }
                    else {
                        var store_1 = idbUpgradeTrans.objectStore(change.name);
                        change.add.forEach(function (idx) { return addIndex(store_1, idx); });
                        change.change.forEach(function (idx) {
                            store_1.deleteIndex(idx.name);
                            addIndex(store_1, idx);
                        });
                        change.del.forEach(function (idxName) { return store_1.deleteIndex(idxName); });
                    }
                });
                var contentUpgrade = version._cfg.contentUpgrade;
                if (contentUpgrade) {
                    generateMiddlewareStacks(db, idbUpgradeTrans);
                    anyContentUpgraderHasRun = true;
                    var upgradeSchema_1 = shallowClone(newSchema);
                    diff.del.forEach(function (table) {
                        upgradeSchema_1[table] = oldSchema[table];
                    });
                    removeTablesApi(db, [db.Transaction.prototype]);
                    setApiOnPlace(db, [db.Transaction.prototype], keys(upgradeSchema_1), upgradeSchema_1);
                    trans.schema = upgradeSchema_1;
                    incrementExpectedAwaits();
                    var returnValue_1;
                    var promiseFollowed = DexiePromise.follow(function () {
                        returnValue_1 = contentUpgrade(trans);
                        if (returnValue_1) {
                            if (returnValue_1.constructor === NativePromise) {
                                var decrementor = decrementExpectedAwaits.bind(null, null);
                                returnValue_1.then(decrementor, decrementor);
                            }
                            else {
                                decrementExpectedAwaits();
                            }
                        }
                        else {
                            decrementExpectedAwaits();
                        }
                    });
                    return (returnValue_1 && typeof returnValue_1.then === 'function' ?
                        DexiePromise.resolve(returnValue_1) : promiseFollowed.then(function () { return returnValue_1; }));
                }
            });
            queue.push(function (idbtrans) {
                if (!anyContentUpgraderHasRun || !hasIEDeleteObjectStoreBug) {
                    var newSchema = version._cfg.dbschema;
                    deleteRemovedTables(newSchema, idbtrans);
                }
                removeTablesApi(db, [db.Transaction.prototype]);
                setApiOnPlace(db, [db.Transaction.prototype], db._storeNames, db._dbSchema);
                trans.schema = db._dbSchema;
            });
        });
        function runQueue() {
            return queue.length ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) :
                DexiePromise.resolve();
        }
        return runQueue().then(function () {
            createMissingTables(globalSchema, idbUpgradeTrans);
        });
    }
    function getSchemaDiff(oldSchema, newSchema) {
        var diff = {
            del: [],
            add: [],
            change: []
        };
        var table;
        for (table in oldSchema) {
            if (!newSchema[table])
                diff.del.push(table);
        }
        for (table in newSchema) {
            var oldDef = oldSchema[table], newDef = newSchema[table];
            if (!oldDef) {
                diff.add.push([table, newDef]);
            }
            else {
                var change = {
                    name: table,
                    def: newDef,
                    recreate: false,
                    del: [],
                    add: [],
                    change: []
                };
                if (oldDef.primKey.src !== newDef.primKey.src) {
                    change.recreate = true;
                    diff.change.push(change);
                }
                else {
                    var oldIndexes = oldDef.idxByName;
                    var newIndexes = newDef.idxByName;
                    var idxName = void 0;
                    for (idxName in oldIndexes) {
                        if (!newIndexes[idxName])
                            change.del.push(idxName);
                    }
                    for (idxName in newIndexes) {
                        var oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
                        if (!oldIdx)
                            change.add.push(newIdx);
                        else if (oldIdx.src !== newIdx.src)
                            change.change.push(newIdx);
                    }
                    if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
                        diff.change.push(change);
                    }
                }
            }
        }
        return diff;
    }
    function createTable(idbtrans, tableName, primKey, indexes) {
        var store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ?
            { keyPath: primKey.keyPath, autoIncrement: primKey.auto } :
            { autoIncrement: primKey.auto });
        indexes.forEach(function (idx) { return addIndex(store, idx); });
        return store;
    }
    function createMissingTables(newSchema, idbtrans) {
        keys(newSchema).forEach(function (tableName) {
            if (!idbtrans.db.objectStoreNames.contains(tableName)) {
                createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
            }
        });
    }
    function deleteRemovedTables(newSchema, idbtrans) {
        for (var i = 0; i < idbtrans.db.objectStoreNames.length; ++i) {
            var storeName = idbtrans.db.objectStoreNames[i];
            if (newSchema[storeName] == null) {
                idbtrans.db.deleteObjectStore(storeName);
            }
        }
    }
    function addIndex(store, idx) {
        store.createIndex(idx.name, idx.keyPath, { unique: idx.unique, multiEntry: idx.multi });
    }
    function readGlobalSchema(db, idbdb, tmpTrans) {
        db.verno = idbdb.version / 10;
        var globalSchema = db._dbSchema = {};
        var dbStoreNames = db._storeNames = slice(idbdb.objectStoreNames, 0);
        if (dbStoreNames.length === 0)
            return;
        dbStoreNames.forEach(function (storeName) {
            var store = tmpTrans.objectStore(storeName);
            var keyPath = store.keyPath;
            var primKey = createIndexSpec(nameFromKeyPath(keyPath), keyPath || "", false, false, !!store.autoIncrement, keyPath && typeof keyPath !== 'string');
            var indexes = [];
            for (var j = 0; j < store.indexNames.length; ++j) {
                var idbindex = store.index(store.indexNames[j]);
                keyPath = idbindex.keyPath;
                var index = createIndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== 'string');
                indexes.push(index);
            }
            globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
        });
        setApiOnPlace(db, [db._allTables], keys(globalSchema), globalSchema);
    }
    function adjustToExistingIndexNames(db, schema, idbtrans) {
        var storeNames = idbtrans.db.objectStoreNames;
        for (var i = 0; i < storeNames.length; ++i) {
            var storeName = storeNames[i];
            var store = idbtrans.objectStore(storeName);
            db._hasGetAll = 'getAll' in store;
            for (var j = 0; j < store.indexNames.length; ++j) {
                var indexName = store.indexNames[j];
                var keyPath = store.index(indexName).keyPath;
                var dexieName = typeof keyPath === 'string' ? keyPath : "[" + slice(keyPath).join('+') + "]";
                if (schema[storeName]) {
                    var indexSpec = schema[storeName].idxByName[dexieName];
                    if (indexSpec)
                        indexSpec.name = indexName;
                }
            }
        }
        if (typeof navigator !== 'undefined' && /Safari/.test(navigator.userAgent) &&
            !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
            _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope &&
            [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
            db._hasGetAll = false;
        }
    }
    function parseIndexSyntax(indexes) {
        var rv = [];
        indexes.split(',').forEach(function (index) {
            index = index.trim();
            var name = index.replace(/([&*]|\+\+)/g, "");
            var keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split('+') : name;
            rv.push(createIndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray(keyPath)));
        });
        return rv;
    }

    var Version =               (function () {
        function Version() {
        }
        Version.prototype._parseStoresSpec = function (stores, outSchema) {
            keys(stores).forEach(function (tableName) {
                if (stores[tableName] !== null) {
                    var indexes = parseIndexSyntax(stores[tableName]);
                    var primKey = indexes.shift();
                    if (primKey.multi)
                        throw new exceptions.Schema("Primary key cannot be multi-valued");
                    indexes.forEach(function (idx) {
                        if (idx.auto)
                            throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
                        if (!idx.keyPath)
                            throw new exceptions.Schema("Index must have a name and cannot be an empty string");
                    });
                    outSchema[tableName] = createTableSchema(tableName, primKey, indexes);
                }
            });
        };
        Version.prototype.stores = function (stores) {
            var db = this.db;
            this._cfg.storesSource = this._cfg.storesSource ?
                extend(this._cfg.storesSource, stores) :
                stores;
            var versions = db._versions;
            var storesSpec = {};
            var dbschema = {};
            versions.forEach(function (version) {
                extend(storesSpec, version._cfg.storesSource);
                dbschema = (version._cfg.dbschema = {});
                version._parseStoresSpec(storesSpec, dbschema);
            });
            db._dbSchema = dbschema;
            removeTablesApi(db, [db._allTables, db, db.Transaction.prototype]);
            setApiOnPlace(db, [db._allTables, db, db.Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
            db._storeNames = keys(dbschema);
            return this;
        };
        Version.prototype.upgrade = function (upgradeFunction) {
            this._cfg.contentUpgrade = upgradeFunction;
            return this;
        };
        return Version;
    }());

    function createVersionConstructor(db) {
        return makeClassConstructor(Version.prototype, function Version$$1(versionNumber) {
            this.db = db;
            this._cfg = {
                version: versionNumber,
                storesSource: null,
                dbschema: {},
                tables: {},
                contentUpgrade: null
            };
        });
    }

    var databaseEnumerator;
    function DatabaseEnumerator(indexedDB) {
        var getDatabaseNamesNative = indexedDB && (indexedDB.getDatabaseNames || indexedDB.webkitGetDatabaseNames);
        var dbNamesTable;
        if (!getDatabaseNamesNative) {
            var db = new Dexie(DBNAMES_DB, { addons: [] });
            db.version(1).stores({ dbnames: 'name' });
            dbNamesTable = db.table('dbnames');
        }
        return {
            getDatabaseNames: function () {
                return getDatabaseNamesNative ? new DexiePromise(function (resolve, reject) {
                    var req = getDatabaseNamesNative.call(indexedDB);
                    req.onsuccess = function (event) { return resolve(slice(event.target.result, 0)); };
                    req.onerror = eventRejectHandler(reject);
                }) : dbNamesTable.toCollection().primaryKeys();
            },
            add: function (name) {
                return !getDatabaseNamesNative && name !== DBNAMES_DB && dbNamesTable.put({ name: name }).catch(nop);
            },
            remove: function (name) {
                return !getDatabaseNamesNative && name !== DBNAMES_DB && dbNamesTable.delete(name).catch(nop);
            }
        };
    }
    function initDatabaseEnumerator(indexedDB) {
        try {
            databaseEnumerator = DatabaseEnumerator(indexedDB);
        }
        catch (e) { }
    }

    function vip(fn) {
        return newScope(function () {
            PSD.letThrough = true;
            return fn();
        });
    }

    function dexieOpen(db) {
        var state = db._state;
        var indexedDB = db._deps.indexedDB;
        if (state.isBeingOpened || db.idbdb)
            return state.dbReadyPromise.then(function () { return state.dbOpenError ?
                rejection(state.dbOpenError) :
                db; });
        debug && (state.openCanceller._stackHolder = getErrorWithStack());
        state.isBeingOpened = true;
        state.dbOpenError = null;
        state.openComplete = false;
        var resolveDbReady = state.dbReadyResolve,
        upgradeTransaction = null;
        return DexiePromise.race([state.openCanceller, new DexiePromise(function (resolve, reject) {
                if (!indexedDB)
                    throw new exceptions.MissingAPI("indexedDB API not found. If using IE10+, make sure to run your code on a server URL " +
                        "(not locally). If using old Safari versions, make sure to include indexedDB polyfill.");
                var dbName = db.name;
                var req = state.autoSchema ?
                    indexedDB.open(dbName) :
                    indexedDB.open(dbName, Math.round(db.verno * 10));
                if (!req)
                    throw new exceptions.MissingAPI("IndexedDB API not available");
                req.onerror = eventRejectHandler(reject);
                req.onblocked = wrap(db._fireOnBlocked);
                req.onupgradeneeded = wrap(function (e) {
                    upgradeTransaction = req.transaction;
                    if (state.autoSchema && !db._options.allowEmptyDB) {
                        req.onerror = preventDefault;
                        upgradeTransaction.abort();
                        req.result.close();
                        var delreq = indexedDB.deleteDatabase(dbName);
                        delreq.onsuccess = delreq.onerror = wrap(function () {
                            reject(new exceptions.NoSuchDatabase("Database " + dbName + " doesnt exist"));
                        });
                    }
                    else {
                        upgradeTransaction.onerror = eventRejectHandler(reject);
                        var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
                        runUpgraders(db, oldVer / 10, upgradeTransaction, reject);
                    }
                }, reject);
                req.onsuccess = wrap(function () {
                    upgradeTransaction = null;
                    var idbdb = db.idbdb = req.result;
                    var objectStoreNames = slice(idbdb.objectStoreNames);
                    if (objectStoreNames.length > 0)
                        try {
                            var tmpTrans = idbdb.transaction(safariMultiStoreFix(objectStoreNames), 'readonly');
                            if (state.autoSchema)
                                readGlobalSchema(db, idbdb, tmpTrans);
                            else
                                adjustToExistingIndexNames(db, db._dbSchema, tmpTrans);
                            generateMiddlewareStacks(db, tmpTrans);
                        }
                        catch (e) {
                        }
                    connections.push(db);
                    idbdb.onversionchange = wrap(function (ev) {
                        state.vcFired = true;
                        db.on("versionchange").fire(ev);
                    });
                    databaseEnumerator.add(dbName);
                    resolve();
                }, reject);
            })]).then(function () {
            state.onReadyBeingFired = [];
            return DexiePromise.resolve(vip(db.on.ready.fire)).then(function fireRemainders() {
                if (state.onReadyBeingFired.length > 0) {
                    var remainders = state.onReadyBeingFired.reduce(promisableChain, nop);
                    state.onReadyBeingFired = [];
                    return DexiePromise.resolve(vip(remainders)).then(fireRemainders);
                }
            });
        }).finally(function () {
            state.onReadyBeingFired = null;
        }).then(function () {
            state.isBeingOpened = false;
            return db;
        }).catch(function (err) {
            try {
                upgradeTransaction && upgradeTransaction.abort();
            }
            catch (e) { }
            state.isBeingOpened = false;
            db.close();
            state.dbOpenError = err;
            return rejection(state.dbOpenError);
        }).finally(function () {
            state.openComplete = true;
            resolveDbReady();
        });
    }

    function awaitIterator(iterator) {
        var callNext = function (result) { return iterator.next(result); }, doThrow = function (error) { return iterator.throw(error); }, onSuccess = step(callNext), onError = step(doThrow);
        function step(getNext) {
            return function (val) {
                var next = getNext(val), value = next.value;
                return next.done ? value :
                    (!value || typeof value.then !== 'function' ?
                        isArray(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) :
                        value.then(onSuccess, onError));
            };
        }
        return step(callNext)();
    }

    function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
        var i = arguments.length;
        if (i < 2)
            throw new exceptions.InvalidArgument("Too few arguments");
        var args = new Array(i - 1);
        while (--i)
            args[i - 1] = arguments[i];
        scopeFunc = args.pop();
        var tables = flatten(args);
        return [mode, tables, scopeFunc];
    }
    function enterTransactionScope(db, mode, storeNames, parentTransaction, scopeFunc) {
        return DexiePromise.resolve().then(function () {
            var transless = PSD.transless || PSD;
            var trans = db._createTransaction(mode, storeNames, db._dbSchema, parentTransaction);
            var zoneProps = {
                trans: trans,
                transless: transless
            };
            if (parentTransaction) {
                trans.idbtrans = parentTransaction.idbtrans;
            }
            else {
                trans.create();
            }
            incrementExpectedAwaits();
            var returnValue;
            var promiseFollowed = DexiePromise.follow(function () {
                returnValue = scopeFunc.call(trans, trans);
                if (returnValue) {
                    if (returnValue.constructor === NativePromise) {
                        var decrementor = decrementExpectedAwaits.bind(null, null);
                        returnValue.then(decrementor, decrementor);
                    }
                    else {
                        decrementExpectedAwaits();
                        if (typeof returnValue.next === 'function' && typeof returnValue.throw === 'function') {
                            returnValue = awaitIterator(returnValue);
                        }
                    }
                }
                else {
                    decrementExpectedAwaits();
                }
            }, zoneProps);
            return (returnValue && typeof returnValue.then === 'function' ?
                DexiePromise.resolve(returnValue).then(function (x) { return trans.active ?
                    x
                    : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn")); })
                : promiseFollowed.then(function () { return returnValue; })).then(function (x) {
                if (parentTransaction)
                    trans._resolve();
                return trans._completion.then(function () { return x; });
            }).catch(function (e) {
                trans._reject(e);
                return rejection(e);
            });
        });
    }

    function pad(a, value, count) {
        var result = isArray(a) ? a.slice() : [a];
        for (var i = 0; i < count; ++i)
            result.push(value);
        return result;
    }
    function createVirtualIndexMiddleware(down) {
        return __assign({}, down, { table: function (tableName) {
                var table = down.table(tableName);
                var schema = table.schema;
                var indexLookup = {};
                var allVirtualIndexes = [];
                function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
                    var keyPathAlias = getKeyPathAlias(keyPath);
                    var indexList = (indexLookup[keyPathAlias] = indexLookup[keyPathAlias] || []);
                    var keyLength = keyPath == null ? 0 : typeof keyPath === 'string' ? 1 : keyPath.length;
                    var isVirtual = keyTail > 0;
                    var virtualIndex = __assign({}, lowLevelIndex, { isVirtual: isVirtual, isPrimaryKey: !isVirtual && lowLevelIndex.isPrimaryKey, keyTail: keyTail,
                        keyLength: keyLength, extractKey: getKeyExtractor(keyPath), unique: !isVirtual && lowLevelIndex.unique });
                    indexList.push(virtualIndex);
                    if (!virtualIndex.isPrimaryKey) {
                        allVirtualIndexes.push(virtualIndex);
                    }
                    if (keyLength > 1) {
                        var virtualKeyPath = keyLength === 2 ?
                            keyPath[0] :
                            keyPath.slice(0, keyLength - 1);
                        addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
                    }
                    indexList.sort(function (a, b) { return a.keyTail - b.keyTail; });
                    return virtualIndex;
                }
                var primaryKey = addVirtualIndexes(schema.primaryKey.keyPath, 0, schema.primaryKey);
                indexLookup[":id"] = [primaryKey];
                for (var _i = 0, _a = schema.indexes; _i < _a.length; _i++) {
                    var index = _a[_i];
                    addVirtualIndexes(index.keyPath, 0, index);
                }
                function findBestIndex(keyPath) {
                    var result = indexLookup[getKeyPathAlias(keyPath)];
                    return result && result[0];
                }
                function translateRange(range, keyTail) {
                    return {
                        type: range.type === 1             ?
                            2             :
                            range.type,
                        lower: pad(range.lower, range.lowerOpen ? down.MAX_KEY : down.MIN_KEY, keyTail),
                        lowerOpen: true,
                        upper: pad(range.upper, range.upperOpen ? down.MIN_KEY : down.MAX_KEY, keyTail),
                        upperOpen: true
                    };
                }
                function translateRequest(req) {
                    var index = req.query.index;
                    return index.isVirtual ? __assign({}, req, { query: {
                            index: index,
                            range: translateRange(req.query.range, index.keyTail)
                        } }) : req;
                }
                var result = __assign({}, table, { schema: __assign({}, schema, { primaryKey: primaryKey, indexes: allVirtualIndexes, getIndexByKeyPath: findBestIndex }), count: function (req) {
                        return table.count(translateRequest(req));
                    },
                    query: function (req) {
                        return table.query(translateRequest(req));
                    },
                    openCursor: function (req) {
                        var _a = req.query.index, keyTail = _a.keyTail, isVirtual = _a.isVirtual, keyLength = _a.keyLength;
                        if (!isVirtual)
                            return table.openCursor(req);
                        function createVirtualCursor(cursor) {
                            function _continue(key) {
                                key != null ?
                                    cursor.continue(pad(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)) :
                                    req.unique ?
                                        cursor.continue(pad(cursor.key, req.reverse ? down.MIN_KEY : down.MAX_KEY, keyTail)) :
                                        cursor.continue();
                            }
                            var virtualCursor = Object.create(cursor, {
                                continue: { value: _continue },
                                continuePrimaryKey: {
                                    value: function (key, primaryKey) {
                                        cursor.continuePrimaryKey(pad(key, down.MAX_KEY, keyTail), primaryKey);
                                    }
                                },
                                key: {
                                    get: function () {
                                        var key = cursor.key;
                                        return keyLength === 1 ?
                                            key[0] :
                                            key.slice(0, keyLength);
                                    }
                                },
                                value: {
                                    get: function () {
                                        return cursor.value;
                                    }
                                }
                            });
                            return virtualCursor;
                        }
                        return table.openCursor(translateRequest(req))
                            .then(function (cursor) { return cursor && createVirtualCursor(cursor); });
                    } });
                return result;
            } });
    }
    var virtualIndexMiddleware = {
        stack: "dbcore",
        name: "VirtualIndexMiddleware",
        level: 1,
        create: createVirtualIndexMiddleware
    };

    var hooksMiddleware = {
        stack: "dbcore",
        name: "HooksMiddleware",
        level: 2,
        create: function (downCore) { return (__assign({}, downCore, { table: function (tableName) {
                var downTable = downCore.table(tableName);
                var primaryKey = downTable.schema.primaryKey;
                var tableMiddleware = __assign({}, downTable, { mutate: function (req) {
                        var dxTrans = PSD.trans;
                        var _a = dxTrans.table(tableName).hook, deleting = _a.deleting, creating = _a.creating, updating = _a.updating;
                        switch (req.type) {
                            case 'add':
                                if (creating.fire === nop)
                                    break;
                                return dxTrans._promise('readwrite', function () { return addPutOrDelete(req); }, true);
                            case 'put':
                                if (creating.fire === nop && updating.fire === nop)
                                    break;
                                return dxTrans._promise('readwrite', function () { return addPutOrDelete(req); }, true);
                            case 'delete':
                                if (deleting.fire === nop)
                                    break;
                                return dxTrans._promise('readwrite', function () { return addPutOrDelete(req); }, true);
                            case 'deleteRange':
                                if (deleting.fire === nop)
                                    break;
                                return dxTrans._promise('readwrite', function () { return deleteRange(req); }, true);
                        }
                        return downTable.mutate(req);
                        function addPutOrDelete(req) {
                            var dxTrans = PSD.trans;
                            var keys$$1 = req.keys || getEffectiveKeys(primaryKey, req);
                            if (!keys$$1)
                                throw new Error("Keys missing");
                            req = req.type === 'add' || req.type === 'put' ? __assign({}, req, { keys: keys$$1, wantResults: true }) :
                             __assign({}, req);
                            if (req.type !== 'delete')
                                req.values = req.values.slice();
                            if (req.keys)
                                req.keys = req.keys.slice();
                            return getExistingValues(downTable, req, keys$$1).then(function (existingValues) {
                                var contexts = keys$$1.map(function (key, i) {
                                    var existingValue = existingValues[i];
                                    var ctx = { onerror: null, onsuccess: null };
                                    if (req.type === 'delete') {
                                        deleting.fire.call(ctx, key, existingValue, dxTrans);
                                    }
                                    else if (req.type === 'add' || existingValue === undefined) {
                                        var generatedPrimaryKey = creating.fire.call(ctx, key, req.values[i], dxTrans);
                                        if (key == null && generatedPrimaryKey != null) {
                                            key = generatedPrimaryKey;
                                            req.keys[i] = key;
                                            if (!primaryKey.outbound) {
                                                setByKeyPath(req.values[i], primaryKey.keyPath, key);
                                            }
                                        }
                                    }
                                    else {
                                        var objectDiff = getObjectDiff(existingValue, req.values[i]);
                                        var additionalChanges_1 = updating.fire.call(ctx, objectDiff, key, existingValue, dxTrans);
                                        if (additionalChanges_1) {
                                            var requestedValue_1 = req.values[i];
                                            Object.keys(additionalChanges_1).forEach(function (keyPath) {
                                                setByKeyPath(requestedValue_1, keyPath, additionalChanges_1[keyPath]);
                                            });
                                        }
                                    }
                                    return ctx;
                                });
                                return downTable.mutate(req).then(function (_a) {
                                    var failures = _a.failures, results = _a.results, numFailures = _a.numFailures, lastResult = _a.lastResult;
                                    for (var i = 0; i < keys$$1.length; ++i) {
                                        var primKey = results ? results[i] : keys$$1[i];
                                        var ctx = contexts[i];
                                        if (primKey == null) {
                                            ctx.onerror && ctx.onerror(failures[i]);
                                        }
                                        else {
                                            ctx.onsuccess && ctx.onsuccess(req.type === 'put' && existingValues[i] ?
                                                req.values[i] :
                                                primKey
                                            );
                                        }
                                    }
                                    return { failures: failures, results: results, numFailures: numFailures, lastResult: lastResult };
                                }).catch(function (error) {
                                    contexts.forEach(function (ctx) { return ctx.onerror && ctx.onerror(error); });
                                    return Promise.reject(error);
                                });
                            });
                        }
                        function deleteRange(req) {
                            return deleteNextChunk(req.trans, req.range, 10000);
                        }
                        function deleteNextChunk(trans, range, limit) {
                            return downTable.query({ trans: trans, values: false, query: { index: primaryKey, range: range }, limit: limit })
                                .then(function (_a) {
                                var result = _a.result;
                                return addPutOrDelete({ type: 'delete', keys: result, trans: trans }).then(function (res) {
                                    if (res.numFailures > 0)
                                        return Promise.reject(res.failures[0]);
                                    if (result.length < limit) {
                                        return { failures: [], numFailures: 0, lastResult: undefined };
                                    }
                                    else {
                                        return deleteNextChunk(trans, __assign({}, range, { lower: result[result.length - 1], lowerOpen: true }), limit);
                                    }
                                });
                            });
                        }
                    } });
                return tableMiddleware;
            } })); }
    };

    var Dexie =               (function () {
        function Dexie(name, options) {
            var _this = this;
            this._middlewares = {};
            this.verno = 0;
            var deps = Dexie.dependencies;
            this._options = options = __assign({
                addons: Dexie.addons, autoOpen: true,
                indexedDB: deps.indexedDB, IDBKeyRange: deps.IDBKeyRange }, options);
            this._deps = {
                indexedDB: options.indexedDB,
                IDBKeyRange: options.IDBKeyRange
            };
            var addons = options.addons;
            this._dbSchema = {};
            this._versions = [];
            this._storeNames = [];
            this._allTables = {};
            this.idbdb = null;
            var state = {
                dbOpenError: null,
                isBeingOpened: false,
                onReadyBeingFired: null,
                openComplete: false,
                dbReadyResolve: nop,
                dbReadyPromise: null,
                cancelOpen: nop,
                openCanceller: null,
                autoSchema: true
            };
            state.dbReadyPromise = new DexiePromise(function (resolve) {
                state.dbReadyResolve = resolve;
            });
            state.openCanceller = new DexiePromise(function (_, reject) {
                state.cancelOpen = reject;
            });
            this._state = state;
            this.name = name;
            this.on = Events(this, "populate", "blocked", "versionchange", { ready: [promisableChain, nop] });
            this.on.ready.subscribe = override(this.on.ready.subscribe, function (subscribe) {
                return function (subscriber, bSticky) {
                    Dexie.vip(function () {
                        var state = _this._state;
                        if (state.openComplete) {
                            if (!state.dbOpenError)
                                DexiePromise.resolve().then(subscriber);
                            if (bSticky)
                                subscribe(subscriber);
                        }
                        else if (state.onReadyBeingFired) {
                            state.onReadyBeingFired.push(subscriber);
                            if (bSticky)
                                subscribe(subscriber);
                        }
                        else {
                            subscribe(subscriber);
                            var db_1 = _this;
                            if (!bSticky)
                                subscribe(function unsubscribe() {
                                    db_1.on.ready.unsubscribe(subscriber);
                                    db_1.on.ready.unsubscribe(unsubscribe);
                                });
                        }
                    });
                };
            });
            this.Collection = createCollectionConstructor(this);
            this.Table = createTableConstructor(this);
            this.Transaction = createTransactionConstructor(this);
            this.Version = createVersionConstructor(this);
            this.WhereClause = createWhereClauseConstructor(this);
            this.on("versionchange", function (ev) {
                if (ev.newVersion > 0)
                    console.warn("Another connection wants to upgrade database '" + _this.name + "'. Closing db now to resume the upgrade.");
                else
                    console.warn("Another connection wants to delete database '" + _this.name + "'. Closing db now to resume the delete request.");
                _this.close();
            });
            this.on("blocked", function (ev) {
                if (!ev.newVersion || ev.newVersion < ev.oldVersion)
                    console.warn("Dexie.delete('" + _this.name + "') was blocked");
                else
                    console.warn("Upgrade '" + _this.name + "' blocked by other connection holding version " + ev.oldVersion / 10);
            });
            this._maxKey = getMaxKey(options.IDBKeyRange);
            this._createTransaction = function (mode, storeNames, dbschema, parentTransaction) { return new _this.Transaction(mode, storeNames, dbschema, parentTransaction); };
            this._fireOnBlocked = function (ev) {
                _this.on("blocked").fire(ev);
                connections
                    .filter(function (c) { return c.name === _this.name && c !== _this && !c._state.vcFired; })
                    .map(function (c) { return c.on("versionchange").fire(ev); });
            };
            this.use(virtualIndexMiddleware);
            this.use(hooksMiddleware);
            addons.forEach(function (addon) { return addon(_this); });
        }
        Dexie.prototype.version = function (versionNumber) {
            versionNumber = Math.round(versionNumber * 10) / 10;
            if (this.idbdb || this._state.isBeingOpened)
                throw new exceptions.Schema("Cannot add version when database is open");
            this.verno = Math.max(this.verno, versionNumber);
            var versions = this._versions;
            var versionInstance = versions.filter(function (v) { return v._cfg.version === versionNumber; })[0];
            if (versionInstance)
                return versionInstance;
            versionInstance = new this.Version(versionNumber);
            versions.push(versionInstance);
            versions.sort(lowerVersionFirst);
            versionInstance.stores({});
            this._state.autoSchema = false;
            return versionInstance;
        };
        Dexie.prototype._whenReady = function (fn) {
            var _this = this;
            return this._state.openComplete || PSD.letThrough ? fn() : new DexiePromise(function (resolve, reject) {
                if (!_this._state.isBeingOpened) {
                    if (!_this._options.autoOpen) {
                        reject(new exceptions.DatabaseClosed());
                        return;
                    }
                    _this.open().catch(nop);
                }
                _this._state.dbReadyPromise.then(resolve, reject);
            }).then(fn);
        };
        Dexie.prototype.use = function (_a) {
            var stack = _a.stack, create = _a.create, level = _a.level, name = _a.name;
            if (name)
                this.unuse({ stack: stack, name: name });
            var middlewares = this._middlewares[stack] || (this._middlewares[stack] = []);
            middlewares.push({ stack: stack, create: create, level: level == null ? 10 : level, name: name });
            middlewares.sort(function (a, b) { return a.level - b.level; });
            return this;
        };
        Dexie.prototype.unuse = function (_a) {
            var stack = _a.stack, name = _a.name, create = _a.create;
            if (stack && this._middlewares[stack]) {
                this._middlewares[stack] = this._middlewares[stack].filter(function (mw) {
                    return create ? mw.create !== create :
                        name ? mw.name !== name :
                            false;
                });
            }
            return this;
        };
        Dexie.prototype.open = function () {
            return dexieOpen(this);
        };
        Dexie.prototype.close = function () {
            var idx = connections.indexOf(this), state = this._state;
            if (idx >= 0)
                connections.splice(idx, 1);
            if (this.idbdb) {
                try {
                    this.idbdb.close();
                }
                catch (e) { }
                this.idbdb = null;
            }
            this._options.autoOpen = false;
            state.dbOpenError = new exceptions.DatabaseClosed();
            if (state.isBeingOpened)
                state.cancelOpen(state.dbOpenError);
            state.dbReadyPromise = new DexiePromise(function (resolve) {
                state.dbReadyResolve = resolve;
            });
            state.openCanceller = new DexiePromise(function (_, reject) {
                state.cancelOpen = reject;
            });
        };
        Dexie.prototype.delete = function () {
            var _this = this;
            var hasArguments = arguments.length > 0;
            var state = this._state;
            return new DexiePromise(function (resolve, reject) {
                var doDelete = function () {
                    _this.close();
                    var req = _this._deps.indexedDB.deleteDatabase(_this.name);
                    req.onsuccess = wrap(function () {
                        databaseEnumerator.remove(_this.name);
                        resolve();
                    });
                    req.onerror = eventRejectHandler(reject);
                    req.onblocked = _this._fireOnBlocked;
                };
                if (hasArguments)
                    throw new exceptions.InvalidArgument("Arguments not allowed in db.delete()");
                if (state.isBeingOpened) {
                    state.dbReadyPromise.then(doDelete);
                }
                else {
                    doDelete();
                }
            });
        };
        Dexie.prototype.backendDB = function () {
            return this.idbdb;
        };
        Dexie.prototype.isOpen = function () {
            return this.idbdb !== null;
        };
        Dexie.prototype.hasBeenClosed = function () {
            var dbOpenError = this._state.dbOpenError;
            return dbOpenError && (dbOpenError.name === 'DatabaseClosed');
        };
        Dexie.prototype.hasFailed = function () {
            return this._state.dbOpenError !== null;
        };
        Dexie.prototype.dynamicallyOpened = function () {
            return this._state.autoSchema;
        };
        Object.defineProperty(Dexie.prototype, "tables", {
            get: function () {
                var _this = this;
                return keys(this._allTables).map(function (name) { return _this._allTables[name]; });
            },
            enumerable: true,
            configurable: true
        });
        Dexie.prototype.transaction = function () {
            var args = extractTransactionArgs.apply(this, arguments);
            return this._transaction.apply(this, args);
        };
        Dexie.prototype._transaction = function (mode, tables, scopeFunc) {
            var _this = this;
            var parentTransaction = PSD.trans;
            if (!parentTransaction || parentTransaction.db !== this || mode.indexOf('!') !== -1)
                parentTransaction = null;
            var onlyIfCompatible = mode.indexOf('?') !== -1;
            mode = mode.replace('!', '').replace('?', '');
            var idbMode, storeNames;
            try {
                storeNames = tables.map(function (table) {
                    var storeName = table instanceof _this.Table ? table.name : table;
                    if (typeof storeName !== 'string')
                        throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
                    return storeName;
                });
                if (mode == "r" || mode === READONLY)
                    idbMode = READONLY;
                else if (mode == "rw" || mode == READWRITE)
                    idbMode = READWRITE;
                else
                    throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
                if (parentTransaction) {
                    if (parentTransaction.mode === READONLY && idbMode === READWRITE) {
                        if (onlyIfCompatible) {
                            parentTransaction = null;
                        }
                        else
                            throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
                    }
                    if (parentTransaction) {
                        storeNames.forEach(function (storeName) {
                            if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
                                if (onlyIfCompatible) {
                                    parentTransaction = null;
                                }
                                else
                                    throw new exceptions.SubTransaction("Table " + storeName +
                                        " not included in parent transaction.");
                            }
                        });
                    }
                    if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
                        parentTransaction = null;
                    }
                }
            }
            catch (e) {
                return parentTransaction ?
                    parentTransaction._promise(null, function (_, reject) { reject(e); }) :
                    rejection(e);
            }
            var enterTransaction = enterTransactionScope.bind(null, this, idbMode, storeNames, parentTransaction, scopeFunc);
            return (parentTransaction ?
                parentTransaction._promise(idbMode, enterTransaction, "lock") :
                PSD.trans ?
                    usePSD(PSD.transless, function () { return _this._whenReady(enterTransaction); }) :
                    this._whenReady(enterTransaction));
        };
        Dexie.prototype.table = function (tableName) {
            if (!hasOwn(this._allTables, tableName)) {
                throw new exceptions.InvalidTable("Table " + tableName + " does not exist");
            }
            return this._allTables[tableName];
        };
        return Dexie;
    }());

    var Dexie$1 = Dexie;
    props(Dexie$1, __assign({}, fullNameExceptions, {
        delete: function (databaseName) {
            var db = new Dexie$1(databaseName);
            return db.delete();
        },
        exists: function (name) {
            return new Dexie$1(name, { addons: [] }).open().then(function (db) {
                db.close();
                return true;
            }).catch('NoSuchDatabaseError', function () { return false; });
        },
        getDatabaseNames: function (cb) {
            return databaseEnumerator ?
                databaseEnumerator.getDatabaseNames().then(cb) :
                DexiePromise.resolve([]);
        },
        defineClass: function () {
            function Class(content) {
                extend(this, content);
            }
            return Class;
        },
        ignoreTransaction: function (scopeFunc) {
            return PSD.trans ?
                usePSD(PSD.transless, scopeFunc) :
                scopeFunc();
        },
        vip: vip, async: function (generatorFn) {
            return function () {
                try {
                    var rv = awaitIterator(generatorFn.apply(this, arguments));
                    if (!rv || typeof rv.then !== 'function')
                        return DexiePromise.resolve(rv);
                    return rv;
                }
                catch (e) {
                    return rejection(e);
                }
            };
        }, spawn: function (generatorFn, args, thiz) {
            try {
                var rv = awaitIterator(generatorFn.apply(thiz, args || []));
                if (!rv || typeof rv.then !== 'function')
                    return DexiePromise.resolve(rv);
                return rv;
            }
            catch (e) {
                return rejection(e);
            }
        },
        currentTransaction: {
            get: function () { return PSD.trans || null; }
        }, waitFor: function (promiseOrFunction, optionalTimeout) {
            var promise = DexiePromise.resolve(typeof promiseOrFunction === 'function' ?
                Dexie$1.ignoreTransaction(promiseOrFunction) :
                promiseOrFunction)
                .timeout(optionalTimeout || 60000);
            return PSD.trans ?
                PSD.trans.waitFor(promise) :
                promise;
        },
        Promise: DexiePromise,
        debug: {
            get: function () { return debug; },
            set: function (value) {
                setDebug(value, value === 'dexie' ? function () { return true; } : dexieStackFrameFilter);
            }
        },
        derive: derive, extend: extend, props: props, override: override,
        Events: Events,
        getByKeyPath: getByKeyPath, setByKeyPath: setByKeyPath, delByKeyPath: delByKeyPath, shallowClone: shallowClone, deepClone: deepClone, getObjectDiff: getObjectDiff, asap: asap,
        minKey: minKey,
        addons: [],
        connections: connections,
        errnames: errnames,
        dependencies: (function () {
            try {
                return {
                    indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
                    IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
                };
            }
            catch (e) {
                return { indexedDB: null, IDBKeyRange: null };
            }
        })(),
        semVer: DEXIE_VERSION, version: DEXIE_VERSION.split('.')
            .map(function (n) { return parseInt(n); })
            .reduce(function (p, c, i) { return p + (c / Math.pow(10, i * 2)); }),
        default: Dexie$1,
        Dexie: Dexie$1 }));
    Dexie$1.maxKey = getMaxKey(Dexie$1.dependencies.IDBKeyRange);

    initDatabaseEnumerator(Dexie.dependencies.indexedDB);
    DexiePromise.rejectionMapper = mapError;
    setDebug(debug, dexieStackFrameFilter);

    /* eslint-disable */

    ///NOTE: This file was generated by minify.js from lzma_worker.js. Do not modify.

    /// © 2015 Nathan Rugg <nmrugg@gmail.com> | MIT
    /// See LICENSE for more details.

    /* jshint noarg:true, boss:true, unused:strict, strict:true, undef:true, noarg: true, forin:true, evil:true, newcap:false, -W041, -W021, worker:true, browser:true, node:true */

    /* global setImmediate, setTimeout, window, onmessage */



    var LZMA = (function () {

        var
            /** ds */
            action_decompress = 2,
            /** de */
            action_progress   = 3,
            wait = typeof setImmediate == "function" ? setImmediate : setTimeout,
            __4294967296 = 4294967296,
            N1_longLit = [4294967295, -__4294967296],

            P0_longLit = [0, 0],
            P1_longLit = [1, 0];

        function update_progress(percent, cbn) {
            postMessage({
                action: action_progress,
                cbn: cbn,
                result: percent
            });
        }

        function initDim(len) {
            ///NOTE: This is MUCH faster than "new Array(len)" in newer versions of v8 (starting with Node.js 0.11.15, which uses v8 3.28.73).
            var a = [];
            a[len - 1] = undefined;
            return a;
        }

        function add(a, b) {
            return create(a[0] + b[0], a[1] + b[1]);
        }



        function compare(a, b) {
            var nega, negb;
            if (a[0] == b[0] && a[1] == b[1]) {
                return 0;
            }
            nega = a[1] < 0;
            negb = b[1] < 0;
            if (nega && !negb) {
                return -1;
            }
            if (!nega && negb) {
                return 1;
            }
            if (sub(a, b)[1] < 0) {
                return -1;
            }
            return 1;
        }

        function create(valueLow, valueHigh) {
            var diffHigh, diffLow;
            valueHigh %= 1.8446744073709552E19;
            valueLow %= 1.8446744073709552E19;
            diffHigh = valueHigh % __4294967296;
            diffLow = Math.floor(valueLow / __4294967296) * __4294967296;
            valueHigh = valueHigh - diffHigh + diffLow;
            valueLow = valueLow - diffLow + diffHigh;
            while (valueLow < 0) {
                valueLow += __4294967296;
                valueHigh -= __4294967296;
            }
            while (valueLow > 4294967295) {
                valueLow -= __4294967296;
                valueHigh += __4294967296;
            }
            valueHigh = valueHigh % 1.8446744073709552E19;
            while (valueHigh > 9223372032559808512) {
                valueHigh -= 1.8446744073709552E19;
            }
            while (valueHigh < -9223372036854775808) {
                valueHigh += 1.8446744073709552E19;
            }
            return [valueLow, valueHigh];
        }


        function fromInt(value) {
            if (value >= 0) {
                return [value, 0];
            } else {
                return [value + __4294967296, -__4294967296];
            }
        }

        function lowBits_0(a) {
            if (a[0] >= 2147483648) {
                return ~~Math.max(Math.min(a[0] - __4294967296, 2147483647), -2147483648);
            } else {
                return ~~Math.max(Math.min(a[0], 2147483647), -2147483648);
            }
        }


        function sub(a, b) {
            return create(a[0] - b[0], a[1] - b[1]);
        }

        function $ByteArrayInputStream(this$static, buf) {
            this$static.buf = buf;
            this$static.pos = 0;
            this$static.count = buf.length;
            return this$static;
        }

        /** ds */
        function $read(this$static) {
            if (this$static.pos >= this$static.count)
                return -1;
            return this$static.buf[this$static.pos++] & 255;
        }
        /** de */


        function $ByteArrayOutputStream(this$static) {
            this$static.buf = initDim(32);
            this$static.count = 0;
            return this$static;
        }

        function $toByteArray(this$static) {
            var data = this$static.buf;
            data.length = this$static.count;
            return data;
        }



        function $write_0(this$static, buf, off, len) {
            arraycopy(buf, off, this$static.buf, this$static.count, len);
            this$static.count += len;
        }



        function arraycopy(src, srcOfs, dest, destOfs, len) {
            for (var i = 0; i < len; ++i) {
                dest[destOfs + i] = src[srcOfs + i];
            }
        }



        /** ds */
        function $init_0(this$static, input, output) {
            var decoder,
                hex_length = "",
                i,
                properties = [],
                r,
                tmp_length;

            for (i = 0; i < 5; ++i) {
                r = $read(input);
                if (r == -1)
                    throw new Error("truncated input");
                properties[i] = r << 24 >> 24;
            }

            decoder = $Decoder({});
            if (!$SetDecoderProperties(decoder, properties)) {
                throw new Error("corrupted input");
            }
            for (i = 0; i < 64; i += 8) {
                r = $read(input);
                if (r == -1)
                    throw new Error("truncated input");
                r = r.toString(16);
                if (r.length == 1) r = "0" + r;
                hex_length = r + "" + hex_length;
            }

            /// Was the length set in the header (if it was compressed from a stream, the length is all f"s).
            if (/^0+$|^f+$/i.test(hex_length)) {
                /// The length is unknown, so set to -1.
                this$static.length_0 = N1_longLit;
            } else {
                ///NOTE: If there is a problem with the decoder because of the length, you can always set the length to -1 (N1_longLit) which means unknown.
                tmp_length = parseInt(hex_length, 16);
                /// If the length is too long to handle, just set it to unknown.
                if (tmp_length > 4294967295) {
                    this$static.length_0 = N1_longLit;
                } else {
                    this$static.length_0 = fromInt(tmp_length);
                }
            }

            this$static.chunker = $CodeInChunks(decoder, input, output, this$static.length_0);
        }

        function $LZMAByteArrayDecompressor(this$static, data) {
            this$static.output = $ByteArrayOutputStream({});
            $init_0(this$static, $ByteArrayInputStream({}, data), this$static.output);
            return this$static;
        }
        /** de */

        /** ds */
        function $CopyBlock(this$static, distance, len) {
            var pos = this$static._pos - distance - 1;
            if (pos < 0) {
                pos += this$static._windowSize;
            }
            for (; len != 0; --len) {
                if (pos >= this$static._windowSize) {
                    pos = 0;
                }
                this$static._buffer[this$static._pos++] = this$static._buffer[pos++];
                if (this$static._pos >= this$static._windowSize) {
                    $Flush_0(this$static);
                }
            }
        }

        function $Create_5(this$static, windowSize) {
            if (this$static._buffer == null || this$static._windowSize != windowSize) {
                this$static._buffer = initDim(windowSize);
            }
            this$static._windowSize = windowSize;
            this$static._pos = 0;
            this$static._streamPos = 0;
        }

        function $Flush_0(this$static) {
            var size = this$static._pos - this$static._streamPos;
            if (!size) {
                return;
            }
            $write_0(this$static._stream, this$static._buffer, this$static._streamPos, size);
            if (this$static._pos >= this$static._windowSize) {
                this$static._pos = 0;
            }
            this$static._streamPos = this$static._pos;
        }

        function $GetByte(this$static, distance) {
            var pos = this$static._pos - distance - 1;
            if (pos < 0) {
                pos += this$static._windowSize;
            }
            return this$static._buffer[pos];
        }

        function $PutByte(this$static, b) {
            this$static._buffer[this$static._pos++] = b;
            if (this$static._pos >= this$static._windowSize) {
                $Flush_0(this$static);
            }
        }

        function $ReleaseStream(this$static) {
            $Flush_0(this$static);
            this$static._stream = null;
        }
        /** de */

        function GetLenToPosState(len) {
            len -= 2;
            if (len < 4) {
                return len;
            }
            return 3;
        }

        function StateUpdateChar(index) {
            if (index < 4) {
                return 0;
            }
            if (index < 10) {
                return index - 3;
            }
            return index - 6;
        }


        /** ds */
        function $Chunker(this$static, decoder) {
            this$static.decoder = decoder;
            this$static.encoder = null;
            this$static.alive = 1;
            return this$static;
        }
        /** de */

        function $processChunk(this$static) {
            if (!this$static.alive) {
                throw new Error("bad state");
            }

            if (this$static.encoder) {
                throw new Error("No encoding");

            } else {
                /// co:throw new Error("No decoding");
                /** ds */
                $processDecoderChunk(this$static);
                /** de */
            }
            return this$static.alive;
        }

        /** ds */
        function $processDecoderChunk(this$static) {
            var result = $CodeOneChunk(this$static.decoder);
            if (result == -1) {
                throw new Error("corrupted input");
            }
            this$static.inBytesProcessed = N1_longLit;
            this$static.outBytesProcessed = this$static.decoder.nowPos64;
            if (result || compare(this$static.decoder.outSize, P0_longLit) >= 0 && compare(this$static.decoder.nowPos64, this$static.decoder.outSize) >= 0) {
                $Flush_0(this$static.decoder.m_OutWindow);
                $ReleaseStream(this$static.decoder.m_OutWindow);
                this$static.decoder.m_RangeDecoder.Stream = null;
                this$static.alive = 0;
            }
        }
        /** de */


        /** ds */
        function $CodeInChunks(this$static, inStream, outStream, outSize) {
            this$static.m_RangeDecoder.Stream = inStream;
            $ReleaseStream(this$static.m_OutWindow);
            this$static.m_OutWindow._stream = outStream;
            $Init_1(this$static);
            this$static.state = 0;
            this$static.rep0 = 0;
            this$static.rep1 = 0;
            this$static.rep2 = 0;
            this$static.rep3 = 0;
            this$static.outSize = outSize;
            this$static.nowPos64 = P0_longLit;
            this$static.prevByte = 0;
            return $Chunker({}, this$static);
        }

        function $CodeOneChunk(this$static) {
            var decoder2, distance, len, numDirectBits, posSlot, posState;
            posState = lowBits_0(this$static.nowPos64) & this$static.m_PosStateMask;
            if (!$DecodeBit(this$static.m_RangeDecoder, this$static.m_IsMatchDecoders, (this$static.state << 4) + posState)) {
                decoder2 = $GetDecoder(this$static.m_LiteralDecoder, lowBits_0(this$static.nowPos64), this$static.prevByte);
                if (this$static.state < 7) {
                    this$static.prevByte = $DecodeNormal(decoder2, this$static.m_RangeDecoder);
                } else {
                    this$static.prevByte = $DecodeWithMatchByte(decoder2, this$static.m_RangeDecoder, $GetByte(this$static.m_OutWindow, this$static.rep0));
                }
                $PutByte(this$static.m_OutWindow, this$static.prevByte);
                this$static.state = StateUpdateChar(this$static.state);
                this$static.nowPos64 = add(this$static.nowPos64, P1_longLit);
            } else {
                if ($DecodeBit(this$static.m_RangeDecoder, this$static.m_IsRepDecoders, this$static.state)) {
                    len = 0;
                    if (!$DecodeBit(this$static.m_RangeDecoder, this$static.m_IsRepG0Decoders, this$static.state)) {
                        if (!$DecodeBit(this$static.m_RangeDecoder, this$static.m_IsRep0LongDecoders, (this$static.state << 4) + posState)) {
                            this$static.state = this$static.state < 7?9:11;
                            len = 1;
                        }
                    } else {
                        if (!$DecodeBit(this$static.m_RangeDecoder, this$static.m_IsRepG1Decoders, this$static.state)) {
                            distance = this$static.rep1;
                        } else {
                            if (!$DecodeBit(this$static.m_RangeDecoder, this$static.m_IsRepG2Decoders, this$static.state)) {
                                distance = this$static.rep2;
                            } else {
                                distance = this$static.rep3;
                                this$static.rep3 = this$static.rep2;
                            }
                            this$static.rep2 = this$static.rep1;
                        }
                        this$static.rep1 = this$static.rep0;
                        this$static.rep0 = distance;
                    }
                    if (!len) {
                        len = $Decode(this$static.m_RepLenDecoder, this$static.m_RangeDecoder, posState) + 2;
                        this$static.state = this$static.state < 7?8:11;
                    }
                } else {
                    this$static.rep3 = this$static.rep2;
                    this$static.rep2 = this$static.rep1;
                    this$static.rep1 = this$static.rep0;
                    len = 2 + $Decode(this$static.m_LenDecoder, this$static.m_RangeDecoder, posState);
                    this$static.state = this$static.state < 7?7:10;
                    posSlot = $Decode_0(this$static.m_PosSlotDecoder[GetLenToPosState(len)], this$static.m_RangeDecoder);
                    if (posSlot >= 4) {
                        numDirectBits = (posSlot >> 1) - 1;
                        this$static.rep0 = (2 | posSlot & 1) << numDirectBits;
                        if (posSlot < 14) {
                            this$static.rep0 += ReverseDecode(this$static.m_PosDecoders, this$static.rep0 - posSlot - 1, this$static.m_RangeDecoder, numDirectBits);
                        } else {
                            this$static.rep0 += $DecodeDirectBits(this$static.m_RangeDecoder, numDirectBits - 4) << 4;
                            this$static.rep0 += $ReverseDecode(this$static.m_PosAlignDecoder, this$static.m_RangeDecoder);
                            if (this$static.rep0 < 0) {
                                if (this$static.rep0 == -1) {
                                    return 1;
                                }
                                return -1;
                            }
                        }
                    } else
                        this$static.rep0 = posSlot;
                }
                if (compare(fromInt(this$static.rep0), this$static.nowPos64) >= 0 || this$static.rep0 >= this$static.m_DictionarySizeCheck) {
                    return -1;
                }
                $CopyBlock(this$static.m_OutWindow, this$static.rep0, len);
                this$static.nowPos64 = add(this$static.nowPos64, fromInt(len));
                this$static.prevByte = $GetByte(this$static.m_OutWindow, 0);
            }
            return 0;
        }

        function $Decoder(this$static) {
            this$static.m_OutWindow = {};
            this$static.m_RangeDecoder = {};
            this$static.m_IsMatchDecoders = initDim(192);
            this$static.m_IsRepDecoders = initDim(12);
            this$static.m_IsRepG0Decoders = initDim(12);
            this$static.m_IsRepG1Decoders = initDim(12);
            this$static.m_IsRepG2Decoders = initDim(12);
            this$static.m_IsRep0LongDecoders = initDim(192);
            this$static.m_PosSlotDecoder = initDim(4);
            this$static.m_PosDecoders = initDim(114);
            this$static.m_PosAlignDecoder = $BitTreeDecoder({}, 4);
            this$static.m_LenDecoder = $Decoder$LenDecoder({});
            this$static.m_RepLenDecoder = $Decoder$LenDecoder({});
            this$static.m_LiteralDecoder = {};
            for (var i = 0; i < 4; ++i) {
                this$static.m_PosSlotDecoder[i] = $BitTreeDecoder({}, 6);
            }
            return this$static;
        }

        function $Init_1(this$static) {
            this$static.m_OutWindow._streamPos = 0;
            this$static.m_OutWindow._pos = 0;
            InitBitModels(this$static.m_IsMatchDecoders);
            InitBitModels(this$static.m_IsRep0LongDecoders);
            InitBitModels(this$static.m_IsRepDecoders);
            InitBitModels(this$static.m_IsRepG0Decoders);
            InitBitModels(this$static.m_IsRepG1Decoders);
            InitBitModels(this$static.m_IsRepG2Decoders);
            InitBitModels(this$static.m_PosDecoders);
            $Init_0(this$static.m_LiteralDecoder);
            for (var i = 0; i < 4; ++i) {
                InitBitModels(this$static.m_PosSlotDecoder[i].Models);
            }
            $Init(this$static.m_LenDecoder);
            $Init(this$static.m_RepLenDecoder);
            InitBitModels(this$static.m_PosAlignDecoder.Models);
            $Init_8(this$static.m_RangeDecoder);
        }

        function $SetDecoderProperties(this$static, properties) {
            var dictionarySize, i, lc, lp, pb, remainder, val;
            if (properties.length < 5)
                return 0;
            val = properties[0] & 255;
            lc = val % 9;
            remainder = ~~(val / 9);
            lp = remainder % 5;
            pb = ~~(remainder / 5);
            dictionarySize = 0;
            for (i = 0; i < 4; ++i) {
                dictionarySize += (properties[1 + i] & 255) << i * 8;
            }
            ///NOTE: If the input is bad, it might call for an insanely large dictionary size, which would crash the script.
            if (dictionarySize > 99999999 || !$SetLcLpPb(this$static, lc, lp, pb)) {
                return 0;
            }
            return $SetDictionarySize(this$static, dictionarySize);
        }

        function $SetDictionarySize(this$static, dictionarySize) {
            if (dictionarySize < 0) {
                return 0;
            }
            if (this$static.m_DictionarySize != dictionarySize) {
                this$static.m_DictionarySize = dictionarySize;
                this$static.m_DictionarySizeCheck = Math.max(this$static.m_DictionarySize, 1);
                $Create_5(this$static.m_OutWindow, Math.max(this$static.m_DictionarySizeCheck, 4096));
            }
            return 1;
        }

        function $SetLcLpPb(this$static, lc, lp, pb) {
            if (lc > 8 || lp > 4 || pb > 4) {
                return 0;
            }
            $Create_0(this$static.m_LiteralDecoder, lp, lc);
            var numPosStates = 1 << pb;
            $Create(this$static.m_LenDecoder, numPosStates);
            $Create(this$static.m_RepLenDecoder, numPosStates);
            this$static.m_PosStateMask = numPosStates - 1;
            return 1;
        }

        function $Create(this$static, numPosStates) {
            for (; this$static.m_NumPosStates < numPosStates; ++this$static.m_NumPosStates) {
                this$static.m_LowCoder[this$static.m_NumPosStates] = $BitTreeDecoder({}, 3);
                this$static.m_MidCoder[this$static.m_NumPosStates] = $BitTreeDecoder({}, 3);
            }
        }

        function $Decode(this$static, rangeDecoder, posState) {
            if (!$DecodeBit(rangeDecoder, this$static.m_Choice, 0)) {
                return $Decode_0(this$static.m_LowCoder[posState], rangeDecoder);
            }
            var symbol = 8;
            if (!$DecodeBit(rangeDecoder, this$static.m_Choice, 1)) {
                symbol += $Decode_0(this$static.m_MidCoder[posState], rangeDecoder);
            } else {
                symbol += 8 + $Decode_0(this$static.m_HighCoder, rangeDecoder);
            }
            return symbol;
        }

        function $Decoder$LenDecoder(this$static) {
            this$static.m_Choice = initDim(2);
            this$static.m_LowCoder = initDim(16);
            this$static.m_MidCoder = initDim(16);
            this$static.m_HighCoder = $BitTreeDecoder({}, 8);
            this$static.m_NumPosStates = 0;
            return this$static;
        }

        function $Init(this$static) {
            InitBitModels(this$static.m_Choice);
            for (var posState = 0; posState < this$static.m_NumPosStates; ++posState) {
                InitBitModels(this$static.m_LowCoder[posState].Models);
                InitBitModels(this$static.m_MidCoder[posState].Models);
            }
            InitBitModels(this$static.m_HighCoder.Models);
        }


        function $Create_0(this$static, numPosBits, numPrevBits) {
            var i, numStates;
            if (this$static.m_Coders != null && this$static.m_NumPrevBits == numPrevBits && this$static.m_NumPosBits == numPosBits)
                return;
            this$static.m_NumPosBits = numPosBits;
            this$static.m_PosMask = (1 << numPosBits) - 1;
            this$static.m_NumPrevBits = numPrevBits;
            numStates = 1 << this$static.m_NumPrevBits + this$static.m_NumPosBits;
            this$static.m_Coders = initDim(numStates);
            for (i = 0; i < numStates; ++i)
                this$static.m_Coders[i] = $Decoder$LiteralDecoder$Decoder2({});
        }

        function $GetDecoder(this$static, pos, prevByte) {
            return this$static.m_Coders[((pos & this$static.m_PosMask) << this$static.m_NumPrevBits) + ((prevByte & 255) >>> 8 - this$static.m_NumPrevBits)];
        }

        function $Init_0(this$static) {
            var i, numStates;
            numStates = 1 << this$static.m_NumPrevBits + this$static.m_NumPosBits;
            for (i = 0; i < numStates; ++i) {
                InitBitModels(this$static.m_Coders[i].m_Decoders);
            }
        }


        function $DecodeNormal(this$static, rangeDecoder) {
            var symbol = 1;
            do {
                symbol = symbol << 1 | $DecodeBit(rangeDecoder, this$static.m_Decoders, symbol);
            } while (symbol < 256);
            return symbol << 24 >> 24;
        }

        function $DecodeWithMatchByte(this$static, rangeDecoder, matchByte) {
            var bit, matchBit, symbol = 1;
            do {
                matchBit = matchByte >> 7 & 1;
                matchByte <<= 1;
                bit = $DecodeBit(rangeDecoder, this$static.m_Decoders, (1 + matchBit << 8) + symbol);
                symbol = symbol << 1 | bit;
                if (matchBit != bit) {
                    while (symbol < 256) {
                        symbol = symbol << 1 | $DecodeBit(rangeDecoder, this$static.m_Decoders, symbol);
                    }
                break;
                }
            } while (symbol < 256);
            return symbol << 24 >> 24;
        }

        function $Decoder$LiteralDecoder$Decoder2(this$static) {
            this$static.m_Decoders = initDim(768);
            return this$static;
        }

        /** de */

        /** ds */
        function $BitTreeDecoder(this$static, numBitLevels) {
            this$static.NumBitLevels = numBitLevels;
            this$static.Models = initDim(1 << numBitLevels);
            return this$static;
        }

        function $Decode_0(this$static, rangeDecoder) {
            var bitIndex, m = 1;
            for (bitIndex = this$static.NumBitLevels; bitIndex != 0; --bitIndex) {
                m = (m << 1) + $DecodeBit(rangeDecoder, this$static.Models, m);
            }
            return m - (1 << this$static.NumBitLevels);
        }

        function $ReverseDecode(this$static, rangeDecoder) {
            var bit, bitIndex, m = 1, symbol = 0;
            for (bitIndex = 0; bitIndex < this$static.NumBitLevels; ++bitIndex) {
                bit = $DecodeBit(rangeDecoder, this$static.Models, m);
                m <<= 1;
                m += bit;
                symbol |= bit << bitIndex;
            }
            return symbol;
        }

        function ReverseDecode(Models, startIndex, rangeDecoder, NumBitLevels) {
            var bit, bitIndex, m = 1, symbol = 0;
            for (bitIndex = 0; bitIndex < NumBitLevels; ++bitIndex) {
                bit = $DecodeBit(rangeDecoder, Models, startIndex + m);
                m <<= 1;
                m += bit;
                symbol |= bit << bitIndex;
            }
            return symbol;
        }
        /** de */

        /** ds */
        function $DecodeBit(this$static, probs, index) {
            var newBound, prob = probs[index];
            newBound = (this$static.Range >>> 11) * prob;
            if ((this$static.Code ^ -2147483648) < (newBound ^ -2147483648)) {
                this$static.Range = newBound;
                probs[index] = prob + (2048 - prob >>> 5) << 16 >> 16;
                if (!(this$static.Range & -16777216)) {
                    this$static.Code = this$static.Code << 8 | $read(this$static.Stream);
                    this$static.Range <<= 8;
                }
                return 0;
            } else {
                this$static.Range -= newBound;
                this$static.Code -= newBound;
                probs[index] = prob - (prob >>> 5) << 16 >> 16;
                if (!(this$static.Range & -16777216)) {
                    this$static.Code = this$static.Code << 8 | $read(this$static.Stream);
                    this$static.Range <<= 8;
                }
                return 1;
            }
        }

        function $DecodeDirectBits(this$static, numTotalBits) {
            var i, t, result = 0;
            for (i = numTotalBits; i != 0; --i) {
                this$static.Range >>>= 1;
                t = this$static.Code - this$static.Range >>> 31;
                this$static.Code -= this$static.Range & t - 1;
                result = result << 1 | 1 - t;
                if (!(this$static.Range & -16777216)) {
                    this$static.Code = this$static.Code << 8 | $read(this$static.Stream);
                    this$static.Range <<= 8;
                }
            }
            return result;
        }

        function $Init_8(this$static) {
            this$static.Code = 0;
            this$static.Range = -1;
            for (var i = 0; i < 5; ++i) {
                this$static.Code = this$static.Code << 8 | $read(this$static.Stream);
            }
        }
        /** de */

        function InitBitModels(probs) {
            for (var i = probs.length - 1; i >= 0; --i) {
                probs[i] = 1024;
            }
        }

        /** ds */
        function decode(utf) {
            var i = 0, j = 0, x, y, z, l = utf.length, buf = [], charCodes = [];
            for (; i < l; ++i, ++j) {
                x = utf[i] & 255;
                if (!(x & 128)) {
                    if (!x) {
                        /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
                        return utf;
                    }
                    charCodes[j] = x;
                } else if ((x & 224) == 192) {
                    if (i + 1 >= l) {
                        /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
                        return utf;
                    }
                    y = utf[++i] & 255;
                    if ((y & 192) != 128) {
                        /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
                        return utf;
                    }
                    charCodes[j] = ((x & 31) << 6) | (y & 63);
                } else if ((x & 240) == 224) {
                    if (i + 2 >= l) {
                        /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
                        return utf;
                    }
                    y = utf[++i] & 255;
                    if ((y & 192) != 128) {
                        /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
                        return utf;
                    }
                    z = utf[++i] & 255;
                    if ((z & 192) != 128) {
                        /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
                        return utf;
                    }
                    charCodes[j] = ((x & 15) << 12) | ((y & 63) << 6) | (z & 63);
                } else {
                    /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
                    return utf;
                }
                if (j == 16383) {
                    buf.push(String.fromCharCode.apply(String, charCodes));
                    j = -1;
                }
            }
            if (j > 0) {
                charCodes.length = j;
                buf.push(String.fromCharCode.apply(String, charCodes));
            }
            return buf.join("");
        }
        /** de */


        function toDouble(a) {
            return a[1] + a[0];
        }


        /** ds */
        function decompress(byte_arr, on_finish, on_progress) {
            var this$static = {},
                percent,
                cbn, /// A callback number should be supplied instead of on_finish() if we are using Web Workers.
                has_progress,
                len,
                sync = typeof on_finish == "undefined" && typeof on_progress == "undefined";

            if (typeof on_finish != "function") {
                cbn = on_finish;
                on_finish = on_progress = 0;
            }

            on_progress = on_progress || function(percent) {
                if (typeof cbn == "undefined")
                    return;

                return update_progress(has_progress ? percent : -1, cbn);
            };

            on_finish = on_finish || function(res, err) {
                if (typeof cbn == "undefined")
                    return;

                return postMessage({
                    action: action_decompress,
                    cbn: cbn,
                    result: res,
                    error: err
                });
            };

            if (sync) {
                this$static.d = $LZMAByteArrayDecompressor({}, byte_arr);
                while ($processChunk(this$static.d.chunker));
                return decode($toByteArray(this$static.d.output));
            }

            try {
                this$static.d = $LZMAByteArrayDecompressor({}, byte_arr);

                len = toDouble(this$static.d.length_0);

                ///NOTE: If the data was created via a stream, it will not have a length value, and therefore we can't calculate the progress.
                has_progress = len > -1;

                on_progress(0);
            } catch (err) {
                return on_finish(null, err);
            }

            function do_action() {
                try {
                    var res, i = 0, start = (new Date()).getTime();
                    while ($processChunk(this$static.d.chunker)) {
                        if (++i % 1000 == 0 && (new Date()).getTime() - start > 200) {
                            if (has_progress) {
                                percent = toDouble(this$static.d.chunker.decoder.nowPos64) / len;
                                /// If about 200 miliseconds have passed, update the progress.
                                on_progress(percent);
                            }

                            ///NOTE: This allows other code to run, like the browser to update.
                            wait(do_action, 0);
                            return 0;
                        }
                    }

                    on_progress(1);

                    res = decode($toByteArray(this$static.d.output));

                    /// delay so we don’t catch errors from the on_finish handler
                    wait(on_finish.bind(null, res), 0);
                } catch (err) {
                    on_finish(null, err);
                }
            }

            ///NOTE: We need to wait to make sure it is always async.
            wait(do_action, 0);
        }
        /** de */


        /// If we're in a Web Worker, create the onmessage() communication channel.
        ///NOTE: This seems to be the most reliable way to detect this.
        if (typeof onmessage != "undefined" && (typeof window == "undefined" || typeof window.document == "undefined")) {
            (function () {
                /* jshint -W020 */
                /// Create the global onmessage function.
                onmessage = function (e) {
                    if (e && e.data) {

                        /// co:if (e.data.action == action_compress) {
                        /// co:    LZMA.compress(e.data.data, e.data.mode, e.data.cbn);
                        /// co:}
                        if (e.data.action == action_decompress) {
                            LZMA.decompress(e.data.data, e.data.cbn);
                        }
                    }
                };
            }());
        }

        return {

            /// co:compress:   compress
            decompress: decompress
        };
    }());

    const tomeStores = {
      lists: 'k',
      verses: 'k',
      words: 'k'
    };

    const tomeLzmaUrl = './lzma/tome.kjv.json.lzma';
    const tomeName = 'KJV';

    let progress = null;
    let tomeAcrostics = {};
    let tomeBooks = null;
    let tomeChapters = null;
    let tomeCitations = [];
    let tomeDb = null;
    let tomeVerseCount = null;
    let tomeWords = null;

    const initializeTome = async (cb) => {
      progress = cb ? cb : () => {};
      progress('');
      progress('* tome database *');
      progress('');
      await openTome();
      await loadTomeAcrostics();
      await loadTomeBooks();
      await loadTomeChapters();
      await loadTomeCitations();
      await loadTomeWords();
      tomeVerseCount = await tomeDb.verses.count();
    };

    const loadTomeAcrostics = async () => {
      progress('loading acrostics...');
      let listObj = await tomeDb.lists.get('acrostics');
      tomeAcrostics = listObj.v;
    };

    const loadTomeBooks = async () => {
      progress('loading books...');
      let listObj = await tomeDb.lists.get('books');
      tomeBooks = listObj.v;
    };

    const loadTomeChapters = async () => {
      progress('loading chapters...');
      let listObj = await tomeDb.lists.get('chapters');
      tomeChapters = listObj.v;
    };

    const loadTomeCitations = async () => {
      progress('loading citations...');
      let listObj = await tomeDb.lists.get('citations');
      tomeCitations = listObj.v;
    };

    const loadTomeWords = async () => {
      progress('loading words...');
      let wordObjs = await tomeDb.words.toArray();
      tomeWords = wordObjs.map(x => x.k);
    };

    const openTome = async () => {
      tomeDb = await new Dexie('tome');
      await tomeDb.version(1).stores(tomeStores);
      tomeDb.open();
      let wordCount = await tomeDb.words.count();
      if (wordCount === 0) {
        progress('fetching...');
        let response = await fetch(tomeLzmaUrl);

        progress('buffering...');
        let buffer = await response.arrayBuffer();

        progress('byte conversion...');
        let bytes = new Uint8Array(buffer);

        progress('decompressing...');
        let str = await LZMA.decompress(bytes);

        progress('parsing...');
        let data = JSON.parse(str);

        progress('populating lists...');
        await tomeDb.lists.bulkAdd(data.lists);
        progress('populating verses...');
        await tomeDb.verses.bulkAdd(data.verses);
        progress('populating words...');
        await tomeDb.words.bulkAdd(data.words);
        progress('population complete.');
      } else {
        progress('tome already populated.');
      }
    };

    const defLemma = 0;
    const defTranliteration = 1;
    const defPronunciation = 2;
    const defDefinition = 3;

    const mapSliceStart = 0;
    const mapSliceEnd = 1;
    const mapStrongNums = 2;

    const wordKjvWord = 0;
    const wordTomeBin = 1;

    const strongStores = {
      defs: 'k',
      maps: 'k',
      words: 'k'
    };

    const strongLzmaUrl = './lzma/strong.json.lzma';

    let progress$1 = null;
    let strongCitations = {};
    let strongDb = null;
    let strongNums = null;

    const initializeStrong = async (cb) => {
      progress$1 = cb ? cb : () => {};
      progress$1('');
      progress$1('* strong database *');
      progress$1('');
      await openStrong();
      await loadStrongNums();
      await loadStrongCitations();
    };

    const loadStrongCitations = async () => {
      progress$1('loading citations...');
      let defObjs = await strongDb.defs.toArray();
      defObjs.map(x => strongCitations[x.k] = x.v[defTranliteration]);
    };

    const loadStrongNums = async () => {
      progress$1('loading numbers...');
      let strongDefObjs = await strongDb.defs.toArray();
      strongNums = strongDefObjs.map(x => x.k);
    };

    const openStrong = async () => {
      strongDb = await new Dexie('strong');
      await strongDb.version(1).stores(strongStores);
      strongDb.open();
      let wordsCount = await strongDb.words.count();
      if (wordsCount === 0) {
        progress$1('fetching...');
        let response = await fetch(strongLzmaUrl);

        progress$1('buffering...');
        let buffer = await response.arrayBuffer();

        progress$1('byte conversion...');
        let bytes = new Uint8Array(buffer);

        progress$1('decompressing...');
        let str = await LZMA.decompress(bytes);

        progress$1('parsing...');
        let data = JSON.parse(str);

        progress$1('populating defs...');
        await strongDb.defs.bulkAdd(data.defs);
        progress$1('populating maps...');
        await strongDb.maps.bulkAdd(data.maps);
        progress$1('populating words...');
        await strongDb.words.bulkAdd(data.words);
        progress$1('population complete.');
      } else {
        progress$1('strong already populated.');
      }
    };

    class EventBus {

      constructor() {
        this.topics = {};
      }

      async publish(topic, data) {
        // console.log(topic);
        if (this.topics[topic] && this.topics[topic].length >= 1) {
          for (let listener of this.topics[topic]) {
            await listener(data);
          }
        }
      }

      subscribe(topic, listener) {
        if (!this.topics[topic]) {
          this.topics[topic] = [];
        }
        this.topics[topic].push(listener);
      }

    }

    let bus = new EventBus();

    const bookLongName = 0;
    const bookShortName = 1;
    const bookLastVerseIdx = 3;
    const bookFirstChapterIdx = 4;
    const bookLastChapterIdx = 5;

    const chapterBookIdx = 0;
    const chapterName = 1;
    const chapterNum = 2;
    const chapterFirstVerseIdx = 3;
    const chapterLastVerseIdx = 4;

    const verseText = 0;
    const verseCitation = 3;
    const verseNum = 4;

    const wordVerseIdx = 0;
    const wordCount = 1;

    const appPrefix = 'kjs';

    const centerScrollElement = (scrollElement, element) => {
      let y = element.offsetTop - scrollElement.offsetTop -
        (scrollElement.clientHeight - element.clientHeight) / 2;
      scrollElement.scrollTop = y;
    };

    const chapterByVerseIdx = (verseIdx) => {
      let chapterIdx = chapterIdxByVerseIdx(verseIdx);
      return tomeChapters[chapterIdx];
    };

    const chapterIdxByVerseIdx = (verseIdx) => {
      let chapterIdx = tomeChapters
        .findIndex(x => x[chapterLastVerseIdx] >= verseIdx);
      return chapterIdx;
    };

    const citationByVerseIdx = (verseIdx) => {
      let chapter = chapterByVerseIdx(verseIdx);
      let num = verseIdx - chapter[chapterFirstVerseIdx] + 1;
      return `${chapter[chapterName]}:${num}`;
    };

    const range = (start, stop, step = 1) => {
      return Array(Math.ceil((stop - start) / step))
        .fill(start)
        .map((x, y) => x + y * step);
    };

    const removeAllChildren = (element) => {
      while (element.hasChildNodes()) {
        element.removeChild(element.lastChild);
      }
    };

    const validColumns = [ 1, 2, 3];

    class ReadModel {

      constructor() {
        this.initialize();
      }

      columnChange(column) {
        this.column = column;
        this.saveColumn();
        bus.publish('column.update', this.column);
      }

      initialize() {
        this.subscribe();
      }

      modeChange(strongMode) {
        this.strongMode = strongMode;
        this.saveMode();
        bus.publish('read.strong-mode.update', this.strongMode);
      }

      modeToogle() {
        this.modeChange(!this.strongMode);
      }

      panesChange(panes) {
        this.panes = panes;
        bus.publish('panes.update', this.panes);
      }

      restore() {
        this.restoreColumn();
        this.restoreMode();
      }

      restoreColumn() {
        let defaultColumn = 1;
        let column = localStorage.getItem(`${appPrefix}-column`);
        if (!column) {
          column = defaultColumn;
        } else {
          try {
            column = JSON.parse(column);
          } catch (error) {
            column = defaultColumn;
          }
          if (!validColumns.includes(column)) {
            column = defaultColumn;
          }
        }
        this.columnChange(column);
      }

      restoreMode() {
        let defaultMode = false;
        let strongMode = localStorage.getItem(`${appPrefix}-readStrongMode`);
        if (!strongMode) {
          strongMode = defaultMode;
        } else {
          try {
            strongMode = JSON.parse(strongMode);
          } catch (error) {
            strongMode = defaultMode;
          }
          if (typeof strongMode !== 'boolean') {
            strongMode = defaultMode;
          }
        }
        this.modeChange(strongMode);
      }

      saveColumn() {
        localStorage.setItem(`${appPrefix}-column`, JSON.stringify(this.column));
      }

      saveMode() {
        localStorage.setItem(`${appPrefix}-readStrongMode`,
          JSON.stringify(this.strongMode));
      }

      saveSidebar() {
        localStorage.setItem(`${appPrefix}-sidebar`, JSON.stringify(this.sidebar));
      }

      sidebarChange(sidebar) {
        this.sidebar = sidebar;
        this.saveSidebar();
        bus.publish('sidebar.update', this.sidebar);
      }

      sidebarRestore() {
        let defaultSidebar = this.panes > 1 ? 'navigator' : 'none';
        let sidebar = localStorage.getItem(`${appPrefix}-sidebar`);
        if (!sidebar) {
          sidebar = defaultSidebar;
        } else {
          try {
            sidebar = JSON.parse(sidebar);
          } catch (error) {
            sidebar = defaultSidebar;
          }
        }
        if (this.panes > 1) {
          sidebar = sidebar === 'none' ? 'navigator' : sidebar;
        } else if (sidebar !== 'none') {
          sidebar = 'none';
        }
        this.sidebarChange(sidebar);
      }

      subscribe() {
        bus.subscribe('column.change',
          (column) => { this.columnChange(column); }
        );

        bus.subscribe('panes.change', (panes) => {
          this.panesChange(panes);
        });

        bus.subscribe('read.restore',
          () => { this.restore(); }
        );
        bus.subscribe('read.strong-mode.toggle', () => {
          this.modeToogle();
        });

        bus.subscribe('sidebar.change', (sidebar) => {
          this.sidebarChange(sidebar);
        });
        bus.subscribe('sidebar.restore', () => {
          this.sidebarRestore();
        });
      }

    }

    const svgNS = 'http://www.w3.org/2000/svg';
    const xlinkNS = 'http://www.w3.org/1999/xlink';

    const templateActionMenu = (modifier, actionSet) => {
      let actionMenu = templateElement(
        'div', 'action-menu', modifier, null, null);
      actionMenu.classList.add('action-menu--hide');
      for (let btn of actionSet) {
        let element = templateBtnIcon(btn.icon, btn.label);
        actionMenu.appendChild(element);
      }
      return actionMenu;
    };

    const templateBtnIcon = (svgId, label) => {
      let svgTag = document.createElementNS(svgNS, 'svg');
      svgTag.classList.add('icon-svg');
      let useTag = document.createElementNS(svgNS, 'use');
      useTag.setAttributeNS(xlinkNS, 'xlink:href', `icons.svg#${svgId}`);
      svgTag.appendChild(useTag);
      let btnIcon = templateElement(
        'button', 'btn-icon', svgId, label, null);
      btnIcon.appendChild(svgTag);
      return btnIcon;
    };

    const templateDivDialog = (modifier, toolSet) => {
      let divDialog = templateElement(
        'div', 'dialog', modifier, null, null);
      let divDialogBtns = templateElement(
        'div', 'dialog-btns', modifier, null, null);
      for (let tool of toolSet) {
        let element;
        if (tool.type === 'btn') {
          element = templateElement(
            'button', 'btn-dialog', tool.id, tool.label, tool.label);
          divDialogBtns.appendChild(element);
        } else if (tool.type === 'input') {
          element = templateInput('dialog-input', modifier, tool.label);
          divDialog.appendChild(element);
        } else if (tool.type === 'label') {
          element = templateElement(
            'div', 'dialog-label', modifier, null, null);
          if (tool.text) {
            element.textContent = tool.text;
          }
          divDialog.appendChild(element);
        } else if (tool.type === 'textarea') {
          element = templateElement(
            'textarea', 'dialog-textarea', modifier, tool.label, null);
          divDialog.appendChild(element);
        }
      }
      divDialog.appendChild(divDialogBtns);
      return divDialog;
    };

    const templateElement = (tagName, block, modifier, label, content) => {
      let element = document.createElement(tagName);
      element.classList.add(block);
      if (modifier) {
        element.classList.add(`${block}--${modifier}`);
      }
      if (label) {
        element.setAttribute('aria-label', label);
      }
      if (content) {
        element.textContent = content;
      }
      return element;
    };

    const templateInput = (block, modifier, label) => {
      let input = templateElement(
        'input', block, modifier, label, null);
      input.setAttribute('type', 'text');
      return input;
    };

    const templatePage = (modifier) => {
      let page = templateElement(
        'div', 'page', modifier, null, null);
      page.classList.add('page--hide');
      return page;
    };

    const templateScroll = (modifier) => {
      let scroll = templateElement(
        'div', 'scroll', modifier, null, null);
      return scroll;
    };

    const templateToolbar = (modifier) => {
      let toolbar = templateElement(
        'div', 'toolbar', modifier, null, null);
      return toolbar;
    };

    const templateToolbarLower = (toolSet) => {
      let toolbarLower = templateToolbar('lower');
      for (let tool of toolSet) {
        let element;
        if (tool.type === 'btn') {
          element = templateBtnIcon(tool.icon, tool.label);
          toolbarLower.appendChild(element);
        } else if (tool.type === 'input') {
          element = templateInput('input', tool.modifier, tool.label);
          toolbarLower.appendChild(element);
        }
      }
      return toolbarLower;
    };

    const templateToolbarUpper = (toolSet) => {
      let toolbarUpper = templateToolbar('upper');
      for (let tool of toolSet) {
        let element;
        if (tool.type === 'btn') {
          element = templateBtnIcon(tool.icon, tool.label);
          toolbarUpper.appendChild(element);
        } else if (tool.type === 'banner') {
          element = templateElement(
            'div', 'banner', tool.modifier, null, tool.text);
          toolbarUpper.appendChild(element);
        }
      }
      return toolbarUpper;
    };

    const lowerToolSet = [
      { type: 'btn', icon: 'navigator', label: 'Navigator' },
      { type: 'btn', icon: 'bookmark', label: 'Bookmark' },
      { type: 'btn', icon: 'search', label: 'Search' },
      { type: 'btn', icon: 'strong', label: 'Strong' },
      { type: 'btn', icon: 'setting', label: 'Setting' },
      { type: 'btn', icon: 'help', label: 'Help' },
      { type: 'btn', icon: 'column-1', label: 'Single Column' },
      { type: 'btn', icon: 'column-2', label: 'Double Column' },
      { type: 'btn', icon: 'column-3', label: 'Triple Column' },
      { type: 'btn', icon: 'strong-mode', label: 'Strong Mode' }
    ];

    const upperToolSet = [
      { type: 'btn', icon: 'prev', label: 'Previous Chapter' },
      { type: 'banner', modifier: 'read', text: null },
      { type: 'btn', icon: 'next', label: 'Next Chapter' }
    ];

    class ReadView {

      constructor() {
        this.initialize();
      }

      addListeners() {
        this.list.addEventListener('click', (event) => {
          this.listClick(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
        this.toolbarUpper.addEventListener('click', (event) => {
          this.toolbarUpperClick(event);
        });
        window.addEventListener('resize', (event) => {
          this.windowResize(event);
        });
      }

      bookmarkHide() {
        if (this.sidebar !== 'bookmark') {
          this.btnBookmark.classList.remove('btn-icon--active');
        }
      }

      bookmarkShow() {
        this.btnBookmark.classList.add('btn-icon--active');
      }

      buildAcrosticSpan(verseIdx) {
        let acrosticSpan = undefined;
        if (tomeAcrostics) {
          let acrostic = tomeAcrostics[verseIdx];
          if (acrostic) {
            acrosticSpan = templateElement(
              'span', 'verse-acrostic', null, null, acrostic + ' ');
          }
        }
        return acrosticSpan;
      }

      buildPage() {
        this.page = templatePage('read');

        this.toolbarUpper = templateToolbarUpper(upperToolSet);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('read');
        this.list = templateElement('div', 'list', 'read', null, null);
        this.scroll.appendChild(this.list);
        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      buildVerse(verseObj) {
        let verse = templateElement('div', 'verse', null, null, null);
        verse.dataset.verseIdx = verseObj.k;
        let verseNum = this.buildVerseNum(verseObj);
        verse.appendChild(verseNum);
        let acrostic = this.buildAcrosticSpan(verseObj.k);
        if (acrostic) {
          verse.appendChild(acrostic);
        }
        let text = this.buildVerseText(verseObj);
        verse.appendChild(text);
        return verse;
      }

      buildVerseNum(verseObj) {
        let num = templateElement('span', 'verse-num', null, null,
          verseObj.v[verseNum] + ' ');
        return num;
      }

      buildVerseText(verseObj) {
        let text = templateElement('span', 'verse-text', null, null,
          verseObj.v[verseText]);
        return text;
      }

      changeTheme() {
        if (this.lastTheme) {
          this.body.classList.remove(this.lastTheme.themeClass);
        }
        this.body.classList.add(this.theme.themeClass);
      }

      chapterIdxUpdate(chapterIdx) {
        this.chapterIdx = chapterIdx;
        this.updateBanner();
        this.updateVerses();
        this.refreshVerseBookmarks();
      }

      columnUpdate(column) {
        this.column = column;
        this.updateColumn();
        this.updateColumnBtn();
      }

      folderUpdate(folder) {
        this.folder = folder;
        this.refreshVerseBookmarks();
      }

      fontSizeUpdate(fontSize) {
        this.fontSize = fontSize;
        this.updateFontSize();
        this.lastFontSize = this.fontSize;
      }

      fontUpdate(font) {
        this.font = font;
        this.updateFont();
        this.lastFont = this.font;
      }

      hide() {
        this.page.classList.add('page--hide');
      }

      getElements() {
        this.body = document.querySelector('body');

        this.btnPrev = this.toolbarUpper.querySelector('.btn-icon--prev');
        this.banner = this.toolbarUpper.querySelector('.banner--read');
        this.btnNext = this.toolbarUpper.querySelector('.btn-icon--next');

        this.btnNavigator = this.toolbarLower.querySelector('.btn-icon--navigator');
        this.btnBookmark = this.toolbarLower.querySelector('.btn-icon--bookmark');
        this.btnSearch = this.toolbarLower.querySelector('.btn-icon--search');
        this.btnStrong = this.toolbarLower.querySelector('.btn-icon--strong');
        this.btnStrongMode = this.toolbarLower.querySelector('.btn-icon--strong-mode');
        this.btnSetting = this.toolbarLower.querySelector('.btn-icon--setting');
        this.btnHelp = this.toolbarLower.querySelector('.btn-icon--help');
        this.btnColumnOne = this.toolbarLower.querySelector('.btn-icon--column-1');
        this.btnColumnTwo = this.toolbarLower.querySelector('.btn-icon--column-2');
        this.btnColumnThree = this.toolbarLower.querySelector('.btn-icon--column-3');

        this.columnBtns = [
          this.btnColumnOne, this.btnColumnTwo, this.btnColumnThree
        ];
      }

      helpHide() {
        if (this.sidebar !== 'help') {
          this.btnHelp.classList.remove('btn-icon--active');
        }
      }

      helpShow() {
        this.btnHelp.classList.add('btn-icon--active');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
        this.lastFont = null;
        this.lastFontSize = null;
      }

      listClick(event) {
        event.preventDefault();
        if (!document.getSelection().toString()) {
          let verse = event.target.closest('div.verse');
          if (verse) {
            this.verseClick(verse);
          }
        }
      }

      modeUpdate(strongMode) {
        this.strongMode = strongMode;
        if (this.strongMode) {
          this.btnStrongMode.classList.add('btn-icon--active');
        } else {
          this.btnStrongMode.classList.remove('btn-icon--active');
        }
      }

      navigatorHide() {
        this.btnNavigator.classList.remove('btn-icon--active');
      }

      navigatorShow() {
        this.btnNavigator.classList.add('btn-icon--active');
      }

      navigatorVersesUpdate(verseObjs) {
        this.verseObjs = verseObjs;
      }

      panesUpdate(panes) {
        if (panes === 1 || panes === 2) {
          this.btnColumnOne.classList.add('btn-icon--hide');
          this.btnColumnTwo.classList.add('btn-icon--hide');
          this.btnColumnThree.classList.add('btn-icon--hide');
        } else if (panes === 3) {
          this.btnColumnOne.classList.remove('btn-icon--hide');
          this.btnColumnTwo.classList.remove('btn-icon--hide');
          this.btnColumnThree.classList.add('btn-icon--hide');
        } else {
          this.btnColumnOne.classList.remove('btn-icon--hide');
          this.btnColumnTwo.classList.remove('btn-icon--hide');
          this.btnColumnThree.classList.remove('btn-icon--hide');
        }
      }

      refreshBookmarks(element) {
        let verseIdx = parseInt(element.dataset.verseIdx);
        if (this.folder.bookmarks.indexOf(verseIdx) === -1) {
          element.classList.remove('verse--bookmark');
        } else {
          element.classList.add('verse--bookmark');
        }
      }

      refreshVerseBookmarks() {
        let verses = [...this.list.querySelectorAll('.verse')];
        for (let element of verses) {
          this.refreshBookmarks(element);
        }
      }

      scrollToTop() {
        this.scroll.scrollTop = 0;
      }

      scrollToVerse(verseIdx) {
        let element = this.list.querySelector(
          `[data-verse-idx="${verseIdx}"]`);
        if (element) {
          centerScrollElement(this.scroll, element);
        }
      }

      searchHide() {
        if (this.sidebar !== 'search') {
          this.btnSearch.classList.remove('btn-icon--active');
        }
      }

      searchShow() {
        this.btnSearch.classList.add('btn-icon--active');
      }

      settingHide() {
        this.btnSetting.classList.remove('btn-icon--active');
      }

      settingShow() {
        this.btnSetting.classList.add('btn-icon--active');
      }

      show() {
        this.page.classList.remove('page--hide');
      }

      sidebarUpdate(sidebar) {
        this.sidebar = sidebar;
      }

      strongHide() {
        if (this.sidebar !== 'strong') {
          this.btnStrong.classList.remove('btn-icon--active');
        }
      }

      strongShow() {
        this.btnStrong.classList.add('btn-icon--active');
      }

      subscribe() {
        bus.subscribe('bookmark.hide', () => {
          this.bookmarkHide();
        });
        bus.subscribe('bookmark.show', () => {
          this.bookmarkShow();
        });

        bus.subscribe('chapterIdx.update', (chapterIdx) => {
          this.chapterIdxUpdate(chapterIdx);
        });

        bus.subscribe('column.update', (column) => {
          this.columnUpdate(column);
        });

        bus.subscribe('folder.update', (folder) => {
          this.folderUpdate(folder);
        });

        bus.subscribe('font.update', (font) => {
          this.fontUpdate(font);
        });

        bus.subscribe('font-size.update', (fontSize) => {
          this.fontSizeUpdate(fontSize);
        });

        bus.subscribe('help.hide', () => {
          this.helpHide();
        });
        bus.subscribe('help.show', () => {
          this.helpShow();
        });

        bus.subscribe('navigator.hide', () => {
          this.navigatorHide();
        });
        bus.subscribe('navigator.show', () => {
          this.navigatorShow();
        });
        bus.subscribe('navigator.verses.update', (verseObjs) => {
          this.navigatorVersesUpdate(verseObjs);
        });

        bus.subscribe('panes.update', (panes) => {
          this.panesUpdate(panes);
        });

        bus.subscribe('read.hide', () => {
          this.hide();
        });
        bus.subscribe('read.scroll-to-top', () => {
          this.scrollToTop();
        });
        bus.subscribe('read.scroll-to-verse', (verseIdx) => {
          this.scrollToVerse(verseIdx);
        });
        bus.subscribe('read.show', () => {
          this.show();
        });
        bus.subscribe('read.strong-mode.update', (strongMode) => {
          this.modeUpdate(strongMode);
        });

        bus.subscribe('search.hide', () => {
          this.searchHide();
        });
        bus.subscribe('search.show', () => {
          this.searchShow();
        });

        bus.subscribe('setting.hide', () => {
          this.settingHide();
        });
        bus.subscribe('setting.show', () => {
          this.settingShow();
        });

        bus.subscribe('strong.hide', () => {
          this.strongHide();
        });
        bus.subscribe('strong.show', () => {
          this.strongShow();
        });

        bus.subscribe('sidebar.update', (sidebar) => {
          this.sidebarUpdate(sidebar);
        });

        bus.subscribe('theme.update', (theme) => {
          this.themeUpdate(theme);
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnStrongMode ||
            !target.classList.contains('btn-icon--active')
          ) {
            if (target === this.btnNavigator) {
              bus.publish('sidebar.select', 'navigator');
            } else if (target === this.btnBookmark) {
              bus.publish('sidebar.select', 'bookmark');
            } else if (target === this.btnSearch) {
              bus.publish('sidebar.select', 'search');
            } else if (target === this.btnStrong) {
              bus.publish('sidebar.select', 'strong');
            } else if (target === this.btnStrongMode) {
              bus.publish('read.strong-mode.click', null);
            } else if (target === this.btnSetting) {
              bus.publish('sidebar.select', 'setting');
            } else if (target === this.btnHelp) {
              bus.publish('sidebar.select', 'help');
            } else if (target === this.btnColumnOne) {
              bus.publish('read.column.select', 1);
            } else if (target === this.btnColumnTwo) {
              bus.publish('read.column.select', 2);
            } else if (target === this.btnColumnThree) {
              bus.publish('read.column.select', 3);
            }
          }
        }
      }

      toolbarUpperClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnPrev) {
            bus.publish('read.prev.chapter', 1);
          } else if (target === this.btnNext) {
            bus.publish('read.next.chapter', 2);
          }
        }
      }

      themeUpdate(theme) {
        this.theme = theme;
        this.changeTheme();
        this.lastTheme = this.theme;
      }

      updateBanner() {
        this.banner.textContent = tomeChapters[this.chapterIdx][chapterName];
      }

      updateColumn() {
        this.list.classList.remove('column-2', 'column-3');
        if (this.column === 2) {
          this.list.classList.add('column-2');
        } else if (this.column === 3) {
          this.list.classList.add('column-3');
        }
      }

      updateColumnBtn() {
        if (this.activeColumnBtn) {
          this.activeColumnBtn.classList.remove('btn-icon--active');
        }
        this.activeColumnBtn = this.columnBtns[this.column - 1];
        this.activeColumnBtn.classList.add('btn-icon--active');
      }

      updateFont() {
        if (this.lastFont) {
          this.list.classList.remove(this.lastFont.fontClass);
        }
        this.list.classList.add(this.font.fontClass);
      }

      updateFontSize() {
        if (this.lastFontSize) {
          this.list.classList.remove(this.lastFontSize);
        }
        this.list.classList.add(this.fontSize);
      }

      updateVerses() {
        removeAllChildren(this.list);
        let fragment = document.createDocumentFragment();
        for (let verseObj of this.verseObjs) {
          let verse = this.buildVerse(verseObj);
          fragment.appendChild(verse);
        }
        this.list.appendChild(fragment);
      }

      verseClick(verse) {
        let verseIdx = parseInt(verse.dataset.verseIdx);
        if (this.strongMode) {
          bus.publish('read.strong.select', verseIdx);
        } else if (verse.classList.contains('verse--bookmark')) {
          bus.publish('read.bookmark.delete', verseIdx);
        } else {
          bus.publish('read.bookmark.add', verseIdx);
        }
      }

      windowResize() {
        bus.publish('window.resize', null);
      }

    }

    const SIDEBAR_WIDTH = 320;

    class ReadController {

      constructor() {
        this.initialize();
      }

      bookmarkAdd(verseIdx) {
        bus.publish('bookmark.add', verseIdx);
      }

      bookmarkDelete(verseIdx) {
        bus.publish('bookmark.delete', verseIdx);
      }

      columnSelect(column) {
        this.column = column;
        bus.publish('column.change', column);
      }

      columnUpdate(column) {
        this.column = column;
      }

      decreasePanes() {
        if (this.panes === 1) {
          this.lastSidebar = this.sidebar;
          bus.publish('sidebar.change', 'none');
          bus.publish('read.column.select', 1);
        } else if (this.panes === 2) {
          bus.publish('read.column.select', 1);
        } else if (this.panes === 3 && this.column > 1) {
          bus.publish('read.column.select', 2);
        }
      }

      increasePanes() {
        if (this.currentPanes === 1) {
          if (this.sidebar !== 'none') {
            bus.publish('read.show', null);
          } else if (this.lastSidebar === null) {
            bus.publish('sidebar.change', 'navigator');
          } else {
            bus.publish('sidebar.change', this.lastSidebar);
          }
        }
      }

      initialize() {
        this.subscribe();
        this.sidebar = null;
        this.lastSidebar = null;
      }

      initializeApp() {
        this.setPanes();
        this.currentPanes = this.panes;
        bus.publish('sidebar.restore', null);
        bus.publish('bookmark.restore', null);
        bus.publish('navigator.restore', null);
        bus.publish('search.restore', null);
        bus.publish('strong.restore', null);
        bus.publish('setting.restore', null);
        bus.publish('help.restore', null);
        bus.publish('read.restore', null);
      }

      modeToggle() {
        bus.publish('read.strong-mode.toggle', null);
      }

      nextChapter() {
        bus.publish('chapter.next', null);
      }

      prevChapter() {
        bus.publish('chapter.prev', null);
      }

      setPanes() {
        this.panes = Math.min(Math.floor(window.innerWidth / SIDEBAR_WIDTH), 4);
        bus.publish('panes.change', this.panes);
      }

      sidebarSelect(sidebar) {
        bus.publish('sidebar.change', sidebar);
      }

      sidebarUpdate(sidebar) {
        if (sidebar !== this.sidebar) {
          if (sidebar === 'none') {
            this.lastSidebar = this.sidebar;
            bus.publish(`${this.sidebar}.hide`, null);
            this.sidebar = sidebar;
            bus.publish('read.show', null);
          } else if (this.panes === 1) {
            if (this.sidebar === 'none') {
              bus.publish('read.hide', null);
            } else {
              bus.publish(`${this.sidebar}.hide`, null);
            }
            this.sidebar = sidebar;
            bus.publish(`${this.sidebar}.show`, null);
          } else {
            bus.publish('read.show', null);
            if (this.sidebar !== 'none') {
              bus.publish(`${this.sidebar}.hide`, null);
            }
            this.sidebar = sidebar;
            bus.publish(`${this.sidebar}.show`, null);
          }
        }
      }

      strongSelect(verseIdx) {
        bus.publish('strong.verse.change', verseIdx);
        bus.publish('strong.task.change', 'strong-verse');
        if (this.sidebar !== 'strong') {
          bus.publish('sidebar.change', 'strong');
        }
      }

      subscribe() {
        bus.subscribe('column.update', (column) => {
          this.columnUpdate(column);
        });

        bus.subscribe('read.bookmark.add', (verseIdx) => {
          this.bookmarkAdd(verseIdx);
        });
        bus.subscribe('read.bookmark.delete', (verseIdx) => {
          this.bookmarkDelete(verseIdx);
        });

        bus.subscribe('read.column.select', (column) => {
          this.columnSelect(column);
        });
        bus.subscribe('read.next.chapter', () => {
          this.nextChapter();
        });
        bus.subscribe('read.prev.chapter', () => {
          this.prevChapter();
        });
        bus.subscribe('read.strong-mode.click', () => {
          this.modeToggle();
        });
        bus.subscribe('read.strong.select', (verseIdx) => {
          this.strongSelect(verseIdx);
        });

        bus.subscribe('sidebar.select', (sidebar) => {
          this.sidebarSelect(sidebar);
        });
        bus.subscribe('sidebar.update', (sidebar) => {
          this.sidebarUpdate(sidebar);
        });

        bus.subscribe('window.resize', () => {
          this.updatePanes();
        });
      }

      updatePanes() {
        this.setPanes();
        if (this.currentPanes !== this.panes) {
          if (this.currentPanes > this.panes) {
            this.decreasePanes();
          } else {
            this.increasePanes();
          }
          this.currentPanes = this.panes;
        }
      }

    }

    const validTasks = ['navigator-book', 'navigator-chapter'];

    const IDX_GENESIS_1 = 0;

    class NavigatorModel {

      constructor() {
        this.initialize();
      }

      async chapterNext() {
        let nextChapterIdx = this.chapterIdx + 1;
        if (nextChapterIdx >= tomeChapters.length) {
          nextChapterIdx = 0;
        }
        await this.chapterIdxChange(nextChapterIdx);
      }

      async chapterPrev() {
        let prevChapterIdx = this.chapterIdx - 1;
        if (prevChapterIdx < 0) {
          prevChapterIdx = tomeChapters.length - 1;
        }
        await this.chapterIdxChange(prevChapterIdx);
      }

      initialize() {
        this.subscribe();
      }

      async chapterIdxChange(chapterIdx) {
        this.chapterIdx = chapterIdx;
        this.saveChapterIdx();
        await this.updateVerses();
        let bookIdx = tomeChapters[this.chapterIdx][chapterBookIdx];
        bus.publish('bookIdx.change', bookIdx);
        bus.publish('chapterIdx.update', this.chapterIdx);
      }

      async restore() {
        this.restoreTask();
        await this.restoreChapterIdx();
      }

      async restoreChapterIdx() {
        let defaultIdx = IDX_GENESIS_1;
        let chapterIdx = localStorage.getItem(`${appPrefix}-chapterIdx`);
        if (!chapterIdx) {
          chapterIdx = defaultIdx;
        } else {
          try {
            chapterIdx = JSON.parse(chapterIdx);
          } catch (error) {
            chapterIdx = defaultIdx;
          }
          if (!tomeChapters.includes(chapterIdx)) {
            chapterIdx = defaultIdx;
          }
        }
        await this.chapterIdxChange(chapterIdx);
      }

      restoreTask() {
        let defaultTask = 'navigator-book';
        let navigatorTask = localStorage.getItem(`${appPrefix}-navigatorTask`);
        if (!navigatorTask) {
          navigatorTask = defaultTask;
        } else {
          try {
            navigatorTask = JSON.parse(navigatorTask);
          } catch (error) {
            navigatorTask = defaultTask;
          }
        }
        if (!validTasks.includes(navigatorTask)) {
          navigatorTask = defaultTask;
        }
        this.taskChange(navigatorTask);
      }

      saveChapterIdx() {
        localStorage.setItem(`${appPrefix}-chapterIdx`,
          JSON.stringify(this.chapterIdx));
      }

      saveNavigatorTask() {
        localStorage.setItem(`${appPrefix}-navigatorTask`,
          JSON.stringify(this.navigatorTask));
      }

      subscribe() {
        bus.subscribe('chapter.next', async () => {
          await this.chapterNext();
        });
        bus.subscribe('chapter.prev', async () => {
          await this.chapterPrev();
        });

        bus.subscribe('chapterIdx.change', async (chapterIdx) => {
          await this.chapterIdxChange(chapterIdx);
        });

        bus.subscribe('navigator.restore', async () => {
          await this.restore();
        });
        bus.subscribe('navigator.task.change', (navigatorTask) => {
          this.taskChange(navigatorTask);
        });
      }

      taskChange(navigatorTask) {
        this.navigatorTask = navigatorTask;
        this.saveNavigatorTask();
        bus.publish('navigator.task.update', this.navigatorTask);
      }

      async updateVerses() {
        let chapter = tomeChapters[this.chapterIdx];
        let keys = range(chapter[chapterFirstVerseIdx],
          chapter[chapterLastVerseIdx] + 1);
        this.verseObjs = await tomeDb.verses.bulkGet(keys);
        bus.publish('navigator.verses.update', this.verseObjs);
      }

    }

    const greekFirstIdx = 39;
    const indices = [...Array(66).keys()];

    const lowerToolSet$1 = [
      { type: 'btn', icon: 'back', label: 'Back' },
      { type: 'btn', icon: 'navigator-chapter', label: 'Chapter' }
    ];

    const upperToolSet$1 = [
      { type: 'banner', modifier: 'navigator-book', text: 'Book' }
    ];

    class NavigatorBookView {

      constructor() {
        this.initialize();
      }

      addListeners() {
        this.list.addEventListener('click', (event) => {
          this.listClick(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      bookChange(bookIdx) {
        let activeBtn = this.list.querySelector('.btn-book--active');
        if (activeBtn) {
          activeBtn.classList.remove('btn-book--active');
        }
        let selector = `.btn-book[data-book-idx="${bookIdx}"]`;
        activeBtn = this.list.querySelector(selector);
        activeBtn.classList.add('btn-book--active');
      }

      buildBookDivider() {
        let divider = document.createElement('hr');
        divider.classList.add('book-divider');
        return divider;
      }

      buildBooklist() {
        let booksHebrew = this.buildHebrewList();
        let booksGreek = this.buildGreekList();
        let divider = this.buildBookDivider();
        this.list.appendChild(booksHebrew);
        this.list.appendChild(divider);
        this.list.appendChild(booksGreek);
      }

      buildBtnBook(bookIdx) {
        let btn = document.createElement('button');
        btn.classList.add('btn-book');
        btn.dataset.bookIdx = bookIdx;
        btn.textContent = tomeBooks[bookIdx][bookShortName];
        btn.setAttribute('aria-label', tomeBooks[bookIdx][bookLongName]);
        return btn;
      }

      buildGreekList() {
        let booksGreek = document.createElement('div');
        booksGreek.classList.add('content', 'content--greek-book');
        let greekIndices = indices.slice(greekFirstIdx);
        for (let idx of greekIndices) {
          let btn = this.buildBtnBook(idx);
          booksGreek.appendChild(btn);
        }
        return booksGreek;
      }

      buildHebrewList() {
        let booksHebrew = document.createElement('div');
        booksHebrew.classList.add('content', 'content--hebrew-book');
        let hebrewIndices = indices.slice(0, greekFirstIdx);
        for (let idx of hebrewIndices) {
          let btn = this.buildBtnBook(idx);
          booksHebrew.appendChild(btn);
        }
        return booksHebrew;
      }

      buildPage() {
        this.page = templatePage('navigator-book');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$1);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('navigator-book');
        this.list = templateElement('div', 'list', 'navigator-book', null, null);
        this.scroll.appendChild(this.list);
        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet$1);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      contentClick(btn) {
        let bookIdx = parseInt(btn.dataset.bookIdx);
        bus.publish('navigator-book.select', bookIdx);
      }

      getElements() {
        this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
        this.btnChapter = this.toolbarLower.querySelector('.btn-icon--navigator-chapter');
      }

      hide() {
        this.page.classList.add('page--hide');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();

        this.buildBooklist();
      }

      listClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target.classList.contains('btn-book')) {
            this.contentClick(target);
          }
        }
      }

      show() {
        this.page.classList.remove('page--hide');
      }

      panesUpdate(panes) {
        if (panes === 1) {
          this.btnBack.classList.remove('btn-icon--hide');
        } else {
          this.btnBack.classList.add('btn-icon--hide');
        }
      }

      subscribe() {
        bus.subscribe('bookIdx.change', (bookIdx) => {
          this.bookChange(bookIdx);
        });

        bus.subscribe('navigator-book.hide', () => {
          this.hide();
        });
        bus.subscribe('navigator-book.show', () => {
          this.show();
        });

        bus.subscribe('panes.update', (panes) => {
          this.panesUpdate(panes);
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnBack) {
            bus.publish('navigator.back', null);
          } else if (target === this.btnChapter) {
            bus.publish('navigator-chapter', null);
          }
        }
      }

    }

    const lowerToolSet$2 = [
      { type: 'btn', icon: 'back', label: 'Back' },
      { type: 'btn', icon: 'navigator-book', label: 'Book' }
    ];

    const upperToolSet$2 = [
      { type: 'banner', modifier: 'navigator-chapter', text: null }
    ];

    class NavigatorChapterView {

      constructor() {
        this.initialize();
      }

      addListeners() {
        this.list.addEventListener('click', (event) => {
          this.listClick(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      buildBtnContent(chapterIdx) {
        let chapter = tomeChapters[chapterIdx];
        let btn = document.createElement('button');
        btn.classList.add('btn-chapter');
        btn.dataset.bookIdx = chapter[chapterBookIdx];
        btn.dataset.chapterIdx = chapterIdx;
        btn.dataset.chapterName = chapter[chapterName];
        let num = chapter[chapterNum];
        btn.textContent = num;
        btn.setAttribute('aria-label', num);
        return btn;
      }

      bookChange(bookIdx) {
        if (this.bookIdx !== bookIdx) {
          this.bookIdx = bookIdx;
          this.updateBanner();
          this.updateChapterList();
        }
      }

      buildPage() {
        this.page = templatePage('navigator-chapter');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$2);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('navigator-chapter');
        this.list = templateElement('div', 'list', 'navigator-chapter', null, null);
        this.scroll.appendChild(this.list);
        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet$2);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      chapterIdxUpdate(chapterIdx) {
        let oldChapterIdx = this.chapterIdx || chapterIdx;
        let oldBookIdx = tomeChapters[oldChapterIdx][chapterBookIdx];
        this.chapterIdx = chapterIdx;
        let bookIdx = tomeChapters[this.chapterIdx][chapterBookIdx];
        if (oldBookIdx !== bookIdx) {
          this.updateBanner();
          this.updateChapterList();
        }
        this.updateActive();
      }

      contentClick(btn) {
        let chapterIdx = parseInt(btn.dataset.chapterIdx);
        bus.publish('navigator-chapter.select', chapterIdx);
      }

      getElements() {
        this.banner = this.toolbarUpper.querySelector('.banner--navigator-chapter');

        this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
        this.btnBook = this.toolbarLower.querySelector('.btn-icon--navigator-book');
      }

      hide() {
        this.page.classList.add('page--hide');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
      }

      listClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target.classList.contains('btn-chapter')) {
            this.contentClick(target);
          }
        }
      }

      panesUpdate(panes) {
        if (panes === 1) {
          this.btnBack.classList.remove('btn-icon--hide');
        } else {
          this.btnBack.classList.add('btn-icon--hide');
        }
      }

      scrollToTop() {
        this.scroll.scrollTop = 0;
      }

      show() {
        this.page.classList.remove('page--hide');
      }

      subscribe() {
        bus.subscribe('bookIdx.change', (bookIdx) => {
          this.bookChange(bookIdx);
        });

        bus.subscribe('chapterIdx.update', (chapterIdx) => {
          this.chapterIdxUpdate(chapterIdx);
        });

        bus.subscribe('navigator-chapter.hide', () => {
          this.hide();
        });
        bus.subscribe('navigator-chapter.show', () => {
          this.show();
        });

        bus.subscribe('panes.update', (panes) => {
          this.panesUpdate(panes);
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnBack) {
            bus.publish('navigator.back', null);
          } else if (target === this.btnBook) {
            bus.publish('navigator-book', null);
          }
        }
      }

      updateActive() {
        let activeBtn = this.list.querySelector('.btn-chapter--active');
        if (activeBtn) {
          activeBtn.classList.remove('btn-chapter--active');
        }
        let selector =
          `.btn-chapter[data-chapter-idx="${this.chapterIdx}"]`;
        activeBtn = this.list.querySelector(selector);
        activeBtn.classList.add('btn-chapter--active');
      }

      updateBanner() {
        let longName = tomeBooks[this.bookIdx][bookLongName];
        this.banner.innerHTML = `${longName}`;
      }

      updateChapterList() {
        this.scrollToTop();
        removeAllChildren(this.list);
        let list = document.createElement('div');
        list.classList.add('content', 'content--chapter');
        let book = tomeBooks[this.bookIdx];
        let indices = range(book[bookFirstChapterIdx],
          book[bookLastChapterIdx] + 1);
        for (let idx of indices) {
          let btn = this.buildBtnContent(idx);
          list.appendChild(btn);
        }
        this.list.appendChild(list);
      }

    }

    class NavigatorController {

      constructor() {
        this.initialize();
      }

      back() {
        bus.publish('sidebar.change', 'none');
      }

      book() {
        bus.publish('navigator.task.change', 'navigator-book');
      }

      bookSelect(bookIdx) {
        if (bookIdx !== this.lastBookIdx) {
          bus.publish('bookIdx.change', bookIdx);
        }
        this.lastBookIdx = bookIdx;
        let book = tomeBooks[bookIdx];
        let chapterCount =
          book[bookLastChapterIdx] - book[bookFirstChapterIdx] + 1;
        if (this.panes > 1 || chapterCount === 1) {
          let chapterIdx = tomeBooks[bookIdx][bookFirstChapterIdx];
          bus.publish('chapterIdx.change', chapterIdx);
        }
        if (this.panes === 1 && chapterCount === 1) {
          bus.publish('sidebar.change', 'none');
        } else {
          bus.publish('navigator.task.change', 'navigator-chapter');
        }
      }

      chapter() {
        bus.publish('navigator.task.change', 'navigator-chapter');
      }

      chapterIdxUpdate() {
        if (this.panes === 1 && this.sidebar === 'navigator') {
          bus.publish('sidebar.select', 'none');
        }
        bus.publish('read.scroll-to-top');
      }

      chapterSelect(chapterIdx) {
        bus.publish('chapterIdx.change', chapterIdx);
      }

      hide() {
        bus.publish(`${this.navigatorTask}.hide`, null);
      }

      initialize() {
        this.subscribe();
        this.lastBookIdx = null;
      }

      panesUpdate(panes) {
        this.panes = panes;
      }

      show() {
        bus.publish(`${this.navigatorTask}.show`, null);
      }

      sidebarUpdate(sidebar) {
        this.sidebar = sidebar;
      }

      subscribe() {
        bus.subscribe('chapterIdx.update', () => {
          this.chapterIdxUpdate();
        });

        bus.subscribe('navigator-book', () => {
          this.book();
        });
        bus.subscribe('navigator-book.select', (bookIdx) => {
          this.bookSelect(bookIdx);
        });

        bus.subscribe('navigator-chapter', () => {
          this.chapter();
        });
        bus.subscribe('navigator-chapter.select', (chapterIdx) => {
          this.chapterSelect(chapterIdx);
        });

        bus.subscribe('navigator.back', () => {
          this.back();
        });
        bus.subscribe('navigator.hide', () => {
          this.hide();
        });
        bus.subscribe('navigator.show', () => {
          this.show();
        });
        bus.subscribe('navigator.task.update', (navigatorTask) => {
          this.taskUpdate(navigatorTask);
        });

        bus.subscribe('panes.update', (panes) => {
          this.panesUpdate(panes);
        });

        bus.subscribe('sidebar.update', (sidebar) => {
          this.sidebarUpdate(sidebar);
        });
      }

      taskUpdate(navigatorTask) {
        if (this.sidebar === 'navigator') {
          bus.publish(`${this.navigatorTask}.hide`, null);
          this.navigatorTask = navigatorTask;
          bus.publish(`${this.navigatorTask}.show`, null);
        } else {
          this.navigatorTask = navigatorTask;
        }
      }

    }

    const numSortAscend = (a, b) => a - b;

    const bookmarkFolderReroute = ['bookmark-folder-add', 'bookmark-folder-delete',
      'bookmark-folder-rename', 'bookmark-export', 'bookmark-import'
    ];
    const bookmarkListReroute = ['bookmark-move-copy'];
    const validTasks$1 = ['bookmark-list', 'bookmark-folder'];

    const firstEntry = 0;

    class BookmarkModel {

      constructor() {
        this.initialize();
      }

      activeFolderIsValid(activeFolder) {
        return this.folders.some((folder) => {
          return folder.folderName === activeFolder.folderName;
        });
      }

      add(verseIdx) {
        let bookmarks = this.folder.bookmarks;
        if (bookmarks.indexOf(verseIdx) === -1) {
          this.folder.bookmarks = [verseIdx, ...bookmarks];
          this.updateFolder();
        }
      }

      changeActiveFolder(folderName) {
        this.folder = this.getFolder(folderName);
        this.activeFolder = folderName;
        this.saveActiveFolder();
        this.updateFolder();
      }

      copy(copyPkg) {
        let toFolder = this.getFolder(copyPkg.to);
        toFolder.bookmarks = [copyPkg.verseIdx, ...toFolder.bookmarks];
        this.updateFolder();
      }

      createFolder(folderName) {
        return {
          name: folderName,
          bookmarks: []
        };
      }

      createFolders() {
        return [this.createFolder('Default')];
      }

      delete(verseIdx) {
        let bookmarks = this.folder.bookmarks;
        let index = bookmarks.indexOf(verseIdx);
        if (index !== -1) {
          bookmarks.splice(index, 1);
          this.updateFolder();
        }
      }

      down(verseIdx) {
        let bookmarks = this.folder.bookmarks;
        let index = bookmarks.indexOf(verseIdx);
        if (index !== bookmarks.length - 1 && index !== -1) {
          this.reorderBookmarks(index, index + 1);
        }
      }

      folderAdd(folderName) {
        let newFolder = this.getFolder(folderName);
        if (!newFolder) {
          newFolder = this.createFolder(folderName);
          this.folders = [newFolder, ...this.folders];
          this.folder = this.folders[firstEntry];
          this.activeFolder = folderName;
          this.saveActiveFolder();
          this.updateFolder();
          bus.publish('folder.added', null);
        }
      }

      folderChange(folderName) {
        this.folder = this.getFolder(folderName);
        this.activeFolder = folderName;
        this.updateFolder();
      }

      folderDelete(folderName) {
        let idx = this.getFolderIdx(folderName);
        this.folders.splice(idx, 1);
        bus.publish('folder.list.update', this.getFolderList());
        this.resetFolder();
      }

      folderDown(folderName) {
        let index = this.folders.findIndex((folder) => folder.name === folderName);
        if (index !== this.folders.length - 1 && index !== -1) {
          this.reorderFolders(index, index + 1);
          bus.publish('folder.list.update', this.getFolderList());
        }
      }

      folderImport(pkgStr) {
        let bookmarkPkg = this.getBookmarkPkg(pkgStr);
        if (!bookmarkPkg) {
          bus.publish('bookmark-import.message', 'Invalid JSON string');
        } else {
          let status = this.validatePkg(bookmarkPkg);
          if (status === 'OK') {
            status = this.foldersAreValid(bookmarkPkg.folders);
          }
          if (status === 'OK') {
            this.importPkg(bookmarkPkg);
          } else {
            bus.publish('bookmark-import.message', status);
          }
        }
      }

      folderRename(namePkg) {
        let oldFolder = this.getFolder(namePkg.old);
        oldFolder.name = namePkg.new;
        this.activeFolder = namePkg.new;
        this.saveActiveFolder();
        this.updateFolder();
      }

      foldersAreValid(folders) {
        let status = 'OK';
        let error = false;
        try {
          folders.some((folder) => {
            if (
              !folder.name ||
              typeof folder.name !== 'string' ||
              !folder.bookmarks ||
              !Array.isArray(folder.bookmarks)
            ) {
              status = 'Invalid folder structure';
              error = true;
            }
            if (!error) {
              error = folder.bookmarks.some((bookmark) => {
                if (
                  !Number.isInteger(bookmark) ||
                  bookmark < 0 ||
                  bookmark > this.maxIdx
                ) {
                  status = 'Invalid verse';
                  error = true;
                }
                return error;
              });
            }
            return error;
          });
        } catch (error) {
          status = 'ERROR';
        }
        return status;
      }

      folderUp(folderName) {
        let index = this.folders.findIndex((folder) => folder.name === folderName);
        if (index !== 0 && index !== -1) {
          this.reorderFolders(index, index - 1);
          bus.publish('folder.list.update', this.getFolderList());
        }
      }

      getBookmarkPkg(pkgStr) {
        let bookmarkPkg;
        try {
          bookmarkPkg = JSON.parse(pkgStr);
        } catch (error) {
          bookmarkPkg = null;
        }
        return bookmarkPkg;
      }

      getFolder(folderName) {
        return this.folders.find((folder) => {
          return folder.name === folderName;
        });
      }

      getFolderIdx(folderName) {
        return this.folders.findIndex((folder) => {
          return folder.name === folderName;
        });
      }

      getFolderList() {
        return this.folders.map((folder) => folder.name);
      }

      importPkg(bookmarkPkg) {
        for (let folder of bookmarkPkg.folders) {
          let targetFolder = this.getFolder(folder.name);
          if (!targetFolder) {
            targetFolder = this.createFolder(folder.name);
            this.folders = [targetFolder, ...this.folders];
          }
          for (let verseIdx of folder.bookmarks) {
            let bookmarks = targetFolder.bookmarks;
            if (bookmarks.indexOf(verseIdx) !== -1) {
              continue;
            }
            targetFolder.bookmarks = [verseIdx, ...bookmarks];
          }
        }
        this.updateFolder();
        bus.publish('bookmark-import.message', 'Import successful.');
      }

      initialize() {
        this.maxIdx = tomeVerseCount - 1;
        this.subscribe();
      }

      modeChange(strongMode) {
        this.strongMode = strongMode;
        this.saveMode();
        bus.publish('bookmark.strong-mode.update', this.strongMode);
      }

      modeToogle() {
        this.modeChange(!this.strongMode);
      }

      move(movePkg) {
        let toFolder = this.getFolder(movePkg.to);
        toFolder.bookmarks = [movePkg.verseIdx, ...toFolder.bookmarks];

        let bookmarks = this.folder.bookmarks;
        let index = bookmarks.indexOf(movePkg.verseIdx);
        if (index !== -1) {
          bookmarks.splice(index, 1);
          this.updateFolder();
        }
      }

      async moveCopyChange(verseIdx) {
        this.moveCopyVerseObj = await tomeDb.verses.get(verseIdx);
        bus.publish('bookmark.move-copy.update', this.moveCopyVerseObj);
      }

      moveCopyListChange(verseIdx) {
        let foldersNotFoundIn = this.folders.filter(
          (folder) => !folder.bookmarks.some((element) => element === verseIdx)
        );
        let moveCopyList = foldersNotFoundIn.map((folder) => folder.name);
        bus.publish('bookmark-move-copy.list.update', moveCopyList);
      }

      reorderBookmarks(fromIdx, toIdx) {
        let bookmarks = this.folder.bookmarks;
        bookmarks.splice(
          toIdx, 0, bookmarks.splice(fromIdx, 1)[firstEntry]
        );
        this.updateFolder();
      }

      reorderFolders(fromIdx, toIdx) {
        this.folders.splice(
          toIdx, 0, this.folders.splice(fromIdx, 1)[firstEntry]
        );
        this.updateFolder();
        this.updateFolderList();
      }

      resetFolder() {
        if (this.folders.length === 0) {
          this.folderAdd('Default');
        }
        let firstFolder = this.folders[firstEntry].name;
        this.folderChange(firstFolder);
      }

      restore() {
        this.restoreFolders();
        this.restoreActiveFolder();
        this.restoreMode();
        this.restoreTask();
      }

      restoreActiveFolder() {
        let defaultFolder = 'Default';
        let activeFolder = localStorage.getItem(`${appPrefix}-activeFolder`);
        if (!activeFolder) {
          activeFolder = defaultFolder;
        } else {
          try {
            activeFolder = JSON.parse(activeFolder);
          } catch (error) {
            activeFolder = defaultFolder;
          }
          if (!this.activeFolderIsValid(activeFolder)) {
            activeFolder = defaultFolder;
          }
        }
        this.changeActiveFolder(activeFolder);
      }

      restoreFolders() {
        let defaultFolders = this.createFolders();
        let folders = localStorage.getItem(`${appPrefix}-folders`);
        if (!folders) {
          folders = defaultFolders;
        } else {
          try {
            folders = JSON.parse(folders);
          } catch (error) {
            folders = defaultFolders;
          }
          if (!this.foldersAreValid(folders)) {
            folders = defaultFolders;
          }
        }
        this.folders = folders;
      }

      restoreMode() {
        let defaultMode = false;
        let strongMode = localStorage.getItem(`${appPrefix}-bookmarkStrongMode`);
        if (!strongMode) {
          strongMode = defaultMode;
        } else {
          try {
            strongMode = JSON.parse(strongMode);
          } catch (error) {
            strongMode = defaultMode;
          }
          if (typeof strongMode !== 'boolean') {
            strongMode = defaultMode;
          }
        }
        this.modeChange(strongMode);
      }

      restoreTask() {
        let defaultTask = 'bookmark-list';
        let bookmarkTask = localStorage.getItem(`${appPrefix}-bookmarkTask`);
        if (!bookmarkTask) {
          bookmarkTask = defaultTask;
        } else {
          try {
            bookmarkTask = JSON.parse(bookmarkTask);
          } catch (error) {
            bookmarkTask = defaultTask;
          }
          if (bookmarkListReroute.includes(bookmarkTask)) {
            bookmarkTask = 'bookmark-list';
          } else if (bookmarkFolderReroute.includes(bookmarkTask)) {
            bookmarkTask = 'bookmark-folder';
          } else if (!validTasks$1.includes(bookmarkTask)) {
            bookmarkTask = defaultTask;
          }
        }
        this.taskChange(bookmarkTask);
      }

      saveActiveFolder() {
        localStorage.setItem(`${appPrefix}-activeFolder`,
          JSON.stringify(this.activeFolder));
      }

      saveBookmarkTask() {
        localStorage.setItem(`${appPrefix}-bookmarkTask`,
          JSON.stringify(this.bookmarkTask));
      }

      saveFolders() {
        localStorage.setItem(`${appPrefix}-folders`, JSON.stringify(this.folders));
        bus.publish('folders.update', this.folders);
      }

      saveMode() {
        localStorage.setItem(`${appPrefix}-bookmarkStrongMode`,
          JSON.stringify(this.strongMode));
      }

      sort(sorter) {
        let bookmarks = this.folder.bookmarks;
        if (bookmarks.length !== 0) {
          bookmarks.sort(sorter);
          this.updateFolder();
        }
      }

      sortInvert() {
        let bookmarks = this.folder.bookmarks;
        bookmarks.reverse();
        this.updateFolder();
      }

      subscribe() {
        bus.subscribe('bookmark.add', (verseIdx) => {
          this.add(verseIdx);
        });
        bus.subscribe('bookmark.copy', (copyPkg) => {
          this.copy(copyPkg);
        });
        bus.subscribe('bookmark.delete', (verseIdx) => {
          this.delete(verseIdx);
        });
        bus.subscribe('bookmark.down', (verseIdx) => {
          this.down(verseIdx);
        });
        bus.subscribe('bookmark.move', (movePkg) => {
          this.move(movePkg);
        });
        bus.subscribe('bookmark.restore', () => {
          this.restore();
        });
        bus.subscribe('bookmark.sort-ascend', () => {
          this.sort(numSortAscend);
        });
        bus.subscribe('bookmark.sort-invert', () => {
          this.sortInvert();
        });
        bus.subscribe('bookmark.strong-mode.toggle', () => {
          this.modeToogle();
        });
        bus.subscribe('bookmark.task.change', (bookmarkTask) => {
          this.taskChange(bookmarkTask);
        });
        bus.subscribe('bookmark.up', (verseIdx) => {
          this.up(verseIdx);
        });

        bus.subscribe('folder.add', (folderName) => {
          this.folderAdd(folderName);
        });
        bus.subscribe('folder.change', (folderName) => {
          this.folderChange(folderName);
        });
        bus.subscribe('folder.delete', (folderName) => {
          this.folderDelete(folderName);
        });
        bus.subscribe('folder.down', (folderName) => {
          this.folderDown(folderName);
        });
        bus.subscribe('folder.import', (pkgStr) => {
          this.folderImport(pkgStr);
        });
        bus.subscribe('folder.rename', (namePkg) => {
          this.folderRename(namePkg);
        });
        bus.subscribe('folder.up', (folderName) => {
          this.folderUp(folderName);
        });

        bus.subscribe('move-copy.list.change', (verseIdx) => {
          this.moveCopyListChange(verseIdx);
        });

        bus.subscribe('bookmark.move-copy.change', async (verseIdx) => {
          await this.moveCopyChange(verseIdx);
        });
      }

      taskChange(bookmarkTask) {
        this.bookmarkTask = bookmarkTask;
        this.saveBookmarkTask();
        bus.publish('bookmark.task.update', this.bookmarkTask);
      }

      up(verseIdx) {
        let bookmarks = this.folder.bookmarks;
        let index = bookmarks.indexOf(verseIdx);
        if (index !== 0 && index !== -1) {
          this.reorderBookmarks(index, index - 1);
        }
      }

      updateFolder() {
        this.saveFolders();
        this.saveActiveFolder();
        bus.publish('folder.update', this.folder);
        bus.publish('folder.list.update', this.getFolderList());
      }

      updateFolderList() {
        this.saveFolders();
        bus.publish('folder.list.update', this.getFolderList());
      }

      validatePkg(bookmarkPkg) {
        let status = 'OK';
        if (
          !bookmarkPkg.tome ||
          !bookmarkPkg.folders ||
          !Array.isArray(bookmarkPkg.folders)
        ) {
          status = 'Invalid package structure';
        }
        if (bookmarkPkg.tome !== tomeName) {
          status = 'Tome mismatch';
        }
        return status;
      }
    }

    const actionSet = [
      { icon: 'up', label: 'Up' },
      { icon: 'down', label: 'Down' },
      { icon: 'move-copy', label: 'Move/Copy' },
      { icon: 'delete', label: 'Delete' },
      { icon: 'cancel', label: 'Cancel' }
    ];

    const lowerToolSet$3 = [
      { type: 'btn', icon: 'back', label: 'Back' },
      { type: 'btn', icon: 'sort-ascend', label: 'Sort Ascending' },
      { type: 'btn', icon: 'sort-invert', label: 'Sort Invert' },
      { type: 'btn', icon: 'bookmark-folder', label: 'Bookmark Folder' },
      { type: 'btn', icon: 'strong-mode', label: 'Strong Mode' }
    ];

    const upperToolSet$3 = [
      { type: 'banner', modifier: 'bookmark-list', text: null },
    ];

    class BookmarkListView {

      constructor() {
        this.initialize();
      }

      actionMenuClick(event) {
        event.preventDefault();
        let btn = event.target.closest('button');
        if (btn === this.btnCancel) {
          this.actionMenu.classList.add('action-menu--hide');
        } else {
          let btnEntry = this.activeEntry.querySelector('.btn-entry');
          let verseIdx = parseInt(btnEntry.dataset.verseIdx);
          if (btn === this.btnUp) {
            this.up(verseIdx);
          } else if (btn === this.btnDown) {
            this.down(verseIdx);
          } else if (btn === this.btnMoveCopy) {
            this.moveCopy(verseIdx);
          } else if (btn === this.btnDelete) {
            this.delete(verseIdx);
          }
          this.actionMenu.classList.add('action-menu--hide');
        }
      }

      addListeners() {
        this.actionMenu.addEventListener('click', (event) => {
          this.actionMenuClick(event);
        });
        this.list.addEventListener('click', (event) => {
          this.listClick(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      buildEntry(verseIdx) {
        let entry = document.createElement('div');
        entry.classList.add('entry', 'entry--bookmark');
        let btnRef = document.createElement('button');
        btnRef.classList.add('btn-entry', 'btn-entry--bookmark');
        btnRef.textContent = citationByVerseIdx(verseIdx);
        btnRef.dataset.verseIdx = verseIdx;
        entry.appendChild(btnRef);
        let btnMenu = templateBtnIcon('menu', 'Menu');
        entry.appendChild(btnMenu);
        return entry;
      }

      buildPage() {
        this.page = templatePage('bookmark-list');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$3);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('bookmark-list');

        this.empty = templateElement('div', 'empty', 'bookmark-list', null,
          'No bookmarks saved.');
        this.scroll.appendChild(this.empty);

        this.list = templateElement('div', 'list', 'bookmark-list', null, null);
        this.scroll.appendChild(this.list);

        this.actionMenu = templateActionMenu('bookmark-list', actionSet);
        this.scroll.appendChild(this.actionMenu);

        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet$3);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      delete(verseIdx) {
        bus.publish('bookmark-list.delete', verseIdx);
      }

      down(verseIdx) {
        bus.publish('bookmark-list.down', verseIdx);
      }

      getElements() {
        this.btnFolderAdd = this.toolbarUpper.querySelector(
          '.btn-icon--folder-add');
        this.banner = this.toolbarUpper.querySelector('.banner--bookmark-list');

        this.btnUp = this.actionMenu.querySelector('.btn-icon--up');
        this.btnDown = this.actionMenu.querySelector('.btn-icon--down');
        this.btnMoveCopy = this.actionMenu.querySelector('.btn-icon--move-copy');
        this.btnDelete = this.actionMenu.querySelector('.btn-icon--delete');
        this.btnCancel = this.actionMenu.querySelector('.btn-icon--cancel');

        this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
        this.btnSortAscend = this.toolbarLower.querySelector(
          '.btn-icon--sort-ascend');
        this.btnSortInvert = this.toolbarLower.querySelector(
          '.btn-icon--sort-invert');
        this.btnStrongMode = this.toolbarLower.querySelector(
          '.btn-icon--strong-mode');
        this.btnBookmarkFolder = this.toolbarLower.querySelector(
          '.btn-icon--bookmark-folder');
      }

      hide() {
        this.actionMenu.classList.add('action-menu--hide');
        this.page.classList.add('page--hide');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
      }

      listClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target.classList.contains('btn-entry')) {
            let verseIdx = parseInt(target.dataset.verseIdx);
            if (this.strongMode) {
              bus.publish('bookmark-list.strong-select', verseIdx);
            } else {
              bus.publish('bookmark-list.select', verseIdx);
            }
          } else if (target.classList.contains('btn-icon--menu')) {
            let ref = target.previousSibling;
            this.menuClick(ref);
          }
        }
      }

      menuClick(target) {
        this.showActionMenu(target);
      }

      modeUpdate(strongMode) {
        this.strongMode = strongMode;
        if (this.strongMode) {
          this.btnStrongMode.classList.add('btn-icon--active');
        } else {
          this.btnStrongMode.classList.remove('btn-icon--active');
        }
      }

      moveCopy(verseIdx) {
        bus.publish('bookmark-move-copy', verseIdx);
      }

      panesUpdate(panes) {
        if (panes === 1) {
          this.btnBack.classList.remove('btn-icon--hide');
        } else {
          this.btnBack.classList.add('btn-icon--hide');
        }
      }

      scrollToTop() {
        this.scroll.scrollTop = 0;
      }

      show() {
        this.page.classList.remove('page--hide');
      }

      showActionMenu(target) {
        this.activeEntry = target.closest('div');
        let top = target.offsetTop;
        this.actionMenu.style.top = `${top}px`;
        this.actionMenu.classList.remove('action-menu--hide');
      }

      subscribe() {
        bus.subscribe('bookmark-list.hide', () => {
          this.hide();
        });
        bus.subscribe('bookmark-list.show', () => {
          this.show();
        });

        bus.subscribe('bookmark.strong-mode.update', (strongMode) => {
          this.modeUpdate(strongMode);
        });

        bus.subscribe('folder.update', (folder) => {
          this.updateFolder(folder);
        });

        bus.subscribe('panes.update', (panes) => {
          this.panesUpdate(panes);
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnBack) {
            bus.publish('bookmark.back', null);
          } else if (target === this.btnSortAscend) {
            bus.publish('bookmark-list.sort-ascend', null);
          } else if (target === this.btnSortInvert) {
            bus.publish('bookmark-list.sort-invert', null);
          } else if (target === this.btnStrongMode) {
            bus.publish('bookmark.strong-mode.click', null);
          } else if (target === this.btnBookmarkFolder) {
            bus.publish('bookmark-folder', null);
          }
        }
      }

      up(verseIdx) {
        bus.publish('bookmark-list.up', verseIdx);
      }

      updateBanner() {
        this.banner.innerHTML = `${this.folder.name}`;
      }

      updateFolder(folder) {
        this.folder = folder;
        this.updateBanner();
        this.updateList();
      }

      updateList() {
        this.scrollToTop();
        removeAllChildren(this.list);
        if (this.folder.bookmarks.length === 0) {
          this.empty.classList.remove('empty--hide');
        } else {
          this.empty.classList.add('empty--hide');
          let fragment = document.createDocumentFragment();
          for (let verseIdx of this.folder.bookmarks) {
            let ref = this.buildEntry(verseIdx);
            fragment.appendChild(ref);
          }
          this.list.appendChild(fragment);
        }
      }

    }

    const actionSet$1 = [
      { icon: 'move', label: 'Move' },
      { icon: 'copy', label: 'Copy' },
      { icon: 'cancel', label: 'Cancel' }
    ];

    const lowerToolSet$4 = [
      { type: 'btn', icon: 'bookmark-folder', label: 'Bookmark Folder' },
    ];

    const upperToolSet$4 = [
      { type: 'banner', modifier: 'bookmark-move-copy', text: null }
    ];

    class BookmarkMoveCopyView {

      constructor() {
        this.initialize();
      }

      actionMenuClick(event) {
        event.preventDefault();
        let btn = event.target.closest('button');
        if (btn) {
          if (btn === this.btnCancel) {
            this.actionMenu.classList.add('action-menu--hide');
          } else {
            let entry = this.activeEntry.querySelector('.btn-entry');
            let folderName = entry.textContent;
            if (btn === this.btnCopy) {
              this.copy(folderName);
            } else if (btn === this.btnMove) {
              this.move(folderName);
            }
            this.actionMenu.classList.add('action-menu--hide');
          }
        }
      }

      addListeners() {
        this.actionMenu.addEventListener('click', (event) => {
          this.actionMenuClick(event);
        });
        this.list.addEventListener('click', (event) => {
          this.listClick(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      buildEntry(folderName) {
        let entry = document.createElement('div');
        entry.classList.add('entry', 'entry--bookmark-move-copy');
        let btnEntry = document.createElement('button');
        btnEntry.classList.add('btn-entry', 'btn-entry--bookmark-move-copy');
        btnEntry.textContent = folderName;
        let btnMenu = templateBtnIcon('menu', 'Menu');
        entry.appendChild(btnEntry);
        entry.appendChild(btnMenu);
        return entry;
      }

      buildPage() {
        this.page = templatePage('bookmark-move-copy');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$4);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('bookmark-move-copy');

        this.empty = templateElement('div', 'empty', 'bookmark-move-copy', null,
          'No Target Folder.');
        this.scroll.appendChild(this.empty);

        this.list = templateElement('div', 'list', 'bookmark-move-copy', null,
          null);
        this.scroll.appendChild(this.list);

        this.actionMenu = templateActionMenu('bookmark-move-copy', actionSet$1);
        this.scroll.appendChild(this.actionMenu);
        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet$4);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      copy(folderName) {
        let copyPkg = {
          to: folderName,
          verseIdx: this.verseIdx
        };
        bus.publish('bookmark-move-copy.copy', copyPkg);
      }

      folderUpdate(bookmarksFolder) {
        this.bookmarksFolder = bookmarksFolder;
      }

      getElements() {
        this.banner = this.toolbarUpper.querySelector(
          '.banner--bookmark-move-copy');

        this.btnMove = this.actionMenu.querySelector('.btn-icon--move');
        this.btnCopy = this.actionMenu.querySelector('.btn-icon--copy');
        this.btnCancel = this.actionMenu.querySelector('.btn-icon--cancel');

        this.btnBookmarkFolder = this.toolbarLower.querySelector(
          '.btn-icon--bookmark-folder');
      }

      hide() {
        this.actionMenu.classList.add('action-menu--hide');
        this.page.classList.add('page--hide');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
      }

      listClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target.classList.contains('btn-icon--menu')) {
            let entry = target.previousSibling;
            this.menuClick(entry);
          }
        }
      }

      listUpdate(moveCopyList) {
        this.moveCopyList = moveCopyList;
        this.updateList();
      }

      menuClick(target) {
        this.showActionMenu(target);
      }

      move(folderName) {
        let movePkg = {
          to: folderName,
          verseIdx: this.verseIdx
        };
        bus.publish('bookmark-move-copy.move', movePkg);
      }

      moveCopyUpdate(verseObj) {
        this.moveCopyVerseObj = verseObj;
        this.verseIdx = this.moveCopyVerseObj.k;
        this.verse = this.moveCopyVerseObj.v;
        bus.publish('bookmark-move-copy.ready', null);
      }

      scrollToTop() {
        this.scroll.scrollTop = 0;
      }

      show() {
        this.updateBanner();
        this.page.classList.remove('page--hide');
      }

      showActionMenu(target) {
        this.activeEntry = target.closest('div');
        let top = target.offsetTop;
        this.actionMenu.style.top = `${top}px`;
        this.actionMenu.classList.remove('action-menu--hide');
      }

      subscribe() {
        bus.subscribe('folder.update', (bookmarksFolder) => {
          this.folderUpdate(bookmarksFolder);
        });

        bus.subscribe('bookmark-move-copy.hide', () => {
          this.hide();
        });
        bus.subscribe('bookmark-move-copy.list.update', (moveCopyList) => {
          this.listUpdate(moveCopyList);
        });
        bus.subscribe('bookmark-move-copy.show', () => {
          this.show();
        });

        bus.subscribe('bookmark.move-copy.update', (verseObj) => {
          this.moveCopyUpdate(verseObj);
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnBookmarkFolder) {
            bus.publish('bookmark-folder', null);
          }
        }
      }

      updateBanner() {
        let ref = this.verse[verseCitation];
        this.banner.innerHTML = `${ref} <br> Move/Copy to Folder:`;
      }

      updateList() {
        this.scrollToTop();
        removeAllChildren(this.list);
        if (this.moveCopyList.length === 0) {
          this.empty.classList.remove('empty--hide');
        } else {
          this.empty.classList.add('empty--hide');
          let fragment = document.createDocumentFragment();
          for (let folderName of this.moveCopyList) {
            let entry = this.buildEntry(folderName);
            fragment.appendChild(entry);
          }
          this.list.appendChild(fragment);
        }
      }

    }

    const actionSet$2 = [
      { icon: 'up', label: 'Up' },
      { icon: 'down', label: 'Down' },
      { icon: 'rename', label: 'Rename' },
      { icon: 'delete', label: 'Delete' },
      { icon: 'cancel', label: 'Cancel' }
    ];

    const lowerToolSet$5 = [
      { type: 'btn', icon: 'back', label: 'Back' },
      { type: 'btn', icon: 'bookmark-folder-add', label: 'Bookmark Folder Add' },
      { type: 'btn', icon: 'import', label: 'Import' },
      { type: 'btn', icon: 'export', label: 'Export' },
      { type: 'btn', icon: 'bookmark-list', label: 'Bookmark List' }
    ];

    const upperToolSet$5 = [
      { type: 'banner', modifier: 'bookmark-folder', text: 'Bookmark Folder' }
    ];

    class BookmarkFolderView {

      constructor() {
        this.initialize();
      }

      actionMenuClick(event) {
        event.preventDefault();
        let btn = event.target.closest('button');
        if (btn) {
          if (btn === this.btnCancel) {
            this.actionMenu.classList.add('action-menu--hide');
          } else {
            let entry = this.activeEntry.querySelector('.btn-entry');
            let folderName = entry.textContent;
            if (btn === this.btnDelete) {
              this.delete(folderName);
            } else if (btn === this.btnDown) {
              this.down(folderName);
            } else if (btn === this.btnRename) {
              this.rename(folderName);
            } else if (btn === this.btnUp) {
              this.up(folderName);
            }
            this.actionMenu.classList.add('action-menu--hide');
          }
        }
      }

      addListeners() {
        this.actionMenu.addEventListener('click', (event) => {
          this.actionMenuClick(event);
        });
        this.list.addEventListener('click', (event) => {
          this.listClick(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      buildEntry(folderName) {
        let entry = document.createElement('div');
        entry.classList.add('entry', 'entry--folder');
        let btnEntry = document.createElement('button');
        btnEntry.classList.add('btn-entry', 'btn-entry--folder');
        btnEntry.textContent = folderName;
        let btnMenu = templateBtnIcon('menu', 'Menu');
        entry.appendChild(btnEntry);
        entry.appendChild(btnMenu);
        return entry;
      }

      buildPage() {
        this.page = templatePage('bookmark-folder');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$5);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('bookmark-folder');

        this.list = templateElement('div', 'list', 'bookmark-folder', null, null);
        this.scroll.appendChild(this.list);

        this.actionMenu = templateActionMenu('bookmark-folder', actionSet$2);
        this.scroll.appendChild(this.actionMenu);
        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet$5);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      delete(folderName) {
        bus.publish('bookmark-folder.delete', folderName);
      }

      down(folderName) {
        bus.publish('bookmark-folder.down', folderName);
      }

      getElements() {
        this.btnUp = this.actionMenu.querySelector('.btn-icon--up');
        this.btnDown = this.actionMenu.querySelector('.btn-icon--down');
        this.btnRename = this.actionMenu.querySelector('.btn-icon--rename');
        this.btnDelete = this.actionMenu.querySelector('.btn-icon--delete');
        this.btnCancel = this.actionMenu.querySelector('.btn-icon--cancel');

        this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
        this.btnBookmarkList = this.toolbarLower.querySelector(
          '.btn-icon--bookmark-list');
        this.btnBookmarkFolderAdd = this.toolbarLower.querySelector(
          '.btn-icon--bookmark-folder-add');
        this.btnImport = this.toolbarLower.querySelector('.btn-icon--import');
        this.btnExport = this.toolbarLower.querySelector('.btn-icon--export');
      }

      hide() {
        this.actionMenu.classList.add('action-menu--hide');
        this.page.classList.add('page--hide');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
      }

      listClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target.classList.contains('btn-entry')) {
            let folderName = target.textContent;
            bus.publish('bookmark-folder.select', folderName);
          } else if (target.classList.contains('btn-icon--menu')) {
            let entry = target.previousSibling;
            this.menuClick(entry);
          }
        }
      }

      listUpdate(folderList) {
        this.folderList = folderList;
        this.updateList();
      }

      menuClick(target) {
        this.showActionMenu(target);
      }

      panesUpdate(panes) {
        if (panes === 1) {
          this.btnBack.classList.remove('btn-icon--hide');
        } else {
          this.btnBack.classList.add('btn-icon--hide');
        }
      }

      rename(folderName) {
        bus.publish('bookmark-folder-rename', folderName);
      }

      scrollToTop() {
        this.scroll.scrollTop = 0;
      }

      show() {
        this.page.classList.remove('page--hide');
      }

      showActionMenu(target) {
        this.activeEntry = target.closest('div');
        let top = target.offsetTop;
        this.actionMenu.style.top = `${top}px`;
        this.actionMenu.classList.remove('action-menu--hide');
      }

      subscribe() {
        bus.subscribe('bookmark-folder.hide', () => {
          this.hide();
        });
        bus.subscribe('bookmark-folder.show', () => {
          this.show();
        });

        bus.subscribe('folder.list.update', (folderList) => {
          this.listUpdate(folderList);
        });

        bus.subscribe('panes.update', (panes) => {
          this.panesUpdate(panes);
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnBack) {
            bus.publish('bookmark.back', null);
          } else if (target === this.btnBookmarkList) {
            bus.publish('bookmark-list', null);
          } else if (target === this.btnBookmarkFolderAdd) {
            bus.publish('bookmark-folder-add', null);
          } else if (target === this.btnExport) {
            bus.publish('bookmark-export', null);
          } else if (target === this.btnImport) {
            bus.publish('bookmark-import', null);
          }
        }
      }

      up(folderName) {
        bus.publish('bookmark-folder.up', folderName);
      }

      updateList() {
        this.scrollToTop();
        removeAllChildren(this.list);
        let fragment = document.createDocumentFragment();
        for (let folderName of this.folderList) {
          let entry = this.buildEntry(folderName);
          fragment.appendChild(entry);
        }
        this.list.appendChild(fragment);
      }

    }

    const dialogToolset = [
      { type: 'label', text: 'Name' },
      { type: 'input', label: 'Name' },
      { type: 'btn', id: 'save', label: 'Save' }
    ];

    const lowerToolSet$6 = [
      { type: 'btn', icon: 'bookmark-folder', label: 'Bookmark Folder' }
    ];

    const upperToolSet$6 = [
      { type: 'banner', modifier: 'bookmark-folder-add', text: 'Folder Add' }
    ];

    class BookmarkFolderAddView {

      constructor() {
        this.initialize();
      }

      addListeners() {
        this.dialogBtns.addEventListener('click', (event) => {
          this.dialogClick(event);
        });
        this.inputName.addEventListener('keydown', (event) => {
          this.inputKeyDown(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      buildPage() {
        this.page = templatePage('bookmark-folder-add');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$6);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('bookmark-folder-add');
        this.dialog = templateDivDialog('bookmark-folder-add', dialogToolset);
        this.scroll.appendChild(this.dialog);
        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet$6);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      dialogClick(event) {
        event.preventDefault();
        let target = event.target;
        if (target === this.btnSave) {
          this.saveClick();
        }
      }

      getElements() {
        this.inputName = this.dialog.querySelector('.dialog-input');
        this.dialogBtns = this.dialog.querySelector('.dialog-btns');
        this.btnSave = this.dialogBtns.querySelector('.btn-dialog--save');

        this.btnBookmarkFolder = this.toolbarLower.querySelector(
          '.btn-icon--bookmark-folder');
      }

      hide() {
        this.page.classList.add('page--hide');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
      }

      inputKeyDown(event) {
        if (event.key === 'Enter') {
          this.saveClick();
        }
      }

      saveClick() {
        let name = this.inputName.value;
        if (name) {
          bus.publish('bookmark-folder-add.save', name);
        }
      }

      show() {
        this.page.classList.remove('page--hide');
        this.inputName.value = '';
        this.inputName.focus();
      }

      subscribe() {
        bus.subscribe('bookmark-folder-add.hide', () => {
          this.hide();
        });
        bus.subscribe('bookmark-folder-add.show', () => {
          this.show();
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnBookmarkFolder) {
            bus.publish('bookmark-folder', null);
          }
        }
      }

    }

    const dialogToolset$1 = [
      { type: 'label', text: null },
      { type: 'btn', id: 'delete', label: 'Delete' }
    ];

    const lowerToolSet$7 = [
      { type: 'btn', icon: 'bookmark-folder', label: 'Bookmark Folder' }
    ];

    const upperToolSet$7 = [
      { type: 'banner', modifier: 'bookmark-folder-delete',
        text: 'Folder Delete' }
    ];

    class BookmarkFolderDeleteView {

      constructor() {
        this.initialize();
      }

      addListeners() {
        this.dialogBtns.addEventListener('click', (event) => {
          this.dialogClick(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      buildPage() {
        this.page = templatePage('bookmark-folder-delete');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$7);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('bookmark-folder-delete');
        this.dialog = templateDivDialog('bookmark-folder-delete', dialogToolset$1);
        this.scroll.appendChild(this.dialog);
        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet$7);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      deleteClick() {
        bus.publish('bookmark-folder-delete.confirm', this.folderName);
      }

      dialogClick(event) {
        event.preventDefault();
        let target = event.target;
        if (target === this.btnDelete) {
          this.deleteClick();
        }
      }

      folderToDelete(folderName) {
        this.folderName = folderName;
      }

      getElements() {
        this.banner = this.toolbarUpper.querySelector(
          '.banner--bookmark-folder-delete');

        this.label = this.dialog.querySelector('.dialog-label');
        this.dialogBtns = this.dialog.querySelector('.dialog-btns');
        this.btnDelete = this.dialogBtns.querySelector('.btn-dialog--delete');

        this.btnBookmarkFolder = this.toolbarLower.querySelector(
          '.btn-icon--bookmark-folder');
      }

      hide() {
        this.page.classList.add('page--hide');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
      }

      show() {
        this.updateLabel();
        this.page.classList.remove('page--hide');
      }

      subscribe() {
        bus.subscribe('bookmark-folder-delete.hide', () => {
          this.hide();
        });
        bus.subscribe('bookmark-folder-delete.show', () => {
          this.show();
        });

        bus.subscribe('folder.to.delete', (folderName) => {
          this.folderToDelete(folderName);
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnBookmarkFolder) {
            bus.publish('bookmark-folder', null);
          }
        }
      }

      updateLabel() {
        this.label.innerHTML = `Delete Folder '${this.folderName}'?`;
      }

    }

    const dialogToolset$2 = [
      { type: 'label', text: 'Folder Name' },
      { type: 'input', label: 'Name' },
      { type: 'btn', id: 'save', label: 'Save' }
    ];

    const lowerToolSet$8 = [
      { type: 'btn', icon: 'bookmark-folder', label: 'Bookmark Folder' }
    ];

    const upperToolSet$8 = [
      { type: 'banner', modifier: 'bookmark-folder-rename',
        text: 'Folder Rename'}
    ];

    class BookmarkFolderRenameView {

      constructor() {
        this.initialize();
      }

      addListeners() {
        this.dialogBtns.addEventListener('click', (event) => {
          this.dialogClick(event);
        });
        this.inputName.addEventListener('keydown', (event) => {
          this.inputKeyDown(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      buildPage() {
        this.page = templatePage('bookmark-folder-rename');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$8);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('bookmark-folder-rename');
        this.dialog = templateDivDialog('bookmark-folder-rename', dialogToolset$2);
        this.scroll.appendChild(this.dialog);
        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet$8);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      dialogClick(event) {
        event.preventDefault();
        let target = event.target;
        if (target === this.btnSave) {
          this.saveClick();
        }
      }

      folderToRename(folderName) {
        this.folderName = folderName;
      }

      getElements() {
        this.inputName = this.dialog.querySelector('.dialog-input');
        this.dialogBtns = this.dialog.querySelector('.dialog-btns');
        this.btnSave = this.dialogBtns.querySelector('.btn-dialog--save');

        this.btnBookmarkFolder = this.toolbarLower.querySelector(
          '.btn-icon--bookmark-folder');
      }

      hide() {
        this.page.classList.add('page--hide');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.getElements();
        this.addListeners();
        this.subscribe();
      }

      inputKeyDown(event) {
        if (event.key === 'Enter') {
          this.saveClick();
        }
      }

      saveClick() {
        let name = this.inputName.value;
        if (name) {
          this.inputName.value = '';
          this.namePkg.new = name;
          bus.publish('bookmark-folder-rename.save', this.namePkg);
        }
      }

      show() {
        this.page.classList.remove('page--hide');
        this.namePkg = {
          old: this.folderName
        };
        this.inputName.value = this.folderName;
        this.inputName.focus();
      }

      subscribe() {
        bus.subscribe('bookmark-folder-rename.hide', () => {
          this.hide();
        });
        bus.subscribe('bookmark-folder-rename.show', (folderName) => {
          this.show(folderName);
        });

        bus.subscribe('folder.to.rename', (folderName) => {
          this.folderToRename(folderName);
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnBookmarkFolder) {
            bus.publish('bookmark-folder', null);
          }
        }
      }

    }

    const message = 'Select All and Copy the text below. ' +
      'Then Paste in a text editor and save the file.';

    const dialogToolset$3 = [
      { type: 'label', text: message },
      { type: 'textarea', label: 'Bookmark Package' },
    ];

    const lowerToolSet$9 = [
      { type: 'btn', icon: 'bookmark-folder', label: 'Bookmark Folder' }
    ];

    const upperToolSet$9 = [
      { type: 'banner', modifier: 'bookmark-export', text: 'Bookmark Export' }
    ];

    class BookmarkExportview {

      constructor() {
        this.initialize();
      }

      addListeners() {
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      buildBookmarkPkg() {
        let bookmarkPkg = {};
        bookmarkPkg.tome = tomeName;
        bookmarkPkg.folders = this.folders;
        return JSON.stringify(bookmarkPkg, null, 2);
      }

      buildPage() {
        this.page = templatePage('bookmark-export');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$9);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('bookmark-export');
        this.dialog = templateDivDialog('bookmark-export', dialogToolset$3);
        this.scroll.appendChild(this.dialog);
        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet$9);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      foldersUpdate(folders) {
        this.folders = folders;
      }

      getElements() {
        this.textarea = this.scroll.querySelector('.dialog-textarea');

        this.btnBookmarkFolder = this.toolbarLower.querySelector(
          '.btn-icon--bookmark-folder');
      }

      hide() {
        this.page.classList.add('page--hide');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
      }

      show() {
        this.page.classList.remove('page--hide');
        this.textarea.value = this.buildBookmarkPkg();
      }

      subscribe() {
        bus.subscribe('bookmark-export.hide', () => {
          this.hide();
        });
        bus.subscribe('bookmark-export.show', () => {
          this.show();
        });

        bus.subscribe('folders.update', (folders) => {
          this.foldersUpdate(folders);
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnBookmarkFolder) {
            bus.publish('bookmark-folder', null);
          }
        }
      }

    }

    const dialogToolset$4 = [
      { type: 'label', text: 'Paste Bookmark Package Here:' },
      { type: 'textarea', label: 'Bookmark Package' },
      { type: 'btn', id: 'import', label: 'Import' }
    ];

    const lowerToolSet$a = [
      { type: 'btn', icon: 'bookmark-folder', label: 'Bookmark Folder' }
    ];

    const upperToolSet$a = [
      { type: 'banner', modifier: 'bookmark-import', text: 'Bookmark Import' }
    ];

    class BookmarkImportView {

      constructor() {
        this.initialize();
      }

      addListeners() {
        this.dialogBtns.addEventListener('click', (event) => {
          this.dialogClick(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      buildPage() {
        this.page = templatePage('bookmark-import');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$a);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('bookmark-import');
        this.dialog = templateDivDialog('bookmark-import', dialogToolset$4);
        this.scroll.appendChild(this.dialog);

        this.message = templateElement('div', 'message', 'bookmark-import', null,
          null);
        this.scroll.appendChild(this.message);
        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet$a);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      dialogClick(event) {
        event.preventDefault();
        let target = event.target;
        if (target === this.btnImport) {
          this.importClick();
        }
      }

      error(message) {
        this.message.textContent = message;
        this.message.classList.remove('message--hide');
        if (message === 'Import successful.') {
          this.textarea.value = '';
        }
      }

      getElements() {
        this.textarea = this.scroll.querySelector('.dialog-textarea');
        this.dialogBtns = this.dialog.querySelector('.dialog-btns');
        this.btnImport = this.dialogBtns.querySelector('.btn-dialog--import');

        this.btnBookmarkFolder = this.toolbarLower.querySelector(
          '.btn-icon--bookmark-folder');
      }

      importClick() {
        this.message.textContent = '';
        let pkgStr = this.textarea.value;
        if (pkgStr) {
          bus.publish('bookmark-import.import', pkgStr);
        }
      }

      hide() {
        this.page.classList.add('page--hide');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
      }

      show() {
        this.textarea.value = '';
        this.message.textContent = '';
        this.message.classList.add('message--hide');
        this.page.classList.remove('page--hide');
      }

      subscribe() {
        bus.subscribe('bookmark-import.hide', () => {
          this.hide();
        });
        bus.subscribe('bookmark-import.message', (message) => {
          this.error(message);
        });
        bus.subscribe('bookmark-import.show', () => {
          this.show();
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnBookmarkFolder) {
            bus.publish('bookmark-folder', null);
          }
        }
      }

    }

    class BookmarkController {

      constructor() {
        this.initialize();
      }

      back() {
        bus.publish('sidebar.change', 'none');
      }

      chapterIdxUpdate() {
        if (this.selectVerseIdx) {
          if (this.panes === 1 && this.sidebar !== 'none') {
            bus.publish('sidebar.select', 'none');
          }
          bus.publish('read.scroll-to-verse', this.selectVerseIdx);
          this.selectVerseIdx = null;
        }
      }

      export() {
        bus.publish('bookmark.task.change', 'bookmark-export');
      }

      folder() {
        bus.publish('bookmark.task.change', 'bookmark-folder');
      }

      folderAdd() {
        bus.publish('bookmark.task.change', 'bookmark-folder-add');
      }

      folderAdded() {
        bus.publish('bookmark.task.change', 'bookmark-list');
      }

      folderAddSave(name) {
        bus.publish('folder.add', name);
      }

      folderDelete(folderName) {
        bus.publish('folder.to.delete', folderName);
        bus.publish('bookmark.task.change', 'bookmark-folder-delete');
      }

      folderDeleteConfirm(folderName) {
        bus.publish('folder.delete', folderName);
        bus.publish('bookmark.task.change', 'bookmark-folder');
      }

      folderDown(folderName) {
        bus.publish('folder.down', folderName);
      }

      folderRename(folderName) {
        bus.publish('folder.to.rename', folderName);
        bus.publish('bookmark.task.change', 'bookmark-folder-rename');
      }

      folderRenameSave(namePkg) {
        bus.publish('folder.rename', namePkg);
        bus.publish('bookmark.task.change', 'bookmark-folder');
      }

      folderSelect(folderName) {
        bus.publish('folder.change', folderName);
        bus.publish('bookmark.task.change', 'bookmark-list');
      }

      folderUp(folderName) {
        bus.publish('folder.up', folderName);
      }

      gotoBookmark(verseIdx) {
        this.selectVerseIdx = verseIdx;
        let chapterIdx = chapterIdxByVerseIdx(verseIdx);
        bus.publish('chapterIdx.change', chapterIdx);
      }

      hide() {
        bus.publish(`${this.bookmarkTask}.hide`, null);
      }

      import() {
        bus.publish('bookmark.task.change', 'bookmark-import');
      }

      importImport(pkgStr) {
        bus.publish('folder.import', pkgStr);
      }

      initialize() {
        this.subscribe();
      }

      list() {
        bus.publish('bookmark.task.change', 'bookmark-list');
      }

      listDelete(verseIdx) {
        bus.publish('bookmark.delete', verseIdx);
      }

      listDown(verseIdx) {
        bus.publish('bookmark.down', verseIdx);
      }

      listSelect(verseIdx) {
        this.gotoBookmark(verseIdx);
      }

      listSortAscend() {
        bus.publish('bookmark.sort-ascend', null);
      }

      listSortInvert() {
        bus.publish('bookmark.sort-invert', null);
      }

      listUp(verseIdx) {
        bus.publish('bookmark.up', verseIdx);
      }

      modeToggle() {
        bus.publish('bookmark.strong-mode.toggle', null);
      }

      moveCopy(verseIdx) {
        bus.publish('move-copy.list.change', verseIdx);
        bus.publish('bookmark.move-copy.change', verseIdx);
      }

      moveCopyCopy(copyPkg) {
        bus.publish('bookmark.copy', copyPkg);
      }

      moveCopyMove(movePkg) {
        bus.publish('bookmark.move', movePkg);
      }

      moveCopyReady() {
        bus.publish('bookmark.task.change', 'bookmark-move-copy');
      }

      panesUpdate(panes) {
        this.panes = panes;
      }

      show() {
        bus.publish(`${this.bookmarkTask}.show`, null);
      }

      sidebarUpdate(sidebar) {
        this.sidebar = sidebar;
      }

      strongSelect(verseIdx) {
        bus.publish('strong.verse.change', verseIdx);
        bus.publish('strong.task.change', 'strong-verse');
        bus.publish('sidebar.change', 'strong');
      }

      subscribe() {
        bus.subscribe('bookmark-export', () => {
          this.export();
        });

        bus.subscribe('bookmark-folder', () => {
          this.folder();
        });
        bus.subscribe('bookmark-folder.delete', (folderName) => {
          this.folderDelete(folderName);
        });
        bus.subscribe('bookmark-folder.down', (folderName) => {
          this.folderDown(folderName);
        });
        bus.subscribe('bookmark-folder.select', (folderName) => {
          this.folderSelect(folderName);
        });
        bus.subscribe('bookmark-folder.up', (folderName) => {
          this.folderUp(folderName);
        });

        bus.subscribe('bookmark-folder-add', () => {
          this.folderAdd();
        });
        bus.subscribe('bookmark-folder-add.save', (name) => {
          this.folderAddSave(name);
        });

        bus.subscribe('bookmark-folder-delete.confirm', (folderName) => {
          this.folderDeleteConfirm(folderName);
        });

        bus.subscribe('bookmark-folder-rename', (folderName) => {
          this.folderRename(folderName);
        });
        bus.subscribe('bookmark-folder-rename.save', (namePkg) => {
          this.folderRenameSave(namePkg);
        });

        bus.subscribe('bookmark-import', () => {
          this.import();
        });
        bus.subscribe('bookmark-import.import', (pkgStr) => {
          this.importImport(pkgStr);
        });

        bus.subscribe('bookmark-list', () => {
          this.list();
        });
        bus.subscribe('bookmark-list.delete', (verseIdx) => {
          this.listDelete(verseIdx);
        });
        bus.subscribe('bookmark-list.down', (verseIdx) => {
          this.listDown(verseIdx);
        });
        bus.subscribe('bookmark-list.select', (verseIdx) => {
          this.listSelect(verseIdx);
        });
        bus.subscribe('bookmark-list.sort-ascend', () => {
          this.listSortAscend();
        });
        bus.subscribe('bookmark-list.sort-invert', () => {
          this.listSortInvert();
        });
        bus.subscribe('bookmark-list.strong-select', (verseIdx) => {
          this.strongSelect(verseIdx);
        });
        bus.subscribe('bookmark-list.up', (verseIdx) => {
          this.listUp(verseIdx);
        });

        bus.subscribe('bookmark-move-copy', (verseIdx) => {
          this.moveCopy(verseIdx);
        });
        bus.subscribe('bookmark-move-copy.copy', (copyPkg) => {
          this.moveCopyCopy(copyPkg);
        });
        bus.subscribe('bookmark-move-copy.move', (movePkg) => {
          this.moveCopyMove(movePkg);
        });
        bus.subscribe('bookmark-move-copy.ready', () => {
          this.moveCopyReady();
        });

        bus.subscribe('bookmark.back', () => {
          this.back();
        });
        bus.subscribe('bookmark.copy', () => {
          this.list();
        });
        bus.subscribe('bookmark.hide', () => {
          this.hide();
        });
        bus.subscribe('bookmark.move', () => {
          this.list();
        });
        bus.subscribe('bookmark.show', () => {
          this.show();
        });
        bus.subscribe('bookmark.strong-mode.click', () => {
          this.modeToggle();
        });
        bus.subscribe('bookmark.task.update', (bookmarkTask) => {
          this.taskUpdate(bookmarkTask);
        });

        bus.subscribe('chapterIdx.update', () => {
          this.chapterIdxUpdate();
        });

        bus.subscribe('folder.added', () => {
          this.folderAdded();
        });

        bus.subscribe('panes.update', (panes) => {
          this.panesUpdate(panes);
        });

        bus.subscribe('sidebar.update', (sidebar) => {
          this.sidebarUpdate(sidebar);
        });
      }

      taskUpdate(bookmarkTask) {
        if (this.sidebar === 'bookmark') {
          bus.publish(`${this.bookmarkTask}.hide`, null);
          this.bookmarkTask = bookmarkTask;
          bus.publish(`${this.bookmarkTask}.show`, null);
        } else {
          this.bookmarkTask = bookmarkTask;
        }
      }

    }

    const tomeBinWordCount = 0;
    const tomeBinVerseCount = 1;
    const tomeBinBooks = 2;
    const tomeBinVerses = 3;

    const bookBinBookIdx = 0;
    const bookBinWordCount = 1;
    const bookBinVerseCount = 2;
    const bookBinSliceStart = 3;
    const bookBinSliceEnd = 4;
    const bookBinChapters = 5;

    const chapterBinChapterIdx = 0;
    const chapterBinWordCount = 1;
    const chapterBinVerseCount = 2;
    const chapterBinSliceStart = 3;
    const chapterBinSliceEnd = 4;

    const numSort = (a, b) => a - b;

    // Credit: http://eddmann.com/posts/cartesian-product-in-javascript/
    const flatten$1 = (arr) => [].concat.apply([], arr);
    const product = (sets) =>
      sets.reduce((acc, set) =>
        flatten$1(acc.map((x) => set.map((y) => [...x, y]))), [
        []
      ]);

    const firstMatch = 1;
    const firstSet = 0;
    const secondSet = 1;

    class SearchEngine {

      constructor() {
        this.initialize();
      }

      buildBins(verseIdx) {
        let tomeBin = this.rig.tomeBin;
        let versesLength = tomeBin[tomeBinVerses].length;
        tomeBin[tomeBinWordCount] += this.verseCount;
        tomeBin[tomeBinVerseCount] += 1;

        let book = tomeBooks.find(x => x[bookLastVerseIdx] >= verseIdx);
        let bookIdx = tomeBooks.indexOf(book);
        let chapter = tomeChapters.find(x => x[chapterLastVerseIdx] >= verseIdx);
        let chapterIdx = tomeChapters.indexOf(chapter);

        let bookBin = tomeBin[tomeBinBooks].find(
          x => x[bookBinBookIdx] === bookIdx
        );
        if (!bookBin) {
          let wordCount = 0;
          let verseCount = 0;
          let sliceStart = versesLength - 1;
          let sliceEnd = sliceStart;
          let chapters = [];
          tomeBin[tomeBinBooks].push([
            bookIdx,
            wordCount,
            verseCount,
            sliceStart,
            sliceEnd,
            chapters
          ]);
          bookBin = tomeBin[tomeBinBooks][tomeBin[tomeBinBooks].length - 1];
        }
        bookBin[bookBinWordCount] += this.verseCount;
        bookBin[bookBinVerseCount] += 1;
        bookBin[bookBinSliceEnd] += 1;

        let chapterBin = bookBin[bookBinChapters].find(
          (x) => x[chapterBinChapterIdx] === chapterIdx
        );
        if (!chapterBin) {
          let wordCount = 0;
          let verseCount = 0;
          let sliceStart = versesLength - 1;
          let sliceEnd = sliceStart;
          bookBin[bookBinChapters].push([
            chapterIdx,
            wordCount,
            verseCount,
            sliceStart,
            sliceEnd
          ]);
          chapterBin = bookBin[bookBinChapters][bookBin[bookBinChapters].length - 1];
        }
        chapterBin[chapterBinWordCount] += this.verseCount;
        chapterBin[chapterBinVerseCount] += 1;
        chapterBin[chapterBinSliceEnd] += 1;
      }

      buildCombinations() {
        this.combinations = product(this.patterns);
      }

      buildIntersects() {
        let verses = new Set();
        for (let set of this.sets) {
          let intersect = this.intersectAll(set);
          for (let verse of [...intersect]) {
            verses.add(verse);
          }
        }
        this.intersects = [...verses].sort(numSort);
      }

      buildPatterns() {
        this.rig.wordStatus = 'OK';
        this.patterns = [];
        let missingTerms = [];
        for (let term of this.terms) {
          let re = new RegExp(`^${term.replace(/\*/g, '.*')}$`, this.testFlags);
          let words = tomeWords.filter(x => re.test(x));
          if (words.length > 0) {
            this.patterns.push(words);
          } else {
            missingTerms.push(term);
          }
        }
        if (missingTerms.length > 0) {
          this.rig.wordStatus = `'${missingTerms.join(', ')}' not found`;
        }
      }

      async buildPhraseVerses() {
        let allVerses = [...this.intersects].sort(numSort);
        let verseObjs = await tomeDb.verses.bulkGet(allVerses);
        for (let verseObj of verseObjs) {
          this.verseIdx = verseObj.k;
          let re = this.buildRegExp(this.searchTerms, this.flags);
          let text = verseObj.v[verseText].replace(/[!();:,.?-]/g, '');
          this.verseCount = (text.match(re) || []).length;
          if (this.verseCount > 0) {
            this.rig.tomeBin[tomeBinVerses].push(this.verseIdx);
            this.buildBins(this.verseIdx);
          }
        }
      }

      buildRegExp(term, flags) {
        let regexStr = term.replace(/\*/g, '[\\w\']*');
        regexStr = term.endsWith('*') ?
          `\\b(${regexStr})` :
          `\\b(${regexStr})( |$)`;
        return new RegExp(regexStr, flags);
      }

      buildRig(query) {
        this.rig = {};
        this.rig.state = 'ERROR';
        this.rig.query = query;
        if (query === '') {
          this.rig.type = 'EMPTY';
        } else {
          this.rig.type = 'INVALID';
          this.flags = query.startsWith('@') ? 'g' : 'gi';
          this.testFlags = query.startsWith('@') ? '' : 'i';
          this.searchTerms = this.rig.query
            .replace('@', '')
            .trim()
            .replace(/ {2,}/g, ' ')
            .replace(/ *,+ */g, ',');
          if (
            !this.searchTerms.match(/[^a-z ,'*-]/i) &&
            !(/^\*$|^\* | \* | \*$|^\*,|,\*,|,\*$/g.test(this.searchTerms)) &&
            !(/^,|,$/g.test(this.searchTerms)) &&
            !(
              this.searchTerms.includes(' ') &&
              this.searchTerms.includes(',')
            )
          ) {
            this.terms = this.searchTerms
              .replace(/-/g, '').split(/[ ,]/);
            if (
              this.rig.query.includes(',') ||
              this.terms.length === 1
            ) {
              this.rig.type = 'WORD';
            } else {
              this.rig.type = 'PHRASE';
            }
          }
        }
      }

      async buildSets() {
        this.sets = [];

        let unique = [...new Set([].concat.apply([], this.combinations))].sort();
        this.wordObjs = await tomeDb.words.bulkGet(unique);

        let words = {};
        this.wordObjs.map(obj => words[obj.k] = obj.v);

        for (let combination of this.combinations) {
          let comboSets = [];
          for (let word of combination) {
            let verseKeys = words[word].map(x => x[wordVerseIdx]);
            comboSets.push(new Set(verseKeys));
          }
          this.sets.push(comboSets);
        }
      }

      async buildWords() {
        let allVerses = [...this.intersects];
        for (let verseIdx of allVerses) {
          this.verseIdx = verseIdx;
          this.getVerseCount(verseIdx);
          if (this.verseCount > 0) {
            this.rig.tomeBin[tomeBinVerses].push(this.verseIdx);
            this.buildBins(this.verseIdx);
          }
        }
      }

      async buildVerses() {
        if (this.rig.type === 'PHRASE') {
          await this.buildPhraseVerses(this.rig);
        } else if (this.rig.type === 'WORD') {
          await this.buildWords(this.rig);
        }
      }

      findAllMatches(str, regEx) {
        let result;
        let matches = [];
        while ((result = regEx.exec(str)) !== null) {
          matches.push(result[firstMatch]);
        }
        return matches.length === 0 ? undefined : matches;
      }

      getVerseCount(verseIdx) {
        this.verseCount = 0;
        for (let wordVerseObj of this.wordObjs) {
          let verseCount = wordVerseObj.v.find(x => x[wordVerseIdx] === verseIdx);
          if (verseCount) {
            this.verseCount += verseCount[wordCount];
          }
        }
      }

      initialize() {
        this.subscribe();
      }

      initializeTomeBin() {
        let wordCount = 0;
        let verseCount = 0;
        let books = [];
        let verses = [];
        this.rig.tomeBin = [
          wordCount,
          verseCount,
          books,
          verses
        ];
      }

      intersectAll(...sets) {
        let intersect = undefined;
        let numOfSets = sets.length;
        if (numOfSets > 0) {
          if (Array.isArray(sets[firstSet])) {
            sets = [...sets[firstSet]];
            numOfSets = sets.length;
          }
          if (numOfSets < 2) {
            intersect = sets[firstSet];
          } else {
            intersect = this.intersection(sets[firstSet], sets[secondSet]);
            if (numOfSets > 2) {
              for (let i = 2; i < numOfSets; i++) {
                intersect = this.intersection(intersect, sets[i]);
              }
            }
          }
        }
        return intersect;
      }

      intersection(set1, set2) {
        return new Set([...set1].filter((x) => set2.has(x)));
      }

      async performSearch(query) {
        this.buildRig(query);
        this.initializeTomeBin();
        if (this.rig.type === 'WORD' || this.rig.type === 'PHRASE') {
          this.buildPatterns();
          if (this.rig.wordStatus === 'OK') {
            this.rig.state = 'OK';
            this.buildCombinations();
            await this.buildSets();
            this.buildIntersects();
            await this.buildVerses();
          }
        }
        return this.rig;
      }

      subscribe() {}

    }

    const validTasks$2 = ['search-result', 'search-lookup', 'search-filter',
      'search-history'
    ];

    const DEFAULT_QUERY = 'day of the lord';

    const firstEntry$1 = 0;

    class SearchModel {

      constructor() {
        this.initialize();
      }

      addHistory() {
        if (this.searchHistory.indexOf(this.searchQuery) === -1) {
          this.searchHistory = [this.searchQuery, ...this.searchHistory];
          this.updateHistory();
        }
      }

      filterChange(searchFilter) {
        this.searchFilter = searchFilter;
        this.saveFilter();
        bus.publish('search.filter.update', this.searchFilter);
      }

      filterIsValid(searchFilter) {
        let result = false;
        if (typeof searchFilter === 'object') {
          if (searchFilter.bookIdx && searchFilter.chapterIdx) {
            result = true;
          }
        }
        return result;
      }

      historyChange(searchHistory) {
        this.searchHistory = searchHistory;
        this.saveHistory();
        bus.publish('search.history.update', this.searchHistory);
      }

      historyClear() {
        this.searchHistory = [];
        this.updateHistory();
      }

      historyDelete(str) {
        let index = this.searchHistory.indexOf(str);
        this.searchHistory.splice(index, 1);
        this.updateHistory();
      }

      historyDown(str) {
        let index = this.searchHistory.indexOf(str);
        if (index !== (this.searchHistory.length - 1) && index !== -1) {
          this.reorderHistory(index, index + 1);
          this.updateHistory();
        }
      }

      historyIsValid(searchHistory) {
        return searchHistory.some((x) => {
          return typeof x === 'string';
        });
      }

      historyUp(str) {
        let index = this.searchHistory.indexOf(str);
        if (index !== 0 && index !== -1) {
          this.reorderHistory(index, index - 1);
          this.updateHistory();
        }
      }

      initialize() {
        this.engine = new SearchEngine();
        this.subscribe();
      }

      modeChange(strongMode) {
        this.strongMode = strongMode;
        this.saveMode();
        bus.publish('search.strong-mode.update', this.strongMode);
      }

      modeToogle() {
        this.modeChange(!this.strongMode);
      }

      async queryChange(searchQuery) {
        let rig = await this.engine.performSearch(searchQuery);
        if (rig.state === 'ERROR') {
          let message;
          if (rig.type === 'EMPTY') {
            message = 'Enter a search expression.';
          } else if (rig.type === 'INVALID') {
            message = 'Invalid query expression.';
          } else if (rig.wordStatus !== 'OK') {
            message = rig.wordStatus;
          }
          bus.publish('search.query.error', message);
        } else {
          this.rig = rig;
          this.searchQuery = searchQuery;
          this.saveQuery();
          this.addHistory();
          await this.updateSearchVerses();
          bus.publish('search.query.update', this.searchQuery);
          bus.publish('rig.update', this.rig);
          this.resetFilter();
        }
      }

      reorderHistory(fromIdx, toIdx) {
        this.searchHistory.splice(toIdx, 0,
          this.searchHistory.splice(fromIdx, 1)[firstEntry$1]);
      }

      resetFilter() {
        let filter = this.tomeFilter();
        this.filterChange(filter);
      }

      async restore() {
        this.restoreHistory();
        await this.restoreQuery();
        this.restoreFilter();
        this.restoreMode();
        this.restoreTask();
      }

      restoreFilter() {
        let defaultFilter = this.tomeFilter();
        let searchFilter = localStorage.getItem(`${appPrefix}-searchFilter`);
        if (!searchFilter) {
          searchFilter = defaultFilter;
        } else {
          try {
            searchFilter = JSON.parse(searchFilter);
          } catch (error) {
            searchFilter = defaultFilter;
          }
          if (!this.filterIsValid(searchFilter)) {
            searchFilter = defaultFilter;
          }
        }
        this.filterChange(searchFilter);
      }

      restoreHistory() {
        let defaultHistory = [];
        let searchHistory = localStorage.getItem(`${appPrefix}-searchHistory`);
        if (!searchHistory) {
          searchHistory = defaultHistory;
        } else {
          try {
            searchHistory = JSON.parse(searchHistory);
          } catch (error) {
            searchHistory = defaultHistory;
          }
          if (!Array.isArray(searchHistory)) {
            searchHistory = defaultHistory;
          } else {
            if (!this.historyIsValid(searchHistory)) {
              searchHistory = defaultHistory;
            }
          }
        }
        this.historyChange(searchHistory);
      }

      restoreMode() {
        let defaultMode = false;
        let strongMode = localStorage.getItem(`${appPrefix}-searchStrongMode`);
        if (!strongMode) {
          strongMode = defaultMode;
        } else {
          try {
            strongMode = JSON.parse(strongMode);
          } catch (error) {
            strongMode = defaultMode;
          }
          if (typeof strongMode !== 'boolean') {
            strongMode = defaultMode;
          }
        }
        this.modeChange(strongMode);
      }

      async restoreQuery() {
        let defaultQuery = DEFAULT_QUERY;
        let searchQuery = localStorage.getItem(`${appPrefix}-searchQuery`);
        if (!searchQuery) {
          searchQuery = defaultQuery;
        } else {
          try {
            searchQuery = JSON.parse(searchQuery);
          } catch (error) {
            searchQuery = defaultQuery;
          }
          if (typeof searchQuery !== 'string') {
            searchQuery = defaultQuery;
          }
        }
        await this.queryChange(searchQuery);
      }

      restoreTask() {
        let defaultTask = 'search-result';
        let searchTask = localStorage.getItem(`${appPrefix}-searchTask`);
        if (!searchTask) {
          searchTask = defaultTask;
        } else {
          searchTask = JSON.parse(searchTask);
        }
        if (!validTasks$2.includes(searchTask)) {
          searchTask = defaultTask;
        }
        this.taskChange(searchTask);
      }

      saveFilter() {
        localStorage.setItem(`${appPrefix}-searchFilter`,
          JSON.stringify(this.searchFilter));
      }

      saveHistory() {
        localStorage.setItem(`${appPrefix}-searchHistory`,
          JSON.stringify(this.searchHistory));
      }

      saveMode() {
        localStorage.setItem(`${appPrefix}-searchStrongMode`,
          JSON.stringify(this.strongMode));
      }

      saveQuery() {
        localStorage.setItem(`${appPrefix}-searchQuery`,
          JSON.stringify(this.searchQuery));
      }

      saveTask() {
        localStorage.setItem(`${appPrefix}-searchTask`,
          JSON.stringify(this.searchTask));
      }

      subscribe() {
        bus.subscribe('search.filter.change', (filter) => {
          this.filterChange(filter);
        });

        bus.subscribe('search.history.clear', () => {
          this.historyClear();
        });
        bus.subscribe('search.history.delete', (query) => {
          this.historyDelete(query);
        });
        bus.subscribe('search.history.down', (query) => {
          this.historyDown(query);
        });
        bus.subscribe('search.history.up', (query) => {
          this.historyUp(query);
        });

        bus.subscribe('search.query.change', async (query) => {
          await this.queryChange(query);
        });

        bus.subscribe('search.restore', async () => {
          await this.restore();
        });
        bus.subscribe('search.strong-mode.toggle', () => {
          this.modeToogle();
        });
        bus.subscribe('search.task.change', (searchTask) => {
          this.taskChange(searchTask);
        });
      }

      taskChange(searchTask) {
        this.searchTask = searchTask;
        this.saveTask();
        bus.publish('search.task.update', this.searchTask);
      }

      tomeFilter() {
        return {
          bookIdx: -1,
          chapterIdx: -1
        };
      }

      updateHistory() {
        this.saveHistory();
        bus.publish('search.history.update', this.searchHistory);
      }

      async updateSearchVerses() {
        this.searchVerseObjs = await tomeDb.verses.bulkGet(
          this.rig.tomeBin[tomeBinVerses]);
        bus.publish('search.verses.update', this.searchVerseObjs);
      }

    }

    const lowerToolSet$b = [
      { type: 'btn', icon: 'back', label: 'Back' },
      { type: 'btn', icon: 'search-lookup', label: 'Search Lookup' },
      { type: 'btn', icon: 'filter', label: 'Search Filter' },
      { type: 'btn', icon: 'history', label: 'Search History' },
      { type: 'btn', icon: 'strong-mode', label: 'Strong Mode' }
    ];

    const upperToolSet$b = [
      { type: 'banner', modifier: 'search-result', text: null }
    ];

    const binIdx = 0;
    const loadIncrement = 50;

    class SearchResultView {

      constructor() {
        this.initialize();
      }

      addListeners() {
        this.list.addEventListener('click', (event) => {
          this.listClick(event);
        });
        this.loadMore.addEventListener('click', (event) => {
          this.loadMoreClick(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      addVerse(verseObj) {
        let btn = document.createElement('button');
        btn.classList.add('btn-result');
        btn.dataset.verseIdx = verseObj.k;
        let searchText = document.createElement('span');
        searchText.classList.add('span-result-text');
        let acrostic = this.buildAcrosticSpan(verseObj);
        let ref = this.buildRefSpan(verseObj);
        let text = document.createTextNode(verseObj.v[verseText]);
        searchText.appendChild(ref);
        if (acrostic) {
          searchText.appendChild(acrostic);
        }
        searchText.appendChild(text);
        btn.appendChild(searchText);
        return btn;
      }

      applyFilter() {
        let tomeBin = this.rig.tomeBin;
        let bookIdx = this.searchFilter.bookIdx;
        let chapterIdx = this.searchFilter.chapterIdx;
        if (bookIdx === -1 && chapterIdx === -1) {
          this.filteredVerses = tomeBin[tomeBinVerses];
          this.wordCount = tomeBin[tomeBinWordCount];
          this.verseCount = tomeBin[tomeBinVerseCount];
          this.citation = tomeName;
        } else {
          let books = tomeBin[tomeBinBooks];
          let bookBin = this.findBin(books, bookIdx);
          if (chapterIdx === -1) {
            this.filteredVerses = tomeBin[tomeBinVerses].slice(
              bookBin[bookBinSliceStart], bookBin[bookBinSliceEnd]);
            this.wordCount = bookBin[bookBinWordCount];
            this.verseCount = bookBin[bookBinVerseCount];
            this.citation = tomeBooks[bookIdx][bookLongName];
          } else {
            let chapters = bookBin[bookBinChapters];
            let chapterBin = this.findBin(chapters, chapterIdx);
            this.filteredVerses = tomeBin[tomeBinVerses].slice(
              chapterBin[chapterBinSliceStart], chapterBin[chapterBinSliceEnd]);
            this.wordCount = chapterBin[chapterBinWordCount];
            this.verseCount = chapterBin[chapterBinVerseCount];
            this.citation = tomeChapters[chapterIdx][chapterName];
          }
        }
      }

      buildAcrosticSpan(verseObj) {
        let acrosticSpan = undefined;
        if (tomeAcrostics) {
          let acrostic = tomeAcrostics[verseObj.k];
          if (acrostic) {
            acrosticSpan = document.createElement('span');
            acrosticSpan.classList.add('verse-acrostic');
            acrosticSpan.textContent = acrostic;
          }
        }
        return acrosticSpan;
      }

      buildPage() {
        this.page = templatePage('search-result');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$b);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('search-result');
        this.list = templateElement('div', 'list', 'search-result', null, null);
        this.scroll.appendChild(this.list);

        this.loadMore = templateElement('div', 'load-more', 'strong-result', null, null);
        this.btnLoadMore = document.createElement('button');
        this.btnLoadMore.classList.add('btn-load-more');
        this.btnLoadMore.textContent = 'Load More';
        this.loadMore.appendChild(this.btnLoadMore);
        this.scroll.appendChild(this.loadMore);

        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet$b);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      buildRefSpan(verseObj) {
        let refSpan = document.createElement('span');
        refSpan.classList.add('verse-ref');
        refSpan.textContent = verseObj.v[verseCitation];
        return refSpan;
      }

      changeFont() {
        if (this.lastFont) {
          this.list.classList.remove(this.lastFont.fontClass);
        }
        this.list.classList.add(this.font.fontClass);
      }

      changeFontSize() {
        if (this.lastFontSize) {
          this.list.classList.remove(this.lastFontSize);
        }
        this.list.classList.add(this.fontSize);
      }

      filterUpdate(searchFilter) {
        this.searchFilter = searchFilter;
        if (this.rig) {
          if (this.rig.state === 'OK') {
            this.applyFilter();
            this.updateBanner();
            this.updateList();
          }
        }
      }

      findBin(bins, idx) {
        return bins.find((bin) => {
          return bin[binIdx] === idx;
        });
      }

      fontUpdate(font) {
        if (this.font) {
          this.lastFont = this.font;
        }
        this.font = font;
        this.changeFont();
      }

      fontSizeUpdate(fontSize) {
        if (this.fontSize) {
          this.lastFontSize = this.fontSize;
        }
        this.fontSize = fontSize;
        this.changeFontSize();
      }

      getElements() {
        this.banner = this.toolbarUpper.querySelector('.banner--search-result');

        this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
        this.btnFilter = this.toolbarLower.querySelector(
          '.btn-icon--filter');
        this.btnHistory = this.toolbarLower.querySelector(
          '.btn-icon--history');
        this.btnStrongMode = this.toolbarLower.querySelector(
          '.btn-icon--strong-mode');
        this.btnSearchLookup = this.toolbarLower.querySelector(
          '.btn-icon--search-lookup');
      }

      hide() {
        this.page.classList.add('page--hide');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
        this.lastFont = null;
        this.lastFontSize = null;
      }

      listClick(event) {
        event.preventDefault();
        let target = event.target;
        let btn = target.closest('button');
        let verseIdx = parseInt(btn.dataset.verseIdx);
        if (this.strongMode) {
          bus.publish('search-result.strong-select', verseIdx);
        } else {
          bus.publish('search-result.read-select', verseIdx);
        }
      }

      loadMoreClick(event) {
        event.preventDefault();
        let target = event.target;
        if (target === this.btnLoadMore) {
          this.loadVerses();
        }
      }

      loadVerses() {
        let verses;
        if (this.verseCount <= loadIncrement) {
          verses = this.filteredVerses;
          this.loadIdx = this.verseCount;
        } else {
          let sliceEnd = Math.min(this.loadIdx + loadIncrement, this.verseCount);
          verses = this.filteredVerses.slice(this.loadIdx, sliceEnd);
          this.loadIdx = sliceEnd;
        }

        let fragment = document.createDocumentFragment();
        let verseObjs = this.searchVerseObjs.filter(x => verses.includes(x.k));
        for (let verseObj of verseObjs) {
          let verse = this.addVerse(verseObj);
          fragment.appendChild(verse);
        }
        this.list.appendChild(fragment);

        if (this.loadIdx < this.verseCount) {
          this.loadMore.classList.remove('btn-load-more--hide');
        } else {
          this.loadMore.classList.add('btn-load-more--hide');
        }
      }

      modeUpdate(strongMode) {
        this.strongMode = strongMode;
        if (this.strongMode) {
          this.btnStrongMode.classList.add('btn-icon--active');
        } else {
          this.btnStrongMode.classList.remove('btn-icon--active');
        }
      }

      panesUpdate(panes) {
        if (panes === 1) {
          this.btnBack.classList.remove('btn-icon--hide');
        } else {
          this.btnBack.classList.add('btn-icon--hide');
        }
      }

      rigUpdate(rig) {
        this.rig = rig;
        this.query = this.rig.query;
      }

      scrollToTop() {
        this.scroll.scrollTop = 0;
      }

      show() {
        this.page.classList.remove('page--hide');
      }

      subscribe() {
        bus.subscribe('font.update', (font) => {
          this.fontUpdate(font);
        });

        bus.subscribe('font-size.update', (fontSize) => {
          this.fontSizeUpdate(fontSize);
        });

        bus.subscribe('panes.update', (panes) => {
          this.panesUpdate(panes);
        });

        bus.subscribe('rig.update', (rig) => {
          this.rigUpdate(rig);
        });

        bus.subscribe('search-result.hide', () => {
          this.hide();
        });
        bus.subscribe('search-result.show', () => {
          this.show();
        });

        bus.subscribe('search.filter.update', (searchFilter) => {
          this.filterUpdate(searchFilter);
        });
        bus.subscribe('search.strong-mode.update', (strongMode) => {
          this.modeUpdate(strongMode);
        });
        bus.subscribe('search.verses.update', (searchVerseObjs) => {
          this.versesUpdate(searchVerseObjs);
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnBack) {
            bus.publish('search.back', null);
          } else if (target === this.btnFilter) {
            bus.publish('search-filter', null);
          } else if (target === this.btnHistory) {
            bus.publish('search-history', null);
          } else if (target === this.btnStrongMode) {
            bus.publish('search.strong-mode.click', null);
          } else if (target === this.btnSearchLookup) {
            bus.publish('search-lookup', null);
          }
        }
      }

      updateBanner() {
        this.banner.innerHTML = `${this.citation} ` +
          `(${this.wordCount}/${this.verseCount})<br>` +
          `${this.rig.query}`;
      }

      updateList() {
        this.scrollToTop();
        removeAllChildren(this.list);
        if (this.rig.state === 'OK') {
          this.loadIdx = 0;
          this.loadedVerses = 0;
          this.loadVerses();
        }
      }

      versesUpdate(searchVerseObjs) {
        this.searchVerseObjs = searchVerseObjs;
      }

    }

    const lowerToolSet$c = [
      { type: 'btn', icon: 'result', label: 'Search Result' }
    ];

    const upperToolSet$c = [
      { type: 'banner', modifier: 'search-filter', text: null }
    ];

    class SearchFilterView {

      constructor() {
        this.initialize();
      }

      addListeners() {
        this.list.addEventListener('click', (event) => {
          this.listClick(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      buildBookFilter(bookBin) {
        let bookIdx = bookBin[bookBinBookIdx];
        let wordCount = bookBin[bookBinWordCount];
        let verseCount = bookBin[bookBinVerseCount];
        let citation = tomeBooks[bookIdx][bookLongName];

        let bookFilter = document.createElement('div');
        bookFilter.classList.add('filter', 'filter--book');

        let btnUnfold = templateBtnIcon('next', 'Unfold Book');
        btnUnfold.dataset.bookIdx = bookIdx;
        bookFilter.appendChild(btnUnfold);

        let btnFold = templateBtnIcon('down', 'Fold Book');
        btnFold.classList.add('btn-icon--hide');
        btnFold.dataset.bookIdx = bookIdx;
        bookFilter.appendChild(btnFold);

        let btnFilter = document.createElement('button');
        btnFilter.classList.add('btn-filter', 'btn-filter--book');
        btnFilter.textContent = `${citation} (${wordCount}/${verseCount})`;
        btnFilter.dataset.bookIdx = bookIdx;
        btnFilter.dataset.chapterIdx = -1;
        bookFilter.appendChild(btnFilter);

        return bookFilter;
      }

      buildChapterFilter(bookBin, chapterBin) {
        let bookIdx = bookBin[bookBinBookIdx];
        let chapterIdx = chapterBin[chapterBinChapterIdx];
        let wordCount = chapterBin[chapterBinWordCount];
        let verseCount = chapterBin[chapterBinVerseCount];
        let citation = tomeChapters[chapterIdx][chapterName];

        let btnFilter = document.createElement('button');
        btnFilter.classList.add('btn-filter', 'btn-filter--chapter',
          'btn-filter--hide');
        btnFilter.textContent = `${citation} (${wordCount}/${verseCount})`;
        btnFilter.dataset.bookIdx = bookIdx;
        btnFilter.dataset.chapterIdx = chapterIdx;

        return btnFilter;
      }

      buildFilters() {
        let fragment = document.createDocumentFragment();
        let tomeBin = this.rig.tomeBin;
        let tomeFilter = this.buildTomeFilter(tomeBin);
        fragment.appendChild(tomeFilter);
        let books = tomeBin[tomeBinBooks];
        for (let bookBin of books) {
          let bookFilter = this.buildBookFilter(bookBin);
          fragment.appendChild(bookFilter);
          let chapters = bookBin[bookBinChapters];
          for (let chapterBin of chapters) {
            let chapterFilter = this.buildChapterFilter(bookBin, chapterBin);
            fragment.appendChild(chapterFilter);
          }
        }
        return fragment;
      }

      buildPage() {
        this.page = templatePage('search-filter');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$c);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('search-filter');
        this.list = templateElement('div', 'list', 'search-filter', null, null);
        this.scroll.appendChild(this.list);
        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet$c);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      buildTomeFilter(tomeBin) {
        let citation = tomeName;
        let wordCount = tomeBin[tomeBinWordCount];
        let verseCount = tomeBin[tomeBinVerseCount];

        let btnFilter = document.createElement('button');
        btnFilter.classList.add('btn-filter', 'btn-filter--tome');
        btnFilter.textContent = `${citation} (${wordCount}/${verseCount})`;
        btnFilter.dataset.bookIdx = -1;
        btnFilter.dataset.chapterIdx = -1;

        return btnFilter;
      }

      filterClick(btnFilter) {
        let bookIdx = parseInt(btnFilter.dataset.bookIdx);
        let chapterIdx = parseInt(btnFilter.dataset.chapterIdx);
        let searchFilter = {
          bookIdx: bookIdx,
          chapterIdx: chapterIdx
        };
        bus.publish('search-filter.select', searchFilter);
      }

      filterUpdate(searchFilter) {
        this.searchFilter = searchFilter;
        this.updateActiveFilter();
      }

      foldClick(btnFold) {
        let bookIdxStr = btnFold.dataset.bookIdx;
        let chapters = this.list.querySelectorAll(
          `.btn-filter--chapter[data-book-idx="${bookIdxStr}"]`
        );
        for (let chapter of chapters) {
          chapter.classList.add('btn-filter--hide');
        }
        btnFold.classList.add('btn-icon--hide');
        let btnUnfold = btnFold.previousSibling;
        btnUnfold.classList.remove('btn-icon--hide');
      }

      getElements() {
        this.banner = this.toolbarUpper.querySelector('.banner--search-filter');

        this.btnSearchResult = this.toolbarLower.querySelector(
          '.btn-icon--result');
      }

      hide() {
        this.page.classList.add('page--hide');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
      }

      listClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target.classList.contains('btn-filter')) {
            this.filterClick(target);
          } else if (target.classList.contains('btn-icon--down')) {
            this.foldClick(target);
          } else if (target.classList.contains('btn-icon--next')) {
            this.unfoldClick(target);
          }
        }
      }

      rigUpdate(rig) {
        this.rig = rig;
        this.updateBanner();
        this.updateList();
      }

      scrollToTop() {
        this.scroll.scrollTop = 0;
      }

      show() {
        this.page.classList.remove('page--hide');
      }

      subscribe() {
        bus.subscribe('rig.update', (rig) => {
          this.rigUpdate(rig);
        });

        bus.subscribe('search-filter.hide', () => {
          this.hide();
        });
        bus.subscribe('search-filter.show', () => {
          this.show();
        });

        bus.subscribe('search.filter.update', (filter) => {
          this.filterUpdate(filter);
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnSearchResult) {
            bus.publish('search-result', null);
          }
        }
      }

      unfoldClick(btnUnfold) {
        let bookIdxStr = btnUnfold.dataset.bookIdx;
        let chapters = this.list.querySelectorAll(
          `.btn-filter--chapter[data-book-idx="${bookIdxStr}"]`
        );
        for (let chapter of chapters) {
          chapter.classList.remove('btn-filter--hide');
        }
        btnUnfold.classList.add('btn-icon--hide');
        let btnFold = btnUnfold.nextSibling;
        btnFold.classList.remove('btn-icon--hide');
      }

      updateActiveFilter() {
        if (this.btnActiveFilter) {
          this.btnActiveFilter.classList.remove('btn-filter--active');
        }
        let bookIdx = this.searchFilter.bookIdx;
        let chapterIdx = this.searchFilter.chapterIdx;
        let query = `.btn-filter[data-book-idx="${bookIdx}"]` +
          `[data-chapter-idx="${chapterIdx}"]`;
        let btn = this.list.querySelector(query);
        if (btn) {
          this.btnActiveFilter = btn;
          btn.classList.add('btn-filter--active');
        }
      }

      updateBanner() {
        this.banner.innerHTML = `${this.rig.query}`;
      }

      updateList() {
        this.scrollToTop();
        removeAllChildren(this.list);
        if (this.rig.state === 'OK') {
          let list = this.buildFilters();
          this.list.appendChild(list);
        }
      }

    }

    const actionSet$3 = [
      { icon: 'up', label: 'Up' },
      { icon: 'down', label: 'Down' },
      { icon: 'delete', label: 'Delete' },
      { icon: 'cancel', label: 'Cancel' }
    ];

    const lowerToolSet$d = [
      { type: 'btn', icon: 'result', label: 'Search Result' }
    ];

    const upperToolSet$d = [
      { type: 'banner', modifier: 'search-history', text: 'Search History' }
    ];

    class SearchHistoryView {

      constructor() {
        this.initialize();
      }

      actionMenuClick(event) {
        event.preventDefault();
        let btn = event.target.closest('button');
        if (btn) {
          if (btn === this.btnCancel) {
            this.actionMenu.classList.add('action-menu--hide');
          } else {
            let entry = this.activeEntry.querySelector('.btn-entry--history');
            let query = entry.textContent;
            if (btn === this.btnDelete) {
              this.delete(query);
            } else if (btn === this.btnDown) {
              this.down(query);
            } else if (btn === this.btnUp) {
              this.up(query);
            }
            this.actionMenu.classList.add('action-menu--hide');
          }
        }
      }

      addListeners() {
        this.actionMenu.addEventListener('click', (event) => {
          this.actionMenuClick(event);
        });
        this.list.addEventListener('click', (event) => {
          this.listClick(event);
        });
        this.clear.addEventListener('click', (event) => {
          this.clearClick(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      btnMenuClick(target) {
        this.showActionMenu(target);
      }

      buildEntry(query) {
        let entry = document.createElement('div');
        entry.classList.add('entry', 'entry--history');
        let btnEntry = document.createElement('button');
        btnEntry.classList.add('btn-entry', 'btn-entry--history');
        btnEntry.textContent = query;
        let btnMenu = templateBtnIcon('menu', 'Menu');
        entry.appendChild(btnEntry);
        entry.appendChild(btnMenu);
        return entry;
      }

      buildPage() {
        this.page = templatePage('search-history');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$d);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('search-history');
        this.empty = templateElement('div', 'empty', 'search-history', null,
          'No searches saved.');
        this.scroll.appendChild(this.empty);

        this.list = templateElement('div', 'list', 'search-history', null, null);
        this.scroll.appendChild(this.list);

        this.actionMenu = templateActionMenu('search-history', actionSet$3);
        this.scroll.appendChild(this.actionMenu);
        this.page.appendChild(this.scroll);

        this.clear = templateElement('div', 'clear', 'search', null,
          null);
        this.btnClear = document.createElement('button');
        this.btnClear.classList.add('btn-clear');
        this.btnClear.textContent = 'Clear History';
        this.clear.appendChild(this.btnClear);
        this.scroll.appendChild(this.clear);

        this.toolbarLower = templateToolbarLower(lowerToolSet$d);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      clearClick(event) {
        event.preventDefault();
        let target = event.target;
        if (target === this.btnClear) {
          bus.publish('search-history.clear', null);
        }
      }

      delete(query) {
        bus.publish('search-history.delete', query);
      }

      down(query) {
        bus.publish('search-history.down', query);
      }

      getElements() {
        this.btnUp = this.actionMenu.querySelector('.btn-icon--up');
        this.btnDown = this.actionMenu.querySelector('.btn-icon--down');
        this.btnDelete = this.actionMenu.querySelector('.btn-icon--delete');
        this.btnCancel = this.actionMenu.querySelector('.btn-icon--cancel');

        this.btnResult = this.toolbarLower.querySelector(
          '.btn-icon--result');
      }

      hide() {
        this.actionMenu.classList.add('action-menu--hide');
        this.page.classList.add('page--hide');
      }

      historyUpdate(history) {
        this.history = history;
        this.updateList();
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
      }

      listClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target.classList.contains('btn-entry--history')) {
            let query = target.textContent;
            bus.publish('search-history.select', query);
          } else if (target.classList.contains('btn-icon--menu')) {
            let entry = target.previousSibling;
            this.btnMenuClick(entry);
          }
        }
      }

      scrollToTop() {
        this.scroll.scrollTop = 0;
      }

      show() {
        this.page.classList.remove('page--hide');
      }

      showActionMenu(target) {
        this.activeEntry = target.closest('div');
        let top = target.offsetTop;
        this.actionMenu.style.top = `${top}px`;
        this.actionMenu.classList.remove('action-menu--hide');
      }

      subscribe() {
        bus.subscribe('search-history.hide', () => {
          this.hide();
        });
        bus.subscribe('search-history.show', () => {
          this.show();
        });

        bus.subscribe('search.history.update', (history) => {
          this.historyUpdate(history);
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnResult) {
            bus.publish('search-result', null);
          }
        }
      }

      up(query) {
        bus.publish('search-history.up', query);
      }

      updateList() {
        this.scrollToTop();
        removeAllChildren(this.list);
        if (this.history.length === 0) {
          this.empty.classList.remove('empty--hide');
          this.clear.classList.add('clear--hide');
        } else {
          this.empty.classList.add('empty--hide');
          this.clear.classList.remove('clear--hide');
          let fragment = document.createDocumentFragment();
          for (let query of this.history) {
            let entry = this.buildEntry(query);
            fragment.appendChild(entry);
          }
          this.list.appendChild(fragment);
        }
      }

    }

    const dialogToolset$5 = [
      { type: 'label', text: 'Query' },
      { type: 'input', label: 'Query' },
      { type: 'btn', id: 'search', label: 'Search' }
    ];

    const lowerToolSet$e = [
      { type: 'btn', icon: 'back', label: 'Back' },
      { type: 'btn', icon: 'result', label: 'Search Result' }
    ];

    const upperToolSet$e = [
      { type: 'banner', modifier: 'search-lookup', text: 'Search Lookup' }
    ];

    class SearchLookupView {

      constructor() {
        this.initialize();
      }

      addListeners() {
        this.dialogBtns.addEventListener('click', (event) => {
          this.dialogClick(event);
        });
        this.inputQuery.addEventListener('keydown', (event) => {
          this.inputKeyDown(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      buildPage() {
        this.page = templatePage('search-lookup');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$e);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('search-lookup');
        this.dialog = templateDivDialog('search-lookup', dialogToolset$5);
        this.scroll.appendChild(this.dialog);

        this.message = templateElement('div', 'message',
          'search-lookup', null, null);
        this.scroll.appendChild(this.message);

        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet$e);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      dialogClick(event) {
        event.preventDefault();
        let target = event.target;
        if (target === this.btnSearch) {
          this.searchClick();
        }
      }

      error(message) {
        this.message.textContent = message;
        this.message.classList.remove('message--hide');
      }

      getElements() {
        this.inputQuery = this.dialog.querySelector('.dialog-input');
        this.dialogBtns = this.dialog.querySelector('.dialog-btns');
        this.btnSearch = this.dialogBtns.querySelector('.btn-dialog--search');

        this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
        this.btnResult = this.toolbarLower.querySelector(
          '.btn-icon--result');
      }

      hide() {
        this.page.classList.add('page--hide');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
      }

      inputKeyDown(event) {
        if (event.key === 'Enter') {
          this.searchClick();
        }
      }

      panesUpdate(panes) {
        if (panes === 1) {
          this.btnBack.classList.remove('btn-icon--hide');
        } else {
          this.btnBack.classList.add('btn-icon--hide');
        }
      }

      searchClick() {
        let query = this.inputQuery.value;
        bus.publish('search-lookup.search', query);
      }

      show() {
        this.inputQuery.value = '';
        this.error.textContent = '';
        this.message.classList.add('message--hide');
        this.page.classList.remove('page--hide');
        this.inputQuery.focus();
      }

      subscribe() {
        bus.subscribe('search.query.error', (message) => {
          this.error(message);
        });
        bus.subscribe('search-lookup.hide', () => {
          this.hide();
        });
        bus.subscribe('search-lookup.show', () => {
          this.show();
        });

        bus.subscribe('panes.update', (panes) => {
          this.panesUpdate(panes);
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnBack) {
            bus.publish('search.back', null);
          } else if (target === this.btnResult) {
            bus.publish('search-result', null);
          }
        }
      }

    }

    class SearchController {

      constructor() {
        this.initialize();
      }

      back() {
        bus.publish('sidebar.change', 'none');
      }

      chapterIdxUpdate() {
        if (this.selectVerseIdx) {
          if (this.panes === 1 && this.sidebar !== 'none') {
            bus.publish('sidebar.select', 'none');
          }
          bus.publish('read.scroll-to-verse', this.selectVerseIdx);
          this.selectVerseIdx = null;
        }
      }

      filter() {
        bus.publish('search.task.change', 'search-filter');
      }

      filterSelect(searchFilter) {
        bus.publish('search.filter.change', searchFilter);
        bus.publish('search.task.change', 'search-result');
      }

      hide() {
        bus.publish(`${this.searchTask}.hide`, null);
      }

      history() {
        bus.publish('search.task.change', 'search-history');
      }

      historyClear() {
        bus.publish('search.history.clear', null);
      }

      historyDelete(query) {
        bus.publish('search.history.delete', query);
      }

      historyDown(query) {
        bus.publish('search.history.down', query);
      }

      historySelect(query) {
        this.query = query;
        bus.publish('search.query.change', this.query);
        bus.publish('search.task.change', 'search-result');
      }

      historyUp(query) {
        bus.publish('search.history.up', query);
      }

      initialize() {
        this.subscribe();
      }

      lookup() {
        bus.publish('search.task.change', 'search-lookup');
      }

      lookupCancel() {
        bus.publish('search.task.change', 'search-result');
      }

      lookupSearch(query) {
        bus.publish('search.query.change', query);
      }

      modeToggle() {
        bus.publish('search.strong-mode.toggle', null);
      }

      panesUpdate(panes) {
        this.panes = panes;
      }

      queryUpdate(query) {
        this.query = query;
        bus.publish('search.task.change', 'search-result');
      }

      readSelect(verseIdx) {
        this.selectVerseIdx = verseIdx;
        let chapterIdx = chapterIdxByVerseIdx(verseIdx);
        bus.publish('chapterIdx.change', chapterIdx);
      }

      result() {
        bus.publish('search.task.change', 'search-result');
      }

      show() {
        bus.publish(`${this.searchTask}.show`, null);
      }

      sidebarUpdate(sidebar) {
        this.sidebar = sidebar;
      }

      strongSelect(verseIdx) {
        bus.publish('strong.verse.change', verseIdx);
        bus.publish('strong.task.change', 'strong-verse');
        bus.publish('sidebar.change', 'strong');
      }

      subscribe() {
        bus.subscribe('chapterIdx.update', () => {
          this.chapterIdxUpdate();
        });

        bus.subscribe('panes.update', (panes) => {
          this.panesUpdate(panes);
        });

        bus.subscribe('search-filter', () => {
          this.filter();
        });
        bus.subscribe('search-filter.select', (searchFilter) => {
          this.filterSelect(searchFilter);
        });

        bus.subscribe('search-history', () => {
          this.history();
        });
        bus.subscribe('search-history.clear', () => {
          this.historyClear();
        });
        bus.subscribe('search-history.delete', (query) => {
          this.historyDelete(query);
        });
        bus.subscribe('search-history.down', (query) => {
          this.historyDown(query);
        });
        bus.subscribe('search-history.select', (query) => {
          this.historySelect(query);
        });
        bus.subscribe('search-history.up', (query) => {
          this.historyUp(query);
        });

        bus.subscribe('search-lookup', () => {
          this.lookup();
        });
        bus.subscribe('search-lookup.cancel', () => {
          this.lookupCancel();
        });
        bus.subscribe('search-lookup.search', (query) => {
          this.lookupSearch(query);
        });

        bus.subscribe('search-result', () => {
          this.result();
        });
        bus.subscribe('search-result.read-select', (verseIdx) => {
          this.readSelect(verseIdx);
        });
        bus.subscribe('search-result.strong-select', (verseIdx) => {
          this.strongSelect(verseIdx);
        });

        bus.subscribe('search.back', () => {
          this.back();
        });
        bus.subscribe('search.hide', () => {
          this.hide();
        });
        bus.subscribe('search.query.update', (query) => {
          this.queryUpdate(query);
        });
        bus.subscribe('search.show', () => {
          this.show();
        });
        bus.subscribe('search.strong-mode.click', () => {
          this.modeToggle();
        });
        bus.subscribe('search.task.update', (searchTask) => {
          this.taskUpdate(searchTask);
        });

        bus.subscribe('sidebar.update', (sidebar) => {
          this.sidebarUpdate(sidebar);
        });
      }

      taskUpdate(searchTask) {
        if (this.sidebar === 'search') {
          bus.publish(`${this.searchTask}.hide`, null);
          this.searchTask = searchTask;
          bus.publish(`${this.searchTask}.show`, null);
        } else {
          this.searchTask = searchTask;
        }
      }

    }

    const strongDefReroute = ['strong-history', 'strong-lookup'];
    const strongResultReroute = ['strong-filter'];
    const validTasks$3 = ['strong-def', 'strong-verse', 'strong-result'];

    const firstEntry$2 = 0;
    const firstWord = 0;

    const IDX_1_JOHN_4_19 = 30622;

    class StrongModel {

      constructor() {
        this.initialize();
      }

      addHistory() {
        if (this.strongHistory.indexOf(this.strongDef) === -1) {
          this.strongHistory = [this.strongDef, ...this.strongHistory];
          this.updateHistory();
        }
      }

      addSubHistory() {
        if (this.strongHistory.indexOf(this.strongDef) === -1) {
          this.strongHistory.splice(this.strongIdx, 0, this.strongDef);
          this.updateHistory();
        }
      }

      async defChange(strongDef) {
        if (!strongNums.includes(strongDef)) {
          bus.publish('strong.def.error', 'Invalid Strong Number');
        } else {
          this.strongDef = strongDef;
          this.saveDef();
          this.addHistory();
          this.strongIdx = this.strongHistory.indexOf(this.strongDef);
          this.strongDefObj = await strongDb.defs.get(this.strongDef);
          this.strongWordObj = await strongDb.words.get(this.strongDef);
          this.updateNum();
          bus.publish('strong.def.update', this.strongDefObj);
          await this.wordFirst();
        }
      }

      async defSubChange(strongDef) {
        this.strongDef = strongDef;
        this.saveDef();
        this.addSubHistory();
        this.strongIdx = this.strongHistory.indexOf(this.strongDef);
        this.strongDefObj = await strongDb.defs.get(this.strongDef);
        this.strongWordObj = await strongDb.words.get(this.strongDef);
        this.updateNum();
        bus.publish('strong.def.update', this.strongDefObj);
        await this.wordFirst();
      }

      filterChange(strongFilter) {
        this.strongFilter = strongFilter;
        this.saveFilter();
        bus.publish('strong.filter.update', this.strongFilter);
      }

      filterIsValid(filter) {
        let result = false;
        if (typeof filter === 'object') {
          if (filter.bookIdx && filter.chapterIdx) {
            result = true;
          }
        }
        return result;
      }

      filterReset() {
        let strongFilter = this.tomeFilter();
        this.filterChange(strongFilter);
      }

      historyChange(strongHistory) {
        this.strongHistory = strongHistory;
        this.saveHistory();
        bus.publish('strong.history.update', this.strongHistory);
      }

      historyClear() {
        this.strongHistory = [];
        this.updateHistory();
      }

      historyDelete(strongDef) {
        let index = this.strongHistory.indexOf(strongDef);
        this.strongHistory.splice(index, 1);
        this.updateHistory();
      }

      historyDown(strongDef) {
        let index = this.strongHistory.indexOf(strongDef);
        if (index !== (this.strongHistory.length - 1) && index !== -1) {
          this.reorderHistory(index, index + 1);
          this.updateHistory();
        }
      }

      historyIsValid(strongHistory) {
        return strongHistory.some((x) => {
          return typeof x === 'string';
        });
      }

      historyUp(strongDef) {
        let index = this.strongHistory.indexOf(strongDef);
        if (index !== 0 && index !== -1) {
          this.reorderHistory(index, index - 1);
          this.updateHistory();
        }
      }

      initialize() {
        this.subscribe();
      }

      modeChange(strongMode) {
        this.strongMode = strongMode;
        this.saveMode();
        bus.publish('strong.strong-mode.update', this.strongMode);
      }

      modeToogle() {
        this.modeChange(!this.strongMode);
      }

      reorderHistory(fromIdx, toIdx) {
        this.strongHistory.splice(toIdx, 0,
          this.strongHistory.splice(fromIdx, 1)[firstEntry$2]);
      }

      async restore() {
        this.restoreHistory();
        await this.restoreDef();
        this.strongIdx = this.strongHistory.findIndex(x => x === this.strongDef);
        await this.restoreWord();
        this.restoreFilter();
        await this.restoreVerseIdx();
        this.restoreMode();
        this.restoreTask();
      }

      async restoreDef() {
        let defaultDef = 'G2424';
        let strongDef = localStorage.getItem(`${appPrefix}-strongDef`);
        if (!strongDef) {
          strongDef = defaultDef;
        } else {
          try {
            strongDef = JSON.parse(strongDef);
          } catch (error) {
            strongDef = defaultDef;
          }
          if (!strongNums.includes(strongDef)) {
            strongDef = defaultDef;
          }
        }
        await this.defChange(strongDef);
      }

      restoreFilter() {
        let defaultFilter = this.tomeFilter();
        let strongFilter = localStorage.getItem(`${appPrefix}-strongFilter`);
        if (!strongFilter) {
          strongFilter = defaultFilter;
        } else {
          try {
            strongFilter = JSON.parse(strongFilter);
          } catch (error) {
            strongFilter = defaultFilter;
          }
          if (!this.filterIsValid(strongFilter)) {
            strongFilter = defaultFilter;
          }
        }
        this.filterChange(strongFilter);
      }

      restoreHistory() {
        let defaultHistory = [];
        let strongHistory = localStorage.getItem(`${appPrefix}-strongHistory`);
        if (!strongHistory) {
          strongHistory = defaultHistory;
        } else {
          try {
            strongHistory = JSON.parse(strongHistory);
          } catch (error) {
            strongHistory = defaultHistory;
          }
          if (!this.historyIsValid(strongHistory)) {
            strongHistory = defaultHistory;
          }
        }
        this.historyChange(strongHistory);
      }

      restoreMode() {
        let defaultMode = false;
        let strongMode = localStorage.getItem(`${appPrefix}-strongStrongMode`);
        if (!strongMode) {
          strongMode = defaultMode;
        } else {
          try {
            strongMode = JSON.parse(strongMode);
          } catch (error) {
            strongMode = defaultMode;
          }
          if (typeof strongMode !== 'boolean') {
            strongMode = defaultMode;
          }
        }
        this.modeChange(strongMode);
      }

      restoreTask() {
        let defaultTask = 'strong-def';
        let strongTask = localStorage.getItem(`${appPrefix}-strongTask`);
        if (!strongTask) {
          strongTask = defaultTask;
        } else {
          try {
            strongTask = JSON.parse(strongTask);
          } catch (error) {
            strongTask = defaultTask;
          }
          if (strongDefReroute.includes(strongTask)) {
            strongTask = 'strong-def';
          } else if (strongResultReroute.includes(strongTask)) {
            strongTask = 'strong-result';
          } else if (!validTasks$3.includes(strongTask)) {
            strongTask = defaultTask;
          }
        }
        this.taskChange(strongTask);
      }

      async restoreVerseIdx() {
        let defaultVerseIdx = IDX_1_JOHN_4_19;
        let strongVerseIdx = localStorage.getItem(`${appPrefix}-strongVerseIdx`);
        if (!strongVerseIdx) {
          strongVerseIdx = defaultVerseIdx;
        } else {
          try {
            strongVerseIdx = JSON.parse(strongVerseIdx);
          } catch (error) {
            strongVerseIdx = defaultVerseIdx;
          }
          if (!Number.isInteger(strongVerseIdx)) {
            strongVerseIdx = defaultVerseIdx;
          }
        }
        await this.verseIdxChange(strongVerseIdx);
      }

      async restoreWord() {
        let defaultWord = null;
        let strongWord = localStorage.getItem(`${appPrefix}-strongWord`);
        if (!strongWord) {
          strongWord = defaultWord;
        } else {
          try {
            strongWord = JSON.parse(strongWord);
          } catch (error) {
            strongWord = defaultWord;
          }
          if (typeof strongWord !== 'string') {
            strongWord = defaultWord;
          }
        }
        await this.wordChange(strongWord);
      }

      saveDef() {
        localStorage.setItem(`${appPrefix}-strongDef`,
          JSON.stringify(this.strongDef));
      }

      saveFilter() {
        localStorage.setItem(`${appPrefix}-strongFilter`,
          JSON.stringify(this.strongFilter));
      }

      saveHistory() {
        localStorage.setItem(`${appPrefix}-strongHistory`,
          JSON.stringify(this.strongHistory));
      }

      saveMode() {
        localStorage.setItem(`${appPrefix}-strongStrongMode`,
          JSON.stringify(this.strongMode));
      }

      saveTask() {
        localStorage.setItem(`${appPrefix}-strongTask`,
          JSON.stringify(this.strongTask));
      }

      saveVerseIdx() {
        localStorage.setItem(`${appPrefix}-strongVerseIdx`,
          JSON.stringify(this.strongVerseIdx));
      }

      saveWord() {
        localStorage.setItem(`${appPrefix}-strongWord`,
          JSON.stringify(this.strongWord));
      }

      async strongNext() {
        this.strongIdx -= 1;
        if (this.strongIdx < 0) {
          this.strongIdx = this.strongHistory.length - 1;
        }
        await this.defChange(this.strongHistory[this.strongIdx]);
      }

      async strongPrev() {
        this.strongIdx += 1;
        if (this.strongIdx >= this.strongHistory.length) {
          this.strongIdx = 0;
        }
        await this.defChange(this.strongHistory[this.strongIdx]);
      }

      subscribe() {
        bus.subscribe('strong.def.change', async (strongDef) => {
          await this.defChange(strongDef);
        });
        bus.subscribe('strong.def.sub-change', async (strongDef) => {
          await this.defSubChange(strongDef);
        });

        bus.subscribe('strong.filter.change', (strongFilter) => {
          this.filterChange(strongFilter);
        });

        bus.subscribe('strong.history.clear', () => {
          this.historyClear();
        });
        bus.subscribe('strong.history.delete', (strongDef) => {
          this.historyDelete(strongDef);
        });
        bus.subscribe('strong.history.down', (strongDef) => {
          this.historyDown(strongDef);
        });
        bus.subscribe('strong.history.up', (strongDef) => {
          this.historyUp(strongDef);
        });

        bus.subscribe('strong.next', async () => {
          await this.strongNext();
        });
        bus.subscribe('strong.prev', async () => {
          await this.strongPrev();
        });

        bus.subscribe('strong.restore', async () => {
          await this.restore();
        });
        bus.subscribe('strong.strong-mode.toggle', () => {
          this.modeToogle();
        });
        bus.subscribe('strong.task.change', (strongTask) => {
          this.taskChange(strongTask);
        });
        bus.subscribe('strong.verse.change', async (verseIdx) => {
          await this.verseIdxChange(verseIdx);
        });
        bus.subscribe('strong.word.change', async (strongWord) => {
          await this.wordChange(strongWord);
        });
      }

      taskChange(strongTask) {
        this.strongTask = strongTask;
        this.saveTask();
        bus.publish('strong.task.update', this.strongTask);
      }

      tomeFilter() {
        return {
          bookIdx: -1,
          chapterIdx: -1
        };
      }

      updateHistory() {
        this.saveHistory();
        bus.publish('strong.history.update', this.strongHistory);
      }

      updateNum() {
        this.words = this.strongWordObj.v;
        bus.publish('strong.wordObj.update', this.strongWordObj);
      }

      async updateWordMaps() {
        let verses = this.wordTomeBin[tomeBinVerses];
        this.wordMapObjs = await strongDb.maps.bulkGet(verses);
        bus.publish('strong.wordMap.update', this.wordMapObjs);
      }

      async updateWordVerses() {
        let word = this.words.find(x => x[wordKjvWord] === this.strongWord);
        this.wordTomeBin = word[wordTomeBin];
        bus.publish('strong.wordTomeBin.update', this.wordTomeBin);
        let verses = this.wordTomeBin[tomeBinVerses];
        this.wordVerseObjs = await tomeDb.verses.bulkGet(verses);
        bus.publish('strong.wordVerse.update', this.wordVerseObjs);
      }

      async verseIdxChange(verseIdx) {
        this.strongVerseIdx = verseIdx;
        this.saveVerseIdx();
        this.strongMapObj = await strongDb.maps.get(this.strongVerseIdx);
        bus.publish('strong.map.update', this.strongMapObj);
        this.strongVerseObj = await tomeDb.verses.get(this.strongVerseIdx);
        bus.publish('strong.verse.update', this.strongVerseObj);
      }

      async wordChange(strongWord) {
        this.strongWord = strongWord;
        this.saveWord();
        let word = this.words.find(x => x[wordKjvWord] === this.strongWord);
        this.wordTomeBin = word[wordTomeBin];
        await this.updateWordVerses();
        await this.updateWordMaps();
        this.filterReset();
        bus.publish('strong.word.update', this.strongWord);
      }

      async wordFirst() {
        let firstKjvWord = this.words[firstWord][wordKjvWord];
        await this.wordChange(firstKjvWord);
      }

    }

    const lowerToolSet$f = [
      { type: 'btn', icon: 'back', label: 'Back' },
      { type: 'btn', icon: 'strong-lookup', label: 'Strong Lookup' },
      { type: 'btn', icon: 'history', label: 'Strong History' },
      { type: 'btn', icon: 'strong-verse', label: 'Strong Verse' },
      { type: 'btn', icon: 'result', label: 'Strong Result' }
    ];

    const upperToolSet$f = [
      { type: 'btn', icon: 'prev', label: 'Previous Strong' },
      { type: 'banner', modifier: 'strong-def', text: 'Strong Definition' },
      { type: 'btn', icon: 'next', label: 'Next Strong' },
    ];

    class StrongDefView {

      constructor() {
        this.initialize();
      }

      addListeners() {
        this.list.addEventListener('click', (event) => {
          this.listClick(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
        this.toolbarUpper.addEventListener('click', (event) => {
          this.toolbarUpperClick(event);
        });
      }

      buildDef() {
        let fragment = document.createDocumentFragment();
        let lemma = templateElement('div', 'strong-def', 'lemma', '',
          this.def[defLemma].normalize('NFC'));
        let xlit = templateElement('div', 'strong-def', 'xlit', '',
          this.def[defTranliteration].normalize('NFC'));
        let pron = templateElement('div', 'strong-def', 'pron', '',
          this.def[defPronunciation].normalize('NFC'));
        let definition = this.buildDefinition(this.def[defDefinition]
          .normalize('NFC'));
        fragment.appendChild(lemma);
        fragment.appendChild(xlit);
        fragment.appendChild(pron);
        fragment.appendChild(definition);
        return fragment;
      }

      buildDefinition(definition) {
        let frags = definition.split(/[HG]\d+/);
        let words = definition.match(/[HG]\d+/g);
        let defDiv = templateElement('div', 'strong-def', 'def', '', null);
        if (words) {
          frags.map((value, index) => {
            let span = document.createElement('span');
            span.textContent = value;
            defDiv.appendChild(span);
            if (words[index]) {
              let num = words[index];
              let btn = templateElement(
                'button', 'btn-strong-def', null, num, num);
              btn.dataset.strongDef = num;
              defDiv.appendChild(btn);
            }
          });
        } else {
          defDiv.textContent = definition;
        }
        return defDiv;
      }

      buildPage() {
        this.page = templatePage('strong-def');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$f);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('strong-def');
        this.list = templateElement('div', 'list', 'strong-def', null, null);
        this.scroll.appendChild(this.list);
        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet$f);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      buildWords() {
        let strongWords = templateElement('div', 'strong-words', null, '', null);
        for (let word of this.words) {
          let kjvWord = word[wordKjvWord];
          let tomeBin = word[wordTomeBin];
          let label =
            `${kjvWord} (${tomeBin[tomeBinWordCount]}/${tomeBin[tomeBinVerseCount]})`;
          let btn = templateElement(
            'button', 'btn-strong-word', null, label, label);
          btn.dataset.word = word[wordKjvWord];
          strongWords.appendChild(btn);
        }
        return strongWords;
      }

      defClick(btn) {
        let strongDef = btn.dataset.strongDef;
        bus.publish('strong-def.select', strongDef);
      }

      defUpdate(strongDefObj) {
        this.strongDefObj = strongDefObj;
        this.strongDef = this.strongDefObj.k;
        this.def = this.strongDefObj.v;
        this.updateBanner();
        this.updateList();
      }

      getElements() {
        this.btnPrev = this.toolbarUpper.querySelector('.btn-icon--prev');
        this.banner = this.toolbarUpper.querySelector('.banner--strong-def');
        this.btnNext = this.toolbarUpper.querySelector('.btn-icon--next');

        this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
        this.btnLookup = this.toolbarLower.querySelector(
          '.btn-icon--strong-lookup');
        this.btnVerse = this.toolbarLower.querySelector(
          '.btn-icon--strong-verse');
        this.btnHistory = this.toolbarLower.querySelector(
          '.btn-icon--history');
        this.btnResult = this.toolbarLower.querySelector(
          '.btn-icon--result');
      }

      hide() {
        this.page.classList.add('page--hide');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
      }

      listClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target.classList.contains('btn-strong-word')) {
            this.wordClick(target);
          } else if (target.classList.contains('btn-strong-def')) {
            this.defClick(target);
          }
        }
      }

      panesUpdate(panes) {
        if (panes === 1) {
          this.btnBack.classList.remove('btn-icon--hide');
        } else {
          this.btnBack.classList.add('btn-icon--hide');
        }
      }

      scrollToTop() {
        this.scroll.scrollTop = 0;
      }

      show() {
        this.page.classList.remove('page--hide');
      }

      subscribe() {
        bus.subscribe('panes.update', (panes) => {
          this.panesUpdate(panes);
        });

        bus.subscribe('strong-def.hide', () => {
          this.hide();
        });
        bus.subscribe('strong-def.show', () => {
          this.show();
        });

        bus.subscribe('strong.def.update', (strongDefObj) => {
          this.defUpdate(strongDefObj);
        });
        bus.subscribe('strong.word.update', (strongWord) => {
          this.wordUpdate(strongWord);
        });
        bus.subscribe('strong.wordObj.update', (strongWordObj) => {
          this.wordObjUpdate(strongWordObj);
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnBack) {
            bus.publish('strong.back', null);
          } else if (target === this.btnLookup) {
            bus.publish('strong-lookup', null);
          } else if (target === this.btnHistory) {
            bus.publish('strong-history', null);
          } else if (target === this.btnVerse) {
            bus.publish('strong-verse', null);
          } else if (target === this.btnResult) {
            bus.publish('strong-result', null);
          }
        }
      }

      toolbarUpperClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnPrev) {
            bus.publish('strong-def.prev.strong', 1);
          } else if (target === this.btnNext) {
            bus.publish('strong-def.next.strong', 2);
          }
        }
      }

      updateActiveWord() {
        if (this.activeWordBtn) {
          this.activeWordBtn.classList.remove('btn-strong-word--active');
        }
        let strongWords = this.list.querySelector('.strong-words');
        if (strongWords) {
          let query = `.btn-strong-word[data-word="${this.strongWord}"]`;
          let btn = strongWords.querySelector(query);
          if (btn) {
            btn.classList.add('btn-strong-word--active');
            this.activeWordBtn = btn;
          }
        }
      }

      updateBanner() {
        if (this.strongDef) {
          this.banner.textContent = this.strongDef;
        }
      }

      updateList() {
        this.scrollToTop();
        removeAllChildren(this.list);
        let def = this.buildDef();
        this.list.appendChild(def);
        let strongWords = this.buildWords();
        this.list.appendChild(strongWords);
      }

      wordClick(btn) {
        let word = btn.dataset.word;
        bus.publish('strong-def.word.select', word);
      }

      wordObjUpdate(strongWordObj) {
        this.strongWordObj = strongWordObj;
        this.words = this.strongWordObj.v;
      }

      wordUpdate(strongWord) {
        this.strongWord = strongWord;
        if (this.strongWord) {
          this.updateActiveWord();
        }
      }

    }

    const lowerToolSet$g = [
      { type: 'btn', icon: 'result', label: 'Strong Result' }
    ];

    const upperToolSet$g = [
      { type: 'banner', modifier: 'strong-filter', text: 'Strong Filter' }
    ];

    class StrongFilterView {

      constructor() {
        this.initialize();
      }

      addListeners() {
        this.list.addEventListener('click', (event) => {
          this.listClick(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      buildBookFilter(bookBin) {
        let bookIdx = bookBin[bookBinBookIdx];
        let wordCount = bookBin[bookBinWordCount];
        let verseCount = bookBin[bookBinVerseCount];
        let citation = tomeBooks[bookIdx][bookLongName];

        let bookFilter = document.createElement('div');
        bookFilter.classList.add('filter', 'filter--book');

        let btnUnfold = templateBtnIcon('next', 'Unfold Book');
        btnUnfold.dataset.bookIdx = bookIdx;
        bookFilter.appendChild(btnUnfold);

        let btnFold = templateBtnIcon('down', 'Fold Book');
        btnFold.classList.add('btn-icon--hide');
        btnFold.dataset.bookIdx = bookIdx;
        bookFilter.appendChild(btnFold);

        let btnFilter = document.createElement('button');
        btnFilter.classList.add('btn-filter', 'btn-filter--book');
        btnFilter.textContent = `${citation} (${wordCount}/${verseCount})`;
        btnFilter.dataset.bookIdx = bookIdx;
        btnFilter.dataset.chapterIdx = -1;
        bookFilter.appendChild(btnFilter);

        return bookFilter;
      }

      buildChapterFilter(bookBin, chapterBin) {
        let bookIdx = bookBin[bookBinBookIdx];
        let chapterIdx = chapterBin[chapterBinChapterIdx];
        let wordCount = chapterBin[chapterBinWordCount];
        let verseCount = chapterBin[chapterBinVerseCount];
        let citation = tomeChapters[chapterIdx][chapterName];

        let btnFilter = document.createElement('button');
        btnFilter.classList.add('btn-filter', 'btn-filter--chapter',
          'btn-filter--hide');
        btnFilter.textContent = `${citation} (${wordCount}/${verseCount})`;
        btnFilter.dataset.bookIdx = bookIdx;
        btnFilter.dataset.chapterIdx = chapterIdx;

        return btnFilter;
      }

      buildFilters() {
        let fragment = document.createDocumentFragment();
        let tomeFilter = this.buildTomeFilter();
        fragment.appendChild(tomeFilter);
        let books = this.strongWordTomeBin[tomeBinBooks];
        for (let bookBin of books) {
          let bookFilter = this.buildBookFilter(bookBin);
          fragment.appendChild(bookFilter);
          let chapters = bookBin[bookBinChapters];
          for (let chapterBin of chapters) {
            let chapterFilter = this.buildChapterFilter(bookBin, chapterBin);
            fragment.appendChild(chapterFilter);
          }
        }
        return fragment;
      }

      buildPage() {
        this.page = templatePage('strong-filter');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$g);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('strong-filter');
        this.list = templateElement('div', 'list', 'strong-filter', null, null);
        this.scroll.appendChild(this.list);
        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet$g);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      buildTomeFilter() {
        let citation = tomeName;
        let wordCount = this.strongWordTomeBin[tomeBinWordCount];
        let verseCount = this.strongWordTomeBin[tomeBinVerseCount];

        let btnFilter = document.createElement('button');
        btnFilter.classList.add('btn-filter', 'btn-filter--tome');
        btnFilter.textContent = `${citation} (${wordCount}/${verseCount})`;
        btnFilter.dataset.bookIdx = -1;
        btnFilter.dataset.chapterIdx = -1;

        return btnFilter;
      }

      defUpdate(strongDefObj) {
        this.strongDefObj = strongDefObj;
        this.strongDef = this.strongDefObj.k;
      }

      filterClick(btnFilter) {
        let bookIdx = parseInt(btnFilter.dataset.bookIdx);
        let chapterIdx = parseInt(btnFilter.dataset.chapterIdx);
        let strongFilter = {
          bookIdx: bookIdx,
          chapterIdx: chapterIdx
        };
        bus.publish('strong-filter.select', strongFilter);
      }

      filterUpdate(strongFilter) {
        this.strongFilter = strongFilter;
        this.updateActiveFilter();
      }

      foldClick(btnFold) {
        let bookIdxStr = btnFold.dataset.bookIdx;
        let chapters = this.list.querySelectorAll(
          `.btn-filter--chapter[data-book-idx="${bookIdxStr}"]`
        );
        for (let chapter of chapters) {
          chapter.classList.add('btn-filter--hide');
        }
        btnFold.classList.add('btn-icon--hide');
        let btnUnfold = btnFold.previousSibling;
        btnUnfold.classList.remove('btn-icon--hide');
      }

      getElements() {
        this.banner = this.toolbarUpper.querySelector('.banner--strong-filter');

        this.btnResult = this.toolbarLower.querySelector(
          '.btn-icon--result');
      }

      hide() {
        this.page.classList.add('page--hide');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
        this.btnActiveFilter = null;
      }

      listClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target.classList.contains('btn-filter')) {
            this.filterClick(target);
          } else if (target.classList.contains('btn-icon--down')) {
            this.foldClick(target);
          } else if (target.classList.contains('btn-icon--next')) {
            this.unfoldClick(target);
          }
        }
      }

      scrollToTop() {
        this.scroll.scrollTop = 0;
      }

      show() {
        this.page.classList.remove('page--hide');
      }

      subscribe() {
        bus.subscribe('strong-filter.hide', () => {
          this.hide();
        });
        bus.subscribe('strong-filter.show', () => {
          this.show();
        });

        bus.subscribe('strong.def.update', (strongDefObj) => {
          this.defUpdate(strongDefObj);
        });
        bus.subscribe('strong.filter.update', (strongFilter) => {
          this.filterUpdate(strongFilter);
        });
        bus.subscribe('strong.word.update', (strongWord) => {
          this.wordUpdate(strongWord);
        });
        bus.subscribe('strong.wordTomeBin.update', (strongWordTomeBin) => {
          this.wordTomeBinUpdate(strongWordTomeBin);
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnResult) {
            bus.publish('strong-result', null);
          }
        }
      }

      unfoldClick(btnUnfold) {
        let bookIdxStr = btnUnfold.dataset.bookIdx;
        let chapters = this.list.querySelectorAll(
          `.btn-filter--chapter[data-book-idx="${bookIdxStr}"]`
        );
        for (let chapter of chapters) {
          chapter.classList.remove('btn-filter--hide');
        }
        btnUnfold.classList.add('btn-icon--hide');
        let btnFold = btnUnfold.nextSibling;
        btnFold.classList.remove('btn-icon--hide');
      }

      updateActiveFilter() {
        if (this.btnActiveFilter) {
          this.btnActiveFilter.classList.remove('btn-filter--active');
        }
        let bookIdx = this.strongFilter.bookIdx;
        let chapterIdx = this.strongFilter.chapterIdx;
        let query = `.btn-filter[data-book-idx="${bookIdx}"]` +
          `[data-chapter-idx="${chapterIdx}"]`;
        let btn = this.list.querySelector(query);
        if (btn) {
          this.btnActiveFilter = btn;
          btn.classList.add('btn-filter--active');
        }
      }

      updateBanner() {
        this.banner.innerHTML = `${this.strongDef} ${this.strongWord}`;
      }

      updateList() {
        this.scrollToTop();
        removeAllChildren(this.list);
        let list = this.buildFilters();
        this.list.appendChild(list);
      }

      wordTomeBinUpdate(strongWordTomeBin) {
        this.strongWordTomeBin = strongWordTomeBin;
      }

      wordUpdate(strongWord) {
        this.strongWord = strongWord;
        if (this.strongWord) {
          this.updateBanner();
          this.updateList();
        }
      }

    }

    const actionSet$4 = [
      { icon: 'up', label: 'Up' },
      { icon: 'down', label: 'Down' },
      { icon: 'delete', label: 'Delete' },
      { icon: 'cancel', label: 'Cancel' }
    ];

    const lowerToolSet$h = [
      { type: 'btn', icon: 'strong-def', label: 'Strong Definition' }
    ];

    const upperToolSet$h = [
      { type: 'banner', modifier: 'strong-history', text: 'Strong History' }
    ];

    const firstXlit = 0;

    class StrongHistoryView {

      constructor() {
        this.initialize();
      }

      actionMenuClick(event) {
        event.preventDefault();
        let btn = event.target.closest('button');
        if (btn) {
          if (btn === this.btnCancel) {
            this.actionMenu.classList.add('action-menu--hide');
          } else {
            let entry = this.activeEntry.querySelector('.btn-entry--history');
            let strongDef = entry.dataset.def;
            if (btn === this.btnDelete) {
              this.delete(strongDef);
            } else if (btn === this.btnDown) {
              this.down(strongDef);
            } else if (btn === this.btnUp) {
              this.up(strongDef);
            }
            this.actionMenu.classList.add('action-menu--hide');
          }
        }
      }

      addListeners() {
        this.actionMenu.addEventListener('click', (event) => {
          this.actionMenuClick(event);
        });
        this.list.addEventListener('click', (event) => {
          this.listClick(event);
        });
        this.clear.addEventListener('click', (event) => {
          this.clearClick(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      buildEntry(strongDef) {
        let entry = document.createElement('div');
        entry.classList.add('entry', 'entry--history');
        let btnEntry = document.createElement('button');
        btnEntry.classList.add('btn-entry', 'btn-entry--history');
        let transliteration = strongCitations[strongDef];
        let first = transliteration.replace(',', '').split(' ')[firstXlit];
        btnEntry.textContent = `${strongDef} ${first.normalize('NFC')}`;
        btnEntry.dataset.def = strongDef;
        let btnMenu = templateBtnIcon('menu', 'Menu');
        entry.appendChild(btnEntry);
        entry.appendChild(btnMenu);
        return entry;
      }

      buildPage() {
        this.page = templatePage('strong-history');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$h);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('strong-history');
        this.empty = templateElement('div', 'empty', 'strong-history', null,
          'No Strong saved.');
        this.scroll.appendChild(this.empty);

        this.list = templateElement('div', 'list', 'strong-history', null, null);
        this.scroll.appendChild(this.list);

        this.actionMenu = templateActionMenu('strong-history', actionSet$4);
        this.scroll.appendChild(this.actionMenu);
        this.page.appendChild(this.scroll);

        this.clear = templateElement('div', 'clear', 'strong', null,
          null);
        this.btnClear = document.createElement('button');
        this.btnClear.classList.add('btn-clear');
        this.btnClear.textContent = 'Clear History';
        this.clear.appendChild(this.btnClear);
        this.scroll.appendChild(this.clear);

        this.toolbarLower = templateToolbarLower(lowerToolSet$h);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      clearClick(event) {
        event.preventDefault();
        let target = event.target;
        if (target === this.btnClear) {
          bus.publish('strong-history.clear', null);
        }
      }

      delete(strongDef) {
        bus.publish('strong-history.delete', strongDef);
      }

      down(strongDef) {
        bus.publish('strong-history.down', strongDef);
      }

      getElements() {
        this.btnUp = this.actionMenu.querySelector('.btn-icon--up');
        this.btnDown = this.actionMenu.querySelector('.btn-icon--down');
        this.btnDelete = this.actionMenu.querySelector('.btn-icon--delete');
        this.btnCancel = this.actionMenu.querySelector('.btn-icon--cancel');

        this.btnDef = this.toolbarLower.querySelector(
          '.btn-icon--strong-def');
      }

      hide() {
        this.actionMenu.classList.add('action-menu--hide');
        this.page.classList.add('page--hide');
      }

      historyUpdate(strongHstory) {
        this.history = strongHstory;
        this.updateList();
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
      }

      listClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target.classList.contains('btn-entry--history')) {
            let strongDef = target.dataset.def;
            bus.publish('strong-history.select', strongDef);
          } else if (target.classList.contains('btn-icon--menu')) {
            let entry = target.previousSibling;
            this.menuClick(entry);
          }
        }
      }

      menuClick(target) {
        this.showActionMenu(target);
      }

      scrollToTop() {
        this.scroll.scrollTop = 0;
      }

      show() {
        this.page.classList.remove('page--hide');
      }

      showActionMenu(target) {
        this.activeEntry = target.closest('div');
        let top = target.offsetTop;
        this.actionMenu.style.top = `${top}px`;
        this.actionMenu.classList.remove('action-menu--hide');
      }

      subscribe() {
        bus.subscribe('strong-history.hide', () => {
          this.hide();
        });
        bus.subscribe('strong-history.show', () => {
          this.show();
        });

        bus.subscribe('strong.history.update', (strongHistory) => {
          this.historyUpdate(strongHistory);
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnDef) {
            bus.publish('strong-def', null);
          }
        }
      }

      up(strongDef) {
        bus.publish('strong-history.up', strongDef);
      }

      updateList() {
        this.scrollToTop();
        removeAllChildren(this.list);
        if (this.history.length === 0) {
          this.empty.classList.remove('empty--hide');
          this.clear.classList.add('clear--hide');
        } else {
          this.empty.classList.add('empty--hide');
          this.clear.classList.remove('clear--hide');
          let fragment = document.createDocumentFragment();
          for (let strongDef of this.history) {
            let entry = this.buildEntry(strongDef);
            fragment.appendChild(entry);
          }
          this.list.appendChild(fragment);
        }
      }

    }

    const dialogToolset$6 = [
      { type: 'label', text: 'Strong Number' },
      { type: 'input', label: 'Strong Number' },
      { type: 'btn', id: 'find', label: 'Find' }
    ];

    const lowerToolSet$i = [
      { type: 'btn', icon: 'strong-def', label: 'Strong Definition' }
    ];

    const upperToolSet$i = [
      { type: 'banner', modifier: 'strong-lookup', text: 'Strong Lookup' },
    ];

    class StrongLookupView {

      constructor() {
        this.initialize();
      }

      addListeners() {
        this.dialogBtns.addEventListener('click', (event) => {
          this.dialogClick(event);
        });
        this.inputStrongNum.addEventListener('keydown', (event) => {
          this.inputKeyDown(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      buildPage() {
        this.page = templatePage('strong-lookup');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$i);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('strong-lookup');
        this.dialog = templateDivDialog('strong-lookup', dialogToolset$6);
        this.scroll.appendChild(this.dialog);

        this.message = templateElement('div', 'message',
          'strong-lookup', null, null);
        this.scroll.appendChild(this.message);

        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet$i);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      dialogClick(event) {
        event.preventDefault();
        let target = event.target;
        if (target === this.btnFind) {
          this.findClick();
        }
      }

      error(message) {
        this.message.textContent = message;
        this.message.classList.remove('message--hide');
      }

      findClick() {
        let strongNum = this.inputStrongNum.value;
        if (strongNum) {
          bus.publish('strong-lookup.find', strongNum.toUpperCase());
        }
      }

      getElements() {
        this.banner = this.toolbarUpper.querySelector('.banner--strong-lookup');

        this.inputStrongNum = this.dialog.querySelector('.dialog-input');
        this.dialogBtns = this.dialog.querySelector('.dialog-btns');
        this.btnFind = this.dialogBtns.querySelector('.btn-dialog--find');

        this.btnDef = this.toolbarLower.querySelector('.btn-icon--strong-def');
      }

      hide() {
        this.page.classList.add('page--hide');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
      }

      inputKeyDown(event) {
        if (event.key === 'Enter') {
          this.findClick();
        }
      }

      show() {
        this.inputStrongNum.value = '';
        this.error.textContent = '';
        this.message.classList.add('message--hide');
        this.page.classList.remove('page--hide');
        this.inputStrongNum.focus();
      }

      subscribe() {
        bus.subscribe('strong-lookup.hide', () => {
          this.hide();
        });
        bus.subscribe('strong-lookup.show', () => {
          this.show();
        });

        bus.subscribe('strong.def.error', (message) => {
          this.error(message);
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnDef) {
            bus.publish('strong-def', null);
          }
        }
      }

    }

    const lowerToolSet$j = [
      { type: 'btn', icon: 'back', label: 'Back' },
      { type: 'btn', icon: 'filter', label: 'Strong Filter' },
      { type: 'btn', icon: 'strong-verse', label: 'Strong Verse' },
      { type: 'btn', icon: 'strong-def', label: 'Strong Definition' },
      { type: 'btn', icon: 'strong-mode', label: 'Strong Mode' }
    ];

    const upperToolSet$j = [
      { type: 'banner', modifier: 'strong-result', text: 'Strong Search' }
    ];

    const binIdx$1 = 0;
    const loadIncrement$1 = 50;

    class StrongResultView {

      constructor() {
        this.initialize();
      }

      addListeners() {
        this.list.addEventListener('click', (event) => {
          this.listClick(event);
        });
        this.loadMore.addEventListener('click', (event) => {
          this.loadMoreClick(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      addVerse(verseObj) {
        let btn = document.createElement('button');
        btn.classList.add('btn-result');
        btn.dataset.verseIdx = verseObj.k;
        let resultText = document.createElement('span');
        resultText.classList.add('span-search-text');
        let acrostic = this.buildAcrosticSpan(verseObj);
        let ref = this.buildRefSpan(verseObj);
        resultText.appendChild(ref);
        if (acrostic) {
          resultText.appendChild(acrostic);
        }
        let text = this.buildStrongText(verseObj);
        resultText.insertAdjacentHTML('beforeend', text);
        btn.appendChild(resultText);
        return btn;
      }

      applyFilter() {
        let tomeBin = this.strongWordTomeBin;
        let bookIdx = this.strongFilter.bookIdx;
        let chapterIdx = this.strongFilter.chapterIdx;
        if (bookIdx === -1 && chapterIdx === -1) {
          this.filteredVerses = tomeBin[tomeBinVerses];
          this.wordCount = tomeBin[tomeBinWordCount];
          this.verseCount = tomeBin[tomeBinVerseCount];
          this.citation = tomeName;
        } else {
          let books = tomeBin[tomeBinBooks];
          let bookBin = this.findBin(books, bookIdx);
          if (chapterIdx === -1) {
            this.filteredVerses = tomeBin[tomeBinVerses]
              .slice(bookBin[bookBinSliceStart], bookBin[bookBinSliceEnd]);
            this.wordCount = bookBin[bookBinWordCount];
            this.verseCount = bookBin[bookBinVerseCount];
            this.citation = tomeBooks[bookIdx][bookLongName];
          } else {
            let chapters = bookBin[bookBinChapters];
            let chapterBin = this.findBin(chapters, chapterIdx);
            this.filteredVerses = tomeBin[tomeBinVerses]
              .slice(chapterBin[chapterBinSliceStart],
                chapterBin[chapterBinSliceEnd]);
            this.wordCount = chapterBin[chapterBinWordCount];
            this.verseCount = chapterBin[chapterBinVerseCount];
            this.citation = tomeChapters[chapterIdx][chapterName];
          }
        }
      }

      buildAcrosticSpan(verseObj) {
        let acrosticSpan = undefined;
        if (tomeAcrostics) {
          let acrostic = tomeAcrostics[verseObj.k];
          if (acrostic) {
            acrosticSpan = document.createElement('span');
            acrosticSpan.classList.add('verse-acrostic');
            acrosticSpan.textContent = acrostic;
          }
        }
        return acrosticSpan;
      }

      buildPage() {
        this.page = templatePage('strong-result');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$j);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('strong-result');

        this.list = templateElement('div', 'list', 'strong-result', null, null);
        this.scroll.appendChild(this.list);

        this.loadMore = templateElement('div', 'load-more', 'strong-result', null, null);
        this.btnLoadMore = document.createElement('button');
        this.btnLoadMore.classList.add('btn-load-more');
        this.btnLoadMore.textContent = 'Load More';
        this.loadMore.appendChild(this.btnLoadMore);
        this.scroll.appendChild(this.loadMore);

        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet$j);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      buildRefSpan(verseObj) {
        let refSpan = document.createElement('span');
        refSpan.classList.add('verse-ref');
        refSpan.textContent = verseObj.v[verseCitation];
        return refSpan;
      }

      buildStrongText(verseObj) {
        let verseIdx = verseObj.k;
        let verse = verseObj.v;
        let parts = [];
        let kjvWords = verse[verseText].split(' ');
        let maps = this.strongWordMapObjs.find(x => x.k === verseIdx).v;
        for (let map of maps) {
          let strongStr = map[mapStrongNums].join(' ');
          let cleanNums = map[mapStrongNums].map(x => x.replace(/[()]/g, ''));
          let phrase = kjvWords.slice(map[mapSliceStart], map[mapSliceEnd]).join(' ');
          parts.push(phrase);
          if (cleanNums.includes(this.strongDef)) {
            parts.push(`<span class="super">${strongStr}</span>`);
          }
        }
        let innerHtml = parts.join(' ').replace(/ <span/g, '<span');
        return innerHtml;
      }

      changeFont() {
        if (this.lastFont) {
          this.list.classList.remove(this.lastFont.fontClass);
        }
        this.list.classList.add(this.font.fontClass);
      }

      changeFontSize() {
        if (this.lastFontSize) {
          this.list.classList.remove(this.lastFontSize);
        }
        this.list.classList.add(this.fontSize);
      }

      defUpdate(strongDefObj) {
        this.strongDefObj = strongDefObj;
        this.strongDef = this.strongDefObj.k;
      }

      filterUpdate(strongFilter) {
        this.strongFilter = strongFilter;
        if (this.strongWord) {
          this.applyFilter();
          this.updateBanner();
          this.updateList();
        }
      }

      findBin(bins, idx) {
        return bins.find((bin) => {
          return bin[binIdx$1] === idx;
        });
      }

      fontUpdate(font) {
        if (this.font) {
          this.lastFont = this.font;
        }
        this.font = font;
        this.changeFont();
      }

      fontSizeUpdate(fontSize) {
        if (this.fontSize) {
          this.lastFontSize = this.fontSize;
        }
        this.fontSize = fontSize;
        this.changeFontSize();
      }

      getElements() {
        this.banner = this.toolbarUpper.querySelector('.banner--strong-result');

        this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
        this.btnFilter = this.toolbarLower.querySelector('.btn-icon--filter');
        this.btnStrongMode = this.toolbarLower.querySelector(
          '.btn-icon--strong-mode');
        this.btnStrongDef = this.toolbarLower.querySelector(
          '.btn-icon--strong-def');
        this.btnStrongVerse = this.toolbarLower.querySelector(
          '.btn-icon--strong-verse');
      }

      hide() {
        this.page.classList.add('page--hide');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
        this.strongMode = false;
      }

      listClick(event) {
        event.preventDefault();
        let target = event.target;
        let btn = target.closest('button');
        if (btn) {
          if (btn.classList.contains('btn-result')) {
            let verseIdx = parseInt(btn.dataset.verseIdx);
            if (this.strongMode) {
              bus.publish('strong-result.strong-select', verseIdx);
            } else {
              bus.publish('strong-result.read-select', verseIdx);
            }
          }
        }
      }

      loadMoreClick(event) {
        event.preventDefault();
        let target = event.target;
        if (target === this.btnLoadMore) {
          this.loadVerses();
        }
      }

      loadVerses() {
        let verses;
        if (this.verseCount <= loadIncrement$1) {
          verses = this.filteredVerses;
          this.loadIdx = this.verseCount;
        } else {
          let sliceEnd = Math.min(this.loadIdx + loadIncrement$1, this.verseCount);
          verses = this.filteredVerses.slice(this.loadIdx, sliceEnd);
          this.loadIdx = sliceEnd;
        }

        let fragment = document.createDocumentFragment();
        let verseObjs = this.strongWordVerseObjs.filter(x => verses.includes(x.k));
        for (let verseObj of verseObjs) {
          let verse = this.addVerse(verseObj);
          fragment.appendChild(verse);
        }
        this.list.appendChild(fragment);

        if (this.loadIdx < this.verseCount) {
          this.loadMore.classList.remove('btn-load-more--hide');
        } else {
          this.loadMore.classList.add('btn-load-more--hide');
        }
      }

      modeUpdate(strongMode) {
        this.strongMode = strongMode;
        if (this.strongMode) {
          this.btnStrongMode.classList.add('btn-icon--active');
        } else {
          this.btnStrongMode.classList.remove('btn-icon--active');
        }
      }

      panesUpdate(panes) {
        if (panes === 1) {
          this.btnBack.classList.remove('btn-icon--hide');
        } else {
          this.btnBack.classList.add('btn-icon--hide');
        }
      }

      scrollToTop() {
        this.scroll.scrollTop = 0;
      }

      show() {
        this.page.classList.remove('page--hide');
      }

      subscribe() {
        bus.subscribe('font.update', (font) => {
          this.fontUpdate(font);
        });

        bus.subscribe('font-size.update', (fontSize) => {
          this.fontSizeUpdate(fontSize);
        });

        bus.subscribe('panes.update', (panes) => {
          this.panesUpdate(panes);
        });

        bus.subscribe('strong-result.hide', () => {
          this.hide();
        });
        bus.subscribe('strong-result.show', () => {
          this.show();
        });

        bus.subscribe('strong.def.update', (strongDefObj) => {
          this.defUpdate(strongDefObj);
        });
        bus.subscribe('strong.filter.update', (strongFilter) => {
          this.filterUpdate(strongFilter);
        });
        bus.subscribe('strong.strong-mode.update', (strongMode) => {
          this.modeUpdate(strongMode);
        });
        bus.subscribe('strong.word.update', (strongWord) => {
          this.wordUpdate(strongWord);
        });
        bus.subscribe('strong.wordTomeBin.update', (wordTomeBin) => {
          this.wordTomeBinUpdate(wordTomeBin);
        });
        bus.subscribe('strong.wordMap.update', (wordMapObjs) => {
          this.wordMapUpdate(wordMapObjs);
        });
        bus.subscribe('strong.wordVerse.update', (wordVerseObjs) => {
          this.wordVerseUpdate(wordVerseObjs);
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnBack) {
            bus.publish('strong.back', null);
          } else if (target === this.btnFilter) {
            bus.publish('strong-filter', null);
          } else if (target === this.btnStrongMode) {
            bus.publish('strong.strong-mode.click', null);
          } else if (target === this.btnStrongDef) {
            bus.publish('strong-def', null);
          } else if (target === this.btnStrongVerse) {
            bus.publish('strong-verse', null);
          }
        }
      }

      updateBanner() {
        this.banner.innerHTML = `${this.citation} ` +
          `(${this.wordCount}/${this.verseCount})<br>` +
          `${this.strongDef} ${this.strongWord}`;
      }

      updateList() {
        this.scrollToTop();
        removeAllChildren(this.list);
        this.loadIdx = 0;
        this.loadedVerses = 0;
        this.loadVerses();
      }

      wordMapUpdate(wordMapObjs) {
        this.strongWordMapObjs = wordMapObjs;
      }

      wordTomeBinUpdate(wordTomeBin) {
        this.strongWordTomeBin = wordTomeBin;
      }

      wordVerseUpdate(wordVerseObjs) {
        this.strongWordVerseObjs = wordVerseObjs;
      }

      wordUpdate(strongWord) {
        this.strongWord = strongWord;
      }

    }

    const lowerToolSet$k = [
      { type: 'btn', icon: 'back', label: 'Back' },
      { type: 'btn', icon: 'strong-def', label: 'Strong Definition' },
      { type: 'btn', icon: 'result', label: 'Strong Search' }
    ];

    const upperToolSet$k = [
      { type: 'banner', modifier: 'strong-verse', text: 'Strong Verse' }
    ];

    class StrongVerseView {

      constructor() {
        this.initialize();
      }

      addListeners() {
        this.list.addEventListener('click', (event) => {
          this.listClick(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      buildPage() {
        this.page = templatePage('strong-verse');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$k);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('strong-verse');
        this.list = templateElement('div', 'list', 'strong-verse', null, null);
        this.scroll.appendChild(this.list);
        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet$k);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      buildStrongFragment(map) {
        let text = this.verseWords.slice(map[mapSliceStart], map[mapSliceEnd])
          .join(' ');
        let strongFragment = templateElement('div', 'strong-fragment',
          null, null, null);
        let verseFragment = templateElement('div', 'verse-fragment',
          null, null, text);
        let strongList = templateElement('div', 'strong-list',
          null, null, null);
        for (let num of map[mapStrongNums]) {
          let btn = templateElement('button', 'btn-strong',
            null, null, num);
          btn.dataset.strongDef = num.replace(/[()]/g, '');
          strongList.appendChild(btn);
        }
        strongFragment.appendChild(verseFragment);
        strongFragment.appendChild(strongList);
        return strongFragment;
      }

      getElements() {
        this.banner = this.toolbarUpper.querySelector('.banner--strong-verse');

        this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
        this.btnStrongDef = this.toolbarLower.querySelector(
          '.btn-icon--strong-def');
        this.btnResult = this.toolbarLower.querySelector(
          '.btn-icon--result');
      }

      getVerseWords() {
        let clean_verse = this.verse[verseText].replace(/[,.?;:!()-]/g, '');
        this.verseWords = clean_verse.split(' ');
      }

      hide() {
        this.page.classList.add('page--hide');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
      }

      listClick(event) {
        event.preventDefault();
        let target = event.target;
        if (target.classList.contains('btn-strong')) {
          let strongDef = target.dataset.strongDef;
          bus.publish('strong-verse.select', strongDef);
        }
      }

      mapUpdate(strongMapObj) {
        this.strongMapObj = strongMapObj;
        this.maps = this.strongMapObj.v;
      }

      panesUpdate(panes) {
        if (panes === 1) {
          this.btnBack.classList.remove('btn-icon--hide');
        } else {
          this.btnBack.classList.add('btn-icon--hide');
        }
      }

      scrollToTop() {
        this.scroll.scrollTop = 0;
      }

      show() {
        this.page.classList.remove('page--hide');
      }

      subscribe() {
        bus.subscribe('panes.update', (panes) => {
          this.panesUpdate(panes);
        });

        bus.subscribe('strong-verse.hide', () => {
          this.hide();
        });
        bus.subscribe('strong-verse.show', () => {
          this.show();
        });

        bus.subscribe('strong.map.update', (strongMapObj) => {
          this.mapUpdate(strongMapObj);
        });
        bus.subscribe('strong.verse.update', (strongVerseObj) => {
          this.verseUpdate(strongVerseObj);
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnBack) {
            bus.publish('strong.back', null);
          } else if (target === this.btnStrongDef) {
            bus.publish('strong-def', null);
          } else if (target === this.btnResult) {
            bus.publish('strong-result', null);
          }
        }
      }

      updateBanner() {
        this.banner.textContent = this.verse[verseCitation];
      }

      updateList() {
        this.scrollToTop();
        removeAllChildren(this.list);
        let docFragment = document.createDocumentFragment();
        this.getVerseWords();
        for (let map of this.maps) {
          let strongMap = this.buildStrongFragment(map);
          docFragment.appendChild(strongMap);
        }
        this.list.appendChild(docFragment);
      }

      verseUpdate(strongVerseObj) {
        this.strongVerseObj = strongVerseObj;
        this.strongVerse = this.strongVerseObj.k;
        this.verse = this.strongVerseObj.v;
        this.updateBanner();
        this.updateList();
      }

    }

    class StrongController {

      constructor() {
        this.initialize();
      }

      back() {
        bus.publish('sidebar.change', 'none');
      }

      chapterIdxUpdate() {
        if (this.selectVerseIdx) {
          if (this.panes === 1 && this.sidebar !== 'none') {
            bus.publish('sidebar.select', 'none');
          }
          bus.publish('read.scroll-to-verse', this.selectVerseIdx);
          this.selectVerseIdx = null;
        }
      }

      def() {
        bus.publish('strong.task.change', 'strong-def');
      }

      defSelect(strongDef) {
        bus.publish('strong.def.sub-change', strongDef);
      }

      defUpdate() {
        bus.publish('strong.task.change', 'strong-def');
      }

      filter() {
        bus.publish('strong.task.change', 'strong-filter');
      }

      filterSelect(strongFilter) {
        bus.publish('strong.filter.change', strongFilter);
        bus.publish('strong.task.change', 'strong-result');
      }

      hide() {
        bus.publish(`${this.strongTask}.hide`, null);
      }

      history() {
        bus.publish('strong.task.change', 'strong-history');
      }

      historyClear() {
        bus.publish('strong.history.clear', null);
      }

      historyDelete(strongDef) {
        bus.publish('strong.history.delete', strongDef);
      }

      historyDown(strongDef) {
        bus.publish('strong.history.down', strongDef);
      }

      historySelect(strongDef) {
        bus.publish('strong.def.change', strongDef);
        bus.publish('strong.task.change', 'strong-def');
      }

      historyUp(strongDef) {
        bus.publish('strong.history.up', strongDef);
      }

      initialize() {
        this.subscribe();
      }

      lookup() {
        bus.publish('strong.task.change', 'strong-lookup');
      }

      lookupFind(strongNum) {
        bus.publish('strong.def.change', strongNum);
      }

      modeToggle() {
        bus.publish('strong.strong-mode.toggle', null);
      }

      nextStrong() {
        bus.publish('strong.next', null);
      }

      panesUpdate(panes) {
        this.panes = panes;
      }

      prevStrong() {
        bus.publish('strong.prev', null);
      }

      readSelect(verseIdx) {
        this.selectVerseIdx = verseIdx;
        let chapterIdx = chapterIdxByVerseIdx(verseIdx);
        bus.publish('chapterIdx.change', chapterIdx);
      }

      show() {
        bus.publish(`${this.strongTask}.show`, null);
      }

      sidebarUpdate(sidebar) {
        this.sidebar = sidebar;
      }

      search() {
        bus.publish('strong.task.change', 'strong-result');
      }

      strongSelect(verseIdx) {
        bus.publish('strong.verse.change', verseIdx);
        bus.publish('strong.task.change', 'strong-verse');
      }

      subscribe() {
        bus.subscribe('chapterIdx.update', () => {
          this.chapterIdxUpdate();
        });

        bus.subscribe('panes.update', (panes) => {
          this.panesUpdate(panes);
        });

        bus.subscribe('sidebar.update', (sidebar) => {
          this.sidebarUpdate(sidebar);
        });

        bus.subscribe('strong-def', () => {
          this.def();
        });
        bus.subscribe('strong-def.next.strong',
          () => { this.nextStrong(); }
        );
        bus.subscribe('strong-def.prev.strong',
          () => { this.prevStrong(); }
        );
        bus.subscribe('strong-def.select', (strongDef) => {
          this.defSelect(strongDef);
        });
        bus.subscribe('strong-def.word.select', (strongWord) => {
          this.wordSelect(strongWord);
        });

        bus.subscribe('strong-filter', () => {
          this.filter();
        });
        bus.subscribe('strong-filter.select', (strongFilter) => {
          this.filterSelect(strongFilter);
        });

        bus.subscribe('strong-history', () => {
          this.history();
        });
        bus.subscribe('strong-history.clear', () => {
          this.historyClear();
        });
        bus.subscribe('strong-history.delete', (strongDef) => {
          this.historyDelete(strongDef);
        });
        bus.subscribe('strong-history.down', (strongDef) => {
          this.historyDown(strongDef);
        });
        bus.subscribe('strong-history.select', (strongDef) => {
          this.historySelect(strongDef);
        });
        bus.subscribe('strong-history.up', (strongDef) => {
          this.historyUp(strongDef);
        });

        bus.subscribe('strong-lookup', () => {
          this.lookup();
        });
        bus.subscribe('strong-lookup.find', (strongNum) => {
          this.lookupFind(strongNum);
        });

        bus.subscribe('strong-result', () => {
          this.search();
        });
        bus.subscribe('strong-result.read-select', (verseIdx) => {
          this.readSelect(verseIdx);
        });
        bus.subscribe('strong-result.strong-select', (verseIdx) => {
          this.strongSelect(verseIdx);
        });

        bus.subscribe('strong-verse', () => {
          this.verse();
        });
        bus.subscribe('strong-verse.select', (strongDef) => {
          this.verseSelect(strongDef);
        });

        bus.subscribe('strong.back', () => {
          this.back();
        });
        bus.subscribe('strong.def.update', () => {
          this.defUpdate();
        });
        bus.subscribe('strong.hide', () => {
          this.hide();
        });
        bus.subscribe('strong.show', () => {
          this.show();
        });
        bus.subscribe('strong.strong-mode.click', () => {
          this.modeToggle();
        });
        bus.subscribe('strong.task.update', (strongTask) => {
          this.taskUpdate(strongTask);
        });
      }

      taskUpdate(strongTask) {
        if (this.sidebar === 'strong') {
          bus.publish(`${this.strongTask}.hide`, null);
          this.strongTask = strongTask;
          bus.publish(`${this.strongTask}.show`, null);
        } else {
          this.strongTask = strongTask;
        }
      }

      verse() {
        bus.publish('strong.task.change', 'strong-verse');
      }

      verseSelect(strongDef) {
        bus.publish('strong.def.change', strongDef);
        bus.publish('strong.task.change', 'strong-def');
      }

      wordSelect(strongWord) {
        bus.publish('strong.word.change', strongWord);
        bus.publish('strong.task.change', 'strong-result');
      }

    }

    const validFontSizes = ['font-size--s', 'font-size--m', 'font-size--l',
      'font-size--xl', 'font-size--xxl'
    ];

    const fontDefault = 0;
    const fontSizeDefault = 1;
    const themeDefault = 1;

    class SettingModel {

      constructor() {
        this.initialize();
      }

      fontChange(font) {
        this.font = font;
        this.saveFont();
        bus.publish('font.update', this.font);
      }

      fontIsValid(font) {
        let result;
        try {
          result = this.fonts.some((validFont) => {
            return validFont.fontName === font.fontName &&
              validFont.fontClass === font.fontClass;
          });
        } catch (error) {
          result = false;
        }
        return result;
      }

      fontSizeChange(fontSize) {
        this.fontSize = fontSize;
        this.saveFontSize();
        bus.publish('font-size.update', this.fontSize);
      }

      initialize() {
        this.subscribe();
      }

      initializeFonts() {
        this.fonts = [];
        this.fonts.push({
          fontName: 'Roboto',
          fontClass: 'font--roboto'
        });
        this.fonts.push({
          fontName: 'Open Sans',
          fontClass: 'font--open-sans'
        });
        this.fonts.push({
          fontName: 'Lato',
          fontClass: 'font--lato'
        });
        this.fonts.push({
          fontName: 'Roboto Slab',
          fontClass: 'font--roboto-slab'
        });
        this.fonts.push({
          fontName: 'Merriweather',
          fontClass: 'font--merriweather'
        });
        this.fonts.push({
          fontName: 'Playfair Display',
          fontClass: 'font--playfair-display'
        });
        bus.publish('fonts.update', this.fonts);
      }

      initializeThemes() {
        this.themes = [];
        this.themes.push({
          themeName: 'Jasper',
          themeClass: 'theme--jasper'
        });
        this.themes.push({
          themeName: 'Sapphire',
          themeClass: 'theme--sapphire'
        });
        this.themes.push({
          themeName: 'Chalcedony',
          themeClass: 'theme--chalcedony'
        });
        this.themes.push({
          themeName: 'Emerald',
          themeClass: 'theme--emerald'
        });
        this.themes.push({
          themeName: 'Beryl',
          themeClass: 'theme--beryl'
        });
        this.themes.push({
          themeName: 'Topaz',
          themeClass: 'theme--topaz'
        });
        this.themes.push({
          themeName: 'Amethyst',
          themeClass: 'theme--amethyst'
        });
        bus.publish('themes.update', this.themes);
      }

      restore() {
        this.initializeFonts();
        this.restoreFont();
        this.restoreFontSize();
        this.initializeThemes();
        this.restoreTheme();
      }

      restoreFont() {
        let defaultFont = this.fonts[fontDefault];
        let font = localStorage.getItem(`${appPrefix}-font`);
        if (!font) {
          font = defaultFont;
        } else {
          try {
            font = JSON.parse(font);
          } catch (error) {
            font = defaultFont;
          }
          if (!this.fontIsValid(font)) {
            font = defaultFont;
          }
        }
        this.fontChange(font);
      }

      restoreFontSize() {
        let defaultFontSize = validFontSizes[fontSizeDefault];
        let fontSize = localStorage.getItem(`${appPrefix}-fontSize`);
        if (!fontSize) {
          fontSize = defaultFontSize;
        } else {
          try {
            fontSize = JSON.parse(fontSize);
          } catch (error) {
            fontSize = defaultFontSize;
          }
          if (!validFontSizes.includes(fontSize)) {
            fontSize = defaultFontSize;
          }
        }
        this.fontSizeChange(fontSize);
      }

      restoreTheme() {
        let defaultTheme = this.themes[themeDefault];
        let theme = localStorage.getItem(`${appPrefix}-theme`);
        if (!theme) {
          theme = defaultTheme;
        } else {
          try {
            theme = JSON.parse(theme);
          } catch (error) {
            theme = defaultTheme;
          }
          if (!this.themeIsValid(theme)) {
            theme = defaultTheme;
          }
        }
        this.themeChange(theme);
      }

      saveFont() {
        localStorage.setItem(`${appPrefix}-font`, JSON.stringify(this.font));
      }

      saveFontSize() {
        localStorage.setItem(`${appPrefix}-fontSize`, JSON.stringify(this.fontSize));
      }

      saveTheme() {
        localStorage.setItem(`${appPrefix}-theme`, JSON.stringify(this.theme));
      }

      subscribe() {
        bus.subscribe('font.change', (font) => {
          this.fontChange(font);
        });

        bus.subscribe('font-size.change', (fontSize) => {
          this.fontSizeChange(fontSize);
        });

        bus.subscribe('setting.restore', () => {
          this.restore();
        });

        bus.subscribe('theme.change', (theme) => {
          this.themeChange(theme);
        });
      }

      themeChange(theme) {
        this.theme = theme;
        this.saveTheme();
        bus.publish('theme.update', this.theme);
      }

      themeIsValid(theme) {
        let result;
        try {
          result = this.themes.some((validTheme) => {
            return validTheme.themeName === theme.themeName &&
              validTheme.themeClass === theme.themeClass;
          });
        } catch (error) {
          result = false;
        }
        return result;
      }

    }

    const lowerToolSet$l = [
      { type: 'btn', icon: 'back', label: 'Back' }
    ];

    const upperToolSet$l = [
      { type: 'banner', modifier: 'setting', text: 'Setting' }
    ];

    const fontSize = [
      { size: 's', label: 'Small' },
      { size: 'm', label: 'Medium' },
      { size: 'l', label: 'Large' },
      { size: 'xl', label: 'Extra Large' },
      { size: 'xxl', label: 'Extra Extra Large' }
    ];

    const templateBtnFontSize = (size, label) => {
      let btnFontSize = templateElement(
        'button', 'btn-font-size', null, label, null);
      btnFontSize.textContent = 'Aa';
      btnFontSize.classList.add(`font-size--${size}`);
      btnFontSize.dataset.size = `font-size--${size}`;
      return btnFontSize;
    };

    const templateSettingFontSize = (modifier, name) => {
      let divSetting = templateElement(
        'div', 'setting', modifier, null, null);
      let heading = templateElement(
        'h1', 'header', modifier, null, name);
      divSetting.appendChild(heading);
      let divSelector = templateElement(
        'div', 'selector', 'font-size', null, null);
      for (let size of fontSize) {
        let btn = templateBtnFontSize(size.size, size.label);
        divSelector.appendChild(btn);
      }
      divSetting.appendChild(divSelector);
      return divSetting;
    };

    const templateSettingCarousel = (modifier, name) => {
      let divSetting = templateElement(
        'div', 'setting', modifier, null, null);
      let heading = templateElement(
        'h1', 'header', modifier, null, name);
      divSetting.appendChild(heading);
      let divCarousel = templateElement(
        'div', 'carousel', modifier, null, null);
      let btnPrev = templateBtnIcon('prev', `Previous ${name}`);
      let divName = templateElement(
        'div', 'name', modifier, null, null);
      let btnNext = templateBtnIcon('next', `Next ${name}`);
      divCarousel.appendChild(btnPrev);
      divCarousel.appendChild(divName);
      divCarousel.appendChild(btnNext);
      divSetting.appendChild(divCarousel);
      return divSetting;
    };

    class SettingView {

      constructor() {
        this.initialize();
      }

      addListeners() {
        this.scroll.addEventListener('click', (event) => {
          this.scrollClick(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      buildPage() {
        this.page = templatePage('setting');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$l);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('setting');

        this.fontSample = templateElement('div', 'font-sample', null, null, null);
        this.fontSample.innerHTML = '<p class="font-sample-verse">' +
          '<span class="verse-ref">1 John 4:19</span>' +
          'We love him, because he first loved us.</p>';
        this.scroll.appendChild(this.fontSample);

        this.divSettingFont = templateSettingCarousel('font', 'Font');
        this.scroll.appendChild(this.divSettingFont);

        this.divSettingFontSize = templateSettingFontSize('font-size', 'Font Size');
        this.scroll.appendChild(this.divSettingFontSize);

        this.divSettingTheme = templateSettingCarousel('theme', 'Theme');
        this.scroll.appendChild(this.divSettingTheme);

        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet$l);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      fontClick(target) {
        let btn = target.closest('button');
        if (btn) {
          if (btn === this.btnPrevFont) {
            bus.publish('setting.font-prev', null);
          } else if (btn === this.btnNextFont) {
            bus.publish('setting.font-next', null);
          }
        }
      }

      fontSizeClick(target) {
        let btn = target.closest('button');
        if (btn.classList.contains('btn-font-size')) {
          let dataSize = btn.dataset.size;
          bus.publish('setting.font-size', dataSize);
        }
      }

      fontSizeUpdate(fontSize) {
        this.fontSize = fontSize;
        this.updateFontSizeBtn();
        this.updateFontSize();
        this.lastFontSize = this.fontSize;
      }

      fontUpdate(font) {
        this.font = font;
        this.updateFontName();
        this.updateFont();
        this.lastFont = this.font;
      }

      getElements() {
        this.divCarouselFont = this.divSettingFont.querySelector('.carousel--font');
        this.btnPrevFont = this.divCarouselFont.querySelector('.btn-icon--prev');
        this.divNameFont = this.divCarouselFont.querySelector('.name--font');
        this.btnNextFont = this.divCarouselFont.querySelector('.btn-icon--next');

        this.divSelectorFontSize = this.divSettingFontSize.querySelector('.selector--font-size');

        this.divCarouselTheme = this.divSettingTheme.querySelector(
          '.carousel--theme');
        this.btnPrevTheme = this.divCarouselTheme.querySelector('.btn-icon--prev');
        this.divNameTheme = this.divCarouselTheme.querySelector('.name--theme');
        this.btnNextTheme = this.divCarouselTheme.querySelector('.btn-icon--next');

        this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
      }

      hide() {
        this.page.classList.add('page--hide');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
        this.lastFont = null;
        this.lastFontSize = null;
        this.lastTheme = null;
      }

      panesUpdate(panes) {
        if (panes === 1) {
          this.btnBack.classList.remove('btn-icon--hide');
        } else {
          this.btnBack.classList.add('btn-icon--hide');
        }
      }

      scrollClick(event) {
        event.preventDefault();
        let target = event.target;
        if (this.divCarouselFont.contains(target)) {
          this.fontClick(target);
        } else if (this.divSelectorFontSize.contains(target)) {
          this.fontSizeClick(target);
        } else if (this.divCarouselTheme.contains(target)) {
          this.themeClick(target);
        }
      }

      show() {
        this.page.classList.remove('page--hide');
      }

      subscribe() {
        bus.subscribe('font.update', (font) => {
          this.fontUpdate(font);
        });

        bus.subscribe('font-size.update', (fontSize) => {
          this.fontSizeUpdate(fontSize);
        });

        bus.subscribe('setting.hide', () => {
          this.hide();
        });
        bus.subscribe('setting.show', () => {
          this.show();
        });

        bus.subscribe('theme.update', (theme) => {
          this.themeUpdate(theme);
        });

        bus.subscribe('panes.update', (panes) => {
          this.panesUpdate(panes);
        });
      }

      themeClick(target) {
        let btn = target.closest('button');
        if (btn) {
          if (btn === this.btnPrevTheme) {
            bus.publish('setting.theme-prev', null);
          } else if (btn === this.btnNextTheme) {
            bus.publish('setting.theme-next', null);
          }
        }
      }

      themeUpdate(theme) {
        this.theme = theme;
        this.updateThemeName();
        this.lastTheme = this.theme;
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnBack) {
            bus.publish('setting.back', null);
          }
        }
      }

      updateFont() {
        if (this.lastFont) {
          this.divCarouselFont.classList.remove(this.lastFont.fontClass);
          this.divSelectorFontSize.classList.remove(this.lastFont.fontClass);
          this.fontSample.classList.remove(this.lastFont.fontClass);
        }
        this.divCarouselFont.classList.add(this.font.fontClass);
        this.divSelectorFontSize.classList.add(this.font.fontClass);
        this.fontSample.classList.add(this.font.fontClass);
      }

      updateFontName() {
        this.divNameFont.innerText = this.font.fontName;
        this.updateFont(this.fontName);
      }

      updateFontSize() {
        if (this.lastFontSize) {
          this.fontSample.classList.remove(this.lastFontSize);
        }
        this.fontSample.classList.add(this.fontSize);
      }

      updateFontSizeBtn() {
        if (this.activeFontSizeBtn) {
          this.activeFontSizeBtn.classList.remove('btn-font-size--active');
        }
        this.activeFontSizeBtn = this.divSelectorFontSize.querySelector(
          `button[data-size="${this.fontSize}"]`
        );
        this.activeFontSizeBtn.classList.add('btn-font-size--active');
      }

      updateThemeName() {
        this.divNameTheme.innerText = this.theme.themeName;
      }

    }

    class SettingController {

      constructor() {
        this.initialize();
      }

      back() {
        bus.publish('sidebar.change', 'none');
      }

      fontNext() {
        this.getNextFontIdx();
        bus.publish('font.change', this.fonts[this.fontIdx]);
      }

      fontPrev() {
        this.getPrevFontIdx();
        bus.publish('font.change', this.fonts[this.fontIdx]);
      }

      fontSize(fontSize) {
        bus.publish('font-size.change', fontSize);
      }

      fontUpdate(font) {
        this.font = font;
        if (!this.fontIdx) {
          this.fontIdx = this.fonts.findIndex((font) => {
            return font.fontName === this.font.fontName;
          });
        }
      }

      fontsUpdate(fonts) {
        this.fonts = fonts;
        this.maxFontIdx = this.fonts.length - 1;
      }

      getNextFontIdx() {
        this.fontIdx = this.fontIdx === this.maxFontIdx ? 0 : this.fontIdx += 1;
      }

      getPrevFontIdx() {
        this.fontIdx = this.fontIdx === 0 ? this.maxFontIdx : this.fontIdx -= 1;
      }

      getNextThemeIdx() {
        this.themeIdx = this.themeIdx === this.maxThemeIdx ? 0 : this.themeIdx += 1;
      }

      getPrevThemeIdx() {
        this.themeIdx = this.themeIdx === 0 ? this.maxThemeIdx : this.themeIdx -= 1;
      }

      initialize() {
        this.subscribe();
      }

      subscribe() {
        bus.subscribe('font.update', (font) => {
          this.fontUpdate(font);
        });

        bus.subscribe('fonts.update', (fonts) => {
          this.fontsUpdate(fonts);
        });

        bus.subscribe('setting.back', () => {
          this.back();
        });
        bus.subscribe('setting.font-next', () => {
          this.fontNext();
        });
        bus.subscribe('setting.font-prev', () => {
          this.fontPrev();
        });
        bus.subscribe('setting.font-size', (fontSize) => {
          this.fontSize(fontSize);
        });

        bus.subscribe('setting.theme-next', () => {
          this.themeNext();
        });
        bus.subscribe('setting.theme-prev', () => {
          this.themePrev();
        });

        bus.subscribe('theme.update', (theme) => {
          this.themeUpdate(theme);
        });

        bus.subscribe('themes.update', (themes) => {
          this.themesUpdate(themes);
        });
      }

      themeNext() {
        this.getNextThemeIdx();
        bus.publish('theme.change', this.themes[this.themeIdx]);
      }

      themePrev() {
        this.getPrevThemeIdx();
        bus.publish('theme.change', this.themes[this.themeIdx]);
      }

      themeUpdate(theme) {
        this.theme = theme;
        if (!this.themeIdx) {
          this.themeIdx = this.themes.findIndex((theme) => {
            return theme.themeName === this.theme.themeName;
          });
        }
      }

      themesUpdate(themes) {
        this.themes = themes;
        this.maxThemeIdx = this.themes.length - 1;
      }

    }

    const validTasks$4 = ['help-read', 'help-topic'];
    const validTopics = ['about', 'bookmark', 'help', 'navigator', 'overview',
      'read', 'search', 'setting', 'strong', 'thats-my-king'];

    class HelpModel {

      constructor() {
        this.initialize();
      }

      initialize() {
        this.subscribe();
      }

      restore() {
        this.restoreTask();
        this.restoreTopic();
      }

      restoreTask() {
        let defaultTask = 'help-read';
        let helpTask = localStorage.getItem(`${appPrefix}-helpTask`);
        if (!helpTask) {
          helpTask = defaultTask;
        } else {
          try {
            helpTask = JSON.parse(helpTask);
          } catch (error) {
            helpTask = defaultTask;
          }
          if (!validTasks$4.includes(helpTask)) {
            helpTask = defaultTask;
          }
        }
        this.taskChange(helpTask);
      }

      restoreTopic() {
        let defaultTopic = 'overview';
        let helpTopic = localStorage.getItem(`${appPrefix}-helpTopic`);
        if (!helpTopic) {
          helpTopic = defaultTopic;
        } else {
          try {
            helpTopic = JSON.parse(helpTopic);
          } catch (error) {
            helpTopic = defaultTopic;
          }
          if (!validTopics.includes(helpTopic)) {
            helpTopic = defaultTopic;
          }
        }
        this.topicChange(helpTopic);
      }

      saveHelpTask() {
        localStorage.setItem(`${appPrefix}-helpTask`, JSON.stringify(this.helpTask));
      }

      saveHelpTopic() {
        localStorage.setItem(`${appPrefix}-helpTopic`, JSON.stringify(this.helpTopic));
      }

      subscribe() {
        bus.subscribe('help.restore', () => {
          this.restore();
        });
        bus.subscribe('help.task.change', (helpTask) => {
          this.taskChange(helpTask);
        });
        bus.subscribe('help.topic.change', (helpTopic) => {
          this.topicChange(helpTopic);
        });
      }

      taskChange(helpTask) {
        this.helpTask = helpTask;
        this.saveHelpTask();
        bus.publish('help.task.update', this.helpTask);
      }

      topicChange(helpTopic) {
        this.helpTopic = helpTopic;
        this.saveHelpTopic();
        bus.publish('help.topic.update', this.helpTopic);
      }

    }

    const lowerToolSet$m = [
      { type: 'btn', icon: 'back', label: 'Back' },
      { type: 'btn', icon: 'help-read', label: 'Help Read' }
    ];

    const upperToolSet$m = [
      { type: 'banner', modifier: 'topic', text: 'Topic' }
    ];

    const helpTopicList = [
      { topic: 'about', name: 'About' },
      { topic: 'overview', name: 'Overview' },
      { topic: 'read', name: 'Read' },
      { topic: 'navigator', name: 'Navigator' },
      { topic: 'bookmark', name: 'Bookmark' },
      { topic: 'search', name: 'Search' },
      { topic: 'strong', name: 'Strong' },
      { topic: 'setting', name: 'Setting' },
      { topic: 'help', name: 'Help' },
      { topic: 'thats-my-king', name: 'That\'s MY KING!' }
    ];

    const templateBtnTopic = (helpTopic) => {
      let btnTopic = templateElement(
        'button', 'btn-topic', helpTopic.topic, helpTopic.name, helpTopic.name);
      btnTopic.dataset.topic = helpTopic.topic;
      return btnTopic;
    };

    const templateListTopic = () => {
      let list = templateElement(
        'div', 'list', 'topic', null, null);
      for (let topic of helpTopicList) {
        let btn = templateBtnTopic(topic);
        list.appendChild(btn);
      }
      return list;
    };

    class HelpTopicView {

      constructor() {
        this.initialize();
      }

      addListeners() {
        this.scroll.addEventListener('click', (event) => {
          this.scrollClick(event);
        });
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      buildPage() {
        this.page = templatePage('help-topic');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$m);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('help-topic');
        this.list = templateListTopic();
        this.scroll.appendChild(this.list);

        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet$m);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      getElements() {
        this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
        this.btnHelpRead = this.toolbarLower.querySelector('.btn-icon--help-read');
      }

      hide() {
        this.page.classList.add('page--hide');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
      }

      panesUpdate(panes) {
        if (panes === 1) {
          this.btnBack.classList.remove('btn-icon--hide');
        } else {
          this.btnBack.classList.add('btn-icon--hide');
        }
      }

      scrollClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target.classList.contains('btn-topic')) {
            let helpTopic = target.dataset.topic;
            bus.publish('help-topic.select', helpTopic);
          }
        }
      }

      show() {
        this.page.classList.remove('page--hide');
      }

      subscribe() {
        bus.subscribe('help-topic.show', () => {
          this.show();
        });
        bus.subscribe('help-topic.hide', () => {
          this.hide();
        });

        bus.subscribe('panes.update', (panes) => {
          this.panesUpdate(panes);
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnBack) {
            bus.publish('help.back', null);
          } else if (target === this.btnHelpRead) {
            bus.publish('help-read', null);
          }
        }
      }

    }

    const lowerToolSet$n = [
      { type: 'btn', icon: 'back', label: 'Back' },
      { type: 'btn', icon: 'help-topic', label: 'Help Topic' }
    ];

    const upperToolSet$n = [
      { type: 'banner', modifier: 'help-read', text: null },
    ];

    class HelpReadView {

      constructor() {
        this.initialize();
      }

      addListeners() {
        this.toolbarLower.addEventListener('click', (event) => {
          this.toolbarLowerClick(event);
        });
      }

      buildPage() {
        this.page = templatePage('help-read');

        this.toolbarUpper = templateToolbarUpper(upperToolSet$n);
        this.page.appendChild(this.toolbarUpper);

        this.scroll = templateScroll('help-read');
        this.page.appendChild(this.scroll);

        this.toolbarLower = templateToolbarLower(lowerToolSet$n);
        this.page.appendChild(this.toolbarLower);

        let container = document.querySelector('.container');
        container.appendChild(this.page);
      }

      getElements() {
        this.banner = this.toolbarUpper.querySelector('.banner--help-read');

        this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
        this.btnHelpTopic = this.toolbarLower.querySelector('.btn-icon--help-topic');
      }

      hide() {
        this.page.classList.add('page--hide');
      }

      initialize() {
        this.buildPage();
        this.getElements();
        this.addListeners();
        this.subscribe();
      }

      panesUpdate(panes) {
        if (panes === 1) {
          this.btnBack.classList.remove('btn-icon--hide');
        } else {
          this.btnBack.classList.add('btn-icon--hide');
        }
      }

      show() {
        this.page.classList.remove('page--hide');
      }

      subscribe() {
        bus.subscribe('help-read.show', () => {
          this.show();
        });
        bus.subscribe('help-read.hide', () => {
          this.hide();
        });

        bus.subscribe('help.topic.update', (helpTopic) => {
          this.topicUpdate(helpTopic);
        });

        bus.subscribe('panes.update', (panes) => {
          this.panesUpdate(panes);
        });
      }

      toolbarLowerClick(event) {
        event.preventDefault();
        let target = event.target.closest('button');
        if (target) {
          if (target === this.btnBack) {
            bus.publish('help.back', null);
          } else if (target === this.btnHelpTopic) {
            bus.publish('help-topic', null);
          }
        }
      }

      topicUpdate(helpTopic) {
        this.updateBanner(helpTopic);
        this.scroll.innerHTML = '';
        let url = `help/${helpTopic}.html`;
        fetch(url).then((response) => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error('fetch failed');
          }
        }).then((html) => {
          this.scroll.innerHTML = html;
          this.scroll.scrollTop = 0;
        }).catch((error) => {
          console.log(error);
        });
      }

      updateBanner(helpTopic) {
        let title = helpTopicList.find(obj => obj.topic === helpTopic).name;
        this.banner.textContent = title;
      }

    }

    class HelpController {

      constructor() {
        this.initialize();
      }

      back() {
        bus.publish('sidebar.change', 'none');
      }

      hide() {
        bus.publish(`${this.helpTask}.hide`, null);
      }

      initialize() {
        this.subscribe();
      }

      read() {
        bus.publish('help.task.change', 'help-read');
      }

      show() {
        bus.publish(`${this.helpTask}.show`, null);
      }

      sidebarUpdate(sidebar) {
        this.sidebar = sidebar;
      }

      subscribe() {
        bus.subscribe('help-read', () => {
          this.read();
        });

        bus.subscribe('help-topic', (helpTopic) => {
          this.topic(helpTopic);
        });
        bus.subscribe('help-topic.select', (helpTopic) => {
          this.topicSelect(helpTopic);
        });

        bus.subscribe('help.back', () => {
          this.back();
        });
        bus.subscribe('help.hide', () => {
          this.hide();
        });
        bus.subscribe('help.show', () => {
          this.show();
        });
        bus.subscribe('help.task.update', (helpTask) => {
          this.taskUpdate(helpTask);
        });

        bus.subscribe('sidebar.update', (sidebar) => {
          this.sidebarUpdate(sidebar);
        });
      }

      taskUpdate(helpTask) {
        if (this.sidebar === 'help') {
          bus.publish(`${this.helpTask}.hide`, null);
          this.helpTask = helpTask;
          bus.publish(`${this.helpTask}.show`, null);
        } else {
          this.helpTask = helpTask;
        }
      }

      topic() {
        bus.publish('help.task.change', 'help-topic');
      }

      topicSelect(helpTopic) {
        bus.publish('help.topic.change', helpTopic);
        bus.publish('help.task.change', 'help-read');
      }

    }

    const APP_FONT = 'font--roboto';

    let loadMsg = document.querySelector('.load-msg');
    let loadScroll = document.querySelector('.load-scroll');

    const progress$2 = (msg) => {
      loadMsg.innerHTML += msg + '<br>';
      loadScroll.scrollTop = loadScroll.scrollHeight;
    };

    (async function() {
      let body = document.body;
      let load = body.querySelector('.load');

      await initializeTome(progress$2);
      await initializeStrong(progress$2);

      let readModel = new ReadModel();
      let readView = new ReadView();
      let readController = new ReadController();

      let navigatorModel = new NavigatorModel();
      let navigatorBookView = new NavigatorBookView();
      let navigatorChapterView = new NavigatorChapterView();
      let navigatorController = new NavigatorController();

      let bookmarkModel = new BookmarkModel();
      let bookmarkListView = new BookmarkListView();
      let bookmarkMoveCopyView = new BookmarkMoveCopyView();
      let bookmarkFolderView = new BookmarkFolderView();
      let bookmarkFolderAddView = new BookmarkFolderAddView();
      let bookmarkFolderDeleteView = new BookmarkFolderDeleteView();
      let bookmarkFolderRenameView = new BookmarkFolderRenameView();
      let bookmarkExportview = new BookmarkExportview();
      let bookmarkImportView = new BookmarkImportView();
      let bookmarkController = new BookmarkController();

      let searchModel = new SearchModel();
      let searchResultView = new SearchResultView();
      let searchFilterView = new SearchFilterView();
      let searchHistoryView = new SearchHistoryView();
      let searchLookupView = new SearchLookupView();
      let searchController = new SearchController();

      let strongModel = new StrongModel();
      let strongDefView = new StrongDefView();
      let strongFilterView = new StrongFilterView();
      let strongHistoryView = new StrongHistoryView();
      let strongLookupView = new StrongLookupView();
      let strongSearchView = new StrongResultView();
      let strongVerseView = new StrongVerseView();
      let strongController = new StrongController();

      let settingModel = new SettingModel();
      let settingView = new SettingView();
      let settingController = new SettingController();

      let helpModel = new HelpModel();
      let helpReadView = new HelpReadView();
      let helpTopicView = new HelpTopicView();
      let helpController = new HelpController();

      load.classList.add('load--hide');
      document.documentElement.classList.add(APP_FONT);

      console.log(`intializeApp():     ${Date.now()}`);
      readController.initializeApp();
      console.log(`ready:              ${Date.now()}`);

    })();

}());
