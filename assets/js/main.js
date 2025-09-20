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

  var prettifyLang = function (lang) {
    if (!lang) return '';
    var normalized = lang.toLowerCase();
    var map = {
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
    return normalized.replace(/\b\w+/g, function (part) {
      return part.charAt(0).toUpperCase() + part.slice(1);
    }).replace(/\+/g, '+').replace(/#/g, '#').replace(/-/g, ' ');
  };

  document.querySelectorAll('.highlight, .highlighter-rouge').forEach(function (block) {
    var pre = block.querySelector('pre');
    if (!pre) return;
    var lang = (pre.className || '').match(/language-([\w#+-]+)/i);
    if (!lang && block.className) {
      lang = block.className.match(/language-([\w#+-]+)/i);
    }
    if (lang && lang[1]) {
      block.setAttribute('data-lang', prettifyLang(lang[1]));
    }
  });
})();
