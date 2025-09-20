// Optional: add anchor links to headings and smooth-scroll on hash links
(function () {
  const headings = document.querySelectorAll('.post-content h2, .post-content h3');
  headings.forEach(function (h) {
    if (!h.id) {
      h.id = h.textContent.trim().toLowerCase().replace(/[^\w]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.className = 'anchor';
    a.innerText = '¶';
    h.appendChild(a);
  });

  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.pushState(null, '', '#' + id);
    }
  });

  const prettifyLang = function (lang) {
    if (!lang) return '';
    const normalized = lang.toLowerCase();
    const map = {
      js: 'JS', javascript: 'JS', jsx: 'JSX',
      ts: 'TS', typescript: 'TS', tsx: 'TSX',
      go: 'Go', golang: 'Go',
      py: 'Python', python: 'Python',
      rb: 'Ruby', ruby: 'Ruby',
      rs: 'Rust', rust: 'Rust',
      java: 'Java', kotlin: 'Kotlin', swift: 'Swift',
      php: 'PHP',
      c: 'C', cpp: 'C++', cxx: 'C++', 'c++': 'C++',
      cs: 'C#', csharp: 'C#', 'c#': 'C#',
      objc: 'Obj-C', objectivec: 'Obj-C',
      scala: 'Scala',
      bash: 'Bash', sh: 'Shell', shell: 'Shell', zsh: 'Zsh', fish: 'Fish',
      sql: 'SQL', yaml: 'YAML', yml: 'YAML', json: 'JSON', toml: 'TOML', ini: 'INI',
      dockerfile: 'Docker', make: 'Make', makefile: 'Make',
      diff: 'Diff', html: 'HTML', xml: 'XML', css: 'CSS', scss: 'SCSS', sass: 'Sass',
      plaintext: 'Text', text: 'Text'
    };
    if (map[normalized]) return map[normalized];
    return normalized.replace(/\b\w/g, function (ch) {
      return ch.toUpperCase();
    }).replace(/-/g, ' ');
  };

  document.querySelectorAll('.highlighter-rouge').forEach(function (block) {
    const pre = block.querySelector('pre');
    let match = pre && pre.className && pre.className.match(/language-([\w#+-]+)/i);
    if (!match && block.className) {
      match = block.className.match(/language-([\w#+-]+)/i);
    }
    const langName = match && match[1] ? prettifyLang(match[1]) : '';
    if (langName) {
      block.setAttribute('data-lang', langName);
    }

    if (block.dataset.toolbar === 'ready') return;

    const highlight = block.querySelector('.highlight');
    if (!highlight) return;

    const toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';

    const meta = document.createElement('div');
    meta.className = 'code-meta';

    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'code-toggle';
    toggleButton.setAttribute('aria-expanded', 'true');
    toggleButton.setAttribute('aria-label', 'Collapse code');
    toggleButton.innerHTML = '<svg viewBox="0 0 12 8" aria-hidden="true"><polyline points="1 1 6 7 11 1"></polyline></svg>';

    const langLabel = document.createElement('span');
    langLabel.className = 'code-lang';
    langLabel.textContent = langName || 'Code';

    meta.appendChild(toggleButton);
    meta.appendChild(langLabel);

    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.className = 'code-copy';
    copyButton.dataset.label = 'Copy';
    copyButton.setAttribute('aria-label', 'Copy code');

    const copyIconWrapper = document.createElement('span');
    copyIconWrapper.className = 'code-copy-icon';
    copyIconWrapper.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="7" y="7" width="9" height="9" rx="2"></rect><path d="M4 13V5a2 2 0 0 1 2-2h8"/></svg>';

    const copySrText = document.createElement('span');
    copySrText.className = 'visually-hidden';
    copySrText.textContent = 'Copy code';

    copyButton.appendChild(copyIconWrapper);
    copyButton.appendChild(copySrText);

    toolbar.appendChild(meta);
    toolbar.appendChild(copyButton);

    block.insertBefore(toolbar, highlight);

    const updateCollapsedState = function (collapsed) {
      block.classList.toggle('is-collapsed', collapsed);
      toggleButton.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      toggleButton.setAttribute('aria-label', collapsed ? 'Expand code' : 'Collapse code');
      if (highlight) {
        highlight.setAttribute('aria-hidden', collapsed ? 'true' : 'false');
      }
    };

    updateCollapsedState(false);

    const resetCopyState = function () {
      copyButton.dataset.label = 'Copy';
      copyButton.classList.remove('copied');
      copyButton.setAttribute('aria-label', 'Copy code');
    };

    copyButton.addEventListener('click', function () {
      const codeElement = block.querySelector('pre code') || block.querySelector('pre');
      if (!codeElement) return;
      const text = codeElement.innerText;
      const finish = function (success) {
        if (!success) return;
        copyButton.dataset.label = 'Copied';
        copyButton.classList.add('copied');
        copyButton.setAttribute('aria-label', 'Code copied');
        setTimeout(resetCopyState, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          finish(true);
        }).catch(function () {
          finish(false);
        });
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        const selected = document.getSelection && document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : null;
        textarea.select();
        try {
          const successful = document.execCommand('copy');
          finish(successful);
        } catch (err) {
          finish(false);
        }
        document.body.removeChild(textarea);
        if (selected) {
          const selection = document.getSelection();
          selection.removeAllRanges();
          selection.addRange(selected);
        }
      }
    });

    toggleButton.addEventListener('click', function () {
      const collapsed = block.classList.contains('is-collapsed');
      updateCollapsedState(!collapsed);
    });

    block.dataset.toolbar = 'ready';
  });

})();
