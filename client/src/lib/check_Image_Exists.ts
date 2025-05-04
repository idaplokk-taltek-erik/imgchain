export const checkImageExists = async (hash) => {
  const extensions = ['webp', 'jpg'];
  for (const ext of extensions) {
    const url = `/uploads/${hash}.${ext}`;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) {
        return url;
      }
    } catch (err) {
      console.error(`Failed to check image ${url}:`, err);
    }
  }
  return null;
};
