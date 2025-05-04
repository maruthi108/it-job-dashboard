/**
 * Career Roadmap Filter Fix
 * This script specifically fixes the issues with role selection and timeline filtering
 * in the Career Roadmap section.
 */

// Self-executing function to avoid polluting global scope
(function() {
  // Run when document is loaded
  document.addEventListener('DOMContentLoaded', function() {
      // Set up event listeners for role selector and timeline filter
      setupFilterEventListeners();
      
      // Also run on navigation to roadmap section
      const roadmapNav = document.querySelector('.nav-item[data-content="roadmap"], a[href*="roadmap" i]');
      if (roadmapNav) {
          roadmapNav.addEventListener('click', function() {
              setTimeout(setupFilterEventListeners, 300);
          });
      }
      
      // If we're already on the roadmap page, initialize immediately
      if (window.location.hash === '#roadmap' || 
          document.querySelector('#roadmap-content.active') ||
          document.querySelector('.career-roadmap, #roadmap-container')) {
          setupFilterEventListeners();
      }
  });
  
  /**
   * Set up event listeners for the filter controls
   */
  function setupFilterEventListeners() {
      // Find role selector and timeline filter
      const roleSelector = document.querySelector('#role-selector, select[data-role="role-selector"]');
      const timelineFilter = document.querySelector('#timeline-filter, select[data-role="timeline-filter"]');
      
      // If the selectors don't exist with these IDs, try to find them by context
      if (!roleSelector) {
          const roleSelects = document.querySelectorAll('.roadmap-header select, .roadmap-content select');
          for (const select of roleSelects) {
              // If the select has options that match role names, it's likely the role selector
              const options = select.querySelectorAll('option');
              for (const option of options) {
                  const text = option.textContent.toLowerCase();
                  if (text.includes('developer') || text.includes('engineer') || 
                      text.includes('designer') || text.includes('scientist')) {
                      select.id = 'role-selector';
                      setupRoleSelector(select);
                      break;
                  }
              }
          }
      } else {
          setupRoleSelector(roleSelector);
      }
      
      if (!timelineFilter) {
          const timelineSelects = document.querySelectorAll('.roadmap-header select, .roadmap-content select');
          for (const select of timelineSelects) {
              // If the select has options related to time periods, it's likely the timeline filter
              const options = select.querySelectorAll('option');
              for (const option of options) {
                  const text = option.textContent.toLowerCase();
                  if (text.includes('month') || text.includes('year') || 
                      text.includes('next') || text.includes('week')) {
                      select.id = 'timeline-filter';
                      setupTimelineFilter(select);
                      break;
                  }
              }
          }
      } else {
          setupTimelineFilter(timelineFilter);
      }
  }
  
  /**
   * Set up role selector event handler
   * @param {HTMLElement} selector - Role selector element
   */
  function setupRoleSelector(selector) {
      // Remove any existing event listeners by cloning and replacing
      const newSelector = selector.cloneNode(true);
      selector.parentNode.replaceChild(newSelector, selector);
      
      // Add new event listener
      newSelector.addEventListener('change', function() {
          const selectedRole = newSelector.value;
          updateRoadmapForRole(selectedRole);
      });
      
      // If there's a value already selected, update the roadmap
      if (newSelector.value) {
          setTimeout(() => updateRoadmapForRole(newSelector.value), 100);
      }
  }
  
  /**
   * Set up timeline filter event handler
   * @param {HTMLElement} filter - Timeline filter element
   */
  function setupTimelineFilter(filter) {
      // Remove any existing event listeners by cloning and replacing
      const newFilter = filter.cloneNode(true);
      filter.parentNode.replaceChild(newFilter, filter);
      
      // Add new event listener
      newFilter.addEventListener('change', function() {
          const months = parseInt(newFilter.value) || 12;
          updateTimelineFilter(months);
      });
      
      // If there's a value already selected, update the timeline
      if (newFilter.value) {
          setTimeout(() => updateTimelineFilter(parseInt(newFilter.value) || 12), 100);
      }
  }
  
  /**
   * Update roadmap for selected role
   * @param {string} role - Selected role
   */
  function updateRoadmapForRole(role) {
      // Exit if no valid role
      if (!role) return;
      
      try {
          // Update role display in UI
          const roleDisplay = document.getElementById('career-path-role');
          if (roleDisplay) {
              roleDisplay.textContent = role;
          }
          
          // Clear any error messages
          const errorMessages = document.querySelectorAll('.roadmap-error, .error-message');
          errorMessages.forEach(el => el.remove());
          
          // Get months from timeline filter if available
          const timelineFilter = document.getElementById('timeline-filter');
          const months = timelineFilter ? parseInt(timelineFilter.value) || 12 : 12;
          
          // Load and render role-specific data
          if (typeof RoleRoadmaps !== 'undefined') {
              const careerPath = RoleRoadmaps.getCareerPath(role);
              const timeline = RoleRoadmaps.getTimeline(role);
              
              if (careerPath && timeline) {
                  renderCareerPath(careerPath, role);
                  renderRoadmapTimeline(timeline, months, role);
                  
                  // Also update experience-salary chart if available
                  const experienceSalary = RoleRoadmaps.getExperienceSalaryData(role);
                  if (experienceSalary && typeof ChartManager !== 'undefined' && 
                      typeof ChartManager.createExperienceSalaryChart === 'function') {
                      ChartManager.createExperienceSalaryChart(experienceSalary);
                  }
              }
          } else if (typeof RoadmapManager !== 'undefined') {
              // Fallback to RoadmapManager
              // This is typically for personalized roadmaps rather than role-specific ones
              RoadmapManager.generatePersonalizedRoadmap()
                  .then(function(data) {
                      if (data && data.careerPath && data.timeline) {
                          renderCareerPath(data.careerPath, role);
                          renderRoadmapTimeline(data.timeline, months, role);
                          
                          // Also update experience-salary chart if available
                          if (data.experienceSalary && typeof ChartManager !== 'undefined' && 
                              typeof ChartManager.createExperienceSalaryChart === 'function') {
                              ChartManager.createExperienceSalaryChart(data.experienceSalary);
                          }
                      }
                  })
                  .catch(function(error) {
                      console.error('Error generating personalized roadmap:', error);
                  });
          } else {
              // If no roadmap sources available, fallback to static defaults
              useDefaultRoadmapData(role, months);
          }
      } catch (error) {
          console.error('Error updating roadmap for role:', error);
          // Display the error message nicely
          const errorContainer = document.createElement('div');
          errorContainer.className = 'notification error roadmap-error';
          errorContainer.innerHTML = `
              <div class="notification-icon"><i class="fas fa-exclamation-circle"></i></div>
          `;
          
          // Add to roadmap content
          const roadmapContent = document.querySelector('.roadmap-content');
          if (roadmapContent) {
              roadmapContent.appendChild(errorContainer);
          }
      }
  }
  
  /**
   * Update timeline based on filter
   * @param {number} months - Number of months to display
   */
  function updateTimelineFilter(months) {
      // Default to 12 months if not specified
      const timeFrame = months || 12;
      
      try {
          // Get current selected role
          const roleSelector = document.getElementById('role-selector');
          const selectedRole = roleSelector ? roleSelector.value : '';
          
          // Get timeline data
          let timeline;
          if (typeof RoleRoadmaps !== 'undefined' && selectedRole) {
              timeline = RoleRoadmaps.getTimeline(selectedRole);
              if (timeline) {
                  renderRoadmapTimeline(timeline, timeFrame, selectedRole);
              }
          } else if (typeof RoadmapManager !== 'undefined') {
              RoadmapManager.getTimeline(timeFrame)
                  .then(function(data) {
                      if (data) {
                          renderRoadmapTimeline(data, timeFrame);
                      }
                  })
                  .catch(function(error) {
                      console.error('Error getting timeline:', error);
                  });
          } else {
              // Use default timeline data
              const defaultTimeline = getDefaultTimeline();
              renderRoadmapTimeline(defaultTimeline, timeFrame);
          }
      } catch (error) {
          console.error('Error updating timeline filter:', error);
      }
  }
  
  /**
   * Render career path steps
   * @param {Array} careerPath - Career path data
   * @param {string} role - Selected role
   */
  function renderCareerPath(careerPath, role) {
      // Find the career path container
      const container = document.getElementById('career-path-container');
      if (!container) {
          // Try to find by context if ID not found
          const container = document.querySelector('.career-path, .roadmap-sidebar > div:not(h3)');
          if (!container) {
              console.error('Career path container not found');
              return;
          }
      }
      
      // If no valid data, show error
      if (!careerPath || !Array.isArray(careerPath) || careerPath.length === 0) {
          container.innerHTML = `
              <p class="empty-message">No career path available for ${role || 'selected role'}.</p>
          `;
          return;
      }
      
      // Generate HTML for career path steps
      let html = '';
      
      careerPath.forEach((step, index) => {
          html += `
              <div class="career-path-step">
                  <div class="step-indicator">${step.step || index + 1}</div>
                  <div class="step-content">
                      <div class="step-title ${step.current ? 'current-step' : ''}">${step.title}</div>
                      <div class="step-description">${step.description}</div>
                      ${step.alternativeTitle ? `
                          <div class="step-alternative">
                              <div class="alternative-title">Alternative: ${step.alternativeTitle}</div>
                              <div class="alternative-description">${step.alternativeDescription || ''}</div>
                          </div>
                      ` : ''}
                  </div>
              </div>
          `;
      });
      
      // Update container
      container.innerHTML = html;
  }
  
  /**
   * Render roadmap timeline
   * @param {Array} timeline - Timeline data
   * @param {number} months - Number of months to show
   * @param {string} role - Selected role
   */
  function renderRoadmapTimeline(timeline, months, role) {
      // Find the timeline container
      const container = document.getElementById('roadmap-timeline');
      if (!container) {
          // Try to find by context if ID not found
          const container = document.querySelector('.roadmap-timeline, .roadmap-content > div:not(h3)');
          if (!container) {
              console.error('Roadmap timeline container not found');
              return;
          }
      }
      
      // If no valid data, show error
      if (!timeline || !Array.isArray(timeline) || timeline.length === 0) {
          container.innerHTML = `
              <p class="empty-message">No timeline available for ${role || 'selected role'}.</p>
          `;
          return;
      }
      
      // Filter timeline based on months
      let filteredTimeline = timeline;
      if (months < 9 && timeline.length > 2) {
          filteredTimeline = timeline.slice(0, 2);
      } else if (months < 18 && timeline.length > 3) {
          filteredTimeline = timeline.slice(0, 3);
      } else if (months < 24 && timeline.length > 4) {
          filteredTimeline = timeline.slice(0, 4);
      }
      
      // Generate HTML for timeline items
      let html = '';
      
      filteredTimeline.forEach(item => {
          html += `
              <div class="timeline-item">
                  <div class="timeline-date">${item.date || 'Upcoming'}</div>
                  <div class="timeline-title">${item.title || 'Skill Development'}</div>
                  <div class="timeline-description">${item.description || ''}</div>
                  ${item.existingSkills ? `
                      <div class="timeline-existing-skills">
                          <strong>Skills you already have:</strong> ${item.existingSkills.join(', ')}
                      </div>
                  ` : ''}
                  <div class="timeline-skills">
                      ${item.skills && Array.isArray(item.skills) ? item.skills.map(skill => 
                          `<div class="skill-tag">${skill}</div>`
                      ).join('') : ''}
                  </div>
              </div>
          `;
      });
      
      // Update container
      container.innerHTML = html;
  }
  
  /**
   * Get default timeline data
   * @returns {Array} Default timeline data
   */
  function getDefaultTimeline() {
      return [
          {
              date: 'First 3 months',
              title: 'Build Fundamentals',
              description: 'Master core skills and best practices',
              skills: ['Problem Solving', 'Version Control', 'Testing', 'Documentation']
          },
          {
              date: 'Months 4-6',
              title: 'Expand Technical Knowledge',
              description: 'Learn more advanced concepts and tools',
              skills: ['Design Patterns', 'Advanced Tools', 'CI/CD', 'Code Review']
          },
          {
              date: 'Months 7-12',
              title: 'Specialize and Apply',
              description: 'Deepen knowledge in specific areas',
              skills: ['System Design', 'Performance Optimization', 'Mentoring', 'Technical Leadership']
          }
      ];
  }
  
  /**
   * Use default roadmap data
   * @param {string} role - Role name
   * @param {number} months - Number of months
   */
  function useDefaultRoadmapData(role, months) {
      // Default career path data with role name adjusted
      const defaultCareerPath = [
          {
              step: 1,
              title: `Junior ${role || 'Developer'}`,
              description: 'Build fundamental skills and gain experience in real-world projects',
              current: false
          },
          {
              step: 2,
              title: `Mid-Level ${role || 'Developer'}`,
              description: 'Take on more responsibility and deepen technical knowledge',
              current: true
          },
          {
              step: 3,
              title: `Senior ${role || 'Developer'}`,
              description: 'Lead projects and mentor junior team members',
              current: false
          },
          {
              step: 4,
              title: `${role || 'Technical'} Lead / Architect`,
              description: 'Design systems and make high-level technical decisions',
              current: false
          }
      ];
      
      // Default timeline data
      const defaultTimeline = getDefaultTimeline();
      
      // Render the default data
      renderCareerPath(defaultCareerPath, role);
      renderRoadmapTimeline(defaultTimeline, months, role);
  }
})();