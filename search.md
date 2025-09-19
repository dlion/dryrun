---
layout: default
title: Search
permalink: /search/
---

# Search

<input id="q" type="search" placeholder="Search posts…" autofocus style="width:100%;padding:.6rem;border:1px solid var(--border);border-radius:6px">

<ul id="results"></ul>

<script>
(async function(){
  const q = document.getElementById('q');
  const out = document.getElementById('results');
  const data = await fetch('{{ "/search.json" | relative_url }}').then(r=>r.json());

  const render = (items) => {
    out.innerHTML = items.map(p => `
      <li style="margin:1rem 0">
        <a href="${p.url}"><strong>${p.title}</strong></a>
        <div class="meta">${p.date} ${p.tags?.length? '· ' + p.tags.map(t=>`<span class="tag">#${t}</span>`).join(' ') : ''}</div>
        <div>${p.description}</div>
      </li>
    `).join('') || '<li style="margin:1rem 0;color:var(--muted)">No results.</li>';
  };

  const search = (needle) => {
    const terms = needle.toLowerCase().split(/\s+/).filter(Boolean);
    if(!terms.length) return data.slice(0,10);
    return data.filter(p => {
      const hay = (p.title + ' ' + p.description + ' ' + p.content + ' ' + (p.tags||[]).join(' ')).toLowerCase();
      return terms.every(t => hay.includes(t));
    }).slice(0,30);
  };

  q.addEventListener('input', () => render(search(q.value)));
  render(search(''));
})();
</script>