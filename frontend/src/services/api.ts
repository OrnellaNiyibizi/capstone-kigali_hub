import axios from 'axios';
import { addToStore, getAllFromStore, getFromStore } from './indexedDBService';

// Create a flag to track online status
let isOnline = navigator.onLine;

// Listen for online/offline events
window.addEventListener('online', () => {
  isOnline = true;
  console.log('Back online');
});

window.addEventListener('offline', () => {
  isOnline = false;
  console.log('Offline mode activated');
});

const getBaseUrl = () => {
  if (import.meta.env.NODE_ENV === 'development') {
    return '';
  }
  return import.meta.env.VITE_API_URL || '';
};

// Create an axios instance with the appropriate base URL
const api = axios.create({
  baseURL: getBaseUrl(),
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
// Add to api.ts
api.interceptors.request.use(request => {
  console.log('Request:', request.method, request.url);
  return request;
});

// Response interceptor to handle offline scenarios
api.interceptors.response.use(
  (response) => {
    // If response is successful, store it in IndexedDB for offline use
    const url = response.config.url;
    if (url) {
      try {
        // For resources
        if (url.includes('/resources')) {
          if (Array.isArray(response.data)) {
            // Store individual resources
            response.data.forEach((resource) => {
              addToStore('resources', {
                ...resource,
                cachedAt: Date.now()
              });
            });
          } else if (response.data?._id) {
            // Store single resource
            addToStore('resources', {
              ...response.data,
              cachedAt: Date.now()
            });
          }
        }

        // For discussions
        if (url.includes('/discussions')) {
          if (Array.isArray(response.data)) {
            response.data.forEach((discussion) => {
              addToStore('discussions', {
                ...discussion,
                cachedAt: Date.now()
              });
            });
          } else if (response.data?._id) {
            addToStore('discussions', {
              ...response.data,
              cachedAt: Date.now()
            });
          }
        }
      } catch (e) {
        console.warn('Failed to cache response:', e);
      }
    }
    return response;
  },
  async (error) => {
    const request = error.config;

    // If the error is due to network and we have cached data, return it
    if (!isOnline || (error.message && error.message.includes('Network Error'))) {
      try {
        let cachedData = null;
        const url = request.url || '';

        // For resources endpoint
        if (url.includes('/resources')) {
          if (url.includes('/resources/') && url.split('/').length > 2) {
            // Single resource request
            const resourceId = url.split('/').pop();
            cachedData = await getFromStore('resources', resourceId);
          } else {
            // All resources request
            cachedData = await getAllFromStore('resources');
          }
        }

        // For discussions endpoint
        if (url.includes('/discussions')) {
          if (url.includes('/discussions/') && url.split('/').length > 2) {
            // Single discussion request
            const discussionId = url.split('/').pop();
            cachedData = await getFromStore('discussions', discussionId);
          } else {
            // All discussions request
            cachedData = await getAllFromStore('discussions');
          }
        }

        if (cachedData) {
          // Show offline indicator
          window.dispatchEvent(new CustomEvent('app-offline', {
            detail: { usingCache: true }
          }));

          return Promise.resolve({
            ...error.response,
            status: 200,
            data: cachedData,
            headers: request.headers,
            config: request,
            fromCache: true
          });
        }
      } catch (e) {
        console.error('Failed to retrieve cached data:', e);
      }
    }

    return Promise.reject(error);
  }
);

export default api;