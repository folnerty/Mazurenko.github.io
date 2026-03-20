window.addEventListener('DOMContentLoaded', function() {
    initPlotlyChart();
    initMap();
    initNavigation();
    initContactForm();
    initBackToTop();
});

function initPlotlyChart() {
    const moduleGrades = [8.5, 7.8, 8.2, 7.5, 8.0, 7.9];
    const moduleNumbers = ['Модуль 1', 'Модуль 2', 'Модуль 3', 'Модуль 4', 'Модуль 1 (текущий)', 'Модуль 2 (прогноз)'];

    const trace1 = {
        x: moduleNumbers,
        y: moduleGrades,
        name: 'Оценки по модулям',
        type: 'scatter',
        mode: 'lines+markers',
        line: {
            color: '#8e2de2',
            width: 3
        },
        marker: {
            size: 10,
            color: '#4a00e0'
        }
    };

    const data = [trace1];

    const layout = {
        title: {
            text: 'Динамика оценок по модулям обучения',
            font: {
                size: 18,
                color: '#2d2d44'
            }
        },
        xaxis: {
            title: 'Учебный модуль',
            titlefont: {
                size: 14,
                color: '#4a00e0'
            }
        },
        yaxis: {
            title: 'Средняя оценка',
            titlefont: {
                size: 14,
                color: '#4a00e0'
            },
            range: [0, 10]
        },
        plot_bgcolor: 'rgba(248, 249, 250, 0.5)',
        paper_bgcolor: 'white',
        margin: {
            l: 50,
            r: 50,
            t: 50,
            b: 50
        },
        hovermode: 'closest'
    };

    Plotly.newPlot('plotly-chart', data, layout, {responsive: true});
}

function initMap() {
    const campusCoordinates = [55.7602, 37.6547];

    try {
        const map = L.map('campus-map').setView(campusCoordinates, 16);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        const marker = L.marker(campusCoordinates).addTo(map);
        marker.bindPopup('<b>НИУ ВШЭ</b><br>Главное здание на Покровском бульваре, 11').openPopup();

        L.circle(campusCoordinates, {
            color: '#8e2de2',
            fillColor: '#8e2de2',
            fillOpacity: 0.15,
            radius: 100
        }).addTo(map);
    } catch (error) {
        console.error('Map initialization error:', error);
    }
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({behavior: 'smooth'});
            }

            document.querySelector('.navbar-collapse')?.classList.remove('show');
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('form-name').value,
            email: document.getElementById('form-email').value,
            subject: document.getElementById('form-subject').value,
            message: document.getElementById('form-message').value,
            inquiryType: 'question'
        };

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                statusDiv.innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <i class="bi bi-check-circle"></i> Спасибо! Ваше сообщение успешно отправлено.
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                `;
                form.reset();

                setTimeout(() => {
                    statusDiv.innerHTML = '';
                }, 5000);
            } else {
                statusDiv.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <i class="bi bi-exclamation-circle"></i> Ошибка при отправке. Попробуйте позже.
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error:', error);
            statusDiv.innerHTML = `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <i class="bi bi-exclamation-triangle"></i> Ошибка сети. Проверьте подключение.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
        }
    });
}

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
