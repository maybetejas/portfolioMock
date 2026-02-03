const title = document.querySelector('.hero-title');
const originalText = title.dataset.text;

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&';
let isScrambling = false;

function scrambleText() {
    if (isScrambling) return;
    isScrambling = true;

    let iteration = 0;

    const interval = setInterval(() => {
        title.textContent = originalText
            .split('')
            .map((char, index) => {
                if (index < iteration) return char;
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

        iteration += 0.5;

        if (iteration >= originalText.length) {
            clearInterval(interval);
            title.textContent = originalText;
            isScrambling = false;
        }
    }, 40);
}

// idle trigger — every ~5 seconds
setInterval(scrambleText, 3000);

const toggleBtn = document.getElementById('toggleDesigns');
const hiddenItems = document.querySelectorAll('.design-item.is-hidden');

let expanded = false;

toggleBtn.addEventListener('click', () => {
    expanded = !expanded;

    hiddenItems.forEach(item => {
        item.style.display = expanded ? 'block' : 'none';
    });

    toggleBtn.textContent = expanded ? 'Hide Designs' : 'Show More';
});

  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');

  document.querySelectorAll('.design-item img').forEach(img => {
    img.addEventListener('click', () => {
      modalImg.src = img.src;
      modal.classList.add('active');
    });
  });

  // click outside image closes modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      modalImg.src = '';
    }
  });