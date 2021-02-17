import './lib/domConf';
import './lib/polyfill-ie11-nodelist-foreach';
import './lib/polyfillArrayFrom';
import './lib/polyfillClosest';
import debounce from './lib/debounce';
import menu from './lib/menu';
import scrollTo from './lib/scrollTo';
import preventSvgAnimation from './lib/preventSvgAnimation';
import addScrollMagicScenes from './lib/addScrollMagicScenes';
import draggableSlides from './lib/draggableSlides';
import setTooltips from './lib/setTooltips';
import drawCanvas from './lib/letterAnimation';
import Crsor from './lib/crsor';
import setupInfoDialog from './lib/setupInfoDialog';
import filtersInit from './lib/filtersInit';

const onResize = debounce(onResizeFn, 800);

document.addEventListener('DOMContentLoaded', () => {
	// detect ie and add special class
	if(navigator.userAgent.match(/MSIE/) || navigator.appVersion.match(/Trident/)) {
		document.body.classList.add('old-browser');
	}
	window.DOM.getScrollWidth();
	menu();
	preventSvgAnimation();
	scrollTo();
	addScrollMagicScenes();
	draggableSlides();
	setupInfoDialog();
	filtersInit();
	if (window.matchMedia('(min-width: 500px)').matches && /Android|BlackBerry|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent) === false) {
		window.DOM.cursor = new Crsor();
		setTooltips();
	}

	window.addEventListener('resize', onResize);
	window.addEventListener('orientationchange', function() {
		setTimeout(() => {
			let wrapper = document.querySelector('.canvas-wrap');
			let w = parseInt(getComputedStyle(wrapper).width, 10);
			let h = parseInt(getComputedStyle(wrapper).height, 10);
			drawCanvas(w, h);
		}, 300);
	});

	// Hide cursor circle on mobile devices
	if(/Android|BlackBerry|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent) === true) {
		const cursor = document.querySelector('.crsor');
		cursor.style.display = 'none';
	}

});

function onResizeFn() {
	if (window.innerWidth > 500 && /Android|BlackBerry|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent) === false) {
		const wrapper = document.querySelector('.canvas-wrap');
		const w = parseInt(getComputedStyle(wrapper).width, 10);
		const h = parseInt(getComputedStyle(wrapper).height, 10);
		drawCanvas(w, h);
	}
}
