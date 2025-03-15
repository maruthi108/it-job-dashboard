/**
 * Data management for TechCareerMatch application
 * Handles storage, retrieval, and sample data
 */

const DataManager = {
    /**
     * Initialize storage and load data
     */
    init: async function() {
        try {
            // Configure LocalForage
            localforage.config({
                name: CONFIG.storage.name,
                description: CONFIG.storage.description,
                version: CONFIG.version
            });
            
            // Check if it's the first run or we need to load sample data
            const lastUpdate = await localforage.getItem(CONFIG.storage.lastUpdateKey);
            
            if (!lastUpdate) {
                await this.loadSampleData();
            }
            
            console.log('DataManager initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing DataManager:', error);
            return false;
        }
    },
    
    /**
     * Load sample data for demonstration
     */
    loadSampleData: async function() {
        try {
            // Sample user profile
            const userProfile = {
                name: 'IT Professional',
                email: 'user@example.com',
                location: 'San Francisco, CA',
                education: "Bachelor's",
                linkedin: '',
                jobTitle: 'Software Developer',
                experience: 5.5,
                currentSalary: 85000,
                lastUpdated: new Date().toISOString()
            };
            
            // Sample user skills
            const userSkills = [
                { id: Utils.generateId(), name: 'JavaScript', level: 'Advanced', experience: 4.5 },
                { id: Utils.generateId(), name: 'React', level: 'Intermediate', experience: 2.5 },
                { id: Utils.generateId(), name: 'Node.js', level: 'Intermediate', experience: 3.0 },
                { id: Utils.generateId(), name: 'HTML/CSS', level: 'Advanced', experience: 5.0 },
                { id: Utils.generateId(), name: 'SQL', level: 'Intermediate', experience: 3.5 },
                { id: Utils.generateId(), name: 'Git', level: 'Advanced', experience: 4.0 },
                { id: Utils.generateId(), name: 'Python', level: 'Beginner', experience: 1.0 },
                { id: Utils.generateId(), name: 'AWS', level: 'Beginner', experience: 1.5 }
            ];
            
            // Sample user experience
            const userExperience = [
                {
                    id: Utils.generateId(),
                    title: 'Frontend Developer',
                    company: 'Web Solutions Inc.',
                    startDate: '2021-06-01',
                    endDate: null,
                    isCurrent: true,
                    description: 'Developing responsive web applications using React, Redux, and modern JavaScript.'
                },
                {
                    id: Utils.generateId(),
                    title: 'Junior Web Developer',
                    company: 'Tech Startup LLC',
                    startDate: '2019-03-15',
                    endDate: '2021-05-30',
                    isCurrent: false,
                    description: 'Built and maintained websites for various clients using HTML, CSS, JavaScript, and PHP.'
                }
            ];
            
            // Sample user domains
            const userDomains = [
                { id: Utils.generateId(), name: 'E-commerce', level: 75 },
                { id: Utils.generateId(), name: 'Healthcare', level: 45 },
                { id: Utils.generateId(), name: 'Fintech', level: 30 }
            ];
            
            // Sample user preferences
            const userPreferences = {
                targetRole: 'Senior Frontend Developer',
                locationPreference: 'Remote',
                workType: 'Full-time',
                salaryExpectation: 110000,
                willingToRelocate: false,
                certifications: false
            };
            
            // Sample user analytics
            const userAnalytics = {
                profileStrength: 65,
                marketCompetitiveness: 78,
                growthPotential: 82,
                suggestions: {
                    profileStrength: [
                        'Add your LinkedIn profile',
                        'Include more details about your work experience',
                        'Add certifications to your profile'
                    ],
                    marketCompetitiveness: [
                        'Learn a popular JavaScript framework like Vue or Angular',
                        'Add more backend technologies to your skills'
                    ],
                    growthPotential: [
                        'Consider pursuing a certification in Cloud technologies',
                        'Explore leadership or management skills'
                    ]
                }
            };
            
            // Save sample data to LocalForage
            await localforage.setItem(CONFIG.storage.userProfileKey, userProfile);
            await localforage.setItem(CONFIG.storage.userSkillsKey, userSkills);
            await localforage.setItem(CONFIG.storage.userExperienceKey, userExperience);
            await localforage.setItem(CONFIG.storage.userDomainsKey, userDomains);
            await localforage.setItem(CONFIG.storage.userPreferencesKey, userPreferences);
            await localforage.setItem(CONFIG.storage.userAnalyticsKey, userAnalytics);
            await localforage.setItem(CONFIG.storage.userJobsKey, []);
            await localforage.setItem(CONFIG.storage.lastUpdateKey, new Date().toISOString());
            
            console.log('Sample data loaded successfully');
            return true;
        } catch (error) {
            console.error('Error loading sample data:', error);
            return false;
        }
    },
    
    /**
     * Get user profile data
     */
    getUserProfile: async function() {
        try {
            return await localforage.getItem(CONFIG.storage.userProfileKey) || {};
        } catch (error) {
            console.error('Error getting user profile:', error);
            return {};
        }
    },
    
    /**
     * Update user profile data
     * @param {Object} profileData - Updated profile data
     */
    updateUserProfile: async function(profileData) {
        try {
            const currentProfile = await this.getUserProfile();
            const updatedProfile = { 
                ...currentProfile, 
                ...profileData,
                lastUpdated: new Date().toISOString()
            };
            
            await localforage.setItem(CONFIG.storage.userProfileKey, updatedProfile);
            return updatedProfile;
        } catch (error) {
            console.error('Error updating user profile:', error);
            return null;
        }
    },
    
    /**
     * Get user skills data
     */
    getUserSkills: async function() {
        try {
            return await localforage.getItem(CONFIG.storage.userSkillsKey) || [];
        } catch (error) {
            console.error('Error getting user skills:', error);
            return [];
        }
    },
    
    /**
     * Add a new skill
     * @param {Object} skillData - Skill data
     */
    addUserSkill: async function(skillData) {
        try {
            const skills = await this.getUserSkills();
            const newSkill = {
                id: Utils.generateId(),
                ...skillData
            };
            
            skills.push(newSkill);
            await localforage.setItem(CONFIG.storage.userSkillsKey, skills);
            return newSkill;
        } catch (error) {
            console.error('Error adding user skill:', error);
            return null;
        }
    },
    
    /**
     * Update a skill
     * @param {string} skillId - Skill ID
     * @param {Object} skillData - Updated skill data
     */
    updateUserSkill: async function(skillId, skillData) {
        try {
            const skills = await this.getUserSkills();
            const skillIndex = skills.findIndex(skill => skill.id === skillId);
            
            if (skillIndex !== -1) {
                skills[skillIndex] = { ...skills[skillIndex], ...skillData };
                await localforage.setItem(CONFIG.storage.userSkillsKey, skills);
                return skills[skillIndex];
            }
            
            return null;
        } catch (error) {
            console.error('Error updating user skill:', error);
            return null;
        }
    },
    
    /**
     * Delete a skill
     * @param {string} skillId - Skill ID
     */
    deleteUserSkill: async function(skillId) {
        try {
            const skills = await this.getUserSkills();
            const updatedSkills = skills.filter(skill => skill.id !== skillId);
            
            await localforage.setItem(CONFIG.storage.userSkillsKey, updatedSkills);
            return true;
        } catch (error) {
            console.error('Error deleting user skill:', error);
            return false;
        }
    },
    
    /**
     * Get user experience data
     */
    getUserExperience: async function() {
        try {
            return await localforage.getItem(CONFIG.storage.userExperienceKey) || [];
        } catch (error) {
            console.error('Error getting user experience:', error);
            return [];
        }
    },
    
    /**
     * Add a new experience entry
     * @param {Object} experienceData - Experience data
     */
    addUserExperience: async function(experienceData) {
        try {
            const experience = await this.getUserExperience();
            const newExperience = {
                id: Utils.generateId(),
                ...experienceData
            };
            
            experience.push(newExperience);
            
            // Sort by date (newest first)
            experience.sort((a, b) => {
                const dateA = a.endDate || new Date().toISOString();
                const dateB = b.endDate || new Date().toISOString();
                return new Date(dateB) - new Date(dateA);
            });
            
            await localforage.setItem(CONFIG.storage.userExperienceKey, experience);
            return newExperience;
        } catch (error) {
            console.error('Error adding user experience:', error);
            return null;
        }
    },
    
    /**
     * Update an experience entry
     * @param {string} experienceId - Experience ID
     * @param {Object} experienceData - Updated experience data
     */
    updateUserExperience: async function(experienceId, experienceData) {
        try {
            const experience = await this.getUserExperience();
            const expIndex = experience.findIndex(exp => exp.id === experienceId);
            
            if (expIndex !== -1) {
                experience[expIndex] = { ...experience[expIndex], ...experienceData };
                
                // Sort by date (newest first)
                experience.sort((a, b) => {
                    const dateA = a.endDate || new Date().toISOString();
                    const dateB = b.endDate || new Date().toISOString();
                    return new Date(dateB) - new Date(dateA);
                });
                
                await localforage.setItem(CONFIG.storage.userExperienceKey, experience);
                return experience[expIndex];
            }
            
            return null;
        } catch (error) {
            console.error('Error updating user experience:', error);
            return null;
        }
    },
    
    /**
     * Delete an experience entry
     * @param {string} experienceId - Experience ID
     */
    deleteUserExperience: async function(experienceId) {
        try {
            const experience = await this.getUserExperience();
            const updatedExperience = experience.filter(exp => exp.id !== experienceId);
            
            await localforage.setItem(CONFIG.storage.userExperienceKey, updatedExperience);
            return true;
        } catch (error) {
            console.error('Error deleting user experience:', error);
            return false;
        }
    },
    
    /**
     * Get user domains data
     */
    getUserDomains: async function() {
        try {
            return await localforage.getItem(CONFIG.storage.userDomainsKey) || [];
        } catch (error) {
            console.error('Error getting user domains:', error);
            return [];
        }
    },
    
    /**
     * Get user preferences
     */
    getUserPreferences: async function() {
        try {
            return await localforage.getItem(CONFIG.storage.userPreferencesKey) || {};
        } catch (error) {
            console.error('Error getting user preferences:', error);
            return {};
        }
    },
    
    /**
     * Update user preferences
     * @param {Object} preferencesData - Updated preferences data
     */
    updateUserPreferences: async function(preferencesData) {
        try {
            const currentPreferences = await this.getUserPreferences();
            const updatedPreferences = { ...currentPreferences, ...preferencesData };
            
            await localforage.setItem(CONFIG.storage.userPreferencesKey, updatedPreferences);
            return updatedPreferences;
        } catch (error) {
            console.error('Error updating user preferences:', error);
            return null;
        }
    },
    
    /**
     * Get user analytics
     */
    getUserAnalytics: async function() {
        try {
            return await localforage.getItem(CONFIG.storage.userAnalyticsKey) || {};
        } catch (error) {
            console.error('Error getting user analytics:', error);
            return {};
        }
    },
    
    /**
     * Get saved jobs
     */
    getSavedJobs: async function() {
        try {
            return await localforage.getItem(CONFIG.storage.userJobsKey) || [];
        } catch (error) {
            console.error('Error getting saved jobs:', error);
            return [];
        }
    },
    
    /**
     * Save a job
     * @param {Object} jobData - Job data
     */
    saveJob: async function(jobData) {
        try {
            const savedJobs = await this.getSavedJobs();
            
            // Check if job is already saved
            const existingJobIndex = savedJobs.findIndex(job => job.id === jobData.id);
            
            if (existingJobIndex !== -1) {
                // Update existing job
                savedJobs[existingJobIndex] = { ...savedJobs[existingJobIndex], ...jobData };
            } else {
                // Add new job
                savedJobs.push(jobData);
            }
            
            await localforage.setItem(CONFIG.storage.userJobsKey, savedJobs);
            return true;
        } catch (error) {
            console.error('Error saving job:', error);
            return false;
        }
    },
    
    /**
     * Remove a saved job
     * @param {string} jobId - Job ID
     */
    removeSavedJob: async function(jobId) {
        try {
            const savedJobs = await this.getSavedJobs();
            const updatedJobs = savedJobs.filter(job => job.id !== jobId);
            
            await localforage.setItem(CONFIG.storage.userJobsKey, updatedJobs);
            return true;
        } catch (error) {
            console.error('Error removing saved job:', error);
            return false;
        }
    },
    
    /**
     * Get sample job data
     * @returns {Array} Array of job objects
     */
    getSampleJobs: function() {
        return [
            {
                id: 'job1',
                title: 'Senior Frontend Developer',
                company: 'TechCorp',
                companyLogo: 'T',
                location: 'Remote',
                salary: '$100,000 - $130,000',
                jobType: 'Full-time',
                experience: '5-8 years',
                matchScore: 92,
                postedDate: '2023-02-15',
                skills: ['JavaScript', 'React', 'TypeScript', 'CSS', 'HTML', 'Redux'],
                description: 'We are looking for a Senior Frontend Developer to join our team and help build our next-generation web applications. You will be responsible for designing and implementing user interfaces, working with backend developers, and mentoring junior developers.',
                requirements: [
                    '5+ years of experience in frontend development',
                    'Deep knowledge of JavaScript, HTML, and CSS',
                    'Experience with React and state management libraries',
                    'Familiarity with TypeScript',
                    'Understanding of responsive design and cross-browser compatibility',
                    'Experience with RESTful APIs and GraphQL'
                ],
                benefits: [
                    'Competitive salary and equity options',
                    'Health, dental, and vision insurance',
                    'Flexible work hours and remote work policy',
                    'Professional development allowance',
                    '401(k) matching',
                    'Unlimited PTO'
                ],
                companyInfo: 'TechCorp is a leading technology company specializing in cloud infrastructure and developer tools. We have a team of over 500 employees globally and are backed by top-tier venture capital firms.'
            },
            {
                id: 'job2',
                title: 'Full Stack Developer',
                company: 'InnovateSoft',
                companyLogo: 'I',
                location: 'San Francisco, CA (Hybrid)',
                salary: '$90,000 - $120,000',
                jobType: 'Full-time',
                experience: '3-5 years',
                matchScore: 85,
                postedDate: '2023-02-18',
                skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'Git'],
                description: 'InnovateSoft is seeking a talented Full Stack Developer to help build and maintain web applications for our clients in various industries. You will be working with both frontend and backend technologies and collaborating with a team of designers and product managers.',
                requirements: [
                    '3+ years of experience in full stack development',
                    'Proficiency in JavaScript and modern frameworks',
                    'Experience with Node.js and Express',
                    'Knowledge of database systems like MongoDB or PostgreSQL',
                    'Understanding of Git and collaborative development workflows',
                    'Good communication skills'
                ],
                benefits: [
                    'Competitive salary',
                    'Comprehensive health benefits',
                    'Hybrid work model with flexible hours',
                    'Learning and development budget',
                    'Regular team events and activities',
                    'Casual work environment'
                ],
                companyInfo: 'InnovateSoft is a software development agency specializing in custom web and mobile applications for startups and enterprises. Founded in 2015, we have delivered over 100 successful projects and have a team of 50+ developers.'
            },
            {
                id: 'job3',
                title: 'Backend Developer',
                company: 'DataFlow Systems',
                companyLogo: 'D',
                location: 'Austin, TX',
                salary: '$85,000 - $110,000',
                jobType: 'Full-time',
                experience: '2-5 years',
                matchScore: 78,
                postedDate: '2023-02-20',
                skills: ['Node.js', 'Express', 'SQL', 'MongoDB', 'AWS', 'Docker'],
                description: 'DataFlow Systems is looking for a Backend Developer to help build and maintain our data processing services. You will work with a team of developers to design and implement APIs, integrate with third-party services, and ensure the scalability and reliability of our backend systems.',
                requirements: [
                    'Experience with Node.js and Express',
                    'Proficiency in SQL and NoSQL databases',
                    'Knowledge of RESTful API design',
                    'Experience with AWS or other cloud platforms',
                    'Familiarity with containerization tools like Docker',
                    'Understanding of security best practices'
                ],
                benefits: [
                    'Competitive compensation package',
                    'Health, dental, and vision insurance',
                    'Retirement plan with company match',
                    'Flexible work arrangements',
                    'Professional development opportunities',
                    'Regular team building events'
                ],
                companyInfo: 'DataFlow Systems specializes in building scalable data processing and analytics solutions for businesses. We help companies turn their data into actionable insights through our proprietary technology platform.'
            },
            {
                id: 'job4',
                title: 'Frontend Developer',
                company: 'WebVision',
                companyLogo: 'W',
                location: 'Remote',
                salary: '$75,000 - $95,000',
                jobType: 'Full-time',
                experience: '2-4 years',
                matchScore: 88,
                postedDate: '2023-02-22',
                skills: ['JavaScript', 'React', 'HTML', 'CSS', 'SCSS', 'Git'],
                description: 'WebVision is seeking a creative Frontend Developer to join our growing team. You will be responsible for implementing visually appealing and responsive user interfaces for our web applications, working closely with designers and backend developers.',
                requirements: [
                    'Strong proficiency in JavaScript, HTML, and CSS',
                    'Experience with React or similar frontend frameworks',
                    'Understanding of responsive design principles',
                    'Knowledge of CSS preprocessors (SCSS, LESS)',
                    'Familiarity with version control systems',
                    'Attention to detail and commitment to quality'
                ],
                benefits: [
                    'Competitive salary',
                    'Healthcare coverage',
                    'Flexible working hours',
                    'Work from anywhere policy',
                    'Continuous learning opportunities',
                    'Modern equipment provided'
                ],
                companyInfo: 'WebVision is a design-focused web development agency that creates custom websites and web applications for clients in various industries. We pride ourselves on delivering high-quality, user-friendly digital experiences.'
            },
            {
                id: 'job5',
                title: 'DevOps Engineer',
                company: 'CloudNative',
                companyLogo: 'C',
                location: 'Boston, MA (Hybrid)',
                salary: '$100,000 - $130,000',
                jobType: 'Full-time',
                experience: '3-6 years',
                matchScore: 65,
                postedDate: '2023-02-25',
                skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux'],
                description: 'CloudNative is looking for a DevOps Engineer to join our infrastructure team. You will be responsible for designing, implementing, and maintaining our cloud infrastructure, automation systems, and CI/CD pipelines. This role requires a balance of technical expertise and strong collaboration skills.',
                requirements: [
                    'Experience with cloud platforms (AWS, Azure, or GCP)',
                    'Knowledge of containerization and orchestration (Docker, Kubernetes)',
                    'Experience with infrastructure as code (Terraform, CloudFormation)',
                    'Understanding of CI/CD principles and tools',
                    'Strong Linux administration skills',
                    'Problem-solving ability and attention to detail'
                ],
                benefits: [
                    'Competitive salary and bonus structure',
                    'Comprehensive benefits package',
                    'Flexible work arrangements',
                    'Professional development budget',
                    'Latest hardware and software',
                    'Casual and collaborative work environment'
                ],
                companyInfo: 'CloudNative specializes in helping organizations adopt and leverage cloud-native technologies. Our team of experts works with clients to modernize their infrastructure, optimize costs, and improve operational efficiency.'
            },
            {
                id: 'job6',
                title: 'JavaScript Developer',
                company: 'AppWorks',
                companyLogo: 'A',
                location: 'Chicago, IL',
                salary: '$80,000 - $100,000',
                jobType: 'Full-time',
                experience: '2-4 years',
                matchScore: 82,
                postedDate: '2023-02-26',
                skills: ['JavaScript', 'React', 'Vue.js', 'Node.js', 'HTML', 'CSS'],
                description: 'AppWorks is seeking a talented JavaScript Developer to join our engineering team. You will work on developing and maintaining web applications for our clients, collaborating with other developers, designers, and project managers to deliver high-quality solutions.',
                requirements: [
                    'Strong proficiency in JavaScript',
                    'Experience with modern JS frameworks like React or Vue.js',
                    'Knowledge of Node.js for backend development',
                    'Understanding of web standards and best practices',
                    'Problem-solving mindset and attention to detail',
                    'Ability to work in a collaborative team environment'
                ],
                benefits: [
                    'Competitive salary',
                    'Health, dental, and vision insurance',
                    'Flexible working hours',
                    '401(k) with company match',
                    'Continuous learning opportunities',
                    'Modern office with amenities'
                ],
                companyInfo: 'AppWorks is a software development company that specializes in creating custom web applications for businesses of all sizes. Our team of experienced developers, designers, and project managers works closely with clients to deliver solutions that meet their specific needs.'
            },
            {
                id: 'job7',
                title: 'Mobile Developer (iOS/Android)',
                company: 'MobileFirst',
                companyLogo: 'M',
                location: 'Remote',
                salary: '$90,000 - $115,000',
                jobType: 'Full-time',
                experience: '3-5 years',
                matchScore: 70,
                postedDate: '2023-02-27',
                skills: ['React Native', 'JavaScript', 'iOS', 'Android', 'API Integration', 'Git'],
                description: 'MobileFirst is looking for a Mobile Developer with experience in React Native to join our team. You will be responsible for developing cross-platform mobile applications, implementing new features, and maintaining existing codebase. This role requires a strong understanding of mobile development principles and best practices.',
                requirements: [
                    'Experience with React Native or similar cross-platform frameworks',
                    'Understanding of iOS and Android platforms',
                    'Proficiency in JavaScript and modern JS concepts',
                    'Experience with RESTful APIs and third-party integrations',
                    'Knowledge of version control systems like Git',
                    'Problem-solving skills and attention to detail'
                ],
                benefits: [
                    'Competitive salary',
                    'Comprehensive benefits package',
                    'Fully remote work environment',
                    'Flexible schedule',
                    'Professional development opportunities',
                    'Latest hardware and software'
                ],
                companyInfo: 'MobileFirst is a mobile app development company that creates innovative and user-friendly applications for startups and established businesses. We specialize in cross-platform development using React Native to deliver cost-effective solutions without compromising on quality.'
            },
            {
                id: 'job8',
                title: 'Data Scientist',
                company: 'Analytix',
                companyLogo: 'A',
                location: 'Seattle, WA',
                salary: '$95,000 - $125,000',
                jobType: 'Full-time',
                experience: '3-6 years',
                matchScore: 60,
                postedDate: '2023-02-28',
                skills: ['Python', 'Machine Learning', 'SQL', 'Data Visualization', 'Statistics', 'TensorFlow'],
                description: 'Analytix is seeking a Data Scientist to join our analytics team. You will work on developing and implementing machine learning models, analyzing large datasets, and providing actionable insights to drive business decisions. This role requires a strong background in statistics, programming, and data analysis.',
                requirements: [
                    'Experience with Python and data analysis libraries',
                    'Knowledge of machine learning algorithms and frameworks',
                    'Proficiency in SQL and database concepts',
                    'Experience with data visualization tools',
                    'Strong statistical and mathematical background',
                    'Excellent communication and presentation skills'
                ],
                benefits: [
                    'Competitive salary and performance bonuses',
                    'Comprehensive health benefits',
                    'Flexible work arrangements',
                    'Professional development budget',
                    '401(k) matching program',
                    'Regular team events and activities'
                ],
                companyInfo: 'Analytix is a data analytics consulting firm that helps businesses leverage their data to make better decisions. Our team of data scientists, analysts, and engineers works with clients across various industries to implement data-driven solutions and strategies.'
            },
            {
                id: 'job9',
                title: 'UI/UX Designer',
                company: 'DesignHub',
                companyLogo: 'D',
                location: 'New York, NY',
                salary: '$85,000 - $110,000',
                jobType: 'Full-time',
                experience: '2-5 years',
                matchScore: 55,
                postedDate: '2023-03-01',
                skills: ['UI Design', 'UX Research', 'Figma', 'Adobe XD', 'Prototyping', 'Wireframing'],
                description: 'DesignHub is looking for a talented UI/UX Designer to join our creative team. You will be responsible for creating visually appealing and user-friendly interfaces for web and mobile applications. This role includes conducting user research, creating wireframes, prototypes, and collaborating with developers to implement designs.',
                requirements: [
                    'Experience with UI/UX design for digital products',
                    'Proficiency in design tools like Figma or Adobe XD',
                    'Understanding of user-centered design principles',
                    'Experience with creating wireframes and prototypes',
                    'Knowledge of responsive design and accessibility standards',
                    'Strong visual design skills and attention to detail'
                ],
                benefits: [
                    'Competitive salary',
                    'Health, dental, and vision insurance',
                    'Flexible working hours',
                    'Professional development opportunities',
                    'Creative and collaborative work environment',
                    'Regular team activities and events'
                ],
                companyInfo: 'DesignHub is a design agency that specializes in creating exceptional digital experiences for clients across various industries. Our team of designers, researchers, and developers works together to deliver user-centered solutions that meet business objectives while delighting users.'
            },
            {
                id: 'job10',
                title: 'QA Engineer',
                company: 'QualityFirst',
                companyLogo: 'Q',
                location: 'Remote',
                salary: '$75,000 - $95,000',
                jobType: 'Full-time',
                experience: '2-4 years',
                matchScore: 68,
                postedDate: '2023-03-02',
                skills: ['Manual Testing', 'Automated Testing', 'Selenium', 'JIRA', 'API Testing', 'Test Plans'],
                description: 'QualityFirst is seeking a QA Engineer to join our quality assurance team. You will be responsible for ensuring the quality of our software products through manual and automated testing. This role involves creating test plans, executing test cases, identifying and reporting bugs, and collaborating with developers to resolve issues.',
                requirements: [
                    'Experience with manual testing methodologies',
                    'Knowledge of automated testing tools like Selenium',
                    'Understanding of API testing',
                    'Experience with bug tracking tools like JIRA',
                    'Attention to detail and analytical thinking',
                    'Good communication and documentation skills'
                ],
                benefits: [
                    'Competitive salary',
                    'Comprehensive benefits package',
                    'Remote work environment',
                    'Flexible working hours',
                    'Professional development opportunities',
                    'Collaborative and supportive team culture'
                ],
                companyInfo: 'QualityFirst is a software testing and quality assurance company that helps businesses deliver high-quality software products. Our team of QA experts provides a range of testing services, including functional testing, performance testing, security testing, and automated testing solutions.'
            },
            {
                id: 'job11',
                title: 'Product Manager',
                company: 'ProductLab',
                companyLogo: 'P',
                location: 'San Francisco, CA',
                salary: '$100,000 - $130,000',
                jobType: 'Full-time',
                experience: '4-7 years',
                matchScore: 62,
                postedDate: '2023-03-03',
                skills: ['Product Strategy', 'Agile', 'User Research', 'Roadmapping', 'Analytics', 'Stakeholder Management'],
                description: 'ProductLab is looking for an experienced Product Manager to join our team. You will be responsible for defining product strategy, prioritizing features, and working with cross-functional teams to deliver successful products. This role requires a balance of business acumen, technical understanding, and user empathy.',
                requirements: [
                    'Experience in product management for software products',
                    'Understanding of Agile development methodologies',
                    'Experience with user research and customer feedback',
                    'Ability to create and maintain product roadmaps',
                    'Data-driven decision making and analytical skills',
                    'Strong communication and leadership abilities'
                ],
                benefits: [
                    'Competitive salary and equity options',
                    'Comprehensive health benefits',
                    'Flexible work arrangements',
                    'Professional development budget',
                    'Regular team events and activities',
                    'Modern office with amenities'
                ],
                companyInfo: 'ProductLab is a product innovation company that helps businesses develop and launch successful digital products. Our team of product managers, designers, and engineers works collaboratively to transform ideas into impactful solutions that meet user needs and business objectives.'
            },
            {
                id: 'job12',
                title: 'Technical Support Specialist',
                company: 'TechHelp',
                companyLogo: 'T',
                location: 'Dallas, TX',
                salary: '$60,000 - $75,000',
                jobType: 'Full-time',
                experience: '1-3 years',
                matchScore: 72,
                postedDate: '2023-03-04',
                skills: ['Technical Troubleshooting', 'Customer Service', 'Help Desk', 'IT Support', 'Documentation', 'Communication'],
                description: 'TechHelp is seeking a Technical Support Specialist to join our customer success team. You will be responsible for providing technical assistance to our customers, troubleshooting issues, and ensuring a positive support experience. This role requires a combination of technical knowledge and strong customer service skills.',
                requirements: [
                    'Experience in technical support or help desk roles',
                    'Strong troubleshooting and problem-solving abilities',
                    'Excellent customer service and communication skills',
                    'Knowledge of IT systems and software applications',
                    'Ability to document solutions and create knowledge base articles',
                    'Patience and empathy when dealing with customer issues'
                ],
                benefits: [
                    'Competitive salary',
                    'Health, dental, and vision insurance',
                    'Flexible working hours',
                    'Professional development opportunities',
                    'Supportive team environment',
                    'Casual dress code'
                ],
                companyInfo: 'TechHelp is a technical support services provider that offers help desk and IT support solutions for businesses of all sizes. Our team of support specialists delivers prompt and effective assistance to end-users, helping them resolve technical issues and maximize their productivity.'
            }
        ];
    },
    
    /**
     * Get sample in-demand skills data
     * @returns {Array} Array of skill objects
     */
    getSampleSkillsData: function() {
        return [
            { name: 'JavaScript', demand: 92, growth: 5 },
            { name: 'React', demand: 88, growth: 12 },
            { name: 'Node.js', demand: 83, growth: 8 },
            { name: 'Python', demand: 85, growth: 15 },
            { name: 'TypeScript', demand: 78, growth: 20 },
            { name: 'AWS', demand: 86, growth: 18 },
            { name: 'Docker', demand: 75, growth: 10 },
            { name: 'SQL', demand: 80, growth: 3 }
        ];
    },
    
    /**
     * Get sample salary data by role
     * @returns {Array} Array of salary objects
     */
    getSampleSalaryData: function() {
        return [
            { role: 'Frontend Developer', salary: 90000 },
            { role: 'Backend Developer', salary: 95000 },
            { role: 'Full Stack Developer', salary: 105000 },
            { role: 'DevOps Engineer', salary: 115000 },
            { role: 'Data Scientist', salary: 120000 },
            { role: 'Mobile Developer', salary: 100000 },
            { role: 'UI/UX Designer', salary: 95000 },
            { role: 'QA Engineer', salary: 85000 }
        ];
    },
    
    /**
     * Get sample skill gap data
     * @returns {Array} Array of skill gap objects
     */
    getSampleSkillGaps: function() {
        return [
            { name: 'TypeScript', demand: 78, userLevel: 0, gap: 78 },
            { name: 'Docker', demand: 75, userLevel: 0, gap: 75 },
            { name: 'AWS', demand: 86, userLevel: 20, gap: 66 },
            { name: 'Python', demand: 85, userLevel: 25, gap: 60 },
            { name: 'GraphQL', demand: 65, userLevel: 10, gap: 55 },
            { name: 'CI/CD', demand: 70, userLevel: 30, gap: 40 }
        ];
    },
    
    /**
     * Get sample learning paths
     * @returns {Array} Array of learning path objects
     */
    getSampleLearningPaths: function() {
        return [
            {
                id: 'path1',
                title: 'Modern Frontend Development',
                description: 'Master modern frontend development with React, TypeScript, and related technologies',
                skills: ['React', 'TypeScript', 'Redux', 'Next.js', 'Testing'],
                duration: '3 months',
                difficulty: 'Intermediate',
                relevance: 92
            },
            {
                id: 'path2',
                title: 'Full Stack JavaScript',
                description: 'Become a full stack developer with JavaScript, Node.js, and modern frameworks',
                skills: ['JavaScript', 'Node.js', 'Express', 'MongoDB', 'React'],
                duration: '4 months',
                difficulty: 'Intermediate',
                relevance: 88
            },
            {
                id: 'path3',
                title: 'Cloud and DevOps',
                description: 'Learn cloud services, containerization, and CI/CD pipelines',
                skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
                duration: '3 months',
                difficulty: 'Advanced',
                relevance: 75
            },
            {
                id: 'path4',
                title: 'Data Science Fundamentals',
                description: 'Build a foundation in data science, machine learning, and analytics',
                skills: ['Python', 'Data Analysis', 'Machine Learning', 'SQL', 'Visualization'],
                duration: '5 months',
                difficulty: 'Intermediate',
                relevance: 65
            }
        ];
    },
    
    /**
     * Get sample roadmap data
     * @returns {Object} Roadmap data object
     */
    getSampleRoadmap: function() {
        return {
            careerPath: [
                {
                    step: 1,
                    title: 'Frontend Developer',
                    description: 'Build and improve your frontend development skills',
                    current: true
                },
                {
                    step: 2,
                    title: 'Senior Frontend Developer',
                    description: 'Gain leadership experience and advanced frontend knowledge',
                    current: false
                },
                {
                    step: 3,
                    title: 'Lead Developer',
                    description: 'Lead teams and architect complex frontend solutions',
                    current: false
                },
                {
                    step: 4,
                    title: 'Frontend Architect',
                    description: 'Design scalable frontend architectures and establish best practices',
                    current: false
                }
            ],
            timeline: [
                {
                    date: 'March - April 2023',
                    title: 'Enhance JavaScript Skills',
                    description: 'Focus on advanced JavaScript concepts, TypeScript, and modern ES features',
                    skills: ['JavaScript', 'TypeScript', 'ES6+']
                },
                {
                    date: 'May - July 2023',
                    title: 'Advanced React Development',
                    description: 'Master React hooks, context API, and performance optimization',
                    skills: ['React', 'Redux', 'Performance']
                },
                {
                    date: 'August - October 2023',
                    title: 'Frontend Testing',
                    description: 'Learn and implement comprehensive testing strategies',
                    skills: ['Jest', 'React Testing Library', 'Cypress']
                },
                {
                    date: 'November 2023 - January 2024',
                    title: 'Next.js and SSR',
                    description: 'Build server-side rendered applications with Next.js',
                    skills: ['Next.js', 'SSR', 'Static Generation']
                }
            ],
            experienceSalary: [
                { years: 0, salary: 65000 },
                { years: 1, salary: 72000 },
                { years: 2, salary: 80000 },
                { years: 3, salary: 90000 },
                { years: 4, salary: 100000 },
                { years: 5, salary: 110000 },
                { years: 7, salary: 130000 },
                { years: 10, salary: 160000 }
            ]
        };
    }
};