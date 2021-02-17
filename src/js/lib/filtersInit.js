import './domConf';
import ScrollMagic from 'scrollmagic';
import scramble from './scrambler';

export default function() {
	const controller = new ScrollMagic.Controller();
	const scenes = [];
	const jobsInnerElem = document.querySelector('.js-jobs-inner');
	const emptyMssg = jobsInnerElem.dataset.empty;
	const filters = document.querySelectorAll('.js-filter');
	const jobsLoadElem = document.querySelector('.js-jobs-load');
	const checkedItem = document.querySelectorAll('.filters-item-check');
	
	/**
	 * Парсинг и кеширование данных списка вакансий из html
	 * @returns {Array} массив объектов
	 */
	function getJobsData() {
		if (getJobsData.data) return JSON.parse(getJobsData.data);
		const elem = document.querySelector('#jobs-cards-data');
		getJobsData.data = elem.textContent;
		return elem ? JSON.parse(elem.textContent) : [];
	}
	
	/**
	 * Если карточек больше 6-и, приячем остальные
	 * @param {Array} arr 
	 */

	function hideMoreBtn(arr= []) {
		if (!jobsLoadElem) return;
		jobsLoadElem.classList[arr.length > 6 ? 'remove' : 'add']('hidden');
	}
	hideMoreBtn(getJobsData());
	
	if (filters.length) {
		const body = document.body;
		const filterBodys = document.querySelectorAll('.js-filter-body');
		
		checkedItem.forEach((check) => {
			if (check.checked) {
				changeChecked(check);
			}
			check.addEventListener('change', function() {
				changeChecked(this);
				renderJobsList(filtering(getJobsData()));
			});
		});

		filters.forEach((filter) => {
			filter.addEventListener('click', showFilter);
		});

		body.addEventListener('click', (e) => {
			let t = e.target;
			onClick(t);
		});

		jobsLoadElem.addEventListener('click', jobsLoadMore);

		function changeChecked(el) {
			const checkFilter = el.closest('.filters-item');
			const checkFilterTitle = checkFilter.querySelector('.filters-item-head__text');
			const checkParent = el.closest('.filters-item-body__item');
			const checkBody = checkFilter.querySelector('.filters-item-body');
			const checkText = checkParent.querySelector('.filters-item-body__text').innerHTML;
			checkFilterTitle.innerHTML = checkText;
			setTimeout(() => {
				checkBody.classList.remove('show-filter');
			}, 20);
		}

		function showFilter(e) {
			let filterBody = this.querySelector('.filters-item-body');
			// this.classList.add('active-filter');
			setTimeout(() => {
				filterBody.classList.add('show-filter');
			}, 10);
		}

		function onClick(t) {
			if (!t.classList.contains('show-filter')) {
				filterBodys.forEach((bodyRemove) => {
					// if(bodyRemove.classList.contains('show-filter')) {
					bodyRemove.classList.remove('show-filter');
					// }
				});
			}
		}
	}

	/**
	 * Рендеринг списка ваканисий
	 * @param {Object[]} filteredArr отфильтрованный массив
	 */
	function renderJobsList(filteredArr) {
		const arr = filteredArr || getJobsData();
		if(!arr.length) {
			jobsInnerElem.innerHTML = `
        <li class="jobs-tile__no-result js-data-scrambler-item">
          ${emptyMssg}
        </li>
      `;
			const noResult = jobsInnerElem.querySelector('.js-data-scrambler-item');
			scramble(noResult);
			return;
		}

		jobsInnerElem.innerHTML = arr.reduce((newLayout, item, index) => {
			return newLayout + `
				<li 
					class="jobs-card crsor-trgr mouse ${index > 5 ? 'hidden' : ''}" 
					data-cursor-type="plus" 
					data-scrambler="data-scrambler" 
					id="${item.id || ''}"
				>
					<a 
						class="jobs-card__link" 
						target="_blank" 
						href="${item.link || ''}"
					>
						<h4 class="jobs-card__title">
							<span class="js-data-scrambler-item">${item.position || ''}</span>
						</h4>
						<p class="jobs-card__company js-data-scrambler-item">${item.company || ''}</p>
						<span class="jobs-card__location js-data-scrambler-item">${item.location || ''}</span>
					</a>
				</li>
			`;
		}, '');

		hideMoreBtn(arr);
		if(!scenes.length) {
			cardAnimation();
		} else {
			for(let s = 0; s<scenes.length; s++) {
				scenes[s].destroy();
			}
			const childsNewLoad = jobsInnerElem.querySelectorAll('.js-data-scrambler-item');
			childsNewLoad.forEach((newItem) => {
				scramble(newItem);
			});
		}
	}
	renderJobsList();

	function cardAnimation(elems = false) {
		const scrambleElems = elems || jobsInnerElem.querySelectorAll('[data-scrambler]:not(.hidden)');

		scrambleElems.forEach(function(item, index) {
			const childs = item.querySelectorAll('.js-data-scrambler-item');

			scenes.push(new ScrollMagic.Scene({
				triggerElement: item,
				offset: -window.innerHeight * 0.4
			})
				.on('start', () => {
					if (childs.length) {
						childs.forEach((child) => {
							scramble(child);
						});
					} else {
						scramble(item);
					}
					scenes[index].enabled(false);
				})
				.addTo(controller));
		});
	}

	function jobsLoadMore() {
		let hideCard = document.querySelectorAll('.jobs-card.hidden');
		let showingItem = [];

		for (let i = 0; i < hideCard.length; i++) {
			if (i < 2) {
				showingItem.push(hideCard[i]);
				hideCard[i].classList.remove('hidden');
				cardAnimation(showingItem);
				if (!document.querySelectorAll('.jobs-card.hidden').length) {
					this.classList.add('hidden');
				}
			}
		}
	}

	/**
	 * Фильтрация списка вакансий
	 * @param {Array} arr 
	 */
	function filtering(arr) {
		const oldArr = arr || getJobsData();
		const checkedInputArr = [...checkedItem].filter(item => item.checked);

		return oldArr.filter(card => {
			const tagsArr = card.tags || [];

			return checkedInputArr.every(input => {
				return tagsArr.some(tag => {
					return input.value === tag || input.value === '';
				});
			});
		});
	}

}
