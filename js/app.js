/**
 * Main application initialization for TechCareerMatch
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Show loading notification
        Utils.showNotification(
            'Loading',
            'Initializing TechCareerMatch...',
            'info',
            3000
        );

        console.log('Initializing TechCareerMatch application...');

        // Initialize modules in sequence
        await DataManager.init();
        await API.init();
        await MatchingEngine.init();
        await RoadmapManager.init();
        await ProfileManager.init();
        await ChartManager.init();
        await UI.init();

        console.log('All modules initialized successfully.');

        // Load user profile
        await ProfileManager.loadUserProfile();

        // Start with dashboard page
        UI.switchContent('dashboard');

        // Show success notification
        Utils.showNotification(
            'Ready',
            'TechCareerMatch initialized successfully!',
            'success'
        );
    } catch (error) {
        console.error('Application initialization error:', error);

        // Show error notification
        Utils.showNotification(
            'Error',
            'Failed to initialize application. Please refresh the page.',
            'error'
        );
    }
});

/**
* Add extra methods for DataManager for persistence and operation.
* These methods are not core functionality but are needed for the application to work.
*/

/**
 * Main application initialization for TechCareerMatch
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Show loading notification
        Utils.showNotification(
            'Loading',
            'Initializing TechCareerMatch...',
            'info',
            3000
        );

        console.log('Initializing TechCareerMatch application...');

        // Initialize storage manager first
        await StorageManager.init();

        // Initialize modules in sequence
        await DataManager.init();
        await API.init();
        await MatchingEngine.init();
        await RoadmapManager.init();
        await ProfileManager.init();
        await ChartManager.init();
        await ResumeProcessor.init();
        await UI.init();

        console.log('All modules initialized successfully.');

        // Load user profile
        await ProfileManager.loadUserProfile();

        // Start with dashboard page
        UI.switchContent('dashboard');

        // Show success notification
        Utils.showNotification(
            'Ready',
            'TechCareerMatch initialized successfully!',
            'success'
        );
    } catch (error) {
        console.error('Application initialization error:', error);

        // Show error notification
        Utils.showNotification(
            'Error',
            'Failed to initialize application. Please refresh the page.',
            'error'
        );
    }
});

/**
* Update CONFIG to include resume storage
*/
// Add resume storage key to CONFIG
if (CONFIG && CONFIG.storage) {
    CONFIG.storage.userResumeKey = 'user_resume_id';
}

/**
* Add extra methods for DataManager for persistence and operation.
* These methods are not core functionality but are needed for the application to work.
*/

/**
 * Updated saveProfile method for DataManager that focuses only on basic info and skills/experience
 * Removes preferences section handling
 */

// Save profile handler for form submissions
/**
 * Updated saveProfile method for DataManager that focuses only on basic info and skills/experience
 * Removes preferences section handling
 */

// Save profile handler for form submissions
DataManager.saveProfile = async function(formData) {
    try {
        // Parse skills if provided
        let skills = [];
        if (formData.skills) {
            skills = formData.skills.split(',').map(skill => skill.trim()).filter(Boolean);
        }
        
        // First save the basic profile data
        const profileData = {
            name: formData.name,
            email: formData.email,
            location: formData.location,
            education: formData.education,
            experience: parseFloat(formData.experience) || 0,
            currentSalary: parseInt(formData.currentSalary) || 0
        };
        
        // Save profile data to storage
        const savedProfile = await StorageManager.saveProfileData(profileData);
        
        // Add skills if provided
        if (skills.length > 0) {
            // Get existing skills to avoid duplicates
            const existingSkills = await this.getUserSkills();
            const existingSkillNames = existingSkills.map(skill => 
                skill.name.toLowerCase()
            );
            
            // Add new skills
            for (const skillName of skills) {
                if (!existingSkillNames.includes(skillName.toLowerCase())) {
                    await this.addUserSkill({
                        name: skillName,
                        level: 'Intermediate',
                        experience: Math.min(parseFloat(profileData.experience || 1), 2)
                    });
                }
            }
        }
        
        // Recalculate analytics
        if (typeof this.recalculateAnalytics === 'function') {
            await this.recalculateAnalytics();
        }
        
        return savedProfile;
    } catch (error) {
        console.error('Error saving profile:', error);
        return null;
    }
};

// Add domain method
DataManager.addUserDomain = async function (domainData) {
    try {
        const domains = await this.getUserDomains();
        const newDomain = {
            id: Utils.generateId(),
            ...domainData
        };

        domains.push(newDomain);
        await localforage.setItem(CONFIG.storage.userDomainsKey, domains);
        return newDomain;
    } catch (error) {
        console.error('Error adding user domain:', error);
        return null;
    }
};

// Delete domain method
DataManager.deleteDomain = async function (domainId) {
    try {
        const domains = await this.getUserDomains();
        const updatedDomains = domains.filter(domain => domain.id !== domainId);

        await localforage.setItem(CONFIG.storage.userDomainsKey, updatedDomains);
        return true;
    } catch (error) {
        console.error('Error deleting domain:', error);
        return false;
    }
};

// Update analytics data
DataManager.updateUserAnalytics = async function (analyticsData) {
    try {
        const currentAnalytics = await this.getUserAnalytics();
        const updatedAnalytics = { ...currentAnalytics, ...analyticsData };

        await localforage.setItem(CONFIG.storage.userAnalyticsKey, updatedAnalytics);
        return updatedAnalytics;
    } catch (error) {
        console.error('Error updating user analytics:', error);
        return null;
    }
};

/**
* Helper method to recalculate all analytics based on current profile data
*/
DataManager.recalculateAnalytics = async function () {
    try {
        const profile = await this.getUserProfile();
        const skills = await this.getUserSkills();
        const experience = await this.getUserExperience();
        const preferences = await this.getUserPreferences();

        // Calculate profile strength
        const profileStrength = Utils.calculateProfileCompletion(profile);

        // Calculate market competitiveness
        let marketCompetitiveness = 50; // Base value

        // Adjust based on skills
        if (skills.length > 0) {
            // Check for in-demand skills
            const inDemandSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Cloud'];
            let inDemandCount = 0;

            skills.forEach(skill => {
                if (inDemandSkills.some(s => skill.name.toLowerCase().includes(s.toLowerCase()))) {
                    inDemandCount++;
                }
            });

            // Adjust based on in-demand skills
            marketCompetitiveness += Math.min(20, inDemandCount * 5);

            // Adjust based on skill levels
            const advancedSkills = skills.filter(skill =>
                skill.level === 'Advanced' || skill.level === 'Expert'
            ).length;

            marketCompetitiveness += Math.min(15, advancedSkills * 3);
        }

        // Adjust based on experience
        if (experience.length > 0) {
            marketCompetitiveness += Math.min(15, profile.experience * 2);
        }

        // Cap at 100
        marketCompetitiveness = Math.min(100, marketCompetitiveness);

        // Calculate growth potential
        let growthPotential = 60; // Base value

        // Adjust based on education
        if (profile.education === "Master's" || profile.education === "PhD") {
            growthPotential += 10;
        } else if (profile.education === "Bachelor's") {
            growthPotential += 5;
        }

        // Adjust based on experience (diminishing returns)
        if (profile.experience < 2) {
            growthPotential += 15;
        } else if (profile.experience < 5) {
            growthPotential += 10;
        } else if (profile.experience < 10) {
            growthPotential += 5;
        }

        // Adjust based on target role
        if (preferences.targetRole) {
            growthPotential += 5;
        }

        // Cap at 100
        growthPotential = Math.min(100, growthPotential);

        // Generate suggestions
        const profileStrengthSuggestions = [];
        const marketCompetitivenessSuggestions = [];
        const growthPotentialSuggestions = [];

        // Profile strength suggestions
        if (!profile.linkedin) {
            profileStrengthSuggestions.push('Add your LinkedIn profile');
        }

        if (!profile.education) {
            profileStrengthSuggestions.push('Add your education information');
        }

        if (skills.length < 5) {
            profileStrengthSuggestions.push('Add more skills to your profile');
        }

        if (experience.length === 0) {
            profileStrengthSuggestions.push('Add your work experience details');
        }

        // Market competitiveness suggestions
        if (!skills.some(skill => skill.name.toLowerCase().includes('javascript'))) {
            marketCompetitivenessSuggestions.push('Add JavaScript to your skills');
        }

        if (!skills.some(skill =>
            skill.name.toLowerCase().includes('react') ||
            skill.name.toLowerCase().includes('angular') ||
            skill.name.toLowerCase().includes('vue')
        )) {
            marketCompetitivenessSuggestions.push('Learn a popular JavaScript framework like React, Angular, or Vue');
        }

        if (!skills.some(skill =>
            skill.name.toLowerCase().includes('node') ||
            skill.name.toLowerCase().includes('python') ||
            skill.name.toLowerCase().includes('java') ||
            skill.name.toLowerCase().includes('.net')
        )) {
            marketCompetitivenessSuggestions.push('Add backend development skills');
        }

        // Growth potential suggestions
        growthPotentialSuggestions.push('Consider pursuing certifications in your field');

        if (!skills.some(skill =>
            skill.name.toLowerCase().includes('cloud') ||
            skill.name.toLowerCase().includes('aws') ||
            skill.name.toLowerCase().includes('azure') ||
            skill.name.toLowerCase().includes('gcp')
        )) {
            growthPotentialSuggestions.push('Learn cloud technologies (AWS, Azure, or GCP)');
        }

        if (profile.experience > 3 && !preferences.targetRole.toLowerCase().includes('senior') &&
            !preferences.targetRole.toLowerCase().includes('lead') &&
            !preferences.targetRole.toLowerCase().includes('manager')) {
            growthPotentialSuggestions.push('Consider targeting senior or leadership roles');
        }

        // Update analytics
        const updatedAnalytics = {
            profileStrength: Math.round(profileStrength),
            marketCompetitiveness: Math.round(marketCompetitiveness),
            growthPotential: Math.round(growthPotential),
            suggestions: {
                profileStrength: profileStrengthSuggestions,
                marketCompetitiveness: marketCompetitivenessSuggestions,
                growthPotential: growthPotentialSuggestions
            }
        };

        await this.updateUserAnalytics(updatedAnalytics);
        return updatedAnalytics;
    } catch (error) {
        console.error('Error recalculating analytics:', error);
        return null;
    }
};