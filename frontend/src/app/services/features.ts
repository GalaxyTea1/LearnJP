// Translation needs a supported provider and bounded/cancellable OCR before beta release.
export const translationEnabled = import.meta.env.MODE !== 'cloudflare';
