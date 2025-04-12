/**
 * TechCareerMatch Profile UI Modifications
 * 
 * This script implements the following changes:
 * 1. Updates the profile form by removing LinkedIn URL and Industry Domains fields
 * 2. Creates a role-based skill selection system with editing capability
 * 3. Replaces profile completion percentage with resume upload feature
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the profile form modifications
  initProfileModifications();
});

/**
 * Initialize all profile form modifications
 */
function initProfileModifications() {
  // Replace profile completion with resume upload
  replaceCompletionWithResumeUpload();
  
  // Update profile form fields
  updateProfileFormFields();
  
  // Add role-based skills selection
  setupRoleBasedSkills();
  
  // Set up form toggle based on resume upload
  setupResumeToggle();
  
  // Fix profile form submission
  fixProfileFormSubmission();
}

/**
 * Replace profile completion percentage with resume upload
 */
function replaceCompletionWithResumeUpload() {
  const welcomeBanner = document.querySelector('.welcome-banner');
  if (!welcomeBanner) return;
  
  // Get the profile stats element to replace
  const profileStats = welcomeBanner.querySelector('.profile-stats');
  if (!profileStats) return;
  
  // Create resume upload component
  const resumeUploadHtml = `
    <div class="resume-upload">
      <div class="resume-upload-container">
        <label for="resume-upload-input" class="resume-upload-label">
          <i class="fas fa-file-upload"></i>
          <span>Upload Resume</span>
        </label>
        <input type="file" id="resume-upload-input" accept=".pdf,.doc,.docx" style="display: none;" />
        <div class="resume-status" id="resume-status"></div>
      </div>
    </div>
  `;
  
  // Replace profile stats with resume upload
  profileStats.outerHTML = resumeUploadHtml;
  
  // Update welcome text
  const welcomeText = welcomeBanner.querySelector('.welcome-text p');
  if (welcomeText) {
    welcomeText.innerHTML = 'Complete your profile or upload your resume to get personalized job matches and career insights.';
  }
  
  // Set up resume upload event listener
  const resumeUploadInput = document.getElementById('resume-upload-input');
  if (resumeUploadInput) {
    resumeUploadInput.addEventListener('change', handleResumeUpload);
  }
}

/**
 * Handle resume file upload
 * @param {Event} event - File input change event
 */
function handleResumeUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Validate file type
  const validTypes = ['.pdf', '.doc', '.docx', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const fileType = file.type;
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  
  if (!validTypes.includes(fileType) && !validTypes.includes(fileExtension)) {
    showUploadError('Invalid file type. Please upload a PDF or Word document.');
    return;
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showUploadError('File too large. Maximum size is 5MB.');
    return;
  }
  
  // Update status with filename
  const resumeStatus = document.getElementById('resume-status');
  if (resumeStatus) {
    resumeStatus.innerHTML = `
      <div class="resume-file">
        <i class="fas fa-file-alt"></i>
        <span class="resume-filename">${file.name}</span>
        <button class="resume-remove" id="remove-resume"><i class="fas fa-times"></i></button>
      </div>
    `;
    
    // Add remove button functionality
    const removeButton = document.getElementById('remove-resume');
    if (removeButton) {
      removeButton.addEventListener('click', function(e) {
        e.preventDefault();
        event.target.value = '';
        resumeStatus.innerHTML = '';
        
        // Show full form when resume is removed
        toggleFormBasedOnResume(false);
      });
    }
  }
  
  // Toggle form to minimal when resume is uploaded
  toggleFormBasedOnResume(true);
  
  // Show success notification
  showNotification(
    'Resume Uploaded',
    'Your resume has been uploaded successfully.',
    'success'
  );
}

/**
 * Show upload error message
 * @param {string} message - Error message
 */
function showUploadError(message) {
  const resumeStatus = document.getElementById('resume-status');
  if (resumeStatus) {
    resumeStatus.innerHTML = `
      <div class="upload-error">
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
      </div>
    `;
  }
  
  // Show error notification
  showNotification(
    'Upload Error',
    message,
    'error'
  );
  
  // Clear error after 5 seconds
  setTimeout(() => {
    if (resumeStatus) {
      resumeStatus.innerHTML = '';
    }
  }, 5000);
}

// Simple solution to fix the resume upload functionality
document.addEventListener('DOMContentLoaded', function() {
  // Connect upload button to file input
  const uploadBtn = document.getElementById('upload-resume-btn');
  const fileInput = document.getElementById('resume-upload-input');
  
  if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', function() {
          fileInput.click();
      });
  }
  
  // Get the resume upload input
  if (fileInput) {
      // Add event listener for file selection
      fileInput.addEventListener('change', function(event) {
          if (event.target.files && event.target.files[0]) {
              const file = event.target.files[0];
              
              // Show success notification
              showSuccessNotification(file.name);
              
              // Create status element if it doesn't exist
              let statusElement = document.getElementById('resume-status');
              if (!statusElement) {
                  statusElement = document.createElement('div');
                  statusElement.id = 'resume-status';
                  statusElement.classList.add('resume-status');
                  
                  // Find the upload button's parent and append status after it
                  const uploadButton = document.querySelector('.welcome-right');
                  if (uploadButton) {
                      uploadButton.appendChild(statusElement);
                  }
              }
              
              // Update status with file info
              statusElement.innerHTML = `
                  <div class="resume-file">
                      <i class="fas fa-file-alt"></i>
                      <span class="resume-filename">${file.name}</span>
                      <button class="resume-remove" id="remove-resume">
                          <i class="fas fa-times"></i>
                      </button>
                  </div>
              `;
              
              // Add remove button functionality
              const removeBtn = document.getElementById('remove-resume');
              if (removeBtn) {
                  removeBtn.addEventListener('click', function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      fileInput.value = '';
                      statusElement.innerHTML = '';
                  });
              }
          }
      });
  }
  
  // Add a simple notification system if it doesn't exist
  if (!window.Utils || !window.Utils.showNotification) {
      window.Utils = window.Utils || {};
      window.Utils.showNotification = function(title, message, type) {
          // Create notification container if it doesn't exist
          let container = document.getElementById('notification-container');
          if (!container) {
              container = document.createElement('div');
              container.id = 'notification-container';
              container.style.position = 'fixed';
              container.style.bottom = '20px';
              container.style.right = '20px';
              container.style.zIndex = '1000';
              document.body.appendChild(container);
          }
          
          // Create notification element
          const notification = document.createElement('div');
          notification.className = `notification notification-${type || 'info'}`;
          notification.style.backgroundColor = 'white';
          notification.style.color = '#333';
          notification.style.padding = '15px 20px';
          notification.style.borderRadius = '8px';
          notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          notification.style.marginBottom = '10px';
          notification.style.display = 'flex';
          notification.style.alignItems = 'center';
          notification.style.minWidth = '300px';
          notification.style.animation = 'slideIn 0.3s ease-out';
          
          // Set icon based on type
          let iconClass = 'fa-info-circle';
          let iconColor = '#3498db'; // blue
          if (type === 'success') {
              iconClass = 'fa-check-circle';
              iconColor = '#2ecc71'; // green
          } else if (type === 'error') {
              iconClass = 'fa-times-circle';
              iconColor = '#e74c3c'; // red
          } else if (type === 'warning') {
              iconClass = 'fa-exclamation-circle';
              iconColor = '#f39c12'; // orange
          }
          
          notification.innerHTML = `
              <div style="margin-right: 15px; font-size: 20px; color: ${iconColor};">
                  <i class="fas ${iconClass}"></i>
              </div>
              <div style="flex: 1;">
                  <div style="font-weight: 600; margin-bottom: 3px;">${title}</div>
                  <div style="font-size: 14px; color: #666;">${message}</div>
              </div>
              <div style="color: #aaa; font-size: 16px; margin-left: 10px; cursor: pointer;" class="notification-close">&times;</div>
          `;
          
          // Add close button functionality
          const closeBtn = notification.querySelector('.notification-close');
          closeBtn.addEventListener('click', function() {
              notification.remove();
          });
          
          // Add to container
          container.appendChild(notification);
          
          // Auto remove after duration
          setTimeout(() => {
              if (notification.parentNode) {
                  notification.remove();
              }
          }, 5000);
      };
  }
  
  // Show success notification
  function showSuccessNotification(filename) {
      if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification(
              'Resume Uploaded',
              `Your file "${filename}" has been uploaded successfully.`,
              'success'
          );
      }
  }
});

/**
 * Update profile form fields by removing unnecessary ones
 */
function updateProfileFormFields() {
  // Remove LinkedIn URL field
  
  
  // Mark required fields with asterisk
  const requiredFields = [
    { id: 'user-name-input', label: 'Full Name' },
    { id: 'user-email', label: 'Email' },
    { id: 'user-location-input', label: 'Location' }
  ];
  
  requiredFields.forEach(field => {
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label) {
      // Add required marker only if it doesn't already exist
      if (!label.innerHTML.includes('<span class="required">')) {
        label.innerHTML = `${field.label} <span class="required">*</span>`;
      }
    }
    
    const input = document.getElementById(field.id);
    if (input) {
      input.setAttribute('required', 'required');
    }
  });
}

/**
 * Set up role-based skills selection
 */
function setupRoleBasedSkills() {
  // Create the role-based skills data
  const skillsData = {
    frontend: ['HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Vue.js', 'TypeScript', 'SASS/SCSS', 'Redux', 'Webpack'],
    backend: ['Node.js', 'Python', 'Java', 'PHP', 'SQL', 'NoSQL', 'Express', 'Django', 'Spring Boot', 'RESTful APIs'],
    fullstack: ['JavaScript', 'Node.js', 'React', 'HTML/CSS', 'SQL', 'MongoDB', 'Git', 'Express', 'REST APIs', 'Python'],
    devops: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Jenkins', 'Terraform', 'Linux', 'Shell Scripting', 'Monitoring', 'Git'],
    data: ['Python', 'R', 'SQL', 'Machine Learning', 'Data Visualization', 'Pandas', 'TensorFlow', 'Tableau', 'Big Data', 'Statistics'],
    mobile: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android', 'Mobile UI Design', 'Firebase', 'App Store Optimization', 'Push Notifications'],
    ui: ['Figma', 'Adobe XD', 'Sketch', 'UI Design', 'UX Research', 'Wireframing', 'Prototyping', 'User Testing', 'Typography', 'Color Theory']
  };
  
  // Find the skills textarea
  const skillsTextarea = document.getElementById('user-skills');
  if (!skillsTextarea) return; // Skills textarea not found
  
  const skillsFormGroup = skillsTextarea.closest('.form-group');
  if (!skillsFormGroup) return;
  
  // Create the container for role-based skills
  const roleSkillsHtml = `
    <div class="role-skills-container">
      <div class="role-selection">
        <label for="role-selector">Select Your Role</label>
        <select id="role-selector">
          <option value="">Select a role to see related skills</option>
          <option value="frontend">Frontend Developer</option>
          <option value="backend">Backend Developer</option>
          <option value="fullstack">Full Stack Developer</option>
          <option value="devops">DevOps Engineer</option>
          <option value="data">Data Scientist</option>
          <option value="mobile">Mobile Developer</option>
          <option value="ui">UI/UX Designer</option>
        </select>
      </div>
      
      <div class="skills-selection">
        <label>Available Skills for Selected Role <span id="role-display"></span></label>
        <div class="skills-chips" id="skills-chips">
          <div class="empty-state">Select a role to see relevant skills</div>
        </div>
      </div>
      
      <div class="custom-skills">
        <label for="custom-skill-input">Add Custom Skill</label>
        <div class="custom-skill-input-container">
          <input type="text" id="custom-skill-input" placeholder="Type a skill and press Enter" />
          <button type="button" id="add-custom-skill"><i class="fas fa-plus"></i> Add</button>
        </div>
      </div>
      
      <div class="selected-skills">
        <label>Your Selected Skills <small id="selected-count">(0 selected)</small></label>
        <div class="selected-skills-chips" id="selected-skills-chips">
          <div class="empty-state">No skills selected yet</div>
        </div>
        <input type="hidden" id="selected-skills-input" name="selected-skills" />
      </div>
    </div>
  `;
  
  // Get current skills as array
  let currentSkills = [];
  if (skillsTextarea.value) {
    currentSkills = skillsTextarea.value.split(',').map(skill => skill.trim()).filter(Boolean);
  }
  
  // Replace the skills textarea with our custom component
  skillsFormGroup.innerHTML = roleSkillsHtml;
  
  // Add CSS styles for the empty state
  const style = document.createElement('style');
  style.textContent = `
    .empty-state {
      color: #999;
      font-style: italic;
      width: 100%;
      text-align: center;
      padding: 10px;
    }
    
    .edit-skill-btn {
      background-color: rgba(52, 152, 219, 0.1);
      color: var(--primary-color);
      margin-left: 5px;
    }
    
    .edit-skill-btn:hover {
      background-color: rgba(52, 152, 219, 0.2);
    }
    
    .skill-edit-mode {
      background-color: #fff3cd !important;
      border-color: #ffeeba !important;
    }
    
    .skill-edit-mode button.remove-skill {
      display: none;
    }
    
    .skill-edit-actions {
      display: flex;
      gap: 5px;
      margin-left: 5px;
    }
    
    .skill-edit-actions button {
      padding: 2px 5px;
      font-size: 10px;
    }
    
    .skill-edit-actions .save-edit {
      background-color: var(--secondary-color);
      color: white;
    }
    
    .skill-edit-actions .cancel-edit {
      background-color: #f8f9fa;
      color: #6c757d;
    }
  `;
  document.head.appendChild(style);
  
  // Set up event listeners for role selection
  const roleSelector = document.getElementById('role-selector');
  const skillsChips = document.getElementById('skills-chips');
  const selectedSkillsChips = document.getElementById('selected-skills-chips');
  const customSkillInput = document.getElementById('custom-skill-input');
  const addCustomSkillBtn = document.getElementById('add-custom-skill');
  const selectedSkillsInput = document.getElementById('selected-skills-input');
  const roleDisplay = document.getElementById('role-display');
  const selectedCount = document.getElementById('selected-count');
  
  if (roleSelector && skillsChips && selectedSkillsChips && customSkillInput && addCustomSkillBtn) {
    // When role changes, update available skills
    roleSelector.addEventListener('change', function() {
      const selectedRole = this.value;
      
      // Update role display
      if (roleDisplay) {
        roleDisplay.textContent = selectedRole ? `(${this.options[this.selectedIndex].text})` : '';
      }
      
      // Clear previous skills
      skillsChips.innerHTML = '';
      
      if (!selectedRole) {
        skillsChips.innerHTML = '<div class="empty-state">Select a role to see relevant skills</div>';
        return;
      }
      
      // Get skills for selected role
      const roleSkills = skillsData[selectedRole] || [];
      
      // Get currently selected skills
      const selectedSkills = getSelectedSkills();
      
      if (roleSkills.length === 0) {
        skillsChips.innerHTML = '<div class="empty-state">No skills found for this role</div>';
      } else {
        // Display skills not already selected
        const availableSkills = roleSkills.filter(skill => 
          !selectedSkills.some(s => s.toLowerCase() === skill.toLowerCase())
        );
        
        if (availableSkills.length === 0) {
          skillsChips.innerHTML = '<div class="empty-state">All skills for this role already selected</div>';
        } else {
          availableSkills.forEach(skill => {
            const skillChip = createSkillChip(skill, false);
            skillsChips.appendChild(skillChip);
          });
        }
      }
    });
    
    // Add custom skill
    const addCustomSkill = function() {
      const skill = customSkillInput.value.trim();
      
      if (!skill) return;
      
      // Check if skill already exists
      const selectedSkills = getSelectedSkills();
      if (selectedSkills.some(s => s.toLowerCase() === skill.toLowerCase())) {
        showNotification('Duplicate Skill', `"${skill}" is already in your selected skills.`, 'warning');
        return;
      }
      
      // Add skill to selected skills
      addSkillToSelected(skill);
      
      // Clear input
      customSkillInput.value = '';
      
      // Update role selector to filter out the selected skill
      roleSelector.dispatchEvent(new Event('change'));
    };
    
    // Handle Enter key in custom skill input
    customSkillInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        addCustomSkill();
      }
    });
    
    // Handle custom skill add button click
    addCustomSkillBtn.addEventListener('click', function() {
      addCustomSkill();
    });
    
    // Load any existing skills
    if (currentSkills.length > 0) {
      currentSkills.forEach(skill => {
        addSkillToSelected(skill);
      });
      
      // Update count
      updateSelectedCount();
    }
  }
  
  /**
   * Create a skill chip element
   * @param {string} skill - Skill name
   * @param {boolean} isSelected - Whether it's in selected list
   * @returns {HTMLElement} - Skill chip element
   */
  function createSkillChip(skill, isSelected) {
    const skillChip = document.createElement('div');
    skillChip.className = 'skill-chip';
    skillChip.dataset.skill = skill;
    
    if (isSelected) {
      // Selected skill chip (with remove and edit options)
      skillChip.innerHTML = `
        <span class="skill-name">${skill}</span>
        <button type="button" class="remove-skill" title="Remove skill"><i class="fas fa-times"></i></button>
        <button type="button" class="edit-skill-btn" title="Edit skill"><i class="fas fa-pencil-alt"></i></button>
      `;
      
      // Add remove button handler
      const removeBtn = skillChip.querySelector('.remove-skill');
      if (removeBtn) {
        removeBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          removeSkillFromSelected(skill);
        });
      }
      
      // Add edit button handler
      const editBtn = skillChip.querySelector('.edit-skill-btn');
      if (editBtn) {
        editBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          editSkill(skillChip, skill);
        });
      }
    } else {
      // Available skill chip (with add button)
      skillChip.innerHTML = `
        <span>${skill}</span>
        <button type="button" class="add-skill" title="Add skill"><i class="fas fa-plus"></i></button>
      `;
      
      // Make the entire chip clickable to add
      skillChip.addEventListener('click', function() {
        addSkillToSelected(skill);
        this.remove();
      });
    }
    
    return skillChip;
  }
  
  /**
   * Add skill to selected skills
   * @param {string} skill - Skill to add
   */
  function addSkillToSelected(skill) {
    const selectedSkillsChips = document.getElementById('selected-skills-chips');
    const selectedSkillsInput = document.getElementById('selected-skills-input');
    
    if (!selectedSkillsChips || !selectedSkillsInput) return;
    
    // Remove empty state if present
    const emptyState = selectedSkillsChips.querySelector('.empty-state');
    if (emptyState) {
      emptyState.remove();
    }
    
    // Create and add skill chip
    const skillChip = createSkillChip(skill, true);
    selectedSkillsChips.appendChild(skillChip);
    
    // Update hidden input
    updateSelectedSkillsInput();
    
    // Update count
    updateSelectedCount();
    
    // Show notification
    showNotification('Skill Added', `"${skill}" has been added to your skills.`, 'success');
  }
  
  /**
   * Remove skill from selected skills
   * @param {string} skill - Skill to remove
   */
  function removeSkillFromSelected(skill) {
    const selectedSkillsChips = document.getElementById('selected-skills-chips');
    if (!selectedSkillsChips) return;
    
    // Find chip by skill name
    const skillChips = selectedSkillsChips.querySelectorAll('.skill-chip');
    for (let i = 0; i < skillChips.length; i++) {
      if (skillChips[i].dataset.skill === skill) {
        skillChips[i].remove();
        break;
      }
    }
    
    // Update hidden input
    updateSelectedSkillsInput();
    
    // Update count
    updateSelectedCount();
    
    // Add empty state if no skills left
    const remainingSkills = selectedSkillsChips.querySelectorAll('.skill-chip');
    if (remainingSkills.length === 0) {
      selectedSkillsChips.innerHTML = '<div class="empty-state">No skills selected yet</div>';
    }
    
    // Refresh available skills for the current role
    const roleSelector = document.getElementById('role-selector');
    if (roleSelector && roleSelector.value) {
      roleSelector.dispatchEvent(new Event('change'));
    }
    
    // Show notification
    showNotification('Skill Removed', `"${skill}" has been removed from your skills.`, 'info');
  }
  
  /**
   * Edit a skill
   * @param {HTMLElement} skillChip - Skill chip element
   * @param {string} currentSkill - Current skill name
   */
  function editSkill(skillChip, currentSkill) {
    if (skillChip.classList.contains('skill-edit-mode')) return;
    
    // Store original content to restore if cancelled
    skillChip.dataset.originalContent = skillChip.innerHTML;
    
    // Switch to edit mode
    skillChip.classList.add('skill-edit-mode');
    
    // Replace content with edit field
    skillChip.innerHTML = `
      <input type="text" class="skill-edit-input" value="${currentSkill}" />
      <div class="skill-edit-actions">
        <button type="button" class="save-edit" title="Save"><i class="fas fa-check"></i></button>
        <button type="button" class="cancel-edit" title="Cancel"><i class="fas fa-times"></i></button>
      </div>
    `;
    
    // Focus the input
    const editInput = skillChip.querySelector('.skill-edit-input');
    editInput.focus();
    editInput.select();
    
    // Handle save edit
    const saveBtn = skillChip.querySelector('.save-edit');
    saveBtn.addEventListener('click', function() {
      saveSkillEdit(skillChip, currentSkill);
    });
    
    // Handle cancel edit
    const cancelBtn = skillChip.querySelector('.cancel-edit');
    cancelBtn.addEventListener('click', function() {
      cancelSkillEdit(skillChip);
    });
    
    // Handle enter key
    editInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveSkillEdit(skillChip, currentSkill);
      } else if (e.key === 'Escape') {
        cancelSkillEdit(skillChip);
      }
    });
  }
  
  /**
   * Save skill edit
   * @param {HTMLElement} skillChip - Skill chip element
   * @param {string} oldSkill - Old skill name
   */
  function saveSkillEdit(skillChip, oldSkill) {
    const editInput = skillChip.querySelector('.skill-edit-input');
    const newSkill = editInput.value.trim();
    
    if (!newSkill) {
      showNotification('Error', 'Skill name cannot be empty.', 'error');
      return;
    }
    
    // Check if skill already exists (unless it's the same skill)
    const selectedSkills = getSelectedSkills();
    if (newSkill.toLowerCase() !== oldSkill.toLowerCase() && 
        selectedSkills.some(s => s.toLowerCase() === newSkill.toLowerCase())) {
      showNotification('Duplicate Skill', `"${newSkill}" is already in your selected skills.`, 'warning');
      return;
    }
    
    // Update skill name
    skillChip.dataset.skill = newSkill;
    
    // Exit edit mode
    skillChip.classList.remove('skill-edit-mode');
    
    // Restore normal view with new skill
    skillChip.innerHTML = `
      <span class="skill-name">${newSkill}</span>
      <button type="button" class="remove-skill" title="Remove skill"><i class="fas fa-times"></i></button>
      <button type="button" class="edit-skill-btn" title="Edit skill"><i class="fas fa-pencil-alt"></i></button>
    `;
    
    // Add event listeners back
    const removeBtn = skillChip.querySelector('.remove-skill');
    if (removeBtn) {
      removeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        removeSkillFromSelected(newSkill);
      });
    }
    
    const editBtn = skillChip.querySelector('.edit-skill-btn');
    if (editBtn) {
      editBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        editSkill(skillChip, newSkill);
      });
    }
    
    // Update hidden input
    updateSelectedSkillsInput();
    
    // Show notification if changed
    if (newSkill !== oldSkill) {
      showNotification('Skill Updated', `"${oldSkill}" has been renamed to "${newSkill}".`, 'success');
    }
  }
  
  /**
   * Cancel skill edit
   * @param {HTMLElement} skillChip - Skill chip element
   */
  function cancelSkillEdit(skillChip) {
    // Restore original content
    skillChip.innerHTML = skillChip.dataset.originalContent;
    
    // Remove edit mode class
    skillChip.classList.remove('skill-edit-mode');
    
    // Add event listeners back
    const skill = skillChip.dataset.skill;
    
    const removeBtn = skillChip.querySelector('.remove-skill');
    if (removeBtn) {
      removeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        removeSkillFromSelected(skill);
      });
    }
    
    const editBtn = skillChip.querySelector('.edit-skill-btn');
    if (editBtn) {
      editBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        editSkill(skillChip, skill);
      });
    }
  }
  
  /**
   * Get array of selected skills
   * @returns {string[]} Array of selected skills
   */
  function getSelectedSkills() {
    const selectedSkillsChips = document.getElementById('selected-skills-chips');
    if (!selectedSkillsChips) return [];
    
    const skills = [];
    const skillChips = selectedSkillsChips.querySelectorAll('.skill-chip');
    
    skillChips.forEach(chip => {
      if (chip.dataset.skill) {
        skills.push(chip.dataset.skill);
      }
    });
    
    return skills;
  }
  
  /**
   * Update hidden input with selected skills
   */
  function updateSelectedSkillsInput() {
    const selectedSkills = getSelectedSkills();
    const selectedSkillsInput = document.getElementById('selected-skills-input');
    
    if (selectedSkillsInput) {
      selectedSkillsInput.value = selectedSkills.join(', ');
    }
  }
  
  /**
   * Update selected skills count
   */
  function updateSelectedCount() {
    const selectedSkills = getSelectedSkills();
    const selectedCount = document.getElementById('selected-count');
    
    if (selectedCount) {
      selectedCount.textContent = `(${selectedSkills.length} selected)`;
    }
  }
}

/**
 * Set up form toggle based on resume upload
 */
function setupResumeToggle() {
  // Add CSS class for minimal form
  const style = document.createElement('style');
  style.textContent = `
    .minimal-form .form-tab-content:not(:first-of-type) {
      display: none !important;
    }
    
    .minimal-form .form-tabs {
      display: none !important;
    }
    
    .minimal-form .form-actions {
      justify-content: flex-end !important;
    }
    
    .minimal-form .form-actions button.prev-tab,
    .minimal-form .form-actions button.next-tab {
      display: none !important;
    }
    
    .minimal-form .form-tab-content.active {
      display: block !important;
    }
    
    .minimal-form .modal-content h2:after {
      content: " (Resume Uploaded)";
      font-size: 16px;
      color: var(--secondary-color);
      font-weight: normal;
    }
    
    .resume-upload {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .resume-upload-container {
      text-align: center;
    }
    
    .resume-upload-label {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      transition: background-color var(--transition-speed);
    }
    
    .resume-upload-label:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
    
    .resume-status {
      margin-top: 10px;
      min-height: 40px;
    }
    
    .resume-file {
      background-color: rgba(255, 255, 255, 0.9);
      color: var(--dark-color);
      padding: 5px 10px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .resume-filename {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .resume-remove {
      background: none;
      border: none;
      color: var(--danger-color);
      cursor: pointer;
      padding: 5px;
    }
    
    .upload-error {
      color: #e74c3c;
      background-color: rgba(231, 76, 60, 0.1);
      padding: 5px 10px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .required {
      color: var(--danger-color);
    }
  `;
  document.head.appendChild(style);
}

/**
 * Toggle between full form and minimal form based on resume upload
 * @param {boolean} hasResume - Whether a resume is uploaded
 */
function toggleFormBasedOnResume(hasResume) {
  const profileForm = document.getElementById('profile-form');
  if (!profileForm) return;
  
  if (hasResume) {
    // Switch to minimal form
    profileForm.classList.add('minimal-form');
    
    // Make sure we're on the first tab
    const basicInfoTab = document.getElementById('basic-info-tab');
    if (basicInfoTab) {
      basicInfoTab.classList.add('active');
    }
    
    // Update form tabs
    const formTabs = document.querySelectorAll('.form-tab');
    formTabs.forEach(tab => {
      if (tab.getAttribute('data-tab') === 'basic-info') {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    // Update form submit button
    const submitBtn = profileForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = 'Save Basic Info';
    }
  } else {
    // Switch back to full form
    profileForm.classList.remove('minimal-form');
    
    // Update form submit button
    const submitBtn = profileForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = 'Save Profile';
    }
  }
}

/**
 * Fix profile form submission error
 */
function fixProfileFormSubmission() {
  // Get the profile form
  const profileForm = document.getElementById('profile-form');
  if (!profileForm) return;
  
  // Override the form submission
  profileForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    try {
      // Get form data
      const formData = {
        name: document.getElementById('user-name-input')?.value || '',
        email: document.getElementById('user-email')?.value || '',
        location: document.getElementById('user-location-input')?.value || '',
        education: document.getElementById('user-education')?.value || '',
        jobTitle: document.getElementById('user-job-title')?.value || '',
        experience: document.getElementById('user-experience')?.value || '',
        skills: document.getElementById('selected-skills-input')?.value || '',
        targetRole: document.getElementById('user-role')?.value || '',
        locationPreference: document.getElementById('user-location-preference')?.value || '',
        workType: document.getElementById('user-work-type')?.value || '',
        salaryExpectation: document.getElementById('user-salary-expectation')?.value || '',
        willingToRelocate: document.getElementById('user-willing-to-relocate')?.value || 'false'
      };
      
      // Check for required fields
      const requiredFields = [
        { id: 'user-name-input', label: 'Name' },
        { id: 'user-email', label: 'Email' },
        { id: 'user-location-input', label: 'Location' }
      ];
      
      // Validate required fields
      let hasErrors = false;
      requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input || !input.value.trim()) {
          hasErrors = true;
          showNotification('Error', `${field.label} is required`, 'error');
          input?.classList.add('error-field');
        } else {
          input.classList.remove('error-field');
        }
      });
      
      if (hasErrors) return;
      
      // Check if resume is uploaded
      const resumeStatus = document.getElementById('resume-status');
      const hasResume = resumeStatus && resumeStatus.querySelector('.resume-file');
      
      // Determine if minimal validation is enough (resume uploaded)
      if (!hasResume) {
        // Full validation for non-resume mode
        const fullRequiredFields = [
          { id: 'user-job-title', label: 'Job Title' },
          { id: 'user-experience', label: 'Experience' },
          { id: 'user-role', label: 'Target Role' }
        ];
        
        fullRequiredFields.forEach(field => {
          const input = document.getElementById(field.id);
          if (!input || !input.value.trim()) {
            hasErrors = true;
            showNotification('Error', `${field.label} is required`, 'error');
            input?.classList.add('error-field');
          } else {
            input.classList.remove('error-field');
          }
        });
        
        if (hasErrors) return;
      }
      
      // If we have skills, check if they are valid
      if (formData.skills) {
        const skills = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
        if (skills.length === 0) {
          formData.skills = '';
        }
      }
      
      // All validation passed, save the profile
      saveProfile(formData, hasResume);
      
    } catch (error) {
      console.error('Error in form submission:', error);
      showNotification('Error', 'An error occurred while saving your profile. Please try again.', 'error');
    }
  });
  
  // Add styles for error fields
  const style = document.createElement('style');
  style.textContent = `
    .error-field {
      border-color: var(--danger-color) !important;
      background-color: rgba(231, 76, 60, 0.05) !important;
    }
    
    .error-field:focus {
      box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2) !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Save profile data
 * @param {Object} formData - Form data
 * @param {boolean} hasResume - Whether a resume is uploaded
 */
async function saveProfile(formData, hasResume) {
  try {
    // Show loading notification
    showNotification('Saving', 'Saving your profile...', 'info');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if we're using the DataManager object directly or just simulating
    if (typeof DataManager !== 'undefined' && typeof DataManager.updateUserProfile === 'function') {
      // Real implementation using DataManager
      
      // Update profile
      const profileData = {
        name: formData.name,
        email: formData.email,
        location: formData.location,
        education: formData.education,
        jobTitle: formData.jobTitle,
        experience: parseFloat(formData.experience) || 0
      };
      
      // Update the profile
      await DataManager.updateUserProfile(profileData);
      
      // Update skills if provided
      const skillsInput = formData.skills;
      if (skillsInput) {
        // Parse skills from comma-separated list
        const skillsArray = skillsInput.split(',').map(skill => skill.trim()).filter(Boolean);
        
        // Get existing skills
        const existingSkills = await DataManager.getUserSkills();
        const existingSkillNames = existingSkills.map(skill => skill.name.toLowerCase());
        
        // Add new skills
        for (const skill of skillsArray) {
          if (!existingSkillNames.includes(skill.toLowerCase())) {
            await DataManager.addUserSkill({
              name: skill,
              level: 'Intermediate',
              experience: Math.min(parseFloat(formData.experience) || 2, 2) // Cap skill experience at user's total or 2 years 
            });
          }
        }
      }
      
      // Update preferences only if full form was filled
      if (!hasResume) {
        const preferencesData = {
          targetRole: formData.targetRole,
          locationPreference: formData.locationPreference,
          workType: formData.workType,
          salaryExpectation: parseFloat(formData.salaryExpectation) || 0,
          willingToRelocate: formData.willingToRelocate === 'true'
        };
        
        await DataManager.updateUserPreferences(preferencesData);
      }
      
      // Reload user profile if method exists
      if (typeof ProfileManager !== 'undefined' && typeof ProfileManager.loadUserProfile === 'function') {
        await ProfileManager.loadUserProfile();
      }
      
      // Update dashboard if method exists
      if (typeof UI !== 'undefined' && typeof UI.refreshDashboard === 'function') {
        UI.refreshDashboard();
      }
    } else {
      // Simulation for demo purposes
      console.log('Profile data saved:', formData);
      
      // Update displayed name if exists
      const userNameDisplay = document.getElementById('user-name');
      if (userNameDisplay) {
        userNameDisplay.textContent = formData.name;
      }
    }
    
    // Close modal
    const modal = document.getElementById('profile-modal');
    if (modal) {
      modal.style.display = 'none';
    }
    
    // Show success notification
    showNotification(
      'Success',
      'Profile updated successfully.',
      'success'
    );
    
  } catch (error) {
    console.error('Error saving profile:', error);
    showNotification(
      'Error',
      'Failed to update profile. Please try again.',
      'error'
    );
  }
}

/**
 * Show notification
 * This is a fallback if Utils.showNotification is not available
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info, warning)
 * @param {number} duration - Duration in milliseconds
 */
function showNotification(title, message, type = 'info', duration = 5000) {
  // Use Utils.showNotification if available
  if (typeof Utils !== 'undefined' && typeof Utils.showNotification === 'function') {
    Utils.showNotification(title, message, type, duration);
    return;
  }
  
  // Create notification container if it doesn't exist
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '1000';
    document.body.appendChild(container);
  }
  
  // Set icon based on type
  let iconClass = 'info-circle';
  if (type === 'success') iconClass = 'check-circle';
  if (type === 'error') iconClass = 'times-circle';
  if (type === 'warning') iconClass = 'exclamation-circle';
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.backgroundColor = 'white';
  notification.style.borderRadius = '8px';
  notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  notification.style.padding = '15px 20px';
  notification.style.marginBottom = '10px';
  notification.style.display = 'flex';
  notification.style.alignItems = 'center';
  notification.style.minWidth = '300px';
  notification.style.animation = 'slide-in 0.3s ease-out';
  
  // Set notification content
  notification.innerHTML = `
    <div class="notification-icon" style="margin-right: 15px; font-size: 20px; color: ${
      type === 'success' ? '#2ecc71' : 
      type === 'error' ? '#e74c3c' : 
      type === 'warning' ? '#f39c12' : 
      '#3498db'
    };">
      <i class="fas fa-${iconClass}"></i>
    </div>
    <div class="notification-content" style="flex: 1;">
      <div class="notification-title" style="font-weight: 600; margin-bottom: 3px;">${title}</div>
      <div class="notification-message" style="font-size: 14px; color: #666;">${message}</div>
    </div>
    <div class="notification-close" style="color: #aaa; font-size: 16px; margin-left: 10px; cursor: pointer;">&times;</div>
  `;
  
  // Add event listener for close button
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.remove();
  });
  
  // Add to container
  container.appendChild(notification);
  
  // Auto remove after duration
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, duration);
}