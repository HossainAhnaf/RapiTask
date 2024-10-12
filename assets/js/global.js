class Cache {
    static set(key, value, expiryInSeconds = null) {
        const expiryTimestamp = expiryInSeconds 
            ? Date.now() + expiryInSeconds * 1000 
            : null;

        const cacheItem = {
            value: value,
            expiry: expiryTimestamp
        };

        // Convert the cache item to a string before storing
        localStorage.setItem(key, JSON.stringify(cacheItem));
    }

    // Method to get a value from the cache
    static get(key) {
        const cacheItemStr = localStorage.getItem(key);

        // Return null if the cache item does not exist
        if (!cacheItemStr) {
            return null;
        }
            // Parse the cache item to get the original value and expiry
        const cacheItem = JSON.parse(cacheItemStr);

        // Check if the item is expired
        if (cacheItem.expiry && Date.now() > cacheItem.expiry) {
            Cache.delete(key); // Remove expired item
            return null; // Return null if the item is expired
        }

        return cacheItem.value; // Return the cached value if it is still valid
    }

    // Method to delete a value from the cache
    static delete(key) {
        localStorage.removeItem(key);
    }

    // Method to clear all items from the cache
    static clear() {
        localStorage.clear();
    }

    // Method to check if a key exists in the cache and is not expired
    static has(key) {
        const cacheItemStr = localStorage.getItem(key);

        if (!cacheItemStr) {
            return false;
        }

        try {
            const cacheItem = JSON.parse(cacheItemStr);
            return !cacheItem.expiry || Date.now() <= cacheItem.expiry;
        } catch (e) {
            // Handle parsing errors
            console.error('Error checking cache item:', e);
            return false;
        }
    }
}

var username = Cache.get("username") || "hasan"

var API_BASE_URL = "https://rapidtask.pythonanywhere.com/api"

function url(path = '/') {
  if (window.location.hostname.endsWith('github.io')) {
    path = '/RapiTask/' + path
  }
  window.location = path
}

function apiFetch(path) {
  let username = null;
  let method = 'GET';
  let body = null;
  let headers = {};
  let queryParams = {};

  // Helper function to build query string
  function buildQuery(params) {
    const query = new URLSearchParams(params).toString();
    return query ? `?${query}`: '';
  }

  return {
    as(_username) {
      username = _username;
      queryParams['auth'] = username; // Add auth query param
      return this;
    },
    query(key, value) {
      queryParams[key] = value; // Add custom query params
      return this;
    },
    method(httpMethod) {
      method = httpMethod;
      return this;
    },
    body(data) {
      body = JSON.stringify(data); // Convert the body to JSON if needed
      return this;
    },
    setHeader(key, value) {
      headers[key] = value;
      return this;
    },
    then(resolve, reject) {
      // Build final URL with query params
      const url = `${API_BASE_URL}/${path}/${buildQuery(queryParams)}`;
      fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json', // Default header, customize if needed
          ...headers
        },
        body: method !== 'GET' ? body: null // Only set body if the method is not GET
      })
      .then(response => {
        if (response.status === 204 || response.headers.get('content-length') === '0') {
          return {}; // or return null, depending on your case
        }
        return response.json(); // Otherwise, parse as JSON
      })
      .then(resolve)
      .catch(reject);
    }
  };
}

function debounce(func, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}


// https://rapidtask.pythonanywhere.com/admin/login/?next=/admin/level_titles/leveltitle/
// https://rapidtask.pythonanywhere.com/admin/login/?next=/admin/difficulties/difficulty/
