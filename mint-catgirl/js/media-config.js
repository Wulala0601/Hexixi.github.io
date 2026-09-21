window.MINT_MEDIA_BASE = window.MINT_MEDIA_BASE || '';

window.resolveMediaUrl = function (path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path) || /^data:/i.test(path) || /^blob:/i.test(path) || /^\/\//.test(path)) return path;
  const base = window.MINT_MEDIA_BASE || '';
  if (!base) return String(path);
  const normalized = String(path).replace(/^\.?\/?/, '').replace(/^\//, '');
  return `${base.replace(/\/$/, '')}/${normalized}`;
};
