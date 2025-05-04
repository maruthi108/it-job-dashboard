/**
 * The issue with the Career Roadmap feature appears to be more fundamental.
 * This script provides a comprehensive fix for the entire roadmap functionality.
 * Replace or modify your existing code with these implementations.
 */

// First, ensure the RoadmapManager is properly integrated with the UI

/**
 * RoadmapManager Integration Fix
 * Ensure this runs after the page loads
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize roadmap when the roadmap tab is clicked
  const roadmapNavItem = document.querySelector('.nav-item[data-content="roadmap"]');
  if (roadmapNavItem) {
      roadmapNavItem.addEventListener('click', function() {
          // Force reinitialize roadmap data
          initializeRoadmap();
      });
  }
  
  // Also initialize when directly loading the roadmap page
  if (window.location.hash === '#roadmap') {
      initializeRoadmap();
  }
  
  // Set up event listeners for role selector and timeline filter
  const roleSelector = document.getElementById('role-selector');
  if (roleSelector) {
      roleSelector.addEventListener('change', function() {
          handleRoleSelection(roleSelector.value);
      });
  }
  
  const timelineFilter = document.getElementById('timeline-filter');
  if (timelineFilter) {
      timelineFilter.addEventListener('change', function() {
          handleTimelineFilter(parseInt(timelineFilter.value));
      });
  }
});

/**
* Initialize roadmap data and UI
*/
async function initializeRoadmap() {
  try {
      // Show loading notification
      showNotification('Loading', 'Generating your career roadmap...', 'info', 2000);
      
      // Get role from selector if available
      const roleSelector = document.getElementById('role-selector');
      const selectedRole = roleSelector ? roleSelector.value : '';
      
      // Get timeline months from filter if available
      const timelineFilter = document.getElementById('timeline-filter');
      const months = timelineFilter ? parseInt(timelineFilter.value) : 12;
      
      // Get roadmap data
      let roadmapData;
      if (selectedRole) {
          // Get role-specific roadmap
          roadmapData = {
              careerPath: RoleRoadmaps.getCareerPath(selectedRole),
              timeline: RoleRoadmaps.getTimeline(selectedRole),
              experienceSalary: RoleRoadmaps.getExperienceSalaryData(selectedRole)
          };
      } else {
          // Get personalized roadmap
          roadmapData = await RoadmapManager.generatePersonalizedRoadmap();
      }
      
      console.log('Roadmap data loaded:', roadmapData);
      
      // Render the data
      renderCareerPath(roadmapData.careerPath);
      renderRoadmapTimeline(roadmapData.timeline, months);
      createExperienceSalaryChart(roadmapData.experienceSalary);
      
      // Update displayed role
      updateDisplayedRole(selectedRole || (roadmapData.experienceSalary && roadmapData.experienceSalary.targetRole) || 'Your Target Role');
      
  } catch (error) {
      
      
      // Show fallback content
      showFallbackContent();
  }
}

/**
* Handle role selection
* @param {string} role - Selected role
*/
async function handleRoleSelection(role) {
  try {
      if (!role) return;
      
      showNotification('Loading', `Updating career path for ${role}...`, 'info', 2000);
      
      // Update the displayed role name
      updateDisplayedRole(role);
      
      // Get timeline months from filter
      const timelineFilter = document.getElementById('timeline-filter');
      const months = timelineFilter ? parseInt(timelineFilter.value) : 12;
      
      // Get role-specific data
      const careerPath = RoleRoadmaps.getCareerPath(role);
      const timeline = RoleRoadmaps.getTimeline(role);
      const experienceSalary = RoleRoadmaps.getExperienceSalaryData(role);
      
      // Render the data
      renderCareerPath(careerPath);
      renderRoadmapTimeline(timeline, months);
      createExperienceSalaryChart(experienceSalary);
      
  } catch (error) {
      console.error('Error handling role selection:', error);
      
  }
}

/**
* Handle timeline filter change
* @param {number} months - Number of months to show
*/
async function handleTimelineFilter(months) {
  try {
      // Get role from selector
      const roleSelector = document.getElementById('role-selector');
      const selectedRole = roleSelector ? roleSelector.value : '';
      
      // Get timeline data
      let timeline;
      if (selectedRole) {
          timeline = RoleRoadmaps.getTimeline(selectedRole);
      } else {
          timeline = await RoadmapManager.getTimeline(months);
      }
      
      // Render the timeline
      renderRoadmapTimeline(timeline, months);
      
  } catch (error) {
      console.error('Error handling timeline filter:', error);
      showNotification('Error', 'Failed to update timeline.', 'error');
  }
}

/**
* Render career path
* @param {Array} careerPath - Career path data
*/
function renderCareerPath(careerPath) {
  const container = document.getElementById('career-path-container');
  
  if (!container) {
      console.error('Career path container not found');
      return;
  }
  
  if (!careerPath || !Array.isArray(careerPath) || careerPath.length === 0) {
      container.innerHTML = `
          <p class="empty-message">No career path available. Complete your profile to see your personalized path.</p>
      `;
      return;
  }
  
  let html = '';
  
  careerPath.forEach((step, index) => {
      html += `
          <div class="career-path-step">
              <div class="step-indicator">${index + 1}</div>
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
* @param {number} months - Number of months to include
*/
function renderRoadmapTimeline(timeline, months = 12) {
  const container = document.getElementById('roadmap-timeline');
  
  if (!container) {
      console.error('Roadmap timeline container not found');
      return;
  }
  
  if (!timeline || !Array.isArray(timeline) || timeline.length === 0) {
      container.innerHTML = `
          <p class="empty-message">No timeline available. Complete your profile to see your skill development timeline.</p>
      `;
      return;
  }
  
  // Filter timeline based on months if needed
  let filteredTimeline = timeline;
  if (months < 18 && timeline.length > 3) {
      filteredTimeline = timeline.slice(0, 3);
  } else if (months < 24 && timeline.length > 4) {
      filteredTimeline = timeline.slice(0, 4);
  }
  
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
  
  container.innerHTML = html;
}

/**
* Create experience-salary chart
* @param {Array|Object} experienceSalaryData - Experience-salary data
*/
function createExperienceSalaryChart(experienceSalaryData) {
  // Get the canvas element
  const canvas = document.getElementById('experience-salary-chart');
  
  if (!canvas) {
      console.error('Experience-salary chart canvas not found');
      return;
  }
  
  // Make sure data is an array
  const chartData = Array.isArray(experienceSalaryData) ? 
      experienceSalaryData : 
      (experienceSalaryData && Array.isArray(experienceSalaryData.data) ? 
          experienceSalaryData.data : []);
  
  if (chartData.length === 0) {
      // Display a message if no data
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '14px Arial';
      ctx.fillStyle = '#666';
      ctx.textAlign = 'center';
      ctx.fillText('No salary data available', canvas.width / 2, canvas.height / 2);
      return;
  }
  
  // Get or create Chart.js instance
  let chart;
  if (window.salaryChart) {
      chart = window.salaryChart;
      chart.destroy(); // Destroy existing chart
  }
  
  const ctx = canvas.getContext('2d');
  
  // Format data for the chart
  const labels = chartData.map(point => `${point.years} years`);
  const salaries = chartData.map(point => point.salary);
  
  // Create new chart
  window.salaryChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: 'Salary Progression',
              data: salaries,
              borderColor: '#3498db',
              backgroundColor: 'rgba(52, 152, 219, 0.1)',
              tension: 0.3,
              fill: true
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              tooltip: {
                  callbacks: {
                      label: function(context) {
                          const value = context.parsed.y;
                          return `Salary: $${value.toLocaleString()}`;
                      }
                  }
              }
          },
          scales: {
              y: {
                  beginAtZero: false,
                  ticks: {
                      callback: function(value) {
                          return '$' + value.toLocaleString();
                      }
                  }
              }
          }
      }
  });
  
  // Add current position marker if available
  if (experienceSalaryData.currentExperience !== undefined && 
      experienceSalaryData.currentSalary !== undefined) {
      
      // Add annotated point
      const annotation = {
          type: 'point',
          xValue: labels.findIndex(label => 
              parseFloat(label) >= experienceSalaryData.currentExperience
          ),
          yValue: experienceSalaryData.currentSalary,
          backgroundColor: '#2ecc71',
          radius: 6
      };
      
      // Add to chart if annotation plugin available
      if (Chart.Annotation) {
          window.salaryChart.options.plugins.annotation = {
              annotations: {
                  currentPosition: annotation
              }
          };
          window.salaryChart.update();
      }
  }
}

/**
* Update displayed role name
* @param {string} role - Role name
*/
function updateDisplayedRole(role) {
  const roleElement = document.getElementById('career-path-role');
  if (roleElement) {
      roleElement.textContent = role || 'Your Target Role';
  }
}

/**
* Show notification
* @param {string} title - Notification title
* @param {string} message - Notification message
* @param {string} type - Notification type
* @param {number} duration - Duration in ms
*/
function showNotification(title, message, type = 'info', duration = 3000) {
  // Check if Utils.showNotification exists
  if (typeof Utils !== 'undefined' && typeof Utils.showNotification === 'function') {
      Utils.showNotification(title, message, type, duration);
  } else {
      console.log(`${type.toUpperCase()}: ${title} - ${message}`);
  }
}

/**
* Show fallback content when data loading fails
*/
function showFallbackContent() {
  // Show fallback for career path
  const careerPathContainer = document.getElementById('career-path-container');
  if (careerPathContainer) {
      careerPathContainer.innerHTML = `
          <p class="empty-message">Unable to load career path data. Please try again later.</p>
      `;
  }
  
  // Show fallback for timeline
  const roadmapTimeline = document.getElementById('roadmap-timeline');
  if (roadmapTimeline) {
      roadmapTimeline.innerHTML = `
          <p class="empty-message">Unable to load timeline data. Please try again later.</p>
      `;
  }
  
  // Clear chart
  const canvas = document.getElementById('experience-salary-chart');
  if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '14px Arial';
      ctx.fillStyle = '#666';
      ctx.textAlign = 'center';
      ctx.fillText('No salary data available', canvas.width / 2, canvas.height / 2);
  }
}