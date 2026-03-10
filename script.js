// Tab Switching
function switchTab(tabElement, sectionId) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Add active class to clicked tab
    tabElement.classList.add('active');

    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    if (sectionId === 'posts') {
        document.querySelector('.nav-item').classList.add('active');
    }
}

// Navigation handling
function showTab(sectionId) {
    const tabs = document.querySelectorAll('.tab');
    let targetTab;

    switch (sectionId) {
        case 'posts':
            targetTab = tabs[0];
            break;
        case 'cv':
            alert('CV Download would start here');
            return;
    }

    if (targetTab) {
        switchTab(targetTab, sectionId);
    }
}

// Post interactions
document.querySelectorAll('.post-action').forEach(action => {
    action.addEventListener('click', function (e) {
        e.stopPropagation();

        if (this.classList.contains('like')) {
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-regular')) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                icon.style.color = '#f91880';
                const count = this.querySelector('span');
                if (count) {
                    count.textContent = parseInt(count.textContent) + 1;
                    count.style.color = '#f91880';
                }
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
                icon.style.color = '';
                const count = this.querySelector('span');
                if (count) {
                    count.textContent = parseInt(count.textContent) - 1;
                    count.style.color = '';
                }
            }
        }
    });
});

// Follow/Hire button toggle
document.querySelector('.follow-btn').addEventListener('click', function () {
    if (this.textContent === 'Hire Me') {
        this.textContent = 'Pending';
        this.style.background = 'transparent';
        this.style.color = 'white';
        this.style.border = '1px solid var(--border-color)';
    } else {
        this.textContent = 'Hire Me';
        this.style.background = 'white';
        this.style.color = 'black';
        this.style.border = 'none';
    }
});

// Search functionality
document.querySelector('.search-input').addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm.length > 0) {
        console.log('Searching for:', searchTerm);
    }
});

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
    });
});

// Add hover effects to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function () {
        console.log('Project clicked');
    });
});

// Animate posts on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.post').forEach(post => {
    post.style.opacity = '0';
    post.style.transform = 'translateY(20px)';
    post.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(post);
});

// Initial animation trigger
setTimeout(() => {
    document.querySelectorAll('.post').forEach((post, index) => {
        setTimeout(() => {
            post.style.opacity = '1';
            post.style.transform = 'translateY(0)';
        }, index * 100);
    });
}, 100);

// Contact Modal
function openContactModal() {
    document.getElementById('contactModal').classList.add('active');
}

function closeContactModal() {
    document.getElementById('contactModal').classList.remove('active');
}

// Close modal when clicking outside
document.getElementById('contactModal').addEventListener('click', function(e) {
    if (e.target === this) closeContactModal();
});

// Send email via EmailJS
function sendContactEmail() {
    const name = document.getElementById('contactName').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !subject || !message) {
        alert('Please fill in all fields.');
        return;
    }

    const sendBtn = document.querySelector('.modal-send');
    sendBtn.textContent = 'Sending...';
    sendBtn.disabled = true;

    emailjs.send('service_l1wnisx', 'template_o1j0sqk', {
        from_name: name,
        subject: subject,
        message: message,
        to_email: 'katlegoseiphemo@gmail.com'
    }).then(function() {
        sendBtn.textContent = '✅ Message Sent!';
        setTimeout(() => {
            closeContactModal();
            document.getElementById('contactName').value = '';
            document.getElementById('contactSubject').value = '';
            document.getElementById('contactMessage').value = '';
            sendBtn.textContent = '✉️ Send Message';
            sendBtn.disabled = false;
        }, 1500);
    }).catch(function(error) {
        console.error('EmailJS error:', error);
        sendBtn.textContent = '❌ Failed. Try again.';
        sendBtn.disabled = false;
    });
}

// Initialize EmailJS
emailjs.init("5oGF5Od0T-z8OE2ow");
