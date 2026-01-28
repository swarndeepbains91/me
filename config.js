// Configuration for API endpoints
const CONFIG = {
    // Auto-detect API base URL
    getApiUrl: function() {
        try {
            const hostname = window.location.hostname;
            const protocol = window.location.protocol;
            const port = window.location.port;
            
            console.log('Detecting API URL:', { hostname, protocol, port });
            
            // Local development detection
            if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
                const localPort = port || '3000';
                const localUrl = `${protocol}//${hostname}:${localPort}`;
                console.log('Local development detected:', localUrl);
                return localUrl;
            } else {
                // Production deployment - use current origin
                const prodUrl = window.location.origin;
                console.log('Production deployment detected:', prodUrl);
                return prodUrl;
            }
        } catch (error) {
            console.error('Error detecting API URL:', error);
            // Fallback to current origin
            return window.location.origin;
        }
    },
    
    // Get full API endpoint URLs with validation
    endpoints: {
        upload: function() { 
            const baseUrl = CONFIG.getApiUrl();
            const url = baseUrl + '/api/upload';
            console.log('Upload endpoint:', url);
            return url;
        },
        uploadMultiple: function() { 
            const baseUrl = CONFIG.getApiUrl();
            const url = baseUrl + '/api/upload/multiple';
            console.log('Upload multiple endpoint:', url);
            return url;
        },
        files: function() { 
            const baseUrl = CONFIG.getApiUrl();
            const url = baseUrl + '/api/files';
            console.log('Files endpoint:', url);
            return url;
        },
        deleteFile: function(filename) { 
            const baseUrl = CONFIG.getApiUrl();
            const url = baseUrl + '/api/files/' + encodeURIComponent(filename);
            console.log('Delete file endpoint:', url);
            return url;
        }
    },
    
    // Test API connectivity
    testConnection: async function() {
        try {
            const baseUrl = CONFIG.getApiUrl();
            console.log('Testing API connection to:', baseUrl);
            
            const response = await fetch(baseUrl + '/', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('API connection successful:', data);
                return { success: true, data };
            } else {
                console.error('API connection failed:', response.status, response.statusText);
                return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
            }
        } catch (error) {
            console.error('API connection error:', error);
            return { success: false, error: error.message };
        }
    }
};

// Make config available globally
window.APP_CONFIG = CONFIG;

// Test connection on load
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Testing API connection...');
    const result = await CONFIG.testConnection();
    if (!result.success) {
        console.warn('API connection test failed:', result.error);
    }
});