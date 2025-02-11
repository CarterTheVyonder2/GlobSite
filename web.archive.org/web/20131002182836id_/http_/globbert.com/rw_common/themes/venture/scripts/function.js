$.noConflict();
  jQuery(document).ready(function($) {

	RwGet = { pathto: function(path, file) { var rtrim = function(str, list) { var charlist = !list ? 's\xA0': (list + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1'); var re = new RegExp('[' + charlist + ']+$', 'g'); return (str + '').replace(re, ''); }; var jspathto = rtrim(RwSet.pathto, "javascript.js"); if ((path !== undefined) && (file !== undefined)) { jspathto = jspathto + path + file; } else if (path !== undefined) { jspathto = jspathto + path; } return jspathto; }, baseurl: function(path, file) { var jsbaseurl = RwSet.baseurl; if ((path !== undefined) && (file !== undefined)) { jsbaseurl = jsbaseurl + path + file; } else if (path !== undefined) { jsbaseurl = jsbaseurl + path; } return jsbaseurl; } };
	
	var extraContent =  (function() {
		var ecValue = 10;
		for (i=1;i<=ecValue;i++)
		{
			$('#myExtraContent'+i+' script').remove();
			$('#myExtraContent'+i).appendTo('#extraContainer'+i);
		}
	})();
	
	// Alt Title Placement
	
	if($('#titleAlt').css('left') === '-1px'){
		$('#siteLink, header h2').appendTo('#titleAlt');
		$('nav').addClass('titleAlt');
	}
   
   // Flex Slider
   
   if(jQuery('.flexslider', '#extraContainer1').length){
   	jQuery('header nav ul').addClass('fnav')
   	jQuery('#feature').addClass('sfback')
   }
   
   // Social
   
    $('a.social').appendTo('aside #socialicons');
   
   jQuery('aside #socialicons').clone().prependTo('#padding');
   
   if(jQuery('aside #socialicons a').length){
   	
   	jQuery('#sideTitle').addClass('siST')
   }
   
   // Navigation
   
  $("nav > ul > li, nav > ul > li > ul > li").hover(
    function () {
    	if($('ul:first',this).css('display') === 'none'){
      		$(this).find('ul:first').stop('true','true').animate({height: 'toggle'}, 250);
      	}
    }, 
    function () {
    	if($('ul:first',this).css('display') === 'block'){
      		$(this).find('ul:first').stop('true','true').animate({height: 'toggle'}, 250);
      	}
    }
  );
   
   // prettyPhoto

    if ($('.album-wrapper').length || $('.movie-thumbnail-frame').length) {
       $("head").append("<link>").children(":last").attr({
         rel:  "stylesheet",
         type: "text/css",
         href: RwGet.pathto('css/prettyPhoto.css')
       });
       $.getScript(RwGet.pathto('scripts/jquery.prettyPhoto.js'),
       function() {
           if ($('.album-wrapper').length) {
               $('.thumbnail-frame').each(function() {
                   var thisAnch = $('a', this);
                   var thisImg = $('a img', this);
                   var thisCap = $('.thumbnail-caption', this);
                   thisAnch.attr({
                       'href': thisImg.attr('src').replace(/thumb/i, 'full'),
                       'rel': 'prettyPhoto[gallery]',
                       'title': thisCap.text()
                   });
               });
           }
           $('a[rel^=prettyPhoto]').prettyPhoto({
               animation_speed: 'fast',
               opacity: 0.70,
               show_title: false
           });
       });
    };
});