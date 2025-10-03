// コピー機能
function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code').textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        button.textContent = '✓ Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = 'Copy';
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('コピー失敗:', err);
        button.textContent = '✗ Failed';
    });
}

// 動的置き換え機能
function setupReplacements() {
    const inputs = document.querySelectorAll('.replace-input');
    
    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const placeholder = e.target.dataset.placeholder;
            const value = e.target.value || placeholder;
            
            const codeElements = document.querySelectorAll('code');
            codeElements.forEach(code => {
                const originalText = code.dataset.original || code.textContent;
                if (!code.dataset.original) {
                    code.dataset.original = originalText;
                }
                
                const regex = new RegExp(`\\{${placeholder}\\}`, 'g');
                code.textContent = code.dataset.original.replace(regex, value);
            });
        });
    });
}

// 🆕 スムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 🆕 トップに戻るボタン
function createBackToTop() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'back-to-top';
    button.style.display = 'none';
    document.body.appendChild(button);
    
    // スクロール時の表示/非表示
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.display = 'flex';
        } else {
            button.style.display = 'none';
        }
    });
    
    // クリック時にトップへ
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 🆕 ダークモード切り替え
function createThemeToggle() {
    const toggle = document.createElement('button');
    toggle.innerHTML = '🌙';
    toggle.className = 'theme-toggle';
    toggle.title = 'ダークモード切り替え';
    document.body.appendChild(toggle);
    
    // 保存されたテーマを読み込み
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    updateToggleIcon(toggle, savedTheme);
    
    toggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleIcon(toggle, newTheme);
    });
}

function updateToggleIcon(button, theme) {
    button.innerHTML = theme === 'dark' ? '☀️' : '🌙';
}

// 🆕 検索機能
function createSearchBox() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" class="search-input" placeholder="🔍 ページ内を検索...">
        <div class="search-results"></div>
    `;
    
    const header = document.querySelector('header');
    if (header) {
        header.appendChild(searchContainer);
        
        const searchInput = searchContainer.querySelector('.search-input');
        const resultsDiv = searchContainer.querySelector('.search-results');
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            resultsDiv.innerHTML = '';
            
            if (query.length < 2) {
                resultsDiv.style.display = 'none';
                return;
            }
            
            // すべてのセクションから検索
            const sections = document.querySelectorAll('section');
            let found = false;
            
            sections.forEach(section => {
                const text = section.textContent.toLowerCase();
                if (text.includes(query)) {
                    const h2 = section.querySelector('h2');
                    if (h2) {
                        const result = document.createElement('div');
                        result.className = 'search-result-item';
                        result.textContent = h2.textContent;
                        result.addEventListener('click', () => {
                            section.scrollIntoView({ behavior: 'smooth' });
                            resultsDiv.style.display = 'none';
                            searchInput.value = '';
                        });
                        resultsDiv.appendChild(result);
                        found = true;
                    }
                }
            });
            
            resultsDiv.style.display = found ? 'block' : 'none';
        });
        
        // 外側クリックで検索結果を閉じる
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                resultsDiv.style.display = 'none';
            }
        });
    }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
    setupReplacements();
    createBackToTop();
    createThemeToggle();
    createSearchBox();
    
    // すべてのコードブロックに元のテキストを保存
    document.querySelectorAll('code').forEach(code => {
        code.dataset.original = code.textContent;
    });
});
