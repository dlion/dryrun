---
layout: default
title: Tags
permalink: /tags/
---

# Tags

{% assign sorted = site.tags | sort %}
{% for tag in sorted %}
  {% assign name = tag[0] %}
  {% assign posts = tag[1] | sort: 'date' | reverse %}
  <h2 id="{{ name | slugify }}">#{{ name }}</h2>
  <ul>
  {% for post in posts %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      <span class="meta">· {{ post.date | date: "%d %b %Y" }}</span>
    </li>
  {% endfor %}
  </ul>
{% endfor %}
