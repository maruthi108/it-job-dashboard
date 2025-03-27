/**
 * Profile management for TechCareerMatch
 */

const ProfileManager = {
    /**
     * Initialize profile manager
     * @returns {Promise<boolean>} Success indicator
     */
    init: async function() {
        try {
            console.log('ProfileManager initialized');
            return true;
        } catch (error) {
            console.error('Error initializing ProfileManager:', error);
            return false;
        }
    },
    
    /**
     * Load user profile data
     * @returns {Promise<Object>} User profile data
     */
    loadUserProfile: async function() {
        try {
            const profile = await DataManager.getUserProfile();
            const skills = await DataManager.getUserSkills();
            const experience = await DataManager.getUserExperience();
            const domains = await DataManager.getUserDomains();
            const preferences = await DataManager.getUserPreferences();
            const analytics = await DataManager.getUserAnalytics();
            
            // Update UI with profile data
            this._updateProfileUI(profile);
            this._updateSkillsUI(skills);
            this._updateExperienceUI(experience, profile);
            this._updateDomainsUI(domains);
            this._updatePreferencesUI(preferences);
            this._updateAnalyticsUI(analytics);
            
            return profile;
        } catch (error) {
            console.error('Error loading user profile:', error);
            return null;
        }
    },
    
    /**
     * Update profile UI elements
     * @param {Object} profile - User profile data
     * @private
     */
    _updateProfileUI: function(profile) {
        // Update profile header
        document.getElementById('profile-name').textContent = profile.name || 'IT Professional';
        document.getElementById('profile-headline').textContent = profile.jobTitle || 'Complete your profile to see personalized data';
        document.getElementById('location-value').textContent = profile.location || 'Not specified';
        document.getElementById('education-value').textContent = profile.education || 'Not specified';
        
        // Update profile photo initials
        const profilePhoto = document.querySelector('.profile-photo i');
        profilePhoto.textContent = Utils.getInitials(profile.name);
        
        // Update user menu display
        document.getElementById('user-display-name').textContent = profile.name ? profile.name.split(' ')[0] : 'Guest';
        
        // Update dashboard and welcome banner
        document.getElementById('user-name').textContent = profile.name || 'IT Professional';
        
        // Update profile completion
        const completionPercentage = Utils.calculateProfileCompletion(profile);
        this._updateProfileCompletion(completionPercentage);
    },
    
    /**
     * Update profile completion indicators
     * @param {number} percentage - Completion percentage
     * @private
     */
    _updateProfileCompletion: function(percentage) {
        // Update text
        document.getElementById('profile-completion-text').textContent = `${percentage}%`;
        
        // Update progress circle
        const circle = document.querySelector('.progress-ring-circle');
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference - (percentage / 100) * circumference;
        
        // Update progress text
        document.querySelector('.progress-text').textContent = `${percentage}%`;
    },
    
    /**
     * Update skills UI elements
     * @param {Array} skills - User skills data
     * @private
     */
    _updateSkillsUI: function(skills) {
        const skillsContainer = document.getElementById('skills-container');
        
        if (!skillsContainer) return;
        
        skillsContainer.innerHTML = '';
        
        if (skills.length === 0) {
            skillsContainer.innerHTML = `
                <p class="empty-message">No skills added yet. Add skills to get personalized job matches.</p>
            `;
            return;
        }
        
        skills.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.setAttribute('data-id', skill.id);
            
            skillItem.innerHTML = `
                <h4>${skill.name}</h4>
                <div class="skill-level">
                    <div class="skill-level-text">${skill.level}</div>
                    <div class="skill-years">${skill.experience} ${skill.experience === 1 ? 'year' : 'years'}</div>
                </div>
                <div class="skill-progress">
                    <div class="skill-progress-bar" style="width: ${this._getSkillLevelPercentage(skill.level)}%"></div>
                </div>
                <div class="skill-actions">
                    <button class="edit-skill" data-id="${skill.id}"><i class="fas fa-pen"></i></button>
                    <button class="delete-skill" data-id="${skill.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            skillsContainer.appendChild(skillItem);
        });
        
        // Add event listeners
        const editButtons = document.querySelectorAll('.edit-skill');
        const deleteButtons = document.querySelectorAll('.delete-skill');
        
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const skillId = e.currentTarget.getAttribute('data-id');
                this._editSkill(skillId);
            });
        });
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const skillId = e.currentTarget.getAttribute('data-id');
                this._deleteSkill(skillId);
            });
        });
    },
    
    /**
     * Get skill level percentage
     * @param {string} level - Skill level
     * @returns {number} Percentage value
     * @private
     */
    _getSkillLevelPercentage: function(level) {
        switch (level) {
            case 'Beginner':
                return 25;
            case 'Intermediate':
                return 50;
            case 'Advanced':
                return 75;
            case 'Expert':
                return 100;
            default:
                return 0;
        }
    },
    
    /**
     * Update experience UI elements
     * @param {Array} experience - User experience data
     * @param {Object} profile - User profile
     * @private
     */
    _updateExperienceUI: function(experience, profile) {
        const experienceTimeline = document.getElementById('experience-timeline');
        
        if (!experienceTimeline) return;
        
        // Update experience stats
        document.getElementById('years-experience-value').textContent = `${profile.experience || 0} years`;
        document.getElementById('current-salary-value').textContent = Utils.formatCurrency(profile.currentSalary || 0);
        
        // Clear timeline
        experienceTimeline.innerHTML = '';
        
        if (experience.length === 0) {
            experienceTimeline.innerHTML = `
                <p class="empty-message">No work experience added yet. Add your work history to improve job matches.</p>
            `;
            return;
        }
        
        // Add experience items
        experience.forEach(exp => {
            const endDate = exp.endDate || 'Present';
            const duration = Utils.formatDuration(Utils.getMonthsBetween(exp.startDate, exp.endDate));
            
            const experienceItem = document.createElement('div');
            experienceItem.className = 'experience-item';
            experienceItem.setAttribute('data-id', exp.id);
            
            experienceItem.innerHTML = `
                <div class="experience-period">
                    <div class="experience-date">${Utils.formatDate(exp.startDate)} - ${exp.endDate ? Utils.formatDate(exp.endDate) : 'Present'}</div>
                    <div class="experience-duration">${duration}</div>
                </div>
                <div class="experience-details">
                    <div class="experience-position">${exp.title}</div>
                    <div class="experience-company">${exp.company}</div>
                    <div class="experience-description">${exp.description || ''}</div>
                </div>
                <div class="experience-actions">
                    <button class="edit-experience" data-id="${exp.id}"><i class="fas fa-pen"></i></button>
                    <button class="delete-experience" data-id="${exp.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            experienceTimeline.appendChild(experienceItem);
        });
        
        // Add event listeners
        const editButtons = document.querySelectorAll('.edit-experience');
        const deleteButtons = document.querySelectorAll('.delete-experience');
        
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const expId = e.currentTarget.getAttribute('data-id');
                this._editExperience(expId);
            });
        });
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const expId = e.currentTarget.getAttribute('data-id');
                this._deleteExperience(expId);
            });
        });
    },
    
    /**
     * Update domains UI elements
     * @param {Array} domains - User domains data
     * @private
     */
    _updateDomainsUI: function(domains) {
        const domainsContainer = document.getElementById('domains-container');
        
        if (!domainsContainer) return;
        
        domainsContainer.innerHTML = '';
        
        if (domains.length === 0) {
            domainsContainer.innerHTML = `
                <p class="empty-message">No industry domains added yet. Add domains to improve job matches.</p>
            `;
            return;
        }
        
        domains.forEach(domain => {
            const domainItem = document.createElement('div');
            domainItem.className = 'domain-item';
            domainItem.setAttribute('data-id', domain.id);
            
            domainItem.innerHTML = `
                <div class="domain-icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <div class="domain-info">
                    <div class="domain-name">${domain.name}</div>
                    <div class="skill-progress">
                        <div class="skill-progress-bar" style="width: ${domain.level}%"></div>
                    </div>
                </div>
                <div class="domain-actions">
                    <button class="delete-domain" data-id="${domain.id}"><i class="fas fa-times"></i></button>
                </div>
            `;
            
            domainsContainer.appendChild(domainItem);
        });
        
        // Add event listeners
        const deleteButtons = document.querySelectorAll('.delete-domain');
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const domainId = e.currentTarget.getAttribute('data-id');
                this._deleteDomain(domainId);
            });
        });
        
        // Update domains chart
        this._updateDomainsChart(domains);
    },
    
    /**
     * Update domains chart
     * @param {Array} domains - User domains data
     * @private
     */
    _updateDomainsChart: function(domains) {
        const ctx = document.getElementById('domains-chart');
        
        if (!ctx) return;
        
        // If chart already exists, destroy it
        if (this.domainsChart) {
            this.domainsChart.destroy();
        }
        
        if (domains.length === 0) {
            return;
        }
        
        // Prepare chart data
        const labels = domains.map(domain => domain.name);
        const data = domains.map(domain => domain.level);
        
        // Create chart
        this.domainsChart = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.7)',
                        'rgba(46, 204, 113, 0.7)',
                        'rgba(155, 89, 182, 0.7)',
                        'rgba(243, 156, 18, 0.7)',
                        'rgba(231, 76, 60, 0.7)',
                        'rgba(52, 73, 94, 0.7)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                family: CONFIG.charts.fontFamily
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    },
    
    /**
     * Update preferences UI elements
     * @param {Object} preferences - User preferences data
     * @private
     */
    _updatePreferencesUI: function(preferences) {
        document.getElementById('preferred-role-value').textContent = preferences.targetRole || 'Not specified';
        document.getElementById('location-preference-value').textContent = preferences.locationPreference || 'Not specified';
        document.getElementById('salary-preference-value').textContent = preferences.salaryExpectation ? Utils.formatCurrency(preferences.salaryExpectation) : 'Not specified';
        document.getElementById('work-type-value').textContent = preferences.workType || 'Not specified';
        document.getElementById('certifications-value').textContent = preferences.certifications ? 'Yes' : 'No';
        
        // Add event listeners
        const editButtons = document.querySelectorAll('.edit-preference');
        
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const field = e.currentTarget.getAttribute('data-field');
                this._editPreference(field);
            });
        });
    },
    
    /**
     * Update analytics UI elements
     * @param {Object} analytics - User analytics data
     * @private
     */
    _updateAnalyticsUI: function(analytics) {
        // Update profile strength
        const profileStrengthBar = document.getElementById('profile-strength-bar');
        const profileStrengthLabel = document.getElementById('profile-strength-label');
        
        if (profileStrengthBar && profileStrengthLabel) {
            profileStrengthBar.style.width = `${analytics.profileStrength}%`;
            profileStrengthBar.style.backgroundColor = Utils.getPercentageColor(analytics.profileStrength);
            profileStrengthLabel.textContent = `${analytics.profileStrength}%`;
        }
        
        // Update market competitiveness
        const marketCompetitivenessBar = document.getElementById('market-competitiveness-bar');
        const marketCompetitivenessLabel = document.getElementById('market-competitiveness-label');
        
        if (marketCompetitivenessBar && marketCompetitivenessLabel) {
            marketCompetitivenessBar.style.width = `${analytics.marketCompetitiveness}%`;
            marketCompetitivenessBar.style.backgroundColor = Utils.getPercentageColor(analytics.marketCompetitiveness);
            marketCompetitivenessLabel.textContent = `${analytics.marketCompetitiveness}%`;
        }
        
        // Update growth potential
        const growthPotentialBar = document.getElementById('growth-potential-bar');
        const growthPotentialLabel = document.getElementById('growth-potential-label');
        
        if (growthPotentialBar && growthPotentialLabel) {
            growthPotentialBar.style.width = `${analytics.growthPotential}%`;
            growthPotentialBar.style.backgroundColor = Utils.getPercentageColor(analytics.growthPotential);
            growthPotentialLabel.textContent = `${analytics.growthPotential}%`;
        }
        
        // Update suggestions
        this._updateSuggestionsList('profile-strength-suggestions', analytics.suggestions.profileStrength);
        this._updateSuggestionsList('market-competitiveness-suggestions', analytics.suggestions.marketCompetitiveness);
        this._updateSuggestionsList('growth-potential-suggestions', analytics.suggestions.growthPotential);
    },
    
    /**
     * Update suggestions list
     * @param {string} containerId - Container ID
     * @param {Array} suggestions - Suggestions array
     * @private
     */
    _updateSuggestionsList: function(containerId, suggestions) {
        const container = document.getElementById(containerId);
        
        if (!container) return;
        
        container.innerHTML = '';
        
        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            container.appendChild(li);
        });
    },
    
    /**
     * Save profile data
     * @param {Object} formData - Form data
     * @returns {Promise<boolean>} Success indicator
     */
    saveProfile: async function(formData) {
        try {
            // Update profile
            const profileData = {
                name: formData.name,
                email: formData.email,
                location: formData.location,
                education: formData.education,
                linkedin: formData.linkedin,
                jobTitle: formData.jobTitle,
                experience: parseFloat(formData.experience),
                currentSalary: parseInt(formData.currentSalary)
            };
            
            const updatedProfile = await DataManager.updateUserProfile(profileData);
            
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
                            experience: 1
                        });
                    }
                }
            }
            
            // Update domains
            const domainsInput = formData.domains;
            if (domainsInput) {
                // Parse domains from comma-separated list
                const domainsArray = domainsInput.split(',').map(domain => domain.trim()).filter(domain => domain);
                
                // Get existing domains
                const existingDomains = await DataManager.getUserDomains();
                const existingDomainNames = existingDomains.map(domain => domain.name.toLowerCase());
                
                // Add new domains
                for (const domain of domainsArray) {
                    if (!existingDomainNames.includes(domain.toLowerCase())) {
                        await DataManager.addUserDomain({
                            name: domain,
                            level: 70 // Default level
                        });
                    }
                }
            }
            
            // Update preferences
            const preferencesData = {
                targetRole: formData.targetRole,
                locationPreference: formData.locationPreference,
                workType: formData.workType,
                salaryExpectation: parseInt(formData.salaryExpectation),
                willingToRelocate: formData.willingToRelocate === 'true',
                certifications: formData.certifications === 'true'
            };
            
            await DataManager.updateUserPreferences(preferencesData);
            
            // Reload profile
            await this.loadUserProfile();
            
            // Update dashboard
            UI.refreshDashboard();
            
            return true;
        } catch (error) {
            console.error('Error saving profile:', error);
            return false;
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