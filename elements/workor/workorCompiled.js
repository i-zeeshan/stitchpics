!function(){function e(t,o){var n=e.getBaseURL,i=e.getSelfURL,s=e.hasWorkerSupport?e.Operative.BrowserWorker:e.Operative.Iframe;if("function"==typeof t){var a=new s({main:t},o,n,i),u=function(){return a.api.main.apply(a,arguments)};u.transfer=function(){return a.api.main.transfer.apply(a,arguments)};for(var l in a.api)r.call(a.api,l)&&(u[l]=a.api[l]);return u}return new s(t,o,n,i).api}if("undefined"!=typeof window||!self.importScripts){var r={}.hasOwnProperty,t=document.getElementsByTagName("script"),o=t[t.length-1],n=/operative/.test(o.src)&&o.src;e.pool=function(r,t,o){r=0|Math.abs(r)||1;for(var n=[],i=0,s=0;r>s;++s)n.push(e(t,o));return{terminate:function(){for(var e=0;r>e;++e)n[e].destroy()},next:function(){return i=i+1===r?0:i+1,n[i]}}},e.hasWorkerSupport=!!window.Worker,e.hasWorkerViaBlobSupport=!1,e.hasTransferSupport=!1;var i=(location.protocol+"//"+location.hostname+(location.port?":"+location.port:"")+location.pathname).replace(/[^\/]+$/,"");e.objCreate=Object.create||function(e){function r(){}return r.prototype=e,new r},e.setSelfURL=function(e){n=e},e.getSelfURL=function(e){return n},e.setBaseURL=function(e){i=e},e.getBaseURL=function(){return i},window.operative=e}}(),function(){function e(e){this.value=e}function r(e,r,o,n){var i=this;e.get=e.get||function(e){return this[e]},e.set=e.set||function(e,r){return this[e]=r},this._curToken=0,this._queue=[],this._getBaseURL=o,this._getSelfURL=n,this.isDestroyed=!1,this.isContextReady=!1,this.module=e,this.dependencies=r||[],this.dataProperties={},this.api={},this.callbacks={},this.deferreds={},this._fixDependencyURLs(),this._setup();for(var s in e)t.call(e,s)&&this._createExposedMethod(s);this.api.__operative__=this,this.api.destroy=this.api.terminate=function(){return i.destroy()}}if("undefined"!=typeof window||!self.importScripts){var t={}.hasOwnProperty,o=[].slice,n={}.toString;operative.Operative=r;var i=r.Promise=window.Promise;r.prototype={_marshal:function(e){return e},_demarshal:function(e){return e},_enqueue:function(e){this._queue.push(e)},_fixDependencyURLs:function(){for(var e=this.dependencies,r=0,t=e.length;t>r;++r){var o=e[r];/\/\//.test(o)||(e[r]=o.replace(/^\/?/,this._getBaseURL().replace(/([^\/])$/,"$1/")))}},_dequeueAll:function(){for(var e=0,r=this._queue.length;r>e;++e)this._queue[e].call(this);this._queue=[]},_buildContextScript:function(e){var r,t=[],o=this.module,n=this.dataProperties;for(var i in o)r=o[i],"function"==typeof r?t.push('	self["'+i.replace(/"/g,'\\"')+'"] = '+r+";"):n[i]=r;return t.join("\n")+(e?"\n("+e+"());":"")},_createExposedMethod:function(r){var t=this,s=this.api[r]=function(){function n(){t.isContextReady?t._runMethod(r,s,a,l):t._enqueue(n)}if(t.isDestroyed)throw Error("Operative: Cannot run method. Operative has already been destroyed");var s=++t._curToken,a=o.call(arguments),u="function"==typeof a[a.length-1]&&a.pop(),l=a[a.length-1]instanceof e&&a.pop();if(!u&&!i)throw Error("Operative: No callback has been passed. Assumed that you want a promise. But `operative.Promise` is null. Please provide Promise polyfill/lib.");if(u)t.callbacks[s]=u,setTimeout(function(){n()},1);else if(i)return new i(function(e,r){var o;e.fulfil||e.fulfill?(o=e,o.fulfil=o.fulfill=e.fulfil||e.fulfill):o={fulfil:e,fulfill:e,resolve:e,reject:r,transferResolve:e,transferReject:r},t.deferreds[s]=o,n()})};s.transfer=function(){var r=[].slice.call(arguments),t="function"==typeof r[r.length-1]?r.length-2:r.length-1,o=r[t],i=n.call(o);if("[object Array]"!==i)throw Error("Operative:transfer() must be passed an Array of transfers as its last arguments (Expected: [object Array], Received: "+i+")");return r[t]=new e(o),s.apply(null,r)}},destroy:function(){this.isDestroyed=!0}}}}(),function(){function makeBlobURI(e){var r;try{r=new Blob([e],{type:"text/javascript"})}catch(t){r=new BlobBuilder,r.append(e),r=r.getBlob()}return URL.createObjectURL(r)}function workerBoilerScript(){var postMessage=self.postMessage,structuredCloningSupport=null,toString={}.toString;self.console={},self.isWorker=!0,["log","debug","error","info","warn","time","timeEnd"].forEach(function(e){self.console[e]=function(){postMessage({cmd:"console",method:e,args:[].slice.call(arguments)})}}),self.addEventListener("message",function(e){function callback(){returnResult({args:[].slice.call(arguments)})}function returnResult(e,r){postMessage({cmd:"result",token:data.token,result:e},hasTransferSupport&&r||[])}function extractTransfers(e){var r=e[e.length-1];if("[object Array]"!==toString.call(r))throw Error("Operative: callback.transfer() must be passed an Array of transfers as its last arguments");return r}var data=e.data;if("string"==typeof data&&0===data.indexOf("EVAL|"))return void eval(data.substring(5));if(null==structuredCloningSupport)return structuredCloningSupport="PING"===e.data[0],self.postMessage(structuredCloningSupport?"pingback:structuredCloningSupport=YES":"pingback:structuredCloningSupport=NO"),void(structuredCloningSupport||(postMessage=function(e){return self.postMessage(JSON.stringify(e))}));structuredCloningSupport||(data=JSON.parse(data));var defs=data.definitions,isDeferred=!1,args=data.args;if(defs)for(var i in defs)self[i]=defs[i];else{callback.transfer=function(){var e=[].slice.call(arguments),r=extractTransfers(e);returnResult({args:e},r)},args.push(callback),self.deferred=function(){function e(e,r){return returnResult({isDeferred:!0,action:"resolve",args:[e]},r),t}function r(e,r){returnResult({isDeferred:!0,action:"reject",args:[e]},r)}isDeferred=!0;var t={};return t.fulfil=t.fulfill=t.resolve=function(r){return e(r)},t.reject=function(e){return r(e)},t.transferResolve=function(r){var t=extractTransfers(arguments);return e(r,t)},t.transferReject=function(e){var t=extractTransfers(arguments);return r(e,t)},t};var result=self[data.method].apply(self,args);isDeferred||void 0===result||returnResult({args:[result]}),self.deferred=function(){throw Error("Operative: deferred() called at odd time")}}})}if("undefined"==typeof window&&self.importScripts)return void workerBoilerScript();var Operative=operative.Operative,URL=window.URL||window.webkitURL,BlobBuilder=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder,workerViaBlobSupport=function(){try{new Worker(makeBlobURI(";"))}catch(e){return!1}return!0}(),transferrableObjSupport=function(){try{var e=new ArrayBuffer(1);return new Worker(makeBlobURI(";")).postMessage(e,[e]),!e.byteLength}catch(r){return!1}}();operative.hasWorkerViaBlobSupport=workerViaBlobSupport,operative.hasTransferSupport=transferrableObjSupport,Operative.BrowserWorker=function(){Operative.apply(this,arguments)};var WorkerProto=Operative.BrowserWorker.prototype=operative.objCreate(Operative.prototype);WorkerProto._onWorkerMessage=function(e){var r=e.data;if("string"==typeof r&&0===r.indexOf("pingback"))return"pingback:structuredCloningSupport=NO"===r&&(this._marshal=function(e){return JSON.stringify(e)},this._demarshal=function(e){return JSON.parse(e)}),this.isContextReady=!0,this._postMessage({definitions:this.dataProperties}),void this._dequeueAll();switch(r=this._demarshal(r),r.cmd){case"console":window.console&&window.console[r.method].apply(window.console,r.args);break;case"result":var t=this.callbacks[r.token],o=this.deferreds[r.token],n=r.result&&r.result.isDeferred&&r.result.action;o&&n?o[n](r.result.args[0]):t?t.apply(this,r.result.args):o&&o.fulfil(r.result.args[0])}},WorkerProto._isWorkerViaBlobSupported=function(){return workerViaBlobSupport},WorkerProto._setup=function(){var e,r=this,t=this._getSelfURL(),o=this._isWorkerViaBlobSupported(),n=this._buildContextScript(o?workerBoilerScript:"");if(this.dependencies.length&&(n='importScripts("'+this.dependencies.join('", "')+'");\n'+n),o)e=this.worker=new Worker(makeBlobURI(n));else{if(!t)throw Error("Operaritve: No operative.js URL available. Please set via operative.setSelfURL(...)");e=this.worker=new Worker(t),e.postMessage("EVAL|"+n)}e.postMessage("EVAL|self.hasTransferSupport="+transferrableObjSupport),e.postMessage(["PING"]),e.addEventListener("message",function(e){r._onWorkerMessage(e)})},WorkerProto._postMessage=function(e){var r=transferrableObjSupport&&e.transfers;return r?this.worker.postMessage(e,r.value):this.worker.postMessage(this._marshal(e))},WorkerProto._runMethod=function(e,r,t,o){this._postMessage({method:e,args:t,token:r,transfers:o})},WorkerProto.destroy=function(){this.worker.terminate(),Operative.prototype.destroy.call(this)}}(),function(){function e(){window.__run__=function(e,r,t,o){function n(){return t.apply(this,arguments)}var i=!1;window.deferred=function(){return i=!0,o},n.transfer=function(){return t.apply(this,[].slice.call(arguments,0,arguments.length-1))},t&&r.push(n);var s=window[e].apply(window,r);window.deferred=function(){throw Error("Operative: deferred() called at odd time")},i||void 0===s||n(s)}}if("undefined"!=typeof window||!self.importScripts){var r=operative.Operative;r.Iframe=function(e){r.apply(this,arguments)};var t=r.Iframe.prototype=operative.objCreate(r.prototype),o=0;t._setup=function(){var r=this,t="__operativeIFrameLoaded"+ ++o;this.module.isWorker=!1;var n=this.iframe=document.body.appendChild(document.createElement("iframe"));n.style.display="none";var i=this.iframeWindow=n.contentWindow,s=i.document;window[t]=function(){window[t]=null;var o=s.createElement("script"),n=r._buildContextScript(e);void 0!==o.text?o.text=n:o.innerHTML=n,s.documentElement.appendChild(o);for(var a in r.dataProperties)i[a]=r.dataProperties[a];r.isContextReady=!0,r._dequeueAll()},s.open();var a="";this.dependencies.length&&(a+='\n<script src="'+this.dependencies.join('"><\/script><script src="')+'"><\/script>'),s.write(a+"\n<script>setTimeout(window.parent."+t+",0);<\/script>"),s.close()},t._runMethod=function(e,r,t){var o=this,n=this.callbacks[r],i=this.deferreds[r];this.iframeWindow.__run__(e,t,function(e){var r=n,t=i;r?r.apply(o,arguments):t&&t.fulfil(e)},i)},t.destroy=function(){this.iframe.parentNode.removeChild(this.iframe),r.prototype.destroy.call(this)}}}();var Workor=function(){function Workor(){var e=this,r=arguments.length<=0||void 0===arguments[0]?4:arguments[0];babelHelpers.classCallCheck(this,Workor),operative.setSelfURL(this._getPathToElements()+"workor/workorCompiled.js"),this._workerPool=[],_.times(r,function(r){setTimeout(function(){e._workerPool.push(e._genWorker())},100)}),this._workerPool=_.times(r,function(){return e._genWorker()})}return Workor.prototype.dispatchWorker=function(e,r){var t=this,o=arguments.length<=2||void 0===arguments[2]?[]:arguments[2];return new Promise(function(n,i){t._dispatchWorkerWait(e,r,o,n,i)})},Workor.prototype._dispatchWorkerWait=function(){for(var e=this,r=this._workerPool.pop(),t=arguments.length,o=Array(t),n=0;t>n;n++)o[n]=arguments[n];void 0===r?setTimeout.apply(void 0,[this._dispatchWorkerWait.bind(this),1].concat(o)):!function(){var t=o[0],n=o[1],i=o[2],s=o[3];o[4];r.transfer(""+t,n,i,function(t){e._workerPool.unshift(r),s(t)})}()},Workor.prototype._genWorker=function _genWorker(){return operative(function(funcString,arrayOfParams,callback){eval("var workerContextFunc = "+funcString);var _workerContextFunc=workerContextFunc.apply(void 0,arrayOfParams),retval=_workerContextFunc[0],transferrable=_workerContextFunc[1];callback.transfer(retval,transferrable||[])},[this._getPathToElements()+"globalScripts/globalScripts.js"])},Workor.prototype._getPathToElements=function(){return window.location.origin+"/elements/"},Workor}();