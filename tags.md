---
layout: default
title: Tags
permalink: /tags/
---

<section class="tags-page">
  <header class="tags-hero">
    <h1>Tags</h1>
  </header>

  <nav class="tag-chips" aria-label="Tags">
    {% assign sorted = site.tags | sort %}
    <a class="tag-chip is-active" data-tag="all" href="#all">All</a>
    {% for tag in sorted %}
      {% assign name = tag[0] %}
      {% assign posts = tag[1] | sort: 'date' | reverse %}
      {% assign count = posts | size %}
      <a class="tag-chip" data-tag="{{ name | slugify }}" href="#{{ name | slugify }}">#{{ name }} <span class="count">{{ count }}</span></a>
    {% endfor %}
  </nav>

  <div class="tags-sections">
    {% for tag in sorted %}
      {% assign name = tag[0] %}
      {% assign posts = tag[1] | sort: 'date' | reverse %}
      <section id="{{ name | slugify }}" class="tag-section" data-tag="{{ name | slugify }}">
        <h2>#{{ name }}</h2>
        <ul class="tag-posts">
          {% for post in posts %}
            <li>
              <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
              <span class="meta">· {{ post.date | date: "%d %b %Y" }}</span>
            </li>
          {% endfor %}
        </ul>
      </section>
    {% endfor %}
  </div>
</section>
