/**
 * Career Roadmap Component-Specific Fix
 * This script focuses on fixing the Career Path and Timeline sections that 
 * are still showing error messages despite the chart working.
 */

// Immediate self-executing function to avoid polluting global scope
(function() {
  // Run when the document is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
      // Fix the career roadmap when it's clicked in the navigation
      const roadmapNav = document.querySelector('.nav-item[data-content="roadmap"], a[href="#roadmap"]');
      if (roadmapNav) {
          roadmapNav.addEventListener('click', function() {
              setTimeout(fixCareerRoadmap, 100); // Short delay to ensure content is switched
          });
      }
      
      // Fix when Career Roadmap link in the top navigation is clicked
      const roadmapTopNav = document.querySelector('a[href*="roadmap" i]');
      if (roadmapTopNav) {
          roadmapTopNav.addEventListener('click', function() {
              setTimeout(fixCareerRoadmap, 100);
          });
      }
      
      // Also run on page load if we're already on the roadmap page
      if (window.location.hash === '#roadmap' || 
          document.querySelector('#roadmap-content.active')) {
          setTimeout(fixCareerRoadmap, 500); // Slightly longer delay on initial load
      }
      
      // Set up role selector event listener
      const roleSelector = document.getElementById('role-selector');
      if (roleSelector) {
          roleSelector.addEventListener('change', function() {
              updateRoadmapForRole(roleSelector.value);
          });
      } else {
          // If the selector doesn't exist yet, try again later
          setTimeout(function() {
              const roleSelector = document.getElementById('role-selector');
              if (roleSelector) {
                  roleSelector.addEventListener('change', function() {
                      updateRoadmapForRole(roleSelector.value);
                  });
              }
          }, 1000);
      }
  });
  
  /**
   * Main function to fix career roadmap components
   */
  function fixCareerRoadmap() {
      // Get the containers
      const careerPathContainer = document.getElementById('career-path-container');
      const timelineContainer = document.getElementById('roadmap-timeline');
      
      // If containers don't exist, they might be named differently or not created yet
      if (!careerPathContainer) {
          // Look for career path section and create container if needed
          const careerPathSection = document.querySelector('.roadmap-sidebar');
          if (careerPathSection) {
              if (!careerPathSection.querySelector('#career-path-container')) {
                  const container = document.createElement('div');
                  container.id = 'career-path-container';
                  careerPathSection.appendChild(container);
              }
          }
      }
      
      if (!timelineContainer) {
          // Look for timeline section and create container if needed
          const timelineSection = document.querySelector('.roadmap-content');
          if (timelineSection && !timelineSection.querySelector('#roadmap-timeline')) {
              const container = document.createElement('div');
              container.id = 'roadmap-timeline';
              timelineSection.appendChild(container);
          }
      }
      
      // Get selected role if any
      const roleSelector = document.getElementById('role-selector');
      const selectedRole = roleSelector ? roleSelector.value : '';
      
      // Load data based on selected role or default
      updateRoadmapForRole(selectedRole);
  }
  
  /**
   * Update roadmap for selected role
   * @param {string} role - Selected role
   */
  function updateRoadmapForRole(role) {
      // Default to 'fullstack' if no role selected
      const effectiveRole = role || 'fullstack';
      
      // Get role-specific data
      let careerPath, timeline, experienceSalary;
      
      try {
          // Check if RoleRoadmaps is available
          if (typeof RoleRoadmaps !== 'undefined') {
              careerPath = RoleRoadmaps.getCareerPath(effectiveRole);
              timeline = RoleRoadmaps.getTimeline(effectiveRole);
              experienceSalary = RoleRoadmaps.getExperienceSalaryData(effectiveRole);
              
              // If we got valid data, render it
              if (careerPath && timeline) {
                  renderCareerPath(careerPath);
                  renderRoadmapTimeline(timeline);
                  
                  // Update role display
                  const roleDisplay = document.getElementById('career-path-role');
                  if (roleDisplay) {
                      roleDisplay.textContent = effectiveRole;
                  }
                  
                  // Also update the chart if we have a chart manager
                  if (typeof ChartManager !== 'undefined' && 
                      typeof ChartManager.createExperienceSalaryChart === 'function' && 
                      experienceSalary) {
                      ChartManager.createExperienceSalaryChart(experienceSalary);
                  }
                  
                  return; // Success, exit early
              }
          }
          
          // If RoleRoadmaps not available or no valid data, try RoadmapManager
          if (typeof RoadmapManager !== 'undefined') {
              // Try to generate personalized roadmap
              RoadmapManager.generatePersonalizedRoadmap()
                  .then(function(roadmapData) {
                      if (roadmapData && roadmapData.careerPath && roadmapData.timeline) {
                          renderCareerPath(roadmapData.careerPath);
                          renderRoadmapTimeline(roadmapData.timeline);
                          
                          // Update role display with target role from data
                          if (roadmapData.experienceSalary && roadmapData.experienceSalary.targetRole) {
                              const roleDisplay = document.getElementById('career-path-role');
                              if (roleDisplay) {
                                  roleDisplay.textContent = roadmapData.experienceSalary.targetRole;
                              }
                          }
                      } else {
                          // Fall back to static default data
                          useDefaultRoadmapData();
                      }
                  })
                  .catch(function(error) {
                      console.error('Error getting personalized roadmap:', error);
                      // Fall back to static default data
                      useDefaultRoadmapData();
                  });
          } else {
              // Neither roadmap source is available, use defaults
              useDefaultRoadmapData();
          }
      } catch (error) {
          console.error('Error loading roadmap data:', error);
          // Fall back to static default data
          useDefaultRoadmapData();
      }
  }
  
  /**
   * Use default roadmap data when dynamic data fails
   */
  function useDefaultRoadmapData() {
      // Default career path data
      const defaultCareerPath = [
          {
              step: 1,
              title: 'Junior Developer',
              description: 'Build fundamental skills and gain experience in real-world projects',
              current: false
          },
          {
              step: 2,
              title: 'Mid-Level Developer',
              description: 'Take on more responsibility and deepen technical knowledge',
              current: true
          },
          {
              step: 3,
              title: 'Senior Developer',
              description: 'Lead projects and mentor junior team members',
              current: false
          },
          {
              step: 4,
              title: 'Technical Lead / Architect',
              description: 'Design systems and make high-level technical decisions',
              current: false
          }
      ];
      
      // Default timeline data
      const defaultTimeline = [
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
      
      // Render the default data
      renderCareerPath(defaultCareerPath);
      renderRoadmapTimeline(defaultTimeline);
      
      // Update role display
      const roleDisplay = document.getElementById('career-path-role');
      if (roleDisplay) {
          roleDisplay.textContent = 'Software Developer';
      }
  }
  
  /**
   * Render career path
   * @param {Array} careerPath - Career path data
   */
  function renderCareerPath(careerPath) {
      const container = document.getElementById('career-path-container');
      
      if (!container) {
          console.warn('Career path container not found');
          return;
      }
      
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
      
      container.innerHTML = html;
  }
  
  /**
   * Render roadmap timeline
   * @param {Array} timeline - Timeline data
   */
  function renderRoadmapTimeline(timeline) {
      const container = document.getElementById('roadmap-timeline');
      
      if (!container) {
          console.warn('Roadmap timeline container not found');
          return;
      }
      
      let html = '';
      
      timeline.forEach(item => {
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
      
      container.innerHTML = html;
  }
})();