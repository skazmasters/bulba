import smoothscroll from 'smoothscroll-polyfill';
import './domConf';

export default function scrollTo() {

	smoothscroll.polyfill();

	document.querySelectorAll('.js-scroll-to').forEach(item => {
		item.addEventListener('click',(e) => {
			e.preventDefault();
			let targetel = item.getAttribute('href');
			let target = document.querySelector(targetel);
			let timeDelay;
			if(window.DOM.menuWrapper.classList.contains('menu--visible')) {
				window.DOM.menuWrapper.classList.remove('menu--visible');
				// visible scroll is required for calculation in the offset function
				window.DOM.showScroll();
				timeDelay = 480;
			} else {
				timeDelay = 0;
			}

			setTimeout(function() {
				let offs = offset(target);
				window.scroll({
					top: offs,
					behavior: 'smooth'
				});
			}, timeDelay);
		});
	});

}

function offset(el) {
	var rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return rect.top + scrollTop;
}
