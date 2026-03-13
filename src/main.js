document.addEventListener("DOMContentLoaded", () => {
  const scrambleEl = document.getElementById("scramble");
  const toggleBtn = document.getElementById("toggleBtn");
  const hiddenItems = document.querySelectorAll(".hidden-item");
  const growthSection = document.querySelector(".growth-visual");
  const chartBars = document.querySelectorAll(".chart-bar");
  const backToTop = document.getElementById("backToTop");
  const languageToggle = document.getElementById("languageToggle");

  const getGoogleTranslateCookie = () => {
    const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : "";
  };

  const isHindiActive = () => getGoogleTranslateCookie().includes("/en/hi");

  const updateLanguageToggleLabel = () => {
    if (!languageToggle) {
      return;
    }

    const hindiActive = isHindiActive();
    languageToggle.textContent = hindiActive ? "ENGLISH" : "HINDI";
    languageToggle.setAttribute("aria-pressed", String(hindiActive));
  };

  const setGoogleTranslateCookie = (value) => {
    const cookieValue = `googtrans=${value};path=/;max-age=31536000`;
    document.cookie = cookieValue;
    document.cookie = `${cookieValue};domain=${window.location.hostname}`;
  };

  const clearGoogleTranslateCookie = () => {
    const expires = "expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    document.cookie = `googtrans=;${expires}`;
    document.cookie = `googtrans=;${expires};domain=${window.location.hostname}`;
  };

  const waitForTranslateSelect = (attempts = 20) =>
    new Promise((resolve) => {
      const check = () => {
        const select = document.querySelector(".goog-te-combo");

        if (select || attempts <= 0) {
          resolve(select);
          return;
        }

        attempts -= 1;
        window.setTimeout(check, 250);
      };

      check();
    });

  if (scrambleEl) {
    const finalText = scrambleEl.dataset.text || scrambleEl.textContent || "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    const runScramble = () => {
      let iteration = 0;

      const interval = setInterval(() => {
        scrambleEl.textContent = finalText
          .split("")
          .map((char, index) => {
            if (char === " ") {
              return " ";
            }

            if (index < iteration) {
              return char;
            }

            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");

        iteration += 0.5;

        if (iteration >= finalText.length) {
          clearInterval(interval);
          scrambleEl.textContent = finalText;

          // Restart only after one full completed cycle.
          setTimeout(runScramble, 5000);
        }
      }, 50);
    };

    runScramble();
  }

  if (toggleBtn && hiddenItems.length > 0) {
    let expanded = false;

    toggleBtn.addEventListener("click", () => {
      expanded = !expanded;

      hiddenItems.forEach((item) => {
        item.style.display = expanded ? "block" : "none";
      });

      toggleBtn.textContent = expanded ? "SHOW LESS" : "SHOW MORE";
      toggleBtn.setAttribute("aria-expanded", String(expanded));
    });
  }

  if (growthSection && chartBars.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          chartBars.forEach((bar) => {
            bar.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
          });
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(growthSection);
  }

  if (backToTop) {
    window.addEventListener("scroll", () => {
      const shouldShow = window.scrollY > window.innerHeight * 0.8;
      backToTop.classList.toggle("show", shouldShow);
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (languageToggle) {
    updateLanguageToggleLabel();

    languageToggle.addEventListener("click", async () => {
      if (isHindiActive()) {
        clearGoogleTranslateCookie();
        window.location.reload();
        return;
      }

      setGoogleTranslateCookie("/en/hi");
      updateLanguageToggleLabel();

      const select = await waitForTranslateSelect();

      if (!select) {
        window.location.reload();
        return;
      }

      select.value = "hi";
      select.dispatchEvent(new Event("change"));
    });
  }
});
