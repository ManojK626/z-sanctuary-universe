export function getPartnerLink(profile) {
  const brand = String(profile?.brand || '').toLowerCase();
  const routes = {
    apple: 'https://www.apple.com',
    samsung: 'https://www.samsung.com',
    google: 'https://store.google.com',
    microsoft: 'https://www.microsoft.com',
  };
  return (
    routes[brand] ||
    `https://www.google.com/search?q=${encodeURIComponent(`${profile?.brand || ''} official store`)}`
  );
}
