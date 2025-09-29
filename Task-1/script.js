// FAQ expand/collapse with smooth transition and aria updates
document.addEventListener('DOMContentLoaded', function onReady() {
	const items = document.querySelectorAll('.faq-item');
	items.forEach((item) => {
		const button = item.querySelector('.faq-item__button');
		const answer = item.querySelector('.faq-item__answer');
		if (item.classList.contains('active')) {
			answer.style.maxHeight = answer.scrollHeight + 'px';
		}
		button.addEventListener('click', () => {
			const isOpen = item.classList.contains('active');
			item.classList.toggle('active');
			button.setAttribute('aria-expanded', String(!isOpen));
			if (item.classList.contains('active')) {
				answer.style.maxHeight = answer.scrollHeight + 'px';
			} else {
				answer.style.maxHeight = '0px';
			}
		});
	});
});


