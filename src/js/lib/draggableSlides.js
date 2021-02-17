import {handleMove} from './crsor';

export default function setDraggableSlides() {

	const swiper_about = new Swiper('.js-about-slider', {
		slidesPerView: 'auto',
		freeMode: true,
		freeModeMomentum: false,
		spaceBetween: 30,
		breakpoints: {
			900: {
				spaceBetween: 20
			},
			500: {
				spaceBetween: 30,
				freeMode: false
			}
		}
	});
	swiper_about.on('touchMove', (e) => {
		handleMove(e);
	});

	const swiper_partnership = new Swiper('.js-partnership-slider', {
		slidesPerView: 'auto',
		spaceBetween: 20,
		freeMode: true,
		freeModeMomentum: false,
		breakpoints: {
			500: {
				spaceBetween: 37,
				freeMode: false
			}
		}
	});
	swiper_partnership.on('touchMove', (e) => {
		handleMove(e);
	});

	const swiper_tech = new Swiper('.js-tech-slider', {
		spaceBetween: 40,
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
			disabledClass: 'swiper-button-disabled'
		},
		pagination: {
			el: '.swiper-pagination',
			type: 'bullets',
			clickable: true
		}
	});
	swiper_tech.on('touchMove', (e) => {
		handleMove(e);
	});
}
