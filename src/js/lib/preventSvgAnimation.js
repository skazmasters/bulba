export default function preventSvgAnimation() {
	// detect ie and add class to prevent svg animation
	if(navigator.userAgent.match(/MSIE/) || navigator.appVersion.match(/Trident/)) {
		let images = document.querySelectorAll('.js-feature-image');
		for(let i=0; i<images.length; i++) {
			images[i].classList.add('ie-no-svg');
		}
	}
}
