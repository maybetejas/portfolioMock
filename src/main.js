document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector('.hero-title');
  if (!title) return;

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
          // Return a random char for the remaining indices
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      iteration += 1/3; // Adjusted for smoother flow

      if (iteration >= originalText.length) {
        clearInterval(interval);
        title.textContent = originalText;
        isScrambling = false;

        // --- THE FIX ---
        // Wait exactly 5 seconds AFTER completion before triggering again
        setTimeout(scrambleText, 5000); 
      }
    }, 30);
  }

  // Start the very first cycle
  scrambleText();

  // ... (Rest of your toggle and modal code remains the same)
});
const toggleBtn = document.getElementById("toggleBtn");
const hiddenItems = document.querySelectorAll(".hidden-item");

let expanded = false;

toggleBtn.addEventListener("click", () => {
  expanded = !expanded;

  hiddenItems.forEach(item => {
    item.style.display = expanded ? "block" : "none";
  });

  toggleBtn.innerText = expanded ? "SHOW LESS" : "SHOW MORE";
});