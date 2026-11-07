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
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
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


// 2. Эффект печатной машинки для заголовка
const typingElement = document.querySelector('.typing-text');
const textToType = typingElement.getAttribute('data-text');
let charIndex = 0;

function typeText() {
    if (charIndex < textToType.length) {
        typingElement.textContent += textToType.charAt(charIndex);
        charIndex++;
        setTimeout(typeText, 150);
    }
}

setTimeout(typeText, 500);


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

const commands = {
    'help': 'Доступные команды: <br> - <span style="color:#27c93f">go version</span>: показать версию Go<br> - <span style="color:#27c93f">ls</span>: список проектов<br> - <span style="color:#27c93f">whoami</span>: информация обо мне<br> - <span style="color:#27c93f">clear</span>: очистить терминал<br> - <span style="color:#27c93f">contact</span>: мои контакты',
    'go version': 'go version go1.22.0 linux/amd64',
    'ls': 'resale-platform/  task-manager/  report-service/  english-teacher-bot/',
    'whoami': 'Виталий (TheBrickVitalik). Backend & Full Stack Developer. 9+ лет в инженерии, увлечен созданием надежных распределенных систем и полноценных веб-приложений.',
    'contact': 'Email: kakocuk1@mail.ru | Telegram: @TheBrickVitalik | GitHub: github.com/kakocuk1',
    'clear': 'CLEAR'
};

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const cmd = terminalInput.value.trim().toLowerCase();
        
        const cmdLine = document.createElement('div');
        cmdLine.className = 'terminal-line';
        cmdLine.innerHTML = `<span class="terminal-prompt">vitaliy@portfolio:~$</span> <span class="terminal-text">${terminalInput.value}</span>`;
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
            errorLine.innerHTML = `<span class="terminal-text" style="color:#ff5f56">bash: ${cmd}: command not found. Введите 'help' для справки.</span>`;
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

// Запускаем автодемонстрацию, когда терминал появляется на экране
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
        const originalText = copyBtn.innerText;
        copyBtn.innerText = 'Скопировано!';
        copyBtn.style.background = '#27c93f';
        setTimeout(() => {
            copyBtn.innerText = originalText;
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