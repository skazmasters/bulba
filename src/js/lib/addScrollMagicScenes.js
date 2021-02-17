import ScrollMagic from 'scrollmagic';
import drawCanvas from './letterAnimation';
import scramble from './scrambler';

export default function addScrollMagicScenes() {
	const controller = new ScrollMagic.Controller();

	const elements = document.querySelectorAll('.is-underlined');
	elements.forEach(function(item) {
		const scene = new ScrollMagic.Scene({triggerElement: item, offset: -window.innerHeight*0.35})
			.on('start', () => {
				item.classList.add('is-underlined--active');
			})
			.addTo(controller);
	});

	if (window.innerWidth > 500) {
		const projectsSection = document.querySelector('#projects');
		if(projectsSection) {
			const blueScene = new ScrollMagic.Scene({
				triggerHook: 0,
				triggerElement: '#projects',
				duration: projectsSection.offsetHeight - window.outerHeight
			})
				.on('start end', () => {
					projectsSection.classList.toggle('projects--bg-active');
				})
				.addTo(controller);
		}
		// const jobsSection = document.querySelector('#jobs');
		// const jobsScene = new ScrollMagic.Scene({
		//   triggerHook: 0,
		//   triggerElement: '#jobs',
		//   duration: jobsSection.offsetHeight - window.outerHeight
		// })
		//   .on('start end', () => {
		//     jobsSection.classList.toggle('jobs--bg-active');
		//   })
		//   .addTo(controller);
	}

	const feature = document.querySelector('#features');
	if(feature) {
		const featureImages = feature.querySelectorAll('.js-feature-image');
		featureImages.forEach(function(image) {
			const scene = new ScrollMagic.Scene({triggerElement: image, offset: -window.innerHeight*0.25})
				.on('start', () => {
					image.classList.add('features__image--active');
					scene.enabled(false);
				})
				.addTo(controller);
		});
	}


	const arrowUp = document.querySelector('#arrow-up');
	const arrowUpScene = new ScrollMagic.Scene({triggerElement: arrowUp, offset: -window.innerHeight})
		.on('start', () => {
			arrowUp.classList.add('arrow--active');
			arrowUpScene.enabled(false);
		})
		.addTo(controller);

	const canvasTrigger = document.querySelector('#mission');
	if(canvasTrigger) {
		const canvasScene = new ScrollMagic.Scene({triggerElement: canvasTrigger, duration: canvasTrigger.offsetHeight * 0.8})
			.on('start', () => {
				const wrapper = document.querySelector('.canvas-wrap');
				const w = parseInt(getComputedStyle(wrapper).width, 10);
				const h = parseInt(getComputedStyle(wrapper).height, 10);
				drawCanvas(w, h);
				canvasScene.enabled(false);
			})
			.addTo(controller);
	}

	// When scroll achieves [data-scrambler] element
	// it looks for a children with .js-data-scrambler-item class
	// and run scramble animation for each of them
	// otherwise it scrambles [data-scrambler] element itself
	const scrambleElements = document.querySelectorAll('[data-scrambler]');
	if(scrambleElements.length) {
		scrambleElements.forEach(function(item) {
			const childs = item.querySelectorAll('.js-data-scrambler-item');
			const scene = new ScrollMagic.Scene({triggerElement: item, offset: -window.innerHeight*0.4})
				.on('start', () => {
					if (childs.length) {
						childs.forEach((child) => {
							scramble(child);
						});
					} else {
						scramble(item);
					}
					scene.enabled(false);
				})
				.addTo(controller);
		});
	}
}
