/**
 * Profile management for TechCareerMatch
 */

const ProfileManager = {
  // ...existing code...
  
  /**
   * Initialize profile manager
   * @returns {Promise<boolean>} Success indicator
   */
  
  
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

  // ...rest of existing code...
};