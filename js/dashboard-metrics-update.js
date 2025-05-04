/**
 * Dashboard Key Metrics Random Generator
 * 
 * This script dynamically updates the Key Metrics section in the dashboard
 * with randomly generated values to simulate real-time data.
 */

// Self-executing function to avoid global namespace pollution
(function() {
  // Run when document is loaded
  document.addEventListener('DOMContentLoaded', function() {
      // Initialize metrics on page load
      updateMetrics();
      
      // Check if we're on the dashboard and update metrics
      const dashboardNav = document.querySelector('.nav-item[data-content="dashboard"]');
      if (dashboardNav) {
          dashboardNav.addEventListener('click', function() {
              setTimeout(updateMetrics, 300);
          });
      }
      
      // Setup refresh button
      const refreshDataBtn = document.getElementById('refresh-data-btn');
      if (refreshDataBtn) {
          refreshDataBtn.addEventListener('click', function() {
              // Add loading animation
              const metricsContainer = document.querySelector('.metrics-container');
              if (metricsContainer) {
                  metricsContainer.classList.add('metrics-loading');
                  
                  // Update after a short delay to show loading effect
                  setTimeout(function() {
                      updateMetrics();
                      metricsContainer.classList.remove('metrics-loading');
                  }, 800);
              } else {
                  updateMetrics();
              }
          });
      }
      
      // Auto-update metrics periodically (every 30 seconds)
      setInterval(function() {
          const dashboardContent = document.getElementById('dashboard-content');
          if (dashboardContent && dashboardContent.classList.contains('active')) {
              updateMetrics(true); // Subtle update without animation
          }
      }, 30000);
  });
  
  /**
   * Update dashboard metrics with random data
   * @param {boolean} subtle - Whether to use subtle animation
   */
  function updateMetrics(subtle = false) {
      // Match Percentages (70% to 95%)
      updateMetricValue('match-percentages', getRandomInt(70, 95) + '%', subtle);
      
      // Annual Growth (3% to 12%)
      updateMetricValue('skills-counts', getRandomInt(3, 12) + '%', subtle);
      
      // Profile Score (60 to 98 out of 100)
      updateMetricValue('market-demands', getRandomInt(60, 98) + '/100', subtle);
      
      // Salary Potential (70,000 to 150,000)
      const salary = getRandomInt(7, 15) * 10000;
      updateMetricValue('salary-potentials', '$' + salary.toLocaleString(), subtle);
      
      // Update insights too if they exist
      updateInsights();
      
      // Console confirmation
      console.log('Dashboard metrics updated: ' + new Date().toLocaleString());
  }
  
  /**
   * Update a specific metric value with animation
   * @param {string} id - Element ID
   * @param {string} value - New value
   * @param {boolean} subtle - Whether to use subtle animation
   */
  function updateMetricValue(id, value, subtle) {
      const element = document.getElementById(id);
      if (!element) return;
      
      // If subtle update, just change with minimal animation
      if (subtle) {
          element.style.transition = 'opacity 0.3s ease';
          element.style.opacity = 0.5;
          
          setTimeout(function() {
              element.textContent = value;
              element.style.opacity = 1;
          }, 300);
          return;
      }
      
      // Add animation class
      element.classList.add('metric-updating');
      
      // Update the value after animation starts
      setTimeout(function() {
          element.textContent = value;
          
          // Remove animation class
          setTimeout(function() {
              element.classList.remove('metric-updating');
          }, 500);
      }, 300);
  }
  
  /**
   * Update insight content
   */
  function updateInsights() {
      // Skill Gap Insight
      const skillGapInsight = document.getElementById('skill-gap-insight');
      if (skillGapInsight) {
          const skills = ['JavaScript', 'React', 'Python', 'Cloud Computing', 'DevOps', 
                        'Data Analysis', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 
                        'TypeScript', 'Machine Learning', 'Soft Skills', 'Node.js'];
          
          const randomSkills = getRandomItems(skills, 2);
          skillGapInsight.textContent = `Adding ${randomSkills.join(' and ')} to your skillset would increase your match rate by ${getRandomInt(15, 30)}% based on current market demand.`;
      }
      
      // Market Trends Insight
      const marketTrendsInsight = document.getElementById('market-trends-insight');
      if (marketTrendsInsight) {
          const trends = [
              `${getRandomInt(10, 30)}% increase in remote job opportunities in the last quarter.`,
              `${getRandomInt(5, 20)}% salary premium for professionals with cloud certifications.`,
              `${getRandomInt(15, 40)}% higher demand for full-stack developers compared to specialists.`,
              `${getRandomInt(8, 25)}% growth in AI and machine learning positions in your area.`,
              `Average interview-to-offer time has decreased by ${getRandomInt(10, 30)}% in the last 6 months.`
          ];
          
          marketTrendsInsight.textContent = getRandomItem(trends);
      }
  }
  
  /**
   * Get random integer between min and max (inclusive)
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random integer
   */
  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  /**
   * Get random item from array
   * @param {Array} array - Array of items
   * @returns {*} Random item
   */
  function getRandomItem(array) {
      return array[Math.floor(Math.random() * array.length)];
  }
  
  /**
   * Get random items from array
   * @param {Array} array - Array of items
   * @param {number} count - Number of items to get
   * @returns {Array} Random items
   */
  function getRandomItems(array, count) {
      const shuffled = array.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
  }
})();