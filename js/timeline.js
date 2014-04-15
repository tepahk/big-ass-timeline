(function($) {

	var timelineItems = $('#timeline .timeline-item'),
	currentTimelineItem = $('#timeline .timeline-item.active').length == 0 ? $('#timeline .timeline-item:first-child') : $('#timeline .timeline-item.active'),
	timelineMonth = $('#timeline .timeline-month'),
	timelineNav = $('#timeline-nav');

	//global mobile boolean
	isMobile = window.innerWidth < 750 ? true : false;

	// helper functions
	var closest = function(array,num){
		var i=0;
		var minDiff=1000;
		var ans;
		for(i in array){
			var m=Math.abs(num-array[i].top);
			if(m<minDiff){ 
				minDiff=m; 
				ans=array[i]; 
			}
		}
		return ans;
	}

	var setWindowSize = function(){
		timelineItems.height( window.innerHeight ? window.innerHeight : $(window).height() );
	};

	// init timeline month nav
	var initTimelineNav = function(){

		timelineNav.find('.timeline-nav-month a').each(function(){
			var thisMonth = $(this).attr('href');
			if( $(thisMonth).length > 0 ){
				$(this).parent('li').addClass('existing');
			}
		})
		timelineNav.find('.timeline-nav-month.existing a')
		.on('click', function(e){
			e.preventDefault();
			var thisMonth = $(this).attr('href').replace('#', ''),
			thisMonthTop = '';
			for(var i=0; i < timelinePositions.length; i++){
				if( timelinePositions[i].month == thisMonth ){
					if( timelinePositions[i].index == '0' ){
						thisMonthTop = timelinePositions[i].top;
					}
				}
			}
			$('body,html').animate({
				scrollTop : thisMonthTop
			});
		//$('.timeline-nav-month.existing a').removeClass('active');
		//$(this).addClass('active');
		//window.location.hash = thisMonth;
		return false;
	});
		if( !isMobile ){
			timelineNav.hover(function(e){
				$('.page .overlay').stop(false, false).fadeToggle('fast');
			})
		}
	};

	var initTimeline = function(){

		// create global var to hold all timeline top offsets, generated in the loop below
		timelinePositions = [];

		// add background images 
		timelineMonth.each(function(){
			var thisMonth = $(this).attr('id');
			$( $(this).find('.timeline-item').get().reverse() ).each(function(e){
				//add background images
				var thisMonthID = $(this).parent('.timeline-month').attr('id');
				// add items to timelinePostitions global object
				var thisItem = { "month":thisMonthID, "top": $(this).offset().top, "index": e };
				timelinePositions.push( thisItem );

				// add bottom arrow
				$(this).addClass('has-arrow').append('<div class="down"></div>')

			})
		})

		// if hash exists, scroll to month
		// if( window.location.hash.length > 0 ){
		// 	var thisMonth = window.location.hash.replace('#', '');
		// 	$('body,html').animate({
		// 		scrollTop : $(thisMonth).position().top
		// 	});
		// 	timelineNav.find('a[href='+thisMonth+']').addClass('active');
		// }else{
		// 	timelineNav.find('.timeline-nav-month:first a').addClass('active');
		// }

	}

	var initModals = function(){

		$('.timeline-item-carousel li a').on('click', function(e){
			e.preventDefault();

			var dataType = 'photo',
			thisHref = $(this).attr('href'),
			thisCaption = $(this).attr('data-caption'),
			thisParentItem = $(this).parents('.timeline-item'),
			modalContent = '';

			if( thisHref.indexOf('youtube') > -1 ){
				dataType = 'video';
			}

			if( dataType == 'video' ){
				if( isMobile ){
					document.location.href = thisHref;
				}else{
					var thisHeight = thisParentItem.height() - 150 +'px';
					modalContent += '<div class="modal modal-video"><iframe width="100%" height="'+thisHeight+'" src="'+thisHref+'?autoplay=1" frameborder="0" allowfullscreen></iframe><div class="close"></div></div>';
				}
			}else{
				modalContent += '<div class="modal modal-photo" style="background-image:url()" >';
				if( thisCaption ){
					modalContent += '<p class="modal-caption">'+thisCaption+'</p>';
				}
				modalContent += '<div class="close"></div></div>';
			}
			thisParentItem.remove('.modal');
			thisParentItem.addClass('modal-open').append( modalContent );

			thisParentItem.find('.close').on('click', function(){
				thisParentItem.removeClass('modal-open');
				thisParentItem.find('.modal').remove();
			})

		})

}

var testArrows = function(thisCarousel, currentPosition){
	var thisCarouselContainerWidth = thisCarousel.find('.carousel-container').width(),
	thisCarouselListWidth = thisCarousel.find('ul').width();

		// hide arrows if not necessary
		if( currentPosition < 0 ){
			thisCarousel.find('.arrow-left').show();
		}else{
			thisCarousel.find('.arrow-left').hide();
		}

		if( currentPosition > thisCarouselContainerWidth - thisCarouselListWidth ){
			thisCarousel.find('.arrow-right').show();
		}else{
			thisCarousel.find('.arrow-right').hide();
		}
	}

	var reInitCarousels = function(){
		$('.timeline-item-carousel').each(function(){
			var thisCarousel = $(this),
			thisCarouselContainer = thisCarousel.find('.carousel-container'),
			thisCarouselList = thisCarousel.find('ul'),
			thisCarouselItem = thisCarouselList.find('li'),
			thisCarouselItemWidth = thisCarouselItem.width() + parseInt(thisCarouselItem.css('margin-left'))*2,
			currentPosition = parseInt( thisCarouselList.css('left') );

			thisCarouselList.width( thisCarouselItemWidth * thisCarouselItem.length );
			testArrows(thisCarousel, currentPosition);
		})
	}

	// end helper functions

	// do the stuff below on load
	setWindowSize();
	initTimelineNav();
	initTimeline();
	initModals();
	reInitCarousels();
	$('.timeline-item:last').removeClass('has-arrow');
	$('.timeline-item:last .down').remove();

	$('.down').on('click', function(){
		var newScroll = $(this).parent('.timeline-item').next('.timeline-item').length > 0 ? $(this).parent('.timeline-item').next('.timeline-item').offset().top : $(this).parents('.timeline-month').next('.timeline-month').offset().top;
		$('body,html').animate({
			scrollTop: newScroll
		})
	})

	$('.arrow').on('click', function(){
		var thisCarousel = $(this).parent('.timeline-item-carousel'),
		thisCarouselList = thisCarousel.find('ul'),
		currentPosition = parseInt(thisCarouselList.css('left'));

		if( $(this).hasClass('arrow-right') ){
			thisCarouselList.animate({
				left: '-=200px'
			})
			currentPosition = currentPosition - 200;
		}else{
			thisCarouselList.animate({
				left: '+=200px'
			})
			currentPosition = currentPosition + 200;
		}
		testArrows(thisCarousel, currentPosition);
	})

	// update timeline item size on browser resize
	$(window)
	.resize(function(e){
		setWindowSize();
		reInitCarousels();
		isMobile = window.innerWidth < 750 ? true : false;
	})
	.scroll(function(e){
		var thisScroll = $(window).scrollTop(),
		closestItem = closest(timelinePositions, thisScroll),
		proximity = 100;
		$('.timeline-nav-month a').removeClass('active');
		$('.timeline-nav-month a[href="#'+closestItem.month+'"]').addClass('active');

		// mobile or small resolutions
		var firstItemTop = Math.floor($('.timeline-item').offset().top);
		if( thisScroll < firstItemTop ){
			timelineNav.fadeOut('fast');
		}else{
			timelineNav.fadeIn('fast');
		}

	})

	// $(document).scrollsnap({
	// 	snaps: '.timeline-item',
	// 	duration: 300,
	// 	proximity: 200
	// });


})(jQuery);