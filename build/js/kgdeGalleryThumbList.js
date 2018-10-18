'use strict';var KGDE=window.KGDE||{};KGDE.thumbListGallery={c:{items:[],classWrapper:'kgdeGalleryWrapper',/* thumblist classes */classThumbList:'kgdeGalleryThumbList',classUlAnimate:'sliderAnimation',classThumb:'kgdeGalleryThumb',classSelectedLi:'kgdeGallerySelected',/* buttons */classGoBack:'kgdeGalleryGoBack',classGoNext:'kgdeGalleryGoNext',/* view classes */classImages:'kgdeGalleryImages',classImage:'kgdeGalleryImage',classDescription:'kgdeGalleryDescription',currItem:null,isInterrupted:!1,clickDetected:!1,resizeRun:null,transitionRun:null,loadViewImageRun:null,isSmallDevice:!1,callbackFunc:null,loadHeight:300// height to detect if image is complete
},init:function e(a){var b=this;this.c.isSmallDevice=!!KGDE.utils&&KGDE.utils.detectSmallDevice(),this.c.callbackFunc=a.callbackFunc||null;var c=document.getElementsByClassName(this.c.classWrapper),d=Array.prototype.slice.call(c);d.forEach(function(a,c){var d=a.getElementsByClassName(b.c.classThumbList)[0]||!1;d&&(a.dataset.galleryIndex=c,d.dataset.listIndex=c,b.addList(a,d,c),b.addView(a,c),b.getSizes(c),b.initNavi(c),b.displayViewImage(b.c.items[c]))}),window.addEventListener('resize',this,!1)},addList:function g(a,b,c){var d=b.getElementsByTagName('ul')[0]||!1;if(d){var e=d.getElementsByTagName('li'),f=Array.prototype.slice.call(e);this.c.items[c]={index:c,wrapper:a,thumbList:b,ul:d,lis:f,loadImage:null,views:[],fulls:[],infos:[],sources:[],currentImageIndex:0,pastImageIndex:0},this.prepareUl(d,c),this.prepareLis(f,c)}},addView:function e(a,b){var c=a.getElementsByClassName(this.c.classImages)[0]||!1,d=a.getElementsByClassName(this.c.classDescription)[0]||!1;this.c.items[b].images=c,this.c.items[b].description=d},getSizes:function j(a){var b=this.c.items[a],c=b.thumbList.offsetWidth,d=this.getLiPositions(b.lis),e=this.getLiWidths(b.lis),f=this.getUlWidth(e),g=e[0],h=Math.round(c/g),i=d.slice(0,d.length+1-h);this.c.items[a].thumbListWidth=c,this.c.items[a].ulWidth=f,this.c.items[a].liWidth=g,this.c.items[a].itemsVisible=h,this.c.items[a].liPositions=d,this.c.items[a].liAvailablePositions=i},prepareUl:function c(a,b){a.dataset.listIndex=b,this.prepareUlSlideData(b),this.setUlEvents(a)},setUlEvents:function b(a){switch(KGDE.utils.getDeviceType()){case'TOUCH':a.addEventListener('touchstart',this,!1),a.addEventListener('touchmove',this,!1),a.addEventListener('touchend',this,!1);break;case'POINTER':a.addEventListener('pointerdown',this,!1),a.addEventListener('pointermove',this,!1),a.addEventListener('pointerup',this,!1),a.addEventListener('pointerleave',this,!1);default:a.addEventListener('mousedown',this,!1),a.addEventListener('mousemove',this,!1),a.addEventListener('mouseup',this,!1),a.addEventListener('dragstart',this,!1),document.addEventListener('mousemove',this,!1);}},prepareUlSlideData:function b(a){this.c.items[a].slide={moveLeft:0,initialLeft:0,startX:0,startY:0,distX:0,distY:0,currX:0,currY:0,moveCnt:0,speed:0,startTime:0}},prepareLis:function d(a,b){var c=this;a.forEach(function(a,d){a.dataset.listIndex=b,a.dataset.imageIndex=d,c.setLiEvent(a),c.prepareThumb(a,b)})},setLiEvent:function b(a){a.addEventListener('click',this,!1)},prepareThumb:function i(a,b){var c=a.getElementsByClassName(this.c.classThumb)[0]||!1;if(c){var d=this.c.items[b],e=c.dataset.srcThumb||'',f=c.dataset.srcView||'',g=c.dataset.srcFull||'',h=c.innerHTML.replace(/(\<\/?)link/g,'$1a');d.views.push(f),d.fulls.push(g),d.infos.push(h),c.addEventListener('click',function(a){return a.preventDefault(),!1},!1),c.style.backgroundImage='url('+e+')'}},getLiPositions:function b(a){return a.map(function(a){return a.offsetLeft})},getLiWidths:function b(a){return a.map(function(a){return a.offsetWidth})},getUlWidth:function b(a){return a.reduce(function(a,b){return a+b},0)},dragstart:function f(a){var b=a.currentTarget,c=this.c.items[b.dataset.listIndex]||!1;if(!c)return!1;var d=c.slide,e=a.touches?a.touches[0]:!!a.changedTouches&&a.changedTouches[0];// get touch x if available or mouse x
return d.startX=e?e.pageX:a.clientX,d.startY=e?e.pageY:a.clientY,this.setCurrentMoveLeft(c),d.startTime=new Date().getTime(),d.initalLeft=d.moveLeft,this.c.currItem=c,this.c.clickDetected=!1,!1},drag:function e(a){// nothing to do
if(!this.c.currItem)return!0;var b=this.c.currItem.ul;if(a.currentTarget!==b)return this.dragend(a),!0;var c=this.c.currItem.slide,d=a.touches?a.touches[0]:!!a.changedTouches&&a.changedTouches[0];// get touch x/y if available or mouse x/y
// vertical move detected... do nothing
return!(c.currX=d?d.pageX:a.clientX,c.currY=d?d.pageY:a.clientY,c.distX=c.currX-c.startX,c.distY=c.currY-c.startY,!(Math.abs(c.distY)>Math.abs(c.distX)))||(a.preventDefault(),a.stopPropagation(),c.moveLeft=c.distX+c.initalLeft,b.style.transform='translate('+c.moveLeft+'px, 0)',c.moveCnt+=1,c.speed=Math.round(c.distX/c.moveCnt),!1);// horizontal move detected, continue with sliding
},dragend:function e(a){// nothing to do
if(!this.c.currItem)return!0;var b=this.c.currItem.ul,c=this.c.currItem.slide,d=new Date().getTime()-c.startTime;// get duration between down and up
// detect click by short duration and missing move
return 300>d&&5>Math.abs(c.distX)&&5>Math.abs(c.distY)&&!this.c.isInterrupted?(this.c.clickDetected=!0,this.reset(),!0):(c.moveLeft=this.getEndpos(this.c.currItem,d),this.animDragend(this.c.currItem),this.reset(),a.preventDefault(),!0);// move end detected, calculate final xpos
},getEndpos:function j(a,b){var c=a.slide,d=0<c.speed?'toStart':'toEnd',e='toEnd'===d?a.liWidth/1.5:a.liWidth/2.5,f=10*Math.abs(c.speed/b),g=Math.round(f)*a.liWidth*('toEnd'===d?1:-1),h=Math.abs(c.moveLeft)+e+g,i=a.liAvailablePositions.filter(function(a){return h>a}).pop()||0;return-1*i},animDragend:function c(a){var b=this;// as you can't trust transitionend...
a.ul.classList.add(this.c.classUlAnimate),a.ul.style.transform='translate('+a.slide.moveLeft+'px, 0)',clearTimeout(this.c.transitionRun),this.c.transitionRun=setTimeout(function(){a.ul.classList.contains(b.c.classUlAnimate)&&a.ul.classList.remove(b.c.classUlAnimate)},500)},setCurrentMoveLeft:function d(a){/**
             * seems that the animation was not finished
             * get current position from WebKitCSSMatrix
             * set as moveLeft to continue from there...
             *
             */if(a.ul.classList.contains(this.c.classUlAnimate)){var b=window.getComputedStyle(a.ul),c=new WebKitCSSMatrix(b.webkitTransform);a.ul.classList.remove(this.c.classUlAnimate),a.slide.moveLeft=c.m41,a.ul.style.transform='translate('+a.slide.moveLeft+'px, 0)',this.c.isInterrupted=!0}},reset:function b(){// nothing to do
if(!this.c.currItem)return!0;var a=this.c.currItem.slide;a.startX=!1,a.startY=!1,a.currX=0,a.currY=0,a.distX=0,a.distY=0,a.moveCnt=0,a.speed=0,a.startTime=0,this.c.currItem=!1,this.c.isInterrupted=!1},initNavi:function g(a){var b=this,c=this.c.items[a],d=c.thumbList,e=d.getElementsByClassName(this.c.classGoBack),f=d.getElementsByClassName(this.c.classGoNext);e.length&&f.length&&(e[0].addEventListener('click',function(){b.goBack(a)},!1),f[0].addEventListener('click',function(){b.goNext(a)},!1))},goBack:function e(a){var b=this.c.items[a],c=this.getCurrentOffsetIndex(b),d=0<c?c-1:0;b.slide.moveLeft=-1*b.liAvailablePositions[d],this.animDragend(b)},goNext:function e(a){var b=this.c.items[a],c=this.getCurrentOffsetIndex(b),d=c<b.liAvailablePositions.length-1?c+1:c;b.slide.moveLeft=-1*b.liAvailablePositions[d],this.animDragend(b)},getCurrentOffsetIndex:function d(a){var b=a.slide.moveLeft,c=0;return a.liAvailablePositions.forEach(function(a,d){if(a===Math.abs(b))return void(c=d)}),c},avoidGhostDragging:function b(a){return a.preventDefault(),!1},liClick:function c(a){if(!this.c.clickDetected)return!1;var b=a.currentTarget;this.prepareViewDisplay(b)},prepareViewDisplay:function f(a){var b=this,c=this.c.items[a.dataset.listIndex],d=a.getElementsByClassName(this.c.classThumb)[0]||!1;if(d){clearInterval(this.c.loadViewImageRun),c.pastImageIndex=c.currentImageIndex,c.currentImageIndex=a.dataset.imageIndex,c.loadImage=new Image,c.loadImage.src=c.views[c.currentImageIndex];var e=0;this.c.loadViewImageRun=setInterval(function(){b.loadViewImage(c,e++)},100)}},loadViewImage:function d(a,b){// check if new image is complete
var c=a.loadImage.height>this.c.loadHeight;(c||40<b)&&(clearInterval(this.c.loadViewImageRun),c?this.displayViewImage(a):a.currentImageIndex=a.pastImageIndex,a.loadImage=null)},displayViewImage:function g(a){var b=this;if(a.images&&a.description){var c=a.currentImageIndex,d=a.images.getElementsByClassName(this.c.classImage);1<d.length&&a.images.removeChild(d[0]);var e=document.createElement('div');e.classList.add(this.c.classImage);var f=document.createElement('img');f.src=a.views[c],e.appendChild(f),a.images.appendChild(e),a.description.innerHTML=a.infos[c],this.setSelectedThumb(a),this.c.callbackFunc&&f.addEventListener('click',function(){var d={index:c,list:b.c.isSmallDevice?a.views:a.fulls,sync:b.callback2Sync(a.index)};b.c.callbackFunc(d)},!1)}},callback2Sync:function c(a){var b=this;return function(c){b.syncWithViewer(a,c)}},syncWithViewer:function d(a,b){var c=this.c.items[a];c.pastImageIndex=c.currentImageIndex,c.currentImageIndex=b,this.displayViewImage(c),this.moveSelectedInSight(c)},setSelectedThumb:function d(a){var b=a.lis[a.pastImageIndex],c=a.lis[a.currentImageIndex];b.classList.contains(this.c.classSelectedLi)&&b.classList.remove(this.c.classSelectedLi),c.classList.add(this.c.classSelectedLi)},moveSelectedInSight:function b(a){a.slide.moveLeft=a.currentImageIndex<a.liAvailablePositions.length?-1*a.liAvailablePositions[a.currentImageIndex]:-1*a.liAvailablePositions[a.liAvailablePositions.length-1],this.animDragend(a)},resizeHandler:function b(){var a=this;clearTimeout(this.c.resizeRun),this.c.resizeRun=setTimeout(function(){for(var b=a.c.items.length,c=0;c<b;c+=1)a.getSizes(c),a.moveSelectedInSight(a.c.items[c])},200)},handleEvent:function b(a){// we do not need a rightclick
if(0<a.button||a.ctrlKey)return!0;// set touch flag to avoid double events on mobile devices
switch(a.type){case'click':return this.liClick(a);case'pointerdown':case'touchstart':return this.dragstart(a);case'pointermove':case'touchmove':return this.drag(a);case'pointerup':case'pointerleave':case'touchend':return this.dragend(a);case'mousedown':return this.dragstart(a);case'mousemove':return this.drag(a);case'mouseup':return this.dragend(a);case'dragstart':return this.avoidGhostDragging(a);case'resize':return this.resizeHandler(a);}return!1}};