const form = document.getElementById('feedback-form');
const submitBtn = document.getElementById('submit-btn');
const formMessage = document.getElementById('form-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value || null,
        faculty: document.getElementById('faculty').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        inquiryType: document.querySelector('input[name="inquiry-type"]:checked').value,
        newsletter: document.getElementById('newsletter').checked,
        anonymous: document.getElementById('anonymous').checked,
        rating: document.getElementById('rating').value
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    formMessage.innerHTML = '';

    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            formMessage.innerHTML = `
                <div style="background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 1rem; border-radius: 8px; font-weight: 600;">
                    ✓ Ваше сообщение успешно отправлено! Спасибо за обратную связь.
                </div>
            `;

            localStorage.setItem('lastSearchEmail', formData.email);

            form.reset();
            submitBtn.textContent = 'Отправить сообщение';
            submitBtn.disabled = false;

            setTimeout(() => {
                formMessage.innerHTML = '';
            }, 5000);
        } else {
            formMessage.innerHTML = `
                <div style="background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 1rem; border-radius: 8px; font-weight: 600;">
                    ✗ Ошибка при отправке сообщения. ${result.error || 'Пожалуйста, попробуйте позже.'}
                </div>
            `;
            submitBtn.textContent = 'Отправить сообщение';
            submitBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        formMessage.innerHTML = `
            <div style="background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 1rem; border-radius: 8px; font-weight: 600;">
                ✗ Ошибка сети. Пожалуйста, проверьте интернет-соединение и попробуйте снова.
            </div>
        `;
        submitBtn.textContent = 'Отправить сообщение';
        submitBtn.disabled = false;
    }
});
