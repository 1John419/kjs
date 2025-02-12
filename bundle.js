(function () {
  'use strict';

  class CommandQueue {

    constructor() {
      this.queue = [];
      this.queueRunning = false;
      this.commands = {};
    }

    publish(command, data) {
      // console.log(command);
      if (this.commands[command] && this.commands[command].length >= 1) {
        for (const listener of this.commands[command]) {
          this.queue.push({listener, data});
        }
        if (!this.queueRunning) {
          this.runQueue();
        }
      }
    }

    runQueue() {
      this.queueRunning = true;
      while (this.queue.length) {
        const task = this.queue.shift();
        task.listener(task.data);
      }
      this.queueRunning = false;
    }

    subscribe(command, listener) {
      if (!this.commands[command]) {
        this.commands[command] = [];
      }
      this.commands[command].push(listener);
    }

  }

  const queue = new CommandQueue();

  const loadMsg = document.querySelector('.load-msg');
  const loadScroll = document.querySelector('.load-scroll');

  const progress = (msg) => {
    loadMsg.innerHTML += msg + '<br>';
    loadScroll.scrollTop = loadScroll.scrollHeight;
  };

  const e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:global,t=Object.keys,n=Array.isArray;function r(e,n){return "object"!=typeof n||t(n).forEach((function(t){e[t]=n[t];})),e}"undefined"==typeof Promise||e.Promise||(e.Promise=Promise);const s=Object.getPrototypeOf,i={}.hasOwnProperty;function o(e,t){return i.call(e,t)}function a(e,n){"function"==typeof n&&(n=n(s(e))),("undefined"==typeof Reflect?t:Reflect.ownKeys)(n).forEach((t=>{l(e,t,n[t]);}));}const u=Object.defineProperty;function l(e,t,n,s){u(e,t,r(n&&o(n,"get")&&"function"==typeof n.get?{get:n.get,set:n.set,configurable:!0}:{value:n,configurable:!0,writable:!0},s));}function c(e){return {from:function(t){return e.prototype=Object.create(t.prototype),l(e.prototype,"constructor",e),{extend:a.bind(null,e.prototype)}}}}const h=Object.getOwnPropertyDescriptor;function d(e,t){let n;return h(e,t)||(n=s(e))&&d(n,t)}const f=[].slice;function p(e,t,n){return f.call(e,t,n)}function y(e,t){return t(e)}function m(e){if(!e)throw new Error("Assertion Failed")}function b(t){e.setImmediate?setImmediate(t):setTimeout(t,0);}function g(e,t){if("string"==typeof t&&o(e,t))return e[t];if(!t)return e;if("string"!=typeof t){for(var n=[],r=0,s=t.length;r<s;++r){var i=g(e,t[r]);n.push(i);}return n}var a=t.indexOf(".");if(-1!==a){var u=e[t.substr(0,a)];return null==u?void 0:g(u,t.substr(a+1))}}function v(e,t,r){if(e&&void 0!==t&&(!("isFrozen"in Object)||!Object.isFrozen(e)))if("string"!=typeof t&&"length"in t){m("string"!=typeof r&&"length"in r);for(var s=0,i=t.length;s<i;++s)v(e,t[s],r[s]);}else {var a=t.indexOf(".");if(-1!==a){var u=t.substr(0,a),l=t.substr(a+1);if(""===l)void 0===r?n(e)&&!isNaN(parseInt(u))?e.splice(u,1):delete e[u]:e[u]=r;else {var c=e[u];c&&o(e,u)||(c=e[u]={}),v(c,l,r);}}else void 0===r?n(e)&&!isNaN(parseInt(t))?e.splice(t,1):delete e[t]:e[t]=r;}}function w(e){var t={};for(var n in e)o(e,n)&&(t[n]=e[n]);return t}const _=[].concat;function x(e){return _.apply([],e)}const k="BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(x([8,16,32,64].map((e=>["Int","Uint","Float"].map((t=>t+e+"Array")))))).filter((t=>e[t])),O=new Set(k.map((t=>e[t])));function P(e){const t={};for(const n in e)if(o(e,n)){const r=e[n];t[n]=!r||"object"!=typeof r||O.has(r.constructor)?r:P(r);}return t}let E=null;function K(e){E=new WeakMap;const t=S(e);return E=null,t}function S(e){if(!e||"object"!=typeof e)return e;let t=E.get(e);if(t)return t;if(n(e)){t=[],E.set(e,t);for(var r=0,i=e.length;r<i;++r)t.push(S(e[r]));}else if(O.has(e.constructor))t=e;else {const n=s(e);for(var a in t=n===Object.prototype?{}:Object.create(n),E.set(e,t),e)o(e,a)&&(t[a]=S(e[a]));}return t}const{toString:C}={};function A(e){return C.call(e).slice(8,-1)}const j="undefined"!=typeof Symbol?Symbol.iterator:"@@iterator",D="symbol"==typeof j?function(e){var t;return null!=e&&(t=e[j])&&t.apply(e)}:function(){return null};function q(e,t){const n=e.indexOf(t);return n>=0&&e.splice(n,1),n>=0}const T={};function B(e){var t,r,s,i;if(1===arguments.length){if(n(e))return e.slice();if(this===T&&"string"==typeof e)return [e];if(i=D(e)){for(r=[];!(s=i.next()).done;)r.push(s.value);return r}if(null==e)return [e];if("number"==typeof(t=e.length)){for(r=new Array(t);t--;)r[t]=e[t];return r}return [e]}for(t=arguments.length,r=new Array(t);t--;)r[t]=arguments[t];return r}const I="undefined"!=typeof Symbol?e=>"AsyncFunction"===e[Symbol.toStringTag]:()=>!1;var R=["Unknown","Constraint","Data","TransactionInactive","ReadOnly","Version","NotFound","InvalidState","InvalidAccess","Abort","Timeout","QuotaExceeded","Syntax","DataClone"],F=["Modify","Bulk","OpenFailed","VersionChange","Schema","Upgrade","InvalidTable","MissingAPI","NoSuchDatabase","InvalidArgument","SubTransaction","Unsupported","Internal","DatabaseClosed","PrematureCommit","ForeignAwait"].concat(R),$={VersionChanged:"Database version changed by other database connection",DatabaseClosed:"Database has been closed",Abort:"Transaction aborted",TransactionInactive:"Transaction has already completed or failed",MissingAPI:"IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"};function N(e,t){this.name=e,this.message=t;}function M(e,t){return e+". Errors: "+Object.keys(t).map((e=>t[e].toString())).filter(((e,t,n)=>n.indexOf(e)===t)).join("\n")}function L(e,t,n,r){this.failures=t,this.failedKeys=r,this.successCount=n,this.message=M(e,t);}function U(e,t){this.name="BulkError",this.failures=Object.keys(t).map((e=>t[e])),this.failuresByPos=t,this.message=M(e,this.failures);}c(N).from(Error).extend({toString:function(){return this.name+": "+this.message}}),c(L).from(N),c(U).from(N);var V=F.reduce(((e,t)=>(e[t]=t+"Error",e)),{});const z=N;var W=F.reduce(((e,t)=>{var n=t+"Error";function r(e,r){this.name=n,e?"string"==typeof e?(this.message=`${e}${r?"\n "+r:""}`,this.inner=r||null):"object"==typeof e&&(this.message=`${e.name} ${e.message}`,this.inner=e):(this.message=$[t]||n,this.inner=null);}return c(r).from(z),e[t]=r,e}),{});W.Syntax=SyntaxError,W.Type=TypeError,W.Range=RangeError;var Y=R.reduce(((e,t)=>(e[t+"Error"]=W[t],e)),{});var G=F.reduce(((e,t)=>(-1===["Syntax","Type","Range"].indexOf(t)&&(e[t+"Error"]=W[t]),e)),{});function Q(){}function X(e){return e}function H(e,t){return null==e||e===X?t:function(n){return t(e(n))}}function J(e,t){return function(){e.apply(this,arguments),t.apply(this,arguments);}}function Z(e,t){return e===Q?t:function(){var n=e.apply(this,arguments);void 0!==n&&(arguments[0]=n);var r=this.onsuccess,s=this.onerror;this.onsuccess=null,this.onerror=null;var i=t.apply(this,arguments);return r&&(this.onsuccess=this.onsuccess?J(r,this.onsuccess):r),s&&(this.onerror=this.onerror?J(s,this.onerror):s),void 0!==i?i:n}}function ee(e,t){return e===Q?t:function(){e.apply(this,arguments);var n=this.onsuccess,r=this.onerror;this.onsuccess=this.onerror=null,t.apply(this,arguments),n&&(this.onsuccess=this.onsuccess?J(n,this.onsuccess):n),r&&(this.onerror=this.onerror?J(r,this.onerror):r);}}function te(e,t){return e===Q?t:function(n){var s=e.apply(this,arguments);r(n,s);var i=this.onsuccess,o=this.onerror;this.onsuccess=null,this.onerror=null;var a=t.apply(this,arguments);return i&&(this.onsuccess=this.onsuccess?J(i,this.onsuccess):i),o&&(this.onerror=this.onerror?J(o,this.onerror):o),void 0===s?void 0===a?void 0:a:r(s,a)}}function ne(e,t){return e===Q?t:function(){return !1!==t.apply(this,arguments)&&e.apply(this,arguments)}}function re(e,t){return e===Q?t:function(){var n=e.apply(this,arguments);if(n&&"function"==typeof n.then){for(var r=this,s=arguments.length,i=new Array(s);s--;)i[s]=arguments[s];return n.then((function(){return t.apply(r,i)}))}return t.apply(this,arguments)}}G.ModifyError=L,G.DexieError=N,G.BulkError=U;var se="undefined"!=typeof location&&/^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);function ie(e,t){se=e;}var oe={};const[ae,ue,le]="undefined"==typeof Promise?[]:(()=>{let e=Promise.resolve();if("undefined"==typeof crypto||!crypto.subtle)return [e,s(e),e];const t=crypto.subtle.digest("SHA-512",new Uint8Array([0]));return [t,s(t),e]})(),ce=ue&&ue.then,he=ae&&ae.constructor,de=!!le;var fe=function(e,t){_e.push([e,t]),ye&&(queueMicrotask(De),ye=!1);},pe=!0,ye=!0,me=[],be=[],ge=X,ve={id:"global",global:!0,ref:0,unhandleds:[],onunhandled:Q,pgp:!1,env:{},finalize:Q},we=ve,_e=[],xe=0,ke=[];function Oe(e){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");this._listeners=[],this._lib=!1;var t=this._PSD=we;if("function"!=typeof e){if(e!==oe)throw new TypeError("Not a function");return this._state=arguments[1],this._value=arguments[2],void(!1===this._state&&Se(this,this._value))}this._state=null,this._value=null,++t.ref,Ke(this,e);}const Pe={get:function(){var e=we,t=Le;function n(n,r){var s=!e.global&&(e!==we||t!==Le);const i=s&&!We();var o=new Oe(((t,o)=>{Ae(this,new Ee(Ze(n,e,s,i),Ze(r,e,s,i),t,o,e));}));return this._consoleTask&&(o._consoleTask=this._consoleTask),o}return n.prototype=oe,n},set:function(e){l(this,"then",e&&e.prototype===oe?Pe:{get:function(){return e},set:Pe.set});}};function Ee(e,t,n,r,s){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.resolve=n,this.reject=r,this.psd=s;}function Ke(e,t){try{t((t=>{if(null===e._state){if(t===e)throw new TypeError("A promise cannot be resolved with itself.");var n=e._lib&&qe();t&&"function"==typeof t.then?Ke(e,((e,n)=>{t instanceof Oe?t._then(e,n):t.then(e,n);})):(e._state=!0,e._value=t,Ce(e)),n&&Te();}}),Se.bind(null,e));}catch(t){Se(e,t);}}function Se(e,t){if(be.push(t),null===e._state){var n=e._lib&&qe();t=ge(t),e._state=!1,e._value=t,function(e){me.some((t=>t._value===e._value))||me.push(e);}(e),Ce(e),n&&Te();}}function Ce(e){var t=e._listeners;e._listeners=[];for(var n=0,r=t.length;n<r;++n)Ae(e,t[n]);var s=e._PSD;--s.ref||s.finalize(),0===xe&&(++xe,fe((()=>{0==--xe&&Be();}),[]));}function Ae(e,t){if(null!==e._state){var n=e._state?t.onFulfilled:t.onRejected;if(null===n)return (e._state?t.resolve:t.reject)(e._value);++t.psd.ref,++xe,fe(je,[n,e,t]);}else e._listeners.push(t);}function je(e,t,n){try{var r,s=t._value;!t._state&&be.length&&(be=[]),r=se&&t._consoleTask?t._consoleTask.run((()=>e(s))):e(s),t._state||-1!==be.indexOf(s)||function(e){var t=me.length;for(;t;)if(me[--t]._value===e._value)return void me.splice(t,1)}(t),n.resolve(r);}catch(e){n.reject(e);}finally{0==--xe&&Be(),--n.psd.ref||n.psd.finalize();}}function De(){Je(ve,(()=>{qe()&&Te();}));}function qe(){var e=pe;return pe=!1,ye=!1,e}function Te(){var e,t,n;do{for(;_e.length>0;)for(e=_e,_e=[],n=e.length,t=0;t<n;++t){var r=e[t];r[0].apply(null,r[1]);}}while(_e.length>0);pe=!0,ye=!0;}function Be(){var e=me;me=[],e.forEach((e=>{e._PSD.onunhandled.call(null,e._value,e);}));for(var t=ke.slice(0),n=t.length;n;)t[--n]();}function Ie(e){return new Oe(oe,!1,e)}function Re(e,t){var n=we;return function(){var r=qe(),s=we;try{return Xe(n,!0),e.apply(this,arguments)}catch(e){t&&t(e);}finally{Xe(s,!1),r&&Te();}}}a(Oe.prototype,{then:Pe,_then:function(e,t){Ae(this,new Ee(null,null,e,t,we));},catch:function(e){if(1===arguments.length)return this.then(null,e);var t=arguments[0],n=arguments[1];return "function"==typeof t?this.then(null,(e=>e instanceof t?n(e):Ie(e))):this.then(null,(e=>e&&e.name===t?n(e):Ie(e)))},finally:function(e){return this.then((t=>Oe.resolve(e()).then((()=>t))),(t=>Oe.resolve(e()).then((()=>Ie(t)))))},timeout:function(e,t){return e<1/0?new Oe(((n,r)=>{var s=setTimeout((()=>r(new W.Timeout(t))),e);this.then(n,r).finally(clearTimeout.bind(null,s));})):this}}),"undefined"!=typeof Symbol&&Symbol.toStringTag&&l(Oe.prototype,Symbol.toStringTag,"Dexie.Promise"),ve.env=He(),a(Oe,{all:function(){var e=B.apply(null,arguments).map(Ye);return new Oe((function(t,n){0===e.length&&t([]);var r=e.length;e.forEach(((s,i)=>Oe.resolve(s).then((n=>{e[i]=n,--r||t(e);}),n)));}))},resolve:e=>e instanceof Oe?e:e&&"function"==typeof e.then?new Oe(((t,n)=>{e.then(t,n);})):new Oe(oe,!0,e),reject:Ie,race:function(){var e=B.apply(null,arguments).map(Ye);return new Oe(((t,n)=>{e.map((e=>Oe.resolve(e).then(t,n)));}))},PSD:{get:()=>we,set:e=>we=e},totalEchoes:{get:()=>Le},newPSD:Ve,usePSD:Je,scheduler:{get:()=>fe,set:e=>{fe=e;}},rejectionMapper:{get:()=>ge,set:e=>{ge=e;}},follow:(e,t)=>new Oe(((n,r)=>Ve(((t,n)=>{var r=we;r.unhandleds=[],r.onunhandled=n,r.finalize=J((function(){!function(e){function t(){e(),ke.splice(ke.indexOf(t),1);}ke.push(t),++xe,fe((()=>{0==--xe&&Be();}),[]);}((()=>{0===this.unhandleds.length?t():n(this.unhandleds[0]);}));}),r.finalize),e();}),t,n,r)))}),he&&(he.allSettled&&l(Oe,"allSettled",(function(){const e=B.apply(null,arguments).map(Ye);return new Oe((t=>{0===e.length&&t([]);let n=e.length;const r=new Array(n);e.forEach(((e,s)=>Oe.resolve(e).then((e=>r[s]={status:"fulfilled",value:e}),(e=>r[s]={status:"rejected",reason:e})).then((()=>--n||t(r)))));}))})),he.any&&"undefined"!=typeof AggregateError&&l(Oe,"any",(function(){const e=B.apply(null,arguments).map(Ye);return new Oe(((t,n)=>{0===e.length&&n(new AggregateError([]));let r=e.length;const s=new Array(r);e.forEach(((e,i)=>Oe.resolve(e).then((e=>t(e)),(e=>{s[i]=e,--r||n(new AggregateError(s));}))));}))})));const Fe={awaits:0,echoes:0,id:0};var $e=0,Ne=[],Me=0,Le=0,Ue=0;function Ve(e,t,n,s){var i=we,o=Object.create(i);o.parent=i,o.ref=0,o.global=!1,o.id=++Ue,ve.env,o.env=de?{Promise:Oe,PromiseProp:{value:Oe,configurable:!0,writable:!0},all:Oe.all,race:Oe.race,allSettled:Oe.allSettled,any:Oe.any,resolve:Oe.resolve,reject:Oe.reject}:{},t&&r(o,t),++i.ref,o.finalize=function(){--this.parent.ref||this.parent.finalize();};var a=Je(o,e,n,s);return 0===o.ref&&o.finalize(),a}function ze(){return Fe.id||(Fe.id=++$e),++Fe.awaits,Fe.echoes+=100,Fe.id}function We(){return !!Fe.awaits&&(0==--Fe.awaits&&(Fe.id=0),Fe.echoes=100*Fe.awaits,!0)}function Ye(e){return Fe.echoes&&e&&e.constructor===he?(ze(),e.then((e=>(We(),e)),(e=>(We(),tt(e))))):e}function Ge(e){++Le,Fe.echoes&&0!=--Fe.echoes||(Fe.echoes=Fe.awaits=Fe.id=0),Ne.push(we),Xe(e,!0);}function Qe(){var e=Ne[Ne.length-1];Ne.pop(),Xe(e,!1);}function Xe(t,n){var r=we;if((n?!Fe.echoes||Me++&&t===we:!Me||--Me&&t===we)||queueMicrotask(n?Ge.bind(null,t):Qe),t!==we&&(we=t,r===ve&&(ve.env=He()),de)){var s=ve.env.Promise,i=t.env;(r.global||t.global)&&(Object.defineProperty(e,"Promise",i.PromiseProp),s.all=i.all,s.race=i.race,s.resolve=i.resolve,s.reject=i.reject,i.allSettled&&(s.allSettled=i.allSettled),i.any&&(s.any=i.any));}}function He(){var t=e.Promise;return de?{Promise:t,PromiseProp:Object.getOwnPropertyDescriptor(e,"Promise"),all:t.all,race:t.race,allSettled:t.allSettled,any:t.any,resolve:t.resolve,reject:t.reject}:{}}function Je(e,t,n,r,s){var i=we;try{return Xe(e,!0),t(n,r,s)}finally{Xe(i,!1);}}function Ze(e,t,n,r){return "function"!=typeof e?e:function(){var s=we;n&&ze(),Xe(t,!0);try{return e.apply(this,arguments)}finally{Xe(s,!1),r&&queueMicrotask(We);}}}function et(e){Promise===he&&0===Fe.echoes?0===Me?e():enqueueNativeMicroTask(e):setTimeout(e,0);}-1===(""+ce).indexOf("[native code]")&&(ze=We=Q);var tt=Oe.reject;function nt(e,t,n,r){if(e.idbdb&&(e._state.openComplete||we.letThrough||e._vip)){var s=e._createTransaction(t,n,e._dbSchema);try{s.create(),e._state.PR1398_maxLoop=3;}catch(s){return s.name===V.InvalidState&&e.isOpen()&&--e._state.PR1398_maxLoop>0?(console.warn("Dexie: Need to reopen db"),e.close({disableAutoOpen:!1}),e.open().then((()=>nt(e,t,n,r)))):tt(s)}return s._promise(t,((e,t)=>Ve((()=>(we.trans=s,r(e,t,s)))))).then((e=>{if("readwrite"===t)try{s.idbtrans.commit();}catch{}return "readonly"===t?e:s._completion.then((()=>e))}))}if(e._state.openComplete)return tt(new W.DatabaseClosed(e._state.dbOpenError));if(!e._state.isBeingOpened){if(!e._state.autoOpen)return tt(new W.DatabaseClosed);e.open().catch(Q);}return e._state.dbReadyPromise.then((()=>nt(e,t,n,r)))}const rt=String.fromCharCode(65535),st="Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.",it=[];function ot(e,t){return e?t?function(){return e.apply(this,arguments)&&t.apply(this,arguments)}:e:t}const at={type:3,lower:-1/0,lowerOpen:!1,upper:[[]],upperOpen:!1};function ut(e){return "string"!=typeof e||/\./.test(e)?e=>e:t=>(void 0===t[e]&&e in t&&delete(t=K(t))[e],t)}function lt(){throw W.Type()}function ct(e,t){try{const n=ht(e),r=ht(t);if(n!==r)return "Array"===n?1:"Array"===r?-1:"binary"===n?1:"binary"===r?-1:"string"===n?1:"string"===r?-1:"Date"===n?1:"Date"!==r?NaN:-1;switch(n){case"number":case"Date":case"string":return e>t?1:e<t?-1:0;case"binary":return function(e,t){const n=e.length,r=t.length,s=n<r?n:r;for(let n=0;n<s;++n)if(e[n]!==t[n])return e[n]<t[n]?-1:1;return n===r?0:n<r?-1:1}(dt(e),dt(t));case"Array":return function(e,t){const n=e.length,r=t.length,s=n<r?n:r;for(let n=0;n<s;++n){const r=ct(e[n],t[n]);if(0!==r)return r}return n===r?0:n<r?-1:1}(e,t)}}catch{}return NaN}function ht(e){const t=typeof e;if("object"!==t)return t;if(ArrayBuffer.isView(e))return "binary";const n=A(e);return "ArrayBuffer"===n?"binary":n}function dt(e){return e instanceof Uint8Array?e:ArrayBuffer.isView(e)?new Uint8Array(e.buffer,e.byteOffset,e.byteLength):new Uint8Array(e)}class ft{_trans(e,t,n){const r=this._tx||we.trans,s=this.name,i=se&&"undefined"!=typeof console&&console.createTask&&console.createTask(`Dexie: ${"readonly"===e?"read":"write"} ${this.name}`);function o(e,n,r){if(!r.schema[s])throw new W.NotFound("Table "+s+" not part of transaction");return t(r.idbtrans,r)}const a=qe();try{let t=r&&r.db._novip===this.db._novip?r===we.trans?r._promise(e,o,n):Ve((()=>r._promise(e,o,n)),{trans:r,transless:we.transless||we}):nt(this.db,e,[this.name],o);return i&&(t._consoleTask=i,t=t.catch((e=>(console.trace(e),tt(e))))),t}finally{a&&Te();}}get(e,t){return e&&e.constructor===Object?this.where(e).first(t):null==e?tt(new W.Type("Invalid argument to Table.get()")):this._trans("readonly",(t=>this.core.get({trans:t,key:e}).then((e=>this.hook.reading.fire(e))))).then(t)}where(e){if("string"==typeof e)return new this.db.WhereClause(this,e);if(n(e))return new this.db.WhereClause(this,`[${e.join("+")}]`);const r=t(e);if(1===r.length)return this.where(r[0]).equals(e[r[0]]);const s=this.schema.indexes.concat(this.schema.primKey).filter((e=>{if(e.compound&&r.every((t=>e.keyPath.indexOf(t)>=0))){for(let t=0;t<r.length;++t)if(-1===r.indexOf(e.keyPath[t]))return !1;return !0}return !1})).sort(((e,t)=>e.keyPath.length-t.keyPath.length))[0];if(s&&this.db._maxKey!==rt){const t=s.keyPath.slice(0,r.length);return this.where(t).equals(t.map((t=>e[t])))}!s&&se&&console.warn(`The query ${JSON.stringify(e)} on ${this.name} would benefit from a compound index [${r.join("+")}]`);const{idxByName:i}=this.schema,o=this.db._deps.indexedDB;function a(e,t){return 0===o.cmp(e,t)}const[u,l]=r.reduce((([t,r],s)=>{const o=i[s],u=e[s];return [t||o,t||!o?ot(r,o&&o.multi?e=>{const t=g(e,s);return n(t)&&t.some((e=>a(u,e)))}:e=>a(u,g(e,s))):r]}),[null,null]);return u?this.where(u.name).equals(e[u.keyPath]).filter(l):s?this.filter(l):this.where(r).equals("")}filter(e){return this.toCollection().and(e)}count(e){return this.toCollection().count(e)}offset(e){return this.toCollection().offset(e)}limit(e){return this.toCollection().limit(e)}each(e){return this.toCollection().each(e)}toArray(e){return this.toCollection().toArray(e)}toCollection(){return new this.db.Collection(new this.db.WhereClause(this))}orderBy(e){return new this.db.Collection(new this.db.WhereClause(this,n(e)?`[${e.join("+")}]`:e))}reverse(){return this.toCollection().reverse()}mapToClass(e){const{db:t,name:n}=this;this.schema.mappedClass=e,e.prototype instanceof lt&&(e=class extends e{get db(){return t}table(){return n}});const r=new Set;for(let t=e.prototype;t;t=s(t))Object.getOwnPropertyNames(t).forEach((e=>r.add(e)));const i=t=>{if(!t)return t;const n=Object.create(e.prototype);for(let e in t)if(!r.has(e))try{n[e]=t[e];}catch(e){}return n};return this.schema.readHook&&this.hook.reading.unsubscribe(this.schema.readHook),this.schema.readHook=i,this.hook("reading",i),e}defineClass(){return this.mapToClass((function(e){r(this,e);}))}add(e,t){const{auto:n,keyPath:r}=this.schema.primKey;let s=e;return r&&n&&(s=ut(r)(e)),this._trans("readwrite",(e=>this.core.mutate({trans:e,type:"add",keys:null!=t?[t]:null,values:[s]}))).then((e=>e.numFailures?Oe.reject(e.failures[0]):e.lastResult)).then((t=>{if(r)try{v(e,r,t);}catch(e){}return t}))}update(e,t){if("object"!=typeof e||n(e))return this.where(":id").equals(e).modify(t);{const n=g(e,this.schema.primKey.keyPath);return void 0===n?tt(new W.InvalidArgument("Given object does not contain its primary key")):this.where(":id").equals(n).modify(t)}}put(e,t){const{auto:n,keyPath:r}=this.schema.primKey;let s=e;return r&&n&&(s=ut(r)(e)),this._trans("readwrite",(e=>this.core.mutate({trans:e,type:"put",values:[s],keys:null!=t?[t]:null}))).then((e=>e.numFailures?Oe.reject(e.failures[0]):e.lastResult)).then((t=>{if(r)try{v(e,r,t);}catch(e){}return t}))}delete(e){return this._trans("readwrite",(t=>this.core.mutate({trans:t,type:"delete",keys:[e]}))).then((e=>e.numFailures?Oe.reject(e.failures[0]):void 0))}clear(){return this._trans("readwrite",(e=>this.core.mutate({trans:e,type:"deleteRange",range:at}))).then((e=>e.numFailures?Oe.reject(e.failures[0]):void 0))}bulkGet(e){return this._trans("readonly",(t=>this.core.getMany({keys:e,trans:t}).then((e=>e.map((e=>this.hook.reading.fire(e)))))))}bulkAdd(e,t,n){const r=Array.isArray(t)?t:void 0,s=(n=n||(r?void 0:t))?n.allKeys:void 0;return this._trans("readwrite",(t=>{const{auto:n,keyPath:i}=this.schema.primKey;if(i&&r)throw new W.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");if(r&&r.length!==e.length)throw new W.InvalidArgument("Arguments objects and keys must have the same length");const o=e.length;let a=i&&n?e.map(ut(i)):e;return this.core.mutate({trans:t,type:"add",keys:r,values:a,wantResults:s}).then((({numFailures:e,results:t,lastResult:n,failures:r})=>{if(0===e)return s?t:n;throw new U(`${this.name}.bulkAdd(): ${e} of ${o} operations failed`,r)}))}))}bulkPut(e,t,n){const r=Array.isArray(t)?t:void 0,s=(n=n||(r?void 0:t))?n.allKeys:void 0;return this._trans("readwrite",(t=>{const{auto:n,keyPath:i}=this.schema.primKey;if(i&&r)throw new W.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");if(r&&r.length!==e.length)throw new W.InvalidArgument("Arguments objects and keys must have the same length");const o=e.length;let a=i&&n?e.map(ut(i)):e;return this.core.mutate({trans:t,type:"put",keys:r,values:a,wantResults:s}).then((({numFailures:e,results:t,lastResult:n,failures:r})=>{if(0===e)return s?t:n;throw new U(`${this.name}.bulkPut(): ${e} of ${o} operations failed`,r)}))}))}bulkUpdate(e){const t=this.core,n=e.map((e=>e.key)),r=e.map((e=>e.changes)),s=[];return this._trans("readwrite",(i=>t.getMany({trans:i,keys:n,cache:"clone"}).then((o=>{const a=[],u=[];e.forEach((({key:e,changes:t},n)=>{const r=o[n];if(r){for(const n of Object.keys(t)){const s=t[n];if(n===this.schema.primKey.keyPath){if(0!==ct(s,e))throw new W.Constraint("Cannot update primary key in bulkUpdate()")}else v(r,n,s);}s.push(n),a.push(e),u.push(r);}}));const l=a.length;return t.mutate({trans:i,type:"put",keys:a,values:u,updates:{keys:n,changeSpecs:r}}).then((({numFailures:e,failures:t})=>{if(0===e)return l;for(const e of Object.keys(t)){const n=s[Number(e)];if(null!=n){const r=t[e];delete t[e],t[n]=r;}}throw new U(`${this.name}.bulkUpdate(): ${e} of ${l} operations failed`,t)}))}))))}bulkDelete(e){const t=e.length;return this._trans("readwrite",(t=>this.core.mutate({trans:t,type:"delete",keys:e}))).then((({numFailures:e,lastResult:n,failures:r})=>{if(0===e)return n;throw new U(`${this.name}.bulkDelete(): ${e} of ${t} operations failed`,r)}))}}function pt(e){var r={},s=function(t,n){if(n){for(var s=arguments.length,i=new Array(s-1);--s;)i[s-1]=arguments[s];return r[t].subscribe.apply(null,i),e}if("string"==typeof t)return r[t]};s.addEventType=a;for(var i=1,o=arguments.length;i<o;++i)a(arguments[i]);return s;function a(e,t,n){if("object"==typeof e)return u(e);t||(t=ne),n||(n=Q);var i={subscribers:[],fire:n,subscribe:function(e){-1===i.subscribers.indexOf(e)&&(i.subscribers.push(e),i.fire=t(i.fire,e));},unsubscribe:function(e){i.subscribers=i.subscribers.filter((function(t){return t!==e})),i.fire=i.subscribers.reduce(t,n);}};return r[e]=s[e]=i,i}function u(e){t(e).forEach((function(t){var r=e[t];if(n(r))a(t,e[t][0],e[t][1]);else {if("asap"!==r)throw new W.InvalidArgument("Invalid event config");var s=a(t,X,(function(){for(var e=arguments.length,t=new Array(e);e--;)t[e]=arguments[e];s.subscribers.forEach((function(e){b((function(){e.apply(null,t);}));}));}));}}));}}function yt(e,t){return c(t).from({prototype:e}),t}function mt(e,t){return !(e.filter||e.algorithm||e.or)&&(t?e.justLimit:!e.replayFilter)}function bt(e,t){e.filter=ot(e.filter,t);}function gt(e,t,n){var r=e.replayFilter;e.replayFilter=r?()=>ot(r(),t()):t,e.justLimit=n&&!r;}function vt(e,t){if(e.isPrimKey)return t.primaryKey;const n=t.getIndexByKeyPath(e.index);if(!n)throw new W.Schema("KeyPath "+e.index+" on object store "+t.name+" is not indexed");return n}function wt(e,t,n){const r=vt(e,t.schema);return t.openCursor({trans:n,values:!e.keysOnly,reverse:"prev"===e.dir,unique:!!e.unique,query:{index:r,range:e.range}})}function _t(e,t,n,r){const s=e.replayFilter?ot(e.filter,e.replayFilter()):e.filter;if(e.or){const i={},a=(e,n,r)=>{if(!s||s(n,r,(e=>n.stop(e)),(e=>n.fail(e)))){var a=n.primaryKey,u=""+a;"[object ArrayBuffer]"===u&&(u=""+new Uint8Array(a)),o(i,u)||(i[u]=!0,t(e,n,r));}};return Promise.all([e.or._iterate(a,n),xt(wt(e,r,n),e.algorithm,a,!e.keysOnly&&e.valueMapper)])}return xt(wt(e,r,n),ot(e.algorithm,s),t,!e.keysOnly&&e.valueMapper)}function xt(e,t,n,r){var s=Re(r?(e,t,s)=>n(r(e),t,s):n);return e.then((e=>{if(e)return e.start((()=>{var n=()=>e.continue();t&&!t(e,(e=>n=e),(t=>{e.stop(t),n=Q;}),(t=>{e.fail(t),n=Q;}))||s(e.value,e,(e=>n=e)),n();}))}))}class Ot{execute(e){const t=this.replacePrefix?.[0];return t&&"string"==typeof e&&e.startsWith(t)?this.replacePrefix[1]+e.substring(t.length):e}constructor(e){Object.assign(this,e);}}class Pt{_read(e,t){var n=this._ctx;return n.error?n.table._trans(null,tt.bind(null,n.error)):n.table._trans("readonly",e).then(t)}_write(e){var t=this._ctx;return t.error?t.table._trans(null,tt.bind(null,t.error)):t.table._trans("readwrite",e,"locked")}_addAlgorithm(e){var t=this._ctx;t.algorithm=ot(t.algorithm,e);}_iterate(e,t){return _t(this._ctx,e,t,this._ctx.table.core)}clone(e){var t=Object.create(this.constructor.prototype),n=Object.create(this._ctx);return e&&r(n,e),t._ctx=n,t}raw(){return this._ctx.valueMapper=null,this}each(e){var t=this._ctx;return this._read((n=>_t(t,e,n,t.table.core)))}count(e){return this._read((e=>{const t=this._ctx,n=t.table.core;if(mt(t,!0))return n.count({trans:e,query:{index:vt(t,n.schema),range:t.range}}).then((e=>Math.min(e,t.limit)));var r=0;return _t(t,(()=>(++r,!1)),e,n).then((()=>r))})).then(e)}sortBy(e,t){const n=e.split(".").reverse(),r=n[0],s=n.length-1;function i(e,t){return t?i(e[n[t]],t-1):e[r]}var o="next"===this._ctx.dir?1:-1;function a(e,t){var n=i(e,s),r=i(t,s);return n<r?-o:n>r?o:0}return this.toArray((function(e){return e.sort(a)})).then(t)}toArray(e){return this._read((e=>{var t=this._ctx;if("next"===t.dir&&mt(t,!0)&&t.limit>0){const{valueMapper:n}=t,r=vt(t,t.table.core.schema);return t.table.core.query({trans:e,limit:t.limit,values:!0,query:{index:r,range:t.range}}).then((({result:e})=>n?e.map(n):e))}{const n=[];return _t(t,(e=>n.push(e)),e,t.table.core).then((()=>n))}}),e)}offset(e){var t=this._ctx;return e<=0||(t.offset+=e,mt(t)?gt(t,(()=>{var t=e;return (e,n)=>0===t||(1===t?(--t,!1):(n((()=>{e.advance(t),t=0;})),!1))})):gt(t,(()=>{var t=e;return ()=>--t<0}))),this}limit(e){return this._ctx.limit=Math.min(this._ctx.limit,e),gt(this._ctx,(()=>{var t=e;return function(e,n,r){return --t<=0&&n(r),t>=0}}),!0),this}until(e,t){return bt(this._ctx,(function(n,r,s){return !e(n.value)||(r(s),t)})),this}first(e){return this.limit(1).toArray((function(e){return e[0]})).then(e)}last(e){return this.reverse().first(e)}filter(e){var t,n;return bt(this._ctx,(function(t){return e(t.value)})),t=this._ctx,n=e,t.isMatch=ot(t.isMatch,n),this}and(e){return this.filter(e)}or(e){return new this.db.WhereClause(this._ctx.table,e,this)}reverse(){return this._ctx.dir="prev"===this._ctx.dir?"next":"prev",this._ondirectionchange&&this._ondirectionchange(this._ctx.dir),this}desc(){return this.reverse()}eachKey(e){var t=this._ctx;return t.keysOnly=!t.isMatch,this.each((function(t,n){e(n.key,n);}))}eachUniqueKey(e){return this._ctx.unique="unique",this.eachKey(e)}eachPrimaryKey(e){var t=this._ctx;return t.keysOnly=!t.isMatch,this.each((function(t,n){e(n.primaryKey,n);}))}keys(e){var t=this._ctx;t.keysOnly=!t.isMatch;var n=[];return this.each((function(e,t){n.push(t.key);})).then((function(){return n})).then(e)}primaryKeys(e){var t=this._ctx;if("next"===t.dir&&mt(t,!0)&&t.limit>0)return this._read((e=>{var n=vt(t,t.table.core.schema);return t.table.core.query({trans:e,values:!1,limit:t.limit,query:{index:n,range:t.range}})})).then((({result:e})=>e)).then(e);t.keysOnly=!t.isMatch;var n=[];return this.each((function(e,t){n.push(t.primaryKey);})).then((function(){return n})).then(e)}uniqueKeys(e){return this._ctx.unique="unique",this.keys(e)}firstKey(e){return this.limit(1).keys((function(e){return e[0]})).then(e)}lastKey(e){return this.reverse().firstKey(e)}distinct(){var e=this._ctx,t=e.index&&e.table.schema.idxByName[e.index];if(!t||!t.multi)return this;var n={};return bt(this._ctx,(function(e){var t=e.primaryKey.toString(),r=o(n,t);return n[t]=!0,!r})),this}modify(e){var n=this._ctx;return this._write((r=>{var s;if("function"==typeof e)s=e;else {var i=t(e),o=i.length;s=function(t){let n=!1;for(let r=0;r<o;++r){let s=i[r],o=e[s],a=g(t,s);o instanceof Ot?(v(t,s,o.execute(a)),n=!0):a!==o&&(v(t,s,o),n=!0);}return n};}const a=n.table.core,{outbound:u,extractKey:l}=a.schema.primaryKey,c=this.db._options.modifyChunkSize||200,h=[];let d=0;const f=[],p=(e,n)=>{const{failures:r,numFailures:s}=n;d+=e-s;for(let e of t(r))h.push(r[e]);};return this.clone().primaryKeys().then((t=>{const i=o=>{const h=Math.min(c,t.length-o);return a.getMany({trans:r,keys:t.slice(o,o+h),cache:"immutable"}).then((d=>{const f=[],y=[],m=u?[]:null,b=[];for(let e=0;e<h;++e){const n=d[e],r={value:K(n),primKey:t[o+e]};!1!==s.call(r,r.value,r)&&(null==r.value?b.push(t[o+e]):u||0===ct(l(n),l(r.value))?(y.push(r.value),u&&m.push(t[o+e])):(b.push(t[o+e]),f.push(r.value)));}const g=mt(n)&&n.limit===1/0&&("function"!=typeof e||e===Et)&&{index:n.index,range:n.range};return Promise.resolve(f.length>0&&a.mutate({trans:r,type:"add",values:f}).then((e=>{for(let t in e.failures)b.splice(parseInt(t),1);p(f.length,e);}))).then((()=>(y.length>0||g&&"object"==typeof e)&&a.mutate({trans:r,type:"put",keys:m,values:y,criteria:g,changeSpec:"function"!=typeof e&&e}).then((e=>p(y.length,e))))).then((()=>(b.length>0||g&&e===Et)&&a.mutate({trans:r,type:"delete",keys:b,criteria:g}).then((e=>p(b.length,e))))).then((()=>t.length>o+h&&i(o+c)))}))};return i(0).then((()=>{if(h.length>0)throw new L("Error modifying one or more objects",h,d,f);return t.length}))}))}))}delete(){var e=this._ctx,t=e.range;return mt(e)&&(e.isPrimKey||3===t.type)?this._write((n=>{const{primaryKey:r}=e.table.core.schema,s=t;return e.table.core.count({trans:n,query:{index:r,range:s}}).then((t=>e.table.core.mutate({trans:n,type:"deleteRange",range:s}).then((({failures:e,lastResult:n,results:r,numFailures:s})=>{if(s)throw new L("Could not delete some values",Object.keys(e).map((t=>e[t])),t-s);return t-s}))))})):this.modify(Et)}}const Et=(e,t)=>t.value=null;function Kt(e,t){return e<t?-1:e===t?0:1}function St(e,t){return e>t?-1:e===t?0:1}function Ct(e,t,n){var r=e instanceof Bt?new e.Collection(e):e;return r._ctx.error=n?new n(t):new TypeError(t),r}function At(e){return new e.Collection(e,(()=>Tt(""))).limit(0)}function jt(e,t,n,r,s,i){for(var o=Math.min(e.length,r.length),a=-1,u=0;u<o;++u){var l=t[u];if(l!==r[u])return s(e[u],n[u])<0?e.substr(0,u)+n[u]+n.substr(u+1):s(e[u],r[u])<0?e.substr(0,u)+r[u]+n.substr(u+1):a>=0?e.substr(0,a)+t[a]+n.substr(a+1):null;s(e[u],l)<0&&(a=u);}return o<r.length&&"next"===i?e+n.substr(e.length):o<e.length&&"prev"===i?e.substr(0,n.length):a<0?null:e.substr(0,a)+r[a]+n.substr(a+1)}function Dt(e,t,n,r){var s,i,o,a,u,l,c,h=n.length;if(!n.every((e=>"string"==typeof e)))return Ct(e,"String expected.");function d(e){s=function(e){return "next"===e?e=>e.toUpperCase():e=>e.toLowerCase()}(e),i=function(e){return "next"===e?e=>e.toLowerCase():e=>e.toUpperCase()}(e),o="next"===e?Kt:St;var t=n.map((function(e){return {lower:i(e),upper:s(e)}})).sort((function(e,t){return o(e.lower,t.lower)}));a=t.map((function(e){return e.upper})),u=t.map((function(e){return e.lower})),l=e,c="next"===e?"":r;}d("next");var f=new e.Collection(e,(()=>qt(a[0],u[h-1]+r)));f._ondirectionchange=function(e){d(e);};var p=0;return f._addAlgorithm((function(e,n,r){var s=e.key;if("string"!=typeof s)return !1;var d=i(s);if(t(d,u,p))return !0;for(var f=null,y=p;y<h;++y){var m=jt(s,d,a[y],u[y],o,l);null===m&&null===f?p=y+1:(null===f||o(f,m)>0)&&(f=m);}return n(null!==f?function(){e.continue(f+c);}:r),!1})),f}function qt(e,t,n,r){return {type:2,lower:e,upper:t,lowerOpen:n,upperOpen:r}}function Tt(e){return {type:1,lower:e,upper:e}}class Bt{get Collection(){return this._ctx.table.db.Collection}between(e,t,n,r){n=!1!==n,r=!0===r;try{return this._cmp(e,t)>0||0===this._cmp(e,t)&&(n||r)&&(!n||!r)?At(this):new this.Collection(this,(()=>qt(e,t,!n,!r)))}catch(e){return Ct(this,st)}}equals(e){return null==e?Ct(this,st):new this.Collection(this,(()=>Tt(e)))}above(e){return null==e?Ct(this,st):new this.Collection(this,(()=>qt(e,void 0,!0)))}aboveOrEqual(e){return null==e?Ct(this,st):new this.Collection(this,(()=>qt(e,void 0,!1)))}below(e){return null==e?Ct(this,st):new this.Collection(this,(()=>qt(void 0,e,!1,!0)))}belowOrEqual(e){return null==e?Ct(this,st):new this.Collection(this,(()=>qt(void 0,e)))}startsWith(e){return "string"!=typeof e?Ct(this,"String expected."):this.between(e,e+rt,!0,!0)}startsWithIgnoreCase(e){return ""===e?this.startsWith(e):Dt(this,((e,t)=>0===e.indexOf(t[0])),[e],rt)}equalsIgnoreCase(e){return Dt(this,((e,t)=>e===t[0]),[e],"")}anyOfIgnoreCase(){var e=B.apply(T,arguments);return 0===e.length?At(this):Dt(this,((e,t)=>-1!==t.indexOf(e)),e,"")}startsWithAnyOfIgnoreCase(){var e=B.apply(T,arguments);return 0===e.length?At(this):Dt(this,((e,t)=>t.some((t=>0===e.indexOf(t)))),e,rt)}anyOf(){const e=B.apply(T,arguments);let t=this._cmp;try{e.sort(t);}catch(e){return Ct(this,st)}if(0===e.length)return At(this);const n=new this.Collection(this,(()=>qt(e[0],e[e.length-1])));n._ondirectionchange=n=>{t="next"===n?this._ascending:this._descending,e.sort(t);};let r=0;return n._addAlgorithm(((n,s,i)=>{const o=n.key;for(;t(o,e[r])>0;)if(++r,r===e.length)return s(i),!1;return 0===t(o,e[r])||(s((()=>{n.continue(e[r]);})),!1)})),n}notEqual(e){return this.inAnyRange([[-(1/0),e],[e,this.db._maxKey]],{includeLowers:!1,includeUppers:!1})}noneOf(){const e=B.apply(T,arguments);if(0===e.length)return new this.Collection(this);try{e.sort(this._ascending);}catch(e){return Ct(this,st)}const t=e.reduce(((e,t)=>e?e.concat([[e[e.length-1][1],t]]):[[-(1/0),t]]),null);return t.push([e[e.length-1],this.db._maxKey]),this.inAnyRange(t,{includeLowers:!1,includeUppers:!1})}inAnyRange(e,t){const n=this._cmp,r=this._ascending,s=this._descending,i=this._min,o=this._max;if(0===e.length)return At(this);if(!e.every((e=>void 0!==e[0]&&void 0!==e[1]&&r(e[0],e[1])<=0)))return Ct(this,"First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower",W.InvalidArgument);const a=!t||!1!==t.includeLowers,u=t&&!0===t.includeUppers;let l,c=r;function h(e,t){return c(e[0],t[0])}try{l=e.reduce((function(e,t){let r=0,s=e.length;for(;r<s;++r){const s=e[r];if(n(t[0],s[1])<0&&n(t[1],s[0])>0){s[0]=i(s[0],t[0]),s[1]=o(s[1],t[1]);break}}return r===s&&e.push(t),e}),[]),l.sort(h);}catch(e){return Ct(this,st)}let d=0;const f=u?e=>r(e,l[d][1])>0:e=>r(e,l[d][1])>=0,p=a?e=>s(e,l[d][0])>0:e=>s(e,l[d][0])>=0;let y=f;const m=new this.Collection(this,(()=>qt(l[0][0],l[l.length-1][1],!a,!u)));return m._ondirectionchange=e=>{"next"===e?(y=f,c=r):(y=p,c=s),l.sort(h);},m._addAlgorithm(((e,t,n)=>{for(var s=e.key;y(s);)if(++d,d===l.length)return t(n),!1;return !!function(e){return !f(e)&&!p(e)}(s)||(0===this._cmp(s,l[d][1])||0===this._cmp(s,l[d][0])||t((()=>{c===r?e.continue(l[d][0]):e.continue(l[d][1]);})),!1)})),m}startsWithAnyOf(){const e=B.apply(T,arguments);return e.every((e=>"string"==typeof e))?0===e.length?At(this):this.inAnyRange(e.map((e=>[e,e+rt]))):Ct(this,"startsWithAnyOf() only works with strings")}}function It(e){return Re((function(t){return Rt(t),e(t.target.error),!1}))}function Rt(e){e.stopPropagation&&e.stopPropagation(),e.preventDefault&&e.preventDefault();}const Ft=pt(null,"storagemutated");class $t{_lock(){return m(!we.global),++this._reculock,1!==this._reculock||we.global||(we.lockOwnerFor=this),this}_unlock(){if(m(!we.global),0==--this._reculock)for(we.global||(we.lockOwnerFor=null);this._blockedFuncs.length>0&&!this._locked();){var e=this._blockedFuncs.shift();try{Je(e[1],e[0]);}catch(e){}}return this}_locked(){return this._reculock&&we.lockOwnerFor!==this}create(e){if(!this.mode)return this;const t=this.db.idbdb,n=this.db._state.dbOpenError;if(m(!this.idbtrans),!e&&!t)switch(n&&n.name){case"DatabaseClosedError":throw new W.DatabaseClosed(n);case"MissingAPIError":throw new W.MissingAPI(n.message,n);default:throw new W.OpenFailed(n)}if(!this.active)throw new W.TransactionInactive;return m(null===this._completion._state),(e=this.idbtrans=e||(this.db.core?this.db.core.transaction(this.storeNames,this.mode,{durability:this.chromeTransactionDurability}):t.transaction(this.storeNames,this.mode,{durability:this.chromeTransactionDurability}))).onerror=Re((t=>{Rt(t),this._reject(e.error);})),e.onabort=Re((t=>{Rt(t),this.active&&this._reject(new W.Abort(e.error)),this.active=!1,this.on("abort").fire(t);})),e.oncomplete=Re((()=>{this.active=!1,this._resolve(),"mutatedParts"in e&&Ft.storagemutated.fire(e.mutatedParts);})),this}_promise(e,t,n){if("readwrite"===e&&"readwrite"!==this.mode)return tt(new W.ReadOnly("Transaction is readonly"));if(!this.active)return tt(new W.TransactionInactive);if(this._locked())return new Oe(((r,s)=>{this._blockedFuncs.push([()=>{this._promise(e,t,n).then(r,s);},we]);}));if(n)return Ve((()=>{var e=new Oe(((e,n)=>{this._lock();const r=t(e,n,this);r&&r.then&&r.then(e,n);}));return e.finally((()=>this._unlock())),e._lib=!0,e}));var r=new Oe(((e,n)=>{var r=t(e,n,this);r&&r.then&&r.then(e,n);}));return r._lib=!0,r}_root(){return this.parent?this.parent._root():this}waitFor(e){var t=this._root();const n=Oe.resolve(e);if(t._waitingFor)t._waitingFor=t._waitingFor.then((()=>n));else {t._waitingFor=n,t._waitingQueue=[];var r=t.idbtrans.objectStore(t.storeNames[0]);!function e(){for(++t._spinCount;t._waitingQueue.length;)t._waitingQueue.shift()();t._waitingFor&&(r.get(-1/0).onsuccess=e);}();}var s=t._waitingFor;return new Oe(((e,r)=>{n.then((n=>t._waitingQueue.push(Re(e.bind(null,n)))),(e=>t._waitingQueue.push(Re(r.bind(null,e))))).finally((()=>{t._waitingFor===s&&(t._waitingFor=null);}));}))}abort(){this.active&&(this.active=!1,this.idbtrans&&this.idbtrans.abort(),this._reject(new W.Abort));}table(e){const t=this._memoizedTables||(this._memoizedTables={});if(o(t,e))return t[e];const n=this.schema[e];if(!n)throw new W.NotFound("Table "+e+" not part of transaction");const r=new this.db.Table(e,n,this);return r.core=this.db.core.table(e),t[e]=r,r}}function Nt(e,t,n,r,s,i,o){return {name:e,keyPath:t,unique:n,multi:r,auto:s,compound:i,src:(n&&!o?"&":"")+(r?"*":"")+(s?"++":"")+Mt(t)}}function Mt(e){return "string"==typeof e?e:e?"["+[].join.call(e,"+")+"]":""}function Lt(e,t,n){return {name:e,primKey:t,indexes:n,mappedClass:null,idxByName:(r=n,s=e=>[e.name,e],r.reduce(((e,t,n)=>{var r=s(t,n);return r&&(e[r[0]]=r[1]),e}),{}))};var r,s;}let Ut=e=>{try{return e.only([[]]),Ut=()=>[[]],[[]]}catch(e){return Ut=()=>rt,rt}};function Vt(e){return null==e?()=>{}:"string"==typeof e?function(e){return 1===e.split(".").length?t=>t[e]:t=>g(t,e)}(e):t=>g(t,e)}function zt(e){return [].slice.call(e)}let Wt=0;function Yt(e){return null==e?":id":"string"==typeof e?e:`[${e.join("+")}]`}function Gt(e,t,r){function s(e){if(3===e.type)return null;if(4===e.type)throw new Error("Cannot convert never type to IDBKeyRange");const{lower:n,upper:r,lowerOpen:s,upperOpen:i}=e;return void 0===n?void 0===r?null:t.upperBound(r,!!i):void 0===r?t.lowerBound(n,!!s):t.bound(n,r,!!s,!!i)}const{schema:i,hasGetAll:o}=function(e,t){const r=zt(e.objectStoreNames);return {schema:{name:e.name,tables:r.map((e=>t.objectStore(e))).map((e=>{const{keyPath:t,autoIncrement:r}=e,s=n(t),i=null==t,o={},a={name:e.name,primaryKey:{name:null,isPrimaryKey:!0,outbound:i,compound:s,keyPath:t,autoIncrement:r,unique:!0,extractKey:Vt(t)},indexes:zt(e.indexNames).map((t=>e.index(t))).map((e=>{const{name:t,unique:r,multiEntry:s,keyPath:i}=e,a={name:t,compound:n(i),keyPath:i,unique:r,multiEntry:s,extractKey:Vt(i)};return o[Yt(i)]=a,a})),getIndexByKeyPath:e=>o[Yt(e)]};return o[":id"]=a.primaryKey,null!=t&&(o[Yt(t)]=a.primaryKey),a}))},hasGetAll:r.length>0&&"getAll"in t.objectStore(r[0])&&!("undefined"!=typeof navigator&&/Safari/.test(navigator.userAgent)&&!/(Chrome\/|Edge\/)/.test(navigator.userAgent)&&[].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1]<604)}}(e,r),a=i.tables.map((e=>function(e){const t=e.name;return {name:t,schema:e,mutate:function({trans:e,type:n,keys:r,values:i,range:o}){return new Promise(((a,u)=>{a=Re(a);const l=e.objectStore(t),c=null==l.keyPath,h="put"===n||"add"===n;if(!h&&"delete"!==n&&"deleteRange"!==n)throw new Error("Invalid operation type: "+n);const{length:d}=r||i||{length:1};if(r&&i&&r.length!==i.length)throw new Error("Given keys array must have same length as given values array.");if(0===d)return a({numFailures:0,failures:{},results:[],lastResult:void 0});let f;const p=[],y=[];let m=0;const b=e=>{++m,Rt(e);};if("deleteRange"===n){if(4===o.type)return a({numFailures:m,failures:y,results:[],lastResult:void 0});3===o.type?p.push(f=l.clear()):p.push(f=l.delete(s(o)));}else {const[e,t]=h?c?[i,r]:[i,null]:[r,null];if(h)for(let r=0;r<d;++r)p.push(f=t&&void 0!==t[r]?l[n](e[r],t[r]):l[n](e[r])),f.onerror=b;else for(let t=0;t<d;++t)p.push(f=l[n](e[t])),f.onerror=b;}const g=e=>{const t=e.target.result;p.forEach(((e,t)=>null!=e.error&&(y[t]=e.error))),a({numFailures:m,failures:y,results:"delete"===n?r:p.map((e=>e.result)),lastResult:t});};f.onerror=e=>{b(e),g(e);},f.onsuccess=g;}))},getMany:({trans:e,keys:n})=>new Promise(((r,s)=>{r=Re(r);const i=e.objectStore(t),o=n.length,a=new Array(o);let u,l=0,c=0;const h=e=>{const t=e.target;a[t._pos]=t.result,++c===l&&r(a);},d=It(s);for(let e=0;e<o;++e)null!=n[e]&&(u=i.get(n[e]),u._pos=e,u.onsuccess=h,u.onerror=d,++l);0===l&&r(a);})),get:({trans:e,key:n})=>new Promise(((r,s)=>{r=Re(r);const i=e.objectStore(t).get(n);i.onsuccess=e=>r(e.target.result),i.onerror=It(s);})),query:function(e){return n=>new Promise(((r,i)=>{r=Re(r);const{trans:o,values:a,limit:u,query:l}=n,c=u===1/0?void 0:u,{index:h,range:d}=l,f=o.objectStore(t),p=h.isPrimaryKey?f:f.index(h.name),y=s(d);if(0===u)return r({result:[]});if(e){const e=a?p.getAll(y,c):p.getAllKeys(y,c);e.onsuccess=e=>r({result:e.target.result}),e.onerror=It(i);}else {let e=0;const t=a||!("openKeyCursor"in p)?p.openCursor(y):p.openKeyCursor(y),n=[];t.onsuccess=s=>{const i=t.result;return i?(n.push(a?i.value:i.primaryKey),++e===u?r({result:n}):void i.continue()):r({result:n})},t.onerror=It(i);}}))}(o),openCursor:function({trans:e,values:n,query:r,reverse:i,unique:o}){return new Promise(((a,u)=>{a=Re(a);const{index:l,range:c}=r,h=e.objectStore(t),d=l.isPrimaryKey?h:h.index(l.name),f=i?o?"prevunique":"prev":o?"nextunique":"next",p=n||!("openKeyCursor"in d)?d.openCursor(s(c),f):d.openKeyCursor(s(c),f);p.onerror=It(u),p.onsuccess=Re((t=>{const n=p.result;if(!n)return void a(null);n.___id=++Wt,n.done=!1;const r=n.continue.bind(n);let s=n.continuePrimaryKey;s&&(s=s.bind(n));const i=n.advance.bind(n),o=()=>{throw new Error("Cursor not stopped")};n.trans=e,n.stop=n.continue=n.continuePrimaryKey=n.advance=()=>{throw new Error("Cursor not started")},n.fail=Re(u),n.next=function(){let e=1;return this.start((()=>e--?this.continue():this.stop())).then((()=>this))},n.start=e=>{const t=new Promise(((e,t)=>{e=Re(e),p.onerror=It(t),n.fail=t,n.stop=t=>{n.stop=n.continue=n.continuePrimaryKey=n.advance=o,e(t);};})),a=()=>{if(p.result)try{e();}catch(e){n.fail(e);}else n.done=!0,n.start=()=>{throw new Error("Cursor behind last entry")},n.stop();};return p.onsuccess=Re((e=>{p.onsuccess=a,a();})),n.continue=r,n.continuePrimaryKey=s,n.advance=i,a(),t},a(n);}),u);}))},count({query:e,trans:n}){const{index:r,range:i}=e;return new Promise(((e,o)=>{const a=n.objectStore(t),u=r.isPrimaryKey?a:a.index(r.name),l=s(i),c=l?u.count(l):u.count();c.onsuccess=Re((t=>e(t.target.result))),c.onerror=It(o);}))}}}(e))),u={};return a.forEach((e=>u[e.name]=e)),{stack:"dbcore",transaction:e.transaction.bind(e),table(e){if(!u[e])throw new Error(`Table '${e}' not found`);return u[e]},MIN_KEY:-1/0,MAX_KEY:Ut(t),schema:i}}function Qt(e,t){const n=t.db,r=function(e,t,{IDBKeyRange:n,indexedDB:r},s){const i=function(e,t){return t.reduce(((e,{create:t})=>({...e,...t(e)})),e)}(Gt(t,n,s),e.dbcore);return {dbcore:i}}(e._middlewares,n,e._deps,t);e.core=r.dbcore,e.tables.forEach((t=>{const n=t.name;e.core.schema.tables.some((e=>e.name===n))&&(t.core=e.core.table(n),e[n]instanceof e.Table&&(e[n].core=t.core));}));}function Xt(e,t,n,r){n.forEach((n=>{const s=r[n];t.forEach((t=>{const r=d(t,n);(!r||"value"in r&&void 0===r.value)&&(t===e.Transaction.prototype||t instanceof e.Transaction?l(t,n,{get(){return this.table(n)},set(e){u(this,n,{value:e,writable:!0,configurable:!0,enumerable:!0});}}):t[n]=new e.Table(n,s));}));}));}function Ht(e,t){t.forEach((t=>{for(let n in t)t[n]instanceof e.Table&&delete t[n];}));}function Jt(e,t){return e._cfg.version-t._cfg.version}function Zt(e,n,r,s){const i=e._dbSchema;r.objectStoreNames.contains("$meta")&&!i.$meta&&(i.$meta=Lt("$meta",an("")[0],[]),e._storeNames.push("$meta"));const o=e._createTransaction("readwrite",e._storeNames,i);o.create(r),o._completion.catch(s);const a=o._reject.bind(o),u=we.transless||we;Ve((()=>{if(we.trans=o,we.transless=u,0!==n)return Qt(e,r),function(e,t,n){return t.storeNames.includes("$meta")?t.table("$meta").get("version").then((e=>null!=e?e:n)):Oe.resolve(n)}(0,o,n).then((n=>function(e,n,r,s){const i=[],o=e._versions;let a=e._dbSchema=sn(e,e.idbdb,s);const u=o.filter((e=>e._cfg.version>=n));if(0===u.length)return Oe.resolve();function l(){return i.length?Oe.resolve(i.shift()(r.idbtrans)).then(l):Oe.resolve()}return u.forEach((o=>{i.push((()=>{const i=a,u=o._cfg.dbschema;on(e,i,s),on(e,u,s),a=e._dbSchema=u;const l=en(i,u);l.add.forEach((e=>{tn(s,e[0],e[1].primKey,e[1].indexes);})),l.change.forEach((e=>{if(e.recreate)throw new W.Upgrade("Not yet support for changing primary key");{const t=s.objectStore(e.name);e.add.forEach((e=>rn(t,e))),e.change.forEach((e=>{t.deleteIndex(e.name),rn(t,e);})),e.del.forEach((e=>t.deleteIndex(e)));}}));const c=o._cfg.contentUpgrade;if(c&&o._cfg.version>n){Qt(e,s),r._memoizedTables={};let n=w(u);l.del.forEach((e=>{n[e]=i[e];})),Ht(e,[e.Transaction.prototype]),Xt(e,[e.Transaction.prototype],t(n),n),r.schema=n;const o=I(c);let a;o&&ze();const h=Oe.follow((()=>{if(a=c(r),a&&o){var e=We.bind(null,null);a.then(e,e);}}));return a&&"function"==typeof a.then?Oe.resolve(a):h.then((()=>a))}})),i.push((t=>{!function(e,t){[].slice.call(t.db.objectStoreNames).forEach((n=>null==e[n]&&t.db.deleteObjectStore(n)));}(o._cfg.dbschema,t),Ht(e,[e.Transaction.prototype]),Xt(e,[e.Transaction.prototype],e._storeNames,e._dbSchema),r.schema=e._dbSchema;})),i.push((t=>{e.idbdb.objectStoreNames.contains("$meta")&&(Math.ceil(e.idbdb.version/10)===o._cfg.version?(e.idbdb.deleteObjectStore("$meta"),delete e._dbSchema.$meta,e._storeNames=e._storeNames.filter((e=>"$meta"!==e))):t.objectStore("$meta").put(o._cfg.version,"version"));}));})),l().then((()=>{nn(a,s);}))}(e,n,o,r))).catch(a);t(i).forEach((e=>{tn(r,e,i[e].primKey,i[e].indexes);})),Qt(e,r),Oe.follow((()=>e.on.populate.fire(o))).catch(a);}));}function en(e,t){const n={del:[],add:[],change:[]};let r;for(r in e)t[r]||n.del.push(r);for(r in t){const s=e[r],i=t[r];if(s){const e={name:r,def:i,recreate:!1,del:[],add:[],change:[]};if(""+(s.primKey.keyPath||"")!=""+(i.primKey.keyPath||"")||s.primKey.auto!==i.primKey.auto)e.recreate=!0,n.change.push(e);else {const t=s.idxByName,r=i.idxByName;let o;for(o in t)r[o]||e.del.push(o);for(o in r){const n=t[o],s=r[o];n?n.src!==s.src&&e.change.push(s):e.add.push(s);}(e.del.length>0||e.add.length>0||e.change.length>0)&&n.change.push(e);}}else n.add.push([r,i]);}return n}function tn(e,t,n,r){const s=e.db.createObjectStore(t,n.keyPath?{keyPath:n.keyPath,autoIncrement:n.auto}:{autoIncrement:n.auto});return r.forEach((e=>rn(s,e))),s}function nn(e,n){t(e).forEach((t=>{n.db.objectStoreNames.contains(t)||(se&&console.debug("Dexie: Creating missing table",t),tn(n,t,e[t].primKey,e[t].indexes));}));}function rn(e,t){e.createIndex(t.name,t.keyPath,{unique:t.unique,multiEntry:t.multi});}function sn(e,t,n){const r={};return p(t.objectStoreNames,0).forEach((e=>{const t=n.objectStore(e);let s=t.keyPath;const i=Nt(Mt(s),s||"",!0,!1,!!t.autoIncrement,s&&"string"!=typeof s,!0),o=[];for(let e=0;e<t.indexNames.length;++e){const n=t.index(t.indexNames[e]);s=n.keyPath;var a=Nt(n.name,s,!!n.unique,!!n.multiEntry,!1,s&&"string"!=typeof s,!1);o.push(a);}r[e]=Lt(e,i,o);})),r}function on(t,n,r){const s=r.db.objectStoreNames;for(let e=0;e<s.length;++e){const i=s[e],o=r.objectStore(i);t._hasGetAll="getAll"in o;for(let e=0;e<o.indexNames.length;++e){const t=o.indexNames[e],r=o.index(t).keyPath,s="string"==typeof r?r:"["+p(r).join("+")+"]";if(n[i]){const e=n[i].idxByName[s];e&&(e.name=t,delete n[i].idxByName[s],n[i].idxByName[t]=e);}}}"undefined"!=typeof navigator&&/Safari/.test(navigator.userAgent)&&!/(Chrome\/|Edge\/)/.test(navigator.userAgent)&&e.WorkerGlobalScope&&e instanceof e.WorkerGlobalScope&&[].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1]<604&&(t._hasGetAll=!1);}function an(e){return e.split(",").map(((e,t)=>{const r=(e=e.trim()).replace(/([&*]|\+\+)/g,""),s=/^\[/.test(r)?r.match(/^\[(.*)\]$/)[1].split("+"):r;return Nt(r,s||null,/\&/.test(e),/\*/.test(e),/\+\+/.test(e),n(s),0===t)}))}class un{_parseStoresSpec(e,n){t(e).forEach((t=>{if(null!==e[t]){var r=an(e[t]),s=r.shift();if(s.unique=!0,s.multi)throw new W.Schema("Primary key cannot be multi-valued");r.forEach((e=>{if(e.auto)throw new W.Schema("Only primary key can be marked as autoIncrement (++)");if(!e.keyPath)throw new W.Schema("Index must have a name and cannot be an empty string")})),n[t]=Lt(t,s,r);}}));}stores(e){const n=this.db;this._cfg.storesSource=this._cfg.storesSource?r(this._cfg.storesSource,e):e;const s=n._versions,i={};let o={};return s.forEach((e=>{r(i,e._cfg.storesSource),o=e._cfg.dbschema={},e._parseStoresSpec(i,o);})),n._dbSchema=o,Ht(n,[n._allTables,n,n.Transaction.prototype]),Xt(n,[n._allTables,n,n.Transaction.prototype,this._cfg.tables],t(o),o),n._storeNames=t(o),this}upgrade(e){return this._cfg.contentUpgrade=re(this._cfg.contentUpgrade||Q,e),this}}function ln(e,t){let n=e._dbNamesDB;return n||(n=e._dbNamesDB=new Hn("__dbnames",{addons:[],indexedDB:e,IDBKeyRange:t}),n.version(1).stores({dbnames:"name"})),n.table("dbnames")}function cn(e){return e&&"function"==typeof e.databases}function hn(e){return Ve((function(){return we.letThrough=!0,e()}))}function dn(){var e;return !navigator.userAgentData&&/Safari\//.test(navigator.userAgent)&&!/Chrom(e|ium)\//.test(navigator.userAgent)&&indexedDB.databases?new Promise((function(t){var n=function(){return indexedDB.databases().finally(t)};e=setInterval(n,100),n();})).finally((function(){return clearInterval(e)})):Promise.resolve()}function fn(e){return !("from"in e)}const pn=function(e,t){if(!this){const t=new pn;return e&&"d"in e&&r(t,e),t}r(this,arguments.length?{d:1,from:e,to:arguments.length>1?t:e}:{d:0});};function yn(e,t,n){const s=ct(t,n);if(isNaN(s))return;if(s>0)throw RangeError();if(fn(e))return r(e,{from:t,to:n,d:1});const i=e.l,o=e.r;if(ct(n,e.from)<0)return i?yn(i,t,n):e.l={from:t,to:n,d:1,l:null,r:null},vn(e);if(ct(t,e.to)>0)return o?yn(o,t,n):e.r={from:t,to:n,d:1,l:null,r:null},vn(e);ct(t,e.from)<0&&(e.from=t,e.l=null,e.d=o?o.d+1:1),ct(n,e.to)>0&&(e.to=n,e.r=null,e.d=e.l?e.l.d+1:1);const a=!e.r;i&&!e.l&&mn(e,i),o&&a&&mn(e,o);}function mn(e,t){fn(t)||function e(t,{from:n,to:r,l:s,r:i}){yn(t,n,r),s&&e(t,s),i&&e(t,i);}(e,t);}function bn(e,t){const n=gn(t);let r=n.next();if(r.done)return !1;let s=r.value;const i=gn(e);let o=i.next(s.from),a=o.value;for(;!r.done&&!o.done;){if(ct(a.from,s.to)<=0&&ct(a.to,s.from)>=0)return !0;ct(s.from,a.from)<0?s=(r=n.next(a.from)).value:a=(o=i.next(s.from)).value;}return !1}function gn(e){let t=fn(e)?null:{s:0,n:e};return {next(e){const n=arguments.length>0;for(;t;)switch(t.s){case 0:if(t.s=1,n)for(;t.n.l&&ct(e,t.n.from)<0;)t={up:t,n:t.n.l,s:1};else for(;t.n.l;)t={up:t,n:t.n.l,s:1};case 1:if(t.s=2,!n||ct(e,t.n.to)<=0)return {value:t.n,done:!1};case 2:if(t.n.r){t.s=3,t={up:t,n:t.n.r,s:0};continue}case 3:t=t.up;}return {done:!0}}}}function vn(e){const t=(e.r?.d||0)-(e.l?.d||0),n=t>1?"r":t<-1?"l":"";if(n){const t="r"===n?"l":"r",r={...e},s=e[n];e.from=s.from,e.to=s.to,e[n]=s[n],r[n]=s[t],e[t]=r,r.d=wn(r);}e.d=wn(e);}function wn({r:e,l:t}){return (e?t?Math.max(e.d,t.d):e.d:t?t.d:0)+1}function _n(e,n){return t(n).forEach((t=>{e[t]?mn(e[t],n[t]):e[t]=P(n[t]);})),e}function xn(e,t){return e.all||t.all||Object.keys(e).some((n=>t[n]&&bn(t[n],e[n])))}a(pn.prototype,{add(e){return mn(this,e),this},addKey(e){return yn(this,e,e),this},addKeys(e){return e.forEach((e=>yn(this,e,e))),this},[j](){return gn(this)}});const kn={};let On={},Pn=!1;function En(e,t=!1){_n(On,e),Pn||(Pn=!0,setTimeout((()=>{Pn=!1;const e=On;On={},Kn(e,!1);}),0));}function Kn(e,t=!1){const n=new Set;if(e.all)for(const r of Object.values(kn))Sn(r,e,n,t);else for(const r in e){const s=/^idb\:\/\/(.*)\/(.*)\//.exec(r);if(s){const[,r,i]=s,o=kn[`idb://${r}/${i}`];o&&Sn(o,e,n,t);}}n.forEach((e=>e()));}function Sn(e,t,n,r){const s=[];for(const[i,o]of Object.entries(e.queries.query)){const e=[];for(const s of o)xn(t,s.obsSet)?s.subscribers.forEach((e=>n.add(e))):r&&e.push(s);r&&s.push([i,e]);}if(r)for(const[t,n]of s)e.queries.query[t]=n;}function Cn(e){const n=e._state,{indexedDB:r}=e._deps;if(n.isBeingOpened||e.idbdb)return n.dbReadyPromise.then((()=>n.dbOpenError?tt(n.dbOpenError):e));n.isBeingOpened=!0,n.dbOpenError=null,n.openComplete=!1;const s=n.openCanceller;let i=Math.round(10*e.verno),o=!1;function a(){if(n.openCanceller!==s)throw new W.DatabaseClosed("db.open() was cancelled")}let u=n.dbReadyResolve,l=null,c=!1;const h=()=>new Oe(((s,u)=>{if(a(),!r)throw new W.MissingAPI;const d=e.name,f=n.autoSchema||!i?r.open(d):r.open(d,i);if(!f)throw new W.MissingAPI;f.onerror=It(u),f.onblocked=Re(e._fireOnBlocked),f.onupgradeneeded=Re((t=>{if(l=f.transaction,n.autoSchema&&!e._options.allowEmptyDB){f.onerror=Rt,l.abort(),f.result.close();const e=r.deleteDatabase(d);e.onsuccess=e.onerror=Re((()=>{u(new W.NoSuchDatabase(`Database ${d} doesnt exist`));}));}else {l.onerror=It(u);const n=t.oldVersion>Math.pow(2,62)?0:t.oldVersion;c=n<1,e.idbdb=f.result,o&&function(e,t){nn(e._dbSchema,t),t.db.version%10!=0||t.objectStoreNames.contains("$meta")||t.db.createObjectStore("$meta").add(Math.ceil(t.db.version/10-1),"version");const n=sn(0,e.idbdb,t);on(e,e._dbSchema,t);const r=en(n,e._dbSchema);for(const e of r.change){if(e.change.length||e.recreate)return void console.warn(`Unable to patch indexes of table ${e.name} because it has changes on the type of index or primary key.`);const n=t.objectStore(e.name);e.add.forEach((t=>{se&&console.debug(`Dexie upgrade patch: Creating missing index ${e.name}.${t.src}`),rn(n,t);}));}}(e,l),Zt(e,n/10,l,u);}}),u),f.onsuccess=Re((()=>{l=null;const r=e.idbdb=f.result,a=p(r.objectStoreNames);if(a.length>0)try{const l=r.transaction(1===(u=a).length?u[0]:u,"readonly");if(n.autoSchema)!function(e,n,r){e.verno=n.version/10;const s=e._dbSchema=sn(0,n,r);e._storeNames=p(n.objectStoreNames,0),Xt(e,[e._allTables],t(s),s);}(e,r,l);else if(on(e,e._dbSchema,l),!function(e,t){const n=en(sn(0,e.idbdb,t),e._dbSchema);return !(n.add.length||n.change.some((e=>e.add.length||e.change.length)))}(e,l)&&!o)return console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this."),r.close(),i=r.version+1,o=!0,s(h());Qt(e,l);}catch(e){}var u;it.push(e),r.onversionchange=Re((t=>{n.vcFired=!0,e.on("versionchange").fire(t);})),r.onclose=Re((t=>{e.on("close").fire(t);})),c&&function({indexedDB:e,IDBKeyRange:t},n){!cn(e)&&"__dbnames"!==n&&ln(e,t).put({name:n}).catch(Q);}(e._deps,d),s();}),u);})).catch((e=>{switch(e?.name){case"UnknownError":if(n.PR1398_maxLoop>0)return n.PR1398_maxLoop--,console.warn("Dexie: Workaround for Chrome UnknownError on open()"),h();break;case"VersionError":if(i>0)return i=0,h()}return Oe.reject(e)}));return Oe.race([s,("undefined"==typeof navigator?Oe.resolve():dn()).then(h)]).then((()=>(a(),n.onReadyBeingFired=[],Oe.resolve(hn((()=>e.on.ready.fire(e.vip)))).then((function t(){if(n.onReadyBeingFired.length>0){let r=n.onReadyBeingFired.reduce(re,Q);return n.onReadyBeingFired=[],Oe.resolve(hn((()=>r(e.vip)))).then(t)}}))))).finally((()=>{n.openCanceller===s&&(n.onReadyBeingFired=null,n.isBeingOpened=!1);})).catch((t=>{n.dbOpenError=t;try{l&&l.abort();}catch{}return s===n.openCanceller&&e._close(),tt(t)})).finally((()=>{n.openComplete=!0,u();})).then((()=>{if(c){const t={};e.tables.forEach((n=>{n.schema.indexes.forEach((r=>{r.name&&(t[`idb://${e.name}/${n.name}/${r.name}`]=new pn(-1/0,[[[]]]));})),t[`idb://${e.name}/${n.name}/`]=t[`idb://${e.name}/${n.name}/:dels`]=new pn(-1/0,[[[]]]);})),Ft("storagemutated").fire(t),Kn(t,!0);}return e}))}function An(e){var t=t=>e.next(t),r=i(t),s=i((t=>e.throw(t)));function i(e){return t=>{var i=e(t),o=i.value;return i.done?o:o&&"function"==typeof o.then?o.then(r,s):n(o)?Promise.all(o).then(r,s):r(o)}}return i(t)()}function jn(e,t,n){var r=arguments.length;if(r<2)throw new W.InvalidArgument("Too few arguments");for(var s=new Array(r-1);--r;)s[r-1]=arguments[r];n=s.pop();var i=x(s);return [e,i,n]}function Dn(e,t,n,r,s){return Oe.resolve().then((()=>{const i=we.transless||we,o=e._createTransaction(t,n,e._dbSchema,r);o.explicit=!0;const a={trans:o,transless:i};if(r)o.idbtrans=r.idbtrans;else try{o.create(),o.idbtrans._explicit=!0,e._state.PR1398_maxLoop=3;}catch(r){return r.name===V.InvalidState&&e.isOpen()&&--e._state.PR1398_maxLoop>0?(console.warn("Dexie: Need to reopen db"),e.close({disableAutoOpen:!1}),e.open().then((()=>Dn(e,t,n,null,s)))):tt(r)}const u=I(s);let l;u&&ze();const c=Oe.follow((()=>{if(l=s.call(o,o),l)if(u){var e=We.bind(null,null);l.then(e,e);}else "function"==typeof l.next&&"function"==typeof l.throw&&(l=An(l));}),a);return (l&&"function"==typeof l.then?Oe.resolve(l).then((e=>o.active?e:tt(new W.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn")))):c.then((()=>l))).then((e=>(r&&o._resolve(),o._completion.then((()=>e))))).catch((e=>(o._reject(e),tt(e))))}))}function qn(e,t,r){const s=n(e)?e.slice():[e];for(let e=0;e<r;++e)s.push(t);return s}const Tn={stack:"dbcore",name:"VirtualIndexMiddleware",level:1,create:function(e){return {...e,table(t){const n=e.table(t),{schema:r}=n,s={},i=[];function o(e,t,n){const r=Yt(e),a=s[r]=s[r]||[],u=null==e?0:"string"==typeof e?1:e.length,l=t>0,c={...n,name:l?`${r}(virtual-from:${n.name})`:n.name,lowLevelIndex:n,isVirtual:l,keyTail:t,keyLength:u,extractKey:Vt(e),unique:!l&&n.unique};if(a.push(c),c.isPrimaryKey||i.push(c),u>1){o(2===u?e[0]:e.slice(0,u-1),t+1,n);}return a.sort(((e,t)=>e.keyTail-t.keyTail)),c}const a=o(r.primaryKey.keyPath,0,r.primaryKey);s[":id"]=[a];for(const e of r.indexes)o(e.keyPath,0,e);function u(t){const n=t.query.index;return n.isVirtual?{...t,query:{index:n.lowLevelIndex,range:(r=t.query.range,s=n.keyTail,{type:1===r.type?2:r.type,lower:qn(r.lower,r.lowerOpen?e.MAX_KEY:e.MIN_KEY,s),lowerOpen:!0,upper:qn(r.upper,r.upperOpen?e.MIN_KEY:e.MAX_KEY,s),upperOpen:!0})}}:t;var r,s;}const l={...n,schema:{...r,primaryKey:a,indexes:i,getIndexByKeyPath:function(e){const t=s[Yt(e)];return t&&t[0]}},count:e=>n.count(u(e)),query:e=>n.query(u(e)),openCursor(t){const{keyTail:r,isVirtual:s,keyLength:i}=t.query.index;if(!s)return n.openCursor(t);return n.openCursor(u(t)).then((n=>n&&function(n){const s=Object.create(n,{continue:{value:function(s){null!=s?n.continue(qn(s,t.reverse?e.MAX_KEY:e.MIN_KEY,r)):t.unique?n.continue(n.key.slice(0,i).concat(t.reverse?e.MIN_KEY:e.MAX_KEY,r)):n.continue();}},continuePrimaryKey:{value(t,s){n.continuePrimaryKey(qn(t,e.MAX_KEY,r),s);}},primaryKey:{get:()=>n.primaryKey},key:{get(){const e=n.key;return 1===i?e[0]:e.slice(0,i)}},value:{get:()=>n.value}});return s}(n)))}};return l}}}};function Bn(e,n,r,s){return r=r||{},s=s||"",t(e).forEach((t=>{if(o(n,t)){var i=e[t],a=n[t];if("object"==typeof i&&"object"==typeof a&&i&&a){const e=A(i);e!==A(a)?r[s+t]=n[t]:"Object"===e?Bn(i,a,r,s+t+"."):i!==a&&(r[s+t]=n[t]);}else i!==a&&(r[s+t]=n[t]);}else r[s+t]=void 0;})),t(n).forEach((t=>{o(e,t)||(r[s+t]=n[t]);})),r}function In(e,t){return "delete"===t.type?t.keys:t.keys||t.values.map(e.extractKey)}const Rn={stack:"dbcore",name:"HooksMiddleware",level:2,create:e=>({...e,table(t){const n=e.table(t),{primaryKey:r}=n.schema,s={...n,mutate(e){const s=we.trans,{deleting:i,creating:a,updating:u}=s.table(t).hook;switch(e.type){case"add":if(a.fire===Q)break;return s._promise("readwrite",(()=>l(e)),!0);case"put":if(a.fire===Q&&u.fire===Q)break;return s._promise("readwrite",(()=>l(e)),!0);case"delete":if(i.fire===Q)break;return s._promise("readwrite",(()=>l(e)),!0);case"deleteRange":if(i.fire===Q)break;return s._promise("readwrite",(()=>function(e){return c(e.trans,e.range,1e4)}(e)),!0)}return n.mutate(e);function l(e){const t=we.trans,s=e.keys||In(r,e);if(!s)throw new Error("Keys missing");return "delete"!==(e="add"===e.type||"put"===e.type?{...e,keys:s}:{...e}).type&&(e.values=[...e.values]),e.keys&&(e.keys=[...e.keys]),function(e,t,n){return "add"===t.type?Promise.resolve([]):e.getMany({trans:t.trans,keys:n,cache:"immutable"})}(n,e,s).then((l=>{const c=s.map(((n,s)=>{const c=l[s],h={onerror:null,onsuccess:null};if("delete"===e.type)i.fire.call(h,n,c,t);else if("add"===e.type||void 0===c){const i=a.fire.call(h,n,e.values[s],t);null==n&&null!=i&&(n=i,e.keys[s]=n,r.outbound||v(e.values[s],r.keyPath,n));}else {const r=Bn(c,e.values[s]),i=u.fire.call(h,r,n,c,t);if(i){const t=e.values[s];Object.keys(i).forEach((e=>{o(t,e)?t[e]=i[e]:v(t,e,i[e]);}));}}return h}));return n.mutate(e).then((({failures:t,results:n,numFailures:r,lastResult:i})=>{for(let r=0;r<s.length;++r){const i=n?n[r]:s[r],o=c[r];null==i?o.onerror&&o.onerror(t[r]):o.onsuccess&&o.onsuccess("put"===e.type&&l[r]?e.values[r]:i);}return {failures:t,results:n,numFailures:r,lastResult:i}})).catch((e=>(c.forEach((t=>t.onerror&&t.onerror(e))),Promise.reject(e))))}))}function c(e,t,s){return n.query({trans:e,values:!1,query:{index:r,range:t},limit:s}).then((({result:n})=>l({type:"delete",keys:n,trans:e}).then((r=>r.numFailures>0?Promise.reject(r.failures[0]):n.length<s?{failures:[],numFailures:0,lastResult:void 0}:c(e,{...t,lower:n[n.length-1],lowerOpen:!0},s)))))}}};return s}})};function Fn(e,t,n){try{if(!t)return null;if(t.keys.length<e.length)return null;const r=[];for(let s=0,i=0;s<t.keys.length&&i<e.length;++s)0===ct(t.keys[s],e[i])&&(r.push(n?K(t.values[s]):t.values[s]),++i);return r.length===e.length?r:null}catch{return null}}const $n={stack:"dbcore",level:-1,create:e=>({table:t=>{const n=e.table(t);return {...n,getMany:e=>{if(!e.cache)return n.getMany(e);const t=Fn(e.keys,e.trans._cache,"clone"===e.cache);return t?Oe.resolve(t):n.getMany(e).then((t=>(e.trans._cache={keys:e.keys,values:"clone"===e.cache?K(t):t},t)))},mutate:e=>("add"!==e.type&&(e.trans._cache=null),n.mutate(e))}}})};function Nn(e,t){return "readonly"===e.trans.mode&&!!e.subscr&&!e.trans.explicit&&"disabled"!==e.trans.db._options.cache&&!t.schema.primaryKey.outbound}function Mn(e,t){switch(e){case"query":return t.values&&!t.unique;case"get":case"getMany":case"count":case"openCursor":return !1}}const Ln={stack:"dbcore",level:0,name:"Observability",create:e=>{const r=e.schema.name,s=new pn(e.MIN_KEY,e.MAX_KEY);return {...e,transaction:(t,n,r)=>{if(we.subscr&&"readonly"!==n)throw new W.ReadOnly(`Readwrite transaction in liveQuery context. Querier source: ${we.querier}`);return e.transaction(t,n,r)},table:i=>{const o=e.table(i),{schema:a}=o,{primaryKey:u,indexes:l}=a,{extractKey:c,outbound:h}=u,d=u.autoIncrement&&l.filter((e=>e.compound&&e.keyPath.includes(u.keyPath))),f={...o,mutate:e=>{const t=e.trans,l=e.mutatedParts||(e.mutatedParts={}),c=e=>{const t=`idb://${r}/${i}/${e}`;return l[t]||(l[t]=new pn)},h=c(""),f=c(":dels"),{type:p}=e;let[y,m]="deleteRange"===e.type?[e.range]:"delete"===e.type?[e.keys]:e.values.length<50?[In(u,e).filter((e=>e)),e.values]:[];const b=e.trans._cache;if(n(y)){h.addKeys(y);const e="delete"===p||y.length===m.length?Fn(y,b):null;e||f.addKeys(y),(e||m)&&function(e,t,r,s){function i(t){const i=e(t.name||"");function o(e){return null!=e?t.extractKey(e):null}const a=e=>t.multiEntry&&n(e)?e.forEach((e=>i.addKey(e))):i.addKey(e);(r||s).forEach(((e,t)=>{const n=r&&o(r[t]),i=s&&o(s[t]);0!==ct(n,i)&&(null!=n&&a(n),null!=i&&a(i));}));}t.indexes.forEach(i);}(c,a,e,m);}else if(y){const e={from:y.lower,to:y.upper};f.add(e),h.add(e);}else h.add(s),f.add(s),a.indexes.forEach((e=>c(e.name).add(s)));return o.mutate(e).then((n=>(!y||"add"!==e.type&&"put"!==e.type||(h.addKeys(n.results),d&&d.forEach((t=>{const r=e.values.map((e=>t.extractKey(e))),s=t.keyPath.findIndex((e=>e===u.keyPath));n.results.forEach((e=>r[s]=e)),c(t.name).addKeys(r);}))),t.mutatedParts=_n(t.mutatedParts||{},l),n)))}},p=({query:{index:t,range:n}})=>[t,new pn(n.lower??e.MIN_KEY,n.upper??e.MAX_KEY)],y={get:e=>[u,new pn(e.key)],getMany:e=>[u,(new pn).addKeys(e.keys)],count:p,query:p,openCursor:p};return t(y).forEach((e=>{f[e]=function(t){const{subscr:n}=we,a=!!n;let u=Nn(we,o)&&Mn(e,t);const l=u?t.obsSet={}:n;if(a){const n=e=>{const t=`idb://${r}/${i}/${e}`;return l[t]||(l[t]=new pn)},a=n(""),u=n(":dels"),[d,f]=y[e](t);if("query"===e&&d.isPrimaryKey&&!t.values?u.add(f):n(d.name||"").add(f),!d.isPrimaryKey){if("count"!==e){const n="query"===e&&h&&t.values&&o.query({...t,values:!1});return o[e].apply(this,arguments).then((r=>{if("query"===e){if(h&&t.values)return n.then((({result:e})=>(a.addKeys(e),r)));const e=t.values?r.result.map(c):r.result;t.values?a.addKeys(e):u.addKeys(e);}else if("openCursor"===e){const e=r,n=t.values;return e&&Object.create(e,{key:{get:()=>(u.addKey(e.primaryKey),e.key)},primaryKey:{get(){const t=e.primaryKey;return u.addKey(t),t}},value:{get:()=>(n&&a.addKey(e.primaryKey),e.value)}})}return r}))}u.add(s);}}return o[e].apply(this,arguments)};})),f}}}};function Un(e,t,r){if(0===r.numFailures)return t;if("deleteRange"===t.type)return null;const s=t.keys?t.keys.length:"values"in t&&t.values?t.values.length:1;if(r.numFailures===s)return null;const i={...t};return n(i.keys)&&(i.keys=i.keys.filter(((e,t)=>!(t in r.failures)))),"values"in i&&n(i.values)&&(i.values=i.values.filter(((e,t)=>!(t in r.failures)))),i}function Vn(e,t){return function(e,t){return void 0===t.lower||(t.lowerOpen?ct(e,t.lower)>0:ct(e,t.lower)>=0)}(e,t)&&function(e,t){return void 0===t.upper||(t.upperOpen?ct(e,t.upper)<0:ct(e,t.upper)<=0)}(e,t)}function zn(e,t,r,s,i,o){if(!r||0===r.length)return e;const a=t.query.index,{multiEntry:u}=a,l=t.query.range,c=s.schema.primaryKey.extractKey,h=a.extractKey,d=(a.lowLevelIndex||a).extractKey;let f=r.reduce(((e,r)=>{let s=e;const i="add"===r.type||"put"===r.type?r.values.filter((e=>{const t=h(e);return u&&n(t)?t.some((e=>Vn(e,l))):Vn(t,l)})).map((e=>(e=K(e),o&&Object.freeze(e),e))):[];switch(r.type){case"add":s=e.concat(t.values?i:i.map((e=>c(e))));break;case"put":const n=(new pn).addKeys(r.values.map((e=>c(e))));s=e.filter((e=>{const r=t.values?c(e):e;return !bn(new pn(r),n)})).concat(t.values?i:i.map((e=>c(e))));break;case"delete":const o=(new pn).addKeys(r.keys);s=e.filter((e=>{const n=t.values?c(e):e;return !bn(new pn(n),o)}));break;case"deleteRange":const a=r.range;s=e.filter((e=>!Vn(c(e),a)));}return s}),e);return f===e?e:(f.sort(((e,t)=>ct(d(e),d(t))||ct(c(e),c(t)))),t.limit&&t.limit<1/0&&(f.length>t.limit?f.length=t.limit:e.length===t.limit&&f.length<t.limit&&(i.dirty=!0)),o?Object.freeze(f):f)}function Wn(e,t){return 0===ct(e.lower,t.lower)&&0===ct(e.upper,t.upper)&&!!e.lowerOpen==!!t.lowerOpen&&!!e.upperOpen==!!t.upperOpen}function Yn(e,t){return function(e,t,n,r){if(void 0===e)return void 0!==t?-1:0;if(void 0===t)return 1;const s=ct(e,t);if(0===s){if(n&&r)return 0;if(n)return 1;if(r)return -1}return s}(e.lower,t.lower,e.lowerOpen,t.lowerOpen)<=0&&function(e,t,n,r){if(void 0===e)return void 0!==t?1:0;if(void 0===t)return -1;const s=ct(e,t);if(0===s){if(n&&r)return 0;if(n)return -1;if(r)return 1}return s}(e.upper,t.upper,e.upperOpen,t.upperOpen)>=0}function Gn(e,t,n,r){e.subscribers.add(n),r.addEventListener("abort",(()=>{e.subscribers.delete(n),0===e.subscribers.size&&function(e,t){setTimeout((()=>{0===e.subscribers.size&&q(t,e);}),3e3);}(e,t);}));}const Qn={stack:"dbcore",level:0,name:"Cache",create:e=>{const t=e.schema.name,n={...e,transaction:(n,r,s)=>{const i=e.transaction(n,r,s);if("readwrite"===r){const s=new AbortController,{signal:o}=s,a=o=>()=>{if(s.abort(),"readwrite"===r){const r=new Set;for(const s of n){const n=kn[`idb://${t}/${s}`];if(n){const t=e.table(s),a=n.optimisticOps.filter((e=>e.trans===i));if(i._explicit&&o&&i.mutatedParts)for(const e of Object.values(n.queries.query))for(const t of e.slice())xn(t.obsSet,i.mutatedParts)&&(q(e,t),t.subscribers.forEach((e=>r.add(e))));else if(a.length>0){n.optimisticOps=n.optimisticOps.filter((e=>e.trans!==i));for(const e of Object.values(n.queries.query))for(const n of e.slice())if(null!=n.res&&i.mutatedParts)if(o&&!n.dirty){const s=Object.isFrozen(n.res),i=zn(n.res,n.req,a,t,n,s);n.dirty?(q(e,n),n.subscribers.forEach((e=>r.add(e)))):i!==n.res&&(n.res=i,n.promise=Oe.resolve({result:i}));}else n.dirty&&q(e,n),n.subscribers.forEach((e=>r.add(e)));}}}r.forEach((e=>e()));}};i.addEventListener("abort",a(!1),{signal:o}),i.addEventListener("error",a(!1),{signal:o}),i.addEventListener("complete",a(!0),{signal:o});}return i},table(n){const r=e.table(n),s=r.schema.primaryKey,i={...r,mutate(e){const i=we.trans;if(s.outbound||"disabled"===i.db._options.cache||i.explicit)return r.mutate(e);const o=kn[`idb://${t}/${n}`];if(!o)return r.mutate(e);const a=r.mutate(e);return "add"!==e.type&&"put"!==e.type||!(e.values.length>=50||In(s,e).some((e=>null==e)))?(o.optimisticOps.push(e),e.mutatedParts&&En(e.mutatedParts),a.then((t=>{if(t.numFailures>0){q(o.optimisticOps,e);const n=Un(0,e,t);n&&o.optimisticOps.push(n),e.mutatedParts&&En(e.mutatedParts);}})),a.catch((()=>{q(o.optimisticOps,e),e.mutatedParts&&En(e.mutatedParts);}))):a.then((t=>{const n=Un(0,{...e,values:e.values.map(((e,n)=>{const r=s.keyPath?.includes(".")?K(e):{...e};return v(r,s.keyPath,t.results[n]),r}))},t);o.optimisticOps.push(n),queueMicrotask((()=>e.mutatedParts&&En(e.mutatedParts)));})),a},query(e){if(!Nn(we,r)||!Mn("query",e))return r.query(e);const s="immutable"===we.trans?.db._options.cache,{requery:i,signal:o}=we;let[a,u,l,c]=function(e,t,n,r){const s=kn[`idb://${e}/${t}`];if(!s)return [];const i=s.queries[n];if(!i)return [null,!1,s,null];const o=i[(r.query?r.query.index.name:null)||""];if(!o)return [null,!1,s,null];switch(n){case"query":const e=o.find((e=>e.req.limit===r.limit&&e.req.values===r.values&&Wn(e.req.query.range,r.query.range)));return e?[e,!0,s,o]:[o.find((e=>("limit"in e.req?e.req.limit:1/0)>=r.limit&&(!r.values||e.req.values)&&Yn(e.req.query.range,r.query.range))),!1,s,o];case"count":const t=o.find((e=>Wn(e.req.query.range,r.query.range)));return [t,!!t,s,o]}}(t,n,"query",e);if(a&&u)a.obsSet=e.obsSet;else {const i=r.query(e).then((e=>{const t=e.result;if(a&&(a.res=t),s){for(let e=0,n=t.length;e<n;++e)Object.freeze(t[e]);Object.freeze(t);}else e.result=K(t);return e})).catch((e=>(c&&a&&q(c,a),Promise.reject(e))));a={obsSet:e.obsSet,promise:i,subscribers:new Set,type:"query",req:e,dirty:!1},c?c.push(a):(c=[a],l||(l=kn[`idb://${t}/${n}`]={queries:{query:{},count:{}},objs:new Map,optimisticOps:[],unsignaledParts:{}}),l.queries.query[e.query.index.name||""]=c);}return Gn(a,c,i,o),a.promise.then((t=>({result:zn(t.result,e,l?.optimisticOps,r,a,s)})))}};return i}};return n}};function Xn(e,t){return new Proxy(e,{get:(e,n,r)=>"db"===n?t:Reflect.get(e,n,r)})}class Hn{constructor(e,t){this._middlewares={},this.verno=0;const n=Hn.dependencies;this._options=t={addons:Hn.addons,autoOpen:!0,indexedDB:n.indexedDB,IDBKeyRange:n.IDBKeyRange,cache:"cloned",...t},this._deps={indexedDB:t.indexedDB,IDBKeyRange:t.IDBKeyRange};const{addons:r}=t;this._dbSchema={},this._versions=[],this._storeNames=[],this._allTables={},this.idbdb=null,this._novip=this;const s={dbOpenError:null,isBeingOpened:!1,onReadyBeingFired:null,openComplete:!1,dbReadyResolve:Q,dbReadyPromise:null,cancelOpen:Q,openCanceller:null,autoSchema:!0,PR1398_maxLoop:3,autoOpen:t.autoOpen};var i;s.dbReadyPromise=new Oe((e=>{s.dbReadyResolve=e;})),s.openCanceller=new Oe(((e,t)=>{s.cancelOpen=t;})),this._state=s,this.name=e,this.on=pt(this,"populate","blocked","versionchange","close",{ready:[re,Q]}),this.on.ready.subscribe=y(this.on.ready.subscribe,(e=>(t,n)=>{Hn.vip((()=>{const r=this._state;if(r.openComplete)r.dbOpenError||Oe.resolve().then(t),n&&e(t);else if(r.onReadyBeingFired)r.onReadyBeingFired.push(t),n&&e(t);else {e(t);const r=this;n||e((function e(){r.on.ready.unsubscribe(t),r.on.ready.unsubscribe(e);}));}}));})),this.Collection=(i=this,yt(Pt.prototype,(function(e,t){this.db=i;let n=at,r=null;if(t)try{n=t();}catch(e){r=e;}const s=e._ctx,o=s.table,a=o.hook.reading.fire;this._ctx={table:o,index:s.index,isPrimKey:!s.index||o.schema.primKey.keyPath&&s.index===o.schema.primKey.name,range:n,keysOnly:!1,dir:"next",unique:"",algorithm:null,filter:null,replayFilter:null,justLimit:!0,isMatch:null,offset:0,limit:1/0,error:r,or:s.or,valueMapper:a!==X?a:null};}))),this.Table=function(e){return yt(ft.prototype,(function(t,n,r){this.db=e,this._tx=r,this.name=t,this.schema=n,this.hook=e._allTables[t]?e._allTables[t].hook:pt(null,{creating:[Z,Q],reading:[H,X],updating:[te,Q],deleting:[ee,Q]});}))}(this),this.Transaction=function(e){return yt($t.prototype,(function(t,n,r,s,i){this.db=e,this.mode=t,this.storeNames=n,this.schema=r,this.chromeTransactionDurability=s,this.idbtrans=null,this.on=pt(this,"complete","error","abort"),this.parent=i||null,this.active=!0,this._reculock=0,this._blockedFuncs=[],this._resolve=null,this._reject=null,this._waitingFor=null,this._waitingQueue=null,this._spinCount=0,this._completion=new Oe(((e,t)=>{this._resolve=e,this._reject=t;})),this._completion.then((()=>{this.active=!1,this.on.complete.fire();}),(e=>{var t=this.active;return this.active=!1,this.on.error.fire(e),this.parent?this.parent._reject(e):t&&this.idbtrans&&this.idbtrans.abort(),tt(e)}));}))}(this),this.Version=function(e){return yt(un.prototype,(function(t){this.db=e,this._cfg={version:t,storesSource:null,dbschema:{},tables:{},contentUpgrade:null};}))}(this),this.WhereClause=function(e){return yt(Bt.prototype,(function(t,n,r){if(this.db=e,this._ctx={table:t,index:":id"===n?null:n,or:r},this._cmp=this._ascending=ct,this._descending=(e,t)=>ct(t,e),this._max=(e,t)=>ct(e,t)>0?e:t,this._min=(e,t)=>ct(e,t)<0?e:t,this._IDBKeyRange=e._deps.IDBKeyRange,!this._IDBKeyRange)throw new W.MissingAPI}))}(this),this.on("versionchange",(e=>{e.newVersion>0?console.warn(`Another connection wants to upgrade database '${this.name}'. Closing db now to resume the upgrade.`):console.warn(`Another connection wants to delete database '${this.name}'. Closing db now to resume the delete request.`),this.close({disableAutoOpen:!1});})),this.on("blocked",(e=>{!e.newVersion||e.newVersion<e.oldVersion?console.warn(`Dexie.delete('${this.name}') was blocked`):console.warn(`Upgrade '${this.name}' blocked by other connection holding version ${e.oldVersion/10}`);})),this._maxKey=Ut(t.IDBKeyRange),this._createTransaction=(e,t,n,r)=>new this.Transaction(e,t,n,this._options.chromeTransactionDurability,r),this._fireOnBlocked=e=>{this.on("blocked").fire(e),it.filter((e=>e.name===this.name&&e!==this&&!e._state.vcFired)).map((t=>t.on("versionchange").fire(e)));},this.use($n),this.use(Qn),this.use(Ln),this.use(Tn),this.use(Rn);const o=new Proxy(this,{get:(e,t,n)=>{if("_vip"===t)return !0;if("table"===t)return e=>Xn(this.table(e),o);const r=Reflect.get(e,t,n);return r instanceof ft?Xn(r,o):"tables"===t?r.map((e=>Xn(e,o))):"_createTransaction"===t?function(){const e=r.apply(this,arguments);return Xn(e,o)}:r}});this.vip=o,r.forEach((e=>e(this)));}version(e){if(isNaN(e)||e<.1)throw new W.Type("Given version is not a positive number");if(e=Math.round(10*e)/10,this.idbdb||this._state.isBeingOpened)throw new W.Schema("Cannot add version when database is open");this.verno=Math.max(this.verno,e);const t=this._versions;var n=t.filter((t=>t._cfg.version===e))[0];return n||(n=new this.Version(e),t.push(n),t.sort(Jt),n.stores({}),this._state.autoSchema=!1,n)}_whenReady(e){return this.idbdb&&(this._state.openComplete||we.letThrough||this._vip)?e():new Oe(((e,t)=>{if(this._state.openComplete)return t(new W.DatabaseClosed(this._state.dbOpenError));if(!this._state.isBeingOpened){if(!this._state.autoOpen)return void t(new W.DatabaseClosed);this.open().catch(Q);}this._state.dbReadyPromise.then(e,t);})).then(e)}use({stack:e,create:t,level:n,name:r}){r&&this.unuse({stack:e,name:r});const s=this._middlewares[e]||(this._middlewares[e]=[]);return s.push({stack:e,create:t,level:null==n?10:n,name:r}),s.sort(((e,t)=>e.level-t.level)),this}unuse({stack:e,name:t,create:n}){return e&&this._middlewares[e]&&(this._middlewares[e]=this._middlewares[e].filter((e=>n?e.create!==n:!!t&&e.name!==t))),this}open(){return Je(ve,(()=>Cn(this)))}_close(){const e=this._state,t=it.indexOf(this);if(t>=0&&it.splice(t,1),this.idbdb){try{this.idbdb.close();}catch(e){}this.idbdb=null;}e.isBeingOpened||(e.dbReadyPromise=new Oe((t=>{e.dbReadyResolve=t;})),e.openCanceller=new Oe(((t,n)=>{e.cancelOpen=n;})));}close({disableAutoOpen:e}={disableAutoOpen:!0}){const t=this._state;e?(t.isBeingOpened&&t.cancelOpen(new W.DatabaseClosed),this._close(),t.autoOpen=!1,t.dbOpenError=new W.DatabaseClosed):(this._close(),t.autoOpen=this._options.autoOpen||t.isBeingOpened,t.openComplete=!1,t.dbOpenError=null);}delete(e={disableAutoOpen:!0}){const t=arguments.length>0&&"object"!=typeof arguments[0],n=this._state;return new Oe(((r,s)=>{const i=()=>{this.close(e);var t=this._deps.indexedDB.deleteDatabase(this.name);t.onsuccess=Re((()=>{!function({indexedDB:e,IDBKeyRange:t},n){!cn(e)&&"__dbnames"!==n&&ln(e,t).delete(n).catch(Q);}(this._deps,this.name),r();})),t.onerror=It(s),t.onblocked=this._fireOnBlocked;};if(t)throw new W.InvalidArgument("Invalid closeOptions argument to db.delete()");n.isBeingOpened?n.dbReadyPromise.then(i):i();}))}backendDB(){return this.idbdb}isOpen(){return null!==this.idbdb}hasBeenClosed(){const e=this._state.dbOpenError;return e&&"DatabaseClosed"===e.name}hasFailed(){return null!==this._state.dbOpenError}dynamicallyOpened(){return this._state.autoSchema}get tables(){return t(this._allTables).map((e=>this._allTables[e]))}transaction(){const e=jn.apply(this,arguments);return this._transaction.apply(this,e)}_transaction(e,t,n){let r=we.trans;r&&r.db===this&&-1===e.indexOf("!")||(r=null);const s=-1!==e.indexOf("?");let i,o;e=e.replace("!","").replace("?","");try{if(o=t.map((e=>{var t=e instanceof this.Table?e.name:e;if("string"!=typeof t)throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");return t})),"r"==e||"readonly"===e)i="readonly";else {if("rw"!=e&&"readwrite"!=e)throw new W.InvalidArgument("Invalid transaction mode: "+e);i="readwrite";}if(r){if("readonly"===r.mode&&"readwrite"===i){if(!s)throw new W.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");r=null;}r&&o.forEach((e=>{if(r&&-1===r.storeNames.indexOf(e)){if(!s)throw new W.SubTransaction("Table "+e+" not included in parent transaction.");r=null;}})),s&&r&&!r.active&&(r=null);}}catch(e){return r?r._promise(null,((t,n)=>{n(e);})):tt(e)}const a=Dn.bind(null,this,i,o,r,n);return r?r._promise(i,a,"lock"):we.trans?Je(we.transless,(()=>this._whenReady(a))):this._whenReady(a)}table(e){if(!o(this._allTables,e))throw new W.InvalidTable(`Table ${e} does not exist`);return this._allTables[e]}}const Jn="undefined"!=typeof Symbol&&"observable"in Symbol?Symbol.observable:"@@observable";class Zn{constructor(e){this._subscribe=e;}subscribe(e,t,n){return this._subscribe(e&&"function"!=typeof e?e:{next:e,error:t,complete:n})}[Jn](){return this}}let er;try{er={indexedDB:e.indexedDB||e.mozIndexedDB||e.webkitIndexedDB||e.msIndexedDB,IDBKeyRange:e.IDBKeyRange||e.webkitIDBKeyRange};}catch(e){er={indexedDB:null,IDBKeyRange:null};}function tr(e){let t,n=!1;const r=new Zn((r=>{const s=I(e);let i,a=!1,u={},l={};const c={get closed(){return a},unsubscribe:()=>{a||(a=!0,i&&i.abort(),h&&Ft.storagemutated.unsubscribe(f));}};r.start&&r.start(c);let h=!1;const d=()=>et(p);const f=e=>{_n(u,e),xn(l,u)&&d();},p=()=>{if(a||!er.indexedDB)return;u={};const c={};i&&i.abort(),i=new AbortController;const p={subscr:c,signal:i.signal,requery:d,querier:e,trans:null},y=function(t){const n=qe();try{s&&ze();let r=Ve(e,t);return s&&(r=r.finally(We)),r}finally{n&&Te();}}(p);Promise.resolve(y).then((e=>{n=!0,t=e,a||p.signal.aborted||(u={},l=c,function(e){for(const t in e)if(o(e,t))return !1;return !0}(l)||h||(Ft("storagemutated",f),h=!0),et((()=>!a&&r.next&&r.next(e))));}),(e=>{n=!1,["DatabaseClosedError","AbortError"].includes(e?.name)||a||et((()=>{a||r.error&&r.error(e);}));}));};return setTimeout(d,0),c}));return r.hasValue=()=>n,r.getValue=()=>t,r}const nr=Hn;function rr(e){let t=ir;try{ir=!0,Ft.storagemutated.fire(e),Kn(e,!0);}finally{ir=t;}}a(nr,{...G,delete:e=>new nr(e,{addons:[]}).delete(),exists:e=>new nr(e,{addons:[]}).open().then((e=>(e.close(),!0))).catch("NoSuchDatabaseError",(()=>!1)),getDatabaseNames(e){try{return function({indexedDB:e,IDBKeyRange:t}){return cn(e)?Promise.resolve(e.databases()).then((e=>e.map((e=>e.name)).filter((e=>"__dbnames"!==e)))):ln(e,t).toCollection().primaryKeys()}(nr.dependencies).then(e)}catch{return tt(new W.MissingAPI)}},defineClass:()=>function(e){r(this,e);},ignoreTransaction:e=>we.trans?Je(we.transless,e):e(),vip:hn,async:function(e){return function(){try{var t=An(e.apply(this,arguments));return t&&"function"==typeof t.then?t:Oe.resolve(t)}catch(e){return tt(e)}}},spawn:function(e,t,n){try{var r=An(e.apply(n,t||[]));return r&&"function"==typeof r.then?r:Oe.resolve(r)}catch(e){return tt(e)}},currentTransaction:{get:()=>we.trans||null},waitFor:function(e,t){const n=Oe.resolve("function"==typeof e?nr.ignoreTransaction(e):e).timeout(t||6e4);return we.trans?we.trans.waitFor(n):n},Promise:Oe,debug:{get:()=>se,set:e=>{ie(e);}},derive:c,extend:r,props:a,override:y,Events:pt,on:Ft,liveQuery:tr,extendObservabilitySet:_n,getByKeyPath:g,setByKeyPath:v,delByKeyPath:function(e,t){"string"==typeof t?v(e,t,void 0):"length"in t&&[].map.call(t,(function(t){v(e,t,void 0);}));},shallowClone:w,deepClone:K,getObjectDiff:Bn,cmp:ct,asap:b,minKey:-(1/0),addons:[],connections:it,errnames:V,dependencies:er,cache:kn,semVer:"4.0.4",version:"4.0.4".split(".").map((e=>parseInt(e))).reduce(((e,t,n)=>e+t/Math.pow(10,2*n)))}),nr.maxKey=Ut(nr.dependencies.IDBKeyRange),"undefined"!=typeof dispatchEvent&&"undefined"!=typeof addEventListener&&(Ft("storagemutated",(e=>{if(!ir){let t;t=new CustomEvent("x-storagemutated-1",{detail:e}),ir=!0,dispatchEvent(t),ir=!1;}})),addEventListener("x-storagemutated-1",(({detail:e})=>{ir||rr(e);})));let sr,ir=!1,or=()=>{};"undefined"!=typeof BroadcastChannel&&(or=()=>{sr=new BroadcastChannel("x-storagemutated-1"),sr.onmessage=e=>e.data&&rr(e.data);},or(),"function"==typeof sr.unref&&sr.unref(),Ft("storagemutated",(e=>{ir||sr.postMessage(e);}))),"undefined"!=typeof addEventListener&&(addEventListener("pagehide",(e=>{if(!Hn.disableBfCache&&e.persisted){se&&console.debug("Dexie: handling persisted pagehide"),sr?.close();for(const e of it)e.close({disableAutoOpen:!1});}})),addEventListener("pageshow",(e=>{!Hn.disableBfCache&&e.persisted&&(se&&console.debug("Dexie: handling persisted pageshow"),or(),rr({all:new pn(-1/0,[[]])}));}))),Oe.rejectionMapper=function(e,t){if(!e||e instanceof N||e instanceof TypeError||e instanceof SyntaxError||!e.name||!Y[e.name])return e;var n=new Y[e.name](t||e.message,e);return "stack"in e&&l(n,"stack",{get:function(){return this.inner.stack}}),n},ie(se);

  const dbUtil = {};

  dbUtil.fetchJson = async (url) => {
    progress('fetching...');
    const response = await fetch(url);
    progress('parsing...');
    const data = await response.json();

    return data;
  };

  dbUtil.getVersion = (dbName) => {
    const defaultVersion = '1970-01-01';
    let version = localStorage.getItem(`${dbName}Version`);
    if (!version) {
      version = defaultVersion;
    } else {
      try {
        version = JSON.parse(version);
      } catch (error) {
        version = defaultVersion;
      }
      if (typeof version !== 'string') {
        version = defaultVersion;
      }
    }
    localStorage.setItem(`${dbName}Version`,
      JSON.stringify(version));

    return version;
  };

  dbUtil.versionCheck = async (dbSetup) => {
    const currentVersion = dbUtil.getVersion(dbSetup.name);

    const db = new Hn(dbSetup.name);
    await db.version(1).stores(dbSetup.stores);
    db.open();

    if (dbSetup.version !== currentVersion) {
      progress('new version.');
      for (const store of Object.keys(dbSetup.stores)) {
        progress(`clearing ${store}...`);
        await db.table(store).clear();
      }
      localStorage.setItem(`${dbSetup.name}Version`,
        JSON.stringify(dbSetup.version));
    }

    return db;
  };

  const dbSetup$1 = {
    name: 'kjv_pure',
    stores: {
      verses: 'k',
      words: 'k',
    },
    url: '/json/kjv_pure.json',
    version: '2024-05-09',
  };

  let kjvPureDb = null;
  let kjvPureVerseCount = null;
  let kjvPureWords = null;

  const initializeKjvPureDb = async () => {
    progress('');
    progress('* kjv pure database *');
    progress('');
    kjvPureDb = await dbUtil.versionCheck(dbSetup$1);
    await populateDb();
    await loadKjvPureWords();
    kjvPureVerseCount = await kjvPureDb.verses.count();
    progress('kjv pure initialized.');
  };

  const loadKjvPureWords = async () => {
    progress('loading kjv pure words...');
    const wordObjs = await kjvPureDb.words.toArray();
    kjvPureWords = wordObjs.map(x => x.k);
  };

  const populateDb = async () => {
    const wordCount = await kjvPureDb.words.count();
    if (wordCount === 0) {
      const data = await dbUtil.fetchJson(dbSetup$1.url);

      progress('populating kjv pure verses...');
      await kjvPureDb.verses.bulkAdd(data.verses);
      progress('populating kjv pure words...');
      await kjvPureDb.words.bulkAdd(data.words);
      progress('kjv pure population complete.');
    } else {
      progress('kjv pure already populated.');
    }
  };

  const dbSetup = {
    name: 'kjv_name',
    stores: {
      verses: 'k',
      words: 'k',
    },
    url: '/json/kjv_name.json',
    version: '2024-05-09',
  };

  let kjvNameDb = null;
  let kjvNameVerseCount = null;
  let kjvNameWords = null;

  const initializeKjvNameDb = async () => {
    progress('');
    progress('* kjv name database *');
    progress('');
    kjvNameDb = await dbUtil.versionCheck(dbSetup);
    await populateKjv();
    await loadKjvNameWords();
    kjvNameVerseCount = await kjvNameDb.verses.count();
    progress('kjv name initialized.');
  };


  const loadKjvNameWords = async () => {
    progress('loading kjv name words...');
    const wordObjs = await kjvNameDb.words.toArray();
    kjvNameWords = wordObjs.map(x => x.k);
  };

  const populateKjv = async () => {
    const wordCount = await kjvNameDb.words.count();
    if (wordCount === 0) {
      const data = await dbUtil.fetchJson(dbSetup.url);

      progress('populating kjv name verses...');
      await kjvNameDb.verses.bulkAdd(data.verses);
      progress('populating kjv name words...');
      await kjvNameDb.words.bulkAdd(data.words);
      progress('kjv name population complete.');
    } else {
      progress('kjv name already populated.');
    }
  };

  const strongSetup$2 = {
    name: 'strong_name',
    stores: {
      maps: 'k',
      words: 'k',
    },
    url: '/json/strong_name.json',
    version: '2024-05-09',
  };

  let strongNameDb = null;

  const initializeStrongName = async () => {
    progress('');
    progress('* strong name database *');
    progress('');
    strongNameDb = await dbUtil.versionCheck(strongSetup$2);
    await populateStrong$2();
    progress('strong name initialized.');
  };

  const populateStrong$2 = async () => {
    const wordsCount = await strongNameDb.words.count();
    if (wordsCount === 0) {
      const data = await dbUtil.fetchJson(strongSetup$2.url);

      progress('populating maps...');
      await strongNameDb.maps.bulkAdd(data.maps);
      progress('populating words...');
      await strongNameDb.words.bulkAdd(data.words);
      progress('population complete.');
    } else {
      progress('strong name already populated.');
    }
  };

  const strongSetup$1 = {
    name: 'strong_pure',
    stores: {
      maps: 'k',
      words: 'k',
    },
    url: '/json/strong_pure.json',
    version: '2024-05-09',
  };

  let strongPureDb = null;

  const initializeStrongPure = async () => {
    progress('');
    progress('* strong pure database *');
    progress('');
    strongPureDb = await dbUtil.versionCheck(strongSetup$1);
    await populateStrong$1();
    progress('strong pure initialized.');
  };

  const populateStrong$1 = async () => {
    const wordsCount = await strongPureDb.words.count();
    if (wordsCount === 0) {
      const data = await dbUtil.fetchJson(strongSetup$1.url);

      progress('populating maps...');
      await strongPureDb.maps.bulkAdd(data.maps);
      progress('populating words...');
      await strongPureDb.words.bulkAdd(data.words);
      progress('population complete.');
    } else {
      progress('strong pure already populated.');
    }
  };

  let tomeDb = null;
  let tomeVerseCount = null;
  let tomeWords = null;
  let dbNameMode = null;
  let strongDb = null;

  class DbModel {

    constructor() {
      this.initialize();
    }

    initialize() {
      this.subscribe();
    }

    tomeDbChange() {
      if (this.nameMode === true) {
        tomeDb = kjvNameDb;
        tomeVerseCount = kjvNameVerseCount;
        tomeWords = kjvNameWords;
      } else {
        tomeDb = kjvPureDb;
        tomeVerseCount = kjvPureVerseCount;
        tomeWords = kjvPureWords;
      }
    }

    nameModeChange() {
      this.nameMode = !this.nameMode;
      this.saveNameMode();
      dbNameMode = this.nameMode;
      this.tomeDbChange();
      this.strongDbChange();
      queue.publish('name-mode.update', this.nameMode);
    }

    restore() {
      this.restoreNameMode();
    }

    restoreNameMode() {
      const defaultNameMode = false;
      let nameMode = localStorage.getItem('nameMode');
      if (!nameMode) {
        nameMode = defaultNameMode;
      } else {
        try {
          nameMode = JSON.parse(nameMode);
        } catch (error) {
          nameMode = defaultNameMode;
        }
        if (typeof nameMode !== 'boolean') {
          nameMode = defaultNameMode;
        }
      }
      this.nameMode = nameMode;
      dbNameMode = this.nameMode;
      this.tomeDbChange();
      this.strongDbChange();
    }

    saveNameMode() {
      localStorage.setItem('nameMode',
        JSON.stringify(this.nameMode));
    }

    strongDbChange() {
      if (this.nameMode === true) {
        strongDb = strongNameDb;
      } else {
        strongDb = strongPureDb;
      }
    }

    subscribe() {
      queue.subscribe('db.restore', () => {
        this.restore();
      });
      queue.subscribe('name-mode.change', () => {
        this.nameModeChange();
      });
    }

  }

  const util = {};

  util.centerScrollElement = (scrollElement, element) => {
    const y = element.offsetTop - scrollElement.offsetTop -
      (scrollElement.clientHeight - element.clientHeight) / 2;
    scrollElement.scrollTop = y;
  };

  util.range = (start, stop, step = 1) => {
    return Array(Math.ceil((stop - start) / step))
      .fill(start)
      .map((x, y) => x + y * step);
  };

  util.removeAllChildren = (element) => {
    while (element.hasChildNodes()) {
      element.removeChild(element.lastChild);
    }
  };

  util.sideScrollElement = (scrollElement, element) => {
    const x = element.offsetLeft - 8;
    scrollElement.scrollLeft = x;
  };

  util.writeClipboardText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.log(error.message);
    }
  };

  const tomeIdx = {};

  tomeIdx.book = {
    longName: 0,
    shortName: 1,
    firstVerseIdx: 2,
    lastVerseIdx: 3,
    firstChapterIdx: 4,
    lastChapterIdx: 5,
  };

  tomeIdx.chapter = {
    bookIdx: 0,
    name: 1,
    num: 2,
    firstVerseIdx: 3,
    lastVerseIdx: 4,
  };

  tomeIdx.verse = {
    text: 0,
    bookIdx: 1,
    chapterIdx: 2,
    citation: 3,
    num: 4,
  };

  tomeIdx.word = {
    verseIdx: 0,
    count: 1,
  };

  let tomeLists;
  const url = '/json/kjv_lists.json';

  const chapterIdxByVerseIdx = (verseIdx) => {
    const chapterIdx = tomeLists.chapters
      .findIndex(x => x[tomeIdx.chapter.lastVerseIdx] >= verseIdx);
    return chapterIdx;
  };

  const firstVerseIdxByChapterIdx = (chapterIdx) => {
    const verseIdx = tomeLists.chapters[chapterIdx][tomeIdx.chapter.firstVerseIdx];
    return verseIdx;
  };

  const initializeTomeLists = async () => {
    progress('loading kjs lists...');
    tomeLists = await dbUtil.fetchJson(url);
    tomeLists.tomeName = 'kjv';
  };

  class ReadModel {

    constructor() {
      this.initialize();
    }

    chapterIdxUpdate(chapterIdx) {
      this.chapterIdx = chapterIdx;
      this.updateReadVerseObjs();
    }

    columnModeChange(columnMode) {
      this.columnMode = columnMode;
      this.saveColumnMode();
      queue.publish('read.column-mode.update', this.columnMode);
    }

    columnModeToogle() {
      this.columnModeChange(!this.columnMode);
    }

    initialize() {
      this.subscribe();
    }

    nameModeChange() {
      this.updateReadVerseObjs();
    }

    panesChange(panes) {
      this.panes = panes;
      queue.publish('panes.update', this.panes);
    }

    restore() {
      this.restoreColumnMode();
      this.restoreStrongMode();
      this.restoreSidebar();
    }

    restoreColumnMode() {
      const defaultColumnMode = false;
      let columnMode = localStorage.getItem('columnMode');
      if (!columnMode) {
        columnMode = defaultColumnMode;
      } else {
        try {
          columnMode = JSON.parse(columnMode);
        } catch (error) {
          columnMode = defaultColumnMode;
        }
        if (typeof columnMode !== 'boolean') {
          columnMode = defaultColumnMode;
        }
      }
      this.columnModeChange(columnMode);
    }

    restoreSidebar() {
      const defaultSidebar = this.panes > 1 ? 'navigator' : 'none';
      let sidebar = localStorage.getItem('sidebar');
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

    restoreStrongMode() {
      const defaultStrongMode = false;
      let strongMode = localStorage.getItem('readStrongMode');
      if (!strongMode) {
        strongMode = defaultStrongMode;
      } else {
        try {
          strongMode = JSON.parse(strongMode);
        } catch (error) {
          strongMode = defaultStrongMode;
        }
        if (typeof strongMode !== 'boolean') {
          strongMode = defaultStrongMode;
        }
      }
      this.strongModeChange(strongMode);
    }

    saveColumnMode() {
      localStorage.setItem('columnMode',
        JSON.stringify(this.columnMode));
    }

    saveStrongMode() {
      localStorage.setItem('readStrongMode',
        JSON.stringify(this.strongMode));
    }

    saveSidebar() {
      localStorage.setItem('sidebar', JSON.stringify(this.sidebar));
    }

    sidebarChange(sidebar) {
      this.sidebar = sidebar;
      this.saveSidebar();
      queue.publish('sidebar.update', this.sidebar);
    }

    strongModeChange(strongMode) {
      this.strongMode = strongMode;
      this.saveStrongMode();
      queue.publish('read.strong-mode.update', this.strongMode);
    }

    strongModeToogle() {
      this.strongModeChange(!this.strongMode);
    }

    subscribe() {
      queue.subscribe('chapterIdx.update', (chapterIdx) => {
        this.chapterIdxUpdate(chapterIdx);
      });

      queue.subscribe('name-mode.change', () => {
        this.nameModeChange();
      });

      queue.subscribe('panes.change', (panes) => {
        this.panesChange(panes);
      });

      queue.subscribe('read.column-mode.toggle', () => {
        this.columnModeToogle();
      });
      queue.subscribe('read.restore',
        () => { this.restore(); }
      );
      queue.subscribe('read.strong-mode.toggle', () => {
        this.strongModeToogle();
      });

      queue.subscribe('sidebar.change', (sidebar) => {
        this.sidebarChange(sidebar);
      });
    }

    async updateReadVerseObjs() {
      const chapter = tomeLists.chapters[this.chapterIdx];
      const keys = util.range(chapter[tomeIdx.chapter.firstVerseIdx],
        chapter[tomeIdx.chapter.lastVerseIdx] + 1);
      this.verseObjs = await tomeDb.verses.bulkGet(keys);
      queue.publish('read.verse-objs.update', this.verseObjs);
    }
  }

  const svgNS = 'http://www.w3.org/2000/svg';
  const xlinkNS = 'http://www.w3.org/1999/xlink';

  const template = {};

  template.acrostic = (verseObj) => {
    let acrosticSpan = null;
    if (tomeLists.acrostics) {
      const acrostic = tomeLists.acrostics[verseObj.k];
      if (acrostic) {
        const glyph = acrostic.slice(0, 1);
        const xlit = acrostic.slice(1);
        const glyphSpan = template.element('span', 'font--hebrew', null, null, glyph);
        const xlitSpan = template.element('span', 'font--bold', null, null, xlit + ' ');
        acrosticSpan = document.createDocumentFragment();
        acrosticSpan.appendChild(glyphSpan);
        acrosticSpan.appendChild(xlitSpan);
      }
    }
    return acrosticSpan;
  };

  template.actionMenu = (cssModifier, actionSet) => {
    const actionMenu = template.element('div', 'action-menu', cssModifier, null, null);
    actionMenu.classList.add('hide');
    for (const btn of actionSet) {
      const element = template.btnIcon(btn.icon, btn.icon, null);
      actionMenu.appendChild(element);
    }
    return actionMenu;
  };

  template.btnBanner = (cssModifier, ariaLabel) => {
    const btnIcon = template.element('div', 'btn-banner', cssModifier, ariaLabel, null);
    return btnIcon;
  };

  template.btnIcon = (svgId, cssModifier, ariaLabel) => {
    const svgTag = document.createElementNS(svgNS, 'svg');
    svgTag.classList.add('icon-svg');
    const useTag = document.createElementNS(svgNS, 'use');
    useTag.setAttributeNS(xlinkNS, 'xlink:href', `icons.svg#${svgId}`);
    svgTag.appendChild(useTag);
    const btnIcon = template.element('div', 'btn-icon', cssModifier, ariaLabel, null);
    btnIcon.appendChild(svgTag);
    return btnIcon;
  };

  template.divDialog = (cssModifier, toolSet) => {
    const divDialog = template.element('div', 'dialog', cssModifier, null, null);
    const divDialogBtns = template.element('div', 'dialog-btns', cssModifier, null, null);
    for (const tool of toolSet) {
      let element;
      if (tool.type === 'btn') {
        element = template.element('div', 'btn-dialog', tool.cssModifier, tool.ariaLabel, tool.label);
        divDialogBtns.appendChild(element);
      } else if (tool.type === 'input') {
        element = template.input('dialog-input', cssModifier, tool.ariaLabel);
        divDialog.appendChild(element);
      } else if (tool.type === 'label') {
        element = template.element('div', 'dialog-label', cssModifier, null, null);
        if (tool.text) {
          element.textContent = tool.text;
        }
        divDialog.appendChild(element);
      } else if (tool.type === 'textarea') {
        element = template.element('textarea', 'dialog-textarea', cssModifier, tool.ariaLabel, null);
        divDialog.appendChild(element);
      }
    }
    divDialog.appendChild(divDialogBtns);
    return divDialog;
  };

  template.element = (tagName, cssBlock, cssModifier, ariaLabel, textContent) => {
    const element = document.createElement(tagName);
    element.classList.add(cssBlock);
    if (cssModifier) {
      element.classList.add(`${cssBlock}--${cssModifier}`);
    }
    if (ariaLabel) {
      element.setAttribute('aria-label', ariaLabel);
    }
    if (textContent) {
      element.textContent = textContent;
    }
    return element;
  };

  template.input = (cssBlock, cssModifier, ariaLabel) => {
    const input = template.element('input', cssBlock, cssModifier, ariaLabel, null);
    input.setAttribute('type', 'text');
    return input;
  };

  template.page = (cssModifier) => {
    const page = template.element('div', 'page', cssModifier, null, null);
    page.classList.add('page--hide');
    return page;
  };

  template.scroll = (cssModifier) => {
    const scroll = template.element('div', 'scroll', cssModifier, null, null);
    return scroll;
  };

  template.strongList = (list, cssModifier) => {
    const strongList = template.element('ul', 'strong-def-list', cssModifier, null, null);
    for (const listItem of list) {
      const strongItem = template.element('li', 'list-item', null, null, null);
      const frags = listItem.split(/[HG]\d+/);
      const words = listItem.match(/[HG]\d+/g);
      if (words) {
        frags.map((value, index) => {
          const span = document.createElement('span');
          span.textContent = value;
          strongItem.appendChild(span);
          if (words[index]) {
            const num = words[index];
            const btn = template.element('div', 'btn-strong-def', null, null, num);
            btn.dataset.strongDef = num;
            strongItem.appendChild(btn);
          }
        });
      } else {
        strongItem.textContent = listItem;
      }
      strongList.appendChild(strongItem);
    }
    return strongList;
  };

  template.toolbar = (cssModifier) => {
    const toolbar = template.element('div', 'toolbar', cssModifier, null, null);
    return toolbar;
  };

  template.toolbarLower = (toolSet) => {
    const toolbarLower = template.toolbar('lower');
    for (const tool of toolSet) {
      let element;
      if (tool.type === 'btn') {
        element = template.btnIcon(tool.icon, tool.icon, tool.ariaLabel);
        toolbarLower.appendChild(element);
      } else if (tool.type === 'input') {
        element = template.input('input', tool.modifier, tool.ariaLabel);
        toolbarLower.appendChild(element);
      }
    }
    return toolbarLower;
  };

  template.toolbarMenu = (modifier, actionSet) => {
    const toolbarMenu = template.element('div', 'toolbar-menu', modifier, null, null);
    toolbarMenu.classList.add('toolbar-menu--hide');
    for (const btn of actionSet) {
      const element = template.btnIcon(btn.icon, `${modifier}-${btn.icon}`, btn.label);
      toolbarMenu.appendChild(element);
    }
    return toolbarMenu;
  };

  template.toolbarUpper = (toolSet) => {
    const toolbarUpper = template.toolbar('upper');
    for (const tool of toolSet) {
      let element;
      if (tool.type === 'btn') {
        element = template.btnIcon(tool.icon, tool.icon, tool.ariaLabel);
        toolbarUpper.appendChild(element);
      } else if (tool.type === 'btn-banner') {
        element = template.btnBanner(tool.cssModifier, tool.ariaLabel);
        toolbarUpper.appendChild(element);
      } else if (tool.type === 'banner') {
        element = template.element('div', 'banner', tool.cssModifier, null, tool.text);
        toolbarUpper.appendChild(element);
      }
    }
    return toolbarUpper;
  };

  const lowerToolSet$n = [
    { type: 'btn', icon: 'navigator', ariaLabel: null },
    { type: 'btn', icon: 'bookmark', ariaLabel: null },
    { type: 'btn', icon: 'search', ariaLabel: null },
    { type: 'btn', icon: 'strong', ariaLabel: null },
    { type: 'btn', icon: 'setting', ariaLabel: null },
    { type: 'btn', icon: 'help', ariaLabel: null },
    { type: 'btn', icon: 'column-mode', ariaLabel: null },
    { type: 'btn', icon: 'name-mode', ariaLabel: null },
    { type: 'btn', icon: 'strong-mode', ariaLabel: null },
    { type: 'btn', icon: 'v-menu', ariaLabel: null },
  ];

  const upperToolSet$n = [
    { type: 'btn', icon: 'prev', ariaLabel: null },
    { type: 'btn-banner', cssModifier: 'read', text: 'Toogle Clipboard' },
    { type: 'btn', icon: 'next', ariaLabel: null },
  ];

  const menuSet = [
    { type: 'btn', icon: 'cancel', ariaLabel: null },
    { type: 'btn', icon: 'setting', ariaLabel: null },
    { type: 'btn', icon: 'help', ariaLabel: null },
  ];

  class ReadView {

    constructor() {
      this.initialize();
    }

    activeFolderUpdate(activeFolder) {
      this.activeFolder = activeFolder;
      this.refreshVerseBookmarks();
    }

    addListeners() {
      this.list.addEventListener('click', (event) => {
        this.listClick(event);
      });
      this.toolbarMenu.addEventListener('click', (event) => {
        this.toolbarMenuClick(event);
      });
      this.toolbarLower.addEventListener('click', (event) => {
        this.toolbarLowerClick(event);
      });
      this.toolbarUpper.addEventListener('click', (event) => {
        this.toolbarUpperClick(event);
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

    buildPage() {
      this.page = template.page('read');
      this.page.classList.remove('page--hide');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$n);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('read');
      this.list = template.element('div', 'list', 'read', null, null);
      this.scroll.appendChild(this.list);
      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$n);
      this.page.appendChild(this.toolbarLower);

      this.toolbarMenu = template.toolbarMenu('read-menu', menuSet);
      this.page.appendChild(this.toolbarMenu);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    buildVerse(verseObj) {
      const verse = document.createElement('div');
      verse.classList.add('btn-verse');
      verse.dataset.verseIdx = verseObj.k;
      const verseNum = this.buildVerseNum(verseObj);
      verse.appendChild(verseNum);
      const acrostic = template.acrostic(verseObj);
      if (acrostic) {
        verse.appendChild(acrostic);
      }
      const text = template.element('span', 'verse-text', null, null, verseObj.v[tomeIdx.verse.text]);
      verse.appendChild(text);
      return verse;
    }

    buildVerseNum(verseObj) {
      const num = template.element('span', 'verse-num', null, null, verseObj.v[tomeIdx.verse.num] + ' ');
      return num;
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

    changeFontVariant() {
      if (this.lastFontVariant) {
        this.list.classList.remove(this.lastFontVariant);
      }
      this.list.classList.add(this.fontVariant);
    }

    changeTheme() {
      if (this.lastTheme) {
        this.body.classList.remove(this.lastTheme.themeClass);
      }
      this.body.classList.add(this.theme.themeClass);
    }

    chapterIdxUpdate(chapterIdx) {
      this.chapterIdx = chapterIdx;
    }

    columnModeUpdate(columnMode) {
      this.columnMode = columnMode;
      this.updateColumnModeBtn();
      this.updateColumnMode();
    }

    fontUpdate(font) {
      this.font = font;
      this.changeFont();
      this.lastFont = this.font;
    }

    fontSizeUpdate(fontSize) {
      this.fontSize = fontSize;
      this.changeFontSize();
      this.lastFontSize = this.fontSize;
    }

    fontVariantUpdate(fontVariant) {
      this.fontVariant = fontVariant;
      this.changeFontVariant();
      this.lastFontVariant = this.fontVariant;
    }

    getElements() {
      this.body = document.querySelector('body');

      this.btnPrev = this.toolbarUpper.querySelector('.btn-icon--prev');
      this.btnBanner = this.toolbarUpper.querySelector('.btn-banner--read');
      this.btnNext = this.toolbarUpper.querySelector('.btn-icon--next');

      this.btnNavigator = this.toolbarLower.querySelector('.btn-icon--navigator');
      this.btnBookmark = this.toolbarLower.querySelector('.btn-icon--bookmark');
      this.btnSearch = this.toolbarLower.querySelector('.btn-icon--search');
      this.btnStrong = this.toolbarLower.querySelector('.btn-icon--strong');
      this.btnSetting = this.toolbarLower.querySelector('.btn-icon--setting');
      this.btnHelp = this.toolbarLower.querySelector('.btn-icon--help');
      this.btnColumnMode = this.toolbarLower.querySelector('.btn-icon--column-mode');
      this.btnStrongMode = this.toolbarLower.querySelector('.btn-icon--strong-mode');
      this.btnNameMode = this.toolbarLower.querySelector('.btn-icon--name-mode');
      this.btnMenu = this.toolbarLower.querySelector('.btn-icon--v-menu');

      this.btnMenuCancel = this.toolbarMenu.querySelector('.btn-icon--read-menu-cancel');
      this.btnMenuSetting = this.toolbarMenu.querySelector('.btn-icon--read-menu-setting');
      this.btnMenuHelp = this.toolbarMenu.querySelector('.btn-icon--read-menu-help');
    }

    helpHide() {
      if (this.sidebar !== 'help') {
        this.btnHelp.classList.remove('btn-icon--active');
      }
    }

    helpShow() {
      this.btnHelp.classList.add('btn-icon--active');
    }

    hide() {
      this.page.classList.add('page--hide');
    }

    hideToolbarMenu() {
      this.toolbarMenu.classList.add('toolbar-menu--hide');
    }

    initialize() {
      this.buildPage();
      this.getElements();
      this.addListeners();
      this.subscribe();
      this.lastFont = null;
      this.lastFontSize = null;
      this.lastFontVariant = null;
      this.clipboardMode = false;
      this.scrollVerseIdx = null;
    }

    listClick(event) {
      event.preventDefault();
      if (!document.getSelection().toString()) {
        const btnVerse = event.target.closest('div.btn-verse');
        if (btnVerse) {
          if (this.clipboardMode) {
            const text = `${this.btnBanner.textContent}:${btnVerse.textContent}`;
            util.writeClipboardText(text);
          } else {
            this.verseClick(btnVerse);
          }
        }
      }
    }

    nameModeUpdate() {
      this.setBtnNameMode();
    }

    navigatorHide() {
      this.btnNavigator.classList.remove('btn-icon--active');
    }

    navigatorShow() {
      this.btnNavigator.classList.add('btn-icon--active');
    }

    refreshBookmarks(element) {
      const verseIdx = parseInt(element.dataset.verseIdx);
      if (this.activeFolder.bookmarks.indexOf(verseIdx) === -1) {
        element.classList.remove('verse--bookmark');
      } else {
        element.classList.add('verse--bookmark');
      }
    }

    refreshVerseBookmarks() {
      const verses = [...this.list.querySelectorAll('.btn-verse')];
      for (const element of verses) {
        this.refreshBookmarks(element);
      }
    }

    scrollToVerse() {
      const element = this.list.querySelector(`[data-verse-idx="${this.scrollVerseIdx}"]`);
      if (element) {
        if (this.columnMode) {
          util.sideScrollElement(this.scroll, element);
        } else {
          util.centerScrollElement(this.scroll, element);
        }
      }
    }

    scrollVerseIdxUpdate(verseIdx) {
      this.scrollVerseIdx = verseIdx;
    }

    searchHide() {
      if (this.sidebar !== 'search') {
        this.btnSearch.classList.remove('btn-icon--active');
      }
    }

    searchShow() {
      this.btnSearch.classList.add('btn-icon--active');
    }

    setBtnNameMode() {
      if (dbNameMode) {
        this.btnNameMode.classList.add('btn-icon--active');
      } else {
        this.btnNameMode.classList.remove('btn-icon--active');
      }
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

    showToolbarMenu() {
      this.toolbarMenu.classList.remove('toolbar-menu--hide');
    }

    sidebarUpdate(sidebar) {
      this.sidebar = sidebar;
    }

    strongHide() {
      if (this.sidebar !== 'strong') {
        this.btnStrong.classList.remove('btn-icon--active');
      }
    }

    strongModeUpdate(strongMode) {
      this.strongMode = strongMode;
      if (this.strongMode) {
        this.btnStrongMode.classList.add('btn-icon--active');
      } else {
        this.btnStrongMode.classList.remove('btn-icon--active');
      }
    }

    strongShow() {
      this.btnStrong.classList.add('btn-icon--active');
    }

    subscribe() {
      queue.subscribe('bookmark.active-folder.update', (activeFolder) => {
        this.activeFolderUpdate(activeFolder);
      });
      queue.subscribe('bookmark.hide', () => {
        this.bookmarkHide();
      });
      queue.subscribe('bookmark.show', () => {
        this.bookmarkShow();
      });

      queue.subscribe('chapterIdx.update', (chapterIdx) => {
        this.chapterIdxUpdate(chapterIdx);
      });

      queue.subscribe('font.update', (font) => {
        this.fontUpdate(font);
      });

      queue.subscribe('font-size.update', (fontSize) => {
        this.fontSizeUpdate(fontSize);
      });

      queue.subscribe('font-variant.update', (fontVariant) => {
        this.fontVariantUpdate(fontVariant);
      });

      queue.subscribe('help.hide', () => {
        this.helpHide();
      });
      queue.subscribe('help.show', () => {
        this.helpShow();
      });

      queue.subscribe('name-mode.update', () => {
        this.nameModeUpdate();
      });

      queue.subscribe('navigator.hide', () => {
        this.navigatorHide();
      });
      queue.subscribe('navigator.show', () => {
        this.navigatorShow();
      });

      queue.subscribe('read.column-mode.update', (columnMode) => {
        this.columnModeUpdate(columnMode);
      });
      queue.subscribe('read.hide', () => {
        this.hide();
      });
      queue.subscribe('read.scroll-verse-idx', (verseIdx) => {
        this.scrollVerseIdxUpdate(verseIdx);
      });
      queue.subscribe('read.show', () => {
        this.show();
      });
      queue.subscribe('read.strong-mode.update', (strongMode) => {
        this.strongModeUpdate(strongMode);
      });
      queue.subscribe('read.verse-objs.update', (verseObjs) => {
        this.verseObjsUpdate(verseObjs);
      });

      queue.subscribe('search.hide', () => {
        this.searchHide();
      });
      queue.subscribe('search.show', () => {
        this.searchShow();
      });

      queue.subscribe('set.name-mode-btn', () => {
        this.setBtnNameMode();
      });

      queue.subscribe('setting.hide', () => {
        this.settingHide();
      });
      queue.subscribe('setting.show', () => {
        this.settingShow();
      });

      queue.subscribe('strong.hide', () => {
        this.strongHide();
      });
      queue.subscribe('strong.show', () => {
        this.strongShow();
      });

      queue.subscribe('sidebar.update', (sidebar) => {
        this.sidebarUpdate(sidebar);
      });

      queue.subscribe('theme.update', (theme) => {
        this.themeUpdate(theme);
      });
    }

    themeUpdate(theme) {
      this.theme = theme;
      this.changeTheme();
      this.lastTheme = this.theme;
    }

    toogleClipboardMode() {
      if (this.clipboardMode) {
        this.btnBanner.classList.remove('btn-banner--active');
      } else {
        this.btnBanner.classList.add('btn-banner--active');
      }
      this.clipboardMode = !this.clipboardMode;
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnStrongMode ||
          btn === this.btnNameMode ||
          btn === this.btnColumnMode ||
          !btn.classList.contains('btn-icon--active')
        ) {
          if (btn === this.btnNavigator) {
            queue.publish('sidebar.select', 'navigator');
          } else if (btn === this.btnBookmark) {
            queue.publish('sidebar.select', 'bookmark');
          } else if (btn === this.btnSearch) {
            queue.publish('sidebar.select', 'search');
          } else if (btn === this.btnStrong) {
            queue.publish('sidebar.select', 'strong');
          } else if (btn === this.btnSetting) {
            queue.publish('sidebar.select', 'setting');
          } else if (btn === this.btnHelp) {
            queue.publish('sidebar.select', 'help');
          } else if (btn === this.btnColumnMode) {
            queue.publish('read.column-mode.click', null);
          } else if (btn === this.btnStrongMode) {
            queue.publish('read.strong-mode.click', null);
          } else if (btn === this.btnNameMode) {
            queue.publish('read.name-mode.click', null);
          } else if (btn === this.btnMenu) {
            this.showToolbarMenu();
          }
        }
      }
    }

    toolbarMenuClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnCancel) {
          this.hideToolbarMenu();
        } else {
          if (btn === this.btnMenuSetting) {
            queue.publish('sidebar.select', 'setting');
          } else if (btn === this.btnMenuHelp) {
            queue.publish('sidebar.select', 'help');
          }
          this.hideToolbarMenu();
        }
      }
    }

    toolbarUpperClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div');
      if (btn) {
        if (btn === this.btnBanner) {
          this.toogleClipboardMode();
        } else if (btn === this.btnPrev) {
          queue.publish('read.prev.chapter', 1);
        } else if (btn === this.btnNext) {
          queue.publish('read.next.chapter', 2);
        }
      }
    }

    updateBanner() {
      this.btnBanner.textContent = tomeLists.chapters[this.chapterIdx][tomeIdx.chapter.name];
    }

    updateColumnMode() {
      if (this.columnMode) {
        this.list.classList.add('list--read-column');
      } else {
        this.list.classList.remove('list--read-column');
      }
    }

    updateColumnModeBtn() {
      if (this.columnMode) {
        this.btnColumnMode.classList.add('btn-icon--active');
      } else {
        this.btnColumnMode.classList.remove('btn-icon--active');
      }
    }

    updateVerses() {
      this.scroll.scrollTop = 0;
      util.removeAllChildren(this.list);
      const fragment = document.createDocumentFragment();
      for (const verseObj of this.verseObjs) {
        const verse = this.buildVerse(verseObj);
        fragment.appendChild(verse);
      }
      this.list.appendChild(fragment);
    }

    verseClick(btnVerse) {
      const verseIdx = parseInt(btnVerse.dataset.verseIdx);
      if (this.strongMode) {
        queue.publish('read.strong.select', verseIdx);
      } else if (btnVerse.classList.contains('verse--bookmark')) {
        queue.publish('read.bookmark.delete', verseIdx);
      } else {
        queue.publish('read.bookmark.add', verseIdx);
      }
    }

    verseObjsUpdate(verseObjs) {
      this.verseObjs = verseObjs;
      this.updateBanner();
      this.updateVerses();
      this.refreshVerseBookmarks();
      this.scrollToVerse(this.scrollVerseIdx);
    }

  }

  const mqlOnePane = window.matchMedia('screen and (max-width: 639px)');
  const mqlTwoPanes = window.matchMedia('screen and (min-width: 640px) and (max-width: 959px)');
  const mqlThreePanes = window.matchMedia('screen and (min-width: 960px)');

  class ReadController {

    constructor() {
      this.initialize();
    }

    bookmarkAdd(verseIdx) {
      queue.publish('bookmark.add', verseIdx);
    }

    bookmarkDelete(verseIdx) {
      queue.publish('bookmark.delete', verseIdx);
    }

    columnModeToggle() {
      queue.publish('read.column-mode.toggle', null);
    }

    columnModeUpdate(columnMode) {
      this.columnMode = columnMode;
    }

    decreasePanes() {
      if (this.panes === 1) {
        this.lastSidebar = this.sidebar;
        queue.publish('sidebar.change', 'none');
      }
      if (this.columnMode && this.panes < 3) {
        queue.publish('read.column-mode.toggle', null);
      }
    }

    increasePanes() {
      if (this.currentPanes === 1) {
        if (this.sidebar !== 'none') {
          queue.publish('read.show', null);
        } else if (this.lastSidebar === null) {
          queue.publish('sidebar.change', 'navigator');
        } else {
          queue.publish('sidebar.change', this.lastSidebar);
        }
      }
    }

    initialize() {
      this.subscribe();
      this.sidebar = null;
      this.lastSidebar = null;
      this.panes = null;
      this.currentPanes = null;
      this.PaneListeners();
    }

    initializeApp() {
      this.setPanes();
      this.currentPanes = this.panes;
      queue.publish('db.restore', null);
      queue.publish('bookmark.restore', null);
      queue.publish('navigator.restore', null);
      queue.publish('search.restore', null);
      queue.publish('strong.restore', null);
      queue.publish('setting.restore', null);
      queue.publish('help.restore', null);
      queue.publish('read.restore', null);
      queue.publish('set.name-mode-btn', null);
    }

    nameModeChange() {
      queue.publish('name-mode.change', null);
    }

    nextChapter() {
      queue.publish('chapter.next', null);
    }

    PaneListeners() {
      mqlOnePane.addEventListener('change', (event) => {
        if (event.matches) {
          this.updatePanes();
        }
      });
      mqlTwoPanes.addEventListener('change', (event) => {
        if (event.matches) {
          this.updatePanes();
        }
      });
      mqlThreePanes.addEventListener('change', (event) => {
        if (event.matches) {
          this.updatePanes();
        }
      });
    }

    prevChapter() {
      queue.publish('chapter.prev', null);
    }

    setPanes() {
      if (mqlOnePane.matches) {
        this.panes = 1;
      } else if (mqlTwoPanes.matches) {
        this.panes = 2;
      } else if (mqlThreePanes.matches) {
        this.panes = 3;
      }
      queue.publish('panes.change', this.panes);
    }

    sidebarSelect(sidebar) {
      queue.publish('sidebar.change', sidebar);
    }

    sidebarUpdate(sidebar) {
      if (sidebar !== this.sidebar) {
        if (sidebar === 'none') {
          this.lastSidebar = this.sidebar;
          queue.publish(`${this.sidebar}.hide`, null);
          this.sidebar = sidebar;
          queue.publish('read.show', null);
        } else if (this.panes === 1) {
          if (this.sidebar === 'none') {
            queue.publish('read.hide', null);
          } else {
            queue.publish(`${this.sidebar}.hide`, null);
          }
          this.sidebar = sidebar;
          queue.publish(`${this.sidebar}.show`, null);
        } else {
          if (this.sidebar && this.sidebar !== 'none') {
            queue.publish(`${this.sidebar}.hide`, null);
          }
          this.sidebar = sidebar;
          queue.publish(`${this.sidebar}.show`, null);
        }
      }
    }

    strongModeToggle() {
      queue.publish('read.strong-mode.toggle', null);
    }

    strongSelect(verseIdx) {
      this.strongSelectPending = true;
      queue.publish('strong.verse.change', verseIdx);
    }

    strongVerseUpdate() {
      if (this.strongSelectPending) {
        this.strongSelectPending = false;
        queue.publish('sidebar.change', 'strong');
      }
    }

    subscribe() {
      queue.subscribe('read.bookmark.add', (verseIdx) => {
        this.bookmarkAdd(verseIdx);
      });
      queue.subscribe('read.bookmark.delete', (verseIdx) => {
        this.bookmarkDelete(verseIdx);
      });

      queue.subscribe('read.column-mode.click', () => {
        this.columnModeToggle();
      });
      queue.subscribe('read.column-mode.update', (columnMode) => {
        this.columnModeUpdate(columnMode);
      });

      queue.subscribe('read.name-mode.click', () => {
        this.nameModeChange();
      });

      queue.subscribe('read.next.chapter', () => {
        this.nextChapter();
      });

      queue.subscribe('read.prev.chapter', () => {
        this.prevChapter();
      });

      queue.subscribe('read.strong-mode.click', () => {
        this.strongModeToggle();
      });

      queue.subscribe('read.strong.select', (verseIdx) => {
        this.strongSelect(verseIdx);
      });

      queue.subscribe('sidebar.select', (sidebar) => {
        this.sidebarSelect(sidebar);
      });
      queue.subscribe('sidebar.update', (sidebar) => {
        this.sidebarUpdate(sidebar);
      });

      queue.subscribe('strong.verse.update', () => {
        this.strongVerseUpdate();
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

  const validTasks$4 = [
    'navigator-book', 'navigator-chapter',
  ];

  const CHAPTER_IDX_GENESIS_1 = 0;

  class NavigatorModel {

    constructor() {
      this.initialize();
    }

    bookIdxChange(bookIdx) {
      this.bookIdx = bookIdx;
      queue.publish('bookIdx.update', this.bookIdx);
    }

    chapterIdxChange(chapterIdx) {
      this.chapterIdx = chapterIdx;
      this.saveChapterIdx();
      const bookIdx = tomeLists.chapters[this.chapterIdx][tomeIdx.chapter.bookIdx];
      if (this.bookIdx !== bookIdx) {
        this.bookIdxChange(bookIdx);
      }
      queue.publish('chapterIdx.update', this.chapterIdx);
      const verseIdx = firstVerseIdxByChapterIdx(this.chapterIdx);
      queue.publish('read.scroll-verse-idx', verseIdx);
    }

    async chapterNext() {
      let nextChapterIdx = this.chapterIdx + 1;
      if (nextChapterIdx >= tomeLists.chapters.length) {
        nextChapterIdx = 0;
      }
      await this.chapterIdxChange(nextChapterIdx);
    }

    async chapterPrev() {
      let prevChapterIdx = this.chapterIdx - 1;
      if (prevChapterIdx < 0) {
        prevChapterIdx = tomeLists.chapters.length - 1;
      }
      await this.chapterIdxChange(prevChapterIdx);
    }

    initialize() {
      this.subscribe();
    }

    async restore() {
      this.restoreTask();
      await this.restoreChapterIdx();
    }

    async restoreChapterIdx() {
      const defaultIdx = CHAPTER_IDX_GENESIS_1;
      let chapterIdx = localStorage.getItem('chapterIdx');
      if (!chapterIdx) {
        chapterIdx = defaultIdx;
      } else {
        try {
          chapterIdx = JSON.parse(chapterIdx);
        } catch (error) {
          chapterIdx = defaultIdx;
        }
        if (!tomeLists.chapters[chapterIdx]) {
          chapterIdx = defaultIdx;
        }
      }
      await this.chapterIdxChange(chapterIdx);
    }

    restoreTask() {
      const defaultTask = 'navigator-book';
      let navigatorTask = localStorage.getItem('navigatorTask');
      if (!navigatorTask) {
        navigatorTask = defaultTask;
      } else {
        try {
          navigatorTask = JSON.parse(navigatorTask);
        } catch (error) {
          navigatorTask = defaultTask;
        }
      }
      if (!validTasks$4.includes(navigatorTask)) {
        navigatorTask = defaultTask;
      }
      this.taskChange(navigatorTask);
    }

    saveChapterIdx() {
      localStorage.setItem('chapterIdx',
        JSON.stringify(this.chapterIdx));
    }

    saveNavigatorTask() {
      localStorage.setItem('navigatorTask',
        JSON.stringify(this.navigatorTask));
    }

    subscribe() {
      queue.subscribe('bookIdx.change', (bookIdx) => {
        this.bookIdxChange(bookIdx);
      });

      queue.subscribe('chapter.next', async () => {
        await this.chapterNext();
      });
      queue.subscribe('chapter.prev', async () => {
        await this.chapterPrev();
      });

      queue.subscribe('chapterIdx.change', async (chapterIdx) => {
        await this.chapterIdxChange(chapterIdx);
      });

      queue.subscribe('navigator.restore', async () => {
        await this.restore();
      });
      queue.subscribe('navigator.task.change', (navigatorTask) => {
        this.taskChange(navigatorTask);
      });
    }

    taskChange(navigatorTask) {
      this.navigatorTask = navigatorTask;
      this.saveNavigatorTask();
      queue.publish('navigator.task.update', this.navigatorTask);
    }

  }

  const greekFirstIdx = 39;
  const indices = [...Array(66).keys()];

  const lowerToolSet$m = [
    { type: 'btn', icon: 'back', ariaLabel: null },
    { type: 'btn', icon: 'navigator-chapter', ariaLabel: null },
  ];

  const upperToolSet$m = [
    { type: 'banner', cssModifier: 'navigator-book', text: 'Book' },
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

    bookIdxUpdate(bookIdx) {
      let activeBtn = this.list.querySelector('.btn-book--active');
      if (activeBtn) {
        activeBtn.classList.remove('btn-book--active');
      }
      const selector = `.btn-book[data-book-idx="${bookIdx}"]`;
      activeBtn = this.list.querySelector(selector);
      activeBtn.classList.add('btn-book--active');
    }

    buildBookDivider() {
      const divider = document.createElement('hr');
      divider.classList.add('book-divider');
      return divider;
    }

    buildBookList() {
      const booksHebrew = this.buildHebrewList();
      const booksGreek = this.buildGreekList();
      const divider = this.buildBookDivider();
      this.list.appendChild(booksHebrew);
      this.list.appendChild(divider);
      this.list.appendChild(booksGreek);
    }

    buildBtnBook(bookIdx) {
      const btn = document.createElement('div');
      btn.classList.add('btn-book');
      btn.dataset.bookIdx = bookIdx;
      btn.textContent = tomeLists.books[bookIdx][tomeIdx.book.shortName];
      return btn;
    }

    buildGreekList() {
      const booksGreek = document.createElement('div');
      booksGreek.classList.add('content', 'content--greek-book');
      const greekIndices = indices.slice(greekFirstIdx);
      for (const idx of greekIndices) {
        const btn = this.buildBtnBook(idx);
        booksGreek.appendChild(btn);
      }
      return booksGreek;
    }

    buildHebrewList() {
      const booksHebrew = document.createElement('div');
      booksHebrew.classList.add('content', 'content--hebrew-book');
      const hebrewIndices = indices.slice(0, greekFirstIdx);
      for (const idx of hebrewIndices) {
        const btn = this.buildBtnBook(idx);
        booksHebrew.appendChild(btn);
      }
      return booksHebrew;
    }

    buildPage() {
      this.page = template.page('navigator-book');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$m);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('navigator-book');
      this.list = template.element('div', 'list', 'navigator-book', null, null);
      this.scroll.appendChild(this.list);
      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$m);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    contentClick(btn) {
      const bookIdx = parseInt(btn.dataset.bookIdx);
      queue.publish('navigator-book.select', bookIdx);
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

      this.buildBookList();
    }

    listClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-book');
      if (btn) {
        if (btn.classList.contains('btn-book')) {
          this.contentClick(btn);
        }
      }
    }

    show() {
      this.page.classList.remove('page--hide');
    }

    subscribe() {
      queue.subscribe('bookIdx.update', (bookIdx) => {
        this.bookIdxUpdate(bookIdx);
      });

      queue.subscribe('navigator-book.hide', () => {
        this.hide();
      });
      queue.subscribe('navigator-book.show', () => {
        this.show();
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBack) {
          queue.publish('navigator.back', null);
        } else if (btn === this.btnChapter) {
          queue.publish('navigator-chapter', null);
        }
      }
    }

  }

  const lowerToolSet$l = [
    { type: 'btn', icon: 'back', ariaLabel: null },
    { type: 'btn', icon: 'navigator-book', ariaLabel: null },
  ];

  const upperToolSet$l = [
    { type: 'banner', cssModifier: 'navigator-chapter', text: null },
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
      const chapter = tomeLists.chapters[chapterIdx];
      const btn = document.createElement('div');
      btn.classList.add('btn-chapter');
      btn.dataset.bookIdx = chapter[tomeIdx.chapter.bookIdx];
      btn.dataset.chapterIdx = chapterIdx;
      btn.dataset.chapterName = chapter[tomeIdx.chapter.name];
      const num = chapter[tomeIdx.chapter.num];
      btn.textContent = num;
      return btn;
    }

    bookIdxUpdate(bookIdx) {
      if (this.bookIdx !== bookIdx) {
        this.bookIdx = bookIdx;
        this.updateBanner();
        this.updateChapterList();
      }
    }

    buildPage() {
      this.page = template.page('navigator-chapter');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$l);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('navigator-chapter');
      this.list = template.element('div', 'list', 'navigator-chapter', null, null);
      this.scroll.appendChild(this.list);
      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$l);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    chapterIdxUpdate(chapterIdx) {
      const oldChapterIdx = this.chapterIdx || chapterIdx;
      const oldBookIdx = tomeLists.chapters[oldChapterIdx][tomeIdx.chapter.bookIdx];
      this.chapterIdx = chapterIdx;
      const bookIdx = tomeLists.chapters[this.chapterIdx][tomeIdx.chapter.bookIdx];
      if (oldBookIdx !== bookIdx) {
        this.updateBanner();
        this.updateChapterList();
      }
      this.updateActive();
    }

    contentClick(btn) {
      const chapterIdx = parseInt(btn.dataset.chapterIdx);
      queue.publish('navigator-chapter.select', chapterIdx);
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
      const btn = event.target.closest('div.btn-chapter');
      if (btn) {
        if (btn.classList.contains('btn-chapter')) {
          this.contentClick(btn);
        }
      }
    }

    show() {
      this.page.classList.remove('page--hide');
    }

    subscribe() {
      queue.subscribe('bookIdx.update', (bookIdx) => {
        this.bookIdxUpdate(bookIdx);
      });

      queue.subscribe('chapterIdx.update', (chapterIdx) => {
        this.chapterIdxUpdate(chapterIdx);
      });

      queue.subscribe('navigator-chapter.hide', () => {
        this.hide();
      });
      queue.subscribe('navigator-chapter.show', () => {
        this.show();
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBack) {
          queue.publish('navigator.back', null);
        } else if (btn === this.btnBook) {
          queue.publish('navigator-book', null);
        }
      }
    }

    updateActive() {
      let activeBtn = this.list.querySelector('.btn-chapter--active');
      if (activeBtn) {
        activeBtn.classList.remove('btn-chapter--active');
      }
      const selector =
        `.btn-chapter[data-chapter-idx="${this.chapterIdx}"]`;
      activeBtn = this.list.querySelector(selector);
      activeBtn.classList.add('btn-chapter--active');
    }

    updateBanner() {
      const longName = tomeLists.books[this.bookIdx][tomeIdx.book.longName];
      this.banner.innerHTML = `${longName}`;
    }

    updateChapterList() {
      this.scroll.scrollTop = 0;
      util.removeAllChildren(this.list);
      const list = document.createElement('div');
      list.classList.add('content', 'content--chapter');
      const book = tomeLists.books[this.bookIdx];
      const indices = util.range(book[tomeIdx.book.firstChapterIdx],
        book[tomeIdx.book.lastChapterIdx] + 1);
      for (const idx of indices) {
        const btn = this.buildBtnContent(idx);
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
      queue.publish('sidebar.change', 'none');
    }

    bookIdxUpdate(bookIdx) {
      this.lastBookIdx = bookIdx;
      if (this.bookSelectPending) {
        this.bookSelectPending = false;
        const book = tomeLists.books[bookIdx];
        this.chapterCount = book[tomeIdx.book.lastChapterIdx] -
          book[tomeIdx.book.firstChapterIdx] + 1;
        if (this.panes > 1 || this.chapterCount === 1) {
          const chapterIdx = tomeLists.books[bookIdx][tomeIdx.book.firstChapterIdx];
          queue.publish('chapterIdx.change', chapterIdx);
        } else {
          queue.publish('navigator.task.change', 'navigator-chapter');
        }
      }
    }

    bookPane() {
      queue.publish('navigator.task.change', 'navigator-book');
    }

    bookSelect(bookIdx) {
      if (bookIdx !== this.lastBookIdx) {
        this.bookSelectPending = true;
        queue.publish('bookIdx.change', bookIdx);
      }
    }

    chapterIdxUpdate(chapterIdx) {
      this.chapterIdx = chapterIdx;
      if (this.sidebar === 'navigator') {
        if (this.panes === 1) {
          queue.publish('sidebar.change', 'none');
        } else if (this.navigatorTask !== 'navigator-chapter') {
          queue.publish('navigator.task.change', 'navigator-chapter');
        }
      }
    }

    chapterPane() {
      queue.publish('navigator.task.change', 'navigator-chapter');
    }

    chapterSelect(chapterIdx) {
      queue.publish('chapterIdx.change', chapterIdx);
    }

    hide() {
      queue.publish(`${this.navigatorTask}.hide`, null);
    }

    initialize() {
      this.subscribe();
      this.lastBookIdx = null;
    }

    panesUpdate(panes) {
      this.panes = panes;
    }

    show() {
      queue.publish(`${this.navigatorTask}.show`, null);
    }

    sidebarUpdate(sidebar) {
      this.sidebar = sidebar;
    }

    subscribe() {
      queue.subscribe('bookIdx.update', (bookIdx) => {
        this.bookIdxUpdate(bookIdx);
      });

      queue.subscribe('chapterIdx.update', (chapterIdx) => {
        this.chapterIdxUpdate(chapterIdx);
      });

      queue.subscribe('navigator-book', () => {
        this.bookPane();
      });
      queue.subscribe('navigator-book.select', (bookIdx) => {
        this.bookSelect(bookIdx);
      });

      queue.subscribe('navigator-chapter', () => {
        this.chapterPane();
      });
      queue.subscribe('navigator-chapter.select', (chapterIdx) => {
        this.chapterSelect(chapterIdx);
      });

      queue.subscribe('navigator.back', () => {
        this.back();
      });
      queue.subscribe('navigator.hide', () => {
        this.hide();
      });
      queue.subscribe('navigator.show', () => {
        this.show();
      });
      queue.subscribe('navigator.task.update', (navigatorTask) => {
        this.taskUpdate(navigatorTask);
      });

      queue.subscribe('panes.update', (panes) => {
        this.panesUpdate(panes);
      });

      queue.subscribe('sidebar.update', (sidebar) => {
        this.sidebarUpdate(sidebar);
      });
    }

    taskUpdate(navigatorTask) {
      if (this.sidebar === 'navigator') {
        if (this.navigatorTask !== navigatorTask) {
          queue.publish(`${this.navigatorTask}.hide`, null);
          this.navigatorTask = navigatorTask;
          queue.publish(`${this.navigatorTask}.show`, null);
        }
      } else {
        this.navigatorTask = navigatorTask;
      }
    }

  }

  const numSortAscend = (a, b) => a - b;

  const bookmarkFolderReroute = [
    'bookmark-folder-add', 'bookmark-folder-delete', 'bookmark-folder-rename',
    'bookmark-export', 'bookmark-import',
  ];
  const bookmarkListReroute = [
    'bookmark-move-copy',
  ];
  const validTasks$3 = [
    'bookmark-list', 'bookmark-folder',
  ];

  const firstEntry = 0;

  class BookmarkModel {

    constructor() {
      this.initialize();
    }

    async activeFolderChange(activeFolderName) {
      this.activeFolderName = activeFolderName;
      this.updateActiveFolderName();
      await this.updateActiveFolder();
    }

    async add(verseIdx) {
      const bookmarks = this.activeFolder.bookmarks;
      if (bookmarks.indexOf(verseIdx) === -1) {
        this.activeFolder.bookmarks = [verseIdx, ...bookmarks];
        this.updateFolders();
        await this.updateActiveFolder();
      }
    }

    copy(copyPkg) {
      const toFolder = this.getFolder(copyPkg.to);
      toFolder.bookmarks.push(copyPkg.verseIdx);
      this.updateFolders();
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

    async delete(verseIdx) {
      const bookmarks = this.activeFolder.bookmarks;
      const index = bookmarks.indexOf(verseIdx);
      if (index !== -1) {
        bookmarks.splice(index, 1);
        this.updateFolders();
        await this.updateActiveFolder();
      }
    }

    async down(verseIdx) {
      const bookmarks = this.activeFolder.bookmarks;
      const index = bookmarks.indexOf(verseIdx);
      if (index !== bookmarks.length - 1 && index !== -1) {
        this.reorderBookmarks(index, index + 1);
        this.updateFolders();
        await this.updateActiveFolder();
      }
    }

    expandModeChange(expandMode) {
      this.expandMode = expandMode;
      this.saveExpandMode();
      queue.publish('bookmark.expand-mode.update', this.expandMode);
    }

    expandModeToogle() {
      this.expandModeChange(!this.expandMode);
    }

    async folderAdd(folderName) {
      let newFolder = this.getFolder(folderName);
      if (!newFolder) {
        newFolder = this.createFolder(folderName);
        this.folders.push(newFolder);
        this.updateFolders();
        await this.activeFolderChange(folderName);
        this.updateFolderList();
        queue.publish('bookmark.folder.added', null);
      } else {
        queue.publish('bookmark.folder.add.error', 'Duplicate Folder Name');
      }
    }

    async folderDelete(folderName) {
      const idx = this.getFolderIdx(folderName);
      this.folders.splice(idx, 1);
      if (this.folders.length === 0) {
        await this.folderAdd('Default');
      }
      this.updateFolders();
      const firstFolderName = this.folders[firstEntry].name;
      await this.activeFolderChange(firstFolderName);
      this.updateFolderList();
    }

    folderDown(folderName) {
      const index = this.folders.findIndex((folder) => folder.name === folderName);
      if (index !== this.folders.length - 1 && index !== -1) {
        this.reorderFolders(index, index + 1);
        this.updateFolders();
        this.updateFolderList();
      }
    }

    folderImport(pkgStr) {
      const bookmarkPkg = this.getBookmarkPkg(pkgStr);
      if (!bookmarkPkg) {
        queue.publish('bookmark-import.message', 'Invalid JSON String');
      } else {
        let status = this.validatePkg(bookmarkPkg);
        if (status === 'OK') {
          status = this.foldersAreValid(bookmarkPkg.folders);
        }
        if (status === 'OK') {
          this.importPkg(bookmarkPkg);
        } else {
          queue.publish('bookmark-import.message', status);
        }
      }
    }

    folderNameIsValid(folderName) {
      return this.folders.some((folder) => {
        return folder.name === folderName;
      });
    }

    async folderRename(namePkg) {
      if (namePkg.old === namePkg.new) {
        queue.publish('bookmark.folder.rename.error', 'Duplicate Folder Name');
      } else {
        const oldFolder = this.getFolder(namePkg.old);
        oldFolder.name = namePkg.new;
        this.updateFolders();
        this.updateFolderList();
        if (this.activeFolderName === namePkg.old) {
          await this.activeFolderChange(namePkg.new);
        }
        queue.publish('bookmark.folder.renamed', null);
      }
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
            status = 'Invalid Folder Structure';
            error = true;
          }
          if (!error) {
            error = folder.bookmarks.some((bookmark) => {
              if (
                !Number.isInteger(bookmark) ||
                bookmark < 0 ||
                bookmark > this.maxIdx
              ) {
                status = 'Invalid Verse';
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
      const index = this.folders.findIndex((folder) => folder.name === folderName);
      if (index !== 0 && index !== -1) {
        this.reorderFolders(index, index - 1);
        this.updateFolders();
        this.updateFolderList();
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
      for (const folder of bookmarkPkg.folders) {
        let targetFolder = this.getFolder(folder.name);
        if (!targetFolder) {
          targetFolder = this.createFolder(folder.name);
          this.folders.push(targetFolder);
        }
        for (const verseIdx of folder.bookmarks) {
          const bookmarks = targetFolder.bookmarks;
          if (bookmarks.indexOf(verseIdx) !== -1) {
            continue;
          }
          targetFolder.bookmarks.push(verseIdx);
        }
      }
      this.updateFolders();
      this.updateFolderList();
      this.updateActiveFolder();
      queue.publish('bookmark-import.message', 'Import Successful');
    }

    initialize() {
      this.subscribe();
    }

    async move(movePkg) {
      const toFolder = this.getFolder(movePkg.to);
      toFolder.bookmarks.push(movePkg.verseIdx);

      const bookmarks = this.activeFolder.bookmarks;
      const index = bookmarks.indexOf(movePkg.verseIdx);
      if (index !== -1) {
        bookmarks.splice(index, 1);
        this.updateFolders();
        await this.updateActiveFolder(this.activeFolderName);
      }
    }

    async moveCopyChange(verseIdx) {
      this.moveCopyVerseObj = await tomeDb.verses.get(verseIdx);
      queue.publish('bookmark.move-copy.update', this.moveCopyVerseObj);
    }

    moveCopyListChange(verseIdx) {
      const foldersNotFoundIn = this.folders.filter((folder) => !folder.bookmarks.some((element) => element === verseIdx));
      const moveCopyList = foldersNotFoundIn.map((folder) => folder.name);
      queue.publish('bookmark-move-copy.list.update', moveCopyList);
    }

    reorderBookmarks(fromIdx, toIdx) {
      const bookmarks = this.activeFolder.bookmarks;
      bookmarks.splice(toIdx, 0, bookmarks.splice(fromIdx, 1)[firstEntry]
      );
    }

    reorderFolders(fromIdx, toIdx) {
      this.folders.splice(toIdx, 0, this.folders.splice(fromIdx, 1)[firstEntry]
      );
    }

    async restore() {
      this.restoreTask();
      this.restoreFolders();
      await this.restoreActiveFolderName();
      this.restoreExpandMode();
      this.restoreStrongMode();
    }

    async restoreActiveFolderName() {
      const defaultFolderName = 'Default';
      let activeFolderName =
        localStorage.getItem('activeFolderName');
      if (!activeFolderName) {
        activeFolderName = defaultFolderName;
      } else {
        try {
          activeFolderName = JSON.parse(activeFolderName);
        } catch (error) {
          activeFolderName = defaultFolderName;
        }
        if (!this.folderNameIsValid(activeFolderName)) {
          activeFolderName = defaultFolderName;
        }
      }
      await this.activeFolderChange(activeFolderName);
    }

    restoreDb() {
      this.maxIdx = tomeVerseCount - 1;
    }

    restoreExpandMode() {
      const defaultMode = false;
      let expandMode = localStorage.getItem('bookmarkExpandMode');
      if (!expandMode) {
        expandMode = defaultMode;
      } else {
        try {
          expandMode = JSON.parse(expandMode);
        } catch (error) {
          expandMode = defaultMode;
        }
        if (typeof expandMode !== 'boolean') {
          expandMode = defaultMode;
        }
      }
      this.expandModeChange(expandMode);
    }

    restoreFolders() {
      const defaultFolders = this.createFolders();
      let folders = localStorage.getItem('folders');
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
      this.updateFolders();
      this.updateFolderList();
    }

    restoreStrongMode() {
      const defaultMode = false;
      let strongMode = localStorage.getItem('bookmarkStrongMode');
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
      this.strongModeChange(strongMode);
    }

    restoreTask() {
      const defaultTask = 'bookmark-list';
      let bookmarkTask = localStorage.getItem('bookmarkTask');
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
        } else if (!validTasks$3.includes(bookmarkTask)) {
          bookmarkTask = defaultTask;
        }
      }
      this.taskChange(bookmarkTask);
    }

    saveActiveFolderName() {
      localStorage.setItem('activeFolderName',
        JSON.stringify(this.activeFolderName));
    }

    saveBookmarkTask() {
      localStorage.setItem('bookmarkTask',
        JSON.stringify(this.bookmarkTask));
    }

    saveExpandMode() {
      localStorage.setItem('bookmarkExpandMode',
        JSON.stringify(this.expandMode));
    }

    saveFolders() {
      localStorage.setItem('folders', JSON.stringify(this.folders));
    }

    saveStrongMode() {
      localStorage.setItem('bookmarkStrongMode',
        JSON.stringify(this.strongMode));
    }

    async sort(sorter) {
      const bookmarks = this.activeFolder.bookmarks;
      if (bookmarks.length !== 0) {
        bookmarks.sort(sorter);
        this.updateFolders();
        await this.updateActiveFolder(this.activeFolderName);
      }
    }

    async sortInvert() {
      const bookmarks = this.activeFolder.bookmarks;
      bookmarks.reverse();
      this.updateFolders();
      await this.updateActiveFolder(this.activeFolderName);
    }

    strongModeChange(strongMode) {
      this.strongMode = strongMode;
      this.saveStrongMode();
      queue.publish('bookmark.strong-mode.update', this.strongMode);
    }

    strongModeToogle() {
      this.strongModeChange(!this.strongMode);
    }

    subscribe() {
      queue.subscribe('bookmark.active-folder.change', async (folderName) => {
        await this.activeFolderChange(folderName);
      });
      queue.subscribe('bookmark.add', async (verseIdx) => {
        await this.add(verseIdx);
      });
      queue.subscribe('bookmark.copy', (copyPkg) => {
        this.copy(copyPkg);
      });
      queue.subscribe('bookmark.delete', async (verseIdx) => {
        await this.delete(verseIdx);
      });
      queue.subscribe('bookmark.down', async (verseIdx) => {
        await this.down(verseIdx);
      });
      queue.subscribe('bookmark.expand-mode.toggle', () => {
        this.expandModeToogle();
      });
      queue.subscribe('bookmark.folder.add', async (folderName) => {
        await this.folderAdd(folderName);
      });
      queue.subscribe('bookmark.folder.delete', async (folderName) => {
        await this.folderDelete(folderName);
      });
      queue.subscribe('bookmark.folder.down', (folderName) => {
        this.folderDown(folderName);
      });
      queue.subscribe('bookmark.folder.rename', async (namePkg) => {
        await this.folderRename(namePkg);
      });
      queue.subscribe('bookmark.folder.up', (folderName) => {
        this.folderUp(folderName);
      });
      queue.subscribe('bookmark.move', async (movePkg) => {
        await this.move(movePkg);
      });
      queue.subscribe('bookmark.move-copy.change', async (verseIdx) => {
        await this.moveCopyChange(verseIdx);
      });
      queue.subscribe('bookmark.pkg.import', (pkgStr) => {
        this.folderImport(pkgStr);
      });
      queue.subscribe('bookmark.restore', async () => {
        await this.restore();
      });
      queue.subscribe('bookmark.sort-ascend', async () => {
        await this.sort(numSortAscend);
      });
      queue.subscribe('bookmark.sort-invert', async () => {
        await this.sortInvert();
      });
      queue.subscribe('bookmark.strong-mode.toggle', () => {
        this.strongModeToogle();
      });
      queue.subscribe('bookmark.task.change', (bookmarkTask) => {
        this.taskChange(bookmarkTask);
      });
      queue.subscribe('bookmark.up', async (verseIdx) => {
        await this.up(verseIdx);
      });

      queue.subscribe('bookmark-move-copy.list.change', (verseIdx) => {
        this.moveCopyListChange(verseIdx);
      });

      queue.subscribe('db.restore', () => {
        this.restoreDb();
      });

      queue.subscribe('name-mode.update', () => {
        this.updateNameMode();
      });
    }

    taskChange(bookmarkTask) {
      this.bookmarkTask = bookmarkTask;
      this.saveBookmarkTask();
      queue.publish('bookmark.task.update', this.bookmarkTask);
    }

    async up(verseIdx) {
      const bookmarks = this.activeFolder.bookmarks;
      const index = bookmarks.indexOf(verseIdx);
      if (index !== 0 && index !== -1) {
        this.reorderBookmarks(index, index - 1);
        this.updateFolders();
        await this.updateActiveFolder();
      }
    }

    async updateActiveFolder() {
      this.activeFolder = this.getFolder(this.activeFolderName);
      this.activeFolder.verseObjs = await tomeDb.verses.bulkGet(this.activeFolder.bookmarks);
      queue.publish('bookmark.active-folder.update', this.activeFolder);
    }

    updateActiveFolderName() {
      this.saveActiveFolderName();
    }

    async updateBookmarkVerseObjs() {
      this.activeFolder.verseObjs = await tomeDb.verses.bulkGet(this.activeFolder.bookmarks);
      queue.publish('bookmark.verse-objs.update', this.activeFolder.verseObjs);
    }

    updateFolderList() {
      queue.publish('bookmark.folder-list.update', this.getFolderList());
    }

    updateFolders() {
      this.saveFolders();
      queue.publish('bookmark.folders.update', this.folders);
    }

    updateNameMode() {
      this.updateBookmarkVerseObjs();
    }

    validatePkg(bookmarkPkg) {
      let status = 'OK';
      if (
        !bookmarkPkg.tome ||
        !bookmarkPkg.folders ||
        !Array.isArray(bookmarkPkg.folders)
      ) {
        status = 'Invalid Package Structure';
      }
      if (bookmarkPkg.tome !== tomeLists.tomeName) {
        status = 'Tome Mismatch';
      }
      return status;
    }
  }

  const actionSet$2 = [
    { icon: 'up', ariaLabel: null },
    { icon: 'down', ariaLabel: null },
    { icon: 'move-copy', ariaLabel: null },
    { icon: 'delete', ariaLabel: null },
    { icon: 'cancel', ariaLabel: null },
  ];

  const lowerToolSet$k = [
    { type: 'btn', icon: 'back', ariaLabel: null },
    { type: 'btn', icon: 'sort-ascend', ariaLabel: null },
    { type: 'btn', icon: 'sort-invert', ariaLabel: null },
    { type: 'btn', icon: 'bookmark-folder', ariaLabel: null },
    { type: 'btn', icon: 'expand-mode', ariaLabel: null },
    { type: 'btn', icon: 'strong-mode', ariaLabel: null },
  ];

  const upperToolSet$k = [
    { type: 'btn-banner', cssModifier: 'bookmark-list', ariaLbael: 'Toogle Clipboard' },
  ];

  class BookmarkListView {

    constructor() {
      this.initialize();
    }

    actionMenuClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnCancel) {
          this.actionMenu.classList.add('hide');
        } else {
          const btnEntry = this.activeEntry.querySelector('.btn-entry');
          const verseIdx = parseInt(btnEntry.dataset.verseIdx);
          if (btn === this.btnUp) {
            this.up(verseIdx);
          } else if (btn === this.btnDown) {
            this.down(verseIdx);
          } else if (btn === this.btnMoveCopy) {
            this.moveCopy(verseIdx);
          } else if (btn === this.btnDelete) {
            this.delete(verseIdx);
          }
          this.actionMenu.classList.add('hide');
        }
      }
    }

    addListeners() {
      this.actionMenu.addEventListener('click', (event) => {
        this.actionMenuClick(event);
      });
      this.entryList.addEventListener('click', (event) => {
        this.entryListClick(event);
      });
      this.verseList.addEventListener('click', (event) => {
        this.verseListClick(event);
      });
      this.toolbarLower.addEventListener('click', (event) => {
        this.toolbarLowerClick(event);
      });
      this.toolbarUpper.addEventListener('click', (event) => {
        this.toolbarUpperClick(event);
      });
    }

    buildEntry(verseIdx) {
      const entry = document.createElement('div');
      entry.classList.add('entry', 'entry--bookmark');
      const btnRef = document.createElement('div');
      btnRef.classList.add('btn-entry', 'btn-entry--bookmark');
      btnRef.textContent = tomeLists.citations[verseIdx];
      btnRef.dataset.verseIdx = verseIdx;
      entry.appendChild(btnRef);
      const btnMenu = template.btnIcon('h-menu', 'h-menu', null);
      entry.appendChild(btnMenu);
      return entry;
    }

    buildPage() {
      this.page = template.page('bookmark-list');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$k);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('bookmark-list');

      this.empty = template.element('div', 'empty', 'bookmark-list', null, 'No bookmarks saved.');
      this.scroll.appendChild(this.empty);

      this.entryList = template.element('div', 'list', 'bookmark-entry-list', null, null);
      this.scroll.appendChild(this.entryList);

      this.verseList = template.element('div', 'list', 'bookmark-verse-list', null, null);
      this.scroll.appendChild(this.verseList);

      this.actionMenu = template.actionMenu('bookmark-list', actionSet$2);
      this.scroll.appendChild(this.actionMenu);

      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$k);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    buildRefSpan(verseObj) {
      const refSpan = document.createElement('span');
      refSpan.classList.add('font--bold');
      refSpan.textContent = verseObj.v[tomeIdx.verse.citation] + ' ';
      return refSpan;
    }

    buildVerse(verseObj) {
      const btn = document.createElement('div');
      btn.classList.add('btn-result');
      btn.dataset.verseIdx = verseObj.k;
      const searchText = document.createElement('span');
      searchText.classList.add('span-result-text');
      const acrostic = template.acrostic(verseObj);
      const ref = this.buildRefSpan(verseObj);
      const text = document.createTextNode(verseObj.v[tomeIdx.verse.text]);
      searchText.appendChild(ref);
      if (acrostic) {
        searchText.appendChild(acrostic);
      }
      searchText.appendChild(text);
      btn.appendChild(searchText);
      return btn;
    }

    delete(verseIdx) {
      queue.publish('bookmark-list.delete', verseIdx);
    }

    down(verseIdx) {
      queue.publish('bookmark-list.down', verseIdx);
    }

    entryClick(target) {
      if (target) {
        if (target.classList.contains('btn-entry')) {
          const verseIdx = parseInt(target.dataset.verseIdx);
          if (this.strongMode) {
            queue.publish('bookmark-list.strong-select', verseIdx);
          } else {
            queue.publish('bookmark-list.select', verseIdx);
          }
        } else if (target.classList.contains('btn-icon--h-menu')) {
          const ref = target.previousSibling;
          this.menuClick(ref);
        }
      }
    }

    expandModeUpdate(expandMode) {
      this.expandMode = expandMode;
      if (this.expandMode) {
        this.verseScrollTop = this.scroll.scrollTop;
        this.btnExpandMode.classList.add('btn-icon--active');
        this.entryList.classList.add('hide');
        this.verseList.classList.remove('hide');
        this.scroll.scrollTop = this.entrySrollTop;
      } else {
        this.entrySrollTop = this.scroll.scrollTop;
        this.btnExpandMode.classList.remove('btn-icon--active');
        this.entryList.classList.remove('hide');
        this.verseList.classList.add('hide');
        this.scroll.scrollTop = this.verseScrollTop;
      }
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
      this.lastFontSize = null;
    }

    fontVariantUpdate(fontVariant) {
      this.fontVariant = fontVariant;
      this.updateFontVariant();
      this.lastFontVariant = this.fontVariant;
    }

    getElements() {
      this.btnFolderAdd = this.toolbarUpper.querySelector('.btn-icon--folder-add');
      this.btnBanner = this.toolbarUpper.querySelector('.btn-banner--bookmark-list');

      this.btnUp = this.actionMenu.querySelector('.btn-icon--up');
      this.btnDown = this.actionMenu.querySelector('.btn-icon--down');
      this.btnMoveCopy = this.actionMenu.querySelector('.btn-icon--move-copy');
      this.btnDelete = this.actionMenu.querySelector('.btn-icon--delete');
      this.btnCancel = this.actionMenu.querySelector('.btn-icon--cancel');

      this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
      this.btnSortAscend = this.toolbarLower.querySelector('.btn-icon--sort-ascend');
      this.btnSortInvert = this.toolbarLower.querySelector('.btn-icon--sort-invert');
      this.btnExpandMode = this.toolbarLower.querySelector('.btn-icon--expand-mode');
      this.btnStrongMode = this.toolbarLower.querySelector('.btn-icon--strong-mode');
      this.btnBookmarkFolder = this.toolbarLower.querySelector('.btn-icon--bookmark-folder');
    }

    hide() {
      this.page.classList.add('page--hide');
      this.actionMenu.classList.add('hide');
    }

    initialize() {
      this.buildPage();
      this.getElements();
      this.addListeners();
      this.subscribe();
      this.lastFont = null;
      this.clipboardMode = false;
      this.entrySrollTop = 0;
      this.verseScrollTop = 0;
    }

    entryListClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div');
      if (btn) {
        this.entryClick(btn);
      }
    }

    menuClick(target) {
      this.showActionMenu(target);
    }

    moveCopy(verseIdx) {
      queue.publish('bookmark-list.move-copy', verseIdx);
    }

    show() {
      this.page.classList.remove('page--hide');
    }

    showActionMenu(target) {
      this.activeEntry = target.closest('div.entry');
      const top = target.offsetTop;
      this.actionMenu.style.top = `${top}px`;
      this.actionMenu.classList.remove('hide');
    }

    strongModeUpdate(strongMode) {
      this.strongMode = strongMode;
      if (this.strongMode) {
        this.btnStrongMode.classList.add('btn-icon--active');
      } else {
        this.btnStrongMode.classList.remove('btn-icon--active');
      }
    }

    subscribe() {
      queue.subscribe('bookmark-folder.select', () => {
        this.scroll.scrollTop = 0;
      });

      queue.subscribe('bookmark-list.hide', () => {
        this.hide();
      });
      queue.subscribe('bookmark-list.show', () => {
        this.show();
      });

      queue.subscribe('bookmark.active-folder.update', (activeFolder) => {
        this.updateActiveFolder(activeFolder);
      });
      queue.subscribe('bookmark.expand-mode.update', (expandMode) => {
        this.expandModeUpdate(expandMode);
      });
      queue.subscribe('bookmark.strong-mode.update', (strongMode) => {
        this.strongModeUpdate(strongMode);
      });

      queue.subscribe('font.update', (font) => {
        this.fontUpdate(font);
      });

      queue.subscribe('font-size.update', (fontSize) => {
        this.fontSizeUpdate(fontSize);
      });

      queue.subscribe('font-variant.update', (fontVariant) => {
        this.fontVariantUpdate(fontVariant);
      });

      queue.subscribe('bookmark.verse-objs.update', (verseObjs) => {
        this.updateBookmarkVerseObjs(verseObjs);
      });
    }

    toogleClipboardMode() {
      if (this.clipboardMode) {
        this.btnBanner.classList.remove('btn-banner--active');
      } else {
        this.btnBanner.classList.add('btn-banner--active');
      }
      this.clipboardMode = !this.clipboardMode;
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBack) {
          queue.publish('bookmark.back', null);
        } else if (btn === this.btnSortAscend) {
          queue.publish('bookmark-list.sort-ascend', null);
        } else if (btn === this.btnSortInvert) {
          queue.publish('bookmark-list.sort-invert', null);
        } else if (btn === this.btnBookmarkFolder) {
          queue.publish('bookmark-folder', null);
        } else if (btn === this.btnExpandMode) {
          queue.publish('bookmark-list.expand-mode.click', null);
        } else if (btn === this.btnStrongMode) {
          queue.publish('bookmark-list.strong-mode.click', null);
        }
      }
    }

    toolbarUpperClick(event) {
      event.preventDefault();
      if (!this.expandMode) {
        return;
      }
      const btn = event.target.closest('div.btn-banner');
      if (btn) {
        if (btn === this.btnBanner) {
          this.toogleClipboardMode();
        }
      }
    }

    up(verseIdx) {
      queue.publish('bookmark-list.up', verseIdx);
    }

    updateBanner() {
      this.btnBanner.innerHTML = `${this.activeFolder.name}`;
    }

    updateActiveFolder(activeFolder) {
      this.activeFolder = activeFolder;
      this.updateBanner();
      this.updateBookmarks();
    }

    updateBookmarks() {
      this.entrySrollTop = 0;
      this.updateEntryList();
      this.verseScrollTop = 0;
      this.updateVerseList();
    }

    updateBookmarkVerseObjs(verseObjs) {
      this.activeFolder.verseObjs = verseObjs;
      this.verseScrollTop = 0;
      this.updateVerseList();
    }

    updateEntryList() {
      util.removeAllChildren(this.entryList);
      if (this.activeFolder.bookmarks.length === 0) {
        this.empty.classList.remove('hide');
      } else {
        this.empty.classList.add('hide');
        const fragment = document.createDocumentFragment();
        for (const verseIdx of this.activeFolder.bookmarks) {
          const ref = this.buildEntry(verseIdx);
          fragment.appendChild(ref);
        }
        this.entryList.appendChild(fragment);
      }
    }

    updateFontSize() {
      if (this.lastFontSize) {
        this.verseList.classList.remove(this.lastFontSize);
      }
      this.verseList.classList.add(this.fontSize);
    }

    updateFontVariant() {
      if (this.lastFontVariant) {
        this.verseList.classList.remove(this.lastFontVariant);
      }
      this.verseList.classList.add(this.fontVariant);
    }

    updateFont() {
      if (this.lastFont) {
        this.verseList.classList.remove(this.lastFont.fontClass);
      }
      this.verseList.classList.add(this.font.fontClass);
    }

    updateVerseList() {
      util.removeAllChildren(this.verseList);
      if (this.activeFolder.bookmarks.length === 0) {
        this.empty.classList.remove('hide');
      } else {
        this.empty.classList.add('hide');
        const fragment = document.createDocumentFragment();
        for (const verseObj of this.activeFolder.verseObjs) {
          const ref = this.buildVerse(verseObj);
          fragment.appendChild(ref);
        }
        this.verseList.appendChild(fragment);
      }
    }

    verseClick(target) {
      if (target) {
        if (target.classList.contains('btn-result')) {
          if (this.clipboardMode) {
            const text = target.textContent;
            util.writeClipboardText(text);
          } else {
            const verseIdx = parseInt(target.dataset.verseIdx);
            if (this.strongMode) {
              queue.publish('bookmark-list.strong-select', verseIdx);
            } else {
              queue.publish('bookmark-list.select', verseIdx);
            }
          }
        }
      }
    }

    verseListClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div');
      if (btn) {
        this.verseClick(btn);
      }
    }

  }

  const actionSet$1 = [
    { icon: 'move', ariaLabel: null },
    { icon: 'copy', ariaLabel: null },
    { icon: 'cancel', ariaLabel: null },
  ];

  const lowerToolSet$j = [
    { type: 'btn', icon: 'bookmark-folder', ariaLabel: null },
  ];

  const upperToolSet$j = [
    { type: 'banner', cssModifier: 'bookmark-move-copy', text: null },
  ];

  class BookmarkMoveCopyView {

    constructor() {
      this.initialize();
    }

    actionMenuClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnCancel) {
          this.actionMenu.classList.add('hide');
        } else {
          const entry = this.activeEntry.querySelector('.btn-entry');
          const folderName = entry.textContent;
          if (btn === this.btnCopy) {
            this.copy(folderName);
          } else if (btn === this.btnMove) {
            this.move(folderName);
          }
          this.actionMenu.classList.add('hide');
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
      const entry = document.createElement('div');
      entry.classList.add('entry', 'entry--bookmark-move-copy');
      const btnEntry = document.createElement('div');
      btnEntry.classList.add('btn-entry', 'btn-entry--bookmark-move-copy');
      btnEntry.textContent = folderName;
      const btnMenu = template.btnIcon('h-menu', 'h-menu', null);
      entry.appendChild(btnEntry);
      entry.appendChild(btnMenu);
      return entry;
    }

    buildPage() {
      this.page = template.page('bookmark-move-copy');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$j);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('bookmark-move-copy');

      this.empty = template.element('div', 'empty', 'bookmark-move-copy', null, 'No Target Folder');
      this.scroll.appendChild(this.empty);

      this.list = template.element('div', 'list', 'bookmark-move-copy', null, null);
      this.scroll.appendChild(this.list);

      this.actionMenu = template.actionMenu('bookmark-move-copy', actionSet$1);
      this.scroll.appendChild(this.actionMenu);
      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$j);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    copy(folderName) {
      const copyPkg = {
        to: folderName,
        verseIdx: this.verseIdx,
      };
      queue.publish('bookmark-move-copy.copy', copyPkg);
    }

    folderUpdate(bookmarksFolder) {
      this.bookmarksFolder = bookmarksFolder;
    }

    getElements() {
      this.banner = this.toolbarUpper.querySelector('.banner--bookmark-move-copy');

      this.btnMove = this.actionMenu.querySelector('.btn-icon--move');
      this.btnCopy = this.actionMenu.querySelector('.btn-icon--copy');
      this.btnCancel = this.actionMenu.querySelector('.btn-icon--cancel');

      this.btnBookmarkFolder = this.toolbarLower.querySelector('.btn-icon--bookmark-folder');
    }

    hide() {
      this.page.classList.add('page--hide');
      this.actionMenu.classList.add('hide');
    }

    initialize() {
      this.buildPage();
      this.getElements();
      this.addListeners();
      this.subscribe();
    }

    listClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn.classList.contains('btn-icon--h-menu')) {
          const entry = btn.previousSibling;
          this.menuClick(entry);
        }
      }
    }

    listUpdate(moveCopyList) {
      this.moveCopyList = moveCopyList;
      this.updateFolders();
    }

    menuClick(target) {
      this.showActionMenu(target);
    }

    move(folderName) {
      const movePkg = {
        to: folderName,
        verseIdx: this.verseIdx,
      };
      queue.publish('bookmark-move-copy.move', movePkg);
    }

    moveCopyUpdate(verseObj) {
      this.moveCopyVerseObj = verseObj;
      this.verseIdx = this.moveCopyVerseObj.k;
      this.verse = this.moveCopyVerseObj.v;
      queue.publish('bookmark-move-copy.ready', null);
    }

    show() {
      this.updateBanner();
      this.page.classList.remove('page--hide');
    }

    showActionMenu(target) {
      this.activeEntry = target.closest('div.entry');
      const top = target.offsetTop;
      this.actionMenu.style.top = `${top}px`;
      this.actionMenu.classList.remove('hide');
    }

    subscribe() {
      queue.subscribe('bookmark.active-folder.update', (bookmarksFolder) => {
        this.folderUpdate(bookmarksFolder);
      });

      queue.subscribe('bookmark-move-copy.hide', () => {
        this.hide();
      });
      queue.subscribe('bookmark-move-copy.list.update', (moveCopyList) => {
        this.listUpdate(moveCopyList);
      });
      queue.subscribe('bookmark-move-copy.show', () => {
        this.show();
      });

      queue.subscribe('bookmark.move-copy.update', (verseObj) => {
        this.moveCopyUpdate(verseObj);
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBookmarkFolder) {
          queue.publish('bookmark-folder', null);
        }
      }
    }

    updateBanner() {
      const ref = this.verse[tomeIdx.verse.citation];
      this.banner.innerHTML = `${ref} <br> Move/Copy to Folder:`;
    }

    updateFolders() {
      const scrollSave = this.scroll.scrollTop;
      util.removeAllChildren(this.list);
      if (this.moveCopyList.length === 0) {
        this.empty.classList.remove('hide');
      } else {
        this.empty.classList.add('hide');
        const fragment = document.createDocumentFragment();
        for (const folderName of this.moveCopyList) {
          const entry = this.buildEntry(folderName);
          fragment.appendChild(entry);
        }
        this.list.appendChild(fragment);
      }
      this.scroll.scrollTop = scrollSave;
    }

  }

  const actionSet = [
    { icon: 'up', ariaLabel: null },
    { icon: 'down', ariaLabel: null },
    { icon: 'rename', ariaLabel: null },
    { icon: 'delete', ariaLabel: null },
    { icon: 'cancel', ariaLabel: null },
  ];

  const lowerToolSet$i = [
    { type: 'btn', icon: 'back', ariaLabel: null },
    { type: 'btn', icon: 'bookmark-folder-add', ariaLabel: null },
    { type: 'btn', icon: 'import', ariaLabel: null },
    { type: 'btn', icon: 'export', ariaLabel: null },
    { type: 'btn', icon: 'bookmark-list', ariaLabel: null },
  ];

  const upperToolSet$i = [
    { type: 'banner', cssModifier: 'bookmark-folder', text: 'Bookmark Folder' },
  ];

  class BookmarkFolderView {

    constructor() {
      this.initialize();
    }

    actionMenuClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnCancel) {
          this.actionMenu.classList.add('hide');
        } else {
          const entry = this.activeEntry.querySelector('.btn-entry');
          const folderName = entry.textContent;
          if (btn === this.btnDelete) {
            this.delete(folderName);
          } else if (btn === this.btnDown) {
            this.down(folderName);
          } else if (btn === this.btnRename) {
            this.rename(folderName);
          } else if (btn === this.btnUp) {
            this.up(folderName);
          }
          this.actionMenu.classList.add('hide');
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
      const entry = document.createElement('div');
      entry.classList.add('entry', 'entry--folder');
      const btnEntry = document.createElement('div');
      btnEntry.classList.add('btn-entry', 'btn-entry--folder');
      btnEntry.textContent = folderName;
      const btnMenu = template.btnIcon('h-menu', 'h-menu', null);
      entry.appendChild(btnEntry);
      entry.appendChild(btnMenu);
      return entry;
    }

    buildPage() {
      this.page = template.page('bookmark-folder');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$i);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('bookmark-folder');

      this.list = template.element('div', 'list', 'bookmark-folder', null, null);
      this.scroll.appendChild(this.list);

      this.actionMenu = template.actionMenu('bookmark-folder', actionSet);
      this.scroll.appendChild(this.actionMenu);
      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$i);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    delete(folderName) {
      queue.publish('bookmark-folder.delete', folderName);
    }

    down(folderName) {
      queue.publish('bookmark-folder.down', folderName);
    }

    folderListUpdate(folderList) {
      this.folderList = folderList;
      this.updateFolders();
    }

    getElements() {
      this.btnUp = this.actionMenu.querySelector('.btn-icon--up');
      this.btnDown = this.actionMenu.querySelector('.btn-icon--down');
      this.btnRename = this.actionMenu.querySelector('.btn-icon--rename');
      this.btnDelete = this.actionMenu.querySelector('.btn-icon--delete');
      this.btnCancel = this.actionMenu.querySelector('.btn-icon--cancel');

      this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
      this.btnBookmarkList = this.toolbarLower.querySelector('.btn-icon--bookmark-list');
      this.btnBookmarkFolderAdd = this.toolbarLower.querySelector('.btn-icon--bookmark-folder-add');
      this.btnImport = this.toolbarLower.querySelector('.btn-icon--import');
      this.btnExport = this.toolbarLower.querySelector('.btn-icon--export');
    }

    hide() {
      this.page.classList.add('page--hide');
      this.actionMenu.classList.add('hide');
    }

    initialize() {
      this.buildPage();
      this.getElements();
      this.addListeners();
      this.subscribe();
    }

    listClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div');
      if (btn) {
        if (btn.classList.contains('btn-entry')) {
          const folderName = btn.textContent;
          queue.publish('bookmark-folder.select', folderName);
        } else if (btn.classList.contains('btn-icon--h-menu')) {
          const entry = btn.previousSibling;
          this.menuClick(entry);
        }
      }
    }

    menuClick(target) {
      this.showActionMenu(target);
    }

    rename(folderName) {
      queue.publish('bookmark-folder-rename', folderName);
    }

    show() {
      this.page.classList.remove('page--hide');
    }

    showActionMenu(target) {
      this.activeEntry = target.closest('div.entry');
      const top = target.offsetTop;
      this.actionMenu.style.top = `${top}px`;
      this.actionMenu.classList.remove('hide');
    }

    subscribe() {
      queue.subscribe('bookmark-folder.hide', () => {
        this.hide();
      });
      queue.subscribe('bookmark-folder.show', () => {
        this.show();
      });

      queue.subscribe('bookmark.folder-list.update', (folderList) => {
        this.folderListUpdate(folderList);
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBack) {
          queue.publish('bookmark.back', null);
        } else if (btn === this.btnBookmarkList) {
          queue.publish('bookmark-list', null);
        } else if (btn === this.btnBookmarkFolderAdd) {
          queue.publish('bookmark-folder-add', null);
        } else if (btn === this.btnExport) {
          queue.publish('bookmark-export', null);
        } else if (btn === this.btnImport) {
          queue.publish('bookmark-import', null);
        }
      }
    }

    up(folderName) {
      queue.publish('bookmark-folder.up', folderName);
    }

    updateFolders() {
      const scrollSave = this.scroll.scrollTop;
      util.removeAllChildren(this.list);
      const fragment = document.createDocumentFragment();
      for (const folderName of this.folderList) {
        const entry = this.buildEntry(folderName);
        fragment.appendChild(entry);
      }
      this.list.appendChild(fragment);
      this.scroll.scrollTop = scrollSave;
    }

  }

  const dialogToolset$6 = [
    { type: 'label', text: 'Name' },
    { type: 'input', ariaLabel: 'Name' },
    { type: 'btn', cssModifier: 'save', ariaLabel: null, label: 'Save' },
  ];

  const lowerToolSet$h = [
    { type: 'btn', icon: 'back', ariaLabel: null },
    { type: 'btn', icon: 'bookmark-folder', ariaLabel: null },
  ];

  const upperToolSet$h = [
    { type: 'banner', cssModifier: 'bookmark-folder-add', text: 'Folder Add' },
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
      this.page = template.page('bookmark-folder-add');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$h);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('bookmark-folder-add');
      this.dialog = template.divDialog('bookmark-folder-add', dialogToolset$6);
      this.scroll.appendChild(this.dialog);

      this.message = template.element('div', 'message', 'bookmark-folder-add', null, null);
      this.scroll.appendChild(this.message);

      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$h);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    dialogClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-dialog');
      if (btn) {
        if (btn === this.btnSave) {
          this.saveClick();
        }
      }
    }

    error(message) {
      this.message.textContent = message;
      this.message.classList.remove('hide');
    }

    getElements() {
      this.inputName = this.dialog.querySelector('.dialog-input');
      this.dialogBtns = this.dialog.querySelector('.dialog-btns');
      this.btnSave = this.dialogBtns.querySelector('.btn-dialog--save');

      this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
      this.btnBookmarkFolder = this.toolbarLower.querySelector('.btn-icon--bookmark-folder');
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
        this.inputName.blur();
        this.saveClick();
      }
    }

    saveClick() {
      const name = this.inputName.value;
      if (name) {
        queue.publish('bookmark-folder-add.save', name);
      }
    }

    show() {
      this.page.classList.remove('page--hide');
      this.message.classList.add('hide');
      this.inputName.value = '';
      this.inputName.focus();
    }

    subscribe() {
      queue.subscribe('bookmark-folder-add.hide', () => {
        this.hide();
      });
      queue.subscribe('bookmark-folder-add.show', () => {
        this.show();
      });

      queue.subscribe('bookmark.folder.add.error', (message) => {
        this.error(message);
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBack) {
          queue.publish('bookmark.back', null);
        } else if (btn === this.btnBookmarkFolder) {
          queue.publish('bookmark-folder', null);
        }
      }
    }

  }

  const dialogToolset$5 = [
    { type: 'label', text: null },
    { type: 'btn', cssModifier: 'delete', ariaLabel: null, label: 'Delete' },
  ];

  const lowerToolSet$g = [
    { type: 'btn', icon: 'bookmark-folder', ariaLabel: null },
  ];

  const upperToolSet$g = [
    { type: 'banner', cssModifier: 'bookmark-folder-delete', text: 'Folder Delete' },
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
      this.page = template.page('bookmark-folder-delete');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$g);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('bookmark-folder-delete');
      this.dialog = template.divDialog('bookmark-folder-delete', dialogToolset$5);
      this.scroll.appendChild(this.dialog);
      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$g);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    deleteClick() {
      queue.publish('bookmark-folder-delete.confirm', this.folderName);
    }

    dialogClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-dialog');
      if (btn) {
        if (btn === this.btnDelete) {
          this.deleteClick();
        }
      }
    }

    folderToDelete(folderName) {
      this.folderName = folderName;
    }

    getElements() {
      this.banner = this.toolbarUpper.querySelector('.banner--bookmark-folder-delete');

      this.label = this.dialog.querySelector('.dialog-label');
      this.dialogBtns = this.dialog.querySelector('.dialog-btns');
      this.btnDelete = this.dialogBtns.querySelector('.btn-dialog--delete');

      this.btnBookmarkFolder = this.toolbarLower.querySelector('.btn-icon--bookmark-folder');
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
      queue.subscribe('bookmark-folder-delete.hide', () => {
        this.hide();
      });
      queue.subscribe('bookmark-folder-delete.show', () => {
        this.show();
      });

      queue.subscribe('folder.to.delete', (folderName) => {
        this.folderToDelete(folderName);
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBookmarkFolder) {
          queue.publish('bookmark-folder', null);
        }
      }
    }

    updateLabel() {
      this.label.innerHTML = `Delete Folder '${this.folderName}'?`;
    }

  }

  const dialogToolset$4 = [
    { type: 'label', text: 'Folder Name' },
    { type: 'input', ariaLabel: 'Name' },
    { type: 'btn', cssModifier: 'save', ariaLabel: null, label: 'Save' },
  ];

  const lowerToolSet$f = [
    { type: 'btn', icon: 'bookmark-folder', ariaLabel: null },
  ];

  const upperToolSet$f = [
    { type: 'banner', cssModifier: 'bookmark-folder-rename', text: 'Folder Rename'},
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
      this.page = template.page('bookmark-folder-rename');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$f);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('bookmark-folder-rename');
      this.dialog = template.divDialog('bookmark-folder-rename', dialogToolset$4);
      this.scroll.appendChild(this.dialog);

      this.message = template.element('div', 'message', 'bookmark-folder-rename', null, null);
      this.scroll.appendChild(this.message);

      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$f);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    dialogClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-dialog');
      if (btn) {
        if (btn === this.btnSave) {
          this.saveClick();
        }
      }
    }

    error(message) {
      this.message.textContent = message;
      this.message.classList.remove('hide');
    }

    folderToRename(folderName) {
      this.folderName = folderName;
    }

    getElements() {
      this.inputName = this.dialog.querySelector('.dialog-input');
      this.dialogBtns = this.dialog.querySelector('.dialog-btns');
      this.btnSave = this.dialogBtns.querySelector('.btn-dialog--save');

      this.btnBookmarkFolder = this.toolbarLower.querySelector('.btn-icon--bookmark-folder');
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
        this.inputName.blur();
        this.saveClick();
      }
    }

    saveClick() {
      const name = this.inputName.value;
      if (name) {
        this.namePkg.new = name;
        queue.publish('bookmark-folder-rename.save', this.namePkg);
      }
    }

    show() {
      this.page.classList.remove('page--hide');
      this.message.classList.add('hide');
      this.namePkg = {
        old: this.folderName,
      };
      this.inputName.value = this.folderName;
      this.inputName.focus();
    }

    subscribe() {
      queue.subscribe('bookmark-folder-rename.hide', () => {
        this.hide();
      });
      queue.subscribe('bookmark-folder-rename.show', (folderName) => {
        this.show(folderName);
      });

      queue.subscribe('bookmark.folder.rename.error', (message) => {
        this.error(message);
      });

      queue.subscribe('folder.to.rename', (folderName) => {
        this.folderToRename(folderName);
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBookmarkFolder) {
          queue.publish('bookmark-folder', null);
        }
      }
    }

  }

  const message = 'Select All and Copy the text below. ' +
    'Then Paste in a text editor and save the file.';

  const dialogToolset$3 = [
    { type: 'label', text: message },
    { type: 'textarea', ariaLabel: null, label: 'Bookmark Package' },
  ];

  const lowerToolSet$e = [
    { type: 'btn', icon: 'back', ariaLabel: null },
    { type: 'btn', icon: 'bookmark-folder', ariaLabel: null },
  ];

  const upperToolSet$e = [
    { type: 'banner', cssModifier: 'bookmark-export', text: 'Bookmark Export' },
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
      const bookmarkPkg = {};
      bookmarkPkg.tome = tomeLists.tomeName;
      bookmarkPkg.folders = [];
      for (const folder of this.folders) {
        const newFolder = {};
        newFolder.name = folder.name;
        newFolder.bookmarks = folder.bookmarks;
        bookmarkPkg.folders.push(newFolder);
      }
      return JSON.stringify(bookmarkPkg, null);
    }

    buildPage() {
      this.page = template.page('bookmark-export');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$e);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('bookmark-export');
      this.dialog = template.divDialog('bookmark-export', dialogToolset$3);
      this.scroll.appendChild(this.dialog);
      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$e);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    foldersUpdate(folders) {
      this.folders = folders;
    }

    getElements() {
      this.textarea = this.scroll.querySelector('.dialog-textarea');

      this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
      this.btnBookmarkFolder = this.toolbarLower.querySelector('.btn-icon--bookmark-folder');
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
      queue.subscribe('bookmark-export.hide', () => {
        this.hide();
      });
      queue.subscribe('bookmark-export.show', () => {
        this.show();
      });

      queue.subscribe('bookmark.folders.update', (folders) => {
        this.foldersUpdate(folders);
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBack) {
          queue.publish('bookmark.back', null);
        }  else if (btn === this.btnBookmarkFolder) {
          queue.publish('bookmark-folder', null);
        }
      }
    }

  }

  const dialogToolset$2 = [
    { type: 'label', text: 'Paste Bookmark Package Here:' },
    { type: 'textarea', ariaLabel: 'Bookmark Package' },
    { type: 'btn', cssModifier: 'import', ariaLabel: null, label: 'Import' },
  ];

  const lowerToolSet$d = [
    { type: 'btn', icon: 'back', ariaLabel: null },
    { type: 'btn', icon: 'bookmark-folder', ariaLabel: null },
  ];

  const upperToolSet$d = [
    { type: 'banner', cssModifier: 'bookmark-import', text: 'Bookmark Import' },
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
      this.page = template.page('bookmark-import');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$d);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('bookmark-import');
      this.dialog = template.divDialog('bookmark-import', dialogToolset$2);
      this.scroll.appendChild(this.dialog);

      this.message = template.element('div', 'message', 'bookmark-import', null, null);
      this.scroll.appendChild(this.message);
      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$d);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    dialogClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-dialog');
      if (btn) {
        if (btn === this.btnImport) {
          this.importClick();
        }
      }
    }

    error(message) {
      this.message.textContent = message;
      this.message.classList.remove('hide');
      if (message === 'Import successful.') {
        this.textarea.value = '';
      }
    }

    getElements() {
      this.textarea = this.scroll.querySelector('.dialog-textarea');
      this.dialogBtns = this.dialog.querySelector('.dialog-btns');
      this.btnImport = this.dialogBtns.querySelector('.btn-dialog--import');

      this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
      this.btnBookmarkFolder = this.toolbarLower.querySelector('.btn-icon--bookmark-folder');
    }

    importClick() {
      this.message.textContent = '';
      const pkgStr = this.textarea.value;
      if (pkgStr) {
        queue.publish('bookmark-import.import', pkgStr);
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
      this.message.classList.add('hide');
      this.page.classList.remove('page--hide');
    }

    subscribe() {
      queue.subscribe('bookmark-import.hide', () => {
        this.hide();
      });
      queue.subscribe('bookmark-import.message', (message) => {
        this.error(message);
      });
      queue.subscribe('bookmark-import.show', () => {
        this.show();
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBack) {
          queue.publish('bookmark.back', null);
        } else if (btn === this.btnBookmarkFolder) {
          queue.publish('bookmark-folder', null);
        }
      }
    }

  }

  class BookmarkController {

    constructor() {
      this.initialize();
    }

    activeFolderUpdate() {
      if (this.folderSelectPending) {
        this.folderSelectPending = false;
        queue.publish('bookmark.task.change', 'bookmark-list');
      }
    }

    back() {
      queue.publish('sidebar.change', 'none');
    }

    chapterIdxUpdate() {
      if (this.selectVerseIdx) {
        if (this.panes === 1 && this.sidebar !== 'none') {
          queue.publish('sidebar.select', 'none');
        }
        queue.publish('read.scroll-verse-idx', this.selectVerseIdx);
        this.selectVerseIdx = null;
      }
    }

    expandModeToggle() {
      queue.publish('bookmark.expand-mode.toggle', null);
    }

    exportPane() {
      queue.publish('bookmark.task.change', 'bookmark-export');
    }

    folderAdded() {
      queue.publish('bookmark.task.change', 'bookmark-list');
    }

    folderAddPane() {
      queue.publish('bookmark.task.change', 'bookmark-folder-add');
    }

    folderAddSave(name) {
      queue.publish('bookmark.folder.add', name);
    }

    folderDeleteConfirm(folderName) {
      queue.publish('bookmark.folder.delete', folderName);
      queue.publish('bookmark.task.change', 'bookmark-folder');
    }

    folderDeletePane(folderName) {
      queue.publish('folder.to.delete', folderName);
      queue.publish('bookmark.task.change', 'bookmark-folder-delete');
    }

    folderDown(folderName) {
      queue.publish('bookmark.folder.down', folderName);
    }

    folderPane() {
      queue.publish('bookmark.task.change', 'bookmark-folder');
    }

    folderRenamePane(folderName) {
      queue.publish('folder.to.rename', folderName);
      queue.publish('bookmark.task.change', 'bookmark-folder-rename');
    }

    folderRenamed() {
      queue.publish('bookmark.task.change', 'bookmark-folder');
    }

    folderRenameSave(namePkg) {
      queue.publish('bookmark.folder.rename', namePkg);
    }

    folderSelect(folderName) {
      this.folderSelectPending = true;
      queue.publish('bookmark.active-folder.change', folderName);
    }

    folderUp(folderName) {
      queue.publish('bookmark.folder.up', folderName);
    }

    gotoBookmark(verseIdx) {
      this.selectVerseIdx = verseIdx;
      const chapterIdx = chapterIdxByVerseIdx(verseIdx);
      queue.publish('chapterIdx.change', chapterIdx);
    }

    hide() {
      queue.publish(`${this.bookmarkTask}.hide`, null);
    }

    importImport(pkgStr) {
      queue.publish('bookmark.pkg.import', pkgStr);
    }

    importPane() {
      queue.publish('bookmark.task.change', 'bookmark-import');
    }

    initialize() {
      this.subscribe();
    }

    listDelete(verseIdx) {
      queue.publish('bookmark.delete', verseIdx);
    }

    listDown(verseIdx) {
      queue.publish('bookmark.down', verseIdx);
    }

    listPane() {
      queue.publish('bookmark.task.change', 'bookmark-list');
    }

    listSelect(verseIdx) {
      this.gotoBookmark(verseIdx);
    }

    listSortAscend() {
      queue.publish('bookmark.sort-ascend', null);
    }

    listSortInvert() {
      queue.publish('bookmark.sort-invert', null);
    }

    listUp(verseIdx) {
      queue.publish('bookmark.up', verseIdx);
    }

    moveCopyCopy(copyPkg) {
      queue.publish('bookmark.copy', copyPkg);
    }

    moveCopyMove(movePkg) {
      queue.publish('bookmark.move', movePkg);
    }

    moveCopyPane(verseIdx) {
      queue.publish('bookmark-move-copy.list.change', verseIdx);
      queue.publish('bookmark.move-copy.change', verseIdx);
    }

    moveCopyReady() {
      queue.publish('bookmark.task.change', 'bookmark-move-copy');
    }

    panesUpdate(panes) {
      this.panes = panes;
    }

    show() {
      queue.publish(`${this.bookmarkTask}.show`, null);
    }

    sidebarUpdate(sidebar) {
      this.sidebar = sidebar;
    }

    strongModeToggle() {
      queue.publish('bookmark.strong-mode.toggle', null);
    }

    strongSelect(verseIdx) {
      this.strongSelectPending = true;
      queue.publish('strong.verse.change', verseIdx);
    }

    strongVerseUpdate() {
      if (this.strongSelectPending) {
        this.strongSelectPending = false;
        queue.publish('sidebar.change', 'strong');
      }
    }

    subscribe() {
      queue.subscribe('bookmark-export', () => {
        this.exportPane();
      });

      queue.subscribe('bookmark-folder', () => {
        this.folderPane();
      });
      queue.subscribe('bookmark-folder.delete', (folderName) => {
        this.folderDeletePane(folderName);
      });
      queue.subscribe('bookmark-folder.down', (folderName) => {
        this.folderDown(folderName);
      });
      queue.subscribe('bookmark-folder.select', (folderName) => {
        this.folderSelect(folderName);
      });
      queue.subscribe('bookmark-folder.up', (folderName) => {
        this.folderUp(folderName);
      });

      queue.subscribe('bookmark-folder-add', () => {
        this.folderAddPane();
      });
      queue.subscribe('bookmark-folder-add.save', (name) => {
        this.folderAddSave(name);
      });

      queue.subscribe('bookmark-folder-delete.confirm', (folderName) => {
        this.folderDeleteConfirm(folderName);
      });

      queue.subscribe('bookmark-folder-rename', (folderName) => {
        this.folderRenamePane(folderName);
      });
      queue.subscribe('bookmark-folder-rename.save', (namePkg) => {
        this.folderRenameSave(namePkg);
      });

      queue.subscribe('bookmark-import', () => {
        this.importPane();
      });
      queue.subscribe('bookmark-import.import', (pkgStr) => {
        this.importImport(pkgStr);
      });

      queue.subscribe('bookmark-list', () => {
        this.listPane();
      });
      queue.subscribe('bookmark-list.delete', (verseIdx) => {
        this.listDelete(verseIdx);
      });
      queue.subscribe('bookmark-list.down', (verseIdx) => {
        this.listDown(verseIdx);
      });
      queue.subscribe('bookmark-list.expand-mode.click', () => {
        this.expandModeToggle();
      });
      queue.subscribe('bookmark-list.move-copy', (verseIdx) => {
        this.moveCopyPane(verseIdx);
      });
      queue.subscribe('bookmark-list.select', (verseIdx) => {
        this.listSelect(verseIdx);
      });
      queue.subscribe('bookmark-list.sort-ascend', () => {
        this.listSortAscend();
      });
      queue.subscribe('bookmark-list.sort-invert', () => {
        this.listSortInvert();
      });
      queue.subscribe('bookmark-list.strong-mode.click', () => {
        this.strongModeToggle();
      });
      queue.subscribe('bookmark-list.strong-select', (verseIdx) => {
        this.strongSelect(verseIdx);
      });
      queue.subscribe('bookmark-list.up', (verseIdx) => {
        this.listUp(verseIdx);
      });

      queue.subscribe('bookmark-move-copy.copy', (copyPkg) => {
        this.moveCopyCopy(copyPkg);
      });
      queue.subscribe('bookmark-move-copy.move', (movePkg) => {
        this.moveCopyMove(movePkg);
      });
      queue.subscribe('bookmark-move-copy.ready', () => {
        this.moveCopyReady();
      });

      queue.subscribe('bookmark.active-folder.update', () => {
        this.activeFolderUpdate();
      });
      queue.subscribe('bookmark.back', () => {
        this.back();
      });
      queue.subscribe('bookmark.copy', () => {
        this.listPane();
      });
      queue.subscribe('bookmark.folder.added', () => {
        this.folderAdded();
      });
      queue.subscribe('bookmark.folder.renamed', () => {
        this.folderRenamed();
      });
      queue.subscribe('bookmark.hide', () => {
        this.hide();
      });
      queue.subscribe('bookmark.move', () => {
        this.listPane();
      });
      queue.subscribe('bookmark.show', () => {
        this.show();
      });
      queue.subscribe('bookmark.task.update', (bookmarkTask) => {
        this.taskUpdate(bookmarkTask);
      });

      queue.subscribe('chapterIdx.update', () => {
        this.chapterIdxUpdate();
      });

      queue.subscribe('panes.update', (panes) => {
        this.panesUpdate(panes);
      });

      queue.subscribe('sidebar.update', (sidebar) => {
        this.sidebarUpdate(sidebar);
      });

      queue.subscribe('strong.verse.update', () => {
        this.strongVerseUpdate();
      });
    }

    taskUpdate(bookmarkTask) {
      if (this.sidebar === 'bookmark') {
        if (this.bookmarkTask !== bookmarkTask) {
          queue.publish(`${this.bookmarkTask}.hide`, null);
          this.bookmarkTask = bookmarkTask;
          queue.publish(`${this.bookmarkTask}.show`, null);
        }
      } else {
        this.bookmarkTask = bookmarkTask;
      }
    }

  }

  const binIdx = {};

  binIdx.tomeBinIdx = {
    wordCount: 0,
    verseCount: 1,
    books: 2,
    verses: 3,
  };

  binIdx.bookBinIdx = {
    bookIdx: 0,
    wordCount: 1,
    verseCount: 2,
    sliceStart: 3,
    sliceEnd: 4,
    chapters: 5,
  };

  binIdx.chapterBinIdx = {
    chapterIdx: 0,
    wordCount: 1,
    verseCount: 2,
    sliceStart: 3,
    sliceEnd: 4,
  };

  const numSort = (a, b) => a - b;

  // Credit: http://eddmann.com/posts/cartesian-product-in-javascript/
  const flatten = (arr) => [].concat.apply([], arr);
  const product = (sets) =>
    sets.reduce((acc, set) =>
      flatten(acc.map((x) => set.map((y) => [...x, y]))), [
      []
    ]);
  const firstSet = 0;
  const secondSet = 1;

  class SearchEngine {

    constructor() {
      this.initialize();
    }

    buildBins(verseIdx) {
      const tomeBin = this.rig.tomeBin;
      const versesLength = tomeBin[binIdx.tomeBinIdx.verses].length;
      tomeBin[binIdx.tomeBinIdx.wordCount] += this.verseCount;
      tomeBin[binIdx.tomeBinIdx.verseCount] += 1;

      const book = tomeLists.books.find(x => x[tomeIdx.book.lastVerseIdx] >= verseIdx);
      const bookIdx = tomeLists.books.indexOf(book);
      const chapter = tomeLists.chapters.find(x => x[tomeIdx.chapter.lastVerseIdx] >= verseIdx);
      const chapterIdx = tomeLists.chapters.indexOf(chapter);

      let bookBin = tomeBin[binIdx.tomeBinIdx.books].find(x => x[binIdx.bookBinIdx.bookIdx] === bookIdx);
      if (!bookBin) {
        const wordCount = 0;
        const verseCount = 0;
        const sliceStart = versesLength - 1;
        const sliceEnd = sliceStart;
        const chapters = [];
        tomeBin[binIdx.tomeBinIdx.books].push([
          bookIdx,
          wordCount,
          verseCount,
          sliceStart,
          sliceEnd,
          chapters,
        ]);
        bookBin = tomeBin[binIdx.tomeBinIdx.books][tomeBin[binIdx.tomeBinIdx.books].length - 1];
      }
      bookBin[binIdx.bookBinIdx.wordCount] += this.verseCount;
      bookBin[binIdx.bookBinIdx.verseCount] += 1;
      bookBin[binIdx.bookBinIdx.sliceEnd] += 1;

      let chapterBin = bookBin[binIdx.bookBinIdx.chapters].find((x) => x[binIdx.chapterBinIdx.chapterIdx] === chapterIdx);
      if (!chapterBin) {
        const wordCount = 0;
        const verseCount = 0;
        const sliceStart = versesLength - 1;
        const sliceEnd = sliceStart;
        bookBin[binIdx.bookBinIdx.chapters].push([
          chapterIdx,
          wordCount,
          verseCount,
          sliceStart,
          sliceEnd,
        ]);
        chapterBin = bookBin[binIdx.bookBinIdx.chapters][bookBin[binIdx.bookBinIdx.chapters].length - 1];
      }
      chapterBin[binIdx.chapterBinIdx.wordCount] += this.verseCount;
      chapterBin[binIdx.chapterBinIdx.verseCount] += 1;
      chapterBin[binIdx.chapterBinIdx.sliceEnd] += 1;
    }

    buildCombinations() {
      this.combinations = product(this.patterns);
    }

    buildIntersects() {
      const verses = new Set();
      for (const set of this.sets) {
        const intersect = this.intersectAll(set);
        for (const verse of [...intersect]) {
          verses.add(verse);
        }
      }
      this.intersects = [...verses].sort(numSort);
    }

    buildPatterns() {
      this.rig.wordStatus = 'OK';
      this.patterns = [];
      const missingTerms = [];
      for (const term of this.terms) {
        const re = new RegExp(`^${term.replace(/\*/g, '.*')}$`, this.testFlags);
        const words = tomeWords.filter(x => re.test(x));
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
      const allVerses = [...this.intersects].sort(numSort);
      const verseObjs = await tomeDb.verses.bulkGet(allVerses);
      for (const verseObj of verseObjs) {
        this.verseIdx = verseObj.k;
        const re = this.buildRegExp(this.searchTerms, this.flags);
        const text = verseObj.v[tomeIdx.verse.text].replace(/[!();:,.?-]/g, '');
        this.verseCount = (text.match(re) || []).length;
        if (this.verseCount > 0) {
          this.rig.tomeBin[binIdx.tomeBinIdx.verses].push(this.verseIdx);
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
          !this.searchTerms.match(/[^\p{L} ,'*-]/ui) &&
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

      const unique = [...new Set([].concat.apply([], this.combinations))].sort();
      this.wordObjs = await tomeDb.words.bulkGet(unique);

      const words = {};
      this.wordObjs.map(obj => words[obj.k] = obj.v);

      for (const combination of this.combinations) {
        const comboSets = [];
        for (const word of combination) {
          const verseKeys = words[word].map(x => x[tomeIdx.word.verseIdx]);
          comboSets.push(new Set(verseKeys));
        }
        this.sets.push(comboSets);
      }
    }

    buildWords() {
      const allVerses = [...this.intersects];
      for (const verseIdx of allVerses) {
        this.verseIdx = verseIdx;
        this.getVerseCount(verseIdx);
        if (this.verseCount > 0) {
          this.rig.tomeBin[binIdx.tomeBinIdx.verses].push(this.verseIdx);
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

    getVerseCount(verseIdx) {
      this.verseCount = 0;
      for (const wordVerseObj of this.wordObjs) {
        const verseCount = wordVerseObj.v.find(x => x[tomeIdx.word.verseIdx] === verseIdx);
        if (verseCount) {
          this.verseCount += verseCount[tomeIdx.word.count];
        }
      }
    }

    initialize() {
      return;
    }

    initializeTomeBin() {
      const wordCount = 0;
      const verseCount = 0;
      const books = [];
      const verses = [];
      this.rig.tomeBin = [
        wordCount,
        verseCount,
        books,
        verses,
      ];
    }

    intersectAll(...sets) {
      let intersect = null;
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
  }

  const searchResultReroute = [
    'search-filter', 'search-history',
  ];
  const validTasks$2 = [
    'search-result', 'search-lookup', 'search-filter', 'search-history',
  ];

  const DEFAULT_QUERY = 'day of the lord';

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
      queue.publish('search.filter.update', this.searchFilter);
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
      queue.publish('search.history.update', this.searchHistory);
    }

    historyClear() {
      this.searchHistory = [];
      this.updateHistory();
    }

    historyDelete(str) {
      const index = this.searchHistory.indexOf(str);
      this.searchHistory.splice(index, 1);
      this.updateHistory();
    }

    historyIsValid(searchHistory) {
      return searchHistory.some((x) => {
        return typeof x === 'string';
      });
    }

    initialize() {
      this.engine = new SearchEngine();
      this.subscribe();
    }

    modeChange(strongMode) {
      this.strongMode = strongMode;
      this.saveStrongMode();
      queue.publish('search.strong-mode.update', this.strongMode);
    }

    modeToogle() {
      this.modeChange(!this.strongMode);
    }

    async queryChange(searchQuery) {
      const rig = await this.engine.performSearch(searchQuery);
      if (rig.state === 'ERROR') {
        let message;
        if (rig.type === 'EMPTY') {
          message = 'Enter a search expression.';
        } else if (rig.type === 'INVALID') {
          message = 'Invalid query expression.';
        } else if (rig.wordStatus !== 'OK') {
          message = rig.wordStatus;
        }
        this.searchQuery = '';
        this.rig = null;
        queue.publish('search.query.error', message);
      } else {
        this.rig = rig;
        this.searchQuery = searchQuery;
        this.saveQuery();
        this.addHistory();
        await this.updateSearchVerseObjs();
        queue.publish('rig.update', this.rig);
        this.resetFilter();
        queue.publish('search.query.update', this.searchQuery);
      }
    }

    resetFilter() {
      const filter = this.tomeFilter();
      this.filterChange(filter);
    }

    async restore() {
      this.restoreTask();
      this.restoreHistory();
      await this.restoreQuery();
      this.restoreFilter();
      this.restoreMode();
    }

    restoreFilter() {
      const defaultFilter = this.tomeFilter();
      let searchFilter = localStorage.getItem('searchFilter');
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
      const defaultHistory = [];
      let searchHistory = localStorage.getItem('searchHistory');
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
      const defaultMode = false;
      let strongMode = localStorage.getItem('searchStrongMode');
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
      const defaultQuery = DEFAULT_QUERY;
      let searchQuery = localStorage.getItem('searchQuery');
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
      const defaultTask = 'search-result';
      let searchTask = localStorage.getItem('searchTask');
      if (!searchTask) {
        searchTask = defaultTask;
      } else {
        searchTask = JSON.parse(searchTask);
      }
      if (searchResultReroute.includes(searchTask)) {
        searchTask = 'search-result';
      } else if (!validTasks$2.includes(searchTask)) {
        searchTask = defaultTask;
      }
      this.taskChange(searchTask);
    }

    saveFilter() {
      localStorage.setItem('searchFilter',
        JSON.stringify(this.searchFilter));
    }

    saveHistory() {
      localStorage.setItem('searchHistory',
        JSON.stringify(this.searchHistory));
    }

    saveStrongMode() {
      localStorage.setItem('searchStrongMode',
        JSON.stringify(this.strongMode));
    }

    saveQuery() {
      localStorage.setItem('searchQuery',
        JSON.stringify(this.searchQuery));
    }

    saveTask() {
      localStorage.setItem('searchTask',
        JSON.stringify(this.searchTask));
    }

    subscribe() {
      queue.subscribe('name-mode.update', () => {
        this.queryChange(this.searchQuery);
      });

      queue.subscribe('search.filter.change', (filter) => {
        this.filterChange(filter);
      });

      queue.subscribe('search.history.clear', () => {
        this.historyClear();
      });
      queue.subscribe('search.history.delete', (query) => {
        this.historyDelete(query);
      });

      queue.subscribe('search.query.change', async (query) => {
        await this.queryChange(query);
      });

      queue.subscribe('search.restore', async () => {
        await this.restore();
      });
      queue.subscribe('search.strong-mode.toggle', () => {
        this.modeToogle();
      });
      queue.subscribe('search.task.change', (searchTask) => {
        this.taskChange(searchTask);
      });
    }

    taskChange(searchTask) {
      this.searchTask = searchTask;
      this.saveTask();
      queue.publish('search.task.update', this.searchTask);
    }

    tomeFilter() {
      return {
        bookIdx: -1,
        chapterIdx: -1,
      };
    }

    updateHistory() {
      this.saveHistory();
      queue.publish('search.history.update', this.searchHistory);
    }

    async updateSearchVerseObjs() {
      if (this.rig === null) {
        return;
      }
      this.searchVerseObjs = await tomeDb.verses.bulkGet(this.rig.tomeBin[binIdx.tomeBinIdx.verses]);
      queue.publish('search.verse-objs.update', this.searchVerseObjs);
    }

  }

  const lowerToolSet$c = [
    { type: 'btn', icon: 'back', ariaLabel: null },
    { type: 'btn', icon: 'search-lookup', ariaLabel: null },
    { type: 'btn', icon: 'filter', ariaLabel: null },
    { type: 'btn', icon: 'history', ariaLabel: null },
    { type: 'btn', icon: 'strong-mode', ariaLabel: null },
  ];

  const upperToolSet$c = [
    { type: 'btn-banner', cssModifier: 'search-result', text: 'Toogle Clipboard' },
  ];

  const localBinIdx$1 = 0;
  const loadIncrement$1 = 50;

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
      this.toolbarUpper.addEventListener('click', (event) => {
        this.toolbarUpperClick(event);
      });
    }

    applyFilter() {
      const tomeBin = this.rig.tomeBin;
      const bookIdx = this.searchFilter.bookIdx;
      const chapterIdx = this.searchFilter.chapterIdx;
      if (bookIdx === -1 && chapterIdx === -1) {
        this.filteredVerses = tomeBin[binIdx.tomeBinIdx.verses];
        this.wordCount = tomeBin[binIdx.tomeBinIdx.wordCount];
        this.verseCount = tomeBin[binIdx.tomeBinIdx.verseCount];
        this.citation = tomeLists.tomeName;
      } else {
        const books = tomeBin[binIdx.tomeBinIdx.books];
        const bookBin = this.findBin(books, bookIdx);
        if (chapterIdx === -1) {
          this.filteredVerses = tomeBin[binIdx.tomeBinIdx.verses].slice(bookBin[binIdx.bookBinIdx.sliceStart], bookBin[binIdx.bookBinIdx.sliceEnd]);
          this.wordCount = bookBin[binIdx.bookBinIdx.wordCount];
          this.verseCount = bookBin[binIdx.bookBinIdx.verseCount];
          this.citation = tomeLists.books[bookIdx][tomeIdx.book.longName];
        } else {
          const chapters = bookBin[binIdx.bookBinIdx.chapters];
          const chapterBin = this.findBin(chapters, chapterIdx);
          this.filteredVerses = tomeBin[binIdx.tomeBinIdx.verses].slice(chapterBin[binIdx.chapterBinIdx.sliceStart], chapterBin[binIdx.chapterBinIdx.sliceEnd]);
          this.wordCount = chapterBin[binIdx.chapterBinIdx.wordCount];
          this.verseCount = chapterBin[binIdx.chapterBinIdx.verseCount];
          this.citation = tomeLists.chapters[chapterIdx][tomeIdx.chapter.name];
        }
      }
    }

    buildPage() {
      this.page = template.page('search-result');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$c);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('search-result');
      this.list = template.element('div', 'list', 'search-result', null, null);
      this.scroll.appendChild(this.list);

      this.loadMore = template.element('div', 'load-more', 'search-result', null, null);
      this.btnLoadMore = document.createElement('div');
      this.btnLoadMore.classList.add('btn-load-more');
      this.btnLoadMore.textContent = 'Load More';
      this.loadMore.appendChild(this.btnLoadMore);
      this.scroll.appendChild(this.loadMore);

      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$c);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    buildRefSpan(verseObj) {
      const refSpan = document.createElement('span');
      refSpan.classList.add('font--bold');
      refSpan.textContent = verseObj.v[tomeIdx.verse.citation] + ' ';
      return refSpan;
    }

    buildVerse(verseObj) {
      const btn = document.createElement('div');
      btn.classList.add('btn-result');
      btn.dataset.verseIdx = verseObj.k;
      const searchText = document.createElement('span');
      searchText.classList.add('span-result-text');
      const acrostic = template.acrostic(verseObj);
      const ref = this.buildRefSpan(verseObj);
      const text = document.createTextNode(verseObj.v[tomeIdx.verse.text]);
      searchText.appendChild(ref);
      if (acrostic) {
        searchText.appendChild(acrostic);
      }
      searchText.appendChild(text);
      btn.appendChild(searchText);
      return btn;
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

    changeFontVariant() {
      if (this.lastFontVariant) {
        this.list.classList.remove(this.lastFontVariant);
      }
      this.list.classList.add(this.fontVariant);
    }

    clearResults() {
      this.btnBanner.classList.add('btn-banner--search-result-error');
      this.btnBanner.innerHTML = 'Query Error';
      util.removeAllChildren(this.list);
      this.loadMore.classList.add('hide');
    }

    filterUpdate(searchFilter) {
      this.searchFilter = searchFilter;
      if (this.rig) {
        if (this.rig.state === 'OK') {
          this.applyFilter();
        }
        this.updateBanner();
        this.updateResult();
      }
    }

    findBin(bins, idx) {
      return bins.find((bin) => {
        return bin[localBinIdx$1] === idx;
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

    fontVariantUpdate(fontVariant) {
      this.fontVariant = fontVariant;
      this.changeFontVariant();
      this.lastFontVariant = fontVariant;
    }

    getElements() {
      this.btnBanner = this.toolbarUpper.querySelector('.btn-banner--search-result');

      this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
      this.btnLookup = this.toolbarLower.querySelector('.btn-icon--search-lookup');
      this.btnFilter = this.toolbarLower.querySelector('.btn-icon--filter');
      this.btnHistory = this.toolbarLower.querySelector('.btn-icon--history');
      this.btnStrongMode = this.toolbarLower.querySelector('.btn-icon--strong-mode');
    }

    hide() {
      this.page.classList.add('page--hide');
    }

    initialize() {
      this.buildPage();
      this.getElements();
      this.addListeners();
      this.subscribe();
      this.rig = null;
      this.lastFont = null;
      this.lastFontSize = null;
      this.lastFontVariant = null;
      this.clipboardMode = false;
    }

    listClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div');
      if (btn) {
        if (this.clipboardMode) {
          const text = btn.textContent;
          util.writeClipboardText(text);
        } else {
          const verseIdx = parseInt(btn.dataset.verseIdx);
          if (this.strongMode) {
            queue.publish('search-result.strong-select', verseIdx);
          } else {
            queue.publish('search-result.read-select', verseIdx);
          }
        }
      }
    }

    loadMoreClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-load-more');
      if (btn) {
        if (btn === this.btnLoadMore) {
          this.loadVerses();
        }
      }
    }

    loadVerses() {
      let verses;
      if (this.verseCount <= loadIncrement$1) {
        verses = this.filteredVerses;
        this.loadIdx = this.verseCount;
      } else {
        const sliceEnd = Math.min(this.loadIdx + loadIncrement$1, this.verseCount);
        verses = this.filteredVerses.slice(this.loadIdx, sliceEnd);
        this.loadIdx = sliceEnd;
      }

      const fragment = document.createDocumentFragment();
      const verseObjs = this.searchVerseObjs.filter(x => verses.includes(x.k));
      for (const verseObj of verseObjs) {
        const verse = this.buildVerse(verseObj);
        fragment.appendChild(verse);
      }
      this.list.appendChild(fragment);

      if (this.loadIdx < this.verseCount) {
        this.loadMore.classList.remove('hide');
      } else {
        this.loadMore.classList.add('hide');
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

    rigUpdate(rig) {
      this.rig = rig;
      this.query = this.rig.query;
    }

    show() {
      this.page.classList.remove('page--hide');
    }

    subscribe() {
      queue.subscribe('font.update', (font) => {
        this.fontUpdate(font);
      });

      queue.subscribe('font-size.update', (fontSize) => {
        this.fontSizeUpdate(fontSize);
      });

      queue.subscribe('font-variant.update', (fontVariant) => {
        this.fontVariantUpdate(fontVariant);
      });

      queue.subscribe('rig.update', (rig) => {
        this.rigUpdate(rig);
      });

      queue.subscribe('search-result.hide', () => {
        this.hide();
      });
      queue.subscribe('search-result.show', () => {
        this.show();
      });

      queue.subscribe('search.filter.update', (searchFilter) => {
        this.filterUpdate(searchFilter);
      });
      queue.subscribe('search.query.error', () => {
        this.clearResults();
      });
      queue.subscribe('search.strong-mode.update', (strongMode) => {
        this.modeUpdate(strongMode);
      });
      queue.subscribe('search.verse-objs.update', (searchVerseObjs) => {
        this.versesUpdate(searchVerseObjs);
      });
    }

    toogleClipboardMode() {
      if (this.clipboardMode) {
        this.btnBanner.classList.remove('btn-banner--active');
      } else {
        this.btnBanner.classList.add('btn-banner--active');
      }
      this.clipboardMode = !this.clipboardMode;
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBack) {
          queue.publish('search.back', null);
        } else if (btn === this.btnLookup) {
          queue.publish('search-lookup', null);
        } else if (btn === this.btnFilter) {
          queue.publish('search-filter', null);
        } else if (btn === this.btnHistory) {
          queue.publish('search-history', null);
        } else if (btn === this.btnStrongMode) {
          queue.publish('search.strong-mode.click', null);
        }
      }
    }

    toolbarUpperClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-banner');
      if (btn) {
        if (btn === this.btnBanner) {
          this.toogleClipboardMode();
        }
      }
    }

    updateBanner() {
      this.btnBanner.classList.remove('btn-banner--search-result-error');
      this.btnBanner.innerHTML = `${this.citation} ` +
        `(${this.wordCount}/${this.verseCount})<br>` +
        `${this.rig.query}`;
    }

    updateResult() {
      this.scroll.scrollTop = 0;
      util.removeAllChildren(this.list);
      if (
        this.rig !== null &&
        this.rig.state === 'OK'
      ) {
        this.loadIdx = 0;
        this.loadedVerses = 0;
        this.loadVerses();
      }
    }

    versesUpdate(searchVerseObjs) {
      this.searchVerseObjs = searchVerseObjs;
      this.updateResult();
    }

  }

  const lowerToolSet$b = [
    { type: 'btn', icon: 'back', ariaLabel: null },
    { type: 'btn', icon: 'search-lookup', ariaLabel: null },
    { type: 'btn', icon: 'result', ariaLabel: null },
    { type: 'btn', icon: 'history', ariaLabel: null },
  ];

  const upperToolSet$b = [
    { type: 'banner', cssModifier: 'search-filter', text: null },
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
      const bookIdx = bookBin[binIdx.bookBinIdx.bookIdx];
      const wordCount = bookBin[binIdx.bookBinIdx.wordCount];
      const verseCount = bookBin[binIdx.bookBinIdx.verseCount];
      const citation = tomeLists.books[bookIdx][tomeIdx.book.longName];

      const bookFilter = document.createElement('div');
      bookFilter.classList.add('filter', 'filter--book');

      const btnUnfold = template.btnIcon('next', 'filter-next', null);
      btnUnfold.dataset.bookIdx = bookIdx;
      bookFilter.appendChild(btnUnfold);

      const btnFold = template.btnIcon('down', 'filter-down', null);
      btnFold.classList.add('hide');
      btnFold.dataset.bookIdx = bookIdx;
      bookFilter.appendChild(btnFold);

      const btnFilter = document.createElement('div');
      btnFilter.classList.add('btn-filter', 'btn-filter--book');
      btnFilter.textContent = `${citation} (${wordCount}/${verseCount})`;
      btnFilter.dataset.bookIdx = bookIdx;
      btnFilter.dataset.chapterIdx = -1;
      bookFilter.appendChild(btnFilter);

      return bookFilter;
    }

    buildChapterFilter(bookBin, chapterBin) {
      const bookIdx = bookBin[binIdx.bookBinIdx.bookIdx];
      const chapterIdx = chapterBin[binIdx.chapterBinIdx.chapterIdx];
      const wordCount = chapterBin[binIdx.chapterBinIdx.wordCount];
      const verseCount = chapterBin[binIdx.chapterBinIdx.verseCount];
      const citation = tomeLists.chapters[chapterIdx][tomeIdx.chapter.name];

      const btnFilter = document.createElement('div');
      btnFilter.classList.add('btn-filter', 'btn-filter--chapter',
        'hide');
      btnFilter.textContent = `${citation} (${wordCount}/${verseCount})`;
      btnFilter.dataset.bookIdx = bookIdx;
      btnFilter.dataset.chapterIdx = chapterIdx;

      return btnFilter;
    }

    buildFilters() {
      const fragment = document.createDocumentFragment();
      const tomeBin = this.rig.tomeBin;
      const tomeFilter = this.buildTomeFilter(tomeBin);
      fragment.appendChild(tomeFilter);
      const books = tomeBin[binIdx.tomeBinIdx.books];
      for (const bookBin of books) {
        const bookFilter = this.buildBookFilter(bookBin);
        fragment.appendChild(bookFilter);
        const chapters = bookBin[binIdx.bookBinIdx.chapters];
        for (const chapterBin of chapters) {
          const chapterFilter = this.buildChapterFilter(bookBin, chapterBin);
          fragment.appendChild(chapterFilter);
        }
      }
      return fragment;
    }

    buildPage() {
      this.page = template.page('search-filter');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$b);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('search-filter');
      this.list = template.element('div', 'list', 'search-filter', null, null);
      this.scroll.appendChild(this.list);
      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$b);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    buildTomeFilter(tomeBin) {
      const citation = tomeLists.tomeName;
      const wordCount = tomeBin[binIdx.tomeBinIdx.wordCount];
      const verseCount = tomeBin[binIdx.tomeBinIdx.verseCount];

      const btnFilter = document.createElement('div');
      btnFilter.classList.add('btn-filter', 'btn-filter--tome');
      btnFilter.textContent = `${citation} (${wordCount}/${verseCount})`;
      btnFilter.dataset.bookIdx = -1;
      btnFilter.dataset.chapterIdx = -1;

      return btnFilter;
    }

    clearFilter() {
      this.banner.innerHTML = 'Query Error';
      util.removeAllChildren(this.list);
    }

    filterClick(btnFilter) {
      const bookIdx = parseInt(btnFilter.dataset.bookIdx);
      const chapterIdx = parseInt(btnFilter.dataset.chapterIdx);
      const searchFilter = {
        bookIdx: bookIdx,
        chapterIdx: chapterIdx,
      };
      queue.publish('search-filter.select', searchFilter);
    }

    filterUpdate(searchFilter) {
      this.searchFilter = searchFilter;
      this.updateActiveFilter();
    }

    foldClick(btnFold) {
      const bookIdxStr = btnFold.dataset.bookIdx;
      const chapters = this.list.querySelectorAll(`.btn-filter--chapter[data-book-idx="${bookIdxStr}"]`
      );
      for (const chapter of chapters) {
        chapter.classList.add('hide');
      }
      btnFold.classList.add('hide');
      const btnUnfold = btnFold.previousSibling;
      btnUnfold.classList.remove('hide');
    }

    getElements() {
      this.banner = this.toolbarUpper.querySelector('.banner--search-filter');

      this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
      this.btnLookup = this.toolbarLower.querySelector('.btn-icon--search-lookup');
      this.btnResult = this.toolbarLower.querySelector('.btn-icon--result');
      this.btnHistory = this.toolbarLower.querySelector('.btn-icon--history');
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
      const btn = event.target.closest('div');
      if (btn) {
        if (btn.classList.contains('btn-filter')) {
          this.filterClick(btn);
        } else if (btn.classList.contains('btn-icon--filter-down')) {
          this.foldClick(btn);
        } else if (btn.classList.contains('btn-icon--filter-next')) {
          this.unfoldClick(btn);
        }
      }
    }

    rigUpdate(rig) {
      this.rig = rig;
      this.updateBanner();
      this.updateFilters();
    }

    show() {
      this.page.classList.remove('page--hide');
    }

    subscribe() {
      queue.subscribe('rig.update', (rig) => {
        this.rigUpdate(rig);
      });

      queue.subscribe('search-filter.hide', () => {
        this.hide();
      });
      queue.subscribe('search-filter.show', () => {
        this.show();
      });

      queue.subscribe('search.filter.update', (filter) => {
        this.filterUpdate(filter);
      });
      queue.subscribe('search.query.error', () => {
        this.clearFilter();
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBack) {
          queue.publish('search.back', null);
        } else if (btn === this.btnLookup) {
          queue.publish('search-lookup', null);
        } else if (btn === this.btnResult) {
          queue.publish('search-result', null);
        } else if (btn === this.btnHistory) {
          queue.publish('search-history', null);
        }
      }
    }

    unfoldClick(btnUnfold) {
      const bookIdxStr = btnUnfold.dataset.bookIdx;
      const chapters = this.list.querySelectorAll(`.btn-filter--chapter[data-book-idx="${bookIdxStr}"]`
      );
      for (const chapter of chapters) {
        chapter.classList.remove('hide');
      }
      btnUnfold.classList.add('hide');
      const btnFold = btnUnfold.nextSibling;
      btnFold.classList.remove('hide');
    }

    updateActiveFilter() {
      if (this.btnActiveFilter) {
        this.btnActiveFilter.classList.remove('btn-filter--active');
      }
      const bookIdx = this.searchFilter.bookIdx;
      const chapterIdx = this.searchFilter.chapterIdx;
      const query = `.btn-filter[data-book-idx="${bookIdx}"]` +
        `[data-chapter-idx="${chapterIdx}"]`;
      const btn = this.list.querySelector(query);
      if (btn) {
        this.btnActiveFilter = btn;
        btn.classList.add('btn-filter--active');
      }
    }

    updateBanner() {
      this.banner.innerHTML = `${this.rig.query}`;
    }

    updateFilters() {
      this.scroll.scrollTop = 0;
      util.removeAllChildren(this.list);
      if (this.rig.state === 'OK') {
        const list = this.buildFilters();
        this.list.appendChild(list);
      }
    }

  }

  const lowerToolSet$a = [
    { type: 'btn', icon: 'back', ariaLabel: null },
    { type: 'btn', icon: 'search-lookup', ariaLabel: null },
    { type: 'btn', icon: 'result', ariaLabel: null },
    { type: 'btn', icon: 'filter', ariaLabel: null },
    { type: 'btn', icon: 'history-clear', ariaLabel: null },
  ];

  const upperToolSet$a = [
    { type: 'banner', cssModifier: 'search-history', text: 'Search History' },
  ];

  class SearchHistoryView {

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

    buildEntry(query, idx) {
      const entry = document.createElement('div');
      entry.classList.add('entry', 'entry--history');
      const btnEntry = document.createElement('div');
      btnEntry.classList.add('btn-entry', 'btn-entry--history');
      btnEntry.dataset.historyIdx = idx;
      btnEntry.textContent = query;
      entry.appendChild(btnEntry);
      const btnDelete = template.btnIcon('delete', 'delete', null);
      entry.appendChild(btnDelete);
      return entry;
    }

    buildPage() {
      this.page = template.page('search-history');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$a);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('search-history');
      this.empty = template.element('div', 'empty', 'search-history', null, 'No Searches Saved');
      this.scroll.appendChild(this.empty);

      this.list = template.element('div', 'list', 'search-history', null, null);
      this.scroll.appendChild(this.list);

      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$a);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    getElements() {
      this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
      this.btnLookup = this.toolbarLower.querySelector('.btn-icon--search-lookup');
      this.btnResult = this.toolbarLower.querySelector('.btn-icon--result');
      this.btnFilter = this.toolbarLower.querySelector('.btn-icon--filter');
      this.btnHistoryClear = this.toolbarLower.querySelector('.btn-icon--history-clear');
    }

    hide() {
      this.page.classList.add('page--hide');
    }

    historyUpdate(history) {
      this.history = history;
      this.updateHistory();
    }

    initialize() {
      this.buildPage();
      this.getElements();
      this.addListeners();
      this.subscribe();
    }

    listClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div');
      if (btn) {
        if (btn.classList.contains('btn-entry--history')) {
          const query = btn.textContent;
          queue.publish('search-history.select', query);
        } else if (btn.classList.contains('btn-icon--delete')) {
          const entry = btn.previousSibling;
          const query = entry.textContent;
          queue.publish('search-history.delete', query);
        }
      }
    }

    show() {
      this.page.classList.remove('page--hide');
    }

    subscribe() {
      queue.subscribe('search.query.error', () => {
        queue.publish('search-lookup', null);
      });

      queue.subscribe('search-history.hide', () => {
        this.hide();
      });
      queue.subscribe('search-history.show', () => {
        this.show();
      });

      queue.subscribe('search.history.update', (history) => {
        this.historyUpdate(history);
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBack) {
          queue.publish('search.back', null);
        } else if (btn === this.btnLookup) {
          queue.publish('search-lookup', null);
        } else if (btn === this.btnResult) {
          queue.publish('search-result', null);
        } else if (btn === this.btnFilter) {
          queue.publish('search-filter', null);
        } else if (btn === this.btnHistoryClear) {
          queue.publish('search-history.clear', null);
        }
      }
    }

    updateHistory() {
      const scrollSave = this.scroll.scrollTop;
      util.removeAllChildren(this.list);
      if (this.history.length === 0) {
        this.empty.classList.remove('hide');
      } else {
        this.empty.classList.add('hide');
        const fragment = document.createDocumentFragment();
        for (const query of this.history) {
          const entry = this.buildEntry(query);
          fragment.appendChild(entry);
        }
        this.list.appendChild(fragment);
      }
      this.scroll.scrollTop = scrollSave;
    }

  }

  const dialogToolset$1 = [
    { type: 'label', text: 'Query' },
    { type: 'input', ariaLabel: 'Query' },
    { type: 'btn', cssModifier: 'search', ariaLabel: null, label: 'Search' },
  ];

  const lowerToolSet$9 = [
    { type: 'btn', icon: 'back', ariaLabel: null },
    { type: 'btn', icon: 'result', ariaLabel: null },
    { type: 'btn', icon: 'filter', ariaLabel: null },
    { type: 'btn', icon: 'history', ariaLabel: null },
  ];

  const upperToolSet$9 = [
    { type: 'banner', cssModifier: 'search-lookup', text: 'Search Lookup' },
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
      this.page = template.page('search-lookup');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$9);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('search-lookup');
      this.dialog = template.divDialog('search-lookup', dialogToolset$1);
      this.scroll.appendChild(this.dialog);

      this.message = template.element('div', 'message', 'search-lookup', null, null);
      this.scroll.appendChild(this.message);

      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$9);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    dialogClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-dialog');
      if (btn) {
        if (btn === this.btnSearch) {
          this.searchClick();
        }
      }
    }

    error(message) {
      this.queryError = true;
      this.message.textContent = message;
      this.message.classList.remove('hide');
    }

    getElements() {
      this.inputQuery = this.dialog.querySelector('.dialog-input');
      this.dialogBtns = this.dialog.querySelector('.dialog-btns');
      this.btnSearch = this.dialogBtns.querySelector('.btn-dialog--search');

      this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
      this.btnResult = this.toolbarLower.querySelector('.btn-icon--result');
      this.btnFilter = this.toolbarLower.querySelector('.btn-icon--filter');
      this.btnHistory = this.toolbarLower.querySelector('.btn-icon--history');
    }

    hide() {
      this.page.classList.add('page--hide');
    }

    initialize() {
      this.buildPage();
      this.getElements();
      this.addListeners();
      this.subscribe();
      this.queryError = false;
      this.searchHistorySelect = false;
    }

    inputKeyDown(event) {
      if (event.key === 'Enter') {
        this.inputQuery.blur();
        this.searchClick();
      }
    }

    searchClick() {
      const query = this.inputQuery.value;
      queue.publish('search-lookup.search', query);
    }

    show() {
      if (
        this.searchHistorySelect === true &&
        this.queryError === true
      ) {
        this.inputQuery.value = this.searchQuery;
        this.searchHistorySelect = false;
        this.queryError = false;
      } else {
        this.inputQuery.value = '';
        this.error.textContent = '';
        this.message.textContent = '';
        this.message.classList.add('hide');
      }
      this.page.classList.remove('page--hide');
      this.inputQuery.focus();
    }

    subscribe() {
      queue.subscribe('search.query.change', (searchQuery) => {
        this.searchQuery = searchQuery;
      });
      queue.subscribe('search.query.error', (message) => {
        this.error(message);
      });

      queue.subscribe('search-history.select', () => {
        this.searchHistorySelect = true;    });
      queue.subscribe('search-lookup.hide', () => {
        this.hide();
      });
      queue.subscribe('search-lookup.show', () => {
        this.show();
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBack) {
          queue.publish('search.back', null);
        } else if (btn === this.btnResult) {
          queue.publish('search-result', null);
        } else if (btn === this.btnFilter) {
          queue.publish('search-filter', null);
        } else if (btn === this.btnHistory) {
          queue.publish('search-history', null);
        }
      }
    }

  }

  class SearchController {

    constructor() {
      this.initialize();
    }

    back() {
      queue.publish('sidebar.change', 'none');
    }

    chapterIdxUpdate() {
      if (this.selectVerseIdx) {
        if (this.panes === 1 && this.sidebar !== 'none') {
          queue.publish('sidebar.select', 'none');
        }
        queue.publish('read.scroll-verse-idx', this.selectVerseIdx);
        this.selectVerseIdx = null;
      }
    }

    filterPane() {
      queue.publish('search.task.change', 'search-filter');
    }

    filterSelect(searchFilter) {
      this.filterSelectPending = true;
      queue.publish('search.filter.change', searchFilter);
    }

    filterUpdate() {
      if (this.filterSelectPending) {
        this.filterSelectPending = false;
        queue.publish('search.task.change', 'search-result');
      }
    }

    hide() {
      queue.publish(`${this.searchTask}.hide`, null);
    }

    historyClear() {
      queue.publish('search.history.clear', null);
    }

    historyDelete(query) {
      queue.publish('search.history.delete', query);
    }

    historyPane() {
      queue.publish('search.task.change', 'search-history');
    }

    historySelect(query) {
      this.historySelectPending = true;
      queue.publish('search.query.change', query);
    }

    historyUpdate() {
      if (this.historySelectPending) {
        this.historySelectPending = false;
        queue.publish('search.task.change', 'search-result');
      }
    }

    initialize() {
      this.subscribe();
    }

    lookupPane() {
      queue.publish('search.task.change', 'search-lookup');
    }

    lookupSearch(query) {
      queue.publish('search.query.change', query);
    }

    modeToggle() {
      queue.publish('search.strong-mode.toggle', null);
    }

    panesUpdate(panes) {
      this.panes = panes;
    }

    queryChange() {
      this.queryChangePending = true;
    }

    queryUpdate() {
      if (this.queryChangePending) {
        queue.publish('search.task.change', 'search-result');
      }
    }

    readSelect(verseIdx) {
      this.selectVerseIdx = verseIdx;
      const chapterIdx = chapterIdxByVerseIdx(verseIdx);
      queue.publish('chapterIdx.change', chapterIdx);
    }

    resultPane() {
      queue.publish('search.task.change', 'search-result');
    }

    show() {
      queue.publish(`${this.searchTask}.show`, null);
    }

    sidebarUpdate(sidebar) {
      this.sidebar = sidebar;
    }

    strongSelect(verseIdx) {
      this.strongSelectPending = true;
      queue.publish('strong.verse.change', verseIdx);
    }

    strongVerseUpdate() {
      if (this.strongSelectPending) {
        this.strongSelectPending = false;
        queue.publish('sidebar.change', 'strong');
      }
    }

    subscribe() {
      queue.subscribe('chapterIdx.update', () => {
        this.chapterIdxUpdate();
      });

      queue.subscribe('panes.update', (panes) => {
        this.panesUpdate(panes);
      });

      queue.subscribe('search-filter', () => {
        this.filterPane();
      });
      queue.subscribe('search-filter.select', (searchFilter) => {
        this.filterSelect(searchFilter);
      });

      queue.subscribe('search-history', () => {
        this.historyPane();
      });
      queue.subscribe('search-history.clear', () => {
        this.historyClear();
      });
      queue.subscribe('search-history.delete', (query) => {
        this.historyDelete(query);
      });
      queue.subscribe('search-history.select', (query) => {
        this.historySelect(query);
      });

      queue.subscribe('search-lookup', () => {
        this.lookupPane();
      });
      queue.subscribe('search-lookup.search', (query) => {
        this.lookupSearch(query);
      });

      queue.subscribe('search-result', () => {
        this.resultPane();
      });
      queue.subscribe('search-result.read-select', (verseIdx) => {
        this.readSelect(verseIdx);
      });
      queue.subscribe('search-result.strong-select', (verseIdx) => {
        this.strongSelect(verseIdx);
      });

      queue.subscribe('search.back', () => {
        this.back();
      });
      queue.subscribe('search.filter.update', () => {
        this.filterUpdate();
      });
      queue.subscribe('search.hide', () => {
        this.hide();
      });
      queue.subscribe('search.history.update', () => {
        this.historyUpdate();
      });
      queue.subscribe('search.query.change', () => {
        this.queryChange();
      });
      queue.subscribe('search.query.update', () => {
        this.queryUpdate();
      });
      queue.subscribe('search.show', () => {
        this.show();
      });
      queue.subscribe('search.strong-mode.click', () => {
        this.modeToggle();
      });
      queue.subscribe('search.task.update', (searchTask) => {
        this.taskUpdate(searchTask);
      });

      queue.subscribe('sidebar.update', (sidebar) => {
        this.sidebarUpdate(sidebar);
      });

      queue.subscribe('strong.verse.update', () => {
        this.strongVerseUpdate();
      });
    }

    taskUpdate(searchTask) {
      if (this.sidebar === 'search') {
        if (this.searchTask !== searchTask) {
          queue.publish(`${this.searchTask}.hide`, null);
          this.searchTask = searchTask;
          queue.publish(`${this.searchTask}.show`, null);
        }
      } else {
        this.searchTask = searchTask;
      }
    }

  }

  const strongIdx = {};

  strongIdx.def = {
    lemma: 0,
    tranliteration: 1,
    pronunciation: 2,
    deriv: 3,
    strongDef: 4,
    kjvDef: 5,
  };

  strongIdx.map = {
    verseFragment: 0,
    strongNums: 1,
  };

  strongIdx.word = {
    tomeWord: 0,
    tomeBin: 1,
  };

  const strongSetup = {
    name: 'strong_dict',
    stores: {
      dict: 'k',
    },
    url: '/json/strong_dict.json',
    version: '2024-05-09',
  };

  const strongCitations = {};
  let strongDictDb = null;
  let strongNums = null;

  const initializeStrongDictDb = async () => {
    progress('');
    progress('* strong dictionary database *');
    progress('');
    strongDictDb = await dbUtil.versionCheck(strongSetup);
    await populateStrong();
    await loadStrongCitations();
    await loadStrongNums();
    progress('strong initialized.');
  };

  const loadStrongCitations = async () => {
    progress('loading strong citations...');
    const defObjs = await strongDictDb.dict.toArray();
    defObjs.map(x => strongCitations[x.k] = x.v[strongIdx.def.tranliteration]);
  };

  const loadStrongNums = async () => {
    progress('loading strong numbers...');
    const strongDictObjs = await strongDictDb.dict.toArray();
    strongNums = strongDictObjs.map(x => x.k);
  };

  const populateStrong = async () => {
    const dictCount = await strongDictDb.dict.count();
    if (dictCount === 0) {
      const data = await dbUtil.fetchJson(strongSetup.url);

      progress('populating dict...');
      await strongDictDb.dict.bulkAdd(data);
      progress('population complete.');
    } else {
      progress('strong dictionary already populated.');
    }
  };

  const strongDefReroute = [
    'strong-history', 'strong-lookup',
  ];
  const strongResultReroute = [
    'strong-filter',
  ];
  const validTasks$1 = [
    'strong-def', 'strong-verse', 'strong-result',
  ];

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

    chainAdd() {
      this.strongChain.push(this.strongDef);
      this.updateChain();
    }

    chainChange(strongChain) {
      this.strongChain = strongChain;
      this.updateChain();
      queue.publish('strong.chain.update', this.strongChain);
    }

    chainClear() {
      this.strongChain = [];
      this.updateChain();
    }

    chainIsValid(strongChain) {
      return strongChain.some((x) => {
        return typeof x === 'string';
      });
    }

    chainPrev() {
      if (this.strongChain.length == 0) {
        return;
      }
      const strongDef = this.strongChain.pop();
      this.updateChain();
      this.defChange(strongDef);
    }

    async defChange(strongDef) {
      if (!strongNums.includes(strongDef)) {
        queue.publish('strong.def.error', 'Invalid Strong Number');
      } else {
        this.strongDef = strongDef;
        this.saveDef();
        this.addHistory();
        await this.defUpdate();
      }
    }

    async defUpdate() {
      this.strongIdx = this.strongHistory.indexOf(this.strongDef);
      this.strongDefObj = await strongDictDb.dict.get(this.strongDef);
      await this.updateWordObj();
      await this.wordFirst();
      queue.publish('strong.def.update', this.strongDefObj);
    }

    filterChange(strongFilter) {
      this.strongFilter = strongFilter;
      this.saveFilter();
      queue.publish('strong.filter.update', this.strongFilter);
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
      const strongFilter = this.tomeFilter();
      this.filterChange(strongFilter);
    }

    historyChange(strongHistory) {
      this.strongHistory = strongHistory;
      this.saveHistory();
      queue.publish('strong.history.update', this.strongHistory);
    }

    historyClear() {
      this.strongHistory = [];
      this.updateHistory();
    }

    historyDelete(strongDef) {
      const index = this.strongHistory.indexOf(strongDef);
      this.strongHistory.splice(index, 1);
      this.updateHistory();
    }

    historyIsValid(strongHistory) {
      return strongHistory.some((x) => {
        return typeof x === 'string';
      });
    }

    initialize() {
      this.subscribe();
    }

    modeChange(strongMode) {
      this.strongMode = strongMode;
      this.saveMode();
      queue.publish('strong.strong-mode.update', this.strongMode);
    }

    modeToogle() {
      this.modeChange(!this.strongMode);
    }

    async restore() {
      this.restoreTask();
      this.restoreHistory();
      this.restoreChain();
      await this.restoreDef();
      this.strongIdx = this.strongHistory.findIndex(x => x === this.strongDef);
      await this.restoreWord();
      this.restoreFilter();
      await this.restoreVerseIdx();
      this.restoreMode();
    }

    restoreChain() {
      const defaultChain = [];
      let strongChain = localStorage.getItem('strongChain');
      if (!strongChain) {
        strongChain = defaultChain;
      } else {
        try {
          strongChain = JSON.parse(strongChain);
        } catch (error) {
          strongChain = defaultChain;
        }
        if (!this.chainIsValid(strongChain)) {
          strongChain = defaultChain;
        }
      }
      this.chainChange(strongChain);
    }

    async restoreDef() {
      const defaultDef = 'G2424';
      let strongDef = localStorage.getItem('strongDef');
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
      const defaultFilter = this.tomeFilter();
      let strongFilter = localStorage.getItem('strongFilter');
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
      const defaultHistory = [];
      let strongHistory = localStorage.getItem('strongHistory');
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
      const defaultMode = false;
      let strongMode = localStorage.getItem('strongStrongMode');
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
      const defaultTask = 'strong-def';
      let strongTask = localStorage.getItem('strongTask');
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
        } else if (!validTasks$1.includes(strongTask)) {
          strongTask = defaultTask;
        }
      }
      this.taskChange(strongTask);
    }

    async restoreVerseIdx() {
      const defaultVerseIdx = IDX_1_JOHN_4_19;
      let strongVerseIdx = localStorage.getItem('strongVerseIdx');
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
      const defaultWord = null;
      let strongWord = localStorage.getItem('strongWord');
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

    saveChain() {
      localStorage.setItem('strongChain',
        JSON.stringify(this.strongChain));
    }

    saveDef() {
      localStorage.setItem('strongDef',
        JSON.stringify(this.strongDef));
    }

    saveFilter() {
      localStorage.setItem('strongFilter',
        JSON.stringify(this.strongFilter));
    }

    saveHistory() {
      localStorage.setItem('strongHistory',
        JSON.stringify(this.strongHistory));
    }

    saveMode() {
      localStorage.setItem('strongStrongMode',
        JSON.stringify(this.strongMode));
    }

    saveTask() {
      localStorage.setItem('strongTask',
        JSON.stringify(this.strongTask));
    }

    saveVerseIdx() {
      localStorage.setItem('strongVerseIdx',
        JSON.stringify(this.strongVerseIdx));
    }

    saveWord() {
      localStorage.setItem('strongWord',
        JSON.stringify(this.strongWord));
    }

    subscribe() {
      queue.subscribe('name-mode.update', () => {
        this.updateStrongModel();
      });

      queue.subscribe('strong.chain.add', () => {
        this.chainAdd();
      });
      queue.subscribe('strong.chain.prev', () => {
        this.chainPrev();
      });
      queue.subscribe('strong.chain.clear', () => {
        this.chainClear();
      });
      queue.subscribe('strong.def.change', async (strongDef) => {
        await this.defChange(strongDef);
      });
      queue.subscribe('strong.filter.change', (strongFilter) => {
        this.filterChange(strongFilter);
      });
      queue.subscribe('strong.history.clear', () => {
        this.historyClear();
      });
      queue.subscribe('strong.history.delete', (strongDef) => {
        this.historyDelete(strongDef);
      });
      queue.subscribe('strong.restore', async () => {
        await this.restore();
      });
      queue.subscribe('strong.strong-mode.toggle', () => {
        this.modeToogle();
      });
      queue.subscribe('strong.task.change', (strongTask) => {
        this.taskChange(strongTask);
      });
      queue.subscribe('strong.verse.change', async (verseIdx) => {
        await this.verseIdxChange(verseIdx);
      });
      queue.subscribe('strong.word.change', async (strongWord) => {
        await this.wordChange(strongWord);
      });
    }

    taskChange(strongTask) {
      this.strongTask = strongTask;
      this.saveTask();
      queue.publish('strong.task.update', this.strongTask);
    }

    tomeFilter() {
      return {
        bookIdx: -1,
        chapterIdx: -1
      };
    }

    updateChain() {
      this.saveChain();
      queue.publish('strong.chain.update', this.strongChain);
    }

    updateHistory() {
      this.saveHistory();
      queue.publish('strong.history.update', this.strongHistory);
    }

    async updateStrongModel() {
      this.strongMapObj = await strongDb.maps.get(this.strongVerseIdx);
      queue.publish('strong.map.update', this.strongMapObj);
      this.strongVerseObj = await tomeDb.verses.get(this.strongVerseIdx);
      queue.publish('strong.verse.update', this.strongVerseObj);
      this.chainClear();
      await this.defChange(this.strongDef);
    }

    async updateWordMaps() {
      if (this.words.length) {
        const verses = this.wordTomeBin[binIdx.tomeBinIdx.verses];
        this.wordMapObjs = await strongDb.maps.bulkGet(verses);
        queue.publish('strong.wordMap.update', this.wordMapObjs);
      } else {
        this.wordMapObjs = [];
        queue.publish('strong.wordMap.update', this.wordMapObjs);
      }
    }

    async updateWordObj() {
      this.strongWordObj = await strongDb.words.get(this.strongDef);
      this.words = this.strongWordObj.v;
      queue.publish('strong.wordObj.update', this.strongWordObj);
    }

    async updateWordVerses() {
      if (this.words.length) {
        const word = this.words.find(x => x[strongIdx.word.tomeWord] === this.strongWord);
        this.wordTomeBin = word[strongIdx.word.tomeBin];
        queue.publish('strong.wordTomeBin.update', this.wordTomeBin);
        const verses = this.wordTomeBin[binIdx.tomeBinIdx.verses];
        this.wordVerseObjs = await tomeDb.verses.bulkGet(verses);
        queue.publish('strong.wordVerse.update', this.wordVerseObjs);
      } else {
        this.strongIdx.word.tomeBin = [];
        queue.publish('strong.wordTomeBin.update', this.wordTomeBin);
        this.wordVerseObjs = [];
        queue.publish('strong.wordVerse.update', this.wordVerseObjs);
      }
    }

    async verseIdxChange(verseIdx) {
      this.strongVerseIdx = verseIdx;
      this.saveVerseIdx();
      this.strongMapObj = await strongDb.maps.get(this.strongVerseIdx);
      queue.publish('strong.map.update', this.strongMapObj);
      this.strongVerseObj = await tomeDb.verses.get(this.strongVerseIdx);
      queue.publish('strong.verse.update', this.strongVerseObj);
    }

    async wordChange(strongWord) {
      this.strongWord = strongWord;
      this.saveWord();
      if (this.words.length) {
        const word = this.words.find(x => x[strongIdx.word.tomeWord] === this.strongWord);
        this.wordTomeBin = word[strongIdx.word.tomeBin];
      } else {
        this.wordTomeBin = [];
      }
      await this.updateWordVerses();
      await this.updateWordMaps();
      this.filterReset();
      queue.publish('strong.word.update', this.strongWord);
    }

    async wordFirst() {
      let firstTomeWord;
      if (this.words.length) {
        firstTomeWord = this.words[firstWord][strongIdx.word.tomeWord];
      } else {
        firstTomeWord = null;
      }
      await this.wordChange(firstTomeWord);
    }

  }

  const lowerToolSet$8 = [
    { type: 'btn', icon: 'back', ariaLabel: null },
    { type: 'btn', icon: 'strong-lookup', ariaLabel: null },
    { type: 'btn', icon: 'result', ariaLabel: null },
    { type: 'btn', icon: 'filter', ariaLabel: null },
    { type: 'btn', icon: 'history', ariaLabel: null },
    { type: 'btn', icon: 'strong-verse', ariaLabel: null },
    { type: 'btn', icon: 'prev', ariaLabel: null },
  ];

  const upperToolSet$8 = [
    { type: 'banner', cssModifier: 'strong-def', text: 'Strong Definition' },
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
    }

    buildDef() {
      const fragment = document.createDocumentFragment();
      const lemma = template.element('div', 'strong-def', 'lemma', null, this.def[strongIdx.def.lemma].normalize('NFC'));
      if (this.strongDef.startsWith('H')) {
        lemma.classList.add('font--hebrew');
      } else {
        lemma.classList.add('font--greek');
      }
      const xlit = template.element('div', 'strong-def', 'xlit', null, this.def[strongIdx.def.tranliteration].normalize('NFC'));
      const pron = template.element('div', 'strong-def', 'pron', null, this.def[strongIdx.def.pronunciation].normalize('NFC'));
      const definition = this.buildDefinition();
      fragment.appendChild(lemma);
      fragment.appendChild(xlit);
      fragment.appendChild(pron);
      fragment.appendChild(definition);
      return fragment;
    }

    buildDefinition(definition) {
      const defDiv = template.element('div', 'strong-def', 'def', null, null);
      const deriv = template.strongList(this.def[strongIdx.def.deriv], 'deriv');
      defDiv.appendChild(deriv);
      const strongDef = template.strongList(this.def[strongIdx.def.strongDef], 'strong-def');
      defDiv.appendChild(strongDef);
      const kjvDef = template.strongList(this.def[strongIdx.def.kjvDef], 'kjv-def');
      defDiv.appendChild(kjvDef);
      return defDiv;
    }

    buildPage() {
      this.page = template.page('strong-def');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$8);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('strong-def');
      this.list = template.element('div', 'list', 'strong-def', null, null);
      this.scroll.appendChild(this.list);
      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$8);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    buildWords() {
      const strongWords = template.element('div', 'strong-words', null, null, null);
      for (const word of this.words) {
        const tomeWord = word[strongIdx.word.tomeWord];
        const tomeBin = word[strongIdx.word.tomeBin];
        const label =
          `${tomeWord} (${tomeBin[binIdx.tomeBinIdx.wordCount]}/${tomeBin[binIdx.tomeBinIdx.verseCount]})`;
        const btn = template.element('div', 'btn-strong-word', null, null, label);
        btn.dataset.word = word[strongIdx.word.tomeWord];
        strongWords.appendChild(btn);
      }
      return strongWords;
    }

    chainUpdate(strongChain) {
      this.strongChain = strongChain;
      if (this.strongChain.length) {
        this.btnPrev.classList.remove('hide');
      } else {
        this.btnPrev.classList.add('hide');
      }
    }

    defClick(btn) {
      const strongDef = btn.dataset.strongDef;
      queue.publish('strong-def.select', strongDef);
    }

    defUpdate(strongDefObj) {
      this.strongDefObj = strongDefObj;
      this.strongDef = this.strongDefObj.k;
      this.def = this.strongDefObj.v;
      this.updateBanner();
      this.updateDefs();
      this.updateActiveWord();
    }

    getElements() {
      this.banner = this.toolbarUpper.querySelector('.banner--strong-def');

      this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
      this.btnLookup = this.toolbarLower.querySelector('.btn-icon--strong-lookup');
      this.btnResult = this.toolbarLower.querySelector('.btn-icon--result');
      this.btnFilter = this.toolbarLower.querySelector('.btn-icon--filter');
      this.btnHistory = this.toolbarLower.querySelector('.btn-icon--history');
      this.btnVerse = this.toolbarLower.querySelector('.btn-icon--strong-verse');
      this.btnPrev = this.toolbarLower.querySelector('.btn-icon--prev');
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
      const btn = event.target.closest('div');
      if (btn) {
        if (btn.classList.contains('btn-strong-word')) {
          this.wordClick(btn);
        } else if (btn.classList.contains('btn-strong-def')) {
          this.defClick(btn);
        }
      }
    }

    show() {
      this.page.classList.remove('page--hide');
    }

    subscribe() {
      queue.subscribe('strong-def.hide', () => {
        this.hide();
      });
      queue.subscribe('strong-def.show', () => {
        this.show();
      });

      queue.subscribe('strong.chain.update', (strongChain) => {
        this.chainUpdate(strongChain);
      });
      queue.subscribe('strong.def.update', (strongDefObj) => {
        this.defUpdate(strongDefObj);
      });
      queue.subscribe('strong.word.update', (strongWord) => {
        this.wordUpdate(strongWord);
      });
      queue.subscribe('strong.wordObj.update', (strongWordObj) => {
        this.wordObjUpdate(strongWordObj);
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBack) {
          queue.publish('strong.back', null);
        } else if (btn === this.btnLookup) {
          queue.publish('strong-lookup', null);
        } else if (btn === this.btnResult) {
          queue.publish('strong-result', null);
        } else if (btn === this.btnFilter) {
          queue.publish('strong-filter', null);
        } else if (btn === this.btnHistory) {
          queue.publish('strong-history', null);
        } else if (btn === this.btnVerse) {
          queue.publish('strong-verse', null);
        } else if (btn === this.btnPrev) {
          queue.publish('strong.prev', null);
        }
      }
    }

    updateActiveWord() {
      if (this.activeWordBtn) {
        this.activeWordBtn.classList.remove('btn-strong-word--active');
      }
      const strongWords = this.list.querySelector('.strong-words');
      if (strongWords) {
        const query = `.btn-strong-word[data-word="${this.strongWord}"]`;
        const btn = strongWords.querySelector(query);
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

    updateDefs() {
      this.scroll.scrollTop = 0;
      util.removeAllChildren(this.list);
      const def = this.buildDef();
      this.list.appendChild(def);
      const strongWords = this.buildWords();
      this.list.appendChild(strongWords);
    }

    wordClick(btn) {
      const word = btn.dataset.word;
      queue.publish('strong-def.word.select', word);
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

  const lowerToolSet$7 = [
    { type: 'btn', icon: 'back', ariaLabel: null },
    { type: 'btn', icon: 'strong-lookup', ariaLabel: null },
    { type: 'btn', icon: 'strong-def', ariaLabel: null },
    { type: 'btn', icon: 'result', ariaLabel: null },
    { type: 'btn', icon: 'history', ariaLabel: null },
    { type: 'btn', icon: 'strong-verse', ariaLabel: null },
  ];

  const upperToolSet$7 = [
    { type: 'banner', cssModifier: 'strong-filter', text: 'Strong Filter' },
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
      const bookIdx = bookBin[binIdx.bookBinIdx.bookIdx];
      const wordCount = bookBin[binIdx.bookBinIdx.wordCount];
      const verseCount = bookBin[binIdx.bookBinIdx.verseCount];
      const citation = tomeLists.books[bookIdx][tomeIdx.book.longName];

      const bookFilter = document.createElement('div');
      bookFilter.classList.add('filter', 'filter--book');

      const btnUnfold = template.btnIcon('next', 'filter-next', null);
      btnUnfold.dataset.bookIdx = bookIdx;
      bookFilter.appendChild(btnUnfold);

      const btnFold = template.btnIcon('down', 'filter-down', null);
      btnFold.classList.add('hide');
      btnFold.dataset.bookIdx = bookIdx;
      bookFilter.appendChild(btnFold);

      const btnFilter = document.createElement('div');
      btnFilter.classList.add('btn-filter', 'btn-filter--book');
      btnFilter.textContent = `${citation} (${wordCount}/${verseCount})`;
      btnFilter.dataset.bookIdx = bookIdx;
      btnFilter.dataset.chapterIdx = -1;
      bookFilter.appendChild(btnFilter);

      return bookFilter;
    }

    buildChapterFilter(bookBin, chapterBin) {
      const bookIdx = bookBin[binIdx.bookBinIdx.bookIdx];
      const chapterIdx = chapterBin[binIdx.chapterBinIdx.chapterIdx];
      const wordCount = chapterBin[binIdx.chapterBinIdx.wordCount];
      const verseCount = chapterBin[binIdx.chapterBinIdx.verseCount];
      const citation = tomeLists.chapters[chapterIdx][tomeIdx.chapter.name];

      const btnFilter = document.createElement('div');
      btnFilter.classList.add('btn-filter', 'btn-filter--chapter',
        'hide');
      btnFilter.textContent = `${citation} (${wordCount}/${verseCount})`;
      btnFilter.dataset.bookIdx = bookIdx;
      btnFilter.dataset.chapterIdx = chapterIdx;

      return btnFilter;
    }

    buildFilters() {
      const fragment = document.createDocumentFragment();
      const tomeFilter = this.buildTomeFilter();
      fragment.appendChild(tomeFilter);
      const books = this.wordTomeBin[binIdx.tomeBinIdx.books];
      for (const bookBin of books) {
        const bookFilter = this.buildBookFilter(bookBin);
        fragment.appendChild(bookFilter);
        const chapters = bookBin[binIdx.bookBinIdx.chapters];
        for (const chapterBin of chapters) {
          const chapterFilter = this.buildChapterFilter(bookBin, chapterBin);
          fragment.appendChild(chapterFilter);
        }
      }
      return fragment;
    }

    buildPage() {
      this.page = template.page('strong-filter');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$7);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('strong-filter');

      this.empty = template.element('div', 'empty', 'strong-filter', null, 'No Strong Filter.');
      this.scroll.appendChild(this.empty);
      this.list = template.element('div', 'list', 'strong-filter', null, null);
      this.scroll.appendChild(this.list);
      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$7);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    buildTomeFilter() {
      const citation = tomeLists.tomeName;
      const wordCount = this.wordTomeBin[binIdx.tomeBinIdx.wordCount];
      const verseCount = this.wordTomeBin[binIdx.tomeBinIdx.verseCount];

      const btnFilter = document.createElement('div');
      btnFilter.classList.add('btn-filter', 'btn-filter--kjv');
      btnFilter.textContent = `${citation} (${wordCount}/${verseCount})`;
      btnFilter.dataset.bookIdx = -1;
      btnFilter.dataset.chapterIdx = -1;

      return btnFilter;
    }

    defUpdate(strongDefObj) {
      this.strongDefObj = strongDefObj;
      this.strongDef = this.strongDefObj.k;
      this.updatePane();
    }

    filterClick(btnFilter) {
      const bookIdx = parseInt(btnFilter.dataset.bookIdx);
      const chapterIdx = parseInt(btnFilter.dataset.chapterIdx);
      const strongFilter = {
        bookIdx: bookIdx,
        chapterIdx: chapterIdx,
      };
      queue.publish('strong-filter.select', strongFilter);
    }

    filterUpdate(strongFilter) {
      this.strongFilter = strongFilter;
      this.updateActiveFilter();
    }

    foldClick(btnFold) {
      const bookIdxStr = btnFold.dataset.bookIdx;
      const chapters = this.list.querySelectorAll(`.btn-filter--chapter[data-book-idx="${bookIdxStr}"]`);
      for (const chapter of chapters) {
        chapter.classList.add('hide');
      }
      btnFold.classList.add('hide');
      const btnUnfold = btnFold.previousSibling;
      btnUnfold.classList.remove('hide');
    }

    getElements() {
      this.banner = this.toolbarUpper.querySelector('.banner--strong-filter');

      this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
      this.btnLookup = this.toolbarLower.querySelector('.btn-icon--strong-lookup');
      this.btnDef = this.toolbarLower.querySelector('.btn-icon--strong-def');
      this.btnResult = this.toolbarLower.querySelector('.btn-icon--result');
      this.btnHistory = this.toolbarLower.querySelector('.btn-icon--history');
      this.btnVerse = this.toolbarLower.querySelector('.btn-icon--strong-verse');
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
      const btn = event.target.closest('div');
      if (btn) {
        if (btn.classList.contains('btn-filter')) {
          this.filterClick(btn);
        } else if (btn.classList.contains('btn-icon--filter-down')) {
          this.foldClick(btn);
        } else if (btn.classList.contains('btn-icon--filter-next')) {
          this.unfoldClick(btn);
        }
      }
    }

    show() {
      this.page.classList.remove('page--hide');
    }

    subscribe() {
      queue.subscribe('strong-filter.hide', () => {
        this.hide();
      });
      queue.subscribe('strong-filter.show', () => {
        this.show();
      });

      queue.subscribe('strong.def.update', (strongDefObj) => {
        this.defUpdate(strongDefObj);
      });
      queue.subscribe('strong.filter.update', (strongFilter) => {
        this.filterUpdate(strongFilter);
      });
      queue.subscribe('strong.word.change', () => {
        this.wordChange();
      });
      queue.subscribe('strong.word.update', (strongWord) => {
        this.wordUpdate(strongWord);
      });
      queue.subscribe('strong.wordTomeBin.update', (wordTomeBin) => {
        this.wordTomeBinUpdate(wordTomeBin);
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBack) {
          queue.publish('strong.back', null);
        } else if (btn === this.btnLookup) {
          queue.publish('strong-lookup', null);
        } else if (btn === this.btnDef) {
          queue.publish('strong-def', null);
        } else if (btn === this.btnResult) {
          queue.publish('strong-result', null);
        } else if (btn === this.btnHistory) {
          queue.publish('strong-history', null);
        } else if (btn === this.btnVerse) {
          queue.publish('strong-verse', null);
        }
      }
    }

    unfoldClick(btnUnfold) {
      const bookIdxStr = btnUnfold.dataset.bookIdx;
      const chapters = this.list.querySelectorAll(`.btn-filter--chapter[data-book-idx="${bookIdxStr}"]`);
      for (const chapter of chapters) {
        chapter.classList.remove('hide');
      }
      btnUnfold.classList.add('hide');
      const btnFold = btnUnfold.nextSibling;
      btnFold.classList.remove('hide');
    }

    updateActiveFilter() {
      if (this.wordTomeBin.length) {
        if (this.btnActiveFilter) {
          this.btnActiveFilter.classList.remove('btn-filter--active');
        }
        const bookIdx = this.strongFilter.bookIdx;
        const chapterIdx = this.strongFilter.chapterIdx;
        const query = `.btn-filter[data-book-idx="${bookIdx}"]` +
          `[data-chapter-idx="${chapterIdx}"]`;
        const btn = this.list.querySelector(query);
        if (btn) {
          this.btnActiveFilter = btn;
          btn.classList.add('btn-filter--active');
        }
      }
    }

    updateBanner() {
      if (this.strongWord) {
        this.banner.innerHTML = `${this.strongDef} ${this.strongWord}`;
      } else {
        this.banner.innerHTML = `${this.strongDef}`;
      }
    }

    updateFilters() {
      this.scroll.scrollTop = 0;
      util.removeAllChildren(this.list);
      if (this.wordTomeBin.length) {
        this.empty.classList.add('hide');
        const list = this.buildFilters();
        this.list.appendChild(list);
      } else {
        this.empty.classList.remove('hide');
      }
    }

    updatePane() {
      this.updateBanner();
      this.updateFilters();
      this.updateActiveFilter();
    }

    wordChange() {
      this.wordChangePending = true;
    }

    wordTomeBinUpdate(wordTomeBin) {
      this.wordTomeBin = wordTomeBin;
    }

    wordUpdate(strongWord) {
      this.strongWord = strongWord;
      if (this.wordChangePending && this.strongWord) {
        this.wordChangePending = false;
        this.updatePane();
      }
    }

  }

  const lowerToolSet$6 = [
    { type: 'btn', icon: 'back', ariaLabel: null },
    { type: 'btn', icon: 'strong-lookup', ariaLabel: null },
    { type: 'btn', icon: 'strong-def', ariaLabel: null },
    { type: 'btn', icon: 'result', ariaLabel: null },
    { type: 'btn', icon: 'filter', ariaLabel: null },
    { type: 'btn', icon: 'strong-verse', ariaLabel: null },
    { type: 'btn', icon: 'history-clear', ariaLabel: null },
  ];

  const upperToolSet$6 = [
    { type: 'banner', cssModifier: 'strong-history', text: 'Strong History' },
  ];

  const firstXlit = 0;

  class StrongHistoryView {

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

    buildEntry(strongDef) {
      const entry = document.createElement('div');
      entry.classList.add('entry', 'entry--history');
      const btnEntry = document.createElement('div');
      btnEntry.classList.add('btn-entry', 'btn-entry--history');
      const transliteration = strongCitations[strongDef];
      const first = transliteration.replace(',', '').split(' ')[firstXlit];
      btnEntry.textContent = `${strongDef} ${first.normalize('NFC')}`;
      btnEntry.dataset.def = strongDef;
      entry.appendChild(btnEntry);
      const btnDelete = template.btnIcon('delete', 'delete', null);
      entry.appendChild(btnDelete);
      return entry;
    }

    buildPage() {
      this.page = template.page('strong-history');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$6);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('strong-history');
      this.empty = template.element('div', 'empty', 'strong-history', null, 'No Strong History.');
      this.scroll.appendChild(this.empty);

      this.list = template.element('div', 'list', 'strong-history', null, null);
      this.scroll.appendChild(this.list);

      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$6);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    getElements() {
      this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
      this.btnLookup = this.toolbarLower.querySelector('.btn-icon--strong-lookup');
      this.btnDef = this.toolbarLower.querySelector('.btn-icon--strong-def');
      this.btnResult = this.toolbarLower.querySelector('.btn-icon--result');
      this.btnFilter = this.toolbarLower.querySelector('.btn-icon--filter');
      this.btnHistory = this.toolbarLower.querySelector('.btn-icon--history');
      this.btnVerse = this.toolbarLower.querySelector('.btn-icon--strong-verse');
      this.btnHistoryClear = this.toolbarLower.querySelector('.btn-icon--history-clear');
    }

    hide() {
      this.page.classList.add('page--hide');
    }

    historyUpdate(strongHstory) {
      this.history = strongHstory;
      this.updateHistory();
    }

    initialize() {
      this.buildPage();
      this.getElements();
      this.addListeners();
      this.subscribe();
    }

    listClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div');
      if (btn) {
        if (btn.classList.contains('btn-entry--history')) {
          const strongDef = btn.dataset.def;
          queue.publish('strong-history.select', strongDef);
        } else if (btn.classList.contains('btn-icon--delete')) {
          const entry = btn.previousSibling;
          const strongDef = entry.dataset.def;
          queue.publish('strong-history.delete', strongDef);
        }
      }
    }

    show() {
      this.page.classList.remove('page--hide');
    }

    subscribe() {
      queue.subscribe('strong-history.hide', () => {
        this.hide();
      });
      queue.subscribe('strong-history.show', () => {
        this.show();
      });

      queue.subscribe('strong.history.update', (strongHistory) => {
        this.historyUpdate(strongHistory);
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBack) {
          queue.publish('strong.back', null);
        } else if (btn === this.btnLookup) {
          queue.publish('strong-lookup', null);
        } else if (btn === this.btnDef) {
          queue.publish('strong-def', null);
        } else if (btn === this.btnResult) {
          queue.publish('strong-result', null);
        } else if (btn === this.btnFilter) {
          queue.publish('strong-filter', null);
        } else if (btn === this.btnVerse) {
          queue.publish('strong-verse', null);
        } else if (btn === this.btnHistoryClear) {
          queue.publish('strong-history.clear', null);
        }
      }
    }

    updateHistory() {
      const scrollSave = this.scroll.scrollTop;
      util.removeAllChildren(this.list);
      if (this.history.length === 0) {
        this.empty.classList.remove('hide');
      } else {
        this.empty.classList.add('hide');
        const fragment = document.createDocumentFragment();
        for (const strongDef of this.history) {
          const entry = this.buildEntry(strongDef);
          fragment.appendChild(entry);
        }
        this.list.appendChild(fragment);
      }
      this.scroll.scrollTop = scrollSave;
    }

  }

  const dialogToolset = [
    { type: 'label', text: 'Strong Number' },
    { type: 'input', ariaLabel: 'Strong Number' },
    { type: 'btn', cssModifier: 'find', ariaLabel: null, label: 'Find' },
  ];

  const lowerToolSet$5 = [
    { type: 'btn', icon: 'back', ariaLabel: null },
    { type: 'btn', icon: 'strong-def', ariaLabel: null },
    { type: 'btn', icon: 'result', ariaLabel: null },
    { type: 'btn', icon: 'filter', ariaLabel: null },
    { type: 'btn', icon: 'history', ariaLabel: null },
    { type: 'btn', icon: 'strong-verse', ariaLabel: null },
  ];

  const upperToolSet$5 = [
    { type: 'banner', cssModifier: 'strong-lookup', text: 'Strong Lookup' },
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
      this.page = template.page('strong-lookup');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$5);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('strong-lookup');
      this.dialog = template.divDialog('strong-lookup', dialogToolset);
      this.scroll.appendChild(this.dialog);

      this.message = template.element('div', 'message', 'strong-lookup', null, null);
      this.scroll.appendChild(this.message);

      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$5);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    dialogClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-dialog');
      if (btn) {
        if (btn === this.btnFind) {
          this.findClick();
        }
      }
    }

    error(message) {
      this.message.textContent = message;
      this.message.classList.remove('hide');
    }

    findClick() {
      const strongNum = this.inputStrongNum.value;
      queue.publish('strong-lookup.find', strongNum.toUpperCase());
    }

    getElements() {
      this.banner = this.toolbarUpper.querySelector('.banner--strong-lookup');

      this.inputStrongNum = this.dialog.querySelector('.dialog-input');
      this.dialogBtns = this.dialog.querySelector('.dialog-btns');
      this.btnFind = this.dialogBtns.querySelector('.btn-dialog--find');

      this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
      this.btnDef = this.toolbarLower.querySelector('.btn-icon--strong-def');
      this.btnResult = this.toolbarLower.querySelector('.btn-icon--result');
      this.btnFilter = this.toolbarLower.querySelector('.btn-icon--filter');
      this.btnHistory = this.toolbarLower.querySelector('.btn-icon--history');
      this.btnVerse = this.toolbarLower.querySelector('.btn-icon--strong-verse');
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
        this.inputStrongNum.blur();
        this.findClick();
      }
    }

    show() {
      this.inputStrongNum.value = '';
      this.error.textContent = '';
      this.page.classList.remove('page--hide');
      this.message.classList.add('hide');
      this.inputStrongNum.focus();
    }

    subscribe() {
      queue.subscribe('strong-lookup.hide', () => {
        this.hide();
      });
      queue.subscribe('strong-lookup.show', () => {
        this.show();
      });

      queue.subscribe('strong.def.error', (message) => {
        this.error(message);
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBack) {
          queue.publish('strong.back', null);
        } else if (btn === this.btnDef) {
          queue.publish('strong-def', null);
        } else if (btn === this.btnResult) {
          queue.publish('strong-result', null);
        } else if (btn === this.btnFilter) {
          queue.publish('strong-filter', null);
        } else if (btn === this.btnHistory) {
          queue.publish('strong-history', null);
        } else if (btn === this.btnVerse) {
          queue.publish('strong-verse', null);
        }
      }
    }

  }

  const lowerToolSet$4 = [
    { type: 'btn', icon: 'back', ariaLabel: null },
    { type: 'btn', icon: 'strong-lookup', ariaLabel: null },
    { type: 'btn', icon: 'strong-def', ariaLabel: null },
    { type: 'btn', icon: 'filter', ariaLabel: null },
    { type: 'btn', icon: 'history', ariaLabel: null },
    { type: 'btn', icon: 'strong-verse', ariaLabel: null },
    { type: 'btn', icon: 'strong-mode', ariaLabel: null },
  ];

  const upperToolSet$4 = [
    { type: 'btn-banner', cssModifier: 'strong-result', text: 'Strong Search' },
  ];

  const localBinIdx = 0;
  const loadIncrement = 50;

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
      this.toolbarUpper.addEventListener('click', (event) => {
        this.toolbarUpperClick(event);
      });
    }

    addVerse(verseObj) {
      const btn = document.createElement('div');
      btn.classList.add('btn-result');
      btn.dataset.verseIdx = verseObj.k;
      const resultText = document.createElement('span');
      resultText.classList.add('span-search-text');
      const acrostic = template.acrostic(verseObj);
      const ref = this.buildRefSpan(verseObj);
      resultText.appendChild(ref);
      if (acrostic) {
        resultText.appendChild(acrostic);
      }
      const text = this.buildStrongText(verseObj);
      resultText.insertAdjacentHTML('beforeend', text);
      btn.appendChild(resultText);
      return btn;
    }

    applyFilter() {
      if (this.wordTomeBin.length) {
        const tomeBin = this.wordTomeBin;
        const bookIdx = this.strongFilter.bookIdx;
        const chapterIdx = this.strongFilter.chapterIdx;
        if (bookIdx === -1 && chapterIdx === -1) {
          this.filteredVerses = tomeBin[binIdx.tomeBinIdx.verses];
          this.wordCount = tomeBin[binIdx.tomeBinIdx.wordCount];
          this.verseCount = tomeBin[binIdx.tomeBinIdx.verseCount];
          this.citation = tomeLists.tomeName;
        } else {
          const books = tomeBin[binIdx.tomeBinIdx.books];
          const bookBin = this.findBin(books, bookIdx);
          if (chapterIdx === -1) {
            this.filteredVerses = tomeBin[binIdx.tomeBinIdx.verses]
              .slice(bookBin[binIdx.bookBinIdx.sliceStart], bookBin[binIdx.bookBinIdx.sliceEnd]);
            this.wordCount = bookBin[binIdx.bookBinIdx.wordCount];
            this.verseCount = bookBin[binIdx.bookBinIdx.verseCount];
            this.citation = tomeLists.books[bookIdx][tomeIdx.book.longName];
          } else {
            const chapters = bookBin[binIdx.bookBinIdx.chapters];
            const chapterBin = this.findBin(chapters, chapterIdx);
            this.filteredVerses = tomeBin[binIdx.tomeBinIdx.verses]
              .slice(chapterBin[binIdx.chapterBinIdx.sliceStart],
                chapterBin[binIdx.chapterBinIdx.sliceEnd]);
            this.wordCount = chapterBin[binIdx.chapterBinIdx.wordCount];
            this.verseCount = chapterBin[binIdx.chapterBinIdx.verseCount];
            this.citation = tomeLists.chapters[chapterIdx][tomeIdx.chapter.name];
          }
        }
      } else {
        this.filteredVerses = [];
        this.wordCount = null;
        this.verseCount = null;
        this.citation = null;
      }
    }

    buildPage() {
      this.page = template.page('strong-result');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$4);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('strong-result');

      this.empty = template.element('div', 'empty', 'strong-result', null, 'No Strong Result.');
      this.scroll.appendChild(this.empty);

      this.list = template.element('div', 'list', 'strong-result', null, null);
      this.scroll.appendChild(this.list);

      this.loadMore = template.element('div', 'load-more', 'strong-result', null, null);
      this.btnLoadMore = document.createElement('div');
      this.btnLoadMore.classList.add('btn-load-more');
      this.btnLoadMore.textContent = 'Load More';
      this.loadMore.appendChild(this.btnLoadMore);
      this.scroll.appendChild(this.loadMore);

      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$4);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    buildRefSpan(verseObj) {
      const refSpan = document.createElement('span');
      refSpan.classList.add('font--bold');
      refSpan.textContent = verseObj.v[tomeIdx.verse.citation] + ' ';
      return refSpan;
    }

    buildStrongText(verseObj) {
      const verseIdx = verseObj.k;
      const verse = verseObj.v;
      const parts = [];
      verse[tomeIdx.verse.text].split(' ');
      const maps = this.strongWordMapObjs.find(x => x.k === verseIdx).v;
      for (const map of maps) {
        const strongStr = map[strongIdx.map.strongNums].join(' ');
        const cleanNums = map[strongIdx.map.strongNums].map(x => x.replace(/[()@]/g, ''));
        const phrase = map[strongIdx.map.verseFragment];
        parts.push(phrase);
        if (cleanNums.includes(this.strongDef)) {
          parts.push(`<span class="super"> ${strongStr}</span>`);
        }
      }
      const innerHtml = parts.join(' ').replace(/ <span/g, '<span');
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

    changeFontVariant() {
      if (this.lastFontVariant) {
        this.list.classList.remove(this.lastFontVariant);
      }
      this.list.classList.add(this.fontVariant);
    }

    defUpdate(strongDefObj) {
      this.strongDefObj = strongDefObj;
      this.strongDef = this.strongDefObj.k;
      this.updateBanner();
      this.updateResult();
    }

    filterChange() {
      this.filterChangePending = true;
    }

    filterUpdate(strongFilter) {
      this.strongFilter = strongFilter;
      this.applyFilter();
      if (this.filterChangePending) {
        this.filterChangePending = false;
        this.updatePane();
      }
    }

    findBin(bins, idx) {
      return bins.find((bin) => {
        return bin[localBinIdx] === idx;
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

    fontVariantUpdate(fontVariant) {
      this.fontVariant = fontVariant;
      this.changeFontVariant();
      this.lastFontVariant = fontVariant;
    }

    getElements() {
      this.btnBanner = this.toolbarUpper.querySelector('.btn-banner--strong-result');

      this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
      this.btnLookup = this.toolbarLower.querySelector('.btn-icon--strong-lookup');
      this.btnDef = this.toolbarLower.querySelector('.btn-icon--strong-def');
      this.btnFilter = this.toolbarLower.querySelector('.btn-icon--filter');
      this.btnHistory = this.toolbarLower.querySelector('.btn-icon--history');
      this.btnVerse = this.toolbarLower.querySelector('.btn-icon--strong-verse');
      this.btnStrongMode = this.toolbarLower.querySelector('.btn-icon--strong-mode');
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
      this.lastFontVariant = null;
      this.strongMode = false;
      this.clipboardMode = false;
    }

    listClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div');
      if (btn) {
        if (this.clipboardMode) {
          const text = btn.textContent;
          navigator.clipboard.writeText(text);
        } else {
          if (btn.classList.contains('btn-result')) {
            const verseIdx = parseInt(btn.dataset.verseIdx);
            if (this.strongMode) {
              queue.publish('strong-result.strong-select', verseIdx);
            } else {
              queue.publish('strong-result.read-select', verseIdx);
            }
          }
        }
      }
    }

    loadMoreClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-load-more');
      if (btn === this.btnLoadMore) {
        this.loadVerses();
      }
    }

    loadVerses() {
      let verses;
      if (this.verseCount <= loadIncrement) {
        verses = this.filteredVerses;
        this.loadIdx = this.verseCount;
      } else {
        const sliceEnd = Math.min(this.loadIdx + loadIncrement, this.verseCount);
        verses = this.filteredVerses.slice(this.loadIdx, sliceEnd);
        this.loadIdx = sliceEnd;
      }

      const fragment = document.createDocumentFragment();
      const verseObjs = this.strongWordVerseObjs.filter(x => verses.includes(x.k));
      for (const verseObj of verseObjs) {
        const verse = this.addVerse(verseObj);
        fragment.appendChild(verse);
      }
      this.list.appendChild(fragment);

      if (this.loadIdx < this.verseCount) {
        this.loadMore.classList.remove('hide');
      } else {
        this.loadMore.classList.add('hide');
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

    show() {
      this.page.classList.remove('page--hide');
    }

    subscribe() {
      queue.subscribe('font.update', (font) => {
        this.fontUpdate(font);
      });

      queue.subscribe('font-size.update', (fontSize) => {
        this.fontSizeUpdate(fontSize);
      });

      queue.subscribe('font-variant.update', (fontVariant) => {
        this.fontVariantUpdate(fontVariant);
      });

      queue.subscribe('strong-result.hide', () => {
        this.hide();
      });
      queue.subscribe('strong-result.show', () => {
        this.show();
      });

      queue.subscribe('strong.def.update', (strongDefObj) => {
        this.defUpdate(strongDefObj);
      });
      queue.subscribe('strong.filter.change', () => {
        this.filterChange();
      });
      queue.subscribe('strong.filter.update', (strongFilter) => {
        this.filterUpdate(strongFilter);
      });
      queue.subscribe('strong.strong-mode.update', (strongMode) => {
        this.modeUpdate(strongMode);
      });
      queue.subscribe('strong.word.change', () => {
        this.wordChange();
      });
      queue.subscribe('strong.word.update', (strongWord) => {
        this.wordUpdate(strongWord);
      });
      queue.subscribe('strong.wordTomeBin.update', (wordTomeBin) => {
        this.wordTomeBinUpdate(wordTomeBin);
      });
      queue.subscribe('strong.wordMap.update', (wordMapObjs) => {
        this.wordMapUpdate(wordMapObjs);
      });
      queue.subscribe('strong.wordVerse.update', (wordVerseObjs) => {
        this.wordVerseUpdate(wordVerseObjs);
      });
    }

    toogleClipboardMode() {
      if (this.clipboardMode) {
        this.btnBanner.classList.remove('btn-banner--active');
      } else {
        this.btnBanner.classList.add('btn-banner--active');
      }
      this.clipboardMode = !this.clipboardMode;
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBack) {
          queue.publish('strong.back', null);
        } else if (btn === this.btnLookup) {
          queue.publish('strong-lookup', null);
        } else if (btn === this.btnDef) {
          queue.publish('strong-def', null);
        } else if (btn === this.btnFilter) {
          queue.publish('strong-filter', null);
        } else if (btn === this.btnHistory) {
          queue.publish('strong-history', null);
        } else if (btn === this.btnVerse) {
          queue.publish('strong-verse', null);
        } else if (btn === this.btnStrongMode) {
          queue.publish('strong.strong-mode.click', null);
        }
      }
    }

    toolbarUpperClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-banner');
      if (btn) {
        if (btn === this.btnBanner) {
          this.toogleClipboardMode();
        }
      }
    }

    updateBanner() {
      if (this.citation) {
        this.btnBanner.innerHTML = `${this.citation} ` +
          `(${this.wordCount}/${this.verseCount})<br>` +
          `${this.strongDef} ${this.strongWord}`;
      } else {
        this.btnBanner.innerHTML = this.strongDef;
      }
    }

    updatePane() {
      this.updateBanner();
      this.updateResult();
    }

    updateResult() {
      this.scroll.scrollTop = 0;
      util.removeAllChildren(this.list);
      if (this.verseCount) {
        this.empty.classList.add('hide');
      } else {
        this.empty.classList.remove('hide');
      }
      this.loadIdx = 0;
      this.loadedVerses = 0;
      this.loadVerses();
    }

    wordChange() {
      this.wordChangePending = true;
    }

    wordMapUpdate(wordMapObjs) {
      this.strongWordMapObjs = wordMapObjs;
    }

    wordTomeBinUpdate(wordTomeBin) {
      this.wordTomeBin = wordTomeBin;
    }

    wordVerseUpdate(wordVerseObjs) {
      this.strongWordVerseObjs = wordVerseObjs;
    }

    wordUpdate(strongWord) {
      this.strongWord = strongWord;
      if (this.wordChangePending) {
        this.wordChangePending = false;
        this.updatePane();
      }
    }

  }

  const lowerToolSet$3 = [
    { type: 'btn', icon: 'back', ariaLabel: null },
    { type: 'btn', icon: 'strong-lookup', ariaLabel: null },
    { type: 'btn', icon: 'strong-def', ariaLabel: null },
    { type: 'btn', icon: 'result', ariaLabel: null },
    { type: 'btn', icon: 'filter', ariaLabel: null },
    { type: 'btn', icon: 'history', ariaLabel: null },
  ];

  const upperToolSet$3 = [
    { type: 'banner', cssModifier: 'strong-verse', text: 'Strong Verse' },
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
      this.page = template.page('strong-verse');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$3);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('strong-verse');
      this.list = template.element('div', 'list', 'strong-verse', null, null);
      this.scroll.appendChild(this.list);
      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$3);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    buildStrongFragment(map) {
      const text = map[strongIdx.map.verseFragment];
      const strongFragment = template.element('div', 'strong-fragment', null, null, null);
      const verseFragment = template.element('div', 'verse-fragment', null, null, text);
      const strongList = template.element('div', 'strong-list', null, null, null);
      for (const num of map[strongIdx.map.strongNums]) {
        const btn = template.element('div', 'btn-strong', null, null, num);
        btn.dataset.strongDef = num.replace(/@/g, '');
        strongList.appendChild(btn);
      }
      strongFragment.appendChild(verseFragment);
      strongFragment.appendChild(strongList);
      return strongFragment;
    }

    getElements() {
      this.banner = this.toolbarUpper.querySelector('.banner--strong-verse');

      this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
      this.btnLookup = this.toolbarLower.querySelector('.btn-icon--strong-lookup');
      this.btnDef = this.toolbarLower.querySelector('.btn-icon--strong-def');
      this.btnResult = this.toolbarLower.querySelector('.btn-icon--result');
      this.btnFilter = this.toolbarLower.querySelector('.btn-icon--filter');
      this.btnHistory = this.toolbarLower.querySelector('.btn-icon--history');
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
      const btn = event.target.closest('div.btn-strong');
      if (btn) {
        if (btn.classList.contains('btn-strong')) {
          const strongDef = btn.dataset.strongDef;
          queue.publish('strong-verse.select', strongDef);
        }
      }
    }

    mapUpdate(strongMapObj) {
      this.strongMapObj = strongMapObj;
      this.maps = this.strongMapObj.v;
    }

    show() {
      this.page.classList.remove('page--hide');
    }

    subscribe() {
      queue.subscribe('strong-verse.hide', () => {
        this.hide();
      });
      queue.subscribe('strong-verse.show', () => {
        this.show();
      });

      queue.subscribe('strong.map.update', (strongMapObj) => {
        this.mapUpdate(strongMapObj);
      });
      queue.subscribe('strong.verse.update', (strongVerseObj) => {
        this.verseUpdate(strongVerseObj);
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBack) {
          queue.publish('strong.back', null);
        } else if (btn === this.btnLookup) {
          queue.publish('strong-lookup', null);
        } else if (btn === this.btnDef) {
          queue.publish('strong-def', null);
        } else if (btn === this.btnResult) {
          queue.publish('strong-result', null);
        } else if (btn === this.btnFilter) {
          queue.publish('strong-filter', null);
        } else if (btn === this.btnHistory) {
          queue.publish('strong-history', null);
        }
      }
    }

    updateBanner() {
      this.banner.textContent = this.verse[tomeIdx.verse.citation];
    }

    updateVerse() {
      this.scroll.scrollTop = 0;
      util.removeAllChildren(this.list);
      const docFragment = document.createDocumentFragment();
      this.verseWords = this.verse[tomeIdx.verse.text].split(' ');
      for (const map of this.maps) {
        const strongMap = this.buildStrongFragment(map);
        docFragment.appendChild(strongMap);
      }
      this.list.appendChild(docFragment);
    }

    verseUpdate(strongVerseObj) {
      this.strongVerseObj = strongVerseObj;
      this.strongVerse = this.strongVerseObj.k;
      this.verse = this.strongVerseObj.v;
      this.updateBanner();
      this.updateVerse();
    }

  }

  class StrongController {

    constructor() {
      this.initialize();
    }

    back() {
      queue.publish('sidebar.change', 'none');
    }

    chapterIdxUpdate() {
      if (this.selectVerseIdx) {
        if (this.panes === 1 && this.sidebar !== 'none') {
          queue.publish('sidebar.select', 'none');
        }
        queue.publish('read.scroll-verse-idx', this.selectVerseIdx);
        this.selectVerseIdx = null;
      }
    }

    defChange() {
      this.defChangePending = true;
    }

    defPane() {
      queue.publish('strong.task.change', 'strong-def');
    }

    defSelect(strongDef) {
      queue.publish('strong.chain.add', null);
      queue.publish('strong.def.change', strongDef);
    }

    defUpdate() {
      if (this.defChangePending) {
        this.defChangePending = false;
        queue.publish('strong.task.change', 'strong-def');
      }
    }

    filterPane() {
      queue.publish('strong.task.change', 'strong-filter');
    }

    filterSelect(strongFilter) {
      this.filterSelectPending = true;
      queue.publish('strong.filter.change', strongFilter);
    }

    filterUpdate() {
      if (this.filterSelectPending) {
        this.filterSelectPending = false;
        queue.publish('strong.task.change', 'strong-result');
      }
    }

    hide() {
      queue.publish(`${this.strongTask}.hide`, null);
    }

    historyClear() {
      queue.publish('strong.history.clear', null);
    }

    historyDelete(strongDef) {
      queue.publish('strong.history.delete', strongDef);
    }

    historyPane() {
      queue.publish('strong.task.change', 'strong-history');
    }

    historySelect(strongDef) {
      queue.publish('strong.def.change', strongDef);
    }

    initialize() {
      this.subscribe();
    }

    lookupFind(strongNum) {
      queue.publish('strong.chain.clear', null);
      queue.publish('strong.def.change', strongNum);
    }

    lookupPane() {
      queue.publish('strong.task.change', 'strong-lookup');
    }

    modeToggle() {
      queue.publish('strong.strong-mode.toggle', null);
    }

    panesUpdate(panes) {
      this.panes = panes;
    }

    prev() {
      queue.publish('strong.chain.prev', null);
    }

    readSelect(verseIdx) {
      this.selectVerseIdx = verseIdx;
      const chapterIdx = chapterIdxByVerseIdx(verseIdx);
      queue.publish('chapterIdx.change', chapterIdx);
    }

    resultPane() {
      queue.publish('strong.task.change', 'strong-result');
    }

    show() {
      queue.publish(`${this.strongTask}.show`, null);
    }

    sidebarUpdate(sidebar) {
      this.sidebar = sidebar;
    }

    strongSelect(verseIdx) {
      queue.publish('strong.verse.change', verseIdx);
    }

    subscribe() {
      queue.subscribe('chapterIdx.update', () => {
        this.chapterIdxUpdate();
      });

      queue.subscribe('panes.update', (panes) => {
        this.panesUpdate(panes);
      });

      queue.subscribe('sidebar.update', (sidebar) => {
        this.sidebarUpdate(sidebar);
      });

      queue.subscribe('strong-def', () => {
        this.defPane();
      });
      queue.subscribe('strong-def.select', (strongDef) => {
        this.defSelect(strongDef);
      });
      queue.subscribe('strong-def.word.select', (strongWord) => {
        this.wordSelect(strongWord);
      });

      queue.subscribe('strong-filter', () => {
        this.filterPane();
      });
      queue.subscribe('strong-filter.select', (strongFilter) => {
        this.filterSelect(strongFilter);
      });

      queue.subscribe('strong-history', () => {
        this.historyPane();
      });
      queue.subscribe('strong-history.clear', () => {
        this.historyClear();
      });
      queue.subscribe('strong-history.delete', (strongDef) => {
        this.historyDelete(strongDef);
      });
      queue.subscribe('strong-history.select', (strongDef) => {
        this.historySelect(strongDef);
      });

      queue.subscribe('strong-lookup', () => {
        this.lookupPane();
      });
      queue.subscribe('strong-lookup.find', (strongNum) => {
        this.lookupFind(strongNum);
      });

      queue.subscribe('strong-result', () => {
        this.resultPane();
      });
      queue.subscribe('strong-result.read-select', (verseIdx) => {
        this.readSelect(verseIdx);
      });
      queue.subscribe('strong-result.strong-select', (verseIdx) => {
        this.strongSelect(verseIdx);
      });

      queue.subscribe('strong-verse', () => {
        this.versePane();
      });
      queue.subscribe('strong-verse.select', (strongDef) => {
        this.verseSelect(strongDef);
      });

      queue.subscribe('strong.back', () => {
        this.back();
      });
      queue.subscribe('strong.def.change', () => {
        this.defChange();
      });
      queue.subscribe('strong.def.update', () => {
        this.defUpdate();
      });
      queue.subscribe('strong.filter.update', () => {
        this.filterUpdate();
      });
      queue.subscribe('strong.hide', () => {
        this.hide();
      });
      queue.subscribe('strong.prev', () => {
        this.prev();
      });
      queue.subscribe('strong.show', () => {
        this.show();
      });
      queue.subscribe('strong.strong-mode.click', () => {
        this.modeToggle();
      });
      queue.subscribe('strong.task.update', (strongTask) => {
        this.taskUpdate(strongTask);
      });
      queue.subscribe('strong.verse.change', () => {
        this.verseChange();
      });
      queue.subscribe('strong.verse.update', () => {
        this.verseUpdate();
      });
      queue.subscribe('strong.word.update', () => {
        this.wordUpdate();
      });
    }

    taskUpdate(strongTask) {
      if (this.sidebar === 'strong') {
        if (this.strongTask !== strongTask) {
          queue.publish(`${this.strongTask}.hide`, null);
          this.strongTask = strongTask;
          queue.publish(`${this.strongTask}.show`, null);
        }
      } else {
        this.strongTask = strongTask;
      }
    }

    verseChange() {
      this.verseChangePending = true;
    }

    versePane() {
      queue.publish('strong.task.change', 'strong-verse');
    }

    verseSelect(strongDef) {
      queue.publish('strong.chain.clear', null);
      queue.publish('strong.def.change', strongDef);
    }

    verseUpdate() {
      if (this.verseChangePending) {
        this.verseChangePending = false;
        queue.publish('strong.task.change', 'strong-verse');
      }
    }

    wordSelect(strongWord) {
      this.wordSelectPending = true;
      queue.publish('strong.word.change', strongWord);
    }

    wordUpdate() {
      if (this.wordSelectPending) {
        this.wordSelectPending = false;
        queue.publish('strong.task.change', 'strong-result');
      }
    }

  }

  const validFontSizes = [
    'font-size--s', 'font-size--m', 'font-size--l', 'font-size--xl',
    'font-size--xxl',
  ];

  const validFontVariants = [
    'normal', 'small-caps',
  ];

  const fontDefault = 0;
  const fontSizeDefault = 1;
  const fontVariantDefault = 0;
  const themeDefault = 9;

  class SettingModel {

    constructor() {
      this.initialize();
    }

    fontChange(font) {
      this.font = font;
      this.saveFont();
      queue.publish('font.update', this.font);
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
      queue.publish('font-size.update', this.fontSize);
    }

    fontVariantChange(fontVariant) {
      this.fontVariant = fontVariant;
      this.saveFontVariant();
      queue.publish('font-variant.update', this.fontVariant);
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
        fontName: 'Roboto Slab',
        fontClass: 'font--roboto-slab'
      });
      this.fonts.push({
        fontName: 'Merriweather',
        fontClass: 'font--merriweather'
      });
      this.fonts.push({
        fontName: 'Courgette',
        fontClass: 'font--courgette'
      });
      this.fonts.push({
        fontName: 'Merienda',
        fontClass: 'font--merienda'
      });
      this.fonts.push({
        fontName: 'Roboto Mono',
        fontClass: 'font--roboto-mono'
      });
      this.fonts.push({
        fontName: 'Inconsolata',
        fontClass: 'font--inconsolata'
      });
      queue.publish('fonts.update', this.fonts);
    }

    initializeThemes() {
      this.themes = [];
      this.themes.push({
        themeType: 'dark',
        themeName: 'Jasper',
        themeClass: 'theme--jasper-dark'
      });
      this.themes.push({
        themeType: 'light',
        themeName: 'Jasper',
        themeClass: 'theme--jasper-light'
      });
      this.themes.push({
        themeType: 'dark',
        themeName: 'Beryl',
        themeClass: 'theme--beryl-dark'
      });
      this.themes.push({
        themeType: 'light',
        themeName: 'Beryl',
        themeClass: 'theme--beryl-light'
      });
      this.themes.push({
        themeType: 'dark',
        themeName: 'Emerald',
        themeClass: 'theme--emerald-dark'
      });
      this.themes.push({
        themeType: 'light',
        themeName: 'Emerald',
        themeClass: 'theme--emerald-light'
      });
      this.themes.push({
        themeType: 'dark',
        themeName: 'Topaz',
        themeClass: 'theme--topaz-dark'
      });
      this.themes.push({
        themeType: 'light',
        themeName: 'Topaz',
        themeClass: 'theme--topaz-light'
      });
      this.themes.push({
        themeType: 'dark',
        themeName: 'Sapphire',
        themeClass: 'theme--sapphire-dark'
      });
      this.themes.push({
        themeType: 'light',
        themeName: 'Sapphire',
        themeClass: 'theme--sapphire-light'
      });
      this.themes.push({
        themeType: 'dark',
        themeName: 'Amethyst',
        themeClass: 'theme--amethyst-dark'
      });
      this.themes.push({
        themeType: 'light',
        themeName: 'Amethyst',
        themeClass: 'theme--amethyst-light'
      });
      this.themes.push({
        themeType: 'dark',
        themeName: 'Chalcedony',
        themeClass: 'theme--chalcedony-dark'
      });
      this.themes.push({
        themeType: 'light',
        themeName: 'Chalcedony',
        themeClass: 'theme--chalcedony-light'
      });
      queue.publish('themes.update', this.themes);
    }

    restore() {
      this.initializeFonts();
      this.restoreFont();
      this.restoreFontSize();
      this.restoreFontVariant();
      this.initializeThemes();
      this.restoreTheme();
    }

    restoreFont() {
      const defaultFont = this.fonts[fontDefault];
      let font = localStorage.getItem('font');
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
      const defaultFontSize = validFontSizes[fontSizeDefault];
      let fontSize = localStorage.getItem('fontSize');
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

    restoreFontVariant() {
      const defaultFontVariant = validFontVariants[fontVariantDefault];
      let fontVariant = localStorage.getItem('fontVariant');
      if (!fontVariant) {
        fontVariant = defaultFontVariant;
      } else {
        try {
          fontVariant = JSON.parse(fontVariant);
        } catch (error) {
          fontVariant = defaultFontVariant;
        }
        if (!validFontVariants.includes(fontVariant)) {
          fontVariant = defaultFontSize;
        }
      }
      this.fontVariantChange(fontVariant);
    }

    restoreTheme() {
      const defaultTheme = this.themes[themeDefault];
      let theme = localStorage.getItem('theme');
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
      localStorage.setItem('font', JSON.stringify(this.font));
    }

    saveFontSize() {
      localStorage.setItem('fontSize', JSON.stringify(this.fontSize));
    }

    saveFontVariant() {
      localStorage.setItem('fontVariant', JSON.stringify(this.fontVariant));
    }

    saveTheme() {
      localStorage.setItem('theme', JSON.stringify(this.theme));
    }

    subscribe() {
      queue.subscribe('font.change', (font) => {
        this.fontChange(font);
      });

      queue.subscribe('font-size.change', (fontSize) => {
        this.fontSizeChange(fontSize);
      });

      queue.subscribe('font-variant.change', (fontVariant) => {
        this.fontVariantChange(fontVariant);
      });

      queue.subscribe('setting.restore', () => {
        this.restore();
      });

      queue.subscribe('theme.change', (theme) => {
        this.themeChange(theme);
      });
    }

    themeChange(theme) {
      this.theme = theme;
      this.saveTheme();
      queue.publish('theme.update', this.theme);
    }

    themeIsValid(theme) {
      let result;
      try {
        result = this.themes.some((validTheme) => {
          return validTheme.themeType === theme.themeType &&
            validTheme.themeName === theme.themeName &&
            validTheme.themeClass === theme.themeClass;
        });
      } catch (error) {
        result = false;
      }
      return result;
    }

  }

  const lowerToolSet$2 = [
    { type: 'btn', icon: 'back', ariaLabel: null },
  ];

  const upperToolSet$2 = [
    { type: 'banner', cssModifier: 'setting', text: 'Setting' },
  ];

  const fontSize = [
    { size: 's', ariaLabel: null },
    { size: 'm', ariaLabel: null },
    { size: 'l', ariaLabel: null },
    { size: 'xl', ariaLabel: null },
    { size: 'xxl', ariaLabel: null },
  ];

  const templateBtnFontSize = (size, label) => {
    const btnFontSize = template.element('div', 'btn-font-size', null, null, null);
    btnFontSize.textContent = 'Aa';
    btnFontSize.classList.add(`font-size--${size}`);
    btnFontSize.dataset.size = `font-size--${size}`;
    return btnFontSize;
  };

  const templateBtnFontVariant = (variant, label) => {
    const btnFontVariant = template.element('div', 'btn-font-variant', null, null, null);
    btnFontVariant.textContent = label;
    btnFontVariant.classList.add(`${variant}`);
    btnFontVariant.dataset.variant = `${variant}`;
    return btnFontVariant;
  };

  const templateBtnThemeType = (type, label) => {
    const btnThemeType = template.element('div', 'btn-theme-type', null, null, null);
    btnThemeType.textContent = label;
    btnThemeType.classList.add(`theme-type--${type}`);
    btnThemeType.dataset.type = `${type}`;
    return btnThemeType;
  };

  const templateSettingFont = (modifier, name) => {
    const divSetting = template.element('div', 'setting', modifier, null, null);
    const heading = template.element('h1', 'header', modifier, null, name);
    divSetting.appendChild(heading);
    const divCarousel = templateSettingCarousel('font');
    divSetting.appendChild(divCarousel);
    return divSetting;
  };

  const templateSettingFontSize = (modifier, name) => {
    const divSetting = template.element('div', 'setting', modifier, null, null);
    const heading = template.element('h1', 'header', modifier, null, name);
    divSetting.appendChild(heading);
    const divSelector = template.element('div', 'selector', 'font-size', null, null);
    for (const size of fontSize) {
      const btn = templateBtnFontSize(size.size, size.label);
      divSelector.appendChild(btn);
    }
    divSetting.appendChild(divSelector);
    return divSetting;
  };

  const templateSettingFontVariant = (modifier, name) => {
    const divSetting = template.element('div', 'setting', modifier, null, null);
    const heading = template.element('h1', 'header', modifier, null, name);
    divSetting.appendChild(heading);
    const divSelector = template.element('div', 'selector', 'font-variant', null, null);
    const btnNormal = templateBtnFontVariant('normal', 'Normal');
    divSelector.appendChild(btnNormal);
    const btnSmallCaps = templateBtnFontVariant('small-caps', 'Small Caps');
    divSelector.appendChild(btnSmallCaps);
    divSetting.appendChild(divSelector);
    return divSetting;
  };

  const templateSettingCarousel = (modifier, name) => {
    const divCarousel = template.element('div', 'carousel', modifier, null, null);
    const btnPrev = template.btnIcon('prev', 'prev', null);
    const divName = template.element('div', 'name', modifier, null, null);
    const btnNext = template.btnIcon('next', 'next', null);
    divCarousel.appendChild(btnPrev);
    divCarousel.appendChild(divName);
    divCarousel.appendChild(btnNext);
    return divCarousel;
  };

  const templateSettingTheme = (modifier, name) => {
    const divSetting = template.element('div', 'setting', modifier, null, null);
    const heading = template.element('h1', 'header', modifier, null, name);
    divSetting.appendChild(heading);
    const divSelector = template.element('div', 'selector', 'theme-type', null, null);
    const btnDark = templateBtnThemeType('dark', 'Dark');
    divSelector.appendChild(btnDark);
    const btnLight = templateBtnThemeType('light', 'Light');
    divSelector.appendChild(btnLight);
    divSetting.appendChild(divSelector);
    const divCarousel = templateSettingCarousel('theme');
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
      this.page = template.page('setting');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$2);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('setting');

      this.fontSample = template.element('div', 'font-sample', null, null, null);
      this.fontSample.innerHTML = '<p class="font-sample-verse">' +
        '<span class="font--bold">1 John 4:19 </span>' +
        'We love him, because he first loved us.</p>';
      this.scroll.appendChild(this.fontSample);

      this.divSettingFont = templateSettingFont('font', 'Font');
      this.scroll.appendChild(this.divSettingFont);

      this.divSettingFontSize = templateSettingFontSize('font-size', 'Font Size');
      this.scroll.appendChild(this.divSettingFontSize);

      this.divSettingFontVariant = templateSettingFontVariant('font-variant', 'Font Variant');
      this.scroll.appendChild(this.divSettingFontVariant);

      this.divSettingTheme = templateSettingTheme('theme', 'Theme');
      this.scroll.appendChild(this.divSettingTheme);

      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$2);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    fontClick(target) {
      const btn = target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnPrevFont) {
          queue.publish('setting.font-prev', null);
        } else if (btn === this.btnNextFont) {
          queue.publish('setting.font-next', null);
        }
      }
    }

    fontSizeClick(target) {
      const btn = target.closest('div.btn-font-size');
      if (btn) {
        if (btn.classList.contains('btn-font-size')) {
          const dataSize = btn.dataset.size;
          queue.publish('setting.font-size', dataSize);
        }
      }
    }

    fontVariantClick(target) {
      const btn = target.closest('div.btn-font-variant');
      if (btn) {
        if (btn.classList.contains('btn-font-variant')) {
          const dataVariant = btn.dataset.variant;
          queue.publish('setting.font-variant', dataVariant);
        }
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

    fontVariantUpdate(fontVariant) {
      this.fontVariant = fontVariant;
      this.updateFontVariantBtn();
      this.updateFontVariant();
      this.lastFontVariant = this.fontVariant;
    }

    getElements() {
      this.divCarouselFont = this.divSettingFont.querySelector('.carousel--font');
      this.btnPrevFont = this.divCarouselFont.querySelector('.btn-icon--prev');
      this.divNameFont = this.divCarouselFont.querySelector('.name--font');
      this.btnNextFont = this.divCarouselFont.querySelector('.btn-icon--next');

      this.divSelectorFontSize = this.divSettingFontSize.querySelector('.selector--font-size');
      this.divSelectorFontVariant = this.divSettingFontVariant.querySelector('.selector--font-variant');

      this.divSelectorThemeType = this.divSettingTheme.querySelector('.selector--theme-type');
      this.btnDarkTheme = this.divSelectorThemeType.querySelector('.theme-type--dark');
      this.btnLightTheme = this.divSelectorThemeType.querySelector('.theme-type--light');
      this.divCarouselTheme = this.divSettingTheme.querySelector('.carousel--theme');
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
      this.lastFontVariant = null;
      this.lastTheme = null;
    }

    scrollClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div');
      if (btn) {
        if (this.divCarouselFont.contains(btn)) {
          this.fontClick(btn);
        } else if (this.divSelectorFontSize.contains(btn)) {
          this.fontSizeClick(btn);
        } else if (this.divSelectorFontVariant.contains(btn)) {
          this.fontVariantClick(btn);
        } else if (this.divSelectorThemeType.contains(btn)) {
          this.themeTypeClick(btn);
        } else if (this.divCarouselTheme.contains(btn)) {
          this.themeClick(btn);
        }
      }
    }

    show() {
      this.page.classList.remove('page--hide');
    }

    subscribe() {
      queue.subscribe('font.update', (font) => {
        this.fontUpdate(font);
      });

      queue.subscribe('font-size.update', (fontSize) => {
        this.fontSizeUpdate(fontSize);
      });

      queue.subscribe('font-variant.update', (fontVariant) => {
        this.fontVariantUpdate(fontVariant);
      });

      queue.subscribe('setting.hide', () => {
        this.hide();
      });
      queue.subscribe('setting.show', () => {
        this.show();
      });

      queue.subscribe('theme.update', (theme) => {
        this.themeUpdate(theme);
      });
    }

    themeClick(target) {
      const btn = target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnPrevTheme) {
          queue.publish('setting.theme-prev', null);
        } else if (btn === this.btnNextTheme) {
          queue.publish('setting.theme-next', null);
        }
      }
    }

    themeTypeClick(target) {
      const btn = target.closest('div.btn-theme-type');
      if (btn) {
        if (btn === this.btnDarkTheme) {
          queue.publish('setting.theme-dark', null);
        } else if (btn === this.btnLightTheme) {
          queue.publish('setting.theme-light', null);
        }
      }
    }

    themeUpdate(theme) {
      this.theme = theme;
      this.updateThemeName();
      this.updateThemeType();
      this.lastTheme = this.theme;
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBack) {
          queue.publish('setting.back', null);
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
      this.activeFontSizeBtn = this.divSelectorFontSize.querySelector(`div[data-size="${this.fontSize}"]`);
      this.activeFontSizeBtn.classList.add('btn-font-size--active');
    }

    updateFontVariant() {
      if (this.lastFontVariant) {
        this.fontSample.classList.remove(this.lastFontVariant);
        this.divSelectorFontSize.classList.remove(this.lastFontVariant);
      }
      this.fontSample.classList.add(this.fontVariant);
      this.divSelectorFontSize.classList.add(this.fontVariant);
    }

    updateFontVariantBtn() {
      if (this.activeFontVariantBtn) {
        this.activeFontVariantBtn.classList.remove('btn-font-variant--active');
      }
      this.activeFontVariantBtn = this.divSelectorFontVariant.querySelector(`div[data-variant="${this.fontVariant}"]`);
      this.activeFontVariantBtn.classList.add('btn-font-variant--active');
    }

    updateThemeName() {
      this.divNameTheme.innerText = this.theme.themeName;
    }

    updateThemeType() {
      if (this.activeThemeTypeBtn) {
        this.activeThemeTypeBtn.classList.remove('btn-theme-type--active');
      }
      this.activeThemeTypeBtn = this.divSelectorThemeType.querySelector(`div[data-type="${this.theme.themeType}"]`);
      this.activeThemeTypeBtn.classList.add('btn-theme-type--active');
    }

  }

  class SettingController {

    constructor() {
      this.initialize();
    }

    back() {
      queue.publish('sidebar.change', 'none');
    }

    fontNext() {
      this.getNextFontIdx();
      queue.publish('font.change', this.fonts[this.fontIdx]);
    }

    fontPrev() {
      this.getPrevFontIdx();
      queue.publish('font.change', this.fonts[this.fontIdx]);
    }

    fontSize(fontSize) {
      queue.publish('font-size.change', fontSize);
    }

    fontUpdate(font) {
      this.font = font;
      if (!this.fontIdx) {
        this.fontIdx = this.fonts.findIndex((font) => {
          return font.fontName === this.font.fontName;
        });
      }
    }

    fontVariant(fontVariant) {
      queue.publish('font-variant.change', fontVariant);
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

    getDarkThemeIdx() {
      if (this.themes[this.themeIdx] === 'dark') {
        return this.themeIdx;
      }
      this.themeIdx = this.themes.findIndex((theme) => {
        return theme.themeType === 'dark' &&
          theme.themeName === this.theme.themeName;
      });
    }

    getLightThemeIdx() {
      if (this.themes[this.themeIdx] === 'light') {
        return this.themeIdx;
      }
      this.themeIdx = this.themes.findIndex((theme) => {
        return theme.themeType === 'light' &&
          theme.themeName === this.theme.themeName;
      });
    }

    getNextThemeIdx() {
      let nameIdx = this.themeNames.findIndex(x => x === this.theme.themeName);
      const nextNameIdx = nameIdx === this.maxThemeNamesIdx ? 0 : nameIdx += 1;
      this.themeIdx = this.themes.findIndex((theme) => {
        return theme.themeType === this.theme.themeType &&
          theme.themeName === this.themeNames[nextNameIdx];
      });
    }

    getPrevThemeIdx() {
      let nameIdx = this.themeNames.findIndex(x => x === this.theme.themeName);
      const nextNameIdx = nameIdx === 0 ? this.maxThemeNamesIdx : nameIdx -= 1;
      this.themeIdx = this.themes.findIndex((theme) => {
        return theme.themeType === this.theme.themeType &&
          theme.themeName === this.themeNames[nextNameIdx];
      });
    }

    initialize() {
      this.subscribe();
    }

    subscribe() {
      queue.subscribe('font.update', (font) => {
        this.fontUpdate(font);
      });

      queue.subscribe('fonts.update', (fonts) => {
        this.fontsUpdate(fonts);
      });

      queue.subscribe('setting.back', () => {
        this.back();
      });
      queue.subscribe('setting.font-next', () => {
        this.fontNext();
      });
      queue.subscribe('setting.font-prev', () => {
        this.fontPrev();
      });
      queue.subscribe('setting.font-size', (fontSize) => {
        this.fontSize(fontSize);
      });
      queue.subscribe('setting.font-variant', (fontVariant) => {
        this.fontVariant(fontVariant);
      });

      queue.subscribe('setting.theme-next', () => {
        this.themeNext();
      });
      queue.subscribe('setting.theme-prev', () => {
        this.themePrev();
      });

      queue.subscribe('setting.theme-dark', () => {
        this.themeDark();
      });
      queue.subscribe('setting.theme-light', () => {
        this.themeLight();
      });

      queue.subscribe('theme.update', (theme) => {
        this.themeUpdate(theme);
      });

      queue.subscribe('themes.update', (themes) => {
        this.themesUpdate(themes);
      });
    }

    themeDark() {
      const idxNow = this.themeIdx;
      this.getDarkThemeIdx();
      if (idxNow === this.themeIdx) {
        return;
      }
      queue.publish('theme.change', this.themes[this.themeIdx]);
    }

    themeLight() {
      const idxNow = this.themeIdx;
      this.getLightThemeIdx();
      if (idxNow === this.themeIdx) {
        return;
      }
      queue.publish('theme.change', this.themes[this.themeIdx]);
    }

    themeNext() {
      this.getNextThemeIdx();
      queue.publish('theme.change', this.themes[this.themeIdx]);
    }

    themePrev() {
      this.getPrevThemeIdx();
      queue.publish('theme.change', this.themes[this.themeIdx]);
    }

    themeUpdate(theme) {
      this.theme = theme;
      if (!this.themeIdx) {
        this.themeIdx = this.themes.findIndex((theme) => {
          return theme.themeType === this.theme.themeType &&
            theme.themeName === this.theme.themeName;
        });
      }
      if (!this.themeNameIdx) {
        this.themeNameIdx = this.themeNames.findIndex((theme) => {
          return theme.themeName === this.theme.themeName;
        });
      }
    }

    themesUpdate(themes) {
      this.themes = themes;
      this.maxThemesIdx = this.themes.length - 1;
      this.themeNames = [...new Set(this.themes.map(x => x.themeName))];
      this.maxThemeNamesIdx = this.themeNames.length - 1;
    }

  }

  const validTasks = [
    'help-read', 'help-topic',
  ];
  const validTopics = [
    'about', 'bookmark', 'clipboard-mode', 'help', 'name-mode', 'navigator',
    'overview', 'read', 'search', 'setting', 'strong', 'the-acts-of-peter',
    'thats-my-king',
  ];

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
      const defaultTask = 'help-read';
      let helpTask = localStorage.getItem('helpTask');
      if (!helpTask) {
        helpTask = defaultTask;
      } else {
        try {
          helpTask = JSON.parse(helpTask);
        } catch (error) {
          helpTask = defaultTask;
        }
        if (!validTasks.includes(helpTask)) {
          helpTask = defaultTask;
        }
      }
      this.taskChange(helpTask);
    }

    restoreTopic() {
      const defaultTopic = 'overview';
      let helpTopic = localStorage.getItem('helpTopic');
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
      localStorage.setItem('helpTask', JSON.stringify(this.helpTask));
    }

    saveHelpTopic() {
      localStorage.setItem('helpTopic', JSON.stringify(this.helpTopic));
    }

    subscribe() {
      queue.subscribe('help.restore', () => {
        this.restore();
      });
      queue.subscribe('help.task.change', (helpTask) => {
        this.taskChange(helpTask);
      });
      queue.subscribe('help.topic.change', (helpTopic) => {
        this.topicChange(helpTopic);
      });
    }

    taskChange(helpTask) {
      this.helpTask = helpTask;
      this.saveHelpTask();
      queue.publish('help.task.update', this.helpTask);
    }

    topicChange(helpTopic) {
      this.helpTopic = helpTopic;
      this.saveHelpTopic();
      queue.publish('help.topic.update', this.helpTopic);
    }

  }

  const lowerToolSet$1 = [
    { type: 'btn', icon: 'back', ariaLabel: null },
    { type: 'btn', icon: 'help-read', ariaLabel: null },
  ];

  const upperToolSet$1 = [
    { type: 'banner', cssModifier: 'topic', text: 'Topic' },
  ];

  const helpTopicList = [
    { topic: 'about', name: 'About' },
    { topic: 'overview', name: 'Overview' },
    { topic: 'read', name: 'Read' },
    { topic: 'clipboard-mode', name: 'Clipboard Mode' },
    { topic: 'name-mode', name: 'Name Mode' },
    { topic: 'navigator', name: 'Navigator' },
    { topic: 'bookmark', name: 'Bookmark' },
    { topic: 'search', name: 'Search' },
    { topic: 'strong', name: 'Strong' },
    { topic: 'setting', name: 'Setting' },
    { topic: 'help', name: 'Help' },
    { topic: 'the-acts-of-peter', name: 'The Acts of Peter' },
    { topic: 'thats-my-king', name: 'That\'s MY KING!' },
  ];

  const templateBtnTopic = (helpTopic) => {
    const btnTopic = template.element('div', 'btn-topic', helpTopic.topic, null, helpTopic.name);
    btnTopic.dataset.topic = helpTopic.topic;
    return btnTopic;
  };

  const templateListTopic = () => {
    const list = template.element('div', 'list', 'topic', null, null);
    for (const topic of helpTopicList) {
      const btn = templateBtnTopic(topic);
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
      this.page = template.page('help-topic');

      this.toolbarUpper = template.toolbarUpper(upperToolSet$1);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('help-topic');
      this.list = templateListTopic();
      this.scroll.appendChild(this.list);

      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet$1);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
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

    scrollClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-topic');
      if (btn) {
        if (btn.classList.contains('btn-topic')) {
          const helpTopic = btn.dataset.topic;
          queue.publish('help-topic.select', helpTopic);
        }
      }
    }

    show() {
      this.page.classList.remove('page--hide');
    }

    subscribe() {
      queue.subscribe('help-topic.show', () => {
        this.show();
      });
      queue.subscribe('help-topic.hide', () => {
        this.hide();
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBack) {
          queue.publish('help.back', null);
        } else if (btn === this.btnHelpRead) {
          queue.publish('help-read', null);
        }
      }
    }

  }

  const lowerToolSet = [
    { type: 'btn', icon: 'back', ariaLabel: null },
    { type: 'btn', icon: 'help-topic', ariaLabel: null },
  ];

  const upperToolSet = [
    { type: 'banner', cssModifier: 'help-read', text: null },
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
      this.page = template.page('help-read');

      this.toolbarUpper = template.toolbarUpper(upperToolSet);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = template.scroll('help-read');
      this.page.appendChild(this.scroll);

      this.toolbarLower = template.toolbarLower(lowerToolSet);
      this.page.appendChild(this.toolbarLower);

      const container = document.querySelector('.container');
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

    show() {
      this.page.classList.remove('page--hide');
    }

    subscribe() {
      queue.subscribe('help-read.show', () => {
        this.show();
      });
      queue.subscribe('help-read.hide', () => {
        this.hide();
      });

      queue.subscribe('help.topic.update', (helpTopic) => {
        this.topicUpdate(helpTopic);
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      const btn = event.target.closest('div.btn-icon');
      if (btn) {
        if (btn === this.btnBack) {
          queue.publish('help.back', null);
        } else if (btn === this.btnHelpTopic) {
          queue.publish('help-topic', null);
        }
      }
    }

    topicUpdate(helpTopic) {
      this.updateBanner(helpTopic);
      this.scroll.innerHTML = '';
      const url = `help/${helpTopic}.html`;
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
        console.log(error.message);
      });
    }

    updateBanner(helpTopic) {
      const title = helpTopicList.find(obj => obj.topic === helpTopic).name;
      this.banner.textContent = title;
    }

  }

  class HelpController {

    constructor() {
      this.initialize();
    }

    back() {
      queue.publish('sidebar.change', 'none');
    }

    hide() {
      queue.publish(`${this.helpTask}.hide`, null);
    }

    initialize() {
      this.subscribe();
    }

    readPane() {
      queue.publish('help.task.change', 'help-read');
    }

    show() {
      queue.publish(`${this.helpTask}.show`, null);
    }

    sidebarUpdate(sidebar) {
      this.sidebar = sidebar;
    }

    subscribe() {
      queue.subscribe('help-read', () => {
        this.readPane();
      });

      queue.subscribe('help-topic', (helpTopic) => {
        this.topicPane(helpTopic);
      });
      queue.subscribe('help-topic.select', (helpTopic) => {
        this.topicSelect(helpTopic);
      });

      queue.subscribe('help.back', () => {
        this.back();
      });
      queue.subscribe('help.hide', () => {
        this.hide();
      });
      queue.subscribe('help.show', () => {
        this.show();
      });
      queue.subscribe('help.task.update', (helpTask) => {
        this.taskUpdate(helpTask);
      });
      queue.subscribe('help.topic.update', () => {
        this.topicUpdate();
      });

      queue.subscribe('sidebar.update', (sidebar) => {
        this.sidebarUpdate(sidebar);
      });
    }

    taskUpdate(helpTask) {
      if (this.sidebar === 'help') {
        if (this.helpTask !== helpTask) {
          queue.publish(`${this.helpTask}.hide`, null);
          this.helpTask = helpTask;
          queue.publish(`${this.helpTask}.show`, null);
        }
      } else {
        this.helpTask = helpTask;
      }
    }

    topicPane() {
      queue.publish('help.task.change', 'help-topic');
    }

    topicSelect(helpTopic) {
      this.topicSelectPending = true;
      queue.publish('help.topic.change', helpTopic);
    }

    topicUpdate() {
      if (this.topicSelectPending) {
        this.topicSelectPending = false;
        queue.publish('help.task.change', 'help-read');
      }
    }

  }

  const APP_FONT = 'font--roboto';

  document.querySelector('.load-msg');
  document.querySelector('.load-scroll');

  (async () => {
    const body = document.body;
    const load = body.querySelector('.load');

    await initializeTomeLists();
    await initializeKjvPureDb();
    await initializeKjvNameDb();
    await initializeStrongDictDb();
    await initializeStrongPure();
    await initializeStrongName();

    new DbModel();

    new ReadView();
    const readController = new ReadController();
    new ReadModel();

    new NavigatorBookView();
    new NavigatorChapterView();
    new NavigatorController();
    new NavigatorModel();

    new BookmarkListView();
    new BookmarkMoveCopyView();
    new BookmarkFolderView();
    new BookmarkFolderAddView();
    new BookmarkFolderDeleteView();
    new BookmarkFolderRenameView();
    new BookmarkExportview();
    new BookmarkImportView();
    new BookmarkController();
    new BookmarkModel();

    new SearchResultView();
    new SearchFilterView();
    new SearchHistoryView();
    new SearchLookupView();
    new SearchController();
    new SearchModel();

    new StrongDefView();
    new StrongFilterView();
    new StrongHistoryView();
    new StrongLookupView();
    new StrongResultView();
    new StrongVerseView();
    new StrongController();
    new StrongModel();

    new SettingView();
    new SettingController();
    new SettingModel();

    new HelpReadView();
    new HelpTopicView();
    new HelpController();
    new HelpModel();

    load.classList.add('hide');
    document.documentElement.classList.add(APP_FONT);

    console.log(`intializeApp():     ${Date.now()}`);
    readController.initializeApp();
    console.log(`ready:              ${Date.now()}`);

  })();

})();
