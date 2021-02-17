export default function setTooltips() {
	const wrappers = document.querySelectorAll('.js-tooltip-wrapper');
	const tooltipSize = 250;
	const tooltipLeftIndent = 20;
	const tooltipBottomIndent = 30;

	wrappers.forEach((wrapper) => {
		wrapper.addEventListener('mousemove', (e) => {
			const tooltip = wrapper.querySelector('.js-tooltip');

			// Mouse position relative to the wrapper
			const rect = e.target.getBoundingClientRect();
			const x = e.clientX - ~~rect.left; // x position within the element.
			const y = e.clientY - ~~rect.top; // y position within the element.

			tooltip.style.left = `${x + tooltipLeftIndent}px`;
			tooltip.style.top = `${y - tooltipSize - tooltipBottomIndent}px`;
			const bgKey = wrapper.dataset.tooltip;
			tooltip.style.backgroundImage = `url(${getBgURL(bgKey)})`;
			tooltip.style.backgroundSize = 'cover';
			tooltip.style.display = 'block';
		});
		wrapper.addEventListener('mouseleave', () => {
			const tooltip = wrapper.querySelector('.js-tooltip');
			tooltip.style.display = 'none';
		});
	});
}

function getBgURL(key) {
	switch(key) {
		case 'founder-1':
			return './img/founders/founder_1.png';
		case 'founder-2':
			return './img/founders/founder_2.png';
	}
}
