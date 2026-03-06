document.addEventListener('DOMContentLoaded', () => {
    // ========== NAVIGATION ==========
    const navLinks = document.querySelectorAll('[data-section]');
    const pages = document.querySelectorAll('.page');
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('nav-links');

    function navigateTo(sectionId) {
        pages.forEach(p => p.classList.remove('active'));
        const target = document.getElementById(sectionId);
        if (target) target.classList.add('active');

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (navLinksContainer) navLinksContainer.classList.remove('open');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            if (section) navigateTo(section);

            // Handle scroll to specific element
            const scrollTarget = link.dataset.scroll;
            if (scrollTarget) {
                setTimeout(() => {
                    const el = document.getElementById(scrollTarget);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 400);
            }
        });
    });

    // Card clicks navigate to blog section and scroll to post
    document.querySelectorAll('.card[data-post]').forEach(card => {
        card.addEventListener('click', () => {
            const postId = card.dataset.post;
            const section = postId.startsWith('travel') ? 'travel' : 'food';
            navigateTo(section);
            setTimeout(() => {
                const post = document.getElementById(postId);
                if (post) post.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 400);
        });
    });

    // Hamburger menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('open');
        });
    }

    // ========== LOTTO ==========
    const generateBtn = document.getElementById('generate-btn');
    const resultsContainer = document.getElementById('lotto-results');
    const gameCountSelect = document.getElementById('game-count');
    const roundInfo = document.getElementById('round-info');

    if (roundInfo) {
        const firstDraw = new Date(2002, 11, 7);
        const now = new Date();
        const weeksDiff = Math.floor((now - firstDraw) / (7 * 24 * 60 * 60 * 1000));
        roundInfo.textContent = `제 ${weeksDiff}회차 기준`;
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const gameCount = parseInt(gameCountSelect.value);
            resultsContainer.innerHTML = '';
            const labels = ['A', 'B', 'C', 'D', 'E'];

            for (let i = 0; i < gameCount; i++) {
                const numbers = createNumberSet();
                const row = document.createElement('div');
                row.className = 'game-row';
                row.style.animationDelay = `${i * 0.1}s`;

                const label = document.createElement('div');
                label.className = 'game-label';
                label.textContent = labels[i];

                const numbersDiv = document.createElement('div');
                numbersDiv.className = 'game-numbers';

                numbers.forEach((num, idx) => {
                    const ball = document.createElement('div');
                    ball.className = `lotto-ball ${getBallColor(num)}`;
                    ball.textContent = num;
                    ball.style.animationDelay = `${i * 0.1 + idx * 0.08}s`;
                    numbersDiv.appendChild(ball);
                });

                row.appendChild(label);
                row.appendChild(numbersDiv);
                resultsContainer.appendChild(row);
            }
        });
    }

    function createNumberSet() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    function getBallColor(num) {
        if (num <= 10) return 'ball-yellow';
        if (num <= 20) return 'ball-blue';
        if (num <= 30) return 'ball-red';
        if (num <= 40) return 'ball-gray';
        return 'ball-green';
    }

    // ========== COMMENTS SYSTEM (localStorage) ==========
    const COMMENTS_KEY = 'blog_comments';

    function getComments() {
        try {
            return JSON.parse(localStorage.getItem(COMMENTS_KEY)) || {};
        } catch {
            return {};
        }
    }

    function saveComments(comments) {
        localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMin = Math.floor(diffMs / 60000);
        const diffHr = Math.floor(diffMs / 3600000);
        const diffDay = Math.floor(diffMs / 86400000);

        if (diffMin < 1) return '방금 전';
        if (diffMin < 60) return `${diffMin}분 전`;
        if (diffHr < 24) return `${diffHr}시간 전`;
        if (diffDay < 7) return `${diffDay}일 전`;
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    }

    function getInitial(name) {
        return name ? name.charAt(0).toUpperCase() : '?';
    }

    function renderComments(postId, container) {
        const allComments = getComments();
        const postComments = allComments[postId] || [];
        const listEl = container.querySelector('.comment-list');
        listEl.innerHTML = '';

        if (postComments.length === 0) {
            listEl.innerHTML = '<p class="no-comments">아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!</p>';
            return;
        }

        postComments.forEach(c => {
            const colors = ['#667eea', '#e63946', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
            const colorIdx = c.name.charCodeAt(0) % colors.length;

            const commentEl = document.createElement('div');
            commentEl.className = 'comment';
            commentEl.innerHTML = `
                <div class="comment-avatar" style="background:${colors[colorIdx]}">${getInitial(c.name)}</div>
                <div class="comment-body">
                    <div class="comment-header">
                        <span class="comment-name">${escapeHtml(c.name)}</span>
                        <span class="comment-time">${formatTime(c.timestamp)}</span>
                    </div>
                    <p class="comment-text">${escapeHtml(c.text)}</p>
                </div>
            `;
            listEl.appendChild(commentEl);
        });
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Add comments section to each blog post
    document.querySelectorAll('.post').forEach(post => {
        const postId = post.id;
        if (!postId) return;

        const commentsSection = document.createElement('div');
        commentsSection.className = 'comments-section';
        commentsSection.innerHTML = `
            <h3>댓글</h3>
            <div class="comment-form">
                <div class="comment-form-row">
                    <input type="text" placeholder="이름" class="comment-name-input" maxlength="20">
                </div>
                <textarea placeholder="댓글을 입력하세요..." class="comment-text-input" maxlength="500"></textarea>
                <button class="comment-submit-btn" data-post-id="${postId}">댓글 작성</button>
            </div>
            <div class="comment-list"></div>
        `;

        post.querySelector('.post-content').appendChild(commentsSection);
        renderComments(postId, commentsSection);

        const submitBtn = commentsSection.querySelector('.comment-submit-btn');
        const nameInput = commentsSection.querySelector('.comment-name-input');
        const textInput = commentsSection.querySelector('.comment-text-input');

        submitBtn.addEventListener('click', () => {
            const name = nameInput.value.trim();
            const text = textInput.value.trim();

            if (!name || !text) {
                alert('이름과 댓글 내용을 모두 입력해주세요.');
                return;
            }

            const allComments = getComments();
            if (!allComments[postId]) allComments[postId] = [];
            allComments[postId].push({
                name,
                text,
                timestamp: Date.now()
            });
            saveComments(allComments);

            nameInput.value = '';
            textInput.value = '';
            renderComments(postId, commentsSection);
        });
    });

    // ========== CONTACT FORM (localStorage backend simulation) ==========
    const contactForm = document.getElementById('contact-form');
    const CONTACTS_KEY = 'blog_contacts';

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value;
            const message = document.getElementById('contact-message').value.trim();
            const msgEl = document.getElementById('contact-form-message');
            const submitBtn = document.getElementById('contact-submit');

            if (!name || !email || !message) {
                msgEl.className = 'form-message error';
                msgEl.textContent = '필수 항목을 모두 입력해주세요.';
                return;
            }

            // Email validation
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                msgEl.className = 'form-message error';
                msgEl.textContent = '올바른 이메일 주소를 입력해주세요.';
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = '보내는 중...';

            // Simulate sending (store in localStorage)
            setTimeout(() => {
                try {
                    const contacts = JSON.parse(localStorage.getItem(CONTACTS_KEY)) || [];
                    contacts.push({
                        name,
                        email,
                        subject,
                        message,
                        timestamp: Date.now()
                    });
                    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));

                    msgEl.className = 'form-message success';
                    msgEl.textContent = '메시지가 성공적으로 전송되었습니다! 빠른 시일 내에 답변드리겠습니다.';
                    contactForm.reset();
                } catch {
                    msgEl.className = 'form-message error';
                    msgEl.textContent = '전송 중 오류가 발생했습니다. 다시 시도해주세요.';
                }

                submitBtn.disabled = false;
                submitBtn.textContent = '보내기';
            }, 1000);
        });
    }

    // ========== SCROLL NAV SHADOW ==========
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            nav.style.boxShadow = '0 2px 16px rgba(0,0,0,0.12)';
        } else {
            nav.style.boxShadow = '0 1px 8px rgba(0,0,0,0.08)';
        }
    });
});