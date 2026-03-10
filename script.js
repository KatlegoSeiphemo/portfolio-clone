// ===== GLOBAL FUNCTIONS (called from HTML onclick) =====

function switchTab(tabElement, sectionId) {
    // Update mobile nav active state
    document.querySelectorAll('.mobile-nav-item').forEach(item => item.classList.remove('active'));
    const mobileIndex = ['posts','skills','projects','certifications'].indexOf(sectionId);
    if (mobileIndex >= 0) document.querySelectorAll('.mobile-nav-item')[mobileIndex].classList.add('active');
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    tabElement.classList.add('active');
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if (sectionId === 'posts') document.querySelector('.nav-item').classList.add('active');
}

function showTab(sectionId) {
    const tabs = document.querySelectorAll('.tab');
    if (sectionId === 'posts') switchTab(tabs[0], 'posts');
    else if (sectionId === 'cv') { alert('CV Download would start here'); return; }
}

function openAboutModal() {
    document.getElementById("aboutModal").classList.add("active");
}

function closeAboutModal() {
    document.getElementById("aboutModal").classList.remove("active");
}

function openContactModal() {
    document.getElementById('contactModal').classList.add('active');
}

function closeContactModal() {
    document.getElementById('contactModal').classList.remove('active');
}

function sendContactEmail() {
    const name = document.getElementById('contactName').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !subject || !message) {
        alert('Please fill in all fields.');
        return;
    }

    const sendBtn = document.querySelector('.modal-send');
    sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    sendBtn.disabled = true;

    const templateParams = {
        name: name,
        from_name: name,
        subject: subject,
        message: message,
        time: new Date().toLocaleString()
    };

    emailjs.send('service_l1wnisx', 'template_o1j0sqk', templateParams)
        .then(function(response) {
            sendBtn.innerHTML = '✅ Message Sent!';
            setTimeout(() => {
                closeContactModal();
                document.getElementById('contactName').value = '';
                document.getElementById('contactSubject').value = '';
                document.getElementById('contactMessage').value = '';
                sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
                sendBtn.disabled = false;
            }, 1500);
        }, function(error) {
            alert('Failed: ' + JSON.stringify(error));
            sendBtn.innerHTML = '❌ Failed. Try again.';
            sendBtn.disabled = false;
        });
}

// ===== DOM EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {

    // Close modals when clicking outside
    document.getElementById('aboutModal').addEventListener('click', function(e) {
        if (e.target === this) closeAboutModal();
    });

    // Close contact modal when clicking outside
    document.getElementById('contactModal').addEventListener('click', function(e) {
        if (e.target === this) closeContactModal();
    });

    // Post like interactions
    document.querySelectorAll('.post-action').forEach(action => {
        action.addEventListener('click', function(e) {
            e.stopPropagation();
            if (this.classList.contains('like')) {
                const icon = this.querySelector('i');
                const count = this.querySelector('span');
                if (icon.classList.contains('fa-regular')) {
                    icon.classList.replace('fa-regular', 'fa-solid');
                    icon.style.color = '#f91880';
                    if (count) { count.textContent = parseInt(count.textContent) + 1; count.style.color = '#f91880'; }
                } else {
                    icon.classList.replace('fa-solid', 'fa-regular');
                    icon.style.color = '';
                    if (count) { count.textContent = parseInt(count.textContent) - 1; count.style.color = ''; }
                }
            }
        });
    });

    // Follow/Hire button toggle
    document.querySelector('.follow-btn').addEventListener('click', function() {
        if (this.textContent.trim() === 'Follow Me') {
            this.textContent = 'Pending';
            this.style.background = 'transparent';
            this.style.color = 'white';
            this.style.border = '1px solid var(--border-color)';
        } else {
            this.textContent = 'Follow Me';
            this.style.background = 'white';
            this.style.color = 'black';
            this.style.border = 'none';
        }
    });

    // Search
    document.querySelector('.search-input').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        if (searchTerm.length > 0) console.log('Searching for:', searchTerm);
    });

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.post').forEach(post => {
        post.style.opacity = '0';
        post.style.transform = 'translateY(20px)';
        post.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(post);
    });

    setTimeout(() => {
        document.querySelectorAll('.post').forEach((post, index) => {
            setTimeout(() => {
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);

});

// ===== DARK / LIGHT MODE =====
function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('themeIcon');
    const isLight = body.classList.toggle('light-mode');

    if (isLight) {
        icon.className = 'fa-solid fa-sun';
        localStorage.setItem('theme', 'light');
    } else {
        icon.className = 'fa-solid fa-moon';
        localStorage.setItem('theme', 'dark');
    }
}

// Apply saved theme on load
document.addEventListener('DOMContentLoaded', function() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        document.body.classList.add('light-mode');
        const icon = document.getElementById('themeIcon');
        if (icon) icon.className = 'fa-solid fa-sun';
    }
});

// ===== VISITOR COUNTER =====
// Uses countapi.xyz — free, no signup needed
async function loadVisitorCount() {
    try {
        // Increment count on each visit
        const res = await fetch('https://api.countapi.xyz/hit/katlego-portfolio/visits');
        const data = await res.json();
        const el = document.getElementById('visitorCount');
        if (el && data.value) {
            // Animate the number counting up
            let start = 0;
            const end = data.value;
            const duration = 1000;
            const step = Math.ceil(end / (duration / 16));
            const timer = setInterval(() => {
                start += step;
                if (start >= end) {
                    start = end;
                    clearInterval(timer);
                }
                el.textContent = start.toLocaleString();
            }, 16);
        }
    } catch (e) {
        const el = document.getElementById('visitorCount');
        if (el) el.textContent = '—';
    }
}

loadVisitorCount();
