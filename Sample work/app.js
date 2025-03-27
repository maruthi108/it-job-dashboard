// User profile variables
let userProfile = null;
let matchedJobs = [];

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initNavigation();
    initProfileNavigation();
    setupEventListeners();
    loadFontAwesome();
});

// Global variables to store our data
let jobData = [];
let allSkills = [];
let allRoles = [];
let allDomains = [];

// Navigation between main tabs
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items
            navItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Show corresponding content section
            const contentId = this.getAttribute('data-content') + '-content';
            document.getElementById(contentId).classList.add('active');
        });
    });

    // Handle "View All" links
    const viewAllLinks = document.querySelectorAll('.view-all');
    viewAllLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetNav = this.getAttribute('data-nav');
            
            // Find and click the corresponding nav item
            const targetNavItem = document.querySelector(`.nav-item[data-content="${targetNav}"]`);
            if (targetNavItem) {
                targetNavItem.click();
            }
        });
    });
}

// Navigation between profile sections
function initProfileNavigation() {
    const profileNavItems = document.querySelectorAll('.profile-nav-item');
    const profileSections = document.querySelectorAll('.profile-section-content');
    
    profileNavItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items
            profileNavItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all content sections
            profileSections.forEach(section => section.classList.add('hidden'));
            
            // Show corresponding content section
            const sectionId = this.getAttribute('data-section') + '-section';
            document.getElementById(sectionId).classList.remove('hidden');
        });
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Load data button
    const loadDataBtn = document.getElementById('load-data-btn');
    if (loadDataBtn) {
        loadDataBtn.addEventListener('click', loadCsvData);
    }
    
    // CSV file import
    const importDataBtn = document.getElementById('import-data-btn');
    const csvFileInput = document.getElementById('csv-file-input');
    
    if (importDataBtn && csvFileInput) {
        importDataBtn.addEventListener('click', function() {
            csvFileInput.click();
        });
        
        csvFileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                loadCsvFile(e.target.files[0]);
            }
        });
    }
    
    // Job filters
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyJobFilters);
    }
    
    // Job search
    const jobSearchInput = document.getElementById('job-search-input');
    if (jobSearchInput) {
        jobSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            filterJobs(searchTerm);
        });
    }
    
    // Profile modal
    const modal = document.getElementById('profile-modal');
    const closeBtn = document.querySelector('.close');
    const profileForm = document.getElementById('profile-form');
    
    // Show modal on first visit
    if (!localStorage.getItem('profileComplete')) {
        showProfileModal();
    } else {
        // Load saved profile
        userProfile = JSON.parse(localStorage.getItem('userProfile'));
        updateUIWithUserProfile();
    }
    
    // Close modal when X is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Handle profile form submission
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveUserProfile();
        });
    }
    
    // Add edit profile button listener
    const editProfileBtn = document.getElementById('edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', showProfileModal);
    }
}

// Load CSV data
function loadCsvData() {
    // Show loading indicator
    const loadDataBtn = document.getElementById('load-data-btn');
    const originalBtnText = loadDataBtn.innerHTML;
    loadDataBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    loadDataBtn.disabled = true;
    
    // Load the CSV file
    Papa.parse('it_job_prediction_dataset.csv', {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            // Store the data
            jobData = results.data;
            
            // Process the data
            processJobData(jobData);
            
            // Find matching jobs if user profile exists
            if (userProfile) {
                findMatchingJobs();
            }
            
            // Update UI elements
            updateDashboard();
            updateJobMatches();
            updateSkillAnalysis();
            
            // If no user profile, update profile with sample data
            if (!userProfile) {
                updateProfile();
            }
            
            // Restore button
            loadDataBtn.innerHTML = '<i class="fas fa-check"></i> Data Loaded';
            
            // Enable button after 2 seconds
            setTimeout(() => {
                loadDataBtn.innerHTML = originalBtnText;
                loadDataBtn.disabled = false;
            }, 2000);
        },
        error: function(error) {
            console.error('Error loading CSV:', error);
            loadDataBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
            loadDataBtn.disabled = false;
            
            // Show error message
            alert('Error loading CSV data. Please check the console for details.');
        }
    });
}

// Load CSV file from upload
function loadCsvFile(file) {
    // Show loading state
    const importDataBtn = document.getElementById('import-data-btn');
    const originalBtnText = importDataBtn.innerHTML;
    importDataBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    importDataBtn.disabled = true;
    
    // Parse the file
    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            // Store the data
            jobData = results.data;
            
            // Process the data
            processJobData(jobData);
            
            // Update UI elements
            updateDashboard();
            updateJobMatches();
            updateSkillAnalysis();
            updateProfile();
            
            // Restore button
            importDataBtn.innerHTML = '<i class="fas fa-check"></i> Data Loaded';
            
            // Enable button after 2 seconds
            setTimeout(() => {
                importDataBtn.innerHTML = originalBtnText;
                importDataBtn.disabled = false;
            }, 2000);
        },
        error: function(error) {
            console.error('Error parsing CSV file:', error);
            importDataBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
            importDataBtn.disabled = false;
            
            // Show error message
            alert('Error parsing CSV file. Please check the file format.');
        }
    });
}

// Process job data
function processJobData(data) {
    // Extract unique skills
    allSkills = [];
    data.forEach(job => {
        if (job.technical_skills) {
            const skills = job.technical_skills.split(',').map(s => s.trim());
            skills.forEach(skill => {
                if (!allSkills.includes(skill) && skill) {
                    allSkills.push(skill);
                }
            });
        }
    });
    
    // Extract unique roles
    allRoles = [...new Set(data.map(job => job.preferred_role).filter(role => role))];
    
    // Extract unique domains
    allDomains = [];
    data.forEach(job => {
        if (job.previous_domains) {
            const domains = job.previous_domains.split(',').map(d => d.trim());
            domains.forEach(domain => {
                if (!allDomains.includes(domain) && domain) {
                    allDomains.push(domain);
                }
            });
        }
    });
    
    // Populate role filter dropdown
    const roleFilter = document.getElementById('role-filter');
    if (roleFilter) {
        // Clear existing options except the first one
        while (roleFilter.options.length > 1) {
            roleFilter.remove(1);
        }
        
        // Add new options
        allRoles.forEach(role => {
            const option = document.createElement('option');
            option.value = role;
            option.textContent = role;
            roleFilter.appendChild(option);
        });
    }
}

// Update dashboard with data
function updateDashboard() {
    // Update metrics
    updateMetrics();
    
    // Update top jobs
    updateTopJobs();
    
    // Update skills chart
    createSkillsChart();
    
    // Update salary chart
    createSalaryChart();
}

// Update metrics
function updateMetrics() {
    // Use match percentage if available
    const matchPercentage = userProfile && matchedJobs.length > 0 ? 
        matchedJobs[0].matchScore : Math.floor(Math.random() * 20) + 80; // 80-99%
    document.getElementById('match-percentage').textContent = matchPercentage + '%';
    
    // Count unique skills
    const skillsCount = allSkills.length;
    document.getElementById('skills-count').textContent = skillsCount;
    
    // Calculate average experience
    const avgExperience = jobData.reduce((sum, job) => sum + (job.years_experience || 0), 0) / jobData.length;
    document.getElementById('avg-experience').textContent = avgExperience.toFixed(1) + ' years';
    
    // Calculate average salary
    const avgSalary = jobData.reduce((sum, job) => sum + (job.current_salary || 0), 0) / jobData.length;
    document.getElementById('avg-salary').textContent = '$' + Math.round(avgSalary).toLocaleString();
    
    // Update new matches count
    const qualityMatches = userProfile && matchedJobs.length ? 
        matchedJobs.filter(job => job.matchScore >= 70).length : Math.min(jobData.length, 20);
    document.getElementById('new-matches-count').textContent = qualityMatches + ' job matches';
}

// Update top jobs
function updateTopJobs() {
    const topJobsContainer = document.getElementById('top-jobs-container');
    if (!topJobsContainer) return;
    
    // Get top 3 matched jobs or random jobs if no matches
    const topJobs = userProfile && matchedJobs.length ? 
        matchedJobs.slice(0, 3) : getRandomJobs(3);
    
    // Clear container
    topJobsContainer.innerHTML = '';
    
    if (topJobs.length === 0) {
        topJobsContainer.innerHTML = '<div class="loading">No matching jobs found. Try updating your profile.</div>';
        return;
    }
    
    // Generate job cards
    topJobs.forEach(job => {
        const jobCard = userProfile ? 
            createJobCardWithLinkedIn(job) : createJobCard(job);
        topJobsContainer.appendChild(jobCard);
    });
}

// Create a job card element
function createJobCard(job) {
    // Create job card element
    const jobCard = document.createElement('div');
    jobCard.className = 'job-card';
    
    // Generate skills HTML
    let skillsHTML = '';
    if (job.technical_skills) {
        const skills = job.technical_skills.split(',').map(s => s.trim());
        skills.slice(0, 4).forEach(skill => {
            // Randomly determine if it's a match or gap for demo purposes
            const isMatch = Math.random() > 0.3;
            skillsHTML += `<span class="skill-tag ${isMatch ? 'match' : 'gap'}">${skill}</span>`;
        });
    }
    
    // Generate match percentage (random for demo)
    const matchPercentage = Math.floor(Math.random() * 15) + 85; // 85-99%
    
    // Get company name (first letter of each word in role)
    const roleWords = job.preferred_role ? job.preferred_role.split(' ') : ['Tech', 'Job'];
    const companyInitials = roleWords.map(w => w.charAt(0)).join('');
    
    // Generate random color for company logo
    const colors = ['#3498db', '#2ecc71', '#9b59b6', '#e74c3c', '#f39c12', '#1abc9c'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Create job card HTML
    jobCard.innerHTML = `
        <div class="job-header">
            <div class="company-logo" style="background-color: ${randomColor};">${companyInitials}</div>
            <div class="match-badge">${matchPercentage}% Match</div>
        </div>
        <h4 class="job-title">${job.preferred_role || 'IT Position'}</h4>
        <div class="company-name">Tech Company</div>
        <div class="job-details">
            <div class="job-detail"><i class="fas fa-map-marker-alt"></i> ${job.location_preference || 'Remote'}</div>
            <div class="job-detail"><i class="fas fa-dollar-sign"></i> $${Math.round(job.current_salary || 100000).toLocaleString()}</div>
        </div>
        <div class="skills-container">
            ${skillsHTML}
        </div>
        <div class="job-actions">
            <button class="btn-primary">Apply Now</button>
            <button class="btn-secondary"><i class="far fa-bookmark"></i></button>
        </div>
    `;
    
    // Add event listeners
    const applyBtn = jobCard.querySelector('.btn-primary');
    applyBtn.addEventListener('click', function() {
        alert(`Application submitted for ${job.preferred_role || 'IT Position'}!`);
        this.textContent = 'Applied';
        this.disabled = true;
        this.style.backgroundColor = '#7f8c8d';
    });
    
    const bookmarkBtn = jobCard.querySelector('.btn-secondary');
    bookmarkBtn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.style.color = '#f39c12';
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.style.color = '';
        }
    });
    
    return jobCard;
}

// Get random jobs
function getRandomJobs(count) {
    if (jobData.length <= count) return jobData;
    
    const shuffled = [...jobData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Create skills chart
function createSkillsChart() {
    const ctx = document.getElementById('skills-chart');
    if (!ctx) return;
    
    // Count skills frequency
    const skillCounts = {};
    jobData.forEach(job => {
        if (job.technical_skills) {
            const skills = job.technical_skills.split(',').map(s => s.trim());
            skills.forEach(skill => {
                skillCounts[skill] = (skillCounts[skill] || 0) + 1;
            });
        }
    });
    
    // Get top skills
    const topSkills = Object.entries(skillCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);
    
    // Prepare chart data
    const labels = topSkills.map(s => s[0]);
    const data = topSkills.map(s => s[1]);
    
    // Check if chart already exists and destroy it
    if (window.skillsChart) {
        window.skillsChart.destroy();
    }
    
    // Create new chart
    window.skillsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Frequency',
                data: data,
                backgroundColor: '#3498db',
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Count: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Frequency'
                    }
                }
            }
        }
    });
}

// Create salary chart
function createSalaryChart() {
    const ctx = document.getElementById('salary-chart');
    if (!ctx) return;
    
    // Group salaries by role
    const roleSalaries = {};
    jobData.forEach(job => {
        if (job.preferred_role && job.current_salary) {
            if (!roleSalaries[job.preferred_role]) {
                roleSalaries[job.preferred_role] = [];
            }
            roleSalaries[job.preferred_role].push(job.current_salary);
        }
    });
    
    // Calculate average salaries
    const avgSalaries = Object.entries(roleSalaries)
        .map(([role, salaries]) => {
            const avg = salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length;
            return { role, avgSalary: avg };
        })
        .sort((a, b) => b.avgSalary - a.avgSalary)
        .slice(0, 6);
    
    // Prepare chart data
    const labels = avgSalaries.map(s => s.role);
    const data = avgSalaries.map(s => Math.round(s.avgSalary / 1000)); // Convert to $K
    
    // Check if chart already exists and destroy it
    if (window.salaryChart) {
        window.salaryChart.destroy();
    }
    
    // Create new chart
    window.salaryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Salary ($K)',
                data: data,
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#9b59b6',
                    '#e74c3c',
                    '#f39c12',
                    '#1abc9c'
                ],
                borderWidth: 0
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Average Salary: $${context.raw}K`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Salary ($K)'
                    }
                }
            }
        }
    });
}

// Update job matches
function updateJobMatches() {
    const allJobsContainer = document.getElementById('all-jobs-container');
    if (!allJobsContainer) return;
    
    // Clear container
    allJobsContainer.innerHTML = '';
    
    // Use matched jobs if available, otherwise use all jobs
    const jobs = userProfile && matchedJobs.length ? matchedJobs : jobData;
    
    if (jobs.length === 0) {
        allJobsContainer.innerHTML = '<div class="loading">No matching jobs found. Try updating your profile.</div>';
        return;
    }
    
    // Add all jobs
    jobs.forEach(job => {
        const jobCard = userProfile ? 
            createJobCardWithLinkedIn(job) : createJobCard(job);
        allJobsContainer.appendChild(jobCard);
    });
}

// Filter jobs based on search term
function filterJobs(searchTerm) {
    const allJobsContainer = document.getElementById('all-jobs-container');
    if (!allJobsContainer) return;
    
    // Get all job cards
    const jobCards = allJobsContainer.querySelectorAll('.job-card');
    
    // Filter job cards
    jobCards.forEach(card => {
        const title = card.querySelector('.job-title').textContent.toLowerCase();
        const skills = card.querySelector('.skills-container').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || skills.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Apply job filters
function applyJobFilters() {
    const roleFilter = document.getElementById('role-filter').value;
    const locationFilter = document.getElementById('location-filter').value;
    const experienceFilter = document.getElementById('experience-filter').value;
    
    const allJobsContainer = document.getElementById('all-jobs-container');
    if (!allJobsContainer) return;
    
    // Show loading message
    allJobsContainer.innerHTML = '<div class="loading">Filtering jobs...</div>';
    
    // Simulate loading delay
    setTimeout(() => {
        // Use matched jobs if available, otherwise use all jobs
        const jobsToFilter = userProfile && matchedJobs.length ? matchedJobs : jobData;
        
        // Filter jobs
        const filteredJobs = jobsToFilter.filter(job => {
            // Filter by role
            if (roleFilter !== 'all' && job.preferred_role !== roleFilter) {
                return false;
            }
            
            // Filter by location
            if (locationFilter !== 'all' && job.location_preference !== locationFilter) {
                return false;
            }
            
            // Filter by experience
            if (experienceFilter !== 'all') {
                const exp = job.years_experience || 0;
                if (experienceFilter === '2-4' && (exp < 2 || exp > 4)) {
                    return false;
                } else if (experienceFilter === '5-7' && (exp < 5 || exp > 7)) {
                    return false;
                } else if (experienceFilter === '8+' && exp < 8) {
                    return false;
                }
            }
            
            return true;
        });
        
        // Clear container
        allJobsContainer.innerHTML = '';
        
        // Add filtered jobs
        if (filteredJobs.length > 0) {
            filteredJobs.forEach(job => {
                const jobCard = userProfile ? 
                    createJobCardWithLinkedIn(job) : createJobCard(job);
                allJobsContainer.appendChild(jobCard);
            });
        } else {
            allJobsContainer.innerHTML = '<div class="loading">No jobs match your filters</div>';
        }
    }, 500);
}

// Update skill analysis
function updateSkillAnalysis() {
    // Create skill radar chart
    createSkillRadarChart();
    
    // Create education chart
    createEducationChart();
    
    // Create experience-salary chart
    createExperienceSalaryChart();
    
    // Update top skills container
    updateTopSkills();
}

// Create skill radar chart
function createSkillRadarChart() {
    const ctx = document.getElementById('skill-radar-chart');
    if (!ctx) return;
    
    // Count skills by category
    const categories = {
        'Frontend': ['JavaScript', 'React', 'Angular', 'Vue', 'HTML', 'CSS'],
        'Backend': ['Node.js', 'Python', 'Java', 'C#', 'PHP', 'Ruby'],
        'Database': ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Oracle', 'NoSQL'],
        'DevOps': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD'],
        'Mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Android', 'iOS'],
        'Other': ['GraphQL', 'REST API', 'Git', 'Testing', 'Security', 'UI/UX']
    };
    
    // Count skills in each category
    const categoryCounts = {};
    Object.keys(categories).forEach(category => {
        categoryCounts[category] = 0;
        
        jobData.forEach(job => {
            if (job.technical_skills) {
                const skills = job.technical_skills.split(',').map(s => s.trim());
                
                skills.forEach(skill => {
                    if (categories[category].some(s => skill.includes(s))) {
                        categoryCounts[category]++;
                    }
                });
            }
        });
    });
    
    // Normalize counts to 0-100
    const maxCount = Math.max(...Object.values(categoryCounts));
    const normalizedCounts = {};
    Object.keys(categoryCounts).forEach(category => {
        normalizedCounts[category] = Math.round((categoryCounts[category] / maxCount) * 100);
    });
    
    // Check if chart already exists and destroy it
    if (window.skillRadarChart) {
        window.skillRadarChart.destroy();
    }
    
    // Create new chart
    window.skillRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                label: 'Skill Distribution',
                data: Object.values(normalizedCounts),
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: '#3498db',
                pointBackgroundColor: '#3498db',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#3498db'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                line: {
                    borderWidth: 3
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
}

// Create education chart
function createEducationChart() {
    const ctx = document.getElementById('education-chart');
    if (!ctx) return;
    
    // Count jobs by education level
    const educationCounts = {};
    jobData.forEach(job => {
        if (job.education_level) {
            educationCounts[job.education_level] = (educationCounts[job.education_level] || 0) + 1;
        }
    });
    
    // Calculate average salary by education level
    const educationSalaries = {};
    jobData.forEach(job => {
        if (job.education_level && job.current_salary) {
            if (!educationSalaries[job.education_level]) {
                educationSalaries[job.education_level] = [];
            }
            educationSalaries[job.education_level].push(job.current_salary);
        }
    });
    
    const avgSalaries = {};
    Object.keys(educationSalaries).forEach(level => {
        const salaries = educationSalaries[level];
        avgSalaries[level] = Math.round(salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length / 1000); // Convert to $K
    });
    
    // Prepare chart data
    const labels = Object.keys(educationCounts);
    const salaryData = labels.map(level => avgSalaries[level] || 0);
    const countData = labels.map(level => educationCounts[level]);
    
    // Check if chart already exists and destroy it
    if (window.educationChart) {
        window.educationChart.destroy();
    }
    
    // Create new chart
    window.educationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Average Salary ($K)',
                    data: salaryData,
                    yAxisID: 'y',
                    backgroundColor: '#3498db',
                    borderWidth: 0
                },
                {
                    label: 'Count',
                    data: countData,
                    yAxisID: 'y1',
                    backgroundColor: '#2ecc71',
                    borderWidth: 0,
                    type: 'line',
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Salary ($K)'
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    },
                    title: {
                        display: true,
                        text: 'Count'
                    }
                }
            }
        }
    });
}

// Create experience-salary chart
function createExperienceSalaryChart() {
    const ctx = document.getElementById('experience-salary-chart');
    if (!ctx) return;
    
    // Group data by experience
    const experienceSalaries = {};
    jobData.forEach(job => {
        if (job.years_experience && job.current_salary) {
            // Round experience to nearest integer
            const expYears = Math.round(job.years_experience);
            if (!experienceSalaries[expYears]) {
                experienceSalaries[expYears] = [];
            }
            experienceSalaries[expYears].push(job.current_salary);
        }
    });
    
    // Calculate min, max, and avg salary for each experience level
    const expData = [];
    Object.keys(experienceSalaries).sort((a, b) => a - b).forEach(exp => {
        const salaries = experienceSalaries[exp];
        const avg = salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length;
        const min = Math.min(...salaries);
        const max = Math.max(...salaries);
        
        expData.push({
            exp: parseInt(exp),
            avg: Math.round(avg / 1000), // Convert to $K
            min: Math.round(min / 1000),
            max: Math.round(max / 1000)
        });
    });
    
    // Prepare chart data
    const labels = expData.map(d => d.exp + ' years');
    const avgData = expData.map(d => d.avg);
    const minData = expData.map(d => d.min);
    const maxData = expData.map(d => d.max);
    
    // Check if chart already exists and destroy it
    if (window.expSalaryChart) {
        window.expSalaryChart.destroy();
    }
    
    // Create new chart
    window.expSalaryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Average Salary ($K)',
                    data: avgData,
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: '#3498db',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Minimum Salary ($K)',
                    data: minData,
                    borderColor: '#e74c3c',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.4,
                    fill: false,
                    pointStyle: 'rect'
                },
                {
                    label: 'Maximum Salary ($K)',
                    data: maxData,
                    borderColor: '#2ecc71',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.4,
                    fill: false,
                    pointStyle: 'triangle'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Salary ($K)'
                    }
                }
            }
        }
    });
}

// Update top skills container
function updateTopSkills() {
    const topSkillsContainer = document.getElementById('top-skills-container');
    if (!topSkillsContainer) return;
    
    // Group skills by role
    const roleSkills = {};
    jobData.forEach(job => {
        if (job.preferred_role && job.technical_skills) {
            if (!roleSkills[job.preferred_role]) {
                roleSkills[job.preferred_role] = {};
            }
            
            const skills = job.technical_skills.split(',').map(s => s.trim());
            skills.forEach(skill => {
                if (skill) {
                    roleSkills[job.preferred_role][skill] = (roleSkills[job.preferred_role][skill] || 0) + 1;
                }
            });
        }
    });
    
    // Get top skills by role
    const topRoles = Object.keys(roleSkills).sort();
    
    // Clear container
    topSkillsContainer.innerHTML = '';
    
    // Add top skills for each role
    topRoles.slice(0, 5).forEach(role => {
        const skillCounts = roleSkills[role];
        const topSkills = Object.entries(skillCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
        
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-gap-item';
        
        skillItem.innerHTML = `
            <div class="skill-name">${role}</div>
            <div class="skill-progress-container">
                <div class="skill-progress" style="width: 100%"></div>
            </div>
            <div class="skill-count">${topSkills.map(s => s[0]).join(', ')}</div>
        `;
        
        topSkillsContainer.appendChild(skillItem);
    });
}

// Update profile
function updateProfile() {
    // Use the first job data as the profile (in a real app, this would be the user's profile)
    const profile = jobData[0] || {};
    
    // Update profile header
    document.getElementById('location-value').textContent = profile.location_preference || 'Not specified';
    document.getElementById('education-value').textContent = profile.education_level || 'Not specified';
    
    // Update skills section
    updateSkillsSection(profile);
    
    // Update experience section
    updateExperienceSection(profile);
    
    // Update domains section
    updateDomainsSection(profile);
    
    // Update preferences section
    updatePreferencesSection(profile);
}

// Update skills section
function updateSkillsSection(profile) {
    const skillsContainer = document.getElementById('skills-container');
    if (!skillsContainer) return;
    
    // Clear container
    skillsContainer.innerHTML = '';
    
    // Add skills
    if (profile.technical_skills) {
        const skills = profile.technical_skills.split(',').map(s => s.trim());
        
        skills.forEach(skill => {
            if (skill) {
                const skillItem = document.createElement('div');
                skillItem.className = 'skill-item';
                
                skillItem.innerHTML = `
                    <div class="skill-info">
                        <h4>${skill}</h4>
                    </div>
                `;
                
                skillsContainer.appendChild(skillItem);
            }
        });
    } else {
        skillsContainer.innerHTML = '<p>No skills data available</p>';
    }
}

// Update experience section
function updateExperienceSection(profile) {
    // Update experience value
    document.getElementById('years-experience-value').textContent = 
        profile.years_experience ? profile.years_experience.toFixed(1) + ' years' : 'Not specified';
    
    // Update last job duration
    document.getElementById('last-job-duration-value').textContent = 
        profile.last_job_duration ? profile.last_job_duration.toFixed(1) + ' months' : 'Not specified';
    
    // Update current salary
    document.getElementById('current-salary-value').textContent = 
        profile.current_salary ? '$' + profile.current_salary.toLocaleString() : 'Not specified';
}

// Update domains section
function updateDomainsSection(profile) {
    const domainsContainer = document.getElementById('domains-container');
    if (!domainsContainer) return;
    
    // Clear container
    domainsContainer.innerHTML = '';
    
    // Add domains
    if (profile.previous_domains) {
        const domains = profile.previous_domains.split(',').map(d => d.trim());
        
        domains.forEach(domain => {
            if (domain) {
                const domainTag = document.createElement('div');
                domainTag.className = 'domain-tag';
                domainTag.textContent = domain;
                
                domainsContainer.appendChild(domainTag);
            }
        });
    } else {
        domainsContainer.innerHTML = '<p>No domain data available</p>';
    }
}

// Update preferences section
function updatePreferencesSection(profile) {
    // Update preferred role
    document.getElementById('preferred-role-value').textContent = 
        profile.preferred_role || 'Not specified';
    
    // Update location preference
    document.getElementById('location-preference-value').textContent = 
        profile.location_preference || 'Not specified';
    
    // Update certifications
    document.getElementById('certifications-value').textContent = 
        profile.has_certifications ? 'Yes' : 'No';
}

// Show profile modal
function showProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (modal) {
        modal.style.display = 'block';
        
        // Pre-fill form with existing data if available
        if (userProfile) {
            document.getElementById('user-name-input').value = userProfile.name || '';
            document.getElementById('user-skills').value = userProfile.technical_skills || '';
            document.getElementById('user-experience').value = userProfile.years_experience || '';
            document.getElementById('user-education').value = userProfile.education_level || '';
            document.getElementById('user-location').value = userProfile.location_preference || '';
            document.getElementById('user-domains').value = userProfile.previous_domains || '';
            document.getElementById('user-role').value = userProfile.preferred_role || '';
            document.getElementById('user-certifications').value = userProfile.has_certifications ? 'true' : 'false';
            document.getElementById('user-salary').value = userProfile.current_salary || '';
        }
    }
}

// Save user profile from form
function saveUserProfile() {
    userProfile = {
        name: document.getElementById('user-name-input').value,
        technical_skills: document.getElementById('user-skills').value,
        years_experience: parseFloat(document.getElementById('user-experience').value),
        education_level: document.getElementById('user-education').value,
        location_preference: document.getElementById('user-location').value,
        previous_domains: document.getElementById('user-domains').value,
        preferred_role: document.getElementById('user-role').value,
        has_certifications: document.getElementById('user-certifications').value === 'true',
        current_salary: parseInt(document.getElementById('user-salary').value) || 0
    };
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    localStorage.setItem('profileComplete', 'true');
    
    // Close modal
    document.getElementById('profile-modal').style.display = 'none';
    
    // Update UI
    updateUIWithUserProfile();
    
    // Find matching jobs if dataset is loaded
    if (jobData.length > 0) {
        findMatchingJobs();
    } else {
        // Load data first, then find matches
        loadCsvData();
    }
}

// Update UI with user profile
function updateUIWithUserProfile() {
    if (!userProfile) return;
    
    // Update name in welcome message
    const userName = document.getElementById('user-name');
    if (userName) {
        userName.textContent = userProfile.name.split(' ')[0] || 'User';
    }
    
    // Update profile info
    document.querySelector('.profile-info h2').textContent = userProfile.name || 'IT Professional';
    document.querySelector('.profile-info p').textContent = 
        `${userProfile.preferred_role} with ${userProfile.years_experience} years of experience`;
    
    // Update other profile sections
    document.getElementById('location-value').textContent = userProfile.location_preference || 'Not specified';
    document.getElementById('education-value').textContent = userProfile.education_level || 'Not specified';
    
    // Update skills section
    updateSkillsSection(userProfile);
    
    // Update experience section
    document.getElementById('years-experience-value').textContent = 
        userProfile.years_experience ? userProfile.years_experience.toFixed(1) + ' years' : 'Not specified';
    
    document.getElementById('current-salary-value').textContent = 
        userProfile.current_salary ? '$' + userProfile.current_salary.toLocaleString() : 'Not specified';
    
    // Update preferences section
    document.getElementById('preferred-role-value').textContent = 
        userProfile.preferred_role || 'Not specified';
    
    document.getElementById('location-preference-value').textContent = 
        userProfile.location_preference || 'Not specified';
    
    document.getElementById('certifications-value').textContent = 
        userProfile.has_certifications ? 'Yes' : 'No';
    
    // Update domains section
    const domainsContainer = document.getElementById('domains-container');
    if (domainsContainer && userProfile.previous_domains) {
        domainsContainer.innerHTML = '';
        
        const domains = userProfile.previous_domains.split(',').map(d => d.trim());
        domains.forEach(domain => {
            if (domain) {
                const domainTag = document.createElement('div');
                domainTag.className = 'domain-tag';
                domainTag.textContent = domain;
                domainsContainer.appendChild(domainTag);
            }
        });
    }
}

// Find jobs matching user profile
function findMatchingJobs() {
    if (!userProfile || !jobData.length) return;
    
    // Extract user skills as array
    const userSkills = userProfile.technical_skills.split(',').map(s => s.trim().toLowerCase());
    
    // Calculate match score for each job
    matchedJobs = jobData.map(job => {
        // Extract job skills
        const jobSkills = job.technical_skills ? 
            job.technical_skills.split(',').map(s => s.trim().toLowerCase()) : [];
        
        // Count matching skills
        const matchingSkills = jobSkills.filter(skill => userSkills.includes(skill));
        const skillMatchCount = matchingSkills.length;
        const skillMatchPercentage = jobSkills.length > 0 ? 
            (skillMatchCount / jobSkills.length) * 100 : 0;
        
        // Calculate experience match (closer is better)
        const expDiff = job.years_experience ? 
            Math.abs(job.years_experience - userProfile.years_experience) : 5;
        const expMatch = Math.max(0, 100 - (expDiff * 10)); // Penalize difference
        
        // Location match
        const locationMatch = job.location_preference === userProfile.location_preference ? 100 : 50;
        
        // Role match
        const roleMatch = job.preferred_role && userProfile.preferred_role &&
            job.preferred_role.toLowerCase().includes(userProfile.preferred_role.toLowerCase()) ? 100 : 60;
        
        // Calculate overall match score (weighted average)
        const overallMatch = (
            (skillMatchPercentage * 0.5) + // Skills are most important
            (expMatch * 0.2) +             // Experience is second
            (locationMatch * 0.15) +       // Location preference
            (roleMatch * 0.15)             // Role match
        );
        
        // Add match data to job
        return {
            ...job,
            matchScore: Math.round(overallMatch),
            matchingSkills: matchingSkills,
            skillMatchPercentage: skillMatchPercentage
        };
    });
    
    // Sort by match score (highest first)
    matchedJobs.sort((a, b) => b.matchScore - a.matchScore);
    
    // Update UI with matched jobs
    updateTopJobs();
    updateJobMatches();
    
    // Update new matches count
    const qualityMatches = matchedJobs.filter(job => job.matchScore >= 70).length;
    document.getElementById('new-matches-count').textContent = qualityMatches + ' job matches';
    
    // Update match percentage in metrics
    const topMatchScore = matchedJobs.length > 0 ? matchedJobs[0].matchScore : 0;
    document.getElementById('match-percentage').textContent = topMatchScore + '%';
}

// Create job card with LinkedIn integration and user skill matching
function createJobCardWithLinkedIn(job) {
    // Create job card element
    const jobCard = document.createElement('div');
    jobCard.className = 'job-card';
    
    // Generate skills HTML with highlighting for user matches
    let skillsHTML = '';
    if (job.technical_skills) {
        const skills = job.technical_skills.split(',').map(s => s.trim());
        const matchingSkills = job.matchingSkills || [];
        
        skills.slice(0, 4).forEach(skill => {
            // Check if this skill matches user's skills
            const isMatch = matchingSkills.some(m => m.toLowerCase() === skill.toLowerCase());
            skillsHTML += `<span class="skill-tag ${isMatch ? 'user-match' : 'gap'}">${skill}</span>`;
        });
    }
    
    // Get company name (first letter of each word in role)
    const roleWords = job.preferred_role ? job.preferred_role.split(' ') : ['Tech', 'Job'];
    const companyInitials = roleWords.map(w => w.charAt(0)).join('');
    
    // Generate mock LinkedIn ID from job ID
    const linkedinJobId = job.id ? job.id * 1000 + 123456789 : Math.floor(Math.random() * 9000000) + 1000000;
    
    // Generate random color for company logo
    const colors = ['#3498db', '#2ecc71', '#9b59b6', '#e74c3c', '#f39c12', '#1abc9c'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Create job card HTML
    jobCard.innerHTML = `
        <div class="job-header">
            <div class="company-logo ${Math.random() > 0.6 ? 'linkedin' : ''}" style="background-color: ${randomColor};">${companyInitials}</div>
            <div class="match-badge">${job.matchScore || 'N/A'}% Match</div>
        </div>
        <h4 class="job-title">${job.preferred_role || 'IT Position'}</h4>
        <div class="company-name">Tech Company</div>
        <div class="job-details">
            <div class="job-detail"><i class="fas fa-map-marker-alt"></i> ${job.location_preference || 'Remote'}</div>
            <div class="job-detail"><i class="fas fa-dollar-sign"></i> $${Math.round(job.current_salary || 100000).toLocaleString()}</div>
        </div>
        <div class="skills-container">
            ${skillsHTML}
        </div>
        <div class="job-actions">
            <a href="https://www.linkedin.com/jobs/view/${linkedinJobId}" target="_blank" class="linkedin-apply">
                <i class="fab fa-linkedin"></i> Apply on LinkedIn
            </a>
            <button class="btn-secondary"><i class="far fa-bookmark"></i></button>
        </div>
    `;
    
    // Add event listener for bookmark button
    const bookmarkBtn = jobCard.querySelector('.btn-secondary');
    bookmarkBtn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.style.color = '#f39c12';
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.style.color = '';
        }
    });
    
    return jobCard;
}

// Call this function on page load to ensure Font Awesome is loaded for LinkedIn icon
function loadFontAwesome() {
    // Check if Font Awesome is already loaded
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
        document.head.appendChild(link);
    }
}