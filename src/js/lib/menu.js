import './domConf';
export default function menu() {
	let menuWrapper = window.DOM.menuWrapper;
	let menuOpenButton = document.querySelector('#menu-toggle');
	let mainNavClose = document.querySelector('#main-nav_close');
	let mainNav = window.DOM.mainNav;
	const MENU_OPEN_DELAY = 150; // ms

	menuOpenButton.addEventListener('mouseenter', () => {
		// Disable opening menu on hover on small devices
		if (window.matchMedia('(max-width: 500px)').matches) return false;
		// Set up timer to delay menu appearance
		// and get rid of unnecessary menu activation
		let timer = setTimeout(() => {
			toggleClassMenu();
			menuOpenButton.removeEventListener('mouseleave', onButtonLeave);
		}, MENU_OPEN_DELAY);
		menuOpenButton.addEventListener('mouseleave', onButtonLeave);

		function onButtonLeave() {
			clearTimeout(timer);
		}
	});

	menuOpenButton.addEventListener('click', toggleClassMenu);
	mainNavClose.addEventListener('click', toggleClassMenu);

	function toggleClassMenu() {
		if(menuWrapper.classList.contains('menu--visible')) {
			menuWrapper.classList.remove('menu--visible');
			mainNav.removeEventListener('mouseleave', onMouseLeave);
			window.DOM.showScroll();
		} else {
			window.DOM.hideScroll();
			menuWrapper.classList.add('menu--visible');
			if (window.matchMedia('(min-width: 500px)').matches) {
				mainNav.addEventListener('mouseleave', onMouseLeave);
			}
		}
	}

	function onMouseLeave() {
		menuWrapper.classList.remove('menu--visible');
		window.DOM.showScroll();
	}

}
