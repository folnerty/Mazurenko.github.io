const searchEmailInput = document.getElementById('search-email');
const searchBtn = document.getElementById('search-btn');
const submissionsContainer = document.getElementById('submissions-container');
const errorMessage = document.getElementById('error-message');

searchBtn.addEventListener('click', searchSubmissions);
searchEmailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchSubmissions();
    }
});

function showError(message) {
    errorMessage.innerHTML = `<div class="error-message">${message}</div>`;
}

function clearError() {
    errorMessage.innerHTML = '';
}

function showLoading() {
    submissionsContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Загрузка ваших сообщений...</p>
        </div>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('ru-RU', options);
}

function getInquiryTypeLabel(type) {
    const types = {
        'question': 'Вопрос',
        'suggestion': 'Предложение',
        'experience': 'Поделиться опытом',
        'other': 'Другое'
    };
    return types[type] || type;
}

function getFacultyLabel(faculty) {
    const faculties = {
        'cs': 'Факультет компьютерных наук',
        'economics': 'Факультет экономических наук',
        'management': 'Факультет менеджмента',
        'law': 'Юридический факультет',
        'social': 'Факультет социальных наук',
        'other': 'Другой'
    };
    return faculties[faculty] || faculty;
}

function renderSubmissions(submissions) {
    if (submissions.length === 0) {
        submissionsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3>Сообщений не найдено</h3>
                <p>По введённому адресу электронной почты сообщений нет. Проверьте адрес и попробуйте еще раз.</p>
            </div>
        `;
        return;
    }

    submissionsContainer.innerHTML = submissions.map(submission => {
        const date = formatDate(submission.created_at);
        const inquiryType = getInquiryTypeLabel(submission.inquiry_type);
        const faculty = getFacultyLabel(submission.faculty);
        const ratingStars = '⭐'.repeat(submission.rating);

        return `
            <div class="submission-card">
                <div class="submission-header">
                    <div class="submission-title">
                        <h3>${submission.subject}</h3>
                        <div class="submission-meta">${date}</div>
                    </div>
                    <div class="submission-badge">${inquiryType}</div>
                </div>

                <div class="submission-body">
                    ${submission.message}
                </div>

                <div class="submission-footer">
                    <div class="submission-details">
                        <div class="detail-item">
                            <span class="detail-label">От:</span>
                            <span>${submission.anonymous ? 'Анонимно' : submission.name}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Факультет:</span>
                            <span>${faculty}</span>
                        </div>
                        <div class="detail-item submission-rating">
                            <span class="detail-label">Оценка:</span>
                            <span class="rating-stars">${ratingStars}</span>
                            <span>${submission.rating}/10</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function searchSubmissions() {
    const email = searchEmailInput.value.trim();

    if (!email) {
        showError('Пожалуйста, введите адрес электронной почты');
        return;
    }

    if (!email.includes('@')) {
        showError('Пожалуйста, введите корректный адрес электронной почты');
        return;
    }

    clearError();
    showLoading();

    try {
        const response = await fetch(`/api/submissions?email=${encodeURIComponent(email)}`);
        const result = await response.json();

        if (!response.ok) {
            showError('Ошибка при загрузке данных. Попробуйте позже.');
            submissionsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📧</div>
                    <h3>Введите вашу почту для поиска</h3>
                    <p>Введите адрес электронной почты, на которую вы отправляли сообщение, чтобы просмотреть ваши отправления.</p>
                </div>
            `;
            return;
        }

        renderSubmissions(result.data);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        showError('Ошибка сети. Проверьте интернет-соединение и попробуйте снова.');
        submissionsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📧</div>
                <h3>Введите вашу почту для поиска</h3>
                <p>Введите адрес электронной почты, на которую вы отправляли сообщение, чтобы просмотреть ваши отправления.</p>
            </div>
        `;
    }
}

window.addEventListener('load', () => {
    const savedEmail = localStorage.getItem('lastSearchEmail');
    if (savedEmail) {
        searchEmailInput.value = savedEmail;
    }
});
