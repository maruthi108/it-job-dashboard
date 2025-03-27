/**
 * Utility functions for TechCareerMatch application
 */

const Utils = {
    /**
     * Format currency value
     * @param {number} value - The value to format
     * @param {string} currency - The currency symbol (default: $)
     * @returns {string} Formatted currency string
     */
    formatCurrency: (value, currency = '$') => {
        return `${currency}${value.toLocaleString()}`;
    },
    
    /**
     * Format date to a readable string
     * @param {string|Date} date - The date to format
     * @param {boolean} includeYear - Whether to include the year
     * @returns {string} Formatted date string
     */
    formatDate: (date, includeYear = true) => {
        if (!date) return '';
        
        const dateObj = new Date(date);
        const options = {
            month: 'short',
            day: 'numeric'
        };
        
        if (includeYear) {
            options.year = 'numeric';
        }
        
        return dateObj.toLocaleDateString('en-US', options);
    },
    
    /**
     * Calculate date difference in months
     * @param {string|Date} startDate - The start date
     * @param {string|Date} endDate - The end date
     * @returns {number} Number of months between dates
     */
    getMonthsBetween: (startDate, endDate) => {
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date();
        
        return (end.getFullYear() - start.getFullYear()) * 12 + 
               (end.getMonth() - start.getMonth());
    },
    
    /**
     * Format duration in months to a readable string
     * @param {number} months - Number of months
     * @returns {string} Formatted duration string
     */
    formatDuration: (months) => {
        if (months < 1) {
            return 'Less than a month';
        }
        
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        
        if (years === 0) {
            return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
        } else if (remainingMonths === 0) {
            return `${years} year${years !== 1 ? 's' : ''}`;
        } else {
            return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
        }
    },
    
    /**
     * Generate a random ID
     * @param {number} length - Length of the ID
     * @returns {string} Random ID
     */
    generateId: (length = 8) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        
        return result;
    },
    
    /**
     * Get initials from a name
     * @param {string} name - The name
     * @returns {string} Initials (max 2 characters)
     */
    getInitials: (name) => {
        if (!name) return 'TP';
        
        const names = name.split(' ');
        if (names.length === 1) {
            return names[0].substring(0, 2).toUpperCase();
        }
        
        return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    },
    
    /**
     * Calculate the percentage match between two arrays
     * @param {Array} array1 - First array
     * @param {Array} array2 - Second array
     * @returns {number} Percentage match (0-100)
     */
    calculateArrayMatch: (array1, array2) => {
        if (!array1 || !array2 || array1.length === 0 || array2.length === 0) {
            return 0;
        }
        
        const set1 = new Set(array1.map(item => item.toLowerCase()));
        const set2 = new Set(array2.map(item => item.toLowerCase()));
        
        let matches = 0;
        for (const item of set1) {
            if (set2.has(item)) {
                matches++;
            }
        }
        
        // Calculate percentage based on the smaller array size
        const smallerSize = Math.min(set1.size, set2.size);
        return Math.round((matches / smallerSize) * 100);
    },
    
    /**
     * Parse CSV data
     * @param {string} csvText - CSV text
     * @returns {Array} Parsed CSV data
     */
    parseCSV: (csvText) => {
        const lines = csvText.split('\n');
        const result = [];
        
        // Get headers
        const headers = lines[0].split(',').map(header => header.trim());
        
        // Parse data
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const data = lines[i].split(',');
            const obj = {};
            
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = data[j].trim();
            }
            
            result.push(obj);
        }
        
        return result;
    },
    
    /**
     * Show a notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info, warning)
     * @param {number} duration - Duration in milliseconds
     */
    showNotification: (title, message, type = 'info', duration = 5000) => {
        const container = document.getElementById('notification-container');
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Set icon based on type
        let iconClass = 'info-circle';
        if (type === 'success') iconClass = 'check-circle';
        if (type === 'error') iconClass = 'times-circle';
        if (type === 'warning') iconClass = 'exclamation-circle';
        
        // Set notification content
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${iconClass}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <div class="notification-close">&times;</div>
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
    },
    
    /**
     * Debounce function to limit the rate of execution
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce: (func, wait = 300) => {
        let timeout;
        
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Calculate profile completion percentage
     * @param {Object} profile - User profile object
     * @returns {number} Completion percentage
     */
    calculateProfileCompletion: (profile) => {
        if (!profile) return 0;
        
        const requiredFields = [
            'name', 'email', 'location', 'education',
            'skills', 'experience', 'jobTitle', 'currentSalary'
        ];
        
        const optionalFields = [
            'linkedin', 'domains', 'certifications', 
            'targetRole', 'locationPreference', 'workType', 
            'salaryExpectation', 'willingToRelocate'
        ];
        
        let completedRequired = 0;
        let completedOptional = 0;
        
        // Check required fields
        requiredFields.forEach(field => {
            if (profile[field] && 
                (typeof profile[field] !== 'string' || profile[field].trim() !== '')) {
                completedRequired++;
            }
        });
        
        // Check optional fields
        optionalFields.forEach(field => {
            if (profile[field] && 
                (typeof profile[field] !== 'string' || profile[field].trim() !== '')) {
                completedOptional++;
            }
        });
        
        // Calculate percentage (70% weight for required fields, 30% for optional)
        const requiredPercentage = (completedRequired / requiredFields.length) * 70;
        const optionalPercentage = (completedOptional / optionalFields.length) * 30;
        
        return Math.round(requiredPercentage + optionalPercentage);
    },
    
    /**
     * Get a color based on a percentage value
     * @param {number} percentage - Percentage value (0-100)
     * @param {boolean} reverse - Whether to reverse the color scale
     * @returns {string} HEX color code
     */
    getPercentageColor: (percentage, reverse = false) => {
        let r, g, b;
        percentage = Math.min(100, Math.max(0, percentage));
        
        if (reverse) {
            percentage = 100 - percentage;
        }
        
        if (percentage < 50) {
            // Red to Yellow
            r = 255;
            g = Math.round(5.1 * percentage);
        } else {
            // Yellow to Green
            r = Math.round(510 - 5.1 * percentage);
            g = 255;
        }
        b = 0;
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    },
    
    /**
     * Get skill level index
     * @param {string} level - Skill level (Beginner, Intermediate, Advanced, Expert)
     * @returns {number} Level index (1-4)
     */
    getSkillLevelIndex: (level) => {
        const levels = {
            'Beginner': 1,
            'Intermediate': 2,
            'Advanced': 3,
            'Expert': 4
        };
        
        return levels[level] || 1;
    },
    
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} Whether the email is valid
     */
    isValidEmail: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    
    /**
     * Escape HTML to prevent XSS
     * @param {string} html - HTML string to escape
     * @returns {string} Escaped HTML
     */
    escapeHtml: (html) => {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }
};