// Configuration for API endpoints
const CONFIG = {
    // Auto-detect API base URL
    getApiUrl: function() {
        // Check if we're on a deployed domain
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            // Local development
            return `http://${hostname}:${window.location.port || 3000}`;
        } else {
            // Production deployment - use current domain
            return window.location.origin;
        }
    },
    
    // Get full API endpoint URLs
    endpoints: {
        upload: function() { return CONFIG.getApiUrl() + '/api/upload'; },
        uploadMultiple: function() { return CONFIG.getApiUrl() + '/api/upload/multiple'; },
        files: function() { return CONFIG.getApiUrl() + '/api/files'; },
        deleteFile: function(filename) { return CONFIG.getApiUrl() + '/api/files/' + filename; }
    }
};

// Make config available globally
window.APP_CONFIG = CONFIG;