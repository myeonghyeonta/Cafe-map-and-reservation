var PageTransitions = (function () {

	var $main = $('#pt-main'),
		$pages = $main.children('div.pt-page'),
		$iterate = $('#iterateEffects'),
		animcursor = 1,
		pagesCount = $pages.length,
		current = 0,
		isAnimating = false,
		endCurrPage = false,
		endNextPage = false,
		animEndEventNames = {
			'WebkitAnimation': 'webkitAnimationEnd',
			'OAnimation': 'oAnimationEnd',
			'msAnimation': 'MSAnimationEnd',
			'animation': 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[Modernizr.prefixed('animation')],
		// support css animations
		support = Modernizr.cssanimations;

	function init() {

		$pages.each(function () {
			var $page = $(this);
			$page.data('originalClassList', $page.attr('class'));
		});

		$pages.eq(current).addClass('pt-page-current');

		// $main.scroll(function(){
		// 	if (isAnimating) {
		// 		return false;
		// 	}
		// 	nextPage(animcursor);
		//   });

		$main.bind("wheel", function () {
				if (isAnimating) {
					return false;
				}
				nextPage(animcursor);
			});
	}

	function nextPage(options) {
		var animation = (options.animation) ? options.animation : options;

		if (isAnimating) {
			return false;
		}

		isAnimating = true;

		var $currPage = $pages.eq(current);

		if (options.showPage) {
			if (options.showPage < pagesCount - 1) {
				current = options.showPage;
			}
			else {
				current = 0;
			}
		}
		else {
			if (current < pagesCount - 1) {
				++current;
			}
			else {
				current = 0;
			}
		}

		var $nextPage = $pages.eq(current).addClass('pt-page-current'),
			outClass = 'pt-page-rotateCubeTopOut pt-page-ontop';
		inClass = 'pt-page-rotateCubeTopIn';

		$currPage.addClass(outClass).on(animEndEventName, function () {
			$currPage.off(animEndEventName);
			endCurrPage = true;
			if (endNextPage) {
				onEndAnimation($currPage, $nextPage);
			}
		});

		$nextPage.addClass(inClass).on(animEndEventName, function () {
			$nextPage.off(animEndEventName);
			endNextPage = true;
			if (endCurrPage) {
				onEndAnimation($currPage, $nextPage);
			}
		});

		if (!support) {
			onEndAnimation($currPage, $nextPage);
		}
	}

	function onEndAnimation($outpage, $inpage) {
		endCurrPage = false;
		endNextPage = false;
		resetPage($outpage, $inpage);
		isAnimating = false;
	}

	function resetPage($outpage, $inpage) {
		$outpage.attr('class', $outpage.data('originalClassList'));
		$inpage.attr('class', $inpage.data('originalClassList') + ' pt-page-current');
	}

	init();

	return {
		init: init,
		nextPage: nextPage,
	};

})();