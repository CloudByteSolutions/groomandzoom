(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Prevent scroll restoration.
								if ('scrollRestoration' in history) {
									history.scrollRestoration = 'manual';
								}

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
									// Reset article scroll position
									$article.scrollTop(0);
								}, (initial ? 1000 : 0));

							// Add this for mobile
							if (browser.mobile) {
								setTimeout(function() {
									window.scrollTo(0, 1);
								}, 100);
							}

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

		// Prevent default scroll behavior when article is visible
			$window.on('wheel', function(event) {
				if ($body.hasClass('is-article-visible')) {
					event.preventDefault();
					return false;
				}
			});

	// Add this near the top of your main.js initialization
	window.addEventListener('load', function() {
		// Attempt to minimize URL bar on mobile
		setTimeout(function() {
			window.scrollTo(0, 1);
		}, 0);

		// Handle article scrolling
		$window.on('wheel', function(event) {
			if ($body.hasClass('is-article-visible')) {
				event.preventDefault();
				return false;
			}
		});
	});

	// Add this to your existing mobile detection/handling
	if (browser.mobile) {
		// Enable smooth scrolling on iOS
		document.documentElement.style.setProperty('--webkit-overflow-scrolling', 'touch');
		
		// Handle orientation changes
		window.addEventListener('orientationchange', function() {
			if ($body.hasClass('is-article-visible')) {
				setTimeout(function() {
					window.scrollTo(0, 1);
				}, 100);
			}
		});
	}

	// Modified initialization code
	$(function() {
		const taglineContainer = document.querySelector('.tagline');
		if (!taglineContainer) return;
		
		taglineContainer.innerHTML = '';
		
		// Create containers for each phrase
		const phrases = ['Sit.', 'Stay.'];
		const lastPhrase = ["We're", "on", "the", "way!"];
		
		// Add first two phrases
		const spans = phrases.map(phrase => {
			const span = document.createElement('span');
			span.className = 'fade-text';
			span.textContent = phrase;
			taglineContainer.appendChild(span);
			return span;
		});

		// Add last phrase words individually
		const lastPhraseSpans = lastPhrase.map(word => {
			const span = document.createElement('span');
			span.className = 'fade-text last-phrase';
			span.textContent = word;
			taglineContainer.appendChild(span);
			return span;
		});

		// Animate each element
		function startAnimations() {
			// First two phrases
			spans.forEach((span, i) => {
				setTimeout(() => {
					span.classList.add('visible');
				}, i * 700);
			});

			// Last phrase words with bouncy timing
			const baseDelay = spans.length * 700;
			lastPhraseSpans.forEach((span, i) => {
				setTimeout(() => {
					span.classList.add('visible');
				}, baseDelay + (i * 300));  // Fixed sequential timing, 300ms between each word
			});

			// Fade in location text
			const locationText = document.querySelector('.location');
			if (locationText) {
				setTimeout(() => {
					locationText.classList.add('visible');
				}, baseDelay + (lastPhraseSpans.length * 300) + 600);
			}

			// Fade in Book Now button last
			const bookButton = document.querySelector('.button.primary');
			if (bookButton) {
				setTimeout(() => {
					bookButton.classList.add('visible');
				}, baseDelay + (lastPhraseSpans.length * 300) + 1200);
			}
		}

		// Start animations after a short delay
		setTimeout(startAnimations, 500);
	});

	$(function(){
		// If using an ID, use: $('#bookNowButton')
		$('.button.primary').on('click', function(event) {
		  event.preventDefault(); // Prevent the default link behavior
		  
		  // Replace the entire page with the iframe container
		  $('body').html(
			'<div style="width:100vw; height:100vh;">' +
			  '<iframe src="https://booking.moego.pet/ol/GroomandZoom121847/landing?utm_medium=embed" ' +
					  'style="width:100%; height:100%; border:0;" ' +
					  'title="Online booking" scrolling="no"></iframe>' +
			'</div>'
		  );
		});
	  });
	  
})(jQuery);