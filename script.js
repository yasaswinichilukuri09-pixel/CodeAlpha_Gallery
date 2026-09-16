// =========================================================
// IMAGE GALLERY - JAVASCRIPT
// Handles: category filtering + lightbox (modal) navigation
// =========================================================

// ---- Grab all the elements we need from the page ----
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const closeBtn = document.getElementById('lightboxClose');
const prevBtn = document.getElementById('lightboxPrev');
const nextBtn = document.getElementById('lightboxNext');

// Index of the image currently open in the lightbox (within the VISIBLE items)
let currentIndex = 0;

// This array always holds the gallery items that are currently visible
// (i.e. match the active filter). The lightbox navigates through THIS list.
let visibleItems = Array.from(galleryItems);


// =========================================================
// 1. CATEGORY FILTERING
// =========================================================

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedCategory = button.getAttribute('data-filter');

    // Update which button looks "active"
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    // Show/hide gallery items based on the selected category
    galleryItems.forEach((item) => {
      const itemCategory = item.getAttribute('data-category');
      const matches = selectedCategory === 'all' || itemCategory === selectedCategory;

      if (matches) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });

    // Recalculate which items are visible now, so the lightbox
    // Next/Previous buttons only cycle through the filtered set.
    visibleItems = Array.from(galleryItems).filter((item) => !item.classList.contains('hidden'));
  });
});


// =========================================================
// 2. LIGHTBOX - OPEN / DISPLAY
// =========================================================

// Attach a click listener to every gallery image so it opens the lightbox
galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    // Find this item's position within the currently visible items
    const indexInVisible = visibleItems.indexOf(item);
    if (indexInVisible !== -1) {
      openLightbox(indexInVisible);
    }
  });

  // Allow opening with keyboard (Enter key) for accessibility
  item.setAttribute('tabindex', '0');
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const indexInVisible = visibleItems.indexOf(item);
      if (indexInVisible !== -1) openLightbox(indexInVisible);
    }
  });
});

function openLightbox(index) {
  currentIndex = index;
  updateLightboxContent();

  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // prevent background scrolling
  closeBtn.focus(); // move focus into the modal for accessibility
}

// Fill the lightbox with the image + title for the current index
function updateLightboxContent() {
  const item = visibleItems[currentIndex];
  const img = item.querySelector('img');
  const title = item.querySelector('.item-title').textContent;

  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt;
  lightboxTitle.textContent = title;
}


// =========================================================
// 3. LIGHTBOX - CLOSE
// =========================================================

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = ''; // restore scrolling
}

closeBtn.addEventListener('click', closeLightbox);

// Close when clicking the dark background (but not the image/content itself)
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});


// =========================================================
// 4. LIGHTBOX - NEXT / PREVIOUS (with looping)
// =========================================================

function showNext() {
  // The "%" (modulo) makes the index loop back to 0 after the last image
  currentIndex = (currentIndex + 1) % visibleItems.length;
  updateLightboxContent();
}

function showPrev() {
  // Adding visibleItems.length before "%" avoids negative index issues
  currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
  updateLightboxContent();
}

nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrev);


// =========================================================
// 5. KEYBOARD NAVIGATION
// =========================================================

document.addEventListener('keydown', (e) => {
  // Only respond to keys when the lightbox is actually open
  if (!lightbox.classList.contains('open')) return;

  if (e.key === 'Escape') {
    closeLightbox();
  } else if (e.key === 'ArrowRight') {
    showNext();
  } else if (e.key === 'ArrowLeft') {
    showPrev();
  }
});
