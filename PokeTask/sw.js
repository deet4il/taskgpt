const CACHE_NAME = 'poketask-v1';

const FILES_TO_CACHE = [

  './',
  './index.html',

  './css/styles.css',

  './js/main.js',
  './js/api.js',
  './js/config.js',
  './js/state.js',
  './js/storage.js',

  './js/features/tasks.js',

  './js/ui/dom.js',
  './js/ui/render.js'

];

/* INSTALL */

self.addEventListener(
  'install',
  event => {

    event.waitUntil(

      caches.open(CACHE_NAME)
        .then(cache => {

          return cache.addAll(
            FILES_TO_CACHE
          );

        })

    );

  }
);

/* ACTIVATE */

self.addEventListener(
  'activate',
  event => {

    event.waitUntil(

      caches.keys()
        .then(keys => {

          return Promise.all(

            keys.map(key => {

              if (key !== CACHE_NAME) {

                return caches.delete(key);

              }

            })

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

      caches.match(event.request)
        .then(response => {

          return (
            response ||
            fetch(event.request)
          );

        })

    );

  }
);