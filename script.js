let isVietnamese = true;

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
    const musicTooltip = document.querySelector('.music-tooltip');
    const bgMusic = document.getElementById('bg-music');
    if (musicTooltip && bgMusic) {
        if (bgMusic.paused) {
            musicTooltip.textContent = isVietnamese ? 'Bật nhạc 🎵' : 'Play Music 🎵';
        } else {
            musicTooltip.textContent = isVietnamese ? 'Tạm dừng nhạc ⏸️' : 'Pause Music ⏸️';
        }
    }

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

// Pre-fill Name input in Guestbook if URL query contains name
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
        lightboxCaption.innerHTML = `
            <div class="p-8 bg-amber-50 border border-gray-200 shadow-lg text-left text-navy rounded-sm max-w-[320px] mx-auto rotate-1 relative">
                <div class="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-yellow-200/50 shadow-sm"></div>
                <p class="text-base font-semibold leading-relaxed font-sans text-gray-800 mt-2">"${captionText}"</p>
                <p class="text-right font-serif italic text-sm mt-4 text-gray-600 border-t border-dashed border-gray-300 pt-2">- ${author}</p>
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
        const location = "Hoi truong E4, Truong Dai hoc Cong nghiep TP.HCM, 12 Nguyen Van Bao, Phuong 4, Go Vấp, TP.HCM";

        // Target: Nov 9, 2026 18:00 (Duration: 4 Hours)
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Graduation Invitation//Nguyen Hoang Khoi Nguyen//EN
BEGIN:VEVENT
UID:khoinguyen-grad-2026
DTSTAMP:20260616T000000Z
DTSTART:20261109T180000
DTEND:20261109T220000
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

// Background Music cassette player control
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
const musicTooltip = document.querySelector('.music-tooltip');

if (musicBtn && bgMusic) {
    bgMusic.volume = 0.45;

    musicBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (bgMusic.paused) {
            musicBtn.classList.remove('manually-paused');
            bgMusic.play().then(() => {
                musicBtn.classList.add('playing');
                musicBtn.setAttribute('title', isVietnamese ? 'Tạm dừng nhạc' : 'Pause Music');
                if (musicTooltip) {
                    musicTooltip.textContent = isVietnamese ? 'Tạm dừng nhạc ⏸️' : 'Pause Music ⏸️';
                }
            }).catch(err => {
                console.error("Audio play failed: ", err);
            });
        } else {
            bgMusic.pause();
            musicBtn.classList.add('manually-paused');
            musicBtn.classList.remove('playing');
            musicBtn.setAttribute('title', isVietnamese ? 'Bật nhạc' : 'Play Music');
            if (musicTooltip) {
                musicTooltip.textContent = isVietnamese ? 'Bật nhạc 🎵' : 'Play Music 🎵';
            }
        }
    });

    // Autoplay on first click anywhere on body (if user hasn't explicitly muted it)
    document.addEventListener('click', () => {
        if (bgMusic.paused && !musicBtn.classList.contains('manually-paused')) {
            bgMusic.play().then(() => {
                musicBtn.classList.add('playing');
                if (musicTooltip) {
                    musicTooltip.textContent = isVietnamese ? 'Tạm dừng nhạc ⏸️' : 'Pause Music ⏸️';
                }
            }).catch(() => {
                // Ignore initial play blocks by modern browsers
            });
        }
    }, { once: true });
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
            name: "Quang Huy",
            text: isVietnamese ? "Chúc mừng bạn tốt nghiệp nhé! Chúc Nguyên luôn gặt hái được nhiều thành công trên con đường sắp tới!" : "Congrats on your graduation! Wish you all the best on your next journey!",
            color: "yellow",
            rot: -4,
            left: 8,
            top: 10
        },
        {
            name: "Song Thao",
            text: isVietnamese ? "Chúc mừng Khôi Nguyên ra trường xuất sắc nha. Hôm đó nhất định mình sẽ tới check-in chung vui!" : "Happy graduation, Khôi Nguyên! I will definitely be there to celebrate with you!",
            color: "green",
            rot: 5,
            left: 55,
            top: 15
        },
        {
            name: "Minh Ngọc",
            text: isVietnamese ? "Chúc Nguyên bay cao bay xa với những hoài bão của mình nhé. Mãi tự hào về bạn hữu!" : "May all your dreams fly high and come true! So proud of you, buddy!",
            color: "pink",
            rot: -3,
            left: 32,
            top: 50
        }
    ];

    const stored = localStorage.getItem('graduation_wishes');
    if (stored) {
        wishes = JSON.parse(stored);
    } else {
        wishes = defaultWishes;
        localStorage.setItem('graduation_wishes', JSON.stringify(wishes));
    }
    wishes.forEach(w => {
        addNoteToBoard(w.name, w.text, w.color, w.rot, w.left, w.top);
    });
}

function addNoteToBoard(name, text, color, rot, left, top) {
    if (!notesContainer) return;

    const note = document.createElement('div');
    note.className = `wish-note note-${color} cursor-zoom-in`;
    note.style.setProperty('--rot', `${rot}deg`);
    note.style.left = `${left}%`;
    note.style.top = `${top}%`;
    note.style.transform = `rotate(${rot}deg)`;
    note.style.zIndex = Math.floor(Math.random() * 10) + 10;

    const textEl = document.createElement('p');
    textEl.className = "line-clamp-4 pointer-events-none text-gray-800 text-left";
    textEl.textContent = text;

    const authorEl = document.createElement('div');
    authorEl.className = 'wish-note-author pointer-events-none text-gray-600';
    authorEl.textContent = `- ${name}`;

    note.appendChild(textEl);
    note.appendChild(authorEl);

    note.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(null, text, name);
    });

    notesContainer.appendChild(note);
}

if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const nameVal = document.getElementById('wish-name').value.trim();
        const textVal = document.getElementById('wish-text').value.trim();
        const colorVal = document.querySelector('input[name="note-color"]:checked')?.value || 'yellow';

        if (nameVal === '' || textVal === '') return;

        // Generate random rotation and coordinates to simulate physical pinning
        const rot = Math.floor(Math.random() * 16 - 8);
        const left = Math.floor(Math.random() * 60 + 5);
        const top = Math.floor(Math.random() * 55 + 5);

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

        addNoteToBoard(nameVal, textVal, colorVal, rot, left, top);

        // Clear text field (keep name input if pre-filled via URL)
        document.getElementById('wish-text').value = '';
        if (!guestName) {
            document.getElementById('wish-name').value = '';
        }

        triggerConfetti();
        showToast(isVietnamese ? "Đã ghim lời chúc của bạn!" : "Your wish has been pinned!");
    });
}

// Load wishes on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    loadWishes();
});
// Trigger loading wishes in case DOMContentLoaded has already fired
loadWishes();
