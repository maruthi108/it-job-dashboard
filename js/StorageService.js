/**
 * StorageService for TechCareerMatch
 * Handles all local storage operations for the application
 */

const StorageService = {
  /**
   * Initialize the storage service
   * @returns {Promise<boolean>} Success indicator
   */
  init: async function() {
    try {
      // Configure LocalForage
      localforage.config({
        name: CONFIG.storage.name,
        description: CONFIG.storage.description,
        version: CONFIG.version
      });
      
      // Check if it's first run
      const lastUpdate = await localforage.getItem(CONFIG.storage.lastUpdateKey);
      
      // Load sample data if first run
      if (!lastUpdate) {
        await this.loadSampleData();
        await localforage.setItem(CONFIG.storage.lastUpdateKey, new Date().toISOString());
      }
      
      console.log('StorageService initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing StorageService:', error);
      return false;
    }
  },
  
  /**
   * Load sample data for demonstration
   * @returns {Promise<boolean>} Success indicator
   */
  loadSampleData: async function() {
    try {
      // Sample user profile
      const userProfile = {
        name: 'IT Professional',
        email: 'user@example.com',
        location: 'San Francisco, CA',
        education: "Bachelor's",
        jobTitle: 'Software Developer',
        experience: 5.5,
        currentSalary: 85000,
        lastUpdated: new Date().toISOString()
      };

      // Sample user skills
      const userSkills = [
        { id: Utils.generateId(), name: 'JavaScript', level: 'Advanced', experience: 4.5 },
        { id: Utils.generateId(), name: 'React', level: 'Intermediate', experience: 2.5 },
        { id: Utils.generateId(), name: 'Node.js', level: 'Intermediate', experience: 3.0 },
        { id: Utils.generateId(), name: 'HTML/CSS', level: 'Advanced', experience: 5.0 },
        { id: Utils.generateId(), name: 'SQL', level: 'Intermediate', experience: 3.5 },
        { id: Utils.generateId(), name: 'Git', level: 'Advanced', experience: 4.0 },
        { id: Utils.generateId(), name: 'Python', level: 'Beginner', experience: 1.0 }
      ];

      // Sample work experiences
      const userExperience = [
        {
          id: Utils.generateId(),
          title: 'Frontend Developer',
          company: 'Web Solutions Inc.',
          startDate: '2021-06-01',
          endDate: null,
          isCurrent: true,
          description: 'Developing responsive web applications using React, Redux, and modern JavaScript.'
        },
        {
          id: Utils.generateId(),
          title: 'Junior Web Developer',
          company: 'Tech Startup LLC',
          startDate: '2019-03-15',
          endDate: '2021-05-30',
          isCurrent: false,
          description: 'Built and maintained websites for various clients using HTML, CSS, JavaScript, and PHP.'
        }
      ];

      // Sample preferences
      const userPreferences = {
        targetRole: 'Senior Frontend Developer',
        locationPreference: 'Remote',
        workType: 'Full-time',
        salaryExpectation: 110000,
        willingToRelocate: false,
        certifications: false
      };

      // Save sample data
      await this.saveProfileData(userProfile);
      await this.saveSkills(userSkills);
      await this.saveExperience(userExperience);
      await this.savePreferences(userPreferences);
      
      console.log('Sample data loaded successfully');
      return true;
    } catch (error) {
      console.error('Error loading sample data:', error);
      return false;
    }
  },
  
  /**
   * Save profile data
   * @param {Object} profileData - User profile data
   * @returns {Promise<Object>} The saved profile data
   */
  saveProfileData: async function(profileData) {
    try {
      // Get current profile (if exists)
      const currentProfile = await this.getProfileData();
      
      // Merge with new data and add timestamp
      const updatedProfile = {
        ...currentProfile,
        ...profileData,
        lastUpdated: new Date().toISOString()
      };
      
      // Save to localStorage
      await localforage.setItem(CONFIG.storage.userProfileKey, updatedProfile);
      
      // Update browser's localStorage for quicker access
      localStorage.setItem('profile_timestamp', new Date().getTime());
      
      return updatedProfile;
    } catch (error) {
      console.error('Error saving profile data:', error);
      throw error;
    }
  },
  
  /**
   * Get profile data
   * @returns {Promise<Object>} User profile data
   */
  getProfileData: async function() {
    try {
      const profile = await localforage.getItem(CONFIG.storage.userProfileKey);
      return profile || {};
    } catch (error) {
      console.error('Error getting profile data:', error);
      return {};
    }
  },
  
  /**
   * Save user skills
   * @param {Array} skills - User skills array
   * @returns {Promise<Array>} The saved skills
   */
  saveSkills: async function(skills) {
    try {
      await localforage.setItem(CONFIG.storage.userSkillsKey, skills);
      localStorage.setItem('skills_timestamp', new Date().getTime());
      return skills;
    } catch (error) {
      console.error('Error saving skills:', error);
      throw error;
    }
  },
  
  /**
   * Get user skills
   * @returns {Promise<Array>} User skills array
   */
  getSkills: async function() {
    try {
      const skills = await localforage.getItem(CONFIG.storage.userSkillsKey);
      return skills || [];
    } catch (error) {
      console.error('Error getting skills:', error);
      return [];
    }
  },
  
  /**
   * Add a new skill
   * @param {Object} skillData - Skill data object
   * @returns {Promise<Object>} The newly added skill
   */
  addSkill: async function(skillData) {
    try {
      const skills = await this.getSkills();
      
      // Create new skill with ID
      const newSkill = {
        id: Utils.generateId(),
        ...skillData
      };
      
      // Add to skills array
      skills.push(newSkill);
      
      // Save updated skills
      await this.saveSkills(skills);
      
      return newSkill;
    } catch (error) {
      console.error('Error adding skill:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing skill
   * @param {string} skillId - ID of skill to update
   * @param {Object} updates - Skill data to update
   * @returns {Promise<Object|null>} Updated skill or null if not found
   */
  updateSkill: async function(skillId, updates) {
    try {
      const skills = await this.getSkills();
      const index = skills.findIndex(skill => skill.id === skillId);
      
      if (index === -1) {
        return null;
      }
      
      // Update skill
      skills[index] = {
        ...skills[index],
        ...updates
      };
      
      // Save updated skills
      await this.saveSkills(skills);
      
      return skills[index];
    } catch (error) {
      console.error('Error updating skill:', error);
      throw error;
    }
  },
  
  /**
   * Delete a skill
   * @param {string} skillId - ID of skill to delete
   * @returns {Promise<boolean>} Success indicator
   */
  deleteSkill: async function(skillId) {
    try {
      const skills = await this.getSkills();
      const updatedSkills = skills.filter(skill => skill.id !== skillId);
      
      // Save updated skills
      await this.saveSkills(updatedSkills);
      
      return true;
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  },
  
  /**
   * Save work experience
   * @param {Array} experience - Experience array
   * @returns {Promise<Array>} The saved experience
   */
  saveExperience: async function(experience) {
    try {
      await localforage.setItem(CONFIG.storage.userExperienceKey, experience);
      localStorage.setItem('experience_timestamp', new Date().getTime());
      return experience;
    } catch (error) {
      console.error('Error saving experience:', error);
      throw error;
    }
  },
  
  /**
   * Get work experience
   * @returns {Promise<Array>} Experience array
   */
  getExperience: async function() {
    try {
      const experience = await localforage.getItem(CONFIG.storage.userExperienceKey);
      return experience || [];
    } catch (error) {
      console.error('Error getting experience:', error);
      return [];
    }
  },
  
  /**
   * Add new work experience
   * @param {Object} experienceData - Experience data
   * @returns {Promise<Object>} The newly added experience
   */
  addExperience: async function(experienceData) {
    try {
      const experience = await this.getExperience();
      
      // Create new experience with ID
      const newExperience = {
        id: Utils.generateId(),
        ...experienceData
      };
      
      // Add to experience array
      experience.push(newExperience);
      
      // Sort by date (newest first)
      experience.sort((a, b) => {
        const dateA = a.endDate || new Date().toISOString();
        const dateB = b.endDate || new Date().toISOString();
        return new Date(dateB) - new Date(dateA);
      });
      
      // Save updated experience
      await this.saveExperience(experience);
      
      return newExperience;
    } catch (error) {
      console.error('Error adding experience:', error);
      throw error;
    }
  },
  
  /**
   * Update existing work experience
   * @param {string} experienceId - ID of experience to update
   * @param {Object} updates - Experience data to update
   * @returns {Promise<Object|null>} Updated experience or null if not found
   */
  updateExperience: async function(experienceId, updates) {
    try {
      const experience = await this.getExperience();
      const index = experience.findIndex(exp => exp.id === experienceId);
      
      if (index === -1) {
        return null;
      }
      
      // Update experience
      experience[index] = {
        ...experience[index],
        ...updates
      };
      
      // Sort by date (newest first)
      experience.sort((a, b) => {
        const dateA = a.endDate || new Date().toISOString();
        const dateB = b.endDate || new Date().toISOString();
        return new Date(dateB) - new Date(dateA);
      });
      
      // Save updated experience
      await this.saveExperience(experience);
      
      return experience[index];
    } catch (error) {
      console.error('Error updating experience:', error);
      throw error;
    }
  },
  
  /**
   * Delete work experience
   * @param {string} experienceId - ID of experience to delete
   * @returns {Promise<boolean>} Success indicator
   */
  deleteExperience: async function(experienceId) {
    try {
      const experience = await this.getExperience();
      const updatedExperience = experience.filter(exp => exp.id !== experienceId);
      
      // Save updated experience
      await this.saveExperience(updatedExperience);
      
      return true;
    } catch (error) {
      console.error('Error deleting experience:', error);
      throw error;
    }
  },
  
  /**
   * Save user preferences
   * @param {Object} preferences - User preferences
   * @returns {Promise<Object>} The saved preferences
   */
  savePreferences: async function(preferences) {
    try {
      await localforage.setItem(CONFIG.storage.userPreferencesKey, preferences);
      localStorage.setItem('preferences_timestamp', new Date().getTime());
      return preferences;
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  },
  
  /**
   * Get user preferences
   * @returns {Promise<Object>} User preferences
   */
  getPreferences: async function() {
    try {
      const preferences = await localforage.getItem(CONFIG.storage.userPreferencesKey);
      return preferences || {};
    } catch (error) {
      console.error('Error getting preferences:', error);
      return {};
    }
  },
  
  /**
   * Save resume metadata
   * @param {Object} resumeData - Resume metadata
   * @returns {Promise<Object>} The saved resume metadata
   */
  saveResumeMetadata: async function(resumeData) {
    try {
      await localforage.setItem(CONFIG.storage.userResumeKey, resumeData);
      localStorage.setItem('resume_timestamp', new Date().getTime());
      return resumeData;
    } catch (error) {
      console.error('Error saving resume metadata:', error);
      throw error;
    }
  },
  
  /**
   * Get resume metadata
   * @returns {Promise<Object>} Resume metadata
   */
  getResumeMetadata: async function() {
    try {
      const resumeData = await localforage.getItem(CONFIG.storage.userResumeKey);
      return resumeData || null;
    } catch (error) {
      console.error('Error getting resume metadata:', error);
      return null;
    }
  },
  
  /**
   * Delete resume
   * @returns {Promise<boolean>} Success indicator
   */
  deleteResume: async function() {
    try {
      await localforage.removeItem(CONFIG.storage.userResumeKey);
      localStorage.removeItem('resume_timestamp');
      return true;
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  },
  
  /**
   * Save job applications
   * @param {Array} applications - Job applications array
   * @returns {Promise<Array>} The saved applications
   */
  saveJobApplications: async function(applications) {
    try {
      await localforage.setItem(CONFIG.storage.userJobsKey, applications);
      localStorage.setItem('applications_timestamp', new Date().getTime());
      return applications;
    } catch (error) {
      console.error('Error saving job applications:', error);
      throw error;
    }
  },
  
  /**
   * Get job applications
   * @returns {Promise<Array>} Job applications array
   */
  getJobApplications: async function() {
    try {
      const applications = await localforage.getItem(CONFIG.storage.userJobsKey);
      return applications || [];
    } catch (error) {
      console.error('Error getting job applications:', error);
      return [];
    }
  },
  
  /**
   * Add job to saved jobs
   * @param {Object} jobData - Job data
   * @returns {Promise<Object>} The saved job
   */
  saveJob: async function(jobData) {
    try {
      const savedJobs = await this.getJobApplications();
      
      // Check if job already saved
      const existingIndex = savedJobs.findIndex(job => job.id === jobData.id);
      
      if (existingIndex !== -1) {
        // Update existing job
        savedJobs[existingIndex] = {
          ...savedJobs[existingIndex],
          ...jobData,
          lastUpdated: new Date().toISOString()
        };
      } else {
        // Add new job with saved timestamp
        savedJobs.push({
          ...jobData,
          savedAt: new Date().toISOString()
        });
      }
      
      // Save updated jobs
      await this.saveJobApplications(savedJobs);
      
      return jobData;
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  },
  
  /**
   * Remove job from saved jobs
   * @param {string} jobId - ID of job to remove
   * @returns {Promise<boolean>} Success indicator
   */
  removeJob: async function(jobId) {
    try {
      const savedJobs = await this.getJobApplications();
      const updatedJobs = savedJobs.filter(job => job.id !== jobId);
      
      // Save updated jobs
      await this.saveJobApplications(updatedJobs);
      
      return true;
    } catch (error) {
      console.error('Error removing job:', error);
      throw error;
    }
  },
  
  /**
   * Clear all stored data (for testing/reset)
   * @returns {Promise<boolean>} Success indicator
   */
  clearAllData: async function() {
    try {
      await localforage.clear();
      
      // Clear localStorage timestamps
      localStorage.removeItem('profile_timestamp');
      localStorage.removeItem('skills_timestamp');
      localStorage.removeItem('experience_timestamp');
      localStorage.removeItem('preferences_timestamp');
      localStorage.removeItem('resume_timestamp');
      localStorage.removeItem('applications_timestamp');
      
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  },
  
  /**
   * Export all user data to JSON
   * @returns {Promise<Object>} Exported user data
   */
  exportUserData: async function() {
    try {
      const profile = await this.getProfileData();
      const skills = await this.getSkills();
      const experience = await this.getExperience();
      const preferences = await this.getPreferences();
      const resume = await this.getResumeMetadata();
      const savedJobs = await this.getJobApplications();
      
      const userData = {
        profile,
        skills,
        experience,
        preferences,
        resume,
        savedJobs,
        exportedAt: new Date().toISOString()
      };
      
      return userData;
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  },
  
  /**
   * Import user data from JSON
   * @param {Object} userData - User data to import
   * @returns {Promise<boolean>} Success indicator
   */
  importUserData: async function(userData) {
    try {
      if (userData.profile) {
        await this.saveProfileData(userData.profile);
      }
      
      if (userData.skills) {
        await this.saveSkills(userData.skills);
      }
      
      if (userData.experience) {
        await this.saveExperience(userData.experience);
      }
      
      if (userData.preferences) {
        await this.savePreferences(userData.preferences);
      }
      
      if (userData.resume) {
        await this.saveResumeMetadata(userData.resume);
      }
      
      if (userData.savedJobs) {
        await this.saveJobApplications(userData.savedJobs);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing user data:', error);
      throw error;
    }
  },
  
  /**
   * Download user data as JSON file
   */
  downloadUserData: async function() {
    try {
      const userData = await this.exportUserData();
      const profile = await this.getProfileData();
      const dataStr = JSON.stringify(userData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `techcareermatch_profile_${profile.name || 'user'}_${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Error downloading user data:', error);
      throw error;
    }
  }
};