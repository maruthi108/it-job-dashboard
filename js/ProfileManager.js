/**
 * Profile management for TechCareerMatch
 * Handles user profile data, skills, and experience
 */

const ProfileManager = {
  /**
   * Initialize profile manager
   * @returns {Promise<boolean>} Success indicator
   */
  init: async function() {
      try {
          console.log('ProfileManager initialized');
          
          // Set up event listeners
          this._setupEventListeners();
          
          return true;
      } catch (error) {
          console.error('Error initializing ProfileManager:', error);
          return false;
      }
  },
  
  /**
   * Setup event listeners
   */
  _setupEventListeners: function() {
      // Profile form event listeners
      const profileForm = document.getElementById('profile-form');
      if (profileForm) {
          profileForm.addEventListener('submit', (e) => {
              e.preventDefault();
              this.handleProfileFormSubmit();
          });
      }
      
      // Other event listeners...
      
      // Role selection change event
      const targetRoleSelect = document.getElementById('user-role');
      if (targetRoleSelect) {
          targetRoleSelect.addEventListener('change', (e) => {
              const selectedRole = e.target.value;
              if (selectedRole) {
                  console.log("Role selected:", selectedRole);
                  this._previewJobMatchesForRole(selectedRole);
              }
          });
      }
  },
  
  /**
   * Load user profile data
   */
  loadUserProfile: async function() {
      try {
          const profile = await DataManager.getUserProfile();
          const preferences = await DataManager.getUserPreferences();
          
          // Update UI with profile data
          document.getElementById('profile-name').textContent = profile.name || 'Your Name';
          document.getElementById('profile-headline').textContent = profile.jobTitle || 'Complete your profile';
          document.getElementById('location-value').textContent = profile.location || 'Not specified';
          document.getElementById('education-value').textContent = profile.education || 'Not specified';
          
          // Update display name in header
          const userDisplayName = document.getElementById('user-display-name');
          if (userDisplayName) {
              userDisplayName.textContent = profile.name || 'Guest';
          }
          
          // Update dashboard welcome
          const userNameElement = document.getElementById('user-name');
          if (userNameElement) {
              userNameElement.textContent = profile.name || 'IT Professional';
          }
          
          // Update job matches based on target role
          if (preferences && preferences.targetRole) {
              this.updateJobMatchesForRole(preferences.targetRole);
          }
          
          return true;
      } catch (error) {
          console.error('Error loading user profile:', error);
          return false;
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

          // Update job matches based on the selected role
          const targetRole = formData.targetRole;
          if (targetRole) {
              try {
                  const roleJobs = await API.getJobMatchesByCategory(targetRole);
                  const topJobs = roleJobs.slice(0, 4);
                  UI.renderTopJobs(topJobs);
                  
                  if (document.getElementById('dashboard-content').classList.contains('active')) {
                      UI.refreshDashboard();
                  }
              } catch (err) {
                  console.error('Error updating job matches:', err);
              }
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
 * Show a preview of job matches for a selected role without saving
 * @param {string} role - The selected role
 */
_previewJobMatchesForRole: function(role) {
  // Show a notification to inform the user
  Utils.showNotification(
    'Preview',
    `Showing job matches for ${role}. Save your profile to update your dashboard.`,
    'info',
    3000
  );
  
  // After a short delay, update the job listings
  setTimeout(() => {
    this.updateJobMatchesForRole(role);
  }, 500);
},
  
/**
 * Update job matches based on selected role
 * @param {string} role - The selected role
 */
updateJobMatchesForRole: async function(role) {
  try {
    if (!role) return;
    
    // Map roles to job ID prefixes
    const roleMap = {
      'Frontend Developer': 'job_fe_',
      'Backend Developer': 'job_be_',
      'UI/UX Designer': 'job_ux_',
      'Full Stack Developer': 'job_fs_',
      'DevOps Engineer': 'job_do_',
      'Data Scientist': 'job_ds_',
      'Mobile App Developer': 'job_ma_'
    };
    
    // Find the matching prefix
    let prefix = null;
    for (const [key, value] of Object.entries(roleMap)) {
      if (role.includes(key)) {
        prefix = value;
        break;
      }
    }
    
    // Get all jobs
    let allJobs = [];
    if (typeof JobListingsData !== 'undefined') {
      allJobs = JobListingsData.getAllJobs();
    } else {
      allJobs = DataManager.getSampleJobs();
    }
    
    // Filter jobs by prefix if we have one
    let roleJobs = allJobs;
    if (prefix) {
      roleJobs = allJobs.filter(job => job.id.startsWith(prefix));
      console.log(`Found ${roleJobs.length} jobs with prefix ${prefix}`);
    } else {
      // Fallback to text search if no category match
      roleJobs = allJobs.filter(job => 
        job.title.toLowerCase().includes(role.toLowerCase())
      );
      console.log(`Found ${roleJobs.length} jobs containing ${role}`);
    }
    
    // Sort by match score
    roleJobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    
    // Take top 4 jobs for dashboard
    const topJobs = roleJobs.slice(0, 4);
    
    // Update the top jobs in the dashboard
    if (typeof UI !== 'undefined' && typeof UI.renderTopJobs === 'function') {
      UI.renderTopJobs(topJobs);
    } else {
      // Manual fallback to update the UI
      const topJobsContainer = document.getElementById('top-jobs-container');
      if (topJobsContainer) {
        // Clear previous jobs
        topJobsContainer.innerHTML = '';
        
        if (topJobs.length === 0) {
          topJobsContainer.innerHTML = `
            <p class="empty-message">No job matches found for "${role}". Try updating your skills or selecting a different role.</p>
          `;
        } else {
          // Render each job card
          topJobs.forEach(job => {
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
                <div class="job-match">${job.matchScore}% Match</div>
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
            
            topJobsContainer.appendChild(jobCard);
          });
        }
      }
    }
    
    console.log(`Updated job matches for selected role: ${role}`);
    
  } catch (error) {
    console.error('Error updating job matches for role:', error);
  }
},
  
  /**
   * Switch to a different profile tab
   * @param {string} tabId - Tab ID to switch to
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
  }
};