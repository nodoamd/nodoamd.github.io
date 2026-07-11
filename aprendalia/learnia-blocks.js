/** Aprendalia — bloques editoriales para lecciones */
(function (global) {
  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderBlock(block, index) {
    if (!block || !block.type) return '';

    const delay = index * 0.06;
    const anim = `data-block-animate style="--block-delay:${delay}s"`;

    switch (block.type) {
      case 'quote':
        return `<blockquote class="lesson-quote" ${anim}>
          <p class="lesson-quote__text">«${escapeHtml(block.text)}»</p>
          ${block.author ? `<footer class="lesson-quote__author">— ${escapeHtml(block.author)}${block.source ? `, <em>${escapeHtml(block.source)}</em>` : ''}</footer>` : ''}
        </blockquote>`;

      case 'image':
        return `<figure class="lesson-figure" ${anim}>
          <img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt || '')}" loading="lazy" class="lesson-figure__img">
          ${block.caption ? `<figcaption class="lesson-figure__caption">${escapeHtml(block.caption)}</figcaption>` : ''}
        </figure>`;

      case 'keydate':
        return `<div class="lesson-keydate" ${anim}>
          <span class="lesson-keydate__date">${escapeHtml(block.date)}</span>
          <div class="lesson-keydate__body">
            <strong class="lesson-keydate__title">${escapeHtml(block.title)}</strong>
            <p class="lesson-keydate__text">${escapeHtml(block.text)}</p>
          </div>
        </div>`;

      case 'timeline':
        if (!block.events || !block.events.length) return '';
        const items = block.events
          .map(
            (ev) => `<li class="lesson-timeline__item">
              <span class="lesson-timeline__date">${escapeHtml(ev.date)}</span>
              <div class="lesson-timeline__content">
                <strong>${escapeHtml(ev.title)}</strong>
                ${ev.text ? `<p>${escapeHtml(ev.text)}</p>` : ''}
              </div>
            </li>`
          )
          .join('');
        return `<div class="lesson-timeline" ${anim}>
          ${block.title ? `<p class="lesson-timeline__heading">${escapeHtml(block.title)}</p>` : ''}
          <ol class="lesson-timeline__list">${items}</ol>
        </div>`;

      case 'tip':
        return `<div class="lesson-tip" ${anim}>${escapeHtml(block.text)}</div>`;

      case 'p':
      default:
        return `<p ${anim}>${escapeHtml(block.text || '')}</p>`;
    }
  }

  function renderBlocks(blocks) {
    if (!blocks || !blocks.length) return '';
    return blocks.map((b, i) => renderBlock(b, i)).join('');
  }

  global.LearniaBlocks = { renderBlocks, renderBlock, escapeHtml };
})(typeof window !== 'undefined' ? window : globalThis);
