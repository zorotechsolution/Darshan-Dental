// ================= DARSHAN DENTAL — SITE SCRIPT =================

document.addEventListener("DOMContentLoaded", function () {

  // Highlight active nav link based on current page
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar-darshan .nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href === path) link.classList.add("active");
  });

  // Back to top button
  const backBtn = document.getElementById("backToTop");
  if (backBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) backBtn.classList.add("show");
      else backBtn.classList.remove("show");
    });
    backBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // Smile Gallery filter
  const filterBtns = document.querySelectorAll("[data-filter]");
  const galleryItems = document.querySelectorAll("[data-category]");
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const val = btn.getAttribute("data-filter");
        galleryItems.forEach(item => {
          const show = val === "all" || item.getAttribute("data-category") === val;
          item.style.display = show ? "" : "none";
        });
      });
    });
  }

  // Appointment form handling via FormSubmit (AJAX)
  const apptForm = document.getElementById("appointmentForm");
  if (apptForm) {
    apptForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      
      const submitBtn = apptForm.querySelector('button[type="submit"]');
      const successBox = document.getElementById("formSuccess");
      const errorBox = document.getElementById("formError");
      
      // Hide any previous alert boxes
      if (successBox) successBox.classList.add("d-none");
      if (errorBox) errorBox.classList.add("d-none");
      
      // Keep track of the original button content
      const originalBtnText = submitBtn.innerHTML;
      
      // Disable button and show loading text
      submitBtn.disabled = true;
      submitBtn.innerHTML = "Submitting...";

      try {
        const formData = new FormData(apptForm);
        const data = {};
        formData.forEach((value, key) => {
          data[key] = value;
        });

        const response = await fetch("https://formsubmit.co/ajax/info@darshandental.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success === "true" || result.success === true) {
            // Show success message
            if (successBox) {
              successBox.classList.remove("d-none");
              successBox.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            apptForm.reset();
          } else {
            throw new Error("FormSubmit reported failure: " + JSON.stringify(result));
          }
        } else {
          throw new Error("HTTP error " + response.status);
        }
      } catch (err) {
        console.error("Submission failed:", err);
        // Show error message
        if (errorBox) {
          errorBox.classList.remove("d-none");
          errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } finally {
        // Re-enable button and restore text
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  // ── Counter animation ────────────────────────────────────────────
  const counters = document.querySelectorAll(".counter");
  const runCounter = (el) => {
    const target = +el.getAttribute("data-target");
    let count = 0;
    const step = Math.max(target / 60, 1);
    const update = () => {
      count += step;
      if (count < target) {
        el.textContent = Math.ceil(count);
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };
    update();
  };
  if (counters.length) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          cObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cObs.observe(c));
  }

  // ── Scroll-Reveal ────────────────────────────────────────────────
  function makeRevealObserver() {
    return new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          this.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  }

  // Observe elements already marked .reveal in HTML (MVV cards)
  const staticReveals = document.querySelectorAll(".reveal");
  const staticObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        staticObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  staticReveals.forEach(el => staticObs.observe(el));

  // Auto-tag and stagger hero feature cards
  document.querySelectorAll(".hero-feat-card").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.setProperty("--delay", `${i * 0.08}s`);
  });

  // Auto-tag service icon cards
  document.querySelectorAll(".icon-card").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.setProperty("--delay", `${i * 0.1}s`);
  });

  // Auto-tag testimonial cards
  document.querySelectorAll(".testi-card").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.setProperty("--delay", `${i * 0.1}s`);
  });

  // Auto-tag stats with scale-in
  document.querySelectorAll(".stats-band .stat").forEach((el, i) => {
    el.classList.add("reveal", "scale-in");
    el.style.setProperty("--delay", `${i * 0.08}s`);
  });

  // Founder section — slide from sides
  document.querySelectorAll(".founder-section .col-lg-4").forEach(el => {
    el.classList.add("reveal", "from-left");
  });
  document.querySelectorAll(".founder-section .col-lg-8").forEach(el => {
    el.classList.add("reveal", "from-right");
  });

  // Why Choose Us — slide from sides
  const whyCols = document.querySelectorAll(".section.bg-tint .col-lg-6");
  whyCols.forEach((el, i) => {
    el.classList.add("reveal", i === 0 ? "from-left" : "from-right");
  });

  // Special features — slide from sides
  const sfCols = document.querySelectorAll(".special-features-section .col-lg-6");
  sfCols.forEach((el, i) => {
    el.classList.add("reveal", i === 0 ? "from-left" : "from-right");
  });

  // Special feat list items stagger
  document.querySelectorAll(".special-feat-list li").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.setProperty("--delay", `${i * 0.1}s`);
  });

  // Section headings fade-up
  document.querySelectorAll(".section h2, .section-sm h2, .mvv-section h2").forEach(el => {
    if (!el.closest(".reveal")) el.classList.add("reveal");
  });

  // Now observe ALL dynamically tagged elements
  const dynamicObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        dynamicObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: "0px 0px -30px 0px" });

  document.querySelectorAll(".reveal:not(.is-visible)").forEach(el => dynamicObs.observe(el));

  // ── Navbar scroll shadow ─────────────────────────────────────────
  const navbar = document.querySelector(".navbar-darshan");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.style.boxShadow = window.scrollY > 10
        ? "0 4px 24px rgba(17,24,39,.12)"
        : "0 2px 18px rgba(17,24,39,.06)";
    });
  }

  // ── Advanced Technology card autoplay hover ─────────────────────
  const heroFeatCards = document.querySelectorAll(".hero-feat-card");
  const techCard = Array.from(heroFeatCards).find(card => {
    const h6 = card.querySelector("h6");
    return h6 && h6.textContent.trim() === "Advanced Technology";
  }) || heroFeatCards[0];

  if (techCard) {
    let autoplayInterval = null;

    const toggleHover = () => {
      techCard.classList.toggle("active-hover");
    };

    const startAutoplay = () => {
      if (!autoplayInterval) {
        autoplayInterval = setInterval(toggleHover, 2000);
      }
    };

    const stopAutoplay = () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
      techCard.classList.remove("active-hover");
    };

    // Start cycling on load
    startAutoplay();

    // Pause on user cursor entry, resume on leave
    techCard.addEventListener("mouseenter", stopAutoplay);
    techCard.addEventListener("mouseleave", startAutoplay);
  }

  // ── 3D Interactive Parallax Tilt Effect ───────────────────────────
  const tiltCards = document.querySelectorAll(".hero-feat-card, .ba-card, .icon-card, .interest-card, .treatment-card, .blog-card");
  
  tiltCards.forEach(card => {
    let frameId = null;

    card.addEventListener("mousemove", (e) => {
      if (frameId) cancelAnimationFrame(frameId);

      frameId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        
        // Max tilt rotation degree (e.g. 10 degrees)
        const tiltX = (yc - y) / yc * 10;
        const tiltY = (x - xc) / xc * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        
        // Dynamic shadow offset for realistic light reflection
        const shadowX = -tiltY * 1.5;
        const shadowY = tiltX * 1.5;
        card.style.boxShadow = `${shadowX}px ${shadowY}px 30px rgba(17,24,39,0.15)`;
      });
    });

    card.addEventListener("mouseleave", () => {
      if (frameId) cancelAnimationFrame(frameId);
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      card.style.boxShadow = "";
    });
  });

  // ── Auto-trigger Hero animations immediately on load ─────────────
  document.querySelectorAll(".hero-new .reveal").forEach(el => {
    setTimeout(() => {
      el.classList.add("is-visible");
    }, 150);
  });

  // ── Technology Tabs Carousel/Autoplay ────────────────────────────
  const techTabs = document.querySelectorAll("#techTab .nav-link");
  const techTabContent = document.querySelector(".tech-tab-content");
  
  if (techTabs.length && techTabContent) {
    let activeIdx = 0;
    let autoplayInterval = null;

    const showTab = (index) => {
      activeIdx = index;
      const tabTrigger = new bootstrap.Tab(techTabs[activeIdx]);
      tabTrigger.show();
    };

    const showNext = () => {
      let nextIdx = (activeIdx + 1) % techTabs.length;
      showTab(nextIdx);
    };

    const showPrev = () => {
      let prevIdx = (activeIdx - 1 + techTabs.length) % techTabs.length;
      showTab(prevIdx);
    };

    const startAutoplay = () => {
      if (!autoplayInterval) {
        autoplayInterval = setInterval(showNext, 4000); // Cycle every 4 seconds
      }
    };

    const stopAutoplay = () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    };

    // Start autoplay initially
    startAutoplay();

    // Pause autoplay on mouse enter, resume on leave
    techTabContent.addEventListener("mouseenter", stopAutoplay);
    techTabContent.addEventListener("mouseleave", startAutoplay);

    // Track manual tab clicks to sync active index and pause/resume
    techTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        activeIdx = index;
        stopAutoplay();
      });
      
      tab.addEventListener("mouseenter", stopAutoplay);
      tab.addEventListener("mouseleave", startAutoplay);
    });

    // Wire up Next and Prev buttons
    const prevBtn = document.getElementById("techPrevBtn");
    const nextBtn = document.getElementById("techNextBtn");

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showPrev();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showNext();
      });
    }
  }

  // Founder Biography show/hide toggle
  const toggleBtn = document.getElementById("toggleBioBtn");
  const bioExpanded = document.getElementById("founderBioExpanded");
  if (toggleBtn && bioExpanded) {
    toggleBtn.addEventListener("click", function() {
      const isCollapsed = !bioExpanded.classList.contains("show");
      if (isCollapsed) {
        bioExpanded.classList.add("show");
        toggleBtn.querySelector(".btn-text").textContent = "Show Less";
        toggleBtn.querySelector(".toggle-icon").style.transform = "rotate(180deg)";
      } else {
        bioExpanded.classList.remove("show");
        toggleBtn.querySelector(".btn-text").textContent = "Read Full Biography";
        toggleBtn.querySelector(".toggle-icon").style.transform = "rotate(0deg)";
        // Scroll back to founder section top smoothly if collapsed
        document.querySelector(".founder-section").scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Hero Doctors list selection toggle
  const docItems = document.querySelectorAll(".doc-list .doc-item");
  docItems.forEach(item => {
    item.addEventListener("click", () => {
      docItems.forEach(i => i.classList.remove("selected"));
      item.classList.add("selected");
    });
  });

});
