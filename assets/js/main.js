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

  document.querySelectorAll('.highlight').forEach(function (block) {
    var pre = block.querySelector('pre');
    if (!pre) return;
    var lang = block.dataset.lang;
    if (!lang) {
      var match = pre.className && pre.className.match(/language-([a-z0-9#+-]+)/i);
      if (match) {
        lang = match[1].toUpperCase();
      }
    }
    if (!lang) return;
    block.setAttribute('data-lang', lang);
    pre.setAttribute('data-lang', lang);
  });
})();
