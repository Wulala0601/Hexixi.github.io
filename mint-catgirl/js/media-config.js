window.MINT_MEDIA_BASE = window.MINT_MEDIA_BASE || 'https://your-cloud.example.com/mint-catgirl/assets';

window.resolveMediaUrl = function (path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const base = window.MINT_MEDIA_BASE || '';
  if (!base) return path;
  const normalized = String(path).replace(/^\.?\/?/, '').replace(/^\//, '');
  return `${base.replace(/\/$/, '')}/${normalized}`;
};
