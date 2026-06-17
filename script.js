let isVietnamese = true;

// Background Music Player (HTML5 Audio)
let bgMusic = null;
let isPlaying = false;
let musicInitialized = false;

function updateTooltip() {
    const musicTooltip = document.querySelector('.music-tooltip');
    if (musicTooltip) {
        if (isPlaying) {
            musicTooltip.textContent = isVietnamese ? 'Tạm dừng nhạc ⏸️' : 'Pause Music ⏸️';
        } else {
            musicTooltip.textContent = isVietnamese ? 'Phát nhạc 🎵' : 'Play Music 🎵';
        }
    }
}

function initMusic() {
    if (musicInitialized) return;
    musicInitialized = true;

    const playlist = [
        'https://archive.org/download/78_2283-Dream-a-little-dream-of-me/2283-Dream-a-little-dream-of-me.mp3'
    ];
    bgMusic = new Audio(playlist[0]);
    bgMusic.loop = true;

    bgMusic.addEventListener('play', () => {
        isPlaying = true;
        if (musicBtn) {
            musicBtn.classList.add('playing', 'active');
            musicBtn.setAttribute('title', isVietnamese ? 'Tạm dừng' : 'Pause');
        }
        updateTooltip();
    });

    bgMusic.addEventListener('pause', () => {
        isPlaying = false;
        if (musicBtn) musicBtn.classList.remove('playing', 'active');
        updateTooltip();
    });
}

const langBtn = document.getElementById('lang-btn');
const elementsToTranslate = document.querySelectorAll('[data-vi]');

langBtn.addEventListener('click', () => {
    isVietnamese = !isVietnamese;
    langBtn.textContent = isVietnamese ? 'EN' : 'VI';

    // Translate standard text content elements
    elementsToTranslate.forEach(el => {
        const viText = el.getAttribute('data-vi');
        const enText = el.getAttribute('data-en');
        if (viText && enText) {
            el.textContent = isVietnamese ? viText : enText;
        }
    });

    // Translate placeholder attributes for input/textarea
    const placeholdersToTranslate = document.querySelectorAll('[data-vi-placeholder]');
    placeholdersToTranslate.forEach(el => {
        const viPlaceholder = el.getAttribute('data-vi-placeholder');
        const enPlaceholder = el.getAttribute('data-en-placeholder');
        if (viPlaceholder && enPlaceholder) {
            el.setAttribute('placeholder', isVietnamese ? viPlaceholder : enPlaceholder);
        }
    });

    // Translate music tooltips
    updateTooltip();

    // Refresh guestbook wishes translation
    loadWishes();
});

// Intersection Observer for scroll-fade elements
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Reveal lower content on first touch/click anywhere on screen
let contentRevealed = false;
const hiddenContent = document.getElementById('hidden-content');
const backToggle = document.querySelector('.back-toggle');

function revealContent(e) {
    // Ignore clicks on buttons, forms, notes, or active interactive nodes
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('form') || e.target.closest('.wish-note') || e.target.closest('.polaroid-stack')) return;

    if (!contentRevealed) {
        document.body.classList.add('content-revealed');
        hiddenContent.style.display = 'block';
        void hiddenContent.offsetWidth; // Trigger a reflow
        hiddenContent.classList.add('show');
        backToggle.classList.add('visible');
        contentRevealed = true;

        // Trigger autoplay on HTML5 Audio when content is revealed (first user gesture)
        playMusic();

        // Trigger celebratory confetti burst on invitation reveal!
        setTimeout(() => {
            triggerConfetti();
        }, 500);

        // Smoothly scroll down to the details section
        setTimeout(() => {
            hiddenContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
    }
}

document.addEventListener('click', revealContent);
document.addEventListener('touchstart', revealContent, { passive: true });

// Back Button navigation folds invitation away
const backBtn = document.getElementById('back-btn');
if (backBtn) {
    backBtn.addEventListener('click', () => {
        document.body.classList.remove('content-revealed');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        hiddenContent.classList.remove('show');
        backToggle.classList.remove('visible');
        setTimeout(() => {
            hiddenContent.style.display = 'none';
            contentRevealed = false;
        }, 800);
    });
}

// Parse Guest Name from URL Query parameters
const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('name');
document.querySelectorAll('.guest-name, #guest-name').forEach(guestNameElement => {
    if (guestName && guestName.trim() !== '') {
        guestNameElement.textContent = guestName;
        guestNameElement.setAttribute('data-vi', guestName);
        guestNameElement.setAttribute('data-en', guestName);
    } else {
        guestNameElement.textContent = isVietnamese ? (guestNameElement.getAttribute('data-vi') || 'cục cưng') : (guestNameElement.getAttribute('data-en') || 'sweetheart');
    }
});

// Pre-fill guest name in the wish form if provided
const wishNameInput = document.getElementById('wish-name');
if (wishNameInput && guestName && guestName.trim() !== '') {
    wishNameInput.value = guestName;
}


// RSVP Modal Google Form Toggle Logic
const rsvpBtn = document.getElementById('rsvp-btn');
const rsvpModal = document.getElementById('rsvp-modal');
const closeBtn = document.querySelector('.close-btn');

if (rsvpBtn && rsvpModal && closeBtn) {
    rsvpBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        rsvpModal.classList.add('show');
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        rsvpModal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === rsvpModal) {
            rsvpModal.classList.remove('show');
        }
    });
}

// Image & Wish Details Lightbox Modal
const lightbox = document.getElementById('image-lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

function openLightbox(imgSrc, captionText, author) {
    if (imgSrc) {
        // Image visualization mode
        lightboxImg.src = imgSrc;
        lightboxImg.style.display = 'block';
        lightboxCaption.textContent = captionText || '';
    } else {
        // Wish post-it detail representation mode
        lightboxImg.style.display = 'none';
        const displayAuthor = author ? author : (isVietnamese ? 'Ẩn danh' : 'Anonymous');
        const authorHtml = `<p class="text-right font-serif italic text-sm mt-4 text-gray-600 border-t border-dashed border-gray-300 pt-2">- ${displayAuthor}</p>`;
        lightboxCaption.innerHTML = `
            <div class="p-8 bg-amber-50 border border-gray-200 shadow-lg text-left text-navy rounded-sm max-w-[320px] mx-auto rotate-1 relative">
                <div class="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-yellow-200/50 shadow-sm"></div>
                <p class="text-base font-semibold leading-relaxed font-sans text-gray-800 mt-2">"${captionText}"</p>
                ${authorHtml}
            </div>
        `;
    }
    lightbox.classList.add('show');
}

if (lightbox && lightboxClose) {
    lightboxClose.addEventListener('click', (e) => {
        e.stopPropagation();
        lightbox.classList.remove('show');
    });
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('show');
        }
    });
}

// Lightbox triggers on map & step items
document.querySelectorAll('.lightbox-trigger').forEach(el => {
    el.addEventListener('click', (e) => {
        e.stopPropagation();
        const imgSrc = el.getAttribute('data-image');
        const caption = el.getAttribute('data-caption') || el.querySelector('.polaroid-caption')?.textContent || '';
        if (imgSrc) {
            openLightbox(imgSrc, caption);
        }
    });
});

// Toast notification trigger
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// Location Details Card Integrations: Copy Address
const copyAddrBtn = document.getElementById('copy-addr-btn');
if (copyAddrBtn) {
    copyAddrBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const address = "Hội trường E4, Trường Đại học Công nghiệp TP.HCM, 12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, TP. Hồ Chí Minh";
        navigator.clipboard.writeText(address).then(() => {
            showToast(isVietnamese ? "Đã sao chép địa chỉ!" : "Address copied!");
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });
}

// Location Details Card Integrations: Calendar Sync (.ics download)
const calSyncBtn = document.getElementById('cal-sync-btn');
if (calSyncBtn) {
    calSyncBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const title = "Le Tot Nghiep - Nguyen Hoang Khoi Nguyen";
        const desc = "Tran trong kinh moi ban tham du le tot nghiep cua Khoi Nguyen tai Hoi truong E4.";
        const location = "Hoi truong E4, Truong Dai hoc Cong nghiep TP.HCM, 12 Nguyen Van Bao, Phuong 4, Go Vap, TP.HCM";

        // Target: Nov 1, 2026 9:00 (Duration: 3 Hours)
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Graduation Invitation//Nguyen Hoang Khoi Nguyen//EN
BEGIN:VEVENT
UID:khoinguyen-grad-2026
DTSTAMP:20260616T000000Z
DTSTART:20261101T090000
DTEND:20261101T120000
SUMMARY:${title}
DESCRIPTION:${desc}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Graduation_Invitation_Khoi_Nguyen.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast(isVietnamese ? "Đã lưu lịch sự kiện!" : "Calendar event saved!");
    });
}

// Background Music Player controls
const musicBtn = document.getElementById('music-btn');
const musicTooltip = document.querySelector('.music-tooltip');

function playMusic() {
    if (bgMusic) {
        bgMusic.play().catch(err => {
            console.log("Audio playback blocked or failed:", err);
        });
    }
}

function pauseMusic() {
    if (bgMusic) {
        bgMusic.pause();
    }
}

if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (bgMusic && !bgMusic.paused) {
            pauseMusic();
        } else {
            playMusic();
        }
    });
}

// Confetti burst trigger on celebrate button
const celebrateBtn = document.getElementById('celebrate-btn');
if (celebrateBtn) {
    celebrateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        triggerConfetti();
    });
}

// Polaroid photo stack swipe shuffle logic
const polaroidStack = document.querySelector('.polaroid-stack');
if (polaroidStack) {
    const cards = Array.from(polaroidStack.querySelectorAll('.polaroid-card-item'));
    let activeIndex = 0;

    polaroidStack.addEventListener('click', (e) => {
        e.stopPropagation();

        // If they click on the zoom trigger, open lightbox instead of shuffling
        const zoomTrigger = e.target.closest('.lightbox-stack-trigger');
        if (zoomTrigger) {
            const imgSrc = zoomTrigger.getAttribute('data-image');
            const caption = zoomTrigger.getAttribute('data-caption') || '';
            openLightbox(imgSrc, caption);
            return;
        }

        const currentCard = cards[activeIndex];
        currentCard.classList.add('shuffle-out');
        currentCard.classList.remove('active');

        setTimeout(() => {
            // Update stack ordering
            cards.forEach((card) => {
                let currentZ = parseInt(card.style.zIndex);
                if (card === currentCard) {
                    card.style.zIndex = 1;
                } else {
                    card.style.zIndex = currentZ + 1;
                }
            });

            // Randomize a rotation angle to keep the craft feel
            const newRot = (Math.random() * 12 - 6).toFixed(1);
            currentCard.style.setProperty('--rot', `${newRot}deg`);
            currentCard.style.transform = `rotate(${newRot}deg)`;

            // Push card back in at the bottom
            currentCard.classList.remove('shuffle-out');

            // Increment index
            activeIndex = (activeIndex + 1) % cards.length;
            cards[activeIndex].classList.add('active');
        }, 500);
    });
}

// Guestbook wishes board (Corkboard notes manager)
const wishForm = document.getElementById('wish-form');
const notesContainer = document.getElementById('corkboard-notes');
let wishes = [];

function loadWishes() {
    if (!notesContainer) return;
    notesContainer.innerHTML = '';

    // Default corkboard post-it notes
    const defaultWishes = [
        {
            name: "Khoi Nguyen",
            text: isVietnamese ? "Toi khong ngại nhận thêm lời chúc ở đây đâu nhá" : "Congrats on your graduation! Wish you all the best on your next journey!",
            color: "yellow",
            rot: -4,
            left: 40,
            top: 30
        },
    ];

    const stored = localStorage.getItem('graduation_wishes');
    if (stored) {
        wishes = JSON.parse(stored);
        // Migrate old defaults to the single new default wish with "Khoi Nguyen" as name
        const isOldThreeDefaults = wishes.length === 3 && wishes.some(w => w.name === "Khoi Nguyen" || w.name === "");
        const isOldSingleDefaultEmptyName = wishes.length === 1 &&
            (wishes[0].name === "" || wishes[0].name === undefined) &&
            (wishes[0].text.includes("Toi khong ngại") || wishes[0].text.includes("Congrats on your graduation"));
        const isOldDefaultPosition = wishes.length === 1 &&
            wishes[0].name === "Khoi Nguyen" &&
            wishes[0].left === 8 &&
            wishes[0].top === 10;

        if (isOldThreeDefaults || isOldSingleDefaultEmptyName || isOldDefaultPosition) {
            wishes = defaultWishes;
            localStorage.setItem('graduation_wishes', JSON.stringify(wishes));
        }
    } else {
        wishes = defaultWishes;
        localStorage.setItem('graduation_wishes', JSON.stringify(wishes));
    }
    wishes.forEach((w, index) => {
        addNoteToBoard(w.name, w.text, w.color, w.rot, w.left, w.top, index);
    });
}

function addNoteToBoard(name, text, color, rot, left, top, index) {
    if (!notesContainer) return;

    const note = document.createElement('div');
    note.className = `wish-note note-${color}`;
    note.style.setProperty('--rot', `${rot}deg`);
    note.style.left = `${left}%`;
    note.style.top = `${top}%`;
    note.style.transform = `rotate(${rot}deg)`;
    note.style.zIndex = Math.floor(Math.random() * 10) + 10;

    const innerWrapper = document.createElement('div');
    innerWrapper.className = 'wish-note-inner pointer-events-none';

    const textEl = document.createElement('p');
    textEl.className = "line-clamp-4 text-gray-800 text-left";
    textEl.textContent = text;
    innerWrapper.appendChild(textEl);

    const authorEl = document.createElement('div');
    authorEl.className = 'wish-note-author text-gray-600';
    authorEl.textContent = name ? `- ${name}` : (isVietnamese ? '- Ẩn danh' : '- Anonymous');
    innerWrapper.appendChild(authorEl);

    note.appendChild(innerWrapper);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-note-btn';
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteBtn.setAttribute('title', isVietnamese ? 'Xóa lời chúc' : 'Delete wish');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(isVietnamese ? 'Bạn có chắc chắn muốn xóa lời chúc này?' : 'Are you sure you want to delete this wish?')) {
            wishes.splice(index, 1);
            localStorage.setItem('graduation_wishes', JSON.stringify(wishes));
            loadWishes();
        }
    });
    note.appendChild(deleteBtn);


    note.addEventListener('click', (e) => {
        e.stopPropagation();
        if (note.getAttribute('data-dragged') === 'true') {
            note.removeAttribute('data-dragged');
            return;
        }
        openLightbox(null, text, name);
    });

    makeElementDraggable(note, index);

    notesContainer.appendChild(note);
}

function makeElementDraggable(el, index) {
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;
    let isDragging = false;
    let dragDistance = 0;

    el.addEventListener('mousedown', dragMouseDown);
    el.addEventListener('touchstart', dragTouchStart, { passive: false });

    function dragMouseDown(e) {
        if (e.target.closest('button') || e.target.closest('a')) return;
        e.preventDefault();

        startX = e.clientX;
        startY = e.clientY;

        startLeft = parseFloat(el.style.left) || 0;
        startTop = parseFloat(el.style.top) || 0;

        dragDistance = 0;
        isDragging = false;

        document.addEventListener('mouseup', closeDragElement);
        document.addEventListener('mousemove', elementDrag);

        startDrag();
    }

    function dragTouchStart(e) {
        if (e.target.closest('button') || e.target.closest('a')) return;

        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;

        startLeft = parseFloat(el.style.left) || 0;
        startTop = parseFloat(el.style.top) || 0;

        dragDistance = 0;
        isDragging = false;

        document.addEventListener('touchend', closeDragElement);
        document.addEventListener('touchmove', elementTouchDrag, { passive: false });

        startDrag();
    }

    function startDrag() {
        el.style.transition = 'none';
        el.style.zIndex = '1000';
    }

    function elementDrag(e) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        dragDistance = Math.abs(deltaX) + Math.abs(deltaY);
        if (dragDistance > 5) {
            isDragging = true;
        }

        if (isDragging) {
            e.preventDefault();
            updatePosition(deltaX, deltaY);
        }
    }

    function elementTouchDrag(e) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        dragDistance = Math.abs(deltaX) + Math.abs(deltaY);
        if (dragDistance > 5) {
            isDragging = true;
        }

        if (isDragging) {
            e.preventDefault();
            updatePosition(deltaX, deltaY);
        }
    }

    function updatePosition(deltaX, deltaY) {
        const corkRect = notesContainer.getBoundingClientRect();

        // Convert client pixel delta to percentage of corkboard
        const deltaLeftPct = (deltaX / corkRect.width) * 100;
        const deltaTopPct = (deltaY / corkRect.height) * 100;

        let leftPct = startLeft + deltaLeftPct;
        let topPct = startTop + deltaTopPct;

        // Use unrotated layout dimensions (offsetWidth/offsetHeight) to allow placing notes right near the edges
        const noteWidthPct = (el.offsetWidth / corkRect.width) * 100;
        const noteHeightPct = (el.offsetHeight / corkRect.height) * 100;

        leftPct = Math.max(0.5, Math.min(100 - noteWidthPct - 0.5, leftPct));
        topPct = Math.max(0.5, Math.min(100 - noteHeightPct - 0.5, topPct));

        el.style.left = `${leftPct.toFixed(2)}%`;
        el.style.top = `${topPct.toFixed(2)}%`;

        // Dynamic sway/tilt physics as we drag
        const sway = Math.max(-16, Math.min(16, deltaX * 0.1));
        el.style.transform = `rotate(${sway}deg)`;
    }

    function closeDragElement() {
        document.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('mousemove', elementDrag);
        document.removeEventListener('touchend', closeDragElement);
        document.removeEventListener('touchmove', elementTouchDrag);

        el.style.transition = '';
        el.style.zIndex = Math.floor(Math.random() * 10) + 10;

        if (isDragging) {
            el.setAttribute('data-dragged', 'true');
            if (wishes[index]) {
                const finalLeft = parseFloat(el.style.left);
                const finalTop = parseFloat(el.style.top);
                const finalRot = Math.floor(Math.random() * 12 - 6);

                el.style.transform = `rotate(${finalRot}deg)`;
                el.style.setProperty('--rot', `${finalRot}deg`);

                wishes[index].left = finalLeft;
                wishes[index].top = finalTop;
                wishes[index].rot = finalRot;
                localStorage.setItem('graduation_wishes', JSON.stringify(wishes));
            }
        } else {
            // Restore original rotation on simple tap
            const origRot = el.style.getPropertyValue('--rot') || '0deg';
            el.style.transform = `rotate(${origRot})`;
        }
    }
}

// Guestbook modal and submission controls
const wishModal = document.getElementById('wish-modal');
const closeWishBtn = document.getElementById('close-wish-btn');
const corkboard = document.querySelector('.corkboard');

if (corkboard && wishModal) {
    corkboard.addEventListener('click', (e) => {
        // Ignore clicks on buttons (like the delete note button) or note elements
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.wish-note')) return;

        // Open wish modal
        wishModal.classList.add('show');
    });
}

if (wishModal && closeWishBtn) {
    closeWishBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        wishModal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === wishModal) {
            wishModal.classList.remove('show');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            wishModal.classList.remove('show');
        }
    });
}

if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const textVal = document.getElementById('wish-text').value.trim();
        const nameVal = document.getElementById('wish-name')?.value.trim() || '';
        const colorVal = document.querySelector('input[name="note-color"]:checked')?.value || 'yellow';

        if (textVal === '') return;

        // Generate random rotation and coordinates to simulate physical pinning on the full-width board
        const rot = Math.floor(Math.random() * 16 - 8);

        // Dynamically compute boundaries to let notes go right next to the edges without overflowing
        let left = Math.floor(Math.random() * 80 + 5);
        let top = Math.floor(Math.random() * 65 + 5);
        if (notesContainer) {
            const corkRect = notesContainer.getBoundingClientRect();
            if (corkRect.width > 0 && corkRect.height > 0) {
                const isMobile = window.innerWidth <= 768;
                const noteWidth = isMobile ? 100 : 120;
                const noteHeight = isMobile ? 110 : 130;

                const noteWidthPct = (noteWidth / corkRect.width) * 100;
                const noteHeightPct = (noteHeight / corkRect.height) * 100;

                const minLeft = 1;
                const maxLeft = 100 - noteWidthPct - 1;
                const minTop = 1;
                const maxTop = 100 - noteHeightPct - 1;

                if (maxLeft > minLeft) {
                    left = parseFloat((Math.random() * (maxLeft - minLeft) + minLeft).toFixed(2));
                }
                if (maxTop > minTop) {
                    top = parseFloat((Math.random() * (maxTop - minTop) + minTop).toFixed(2));
                }
            }
        }

        const newWish = {
            name: nameVal,
            text: textVal,
            color: colorVal,
            rot: rot,
            left: left,
            top: top
        };

        wishes.push(newWish);
        localStorage.setItem('graduation_wishes', JSON.stringify(wishes));

        const newIndex = wishes.length - 1;
        addNoteToBoard(nameVal, textVal, colorVal, rot, left, top, newIndex);

        // Clear input fields
        document.getElementById('wish-text').value = '';
        if (!guestName) {
            const nameInput = document.getElementById('wish-name');
            if (nameInput) nameInput.value = '';
        }

        // Hide wish modal
        if (wishModal) {
            wishModal.classList.remove('show');
        }

        triggerConfetti();
        showToast(isVietnamese ? "Đã ghim lời chúc của bạn!" : "Your wish has been pinned!");
    });
}

// Countdown Timer logic targeting November 1st, 2026
function initCountdown() {
    const targetDate = new Date("Nov 1, 2026 18:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = targetDate - now;

        const daysEl = document.getElementById("cd-days");
        const hoursEl = document.getElementById("cd-hours");
        const secondsEl = document.getElementById("cd-seconds");

        if (diff < 0) {
            if (daysEl) daysEl.innerText = "00";
            if (hoursEl) hoursEl.innerText = "00";
            if (secondsEl) secondsEl.innerText = "00";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (daysEl) daysEl.innerText = days < 10 ? "0" + days : days;
        if (hoursEl) hoursEl.innerText = hours < 10 ? "0" + hours : hours;
        if (secondsEl) secondsEl.innerText = seconds < 10 ? "0" + seconds : seconds;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Load wishes on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    loadWishes();
    initMusic();
    initCountdown();
});
// Trigger loading wishes/music in case DOMContentLoaded has already fired
loadWishes();
initMusic();
initCountdown();

// Confetti burst logic using canvas-confetti
function triggerConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#d97706', '#fBBF24', '#ffffff']
        });
    }
}
