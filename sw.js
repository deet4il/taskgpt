const CACHE_NAME =
  'poketask-v1';

const urlsToCache = [

  './',
  './index.html',

  './css/styles.css',

  './js/main.js',
  './js/api.js',
  './js/config.js',
  './js/state.js',
  './js/storage.js',

  './js/features/tasks.js',
  './js/features/battle.js',

  './js/ui/dom.js',
  './js/ui/render.js'

];

/* INSTALL */

self.addEventListener(
  'install',
  event => {

    event.waitUntil(

      caches.open(
        CACHE_NAME
      ).then(cache => {

        return cache.addAll(
          urlsToCache
        );

      })

    );

  }
);

/* FETCH */

self.addEventListener(
  'fetch',
  event => {

    event.respondWith(

      caches.match(
        event.request
      ).then(response => {

        return (

          response ||

          fetch(event.request)

        );

      })

    );

  }
);