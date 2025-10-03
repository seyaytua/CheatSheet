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
            
            // すべてのコードブロック内のプレースホルダーを置き換え
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

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
    setupReplacements();
    
    // すべてのコードブロックに元のテキストを保存
    document.querySelectorAll('code').forEach(code => {
        code.dataset.original = code.textContent;
    });
});
