/**
 * UI management for TechCareerMatch
 */

const UI = {
    /**
     * Initialize UI
     * @returns {Promise<boolean>} Success indicator
     */
    init: async function() {
        try {
            this._setupEventListeners();
            console.log('UI initialized');
            return true;
        } catch (error) {
            console.error('Error initializing UI:', error);
            return false;
        }
    },
    
    /**
     * Set up event listeners
     * @private
     */
    _setupEventListeners: function() {
        // Navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const contentId = item.getAttribute('data-content');
                this.switchContent(contentId);
            });
        });
        
        // Inside-page navigation
        const navLinks = document.querySelectorAll('[data-nav]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const contentId = link.getAttribute('data-nav');
                this.switchContent(contentId);
            });
        });
        
        // Profile sections navigation
        const profileNavItems = document.querySelectorAll('.profile-nav-item');
        profileNavItems.forEach(item => {
            item.addEventListener('click', () => {
                const sectionId = item.getAttribute('data-section');
                this.switchProfileSection(sectionId);
            });
        });
        
        // Profile buttons
        document.getElementById('update-profile-btn').addEventListener('click', () => {
            this.openModal('profile-modal');
        });
        
        document.getElementById('edit-profile-btn').addEventListener('click', () => {
            this.openModal('profile-modal');
        });
        
        document.getElementById('export-profile-btn').addEventListener('click', () => {
            ProfileManager.exportProfileData();
        });
        
        // Add skill button
        const addSkillButtons = document.querySelectorAll('#add-skill-btn');
        addSkillButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.openAddSkillModal();
            });
        });
        
        // Add experience button
        const addExperienceBtn = document.getElementById('add-experience-btn');
        if (addExperienceBtn) {
            addExperienceBtn.addEventListener('click', () => {
                this.openAddExperienceModal();
            });
        }
        
        // Profile modal tabs
        const profileTabs = document.querySelectorAll('.form-tab');
        profileTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                this.switchProfileTab(tabId);
            });
        });
        
        // Profile form navigation buttons
        const nextTabButtons = document.querySelectorAll('.next-tab');
        nextTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const nextTab = button.getAttribute('data-next');
                this.switchProfileTab(nextTab);
            });
        });
        
        const prevTabButtons = document.querySelectorAll('.prev-tab');
        prevTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const prevTab = button.getAttribute('data-prev');
                this.switchProfileTab(prevTab);
            });
        });
        
        // Profile form submission
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProfileFormSubmit();
            });
        }
        
        // Add skill form
        const addSkillForm = document.getElementById('add-skill-form');
        if (addSkillForm) {
            addSkillForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddSkillFormSubmit();
            });
        }
        
        // Add experience form
        const addExperienceForm = document.getElementById('add-experience-form');
        if (addExperienceForm) {
            addExperienceForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddExperienceFormSubmit();
            });
        }
        
        // Current position checkbox in experience form
        const currentPositionCheckbox = document.getElementById('current-position');
        if (currentPositionCheckbox) {
            currentPositionCheckbox.addEventListener('change', () => {
                const endDateInput = document.getElementById('job-end-date');
                endDateInput.disabled = currentPositionCheckbox.checked;
                if (currentPositionCheckbox.checked) {
                    endDateInput.value = '';
                }
            });
        }
        
        // Modal close buttons
        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.closest('.modal').id;
                this.closeModal(modalId);
            });
        });
        
        // Modal cancel buttons
        const cancelButtons = document.querySelectorAll('.form-actions .btn-secondary');
        cancelButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.closest('.modal').id;
                this.closeModal(modalId);
            });
        });
        
        // Job filters
        const jobSearchInput = document.getElementById('job-search-input');
        if (jobSearchInput) {
            jobSearchInput.addEventListener('input', Utils.debounce(() => {
                this.handleJobSearch();
            }, 500));
        }
        
        const applyFiltersBtn = document.getElementById('apply-filters-btn');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                this.handleJobFilters();
            });
        }
        
        // Pagination buttons
        const prevPageBtn = document.getElementById('prev-page');
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => {
                this.handlePagination('prev');
            });
        }
        
        const nextPageBtn = document.getElementById('next-page');
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => {
                this.handlePagination('next');
            });
        }
        
        // Refresh data button
        const refreshDataBtn = document.getElementById('refresh-data-btn');
        if (refreshDataBtn) {
            refreshDataBtn.addEventListener('click', () => {
                this.refreshDashboard();
            });
        }
        
        // Timeline filter
        const timelineFilter = document.getElementById('timeline-filter');
        if (timelineFilter) {
            timelineFilter.addEventListener('change', () => {
                this.handleTimelineFilter();
            });
        }
        
        // Import data button
        const importDataBtn = document.getElementById('import-data-btn');
        if (importDataBtn) {
            importDataBtn.addEventListener('click', () => {
                this.handleImportData();
            });
        }
        
        // CSV file input
        const csvFileInput = document.getElementById('csv-file-input');
        if (csvFileInput) {
            csvFileInput.addEventListener('change', (e) => {
                this.handleCsvFileUpload(e);
            });
        }
        
        // Role selector in roadmap
        const roleSelector = document.getElementById('role-selector');
        if (roleSelector) {
            roleSelector.addEventListener('change', () => {
                this.handleRoleSelection(roleSelector.value);
            });
        }
    },
    
    /**
     * Switch main content section
     * @param {string} contentId - Content ID
     */
    switchContent: function(contentId) {
        // Update navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('data-content') === contentId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Update content visibility
        const contentDivs = document.querySelectorAll('.content');
        contentDivs.forEach(div => {
            if (div.id === `${contentId}-content`) {
                div.classList.add('active');
            } else {
                div.classList.remove('active');
            }
        });
        
        // Load content based on section
        this.loadSectionContent(contentId);
    },
    
    /**
     * Load section-specific content
     * @param {string} sectionId - Section ID
     */
    loadSectionContent: async function(sectionId) {
        switch (sectionId) {
            case 'dashboard':
                await this.loadDashboard();
                break;
                
            case 'jobs':
                await this.loadJobMatches();
                break;
                
            case 'skills':
                await this.loadSkillAnalysis();
                break;
                
            case 'roadmap':
                await this.loadCareerRoadmap();
                break;
                
            case 'profile':
                await ProfileManager.loadUserProfile();
                break;
        }
    },
    
    /**
     * Switch profile section
     * @param {string} sectionId - Section ID
     */
    switchProfileSection: function(sectionId) {
        // Update navigation items
        const navItems = document.querySelectorAll('.profile-nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Update content visibility
        const sectionDivs = document.querySelectorAll('.profile-section-content');
        sectionDivs.forEach(div => {
            if (div.id === `${sectionId}-section`) {
                div.classList.remove('hidden');
            } else {
                div.classList.add('hidden');
            }
        });
    },
    
    /**
     * Switch profile modal tab
     * @param {string} tabId - Tab ID
     */
    switchProfileTab: function(tabId) {
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
     * Open a modal
     * @param {string} modalId - Modal ID
     */
    openModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            
            // If it's the profile modal, populate with current data
            if (modalId === 'profile-modal') {
                this.populateProfileForm();
            }
        }
    },
    
    /**
     * Close a modal
     * @param {string} modalId - Modal ID
     */
    closeModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            
            // Reset forms
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
        }
    },
    
    /**
     * Open add skill modal
     */
    openAddSkillModal: function() {
        // Reset form first
        const form = document.getElementById('add-skill-form');
        if (form) {
            form.reset();
        }
        
        // Update modal title and submit button
        const modal = document.getElementById('add-skill-modal');
        modal.querySelector('h2').textContent = 'Add New Skill';
        const submitButton = modal.querySelector('button[type="submit"]');
        submitButton.textContent = 'Add Skill';
        
        // Open modal
        this.openModal('add-skill-modal');
    },
    
    /**
     * Open add experience modal
     */
    openAddExperienceModal: function() {
        // Reset form first
        const form = document.getElementById('add-experience-form');
        if (form) {
            form.reset();
        }
        
        // Update modal title and submit button
        const modal = document.getElementById('add-experience-modal');
        modal.querySelector('h2').textContent = 'Add Work Experience';
        const submitButton = modal.querySelector('button[type="submit"]');
        submitButton.textContent = 'Add Experience';
        
        // Open modal
        this.openModal('add-experience-modal');
    },
    
    /**
     * Populate profile form with current data
     */
    populateProfileForm: async function() {
        try {
            const profile = await DataManager.getUserProfile();
            const preferences = await DataManager.getUserPreferences();
            const skills = await DataManager.getUserSkills();
            const domains = await DataManager.getUserDomains();
            
            // Basic info
            document.getElementById('user-name-input').value = profile.name || '';
            document.getElementById('user-email').value = profile.email || '';
            document.getElementById('user-location-input').value = profile.location || '';
            document.getElementById('user-education').value = profile.education || '';
            
            // Skills & Experience
            document.getElementById('user-skills').value = skills.map(skill => skill.name).join(', ');
            document.getElementById('user-experience').value = profile.experience || '';
            document.getElementById('user-job-title').value = profile.jobTitle || '';
            document.getElementById('user-current-salary').value = profile.currentSalary || '';
            
            // Switch to first tab
            this.switchProfileTab('basic-info');
        } catch (error) {
            console.error('Error populating profile form:', error);
        }
    },
    
    /**
     * Handle profile form submission
     */
    handleProfileFormSubmit: async function() {
        try {
            // Get form data
            const formData = {
                name: document.getElementById('user-name-input').value,
                email: document.getElementById('user-email').value,
                location: document.getElementById('user-location-input').value,
                education: document.getElementById('user-education').value,
                skills: document.getElementById('user-skills').value,
                experience: document.getElementById('user-experience').value,
                jobTitle: document.getElementById('user-job-title').value,
                currentSalary: document.getElementById('user-current-salary').value
            };
            
            // Validate form
            if (!formData.name || !formData.email) {
                Utils.showNotification(
                    'Error',
                    'Name and email are required fields.',
                    'error'
                );
                return;
            }
            
            if (!Utils.isValidEmail(formData.email)) {
                Utils.showNotification(
                    'Error',
                    'Please enter a valid email address.',
                    'error'
                );
                return;
            }
            
            // Save profile
            const result = await ProfileManager.saveProfile(formData);
            
            if (result) {
                Utils.showNotification(
                    'Success',
                    'Profile updated successfully.',
                    'success'
                );
                
                this.closeModal('profile-modal');
                
                // Refresh dashboard if needed
                this.refreshDashboard();
            } else {
                Utils.showNotification(
                    'Error',
                    'Failed to update profile.',
                    'error'
                );
            }
        } catch (error) {
            console.error('Error handling profile form submit:', error);
            Utils.showNotification(
                'Error',
                'An error occurred while saving your profile.',
                'error'
            );
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
            
            // Validate form
            if (!skillName || !skillLevel) {
                Utils.showNotification(
                    'Error',
                    'Skill name and level are required fields.',
                    'error'
                );
                return;
            }
            
            if (isNaN(skillExperience) || skillExperience < 0) {
                Utils.showNotification(
                    'Error',
                    'Please enter a valid experience value.',
                    'error'
                );
                return;
            }
            
            // Add skill
            const result = await ProfileManager.addSkill({
                name: skillName,
                level: skillLevel,
                experience: skillExperience
            });
            
            if (result) {
                Utils.showNotification(
                    'Success',
                    'Skill added successfully.',
                    'success'
                );
                
                this.closeModal('add-skill-modal');
            }
        } catch (error) {
            console.error('Error handling add skill form submit:', error);
            Utils.showNotification(
                'Error',
                'An error occurred while adding the skill.',
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
            const jobStartDate = document.getElementById('job-start-date').value;
            const jobEndDate = document.getElementById('job-end-date').value;
            const currentPosition = document.getElementById('current-position').checked;
            const jobDescription = document.getElementById('job-description').value;
            
            // Validate form
            if (!jobTitle || !companyName || !jobStartDate) {
                Utils.showNotification(
                    'Error',
                    'Job title, company, and start date are required fields.',
                    'error'
                );
                return;
            }
            
            if (!currentPosition && !jobEndDate) {
                Utils.showNotification(
                    'Error',
                    'Please provide an end date or check "I currently work here".',
                    'error'
                );
                return;
            }
            
            // Add experience
            const result = await ProfileManager.addExperience({
                title: jobTitle,
                company: companyName,
                startDate: jobStartDate,
                endDate: currentPosition ? null : jobEndDate,
                isCurrent: currentPosition,
                description: jobDescription
            });
            
            if (result) {
                Utils.showNotification(
                    'Success',
                    'Experience added successfully.',
                    'success'
                );
                
                this.closeModal('add-experience-modal');
            }
        } catch (error) {
            console.error('Error handling add experience form submit:', error);
            Utils.showNotification(
                'Error',
                'An error occurred while adding the experience.',
                'error'
            );
        }
    },
    
    /**
     * Load dashboard data
     */
    loadDashboard: async function() {
        try {
            Utils.showNotification(
                'Loading',
                'Fetching dashboard data...',
                'info',
                2000
            );
            
            const dashboardData = await API.getDashboardData();
            
            // Update metrics
            document.getElementById('match-percentage').textContent = `${dashboardData.topMatchScore}%`;
            document.getElementById('skills-count').textContent = dashboardData.skillsCount;
            document.getElementById('market-demand').textContent = dashboardData.marketDemand;
            document.getElementById('salary-potential').textContent = Utils.formatCurrency(dashboardData.salaryPotential);
            
            // Update top jobs
            this.renderTopJobs(dashboardData.topJobs);
            
            // Update insights
            document.getElementById('skill-gap-insight').textContent = dashboardData.skillGapInsight;
            document.getElementById('market-trends-insight').textContent = dashboardData.marketTrendInsight;
            
            // Create charts
            ChartManager.createDashboardCharts(dashboardData);
        } catch (error) {
            console.error('Error loading dashboard:', error);
            Utils.showNotification(
                'Error',
                'Failed to load dashboard data.',
                'error'
            );
        }
    },
    
    /**
     * Refresh dashboard data
     */
    refreshDashboard: async function() {
        Utils.showNotification(
            'Refreshing',
            'Updating dashboard data...',
            'info',
            2000
        );
        
        await this.loadDashboard();
    },
    
    /**
     * Render top job matches
     * @param {Array} jobs - Job data
     */
    renderTopJobs: function(jobs) {
        const container = document.getElementById('top-jobs-container');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        if (jobs.length === 0) {
            container.innerHTML = `
                <p class="empty-message">No job matches found. Complete your profile to get personalized matches.</p>
            `;
            return;
        }
        
        jobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.setAttribute('data-id', job.id);
            
            jobCard.innerHTML = `
                <div class="job-header">
                    <div class="company-logo">${job.companyLogo || job.company.charAt(0)}</div>
                    <div class="job-company">
                        <h4>${job.company}</h4>
                        <span>${job.location}</span>
                    </div>
                    <div class="job-match">${job.calculatedMatchScore || job.matchScore}% Match</div>
                </div>
                <h3 class="job-title">${job.title}</h3>
                <div class="job-details">
                    <div class="job-detail">
                        <i class="fas fa-money-bill-wave"></i> ${job.salary}
                    </div>
                    <div class="job-detail">
                        <i class="fas fa-briefcase"></i> ${job.jobType}
                    </div>
                    <div class="job-detail">
                        <i class="fas fa-clock"></i> ${job.experience}
                    </div>
                </div>
                <div class="job-skills">
                    ${job.skills.slice(0, 3).map(skill => `<div class="skill-tag">${skill}</div>`).join('')}
                    ${job.skills.length > 3 ? `<div class="skill-tag">+${job.skills.length - 3} more</div>` : ''}
                </div>
            `;
            
            // Add click event to open job details
            jobCard.addEventListener('click', () => {
                this.showJobDetails(job.id);
            });
            
            container.appendChild(jobCard);
        });
    },
    
    /**
     * Load job matches
     */
    loadJobMatches: async function() {
        try {
            Utils.showNotification(
                'Loading',
                'Fetching job matches...',
                'info',
                2000
            );
            
            // Get initial jobs without filters
            const result = await MatchingEngine.getAllMatches();
            
            // Update matches count
            document.getElementById('new-matches-count').textContent = `${result.pagination.totalJobs} job matches`;
            
            // Render jobs
            this.renderAllJobs(result.jobs, result.pagination);
        } catch (error) {
            console.error('Error loading job matches:', error);
            Utils.showNotification(
                'Error',
                'Failed to load job matches.',
                'error'
            );
        }
    },
    
    /**
     * Render all job matches
     * @param {Array} jobs - Job data
     * @param {Object} pagination - Pagination data
     */
    renderAllJobs: function(jobs, pagination) {
        const container = document.getElementById('all-jobs-container');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        if (jobs.length === 0) {
            container.innerHTML = `
                <p class="empty-message">No job matches found. Try adjusting your filters.</p>
            `;
            
            // Update pagination
            document.getElementById('page-indicator').textContent = 'Page 0 of 0';
            document.getElementById('prev-page').disabled = true;
            document.getElementById('next-page').disabled = true;
            
            return;
        }
        
        jobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.setAttribute('data-id', job.id);
            
            jobCard.innerHTML = `
                <div class="job-header">
                    <div class="company-logo">${job.companyLogo || job.company.charAt(0)}</div>
                    <div class="job-company">
                        <h4>${job.company}</h4>
                        <span>${job.location}</span>
                    </div>
                    <div class="job-match">${job.calculatedMatchScore || job.matchScore}% Match</div>
                </div>
                <h3 class="job-title">${job.title}</h3>
                <div class="job-details">
                    <div class="job-detail">
                        <i class="fas fa-money-bill-wave"></i> ${job.salary}
                    </div>
                    <div class="job-detail">
                        <i class="fas fa-briefcase"></i> ${job.jobType}
                    </div>
                    <div class="job-detail">
                        <i class="fas fa-clock"></i> ${job.experience}
                    </div>
                </div>
                <div class="job-skills">
                    ${job.skills.slice(0, 3).map(skill => `<div class="skill-tag">${skill}</div>`).join('')}
                    ${job.skills.length > 3 ? `<div class="skill-tag">+${job.skills.length - 3} more</div>` : ''}
                </div>
            `;
            
            // Add click event to open job details
            jobCard.addEventListener('click', () => {
                this.showJobDetails(job.id);
            });
            
            container.appendChild(jobCard);
        });
        
        // Update pagination
        document.getElementById('page-indicator').textContent = `Page ${pagination.currentPage} of ${pagination.totalPages}`;
        document.getElementById('prev-page').disabled = !pagination.hasPrev;
        document.getElementById('next-page').disabled = !pagination.hasNext;
        
        // Store pagination data
        this.currentPagination = pagination;
    },
    
    /**
     * Handle job search
     */
    handleJobSearch: async function() {
        try {
            const searchTerm = document.getElementById('job-search-input').value;
            
            // Get filter values
            const roleFilter = document.getElementById('role-filter').value;
            const locationFilter = document.getElementById('location-filter').value;
            const experienceFilter = document.getElementById('experience-filter').value;
            const salaryFilter = document.getElementById('salary-filter').value;
            
            // Apply filters
            const filters = {
                search: searchTerm,
                role: roleFilter,
                location: locationFilter,
                experience: experienceFilter,
                salary: salaryFilter
            };
            
            const result = await MatchingEngine.getAllMatches(filters);
            
            // Update matches count
            document.getElementById('new-matches-count').textContent = `${result.pagination.totalJobs} job matches`;
            
            // Render jobs
            this.renderAllJobs(result.jobs, result.pagination);
        } catch (error) {
            console.error('Error handling job search:', error);
        }
    },
    
    /**
     * Handle job filters
     */
    handleJobFilters: async function() {
        try {
            // Get filter values
            const searchTerm = document.getElementById('job-search-input').value;
            const roleFilter = document.getElementById('role-filter').value;
            const locationFilter = document.getElementById('location-filter').value;
            const experienceFilter = document.getElementById('experience-filter').value;
            const salaryFilter = document.getElementById('salary-filter').value;
            
            // Apply filters
            const filters = {
                search: searchTerm,
                role: roleFilter,
                location: locationFilter,
                experience: experienceFilter,
                salary: salaryFilter
            };
            
            const result = await MatchingEngine.getAllMatches(filters);
            
            // Update matches count
            document.getElementById('new-matches-count').textContent = `${result.pagination.totalJobs} job matches`;
            
            // Render jobs
            this.renderAllJobs(result.jobs, result.pagination);
            
            // Store current filters
            this.currentFilters = filters;
        } catch (error) {
            console.error('Error handling job filters:', error);
            Utils.showNotification(
                'Error',
                'Failed to apply filters.',
                'error'
            );
        }
    },
    
    /**
     * Handle pagination
     * @param {string} direction - Pagination direction ('prev' or 'next')
     */
    handlePagination: async function(direction) {
        try {
            if (!this.currentPagination) return;
            
            let page = this.currentPagination.currentPage;
            
            if (direction === 'prev' && this.currentPagination.hasPrev) {
                page--;
            } else if (direction === 'next' && this.currentPagination.hasNext) {
                page++;
            } else {
                return;
            }
            
            const result = await MatchingEngine.getAllMatches(this.currentFilters || {}, page);
            
            // Render jobs
            this.renderAllJobs(result.jobs, result.pagination);
        } catch (error) {
            console.error('Error handling pagination:', error);
        }
    },
    
    /**
     * Show job details
     * @param {string} jobId - Job ID
     */
    showJobDetails: async function(jobId) {
        try {
            const job = await MatchingEngine.getJobDetails(jobId);
            
            if (!job) {
                Utils.showNotification(
                    'Error',
                    'Failed to load job details.',
                    'error'
                );
                return;
            }
            
            // Check if job is saved
            const isSaved = await MatchingEngine.isJobSaved(jobId);
            
            // Populate job details modal
            const container = document.getElementById('job-details-container');
            
            container.innerHTML = `
                <div class="job-details-header">
                    <div class="job-details-company-logo">${job.companyLogo || job.company.charAt(0)}</div>
                    <div class="job-details-info">
                        <h2 class="job-details-title">${job.title}</h2>
                        <div class="job-details-company">${job.company} - ${job.location}</div>
                        <div class="job-details-match">${job.calculatedMatchScore || job.matchScore}% Match</div>
                    </div>
                </div>
                
                <div class="job-details-actions">
                    <a href="#" class="apply-btn"><i class="fas fa-paper-plane"></i> Apply Now</a>
                    <a href="#" class="save-btn" id="save-job-btn">
                        <i class="fas ${isSaved ? 'fa-bookmark' : 'fa-bookmark-o'}"></i> 
                        ${isSaved ? 'Saved' : 'Save Job'}
                    </a>
                </div>
                
                <div class="job-details-section">
                    <h3>Job Details</h3>
                    <div class="job-details">
                        <div class="job-detail"><i class="fas fa-money-bill-wave"></i> Salary: ${job.salary}</div>
                        <div class="job-detail"><i class="fas fa-briefcase"></i> Job Type: ${job.jobType}</div>
                        <div class="job-detail"><i class="fas fa-clock"></i> Experience: ${job.experience}</div>
                        <div class="job-detail"><i class="fas fa-calendar"></i> Posted: ${Utils.formatDate(job.postedDate)}</div>
                    </div>
                </div>
                
                <div class="job-details-section">
                    <h3>Job Description</h3>
                    <div class="job-description">${job.description}</div>
                </div>
                
                <div class="job-details-section">
                    <h3>Requirements</h3>
                    <ul class="job-requirements-list">
                        ${job.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="job-details-section">
                    <h3>Benefits</h3>
                    <ul class="job-benefits-list">
                        ${job.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="job-details-section job-skills-match">
                    <h3>Skills Match</h3>
                    ${job.skillMatches.map(skill => `
                        <div class="skill-match-item">
                            <div class="skill-match-name">${skill.name}</div>
                            <div class="skill-match-bar">
                                <div class="skill-match-progress" style="width: ${skill.percentage}%"></div>
                            </div>
                            <div class="skill-match-percentage">${skill.percentage}%</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="job-company-info">
                    <div class="company-info-logo">${job.companyLogo || job.company.charAt(0)}</div>
                    <div class="company-info-details">
                        <div class="company-info-name">${job.company}</div>
                        <div class="company-info-description">${job.companyInfo}</div>
                    </div>
                </div>
            `;
            
            // Add save job functionality
            const saveJobBtn = container.querySelector('#save-job-btn');
            saveJobBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSaveJob(jobId, saveJobBtn);
            });
            
            // Open modal
            this.openModal('job-details-modal');
        } catch (error) {
            console.error('Error showing job details:', error);
            Utils.showNotification(
                'Error',
                'Failed to load job details.',
                'error'
            );
        }
    },
    
    /**
     * Toggle save job
     * @param {string} jobId - Job ID
     * @param {HTMLElement} button - Button element
     */
    toggleSaveJob: async function(jobId, button) {
        try {
            const isSaved = await MatchingEngine.toggleJobSaved(jobId);
            
            // Update button
            const icon = button.querySelector('i');
            
            if (isSaved) {
                icon.className = 'fas fa-bookmark';
                button.textContent = ' Saved';
                button.prepend(icon);
                
                Utils.showNotification(
                    'Success',
                    'Job saved successfully.',
                    'success'
                );
            } else {
                icon.className = 'fas fa-bookmark-o';
                button.textContent = ' Save Job';
                button.prepend(icon);
                
                Utils.showNotification(
                    'Success',
                    'Job removed from saved jobs.',
                    'success'
                );
            }
        } catch (error) {
            console.error('Error toggling save job:', error);
            Utils.showNotification(
                'Error',
                'Failed to save job.',
                'error'
            );
        }
    },
    
    /**
     * Load skill analysis
     */
    loadSkillAnalysis: async function() {
        try {
            Utils.showNotification(
                'Loading',
                'Analyzing your skills...',
                'info',
                2000
            );
            
            // Get skill analysis data
            const userSkills = await MatchingEngine.getUserSkillsWithInsights();
            const skillGaps = await MatchingEngine.getSkillGaps();
            const targetRoleSkills = await MatchingEngine.getTargetRoleSkills();
            
            // Create radar chart
            ChartManager.createSkillRadarChart(userSkills);
            
            // Create skill value chart
            ChartManager.createSkillValueChart(userSkills);
            
            // Render skill gaps
            this.renderSkillGaps(skillGaps);
            
            // Render target role skills
            this.renderTargetRoleSkills(targetRoleSkills);
            
            // Load learning paths
            await this.loadLearningPaths();
        } catch (error) {
            console.error('Error loading skill analysis:', error);
            Utils.showNotification(
                'Error',
                'Failed to load skill analysis.',
                'error'
            );
        }
    },
    
    /**
     * Render skill gaps
     * @param {Array} skillGaps - Skill gaps data
     */
    renderSkillGaps: function(skillGaps) {
        const container = document.getElementById('skill-gaps-container');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        if (skillGaps.length === 0) {
            container.innerHTML = `
                <p class="empty-message">No skill gaps identified. Your skills are well-aligned with your target role.</p>
            `;
            return;
        }
        
        // Sort by gap (highest first)
        const sortedGaps = [...skillGaps].sort((a, b) => b.gap - a.gap);
        
        sortedGaps.forEach(skill => {
            const skillGapItem = document.createElement('div');
            skillGapItem.className = 'skill-gap-item';
            
            skillGapItem.innerHTML = `
                <div class="skill-info">
                    <div class="skill-name">${skill.name}</div>
                    <div class="skill-demand">Market Demand: ${skill.demand}/100</div>
                    <div class="skill-progress">
                        <div class="skill-progress-bar" style="width: ${skill.userLevel}%; background-color: ${Utils.getPercentageColor(skill.userLevel, true)}"></div>
                    </div>
                </div>
                <div class="skill-action">
                    <button class="learn-btn">Learn</button>
                </div>
            `;
            
            container.appendChild(skillGapItem);
        });
        
        // Add event listeners to learn buttons
        const learnButtons = container.querySelectorAll('.learn-btn');
        learnButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                this.switchContent('roadmap');
            });
        });
    },
    
    /**
     * Render target role skills
     * @param {Array} targetSkills - Target role skills
     */
    renderTargetRoleSkills: function(targetSkills) {
        const container = document.getElementById('target-skills-container');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        if (targetSkills.length === 0) {
            container.innerHTML = `
                <p class="empty-message">No target role skills available. Please select a target role in your preferences.</p>
            `;
            return;
        }
        
        // Sort by importance
        const importancePriority = {
            'Critical': 3,
            'Important': 2,
            'Useful': 1
        };
        
        const sortedSkills = [...targetSkills].sort((a, b) => 
            importancePriority[b.importance] - importancePriority[a.importance]
        );
        
        sortedSkills.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-gap-item';
            
            // Get color based on importance
            let importanceColor;
            switch (skill.importance) {
                case 'Critical':
                    importanceColor = '#e74c3c';
                    break;
                case 'Important':
                    importanceColor = '#f39c12';
                    break;
                case 'Useful':
                    importanceColor = '#3498db';
                    break;
                default:
                    importanceColor = '#95a5a6';
            }
            
            skillItem.innerHTML = `
                <div class="skill-info">
                    <div class="skill-name">${skill.name}</div>
                    <div class="skill-demand">Required Level: ${skill.level} <span style="color: ${importanceColor}; font-weight: bold;">(${skill.importance})</span></div>
                    <div class="skill-progress">
                        <div class="skill-progress-bar" style="width: ${this._getSkillLevelPercentage(skill.level)}%; background-color: ${importanceColor}"></div>
                    </div>
                </div>
            `;
            
            container.appendChild(skillItem);
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
     * Load learning paths
     */
    loadLearningPaths: async function() {
        try {
            const learningPaths = await API.getLearningPaths();
            
            // Render learning paths
            this.renderLearningPaths(learningPaths);
        } catch (error) {
            console.error('Error loading learning paths:', error);
        }
    },
    
    /**
     * Render learning paths
     * @param {Array} paths - Learning paths data
     */
    renderLearningPaths: function(paths) {
        const container = document.getElementById('learning-paths-container');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        if (paths.length === 0) {
            container.innerHTML = `
                <p class="empty-message">No learning paths available. Add more skills to get personalized recommendations.</p>
            `;
            return;
        }
        
        // Sort by relevance (highest first)
        const sortedPaths = [...paths].sort((a, b) => b.calculatedRelevance - a.calculatedRelevance);
        
        sortedPaths.forEach(path => {
            const pathCard = document.createElement('div');
            pathCard.className = 'learning-path-card';
            pathCard.setAttribute('data-id', path.id);
            
            pathCard.innerHTML = `
                <h3 class="learning-path-title">${path.title}</h3>
                <p class="learning-path-info">${path.description}</p>
                <div class="learning-path-skills">
                    ${path.skills.map(skill => `
                        <div class="learning-path-skill">
                            <i class="fas fa-check-circle"></i> ${skill}
                        </div>
                    `).join('')}
                </div>
                <div class="learning-path-details">
                    <div class="learning-path-detail">
                        <div class="detail-value">${path.duration}</div>
                        <div class="detail-label">Duration</div>
                    </div>
                    <div class="learning-path-detail">
                        <div class="detail-value">${path.difficulty}</div>
                        <div class="detail-label">Difficulty</div>
                    </div>
                    <div class="learning-path-detail">
                        <div class="detail-value">${path.calculatedRelevance}%</div>
                        <div class="detail-label">Relevance</div>
                    </div>
                </div>
                <a href="#" class="view-path-btn">View Path</a>
            `;
            
            container.appendChild(pathCard);
        });
        
        // Add event listeners
        const viewButtons = container.querySelectorAll('.view-path-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const pathId = e.target.closest('.learning-path-card').getAttribute('data-id');
                this.switchContent('roadmap');
            });
        });
    },
    
    /**
     * Load career roadmap
     */
    loadCareerRoadmap: async function() {
        try {
            Utils.showNotification(
                'Loading',
                'Building your career roadmap...',
                'info',
                2000
            );
            
            // Get user preferences to determine target role
            const preferences = await DataManager.getUserPreferences() || {};
            const targetRole = preferences.targetRole || '';
            
            // Set the current role in the selector
            const roleSelector = document.getElementById('role-selector');
            if (roleSelector) {
                // Find the best matching option
                let bestMatch = '';
                for (let i = 0; i < roleSelector.options.length; i++) {
                    const option = roleSelector.options[i];
                    if (targetRole.toLowerCase().includes(option.value.toLowerCase()) && 
                        option.value.length > bestMatch.length) {
                        bestMatch = option.value;
                    }
                }
                
                // Set the selected option
                if (bestMatch) {
                    roleSelector.value = bestMatch;
                }
            }
            
            // Update displayed role
            const roleDisplay = document.getElementById('career-path-role');
            if (roleDisplay && targetRole) {
                roleDisplay.textContent = targetRole;
            }
            
            // Get roadmap data
            const roadmap = await RoadmapManager.generatePersonalizedRoadmap();
            
            // Render career path
            this.renderCareerPath(roadmap.careerPath);
            
            // Render timeline
            this.renderRoadmapTimeline(roadmap.timeline);
            
            // Create experience-salary chart
            ChartManager.createExperienceSalaryChart(roadmap.experienceSalary);
        } catch (error) {
            console.error('Error loading career roadmap:', error);
            Utils.showNotification(
                'Error',
                'Failed to load career roadmap.',
                'error'
            );
        }
    },
    
    /**
     * Handle role selection for roadmap
     * @param {string} role - Selected role
     */
    handleRoleSelection: async function(role) {
        if (!role) return;
        
        try {
            // Show loading notification
            Utils.showNotification(
                'Loading',
                `Loading career roadmap for ${role}...`,
                'info',
                2000
            );
            
            // Update displayed role
            const roleDisplay = document.getElementById('career-path-role');
            if (roleDisplay) {
                roleDisplay.textContent = role;
            }
            
            // Get roadmap data for the selected role
            let roadmap;
            
            if (typeof RoleRoadmaps !== 'undefined') {
                // Use the role-specific roadmap data
                const careerPath = RoleRoadmaps.getCareerPath(role);
                const timeline = RoleRoadmaps.getTimeline(role);
                const experienceSalary = RoleRoadmaps.getExperienceSalaryData(role);
                
                // Get profile data
                const profile = await DataManager.getUserProfile();
                const experience = profile.experience || 0;
                
                // Customize career path based on experience
                const customizedCareerPath = RoadmapManager._customizeCareerPath(
                    careerPath, 
                    experience, 
                    role
                );
                
                roadmap = {
                    careerPath: customizedCareerPath,
                    timeline: timeline,
                    experienceSalary: experienceSalary
                };
            } else {
                // Fall back to the personalized roadmap
                roadmap = await RoadmapManager.generatePersonalizedRoadmap();
            }
            
            // Render the roadmap
            this.renderCareerPath(roadmap.careerPath);
            this.renderRoadmapTimeline(roadmap.timeline);
            ChartManager.createExperienceSalaryChart(roadmap.experienceSalary);
        } catch (error) {
            console.error('Error handling role selection:', error);
            Utils.showNotification(
                'Error',
                'Failed to load roadmap for the selected role.',
                'error'
            );
        }
    },
    
    /**
     * Render career path
     * @param {Array} careerPath - Career path data
     */
    renderCareerPath: function(careerPath) {
        const container = document.getElementById('career-path-container');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        if (careerPath.length === 0) {
            container.innerHTML = `
                <p class="empty-message">No career path available. Complete your profile to see your personalized path.</p>
            `;
            return;
        }
        
        careerPath.forEach(step => {
            const stepElement = document.createElement('div');
            stepElement.className = 'career-path-step';
            
            stepElement.innerHTML = `
                <div class="step-indicator">${step.step}</div>
                <div class="step-content">
                    <div class="step-title ${step.current ? 'current-step' : ''}">${step.title}</div>
                    <div class="step-description">${step.description}</div>
                    ${step.alternativeTitle ? `
                        <div class="step-alternative">
                            <div class="alternative-title">Alternative: ${step.alternativeTitle}</div>
                            <div class="alternative-description">${step.alternativeDescription}</div>
                        </div>
                    ` : ''}
                </div>
            `;
            
            container.appendChild(stepElement);
        });
    },
    
    /**
     * Render roadmap timeline
     * @param {Array} timeline - Timeline data
     */
    renderRoadmapTimeline: function(timeline) {
        const container = document.getElementById('roadmap-timeline');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        if (timeline.length === 0) {
            container.innerHTML = `
                <p class="empty-message">No timeline available. Complete your profile to see your skill development timeline.</p>
            `;
            return;
        }
        
        timeline.forEach(item => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            
            timelineItem.innerHTML = `
                <div class="timeline-date">${item.date}</div>
                <div class="timeline-title">${item.title}</div>
                <div class="timeline-description">${item.description}</div>
                ${item.existingSkills ? `
                    <div class="timeline-existing-skills">
                        <strong>Skills you already have:</strong> ${item.existingSkills.join(', ')}
                    </div>
                ` : ''}
                <div class="timeline-skills">
                    ${item.skills.map(skill => `<div class="skill-tag">${skill}</div>`).join('')}
                </div>
            `;
            
            container.appendChild(timelineItem);
        });
    },
    
    /**
     * Handle timeline filter
     */
    handleTimelineFilter: async function() {
        try {
            const months = parseInt(document.getElementById('timeline-filter').value);
            
            // Get timeline data
            const timeline = await RoadmapManager.getTimeline(months);
            
            // Render timeline
            this.renderRoadmapTimeline(timeline);
        } catch (error) {
            console.error('Error handling timeline filter:', error);
        }
    },
    
    /**
     * Handle import data
     */
    handleImportData: function() {
        // Trigger file input click
        document.getElementById('csv-file-input').click();
    },
    
    /**
     * Handle CSV file upload
     * @param {Event} event - File input change event
     */
    handleCsvFileUpload: async function(event) {
        try {
            const file = event.target.files[0];
            
            if (!file) {
                return;
            }
            
            // Check file type
            if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
                Utils.showNotification(
                    'Error',
                    'Please upload a CSV file.',
                    'error'
                );
                return;
            }
            
            // Import skills from CSV
            Utils.showNotification(
                'Importing',
                'Processing CSV file...',
                'info',
                2000
            );
            
            const result = await ProfileManager.importSkillsFromCSV(file);
            
            // Reset file input
            event.target.value = '';
        } catch (error) {
            console.error('Error handling CSV file upload:', error);
            Utils.showNotification(
                'Error',
                'Failed to process CSV file.',
                'error'
            );
        }
    }
};