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
return pub;})(window.jQuery);window.jQuery(function(){window.yii.initModule(window.yii);});;;
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
Plugin.call($spy,data)})})}(jQuery);;;!function(t,e){"use strict";"undefined"!=typeof module&&module.exports?module.exports=e(require("jquery"),require("bootstrap")):"function"==typeof define&&define.amd?define("bootstrap-dialog",["jquery","bootstrap"],function(t){return e(t)}):t.BootstrapDialog=e(t.jQuery)}(this,function(t){"use strict";var e=t.fn.modal?t.fn.modal.Constructor:bootstrap?bootstrap.Modal:{},n=function(t,n){return/4\.\d+\.\d+/.test(e.VERSION)||/5\.\d+\.\d+/.test(e.VERSION)?new e(t,n):void e.call(this,t,n)};n.getModalVersion=function(){var t=null;return t="undefined"==typeof e.VERSION?"v3.1":/3\.2\.\d+/.test(e.VERSION)?"v3.2":/3\.3\.[1,2]/.test(e.VERSION)?"v3.3":/4\.\d+\.\d+/.test(e.VERSION)?"v4.1":/5\.\d+\.\d+/.test(e.VERSION)?"v5.1":"v3.3.4"},n.ORIGINAL_BODY_PADDING=parseInt(t("body").css("padding-right")||0,10),n.METHODS_TO_OVERRIDE={},n.METHODS_TO_OVERRIDE["v3.1"]={},n.METHODS_TO_OVERRIDE["v3.2"]={hide:function(e){if(e&&e.preventDefault(),e=t.Event("hide.bs.modal"),this.$element.trigger(e),this.isShown&&!e.isDefaultPrevented()){this.isShown=!1;var n=this.getGlobalOpenedDialogs();0===n.length&&this.$body.removeClass("modal-open"),this.resetScrollbar(),this.escape(),t(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.bs.modal"),t.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",t.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal()}}},n.METHODS_TO_OVERRIDE["v3.3"]={setScrollbar:function(){var t=n.ORIGINAL_BODY_PADDING;this.bodyIsOverflowing&&this.$body.css("padding-right",t+this.scrollbarWidth)},resetScrollbar:function(){var t=this.getGlobalOpenedDialogs();0===t.length&&this.$body.css("padding-right",n.ORIGINAL_BODY_PADDING)},hideModal:function(){this.$element.hide(),this.backdrop(t.proxy(function(){var t=this.getGlobalOpenedDialogs();0===t.length&&this.$body.removeClass("modal-open"),this.resetAdjustments(),this.resetScrollbar(),this.$element.trigger("hidden.bs.modal")},this))}},n.METHODS_TO_OVERRIDE["v3.3.4"]=t.extend({},n.METHODS_TO_OVERRIDE["v3.3"]),n.METHODS_TO_OVERRIDE["v4.1"]=t.extend({},n.METHODS_TO_OVERRIDE["v3.3"]),n.METHODS_TO_OVERRIDE["v5.1"]=t.extend({},n.METHODS_TO_OVERRIDE["v4.1"]),n.prototype={constructor:n,getGlobalOpenedDialogs:function(){var e=[];return t.each(i.dialogs,function(t,n){n.isRealized()&&n.isOpened()&&e.push(n)}),e}};var o=e.prototype||null;n.prototype=t.extend(n.prototype,o,n.METHODS_TO_OVERRIDE[n.getModalVersion()]);var i=function(e){this.defaultOptions=t.extend(!0,{id:i.newGuid(),buttons:[],data:{},onshow:null,onshown:null,onhide:null,onhidden:null},i.defaultOptions),this.indexedButtons={},this.registeredButtonHotkeys={},this.draggableData={isMouseDown:!1,mouseOffset:{}},this.realized=!1,this.opened=!1,this.initOptions(e),this.holdThisInstance()};return i.BootstrapDialogModal=n,i.NAMESPACE="bootstrap-dialog",i.TYPE_DEFAULT="type-default",i.TYPE_INFO="type-info",i.TYPE_PRIMARY="type-primary",i.TYPE_SECONDARY="type-secondary",i.TYPE_SUCCESS="type-success",i.TYPE_WARNING="type-warning",i.TYPE_DANGER="type-danger",i.TYPE_DARK="type-dark",i.TYPE_LIGHT="type-light",i.DEFAULT_TEXTS={},i.DEFAULT_TEXTS[i.TYPE_DEFAULT]="Default",i.DEFAULT_TEXTS[i.TYPE_INFO]="Information",i.DEFAULT_TEXTS[i.TYPE_PRIMARY]="Primary",i.DEFAULT_TEXTS[i.TYPE_SECONDARY]="Secondary",i.DEFAULT_TEXTS[i.TYPE_SUCCESS]="Success",i.DEFAULT_TEXTS[i.TYPE_WARNING]="Warning",i.DEFAULT_TEXTS[i.TYPE_DANGER]="Danger",i.DEFAULT_TEXTS[i.TYPE_DARK]="Dark",i.DEFAULT_TEXTS[i.TYPE_LIGHT]="Light",i.DEFAULT_TEXTS.OK="OK",i.DEFAULT_TEXTS.CANCEL="Cancel",i.DEFAULT_TEXTS.CONFIRM="Confirmation",i.SIZE_NORMAL="size-normal",i.SIZE_SMALL="size-small",i.SIZE_LARGE="size-large",i.SIZE_WIDE="size-wide",i.BUTTON_SIZES={},i.BUTTON_SIZES[i.SIZE_NORMAL]="",i.BUTTON_SIZES[i.SIZE_SMALL]="btn-sm",i.BUTTON_SIZES[i.SIZE_LARGE]="btn-lg",i.BUTTON_SIZES[i.SIZE_WIDE]="",i.ICON_SPINNER="glyphicon glyphicon-asterisk",i.BUTTONS_ORDER_CANCEL_OK="btns-order-cancel-ok",i.BUTTONS_ORDER_OK_CANCEL="btns-order-ok-cancel",i.defaultOptions={type:i.TYPE_PRIMARY,size:i.SIZE_NORMAL,cssClass:"",title:null,message:null,nl2br:!0,closable:!0,closeByBackdrop:!0,closeByKeyboard:!0,closeIcon:"&#10005;",spinicon:i.ICON_SPINNER,autodestroy:!0,draggable:!1,animate:!0,description:"",tabindex:-1,btnsOrder:i.BUTTONS_ORDER_CANCEL_OK},i.configDefaultOptions=function(e){i.defaultOptions=t.extend(!0,i.defaultOptions,e)},i.dialogs={},i.openAll=function(){t.each(i.dialogs,function(t,e){e.open()})},i.closeAll=function(){t.each(i.dialogs,function(t,e){e.close()})},i.getDialog=function(t){var e=null;return"undefined"!=typeof i.dialogs[t]&&(e=i.dialogs[t]),e},i.setDialog=function(t){return i.dialogs[t.getId()]=t,t},i.addDialog=function(t){return i.setDialog(t)},i.moveFocus=function(){var e=null;t.each(i.dialogs,function(t,n){n.isRealized()&&n.isOpened()&&(e=n)}),null!==e&&e.getModal().focus()},i.METHODS_TO_OVERRIDE={},i.METHODS_TO_OVERRIDE["v3.1"]={handleModalBackdropEvent:function(){return this.getModal().on("click",{dialog:this},function(t){t.target===this&&t.data.dialog.isClosable()&&t.data.dialog.canCloseByBackdrop()&&t.data.dialog.close()}),this},updateZIndex:function(){if(this.isOpened()){var e=1040,n=1050,o=0;t.each(i.dialogs,function(t,e){e.isRealized()&&e.isOpened()&&o++});var a=this.getModal(),s=this.getModalBackdrop(a);a.css("z-index",n+20*(o-1)),s.css("z-index",e+20*(o-1))}return this},open:function(){return!this.isRealized()&&this.realize(),this.getModal().modal("show"),this.updateZIndex(),this}},i.METHODS_TO_OVERRIDE["v3.2"]={handleModalBackdropEvent:i.METHODS_TO_OVERRIDE["v3.1"].handleModalBackdropEvent,updateZIndex:i.METHODS_TO_OVERRIDE["v3.1"].updateZIndex,open:i.METHODS_TO_OVERRIDE["v3.1"].open},i.METHODS_TO_OVERRIDE["v3.3"]={},i.METHODS_TO_OVERRIDE["v3.3.4"]=t.extend({},i.METHODS_TO_OVERRIDE["v3.1"]),i.METHODS_TO_OVERRIDE["v4.0"]=i.METHODS_TO_OVERRIDE["v4.1"]=i.METHODS_TO_OVERRIDE["v5.1"]={defaultButtonCss:"btn-outline-secondary",getModalBackdrop:function(e){return t(e.data("bs.modal")._backdrop)},handleModalBackdropEvent:i.METHODS_TO_OVERRIDE["v3.1"].handleModalBackdropEvent,updateZIndex:i.METHODS_TO_OVERRIDE["v3.1"].updateZIndex,open:i.METHODS_TO_OVERRIDE["v3.1"].open,getModalForBootstrapDialogModal:function(){return this.getModal().get(0)},createHeaderContent:function(){var e=t("<div></div>");return e.append(this.createTitleContent()).append(this.createCloseButton()),e.html()}},i.prototype={constructor:i,defaultButtonCss:"btn-default",initOptions:function(e){return this.options=t.extend(!0,this.defaultOptions,e),this},holdThisInstance:function(){return i.addDialog(this),this},initModalStuff:function(){return this.setModal(this.createModal()).setModalDialog(this.createModalDialog()).setModalContent(this.createModalContent()).setModalHeader(this.createModalHeader()).setModalBody(this.createModalBody()).setModalFooter(this.createModalFooter()),this.getModal().append(this.getModalDialog()),this.getModalDialog().append(this.getModalContent()),this.getModalContent().append(this.getModalHeader()).append(this.getModalBody()).append(this.getModalFooter()),this},createModal:function(){var e=t('<div class="modal" role="dialog" aria-hidden="true"></div>');return e.prop("id",this.getId()),e.attr("aria-labelledby",this.getId()+"_title"),e},getModal:function(){return this.$modal},setModal:function(t){return this.$modal=t,this},getModalBackdrop:function(t){return t.data("bs.modal").$backdrop},getModalForBootstrapDialogModal:function(){return this.getModal()},createModalDialog:function(){return t('<div class="modal-dialog"></div>')},getModalDialog:function(){return this.$modalDialog},setModalDialog:function(t){return this.$modalDialog=t,this},createModalContent:function(){return t('<div class="modal-content"></div>')},getModalContent:function(){return this.$modalContent},setModalContent:function(t){return this.$modalContent=t,this},createModalHeader:function(){var e=this.getNamespace("header")+" "+this.getColor();return t('<div class="modal-header '+e+'"></div>')},getModalHeader:function(){return this.$modalHeader},setModalHeader:function(t){return this.$modalHeader=t,this},createModalBody:function(){return t('<div class="modal-body"></div>')},getModalBody:function(){return this.$modalBody},setModalBody:function(t){return this.$modalBody=t,this},createModalFooter:function(){return t('<div class="modal-footer"></div>')},getModalFooter:function(){return this.$modalFooter},setModalFooter:function(t){return this.$modalFooter=t,this},createDynamicContent:function(t){var e=null;return e="function"==typeof t?t.call(t,this):t,"string"==typeof e&&(e=this.formatStringContent(e)),e},formatStringContent:function(t){return this.options.nl2br?t.replace(/\r\n/g,"<br />").replace(/[\r\n]/g,"<br />"):t},setData:function(t,e){return this.options.data[t]=e,this},getData:function(t){return this.options.data[t]},setId:function(t){return this.options.id=t,this},getId:function(){return this.options.id},getColor:function(){return this.getType().replace("type-","btn-")},getType:function(){return this.options.type},setType:function(t){return this.options.type=t,this.updateType(),this},updateType:function(){if(this.isRealized()){var t=[i.TYPE_DEFAULT,i.TYPE_INFO,i.TYPE_PRIMARY,i.TYPE_SECONDARY,i.TYPE_SUCCESS,i.TYPE_WARNING,i.TYPE_DARK,i.TYPE_LIGHT,i.TYPE_DANGER];this.getModal().removeClass(t.join(" ")).addClass(this.getType())}return this},getSize:function(){return this.options.size},setSize:function(t){return this.options.size=t,this.updateSize(),this},updateSize:function(){if(this.isRealized()){var e=this,n=this.getSize();this.getModal().removeClass(i.SIZE_NORMAL).removeClass(i.SIZE_SMALL).removeClass(i.SIZE_LARGE).removeClass(i.SIZE_WIDE),this.getModal().addClass(n),this.getModalDialog().removeClass("modal-sm"),n===i.SIZE_SMALL&&this.getModalDialog().addClass("modal-sm"),this.getModalDialog().removeClass("modal-lg"),n===i.SIZE_LARGE&&this.getModalDialog().addClass("modal-lg"),this.getModalDialog().removeClass("modal-xl"),n===i.SIZE_WIDE&&this.getModalDialog().addClass("modal-xl"),t.each(this.options.buttons,function(n,o){var i=e.getButton(o.id),a=["btn-lg","btn-sm","btn-xs"],s=!1;if("string"==typeof o.cssClass){var d=o.cssClass.split(" ");t.each(d,function(e,n){-1!==t.inArray(n,a)&&(s=!0)})}s||(i.removeClass(a.join(" ")),i.addClass(e.getButtonSize()))})}return this},getCssClass:function(){return this.options.cssClass},setCssClass:function(t){return this.options.cssClass=t,this},getTitle:function(){return this.options.title},setTitle:function(t){return this.options.title=t,this.updateTitle(),this},updateTitle:function(){if(this.isRealized()){var t=null!==this.getTitle()?this.createDynamicContent(this.getTitle()):this.getDefaultText();this.getModalHeader().find("."+this.getNamespace("title")).html("").append(t).prop("id",this.getId()+"_title")}return this},getMessage:function(){return this.options.message},setMessage:function(t){return this.options.message=t,this.updateMessage(),this},updateMessage:function(){if(this.isRealized()){var t=this.createDynamicContent(this.getMessage());this.getModalBody().find("."+this.getNamespace("message")).html("").append(t)}return this},isClosable:function(){return this.options.closable},setClosable:function(t){return this.options.closable=t,this.updateClosable(),this},setCloseByBackdrop:function(t){return this.options.closeByBackdrop=t,this},canCloseByBackdrop:function(){return this.options.closeByBackdrop},setCloseByKeyboard:function(t){return this.options.closeByKeyboard=t,this},canCloseByKeyboard:function(){return this.options.closeByKeyboard},isAnimate:function(){return this.options.animate},setAnimate:function(t){return this.options.animate=t,this},updateAnimate:function(){return this.isRealized()&&this.getModal().toggleClass("fade",this.isAnimate()),this},getSpinicon:function(){return this.options.spinicon},setSpinicon:function(t){return this.options.spinicon=t,this},addButton:function(t){return this.options.buttons.push(t),this},addButtons:function(e){var n=this;return t.each(e,function(t,e){n.addButton(e)}),this},getButtons:function(){return this.options.buttons},setButtons:function(t){return this.options.buttons=t,this.updateButtons(),this},getButton:function(t){return"undefined"!=typeof this.indexedButtons[t]?this.indexedButtons[t]:null},getButtonSize:function(){return"undefined"!=typeof i.BUTTON_SIZES[this.getSize()]?i.BUTTON_SIZES[this.getSize()]:""},updateButtons:function(){return this.isRealized()&&(0===this.getButtons().length?this.getModalFooter().hide():this.getModalFooter().show().find("."+this.getNamespace("footer")).html("").append(this.createFooterButtons())),this},isAutodestroy:function(){return this.options.autodestroy},setAutodestroy:function(t){this.options.autodestroy=t},getDescription:function(){return this.options.description},setDescription:function(t){return this.options.description=t,this},setTabindex:function(t){return this.options.tabindex=t,this},getTabindex:function(){return this.options.tabindex},updateTabindex:function(){return this.isRealized()&&this.getModal().attr("tabindex",this.getTabindex()),this},getDefaultText:function(){return i.DEFAULT_TEXTS[this.getType()]},getNamespace:function(t){return i.NAMESPACE+"-"+t},createHeaderContent:function(){var e=t("<div></div>");return e.addClass(this.getNamespace("header")),e.append(this.createTitleContent()),e.prepend(this.createCloseButton()),e},createTitleContent:function(){var e=t("<div></div>");return e.addClass(this.getNamespace("title")),e},createCloseButton:function(){var e,n=t("<div></div>");return n.addClass(this.getNamespace("close-button")),e=t('<button class="btn-modal-close btn '+this.getColor()+'" data-dismiss="modal" data-bs-dismiss="modal" aria-label="close"></button>'),e.append(this.options.closeIcon),n.append(e),n.on("click",{dialog:this},function(t){t.data.dialog.close()}),n},createBodyContent:function(){var e=t("<div></div>");return e.addClass(this.getNamespace("body")),e.append(this.createMessageContent()),e},createMessageContent:function(){var e=t("<div></div>");return e.addClass(this.getNamespace("message")),e},createFooterContent:function(){var e=t("<div></div>");return e.addClass(this.getNamespace("footer")),e},createFooterButtons:function(){var e=this,n=t("<div></div>");return n.addClass(this.getNamespace("footer-buttons")),this.indexedButtons={},t.each(this.options.buttons,function(t,o){o.id||(o.id=i.newGuid());var a=e.createButton(o);e.indexedButtons[o.id]=a,n.append(a)}),n},createButton:function(e){var n=t('<button class="btn"></button>');return n.prop("id",e.id),n.data("button",e),"undefined"!=typeof e.icon&&""!==t.trim(e.icon)&&n.append(this.createButtonIcon(e.icon)),"undefined"!=typeof e.label&&n.append(e.label),"undefined"!=typeof e.title&&n.attr("title",e.title),"undefined"!=typeof e.cssClass&&""!==t.trim(e.cssClass)?n.addClass(e.cssClass):n.addClass(this.defaultButtonCss),"object"==typeof e.data&&e.data.constructor==={}.constructor&&t.each(e.data,function(t,e){n.attr("data-"+t,e)}),"undefined"!=typeof e.hotkey&&(this.registeredButtonHotkeys[e.hotkey]=n),n.on("click",{dialog:this,$button:n,button:e},function(t){var e=t.data.dialog,n=t.data.$button,o=n.data("button");return o.autospin&&n.toggleSpin(!0),"function"==typeof o.action?o.action.call(n,e,t):void 0}),this.enhanceButton(n),"undefined"!=typeof e.enabled&&n.toggleEnable(e.enabled),n},enhanceButton:function(t){return t.dialog=this,t.toggleEnable=function(t){var e=this;return"undefined"!=typeof t?e.prop("disabled",!t).toggleClass("disabled",!t):e.prop("disabled",!e.prop("disabled")),e},t.enable=function(){var t=this;return t.toggleEnable(!0),t},t.disable=function(){var t=this;return t.toggleEnable(!1),t},t.toggleSpin=function(e){var n=this,o=n.dialog,i=n.find("."+o.getNamespace("button-icon"));return"undefined"==typeof e&&(e=!(t.find(".icon-spin").length>0)),e?(i.hide(),t.prepend(o.createButtonIcon(o.getSpinicon()).addClass("icon-spin"))):(i.show(),t.find(".icon-spin").remove()),n},t.spin=function(){var t=this;return t.toggleSpin(!0),t},t.stopSpin=function(){var t=this;return t.toggleSpin(!1),t},this},createButtonIcon:function(e){var n=t("<span></span>");return n.addClass(this.getNamespace("button-icon")).addClass(e),n},enableButtons:function(e){return t.each(this.indexedButtons,function(t,n){n.toggleEnable(e)}),this},updateClosable:function(){return this.isRealized()&&this.getModalHeader().find("."+this.getNamespace("close-button")).toggle(this.isClosable()),this},onShow:function(t){return this.options.onshow=t,this},onShown:function(t){return this.options.onshown=t,this},onHide:function(t){return this.options.onhide=t,this},onHidden:function(t){return this.options.onhidden=t,this},isRealized:function(){return this.realized},setRealized:function(t){return this.realized=t,this},isOpened:function(){return this.opened},setOpened:function(t){return this.opened=t,this},handleModalEvents:function(){return this.getModal().on("show.bs.modal",{dialog:this},function(t){var e=t.data.dialog;if(e.setOpened(!0),e.isModalEvent(t)&&"function"==typeof e.options.onshow){var n=e.options.onshow(e);return n===!1&&e.setOpened(!1),n}}),this.getModal().on("shown.bs.modal",{dialog:this},function(t){var e=t.data.dialog;e.isModalEvent(t)&&"function"==typeof e.options.onshown&&e.options.onshown(e)}),this.getModal().on("hide.bs.modal",{dialog:this},function(t){var e=t.data.dialog;if(e.setOpened(!1),e.isModalEvent(t)&&"function"==typeof e.options.onhide){var n=e.options.onhide(e);return n===!1&&e.setOpened(!0),n}}),this.getModal().on("hidden.bs.modal",{dialog:this},function(e){var n=e.data.dialog;n.isModalEvent(e)&&"function"==typeof n.options.onhidden&&n.options.onhidden(n),n.isAutodestroy()&&(n.setRealized(!1),delete i.dialogs[n.getId()],t(this).remove()),i.moveFocus(),t(".modal").hasClass("in")&&t("body").addClass("modal-open")}),this.handleModalBackdropEvent(),this.getModal().on("keyup",{dialog:this},function(t){27===t.which&&t.data.dialog.isClosable()&&t.data.dialog.canCloseByKeyboard()&&t.data.dialog.close()}),this.getModal().on("keyup",{dialog:this},function(e){var n=e.data.dialog;if("undefined"!=typeof n.registeredButtonHotkeys[e.which]){var o=t(n.registeredButtonHotkeys[e.which]);!o.prop("disabled")&&!o.is(":focus")&&o.focus().trigger("click")}}),this},handleModalBackdropEvent:function(){return this.getModal().on("click",{dialog:this},function(e){t(e.target).hasClass("modal-backdrop")&&e.data.dialog.isClosable()&&e.data.dialog.canCloseByBackdrop()&&e.data.dialog.close()}),this},isModalEvent:function(t){return"undefined"!=typeof t.namespace&&"bs.modal"===t.namespace},makeModalDraggable:function(){return this.options.draggable&&(this.getModalHeader().addClass(this.getNamespace("draggable")).on("mousedown",{dialog:this},function(t){var e=t.data.dialog;e.draggableData.isMouseDown=!0;var n=e.getModalDialog().offset();e.draggableData.mouseOffset={top:t.clientY-n.top,left:t.clientX-n.left}}),this.getModal().on("mouseup mouseleave",{dialog:this},function(t){t.data.dialog.draggableData.isMouseDown=!1}),t("body").on("mousemove",{dialog:this},function(t){var e=t.data.dialog;e.draggableData.isMouseDown&&e.getModalDialog().offset({top:t.clientY-e.draggableData.mouseOffset.top,left:t.clientX-e.draggableData.mouseOffset.left})})),this},realize:function(){return this.initModalStuff(),this.getModal().addClass(i.NAMESPACE).addClass(this.getCssClass()),this.updateSize(),this.getDescription()&&this.getModal().attr("aria-describedby",this.getDescription()),this.getModalFooter().append(this.createFooterContent()),this.getModalHeader().append(this.createHeaderContent()),this.getModalBody().append(this.createBodyContent()),this.getModal().data("bs.modal",new n(this.getModalForBootstrapDialogModal(),{backdrop:"static",keyboard:!1,show:!1})),this.makeModalDraggable(),this.handleModalEvents(),this.setRealized(!0),this.updateButtons(),this.updateType(),this.updateTitle(),this.updateMessage(),this.updateClosable(),this.updateAnimate(),this.updateSize(),this.updateTabindex(),this},open:function(){return!this.isRealized()&&this.realize(),this.getModal().modal("show"),this},close:function(){return!this.isRealized()&&this.realize(),this.getModal().modal("hide"),this}},i.prototype=t.extend(i.prototype,i.METHODS_TO_OVERRIDE[n.getModalVersion()]),i.newGuid=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=16*Math.random()|0,n="x"===t?e:3&e|8;return n.toString(16)})},i.show=function(t){return new i(t).open()},i.alert=function(){var e={},n={type:i.TYPE_PRIMARY,title:null,message:null,closable:!1,draggable:!1,buttonLabel:i.DEFAULT_TEXTS.OK,buttonHotkey:null,callback:null};e="object"==typeof arguments[0]&&arguments[0].constructor==={}.constructor?t.extend(!0,n,arguments[0]):t.extend(!0,n,{message:arguments[0],callback:"undefined"!=typeof arguments[1]?arguments[1]:null});var o=new i(e);return o.setData("callback",e.callback),o.addButton({label:e.buttonLabel,hotkey:e.buttonHotkey,action:function(t){return"function"==typeof t.getData("callback")&&t.getData("callback").call(this,!0)===!1?!1:(t.setData("btnClicked",!0),t.close())}}),"function"==typeof o.options.onhide?o.onHide(function(t){var e=!0;return!t.getData("btnClicked")&&t.isClosable()&&"function"==typeof t.getData("callback")&&(e=t.getData("callback")(!1)),e===!1?!1:e=this.onhide(t)}.bind({onhide:o.options.onhide})):o.onHide(function(t){var e=!0;return!t.getData("btnClicked")&&t.isClosable()&&"function"==typeof t.getData("callback")&&(e=t.getData("callback")(!1)),e}),o.open()},i.confirm=function(){var e={},n={type:i.TYPE_PRIMARY,title:null,message:null,closable:!1,draggable:!1,btnCancelLabel:i.DEFAULT_TEXTS.CANCEL,btnCancelClass:null,btnCancelHotkey:null,btnOKLabel:i.DEFAULT_TEXTS.OK,btnOKClass:null,btnOKHotkey:null,btnsOrder:i.defaultOptions.btnsOrder,callback:null};e="object"==typeof arguments[0]&&arguments[0].constructor==={}.constructor?t.extend(!0,n,arguments[0]):t.extend(!0,n,{message:arguments[0],callback:"undefined"!=typeof arguments[1]?arguments[1]:null}),null===e.btnOKClass&&(e.btnOKClass=["btn",e.type.split("-")[1]].join("-"));var o=new i(e);o.setData("callback",e.callback);var a=[{label:e.btnCancelLabel,cssClass:e.btnCancelClass,hotkey:e.btnCancelHotkey,action:function(t){return"function"==typeof t.getData("callback")&&t.getData("callback").call(this,!1)===!1?!1:t.close()}},{label:e.btnOKLabel,cssClass:e.btnOKClass,hotkey:e.btnOKHotkey,action:function(t){return"function"==typeof t.getData("callback")&&t.getData("callback").call(this,!0)===!1?!1:t.close()}}];return e.btnsOrder===i.BUTTONS_ORDER_OK_CANCEL&&a.reverse(),o.addButtons(a),o.open()},i.warning=function(t){return new i({type:i.TYPE_WARNING,message:t}).open()},i.danger=function(t){return new i({type:i.TYPE_DANGER,message:t}).open()},i.success=function(t){return new i({type:i.TYPE_SUCCESS,message:t}).open()},i});;;
/*!
 * @package   yii2-dialog
 * @author    Kartik Visweswaran <kartikv2@gmail.com>
 * @copyright Copyright &copy; Kartik Visweswaran, Krajee.com, 2014 - 2021
 * @version   1.0.6
 *
 * Override Yii confirmation dialog with Krajee Dialog.
 *
 * For more JQuery plugins visit http://plugins.krajee.com
 * For more Yii related demos visit http://demos.krajee.com
 */
var krajeeYiiConfirm;!function(){"use strict";krajeeYiiConfirm=function(i){i=i||"krajeeDialog";var n=window[i]||"";n&&(yii.confirm=function(i,o,r){n.confirm(i,function(i){i?!o||o():!r||r()})})}}();;;
/*!
 * @package   yii2-export
 * @author    Kartik Visweswaran <kartikv2@gmail.com>
 * @copyright Copyright &copy; Kartik Visweswaran, Krajee.com, 2015 - 2020
 * @version   1.4.1
 *
 * Export Data Validation Module.
 *
 */!function(e){"use strict";var t,o;t={DIALOG:"kvExportDialog",IFRAME:"kvExportIframe",TARGET_POPUP:"_popup",TARGET_IFRAME:"_iframe",isEmpty:function(t,o){return null===t||void 0===t||t===[]||""===t||o&&""===e.trim(t)},createPopup:function(e,t,o){var n=screen.width/2-t/2,a=60,r=window.open("",name,"",!0);return r.close(),window.open("",e,"toolbar=no, location=no, directories=no, status=yes, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width="+t+", height="+o+", top="+a+", left="+n)},createIframe:function(t){var o=e('iframe[name="'+t+'"]');return o.length?o:e("<iframe/>",{name:t,css:{display:"none"}}).appendTo("body")},popupTemplate:'<html style="display:table;width:100%;height:100%;"><title>Export Data - &copy; Krajee</title><body style="display:table-cell;font-family:Helvetica,Arial,sans-serif;color:#888;font-weight:bold;line-height:1.4em;text-align:center;vertical-align:middle;width:100%;height:100%;padding:0 10px;">{msg}</body></html>'},o=function(t,o){var n=this;n.$element=e(t),e.each(o,function(e,t){n[e]=t}),n.popup="",n.iframe="",n.listen()},o.prototype={constructor:o,listen:function(){var o=this;e(document).on("click.exportmenu","#"+o.$element.attr("id"),function(n){var a,r,p,i,s,l="",d=window[o.settings.dialogLib];return a=e(this).data("format"),n.preventDefault(),n.stopPropagation(),o.settings.showConfirmAlert?(r=o.settings.messages,p=t.isEmpty(o.alertMsg)?"":o.alertMsg,i=t.isEmpty(r.allowPopups)?"":r.allowPopups,s=t.isEmpty(r.confirmDownload)?"":r.confirmDownload,l=p.length&&i.length?p+"\n\n"+i:!p.length&&i.length?i:p.length&&!i.length?p:"",s.length&&(l=l+"\n\n"+s),t.isEmpty(l)?void o.processExport(a):void d.confirm(l,function(e){e&&o.processExport(a)})):void o.processExport(a)})},setPopupAlert:function(e){var o=this;if(o.popup.document)if(arguments.length&&arguments[1]){var n=o.popup.document.getElementsByTagName("body");setTimeout(function(){n[0].innerHTML=e},1800)}else{var a=t.popupTemplate.replace("{msg}",e);o.popup.document.write(a)}},processExport:function(o){var n,a,r,p,i,s,l=this,d=[],m=window.yii,u=l.settings,c=function(t,o){return e("<textarea/>",{name:t}).val(o).hide()};p=e.extend(!0,{},u.formOptions,{action:window.location.href,target:u.target,method:"post",css:{display:"none"}}),r=u.target===t.TARGET_POPUP,r&&(l.popup=t.createPopup(t.DIALOG,350,120),l.popup.focus(),l.setPopupAlert(l.settings.messages.downloadProgress),p.target=t.DIALOG),u.target===t.TARGET_IFRAME&&(l.iframe=t.createIframe(t.IFRAME),p.target=t.IFRAME),a=m?c(m.getCsrfParam()||"_csrf",m.getCsrfToken()||null):null,i="",t.isEmpty(u.colSelId)||(n=e("#"+u.colSelId).parent().find('input[name="export_columns_selector[]"]'),n.each(function(){var t=e(this);t.is(":checked")&&d.push(t.attr("data-key"))}),i=JSON.stringify(d)),s=e("<form/>",p).append(a).append(c(u.exportTypeParam,o),c(u.exportRequestParam,1)).append(c(u.exportColsParam,i),c(u.colSelFlagParam,u.colSelEnabled)).appendTo("body"),t.isEmpty(u.exportFormHiddenInputs)||e.each(u.exportFormHiddenInputs,function(t,o){var n={name:t,value:o.value||null,type:"hidden"};n=e.extend({},n,o.options||{}),s.append(e("<input/>",n))}),s.submit().remove(),r&&l.setPopupAlert(l.settings.messages.downloadComplete,!0)}},e.fn.exportdata=function(t){var n=Array.apply(null,arguments);return n.shift(),this.each(function(){var a=e(this),r=a.data("exportdata"),p="object"==typeof t&&t;r||a.data("exportdata",r=new o(this,e.extend({},e.fn.exportdata.defaults,p,e(this).data()))),"string"==typeof t&&r[t].apply(r,n)})},e.fn.exportdata.defaults={alertMsg:"",settings:{formOptions:{},exportType:"",colSelEnabled:"",exportRequestParam:"",exportTypeParam:"",exportColsParam:"",exportFormHiddenInputs:{},colSelId:null,target:"",showConfirmAlert:!0,dialogLib:"krajeeDialog",messages:{allowPopups:"",confirmDownload:"",downloadProgress:"",downloadComplete:""}}}}(window.jQuery);;;
/*!
 * @package   yii2-export
 * @author    Kartik Visweswaran <kartikv2@gmail.com>
 * @copyright Copyright &copy; Kartik Visweswaran, Krajee.com, 2015 - 2020
 * @version   1.4.1
 *
 * Export Columns Selector Validation Module.
 *
 */!function(t){"use strict";var n=function(n,o){var e=this;e.$element=t(n),e.options=o,e.listen()};n.prototype={constructor:n,listen:function(){var t=this,n=t.$element,o=n.find('input[name="export_columns_toggle"]');n.off("click").on("click",function(t){t.stopPropagation()}),o.off("change").on("change",function(){var t=o.is(":checked");n.find('input[name="export_columns_selector[]"]:not([disabled])').prop("checked",t)})}},t.fn.exportcolumns=function(o){var e=Array.apply(null,arguments);return e.shift(),this.each(function(){var c=t(this),i=c.data("exportcolumns"),s="object"==typeof o&&o;i||c.data("exportcolumns",i=new n(this,t.extend({},t.fn.exportcolumns.defaults,s,t(this).data()))),"string"==typeof o&&i[o].apply(i,e)})},t.fn.exportcolumns.defaults={}}(window.jQuery);;;(function($){$.fn.yiiGridView=function(method){if(methods[method]){return methods[method].apply(this,Array.prototype.slice.call(arguments,1));}else if(typeof method==='object'||!method){return methods.init.apply(this,arguments);}else{$.error('Method '+method+' does not exist in jQuery.yiiGridView');return false;}};var defaults={filterUrl:undefined,filterSelector:undefined,filterOnFocusOut:true};var gridData={};var gridEvents={beforeFilter:'beforeFilter',afterFilter:'afterFilter'};var gridEventHandlers={};var methods={init:function(options){return this.each(function(){var $e=$(this);var settings=$.extend({},defaults,options||{});var id=$e.attr('id');if(gridData[id]===undefined){gridData[id]={};}
gridData[id]=$.extend(gridData[id],{settings:settings});var filterEvents='change.yiiGridView keydown.yiiGridView';var enterPressed=false;initEventHandler($e,'filter',filterEvents,settings.filterSelector,function(event){if(event.type==='keydown'){if(event.keyCode!==13){return;}else{enterPressed=true;}}else{if(enterPressed){enterPressed=false;return;}}
if(!settings.filterOnFocusOut&&event.type!=='keydown'){return false;}
methods.applyFilter.apply($e);return false;});});},applyFilter:function(){var $grid=$(this);var settings=gridData[$grid.attr('id')].settings;var data={};$.each($(settings.filterSelector).serializeArray(),function(){if(!(this.name in data)){data[this.name]=[];}
data[this.name].push(this.value);});var namesInFilter=Object.keys(data);$.each(yii.getQueryParams(settings.filterUrl),function(name,value){if(namesInFilter.indexOf(name)===-1&&namesInFilter.indexOf(name.replace(/\[\d*\]$/,''))===-1){if(!$.isArray(value)){value=[value];}
if(!(name in data)){data[name]=value;}else{$.each(value,function(i,val){if($.inArray(val,data[name])){data[name].push(val);}});}}});var pos=settings.filterUrl.indexOf('?');var url=pos<0?settings.filterUrl:settings.filterUrl.substring(0,pos);var hashPos=settings.filterUrl.indexOf('#');if(pos>=0&&hashPos>=0){url+=settings.filterUrl.substring(hashPos);}
$grid.find('form.gridview-filter-form').remove();var $form=$('<form/>',{action:url,method:'get','class':'gridview-filter-form',style:'display:none','data-pjax':''}).appendTo($grid);$.each(data,function(name,values){$.each(values,function(index,value){$form.append($('<input/>').attr({type:'hidden',name:name,value:value}));});});var event=$.Event(gridEvents.beforeFilter);$grid.trigger(event);if(event.result===false){return;}
$form.submit();$grid.trigger(gridEvents.afterFilter);},setSelectionColumn:function(options){var $grid=$(this);var id=$(this).attr('id');if(gridData[id]===undefined){gridData[id]={};}
gridData[id].selectionColumn=options.name;if(!options.multiple||!options.checkAll){return;}
var checkAll="#"+id+" input[name='"+options.checkAll+"']";var inputs=options['class']?"input."+options['class']:"input[name='"+options.name+"']";var inputsEnabled="#"+id+" "+inputs+":enabled";initEventHandler($grid,'checkAllRows','click.yiiGridView',checkAll,function(){$grid.find(inputs+":enabled").prop('checked',this.checked).change();});initEventHandler($grid,'checkRow','click.yiiGridView',inputsEnabled,function(){var all=$grid.find(inputs).length==$grid.find(inputs+":checked").length;$grid.find("input[name='"+options.checkAll+"']").prop('checked',all).change();});},getSelectedRows:function(){var $grid=$(this);var data=gridData[$grid.attr('id')];var keys=[];if(data.selectionColumn){$grid.find("input[name='"+data.selectionColumn+"']:checked").each(function(){keys.push($(this).parent().closest('tr').data('key'));});}
return keys;},destroy:function(){var events=['.yiiGridView',gridEvents.beforeFilter,gridEvents.afterFilter].join(' ');this.off(events);var id=$(this).attr('id');$.each(gridEventHandlers[id],function(type,data){$(document).off(data.event,data.selector);});delete gridData[id];return this;},data:function(){var id=$(this).attr('id');return gridData[id];}};function initEventHandler($gridView,type,event,selector,callback){var id=$gridView.attr('id');var prevHandler=gridEventHandlers[id];if(prevHandler!==undefined&&prevHandler[type]!==undefined){var data=prevHandler[type];$(document).off(data.event,data.selector);}
if(prevHandler===undefined){gridEventHandlers[id]={};}
$(document).on(event,selector,callback);gridEventHandlers[id][type]={event:event,selector:selector};}})(window.jQuery);;;
/*!
 * @package   yii2-grid
 * @author    Kartik Visweswaran <kartikv2@gmail.com>
 * @copyright Copyright &copy; Kartik Visweswaran, Krajee.com, 2014 - 2021
 * @version   3.3.6
 *
 * Grid Export Validation Module for Yii's Gridview. Supports export of
 * grid data as CSV, HTML, or Excel.
 *
 * Author: Kartik Visweswaran
 * Copyright: 2014 - 2021, Kartik Visweswaran, Krajee.com
 * For more JQuery plugins visit http://plugins.krajee.com
 * For more Yii related demos visit http://demos.krajee.com
 */!function(e){"use strict";var t,o,n="urn:schemas-microsoft-com:office:",r="http://www.w3.org/TR/REC-html40";t={replaceAll:function(e,t,o){return e.split(t).join(o)},isEmpty:function(t,o){return null===t||void 0===t||0===t.length||o&&""===e.trim(t)},popupDialog:function(e,t,o,n){var r=screen.width/2-o/2,i=60,a=window.open("",t,"",!0);return a.close(),window.open(e,t,"toolbar=no, location=no, directories=no, status=yes, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width="+o+", height="+n+", top="+i+", left="+r)},slug:function(e){return e.toLowerCase().replace(/[^\w ]+/g,"").replace(/ +/g,"-")},templates:{html:'<!DOCTYPE html><meta http-equiv="Content-Type" content="text/html;charset={encoding}"/><meta http-equiv="X-UA-Compatible" content="IE=edge;chrome=1"/>{css}<style>.kv-wrap{padding:20px}</style><body class="kv-wrap">{data}</body>',pdf:"{before}\n{data}\n{after}",excel:'<html xmlns:o="'+n+'office" xmlns:x="'+n+'excel" xmlns="'+r+'"><head><meta http-equiv="Content-Type" content="text/html;charset={encoding}"/>{css}<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>{data}</body></html>',popup:'<html style="display:table;width:100%;height:100%;"><title>Grid Export - &copy; Krajee</title><body style="display:table-cell;font-family:Helvetica,Arial,sans-serif;color:#888;font-weight:bold;line-height:1.4em;text-align:center;vertical-align:middle;width:100%;height:100%;padding:0 10px;">{msg}</body></html>'}},o=function(t,o){var n=this,r=o.gridOpts,i=o.genOpts;n.$element=e(t),n.gridId=r.gridId,n.$grid=e("#"+n.gridId),n.dialogLib=o.dialogLib,n.messages=r.messages,n.target=r.target,n.exportConversions=r.exportConversions,n.skipExportElements=r.skipExportElements,n.showConfirmAlert=r.showConfirmAlert,n.action=r.action,n.bom=r.bom,n.encoding=r.encoding,n.module=r.module,n.filename=i.filename,n.expHash=i.expHash,n.showHeader=i.showHeader,n.showFooter=i.showFooter,n.showPageSummary=i.showPageSummary,n.$table=n.$grid.find(".kv-grid-table:first"),n.columns=n.showHeader?"td,th":"td",n.alertMsg=o.alertMsg,n.config=o.config,n.popup="",n.listen()},o.prototype={constructor:o,getArray:function(o){var n=this,r=n.clean(o),i=[],a={};return void 0!==n.config.colHeads&&n.config.colHeads.length>0?i=n.config.colHeads:r.find("thead tr th").each(function(o){var r=e(this).text().trim(),a=t.slug(r);i[o]=!n.config.slugColHeads||t.isEmpty(a)?"col_"+o:a}),r.find('tbody tr:has("td")').each(function(t){a[t]={},e(this).children("td").each(function(o){var n=i[o];a[t][n]=e(this).text().trim()})}),a},setPopupAlert:function(e){var o=this;if(void 0!==o.popup.document)if(arguments.length&&arguments[1]){var n=o.popup.document.getElementsByTagName("body");setTimeout(function(){n[0].innerHTML=e},1200)}else{var r=t.templates.popup.replace("{msg}",e);o.popup.document.write(r)}},processExport:function(e,o){var n=this;setTimeout(function(){t.isEmpty(o)?n[e]():n[e](o)},100)},listenClick:function(e){var o=this,n=arguments.length>1?arguments[1]:"",r=window[o.dialogLib];o.$element.off("click.gridexport").on("click.gridexport",function(i){if(i.stopPropagation(),i.preventDefault(),!o.showConfirmAlert)return void o.processExport(e,n);var a=o.messages,s=t.isEmpty(o.alertMsg)?"":o.alertMsg,l=t.isEmpty(a.allowPopups)?"":a.allowPopups,c=t.isEmpty(a.confirmDownload)?"":a.confirmDownload,p="";return p=s.length&&l.length?s+"\n\n"+l:!s.length&&l.length?l:s.length&&!l.length?s:"",c.length&&(p=p+"\n\n"+c),t.isEmpty(p)?void 0:(r.confirm(p,function(t){t&&o.processExport(e,n),i.preventDefault()}),!1)})},listen:function(){var e=this;e.$element.hasClass("export-csv")&&e.listenClick("exportTEXT","csv"),e.$element.hasClass("export-txt")&&e.listenClick("exportTEXT","txt"),e.$element.hasClass("export-html")&&e.listenClick("exportHTML"),e.$element.hasClass("export-xls")&&e.listenClick("exportEXCEL"),e.$element.hasClass("export-json")&&e.listenClick("exportJSON"),e.$element.hasClass("export-pdf")&&e.listenClick("exportPDF")},clean:function(t){var o,n=this,r=n.$table.clone(),i=n.$element.data("cssStyles")||{},a=n.$table.closest(".kv-grid-container"),s=n.skipExportElements,l=function(e){r.find(e+"."+n.gridId).remove()};s.length&&e.each(s,function(e,t){r.find(t).remove()}),"html"===t&&r.find(".kv-grid-boolean").remove(),o=a.hasClass("kv-grid-wrapper")?a.closest(".floatThead-wrapper").find(".kv-thead-float thead"):a.find(".kv-thead-float thead"),o.length&&(o=o.clone(),r.find("thead").before(o).remove()),r.find("tr.filters").remove(),r.find("th").removeAttr("rowspan"),r.find("th").find("a").each(function(){e(this).contents().unwrap()}),r.find("form,input,textarea,select,script").remove(),r.find("[onclick]").removeAttr("onclick"),r.find('a[href*="javascript"]').attr("href","#"),n.showHeader||r.children("thead").remove(),n.showPageSummary||l(".kv-page-summary-container"),n.showFooter||l(".kv-footer-container"),n.showCaption||l(".kv-caption-container"),r.find(".skip-export").remove(),r.find(".skip-export-"+t).remove(),r.find(".strip-tags-export").each(function(){var t=e(this),o=t.text();t.html(o)});var c=r.html();return c=n.preProcess(c,t),r.html(c),e.each(i,function(t,o){r.find(t).each(function(){var t=e(this),n=t.attr("style")||"";e.each(o,function(e,t){n+=e+":"+t+";"}),n&&t.attr("style",n)})}),r},preProcess:function(e,o){var n,r,i,a=this,s=a.exportConversions,l=s.length,c=e,p="from_"+o,d="to_"+o;if(l>0)for(var f=0;l>f;f++)n=s[f],r=void 0!==n[p]?n[p]:void 0!==n.from?n.from:"",i=void 0!==n[d]?n[d]:void 0!==n.to?n.to:"",r.length&&i.length&&(c=t.replaceAll(c,r,i));return c},download:function(o,n){var r,i,a=this,s=a.$element,l=s.attr("data-mime")||"text/plain",c=window.yii,p=s.attr("data-hash")||"",d=s.attr("data-hash-export-config"),f=t.isEmpty(a.config)?{}:a.config,h=a.target,m=function(t,o){return e("<textarea/>",{name:t}).val(o).hide()};"json"===o&&f.jsonReplacer&&delete f.jsonReplacer,r=c?m(c.getCsrfParam()||"_csrf",c.getCsrfToken()||null):null,i="_popup"===h,i&&(h="kvDownloadDialog",a.popup=t.popupDialog("",h,350,120),a.popup.focus(),a.setPopupAlert(a.messages.downloadProgress)),e("<form/>",{action:a.action,target:h,method:"post",css:{display:"none"}}).append(m("export_filetype",o),m("export_filename",a.filename)).append(m("export_encoding",a.encoding),m("export_bom",a.bom?1:0)).append(m("export_content",n),m("module_id",a.module),r).append(m("export_mime",l),m("export_hash",p),m("hash_export_config",d)).append(m("export_config",JSON.stringify(f))).appendTo("body").submit().remove(),i&&a.setPopupAlert(a.messages.downloadComplete,!0)},exportHTML:function(){var o,n=this,r=n.clean("html"),i=n.config,a=i.cssFile?i.cssFile:[],s="";o=t.templates.html.replace("{encoding}",n.encoding),e.each(a,function(e,t){s+='<link href="'+t+'" rel="stylesheet" crossorigin="anonymous">\n'}),o=o.replace("{css}",s).replace("{data}",e("<div />").html(r).html()),n.download("html",o)},exportPDF:function(){var o=this,n=o.clean("pdf"),r=t.isEmpty(o.config.contentBefore)?"":o.config.contentBefore,i=t.isEmpty(o.config.contentAfter)?"":o.config.contentAfter,a=o.config.css,s=t.templates.pdf.replace("{css}",a).replace("{before}",r).replace("{after}",i).replace("{data}",e("<div />").html(n).html());o.download("pdf",s)},exportTEXT:function(t){var o=this,n=o.clean(t),r=n.find("tr:has("+o.columns+")"),i=String.fromCharCode(11),a=String.fromCharCode(0),s='"'+o.config.colDelimiter+'"',l='"'+o.config.rowDelimiter+'"',c='"'+r.map(function(t,n){var r=e(n),a=r.find(o.columns);return a.map(function(t,o){var n=e(o),r=n.text().trim();return r.replace(/"/g,'""')}).get().join(i)}).get().join(a).split(a).join(l).split(i).join(s)+'"';o.download(t,c)},exportJSON:function(){var e=this,t=e.getArray("json");t=JSON.stringify(t,e.config.jsonReplacer,e.config.indentSpace),e.download("json",t)},exportEXCEL:function(){var o,n,r=this,i=r.clean("xls"),a=r.config,s=a.cssFile&&r.config.cssFile.length?'<link href="'+r.config.cssFile+'" rel="stylesheet">':"";i.find("td[data-raw-value]").each(function(){n=e(this),(n.css("mso-number-format")||0===n.css("mso-number-format")||"0"===n.css("mso-number-format"))&&n.html(n.attr("data-raw-value")).removeAttr("data-raw-value")}),o=t.templates.excel.replace("{encoding}",r.encoding).replace("{css}",s).replace("{worksheet}",r.config.worksheet).replace("{data}",e("<div />").html(i).html()).replace(/"/g,"'"),r.download("xls",o)}},e.fn.gridexport=function(t){var n=Array.apply(null,arguments);return n.shift(),this.each(function(){var r=e(this),i=r.data("gridexport"),a="object"==typeof t&&t;i||r.data("gridexport",i=new o(this,e.extend({},e.fn.gridexport.defaults,a,e(this).data()))),"string"==typeof t&&i[t].apply(i,n)})},e.fn.gridexport.defaults={dialogLib:"krajeeDialog"},e.fn.gridexport.Constructor=o}(window.jQuery);;;var __bind=function(a,b){return function(){return a.apply(b,arguments)}},__slice=[].slice;!function(a,b){var c,d,e,f;return d=function(a){return parseFloat(a.style.width.replace("%",""))},f=function(a,b){return b=b.toFixed(2),b=b>0?b:0,a.style.width=""+b+"%"},e=function(a){return 0===a.type.indexOf("touch")?(a.originalEvent.touches[0]||a.originalEvent.changedTouches[0]).pageX:a.pageX},c=function(){function c(c,d){this.pointerdown=__bind(this.pointerdown,this),this.constrainWidth=__bind(this.constrainWidth,this),this.options=a.extend({},this.defaults,d),this.$table=c,this.setHeaders(),this.restoreColumnWidths(),this.syncHandleWidths(),a(b).on("resize.rc",function(a){return function(){return a.syncHandleWidths()}}(this)),this.options.start&&this.$table.bind("column:resize:start.rc",this.options.start),this.options.resize&&this.$table.bind("column:resize.rc",this.options.resize),this.options.stop&&this.$table.bind("column:resize:stop.rc",this.options.stop)}return c.prototype.defaults={selector:"tr th:visible",store:b.store,syncHandlers:!0,resizeFromBody:!0,maxWidth:null,minWidth:null},c.prototype.triggerEvent=function(b,c,d){var e;return e=a.Event(b),e.originalEvent=a.extend({},d),this.$table.trigger(e,[this].concat(c||[]))},c.prototype.getColumnId=function(a){return this.$table.data("resizable-columns-id")+"-"+a.data("resizable-column-id")},c.prototype.setHeaders=function(){return this.$tableHeaders=this.$table.find(this.options.selector),this.assignPercentageWidths(),this.createHandles()},c.prototype.destroy=function(){return this.$handleContainer.remove(),this.$table.removeData("resizableColumns"),this.$table.add(b).off(".rc")},c.prototype.assignPercentageWidths=function(){return this.$tableHeaders.each(function(b){return function(c,d){var e;return e=a(d),f(e[0],e.outerWidth()/b.$table.width()*100)}}(this))},c.prototype.createHandles=function(){var b;return null!=(b=this.$handleContainer)&&b.remove(),this.$table.before(this.$handleContainer=a("<div class='rc-handle-container' />")),this.$tableHeaders.each(function(b){return function(c,d){var e;if(0!==b.$tableHeaders.eq(c+1).length&&null==b.$tableHeaders.eq(c).attr("data-noresize")&&null==b.$tableHeaders.eq(c+1).attr("data-noresize"))return e=a("<div class='rc-handle' />"),e.data("th",a(d)),e.appendTo(b.$handleContainer)}}(this)),this.$handleContainer.on("mousedown touchstart",".rc-handle",this.pointerdown)},c.prototype.syncHandleWidths=function(){return this.$handleContainer.width(this.$table.width()).find(".rc-handle").each(function(b){return function(c,d){var e;return e=a(d),e.css({left:e.data("th").outerWidth()+(e.data("th").offset().left-b.$handleContainer.offset().left),height:b.options.resizeFromBody?b.$table.height():b.$table.find("thead").height()})}}(this))},c.prototype.saveColumnWidths=function(){return this.$tableHeaders.each(function(b){return function(c,e){var f;return f=a(e),null==f.attr("data-noresize")&&null!=b.options.store?b.options.store.set(b.getColumnId(f),d(f[0])):void 0}}(this))},c.prototype.restoreColumnWidths=function(){return this.$tableHeaders.each(function(b){return function(c,d){var e,g;return e=a(d),null!=b.options.store&&(g=b.options.store.get(b.getColumnId(e)))?f(e[0],g):void 0}}(this))},c.prototype.totalColumnWidths=function(){var b;return b=0,this.$tableHeaders.each(function(){return function(c,d){return b+=parseFloat(a(d)[0].style.width.replace("%",""))}}(this)),b},c.prototype.constrainWidth=function(a){return null!=this.options.minWidth&&(a=Math.max(this.options.minWidth,a)),null!=this.options.maxWidth&&(a=Math.min(this.options.maxWidth,a)),a},c.prototype.pointerdown=function(b){var c,g,h,i,j,k,l;return b.preventDefault(),h=a(b.currentTarget.ownerDocument),k=e(b),c=a(b.currentTarget),g=c.data("th"),i=this.$tableHeaders.eq(this.$tableHeaders.index(g)+1),l={left:d(g[0]),right:d(i[0])},j={left:l.left,right:l.right},this.$handleContainer.add(this.$table).addClass("rc-table-resizing"),g.add(i).add(c).addClass("rc-column-resizing"),this.triggerEvent("column:resize:start",[g,i,j.left,j.right],b),h.on("mousemove.rc touchmove.rc",function(a){return function(b){var c;return c=(e(b)-k)/a.$table.width()*100,f(g[0],j.left=a.constrainWidth(l.left+c)),f(i[0],j.right=a.constrainWidth(l.right-c)),null!=a.options.syncHandlers&&a.syncHandleWidths(),a.triggerEvent("column:resize",[g,i,j.left,j.right],b)}}(this)),h.one("mouseup touchend",function(a){return function(){return h.off("mousemove.rc touchmove.rc"),a.$handleContainer.add(a.$table).removeClass("rc-table-resizing"),g.add(i).add(c).removeClass("rc-column-resizing"),a.syncHandleWidths(),a.saveColumnWidths(),a.triggerEvent("column:resize:stop",[g,i,j.left,j.right],b)}}(this))},c}(),a.fn.extend({resizableColumns:function(){var b,d;return d=arguments[0],b=2<=arguments.length?__slice.call(arguments,1):[],this.each(function(){var e,f;return e=a(this),f=e.data("resizableColumns"),f||e.data("resizableColumns",f=new c(e,d)),"string"==typeof d?f[d].apply(f,b):void 0})}})}(window.jQuery,window);;;
/*! Select2 4.0.13 | https://github.com/select2/select2/blob/master/LICENSE.md */!function(n){"function"==typeof define&&define.amd?define(["jquery"],n):"object"==typeof module&&module.exports?module.exports=function(e,t){return void 0===t&&(t="undefined"!=typeof window?require("jquery"):require("jquery")(e)),n(t),t}:n(jQuery)}(function(d){var e=function(){if(d&&d.fn&&d.fn.select2&&d.fn.select2.amd)var e=d.fn.select2.amd;var t,n,i,h,o,s,f,g,m,v,y,_,r,a,w,l;function b(e,t){return r.call(e,t)}function c(e,t){var n,i,r,o,s,a,l,c,u,d,p,h=t&&t.split("/"),f=y.map,g=f&&f["*"]||{};if(e){for(s=(e=e.split("/")).length-1,y.nodeIdCompat&&w.test(e[s])&&(e[s]=e[s].replace(w,"")),"."===e[0].charAt(0)&&h&&(e=h.slice(0,h.length-1).concat(e)),u=0;u<e.length;u++)if("."===(p=e[u]))e.splice(u,1),u-=1;else if(".."===p){if(0===u||1===u&&".."===e[2]||".."===e[u-1])continue;0<u&&(e.splice(u-1,2),u-=2)}e=e.join("/")}if((h||g)&&f){for(u=(n=e.split("/")).length;0<u;u-=1){if(i=n.slice(0,u).join("/"),h)for(d=h.length;0<d;d-=1)if(r=(r=f[h.slice(0,d).join("/")])&&r[i]){o=r,a=u;break}if(o)break;!l&&g&&g[i]&&(l=g[i],c=u)}!o&&l&&(o=l,a=c),o&&(n.splice(0,a,o),e=n.join("/"))}return e}function A(t,n){return function(){var e=a.call(arguments,0);return"string"!=typeof e[0]&&1===e.length&&e.push(null),s.apply(h,e.concat([t,n]))}}function x(t){return function(e){m[t]=e}}function D(e){if(b(v,e)){var t=v[e];delete v[e],_[e]=!0,o.apply(h,t)}if(!b(m,e)&&!b(_,e))throw new Error("No "+e);return m[e]}function u(e){var t,n=e?e.indexOf("!"):-1;return-1<n&&(t=e.substring(0,n),e=e.substring(n+1,e.length)),[t,e]}function S(e){return e?u(e):[]}return e&&e.requirejs||(e?n=e:e={},m={},v={},y={},_={},r=Object.prototype.hasOwnProperty,a=[].slice,w=/\.js$/,f=function(e,t){var n,i=u(e),r=i[0],o=t[1];return e=i[1],r&&(n=D(r=c(r,o))),r?e=n&&n.normalize?n.normalize(e,function(t){return function(e){return c(e,t)}}(o)):c(e,o):(r=(i=u(e=c(e,o)))[0],e=i[1],r&&(n=D(r))),{f:r?r+"!"+e:e,n:e,pr:r,p:n}},g={require:function(e){return A(e)},exports:function(e){var t=m[e];return void 0!==t?t:m[e]={}},module:function(e){return{id:e,uri:"",exports:m[e],config:function(e){return function(){return y&&y.config&&y.config[e]||{}}}(e)}}},o=function(e,t,n,i){var r,o,s,a,l,c,u,d=[],p=typeof n;if(c=S(i=i||e),"undefined"==p||"function"==p){for(t=!t.length&&n.length?["require","exports","module"]:t,l=0;l<t.length;l+=1)if("require"===(o=(a=f(t[l],c)).f))d[l]=g.require(e);else if("exports"===o)d[l]=g.exports(e),u=!0;else if("module"===o)r=d[l]=g.module(e);else if(b(m,o)||b(v,o)||b(_,o))d[l]=D(o);else{if(!a.p)throw new Error(e+" missing "+o);a.p.load(a.n,A(i,!0),x(o),{}),d[l]=m[o]}s=n?n.apply(m[e],d):void 0,e&&(r&&r.exports!==h&&r.exports!==m[e]?m[e]=r.exports:s===h&&u||(m[e]=s))}else e&&(m[e]=n)},t=n=s=function(e,t,n,i,r){if("string"==typeof e)return g[e]?g[e](t):D(f(e,S(t)).f);if(!e.splice){if((y=e).deps&&s(y.deps,y.callback),!t)return;t.splice?(e=t,t=n,n=null):e=h}return t=t||function(){},"function"==typeof n&&(n=i,i=r),i?o(h,e,t,n):setTimeout(function(){o(h,e,t,n)},4),s},s.config=function(e){return s(e)},t._defined=m,(i=function(e,t,n){if("string"!=typeof e)throw new Error("See almond README: incorrect module build, no module name");t.splice||(n=t,t=[]),b(m,e)||b(v,e)||(v[e]=[e,t,n])}).amd={jQuery:!0},e.requirejs=t,e.require=n,e.define=i),e.define("almond",function(){}),e.define("jquery",[],function(){var e=d||$;return null==e&&console&&console.error&&console.error("Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."),e}),e.define("select2/utils",["jquery"],function(o){var r={};function u(e){var t=e.prototype,n=[];for(var i in t){"function"==typeof t[i]&&"constructor"!==i&&n.push(i)}return n}r.Extend=function(e,t){var n={}.hasOwnProperty;function i(){this.constructor=e}for(var r in t)n.call(t,r)&&(e[r]=t[r]);return i.prototype=t.prototype,e.prototype=new i,e.__super__=t.prototype,e},r.Decorate=function(i,r){var e=u(r),t=u(i);function o(){var e=Array.prototype.unshift,t=r.prototype.constructor.length,n=i.prototype.constructor;0<t&&(e.call(arguments,i.prototype.constructor),n=r.prototype.constructor),n.apply(this,arguments)}r.displayName=i.displayName,o.prototype=new function(){this.constructor=o};for(var n=0;n<t.length;n++){var s=t[n];o.prototype[s]=i.prototype[s]}function a(e){var t=function(){};e in o.prototype&&(t=o.prototype[e]);var n=r.prototype[e];return function(){return Array.prototype.unshift.call(arguments,t),n.apply(this,arguments)}}for(var l=0;l<e.length;l++){var c=e[l];o.prototype[c]=a(c)}return o};function e(){this.listeners={}}e.prototype.on=function(e,t){this.listeners=this.listeners||{},e in this.listeners?this.listeners[e].push(t):this.listeners[e]=[t]},e.prototype.trigger=function(e){var t=Array.prototype.slice,n=t.call(arguments,1);this.listeners=this.listeners||{},null==n&&(n=[]),0===n.length&&n.push({}),(n[0]._type=e)in this.listeners&&this.invoke(this.listeners[e],t.call(arguments,1)),"*"in this.listeners&&this.invoke(this.listeners["*"],arguments)},e.prototype.invoke=function(e,t){for(var n=0,i=e.length;n<i;n++)e[n].apply(this,t)},r.Observable=e,r.generateChars=function(e){for(var t="",n=0;n<e;n++){t+=Math.floor(36*Math.random()).toString(36)}return t},r.bind=function(e,t){return function(){e.apply(t,arguments)}},r._convertData=function(e){for(var t in e){var n=t.split("-"),i=e;if(1!==n.length){for(var r=0;r<n.length;r++){var o=n[r];(o=o.substring(0,1).toLowerCase()+o.substring(1))in i||(i[o]={}),r==n.length-1&&(i[o]=e[t]),i=i[o]}delete e[t]}}return e},r.hasScroll=function(e,t){var n=o(t),i=t.style.overflowX,r=t.style.overflowY;return(i!==r||"hidden"!==r&&"visible"!==r)&&("scroll"===i||"scroll"===r||(n.innerHeight()<t.scrollHeight||n.innerWidth()<t.scrollWidth))},r.escapeMarkup=function(e){var t={"\\":"&#92;","&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#47;"};return"string"!=typeof e?e:String(e).replace(/[&<>"'\/\\]/g,function(e){return t[e]})},r.appendMany=function(e,t){if("1.7"===o.fn.jquery.substr(0,3)){var n=o();o.map(t,function(e){n=n.add(e)}),t=n}e.append(t)},r.__cache={};var n=0;return r.GetUniqueElementId=function(e){var t=e.getAttribute("data-select2-id");return null==t&&(e.id?(t=e.id,e.setAttribute("data-select2-id",t)):(e.setAttribute("data-select2-id",++n),t=n.toString())),t},r.StoreData=function(e,t,n){var i=r.GetUniqueElementId(e);r.__cache[i]||(r.__cache[i]={}),r.__cache[i][t]=n},r.GetData=function(e,t){var n=r.GetUniqueElementId(e);return t?r.__cache[n]&&null!=r.__cache[n][t]?r.__cache[n][t]:o(e).data(t):r.__cache[n]},r.RemoveData=function(e){var t=r.GetUniqueElementId(e);null!=r.__cache[t]&&delete r.__cache[t],e.removeAttribute("data-select2-id")},r}),e.define("select2/results",["jquery","./utils"],function(h,f){function i(e,t,n){this.$element=e,this.data=n,this.options=t,i.__super__.constructor.call(this)}return f.Extend(i,f.Observable),i.prototype.render=function(){var e=h('<ul class="select2-results__options" role="listbox"></ul>');return this.options.get("multiple")&&e.attr("aria-multiselectable","true"),this.$results=e},i.prototype.clear=function(){this.$results.empty()},i.prototype.displayMessage=function(e){var t=this.options.get("escapeMarkup");this.clear(),this.hideLoading();var n=h('<li role="alert" aria-live="assertive" class="select2-results__option"></li>'),i=this.options.get("translations").get(e.message);n.append(t(i(e.args))),n[0].className+=" select2-results__message",this.$results.append(n)},i.prototype.hideMessages=function(){this.$results.find(".select2-results__message").remove()},i.prototype.append=function(e){this.hideLoading();var t=[];if(null!=e.results&&0!==e.results.length){e.results=this.sort(e.results);for(var n=0;n<e.results.length;n++){var i=e.results[n],r=this.option(i);t.push(r)}this.$results.append(t)}else 0===this.$results.children().length&&this.trigger("results:message",{message:"noResults"})},i.prototype.position=function(e,t){t.find(".select2-results").append(e)},i.prototype.sort=function(e){return this.options.get("sorter")(e)},i.prototype.highlightFirstItem=function(){var e=this.$results.find(".select2-results__option[aria-selected]"),t=e.filter("[aria-selected=true]");0<t.length?t.first().trigger("mouseenter"):e.first().trigger("mouseenter"),this.ensureHighlightVisible()},i.prototype.setClasses=function(){var t=this;this.data.current(function(e){var i=h.map(e,function(e){return e.id.toString()});t.$results.find(".select2-results__option[aria-selected]").each(function(){var e=h(this),t=f.GetData(this,"data"),n=""+t.id;null!=t.element&&t.element.selected||null==t.element&&-1<h.inArray(n,i)?e.attr("aria-selected","true"):e.attr("aria-selected","false")})})},i.prototype.showLoading=function(e){this.hideLoading();var t={disabled:!0,loading:!0,text:this.options.get("translations").get("searching")(e)},n=this.option(t);n.className+=" loading-results",this.$results.prepend(n)},i.prototype.hideLoading=function(){this.$results.find(".loading-results").remove()},i.prototype.option=function(e){var t=document.createElement("li");t.className="select2-results__option";var n={role:"option","aria-selected":"false"},i=window.Element.prototype.matches||window.Element.prototype.msMatchesSelector||window.Element.prototype.webkitMatchesSelector;for(var r in(null!=e.element&&i.call(e.element,":disabled")||null==e.element&&e.disabled)&&(delete n["aria-selected"],n["aria-disabled"]="true"),null==e.id&&delete n["aria-selected"],null!=e._resultId&&(t.id=e._resultId),e.title&&(t.title=e.title),e.children&&(n.role="group",n["aria-label"]=e.text,delete n["aria-selected"]),n){var o=n[r];t.setAttribute(r,o)}if(e.children){var s=h(t),a=document.createElement("strong");a.className="select2-results__group";h(a);this.template(e,a);for(var l=[],c=0;c<e.children.length;c++){var u=e.children[c],d=this.option(u);l.push(d)}var p=h("<ul></ul>",{class:"select2-results__options select2-results__options--nested"});p.append(l),s.append(a),s.append(p)}else this.template(e,t);return f.StoreData(t,"data",e),t},i.prototype.bind=function(t,e){var l=this,n=t.id+"-results";this.$results.attr("id",n),t.on("results:all",function(e){l.clear(),l.append(e.data),t.isOpen()&&(l.setClasses(),l.highlightFirstItem())}),t.on("results:append",function(e){l.append(e.data),t.isOpen()&&l.setClasses()}),t.on("query",function(e){l.hideMessages(),l.showLoading(e)}),t.on("select",function(){t.isOpen()&&(l.setClasses(),l.options.get("scrollAfterSelect")&&l.highlightFirstItem())}),t.on("unselect",function(){t.isOpen()&&(l.setClasses(),l.options.get("scrollAfterSelect")&&l.highlightFirstItem())}),t.on("open",function(){l.$results.attr("aria-expanded","true"),l.$results.attr("aria-hidden","false"),l.setClasses(),l.ensureHighlightVisible()}),t.on("close",function(){l.$results.attr("aria-expanded","false"),l.$results.attr("aria-hidden","true"),l.$results.removeAttr("aria-activedescendant")}),t.on("results:toggle",function(){var e=l.getHighlightedResults();0!==e.length&&e.trigger("mouseup")}),t.on("results:select",function(){var e=l.getHighlightedResults();if(0!==e.length){var t=f.GetData(e[0],"data");"true"==e.attr("aria-selected")?l.trigger("close",{}):l.trigger("select",{data:t})}}),t.on("results:previous",function(){var e=l.getHighlightedResults(),t=l.$results.find("[aria-selected]"),n=t.index(e);if(!(n<=0)){var i=n-1;0===e.length&&(i=0);var r=t.eq(i);r.trigger("mouseenter");var o=l.$results.offset().top,s=r.offset().top,a=l.$results.scrollTop()+(s-o);0===i?l.$results.scrollTop(0):s-o<0&&l.$results.scrollTop(a)}}),t.on("results:next",function(){var e=l.getHighlightedResults(),t=l.$results.find("[aria-selected]"),n=t.index(e)+1;if(!(n>=t.length)){var i=t.eq(n);i.trigger("mouseenter");var r=l.$results.offset().top+l.$results.outerHeight(!1),o=i.offset().top+i.outerHeight(!1),s=l.$results.scrollTop()+o-r;0===n?l.$results.scrollTop(0):r<o&&l.$results.scrollTop(s)}}),t.on("results:focus",function(e){e.element.addClass("select2-results__option--highlighted")}),t.on("results:message",function(e){l.displayMessage(e)}),h.fn.mousewheel&&this.$results.on("mousewheel",function(e){var t=l.$results.scrollTop(),n=l.$results.get(0).scrollHeight-t+e.deltaY,i=0<e.deltaY&&t-e.deltaY<=0,r=e.deltaY<0&&n<=l.$results.height();i?(l.$results.scrollTop(0),e.preventDefault(),e.stopPropagation()):r&&(l.$results.scrollTop(l.$results.get(0).scrollHeight-l.$results.height()),e.preventDefault(),e.stopPropagation())}),this.$results.on("mouseup",".select2-results__option[aria-selected]",function(e){var t=h(this),n=f.GetData(this,"data");"true"!==t.attr("aria-selected")?l.trigger("select",{originalEvent:e,data:n}):l.options.get("multiple")?l.trigger("unselect",{originalEvent:e,data:n}):l.trigger("close",{})}),this.$results.on("mouseenter",".select2-results__option[aria-selected]",function(e){var t=f.GetData(this,"data");l.getHighlightedResults().removeClass("select2-results__option--highlighted"),l.trigger("results:focus",{data:t,element:h(this)})})},i.prototype.getHighlightedResults=function(){return this.$results.find(".select2-results__option--highlighted")},i.prototype.destroy=function(){this.$results.remove()},i.prototype.ensureHighlightVisible=function(){var e=this.getHighlightedResults();if(0!==e.length){var t=this.$results.find("[aria-selected]").index(e),n=this.$results.offset().top,i=e.offset().top,r=this.$results.scrollTop()+(i-n),o=i-n;r-=2*e.outerHeight(!1),t<=2?this.$results.scrollTop(0):(o>this.$results.outerHeight()||o<0)&&this.$results.scrollTop(r)}},i.prototype.template=function(e,t){var n=this.options.get("templateResult"),i=this.options.get("escapeMarkup"),r=n(e,t);null==r?t.style.display="none":"string"==typeof r?t.innerHTML=i(r):h(t).append(r)},i}),e.define("select2/keys",[],function(){return{BACKSPACE:8,TAB:9,ENTER:13,SHIFT:16,CTRL:17,ALT:18,ESC:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,DELETE:46}}),e.define("select2/selection/base",["jquery","../utils","../keys"],function(n,i,r){function o(e,t){this.$element=e,this.options=t,o.__super__.constructor.call(this)}return i.Extend(o,i.Observable),o.prototype.render=function(){var e=n('<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>');return this._tabindex=0,null!=i.GetData(this.$element[0],"old-tabindex")?this._tabindex=i.GetData(this.$element[0],"old-tabindex"):null!=this.$element.attr("tabindex")&&(this._tabindex=this.$element.attr("tabindex")),e.attr("title",this.$element.attr("title")),e.attr("tabindex",this._tabindex),e.attr("aria-disabled","false"),this.$selection=e},o.prototype.bind=function(e,t){var n=this,i=e.id+"-results";this.container=e,this.$selection.on("focus",function(e){n.trigger("focus",e)}),this.$selection.on("blur",function(e){n._handleBlur(e)}),this.$selection.on("keydown",function(e){n.trigger("keypress",e),e.which===r.SPACE&&e.preventDefault()}),e.on("results:focus",function(e){n.$selection.attr("aria-activedescendant",e.data._resultId)}),e.on("selection:update",function(e){n.update(e.data)}),e.on("open",function(){n.$selection.attr("aria-expanded","true"),n.$selection.attr("aria-owns",i),n._attachCloseHandler(e)}),e.on("close",function(){n.$selection.attr("aria-expanded","false"),n.$selection.removeAttr("aria-activedescendant"),n.$selection.removeAttr("aria-owns"),n.$selection.trigger("focus"),n._detachCloseHandler(e)}),e.on("enable",function(){n.$selection.attr("tabindex",n._tabindex),n.$selection.attr("aria-disabled","false")}),e.on("disable",function(){n.$selection.attr("tabindex","-1"),n.$selection.attr("aria-disabled","true")})},o.prototype._handleBlur=function(e){var t=this;window.setTimeout(function(){document.activeElement==t.$selection[0]||n.contains(t.$selection[0],document.activeElement)||t.trigger("blur",e)},1)},o.prototype._attachCloseHandler=function(e){n(document.body).on("mousedown.select2."+e.id,function(e){var t=n(e.target).closest(".select2");n(".select2.select2-container--open").each(function(){this!=t[0]&&i.GetData(this,"element").select2("close")})})},o.prototype._detachCloseHandler=function(e){n(document.body).off("mousedown.select2."+e.id)},o.prototype.position=function(e,t){t.find(".selection").append(e)},o.prototype.destroy=function(){this._detachCloseHandler(this.container)},o.prototype.update=function(e){throw new Error("The `update` method must be defined in child classes.")},o.prototype.isEnabled=function(){return!this.isDisabled()},o.prototype.isDisabled=function(){return this.options.get("disabled")},o}),e.define("select2/selection/single",["jquery","./base","../utils","../keys"],function(e,t,n,i){function r(){r.__super__.constructor.apply(this,arguments)}return n.Extend(r,t),r.prototype.render=function(){var e=r.__super__.render.call(this);return e.addClass("select2-selection--single"),e.html('<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'),e},r.prototype.bind=function(t,e){var n=this;r.__super__.bind.apply(this,arguments);var i=t.id+"-container";this.$selection.find(".select2-selection__rendered").attr("id",i).attr("role","textbox").attr("aria-readonly","true"),this.$selection.attr("aria-labelledby",i),this.$selection.on("mousedown",function(e){1===e.which&&n.trigger("toggle",{originalEvent:e})}),this.$selection.on("focus",function(e){}),this.$selection.on("blur",function(e){}),t.on("focus",function(e){t.isOpen()||n.$selection.trigger("focus")})},r.prototype.clear=function(){var e=this.$selection.find(".select2-selection__rendered");e.empty(),e.removeAttr("title")},r.prototype.display=function(e,t){var n=this.options.get("templateSelection");return this.options.get("escapeMarkup")(n(e,t))},r.prototype.selectionContainer=function(){return e("<span></span>")},r.prototype.update=function(e){if(0!==e.length){var t=e[0],n=this.$selection.find(".select2-selection__rendered"),i=this.display(t,n);n.empty().append(i);var r=t.title||t.text;r?n.attr("title",r):n.removeAttr("title")}else this.clear()},r}),e.define("select2/selection/multiple",["jquery","./base","../utils"],function(r,e,l){function n(e,t){n.__super__.constructor.apply(this,arguments)}return l.Extend(n,e),n.prototype.render=function(){var e=n.__super__.render.call(this);return e.addClass("select2-selection--multiple"),e.html('<ul class="select2-selection__rendered"></ul>'),e},n.prototype.bind=function(e,t){var i=this;n.__super__.bind.apply(this,arguments),this.$selection.on("click",function(e){i.trigger("toggle",{originalEvent:e})}),this.$selection.on("click",".select2-selection__choice__remove",function(e){if(!i.isDisabled()){var t=r(this).parent(),n=l.GetData(t[0],"data");i.trigger("unselect",{originalEvent:e,data:n})}})},n.prototype.clear=function(){var e=this.$selection.find(".select2-selection__rendered");e.empty(),e.removeAttr("title")},n.prototype.display=function(e,t){var n=this.options.get("templateSelection");return this.options.get("escapeMarkup")(n(e,t))},n.prototype.selectionContainer=function(){return r('<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>')},n.prototype.update=function(e){if(this.clear(),0!==e.length){for(var t=[],n=0;n<e.length;n++){var i=e[n],r=this.selectionContainer(),o=this.display(i,r);r.append(o);var s=i.title||i.text;s&&r.attr("title",s),l.StoreData(r[0],"data",i),t.push(r)}var a=this.$selection.find(".select2-selection__rendered");l.appendMany(a,t)}},n}),e.define("select2/selection/placeholder",["../utils"],function(e){function t(e,t,n){this.placeholder=this.normalizePlaceholder(n.get("placeholder")),e.call(this,t,n)}return t.prototype.normalizePlaceholder=function(e,t){return"string"==typeof t&&(t={id:"",text:t}),t},t.prototype.createPlaceholder=function(e,t){var n=this.selectionContainer();return n.html(this.display(t)),n.addClass("select2-selection__placeholder").removeClass("select2-selection__choice"),n},t.prototype.update=function(e,t){var n=1==t.length&&t[0].id!=this.placeholder.id;if(1<t.length||n)return e.call(this,t);this.clear();var i=this.createPlaceholder(this.placeholder);this.$selection.find(".select2-selection__rendered").append(i)},t}),e.define("select2/selection/allowClear",["jquery","../keys","../utils"],function(r,i,a){function e(){}return e.prototype.bind=function(e,t,n){var i=this;e.call(this,t,n),null==this.placeholder&&this.options.get("debug")&&window.console&&console.error&&console.error("Select2: The `allowClear` option should be used in combination with the `placeholder` option."),this.$selection.on("mousedown",".select2-selection__clear",function(e){i._handleClear(e)}),t.on("keypress",function(e){i._handleKeyboardClear(e,t)})},e.prototype._handleClear=function(e,t){if(!this.isDisabled()){var n=this.$selection.find(".select2-selection__clear");if(0!==n.length){t.stopPropagation();var i=a.GetData(n[0],"data"),r=this.$element.val();this.$element.val(this.placeholder.id);var o={data:i};if(this.trigger("clear",o),o.prevented)this.$element.val(r);else{for(var s=0;s<i.length;s++)if(o={data:i[s]},this.trigger("unselect",o),o.prevented)return void this.$element.val(r);this.$element.trigger("input").trigger("change"),this.trigger("toggle",{})}}}},e.prototype._handleKeyboardClear=function(e,t,n){n.isOpen()||t.which!=i.DELETE&&t.which!=i.BACKSPACE||this._handleClear(t)},e.prototype.update=function(e,t){if(e.call(this,t),!(0<this.$selection.find(".select2-selection__placeholder").length||0===t.length)){var n=this.options.get("translations").get("removeAllItems"),i=r('<span class="select2-selection__clear" title="'+n()+'">&times;</span>');a.StoreData(i[0],"data",t),this.$selection.find(".select2-selection__rendered").prepend(i)}},e}),e.define("select2/selection/search",["jquery","../utils","../keys"],function(i,a,l){function e(e,t,n){e.call(this,t,n)}return e.prototype.render=function(e){var t=i('<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" /></li>');this.$searchContainer=t,this.$search=t.find("input");var n=e.call(this);return this._transferTabIndex(),n},e.prototype.bind=function(e,t,n){var i=this,r=t.id+"-results";e.call(this,t,n),t.on("open",function(){i.$search.attr("aria-controls",r),i.$search.trigger("focus")}),t.on("close",function(){i.$search.val(""),i.$search.removeAttr("aria-controls"),i.$search.removeAttr("aria-activedescendant"),i.$search.trigger("focus")}),t.on("enable",function(){i.$search.prop("disabled",!1),i._transferTabIndex()}),t.on("disable",function(){i.$search.prop("disabled",!0)}),t.on("focus",function(e){i.$search.trigger("focus")}),t.on("results:focus",function(e){e.data._resultId?i.$search.attr("aria-activedescendant",e.data._resultId):i.$search.removeAttr("aria-activedescendant")}),this.$selection.on("focusin",".select2-search--inline",function(e){i.trigger("focus",e)}),this.$selection.on("focusout",".select2-search--inline",function(e){i._handleBlur(e)}),this.$selection.on("keydown",".select2-search--inline",function(e){if(e.stopPropagation(),i.trigger("keypress",e),i._keyUpPrevented=e.isDefaultPrevented(),e.which===l.BACKSPACE&&""===i.$search.val()){var t=i.$searchContainer.prev(".select2-selection__choice");if(0<t.length){var n=a.GetData(t[0],"data");i.searchRemoveChoice(n),e.preventDefault()}}}),this.$selection.on("click",".select2-search--inline",function(e){i.$search.val()&&e.stopPropagation()});var o=document.documentMode,s=o&&o<=11;this.$selection.on("input.searchcheck",".select2-search--inline",function(e){s?i.$selection.off("input.search input.searchcheck"):i.$selection.off("keyup.search")}),this.$selection.on("keyup.search input.search",".select2-search--inline",function(e){if(s&&"input"===e.type)i.$selection.off("input.search input.searchcheck");else{var t=e.which;t!=l.SHIFT&&t!=l.CTRL&&t!=l.ALT&&t!=l.TAB&&i.handleSearch(e)}})},e.prototype._transferTabIndex=function(e){this.$search.attr("tabindex",this.$selection.attr("tabindex")),this.$selection.attr("tabindex","-1")},e.prototype.createPlaceholder=function(e,t){this.$search.attr("placeholder",t.text)},e.prototype.update=function(e,t){var n=this.$search[0]==document.activeElement;this.$search.attr("placeholder",""),e.call(this,t),this.$selection.find(".select2-selection__rendered").append(this.$searchContainer),this.resizeSearch(),n&&this.$search.trigger("focus")},e.prototype.handleSearch=function(){if(this.resizeSearch(),!this._keyUpPrevented){var e=this.$search.val();this.trigger("query",{term:e})}this._keyUpPrevented=!1},e.prototype.searchRemoveChoice=function(e,t){this.trigger("unselect",{data:t}),this.$search.val(t.text),this.handleSearch()},e.prototype.resizeSearch=function(){this.$search.css("width","25px");var e="";""!==this.$search.attr("placeholder")?e=this.$selection.find(".select2-selection__rendered").width():e=.75*(this.$search.val().length+1)+"em";this.$search.css("width",e)},e}),e.define("select2/selection/eventRelay",["jquery"],function(s){function e(){}return e.prototype.bind=function(e,t,n){var i=this,r=["open","opening","close","closing","select","selecting","unselect","unselecting","clear","clearing"],o=["opening","closing","selecting","unselecting","clearing"];e.call(this,t,n),t.on("*",function(e,t){if(-1!==s.inArray(e,r)){t=t||{};var n=s.Event("select2:"+e,{params:t});i.$element.trigger(n),-1!==s.inArray(e,o)&&(t.prevented=n.isDefaultPrevented())}})},e}),e.define("select2/translation",["jquery","require"],function(t,n){function i(e){this.dict=e||{}}return i.prototype.all=function(){return this.dict},i.prototype.get=function(e){return this.dict[e]},i.prototype.extend=function(e){this.dict=t.extend({},e.all(),this.dict)},i._cache={},i.loadPath=function(e){if(!(e in i._cache)){var t=n(e);i._cache[e]=t}return new i(i._cache[e])},i}),e.define("select2/diacritics",[],function(){return{"Ⓐ":"A","Ａ":"A","À":"A","Á":"A","Â":"A","Ầ":"A","Ấ":"A","Ẫ":"A","Ẩ":"A","Ã":"A","Ā":"A","Ă":"A","Ằ":"A","Ắ":"A","Ẵ":"A","Ẳ":"A","Ȧ":"A","Ǡ":"A","Ä":"A","Ǟ":"A","Ả":"A","Å":"A","Ǻ":"A","Ǎ":"A","Ȁ":"A","Ȃ":"A","Ạ":"A","Ậ":"A","Ặ":"A","Ḁ":"A","Ą":"A","Ⱥ":"A","Ɐ":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ⓑ":"B","Ｂ":"B","Ḃ":"B","Ḅ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ɓ":"B","Ⓒ":"C","Ｃ":"C","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","Ç":"C","Ḉ":"C","Ƈ":"C","Ȼ":"C","Ꜿ":"C","Ⓓ":"D","Ｄ":"D","Ḋ":"D","Ď":"D","Ḍ":"D","Ḑ":"D","Ḓ":"D","Ḏ":"D","Đ":"D","Ƌ":"D","Ɗ":"D","Ɖ":"D","Ꝺ":"D","Ǳ":"DZ","Ǆ":"DZ","ǲ":"Dz","ǅ":"Dz","Ⓔ":"E","Ｅ":"E","È":"E","É":"E","Ê":"E","Ề":"E","Ế":"E","Ễ":"E","Ể":"E","Ẽ":"E","Ē":"E","Ḕ":"E","Ḗ":"E","Ĕ":"E","Ė":"E","Ë":"E","Ẻ":"E","Ě":"E","Ȅ":"E","Ȇ":"E","Ẹ":"E","Ệ":"E","Ȩ":"E","Ḝ":"E","Ę":"E","Ḙ":"E","Ḛ":"E","Ɛ":"E","Ǝ":"E","Ⓕ":"F","Ｆ":"F","Ḟ":"F","Ƒ":"F","Ꝼ":"F","Ⓖ":"G","Ｇ":"G","Ǵ":"G","Ĝ":"G","Ḡ":"G","Ğ":"G","Ġ":"G","Ǧ":"G","Ģ":"G","Ǥ":"G","Ɠ":"G","Ꞡ":"G","Ᵹ":"G","Ꝿ":"G","Ⓗ":"H","Ｈ":"H","Ĥ":"H","Ḣ":"H","Ḧ":"H","Ȟ":"H","Ḥ":"H","Ḩ":"H","Ḫ":"H","Ħ":"H","Ⱨ":"H","Ⱶ":"H","Ɥ":"H","Ⓘ":"I","Ｉ":"I","Ì":"I","Í":"I","Î":"I","Ĩ":"I","Ī":"I","Ĭ":"I","İ":"I","Ï":"I","Ḯ":"I","Ỉ":"I","Ǐ":"I","Ȉ":"I","Ȋ":"I","Ị":"I","Į":"I","Ḭ":"I","Ɨ":"I","Ⓙ":"J","Ｊ":"J","Ĵ":"J","Ɉ":"J","Ⓚ":"K","Ｋ":"K","Ḱ":"K","Ǩ":"K","Ḳ":"K","Ķ":"K","Ḵ":"K","Ƙ":"K","Ⱪ":"K","Ꝁ":"K","Ꝃ":"K","Ꝅ":"K","Ꞣ":"K","Ⓛ":"L","Ｌ":"L","Ŀ":"L","Ĺ":"L","Ľ":"L","Ḷ":"L","Ḹ":"L","Ļ":"L","Ḽ":"L","Ḻ":"L","Ł":"L","Ƚ":"L","Ɫ":"L","Ⱡ":"L","Ꝉ":"L","Ꝇ":"L","Ꞁ":"L","Ǉ":"LJ","ǈ":"Lj","Ⓜ":"M","Ｍ":"M","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ɯ":"M","Ⓝ":"N","Ｎ":"N","Ǹ":"N","Ń":"N","Ñ":"N","Ṅ":"N","Ň":"N","Ṇ":"N","Ņ":"N","Ṋ":"N","Ṉ":"N","Ƞ":"N","Ɲ":"N","Ꞑ":"N","Ꞥ":"N","Ǌ":"NJ","ǋ":"Nj","Ⓞ":"O","Ｏ":"O","Ò":"O","Ó":"O","Ô":"O","Ồ":"O","Ố":"O","Ỗ":"O","Ổ":"O","Õ":"O","Ṍ":"O","Ȭ":"O","Ṏ":"O","Ō":"O","Ṑ":"O","Ṓ":"O","Ŏ":"O","Ȯ":"O","Ȱ":"O","Ö":"O","Ȫ":"O","Ỏ":"O","Ő":"O","Ǒ":"O","Ȍ":"O","Ȏ":"O","Ơ":"O","Ờ":"O","Ớ":"O","Ỡ":"O","Ở":"O","Ợ":"O","Ọ":"O","Ộ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Ɔ":"O","Ɵ":"O","Ꝋ":"O","Ꝍ":"O","Œ":"OE","Ƣ":"OI","Ꝏ":"OO","Ȣ":"OU","Ⓟ":"P","Ｐ":"P","Ṕ":"P","Ṗ":"P","Ƥ":"P","Ᵽ":"P","Ꝑ":"P","Ꝓ":"P","Ꝕ":"P","Ⓠ":"Q","Ｑ":"Q","Ꝗ":"Q","Ꝙ":"Q","Ɋ":"Q","Ⓡ":"R","Ｒ":"R","Ŕ":"R","Ṙ":"R","Ř":"R","Ȑ":"R","Ȓ":"R","Ṛ":"R","Ṝ":"R","Ŗ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꝛ":"R","Ꞧ":"R","Ꞃ":"R","Ⓢ":"S","Ｓ":"S","ẞ":"S","Ś":"S","Ṥ":"S","Ŝ":"S","Ṡ":"S","Š":"S","Ṧ":"S","Ṣ":"S","Ṩ":"S","Ș":"S","Ş":"S","Ȿ":"S","Ꞩ":"S","Ꞅ":"S","Ⓣ":"T","Ｔ":"T","Ṫ":"T","Ť":"T","Ṭ":"T","Ț":"T","Ţ":"T","Ṱ":"T","Ṯ":"T","Ŧ":"T","Ƭ":"T","Ʈ":"T","Ⱦ":"T","Ꞇ":"T","Ꜩ":"TZ","Ⓤ":"U","Ｕ":"U","Ù":"U","Ú":"U","Û":"U","Ũ":"U","Ṹ":"U","Ū":"U","Ṻ":"U","Ŭ":"U","Ü":"U","Ǜ":"U","Ǘ":"U","Ǖ":"U","Ǚ":"U","Ủ":"U","Ů":"U","Ű":"U","Ǔ":"U","Ȕ":"U","Ȗ":"U","Ư":"U","Ừ":"U","Ứ":"U","Ữ":"U","Ử":"U","Ự":"U","Ụ":"U","Ṳ":"U","Ų":"U","Ṷ":"U","Ṵ":"U","Ʉ":"U","Ⓥ":"V","Ｖ":"V","Ṽ":"V","Ṿ":"V","Ʋ":"V","Ꝟ":"V","Ʌ":"V","Ꝡ":"VY","Ⓦ":"W","Ｗ":"W","Ẁ":"W","Ẃ":"W","Ŵ":"W","Ẇ":"W","Ẅ":"W","Ẉ":"W","Ⱳ":"W","Ⓧ":"X","Ｘ":"X","Ẋ":"X","Ẍ":"X","Ⓨ":"Y","Ｙ":"Y","Ỳ":"Y","Ý":"Y","Ŷ":"Y","Ỹ":"Y","Ȳ":"Y","Ẏ":"Y","Ÿ":"Y","Ỷ":"Y","Ỵ":"Y","Ƴ":"Y","Ɏ":"Y","Ỿ":"Y","Ⓩ":"Z","Ｚ":"Z","Ź":"Z","Ẑ":"Z","Ż":"Z","Ž":"Z","Ẓ":"Z","Ẕ":"Z","Ƶ":"Z","Ȥ":"Z","Ɀ":"Z","Ⱬ":"Z","Ꝣ":"Z","ⓐ":"a","ａ":"a","ẚ":"a","à":"a","á":"a","â":"a","ầ":"a","ấ":"a","ẫ":"a","ẩ":"a","ã":"a","ā":"a","ă":"a","ằ":"a","ắ":"a","ẵ":"a","ẳ":"a","ȧ":"a","ǡ":"a","ä":"a","ǟ":"a","ả":"a","å":"a","ǻ":"a","ǎ":"a","ȁ":"a","ȃ":"a","ạ":"a","ậ":"a","ặ":"a","ḁ":"a","ą":"a","ⱥ":"a","ɐ":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ⓑ":"b","ｂ":"b","ḃ":"b","ḅ":"b","ḇ":"b","ƀ":"b","ƃ":"b","ɓ":"b","ⓒ":"c","ｃ":"c","ć":"c","ĉ":"c","ċ":"c","č":"c","ç":"c","ḉ":"c","ƈ":"c","ȼ":"c","ꜿ":"c","ↄ":"c","ⓓ":"d","ｄ":"d","ḋ":"d","ď":"d","ḍ":"d","ḑ":"d","ḓ":"d","ḏ":"d","đ":"d","ƌ":"d","ɖ":"d","ɗ":"d","ꝺ":"d","ǳ":"dz","ǆ":"dz","ⓔ":"e","ｅ":"e","è":"e","é":"e","ê":"e","ề":"e","ế":"e","ễ":"e","ể":"e","ẽ":"e","ē":"e","ḕ":"e","ḗ":"e","ĕ":"e","ė":"e","ë":"e","ẻ":"e","ě":"e","ȅ":"e","ȇ":"e","ẹ":"e","ệ":"e","ȩ":"e","ḝ":"e","ę":"e","ḙ":"e","ḛ":"e","ɇ":"e","ɛ":"e","ǝ":"e","ⓕ":"f","ｆ":"f","ḟ":"f","ƒ":"f","ꝼ":"f","ⓖ":"g","ｇ":"g","ǵ":"g","ĝ":"g","ḡ":"g","ğ":"g","ġ":"g","ǧ":"g","ģ":"g","ǥ":"g","ɠ":"g","ꞡ":"g","ᵹ":"g","ꝿ":"g","ⓗ":"h","ｈ":"h","ĥ":"h","ḣ":"h","ḧ":"h","ȟ":"h","ḥ":"h","ḩ":"h","ḫ":"h","ẖ":"h","ħ":"h","ⱨ":"h","ⱶ":"h","ɥ":"h","ƕ":"hv","ⓘ":"i","ｉ":"i","ì":"i","í":"i","î":"i","ĩ":"i","ī":"i","ĭ":"i","ï":"i","ḯ":"i","ỉ":"i","ǐ":"i","ȉ":"i","ȋ":"i","ị":"i","į":"i","ḭ":"i","ɨ":"i","ı":"i","ⓙ":"j","ｊ":"j","ĵ":"j","ǰ":"j","ɉ":"j","ⓚ":"k","ｋ":"k","ḱ":"k","ǩ":"k","ḳ":"k","ķ":"k","ḵ":"k","ƙ":"k","ⱪ":"k","ꝁ":"k","ꝃ":"k","ꝅ":"k","ꞣ":"k","ⓛ":"l","ｌ":"l","ŀ":"l","ĺ":"l","ľ":"l","ḷ":"l","ḹ":"l","ļ":"l","ḽ":"l","ḻ":"l","ſ":"l","ł":"l","ƚ":"l","ɫ":"l","ⱡ":"l","ꝉ":"l","ꞁ":"l","ꝇ":"l","ǉ":"lj","ⓜ":"m","ｍ":"m","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ɯ":"m","ⓝ":"n","ｎ":"n","ǹ":"n","ń":"n","ñ":"n","ṅ":"n","ň":"n","ṇ":"n","ņ":"n","ṋ":"n","ṉ":"n","ƞ":"n","ɲ":"n","ŉ":"n","ꞑ":"n","ꞥ":"n","ǌ":"nj","ⓞ":"o","ｏ":"o","ò":"o","ó":"o","ô":"o","ồ":"o","ố":"o","ỗ":"o","ổ":"o","õ":"o","ṍ":"o","ȭ":"o","ṏ":"o","ō":"o","ṑ":"o","ṓ":"o","ŏ":"o","ȯ":"o","ȱ":"o","ö":"o","ȫ":"o","ỏ":"o","ő":"o","ǒ":"o","ȍ":"o","ȏ":"o","ơ":"o","ờ":"o","ớ":"o","ỡ":"o","ở":"o","ợ":"o","ọ":"o","ộ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","ɔ":"o","ꝋ":"o","ꝍ":"o","ɵ":"o","œ":"oe","ƣ":"oi","ȣ":"ou","ꝏ":"oo","ⓟ":"p","ｐ":"p","ṕ":"p","ṗ":"p","ƥ":"p","ᵽ":"p","ꝑ":"p","ꝓ":"p","ꝕ":"p","ⓠ":"q","ｑ":"q","ɋ":"q","ꝗ":"q","ꝙ":"q","ⓡ":"r","ｒ":"r","ŕ":"r","ṙ":"r","ř":"r","ȑ":"r","ȓ":"r","ṛ":"r","ṝ":"r","ŗ":"r","ṟ":"r","ɍ":"r","ɽ":"r","ꝛ":"r","ꞧ":"r","ꞃ":"r","ⓢ":"s","ｓ":"s","ß":"s","ś":"s","ṥ":"s","ŝ":"s","ṡ":"s","š":"s","ṧ":"s","ṣ":"s","ṩ":"s","ș":"s","ş":"s","ȿ":"s","ꞩ":"s","ꞅ":"s","ẛ":"s","ⓣ":"t","ｔ":"t","ṫ":"t","ẗ":"t","ť":"t","ṭ":"t","ț":"t","ţ":"t","ṱ":"t","ṯ":"t","ŧ":"t","ƭ":"t","ʈ":"t","ⱦ":"t","ꞇ":"t","ꜩ":"tz","ⓤ":"u","ｕ":"u","ù":"u","ú":"u","û":"u","ũ":"u","ṹ":"u","ū":"u","ṻ":"u","ŭ":"u","ü":"u","ǜ":"u","ǘ":"u","ǖ":"u","ǚ":"u","ủ":"u","ů":"u","ű":"u","ǔ":"u","ȕ":"u","ȗ":"u","ư":"u","ừ":"u","ứ":"u","ữ":"u","ử":"u","ự":"u","ụ":"u","ṳ":"u","ų":"u","ṷ":"u","ṵ":"u","ʉ":"u","ⓥ":"v","ｖ":"v","ṽ":"v","ṿ":"v","ʋ":"v","ꝟ":"v","ʌ":"v","ꝡ":"vy","ⓦ":"w","ｗ":"w","ẁ":"w","ẃ":"w","ŵ":"w","ẇ":"w","ẅ":"w","ẘ":"w","ẉ":"w","ⱳ":"w","ⓧ":"x","ｘ":"x","ẋ":"x","ẍ":"x","ⓨ":"y","ｙ":"y","ỳ":"y","ý":"y","ŷ":"y","ỹ":"y","ȳ":"y","ẏ":"y","ÿ":"y","ỷ":"y","ẙ":"y","ỵ":"y","ƴ":"y","ɏ":"y","ỿ":"y","ⓩ":"z","ｚ":"z","ź":"z","ẑ":"z","ż":"z","ž":"z","ẓ":"z","ẕ":"z","ƶ":"z","ȥ":"z","ɀ":"z","ⱬ":"z","ꝣ":"z","Ά":"Α","Έ":"Ε","Ή":"Η","Ί":"Ι","Ϊ":"Ι","Ό":"Ο","Ύ":"Υ","Ϋ":"Υ","Ώ":"Ω","ά":"α","έ":"ε","ή":"η","ί":"ι","ϊ":"ι","ΐ":"ι","ό":"ο","ύ":"υ","ϋ":"υ","ΰ":"υ","ώ":"ω","ς":"σ","’":"'"}}),e.define("select2/data/base",["../utils"],function(i){function n(e,t){n.__super__.constructor.call(this)}return i.Extend(n,i.Observable),n.prototype.current=function(e){throw new Error("The `current` method must be defined in child classes.")},n.prototype.query=function(e,t){throw new Error("The `query` method must be defined in child classes.")},n.prototype.bind=function(e,t){},n.prototype.destroy=function(){},n.prototype.generateResultId=function(e,t){var n=e.id+"-result-";return n+=i.generateChars(4),null!=t.id?n+="-"+t.id.toString():n+="-"+i.generateChars(4),n},n}),e.define("select2/data/select",["./base","../utils","jquery"],function(e,a,l){function n(e,t){this.$element=e,this.options=t,n.__super__.constructor.call(this)}return a.Extend(n,e),n.prototype.current=function(e){var n=[],i=this;this.$element.find(":selected").each(function(){var e=l(this),t=i.item(e);n.push(t)}),e(n)},n.prototype.select=function(r){var o=this;if(r.selected=!0,l(r.element).is("option"))return r.element.selected=!0,void this.$element.trigger("input").trigger("change");if(this.$element.prop("multiple"))this.current(function(e){var t=[];(r=[r]).push.apply(r,e);for(var n=0;n<r.length;n++){var i=r[n].id;-1===l.inArray(i,t)&&t.push(i)}o.$element.val(t),o.$element.trigger("input").trigger("change")});else{var e=r.id;this.$element.val(e),this.$element.trigger("input").trigger("change")}},n.prototype.unselect=function(r){var o=this;if(this.$element.prop("multiple")){if(r.selected=!1,l(r.element).is("option"))return r.element.selected=!1,void this.$element.trigger("input").trigger("change");this.current(function(e){for(var t=[],n=0;n<e.length;n++){var i=e[n].id;i!==r.id&&-1===l.inArray(i,t)&&t.push(i)}o.$element.val(t),o.$element.trigger("input").trigger("change")})}},n.prototype.bind=function(e,t){var n=this;(this.container=e).on("select",function(e){n.select(e.data)}),e.on("unselect",function(e){n.unselect(e.data)})},n.prototype.destroy=function(){this.$element.find("*").each(function(){a.RemoveData(this)})},n.prototype.query=function(i,e){var r=[],o=this;this.$element.children().each(function(){var e=l(this);if(e.is("option")||e.is("optgroup")){var t=o.item(e),n=o.matches(i,t);null!==n&&r.push(n)}}),e({results:r})},n.prototype.addOptions=function(e){a.appendMany(this.$element,e)},n.prototype.option=function(e){var t;e.children?(t=document.createElement("optgroup")).label=e.text:void 0!==(t=document.createElement("option")).textContent?t.textContent=e.text:t.innerText=e.text,void 0!==e.id&&(t.value=e.id),e.disabled&&(t.disabled=!0),e.selected&&(t.selected=!0),e.title&&(t.title=e.title);var n=l(t),i=this._normalizeItem(e);return i.element=t,a.StoreData(t,"data",i),n},n.prototype.item=function(e){var t={};if(null!=(t=a.GetData(e[0],"data")))return t;if(e.is("option"))t={id:e.val(),text:e.text(),disabled:e.prop("disabled"),selected:e.prop("selected"),title:e.prop("title")};else if(e.is("optgroup")){t={text:e.prop("label"),children:[],title:e.prop("title")};for(var n=e.children("option"),i=[],r=0;r<n.length;r++){var o=l(n[r]),s=this.item(o);i.push(s)}t.children=i}return(t=this._normalizeItem(t)).element=e[0],a.StoreData(e[0],"data",t),t},n.prototype._normalizeItem=function(e){e!==Object(e)&&(e={id:e,text:e});return null!=(e=l.extend({},{text:""},e)).id&&(e.id=e.id.toString()),null!=e.text&&(e.text=e.text.toString()),null==e._resultId&&e.id&&null!=this.container&&(e._resultId=this.generateResultId(this.container,e)),l.extend({},{selected:!1,disabled:!1},e)},n.prototype.matches=function(e,t){return this.options.get("matcher")(e,t)},n}),e.define("select2/data/array",["./select","../utils","jquery"],function(e,f,g){function i(e,t){this._dataToConvert=t.get("data")||[],i.__super__.constructor.call(this,e,t)}return f.Extend(i,e),i.prototype.bind=function(e,t){i.__super__.bind.call(this,e,t),this.addOptions(this.convertToOptions(this._dataToConvert))},i.prototype.select=function(n){var e=this.$element.find("option").filter(function(e,t){return t.value==n.id.toString()});0===e.length&&(e=this.option(n),this.addOptions(e)),i.__super__.select.call(this,n)},i.prototype.convertToOptions=function(e){var t=this,n=this.$element.find("option"),i=n.map(function(){return t.item(g(this)).id}).get(),r=[];function o(e){return function(){return g(this).val()==e.id}}for(var s=0;s<e.length;s++){var a=this._normalizeItem(e[s]);if(0<=g.inArray(a.id,i)){var l=n.filter(o(a)),c=this.item(l),u=g.extend(!0,{},a,c),d=this.option(u);l.replaceWith(d)}else{var p=this.option(a);if(a.children){var h=this.convertToOptions(a.children);f.appendMany(p,h)}r.push(p)}}return r},i}),e.define("select2/data/ajax",["./array","../utils","jquery"],function(e,t,o){function n(e,t){this.ajaxOptions=this._applyDefaults(t.get("ajax")),null!=this.ajaxOptions.processResults&&(this.processResults=this.ajaxOptions.processResults),n.__super__.constructor.call(this,e,t)}return t.Extend(n,e),n.prototype._applyDefaults=function(e){var t={data:function(e){return o.extend({},e,{q:e.term})},transport:function(e,t,n){var i=o.ajax(e);return i.then(t),i.fail(n),i}};return o.extend({},t,e,!0)},n.prototype.processResults=function(e){return e},n.prototype.query=function(n,i){var r=this;null!=this._request&&(o.isFunction(this._request.abort)&&this._request.abort(),this._request=null);var t=o.extend({type:"GET"},this.ajaxOptions);function e(){var e=t.transport(t,function(e){var t=r.processResults(e,n);r.options.get("debug")&&window.console&&console.error&&(t&&t.results&&o.isArray(t.results)||console.error("Select2: The AJAX results did not return an array in the `results` key of the response.")),i(t)},function(){"status"in e&&(0===e.status||"0"===e.status)||r.trigger("results:message",{message:"errorLoading"})});r._request=e}"function"==typeof t.url&&(t.url=t.url.call(this.$element,n)),"function"==typeof t.data&&(t.data=t.data.call(this.$element,n)),this.ajaxOptions.delay&&null!=n.term?(this._queryTimeout&&window.clearTimeout(this._queryTimeout),this._queryTimeout=window.setTimeout(e,this.ajaxOptions.delay)):e()},n}),e.define("select2/data/tags",["jquery"],function(u){function e(e,t,n){var i=n.get("tags"),r=n.get("createTag");void 0!==r&&(this.createTag=r);var o=n.get("insertTag");if(void 0!==o&&(this.insertTag=o),e.call(this,t,n),u.isArray(i))for(var s=0;s<i.length;s++){var a=i[s],l=this._normalizeItem(a),c=this.option(l);this.$element.append(c)}}return e.prototype.query=function(e,c,u){var d=this;this._removeOldTags(),null!=c.term&&null==c.page?e.call(this,c,function e(t,n){for(var i=t.results,r=0;r<i.length;r++){var o=i[r],s=null!=o.children&&!e({results:o.children},!0);if((o.text||"").toUpperCase()===(c.term||"").toUpperCase()||s)return!n&&(t.data=i,void u(t))}if(n)return!0;var a=d.createTag(c);if(null!=a){var l=d.option(a);l.attr("data-select2-tag",!0),d.addOptions([l]),d.insertTag(i,a)}t.results=i,u(t)}):e.call(this,c,u)},e.prototype.createTag=function(e,t){var n=u.trim(t.term);return""===n?null:{id:n,text:n}},e.prototype.insertTag=function(e,t,n){t.unshift(n)},e.prototype._removeOldTags=function(e){this.$element.find("option[data-select2-tag]").each(function(){this.selected||u(this).remove()})},e}),e.define("select2/data/tokenizer",["jquery"],function(d){function e(e,t,n){var i=n.get("tokenizer");void 0!==i&&(this.tokenizer=i),e.call(this,t,n)}return e.prototype.bind=function(e,t,n){e.call(this,t,n),this.$search=t.dropdown.$search||t.selection.$search||n.find(".select2-search__field")},e.prototype.query=function(e,t,n){var i=this;t.term=t.term||"";var r=this.tokenizer(t,this.options,function(e){var t=i._normalizeItem(e);if(!i.$element.find("option").filter(function(){return d(this).val()===t.id}).length){var n=i.option(t);n.attr("data-select2-tag",!0),i._removeOldTags(),i.addOptions([n])}!function(e){i.trigger("select",{data:e})}(t)});r.term!==t.term&&(this.$search.length&&(this.$search.val(r.term),this.$search.trigger("focus")),t.term=r.term),e.call(this,t,n)},e.prototype.tokenizer=function(e,t,n,i){for(var r=n.get("tokenSeparators")||[],o=t.term,s=0,a=this.createTag||function(e){return{id:e.term,text:e.term}};s<o.length;){var l=o[s];if(-1!==d.inArray(l,r)){var c=o.substr(0,s),u=a(d.extend({},t,{term:c}));null!=u?(i(u),o=o.substr(s+1)||"",s=0):s++}else s++}return{term:o}},e}),e.define("select2/data/minimumInputLength",[],function(){function e(e,t,n){this.minimumInputLength=n.get("minimumInputLength"),e.call(this,t,n)}return e.prototype.query=function(e,t,n){t.term=t.term||"",t.term.length<this.minimumInputLength?this.trigger("results:message",{message:"inputTooShort",args:{minimum:this.minimumInputLength,input:t.term,params:t}}):e.call(this,t,n)},e}),e.define("select2/data/maximumInputLength",[],function(){function e(e,t,n){this.maximumInputLength=n.get("maximumInputLength"),e.call(this,t,n)}return e.prototype.query=function(e,t,n){t.term=t.term||"",0<this.maximumInputLength&&t.term.length>this.maximumInputLength?this.trigger("results:message",{message:"inputTooLong",args:{maximum:this.maximumInputLength,input:t.term,params:t}}):e.call(this,t,n)},e}),e.define("select2/data/maximumSelectionLength",[],function(){function e(e,t,n){this.maximumSelectionLength=n.get("maximumSelectionLength"),e.call(this,t,n)}return e.prototype.bind=function(e,t,n){var i=this;e.call(this,t,n),t.on("select",function(){i._checkIfMaximumSelected()})},e.prototype.query=function(e,t,n){var i=this;this._checkIfMaximumSelected(function(){e.call(i,t,n)})},e.prototype._checkIfMaximumSelected=function(e,n){var i=this;this.current(function(e){var t=null!=e?e.length:0;0<i.maximumSelectionLength&&t>=i.maximumSelectionLength?i.trigger("results:message",{message:"maximumSelected",args:{maximum:i.maximumSelectionLength}}):n&&n()})},e}),e.define("select2/dropdown",["jquery","./utils"],function(t,e){function n(e,t){this.$element=e,this.options=t,n.__super__.constructor.call(this)}return e.Extend(n,e.Observable),n.prototype.render=function(){var e=t('<span class="select2-dropdown"><span class="select2-results"></span></span>');return e.attr("dir",this.options.get("dir")),this.$dropdown=e},n.prototype.bind=function(){},n.prototype.position=function(e,t){},n.prototype.destroy=function(){this.$dropdown.remove()},n}),e.define("select2/dropdown/search",["jquery","../utils"],function(o,e){function t(){}return t.prototype.render=function(e){var t=e.call(this),n=o('<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" /></span>');return this.$searchContainer=n,this.$search=n.find("input"),t.prepend(n),t},t.prototype.bind=function(e,t,n){var i=this,r=t.id+"-results";e.call(this,t,n),this.$search.on("keydown",function(e){i.trigger("keypress",e),i._keyUpPrevented=e.isDefaultPrevented()}),this.$search.on("input",function(e){o(this).off("keyup")}),this.$search.on("keyup input",function(e){i.handleSearch(e)}),t.on("open",function(){i.$search.attr("tabindex",0),i.$search.attr("aria-controls",r),i.$search.trigger("focus"),window.setTimeout(function(){i.$search.trigger("focus")},0)}),t.on("close",function(){i.$search.attr("tabindex",-1),i.$search.removeAttr("aria-controls"),i.$search.removeAttr("aria-activedescendant"),i.$search.val(""),i.$search.trigger("blur")}),t.on("focus",function(){t.isOpen()||i.$search.trigger("focus")}),t.on("results:all",function(e){null!=e.query.term&&""!==e.query.term||(i.showSearch(e)?i.$searchContainer.removeClass("select2-search--hide"):i.$searchContainer.addClass("select2-search--hide"))}),t.on("results:focus",function(e){e.data._resultId?i.$search.attr("aria-activedescendant",e.data._resultId):i.$search.removeAttr("aria-activedescendant")})},t.prototype.handleSearch=function(e){if(!this._keyUpPrevented){var t=this.$search.val();this.trigger("query",{term:t})}this._keyUpPrevented=!1},t.prototype.showSearch=function(e,t){return!0},t}),e.define("select2/dropdown/hidePlaceholder",[],function(){function e(e,t,n,i){this.placeholder=this.normalizePlaceholder(n.get("placeholder")),e.call(this,t,n,i)}return e.prototype.append=function(e,t){t.results=this.removePlaceholder(t.results),e.call(this,t)},e.prototype.normalizePlaceholder=function(e,t){return"string"==typeof t&&(t={id:"",text:t}),t},e.prototype.removePlaceholder=function(e,t){for(var n=t.slice(0),i=t.length-1;0<=i;i--){var r=t[i];this.placeholder.id===r.id&&n.splice(i,1)}return n},e}),e.define("select2/dropdown/infiniteScroll",["jquery"],function(n){function e(e,t,n,i){this.lastParams={},e.call(this,t,n,i),this.$loadingMore=this.createLoadingMore(),this.loading=!1}return e.prototype.append=function(e,t){this.$loadingMore.remove(),this.loading=!1,e.call(this,t),this.showLoadingMore(t)&&(this.$results.append(this.$loadingMore),this.loadMoreIfNeeded())},e.prototype.bind=function(e,t,n){var i=this;e.call(this,t,n),t.on("query",function(e){i.lastParams=e,i.loading=!0}),t.on("query:append",function(e){i.lastParams=e,i.loading=!0}),this.$results.on("scroll",this.loadMoreIfNeeded.bind(this))},e.prototype.loadMoreIfNeeded=function(){var e=n.contains(document.documentElement,this.$loadingMore[0]);if(!this.loading&&e){var t=this.$results.offset().top+this.$results.outerHeight(!1);this.$loadingMore.offset().top+this.$loadingMore.outerHeight(!1)<=t+50&&this.loadMore()}},e.prototype.loadMore=function(){this.loading=!0;var e=n.extend({},{page:1},this.lastParams);e.page++,this.trigger("query:append",e)},e.prototype.showLoadingMore=function(e,t){return t.pagination&&t.pagination.more},e.prototype.createLoadingMore=function(){var e=n('<li class="select2-results__option select2-results__option--load-more"role="option" aria-disabled="true"></li>'),t=this.options.get("translations").get("loadingMore");return e.html(t(this.lastParams)),e},e}),e.define("select2/dropdown/attachBody",["jquery","../utils"],function(f,a){function e(e,t,n){this.$dropdownParent=f(n.get("dropdownParent")||document.body),e.call(this,t,n)}return e.prototype.bind=function(e,t,n){var i=this;e.call(this,t,n),t.on("open",function(){i._showDropdown(),i._attachPositioningHandler(t),i._bindContainerResultHandlers(t)}),t.on("close",function(){i._hideDropdown(),i._detachPositioningHandler(t)}),this.$dropdownContainer.on("mousedown",function(e){e.stopPropagation()})},e.prototype.destroy=function(e){e.call(this),this.$dropdownContainer.remove()},e.prototype.position=function(e,t,n){t.attr("class",n.attr("class")),t.removeClass("select2"),t.addClass("select2-container--open"),t.css({position:"absolute",top:-999999}),this.$container=n},e.prototype.render=function(e){var t=f("<span></span>"),n=e.call(this);return t.append(n),this.$dropdownContainer=t},e.prototype._hideDropdown=function(e){this.$dropdownContainer.detach()},e.prototype._bindContainerResultHandlers=function(e,t){if(!this._containerResultsHandlersBound){var n=this;t.on("results:all",function(){n._positionDropdown(),n._resizeDropdown()}),t.on("results:append",function(){n._positionDropdown(),n._resizeDropdown()}),t.on("results:message",function(){n._positionDropdown(),n._resizeDropdown()}),t.on("select",function(){n._positionDropdown(),n._resizeDropdown()}),t.on("unselect",function(){n._positionDropdown(),n._resizeDropdown()}),this._containerResultsHandlersBound=!0}},e.prototype._attachPositioningHandler=function(e,t){var n=this,i="scroll.select2."+t.id,r="resize.select2."+t.id,o="orientationchange.select2."+t.id,s=this.$container.parents().filter(a.hasScroll);s.each(function(){a.StoreData(this,"select2-scroll-position",{x:f(this).scrollLeft(),y:f(this).scrollTop()})}),s.on(i,function(e){var t=a.GetData(this,"select2-scroll-position");f(this).scrollTop(t.y)}),f(window).on(i+" "+r+" "+o,function(e){n._positionDropdown(),n._resizeDropdown()})},e.prototype._detachPositioningHandler=function(e,t){var n="scroll.select2."+t.id,i="resize.select2."+t.id,r="orientationchange.select2."+t.id;this.$container.parents().filter(a.hasScroll).off(n),f(window).off(n+" "+i+" "+r)},e.prototype._positionDropdown=function(){var e=f(window),t=this.$dropdown.hasClass("select2-dropdown--above"),n=this.$dropdown.hasClass("select2-dropdown--below"),i=null,r=this.$container.offset();r.bottom=r.top+this.$container.outerHeight(!1);var o={height:this.$container.outerHeight(!1)};o.top=r.top,o.bottom=r.top+o.height;var s=this.$dropdown.outerHeight(!1),a=e.scrollTop(),l=e.scrollTop()+e.height(),c=a<r.top-s,u=l>r.bottom+s,d={left:r.left,top:o.bottom},p=this.$dropdownParent;"static"===p.css("position")&&(p=p.offsetParent());var h={top:0,left:0};(f.contains(document.body,p[0])||p[0].isConnected)&&(h=p.offset()),d.top-=h.top,d.left-=h.left,t||n||(i="below"),u||!c||t?!c&&u&&t&&(i="below"):i="above",("above"==i||t&&"below"!==i)&&(d.top=o.top-h.top-s),null!=i&&(this.$dropdown.removeClass("select2-dropdown--below select2-dropdown--above").addClass("select2-dropdown--"+i),this.$container.removeClass("select2-container--below select2-container--above").addClass("select2-container--"+i)),this.$dropdownContainer.css(d)},e.prototype._resizeDropdown=function(){var e={width:this.$container.outerWidth(!1)+"px"};this.options.get("dropdownAutoWidth")&&(e.minWidth=e.width,e.position="relative",e.width="auto"),this.$dropdown.css(e)},e.prototype._showDropdown=function(e){this.$dropdownContainer.appendTo(this.$dropdownParent),this._positionDropdown(),this._resizeDropdown()},e}),e.define("select2/dropdown/minimumResultsForSearch",[],function(){function e(e,t,n,i){this.minimumResultsForSearch=n.get("minimumResultsForSearch"),this.minimumResultsForSearch<0&&(this.minimumResultsForSearch=1/0),e.call(this,t,n,i)}return e.prototype.showSearch=function(e,t){return!(function e(t){for(var n=0,i=0;i<t.length;i++){var r=t[i];r.children?n+=e(r.children):n++}return n}(t.data.results)<this.minimumResultsForSearch)&&e.call(this,t)},e}),e.define("select2/dropdown/selectOnClose",["../utils"],function(o){function e(){}return e.prototype.bind=function(e,t,n){var i=this;e.call(this,t,n),t.on("close",function(e){i._handleSelectOnClose(e)})},e.prototype._handleSelectOnClose=function(e,t){if(t&&null!=t.originalSelect2Event){var n=t.originalSelect2Event;if("select"===n._type||"unselect"===n._type)return}var i=this.getHighlightedResults();if(!(i.length<1)){var r=o.GetData(i[0],"data");null!=r.element&&r.element.selected||null==r.element&&r.selected||this.trigger("select",{data:r})}},e}),e.define("select2/dropdown/closeOnSelect",[],function(){function e(){}return e.prototype.bind=function(e,t,n){var i=this;e.call(this,t,n),t.on("select",function(e){i._selectTriggered(e)}),t.on("unselect",function(e){i._selectTriggered(e)})},e.prototype._selectTriggered=function(e,t){var n=t.originalEvent;n&&(n.ctrlKey||n.metaKey)||this.trigger("close",{originalEvent:n,originalSelect2Event:t})},e}),e.define("select2/i18n/en",[],function(){return{errorLoading:function(){return"The results could not be loaded."},inputTooLong:function(e){var t=e.input.length-e.maximum,n="Please delete "+t+" character";return 1!=t&&(n+="s"),n},inputTooShort:function(e){return"Please enter "+(e.minimum-e.input.length)+" or more characters"},loadingMore:function(){return"Loading more results…"},maximumSelected:function(e){var t="You can only select "+e.maximum+" item";return 1!=e.maximum&&(t+="s"),t},noResults:function(){return"No results found"},searching:function(){return"Searching…"},removeAllItems:function(){return"Remove all items"}}}),e.define("select2/defaults",["jquery","require","./results","./selection/single","./selection/multiple","./selection/placeholder","./selection/allowClear","./selection/search","./selection/eventRelay","./utils","./translation","./diacritics","./data/select","./data/array","./data/ajax","./data/tags","./data/tokenizer","./data/minimumInputLength","./data/maximumInputLength","./data/maximumSelectionLength","./dropdown","./dropdown/search","./dropdown/hidePlaceholder","./dropdown/infiniteScroll","./dropdown/attachBody","./dropdown/minimumResultsForSearch","./dropdown/selectOnClose","./dropdown/closeOnSelect","./i18n/en"],function(c,u,d,p,h,f,g,m,v,y,s,t,_,w,$,b,A,x,D,S,C,E,O,T,q,j,L,I,e){function n(){this.reset()}return n.prototype.apply=function(e){if(null==(e=c.extend(!0,{},this.defaults,e)).dataAdapter){if(null!=e.ajax?e.dataAdapter=$:null!=e.data?e.dataAdapter=w:e.dataAdapter=_,0<e.minimumInputLength&&(e.dataAdapter=y.Decorate(e.dataAdapter,x)),0<e.maximumInputLength&&(e.dataAdapter=y.Decorate(e.dataAdapter,D)),0<e.maximumSelectionLength&&(e.dataAdapter=y.Decorate(e.dataAdapter,S)),e.tags&&(e.dataAdapter=y.Decorate(e.dataAdapter,b)),null==e.tokenSeparators&&null==e.tokenizer||(e.dataAdapter=y.Decorate(e.dataAdapter,A)),null!=e.query){var t=u(e.amdBase+"compat/query");e.dataAdapter=y.Decorate(e.dataAdapter,t)}if(null!=e.initSelection){var n=u(e.amdBase+"compat/initSelection");e.dataAdapter=y.Decorate(e.dataAdapter,n)}}if(null==e.resultsAdapter&&(e.resultsAdapter=d,null!=e.ajax&&(e.resultsAdapter=y.Decorate(e.resultsAdapter,T)),null!=e.placeholder&&(e.resultsAdapter=y.Decorate(e.resultsAdapter,O)),e.selectOnClose&&(e.resultsAdapter=y.Decorate(e.resultsAdapter,L))),null==e.dropdownAdapter){if(e.multiple)e.dropdownAdapter=C;else{var i=y.Decorate(C,E);e.dropdownAdapter=i}if(0!==e.minimumResultsForSearch&&(e.dropdownAdapter=y.Decorate(e.dropdownAdapter,j)),e.closeOnSelect&&(e.dropdownAdapter=y.Decorate(e.dropdownAdapter,I)),null!=e.dropdownCssClass||null!=e.dropdownCss||null!=e.adaptDropdownCssClass){var r=u(e.amdBase+"compat/dropdownCss");e.dropdownAdapter=y.Decorate(e.dropdownAdapter,r)}e.dropdownAdapter=y.Decorate(e.dropdownAdapter,q)}if(null==e.selectionAdapter){if(e.multiple?e.selectionAdapter=h:e.selectionAdapter=p,null!=e.placeholder&&(e.selectionAdapter=y.Decorate(e.selectionAdapter,f)),e.allowClear&&(e.selectionAdapter=y.Decorate(e.selectionAdapter,g)),e.multiple&&(e.selectionAdapter=y.Decorate(e.selectionAdapter,m)),null!=e.containerCssClass||null!=e.containerCss||null!=e.adaptContainerCssClass){var o=u(e.amdBase+"compat/containerCss");e.selectionAdapter=y.Decorate(e.selectionAdapter,o)}e.selectionAdapter=y.Decorate(e.selectionAdapter,v)}e.language=this._resolveLanguage(e.language),e.language.push("en");for(var s=[],a=0;a<e.language.length;a++){var l=e.language[a];-1===s.indexOf(l)&&s.push(l)}return e.language=s,e.translations=this._processTranslations(e.language,e.debug),e},n.prototype.reset=function(){function a(e){return e.replace(/[^\u0000-\u007E]/g,function(e){return t[e]||e})}this.defaults={amdBase:"./",amdLanguageBase:"./i18n/",closeOnSelect:!0,debug:!1,dropdownAutoWidth:!1,escapeMarkup:y.escapeMarkup,language:{},matcher:function e(t,n){if(""===c.trim(t.term))return n;if(n.children&&0<n.children.length){for(var i=c.extend(!0,{},n),r=n.children.length-1;0<=r;r--)null==e(t,n.children[r])&&i.children.splice(r,1);return 0<i.children.length?i:e(t,i)}var o=a(n.text).toUpperCase(),s=a(t.term).toUpperCase();return-1<o.indexOf(s)?n:null},minimumInputLength:0,maximumInputLength:0,maximumSelectionLength:0,minimumResultsForSearch:0,selectOnClose:!1,scrollAfterSelect:!1,sorter:function(e){return e},templateResult:function(e){return e.text},templateSelection:function(e){return e.text},theme:"default",width:"resolve"}},n.prototype.applyFromElement=function(e,t){var n=e.language,i=this.defaults.language,r=t.prop("lang"),o=t.closest("[lang]").prop("lang"),s=Array.prototype.concat.call(this._resolveLanguage(r),this._resolveLanguage(n),this._resolveLanguage(i),this._resolveLanguage(o));return e.language=s,e},n.prototype._resolveLanguage=function(e){if(!e)return[];if(c.isEmptyObject(e))return[];if(c.isPlainObject(e))return[e];var t;t=c.isArray(e)?e:[e];for(var n=[],i=0;i<t.length;i++)if(n.push(t[i]),"string"==typeof t[i]&&0<t[i].indexOf("-")){var r=t[i].split("-")[0];n.push(r)}return n},n.prototype._processTranslations=function(e,t){for(var n=new s,i=0;i<e.length;i++){var r=new s,o=e[i];if("string"==typeof o)try{r=s.loadPath(o)}catch(e){try{o=this.defaults.amdLanguageBase+o,r=s.loadPath(o)}catch(e){t&&window.console&&console.warn&&console.warn('Select2: The language file for "'+o+'" could not be automatically loaded. A fallback will be used instead.')}}else r=c.isPlainObject(o)?new s(o):o;n.extend(r)}return n},n.prototype.set=function(e,t){var n={};n[c.camelCase(e)]=t;var i=y._convertData(n);c.extend(!0,this.defaults,i)},new n}),e.define("select2/options",["require","jquery","./defaults","./utils"],function(i,d,r,p){function e(e,t){if(this.options=e,null!=t&&this.fromElement(t),null!=t&&(this.options=r.applyFromElement(this.options,t)),this.options=r.apply(this.options),t&&t.is("input")){var n=i(this.get("amdBase")+"compat/inputData");this.options.dataAdapter=p.Decorate(this.options.dataAdapter,n)}}return e.prototype.fromElement=function(e){var t=["select2"];null==this.options.multiple&&(this.options.multiple=e.prop("multiple")),null==this.options.disabled&&(this.options.disabled=e.prop("disabled")),null==this.options.dir&&(e.prop("dir")?this.options.dir=e.prop("dir"):e.closest("[dir]").prop("dir")?this.options.dir=e.closest("[dir]").prop("dir"):this.options.dir="ltr"),e.prop("disabled",this.options.disabled),e.prop("multiple",this.options.multiple),p.GetData(e[0],"select2Tags")&&(this.options.debug&&window.console&&console.warn&&console.warn('Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'),p.StoreData(e[0],"data",p.GetData(e[0],"select2Tags")),p.StoreData(e[0],"tags",!0)),p.GetData(e[0],"ajaxUrl")&&(this.options.debug&&window.console&&console.warn&&console.warn("Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."),e.attr("ajax--url",p.GetData(e[0],"ajaxUrl")),p.StoreData(e[0],"ajax-Url",p.GetData(e[0],"ajaxUrl")));var n={};function i(e,t){return t.toUpperCase()}for(var r=0;r<e[0].attributes.length;r++){var o=e[0].attributes[r].name,s="data-";if(o.substr(0,s.length)==s){var a=o.substring(s.length),l=p.GetData(e[0],a);n[a.replace(/-([a-z])/g,i)]=l}}d.fn.jquery&&"1."==d.fn.jquery.substr(0,2)&&e[0].dataset&&(n=d.extend(!0,{},e[0].dataset,n));var c=d.extend(!0,{},p.GetData(e[0]),n);for(var u in c=p._convertData(c))-1<d.inArray(u,t)||(d.isPlainObject(this.options[u])?d.extend(this.options[u],c[u]):this.options[u]=c[u]);return this},e.prototype.get=function(e){return this.options[e]},e.prototype.set=function(e,t){this.options[e]=t},e}),e.define("select2/core",["jquery","./options","./utils","./keys"],function(o,c,u,i){var d=function(e,t){null!=u.GetData(e[0],"select2")&&u.GetData(e[0],"select2").destroy(),this.$element=e,this.id=this._generateId(e),t=t||{},this.options=new c(t,e),d.__super__.constructor.call(this);var n=e.attr("tabindex")||0;u.StoreData(e[0],"old-tabindex",n),e.attr("tabindex","-1");var i=this.options.get("dataAdapter");this.dataAdapter=new i(e,this.options);var r=this.render();this._placeContainer(r);var o=this.options.get("selectionAdapter");this.selection=new o(e,this.options),this.$selection=this.selection.render(),this.selection.position(this.$selection,r);var s=this.options.get("dropdownAdapter");this.dropdown=new s(e,this.options),this.$dropdown=this.dropdown.render(),this.dropdown.position(this.$dropdown,r);var a=this.options.get("resultsAdapter");this.results=new a(e,this.options,this.dataAdapter),this.$results=this.results.render(),this.results.position(this.$results,this.$dropdown);var l=this;this._bindAdapters(),this._registerDomEvents(),this._registerDataEvents(),this._registerSelectionEvents(),this._registerDropdownEvents(),this._registerResultsEvents(),this._registerEvents(),this.dataAdapter.current(function(e){l.trigger("selection:update",{data:e})}),e.addClass("select2-hidden-accessible"),e.attr("aria-hidden","true"),this._syncAttributes(),u.StoreData(e[0],"select2",this),e.data("select2",this)};return u.Extend(d,u.Observable),d.prototype._generateId=function(e){return"select2-"+(null!=e.attr("id")?e.attr("id"):null!=e.attr("name")?e.attr("name")+"-"+u.generateChars(2):u.generateChars(4)).replace(/(:|\.|\[|\]|,)/g,"")},d.prototype._placeContainer=function(e){e.insertAfter(this.$element);var t=this._resolveWidth(this.$element,this.options.get("width"));null!=t&&e.css("width",t)},d.prototype._resolveWidth=function(e,t){var n=/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;if("resolve"==t){var i=this._resolveWidth(e,"style");return null!=i?i:this._resolveWidth(e,"element")}if("element"==t){var r=e.outerWidth(!1);return r<=0?"auto":r+"px"}if("style"!=t)return"computedstyle"!=t?t:window.getComputedStyle(e[0]).width;var o=e.attr("style");if("string"!=typeof o)return null;for(var s=o.split(";"),a=0,l=s.length;a<l;a+=1){var c=s[a].replace(/\s/g,"").match(n);if(null!==c&&1<=c.length)return c[1]}return null},d.prototype._bindAdapters=function(){this.dataAdapter.bind(this,this.$container),this.selection.bind(this,this.$container),this.dropdown.bind(this,this.$container),this.results.bind(this,this.$container)},d.prototype._registerDomEvents=function(){var t=this;this.$element.on("change.select2",function(){t.dataAdapter.current(function(e){t.trigger("selection:update",{data:e})})}),this.$element.on("focus.select2",function(e){t.trigger("focus",e)}),this._syncA=u.bind(this._syncAttributes,this),this._syncS=u.bind(this._syncSubtree,this),this.$element[0].attachEvent&&this.$element[0].attachEvent("onpropertychange",this._syncA);var e=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;null!=e?(this._observer=new e(function(e){t._syncA(),t._syncS(null,e)}),this._observer.observe(this.$element[0],{attributes:!0,childList:!0,subtree:!1})):this.$element[0].addEventListener&&(this.$element[0].addEventListener("DOMAttrModified",t._syncA,!1),this.$element[0].addEventListener("DOMNodeInserted",t._syncS,!1),this.$element[0].addEventListener("DOMNodeRemoved",t._syncS,!1))},d.prototype._registerDataEvents=function(){var n=this;this.dataAdapter.on("*",function(e,t){n.trigger(e,t)})},d.prototype._registerSelectionEvents=function(){var n=this,i=["toggle","focus"];this.selection.on("toggle",function(){n.toggleDropdown()}),this.selection.on("focus",function(e){n.focus(e)}),this.selection.on("*",function(e,t){-1===o.inArray(e,i)&&n.trigger(e,t)})},d.prototype._registerDropdownEvents=function(){var n=this;this.dropdown.on("*",function(e,t){n.trigger(e,t)})},d.prototype._registerResultsEvents=function(){var n=this;this.results.on("*",function(e,t){n.trigger(e,t)})},d.prototype._registerEvents=function(){var n=this;this.on("open",function(){n.$container.addClass("select2-container--open")}),this.on("close",function(){n.$container.removeClass("select2-container--open")}),this.on("enable",function(){n.$container.removeClass("select2-container--disabled")}),this.on("disable",function(){n.$container.addClass("select2-container--disabled")}),this.on("blur",function(){n.$container.removeClass("select2-container--focus")}),this.on("query",function(t){n.isOpen()||n.trigger("open",{}),this.dataAdapter.query(t,function(e){n.trigger("results:all",{data:e,query:t})})}),this.on("query:append",function(t){this.dataAdapter.query(t,function(e){n.trigger("results:append",{data:e,query:t})})}),this.on("keypress",function(e){var t=e.which;n.isOpen()?t===i.ESC||t===i.TAB||t===i.UP&&e.altKey?(n.close(e),e.preventDefault()):t===i.ENTER?(n.trigger("results:select",{}),e.preventDefault()):t===i.SPACE&&e.ctrlKey?(n.trigger("results:toggle",{}),e.preventDefault()):t===i.UP?(n.trigger("results:previous",{}),e.preventDefault()):t===i.DOWN&&(n.trigger("results:next",{}),e.preventDefault()):(t===i.ENTER||t===i.SPACE||t===i.DOWN&&e.altKey)&&(n.open(),e.preventDefault())})},d.prototype._syncAttributes=function(){this.options.set("disabled",this.$element.prop("disabled")),this.isDisabled()?(this.isOpen()&&this.close(),this.trigger("disable",{})):this.trigger("enable",{})},d.prototype._isChangeMutation=function(e,t){var n=!1,i=this;if(!e||!e.target||"OPTION"===e.target.nodeName||"OPTGROUP"===e.target.nodeName){if(t)if(t.addedNodes&&0<t.addedNodes.length)for(var r=0;r<t.addedNodes.length;r++){t.addedNodes[r].selected&&(n=!0)}else t.removedNodes&&0<t.removedNodes.length?n=!0:o.isArray(t)&&o.each(t,function(e,t){if(i._isChangeMutation(e,t))return!(n=!0)});else n=!0;return n}},d.prototype._syncSubtree=function(e,t){var n=this._isChangeMutation(e,t),i=this;n&&this.dataAdapter.current(function(e){i.trigger("selection:update",{data:e})})},d.prototype.trigger=function(e,t){var n=d.__super__.trigger,i={open:"opening",close:"closing",select:"selecting",unselect:"unselecting",clear:"clearing"};if(void 0===t&&(t={}),e in i){var r=i[e],o={prevented:!1,name:e,args:t};if(n.call(this,r,o),o.prevented)return void(t.prevented=!0)}n.call(this,e,t)},d.prototype.toggleDropdown=function(){this.isDisabled()||(this.isOpen()?this.close():this.open())},d.prototype.open=function(){this.isOpen()||this.isDisabled()||this.trigger("query",{})},d.prototype.close=function(e){this.isOpen()&&this.trigger("close",{originalEvent:e})},d.prototype.isEnabled=function(){return!this.isDisabled()},d.prototype.isDisabled=function(){return this.options.get("disabled")},d.prototype.isOpen=function(){return this.$container.hasClass("select2-container--open")},d.prototype.hasFocus=function(){return this.$container.hasClass("select2-container--focus")},d.prototype.focus=function(e){this.hasFocus()||(this.$container.addClass("select2-container--focus"),this.trigger("focus",{}))},d.prototype.enable=function(e){this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'),null!=e&&0!==e.length||(e=[!0]);var t=!e[0];this.$element.prop("disabled",t)},d.prototype.data=function(){this.options.get("debug")&&0<arguments.length&&window.console&&console.warn&&console.warn('Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.');var t=[];return this.dataAdapter.current(function(e){t=e}),t},d.prototype.val=function(e){if(this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'),null==e||0===e.length)return this.$element.val();var t=e[0];o.isArray(t)&&(t=o.map(t,function(e){return e.toString()})),this.$element.val(t).trigger("input").trigger("change")},d.prototype.destroy=function(){this.$container.remove(),this.$element[0].detachEvent&&this.$element[0].detachEvent("onpropertychange",this._syncA),null!=this._observer?(this._observer.disconnect(),this._observer=null):this.$element[0].removeEventListener&&(this.$element[0].removeEventListener("DOMAttrModified",this._syncA,!1),this.$element[0].removeEventListener("DOMNodeInserted",this._syncS,!1),this.$element[0].removeEventListener("DOMNodeRemoved",this._syncS,!1)),this._syncA=null,this._syncS=null,this.$element.off(".select2"),this.$element.attr("tabindex",u.GetData(this.$element[0],"old-tabindex")),this.$element.removeClass("select2-hidden-accessible"),this.$element.attr("aria-hidden","false"),u.RemoveData(this.$element[0]),this.$element.removeData("select2"),this.dataAdapter.destroy(),this.selection.destroy(),this.dropdown.destroy(),this.results.destroy(),this.dataAdapter=null,this.selection=null,this.dropdown=null,this.results=null},d.prototype.render=function(){var e=o('<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>');return e.attr("dir",this.options.get("dir")),this.$container=e,this.$container.addClass("select2-container--"+this.options.get("theme")),u.StoreData(e[0],"element",this.$element),e},d}),e.define("select2/compat/utils",["jquery"],function(s){return{syncCssClasses:function(e,t,n){var i,r,o=[];(i=s.trim(e.attr("class")))&&s((i=""+i).split(/\s+/)).each(function(){0===this.indexOf("select2-")&&o.push(this)}),(i=s.trim(t.attr("class")))&&s((i=""+i).split(/\s+/)).each(function(){0!==this.indexOf("select2-")&&null!=(r=n(this))&&o.push(r)}),e.attr("class",o.join(" "))}}}),e.define("select2/compat/containerCss",["jquery","./utils"],function(s,a){function l(e){return null}function e(){}return e.prototype.render=function(e){var t=e.call(this),n=this.options.get("containerCssClass")||"";s.isFunction(n)&&(n=n(this.$element));var i=this.options.get("adaptContainerCssClass");if(i=i||l,-1!==n.indexOf(":all:")){n=n.replace(":all:","");var r=i;i=function(e){var t=r(e);return null!=t?t+" "+e:e}}var o=this.options.get("containerCss")||{};return s.isFunction(o)&&(o=o(this.$element)),a.syncCssClasses(t,this.$element,i),t.css(o),t.addClass(n),t},e}),e.define("select2/compat/dropdownCss",["jquery","./utils"],function(s,a){function l(e){return null}function e(){}return e.prototype.render=function(e){var t=e.call(this),n=this.options.get("dropdownCssClass")||"";s.isFunction(n)&&(n=n(this.$element));var i=this.options.get("adaptDropdownCssClass");if(i=i||l,-1!==n.indexOf(":all:")){n=n.replace(":all:","");var r=i;i=function(e){var t=r(e);return null!=t?t+" "+e:e}}var o=this.options.get("dropdownCss")||{};return s.isFunction(o)&&(o=o(this.$element)),a.syncCssClasses(t,this.$element,i),t.css(o),t.addClass(n),t},e}),e.define("select2/compat/initSelection",["jquery"],function(i){function e(e,t,n){n.get("debug")&&window.console&&console.warn&&console.warn("Select2: The `initSelection` option has been deprecated in favor of a custom data adapter that overrides the `current` method. This method is now called multiple times instead of a single time when the instance is initialized. Support will be removed for the `initSelection` option in future versions of Select2"),this.initSelection=n.get("initSelection"),this._isInitialized=!1,e.call(this,t,n)}return e.prototype.current=function(e,t){var n=this;this._isInitialized?e.call(this,t):this.initSelection.call(null,this.$element,function(e){n._isInitialized=!0,i.isArray(e)||(e=[e]),t(e)})},e}),e.define("select2/compat/inputData",["jquery","../utils"],function(s,i){function e(e,t,n){this._currentData=[],this._valueSeparator=n.get("valueSeparator")||",","hidden"===t.prop("type")&&n.get("debug")&&console&&console.warn&&console.warn("Select2: Using a hidden input with Select2 is no longer supported and may stop working in the future. It is recommended to use a `<select>` element instead."),e.call(this,t,n)}return e.prototype.current=function(e,t){function i(e,t){var n=[];return e.selected||-1!==s.inArray(e.id,t)?(e.selected=!0,n.push(e)):e.selected=!1,e.children&&n.push.apply(n,i(e.children,t)),n}for(var n=[],r=0;r<this._currentData.length;r++){var o=this._currentData[r];n.push.apply(n,i(o,this.$element.val().split(this._valueSeparator)))}t(n)},e.prototype.select=function(e,t){if(this.options.get("multiple")){var n=this.$element.val();n+=this._valueSeparator+t.id,this.$element.val(n),this.$element.trigger("input").trigger("change")}else this.current(function(e){s.map(e,function(e){e.selected=!1})}),this.$element.val(t.id),this.$element.trigger("input").trigger("change")},e.prototype.unselect=function(e,r){var o=this;r.selected=!1,this.current(function(e){for(var t=[],n=0;n<e.length;n++){var i=e[n];r.id!=i.id&&t.push(i.id)}o.$element.val(t.join(o._valueSeparator)),o.$element.trigger("input").trigger("change")})},e.prototype.query=function(e,t,n){for(var i=[],r=0;r<this._currentData.length;r++){var o=this._currentData[r],s=this.matches(t,o);null!==s&&i.push(s)}n({results:i})},e.prototype.addOptions=function(e,t){var n=s.map(t,function(e){return i.GetData(e[0],"data")});this._currentData.push.apply(this._currentData,n)},e}),e.define("select2/compat/matcher",["jquery"],function(s){return function(o){return function(e,t){var n=s.extend(!0,{},t);if(null==e.term||""===s.trim(e.term))return n;if(t.children){for(var i=t.children.length-1;0<=i;i--){var r=t.children[i];o(e.term,r.text,r)||n.children.splice(i,1)}if(0<n.children.length)return n}return o(e.term,t.text,t)?n:null}}}),e.define("select2/compat/query",[],function(){function e(e,t,n){n.get("debug")&&window.console&&console.warn&&console.warn("Select2: The `query` option has been deprecated in favor of a custom data adapter that overrides the `query` method. Support will be removed for the `query` option in future versions of Select2."),e.call(this,t,n)}return e.prototype.query=function(e,t,n){t.callback=n,this.options.get("query").call(null,t)},e}),e.define("select2/dropdown/attachContainer",[],function(){function e(e,t,n){e.call(this,t,n)}return e.prototype.position=function(e,t,n){n.find(".dropdown-wrapper").append(t),t.addClass("select2-dropdown--below"),n.addClass("select2-container--below")},e}),e.define("select2/dropdown/stopPropagation",[],function(){function e(){}return e.prototype.bind=function(e,t,n){e.call(this,t,n);this.$dropdown.on(["blur","change","click","dblclick","focus","focusin","focusout","input","keydown","keyup","keypress","mousedown","mouseenter","mouseleave","mousemove","mouseover","mouseup","search","touchend","touchstart"].join(" "),function(e){e.stopPropagation()})},e}),e.define("select2/selection/stopPropagation",[],function(){function e(){}return e.prototype.bind=function(e,t,n){e.call(this,t,n);this.$selection.on(["blur","change","click","dblclick","focus","focusin","focusout","input","keydown","keyup","keypress","mousedown","mouseenter","mouseleave","mousemove","mouseover","mouseup","search","touchend","touchstart"].join(" "),function(e){e.stopPropagation()})},e}),l=function(p){var h,f,e=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],t="onwheel"in document||9<=document.documentMode?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],g=Array.prototype.slice;if(p.event.fixHooks)for(var n=e.length;n;)p.event.fixHooks[e[--n]]=p.event.mouseHooks;var m=p.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var e=t.length;e;)this.addEventListener(t[--e],i,!1);else this.onmousewheel=i;p.data(this,"mousewheel-line-height",m.getLineHeight(this)),p.data(this,"mousewheel-page-height",m.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var e=t.length;e;)this.removeEventListener(t[--e],i,!1);else this.onmousewheel=null;p.removeData(this,"mousewheel-line-height"),p.removeData(this,"mousewheel-page-height")},getLineHeight:function(e){var t=p(e),n=t["offsetParent"in p.fn?"offsetParent":"parent"]();return n.length||(n=p("body")),parseInt(n.css("fontSize"),10)||parseInt(t.css("fontSize"),10)||16},getPageHeight:function(e){return p(e).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};function i(e){var t,n=e||window.event,i=g.call(arguments,1),r=0,o=0,s=0,a=0,l=0;if((e=p.event.fix(n)).type="mousewheel","detail"in n&&(s=-1*n.detail),"wheelDelta"in n&&(s=n.wheelDelta),"wheelDeltaY"in n&&(s=n.wheelDeltaY),"wheelDeltaX"in n&&(o=-1*n.wheelDeltaX),"axis"in n&&n.axis===n.HORIZONTAL_AXIS&&(o=-1*s,s=0),r=0===s?o:s,"deltaY"in n&&(r=s=-1*n.deltaY),"deltaX"in n&&(o=n.deltaX,0===s&&(r=-1*o)),0!==s||0!==o){if(1===n.deltaMode){var c=p.data(this,"mousewheel-line-height");r*=c,s*=c,o*=c}else if(2===n.deltaMode){var u=p.data(this,"mousewheel-page-height");r*=u,s*=u,o*=u}if(t=Math.max(Math.abs(s),Math.abs(o)),(!f||t<f)&&y(n,f=t)&&(f/=40),y(n,t)&&(r/=40,o/=40,s/=40),r=Math[1<=r?"floor":"ceil"](r/f),o=Math[1<=o?"floor":"ceil"](o/f),s=Math[1<=s?"floor":"ceil"](s/f),m.settings.normalizeOffset&&this.getBoundingClientRect){var d=this.getBoundingClientRect();a=e.clientX-d.left,l=e.clientY-d.top}return e.deltaX=o,e.deltaY=s,e.deltaFactor=f,e.offsetX=a,e.offsetY=l,e.deltaMode=0,i.unshift(e,r,o,s),h&&clearTimeout(h),h=setTimeout(v,200),(p.event.dispatch||p.event.handle).apply(this,i)}}function v(){f=null}function y(e,t){return m.settings.adjustOldDeltas&&"mousewheel"===e.type&&t%120==0}p.fn.extend({mousewheel:function(e){return e?this.bind("mousewheel",e):this.trigger("mousewheel")},unmousewheel:function(e){return this.unbind("mousewheel",e)}})},"function"==typeof e.define&&e.define.amd?e.define("jquery-mousewheel",["jquery"],l):"object"==typeof exports?module.exports=l:l(d),e.define("jquery.select2",["jquery","jquery-mousewheel","./select2/core","./select2/defaults","./select2/utils"],function(r,e,o,t,s){if(null==r.fn.select2){var a=["open","close","destroy"];r.fn.select2=function(t){if("object"==typeof(t=t||{}))return this.each(function(){var e=r.extend(!0,{},t);new o(r(this),e)}),this;if("string"!=typeof t)throw new Error("Invalid arguments for Select2: "+t);var n,i=Array.prototype.slice.call(arguments,1);return this.each(function(){var e=s.GetData(this,"select2");null==e&&window.console&&console.error&&console.error("The select2('"+t+"') method was called on an element that is not using Select2."),n=e[t].apply(e,i)}),-1<r.inArray(t,a)?this:n}}return null==r.fn.select2.defaults&&(r.fn.select2.defaults=t),o}),{define:e.define,require:e.require}}(),t=e.require("jquery.select2");return d.fn.select2.amd=e,t});;;
/*! Select2 4.0.13 | https://github.com/select2/select2/blob/master/LICENSE.md */!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var n=jQuery.fn.select2.amd;n.define("select2/i18n/pl",[],function(){var n=["znak","znaki","znaków"],e=["element","elementy","elementów"],r=function(n,e){return 1===n?e[0]:n>1&&n<=4?e[1]:n>=5?e[2]:void 0};return{errorLoading:function(){return"Nie można załadować wyników."},inputTooLong:function(e){var t=e.input.length-e.maximum;return"Usuń "+t+" "+r(t,n)},inputTooShort:function(e){var t=e.minimum-e.input.length;return"Podaj przynajmniej "+t+" "+r(t,n)},loadingMore:function(){return"Trwa ładowanie…"},maximumSelected:function(n){return"Możesz zaznaczyć tylko "+n.maximum+" "+r(n.maximum,e)},noResults:function(){return"Brak wyników"},searching:function(){return"Trwa wyszukiwanie…"},removeAllItems:function(){return"Usuń wszystkie przedmioty"}}}),n.define,n.require}();;;
/*!
 * @copyright Copyright &copy; Kartik Visweswaran, Krajee.com, 2014 - 2021
 * @version 2.2.2
 *
 * Additional enhancements for Select2 widget extension for Yii 2.0.
 *
 * Author: Kartik Visweswaran
 * For more JQuery plugins visit http://plugins.krajee.com
 * For more Yii related demos visit http://demos.krajee.com
 */ var initS2ToggleAll=function(){},initS2Order=function(){},initS2Loading=function(){},initS2Change=function(){},initS2Unselect=function(){};!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof module&&module.exports?module.exports=e(require("jquery")):e(window.jQuery)}(function(g){"use strict";initS2ToggleAll=function(l){var s,o=g("#"+l),t="#s2-togall-"+l,i=g(t);o.attr("multiple")&&(s=function(){i.off(".krajees2").on("click.krajees2",function(){var e,t,n=i.hasClass("s2-togall-select"),s=n?"selectall":"unselectall";g("#select2-"+l+'-results .select2-results__option[role="option"]').each(function(){(e=g(this).attr("id").match(/^select2-\S*-result-.{4}-(.*)$/)).length&&e[1]&&(t=e[1],o.find('option:not([disabled])[value="'+t+'"]').prop("selected",!!n))}),o.select2("close").trigger("krajeeselect2:"+s).trigger("change")})},o.on("select2:open.krajees2",function(){var e="input.krajees2 keyup.krajees2";i.parent().attr("id")!=="parent-"+t&&o.attr("multiple")&&(g("#select2-"+l+"-results").closest(".select2-dropdown").prepend(i),g("#parent-"+t).remove(),g(this).parent().find(".select2-search__field").off(e).on(e,function(){setTimeout(function(){var e="#select2-"+l+'-results .select2-results__option[role="option"]',t=e+'[aria-selected="true"]',n=g(e).length;i.removeClass("s2-togall-select s2-togall-unselect"),0<n&&g(t).length===n?i.addClass("s2-togall-unselect"):i.addClass("s2-togall-select"),s()},100)}))}).on("change.krajees2",function(){var e,t;o.attr("multiple")&&(e=0,t=o.val()?o.val().length:0,i.removeClass("s2-togall-select s2-togall-unselect"),o.find("option:enabled").each(function(){g(this).val().length&&e++}),0===e||t!==e?i.addClass("s2-togall-select"):i.addClass("s2-togall-unselect"),s())}),s())},initS2Change=function(e){e=e||g(this);var t,n,s=g(".select2-container--open"),l=e.parents("[class*='has-']");if(l.length)for(t=l[0].className.split(/\s+/),n=0;n<t.length;n++)t[n].match("has-")&&s.removeClass("has-success has-error has-warning").addClass(t[n])},initS2Unselect=function(){var e=g(this),t=e.data("select2");t&&t.options&&(t.options.set("disabled",!0),setTimeout(function(){t.options.set("disabled",!1),e.trigger("krajeeselect2:cleared")},1))},initS2Order=function(e,t){var n=g("#"+e);t&&t.length&&(g.each(t,function(e,t){n.find('option[value="'+t+'"]').appendTo(n)}),n.find("option:not(:selected)").appendTo(n))},initS2Loading=function(e,t){var n=window[t]||{},s=n.themeCss,l=n.sizeCss,o=n.doOrder,i=n.doReset,a=n.doToggle,r=g("#"+e),c=g(s),u=g(".kv-plugin-loading.loading-"+e),d=g(".group-"+e);r.off(".krajees2"),c.length||r.show(),d.length&&d.removeClass("kv-input-group-hide").removeClass(".group-"+e),u.length&&u.remove(),l&&r.next(s).removeClass(l).addClass(l),i&&r.closest("form").off(".krajees2").on("reset.krajees2",function(){setTimeout(function(){r.trigger("change").trigger("krajeeselect2:reset")},100)}),a&&initS2ToggleAll(e),o&&r.on("select2:select.krajees2 select2:unselect.krajees2",function(e){var t=g(e.params.data.element);t&&t.length&&(t.detach(),r.append(t).find("option:not(:selected)").appendTo(r))}),r.on("change.krajees2",function(){setTimeout(initS2Change,500)}).on("select2:unselecting.krajees2",initS2Unselect),setTimeout(function(){r.attr("multiple")&&"rtl"===r.attr("dir")&&(r.parent().find(".select2-search__field").css({width:"100%",direction:"rtl"}),r.parent().find(".select2-search--inline").css({float:"none"}))},100)}});;;
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
 * Copyright 2012, Chris Wanstrath
 * Released under the MIT License
 * https://github.com/defunkt/jquery-pjax
 */
(function($){function fnPjax(selector,container,options){options=optionsFor(container,options)
var handler=function(event){var opts=options
if(!opts.container){opts=$.extend({history:true},options)
opts.container=$(this).attr('data-pjax')}
handleClick(event,opts)}
$(selector).removeClass('data-pjax');return this.off('click.pjax',selector,handler).on('click.pjax',selector,handler);}
function handleClick(event,container,options){options=optionsFor(container,options)
var link=event.currentTarget
var $link=$(link)
if(parseInt($link.data('pjax'))===0){return}
if(link.tagName.toUpperCase()!=='A')
throw"$.fn.pjax or $.pjax.click requires an anchor element"
if(event.which>1||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)
return
if(location.protocol!==link.protocol||location.hostname!==link.hostname)
return
if(link.href.indexOf('#')>-1&&stripHash(link)==stripHash(location))
return
if(event.isDefaultPrevented())
return
var defaults={url:link.href,container:$link.attr('data-pjax'),target:link}
var opts=$.extend({},defaults,options)
var clickEvent=$.Event('pjax:click')
$link.trigger(clickEvent,[opts])
if(!clickEvent.isDefaultPrevented()){pjax(opts)
event.preventDefault()
$link.trigger('pjax:clicked',[opts])}}
function handleSubmit(event,container,options){if(event.result===false)
return false;options=optionsFor(container,options)
var form=event.currentTarget
var $form=$(form)
if(form.tagName.toUpperCase()!=='FORM')
throw"$.pjax.submit requires a form element"
var defaults={type:($form.attr('method')||'GET').toUpperCase(),url:$form.attr('action'),container:$form.attr('data-pjax'),target:form}
if(defaults.type!=='GET'&&window.FormData!==undefined){defaults.data=new FormData(form)
defaults.processData=false
defaults.contentType=false}else{if($form.find(':file').length){return}
defaults.data=$form.serializeArray()}
pjax($.extend({},defaults,options))
event.preventDefault()}
function pjax(options){options=$.extend(true,{},$.ajaxSettings,pjax.defaults,options)
if($.isFunction(options.url)){options.url=options.url()}
var hash=parseURL(options.url).hash
var containerType=$.type(options.container)
if(containerType!=='string'){throw"expected string value for 'container' option; got "+containerType}
var context=options.context=$(options.container)
if(!context.length){throw"the container selector '"+options.container+"' did not match anything"}
if(!options.data)options.data={}
if($.isArray(options.data)){options.data=$.grep(options.data,function(obj){return'_pjax'!==obj.name})
options.data.push({name:'_pjax',value:options.container})}else{options.data._pjax=options.container}
function fire(type,args,props){if(!props)props={}
props.relatedTarget=options.target
var event=$.Event(type,props)
context.trigger(event,args)
return!event.isDefaultPrevented()}
var timeoutTimer
options.beforeSend=function(xhr,settings){if(settings.type!=='GET'){settings.timeout=0}
xhr.setRequestHeader('X-PJAX','true')
xhr.setRequestHeader('X-PJAX-Container',options.container)
if(settings.ieRedirectCompatibility){var ua=window.navigator.userAgent
if(ua.indexOf('MSIE ')>0||ua.indexOf('Trident/')>0||ua.indexOf('Edge/')>0){xhr.setRequestHeader('X-Ie-Redirect-Compatibility','true')}}
if(!fire('pjax:beforeSend',[xhr,settings]))
return false
if(settings.timeout>0){timeoutTimer=setTimeout(function(){if(fire('pjax:timeout',[xhr,options]))
xhr.abort('timeout')},settings.timeout)
settings.timeout=0}
var url=parseURL(settings.url)
if(hash)url.hash=hash
options.requestUrl=stripInternalParams(url)}
options.complete=function(xhr,textStatus){if(timeoutTimer)
clearTimeout(timeoutTimer)
fire('pjax:complete',[xhr,textStatus,options])
fire('pjax:end',[xhr,options])}
options.error=function(xhr,textStatus,errorThrown){var container=extractContainer("",xhr,options)
var redirect=xhr.status>=301&&xhr.status<=303
var allowed=redirect||fire('pjax:error',[xhr,textStatus,errorThrown,options])
if(redirect||options.type=='GET'&&textStatus!=='abort'&&allowed){if(options.replaceRedirect){locationReplace(container.url)}else if(options.pushRedirect){window.history.pushState(null,"",container.url)
window.location.replace(container.url)}}}
options.success=function(data,status,xhr){var previousState=pjax.state
var currentVersion=typeof $.pjax.defaults.version==='function'?$.pjax.defaults.version():$.pjax.defaults.version
var latestVersion=xhr.getResponseHeader('X-PJAX-Version')
var container=extractContainer(data,xhr,options)
var url=parseURL(container.url)
if(hash){url.hash=hash
container.url=url.href}
if(currentVersion&&latestVersion&&currentVersion!==latestVersion){locationReplace(container.url)
return}
if(!container.contents){locationReplace(container.url)
return}
pjax.state={id:options.id||uniqueId(),url:container.url,title:container.title,container:options.container,fragment:options.fragment,timeout:options.timeout,cache:options.cache}
if(options.history&&(options.push||options.replace)){window.history.replaceState(pjax.state,container.title,container.url)}
var blurFocus=$.contains(context,document.activeElement)
if(blurFocus){try{document.activeElement.blur()}catch(e){}}
if(container.title)document.title=container.title
fire('pjax:beforeReplace',[container.contents,options],{state:pjax.state,previousState:previousState})
context.html(container.contents)
var autofocusEl=context.find('input[autofocus], textarea[autofocus]').last()[0]
if(autofocusEl&&document.activeElement!==autofocusEl){autofocusEl.focus()}
executeScriptTags(container.scripts,context)
loadLinkTags(container.links)
if(typeof options.scrollTo==='function'){var scrollTo=options.scrollTo(context,hash)}else{var scrollTo=options.scrollTo
if(hash||true===scrollTo){var name=decodeURIComponent(hash.slice(1))
var target=true===scrollTo?context:(document.getElementById(name)||document.getElementsByName(name)[0])
if(target)scrollTo=$(target).offset().top}}
if(typeof options.scrollOffset==='function')
var scrollOffset=options.scrollOffset(scrollTo)
else
var scrollOffset=options.scrollOffset
if(typeof scrollTo==='number'){scrollTo=scrollTo+scrollOffset;if(scrollTo<0)scrollTo=0
$(window).scrollTop(scrollTo)}
fire('pjax:success',[data,status,xhr,options])}
if(!pjax.state){pjax.state={id:uniqueId(),url:window.location.href,title:document.title,container:options.container,fragment:options.fragment,timeout:options.timeout,cache:options.cache}
if(options.history)
window.history.replaceState(pjax.state,document.title)}
if(pjax.xhr&&pjax.xhr.readyState<4&&pjax.options.skipOuterContainers){return}
abortXHR(pjax.xhr)
pjax.options=options
var xhr=pjax.xhr=$.ajax(options)
if(xhr.readyState>0){if(options.history&&(options.push&&!options.replace)){cachePush(pjax.state.id,[options.container,cloneContents(context)])
window.history.pushState(null,"",options.requestUrl)}
fire('pjax:start',[xhr,options])
fire('pjax:send',[xhr,options])}
return pjax.xhr}
function pjaxReload(container,options){var defaults={url:window.location.href,push:false,replace:true,scrollTo:false}
return pjax($.extend(defaults,optionsFor(container,options)))}
function locationReplace(url){if(!pjax.options.history)return
window.history.replaceState(null,"",pjax.state.url)
window.location.replace(url)}
var initialPop=true
var initialURL=window.location.href
var initialState=window.history.state
if(initialState&&initialState.container){pjax.state=initialState}
if('state'in window.history){initialPop=false}
function onPjaxPopstate(event){if(!initialPop){abortXHR(pjax.xhr)}
var previousState=pjax.state
var state=event.state
var direction
if(state&&state.container){if(initialPop&&initialURL==state.url)return
if(previousState){if(previousState.id===state.id)return
direction=previousState.id<state.id?'forward':'back'}
var cache=cacheMapping[state.id]||[]
var containerSelector=cache[0]||state.container
var container=$(containerSelector),contents=cache[1]
if(container.length){var options={id:state.id,url:state.url,container:containerSelector,push:false,fragment:state.fragment,timeout:state.timeout,cache:state.cache,scrollTo:false}
if(previousState&&options.cache){cachePop(direction,previousState.id,[containerSelector,cloneContents(container)])}
var popstateEvent=$.Event('pjax:popstate',{state:state,direction:direction})
container.trigger(popstateEvent)
if(contents){container.trigger('pjax:start',[null,options])
pjax.state=state
if(state.title)document.title=state.title
var beforeReplaceEvent=$.Event('pjax:beforeReplace',{state:state,previousState:previousState})
container.trigger(beforeReplaceEvent,[contents,options])
container.html(contents)
container.trigger('pjax:end',[null,options])}else{pjax(options)}
container[0].offsetHeight}else{locationReplace(location.href)}}
initialPop=false}
function fallbackPjax(options){var url=$.isFunction(options.url)?options.url():options.url,method=options.type?options.type.toUpperCase():'GET'
var form=$('<form>',{method:method==='GET'?'GET':'POST',action:url,style:'display:none'})
if(method!=='GET'&&method!=='POST'){form.append($('<input>',{type:'hidden',name:'_method',value:method.toLowerCase()}))}
var data=options.data
if(typeof data==='string'){$.each(data.split('&'),function(index,value){var pair=value.split('=')
form.append($('<input>',{type:'hidden',name:pair[0],value:pair[1]}))})}else if($.isArray(data)){$.each(data,function(index,value){form.append($('<input>',{type:'hidden',name:value.name,value:value.value}))})}else if(typeof data==='object'){var key
for(key in data)
form.append($('<input>',{type:'hidden',name:key,value:data[key]}))}
$(document.body).append(form)
form.submit()}
function abortXHR(xhr){if(xhr&&xhr.readyState<4){xhr.onreadystatechange=$.noop
xhr.abort()}}
function uniqueId(){return(new Date).getTime()}
function cloneContents(container){var cloned=container.clone()
cloned.find('script').each(function(){if(!this.src)$._data(this,'globalEval',false)})
return cloned.contents()}
function stripInternalParams(url){url.search=url.search.replace(/([?&])(_pjax|_)=[^&]*/g,'').replace(/^&/,'')
return url.href.replace(/\?($|#)/,'$1')}
function parseURL(url){var a=document.createElement('a')
a.href=url
return a}
function stripHash(location){return location.href.replace(/#.*/,'')}
function optionsFor(container,options){if(container&&options){options=$.extend({},options)
options.container=container
return options}else if($.isPlainObject(container)){return container}else{return{container:container}}}
function findAll(elems,selector){return elems.filter(selector).add(elems.find(selector))}
function parseHTML(html){return $.parseHTML(html,document,true)}
function extractContainer(data,xhr,options){var obj={},fullDocument=/<html/i.test(data)
var serverUrl=xhr.getResponseHeader('X-PJAX-URL')
obj.url=serverUrl?stripInternalParams(parseURL(serverUrl)):options.requestUrl
var $head,$body
if(fullDocument){$body=$(parseHTML(data.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0]))
var head=data.match(/<head[^>]*>([\s\S.]*)<\/head>/i)
$head=head!=null?$(parseHTML(head[0])):$body}else{$head=$body=$(parseHTML(data))}
if($body.length===0)
return obj
obj.title=findAll($head,'title').last().text()
if(options.fragment){var $fragment=$body
if(options.fragment!=='body'){$fragment=findAll($fragment,options.fragment).first()}
if($fragment.length){obj.contents=options.fragment==='body'?$fragment:$fragment.contents()
if(!obj.title)
obj.title=$fragment.attr('title')||$fragment.data('title')}}else if(!fullDocument){obj.contents=$body}
if(obj.contents){obj.contents=obj.contents.not(function(){return $(this).is('title')})
obj.contents.find('title').remove()
obj.scripts=findAll(obj.contents,'script').remove()
obj.contents=obj.contents.not(obj.scripts)
obj.links=findAll(obj.contents,'link[href]').remove()
obj.contents=obj.contents.not(obj.links)}
if(obj.title)obj.title=$.trim(obj.title)
return obj}
function executeScriptTags(scripts,context){if(!scripts)return
var existingScripts=$('script[src]')
var cb=function(next){var src=this.src
var matchedScripts=existingScripts.filter(function(){return this.src===src})
if(matchedScripts.length){next()
return}
if(src){$.getScript(src).done(next).fail(next)
document.head.appendChild(this)}else{context.append(this)
next()}}
var i=0
var next=function(){if(i>=scripts.length){return}
var script=scripts[i]
i++
cb.call(script,next)}
next()}
function loadLinkTags(links){if(!links)return
var existingLinks=$('link[href]')
links.each(function(){var href=this.href,alreadyLoadedLinks=existingLinks.filter(function(){return this.href===href})
if(alreadyLoadedLinks.length)return
document.head.appendChild(this)})}
var cacheMapping={}
var cacheForwardStack=[]
var cacheBackStack=[]
function cachePush(id,value){if(!pjax.options.cache){return}
cacheMapping[id]=value
cacheBackStack.push(id)
trimCacheStack(cacheForwardStack,0)
trimCacheStack(cacheBackStack,pjax.defaults.maxCacheLength)}
function cachePop(direction,id,value){var pushStack,popStack
cacheMapping[id]=value
if(direction==='forward'){pushStack=cacheBackStack
popStack=cacheForwardStack}else{pushStack=cacheForwardStack
popStack=cacheBackStack}
pushStack.push(id)
id=popStack.pop()
if(id)delete cacheMapping[id]
trimCacheStack(pushStack,pjax.defaults.maxCacheLength)}
function trimCacheStack(stack,length){while(stack.length>length)
delete cacheMapping[stack.shift()]}
function findVersion(){return $('meta').filter(function(){var name=$(this).attr('http-equiv')
return name&&name.toUpperCase()==='X-PJAX-VERSION'}).attr('content')}
function enable(){$.fn.pjax=fnPjax
$.pjax=pjax
$.pjax.enable=$.noop
$.pjax.disable=disable
$.pjax.click=handleClick
$.pjax.submit=handleSubmit
$.pjax.reload=pjaxReload
$.pjax.defaults={history:true,cache:true,timeout:650,push:true,replace:false,type:'GET',dataType:'html',scrollTo:0,scrollOffset:0,maxCacheLength:20,version:findVersion,pushRedirect:false,replaceRedirect:true,skipOuterContainers:false,ieRedirectCompatibility:true}
$(window).on('popstate.pjax',onPjaxPopstate)}
function disable(){$.fn.pjax=function(){return this}
$.pjax=fallbackPjax
$.pjax.enable=enable
$.pjax.disable=$.noop
$.pjax.click=$.noop
$.pjax.submit=$.noop
$.pjax.reload=function(){window.location.reload()}
$(window).off('popstate.pjax',onPjaxPopstate)}
if($.event.props&&$.inArray('state',$.event.props)<0){$.event.props.push('state')}else if(!('state'in $.Event.prototype)){$.event.addProp('state')}
$.support.pjax=window.history&&window.history.pushState&&window.history.replaceState&&!navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/)
if($.support.pjax){enable()}else{disable()}})(jQuery);;;$(document).ready(function(){});;