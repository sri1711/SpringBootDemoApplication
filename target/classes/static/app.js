// Application State
const state = {
    apiCallCount: 0,
    healthCheckCount: 0,
    autoRefreshInterval: null,
    lastHealthStatus: null
};

// DOM Elements
const elements = {
    testApiBtn: document.getElementById('testApiBtn'),
    apiResponse: document.getElementById('apiResponse'),
    healthStatus: document.getElementById('healthStatus'),
    healthStatusText: document.getElementById('healthStatusText'),
    healthStatusDesc: document.getElementById('healthStatusDesc'),
    lastCheck: document.getElementById('lastCheck'),
    autoRefresh: document.getElementById('autoRefresh'),
    globalStatus: document.getElementById('globalStatus'),
    apiCallCount: document.getElementById('apiCallCount'),
    healthCheckCount: document.getElementById('healthCheckCount'),
    uptime: document.getElementById('uptime')
};

// Utility Functions
function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
}

function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

function updateStats() {
    elements.apiCallCount.textContent = state.apiCallCount;
    elements.healthCheckCount.textContent = state.healthCheckCount;
}

function updateGlobalStatus(isHealthy) {
    if (isHealthy) {
        elements.globalStatus.classList.add('healthy');
        elements.globalStatus.classList.remove('error');
        elements.globalStatus.querySelector('.status-text').textContent = 'All Systems Operational';
    } else {
        elements.globalStatus.classList.remove('healthy');
        elements.globalStatus.classList.add('error');
        elements.globalStatus.querySelector('.status-text').textContent = 'System Error';
    }
}

// API Functions
async function testApiEndpoint() {
    showLoading(elements.testApiBtn);
    
    try {
        const response = await fetch('/');
        const text = await response.text();
        
        state.apiCallCount++;
        updateStats();
        
        // Display response with animation
        elements.apiResponse.innerHTML = `
            <div class="response-content">
                <div style="font-size: 2rem; margin-bottom: 1rem;">✨</div>
                <div>${text}</div>
                <div style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-muted);">
                    Status: ${response.status} ${response.statusText}
                </div>
            </div>
        `;
        
        // Success animation
        elements.apiResponse.style.background = 'rgba(0, 242, 254, 0.1)';
        setTimeout(() => {
            elements.apiResponse.style.background = 'rgba(0, 0, 0, 0.2)';
        }, 1000);
        
    } catch (error) {
        console.error('API Error:', error);
        elements.apiResponse.innerHTML = `
            <div class="response-content" style="color: var(--error-color);">
                <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
                <div>Failed to fetch data</div>
                <div style="margin-top: 0.5rem; font-size: 0.875rem;">
                    ${error.message}
                </div>
            </div>
        `;
        
        elements.apiResponse.style.background = 'rgba(245, 87, 108, 0.1)';
        setTimeout(() => {
            elements.apiResponse.style.background = 'rgba(0, 0, 0, 0.2)';
        }, 1000);
    } finally {
        hideLoading(elements.testApiBtn);
    }
}

async function checkHealth() {
    try {
        const response = await fetch('/actuator/health');
        const data = await response.json();
        
        state.healthCheckCount++;
        state.lastHealthStatus = data.status;
        updateStats();
        
        const isHealthy = data.status === 'UP';
        
        // Update health indicator
        const pulseRing = elements.healthStatus.querySelector('.pulse-ring');
        const pulseDot = elements.healthStatus.querySelector('.pulse-dot');
        
        if (isHealthy) {
            pulseRing.style.borderColor = 'var(--success-color)';
            pulseDot.style.background = 'var(--success-color)';
            pulseDot.style.boxShadow = '0 0 20px var(--success-color)';
            elements.healthStatusText.textContent = 'System Healthy';
            elements.healthStatusText.style.color = 'var(--success-color)';
            elements.healthStatusDesc.textContent = 'All services are running normally';
        } else {
            pulseRing.style.borderColor = 'var(--error-color)';
            pulseDot.style.background = 'var(--error-color)';
            pulseDot.style.boxShadow = '0 0 20px var(--error-color)';
            elements.healthStatusText.textContent = 'System Down';
            elements.healthStatusText.style.color = 'var(--error-color)';
            elements.healthStatusDesc.textContent = 'Some services are not responding';
        }
        
        // Update last check time
        elements.lastCheck.textContent = formatTime(new Date());
        
        // Update global status
        updateGlobalStatus(isHealthy);
        
        return isHealthy;
        
    } catch (error) {
        console.error('Health Check Error:', error);
        
        const pulseRing = elements.healthStatus.querySelector('.pulse-ring');
        const pulseDot = elements.healthStatus.querySelector('.pulse-dot');
        
        pulseRing.style.borderColor = 'var(--error-color)';
        pulseDot.style.background = 'var(--error-color)';
        pulseDot.style.boxShadow = '0 0 20px var(--error-color)';
        elements.healthStatusText.textContent = 'Connection Error';
        elements.healthStatusText.style.color = 'var(--error-color)';
        elements.healthStatusDesc.textContent = 'Unable to reach health endpoint';
        elements.lastCheck.textContent = formatTime(new Date());
        
        updateGlobalStatus(false);
        
        return false;
    }
}

function startAutoRefresh() {
    if (state.autoRefreshInterval) {
        clearInterval(state.autoRefreshInterval);
    }
    
    // Check immediately
    checkHealth();
    
    // Then check every 10 seconds
    state.autoRefreshInterval = setInterval(() => {
        checkHealth();
    }, 10000);
}

function stopAutoRefresh() {
    if (state.autoRefreshInterval) {
        clearInterval(state.autoRefreshInterval);
        state.autoRefreshInterval = null;
    }
}

// Event Listeners
elements.testApiBtn.addEventListener('click', testApiEndpoint);

elements.autoRefresh.addEventListener('change', (e) => {
    if (e.target.checked) {
        startAutoRefresh();
    } else {
        stopAutoRefresh();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'T' to test API
    if (e.key === 't' || e.key === 'T') {
        if (document.activeElement.tagName !== 'INPUT') {
            testApiEndpoint();
        }
    }
    
    // Press 'H' to check health
    if (e.key === 'h' || e.key === 'H') {
        if (document.activeElement.tagName !== 'INPUT') {
            checkHealth();
        }
    }
});

// Initialize
function init() {
    console.log('🚀 Spring Boot Dashboard initialized');
    
    // Initial health check
    checkHealth();
    
    // Start auto-refresh if enabled
    if (elements.autoRefresh.checked) {
        startAutoRefresh();
    }
    
    // Add welcome animation
    setTimeout(() => {
        console.log('💡 Tip: Press "T" to test API, "H" to check health');
    }, 1000);
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopAutoRefresh();
});
