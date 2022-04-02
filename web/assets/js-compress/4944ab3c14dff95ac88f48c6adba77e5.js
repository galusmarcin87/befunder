window.yii=(function($){var pub={reloadableScripts:[],clickableSelector:'a, button, input[type="submit"], input[type="button"], input[type="reset"], '+'input[type="image"]',changeableSelector:'select, input, textarea',getCsrfParam:function(){return $('meta[name=csrf-param]').attr('content');},getCsrfToken:function(){return $('meta[name=csrf-token]').attr('content');},setCsrfToken:function(name,value){$('meta[name=csrf-param]').attr('content',name);$('meta[name=csrf-token]').attr('content',value);},refreshCsrfToken:function(){var token=pub.getCsrfToken();if(token){$('form input[name="'+pub.getCsrfParam()+'"]').val(token);}},confirm:function(message,ok,cancel){if(window.confirm(message)){!ok||ok();}else{!cancel||cancel();}},handleAction:function($e,event){var $form=$e.attr('data-form')?$('#'+$e.attr('data-form')):$e.closest('form'),method=!$e.data('method')&&$form?$form.attr('method'):$e.data('method'),action=$e.attr('href'),isValidAction=action&&action!=='#',params=$e.data('params'),areValidParams=params&&$.isPlainObject(params),pjax=$e.data('pjax'),usePjax=pjax!==undefined&&pjax!==0&&$.support.pjax,pjaxContainer,pjaxOptions={},conflictParams=['submit','reset','elements','length','name','acceptCharset','action','enctype','method','target'];$.each(conflictParams,function(index,param){if(areValidParams&&params.hasOwnProperty(param)){console.error("Parameter name '"+param+"' conflicts with a same named form property. "+"Please use another name.");}});if(usePjax){pjaxContainer=$e.data('pjax-container');if(pjaxContainer===undefined||!pjaxContainer.length){pjaxContainer=$e.closest('[data-pjax-container]').attr('id')?('#'+$e.closest('[data-pjax-container]').attr('id')):'';}
if(!pjaxContainer.length){pjaxContainer='body';}
pjaxOptions={container:pjaxContainer,push:!!$e.data('pjax-push-state'),replace:!!$e.data('pjax-replace-state'),scrollTo:$e.data('pjax-scrollto'),pushRedirect:$e.data('pjax-push-redirect'),replaceRedirect:$e.data('pjax-replace-redirect'),skipOuterContainers:$e.data('pjax-skip-outer-containers'),timeout:$e.data('pjax-timeout'),originalEvent:event,originalTarget:$e};}
if(method===undefined){if(isValidAction){usePjax?$.pjax.click(event,pjaxOptions):window.location.assign(action);}else if($e.is(':submit')&&$form.length){if(usePjax){$form.on('submit',function(e){$.pjax.submit(e,pjaxOptions);});}
$form.trigger('submit');}
return;}
var oldMethod,oldAction,newForm=!$form.length;if(!newForm){oldMethod=$form.attr('method');$form.attr('method',method);if(isValidAction){oldAction=$form.attr('action');$form.attr('action',action);}}else{if(!isValidAction){action=pub.getCurrentUrl();}
$form=$('<form/>',{method:method,action:action});var target=$e.attr('target');if(target){$form.attr('target',target);}
if(!/(get|post)/i.test(method)){$form.append($('<input/>',{name:'_method',value:method,type:'hidden'}));method='post';$form.attr('method',method);}
if(/post/i.test(method)){var csrfParam=pub.getCsrfParam();if(csrfParam){$form.append($('<input/>',{name:csrfParam,value:pub.getCsrfToken(),type:'hidden'}));}}
$form.hide().appendTo('body');}
var activeFormData=$form.data('yiiActiveForm');if(activeFormData){activeFormData.submitObject=$e;}
if(areValidParams){$.each(params,function(name,value){$form.append($('<input/>').attr({name:name,value:value,type:'hidden'}));});}
if(usePjax){$form.on('submit',function(e){$.pjax.submit(e,pjaxOptions);});}
$form.trigger('submit');$.when($form.data('yiiSubmitFinalizePromise')).done(function(){if(newForm){$form.remove();return;}
if(oldAction!==undefined){$form.attr('action',oldAction);}
$form.attr('method',oldMethod);if(areValidParams){$.each(params,function(name){$('input[name="'+name+'"]',$form).remove();});}});},getQueryParams:function(url){var pos=url.indexOf('?');if(pos<0){return{};}
var pairs=$.grep(url.substring(pos+1).split('#')[0].split('&'),function(value){return value!=='';});var params={};for(var i=0,len=pairs.length;i<len;i++){var pair=pairs[i].split('=');var name=decodeURIComponent(pair[0].replace(/\+/g,'%20'));var value=pair.length>1?decodeURIComponent(pair[1].replace(/\+/g,'%20')):'';if(!name.length){continue;}
if(params[name]===undefined){params[name]=value||'';}else{if(!$.isArray(params[name])){params[name]=[params[name]];}
params[name].push(value||'');}}
return params;},initModule:function(module){if(module.isActive!==undefined&&!module.isActive){return;}
if($.isFunction(module.init)){module.init();}
$.each(module,function(){if($.isPlainObject(this)){pub.initModule(this);}});},init:function(){initCsrfHandler();initRedirectHandler();initAssetFilters();initDataMethods();},getBaseCurrentUrl:function(){return window.location.protocol+'//'+window.location.host;},getCurrentUrl:function(){return window.location.href;}};function initCsrfHandler(){$.ajaxPrefilter(function(options,originalOptions,xhr){if(!options.crossDomain&&pub.getCsrfParam()){xhr.setRequestHeader('X-CSRF-Token',pub.getCsrfToken());}});pub.refreshCsrfToken();}
function initRedirectHandler(){$(document).ajaxComplete(function(event,xhr){var url=xhr&&xhr.getResponseHeader('X-Redirect');if(url){window.location.assign(url);}});}
function initAssetFilters(){var loadedScripts={};$('script[src]').each(function(){var url=getAbsoluteUrl(this.src);loadedScripts[url]=true;});$.ajaxPrefilter('script',function(options,originalOptions,xhr){if(options.dataType=='jsonp'){return;}
var url=getAbsoluteUrl(options.url),forbiddenRepeatedLoad=loadedScripts[url]===true&&!isReloadableAsset(url),cleanupRunning=loadedScripts[url]!==undefined&&loadedScripts[url]['xhrDone']===true;if(forbiddenRepeatedLoad||cleanupRunning){xhr.abort();return;}
if(loadedScripts[url]===undefined||loadedScripts[url]===true){loadedScripts[url]={xhrList:[],xhrDone:false};}
xhr.done(function(data,textStatus,jqXHR){if(loadedScripts[jqXHR.yiiUrl]['xhrDone']===true){return;}
loadedScripts[jqXHR.yiiUrl]['xhrDone']=true;for(var i=0,len=loadedScripts[jqXHR.yiiUrl]['xhrList'].length;i<len;i++){var singleXhr=loadedScripts[jqXHR.yiiUrl]['xhrList'][i];if(singleXhr&&singleXhr.readyState!==XMLHttpRequest.DONE){singleXhr.abort();}}
loadedScripts[jqXHR.yiiUrl]=true;}).fail(function(jqXHR,textStatus){if(textStatus==='abort'){return;}
delete loadedScripts[jqXHR.yiiUrl]['xhrList'][jqXHR.yiiIndex];var allFailed=true;for(var i=0,len=loadedScripts[jqXHR.yiiUrl]['xhrList'].length;i<len;i++){if(loadedScripts[jqXHR.yiiUrl]['xhrList'][i]){allFailed=false;}}
if(allFailed){delete loadedScripts[jqXHR.yiiUrl];}});xhr.yiiIndex=loadedScripts[url]['xhrList'].length;xhr.yiiUrl=url;loadedScripts[url]['xhrList'][xhr.yiiIndex]=xhr;});$(document).ajaxComplete(function(){var styleSheets=[];$('link[rel=stylesheet]').each(function(){var url=getAbsoluteUrl(this.href);if(isReloadableAsset(url)){return;}
$.inArray(url,styleSheets)===-1?styleSheets.push(url):$(this).remove();});});}
function initDataMethods(){var handler=function(event){var $this=$(this),method=$this.data('method'),message=$this.data('confirm'),form=$this.data('form');if(method===undefined&&message===undefined&&form===undefined){return true;}
if(message!==undefined&&message!==false&&message!==''){$.proxy(pub.confirm,this)(message,function(){pub.handleAction($this,event);});}else{pub.handleAction($this,event);}
event.stopImmediatePropagation();return false;};$(document).on('click.yii',pub.clickableSelector,handler).on('change.yii',pub.changeableSelector,handler);}
function isReloadableAsset(url){for(var i=0;i<pub.reloadableScripts.length;i++){var rule=getAbsoluteUrl(pub.reloadableScripts[i]);var match=new RegExp("^"+escapeRegExp(rule).split('\\*').join('.+')+"$").test(url);if(match===true){return true;}}
return false;}
function escapeRegExp(str){return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&");}
function getAbsoluteUrl(url){return url.charAt(0)==='/'?pub.getBaseCurrentUrl()+url:url;}
return pub;})(window.jQuery);window.jQuery(function(){window.yii.initModule(window.yii);});;;yii.validation=(function($){var pub={isEmpty:function(value){return value===null||value===undefined||($.isArray(value)&&value.length===0)||value==='';},addMessage:function(messages,message,value){messages.push(message.replace(/\{value\}/g,value));},required:function(value,messages,options){var valid=false;if(options.requiredValue===undefined){var isString=typeof value=='string'||value instanceof String;if(options.strict&&value!==undefined||!options.strict&&!pub.isEmpty(isString?$.trim(value):value)){valid=true;}}else if(!options.strict&&value==options.requiredValue||options.strict&&value===options.requiredValue){valid=true;}
if(!valid){pub.addMessage(messages,options.message,value);}},'boolean':function(value,messages,options){if(options.skipOnEmpty&&pub.isEmpty(value)){return;}
var valid=!options.strict&&(value==options.trueValue||value==options.falseValue)||options.strict&&(value===options.trueValue||value===options.falseValue);if(!valid){pub.addMessage(messages,options.message,value);}},string:function(value,messages,options){if(options.skipOnEmpty&&pub.isEmpty(value)){return;}
if(typeof value!=='string'){pub.addMessage(messages,options.message,value);return;}
if(options.is!==undefined&&value.length!=options.is){pub.addMessage(messages,options.notEqual,value);return;}
if(options.min!==undefined&&value.length<options.min){pub.addMessage(messages,options.tooShort,value);}
if(options.max!==undefined&&value.length>options.max){pub.addMessage(messages,options.tooLong,value);}},file:function(attribute,messages,options){var files=getUploadedFiles(attribute,messages,options);$.each(files,function(i,file){validateFile(file,messages,options);});},image:function(attribute,messages,options,deferredList){var files=getUploadedFiles(attribute,messages,options);$.each(files,function(i,file){validateFile(file,messages,options);if(typeof FileReader==="undefined"){return;}
var deferred=$.Deferred();pub.validateImage(file,messages,options,deferred,new FileReader(),new Image());deferredList.push(deferred);});},validateImage:function(file,messages,options,deferred,fileReader,image){image.onload=function(){validateImageSize(file,image,messages,options);deferred.resolve();};image.onerror=function(){messages.push(options.notImage.replace(/\{file\}/g,file.name));deferred.resolve();};fileReader.onload=function(){image.src=this.result;};fileReader.onerror=function(){deferred.resolve();};fileReader.readAsDataURL(file);},number:function(value,messages,options){if(options.skipOnEmpty&&pub.isEmpty(value)){return;}
if(typeof value==='string'&&!options.pattern.test(value)){pub.addMessage(messages,options.message,value);return;}
if(options.min!==undefined&&value<options.min){pub.addMessage(messages,options.tooSmall,value);}
if(options.max!==undefined&&value>options.max){pub.addMessage(messages,options.tooBig,value);}},range:function(value,messages,options){if(options.skipOnEmpty&&pub.isEmpty(value)){return;}
if(!options.allowArray&&$.isArray(value)){pub.addMessage(messages,options.message,value);return;}
var inArray=true;$.each($.isArray(value)?value:[value],function(i,v){if($.inArray(v,options.range)==-1){inArray=false;return false;}else{return true;}});if(options.not===undefined){options.not=false;}
if(options.not===inArray){pub.addMessage(messages,options.message,value);}},regularExpression:function(value,messages,options){if(options.skipOnEmpty&&pub.isEmpty(value)){return;}
if(!options.not&&!options.pattern.test(value)||options.not&&options.pattern.test(value)){pub.addMessage(messages,options.message,value);}},email:function(value,messages,options){if(options.skipOnEmpty&&pub.isEmpty(value)){return;}
var valid=true,regexp=/^((?:"?([^"]*)"?\s)?)(?:\s+)?(?:(<?)((.+)@([^>]+))(>?))$/,matches=regexp.exec(value);if(matches===null){valid=false;}else{var localPart=matches[5],domain=matches[6];if(options.enableIDN){localPart=punycode.toASCII(localPart);domain=punycode.toASCII(domain);value=matches[1]+matches[3]+localPart+'@'+domain+matches[7];}
if(localPart.length>64){valid=false;}else if((localPart+'@'+domain).length>254){valid=false;}else{valid=options.pattern.test(value)||(options.allowName&&options.fullPattern.test(value));}}
if(!valid){pub.addMessage(messages,options.message,value);}},url:function(value,messages,options){if(options.skipOnEmpty&&pub.isEmpty(value)){return;}
if(options.defaultScheme&&!/:\/\//.test(value)){value=options.defaultScheme+'://'+value;}
var valid=true;if(options.enableIDN){var matches=/^([^:]+):\/\/([^\/]+)(.*)$/.exec(value);if(matches===null){valid=false;}else{value=matches[1]+'://'+punycode.toASCII(matches[2])+matches[3];}}
if(!valid||!options.pattern.test(value)){pub.addMessage(messages,options.message,value);}},trim:function($form,attribute,options,value){var $input=$form.find(attribute.input);if($input.is(':checkbox, :radio')){return value;}
value=$input.val();if(!options.skipOnEmpty||!pub.isEmpty(value)){value=$.trim(value);$input.val(value);}
return value;},captcha:function(value,messages,options){if(options.skipOnEmpty&&pub.isEmpty(value)){return;}
var hash=$('body').data(options.hashKey);hash=hash==null?options.hash:hash[options.caseSensitive?0:1];var v=options.caseSensitive?value:value.toLowerCase();for(var i=v.length-1,h=0;i>=0;--i){h+=v.charCodeAt(i);}
if(h!=hash){pub.addMessage(messages,options.message,value);}},compare:function(value,messages,options,$form){if(options.skipOnEmpty&&pub.isEmpty(value)){return;}
var compareValue,valid=true;if(options.compareAttribute===undefined){compareValue=options.compareValue;}else{var $target=$('#'+options.compareAttribute);if(!$target.length){$target=$form.find('[name="'+options.compareAttributeName+'"]');}
compareValue=$target.val();}
if(options.type==='number'){value=value?parseFloat(value):0;compareValue=compareValue?parseFloat(compareValue):0;}
switch(options.operator){case'==':valid=value==compareValue;break;case'===':valid=value===compareValue;break;case'!=':valid=value!=compareValue;break;case'!==':valid=value!==compareValue;break;case'>':valid=value>compareValue;break;case'>=':valid=value>=compareValue;break;case'<':valid=value<compareValue;break;case'<=':valid=value<=compareValue;break;default:valid=false;break;}
if(!valid){pub.addMessage(messages,options.message,value);}},ip:function(value,messages,options){if(options.skipOnEmpty&&pub.isEmpty(value)){return;}
var negation=null,cidr=null,matches=new RegExp(options.ipParsePattern).exec(value);if(matches){negation=matches[1]||null;value=matches[2];cidr=matches[4]||null;}
if(options.subnet===true&&cidr===null){pub.addMessage(messages,options.messages.noSubnet,value);return;}
if(options.subnet===false&&cidr!==null){pub.addMessage(messages,options.messages.hasSubnet,value);return;}
if(options.negation===false&&negation!==null){pub.addMessage(messages,options.messages.message,value);return;}
var ipVersion=value.indexOf(':')===-1?4:6;if(ipVersion==6){if(!(new RegExp(options.ipv6Pattern)).test(value)){pub.addMessage(messages,options.messages.message,value);}
if(!options.ipv6){pub.addMessage(messages,options.messages.ipv6NotAllowed,value);}}else{if(!(new RegExp(options.ipv4Pattern)).test(value)){pub.addMessage(messages,options.messages.message,value);}
if(!options.ipv4){pub.addMessage(messages,options.messages.ipv4NotAllowed,value);}}}};function getUploadedFiles(attribute,messages,options){if(typeof File==="undefined"){return[];}
var fileInput=$(attribute.input,attribute.$form).get(0);if(typeof fileInput==="undefined"){return[];}
var files=fileInput.files;if(!files){messages.push(options.message);return[];}
if(files.length===0){if(!options.skipOnEmpty){messages.push(options.uploadRequired);}
return[];}
if(options.maxFiles&&options.maxFiles<files.length){messages.push(options.tooMany);return[];}
return files;}
function validateFile(file,messages,options){if(options.extensions&&options.extensions.length>0){var found=false;var filename=file.name.toLowerCase();for(var index=0;index<options.extensions.length;index++){var ext=options.extensions[index].toLowerCase();if((ext===''&&filename.indexOf('.')===-1)||(filename.substr(filename.length-options.extensions[index].length-1)===('.'+ext))){found=true;break;}}
if(!found){messages.push(options.wrongExtension.replace(/\{file\}/g,file.name));}}
if(options.mimeTypes&&options.mimeTypes.length>0){if(!validateMimeType(options.mimeTypes,file.type)){messages.push(options.wrongMimeType.replace(/\{file\}/g,file.name));}}
if(options.maxSize&&options.maxSize<file.size){messages.push(options.tooBig.replace(/\{file\}/g,file.name));}
if(options.minSize&&options.minSize>file.size){messages.push(options.tooSmall.replace(/\{file\}/g,file.name));}}
function validateMimeType(mimeTypes,fileType){for(var i=0,len=mimeTypes.length;i<len;i++){if(new RegExp(mimeTypes[i]).test(fileType)){return true;}}
return false;}
function validateImageSize(file,image,messages,options){if(options.minWidth&&image.width<options.minWidth){messages.push(options.underWidth.replace(/\{file\}/g,file.name));}
if(options.maxWidth&&image.width>options.maxWidth){messages.push(options.overWidth.replace(/\{file\}/g,file.name));}
if(options.minHeight&&image.height<options.minHeight){messages.push(options.underHeight.replace(/\{file\}/g,file.name));}
if(options.maxHeight&&image.height>options.maxHeight){messages.push(options.overHeight.replace(/\{file\}/g,file.name));}}
return pub;})(jQuery);;;
/*!
 * @copyright Copyright &copy; Kartik Visweswaran, Krajee.com, 2014 - 2020
 * @version 1.3.6
 *
 * Date formatter utility library that allows formatting date/time variables or Date objects using PHP DateTime format.
 * This library is a standalone javascript library and does not depend on other libraries or plugins like jQuery. The
 * library also adds support for Universal Module Definition (UMD).
 * 
 * @see http://php.net/manual/en/function.date.php
 *
 * For more JQuery plugins visit http://plugins.krajee.com
 * For more Yii related demos visit http://demos.krajee.com
 */!function(t,e){"function"==typeof define&&define.amd?define([],e):"object"==typeof module&&module.exports?module.exports=e():t.DateFormatter=e()}("undefined"!=typeof self?self:this,function(){var t,e;return e={DAY:864e5,HOUR:3600,defaults:{dateSettings:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],daysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],meridiem:["AM","PM"],ordinal:function(t){var e=t%10,n={1:"st",2:"nd",3:"rd"};return 1!==Math.floor(t%100/10)&&n[e]?n[e]:"th"}},separators:/[ \-+\/.:@]/g,validParts:/[dDjlNSwzWFmMntLoYyaABgGhHisueTIOPZcrU]/g,intParts:/[djwNzmnyYhHgGis]/g,tzParts:/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,tzClip:/[^-+\dA-Z]/g},getInt:function(t,e){return parseInt(t,e?e:10)},compare:function(t,e){return"string"==typeof t&&"string"==typeof e&&t.toLowerCase()===e.toLowerCase()},lpad:function(t,n,r){var a=t.toString();return r=r||"0",a.length<n?e.lpad(r+a,n):a},merge:function(t){var n,r;for(t=t||{},n=1;n<arguments.length;n++)if(r=arguments[n])for(var a in r)r.hasOwnProperty(a)&&("object"==typeof r[a]?e.merge(t[a],r[a]):t[a]=r[a]);return t},getIndex:function(t,e){for(var n=0;n<e.length;n++)if(e[n].toLowerCase()===t.toLowerCase())return n;return-1}},t=function(t){var n=this,r=e.merge(e.defaults,t);n.dateSettings=r.dateSettings,n.separators=r.separators,n.validParts=r.validParts,n.intParts=r.intParts,n.tzParts=r.tzParts,n.tzClip=r.tzClip},t.prototype={constructor:t,getMonth:function(t){var n,r=this;return n=e.getIndex(t,r.dateSettings.monthsShort)+1,0===n&&(n=e.getIndex(t,r.dateSettings.months)+1),n},parseDate:function(t,n){var r,a,u,i,o,s,c,f,l,d,g=this,h=!1,m=!1,p=g.dateSettings,y={date:null,year:null,month:null,day:null,hour:0,min:0,sec:0};if(!t)return null;if(t instanceof Date)return t;if("U"===n)return u=e.getInt(t),u?new Date(1e3*u):t;switch(typeof t){case"number":return new Date(t);case"string":break;default:return null}if(r=n.match(g.validParts),!r||0===r.length)throw new Error("Invalid date format definition.");for(u=r.length-1;u>=0;u--)"S"===r[u]&&r.splice(u,1);for(a=t.replace(g.separators,"\x00").split("\x00"),u=0;u<a.length;u++)switch(i=a[u],o=e.getInt(i),r[u]){case"y":case"Y":if(!o)return null;l=i.length,y.year=2===l?e.getInt((70>o?"20":"19")+i):o,h=!0;break;case"m":case"n":case"M":case"F":if(isNaN(o)){if(s=g.getMonth(i),!(s>0))return null;y.month=s}else{if(!(o>=1&&12>=o))return null;y.month=o}h=!0;break;case"d":case"j":if(!(o>=1&&31>=o))return null;y.day=o,h=!0;break;case"g":case"h":if(c=r.indexOf("a")>-1?r.indexOf("a"):r.indexOf("A")>-1?r.indexOf("A"):-1,d=a[c],-1!==c)f=e.compare(d,p.meridiem[0])?0:e.compare(d,p.meridiem[1])?12:-1,o>=1&&12>=o&&-1!==f?y.hour=o%12===0?f:o+f:o>=0&&23>=o&&(y.hour=o);else{if(!(o>=0&&23>=o))return null;y.hour=o}m=!0;break;case"G":case"H":if(!(o>=0&&23>=o))return null;y.hour=o,m=!0;break;case"i":if(!(o>=0&&59>=o))return null;y.min=o,m=!0;break;case"s":if(!(o>=0&&59>=o))return null;y.sec=o,m=!0}if(h===!0){var D=y.year||0,v=y.month?y.month-1:0,S=y.day||1;y.date=new Date(D,v,S,y.hour,y.min,y.sec,0)}else{if(m!==!0)return null;y.date=new Date(0,0,0,y.hour,y.min,y.sec,0)}return y.date},guessDate:function(t,n){if("string"!=typeof t)return t;var r,a,u,i,o,s,c=this,f=t.replace(c.separators,"\x00").split("\x00"),l=/^[djmn]/g,d=n.match(c.validParts),g=new Date,h=0;if(!l.test(d[0]))return t;for(u=0;u<f.length;u++){if(h=2,o=f[u],s=e.getInt(o.substr(0,2)),isNaN(s))return null;switch(u){case 0:"m"===d[0]||"n"===d[0]?g.setMonth(s-1):g.setDate(s);break;case 1:"m"===d[0]||"n"===d[0]?g.setDate(s):g.setMonth(s-1);break;case 2:if(a=g.getFullYear(),r=o.length,h=4>r?r:4,a=e.getInt(4>r?a.toString().substr(0,4-r)+o:o.substr(0,4)),!a)return null;g.setFullYear(a);break;case 3:g.setHours(s);break;case 4:g.setMinutes(s);break;case 5:g.setSeconds(s)}i=o.substr(h),i.length>0&&f.splice(u+1,0,i)}return g},parseFormat:function(t,n){var r,a=this,u=a.dateSettings,i=/\\?(.?)/gi,o=function(t,e){return r[t]?r[t]():e};return r={d:function(){return e.lpad(r.j(),2)},D:function(){return u.daysShort[r.w()]},j:function(){return n.getDate()},l:function(){return u.days[r.w()]},N:function(){return r.w()||7},w:function(){return n.getDay()},z:function(){var t=new Date(r.Y(),r.n()-1,r.j()),n=new Date(r.Y(),0,1);return Math.round((t-n)/e.DAY)},W:function(){var t=new Date(r.Y(),r.n()-1,r.j()-r.N()+3),n=new Date(t.getFullYear(),0,4);return e.lpad(1+Math.round((t-n)/e.DAY/7),2)},F:function(){return u.months[n.getMonth()]},m:function(){return e.lpad(r.n(),2)},M:function(){return u.monthsShort[n.getMonth()]},n:function(){return n.getMonth()+1},t:function(){return new Date(r.Y(),r.n(),0).getDate()},L:function(){var t=r.Y();return t%4===0&&t%100!==0||t%400===0?1:0},o:function(){var t=r.n(),e=r.W(),n=r.Y();return n+(12===t&&9>e?1:1===t&&e>9?-1:0)},Y:function(){return n.getFullYear()},y:function(){return r.Y().toString().slice(-2)},a:function(){return r.A().toLowerCase()},A:function(){var t=r.G()<12?0:1;return u.meridiem[t]},B:function(){var t=n.getUTCHours()*e.HOUR,r=60*n.getUTCMinutes(),a=n.getUTCSeconds();return e.lpad(Math.floor((t+r+a+e.HOUR)/86.4)%1e3,3)},g:function(){return r.G()%12||12},G:function(){return n.getHours()},h:function(){return e.lpad(r.g(),2)},H:function(){return e.lpad(r.G(),2)},i:function(){return e.lpad(n.getMinutes(),2)},s:function(){return e.lpad(n.getSeconds(),2)},u:function(){return e.lpad(1e3*n.getMilliseconds(),6)},e:function(){var t=/\((.*)\)/.exec(String(n))[1];return t||"Coordinated Universal Time"},I:function(){var t=new Date(r.Y(),0),e=Date.UTC(r.Y(),0),n=new Date(r.Y(),6),a=Date.UTC(r.Y(),6);return t-e!==n-a?1:0},O:function(){var t=n.getTimezoneOffset(),r=Math.abs(t);return(t>0?"-":"+")+e.lpad(100*Math.floor(r/60)+r%60,4)},P:function(){var t=r.O();return t.substr(0,3)+":"+t.substr(3,2)},T:function(){var t=(String(n).match(a.tzParts)||[""]).pop().replace(a.tzClip,"");return t||"UTC"},Z:function(){return 60*-n.getTimezoneOffset()},c:function(){return"Y-m-d\\TH:i:sP".replace(i,o)},r:function(){return"D, d M Y H:i:s O".replace(i,o)},U:function(){return n.getTime()/1e3||0}},o(t,t)},formatDate:function(t,n){var r,a,u,i,o,s=this,c="",f="\\";if("string"==typeof t&&(t=s.parseDate(t,n),!t))return null;if(t instanceof Date){for(u=n.length,r=0;u>r;r++)o=n.charAt(r),"S"!==o&&o!==f&&(r>0&&n.charAt(r-1)===f?c+=o:(i=s.parseFormat(o,t),r!==u-1&&s.intParts.test(o)&&"S"===n.charAt(r+1)&&(a=e.getInt(i)||0,i+=s.dateSettings.ordinal(a)),c+=i));return c}return""}},t});;;
/*!
 * @copyright Copyright &copy; Kartik Visweswaran, Krajee.com, 2014 - 2020
 * @version 1.9.8
 *
 * Date control validation plugin
 * 
 * Author: Kartik Visweswaran
 *
 * For more JQuery plugins visit http://plugins.krajee.com
 * For more Yii related demos visit http://demos.krajee.com
 */!function(e){"use strict";var t=".datecontrol",a=function(t,a){return null===t||void 0===t||0===t.length||a&&""===e.trim(t)},n=function(t,a){var n=this;n.$element=e(t),n.init(a),n.listen()};n.prototype={constructor:n,init:function(t){var n=this,r=a(t.dateSettings)?{}:{dateSettings:t.dateSettings};if(e.each(t,function(e,t){n[e]=t}),n.$idSave=e("#"+t.idSave),n.dateFormatter=window.DateFormatter?new window.DateFormatter(r):{},a(n.dateFormatter))throw"No DateFormatter plugin found. Ensure you have 'php-date-formatter.js' loaded.";n.isChanged=!1},raise:function(a,n){var r=this,i=e.Event(a+t),s=r.$element;void 0!==n?s.trigger(i,n):s.trigger(i)},validate:function(){var t,n=this,r=n.$element,i=n.$idSave,s=n.url,o=n.type,u=n.dispFormat,l=n.saveFormat,d=n.dispTimezone,c=n.saveTimezone,v=n.asyncRequest,g=n.dateFormatter;if(!n.isChanged)if(n.isChanged=!0,a(r.val()))i.val("").trigger("change"),n.raise("changesuccess",[r.val(),i.val()]),n.isChanged=!1;else if(a(s)){var h=g.parseDate(r.val(),u);h!==!1&&null!==h&&0!==String(h).length||(h=g.guessDate(r.val(),u),r.val(g.formatDate(h,u))),i.val(g.formatDate(h,l)).trigger("change"),n.raise("changesuccess",[r.val(),i.val()]),n.isChanged=!1}else t="en"===n.language.substring(0,2)?[]:n.dateSettings,e.ajax({url:s,type:"post",dataType:"json",async:v,data:{displayDate:r.val(),type:o,dispFormat:u,saveFormat:l,dispTimezone:d,saveTimezone:c,settings:t},beforeSend:function(e){n.raise("beforechange",[r.val(),i.val(),e])},success:function(e,t,a){var s="changeerror";"success"===e.status&&(i.val(e.output).trigger("change"),s="changesuccess"),n.raise(s,[r.val(),i.val(),e,t,a])},complete:function(){n.isChanged=!1,n.raise("changecomplete",[r.val(),i.val()])},error:function(e,t,a){n.isChanged=!1,n.raise("changeajaxerror",[r.val(),i.val(),e,t,a])}})},listen:function(){var e=this,t=e.$element;t.on("change",function(){setTimeout(function(){e.validate()},100)}).on("paste",function(){setTimeout(function(){t.val(t.val()),e.validate(),e.raise("afterpaste")},100)})}},e.fn.datecontrol=function(t){var a=Array.apply(null,arguments);return a.shift(),this.each(function(){var r=e(this),i=r.data("datecontrol"),s="object"==typeof t&&t;i||(i=new n(this,e.extend({},e.fn.datecontrol.defaults,s,e(this).data())),r.data("datecontrol",i)),"string"==typeof t&&i[t].apply(i,a)})},e.fn.datecontrol.defaults={language:"en",dateSettings:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],daysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],meridiem:["AM","PM"]},dispTimezone:null,saveTimezone:null,asyncRequest:!0},e.fn.datecontrol.Constructor=n}(window.jQuery);;;
/*!
 * @package    yii2-krajee-base
 * @subpackage yii2-widget-activeform
 * @author     Kartik Visweswaran <kartikv2@gmail.com>
 * @copyright  Copyright &copy; Kartik Visweswaran, Krajee.com, 2014 - 2021
 * @version    3.0.1
 *
 * Common script file for all kartik\widgets.
 *
 * For more JQuery/Bootstrap plugins and demos visit http://plugins.krajee.com
 * For more Yii related demos visit http://demos.krajee.com
 */ var kvInitHtml5;!function(a){"use strict";kvInitHtml5=function(b,c){var d=a(b),e=a(c);a(document).on("change",b,function(){e.val(this.value)}).on("input change",c,function(a){d.val(this.value),"change"===a.type&&d.trigger("change")})}}(window.jQuery);;;
/*!
 * Datepicker for Bootstrap v1.8.0 (https://github.com/uxsolutions/bootstrap-datepicker)
 *
 * Licensed under the Apache License v2.0 (http://www.apache.org/licenses/LICENSE-2.0)
 *
 * Modifications by Kartik Visweswaran (for Bootstrap 4.x support)
 */!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):jQuery)}(function(a,b){function c(){return new Date(Date.UTC.apply(Date,arguments))}function d(){var a=new Date;return c(a.getFullYear(),a.getMonth(),a.getDate())}function e(a,b){return a.getUTCFullYear()===b.getUTCFullYear()&&a.getUTCMonth()===b.getUTCMonth()&&a.getUTCDate()===b.getUTCDate()}function f(c,d){return function(){return d!==b&&a.fn.datepicker.deprecated(d),this[c].apply(this,arguments)}}function g(a){return a&&!isNaN(a.getTime())}function h(b,c){function d(a,b){return b.toLowerCase()}var e,f=a(b).data(),g={},h=new RegExp("^"+c.toLowerCase()+"([A-Z])");c=new RegExp("^"+c.toLowerCase());for(var i in f)c.test(i)&&(e=i.replace(h,d),g[e]=f[i]);return g}function i(b){var c={};if(q[b]||(b=b.split("-")[0],q[b])){var d=q[b];return a.each(p,function(a,b){b in d&&(c[b]=d[b])}),c}}var j=function(){var b={get:function(a){return this.slice(a)[0]},contains:function(a){for(var b=a&&a.valueOf(),c=0,d=this.length;c<d;c++)if(0<=this[c].valueOf()-b&&this[c].valueOf()-b<864e5)return c;return-1},remove:function(a){this.splice(a,1)},replace:function(b){b&&(a.isArray(b)||(b=[b]),this.clear(),this.push.apply(this,b))},clear:function(){this.length=0},copy:function(){var a=new j;return a.replace(this),a}};return function(){var c=[];return c.push.apply(c,arguments),a.extend(c,b),c}}(),k=function(b,c){a.data(b,"datepicker",this),this._process_options(c),this.dates=new j,this.viewDate=this.o.defaultViewDate,this.focusDate=null,this.element=a(b),this.isInput=this.element.is("input"),this.inputField=this.isInput?this.element:this.element.find("input"),this.component=!!this.element.hasClass("date")&&this.element.find(".add-on, .input-group-addon, .kv-date-picker, .btn"),this.component&&0===this.component.length&&(this.component=!1),this.isInline=!this.component&&this.element.is("div"),this.picker=a(r.template),this._check_template(this.o.templates.leftArrow)&&this.picker.find(".prev").html(this.o.templates.leftArrow),this._check_template(this.o.templates.rightArrow)&&this.picker.find(".next").html(this.o.templates.rightArrow),this._buildEvents(),this._attachEvents(),this.isInline?this.picker.addClass("datepicker-inline").appendTo(this.element):this.picker.addClass("datepicker-dropdown dropdown-menu"),this.o.rtl&&this.picker.addClass("datepicker-rtl"),this.o.calendarWeeks&&this.picker.find(".datepicker-days .datepicker-switch, thead .datepicker-title, tfoot .today, tfoot .clear").attr("colspan",function(a,b){return Number(b)+1}),this._process_options({startDate:this._o.startDate,endDate:this._o.endDate,daysOfWeekDisabled:this.o.daysOfWeekDisabled,daysOfWeekHighlighted:this.o.daysOfWeekHighlighted,datesDisabled:this.o.datesDisabled}),this._allow_update=!1,this.setViewMode(this.o.startView),this._allow_update=!0,this.fillDow(),this.fillMonths(),this.update(),this.isInline&&this.show()};k.prototype={constructor:k,_resolveViewName:function(b){return a.each(r.viewModes,function(c,d){if(b===c||a.inArray(b,d.names)!==-1)return b=c,!1}),b},_resolveDaysOfWeek:function(b){return a.isArray(b)||(b=b.split(/[,\s]*/)),a.map(b,Number)},_check_template:function(c){try{if(c===b||""===c)return!1;if((c.match(/[<>]/g)||[]).length<=0)return!0;var d=a(c);return d.length>0}catch(a){return!1}},_process_options:function(b){this._o=a.extend({},this._o,b);var e=this.o=a.extend({},this._o),f=e.language;q[f]||(f=f.split("-")[0],q[f]||(f=o.language)),e.language=f,e.startView=this._resolveViewName(e.startView),e.minViewMode=this._resolveViewName(e.minViewMode),e.maxViewMode=this._resolveViewName(e.maxViewMode),e.startView=Math.max(this.o.minViewMode,Math.min(this.o.maxViewMode,e.startView)),e.multidate!==!0&&(e.multidate=Number(e.multidate)||!1,e.multidate!==!1&&(e.multidate=Math.max(0,e.multidate))),e.multidateSeparator=String(e.multidateSeparator),e.weekStart%=7,e.weekEnd=(e.weekStart+6)%7;var g=r.parseFormat(e.format);e.startDate!==-(1/0)&&(e.startDate?e.startDate instanceof Date?e.startDate=this._local_to_utc(this._zero_time(e.startDate)):e.startDate=r.parseDate(e.startDate,g,e.language,e.assumeNearbyYear):e.startDate=-(1/0)),e.endDate!==1/0&&(e.endDate?e.endDate instanceof Date?e.endDate=this._local_to_utc(this._zero_time(e.endDate)):e.endDate=r.parseDate(e.endDate,g,e.language,e.assumeNearbyYear):e.endDate=1/0),e.daysOfWeekDisabled=this._resolveDaysOfWeek(e.daysOfWeekDisabled||[]),e.daysOfWeekHighlighted=this._resolveDaysOfWeek(e.daysOfWeekHighlighted||[]),e.datesDisabled=e.datesDisabled||[],a.isArray(e.datesDisabled)||(e.datesDisabled=e.datesDisabled.split(",")),e.datesDisabled=a.map(e.datesDisabled,function(a){return r.parseDate(a,g,e.language,e.assumeNearbyYear)});var h=String(e.orientation).toLowerCase().split(/\s+/g),i=e.orientation.toLowerCase();if(h=a.grep(h,function(a){return/^auto|left|right|top|bottom$/.test(a)}),e.orientation={x:"auto",y:"auto"},i&&"auto"!==i)if(1===h.length)switch(h[0]){case"top":case"bottom":e.orientation.y=h[0];break;case"left":case"right":e.orientation.x=h[0]}else i=a.grep(h,function(a){return/^left|right$/.test(a)}),e.orientation.x=i[0]||"auto",i=a.grep(h,function(a){return/^top|bottom$/.test(a)}),e.orientation.y=i[0]||"auto";else;if(e.defaultViewDate instanceof Date||"string"==typeof e.defaultViewDate)e.defaultViewDate=r.parseDate(e.defaultViewDate,g,e.language,e.assumeNearbyYear);else if(e.defaultViewDate){var j=e.defaultViewDate.year||(new Date).getFullYear(),k=e.defaultViewDate.month||0,l=e.defaultViewDate.day||1;e.defaultViewDate=c(j,k,l)}else e.defaultViewDate=d()},_events:[],_secondaryEvents:[],_applyEvents:function(a){for(var c,d,e,f=0;f<a.length;f++)c=a[f][0],2===a[f].length?(d=b,e=a[f][1]):3===a[f].length&&(d=a[f][1],e=a[f][2]),c.on(e,d)},_unapplyEvents:function(a){for(var c,d,e,f=0;f<a.length;f++)c=a[f][0],2===a[f].length?(e=b,d=a[f][1]):3===a[f].length&&(e=a[f][1],d=a[f][2]),c.off(d,e)},_buildEvents:function(){var b={keyup:a.proxy(function(b){a.inArray(b.keyCode,[27,37,39,38,40,32,13,9])===-1&&this.update()},this),keydown:a.proxy(this.keydown,this),paste:a.proxy(this.paste,this)};this.o.showOnFocus===!0&&(b.focus=a.proxy(this.show,this)),this.isInput?this._events=[[this.element,b]]:this.component&&this.inputField.length?this._events=[[this.inputField,b],[this.component,{click:a.proxy(this.show,this)}]]:this._events=[[this.element,{click:a.proxy(this.show,this),keydown:a.proxy(this.keydown,this)}]],this._events.push([this.element,"*",{blur:a.proxy(function(a){this._focused_from=a.target},this)}],[this.element,{blur:a.proxy(function(a){this._focused_from=a.target},this)}]),this.o.immediateUpdates&&this._events.push([this.element,{"changeYear changeMonth":a.proxy(function(a){this.update(a.date)},this)}]),this._secondaryEvents=[[this.picker,{click:a.proxy(this.click,this)}],[this.picker,".prev, .next",{click:a.proxy(this.navArrowsClick,this)}],[this.picker,".day:not(.disabled)",{click:a.proxy(this.dayCellClick,this)}],[a(window),{resize:a.proxy(this.place,this)}],[a(document),{"mousedown touchstart":a.proxy(function(a){this.element.is(a.target)||this.element.find(a.target).length||this.picker.is(a.target)||this.picker.find(a.target).length||this.isInline||this.hide()},this)}]]},_attachEvents:function(){this._detachEvents(),this._applyEvents(this._events)},_detachEvents:function(){this._unapplyEvents(this._events)},_attachSecondaryEvents:function(){this._detachSecondaryEvents(),this._applyEvents(this._secondaryEvents)},_detachSecondaryEvents:function(){this._unapplyEvents(this._secondaryEvents)},_trigger:function(b,c){var d=c||this.dates.get(-1),e=this._utc_to_local(d);this.element.trigger({type:b,date:e,viewMode:this.viewMode,dates:a.map(this.dates,this._utc_to_local),format:a.proxy(function(a,b){0===arguments.length?(a=this.dates.length-1,b=this.o.format):"string"==typeof a&&(b=a,a=this.dates.length-1),b=b||this.o.format;var c=this.dates.get(a);return r.formatDate(c,b,this.o.language)},this)})},show:function(){if(!(this.inputField.prop("disabled")||this.inputField.prop("readonly")&&this.o.enableOnReadonly===!1))return this.isInline||this.picker.appendTo(this.o.container),this.place(),this.picker.show(),this._attachSecondaryEvents(),this._trigger("show"),(window.navigator.msMaxTouchPoints||"ontouchstart"in document)&&this.o.disableTouchKeyboard&&a(this.element).blur(),this},hide:function(){return this.isInline||!this.picker.is(":visible")?this:(this.focusDate=null,this.picker.hide().detach(),this._detachSecondaryEvents(),this.setViewMode(this.o.startView),this.o.forceParse&&this.inputField.val()&&this.setValue(),this._trigger("hide"),this)},destroy:function(){return this.hide(),this._detachEvents(),this._detachSecondaryEvents(),this.picker.remove(),delete this.element.data().datepicker,this.isInput||delete this.element.data().date,this},paste:function(b){var c;if(b.originalEvent.clipboardData&&b.originalEvent.clipboardData.types&&a.inArray("text/plain",b.originalEvent.clipboardData.types)!==-1)c=b.originalEvent.clipboardData.getData("text/plain");else{if(!window.clipboardData)return;c=window.clipboardData.getData("Text")}this.setDate(c),this.update(),b.preventDefault()},_utc_to_local:function(a){if(!a)return a;var b=new Date(a.getTime()+6e4*a.getTimezoneOffset());return b.getTimezoneOffset()!==a.getTimezoneOffset()&&(b=new Date(a.getTime()+6e4*b.getTimezoneOffset())),b},_local_to_utc:function(a){return a&&new Date(a.getTime()-6e4*a.getTimezoneOffset())},_zero_time:function(a){return a&&new Date(a.getFullYear(),a.getMonth(),a.getDate())},_zero_utc_time:function(a){return a&&c(a.getUTCFullYear(),a.getUTCMonth(),a.getUTCDate())},getDates:function(){return a.map(this.dates,this._utc_to_local)},getUTCDates:function(){return a.map(this.dates,function(a){return new Date(a)})},getDate:function(){return this._utc_to_local(this.getUTCDate())},getUTCDate:function(){var a=this.dates.get(-1);return a!==b?new Date(a):null},clearDates:function(){this.inputField.val(""),this.update(),this._trigger("changeDate"),this.o.autoclose&&this.hide()},setDates:function(){var b=a.isArray(arguments[0])?arguments[0]:arguments;return this.update.apply(this,b),this._trigger("changeDate"),this.setValue(),this},setUTCDates:function(){var b=a.isArray(arguments[0])?arguments[0]:arguments;return this.setDates.apply(this,a.map(b,this._utc_to_local)),this},setDate:f("setDates"),setUTCDate:f("setUTCDates"),remove:f("destroy","Method `remove` is deprecated and will be removed in version 2.0. Use `destroy` instead"),setValue:function(){var a=this.getFormattedDate();return this.inputField.val(a),this},getFormattedDate:function(c){c===b&&(c=this.o.format);var d=this.o.language;return a.map(this.dates,function(a){return r.formatDate(a,c,d)}).join(this.o.multidateSeparator)},getStartDate:function(){return this.o.startDate},setStartDate:function(a){return this._process_options({startDate:a}),this.update(),this.updateNavArrows(),this},getEndDate:function(){return this.o.endDate},setEndDate:function(a){return this._process_options({endDate:a}),this.update(),this.updateNavArrows(),this},setDaysOfWeekDisabled:function(a){return this._process_options({daysOfWeekDisabled:a}),this.update(),this},setDaysOfWeekHighlighted:function(a){return this._process_options({daysOfWeekHighlighted:a}),this.update(),this},setDatesDisabled:function(a){return this._process_options({datesDisabled:a}),this.update(),this},place:function(){if(this.isInline)return this;var b=this.picker.outerWidth(),c=this.picker.outerHeight(),d=10,e=a(this.o.container),f=e.width(),g="body"===this.o.container?a(document).scrollTop():e.scrollTop(),h=e.offset(),i=[0];this.element.parents().each(function(){var b=a(this).css("z-index");"auto"!==b&&0!==Number(b)&&i.push(Number(b))});var j=Math.max.apply(Math,i)+this.o.zIndexOffset,k=this.component?this.component.parent().offset():this.element.offset(),l=this.component?this.component.outerHeight(!0):this.element.outerHeight(!1),m=this.component?this.component.outerWidth(!0):this.element.outerWidth(!1),n=k.left-h.left,o=k.top-h.top;"body"!==this.o.container&&(o+=g),this.picker.removeClass("datepicker-orient-top datepicker-orient-bottom datepicker-orient-right datepicker-orient-left"),"auto"!==this.o.orientation.x?(this.picker.addClass("datepicker-orient-"+this.o.orientation.x),"right"===this.o.orientation.x&&(n-=b-m)):k.left<0?(this.picker.addClass("datepicker-orient-left"),n-=k.left-d):n+b>f?(this.picker.addClass("datepicker-orient-right"),n+=m-b):this.o.rtl?this.picker.addClass("datepicker-orient-right"):this.picker.addClass("datepicker-orient-left");var p,q=this.o.orientation.y;if("auto"===q&&(p=-g+o-c,q=p<0?"bottom":"top"),this.picker.addClass("datepicker-orient-"+q),"top"===q?o-=c+parseInt(this.picker.css("padding-top")):o+=l,this.o.rtl){var r=f-(n+m);this.picker.css({top:o,right:r,zIndex:j})}else this.picker.css({top:o,left:n,zIndex:j});return this},_allow_update:!0,update:function(){if(!this._allow_update)return this;var b=this.dates.copy(),c=[],d=!1;return arguments.length?(a.each(arguments,a.proxy(function(a,b){b instanceof Date&&(b=this._local_to_utc(b)),c.push(b)},this)),d=!0):(c=this.isInput?this.element.val():this.element.data("date")||this.inputField.val(),c=c&&this.o.multidate?c.split(this.o.multidateSeparator):[c],delete this.element.data().date),c=a.map(c,a.proxy(function(a){return r.parseDate(a,this.o.format,this.o.language,this.o.assumeNearbyYear)},this)),c=a.grep(c,a.proxy(function(a){return!this.dateWithinRange(a)||!a},this),!0),this.dates.replace(c),this.o.updateViewDate&&(this.dates.length?this.viewDate=new Date(this.dates.get(-1)):this.viewDate<this.o.startDate?this.viewDate=new Date(this.o.startDate):this.viewDate>this.o.endDate?this.viewDate=new Date(this.o.endDate):this.viewDate=this.o.defaultViewDate),d?(this.setValue(),this.element.change()):this.dates.length&&String(b)!==String(this.dates)&&d&&(this._trigger("changeDate"),this.element.change()),!this.dates.length&&b.length&&(this._trigger("clearDate"),this.element.change()),this.fill(),this},fillDow:function(){if(this.o.showWeekDays){var b=this.o.weekStart,c="<tr>";for(this.o.calendarWeeks&&(c+='<th class="cw">&#160;</th>');b<this.o.weekStart+7;)c+='<th class="dow',a.inArray(b,this.o.daysOfWeekDisabled)!==-1&&(c+=" disabled"),c+='">'+q[this.o.language].daysMin[b++%7]+"</th>";c+="</tr>",this.picker.find(".datepicker-days thead").append(c)}},fillMonths:function(){for(var a,b=this._utc_to_local(this.viewDate),c="",d=0;d<12;d++)a=b&&b.getMonth()===d?" focused":"",c+='<span class="month'+a+'">'+q[this.o.language].monthsShort[d]+"</span>";this.picker.find(".datepicker-months td").html(c)},setRange:function(b){b&&b.length?this.range=a.map(b,function(a){return a.valueOf()}):delete this.range,this.fill()},getClassNames:function(b){var c=[],f=this.viewDate.getUTCFullYear(),g=this.viewDate.getUTCMonth(),h=d();return b.getUTCFullYear()<f||b.getUTCFullYear()===f&&b.getUTCMonth()<g?c.push("old"):(b.getUTCFullYear()>f||b.getUTCFullYear()===f&&b.getUTCMonth()>g)&&c.push("new"),this.focusDate&&b.valueOf()===this.focusDate.valueOf()&&c.push("focused"),this.o.todayHighlight&&e(b,h)&&c.push("today"),this.dates.contains(b)!==-1&&c.push("active"),this.dateWithinRange(b)||c.push("disabled"),this.dateIsDisabled(b)&&c.push("disabled","disabled-date"),a.inArray(b.getUTCDay(),this.o.daysOfWeekHighlighted)!==-1&&c.push("highlighted"),this.range&&(b>this.range[0]&&b<this.range[this.range.length-1]&&c.push("range"),a.inArray(b.valueOf(),this.range)!==-1&&c.push("selected"),b.valueOf()===this.range[0]&&c.push("range-start"),b.valueOf()===this.range[this.range.length-1]&&c.push("range-end")),c},_fill_yearsView:function(c,d,e,f,g,h,i){for(var j,k,l,m="",n=e/10,o=this.picker.find(c),p=Math.floor(f/e)*e,q=p+9*n,r=Math.floor(this.viewDate.getFullYear()/n)*n,s=a.map(this.dates,function(a){return Math.floor(a.getUTCFullYear()/n)*n}),t=p-n;t<=q+n;t+=n)j=[d],k=null,t===p-n?j.push("old"):t===q+n&&j.push("new"),a.inArray(t,s)!==-1&&j.push("active"),(t<g||t>h)&&j.push("disabled"),t===r&&j.push("focused"),i!==a.noop&&(l=i(new Date(t,0,1)),l===b?l={}:"boolean"==typeof l?l={enabled:l}:"string"==typeof l&&(l={classes:l}),l.enabled===!1&&j.push("disabled"),l.classes&&(j=j.concat(l.classes.split(/\s+/))),l.tooltip&&(k=l.tooltip)),m+='<span class="'+j.join(" ")+'"'+(k?' title="'+k+'"':"")+">"+t+"</span>";o.find(".datepicker-switch").text(p+"-"+q),o.find("td").html(m)},fill:function(){var d,e,f=new Date(this.viewDate),g=f.getUTCFullYear(),h=f.getUTCMonth(),i=this.o.startDate!==-(1/0)?this.o.startDate.getUTCFullYear():-(1/0),j=this.o.startDate!==-(1/0)?this.o.startDate.getUTCMonth():-(1/0),k=this.o.endDate!==1/0?this.o.endDate.getUTCFullYear():1/0,l=this.o.endDate!==1/0?this.o.endDate.getUTCMonth():1/0,m=q[this.o.language].today||q.en.today||"",n=q[this.o.language].clear||q.en.clear||"",o=q[this.o.language].titleFormat||q.en.titleFormat;if(!isNaN(g)&&!isNaN(h)){this.picker.find(".datepicker-days .datepicker-switch").text(r.formatDate(f,o,this.o.language)),this.picker.find("tfoot .today").text(m).css("display",this.o.todayBtn===!0||"linked"===this.o.todayBtn?"table-cell":"none"),this.picker.find("tfoot .clear").text(n).css("display",this.o.clearBtn===!0?"table-cell":"none"),this.picker.find("thead .datepicker-title").text(this.o.title).css("display","string"==typeof this.o.title&&""!==this.o.title?"table-cell":"none"),this.updateNavArrows(),this.fillMonths();var p=c(g,h,0),s=p.getUTCDate();p.setUTCDate(s-(p.getUTCDay()-this.o.weekStart+7)%7);var t=new Date(p);p.getUTCFullYear()<100&&t.setUTCFullYear(p.getUTCFullYear()),t.setUTCDate(t.getUTCDate()+42),t=t.valueOf();for(var u,v,w=[];p.valueOf()<t;){if(u=p.getUTCDay(),u===this.o.weekStart&&(w.push("<tr>"),this.o.calendarWeeks)){var x=new Date(+p+(this.o.weekStart-u-7)%7*864e5),y=new Date(Number(x)+(11-x.getUTCDay())%7*864e5),z=new Date(Number(z=c(y.getUTCFullYear(),0,1))+(11-z.getUTCDay())%7*864e5),A=(y-z)/864e5/7+1;w.push('<td class="cw">'+A+"</td>")}v=this.getClassNames(p),v.push("day");var B=p.getUTCDate();this.o.beforeShowDay!==a.noop&&(e=this.o.beforeShowDay(this._utc_to_local(p)),e===b?e={}:"boolean"==typeof e?e={enabled:e}:"string"==typeof e&&(e={classes:e}),e.enabled===!1&&v.push("disabled"),e.classes&&(v=v.concat(e.classes.split(/\s+/))),e.tooltip&&(d=e.tooltip),e.content&&(B=e.content)),v=a.isFunction(a.uniqueSort)?a.uniqueSort(v):a.unique(v),w.push('<td class="'+v.join(" ")+'"'+(d?' title="'+d+'"':"")+' data-date="'+p.getTime().toString()+'">'+B+"</td>"),d=null,u===this.o.weekEnd&&w.push("</tr>"),p.setUTCDate(p.getUTCDate()+1)}this.picker.find(".datepicker-days tbody").html(w.join(""));var C=q[this.o.language].monthsTitle||q.en.monthsTitle||"Months",D=this.picker.find(".datepicker-months").find(".datepicker-switch").text(this.o.maxViewMode<2?C:g).end().find("tbody span").removeClass("active");if(a.each(this.dates,function(a,b){b.getUTCFullYear()===g&&D.eq(b.getUTCMonth()).addClass("active")}),(g<i||g>k)&&D.addClass("disabled"),g===i&&D.slice(0,j).addClass("disabled"),g===k&&D.slice(l+1).addClass("disabled"),this.o.beforeShowMonth!==a.noop){var E=this;a.each(D,function(c,d){var e=new Date(g,c,1),f=E.o.beforeShowMonth(e);f===b?f={}:"boolean"==typeof f?f={enabled:f}:"string"==typeof f&&(f={classes:f}),f.enabled!==!1||a(d).hasClass("disabled")||a(d).addClass("disabled"),f.classes&&a(d).addClass(f.classes),f.tooltip&&a(d).prop("title",f.tooltip)})}this._fill_yearsView(".datepicker-years","year",10,g,i,k,this.o.beforeShowYear),this._fill_yearsView(".datepicker-decades","decade",100,g,i,k,this.o.beforeShowDecade),this._fill_yearsView(".datepicker-centuries","century",1e3,g,i,k,this.o.beforeShowCentury)}},updateNavArrows:function(){if(this._allow_update){var a,b,c=new Date(this.viewDate),d=c.getUTCFullYear(),e=c.getUTCMonth(),f=this.o.startDate!==-(1/0)?this.o.startDate.getUTCFullYear():-(1/0),g=this.o.startDate!==-(1/0)?this.o.startDate.getUTCMonth():-(1/0),h=this.o.endDate!==1/0?this.o.endDate.getUTCFullYear():1/0,i=this.o.endDate!==1/0?this.o.endDate.getUTCMonth():1/0,j=1;switch(this.viewMode){case 4:j*=10;case 3:j*=10;case 2:j*=10;case 1:a=Math.floor(d/j)*j<f,b=Math.floor(d/j)*j+j>h;break;case 0:a=d<=f&&e<g,b=d>=h&&e>i}this.picker.find(".prev").toggleClass("disabled",a),this.picker.find(".next").toggleClass("disabled",b)}},click:function(b){b.preventDefault(),b.stopPropagation();var e,f,g,h;e=a(b.target),e.hasClass("datepicker-switch")&&this.viewMode!==this.o.maxViewMode&&this.setViewMode(this.viewMode+1),e.hasClass("today")&&!e.hasClass("day")&&(this.setViewMode(0),this._setDate(d(),"linked"===this.o.todayBtn?null:"view")),e.hasClass("clear")&&this.clearDates(),e.hasClass("disabled")||(e.hasClass("month")||e.hasClass("year")||e.hasClass("decade")||e.hasClass("century"))&&(this.viewDate.setUTCDate(1),f=1,1===this.viewMode?(h=e.parent().find("span").index(e),g=this.viewDate.getUTCFullYear(),this.viewDate.setUTCMonth(h)):(h=0,g=Number(e.text()),this.viewDate.setUTCFullYear(g)),this._trigger(r.viewModes[this.viewMode-1].e,this.viewDate),this.viewMode===this.o.minViewMode?this._setDate(c(g,h,f)):(this.setViewMode(this.viewMode-1),this.fill())),this.picker.is(":visible")&&this._focused_from&&this._focused_from.focus(),delete this._focused_from},dayCellClick:function(b){var c=a(b.currentTarget),d=c.data("date"),e=new Date(d);this.o.updateViewDate&&(e.getUTCFullYear()!==this.viewDate.getUTCFullYear()&&this._trigger("changeYear",this.viewDate),e.getUTCMonth()!==this.viewDate.getUTCMonth()&&this._trigger("changeMonth",this.viewDate)),this._setDate(e)},navArrowsClick:function(b){var c=a(b.currentTarget),d=c.hasClass("prev")?-1:1;0!==this.viewMode&&(d*=12*r.viewModes[this.viewMode].navStep),this.viewDate=this.moveMonth(this.viewDate,d),this._trigger(r.viewModes[this.viewMode].e,this.viewDate),this.fill()},_toggle_multidate:function(a){var b=this.dates.contains(a);if(a||this.dates.clear(),b!==-1?(this.o.multidate===!0||this.o.multidate>1||this.o.toggleActive)&&this.dates.remove(b):this.o.multidate===!1?(this.dates.clear(),this.dates.push(a)):this.dates.push(a),"number"==typeof this.o.multidate)for(;this.dates.length>this.o.multidate;)this.dates.remove(0)},_setDate:function(a,b){b&&"date"!==b||this._toggle_multidate(a&&new Date(a)),(!b&&this.o.updateViewDate||"view"===b)&&(this.viewDate=a&&new Date(a)),this.fill(),this.setValue(),b&&"view"===b||this._trigger("changeDate"),this.inputField.trigger("change"),!this.o.autoclose||b&&"date"!==b||this.hide()},moveDay:function(a,b){var c=new Date(a);return c.setUTCDate(a.getUTCDate()+b),c},moveWeek:function(a,b){return this.moveDay(a,7*b)},moveMonth:function(a,b){if(!g(a))return this.o.defaultViewDate;if(!b)return a;var c,d,e=new Date(a.valueOf()),f=e.getUTCDate(),h=e.getUTCMonth(),i=Math.abs(b);if(b=b>0?1:-1,1===i)d=b===-1?function(){return e.getUTCMonth()===h}:function(){return e.getUTCMonth()!==c},c=h+b,e.setUTCMonth(c),c=(c+12)%12;else{for(var j=0;j<i;j++)e=this.moveMonth(e,b);c=e.getUTCMonth(),e.setUTCDate(f),d=function(){return c!==e.getUTCMonth()}}for(;d();)e.setUTCDate(--f),e.setUTCMonth(c);return e},moveYear:function(a,b){return this.moveMonth(a,12*b)},moveAvailableDate:function(a,b,c){do{if(a=this[c](a,b),!this.dateWithinRange(a))return!1;c="moveDay"}while(this.dateIsDisabled(a));return a},weekOfDateIsDisabled:function(b){return a.inArray(b.getUTCDay(),this.o.daysOfWeekDisabled)!==-1},dateIsDisabled:function(b){return this.weekOfDateIsDisabled(b)||a.grep(this.o.datesDisabled,function(a){return e(b,a)}).length>0},dateWithinRange:function(a){return a>=this.o.startDate&&a<=this.o.endDate},keydown:function(a){if(!this.picker.is(":visible"))return void(40!==a.keyCode&&27!==a.keyCode||(this.show(),a.stopPropagation()));var b,c,d=!1,e=this.focusDate||this.viewDate;switch(a.keyCode){case 27:this.focusDate?(this.focusDate=null,this.viewDate=this.dates.get(-1)||this.viewDate,this.fill()):this.hide(),a.preventDefault(),a.stopPropagation();break;case 37:case 38:case 39:case 40:if(!this.o.keyboardNavigation||7===this.o.daysOfWeekDisabled.length)break;b=37===a.keyCode||38===a.keyCode?-1:1,0===this.viewMode?a.ctrlKey?(c=this.moveAvailableDate(e,b,"moveYear"),c&&this._trigger("changeYear",this.viewDate)):a.shiftKey?(c=this.moveAvailableDate(e,b,"moveMonth"),c&&this._trigger("changeMonth",this.viewDate)):37===a.keyCode||39===a.keyCode?c=this.moveAvailableDate(e,b,"moveDay"):this.weekOfDateIsDisabled(e)||(c=this.moveAvailableDate(e,b,"moveWeek")):1===this.viewMode?(38!==a.keyCode&&40!==a.keyCode||(b*=4),c=this.moveAvailableDate(e,b,"moveMonth")):2===this.viewMode&&(38!==a.keyCode&&40!==a.keyCode||(b*=4),c=this.moveAvailableDate(e,b,"moveYear")),c&&(this.focusDate=this.viewDate=c,this.setValue(),this.fill(),a.preventDefault());break;case 13:if(!this.o.forceParse)break;e=this.focusDate||this.dates.get(-1)||this.viewDate,this.o.keyboardNavigation&&(this._toggle_multidate(e),d=!0),this.focusDate=null,this.viewDate=this.dates.get(-1)||this.viewDate,this.setValue(),this.fill(),this.picker.is(":visible")&&(a.preventDefault(),a.stopPropagation(),this.o.autoclose&&this.hide());break;case 9:this.focusDate=null,this.viewDate=this.dates.get(-1)||this.viewDate,this.fill(),this.hide()}d&&(this.dates.length?this._trigger("changeDate"):this._trigger("clearDate"),this.inputField.trigger("change"))},setViewMode:function(a){this.viewMode=a,this.picker.children("div").hide().filter(".datepicker-"+r.viewModes[this.viewMode].clsName).show(),this.updateNavArrows(),this._trigger("changeViewMode",new Date(this.viewDate))}};var l=function(b,c){a.data(b,"datepicker",this),this.element=a(b),this.inputs=a.map(c.inputs,function(a){return a.jquery?a[0]:a}),delete c.inputs,this.keepEmptyValues=c.keepEmptyValues,delete c.keepEmptyValues,n.call(a(this.inputs),c).on("changeDate",a.proxy(this.dateUpdated,this)),this.pickers=a.map(this.inputs,function(b){return a.data(b,"datepicker")}),this.updateDates()};l.prototype={updateDates:function(){this.dates=a.map(this.pickers,function(a){return a.getUTCDate()}),this.updateRanges()},updateRanges:function(){var b=a.map(this.dates,function(a){return a.valueOf()});a.each(this.pickers,function(a,c){c.setRange(b)})},clearDates:function(){a.each(this.pickers,function(a,b){b.clearDates()})},dateUpdated:function(c){if(!this.updating){this.updating=!0;var d=a.data(c.target,"datepicker");if(d!==b){var e=d.getUTCDate(),f=this.keepEmptyValues,g=a.inArray(c.target,this.inputs),h=g-1,i=g+1,j=this.inputs.length;if(g!==-1){if(a.each(this.pickers,function(a,b){b.getUTCDate()||b!==d&&f||b.setUTCDate(e)}),e<this.dates[h])for(;h>=0&&e<this.dates[h];)this.pickers[h--].setUTCDate(e);else if(e>this.dates[i])for(;i<j&&e>this.dates[i];)this.pickers[i++].setUTCDate(e);this.updateDates(),delete this.updating}}}},destroy:function(){a.map(this.pickers,function(a){a.destroy()}),a(this.inputs).off("changeDate",this.dateUpdated),delete this.element.data().datepicker},remove:f("destroy","Method `remove` is deprecated and will be removed in version 2.0. Use `destroy` instead")};var m=a.fn.datepicker,n=function(c){var d=Array.apply(null,arguments);d.shift();var e;if(this.each(function(){var b=a(this),f=b.data("datepicker"),g="object"==typeof c&&c;if(!f){var j=h(this,"date"),m=a.extend({},o,j,g),n=i(m.language),p=a.extend({},o,n,j,g);b.hasClass("input-daterange")||p.inputs?(a.extend(p,{inputs:p.inputs||b.find("input").toArray()}),f=new l(this,p)):f=new k(this,p),b.data("datepicker",f)}"string"==typeof c&&"function"==typeof f[c]&&(e=f[c].apply(f,d))}),e===b||e instanceof k||e instanceof l)return this;if(this.length>1)throw new Error("Using only allowed for the collection of a single element ("+c+" function)");return e};a.fn.datepicker=n;var o=a.fn.datepicker.defaults={assumeNearbyYear:!1,autoclose:!1,beforeShowDay:a.noop,beforeShowMonth:a.noop,beforeShowYear:a.noop,beforeShowDecade:a.noop,beforeShowCentury:a.noop,calendarWeeks:!1,clearBtn:!1,toggleActive:!1,daysOfWeekDisabled:[],daysOfWeekHighlighted:[],datesDisabled:[],endDate:1/0,forceParse:!0,format:"mm/dd/yyyy",keepEmptyValues:!1,keyboardNavigation:!0,language:"en",minViewMode:0,maxViewMode:4,multidate:!1,multidateSeparator:",",orientation:"auto",rtl:!1,startDate:-(1/0),startView:0,todayBtn:!1,todayHighlight:!1,updateViewDate:!0,weekStart:0,disableTouchKeyboard:!1,enableOnReadonly:!0,showOnFocus:!0,zIndexOffset:10,container:"body",immediateUpdates:!1,title:"",templates:{leftArrow:"&#x00AB;",rightArrow:"&#x00BB;"},showWeekDays:!0},p=a.fn.datepicker.locale_opts=["format","rtl","weekStart"];a.fn.datepicker.Constructor=k;var q=a.fn.datepicker.dates={en:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],daysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],daysMin:["Su","Mo","Tu","We","Th","Fr","Sa"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],today:"Today",clear:"Clear",titleFormat:"MM yyyy"}},r={viewModes:[{names:["days","month"],clsName:"days",e:"changeMonth"},{names:["months","year"],clsName:"months",e:"changeYear",navStep:1},{names:["years","decade"],clsName:"years",e:"changeDecade",navStep:10},{names:["decades","century"],clsName:"decades",e:"changeCentury",navStep:100},{names:["centuries","millennium"],clsName:"centuries",e:"changeMillennium",navStep:1e3}],validParts:/dd?|DD?|mm?|MM?|yy(?:yy)?/g,nonpunctuation:/[^ -\/:-@\u5e74\u6708\u65e5\[-`{-~\t\n\r]+/g,parseFormat:function(a){if("function"==typeof a.toValue&&"function"==typeof a.toDisplay)return a;var b=a.replace(this.validParts,"\0").split("\0"),c=a.match(this.validParts);if(!b||!b.length||!c||0===c.length)throw new Error("Invalid date format.");return{separators:b,parts:c}},parseDate:function(c,e,f,g){function h(a,b){return b===!0&&(b=10),a<100&&(a+=2e3,a>(new Date).getFullYear()+b&&(a-=100)),a}function i(){var a=this.slice(0,j[n].length),b=j[n].slice(0,a.length);return a.toLowerCase()===b.toLowerCase()}if(!c)return b;if(c instanceof Date)return c;if("string"==typeof e&&(e=r.parseFormat(e)),e.toValue)return e.toValue(c,e,f);var j,l,m,n,o,p={d:"moveDay",m:"moveMonth",w:"moveWeek",y:"moveYear"},s={yesterday:"-1d",today:"+0d",tomorrow:"+1d"};if(c in s&&(c=s[c]),/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/i.test(c)){for(j=c.match(/([\-+]\d+)([dmwy])/gi),c=new Date,n=0;n<j.length;n++)l=j[n].match(/([\-+]\d+)([dmwy])/i),m=Number(l[1]),o=p[l[2].toLowerCase()],c=k.prototype[o](c,m);return k.prototype._zero_utc_time(c)}j=c&&c.match(this.nonpunctuation)||[];var t,u,v={},w=["yyyy","yy","M","MM","m","mm","d","dd"],x={yyyy:function(a,b){return a.setUTCFullYear(g?h(b,g):b)},m:function(a,b){if(isNaN(a))return a;for(b-=1;b<0;)b+=12;for(b%=12,a.setUTCMonth(b);a.getUTCMonth()!==b;)a.setUTCDate(a.getUTCDate()-1);return a},d:function(a,b){return a.setUTCDate(b)}};x.yy=x.yyyy,x.M=x.MM=x.mm=x.m,x.dd=x.d,c=d();var y=e.parts.slice();if(j.length!==y.length&&(y=a(y).filter(function(b,c){return a.inArray(c,w)!==-1}).toArray()),j.length===y.length){var z;for(n=0,z=y.length;n<z;n++){if(t=parseInt(j[n],10),l=y[n],isNaN(t))switch(l){case"MM":u=a(q[f].months).filter(i),t=a.inArray(u[0],q[f].months)+1;break;case"M":u=a(q[f].monthsShort).filter(i),t=a.inArray(u[0],q[f].monthsShort)+1}v[l]=t}var A,B;for(n=0;n<w.length;n++)B=w[n],B in v&&!isNaN(v[B])&&(A=new Date(c),x[B](A,v[B]),isNaN(A)||(c=A))}return c},formatDate:function(b,c,d){if(!b)return"";if("string"==typeof c&&(c=r.parseFormat(c)),c.toDisplay)return c.toDisplay(b,c,d);var e={d:b.getUTCDate(),D:q[d].daysShort[b.getUTCDay()],DD:q[d].days[b.getUTCDay()],m:b.getUTCMonth()+1,M:q[d].monthsShort[b.getUTCMonth()],MM:q[d].months[b.getUTCMonth()],yy:b.getUTCFullYear().toString().substring(2),yyyy:b.getUTCFullYear()};e.dd=(e.d<10?"0":"")+e.d,e.mm=(e.m<10?"0":"")+e.m,b=[];for(var f=a.extend([],c.separators),g=0,h=c.parts.length;g<=h;g++)f.length&&b.push(f.shift()),b.push(e[c.parts[g]]);return b.join("")},headTemplate:'<thead><tr><th colspan="7" class="datepicker-title"></th></tr><tr><th class="prev">'+o.templates.leftArrow+'</th><th colspan="5" class="datepicker-switch"></th><th class="next">'+o.templates.rightArrow+"</th></tr></thead>",contTemplate:'<tbody><tr><td colspan="7"></td></tr></tbody>',footTemplate:'<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'};r.template='<div class="datepicker"><div class="datepicker-days"><table class="table-condensed">'+r.headTemplate+"<tbody></tbody>"+r.footTemplate+'</table></div><div class="datepicker-months"><table class="table-condensed">'+r.headTemplate+r.contTemplate+r.footTemplate+'</table></div><div class="datepicker-years"><table class="table-condensed">'+r.headTemplate+r.contTemplate+r.footTemplate+'</table></div><div class="datepicker-decades"><table class="table-condensed">'+r.headTemplate+r.contTemplate+r.footTemplate+'</table></div><div class="datepicker-centuries"><table class="table-condensed">'+r.headTemplate+r.contTemplate+r.footTemplate+"</table></div></div>",a.fn.datepicker.DPGlobal=r,a.fn.datepicker.noConflict=function(){return a.fn.datepicker=m,this},a.fn.datepicker.version="1.8.0",a.fn.datepicker.deprecated=function(a){var b=window.console;b&&b.warn&&b.warn("DEPRECATED: "+a)},a(document).on("focus.datepicker.data-api click.datepicker.data-api",'[data-provide="datepicker"]',function(b){var c=a(this);c.data("datepicker")||(b.preventDefault(),n.call(c,"show"))}),a(function(){n.call(a('[data-provide="datepicker-inline"]'))})});;;
/*!
 * @copyright Copyright &copy; Kartik Visweswaran, Krajee.com, 2014 - 2018
 * @package yii2-widgets
 * @subpackage yii2-widget-datepicker
 * @version 1.4.7
 *
 * Extension to bootstrap datepicker to use noconflict approach
 * so that the plugin does not conflict with other jquery plugins
 * of similar name
 *
 * Built for Yii Framework 2.0
 * Author: Kartik Visweswaran
 * For more Yii related demos visit http://demos.krajee.com
 */ var initDPRemove=function(){},initDPAddon=function(){};!function(t){"use strict";t.fn.kvDatepicker=t.fn.datepicker.noConflict(),initDPRemove=function(e,n){var i,c=t("#"+e),o=c.parent();o.find(".kv-date-remove").on("click.kvdatepicker",function(){n?o.find('input[type="text"]').each(function(){t(this).kvDatepicker("clearDates").trigger("change")}):(o.kvDatepicker("clearDates"),i=o.is("input")?o:o.find('input[type="text"]'),i.trigger("change"))})},initDPAddon=function(e){var n=t("#"+e),i=n.parent(),c=".input-group-addon:not(.kv-date-picker):not(.kv-date-remove),.input-group-text:not(.kv-date-picker):not(.kv-date-remove)";i.find(c).each(function(){var e=t(this);e.on("click.kvdatepicker",function(){i.kvDatepicker("hide")})}),i.find(".input-group-addon.kv-date-picker").on("click.kvdatepicker",function(){n.focus()})}}(window.jQuery);;;!function(a){a.fn.kvDatepicker.dates.pl={days:["Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"],daysShort:["Niedz.","Pon.","Wt.","Śr.","Czw.","Piąt.","Sob."],daysMin:["Ndz.","Pn.","Wt.","Śr.","Czw.","Pt.","Sob."],months:["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"],monthsShort:["Sty.","Lut.","Mar.","Kwi.","Maj","Cze.","Lip.","Sie.","Wrz.","Paź.","Lis.","Gru."],today:"Dzisiaj",weekStart:1,clear:"Wyczyść",format:"dd.mm.yyyy"}}(jQuery);;;
/*!
 * Bootstrap v3.4.1 (https://getbootstrap.com/)
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under the MIT license
 */
if(typeof jQuery==='undefined'){throw new Error('Bootstrap\'s JavaScript requires jQuery')}
+function($){'use strict';var version=$.fn.jquery.split(' ')[0].split('.')
if((version[0]<2&&version[1]<9)||(version[0]==1&&version[1]==9&&version[2]<1)||(version[0]>3)){throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')}}(jQuery);+function($){'use strict';function transitionEnd(){var el=document.createElement('bootstrap')
var transEndEventNames={WebkitTransition:'webkitTransitionEnd',MozTransition:'transitionend',OTransition:'oTransitionEnd otransitionend',transition:'transitionend'}
for(var name in transEndEventNames){if(el.style[name]!==undefined){return{end:transEndEventNames[name]}}}
return false}
$.fn.emulateTransitionEnd=function(duration){var called=false
var $el=this
$(this).one('bsTransitionEnd',function(){called=true})
var callback=function(){if(!called)$($el).trigger($.support.transition.end)}
setTimeout(callback,duration)
return this}
$(function(){$.support.transition=transitionEnd()
if(!$.support.transition)return
$.event.special.bsTransitionEnd={bindType:$.support.transition.end,delegateType:$.support.transition.end,handle:function(e){if($(e.target).is(this))return e.handleObj.handler.apply(this,arguments)}}})}(jQuery);+function($){'use strict';var dismiss='[data-dismiss="alert"]'
var Alert=function(el){$(el).on('click',dismiss,this.close)}
Alert.VERSION='3.4.1'
Alert.TRANSITION_DURATION=150
Alert.prototype.close=function(e){var $this=$(this)
var selector=$this.attr('data-target')
if(!selector){selector=$this.attr('href')
selector=selector&&selector.replace(/.*(?=#[^\s]*$)/,'')}
selector=selector==='#'?[]:selector
var $parent=$(document).find(selector)
if(e)e.preventDefault()
if(!$parent.length){$parent=$this.closest('.alert')}
$parent.trigger(e=$.Event('close.bs.alert'))
if(e.isDefaultPrevented())return
$parent.removeClass('in')
function removeElement(){$parent.detach().trigger('closed.bs.alert').remove()}
$.support.transition&&$parent.hasClass('fade')?$parent.one('bsTransitionEnd',removeElement).emulateTransitionEnd(Alert.TRANSITION_DURATION):removeElement()}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.alert')
if(!data)$this.data('bs.alert',(data=new Alert(this)))
if(typeof option=='string')data[option].call($this)})}
var old=$.fn.alert
$.fn.alert=Plugin
$.fn.alert.Constructor=Alert
$.fn.alert.noConflict=function(){$.fn.alert=old
return this}
$(document).on('click.bs.alert.data-api',dismiss,Alert.prototype.close)}(jQuery);+function($){'use strict';var Button=function(element,options){this.$element=$(element)
this.options=$.extend({},Button.DEFAULTS,options)
this.isLoading=false}
Button.VERSION='3.4.1'
Button.DEFAULTS={loadingText:'loading...'}
Button.prototype.setState=function(state){var d='disabled'
var $el=this.$element
var val=$el.is('input')?'val':'html'
var data=$el.data()
state+='Text'
if(data.resetText==null)$el.data('resetText',$el[val]())
setTimeout($.proxy(function(){$el[val](data[state]==null?this.options[state]:data[state])
if(state=='loadingText'){this.isLoading=true
$el.addClass(d).attr(d,d).prop(d,true)}else if(this.isLoading){this.isLoading=false
$el.removeClass(d).removeAttr(d).prop(d,false)}},this),0)}
Button.prototype.toggle=function(){var changed=true
var $parent=this.$element.closest('[data-toggle="buttons"]')
if($parent.length){var $input=this.$element.find('input')
if($input.prop('type')=='radio'){if($input.prop('checked'))changed=false
$parent.find('.active').removeClass('active')
this.$element.addClass('active')}else if($input.prop('type')=='checkbox'){if(($input.prop('checked'))!==this.$element.hasClass('active'))changed=false
this.$element.toggleClass('active')}
$input.prop('checked',this.$element.hasClass('active'))
if(changed)$input.trigger('change')}else{this.$element.attr('aria-pressed',!this.$element.hasClass('active'))
this.$element.toggleClass('active')}}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.button')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.button',(data=new Button(this,options)))
if(option=='toggle')data.toggle()
else if(option)data.setState(option)})}
var old=$.fn.button
$.fn.button=Plugin
$.fn.button.Constructor=Button
$.fn.button.noConflict=function(){$.fn.button=old
return this}
$(document).on('click.bs.button.data-api','[data-toggle^="button"]',function(e){var $btn=$(e.target).closest('.btn')
Plugin.call($btn,'toggle')
if(!($(e.target).is('input[type="radio"], input[type="checkbox"]'))){e.preventDefault()
if($btn.is('input,button'))$btn.trigger('focus')
else $btn.find('input:visible,button:visible').first().trigger('focus')}}).on('focus.bs.button.data-api blur.bs.button.data-api','[data-toggle^="button"]',function(e){$(e.target).closest('.btn').toggleClass('focus',/^focus(in)?$/.test(e.type))})}(jQuery);+function($){'use strict';var Carousel=function(element,options){this.$element=$(element)
this.$indicators=this.$element.find('.carousel-indicators')
this.options=options
this.paused=null
this.sliding=null
this.interval=null
this.$active=null
this.$items=null
this.options.keyboard&&this.$element.on('keydown.bs.carousel',$.proxy(this.keydown,this))
this.options.pause=='hover'&&!('ontouchstart'in document.documentElement)&&this.$element.on('mouseenter.bs.carousel',$.proxy(this.pause,this)).on('mouseleave.bs.carousel',$.proxy(this.cycle,this))}
Carousel.VERSION='3.4.1'
Carousel.TRANSITION_DURATION=600
Carousel.DEFAULTS={interval:5000,pause:'hover',wrap:true,keyboard:true}
Carousel.prototype.keydown=function(e){if(/input|textarea/i.test(e.target.tagName))return
switch(e.which){case 37:this.prev();break
case 39:this.next();break
default:return}
e.preventDefault()}
Carousel.prototype.cycle=function(e){e||(this.paused=false)
this.interval&&clearInterval(this.interval)
this.options.interval&&!this.paused&&(this.interval=setInterval($.proxy(this.next,this),this.options.interval))
return this}
Carousel.prototype.getItemIndex=function(item){this.$items=item.parent().children('.item')
return this.$items.index(item||this.$active)}
Carousel.prototype.getItemForDirection=function(direction,active){var activeIndex=this.getItemIndex(active)
var willWrap=(direction=='prev'&&activeIndex===0)||(direction=='next'&&activeIndex==(this.$items.length-1))
if(willWrap&&!this.options.wrap)return active
var delta=direction=='prev'?-1:1
var itemIndex=(activeIndex+delta)%this.$items.length
return this.$items.eq(itemIndex)}
Carousel.prototype.to=function(pos){var that=this
var activeIndex=this.getItemIndex(this.$active=this.$element.find('.item.active'))
if(pos>(this.$items.length-1)||pos<0)return
if(this.sliding)return this.$element.one('slid.bs.carousel',function(){that.to(pos)})
if(activeIndex==pos)return this.pause().cycle()
return this.slide(pos>activeIndex?'next':'prev',this.$items.eq(pos))}
Carousel.prototype.pause=function(e){e||(this.paused=true)
if(this.$element.find('.next, .prev').length&&$.support.transition){this.$element.trigger($.support.transition.end)
this.cycle(true)}
this.interval=clearInterval(this.interval)
return this}
Carousel.prototype.next=function(){if(this.sliding)return
return this.slide('next')}
Carousel.prototype.prev=function(){if(this.sliding)return
return this.slide('prev')}
Carousel.prototype.slide=function(type,next){var $active=this.$element.find('.item.active')
var $next=next||this.getItemForDirection(type,$active)
var isCycling=this.interval
var direction=type=='next'?'left':'right'
var that=this
if($next.hasClass('active'))return(this.sliding=false)
var relatedTarget=$next[0]
var slideEvent=$.Event('slide.bs.carousel',{relatedTarget:relatedTarget,direction:direction})
this.$element.trigger(slideEvent)
if(slideEvent.isDefaultPrevented())return
this.sliding=true
isCycling&&this.pause()
if(this.$indicators.length){this.$indicators.find('.active').removeClass('active')
var $nextIndicator=$(this.$indicators.children()[this.getItemIndex($next)])
$nextIndicator&&$nextIndicator.addClass('active')}
var slidEvent=$.Event('slid.bs.carousel',{relatedTarget:relatedTarget,direction:direction})
if($.support.transition&&this.$element.hasClass('slide')){$next.addClass(type)
if(typeof $next==='object'&&$next.length){$next[0].offsetWidth}
$active.addClass(direction)
$next.addClass(direction)
$active.one('bsTransitionEnd',function(){$next.removeClass([type,direction].join(' ')).addClass('active')
$active.removeClass(['active',direction].join(' '))
that.sliding=false
setTimeout(function(){that.$element.trigger(slidEvent)},0)}).emulateTransitionEnd(Carousel.TRANSITION_DURATION)}else{$active.removeClass('active')
$next.addClass('active')
this.sliding=false
this.$element.trigger(slidEvent)}
isCycling&&this.cycle()
return this}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.carousel')
var options=$.extend({},Carousel.DEFAULTS,$this.data(),typeof option=='object'&&option)
var action=typeof option=='string'?option:options.slide
if(!data)$this.data('bs.carousel',(data=new Carousel(this,options)))
if(typeof option=='number')data.to(option)
else if(action)data[action]()
else if(options.interval)data.pause().cycle()})}
var old=$.fn.carousel
$.fn.carousel=Plugin
$.fn.carousel.Constructor=Carousel
$.fn.carousel.noConflict=function(){$.fn.carousel=old
return this}
var clickHandler=function(e){var $this=$(this)
var href=$this.attr('href')
if(href){href=href.replace(/.*(?=#[^\s]+$)/,'')}
var target=$this.attr('data-target')||href
var $target=$(document).find(target)
if(!$target.hasClass('carousel'))return
var options=$.extend({},$target.data(),$this.data())
var slideIndex=$this.attr('data-slide-to')
if(slideIndex)options.interval=false
Plugin.call($target,options)
if(slideIndex){$target.data('bs.carousel').to(slideIndex)}
e.preventDefault()}
$(document).on('click.bs.carousel.data-api','[data-slide]',clickHandler).on('click.bs.carousel.data-api','[data-slide-to]',clickHandler)
$(window).on('load',function(){$('[data-ride="carousel"]').each(function(){var $carousel=$(this)
Plugin.call($carousel,$carousel.data())})})}(jQuery);+function($){'use strict';var Collapse=function(element,options){this.$element=$(element)
this.options=$.extend({},Collapse.DEFAULTS,options)
this.$trigger=$('[data-toggle="collapse"][href="#'+element.id+'"],'+'[data-toggle="collapse"][data-target="#'+element.id+'"]')
this.transitioning=null
if(this.options.parent){this.$parent=this.getParent()}else{this.addAriaAndCollapsedClass(this.$element,this.$trigger)}
if(this.options.toggle)this.toggle()}
Collapse.VERSION='3.4.1'
Collapse.TRANSITION_DURATION=350
Collapse.DEFAULTS={toggle:true}
Collapse.prototype.dimension=function(){var hasWidth=this.$element.hasClass('width')
return hasWidth?'width':'height'}
Collapse.prototype.show=function(){if(this.transitioning||this.$element.hasClass('in'))return
var activesData
var actives=this.$parent&&this.$parent.children('.panel').children('.in, .collapsing')
if(actives&&actives.length){activesData=actives.data('bs.collapse')
if(activesData&&activesData.transitioning)return}
var startEvent=$.Event('show.bs.collapse')
this.$element.trigger(startEvent)
if(startEvent.isDefaultPrevented())return
if(actives&&actives.length){Plugin.call(actives,'hide')
activesData||actives.data('bs.collapse',null)}
var dimension=this.dimension()
this.$element.removeClass('collapse').addClass('collapsing')[dimension](0).attr('aria-expanded',true)
this.$trigger.removeClass('collapsed').attr('aria-expanded',true)
this.transitioning=1
var complete=function(){this.$element.removeClass('collapsing').addClass('collapse in')[dimension]('')
this.transitioning=0
this.$element.trigger('shown.bs.collapse')}
if(!$.support.transition)return complete.call(this)
var scrollSize=$.camelCase(['scroll',dimension].join('-'))
this.$element.one('bsTransitionEnd',$.proxy(complete,this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])}
Collapse.prototype.hide=function(){if(this.transitioning||!this.$element.hasClass('in'))return
var startEvent=$.Event('hide.bs.collapse')
this.$element.trigger(startEvent)
if(startEvent.isDefaultPrevented())return
var dimension=this.dimension()
this.$element[dimension](this.$element[dimension]())[0].offsetHeight
this.$element.addClass('collapsing').removeClass('collapse in').attr('aria-expanded',false)
this.$trigger.addClass('collapsed').attr('aria-expanded',false)
this.transitioning=1
var complete=function(){this.transitioning=0
this.$element.removeClass('collapsing').addClass('collapse').trigger('hidden.bs.collapse')}
if(!$.support.transition)return complete.call(this)
this.$element
[dimension](0).one('bsTransitionEnd',$.proxy(complete,this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)}
Collapse.prototype.toggle=function(){this[this.$element.hasClass('in')?'hide':'show']()}
Collapse.prototype.getParent=function(){return $(document).find(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each($.proxy(function(i,element){var $element=$(element)
this.addAriaAndCollapsedClass(getTargetFromTrigger($element),$element)},this)).end()}
Collapse.prototype.addAriaAndCollapsedClass=function($element,$trigger){var isOpen=$element.hasClass('in')
$element.attr('aria-expanded',isOpen)
$trigger.toggleClass('collapsed',!isOpen).attr('aria-expanded',isOpen)}
function getTargetFromTrigger($trigger){var href
var target=$trigger.attr('data-target')||(href=$trigger.attr('href'))&&href.replace(/.*(?=#[^\s]+$)/,'')
return $(document).find(target)}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.collapse')
var options=$.extend({},Collapse.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data&&options.toggle&&/show|hide/.test(option))options.toggle=false
if(!data)$this.data('bs.collapse',(data=new Collapse(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.collapse
$.fn.collapse=Plugin
$.fn.collapse.Constructor=Collapse
$.fn.collapse.noConflict=function(){$.fn.collapse=old
return this}
$(document).on('click.bs.collapse.data-api','[data-toggle="collapse"]',function(e){var $this=$(this)
if(!$this.attr('data-target'))e.preventDefault()
var $target=getTargetFromTrigger($this)
var data=$target.data('bs.collapse')
var option=data?'toggle':$this.data()
Plugin.call($target,option)})}(jQuery);+function($){'use strict';var backdrop='.dropdown-backdrop'
var toggle='[data-toggle="dropdown"]'
var Dropdown=function(element){$(element).on('click.bs.dropdown',this.toggle)}
Dropdown.VERSION='3.4.1'
function getParent($this){var selector=$this.attr('data-target')
if(!selector){selector=$this.attr('href')
selector=selector&&/#[A-Za-z]/.test(selector)&&selector.replace(/.*(?=#[^\s]*$)/,'')}
var $parent=selector!=='#'?$(document).find(selector):null
return $parent&&$parent.length?$parent:$this.parent()}
function clearMenus(e){if(e&&e.which===3)return
$(backdrop).remove()
$(toggle).each(function(){var $this=$(this)
var $parent=getParent($this)
var relatedTarget={relatedTarget:this}
if(!$parent.hasClass('open'))return
if(e&&e.type=='click'&&/input|textarea/i.test(e.target.tagName)&&$.contains($parent[0],e.target))return
$parent.trigger(e=$.Event('hide.bs.dropdown',relatedTarget))
if(e.isDefaultPrevented())return
$this.attr('aria-expanded','false')
$parent.removeClass('open').trigger($.Event('hidden.bs.dropdown',relatedTarget))})}
Dropdown.prototype.toggle=function(e){var $this=$(this)
if($this.is('.disabled, :disabled'))return
var $parent=getParent($this)
var isActive=$parent.hasClass('open')
clearMenus()
if(!isActive){if('ontouchstart'in document.documentElement&&!$parent.closest('.navbar-nav').length){$(document.createElement('div')).addClass('dropdown-backdrop').insertAfter($(this)).on('click',clearMenus)}
var relatedTarget={relatedTarget:this}
$parent.trigger(e=$.Event('show.bs.dropdown',relatedTarget))
if(e.isDefaultPrevented())return
$this.trigger('focus').attr('aria-expanded','true')
$parent.toggleClass('open').trigger($.Event('shown.bs.dropdown',relatedTarget))}
return false}
Dropdown.prototype.keydown=function(e){if(!/(38|40|27|32)/.test(e.which)||/input|textarea/i.test(e.target.tagName))return
var $this=$(this)
e.preventDefault()
e.stopPropagation()
if($this.is('.disabled, :disabled'))return
var $parent=getParent($this)
var isActive=$parent.hasClass('open')
if(!isActive&&e.which!=27||isActive&&e.which==27){if(e.which==27)$parent.find(toggle).trigger('focus')
return $this.trigger('click')}
var desc=' li:not(.disabled):visible a'
var $items=$parent.find('.dropdown-menu'+desc)
if(!$items.length)return
var index=$items.index(e.target)
if(e.which==38&&index>0)index--
if(e.which==40&&index<$items.length-1)index++
if(!~index)index=0
$items.eq(index).trigger('focus')}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.dropdown')
if(!data)$this.data('bs.dropdown',(data=new Dropdown(this)))
if(typeof option=='string')data[option].call($this)})}
var old=$.fn.dropdown
$.fn.dropdown=Plugin
$.fn.dropdown.Constructor=Dropdown
$.fn.dropdown.noConflict=function(){$.fn.dropdown=old
return this}
$(document).on('click.bs.dropdown.data-api',clearMenus).on('click.bs.dropdown.data-api','.dropdown form',function(e){e.stopPropagation()}).on('click.bs.dropdown.data-api',toggle,Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api',toggle,Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api','.dropdown-menu',Dropdown.prototype.keydown)}(jQuery);+function($){'use strict';var Modal=function(element,options){this.options=options
this.$body=$(document.body)
this.$element=$(element)
this.$dialog=this.$element.find('.modal-dialog')
this.$backdrop=null
this.isShown=null
this.originalBodyPad=null
this.scrollbarWidth=0
this.ignoreBackdropClick=false
this.fixedContent='.navbar-fixed-top, .navbar-fixed-bottom'
if(this.options.remote){this.$element.find('.modal-content').load(this.options.remote,$.proxy(function(){this.$element.trigger('loaded.bs.modal')},this))}}
Modal.VERSION='3.4.1'
Modal.TRANSITION_DURATION=300
Modal.BACKDROP_TRANSITION_DURATION=150
Modal.DEFAULTS={backdrop:true,keyboard:true,show:true}
Modal.prototype.toggle=function(_relatedTarget){return this.isShown?this.hide():this.show(_relatedTarget)}
Modal.prototype.show=function(_relatedTarget){var that=this
var e=$.Event('show.bs.modal',{relatedTarget:_relatedTarget})
this.$element.trigger(e)
if(this.isShown||e.isDefaultPrevented())return
this.isShown=true
this.checkScrollbar()
this.setScrollbar()
this.$body.addClass('modal-open')
this.escape()
this.resize()
this.$element.on('click.dismiss.bs.modal','[data-dismiss="modal"]',$.proxy(this.hide,this))
this.$dialog.on('mousedown.dismiss.bs.modal',function(){that.$element.one('mouseup.dismiss.bs.modal',function(e){if($(e.target).is(that.$element))that.ignoreBackdropClick=true})})
this.backdrop(function(){var transition=$.support.transition&&that.$element.hasClass('fade')
if(!that.$element.parent().length){that.$element.appendTo(that.$body)}
that.$element.show().scrollTop(0)
that.adjustDialog()
if(transition){that.$element[0].offsetWidth}
that.$element.addClass('in')
that.enforceFocus()
var e=$.Event('shown.bs.modal',{relatedTarget:_relatedTarget})
transition?that.$dialog.one('bsTransitionEnd',function(){that.$element.trigger('focus').trigger(e)}).emulateTransitionEnd(Modal.TRANSITION_DURATION):that.$element.trigger('focus').trigger(e)})}
Modal.prototype.hide=function(e){if(e)e.preventDefault()
e=$.Event('hide.bs.modal')
this.$element.trigger(e)
if(!this.isShown||e.isDefaultPrevented())return
this.isShown=false
this.escape()
this.resize()
$(document).off('focusin.bs.modal')
this.$element.removeClass('in').off('click.dismiss.bs.modal').off('mouseup.dismiss.bs.modal')
this.$dialog.off('mousedown.dismiss.bs.modal')
$.support.transition&&this.$element.hasClass('fade')?this.$element.one('bsTransitionEnd',$.proxy(this.hideModal,this)).emulateTransitionEnd(Modal.TRANSITION_DURATION):this.hideModal()}
Modal.prototype.enforceFocus=function(){$(document).off('focusin.bs.modal').on('focusin.bs.modal',$.proxy(function(e){if(document!==e.target&&this.$element[0]!==e.target&&!this.$element.has(e.target).length){this.$element.trigger('focus')}},this))}
Modal.prototype.escape=function(){if(this.isShown&&this.options.keyboard){this.$element.on('keydown.dismiss.bs.modal',$.proxy(function(e){e.which==27&&this.hide()},this))}else if(!this.isShown){this.$element.off('keydown.dismiss.bs.modal')}}
Modal.prototype.resize=function(){if(this.isShown){$(window).on('resize.bs.modal',$.proxy(this.handleUpdate,this))}else{$(window).off('resize.bs.modal')}}
Modal.prototype.hideModal=function(){var that=this
this.$element.hide()
this.backdrop(function(){that.$body.removeClass('modal-open')
that.resetAdjustments()
that.resetScrollbar()
that.$element.trigger('hidden.bs.modal')})}
Modal.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove()
this.$backdrop=null}
Modal.prototype.backdrop=function(callback){var that=this
var animate=this.$element.hasClass('fade')?'fade':''
if(this.isShown&&this.options.backdrop){var doAnimate=$.support.transition&&animate
this.$backdrop=$(document.createElement('div')).addClass('modal-backdrop '+animate).appendTo(this.$body)
this.$element.on('click.dismiss.bs.modal',$.proxy(function(e){if(this.ignoreBackdropClick){this.ignoreBackdropClick=false
return}
if(e.target!==e.currentTarget)return
this.options.backdrop=='static'?this.$element[0].focus():this.hide()},this))
if(doAnimate)this.$backdrop[0].offsetWidth
this.$backdrop.addClass('in')
if(!callback)return
doAnimate?this.$backdrop.one('bsTransitionEnd',callback).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION):callback()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass('in')
var callbackRemove=function(){that.removeBackdrop()
callback&&callback()}
$.support.transition&&this.$element.hasClass('fade')?this.$backdrop.one('bsTransitionEnd',callbackRemove).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION):callbackRemove()}else if(callback){callback()}}
Modal.prototype.handleUpdate=function(){this.adjustDialog()}
Modal.prototype.adjustDialog=function(){var modalIsOverflowing=this.$element[0].scrollHeight>document.documentElement.clientHeight
this.$element.css({paddingLeft:!this.bodyIsOverflowing&&modalIsOverflowing?this.scrollbarWidth:'',paddingRight:this.bodyIsOverflowing&&!modalIsOverflowing?this.scrollbarWidth:''})}
Modal.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:'',paddingRight:''})}
Modal.prototype.checkScrollbar=function(){var fullWindowWidth=window.innerWidth
if(!fullWindowWidth){var documentElementRect=document.documentElement.getBoundingClientRect()
fullWindowWidth=documentElementRect.right-Math.abs(documentElementRect.left)}
this.bodyIsOverflowing=document.body.clientWidth<fullWindowWidth
this.scrollbarWidth=this.measureScrollbar()}
Modal.prototype.setScrollbar=function(){var bodyPad=parseInt((this.$body.css('padding-right')||0),10)
this.originalBodyPad=document.body.style.paddingRight||''
var scrollbarWidth=this.scrollbarWidth
if(this.bodyIsOverflowing){this.$body.css('padding-right',bodyPad+scrollbarWidth)
$(this.fixedContent).each(function(index,element){var actualPadding=element.style.paddingRight
var calculatedPadding=$(element).css('padding-right')
$(element).data('padding-right',actualPadding).css('padding-right',parseFloat(calculatedPadding)+scrollbarWidth+'px')})}}
Modal.prototype.resetScrollbar=function(){this.$body.css('padding-right',this.originalBodyPad)
$(this.fixedContent).each(function(index,element){var padding=$(element).data('padding-right')
$(element).removeData('padding-right')
element.style.paddingRight=padding?padding:''})}
Modal.prototype.measureScrollbar=function(){var scrollDiv=document.createElement('div')
scrollDiv.className='modal-scrollbar-measure'
this.$body.append(scrollDiv)
var scrollbarWidth=scrollDiv.offsetWidth-scrollDiv.clientWidth
this.$body[0].removeChild(scrollDiv)
return scrollbarWidth}
function Plugin(option,_relatedTarget){return this.each(function(){var $this=$(this)
var data=$this.data('bs.modal')
var options=$.extend({},Modal.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('bs.modal',(data=new Modal(this,options)))
if(typeof option=='string')data[option](_relatedTarget)
else if(options.show)data.show(_relatedTarget)})}
var old=$.fn.modal
$.fn.modal=Plugin
$.fn.modal.Constructor=Modal
$.fn.modal.noConflict=function(){$.fn.modal=old
return this}
$(document).on('click.bs.modal.data-api','[data-toggle="modal"]',function(e){var $this=$(this)
var href=$this.attr('href')
var target=$this.attr('data-target')||(href&&href.replace(/.*(?=#[^\s]+$)/,''))
var $target=$(document).find(target)
var option=$target.data('bs.modal')?'toggle':$.extend({remote:!/#/.test(href)&&href},$target.data(),$this.data())
if($this.is('a'))e.preventDefault()
$target.one('show.bs.modal',function(showEvent){if(showEvent.isDefaultPrevented())return
$target.one('hidden.bs.modal',function(){$this.is(':visible')&&$this.trigger('focus')})})
Plugin.call($target,option,this)})}(jQuery);+function($){'use strict';var DISALLOWED_ATTRIBUTES=['sanitize','whiteList','sanitizeFn']
var uriAttrs=['background','cite','href','itemtype','longdesc','poster','src','xlink:href']
var ARIA_ATTRIBUTE_PATTERN=/^aria-[\w-]*$/i
var DefaultWhitelist={'*':['class','dir','id','lang','role',ARIA_ATTRIBUTE_PATTERN],a:['target','href','title','rel'],area:[],b:[],br:[],col:[],code:[],div:[],em:[],hr:[],h1:[],h2:[],h3:[],h4:[],h5:[],h6:[],i:[],img:['src','alt','title','width','height'],li:[],ol:[],p:[],pre:[],s:[],small:[],span:[],sub:[],sup:[],strong:[],u:[],ul:[]}
var SAFE_URL_PATTERN=/^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi
var DATA_URL_PATTERN=/^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i
function allowedAttribute(attr,allowedAttributeList){var attrName=attr.nodeName.toLowerCase()
if($.inArray(attrName,allowedAttributeList)!==-1){if($.inArray(attrName,uriAttrs)!==-1){return Boolean(attr.nodeValue.match(SAFE_URL_PATTERN)||attr.nodeValue.match(DATA_URL_PATTERN))}
return true}
var regExp=$(allowedAttributeList).filter(function(index,value){return value instanceof RegExp})
for(var i=0,l=regExp.length;i<l;i++){if(attrName.match(regExp[i])){return true}}
return false}
function sanitizeHtml(unsafeHtml,whiteList,sanitizeFn){if(unsafeHtml.length===0){return unsafeHtml}
if(sanitizeFn&&typeof sanitizeFn==='function'){return sanitizeFn(unsafeHtml)}
if(!document.implementation||!document.implementation.createHTMLDocument){return unsafeHtml}
var createdDocument=document.implementation.createHTMLDocument('sanitization')
createdDocument.body.innerHTML=unsafeHtml
var whitelistKeys=$.map(whiteList,function(el,i){return i})
var elements=$(createdDocument.body).find('*')
for(var i=0,len=elements.length;i<len;i++){var el=elements[i]
var elName=el.nodeName.toLowerCase()
if($.inArray(elName,whitelistKeys)===-1){el.parentNode.removeChild(el)
continue}
var attributeList=$.map(el.attributes,function(el){return el})
var whitelistedAttributes=[].concat(whiteList['*']||[],whiteList[elName]||[])
for(var j=0,len2=attributeList.length;j<len2;j++){if(!allowedAttribute(attributeList[j],whitelistedAttributes)){el.removeAttribute(attributeList[j].nodeName)}}}
return createdDocument.body.innerHTML}
var Tooltip=function(element,options){this.type=null
this.options=null
this.enabled=null
this.timeout=null
this.hoverState=null
this.$element=null
this.inState=null
this.init('tooltip',element,options)}
Tooltip.VERSION='3.4.1'
Tooltip.TRANSITION_DURATION=150
Tooltip.DEFAULTS={animation:true,placement:'top',selector:false,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:'hover focus',title:'',delay:0,html:false,container:false,viewport:{selector:'body',padding:0},sanitize:true,sanitizeFn:null,whiteList:DefaultWhitelist}
Tooltip.prototype.init=function(type,element,options){this.enabled=true
this.type=type
this.$element=$(element)
this.options=this.getOptions(options)
this.$viewport=this.options.viewport&&$(document).find($.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):(this.options.viewport.selector||this.options.viewport))
this.inState={click:false,hover:false,focus:false}
if(this.$element[0]instanceof document.constructor&&!this.options.selector){throw new Error('`selector` option must be specified when initializing '+this.type+' on the window.document object!')}
var triggers=this.options.trigger.split(' ')
for(var i=triggers.length;i--;){var trigger=triggers[i]
if(trigger=='click'){this.$element.on('click.'+this.type,this.options.selector,$.proxy(this.toggle,this))}else if(trigger!='manual'){var eventIn=trigger=='hover'?'mouseenter':'focusin'
var eventOut=trigger=='hover'?'mouseleave':'focusout'
this.$element.on(eventIn+'.'+this.type,this.options.selector,$.proxy(this.enter,this))
this.$element.on(eventOut+'.'+this.type,this.options.selector,$.proxy(this.leave,this))}}
this.options.selector?(this._options=$.extend({},this.options,{trigger:'manual',selector:''})):this.fixTitle()}
Tooltip.prototype.getDefaults=function(){return Tooltip.DEFAULTS}
Tooltip.prototype.getOptions=function(options){var dataAttributes=this.$element.data()
for(var dataAttr in dataAttributes){if(dataAttributes.hasOwnProperty(dataAttr)&&$.inArray(dataAttr,DISALLOWED_ATTRIBUTES)!==-1){delete dataAttributes[dataAttr]}}
options=$.extend({},this.getDefaults(),dataAttributes,options)
if(options.delay&&typeof options.delay=='number'){options.delay={show:options.delay,hide:options.delay}}
if(options.sanitize){options.template=sanitizeHtml(options.template,options.whiteList,options.sanitizeFn)}
return options}
Tooltip.prototype.getDelegateOptions=function(){var options={}
var defaults=this.getDefaults()
this._options&&$.each(this._options,function(key,value){if(defaults[key]!=value)options[key]=value})
return options}
Tooltip.prototype.enter=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget).data('bs.'+this.type)
if(!self){self=new this.constructor(obj.currentTarget,this.getDelegateOptions())
$(obj.currentTarget).data('bs.'+this.type,self)}
if(obj instanceof $.Event){self.inState[obj.type=='focusin'?'focus':'hover']=true}
if(self.tip().hasClass('in')||self.hoverState=='in'){self.hoverState='in'
return}
clearTimeout(self.timeout)
self.hoverState='in'
if(!self.options.delay||!self.options.delay.show)return self.show()
self.timeout=setTimeout(function(){if(self.hoverState=='in')self.show()},self.options.delay.show)}
Tooltip.prototype.isInStateTrue=function(){for(var key in this.inState){if(this.inState[key])return true}
return false}
Tooltip.prototype.leave=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget).data('bs.'+this.type)
if(!self){self=new this.constructor(obj.currentTarget,this.getDelegateOptions())
$(obj.currentTarget).data('bs.'+this.type,self)}
if(obj instanceof $.Event){self.inState[obj.type=='focusout'?'focus':'hover']=false}
if(self.isInStateTrue())return
clearTimeout(self.timeout)
self.hoverState='out'
if(!self.options.delay||!self.options.delay.hide)return self.hide()
self.timeout=setTimeout(function(){if(self.hoverState=='out')self.hide()},self.options.delay.hide)}
Tooltip.prototype.show=function(){var e=$.Event('show.bs.'+this.type)
if(this.hasContent()&&this.enabled){this.$element.trigger(e)
var inDom=$.contains(this.$element[0].ownerDocument.documentElement,this.$element[0])
if(e.isDefaultPrevented()||!inDom)return
var that=this
var $tip=this.tip()
var tipId=this.getUID(this.type)
this.setContent()
$tip.attr('id',tipId)
this.$element.attr('aria-describedby',tipId)
if(this.options.animation)$tip.addClass('fade')
var placement=typeof this.options.placement=='function'?this.options.placement.call(this,$tip[0],this.$element[0]):this.options.placement
var autoToken=/\s?auto?\s?/i
var autoPlace=autoToken.test(placement)
if(autoPlace)placement=placement.replace(autoToken,'')||'top'
$tip.detach().css({top:0,left:0,display:'block'}).addClass(placement).data('bs.'+this.type,this)
this.options.container?$tip.appendTo($(document).find(this.options.container)):$tip.insertAfter(this.$element)
this.$element.trigger('inserted.bs.'+this.type)
var pos=this.getPosition()
var actualWidth=$tip[0].offsetWidth
var actualHeight=$tip[0].offsetHeight
if(autoPlace){var orgPlacement=placement
var viewportDim=this.getPosition(this.$viewport)
placement=placement=='bottom'&&pos.bottom+actualHeight>viewportDim.bottom?'top':placement=='top'&&pos.top-actualHeight<viewportDim.top?'bottom':placement=='right'&&pos.right+actualWidth>viewportDim.width?'left':placement=='left'&&pos.left-actualWidth<viewportDim.left?'right':placement
$tip.removeClass(orgPlacement).addClass(placement)}
var calculatedOffset=this.getCalculatedOffset(placement,pos,actualWidth,actualHeight)
this.applyPlacement(calculatedOffset,placement)
var complete=function(){var prevHoverState=that.hoverState
that.$element.trigger('shown.bs.'+that.type)
that.hoverState=null
if(prevHoverState=='out')that.leave(that)}
$.support.transition&&this.$tip.hasClass('fade')?$tip.one('bsTransitionEnd',complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION):complete()}}
Tooltip.prototype.applyPlacement=function(offset,placement){var $tip=this.tip()
var width=$tip[0].offsetWidth
var height=$tip[0].offsetHeight
var marginTop=parseInt($tip.css('margin-top'),10)
var marginLeft=parseInt($tip.css('margin-left'),10)
if(isNaN(marginTop))marginTop=0
if(isNaN(marginLeft))marginLeft=0
offset.top+=marginTop
offset.left+=marginLeft
$.offset.setOffset($tip[0],$.extend({using:function(props){$tip.css({top:Math.round(props.top),left:Math.round(props.left)})}},offset),0)
$tip.addClass('in')
var actualWidth=$tip[0].offsetWidth
var actualHeight=$tip[0].offsetHeight
if(placement=='top'&&actualHeight!=height){offset.top=offset.top+height-actualHeight}
var delta=this.getViewportAdjustedDelta(placement,offset,actualWidth,actualHeight)
if(delta.left)offset.left+=delta.left
else offset.top+=delta.top
var isVertical=/top|bottom/.test(placement)
var arrowDelta=isVertical?delta.left*2-width+actualWidth:delta.top*2-height+actualHeight
var arrowOffsetPosition=isVertical?'offsetWidth':'offsetHeight'
$tip.offset(offset)
this.replaceArrow(arrowDelta,$tip[0][arrowOffsetPosition],isVertical)}
Tooltip.prototype.replaceArrow=function(delta,dimension,isVertical){this.arrow().css(isVertical?'left':'top',50*(1-delta / dimension)+'%').css(isVertical?'top':'left','')}
Tooltip.prototype.setContent=function(){var $tip=this.tip()
var title=this.getTitle()
if(this.options.html){if(this.options.sanitize){title=sanitizeHtml(title,this.options.whiteList,this.options.sanitizeFn)}
$tip.find('.tooltip-inner').html(title)}else{$tip.find('.tooltip-inner').text(title)}
$tip.removeClass('fade in top bottom left right')}
Tooltip.prototype.hide=function(callback){var that=this
var $tip=$(this.$tip)
var e=$.Event('hide.bs.'+this.type)
function complete(){if(that.hoverState!='in')$tip.detach()
if(that.$element){that.$element.removeAttr('aria-describedby').trigger('hidden.bs.'+that.type)}
callback&&callback()}
this.$element.trigger(e)
if(e.isDefaultPrevented())return
$tip.removeClass('in')
$.support.transition&&$tip.hasClass('fade')?$tip.one('bsTransitionEnd',complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION):complete()
this.hoverState=null
return this}
Tooltip.prototype.fixTitle=function(){var $e=this.$element
if($e.attr('title')||typeof $e.attr('data-original-title')!='string'){$e.attr('data-original-title',$e.attr('title')||'').attr('title','')}}
Tooltip.prototype.hasContent=function(){return this.getTitle()}
Tooltip.prototype.getPosition=function($element){$element=$element||this.$element
var el=$element[0]
var isBody=el.tagName=='BODY'
var elRect=el.getBoundingClientRect()
if(elRect.width==null){elRect=$.extend({},elRect,{width:elRect.right-elRect.left,height:elRect.bottom-elRect.top})}
var isSvg=window.SVGElement&&el instanceof window.SVGElement
var elOffset=isBody?{top:0,left:0}:(isSvg?null:$element.offset())
var scroll={scroll:isBody?document.documentElement.scrollTop||document.body.scrollTop:$element.scrollTop()}
var outerDims=isBody?{width:$(window).width(),height:$(window).height()}:null
return $.extend({},elRect,scroll,outerDims,elOffset)}
Tooltip.prototype.getCalculatedOffset=function(placement,pos,actualWidth,actualHeight){return placement=='bottom'?{top:pos.top+pos.height,left:pos.left+pos.width / 2-actualWidth / 2}:placement=='top'?{top:pos.top-actualHeight,left:pos.left+pos.width / 2-actualWidth / 2}:placement=='left'?{top:pos.top+pos.height / 2-actualHeight / 2,left:pos.left-actualWidth}:{top:pos.top+pos.height / 2-actualHeight / 2,left:pos.left+pos.width}}
Tooltip.prototype.getViewportAdjustedDelta=function(placement,pos,actualWidth,actualHeight){var delta={top:0,left:0}
if(!this.$viewport)return delta
var viewportPadding=this.options.viewport&&this.options.viewport.padding||0
var viewportDimensions=this.getPosition(this.$viewport)
if(/right|left/.test(placement)){var topEdgeOffset=pos.top-viewportPadding-viewportDimensions.scroll
var bottomEdgeOffset=pos.top+viewportPadding-viewportDimensions.scroll+actualHeight
if(topEdgeOffset<viewportDimensions.top){delta.top=viewportDimensions.top-topEdgeOffset}else if(bottomEdgeOffset>viewportDimensions.top+viewportDimensions.height){delta.top=viewportDimensions.top+viewportDimensions.height-bottomEdgeOffset}}else{var leftEdgeOffset=pos.left-viewportPadding
var rightEdgeOffset=pos.left+viewportPadding+actualWidth
if(leftEdgeOffset<viewportDimensions.left){delta.left=viewportDimensions.left-leftEdgeOffset}else if(rightEdgeOffset>viewportDimensions.right){delta.left=viewportDimensions.left+viewportDimensions.width-rightEdgeOffset}}
return delta}
Tooltip.prototype.getTitle=function(){var title
var $e=this.$element
var o=this.options
title=$e.attr('data-original-title')||(typeof o.title=='function'?o.title.call($e[0]):o.title)
return title}
Tooltip.prototype.getUID=function(prefix){do prefix+=~~(Math.random()*1000000)
while(document.getElementById(prefix))
return prefix}
Tooltip.prototype.tip=function(){if(!this.$tip){this.$tip=$(this.options.template)
if(this.$tip.length!=1){throw new Error(this.type+' `template` option must consist of exactly 1 top-level element!')}}
return this.$tip}
Tooltip.prototype.arrow=function(){return(this.$arrow=this.$arrow||this.tip().find('.tooltip-arrow'))}
Tooltip.prototype.enable=function(){this.enabled=true}
Tooltip.prototype.disable=function(){this.enabled=false}
Tooltip.prototype.toggleEnabled=function(){this.enabled=!this.enabled}
Tooltip.prototype.toggle=function(e){var self=this
if(e){self=$(e.currentTarget).data('bs.'+this.type)
if(!self){self=new this.constructor(e.currentTarget,this.getDelegateOptions())
$(e.currentTarget).data('bs.'+this.type,self)}}
if(e){self.inState.click=!self.inState.click
if(self.isInStateTrue())self.enter(self)
else self.leave(self)}else{self.tip().hasClass('in')?self.leave(self):self.enter(self)}}
Tooltip.prototype.destroy=function(){var that=this
clearTimeout(this.timeout)
this.hide(function(){that.$element.off('.'+that.type).removeData('bs.'+that.type)
if(that.$tip){that.$tip.detach()}
that.$tip=null
that.$arrow=null
that.$viewport=null
that.$element=null})}
Tooltip.prototype.sanitizeHtml=function(unsafeHtml){return sanitizeHtml(unsafeHtml,this.options.whiteList,this.options.sanitizeFn)}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.tooltip')
var options=typeof option=='object'&&option
if(!data&&/destroy|hide/.test(option))return
if(!data)$this.data('bs.tooltip',(data=new Tooltip(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.tooltip
$.fn.tooltip=Plugin
$.fn.tooltip.Constructor=Tooltip
$.fn.tooltip.noConflict=function(){$.fn.tooltip=old
return this}}(jQuery);+function($){'use strict';var Popover=function(element,options){this.init('popover',element,options)}
if(!$.fn.tooltip)throw new Error('Popover requires tooltip.js')
Popover.VERSION='3.4.1'
Popover.DEFAULTS=$.extend({},$.fn.tooltip.Constructor.DEFAULTS,{placement:'right',trigger:'click',content:'',template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'})
Popover.prototype=$.extend({},$.fn.tooltip.Constructor.prototype)
Popover.prototype.constructor=Popover
Popover.prototype.getDefaults=function(){return Popover.DEFAULTS}
Popover.prototype.setContent=function(){var $tip=this.tip()
var title=this.getTitle()
var content=this.getContent()
if(this.options.html){var typeContent=typeof content
if(this.options.sanitize){title=this.sanitizeHtml(title)
if(typeContent==='string'){content=this.sanitizeHtml(content)}}
$tip.find('.popover-title').html(title)
$tip.find('.popover-content').children().detach().end()[typeContent==='string'?'html':'append'](content)}else{$tip.find('.popover-title').text(title)
$tip.find('.popover-content').children().detach().end().text(content)}
$tip.removeClass('fade top bottom left right in')
if(!$tip.find('.popover-title').html())$tip.find('.popover-title').hide()}
Popover.prototype.hasContent=function(){return this.getTitle()||this.getContent()}
Popover.prototype.getContent=function(){var $e=this.$element
var o=this.options
return $e.attr('data-content')||(typeof o.content=='function'?o.content.call($e[0]):o.content)}
Popover.prototype.arrow=function(){return(this.$arrow=this.$arrow||this.tip().find('.arrow'))}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.popover')
var options=typeof option=='object'&&option
if(!data&&/destroy|hide/.test(option))return
if(!data)$this.data('bs.popover',(data=new Popover(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.popover
$.fn.popover=Plugin
$.fn.popover.Constructor=Popover
$.fn.popover.noConflict=function(){$.fn.popover=old
return this}}(jQuery);+function($){'use strict';function ScrollSpy(element,options){this.$body=$(document.body)
this.$scrollElement=$(element).is(document.body)?$(window):$(element)
this.options=$.extend({},ScrollSpy.DEFAULTS,options)
this.selector=(this.options.target||'')+' .nav li > a'
this.offsets=[]
this.targets=[]
this.activeTarget=null
this.scrollHeight=0
this.$scrollElement.on('scroll.bs.scrollspy',$.proxy(this.process,this))
this.refresh()
this.process()}
ScrollSpy.VERSION='3.4.1'
ScrollSpy.DEFAULTS={offset:10}
ScrollSpy.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)}
ScrollSpy.prototype.refresh=function(){var that=this
var offsetMethod='offset'
var offsetBase=0
this.offsets=[]
this.targets=[]
this.scrollHeight=this.getScrollHeight()
if(!$.isWindow(this.$scrollElement[0])){offsetMethod='position'
offsetBase=this.$scrollElement.scrollTop()}
this.$body.find(this.selector).map(function(){var $el=$(this)
var href=$el.data('target')||$el.attr('href')
var $href=/^#./.test(href)&&$(href)
return($href&&$href.length&&$href.is(':visible')&&[[$href[offsetMethod]().top+offsetBase,href]])||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){that.offsets.push(this[0])
that.targets.push(this[1])})}
ScrollSpy.prototype.process=function(){var scrollTop=this.$scrollElement.scrollTop()+this.options.offset
var scrollHeight=this.getScrollHeight()
var maxScroll=this.options.offset+scrollHeight-this.$scrollElement.height()
var offsets=this.offsets
var targets=this.targets
var activeTarget=this.activeTarget
var i
if(this.scrollHeight!=scrollHeight){this.refresh()}
if(scrollTop>=maxScroll){return activeTarget!=(i=targets[targets.length-1])&&this.activate(i)}
if(activeTarget&&scrollTop<offsets[0]){this.activeTarget=null
return this.clear()}
for(i=offsets.length;i--;){activeTarget!=targets[i]&&scrollTop>=offsets[i]&&(offsets[i+1]===undefined||scrollTop<offsets[i+1])&&this.activate(targets[i])}}
ScrollSpy.prototype.activate=function(target){this.activeTarget=target
this.clear()
var selector=this.selector+'[data-target="'+target+'"],'+
this.selector+'[href="'+target+'"]'
var active=$(selector).parents('li').addClass('active')
if(active.parent('.dropdown-menu').length){active=active.closest('li.dropdown').addClass('active')}
active.trigger('activate.bs.scrollspy')}
ScrollSpy.prototype.clear=function(){$(this.selector).parentsUntil(this.options.target,'.active').removeClass('active')}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.scrollspy')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.scrollspy',(data=new ScrollSpy(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.scrollspy
$.fn.scrollspy=Plugin
$.fn.scrollspy.Constructor=ScrollSpy
$.fn.scrollspy.noConflict=function(){$.fn.scrollspy=old
return this}
$(window).on('load.bs.scrollspy.data-api',function(){$('[data-spy="scroll"]').each(function(){var $spy=$(this)
Plugin.call($spy,$spy.data())})})}(jQuery);+function($){'use strict';var Tab=function(element){this.element=$(element)}
Tab.VERSION='3.4.1'
Tab.TRANSITION_DURATION=150
Tab.prototype.show=function(){var $this=this.element
var $ul=$this.closest('ul:not(.dropdown-menu)')
var selector=$this.data('target')
if(!selector){selector=$this.attr('href')
selector=selector&&selector.replace(/.*(?=#[^\s]*$)/,'')}
if($this.parent('li').hasClass('active'))return
var $previous=$ul.find('.active:last a')
var hideEvent=$.Event('hide.bs.tab',{relatedTarget:$this[0]})
var showEvent=$.Event('show.bs.tab',{relatedTarget:$previous[0]})
$previous.trigger(hideEvent)
$this.trigger(showEvent)
if(showEvent.isDefaultPrevented()||hideEvent.isDefaultPrevented())return
var $target=$(document).find(selector)
this.activate($this.closest('li'),$ul)
this.activate($target,$target.parent(),function(){$previous.trigger({type:'hidden.bs.tab',relatedTarget:$this[0]})
$this.trigger({type:'shown.bs.tab',relatedTarget:$previous[0]})})}
Tab.prototype.activate=function(element,container,callback){var $active=container.find('> .active')
var transition=callback&&$.support.transition&&($active.length&&$active.hasClass('fade')||!!container.find('> .fade').length)
function next(){$active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded',false)
element.addClass('active').find('[data-toggle="tab"]').attr('aria-expanded',true)
if(transition){element[0].offsetWidth
element.addClass('in')}else{element.removeClass('fade')}
if(element.parent('.dropdown-menu').length){element.closest('li.dropdown').addClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded',true)}
callback&&callback()}
$active.length&&transition?$active.one('bsTransitionEnd',next).emulateTransitionEnd(Tab.TRANSITION_DURATION):next()
$active.removeClass('in')}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.tab')
if(!data)$this.data('bs.tab',(data=new Tab(this)))
if(typeof option=='string')data[option]()})}
var old=$.fn.tab
$.fn.tab=Plugin
$.fn.tab.Constructor=Tab
$.fn.tab.noConflict=function(){$.fn.tab=old
return this}
var clickHandler=function(e){e.preventDefault()
Plugin.call($(this),'show')}
$(document).on('click.bs.tab.data-api','[data-toggle="tab"]',clickHandler).on('click.bs.tab.data-api','[data-toggle="pill"]',clickHandler)}(jQuery);+function($){'use strict';var Affix=function(element,options){this.options=$.extend({},Affix.DEFAULTS,options)
var target=this.options.target===Affix.DEFAULTS.target?$(this.options.target):$(document).find(this.options.target)
this.$target=target.on('scroll.bs.affix.data-api',$.proxy(this.checkPosition,this)).on('click.bs.affix.data-api',$.proxy(this.checkPositionWithEventLoop,this))
this.$element=$(element)
this.affixed=null
this.unpin=null
this.pinnedOffset=null
this.checkPosition()}
Affix.VERSION='3.4.1'
Affix.RESET='affix affix-top affix-bottom'
Affix.DEFAULTS={offset:0,target:window}
Affix.prototype.getState=function(scrollHeight,height,offsetTop,offsetBottom){var scrollTop=this.$target.scrollTop()
var position=this.$element.offset()
var targetHeight=this.$target.height()
if(offsetTop!=null&&this.affixed=='top')return scrollTop<offsetTop?'top':false
if(this.affixed=='bottom'){if(offsetTop!=null)return(scrollTop+this.unpin<=position.top)?false:'bottom'
return(scrollTop+targetHeight<=scrollHeight-offsetBottom)?false:'bottom'}
var initializing=this.affixed==null
var colliderTop=initializing?scrollTop:position.top
var colliderHeight=initializing?targetHeight:height
if(offsetTop!=null&&scrollTop<=offsetTop)return'top'
if(offsetBottom!=null&&(colliderTop+colliderHeight>=scrollHeight-offsetBottom))return'bottom'
return false}
Affix.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset
this.$element.removeClass(Affix.RESET).addClass('affix')
var scrollTop=this.$target.scrollTop()
var position=this.$element.offset()
return(this.pinnedOffset=position.top-scrollTop)}
Affix.prototype.checkPositionWithEventLoop=function(){setTimeout($.proxy(this.checkPosition,this),1)}
Affix.prototype.checkPosition=function(){if(!this.$element.is(':visible'))return
var height=this.$element.height()
var offset=this.options.offset
var offsetTop=offset.top
var offsetBottom=offset.bottom
var scrollHeight=Math.max($(document).height(),$(document.body).height())
if(typeof offset!='object')offsetBottom=offsetTop=offset
if(typeof offsetTop=='function')offsetTop=offset.top(this.$element)
if(typeof offsetBottom=='function')offsetBottom=offset.bottom(this.$element)
var affix=this.getState(scrollHeight,height,offsetTop,offsetBottom)
if(this.affixed!=affix){if(this.unpin!=null)this.$element.css('top','')
var affixType='affix'+(affix?'-'+affix:'')
var e=$.Event(affixType+'.bs.affix')
this.$element.trigger(e)
if(e.isDefaultPrevented())return
this.affixed=affix
this.unpin=affix=='bottom'?this.getPinnedOffset():null
this.$element.removeClass(Affix.RESET).addClass(affixType).trigger(affixType.replace('affix','affixed')+'.bs.affix')}
if(affix=='bottom'){this.$element.offset({top:scrollHeight-height-offsetBottom})}}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.affix')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.affix',(data=new Affix(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.affix
$.fn.affix=Plugin
$.fn.affix.Constructor=Affix
$.fn.affix.noConflict=function(){$.fn.affix=old
return this}
$(window).on('load',function(){$('[data-spy="affix"]').each(function(){var $spy=$(this)
var data=$spy.data()
data.offset=data.offset||{}
if(data.offsetBottom!=null)data.offset.bottom=data.offsetBottom
if(data.offsetTop!=null)data.offset.top=data.offsetTop
Plugin.call($spy,data)})})}(jQuery);;;(function($){$.fn.yiiActiveForm=function(method){if(methods[method]){return methods[method].apply(this,Array.prototype.slice.call(arguments,1));}else{if(typeof method==='object'||!method){return methods.init.apply(this,arguments);}else{$.error('Method '+method+' does not exist on jQuery.yiiActiveForm');return false;}}};var events={beforeValidate:'beforeValidate',afterValidate:'afterValidate',beforeValidateAttribute:'beforeValidateAttribute',afterValidateAttribute:'afterValidateAttribute',beforeSubmit:'beforeSubmit',ajaxBeforeSend:'ajaxBeforeSend',ajaxComplete:'ajaxComplete',afterInit:'afterInit'};var defaults={encodeErrorSummary:true,errorSummary:'.error-summary',validateOnSubmit:true,errorCssClass:'has-error',successCssClass:'has-success',validatingCssClass:'validating',ajaxParam:'ajax',ajaxDataType:'json',validationUrl:undefined,scrollToError:true,scrollToErrorOffset:0,validationStateOn:'container'};var attributeDefaults={id:undefined,name:undefined,container:undefined,input:undefined,error:'.help-block',encodeError:true,validateOnChange:true,validateOnBlur:true,validateOnType:false,validationDelay:500,enableAjaxValidation:false,validate:undefined,status:0,cancelled:false,value:undefined,updateAriaInvalid:true};var submitDefer;var setSubmitFinalizeDefer=function($form){submitDefer=$.Deferred();$form.data('yiiSubmitFinalizePromise',submitDefer.promise());};var submitFinalize=function($form){if(submitDefer){submitDefer.resolve();submitDefer=undefined;$form.removeData('yiiSubmitFinalizePromise');}};var methods={init:function(attributes,options){return this.each(function(){var $form=$(this);if($form.data('yiiActiveForm')){return;}
var settings=$.extend({},defaults,options||{});if(settings.validationUrl===undefined){settings.validationUrl=$form.attr('action');}
$.each(attributes,function(i){attributes[i]=$.extend({value:getValue($form,this)},attributeDefaults,this);watchAttribute($form,attributes[i]);});$form.data('yiiActiveForm',{settings:settings,attributes:attributes,submitting:false,validated:false,options:getFormOptions($form)});$form.on('reset.yiiActiveForm',methods.resetForm);if(settings.validateOnSubmit){$form.on('mouseup.yiiActiveForm keyup.yiiActiveForm',':submit',function(){$form.data('yiiActiveForm').submitObject=$(this);});$form.on('submit.yiiActiveForm',methods.submitForm);}
var event=$.Event(events.afterInit);$form.trigger(event);});},add:function(attribute){var $form=$(this);attribute=$.extend({value:getValue($form,attribute)},attributeDefaults,attribute);$form.data('yiiActiveForm').attributes.push(attribute);watchAttribute($form,attribute);},remove:function(id){var $form=$(this),attributes=$form.data('yiiActiveForm').attributes,index=-1,attribute=undefined;$.each(attributes,function(i){if(attributes[i]['id']==id){index=i;attribute=attributes[i];return false;}});if(index>=0){attributes.splice(index,1);unwatchAttribute($form,attribute);}
return attribute;},validateAttribute:function(id){var attribute=methods.find.call(this,id);if(attribute!=undefined){validateAttribute($(this),attribute,true);}},find:function(id){var attributes=$(this).data('yiiActiveForm').attributes,result=undefined;$.each(attributes,function(i){if(attributes[i]['id']==id){result=attributes[i];return false;}});return result;},destroy:function(){return this.each(function(){$(this).off('.yiiActiveForm');$(this).removeData('yiiActiveForm');});},data:function(){return this.data('yiiActiveForm');},validate:function(forceValidate){if(forceValidate){$(this).data('yiiActiveForm').submitting=true;}
var $form=$(this),data=$form.data('yiiActiveForm'),needAjaxValidation=false,messages={},deferreds=deferredArray(),submitting=data.submitting;if(submitting){var event=$.Event(events.beforeValidate);$form.trigger(event,[messages,deferreds]);if(event.result===false){data.submitting=false;submitFinalize($form);return;}}
$.each(data.attributes,function(){this.$form=$form;var $input=findInput($form,this);var disabled=$input.toArray().reduce(function(result,next){return result&&$(next).is(':disabled');},true);if(disabled){return true;}
if($input.length&&$input[0].tagName.toLowerCase()==='select'){var opts=$input[0].options,isEmpty=!opts||!opts.length,isRequired=$input.attr('required'),isMultiple=$input.attr('multiple'),size=$input.attr('size')||1;if(isRequired&&!isMultiple&&parseInt(size,10)===1){if(isEmpty){return true;}
if(opts[0]&&(opts[0].value!==''&&opts[0].text!=='')){return true;}}}
this.cancelled=false;if(data.submitting||this.status===2||this.status===3){var msg=messages[this.id];if(msg===undefined){msg=[];messages[this.id]=msg;}
var event=$.Event(events.beforeValidateAttribute);$form.trigger(event,[this,msg,deferreds]);if(event.result!==false){if(this.validate){this.validate(this,getValue($form,this),msg,deferreds,$form);}
if(this.enableAjaxValidation){needAjaxValidation=true;}}else{this.cancelled=true;}}});$.when.apply(this,deferreds).always(function(){for(var i in messages){if(0===messages[i].length){delete messages[i];}}
if(needAjaxValidation&&($.isEmptyObject(messages)||data.submitting)){var $button=data.submitObject,extData='&'+data.settings.ajaxParam+'='+$form.attr('id');if($button&&$button.length&&$button.attr('name')){extData+='&'+$button.attr('name')+'='+$button.attr('value');}
$.ajax({url:data.settings.validationUrl,type:$form.attr('method'),data:$form.serialize()+extData,dataType:data.settings.ajaxDataType,complete:function(jqXHR,textStatus){$form.trigger(events.ajaxComplete,[jqXHR,textStatus]);},beforeSend:function(jqXHR,settings){$form.trigger(events.ajaxBeforeSend,[jqXHR,settings]);},success:function(msgs){if(msgs!==null&&typeof msgs==='object'){$.each(data.attributes,function(){if(!this.enableAjaxValidation||this.cancelled){delete msgs[this.id];}});updateInputs($form,$.extend(messages,msgs),submitting);}else{updateInputs($form,messages,submitting);}},error:function(){data.submitting=false;submitFinalize($form);}});}else{if(data.submitting){window.setTimeout(function(){updateInputs($form,messages,submitting);},200);}else{updateInputs($form,messages,submitting);}}});},submitForm:function(){var $form=$(this),data=$form.data('yiiActiveForm');if(data.validated){data.submitting=false;var event=$.Event(events.beforeSubmit);$form.trigger(event);if(event.result===false){data.validated=false;submitFinalize($form);return false;}
updateHiddenButton($form);return true;}else{setSubmitFinalizeDefer($form);if(data.settings.timer!==undefined){clearTimeout(data.settings.timer);}
data.submitting=true;methods.validate.call($form);return false;}},resetForm:function(){var $form=$(this);var data=$form.data('yiiActiveForm');window.setTimeout(function(){$.each(data.attributes,function(){this.value=getValue($form,this);this.status=0;var $container=$form.find(this.container),$input=findInput($form,this),$errorElement=data.settings.validationStateOn==='input'?$input:$container;$errorElement.removeClass(data.settings.validatingCssClass+' '+
data.settings.errorCssClass+' '+
data.settings.successCssClass);$container.find(this.error).html('');});$form.find(data.settings.errorSummary).hide().find('ul').html('');},1);},updateMessages:function(messages,summary){var $form=$(this);var data=$form.data('yiiActiveForm');$.each(data.attributes,function(){updateInput($form,this,messages);});if(summary){updateSummary($form,messages);}},updateAttribute:function(id,messages){var attribute=methods.find.call(this,id);if(attribute!=undefined){var msg={};msg[id]=messages;updateInput($(this),attribute,msg);}}};var watchAttribute=function($form,attribute){var $input=findInput($form,attribute);if(attribute.validateOnChange){$input.on('change.yiiActiveForm',function(){validateAttribute($form,attribute,false);});}
if(attribute.validateOnBlur){$input.on('blur.yiiActiveForm',function(){if(attribute.status==0||attribute.status==1){validateAttribute($form,attribute,true);}});}
if(attribute.validateOnType){$input.on('keyup.yiiActiveForm',function(e){if($.inArray(e.which,[16,17,18,37,38,39,40])!==-1){return;}
if(attribute.value!==getValue($form,attribute)){validateAttribute($form,attribute,false,attribute.validationDelay);}});}};var unwatchAttribute=function($form,attribute){findInput($form,attribute).off('.yiiActiveForm');};var validateAttribute=function($form,attribute,forceValidate,validationDelay){var data=$form.data('yiiActiveForm');if(forceValidate){attribute.status=2;}
$.each(data.attributes,function(){if(!isEqual(this.value,getValue($form,this))){this.status=2;forceValidate=true;}});if(!forceValidate){return;}
if(data.settings.timer!==undefined){clearTimeout(data.settings.timer);}
data.settings.timer=window.setTimeout(function(){if(data.submitting||$form.is(':hidden')){return;}
$.each(data.attributes,function(){if(this.status===2){this.status=3;var $container=$form.find(this.container),$input=findInput($form,this);var $errorElement=data.settings.validationStateOn==='input'?$input:$container;$errorElement.addClass(data.settings.validatingCssClass);}});methods.validate.call($form);},validationDelay?validationDelay:200);};var isEqual=function(val1,val2){if(val1 instanceof Object){return isObjectsEqual(val1,val2)}
if(Array.isArray(val1)){return isArraysEqual(val1,val2);}
return val1===val2;};var isObjectsEqual=function(obj1,obj2){if(!(obj1 instanceof Object)||!(obj2 instanceof Object)){return false;}
var keys1=Object.keys(obj1);var keys2=Object.keys(obj2);if(keys1.length!==keys2.length){return false;}
for(var i=0;i<keys1.length;i+=1){if(!obj2.hasOwnProperty(keys1[i])){return false;}
if(obj1[keys1[i]]!==obj2[keys1[i]]){return false;}}
return true;};var isArraysEqual=function(arr1,arr2){if(!Array.isArray(arr1)||!Array.isArray(arr2)){return false;}
if(arr1.length!==arr2.length){return false;}
for(var i=0;i<arr1.length;i+=1){if(arr1[i]!==arr2[i]){return false;}}
return true;};var deferredArray=function(){var array=[];array.add=function(callback){this.push(new $.Deferred(callback));};return array;};var buttonOptions=['action','target','method','enctype'];var getFormOptions=function($form){var attributes={};for(var i=0;i<buttonOptions.length;i++){attributes[buttonOptions[i]]=$form.attr(buttonOptions[i]);}
return attributes;};var applyButtonOptions=function($form,$button){for(var i=0;i<buttonOptions.length;i++){var value=$button.attr('form'+buttonOptions[i]);if(value){$form.attr(buttonOptions[i],value);}}};var restoreButtonOptions=function($form){var data=$form.data('yiiActiveForm');for(var i=0;i<buttonOptions.length;i++){$form.attr(buttonOptions[i],data.options[buttonOptions[i]]||null);}};var updateInputs=function($form,messages,submitting){var data=$form.data('yiiActiveForm');if(data===undefined){return false;}
var errorAttributes=[],$input;$.each(data.attributes,function(){var hasError=(submitting&&updateInput($form,this,messages))||(!submitting&&attrHasError($form,this,messages));$input=findInput($form,this);if(!$input.is(':disabled')&&!this.cancelled&&hasError){errorAttributes.push(this);}});$form.trigger(events.afterValidate,[messages,errorAttributes]);if(submitting){updateSummary($form,messages);if(errorAttributes.length){if(data.settings.scrollToError){var h=$(document).height(),top=$form.find($.map(errorAttributes,function(attribute){return attribute.input;}).join(',')).first().closest(':visible').offset().top-data.settings.scrollToErrorOffset;top=top<0?0:(top>h?h:top);var wtop=$(window).scrollTop();if(top<wtop||top>wtop+$(window).height()){$(window).scrollTop(top);}}
data.submitting=false;}else{data.validated=true;if(data.submitObject){applyButtonOptions($form,data.submitObject);}
$form.submit();if(data.submitObject){restoreButtonOptions($form);}}}else{$.each(data.attributes,function(){if(!this.cancelled&&(this.status===2||this.status===3)){updateInput($form,this,messages);}});}
submitFinalize($form);};var updateHiddenButton=function($form){var data=$form.data('yiiActiveForm');var $button=data.submitObject||$form.find(':submit:first');if($button.length&&$button.attr('type')=='submit'&&$button.attr('name')){var $hiddenButton=$('input[type="hidden"][name="'+$button.attr('name')+'"]',$form);if(!$hiddenButton.length){$('<input>').attr({type:'hidden',name:$button.attr('name'),value:$button.attr('value')}).appendTo($form);}else{$hiddenButton.attr('value',$button.attr('value'));}}};var updateInput=function($form,attribute,messages){var data=$form.data('yiiActiveForm'),$input=findInput($form,attribute),hasError=attrHasError($form,attribute,messages);if(!$.isArray(messages[attribute.id])){messages[attribute.id]=[];}
attribute.status=1;if($input.length){var $container=$form.find(attribute.container);var $error=$container.find(attribute.error);updateAriaInvalid($form,attribute,hasError);var $errorElement=data.settings.validationStateOn==='input'?$input:$container;if(hasError){if(attribute.encodeError){$error.text(messages[attribute.id][0]);}else{$error.html(messages[attribute.id][0]);}
$errorElement.removeClass(data.settings.validatingCssClass+' '+data.settings.successCssClass).addClass(data.settings.errorCssClass);}else{$error.empty();$errorElement.removeClass(data.settings.validatingCssClass+' '+data.settings.errorCssClass+' ').addClass(data.settings.successCssClass);}
attribute.value=getValue($form,attribute);}
$form.trigger(events.afterValidateAttribute,[attribute,messages[attribute.id]]);return hasError;};var attrHasError=function($form,attribute,messages){var $input=findInput($form,attribute),hasError=false;if(!$.isArray(messages[attribute.id])){messages[attribute.id]=[];}
if($input.length){hasError=messages[attribute.id].length>0;}
return hasError;};var updateSummary=function($form,messages){var data=$form.data('yiiActiveForm'),$summary=$form.find(data.settings.errorSummary),$ul=$summary.find('ul').empty();if($summary.length&&messages){$.each(data.attributes,function(){if($.isArray(messages[this.id])&&messages[this.id].length){var error=$('<li/>');if(data.settings.encodeErrorSummary){error.text(messages[this.id][0]);}else{error.html(messages[this.id][0]);}
$ul.append(error);}});$summary.toggle($ul.find('li').length>0);}};var getValue=function($form,attribute){var $input=findInput($form,attribute);var type=$input.attr('type');if(type==='checkbox'||type==='radio'){var $realInput=$input.filter(':checked');if($realInput.length>1){var values=[];$realInput.each(function(index){values.push($($realInput.get(index)).val());});return values;}
if(!$realInput.length){$realInput=$form.find('input[type=hidden][name="'+$input.attr('name')+'"]');}
return $realInput.val();}else{return $input.val();}};var findInput=function($form,attribute){var $input=$form.find(attribute.input);if($input.length&&$input[0].tagName.toLowerCase()==='div'){return $input.find('input');}else{return $input;}};var updateAriaInvalid=function($form,attribute,hasError){if(attribute.updateAriaInvalid){$form.find(attribute.input).attr('aria-invalid',hasError?'true':'false');}}})(window.jQuery);;;$(document).ready(function(){});;