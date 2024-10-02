var username = localStorage.getItem("username") || "hasan"

var API_BASE_URL = "https://rapidtask.pythonanywhere.com/api"

function apiFetch(path) {
    let username = null;
    let method = 'GET';
    let body = null;
    let headers = {};
    let queryParams = {};

    // Helper function to build query string
    function buildQuery(params) {
        const query = new URLSearchParams(params).toString();
        return query ? `?${query}` : '';
    }

    return {
        as(_username) {
            username = _username;
            queryParams['auth'] = username;  // Add auth query param
            return this;
        },
        query(key, value) {
            queryParams[key] = value;  // Add custom query params
            return this;
        },
        method(httpMethod) {
            method = httpMethod;
            return this;
        },
        body(data) {
            body = JSON.stringify(data);  // Convert the body to JSON if needed
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
                    'Content-Type': 'application/json',  // Default header, customize if needed
                    ...headers
                },
                body: method !== 'GET' ? body : null  // Only set body if the method is not GET
            })
            .then(response => response.json())
            .then(resolve)
            .catch(reject);
        }
    };
}


function switchUsername(){
  
}
