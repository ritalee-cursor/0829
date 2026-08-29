const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.main-nav');
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.work-card');
const form = document.querySelector('#contactForm');
const formMessage = document.querySelector('.form-message');
const submitButton = form.querySelector('button[type="submit"]');

// Supabase 的公開金鑰只能依照資料表的 RLS 規則新增資料，不能讀取預約內容。
const supabaseUrl = 'https://yqhomeonohrejyeoluft.supabase.co';
const supabasePublishableKey = 'sb_publishable_hc9jbFyqgPwaG-0YPf0-xA_xWDNERFW';

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

// 送出表單後，將預約內容安全寫入 Supabase。
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const booking = {
    name: formData.get('name').trim(),
    contact: formData.get('contact').trim(),
    service: formData.get('service'),
    message: formData.get('message').trim() || null
  };

  submitButton.disabled = true;
  formMessage.textContent = '正在送出⋯⋯';

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/booking_inquiries`, {
      method: 'POST',
      headers: {
        apikey: supabasePublishableKey,
        Authorization: `Bearer ${supabasePublishableKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(booking)
    });

    if (!response.ok) throw new Error('預約送出失敗');

    formMessage.textContent = '謝謝你的填寫！我已收到你的預約，會盡快和你聯絡。';
    form.reset();
  } catch (error) {
    formMessage.textContent = '目前無法送出，請稍後再試，或改用其他方式聯絡我。';
  } finally {
    submitButton.disabled = false;
  }
});
