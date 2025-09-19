---
title: "Something to say"
description: "Random desc"
hn_url: "https://news.ycombinator.com/item?id=XXXXXX"
cover: /assets/images/covers/generics.svg
---

This is a fresh start. I’ll write short, practical posts about:

- Go and distributed systems  
- Pragmatic engineering practices  
- Infra, tooling, and debugging notes

Expect hands-on examples, fewer buzzwords, and trade-offs called out explicitly.

<div class="video">
  <iframe src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen></iframe>
</div>


> **Heads up**  
> Avoid `io.Copy` without a timeout here.
{: .callout .warn}


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
