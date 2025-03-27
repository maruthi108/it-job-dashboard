/**
 * Configuration settings for TechCareerMatch application
 */

const CONFIG = {
    // App Version
    version: '1.0.0',
    
    // LocalForage configuration
    storage: {
        name: 'tech-career-match',
        description: 'TechCareerMatch Storage',
        userProfileKey: 'user_profile',
        userSkillsKey: 'user_skills',
        userExperienceKey: 'user_experience',
        userDomainsKey: 'user_domains',
        userPreferencesKey: 'user_preferences',
        userAnalyticsKey: 'user_analytics',
        userJobsKey: 'saved_jobs',
        lastUpdateKey: 'last_data_update'
    },
    
    // Chart.js global configuration
    charts: {
        colors: {
            primary: '#3498db',
            secondary: '#2ecc71',
            accent: '#9b59b6',
            warning: '#f39c12',
            danger: '#e74c3c',
            gray: '#95a5a6',
            lightGray: '#ecf0f1'
        },
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        defaultAnimationDuration: 1000
    },
    
    // Data refresh intervals (in milliseconds)
    refreshIntervals: {
        jobMatches: 24 * 60 * 60 * 1000, // 24 hours
        marketData: 12 * 60 * 60 * 1000   // 12 hours
    },
    
    // API configuration (for future implementation)
    api: {
        baseUrl: 'https://api.techcareermatch.example.com/v1',
        timeout: 10000,
        retries: 3
    },
    
    // Pagination settings
    pagination: {
        jobsPerPage: 9
    },
    
    // Default user settings
    defaults: {
        targetRole: 'Software Developer',
        locationPreference: 'Remote',
        skillsToShow: 8,
        educationLevel: "Bachelor's",
        skillLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    }
};