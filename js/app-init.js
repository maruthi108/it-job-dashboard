/**
 * Application initialization script for TechCareerMatch
 * Integrates StorageService and ProfileHandler with the existing app
 */

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', async function() {
  try {
    // Show loading notification
    if (typeof Utils !== 'undefined' && typeof Utils.showNotification === 'function') {
      Utils.showNotification(
        'Loading',
        'Initializing TechCareerMatch...',
        'info',
        3000
      );
    }
    
    console.log('Initializing TechCareerMatch application...');
    
    // Initialize storage service first
    if (typeof StorageService !== 'undefined') {
      await StorageService.init();
      console.log('StorageService initialized successfully');
    } else {
      console.warn('StorageService not found, using DataManager for storage');
    }
    
    // Initialize modules in sequence
    const modulesToInitialize = [
      { name: 'DataManager', module: window.DataManager },
      { name: 'API', module: window.API },
      { name: 'MatchingEngine', module: window.MatchingEngine },
      { name: 'RoadmapManager', module: window.RoadmapManager },
      { name: 'ProfileHandler', module: window.ProfileHandler },
      { name: 'ChartManager', module: window.ChartManager },
      { name: 'ResumeProcessor', module: window.ResumeProcessor },
      { name: 'UI', module: window.UI }
    ];
    
    // Initialize each module if it exists
    for (const moduleInfo of modulesToInitialize) {
      if (moduleInfo.module && typeof moduleInfo.module.init === 'function') {
        await moduleInfo.module.init();
        console.log(`${moduleInfo.name} initialized successfully`);
      } else {
        console.log(`Module ${moduleInfo.name} not found or has no init method`);
      }
    }
    
    // Load user profile using ProfileHandler if available
    if (typeof ProfileHandler !== 'undefined' && typeof ProfileHandler.loadUserProfile === 'function') {
      await ProfileHandler.loadUserProfile();
      console.log('User profile loaded successfully');
    } else if (typeof ProfileManager !== 'undefined' && typeof ProfileManager.loadUserProfile === 'function') {
      // Fallback to ProfileManager
      await ProfileManager.loadUserProfile();
      console.log('User profile loaded using ProfileManager');
    }
    
    // Start with dashboard page
    if (typeof UI !== 'undefined' && typeof UI.switchContent === 'function') {
      UI.switchContent('dashboard');
    }
    
    // Show success notification
    if (typeof Utils !== 'undefined' && typeof Utils.showNotification === 'function') {
      Utils.showNotification(
        'Ready',
        'TechCareerMatch initialized successfully!',
        'success'
      );
    }
    
    console.log('All modules initialized successfully');
  } catch (error) {
    console.error('Application initialization error:', error);
    
    // Show error notification
    if (typeof Utils !== 'undefined' && typeof Utils.showNotification === 'function') {
      Utils.showNotification(
        'Error',
        'Failed to initialize application. Please refresh the page.',
        'error'
      );
    }
  }
});

/**
 * Fallback implementation of Utils.showNotification if not available
 */
if (typeof Utils === 'undefined') {
  window.Utils = {};
}

if (typeof Utils.showNotification !== 'function') {
  Utils.showNotification = function(title, message, type = 'info', duration = 5000) {
    console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
    
    // Try to create a notification container if needed
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.style.position = 'fixed';
      container.style.bottom = '20px';
      container.style.right = '20px';
      container.style.zIndex = '1000';
      document.body.appendChild(container);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.backgroundColor = 'white';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    notification.style.padding = '15px 20px';
    notification.style.marginBottom = '10px';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.minWidth = '300px';
    
    // Set icon based on type
    let iconClass = 'info-circle';
    if (type === 'success') iconClass = 'check-circle';
    if (type === 'error') iconClass = 'times-circle';
    if (type === 'warning') iconClass = 'exclamation-circle';
    
    // Set notification content
    notification.innerHTML = `
      <div style="margin-right: 15px; font-size: 20px;">
        <i class="fas fa-${iconClass}"></i>
      </div>
      <div style="flex: 1;">
        <div style="font-weight: 600; margin-bottom: 3px;">${title}</div>
        <div style="font-size: 14px; color: #666;">${message}</div>
      </div>
      <div style="color: #aaa; font-size: 16px; margin-left: 10px; cursor: pointer;" class="notification-close">&times;</div>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Add event listener for close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.remove();
    });
    
    // Auto remove after duration
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, duration);
  };
}

/**
 * Fallback implementation of Utils.generateId if not available
 */
if (typeof Utils.generateId !== 'function') {
  Utils.generateId = function(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
  };
}

// Create the CONFIG object if it doesn't exist
if (typeof CONFIG === 'undefined') {
  window.CONFIG = {
    version: '1.0.0',
    storage: {
      name: 'tech-career-match',
      description: 'TechCareerMatch Storage',
      userProfileKey: 'user_profile',
      userSkillsKey: 'user_skills',
      userExperienceKey: 'user_experience',
      userPreferencesKey: 'user_preferences',
      userAnalyticsKey: 'user_analytics',
      userJobsKey: 'saved_jobs',
      userResumeKey: 'user_resume',
      lastUpdateKey: 'last_data_update'
    }
  };
}