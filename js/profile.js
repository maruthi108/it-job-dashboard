/**
 * Profile management for TechCareerMatch
 */

const ProfileManager = {
    // ...existing code...
    
    /**
     * Initialize profile manager
     * @returns {Promise<boolean>} Success indicator
     */
    init: async function() {
        try {
            console.log('ProfileManager initialized');

            // Set up enhanced profile form
            this.setupEnhancedProfileForm();

            return true;
        } catch (error) {
            console.error('Error initializing ProfileManager:', error);
            return false;
        }
    },
    
    /**
     * Setup enhanced profile form
     */
    setupEnhancedProfileForm: function() {
        const profileForm = document.getElementById('profile-form');
        if (!profileForm) return;
        
        // Set up the experience slider
        this._setupExperienceSlider();
        
        // Set up job roles dropdowns
        this._populateJobRolesDropdowns();
        
        // Add tech-specific fields
        this._addTechStacksToForm();
        this._setupSkillSearchAutocomplete();
        
        // Enhance form validation and submission 
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this._validateProfileForm()) {
                this.handleProfileFormSubmit();
            }
        });
    },
    
    /** 
     * Set up experience slider with animation
     */ 
    _setupExperienceSlider: function() {
        const slider = document.getElementById('experience-slider');
        const valueDisplay = document.getElementById('experience-value');
        const hiddenInput = document.getElementById('user-experience');
        
        if (!slider || !valueDisplay || !hiddenInput) return;
        
        // Update value display when slider moves
        slider.addEventListener('input', function() {
            // Get the current value and format it to 1 decimal place
            const value = parseFloat(this.value).toFixed(1);
            
            // Update the display with animation
            let currentDisplayValue = parseFloat(valueDisplay.textContent);
            const targetValue = parseFloat(value);
            
            // Animate the value change 
            if (currentDisplayValue !== targetValue) {
                const animateValue = () => {
                    if (Math.abs(currentDisplayValue - targetValue) < 0.1) {
                        currentDisplayValue = targetValue;
                        valueDisplay.textContent = value;
                        return;
                    }
                    
                    // Move towards target
                    if (currentDisplayValue < targetValue) {
                        currentDisplayValue += 0.1;
                    } else {
                        currentDisplayValue -= 0.1;
                    }
                    
                    valueDisplay.textContent = currentDisplayValue.toFixed(1);
                    
                    // Continue animation
                    requestAnimationFrame(animateValue);
                };
                
                animateValue();
            }
            
            // Update hidden input for form submission
            hiddenInput.value = value;
            
            // Add visual feedback
            if (parseFloat(value) < 2) {
                valueDisplay.classList.add('warning'); 
                valueDisplay.title = "TechCareerMatch works best for professionals with 2+ years of experience";
            } else {
                valueDisplay.classList.remove('warning');
                valueDisplay.title = "";
            }
        });

        // Set initial value
        slider.value = 2.0;
        valueDisplay.textContent = "2.0";
        hiddenInput.value = 2.0;
    },

    /**
     * Populate job roles dropdowns from CSV data
     */ 
    _populateJobRolesDropdowns: function() {
        const jobTitleDropdown = document.getElementById('user-job-title');
        const targetRoleDropdown = document.getElementById('user-role');
        
        if (!jobTitleDropdown || !targetRoleDropdown) return;
        
        // Function to extract unique roles from job listings
        const extractRoles = async () => {
            try {
                let jobListings = [];
                
                // Try to get job listings from DataManager
                if (typeof DataManager.loadJobListingsData === 'function') {
                    jobListings = await DataManager.loadJobListingsData();
                } else if (CONFIG.it && CONFIG.it.roleCategories) {
                    // Fallback to config if available 
                    return CONFIG.it.roleCategories;
                } else {
                    // Hardcoded fallback roles
                    return [
                        'Software Developer',
                        'Frontend Developer', 
                        'Backend Developer',
                        'Full Stack Developer',
                        'DevOps Engineer',
                        'Cloud Engineer',
                        'Data Scientist',
                        'Machine Learning Engineer',
                        'UI/UX Designer',
                        'Product Manager',
                        'Project Manager',
                        'QA Engineer',
                        'Security Engineer',
                        'Mobile Developer',
                        'Systems Administrator',
                        'Database Administrator', 
                        'Network Engineer',
                        'Technical Support',
                        'IT Manager'
                    ];
                }
                
                // Extract unique preferred roles
                const roleSet = new Set();
                
                jobListings.forEach(job => {
                    if (job.preferred_role) {
                        roleSet.add(job.preferred_role);
                    }
                });
                
                // Convert to array and sort
                return Array.from(roleSet).sort();
                
            } catch (error) {
                console.error('Error extracting roles from job listings:', error);
                
                // Fallback roles
                return [
                    'Software Developer',
                    'Frontend Developer',
                    'Backend Developer', 
                    'Full Stack Developer',
                    'DevOps Engineer'
                ];
            }
        };
        
        // Populate dropdowns with roles
        extractRoles().then(roles => {
            // Clear existing options (except first)
            while (jobTitleDropdown.options.length > 1) {
                jobTitleDropdown.remove(1);
            }
            
            while (targetRoleDropdown.options.length > 1) {
                targetRoleDropdown.remove(1);  
            }
            
            // Add roles to dropdowns
            roles.forEach(role => {
                jobTitleDropdown.add(new Option(role, role));
                targetRoleDropdown.add(new Option(role, role));
            });
            
            // Set current values if they exist
            this._restoreFormSelections();
        });
    },
    
    /**
     * Restore previously selected values in form 
     */ 
    _restoreFormSelections: async function() {
        try {
            const profile = await DataManager.getUserProfile();
            const preferences = await DataManager.getUserPreferences();
            
            // Restore job title
            const jobTitleDropdown = document.getElementById('user-job-title');
            if (jobTitleDropdown && profile.jobTitle) {
                this._setSelectValue(jobTitleDropdown, profile.jobTitle);
            }
            
            // Restore target role 
            const targetRoleDropdown = document.getElementById('user-role');
            if (targetRoleDropdown && preferences.targetRole) {
                this._setSelectValue(targetRoleDropdown, preferences.targetRole);
            }
            
            // Restore experience slider
            const slider = document.getElementById('experience-slider');
            const valueDisplay = document.getElementById('experience-value');
            const hiddenInput = document.getElementById('user-experience');
            
            if (slider && valueDisplay && hiddenInput && profile.experience) {
                const experience = parseFloat(profile.experience);
                slider.value = experience;
                valueDisplay.textContent = experience.toFixed(1);
                hiddenInput.value = experience;
            }
        } catch (error) {
            console.error('Error restoring form selections:', error);
        }
    },

    /**
     * Helper to set select value and add option if not exists
     */ 
    _setSelectValue: function(selectElement, value) {
        if (!selectElement || !value) return;

        // Check if option exists
        let optionExists = false;
        for (let i = 0; i < selectElement.options.length; i++) {
            if (selectElement.options[i].value === value) {
                optionExists = true;
                selectElement.selectedIndex = i;
                break;
            }
        }

        // Add option if it doesn't exist
        if (!optionExists) {
            selectElement.add(new Option(value, value));
            selectElement.value = value;
        }
    },

    /**
     * Modified handleProfileFormSubmit to work with updated form
     */ 
    handleProfileFormSubmit: async function() {
        try {
            // Get form data
            const formData = {
                name: document.getElementById('user-name-input').value, 
                email: document.getElementById('user-email').value,
                location: document.getElementById('user-location-input').value,
                education: document.getElementById('user-education').value,
                jobTitle: document.getElementById('user-job-title').value,
                experience: document.getElementById('user-experience').value,
                skills: document.getElementById('user-skills').value,
                targetRole: document.getElementById('user-role').value,
                locationPreference: document.getElementById('user-location-preference').value,
                workType: document.getElementById('user-work-type').value,
                certifications: document.getElementById('user-certifications').value
            };
            
            // Validate form
            if (!formData.name || !formData.email || !formData.location) {
                Utils.showNotification(
                    'Error', 
                    'Please fill out all required fields in the Basic Info section.',
                    'error'
                );
                this.switchProfileTab('basic-info');
                return; 
            }

            if (!formData.jobTitle || !formData.experience) {
                Utils.showNotification(
                    'Error',
                    'Please fill out all required fields in the Skills & Experience section.',
                    'error'  
                );
                this.switchProfileTab('skills-exp');
                return;
            }

            if (!formData.targetRole) {
                Utils.showNotification(
                    'Error',
                    'Please select a target role in the Preferences section.',
                    'error'
                );
                this.switchProfileTab('preferences');
                return;
            }

            // Update profile
            const profileData = {
                name: formData.name,
                email: formData.email,
                location: formData.location, 
                education: formData.education,
                jobTitle: formData.jobTitle,
                experience: parseFloat(formData.experience)
            };

            await DataManager.updateUserProfile(profileData);

            // Update skills 
            const skillsInput = formData.skills;
            if (skillsInput) {
                // Parse skills from comma-separated list
                const skillsArray = skillsInput.split(',').map(skill => skill.trim()).filter(skill => skill);

                // Get existing skills
                const existingSkills = await DataManager.getUserSkills();
                const existingSkillNames = existingSkills.map(skill => skill.name.toLowerCase());

                // Add new skills
                for (const skill of skillsArray) {
                    if (!existingSkillNames.includes(skill.toLowerCase())) {
                        await DataManager.addUserSkill({
                            name: skill,
                            level: 'Intermediate',
                            experience: Math.min(parseFloat(formData.experience), 2) // Cap skill experience at user's total or 2 years 
                        });
                    }
                }
            }

            // Update preferences
            const preferencesData = {
                targetRole: formData.targetRole,
                locationPreference: formData.locationPreference,
                workType: formData.workType, 
                certifications: formData.certifications === 'true'
            };

            await DataManager.updateUserPreferences(preferencesData);

            // Reload profile 
            await this.loadUserProfile();

            // Update dashboard
            if (typeof UI.refreshDashboard === 'function') {
                UI.refreshDashboard();
            }

            // Close modal
            const modal = document.getElementById('profile-modal');
            if (modal) {
                modal.style.display = 'none';
            }

            // Show success notification
            Utils.showNotification(
                'Success',
                'Profile updated successfully.',
                'success' 
            );

            // Trigger career matches update if available
            if (typeof MatchingEngine.findMostSuitableRoles === 'function' && 
                typeof UI.displayTopRolesWithListings === 'function') {
                MatchingEngine.findMostSuitableRoles().then(result => {
                    const activeContent = document.querySelector('.content.active');
                    if (activeContent && activeContent.id === 'career-matches-content') {
                        UI.displayTopRolesWithListings(result.roles);
                    }
                }).catch(error => {
                    console.error('Error updating career matches after profile update:', error);
                });
            }

        } catch (error) {
            console.error('Error saving profile:', error);
            Utils.showNotification(
                'Error',
                'Failed to update profile. Please try again.',
                'error'
            );
        }
    },
    
    /**
     * Add a new skill
     * @param {Object} skillData - Skill data
     * @returns {Promise<boolean>} Success indicator
     */
    addSkill: async function(skillData) {
        try {
            // Check if skill already exists
            const existingSkills = await DataManager.getUserSkills();
            const skillExists = existingSkills.some(skill => 
                skill.name.toLowerCase() === skillData.name.toLowerCase()
            );
            
            if (skillExists) {
                Utils.showNotification(
                    'Skill Exists',
                    `${skillData.name} is already in your skill list.`,
                    'warning'
                );
                return false;
            }
            
            // Add skill
            const newSkill = await DataManager.addUserSkill(skillData);
            
            if (newSkill) {
                // Reload skills
                const skills = await DataManager.getUserSkills();
                this._updateSkillsUI(skills);
                
                // Update dashboard
                UI.refreshDashboard();
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error adding skill:', error);
            return false;
        }
    },
    
    /**
     * Edit a skill
     * @param {string} skillId - Skill ID
     * @private
     */
    _editSkill: async function(skillId) {
        try {
            const skills = await DataManager.getUserSkills();
            const skill = skills.find(s => s.id === skillId);
            
            if (!skill) {
                Utils.showNotification(
                    'Error',
                    'Skill not found.',
                    'error'
                );
                return;
            }
            
            // Show add skill modal with pre-filled data
            const skillNameInput = document.getElementById('skill-name');
            const skillLevelSelect = document.getElementById('skill-level');
            const skillExperienceInput = document.getElementById('skill-experience');
            
            skillNameInput.value = skill.name;
            skillLevelSelect.value = skill.level;
            skillExperienceInput.value = skill.experience;
            
            // Update modal title and submit button
            const modal = document.getElementById('add-skill-modal');
            modal.querySelector('h2').textContent = 'Edit Skill';
            const submitButton = modal.querySelector('button[type="submit"]');
            submitButton.textContent = 'Update Skill';
            
            // Show modal
            UI.openModal('add-skill-modal');
            
            // Update form submit handler
            const form = document.getElementById('add-skill-form');
            
            const existingHandler = form._submitHandler;
            if (existingHandler) {
                form.removeEventListener('submit', existingHandler);
            }
            
            const handleSubmit = async (e) => {
                e.preventDefault();
                
                const updatedSkillData = {
                    name: skillNameInput.value,
                    level: skillLevelSelect.value,
                    experience: parseFloat(skillExperienceInput.value)
                };
                
                const result = await this._updateSkill(skillId, updatedSkillData);
                
                if (result) {
                    UI.closeModal('add-skill-modal');
                    
                    Utils.showNotification(
                        'Success',
                        'Skill updated successfully.',
                        'success'
                    );
                }
            };
            
            form._submitHandler = handleSubmit;
            form.addEventListener('submit', handleSubmit);
        } catch (error) {
            console.error('Error editing skill:', error);
            Utils.showNotification(
                'Error',
                'Failed to edit skill.',
                'error'
            );
        }
    },
    
    /**
     * Update a skill
     * @param {string} skillId - Skill ID
     * @param {Object} skillData - Updated skill data
     * @returns {Promise<boolean>} Success indicator
     * @private
     */
    _updateSkill: async function(skillId, skillData) {
        try {
            const updatedSkill = await DataManager.updateUserSkill(skillId, skillData);
            
            if (updatedSkill) {
                // Reload skills
                const skills = await DataManager.getUserSkills();
                this._updateSkillsUI(skills);
                
                // Update dashboard
                UI.refreshDashboard();
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error updating skill:', error);
            return false;
        }
    },
    
    /**
     * Delete a skill
     * @param {string} skillId - Skill ID
     * @private
     */
    _deleteSkill: async function(skillId) {
        try {
            // Ask for confirmation
            if (!confirm('Are you sure you want to delete this skill?')) {
                return;
            }
            
            const result = await DataManager.deleteUserSkill(skillId);
            
            if (result) {
                // Reload skills
                const skills = await DataManager.getUserSkills();
                this._updateSkillsUI(skills);
                
                // Update dashboard
                UI.refreshDashboard();
                
                Utils.showNotification(
                    'Success',
                    'Skill deleted successfully.',
                    'success'
                );
            } else {
                Utils.showNotification(
                    'Error',
                    'Failed to delete skill.',
                    'error'
                );
            }
        } catch (error) {
            console.error('Error deleting skill:', error);
            Utils.showNotification(
                'Error',
                'Failed to delete skill.',
                'error'
            );
        }
    },
    
    /**
     * Add a new experience entry
     * @param {Object} experienceData - Experience data
     * @returns {Promise<boolean>} Success indicator
     */
    addExperience: async function(experienceData) {
        try {
            // Add experience
            const newExp = await DataManager.addUserExperience(experienceData);
            
            if (newExp) {
                // Update total experience calculation
                const totalExp = await this._calculateTotalExperience();
                await DataManager.updateUserProfile({ experience: totalExp });
                
                // Reload experience
                const experience = await DataManager.getUserExperience();
                const profile = await DataManager.getUserProfile();
                this._updateExperienceUI(experience, profile);
                
                // Update dashboard
                UI.refreshDashboard();
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error adding experience:', error);
            return false;
        }
    },
    
    /**
     * Edit an experience entry
     * @param {string} expId - Experience ID
     * @private
     */
    _editExperience: async function(expId) {
        try {
            const experience = await DataManager.getUserExperience();
            const exp = experience.find(e => e.id === expId);
            
            if (!exp) {
                Utils.showNotification(
                    'Error',
                    'Experience not found.',
                    'error'
                );
                return;
            }
            
            // Show add experience modal with pre-filled data
            const jobTitleInput = document.getElementById('job-title');
            const companyNameInput = document.getElementById('company-name');
            const jobStartDateInput = document.getElementById('job-start-date');
            const jobEndDateInput = document.getElementById('job-end-date');
            const currentPositionCheckbox = document.getElementById('current-position');
            const jobDescriptionInput = document.getElementById('job-description');
            
            jobTitleInput.value = exp.title;
            companyNameInput.value = exp.company;
            jobStartDateInput.value = exp.startDate;
            jobEndDateInput.value = exp.endDate || '';
            currentPositionCheckbox.checked = exp.isCurrent;
            jobDescriptionInput.value = exp.description || '';
            
            // Disable end date if current position
            jobEndDateInput.disabled = exp.isCurrent;
            
            // Update modal title and submit button
            const modal = document.getElementById('add-experience-modal');
            modal.querySelector('h2').textContent = 'Edit Work Experience';
            const submitButton = modal.querySelector('button[type="submit"]');
            submitButton.textContent = 'Update Experience';
            
            // Show modal
            UI.openModal('add-experience-modal');
            
            // Update form submit handler
            const form = document.getElementById('add-experience-form');
            
            const existingHandler = form._submitHandler;
            if (existingHandler) {
                form.removeEventListener('submit', existingHandler);
            }
            
            const handleSubmit = async (e) => {
                e.preventDefault();
                
                const isCurrent = currentPositionCheckbox.checked;
                
                const updatedExpData = {
                    title: jobTitleInput.value,
                    company: companyNameInput.value,
                    startDate: jobStartDateInput.value,
                    endDate: isCurrent ? null : jobEndDateInput.value,
                    isCurrent,
                    description: jobDescriptionInput.value
                };
                
                const result = await this._updateExperience(expId, updatedExpData);
                
                if (result) {
                    UI.closeModal('add-experience-modal');
                    
                    Utils.showNotification(
                        'Success',
                        'Experience updated successfully.',
                        'success'
                    );
                }
            };
            
            form._submitHandler = handleSubmit;
            form.addEventListener('submit', handleSubmit);
            
            // Add current position checkbox handler
            currentPositionCheckbox.addEventListener('change', () => {
                jobEndDateInput.disabled = currentPositionCheckbox.checked;
                if (currentPositionCheckbox.checked) {
                    jobEndDateInput.value = '';
                }
            });
        } catch (error) {
            console.error('Error editing experience:', error);
            Utils.showNotification(
                'Error',
                'Failed to edit experience.',
                'error'
            );
        }
    },
    
    /**
     * Update an experience entry
     * @param {string} expId - Experience ID
     * @param {Object} expData - Updated experience data
     * @returns {Promise<boolean>} Success indicator
     * @private
     */
    _updateExperience: async function(expId, expData) {
        try {
            const updatedExp = await DataManager.updateUserExperience(expId, expData);
            
            if (updatedExp) {
                // Update total experience calculation
                const totalExp = await this._calculateTotalExperience();
                await DataManager.updateUserProfile({ experience: totalExp });
                
                // Reload experience
                const experience = await DataManager.getUserExperience();
                const profile = await DataManager.getUserProfile();
                this._updateExperienceUI(experience, profile);
                
                // Update dashboard
                UI.refreshDashboard();
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error updating experience:', error);
            return false;
        }
    },
    
    /**
     * Delete an experience entry
     * @param {string} expId - Experience ID
     * @private
     */
    _deleteExperience: async function(expId) {
        try {
            // Ask for confirmation
            if (!confirm('Are you sure you want to delete this experience?')) {
                return;
            }
            
            const result = await DataManager.deleteUserExperience(expId);
            
            if (result) {
                // Update total experience calculation
                const totalExp = await this._calculateTotalExperience();
                await DataManager.updateUserProfile({ experience: totalExp });
                
                // Reload experience
                const experience = await DataManager.getUserExperience();
                const profile = await DataManager.getUserProfile();
                this._updateExperienceUI(experience, profile);
                
                // Update dashboard
                UI.refreshDashboard();
                
                Utils.showNotification(
                    'Success',
                    'Experience deleted successfully.',
                    'success'
                );
            } else {
                Utils.showNotification(
                    'Error',
                    'Failed to delete experience.',
                    'error'
                );
            }
        } catch (error) {
            console.error('Error deleting experience:', error);
            Utils.showNotification(
                'Error',
                'Failed to delete experience.',
                'error'
            );
        }
    },
    
    /**
     * Calculate total experience from work history
     * @returns {Promise<number>} Total experience in years
     * @private
     */
    _calculateTotalExperience: async function() {
        try {
            const experience = await DataManager.getUserExperience();
            
            if (experience.length === 0) {
                return 0;
            }
            
            let totalMonths = 0;
            
            experience.forEach(exp => {
                const months = Utils.getMonthsBetween(exp.startDate, exp.endDate);
                totalMonths += months;
            });
            
            // Convert to years (rounded to 1 decimal place)
            return Math.round((totalMonths / 12) * 10) / 10;
        } catch (error) {
            console.error('Error calculating total experience:', error);
            return 0;
        }
    },
    
    /**
     * Edit a preference
     * @param {string} field - Preference field
     * @private
     */
    _editPreference: async function(field) {
        try {
            const preferences = await DataManager.getUserPreferences();
            let value = preferences[field] || '';
            let newValue;
            
            // Different handling based on field type
            switch (field) {
                case 'preferred-role':
                    newValue = prompt('Enter your preferred role:', value);
                    if (newValue !== null) {
                        await DataManager.updateUserPreferences({ targetRole: newValue });
                    }
                    break;
                    
                case 'location-preference':
                    const locationOptions = ['Remote', 'Hybrid', 'On-site'];
                    const currentIndex = locationOptions.indexOf(value);
                    
                    newValue = prompt(
                        'Enter your location preference (Remote, Hybrid, On-site):',
                        value
                    );
                    
                    if (newValue !== null) {
                        await DataManager.updateUserPreferences({ locationPreference: newValue });
                    }
                    break;
                    
                case 'salary-preference':
                    const currentSalary = value ? parseInt(value) : '';
                    newValue = prompt('Enter your expected salary ($):', currentSalary);
                    
                    if (newValue !== null) {
                        const salary = parseInt(newValue);
                        if (!isNaN(salary)) {
                            await DataManager.updateUserPreferences({ salaryExpectation: salary });
                        }
                    }
                    break;
                    
                case 'work-type':
                    const workOptions = ['Full-time', 'Part-time', 'Contract', 'Freelance'];
                    const workIndex = workOptions.indexOf(value);
                    
                    newValue = prompt(
                        'Enter your preferred work type (Full-time, Part-time, Contract, Freelance):',
                        value
                    );
                    
                    if (newValue !== null) {
                        await DataManager.updateUserPreferences({ workType: newValue });
                    }
                    break;
                    
                case 'certifications':
                    const hasCerts = value === true || value === 'true';
                    newValue = confirm('Do you have any certifications?');
                    await DataManager.updateUserPreferences({ certifications: newValue });
                    break;
                    
                default:
                    console.error('Unknown preference field:', field);
                    return;
            }
            
            // Reload preferences
            const updatedPreferences = await DataManager.getUserPreferences();
            this._updatePreferencesUI(updatedPreferences);
            
            // Update dashboard
            UI.refreshDashboard();
            
            Utils.showNotification(
                'Success',
                'Preference updated successfully.',
                'success'
            );
        } catch (error) {
            console.error('Error editing preference:', error);
            Utils.showNotification(
                'Error',
                'Failed to update preference.',
                'error'
            );
        }
    },
    
    /**
     * Import skills from a CSV file
     * @param {File} file - CSV file
     * @returns {Promise<boolean>} Success indicator
     */
    importSkillsFromCSV: async function(file) {
        try {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                
                reader.onload = async (e) => {
                    try {
                        const csvText = e.target.result;
                        const skills = Utils.parseCSV(csvText);
                        
                        if (!skills || skills.length === 0) {
                            Utils.showNotification(
                                'Error',
                                'No skills found in the CSV file.',
                                'error'
                            );
                            resolve(false);
                            return;
                        }
                        
                        // Get existing skills
                        const existingSkills = await DataManager.getUserSkills();
                        const existingSkillNames = existingSkills.map(skill => skill.name.toLowerCase());
                        
                        // Add new skills
                        let addedCount = 0;
                        for (const skillData of skills) {
                            if (!skillData.name) continue;
                            
                            if (!existingSkillNames.includes(skillData.name.toLowerCase())) {
                                // Validate level
                                let level = skillData.level || 'Intermediate';
                                if (!CONFIG.defaults.skillLevels.includes(level)) {
                                    level = 'Intermediate';
                                }
                                
                                // Validate experience
                                let experience = parseFloat(skillData.experience);
                                if (isNaN(experience) || experience < 0) {
                                    experience = 1;
                                }
                                
                                // Add skill
                                await DataManager.addUserSkill({
                                    name: skillData.name,
                                    level,
                                    experience
                                });
                                
                                addedCount++;
                            }
                        }
                        
                        // Reload skills
                        const updatedSkills = await DataManager.getUserSkills();
                        this._updateSkillsUI(updatedSkills);
                        
                        // Update dashboard
                        UI.refreshDashboard();
                        
                        Utils.showNotification(
                            'Success',
                            `Imported ${addedCount} new skills.`,
                            'success'
                        );
                        
                        resolve(true);
                    } catch (error) {
                        console.error('Error processing CSV:', error);
                        Utils.showNotification(
                            'Error',
                            'Failed to process CSV file.',
                            'error'
                        );
                        resolve(false);
                    }
                };
                
                reader.onerror = () => {
                    Utils.showNotification(
                        'Error',
                        'Failed to read CSV file.',
                        'error'
                    );
                    resolve(false);
                };
                
                reader.readAsText(file);
            });
        } catch (error) {
            console.error('Error importing skills from CSV:', error);
            return false;
        }
    },
    
    /**
     * Export profile data as CSV
     */
    exportProfileData: async function() {
        try {
            // Get all profile data
            const profile = await DataManager.getUserProfile();
            const skills = await DataManager.getUserSkills();
            const experience = await DataManager.getUserExperience();
            const domains = await DataManager.getUserDomains();
            const preferences = await DataManager.getUserPreferences();
            
            // Create CSV content
            let csvContent = 'data:text/csv;charset=utf-8,';
            
            // Profile section
            csvContent += 'PROFILE DATA\r\n';
            csvContent += 'Name,Email,Location,Education,Job Title,Experience,Current Salary\r\n';
            csvContent += `${profile.name || ''},${profile.email || ''},${profile.location || ''},${profile.education || ''},${profile.jobTitle || ''},${profile.experience || 0},${profile.currentSalary || 0}\r\n\r\n`;
            
            // Skills section
            csvContent += 'SKILLS\r\n';
            csvContent += 'Name,Level,Experience\r\n';
            skills.forEach(skill => {
                csvContent += `${skill.name},${skill.level},${skill.experience}\r\n`;
            });
            csvContent += '\r\n';
            
            // Experience section
            csvContent += 'WORK EXPERIENCE\r\n';
            csvContent += 'Title,Company,Start Date,End Date,Is Current,Description\r\n';
            experience.forEach(exp => {
                csvContent += `${exp.title},${exp.company},${exp.startDate},${exp.endDate || ''},${exp.isCurrent},${exp.description || ''}\r\n`;
            });
            csvContent += '\r\n';
            
            // Domains section
            csvContent += 'DOMAINS\r\n';
            csvContent += 'Name,Level\r\n';
            domains.forEach(domain => {
                csvContent += `${domain.name},${domain.level}\r\n`;
            });
            csvContent += '\r\n';
            
            // Preferences section
            csvContent += 'PREFERENCES\r\n';
            csvContent += 'Target Role,Location Preference,Work Type,Salary Expectation,Willing to Relocate,Certifications\r\n';
            csvContent += `${preferences.targetRole || ''},${preferences.locationPreference || ''},${preferences.workType || ''},${preferences.salaryExpectation || 0},${preferences.willingToRelocate},${preferences.certifications}\r\n`;
            
            // Create download link
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `techcareermatch_profile_${new Date().toISOString().slice(0, 10)}.csv`);
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            Utils.showNotification(
                'Success',
                'Profile data exported successfully.',
                'success'
            );
            
            return true;
        } catch (error) {
            console.error('Error exporting profile data:', error);
            Utils.showNotification(
                'Error',
                'Failed to export profile data.',
                'error'
            );
            return false;
        }
    }
};