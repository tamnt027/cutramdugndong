// Mobile menu toggle
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Auto-hide flash after 5s
document.querySelectorAll('[data-flash]').forEach((el) => {
  setTimeout(() => el.classList.add('opacity-0'), 5000);
});

// Lightbox don gian cho gallery
document.querySelectorAll('[data-lightbox]').forEach((img) => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4 cursor-zoom-out';
    overlay.innerHTML = `<img src="${img.dataset.lightbox || img.src}" class="max-w-full max-h-full rounded-lg shadow-2xl" alt="">`;
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  });
});
