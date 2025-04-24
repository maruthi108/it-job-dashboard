/**
 * Profile Handler for TechCareerMatch
 * Handles form submissions and profile data management
 */

const ProfileHandler = {
  /**
   * Initialize profile handler
   * @returns {Promise<boolean>} Success indicator
   */
  init: async function() {
    try {
      // Set up event listeners
      this._setupEventListeners();
      
      console.log('ProfileHandler initialized');
      return true;
    } catch (error) {
      console.error('Error initializing ProfileHandler:', error);
      return false;
    }
  },
  
  /**
   * Set up event listeners
   * @private
   */
  _setupEventListeners: function() {
    // Profile form submission
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleProfileFormSubmit();
      });
    }
    
    // Add skill form submission
    const addSkillForm = document.getElementById('add-skill-form');
    if (addSkillForm) {
      addSkillForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddSkillFormSubmit();
      });
    }
    
    // Add experience form submission
    const addExperienceForm = document.getElementById('add-experience-form');
    if (addExperienceForm) {
      addExperienceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddExperienceFormSubmit();
      });
    }
    
    // Edit profile button
    const editProfileBtn = document.getElementById('edit-profile-btn');
    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', () => {
        this.openProfileModal();
      });
    }
    
    // Update profile button in welcome banner
    const updateProfileBtn = document.getElementById('update-profile-btn');
    if (updateProfileBtn) {
      updateProfileBtn.addEventListener('click', () => {
        this.openProfileModal();
      });
    }
    
    // Export profile button
    const exportProfileBtn = document.getElementById('export-profile-btn');
    if (exportProfileBtn) {
      exportProfileBtn.addEventListener('click', () => {
        this.exportProfile();
      });
    }
    
    // Resume upload
    const resumeUploadBtn = document.getElementById('upload-resume-btn');
    const resumeUploadInput = document.getElementById('resume-upload-input');
    
    if (resumeUploadBtn && resumeUploadInput) {
      resumeUploadBtn.addEventListener('click', () => {
        resumeUploadInput.click();
      });
      
      resumeUploadInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          this.handleResumeUpload(e.target.files[0]);
        }
      });
    }
  },
  
  /**
   * Open profile modal and populate with current data
   */
  openProfileModal: async function() {
    try {
      // Get current profile data
      const profile = await StorageService.getProfileData();
      const skills = await StorageService.getSkills();
      
      // Populate the form with current data
      this._populateProfileForm(profile, skills);
      
      // Open the modal
      const modal = document.getElementById('profile-modal');
      if (modal) {
        modal.style.display = 'block';
      }
    } catch (error) {
      console.error('Error opening profile modal:', error);
      Utils.showNotification(
        'Error',
        'Could not load profile data. Please try again.',
        'error'
      );
    }
  },
  
  /**
   * Populate profile form with current data
   * @param {Object} profile - User profile data
   * @param {Array} skills - User skills array
   * @private
   */
  _populateProfileForm: function(profile, skills) {
    // Basic info
    this._setFormValue('user-name-input', profile.name);
    this._setFormValue('user-email', profile.email);
    this._setFormValue('user-location-input', profile.location);
    this._setFormValue('user-education', profile.education);
    
    // Skills
    if (skills && skills.length > 0) {
      const skillsStr = skills.map(skill => skill.name).join(', ');
      this._setFormValue('user-skills', skillsStr);
    }
    
    // Experience
    this._setFormValue('user-experience', profile.experience);
    this._setFormValue('user-job-title', profile.jobTitle);
    this._setFormValue('user-current-salary', profile.currentSalary);
    
    // Switch to first tab
    const firstTab = document.querySelector('.form-tab');
    if (firstTab) {
      const tabId = firstTab.getAttribute('data-tab');
      this._switchTab(tabId);
    }
  },
  
  /**
   * Helper to set form field value safely
   * @param {string} id - Element ID
   * @param {string|number} value - Value to set
   * @private
   */
  _setFormValue: function(id, value) {
    const element = document.getElementById(id);
    if (element && value !== undefined && value !== null) {
      element.value = value;
    }
  },
  
  /**
   * Switch to a different tab in the profile form
   * @param {string} tabId - Tab ID to switch to
   * @private
   */
  _switchTab: function(tabId) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.form-tab');
    tabButtons.forEach(tab => {
      if (tab.getAttribute('data-tab') === tabId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    // Update tab content
    const tabContents = document.querySelectorAll('.form-tab-content');
    tabContents.forEach(content => {
      if (content.id === `${tabId}-tab`) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  },
  
  /**
   * Handle profile form submission
   */
  handleProfileFormSubmit: async function() {
    try {
      // Get form data
      const formData = {
        name: document.getElementById('user-name-input')?.value,
        email: document.getElementById('user-email')?.value,
        location: document.getElementById('user-location-input')?.value,
        education: document.getElementById('user-education')?.value,
        jobTitle: document.getElementById('user-job-title')?.value,
        experience: parseFloat(document.getElementById('user-experience')?.value) || 0,
        currentSalary: parseInt(document.getElementById('user-current-salary')?.value) || 0,
        skills: document.getElementById('user-skills')?.value
      };
      
      // Validate required fields
      if (!this._validateProfileForm(formData)) {
        return;
      }
      
      // Show loading notification
      Utils.showNotification(
        'Saving',
        'Saving your profile data...',
        'info',
        2000
      );
      
      // Save profile data
      await StorageService.saveProfileData({
        name: formData.name,
        email: formData.email,
        location: formData.location,
        education: formData.education,
        jobTitle: formData.jobTitle,
        experience: formData.experience,
        currentSalary: formData.currentSalary
      });
      
      // Handle skills if provided
      if (formData.skills) {
        // Parse skills from comma-separated list
        const skillNames = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
        
        // Get existing skills
        const existingSkills = await StorageService.getSkills();
        const existingSkillNames = existingSkills.map(s => s.name.toLowerCase());
        
        // Add new skills that don't already exist
        for (const skillName of skillNames) {
          if (!existingSkillNames.includes(skillName.toLowerCase())) {
            await StorageService.addSkill({
              name: skillName,
              level: 'Intermediate',
              experience: Math.min(formData.experience || 1, 2) // Cap at 2 years or user experience
            });
          }
        }
      }
      
      // Close modal
      const modal = document.getElementById('profile-modal');
      if (modal) {
        modal.style.display = 'none';
      }
      
      // Update UI
      this.updateProfileUI();
      
      // Show success notification
      Utils.showNotification(
        'Success',
        'Your profile has been saved successfully!',
        'success'
      );
      
      // Refresh dashboard if it exists
      if (typeof UI !== 'undefined' && typeof UI.refreshDashboard === 'function') {
        UI.refreshDashboard();
      }
    } catch (error) {
      console.error('Error handling profile form submission:', error);
      Utils.showNotification(
        'Error',
        'Failed to save profile. Please try again.',
        'error'
      );
    }
  },
  
  /**
   * Validate profile form data
   * @param {Object} formData - Form data to validate
   * @returns {boolean} Whether the form is valid
   * @private
   */
  _validateProfileForm: function(formData) {
    // Check required fields
    if (!formData.name || !formData.email) {
      Utils.showNotification(
        'Error',
        'Name and email are required fields.',
        'error'
      );
      return false;
    }
    
    // Validate email format
    if (!this._isValidEmail(formData.email)) {
      Utils.showNotification(
        'Error',
        'Please enter a valid email address.',
        'error'
      );
      return false;
    }
    
    return true;
  },
  
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Whether the email is valid
   * @private
   */
  _isValidEmail: function(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },
  
  /**
   * Update profile UI with latest data
   */
  updateProfileUI: async function() {
    try {
      // Get profile data
      const profile = await StorageService.getProfileData();
      
      // Update user name displays
      const userNameElements = document.querySelectorAll('#user-name, #profile-name, #user-display-name');
      userNameElements.forEach(element => {
        if (element) {
          element.textContent = profile.name || 'IT Professional';
        }
      });
      
      // Update profile details
      const profileHeadlineElement = document.getElementById('profile-headline');
      if (profileHeadlineElement) {
        profileHeadlineElement.textContent = profile.jobTitle || 'Complete your profile';
      }
      
      const locationValueElement = document.getElementById('location-value');
      if (locationValueElement) {
        locationValueElement.textContent = profile.location || 'Not specified';
      }
      
      const educationValueElement = document.getElementById('education-value');
      if (educationValueElement) {
        educationValueElement.textContent = profile.education || 'Not specified';
      }
      
      // Update experience displays
      const yearsExperienceElement = document.getElementById('years-experience-value');
      if (yearsExperienceElement && profile.experience) {
        yearsExperienceElement.textContent = `${profile.experience} years`;
      }
      
      const currentSalaryElement = document.getElementById('current-salary-value');
      if (currentSalaryElement && profile.currentSalary) {
        currentSalaryElement.textContent = `${profile.currentSalary.toLocaleString()}`;
      }
    } catch (error) {
      console.error('Error updating profile UI:', error);
    }
  },
  
  /**
   * Handle add skill form submission
   */
  handleAddSkillFormSubmit: async function() {
    try {
      const skillName = document.getElementById('skill-name').value;
      const skillLevel = document.getElementById('skill-level').value;
      const skillExperience = parseFloat(document.getElementById('skill-experience').value);
      
      // Validate inputs
      if (!skillName || !skillLevel) {
        Utils.showNotification(
          'Error',
          'Skill name and level are required.',
          'error'
        );
        return;
      }
      
      if (isNaN(skillExperience) || skillExperience < 0) {
        Utils.showNotification(
          'Error',
          'Experience must be a positive number.',
          'error'
        );
        return;
      }
      
      // Check if skill already exists
      const existingSkills = await StorageService.getSkills();
      if (existingSkills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
        Utils.showNotification(
          'Error',
          `Skill "${skillName}" already exists.`,
          'error'
        );
        return;
      }
      
      // Add skill
      await StorageService.addSkill({
        name: skillName,
        level: skillLevel,
        experience: skillExperience
      });
      
      // Close modal
      const modal = document.getElementById('add-skill-modal');
      if (modal) {
        modal.style.display = 'none';
      }
      
      // Show success notification
      Utils.showNotification(
        'Success',
        `Skill "${skillName}" has been added.`,
        'success'
      );
      
      // Update skills UI
      this.updateSkillsUI();
      
      // Refresh dashboard if it exists
      if (typeof UI !== 'undefined' && typeof UI.refreshDashboard === 'function') {
        UI.refreshDashboard();
      }
    } catch (error) {
      console.error('Error handling add skill form submission:', error);
      Utils.showNotification(
        'Error',
        'Failed to add skill. Please try again.',
        'error'
      );
    }
  },
  
  /**
   * Handle add experience form submission
   */
  handleAddExperienceFormSubmit: async function() {
    try {
      const jobTitle = document.getElementById('job-title').value;
      const companyName = document.getElementById('company-name').value;
      const startDate = document.getElementById('job-start-date').value;
      const endDate = document.getElementById('job-end-date').value;
      const isCurrent = document.getElementById('current-position').checked;
      const description = document.getElementById('job-description').value;
      
      // Validate inputs
      if (!jobTitle || !companyName || !startDate) {
        Utils.showNotification(
          'Error',
          'Job title, company, and start date are required.',
          'error'
        );
        return;
      }
      
      if (!isCurrent && !endDate) {
        Utils.showNotification(
          'Error',
          'Please provide an end date or check "I currently work here."',
          'error'
        );
        return;
      }
      
      // Add experience
      await StorageService.addExperience({
        title: jobTitle,
        company: companyName,
        startDate: startDate,
        endDate: isCurrent ? null : endDate,
        isCurrent: isCurrent,
        description: description
      });
      
      // Close modal
      const modal = document.getElementById('add-experience-modal');
      if (modal) {
        modal.style.display = 'none';
      }
      
      // Show success notification
      Utils.showNotification(
        'Success',
        `Experience at ${companyName} has been added.`,
        'success'
      );
      
      // Update experience UI
      this.updateExperienceUI();
      
      // Update total experience in profile
      await this.updateTotalExperience();
      
      // Refresh dashboard if it exists
      if (typeof UI !== 'undefined' && typeof UI.refreshDashboard === 'function') {
        UI.refreshDashboard();
      }
    } catch (error) {
      console.error('Error handling add experience form submission:', error);
      Utils.showNotification(
        'Error',
        'Failed to add experience. Please try again.',
        'error'
      );
    }
  },
  
  /**
   * Update total experience in profile based on work history
   */
  updateTotalExperience: async function() {
    try {
      const experience = await StorageService.getExperience();
      
      if (experience.length === 0) {
        return;
      }
      
      let totalMonths = 0;
      
      // Calculate total months of experience
      experience.forEach(exp => {
        const startDate = new Date(exp.startDate);
        const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
        
        // Calculate difference in months
        let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
        months += endDate.getMonth() - startDate.getMonth();
        
        // Add to total
        totalMonths += months;
      });
      
      // Convert to years (rounded to 1 decimal)
      const totalYears = Math.round((totalMonths / 12) * 10) / 10;
      
      // Update profile with calculated experience
      const profile = await StorageService.getProfileData();
      await StorageService.saveProfileData({
        ...profile,
        experience: totalYears
      });
      
      // Update UI
      this.updateProfileUI();
    } catch (error) {
      console.error('Error updating total experience:', error);
    }
  },
  
  /**
   * Update skills UI with latest data
   */
  updateSkillsUI: async function() {
    try {
      const skills = await StorageService.getSkills();
      const skillsContainer = document.getElementById('skills-container');
      
      if (!skillsContainer) {
        return;
      }
      
      // Clear container
      skillsContainer.innerHTML = '';
      
      if (skills.length === 0) {
        skillsContainer.innerHTML = '<p class="empty-message">No skills added yet.</p>';
        return;
      }
      
      // Render skills
      skills.forEach(skill => {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        skillItem.setAttribute('data-id', skill.id);
        
        skillItem.innerHTML = `
          <div class="skill-level">
            <span class="skill-name">${skill.name}</span>
            <span class="skill-level-text">${skill.level}</span>
          </div>
          <div class="skill-progress">
            <div class="skill-progress-bar" style="width: ${this._getSkillLevelPercentage(skill.level)}%"></div>
          </div>
          <div class="skill-years">
            <span>${skill.experience} year${skill.experience !== 1 ? 's' : ''} of experience</span>
            <div class="skill-actions">
              <button class="edit-skill" title="Edit skill"><i class="fas fa-pencil-alt"></i></button>
              <button class="delete-skill" title="Delete skill"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        `;
        
        // Add event listeners
        const editBtn = skillItem.querySelector('.edit-skill');
        if (editBtn) {
          editBtn.addEventListener('click', () => {
            this.editSkill(skill.id);
          });
        }
        
        const deleteBtn = skillItem.querySelector('.delete-skill');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', () => {
            this.deleteSkill(skill.id);
          });
        }
        
        skillsContainer.appendChild(skillItem);
      });
    } catch (error) {
      console.error('Error updating skills UI:', error);
    }
  },
  
  /**
   * Update experience UI with latest data
   */
  updateExperienceUI: async function() {
    try {
      const experience = await StorageService.getExperience();
      const experienceContainer = document.getElementById('experience-timeline');
      
      if (!experienceContainer) {
        return;
      }
      
      // Clear container
      experienceContainer.innerHTML = '';
      
      if (experience.length === 0) {
        experienceContainer.innerHTML = '<p class="empty-message">No work experience added yet.</p>';
        return;
      }
      
      // Render experience
      experience.forEach(exp => {
        const expItem = document.createElement('div');
        expItem.className = 'experience-item';
        expItem.setAttribute('data-id', exp.id);
        
        // Format dates
        const startDate = new Date(exp.startDate);
        const endDate = exp.endDate ? new Date(exp.endDate) : null;
        
        const startDateFormatted = startDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short'
        });
        
        const endDateFormatted = endDate ? endDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short'
        }) : 'Present';
        
        // Calculate duration
        const durationText = this._calculateDuration(startDate, endDate);
        
        expItem.innerHTML = `
          <div class="experience-period">
            <div class="experience-date">${startDateFormatted} - ${endDateFormatted}</div>
            <div class="experience-duration">${durationText}</div>
          </div>
          <div class="experience-details">
            <div class="experience-position">${exp.title}</div>
            <div class="experience-company">${exp.company}</div>
            <div class="experience-description">${exp.description || ''}</div>
            <div class="experience-actions">
              <button class="edit-experience" title="Edit experience"><i class="fas fa-pencil-alt"></i></button>
              <button class="delete-experience" title="Delete experience"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        `;
        
        // Add event listeners
        const editBtn = expItem.querySelector('.edit-experience');
        if (editBtn) {
          editBtn.addEventListener('click', () => {
            this.editExperience(exp.id);
          });
        }
        
        const deleteBtn = expItem.querySelector('.delete-experience');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', () => {
            this.deleteExperience(exp.id);
          });
        }
        
        experienceContainer.appendChild(expItem);
      });
    } catch (error) {
      console.error('Error updating experience UI:', error);
    }
  },
  
  /**
   * Calculate duration between dates
   * @param {Date} startDate - Start date
   * @param {Date|null} endDate - End date or null for present
   * @returns {string} Formatted duration string
   * @private
   */
  _calculateDuration: function(startDate, endDate) {
    const end = endDate || new Date();
    
    // Calculate difference in months
    let months = (end.getFullYear() - startDate.getFullYear()) * 12;
    months += end.getMonth() - startDate.getMonth();
    
    // Convert to years and months
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  },
  
  /**
   * Get skill level percentage for progress bar
   * @param {string} level - Skill level
   * @returns {number} Percentage (0-100)
   * @private
   */
  _getSkillLevelPercentage: function(level) {
    switch (level) {
      case 'Beginner': return 25;
      case 'Intermediate': return 50;
      case 'Advanced': return 75;
      case 'Expert': return 100;
      default: return 0;
    }
  },
  
  /**
   * Edit skill
   * @param {string} skillId - ID of skill to edit
   */
  editSkill: async function(skillId) {
    try {
      // Get skill data
      const skills = await StorageService.getSkills();
      const skill = skills.find(s => s.id === skillId);
      
      if (!skill) {
        Utils.showNotification(
          'Error',
          'Skill not found.',
          'error'
        );
        return;
      }
      
      // Populate form
      const skillNameInput = document.getElementById('skill-name');
      const skillLevelSelect = document.getElementById('skill-level');
      const skillExperienceInput = document.getElementById('skill-experience');
      
      if (skillNameInput) skillNameInput.value = skill.name;
      if (skillLevelSelect) skillLevelSelect.value = skill.level;
      if (skillExperienceInput) skillExperienceInput.value = skill.experience;
      
      // Update modal title and submit button
      const modal = document.getElementById('add-skill-modal');
      if (modal) {
        const modalTitle = modal.querySelector('h2');
        if (modalTitle) modalTitle.textContent = 'Edit Skill';
        
        const submitButton = modal.querySelector('button[type="submit"]');
        if (submitButton) submitButton.textContent = 'Update Skill';
        
        // Store skill ID in form for submission
        const form = document.getElementById('add-skill-form');
        if (form) form.setAttribute('data-edit-id', skillId);
        
        // Open modal
        modal.style.display = 'block';
      }
    } catch (error) {
      console.error('Error editing skill:', error);
      Utils.showNotification(
        'Error',
        'Failed to edit skill. Please try again.',
        'error'
      );
    }
  },
  
  /**
   * Delete skill
   * @param {string} skillId - ID of skill to delete
   */
  deleteSkill: async function(skillId) {
    try {
      // Confirm deletion
      if (!confirm('Are you sure you want to delete this skill?')) {
        return;
      }
      
      // Delete skill
      await StorageService.deleteSkill(skillId);
      
      // Show success notification
      Utils.showNotification(
        'Success',
        'Skill has been deleted.',
        'success'
      );
      
      // Update skills UI
      this.updateSkillsUI();
      
      // Refresh dashboard if it exists
      if (typeof UI !== 'undefined' && typeof UI.refreshDashboard === 'function') {
        UI.refreshDashboard();
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
      Utils.showNotification(
        'Error',
        'Failed to delete skill. Please try again.',
        'error'
      );
    }
  },
  
  /**
   * Edit experience
   * @param {string} expId - ID of experience to edit
   */
  editExperience: async function(expId) {
    try {
      // Get experience data
      const experiences = await StorageService.getExperience();
      const experience = experiences.find(e => e.id === expId);
      
      if (!experience) {
        Utils.showNotification(
          'Error',
          'Experience not found.',
          'error'
        );
        return;
      }
      
      // Populate form
      const jobTitleInput = document.getElementById('job-title');
      const companyNameInput = document.getElementById('company-name');
      const startDateInput = document.getElementById('job-start-date');
      const endDateInput = document.getElementById('job-end-date');
      const currentPositionCheckbox = document.getElementById('current-position');
      const descriptionInput = document.getElementById('job-description');
      
      if (jobTitleInput) jobTitleInput.value = experience.title;
      if (companyNameInput) companyNameInput.value = experience.company;
      if (startDateInput) startDateInput.value = experience.startDate;
      if (endDateInput) endDateInput.value = experience.endDate || '';
      if (currentPositionCheckbox) {
        currentPositionCheckbox.checked = experience.isCurrent;
        if (endDateInput) endDateInput.disabled = experience.isCurrent;
      }
      if (descriptionInput) descriptionInput.value = experience.description || '';
      
      // Update modal title and submit button
      const modal = document.getElementById('add-experience-modal');
      if (modal) {
        const modalTitle = modal.querySelector('h2');
        if (modalTitle) modalTitle.textContent = 'Edit Experience';
        
        const submitButton = modal.querySelector('button[type="submit"]');
        if (submitButton) submitButton.textContent = 'Update Experience';
        
        // Store experience ID in form for submission
        const form = document.getElementById('add-experience-form');
        if (form) form.setAttribute('data-edit-id', expId);
        
        // Open modal
        modal.style.display = 'block';
      }
    } catch (error) {
      console.error('Error editing experience:', error);
      Utils.showNotification(
        'Error',
        'Failed to edit experience. Please try again.',
        'error'
      );
    }
  },
  
  /**
   * Delete experience
   * @param {string} expId - ID of experience to delete
   */
  deleteExperience: async function(expId) {
    try {
      // Confirm deletion
      if (!confirm('Are you sure you want to delete this experience?')) {
        return;
      }
      
      // Delete experience
      await StorageService.deleteExperience(expId);
      
      // Show success notification
      Utils.showNotification(
        'Success',
        'Experience has been deleted.',
        'success'
      );
      
      // Update experience UI
      this.updateExperienceUI();
      
      // Update total experience
      await this.updateTotalExperience();
      
      // Refresh dashboard if it exists
      if (typeof UI !== 'undefined' && typeof UI.refreshDashboard === 'function') {
        UI.refreshDashboard();
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
      Utils.showNotification(
        'Error',
        'Failed to delete experience. Please try again.',
        'error'
      );
    }
  },
  
  /**
   * Handle resume upload
   * @param {File} file - Resume file
   */
  handleResumeUpload: async function(file) {
    try {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!allowedTypes.includes(file.type)) {
        Utils.showNotification(
          'Error',
          'Only PDF and Word documents are allowed.',
          'error'
        );
        return;
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        Utils.showNotification(
          'Error',
          'File size exceeds 5MB limit.',
          'error'
        );
        return;
      }
      
      // Show processing notification
      Utils.showNotification(
        'Processing',
        'Uploading and processing your resume...',
        'info',
        3000
      );
      
      // Create resume metadata
      const resumeData = {
        id: Utils.generateId(),
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        uploadDate: new Date().toISOString()
      };
      
      // Save resume metadata
      await StorageService.saveResumeMetadata(resumeData);
      
      // Update resume status UI
      this._updateResumeStatusUI(resumeData);
      
      // Show success notification
      Utils.showNotification(
        'Success',
        'Resume uploaded successfully.',
        'success'
      );
      
      // In a real app, we would process the file here
      // For demo purposes, we're just storing metadata
    } catch (error) {
      console.error('Error handling resume upload:', error);
      Utils.showNotification(
        'Error',
        'Failed to upload resume. Please try again.',
        'error'
      );
    }
  },
  
  /**
   * Update resume status UI
   * @param {Object} resumeData - Resume metadata
   * @private
   */
  _updateResumeStatusUI: function(resumeData) {
    const resumeStatus = document.getElementById('resume-status');
    if (!resumeStatus) return;
    
    // Format file size
    const fileSize = this._formatFileSize(resumeData.fileSize);
    
    // Update UI
    resumeStatus.innerHTML = `
      <div class="resume-file">
        <i class="fas fa-file-alt"></i>
        <span class="resume-filename">${resumeData.fileName}</span>
        <span class="resume-filesize">(${fileSize})</span>
        <button class="resume-remove" title="Remove resume"><i class="fas fa-times"></i></button>
      </div>
    `;
    
    // Add remove button event listener
    const removeBtn = resumeStatus.querySelector('.resume-remove');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        this.removeResume();
      });
    }
  },
  
  /**
   * Format file size to human-readable format
   * @param {number} bytes - Size in bytes
   * @returns {string} Formatted size
   * @private
   */
  _formatFileSize: function(bytes) {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  },
  
  /**
   * Remove resume
   */
  removeResume: async function() {
    try {
      // Confirm deletion
      if (!confirm('Are you sure you want to remove your resume?')) {
        return;
      }
      
      // Delete resume
      await StorageService.deleteResume();
      
      // Update UI
      const resumeStatus = document.getElementById('resume-status');
      if (resumeStatus) {
        resumeStatus.innerHTML = '';
      }
      
      // Show success notification
      Utils.showNotification(
        'Success',
        'Resume removed successfully.',
        'success'
      );
    } catch (error) {
      console.error('Error removing resume:', error);
      Utils.showNotification(
        'Error',
        'Failed to remove resume. Please try again.',
        'error'
      );
    }
  },
  
  /**
   * Export profile data
   */
  exportProfile: async function() {
    try {
      // Show loading notification
      Utils.showNotification(
        'Processing',
        'Preparing your profile data for export...',
        'info',
        2000
      );
      
      // Export data
      await StorageService.downloadUserData();
      
      // Show success notification
      Utils.showNotification(
        'Success',
        'Your profile data has been exported successfully.',
        'success'
      );
    } catch (error) {
      console.error('Error exporting profile:', error);
      Utils.showNotification(
        'Error',
        'Failed to export profile data. Please try again.',
        'error'
      );
    }
  },
  
  /**
   * Load user profile data and update UI
   */
  loadUserProfile: async function() {
    try {
      // Update profile UI
      await this.updateProfileUI();
      
      // Update skills UI
      await this.updateSkillsUI();
      
      // Update experience UI
      await this.updateExperienceUI();
      
      // Check for resume and update UI
      const resumeData = await StorageService.getResumeMetadata();
      if (resumeData) {
        this._updateResumeStatusUI(resumeData);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }
};

// Initialize ProfileHandler on DOM load
document.addEventListener('DOMContentLoaded', function() {
  // Check if StorageService is available
  const checkStorageService = setInterval(function() {
    if (typeof StorageService !== 'undefined') {
      clearInterval(checkStorageService);
      ProfileHandler.init();
      ProfileHandler.loadUserProfile();
    }
  }, 100);
});