Object.defineProperty(Function.prototype, "_inherits", {
    value: function(a, b) {
        var c = a.prototype;
        b.constructor = this;
        b.constructor._verId = (new Date).getTime() % 1E10 + "-" + Math.floor(1E4 * Math.random());
        b.getClassName = $className.bind(void 0, this);
        this.prototype = b;
        for (var d = Object.keys(b), e = 0, f = d.length, g; e < f; e++) g = d[e], b[g] instanceof Function && c[g] instanceof Function && (b[g]._super = c[g]);
        this.prototype.__proto__ = c;
        return this
    }
});
Object.defineProperty(Object.prototype, "parent", {
    value: function() {
        var a = arguments.callee.caller;
        if (a._super) return a._super.apply(this, arguments)
    }
});
Object.defineProperty(Object.prototype, "getParentFunction", {
    value: function() {
        var a = arguments.callee.caller;
        if (a._super) return a._super
    }
});
Object.defineProperty(Array.prototype, "binarySearch", {
    value: function(a, b) {
        b = b || function(a, b) {
            "string" !== typeof a && (a = JSON.stringify(a));
            "string" !== typeof b && (b = JSON.stringify(b));
            return a.localeCompare(b)
        };
        for (var c = 0, d = this.length - 1; c <= d;) {
            var e = c + d >>> 1,
                f = b(this[e], a);
            if (0 > f) c = e + 1;
            else if (0 < f) d = e - 1;
            else return e
        }
        return -(c + 1)
    }
});

function $class(a, b) {
    null != b || (b = a, a = Object);
    return function() {
        this.init && this.init.apply(this, arguments)
    }._inherits(a, b)
}

function not_impl(a, b) {
    var c = "",
        d;
    for (d in a)
        if (a[d] === b) {
            c = d;
            break
        }
    c = c || arguments.callee.caller.name || "<?>";
    throw Error("Cannot call abstract function/method " + c + "()");
}
Object.defineProperty(Object.prototype, "not_impl", {
    value: function() {
        not_impl(this, arguments.callee.caller)
    }
});

function $nop() {}

function $className(a) {
    if (!a || !a._verId) return null;
    window._classMap || (_classMap = {});
    var b = _classMap[a._verId];
    if (b) return b;
    for (var c = Object.keys(window), d = 0, e = c.length; d < e; d++) {
        var f = c[d],
            g = window[f];
        if (g === a) {
            b = f;
            break
        }
        if (g instanceof Object && /^[A-Z]\w*$/.test(f)) {
            for (var h = Object.keys(g), k = 0, l = h.length; k < l; k++) {
                var m = h[k];
                if (g[m] === a) {
                    b = f + "." + m;
                    break
                }
            }
            if (b) break
        }
    }
    return _classMap[a._verId] = b || "Unreferenced/Anonymous class"
}
__nonce = (new Date).getTime();

function $nonce() {
    return __nonce++
}
var $hrts = performance.now.bind(performance),
    $arguments2Array = function(a) {
        return 1 == a.length ? [a[0]] : Array.apply(null, a)
    };
Deferred = $class(Object, {
    init: function() {
        this.rejected = this.resolved = 0;
        this.args = [];
        this.dones = [];
        this.fails = []
    },
    _finalize: function(a) {
        if (this._inFinalize) return !1;
        this._inFinalize = !0;
        null != this.filterCallbacks && this.filterCallbacks.call(this);
        for (var b = 0, c = a.length, d; b < c; b++) {
            d = void 0;
            a[b] && (d = a[b].apply(this, this.args));
            if (d instanceof Deferred) {
                this.dones.splice(0, b + 1);
                this.fails.splice(0, b + 1);
                d.dones = d.dones.concat(this.dones);
                d.fails = d.fails.concat(this.fails);
                d.resolved && d.resolve.apply(d, d.args);
                d.rejected && d.reject.apply(d, d.args);
                break
            }
            void 0 !== d && (this.args = Array.isArray(d) ? d : [d])
        }
        this.dones = [];
        this.fails = [];
        this._inFinalize = !1;
        return !0
    },
    resolve: function() {
        if (!this.rejected) return this.resolved = 1, this.args = arguments, this._finalize(this.dones), this
    },
    reject: function() {
        if (!this.resolved) return this.rejected = 2, this.args = arguments, this._finalize(this.fails), this
    },
    filterCallbacks: $nop,
    _addCallback: function(a, b) {
        if (!(a && !this.rejected || b && !this.resolved)) return this;
        for (var c = [this.resolved,
                this.rejected
            ], d = [this.dones, this.fails], e = [a, b], f = 0; 2 > f; f++) {
            var g = (f + 1) % 2,
                h = e[f];
            if (c[f] && h) {
                h = h.apply(this, this.args);
                if (h instanceof Deferred) return h;
                void 0 !== h && (this.args = Array.isArray(h) ? h : [h])
            } else c[g] || d[f].push(h)
        }
        return this
    },
    done: function(a) {
        return this._addCallback(a, null)
    },
    fail: function(a) {
        return this._addCallback(null, a)
    },
    pipe: function(a, b) {
        return this._addCallback(a, b)
    },
    always: function(a) {
        return this._addCallback(a, a)
    },
    state: function() {
        return ["pending", "resolved", "rejected"][this.resolved +
            this.rejected
        ]
    }
});
Deferred.when = function() {
    var a = new Deferred,
        b = arguments.length,
        c = [],
        d = 0;
    if (b)
        for (var e = 0; e < b; e++) {
            var f = arguments[e];
            f.fail(a.reject.bind(a));
            f.done(function(e) {
                return function() {
                    var f = Array.apply(null, arguments);
                    f.deferred = this;
                    c[e] = f;
                    d++;
                    d == b && a.resolve.apply(a, c)
                }
            }(e))
        } else a.resolve();
    return a
};
Deferred.all = function() {
    var a = new Deferred,
        b = arguments.length,
        c = [],
        d = 0;
    if (b)
        for (var e = 0; e < b; e++) arguments[e].always(function(e) {
            return function() {
                var g = Array.apply(null, arguments);
                g.deferred = this;
                c[e] = g;
                d++;
                d === b && a.resolve.apply(a, c)
            }
        }(e));
    else a.resolve();
    return a
};
Topic = $class(Object, {
    _subs: null,
    init: function() {
        this._subs = {}
    },
    subscribe: function(a) {
        var b = $nonce();
        this._subs[b] = a;
        return b
    },
    publish: function(a) {
        var b = $arguments2Array(arguments),
            c = this._subs,
            d = Object.keys(c),
            e = 0;
        this.clearSubscribers();
        for (var f = 0, g = d.length; f < g; f++) {
            var h = d[f],
                k = c[h];
            if (k instanceof Function) var l = k.apply(null, arguments);
            else k[a] ? l = k[a].apply(k, b) : this._subs[h] = k;
            !0 === l && (e++, this._subs[h] = k)
        }
        return e
    },
    clear: function(a) {
        delete this._subs[a]
    },
    clearSubscribers: function() {
        this._subs = {}
    }
});
Service = $class(Object, {
    topic: null,
    init: function() {
        this.topic = new Topic
    },
    subscribe: function() {
        var a = this.topic;
        return a.subscribe.apply(a, arguments)
    },
    publish: function() {
        var a = this.topic;
        a.publish.apply(a, arguments)
    }
});
Log = {
    OFF: 0,
    ERROR: 1,
    WARN: 2,
    DEBUG: 3,
    PREFIX: "[ctv_Log]",
    LEVEL: 0,
    error: function() {
        Log.LEVEL >= Log.ERROR && Log._log("error", Array.apply(null, arguments))
    },
    warn: function() {
        Log.LEVEL >= Log.WARN && Log._log("warn", Array.apply(null, arguments))
    },
    debug: function() {
        Log.LEVEL >= Log.DEBUG && Log._log("debug", Array.apply(null, arguments))
    },
    setLevel: function(a) {
        null != Log[a] && (Log.LEVEL = Log[a])
    },
    profile: function(a) {
        "undefined" != typeof console && console.profile(a)
    },
    profileEnd: function(a) {
        "undefined" != typeof console && console.profileEnd(a)
    },
    _log: function(a, b) {
        APP_NAME && b.unshift("[" + APP_NAME + "]");
        b.unshift(Log.PREFIX);
        "undefined" != typeof console && console[a].apply(console, b)
    }
};
"undefined" != typeof LOG_LEVEL && null != LOG_LEVEL && (Log.LEVEL = Log[LOG_LEVEL] || 0);

function log() {
    Log.debug.apply(Log, arguments)
}

function logWarn() {
    Log.warn.apply(Log, arguments)
}

function logError() {
    Log.error.apply(Log, arguments)
}
var $clog = console.log.bind(console);

function $id(a) {
    return document.getElementById(a)
};
DeferredTimeout = $class(Deferred, {
    init: function(a) {
        this.parent();
        a.deferred && (this.dones = a.deferred.callbacks);
        this.callbacks = this.dones;
        this.timeout = a
    },
    cancel: function() {
        this.timeout.cancel()
    },
    done: function(a) {
        return this.resolved || this.rejected ? this.timeout.deferred.done(a) : this.parent(a)
    }
});
Timeout = $class(Object, {
    init: function(a, b) {
        this.parent();
        this.time = a;
        this.repeat = b;
        this.numberCall = 1;
        this.deferred = new DeferredTimeout(this);
        this.callback_bound = this.callback.bind(this);
        this.setTimeout()
    },
    setTimeout: function() {
        var a = this.time instanceof Function ? this.time(this.numberCall) : this.time;
        this.timer = setTimeout(this.callback_bound, a)
    },
    callback: function() {
        this.deferred.resolve(this.numberCall);
        this.numberCall++;
        if (this.repeat instanceof Function ? this.repeat(this.numberCall) : this.repeat) this.deferred =
            new DeferredTimeout(this), this.setTimeout()
    },
    cancel: function() {
        clearTimeout(this.timer);
        this.deferred.reject(this.numberCall)
    }
});
var $timeout = function(a, b) {
    return (new Timeout(a, b)).deferred
};
LocaleMaps = $class(Object, {
    LOCALE_SRC: {
        DEFAULT: 10,
        DEVICE: 20,
        URL: 30
    },
    COUNTRY_ISO_MAP: {
        AUS: "AU",
        AU: "AUS",
        AUT: "AT",
        AT: "AUT",
        BEL: "BE",
        BE: "BEL",
        BGR: "BG",
        BG: "BGR",
        BRA: "BR",
        BR: "BRA",
        CAN: "CA",
        CA: "CAN",
        CHE: "CH",
        CH: "CHE",
        CZE: "CZ",
        CZ: "CZE",
        DEU: "DE",
        DE: "DEU",
        DNK: "DK",
        DK: "DNK",
        ESP: "ES",
        ES: "ESP",
        FIN: "FI",
        FI: "FIN",
        FRA: "FR",
        FR: "FRA",
        GBR: "GB",
        GB: "GBR",
        GRC: "GR",
        GR: "GRC",
        HRV: "HR",
        HR: "HRV",
        HUN: "HU",
        HU: "HUN",
        IRL: "IE",
        IE: "IRL",
        ITA: "IT",
        IT: "ITA",
        JPN: "JA",
        JA: "JPN",
        LUX: "LU",
        LU: "LUX",
        MEX: "MX",
        MX: "MEX",
        NLD: "NL",
        NL: "NLD",
        NOR: "NO",
        NO: "NOR",
        POL: "PL",
        PL: "POL",
        PRT: "PT",
        PT: "PRT",
        ROU: "RO",
        RO: "ROU",
        RUS: "RU",
        RU: "RUS",
        SRB: "RS",
        RS: "SRB",
        SVK: "SK",
        SK: "SVK",
        SVN: "SI",
        SI: "SVN",
        SWE: "SE",
        SE: "SWE",
        TUR: "TR",
        TR: "TUR",
        UKR: "UA",
        UA: "UKR",
        USA: "US",
        US: "USA",
        ZZZ: "ZZ",
        ZZ: "ZZZ"
    },
    LANG_ISO_MAP: {
        bul: "bg",
        bg: "bul",
        ces: "cs",
        cze: "cs",
        cs: "ces",
        dan: "da",
        da: "dan",
        deu: "de",
        ger: "de",
        de: "deu",
        ell: "el",
        gre: "el",
        el: "ell",
        eng: "en",
        en: "eng",
        fin: "fi",
        fi: "fin",
        fra: "fr",
        fre: "fr",
        fr: "fra",
        hrv: "hr",
        hr: "hrv",
        hun: "hu",
        hu: "hun",
        ita: "it",
        it: "ita",
        jpn: "ja",
        ja: "jpn",
        nld: "nl",
        dut: "nl",
        nl: "nld",
        nor: "no",
        nno: "no",
        nob: "no",
        no: "nor",
        pol: "pl",
        pl: "pol",
        por: "pt",
        pt: "por",
        slk: "sk",
        slo: "sk",
        sk: "slk",
        slv: "sl",
        sl: "slv",
        spa: "es",
        es: "spa",
        srp: "sr",
        sr: "srp",
        swe: "sv",
        sv: "swe",
        ron: "ro",
        rum: "ro",
        ro: "ron",
        rus: "ru",
        ru: "rus",
        tur: "tr",
        tr: "tur",
        ukr: "uk",
        uk: "ukr"
    },
    TXT_FILES_MAP: {}
});
Locale = $class(Object, {
    DEFAULT_BUNDLE_FILE_NAME: "bundle",
    lang: null,
    country: null,
    bundle: {},
    txtFiles: {},
    init: function(a) {
        this.bundleFileName = a || this.DEFAULT_BUNDLE_FILE_NAME
    },
    t: function(a) {
        var b = this.bundle[a];
        if (void 0 === b) return a;
        if (2 > arguments.length) return b;
        for (var c = [], d = 1, e = arguments.length; d < e; d++) c.push(this.t(arguments[d]));
        return this.localeFormat(b, c)
    },
    update: function(a, b) {
        if (this.country != b || this.lang != a) {
            this.country = b;
            this.lang = a;
            this.invalidateTxtCache();
            var c = window.I18N;
            this.bundle =
                c && c[a]
        }
    },
    _resolveTxtFile: function(a) {
        var b = new Deferred,
            c = this;
        $ajax.get({
            url: "i18n/" + a.package + "/" + a.module + "/" + a.lang + "/" + this.localeGetTxtFileName(a),
            dataType: "text"
        }).done(function(a) {
            var e = /^(\s*\r?\n)*\s*#\s*redirect\s+(\S+)\s*\r?\n?/.exec(a);
            e ? c._resolveTxtFile(c.localeParseTxtFileDescriptor(e[2])).always(b.resolve.bind(b)) : b.resolve(a)
        }).status(404, function() {
            a.country ? (a.country = null, c._resolveTxtFile(a).always(b.resolve.bind(b))) : b.reject()
        });
        return b
    },
    _loadTxtFile: function(a) {
        var b = new Deferred,
            c = this.txtFiles,
            d = c[a];
        if (this.txtFiles[a]) return b.resolve(d);
        this._resolveTxtFile(this.localeParseTxtFileDescriptor(a, this.lang)).always(function(d) {
            c[a] = d || "<File " + a + " is empty or does not exist>";
            b.resolve(c[a])
        });
        return b
    },
    getTextFile: function(a, b, c, d) {
        return this.getTextFiles(a, b, [c], d)
    },
    getTextFiles: function(a, b, c, d, e, f, g) {
        if (e == c.length) return d ? f : g.resolve(f);
        e = e || 0;
        var h = c[e],
            k = this,
            l = this.country,
            m = this.lang,
            n = $localeMaps.TXT_FILES_MAP[a + ":" + b + ":" + h],
            p = !1,
            p = Object.keys($localeMaps.TXT_FILES_MAP).length ?
            l && n && n[m] && -1 != n[m].indexOf(l) : l,
            h = a + ":" + b + ":" + (p ? l + "_" + m + ":" : "") + h;
        f = f || "";
        e++;
        if (d) return this.txtFiles[h] ? this.getTextFiles(a, b, c, d, e, f + this.txtFiles[h]) : null;
        g = g || new Deferred;
        this._loadTxtFile(h).done(function(h) {
            return k.getTextFiles(a, b, c, d, e, f + h, g)
        });
        return g
    },
    invalidateTxtCache: function() {
        for (var a = Object.keys(this.txtFiles), b = 0, c = a.length; b < c; b++) {
            var d = a[b],
                e = /([^:]+:)([^:]+:)(([A-Z]{2})?_?([a-z]{2}):)?(.+)$/.exec(d);
            if (e && !e[4]) {
                var f = $localeMaps.TXT_FILES_MAP[e[1] + e[2] + e[6]];
                if (f) {
                    var g =
                        this.txtFiles[d],
                        h = null;
                    if (e[5]) f[e[5]] && -1 != f[e[5]].indexOf(this.country) && (h = this.country), g.country != h && (this.txtFiles[d] = null);
                    else if (f[this.lang] && -1 != f[this.lang].indexOf(this.country) && (h = this.country), g.lang != this.lang || g.country != h) this.txtFiles[d] = null
                }
            }
        }
    },
    localeFormat: function(a, b) {
        var c = a,
            d, e;
        if (b)
            for (d = 0, e = b.length; d < e; d++) c = c.replace(new RegExp("%" + (d + 1), "g"), b[d]);
        return c
    },
    localeGetTxtFileName: function(a) {
        return a.file + "." + (a.country ? a.country + "_" : "") + a.lang + "." + a.ext
    },
    localeParseTxtFileDescriptor: function(a,
        b) {
        var c = /^([A-Za-z_-]+):([A-Za-z_-]+):(([A-Z]{2})?_?([a-z]{2}):)?(\w+)$/.exec(a);
        return c ? {
            package: c[1],
            module: c[2],
            country: c[4],
            lang: b ? b : c[5],
            file: c[6],
            ext: "txt"
        } : {}
    },
    localeSplit: function(a) {
        return (a = /^([A-Z]{2})?[_-]?([a-z]{2})?$/.exec(a)) ? {
            c: a[1],
            l: a[2]
        } : {
            c: null,
            l: null
        }
    },
    localeIsLangSupported: function(a) {
        var b = window.I18N;
        return !(!b || !b.hasOwnProperty(a))
    }
});
Device = $class(Object, {
    isTV: function() {
        return null != window.ApplicationManager
    }
});
GlobalEventsHandler = $class(Object, {
    init: function() {
        this.bufferEvents = new BufferEvents;
        this.delegators = []
    },
    register: function(a) {
        this.delegators.push(a)
    },
    registerFirst: function(a) {
        this.delegators.unshift(a)
    },
    onkeyUp: function(a) {
        a.stopPropagation();
        var b = $activeElement;
        this.dispatchEvent("keyUp", b && b.data || b, b, a);
        3 < this.repeatKeyCount && this.dispatchEvent("keyRepetitionEnd", b && b.data || b, b, a);
        this.repeatKeyCount = 0
    },
    onkeyDown: function(a) {
        a.stopPropagation();
        this.repeatKeyCount++;
        var b = $activeElement,
            c =
            $keysMap.getKeyName(a),
            d = this.bufferEvents;
        !1 === d.onEvent(a) ? a.preventDefault() : (null != c ? (a.preventDefault(), c = b && b.dataset[c] || c) : c = "keyDown", this.dispatchEvent(c, b && b.data || b, b, a), d.dispatch())
    },
    onblur: function(a) {
        for (var b = a.target; b;) {
            var c = b.ctrl;
            if (c && c.blur && !1 === c.blur(a)) break;
            b = b.parentNode
        }
    },
    onfocus: function(a) {
        for (var b = a.target; b;) {
            var c = b.ctrl;
            if (c && c.focus && !1 === c.focus(a)) break;
            b = b.parentNode
        }
    },
    dispatchEvent: function(a, b, c, d) {
        for (; c;) {
            var e = c.ctrl;
            if (e && e[a] && !1 === e[a](b, d)) {
                d && d.preventDefault();
                break
            }
            c = c.parentNode
        }
        if (!c)
            for (c = 0, e = this.delegators.length; c < e; c++) {
                var f = this.delegators[c],
                    g = f[a];
                if (g && !1 === g.call(f, b, d)) {
                    d && d.preventDefault();
                    break
                }
            }
    },
    onboot: function(a) {
        a.stopPropagation();
        a = new Deferred;
        for (var b = 0, c = this.delegators.length; b < c; b++) {
            var d = this.delegators[b];
            d.boot && a.done(d.boot.bind(d))
        }
        a.resolve()
    },
    onstorage: function(a) {
        a.stopPropagation();
        this.dispatchEvent("onStorageChange", {
            key: a.key,
            newValue: a.newValue,
            oldValue: a.oldValue
        }, null, a)
    },
    waitDeferredForNextEvent: function(a) {
        this.bufferEvents.waitDeferred(a)
    }
});
GlobalFocusHandler = $class(Object, {
    NO_ANIMATION: "none",
    SHOW_ANIMATION: "show",
    init: function() {
        this.delegators = [];
        this.persistTimers = [];
        this.memento = {};
        this.lastUserFocusNode = null;
        this._ofDepth = 0
    },
    register: function(a) {
        this.delegators.push(a)
    },
    clear: function() {
        this.hide();
        $activeElement = null
    },
    set: function(a, b) {
        var c = this.getMemento(a) || this.getPersist(a);
        c && (a = this.findNode(a, c) || a);
        a && a !== $activeElement && ($activeElement && $event.onblur({
                target: $activeElement
            }), c = $activeElement, $activeElement = a, this._ofDepth++,
            $event.onfocus({
                target: $activeElement,
                blurTarget: c,
                anim: b
            }), !--this._ofDepth && $activeElement && (this.dispatch("onSetFocus", b, c), this.lastUserFocusNode = $activeElement))
    },
    show: function(a) {
        this.dispatch("onShowFocus", a)
    },
    hide: function(a, b) {
        this.dispatch("onHideFocus", a)
    },
    dispatch: function(a, b, c, d) {
        for (var e = 0, f = this.delegators.length; e < f; e++) {
            var g = this.delegators[e],
                h = g[a];
            if (h && !1 === h.call(g, $activeElement, b, c, d)) break
        }
    },
    setPersist: function(a, b) {
        if (a) {
            var c = $activeElement.id,
                d = a.id;
            d && c && (b && window.$storage ?
                $storage.set("lastFocus-" + d, a._lastFocusId) : (a._lastFocusId = c, this.persistTimers[d] && this.persistTimers[d].cancel(), this.persistTimers[d] = $timeout(2E3).done(function() {
                    a._lastFocusId && window.$storage && $storage.set("lastFocus-" + d, a._lastFocusId)
                })))
        }
    },
    getPersist: function(a) {
        if (a && window.$storage) return $storage.get("lastFocus-" + a.id)
    },
    setMemento: function(a, b) {
        if (a) {
            var c = parseInt(!0 === b ? 0 : b);
            if (isNaN(c) || 0 >= c) c = Infinity;
            c = {
                id: $activeElement.id,
                when: Date.now() + 1E3 * c
            };
            return this.memento[a.id] = c
        }
    },
    getMemento: function(a) {
        if (a) return (a =
            this.memento[a.id]) && Date.now() < a.when ? a.id : null
    },
    findNode: function(a, b) {
        if (b && a.id != b) {
            var c = $id(b);
            if (a === c || a.contains(c)) return c
        }
        return null
    }
});
TemplateEngine = $class(Object, {
    TEMPLATE_ID_PREFIX: "tmpl_",
    init: function() {
        this.play = !1;
        this.INCLUDE_RE = /\{\{>([^=\}\s\(]+)\s?(\((([^\(\)]+(\(.*?\))?)*)\))?\s?(([^\{\}]*(\{\{.*?\}\})?)*)\s*\}\}/g;
        this.ROOT_RE = /^\s*<div\s*/g;
        this.VARIABLE_RE = /[^\\]\{\{(#?[\.\w]*)(\((#?[\.\w]*,?)*\))?\}\}/g;
        this.REMOVE_ESCAPE_RE = /\\\{\{/g
    },
    load: function(a, b) {
        return this.removeEscapes(this.processTemplate(a, b))
    },
    loadFromScript: function(a, b) {
        return this.removeEscapes(this.processTemplateNode(a, b))
    },
    removeEscapes: function(a) {
        this.REMOVE_ESCAPE_RE.lastIndex =
            0;
        return a.replace(this.REMOVE_ESCAPE_RE, "{{")
    },
    processTemplate: function(a, b) {
        var c = $id(this.TEMPLATE_ID_PREFIX + a);
        return c ? this.processTemplateNode(c, b) : ""
    },
    processTemplateNode: function(a, b) {
        return this.compile(this.processIncludes(a.textContent, b), b)
    },
    processIncludes: function(a, b) {
        var c = this.INCLUDE_RE.lastIndex;
        this.INCLUDE_RE.lastIndex = 0;
        var d = this.INCLUDE_RE.exec(a);
        if (!d) return this.INCLUDE_RE.lastIndex = c, a;
        for (var e = a; d;) {
            var f = d[0],
                g = d[1],
                h = d[3],
                d = d[6];
            if (h) try {
                h = JSON.parse(this.compile(h,
                    b, !0)), b && (h.__proto__ = b)
            } catch (k) {
                logError("Error while parsing parameters for template " + g, h), h = void 0
            }
            g = this.processTemplate(g, h || b);
            d && (this.ROOT_RE.lastIndex = 0, g = g.replace(this.ROOT_RE, "<div " + d + " "));
            e = e.replace(f, g);
            d = this.INCLUDE_RE.exec(a)
        }
        this.INCLUDE_RE.lastIndex = c;
        return this.processIncludes(e)
    },
    compile: function(a, b, c) {
        c = "";
        var d, e = 0,
            f = this.VARIABLE_RE;
        for (f.lastIndex = 0; d = f.exec(a);) {
            c += a.substring(e, d.index + 1);
            var e = f.lastIndex,
                g = d[1];
            d = d[2] || "";
            d = d.substring(1, d.length - 1);
            if ("" == g) c +=
                b;
            else if ("#" == g && !d) c += $t(b);
            else if ("#" == g[0]) {
                g = (g = g.substr(1)) ? [g] : [];
                if (d)
                    if (-1 != d.indexOf(",")) {
                        d = d.split(",");
                        for (var h = 0, k = d.length; h < k; h++) d[h] = this._resolveKey(b, d[h]);
                        g = g.concat(d)
                    } else g.push(this._resolveKey(b, d));
                g = $locale.t.apply($locale, g);
                c += g
            } else if (b) {
                g = this._resolveKey(b, g);
                if (g instanceof Function) {
                    if (d)
                        if (-1 != d.indexOf(","))
                            for (d = d.split(","), h = 0, k = d.length; h < k; h++) d[h] = this._resolveKey(b, d[h]);
                        else d = [this._resolveKey(b, d)];
                    else d = [];
                    g = g.apply(null, d)
                }
                c += g
            }
        }
        return e ? c + a.substring(e) :
            a
    },
    _resolveKey: function(a, b) {
        if ("#" == b[0]) return $t(b.substr(1));
        var c;
        (c = -1 != b.indexOf(".") ? b.split(".").reduce(function(a, b) {
            return a && a[b]
        }, a) : a[b]) && "#" == c[0] && (c = $t(c.substr(1)));
        return c
    },
    clearNode: function(a) {
        for (; a.firstChild;) a.removeChild(a.firstChild)
    },
    setIntoNode: function(a, b) {
        a.innerHTML = b;
        $ctrlFactory.loadControllers(a)
    },
    appendToNode: function(a, b) {
        var c = document.createElement("div");
        c.innerHTML = b;
        a.appendChild(c);
        $ctrlFactory.loadControllers(c);
        return c
    }
});
BufferEvents = $class(Object, {
    init: function() {
        this.events = [];
        this.deferreds = [];
        this.count = {};
        this.firstEvent = null
    },
    onEvent: function(a) {
        if (this.deferreds.length) return this.dispatch(), !1;
        a.keyName = $keysMap.getKeyName(a);
        if (this.firstEvent) {
            if (2 == this.count[a.keyName]) return !1;
            this.count[a.keyName] = 1 == this.count[a.keyName] ? 2 : 1;
            this.events.push(a);
            return !1
        }
        this.firstEvent = a
    },
    dispatch: function() {
        if (this.deferreds.length) {
            var a = this.deferreds;
            this.deferreds = [];
            Deferred.all.apply(Deferred, a).always(this.dispatch.bind(this))
        } else this.firstEvent =
            null, this.events.length && (a = this.events.shift(), this.count[a.keyName]--, a = {
                keyCode: a.keyCode,
                shiftKey: a.shiftKey,
                ctrlKey: a.ctrlKey,
                stopPropagation: $nop,
                preventDefault: $nop
            }, $timeout(0).done($event.onkeyDown.bind($event, a)))
    },
    waitDeferred: function(a) {
        this.deferreds.push(a)
    }
});
KeysMap = $class(Object, {
    RED: 1,
    GREEN: 2,
    YELLOW: 4,
    BLUE: 8,
    NAVIGATION: 16,
    VCR: 32,
    SCROLL: 64,
    INFO: 128,
    NUMERIC: 256,
    ALPHA: 512,
    OTHER: 1024,
    ALL_INPUT: 65536,
    TV: {
        ok: 13,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        back: 461,
        home: 36,
        guide: 458,
        exit: 528,
        personal: 1064,
        search: 1E3,
        info: 457,
        pageUp: 33,
        pageDown: 34,
        volumeDown: 448,
        volumeUp: 447,
        volumeMute: 449,
        programDown: 428,
        programUp: 427,
        num0: 48,
        num1: 49,
        num2: 50,
        num3: 51,
        num4: 52,
        num5: 53,
        num6: 54,
        num7: 55,
        num8: 56,
        num9: 57,
        hyphen: 539,
        play: 415,
        pause: 19,
        stop: 413,
        ffwd: 417,
        rew: 412,
        red: 403,
        green: 404,
        yellow: 405,
        blue: 406
    },
    EMULATOR_SHIFT: 65536,
    EMULATOR_CTRL: 131072,
    EMULATOR_META: 262144,
    EMULATOR_ALT: 524288,
    VISUAL_KEY: 1048576,
    EMULATOR: {
        ok: 13,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        back: 27,
        pageUp: 33,
        pageDown: 34,
        num0: 1048624,
        num1: 1048625,
        num2: 1048626,
        num3: 1048627,
        num4: 1048628,
        num5: 1048629,
        num6: 1048630,
        num7: 1048631,
        num8: 1048632,
        num9: 1048633,
        home: 1572936,
        guide: 1572935,
        exit: 1572952,
        personal: 1572946,
        search: 1572947,
        pageLeft: 36,
        pageRight: 35,
        hyphen: 1048766,
        volumeDown: 1572950,
        volumeUp: 1638486,
        info: 1572937,
        volumeMute: 1572941,
        quick: 1572945,
        programDown: 1572932,
        programUp: 1572949,
        startRecord: 1638482,
        play: 1572944,
        pause: 1638480,
        stop: 1638483,
        ffwd: 1572934,
        rew: 1638470,
        red: 112,
        green: 113,
        yellow: 114,
        blue: 115
    },
    _crtMap: null,
    init: function() {
        for (var a = this._crtMap = $device.isTV() ? this.TV : this.EMULATOR, b = Object.keys(a), c = 0, d = b.length; c < d; c++) {
            var e = b[c],
                f = a[e];
            a[String(f)] = e;
            this[e] = f
        }
        this.getKeyName = this.getDefaultKeyName
    },
    getDefaultKeyName: function(a) {
        var b = a.keyCode,
            c = a.key || a.keyIdentifier,
            d = !1;
        c && /U\+\w{4}/i.test(c) && (b = /U\+(\w{4})/i.exec(c),
            b = parseInt(b[1], 16), 48 <= b && 57 >= b && (d = !0), b |= 32 <= b ? this.VISUAL_KEY : 0);
        a.shiftKey && !d && (b |= this.EMULATOR_SHIFT);
        a.ctrlKey && (b |= this.EMULATOR_CTRL);
        a.metaKey && (b |= this.EMULATOR_META);
        a.altKey && (b |= this.EMULATOR_ALT);
        return this._crtMap[b]
    },
    getKeyNameSwapOkBack: function(a) {
        a = this.getDefaultKeyName(a);
        return "back" == a ? "ok" : "ok" == a ? "back" : a
    }
});
CtrlFactory = $class(Object, {
    loadControllers: function(a, b) {
        var c = a.querySelectorAll("[data-ctrl]");
        b && (b.controllers = b.controllers || {});
        for (var d = 0, e = c.length; d <= e; d++) {
            var f = d != e ? c[d] : a,
                g = f.dataset.ctrl,
                h = null,
                k = null;
            if (g) {
                b && (h = f.id ? b.controllers[f.id] : b.controllers[g]);
                if (null != h) h.node !== f && (h.node = f, f.ctrl = h), k = h.refresh || h.load;
                else {
                    h = -1 != g.indexOf(".") ? g.split(".").reduce(function(a, b) {
                        return a && a[b]
                    }, window) : window[g];
                    if (!h) continue;
                    h = f.ctrl = new h;
                    b && (f.id ? b.controllers[f.id] = h : b.controllers[g] =
                        h);
                    h.node = f;
                    k = h.load
                }
                if (window.DEBUG_MODE) k && k.call(h);
                else try {
                    k && k.call(h)
                } catch (l) {
                    logError(l.message)
                }
            }
        }
    }
});

function $t() {
    return $locale.t.apply($locale, arguments)
}
var $activeElement = null,
    $ctrlFactory = new CtrlFactory,
    $device = new Device,
    $api = {},
    $event = new GlobalEventsHandler,
    $focus = new GlobalFocusHandler,
    $template = new TemplateEngine,
    $keysMap = new KeysMap;
$services = {};
$localeMaps = new LocaleMaps;
$locale = new Locale;
document.addEventListener("keydown", $event.onkeyDown.bind($event), !0);
document.addEventListener("keyup", $event.onkeyUp.bind($event), !0);
window.addEventListener("load", $event.onboot.bind($event), !0);
window.addEventListener("storage", $event.onstorage.bind($event), !0);
window.$timetrace = window.$timetrace || {
    time: $nop,
    timeEnd: $nop,
    enter: $nop,
    leave: $nop
};
LauncherApi = $class(Object, {
    init: function() {
        this.origin = window.location.origin;
        this.contextPath = location.pathname.split("/")[1].replace(APP_NAME, "");
        var a = /locale=[A-Z]{2}_[a-z]{2}/.exec(location.search);
        this.locale = a && a[0] || null
    },
    loadApp: function(a, b) {
        var c = $appManager.availableWindows[a],
            d = this.getAppURL(a, b),
            e = $appManager.getWindowByName(a);
        e && $appManager.destroyWindow(e);
        e = $appManager.createWindow(a, c);
        e.loadUrl(d);
        e.hide();
        return e
    },
    getAppURL: function(a, b) {
        function c(a, b) {
            return b ? (a ? a + "&" : "?") +
                b : a
        }
        var d;
        d = c("", this.locale);
        d = c(d, -1 != location.search.indexOf("video") ? "video" : null);
        return this.origin + "/" + (b ? b(this.contextPath) : this.contextPath) + a + "/index.html" + (d || "")
    }
});
AbstractAppManager = $class(Object, {
    availableWindows: {
        overlay: 90,
        acm: 89,
        fti: 88,
        hbbtv: 85,
        csp3: 83,
        csp2: 82,
        csp1: 81,
        epg: 60,
        mgr: 50,
        portal: 30,
        tv: 20
    },
    filter: function(a) {
        for (var b = this.getWindows(), c = null, d = 0, e = b.length; d < e; d++) {
            var f = b[d];
            if (this.checkEvent(f, a)) {
                if (f.active) return f;
                if (null == c || c.eventDispatchPriority < f.eventDispatchPriority) c = f
            }
        }
        return c
    },
    getWindows: function() {
        return []
    },
    checkEvent: function(a, b) {
        return !1
    }
});
AppManagerImpl = $class(AbstractAppManager, {
    init: function() {
        window.parent && window.parent.$appManager ? (this.salt = window.parent.$appManager, this.appName = APP_NAME) : (this.salt = window.ApplicationManager, this.appName = "overlay" == APP_NAME ? "UI" : APP_NAME);
        this.salt ? (this.getWindows = this.salt.getWindows.bind(this.salt), this.getWindowByName = this.salt.getWindowByName.bind(this.salt), this.getWindow = this.salt.getWindowByName.bind(this.salt, this.appName), this.createWindow = this.salt.createWindow.bind(this.salt), this.destroyWindow =
            this.salt.destroyWindow.bind(this.salt), this.disableHbbTV = this.salt.disableHbbTV.bind(this.salt), this.enableHbbTV = this.salt.enableHbbTV.bind(this.salt), this.getWindow().addEventListener("message", function(a) {
                a = JSON.parse(a);
                $event.dispatchEvent(a.name, a.parameters)
            })) : this.getWindows = this.getWindowByName = this.getWindow = this.createWindow = this.destroyWindow = this.disableHbbTV = this.enableHbbTV = $nop
    },
    checkEvent: function(a, b) {
        return a.eventListeners[b.name]
    },
    isVisible: function() {
        return this.salt ? this.getWindow().visible :
            !0
    },
    setKeySet: function(a, b) {
        this.salt && this.getWindow().keySet.setValue(a, b)
    },
    addKeySet: function(a, b) {
        if (this.salt) {
            var c = this.getWindow().keySet;
            c.setValue(c.value | a, (c.otherKeys || []).concat(b))
        }
    },
    toggleWindow: function() {
        if (this.salt) {
            if (this.getWindow().active) {
                this.hideWindow();
                var a = this.getWindowByName("tv");
                a.show();
                a.activate()
            } else this.showWindow(), this.hideOtherWindows();
            this.backAppName = null
        }
    },
    showWindow: function() {
        if (this.salt) {
            var a = this.getWindow();
            a.show();
            a.activate()
        }
    },
    hideWindow: function() {
        if (this.salt) {
            var a =
                this.getWindow();
            a.deactivate();
            a.hide()
        }
    },
    killWindow: function() {
        if (this.salt) {
            var a = this.getWindow();
            this.destroyWindow(a)
        }
    },
    hideAll: function() {
        if (this.salt)
            for (var a = this.getWindows(), b = 0, c = a.length; b < c; b++) a[b].hide()
    },
    hideOtherWindows: function() {
        if (this.salt)
            for (var a = this.getWindows(), b = 0, c = a.length; b < c; b++) {
                var d = a[b],
                    e = d.name;
                e != this.appName && "UI" != e && "overlay" != e && d.hide()
            }
    },
    listen: function(a) {
        if (!this.salt) return a;
        var b = this;
        return function(c) {
            var d = b.filter(c);
            d && d.name === this.appName &&
                a.apply(this, arguments)
        }
    },
    postMessage: function(a, b, c) {
        this.salt && (b = {
            name: b,
            parameters: c
        }, c = this.getWindow(), a = this.salt.getWindowByName(a), c.postMessage(JSON.stringify(b), a))
    },
    requestOpenApp: function(a, b) {
        this.salt && (b = b || {}, b.backAppName = this.appName, this.postMessage(a, "notifyOpenApp", b))
    },
    requestCloseApp: function(a) {
        this.salt && (this.backAppName ? this.postMessage(this.backAppName, "notifyCloseApp", a) : this.close(), this.backAppName = null)
    },
    open: function(a) {
        this.salt && (this.showWindow(), this.hideOtherWindows(),
            a = a || {}, this.backAppName = a.backAppName)
    },
    close: function() {
        if (this.salt) {
            this.hideWindow();
            var a = this.getWindowByName("tv");
            a.show();
            a.activate()
        }
    },
    sendKey: function(a, b) {
        var c = $appManager.getWindow(),
            d = $appManager.getWindowByName(a);
        c.postMessage(JSON.stringify({
            name: b
        }), d)
    }
});
var $appManager = new AppManagerImpl;
$api.launcher = new LauncherApi;
(function() {
    function a(a, c, d) {
        if ("undefined" === typeof d || 0 === +d) return Math[a](c);
        c = +c;
        d = +d;
        if (isNaN(c) || "number" !== typeof d || 0 !== d % 1) return NaN;
        c = c.toString().split("e");
        c = Math[a](+(c[0] + "e" + (c[1] ? +c[1] - d : -d)));
        c = c.toString().split("e");
        return +(c[0] + "e" + (c[1] ? +c[1] + d : d))
    }
    Math.round10 = function(b, c) {
        return a("round", b, c)
    };
    Math.floor10 = function(b, c) {
        return a("floor", b, c)
    };
    Math.ceil10 = function(b, c) {
        return a("ceil", b, c)
    }
})();

function $node(a) {
    var b = a;
    "string" === typeof a && (b = document.createElement("div"), b.innerHTML = a, b = b.firstElementChild);
    return b
}
Object.defineProperty(Element.prototype, "isAttached", {
    value: function() {
        return this.id ? this === $id(this.id) : this.parentNode ? this.parentNode.isAttached() : !1
    }
});
(function() {
    function a(a) {
        return a.replace(/[^A-Za-z0-9\[\] ]/g, function(a) {
            return c[a] || a
        })
    }
    for (var b = [{
            base: "A",
            letters: "A\u24b6\uff21\u00c0\u00c1\u00c2\u1ea6\u1ea4\u1eaa\u1ea8\u00c3\u0100\u0102\u1eb0\u1eae\u1eb4\u1eb2\u0226\u01e0\u00c4\u01de\u1ea2\u00c5\u01fa\u01cd\u0200\u0202\u1ea0\u1eac\u1eb6\u1e00\u0104\u023a\u2c6f"
        }, {
            base: "AA",
            letters: "\ua732"
        }, {
            base: "AE",
            letters: "\u00c6\u01fc\u01e2"
        }, {
            base: "AO",
            letters: "\ua734"
        }, {
            base: "AU",
            letters: "\ua736"
        }, {
            base: "AV",
            letters: "\ua738\ua73a"
        }, {
            base: "AY",
            letters: "\ua73c"
        }, {
            base: "B",
            letters: "B\u24b7\uff22\u1e02\u1e04\u1e06\u0243\u0182\u0181"
        }, {
            base: "C",
            letters: "C\u24b8\uff23\u0106\u0108\u010a\u010c\u00c7\u1e08\u0187\u023b\ua73e"
        }, {
            base: "D",
            letters: "D\u24b9\uff24\u1e0a\u010e\u1e0c\u1e10\u1e12\u1e0e\u0110\u018b\u018a\u0189\ua779"
        }, {
            base: "DZ",
            letters: "\u01f1\u01c4"
        }, {
            base: "Dz",
            letters: "\u01f2\u01c5"
        }, {
            base: "E",
            letters: "E\u24ba\uff25\u00c8\u00c9\u00ca\u1ec0\u1ebe\u1ec4\u1ec2\u1ebc\u0112\u1e14\u1e16\u0114\u0116\u00cb\u1eba\u011a\u0204\u0206\u1eb8\u1ec6\u0228\u1e1c\u0118\u1e18\u1e1a\u0190\u018e"
        }, {
            base: "F",
            letters: "F\u24bb\uff26\u1e1e\u0191\ua77b"
        }, {
            base: "G",
            letters: "G\u24bc\uff27\u01f4\u011c\u1e20\u011e\u0120\u01e6\u0122\u01e4\u0193\ua7a0\ua77d\ua77e"
        }, {
            base: "H",
            letters: "H\u24bd\uff28\u0124\u1e22\u1e26\u021e\u1e24\u1e28\u1e2a\u0126\u2c67\u2c75\ua78d"
        }, {
            base: "I",
            letters: "I\u24be\uff29\u00cc\u00cd\u00ce\u0128\u012a\u012c\u0130\u00cf\u1e2e\u1ec8\u01cf\u0208\u020a\u1eca\u012e\u1e2c\u0197"
        }, {
            base: "J",
            letters: "J\u24bf\uff2a\u0134\u0248"
        }, {
            base: "K",
            letters: "K\u24c0\uff2b\u1e30\u01e8\u1e32\u0136\u1e34\u0198\u2c69\ua740\ua742\ua744\ua7a2"
        }, {
            base: "L",
            letters: "L\u24c1\uff2c\u013f\u0139\u013d\u1e36\u1e38\u013b\u1e3c\u1e3a\u0141\u023d\u2c62\u2c60\ua748\ua746\ua780"
        }, {
            base: "LJ",
            letters: "\u01c7"
        }, {
            base: "Lj",
            letters: "\u01c8"
        }, {
            base: "M",
            letters: "M\u24c2\uff2d\u1e3e\u1e40\u1e42\u2c6e\u019c"
        }, {
            base: "N",
            letters: "N\u24c3\uff2e\u01f8\u0143\u00d1\u1e44\u0147\u1e46\u0145\u1e4a\u1e48\u0220\u019d\ua790\ua7a4"
        }, {
            base: "NJ",
            letters: "\u01ca"
        }, {
            base: "Nj",
            letters: "\u01cb"
        }, {
            base: "O",
            letters: "O\u24c4\uff2f\u00d2\u00d3\u00d4\u1ed2\u1ed0\u1ed6\u1ed4\u00d5\u1e4c\u022c\u1e4e\u014c\u1e50\u1e52\u014e\u022e\u0230\u00d6\u022a\u1ece\u0150\u01d1\u020c\u020e\u01a0\u1edc\u1eda\u1ee0\u1ede\u1ee2\u1ecc\u1ed8\u01ea\u01ec\u00d8\u01fe\u0186\u019f\ua74a\ua74c"
        }, {
            base: "OI",
            letters: "\u01a2"
        }, {
            base: "OO",
            letters: "\ua74e"
        }, {
            base: "OU",
            letters: "\u0222"
        }, {
            base: "P",
            letters: "P\u24c5\uff30\u1e54\u1e56\u01a4\u2c63\ua750\ua752\ua754"
        }, {
            base: "Q",
            letters: "Q\u24c6\uff31\ua756\ua758\u024a"
        }, {
            base: "R",
            letters: "R\u24c7\uff32\u0154\u1e58\u0158\u0210\u0212\u1e5a\u1e5c\u0156\u1e5e\u024c\u2c64\ua75a\ua7a6\ua782"
        }, {
            base: "S",
            letters: "S\u24c8\uff33\u1e9e\u015a\u1e64\u015c\u1e60\u0160\u1e66\u1e62\u1e68\u0218\u015e\u2c7e\ua7a8\ua784"
        }, {
            base: "T",
            letters: "T\u24c9\uff34\u1e6a\u0164\u1e6c\u021a\u0162\u1e70\u1e6e\u0166\u01ac\u01ae\u023e\ua786"
        }, {
            base: "TZ",
            letters: "\ua728"
        }, {
            base: "U",
            letters: "U\u24ca\uff35\u00d9\u00da\u00db\u0168\u1e78\u016a\u1e7a\u016c\u00dc\u01db\u01d7\u01d5\u01d9\u1ee6\u016e\u0170\u01d3\u0214\u0216\u01af\u1eea\u1ee8\u1eee\u1eec\u1ef0\u1ee4\u1e72\u0172\u1e76\u1e74\u0244"
        }, {
            base: "V",
            letters: "V\u24cb\uff36\u1e7c\u1e7e\u01b2\ua75e\u0245"
        }, {
            base: "VY",
            letters: "\ua760"
        }, {
            base: "W",
            letters: "W\u24cc\uff37\u1e80\u1e82\u0174\u1e86\u1e84\u1e88\u2c72"
        }, {
            base: "X",
            letters: "X\u24cd\uff38\u1e8a\u1e8c"
        }, {
            base: "Y",
            letters: "Y\u24ce\uff39\u1ef2\u00dd\u0176\u1ef8\u0232\u1e8e\u0178\u1ef6\u1ef4\u01b3\u024e\u1efe"
        }, {
            base: "Z",
            letters: "Z\u24cf\uff3a\u0179\u1e90\u017b\u017d\u1e92\u1e94\u01b5\u0224\u2c7f\u2c6b\ua762"
        }, {
            base: "a",
            letters: "a\u24d0\uff41\u1e9a\u00e0\u00e1\u00e2\u1ea7\u1ea5\u1eab\u1ea9\u00e3\u0101\u0103\u1eb1\u1eaf\u1eb5\u1eb3\u0227\u01e1\u00e4\u01df\u1ea3\u00e5\u01fb\u01ce\u0201\u0203\u1ea1\u1ead\u1eb7\u1e01\u0105\u2c65\u0250"
        }, {
            base: "aa",
            letters: "\ua733"
        }, {
            base: "ae",
            letters: "\u00e6\u01fd\u01e3"
        }, {
            base: "ao",
            letters: "\ua735"
        }, {
            base: "au",
            letters: "\ua737"
        }, {
            base: "av",
            letters: "\ua739\ua73b"
        }, {
            base: "ay",
            letters: "\ua73d"
        }, {
            base: "b",
            letters: "b\u24d1\uff42\u1e03\u1e05\u1e07\u0180\u0183\u0253"
        }, {
            base: "c",
            letters: "c\u24d2\uff43\u0107\u0109\u010b\u010d\u00e7\u1e09\u0188\u023c\ua73f\u2184"
        }, {
            base: "d",
            letters: "d\u24d3\uff44\u1e0b\u010f\u1e0d\u1e11\u1e13\u1e0f\u0111\u018c\u0256\u0257\ua77a"
        }, {
            base: "dz",
            letters: "\u01f3\u01c6"
        }, {
            base: "e",
            letters: "e\u24d4\uff45\u00e8\u00e9\u00ea\u1ec1\u1ebf\u1ec5\u1ec3\u1ebd\u0113\u1e15\u1e17\u0115\u0117\u00eb\u1ebb\u011b\u0205\u0207\u1eb9\u1ec7\u0229\u1e1d\u0119\u1e19\u1e1b\u0247\u025b\u01dd"
        }, {
            base: "f",
            letters: "f\u24d5\uff46\u1e1f\u0192\ua77c"
        }, {
            base: "g",
            letters: "g\u24d6\uff47\u01f5\u011d\u1e21\u011f\u0121\u01e7\u0123\u01e5\u0260\ua7a1\u1d79\ua77f"
        }, {
            base: "h",
            letters: "h\u24d7\uff48\u0125\u1e23\u1e27\u021f\u1e25\u1e29\u1e2b\u1e96\u0127\u2c68\u2c76\u0265"
        }, {
            base: "hv",
            letters: "\u0195"
        }, {
            base: "i",
            letters: "i\u24d8\uff49\u00ec\u00ed\u00ee\u0129\u012b\u012d\u00ef\u1e2f\u1ec9\u01d0\u0209\u020b\u1ecb\u012f\u1e2d\u0268\u0131"
        }, {
            base: "j",
            letters: "j\u24d9\uff4a\u0135\u01f0\u0249"
        }, {
            base: "k",
            letters: "k\u24da\uff4b\u1e31\u01e9\u1e33\u0137\u1e35\u0199\u2c6a\ua741\ua743\ua745\ua7a3"
        }, {
            base: "l",
            letters: "l\u24db\uff4c\u0140\u013a\u013e\u1e37\u1e39\u013c\u1e3d\u1e3b\u017f\u0142\u019a\u026b\u2c61\ua749\ua781\ua747"
        }, {
            base: "lj",
            letters: "\u01c9"
        }, {
            base: "m",
            letters: "m\u24dc\uff4d\u1e3f\u1e41\u1e43\u0271\u026f"
        }, {
            base: "n",
            letters: "n\u24dd\uff4e\u01f9\u0144\u00f1\u1e45\u0148\u1e47\u0146\u1e4b\u1e49\u019e\u0272\u0149\ua791\ua7a5"
        }, {
            base: "nj",
            letters: "\u01cc"
        }, {
            base: "o",
            letters: "o\u24de\uff4f\u00f2\u00f3\u00f4\u1ed3\u1ed1\u1ed7\u1ed5\u00f5\u1e4d\u022d\u1e4f\u014d\u1e51\u1e53\u014f\u022f\u0231\u00f6\u022b\u1ecf\u0151\u01d2\u020d\u020f\u01a1\u1edd\u1edb\u1ee1\u1edf\u1ee3\u1ecd\u1ed9\u01eb\u01ed\u00f8\u01ff\u0254\ua74b\ua74d\u0275"
        }, {
            base: "oi",
            letters: "\u01a3"
        }, {
            base: "ou",
            letters: "\u0223"
        }, {
            base: "oo",
            letters: "\ua74f"
        }, {
            base: "p",
            letters: "p\u24df\uff50\u1e55\u1e57\u01a5\u1d7d\ua751\ua753\ua755"
        }, {
            base: "q",
            letters: "q\u24e0\uff51\u024b\ua757\ua759"
        }, {
            base: "r",
            letters: "r\u24e1\uff52\u0155\u1e59\u0159\u0211\u0213\u1e5b\u1e5d\u0157\u1e5f\u024d\u027d\ua75b\ua7a7\ua783"
        }, {
            base: "s",
            letters: "s\u24e2\uff53\u00df\u015b\u1e65\u015d\u1e61\u0161\u1e67\u1e63\u1e69\u0219\u015f\u023f\ua7a9\ua785\u1e9b"
        }, {
            base: "t",
            letters: "t\u24e3\uff54\u1e6b\u1e97\u0165\u1e6d\u021b\u0163\u1e71\u1e6f\u0167\u01ad\u0288\u2c66\ua787"
        }, {
            base: "tz",
            letters: "\ua729"
        }, {
            base: "u",
            letters: "u\u24e4\uff55\u00f9\u00fa\u00fb\u0169\u1e79\u016b\u1e7b\u016d\u00fc\u01dc\u01d8\u01d6\u01da\u1ee7\u016f\u0171\u01d4\u0215\u0217\u01b0\u1eeb\u1ee9\u1eef\u1eed\u1ef1\u1ee5\u1e73\u0173\u1e77\u1e75\u0289"
        }, {
            base: "v",
            letters: "v\u24e5\uff56\u1e7d\u1e7f\u028b\ua75f\u028c"
        }, {
            base: "vy",
            letters: "\ua761"
        }, {
            base: "w",
            letters: "w\u24e6\uff57\u1e81\u1e83\u0175\u1e87\u1e85\u1e98\u1e89\u2c73"
        }, {
            base: "x",
            letters: "x\u24e7\uff58\u1e8b\u1e8d"
        }, {
            base: "y",
            letters: "y\u24e8\uff59\u1ef3\u00fd\u0177\u1ef9\u0233\u1e8f\u00ff\u1ef7\u1e99\u1ef5\u01b4\u024f\u1eff"
        }, {
            base: "z",
            letters: "z\u24e9\uff5a\u017a\u1e91\u017c\u017e\u1e93\u1e95\u01b6\u0225\u0240\u2c6c\ua763"
        }], c = {}, d = 0, e = b.length; d < e; d++)
        for (var f = b[d].letters.split(""), g = 0, h = f.length; g < h; g++) c[f[g]] = b[d].base;
    Object.defineProperty(String.prototype, "toASCII", {
        enumerable: !0,
        value: function() {
            return a(this)
        }
    });
    Object.defineProperty(String.prototype, "escapeRegExp", {
        enumerable: !0,
        value: function() {
            return this.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1")
        }
    })
})();
CollectionUtils = $class(Object, {
    getValues: function(a) {
        if (a.length) {
            for (var b = [], c = 0, d = a.length; c < d; c++) b.push(a.item(c));
            return b
        }
    }
});
Comparator = $class(Object, {
    _equals: {},
    init: function() {
        this._equals.array = this.compareArrays;
        this._equals.object = this.compareObjects;
        this._equals.date = function(a, b) {
            return a.getTime() === b.getTime()
        };
        this._equals.regexp = function(a, b) {
            return a.toString() === b.toString()
        }
    },
    _getClass: function(a) {
        return Object.prototype.toString.call(a).match(/^\[object\s(.*)\]$/)[1]
    },
    whatis: function(a) {
        if (void 0 === a) return "undefined";
        if (null === a) return "null";
        var b = typeof a;
        "object" === b && (b = this._getClass(a).toLowerCase());
        return "number" === b ? 0 < a.toString().indexOf(".") ? "float" : "integer" : b
    },
    compareObjects: function(a, b, c, d) {
        if (a === b) return !0;
        for (var e in a)
            if (b.hasOwnProperty(e)) {
                if (!this.equals(a[e], b[e], c, d)) return !1
            } else return !1;
        for (e in b)
            if (!a.hasOwnProperty(e)) return !1;
        return !0
    },
    compareArrays: function(a, b, c, d) {
        if (a === b) return !0;
        if (a.length !== b.length) return !1;
        for (var e = 0; e < a.length; e++)
            if (!this.equals(a[e], b[e], c, d)) return !1;
        return !0
    },
    equals: function(a, b, c, d) {
        var e = !0;
        if (a !== b) {
            c = c || [];
            d = d || [];
            var e = this.whatis(a),
                f = this.whatis(b);
            e === f ? this._equals.hasOwnProperty(e) ? (f = c.indexOf(a), -1 != f && d.indexOf(b) === f ? e = !0 : (c.push(a), d.push(b), e = this._equals[e].call(this, a, b, c, d), c.pop(), d.pop())) : e = a == b : e = !1
        }
        return e
    }
});
DateFormatter = $class(Object, {
    DATE_FORMAT_CACHE: null,
    DATE_FORMATS: null,
    init: function() {
        var a = this._newDateFmt.bind(this);
        this.DATE_FORMATS = [a("a"), a("A"), a("d"), a("dd"), a("D"), a("de"), a("F"), a("f"), a("h"), a("H"), a("p"), a("P"), a("M"), a("K"), a("L"), a("m"), a("mm"), a("s"), a("S"), a("yy"), a("yyyy"), a("Y"), a("fr")].sort(function(a, c) {
            return c.fmt.length - a.fmt.length
        });
        this.DATE_FORMAT_CACHE = []
    },
    _newDateFmt: function(a) {
        return {
            fmt: a,
            fn: this["fct_" + a]
        }
    },
    _getFormatArray: function(a) {
        var b = this.DATE_FORMAT_CACHE[a];
        if (!b) {
            for (b = []; 0 < a.length;) {
                var c = 1,
                    d = null;
                if ("\\" == a[0]) d = a.substring(1, ++c);
                else {
                    for (var e = 0, f = this.DATE_FORMATS.length; e < f; e++) {
                        var g = this.DATE_FORMATS[e].fmt;
                        if (a.substring(0, g.length) == g) {
                            d = this.DATE_FORMATS[e].fn;
                            c = g.length;
                            break
                        }
                    }
                    null == d && (d = a.substring(0, c))
                }
                d && b.push(d);
                a = a.substring(c)
            }
            this.DATE_FORMAT_CACHE[a] = b
        }
        return b
    },
    format: function(a, b, c) {
        var d = "";
        a = this._getFormatArray(a);
        for (var e = 0, f = a.length; e < f; e++) var g = a[e],
            d = "function" == typeof g ? d + g.call(this, b, c) : d + g;
        return d
    },
    _padLeft: function(a,
        b, c) {
        if (!b || null == a) return a;
        for (; a.length < c;) a = b + a;
        return a
    },
    fct_a: function(a, b) {
        return 12 <= (b ? a.getUTCHours() : a.getHours()) ? "pm" : "am"
    },
    fct_A: function(a, b) {
        return this.fct_a(a, b).toUpperCase()
    },
    fct_D: function(a, b) {
        return $t("date.arrayDay")[b ? a.getUTCDay() : a.getDay()]
    },
    fct_L: function(a, b) {
        return $t("date.arrayDayLong")[b ? a.getUTCDay() : a.getDay()]
    },
    fct_d: function(a, b) {
        return (b ? a.getUTCDate() : a.getDate()).toString()
    },
    fct_dd: function(a, b) {
        return this._padLeft(this.fct_d(a, b).toString(), "0", 2)
    },
    fct_de: function(a,
        b) {
        var c = this.fct_d(a, b),
            d = $t("date.arrayDayNth");
        return d instanceof Array && 31 == d.length ? d[c - 1].replace(/_/, c) : c
    },
    fct_m: function(a, b) {
        return ((b ? a.getUTCMonth() : a.getMonth()) + 1).toString()
    },
    fct_mm: function(a, b) {
        return this._padLeft(this.fct_m(a, b), "0", 2)
    },
    fct_Y: function(a, b) {
        return b ? a.getUTCFullYear() : a.getFullYear()
    },
    fct_yyyy: function(a, b) {
        return this.fct_Y(a, b)
    },
    fct_yy: function(a, b) {
        return this.fct_Y(a, b).toString().substring(2, 4)
    },
    fct_F: function(a, b) {
        return $t("date.arrayMonthLong")[b ? a.getUTCMonth() :
            a.getMonth()]
    },
    fct_f: function(a, b) {
        return $t("date.arrayMonth")[b ? a.getUTCMonth() : a.getMonth()]
    },
    fct_h: function(a, b) {
        return b ? a.getUTCHours() : a.getHours()
    },
    fct_H: function(a, b) {
        var c = this.fct_h(a, b);
        12 < c && (c -= 12);
        return 0 == c ? 12 : c
    },
    fct_p: function(a, b) {
        return this._padLeft(this.fct_h(a, b).toString(), "0", 2)
    },
    fct_P: function(a, b) {
        return this._padLeft(this.fct_H(a, b).toString(), "0", 2)
    },
    fct_K: function(a, b) {
        return this._padLeft(this.fct_H(a, b).toString(), " ", 2)
    },
    fct_M: function(a, b) {
        return this._padLeft((b ?
            a.getUTCMinutes() : a.getMinutes()).toString(), "0", 2)
    },
    fct_s: function(a, b) {
        return b ? a.getUTCSeconds() : a.getSeconds()
    },
    fct_S: function(a, b) {
        return this._padLeft((b ? a.getUTCSeconds() : a.getSeconds()).toString(), "0", 2)
    },
    fct_fr: function(a, b) {
        var c, d = new Date,
            e = b ? "getUTCFullYear" : "getFullYear",
            f = b ? "getUTCMonth" : "getMonth",
            g = b ? "getUTCDate" : "getDate";
        a[e]() == d[e]() && a[f]() == d[f]() && (a[g]() == d[g]() && (c = $t("dateFmt.friendly.today")) || a[g]() == d[g]() + 1 && (c = $t("dateFmt.friendly.tomorrow")) || a[g]() == d[g]() - 1 && (c =
            $t("dateFmt.friendly.yesterday")));
        return !c && this.format($t("dateFmt.dow_dom"), a, b) || c
    }
});
DateUtils = $class(Object, {
    unit: {
        ms: 1,
        s: 1E3,
        m: 6E4,
        h: 36E5,
        d: 864E5
    },
    now: function(a) {
        var b = Date.now();
        a && (b /= this.unit[a]);
        return b
    },
    toDate: function(a, b) {
        var c = typeof a;
        "number" === c ? (b && (a *= this.unit[b]), a = new Date(a)) : "string" === c && (a = new Date(a));
        return a
    },
    toNumber: function(a, b) {
        var c = typeof a;
        "object" === c ? a = a.getTime() : "string" === c && (a = Date.parse(a));
        b && a && (a /= this.unit[b]);
        return a
    },
    _roundTime: function(a, b, c, d) {
        b = b || 1;
        c = c.call(a);
        d.call(a, c - c % b, 0, 0, 0);
        return a
    },
    roundTime: function(a, b) {
        a = new Date(a);
        return this._roundTime(a, b, a.getHours, a.setHours)
    },
    roundTimeUTC: function(a, b) {
        a = new Date(a);
        return this._roundTime(a, b, a.getUTCHours, a.setUTCHours)
    },
    gap: function(a, b, c) {
        a = this.toNumber(a);
        b = this.toNumber(b);
        a = b - a;
        c && (a /= this.unit[c]);
        return a
    },
    overlap: function(a, b, c, d, e) {
        a = this.toNumber(a);
        b = this.toNumber(b);
        c = this.toNumber(c);
        d = this.toNumber(d);
        if (c === d) return (a < c && b > c || a === c) - 1;
        if (a === b) return (c < a && d > a || c === a) - 1;
        a = Math.max(-1, Math.min(b, d) - Math.max(a, c)) || -1;
        e && 0 < a && (a /= this.unit[e]);
        return a
    },
    add: function(a, b, c) {
        a = this.toNumber(a);
        c && (b *= this.unit[c]);
        return this.toDate(a + b)
    },
    min: function(a, b) {
        var c = a || b;
        this.gt(c, b || a) && (c = b);
        return c
    },
    max: function(a, b) {
        var c = a || b;
        this.lt(c, b || a) && (c = b);
        return c
    },
    compare: function(a, b) {
        return this.toNumber(a) - this.toNumber(b)
    },
    eq: function(a, b) {
        return this.toNumber(a) === this.toNumber(b)
    },
    ne: function(a, b) {
        return this.toNumber(a) !== this.toNumber(b)
    },
    gt: function(a, b) {
        return this.toNumber(a) > this.toNumber(b)
    },
    lt: function(a, b) {
        return this.toNumber(a) < this.toNumber(b)
    },
    ge: function(a, b) {
        return this.toNumber(a) >= this.toNumber(b)
    },
    le: function(a, b) {
        return this.toNumber(a) <= this.toNumber(b)
    },
    isOrdered: function() {
        for (var a = !0, b = arguments[0], c = 1, d = arguments.length; c < d && a; c++) var e = arguments[c],
            a = this.le(b, e),
            b = e;
        return a
    },
    isStrictOrdered: function() {
        for (var a = !0, b = arguments[0], c = 1, d = arguments.length; c < d && a; c++) var e = arguments[c],
            a = this.lt(b, e),
            b = e;
        return a
    }
});
Clock = $class(Topic, {
    UPDATE_INTERVAL: 2E4,
    init: function() {
        this.parent();
        this.fireClock()
    },
    fireClock: function() {
        this.timer && this.timer.cancel();
        this.publish("ping", Date.now());
        this.timer = $timeout(this.UPDATE_INTERVAL).done(this.fireClock.bind(this))
    }
});

function $getWindowURL() {
    return window.URL
};

function $getWindowURL() {
    return window.webkitURL
};
BackgroundTask = $class(Object, {
    deferreds: {},
    workers: {},
    stats: {},
    services: {},
    _getWorker: function(a) {
        var b = this.workers[a];
        if (!b) {
            var c = Date.now(),
                d = this.deferreds,
                e = this,
                b = this.workers[a] = this.createWorker(a);
            b.usage = {};
            b.onmessage = function(b) {
                var c = b.data.id,
                    f = b.data.type,
                    l = b.data.method,
                    m = b.data.args;
                b = b.data.prePost;
                "console" === f ? (m.unshift("[worker: " + a + "]"), console[l].apply(console, m)) : "topic" === f ? (c = e.services[a][c], m.unshift(l), c.publish.apply(c, m)) : "call" === f ? (f = d[c], f.prePost = b, f[l].apply(f,
                    m), delete d[c]) : log("worker response type unknown: " + f)
            };
            var c = Date.now() - c,
                f = this.stats[a] = this.stats[a] || {};
            f.createdWorker = (f.createdWorker || 0) + 1;
            f.creationTime = (f.createdTime || 0) + c;
            f.meanCreationTime = f.creationTime / f.createdWorker;
            f.minCreationTime = Math.min(f.minTime || Number.MAX_VALUE, c);
            f.maxCreationTime = Math.max(f.maxTime || 0, c)
        }
        return b
    },
    createWorker: function(a) {
        var b = new Worker("js/worker-" + a + ".js");
        b.__name__ = a;
        return b
    },
    submit: function(a, b, c) {
        var d = new Deferred,
            e = this._getWorker(a),
            f = this;
        d.creationDate = Date.now();
        d.worker = e;
        d.always(function() {
            var c = f.stats[a] = f.stats[a] || {},
                c = c[b] = c[b] || {};
            c.call = (c.call || 0) + 1;
            var d = Date.now() - this.creationDate;
            c.maxTime = Math.max(c.maxTime || 0, d);
            c.minTime = Math.min(c.minTime || Number.MAX_VALUE, d);
            c.totalTime = (c.totalTime || 0) + d;
            c.meanTime = c.totalTime / c.call;
            delete this.w;
            delete this.creationDate
        });
        e.usage[b] = e.usage[b] || 0;
        e.usage[b]++;
        var g = $nonce();
        this.deferreds[g] = d;
        this._post(e, {
            id: g,
            method: b,
            args: c,
            country: self.$locale ? $locale.country : null,
            lang: self.$locale ?
                $locale.lang : null
        });
        return d
    },
    _post: function(a, b) {
        for (var c = b.args || [], d = [], e = 0, f = c.length; e < f; e++) {
            var g = c[e];
            g instanceof ArrayBuffer && d.push(g)
        }
        a.postMessage(b, d)
    },
    getRemoteInterface: function(a, b) {
        var c = this,
            d = {},
            e;
        for (e in b) {
            var f = b[e];
            f instanceof Function && "constructor" != e && "getRemoteInterface" != e && "getClassName" != e ? d[e] = function(b) {
                return function() {
                    var d = $arguments2Array(arguments);
                    return c.submit(a, b, d)
                }
            }(e) : f instanceof Topic && (d[e] = f)
        }
        this.services[a] = b;
        return d
    }
});
SharedTask = $class(BackgroundTask, {
    init: function() {
        this.parent();
        this.contextPath = location.pathname.split("/")[1].replace(APP_NAME, "")
    },
    createWorker: function(a) {
        a = new SharedWorker("/" + this.contextPath + "shared_workers/js/shared_worker-" + a + ".js");
        a.port.start();
        return a.port
    }
});

function _$showMsg(a, b, c) {
    var d = $id("notif_widget");
    if (nc = d && d.ctrl) nc["show" + a](b), null != c && $hideMessage(c)
}
$showInfo = _$showMsg.bind(null, "Info");
$showWarning = _$showMsg.bind(null, "Warning");
$showError = _$showMsg.bind(null, "Error");

function $hideMessage(a) {
    var b = $id("notif_widget");
    (nc = b && b.ctrl) && (a ? nc.hideLater() : nc.hide())
};
var $backgroundTask = new BackgroundTask,
    $sharedTask = new SharedTask,
    $dateUtils = new DateUtils,
    $collectionUtils = new CollectionUtils,
    $dateFormat = new DateFormatter,
    $comparator = new Comparator;
$services.clock = new Clock;
Storage = $class(Object, {
    init: function(a) {
        this.storage = a;
        this.topics = {};
        var b = this;
        window.addEventListener("storage", function(a) {
            var d = a.key,
                e = b.topics[d];
            e && e.publish(d, a.newValue, a.oldValue)
        }, !0)
    },
    set: function(a, b) {
        b = JSON.stringify(b);
        this.storage && this.storage.setItem(a, b);
        return this
    },
    setRaw: function(a, b) {
        this.storage && this.storage.setItem(a, b);
        return this
    },
    hasKey: function(a) {
        return void 0 !== (this.storage ? this.storage.getItem(a) : void 0)
    },
    get: function(a) {
        a = this.storage && this.storage.getItem(a);
        try {
            a =
                JSON.parse(a)
        } catch (b) {}
        return a
    },
    getRaw: function(a) {
        return this.storage && this.storage.getItem(a)
    },
    remove: function(a) {
        this.storage && this.storage.removeItem(a);
        return this
    },
    clear: function() {
        this.storage && this.storage.clear()
    },
    addListener: function(a, b) {
        var c = this.topics[a];
        c || (c = this.topics[a] = new Topic);
        c.subscribe(b)
    },
    initCache: function(a, b, c, d, e) {
        return new Cache(a, this, b, c, d, e)
    }
});
CacheDefinition = $class(Object, {
    media_storage: function() {
        return $storage
    },
    media_maxSize: function() {
        return 1048576
    },
    media_maxItems: function() {
        return 0
    },
    media_compressed: function() {
        return !1
    },
    media_onremove: $nop,
    md5_storage: function() {
        return $storage
    },
    md5_maxSize: function() {
        return 65536
    },
    md5_maxItems: function() {
        return 0
    },
    md5_compressed: function() {
        return !1
    },
    md5_onremove: $nop,
    mg_storage: function() {
        return $storage
    },
    mg_maxSize: function() {
        return 2097152
    },
    mg_maxItems: function() {
        return 0
    },
    mg_compressed: function() {
        return !1
    },
    mg_onremove: $nop,
    mgChannel_storage: function() {
        return $storage
    },
    mgChannel_maxSize: function() {
        return 0
    },
    mgChannel_maxItems: function() {
        return 1
    },
    mgChannel_compressed: function() {
        return !1
    },
    mgChannel_onremove: $nop,
    adMediate_storage: function() {
        return $storage
    },
    adMediate_maxSize: function() {
        return 1048576
    },
    adMediate_maxItems: function() {
        return 0
    },
    adMediate_compressed: function() {
        return !1
    },
    adMediate_onremove: $nop,
    autorec_storage: function() {
        return $storage
    },
    autorec_maxSize: function() {
        return 1048576
    },
    autorec_maxItems: function() {
        return 0
    },
    autorec_compressed: function() {
        return !1
    },
    autorec_onremove: $nop,
    series_storage: function() {
        return $storage
    },
    series_maxSize: function() {
        return 524288
    },
    series_maxItems: function() {
        return 0
    },
    series_compressed: function() {
        return !1
    },
    series_onremove: $nop
});
Cache = $class(Object, {
    MAX_SIZE_AUTHORIZED: 2097152,
    init: function(a, b, c, d, e, f) {
        this.storage = b;
        this.storage[a] = this;
        this.addEventListener("remove", f);
        this.name = a;
        this.metadata = this.storage.get(this._getMetadataKey()) || {
            totalItem: 0,
            totalSize: 0,
            first: null,
            last: null
        };
        this.metadata.maxSize = c || Number.POSITIVE_INFINITY;
        this.metadata.maxItem = d || Number.POSITIVE_INFINITY;
        this.metadata.compressed = e || !1;
        (0 > this.metadata.maxItem || 0 > this.metadata.maxSize) && logWarn("Cache disabled due to configuration");
        this._purge()
    },
    addEventListener: function(a, b) {
        if (a && b) {
            this.eventListeners = this.eventListeners || {};
            var c = this.eventListeners[a] || [];
            this.eventListeners[a] = c;
            c.push(b)
        }
    },
    removeEventListener: function(a, b) {
        if (a && b) {
            this.eventListeners = this.eventListeners || {};
            var c = this.eventListeners[a] || [],
                d = c.indexOf(b);
            0 <= d && c.splice(d, 1)
        }
    },
    _fireEvent: function(a, b) {
        var c = this.eventListeners && this.eventListeners[a];
        if (c) {
            "function" === typeof b && (b = b());
            for (var d = 0, e = c.length; d < e; d++) {
                var f = c[d];
                try {
                    f.apply(f, b)
                } catch (g) {
                    log("onremove function faild",
                        g)
                }
            }
        }
    },
    _compress: function(a, b, c, d, e) {
        var f = this;
        $lzstringBackground.compress(b).done(function(b) {
            var h = f._getInfo(a);
            if (h) {
                var k = b.length;
                f.metadata.totalSize = f.metadata.totalSize - h.size + k;
                h.size = k;
                h.compressed = !0;
                f._storeChunk(h, b);
                f._setInfo(h);
                f._purge()
            } else c && (f.set(a, b, d, !1), h = f._getInfo(a)) && (h.compressed = !0, h.stringify = e, f._setInfo(h))
        })
    },
    set: function(a, b, c, d, e) {
        if (0 > this.metadata.maxItem || 0 > this.metadata.maxSize) return this;
        if (a) {
            var f = "string" !== typeof b;
            f && (b = JSON.stringify(b));
            d = !0 ===
                d || !0 === this.metadata.compressed && !1 !== d;
            if (b.length > this.MAX_SIZE_AUTHORIZED && d && !e) this._compress(a, b, !0, c, f);
            else {
                this._removeData(a);
                var g = this._removeInfo(a);
                g ? (this.metadata.totalSize -= g.size, this.metadata.totalItem--) : g = {};
                var h = e || b.length;
                g.stringify = f;
                g.size = h;
                g.id = a;
                g.date = c;
                this._storeChunk(g, b);
                this.metadata.totalSize += h;
                this.metadata.totalItem++;
                this._addFirst(g);
                this._purge();
                d && (e ? logWarn("forcedSize is incompatible with compression, compression is disabled") : this._compress(a, b))
            }
        } else logWarn("Cache doesn't support '" +
            a + "' as key");
        return this
    },
    _storeChunk: function(a, b) {
        for (var c = a.id, d = 0, e = 0, f; e < b.length;) {
            f = this._getDataKey(c, d);
            var g = b.substr(e, this.MAX_SIZE_AUTHORIZED);
            this.storage.setRaw(f, g);
            d += 1;
            e += this.MAX_SIZE_AUTHORIZED
        }
        a.chunk = d
    },
    _restoreChunk: function(a) {
        var b;
        if (a) {
            var c = a.id;
            b = "";
            var d = 0;
            for (a = a.chunk || 1; d < a; d++) {
                var e = this._getDataKey(c, d),
                    e = this.storage.getRaw(e);
                b += e
            }
        }
        return b
    },
    _removeChunk: function(a) {
        if (a) {
            var b = a.id,
                c = 0;
            for (a = a.chunk || 1; c < a; c++) {
                var d = this._getDataKey(b, c);
                this.storage.remove(d)
            }
        }
    },
    _getRaw: function(a) {
        var b = {};
        if (a) {
            var c = this._getInfo(a);
            b.value = this._restoreChunk(c);
            b.value = this._parse(c, b.value);
            c && ((b.info = c, c.date && c.date < Date.now()) ? (b.value = void 0, this.remove(a), this._purge()) : this.metadata.first === a || this.metadata.maxItem === Number.POSITIVE_INFINITY && this.metadata.maxSize === Number.POSITIVE_INFINITY || !(c = this._removeInfo(a)) || (this._addFirst(c), this._purge()))
        } else console.warn("Cache doesn't support '" + a + "' as key");
        return b
    },
    _access: function(a) {
        var b = this._getInfo(a);
        b && this.metadata.first !== a && (this.metadata.maxItem !== Number.POSITIVE_INFINITY || this.metadata.maxSize !== Number.POSITIVE_INFINITY) && (b = this._removeInfo(a)) && (this._addFirst(b), this._purge())
    },
    forEach: function(a, b) {
        for (var c = [], d = this, e = function(a, c, e, f) {
                var g;
                if (b) g = $lzstringBackground.decompress(e).done(function(a) {
                    try {
                        a = d._parse(a), f(c, a)
                    } catch (b) {}
                });
                else try {
                    e = $lzstring.decompress(data.value), e = d._parse(e), f(c, e)
                } catch (h) {}
                return g
            }, f = this.metadata.first; f;) {
            var g = this._getInfo(f),
                h = this._restoreChunk(g);
            g.compressed ? (f = e(g, f, h, a)) && c.push(f) : (h = this._parse(g, h), a(f, h));
            f = g && g.next
        }
        return Deferred.all.apply(void 0, c)
    },
    _parse: function(a, b) {
        if (!a || 0 != a.stringify) try {
            b = JSON.parse(b)
        } catch (c) {}
        return b
    },
    get: function(a) {
        a = this._getRaw(a);
        var b = a.value;
        if (a.value && a.info.compressed) try {
            b = $lzstring.decompress(a.value), b = this._parse(a.info, b)
        } catch (c) {
            b = void 0
        }
        return b
    },
    getAsDeferred: function(a) {
        var b = new Deferred,
            c = this._getRaw(a);
        if (c.value)
            if (c.info.compressed) {
                var d = this;
                $lzstringBackground.decompress(c.value).done(function(e) {
                    e =
                        d._parse(c.info, e);
                    b.resolve(e, a)
                })
            } else b.resolve(c.value, a);
        else b.reject.apply(b, arguments);
        return b
    },
    remove: function(a) {
        this._removeData(a);
        if (a = this._removeInfo(a)) this.metadata.totalSize -= a.size, this.metadata.totalItem--, this._purge();
        return this
    },
    _removeData: function(a) {
        var b = this._getInfo(a),
            c = this._restoreChunk(b);
        void 0 != c && this._fireEvent("remove", [a, c]);
        this._removeChunk(b)
    },
    clear: function() {
        for (var a = this.metadata.first; a;) {
            var b = this._getInfo(a);
            this._removeData(a);
            this.storage.remove(this._getMetadataKey(a));
            a = b && b.next
        }
        this.metadata.totalSize = 0;
        this.metadata.totalItem = 0;
        this.metadata.first = null;
        this.metadata.last = null;
        this._purge()
    },
    _getDataKey: function(a, b) {
        var c = "#cache-" + this.name;
        b && (c += "_chunk" + b);
        a && (c += "_" + a);
        return c
    },
    _getMetadataKey: function(a) {
        var b = "#cache-" + this.name;
        a && (b += "_info_" + a);
        return b
    },
    _setInfo: function(a) {
        var b = this._getMetadataKey(a.id);
        this.storage.set(b, a)
    },
    _getInfo: function(a) {
        a = this._getMetadataKey(a);
        return this.storage.get(a)
    },
    _removeInfo: function(a) {
        var b = this._getInfo(a);
        if (b) {
            this.storage.remove(this._getMetadataKey(a));
            a = b.prev && this._getInfo(b.prev);
            var c = b.next && this._getInfo(b.next);
            a ? a.next = b.next : (this.metadata.first = b.next, c && delete c.prev);
            c ? c.prev = b.prev : (this.metadata.last = b.prev, a && delete a.next);
            a && this._setInfo(a);
            c && this._setInfo(c);
            b.prev && b.next || this.storage.set(this._getMetadataKey(), this.metadata)
        }
        return b
    },
    _addFirst: function(a) {
        if (this.metadata.first) {
            var b = this._getInfo(this.metadata.first);
            b.prev = a.id;
            a.next = b.id;
            delete a.prev;
            this.metadata.first =
                a.id;
            this._setInfo(b)
        } else this.metadata.first = a.id, this.metadata.last = a.id, delete a.prev, delete a.next;
        this._setInfo(a)
    },
    _purge: function() {
        if (this.metadata.totalItem > this.metadata.maxItem || this.metadata.totalSize > this.metadata.maxSize)
            for (var a = this.metadata.last; a && (this.metadata.totalItem > this.metadata.maxItem || this.metadata.totalSize > this.metadata.maxSize);) this._removeData(a), a = this._removeInfo(a), this.metadata.totalItem--, this.metadata.totalSize -= a && a.size || 0, a = this.metadata.last, 0 === this.metadata.totalItem &&
                (this.metadata.totalSize = 0, delete this.metadata.first, delete this.metadata.last);
        this.storage.set(this._getMetadataKey(), this.metadata)
    }
});
CacheMemory = $class(Object, {
    init: function(a, b) {
        this.storage = new StorageVolatile(b);
        this.parentCache = a;
        var c = this;
        a.addEventListener("remove", function(a, b) {
            c.storage.remove(a)
        })
    },
    preload: function(a) {
        if (this.preloaded) return (new Deferred).resolve();
        var b = this;
        return this.parentCache.forEach(function(a, d) {
            b.storage.hasKey(a) || b._setInStorage(a, d)
        }, a).done(function() {
            b.preloaded = !0
        })
    },
    addEventListener: function(a, b) {
        this.parentCache.addEventListener(a, b)
    },
    removeEventListener: function(a, b) {
        this.parentCache.removeEventListener(a,
            b)
    },
    set: function(a, b, c) {
        this._setInStorage(a, b, c);
        this.parentCache.set(a, b, c)
    },
    _setInStorage: function(a, b, c) {
        this.storage.set(a, {
            value: b,
            date: c
        })
    },
    get: function(a) {
        var b, c = this.storage.get(a);
        void 0 === c ? (b = this.parentCache.get(a), void 0 !== b && this._setInStorage(a, b)) : c.date && c.date < Date.now() ? this.remove(a) : (b = c.value, this.parentCache._access(a));
        return b
    },
    getAsDeferred: function(a) {
        var b = this.storage.get(a),
            c;
        if (b) c = new Deferred, b.date && b.date < Date.now() ? (this.remove(a), c.reject()) : c.resolve(b.value,
            a);
        else {
            var d = this,
                e = this.parentCacheGetDeferredWork = this.parentCacheGetDeferredWork || {};
            c = e[a];
            c || (c = this.parentCache.getAsDeferred.apply(this.parentCache, arguments).done(function(a, b) {
                d._setInStorage(b, a)
            }), e[a] = c, c.always(function() {
                delete e[a]
            }))
        }
        return c
    },
    remove: function(a) {
        this.parentCache.remove(a)
    },
    clear: function() {
        this.storage.clear();
        this.parentCache.clear()
    }
});
StorageVolatile = $class(Object, {
    init: function(a) {
        this.noStringify = a;
        this.data = {}
    },
    setRaw: function(a, b) {
        this.data[a] = b;
        return this
    },
    set: function(a, b) {
        !0 !== this.noStringify && (b = JSON.stringify(b));
        this.data[a] = b;
        return this
    },
    hasKey: function(a) {
        return void 0 !== this.data[a]
    },
    getRaw: function(a) {
        return this.data[a]
    },
    get: function(a) {
        a = this.data[a];
        if (1 != this.noStringify) try {
            a = JSON.parse(a)
        } catch (b) {}
        return a
    },
    getAsDeferred: function(a) {
        var b = new Deferred,
            c = this.get(a);
        void 0 === c ? b.reject.apply(b, arguments) :
            b.resolve(c);
        return b
    },
    remove: function(a) {
        delete this.data[a];
        return this
    },
    clear: function() {
        this.data = {}
    }
});
var FS_STORAGE_SIZE = 1073741824;
StorageFS = $class(Object, {
    init: function(a, b) {
        this.parent();
        this.name = a;
        this.parentFS = b;
        this._checkInit()
    },
    _checkInit: function() {
        var a = this,
            b = this.action = this.initAction = new Deferred;
        b.__info__ = "_checkInit";
        this.parentFS ? a._localInit(this.parentFS).done(function(a) {
            b.resolve(a)
        }).fail(function() {
            b.reject()
        }) : this._globalInit().done(function(c) {
            a._localInit(c).done(function(a) {
                b.resolve(a)
            }).fail(function() {
                b.reject()
            })
        }).fail(function() {
            b.reject()
        });
        b.done(function(b) {
            a.root = b
        });
        return b
    },
    _localInit: function(a) {
        var b =
            new Deferred;
        b.__info__ = "_localInit";
        if (this.root) b.resolve(this.root);
        else {
            var c = this,
                d = this._sanitizeFileName(this.name);
            a.initAction.done(function(a) {
                c.name && "." !== c.name ? a.getDirectory(d, {
                    create: !0
                }, function(a) {
                    b.resolve(a)
                }, c.onErrorHandler.bind(c, b, "_localInit", c.name)) : b.resolve(a)
            }).fail(function() {
                b.reject()
            })
        }
        return b
    },
    _globalInit: function() {
        if (!window.StorageFS_globalInit_Def) {
            var a = window.StorageFS_globalInit_Def = new Deferred;
            a.__info__ = "_globalInit";
            var b = this;
            window.requestFileSystem =
                window.requestFileSystem || window.webkitRequestFileSystem;
            navigator.webkitPersistentStorage.requestQuota(FS_STORAGE_SIZE, function(c) {
                window.requestFileSystem(PERSISTENT, c, function(b) {
                    log("StorageFS fs created with quota " + c);
                    b.initAction = new Deferred;
                    b.initAction.resolve(b.root);
                    a.resolve(b)
                }, b.onErrorHandler.bind(b, a, "_globalInit", ""))
            }, b.onErrorHandler.bind(b, a, "_globalInit", ""));
            a.fail(function() {
                delete window.StorageFS_globalInit_Def
            })
        }
        return window.StorageFS_globalInit_Def
    },
    set: function(a, b) {
        var c =
            this._sanitizeFileName(a),
            d = this,
            e = this.action,
            f = this.action = new Deferred;
        f.__info__ = e.__info__;
        e.always(function() {
            f.__info__ = "set " + a;
            d.root.getFile(c, {
                create: !0
            }, function(c) {
                c.createWriter(function(d) {
                    var e;
                    b instanceof Blob ? e = b : ("string" !== typeof b && (b = JSON.stringify(b)), e = new Blob([b], {
                        type: "text/plain"
                    }));
                    d.onwriteend = function() {
                        d.error ? f.reject(a) : 0 === d.length ? d.write(e) : f.resolve(a, c.toURL())
                    };
                    d.onerror = function(b) {
                        logWarn('Write failed for file: "' + a + '" with error: ' + b.toString());
                        f.reject(a)
                    };
                    d.truncate(0)
                }, d.onErrorHandler.bind(d, f, "set", a))
            }, d.onErrorHandler.bind(d, f, "set", a));
            return f
        });
        return f
    },
    hasKey: function(a) {
        var b = this._sanitizeFileName(a),
            c = this,
            d = this.action,
            e = this.action = new Deferred;
        e.__info__ = d.__info__;
        d.always(function() {
            e.__info__ = "hasKey " + a;
            c.root.getFile(b, {
                create: !1
            }, function(a) {
                e.resolve(a.toURL())
            }, function() {
                c.root.getDirectory(b, {
                    create: !1
                }, function(a) {
                    e.resolve(a.toURL())
                }, function() {
                    e.reject()
                })
            });
            return e
        });
        return e
    },
    getURL: function(a) {
        return this.hasKey(a)
    },
    _get: function(a, b) {
        var c = this._sanitizeFileName(b),
            d = $arguments2Array(arguments);
        d.shift();
        var e = this,
            f = this.action,
            g = this.action = new Deferred;
        g.__info__ = f.__info__;
        f.always(function() {
            g.__info__ = "_get " + a + " " + b;
            e.root.getFile(c, {
                create: !1
            }, function(b) {
                b.file(function(b) {
                    var c = new FileReader;
                    c.onload = function(a) {
                        d.unshift(this.result);
                        g.resolve.apply(g, d)
                    };
                    c.onerror = function(a) {
                        g.reject.apply(g, d)
                    };
                    c[a](b)
                }, function() {
                    g.reject.apply(g, d)
                })
            }, function() {
                g.reject.apply(g, d)
            });
            return g
        });
        return g
    },
    getRaw: function(a) {
        var b =
            $arguments2Array(arguments);
        b.unshift("readAsArrayBuffer");
        return this._get.apply(this, b)
    },
    getObject: function(a) {
        var b = $arguments2Array(arguments);
        b.unshift("readAsText");
        return this._get.apply(this, b).done(function() {
            var a = $arguments2Array(arguments),
                d = a.shift();
            try {
                d = JSON.parse(d)
            } catch (e) {
                return a = new Deferred, a.reject(b), a
            }
            a.unshift(d);
            return a
        })
    },
    getString: function(a) {
        var b = $arguments2Array(arguments);
        b.unshift("readAsText");
        return this._get.apply(this, b)
    },
    remove: function(a) {
        var b = this._sanitizeFileName(a),
            c = this,
            d = this.action,
            e = this.action = new Deferred;
        e.__info__ = d.__info__;
        d.always(function() {
            e.__info__ = "remove " + a;
            c.root.getFile(b, {
                create: !1
            }, function(b) {
                b.remove(function() {
                    e.resolve()
                }, c.onErrorHandler.bind(c, e, "remove", a))
            }, function() {
                c.root.getDirectory(b, {
                    create: !1
                }, function(b) {
                    b.removeRecursively(function() {
                        e.resolve()
                    }, c.onErrorHandler.bind(c, e, "remove", a))
                }, c.onErrorHandler.bind(c, e, "remove", a))
            });
            return e
        });
        return e
    },
    clear: function() {
        var a = this,
            b = this.action,
            c = this.action = new Deferred;
        c.__info__ =
            b.__info__;
        b.always(function() {
            c.__info__ = "clear";
            a.root.removeRecursively(function() {
                a.root = null;
                a._checkInit().done(function() {
                    c.resolve()
                }).fail(function() {
                    c.reject()
                })
            }, a.onErrorHandler.bind(a, c, "clear", a.name));
            return c
        });
        return c
    },
    getDirectory: function(a) {
        var b = $arguments2Array(arguments),
            c = this,
            d = this.action,
            e = this.action = new Deferred;
        e.__info__ = d.__info__;
        d.always(function() {
            e.__info__ = "getDirectory " + a;
            var d = c._sanitizeFileName(a);
            c.root.getDirectory(d, {
                create: !1
            }, function(d) {
                var f = new StorageFS(a,
                    c);
                f.action.done(function() {
                    b.unshift(f);
                    e.resolve.apply(e, b)
                }).fail(function() {
                    e.reject.apply(e, b)
                })
            }, function() {
                e.reject.apply(e, b)
            });
            return e
        });
        return e
    },
    mkdir: function(a) {
        var b = this,
            c = this.action,
            d = this.action = new Deferred;
        d.__info__ = c.__info__;
        c.always(function() {
            d.__info__ = "mkdir " + a;
            var c = new StorageFS(a, b);
            c.action.done(function() {
                d.resolve(c)
            }).fail(function() {
                d.reject()
            });
            return d
        });
        return d
    },
    touch: function(a) {
        var b = this._sanitizeFileName(a),
            c = this,
            d = this.action,
            e = this.action = new Deferred;
        e.__info__ = d.__info__;
        d.always(function() {
            e.__info__ = "touch " + a;
            c.root.getFile(b, {
                create: !1
            }, function(b) {
                b.createWriter(function(c) {
                    c.onwriteend = function() {
                        e.resolve(a, b.toURL())
                    };
                    c.onerror = function(b) {
                        e.reject(a)
                    };
                    c.truncate(c.length)
                }, c.onErrorHandler.bind(c, e, "touch", a))
            }, c.onErrorHandler.bind(c, e, "touch", a));
            return e
        });
        return e
    },
    ls: function(a) {
        var b = this,
            c = this.action,
            d = this.action = new Deferred;
        d.__info__ = c.__info__;
        c.always(function() {
            d.__info__ = "ls";
            var c = b.root.createReader(),
                f = [],
                g = function() {
                    c.readEntries(function(b) {
                        if (b.length) {
                            if (a)
                                for (var c =
                                        0, e = b.length; c < e; c++) {
                                    var m = b[c];
                                    a(m) && f.push(m)
                                } else f.push.apply(f, b);
                            g()
                        } else d.resolve(f)
                    }, b.onErrorHandler.bind(b, d, "ls", b.name))
                };
            g();
            return this.action
        });
        return this.action
    },
    lsl: function(a) {
        var b = new Deferred,
            c = this,
            d = 0,
            e = [];
        this.ls().done(function(f) {
            for (var g = f.length, h = 0; h < g; h++) {
                var k = f[h];
                k.getMetadata(function(c) {
                    d++;
                    k.mtime = c.modificationTime;
                    k.size = c.size;
                    a && !a(k) || e.push(k);
                    g <= d && b.resolve(e)
                }, c.onErrorHandler.bind(c, b, "lsl", c.name))
            }
        }).fail(function() {
            b.fail()
        });
        return b
    },
    du: function(a,
        b) {
        var c = new Deferred,
            d = this,
            e = 0,
            f = 0;
        this.lsl(a).done(function(g) {
            for (var h = [], k = 0, l = g.length; k < l; k++) {
                var m = g[k];
                m.isDirectory && 1 !== b ? h.push(d.getDirectory(m.name).done(function(c) {
                    return c.du(a, b - 1).done(function(a, b) {
                        e += a;
                        f += b
                    })
                })) : (f++, e += m.size)
            }
            Deferred.when.apply(Deferred, h).done(function() {
                c.resolve(e, f)
            }).fail(function() {
                c.reject()
            })
        }).fail(function() {
            c.reject()
        });
        return c
    },
    df: function() {
        var a = new Deferred;
        navigator.webkitPersistentStorage.queryUsageAndQuota(function(b, c) {
                a.resolve(c - b, c)
            },
            this.onErrorHandler.bind(this, a, "df", this.name));
        return a
    },
    _sanitizeFileName: function(a) {
        return a.replace(/\//g, "--")
    },
    onErrorHandler: function(a, b, c, d) {
        log("StorageFS(" + this.name + ") Error: " + (d.name + ": " + d.message) + " during " + b + ' on "' + c + '"');
        (a = a || this.action) && a.reject()
    }
});
StorageFS.clear = function() {
    var a = [];
    return (new StorageFS(".")).ls(function(b) {
        var c = "remove";
        b.isDirectory && (c += "Recursively");
        a.push(b.name);
        b[c]($nop)
    }).done(function() {
        return [a]
    })
};
CacheFS = $class(Object, {
    init: function(a, b, c, d) {
        this.parent();
        this.name = a;
        this.maxSize = b || Number.POSITIVE_INFINITY;
        this.maxItem = c || Number.POSITIVE_INFINITY;
        this.storage = new StorageFS(a, d);
        this.storageData = new StorageFS("data", this.storage);
        this.storageInfo = new StorageFS("info", this.storage);
        this.memoryCache = {};
        this._purge()
    },
    set: function(a, b, c) {
        var d = this,
            e = $arguments2Array(arguments),
            f = new Deferred;
        if (0 > this.maxItem || 0 > this.maxSize || this.disableWrite) return f.reject.apply(f, e), f;
        if (a) {
            var g, h, k;
            b instanceof
            Blob ? (g = "blob", k = b.size) : (g = "string", (h = "string" !== typeof b) && (b = JSON.stringify(b)), k = b.length);
            var l = {
                type: g,
                stringify: h,
                date: c,
                size: k
            };
            this.storageData.set(a, b).done(function(b, c) {
                d.storageInfo.set(a, l);
                d._addMemoryCache(b, e[1], c, l);
                d._purge();
                e[1] = c;
                f.resolve.apply(f, e)
            }).fail(function() {
                f.reject.apply(f, e)
            })
        } else logWarn("Cache doesn't support '" + a + "' as key"), f.reject.apply(f, e);
        return f
    },
    _addMemoryCache: function(a, b, c, d) {
        a = this.memoryCache[a] = {
            key: a,
            type: d.type,
            stringify: d.stringify,
            date: d.date,
            atime: Date.now()
        };
        "blob" === d.type ? (a.value = c, a.size = c.length) : (a.value = b, a.size = d.size)
    },
    _getMemoryCache: function(a) {
        if (a = this.memoryCache[a]) a.atime = Date.now();
        return a
    },
    _removeMemoryCache: function(a) {
        this.memoryCache[a] = void 0
    },
    _purgeMemoryCache: function() {
        for (var a = $cacheFactory.CACHE_MAX_MEMORY_SIZE, b = Object.keys(this.memoryCache), c = [], d = 0, e = 0, f = b.length; e < f; e++) {
            var g = this.memoryCache[b[e]],
                d = d + g.size;
            c.push(g)
        }
        for (c.sort(function(a, b) {
                return b.atime - a.atime
            }); d > a;) g = c.pop(), d -= g.size, this.memoryCache[g.key] =
            void 0
    },
    _restoreData: function(a, b) {
        return "blob" === b.type ? this.storageData.getURL(a) : !1 !== b.stringify ? this.storageData.getObject(a) : this.storageData.getString(a)
    },
    get: function(a) {
        var b = $arguments2Array(arguments),
            c = new Deferred,
            d = this,
            e = this._getMemoryCache(a);
        e ? e.date && e.date < Date.now() ? (this.remove(a), c.reject.apply(c, b)) : (b.unshift(e.value), c.resolve.apply(c, b)) : this.storageInfo.getObject(a).done(function(e) {
            e.date && e.date < Date.now() ? (d.remove(a), c.reject.apply(c, b)) : d._restoreData(a, e).done(function(g) {
                b.unshift(g);
                d._addMemoryCache(a, g, g, e);
                d.storageData.touch(a);
                c.resolve.apply(c, b)
            }).fail(function() {
                c.reject.apply(c, b)
            })
        }).fail(function() {
            c.reject.apply(c, b)
        });
        return c
    },
    getAsDeferred: function() {
        return this.get.apply(this, arguments)
    },
    remove: function(a) {
        var b = $arguments2Array(arguments),
            c = this.storageInfo.remove(a),
            d = this.storageData.remove(a),
            e = this,
            f = new Deferred;
        Deferred.when(c, d).done(function() {
            e._removeMemoryCache(a);
            f.resolve.apply(f, b)
        }).fail(function() {
            f.reject.apply(f, b)
        });
        return f
    },
    clear: function() {
        var a =
            $arguments2Array(arguments),
            b = this.storageData.clear(),
            c = this.storageInfo.clear(),
            d = this,
            e = new Deferred;
        Deferred.when(b, c).done(function() {
            d.memoryCache = {};
            e.resolve.apply(e, a)
        }).fail(function() {
            e.reject.apply(e, a)
        });
        return e
    },
    _purge: function() {
        var a = this;
        this.mustPurge = this.mustPurge || $cacheFactory.CACHE_MAX_SET_BEFORE_PURGE;
        this.mustPurge--;
        var b = .1 * FS_STORAGE_SIZE;
        this.storageData.df().done(function(c, d) {
            if (c < b || 0 === a.mustPurge) {
                a._purgeMemoryCache();
                var e;
                a.maxSize !== Number.POSITIVE_INFINITY ?
                    e = "lsl" : a.maxItem !== Number.POSITIVE_INFINITY && (e = "ls");
                e && a.storageData[e]().done(function(b) {
                    var c = b.length,
                        d = 0;
                    if ("lsl" === e)
                        for (var k = 0; k < c; k++) d += b[k].size;
                    if (d > a.maxSize || c > a.maxItem) b.sort(function(a, b) {
                        return $dateUtils.toNumber(b.mtime) - $dateUtils.toNumber(a.mtime)
                    }), a._clean(b, d, c)
                })
            }
        })
    },
    _clean: function(a, b, c) {
        var d, e = this;
        (d = a.pop()) && (e.maxSize && b > e.maxSize || e.maxItem && c > e.maxItem) && this.remove(d.name).done(function() {
            b && (b -= d.size);
            c--
        }).always(function() {
            e._clean(a, b, c)
        })
    }
});
CacheFactory = $class(Object, {
    CACHE_MAX_SET_BEFORE_PURGE: 20,
    CACHE_MAX_MEMORY_SIZE: 5242880,
    channelsParameters: {
        maxsize: 0,
        maxentry: 0
    },
    nimbusParameters: {
        maxsize: 104857600,
        maxentry: 0
    },
    imagesParameters: {
        maxsize: 104857600,
        maxentry: 0
    },
    init: function() {
        this.storageFS = new StorageFS("cache")
    },
    get: function(a) {
        var b = this[a + "Parameters"];
        !this[a] && b && (this[a] = new CacheFS(a, b.maxsize, b.maxentry, this.storageFS));
        return this[a]
    },
    clear: function() {
        for (var a = Object.keys(this.__proto__).filter(function(a) {
                    return /.*Parameters$/.test(a)
                }),
                b = [], c = 0, d = a.length; c < d; c++) {
            var e = a[c],
                e = e.substring(0, e.length - 10),
                f = this.get(e).clear();
            f.cacheName = e;
            b.push(f)
        }
        var g = new Deferred;
        Deferred.all.apply(Deferred, b).always(function() {
            for (var a = [], b = [], c = 0, d = arguments.length; c < d; c++) {
                var e = arguments[c];
                "resolved" === e.deferred.state() ? a.push(e.deferred.cacheName) : b.push(e.deferred.cacheName)
            }
            g.resolve(a, b)
        });
        return g
    }
});
var $storage = new Storage(localStorage),
    $cacheDefinition = new CacheDefinition,
    $cacheFactory = new CacheFactory;
var GLOBAL_XHR_TIMEOUT = 3E4,
    MIME_TYPES = {
        json: "application/json",
        text: "text/plain",
        auto: "*/*"
    };
XHR = $class(Object, {
    charset: "UTF-8",
    _call: function(a, b, c) {
        "string" == typeof a && (a = {
            url: a
        });
        a.method = b;
        c && (a.methodOverride = b);
        return this.call(a)
    },
    get: function(a) {
        return this._call(a, "GET")
    },
    post: function(a) {
        return this._call(a, "POST")
    },
    put: function(a) {
        return this._call(a, "PUT", !0)
    },
    del: function(a) {
        return this._call(a, "DELETE", !0)
    },
    call: function(a) {
        var b = new XMLHttpRequest,
            c = new DeferredXHR(b),
            d = a.url,
            e = a.method || "GET",
            f = a.json ? JSON.stringify(a.json) : this.generateParamString(a.param);
        "POST" != e && "PUT" !=
            e && a.param && (d = -1 == d.indexOf("?") ? d + ("?" + f) : d + ("&" + f));
        var g = a.dataType || "json",
            h = g.indexOf(";"),
            k; - 1 != h ? (k = g.substr(h + 1), g = g.substr(0, h)) : k = "charset=" + this.charset;
        h = a.mimeType || MIME_TYPES[g] + ";" + k;
        b.url = d;
        b.requestTimeout = null;
        b.onreadystatechange = this.callback(c, g, a.noParsing);
        b.open(e, d, !0);
        b.withCredentials = void 0 !== a.withCredentials ? !0 === a.withCredentials : !0;
        "image" !== g && (b.setRequestHeader("X-Accept-Charset", this.charset), d = self.$locale && $locale.lang || "*", b.setRequestHeader("Accept-Language",
            d), b.setRequestHeader("X-Accept-Language", d));
        a.methodOverride && b.setRequestHeader("X-HTTP-Method-Override", a.methodOverride);
        if (d = a.additionalHeaders) {
            k = 0;
            for (var l = d.length; k < l; k++) {
                var m = d[k];
                b.setRequestHeader(m.key, m.value)
            }
        }
        "auto" !== g && "image" != g && b.overrideMimeType(h);
        a.responseType && (b.responseType = a.responseType);
        b.requestTimeout = $timeout(a.timeout || GLOBAL_XHR_TIMEOUT).done(b.abort.bind(b));
        "GET" == e || "DELETE" == e ? b.send(null) : (a.json ? b.setRequestHeader("Content-type", "application/json") : b.setRequestHeader("Content-type",
            "application/x-www-form-urlencoded"), b.send(f));
        return c
    },
    generateParamString: function(a) {
        for (var b = "", c = "", d = Object.keys(a || {}), e = 0, f = d.length; e < f; e++) {
            var g = d[e],
                h = a[g];
            if (null != h) {
                if (h instanceof Array)
                    for (var k = 0, l = h.length; k < l; k++) null != h[k] && (b += c + g + "=" + this.encodeParam(h[k]), c = "&");
                else b += c + g + "=" + this.encodeParam(h);
                c = "&"
            }
        }
        return b
    },
    encodeParam: function(a) {
        var b = typeof a;
        return encodeURIComponent("string" == b || "number" == b || "boolean" == b ? a : JSON.stringify(a))
    },
    parseResult: function(a, b) {
        if (a &&
            "text" != b && "string" === typeof a) try {
            return /^\s*(\[|{)/.test(a) ? JSON.parse(a) : a
        } catch (c) {
            return logError("Parse error when parsing JSON ||" + a + "||", c), null
        } else return a
    },
    callback: function(a, b, c) {
        var d = this;
        return function() {
            var e = a.xhr;
            if (4 == e.readyState) {
                e.requestTimeout.cancel();
                var f;
                f = e.responseType && "text" !== e.responseType ? e.response : !0 === c ? e.responseText : d.parseResult(e.responseText, b);
                200 == e.status && null == f.errorCode ? a.resolve(f) : (logWarn("XHR callback: status [" + e.status + "] url [" + e.url + "]"),
                    a.reject(f))
            }
        }
    }
});
XHRBackground = $class(XHR, {
    call: function(a) {
        var b = a.noParsing;
        a.noParsing = !0;
        var c = $backgroundTask.submit("xhr", "call", [a]);
        c.always(function() {
            if (this.prePost) {
                var a = this;
                this.xhr = {
                    status: this.prePost.status,
                    statusText: this.prePost.statusText,
                    url: this.prePost.url,
                    getResponseHeader: function(b) {
                        if (!this.headers) {
                            this.headers = {};
                            for (var c = a.prePost.header.split("\n"), d = 0, k = c.length; d < k; d++) {
                                var l = c[d].split(": ");
                                this.headers[l[0]] = l[1]
                            }
                        }
                        return this.headers[b]
                    },
                    getAllResponseHeaders: function() {
                        return a.prePost.header
                    }
                }
            }
        });
        if (!0 !== b) {
            var d = this;
            c.done(function(b) {
                var c = b,
                    c = a.dataType || "json",
                    c = c.replace(/(.*);.*/, "$1"),
                    c = d.parseResult(b, c);
                return [c]
            })
        }
        a.noParsing = b;
        return c
    }
});
DeferredXHR = $class(Deferred, {
    xhr: null,
    init: function(a) {
        this.parent();
        this.xhr = a
    },
    filterCallbacks: function() {
        for (var a = [], b = [], c = 0, d = this.fails.length; c < d; c++) {
            var e = this.fails[c],
                f = this.dones[c];
            if (null == e || null == e._status || e._status == this.xhr.status) a.push(e), b.push(f)
        }
        this.fails = a;
        this.dones = b
    },
    status: function(a, b) {
        b._status = a;
        return this.fail(b)
    },
    abort: function(a) {
        return this.status(0, a)
    }
});
var $ajax = new XHR,
    $ajaxBackground = new XHRBackground;
History = $class(Object, {
    init: function() {
        this.breadcrumb = []
    },
    push: function(a, b) {
        var c = this.searchCheckPoint(b);
        if (-1 != c && b) return this.breadcrumb.splice(c + 1, this.breadcrumb.length), this.breadcrumb[c];
        a.isCheckPoint = b;
        this.breadcrumb.push(a);
        return a
    },
    popFragment: function(a) {
        a = this.searchCheckPoint(a) + 1;
        0 == a && (a = this.breadcrumb.length - 1);
        return this.breadcrumb.splice(a, this.breadcrumb.length)
    },
    searchCheckPoint: function(a) {
        if (1 >= this.breadcrumb.length) return -1;
        var b = this.breadcrumb.length - 2;
        do var c =
            this.breadcrumb[b--]; while (c && (a && "LAST" != a && c.isCheckPoint != a || "LAST" == a && !c.isCheckPoint || "NO_BACK" != a && "NO_BACK" == c.isCheckPoint));
        return b + 1
    },
    peek: function() {
        return this.breadcrumb[this.breadcrumb.length - 1]
    },
    isEmpty: function() {
        return 0 == this.breadcrumb.length
    },
    length: function() {
        return this.breadcrumb.length
    },
    item: function(a) {
        return this.breadcrumb[a]
    },
    addFragment: function(a) {
        this.breadcrumb = this.breadcrumb.concat(a)
    }
});
PageManager = $class(Object, {
    INITIAL_TEMPLATE: "layout",
    init: function() {
        this.empty = !0;
        this.initialized = !1;
        this.history = new History;
        this.bufferEvents = new BufferEvents;
        this.onChangePage = new Topic;
        this.controllerFactory = new CtrlFactory;
        this.context = {}
    },
    clear: function(a) {
        this.empty = !0;
        this.initialized = !1;
        if (a) this.history = new History;
        else {
            a = this.history;
            for (var b = a.peek(); b && b.popupName;) a.popFragment(), b = a.peek()
        }
        $template.clearNode(document.body)
    },
    initLayout: function() {
        if (!this.initialized) {
            var a = $template.load(this.INITIAL_TEMPLATE);
            $template.setIntoNode(document.body, a);
            $layout = $id("layout").ctrl;
            $content = $layout.getPage();
            $popup = $layout.getPopup();
            this.initialized = !0
        }
    },
    newContext: function(a, b, c) {
        return {
            pageName: a,
            popupName: b,
            isPopup: !!b,
            data: c,
            deferred: new Deferred
        }
    },
    open: function(a, b, c, d) {
        if (window.$layout && $layout.inTransition()) return this.revertChangePage();
        this.context = this.newContext(a, null, b);
        this.beforeChangePage();
        this.history.push(this.context, c);
        a = $template.load(a, b);
        this.empty ? (this.empty = !1, !this.initialized &&
            this.initLayout(), $layout.setFirstPage(a), this.animation = null) : this.animation = $layout.transformContent(a, d || AnimSlideLeft);
        this.afterChangePage();
        return this.context.deferred
    },
    popup: function(a, b, c, d) {
        if ($layout.inTransition()) return this.revertChangePage();
        var e = this.history.peek();
        this.context = this.newContext(e.pageName, a, b);
        this.beforeChangePage();
        this.context.controllers = {};
        this.context.controllers.__proto__ = e.popupName ? e.controllers.__proto__ : e.controllers;
        this.history.push(this.context, c);
        a =
            $template.load(a, b);
        this.animation = $layout.transformPopup(a, d || (e.popupName ? AnimSlideLeft : AnimSlideUp));
        this.afterChangePage();
        return this.context.deferred
    },
    back: function(a, b, c) {
        if (!(1 >= this.history.length())) {
            var d = $event.bufferEvents.firstEvent;
            d && "ok" == $keysMap[d.keyCode] && ($keysMap.getKeysMap = $keysMap.getKeyNameSwapOkBack);
            this._deadMeat = this.history.popFragment($layout.inTransition() ? "NO_BACK" : b);
            b = this._deadMeat[this._deadMeat.length - 1];
            d = this.history.peek();
            d.data = a || d.data;
            this.context = d;
            if ($layout.inTransition()) return $layout.revert(d.popupName);
            this.beforeChangePage();
            d.pageName != b.pageName ? (d.popupName && (a = $template.load(d.popupName, d.data), $layout.setPopup(a)), a = $template.load(d.pageName, d.data), this.animation = $layout.transformContent(a, c || AnimSlideRight)) : d.popupName ? (a = $template.load(d.popupName, d.data), this.animation = $layout.transformPopup(a, c || AnimSlideRight)) : this.animation = $layout.transformPopup("", c || AnimSlideDown);
            c = b.deferred;
            this.animation.done(c.resolve.bind(c)).fail(c.reject.bind(c));
            this.afterChangePage()
        }
    },
    reload: function() {
        if (this.context.popupName) {
            var a = $template.load(this.context.popupName, this.context.data);
            $layout.setPopup(a)
        }
        a = $template.load(this.context.pageName, this.context.data);
        $layout.set(a);
        $activeElement && ($activeElement = $id($activeElement.id))
    },
    publishLeavePage: function() {
        this.onChangePage.publish("onLeavePage", this.context.popupName || this.context.pageName)
    },
    publishEnterPage: function() {
        this.onChangePage.publish("onEnterPage", this.context.popupName || this.context.pageName)
    },
    loadControllers: function(a) {
        this.controllerFactory.loadControllers(a, this.context)
    },
    revertChangePage: function() {
        this.publishLeavePage();
        this.history.addFragment(this._deadMeat);
        this.context = this.history.peek();
        $layout.revert(this.context.popupName);
        $popup = $layout.getPopup();
        return this.context.deferred
    },
    beforeChangePage: function() {
        this.publishLeavePage()
    },
    afterChangePage: function() {
        var a = this,
            b = function() {
                a._deadMeat = null;
                a.animation = null;
                a.publishEnterPage();
                $keysMap.getKeysMap = $keysMap.getDefaultKeyName
            };
        this.animation ? this.animation.always(b) : b();
        $popup = $layout.getPopup()
    },
    onSetFocus: function() {
        if (!this.history.isEmpty()) {
            var a = (this.history.peek().popupName ? $layout.getPopupContent() : $layout.getPageContent()).children[0];
            a && "true" == a.dataset.persistFocus && $focus.setPersist(a)
        }
    },
    isFirstInHistory: function() {
        return $layout.inTransition() ? !1 : -1 == this.history.searchCheckPoint()
    }
});
BaseCtrl = $class(Object, {
    blur: function(a) {
        a = this.node;
        var b = a.dataset;
        b.focusMemento && $focus.setMemento(a, b.focusMemento)
    },
    focus: function(a) {
        if (a.target === this.node && (a = this.node.dataset.firstFocus)) return (a = $id(a)) && ($focus.set(a) || !1)
    },
    hasFocus: function() {
        var a = this.node;
        return a === $activeElement || a.contains($activeElement)
    },
    _focusNext: function(a, b, c) {
        if (a.dataset && (a = a.dataset[b]) && (a = $id(a))) return $focus.set(a, c) || !1
    },
    left: function(a, b, c) {
        return this._focusNext(a, "navLeft", c)
    },
    up: function(a, b,
        c) {
        return this._focusNext(a, "navUp", c)
    },
    right: function(a, b, c) {
        return this._focusNext(a, "navRight", c)
    },
    down: function(a, b, c) {
        return this._focusNext(a, "navDown", c)
    },
    isAttached: function() {
        return this.node ? this.node.isAttached() : !1
    }
});
TransitionCtrl = $class(BaseCtrl, {
    load: function() {
        this.currentSlot = 0;
        this.groupName = this.node.dataset.transformGlGroup
    },
    focus: function(a) {
        if (!1 === this.parent(a)) return !1;
        if (a.target == this.node) return $focus.set(this.node.children[this.currentSlot].children[0]), !1
    },
    set: function(a) {
        var b = this.crtNode();
        $template.setIntoNode(b, a)
    },
    crtNode: function() {
        return this.node.children[this.currentSlot]
    },
    otherNode: function() {
        return this.node.children[(this.currentSlot + 1) % 2]
    },
    _clear: function(a) {
        $template.clearNode(a)
    },
    _exit: function(a) {
        this.hasFocus() && ($focus.hide(), $focus.set(a.children[0]))
    },
    _enter: function(a) {
        this.hasFocus() && a.children[0] && "false" !== a.children[0].dataset.showFocus && $focus.show()
    },
    getNodeWithIds: function(a) {
        for (var b = a.length, c = [], d = 0; d < b; ++d) {
            var e = $id(a[d]);
            e && c.push(e)
        }
        return c
    },
    getNodeWithGL: function(a) {
        if (a = a.children[0]) {
            if (this.groupName) {
                var b = a.querySelectorAll('[data-gl-group~="' + this.groupName + '"]');
                if (b.length) return b
            }
            return [a]
        }
    },
    transform: function(a, b, c, d, e) {
        var f = this.crtNode();
        this.currentSlot = (this.currentSlot + 1) % 2;
        var g = this.node.children[this.currentSlot];
        if (this.animation) return this._exit(g), this.animation.revert(), this.animation;
        var h = this;
        this.set(a);
        this._exit(g);
        var f = c ? this.getNodeWithIds(c) : this.getNodeWithGL(f),
            g = d ? this.getNodeWithIds(d) : this.getNodeWithGL(g),
            k = Array.apply(null, arguments);
        k.splice(0, 5);
        k = [null, f, g].concat(k);
        this.animation = (new(b.bind.apply(b, k))).done(function() {
            h._clear(h.node.children[(h.currentSlot + 1) % 2]);
            h._enter(h.node.children[h.currentSlot]);
            h.animation = null
        });
        !0 !== e && $event.waitDeferredForNextEvent(this.animation);
        return this.animation
    },
    wait: function() {
        var a = new Deferred,
            b = this,
            c = this.currentSlot;
        this.animation.done(function() {
            c === b.currentSlot ? a.resolve() : a.reject()
        });
        return a
    },
    inTransition: function() {
        return !!this.animation
    },
    revert: function() {
        return this.transform()
    },
    up: function() {
        return this.parent(this.node)
    },
    down: function() {
        return this.parent(this.node)
    },
    left: function() {
        return this.parent(this.node)
    },
    right: function() {
        return this.parent(this.node)
    }
});
LayoutCtrl = $class(TransitionCtrl, {
    getPage: function() {
        return this.node
    },
    getPageContent: function(a) {
        return $id("page" + (this.currentSlot + (a || 0)) % 2 + "-content")
    },
    getPopupBackground: function(a) {
        return $id("popup" + (this.currentSlot + (a || 0)) % 2 + "-background")
    },
    getPopup: function(a) {
        return $id("popup" + (this.currentSlot + (a || 0)) % 2)
    },
    getPopupContent: function(a) {
        var b = (this.currentSlot + (a || 0)) % 2;
        a = this.getPopup(a).ctrl;
        return $id("popup" + b + "-content" + a.currentSlot)
    },
    inTransition: function() {
        var a = this.getPopup();
        return this.parent() || a && a.ctrl.inTransition()
    },
    set: function(a) {
        var b = this.getPageContent();
        $template.setIntoNode(b, a)
    },
    revert: function(a) {
        if (this.animation) {
            var b = this.getPageContent(1).children[0],
                c = this.getPopup(1);
            this.parent();
            $focus.set(a ? c : b)
        } else b = this.getPageContent().children[0], c = this.getPopup(), c.ctrl.revert(), $focus.set(a ? c : b), this.popupBgAnimation && this.popupBgAnimation.revert()
    },
    _clear: function(a) {
        $template.clearNode(a.children[0])
    },
    _exit: function(a) {
        this.hideFocus()
    },
    _enter: function(a) {
        this.showFocus()
    },
    hideFocus: function() {
        $focus.hide()
    },
    showFocus: function(a) {
        var b = this.getPopup().ctrl.hasFocus(),
            c = this.getPageContent(),
            d = this.getPopupContent();
        (!b && "false" !== c.children[0].dataset.showFocus || b && "false" !== d.children[0].dataset.showFocus) && $focus.show(a)
    },
    getNodeWithGL: function(a) {
        var b = this.parent(a.children[0]);
        a = [a.children[1]];
        for (var c = b.length, d = 0; d < c; d++) a.push(b[d]);
        return a
    },
    transformContent: function(a, b) {
        var c = this;
        if ("none" == b) {
            this.hideFocus();
            this.set(a);
            var d = this.getPageContent(),
                e =
                this.getPopup().ctrl.hasFocus();
            !e && $focus.set(d.children[0]);
            this.showFocus(!0);
            return (new Deferred).resolve()
        }
        this.transform(a, b);
        d = this.getPageContent();
        e = this.getPopup().ctrl.hasFocus();
        !e && $focus.set(d.children[0]);
        return this.wait().always(function() {
            var a = c.getPopup(1).ctrl,
                b = c.getPopupContent(1);
            a._clear(b);
            a = c.getPopupBackground(1);
            c.transformPopupBg(a, !1, "none")
        })
    },
    transformPopup: function(a, b) {
        var c = this.getPageContent().children[0],
            d = this.getPopup(),
            e = d.ctrl,
            f = this.getPopupBackground();
        this.hideFocus();
        if ("none" == b) return e.set(a), this.transformPopupBg(f, "" != a, b), $focus.set("" == a ? c : d), this.showFocus(!0), (new Deferred).resolve();
        $focus.set("" == a ? c : d);
        e.transform(a, b);
        this.transformPopupBg(f, "" != a, b);
        return e.wait().always(this.showFocus.bind(this))
    },
    setPopup: function(a) {
        var b = this.getPopup(1);
        b || (b = this.getPopup(0));
        var c = b.ctrl,
            d = this.getPopupBackground(1);
        d || (d = this.getPopupBackground(0));
        c.set(a);
        $focus.set(b);
        this.transformPopupBg(d, !0, "none")
    },
    setFirstPage: function(a) {
        this.set(a);
        a = this.getPageContent().children[0];
        $focus.set(a);
        this.showFocus()
    },
    transformPopupBg: function(a, b, c) {
        var d = window.getComputedStyle(a).opacity;
        if (!(b && 0 != d || !b && 0 == d)) {
            var e = this;
            b = b ? "in" : "out";
            "none" == c ? AnimFadePopupMask.prototype.instantFade(a, b) : this.popupBgAnimation = (new AnimFadePopupMask(a, b)).done(function() {
                e.popupBgAnimation = null
            })
        }
    }
});
PageCtrl = $class(BaseCtrl, {
    back: function() {
        $page.isFirstInHistory() ? window.$appManager && $appManager.requestCloseApp() : $page.back()
    }
});
FocusCtrl = $class(Object, {
    BORDER_IMAGE_WIDTH: 28,
    BORDER_IMAGE_OUTSET: 12,
    MIN_FR_SIZE: 6,
    _crtBIWidth: 0,
    init: function() {
        this.biAdjustThreshold = 2 * (this.BORDER_IMAGE_WIDTH - this.BORDER_IMAGE_OUTSET);
        this.isHidden = !0
    },
    load: function() {
        $focus.register(this);
        this._crtBIWidth = 0
    },
    onSetFocus: function(a, b, c) {
        "false" == a.dataset.showFocus ? (this.onHideFocus(), this.isForceHidden = !0) : "false" !== a.dataset.showFocus && this.isForceHidden ? (this.onShowFocus(a, b), this.isForceHidden = !1) : this.move(a, b)
    },
    onShowFocus: function(a, b) {
        (this.isHidden ||
            b) && "false" != a.dataset.showFocus && (this.isHidden = !1, this.move(a, b || "show"))
    },
    onHideFocus: function(a, b, c) {
        a = this.node.style;
        this.isHidden = !0;
        this.isForceHidden = !1;
        a.transition = "none";
        a.opacity = "0"
    },
    move: function(a, b) {
        window.DEBUG_MODE && !a.id && logError("Error, the focused node must have an identifier !", a);
        if (!this.isHidden) {
            this.animation = b;
            var c = this.node,
                d = c.style,
                e = a.bounds || a.getBoundingClientRect(),
                f = e.left,
                g = e.top,
                h = e.width,
                e = e.height;
            if (b == $focus.NO_ANIMATION) this.animation = null, d.transition =
                "none", d.opacity = ".99", this._translate(f, g, h, e), $timeout(0).done(function() {
                    d.transition = null
                });
            else if (b == $focus.SHOW_ANIMATION)
                if (this.animation = null, d.transition = null, d.transitionProperty = "opacity", this._translate(f, g, h, e), "0" == d.opacity) {
                    d.opacity = ".99";
                    var k = function() {
                        d.transitionProperty = null;
                        c.removeEventListener("transitionend", k, !1)
                    };
                    c.addEventListener("transitionend", k, !1)
                } else $timeout(0).done(function() {
                    d.transitionProperty = null
                });
            else this.animation = null, d.transition = null, this._translate(f,
                g, h, e)
        }
    },
    _getFocusBounds: function(a) {
        var b;
        b = this.getBorderWidth();
        var c = b / 2,
            d = a.style;
        d.top && d.left && d.width && d.height ? b = {
            X: parseFloat(d.left) + c,
            Y: parseFloat(d.top) + c,
            W: parseFloat(d.width) - b,
            H: parseFloat(d.height) - b
        } : (a = a.getBoundingClientRect(), b = {
            X: a.left + c,
            Y: a.top + c,
            W: a.width - b,
            H: a.height - b
        });
        return b
    },
    getBorderWidth: function() {
        return 4
    },
    _translate: function(a, b, c, d) {
        var e = this.node.style,
            f = this.getBorderWidth();
        a -= f / 2;
        b -= f / 2;
        c += f;
        d += f;
        c < this.MIN_FR_SIZE && (c = this.MIN_FR_SIZE);
        d < this.MIN_FR_SIZE &&
            (d = this.MIN_FR_SIZE);
        this.adjustFocus(c, d);
        e.left = a + "px";
        e.top = b + "px";
        e.width = c + "px";
        e.height = d + "px"
    },
    adjustFocus: function(a, b) {
        var c = this.node.style,
            d = a < b ? a : b,
            d = d >= this.biAdjustThreshold ? this.BORDER_IMAGE_WIDTH : this.BORDER_IMAGE_WIDTH - (this.biAdjustThreshold + 1 - d >> 1);
        this._crtBIWidth != d && (this._crtBIWidth = d, c.borderImageSlice = d, c.borderImageWidth = d + "px")
    }
});
NotifCtrl = $class(BaseCtrl, {
    NOTIF_HEIGHT: "73",
    NOTIF_ANIM: {
        show: "AnimSlideDown",
        hide: "AnimSlideUp"
    },
    DURATION: .8,
    DEFAULT_HIDE_TIMEOUT: 3500,
    MAX_CHARS_PER_FONT_SIZE: [115, 130, 145],
    init: function() {
        this.showInfo = this._display.bind(this, "show", "info");
        this.showWarning = this._display.bind(this, "show", "warning");
        this.showError = this._display.bind(this, "show", "error");
        this.hide = this._display.bind(this, "hide", null, null);
        this.hideLater = this._display.bind(this, "hide", null, null, this.DEFAULT_HIDE_TIMEOUT)
    },
    _display: function(a,
        b, c, d) {
        this.timer && this.timer.cancel();
        if (d) this.timer = $timeout(d).done(this._display.bind(this, a, b, c, 0));
        else if (this.anim) this.anim.done(this._display.bind(this, a, b, c));
        else {
            var e, f;
            d = this.node;
            var g = this.node.style,
                h = "";
            "show" === a ? (g.display = "block", d.innerHTML += h = this._createTemplate(b, c), e = [d.lastElementChild]) : f = [d.lastElementChild];
            this.anim = (new window[this.NOTIF_ANIM[a]](f, e, this.NOTIF_HEIGHT, this.DURATION)).done(this.onAnimEnd.bind(this, h, g, a))
        }
    },
    onAnimEnd: function(a, b, c) {
        this.anim = null;
        this.node.innerHTML = a;
        "hide" === c && (b.display = "none")
    },
    _createTemplate: function(a, b) {
        for (var c = $t(b) || "", d = "", e = 0, f = this.MAX_CHARS_PER_FONT_SIZE.length; e < f && !(c.length <= this.MAX_CHARS_PER_FONT_SIZE[e]); e++) d += "s";
        return "<div class='" + a + "'><div class='msg " + d + "'>" + c + "</div></div>"
    }
});
var $screen = {
        width: 1920,
        height: 1080
    },
    $page = new PageManager;
$focus.register($page);
$ctrlFactory = $page;
Animation = $class(Deferred, {
    init: function() {
        this.parent();
        this.param = $arguments2Array(arguments);
        this.players = [];
        this._revert = !1;
        this.animate.apply(this, this.param);
        var a = this.onfinish.bind(this);
        this.players.forEach(function(b) {
            b.onfinish = a
        });
        this.finishCount = this.players.length
    },
    onfinish: function() {
        this.finishCount--;
        this.finishCount || (this.animateEnd.apply(this, this.param), this.resolve.apply(this, this.param))
    },
    animateEnd: $nop,
    revert: function() {
        this._revert = !this._revert;
        this.players.forEach(function(a) {
            a.cancel()
        });
        return this
    },
    cancel: function() {
        this.players.forEach(function(a) {
            a.cancel()
        });
        this.reject.apply(this, this.param);
        return this
    }
});
AnimFade = $class(Animation, {
    DEFAULT_DURATION: 100,
    animate: function(a, b, c, d) {
        var e = this,
            f = [{
                opacity: b
            }, {
                opacity: c
            }],
            g = {
                duration: d || e.DEFAULT_DURATION
            };
        a.forEach(function(a) {
            a = a.animate(f, g);
            e.players.push(a)
        })
    },
    animateEnd: function(a, b, c, d) {
        this._revert || a.forEach(function(a) {
            a.style.opacity = c
        })
    }
});
AnimList = $class(Animation, {
    _tX: function(a) {
        return "translate3d(" + a + "px, 0, 0) "
    },
    _tY: function(a) {
        return "translate3d(0, " + a + "px, 0) "
    },
    initStyle: function(a) {
        var b = a.node.children[0],
            c = a.itemSize;
        a = "vertical" == a.dir ? this._tY : this._tX;
        b.childrenOrdered = [];
        for (var d = 0, e = b.children.length; d < e; d++) b.childrenOrdered[d] = b.children[d];
        b = b.childrenOrdered;
        e = b.length;
        for (d = 0; d < e; d++) {
            var f = b[d],
                g = f.style;
            f.tx = d * c;
            g.transform = a(f.tx);
            g.transition = "none"
        }
    },
    animate: function(a, b, c, d) {
        var e = this,
            f = a.ctrl,
            g = f.dir,
            h = -c * b * f.itemSize,
            k = {
                fill: "forwards",
                duration: d || e.DEFAULT_DURATION
            };
        a.children[0].childrenOrdered.forEach(function(a) {
            var b = a.animate("vertical" == g ? [{
                transform: "translate3d(0, " + a.tx + "px, 0) "
            }, {
                transform: "translate3d(0, " + (a.tx + h) + "px, 0) "
            }] : [{
                transform: "translate3d(" + a.tx + "px, 0, 0) "
            }, {
                transform: "translate3d(" + (a.tx + h) + "px, 0, 0) "
            }], k);
            e.players.push(b);
            a.tx += h
        })
    },
    animateEnd: function(a, b, c) {
        var d = a.children[0],
            e = a.ctrl;
        a = e.itemSize;
        var f = "vertical" == e.dir ? this._tY : this._tX,
            g = d.childrenOrdered,
            h = g.length;
        if (!this._revert) {
            if (0 < c) {
                var k = g.shift();
                g.push(k)
            } else k = g.pop(), d.childrenOrdered = [k].concat(g);
            g = d.childrenOrdered;
            e.onScrollDirty(k, b, c);
            e.onScrollStep(b, c)
        }
        for (b = 0; b < h; b++) c = g[b], d = c.style, c.tx = b * a, d.transform = f(c.tx), d.transition = "none"
    }
});
AnimSwitchList = $class(Animation, {
    initStyle: function(a) {
        var b = a.node.children[0];
        b.childrenOrdered = [];
        for (var c = 0, d = b.children.length; c < d; c++) b.childrenOrdered[c] = b.children[c];
        b = b.childrenOrdered;
        a = a.itemSize;
        c = 0;
        for (d = b.length; c < d; c++) {
            var e = b[c],
                f = e.style;
            e.tx = (c - 1) * a;
            f.transform = "translate3d(" + e.tx + "px, 0, 0)";
            f.transition = "none"
        }
    },
    animate: function(a, b, c, d) {
        var e = this,
            f = -c * b * a.ctrl.itemSize,
            g = {
                fill: "forwards",
                duration: d || e.DEFAULT_DURATION
            };
        a.children[0].childrenOrdered.forEach(function(a) {
            var b =
                a.animate([{
                    transform: "translate3d(" + a.tx + "px, 0, 0) "
                }, {
                    transform: "translate3d(" + (a.tx + f) + "px, 0, 0) "
                }], g);
            e.players.push(b);
            a.tx += f
        })
    },
    animateEnd: function(a, b, c) {
        var d = a.children[0];
        b = d.childrenOrdered;
        a = a.ctrl.itemSize;
        this._revert || (0 < c ? (c = b.shift(), b.push(c)) : (c = b.pop(), d.childrenOrdered = [c].concat(b)));
        b = d.childrenOrdered;
        c = 0;
        for (d = b.length; c < d; c++) {
            var e = b[c],
                f = e.style;
            e.tx = (c - 1) * a;
            f.transform = "translate3d(" + e.tx + "px, 0, 0)";
            f.transition = "none"
        }
    }
});
AnimTranslate = $class(Animation, {
    DEFAULT_DURATION: 1E3,
    animate: function(a, b, c, d, e, f, g, h) {
        b = null !== f && null !== g ? [{
            transform: "translate3d(" + b + "px, " + d + "px, 0) ",
            opacity: f
        }, {
            transform: "translate3d(" + c + "px, " + e + "px, 0) ",
            opacity: g
        }] : [{
            transform: "translate3d(" + b + "px, " + d + "px, 0) "
        }, {
            transform: "translate3d(" + c + "px, " + e + "px, 0) "
        }];
        h = {
            duration: h || this.DEFAULT_DURATION
        };
        c = 0;
        for (d = a.length; c < d; c++) e = a[c].animate(b, h), this.players.push(e)
    }
});
AnimSlideLeft = $class(AnimTranslate, {
    animate: function(a, b, c, d, e) {
        var f = null,
            g = null;
        e && (f = 1, g = 0);
        a && this.parent(a, 0, -(c || $screen.width), 0, 0, f, g, d);
        b && this.parent(b, c || $screen.width, 0, 0, 0, g, f, d)
    }
});
AnimSlideRight = $class(AnimTranslate, {
    animate: function(a, b, c, d, e) {
        var f = null,
            g = null;
        e && (f = 1, g = 0);
        a && this.parent(a, 0, c || $screen.width, 0, 0, f, g, d);
        b && this.parent(b, -(c || $screen.width), 0, 0, 0, g, f, d)
    }
});
AnimSlideDown = $class(AnimTranslate, {
    animate: function(a, b, c, d, e) {
        var f = null,
            g = null;
        e && (f = 1, g = 0);
        a && this.parent(a, 0, 0, 0, c || $screen.width, f, g, d);
        b && this.parent(b, 0, 0, -(c || $screen.width), 0, f, g, d)
    }
});
AnimSlideUp = $class(AnimTranslate, {
    animate: function(a, b, c, d, e) {
        var f = null,
            g = null;
        e && (f = 1, g = 0);
        a && this.parent(a, 0, 0, 0, -(c || $screen.height), f, g, d);
        b && this.parent(b, 0, 0, c || $screen.height, 0, f, g, d)
    }
});
AnimFadePopupMask = $class(AnimFade, {
    DEFAULT_DURATION: 100,
    OPACITY: .72,
    animate: function(a, b) {
        "in" == b ? (a.style.webkitTransform = "scale3D(" + $screen.width + "," + $screen.height + ", 1)", this.parent([a], 0, this.OPACITY, this.DEFAULT_DURATION)) : this.parent([a], this.OPACITY, 0, this.DEFAULT_DURATION)
    },
    instantFade: function(a, b) {
        var c = a.style,
            d = 0;
        "in" == b ? (d = this.OPACITY, c.webkitTransform = "scale3D(" + $screen.width + "," + $screen.height + ", 1)") : c.transform = null;
        c.opacity = d;
        c.transition = "none"
    },
    animateEnd: function(a, b) {
        this._revert ||
            (a.style.opacity = "in" == b ? this.OPACITY : 0)
    }
});
AnimTNT = $class(Animation, {
    DEFAULT_DURATION: 150,
    animate: function(a, b, c) {
        a = a.animate(!0 === c ? "out" == b ? [{
            transform: "scale(1)",
            opacity: 1
        }, {
            transform: "scale(0.8)",
            opacity: 0
        }] : [{
            transform: "scale(1.4)",
            opacity: 0
        }, {
            transform: "scale(1)",
            opacity: 1
        }] : "out" == b ? [{
            transform: "scale(1)",
            opacity: 1
        }, {
            transform: "scale(1.4)",
            opacity: 0
        }] : [{
            transform: "scale(0.8)",
            opacity: 0
        }, {
            transform: "scale(1)",
            opacity: 1
        }], {
            duration: this.DEFAULT_DURATION
        });
        this.players.push(a)
    },
    animateEnd: function(a, b) {
        a.style.opacity = "out" == b ? 0 : 1
    }
});
AnimTNTOpen = $class(AnimTNT, {
    animate: function(a, b) {
        a && this.parent(a[0], "out");
        b && this.parent(b[0], "in")
    },
    animateEnd: function(a, b) {
        a && this.parent(a[0], "out");
        b && this.parent(b[0], "in")
    }
});
AnimTNTBack = $class(AnimTNT, {
    animate: function(a, b) {
        a && this.parent(a[0], "out", !0);
        b && this.parent(b[0], "in", !0)
    },
    animateEnd: function(a, b) {
        a && this.parent(a[0], "out", !0);
        b && this.parent(b[0], "in", !0)
    }
});
AnimNavigate = $class(Animation, {
    DEFAULT_DURATION: 400,
    SLIDE_ANIM_DIR: {
        up: AnimSlideUp,
        down: AnimSlideDown,
        left: AnimSlideLeft,
        right: AnimSlideRight
    },
    animate: function(a, b, c, d) {
        (new this.SLIDE_ANIM_DIR[c](a, b, null, d || this.DEFAULT_DURATION, !0)).done(this.resolve.bind(this, $arguments2Array(arguments))).fail(this.reject.bind(this, $arguments2Array(arguments)))
    }
});
AnimNavigateRight = $class(AnimNavigate, {
    animate: function(a, b, c) {
        this.parent(a, b, "right", c)
    }
});
AnimNavigateLeft = $class(AnimNavigate, {
    animate: function(a, b, c) {
        this.parent(a, b, "left", c)
    }
});
GridCtrl = $class(BaseCtrl, {
    init: function() {
        this.currentCol = this.currentRow = null;
        this.parent()
    },
    load: function() {
        var a = this.node.dataset;
        null == this.currentRow && (this.currentRow = -1);
        null == this.currentCol && (this.currentCol = -1);
        this.exitFocus = !1;
        this.forceFocusRow = a.forceFocusRow;
        this.forceFocusCol = a.forceFocusCol;
        a.gridFocus && this.setGridFocus(JSON.parse(a.gridFocus));
        var b = a.gridLoop,
            a = a.gridVerticalLoop;
        this.loop = b && this[b]();
        this.verticalLoop = a && this[a]()
    },
    setGridFocus: function(a) {
        this.gridFocus = a;
        this.numberRow = this.gridFocus.length;
        this.numberCol = this.gridFocus[0].length
    },
    focus: function(a) {
        if (-1 == this.currentRow && -1 == this.currentCol)
            for (var b = $activeElement.id, c = 0; c < this.numberRow; c++)
                for (var d = 0; d < this.numberCol; d++)
                    if (b == this.gridFocus[c][d]) {
                        this.currentRow = c;
                        this.currentCol = d;
                        break
                    }
        if (a.target == this.node) {
            if (this.forceFocusRow || this.forceFocusCol) return this.currentRow = parseInt(this.forceFocusRow) || 0, this.currentCol = parseInt(this.forceFocusCol) || 0, this.dispatchFocus();
            if (!$focus.lastUserFocusNode) return b =
                this.node.dataset, this.currentRow = parseInt(b.firstFocusRow) || 0, this.currentCol = parseInt(b.firstFocusCol) || 0, this.dispatchFocus();
            d = $focus.lastUserFocusNode;
            b = this.node.getBoundingClientRect();
            c = this.getBoundingClientRect(d);
            a = a.anim;
            if (-1 != this.currentRow && -1 != this.currentCol) {
                if (!d.isAttached()) return this.dispatchFocus();
                var d = this.currentNode(),
                    d = this.getBoundingClientRect(d),
                    e = b.left >= c.right ? 0 == this.currentCol : c.left >= b.right ? this.currentCol == this.numberCol - 1 : d.left < c.right && c.left < d.right;
                if (e =
                    b.top >= c.bottom ? e & 0 == this.currentRow : c.top >= b.bottom ? e & this.currentRow == this.numberRow - 1 : e & (d.top < c.bottom && c.top < d.bottom)) return this.currentRow = "loopBottom" == a ? 0 : "loopTop" == a ? this.numberRow - 1 : this.currentRow, this.currentCol = "loopRight" == a ? 0 : "loopLeft" == a ? this.numberCol - 1 : this.currentCol, this.dispatchFocus()
            }
            var e = b.height / this.numberRow,
                d = b.width / this.numberCol,
                f = c.top + c.height / 2;
            this.currentRow = f <= b.top || "loopBottom" == a ? 0 : f >= b.top + b.height || "loopTop" == a ? this.numberRow - 1 : Math.floor((f - b.top) / e);
            c = c.left + c.width / 2;
            this.currentCol = c <= b.left || "loopRight" == a ? 0 : c >= b.left + b.width || "loopLeft" == a ? this.numberCol - 1 : Math.floor((c - b.left) / d);
            this.dispatchFocus()
        }
        return !1
    },
    getBoundingClientRect: function(a) {
        var b = a.dataset.virtualFocus;
        if (b) {
            var c = {};
            a = a.getBoundingClientRect();
            c.left = -1 != b.indexOf("left") ? 0 : a.left;
            c.right = -1 != b.indexOf("right") ? $screen.width : a.right;
            c.top = -1 != b.indexOf("top") ? 0 : a.top;
            c.bottom = -1 != b.indexOf("bottom") ? $screen.height : a.bottom;
            c.width = c.right - c.left;
            c.height = c.bottom - c.top;
            return c
        }
        return a.virtualBoundingClientRect ? a.virtualBoundingClientRect() : a.getBoundingClientRect()
    },
    focusNode: function(a, b) {
        this.currentRow = a;
        this.currentCol = b;
        this.dispatchFocus()
    },
    dispatchFocus: function(a) {
        var b = this.currentNode(),
            c = this;
        b.virtualBoundingClientRect = b.virtualBoundingClientRect || function() {
            var a = b.getBoundingClientRect(),
                e = c.colspanLeft(b),
                f = c.colspanRight(b),
                g = c.rowspanUp(b),
                h = c.rowspanDown(b),
                k = {};
            k.height = a.height / (g + 1 + h);
            k.width = a.width / (e + 1 + f);
            k.left = a.left + e * k.width;
            k.right =
                a.right - f * k.width;
            k.top = a.top + g * k.height;
            k.bottom = a.bottom - h * k.height;
            return k
        };
        a ? ($focus.hide($focus.NO_ANIMATION), $focus.set(b, $focus.NO_ANIMATION), $focus.show()) : $focus.set(b);
        return !1
    },
    getNode: function(a, b) {
        return $id(this.gridFocus[a][b])
    },
    currentNode: function() {
        return this.getNode(this.currentRow, this.currentCol)
    },
    rowspanUp: function(a) {
        for (var b = 0, c = this.currentRow - 1; 0 <= c && a.id == this.gridFocus[c][this.currentCol]; c--) b++;
        return b
    },
    rowspanDown: function(a) {
        for (var b = 0, c = this.currentRow + 1; c < this.numberRow &&
            a.id == this.gridFocus[c][this.currentCol]; c++) b++;
        return b
    },
    colspanLeft: function(a) {
        for (var b = 0, c = this.currentCol - 1; 0 <= c && a.id == this.gridFocus[this.currentRow][c]; c--) b++;
        return b
    },
    colspanRight: function(a) {
        for (var b = 0, c = this.currentCol + 1; c < this.numberCol && a.id == this.gridFocus[this.currentRow][c]; c++) b++;
        return b
    },
    up: function() {
        var a, b = this.currentNode(),
            b = this.rowspanUp(b);
        if (0 == this.currentRow - b)
            if (this.verticalLoop) a = "loopUp", this.verticalLoop.up.call(this);
            else return this.parent(this.node);
        else this.currentRow -=
            b + 1;
        this.dispatchFocus(a);
        return !1
    },
    down: function() {
        var a, b = this.currentNode(),
            b = this.rowspanDown(b);
        if (this.currentRow + b == this.numberRow - 1)
            if (this.verticalLoop) a = "loopDown", this.verticalLoop.down.call(this);
            else return this.parent(this.node);
        else this.currentRow += b + 1;
        this.dispatchFocus(a);
        return !1
    },
    left: function() {
        var a, b = this.currentNode(),
            b = this.colspanLeft(b);
        if (0 == this.currentCol - b)
            if (this.loop) a = "loopLeft", this.loop.left.call(this);
            else return this.parent(this.node);
        else this.currentCol -= b +
            1;
        this.dispatchFocus(a);
        return !1
    },
    right: function() {
        var a, b = this.currentNode(),
            b = this.colspanRight(b);
        if (this.currentCol + b == this.numberCol - 1)
            if (this.loop) a = "loopRight", this.loop.right.call(this);
            else return this.parent(this.node);
        else this.currentCol += b + 1;
        this.dispatchFocus(a);
        return !1
    },
    normal: function() {
        return {
            left: function() {
                this.currentCol = this.numberCol - 1
            },
            right: function() {
                this.currentCol = 0
            },
            up: function() {
                this.currentRow = this.numberRow - 1
            },
            down: function() {
                this.currentRow = 0
            }
        }
    },
    spiral: function() {
        return {
            left: function() {
                this.currentCol =
                    this.numberCol - 1;
                0 == this.currentRow ? this.currentRow = this.numberRow - 1 : this.currentRow--
            },
            right: function() {
                this.currentCol = 0;
                this.currentRow == this.numberRow - 1 ? this.currentRow = 0 : this.currentRow++
            },
            up: function() {
                this.currentRow = this.numberRow - 1
            },
            down: function() {
                this.currentRow = 0
            }
        }
    }
});
ListCtrl = $class(BaseCtrl, {
    EMPTY_ITEM_PREFIX: "empty_",
    init: function() {
        this.scrollTopic = new Topic;
        this.parent()
    },
    load: function(a) {
        var b = this.node.dataset;
        if (!a) {
            a = [];
            var c = b.values;
            if (c) try {
                a = JSON.parse(c)
            } catch (d) {
                logError("Error while parsing parameters " + c)
            }
        }
        this.values = a;
        this.enabledPadding = "true" == b.enabledPadding ? 2 : 1;
        this.enabledPagination = "true" == b.enabledPagination ? 1 : 0;
        this.enabledFilling = "true" == b.enabledFilling ? 1 : 0;
        this.persitsFocus = "true" == b.persitsFocus ? 1 : 0;
        this.focusMemento = b.focusMemento;
        this.dir = b.dir || "vertical";
        this.nodePrefix = this.node.id + "_";
        "vertical" == this.dir ? (this.bufferEvent = BufferEvents.OPPOSITE_MODE_UP_DOWN, this.up = this.previous.bind(this, this.up), this.down = this.next.bind(this, this.down), this.bufferEventPage = BufferEvents.OPPOSITE_MODE_PAGE_UP_PAGE_DOWN, this.enabledPagination && (this.pageUp = this.pagePrevious.bind(this, this.pageUp), this.pageDown = this.pageNext.bind(this, this.pageDown))) : (this.bufferEvent = BufferEvents.OPPOSITE_MODE_LEFT_RIGHT, this.left = this.previous.bind(this,
            this.left), this.right = this.next.bind(this, this.right), this.bufferEventPage = BufferEvents.OPPOSITE_MODE_PAGE_LEFT_PAGE_RIGHT, this.enabledPagination && (this.pageLeft = this.pagePrevious.bind(this, this.pageLeft), this.pageRight = this.pageNext.bind(this, this.pageRight)));
        this.itemSize = parseFloat("vertical" == this.dir ? b.itemHeight : b.itemWidth);
        this.visibleSize = parseInt(b.size) || 5;
        this.dataSize = this.getDataSize();
        this.persitsFocus && (this.dataIndex = $storage.get("focus-" + this.node.id + "-dataIndex"), this.visibleIndex =
            $storage.get("focus-" + this.node.id + "-visibleIndex"), this.selectedIndex = $storage.get("selected-" + this.node.id + "-selectedIndex"));
        this.focusMemento && (a = $focus.getMemento(this.node)) && (this.dataIndex = a.dataIndex, this.visibleIndex = a.visibleIndex);
        this.setDataIndex(this.dataIndex);
        this.disabledScrollFilling = !1;
        this.enabledFilling && this.dataSize < this.visibleSize + this.enabledPadding - 1 && (this.dataSize = this.visibleSize, this.disabledScrollFilling = !0);
        this.inlineTemplate = this.inlineTemplate || this.node.innerHTML;
        this.templateId = null;
        null != this.inlineTemplate.match(/^\s*$/) && (this.inlineTemplate = null, this.templateId = b.template || "list_item");
        this.node.classList.add("list");
        $template.clearNode(this.node);
        this.container = document.createElement("div");
        this.container.classList.add(this.dir);
        this.node.appendChild(this.container);
        b = "";
        a = this.dataIndex - this.visibleIndex;
        for (var c = this.dataSize > this.visibleSize ? this.visibleSize + this.enabledPadding : this.dataSize, e = -this.enabledPadding; e < c; e++) b += this.getItemNode(a + e);
        $template.setIntoNode(this.container, b);
        AnimList.prototype.initStyle(this);
        this.publishScroll();
        this.hasFocus() && $activeElement === this.node && this.dispatchFocus()
    },
    setDataIndex: function(a) {
        this.dataIndex = a;
        null == this.dataIndex ? this.visibleIndex = this.dataIndex = 0 : (0 < this.dataSize && (this.dataIndex >= this.dataSize && (this.dataIndex = this.dataSize - 1), this.dataSize <= this.visibleSize && this.dataIndex != this.visibleIndex && (this.visibleIndex = this.dataIndex)), null == this.visibleIndex && (this.visibleIndex = this.dataIndex <
            this.visibleSize ? this.dataIndex : this.dataSize - this.dataIndex < this.visibleSize ? this.visibleSize - (this.dataSize - this.dataIndex) : 0))
    },
    select: function(a) {
        this.unselect();
        var b = this.container.querySelector("[data-index='" + this.nodePrefix + a + "']");
        b && b.classList.add("selected");
        this.selectedIndex = a;
        $storage.setRaw("selected-" + this.node.id + "-selectedIndex", this.selectedIndex)
    },
    unselect: function() {
        var a = this.container.querySelector("[data-index='" + this.nodePrefix + this.selectedIndex + "']");
        a && a.classList.remove("selected");
        this.selectedIndex = null
    },
    getDataTemplate: function(a, b) {
        return this.templateId
    },
    getDataSize: function() {
        return this.values.length
    },
    getData: function(a) {
        return this.values[a]
    },
    getCurrentData: function() {
        return this.values[this.dataIndex]
    },
    getItemNode: function(a) {
        var b = this.getData(a);
        if ("undefined" == typeof b) var b = this.getEmptyData(a),
            c = this.EMPTY_ITEM_PREFIX + a,
            d = 0 > a || a >= this.dataSize && !this.enabledFilling ? "empty end" : "empty";
        else d = "", c = this.nodePrefix + a;
        c = {
            data: b,
            index: c,
            className: d
        };
        return (a = this.getDataTemplate(b,
            a)) ? $template.load(a, c) : $template.compile(this.inlineTemplate, c)
    },
    getEmptyData: function() {
        return {}
    },
    up: function() {
        return this.parent(this.node)
    },
    down: function() {
        return this.parent(this.node)
    },
    right: function() {
        return this.parent(this.node)
    },
    left: function() {
        return this.parent(this.node)
    },
    pageUp: function() {
        return this.parent(this.node)
    },
    pageDown: function() {
        return this.parent(this.node)
    },
    pageRight: function() {
        return this.parent(this.node)
    },
    pageLeft: function() {
        return this.parent(this.node)
    },
    previous: function(a) {
        if (0 ==
            this.dataIndex) return a.call(this);
        this.animation || 0 == this.visibleIndex ? this.scroll(1, -1, this.bufferEvent) : (this.dataIndex--, this.visibleIndex--, this.endMove());
        return !1
    },
    next: function(a) {
        if (this.dataIndex == this.dataSize - 1) return a.call(this);
        this.animation || this.visibleIndex == this.visibleSize - 1 ? this.scroll(1, 1, this.bufferEvent) : (this.dataIndex++, this.visibleIndex++, this.endMove());
        return !1
    },
    pagePrevious: function(a) {
        if (0 == this.dataIndex) return a.call(this);
        a = this.visibleSize;
        this.dataIndex - this.visibleIndex <
            a && (a = this.dataIndex - this.visibleIndex);
        this.scroll(a, -1, this.bufferEventPage);
        return !1
    },
    pageNext: function(a) {
        if (this.dataIndex == this.dataSize - 1) return a.call(this);
        a = this.visibleSize;
        this.dataSize - this.dataIndex - this.visibleSize + this.visibleIndex < a && (a = this.dataSize - this.dataIndex - this.visibleSize + this.visibleIndex);
        this.scroll(a, 1, this.bufferEventPage);
        return !1
    },
    scroll: function(a, b) {
        if (0 >= a || this.disabledScrollFilling) return !1;
        if (this.animation) return this.scrollDir != b ? this.scrollDir = b : this.continueScroll = !0, !1;
        this.dataIndex += b * a;
        this.inScroll = !0;
        this.scrollDir = b;
        this.animation = (new AnimList(this.node, a, b, 200)).done(this.onScroll.bind(this, a, b));
        return !0
    },
    onScroll: function(a, b) {
        if (this.continueScroll) this.dataIndex += b * a, this.animation = (new AnimList(this.node, a, b, 100)).done(this.onScroll.bind(this, a, b));
        else this.onScrollFinish()
    },
    onScrollDirty: function(a, b, c) {
        a.classList.add("dirty");
        a.classList.remove("end")
    },
    onScrollStep: function(a, b) {
        this.dataIndex - this.visibleIndex >= a && this.dataSize - this.dataIndex -
            this.visibleSize + this.visibleIndex >= a ? this.publishScroll() : this.continueScroll = !1
    },
    onScrollFinish: function() {
        this.continueScroll = !1;
        this.animation = null;
        this.inScroll = !1;
        this.publishScroll();
        this._scrollEnd()
    },
    _scrollEnd: function() {
        var a = this.hasFocus();
        this.cleanNode();
        a && this.dispatchFocus();
        this.persistsFocus()
    },
    endMove: function() {
        this.hasFocus() && this.dispatchFocus();
        this.persistsFocus()
    },
    persistsFocus: function() {
        this.persitsFocus && ($storage.setRaw("focus-" + this.node.id + "-dataIndex", this.dataIndex),
            $storage.setRaw("focus-" + this.node.id + "-visibleIndex", this.visibleIndex))
    },
    add: function(a, b) {
        var c = this.hasFocus();
        this.values && this.values.splice(a, 0, b);
        this.dataSize = this.getDataSize();
        this.endUpdate(c);
        return (c = this.container.querySelector("[data-index='" + this.nodePrefix + a + "']")) ? new AnimFade([c], 0, 1) : (new Deferred).resolve()
    },
    remove: function(a) {
        var b = this,
            c = this.hasFocus();
        this.values && this.values.splice(a, 1);
        this.dataSize = this.getDataSize();
        this.selectedIndex == this.dataSize && (this.selectedIndex--,
            0 > this.selectedIndex && (this.visibleIndex = 0));
        this.dataSize - this.dataIndex + this.visibleIndex < this.visibleSize && (this.dataIndex--, 0 > this.dataIndex && (this.dataIndex = 0), this.dataIndex < this.visibleIndex && (this.visibleIndex--, 0 > this.visibleIndex && (this.visibleIndex = 0)));
        var d = this.container.querySelector("[data-index='" + this.nodePrefix + a + "']");
        if (d) return (new AnimFade([d], 1, 0)).done(function() {
            b.container.removeChild(d);
            b.endUpdate(c)
        });
        this.endUpdate(c);
        return (new Deferred).resolve()
    },
    endUpdate: function(a) {
        for (var b =
                "", c = this.dataIndex - this.visibleIndex, d = this.dataSize > this.visibleSize ? this.visibleSize + this.enabledPadding : this.dataSize, e = -this.enabledPadding; e < d; e++) b += this.getItemNode(c + e);
        $template.setIntoNode(this.container, b);
        a && !this.dispatchFocus() && $focus.set(this.node);
        this.publishScroll();
        this.select(this.selectedIndex)
    },
    publishScroll: function() {
        var a = this.scrollTopic;
        a.set = !0;
        a.items = this.getDataSize() - this.visibleSize + 1;
        a.crt = this.dataIndex - this.visibleIndex;
        a.publish()
    },
    focus: function(a) {
        a.target ==
            this.node && this.dispatchFocus();
        return !1
    },
    blur: function(a) {
        if (this.focusMemento) return a = $focus.setMemento(this.node, this.focusMemento), a.dataIndex = this.dataIndex, a.visibleIndex = this.visibleIndex, !0
    },
    dispatchFocus: function() {
        if (this.container && this.container.isAttached()) {
            var a = this.container.querySelector("[data-index='" + this.nodePrefix + this.dataIndex + "']");
            $focus.set(a);
            return a
        }
    },
    cleanNode: function() {
        for (var a = "", b = this.dataIndex - this.visibleIndex, c = this.dataSize > this.visibleSize ? this.visibleSize +
                this.enabledPadding : this.dataSize, d = this.container.childrenOrdered, e = this.container.children, f = e.length, g = 0, h = [], k = -this.enabledPadding; k < c; k++) {
            var l = k + this.enabledPadding,
                m = d[l];
            m.classList.contains("dirty") && (a = this.getItemNode(b + k), this.container.insertAdjacentHTML("beforeend", a), a = e[f + g], a.style.transform = m.style.transform, a.tx = m.tx, d.splice(l, 1, a), $page.loadControllers(a), g++, h.push(m))
        }
        f = h.length;
        for (k = 0; k < f; k++) m = h[k], this.container.removeChild(m)
    },
    keyUp: function(a, b) {
        this.continueScroll = !1
    },
    waitForScrollToFinish: function() {
        return this.inScroll ? this.scrollTopic.subscribe().done(this.waitForScrollToFinish.bind(this)) : (new Deferred).resolve()
    }
});
GroupListCtrl = $class(ListCtrl, {
    DEFAULT_GROUP_SIZE: 6,
    colIndex: 0,
    load: function(a) {
        $template.clearNode(this.node);
        var b = this.node.dataset;
        this.groupsSize = b.groupsSize || this.DEFAULT_GROUP_SIZE;
        this.enableContinuousMove = "true" == b.enableContinuousMove ? 1 : 0;
        b.dir = "vertical";
        if (!a && (a = [], b = b.values)) try {
            a = JSON.parse(b)
        } catch (c) {
            logError("Error while parsing parameters " + b)
        }
        for (var d, b = [], e = 0, f = a.length; e < f; e++) {
            var g = a[e];
            0 == e % this.groupsSize ? (d = {
                items: [g]
            }, b.push(d)) : d.items.push(g)
        }
        this.parent(b)
    },
    getItemNode: function(a) {
        var b =
            this.getData(a);
        if ("undefined" == typeof b) var b = this.getEmptyData(a),
            c = this.EMPTY_ITEM_PREFIX + a,
            d = 0 > a || a >= this.dataSize && !this.enabledFilling ? "empty end" : "empty";
        else d = "", c = this.nodePrefix + a;
        for (var b = b && b.items || [], c = "<div class='items_group " + d + "' id='" + c + "' data-index='" + this.nodePrefix + a + "'>", d = 0, e = b.length; d < e; d++) c += this.getGroupItemNode(a, d, b[d]);
        if (b.length < this.groupsSize && this.enabledFilling)
            for (d = b.length; d < this.groupsSize; d++) c += this.getGroupItemNode(a, d, this.getEmptyGroupData(), "empty");
        return c + "</div>"
    },
    getGroupItemNode: function(a, b, c, d) {
        var e = "";
        a = {
            data: c,
            index: this.nodePrefix + a + "-" + b,
            className: d || ""
        };
        return e = (b = this.getDataTemplate(c, b)) ? $template.load(b, a) : $template.compile(this.inlineTemplate, a)
    },
    getEmptyGroupData: function() {
        return {}
    },
    right: function() {
        var a = this.enabledFilling ? this.groupsSize : this.getCurrentData().items.length;
        if (this.colIndex < a - 1) this.colIndex++, this.dispatchFocus();
        else if (this.enableContinuousMove && this.dataIndex < this.getDataSize() - 1) this.colIndex = 0, this.next(this.down);
        else return this.parent(), !0;
        return !1
    },
    left: function() {
        if (0 < this.colIndex) this.colIndex--, this.dispatchFocus();
        else if (this.enableContinuousMove && 0 < this.dataIndex) this.colIndex = this.groupsSize - 1, this.previous(this.up);
        else return this.parent(), !0;
        return !1
    },
    dispatchFocus: function() {
        if (this.values && this.values.length) {
            this.dataSize <= this.dataIndex && (this.dataIndex = this.dataSize - 1);
            var a = this.enabledFilling ? this.groupsSize : this.values[this.dataIndex].items.length;
            this.colIndex > a - 1 && (this.colIndex = a -
                1);
            if (this.container && (a = this.container.querySelector("[data-index='" + this.nodePrefix + this.dataIndex + "-" + this.colIndex + "']"))) return $focus.set(a), this.selectedNodeId = a.id, a
        } else $focus.set(this.node)
    },
    getCurrentGroupItem: function() {
        var a = this.getDataSize() && this.getCurrentData().items || [];
        return a[Math.min(this.colIndex, a.length - 1)]
    }
});
AbstractSliderCtrl = $class(TransitionCtrl, {
    ANIM_DURATION: 200,
    index: -1,
    load: function() {
        this.parent();
        var a = this.node.dataset.menu;
        (a = a && $page.context.controllers[a]) ? (this.menu = a, this.menu.notifications.subscribe(this), this.index = this.menu.getIndex()) : this.index = 0;
        this.delta = this.node.offsetWidth;
        this.open(this.index, !0)
    },
    refresh: function() {
        this.open(this.index, !0)
    },
    focus: function(a) {
        this.inTransition() && $focus.hide();
        return this.parent(a)
    },
    notifyMenuChanged: function(a, b) {
        if (!this.node.isAttached) return !1;
        this.index != b && this.slide(b);
        return !0
    },
    slide: function(a) {
        (this.onExit(this.index, a) || (new Deferred).resolve()).done(this.open.bind(this, a)).done(this.onEnter.bind(this, a, this.index));
        this.index = a
    },
    left: function() {
        return this.menu.selectItem(this.index - 1)
    },
    right: function() {
        return this.menu.selectItem(this.index + 1)
    },
    _getAnimClass: function(a) {
        return a > this.index ? AnimSlideLeft : AnimSlideRight
    },
    open: function() {
        this.not_impl()
    },
    onExit: $nop,
    onEnter: $nop
});
DynamicSliderCtrl = $class(AbstractSliderCtrl, {
    open: function(a, b) {
        this.animation = null;
        var c;
        b ? (c = this.hasFocus(), this.set(this.getTemplateContent(a)), c && $focus.set(this.node), c = (new Deferred).resolve()) : c = this.transform(this.getTemplateContent(a), this._getAnimClass(a), null, null, !1, this.delta, this.ANIM_DURATION);
        return c
    },
    getTemplateContent: $nop
});
StaticSliderCtrl = $class(AbstractSliderCtrl, {
    open: function(a, b) {
        var c;
        if (b) this._hideSlots(), this.currentSlot = a, (c = this.crtNode()) && c.classList.remove("hidden"), c = (new Deferred).resolve();
        else {
            var d = this,
                e = this.crtNode();
            c = this.node.children[a];
            var e = this.getNodeWithGL(e) || [e],
                f = this.getNodeWithGL(c) || [c];
            c.classList.remove("hidden");
            this._exit(c);
            this.currentSlot = a;
            this.animation = (new(this._getAnimClass(a))(e, f, this.delta, this.ANIM_DURATION)).done(this._hideSlots.bind(this)).done(function() {
                var a =
                    d.node.children[d.currentSlot];
                d._enter(a);
                a.classList.remove("hidden");
                d.animation = null
            });
            $event.waitDeferredForNextEvent(this.animation);
            c = this.animation
        }
        return c
    },
    getTemplateContent: $nop,
    _hideSlots: function() {
        for (var a = this.node.children, b = 0, c = a.length; b < c; b++) a[b].classList.add("hidden")
    }
});
AbstractScrollBarCtrl = $class(BaseCtrl, {
    items: 0,
    crt: 0,
    scrollee: null,
    load: function() {
        var a = this.node.dataset.scrollee;
        (this.scrollee = a = a && $page.context.controllers[a]) && a.scrollTopic ? (this._listenScroll_bound = this._listenScroll.bind(this), a.scrollTopic.subscribe(this._listenScroll_bound), this.items = a.scrollTopic.items || this.items || this.node.dataset.items, this.crt = a.scrollTopic.crt || this.crt) : this.items = this.crt = 0;
        $template.clearNode(this.node);
        this.generateBar();
        this.parent()
    },
    _listenScroll: function() {
        var a =
            this.crt,
            b = this.scrollee.scrollTopic;
        this.crt = b.crt;
        !b.items && 0 !== b.items || this.items == b.items ? b.set ? this.set(a) : this.scroll(a) : (this.items = b.items, this.generateBar());
        return !0
    },
    generateBar: function() {
        this.not_impl()
    },
    scroll: function() {
        this.not_impl()
    },
    set: function() {
        this.not_impl()
    }
});
DiscreteScrollBarCtrl = $class(AbstractScrollBarCtrl, {
    generateBar: function() {
        for (var a = "", b = 0; b < this.items; b++) a = b == this.crt ? a + "<div class='crt'></div>" : a + "<div></div>";
        this.node.innerHTML = a
    },
    scroll: function(a) {
        this.node.children[a].removeClass("crt");
        this.node.children[this.crt].addClass("crt")
    },
    set: $nop
});
ScrollBarCtrl = $class(AbstractScrollBarCtrl, {
    SCROLL_MIN_HEIGHT: 10,
    SCROLL_RATIO: 1.8,
    load: function() {
        this.node.classList.add("scrollbar");
        this.container = $id(this.node.dataset.container);
        this.container || (this.container = this.node.parentNode);
        this.parent()
    },
    generateBar: function() {
        this.node.innerHTML = "<div class='scroll'></div>";
        var a = getComputedStyle(this.node),
            b = parseInt(a.paddingTop),
            a = parseInt(a.paddingBottom);
        this.scrollHeight = Math.max(this.SCROLL_RATIO * (this.node.clientHeight - b - a) / this.items, this.SCROLL_MIN_HEIGHT);
        b = this.node.children[0];
        1 < this.items ? (b.style.height = this.scrollHeight + "px", this.move(b), this.container.classList.remove("noScroll")) : (b.style.height = 0, this.container.classList.add("noScroll"))
    },
    scroll: function() {
        var a = this.node.children[0];
        !NO_ANIM && a.classList.add("active");
        this.move(a)
    },
    set: function() {
        var a = this.node.children[0];
        !NO_ANIM && a.classList.remove("active");
        this.move(a)
    },
    move: function(a) {
        var b = getComputedStyle(this.node),
            c = parseInt(b.paddingTop),
            b = parseInt(b.paddingBottom);
        a.style.top =
            Math.floor(this.crt * (this.node.clientHeight - c - b - this.scrollHeight) / (this.items - 1)) + c + "px"
    }
});
NavBarCtrl = $class(BaseCtrl, {
    load: function(a) {
        if (!a) {
            a = [];
            var b = this.node.dataset.items;
            if (b) try {
                a = JSON.parse(b)
            } catch (c) {
                logError("Error while parsing parameters " + b)
            }
        }
        this.setItems(a)
    },
    setItems: function(a) {
        this.items = a;
        for (var b = "", c = a.length, d = 0; d < c; d++) var e = a[d],
            f = $t(e.label),
            g = e.icon,
            h = e.id,
            h = e.id ? " id=" + e.id : "",
            b = b + ("<div" + h + " class='item " + g + "'><span>" + f + "</span></div>");
        this.node.innerHTML = b
    }
});
MenuCtrl = $class(BaseCtrl, {
    crtIndex: 0,
    load: function() {
        this.notifications = new Topic;
        this._fn = this._createMenuBar();
        this.selectItem(0)
    },
    refresh: function() {
        this._fn && this._fn.isAttached() ? this.node.appendChild(this._fn) : this._fn || (this._fn = this._createMenuBar());
        this.selectItem(this.crtIndex)
    },
    focus: function(a) {
        a.target === this.node && (this.node.classList.add("focused"), this.selectItem(this.crtIndex))
    },
    blur: function(a) {
        this.node.classList.remove("focused")
    },
    left: function(a) {
        return this.selectItem(this.crtIndex -
            1)
    },
    right: function(a) {
        return this.selectItem(this.crtIndex + 1)
    },
    selectItem: function(a) {
        var b = this.node.children[this.crtIndex],
            c = this.node.children[a];
        if (!c || c === this._fn) return !0;
        c !== b && b.classList.remove("active");
        c.classList.add("active");
        this._moveMenuBar(c);
        this.notifications.publish("notifyMenuChanged", this.crtIndex = a);
        return !1
    },
    getIndex: function() {
        return this.crtIndex
    },
    getMenuBar: function() {
        return this._fn
    },
    _createMenuBar: function() {
        var a = $node("<div id='menuBar_" + this.node.id + "' class='menu-bar'></div>");
        this.node.appendChild(a);
        return a
    },
    _moveMenuBar: function(a) {
        a.bounds || (a.bounds = {
            left: a.offsetLeft,
            width: a.offsetWidth
        });
        this._fn.style.left = a.bounds.left + "px";
        this._fn.style.width = a.bounds.width + "px"
    }
});
AbstractTextAreaCtrl = $class(BaseCtrl, {
    DEFAULT_ANIM_DURATION: 700,
    FAST_ANIM_DURATION: 100,
    min: 0,
    init: function() {
        this.scrollTopic = new Topic;
        this.parent()
    },
    loadComponent: function() {
        var a = this.node.scrollHeight,
            b = this.node.offsetHeight;
        (this.isScrollDisabled = a <= b) ? this._publishScroll(!0, 0, 0): (this.node.innerHTML = '<div class="scrollable">' + this.node.innerHTML + "</div>", this.textNode = this.node.firstElementChild, this._initValues(this.textNode.offsetTop, this.textNode.offsetHeight, b), this._publishScroll(!0, 0,
            Math.floor(a / this.stepSize) + 1), this.up = this.pageUp = this.scroll.bind(this, !1), this.down = this.pageDown = this.scroll.bind(this, !0))
    },
    _initValues: function(a, b, c) {
        this.min = a;
        this.max = -1 * Math.max(this.min, b - c);
        this.current = this.min;
        this.stepSize = .9 * c
    },
    _updateValues: function(a) {
        this.current += a ? -this.stepSize : this.stepSize;
        var b = this.scrollTopic.crt,
            b = b + (a ? 1 : -1);
        this.current < this.max && a && (this.current = this.max, b = this.scrollTopic.items - 1);
        this.current > this.min && !a && (this.current = this.min, b = 0);
        this.pos = this.current -
            this.textNode.offsetTop;
        this.dir = a;
        this._publishScroll(!1, b)
    },
    _publishScroll: function(a, b, c) {
        var d = this.scrollTopic;
        d.set = a;
        d.crt = b;
        "undefined" != typeof c && (d.items = c);
        d.publish()
    },
    scroll: function(a) {
        if (this.isScrollDisabled || this.current == this.max && a || this.current == this.min && !a) return !0;
        if (this.animation) return this.continueScroll = this.dir == a, !1;
        this._updateValues(a);
        this.animation = (new AnimTranslate([this.textNode], 0, 0, 0, this.pos, null, null, this.DEFAULT_ANIM_DURATION)).done(this.onAnimEnd.bind(this,
            this.pos, this.DEFAULT_ANIM_DURATION));
        return !1
    },
    onAnimEnd: function(a, b) {
        if (this.continueScroll) {
            this.continueScroll = !1;
            this._updateValues(this.dir);
            var c = Math.max(b / 2, this.FAST_ANIM_DURATION);
            this.animation = (new AnimTranslate([this.textNode], 0, 0, a, this.pos, null, null, c)).done(this.onAnimEnd.bind(this, this.pos, c))
        } else this.animation = null, this.textNode.style.top = this.current + "px"
    }
});
StaticTextAreaCtrl = $class(AbstractTextAreaCtrl, {
    load: function() {
        this.loadComponent()
    }
});
FileTextAreaCtrl = $class(AbstractTextAreaCtrl, {
    load: function() {
        var a = this.node.dataset;
        if (!a.content) return !1;
        a = a.content.split(":");
        a = $locale.getTextFile(a[0], a[1], a[2], !1);
        this._setPlaceholder();
        a.done(this._setContent.bind(this))
    },
    _setContent: function(a) {
        this._removePlaceholder();
        this.node.innerHTML = a;
        this.loadComponent()
    },
    _setPlaceholder: function() {
        var a = document.createElement("div"),
            b = this.node.dataset.deferredLabel || $t("common.loading");
        a.className = "text_placeholder";
        a.innerHTML = "<span>" + $t(b) +
            "</span>";
        this.node.appendChild(a);
        this._ph = a
    },
    _removePlaceholder: function(a) {
        this._ph && this.node.removeChild(this._ph);
        this._ph = null
    }
});
CurrentTimeCtrl = $class(BaseCtrl, {
    DATE_FORMAT: "dateFmt.dow_dom_time",
    load: function() {
        this._lastMinute = null;
        $services.clock.subscribe(this.update.bind(this));
        this.update(null, Date.now())
    },
    update: function(a, b) {
        var c = new Date(b),
            d = c.getMinutes();
        this._lastMinute != d && (this._lastMinute = d, this.node.textContent = $dateFormat.format($t(this.DATE_FORMAT), c));
        return !0
    }
});
SwitchCtrl = $class(BaseCtrl, {
    ANIM_DURATION: 200,
    arrowPadding: .1,
    arrowMargin: 20,
    child: 3,
    load: function(a) {
        this.parent();
        this.currentSlot = 0;
        var b = this.node.dataset;
        if (!a) {
            var c = b.values;
            if (c) try {
                a = JSON.parse(c)
            } catch (d) {
                logError("Error while parsing parameters " + c)
            }
        }
        this.values = a;
        this.dataSize = this.values.length;
        this.dataIndex = this.dataIndex || 0;
        this.itemSize = b.itemSize;
        this.animSize = this.itemSize * (1 - 2 * this.arrowPadding);
        this.inlineTemplate = this.inlineTemplate || this.node.innerHTML;
        this.templateId = null;
        null != this.inlineTemplate.match(/^\s*$/) && (this.inlineTemplate = null, this.templateId = b.template);
        $template.clearNode(this.node);
        this.container = document.createElement("div");
        this.container.classList.add("list");
        a = this.container.style;
        a.width = this.animSize + "px";
        a.left = this.itemSize * this.arrowPadding + "px";
        this.node.appendChild(this.container);
        this._initNodes();
        AnimSwitchList.prototype.initStyle(this)
    },
    _initNodes: function() {
        var a = 0;
        0 == this.dataIndex && (a = this.dataSize - 1);
        0 < this.dataIndex && (a = this.dataIndex -
            1);
        this.dataIndex == this.dataSize - 1 && (a = this.dataSize - 2);
        for (var b = 0; b < this.child; b++) {
            a + b == this.dataSize && (a = -b);
            var c = "",
                d = {
                    data: this.values[a + b] || {},
                    index: b
                },
                c = this.templateId ? c + $template.load(this.templateId, d) : c + $template.compile(this.inlineTemplate, d);
            this.container.innerHTML += '<div class="matchParent">' + c + "</div>"
        }
        a = this.container.children;
        b = 0;
        for (c = a.length; b < c; b++) a[b].firstElementChild.style.width = this.animSize;
        this.node.style.backgroundPosition = this.arrowMargin + "px center," + (this.itemSize -
            2 * this.arrowMargin) + "px center"
    },
    left: function() {
        if (this.animation) return !1;
        0 == this.dataIndex ? this.dataIndex = this.dataSize - 1 : --this.dataIndex;
        this.slide(-1);
        return !1
    },
    right: function() {
        if (this.animation) return !1;
        this.dataIndex = this.dataIndex == this.dataSize - 1 ? 0 : this.dataIndex + 1;
        this.slide(1);
        return !1
    },
    slide: function(a, b) {
        this.inScroll = !0;
        this.scrollDir = a;
        this.animation = (new AnimSwitchList(this.node, 1, a, this.ANIM_DURATION)).done(this.onAnimFinish.bind(this, a, b))
    },
    move: function(a) {
        this.dataIndex = a;
        this.updateAllNodes()
    },
    onAnimFinish: function(a, b) {
        this.updateNodes(a, b);
        this.animation = null;
        this.onSlideFinish.apply(this, $arguments2Array(arguments))
    },
    onSlideFinish: $nop,
    updateNodes: function(a) {
        var b = this.dataIndex + a; - 1 == b && (b = this.dataSize - 1);
        b == this.dataSize && (b = 0);
        var c = "",
            b = {
                data: this.values[b] || {},
                index: this.dataIndex
            },
            c = this.templateId ? c + $template.load(this.templateId, b) : c + $template.compile(this.inlineTemplate, b);
        this.container.childrenOrdered[1 + a].innerHTML = c
    },
    updateAllNodes: function() {
        var a = 0;
        0 <= this.dataIndex &&
            (a = this.dataIndex - 1);
        this.dataIndex == this.dataSize - 1 && (a = this.dataSize - 3);
        for (var b = 0; 3 > b; b++) {
            var c = "",
                d = {
                    data: this.values[a + b] || {},
                    index: b
                },
                c = this.templateId ? c + $template.load(this.templateId, d) : c + $template.compile(this.inlineTemplate, d);
            this.container.childrenOrdered[b].innerHTML = c
        }
    },
    focus: function(a) {
        $focus.set(this.node);
        return !1
    },
    getData: function(a) {
        return this.values[a]
    },
    getCurrentData: function() {
        return this.values[this.dataIndex]
    },
    setDataIndex: function(a) {
        this.dataIndex = a
    }
});
AcmService = $class(Service, {
    ACM_VERSION: "tsb.acm.version",
    init: function() {
        this.parent();
        this.waitDeferred = new Deferred;
        this.checkDeferred = new Deferred;
        var a = applicationCache;
        a.addEventListener("noupdate", this.onNoUpdate.bind(this));
        a.addEventListener("downloading", this.onStartUpdate.bind(this));
        a.addEventListener("progress", this.onProgressUpdate.bind(this));
        a.addEventListener("cached", this.onSuccessUpdate.bind(this));
        a.addEventListener("updateready", this.onSuccessUpdate.bind(this));
        a.addEventListener("error",
            this.onErrorUpdate.bind(this));
        if (a.status == a.UNCACHED) this.onNoUpdate()
    },
    onNoUpdate: function() {
        var a = this.getCurrentVersion();
        if (a) var a = a.escapeRegExp().replace(/(\d+\\.\d+\\.)(\d+)/, "$1\\d"),
            b = new RegExp(a);
        if (!b || b.test(APP_VERSION)) this.publish("onAcmNoUpdate"), this.checkDeferred.resolve(!1), this.waitDeferred.resolve();
        else this.onErrorUpdate()
    },
    onStartUpdate: function() {
        this.hasError = !1;
        this.publish("onAcmProgress", 0);
        this.checkDeferred.resolve(!0)
    },
    onProgressUpdate: function(a) {
        this.publish("onAcmProgress",
            a.lengthComputable ? a.loaded / a.total * 100 | 0 : 0)
    },
    onSuccessUpdate: function() {
        this.publish("onAcmSuccess");
        this.waitDeferred.resolve()
    },
    onErrorUpdate: function() {
        this.hasError = !0;
        this.publish("onAcmError");
        this.waitDeferred.reject();
        this.checkDeferred.resolve(!0)
    },
    check: function() {
        return this.checkDeferred
    },
    waitUpdate: function() {
        return this.waitDeferred
    },
    retry: function() {
        applicationCache.update()
    },
    setCurrentVersion: function() {
        $storage.setRaw(this.ACM_VERSION, APP_VERSION)
    },
    getCurrentVersion: function() {
        return $storage.getRaw(this.ACM_VERSION)
    }
});
AcmStatusService = $class(Object, {
    ACM_STATUS: "tsb.acm.status",
    ACM_STATUS_NOUPDATE: 1,
    ACM_STATUS_PROGRESS: 2,
    ACM_STATUS_DONE: 4,
    ACM_STATUS_ERROR: 8,
    ACM_STATUS_RELOAD: 16,
    init: function() {
        var a = this;
        this.key = this.getKey(APP_NAME);
        $storage.remove(this.key);
        $services.acm.check().done(function(b) {
            b ? ($services.acm.hasError ? a.error() : a.progress(null, 0), a.subscribe()) : $storage.set(a.key, {
                app: APP_NAME,
                status: a.ACM_STATUS_NOUPDATE
            })
        })
    },
    getKey: function(a) {
        return this.ACM_STATUS + "." + a
    },
    subscribe: function() {
        var a = this;
        $storage.addListener(a.key, function() {
            var b = $storage.get(a.key),
                c = b.timeout;
            (b.status & a.ACM_STATUS_RELOAD) == a.ACM_STATUS_RELOAD && (c ? $timeout(c).done(a.reload.bind(a)) : a.reload())
        });
        this.acmTopicId = $services.acm.subscribe({
            onAcmProgress: a.progress.bind(a),
            onAcmSuccess: a.done.bind(a),
            onAcmError: a.error.bind(a)
        })
    },
    reload: function() {
        ($storage.getRaw("tsb.acm.current.app") || "overlay" != APP_NAME) && location.reload(!0)
    },
    forceReload: function() {
        var a = this.getState("overlay");
        a && (a.status & this.ACM_STATUS_RELOAD) ==
            this.ACM_STATUS_RELOAD && ("overlay" == APP_NAME ? location.reload(!0) : this.setStateReload("overlay", a.timeout))
    },
    progress: function(a, b) {
        $storage.set(this.key, {
            app: APP_NAME,
            status: this.ACM_STATUS_PROGRESS,
            progress: b
        });
        return !0
    },
    done: function() {
        this.progress(null, 100);
        $storage.set(this.key, {
            app: APP_NAME,
            status: this.ACM_STATUS_DONE
        })
    },
    error: function() {
        $storage.set(this.key, {
            app: APP_NAME,
            status: this.ACM_STATUS_ERROR
        })
    },
    checkMain: function(a) {
        var b = a || new Deferred,
            c = this.getState("tv"),
            d = this.getState("overlay");
        c && d ? (c = c.status, d = d.status, (c & this.ACM_STATUS_DONE) != this.ACM_STATUS_DONE && (c & this.ACM_STATUS_NOUPDATE) != this.ACM_STATUS_NOUPDATE || (d & this.ACM_STATUS_DONE) != this.ACM_STATUS_DONE && (d & this.ACM_STATUS_NOUPDATE) != this.ACM_STATUS_NOUPDATE ? b.reject() : b.resolve()) : "tv" == APP_NAME ? (d || $storage.addListener(this.getKey("overlay"), this.checkMain.bind(this, b)), c || $services.acm.checkDeferred.resolved || $services.acm.check().done(this.checkMain.bind(this, b))) : (d || $services.acm.checkDeferred.resolved || $services.acm.check().done(this.checkMain.bind(this,
            b)), c || $storage.addListener(this.getKey("tv"), this.checkMain.bind(this, b)));
        if (!a) return b
    },
    checkApp: function() {
        var a = new Deferred;
        $services.acm.check().done(function(b) {
            b ? a.reject() : a.resolve()
        });
        return a
    },
    getState: function(a) {
        return $storage.get(this.getKey(a))
    },
    setStateReload: function(a, b) {
        var c = this.getKey(a);
        $storage.set(c, {
            app: a,
            status: this.ACM_STATUS_RELOAD,
            timeout: b,
            id: $nonce()
        })
    }
});
AcmEventsHandler = $class(Object, {
    ACM_APP_NAME: "acm",
    ACM_CURRENT_APP: "tsb.acm.current.app",
    init: function() {
        this.guide = this.toggleAcm.bind(this, "epg");
        this.home = this.toggleAcm.bind(this, "portal");
        this.personal = this.toggleAcm.bind(this, "mgr")
    },
    release: function() {
        var a = function() {
            var a = $appManager.getWindowByName(this.ACM_APP_NAME);
            a && $appManager.destroyWindow(a)
        };
        this.personal = this.home = this.guide = a
    },
    toggleAcm: function(a) {
        var b = $appManager.getWindowByName(this.ACM_APP_NAME),
            c = $storage.getRaw(this.ACM_CURRENT_APP);
        b && c == a ? (this.hideAcmApp(), $storage.remove(this.ACM_CURRENT_APP)) : (this.showAcmApp(), $services.acmStatus.forceReload(), $storage.setRaw(this.ACM_CURRENT_APP, a));
        return !1
    },
    showAcmApp: function() {
        var a = $appManager.getWindowByName(this.ACM_APP_NAME);
        a ? (a.show(), a.activate()) : ($api.launcher.loadApp(this.ACM_APP_NAME), $appManager.getWindowByName(this.ACM_APP_NAME))
    },
    hideAcmApp: function() {
        var a = $appManager.getWindowByName(this.ACM_APP_NAME);
        a && (a.hide(), a.deactivate())
    }
});
AcmApi = $class(Object, {
    ACM_APP_NAME: "acm",
    ACM_CURRENT_APP: "tsb.acm.current.app",
    checkUpdate: function() {
        return $services.acmStatus.checkApp().done(this.showApp.bind(this, APP_NAME)).fail(function() {
            var a = new AcmEventsHandler;
            $event.registerFirst(a)
        })
    },
    waitUpdate: function() {
        $services.acm.setCurrentVersion();
        return $services.acmStatus.checkMain().fail(function() {
            $appManager.addKeySet($keysMap.OTHER, [$keysMap.guide, $keysMap.personal, $keysMap.home]);
            var a = new AcmEventsHandler;
            $event.registerFirst(a)
        })
    },
    showApp: function(a) {
        if ($storage.getRaw(this.ACM_CURRENT_APP) == a) {
            $appManager.showWindow();
            for (var b = $appManager.getWindows(), c = 0, d = b.length; c < d; c++) {
                var e = b[c];
                e.name != a && e.hide()
            }
            $storage.remove(this.ACM_CURRENT_APP);
            a && (e = $appManager.getWindowByName(this.ACM_APP_NAME), $appManager.destroyWindow(e))
        }
    }
});
$services.acm = new AcmService;
$services.acmStatus = new AcmStatusService;
$api.acm = new AcmApi;
LauncherEventsHandler = $class(Object, {
    FTI_STATUS: "tsb.fti.status",
    boot: function() {
        var a = this;
        $api.launcher.loadApp("tv");
        var b = this.waitFti().done(function() {
            $api.acm.waitUpdate().done(a.loadApps.bind(a))
        });
        b.resolved || $api.launcher.loadApp("fti");
        return b
    },
    waitFti: function() {
        var a = new Deferred,
            b = $storage.getRaw(this.FTI_STATUS);
        null == b || "done" != b ? $storage.addListener(this.FTI_STATUS, function(b, d) {
            return "done" == d ? (a.resolve(), !1) : !0
        }) : a.resolve();
        return a
    },
    loadApps: function() {
        for (var a = 0, b = TE_APPLICATIONS.length; a <
            b; $api.launcher.loadApp(TE_APPLICATIONS[a++]));
    }
});
var TE_APPLICATIONS = ["epg", "mgr", "portal", "tv", "cda"];
$event.register(new LauncherEventsHandler);
ImageUtils = $class(Object, {
    init: function() {
        this.defaultCache = $cacheFactory.get("images")
    },
    switchImage: function(a, b, c) {
        if (Array.isArray(a)) {
            for (var d = [], e = 0, f = a.length; e < f; e++) d.push(this._switchImage(a[e], b, c));
            b = Deferred.all.apply(void 0, d)
        } else b = this._switchImage(a, b, c);
        var g = new Deferred;
        b.always(function() {
            g.resolve(a)
        });
        return g
    },
    _switchImage: function(a, b, c) {
        c = c || this.defaultCache;
        var d = new Deferred,
            e = a[b + "_orig_img"] || a[b];
        if (e)
            if (/data:.*/.test(e)) d.resolve(a);
            else {
                var f = this;
                c.get(e).done(function(c) {
                    f._replaceUrl(a,
                        b, e, c);
                    d.resolve(a)
                }).fail(function() {
                    var g = f._getImageCDN(e);
                    $ajax.get({
                        url: g,
                        dataType: "image",
                        responseType: "arraybuffer",
                        withCredentials: !1
                    }).done(function(g) {
                        var k = this.xhr.getResponseHeader("Content-Type");
                        g = new Blob([g], {
                            type: k
                        });
                        c.set(e, g).done(function(c, g) {
                            f._replaceUrl(a, b, e, g);
                            d.resolve(a)
                        }).fail(function() {
                            d.reject(a)
                        })
                    }).fail(function() {
                        f._replaceUrl(a, b, e, void 0);
                        d.reject(a)
                    })
                })
            } else d.reject(a);
        return d
    },
    _replaceUrl: function(a, b, c, d) {
        a[b] = d;
        a[b + "_orig_img"] = c
    },
    _getImageCDN: function(a,
        b) {
        var c = a,
            d = NIMBUS_IMG_HOST.join("|");
        (new RegExp("^https?://(" + d + ").*")).test(a) && (c = a.replace(/https?:\/\/([^\/]+)\/(.*)/, NIMBUS_IMG_CDN + "/$1/$2"), b && !/cdnpersist/.test(c) && (c = 0 > c.indexOf("?") ? c + "?cdnpersist=true" : c + "&cdnpersist=true"));
        return c
    }
});
ServiceUtils = $class(Object, {
    flatten: function(a, b) {
        if (Array.isArray(b))
            for (var c = 0, d = b.length; c < d; c++) this.flatten(a, b[c]);
        else a.add(b);
        return a
    },
    mergeData: function(a, b) {
        b = b || {};
        for (var c = {}, d = Object.keys(b), e = 0, f = d.length; e < f; e++) {
            var g = d[e],
                h = b[g],
                k = a[g];
            k ? h && "string" === typeof k && k.length < h.length && (a[g] = h, c[g] = h) : (a[g] = h, c[g] = h)
        }
        return c
    },
    overwriteMerge: function(a) {
        a = a || {};
        for (var b = 1, c = arguments.length; b < c; b++)
            for (var d = arguments[b] || {}, e = Object.keys(d), f = 0, g = e.length; f < g; f++) {
                var h = e[f];
                a[h] =
                    d[h]
            }
        return a
    },
    format: function(a, b) {
        return a.replace(/%{([^}]+)}s/g, function(a, d) {
            for (var e, f = d.split("||"), g = 0, h = f.length; g < h; g++) {
                e = b;
                for (var k = f[g].split("."), l = 0, m = k.length; l < m; l++) e = e[k[l]];
                if (e) break
            }
            return e
        })
    }
});
MGRUtils = $class(Object, {
    DATE_FORMAT: "dateFmt.time",
    separatorCustomId: ";",
    asyncLoop: function(a) {
        var b = new Deferred,
            c = -1,
            d = function() {
                c++;
                c == a.length ? b.resolve() : a.functionToLoop(d, c)
            };
        d();
        return b
    },
    getChannelByNimbusSourceId: function(a, b) {
        var c = null;
        a.some(function(a) {
            return a && a.nimbus && a.nimbus.SourceId == b ? (c = a, !0) : !1
        });
        return c
    },
    putAiringTimeInEpgProgram: function(a, b, c) {
        var d = new Date(b[c].startTime),
            e = new Date(b[c].endTime),
            f = (b[c].endTime - b[c].startTime) / 6E4;
        a.channel = b[c].channel;
        a.startDate =
            d;
        a.duration = f;
        a.startDateFormatted = $dateFormat.format($t(this.DATE_FORMAT), $dateUtils.toDate(d));
        a.nimbus.AiringTime = d.toISOString();
        a.nimbus.Duration = f;
        a.nimbus.SourceId = b[c].channel.nimbus.SourceId;
        a.nimbus.ProgramId = b[c].programId;
        a.endDate = e.toISOString();
        a.endDateFormatted = $dateFormat.format($t(this.DATE_FORMAT), $dateUtils.toDate(e));
        a.id = $services.program.getProgramId(a)
    },
    updateSeriesMap: function(a, b) {
        b && a[b] ? a[b]++ : b && "null" != b && (a[b] = 1, $services.series.getSeriesInfo(b))
    },
    makeCustomId: function(a,
        b, c, d) {
        c = c ? "MANUAL" : "AUTO";
        d = d ? "NEW" + this.separatorCustomId : "";
        return a && b ? "s:" + a + this.separatorCustomId + "e:" + b + this.separatorCustomId + c + this.separatorCustomId + d : c + this.separatorCustomId + d
    },
    unmakeCustomId: function(a) {
        if (!a) return {};
        var b = {},
            c = a.indexOf("s:"),
            d = a.indexOf("e:"); - 1 != a.indexOf("s:") && (b.seriesId = a.substring(c + 2, a.indexOf(this.separatorCustomId, c)), b.episodeId = a.substring(d + 2, a.indexOf(this.separatorCustomId, d)));
        b.isNew = -1 != a.indexOf("NEW");
        b.isManual = -1 != a.indexOf("MANUAL");
        return b
    }
});
CandidateAiring = $class(Object, {
    startTime: 0,
    endTime: 0,
    channel: "",
    programId: null,
    isManual: !0,
    conflict: null,
    init: function(a, b, c, d, e) {
        this.startTime = a;
        this.endTime = b;
        this.channel = c || null;
        this.programId = e || null;
        this.isManual = d
    }
});
ConflictNotification = $class(Object, {
    notifyId: 0,
    airing: null,
    recording: null,
    action: 0,
    init: function(a, b, c, d) {
        this.airing = a;
        this.recording = b;
        this.index = c;
        d && (this.action = d)
    }
});
ConflictNotification.Action = {
    None: 0,
    Solve: 1,
    Remove: 2,
    Reject: 3
};
Channel = $class(Object, {
    id: null,
    name: null,
    ccid: null,
    idType: null,
    signalDescription: null,
    signalStrength: null,
    locked: null,
    dvbsi: null,
    nimbus: null,
    init: function(a, b) {
        b && "nimbus" === b.source ? this.initNimbus(a, b) : this.initDVBSI(a)
    },
    _computeId: function() {
        return "channel-" + this.ccid
    },
    initNimbus: function(a, b) {
        this.name = a.CallLetters;
        this.number = a.Channel;
        this.description = a.fullname;
        this.category = a.Category;
        this.logo = a.LogoImageFileUrl;
        this.nimbus = b;
        this.id = this._computeId()
    },
    initDVBSI: function(a) {
        this.name = a.name;
        this.ccid = a.ccid;
        this.number = a.minorChannel;
        this.isTV = a.channelType === a.TYPE_TV;
        this.isRadio = a.channelType === a.TYPE_RADIO;
        try {
            this.idType = a.idType
        } catch (b) {
            this.idType = a.ID_DVB_S
        }
        this.dvbsi = {
            name: a.name,
            channelType: a.channelType,
            onid: a.onid,
            tsid: a.tsid,
            sid: a.sid,
            ccid: a.ccid,
            idType: this.idType
        };
        a = Math.random();.75 < a ? (this.signalDescription = "Astra 19,2\u00b0E", this.signalStrength = 1) : .5 < a ? (this.signalDescription = "HotBird", this.signalStrength = 2) : .25 < a ? (this.signalDescription = "Astra 28", this.signalStrength =
            3) : (this.signalDescription = "FranceSat", this.signalStrength = 4);
        this.locked = .5 > Math.random();
        this.id = this._computeId();
        return this
    }
});
TncService = $class(Service, {
    TNC_EVENT_EULA: "onEulaChange",
    TNC_EVENT_LOGUPLOAD: "onLogUploadChange",
    TNC_EULA_LS_KEY: "tsb.tnc.eula.acceptedDate",
    TNC_SKIPMESSAGE_LS_KEY: "tsb.tnc.skipMessage",
    TNC_LOGUPLOAD_LS_KEY: "tsb.tnc.logupload.acceptedDate",
    init: function() {
        this.parent();
        this.soc = oipfObjectFactory.createConfigurationObject().configuration;
        $storage.addListener(this.TNC_EULA_LS_KEY, this._sendEvent.bind(this, this.TNC_EVENT_EULA));
        $storage.addListener(this.TNC_LOGUPLOAD_LS_KEY, this._sendEvent.bind(this,
            this.TNC_EVENT_LOGUPLOAD))
    },
    _sendEvent: function(a, b, c) {
        this.publish(a, !!c);
        return !0
    },
    isEulaAccepted: function() {
        return !!this.getEulaAcceptedDate()
    },
    getEulaAcceptedDate: function() {
        return $storage.get(this.TNC_EULA_LS_KEY)
    },
    isLogUploadAccepted: function() {
        return !!this.getLogUploadAcceptedDate()
    },
    getLogUploadAcceptedDate: function() {
        return $storage.get(this.TNC_LOGUPLOAD_LS_KEY)
    },
    isMessageSkipped: function() {
        return !!$storage.get(this.TNC_SKIPMESSAGE_LS_KEY)
    },
    setMessageSkipped: function(a) {
        a ? $storage.set(this.TNC_SKIPMESSAGE_LS_KEY, !0) : $storage.remove(this.TNC_SKIPMESSAGE_LS_KEY)
    },
    acceptEula: function() {
        if (this.isEulaAccepted()) logError("Eula were already accepted");
        else {
            log("Eula accepted");
            var a = Date.now();
            $storage.set(this.TNC_EULA_LS_KEY, a);
            DatabaseManager.write(this.TNC_EULA_LS_KEY, a);
            this._sendEvent(this.TNC_EVENT_EULA, null, !0)
        }
    },
    acceptLogUpload: function(a) {
        a ? ($storage.set(this.TNC_LOGUPLOAD_LS_KEY, Date.now()), DatabaseManager.write(this.TNC_LOG_LS_KEY, $storage.get(this.TNC_LOG_LS_KEY))) : ($storage.remove(this.TNC_LOGUPLOAD_LS_KEY),
            DatabaseManager.write(this.TNC_LOG_LS_KEY, null));
        this._sendEvent(this.TNC_EVENT_LOGUPLOAD, null, a)
    }
});
MultiProviderService = $class(Service, {
    fieldProvider: {},
    _populateData: function(a, b, c, d, e) {
        b = $serviceUtils.flatten(new Set, b);
        c = Object.keys(c);
        for (var f = 0, g = c.length; f < g; f++) b.delete(c[f]);
        c = new Set;
        var h = $serviceUtils.flatten.bind($serviceUtils, c),
            k = this;
        b.forEach(function(b) {
            h(k.fieldProvider[b][a])
        });
        var l = [];
        c.forEach(function(a) {
            a = a.split(".");
            a.unshift(window);
            for (var b = 1, c = a.length; b < c; b++) a[b] = a[b - 1][a[b]];
            l.push(a[a.length - 1].apply(a[a.length - 2], d).done(function(a) {
                e.merge(a)
            }))
        });
        var m = new Deferred;
        Deferred.all.apply(void 0, l).done(function() {
            m.resolve(e.result)
        }).fail(function() {
            m.reject(e.result)
        });
        return m
    }
});
DVBSIService = $class(Service, {
    DVBSI_TIME_AJUSTMENT_FACTOR: 1E3,
    DVBSI_DURATION_AJUSTMENT_FACTOR: 60,
    init: function() {
        this.parent();
        this.oipfSearchManager = oipfObjectFactory.createSearchManagerObject();
        this.getChannels()
    },
    getISOCountryCode: function() {
        var a = $locale.country;
        return a = a && $localeMaps.COUNTRY_ISO_MAP[a]
    },
    getChannelById: function(a) {
        return this.channels[a]
    },
    getChannels: function() {
        var a = new Deferred,
            b = this.oipfSearchManager.getChannelConfig().channelList || [],
            c = [];
        this.channels = {};
        for (var d = 0, e = b.length; d <
            e; d++) {
            var f = b[d],
                g = this._channelDVBSICleaner(f);
            g.index = d;
            this.channels[g.id] = f;
            c.push(g)
        }
        a.resolve(c);
        return a
    },
    getPrograms: function(a, b, c, d) {
        for (var e = new Deferred, f = [], g = [], h = 0, k = a.length; h < k; h++) {
            var l = a[h];
            l && g.push(this._getPrograms(f, l, b, c, d))
        }
        Deferred.all.apply(void 0, g).always(function() {
            e.resolve(f)
        });
        return e
    },
    _getPrograms: function(a, b, c, d, e) {
        var f = new Deferred,
            g = this.getChannelById(b.id);
        if (g) {
            c = $dateUtils.toNumber($dateUtils.toDate(c), "s");
            d = $dateUtils.toNumber($dateUtils.toDate(d),
                "s");
            var h = this;
            e = e || 10;
            var k = 0,
                l = c,
                m = [];
            c = oipfObjectFactory.createSearchManagerObject();
            var n = c.createSearch(1),
                p = n.createQuery("Programme.startTime", 3, l.toString());
            n.setQuery(p);
            n.addChannelConstraint(g);
            c.addEventListener("MetadataSearch", function(c) {
                if (0 === c.state) {
                    var g = c.search.result.length;
                    if (0 < g) {
                        for (var n = 0, p = c.search.result.length; n < p; n++) m.push(h._programDVBSICleaner(b, c.search.result[n]));
                        l = m[m.length - 1].endDate;
                        k += g;
                        g === e && ($dateUtils.lt(l, d) || e > k) ? c.search.result.getResults(k, e) : (a.push.apply(a,
                            m), f.resolve())
                    } else a.push.apply(a, m), f.resolve()
                } else f.reject()
            });
            n.result.getResults(k, e)
        } else f.reject();
        return f
    },
    _channelDVBSICleaner: function(a) {
        return new Channel(a)
    },
    _programDVBSICleaner: function(a, b) {
        var c = {};
        c.channel = a;
        c.startDate = b.startTime * this.DVBSI_TIME_AJUSTMENT_FACTOR;
        c.duration = b.duration / this.DVBSI_DURATION_AJUSTMENT_FACTOR;
        c.endDate = (b.startTime + b.duration) * this.DVBSI_TIME_AJUSTMENT_FACTOR;
        c.description = b.description;
        c.title = b.name;
        try {
            c.episode = b.episode, c.totalEpisodes = b.totalEpisodes,
                c.hasRecording = b.hasRecording
        } catch (d) {
            c.episode = null, c.totalEpisodes = null, c.hasRecording = !1
        }
        c.audioType = .5 > Math.random() ? "Dolby Digital Plus" : "Dolby Digital";
        c.audioDescription = .3 > Math.random();
        c.subtitles = .3 > Math.random();
        c.isMultilingual = .3 > Math.random();
        c.ratingAge = .3 > Math.random() ? Math.floor(19 * Math.random()) : 0;
        c.blocked = b.blocked;
        c.locked = b.locked;
        c.id = $services.program.getProgramId(c);
        return c
    }
});
VideoBroadcastService = $class(Service, {
    CHANNEL_CHANGE_ERROR: {
        0: "channel not supported by tuner.",
        1: "cannot tune to given transport stream (e.g. no signal)",
        2: "tuner locked by other object.",
        3: "parental lock on channel.",
        4: "encrypted channel, key/module missing.",
        5: "unknown channel (e.g. can't resolve DVB or ISDB triplet).",
        6: "channel switch interrupted (e.g. because another channel switch was activated before the previous one completed).",
        7: "channel cannot be changed, because it is currently being recorded.",
        8: "cannot resolve URI of referenced IP channel.",
        9: "insufficient bandwidth.",
        10: "channel cannot be changed by nextChannel()/prevChannel() methods either because the OITF does not maintain a favourites or channel list or because the video/broadcast object is in the Unrealized state.",
        11: "insufficient resources are available to present the given channel (e.g. a lack of available codec resources).",
        12: "specified channel not found in transport stream.",
        100: "unidentified error."
    },
    CURRENT_CHANNEL: "tsb.current.channel",
    init: function() {
        this.parent();
        var a = this;
        $storage.addListener(this.CURRENT_CHANNEL, function() {
            a.bindDeferred.resolve();
            if (a.videobcast) {
                var b = $storage.get(a.CURRENT_CHANNEL),
                    b = $services.dvbsi.getChannelById(b);
                a.videobcast.setChannel(b)
            } else b = a.getCurrentChannelId(), a.publish("channelChange", -1, b);
            return !0
        });
        $storage.remove(this.CURRENT_CHANNEL);
        this.bindDeferred = new Deferred
    },
    bindToCurrentChannel: function(a) {
        this.videobcast = a;
        this.videobcast.bindToCurrentChannel();
        this.videobcast.addEventListener("ChannelChangeSucceeded",
            this._onChannelChangeSucceeded.bind(this));
        this.videobcast.addEventListener("ChannelChangeError", this._onChannelChangeError.bind(this));
        a = new Channel(this.videobcast.currentChannel);
        $storage.set(this.CURRENT_CHANNEL, a.id);
        this.bindDeferred.resolve()
    },
    getCurrentChannelId: function() {
        var a = this;
        return this.bindDeferred.done(function() {
            return $storage.get(a.CURRENT_CHANNEL)
        })
    },
    setCurrentChannelById: function(a) {
        var b = $services.dvbsi.getChannelById(a);
        $storage.set(this.CURRENT_CHANNEL, a);
        this.videobcast &&
            (this.videobcast.setChannel(b), a = this.getCurrentChannelId(), this.publish("channelChange", -1, a))
    },
    _onChannelChangeError: function(a) {
        a.channel && ($storage.remove(this.CURRENT_CHANNEL), this.videobcast && this.publish("channelChange", a.errorState, id))
    },
    _onChannelChangeSucceeded: function(a) {
        a.channel && ($storage.set(this.CURRENT_CHANNEL, a.channel), this.videobcast && (a = this.getCurrentChannelId(), this.publish("channelChange", -1, a)))
    }
});
AbstractWrapperService = $class(Service, {
    _callOipfOrProprietary: function() {
        var a = $arguments2Array(arguments),
            b = a[0].substr(0, 1).toUpperCase() + a[0].substr(1);
        a.splice(0, 1);
        var c = this["_oipf" + b],
            b = this["_vestel" + b];
        if ($device.isTV() && b) return b.apply(this, a);
        if (c) return c.apply(this, a)
    },
    _vestelSaveConfig: function(a, b) {
        var c = window.DatabaseManager;
        c && c.write(a, b)
    },
    _vestelGetConfig: function(a) {
        var b = window.DatabaseManager;
        return b ? b.read(a) : ""
    }
});
ConfigurationService = $class(AbstractWrapperService, {
    init: function() {
        this.oipfConfiguration = oipfObjectFactory.createConfigurationObject();
        this.setAvailablePowerState = this._callOipfOrProprietary.bind(this, "setAvailablePowerState")
    },
    setHbbTvState: function(a) {},
    setTvMode: function(a) {
        GeneralSettings.setTVMode(a)
    },
    getTvMode: function() {
        return GeneralSettings.getTVMode()
    },
    setCountryCode: function(a) {
        this.oipfConfiguration.configuration.countryId = a
    },
    getCountryCode: function() {
        return this.oipfConfiguration.configuration.countryId ||
            "FR"
    },
    setPreferredSubtitleLanguage: function(a) {
        var b = this.oipfConfiguration.configuration.preferredSubtitleLanguage || "",
            b = -1 < b.indexOf(",") ? a + "," + b.split(",")[1] : a;
        this.oipfConfiguration.configuration.preferredSubtitleLanguage = b
    },
    setSecondarySubtitleLanguage: function(a) {
        var b = this.oipfConfiguration.configuration.preferredSubtitleLanguage;
        "" != b ? (b = -1 < b.indexOf(",") ? b.split(",")[0] + "," + a : b + ("," + a), this.oipfConfiguration.configuration.preferredSubtitleLanguage = b) : this.oipfConfiguration.configuration.preferredSubtitleLanguage =
            a
    },
    setPreferredAudioLanguage: function(a) {
        var b = this.oipfConfiguration.configuration.preferredAudioLanguage || "",
            b = -1 < b.indexOf(",") ? a + "," + b.split(",")[1] : a;
        this.oipfConfiguration.configuration.preferredAudioLanguage = b
    },
    setSecondaryAudioLanguage: function(a) {
        var b = this.oipfConfiguration.configuration.preferredAudioLanguage;
        "" != b ? (b = -1 < b.indexOf(",") ? b.split(",")[0] + "," + a : b + ("," + a), this.oipfConfiguration.configuration.preferredAudioLanguage = b) : this.oipfConfiguration.configuration.preferredAudioLanguage =
            a
    },
    setPreferredUILanguage: function(a) {
        this.oipfConfiguration.configuration.preferredUILanguage = a
    },
    getPreferredUILanguage: function() {
        return this.oipfConfiguration.configuration.preferredUILanguage
    },
    getPreferredSubtitleLanguage: function() {
        return this.oipfConfiguration.configuration.preferredSubtitleLanguage
    },
    getPreferredAudioLanguage: function() {
        return this.oipfConfiguration.configuration.preferredAudioLanguage
    },
    _oipfSetAvailablePowerState: function(a) {
        this.oipfConfiguration.localSystem.tsbPowerOffState(a)
    },
    _vestelSetAvailablePowerState: function(a) {
        this._vestelSaveConfig("_powerOffState", a)
    }
});
ParentalService = $class(Service, {
    init: function() {
        this.oipfParentalControlManager = oipfObjectFactory.createParentalControlManagerObject()
    },
    setParentalControlPIN: function(a, b) {
        return this.oipfParentalControlManager.setParentalControlPIN(a, b)
    }
});
NimbusService = $class(Service, {
    NIMBUS_BLOCK_SIZE: 4,
    NIMBUS_START_TIME: 0,
    CHANNELS_EXPIRY_DAYS: 3,
    init: function(a, b) {
        this.parent();
        this.name = "NimbusService";
        this.nimbusParam = {
            appname: window.MG_APP_NAME,
            appver: window.MG_APP_VER,
            osname: window.MG_OS_NAME,
            osver: window.MG_OS_VER,
            partnum: window.MG_PART_NUM,
            serialnum: window.MG_SERIAL_NUM,
            authkey: window.NIMBUS_AUTH_KEY
        };
        this.cache = $cacheFactory.get("nimbus");
        this.tncEulaAccepted = b || $services.tnc.isEulaAccepted();
        if (!this.tncEulaAccepted) {
            var c = this;
            $services.tnc.subscribe({
                onEulaChange: function(a,
                    b) {
                    c.tncEulaAccepted = b;
                    return !0
                }
            })
        }
        a ? this.getProviderDeferred = (new Deferred).resolve(a) : this.getProvider();
        window.$services && window.$services.channel.subscribe({
            tuningChange: this.onTuningChange.bind(this)
        })
    },
    onTuningChange: function() {
        this.cache.clear();
        this.getProviderDeferred = null;
        this.getProvider()
    },
    getProvider: function() {
        if (this.getProviderDeferred) return this.getProviderDeferred;
        var a = this.getProviderDeferred = new Deferred,
            b = this,
            c = $cacheFactory.get("channels");
        this.getProviderDeferred = c.getAsDeferred("tsb.nimbus.provider").done(function(b) {
            a.resolve(b)
        }).fail(function() {
            $services.dvbsi.getChannels().done(function(d) {
                var e =
                    $services.dvbsi.getISOCountryCode();
                b.addNimbusProvider(d, e).done(function(d) {
                    d = b._getProvider(d);
                    c.set("tsb.nimbus.provider", d);
                    a.resolve(d)
                }).fail(function() {
                    a.reject()
                })
            }).fail(function() {
                a.reject()
            })
        });
        return a
    },
    _getProvider: function(a) {
        Array.isArray(a) || (a = [a]);
        for (var b = [], c = [], d, e = 0, f = a.length; e < f; e++) {
            var g = a[e];
            if (g && g.nimbus) {
                var h = (g.nimbus.channelDevice || "_") + g.nimbus.headendId;
                g.nimbus.headendId && !b[h] && (b[h] = !0, b.push(h), g.nimbus.providerName && !c[g.nimbus.providerName] && (c[g.nimbus.providerName] = !0, c.push(g.nimbus.providerName)), d = d || g.nimbus.countryCode)
            }
        }
        return b.length ? {
            countryCode: d,
            names: c,
            headends: b.join(" ")
        } : {
            countryCode: "FR",
            names: ["France :Antenne"],
            headends: "Y594652000-00000000000000000000000000000000"
        }
    },
    getServiceUID: function(a) {
        return this.name + "_service_" + a.HeadendId
    },
    getPersonUID: function(a) {
        return "person-" + a.CreditId
    },
    getNimbusServiceURL: function(a, b) {
        return $serviceUtils.format(this.nimbusServicePath[a].url, $serviceUtils.overwriteMerge({}, b, this.nimbusParam, this.provider))
    },
    getNimbusDataConverter: function(a) {
        return this.nimbusServicePath[a].converter
    },
    getNimbusServiceMethod: function(a) {
        return this.nimbusServicePath[a].method || "get"
    },
    _callNimbusService: function(a, b, c) {
        var d = new Deferred,
            e = $arguments2Array(arguments);
        if (this.tncEulaAccepted)
            if (b) {
                var f = this;
                this.getProvider().done(function(a) {
                    e[1] = a;
                    f._realCallNimbusService.apply(f, e).done(function() {
                        d.resolve.apply(d, arguments)
                    }).fail(function() {
                        d.reject()
                    })
                }).fail(function() {
                    d.reject()
                })
            } else e[1] = {}, this._realCallNimbusService.apply(this,
                e).done(function() {
                d.resolve.apply(d, arguments)
            }).fail(function() {
                d.reject()
            });
        else d.reject();
        return d
    },
    _realCallNimbusService: function(a, b, c) {
        var d = this.getNimbusDataConverter(a),
            e = this.getNimbusServiceURL(a, c),
            f = this.getNimbusServiceMethod(a),
            g = $serviceUtils.overwriteMerge({}, this.nimbusParam, b, c),
            e = (window.$backgroundTask && $ajaxBackground || $ajax)[f]({
                url: e,
                param: g
            });
        if (d) {
            var h = this,
                k = $arguments2Array(arguments);
            k.splice(0, 2);
            e.done(function(a) {
                try {
                    return k.unshift(a), [d.apply(h, k)]
                } catch (b) {
                    return log("faild to transform nimbus response: ",
                        b), (new Deferred).reject()
                }
            })
        }
        return e
    },
    addNimbusProvider: function(a, b) {
        for (var c = !1, d = 0, e = a.length; !c && d < e; d++) c = a[d], c = !c.nimbus;
        var f = new Deferred;
        if (c) {
            for (var g = [], d = 0, e = a.length; d < e; d++) {
                var c = a[d],
                    h;
                try {
                    h = c.dvbsi.idType
                } catch (k) {
                    h = c.dvbsi.ID_DVB_S
                }
                g.push({
                    dvbsi: {
                        name: c.dvbsi.name,
                        channelType: c.dvbsi.channelType,
                        onid: c.dvbsi.onid,
                        tsid: c.dvbsi.tsid,
                        sid: c.dvbsi.sid,
                        ccid: c.dvbsi.ccid,
                        idType: h
                    }
                })
            }
            d = {
                channels: g,
                countryCode: b || $services.dvbsi.getISOCountryCode()
            };
            this._callNimbusService("addNimbusProvider", !1, d).done(function(b) {
                for (var c = 0, d = a.length; c < d; c++) $serviceUtils.overwriteMerge(a[c], b[c]);
                f.resolve(a)
            }).fail(function() {
                f.reject(a)
            })
        } else f.resolve(a);
        return f
    },
    getChannels: function(a) {
        return this.addNimbusProvider(a)
    },
    getRegions: function(a) {
        return this._callNimbusService("getCountryRegion", !1, $serviceUtils.overwriteMerge({}, {
            countryCode: a
        }))
    },
    getServices: function(a, b) {
        return this._callNimbusService("getServices", !1, $serviceUtils.overwriteMerge({}, {
            countryCode: a,
            region: b
        }), a)
    },
    getChannelsByProvider: function(a,
        b) {
        return this._callNimbusService("getServiceDetails", !a, $serviceUtils.overwriteMerge({
            includedvb: !!b
        }, a))
    },
    _addProgramId: function(a) {
        var b = new Deferred;
        a.nimbus && a.nimbus.ProgramId || !a.channel || !a.channel.nimbus ? b.resolve(a) : this.getPrograms([a.channel], a.startDate, a.endDate, 1).done(function(c) {
            $serviceUtils.mergeData(a, c[a.id]);
            a.nimbus && a.nimbus.ProgramId ? b.resolve(a) : b.reject(a)
        }).fail(function() {
            b.reject(a)
        });
        return b
    },
    getPrograms: function(a, b, c, d) {
        a = a.filter(function(a) {
            return a && a.nimbus &&
                a.nimbus.SourceId
        });
        var e = new Deferred;
        this._getProgramsRecurs(e, [], a, b, c, d, 0);
        return e
    },
    _getProgramsRecurs: function(a, b, c, d, e, f, g) {
        var h = this;
        this._getPrograms(c, d, e, f).done(function(k) {
            h._filterProgram(b, k, {
                startDate: d,
                endDate: e,
                minResult: f
            });
            k = h._notEnougthProgram(b, c, f);
            0 === k.length || 3 < g ? a.resolve(b) : (d = e, e = $dateUtils.add(e, h.NIMBUS_BLOCK_SIZE, "h"), h._getProgramsRecurs(a, b, k, d, e, f, g + 1))
        }).fail(function() {
            0 < b.length ? a.resolve(b) : a.reject()
        })
    },
    _notEnougthProgram: function(a, b, c) {
        for (var d = [], e = 0,
                f = b.length; e < f; e++) {
            var g = b[e],
                h = a[g.id];
            (!h || h.length < c) && d.push(g)
        }
        return d
    },
    _filterProgram: function(a, b, c) {
        for (var d = 0, e = b.length; d < e; d++) {
            var f = b[d],
                g = f.id,
                h = f.startDate = $dateUtils.toDate(f.startDate),
                k = $dateUtils.toDate(f.endDate),
                l = a[f.channel.id] = a[f.channel.id] || [];
            void 0 === a[g] && ($dateUtils.gt(f.startDate, c.startDate) || $dateUtils.isOrdered(f.startDate, c.startDate, f.endDate)) && (c.minResult > l.length || $dateUtils.isOrdered(c.startDate, h, c.endDate) || $dateUtils.isOrdered(c.startDate, k, c.endDate) ||
                $dateUtils.isOrdered(h, c.startDate, c.endDate, k)) && (a[g] = f, a.push(f), l.push(f))
        }
    },
    sortProgram: function(a) {
        a.sort(function(a, c) {
            return $dateUtils.gap(c.startDate, a.startDate)
        });
        return a
    },
    _getPrograms: function(a, b, c) {
        var d = new Deferred;
        if (a && 0 !== a.length) {
            for (var e = {}, f = 0; f < a.length; f++) {
                var g = a[f];
                (e[g.nimbus.SourceId] = e[g.nimbus.SourceId] || []).push(g)
            }
            f = [];
            b = $dateUtils.toDate(b);
            for (b = $dateUtils.roundTimeUTC(b, this.NIMBUS_BLOCK_SIZE); $dateUtils.le(b, c);) f.push(this.getProgramInCacheOrNimbus(a, b, e)),
                b = $dateUtils.add(b, this.NIMBUS_BLOCK_SIZE, "h");
            Deferred.all.apply(void 0, f).always(function() {
                for (var a = [], b = 0, c = arguments.length; b < c; b++) a.push.apply(a, arguments[b][0]);
                d.resolve(a)
            })
        } else d.resolve([]);
        return d
    },
    getProgramsCacheKey: function(a, b) {
        return a.id + "_" + $dateUtils.toDate(b).toJSON()
    },
    getProgramInCacheOrNimbus: function(a, b, c) {
        for (var d = new Deferred, e = [], f = 0, g = a.length; f < g; f++) {
            var h = a[f],
                k = this.getProgramsCacheKey(h, b),
                h = this.cache.getAsDeferred(k, h);
            e.push(h)
        }
        var l = this;
        Deferred.all.apply(void 0,
            e).always(function() {
            for (var e = [], f = [], g = 0, h = arguments.length; g < h; g++) {
                var k = arguments[g];
                "resolved" === k.deferred.state() ? e.push.apply(e, k[0].programs) : f.push(k[1].nimbus.SourceId)
            }
            0 === f.length ? d.resolve(e) : (g = l._getProvider(a), l._callNimbusService("getGridSchedule", !g, $serviceUtils.overwriteMerge({
                SourceIds: f.join(" "),
                startDate: b.toJSON()
            }, g), c).done(function(a) {
                for (var b = Object.keys(a), c = 0, f = b.length; c < f; c++) {
                    var g = b[c],
                        h = a[g];
                    l.sortProgram(h.programs);
                    l.cache.set(g, h);
                    e.push.apply(e, h.programs)
                }
                d.resolve(e)
            }).fail(function() {
                d.resolve(e)
            }))
        });
        return d
    },
    getProgramDetails: function(a) {
        var b = a.id + "-details",
            c = this,
            d = this.cache.getAsDeferred(b).fail(function() {
                return c._addProgramId(a).done(function(a) {
                    return c._callNimbusService("getProgramDetails", !1, a.nimbus, a).done(function(a) {
                        c.cache.set(b, a)
                    })
                })
            }),
            e = new Deferred;
        d.fail(function() {
            e.reject(a)
        }).done(function(b) {
            var c = $serviceUtils.overwriteMerge(a, b);
            $imageUtils.switchImage(c, "image").always(function() {
                e.resolve(c)
            })
        });
        return e
    },
    getPeople: function(a) {
        var b = a.id + "-people",
            c = this;
        return this.cache.getAsDeferred(b).fail(function() {
            return c._addProgramId(a).done(function(a) {
                return c._callNimbusService("getMiniSocketCastAndCrew", !0, $serviceUtils.overwriteMerge({}, a.nimbus), a.nimbus).done(function(a) {
                    c.cache.set(b, a)
                })
            })
        })
    },
    getPersonDetails: function(a) {
        var b = a.id + "-details",
            c = this,
            d = this.cache.getAsDeferred(b).fail(function() {
                return c._callNimbusService("getCelebrityDetails", !0, $serviceUtils.overwriteMerge({}, a.nimbus), a.nimbus).done(function(a) {
                    c.cache.set(b, a)
                })
            });
        d.done(function(a) {
            return $imageUtils.switchImage(a, "photoUrl")
        });
        return d
    },
    getPhotosForProgram: function(a) {
        var b = a.id + "-photos",
            c = this,
            d = this.cache.getAsDeferred(b).fail(function() {
                return c._addProgramId(a).done(function(a) {
                    return c._callNimbusService("getMiniSocketPhotosForProgram", !0, $serviceUtils.overwriteMerge({}, a.nimbus)).done(function(a) {
                        c.cache.set(b, a)
                    })
                })
            });
        d.done(function(a) {
            return $imageUtils.switchImage(a, "photoUrl")
        }).done(function(b) {
            a.photos = b
        }).always(function() {
            return a
        });
        return d
    },
    getPhotosForPerson: function(a) {
        var b = a.id + "-photos",
            c = this,
            d = this.cache.getAsDeferred(b).fail(function() {
                return c._callNimbusService("getMiniSocketPhotosForPerson", !0, $serviceUtils.overwriteMerge({}, a.nimbus)).done(function(a) {
                    c.cache.set(b, a)
                })
            });
        d.done(function(a) {
            return $imageUtils.switchImage(a,
                "photoUrl")
        }).done(function(b) {
            a.photos = b
        }).always(function() {
            return a
        });
        return d
    },
    getAiringWorkForPerson: function(a) {
        return this._callNimbusService("getMiniSocketCredits", !0, a.nimbus).done(function(b) {
            a.work = b
        }).always(function() {
            return a
        })
    },
    searchCelebritiesPrograms: function(a, b, c, d, e, f, g, h, k, l) {
        return this._callNimbusService("searchCelebritiesPrograms", !0, {
            searchstring: a,
            fuzzy: b,
            includeadult: c,
            progsources: d,
            start: e,
            num: f,
            type: g,
            cspids: h,
            primarykeywordid: k,
            category: l
        })
    },
    searchCandidates: function(a,
        b, c, d) {
        return this._callNimbusService("searchCandidates", !0, {
            searchstring: a,
            includeadult: b,
            type: c,
            cspids: d
        })
    },
    getStatus: function() {
        return this.Status
    },
    nimbusServicePath: {
        addNimbusProvider: {
            url: window.NIMBUS_FIND_PROVIDER,
            method: "post"
        },
        status: {
            url: window.NIMBUS_LISTINGS_HOST + "/status.%{country}s.json"
        },
        getCountryRegion: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/nimbuscountryregions/info",
            converter: function(a) {
                a = a.CountryRegionsResult.Regions;
                for (var b = [], c = 0, d = a.length; c < d; c++) b.push(a[c].headend_city);
                return b
            }
        },
        getServices: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/services/info",
            converter: function(a, b, c) {
                a = a.ServicesResult.Services.Service;
                b = [];
                for (var d = 0, e = a.length; d < e; d++) {
                    var f = a[d];
                    switch (f.ChannelDevice) {
                        case "Y":
                        case "X":
                        case "S":
                            b.push({
                                id: this.getServiceUID(f),
                                nimbus: {
                                    countryCode: c,
                                    channelDevice: f.ChannelDevice,
                                    headendId: f.HeadendId
                                },
                                city: f.City,
                                mso: f.MSO,
                                name: f.Name,
                                type: f.Type
                            })
                    }
                }
                return b
            }
        },
        getServiceDetails: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/nimbusservicedetails/info",
            converter: function(a,
                b) {
                for (var c = [], d = a.ServiceDetailsResult.ChannelLineups[0], e = d.Channels, f = {}, g = 0, h = e.length; g < h; g++) {
                    var k = e[g];
                    if ("Y" !== k.IsSdDuplicate) {
                        var l = k.SourceId;
                        f[l] || (f[l] = !0, l = new Channel(k, {
                            countryCode: b.countryCode,
                            SourceId: k.SourceId,
                            channelDevice: d.ChannelDevice || null,
                            headendId: d.HeadendId || null
                        }), b.includedvb && (l.dvb = k.DVBTNList), c.push(l))
                    }
                }
                return c
            }
        },
        getEPGStatus: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/nimbusepgstatus/info"
        },
        getGridSchedule: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/nimbusgridschedule/info",
            converter: function(a, b, c) {
                var d = {};
                a = a.GridScheduleResult.GridChannelLineups[0];
                var e = a.GridChannels,
                    f = $dateUtils.toDate(a.StartDate),
                    g = 6E4 * a.Duration;
                if (e)
                    for (var h = 0, k = e.length; h < k; h++)
                        for (var l = e[h], m = l.SourceId, n = c[m], p = 0, r = n.length; p < r; p++) {
                            for (var t = n[p], v = l.Airings, w = [], u = 0, x = v.length; u < x; u++) {
                                var q = v[u],
                                    q = {
                                        nimbus: {
                                            countryCode: b.countryCode,
                                            ProgramId: q.ProgramId,
                                            SourceId: m,
                                            AiringTime: q.AiringTime,
                                            channeldevice: a.ChannelDevice,
                                            headendid: a.HeadendId
                                        },
                                        channel: t,
                                        startDate: $dateUtils.toDate(q.AiringTime),
                                        endDate: $dateUtils.add(q.AiringTime, q.Duration, "m"),
                                        duration: q.Duration,
                                        category: q.Category,
                                        genre: q.Genre,
                                        title: q.Title,
                                        episodeTitle: q.EpisodeTitle,
                                        sportsSubtitle: q.SportsSubtitle
                                    };
                                q.id = $services.program.getProgramId(q);
                                w.push(q)
                            }
                            t = this.getProgramsCacheKey(t, f);
                            d[t] = {
                                startDate: f,
                                endDate: $dateUtils.add(f, g),
                                step: g,
                                programs: w
                            }
                        }
                return d
            }
        },
        getProgramDetails: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/nimbusprogramdetails/info",
            converter: function(a, b, c) {
                a = (a = a.ProgramDetailsResult.Programs[0]) && a.ProgramDetails || {};
                !c.nimbus.AiringTime && a.AiringTime && (c.nimbus.AiringTime = a.AiringTime);
                return {
                    genre: a.Genre,
                    category: a.Category,
                    episodeTitle: a.EpisodeTitle,
                    sportsSubtitle: a.SportsSubtitle,
                    description: a.CopyText,
                    releaseYear: a.ReleaseYear,
                    image: a.PublicImageUrl,
                    programLanguage: a.ProgramLanguage,
                    episode: a.EpisodeNumber,
                    season: a.SeasonNumber,
                    starRating: a.StarRating
                }
            }
        },
        getCelebrityDetails: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/celebritydetails/info",
            converter: function(a, b, c) {
                a = a.CelebrityDetailsResult;
                b = a.Details &&
                    a.Details.join("</p><p>");
                b = "<p>" + b + "</p>";
                return {
                    id: a.id,
                    nimbus: c,
                    name: a.FullName,
                    birthName: a.BirthName,
                    birthPlace: a.BirthPlace,
                    birthDate: a.DateOfBirth && $dateUtils.toDate(a.DateOfBirth),
                    deathDate: a.DateOfDeath && $dateUtils.toDate(a.DateOfDeath),
                    details: b,
                    photoCredits: a.PhotoCredits,
                    photoUrl: a.PhotoUrl,
                    zodiac: a.Zodiac
                }
            }
        },
        getFavoritePhotoList: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/favoritephotolist/info"
        },
        getMiniSocketCastAndCrew: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/msprogramcast/info",
            converter: function(a, b, c) {
                a = a.MiniSocketCastnCrewResult.CastnCrew;
                b = [];
                for (var d = 0, e = a.length; d < e; d++) {
                    var f = a[d],
                        g = $serviceUtils.overwriteMerge({
                            CreditId: f.CreditId
                        }, c);
                    b.push({
                        id: this.getPersonUID(f),
                        nimbus: g,
                        type: f.CreditType,
                        name: f.FullName
                    })
                }
                return b
            }
        },
        getMiniSocketCredits: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/mscredit/info",
            converter: function(a, b) {
                for (var c = a.CreditResult.Credits[0], d = c.CreditType, e = [], f, g, h = 0, k = d.length; h < k; h++) {
                    var l = d[h];
                    f = {
                        creditTypeName: l.CreditTypeName,
                        programs: []
                    };
                    e.push(f);
                    for (var m = 0, n = l.Program.length; m < n; m++) g = l.Program[m], f.programs.push({
                        id: g.ProgramId,
                        nimbus: {
                            countryCode: b.countryCode,
                            uid: g.ProgramId,
                            ProgramId: g.ProgramId,
                            headendid: c.HeadendId
                        },
                        programTitle: g.ProgramTitle,
                        releaseYear: g.ReleaseYear,
                        scheduled: g.Scheduled
                    })
                }
                return e
            }
        },
        getMiniSocketPhotosForProgram: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/msprogramphotos/info",
            converter: function(a) {
                a = a.MiniSocketPhotosForProgramResult.PhotosForProgram;
                for (var b = [], c = 0, d = a.length; c < d; c++) {
                    var e = a[c];
                    b.push({
                        photoCredit: e.PhotoCredits,
                        photoUrl: e.PhotoUrl
                    })
                }
                return b
            }
        },
        getMiniSocketPhotosForPerson: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/mspersonphotos/info",
            converter: function(a) {
                a = a.MiniSocketPhotosForPersonResult.PhotosForPerson;
                for (var b = [], c = 0, d = a.length; c < d; c++) {
                    var e = a[c];
                    b.push({
                        photoCredit: e.PhotoCredits,
                        photoUrl: e.PhotoUrl
                    })
                }
                return b
            }
        },
        getMiniSocketSeries: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/msseries/info"
        },
        getMiniSocketEPG: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/msepg/info"
        },
        getMiniSocketKeyword: {
            url: window.NIMBUS_LISTINGS_HOST +
                "/listings/mskeyword/info"
        },
        getMiniSocketSports: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/mssports/info"
        },
        getHotList: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/hotlist/info"
        },
        getMovieHotlist: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/moviehotlist/info"
        },
        getFamilyHotlist: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/familyhotlist/info"
        },
        getSportsHotlist: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/sportshotlist/info"
        },
        getProgramPicture: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/programpicture/info"
        },
        getRemindPicture: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/remindpicture/info"
        },
        "getVODInfo ": {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/nimbusvodinfo/info"
        },
        getVODHotlist: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/vodhotlist/info"
        },
        getVODCSPList: {
            url: window.NIMBUS_LISTINGS_HOST + "/listings/vodcsplist/info"
        },
        searchCandidates: {
            url: window.NIMBUS_SEARCH_HOST + "/searchcandidate",
            converter: function(a) {
                return a.SearchCandidateResult.candidates
            }
        },
        searchCelebritiesPrograms: {
            url: window.NIMBUS_SEARCH_HOST +
                "/searchcelebprog",
            converter: function(a) {
                return a.SearchCelebProgResult.results.matches
            }
        }
    }
});
ChannelService = $class(Service, {
    CACHE_KEY_CHANNELS: "channels",
    init: function() {
        this.parent();
        this.cache = $cacheFactory.get("channels");
        $services.tnc.subscribe(this)
    },
    onEulaChange: function() {
        log("Clear channel cache");
        this.cache.clear();
        this.getChannelsDeferred = null;
        return !0
    },
    _fireTuningChange: function() {
        this.publish("tuningChange")
    },
    getCurrentChannel: function() {
        return $services.videobcast.getCurrentChannelId().done(this.getChannelById.bind(this))
    },
    setCurrentChannel: function(a) {
        var b = new Deferred,
            c = this;
        $services.videobcast.subscribe({
            channelChange: function(a, e, f) {
                c.getChannelById(f).always(function(a) {
                    0 <= e ? b.reject(a, e) : b.resolve(a, e);
                    c.publish("channelChange", e, a)
                })
            }
        });
        $services.videobcast.setCurrentChannelById(a.id);
        return b
    },
    getChannelById: function(a) {
        var b = new Deferred,
            c = $arguments2Array(arguments);
        this.getChannels().done(function(a, e, f) {
            a = [];
            f = 0;
            for (var g = c.length; f < g; f++) a.push(e[c[f]]);
            b.resolve.apply(b, a)
        }).fail(function() {
            b.reject.apply(b, c)
        });
        return b
    },
    getChannels: function() {
        if (this.getChannelsDeferred) return this.getChannelsDeferred;
        var a = this.getChannelsDeferred = new Deferred,
            b = this;
        this.cache.getAsDeferred(this.CACHE_KEY_CHANNELS).done(function(c) {
            return $services.dvbsi.getChannels().fail(function() {
                a.resolve(c)
            }).done(function(d) {
                for (var e = d.length !== c.length, f = 0, g = c.length; !e && f < g; f++) e = c[f].name !== d[f].name;
                if (e) return b.cache.clear(), b._fireTuningChange(), (new Deferred).reject();
                a.resolve(c)
            })
        }).fail(function() {
            b._realGetChannels().done(function(b) {
                a.resolve(b)
            }).fail(function() {
                a.reject()
            })
        });
        a.done(function(a) {
            return b._createChannelsResult(a)
        }).fail(function() {
            b.getChannelsDeferred =
                null
        });
        return a
    },
    updateChannels: function() {
        var a = new Deferred,
            b = this,
            c = this.getChannelsDeferred;
        c.resolved ? c.always(function(c) {
            b._realGetChannels(!0).done(function(e) {
                b._isSameChannels(c, e) ? a.reject() : (e = b._createChannelsResult(e), b.getChannelsDeferred = a, a.resolve.apply(a, e), b._fireTuningChange())
            }).fail(function() {
                a.reject()
            })
        }) : a.reject();
        return a
    },
    _isSameChannels: function(a, b) {
        var c = a && b && a.length === b.length;
        if (c)
            for (var d = 0, e = a.length; d < e && c; d++) c = this._isSameChannel(a[d], b[d]);
        return c
    },
    _isSameChannel: function(a,
        b) {
        return a.id === b.id && a.name === b.name && a.logo === b.logo && a.nimbus && b.nimbus && a.nimbus.SourceId === b.nimbus.SourceId
    },
    _createChannelsResult: function(a) {
        for (var b = [], c = {}, d = 0, e = a.length; d < e; d++) {
            var f = a[d];
            c[f.id] = f;
            b[f.number] = f
        }
        return [a, c, b]
    },
    _realGetChannels: function(a) {
        var b = new Deferred,
            c = this;
        $services.dvbsi.getChannels().done(function(d) {
            $services.nimbus.getChannels(d).done(function(a) {
                $imageUtils.switchImage(a, "logo", c.cache).always(function(a) {
                    c.cache.set(c.CACHE_KEY_CHANNELS, a);
                    b.resolve(a)
                })
            }).fail(function() {
                a ?
                    b.reject() : (c.cache.set(c.CACHE_KEY_CHANNELS, d), b.resolve(d))
            })
        }).fail(function() {
            b.reject()
        });
        return b
    },
    getChannelDetails: function(a) {
        var b = new Deferred;
        this.getChannels().done(function(c, d, e) {
            (c = d[a]) ? b.resolve(c): b.reject()
        }).fail(function() {
            b.reject()
        });
        return b
    },
    getMaxChannelDigitsForInput: function(a) {
        var b = new Deferred;
        this.getChannels().done(function(c) {
            var d = 1,
                e = ~~(Math.log(a) / Math.LN10 + 1);
            c.forEach(function(b) {
                var c = b.number;
                b = ~~(Math.log(c) / Math.LN10 + 1);
                c = Math.floor(c / Math.pow(10, b - e));
                a > c && b--;
                d = Math.max(d, b)
            });
            b.resolve(d)
        });
        return b
    },
    getChannelForNumber: function(a) {
        var b = new Deferred;
        this.getChannels().done(function(c, d, e) {
            (c = e[a]) ? b.resolve(c): b.reject()
        }).fail(function() {
            b.reject()
        });
        return b
    }
});
ProgramService = $class(Service, {
    BASE: "id title duration startDate endDate channel".split(" "),
    DETAILS: "description category episode genre image releaseYear episodeTitle sportsSubtitle programLanguage".split(" "),
    RATING: ["starRating"],
    PHOTOS: ["photos"],
    fieldProvider: {
        id: {
            create: []
        },
        channel: {
            create: []
        },
        title: {
            create: ["$services.dvbsi.getPrograms"],
            createFallback: ["$services.nimbus.getPrograms"]
        },
        duration: {
            create: ["$services.dvbsi.getPrograms"],
            createFallback: ["$services.nimbus.getPrograms"]
        },
        startDate: {
            create: ["$services.dvbsi.getPrograms"],
            createFallback: ["$services.nimbus.getPrograms"]
        },
        endDate: {
            create: ["$services.dvbsi.getPrograms"],
            createFallback: ["$services.nimbus.getPrograms"]
        },
        description: {
            create: ["$services.dvbsi.getPrograms"],
            update: ["$services.nimbus.getProgramDetails"]
        },
        category: {
            create: ["$services.nimbus.getPrograms"],
            update: ["$services.nimbus.getProgramDetails"]
        },
        episode: {
            create: ["$services.dvbsi.getPrograms"],
            update: ["$services.nimbus.getProgramDetails"]
        },
        totalEpisodes: {
            create: ["$services.dvbsi.getPrograms"]
        },
        genre: {
            create: ["$services.nimbus.getPrograms"],
            update: ["$services.nimbus.getProgramDetails"]
        },
        image: {
            update: ["$services.nimbus.getProgramDetails"]
        },
        releaseYear: {
            update: ["$services.nimbus.getProgramDetails"]
        },
        episodeTitle: {
            create: ["$services.nimbus.getPrograms"],
            update: ["$services.nimbus.getProgramDetails"]
        },
        sportsSubtitle: {
            create: ["$services.nimbus.getPrograms"],
            update: ["$services.nimbus.getProgramDetails"]
        },
        programLanguage: {
            update: ["$services.nimbus.getProgramDetails"]
        },
        starRating: {
            update: ["$services.nimbus.getProgramDetails"]
        },
        photos: {
            update: ["$services.nimbus.getPhotosForProgram"]
        }
    },
    getCurrentAndNextProgram: function(a) {
        var b = $arguments2Array(arguments).slice(this.getCurrentAndNextProgram.length),
            c = [a, Date.now(), Date.now(), 2];
        c.push.apply(c, b);
        return this.getPrograms.apply(this, c)
    },
    getPrograms: function(a, b, c, d) {
        a = a.filter(function(a) {
            return a
        });
        if (a.length) {
            var e = $arguments2Array(arguments).slice(this.getPrograms.length),
                f = {
                    result: []
                };
            f.merge = this._mergeProgramList.bind(this, f.result);
            f.enougthResult = this._enougthResult.bind(this, a, {
                startDate: b,
                endDate: c,
                minResult: d
            }, f);
            e = this._populateProgram("create",
                e, {}, [a, b, c, d], f)
        } else e = (new Deferred).resolve([]);
        return e
    },
    getFakePrograms: function(a, b, c, d) {
        var e = [];
        a = a.slice(0);
        a.sort(function(a, b) {
            return a.index - b.index
        });
        for (var f = a.shift(), g = b, h = 0, k = d.length; f && h < k; h++) {
            var l = d[h];
            l.channel.id === f.id ? ($dateUtils.lt(g, l.startDate) && e.push(this.createFakeProgram(f, g, l.startDate)), g = l.endDate) : ($dateUtils.lt(g, c) && e.push(this.createFakeProgram(f, g, c)), h--, f = a.shift(), g = b)
        }
        return e
    },
    createFakeProgram: function(a, b, c) {
        var d = $dateUtils.gap(b, c, "m");
        a = {
            fake: !0,
            channel: a,
            startDate: b,
            endDate: c,
            duration: d
        };
        a.id = this.getProgramId(a);
        return a
    },
    updatePrograms: function(a) {
        for (var b = $arguments2Array(arguments).slice(this.updatePrograms.length), c = [], d = 0, e = a.length; d < e; d++) {
            var f = a[d];
            if (!f.fake) {
                var g = {};
                g.result = f;
                g.merge = $serviceUtils.mergeData.bind(this, g.result);
                g.enougthResult = function() {
                    return !0
                };
                c.push(this._populateProgram("update", b, f, [f], g))
            }
        }
        var h = new Deferred;
        Deferred.all.apply(void 0, c).done(function() {
            h.resolve(a)
        }).fail(function() {
            h.reject(a)
        });
        return h
    },
    updateNode: function(a, b, c) {
        var d = Object.keys(b);
        return this.updatePrograms.bind(this, [a]).apply(this, d).always(function(a) {
            if (c.call(this)) {
                a = a[0];
                for (var f = 0, g = d.length; f < g; f++) {
                    var h = d[f];
                    if (a[h]) {
                        var k = b[h];
                        Array.isArray(k) || (k = [k]);
                        for (var l = 0, m = k.length; l < m; l++) {
                            var n = $id(k[l]);
                            n && (n.innerHTML = a[h])
                        }
                    }
                }
            }
        })
    },
    _populateProgram: function(a, b, c, d, e) {
        b = $serviceUtils.flatten(new Set, b);
        c = Object.keys(c);
        for (var f = 0, g = c.length; f < g; f++) b.delete(c[f]);
        c = new Set;
        var h = new Set,
            k = $serviceUtils.flatten.bind($serviceUtils,
                c),
            l = $serviceUtils.flatten.bind($serviceUtils, h),
            m = this;
        b.forEach(function(b) {
            var c = m.fieldProvider[b][a];
            c && k(c);
            if (c = m.fieldProvider[b][a + "Fallback"]) k(c), l(c)
        });
        var n = new Deferred;
        this._callProviders(c, d, e).done(function() {
            n.resolve(e.result)
        }).fail(function() {
            m._callProviders(h, d, e).done(function() {
                n.resolve(e.result)
            }).fail(function() {
                n.reject(e.result)
            })
        });
        return n
    },
    _callProviders: function(a, b, c) {
        var d = this,
            e = [];
        a.forEach(function(a) {
            e.push(d._call(a, b, c))
        });
        var f = new Deferred;
        Deferred.all.apply(void 0,
            e).done(function() {
            c.enougthResult() ? f.resolve(c.result) : f.reject(c.result)
        }).fail(function() {
            f.reject(c.result)
        });
        return f
    },
    _call: function(a, b, c) {
        a = a.split(".");
        a.unshift(window);
        for (var d = 1, e = a.length; d < e; d++) a[d] = a[d - 1][a[d]];
        return a[a.length - 1].apply(a[a.length - 2], b).done(function(a) {
            c.merge(a)
        })
    },
    _enougthResult: function(a, b, c) {
        for (var d = !1, e = 0, f = a.length; !d && e < f; e++) {
            var g = c.result[a[e].id];
            if (g && g.length >= b.minResult) {
                if (g = g[g.length - 1], !g || $dateUtils.lt(g.endDate, b.endDate)) d = !0
            } else d = !0
        }
        return !d
    },
    _mergeProgramList: function(a, b) {
        for (var c = 0, d = b.length; c < d; c++) {
            var e = b[c],
                f = a[e.id];
            f ? $serviceUtils.mergeData(f, e) : (a[e.id] = e, a.push(e), f = a[e.channel.id] = a[e.channel.id] || [], f.push(e), f.sort(function(a, b) {
                return $dateUtils.gap(b.startDate, a.startDate)
            }))
        }
    },
    getProgramId: function(a) {
        var b = "prog-" + a.channel.id + "-" + $dateUtils.toNumber(a.startDate) + "-" + $dateUtils.toNumber(a.endDate) + "-";
        return b = a.title ? b + a.title.trim().substring(0, 10).toUpperCase().toASCII().replace(/[^a-zA-Z0-9]/g, "") : b + "unknown"
    },
    compareProgram: function(a, b) {
        if (a === b) return 0;
        if (!a) return -1;
        if (!b) return 1;
        var c = a.channel.index - b.channel.index;
        c || (c = $dateUtils.compare(a.startDate, b.startDate));
        return c
    }
});
CastNCrewService = $class(MultiProviderService, {
    BASE: ["id", "name", "type"],
    DETAILS: "birthName birthPlace birthDate deathDate details photoCredits photoUrl zodiac".split(" "),
    PHOTOS: ["photos"],
    WORK: ["work"],
    fieldProvider: {
        id: {
            create: ["$services.nimbus.getPeople"]
        },
        name: {
            create: ["$services.nimbus.getPeople"],
            update: ["$services.nimbus.getPersonDetails"]
        },
        type: {
            create: ["$services.nimbus.getPeople"]
        },
        birthName: {
            update: ["$services.nimbus.getPersonDetails"]
        },
        birthPlace: {
            update: ["$services.nimbus.getPersonDetails"]
        },
        birthDate: {
            update: ["$services.nimbus.getPersonDetails"]
        },
        deathDate: {
            update: ["$services.nimbus.getPersonDetails"]
        },
        details: {
            update: ["$services.nimbus.getPersonDetails"]
        },
        photoCredits: {
            update: ["$services.nimbus.getPersonDetails"]
        },
        photoUrl: {
            update: ["$services.nimbus.getPersonDetails"]
        },
        zodiac: {
            update: ["$services.nimbus.getPersonDetails"]
        },
        photos: {
            update: ["$services.nimbus.getPhotosForPerson"]
        },
        work: {
            update: ["$services.nimbus.getAiringWorkForPerson"]
        }
    },
    getPeople: function(a) {
        var b = $arguments2Array(arguments).slice(this.getPeople.length),
            c = {
                result: []
            };
        c.merge = this._mergePeopleList.bind(this, c.result);
        return this._populateData("create", b, {}, [a], c)
    },
    updatePeople: function(a) {
        for (var b = $arguments2Array(arguments).slice(this.updatePeople.length), c = [], d = 0, e = a.length; d < e; d++) {
            var f = a[d],
                g = {};
            g.result = f;
            g.merge = $serviceUtils.mergeData.bind(this, g.result);
            c.push(this._populateData("update", b, f, [f], g))
        }
        var h = new Deferred;
        Deferred.all.apply(void 0, c).done(function() {
            h.resolve(a)
        }).fail(function() {
            h.reject(a)
        });
        return h
    },
    _mergePeopleList: function(a,
        b) {
        for (var c = 0, d = b.length; c < d; c++) {
            var e = b[c],
                f = a[e.id];
            f ? $serviceUtils.mergeData(f, e) : (a[e.id] = e, a.push(e))
        }
    }
});
AbstractScheduledRecordingService = $class(Service, {
    removeDeferreds: {},
    SRList: [],
    _updateNativeList: $nop,
    _resetSeriesMap: $nop,
    seriesMap: $nop,
    load: function() {
        this._updateSRList()
    },
    sort: function() {
        this.SRList.length && this.SRList.sort(function(a, b) {
            return a.startTime - b.startTime
        })
    },
    getScheduledRecordingBySeries: function(a) {
        return this.SRList.filter(function(b) {
            return (b = $mgrUtils.unmakeCustomId(b.customID)) && b.seriesId && b.seriesId == a
        })
    },
    _updateSRList: function() {
        var a = this;
        this._resetSeriesMap();
        this.SRList =
            this._updateNativeList();
        this.sort();
        this.SRList.length && this.SRList.forEach(function(b) {
            (b = $mgrUtils.unmakeCustomId(b.customID)) && b.seriesId && $mgrUtils.updateSeriesMap(a.seriesMap, b.seriesId)
        })
    }
});
PVREventService = $class(Service, {
    init: function() {
        this.parent();
        this.oipfRSObj = oipfObjectFactory.createRecordingSchedulerObject();
        document.addEventListener("PVREvent", this.onPvrEvent.bind(this))
    },
    load: function() {
        this.oipfRSObj.onPVREvent = this.onPVREvent
    },
    onPvrEvent: function(a) {
        this.publish(a)
    }
});
RemovableDeviceService = $class(Service, {
    EVENT: ["removableDeviceConnected", "removableDeviceDisconnected", "mediaFileReadProgressCompletedEvent", "mediaFileReadProgressEvent"],
    init: function() {
        this.parent();
        this.oipfRSObj = $services.pvrEvent.oipfRSObj;
        this.storageManager = StorageManager;
        var a = this;
        this.EVENT.forEach(function(b) {
            a.storageManager.addEventListener(b, function(c) {
                a.onDiscEvent(c, b)
            })
        })
    },
    onDiscEvent: function(a, b) {
        console.log("----DISC SERVICE EVENT----");
        console.log(a);
        console.log(b);
        console.log("--------------------------");
        this.publish(b)
    },
    getInfo: function() {
        return this.oipfRSObj.discInfo
    },
    getInfoPercent: function() {
        var a = this.getInfo();
        return a && 0 < a.total ? 100 - (100 / (a.total / a.free)).toFixed(0) : null
    },
    getList: function() {
        return this.storageManager.getListOfAvailableStorages()
    }
});
PVRService = $class(AbstractScheduledRecordingService, {
    EVENT_RECORDING_STATE: {
        STARTED: 1,
        STOPPED: 2,
        RESOURCE_LIMITATION: 3,
        INSUFFICIENT_STATE: 4,
        UNCOMPLETE_BY_UNKNOWN: 6,
        NEW_SCHEDULED: 7,
        DELETED: 8,
        DUE_TO_START: 9,
        UPDATED: 10,
        STORAGE_RELOAD: 888
    },
    RECORDING_STATE: {
        RECORDING_SCHEDULED: 0,
        RECORDING_REC_STARTED: 1,
        RECORDING_REC_COMPLETED: 2,
        RECORDING_REC_PARTIALLY_COMPLETED: 3,
        RECORDING_ERROR: 4
    },
    SRList: [],
    OFFSET_DAY: 864E5,
    init: function() {
        this.parent();
        this.oipfRSObj = $services.pvrEvent.oipfRSObj;
        $services.pvrEvent.subscribe(this.onPvrEvent.bind(this));
        $services.removableDevice.subscribe(this.onDiscEvent.bind(this));
        this.seriesMap = $services.series.seriesMap.storage
    },
    _updateNativeList: function() {
        for (var a = this.oipfRSObj.recordings, b = a.length, c = [], d = 0; d < b; d++) c.push(a[d]);
        return c
    },
    _resetSeriesMap: function() {
        $services.series.seriesMap.storage = {};
        this.seriesMap = $services.series.seriesMap.storage
    },
    onPvrEvent: function(a) {
        $services.pvrEvent.subscribe(this.onPvrEvent.bind(this));
        a = a.detail;
        var b = a.recording;
        switch (a.state) {
            case this.EVENT_RECORDING_STATE.STOPPED:
                this._updateSRList();
                console.log("recording rec completed: added to SRList: " + b);
                break;
            case this.EVENT_RECORDING_STATE.STARTED:
                this._updateSRList();
                console.log("recording rec started: added to SRList: " + b);
                break;
            case this.EVENT_RECORDING_STATE.DELETED:
                this._updateSRList();
                var c = this.removeDeferreds[b.id];
                c && c.resolve();
                console.log("recording rec deleted: added to SRList: " + b)
        }
        this.publish(a)
    },
    onDiscEvent: function(a) {
        $services.removableDevice.subscribe(this.onDiscEvent.bind(this));
        this._updateSRList();
        this.publish()
    },
    stopRecording: function(a) {
        this.oipfRSObj.stopRecording(a)
    },
    deleteRecording: function(a) {
        var b = new Deferred;
        this.removeDeferreds[a.id] = b;
        if (a.state == this.RECORDING_STATE.RECORDING_REC_STARTED || a.state == this.RECORDING_STATE.RECORDING_REC_COMPLETED || a.state == this.RECORDING_STATE.RECORDING_REC_PARTIALLY_COMPLETED) a.state == this.RECORDING_STATE.RECORDING_REC_STARTED && this.stopRecording(a.id), this.oipfRSObj.remove(a);
        return b
    },
    removeByRecordingID: function(a) {
        new Deferred;
        var b = this.SRList.filter(function(b) {
            return b.id ==
                a
        });
        return b.length ? this.deleteRecording(b[0]) : (new Deferred).reject()
    },
    keepAutorec: function(a) {
        this.getRecordingById(a).doNotDelete = !0
    },
    applyFilters: function(a, b) {
        if (!b) return !0;
        var c = b.map(function(b) {
            return a[b[0]] == b[1]
        });
        return b.length ? c.reduce(function(a, b) {
            return a && b
        }) : !0
    },
    getRecording: function() {
        return this.SRList
    },
    getRecordingByID: function(a) {
        return this.SRList.filter(function(b) {
            return b.id == a
        })
    },
    getRecordingByGenre: function(a) {
        return this.SRList.filter(function(b) {
            return b.genre == a
        })
    },
    getRecordingsByDate: function(a, b, c) {
        var d = this;
        return this.SRList.filter(function(e) {
            return d.applyFilters(e, c) && 1E3 * e.startTime >= a && e.startTime <= b
        })
    },
    getAutorecsByDate: function(a) {
        return this.SRList.filter(function(b) {
            return $mgrUtils.unmakeCustomId(b.customID).isManual && 1E3 * b.startTime >= a && 1E3 * b.startTime <= endTime
        })
    },
    getLimitsOfCurrentMonth: function(a) {
        var b = (new Date).setHours(0, 0, 0),
            c = (new Date).getDay(),
            b = b - (0 == c ? 6 : c - 1) * this.OFFSET_DAY;
        a.push([new Date(b), new Date(b + 7 * this.OFFSET_DAY - 1E3)]);
        c = b - 7 * this.OFFSET_DAY;
        a.push([new Date(c), new Date(b - 1E3)]);
        b = new Date(c - 1E3);
        c = new Date(b.getFullYear(), b.getMonth(), 1);
        a.push([c, b]);
        return c
    },
    getRecordingsDateLimits: function() {
        var a = [],
            b = this.SRList,
            c = null,
            d;
        b.length && b.sort(function(a, b) {
            a = new Date(1E3 * a.startTime);
            b = new Date(1E3 * b.startTime);
            return a > b ? -1 : a < b ? 1 : 0
        });
        for (var e = 0, f = b.length; e < f; e++)
            if (d = new Date(1E3 * b[e].startTime), null == c || d.getFullYear() + d.getMonth() != c.getFullYear() + c.getMonth())
                if (null == c || d.getYear() < c.getYear() || d.getYear() ==
                    c.getYear() && d.getMonth() < c.getMonth()) c = [new Date(d.getFullYear(), d.getMonth(), 1), new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59)], a.push(c), c = c[0];
        return a
    },
    getGenres: function() {
        var a = [];
        this.SRList.forEach(function(b) {
            b.genre && a.push(b.genre)
        });
        return new Set(a.sort())
    }
});
ScheduleService = $class(AbstractScheduledRecordingService, {
    SRList: [],
    init: function() {
        this.parent();
        this.oipfRSObj = $services.pvrEvent.oipfRSObj;
        this.subscribePvrEventService();
        this.seriesMap = $services.series.seriesMap.schedule
    },
    _updateNativeList: function() {
        for (var a = this.oipfRSObj.getScheduledRecordings(), b = [], c = 0; c < a.length; c++) b.push(a[c]);
        return b
    },
    _resetSeriesMap: function() {
        $services.series.seriesMap.schedule = {};
        this.seriesMap = $services.series.seriesMap.schedule
    },
    subscribePvrEventService: function() {
        $services.pvrEvent.subscribe(this.onPvrEvent.bind(this))
    },
    _log: function(a, b) {
        console.log("-------------");
        console.log(a);
        console.log(b);
        console.log("-------------")
    },
    onPvrEvent: function(a) {
        this.subscribePvrEventService();
        a = a.detail;
        var b = a.recording;
        switch (a.state) {
            case this.oipfRSObj.EVENT_RECORDING_STATE.NEW_SCHEDULED:
                this._updateSRList();
                this._log("recording scheduled: added to SRList", b);
                break;
            case this.oipfRSObj.EVENT_RECORDING_STATE.UPDATED:
                this._updateSRList();
                this._log("recording updated: update on SRList", b);
                break;
            case this.oipfRSObj.EVENT_RECORDING_STATE.STARTED:
                this._updateSRList();
                this._log("recording rec started: removed from SRList", b);
                break;
            case this.oipfRSObj.EVENT_RECORDING_STATE.DELETED:
                this._updateSRList();
                this._log("schedule deleted: removed from SRList", b);
                (b = this.removeDeferreds[b.scheduleID]) && b.resolve();
                break;
            case this.oipfRSObj.EVENT_RECORDING_STATE.STORAGE_RELOAD:
                this._updateSRList()
        }
        this.publish(a)
    },
    record: function(a, b) {
        var c = new Deferred,
            d = this._transformProgramToOipfProgram(a),
            e = $dateUtils.now() / 1E3,
            f = d.startTime + d.duration;
        d.startTime < e && f > e && (d.startTime =
            e + 60);
        var g = this.oipfRSObj.record(d);
        null == g ? c.reject(null) : (a.scheduleID = g.scheduleID, g.customID = $mgrUtils.makeCustomId(a.seriesId, a.episodeId, b, !0), a.seriesId && a.episodeId || $services.series.isSeriesMember(a).done(function(a, c) {
            g.customID = $mgrUtils.makeCustomId(a, c, b || !0, !0)
        }), g.customMetadata = escape(JSON.stringify(a)), c.resolve(g));
        return c
    },
    recordProgram: function(a, b, c) {
        var d = new Deferred,
            e;
        if (c) e = this.findConflicts(c), -1 != e && $mgrUtils.putAiringTimeInEpgProgram(a, c, e);
        else {
            c = (new Date(a.startDate)).getTime();
            e = c + 1E3 * a.duration;
            if (e < $dateUtils.now()) return d.reject(null);
            c = [new CandidateAiring(c, e, a.channel, !0)];
            e = this.findConflicts(c)
        } - 1 == e ? (console.log("ScheduledRecordingService findConflicts"), console.log("schedule not added: conflict with " + c[0].conflict), d.reject()) : d = this.record(a, b);
        return d
    },
    startRecord: function(a, b, c, d, e, f, g) {
        var h = new Deferred,
            k = a + 1E3 * b,
            l = $services.dvbsi.channels["channel-" + d],
            m = [new CandidateAiring(a, k, l, e)];
        this.findConflicts(m);
        c = this.oipfRSObj.recordAt(Math.floor(a / 1E3),
            b, c, d);
        null == c ? h.reject(null) : (g || (g = l.name + " - " + $dateFormat.format($t($mgrUtils.DATE_FORMAT), $dateUtils.toDate(a))), f || (f = l.name + " - " + $dateFormat.format($t($mgrUtils.DATE_FORMAT), $dateUtils.toDate(a))), c.name = f, c.description = g, c.customID = $mgrUtils.makeCustomId(null, null, e || !0, !0), a = {
            channel: l,
            description: g,
            duration: b,
            endDate: k,
            endDateFormatted: $dateFormat.format($t($mgrUtils.DATE_FORMAT), $dateUtils.toDate(k)),
            hasRecording: !0,
            programTitle: f,
            startDate: a,
            startDateFormatted: $dateFormat.format($t($mgrUtils.DATE_FORMAT),
                $dateUtils.toDate(a)),
            title: f
        }, c.customMetadata = escape(JSON.stringify(a)), h.resolve(c), this._updateSRList());
        return h
    },
    update: function(a, b, c, d, e) {
        var f = new Deferred;
        e = [new CandidateAiring(b, b + 1E3 * c, null, e)]; - 1 == this.findConflicts(e) && (console.log("ScheduledRecordingService findConflicts"), console.log("schedule not added: conflict with " + e[0].conflict), f.reject(e[0].conflict));
        a = this.oipfRSObj.update(a, b / 1E3, c, d);
        null == a ? f.reject(null) : f.resolve(a);
        return f
    },
    remove: function(a) {
        var b = new Deferred,
            c =
            $mgrUtils.unmakeCustomId(a.customID);
        c && $services.series.addEpisodeInBlacklist(c.seriesId, c.episodeId);
        this.removeDeferreds[a.scheduleID] = b;
        this.oipfRSObj.remove(a);
        return b
    },
    removeByScheduleID: function(a) {
        new Deferred;
        var b = this.SRList.filter(function(b) {
            return b.scheduleID == a
        });
        return b.length ? this.remove(b[0]) : (new Deferred).reject()
    },
    findConflicts: function(a) {
        var b = this,
            c = -1;
        0 < this.SRList.length && a.every(function(a) {
            b.SRList.every(function(b) {
                var c = 1E3 * b.startTime,
                    g = c + 1E3 * b.duration;
                if (a.startTime >
                    c && a.startTime < g || a.endTime > c && a.endTime < g || a.startTime <= c && a.endTime >= g) {
                    if (a.isManual) {
                        if ($mgrUtils.unmakeCustomId(b.customID).isManual) return a.conflict = new ConflictNotification(a, b, 0, ConflictNotification.Action.Solve), !1;
                        a.conflict = new ConflictNotification(a, b, 0, ConflictNotification.Action.Remove);
                        return !0
                    }
                    a.conflict = new ConflictNotification(a, b, 0, ConflictNotification.Action.Reject);
                    return !1
                }
                return !0
            });
            return null == a.conflict || a.conflict.action == ConflictNotification.Action.Remove ? !1 : !0
        });
        a.forEach(function(a,
            b) {
            -1 != c || null != a.conflict && a.conflict.action != ConflictNotification.Action.Remove || (c = b)
        });
        return c
    },
    _transformProgramToOipfProgram: function(a) {
        var b = this.oipfRSObj.createProgrammeObject();
        b.name = a.title;
        b.longName = a.title;
        b.description = a.description || "";
        b.longDescription = a.description || "";
        b.startTime = (new Date(a.startDate)).getTime() / 1E3;
        b.duration = 60 * a.duration;
        b.channelID = a.channel.id;
        b.episode = 1;
        b.programmeID = "";
        return b
    },
    getScheduledRecordingByProgram: function(a) {
        var b = null;
        this.SRList.forEach(function(c) {
            c.programmeID ==
                a.programmeID && (b = c)
        });
        return b
    },
    getSchedules: function() {
        return this.SRList
    },
    getNewSchedules: function() {
        return this.SRList.filter(function(a) {
            return $mgrUtils.unmakeCustomId(a.customID).isNew
        })
    },
    getAutoSchedules: function() {
        return this.SRList.filter(function(a) {
            return $mgrUtils.unmakeCustomId(a.customID).isManual
        })
    },
    getScheduleByDate: function(a, b, c) {
        return this.SRList.filter(function(d) {
            return "undefined" === typeof c ? 1E3 * d.startTime >= a && 1E3 * d.startTime <= b : $mgrUtils.unmakeCustomId(s.customID).isManual &&
                1E3 * d.startTime >= a && 1E3 * d.startTime <= b
        })
    },
    getScheduleByEpisode: function(a, b) {
        return this.SRList.filter(function(c) {
            c = $mgrUtils.unmakeCustomId(c.customID);
            return c.seriesId && c.seriesId == a && c.episodeId == b
        })
    },
    sync: function() {
        this.SRList = this.oipfRSObj.getScheduledRecordings()
    },
    keepAutorec: function(a) {
        a = this.getScheduledRecordingByProgram(a);
        var b = $mgrUtils.unmakeCustomId(s.customID);
        a.customID = $mgrUtils.makeCustomId(b.tsId, b.teId, !0, b.isNew)
    },
    getScheduleIDFromProgram: function(a) {
        var b = !1;
        this.SRList.forEach(function(c) {
            (JSON.parse(unescape(c.customMetadata)) || {}).id == a.id && (a.scheduleID = c.scheduleID, b = !0)
        });
        return b
    },
    _deleteAllSchedule: function() {
        var a = this;
        this.SRList.forEach(function(b) {
            a.oipfRSObj.remove(b)
        });
        this.SRList = []
    }
});
SeriesService = $class(Service, {
    interval: null,
    recordingSeries: [],
    seriesMap: {
        schedule: {},
        storage: {},
        info: {}
    },
    _channelsList: null,
    SERIES_RECORDING_LIST: "series.recording.list",
    CHECK_SYNC_LAST_UPDATE: 30,
    FAIL_SYNC_COUNT: 0,
    CACHE_EXPIRATION_TIME: 1296E6,
    init: function() {
        this.parent();
        this._load();
        Object.observe(this.recordingSeries, this._save.bind(this));
        var a = this;
        this.recordingSeries.forEach(function(b) {
            Object.observe(b, a._save.bind(this), ["update"])
        });
        this.cache = new CacheMemory(new Cache("series", $cacheDefinition.series_storage(),
            $cacheDefinition.series_maxSize(), $cacheDefinition.series_maxItems(), $cacheDefinition.series_compressed(), $cacheDefinition.series_onremove()), !0)
    },
    load: function() {
        this._createInterval()
    },
    _authorize: function(a) {
        var b = arguments;
        $services.gis.waitRegisterDevice().done(function(a, b) {
            return $services.connectSeries.connect(a)
        }).done(function() {
            a(b[1])
        }).fail(function() {
            $clog("Gis connection failed")
        })
    },
    _createInterval: function() {
        this.interval = setInterval(function() {
            $clog("SERIES SERVICE : startSyncSeries");
            $services.series.sync()
        }, 6E4 * this.CHECK_SYNC_LAST_UPDATE)
    },
    getSeriesById: function(a) {
        var b = new Deferred,
            c = this;
        $ajax.get({
            url: seriesByIdServerUrl,
            param: {
                seriesId: a
            }
        }).done(function(a) {
            a.item && a.item.series && 0 != a.item.series.length ? c._channelsList ? b.resolve(a.item.series[0]) : $services.channel.getChannels().done(function(e) {
                c._channelsList = e;
                b.resolve(a.item.series[0])
            }) : b.reject()
        }).fail(function() {
            401 == this.xhr.status ? c._authorize(c.getSeriesById, a) : b.reject()
        });
        return b
    },
    isSeriesMember: function(a) {
        var b =
            new Deferred,
            c = this;
        a.nimbus ? $ajax.get({
            url: seriesMemberServerUrl,
            param: {
                country: $locale.country,
                headendId: a.nimbus.headendid,
                channelDevice: "Y",
                programId: a.nimbus.ProgramId,
                airingTime: a.nimbus.AiringTime,
                sourceId: a.nimbus.SourceId
            }
        }).done(function(a) {
            if (a.item && a.item.seriesMembers && 0 != a.item.seriesMembers.length) {
                a = a.item.seriesMembers;
                var c, f;
                a.forEach(function(a) {
                    $services.series.getSeriesByIdLocal(a.tseriesId) && (c = a.tseriesId, f = a.tepisodeId + "")
                });
                c || (c = a[0].tseriesId, f = a[0].tepisodeId + "");
                b.resolve(c,
                    f)
            } else b.reject()
        }).fail(function() {
            401 == this.xhr.status ? c._authorize(c.isSeriesMember, a) : b.reject()
        }) : b.reject();
        return b
    },
    getSeriesInfo: function(a) {
        var b = new Deferred,
            c = this;
        if (this.seriesMap.info[a]) b.resolve();
        else {
            var d = this.cache.get("SERIES_INFO_" + a);
            (d ? (new Deferred).resolve(d) : $ajax.get({
                url: seriesInfoServerUrl,
                param: {
                    seriesId: a
                }
            })).done(function(d) {
                d.item && (c.seriesMap.info[a] = d.item.series[0].name);
                c.cache.set("SERIES_INFO_" + a, d, Date.now() + c.CACHE_EXPIRATION_TIME);
                b.resolve()
            }).fail(function() {
                401 ==
                    this.xhr.status ? c._authorize(c.getSeriesInfo, a) : b.reject()
            })
        }
        return b
    },
    record: function(a) {
        var b = new Deferred,
            c = this;
        this.getSeriesById(a).done(function(a) {
            var e = [],
                f = [],
                g = c._filter(a.related),
                h = [],
                k = SERIES_LIMIT_EPISODES_SCHEDULABLE,
                g = g.filter(function(b) {
                    var g = $services.schedule.getScheduleByEpisode(b.seriesId, b.episodeID);
                    if (0 < g.length) return g.forEach(function(a) {
                        $mgrUtils.unmakeCustomId(a.customID).isManual || f.push(a)
                    }), !1;
                    if (0 < k) {
                        var l = [];
                        b.airings.forEach(function(a) {
                            var b = (new Date(a.airingTime)).getTime();
                            l.push(new CandidateAiring(b, b + 6E4 * a.duration, a.channels[0], !0, a.programId))
                        });
                        b.validAiring = $services.schedule.findConflicts(l);
                        if (-1 == b.validAiring) return e.push(l[0].conflict), !1;
                        b.candidateAirings = l;
                        h.push(c._transformEpisodeToEpgProgram(b, a.headendid));
                        k--;
                        return !0
                    }
                });
            if (0 < g.length)
                if (0 == e.length) {
                    var l = [];
                    f.forEach(function(a) {
                        $services.schedule.keepAutorec(a)
                    });
                    $services.program.updatePrograms(h, $services.program.DETAILS, $services.program.PHOTOS).always(function(a) {
                        return $mgrUtils.asyncLoop({
                            length: a.length,
                            functionToLoop: function(b, c) {
                                $services.schedule.record(a[c], !0).always(function(a) {
                                    null != a && l.push(a);
                                    b()
                                })
                            }
                        })
                    }).done(function() {
                        if (0 < l.length) {
                            var e = {};
                            e.seriesId = a.id;
                            e.name = a.name;
                            e.blacklist = [];
                            e.lastUpdate = (new Date).getTime();
                            c.recordingSeries.push(e);
                            b.resolve({
                                code: "CODE_SERIES_ADD_SUCCESS"
                            })
                        } else b.reject({
                            code: "CODE_SERIES_ADD_FAIL"
                        })
                    })
                } else {
                    var g = e[0].recording,
                        m = "--";
                    g.channel && (m = g.channel.name || g.channel.description);
                    b.reject({
                        code: "CODE_SERIES_ADD_FAIL_OVERLAP",
                        title: g.name,
                        channel: m,
                        conflicts: e,
                        date: $dateFormat.format($t("dateFmt.friendly_dom_time"), new Date(1E3 * g.startTime))
                    })
                } else b.reject({
                code: "CODE_SERIES_ADD_FAIL"
            })
        }).fail(function() {
            b.reject({
                code: "CODE_SERIES_ADD_FAIL"
            })
        });
        return b
    },
    update: function(a) {
        var b = new Deferred,
            c = this;
        this.getSeriesById(a).done(function(d) {
            var e = [],
                f = $services.schedule.getScheduledRecordingBySeries(a),
                g = $services.pvr.getScheduledRecordingBySeries(a),
                h = d.related,
                k = SERIES_LIMIT_EPISODES_SCHEDULABLE - f.length,
                h = h.filter(function(a) {
                    return 0 == g.filter(function(b) {
                        return JSON.parse(unescape(b.customMetadata)).episodeId ==
                            a.episodeID
                    }).length
                }),
                h = c._filter(d.related);
            f.forEach(function(a) {
                var b = !1,
                    c = -1,
                    d = JSON.parse(unescape(a.customMetadata));
                h = h.filter(function(f) {
                    return f.episodeID == d.episodeId ? (b = !0, f.airings.forEach(function(b, e) {
                        b.channels.forEach(function(f) {
                            (new Date(b.airingTime)).getTime() == 1E3 * a.startTime && d.nimbus.SourceId == f.nimbus.SourceId && (c = e)
                        })
                    }), -1 == c || f.airings[c].updated ? (e.push(a), !0) : !1) : !0
                });
                b || (e.push(a), k++)
            });
            k += e.length;
            c.getSeriesByIdLocal(a).lastUpdate = (new Date).getTime();
            if (0 < k && 0 < h.length) {
                var l = [],
                    m = 0;
                h.forEach(function(a) {
                    k > m && (l.push(c._transformEpisodeToEpgProgram(a, d.headendid)), m++)
                });
                $mgrUtils.asyncLoop({
                    length: e.length,
                    functionToLoop: function(a, b) {
                        $services.schedule.remove(e[b]).always(function() {
                            a()
                        })
                    }
                }).done(function() {
                    $services.program.updatePrograms(l, $services.program.DETAILS, $services.program.PHOTOS, $services.program.RATING).always(function(a) {
                        return $mgrUtils.asyncLoop({
                            length: a.length,
                            functionToLoop: function(b, c) {
                                var d = [];
                                h[c].airings.forEach(function(a) {
                                    var b = (new Date(a.airingTime)).getTime();
                                    d.push(new CandidateAiring(b, b + 6E4 * a.duration, a.channels[0], !0, a.programId))
                                });
                                $services.schedule.recordProgram(a[c], !0, d).always(function(a) {
                                    b()
                                })
                            }
                        })
                    }).done(function() {
                        b.resolve()
                    })
                })
            } else b.resolve()
        }).fail(function() {
            b.reject()
        });
        return b
    },
    _removeSeries: function(a) {
        a = this.recordingSeries.map(function(a) {
            return a.seriesId
        }).indexOf(a);
        return -1 < a ? (this.recordingSeries.splice(a, 1), (new Deferred).resolve()) : (new Deferred).reject()
    },
    remove: function(a) {
        return Deferred.when(this.removeSchedule(a), this.removeRecording(a)).done(this._removeSeries.bind(this,
            a))
    },
    interrupt: function(a) {
        return this.removeSchedule(a).done(this._removeSeries.bind(this, a))
    },
    removeSchedule: function(a) {
        var b = new Deferred,
            c = $services.schedule,
            d = c.getScheduledRecordingBySeries(a);
        $mgrUtils.asyncLoop({
            length: d.length,
            functionToLoop: function(a, b) {
                c.remove(d[b]).always(function() {
                    a()
                })
            }
        }).done(function() {
            b.resolve()
        });
        return b
    },
    removeRecording: function(a) {
        var b = new Deferred,
            c = $services.pvr,
            d = c.getScheduledRecordingBySeries(a);
        $mgrUtils.asyncLoop({
            length: d.length,
            functionToLoop: function(a,
                b) {
                c.removeByRecordingID(d[b].id).always(function() {
                    a()
                })
            }
        }).done(function() {
            b.resolve()
        });
        return b
    },
    sync: function(a) {
        if (a || this.FAIL_SYNC_COUNT >= SERIES_FORCED_SYNC_INTERVAL / SERIES_SYNC_INTERVAL)
            if (this.FAIL_SYNC_COUNT = 0, 0 < this.recordingSeries.length) {
                var b = this,
                    c = new Deferred,
                    d = this.recordingSeries.filter(function(b) {
                        return !a && b.lastUpdate ? b.lastUpdate < (new Date).getTime() - 36E5 * SERIES_SYNC_INTERVAL : !0
                    });
                0 < d.length ? ($clog("SeriesService -> Sync started"), $mgrUtils.asyncLoop({
                    length: d.length,
                    functionToLoop: function(a,
                        c) {
                        b.update(d[c].seriesId).always(a)
                    }
                }).done(function() {
                    c.resolve();
                    $clog("SeriesService -> Sync done: " + d.length + " series updated")
                })) : $clog("SeriesService -> Sync failed: all series is updated");
                return c
            }
    },
    getSeriesByIdLocal: function(a) {
        var b = null;
        this.recordingSeries.forEach(function(c) {
            c.seriesId == a && (b = c)
        });
        return b
    },
    isRec: function(a) {
        return null != this.getSeriesByIdLocal(a)
    },
    _filter: function(a) {
        var b = this;
        return a.filter(function(a) {
            a.airings = a.airings.filter(function(a) {
                (new Date(a.airingTime)).getTime();
                if ((new Date(a.airingTime)).getTime() < (new Date).getTime()) return !1;
                for (var c = [], d = 0; d < a.channels.length; d++) {
                    var h = $mgrUtils.getChannelByNimbusSourceId(b._channelsList, a.channels[d].sourceId);
                    h && c.push(h)
                }
                return 0 < c.length ? (a.channels = c, !0) : !1
            });
            var d = b.getSeriesByIdLocal(a.seriesId);
            return d && 0 < d.blacklist.length ? 0 < a.airings.length && 0 > d.blacklist.indexOf[a.episodeID] : 0 < a.airings.length
        })
    },
    addEpisodeInBlacklist: function(a, b) {
        if (b) {
            var c = this.getSeriesByIdLocal(a);
            c && c.blacklist.push(b)
        }
    },
    _transformEpisodeToEpgProgram: function(a,
        b) {
        var c = {
            channel: null,
            codecFormatted: null,
            duration: null,
            endDate: null,
            endDateFormatted: null,
            episodeTitleOrDescription: a.titleEpisode,
            id: null,
            nimbus: {
                AiringTime: null,
                Duration: null,
                ProgramId: null,
                SourceId: null,
                channelIndex: null,
                channeldevice: "Y",
                headendid: b,
                countryCode: $locale.country,
                source: "SeriesService"
            },
            photos: [{
                photoCredit: null,
                photoUrl: null
            }],
            season: 0,
            startDate: null,
            startDateFormatted: null,
            title: a.title,
            seriesId: a.seriesId,
            episodeId: a.episodeID
        };
        a.candidateAirings && $mgrUtils.putAiringTimeInEpgProgram(c,
            a.candidateAirings, a.validAiring);
        return c
    },
    _load: function() {
        var a = JSON.parse(localStorage.getItem(this.SERIES_RECORDING_LIST));
        this.recordingSeries = a ? a : []
    },
    _save: function() {
        localStorage.setItem(this.SERIES_RECORDING_LIST, JSON.stringify(this.recordingSeries))
    }
});
VolumeService = $class(Service, {
    MAX_VOLUME: 100,
    OUTPUT_SPEAKER: window.SoundSettings ? SoundSettings.TVSpeaker : 0,
    OUTPUT_HEADPHONES: window.SoundSettings ? SoundSettings.HeadPhone : 1,
    OUTPUT_DIGITAL_LINE: window.SoundSettings ? SoundSettings.DigitalLine : 2,
    init: function() {
        this.volume = SoundSettings.getVolumeLevel();
        this.mute = 0 == this.volume
    },
    volumeUp: function() {
        this.volume < this.MAX_VOLUME && (this.volume++, SoundSettings.setVolumeLevel(this.volume));
        this.mute && this.volumeToggleMute()
    },
    volumeDown: function() {
        0 < this.volume &&
            (this.volume--, SoundSettings.setVolumeLevel(this.volume));
        this.mute && this.volumeToggleMute()
    },
    volumeToggleMute: function() {
        this.mute = !this.mute;
        SoundSettings.setVolumeLevel(0)
    },
    volumeGetAudioOutput: function() {
        return SoundSettings.getCurrentOutputDevice ? SoundSettings.getCurrentOutputDevice() : this.OUTPUT_SPEAKER
    }
});
LocaleService = $class(Service, {
    LOCALE: "tsb.oipf.locale",
    init: function() {
        this.parent();
        this._computeCurrentLocale();
        var a = this;
        $storage.addListener(this.LOCALE, function(b, c) {
            if (!c) return !0;
            var d = JSON.parse(c),
                e = d.l,
                d = d.c;
            a.setLocale(e, d);
            a.publish("onChangeLocale", e, d);
            return !0
        })
    },
    setLocale: function(a, b) {
        this._setDeviceLocale(a, b);
        a = 3 == a.length ? $localeMaps.LANG_ISO_MAP[a] : a;
        b = 3 == b.length ? $localeMaps.COUNTRY_ISO_MAP[b] : b;
        $locale.update(a, b);
        $storage.set(this.LOCALE, {
            l: a,
            c: b
        });
        this.publish("onChangeLocale",
            a, b)
    },
    _computeCurrentLocale: function() {
        var a = this._getDeviceLocale(),
            b = this._getURLLocale(),
            c = $locale.localeSplit(window.DEFAULT_LOCALE),
            a = [
                [b.l, b.c],
                [a.l, a.c],
                [c.l, c.c]
            ];
        with($localeMaps.LOCALE_SRC);
        for (var c = b = null, d = 0, e = a.length; d < e; d++)
            if (b = b || ($locale.localeIsLangSupported(a[d][0]) ? a[d][0] : null), c = c || a[d][1], b && c) {
                $locale.update(b, c);
                $storage.set(this.LOCALE, {
                    l: b,
                    c: c
                });
                break
            }
    },
    _getDeviceLocale: function() {
        var a = $services.tvConfig,
            b = a.getPreferredUILanguage(),
            a = a.getCountryCode();
        return {
            l: $localeMaps.LANG_ISO_MAP[b],
            c: $localeMaps.COUNTRY_ISO_MAP[a]
        }
    },
    _setDeviceLocale: function(a, b) {
        var c = 2 == b.length ? $localeMaps.COUNTRY_ISO_MAP[b] : b,
            d = $services.tvConfig;
        d.setPreferredUILanguage(2 == a.length ? $localeMaps.LANG_ISO_MAP[a] : a);
        d.setCountryCode(c)
    },
    _getURLLocale: function() {
        var a = /locale=(.+?)(&|$)/.exec(location.search);
        return a && $locale.localeSplit(a[1]) || {
            l: null,
            c: null
        }
    }
});
ActivityLogService = $class(Service, {
    UPDATE_INTERVAL: 6E4,
    init: function() {
        this.parent();
        this.dataFS = new StorageFS("activityLog");
        this.dataChannel = new StorageFS("channel", this.dataFS);
        this.dataChannelWatch = new StorageFS("channelWatch", this.dataFS);
        this.dataProgram = new StorageFS("program", this.dataFS);
        this.dataProgramWatch = new StorageFS("programWatch", this.dataFS);
        this.dataProgramSchedule = new StorageFS("programSchedule", this.dataFS);
        this.dataProgramRecord = new StorageFS("programRecord", this.dataFS);
        "overlay" ===
        APP_NAME && ($services.channel.subscribe({
            channelChange: this._collectData.bind(this, !0)
        }), this._collectData())
    },
    _collectData: function(a) {
        this.timer && this.timer.cancel();
        var b = this;
        $services.channel.getCurrentChannel().done(function(a) {
            b.addChannelWatch(a);
            $services.program.getCurrentAndNextProgram([a], $services.program.BASE).always(function(a) {
                a && a[0] && b.addProgramWatched(a[0])
            })
        });
        this.timer = $timeout(this.UPDATE_INTERVAL).done(this._collectData.bind(this, !1));
        return !0
    },
    getChannelIdSortedByWatchTime: function(a) {
        var b =
            new Deferred;
        if (this.dataChannelWatch) {
            var c = this;
            this.dataChannelWatch.ls().done(function(d) {
                for (var e = [], f = [], g = 0, h = d.length; g < h; g++) e.push(c.dataChannelWatch.getObject(d[g].name).done(function(a, b) {
                    var c = {
                        id: b,
                        time: a
                    };
                    f.push(c);
                    f[b] = c
                }));
                Deferred.all.apply(Deferred, e).always(function() {
                    f.sort(function(a, b) {
                        return b.time - a.time
                    });
                    a && (f = f.slice(0, a));
                    b.resolve(f)
                })
            }).fail(function() {
                b.reject()
            })
        } else b.reject();
        return b
    },
    getProgramWatchTime: function() {
        var a = new Deferred;
        if (this.dataProgramWatch &&
            this.dataProgram) {
            var b = this;
            this.dataProgramWatch.ls().done(function(c) {
                for (var d = [], e = [], f = 0, g = c.length; f < g; f++) d.push(b.dataProgramWatch.getString(c[f].name).done(function(a, b) {
                    var c = parseInt(b);
                    e.push({
                        date: c,
                        id: a
                    })
                }));
                Deferred.all.apply(Deferred, d).always(function() {
                    var c = [],
                        d = [];
                    e.sort(function(a, b) {
                        return a.date - b.date
                    });
                    for (var f, g = 0, n = e.length; g < n; g++) {
                        var p = e[g];
                        if ("start" !== p.id) {
                            var r = c[p.id];
                            r || (r = {
                                id: p.id,
                                time: 0,
                                date: []
                            }, c[p.id] = r, c.push(r), d.push(b.dataProgram.getObject(p.id, r).done(function(a,
                                b, c) {
                                c.program = a
                            })));
                            r.date.push(p.date);
                            f && "start" !== f.id && (r = $dateUtils.gap(f.date, p.date, "m"), c[f.id].time += r)
                        }
                        f = p
                    }
                    Deferred.all.apply(Deferred, d).always(function() {
                        for (var b = 0, d = c.length; b < d; b++) {
                            var e = c[b];
                            e.program && e.program.duration && (e.percent = 100 * e.time / e.program.duration)
                        }
                        a.resolve(c)
                    })
                })
            }).fail(function() {
                a.reject()
            })
        } else a.reject();
        return a
    },
    addChannelWatch: function(a) {
        if (this.dataChannelWatch) {
            var b = this,
                c = [];
            this.channelWatchTime || (this.defChannelWatchTime || (this.defChannelWatchTime =
                this.getChannelIdSortedByWatchTime().done(function(a) {
                    b.channelWatchTime = a
                }).always(function() {
                    b.defChannelWatchTime = null
                })), c.push(this.defChannelWatchTime));
            Deferred.all.apply(Deferred, c).done(function() {
                var c = Date.now();
                if (b.lastChannel) {
                    var e = b.lastChannel.id,
                        f = b.channelWatchTime[e];
                    f || (f = {
                        id: e,
                        time: 0
                    }, b.channelWatchTime[e] = f, b.channelWatchTime.push(f), b.dataChannel && b.dataChannel.set(e, b.lastChannel));
                    var g = $dateUtils.gap(b.lastChannelDate, c, "m");
                    f.time += g;
                    b.dataChannelWatch.set(e, f.time)
                }
                b.lastChannel =
                    a;
                b.lastChannelDate = c
            })
        }
    },
    addProgramWatched: function(a) {
        var b = Date.now(),
            c = a.id;
        this.dataProgramWatch && (this.lastProgramId ? (this.lastProgramId === c ? this.dataProgramWatch.remove(String(this.lastProgramDate)) : this.dataProgram.set(c, a), this.dataProgramWatch.set(String(b), c)) : (this.dataProgramWatch.set(String(b - 2), "start"), this.dataProgram.set(c, a), this.dataProgramWatch.set(String(b - 1), c)));
        this.lastProgramId = c;
        this.lastProgramDate = b
    },
    addProgramSchedule: function(a) {
        this.dataProgramSchedule && this.dataProgramSchedule.set(a.id,
            a)
    },
    addProgramRecord: function(a) {
        this.dataProgramRecord && this.dataProgramRecord.set(a.id, a)
    },
    addProgramRecordWatch: function(a) {
        this.dataProgramRecord && this.dataProgramRecord.mkdir(a.id + "--watchDate").done(function(a) {
            var c = new Date;
            c.setSeconds(0, 0);
            a.set($dateUtils.toNumber(c), c)
        })
    }
});
InputService = $class(Service, {
    IMG: {
        SCART: "source.png",
        "SCART S-Video": "source.png",
        Composite: "source.png",
        HDMI: "hdmi_big.png",
        YPbPr: "source.png",
        VGA: "computer_big.png"
    },
    init: function() {
        this.parent();
        InputManager.addEventListener("currentAVInputChangeEvent", this.change.bind(this))
    },
    change: function(a) {
        a == InputManager.SourceChanged && (a = InputManager.getAVInput(), this.publish("inputChange", a))
    },
    isTuner: function(a) {
        return -1 == a.number
    },
    getCurrent: function() {
        return InputManager.getAVInput()
    }
});
$serviceUtils = new ServiceUtils;
$imageUtils = new ImageUtils;
$mgrUtils = new MGRUtils;
$services.tnc = new TncService;
$services.channel = new ChannelService;
$services.program = new ProgramService;
$services.dvbsi = new DVBSIService(!0);
$services.videobcast = new VideoBroadcastService;
$services.tvConfig = new ConfigurationService;
$services.tvParental = new ParentalService;
$services.nimbus = new NimbusService;
$services.volume = new VolumeService;
$services.castAndCrew = new CastNCrewService;
$services.locale = new LocaleService;
$services.series = new SeriesService;
$services.pvrEvent = new PVREventService;
$services.removableDevice = new RemovableDeviceService;
$services.schedule = new ScheduleService;
$services.pvr = new PVRService;
$services.activityLog = new ActivityLogService;
$services.input = new InputService;
$services.channel.getChannels();
GISConnectService = $class(Service, {
    getConnectParam: $nop,
    getAuthorization: $nop,
    connected: !1,
    init: function() {
        this.connect_bound = this.connect.bind(this);
        this.disconnect_bound = this.disconnect.bind(this);
        this.parent()
    },
    connect: function() {
        var a = new Deferred,
            b = this,
            c = Array.apply(null, arguments),
            d = this.getConnectParam.apply(this, arguments),
            e = [];
        e.push({
            key: "X-Gluu-NoRedirect",
            value: !0
        });
        var f = this.getAuthorization.apply(this, arguments);
        f && e.push({
            key: "Authorization",
            value: f
        });
        $ajax.post({
            url: GIS_URL + "services/restv1/gis/authorize",
            param: d,
            additionalHeaders: e
        }).done(function(d) {
            $ajax.get({
                url: d.redirect
            }).done(function(a) {
                c = [a].concat(c);
                b.connectCallback.apply(b, c)
            }).done(function(c) {
                b.connected = !0;
                b.publish(c);
                a.resolve(c)
            }).fail(function(b) {
                a.countExceeded = -1 != this.xhr.url.indexOf("pinFailureCountExceeded=true");
                a.errorType = b.errorType;
                a.reject()
            })
        }).fail(a.reject.bind(a));
        return a
    },
    connectCallback: $nop,
    disconnect: function() {
        this.publish(null);
        this.connected = !1
    }
});
ConnectAutorecService = $class(GISConnectService, {
    getConnectParam: function(a) {
        return {
            secureDeviceId: a,
            response_type: "code",
            scope: "openid dtv",
            prompt: "none",
            client_id: AUTOREC_ID,
            redirect_uri: AUTOREC_AUTH_DEVICE_URL,
            nonce: $nonce()
        }
    }
});
ConnectSeriesService = $class(GISConnectService, {
    getConnectParam: function(a) {
        return {
            secureDeviceId: a,
            response_type: "code",
            scope: "openid dtv",
            prompt: "none",
            client_id: SERIES_ID,
            redirect_uri: SERIES_AUTH_DEVICE_URL,
            nonce: $nonce()
        }
    }
});
GisService = $class(Service, {
    DEVICE_ID: "deviceId",
    SECURE_DEVICE_ID: "secureDeviceId",
    PUBLIC_DEVICE_ID: "publicDeviceId",
    init: function() {
        this.parent();
        this.soc = oipfObjectFactory.createConfigurationObject().configuration;
        $services.tnc.isEulaAccepted() ? this.registerDevice() : $services.tnc.subscribe({
            onEulaChange: this.registerDevice.bind(this)
        })
    },
    registerDevice: function() {
        var a = this;
        return this.getSdid() && this.getPdid() ? (new Deferred).reject() : $ajax.post({
            url: GIS_URL + "services/restv1/gis/registerDevice",
            param: {
                deviceId: this.getDeviceId(),
                timestamp: $nonce()
            }
        }).done(function(b) {
            a.setIds(b.secureDeviceId, b.publicDeviceId);
            a.publish("onRegisterDevice", b.secureDeviceId, b.publicDeviceId)
        }).fail(this.removeIds.bind(this))
    },
    waitRegisterDevice: function() {
        var a = new Deferred,
            b = this.getSdid(),
            c = this.getPdid();
        b && c ? a.resolve(b, c) : this.subscribe({
            onRegisterDevice: function(b, c, f) {
                a.resolve(c, f)
            }
        });
        return a
    },
    setIds: function(a, b) {
        DatabaseManager.write(this.SECURE_DEVICE_ID, a);
        DatabaseManager.write(this.PUBLIC_DEVICE_ID, b)
    },
    removeIds: function() {
        DatabaseManager.write(this.SECURE_DEVICE_ID,
            "");
        DatabaseManager.write(this.PUBLIC_DEVICE_ID, "")
    },
    getSdid: function() {
        return DatabaseManager.read(this.SECURE_DEVICE_ID)
    },
    getPdid: function() {
        return DatabaseManager.read(this.PUBLIC_DEVICE_ID)
    },
    getDeviceId: function() {
        var a = DatabaseManager.read(this.DEVICE_ID);
        a || (a = this._generateDeviceId(), DatabaseManager.write(this.DEVICE_ID, a));
        return a
    },
    _generateDeviceId: function() {
        for (var a = "", b = 0; 12 > b; b++) a += Math.floor(16 * Math.random()).toString(16);
        return "14" + this.getRegionCode() + a.toUpperCase()
    },
    getRegionCode: function() {
        return {
            NA: "01",
            EU: "02",
            JP: "00"
        }[window.BUILD_REGION] || "09"
    }
});
$services.gis = new GisService;
$services.connectAutorec = new ConnectAutorecService;
$services.connectSeries = new ConnectSeriesService;
ShikiService = $class(Service, {
    socket: null,
    retryCount: 0,
    state: 0,
    CLOSED: 0,
    OPENED: 1,
    FAILED: 2,
    WS_CLOSE_BACKOFF_MAX: 5E3,
    VERSION: "0001",
    systemTypePattern: /[8-9a-f][0-9a-f]{3}/,
    userTypePattern: /[0-7][0-9a-f]{3}/,
    connectDevice: new($class(GISConnectService, {
        getConnectParam: function(a) {
            return {
                secureDeviceId: a,
                response_type: "code",
                scope: "openid dtv",
                prompt: "none",
                client_id: SHIKI_ID,
                redirect_uri: SHIKI_AUTH_DEVICE_URL,
                nonce: $nonce()
            }
        }
    })),
    GIS_RETRY_BACKOFF: 6E4,
    connectionId: "",
    serverId: "",
    pingInterval: 6E4,
    pingTimer: null,
    retryBackoff: 6E4,
    init: function() {
        this.apps = {};
        this.open_bound = this.open.bind(this);
        if ($services.tnc.isEulaAccepted()) this.open();
        else {
            var a = this;
            $services.tnc.subscribe({
                onEulaChange: function(b, c) {
                    a.open();
                    return !0
                }
            })
        }
        this.parent()
    },
    open: function() {
        var a = new Deferred;
        return this.state === this.OPENED ? a.resolve() : this.connectDevice.connected ? this.createRendezvousPoint().done(this.connectWebSocket.bind(this)).fail(log.bind(null, "ShikiService: error on creating Rendezvous point. Will retry in " + this.retryBackoff /
            1E3 + "s")).fail(setTimeout.bind(window, this.open_bound, this.retryBackoff)) : $services.gis.waitRegisterDevice().done(this.connectDevice.connect_bound).done(this.open_bound).fail(log.bind(null, "Could not connect to shiki, retrying in " + this.GIS_RETRY_BACKOFF / 1E3 + "s")).fail(setTimeout.bind(window, this.open_bound, this.GIS_RETRY_BACKOFF))
    },
    createRendezvousPoint: function() {
        var a = this,
            b = new Deferred,
            c = {
                retryCount: this.retryCount
            };
        "" !== this.serverId && (this.state === this.FAILED ? c.prevServerId = this.serverId : c.closedServerId =
            this.serverId);
        $ajax.post({
            url: SHIKI_RENDEZVOUS_URL + "v1/rendezvousPoints",
            param: c
        }).always(function(b) {
            "object" === typeof b && b.hasOwnProperty("retryBackoff") && (a.retryBackoff = 1E3 * Number(b.retryBackoff))
        }).done(function(c) {
            a.connectionId = c.rendezvousPoint.connectionId;
            a.serverId = c.rendezvousPoint.serverId;
            a.pingInterval = 1E3 * Number(c.rendezvousPoint.pingInterval);
            b.resolve(c.rendezvousPoint.uri)
        }).status(401, this.connectDevice.disconnect_bound).fail(function() {
            a.serverId = "";
            a.retryCount++;
            a.state = a.FAILED;
            b.reject()
        });
        return b
    },
    connectWebSocket: function(a) {
        var b = this;
        a = new WebSocket(a);
        a.onopen = function() {
            b.retryCount = 0;
            b.state = b.OPENED;
            b.publish("shikiNotification", b.state);
            var a = function() {
                b.ping();
                b.pingTimer = setTimeout(a, b.pingInterval)
            };
            b.pingTimer = setTimeout(a, b.pingInterval)
        };
        a.onclose = function() {
            if (b.state === b.OPENED) {
                clearInterval(b.pingTimer);
                b.state = b.CLOSED;
                b.publish("shikiNotification", b.state);
                var a = b.WS_CLOSE_BACKOFF_MAX * Math.random();
                setTimeout(b.open_bound, a);
                log("ShikiService: close. Will retry in " +
                    a / 1E3 + "s")
            } else b.retryCount++, b.state = b.FAILED, window.setTimeout(b.open_bound, b.retryBackoff), log("ShikiService: error on connecting WebSocket. Will retry in " + b.retryBackoff / 1E3 + "s")
        };
        a.onmessage = this.receive.bind(this);
        this.socket = a
    },
    receive: function(a) {
        if (a = this.parseMessage(a.data))
            if (a.isSystemType) {
                if (a.type === $shikiType.UNREACHABLE && (a = this.parseMessage(a.body), this.apps[a.type] instanceof Object && this.apps[a.type].onunreachable instanceof Function)) this.apps[a.type].onunreachable(a)
            } else if (this.apps[a.type] instanceof Object && this.apps[a.type].onmessage instanceof Function) this.apps[a.type].onmessage(a)
    },
    parseMessage: function(a) {
        if (8 > a.length) return null;
        var b = {};
        b.version = a.substr(0, 4);
        b.type = a.substr(4, 4);
        return b.type.match(this.systemTypePattern) ? (b.body = a.substr(8), b.isSystemType = !0, b) : b.type.match(this.userTypePattern) ? (b.source = a.substr(8, 16), b.destination = a.substr(24, 16), b.body = a.substr(40), b.isSystemType = !1, b) : null
    },
    sendTo: function(a, b, c) {
        this.socket.send(this.VERSION + b + this.connectionId + a + c)
    },
    replyTo: function(a,
        b) {
        this.socket.send(this.VERSION + a.type + this.connectionId + a.source + b)
    },
    ping: function() {
        this.socket.send(this.VERSION + $shikiType.PING)
    },
    register: function(a, b) {
        var c = this.apps[a];
        "object" === typeof b ? this.apps[a] = b : this.apps.hasOwnProperty(a) && delete this.apps[a];
        return c
    }
});
ShikiType = $class(Object, {
    REMOTE_DIAGNOSTIC: "0001",
    REMOTE_RECORDING: "0002",
    NOTIFICATIONS: "0003",
    REMOTE_CESI: "0004",
    REMOTE_IPRC: "0005",
    CDA_APP: "0006",
    PING: "8001",
    PONG: "8002",
    UNREACHABLE: "8003"
});
$shikiType = new ShikiType;
$services.shiki = new ShikiService;
CronService = $class(Service, {
    MIN_MAX: [{
        min: 0,
        max: 59
    }, {
        min: 0,
        max: 23
    }, {
        min: 1,
        max: 31
    }, {
        min: 0,
        max: 11
    }, {
        min: 0,
        max: 6
    }],
    init: function(a, b) {
        this.parent();
        this.name = b || this.name || this.getClassName();
        if ((this.time = a || this.time) && this.run) {
            var c = this;
            this.timeout = $timeout(this.computeNext.bind(this), !0).done(function() {
                c.publish("cron");
                c.run()
            })
        }
    },
    computeNext: function() {
        var a, b = new Date;
        if (!this.nextDate) {
            this.nextDate = b;
            var c = $storage.get("tsb.cron." + this.name);
            c && $dateUtils.le(c, b) && (a = 0)
        }
        if (void 0 === a) {
            a = [];
            for (var c = b.getFullYear(), d = this.time.split(" "), e = 0, f = this.MIN_MAX.length; e < f; e++) a[e] = this.expendValue(d[e], this.MIN_MAX[e]);
            d = a.pop();
            a.push([c, c + 1]);
            a = this.computeDate(b, a);
            for (c = 7; 0 > d.indexOf(a.getDay()) && c--;) a = $dateUtils.add(a, 1, "d");
            this.nextDate = a;
            $storage.set("tsb.cron." + this.name, a);
            a = $dateUtils.gap(b, a)
        }
        return a
    },
    computeDate: function(a, b) {
        for (var c = [a.getMinutes(), a.getHours(), a.getDate(), a.getMonth(), a.getFullYear()], d = [], e = !0, f = 0, g = c.length; f < g; f++) {
            var h = c[f],
                k = b[f],
                h = k.binarySearch(h,
                    function(a, b) {
                        return a - b
                    });
            0 > h ? h = -h - 1 : e && (h += 1);
            h = k[h];
            void 0 === h ? (h = k[0], e = !0) : e = !1;
            d.unshift(h)
        }
        return this.newDate.apply(this, d)
    },
    expendValue: function(a, b) {
        a || (a = "*");
        a = a.replace(/\*+/g, b.min + "-" + b.max);
        var c = a.replace(/([0-9]+)-([0-9]+)(?:\/([0-9]+))?/g, function(a, b, c, g, h, k) {
            g = g && parseInt(g) || 1;
            a = 1;
            k = h = "";
            b = parseInt(b);
            for (c = parseInt(c); b <= c; b++) a = a || g, 0 === --a && (h += k + b, k = ",");
            return h
        }).split(",").map(function(a) {
            return parseInt(a)
        });
        c.sort(function(a, b) {
            return a - b
        });
        return c
    },
    newDate: function(a,
        b, c, d, e) {
        return new Date(a, b, c, d, e)
    }
});
UpdateNimbusData = $class(CronService, {
    run: function() {
        $services.activityLog.getChannelIdSortedByWatchTime(30).done(function(a) {
            var b = Date.now(),
                c = $dateUtils.roundTime(b, "4"),
                d = $dateUtils.add(c, "7", "h"),
                e = [];
            a.forEach(function(a) {
                e.push(a.id)
            });
            $services.channel.getChannelById.apply($services.channel, e).done(function() {
                var a = $arguments2Array(arguments);
                $services.nimbus.getPrograms(a, c, d, 0).done(function(a) {
                    log("[CRON] CacheNimbusData put " + a.length + " in cache for date " + c + " to " + d)
                })
            })
        })
    }
});
UpdateChannelData = $class(CronService, {
    run: function() {
        $services.channel.updateChannels().done(function(a) {
            log("[CRON] UpdateChannelInformation for " + a + " channels")
        })
    }
});
var $cron = [new UpdateNimbusData("50 */4 * * *"), new UpdateChannelData("0 4 * * 1")];
MgProgramInfoCtrl = $class(BaseCtrl, {
    DATE_FORMAT: "dateFmt.time",
    load: function() {
        this.parent();
        this.nextProgram = this.node.dataset.nextProgram || !1;
        this._setProgram();
        this._getRealPrograms()
    },
    refresh: function() {
        this._setProgram(this.program);
        this._getRealPrograms()
    },
    _getRealPrograms: function() {
        var a = this;
        $services.channel.getCurrentChannel().done(function(b) {
            a.update(b)
        }).fail(function(a) {
            logError("Can't get current channel", a)
        })
    },
    update: function(a) {
        var b = this;
        $services.program.getInfoPrograms(a).always(function(c) {
            b.currentChannel =
                a;
            b.program = b.nextProgram ? 1 < c.length ? c[1] : {} : 0 < c.length ? c[0] : {};
            b._setProgram(b.program);
            $services.clock.clear(b.clockId);
            b.clockId = $services.clock.subscribe(b.setProgress.bind(b, b.program));
            b.setProgress(b.program, null, Date.now())
        })
    },
    setProgress: function(a, b, c) {
        a = $dateUtils.gap(a.startDate, c, "s") / (60 * a.duration);
        a = Math.max(a, 0);
        1 == a ? this.update(this.currentChannel) : this.node.querySelector(".mgProgramInfoProgress div").style.width = 100 * a + "%";
        return !0
    },
    _setProgram: function(a) {
        a ? a.programUnavailable = !1 : a = {
            programUnavailable: !0
        };
        a.nowOrNextLabel = $t(this.nextProgram ? "mg.mepg.next" : "mg.mepg.now");
        a.startDate && a.endDate ? (a.availableDates = !0, a.startDateFormatted = $dateFormat.format($t(this.DATE_FORMAT), $dateUtils.toDate(a.startDate)), a.endDateFormatted = $dateFormat.format($t(this.DATE_FORMAT), $dateUtils.toDate(a.endDate))) : a.availableDates = !1;
        a.categoryClass = $programUtils.getCleanCategory(a.category);
        a.categoryName = $programUtils.getCategoryTranslation(a.category);
        a.episodeTitleAvailable = !!a.episodeTitle;
        a.descriptionAvailable = !!a.description || !!a.episodeTitle;
        a.programTitle = a.title || $t("mg.program.unknown");
        a.programDescription = a.description || "";
        a.isRatingAvailable = !!a.ratingAge;
        a.isRatingAvailable && (a.ratingAgeFormatted = "en" == $locale.lang && "GB" == $locale.country ? "G" + a.ratingAge : a.ratingAge);
        a = $template.load("mgProgramInfo", a);
        this.node.innerHTML = a
    }
});
ProgramService = $class(ProgramService, {
    getInfoPrograms: function(a) {
        return this.getCurrentAndNextProgram([a], this.BASE, "description")
    }
});
ProgramUtils = $class(Object, {
    computeProgramProgress: function(a) {
        if (a.startDate && a.duration) var b = $dateUtils.now(),
            b = $dateUtils.gap(a.startDate, b, "s") / (60 * a.duration);
        b = Math.max(b, 0);
        return b = Math.min(b, 1)
    },
    getCleanCategory: function(a) {
        if (a) return (a = a && a.replace(/\W/g, "")) && (a = a.toLowerCase()), a
    },
    getCategoryTranslation: function(a) {
        a = "mg.program.category." + (a ? this.getCleanCategory(a) : "unknown");
        return $t(a)
    }
});
ChannelUtils = $class(Object, {
    digits: function(a) {
        return 10 > a ? 1 : 100 > a ? 2 : 1E3 > a ? 3 : 4
    },
    letters: function(a) {
        a = a.split(/\s+/);
        for (var b = 6, c = 0; c < a.length; c++) {
            var d = a[c].length,
                d = (d >> 1) + d % 2 << 1;
            d > b && (b = 12 < d ? 12 : d)
        }
        return 6 > b ? 6 : b
    }
});
$programUtils = new ProgramUtils;
$channelUtils = new ChannelUtils;
$services.program = new ProgramService;
OverlayEventsHandler = $class(Object, {
    boot: function() {
        this.openOverlay()
    },
    openOverlay: function() {
        $page.open("overlay");
        $appManager.setKeySet($keysMap.NAVIGATION | $keysMap.OTHER, [$keysMap.volumeDown, $keysMap.volumeUp, $keysMap.volumeMute]);
        $appManager.showWindow()
    },
    guide: function() {
        $appManager.sendKey("epg", "guide")
    },
    home: function() {
        $appManager.sendKey("portal", "home")
    },
    personal: function() {
        $appManager.sendKey("mgr", "personal")
    },
    programUp: function() {
        $appManager.sendKey("tv", "programUp")
    },
    programDown: function() {
        $appManager.sendKey("tv",
            "programDown")
    },
    info: function() {
        $appManager.sendKey("tv", "info")
    }
});
$page.INITIAL_TEMPLATE = "overlayLayout";
$event.register(new OverlayEventsHandler);
$services.clock = $services.clock || new Clock;
VolumeCtrl = $class(BaseCtrl, {
    FADE_DURATION: .2,
    AUTO_HIDE_TIMER: 3E3,
    UPDATE_OUTPUT_POLL: 1500,
    load: function() {
        this.parent();
        this.vol = $id("volume");
        this.wrapper = $id("volCircleWrapperLeft");
        this.rightCircle = $id("volRightCircle");
        this.leftCircle = $id("volLeftCircle");
        this.txt = $id("volInner");
        this.visible = !1;
        this._lastOutput = 0
    },
    bootVolume: function() {
        var a = $services.volume;
        a.mute && this.setVolume(a.volume, a.mute)
    },
    displayVolume: function() {
        var a = $services.volume;
        this.setVolume(a.volume, a.mute)
    },
    hide: function() {
        this.volHideTimer &&
            this.volHideTimer.cancel();
        this.animation && this.animation.cancel();
        this.vol.style.opacity = 0;
        this.visible = !1
    },
    _setProgress: function(a) {
        var b = 180 * (a / 50 - 1);
        50 > a ? (this.wrapper.classList.add("lt50"), this.rightCircle.style.transform = "rotate(" + b + "deg)", this.leftCircle.style.transform = "rotate(0)") : (this.wrapper.classList.remove("lt50"), this.rightCircle.style.transform = "rotate(0)", this.leftCircle.style.transform = "rotate(" + (b + -180) + "deg)")
    },
    _setText: function(a) {
        this.txt.innerText = a
    },
    _showVolume: function(a) {
        var b =
            this.vol.classList;
        this.volHideTimer && this.volHideTimer.cancel();
        b.remove("mute");
        this.visible = !0;
        this._updateOutput();
        0 == this.vol.style.opacity && (this.animation = new AnimFade([this.node], 0, 1, this.FADE_DURATION));
        a ? b.add("mute") : this.volHideTimer = $timeout(this.AUTO_HIDE_TIMER).done(this.hide.bind(this))
    },
    setVolume: function(a, b) {
        this._showVolume(b);
        0 > a || 100 < a || (this._setProgress(a), this._setText(a))
    },
    _updateOutput: function() {
        if (this.visible) {
            var a = this._getCurrentOutput();
            this._lastOutput != a && (this._lastOutput =
                a, this._setupOutput());
            $timeout(this.UPDATE_OUTPUT_POLL).done(this._updateOutput.bind(this))
        }
    },
    _getCurrentOutput: function() {
        var a = $services.volume;
        return a ? a.volumeGetAudioOutput() : 0
    },
    _setupOutput: function() {
        var a = this.vol.classList,
            b = $services.volume;
        a.remove("spkr", "amp", "cans");
        if (b) switch (this._getCurrentOutput()) {
            case b.OUTPUT_SPEAKER:
                a.add("spkr");
                break;
            case b.OUTPUT_HEADPHONES:
                a.add("cans");
                break;
            case b.OUTPUT_DIGITAL_LINE:
                a.add("amp")
        } else a.add("spkr")
    }
});
VolumeEventsHandler = $class(Object, {
    boot: function() {
        $page.context.controllers.volume.bootVolume()
    },
    volumeUp: function() {
        $services.volume.volumeUp();
        $page.context.controllers.volume.displayVolume()
    },
    volumeDown: function() {
        $services.volume.volumeDown();
        $page.context.controllers.volume.displayVolume()
    },
    volumeMute: function() {
        $services.volume.volumeToggleMute();
        $page.context.controllers.volume.displayVolume()
    }
});
$event.register(new VolumeEventsHandler);
$services.volume = new VolumeService;
CDANotificationCtrl = $class(BaseCtrl, {});
CDANotificationService = $class(Service, {
    start: function() {
        $services.shiki.subscribe(this);
        this.notifyConnected()
    },
    notifyConnected: function() {
        this.notifyConnection(!0);
        var a = this;
        $services.dial.postMessageToDial().always(function() {
            a.subscribeId || (a.subscribeId = $services.cda.subscribe(a));
            $clog("CDA:: connection to DIAL " + (200 == this.xhr.status ? "success" : "success, post failure"))
        })
    },
    shikiNotification: function(a, b) {
        $clog("CDA:: connection to shiki = " + (b ? "connected" : "failure"));
        return !0
    },
    notifyConnection: function(a) {
        $clog("CDA::" +
            (a ? "CONNECTED" : "NOT CONNECTED"))
    },
    onmessage: function(a, b, c) {
        $clog("CDA:: message " + b);
        $clog(c);
        return !0
    }
});
CDANotificationEventsHandler = $class(Object, {
    onStorageChange: function(a) {
        a.key == $services.cda.STORAGE_DIAL_NOTIFICATION && $services.cdaNotification.start()
    }
});
$event.register(new CDANotificationEventsHandler);
$services.cdaNotification = new CDANotificationService;
DialService = $class(Service, {
    postMessageToDial: function() {
        var a = JSON.parse(localStorage.getItem($services.cda.STORAGE_DIAL_NOTIFICATION)),
            b = $services.shiki,
            c = "",
            d = "",
            e = {};
        a ? (d = a.cdaPdid, c = a.additionalDataUrl, d && c ? b.connectDevice.connected ? ($services.cdaActionsServices.registerDevice(d), e.status = "ok", e.tvPdid = $services.gis.getPdid()) : e.status = "error" : e.status = "error") : e.status = "error";
        return $ajax.post({
            url: c,
            param: e
        })
    }
});
CDAService = $class(Service, {
    STORAGE_DEVICE_LIST: "cda.device.list",
    STORAGE_DIAL_NOTIFICATION: "cda.dial.notification",
    init: function() {
        this.registeredDevices = $storage.get(this.STORAGE_DEVICE_LIST) || {};
        Object.observe(this.registeredDevices, this._observeDevice.bind(this));
        $services.shiki.register($shikiType.CDA_APP, this);
        this.parent()
    },
    _observeDevice: function(a) {
        $storage.set(this.STORAGE_DEVICE_LIST, this.registeredDevices)
    },
    onmessage: function(a) {
        try {
            this.publish("onmessage", this.PUBLISH_ACTION.RECEIVE,
                a.body);
            var b = JSON.parse(a.body),
                c = !1,
                d = !1,
                e = {};
            if (this.EXCLUDE_REGISTERED_CHECK_BY_ACTION[b.action] || this.registeredDevices[b.cdaPdid]) {
                if (b.action == $cdaCommonCodes.CALLER_ACTIONS.CHECK_IN) {
                    var c = d = !0,
                        f = this;
                    $services.cdaActionsServices.checkIn(b).always(function(b) {
                        f.reply(a, c, b)
                    })
                } else b.action == $cdaCommonCodes.CALLER_ACTIONS.CHECK_OUT ? (c = !0, e = $services.cdaActionsServices.checkOut(b)) : b.action == $cdaCommonCodes.CALLER_ACTIONS.CHANNELS_LIST ? (c = d = !0, f = this, $services.cdaActionsServices.getChannelsList().always(function(b) {
                    f.reply(a,
                        c, b)
                })) : b.action == $cdaCommonCodes.CALLER_ACTIONS.CHECK_STATUS && (c = !0, e = $services.cdaActionsServices.checkStatus(b));
                c ? d || this.reply(a, c, e) : ($services.shiki.replyTo(a, a.body), this.publish("onmessage", this.PUBLISH_ACTION.SEND, a.body))
            } else e.status = $cdaCommonCodes.RESPONSE_STATUS.ERROR, b = {}, b[$cdaCommonCodes.ERROR_DETAIL.ERROR_CODE] = $cdaCommonCodes.ERROR_CODES.INVALID_PARSE_MESSAGE, b[$cdaCommonCodes.ERROR_DETAIL.ERROR_MESSAGE_ID] = $cdaCommonCodes.ERROR_MSG.UNREGISTERED_DEVICE, e.detail = b, this.reply(a, !0, e)
        } catch (g) {
            e = {}, b = {}, e.status = $cdaCommonCodes.RESPONSE_STATUS.ERROR, b[$cdaCommonCodes.ERROR_DETAIL.ERROR_CODE] = $cdaCommonCodes.ERROR_CODES.INVALID_PARSE_MESSAGE, b[$cdaCommonCodes.ERROR_DETAIL.ERROR_MESSAGE_ID] = $cdaCommonCodes.ERROR_MSG.INVALID_PARSE_MESSAGE, e.detail = b, this.reply(a, !0, e), this.publish("onmessage", this.PUBLISH_ACTION.SEND, e)
        }
    },
    reply: function(a, b, c) {
        var d = {},
            e = JSON.parse(a.body);
        b ? (b = c.status, c.detail && (b == $cdaCommonCodes.RESPONSE_STATUS.ERROR && (d.error = c.detail), b == $cdaCommonCodes.RESPONSE_STATUS.SUCCESS &&
            (d.data = c.detail))) : b = $cdaCommonCodes.RESPONSE_STATUS.ERROR;
        d.id = e.id;
        d.action = e.action;
        d.status = b;
        c = JSON.stringify(d);
        $services.shiki.replyTo(a, c);
        this.publish("onmessage", this.PUBLISH_ACTION.SEND, c)
    },
    PUBLISH_ACTION: {
        RECEIVE: "RECEIVE",
        SEND: "SEND"
    },
    EXCLUDE_REGISTERED_CHECK_BY_ACTION: {
        CHECK_STATUS: "check_status"
    }
});
CDAActionsService = $class(Service, {
    checkIn: function(a) {
        function b(a) {
            a = $cdaCommonCodes.ERROR_DETAIL;
            var b = {};
            b.status = $cdaCommonCodes.RESPONSE_STATUS.ERROR;
            b.detail = {};
            b.detail[a.ERROR_CODE] = $cdaCommonCodes.ERROR_CODES.OTHER_DEVICE_ATTACHED;
            b.detail[a.ERROR_MESSAGE_ID] = $cdaCommonCodes.ERROR_MSG.OTHER_DEVICE_ATTACHED;
            b.detail.detail = d;
            return b
        }
        var c = {},
            d = this.searchAttachedDevice(),
            e = new Deferred;
        d ? d.cdaPdid == a.cdaPdid ? c.status = $cdaCommonCodes.RESPONSE_STATUS.SUCCESS : e.resolve(b()) : this.attachDevice(a) ?
            c.status = $cdaCommonCodes.RESPONSE_STATUS.SUCCESS : e.resolve(b());
        c.status == $cdaCommonCodes.RESPONSE_STATUS.SUCCESS && (c.detail = c.detail || {}, this.getNimbusData().always(function(a) {
            c.detail.nimbus = a;
            e.resolve(c)
        }));
        return e
    },
    getNimbusData: function() {
        var a = new Deferred;
        $services.dvbsi.getChannels().always(function(b) {
            var c = {
                countryCode: $locale.country,
                appName: window.MG_APP_NAME,
                oAuthKey: $services.nimbus.nimbusParam.authkey
            };
            b && b.length && (b = $services.dvbsi.getChannelById(b[0].id)._oipfStubMeta.nimbus,
                c.headendId = b.headendId, c.countryCode = b.countryCode, c.region = b.providerName);
            a.resolve(c)
        });
        return a
    },
    checkOut: function(a) {
        var b = $cdaCommonCodes.RESPONSE_STATUS,
            c = {};
        a = this.detachDevice(a);
        c.status = a ? b.SUCCESS : b.ERROR;
        return c
    },
    searchAttachedDevice: function() {
        var a = $services.cda.registeredDevices,
            b = null,
            c, d;
        for (d in a) a.hasOwnProperty(d) && (c = a[d], c.state == $cdaCommonCodes.DEVICE_STATUS.ATTACHED && (b = c));
        return b
    },
    attachDevice: function(a) {
        var b = a.params;
        b.state = $cdaCommonCodes.DEVICE_STATUS.ATTACHED;
        b.cdaPdid = a.cdaPdid;
        return $services.cda.registeredDevices[a.cdaPdid] = b
    },
    detachDevice: function(a) {
        var b = $services.cda.registeredDevices,
            c = null,
            d, e;
        for (e in b) b.hasOwnProperty(e) && (d = b[e], d.state == $cdaCommonCodes.DEVICE_STATUS.ATTACHED && d.cdaPdid == a.cdaPdid && (d.state = $cdaCommonCodes.DEVICE_STATUS.REGISTERED, c = d));
        return c
    },
    getChannelsList: function() {
        var a = new Deferred;
        $services.channel.getChannels().done(function(b) {
            var c = {};
            c.status = $cdaCommonCodes.RESPONSE_STATUS.SUCCESS;
            c.detail = b;
            console.log(b);
            a.resolve(c)
        }).fail(function() {
            var b = {};
            b.status = $cdaCommonCodes.RESPONSE_STATUS.ERROR;
            a.reject(b)
        });
        return a
    },
    unregisterDevice: function(a) {
        var b = $services.cda.registeredDevices,
            c = !1;
        b[a.cdaPdid] && (c = !0, delete b[a.cdaPdid]);
        return c
    },
    registerDevice: function(a) {
        $services.cda.registeredDevices[a] || ($services.cda.registeredDevices[a] = {
            state: $cdaCommonCodes.DEVICE_STATUS.REGISTERED,
            cdaPdid: a
        })
    },
    checkStatus: function(a) {
        var b = {},
            c = a ? a.cdaPdid : "undefined";
        a = {
            cdaPdid: c
        };
        c = $services.cda.registeredDevices[c];
        b.status = $cdaCommonCodes.RESPONSE_STATUS.SUCCESS;
        a.state = c ? c.state : $cdaCommonCodes.DEVICE_STATUS.UNREGISTERED;
        b.detail = a;
        return b
    }
});
CDACommonCodes = $class(Object, {
    CALLER_ACTIONS: {
        CHECK_IN: "check_in",
        CHECK_OUT: "check_out",
        CHANNELS_LIST: "channels_list",
        CHECK_STATUS: "check_status"
    },
    PUBLISH_ACTION: {
        RECEIVE: "RECEIVE",
        SEND: "SEND"
    },
    RESPONSE_STATUS: {
        SUCCESS: "ok",
        ERROR: "error"
    },
    ERROR_DETAIL: {
        ERROR_CODE: "error_code",
        ERROR_MESSAGE_ID: "error_message_id"
    },
    ERROR_CODES: {
        GENERIC_ERROR: "E0001",
        INVALID_ACTION: "E0002",
        DEVICE_EXISTS: "E0003",
        OTHER_DEVICE_ATTACHED: "E0004",
        INVALID_PARSE_MESSAGE: "E9999"
    },
    ERROR_MSG: {
        GENERIC_ERROR: "generic.error",
        INVALID_ACTION: "invalid.action",
        DEVICE_EXISTS: "device.exists",
        OTHER_DEVICE_ATTACHED: "other.device.attached",
        INVALID_PARSE_MESSAGE: "invalid.parse.message",
        UNREGISTERED_DEVICE: "unregistered.device"
    },
    DEVICE_STATUS: {
        REGISTERED: "REGISTERED",
        ATTACHED: "ATTACHED",
        UNREGISTERED: "UNREGISTERED"
    }
});
$cdaCommonCodes = new CDACommonCodes;
$services.cdaActionsServices = new CDAActionsService;
$services.cda = new CDAService;
$services.dial = new DialService;