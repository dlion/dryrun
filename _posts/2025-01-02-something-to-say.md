---
title: "Something to say"
description: "Random desc"
hn_url: "https://news.ycombinator.com/item?id=XXXXXX"
reddit_url: "https://www.reddit.com/r/…"
cover: https://domenicoluciani.com/assets/images/covers/go_generics.jpg
---

This is a fresh start. I’ll write short, practical posts about:

- Go and distributed systems  
- Pragmatic engineering practices  
- Infra, tooling, and debugging notes

Expect hands-on examples, fewer buzzwords, and trade-offs called out explicitly.

![A short caption describing the image](/assets/images/xyz.webp)

<figure>
  <img src="/assets/images/xyz.webp" alt="Alt text" loading="lazy" decoding="async">
  <figcaption>Concise caption with context.</figcaption>
</figure>

<div class="video">
  <iframe src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen></iframe>
</div>


> **Heads up**  
> Avoid `io.Copy` without a timeout here.
{: .callout .warn}


<figure>
  <img src="/assets/images/x.webp" alt="..." />
  <figcaption>How requests flow through the resolver.</figcaption>
</figure>


```js
window.onload = () => {
  const director = new Director('gameCanvas');
  const pet = new Pet(window.STATE.IDLE);

  director.bg.onload = () => {
    const game = new Game(director, pet);
    game.loop();
  };
};
```

