/** Resolve public media from either localhost or a GitHub Pages project path. */
export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
