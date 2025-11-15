self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Gelecekte cache ve push işlevleri eklenecek
});

// Placeholder push event (backend ve abonelik eklenmeden çalışmaz)
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: 'Bildirim', body: 'İçerik yok' };
  event.waitUntil(
    self.registration.showNotification(data.title || 'Bildirim', {
      body: data.body || '',
      icon: 'image/skinn-logo.png'
    })
  );
});