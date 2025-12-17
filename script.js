lucide.createIcons();
AOS.init({ duration: 800, once: true, offset: 50 });

// Mobile Menu
const mobileBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-link");
const menuIconContainer = document.getElementById("mobile-menu-btn");

const swapIcon = (isOpen) => {
  const iconName = isOpen ? "x" : "menu";
  menuIconContainer.innerHTML = `<i data-lucide="${iconName}" class="w-8 h-8 transition-transform duration-300 ${
    isOpen ? "rotate-90" : "rotate-0"
  }"></i>`;
  lucide.createIcons();
};

mobileBtn.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.contains("menu-hidden");

  if (isOpen) {
    mobileMenu.classList.remove("menu-hidden");
    mobileMenu.classList.add("menu-visible");
    swapIcon(true);
  } else {
    mobileMenu.classList.remove("menu-visible");
    mobileMenu.classList.add("menu-hidden");
    swapIcon(false);
  }
});

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("menu-visible");
    mobileMenu.classList.add("menu-hidden");
    swapIcon(false);
  });
});

// Stats Counters
const counters = document.querySelectorAll(".counter");
const statsSection = document.getElementById("stats-section");
let counted = false;

const animateCounters = () => {
  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    const updateCount = () => {
      const count = +counter.innerText;
      const inc = target / 100;
      if (count < target) {
        counter.innerText = Math.ceil(count + inc);
        setTimeout(updateCount, 20);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });
};

window.addEventListener("scroll", () => {
  if (
    !counted &&
    statsSection &&
    window.scrollY + window.innerHeight > statsSection.offsetTop
  ) {
    animateCounters();
    counted = true;
  }
});

// --- CUSTOM ACCESSIBILITY WIDGET JS ---
const body = document.body;
const a11yBtn = document.getElementById("a11y-btn");
const a11yMenu = document.getElementById("a11y-menu");
const a11yContrast = document.getElementById("a11y-contrast");
const a11yFontSm = document.getElementById("a11y-font-sm");
const a11yFontLg = document.getElementById("a11y-font-lg");
const a11yReset = document.getElementById("a11y-reset");

const FONT_CLASSES = ["a11y-text-md", "a11y-text-lg"];
const CONTRAST_CLASS = "high-contrast";

const loadSettings = () => {
  if (localStorage.getItem("a11y-contrast") === "true") {
    body.classList.add(CONTRAST_CLASS);
  }
  const fontSize = localStorage.getItem("a11y-font-size");
  if (fontSize && FONT_CLASSES.includes(fontSize)) {
    body.classList.add(fontSize);
  }
};

const updateFont = (newSizeClass) => {
  FONT_CLASSES.forEach((c) => body.classList.remove(c));

  if (newSizeClass) {
    body.classList.add(newSizeClass);
    localStorage.setItem("a11y-font-size", newSizeClass);
  } else {
    localStorage.removeItem("a11y-font-size");
  }
};

a11yBtn.addEventListener("click", () => {
  a11yMenu.classList.toggle("hidden");
  lucide.createIcons();
});

a11yContrast.addEventListener("click", () => {
  const isHighContrast = body.classList.toggle(CONTRAST_CLASS);
  localStorage.setItem("a11y-contrast", isHighContrast);
});

a11yFontLg.addEventListener("click", () => {
  let currentSize = localStorage.getItem("a11y-font-size");
  let newSize = "";

  if (!currentSize) {
    newSize = "a11y-text-md";
  } else if (currentSize === "a11y-text-md") {
    newSize = "a11y-text-lg";
  } else if (currentSize === "a11y-text-lg") {
    newSize = "a11y-text-lg";
  }
  updateFont(newSize);
});

a11yFontSm.addEventListener("click", () => {
  let currentSize = localStorage.getItem("a11y-font-size");
  let newSize = "";

  if (currentSize === "a11y-text-lg") {
    newSize = "a11y-text-md";
  } else if (currentSize === "a11y-text-md") {
    newSize = "";
  } else if (!currentSize) {
    newSize = "";
  }
  updateFont(newSize);
});

a11yReset.addEventListener("click", () => {
  body.classList.remove(CONTRAST_CLASS);
  FONT_CLASSES.forEach((c) => body.classList.remove(c));
  localStorage.removeItem("a11y-contrast");
  localStorage.removeItem("a11y-font-size");
  a11yMenu.classList.add("hidden");
});

loadSettings();

// --- TERMS MODAL LOGIC (Unchanged) ---
const termsModal = document.getElementById("terms-modal");
const termsTrigger = document.getElementById("terms-trigger");
const closeTermsBtn = document.getElementById("close-terms");
const closeTermsFooterBtn = document.getElementById("close-terms-btn");
const termsBackdrop = document.getElementById("terms-backdrop");
const termsPanel = document.getElementById("terms-panel");

const openModal = () => {
  termsModal.classList.remove("hidden");
  // Small delay for animation
  setTimeout(() => {
    termsBackdrop.classList.remove("opacity-0");
    termsPanel.classList.remove("opacity-0", "scale-95", "translate-y-4");
  }, 10);
};

const closeModal = () => {
  termsBackdrop.classList.add("opacity-0");
  termsPanel.classList.add("opacity-0", "scale-95", "translate-y-4");

  // Wait for animation to finish
  setTimeout(() => {
    termsModal.classList.add("hidden");
  }, 300);
};

termsTrigger.addEventListener("click", (e) => {
  e.preventDefault();
  openModal();
});

closeTermsBtn.addEventListener("click", closeModal);
closeTermsFooterBtn.addEventListener("click", closeModal);

// Click outside to close
termsModal.addEventListener("click", (e) => {
  if (e.target === termsPanel.parentNode) {
    closeModal();
  }
});

// Escape key to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !termsModal.classList.contains("hidden")) {
    closeModal();
  }
});

// --- לוגיקת טופס צור קשר (AJAX ו-Toast) - מעודכן ל-Web3Forms ---
const contactForm = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
const submissionToast = document.getElementById("submission-toast");
const initialSendIconHtml =
  '<span>שלח פנייה</span> <i data-lucide="send" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>';

const showToast = (message, isSuccess = true) => {
  // עדכון תוכן ההודעה והצבע בהתאם להצלחה או שגיאה
  const iconName = isSuccess ? "check-circle" : "alert-triangle";
  const bgColor = isSuccess ? "bg-green-600" : "bg-red-600";

  submissionToast.classList.remove("bg-green-600", "bg-red-600");
  submissionToast.classList.add(bgColor);
  submissionToast.innerHTML = `<i data-lucide="${iconName}" class="w-6 h-6"></i> <span>${message}</span>`;
  lucide.createIcons(); // יצירת האייקון החדש

  // הצגת ההתראה
  submissionToast.classList.remove(
    "opacity-0",
    "translate-y-4",
    "pointer-events-none"
  );

  // הסתרת ההתראה לאחר 4 שניות
  setTimeout(() => {
    submissionToast.classList.add(
      "opacity-0",
      "translate-y-4",
      "pointer-events-none"
    );
  }, 4000);
};

if (contactForm && submitBtn) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formAction = contactForm.getAttribute("data-form-action");
    const formData = new FormData(contactForm);

    // שינוי כפתור למצב טעינה
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i data-lucide="loader" class="w-5 h-5 animate-spin"></i> <span>שולח...</span>`;
    lucide.createIcons();

    try {
      // שליחת הנתונים באמצעות fetch (AJAX) ל-Web3Forms
      const response = await fetch(formAction, {
        method: "POST",
        body: formData,
      });

      const result = await response.json(); // Web3Forms תמיד מחזיר JSON

      if (response.ok && result.success) {
        // הודעת ההצלחה המבוקשת
        showToast("ההודעה נשלחה בהצלחה! ניצור קשר בהקדם.");
        contactForm.reset(); // ניקוי הטופס
      } else {
        // טיפול בשגיאה ספציפית מהשרת
        const errorMessage =
          result.message || "אירעה שגיאה בשליחה. ודא שכל השדות מולאו כהלכה.";
        showToast(errorMessage, false);
      }
    } catch (error) {
      // טיפול בשגיאות רשת (כמו חוסר חיבור)
      console.error("Submission Error:", error);
      showToast("אירעה שגיאת רשת. נסה שוב מאוחר יותר.", false);
    } finally {
      // החזרת הכפתור למצב רגיל
      submitBtn.disabled = false;
      submitBtn.innerHTML = initialSendIconHtml;
      lucide.createIcons();
    }
  });
}
