document.addEventListener('DOMContentLoaded', () => {

    const burgerBtn = document.getElementById('burgerBtn');
    const sidebar = document.getElementById('sidebar');

    if (burgerBtn && sidebar) {
        burgerBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            const spans = burgerBtn.querySelectorAll('span');
            if (sidebar.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('modalOverlay');

    if (openModalBtn && closeModalBtn && modalOverlay) {
        openModalBtn.addEventListener('click', () => modalOverlay.classList.add('active'));
        closeModalBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) modalOverlay.classList.remove('active');
        });
    }

    const openReportModalBtn = document.getElementById('openReportModalBtn');
    const closeReportModalBtn = document.getElementById('closeReportModalBtn');
    const reportModalOverlay = document.getElementById('reportModalOverlay');

    if (openReportModalBtn && closeReportModalBtn && reportModalOverlay) {
        openReportModalBtn.addEventListener('click', () => reportModalOverlay.classList.add('active'));
        closeReportModalBtn.addEventListener('click', () => reportModalOverlay.classList.remove('active'));
        reportModalOverlay.addEventListener('click', (e) => {
            if (e.target === reportModalOverlay) reportModalOverlay.classList.remove('active');
        });
    }

    const registerForm = document.querySelector('.register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('regName');
            const emailInput = document.getElementById('regEmail');

            if (nameInput && emailInput) {
                localStorage.setItem('userName', nameInput.value);
                localStorage.setItem('userEmail', emailInput.value);

                localStorage.setItem('userBalance', '0');
                localStorage.setItem('userDebt', '0');
                localStorage.setItem('userHours', '0');
                localStorage.setItem('userTasks', '0');

                localStorage.setItem('userInvoices', JSON.stringify([]));
                localStorage.setItem('userRequests', JSON.stringify([]));
                localStorage.setItem('userReports', JSON.stringify([]));

                window.location.href = 'LK/LK.html';
            }
        });
    }

    const userNameDisplay = document.getElementById('userNameDisplay');
    if (userNameDisplay) {
        const savedName = localStorage.getItem('userName') || 'Гость';
        const firstName = savedName.split(' ')[0];
        userNameDisplay.textContent = firstName;
    }

    const updateDashboard = () => {
        const balance = localStorage.getItem('userBalance') || '0';
        const debt = localStorage.getItem('userDebt') || '0';
        const tasks = localStorage.getItem('userTasks') || '0';
        const hours = localStorage.getItem('userHours') || '0';

        document.querySelectorAll('.js-balance').forEach(el => el.textContent = balance + ' ₽');
        document.querySelectorAll('.js-debt').forEach(el => el.textContent = debt + ' ₽');
        document.querySelectorAll('.js-tasks').forEach(el => el.textContent = tasks);
        document.querySelectorAll('.js-hours').forEach(el => el.textContent = hours);
    };
    updateDashboard();

    const renderRequests = () => {
        const container = document.querySelector('.js-requests-container');
        const topBtn = document.getElementById('openModalBtn');
        if (!container) return;

        const requests = JSON.parse(localStorage.getItem('userRequests')) || [];

        if (requests.length === 0) {
            if (topBtn) topBtn.style.display = 'none';
            container.innerHTML = `
                <div class="empty-state glass">
                    <div class="empty-icon">✦</div>
                    <h3>У вас пока нет активных задач</h3>
                    <p>Создайте первую заявку, и мы сразу приступим к работе.</p>
                    <button class="btn-main" onclick="document.getElementById('openModalBtn').click()" style="margin-top: 15px;">Создать заявку</button>
                </div>
            `;
            return;
        }

        if (topBtn) topBtn.style.display = 'inline-block';

        const recentRequests = requests.slice(0, 3);

        container.innerHTML = recentRequests.map((req, index) => `
            <div class="task-item glass" onclick="window.location.href='requests.html'" style="cursor: pointer;">
                <div class="task-info">
                    <h3>${req.title}</h3>
                    <p>Услуга: ${req.serviceType || 'Не указана'}</p>
                    <p>Создана: ${req.date}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="tag tag-blue">${req.status}</span>
                    <button class="btn-delete-task" onclick="event.preventDefault(); event.stopPropagation(); window.deleteRequest(${index}, '${req.title}')" title="Удалить задачу">
                        &times;
                    </button>
                </div>
            </div>
        `).join('');
    };
    renderRequests();

    let currentFilter = 'all';

    const renderFullRequests = () => {
        const container = document.querySelector('.js-full-requests-container');
        if (!container) return;

        const requests = JSON.parse(localStorage.getItem('userRequests')) || [];
        const filteredRequests = currentFilter === 'all' 
            ? requests 
            : requests.filter(req => req.status === currentFilter);

        if (filteredRequests.length === 0) {
            container.innerHTML = `
                <div class="empty-state glass">
                    <svg class="empty-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <h3>${currentFilter === 'all' ? 'У вас пока нет заявок' : 'Нет заявок с таким статусом'}</h3>
                    <p>${currentFilter === 'all' ? 'Создайте первую заявку, и мы сразу приступим к работе.' : 'Попробуйте выбрать другой фильтр.'}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredRequests.map((req) => {
            const originalIndex = requests.findIndex(r => r.title === req.title && r.date === req.date);
            
            return `
            <div class="task-item glass">
                <div class="task-info">
                    <h3>${req.title}</h3>
                    <div class="report-meta" style="margin-bottom: 8px; display: flex; gap: 20px; font-size: 13px; color: var(--text-muted);">
                        <span>Услуга: <strong style="color: #fff;">${req.serviceType || 'Не указана'}</strong></span>
                        <span>Конфигурация: <strong style="color: #fff;">${req.configType || 'Не указана'}</strong></span>
                        <span>Создана: ${req.date}</span>
                    </div>
                    <p class="task-desc-preview">${req.description || 'Описание не указано'}</p>
                </div>
                <div class="task-actions">
                    <span class="tag ${req.status === 'Выполнено' ? 'tag-green' : 'tag-blue'}">${req.status}</span>
                    <button class="btn-delete-task" onclick="event.preventDefault(); event.stopPropagation(); window.deleteRequest(${originalIndex}, '${req.title}')" title="Удалить задачу">
                        &times;
                    </button>
                </div>
            </div>
        `}).join('');
    };

    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        renderFullRequests();
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.getAttribute('data-filter');
                renderFullRequests();
            });
        });
    }

    const renderInvoices = () => {
        const container = document.querySelector('.invoice-container');
        if (!container) return;

        const invoices = JSON.parse(localStorage.getItem('userInvoices')) || [];

        if (invoices.length === 0) {
            container.innerHTML = `
                <div class="empty-state glass">
                    <div class="empty-icon">✦</div>
                    <h3>У вас пока нет счетов</h3>
                    <p>Создайте заявку на главной странице, и мы сразу выставим счет на оплату.</p>
                    <a href="LK.html" class="btn-main" style="margin-top: 15px;">Перейти на главную</a>
                </div>
            `;
            return;
        }

        container.innerHTML = invoices.map((inv, index) => `
            <div class="invoice-card glass" style="margin-bottom: 20px;">
                <div class="invoice-header">
                    <span class="invoice-number">Счет №${inv.id}</span>
                    <span class="tag ${inv.status === 'Оплачен' ? 'tag-green' : 'tag-blue'}">${inv.status}</span>
                </div>
                <span class="invoice-sum ${inv.status === 'Оплачен' ? 'paid' : ''}">${inv.amount} ₽</span>
                ${inv.status === 'Ожидает' ? `<a href="#" class="btn-outline" onclick="payInvoice('${inv.id}')" style="flex: 1; max-width: none;">Оплатить</a>` : ''}
            </div>
        `).join('');
    };
    renderInvoices();

    const requestForm = document.getElementById('requestForm');
    if (requestForm) {
        requestForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const titleInput = document.getElementById('newRequestTitle');
            const descInput = document.getElementById('newRequestDesc');
            const serviceSelect = document.getElementById('newRequestService');
            const configSelect = document.getElementById('newRequestConfig');
            
            if (!titleInput || !serviceSelect) return;

            const titleText = titleInput.value;
            const descText = descInput ? descInput.value : '';
            const serviceType = serviceSelect.value;
            const configType = configSelect ? configSelect.value : 'Не указана';

            let amount = 3000;
            let hours = 1;

            if (serviceType === 'Доработка и разработка 1С') {
                amount = 6000;
                hours = 2;
            } else if (serviceType === 'Интеграция 1С') {
                amount = 5000;
                hours = 2;
            } else if (serviceType === 'Маркировка и Честный знак') {
                amount = 5000;
                hours = 2;
            }

            let tasks = parseInt(localStorage.getItem('userTasks') || '0');
            let debt = parseInt(localStorage.getItem('userDebt') || '0');
            let userHours = parseInt(localStorage.getItem('userHours') || '0');
            let invoices = JSON.parse(localStorage.getItem('userInvoices')) || [];
            let requestsList = JSON.parse(localStorage.getItem('userRequests')) || [];

            tasks += 1;
            debt += amount;
            userHours += hours;

            const dateStr = new Date().toLocaleDateString('ru-RU');
            const newInvoiceId = Math.floor(Math.random() * 900) + 100;

            requestsList.unshift({ 
                title: titleText, 
                description: descText, 
                serviceType: serviceType,
                configType: configType,
                date: dateStr, 
                status: 'В работе' 
            });
            
            invoices.push({ 
                id: newInvoiceId, 
                amount: amount, 
                status: 'Ожидает' 
            });

            localStorage.setItem('userTasks', tasks.toString());
            localStorage.setItem('userDebt', debt.toString());
            localStorage.setItem('userHours', userHours.toString());
            localStorage.setItem('userRequests', JSON.stringify(requestsList));
            localStorage.setItem('userInvoices', JSON.stringify(invoices));

            updateDashboard();
            renderRequests();
            renderFullRequests();
            renderInvoices();

            modalOverlay.classList.remove('active');
            requestForm.reset();

            alert(`Заявка на услугу "${serviceType}" создана! Счет выставлен на ${amount} ₽.`);
        });
    }

    window.payInvoice = (id) => {
        let invoices = JSON.parse(localStorage.getItem('userInvoices')) || [];
        let debt = parseInt(localStorage.getItem('userDebt') || '0');
        let balance = parseInt(localStorage.getItem('userBalance') || '0');

        invoices = invoices.map(inv => {
            if (inv.id == id) {
                inv.status = 'Оплачен';
                debt -= inv.amount;
                balance += inv.amount;
            }
            return inv;
        });

        localStorage.setItem('userInvoices', JSON.stringify(invoices));
        localStorage.setItem('userDebt', debt.toString());
        localStorage.setItem('userBalance', balance.toString());

        updateDashboard();
        renderInvoices();
        alert('Счет успешно оплачен!');
    };

    window.deleteRequest = (index, title) => {
        if (!confirm(`Вы уверены, что хотите удалить задачу "${title}"? Связанный счет также будет удален.`)) return;

        let requests = JSON.parse(localStorage.getItem('userRequests')) || [];
        let invoices = JSON.parse(localStorage.getItem('userInvoices')) || [];
        let tasks = parseInt(localStorage.getItem('userTasks') || '0');
        let debt = parseInt(localStorage.getItem('userDebt') || '0');

        if (index >= 0 && index < requests.length) {
            requests.splice(index, 1);
        }

        const invoiceIndex = invoices.findIndex(inv => inv.status === 'Ожидает');
        if (invoiceIndex !== -1) {
            debt -= invoices[invoiceIndex].amount;
            if (debt < 0) debt = 0;
            invoices.splice(invoiceIndex, 1);
        }

        if (tasks > 0) tasks -= 1;

        localStorage.setItem('userRequests', JSON.stringify(requests));
        localStorage.setItem('userInvoices', JSON.stringify(invoices));
        localStorage.setItem('userTasks', tasks.toString());
        localStorage.setItem('userDebt', debt.toString());

        updateDashboard();
        renderRequests();
        renderFullRequests();
        renderInvoices();
    };

    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        const fields = {
            company: document.getElementById('profCompany'),
            inn: document.getElementById('profInn'),
            address: document.getElementById('profAddress'),
            contactName: document.getElementById('profContactName'),
            email: document.getElementById('profEmail'),
            phone: document.getElementById('profPhone')
        };

        for (const key in fields) {
            if (fields[key]) {
                const savedValue = localStorage.getItem('prof_' + key);
                if (savedValue) fields[key].value = savedValue;
            }
        }

        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            for (const key in fields) {
                if (fields[key]) {
                    localStorage.setItem('prof_' + key, fields[key].value);
                }
            }
            alert('Данные профиля успешно сохранены!');
        });
    }

    const reportForm = document.getElementById('reportForm');
    const reportsContainer = document.querySelector('.js-reports-container');

    const renderReports = () => {
        if (!reportsContainer) return;

        let reports = JSON.parse(localStorage.getItem('userReports')) || [];

        if (reports.length === 0) {
            reportsContainer.innerHTML = `
                <div class="empty-state glass">
                    <svg class="empty-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <h3>У вас пока нет сформированных отчетов</h3>
                    <p>Запросите отчет с помощью кнопки в правом верхнем углу, и мы подготовим его в ближайшее время.</p>
                </div>
            `;
            return;
        }

        reportsContainer.innerHTML = reports.map((rep) => `
            <div class="report-card glass">
                <div class="report-info">
                    <span class="report-title">${rep.type}</span>
                    <div class="report-meta">
                        <span>Период: ${rep.period}</span>
                        <span>Дата запроса: ${rep.date}</span>
                    </div>
                </div>
                <div class="report-actions">
                    ${rep.status === 'Готов' 
                        ? `<span class="tag tag-green">Готов</span>
                           <a href="#" class="btn-download" onclick="event.preventDefault(); alert('Скачивание отчета...');">Скачать</a>`
                        : `<span class="tag tag-blue">В обработке</span>`
                    }
                </div>
            </div>
        `).join('');
    };

    if (reportForm) {
        renderReports();

        reportForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const type = document.getElementById('reportType').value;
            const period = document.getElementById('reportPeriod').value;
            
            let reports = JSON.parse(localStorage.getItem('userReports')) || [];
            const dateStr = new Date().toLocaleDateString('ru-RU');

            reports.unshift({
                type: type,
                period: period,
                date: dateStr,
                status: 'В обработке'
            });

            localStorage.setItem('userReports', JSON.stringify(reports));

            renderReports();
            reportModalOverlay.classList.remove('active');
            reportForm.reset();

            alert('Запрос на формирование отчета отправлен!');
        });
    }

    const logoutBtns = document.querySelectorAll('.btn-login');
    logoutBtns.forEach(btn => {
        if (btn.textContent.includes('Выйти')) {
            btn.addEventListener('click', () => localStorage.clear());
        }
    });

});