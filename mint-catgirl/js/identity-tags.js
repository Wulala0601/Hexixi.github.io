(() => {
  const tags = document.querySelector('.identity-tags');
  if (!tags) return;
  const heading = tags.closest('.identity-heading');
  const setOpen = open => {
    heading.classList.toggle('is-open', open);
    tags.setAttribute('aria-expanded', String(open));
    tags.setAttribute('aria-label', `${open ? '收起' : '展开'}身份标签：ANIME、TATTOO、ENFP、GEMINI、IP CREATOR、DREAMCORE`);
  };
  // The heading includes a generous approach area and the unfolded cards.
  heading.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') setOpen(true);
  });
  heading.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') setOpen(false);
  });
  tags.addEventListener('click', () => setOpen(tags.getAttribute('aria-expanded') !== 'true'));
  tags.addEventListener('keydown', event => {
    if (event.key === 'Escape') setOpen(false);
  });
  heading.addEventListener('focusout', event => {
    if (!heading.contains(event.relatedTarget)) setOpen(false);
  });
  document.addEventListener('pointerdown', event => {
    if (!heading.contains(event.target)) setOpen(false);
  });
})();
