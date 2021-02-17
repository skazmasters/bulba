export default function setupInfoDialog() {
	if(document.querySelectorAll('.js-info-dialog').length) {
		const dialog = document.querySelector('.js-info-dialog');
		const closeBtn = dialog.querySelector('.js-close');

		closeBtn.addEventListener('click', toggleDialog);
		setTimeout(toggleDialog, 800);

		function toggleDialog() {
			dialog.classList.toggle('visible');
		}
	}
}
