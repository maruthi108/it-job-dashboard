/**
 * Application initialization script for TechCareerMatch
 * Integrates StorageService and ProfileHandler with the existing app
 */

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', async function() {
  try {
      // Show loading notification
      Utils.showNotification(
          'Loading',
          'Initializing TechCareerMatch...',
          'info',
          3000
      );

      console.log('Initializing TechCareerMatch application...');

      // Initialize storage first
      await StorageManager.init();
      console.log('StorageManager initialized');

      // Initialize data modules
      await DataManager.init();
      console.log('DataManager initialized');

      // Initialize API and core functionality
      await API.init();
      console.log('API initialized');
      await MatchingEngine.init();
      console.log('MatchingEngine initialized');

      // Initialize UI and presentation modules
      await RoadmapManager.init();
      console.log('RoadmapManager initialized');
      await ProfileManager.init();
      console.log('ProfileManager initialized');
      await ChartManager.init();
      console.log('ChartManager initialized');

      // Load user profile
      if (typeof ProfileManager.loadUserProfile === 'function') {
          await ProfileManager.loadUserProfile();
          console.log('User profile loaded');
      } else {
          console.error('ProfileManager.loadUserProfile is not defined');
      }

      // Start with dashboard page
      if (typeof UI !== 'undefined' && typeof UI.switchContent === 'function') {
          UI.switchContent('dashboard');
          console.log('Switched to dashboard view');
      } else {
          console.error('UI module not properly initialized');
      }

      console.log('TechCareerMatch initialization complete');
  } catch (error) {
      console.error('Application initialization error:', error);
      
      // Show error notification
      if (typeof Utils !== 'undefined' && typeof Utils.showNotification === 'function') {
          Utils.showNotification(
              
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