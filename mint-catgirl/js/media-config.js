window.MINT_MEDIA_BASE = window.MINT_MEDIA_BASE || '';

window.resolveMediaUrl = function (path) {
  if (!path) return path;
  const normalizedPath = String(path).replace(/\\/g, '/');
  if (/^https?:\/\//i.test(normalizedPath) || /^data:/i.test(normalizedPath) || /^blob:/i.test(normalizedPath) || /^\/\//.test(normalizedPath)) return normalizedPath;
  const base = (window.MINT_MEDIA_BASE || '').replace(/\\/g, '/').replace(/\/+$/, '');
  if (!base) return normalizedPath;
  const normalized = normalizedPath.replace(/^\.?\/?/, '').replace(/^\/+/, '');
  return `${base}/${normalized}`;
};
