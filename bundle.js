(function () {
  'use strict';

  let loadMsg = document.querySelector('.load-msg');
  let loadScroll = document.querySelector('.load-scroll');
  let newInstall = false;
  let updateFound = false;

  window.onload = () => {
    console.log(`window.onload:      ${Date.now()}`);
    progress('');
    progress('* Download app *');

    {
      swEvents();
    }
  };

  let swEvents = () => {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.ready.then(() => {
        console.log(`sw.ready:           ${Date.now()}`);
        if (!updateFound) {
          loadApp();
        } else {
          newInstall = true;
          console.log(`new install:        ${Date.now()}`);
        }
      }).catch((error) => {
        console.log(`sw.ready error: ${error.message}`);
      });
    }

    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log(`sw registered:      ${Date.now()}`);
      reg.onupdatefound = () => {
        updateFound = true;
        console.log(`reg.updatefound:    ${Date.now()}`);
        const newWorker = reg.installing;
        newWorker.onstatechange = (event) => {
          if (event.target.state === 'activated') {
            console.log(`nw.activated:       ${Date.now()}`);
            if (newInstall) {
              loadApp();
            } else {
              refresh();
            }
          }
        };
      };
    }).catch((error) => {
      console.log(`reg.error: ${error.message}`);
    });
  };

  const progress = (msg) => {
    loadMsg.innerHTML += msg + '<br>';
    loadScroll.scrollTop = loadScroll.scrollHeight;
  };

  const refresh = () => {
    console.log(`refresh():          ${Date.now()}`);
    // window.location.reload(true);
  };

  const loadApp = async () => {
    console.log(`loadApp():          ${Date.now()}`);
    progress('');
    progress('* Launch app *');

    let font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = '/css/font.css';
    document.head.appendChild(font);

    let script = document.createElement('script');
    {
      script.src = '/bundle.js';
    }
    document.body.appendChild(script);
  };

  const e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:global,t=Object.keys,n=Array.isArray;function r(e,n){return "object"!=typeof n||t(n).forEach((function(t){e[t]=n[t];})),e}"undefined"==typeof Promise||e.Promise||(e.Promise=Promise);const s=Object.getPrototypeOf,i={}.hasOwnProperty;function o(e,t){return i.call(e,t)}function a(e,n){"function"==typeof n&&(n=n(s(e))),("undefined"==typeof Reflect?t:Reflect.ownKeys)(n).forEach((t=>{l(e,t,n[t]);}));}const u=Object.defineProperty;function l(e,t,n,s){u(e,t,r(n&&o(n,"get")&&"function"==typeof n.get?{get:n.get,set:n.set,configurable:!0}:{value:n,configurable:!0,writable:!0},s));}function c(e){return {from:function(t){return e.prototype=Object.create(t.prototype),l(e.prototype,"constructor",e),{extend:a.bind(null,e.prototype)}}}}const h=Object.getOwnPropertyDescriptor;function d(e,t){let n;return h(e,t)||(n=s(e))&&d(n,t)}const f=[].slice;function p(e,t,n){return f.call(e,t,n)}function y(e,t){return t(e)}function m(e){if(!e)throw new Error("Assertion Failed")}function v(t){e.setImmediate?setImmediate(t):setTimeout(t,0);}function g(e,t){return e.reduce(((e,n,r)=>{var s=t(n,r);return s&&(e[s[0]]=s[1]),e}),{})}function b(e,t){if(o(e,t))return e[t];if(!t)return e;if("string"!=typeof t){for(var n=[],r=0,s=t.length;r<s;++r){var i=b(e,t[r]);n.push(i);}return n}var a=t.indexOf(".");if(-1!==a){var u=e[t.substr(0,a)];return void 0===u?void 0:b(u,t.substr(a+1))}}function _(e,t,r){if(e&&void 0!==t&&(!("isFrozen"in Object)||!Object.isFrozen(e)))if("string"!=typeof t&&"length"in t){m("string"!=typeof r&&"length"in r);for(var s=0,i=t.length;s<i;++s)_(e,t[s],r[s]);}else {var o=t.indexOf(".");if(-1!==o){var a=t.substr(0,o),u=t.substr(o+1);if(""===u)void 0===r?n(e)&&!isNaN(parseInt(a))?e.splice(a,1):delete e[a]:e[a]=r;else {var l=e[a];l||(l=e[a]={}),_(l,u,r);}}else void 0===r?n(e)&&!isNaN(parseInt(t))?e.splice(t,1):delete e[t]:e[t]=r;}}function w(e){var t={};for(var n in e)o(e,n)&&(t[n]=e[n]);return t}const x=[].concat;function k(e){return x.apply([],e)}const E="Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(k([8,16,32,64].map((e=>["Int","Uint","Float"].map((t=>t+e+"Array")))))).filter((t=>e[t])),P=E.map((t=>e[t]));g(E,(e=>[e,!0]));let K=null;function O(e){K="undefined"!=typeof WeakMap&&new WeakMap;const t=S(e);return K=null,t}function S(e){if(!e||"object"!=typeof e)return e;let t=K&&K.get(e);if(t)return t;if(n(e)){t=[],K&&K.set(e,t);for(var r=0,i=e.length;r<i;++r)t.push(S(e[r]));}else if(P.indexOf(e.constructor)>=0)t=e;else {const n=s(e);for(var a in t=n===Object.prototype?{}:Object.create(n),K&&K.set(e,t),e)o(e,a)&&(t[a]=S(e[a]));}return t}const{toString:A}={};function C(e){return A.call(e).slice(8,-1)}const j="undefined"!=typeof Symbol?Symbol.iterator:"@@iterator",D="symbol"==typeof j?function(e){var t;return null!=e&&(t=e[j])&&t.apply(e)}:function(){return null},I={};function B(e){var t,r,s,i;if(1===arguments.length){if(n(e))return e.slice();if(this===I&&"string"==typeof e)return [e];if(i=D(e)){for(r=[];!(s=i.next()).done;)r.push(s.value);return r}if(null==e)return [e];if("number"==typeof(t=e.length)){for(r=new Array(t);t--;)r[t]=e[t];return r}return [e]}for(t=arguments.length,r=new Array(t);t--;)r[t]=arguments[t];return r}const T="undefined"!=typeof Symbol?e=>"AsyncFunction"===e[Symbol.toStringTag]:()=>!1;var R="undefined"!=typeof location&&/^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);function F(e,t){R=e,M=t;}var M=()=>!0;const N=!new Error("").stack;function q(){if(N)try{throw q.arguments,new Error}catch(e){return e}return new Error}function $(e,t){var n=e.stack;return n?(t=t||0,0===n.indexOf(e.name)&&(t+=(e.name+e.message).split("\n").length),n.split("\n").slice(t).filter(M).map((e=>"\n"+e)).join("")):""}var U=["Unknown","Constraint","Data","TransactionInactive","ReadOnly","Version","NotFound","InvalidState","InvalidAccess","Abort","Timeout","QuotaExceeded","Syntax","DataClone"],L=["Modify","Bulk","OpenFailed","VersionChange","Schema","Upgrade","InvalidTable","MissingAPI","NoSuchDatabase","InvalidArgument","SubTransaction","Unsupported","Internal","DatabaseClosed","PrematureCommit","ForeignAwait"].concat(U),V={VersionChanged:"Database version changed by other database connection",DatabaseClosed:"Database has been closed",Abort:"Transaction aborted",TransactionInactive:"Transaction has already completed or failed",MissingAPI:"IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"};function W(e,t){this._e=q(),this.name=e,this.message=t;}function Y(e,t){return e+". Errors: "+Object.keys(t).map((e=>t[e].toString())).filter(((e,t,n)=>n.indexOf(e)===t)).join("\n")}function z(e,t,n,r){this._e=q(),this.failures=t,this.failedKeys=r,this.successCount=n,this.message=Y(e,t);}function G(e,t){this._e=q(),this.name="BulkError",this.failures=Object.keys(t).map((e=>t[e])),this.failuresByPos=t,this.message=Y(e,t);}c(W).from(Error).extend({stack:{get:function(){return this._stack||(this._stack=this.name+": "+this.message+$(this._e,2))}},toString:function(){return this.name+": "+this.message}}),c(z).from(W),c(G).from(W);var H=L.reduce(((e,t)=>(e[t]=t+"Error",e)),{});const Q=W;var X=L.reduce(((e,t)=>{var n=t+"Error";function r(e,r){this._e=q(),this.name=n,e?"string"==typeof e?(this.message=`${e}${r?"\n "+r:""}`,this.inner=r||null):"object"==typeof e&&(this.message=`${e.name} ${e.message}`,this.inner=e):(this.message=V[t]||n,this.inner=null);}return c(r).from(Q),e[t]=r,e}),{});X.Syntax=SyntaxError,X.Type=TypeError,X.Range=RangeError;var J=U.reduce(((e,t)=>(e[t+"Error"]=X[t],e)),{});var Z=L.reduce(((e,t)=>(-1===["Syntax","Type","Range"].indexOf(t)&&(e[t+"Error"]=X[t]),e)),{});function ee(){}function te(e){return e}function ne(e,t){return null==e||e===te?t:function(n){return t(e(n))}}function re(e,t){return function(){e.apply(this,arguments),t.apply(this,arguments);}}function se(e,t){return e===ee?t:function(){var n=e.apply(this,arguments);void 0!==n&&(arguments[0]=n);var r=this.onsuccess,s=this.onerror;this.onsuccess=null,this.onerror=null;var i=t.apply(this,arguments);return r&&(this.onsuccess=this.onsuccess?re(r,this.onsuccess):r),s&&(this.onerror=this.onerror?re(s,this.onerror):s),void 0!==i?i:n}}function ie(e,t){return e===ee?t:function(){e.apply(this,arguments);var n=this.onsuccess,r=this.onerror;this.onsuccess=this.onerror=null,t.apply(this,arguments),n&&(this.onsuccess=this.onsuccess?re(n,this.onsuccess):n),r&&(this.onerror=this.onerror?re(r,this.onerror):r);}}function oe(e,t){return e===ee?t:function(n){var s=e.apply(this,arguments);r(n,s);var i=this.onsuccess,o=this.onerror;this.onsuccess=null,this.onerror=null;var a=t.apply(this,arguments);return i&&(this.onsuccess=this.onsuccess?re(i,this.onsuccess):i),o&&(this.onerror=this.onerror?re(o,this.onerror):o),void 0===s?void 0===a?void 0:a:r(s,a)}}function ae(e,t){return e===ee?t:function(){return !1!==t.apply(this,arguments)&&e.apply(this,arguments)}}function ue(e,t){return e===ee?t:function(){var n=e.apply(this,arguments);if(n&&"function"==typeof n.then){for(var r=this,s=arguments.length,i=new Array(s);s--;)i[s]=arguments[s];return n.then((function(){return t.apply(r,i)}))}return t.apply(this,arguments)}}Z.ModifyError=z,Z.DexieError=W,Z.BulkError=G;var le={};const[ce,he,de]="undefined"==typeof Promise?[]:(()=>{let e=Promise.resolve();if("undefined"==typeof crypto||!crypto.subtle)return [e,s(e),e];const t=crypto.subtle.digest("SHA-512",new Uint8Array([0]));return [t,s(t),e]})(),fe=he&&he.then,pe=ce&&ce.constructor,ye=!!de;var me=!1,ve=de?()=>{de.then(qe);}:e.setImmediate?setImmediate.bind(null,qe):e.MutationObserver?()=>{var e=document.createElement("div");new MutationObserver((()=>{qe(),e=null;})).observe(e,{attributes:!0}),e.setAttribute("i","1");}:()=>{setTimeout(qe,0);},ge=function(e,t){Oe.push([e,t]),_e&&(ve(),_e=!1);},be=!0,_e=!0,we=[],xe=[],ke=null,Ee=te,Pe={id:"global",global:!0,ref:0,unhandleds:[],onunhandled:ct,pgp:!1,env:{},finalize:function(){this.unhandleds.forEach((e=>{try{ct(e[0],e[1]);}catch(e){}}));}},Ke=Pe,Oe=[],Se=0,Ae=[];function Ce(e){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");this._listeners=[],this.onuncatched=ee,this._lib=!1;var t=this._PSD=Ke;if(R&&(this._stackHolder=q(),this._prev=null,this._numPrev=0),"function"!=typeof e){if(e!==le)throw new TypeError("Not a function");return this._state=arguments[1],this._value=arguments[2],void(!1===this._state&&Be(this,this._value))}this._state=null,this._value=null,++t.ref,Ie(this,e);}const je={get:function(){var e=Ke,t=Qe;function n(n,r){var s=!e.global&&(e!==Ke||t!==Qe);const i=s&&!et();var o=new Ce(((t,o)=>{Re(this,new De(ut(n,e,s,i),ut(r,e,s,i),t,o,e));}));return R&&Ne(o,this),o}return n.prototype=le,n},set:function(e){l(this,"then",e&&e.prototype===le?je:{get:function(){return e},set:je.set});}};function De(e,t,n,r,s){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.resolve=n,this.reject=r,this.psd=s;}function Ie(e,t){try{t((t=>{if(null===e._state){if(t===e)throw new TypeError("A promise cannot be resolved with itself.");var n=e._lib&&$e();t&&"function"==typeof t.then?Ie(e,((e,n)=>{t instanceof Ce?t._then(e,n):t.then(e,n);})):(e._state=!0,e._value=t,Te(e)),n&&Ue();}}),Be.bind(null,e));}catch(t){Be(e,t);}}function Be(e,t){if(xe.push(t),null===e._state){var n=e._lib&&$e();t=Ee(t),e._state=!1,e._value=t,R&&null!==t&&"object"==typeof t&&!t._promise&&function(e,t,n){try{e.apply(null,n);}catch(e){t&&t(e);}}((()=>{var n=d(t,"stack");t._promise=e,l(t,"stack",{get:()=>me?n&&(n.get?n.get.apply(t):n.value):e.stack});})),function(e){we.some((t=>t._value===e._value))||we.push(e);}(e),Te(e),n&&Ue();}}function Te(e){var t=e._listeners;e._listeners=[];for(var n=0,r=t.length;n<r;++n)Re(e,t[n]);var s=e._PSD;--s.ref||s.finalize(),0===Se&&(++Se,ge((()=>{0==--Se&&Le();}),[]));}function Re(e,t){if(null!==e._state){var n=e._state?t.onFulfilled:t.onRejected;if(null===n)return (e._state?t.resolve:t.reject)(e._value);++t.psd.ref,++Se,ge(Fe,[n,e,t]);}else e._listeners.push(t);}function Fe(e,t,n){try{ke=t;var r,s=t._value;t._state?r=e(s):(xe.length&&(xe=[]),r=e(s),-1===xe.indexOf(s)&&function(e){var t=we.length;for(;t;)if(we[--t]._value===e._value)return void we.splice(t,1)}(t)),n.resolve(r);}catch(e){n.reject(e);}finally{ke=null,0==--Se&&Le(),--n.psd.ref||n.psd.finalize();}}function Me(e,t,n){if(t.length===n)return t;var r="";if(!1===e._state){var s,i,o=e._value;null!=o?(s=o.name||"Error",i=o.message||o,r=$(o,0)):(s=o,i=""),t.push(s+(i?": "+i:"")+r);}return R&&((r=$(e._stackHolder,2))&&-1===t.indexOf(r)&&t.push(r),e._prev&&Me(e._prev,t,n)),t}function Ne(e,t){var n=t?t._numPrev+1:0;n<100&&(e._prev=t,e._numPrev=n);}function qe(){$e()&&Ue();}function $e(){var e=be;return be=!1,_e=!1,e}function Ue(){var e,t,n;do{for(;Oe.length>0;)for(e=Oe,Oe=[],n=e.length,t=0;t<n;++t){var r=e[t];r[0].apply(null,r[1]);}}while(Oe.length>0);be=!0,_e=!0;}function Le(){var e=we;we=[],e.forEach((e=>{e._PSD.onunhandled.call(null,e._value,e);}));for(var t=Ae.slice(0),n=t.length;n;)t[--n]();}function Ve(e){return new Ce(le,!1,e)}function We(e,t){var n=Ke;return function(){var r=$e(),s=Ke;try{return st(n,!0),e.apply(this,arguments)}catch(e){t&&t(e);}finally{st(s,!1),r&&Ue();}}}a(Ce.prototype,{then:je,_then:function(e,t){Re(this,new De(null,null,e,t,Ke));},catch:function(e){if(1===arguments.length)return this.then(null,e);var t=arguments[0],n=arguments[1];return "function"==typeof t?this.then(null,(e=>e instanceof t?n(e):Ve(e))):this.then(null,(e=>e&&e.name===t?n(e):Ve(e)))},finally:function(e){return this.then((t=>(e(),t)),(t=>(e(),Ve(t))))},stack:{get:function(){if(this._stack)return this._stack;try{me=!0;var e=Me(this,[],20).join("\nFrom previous: ");return null!==this._state&&(this._stack=e),e}finally{me=!1;}}},timeout:function(e,t){return e<1/0?new Ce(((n,r)=>{var s=setTimeout((()=>r(new X.Timeout(t))),e);this.then(n,r).finally(clearTimeout.bind(null,s));})):this}}),"undefined"!=typeof Symbol&&Symbol.toStringTag&&l(Ce.prototype,Symbol.toStringTag,"Dexie.Promise"),Pe.env=it(),a(Ce,{all:function(){var e=B.apply(null,arguments).map(tt);return new Ce((function(t,n){0===e.length&&t([]);var r=e.length;e.forEach(((s,i)=>Ce.resolve(s).then((n=>{e[i]=n,--r||t(e);}),n)));}))},resolve:e=>{if(e instanceof Ce)return e;if(e&&"function"==typeof e.then)return new Ce(((t,n)=>{e.then(t,n);}));var t=new Ce(le,!0,e);return Ne(t,ke),t},reject:Ve,race:function(){var e=B.apply(null,arguments).map(tt);return new Ce(((t,n)=>{e.map((e=>Ce.resolve(e).then(t,n)));}))},PSD:{get:()=>Ke,set:e=>Ke=e},totalEchoes:{get:()=>Qe},newPSD:Je,usePSD:ot,scheduler:{get:()=>ge,set:e=>{ge=e;}},rejectionMapper:{get:()=>Ee,set:e=>{Ee=e;}},follow:(e,t)=>new Ce(((n,r)=>Je(((t,n)=>{var r=Ke;r.unhandleds=[],r.onunhandled=n,r.finalize=re((function(){!function(e){function t(){e(),Ae.splice(Ae.indexOf(t),1);}Ae.push(t),++Se,ge((()=>{0==--Se&&Le();}),[]);}((()=>{0===this.unhandleds.length?t():n(this.unhandleds[0]);}));}),r.finalize),e();}),t,n,r)))}),pe&&(pe.allSettled&&l(Ce,"allSettled",(function(){const e=B.apply(null,arguments).map(tt);return new Ce((t=>{0===e.length&&t([]);let n=e.length;const r=new Array(n);e.forEach(((e,s)=>Ce.resolve(e).then((e=>r[s]={status:"fulfilled",value:e}),(e=>r[s]={status:"rejected",reason:e})).then((()=>--n||t(r)))));}))})),pe.any&&"undefined"!=typeof AggregateError&&l(Ce,"any",(function(){const e=B.apply(null,arguments).map(tt);return new Ce(((t,n)=>{0===e.length&&n(new AggregateError([]));let r=e.length;const s=new Array(r);e.forEach(((e,i)=>Ce.resolve(e).then((e=>t(e)),(e=>{s[i]=e,--r||n(new AggregateError(s));}))));}))})));const Ye={awaits:0,echoes:0,id:0};var ze=0,Ge=[],He=0,Qe=0,Xe=0;function Je(e,t,n,s){var i=Ke,o=Object.create(i);o.parent=i,o.ref=0,o.global=!1,o.id=++Xe;var a=Pe.env;o.env=ye?{Promise:Ce,PromiseProp:{value:Ce,configurable:!0,writable:!0},all:Ce.all,race:Ce.race,allSettled:Ce.allSettled,any:Ce.any,resolve:Ce.resolve,reject:Ce.reject,nthen:lt(a.nthen,o),gthen:lt(a.gthen,o)}:{},t&&r(o,t),++i.ref,o.finalize=function(){--this.parent.ref||this.parent.finalize();};var u=ot(o,e,n,s);return 0===o.ref&&o.finalize(),u}function Ze(){return Ye.id||(Ye.id=++ze),++Ye.awaits,Ye.echoes+=100,Ye.id}function et(){return !!Ye.awaits&&(0==--Ye.awaits&&(Ye.id=0),Ye.echoes=100*Ye.awaits,!0)}function tt(e){return Ye.echoes&&e&&e.constructor===pe?(Ze(),e.then((e=>(et(),e)),(e=>(et(),ht(e))))):e}function nt(e){++Qe,Ye.echoes&&0!=--Ye.echoes||(Ye.echoes=Ye.id=0),Ge.push(Ke),st(e,!0);}function rt(){var e=Ge[Ge.length-1];Ge.pop(),st(e,!1);}function st(t,n){var r=Ke;if((n?!Ye.echoes||He++&&t===Ke:!He||--He&&t===Ke)||at(n?nt.bind(null,t):rt),t!==Ke&&(Ke=t,r===Pe&&(Pe.env=it()),ye)){var s=Pe.env.Promise,i=t.env;he.then=i.nthen,s.prototype.then=i.gthen,(r.global||t.global)&&(Object.defineProperty(e,"Promise",i.PromiseProp),s.all=i.all,s.race=i.race,s.resolve=i.resolve,s.reject=i.reject,i.allSettled&&(s.allSettled=i.allSettled),i.any&&(s.any=i.any));}}function it(){var t=e.Promise;return ye?{Promise:t,PromiseProp:Object.getOwnPropertyDescriptor(e,"Promise"),all:t.all,race:t.race,allSettled:t.allSettled,any:t.any,resolve:t.resolve,reject:t.reject,nthen:he.then,gthen:t.prototype.then}:{}}function ot(e,t,n,r,s){var i=Ke;try{return st(e,!0),t(n,r,s)}finally{st(i,!1);}}function at(e){fe.call(ce,e);}function ut(e,t,n,r){return "function"!=typeof e?e:function(){var s=Ke;n&&Ze(),st(t,!0);try{return e.apply(this,arguments)}finally{st(s,!1),r&&at(et);}}}function lt(e,t){return function(n,r){return e.call(this,ut(n,t),ut(r,t))}}-1===(""+fe).indexOf("[native code]")&&(Ze=et=ee);function ct(t,n){var s;try{s=n.onuncatched(t);}catch(e){}if(!1!==s)try{var i,o={promise:n,reason:t};if(e.document&&document.createEvent?((i=document.createEvent("Event")).initEvent("unhandledrejection",!0,!0),r(i,o)):e.CustomEvent&&r(i=new CustomEvent("unhandledrejection",{detail:o}),o),i&&e.dispatchEvent&&(dispatchEvent(i),!e.PromiseRejectionEvent&&e.onunhandledrejection))try{e.onunhandledrejection(i);}catch(e){}R&&i&&!i.defaultPrevented&&console.warn(`Unhandled rejection: ${t.stack||t}`);}catch(e){}}var ht=Ce.reject;function dt(e,t,n,r){if(e.idbdb&&(e._state.openComplete||Ke.letThrough||e._vip)){var s=e._createTransaction(t,n,e._dbSchema);try{s.create(),e._state.PR1398_maxLoop=3;}catch(s){return s.name===H.InvalidState&&e.isOpen()&&--e._state.PR1398_maxLoop>0?(console.warn("Dexie: Need to reopen db"),e._close(),e.open().then((()=>dt(e,t,n,r)))):ht(s)}return s._promise(t,((e,t)=>Je((()=>(Ke.trans=s,r(e,t,s)))))).then((e=>s._completion.then((()=>e))))}if(e._state.openComplete)return ht(new X.DatabaseClosed(e._state.dbOpenError));if(!e._state.isBeingOpened){if(!e._options.autoOpen)return ht(new X.DatabaseClosed);e.open().catch(ee);}return e._state.dbReadyPromise.then((()=>dt(e,t,n,r)))}const ft=String.fromCharCode(65535),pt="Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.",yt=[],mt="undefined"!=typeof navigator&&/(MSIE|Trident|Edge)/.test(navigator.userAgent),vt=mt,gt=mt,bt=e=>!/(dexie\.js|dexie\.min\.js)/.test(e);function _t(e,t){return e?t?function(){return e.apply(this,arguments)&&t.apply(this,arguments)}:e:t}const wt={type:3,lower:-1/0,lowerOpen:!1,upper:[[]],upperOpen:!1};function xt(e){return "string"!=typeof e||/\./.test(e)?e=>e:t=>(void 0===t[e]&&e in t&&delete(t=O(t))[e],t)}class kt{_trans(e,t,n){const r=this._tx||Ke.trans,s=this.name;function i(e,n,r){if(!r.schema[s])throw new X.NotFound("Table "+s+" not part of transaction");return t(r.idbtrans,r)}const o=$e();try{return r&&r.db===this.db?r===Ke.trans?r._promise(e,i,n):Je((()=>r._promise(e,i,n)),{trans:r,transless:Ke.transless||Ke}):dt(this.db,e,[this.name],i)}finally{o&&Ue();}}get(e,t){return e&&e.constructor===Object?this.where(e).first(t):this._trans("readonly",(t=>this.core.get({trans:t,key:e}).then((e=>this.hook.reading.fire(e))))).then(t)}where(e){if("string"==typeof e)return new this.db.WhereClause(this,e);if(n(e))return new this.db.WhereClause(this,`[${e.join("+")}]`);const r=t(e);if(1===r.length)return this.where(r[0]).equals(e[r[0]]);const s=this.schema.indexes.concat(this.schema.primKey).filter((e=>e.compound&&r.every((t=>e.keyPath.indexOf(t)>=0))&&e.keyPath.every((e=>r.indexOf(e)>=0))))[0];if(s&&this.db._maxKey!==ft)return this.where(s.name).equals(s.keyPath.map((t=>e[t])));!s&&R&&console.warn(`The query ${JSON.stringify(e)} on ${this.name} would benefit of a compound index [${r.join("+")}]`);const{idxByName:i}=this.schema,o=this.db._deps.indexedDB;function a(e,t){try{return 0===o.cmp(e,t)}catch(e){return !1}}const[u,l]=r.reduce((([t,r],s)=>{const o=i[s],u=e[s];return [t||o,t||!o?_t(r,o&&o.multi?e=>{const t=b(e,s);return n(t)&&t.some((e=>a(u,e)))}:e=>a(u,b(e,s))):r]}),[null,null]);return u?this.where(u.name).equals(e[u.keyPath]).filter(l):s?this.filter(l):this.where(r).equals("")}filter(e){return this.toCollection().and(e)}count(e){return this.toCollection().count(e)}offset(e){return this.toCollection().offset(e)}limit(e){return this.toCollection().limit(e)}each(e){return this.toCollection().each(e)}toArray(e){return this.toCollection().toArray(e)}toCollection(){return new this.db.Collection(new this.db.WhereClause(this))}orderBy(e){return new this.db.Collection(new this.db.WhereClause(this,n(e)?`[${e.join("+")}]`:e))}reverse(){return this.toCollection().reverse()}mapToClass(e){this.schema.mappedClass=e;const t=t=>{if(!t)return t;const n=Object.create(e.prototype);for(var r in t)if(o(t,r))try{n[r]=t[r];}catch(e){}return n};return this.schema.readHook&&this.hook.reading.unsubscribe(this.schema.readHook),this.schema.readHook=t,this.hook("reading",t),e}defineClass(){return this.mapToClass((function(e){r(this,e);}))}add(e,t){const{auto:n,keyPath:r}=this.schema.primKey;let s=e;return r&&n&&(s=xt(r)(e)),this._trans("readwrite",(e=>this.core.mutate({trans:e,type:"add",keys:null!=t?[t]:null,values:[s]}))).then((e=>e.numFailures?Ce.reject(e.failures[0]):e.lastResult)).then((t=>{if(r)try{_(e,r,t);}catch(e){}return t}))}update(e,r){if("object"!=typeof e||n(e))return this.where(":id").equals(e).modify(r);{const n=b(e,this.schema.primKey.keyPath);if(void 0===n)return ht(new X.InvalidArgument("Given object does not contain its primary key"));try{"function"!=typeof r?t(r).forEach((t=>{_(e,t,r[t]);})):r(e,{value:e,primKey:n});}catch(e){}return this.where(":id").equals(n).modify(r)}}put(e,t){const{auto:n,keyPath:r}=this.schema.primKey;let s=e;return r&&n&&(s=xt(r)(e)),this._trans("readwrite",(e=>this.core.mutate({trans:e,type:"put",values:[s],keys:null!=t?[t]:null}))).then((e=>e.numFailures?Ce.reject(e.failures[0]):e.lastResult)).then((t=>{if(r)try{_(e,r,t);}catch(e){}return t}))}delete(e){return this._trans("readwrite",(t=>this.core.mutate({trans:t,type:"delete",keys:[e]}))).then((e=>e.numFailures?Ce.reject(e.failures[0]):void 0))}clear(){return this._trans("readwrite",(e=>this.core.mutate({trans:e,type:"deleteRange",range:wt}))).then((e=>e.numFailures?Ce.reject(e.failures[0]):void 0))}bulkGet(e){return this._trans("readonly",(t=>this.core.getMany({keys:e,trans:t}).then((e=>e.map((e=>this.hook.reading.fire(e)))))))}bulkAdd(e,t,n){const r=Array.isArray(t)?t:void 0,s=(n=n||(r?void 0:t))?n.allKeys:void 0;return this._trans("readwrite",(t=>{const{auto:n,keyPath:i}=this.schema.primKey;if(i&&r)throw new X.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");if(r&&r.length!==e.length)throw new X.InvalidArgument("Arguments objects and keys must have the same length");const o=e.length;let a=i&&n?e.map(xt(i)):e;return this.core.mutate({trans:t,type:"add",keys:r,values:a,wantResults:s}).then((({numFailures:e,results:t,lastResult:n,failures:r})=>{if(0===e)return s?t:n;throw new G(`${this.name}.bulkAdd(): ${e} of ${o} operations failed`,r)}))}))}bulkPut(e,t,n){const r=Array.isArray(t)?t:void 0,s=(n=n||(r?void 0:t))?n.allKeys:void 0;return this._trans("readwrite",(t=>{const{auto:n,keyPath:i}=this.schema.primKey;if(i&&r)throw new X.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");if(r&&r.length!==e.length)throw new X.InvalidArgument("Arguments objects and keys must have the same length");const o=e.length;let a=i&&n?e.map(xt(i)):e;return this.core.mutate({trans:t,type:"put",keys:r,values:a,wantResults:s}).then((({numFailures:e,results:t,lastResult:n,failures:r})=>{if(0===e)return s?t:n;throw new G(`${this.name}.bulkPut(): ${e} of ${o} operations failed`,r)}))}))}bulkDelete(e){const t=e.length;return this._trans("readwrite",(t=>this.core.mutate({trans:t,type:"delete",keys:e}))).then((({numFailures:e,lastResult:n,failures:r})=>{if(0===e)return n;throw new G(`${this.name}.bulkDelete(): ${e} of ${t} operations failed`,r)}))}}function Et(e){var r={},s=function(t,n){if(n){for(var s=arguments.length,i=new Array(s-1);--s;)i[s-1]=arguments[s];return r[t].subscribe.apply(null,i),e}if("string"==typeof t)return r[t]};s.addEventType=a;for(var i=1,o=arguments.length;i<o;++i)a(arguments[i]);return s;function a(e,t,n){if("object"==typeof e)return u(e);t||(t=ae),n||(n=ee);var i={subscribers:[],fire:n,subscribe:function(e){-1===i.subscribers.indexOf(e)&&(i.subscribers.push(e),i.fire=t(i.fire,e));},unsubscribe:function(e){i.subscribers=i.subscribers.filter((function(t){return t!==e})),i.fire=i.subscribers.reduce(t,n);}};return r[e]=s[e]=i,i}function u(e){t(e).forEach((function(t){var r=e[t];if(n(r))a(t,e[t][0],e[t][1]);else {if("asap"!==r)throw new X.InvalidArgument("Invalid event config");var s=a(t,te,(function(){for(var e=arguments.length,t=new Array(e);e--;)t[e]=arguments[e];s.subscribers.forEach((function(e){v((function(){e.apply(null,t);}));}));}));}}));}}function Pt(e,t){return c(t).from({prototype:e}),t}function Kt(e,t){return !(e.filter||e.algorithm||e.or)&&(t?e.justLimit:!e.replayFilter)}function Ot(e,t){e.filter=_t(e.filter,t);}function St(e,t,n){var r=e.replayFilter;e.replayFilter=r?()=>_t(r(),t()):t,e.justLimit=n&&!r;}function At(e,t){if(e.isPrimKey)return t.primaryKey;const n=t.getIndexByKeyPath(e.index);if(!n)throw new X.Schema("KeyPath "+e.index+" on object store "+t.name+" is not indexed");return n}function Ct(e,t,n){const r=At(e,t.schema);return t.openCursor({trans:n,values:!e.keysOnly,reverse:"prev"===e.dir,unique:!!e.unique,query:{index:r,range:e.range}})}function jt(e,t,n,r){const s=e.replayFilter?_t(e.filter,e.replayFilter()):e.filter;if(e.or){const i={},a=(e,n,r)=>{if(!s||s(n,r,(e=>n.stop(e)),(e=>n.fail(e)))){var a=n.primaryKey,u=""+a;"[object ArrayBuffer]"===u&&(u=""+new Uint8Array(a)),o(i,u)||(i[u]=!0,t(e,n,r));}};return Promise.all([e.or._iterate(a,n),Dt(Ct(e,r,n),e.algorithm,a,!e.keysOnly&&e.valueMapper)])}return Dt(Ct(e,r,n),_t(e.algorithm,s),t,!e.keysOnly&&e.valueMapper)}function Dt(e,t,n,r){var s=We(r?(e,t,s)=>n(r(e),t,s):n);return e.then((e=>{if(e)return e.start((()=>{var n=()=>e.continue();t&&!t(e,(e=>n=e),(t=>{e.stop(t),n=ee;}),(t=>{e.fail(t),n=ee;}))||s(e.value,e,(e=>n=e)),n();}))}))}function It(e,t){try{const n=Bt(e),r=Bt(t);if(n!==r)return "Array"===n?1:"Array"===r?-1:"binary"===n?1:"binary"===r?-1:"string"===n?1:"string"===r?-1:"Date"===n?1:"Date"!==r?NaN:-1;switch(n){case"number":case"Date":case"string":return e>t?1:e<t?-1:0;case"binary":return function(e,t){const n=e.length,r=t.length,s=n<r?n:r;for(let n=0;n<s;++n)if(e[n]!==t[n])return e[n]<t[n]?-1:1;return n===r?0:n<r?-1:1}(Tt(e),Tt(t));case"Array":return function(e,t){const n=e.length,r=t.length,s=n<r?n:r;for(let n=0;n<s;++n){const r=It(e[n],t[n]);if(0!==r)return r}return n===r?0:n<r?-1:1}(e,t)}}catch(e){}return NaN}function Bt(e){const t=typeof e;if("object"!==t)return t;if(ArrayBuffer.isView(e))return "binary";const n=C(e);return "ArrayBuffer"===n?"binary":n}function Tt(e){return e instanceof Uint8Array?e:ArrayBuffer.isView(e)?new Uint8Array(e.buffer,e.byteOffset,e.byteLength):new Uint8Array(e)}class Rt{_read(e,t){var n=this._ctx;return n.error?n.table._trans(null,ht.bind(null,n.error)):n.table._trans("readonly",e).then(t)}_write(e){var t=this._ctx;return t.error?t.table._trans(null,ht.bind(null,t.error)):t.table._trans("readwrite",e,"locked")}_addAlgorithm(e){var t=this._ctx;t.algorithm=_t(t.algorithm,e);}_iterate(e,t){return jt(this._ctx,e,t,this._ctx.table.core)}clone(e){var t=Object.create(this.constructor.prototype),n=Object.create(this._ctx);return e&&r(n,e),t._ctx=n,t}raw(){return this._ctx.valueMapper=null,this}each(e){var t=this._ctx;return this._read((n=>jt(t,e,n,t.table.core)))}count(e){return this._read((e=>{const t=this._ctx,n=t.table.core;if(Kt(t,!0))return n.count({trans:e,query:{index:At(t,n.schema),range:t.range}}).then((e=>Math.min(e,t.limit)));var r=0;return jt(t,(()=>(++r,!1)),e,n).then((()=>r))})).then(e)}sortBy(e,t){const n=e.split(".").reverse(),r=n[0],s=n.length-1;function i(e,t){return t?i(e[n[t]],t-1):e[r]}var o="next"===this._ctx.dir?1:-1;function a(e,t){var n=i(e,s),r=i(t,s);return n<r?-o:n>r?o:0}return this.toArray((function(e){return e.sort(a)})).then(t)}toArray(e){return this._read((e=>{var t=this._ctx;if("next"===t.dir&&Kt(t,!0)&&t.limit>0){const{valueMapper:n}=t,r=At(t,t.table.core.schema);return t.table.core.query({trans:e,limit:t.limit,values:!0,query:{index:r,range:t.range}}).then((({result:e})=>n?e.map(n):e))}{const n=[];return jt(t,(e=>n.push(e)),e,t.table.core).then((()=>n))}}),e)}offset(e){var t=this._ctx;return e<=0||(t.offset+=e,Kt(t)?St(t,(()=>{var t=e;return (e,n)=>0===t||(1===t?(--t,!1):(n((()=>{e.advance(t),t=0;})),!1))})):St(t,(()=>{var t=e;return ()=>--t<0}))),this}limit(e){return this._ctx.limit=Math.min(this._ctx.limit,e),St(this._ctx,(()=>{var t=e;return function(e,n,r){return --t<=0&&n(r),t>=0}}),!0),this}until(e,t){return Ot(this._ctx,(function(n,r,s){return !e(n.value)||(r(s),t)})),this}first(e){return this.limit(1).toArray((function(e){return e[0]})).then(e)}last(e){return this.reverse().first(e)}filter(e){var t,n;return Ot(this._ctx,(function(t){return e(t.value)})),t=this._ctx,n=e,t.isMatch=_t(t.isMatch,n),this}and(e){return this.filter(e)}or(e){return new this.db.WhereClause(this._ctx.table,e,this)}reverse(){return this._ctx.dir="prev"===this._ctx.dir?"next":"prev",this._ondirectionchange&&this._ondirectionchange(this._ctx.dir),this}desc(){return this.reverse()}eachKey(e){var t=this._ctx;return t.keysOnly=!t.isMatch,this.each((function(t,n){e(n.key,n);}))}eachUniqueKey(e){return this._ctx.unique="unique",this.eachKey(e)}eachPrimaryKey(e){var t=this._ctx;return t.keysOnly=!t.isMatch,this.each((function(t,n){e(n.primaryKey,n);}))}keys(e){var t=this._ctx;t.keysOnly=!t.isMatch;var n=[];return this.each((function(e,t){n.push(t.key);})).then((function(){return n})).then(e)}primaryKeys(e){var t=this._ctx;if("next"===t.dir&&Kt(t,!0)&&t.limit>0)return this._read((e=>{var n=At(t,t.table.core.schema);return t.table.core.query({trans:e,values:!1,limit:t.limit,query:{index:n,range:t.range}})})).then((({result:e})=>e)).then(e);t.keysOnly=!t.isMatch;var n=[];return this.each((function(e,t){n.push(t.primaryKey);})).then((function(){return n})).then(e)}uniqueKeys(e){return this._ctx.unique="unique",this.keys(e)}firstKey(e){return this.limit(1).keys((function(e){return e[0]})).then(e)}lastKey(e){return this.reverse().firstKey(e)}distinct(){var e=this._ctx,t=e.index&&e.table.schema.idxByName[e.index];if(!t||!t.multi)return this;var n={};return Ot(this._ctx,(function(e){var t=e.primaryKey.toString(),r=o(n,t);return n[t]=!0,!r})),this}modify(e){var n=this._ctx;return this._write((r=>{var s;if("function"==typeof e)s=e;else {var i=t(e),o=i.length;s=function(t){for(var n=!1,r=0;r<o;++r){var s=i[r],a=e[s];b(t,s)!==a&&(_(t,s,a),n=!0);}return n};}const a=n.table.core,{outbound:u,extractKey:l}=a.schema.primaryKey,c=this.db._options.modifyChunkSize||200,h=[];let d=0;const f=[],p=(e,n)=>{const{failures:r,numFailures:s}=n;d+=e-s;for(let e of t(r))h.push(r[e]);};return this.clone().primaryKeys().then((t=>{const i=o=>{const h=Math.min(c,t.length-o);return a.getMany({trans:r,keys:t.slice(o,o+h),cache:"immutable"}).then((d=>{const f=[],y=[],m=u?[]:null,v=[];for(let e=0;e<h;++e){const n=d[e],r={value:O(n),primKey:t[o+e]};!1!==s.call(r,r.value,r)&&(null==r.value?v.push(t[o+e]):u||0===It(l(n),l(r.value))?(y.push(r.value),u&&m.push(t[o+e])):(v.push(t[o+e]),f.push(r.value)));}const g=Kt(n)&&n.limit===1/0&&("function"!=typeof e||e===Ft)&&{index:n.index,range:n.range};return Promise.resolve(f.length>0&&a.mutate({trans:r,type:"add",values:f}).then((e=>{for(let t in e.failures)v.splice(parseInt(t),1);p(f.length,e);}))).then((()=>(y.length>0||g&&"object"==typeof e)&&a.mutate({trans:r,type:"put",keys:m,values:y,criteria:g,changeSpec:"function"!=typeof e&&e}).then((e=>p(y.length,e))))).then((()=>(v.length>0||g&&e===Ft)&&a.mutate({trans:r,type:"delete",keys:v,criteria:g}).then((e=>p(v.length,e))))).then((()=>t.length>o+h&&i(o+c)))}))};return i(0).then((()=>{if(h.length>0)throw new z("Error modifying one or more objects",h,d,f);return t.length}))}))}))}delete(){var e=this._ctx,t=e.range;return Kt(e)&&(e.isPrimKey&&!gt||3===t.type)?this._write((n=>{const{primaryKey:r}=e.table.core.schema,s=t;return e.table.core.count({trans:n,query:{index:r,range:s}}).then((t=>e.table.core.mutate({trans:n,type:"deleteRange",range:s}).then((({failures:e,lastResult:n,results:r,numFailures:s})=>{if(s)throw new z("Could not delete some values",Object.keys(e).map((t=>e[t])),t-s);return t-s}))))})):this.modify(Ft)}}const Ft=(e,t)=>t.value=null;function Mt(e,t){return e<t?-1:e===t?0:1}function Nt(e,t){return e>t?-1:e===t?0:1}function qt(e,t,n){var r=e instanceof Yt?new e.Collection(e):e;return r._ctx.error=n?new n(t):new TypeError(t),r}function $t(e){return new e.Collection(e,(()=>Wt(""))).limit(0)}function Ut(e,t,n,r,s,i){for(var o=Math.min(e.length,r.length),a=-1,u=0;u<o;++u){var l=t[u];if(l!==r[u])return s(e[u],n[u])<0?e.substr(0,u)+n[u]+n.substr(u+1):s(e[u],r[u])<0?e.substr(0,u)+r[u]+n.substr(u+1):a>=0?e.substr(0,a)+t[a]+n.substr(a+1):null;s(e[u],l)<0&&(a=u);}return o<r.length&&"next"===i?e+n.substr(e.length):o<e.length&&"prev"===i?e.substr(0,n.length):a<0?null:e.substr(0,a)+r[a]+n.substr(a+1)}function Lt(e,t,n,r){var s,i,o,a,u,l,c,h=n.length;if(!n.every((e=>"string"==typeof e)))return qt(e,"String expected.");function d(e){s=function(e){return "next"===e?e=>e.toUpperCase():e=>e.toLowerCase()}(e),i=function(e){return "next"===e?e=>e.toLowerCase():e=>e.toUpperCase()}(e),o="next"===e?Mt:Nt;var t=n.map((function(e){return {lower:i(e),upper:s(e)}})).sort((function(e,t){return o(e.lower,t.lower)}));a=t.map((function(e){return e.upper})),u=t.map((function(e){return e.lower})),l=e,c="next"===e?"":r;}d("next");var f=new e.Collection(e,(()=>Vt(a[0],u[h-1]+r)));f._ondirectionchange=function(e){d(e);};var p=0;return f._addAlgorithm((function(e,n,r){var s=e.key;if("string"!=typeof s)return !1;var d=i(s);if(t(d,u,p))return !0;for(var f=null,y=p;y<h;++y){var m=Ut(s,d,a[y],u[y],o,l);null===m&&null===f?p=y+1:(null===f||o(f,m)>0)&&(f=m);}return n(null!==f?function(){e.continue(f+c);}:r),!1})),f}function Vt(e,t,n,r){return {type:2,lower:e,upper:t,lowerOpen:n,upperOpen:r}}function Wt(e){return {type:1,lower:e,upper:e}}class Yt{get Collection(){return this._ctx.table.db.Collection}between(e,t,n,r){n=!1!==n,r=!0===r;try{return this._cmp(e,t)>0||0===this._cmp(e,t)&&(n||r)&&(!n||!r)?$t(this):new this.Collection(this,(()=>Vt(e,t,!n,!r)))}catch(e){return qt(this,pt)}}equals(e){return null==e?qt(this,pt):new this.Collection(this,(()=>Wt(e)))}above(e){return null==e?qt(this,pt):new this.Collection(this,(()=>Vt(e,void 0,!0)))}aboveOrEqual(e){return null==e?qt(this,pt):new this.Collection(this,(()=>Vt(e,void 0,!1)))}below(e){return null==e?qt(this,pt):new this.Collection(this,(()=>Vt(void 0,e,!1,!0)))}belowOrEqual(e){return null==e?qt(this,pt):new this.Collection(this,(()=>Vt(void 0,e)))}startsWith(e){return "string"!=typeof e?qt(this,"String expected."):this.between(e,e+ft,!0,!0)}startsWithIgnoreCase(e){return ""===e?this.startsWith(e):Lt(this,((e,t)=>0===e.indexOf(t[0])),[e],ft)}equalsIgnoreCase(e){return Lt(this,((e,t)=>e===t[0]),[e],"")}anyOfIgnoreCase(){var e=B.apply(I,arguments);return 0===e.length?$t(this):Lt(this,((e,t)=>-1!==t.indexOf(e)),e,"")}startsWithAnyOfIgnoreCase(){var e=B.apply(I,arguments);return 0===e.length?$t(this):Lt(this,((e,t)=>t.some((t=>0===e.indexOf(t)))),e,ft)}anyOf(){const e=B.apply(I,arguments);let t=this._cmp;try{e.sort(t);}catch(e){return qt(this,pt)}if(0===e.length)return $t(this);const n=new this.Collection(this,(()=>Vt(e[0],e[e.length-1])));n._ondirectionchange=n=>{t="next"===n?this._ascending:this._descending,e.sort(t);};let r=0;return n._addAlgorithm(((n,s,i)=>{const o=n.key;for(;t(o,e[r])>0;)if(++r,r===e.length)return s(i),!1;return 0===t(o,e[r])||(s((()=>{n.continue(e[r]);})),!1)})),n}notEqual(e){return this.inAnyRange([[-(1/0),e],[e,this.db._maxKey]],{includeLowers:!1,includeUppers:!1})}noneOf(){const e=B.apply(I,arguments);if(0===e.length)return new this.Collection(this);try{e.sort(this._ascending);}catch(e){return qt(this,pt)}const t=e.reduce(((e,t)=>e?e.concat([[e[e.length-1][1],t]]):[[-(1/0),t]]),null);return t.push([e[e.length-1],this.db._maxKey]),this.inAnyRange(t,{includeLowers:!1,includeUppers:!1})}inAnyRange(e,t){const n=this._cmp,r=this._ascending,s=this._descending,i=this._min,o=this._max;if(0===e.length)return $t(this);if(!e.every((e=>void 0!==e[0]&&void 0!==e[1]&&r(e[0],e[1])<=0)))return qt(this,"First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower",X.InvalidArgument);const a=!t||!1!==t.includeLowers,u=t&&!0===t.includeUppers;let l,c=r;function h(e,t){return c(e[0],t[0])}try{l=e.reduce((function(e,t){let r=0,s=e.length;for(;r<s;++r){const s=e[r];if(n(t[0],s[1])<0&&n(t[1],s[0])>0){s[0]=i(s[0],t[0]),s[1]=o(s[1],t[1]);break}}return r===s&&e.push(t),e}),[]),l.sort(h);}catch(e){return qt(this,pt)}let d=0;const f=u?e=>r(e,l[d][1])>0:e=>r(e,l[d][1])>=0,p=a?e=>s(e,l[d][0])>0:e=>s(e,l[d][0])>=0;let y=f;const m=new this.Collection(this,(()=>Vt(l[0][0],l[l.length-1][1],!a,!u)));return m._ondirectionchange=e=>{"next"===e?(y=f,c=r):(y=p,c=s),l.sort(h);},m._addAlgorithm(((e,t,n)=>{for(var s=e.key;y(s);)if(++d,d===l.length)return t(n),!1;return !!function(e){return !f(e)&&!p(e)}(s)||(0===this._cmp(s,l[d][1])||0===this._cmp(s,l[d][0])||t((()=>{c===r?e.continue(l[d][0]):e.continue(l[d][1]);})),!1)})),m}startsWithAnyOf(){const e=B.apply(I,arguments);return e.every((e=>"string"==typeof e))?0===e.length?$t(this):this.inAnyRange(e.map((e=>[e,e+ft]))):qt(this,"startsWithAnyOf() only works with strings")}}function zt(e){return We((function(t){return Gt(t),e(t.target.error),!1}))}function Gt(e){e.stopPropagation&&e.stopPropagation(),e.preventDefault&&e.preventDefault();}const Ht=Et(null,"storagemutated");class Qt{_lock(){return m(!Ke.global),++this._reculock,1!==this._reculock||Ke.global||(Ke.lockOwnerFor=this),this}_unlock(){if(m(!Ke.global),0==--this._reculock)for(Ke.global||(Ke.lockOwnerFor=null);this._blockedFuncs.length>0&&!this._locked();){var e=this._blockedFuncs.shift();try{ot(e[1],e[0]);}catch(e){}}return this}_locked(){return this._reculock&&Ke.lockOwnerFor!==this}create(e){if(!this.mode)return this;const t=this.db.idbdb,n=this.db._state.dbOpenError;if(m(!this.idbtrans),!e&&!t)switch(n&&n.name){case"DatabaseClosedError":throw new X.DatabaseClosed(n);case"MissingAPIError":throw new X.MissingAPI(n.message,n);default:throw new X.OpenFailed(n)}if(!this.active)throw new X.TransactionInactive;return m(null===this._completion._state),(e=this.idbtrans=e||(this.db.core?this.db.core.transaction(this.storeNames,this.mode,{durability:this.chromeTransactionDurability}):t.transaction(this.storeNames,this.mode,{durability:this.chromeTransactionDurability}))).onerror=We((t=>{Gt(t),this._reject(e.error);})),e.onabort=We((t=>{Gt(t),this.active&&this._reject(new X.Abort(e.error)),this.active=!1,this.on("abort").fire(t);})),e.oncomplete=We((()=>{this.active=!1,this._resolve(),"mutatedParts"in e&&Ht.storagemutated.fire(e.mutatedParts);})),this}_promise(e,t,n){if("readwrite"===e&&"readwrite"!==this.mode)return ht(new X.ReadOnly("Transaction is readonly"));if(!this.active)return ht(new X.TransactionInactive);if(this._locked())return new Ce(((r,s)=>{this._blockedFuncs.push([()=>{this._promise(e,t,n).then(r,s);},Ke]);}));if(n)return Je((()=>{var e=new Ce(((e,n)=>{this._lock();const r=t(e,n,this);r&&r.then&&r.then(e,n);}));return e.finally((()=>this._unlock())),e._lib=!0,e}));var r=new Ce(((e,n)=>{var r=t(e,n,this);r&&r.then&&r.then(e,n);}));return r._lib=!0,r}_root(){return this.parent?this.parent._root():this}waitFor(e){var t=this._root();const n=Ce.resolve(e);if(t._waitingFor)t._waitingFor=t._waitingFor.then((()=>n));else {t._waitingFor=n,t._waitingQueue=[];var r=t.idbtrans.objectStore(t.storeNames[0]);!function e(){for(++t._spinCount;t._waitingQueue.length;)t._waitingQueue.shift()();t._waitingFor&&(r.get(-1/0).onsuccess=e);}();}var s=t._waitingFor;return new Ce(((e,r)=>{n.then((n=>t._waitingQueue.push(We(e.bind(null,n)))),(e=>t._waitingQueue.push(We(r.bind(null,e))))).finally((()=>{t._waitingFor===s&&(t._waitingFor=null);}));}))}abort(){this.active&&(this.active=!1,this.idbtrans&&this.idbtrans.abort(),this._reject(new X.Abort));}table(e){const t=this._memoizedTables||(this._memoizedTables={});if(o(t,e))return t[e];const n=this.schema[e];if(!n)throw new X.NotFound("Table "+e+" not part of transaction");const r=new this.db.Table(e,n,this);return r.core=this.db.core.table(e),t[e]=r,r}}function Xt(e,t,n,r,s,i,o){return {name:e,keyPath:t,unique:n,multi:r,auto:s,compound:i,src:(n&&!o?"&":"")+(r?"*":"")+(s?"++":"")+Jt(t)}}function Jt(e){return "string"==typeof e?e:e?"["+[].join.call(e,"+")+"]":""}function Zt(e,t,n){return {name:e,primKey:t,indexes:n,mappedClass:null,idxByName:g(n,(e=>[e.name,e]))}}let en=e=>{try{return e.only([[]]),en=()=>[[]],[[]]}catch(e){return en=()=>ft,ft}};function tn(e){return null==e?()=>{}:"string"==typeof e?function(e){return 1===e.split(".").length?t=>t[e]:t=>b(t,e)}(e):t=>b(t,e)}function nn(e){return [].slice.call(e)}let rn=0;function sn(e){return null==e?":id":"string"==typeof e?e:`[${e.join("+")}]`}function on(e,t,r){function s(e){if(3===e.type)return null;if(4===e.type)throw new Error("Cannot convert never type to IDBKeyRange");const{lower:n,upper:r,lowerOpen:s,upperOpen:i}=e;return void 0===n?void 0===r?null:t.upperBound(r,!!i):void 0===r?t.lowerBound(n,!!s):t.bound(n,r,!!s,!!i)}const{schema:i,hasGetAll:o}=function(e,t){const r=nn(e.objectStoreNames);return {schema:{name:e.name,tables:r.map((e=>t.objectStore(e))).map((e=>{const{keyPath:t,autoIncrement:r}=e,s=n(t),i=null==t,o={},a={name:e.name,primaryKey:{name:null,isPrimaryKey:!0,outbound:i,compound:s,keyPath:t,autoIncrement:r,unique:!0,extractKey:tn(t)},indexes:nn(e.indexNames).map((t=>e.index(t))).map((e=>{const{name:t,unique:r,multiEntry:s,keyPath:i}=e,a={name:t,compound:n(i),keyPath:i,unique:r,multiEntry:s,extractKey:tn(i)};return o[sn(i)]=a,a})),getIndexByKeyPath:e=>o[sn(e)]};return o[":id"]=a.primaryKey,null!=t&&(o[sn(t)]=a.primaryKey),a}))},hasGetAll:r.length>0&&"getAll"in t.objectStore(r[0])&&!("undefined"!=typeof navigator&&/Safari/.test(navigator.userAgent)&&!/(Chrome\/|Edge\/)/.test(navigator.userAgent)&&[].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1]<604)}}(e,r),a=i.tables.map((e=>function(e){const t=e.name;return {name:t,schema:e,mutate:function({trans:e,type:n,keys:r,values:i,range:o}){return new Promise(((a,u)=>{a=We(a);const l=e.objectStore(t),c=null==l.keyPath,h="put"===n||"add"===n;if(!h&&"delete"!==n&&"deleteRange"!==n)throw new Error("Invalid operation type: "+n);const{length:d}=r||i||{length:1};if(r&&i&&r.length!==i.length)throw new Error("Given keys array must have same length as given values array.");if(0===d)return a({numFailures:0,failures:{},results:[],lastResult:void 0});let f;const p=[],y=[];let m=0;const v=e=>{++m,Gt(e);};if("deleteRange"===n){if(4===o.type)return a({numFailures:m,failures:y,results:[],lastResult:void 0});3===o.type?p.push(f=l.clear()):p.push(f=l.delete(s(o)));}else {const[e,t]=h?c?[i,r]:[i,null]:[r,null];if(h)for(let r=0;r<d;++r)p.push(f=t&&void 0!==t[r]?l[n](e[r],t[r]):l[n](e[r])),f.onerror=v;else for(let t=0;t<d;++t)p.push(f=l[n](e[t])),f.onerror=v;}const g=e=>{const t=e.target.result;p.forEach(((e,t)=>null!=e.error&&(y[t]=e.error))),a({numFailures:m,failures:y,results:"delete"===n?r:p.map((e=>e.result)),lastResult:t});};f.onerror=e=>{v(e),g(e);},f.onsuccess=g;}))},getMany:({trans:e,keys:n})=>new Promise(((r,s)=>{r=We(r);const i=e.objectStore(t),o=n.length,a=new Array(o);let u,l=0,c=0;const h=e=>{const t=e.target;a[t._pos]=t.result,++c===l&&r(a);},d=zt(s);for(let e=0;e<o;++e)null!=n[e]&&(u=i.get(n[e]),u._pos=e,u.onsuccess=h,u.onerror=d,++l);0===l&&r(a);})),get:({trans:e,key:n})=>new Promise(((r,s)=>{r=We(r);const i=e.objectStore(t).get(n);i.onsuccess=e=>r(e.target.result),i.onerror=zt(s);})),query:function(e){return n=>new Promise(((r,i)=>{r=We(r);const{trans:o,values:a,limit:u,query:l}=n,c=u===1/0?void 0:u,{index:h,range:d}=l,f=o.objectStore(t),p=h.isPrimaryKey?f:f.index(h.name),y=s(d);if(0===u)return r({result:[]});if(e){const e=a?p.getAll(y,c):p.getAllKeys(y,c);e.onsuccess=e=>r({result:e.target.result}),e.onerror=zt(i);}else {let e=0;const t=a||!("openKeyCursor"in p)?p.openCursor(y):p.openKeyCursor(y),n=[];t.onsuccess=s=>{const i=t.result;return i?(n.push(a?i.value:i.primaryKey),++e===u?r({result:n}):void i.continue()):r({result:n})},t.onerror=zt(i);}}))}(o),openCursor:function({trans:e,values:n,query:r,reverse:i,unique:o}){return new Promise(((a,u)=>{a=We(a);const{index:l,range:c}=r,h=e.objectStore(t),d=l.isPrimaryKey?h:h.index(l.name),f=i?o?"prevunique":"prev":o?"nextunique":"next",p=n||!("openKeyCursor"in d)?d.openCursor(s(c),f):d.openKeyCursor(s(c),f);p.onerror=zt(u),p.onsuccess=We((t=>{const n=p.result;if(!n)return void a(null);n.___id=++rn,n.done=!1;const r=n.continue.bind(n);let s=n.continuePrimaryKey;s&&(s=s.bind(n));const i=n.advance.bind(n),o=()=>{throw new Error("Cursor not stopped")};n.trans=e,n.stop=n.continue=n.continuePrimaryKey=n.advance=()=>{throw new Error("Cursor not started")},n.fail=We(u),n.next=function(){let e=1;return this.start((()=>e--?this.continue():this.stop())).then((()=>this))},n.start=e=>{const t=new Promise(((e,t)=>{e=We(e),p.onerror=zt(t),n.fail=t,n.stop=t=>{n.stop=n.continue=n.continuePrimaryKey=n.advance=o,e(t);};})),a=()=>{if(p.result)try{e();}catch(e){n.fail(e);}else n.done=!0,n.start=()=>{throw new Error("Cursor behind last entry")},n.stop();};return p.onsuccess=We((e=>{p.onsuccess=a,a();})),n.continue=r,n.continuePrimaryKey=s,n.advance=i,a(),t},a(n);}),u);}))},count({query:e,trans:n}){const{index:r,range:i}=e;return new Promise(((e,o)=>{const a=n.objectStore(t),u=r.isPrimaryKey?a:a.index(r.name),l=s(i),c=l?u.count(l):u.count();c.onsuccess=We((t=>e(t.target.result))),c.onerror=zt(o);}))}}}(e))),u={};return a.forEach((e=>u[e.name]=e)),{stack:"dbcore",transaction:e.transaction.bind(e),table(e){if(!u[e])throw new Error(`Table '${e}' not found`);return u[e]},MIN_KEY:-1/0,MAX_KEY:en(t),schema:i}}function an({_novip:e},t){const n=t.db,r=function(e,t,{IDBKeyRange:n,indexedDB:r},s){const i=function(e,t){return t.reduce(((e,{create:t})=>({...e,...t(e)})),e)}(on(t,n,s),e.dbcore);return {dbcore:i}}(e._middlewares,n,e._deps,t);e.core=r.dbcore,e.tables.forEach((t=>{const n=t.name;e.core.schema.tables.some((e=>e.name===n))&&(t.core=e.core.table(n),e[n]instanceof e.Table&&(e[n].core=t.core));}));}function un({_novip:e},t,n,r){n.forEach((n=>{const s=r[n];t.forEach((t=>{const r=d(t,n);(!r||"value"in r&&void 0===r.value)&&(t===e.Transaction.prototype||t instanceof e.Transaction?l(t,n,{get(){return this.table(n)},set(e){u(this,n,{value:e,writable:!0,configurable:!0,enumerable:!0});}}):t[n]=new e.Table(n,s));}));}));}function ln({_novip:e},t){t.forEach((t=>{for(let n in t)t[n]instanceof e.Table&&delete t[n];}));}function cn(e,t){return e._cfg.version-t._cfg.version}function hn(e,n,r,s){const i=e._dbSchema,o=e._createTransaction("readwrite",e._storeNames,i);o.create(r),o._completion.catch(s);const a=o._reject.bind(o),u=Ke.transless||Ke;Je((()=>{Ke.trans=o,Ke.transless=u,0===n?(t(i).forEach((e=>{fn(r,e,i[e].primKey,i[e].indexes);})),an(e,r),Ce.follow((()=>e.on.populate.fire(o))).catch(a)):function({_novip:e},n,r,s){const i=[],o=e._versions;let a=e._dbSchema=yn(e,e.idbdb,s),u=!1;function l(){return i.length?Ce.resolve(i.shift()(r.idbtrans)).then(l):Ce.resolve()}return o.filter((e=>e._cfg.version>=n)).forEach((o=>{i.push((()=>{const i=a,l=o._cfg.dbschema;mn(e,i,s),mn(e,l,s),a=e._dbSchema=l;const c=dn(i,l);c.add.forEach((e=>{fn(s,e[0],e[1].primKey,e[1].indexes);})),c.change.forEach((e=>{if(e.recreate)throw new X.Upgrade("Not yet support for changing primary key");{const t=s.objectStore(e.name);e.add.forEach((e=>pn(t,e))),e.change.forEach((e=>{t.deleteIndex(e.name),pn(t,e);})),e.del.forEach((e=>t.deleteIndex(e)));}}));const h=o._cfg.contentUpgrade;if(h&&o._cfg.version>n){an(e,s),r._memoizedTables={},u=!0;let n=w(l);c.del.forEach((e=>{n[e]=i[e];})),ln(e,[e.Transaction.prototype]),un(e,[e.Transaction.prototype],t(n),n),r.schema=n;const o=T(h);let a;o&&Ze();const d=Ce.follow((()=>{if(a=h(r),a&&o){var e=et.bind(null,null);a.then(e,e);}}));return a&&"function"==typeof a.then?Ce.resolve(a):d.then((()=>a))}})),i.push((t=>{if(!u||!vt){!function(e,t){[].slice.call(t.db.objectStoreNames).forEach((n=>null==e[n]&&t.db.deleteObjectStore(n)));}(o._cfg.dbschema,t);}ln(e,[e.Transaction.prototype]),un(e,[e.Transaction.prototype],e._storeNames,e._dbSchema),r.schema=e._dbSchema;}));})),l().then((()=>{var e,n;n=s,t(e=a).forEach((t=>{n.db.objectStoreNames.contains(t)||fn(n,t,e[t].primKey,e[t].indexes);}));}))}(e,n,o,r).catch(a);}));}function dn(e,t){const n={del:[],add:[],change:[]};let r;for(r in e)t[r]||n.del.push(r);for(r in t){const s=e[r],i=t[r];if(s){const e={name:r,def:i,recreate:!1,del:[],add:[],change:[]};if(""+(s.primKey.keyPath||"")!=""+(i.primKey.keyPath||"")||s.primKey.auto!==i.primKey.auto&&!mt)e.recreate=!0,n.change.push(e);else {const t=s.idxByName,r=i.idxByName;let o;for(o in t)r[o]||e.del.push(o);for(o in r){const n=t[o],s=r[o];n?n.src!==s.src&&e.change.push(s):e.add.push(s);}(e.del.length>0||e.add.length>0||e.change.length>0)&&n.change.push(e);}}else n.add.push([r,i]);}return n}function fn(e,t,n,r){const s=e.db.createObjectStore(t,n.keyPath?{keyPath:n.keyPath,autoIncrement:n.auto}:{autoIncrement:n.auto});return r.forEach((e=>pn(s,e))),s}function pn(e,t){e.createIndex(t.name,t.keyPath,{unique:t.unique,multiEntry:t.multi});}function yn(e,t,n){const r={};return p(t.objectStoreNames,0).forEach((e=>{const t=n.objectStore(e);let s=t.keyPath;const i=Xt(Jt(s),s||"",!1,!1,!!t.autoIncrement,s&&"string"!=typeof s,!0),o=[];for(let e=0;e<t.indexNames.length;++e){const n=t.index(t.indexNames[e]);s=n.keyPath;var a=Xt(n.name,s,!!n.unique,!!n.multiEntry,!1,s&&"string"!=typeof s,!1);o.push(a);}r[e]=Zt(e,i,o);})),r}function mn({_novip:t},n,r){const s=r.db.objectStoreNames;for(let e=0;e<s.length;++e){const i=s[e],o=r.objectStore(i);t._hasGetAll="getAll"in o;for(let e=0;e<o.indexNames.length;++e){const t=o.indexNames[e],r=o.index(t).keyPath,s="string"==typeof r?r:"["+p(r).join("+")+"]";if(n[i]){const e=n[i].idxByName[s];e&&(e.name=t,delete n[i].idxByName[s],n[i].idxByName[t]=e);}}}"undefined"!=typeof navigator&&/Safari/.test(navigator.userAgent)&&!/(Chrome\/|Edge\/)/.test(navigator.userAgent)&&e.WorkerGlobalScope&&e instanceof e.WorkerGlobalScope&&[].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1]<604&&(t._hasGetAll=!1);}class vn{_parseStoresSpec(e,r){t(e).forEach((t=>{if(null!==e[t]){var s=e[t].split(",").map(((e,t)=>{const r=(e=e.trim()).replace(/([&*]|\+\+)/g,""),s=/^\[/.test(r)?r.match(/^\[(.*)\]$/)[1].split("+"):r;return Xt(r,s||null,/\&/.test(e),/\*/.test(e),/\+\+/.test(e),n(s),0===t)})),i=s.shift();if(i.multi)throw new X.Schema("Primary key cannot be multi-valued");s.forEach((e=>{if(e.auto)throw new X.Schema("Only primary key can be marked as autoIncrement (++)");if(!e.keyPath)throw new X.Schema("Index must have a name and cannot be an empty string")})),r[t]=Zt(t,i,s);}}));}stores(e){const n=this.db;this._cfg.storesSource=this._cfg.storesSource?r(this._cfg.storesSource,e):e;const s=n._versions,i={};let o={};return s.forEach((e=>{r(i,e._cfg.storesSource),o=e._cfg.dbschema={},e._parseStoresSpec(i,o);})),n._dbSchema=o,ln(n,[n._allTables,n,n.Transaction.prototype]),un(n,[n._allTables,n,n.Transaction.prototype,this._cfg.tables],t(o),o),n._storeNames=t(o),this}upgrade(e){return this._cfg.contentUpgrade=ue(this._cfg.contentUpgrade||ee,e),this}}function gn(e,t){let n=e._dbNamesDB;return n||(n=e._dbNamesDB=new $n("__dbnames",{addons:[],indexedDB:e,IDBKeyRange:t}),n.version(1).stores({dbnames:"name"})),n.table("dbnames")}function bn(e){return e&&"function"==typeof e.databases}function _n(e){return Je((function(){return Ke.letThrough=!0,e()}))}function wn(){var e;return !navigator.userAgentData&&/Safari\//.test(navigator.userAgent)&&!/Chrom(e|ium)\//.test(navigator.userAgent)&&indexedDB.databases?new Promise((function(t){var n=function(){return indexedDB.databases().finally(t)};e=setInterval(n,100),n();})).finally((function(){return clearInterval(e)})):Promise.resolve()}function xn(e){const n=e._state,{indexedDB:r}=e._deps;if(n.isBeingOpened||e.idbdb)return n.dbReadyPromise.then((()=>n.dbOpenError?ht(n.dbOpenError):e));R&&(n.openCanceller._stackHolder=q()),n.isBeingOpened=!0,n.dbOpenError=null,n.openComplete=!1;const s=n.openCanceller;function i(){if(n.openCanceller!==s)throw new X.DatabaseClosed("db.open() was cancelled")}let o=n.dbReadyResolve,a=null,u=!1;return Ce.race([s,("undefined"==typeof navigator?Ce.resolve():wn()).then((()=>new Ce(((s,o)=>{if(i(),!r)throw new X.MissingAPI;const l=e.name,c=n.autoSchema?r.open(l):r.open(l,Math.round(10*e.verno));if(!c)throw new X.MissingAPI;c.onerror=zt(o),c.onblocked=We(e._fireOnBlocked),c.onupgradeneeded=We((t=>{if(a=c.transaction,n.autoSchema&&!e._options.allowEmptyDB){c.onerror=Gt,a.abort(),c.result.close();const e=r.deleteDatabase(l);e.onsuccess=e.onerror=We((()=>{o(new X.NoSuchDatabase(`Database ${l} doesnt exist`));}));}else {a.onerror=zt(o);var s=t.oldVersion>Math.pow(2,62)?0:t.oldVersion;u=s<1,e._novip.idbdb=c.result,hn(e,s/10,a,o);}}),o),c.onsuccess=We((()=>{a=null;const r=e._novip.idbdb=c.result,i=p(r.objectStoreNames);if(i.length>0)try{const s=r.transaction(1===(o=i).length?o[0]:o,"readonly");n.autoSchema?function({_novip:e},n,r){e.verno=n.version/10;const s=e._dbSchema=yn(0,n,r);e._storeNames=p(n.objectStoreNames,0),un(e,[e._allTables],t(s),s);}(e,r,s):(mn(e,e._dbSchema,s),function(e,t){const n=dn(yn(0,e.idbdb,t),e._dbSchema);return !(n.add.length||n.change.some((e=>e.add.length||e.change.length)))}(e,s)||console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Some queries may fail.")),an(e,s);}catch(e){}var o;yt.push(e),r.onversionchange=We((t=>{n.vcFired=!0,e.on("versionchange").fire(t);})),r.onclose=We((t=>{e.on("close").fire(t);})),u&&function({indexedDB:e,IDBKeyRange:t},n){!bn(e)&&"__dbnames"!==n&&gn(e,t).put({name:n}).catch(ee);}(e._deps,l),s();}),o);}))))]).then((()=>(i(),n.onReadyBeingFired=[],Ce.resolve(_n((()=>e.on.ready.fire(e.vip)))).then((function t(){if(n.onReadyBeingFired.length>0){let r=n.onReadyBeingFired.reduce(ue,ee);return n.onReadyBeingFired=[],Ce.resolve(_n((()=>r(e.vip)))).then(t)}}))))).finally((()=>{n.onReadyBeingFired=null,n.isBeingOpened=!1;})).then((()=>e)).catch((t=>{n.dbOpenError=t;try{a&&a.abort();}catch(e){}return s===n.openCanceller&&e._close(),ht(t)})).finally((()=>{n.openComplete=!0,o();}))}function kn(e){var t=t=>e.next(t),r=i(t),s=i((t=>e.throw(t)));function i(e){return t=>{var i=e(t),o=i.value;return i.done?o:o&&"function"==typeof o.then?o.then(r,s):n(o)?Promise.all(o).then(r,s):r(o)}}return i(t)()}function En(e,t,n){var r=arguments.length;if(r<2)throw new X.InvalidArgument("Too few arguments");for(var s=new Array(r-1);--r;)s[r-1]=arguments[r];n=s.pop();var i=k(s);return [e,i,n]}function Pn(e,t,n,r,s){return Ce.resolve().then((()=>{const i=Ke.transless||Ke,o=e._createTransaction(t,n,e._dbSchema,r),a={trans:o,transless:i};if(r)o.idbtrans=r.idbtrans;else try{o.create(),e._state.PR1398_maxLoop=3;}catch(r){return r.name===H.InvalidState&&e.isOpen()&&--e._state.PR1398_maxLoop>0?(console.warn("Dexie: Need to reopen db"),e._close(),e.open().then((()=>Pn(e,t,n,null,s)))):ht(r)}const u=T(s);let l;u&&Ze();const c=Ce.follow((()=>{if(l=s.call(o,o),l)if(u){var e=et.bind(null,null);l.then(e,e);}else "function"==typeof l.next&&"function"==typeof l.throw&&(l=kn(l));}),a);return (l&&"function"==typeof l.then?Ce.resolve(l).then((e=>o.active?e:ht(new X.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn")))):c.then((()=>l))).then((e=>(r&&o._resolve(),o._completion.then((()=>e))))).catch((e=>(o._reject(e),ht(e))))}))}function Kn(e,t,r){const s=n(e)?e.slice():[e];for(let e=0;e<r;++e)s.push(t);return s}const On={stack:"dbcore",name:"VirtualIndexMiddleware",level:1,create:function(e){return {...e,table(t){const n=e.table(t),{schema:r}=n,s={},i=[];function o(e,t,n){const r=sn(e),a=s[r]=s[r]||[],u=null==e?0:"string"==typeof e?1:e.length,l=t>0,c={...n,isVirtual:l,keyTail:t,keyLength:u,extractKey:tn(e),unique:!l&&n.unique};if(a.push(c),c.isPrimaryKey||i.push(c),u>1){o(2===u?e[0]:e.slice(0,u-1),t+1,n);}return a.sort(((e,t)=>e.keyTail-t.keyTail)),c}const a=o(r.primaryKey.keyPath,0,r.primaryKey);s[":id"]=[a];for(const e of r.indexes)o(e.keyPath,0,e);function u(t){const n=t.query.index;return n.isVirtual?{...t,query:{index:n,range:(r=t.query.range,s=n.keyTail,{type:1===r.type?2:r.type,lower:Kn(r.lower,r.lowerOpen?e.MAX_KEY:e.MIN_KEY,s),lowerOpen:!0,upper:Kn(r.upper,r.upperOpen?e.MIN_KEY:e.MAX_KEY,s),upperOpen:!0})}}:t;var r,s;}const l={...n,schema:{...r,primaryKey:a,indexes:i,getIndexByKeyPath:function(e){const t=s[sn(e)];return t&&t[0]}},count:e=>n.count(u(e)),query:e=>n.query(u(e)),openCursor(t){const{keyTail:r,isVirtual:s,keyLength:i}=t.query.index;if(!s)return n.openCursor(t);return n.openCursor(u(t)).then((n=>n&&function(n){const s=Object.create(n,{continue:{value:function(s){null!=s?n.continue(Kn(s,t.reverse?e.MAX_KEY:e.MIN_KEY,r)):t.unique?n.continue(n.key.slice(0,i).concat(t.reverse?e.MIN_KEY:e.MAX_KEY,r)):n.continue();}},continuePrimaryKey:{value(t,s){n.continuePrimaryKey(Kn(t,e.MAX_KEY,r),s);}},primaryKey:{get:()=>n.primaryKey},key:{get(){const e=n.key;return 1===i?e[0]:e.slice(0,i)}},value:{get:()=>n.value}});return s}(n)))}};return l}}}};function Sn(e,n,r,s){return r=r||{},s=s||"",t(e).forEach((t=>{if(o(n,t)){var i=e[t],a=n[t];if("object"==typeof i&&"object"==typeof a&&i&&a){const e=C(i);e!==C(a)?r[s+t]=n[t]:"Object"===e?Sn(i,a,r,s+t+"."):i!==a&&(r[s+t]=n[t]);}else i!==a&&(r[s+t]=n[t]);}else r[s+t]=void 0;})),t(n).forEach((t=>{o(e,t)||(r[s+t]=n[t]);})),r}const An={stack:"dbcore",name:"HooksMiddleware",level:2,create:e=>({...e,table(t){const n=e.table(t),{primaryKey:r}=n.schema,s={...n,mutate(e){const s=Ke.trans,{deleting:i,creating:a,updating:u}=s.table(t).hook;switch(e.type){case"add":if(a.fire===ee)break;return s._promise("readwrite",(()=>l(e)),!0);case"put":if(a.fire===ee&&u.fire===ee)break;return s._promise("readwrite",(()=>l(e)),!0);case"delete":if(i.fire===ee)break;return s._promise("readwrite",(()=>l(e)),!0);case"deleteRange":if(i.fire===ee)break;return s._promise("readwrite",(()=>function(e){return c(e.trans,e.range,1e4)}(e)),!0)}return n.mutate(e);function l(e){const t=Ke.trans,s=e.keys||function(e,t){return "delete"===t.type?t.keys:t.keys||t.values.map(e.extractKey)}(r,e);if(!s)throw new Error("Keys missing");return "delete"!==(e="add"===e.type||"put"===e.type?{...e,keys:s}:{...e}).type&&(e.values=[...e.values]),e.keys&&(e.keys=[...e.keys]),function(e,t,n){return "add"===t.type?Promise.resolve([]):e.getMany({trans:t.trans,keys:n,cache:"immutable"})}(n,e,s).then((l=>{const c=s.map(((n,s)=>{const c=l[s],h={onerror:null,onsuccess:null};if("delete"===e.type)i.fire.call(h,n,c,t);else if("add"===e.type||void 0===c){const i=a.fire.call(h,n,e.values[s],t);null==n&&null!=i&&(n=i,e.keys[s]=n,r.outbound||_(e.values[s],r.keyPath,n));}else {const r=Sn(c,e.values[s]),i=u.fire.call(h,r,n,c,t);if(i){const t=e.values[s];Object.keys(i).forEach((e=>{o(t,e)?t[e]=i[e]:_(t,e,i[e]);}));}}return h}));return n.mutate(e).then((({failures:t,results:n,numFailures:r,lastResult:i})=>{for(let r=0;r<s.length;++r){const i=n?n[r]:s[r],o=c[r];null==i?o.onerror&&o.onerror(t[r]):o.onsuccess&&o.onsuccess("put"===e.type&&l[r]?e.values[r]:i);}return {failures:t,results:n,numFailures:r,lastResult:i}})).catch((e=>(c.forEach((t=>t.onerror&&t.onerror(e))),Promise.reject(e))))}))}function c(e,t,s){return n.query({trans:e,values:!1,query:{index:r,range:t},limit:s}).then((({result:n})=>l({type:"delete",keys:n,trans:e}).then((r=>r.numFailures>0?Promise.reject(r.failures[0]):n.length<s?{failures:[],numFailures:0,lastResult:void 0}:c(e,{...t,lower:n[n.length-1],lowerOpen:!0},s)))))}}};return s}})};function Cn(e,t,n){try{if(!t)return null;if(t.keys.length<e.length)return null;const r=[];for(let s=0,i=0;s<t.keys.length&&i<e.length;++s)0===It(t.keys[s],e[i])&&(r.push(n?O(t.values[s]):t.values[s]),++i);return r.length===e.length?r:null}catch(e){return null}}const jn={stack:"dbcore",level:-1,create:e=>({table:t=>{const n=e.table(t);return {...n,getMany:e=>{if(!e.cache)return n.getMany(e);const t=Cn(e.keys,e.trans._cache,"clone"===e.cache);return t?Ce.resolve(t):n.getMany(e).then((t=>(e.trans._cache={keys:e.keys,values:"clone"===e.cache?O(t):t},t)))},mutate:e=>("add"!==e.type&&(e.trans._cache=null),n.mutate(e))}}})};function Dn(e){return !("from"in e)}const In=function(e,t){if(!this){const t=new In;return e&&"d"in e&&r(t,e),t}r(this,arguments.length?{d:1,from:e,to:arguments.length>1?t:e}:{d:0});};function Bn(e,t,n){const s=It(t,n);if(isNaN(s))return;if(s>0)throw RangeError();if(Dn(e))return r(e,{from:t,to:n,d:1});const i=e.l,o=e.r;if(It(n,e.from)<0)return i?Bn(i,t,n):e.l={from:t,to:n,d:1,l:null,r:null},Mn(e);if(It(t,e.to)>0)return o?Bn(o,t,n):e.r={from:t,to:n,d:1,l:null,r:null},Mn(e);It(t,e.from)<0&&(e.from=t,e.l=null,e.d=o?o.d+1:1),It(n,e.to)>0&&(e.to=n,e.r=null,e.d=e.l?e.l.d+1:1);const a=!e.r;i&&!e.l&&Tn(e,i),o&&a&&Tn(e,o);}function Tn(e,t){Dn(t)||function e(t,{from:n,to:r,l:s,r:i}){Bn(t,n,r),s&&e(t,s),i&&e(t,i);}(e,t);}function Rn(e,t){const n=Fn(t);let r=n.next();if(r.done)return !1;let s=r.value;const i=Fn(e);let o=i.next(s.from),a=o.value;for(;!r.done&&!o.done;){if(It(a.from,s.to)<=0&&It(a.to,s.from)>=0)return !0;It(s.from,a.from)<0?s=(r=n.next(a.from)).value:a=(o=i.next(s.from)).value;}return !1}function Fn(e){let t=Dn(e)?null:{s:0,n:e};return {next(e){const n=arguments.length>0;for(;t;)switch(t.s){case 0:if(t.s=1,n)for(;t.n.l&&It(e,t.n.from)<0;)t={up:t,n:t.n.l,s:1};else for(;t.n.l;)t={up:t,n:t.n.l,s:1};case 1:if(t.s=2,!n||It(e,t.n.to)<=0)return {value:t.n,done:!1};case 2:if(t.n.r){t.s=3,t={up:t,n:t.n.r,s:0};continue}case 3:t=t.up;}return {done:!0}}}}function Mn(e){var t,n;const r=((null===(t=e.r)||void 0===t?void 0:t.d)||0)-((null===(n=e.l)||void 0===n?void 0:n.d)||0),s=r>1?"r":r<-1?"l":"";if(s){const t="r"===s?"l":"r",n={...e},r=e[s];e.from=r.from,e.to=r.to,e[s]=r[s],n[s]=r[t],e[t]=n,n.d=Nn(n);}e.d=Nn(e);}function Nn({r:e,l:t}){return (e?t?Math.max(e.d,t.d):e.d:t?t.d:0)+1}a(In.prototype,{add(e){return Tn(this,e),this},addKey(e){return Bn(this,e,e),this},addKeys(e){return e.forEach((e=>Bn(this,e,e))),this},[j](){return Fn(this)}});const qn={stack:"dbcore",level:0,create:e=>{const r=e.schema.name,s=new In(e.MIN_KEY,e.MAX_KEY);return {...e,table:i=>{const o=e.table(i),{schema:a}=o,{primaryKey:u}=a,{extractKey:l,outbound:c}=u,h={...o,mutate:e=>{const t=e.trans,u=t.mutatedParts||(t.mutatedParts={}),l=e=>{const t=`idb://${r}/${i}/${e}`;return u[t]||(u[t]=new In)},c=l(""),h=l(":dels"),{type:d}=e;let[f,p]="deleteRange"===e.type?[e.range]:"delete"===e.type?[e.keys]:e.values.length<50?[[],e.values]:[];const y=e.trans._cache;return o.mutate(e).then((e=>{if(n(f)){"delete"!==d&&(f=e.results),c.addKeys(f);const t=Cn(f,y);t||"add"===d||h.addKeys(f),(t||p)&&function(e,t,r,s){function i(t){const i=e(t.name||"");function o(e){return null!=e?t.extractKey(e):null}const a=e=>t.multiEntry&&n(e)?e.forEach((e=>i.addKey(e))):i.addKey(e);(r||s).forEach(((e,t)=>{const n=r&&o(r[t]),i=s&&o(s[t]);0!==It(n,i)&&(null!=n&&a(n),null!=i&&a(i));}));}t.indexes.forEach(i);}(l,a,t,p);}else if(f){const e={from:f.lower,to:f.upper};h.add(e),c.add(e);}else c.add(s),h.add(s),a.indexes.forEach((e=>l(e.name).add(s)));return e}))}},d=({query:{index:t,range:n}})=>{var r,s;return [t,new In(null!==(r=n.lower)&&void 0!==r?r:e.MIN_KEY,null!==(s=n.upper)&&void 0!==s?s:e.MAX_KEY)]},f={get:e=>[u,new In(e.key)],getMany:e=>[u,(new In).addKeys(e.keys)],count:d,query:d,openCursor:d};return t(f).forEach((e=>{h[e]=function(t){const{subscr:n}=Ke;if(n){const a=e=>{const t=`idb://${r}/${i}/${e}`;return n[t]||(n[t]=new In)},u=a(""),h=a(":dels"),[d,p]=f[e](t);if(a(d.name||"").add(p),!d.isPrimaryKey){if("count"!==e){const n="query"===e&&c&&t.values&&o.query({...t,values:!1});return o[e].apply(this,arguments).then((r=>{if("query"===e){if(c&&t.values)return n.then((({result:e})=>(u.addKeys(e),r)));const e=t.values?r.result.map(l):r.result;t.values?u.addKeys(e):h.addKeys(e);}else if("openCursor"===e){const e=r,n=t.values;return e&&Object.create(e,{key:{get:()=>(h.addKey(e.primaryKey),e.key)},primaryKey:{get(){const t=e.primaryKey;return h.addKey(t),t}},value:{get:()=>(n&&u.addKey(e.primaryKey),e.value)}})}return r}))}h.add(s);}}return o[e].apply(this,arguments)};})),h}}}};class $n{constructor(e,t){this._middlewares={},this.verno=0;const n=$n.dependencies;this._options=t={addons:$n.addons,autoOpen:!0,indexedDB:n.indexedDB,IDBKeyRange:n.IDBKeyRange,...t},this._deps={indexedDB:t.indexedDB,IDBKeyRange:t.IDBKeyRange};const{addons:r}=t;this._dbSchema={},this._versions=[],this._storeNames=[],this._allTables={},this.idbdb=null,this._novip=this;const s={dbOpenError:null,isBeingOpened:!1,onReadyBeingFired:null,openComplete:!1,dbReadyResolve:ee,dbReadyPromise:null,cancelOpen:ee,openCanceller:null,autoSchema:!0,PR1398_maxLoop:3};var i;s.dbReadyPromise=new Ce((e=>{s.dbReadyResolve=e;})),s.openCanceller=new Ce(((e,t)=>{s.cancelOpen=t;})),this._state=s,this.name=e,this.on=Et(this,"populate","blocked","versionchange","close",{ready:[ue,ee]}),this.on.ready.subscribe=y(this.on.ready.subscribe,(e=>(t,n)=>{$n.vip((()=>{const r=this._state;if(r.openComplete)r.dbOpenError||Ce.resolve().then(t),n&&e(t);else if(r.onReadyBeingFired)r.onReadyBeingFired.push(t),n&&e(t);else {e(t);const r=this;n||e((function e(){r.on.ready.unsubscribe(t),r.on.ready.unsubscribe(e);}));}}));})),this.Collection=(i=this,Pt(Rt.prototype,(function(e,t){this.db=i;let n=wt,r=null;if(t)try{n=t();}catch(e){r=e;}const s=e._ctx,o=s.table,a=o.hook.reading.fire;this._ctx={table:o,index:s.index,isPrimKey:!s.index||o.schema.primKey.keyPath&&s.index===o.schema.primKey.name,range:n,keysOnly:!1,dir:"next",unique:"",algorithm:null,filter:null,replayFilter:null,justLimit:!0,isMatch:null,offset:0,limit:1/0,error:r,or:s.or,valueMapper:a!==te?a:null};}))),this.Table=function(e){return Pt(kt.prototype,(function(t,n,r){this.db=e,this._tx=r,this.name=t,this.schema=n,this.hook=e._allTables[t]?e._allTables[t].hook:Et(null,{creating:[se,ee],reading:[ne,te],updating:[oe,ee],deleting:[ie,ee]});}))}(this),this.Transaction=function(e){return Pt(Qt.prototype,(function(t,n,r,s,i){this.db=e,this.mode=t,this.storeNames=n,this.schema=r,this.chromeTransactionDurability=s,this.idbtrans=null,this.on=Et(this,"complete","error","abort"),this.parent=i||null,this.active=!0,this._reculock=0,this._blockedFuncs=[],this._resolve=null,this._reject=null,this._waitingFor=null,this._waitingQueue=null,this._spinCount=0,this._completion=new Ce(((e,t)=>{this._resolve=e,this._reject=t;})),this._completion.then((()=>{this.active=!1,this.on.complete.fire();}),(e=>{var t=this.active;return this.active=!1,this.on.error.fire(e),this.parent?this.parent._reject(e):t&&this.idbtrans&&this.idbtrans.abort(),ht(e)}));}))}(this),this.Version=function(e){return Pt(vn.prototype,(function(t){this.db=e,this._cfg={version:t,storesSource:null,dbschema:{},tables:{},contentUpgrade:null};}))}(this),this.WhereClause=function(e){return Pt(Yt.prototype,(function(t,n,r){this.db=e,this._ctx={table:t,index:":id"===n?null:n,or:r};const s=e._deps.indexedDB;if(!s)throw new X.MissingAPI;this._cmp=this._ascending=s.cmp.bind(s),this._descending=(e,t)=>s.cmp(t,e),this._max=(e,t)=>s.cmp(e,t)>0?e:t,this._min=(e,t)=>s.cmp(e,t)<0?e:t,this._IDBKeyRange=e._deps.IDBKeyRange;}))}(this),this.on("versionchange",(e=>{e.newVersion>0?console.warn(`Another connection wants to upgrade database '${this.name}'. Closing db now to resume the upgrade.`):console.warn(`Another connection wants to delete database '${this.name}'. Closing db now to resume the delete request.`),this.close();})),this.on("blocked",(e=>{!e.newVersion||e.newVersion<e.oldVersion?console.warn(`Dexie.delete('${this.name}') was blocked`):console.warn(`Upgrade '${this.name}' blocked by other connection holding version ${e.oldVersion/10}`);})),this._maxKey=en(t.IDBKeyRange),this._createTransaction=(e,t,n,r)=>new this.Transaction(e,t,n,this._options.chromeTransactionDurability,r),this._fireOnBlocked=e=>{this.on("blocked").fire(e),yt.filter((e=>e.name===this.name&&e!==this&&!e._state.vcFired)).map((t=>t.on("versionchange").fire(e)));},this.use(On),this.use(An),this.use(qn),this.use(jn),this.vip=Object.create(this,{_vip:{value:!0}}),r.forEach((e=>e(this)));}version(e){if(isNaN(e)||e<.1)throw new X.Type("Given version is not a positive number");if(e=Math.round(10*e)/10,this.idbdb||this._state.isBeingOpened)throw new X.Schema("Cannot add version when database is open");this.verno=Math.max(this.verno,e);const t=this._versions;var n=t.filter((t=>t._cfg.version===e))[0];return n||(n=new this.Version(e),t.push(n),t.sort(cn),n.stores({}),this._state.autoSchema=!1,n)}_whenReady(e){return this.idbdb&&(this._state.openComplete||Ke.letThrough||this._vip)?e():new Ce(((e,t)=>{if(this._state.openComplete)return t(new X.DatabaseClosed(this._state.dbOpenError));if(!this._state.isBeingOpened){if(!this._options.autoOpen)return void t(new X.DatabaseClosed);this.open().catch(ee);}this._state.dbReadyPromise.then(e,t);})).then(e)}use({stack:e,create:t,level:n,name:r}){r&&this.unuse({stack:e,name:r});const s=this._middlewares[e]||(this._middlewares[e]=[]);return s.push({stack:e,create:t,level:null==n?10:n,name:r}),s.sort(((e,t)=>e.level-t.level)),this}unuse({stack:e,name:t,create:n}){return e&&this._middlewares[e]&&(this._middlewares[e]=this._middlewares[e].filter((e=>n?e.create!==n:!!t&&e.name!==t))),this}open(){return xn(this)}_close(){const e=this._state,t=yt.indexOf(this);if(t>=0&&yt.splice(t,1),this.idbdb){try{this.idbdb.close();}catch(e){}this._novip.idbdb=null;}e.dbReadyPromise=new Ce((t=>{e.dbReadyResolve=t;})),e.openCanceller=new Ce(((t,n)=>{e.cancelOpen=n;}));}close(){this._close();const e=this._state;this._options.autoOpen=!1,e.dbOpenError=new X.DatabaseClosed,e.isBeingOpened&&e.cancelOpen(e.dbOpenError);}delete(){const e=arguments.length>0,t=this._state;return new Ce(((n,r)=>{const s=()=>{this.close();var e=this._deps.indexedDB.deleteDatabase(this.name);e.onsuccess=We((()=>{!function({indexedDB:e,IDBKeyRange:t},n){!bn(e)&&"__dbnames"!==n&&gn(e,t).delete(n).catch(ee);}(this._deps,this.name),n();})),e.onerror=zt(r),e.onblocked=this._fireOnBlocked;};if(e)throw new X.InvalidArgument("Arguments not allowed in db.delete()");t.isBeingOpened?t.dbReadyPromise.then(s):s();}))}backendDB(){return this.idbdb}isOpen(){return null!==this.idbdb}hasBeenClosed(){const e=this._state.dbOpenError;return e&&"DatabaseClosed"===e.name}hasFailed(){return null!==this._state.dbOpenError}dynamicallyOpened(){return this._state.autoSchema}get tables(){return t(this._allTables).map((e=>this._allTables[e]))}transaction(){const e=En.apply(this,arguments);return this._transaction.apply(this,e)}_transaction(e,t,n){let r=Ke.trans;r&&r.db===this&&-1===e.indexOf("!")||(r=null);const s=-1!==e.indexOf("?");let i,o;e=e.replace("!","").replace("?","");try{if(o=t.map((e=>{var t=e instanceof this.Table?e.name:e;if("string"!=typeof t)throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");return t})),"r"==e||"readonly"===e)i="readonly";else {if("rw"!=e&&"readwrite"!=e)throw new X.InvalidArgument("Invalid transaction mode: "+e);i="readwrite";}if(r){if("readonly"===r.mode&&"readwrite"===i){if(!s)throw new X.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");r=null;}r&&o.forEach((e=>{if(r&&-1===r.storeNames.indexOf(e)){if(!s)throw new X.SubTransaction("Table "+e+" not included in parent transaction.");r=null;}})),s&&r&&!r.active&&(r=null);}}catch(e){return r?r._promise(null,((t,n)=>{n(e);})):ht(e)}const a=Pn.bind(null,this,i,o,r,n);return r?r._promise(i,a,"lock"):Ke.trans?ot(Ke.transless,(()=>this._whenReady(a))):this._whenReady(a)}table(e){if(!o(this._allTables,e))throw new X.InvalidTable(`Table ${e} does not exist`);return this._allTables[e]}}const Un="undefined"!=typeof Symbol&&"observable"in Symbol?Symbol.observable:"@@observable";class Ln{constructor(e){this._subscribe=e;}subscribe(e,t,n){return this._subscribe(e&&"function"!=typeof e?e:{next:e,error:t,complete:n})}[Un](){return this}}function Vn(e,n){return t(n).forEach((t=>{Tn(e[t]||(e[t]=new In),n[t]);})),e}function Wn(e){return new Ln((n=>{const r=T(e);let s=!1,i={},o={};const a={get closed(){return s},unsubscribe:()=>{s=!0,Ht.storagemutated.unsubscribe(h);}};n.start&&n.start(a);let u=!1,l=!1;function c(){return t(o).some((e=>i[e]&&Rn(i[e],o[e])))}const h=e=>{Vn(i,e),c()&&d();},d=()=>{if(u||s)return;i={};const t={},f=function(t){r&&Ze();const n=()=>Je(e,{subscr:t,trans:null}),s=Ke.trans?ot(Ke.transless,n):n();return r&&s.then(et,et),s}(t);l||(Ht("storagemutated",h),l=!0),u=!0,Promise.resolve(f).then((e=>{u=!1,s||(c()?d():(i={},o=t,n.next&&n.next(e)));}),(e=>{u=!1,n.error&&n.error(e),a.unsubscribe();}));};return d(),a}))}let Yn;try{Yn={indexedDB:e.indexedDB||e.mozIndexedDB||e.webkitIndexedDB||e.msIndexedDB,IDBKeyRange:e.IDBKeyRange||e.webkitIDBKeyRange};}catch(e){Yn={indexedDB:null,IDBKeyRange:null};}const zn=$n;function Gn(e){let t=Hn;try{Hn=!0,Ht.storagemutated.fire(e);}finally{Hn=t;}}a(zn,{...Z,delete:e=>new zn(e,{addons:[]}).delete(),exists:e=>new zn(e,{addons:[]}).open().then((e=>(e.close(),!0))).catch("NoSuchDatabaseError",(()=>!1)),getDatabaseNames(e){try{return function({indexedDB:e,IDBKeyRange:t}){return bn(e)?Promise.resolve(e.databases()).then((e=>e.map((e=>e.name)).filter((e=>"__dbnames"!==e)))):gn(e,t).toCollection().primaryKeys()}(zn.dependencies).then(e)}catch(e){return ht(new X.MissingAPI)}},defineClass:()=>function(e){r(this,e);},ignoreTransaction:e=>Ke.trans?ot(Ke.transless,e):e(),vip:_n,async:function(e){return function(){try{var t=kn(e.apply(this,arguments));return t&&"function"==typeof t.then?t:Ce.resolve(t)}catch(e){return ht(e)}}},spawn:function(e,t,n){try{var r=kn(e.apply(n,t||[]));return r&&"function"==typeof r.then?r:Ce.resolve(r)}catch(e){return ht(e)}},currentTransaction:{get:()=>Ke.trans||null},waitFor:function(e,t){const n=Ce.resolve("function"==typeof e?zn.ignoreTransaction(e):e).timeout(t||6e4);return Ke.trans?Ke.trans.waitFor(n):n},Promise:Ce,debug:{get:()=>R,set:e=>{F(e,"dexie"===e?()=>!0:bt);}},derive:c,extend:r,props:a,override:y,Events:Et,on:Ht,liveQuery:Wn,extendObservabilitySet:Vn,getByKeyPath:b,setByKeyPath:_,delByKeyPath:function(e,t){"string"==typeof t?_(e,t,void 0):"length"in t&&[].map.call(t,(function(t){_(e,t,void 0);}));},shallowClone:w,deepClone:O,getObjectDiff:Sn,cmp:It,asap:v,minKey:-(1/0),addons:[],connections:yt,errnames:H,dependencies:Yn,semVer:"3.2.1",version:"3.2.1".split(".").map((e=>parseInt(e))).reduce(((e,t,n)=>e+t/Math.pow(10,2*n)))}),zn.maxKey=en(zn.dependencies.IDBKeyRange),"undefined"!=typeof dispatchEvent&&"undefined"!=typeof addEventListener&&(Ht("storagemutated",(e=>{if(!Hn){let t;mt?(t=document.createEvent("CustomEvent"),t.initCustomEvent("x-storagemutated-1",!0,!0,e)):t=new CustomEvent("x-storagemutated-1",{detail:e}),Hn=!0,dispatchEvent(t),Hn=!1;}})),addEventListener("x-storagemutated-1",(({detail:e})=>{Hn||Gn(e);})));let Hn=!1;if("undefined"!=typeof BroadcastChannel){const e=new BroadcastChannel("x-storagemutated-1");Ht("storagemutated",(t=>{Hn||e.postMessage(t);})),e.onmessage=e=>{e.data&&Gn(e.data);};}else if("undefined"!=typeof self&&"undefined"!=typeof navigator){Ht("storagemutated",(e=>{try{Hn||("undefined"!=typeof localStorage&&localStorage.setItem("x-storagemutated-1",JSON.stringify({trig:Math.random(),changedParts:e})),"object"==typeof self.clients&&[...self.clients.matchAll({includeUncontrolled:!0})].forEach((t=>t.postMessage({type:"x-storagemutated-1",changedParts:e}))));}catch(e){}})),addEventListener("storage",(e=>{if("x-storagemutated-1"===e.key){const t=JSON.parse(e.newValue);t&&Gn(t.changedParts);}}));const e=self.document&&navigator.serviceWorker;e&&e.addEventListener("message",(function({data:e}){e&&"x-storagemutated-1"===e.type&&Gn(e.changedParts);}));}Ce.rejectionMapper=function(e,t){if(!e||e instanceof W||e instanceof TypeError||e instanceof SyntaxError||!e.name||!J[e.name])return e;var n=new J[e.name](t||e.message,e);return "stack"in e&&l(n,"stack",{get:function(){return this.inner.stack}}),n},F(R,bt);

  const fetchJson = async (url) => {
    progress('fetching...');
    let response = await fetch(url);
    progress('parsing...');
    let data = await response.json();

    return data;
  };

  const getVersion = (dbName) => {
    let defaultVersion = '1970-01-01';
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

  const versionCheck = async (dbSetup) => {
    let currentVersion = getVersion(dbSetup.name);

    let db = new $n(dbSetup.name);
    await db.version(1).stores(dbSetup.stores);
    db.open();

    if (dbSetup.version !== currentVersion) {
      progress('new version.');
      for (let store of Object.keys(dbSetup.stores)) {
        progress(`clearing ${store}...`);
        await db.table(store).clear();
      }
      localStorage.setItem(`${dbSetup.name}Version`,
        JSON.stringify(dbSetup.version));
    }

    return db;
  };

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

  const tomeSetup = {
    name: 'kjv',
    stores: {
      lists: 'k',
      verses: 'k',
      words: 'k',
    },
    url: '/json/kjv.json',
    version: '2020-01-07',
  };

  let tomeAcrostics = {};
  let tomeBooks = null;
  let tomeChapters = null;
  let tomeCitations = [];
  let tomeDb = null;
  let tomeName = tomeSetup.name;
  let tomeVerseCount = null;
  let tomeWords = null;

  const chapterIdxByVerseIdx = (verseIdx) => {
    let chapterIdx = tomeChapters
      .findIndex(x => x[chapterLastVerseIdx] >= verseIdx);
    return chapterIdx;
  };

  const citationByVerseIdx = (verseIdx) => {
    return tomeCitations[verseIdx];
  };

  const initializeTome = async () => {
    progress('');
    progress('* tome database *');
    progress('');
    tomeDb = await versionCheck(tomeSetup);
    await populateTome();
    await loadTomeAcrostics();
    await loadTomeBooks();
    await loadTomeChapters();
    await loadTomeCitations();
    await loadTomeWords();
    tomeVerseCount = await tomeDb.verses.count();
    progress('tome initialized.');
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

  const populateTome = async () => {
    let wordCount = await tomeDb.words.count();
    if (wordCount === 0) {
      let data = await fetchJson(tomeSetup.url);

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

  const strongSetup = {
    name: 'strong',
    stores: {
      defs: 'k',
      maps: 'k',
      words: 'k',
    },
    url: '/json/strong.json',
    version: '2020-07-30',
  };

  let strongCitations = {};
  let strongDb = null;
  let strongNums = null;

  const initializeStrong = async () => {
    progress('');
    progress('* strong database *');
    progress('');
    strongDb = await versionCheck(strongSetup);
    await populateStrong();
    await loadStrongNums();
    await loadStrongCitations();
    progress('strong initialized.');
  };

  const loadStrongCitations = async () => {
    progress('loading citations...');
    let defObjs = await strongDb.defs.toArray();
    defObjs.map(x => strongCitations[x.k] = x.v[defTranliteration]);
  };

  const loadStrongNums = async () => {
    progress('loading numbers...');
    let strongDefObjs = await strongDb.defs.toArray();
    strongNums = strongDefObjs.map(x => x.k);
  };

  const populateStrong = async () => {
    let wordsCount = await strongDb.words.count();
    if (wordsCount === 0) {
      let data = await fetchJson(strongSetup.url);

      progress('populating defs...');
      await strongDb.defs.bulkAdd(data.defs);
      progress('populating maps...');
      await strongDb.maps.bulkAdd(data.maps);
      progress('populating words...');
      await strongDb.words.bulkAdd(data.words);
      progress('population complete.');
    } else {
      progress('strong already populated.');
    }
  };

  class CommandQueue {

    constructor() {
      this.queue = [];
      this.queueRunning = false;
      this.commands = {};
    }

    publish(command, data) {
      // console.log(command);
      if (this.commands[command] && this.commands[command].length >= 1) {
        for (let listener of this.commands[command]) {
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
        let task = this.queue.shift();
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

  let queue = new CommandQueue();

  class ReadModel {

    constructor() {
      this.initialize();
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

    nameModeChange(nameMode) {
      this.nameMode = nameMode;
      this.saveNameMode();
      queue.publish('read.name-mode.update', this.nameMode);
    }

    nameModeToogle() {
      this.nameModeChange(!this.nameMode);
    }

    panesChange(panes) {
      this.panes = panes;
      queue.publish('panes.update', this.panes);
    }

    restore() {
      this.restoreColumnMode();
      this.restoreStrongMode();
      this.restoreNameMode();
      this.restoreSidebar();
    }

    restoreColumnMode() {
      let defaultColumnMode = false;
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

    restoreNameMode() {
      let defaultNameMode = true;
      let nameMode = localStorage.getItem('readNameMode');
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
      this.nameModeChange(nameMode);
    }

    restoreSidebar() {
      let defaultSidebar = this.panes > 1 ? 'navigator' : 'none';
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
      let defaultStrongMode = false;
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

    saveNameMode() {
      localStorage.setItem('readNameMode',
        JSON.stringify(this.nameMode));
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
      queue.subscribe('panes.change', (panes) => {
        this.panesChange(panes);
      });

      queue.subscribe('read.column-mode.toggle', () => {
        this.columnModeToogle();
      });
      queue.subscribe('read.name-mode.toggle', () => {
        this.nameModeToogle();
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

  }

  const svgNS = 'http://www.w3.org/2000/svg';
  const xlinkNS = 'http://www.w3.org/1999/xlink';

  const templateAcrostic = (verseObj) => {
    let acrosticSpan = undefined;
    if (tomeAcrostics) {
      let acrostic = tomeAcrostics[verseObj.k];
      if (acrostic) {
        let glyph = acrostic.slice(0, 1);
        let xlit = acrostic.slice(1);
        let glyphSpan = templateElement('span', 'font--hebrew', null, '', glyph);
        let xlitSpan = templateElement('span', 'font--bold', null, '', xlit + ' ');
        acrosticSpan = document.createDocumentFragment();
        acrosticSpan.appendChild(glyphSpan);
        acrosticSpan.appendChild(xlitSpan);
      }
    }
    return acrosticSpan;
  };

  const templateActionMenu = (cssModifier, actionSet) => {
    let actionMenu = templateElement(
      'div', 'action-menu', cssModifier, null, null);
    actionMenu.classList.add('action-menu--hide');
    for (let btn of actionSet) {
      let element = templateBtnIcon(btn.icon, btn.icon, btn.label);
      actionMenu.appendChild(element);
    }
    return actionMenu;
  };

  const templateBtnIcon = (svgId, cssModifier, ariaLabel) => {
    let svgTag = document.createElementNS(svgNS, 'svg');
    svgTag.classList.add('icon-svg');
    let useTag = document.createElementNS(svgNS, 'use');
    useTag.setAttributeNS(xlinkNS, 'xlink:href', `icons.svg#${svgId}`);
    svgTag.appendChild(useTag);
    let btnIcon = templateElement(
      'button', 'btn-icon', cssModifier, ariaLabel, null);
    btnIcon.appendChild(svgTag);
    return btnIcon;
  };

  const templateDivDialog = (cssModifier, toolSet) => {
    let divDialog = templateElement(
      'div', 'dialog', cssModifier, null, null);
    let divDialogBtns = templateElement(
      'div', 'dialog-btns', cssModifier, null, null);
    for (let tool of toolSet) {
      let element;
      if (tool.type === 'btn') {
        element = templateElement(
          'button', 'btn-dialog', tool.cssModifier, tool.ariaLabel, tool.ariaLabel);
        divDialogBtns.appendChild(element);
      } else if (tool.type === 'input') {
        element = templateInput('dialog-input', cssModifier, tool.ariaLabel);
        divDialog.appendChild(element);
      } else if (tool.type === 'label') {
        element = templateElement(
          'div', 'dialog-label', cssModifier, null, null);
        if (tool.text) {
          element.textContent = tool.text;
        }
        divDialog.appendChild(element);
      } else if (tool.type === 'textarea') {
        element = templateElement(
          'textarea', 'dialog-textarea', cssModifier, tool.ariaLabel, null);
        divDialog.appendChild(element);
      }
    }
    divDialog.appendChild(divDialogBtns);
    return divDialog;
  };

  const templateElement = (tagName, cssBlock, cssModifier, ariaLabel, textContent) => {
    let element = document.createElement(tagName);
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

  const templateInput = (cssBlock, cssModifier, ariaLabel) => {
    let input = templateElement(
      'input', cssBlock, cssModifier, ariaLabel, null);
    input.setAttribute('type', 'text');
    return input;
  };

  const templatePage = (cssModifier) => {
    let page = templateElement(
      'div', 'page', cssModifier, null, null);
    page.classList.add('page--hide');
    return page;
  };

  const templateScroll = (cssModifier) => {
    let scroll = templateElement(
      'div', 'scroll', cssModifier, null, null);
    return scroll;
  };

  const templateToolbar = (cssModifier) => {
    let toolbar = templateElement(
      'div', 'toolbar', cssModifier, null, null);
    return toolbar;
  };

  const templateToolbarLower = (toolSet) => {
    let toolbarLower = templateToolbar('lower');
    for (let tool of toolSet) {
      let element;
      if (tool.type === 'btn') {
        element = templateBtnIcon(tool.icon, tool.icon, tool.ariaLabel);
        toolbarLower.appendChild(element);
      } else if (tool.type === 'input') {
        element = templateInput('input', tool.modifier, tool.ariaLabel);
        toolbarLower.appendChild(element);
      }
    }
    return toolbarLower;
  };

  const templateToolbarMenu = (modifier, actionSet) => {
    let toolbarMenu = templateElement(
      'div', 'toolbar-menu', modifier, null, null);
    toolbarMenu.classList.add('toolbar-menu--hide');
    for (let btn of actionSet) {
      let element = templateBtnIcon(btn.icon, `${modifier}-${btn.icon}`, btn.label);
      toolbarMenu.appendChild(element);
    }
    return toolbarMenu;
  };

  const templateToolbarUpper = (toolSet) => {
    let toolbarUpper = templateToolbar('upper');
    for (let tool of toolSet) {
      let element;
      if (tool.type === 'btn') {
        element = templateBtnIcon(tool.icon, tool.icon, tool.ariaLabel);
        toolbarUpper.appendChild(element);
      } else if (tool.type === 'banner') {
        element = templateElement(
          'div', 'banner', tool.cssModifier, null, tool.text);
        toolbarUpper.appendChild(element);
      }
    }
    return toolbarUpper;
  };

  const centerScrollElement = (scrollElement, element) => {
    let y = element.offsetTop - scrollElement.offsetTop -
      (scrollElement.clientHeight - element.clientHeight) / 2;
    scrollElement.scrollTop = y;
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

  const sideScrollElement = (scrollElement, element) => {
    let x = element.offsetLeft - 8;
    scrollElement.scrollLeft = x;
  };

  const nameSub = {
    H136: [
      ['God', 'Adonai'],
      ['the LORD', 'Adonai'],
      ['LORD', 'Adonai'],
      ['the Lord\'s', 'Adonai\'s'],
      ['The Lord', 'Adonai'],
      ['the Lord', 'Adonai'],
      ['Lord', 'Adonai'],
      ['my lord', 'Adonai'],
    ],
    H410: [
      ['God\'s', 'El\'s'],
      ['a God', 'an El'],
      ['God', 'El'],
      ['gods', 'elohim'],
      ['a god', 'an el'],
      ['god', 'el'],
    ],
    H426: [
      ['a God', 'an Elah'],
      ['God', 'Elah'],
      ['gods', 'elah'],
      ['god', 'elah'],
    ],
    H430: [
      ['angels', 'elohim'],
      ['GOD', 'Elohim'],
      ['God\'s', 'Elohim\'s'],
      ['Gods', 'Elohim'],
      ['a God', 'an Elohim'],
      ['God', 'Elohim'],
      ['goddess', 'elohim'],
      ['a godly', 'an elohim'],
      ['gods', 'elohim'],
      ['a god', 'an elohim'],
      ['god', 'elohim'],
    ],
    H433: [
      ['God\'s', 'Eloah\'s'],
      ['a God', 'an Eloah'],
      ['God', 'Eloah'],
      ['a god', 'an eloah'],
      ['god', 'eloah'],
    ],
    H3050: [
      ['JAH', 'Yah'],
      ['The LORD', 'Yah'],
      ['the LORD', 'Yah'],
      ['LORD', 'Yah'],
    ],
    H3068: [
      ['GOD', 'Yahweh'],
      ['JEHOVAH', 'YAHWEH'],
      ['The LORD\'S', 'Yahweh\'s'],
      ['the LORD\'S', 'Yahweh\'s'],
      ['THE LORD', 'YAHWEH'],
      ['The LORD', 'Yahweh'],
      ['the LORD', 'Yahweh'],
      ['LORD', 'Yahweh'],
      ['the Lord', 'Yahweh'],
      ['Lord', 'Yahweh'],
    ],
    H3069: [
      ['GOD', 'Yahweh'],
      ['the LORD', 'Yahweh'],
    ],
    H5945: [
      ['the Highest', 'Elyon'],
      ['and the highest', 'Elyon'],
      ['the most High', 'Elyon'],
      ['most High', 'Elyon'],
      ['the most high', 'Elyon'],
      ['most high', 'Elyon'],
      ['and the high', 'and Elyon'],
    ],
    H5946: [
      ['the most High', 'Elyon'],
    ],
    H6635: [
      ['of hosts', 'Tzevaot'],
    ],
    H7706: [
      ['the Almighty', 'Shaddai'],
      ['Almighty', 'Shaddai'],
    ]
  };

  const elElyon = [
    354, 355, 356, 358, 14770, 15148,
  ];
  const elShaddai = [
    398, 20638,
  ];
  const yahweh = [
    5110, 14389, 15510, 16173,
  ];

  const lowerToolSet$n = [
    { type: 'btn', icon: 'navigator', ariaLabel: 'Navigator' },
    { type: 'btn', icon: 'bookmark', ariaLabel: 'Bookmark' },
    { type: 'btn', icon: 'search', ariaLabel: 'Search' },
    { type: 'btn', icon: 'strong', ariaLabel: 'Strong' },
    { type: 'btn', icon: 'setting', ariaLabel: 'Setting' },
    { type: 'btn', icon: 'help', ariaLabel: 'Help' },
    { type: 'btn', icon: 'column-mode', ariaLabel: 'Column Mode' },
    { type: 'btn', icon: 'name-mode', ariaLabel: 'Name Mode' },
    { type: 'btn', icon: 'strong-mode', ariaLabel: 'Strong Mode' },
    { type: 'btn', icon: 'v-menu', ariaLabel: 'Toolbar Menu' },
  ];

  const upperToolSet$n = [
    { type: 'btn', icon: 'prev', ariaLabel: 'Previous Chapter' },
    { type: 'banner', cssModifier: 'read', text: null },
    { type: 'btn', icon: 'next', ariaLabel: 'Next Chapter' },
  ];

  const menuSet = [
    { type: 'btn', icon: 'cancel', ariaLabel: 'Toolbar Menu' },
    { type: 'btn', icon: 'setting', ariaLabel: 'Setting' },
    { type: 'btn', icon: 'help', ariaLabel: 'Help' },
  ];

  const matthewChapterIdx = 929;

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
      this.page = templatePage('read');
      this.page.classList.remove('page--hide');

      this.toolbarUpper = templateToolbarUpper(upperToolSet$n);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('read');
      this.list = templateElement('div', 'list', 'read', null, null);
      this.scroll.appendChild(this.list);
      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$n);
      this.page.appendChild(this.toolbarLower);

      this.toolbarMenu = templateToolbarMenu('read-menu', menuSet);
      this.page.appendChild(this.toolbarMenu);

      let container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    buildVerse(verseObj) {
      let verse = templateElement('div', 'verse', null, null, null);
      verse.dataset.verseIdx = verseObj.k;
      let verseNum = this.buildVerseNum(verseObj);
      verse.appendChild(verseNum);
      let acrostic = templateAcrostic(verseObj);
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
        this.getVerseText(verseObj));
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
      this.setVerseText();
      this.updateBanner();
      this.updateVerses();
      this.refreshVerseBookmarks();
    }

    columnModeUpdate(columnMode) {
      this.columnMode = columnMode;
      this.updateColumnModeBtn();
      this.updateColumnMode();
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

    getElements() {
      this.body = document.querySelector('body');

      this.btnPrev = this.toolbarUpper.querySelector('.btn-icon--prev');
      this.banner = this.toolbarUpper.querySelector('.banner--read');
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

    getKjvVerseText(verseObj) {
      return verseObj.v[verseText];
    }

    getNameVerseText(verseObj) {
      return this.nameSub(verseObj);
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

    nameModeUpdate(nameMode) {
      this.nameMode = nameMode;
      if (this.nameMode) {
        this.btnNameMode.classList.add('btn-icon--active');
      } else {
        this.btnNameMode.classList.remove('btn-icon--active');
      }
      this.setVerseText();
      if (this.verseObjs && this.chapterIdx < matthewChapterIdx) {
        this.updateVerses();
        this.refreshVerseBookmarks();
      }
    }

    nameSub(verseObj) {
      let verseIdx = verseObj.k;
      let rawWords = verseObj.v[verseText].split(' ');
      let fragments = [];
      let maps = this.mapObjs.find(x => x.k === verseIdx).v;
      for (let map of maps) {
        let fragment =
          rawWords.slice(map[mapSliceStart], map[mapSliceEnd]).join(' ');
        for (let number of map[mapStrongNums]) {
          if (number in nameSub) {
            let subMaps = nameSub[number];
            for (let subMap of subMaps) {
              if (fragment.includes(subMap[0])) {
                fragment = fragment.replaceAll(subMap[0], subMap[1]);
                break;
              }
            }
          }
        }
        fragments.push(fragment);
      }
      let revised = fragments.join(' ');
      if (elElyon.includes(verseIdx)) {
        revised = revised.replaceAll('Elyon El', 'El Elyon');
      }
      if (elShaddai.includes(verseIdx)) {
        revised = revised.replaceAll('Shaddai El', 'El Shaddai');
      }
      if (yahweh.includes(verseIdx)) {
        revised = revised.replaceAll('the Yahweh', 'Yahweh');
      }
      return revised;
    }

    navigatorHide() {
      this.btnNavigator.classList.remove('btn-icon--active');
    }

    navigatorShow() {
      this.btnNavigator.classList.add('btn-icon--active');
    }

    navigatorMapsUpdate(mapObjs) {
      this.mapObjs = mapObjs;
    }

    navigatorVersesUpdate(verseObjs) {
      this.verseObjs = verseObjs;
    }

    refreshBookmarks(element) {
      let verseIdx = parseInt(element.dataset.verseIdx);
      if (this.activeFolder.bookmarks.indexOf(verseIdx) === -1) {
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
      this.scroll.scrollLeft = 0;
    }

    scrollToVerse(verseIdx) {
      let element = this.list.querySelector(
        `[data-verse-idx="${verseIdx}"]`);
      if (element) {
        if (this.columnMode) {
          sideScrollElement(this.scroll, element);
        } else {
          centerScrollElement(this.scroll, element);
        }
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

    setVerseText() {
      if (this.nameMode && this.chapterIdx < matthewChapterIdx) {
        this.getVerseText = this.getNameVerseText;
      } else {
        this.getVerseText = this.getKjvVerseText;
      }
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

      queue.subscribe('help.hide', () => {
        this.helpHide();
      });
      queue.subscribe('help.show', () => {
        this.helpShow();
      });

      queue.subscribe('navigator.hide', () => {
        this.navigatorHide();
      });
      queue.subscribe('navigator.show', () => {
        this.navigatorShow();
      });
      queue.subscribe('navigator.maps.update', (mapObjs) => {
        this.navigatorMapsUpdate(mapObjs);
      });
      queue.subscribe('navigator.verses.update', (verseObjs) => {
        this.navigatorVersesUpdate(verseObjs);
      });

      queue.subscribe('read.column-mode.update', (columnMode) => {
        this.columnModeUpdate(columnMode);
      });
      queue.subscribe('read.hide', () => {
        this.hide();
      });
      queue.subscribe('read.name-mode.update', (nameMode) => {
        this.nameModeUpdate(nameMode);
      });
      queue.subscribe('read.scroll-to-top', () => {
        this.scrollToTop();
      });
      queue.subscribe('read.scroll-to-verse', (verseIdx) => {
        this.scrollToVerse(verseIdx);
      });
      queue.subscribe('read.show', () => {
        this.show();
      });
      queue.subscribe('read.strong-mode.update', (strongMode) => {
        this.strongModeUpdate(strongMode);
      });

      queue.subscribe('search.hide', () => {
        this.searchHide();
      });
      queue.subscribe('search.show', () => {
        this.searchShow();
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

    toolbarLowerClick(event) {
      event.preventDefault();
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnStrongMode ||
          target === this.btnNameMode ||
          target === this.btnColumnMode ||
          !target.classList.contains('btn-icon--active')
        ) {
          if (target === this.btnNavigator) {
            queue.publish('sidebar.select', 'navigator');
          } else if (target === this.btnBookmark) {
            queue.publish('sidebar.select', 'bookmark');
          } else if (target === this.btnSearch) {
            queue.publish('sidebar.select', 'search');
          } else if (target === this.btnStrong) {
            queue.publish('sidebar.select', 'strong');
          } else if (target === this.btnSetting) {
            queue.publish('sidebar.select', 'setting');
          } else if (target === this.btnHelp) {
            queue.publish('sidebar.select', 'help');
          } else if (target === this.btnColumnMode) {
            queue.publish('read.column-mode.click', null);
          } else if (target === this.btnStrongMode) {
            queue.publish('read.strong-mode.click', null);
          } else if (target === this.btnNameMode) {
            queue.publish('read.name-mode.click', null);
          } else if (target === this.btnMenu) {
            this.showToolbarMenu();
          }
        }
      }
    }

    toolbarMenuClick(event) {
      event.preventDefault();
      let btn = event.target.closest('button');
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

    toolbarUpperClick(event) {
      event.preventDefault();
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnPrev) {
          queue.publish('read.prev.chapter', 1);
        } else if (target === this.btnNext) {
          queue.publish('read.next.chapter', 2);
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
        queue.publish('read.strong.select', verseIdx);
      } else if (verse.classList.contains('verse--bookmark')) {
        queue.publish('read.bookmark.delete', verseIdx);
      } else {
        queue.publish('read.bookmark.add', verseIdx);
      }
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
      queue.publish('bookmark.restore', null);
      queue.publish('navigator.restore', null);
      queue.publish('search.restore', null);
      queue.publish('strong.restore', null);
      queue.publish('setting.restore', null);
      queue.publish('help.restore', null);
      queue.publish('read.restore', null);
    }

    nameModeToggle() {
      queue.publish('read.name-mode.toggle', null);
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
      mqlTwoPanes.addEventListener('change',  (event) => {
        if (event.matches) {
          this.updatePanes();
        }
      });
      mqlThreePanes.addEventListener('change',  (event) => {
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
        this.nameModeToggle();
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

    async chapterIdxChange(chapterIdx) {
      this.chapterIdx = chapterIdx;
      this.saveChapterIdx();
      await this.updateVerses();
      await this.updateMaps();
      let bookIdx = tomeChapters[this.chapterIdx][chapterBookIdx];
      if (this.bookIdx !== bookIdx) {
        this.bookIdxChange(bookIdx);
      }
      queue.publish('chapterIdx.update', this.chapterIdx);
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

    async restore() {
      this.restoreTask();
      await this.restoreChapterIdx();
    }

    async restoreChapterIdx() {
      let defaultIdx = CHAPTER_IDX_GENESIS_1;
      let chapterIdx = localStorage.getItem('chapterIdx');
      if (!chapterIdx) {
        chapterIdx = defaultIdx;
      } else {
        try {
          chapterIdx = JSON.parse(chapterIdx);
        } catch (error) {
          chapterIdx = defaultIdx;
        }
        if (!tomeChapters[chapterIdx]) {
          chapterIdx = defaultIdx;
        }
      }
      await this.chapterIdxChange(chapterIdx);
    }

    restoreTask() {
      let defaultTask = 'navigator-book';
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

    async updateMaps() {
      let chapter = tomeChapters[this.chapterIdx];
      let keys = range(chapter[chapterFirstVerseIdx],
        chapter[chapterLastVerseIdx] + 1);
      this.mapObjs = await strongDb.maps.bulkGet(keys);
      queue.publish('navigator.maps.update', this.mapObjs);
    }

    async updateVerses() {
      let chapter = tomeChapters[this.chapterIdx];
      let keys = range(chapter[chapterFirstVerseIdx],
        chapter[chapterLastVerseIdx] + 1);
      this.verseObjs = await tomeDb.verses.bulkGet(keys);
      queue.publish('navigator.verses.update', this.verseObjs);
    }

  }

  const greekFirstIdx = 39;
  const indices = [...Array(66).keys()];

  const lowerToolSet$m = [
    { type: 'btn', icon: 'back', ariaLabel: 'Back' },
    { type: 'btn', icon: 'navigator-chapter', ariaLabel: 'Chapter' },
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

      this.toolbarUpper = templateToolbarUpper(upperToolSet$m);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('navigator-book');
      this.list = templateElement('div', 'list', 'navigator-book', null, null);
      this.scroll.appendChild(this.list);
      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$m);
      this.page.appendChild(this.toolbarLower);

      let container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    contentClick(btn) {
      let bookIdx = parseInt(btn.dataset.bookIdx);
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
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnBack) {
          queue.publish('navigator.back', null);
        } else if (target === this.btnChapter) {
          queue.publish('navigator-chapter', null);
        }
      }
    }

  }

  const lowerToolSet$l = [
    { type: 'btn', icon: 'back', ariaLabel: 'Back' },
    { type: 'btn', icon: 'navigator-book', ariaLabel: 'Book' },
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

    bookIdxUpdate(bookIdx) {
      if (this.bookIdx !== bookIdx) {
        this.bookIdx = bookIdx;
        this.updateBanner();
        this.updateChapterList();
      }
    }

    buildPage() {
      this.page = templatePage('navigator-chapter');

      this.toolbarUpper = templateToolbarUpper(upperToolSet$l);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('navigator-chapter');
      this.list = templateElement('div', 'list', 'navigator-chapter', null, null);
      this.scroll.appendChild(this.list);
      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$l);
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
      let target = event.target.closest('button');
      if (target) {
        if (target.classList.contains('btn-chapter')) {
          this.contentClick(target);
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
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnBack) {
          queue.publish('navigator.back', null);
        } else if (target === this.btnBook) {
          queue.publish('navigator-book', null);
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
      queue.publish('sidebar.change', 'none');
    }

    bookIdxUpdate(bookIdx) {
      this.lastBookIdx = bookIdx;
      if (this.bookSelectPending) {
        this.bookSelectPending = false;
        let book = tomeBooks[bookIdx];
        this.chapterCount = book[bookLastChapterIdx] -
          book[bookFirstChapterIdx] + 1;
        if (this.panes > 1 || this.chapterCount === 1) {
          let chapterIdx = tomeBooks[bookIdx][bookFirstChapterIdx];
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

    chapterIdxUpdate() {
      queue.publish('read.scroll-to-top', null);
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

      queue.subscribe('chapterIdx.update', () => {
        this.chapterIdxUpdate();
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
      let bookmarks = this.activeFolder.bookmarks;
      if (bookmarks.indexOf(verseIdx) === -1) {
        this.activeFolder.bookmarks = [verseIdx, ...bookmarks];
        this.updateFolders();
        await this.updateActiveFolder();
      }
    }

    copy(copyPkg) {
      let toFolder = this.getFolder(copyPkg.to);
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
      let bookmarks = this.activeFolder.bookmarks;
      let index = bookmarks.indexOf(verseIdx);
      if (index !== -1) {
        bookmarks.splice(index, 1);
        this.updateFolders();
        await this.updateActiveFolder();
      }
    }

    async down(verseIdx) {
      let bookmarks = this.activeFolder.bookmarks;
      let index = bookmarks.indexOf(verseIdx);
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
      let idx = this.getFolderIdx(folderName);
      this.folders.splice(idx, 1);
      if (this.folders.length === 0) {
        await this.folderAdd('Default');
      }
      this.updateFolders();
      let firstFolderName = this.folders[firstEntry].name;
      await this.activeFolderChange(firstFolderName);
      this.updateFolderList();
    }

    folderDown(folderName) {
      let index = this.folders.findIndex((folder) => folder.name === folderName);
      if (index !== this.folders.length - 1 && index !== -1) {
        this.reorderFolders(index, index + 1);
        this.updateFolders();
        this.updateFolderList();
      }
    }

    folderImport(pkgStr) {
      let bookmarkPkg = this.getBookmarkPkg(pkgStr);
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
        let oldFolder = this.getFolder(namePkg.old);
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
      let index = this.folders.findIndex((folder) => folder.name === folderName);
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
      for (let folder of bookmarkPkg.folders) {
        let targetFolder = this.getFolder(folder.name);
        if (!targetFolder) {
          targetFolder = this.createFolder(folder.name);
          this.folders.push(targetFolder);
        }
        for (let verseIdx of folder.bookmarks) {
          let bookmarks = targetFolder.bookmarks;
          if (bookmarks.indexOf(verseIdx) !== -1) {
            continue;
          }
          targetFolder.bookmarks.push(verseIdx);
        }
      }
      this.updateFolders();
      this.updateFolderList();
      queue.publish('bookmark-import.message', 'Import Successful');
    }

    initialize() {
      this.maxIdx = tomeVerseCount - 1;
      this.subscribe();
    }

    async move(movePkg) {
      let toFolder = this.getFolder(movePkg.to);
      toFolder.bookmarks.push(movePkg.verseIdx);

      let bookmarks = this.activeFolder.bookmarks;
      let index = bookmarks.indexOf(movePkg.verseIdx);
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
      let foldersNotFoundIn = this.folders.filter(
        (folder) => !folder.bookmarks.some((element) => element === verseIdx)
      );
      let moveCopyList = foldersNotFoundIn.map((folder) => folder.name);
      queue.publish('bookmark-move-copy.list.update', moveCopyList);
    }

    reorderBookmarks(fromIdx, toIdx) {
      let bookmarks = this.activeFolder.bookmarks;
      bookmarks.splice(
        toIdx, 0, bookmarks.splice(fromIdx, 1)[firstEntry]
      );
    }

    reorderFolders(fromIdx, toIdx) {
      this.folders.splice(
        toIdx, 0, this.folders.splice(fromIdx, 1)[firstEntry]
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
      let defaultFolderName = 'Default';
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

    restoreExpandMode() {
      let defaultMode = false;
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
      let defaultFolders = this.createFolders();
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
      let defaultMode = false;
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
      let defaultTask = 'bookmark-list';
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
      let bookmarks = this.activeFolder.bookmarks;
      if (bookmarks.length !== 0) {
        bookmarks.sort(sorter);
        this.updateFolders();
        await this.updateActiveFolder(this.activeFolderName);
      }
    }

    async sortInvert() {
      let bookmarks = this.activeFolder.bookmarks;
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
    }

    taskChange(bookmarkTask) {
      this.bookmarkTask = bookmarkTask;
      this.saveBookmarkTask();
      queue.publish('bookmark.task.update', this.bookmarkTask);
    }

    async up(verseIdx) {
      let bookmarks = this.activeFolder.bookmarks;
      let index = bookmarks.indexOf(verseIdx);
      if (index !== 0 && index !== -1) {
        this.reorderBookmarks(index, index - 1);
        this.updateFolders();
        await this.updateActiveFolder();
      }
    }

    async updateActiveFolder() {
      this.activeFolder = this.getFolder(this.activeFolderName);
      this.activeFolder.verseObjs = await tomeDb.verses.bulkGet(
        this.activeFolder.bookmarks);
      queue.publish('bookmark.active-folder.update', this.activeFolder);
    }

    updateActiveFolderName() {
      this.saveActiveFolderName();
    }

    updateFolderList() {
      queue.publish('bookmark.folder-list.update', this.getFolderList());
    }

    updateFolders() {
      this.saveFolders();
      queue.publish('bookmark.folders.update', this.folders);
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
      if (bookmarkPkg.tome !== tomeName) {
        status = 'Tome Mismatch';
      }
      return status;
    }
  }

  const actionSet$2 = [
    { icon: 'up', ariaLabel: 'Up' },
    { icon: 'down', ariaLabel: 'Down' },
    { icon: 'move-copy', ariaLabel: 'Move/Copy' },
    { icon: 'delete', ariaLabel: 'Delete' },
    { icon: 'cancel', ariaLabel: 'Cancel' },
  ];

  const lowerToolSet$k = [
    { type: 'btn', icon: 'back', ariaLabel: 'Back' },
    { type: 'btn', icon: 'sort-ascend', ariaLabel: 'Sort Ascending' },
    { type: 'btn', icon: 'sort-invert', ariaLabel: 'Sort Invert' },
    { type: 'btn', icon: 'bookmark-folder', ariaLabel: 'Bookmark Folder' },
    { type: 'btn', icon: 'expand-mode', ariaLabel: 'Expand Bookmarks' },
    { type: 'btn', icon: 'strong-mode', ariaLabel: 'Strong Mode' },
  ];

  const upperToolSet$k = [
    { type: 'banner', cssModifier: 'bookmark-list', text: null },
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
      let btnMenu = templateBtnIcon('h-menu', 'h-menu', 'Menu');
      entry.appendChild(btnMenu);
      return entry;
    }

    buildPage() {
      this.page = templatePage('bookmark-list');

      this.toolbarUpper = templateToolbarUpper(upperToolSet$k);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('bookmark-list');

      this.empty = templateElement('div', 'empty', 'bookmark-list', null,
        'No bookmarks saved.');
      this.scroll.appendChild(this.empty);

      this.list = templateElement('div', 'list', 'bookmark-list', null, null);
      this.scroll.appendChild(this.list);

      this.actionMenu = templateActionMenu('bookmark-list', actionSet$2);
      this.scroll.appendChild(this.actionMenu);

      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$k);
      this.page.appendChild(this.toolbarLower);

      let container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    buildRefSpan(verseObj) {
      let refSpan = document.createElement('span');
      refSpan.classList.add('font--bold');
      refSpan.textContent = verseObj.v[verseCitation] + ' ';
      return refSpan;
    }

    buildVerse(verseObj) {
      let btn = document.createElement('button');
      btn.classList.add('btn-result');
      btn.dataset.verseIdx = verseObj.k;
      let searchText = document.createElement('span');
      searchText.classList.add('span-result-text');
      let acrostic = templateAcrostic(verseObj);
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

    delete(verseIdx) {
      queue.publish('bookmark-list.delete', verseIdx);
    }

    down(verseIdx) {
      queue.publish('bookmark-list.down', verseIdx);
    }

    entryClick(target) {
      if (target) {
        if (target.classList.contains('btn-entry')) {
          let verseIdx = parseInt(target.dataset.verseIdx);
          if (this.strongMode) {
            queue.publish('bookmark-list.strong-select', verseIdx);
          } else {
            queue.publish('bookmark-list.select', verseIdx);
          }
        } else if (target.classList.contains('btn-icon--h-menu')) {
          let ref = target.previousSibling;
          this.menuClick(ref);
        }
      }
    }

    expandModeUpdate(expandMode) {
      this.expandMode = expandMode;
      if (this.expandMode) {
        this.btnExpandMode.classList.add('btn-icon--active');
      } else {
        this.btnExpandMode.classList.remove('btn-icon--active');
      }
      this.updateBookmarks();
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
      this.btnExpandMode = this.toolbarLower.querySelector(
        '.btn-icon--expand-mode');
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
      if (this.expandMode) {
        this.verseClick(target);
      } else {
        this.entryClick(target);
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
      this.activeEntry = target.closest('div');
      let top = target.offsetTop;
      this.actionMenu.style.top = `${top}px`;
      this.actionMenu.classList.remove('action-menu--hide');
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
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnBack) {
          queue.publish('bookmark.back', null);
        } else if (target === this.btnSortAscend) {
          queue.publish('bookmark-list.sort-ascend', null);
        } else if (target === this.btnSortInvert) {
          queue.publish('bookmark-list.sort-invert', null);
        } else if (target === this.btnBookmarkFolder) {
          queue.publish('bookmark-folder', null);
        } else if (target === this.btnExpandMode) {
          queue.publish('bookmark-list.expand-mode.click', null);
        } else if (target === this.btnStrongMode) {
          queue.publish('bookmark-list.strong-mode.click', null);
        }
      }
    }

    up(verseIdx) {
      queue.publish('bookmark-list.up', verseIdx);
    }

    updateBanner() {
      this.banner.innerHTML = `${this.activeFolder.name}`;
    }

    updateActiveFolder(activeFolder) {
      this.activeFolder = activeFolder;
      this.updateBanner();
      this.updateBookmarks();
    }

    updateBookmarks() {
      let scrollSave = this.scroll.scrollTop;
      removeAllChildren(this.list);
      if (this.activeFolder.bookmarks.length === 0) {
        this.empty.classList.remove('empty--hide');
      } else {
        this.empty.classList.add('empty--hide');
        let fragment = document.createDocumentFragment();
        if (this.expandMode) {
          for (let verseObj of this.activeFolder.verseObjs) {
            let ref = this.buildVerse(verseObj);
            fragment.appendChild(ref);
          }
        } else {
          for (let verseIdx of this.activeFolder.bookmarks) {
            let ref = this.buildEntry(verseIdx);
            fragment.appendChild(ref);
          }
        }
        this.list.appendChild(fragment);
      }
      this.scroll.scrollTop = scrollSave;
    }

    verseClick(target) {
      if (target) {
        if (target.classList.contains('btn-result')) {
          let verseIdx = parseInt(target.dataset.verseIdx);
          if (this.strongMode) {
            queue.publish('bookmark-list.strong-select', verseIdx);
          } else {
            queue.publish('bookmark-list.select', verseIdx);
          }
        }
      }
    }

  }

  const actionSet$1 = [
    { icon: 'move', ariaLabel: 'Move' },
    { icon: 'copy', ariaLabel: 'Copy' },
    { icon: 'cancel', ariaLabel: 'Cancel' },
  ];

  const lowerToolSet$j = [
    { type: 'btn', icon: 'bookmark-folder', ariaLabel: 'Bookmark Folder' },
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
      let btnMenu = templateBtnIcon('h-menu', 'h-menu', 'Menu');
      entry.appendChild(btnEntry);
      entry.appendChild(btnMenu);
      return entry;
    }

    buildPage() {
      this.page = templatePage('bookmark-move-copy');

      this.toolbarUpper = templateToolbarUpper(upperToolSet$j);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('bookmark-move-copy');

      this.empty = templateElement('div', 'empty', 'bookmark-move-copy', null,
        'No Target Folder');
      this.scroll.appendChild(this.empty);

      this.list = templateElement('div', 'list', 'bookmark-move-copy', null,
        null);
      this.scroll.appendChild(this.list);

      this.actionMenu = templateActionMenu('bookmark-move-copy', actionSet$1);
      this.scroll.appendChild(this.actionMenu);
      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$j);
      this.page.appendChild(this.toolbarLower);

      let container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    copy(folderName) {
      let copyPkg = {
        to: folderName,
        verseIdx: this.verseIdx,
      };
      queue.publish('bookmark-move-copy.copy', copyPkg);
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
        if (target.classList.contains('btn-icon--h-menu')) {
          let entry = target.previousSibling;
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
      let movePkg = {
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
      this.activeEntry = target.closest('div');
      let top = target.offsetTop;
      this.actionMenu.style.top = `${top}px`;
      this.actionMenu.classList.remove('action-menu--hide');
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
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnBookmarkFolder) {
          queue.publish('bookmark-folder', null);
        }
      }
    }

    updateBanner() {
      let ref = this.verse[verseCitation];
      this.banner.innerHTML = `${ref} <br> Move/Copy to Folder:`;
    }

    updateFolders() {
      let scrollSave = this.scroll.scrollTop;
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
      this.scroll.scrollTop = scrollSave;
    }

  }

  const actionSet = [
    { icon: 'up', ariaLabel: 'Up' },
    { icon: 'down', ariaLabel: 'Down' },
    { icon: 'rename', ariaLabel: 'Rename' },
    { icon: 'delete', ariaLabel: 'Delete' },
    { icon: 'cancel', ariaLabel: 'Cancel' },
  ];

  const lowerToolSet$i = [
    { type: 'btn', icon: 'back', ariaLabel: 'Back' },
    { type: 'btn', icon: 'bookmark-folder-add', ariaLabel: 'Bookmark Folder Add' },
    { type: 'btn', icon: 'import', ariaLabel: 'Import' },
    { type: 'btn', icon: 'export', ariaLabel: 'Export' },
    { type: 'btn', icon: 'bookmark-list', ariaLabel: 'Bookmark List' },
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
      let btnMenu = templateBtnIcon('h-menu', 'h-menu', 'Menu');
      entry.appendChild(btnEntry);
      entry.appendChild(btnMenu);
      return entry;
    }

    buildPage() {
      this.page = templatePage('bookmark-folder');

      this.toolbarUpper = templateToolbarUpper(upperToolSet$i);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('bookmark-folder');

      this.list = templateElement('div', 'list', 'bookmark-folder', null, null);
      this.scroll.appendChild(this.list);

      this.actionMenu = templateActionMenu('bookmark-folder', actionSet);
      this.scroll.appendChild(this.actionMenu);
      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$i);
      this.page.appendChild(this.toolbarLower);

      let container = document.querySelector('.container');
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
          queue.publish('bookmark-folder.select', folderName);
        } else if (target.classList.contains('btn-icon--h-menu')) {
          let entry = target.previousSibling;
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
      this.activeEntry = target.closest('div');
      let top = target.offsetTop;
      this.actionMenu.style.top = `${top}px`;
      this.actionMenu.classList.remove('action-menu--hide');
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
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnBack) {
          queue.publish('bookmark.back', null);
        } else if (target === this.btnBookmarkList) {
          queue.publish('bookmark-list', null);
        } else if (target === this.btnBookmarkFolderAdd) {
          queue.publish('bookmark-folder-add', null);
        } else if (target === this.btnExport) {
          queue.publish('bookmark-export', null);
        } else if (target === this.btnImport) {
          queue.publish('bookmark-import', null);
        }
      }
    }

    up(folderName) {
      queue.publish('bookmark-folder.up', folderName);
    }

    updateFolders() {
      let scrollSave = this.scroll.scrollTop;
      removeAllChildren(this.list);
      let fragment = document.createDocumentFragment();
      for (let folderName of this.folderList) {
        let entry = this.buildEntry(folderName);
        fragment.appendChild(entry);
      }
      this.list.appendChild(fragment);
      this.scroll.scrollTop = scrollSave;
    }

  }

  const dialogToolset$6 = [
    { type: 'label', text: 'Name' },
    { type: 'input', ariaLabel: 'Name' },
    { type: 'btn', id: 'save', ariaLabel: 'Save' },
  ];

  const lowerToolSet$h = [
    { type: 'btn', icon: 'bookmark-folder', ariaLabel: 'Bookmark Folder' },
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
      this.page = templatePage('bookmark-folder-add');

      this.toolbarUpper = templateToolbarUpper(upperToolSet$h);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('bookmark-folder-add');
      this.dialog = templateDivDialog('bookmark-folder-add', dialogToolset$6);
      this.scroll.appendChild(this.dialog);

      this.message = templateElement('div', 'message',
        'bookmark-folder-add', null, null);
      this.scroll.appendChild(this.message);

      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$h);
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

    error(message) {
      this.message.textContent = message;
      this.message.classList.remove('message--hide');
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
        this.inputName.blur();
        this.saveClick();
      }
    }

    saveClick() {
      let name = this.inputName.value;
      if (name) {
        queue.publish('bookmark-folder-add.save', name);
      }
    }

    show() {
      this.page.classList.remove('page--hide');
      this.message.classList.add('message--hide');
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
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnBookmarkFolder) {
          queue.publish('bookmark-folder', null);
        }
      }
    }

  }

  const dialogToolset$5 = [
    { type: 'label', text: null },
    { type: 'btn', id: 'delete', ariaLabel: 'Delete' },
  ];

  const lowerToolSet$g = [
    { type: 'btn', icon: 'bookmark-folder', ariaLabel: 'Bookmark Folder' },
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
      this.page = templatePage('bookmark-folder-delete');

      this.toolbarUpper = templateToolbarUpper(upperToolSet$g);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('bookmark-folder-delete');
      this.dialog = templateDivDialog('bookmark-folder-delete', dialogToolset$5);
      this.scroll.appendChild(this.dialog);
      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$g);
      this.page.appendChild(this.toolbarLower);

      let container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    deleteClick() {
      queue.publish('bookmark-folder-delete.confirm', this.folderName);
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
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnBookmarkFolder) {
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
    { type: 'btn', id: 'save', ariaLabel: 'Save' },
  ];

  const lowerToolSet$f = [
    { type: 'btn', icon: 'bookmark-folder', ariaLabel: 'Bookmark Folder' },
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
      this.page = templatePage('bookmark-folder-rename');

      this.toolbarUpper = templateToolbarUpper(upperToolSet$f);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('bookmark-folder-rename');
      this.dialog = templateDivDialog('bookmark-folder-rename', dialogToolset$4);
      this.scroll.appendChild(this.dialog);

      this.message = templateElement('div', 'message',
        'bookmark-folder-rename', null, null);
      this.scroll.appendChild(this.message);

      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$f);
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

    error(message) {
      this.message.textContent = message;
      this.message.classList.remove('message--hide');
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
        this.inputName.blur();
        this.saveClick();
      }
    }

    saveClick() {
      let name = this.inputName.value;
      if (name) {
        this.namePkg.new = name;
        queue.publish('bookmark-folder-rename.save', this.namePkg);
      }
    }

    show() {
      this.page.classList.remove('page--hide');
      this.message.classList.add('message--hide');
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
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnBookmarkFolder) {
          queue.publish('bookmark-folder', null);
        }
      }
    }

  }

  const message = 'Select All and Copy the text below. ' +
    'Then Paste in a text editor and save the file.';

  const dialogToolset$3 = [
    { type: 'label', text: message },
    { type: 'textarea', ariaLabel: 'Bookmark Package' },
  ];

  const lowerToolSet$e = [
    { type: 'btn', icon: 'bookmark-folder', ariaLabel: 'Bookmark Folder' },
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
      let bookmarkPkg = {};
      bookmarkPkg.tome = tomeName;
      bookmarkPkg.folders = this.folders;
      return JSON.stringify(bookmarkPkg, null);
    }

    buildPage() {
      this.page = templatePage('bookmark-export');

      this.toolbarUpper = templateToolbarUpper(upperToolSet$e);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('bookmark-export');
      this.dialog = templateDivDialog('bookmark-export', dialogToolset$3);
      this.scroll.appendChild(this.dialog);
      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$e);
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
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnBookmarkFolder) {
          queue.publish('bookmark-folder', null);
        }
      }
    }

  }

  const dialogToolset$2 = [
    { type: 'label', text: 'Paste Bookmark Package Here:' },
    { type: 'textarea', ariaLabel: 'Bookmark Package' },
    { type: 'btn', id: 'import', ariaLabel: 'Import' },
  ];

  const lowerToolSet$d = [
    { type: 'btn', icon: 'bookmark-folder', ariaLabel: 'Bookmark Folder' },
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
      this.page = templatePage('bookmark-import');

      this.toolbarUpper = templateToolbarUpper(upperToolSet$d);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('bookmark-import');
      this.dialog = templateDivDialog('bookmark-import', dialogToolset$2);
      this.scroll.appendChild(this.dialog);

      this.message = templateElement('div', 'message', 'bookmark-import', null,
        null);
      this.scroll.appendChild(this.message);
      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$d);
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
      this.message.classList.add('message--hide');
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
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnBookmarkFolder) {
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
        queue.publish('read.scroll-to-verse', this.selectVerseIdx);
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
      let chapterIdx = chapterIdxByVerseIdx(verseIdx);
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
  const flatten = (arr) => [].concat.apply([], arr);
  const product = (sets) =>
    sets.reduce((acc, set) =>
      flatten(acc.map((x) => set.map((y) => [...x, y]))), [
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
          chapters,
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
          sliceEnd,
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
      return;
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
        verses,
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
      let index = this.searchHistory.indexOf(str);
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
        queue.publish('search.query.error', message);
      } else {
        this.rig = rig;
        this.searchQuery = searchQuery;
        this.saveQuery();
        this.addHistory();
        await this.updateSearchVerses();
        queue.publish('rig.update', this.rig);
        this.resetFilter();
        queue.publish('search.query.update', this.searchQuery);
      }
    }

    resetFilter() {
      let filter = this.tomeFilter();
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
      let defaultFilter = this.tomeFilter();
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
      let defaultHistory = [];
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
      let defaultMode = false;
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
      let defaultQuery = DEFAULT_QUERY;
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
      let defaultTask = 'search-result';
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
        chapterIdx: -1
      };
    }

    updateHistory() {
      this.saveHistory();
      queue.publish('search.history.update', this.searchHistory);
    }

    async updateSearchVerses() {
      this.searchVerseObjs = await tomeDb.verses.bulkGet(
        this.rig.tomeBin[tomeBinVerses]);
      queue.publish('search.verses.update', this.searchVerseObjs);
    }

  }

  const lowerToolSet$c = [
    { type: 'btn', icon: 'back', ariaLabel: 'Back' },
    { type: 'btn', icon: 'search-lookup', ariaLabel: 'Search Lookup' },
    { type: 'btn', icon: 'filter', ariaLabel: 'Search Filter' },
    { type: 'btn', icon: 'history', ariaLabel: 'Search History' },
    { type: 'btn', icon: 'strong-mode', ariaLabel: 'Strong Mode' },
  ];

  const upperToolSet$c = [
    { type: 'banner', cssModifier: 'search-result', text: null },
  ];

  const binIdx$1 = 0;
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

    buildPage() {
      this.page = templatePage('search-result');

      this.toolbarUpper = templateToolbarUpper(upperToolSet$c);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('search-result');
      this.list = templateElement('div', 'list', 'search-result', null, null);
      this.scroll.appendChild(this.list);

      this.loadMore = templateElement('div', 'load-more', 'search-result', null, null);
      this.btnLoadMore = document.createElement('button');
      this.btnLoadMore.classList.add('btn-load-more');
      this.btnLoadMore.textContent = 'Load More';
      this.loadMore.appendChild(this.btnLoadMore);
      this.scroll.appendChild(this.loadMore);

      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$c);
      this.page.appendChild(this.toolbarLower);

      let container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    buildRefSpan(verseObj) {
      let refSpan = document.createElement('span');
      refSpan.classList.add('font--bold');
      refSpan.textContent = verseObj.v[verseCitation] + ' ';
      return refSpan;
    }

    buildVerse(verseObj) {
      let btn = document.createElement('button');
      btn.classList.add('btn-result');
      btn.dataset.verseIdx = verseObj.k;
      let searchText = document.createElement('span');
      searchText.classList.add('span-result-text');
      let acrostic = templateAcrostic(verseObj);
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
          this.updateResult();
        }
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
        queue.publish('search-result.strong-select', verseIdx);
      } else {
        queue.publish('search-result.read-select', verseIdx);
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
      let verseObjs = this.searchVerseObjs.filter(x => verses.includes(x.k));
      for (let verseObj of verseObjs) {
        let verse = this.buildVerse(verseObj);
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
      queue.subscribe('font.update', (font) => {
        this.fontUpdate(font);
      });

      queue.subscribe('font-size.update', (fontSize) => {
        this.fontSizeUpdate(fontSize);
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
      queue.subscribe('search.strong-mode.update', (strongMode) => {
        this.modeUpdate(strongMode);
      });
      queue.subscribe('search.verses.update', (searchVerseObjs) => {
        this.versesUpdate(searchVerseObjs);
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnBack) {
          queue.publish('search.back', null);
        } else if (target === this.btnFilter) {
          queue.publish('search-filter', null);
        } else if (target === this.btnHistory) {
          queue.publish('search-history', null);
        } else if (target === this.btnStrongMode) {
          queue.publish('search.strong-mode.click', null);
        } else if (target === this.btnSearchLookup) {
          queue.publish('search-lookup', null);
        }
      }
    }

    updateBanner() {
      this.banner.innerHTML = `${this.citation} ` +
        `(${this.wordCount}/${this.verseCount})<br>` +
        `${this.rig.query}`;
    }

    updateResult() {
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

  const lowerToolSet$b = [
    { type: 'btn', icon: 'result', ariaLabel: 'Search Result' },
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
      let bookIdx = bookBin[bookBinBookIdx];
      let wordCount = bookBin[bookBinWordCount];
      let verseCount = bookBin[bookBinVerseCount];
      let citation = tomeBooks[bookIdx][bookLongName];

      let bookFilter = document.createElement('div');
      bookFilter.classList.add('filter', 'filter--book');

      let btnUnfold = templateBtnIcon('next', 'filter-next', 'Unfold Book');
      btnUnfold.dataset.bookIdx = bookIdx;
      bookFilter.appendChild(btnUnfold);

      let btnFold = templateBtnIcon('down', 'filter-down', 'Fold Book');
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

      this.toolbarUpper = templateToolbarUpper(upperToolSet$b);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('search-filter');
      this.list = templateElement('div', 'list', 'search-filter', null, null);
      this.scroll.appendChild(this.list);
      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$b);
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
        chapterIdx: chapterIdx,
      };
      queue.publish('search-filter.select', searchFilter);
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
        } else if (target.classList.contains('btn-icon--filter-down')) {
          this.foldClick(target);
        } else if (target.classList.contains('btn-icon--filter-next')) {
          this.unfoldClick(target);
        }
      }
    }

    rigUpdate(rig) {
      this.rig = rig;
      this.updateBanner();
      this.updateFilters();
    }

    scrollToTop() {
      this.scroll.scrollTop = 0;
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
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnSearchResult) {
          queue.publish('search-result', null);
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

    updateFilters() {
      this.scrollToTop();
      removeAllChildren(this.list);
      if (this.rig.state === 'OK') {
        let list = this.buildFilters();
        this.list.appendChild(list);
      }
    }

  }

  const lowerToolSet$a = [
    { type: 'btn', icon: 'result', ariaLabel: 'Search Result' },
    { type: 'btn', icon: 'history-clear', ariaLabel: 'Clear History' },
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
      let entry = document.createElement('div');
      entry.classList.add('entry', 'entry--history');
      let btnEntry = document.createElement('button');
      btnEntry.classList.add('btn-entry', 'btn-entry--history');
      btnEntry.dataset.historyIdx = idx;
      btnEntry.textContent = query;
      entry.appendChild(btnEntry);
      let btnDelete = templateBtnIcon('delete', 'delete', 'Delete');
      entry.appendChild(btnDelete);
      return entry;
    }

    buildPage() {
      this.page = templatePage('search-history');

      this.toolbarUpper = templateToolbarUpper(upperToolSet$a);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('search-history');
      this.empty = templateElement('div', 'empty', 'search-history', null,
        'No Searches Saved');
      this.scroll.appendChild(this.empty);

      this.list = templateElement('div', 'list', 'search-history', null, null);
      this.scroll.appendChild(this.list);

      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$a);
      this.page.appendChild(this.toolbarLower);

      let container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    delete(historyIdx) {
      queue.publish('search-history.delete', historyIdx);
    }

    down(query) {
      queue.publish('search-history.down', query);
    }

    getElements() {
      this.btnResult = this.toolbarLower.querySelector(
        '.btn-icon--result');
      this.btnHistoryClear = this.toolbarLower.querySelector(
        '.btn-icon--history-clear');
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
      let target = event.target.closest('button');
      if (target) {
        if (target.classList.contains('btn-entry--history')) {
          let query = target.textContent;
          queue.publish('search-history.select', query);
        } else if (target.classList.contains('btn-icon--delete')) {
          let entry = target.previousSibling;
          let query = entry.textContent;
          queue.publish('search-history.delete', query);
        }
      }
    }

    show() {
      this.page.classList.remove('page--hide');
    }

    subscribe() {
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
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnResult) {
          queue.publish('search-result', null);
        } else if (target === this.btnHistoryClear) {
          queue.publish('search-history.clear', null);
        }
      }
    }

    updateHistory() {
      let scrollSave = this.scroll.scrollTop;
      removeAllChildren(this.list);
      if (this.history.length === 0) {
        this.empty.classList.remove('empty--hide');
      } else {
        this.empty.classList.add('empty--hide');
        let fragment = document.createDocumentFragment();
        for (let query of this.history) {
          let entry = this.buildEntry(query);
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
    { type: 'btn', id: 'search', ariaLabel: 'Search' },
  ];

  const lowerToolSet$9 = [
    { type: 'btn', icon: 'back', ariaLabel: 'Back' },
    { type: 'btn', icon: 'result', ariaLabel: 'Search Result' },
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
      this.page = templatePage('search-lookup');

      this.toolbarUpper = templateToolbarUpper(upperToolSet$9);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('search-lookup');
      this.dialog = templateDivDialog('search-lookup', dialogToolset$1);
      this.scroll.appendChild(this.dialog);

      this.message = templateElement('div', 'message',
        'search-lookup', null, null);
      this.scroll.appendChild(this.message);

      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$9);
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
        this.inputQuery.blur();
        this.searchClick();
      }
    }

    searchClick() {
      let query = this.inputQuery.value;
      queue.publish('search-lookup.search', query);
    }

    show() {
      this.inputQuery.value = '';
      this.error.textContent = '';
      this.message.classList.add('message--hide');
      this.page.classList.remove('page--hide');
      this.inputQuery.focus();
    }

    subscribe() {
      queue.subscribe('search.query.error', (message) => {
        this.error(message);
      });
      queue.subscribe('search-lookup.hide', () => {
        this.hide();
      });
      queue.subscribe('search-lookup.show', () => {
        this.show();
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnBack) {
          queue.publish('search.back', null);
        } else if (target === this.btnResult) {
          queue.publish('search-result', null);
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
        queue.publish('read.scroll-to-verse', this.selectVerseIdx);
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

    lookupCancel() {
      queue.publish('search.task.change', 'search-result');
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
      let chapterIdx = chapterIdxByVerseIdx(verseIdx);
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
      queue.subscribe('search-lookup.cancel', () => {
        this.lookupCancel();
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
      let strongDef = this.strongChain.pop();
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
      this.strongDefObj = await strongDb.defs.get(this.strongDef);
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
      let strongFilter = this.tomeFilter();
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
      let index = this.strongHistory.indexOf(strongDef);
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
      let defaultChain = [];
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
      let defaultDef = 'G2424';
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
      let defaultFilter = this.tomeFilter();
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
      let defaultHistory = [];
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
      let defaultMode = false;
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
      let defaultTask = 'strong-def';
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
      let defaultVerseIdx = IDX_1_JOHN_4_19;
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
      let defaultWord = null;
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

    async updateWordMaps() {
      if (this.words.length) {
        let verses = this.wordTomeBin[tomeBinVerses];
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
        let word = this.words.find(x => x[wordKjvWord] === this.strongWord);
        this.wordTomeBin = word[wordTomeBin];
        queue.publish('strong.wordTomeBin.update', this.wordTomeBin);
        let verses = this.wordTomeBin[tomeBinVerses];
        this.wordVerseObjs = await tomeDb.verses.bulkGet(verses);
        queue.publish('strong.wordVerse.update', this.wordVerseObjs);
      } else {
        this.wordTomeBin = [];
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
        let word = this.words.find(x => x[wordKjvWord] === this.strongWord);
        this.wordTomeBin = word[wordTomeBin];
      } else {
        this.wordTomeBin = [];
      }
      await this.updateWordVerses();
      await this.updateWordMaps();
      this.filterReset();
      queue.publish('strong.word.update', this.strongWord);
    }

    async wordFirst() {
      let firstKjvWord;
      if (this.words.length) {
        firstKjvWord = this.words[firstWord][wordKjvWord];
      } else {
        firstKjvWord = null;
      }
      await this.wordChange(firstKjvWord);
    }

  }

  const lowerToolSet$8 = [
    { type: 'btn', icon: 'back', ariaLabel: 'Back' },
    { type: 'btn', icon: 'strong-lookup', ariaLabel: 'Strong Lookup' },
    { type: 'btn', icon: 'history', ariaLabel: 'Strong History' },
    { type: 'btn', icon: 'strong-verse', ariaLabel: 'Strong Verse' },
    { type: 'btn', icon: 'result', ariaLabel: 'Strong Result' },
    { type: 'btn', icon: 'prev', ariaLabel: 'Previous Strong' },
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
      let fragment = document.createDocumentFragment();
      let lemma = templateElement('div', 'strong-def', 'lemma', '',
        this.def[defLemma].normalize('NFC'));
      if (this.strongDef.startsWith('H')) {
        lemma.classList.add('font--hebrew');
      } else {
        lemma.classList.add('font--greek');
      }
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

      this.toolbarUpper = templateToolbarUpper(upperToolSet$8);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('strong-def');
      this.list = templateElement('div', 'list', 'strong-def', null, null);
      this.scroll.appendChild(this.list);
      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$8);
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

    chainUpdate(strongChain) {
      this.strongChain = strongChain;
      if (this.strongChain.length) {
        this.btnPrev.classList.remove('btn-icon--hide');
      } else {
        this.btnPrev.classList.add('btn-icon--hide');
      }
    }

    defClick(btn) {
      let strongDef = btn.dataset.strongDef;
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
      this.btnLookup = this.toolbarLower.querySelector(
        '.btn-icon--strong-lookup');
      this.btnVerse = this.toolbarLower.querySelector(
        '.btn-icon--strong-verse');
      this.btnHistory = this.toolbarLower.querySelector(
        '.btn-icon--history');
      this.btnResult = this.toolbarLower.querySelector(
        '.btn-icon--result');
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
      let target = event.target.closest('button');
      if (target) {
        if (target.classList.contains('btn-strong-word')) {
          this.wordClick(target);
        } else if (target.classList.contains('btn-strong-def')) {
          this.defClick(target);
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
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnBack) {
          queue.publish('strong.back', null);
        } else if (target === this.btnLookup) {
          queue.publish('strong-lookup', null);
        } else if (target === this.btnHistory) {
          queue.publish('strong-history', null);
        } else if (target === this.btnVerse) {
          queue.publish('strong-verse', null);
        } else if (target === this.btnResult) {
          queue.publish('strong-result', null);
        } else if (target === this.btnPrev) {
          queue.publish('strong.prev', null);
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

    updateDefs() {
      this.scrollToTop();
      removeAllChildren(this.list);
      let def = this.buildDef();
      this.list.appendChild(def);
      let strongWords = this.buildWords();
      this.list.appendChild(strongWords);
    }

    wordClick(btn) {
      let word = btn.dataset.word;
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
    { type: 'btn', icon: 'result', ariaLabel: 'Strong Result' },
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
      let bookIdx = bookBin[bookBinBookIdx];
      let wordCount = bookBin[bookBinWordCount];
      let verseCount = bookBin[bookBinVerseCount];
      let citation = tomeBooks[bookIdx][bookLongName];

      let bookFilter = document.createElement('div');
      bookFilter.classList.add('filter', 'filter--book');

      let btnUnfold = templateBtnIcon('next', 'filter-next', 'Unfold Book');
      btnUnfold.dataset.bookIdx = bookIdx;
      bookFilter.appendChild(btnUnfold);

      let btnFold = templateBtnIcon('down', 'filter-down', 'Fold Book');
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

      this.toolbarUpper = templateToolbarUpper(upperToolSet$7);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('strong-filter');

      this.empty = templateElement('div', 'empty', 'strong-filter', null,
        'No Strong Filter.');
      this.scroll.appendChild(this.empty);
      this.list = templateElement('div', 'list', 'strong-filter', null, null);
      this.scroll.appendChild(this.list);
      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$7);
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
      this.updatePane();
    }

    filterClick(btnFilter) {
      let bookIdx = parseInt(btnFilter.dataset.bookIdx);
      let chapterIdx = parseInt(btnFilter.dataset.chapterIdx);
      let strongFilter = {
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
        } else if (target.classList.contains('btn-icon--filter-down')) {
          this.foldClick(target);
        } else if (target.classList.contains('btn-icon--filter-next')) {
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
      queue.subscribe('strong.wordTomeBin.update', (strongWordTomeBin) => {
        this.wordTomeBinUpdate(strongWordTomeBin);
      });
    }

    toolbarLowerClick(event) {
      event.preventDefault();
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnResult) {
          queue.publish('strong-result', null);
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
      if (this.strongWordTomeBin.length) {
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
    }

    updateBanner() {
      if (this.strongWord) {
        this.banner.innerHTML = `${this.strongDef} ${this.strongWord}`;
      } else {
        this.banner.innerHTML = `${this.strongDef}`;
      }
    }

    updateFilters() {
      this.scrollToTop();
      removeAllChildren(this.list);
      if (this.strongWordTomeBin.length) {
        this.empty.classList.add('empty--hide');
        let list = this.buildFilters();
        this.list.appendChild(list);
      } else {
        this.empty.classList.remove('empty--hide');
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

    wordTomeBinUpdate(strongWordTomeBin) {
      this.strongWordTomeBin = strongWordTomeBin;
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
    { type: 'btn', icon: 'strong-def', ariaLabel: 'Strong Definition' },
    { type: 'btn', icon: 'history-clear', ariaLabel: 'Clear History' },
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
      let entry = document.createElement('div');
      entry.classList.add('entry', 'entry--history');
      let btnEntry = document.createElement('button');
      btnEntry.classList.add('btn-entry', 'btn-entry--history');
      let transliteration = strongCitations[strongDef];
      let first = transliteration.replace(',', '').split(' ')[firstXlit];
      btnEntry.textContent = `${strongDef} ${first.normalize('NFC')}`;
      btnEntry.dataset.def = strongDef;
      entry.appendChild(btnEntry);
      let btnDelete = templateBtnIcon('delete', 'delete', 'Delete');
      entry.appendChild(btnDelete);
      return entry;
    }

    buildPage() {
      this.page = templatePage('strong-history');

      this.toolbarUpper = templateToolbarUpper(upperToolSet$6);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('strong-history');
      this.empty = templateElement('div', 'empty', 'strong-history', null,
        'No Strong History.');
      this.scroll.appendChild(this.empty);

      this.list = templateElement('div', 'list', 'strong-history', null, null);
      this.scroll.appendChild(this.list);

      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$6);
      this.page.appendChild(this.toolbarLower);

      let container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    delete(strongDef) {
      queue.publish('strong-history.delete', strongDef);
    }

    getElements() {
      this.btnDef = this.toolbarLower.querySelector(
        '.btn-icon--strong-def');
      this.btnHistoryClear = this.toolbarLower.querySelector(
        '.btn-icon--history-clear');
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
      let target = event.target.closest('button');
      if (target) {
        if (target.classList.contains('btn-entry--history')) {
          let strongDef = target.dataset.def;
          queue.publish('strong-history.select', strongDef);
        } else if (target.classList.contains('btn-icon--delete')) {
          let entry = target.previousSibling;
          let strongDef = entry.dataset.def;
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
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnDef) {
          queue.publish('strong-def', null);
        } else if (target === this.btnHistoryClear) {
          queue.publish('strong-history.clear', null);
        }
      }
    }

    updateHistory() {
      let scrollSave = this.scroll.scrollTop;
      removeAllChildren(this.list);
      if (this.history.length === 0) {
        this.empty.classList.remove('empty--hide');
      } else {
        this.empty.classList.add('empty--hide');
        let fragment = document.createDocumentFragment();
        for (let strongDef of this.history) {
          let entry = this.buildEntry(strongDef);
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
    { type: 'btn', id: 'find', ariaLabel: 'Find' },
  ];

  const lowerToolSet$5 = [
    { type: 'btn', icon: 'strong-def', ariaLabel: 'Strong Definition' },
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
      this.page = templatePage('strong-lookup');

      this.toolbarUpper = templateToolbarUpper(upperToolSet$5);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('strong-lookup');
      this.dialog = templateDivDialog('strong-lookup', dialogToolset);
      this.scroll.appendChild(this.dialog);

      this.message = templateElement('div', 'message',
        'strong-lookup', null, null);
      this.scroll.appendChild(this.message);

      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$5);
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
        queue.publish('strong-lookup.find', strongNum.toUpperCase());
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
        this.inputStrongNum.blur();
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
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnDef) {
          queue.publish('strong-def', null);
        }
      }
    }

  }

  const lowerToolSet$4 = [
    { type: 'btn', icon: 'back', ariaLabel: 'Back' },
    { type: 'btn', icon: 'filter', ariaLabel: 'Strong Filter' },
    { type: 'btn', icon: 'strong-verse', ariaLabel: 'Strong Verse' },
    { type: 'btn', icon: 'strong-def', ariaLabel: 'Strong Definition' },
    { type: 'btn', icon: 'strong-mode', ariaLabel: 'Strong Mode' },
  ];

  const upperToolSet$4 = [
    { type: 'banner', cssModifier: 'strong-result', text: 'Strong Search' },
  ];

  const binIdx = 0;
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
    }

    addVerse(verseObj) {
      let btn = document.createElement('button');
      btn.classList.add('btn-result');
      btn.dataset.verseIdx = verseObj.k;
      let resultText = document.createElement('span');
      resultText.classList.add('span-search-text');
      let acrostic = templateAcrostic(verseObj);
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
      if (this.strongWordTomeBin.length) {
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
      } else {
        this.filteredVerses = [];
        this.wordCount = null;
        this.verseCount = null;
        this.citation = null;
      }
    }

    buildPage() {
      this.page = templatePage('strong-result');

      this.toolbarUpper = templateToolbarUpper(upperToolSet$4);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('strong-result');

      this.empty = templateElement('div', 'empty', 'strong-result', null,
        'No Strong Result.');
      this.scroll.appendChild(this.empty);

      this.list = templateElement('div', 'list', 'strong-result', null, null);
      this.scroll.appendChild(this.list);

      this.loadMore = templateElement('div', 'load-more', 'strong-result', null, null);
      this.btnLoadMore = document.createElement('button');
      this.btnLoadMore.classList.add('btn-load-more');
      this.btnLoadMore.textContent = 'Load More';
      this.loadMore.appendChild(this.btnLoadMore);
      this.scroll.appendChild(this.loadMore);

      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$4);
      this.page.appendChild(this.toolbarLower);

      let container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    buildRefSpan(verseObj) {
      let refSpan = document.createElement('span');
      refSpan.classList.add('font--bold');
      refSpan.textContent = verseObj.v[verseCitation] + ' ';
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
          parts.push(`<span class="super"> ${strongStr}</span>`);
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
            queue.publish('strong-result.strong-select', verseIdx);
          } else {
            queue.publish('strong-result.read-select', verseIdx);
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
      if (this.verseCount <= loadIncrement) {
        verses = this.filteredVerses;
        this.loadIdx = this.verseCount;
      } else {
        let sliceEnd = Math.min(this.loadIdx + loadIncrement, this.verseCount);
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

    scrollToTop() {
      this.scroll.scrollTop = 0;
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

    toolbarLowerClick(event) {
      event.preventDefault();
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnBack) {
          queue.publish('strong.back', null);
        } else if (target === this.btnFilter) {
          queue.publish('strong-filter', null);
        } else if (target === this.btnStrongMode) {
          queue.publish('strong.strong-mode.click', null);
        } else if (target === this.btnStrongDef) {
          queue.publish('strong-def', null);
        } else if (target === this.btnStrongVerse) {
          queue.publish('strong-verse', null);
        }
      }
    }

    updateBanner() {
      if (this.citation) {
        this.banner.innerHTML = `${this.citation} ` +
          `(${this.wordCount}/${this.verseCount})<br>` +
          `${this.strongDef} ${this.strongWord}`;
      } else {
        this.banner.innerHTML = this.strongDef;
      }
    }

    updatePane() {
      this.updateBanner();
      this.updateResult();
    }

    updateResult() {
      this.scrollToTop();
      removeAllChildren(this.list);
      if (this.verseCount) {
        this.empty.classList.add('empty--hide');
      } else {
        this.empty.classList.remove('empty--hide');
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
      this.strongWordTomeBin = wordTomeBin;
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
    { type: 'btn', icon: 'back', ariaLabel: 'Back' },
    { type: 'btn', icon: 'strong-def', ariaLabel: 'Strong Definition' },
    { type: 'btn', icon: 'result', ariaLabel: 'Strong Search' },
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
      this.page = templatePage('strong-verse');

      this.toolbarUpper = templateToolbarUpper(upperToolSet$3);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('strong-verse');
      this.list = templateElement('div', 'list', 'strong-verse', null, null);
      this.scroll.appendChild(this.list);
      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$3);
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
        queue.publish('strong-verse.select', strongDef);
      }
    }

    mapUpdate(strongMapObj) {
      this.strongMapObj = strongMapObj;
      this.maps = this.strongMapObj.v;
    }

    scrollToTop() {
      this.scroll.scrollTop = 0;
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
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnBack) {
          queue.publish('strong.back', null);
        } else if (target === this.btnStrongDef) {
          queue.publish('strong-def', null);
        } else if (target === this.btnResult) {
          queue.publish('strong-result', null);
        }
      }
    }

    updateBanner() {
      this.banner.textContent = this.verse[verseCitation];
    }

    updateVerse() {
      this.scrollToTop();
      removeAllChildren(this.list);
      let docFragment = document.createDocumentFragment();
      this.verseWords = this.verse[verseText].split(' ');
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
        queue.publish('read.scroll-to-verse', this.selectVerseIdx);
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

    historyDown(strongDef) {
      queue.publish('strong.history.down', strongDef);
    }

    historyPane() {
      queue.publish('strong.task.change', 'strong-history');
    }

    historySelect(strongDef) {
      queue.publish('strong.def.change', strongDef);
    }

    historyUp(strongDef) {
      queue.publish('strong.history.up', strongDef);
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
      let chapterIdx = chapterIdxByVerseIdx(verseIdx);
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
      queue.subscribe('strong-history.down', (strongDef) => {
        this.historyDown(strongDef);
      });
      queue.subscribe('strong-history.select', (strongDef) => {
        this.historySelect(strongDef);
      });
      queue.subscribe('strong-history.up', (strongDef) => {
        this.historyUp(strongDef);
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

  const fontDefault = 0;
  const fontSizeDefault = 1;
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
        fontName: 'Dancing Script',
        fontClass: 'font--dancing-script'
      });
      this.fonts.push({
        fontName: 'Shadows Into Light',
        fontClass: 'font--shadows-into-light'
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
      this.initializeThemes();
      this.restoreTheme();
    }

    restoreFont() {
      let defaultFont = this.fonts[fontDefault];
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
      let defaultFontSize = validFontSizes[fontSizeDefault];
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

    restoreTheme() {
      let defaultTheme = this.themes[themeDefault];
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
    { type: 'btn', icon: 'back', ariaLabel: 'Back' },
  ];

  const upperToolSet$2 = [
    { type: 'banner', cssModifier: 'setting', text: 'Setting' },
  ];

  const fontSize = [
    { size: 's', ariaLabel: 'Small' },
    { size: 'm', ariaLabel: 'Medium' },
    { size: 'l', ariaLabel: 'Large' },
    { size: 'xl', ariaLabel: 'Extra Large' },
    { size: 'xxl', ariaLabel: 'Extra Extra Large' },
  ];

  const templateBtnFontSize = (size, label) => {
    let btnFontSize = templateElement(
      'button', 'btn-font-size', null, label, null);
    btnFontSize.textContent = 'Aa';
    btnFontSize.classList.add(`font-size--${size}`);
    btnFontSize.dataset.size = `font-size--${size}`;
    return btnFontSize;
  };

  const templateBtnThemeType = (type, label) => {
    let btnThemeType = templateElement(
      'button', 'btn-theme-type', null, label, null);
    btnThemeType.textContent = label;
    btnThemeType.classList.add(`theme-type--${type}`);
    btnThemeType.dataset.type = `${type}`;
    return btnThemeType;
  };

  const templateSettingFont = (modifier, name) => {
    let divSetting = templateElement(
      'div', 'setting', modifier, null, null);
    let heading = templateElement(
      'h1', 'header', modifier, null, name);
    divSetting.appendChild(heading);
    let divCarousel = templateSettingCarousel('font', "Font");
    divSetting.appendChild(divCarousel);
    return divSetting;
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
    let divCarousel = templateElement(
      'div', 'carousel', modifier, null, null);
    let btnPrev = templateBtnIcon('prev', 'prev', `Previous ${name}`);
    let divName = templateElement(
      'div', 'name', modifier, null, null);
    let btnNext = templateBtnIcon('next', 'next', `Next ${name}`);
    divCarousel.appendChild(btnPrev);
    divCarousel.appendChild(divName);
    divCarousel.appendChild(btnNext);
    return divCarousel;
  };

  const templateSettingTheme = (modifier, name) => {
    let divSetting = templateElement(
      'div', 'setting', modifier, null, null);
    let heading = templateElement(
      'h1', 'header', modifier, null, name);
    divSetting.appendChild(heading);
    let divSelector = templateElement(
      'div', 'selector', 'theme-type', null, null);
    let btnDark = templateBtnThemeType('dark', 'Dark');
    divSelector.appendChild(btnDark);
    let btnLight = templateBtnThemeType('light', 'Light');
    divSelector.appendChild(btnLight);
    divSetting.appendChild(divSelector);
    let divCarousel = templateSettingCarousel('theme', 'Theme');
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

      this.toolbarUpper = templateToolbarUpper(upperToolSet$2);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('setting');

      this.fontSample = templateElement('div', 'font-sample', null, null, null);
      this.fontSample.innerHTML = '<p class="font-sample-verse">' +
        '<span class="font--bold">1 John 4:19 </span>' +
        'We love him, because he first loved us.</p>';
      this.scroll.appendChild(this.fontSample);

      this.divSettingFont = templateSettingFont('font', 'Font');
      this.scroll.appendChild(this.divSettingFont);

      this.divSettingFontSize = templateSettingFontSize('font-size', 'Font Size');
      this.scroll.appendChild(this.divSettingFontSize);

      this.divSettingTheme = templateSettingTheme('theme', 'Theme');
      this.scroll.appendChild(this.divSettingTheme);

      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$2);
      this.page.appendChild(this.toolbarLower);

      let container = document.querySelector('.container');
      container.appendChild(this.page);
    }

    fontClick(target) {
      let btn = target.closest('button');
      if (btn) {
        if (btn === this.btnPrevFont) {
          queue.publish('setting.font-prev', null);
        } else if (btn === this.btnNextFont) {
          queue.publish('setting.font-next', null);
        }
      }
    }

    fontSizeClick(target) {
      let btn = target.closest('button');
      if (btn.classList.contains('btn-font-size')) {
        let dataSize = btn.dataset.size;
        queue.publish('setting.font-size', dataSize);
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
      
      this.divSelectorThemeType = this.divSettingTheme.querySelector('.selector--theme-type');
      this.btnDarkTheme = this.divSelectorThemeType.querySelector('.theme-type--dark');
      this.btnLightTheme = this.divSelectorThemeType.querySelector('.theme-type--light');
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

    scrollClick(event) {
      event.preventDefault();
      let target = event.target;
      if (this.divCarouselFont.contains(target)) {
        this.fontClick(target);
      } else if (this.divSelectorFontSize.contains(target)) {
        this.fontSizeClick(target);
      } else if (this.divSelectorThemeType.contains(target)) {
        this.themeTypeClick(target);
      } else if (this.divCarouselTheme.contains(target)) {
        this.themeClick(target);
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
      let btn = target.closest('button');
      if (btn) {
        if (btn === this.btnPrevTheme) {
          queue.publish('setting.theme-prev', null);
        } else if (btn === this.btnNextTheme) {
          queue.publish('setting.theme-next', null);
        }
      }
    }

    themeTypeClick(target) {
      let btn = target.closest('button');
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
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnBack) {
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
      this.activeFontSizeBtn = this.divSelectorFontSize.querySelector(
        `button[data-size="${this.fontSize}"]`
      );
      this.activeFontSizeBtn.classList.add('btn-font-size--active');
    }

    updateThemeName() {
      this.divNameTheme.innerText = this.theme.themeName;
    }

    updateThemeType() {
      if (this.activeThemeTypeBtn) {
        this.activeThemeTypeBtn.classList.remove('btn-theme-type--active');
      }
      this.activeThemeTypeBtn = this.divSelectorThemeType.querySelector(
        `button[data-type="${this.theme.themeType}"]`
      );
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
      let nextNameIdx = nameIdx === this.maxThemeNamesIdx ? 0 : nameIdx += 1;
      this.themeIdx = this.themes.findIndex((theme) => {
        return theme.themeType === this.theme.themeType &&
          theme.themeName === this.themeNames[nextNameIdx];
      });
    }

    getPrevThemeIdx() {
      let nameIdx = this.themeNames.findIndex(x => x === this.theme.themeName);
      let nextNameIdx = nameIdx === 0 ? this.maxThemeNamesIdx : nameIdx -= 1;
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
      let idxNow = this.themeIdx;
      this.getDarkThemeIdx();
      if (idxNow === this.themeIdx) {
        return;
      }
      queue.publish('theme.change', this.themes[this.themeIdx]);
    }

    themeLight() {
      let idxNow = this.themeIdx;
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
    'about', 'bookmark', 'help', 'name-mode', 'navigator', 'overview', 'read',
    'search', 'setting', 'strong', 'thats-my-king',
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
      let defaultTask = 'help-read';
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
      let defaultTopic = 'overview';
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
    { type: 'btn', icon: 'back', ariaLabel: 'Back' },
    { type: 'btn', icon: 'help-read', ariaLabel: 'Help Read' },
  ];

  const upperToolSet$1 = [
    { type: 'banner', cssModifier: 'topic', text: 'Topic' },
  ];

  const helpTopicList = [
    { topic: 'about', name: 'About' },
    { topic: 'overview', name: 'Overview' },
    { topic: 'read', name: 'Read' },
    { topic: 'name-mode', name: 'Name Mode' },
    { topic: 'navigator', name: 'Navigator' },
    { topic: 'bookmark', name: 'Bookmark' },
    { topic: 'search', name: 'Search' },
    { topic: 'strong', name: 'Strong' },
    { topic: 'setting', name: 'Setting' },
    { topic: 'help', name: 'Help' },
    { topic: 'thats-my-king', name: 'That\'s MY KING!' },
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

      this.toolbarUpper = templateToolbarUpper(upperToolSet$1);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('help-topic');
      this.list = templateListTopic();
      this.scroll.appendChild(this.list);

      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet$1);
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

    scrollClick(event) {
      event.preventDefault();
      let target = event.target.closest('button');
      if (target) {
        if (target.classList.contains('btn-topic')) {
          let helpTopic = target.dataset.topic;
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
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnBack) {
          queue.publish('help.back', null);
        } else if (target === this.btnHelpRead) {
          queue.publish('help-read', null);
        }
      }
    }

  }

  const lowerToolSet = [
    { type: 'btn', icon: 'back', ariaLabel: 'Back' },
    { type: 'btn', icon: 'help-topic', ariaLabel: 'Help Topic' },
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
      this.page = templatePage('help-read');

      this.toolbarUpper = templateToolbarUpper(upperToolSet);
      this.page.appendChild(this.toolbarUpper);

      this.scroll = templateScroll('help-read');
      this.page.appendChild(this.scroll);

      this.toolbarLower = templateToolbarLower(lowerToolSet);
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
      let target = event.target.closest('button');
      if (target) {
        if (target === this.btnBack) {
          queue.publish('help.back', null);
        } else if (target === this.btnHelpTopic) {
          queue.publish('help-topic', null);
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
    let body = document.body;
    let load = body.querySelector('.load');

    await initializeTome();
    await initializeStrong();

    new ReadView();
    let readController = new ReadController();
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

    load.classList.add('load--hide');
    document.documentElement.classList.add(APP_FONT);

    console.log(`intializeApp():     ${Date.now()}`);
    readController.initializeApp();
    console.log(`ready:              ${Date.now()}`);

  })();

})();
