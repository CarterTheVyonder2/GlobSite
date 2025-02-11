
// 'stacks' is the Stacks global object.
// All of the other Stacks related Javascript will 
// be attatched to it.
var stacks = {};


// this call to jQuery gives us access to the globaal
// jQuery object. 
// 'noConflict' removes the '$' variable.
// 'true' removes the 'jQuery' variable.
// removing these globals reduces conflicts with other 
// jQuery versions that might be running on this page.
stacks.jQuery = jQuery.noConflict(true);

// Javascript for stacks_in_15_page0
// ---------------------------------------------------------------------

// Each stack has its own object with its own namespace.  The name of
// that object is the same as the stack's id.
stacks.stacks_in_15_page0 = {};

// A closure is defined and assigned to the stack's object.  The object
// is also passed in as 'stack' which gives you a shorthand for referring
// to this object from elsewhere.
stacks.stacks_in_15_page0 = (function(stack) {

	// When jQuery is used it will be available as $ and jQuery but only
	// inside the closure.
	var jQuery = stacks.jQuery;
	var $ = jQuery;
	
/*
	Background Stretcher jQuery Plugin
	� 2011 ajaxBlender.com
	For any questions please visit www.ajaxblender.com 
	or email us at support@ajaxblender.com
	
	Version: 2.0.1
*/
/*
	Adapted by RWExtras.com for use with Stacks plugin v2 for RapidWeaver
	Code � 2011 ajaxBlender.com
*/

(function() {
	/*  Variables  */
	var container = null;
	var allLIs = '', containerStr = '';
	
	var element = this;
	var _bgStretcherPause = false;
	var _bgStretcherAction = false;
	var _bgStretcherTm = null;
	var random_line = new Array();
	var random_temp = new Array();
	var r_image = 0;
	var swf_mode = false;
	var img_options = new Array();
	
	jQuery.fn.bgStretcher = function(settings){		
		if (jQuery('.bgstretcher-page').length || jQuery('.bgstretcher-area').length) {
			if(typeof(console) !== 'undefined' && console != null) console.log('More than one bgStretcher'); 
			return false;
		}
		settings = jQuery.extend({}, jQuery.fn.bgStretcher.defaults, settings);
		jQuery.fn.bgStretcher.settings = settings;
		
		function _build(body_content){
			if(!settings.images.length){ return; }
			
			_genHtml(body_content);

			containerStr = '#' + settings.imageContainer;
			container = jQuery(containerStr);
			allLIs = '#' + settings.imageContainer + ' LI';
			jQuery(allLIs).hide().css({'z-index': 1, overflow: 'hidden'});
			
			if(!container.length){ return; }
			jQuery(window).resize(function(){
				_resize(body_content)
			});
			
			_resize(body_content);
			
			var stratElement = 0;
			/*  Rebuild images for simpleSlide  */
			if (settings.transitionEffect == 'simpleSlide') {
				if (settings.sequenceMode == 'random') {
					if(typeof(console) !== 'undefined' && console != null) {
						console.log('Effect \'simpleSlide\' don\'t use with mode random.');
						console.log('Mode was automatically set in normal.');
					}
				}
				jQuery(allLIs).css({'float': 'left', position: 'static'});
				jQuery(allLIs).show(); //MS fadeIn
				if (jQuery.fn.bgStretcher.settings.slideDirection == 'NW' || jQuery.fn.bgStretcher.settings.slideDirection == 'NE') {
					jQuery.fn.bgStretcher.settings.slideDirection = 'N';
				}
				if (jQuery.fn.bgStretcher.settings.slideDirection == 'SW' || jQuery.fn.bgStretcher.settings.slideDirection == 'SE') {
					jQuery.fn.bgStretcher.settings.slideDirection = 'S';
				}
				if (jQuery.fn.bgStretcher.settings.slideDirection == 'S' || jQuery.fn.bgStretcher.settings.slideDirection == 'E') {
					settings.sequenceMode = 'back';
					jQuery(allLIs).removeClass('bgs-current');
					jQuery(allLIs).eq(jQuery(allLIs).length - jQuery.fn.bgStretcher.settings.startElementIndex - 1).addClass('bgs-current');
					if (jQuery.fn.bgStretcher.settings.slideDirection == 'E') {
						l = jQuery(containerStr + ' LI').index(jQuery(containerStr + ' LI.bgs-current')) * jQuery(containerStr).width()*(-1);
						t = 0;
					} else { // S
						t = jQuery(containerStr + ' LI').index(jQuery(containerStr + ' LI.bgs-current')) * jQuery(containerStr).height()*(-1);
						l = 0;
					}
					jQuery(containerStr+' UL').css({left: l+'px', top: t+'px'});
				} else {
					settings.sequenceMode = 'normal';
					if (jQuery.fn.bgStretcher.settings.startElementIndex != 0) {
						if (jQuery.fn.bgStretcher.settings.slideDirection == 'N') {
							t = jQuery(containerStr + ' LI').index(jQuery(containerStr + ' LI.bgs-current')) * jQuery(containerStr).height()*(-1);
							l = 0;
						} else { // W
							l = jQuery(containerStr + ' LI').index(jQuery(containerStr + ' LI.bgs-current')) * jQuery(containerStr).width()*(-1);
							t = 0;
							console.log(l);
						}
						jQuery(containerStr+' UL').css({left: l+'px', top: t+'px'});
					}
				}
			}
			
			if (jQuery(settings.buttonNext).length || jQuery(settings.buttonPrev).length || jQuery(settings.pagination).length){
				if (settings.sequenceMode == 'random') {
					if(typeof(console) !== 'undefined' && console != null) {
						console.log('Don\'t use random mode width prev-button, next-button and pagination.');
					}
				} else {
					/*  Prev and Next Buttons init  */
					if (jQuery(settings.buttonPrev).length){
						jQuery(settings.buttonPrev).addClass('bgStretcherNav bgStretcherNavPrev');
						jQuery(settings.buttonPrev).click(function(){
							jQuery.fn.bgStretcher.buttonSlide('prev');
						});
					}
					if (jQuery(settings.buttonNext).length){
						jQuery(settings.buttonNext).addClass('bgStretcherNav bgStretcherNavNext');
						jQuery(settings.buttonNext).click(function(){
							jQuery.fn.bgStretcher.buttonSlide('next');
						});
					}
					/*  Pagination  */
					if (jQuery(settings.pagination).length) {
						jQuery.fn.bgStretcher.pagination();
					}
				}
			}
			
			/*  Random mode init  */
			if (settings.sequenceMode == 'random') {
				var i = Math.floor(Math.random()*jQuery(allLIs).length);
				jQuery.fn.bgStretcher.buildRandom(i);
				if (settings.transitionEffect != 'simpleSlide') {
					jQuery.fn.bgStretcher.settings.startElementIndex = i;
				}
				stratElement = i;
			} else {
				if (jQuery.fn.bgStretcher.settings.startElementIndex > (jQuery(allLIs).length - 1)) jQuery.fn.bgStretcher.settings.startElementIndex = 0;
				stratElement = jQuery.fn.bgStretcher.settings.startElementIndex;
				if (settings.transitionEffect == 'simpleSlide') {
					if (jQuery.fn.bgStretcher.settings.slideDirection == 'S' || jQuery.fn.bgStretcher.settings.slideDirection == 'E') {
						stratElement = jQuery(allLIs).length - 1 - jQuery.fn.bgStretcher.settings.startElementIndex;
					}
				}
			}
			
			jQuery(allLIs).eq(stratElement).fadeIn('normal').addClass('bgs-current'); //MS fadeIn
			jQuery.fn.bgStretcher.loadImg(jQuery(allLIs).eq(stratElement));
			
			/*  Go slideshow  */
			if(settings.slideShow && jQuery(allLIs).length > 1){
				setTimeout(function(){
				jQuery.fn.bgStretcher.slideShow(jQuery.fn.bgStretcher.settings.sequenceMode, -1)
				}, jQuery.fn.bgStretcher.settings.nextSlideDelay);
			}
		};
		
		function _resize(body_content){
			var winW = 0;
			var winH = 0;
			var contH = 0;
			var contW = 0;
			
			if (jQuery('BODY').hasClass('bgStretcher-container')) {
				winW = jQuery(window).width();
				winH = jQuery(window).height(); 
				if ((jQuery.browser.msie) && (parseInt(jQuery.browser.version) == 6)) {
					jQuery(window).scroll(function(){
						jQuery('#'+settings.imageContainer).css('top', jQuery(window).scrollTop());
					});					
				}
			} else {
				jQuery('.bgstretcher').css('position', 'absolute').css('top', '0px');
				winW = body_content.width();
				winH = body_content.height(); 
			}
			
			var imgW = 0, imgH = 0;
			var leftSpace = 0;
			
			//	Max image size
			if(settings.maxWidth != 'auto'){
				if (winW > settings.maxWidth){
					leftSpace = (winW - settings.maxWidth)/2;
					contW = settings.maxWidth;
				} else contW = winW;
			} else contW = winW;
			if(settings.maxHeight != 'auto'){
				if (winH > settings.maxHeight){
					contH = settings.maxHeight;
				} else contH = winH;
			} else contH = winH;
			
			//	Update container's size
			container.width(contW);
			container.height(contH);
			
			//	Non-proportional resize
			if(!settings.resizeProportionally){
				imgW = contH;
				imgH = contH;
			} else {
				var initW = settings.imageWidth, initH = settings.imageHeight;
				var ratio = initH / initW;
				
				imgW = contW;
				imgH = Math.round(contW * ratio);
				
				if(imgH < contH){
					imgH = contH;
					imgW = Math.round(imgH / ratio);
				}
			}
			
			// Anchoring
			var mar_left = 0;
			var mar_top = 0;
			var anchor_arr;
			if (jQuery.fn.bgStretcher.settings.anchoring != 'left top') {
				anchor_arr = (jQuery.fn.bgStretcher.settings.anchoring).split(' ');
				if (anchor_arr[0] == 'right') {
					mar_left = (winW - contW);
				} else {
					if (anchor_arr[0] == 'center') mar_left = Math.round((winW - contW)/2);
				}
				if (anchor_arr[1] == 'bottom') {
					mar_top = (winH - contH);
				} else {
					if (anchor_arr[1] == 'center') {
						mar_top = Math.round((winH - contH)/2);
					}
				}
				container.css('marginLeft', mar_left+'px').css('marginTop', mar_top+'px');
			}
			mar_left = 0;
			mar_top = 0;
			if (jQuery.fn.bgStretcher.settings.anchoringImg != 'left top') {
				anchor_arr = (jQuery.fn.bgStretcher.settings.anchoringImg).split(' ');
				if (anchor_arr[0] == 'right') {
					mar_left = (contW - imgW);
				} else {
					if (anchor_arr[0] == 'center') mar_left = Math.round((contW - imgW)/2);
				}
				if (anchor_arr[1] == 'bottom') {
					mar_top = (contH - imgH);
				} else {
					if (anchor_arr[1] == 'center') {
						mar_top = Math.round((contH - imgH)/2);
					}
				}
			}
			img_options['mar_left'] = mar_left;
			img_options['mar_top'] = mar_top;
			
			//	Apply new size for images
			if (container.find('LI:first').hasClass('swf-mode')) {
				
				var path_swf = container.find('LI:first').html();
				container.find('LI:first').html('<div id="bgstretcher-flash">&nbsp;</div>');
				
				var header = new SWFObject('flash/stars.swf', 'flash-obj', contW, contH, '9');
				header.addParam('wmode', 'transparent');
				header.write('bgstretcher-flash');
				
			}; 
			img_options['imgW'] = imgW;
			img_options['imgH'] = imgH;
			
			if(!settings.resizeAnimate){
				container.children('UL').children('LI.img-loaded').find('IMG').css({'marginLeft': img_options["mar_left"]+'px', 'marginTop': img_options["mar_top"]+'px'});
				container.children('UL').children('LI.img-loaded').find('IMG').css({'width': img_options["imgW"]+'px', 'height': img_options["imgH"]+'px'});
			} else {
				container.children('UL').children('LI.img-loaded').find('IMG').animate({'marginLeft': img_options["mar_left"]+'px', 'marginTop': img_options["mar_top"]+'px'}, 'normal');
				container.children('UL').children('LI.img-loaded').find('IMG').animate({'width': img_options["imgW"]+'px', 'height': img_options["imgH"]+'px'}, 'normal');
			}
			
			jQuery(allLIs).width(container.width()).height(container.height());
			
			if (jQuery.fn.bgStretcher.settings.transitionEffect == 'simpleSlide') {
				if (jQuery.fn.bgStretcher.settings.slideDirection == 'W' || jQuery.fn.bgStretcher.settings.slideDirection == 'E') {
					container.children('UL').width(container.width() * jQuery(allLIs).length).height(container.height());
					if ( jQuery(containerStr + ' LI').index(jQuery(containerStr + ' LI.bgs-current')) != -1 ){
						l = jQuery(containerStr + ' LI').index(jQuery(containerStr + ' LI.bgs-current')) * container.width()*(-1);
						container.children('UL').css({left: l+'px'});
					}
				} else {
					container.children('UL').height(container.height() * jQuery(allLIs).length).width(container.width());
					if ( jQuery(containerStr + ' LI').index(jQuery(containerStr + ' LI.bgs-current')) != -1 ){
						t = jQuery(containerStr + ' LI').index(jQuery(containerStr + ' LI.bgs-current')) * jQuery(containerStr).height()*(-1);
						container.children('UL').css({top: t+'px'});
					}
				}
			}
			
		};
		
		function _genHtml(body_content){
			var code = '';
			var cur_bgstretcher;

			body_content.each(function(){
				jQuery(this).wrapInner('<div class="bgstretcher-page" />').wrapInner('<div class="bgstretcher-area" />');
				code = '<div id="' + settings.imageContainer + '" class="bgstretcher"><ul>';
				// if swf
				if (settings.images.length) {
					var ext = settings.images[0].split('.');
					ext = ext[ext.length-1];
					
					if (ext != 'swf') {
						var ind = 0;
						for(i = 0; i < settings.images.length; i++){
							if (settings.transitionEffect == 'simpleSlide' && settings.sequenceMode == 'back') 
								ind = settings.images.length-1-i;
									else ind = i;
							if (jQuery.fn.bgStretcher.settings.preloadImg) {
									code += '<li><span class="image-path">' + settings.images[ind] + '</span></li>';
								} else {
									code += '<li class="img-loaded"><img src="' + settings.images[ind] + '" alt="" /></li>';
								}		
						}
					} else {
						code += '<li class="swf-mode">' + settings.images[0] + '</li>';	
					}
				}
				
				code += '</ul></div>';
				cur_bgstretcher = jQuery(this).children('.bgstretcher-area');
				jQuery(code).prependTo(cur_bgstretcher);
				cur_bgstretcher.css({position: 'relative'});
				cur_bgstretcher.children('.bgstretcher-page').css({'position': 'relative', 'z-index': 3});
			});

		};
		
		/*  Start bgStretcher  */
		this.addClass('bgStretcher-container');
		_build(this);
	};
	
	jQuery.fn.bgStretcher.loadImg = function(obj){
		if (obj.hasClass('img-loaded')) return true;
		obj.find('SPAN.image-path').each(function(){
			var imgsrc = jQuery(this).html();
			var imgalt = '';
			var parent = jQuery(this).parent();
			var img = new Image();
			
			jQuery(img).load(function () {
				jQuery(this).hide();
				parent.prepend(this);
				jQuery(this).fadeIn('100');
			}).error(function () {
			}).attr('src', imgsrc).attr('alt', imgalt);
			
			jQuery(img).css({'marginLeft': img_options["mar_left"]+'px', 'marginTop': img_options["mar_top"]+'px'});
			jQuery(img).css({'width': img_options["imgW"]+'px', 'height': img_options["imgH"]+'px'});
		});
		obj.addClass('img-loaded');
		return true;
	}
	
	jQuery.fn.bgStretcher.play = function(){
       _bgStretcherPause = false;
       jQuery.fn.bgStretcher._clearTimeout();
       jQuery.fn.bgStretcher.slideShow(jQuery.fn.bgStretcher.settings.sequenceMode, -1);    
	};
	
	jQuery.fn.bgStretcher._clearTimeout = function(){
       if(_bgStretcherTm != null){
           clearTimeout(_bgStretcherTm);
           _bgStretcherTm = null;
       }
	}
	
	jQuery.fn.bgStretcher.pause = function(){
	   _bgStretcherPause = true;
	   jQuery.fn.bgStretcher._clearTimeout();
	};
	
	jQuery.fn.bgStretcher.sliderDestroy = function(){
		var cont = jQuery('.bgstretcher-page').html();
		jQuery('.bgStretcher-container').html('').html(cont).removeClass('bgStretcher-container');
		jQuery.fn.bgStretcher._clearTimeout();
		_bgStretcherPause = false;
	}
	
	/*  Slideshow  */
	jQuery.fn.bgStretcher.slideShow = function(sequence_mode, index_next){
		_bgStretcherAction = true;
		if (jQuery(allLIs).length < 2) return true;
		var current = jQuery(containerStr + ' LI.bgs-current');
		var next;
		
		if (index_next == -1) {
			switch (sequence_mode){
				case 'back':
					next = current.prev();
					if(!next.length){ next = jQuery(containerStr + ' LI:last'); 	}
					break;
				case 'random':
					if (r_image == jQuery(containerStr + ' LI').length) {
						jQuery.fn.bgStretcher.buildRandom(random_line[jQuery(containerStr + ' LI').length-1]);
						r_image = 0;
					}
					next = jQuery(containerStr + ' LI').eq(random_line[r_image]);
					r_image++;
					break;
				default:
					next = current.next();
					if(!next.length){ next = jQuery(containerStr + ' LI:first'); }	
			}
		} else {
			next = jQuery(containerStr + ' LI').eq(index_next);
		}
		
		jQuery(containerStr + ' LI').removeClass('bgs-current');
		jQuery.fn.bgStretcher.loadImg(next);
		next.addClass('bgs-current');
		
		switch (jQuery.fn.bgStretcher.settings.transitionEffect){
			case 'fade':
				jQuery.fn.bgStretcher.effectFade(current, next);
				break;
			case 'simpleSlide':
				jQuery.fn.bgStretcher.simpleSlide();
				break;
			case 'superSlide':
				jQuery.fn.bgStretcher.superSlide(current, next, sequence_mode);
				break;
			default : 
				jQuery.fn.bgStretcher.effectNone(current, next);
				
			}
		if (jQuery(jQuery.fn.bgStretcher.settings.pagination).find('LI').length) {
			jQuery(jQuery.fn.bgStretcher.settings.pagination).find('LI.showPage').removeClass('showPage');
			jQuery(jQuery.fn.bgStretcher.settings.pagination).find('LI').eq(jQuery(containerStr + ' LI').index(jQuery(containerStr + ' LI.bgs-current'))).addClass('showPage');
		}
			
		// callback
		if (jQuery.fn.bgStretcher.settings.callbackfunction) {
			if(typeof jQuery.fn.bgStretcher.settings.callbackfunction == 'function')
					jQuery.fn.bgStretcher.settings.callbackfunction.call();
		}	
		
		if(!_bgStretcherPause){
		setTimeout(function(){
			jQuery.fn.bgStretcher.slideShow(jQuery.fn.bgStretcher.settings.sequenceMode, -1)
			}, jQuery.fn.bgStretcher.settings.nextSlideDelay);
		}
	};
	
	/*  Others effects  */
	jQuery.fn.bgStretcher.effectNone = function(current, next){
		next.show();
		current.hide();
		_bgStretcherAction = false;
	};	
	jQuery.fn.bgStretcher.effectFade = function(current, next){
		next.fadeIn( jQuery.fn.bgStretcher.settings.slideShowSpeed );
		current.delay( jQuery.fn.bgStretcher.settings.slideShowSpeed ).fadeOut( jQuery.fn.bgStretcher.settings.slideShowSpeed, function(){ //MS Added delay
			_bgStretcherAction = false;
		} );
	};
	jQuery.fn.bgStretcher.simpleSlide = function(){
		var t, l;
		switch (jQuery.fn.bgStretcher.settings.slideDirection) {
			case 'N':
			case 'S':
				t = jQuery(containerStr + ' LI').index(jQuery(containerStr + ' LI.bgs-current')) * jQuery(containerStr).height()*(-1);
				l = 0;
				break;
			default:
				l = jQuery(containerStr + ' LI').index(jQuery(containerStr + ' LI.bgs-current')) * jQuery(containerStr).width()*(-1);
				t = 0;
		}
		jQuery(containerStr+' UL').animate({left: l+'px', top: t+'px'}, jQuery.fn.bgStretcher.settings.slideShowSpeed, function(){
			_bgStretcherAction = false;
		});
	};
	jQuery.fn.bgStretcher.superSlide = function(current, next, sequence_mode){
		var t, l;
		switch (jQuery.fn.bgStretcher.settings.slideDirection) {
			case 'S':
				t = jQuery(containerStr).height();
				l = 0;
				break;
			case 'E':
				t = 0;
				l = jQuery(containerStr).width();
				break;
			case 'W':
				t = 0;
				l = jQuery(containerStr).width()*(-1);
				break;
			case 'NW':
				t = jQuery(containerStr).height()*(-1);
				l = jQuery(containerStr).width()*(-1);
				break;
			case 'NE':
				t = jQuery(containerStr).height()*(-1);
				l = jQuery(containerStr).width();
				break;
			case 'SW':
				t = jQuery(containerStr).height();
				l = jQuery(containerStr).width()*(-1);
				break;
			case 'SE':
				t = jQuery(containerStr).height();
				l = jQuery(containerStr).width();
				break;	
			default:
				t = jQuery(containerStr).height()*(-1);
				l = 0;
		}
		if (sequence_mode == 'back') {
				next.css({'z-index': 2, top: t+'px', left: l+'px'});
				next.show();
				next.animate({left: '0px', top: '0px'}, jQuery.fn.bgStretcher.settings.slideShowSpeed, function(){
						current.hide();
						jQuery(this).css({'z-index': 1});
						_bgStretcherAction = false;
					});
			} else {
					current.css('z-index', 2);
					next.show();
					current.animate({left: l+'px', top: t+'px'}, jQuery.fn.bgStretcher.settings.slideShowSpeed, function(){
						jQuery(this).hide().css({'z-index': 1, top: '0px', left: '0px'});
						_bgStretcherAction = false;
					});
				}	
	};

	/*  Build line random images  */
	jQuery.fn.bgStretcher.buildRandom = function(el_not){
		var l = jQuery(allLIs).length;
		var i, j, rt;
		for (i = 0; i < l; i++ ) {
			random_line[i] = i;
			random_temp[i] = Math.random()*l;
		}
		for (i = 0; i < l; i++ ) {
			for (j = 0; j < (l-i-1); j++) {
				if (random_temp[j] > random_temp[j+1]) {
					rt = random_temp[j];
					random_temp[j] = random_temp[j+1];
					random_temp[j+1] = rt;
					rt = random_line[j];
					random_line[j] = random_line[j+1];
					random_line[j+1] = rt;
				}
			}
		}
		
		if (random_line[0] == el_not) {
			rt = random_line[0];
			random_line[0] = random_line[l-1];
			random_line[l-1] = rt;
		}
	};	

	/*  Prev and Next buttons */
	jQuery.fn.bgStretcher.buttonSlide = function(button_point){
		if (_bgStretcherAction || (jQuery(allLIs).length < 2)) return false;
		var mode = '';
		if (button_point == 'prev') {
			mode = 'back';
			if (jQuery.fn.bgStretcher.settings.sequenceMode == 'back')  mode = 'normal';
		} else {
			mode = jQuery.fn.bgStretcher.settings.sequenceMode;
		}
		jQuery(allLIs).stop(true, true);
		jQuery.fn.bgStretcher._clearTimeout();
		jQuery.fn.bgStretcher.slideShow(mode, -1);
		return false;
	};	

	/*  Pagination  */
	jQuery.fn.bgStretcher.pagination = function(){
		var l = jQuery(allLIs).length;
		var output = ''; var i = 0;
		if (l > 0) {
			output += '<ul>';
				for (i = 0; i < l; i++){
					output += '<li><a href="javascript:;">'+(i+1)+'</a></li>';
				}
			output += '</ul>';
			jQuery(jQuery.fn.bgStretcher.settings.pagination).html(output);
//			jQuery(jQuery.fn.bgStretcher.settings.pagination).find('LI:first').addClass('showPage'); Original
			jQuery(jQuery.fn.bgStretcher.settings.pagination).find('LI').eq((jQuery.fn.bgStretcher.settings.startElementIndex)).addClass('showPage'); // Modified by a user
		
			jQuery(jQuery.fn.bgStretcher.settings.pagination).find('A').click(function(){
				if (jQuery(this).parent().hasClass('showPage')) return false;
				jQuery(allLIs).stop(true, true);
				jQuery.fn.bgStretcher._clearTimeout();
				jQuery.fn.bgStretcher.slideShow(jQuery.fn.bgStretcher.settings.sequenceMode, jQuery(jQuery.fn.bgStretcher.settings.pagination).find('A').index(jQuery(this)));
				return false;
			});
			
		}
		return false;
	}

	/*  Default Settings  */
	jQuery.fn.bgStretcher.defaults = {
		imageContainer:             'bgstretcher',
		resizeProportionally:       true,
		resizeAnimate:              false,
		images:                     [],
		imageWidth:                 1024,
		imageHeight:                768,
		maxWidth:					'auto',
		maxHeight:					'auto',
		nextSlideDelay:             3000,
		slideShowSpeed:             'normal',
		slideShow:                  true,
		transitionEffect:			'fade', // none, fade, simpleSlide, superSlide
		slideDirection:				'N', // N, S, W, E, (if superSlide - NW, NE, SW, SE)
		sequenceMode:				'normal', // back, random
		buttonPrev:					'',
		buttonNext:					'',
		pagination: 				'',
		anchoring: 					'left top', // right bottom center
		anchoringImg: 				'left top', // right bottom center
		preloadImg:					true,
		startElementIndex:			0,
		callbackfunction:			null
	};

	jQuery.fn.bgStretcher.settings = {};

	jQuery(document).ready(function(){
		var bg_images = [];
		if('ddrop' == 'ddrop'){
		jQuery('div#inputimages img').each(function() {
			bg_images.push(jQuery(this).attr('src'));
		});
	}else{
		jQuery('div#inputimages a').each(function() {
			bg_images.push(jQuery(this).attr('href'));
		});		
	};
		jQuery('body').bgStretcher({
			images: bg_images,
			imageWidth: 1024,
			imageHeight: 768,
			nextSlideDelay: 3*1000,
			slideShowSpeed: 'slow',
			resizeAnimate: false,
			slideShow: true,
			transitionEffect: 'fade',
			slideDirection:	'Up',
			sequenceMode: 'normal',
			buttonPrev:	'',
			buttonNext:	'',
			pagination: '',
			anchoring: 	'top left',
			anchoringImg: 'top left'
		});
	});
})(jQuery);
	return stack;
})(stacks.stacks_in_15_page0);


// Javascript for stacks_in_2_page0
// ---------------------------------------------------------------------

// Each stack has its own object with its own namespace.  The name of
// that object is the same as the stack's id.
stacks.stacks_in_2_page0 = {};

// A closure is defined and assigned to the stack's object.  The object
// is also passed in as 'stack' which gives you a shorthand for referring
// to this object from elsewhere.
stacks.stacks_in_2_page0 = (function(stack) {

	// When jQuery is used it will be available as $ and jQuery but only
	// inside the closure.
	var jQuery = stacks.jQuery;
	var $ = jQuery;
	
// ColorBox v1.3.19 - jQuery lightbox plugin
// (c) 2011 Jack Moore - jacklmoore.com
// License: http://www.opensource.org/licenses/mit-license.php
(function(a,b,c){function Z(c,d,e){var g=b.createElement(c);return d&&(g.id=f+d),e&&(g.style.cssText=e),a(g)}function $(a){var b=y.length,c=(Q+a)%b;return c<0?b+c:c}function _(a,b){return Math.round((/%/.test(a)?(b==="x"?z.width():z.height())/100:1)*parseInt(a,10))}function ba(a){return K.photo||/\.(gif|png|jpe?g|bmp|ico)((#|\?).*)?$/i.test(a)}function bb(){var b;K=a.extend({},a.data(P,e));for(b in K)a.isFunction(K[b])&&b.slice(0,2)!=="on"&&(K[b]=K[b].call(P));K.rel=K.rel||P.rel||"nofollow",K.href=K.href||a(P).attr("href"),K.title=K.title||P.title,typeof K.href=="string"&&(K.href=a.trim(K.href))}function bc(b,c){a.event.trigger(b),c&&c.call(P)}function bd(){var a,b=f+"Slideshow_",c="click."+f,d,e,g;K.slideshow&&y[1]?(d=function(){F.text(K.slideshowStop).unbind(c).bind(j,function(){if(K.loop||y[Q+1])a=setTimeout(W.next,K.slideshowSpeed)}).bind(i,function(){clearTimeout(a)}).one(c+" "+k,e),r.removeClass(b+"off").addClass(b+"on"),a=setTimeout(W.next,K.slideshowSpeed)},e=function(){clearTimeout(a),F.text(K.slideshowStart).unbind([j,i,k,c].join(" ")).one(c,function(){W.next(),d()}),r.removeClass(b+"on").addClass(b+"off")},K.slideshowAuto?d():e()):r.removeClass(b+"off "+b+"on")}function be(b){U||(P=b,bb(),y=a(P),Q=0,K.rel!=="nofollow"&&(y=a("."+g).filter(function(){var b=a.data(this,e).rel||this.rel;return b===K.rel}),Q=y.index(P),Q===-1&&(y=y.add(P),Q=y.length-1)),S||(S=T=!0,r.show(),K.returnFocus&&a(P).blur().one(l,function(){a(this).focus()}),q.css({opacity:+K.opacity,cursor:K.overlayClose?"pointer":"auto"}).show(),K.w=_(K.initialWidth,"x"),K.h=_(K.initialHeight,"y"),W.position(),o&&z.bind("resize."+p+" scroll."+p,function(){q.css({width:z.width(),height:z.height(),top:z.scrollTop(),left:z.scrollLeft()})}).trigger("resize."+p),bc(h,K.onOpen),J.add(D).hide(),I.html(K.close).show()),W.load(!0))}function bf(){!r&&b.body&&(Y=!1,z=a(c),r=Z(X).attr({id:e,"class":n?f+(o?"IE6":"IE"):""}).hide(),q=Z(X,"Overlay",o?"position:absolute":"").hide(),s=Z(X,"Wrapper"),t=Z(X,"Content").append(A=Z(X,"LoadedContent","width:0; height:0; overflow:hidden"),C=Z(X,"LoadingOverlay").add(Z(X,"LoadingGraphic")),D=Z(X,"Title"),E=Z(X,"Current"),G=Z(X,"Next"),H=Z(X,"Previous"),F=Z(X,"Slideshow").bind(h,bd),I=Z(X,"Close")),s.append(Z(X).append(Z(X,"TopLeft"),u=Z(X,"TopCenter"),Z(X,"TopRight")),Z(X,!1,"clear:left").append(v=Z(X,"MiddleLeft"),t,w=Z(X,"MiddleRight")),Z(X,!1,"clear:left").append(Z(X,"BottomLeft"),x=Z(X,"BottomCenter"),Z(X,"BottomRight"))).find("div div").css({"float":"left"}),B=Z(X,!1,"position:absolute; width:9999px; visibility:hidden; display:none"),J=G.add(H).add(E).add(F),a(b.body).append(q,r.append(s,B)))}function bg(){return r?(Y||(Y=!0,L=u.height()+x.height()+t.outerHeight(!0)-t.height(),M=v.width()+w.width()+t.outerWidth(!0)-t.width(),N=A.outerHeight(!0),O=A.outerWidth(!0),r.css({"padding-bottom":L,"padding-right":M}),G.click(function(){W.next()}),H.click(function(){W.prev()}),I.click(function(){W.close()}),q.click(function(){K.overlayClose&&W.close()}),a(b).bind("keydown."+f,function(a){var b=a.keyCode;S&&K.escKey&&b===27&&(a.preventDefault(),W.close()),S&&K.arrowKey&&y[1]&&(b===37?(a.preventDefault(),H.click()):b===39&&(a.preventDefault(),G.click()))}),a("."+g,b).live("click",function(a){a.which>1||a.shiftKey||a.altKey||a.metaKey||(a.preventDefault(),be(this))})),!0):!1}var d={transition:"elastic",speed:300,width:!1,initialWidth:"600",innerWidth:!1,maxWidth:!1,height:!1,initialHeight:"450",innerHeight:!1,maxHeight:!1,scalePhotos:!0,scrolling:!0,inline:!1,html:!1,iframe:!1,fastIframe:!0,photo:!1,href:!1,title:!1,rel:!1,opacity:.9,preloading:!0,current:"image {current} of {total}",previous:"previous",next:"next",close:"close",open:!1,returnFocus:!0,reposition:!0,loop:!0,slideshow:!1,slideshowAuto:!0,slideshowSpeed:2500,slideshowStart:"start slideshow",slideshowStop:"stop slideshow",onOpen:!1,onLoad:!1,onComplete:!1,onCleanup:!1,onClosed:!1,overlayClose:!0,escKey:!0,arrowKey:!0,top:!1,bottom:!1,left:!1,right:!1,fixed:!1,data:undefined},e="colorbox",f="cbox1",g=f+"Element",h=f+"_open",i=f+"_load",j=f+"_complete",k=f+"_cleanup",l=f+"_closed",m=f+"_purge",n=!a.support.opacity&&!a.support.style,o=n&&!c.XMLHttpRequest,p=f+"_IE6",q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X="div",Y;if(a.colorbox)return;a(bf),W=a.fn[e]=a[e]=function(b,c){var f=this;b=b||{},bf();if(bg()){if(!f[0]){if(f.selector)return f;f=a("<a/>"),b.open=!0}c&&(b.onComplete=c),f.each(function(){a.data(this,e,a.extend({},a.data(this,e)||d,b))}).addClass(g),(a.isFunction(b.open)&&b.open.call(f)||b.open)&&be(f[0])}return f},W.position=function(a,b){function i(a){u[0].style.width=x[0].style.width=t[0].style.width=a.style.width,t[0].style.height=v[0].style.height=w[0].style.height=a.style.height}var c=0,d=0,e=r.offset(),g=z.scrollTop(),h=z.scrollLeft();z.unbind("resize."+f),r.css({top:-9e4,left:-9e4}),K.fixed&&!o?(e.top-=g,e.left-=h,r.css({position:"fixed"})):(c=g,d=h,r.css({position:"absolute"})),K.right!==!1?d+=Math.max(z.width()-K.w-O-M-_(K.right,"x"),0):K.left!==!1?d+=_(K.left,"x"):d+=Math.round(Math.max(z.width()-K.w-O-M,0)/2),K.bottom!==!1?c+=Math.max(z.height()-K.h-N-L-_(K.bottom,"y"),0):K.top!==!1?c+=_(K.top,"y"):c+=Math.round(Math.max(z.height()-K.h-N-L,0)/2),r.css({top:e.top,left:e.left}),a=r.width()===K.w+O&&r.height()===K.h+N?0:a||0,s[0].style.width=s[0].style.height="9999px",r.dequeue().animate({width:K.w+O,height:K.h+N,top:c,left:d},{duration:a,complete:function(){i(this),T=!1,s[0].style.width=K.w+O+M+"px",s[0].style.height=K.h+N+L+"px",K.reposition&&setTimeout(function(){z.bind("resize."+f,W.position)},1),b&&b()},step:function(){i(this)}})},W.resize=function(a){S&&(a=a||{},a.width&&(K.w=_(a.width,"x")-O-M),a.innerWidth&&(K.w=_(a.innerWidth,"x")),A.css({width:K.w}),a.height&&(K.h=_(a.height,"y")-N-L),a.innerHeight&&(K.h=_(a.innerHeight,"y")),!a.innerHeight&&!a.height&&(A.css({height:"auto"}),K.h=A.height()),A.css({height:K.h}),W.position(K.transition==="none"?0:K.speed))},W.prep=function(b){function g(){return K.w=K.w||A.width(),K.w=K.mw&&K.mw<K.w?K.mw:K.w,K.w}function h(){return K.h=K.h||A.height(),K.h=K.mh&&K.mh<K.h?K.mh:K.h,K.h}if(!S)return;var c,d=K.transition==="none"?0:K.speed;A.remove(),A=Z(X,"LoadedContent").append(b),A.hide().appendTo(B.show()).css({width:g(),overflow:K.scrolling?"auto":"hidden"}).css({height:h()}).prependTo(t),B.hide(),a(R).css({"float":"none"}),o&&a("select").not(r.find("select")).filter(function(){return this.style.visibility!=="hidden"}).css({visibility:"hidden"}).one(k,function(){this.style.visibility="inherit"}),c=function(){function q(){n&&r[0].style.removeAttribute("filter")}var b,c,g=y.length,h,i="frameBorder",k="allowTransparency",l,o,p;if(!S)return;l=function(){clearTimeout(V),C.hide(),bc(j,K.onComplete)},n&&R&&A.fadeIn(100),D.html(K.title).add(A).show();if(g>1){typeof K.current=="string"&&E.html(K.current.replace("{current}",Q+1).replace("{total}",g)).show(),G[K.loop||Q<g-1?"show":"hide"]().html(K.next),H[K.loop||Q?"show":"hide"]().html(K.previous),K.slideshow&&F.show();if(K.preloading){b=[$(-1),$(1)];while(c=y[b.pop()])o=a.data(c,e).href||c.href,a.isFunction(o)&&(o=o.call(c)),ba(o)&&(p=new Image,p.src=o)}}else J.hide();K.iframe?(h=Z("iframe")[0],i in h&&(h[i]=0),k in h&&(h[k]="true"),h.name=f+ +(new Date),K.fastIframe?l():a(h).one("load",l),h.src=K.href,K.scrolling||(h.scrolling="no"),a(h).addClass(f+"Iframe").appendTo(A).one(m,function(){h.src="//about:blank"})):l(),K.transition==="fade"?r.fadeTo(d,1,q):q()},K.transition==="fade"?r.fadeTo(d,0,function(){W.position(0,c)}):W.position(d,c)},W.load=function(b){var c,d,e=W.prep;T=!0,R=!1,P=y[Q],b||bb(),bc(m),bc(i,K.onLoad),K.h=K.height?_(K.height,"y")-N-L:K.innerHeight&&_(K.innerHeight,"y"),K.w=K.width?_(K.width,"x")-O-M:K.innerWidth&&_(K.innerWidth,"x"),K.mw=K.w,K.mh=K.h,K.maxWidth&&(K.mw=_(K.maxWidth,"x")-O-M,K.mw=K.w&&K.w<K.mw?K.w:K.mw),K.maxHeight&&(K.mh=_(K.maxHeight,"y")-N-L,K.mh=K.h&&K.h<K.mh?K.h:K.mh),c=K.href,V=setTimeout(function(){C.show()},100),K.inline?(Z(X).hide().insertBefore(a(c)[0]).one(m,function(){a(this).replaceWith(A.children())}),e(a(c))):K.iframe?e(" "):K.html?e(K.html):ba(c)?(a(R=new Image).addClass(f+"Photo").error(function(){K.title=!1,e(Z(X,"Error").text("This image could not be loaded"))}).load(function(){var a;R.onload=null,K.scalePhotos&&(d=function(){R.height-=R.height*a,R.width-=R.width*a},K.mw&&R.width>K.mw&&(a=(R.width-K.mw)/R.width,d()),K.mh&&R.height>K.mh&&(a=(R.height-K.mh)/R.height,d())),K.h&&(R.style.marginTop=Math.max(K.h-R.height,0)/2+"px"),y[1]&&(K.loop||y[Q+1])&&(R.style.cursor="pointer",R.onclick=function(){W.next()}),n&&(R.style.msInterpolationMode="bicubic"),setTimeout(function(){e(R)},1)}),setTimeout(function(){R.src=c},1)):c&&B.load(c,K.data,function(b,c,d){e(c==="error"?Z(X,"Error").text("Request unsuccessful: "+d.statusText):a(this).contents())})},W.next=function(){!T&&y[1]&&(K.loop||y[Q+1])&&(Q=$(1),W.load())},W.prev=function(){!T&&y[1]&&(K.loop||Q)&&(Q=$(-1),W.load())},W.close=function(){S&&!U&&(U=!0,S=!1,bc(k,K.onCleanup),z.unbind("."+f+" ."+p),q.fadeTo(200,0),r.stop().fadeTo(300,0,function(){r.add(q).css({opacity:1,cursor:"auto"}).hide(),bc(m),A.remove(),setTimeout(function(){U=!1,bc(l,K.onClosed)},1)}))},W.remove=function(){a([]).add(r).add(q).remove(),r=null,a("."+g).removeData(e).removeClass(g).die()},W.element=function(){return a(P)},W.settings=d})(jQuery,document,this);

/* SymfoniP function - add some classes, dance this mess around
 * Custom function for FlowBox
 * developed by Ronan Cashell - SymfoniP 2009-2012 
 * Build 28-Aug-2012 V3.1.3 with Flowplayer 3.2.14
 * changes to stop audio playback in Flashmode for FF and IE when lightbox closes
*/
(function(a){a.fn.symFlowbox=function(e){var f=a.extend({vimeoautoplay:true,youtubeautoplay:true,videoWidth:640,videoHeight:360,iframeVideoWidth:480,iframeVideoHeight:270,iframeWidth:"85%",iframeHeight:"85%"},e);function d(l){if(l.match(/youtube.com/)){if((/youtube.com\/v\/[a-zA-Z0-9_|\-]/gi).test(l)){var h=l.split("/v/");return h[1]}var k=l.match(/v=[a-zA-Z0-9_|\-]+/gi);for(var j in k){var h=k[j].match(/=.*/gi);for(var m in h){var i=h[m].split("=");return i[1]}}var k=l.match(/com\/v\/[a-zA-Z0-9_|\-]+/gi);for(var j in k){var h=k[j].match(/=.*/gi);for(var m in h){var i=h[m].split("=");return i[1]}}var k=l.match(/list=[A-Z0-9]+/gi);for(var j in k){var h=k[j].match(/=.*/gi);for(var m in h){var i=h[m].split("=");return i[1]}}}else{var k=l.match(/\/[a-zA-Z0-9_|\-]+$/gi);return(k[0].substr(1))}return"unknown"}function g(i){var h=i.split("/");return h[h.length-1]}function b(){return((navigator.userAgent.match(/iPhone/i))||(navigator.userAgent.match(/iPod/i))||(navigator.userAgent.match(/iPad/i)))}var c=0;return this.each(function(){var h=a(this);a("a[href*='vimeo.com']").each(function(){a(this).addClass("symflowboxVideoiframe");var i=a(this).attr("href");if(i.indexOf("player.vimeo.com")<0){a(this).attr("href","http://player.vimeo.com/video/"+g(i)+(f.vimeoautoplay?"?autoplay=1":""))}});a("a[href*='youtube.com'],a[href*='youtu.be']").each(function(){if(!b()){a(this).addClass("symflowboxVideoiframe")}var i=a(this).attr("href");if(i.indexOf("youtube.com/embed")<0){if(i.indexOf("playlist")>0){a(this).attr("href","http://www.youtube.com/embed/videoseries?list="+d(i)+"&"+(f.youtubeautoplay?"autoplay=1&":"")+"modestbranding=1")}else{a(this).attr("href","http://www.youtube.com/embed/"+d(i)+"?"+(f.youtubeautoplay?"autoplay=1&":"")+"modestbranding=1")}}});a("a.symflowboxVideoiframe").colorbox({iframe:true,innerWidth:f.iframeVideoWidth,innerHeight:f.iframeVideoHeight});a("a").each(function(){var j=a(this).attr("href");if(!b()&&(/\.mp4$/i.test(j)||/\.mov$/i.test(j)||/\.m4v$/i.test(j))){var i=a('<div id="symflowboxvid'+c+'"><video width="'+f.videoWidth+'" height="'+f.videoHeight+'" controls="controls" src="'+j+'"></video></div>');h.append(i);a(this).attr("href","#symflowboxvid"+c).addClass("symflowbox");c++}if(/\.jpg/i.test(j)||/\.jpeg/i.test(j)||/\.png/i.test(j)||/\.gif/.test(j)){a(this).addClass("symflowboximage")}});a("a.symflowboxiframe").colorbox({iframe:true,width:f.iframeWidth,height:f.iframeHeight});a("a.inline").colorbox({inline:true});if(a.browser.mozilla||(a.browser.msie&&a.browser.version<"9")){a("a.symflowbox").each(function(){var i=a(this);var j=a(i.attr("href"));setTimeout(function(){i.colorbox({html:j.html()})},1000)})}else{a("a.symflowbox").colorbox({inline:true})}a("a.symflowboximage").colorbox({scalePhotos:true,maxWidth:"85%",maxHeight:"90%"});a("a.symflowboxiframe, a.symflowbox, a.symflowboximage,a.symflowboxVideoiframe").colorbox({current:"{current} of {total}"})})}})(jQuery);


/* Begin html5media */
(function(){function j(a){if(!a||typeof a!="object")return a;var b=new a.constructor,e;for(e in a)a.hasOwnProperty(e)&&(b[e]=j(a[e]));return b}function i(a,b){if(a){var e,d=0,c=a.length;if(c===void 0)for(e in a){if(b.call(a[e],e,a[e])===!1)break}else for(e=a[0];d<c&&b.call(e,d,e)!==!1;e=a[++d]);return a}}function n(a,b,e){if(typeof b!="object")return a;a&&b&&i(b,function(d,b){if(!e||typeof b!="function")a[d]=b});return a}function r(a){var b=a.indexOf(".");if(b!=-1){var e=a.slice(0,b)||"*",d=a.slice(b+
1,a.length),c=[];i(document.getElementsByTagName(e),function(){this.className&&this.className.indexOf(d)!=-1&&c.push(this)});return c}}function g(a){a=a||window.event;a.preventDefault?(a.stopPropagation(),a.preventDefault()):(a.returnValue=!1,a.cancelBubble=!0);return!1}function o(a,b,e){a[b]=a[b]||[];a[b].push(e)}function t(){return"_"+(""+Math.random()).slice(2,10)}function k(a,p,e){var d=this,h=null,k=!1,m,v,f=[],q={},s={},u,y,x,z,A,r;n(d,{id:function(){return u},isLoaded:function(){return h!==
null&&h.fp_play!==void 0&&!k},getParent:function(){return a},hide:function(b){if(b)a.style.height="0px";if(d.isLoaded())h.style.height="0px";return d},show:function(){a.style.height=r+"px";if(d.isLoaded())h.style.height=A+"px";return d},isHidden:function(){return d.isLoaded()&&parseInt(h.style.height,10)===0},load:function(b){if(!d.isLoaded()&&d._fireEvent("onBeforeLoad")!==!1){var f=0;i(c,function(){this.unload(function(){if(++f==c.length){if((m=a.innerHTML)&&!flashembed.isSupported(p.version))a.innerHTML=
"";if(b)b.cached=!0,o(s,"onLoad",b);flashembed(a,p,{config:e})}})})}return d},unload:function(b){if(this.isFullscreen()&&/WebKit/i.test(navigator.userAgent))return b&&b(!1),d;if(m.replace(/\s/g,"")!==""){if(d._fireEvent("onBeforeUnload")===!1)return b&&b(!1),d;k=!0;try{h&&(h.fp_close(),d._fireEvent("onUnload"))}catch(f){}setTimeout(function(){h=null;a.innerHTML=m;k=!1;b&&b(!0)},50)}else b&&b(!1);return d},getClip:function(a){a===void 0&&(a=z);return f[a]},getCommonClip:function(){return v},getPlaylist:function(){return f},
getPlugin:function(a){var f=q[a];if(!f&&d.isLoaded()){var e=d._api().fp_getPlugin(a);e&&(f=new b(a,e,d),q[a]=f)}return f},getScreen:function(){return d.getPlugin("screen")},getControls:function(){return d.getPlugin("controls")._fireEvent("onUpdate")},getLogo:function(){try{return d.getPlugin("logo")._fireEvent("onUpdate")}catch(a){}},getPlay:function(){return d.getPlugin("play")._fireEvent("onUpdate")},getConfig:function(a){return a?j(e):e},getFlashParams:function(){return p},loadPlugin:function(a,
f,e,c){typeof e=="function"&&(c=e,e={});var p=c?t():"_";d._api().fp_loadPlugin(a,f,e,p);f={};f[p]=c;c=new b(a,null,d,f);return q[a]=c},getState:function(){return d.isLoaded()?h.fp_getState():-1},play:function(a,b){var f=function(){a!==void 0?d._api().fp_play(a,b):d._api().fp_play()};d.isLoaded()?f():k?setTimeout(function(){d.play(a,b)},50):d.load(function(){f()});return d},getVersion:function(){if(d.isLoaded()){var a=h.fp_getVersion();a.push("flowplayer.js 3.2.6");return a}return"flowplayer.js 3.2.6"},
_api:function(){if(!d.isLoaded())throw"Flowplayer "+d.id()+" not loaded when calling an API method";return h},setClip:function(a){d.setPlaylist([a]);return d},getIndex:function(){return x},_swfHeight:function(){return h.clientHeight}});i("Click*,Load*,Unload*,Keypress*,Volume*,Mute*,Unmute*,PlaylistReplace,ClipAdd,Fullscreen*,FullscreenExit,Error,MouseOver,MouseOut".split(","),function(){var a="on"+this;if(a.indexOf("*")!=-1){var a=a.slice(0,a.length-1),b="onBefore"+a.slice(2);d[b]=function(a){o(s,
b,a);return d}}d[a]=function(b){o(s,a,b);return d}});i("pause,resume,mute,unmute,stop,toggle,seek,getStatus,getVolume,setVolume,getTime,isPaused,isPlaying,startBuffering,stopBuffering,isFullscreen,toggleFullscreen,reset,close,setPlaylist,addClip,playFeed,setKeyboardShortcutsEnabled,isKeyboardShortcutsEnabled".split(","),function(){var a=this;d[a]=function(b,f){if(!d.isLoaded())return d;var e=null,e=b!==void 0&&f!==void 0?h["fp_"+a](b,f):b===void 0?h["fp_"+a]():h["fp_"+a](b);return e==="undefined"||
e===void 0?d:e}});d._fireEvent=function(a){typeof a=="string"&&(a=[a]);var b=a[0],c=a[1],p=a[2],u=a[3],g=0;e.debug&&console.log("$f.fireEvent",[].slice.call(a));!d.isLoaded()&&b=="onLoad"&&c=="player"&&(h=h||document.getElementById(y),A=d._swfHeight(),i(f,function(){this._fireEvent("onLoad")}),i(q,function(a,b){b._fireEvent("onUpdate")}),v._fireEvent("onLoad"));if(!(b=="onLoad"&&c!="player")){if(b=="onError"&&(typeof c=="string"||typeof c=="number"&&typeof p=="number"))c=p,p=u;if(b=="onContextMenu")i(e.contextMenu[c],
function(a,b){b.call(d)});else if(b=="onPluginEvent"||b=="onBeforePluginEvent"){if(u=q[c.name||c])return u._fireEvent("onUpdate",c),u._fireEvent(p,a.slice(3))}else{if(b=="onPlaylistReplace"){f=[];var k=0;i(c,function(){f.push(new l(this,k++,d))})}if(b=="onClipAdd"){if(c.isInStream)return;c=new l(c,p,d);f.splice(p,0,c);for(g=p+1;g<f.length;g++)f[g].index++}var m=!0;if(typeof c=="number"&&c<f.length&&(z=c,(a=f[c])&&(m=a._fireEvent(b,p,u)),!a||m!==!1))m=v._fireEvent(b,p,u,a);i(s[b],function(){m=this.call(d,
c,p);this.cached&&s[b].splice(g,1);if(m===!1)return!1;g++});return m}}};if(typeof a=="string"){var w=document.getElementById(a);if(!w)throw"Flowplayer cannot access element: "+a;a=w}(function(){function h(a){var b=d.hasiPadSupport&&d.hasiPadSupport();if(/iPad|iPhone|iPod/i.test(navigator.userAgent)&&!/.flv$/i.test(f[0].url)&&!b)return!0;!d.isLoaded()&&d._fireEvent("onBeforeClick")!==!1&&d.load();return g(a)}$f(a)?($f(a).getParent().innerHTML="",x=$f(a).getIndex(),c[x]=d):(c.push(d),x=c.length-1);
r=parseInt(a.style.height,10)||a.clientHeight;u=a.id||"fp"+t();y=p.id||u+"_api";p.id=y;e.playerId=u;typeof e=="string"&&(e={clip:{url:e}});if(typeof e.clip=="string")e.clip={url:e.clip};e.clip=e.clip||{};if(a.getAttribute("href",2)&&!e.clip.url)e.clip.url=a.getAttribute("href",2);v=new l(e.clip,-1,d);e.playlist=e.playlist||[e.clip];var k=0;i(e.playlist,function(){var a=this;typeof a=="object"&&a.length&&(a={url:""+a});i(e.clip,function(b,f){f!==void 0&&a[b]===void 0&&typeof f!="function"&&(a[b]=f)});
e.playlist[k]=a;a=new l(a,k,d);f.push(a);k++});i(e,function(a,b){if(typeof b=="function"){if(v[a])v[a](b);else o(s,a,b);delete e[a]}});i(e.plugins,function(a,f){f&&(q[a]=new b(a,f,d))});if(!e.plugins||e.plugins.controls===void 0)q.controls=new b("controls",null,d);q.canvas=new b("canvas",null,d);m=a.innerHTML;setTimeout(function(){m.replace(/\s/g,"")!==""?a.addEventListener?a.addEventListener("click",h,!1):a.attachEvent&&a.attachEvent("onclick",h):(a.addEventListener&&a.addEventListener("click",g,
!1),d.load())},0)})()}function m(a){this.length=a.length;this.each=function(b){i(a,b)};this.size=function(){return a.length}}var l=function(a,b,e){var c=this,h={},l={};c.index=b;typeof a=="string"&&(a={url:a});n(this,a,!0);i("Begin*,Start,Pause*,Resume*,Seek*,Stop*,Finish*,LastSecond,Update,BufferFull,BufferEmpty,BufferStop".split(","),function(){var a="on"+this;if(a.indexOf("*")!=-1){var a=a.slice(0,a.length-1),f="onBefore"+a.slice(2);c[f]=function(a){o(l,f,a);return c}}c[a]=function(b){o(l,a,b);
return c};b==-1&&(c[f]&&(e[f]=c[f]),c[a]&&(e[a]=c[a]))});n(this,{onCuepoint:function(a,f){if(arguments.length==1)return h.embedded=[null,a],c;typeof a=="number"&&(a=[a]);var q=t();h[q]=[a,f];e.isLoaded()&&e._api().fp_addCuepoints(a,b,q);return c},update:function(a){n(c,a);e.isLoaded()&&e._api().fp_updateClip(a,b);var f=e.getConfig();n(b==-1?f.clip:f.playlist[b],a,!0)},_fireEvent:function(a,f,q,s){if(a=="onLoad")return i(h,function(a,f){f[0]&&e._api().fp_addCuepoints(f[0],b,a)}),!1;s=s||c;if(a=="onCuepoint"){var u=
h[f];if(u)return u[1].call(e,s,q)}if(f&&"onBeforeBegin,onMetaData,onStart,onUpdate,onResume".indexOf(a)!=-1&&(n(s,f),f.metaData))s.duration?s.fullDuration=f.metaData.duration:s.duration=f.metaData.duration;var g=!0;i(l[a],function(){g=this.call(e,s,f,q)});return g}});if(a.onCuepoint){var g=a.onCuepoint;c.onCuepoint.apply(c,typeof g=="function"?[g]:g);delete a.onCuepoint}i(a,function(b,f){typeof f=="function"&&(o(l,b,f),delete a[b])});if(b==-1)e.onCuepoint=this.onCuepoint},b=function(a,b,c,d){var h=
this,g={},l=!1;d&&n(g,d);i(b,function(a,c){typeof c=="function"&&(g[a]=c,delete b[a])});n(this,{animate:function(d,f,q){if(!d)return h;typeof f=="function"&&(q=f,f=500);if(typeof d=="string"){var s=d,d={};d[s]=f;f=500}if(q){var l=t();g[l]=q}f===void 0&&(f=500);b=c._api().fp_animate(a,d,f,l);return h},css:function(d,f){if(f!==void 0){var q={};q[d]=f;d=q}b=c._api().fp_css(a,d);n(h,b);return h},show:function(){this.display="block";c._api().fp_showPlugin(a);return h},hide:function(){this.display="none";
c._api().fp_hidePlugin(a);return h},toggle:function(){this.display=c._api().fp_togglePlugin(a);return h},fadeTo:function(b,f,d){typeof f=="function"&&(d=f,f=500);if(d){var p=t();g[p]=d}this.display=c._api().fp_fadeTo(a,b,f,p);this.opacity=b;return h},fadeIn:function(a,b){return h.fadeTo(1,a,b)},fadeOut:function(a,b){return h.fadeTo(0,a,b)},getName:function(){return a},getPlayer:function(){return c},_fireEvent:function(b,f){if(b=="onUpdate"){var d=c._api().fp_getPlugin(a);if(!d)return;n(h,d);delete h.methods;
l||(i(d.methods,function(){var b=""+this;h[b]=function(){var f=[].slice.call(arguments),f=c._api().fp_invoke(a,b,f);return f==="undefined"||f===void 0?h:f}}),l=!0)}return(d=g[b])?(d=d.apply(h,f),b.slice(0,1)=="_"&&delete g[b],d):h}})},c=[];window.flowplayer=window.$f=function(){var a=null,b=arguments[0];if(!arguments.length)return i(c,function(){if(this.isLoaded())return a=this,!1}),a||c[0];if(arguments.length==1)if(typeof b=="number")return c[b];else{if(b=="*")return new m(c);i(c,function(){if(this.id()==
b.id||this.id()==b||this.getParent()==b)return a=this,!1});return a}if(arguments.length>1){var e=arguments[1],d=arguments.length==3?arguments[2]:{};typeof e=="string"&&(e={src:e});e=n({bgcolor:"#000000",version:[9,0],expressInstall:"http://releases.flowplayer.org/swf/expressinstall.swf",cachebusting:!1},e);if(typeof b=="string")if(b.indexOf(".")!=-1){var h=[];i(r(b),function(){h.push(new k(this,j(e),j(d)))});return new m(h)}else{var g=document.getElementById(b);return new k(g!==null?g:b,e,d)}else if(b)return new k(b,
e,d)}return null};n(window.$f,{fireEvent:function(){var a=[].slice.call(arguments),b=$f(a[0]);return b?b._fireEvent(a.slice(1)):null},addPlugin:function(a,b){k.prototype[a]=b;return $f},each:i,extend:n});if(typeof jQuery=="function")jQuery.fn.flowplayer=function(a,b){if(!arguments.length||typeof arguments[0]=="number"){var c=[];this.each(function(){var a=$f(this);a&&c.push(a)});return arguments.length?c[arguments[0]]:new m(c)}return this.each(function(){$f(this,j(a),b?j(b):{})})}})();
(function(){function j(){if(l.done)return!1;var b=document;if(b&&b.getElementsByTagName&&b.getElementById&&b.body){clearInterval(l.timer);l.timer=null;for(b=0;b<l.ready.length;b++)l.ready[b].call();l.ready=null;l.done=!0}}function i(b,c){if(c)for(key in c)c.hasOwnProperty(key)&&(b[key]=c[key]);return b}function n(b){switch(r(b)){case "string":return b=b.replace(RegExp('(["\\\\])',"g"),"\\$1"),b=b.replace(/^\s?(\d+)%/,"$1pct"),'"'+b+'"';case "array":return"["+g(b,function(a){return n(a)}).join(",")+
"]";case "function":return'"function()"';case "object":var c=[],a;for(a in b)b.hasOwnProperty(a)&&c.push('"'+a+'":'+n(b[a]));return"{"+c.join(",")+"}"}return String(b).replace(/\s/g," ").replace(/\'/g,'"')}function r(b){if(b===null||b===void 0)return!1;var c=typeof b;return c=="object"&&b.push?"array":c}function g(b,c){var a=[],g;for(g in b)b.hasOwnProperty(g)&&(a[g]=c(b[g]));return a}function o(b,c){var a=i({},b),g=document.all,e='<object width="'+a.width+'" height="'+a.height+'"';if(g&&!a.id)a.id=
"_"+(""+Math.random()).substring(9);a.id&&(e+=' id="'+a.id+'"');a.cachebusting&&(a.src+=(a.src.indexOf("?")!=-1?"&":"?")+Math.random());e+=a.w3c||!g?' data="'+a.src+'" type="application/x-shockwave-flash"':' classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"';e+=">";if(a.w3c||g)e+='<param name="movie" value="'+a.src+'" />';a.width=a.height=a.id=a.w3c=a.src=null;for(var d in a)a[d]!==null&&(e+='<param name="'+d+'" value="'+a[d]+'" />');a="";if(c){for(var h in c)c[h]!==null&&(a+=h+"="+(typeof c[h]==
"object"?n(c[h]):c[h])+"&");a=a.substring(0,a.length-1);e+='<param name="flashvars" value=\''+a+"' />"}e+="</object>";return e}function t(b,c,a){var g=flashembed.getVersion();i(this,{getContainer:function(){return b},getConf:function(){return c},getVersion:function(){return g},getFlashvars:function(){return a},getApi:function(){return b.firstChild},getHTML:function(){return o(c,a)}});var e=c.version,d=c.expressInstall,h=!e||flashembed.isSupported(e);if(h)c.onFail=c.version=c.expressInstall=null,b.innerHTML=
o(c,a);else if(e&&d&&flashembed.isSupported([6,65]))i(c,{src:d}),a={MMredirectURL:location.href,MMplayerType:"PlugIn",MMdoctitle:document.title},b.innerHTML=o(c,a);else if(b.innerHTML.replace(/\s/g,"")===""&&(b.innerHTML="<h2>Flash version "+e+" or greater is required</h2><h3>"+(g[0]>0?"Your version is "+g:"You have no flash plugin installed")+"</h3>"+(b.tagName=="A"?"<p>Click here to download latest version</p>":"<p>Download latest version from <a href='http://www.adobe.com/go/getflashplayer'>here</a></p>"),
b.tagName=="A"))b.onclick=function(){location.href="http://www.adobe.com/go/getflashplayer"};if(!h&&c.onFail&&(e=c.onFail.call(this),typeof e=="string"))b.innerHTML=e;document.all&&(window[c.id]=document.getElementById(c.id))}var k=typeof jQuery=="function",m={width:"100%",height:"100%",allowfullscreen:!0,allowscriptaccess:"always",quality:"high",version:null,onFail:null,expressInstall:null,w3c:!1,cachebusting:!1};if(k)jQuery.tools=jQuery.tools||{},jQuery.tools.flashembed={version:"1.0.4",conf:m};
var l=k?jQuery:function(b){if(l.done)return b();l.timer?l.ready.push(b):(l.ready=[b],l.timer=setInterval(j,13))};window.attachEvent&&window.attachEvent("onbeforeunload",function(){__flash_unloadHandler=function(){};__flash_savedUnloadHandler=function(){}});window.flashembed=function(b,c,a){if(typeof b=="string"){var g=document.getElementById(b);if(g)b=g;else{l(function(){flashembed(b,c,a)});return}}if(b)return typeof c=="string"&&(c={src:c}),g=i({},m),i(g,c),new t(b,g,a)};i(window.flashembed,{getVersion:function(){var b=
[0,0];if(navigator.plugins&&typeof navigator.plugins["Shockwave Flash"]=="object"){var c=navigator.plugins["Shockwave Flash"].description;typeof c!="undefined"&&(c=c.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),b=parseInt(c.replace(/^(.*)\..*$/,"$1"),10),c=/r/.test(c)?parseInt(c.replace(/^.*r(.*)$/,"$1"),10):0,b=[b,c])}else if(window.ActiveXObject){try{c=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7")}catch(a){try{c=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"),b=[6,0],c.AllowScriptAccess="always"}catch(g){if(b[0]==
6)return b}try{c=new ActiveXObject("ShockwaveFlash.ShockwaveFlash")}catch(e){}}typeof c=="object"&&(c=c.GetVariable("$version"),typeof c!="undefined"&&(c=c.replace(/^\S+\s+(.*)$/,"$1").split(","),b=[parseInt(c[0],10),parseInt(c[2],10)]))}return b},isSupported:function(b){var c=flashembed.getVersion();return c[0]>b[0]||c[0]==b[0]&&c[1]>=b[1]},domReady:l,asString:n,getHTML:o});if(k)jQuery.fn.flashembed=function(b,c){var a=null;this.each(function(){a=flashembed(this,b,c)});return b.api===!1?this:a}})();(function(){function j(){if(!k&&(k=!0,m)){for(var g=0;g<m.length;g++)m[g].call(window,[]);m=[]}}function i(g){var b=window.onload;window.onload=typeof window.onload!="function"?g:function(){b&&b();g()}}function n(){if(!t){t=!0;document.addEventListener&&!o.opera&&document.addEventListener("DOMContentLoaded",j,!1);o.msie&&window==top&&function(){if(!k){try{document.documentElement.doScroll("left")}catch(b){setTimeout(arguments.callee,0);return}j()}}();o.opera&&document.addEventListener("DOMContentLoaded",
function(){if(!k){for(var b=0;b<document.styleSheets.length;b++)if(document.styleSheets[b].disabled){setTimeout(arguments.callee,0);return}j()}},!1);if(o.safari){var g;(function(){if(!k)if(document.readyState!="loaded"&&document.readyState!="complete")setTimeout(arguments.callee,0);else{if(g===void 0){for(var b=document.getElementsByTagName("link"),c=0;c<b.length;c++)b[c].getAttribute("rel")=="stylesheet"&&g++;b=document.getElementsByTagName("style");g+=b.length}document.styleSheets.length!=g?setTimeout(arguments.callee,
0):j()}})()}i(j)}}var r=window.DomReady={},g=navigator.userAgent.toLowerCase(),o={version:(g.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[])[1],safari:/webkit/.test(g),opera:/opera/.test(g),msie:/msie/.test(g)&&!/opera/.test(g),mozilla:/mozilla/.test(g)&&!/(compatible|webkit)/.test(g)},t=!1,k=!1,m=[];r.ready=function(g){n();k?g.call(window,[]):m.push(function(){return g.call(window,[])})};n()})();(function(j,i){function n(b,c){return b.canPlayType(c)||a&&c.search("mp4")>-1}function r(b){for(var c=i.getElementsByTagName(b),d=[],e=0;e<c.length;e++)d.push(c[e]);for(e=0;e<d.length;e++){var c=d[e],h=!0;if(c.canPlayType)if(c.src)n(c,t(b,c.src))&&(h=!1);else for(var l=c.getElementsByTagName("source"),k=0;k<l.length;k++){var m=l[k];if(n(c,t(b,m.src,m.type))){h=!1;break}}h||g.forceFallback(b,c)?g.createFallback(b,c):a&&c.addEventListener("click",function(){this.play()},!1)}}function g(){r("video");
r("audio")}function o(a){return a.split("/").slice(0,-1).join("/")+"/"}function t(a,b,c){return c||B[a][b.split(".").slice(-1)[0]]||d[a]}function k(a,b){var c=a.getAttribute(b);return c==!0||typeof c=="string"}function m(a){return a.substr(0,1)=="/"?C+a:a.substr(0,1)=="."||!a.match(/^\s*\w+:\/\//)?v+a:a}function l(a,b,c){var d=a.getAttribute(b);if(d)return d+"px";if(a.currentStyle)a=a.currentStyle[b];else if(j.getComputedStyle)a=i.defaultView.getComputedStyle(a,null).getPropertyValue(b);else return c;
return a=="auto"?c:a}function b(a){return a.match(/\s*([\w-]+\/[\w-]+)(;|\s|$)/)[1]}function c(a,c){return b(a)==b(c)}i.createElement("video").canPlayType||(i.createElement("audio"),i.createElement("source"));var a=j.navigator.userAgent.toLowerCase().match(/android 2\.[12]/)!==null,p=j.navigator.userAgent.toLowerCase().match(/opera/)!==null;g.forceFallback=function(){return!1};var e=function(){for(var a=i.getElementsByTagName("script"),b=0;b<a.length;b++){var c=a[b];if(c.src.match(/html5media(\.min|)\.js/))return o(c.src)}return""}();
g.flowplayerSwf="http://releases.flowplayer.org/swf/flowplayer-3.2.11.swf";g.flowplayerAudioSwf="http://releases.flowplayer.org/swf/flowplayer.audio-3.2.9.swf";g.flowplayerControlsSwf="http://releases.flowplayer.org/swf/flowplayer.controls-3.2.11.swf";var d={video:'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',audio:"audio/mpeg;"},h=['video/mp4; codecs="avc1.42E01E, mp4a.40.2"',"audio/x-m4a;","audio/mpeg;"],B={video:{ogg:'video/ogg; codecs="theora, vorbis"',ogv:'video/ogg; codecs="theora, vorbis"',avi:'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',mp4:'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',mkv:'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
h264:'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',264:'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',avc:'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',m4v:'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',"3gp":'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',"3gpp":'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',"3g2":'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',mpg:'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',mpeg:'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',webm:"video/webm;"},audio:{ogg:'audio/ogg; codecs="vorbis"',
oga:'audio/ogg; codecs="vorbis"',aac:"audio/x-m4a;",m4a:"audio/x-m4a;",mp3:"audio/mpeg;",wav:'audio/wav; codecs="1"'}},C=j.location.protocol+"//"+j.location.host,v=String(j.location),v=o(function(){for(var a=i.getElementsByTagName("base"),b=0;b<a.length;b++){var c=a[0];if(c.href)return c.href}return String(j.location)}());g.configureFlowplayer=function(a,b){return b};g.createFallback=function(a,b){var d=k(b,"controls"),e=b.getAttribute("poster")||"",n=b.getAttribute("src")||"";if(!n)for(var j=b.getElementsByTagName("source"),
o=0;o<j.length;o++){var r=j[o],v=r.getAttribute("src");if(v)for(var w=0;w<h.length;w++)if(c(h[w],t(a,v,r.getAttribute("type")))){n=v;break}if(n)break}if(n){j=i.createElement("span");j.id=b.id;j.className=b.className;j.title=b.title;j.style.display="block";j.style.width=l(b,"width","300px");j.style.height=a=="audio"?"26px":l(b,"height","200px");b.parentNode.replaceChild(j,b);r=(b.getAttribute("preload")||"").toLowerCase();o=[];e&&o.push({url:m(e)});n&&o.push({url:m(n),autoPlay:k(b,"autoplay"),autoBuffering:k(b,
"autobuffer")||k(b,"preload")&&(r==""||r=="auto"),onBeforeFinish:function(){return!k(b,"loop")}});e={controls:d&&{url:m(g.flowplayerControlsSwf),opacity:0.8,backgroundColor:"#181818",backgroundGradient:"none",fullscreen:a=="video",autoHide:a=="video"&&{fullscreenOnly:!1,enabled:!0,hideStyle:"fade",mouseOutDelay:0}||{enabled:!1}}||null};if(p&&e.controls)e.controls.autoHide.enabled=!1;if(a=="audio"){e.audio={url:m(g.flowplayerAudioSwf)};if(!d)e.controls={url:m(g.flowplayerControlsSwf),display:"none"},
j.style.height=0;o[o.length-1].autoBuffering=!1}d={play:null,playlist:o,clip:{scaling:"fit",fadeInSpeed:0,fadeOutSpeed:0},canvas:{backgroundGradient:"none",backgroundColor:"#000000"},plugins:e};d=g.configureFlowplayer(b,d);flowplayer(j,{src:m(g.flowplayerSwf),wmode:"opaque"},d)}};DomReady.ready(g);j.html5media=g})(this,document);

$(document).ready(function() {
	$("div#symvidlist").symFlowbox({vimeoautoplay: true, youtubeautoplay: true, videoWidth: 1136, videoHeight:640,iframeVideoWidth:1136,iframeVideoHeight:640});
});
/* end of FlowBox Code */

	return stack;
})(stacks.stacks_in_2_page0);


// Javascript for stacks_in_144_page0
// ---------------------------------------------------------------------

// Each stack has its own object with its own namespace.  The name of
// that object is the same as the stack's id.
stacks.stacks_in_144_page0 = {};

// A closure is defined and assigned to the stack's object.  The object
// is also passed in as 'stack' which gives you a shorthand for referring
// to this object from elsewhere.
stacks.stacks_in_144_page0 = (function(stack) {

	// When jQuery is used it will be available as $ and jQuery but only
	// inside the closure.
	var jQuery = stacks.jQuery;
	var $ = jQuery;
	
;(function($){$.flexslider=function(el,options){var slider=$(el),vars=$.extend({},$.flexslider.defaults,options),namespace=vars.namespace,touch=("ontouchstart"in window)||window.DocumentTouch&&document instanceof DocumentTouch,eventType=(touch)?"touchend":"click",vertical=vars.direction==="vertical",reverse=vars.reverse,carousel=(vars.itemWidth>0),fade=vars.animation==="fade",asNav=vars.asNavFor!=="",methods={};$.data(el,"flexslider",slider);methods={init:function(){slider.animating=false;slider.currentSlide=vars.startAt;slider.animatingTo=slider.currentSlide;slider.atEnd=(slider.currentSlide===0||slider.currentSlide===slider.last);slider.containerSelector=vars.selector.substr(0,vars.selector.search(' '));slider.slides=$(vars.selector,slider);slider.container=$(slider.containerSelector,slider);slider.count=slider.slides.length;slider.syncExists=$(vars.sync).length>0;if(vars.animation==="slide")vars.animation="swing";slider.prop=(vertical)?"top":"marginLeft";slider.args={};slider.manualPause=false;slider.transitions=!vars.video&&!fade&&vars.useCSS&&(function(){var obj=document.createElement('div'),props=['perspectiveProperty','WebkitPerspective','MozPerspective','OPerspective','msPerspective'];for(var i in props){if(obj.style[props[i]]!==undefined){slider.pfx=props[i].replace('Perspective','').toLowerCase();slider.prop="-"+slider.pfx+"-transform";return true;}}
return false;}());if(vars.controlsContainer!=="")slider.controlsContainer=$(vars.controlsContainer).length>0&&$(vars.controlsContainer);if(vars.manualControls!=="")slider.manualControls=$(vars.manualControls).length>0&&$(vars.manualControls);if(vars.randomize){slider.slides.sort(function(){return(Math.round(Math.random())-0.5);});slider.container.empty().append(slider.slides);}
slider.doMath();if(asNav)methods.asNav.setup();slider.setup("init");if(vars.controlNav)methods.controlNav.setup();if(vars.directionNav)methods.directionNav.setup();if(vars.keyboard&&($(slider.containerSelector).length===1||vars.multipleKeyboard)){$(document).bind('keyup',function(event){var keycode=event.keyCode;if(!slider.animating&&(keycode===39||keycode===37)){var target=(keycode===39)?slider.getTarget('next'):(keycode===37)?slider.getTarget('prev'):false;slider.flexAnimate(target,vars.pauseOnAction);}});}
if(vars.mousewheel){slider.bind('mousewheel',function(event,delta,deltaX,deltaY){event.preventDefault();var target=(delta<0)?slider.getTarget('next'):slider.getTarget('prev');slider.flexAnimate(target,vars.pauseOnAction);});}
if(vars.pausePlay)methods.pausePlay.setup();if(vars.slideshow){if(vars.pauseOnHover){slider.hover(function(){if(!slider.manualPlay&&!slider.manualPause)slider.pause();},function(){if(!slider.manualPause&&!slider.manualPlay)slider.play();});}
(vars.initDelay>0)?setTimeout(slider.play,vars.initDelay):slider.play();}
if(touch&&vars.touch)methods.touch();if(!fade||(fade&&vars.smoothHeight))$(window).bind("resize focus",methods.resize);$('.sf-refresh').click(function(){$(window).resize();});setTimeout(function(){vars.start(slider);},200);},asNav:{setup:function(){slider.asNav=true;slider.animatingTo=Math.floor(slider.currentSlide/slider.move);slider.currentItem=slider.currentSlide;slider.slides.removeClass(namespace+"active-slide").eq(slider.currentItem).addClass(namespace+"active-slide");slider.slides.click(function(e){e.preventDefault();var $slide=$(this),target=$slide.index();if(!$(vars.asNavFor).data('flexslider').animating&&!$slide.hasClass('active')){slider.direction=(slider.currentItem<target)?"next":"prev";slider.flexAnimate(target,vars.pauseOnAction,false,true,true);}});}},controlNav:{setup:function(){if(!slider.manualControls){methods.controlNav.setupPaging();}else{methods.controlNav.setupManual();}},setupPaging:function(){var type=(vars.controlNav==="thumbnails")?'control-thumbs':'control-paging',j=1,item;slider.controlNavScaffold=$('<ol class="'+namespace+'control-nav '+namespace+type+'"></ol>');if(slider.pagingCount>1){for(var i=0;i<slider.pagingCount;i++){item=(vars.controlNav==="thumbnails")?'<img src="'+slider.slides.eq(i).attr("data-thumb")+'"/>':'<a>'+j+'</a>';slider.controlNavScaffold.append('<li>'+item+'</li>');j++;}}
(slider.controlsContainer)?$(slider.controlsContainer).append(slider.controlNavScaffold):slider.append(slider.controlNavScaffold);methods.controlNav.set();methods.controlNav.active();slider.controlNavScaffold.delegate('a, img',eventType,function(event){event.preventDefault();var $this=$(this),target=slider.controlNav.index($this);if(!$this.hasClass(namespace+'active')){slider.direction=(target>slider.currentSlide)?"next":"prev";slider.flexAnimate(target,vars.pauseOnAction);}});if(touch){slider.controlNavScaffold.delegate('a',"click touchstart",function(event){event.preventDefault();});}},setupManual:function(){slider.controlNav=slider.manualControls;methods.controlNav.active();slider.controlNav.live(eventType,function(event){event.preventDefault();var $this=$(this),target=slider.controlNav.index($this);if(!$this.hasClass(namespace+'active')){(target>slider.currentSlide)?slider.direction="next":slider.direction="prev";slider.flexAnimate(target,vars.pauseOnAction);}});if(touch){slider.controlNav.live("click touchstart",function(event){event.preventDefault();});}},set:function(){var selector=(vars.controlNav==="thumbnails")?'img':'a';slider.controlNav=$('.'+namespace+'control-nav li '+selector,(slider.controlsContainer)?slider.controlsContainer:slider);},active:function(){slider.controlNav.removeClass(namespace+"active").eq(slider.animatingTo).addClass(namespace+"active");},update:function(action,pos){if(slider.pagingCount>1&&action==="add"){slider.controlNavScaffold.append($('<li><a>'+slider.count+'</a></li>'));}else if(slider.pagingCount===1){slider.controlNavScaffold.find('li').remove();}else{slider.controlNav.eq(pos).closest('li').remove();}
methods.controlNav.set();(slider.pagingCount>1&&slider.pagingCount!==slider.controlNav.length)?slider.update(pos,action):methods.controlNav.active();}},directionNav:{setup:function(){var directionNavScaffold=$('<ul class="'+namespace+'direction-nav"><li><a class="'+namespace+'prev" href="#">'+vars.prevText+'</a></li><li><a class="'+namespace+'next" href="#">'+vars.nextText+'</a></li></ul>');if(slider.controlsContainer){$(slider.controlsContainer).append(directionNavScaffold);slider.directionNav=$('.'+namespace+'direction-nav li a',slider.controlsContainer);}else{slider.append(directionNavScaffold);slider.directionNav=$('.'+namespace+'direction-nav li a',slider);}
methods.directionNav.update();slider.directionNav.bind(eventType,function(event){event.preventDefault();var target=($(this).hasClass(namespace+'next'))?slider.getTarget('next'):slider.getTarget('prev');slider.flexAnimate(target,vars.pauseOnAction);});if(touch){slider.directionNav.bind("click touchstart",function(event){event.preventDefault();});}},update:function(){var disabledClass=namespace+'disabled';if(slider.pagingCount===1){slider.directionNav.addClass(disabledClass);}else if(!vars.animationLoop){if(slider.animatingTo===0){slider.directionNav.removeClass(disabledClass).filter('.'+namespace+"prev").addClass(disabledClass);}else if(slider.animatingTo===slider.last){slider.directionNav.removeClass(disabledClass).filter('.'+namespace+"next").addClass(disabledClass);}else{slider.directionNav.removeClass(disabledClass);}}else{slider.directionNav.removeClass(disabledClass);}}},pausePlay:{setup:function(){var pausePlayScaffold=$('<div class="'+namespace+'pauseplay"><a></a></div>');if(slider.controlsContainer){slider.controlsContainer.append(pausePlayScaffold);slider.pausePlay=$('.'+namespace+'pauseplay a',slider.controlsContainer);}else{slider.append(pausePlayScaffold);slider.pausePlay=$('.'+namespace+'pauseplay a',slider);}
methods.pausePlay.update((vars.slideshow)?namespace+'pause':namespace+'play');slider.pausePlay.bind(eventType,function(event){event.preventDefault();if($(this).hasClass(namespace+'pause')){slider.manualPause=true;slider.manualPlay=false;slider.pause();}else{slider.manualPause=false;slider.manualPlay=true;slider.play();}});if(touch){slider.pausePlay.bind("click touchstart",function(event){event.preventDefault();});}},update:function(state){(state==="play")?slider.pausePlay.removeClass(namespace+'pause').addClass(namespace+'play').text(vars.playText):slider.pausePlay.removeClass(namespace+'play').addClass(namespace+'pause').text(vars.pauseText);}},touch:function(){var startX,startY,offset,cwidth,dx,startT,scrolling=false;el.addEventListener('touchstart',onTouchStart,false);function onTouchStart(e){if(slider.animating){e.preventDefault();}else if(e.touches.length===1){slider.pause();cwidth=(vertical)?slider.h:slider.w;startT=Number(new Date());offset=(carousel&&reverse&&slider.animatingTo===slider.last)?0:(carousel&&reverse)?slider.limit-(((slider.itemW+vars.itemMargin)*slider.move)*slider.animatingTo):(carousel&&slider.currentSlide===slider.last)?slider.limit:(carousel)?((slider.itemW+vars.itemMargin)*slider.move)*slider.currentSlide:(reverse)?(slider.last-slider.currentSlide+slider.cloneOffset)*cwidth:(slider.currentSlide+slider.cloneOffset)*cwidth;startX=(vertical)?e.touches[0].pageY:e.touches[0].pageX;startY=(vertical)?e.touches[0].pageX:e.touches[0].pageY;el.addEventListener('touchmove',onTouchMove,false);el.addEventListener('touchend',onTouchEnd,false);}}
function onTouchMove(e){dx=(vertical)?startX-e.touches[0].pageY:startX-e.touches[0].pageX;scrolling=(vertical)?(Math.abs(dx)<Math.abs(e.touches[0].pageX-startY)):(Math.abs(dx)<Math.abs(e.touches[0].pageY-startY));if(!scrolling||Number(new Date())-startT>500){e.preventDefault();if(!fade&&slider.transitions){if(!vars.animationLoop){dx=dx/((slider.currentSlide===0&&dx<0||slider.currentSlide===slider.last&&dx>0)?(Math.abs(dx)/cwidth+2):1);}
slider.setProps(offset+dx,"setTouch");}}}
function onTouchEnd(e){el.removeEventListener('touchmove',onTouchMove,false);if(slider.animatingTo===slider.currentSlide&&!scrolling&&!(dx===null)){var updateDx=(reverse)?-dx:dx,target=(updateDx>0)?slider.getTarget('next'):slider.getTarget('prev');if(slider.canAdvance(target)&&(Number(new Date())-startT<550&&Math.abs(updateDx)>50||Math.abs(updateDx)>cwidth/2)){slider.flexAnimate(target,vars.pauseOnAction);}else{if(!fade)slider.flexAnimate(slider.currentSlide,vars.pauseOnAction,true);}}
el.removeEventListener('touchend',onTouchEnd,false);startX=null;startY=null;dx=null;offset=null;}},resize:function(){if(!slider.animating&&slider.is(':visible')){if(!carousel)slider.doMath();if(fade){methods.smoothHeight();}else if(carousel){slider.slides.width(slider.computedW);slider.update(slider.pagingCount);slider.setProps();}
else if(vertical){slider.viewport.height(slider.h);slider.setProps(slider.h,"setTotal");}else{if(vars.smoothHeight)methods.smoothHeight();slider.newSlides.width(slider.computedW);slider.setProps(slider.computedW,"setTotal");}}},smoothHeight:function(dur){if(!vertical||fade){var $obj=(fade)?slider:slider.viewport;(dur)?$obj.animate({"height":slider.slides.eq(slider.animatingTo).height()},dur):$obj.height(slider.slides.eq(slider.animatingTo).height());}},sync:function(action){var $obj=$(vars.sync).data("flexslider"),target=slider.animatingTo;switch(action){case"animate":$obj.flexAnimate(target,vars.pauseOnAction,false,true);break;case"play":if(!$obj.playing&&!$obj.asNav){$obj.play();}break;case"pause":$obj.pause();break;}}}
slider.flexAnimate=function(target,pause,override,withSync,fromNav){if(asNav&&slider.pagingCount===1)slider.direction=(slider.currentItem<target)?"next":"prev";if(!slider.animating&&(slider.canAdvance(target,fromNav)||override)&&slider.is(":visible")){if(asNav&&withSync){var master=$(vars.asNavFor).data('flexslider');slider.atEnd=target===0||target===slider.count-1;master.flexAnimate(target,true,false,true,fromNav);slider.direction=(slider.currentItem<target)?"next":"prev";master.direction=slider.direction;if(Math.ceil((target+1)/slider.visible)-1!==slider.currentSlide&&target!==0){slider.currentItem=target;slider.slides.removeClass(namespace+"active-slide").eq(target).addClass(namespace+"active-slide");target=Math.floor(target/slider.visible);}else{slider.currentItem=target;slider.slides.removeClass(namespace+"active-slide").eq(target).addClass(namespace+"active-slide");return false;}}
slider.animating=true;slider.animatingTo=target;vars.before(slider);if(pause)slider.pause();if(slider.syncExists&&!fromNav)methods.sync("animate");if(vars.controlNav)methods.controlNav.active();if(!carousel)slider.slides.removeClass(namespace+'active-slide').eq(target).addClass(namespace+'active-slide');slider.atEnd=target===0||target===slider.last;if(vars.directionNav)methods.directionNav.update();if(target===slider.last){vars.end(slider);if(!vars.animationLoop)slider.pause();}
if(!fade){var dimension=(vertical)?slider.slides.filter(':first').height():slider.computedW,margin,slideString,calcNext;if(carousel){margin=(vars.itemWidth>slider.w)?vars.itemMargin*2:vars.itemMargin;calcNext=((slider.itemW+margin)*slider.move)*slider.animatingTo;slideString=(calcNext>slider.limit&&slider.visible!==1)?slider.limit:calcNext;}else if(slider.currentSlide===0&&target===slider.count-1&&vars.animationLoop&&slider.direction!=="next"){slideString=(reverse)?(slider.count+slider.cloneOffset)*dimension:0;}else if(slider.currentSlide===slider.last&&target===0&&vars.animationLoop&&slider.direction!=="prev"){slideString=(reverse)?0:(slider.count+1)*dimension;}else{slideString=(reverse)?((slider.count-1)-target+slider.cloneOffset)*dimension:(target+slider.cloneOffset)*dimension;}
slider.setProps(slideString,"",vars.animationSpeed);if(slider.transitions){if(!vars.animationLoop||!slider.atEnd){slider.animating=false;slider.currentSlide=slider.animatingTo;}
slider.container.unbind("webkitTransitionEnd transitionend");slider.container.bind("webkitTransitionEnd transitionend",function(){slider.wrapup(dimension);});}else{slider.container.animate(slider.args,vars.animationSpeed,vars.easing,function(){slider.wrapup(dimension);});}}else{if(!touch){slider.slides.eq(slider.currentSlide).fadeOut(vars.animationSpeed,vars.easing);slider.slides.eq(target).fadeIn(vars.animationSpeed,vars.easing,slider.wrapup);}else{slider.slides.eq(slider.currentSlide).css({"opacity":0});slider.slides.eq(target).css({"opacity":1});slider.animating=false;slider.currentSlide=slider.animatingTo;}}
if(vars.smoothHeight)methods.smoothHeight(vars.animationSpeed);}}
slider.wrapup=function(dimension){if(!fade&&!carousel){if(slider.currentSlide===0&&slider.animatingTo===slider.last&&vars.animationLoop){slider.setProps(dimension,"jumpEnd");}else if(slider.currentSlide===slider.last&&slider.animatingTo===0&&vars.animationLoop){slider.setProps(dimension,"jumpStart");}}
slider.animating=false;slider.currentSlide=slider.animatingTo;vars.after(slider);}
slider.animateSlides=function(){if(!slider.animating)slider.flexAnimate(slider.getTarget("next"));}
slider.pause=function(){clearInterval(slider.animatedSlides);slider.playing=false;if(vars.pausePlay)methods.pausePlay.update("play");if(slider.syncExists)methods.sync("pause");}
slider.play=function(){slider.animatedSlides=setInterval(slider.animateSlides,vars.slideshowSpeed);slider.playing=true;if(vars.pausePlay)methods.pausePlay.update("pause");if(slider.syncExists)methods.sync("play");}
slider.canAdvance=function(target,fromNav){var last=(asNav)?slider.pagingCount-1:slider.last;return(fromNav)?true:(asNav&&slider.currentItem===slider.count-1&&target===0&&slider.direction==="prev")?true:(asNav&&slider.currentItem===0&&target===slider.pagingCount-1&&slider.direction!=="next")?false:(target===slider.currentSlide&&!asNav)?false:(vars.animationLoop)?true:(slider.atEnd&&slider.currentSlide===0&&target===last&&slider.direction!=="next")?false:(slider.atEnd&&slider.currentSlide===last&&target===0&&slider.direction==="next")?false:true;}
slider.getTarget=function(dir){slider.direction=dir;if(dir==="next"){return(slider.currentSlide===slider.last)?0:slider.currentSlide+1;}else{return(slider.currentSlide===0)?slider.last:slider.currentSlide-1;}}
slider.setProps=function(pos,special,dur){var target=(function(){var posCheck=(pos)?pos:((slider.itemW+vars.itemMargin)*slider.move)*slider.animatingTo,posCalc=(function(){if(carousel){return(special==="setTouch")?pos:(reverse&&slider.animatingTo===slider.last)?0:(reverse)?slider.limit-(((slider.itemW+vars.itemMargin)*slider.move)*slider.animatingTo):(slider.animatingTo===slider.last)?slider.limit:posCheck;}else{switch(special){case"setTotal":return(reverse)?((slider.count-1)-slider.currentSlide+slider.cloneOffset)*pos:(slider.currentSlide+slider.cloneOffset)*pos;case"setTouch":return(reverse)?pos:pos;case"jumpEnd":return(reverse)?pos:slider.count*pos;case"jumpStart":return(reverse)?slider.count*pos:pos;default:return pos;}}}());return(posCalc*-1)+"px";}());if(slider.transitions){target=(vertical)?"translate3d(0,"+target+",0)":"translate3d("+target+",0,0)";dur=(dur!==undefined)?(dur/1000)+"s":"0s";slider.container.css("-"+slider.pfx+"-transition-duration",dur);}
slider.args[slider.prop]=target;if(slider.transitions||dur===undefined)slider.container.css(slider.args);}
slider.setup=function(type){if(!fade){var sliderOffset,arr;if(type==="init"){slider.viewport=$('<div class="'+namespace+'viewport"></div>').css({"overflow":"hidden","position":"relative"}).appendTo(slider).append(slider.container);slider.cloneCount=0;slider.cloneOffset=0;if(reverse){arr=$.makeArray(slider.slides).reverse();slider.slides=$(arr);slider.container.empty().append(slider.slides);}}
if(vars.animationLoop&&!carousel){slider.cloneCount=2;slider.cloneOffset=1;if(type!=="init")slider.container.find('.clone').remove();slider.container.append(slider.slides.first().clone().addClass('clone')).prepend(slider.slides.last().clone().addClass('clone'));}
slider.newSlides=$(vars.selector,slider);sliderOffset=(reverse)?slider.count-1-slider.currentSlide+slider.cloneOffset:slider.currentSlide+slider.cloneOffset;if(vertical&&!carousel){slider.container.height((slider.count+slider.cloneCount)*200+"%").css("position","absolute").width("100%");setTimeout(function(){slider.newSlides.css({"display":"block"});slider.doMath();slider.viewport.height(slider.h);slider.setProps(sliderOffset*slider.h,"init");},(type==="init")?100:0);}else{slider.container.width((slider.count+slider.cloneCount)*200+"%");slider.setProps(sliderOffset*slider.computedW,"init");setTimeout(function(){slider.doMath();slider.newSlides.css({"width":slider.computedW,"float":"left","display":"block"});if(vars.smoothHeight)methods.smoothHeight();},(type==="init")?100:0);}}else{slider.slides.css({"width":"100%","float":"left","marginRight":"-100%","position":"relative"});if(type==="init"){if(!touch){slider.slides.eq(slider.currentSlide).fadeIn(vars.animationSpeed,vars.easing);}else{slider.slides.css({"opacity":0,"display":"block","webkitTransition":"opacity "+vars.animationSpeed/1000+"s ease"}).eq(slider.currentSlide).css({"opacity":1});}}
if(vars.smoothHeight)methods.smoothHeight();}
if(!carousel)slider.slides.removeClass(namespace+"active-slide").eq(slider.currentSlide).addClass(namespace+"active-slide");}
slider.doMath=function(){var slide=slider.slides.first(),slideMargin=vars.itemMargin,minItems=vars.minItems,maxItems=vars.maxItems;slider.w=slider.width();slider.h=slide.height();slider.boxPadding=slide.outerWidth()-slide.width();if(carousel){slider.itemT=vars.itemWidth+slideMargin;slider.minW=(minItems)?minItems*slider.itemT:slider.w;slider.maxW=(maxItems)?maxItems*slider.itemT:slider.w;slider.itemW=(slider.minW>slider.w)?(slider.w-(slideMargin*minItems))/minItems:(slider.maxW<slider.w)?(slider.w-(slideMargin*maxItems))/maxItems:(vars.itemWidth>slider.w)?slider.w:vars.itemWidth;slider.visible=Math.floor(slider.w/(slider.itemW+slideMargin));slider.move=(vars.move>0&&vars.move<slider.visible)?vars.move:slider.visible;slider.pagingCount=Math.ceil(((slider.count-slider.visible)/slider.move)+1);slider.last=slider.pagingCount-1;slider.limit=(slider.pagingCount===1)?0:(vars.itemWidth>slider.w)?((slider.itemW+(slideMargin*2))*slider.count)-slider.w-slideMargin:((slider.itemW+slideMargin)*slider.count)-slider.w-slideMargin;}else{slider.itemW=slider.w;slider.pagingCount=slider.count;slider.last=slider.count-1;}
slider.computedW=slider.itemW-slider.boxPadding;}
slider.update=function(pos,action){slider.doMath();if(!carousel){if(pos<slider.currentSlide){slider.currentSlide+=1;}else if(pos<=slider.currentSlide&&pos!==0){slider.currentSlide-=1;}
slider.animatingTo=slider.currentSlide;}
if(vars.controlNav&&!slider.manualControls){if((action==="add"&&!carousel)||slider.pagingCount>slider.controlNav.length){methods.controlNav.update("add");}else if((action==="remove"&&!carousel)||slider.pagingCount<slider.controlNav.length){if(carousel&&slider.currentSlide>slider.last){slider.currentSlide-=1;slider.animatingTo-=1;}
methods.controlNav.update("remove",slider.last);}}
if(vars.directionNav)methods.directionNav.update();}
slider.addSlide=function(obj,pos){var $obj=$(obj);slider.count+=1;slider.last=slider.count-1;if(vertical&&reverse){(pos!==undefined)?slider.slides.eq(slider.count-pos).after($obj):slider.container.prepend($obj);}else{(pos!==undefined)?slider.slides.eq(pos).before($obj):slider.container.append($obj);}
slider.update(pos,"add");slider.slides=$(vars.selector+':not(.clone)',slider);slider.setup();vars.added(slider);}
slider.removeSlide=function(obj){var pos=(isNaN(obj))?slider.slides.index($(obj)):obj;slider.count-=1;slider.last=slider.count-1;if(isNaN(obj)){$(obj,slider.slides).remove();}else{(vertical&&reverse)?slider.slides.eq(slider.last).remove():slider.slides.eq(obj).remove();}
slider.doMath();slider.update(pos,"remove");slider.slides=$(vars.selector+':not(.clone)',slider);slider.setup();vars.removed(slider);}
methods.init();}
$.flexslider.defaults={namespace:"flex-",selector:".slides > li",animation:"fade",easing:"swing",direction:"horizontal",reverse:false,animationLoop:true,smoothHeight:false,startAt:0,slideshow:true,slideshowSpeed:6000,animationSpeed:2000,initDelay:0,randomize:false,pauseOnAction:true,pauseOnHover:false,useCSS:true,touch:true,video:false,controlNav:true,directionNav:false,prevText:"Previous",nextText:"Next",keyboard:true,multipleKeyboard:false,mousewheel:false,pausePlay:false,pauseText:"Pause",playText:"Play",controlsContainer:".flexslider-container",manualControls:"",sync:"",asNavFor:"",itemWidth:0,itemMargin:0,minItems:0,maxItems:0,move:0,start:function(){},before:function(){},after:function(){},end:function(){},added:function(){},removed:function(){}}
$(function(){$('.flexslider li, .flex-caption').css({'margin':'0 ','padding':'0'});});$.fn.flexslider=function(options){if(options===undefined)options={};if(typeof options==="object"){return this.each(function(){var $this=$(this),selector=(options.selector)?options.selector:".slides > li",$slides=$this.find(selector);if($slides.length===1){$slides.fadeIn(400);if(options.start)options.start($this);}else if($this.data('flexslider')===undefined){new $.flexslider(this,options);}});}else{var $slider=$(this).data('flexslider');switch(options){case"play":$slider.play();break;case"pause":$slider.pause();break;case"next":$slider.flexAnimate($slider.getTarget("next"),true);break;case"prev":case"previous":$slider.flexAnimate($slider.getTarget("prev"),true);break;default:if(typeof options==="number")$slider.flexAnimate(options,true);}}}
$(window).load(function(){$('.flexslider').flexslider({animation: "slide", slideDirection: "horizontal"});$('.flexslider ol, .flex-container ul').css({'margin':'0 ','padding':'0'});$('.flexslider a').text('');$('.flexslider li').each(function(){var src=$(this).find('a').attr('href');var a='<a href="'+src+'"/></a>';$(this).has('a').find('img').unwrap().wrap(a);});$('.flex-caption:contains("Caption Text"), .flex-caption:empty').remove();$('.flexslider').has('.flex-caption').find('.flex-control-nav').addClass('alignRight');$('.flexslider li:not(:has(a))').find('img').unwrap();$(function(){$(".slides li").contents().filter(function(){return this.nodeType!=1;}).replaceWith("");});var ecWidth = $('#extraContainer1').parent().width();
        var ecHeight = $('#extraContainer1').parent().height();
        $('#extraContainer1 .flex-container').width(ecWidth);
        $('#extraContainer1').css('z-index','100');
        $('#extraContainer1 .flex-container p.flex-caption').css('top',ecHeight-50);
        $('#extraContainer1 .flex-container .flex-direction-nav li a').css('top',ecHeight / 2);
        $('#extraContainer1 .flex-container .flex-control-nav').css('top',ecHeight-50);});})(jQuery);
	return stack;
})(stacks.stacks_in_144_page0);


