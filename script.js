const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.main-nav');
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.work-card');
const form = document.querySelector('#contactForm');
const formMessage = document.querySelector('.form-message');

// 手機版選單開關
menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', isOpen);
  menuButton.textContent = isOpen ? '關閉' : '選單';
});

// 點選作品分類時，只顯示相符的作品
filters.forEach((filter) => {
  filter.addEventListener('click', () => {
    filters.forEach((item) => item.classList.remove('active'));
    filter.classList.add('active');
    const type = filter.dataset.filter;
    cards.forEach((card) => {
      card.classList.toggle('hidden', type !== 'all' && card.dataset.category !== type);
    });
  });
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = '選單';
  });
});

// 目前是展示用表單，送出後提供清楚的回覆提示
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = new FormData(form).get('name');
  formMessage.textContent = `${name}，謝謝你的來信！我會盡快與你聯絡。`;
  form.reset();
});
