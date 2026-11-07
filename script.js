// 0. ПРИНУДИТЕЛЬНЫЙ СКРОЛЛ НАВЕРХ ПРИ ЗАГРУЗКЕ
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname);
}


// 0.1 Прелоадер
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 800);
});


// 0.2 Прогресс-бар скролла
const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
});


// 0.3 Кнопка наверх
const scrollTopBtn = document.getElementById('scroll-top-btn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


// 1. Логика переключения темы
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
});

const initialTheme = document.documentElement.getAttribute('data-theme');
themeToggle.textContent = initialTheme === 'light' ? '🌙' : '☀️';


// 3. Анимация появления элементов при скролле + запуск счетчиков
const observerOptions = { threshold: 0.2, rootMargin: '0px 0px -50px 0px' };
let statsAnimated = false;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            if (entry.target.id === 'stats' && !statsAnimated) {
                animateStats();
                statsAnimated = true;
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// 4. Анимация счетчиков
function animateStats() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const increment = target / (duration / 16);
        
        let current = 0;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target;
            }
        };
        updateCounter();
    });
}


// 5. Интерактивный терминал + автодемонстрация
const terminalInput = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');

// Функция получения команд на текущем языке
function getTerminalCommands() {
    const lang = localStorage.getItem('lang') || 'ru';
    return {
        'help': translations[lang].cmd_help,
        'go version': translations[lang].cmd_go_version,
        'ls': translations[lang].cmd_ls,
        'whoami': translations[lang].cmd_whoami,
        'contact': translations[lang].cmd_contact,
        'clear': 'CLEAR'
    };
}

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const cmd = terminalInput.value.trim().toLowerCase();
        const commands = getTerminalCommands();
        const lang = localStorage.getItem('lang') || 'ru';
        
        const cmdLine = document.createElement('div');
        cmdLine.className = 'terminal-line';
        cmdLine.innerHTML = `<span class="terminal-prompt">thebrickvitalik@portfolio:~$</span> <span class="terminal-text">${terminalInput.value}</span>`;
        terminalBody.appendChild(cmdLine);
        
        if (cmd === 'clear') {
            terminalBody.innerHTML = '';
        } else if (commands[cmd]) {
            const responseLine = document.createElement('div');
            responseLine.className = 'terminal-line';
            responseLine.innerHTML = `<span class="terminal-text">${commands[cmd]}</span>`;
            terminalBody.appendChild(responseLine);
        } else if (cmd !== '') {
            const errorLine = document.createElement('div');
            errorLine.className = 'terminal-line';
            const errorMsg = translations[lang].cmd_not_found.replace('{cmd}', terminalInput.value);
            errorLine.innerHTML = `<span class="terminal-text" style="color:#ff5f56">${errorMsg}</span>`;
            terminalBody.appendChild(errorLine);
        }
        
        terminalInput.value = '';
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
});

document.querySelector('.terminal').addEventListener('click', () => {
    terminalInput.focus();
});

// Автодемонстрация терминала
function autoDemo() {
    const demoCommands = ['whoami', 'ls', 'go version'];
    let demoIndex = 0;
    
    function typeCommand() {
        if (demoIndex < demoCommands.length) {
            const cmd = demoCommands[demoIndex];
            terminalInput.value = cmd;
            
            setTimeout(() => {
                terminalInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
                demoIndex++;
                setTimeout(typeCommand, 1500);
            }, 500);
        }
    }
    
    setTimeout(typeCommand, 2000);
}

const terminalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(autoDemo, 1000);
            terminalObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

terminalObserver.observe(document.getElementById('terminal'));


// 6. Копирование кода
const copyBtn = document.getElementById('copy-btn');
const codeContent = document.querySelector('.code-content code');

copyBtn.addEventListener('click', () => {
    const textToCopy = codeContent.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        const lang = localStorage.getItem('lang') || 'ru';
        const originalText = copyBtn.innerText;
        copyBtn.innerText = translations[lang].code_copied;
        copyBtn.style.background = '#27c93f';
        setTimeout(() => {
            copyBtn.innerText = translations[lang].code_copy;
            copyBtn.style.background = 'rgba(255,255,255,0.1)';
        }, 2000);
    });
});


// 7. Плавный скролл по якорным ссылкам БЕЗ изменения URL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


// ============================================
// 8. СИСТЕМА ПЕРЕКЛЮЧЕНИЯ ЯЗЫКА (i18n)
// ============================================
// Переменная для хранения активного таймера typing
let typingTimer = null;

function startTypingEffect(element) {
    // Сбрасываем предыдущий таймер, если он есть
    if (typingTimer) {
        clearTimeout(typingTimer);
        typingTimer = null;
    }
    
    const textToType = element.getAttribute('data-text');
    let charIndex = 0;
    element.textContent = '';
    
    function typeText() {
        if (charIndex < textToType.length) {
            element.textContent += textToType.charAt(charIndex);
            charIndex++;
            typingTimer = setTimeout(typeText, 150);
        }
    }
    typingTimer = setTimeout(typeText, 300);
}
const translations = {
    ru: {
        preloader_text: "Загрузка...",
        nav_stats: "Опыт",
        nav_about: "Обо мне",
        nav_stack: "Стек",
        nav_projects: "Проекты",
        nav_approach: "Подход",
        nav_timeline: "Путь",
        nav_terminal: "Терминал",
        nav_contacts: "Контакты",
        header_cv: "CV",
        hero_title_start: "Привет! Я ",
        hero_typing_name: "Виталий",
        hero_subtitle: "Backend & Full Stack Developer (Go)",
        hero_description: "Создаю надежные, масштабируемые серверные решения и полноценные веб-приложения. Более 9 лет опыта в инженерии на крупных промышленных проектах дали мне системное мышление, которое я применяю для разработки чистого, эффективного и поддерживаемого кода.",
        hero_github: "Мой GitHub",
        hero_cv: "💬Download CV",
        hero_projects: "Смотреть проекты",
        stats_title: "Опыт в цифрах",
        stat_years: "+ лет в инженерии",
        stat_projects: "+ проектов",
        stat_tech: "+ технологий в стеке",
        stat_commitment: "% commitment",
        about_title: "Обо мне",
        about_text: "Мой путь в IT начался с автоматизации инженерных рабочих процессов с помощью Python, Excel и VBA. Это пробудило страсть к программной инженерии и привело к переходу в профессиональную разработку. Сейчас я фокусируюсь на создании отказоустойчивых REST API, работе с реляционными базами данных, а также беру на себя полный цикл разработки веб-приложений как Full Stack специалист.",
        stack_title: "Технический стек",
        stack_main_title: "Основной стек",
        stack_main_text: "Go, PostgreSQL, Chi Router, REST API, JWT, Microservices, gRPC, Protobuf",
        stack_devops_title: "Инструменты и DevOps",
        stack_devops_text: "Docker, Kubernetes (K8s), GitLab CI/CD, Prometheus, Grafana, Linux, Bash",
        stack_arch_title: "Архитектура и принципы",
        stack_arch_text: "Clean Architecture, SOLID, DRY, KISS, Event-Driven, TDD",
        projects_title: "Избранные проекты",
        project1_title: "Платформа кураторского ресейла",
        project1_tech: "Go • PostgreSQL • Docker • Full Stack",
        project1_desc: "Разработка коммерческого Full Stack проекта для платформы ресейла дизайнерской одежды. Самостоятельная реализация бэкенда (логика каталога, управление товарами, интеграции) и поддержка клиентской части приложения.",
        project1_link: "",
        project2_title: "Task Manager API",
        project2_tech: "Go • Chi • PostgreSQL • JWT",
        project2_desc: "RESTful API для управления задачами с полноценной аутентификацией и авторизацией через JWT. Покрыт тестами, упакован в Docker-контейнер.",
        project2_link: "Смотреть код →",
        project3_title: "Report Service",
        project3_tech: "Go • Kafka • Concurrency",
        project3_desc: "Отказоустойчивый микросервис для генерации отчетов. Использует Kafka для асинхронной обработки очередей задач и гарантирует доставку данных даже при сбоях.",
        project3_link: "Смотреть код →",
        project4_title: "English Teacher Dashboard",
        project4_tech: "Go • Telegram Bot API",
        project4_desc: "Telegram-бот для автоматизации работы преподавателя: управление списком учеников, отслеживание домашних заданий и расписания занятий.",
        project4_link: "Смотреть код →",
        approach_title: "Как я работаю",
        approach1_title: "Чистый код",
        approach1_text: "Следую принципам SOLID и DRY. Пишу читаемый, модульный и легко поддерживаемый код.",
        approach2_title: "Тестирование",
        approach2_text: "Unit и интеграционные тесты. Уверенность в том, что код работает корректно в любых условиях.",
        approach3_title: "Документация",
        approach3_text: "Читаемый README, Swagger для API. Код и архитектура должны говорить сами за себя.",
        approach4_title: "Производительность",
        approach4_text: "Оптимизация запросов, кэширование, асинхронная обработка. Каждая миллисекунда на счету.",
        timeline_title: "Мой путь",
        timeline1_title: "Инженер на промышленных проектах",
        timeline1_date: "2015 - 2024",
        timeline1_text: "9+ лет работы на крупных промышленных объектах. Развитие системного мышления, работа со сложной документацией и управление процессами.",
        timeline2_title: "Автоматизация процессов",
        timeline2_date: "2020 - 2023",
        timeline2_text: "Начал автоматизировать рутинные инженерные задачи с помощью Python, Excel и VBA. Открыл для себя мир программирования.",
        timeline3_title: "Переход в разработку",
        timeline3_date: "2024",
        timeline3_text: "Осознанный переход в профессиональную разработку. Глубокое изучение Go, PostgreSQL, Docker и микросервисной архитектуры.",
        timeline4_title: "Backend & Full Stack Developer",
        timeline4_date: "2024 - настоящее время",
        timeline4_text: "Разработка коммерческих Full Stack проектов. Самостоятельное создание бэкенда на Go и поддержка клиентской части. Внедрение gRPC, Kafka, CI/CD и мониторинга.",
        terminal_title: "Интерактивный терминал",
        terminal_subtitle: "Введи команду и нажми Enter. Попробуй: go version, ls, whoami, help, clear",
        terminal_welcome: "Добро пожаловать! Введите 'help' для списка доступных команд.",
        code_title: "Пример моего кода",
        code_subtitle: "Kafka Consumer с retry-логикой и graceful shutdown из Report Service",
        code_language: "Go • Kafka • Concurrency",
        code_copy: "Копировать",
        code_copied: "Скопировано!",
        contacts_title: "Контакты",
        contacts_text: "Открыт к предложениям о работе, интересным проектам и профессиональному нетворкингу.",
        contacts_github: "GitHub",
        contacts_email: "Написать на Email",
        contacts_telegram: "Telegram",
        footer_text: "© 2026 TheBrickVitalik. Backend & Full Stack Developer (Go). Создано с вниманием к деталям.",
        scroll_top: "Наверх",
        cmd_help: "Доступные команды: <br> - <span style='color:#27c93f'>go version</span>: показать версию Go<br> - <span style='color:#27c93f'>ls</span>: список проектов<br> - <span style='color:#27c93f'>whoami</span>: информация обо мне<br> - <span style='color:#27c93f'>clear</span>: очистить терминал<br> - <span style='color:#27c93f'>contact</span>: мои контакты",
        cmd_go_version: "go version go1.22.0 linux/amd64",
        cmd_ls: "resale-platform/  task-manager/  report-service/  english-teacher-bot/",
        cmd_whoami: "Виталий (TheBrickVitalik). Backend & Full Stack Developer. 9+ лет в инженерии, увлечен созданием надежных распределенных систем и полноценных веб-приложений.",
        cmd_contact: "Email: kakocuk1@mail.ru | Telegram: @TheBrickVitalik | GitHub: github.com/kakocuk1",
        cmd_not_found: "bash: {cmd}: command not found. Введите 'help' для справки.",
        cv_message: "Привет, видел(а) твой сайт-визитку, пришли, пожалуйста, свое резюме",
        page_title: "Портфолио | TheBrickVitalik, Backend & Full Stack Developer"
    },
    en: {
        preloader_text: "Loading...",
        nav_stats: "Experience",
        nav_about: "About",
        nav_stack: "Stack",
        nav_projects: "Projects",
        nav_approach: "Approach",
        nav_timeline: "Journey",
        nav_terminal: "Terminal",
        nav_contacts: "Contacts",
        header_cv: "CV",
        hero_title_start: "Hi, I'm ",
        hero_typing_name: "Vitaliy",
        hero_subtitle: "Backend & Full Stack Developer (Go)",
        hero_description: "I build reliable, scalable server solutions and full-featured web applications. Over 9 years of experience in engineering on large industrial projects gave me systematic thinking, which I now apply to writing clean, efficient, and maintainable code.",
        hero_github: "My GitHub",
        hero_cv: "💬 Download CV",
        hero_projects: "View Projects",
        stats_title: "Experience in Numbers",
        stat_years: "+ years in engineering",
        stat_projects: "+ projects",
        stat_tech: "+ technologies in stack",
        stat_commitment: "% commitment",
        about_title: "About Me",
        about_text: "My journey into IT started with automating engineering workflows using Python, Excel, and VBA. This sparked a passion for software engineering and led to a transition into professional development. Currently, I focus on building fault-tolerant REST APIs, working with relational databases, and taking on the full cycle of web application development as a Full Stack specialist.",
        stack_title: "Tech Stack",
        stack_main_title: "Core Stack",
        stack_main_text: "Go, PostgreSQL, Chi Router, REST API, JWT, Microservices, gRPC, Protobuf",
        stack_devops_title: "Tools & DevOps",
        stack_devops_text: "Docker, Kubernetes (K8s), GitLab CI/CD, Prometheus, Grafana, Linux, Bash",
        stack_arch_title: "Architecture & Principles",
        stack_arch_text: "Clean Architecture, SOLID, DRY, KISS, Event-Driven, TDD",
        projects_title: "Featured Projects",
        project1_title: "Curated Resale Platform",
        project1_tech: "Go • PostgreSQL • Docker • Full Stack",
        project1_desc: "Development of a commercial Full Stack project for a designer clothing resale platform. Independent backend implementation (catalog logic, product management, integrations) and frontend support.",
        project1_link: "Learn more →",
        project2_title: "Task Manager API",
        project2_tech: "Go • Chi • PostgreSQL • JWT",
        project2_desc: "RESTful API for task management with full authentication and authorization via JWT. Covered with tests, packaged in a Docker container.",
        project2_link: "View code →",
        project3_title: "Report Service",
        project3_tech: "Go • Kafka • Concurrency",
        project3_desc: "Fault-tolerant microservice for report generation. Uses Kafka for asynchronous task queue processing and guarantees data delivery even during failures.",
        project3_link: "View code →",
        project4_title: "English Teacher Dashboard",
        project4_tech: "Go • Telegram Bot API",
        project4_desc: "Telegram bot for automating a teacher's workflow: managing student lists, tracking homework, and scheduling classes.",
        project4_link: "View code →",
        approach_title: "How I Work",
        approach1_title: "Clean Code",
        approach1_text: "I follow SOLID and DRY principles. I write readable, modular, and easily maintainable code.",
        approach2_title: "Testing",
        approach2_text: "Unit and integration tests. Confidence that the code works correctly in any conditions.",
        approach3_title: "Documentation",
        approach3_text: "Readable README, Swagger for APIs. Code and architecture should speak for themselves.",
        approach4_title: "Performance",
        approach4_text: "Query optimization, caching, asynchronous processing. Every millisecond counts.",
        timeline_title: "My Journey",
        timeline1_title: "Engineer on Industrial Projects",
        timeline1_date: "2015 - 2024",
        timeline1_text: "9+ years working on large industrial sites. Developing systems thinking, working with complex documentation, and managing processes.",
        timeline2_title: "Process Automation",
        timeline2_date: "2020 - 2023",
        timeline2_text: "Started automating routine engineering tasks using Python, Excel, and VBA. Discovered the world of programming.",
        timeline3_title: "Transition to Development",
        timeline3_date: "2024",
        timeline3_text: "Conscious transition to professional development. Deep study of Go, PostgreSQL, Docker, and microservice architecture.",
        timeline4_title: "Backend & Full Stack Developer",
        timeline4_date: "2024 - present",
        timeline4_text: "Development of commercial Full Stack projects. Independent backend creation in Go and frontend support. Implementation of gRPC, Kafka, CI/CD, and monitoring.",
        terminal_title: "Interactive Terminal",
        terminal_subtitle: "Type a command and press Enter. Try: go version, ls, whoami, help, clear",
        terminal_welcome: "Welcome! Type 'help' for a list of available commands.",
        code_title: "Code Example",
        code_subtitle: "Kafka Consumer with retry logic and graceful shutdown from Report Service",
        code_language: "Go • Kafka • Concurrency",
        code_copy: "Copy",
        code_copied: "Copied!",
        contacts_title: "Contacts",
        contacts_text: "Open to job offers, interesting projects, and professional networking.",
        contacts_github: "GitHub",
        contacts_email: "Send Email",
        contacts_telegram: "Telegram",
        footer_text: "© 2026 TheBrickVitalik. Backend & Full Stack Developer (Go). Crafted with attention to detail.",
        scroll_top: "Top",
        cmd_help: "Available commands: <br> - <span style='color:#27c93f'>go version</span>: show Go version<br> - <span style='color:#27c93f'>ls</span>: list projects<br> - <span style='color:#27c93f'>whoami</span>: info about me<br> - <span style='color:#27c93f'>clear</span>: clear terminal<br> - <span style='color:#27c93f'>contact</span>: my contacts",
        cmd_go_version: "go version go1.22.0 linux/amd64",
        cmd_ls: "resale-platform/  task-manager/  report-service/  english-teacher-bot/",
        cmd_whoami: "Vitaliy (TheBrickVitalik). Backend & Full Stack Developer. 9+ years in engineering, passionate about building reliable distributed systems and full-featured web applications.",
        cmd_contact: "Email: kakocuk1@mail.ru | Telegram: @TheBrickVitalik | GitHub: github.com/kakocuk1",
        cmd_not_found: "bash: {cmd}: command not found. Type 'help' for help.",
        cv_message: "Hi, I saw your portfolio website, please send me your resume",
        page_title: "Portfolio | TheBrickVitalik, Backend & Full Stack Developer"
    }
};

let currentLang = localStorage.getItem('lang') || 'ru';

function updateCVLinks(lang) {
    const message = translations[lang].cv_message;
    const encoded = encodeURIComponent(message);
    const url = `https://t.me/TheBrickVitalik?text=${encoded}`;
    
    document.querySelectorAll('.cv-link').forEach(link => {
        link.href = url;
    });
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    
    // Обновляем все элементы с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key] !== undefined) {
            el.textContent = translations[lang][key];
        }
    });
    
    // Особый случай: заголовок Hero с typing-эффектом
    const typingSpan = document.querySelector('.typing-text');
    const titleStart = document.querySelector('.hero-title [data-i18n="hero_title_start"]');
    
    if (typingSpan) {
        typingSpan.setAttribute('data-text', translations[lang].hero_typing_name);
        startTypingEffect(typingSpan);
    }
    
    // Обновляем кнопку языка
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.textContent = lang === 'ru' ? 'EN' : 'RU';
    }
    
    // Обновляем заголовок страницы
    document.title = translations[lang].page_title;
    
    // Обновляем ссылки CV
    updateCVLinks(lang);
    
    // Обновляем атрибут lang у html
    document.documentElement.lang = lang;
}

// Обработчик кнопки переключения языка
const langToggle = document.getElementById('lang-toggle');
if (langToggle) {
    langToggle.addEventListener('click', () => {
        const newLang = currentLang === 'ru' ? 'en' : 'ru';
        setLanguage(newLang);
    });
}

// Применяем язык при загрузке
setLanguage(currentLang);