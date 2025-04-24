// File: js/data/job_data.js

/**
 * Job listings data for TechCareerMatch
 * Contains sample job listings for different roles and experience levels
 */

const JobListingsData = {
  /**
   * Get all available job listings
   * @returns {Array} All job listings
   */
  getAllJobs: function() {
    return [
      // Frontend Developer roles
      {
        id: 'job_fe_1',
        title: 'Junior Frontend Developer',
        company: 'WebTech Solutions',
        companyLogo: 'W',
        location: 'Remote',
        salary: '$60,000 - $80,000',
        jobType: 'Full-time',
        experience: '0-2 years',
        matchScore: 88,
        postedDate: '2024-09-28',
        skills: ['JavaScript', 'HTML', 'CSS', 'React', 'Responsive Design', 'Git'],
        description: 'Join our dynamic team as a Junior Frontend Developer to build responsive web applications. You will work closely with senior developers to implement user interfaces according to design specifications and learn best practices in modern web development.',
        requirements: [
          '0-2 years of experience in frontend development',
          'Strong fundamentals in HTML, CSS, and JavaScript',
          'Knowledge of React or similar framework',
          'Understanding of responsive design principles',
          'Familiarity with version control systems like Git',
          'Ability to work in an agile environment'
        ],
        benefits: [
          'Competitive starting salary',
          'Health and dental insurance',
          'Flexible work schedule',
          'Mentorship program',
          'Educational stipend',
          'Remote work options'
        ],
        companyInfo: 'WebTech Solutions is a fast-growing web development agency that specializes in creating modern websites and applications for businesses of all sizes. Founded in 2018, we have a team of 50+ developers and have delivered over 200 projects.'
      },
      // Add more job listings here...\

      {
        id: 'job_fe_2',
        title: 'Frontend Developer',
        company: 'Digital Innovations',
        companyLogo: 'D',
        location: 'Hybrid (New York, NY)',
        salary: '$85,000 - $105,000',
        jobType: 'Full-time',
        experience: '2-3 years',
        matchScore: 90,
        postedDate: '2024-10-02',
        skills: ['JavaScript', 'React', 'TypeScript', 'SASS/SCSS', 'Jest', 'Webpack'],
        description: 'Digital Innovations is seeking a talented Frontend Developer to create engaging user interfaces for our client projects. You will be responsible for implementing responsive designs, integrating with APIs, and ensuring cross-browser compatibility.',
        requirements: [
          '2-3 years of professional experience in frontend development',
          'Proficiency in React and modern JavaScript (ES6+)',
          'Experience with TypeScript and CSS preprocessors',
          'Understanding of frontend testing methodologies',
          'Knowledge of build tools such as Webpack or Vite',
          'Good communication skills and attention to detail'
        ],
        benefits: [
          'Competitive compensation package',
          'Comprehensive health benefits',
          'Hybrid work model (3 days remote)',
          'Professional development budget',
          'Company-sponsored team events',
          '401(k) with employer match'
        ],
        companyInfo: 'Digital Innovations creates digital products and experiences for Fortune 500 companies and emerging brands. Our team of 120 designers and developers specializes in creating beautiful, user-centric digital solutions that drive business results.'
      },
      {
        id: 'job_fe_3',
        title: 'Mid-Level Frontend Developer',
        company: 'Nexus Interactive',
        companyLogo: 'N',
        location: 'Remote (US only)',
        salary: '$90,000 - $110,000',
        jobType: 'Full-time',
        experience: '3-5 years',
        matchScore: 85,
        postedDate: '2024-09-25',
        skills: ['JavaScript', 'React', 'Redux', 'TypeScript', 'Next.js', 'GraphQL', 'CSS-in-JS'],
        description: 'Nexus Interactive is looking for a Mid-Level Frontend Developer to join our product team. You will build complex user interfaces for our SaaS platform, collaborate with designers and backend engineers, and help shape our frontend architecture.',
        requirements: [
          '3-5 years of frontend development experience',
          'Strong proficiency with React and state management',
          'Experience with TypeScript and static typing',
          'Knowledge of Next.js or similar React frameworks',
          'Understanding of GraphQL or REST API integration',
          'Experience with modern CSS approaches and responsive design'
        ],
        benefits: [
          'Competitive salary based on experience',
          'Full medical, dental, and vision coverage',
          'Unlimited PTO policy',
          'Home office stipend',
          'Monthly wellness allowance',
          'Stock options'
        ],
        companyInfo: 'Nexus Interactive builds B2B SaaS products that help businesses streamline their operations. With over 100,000 users worldwide, our platform is known for its intuitive interface and powerful capabilities. We operate with a fully distributed team of 80+ professionals across the US and Europe.'
      },
      {
        id: 'job_fe_4',
        title: 'Senior Frontend Developer',
        company: 'TechForge',
        companyLogo: 'T',
        location: 'Remote',
        salary: '$120,000 - $150,000',
        jobType: 'Full-time',
        experience: '5-7 years',
        matchScore: 93,
        postedDate: '2024-10-05',
        skills: ['JavaScript', 'React', 'TypeScript', 'Redux', 'Performance Optimization', 'Testing', 'Design Systems'],
        description: 'TechForge is seeking a Senior Frontend Developer to lead feature development for our flagship product. You will architect complex frontend solutions, establish best practices, mentor junior developers, and collaborate with product managers to define and implement new features.',
        requirements: [
          '5-7 years of professional frontend development experience',
          'Expert knowledge of React ecosystem and advanced patterns',
          'Strong TypeScript skills and type system understanding',
          'Experience with state management approaches (Redux, Context, etc.)',
          'Proficiency in frontend performance optimization',
          'Experience with testing frameworks (Jest, React Testing Library)',
          'Ability to build and maintain design systems'
        ],
        benefits: [
          'Top-tier salary with performance bonuses',
          'Comprehensive health and life insurance',
          'Flexible work arrangements',
          'Professional development budget ($5,000/year)',
          'Home office allowance',
          'Stock options',
          '401(k) with 4% match'
        ],
        companyInfo: 'TechForge is a leading product development company specializing in enterprise software solutions. With offices in San Francisco, New York, and London, we serve clients across various industries including finance, healthcare, and retail. Our team of 200+ professionals is dedicated to creating innovative technology solutions.'
      },
      {
        id: 'job_fe_5',
        title: 'Lead Frontend Developer',
        company: 'Elevate Digital',
        companyLogo: 'E',
        location: 'Hybrid (Austin, TX)',
        salary: '$130,000 - $160,000',
        jobType: 'Full-time',
        experience: '7-10 years',
        matchScore: 89,
        postedDate: '2024-09-30',
        skills: ['JavaScript', 'React', 'TypeScript', 'Architecture Design', 'Team Leadership', 'Performance Optimization', 'CI/CD'],
        description: 'Elevate Digital is looking for a Lead Frontend Developer to drive our frontend development efforts. You will lead a team of developers, make architectural decisions, establish coding standards, and ensure delivery of high-quality, performant web applications.',
        requirements: [
          '7-10 years of frontend development experience',
          'Proven track record leading development teams',
          'Expert knowledge of React and modern JavaScript',
          'Experience with frontend architecture design and planning',
          'Strong understanding of performance optimization techniques',
          'Experience with CI/CD pipelines and deployment strategies',
          'Excellent communication and leadership skills'
        ],
        benefits: [
          'Highly competitive salary',
          'Comprehensive benefits package',
          'Leadership development program',
          '10% annual bonus',
          'Flexible work arrangements',
          'Generous vacation policy',
          '401(k) with employer match'
        ],
        companyInfo: 'Elevate Digital is a technology consultancy that helps businesses transform their digital presence. Our team of 150+ specialists provides services in web development, digital marketing, and IT strategy. Founded in 2010, we have delivered over 500 successful projects for clients ranging from startups to Fortune 100 companies.'
      },
      {
        id: 'job_fe_6',
        title: 'Principal Frontend Developer',
        company: 'Horizon Technologies',
        companyLogo: 'H',
        location: 'Remote',
        salary: '$150,000 - $180,000',
        jobType: 'Full-time',
        experience: '10+ years',
        matchScore: 87,
        postedDate: '2024-10-01',
        skills: ['JavaScript', 'React', 'TypeScript', 'System Architecture', 'Technical Leadership', 'Mentorship', 'Performance'],
        description: 'Horizon Technologies is seeking a Principal Frontend Developer to serve as a technical leader for our engineering organization. You will define frontend architecture, establish technical standards, mentor senior developers, and drive technical initiatives across multiple products.',
        requirements: [
          '10+ years of frontend development experience',
          'Deep understanding of frontend architecture principles',
          'Expert knowledge of React ecosystem and JavaScript',
          'Experience leading cross-functional technical initiatives',
          'Track record of mentoring and growing engineering teams',
          'Strong understanding of web performance and optimization',
          'Excellent communication and strategic thinking skills'
        ],
        benefits: [
          'Industry-leading compensation package',
          'Premium health, dental, and vision coverage',
          'Profit-sharing plan',
          'Unlimited vacation policy',
          'Home office and equipment allowance',
          'Professional development opportunities',
          'Executive mentorship program'
        ],
        companyInfo: 'Horizon Technologies is a leader in enterprise software solutions, serving clients in financial services, healthcare, and transportation industries. Founded in 2008, we have grown to 300+ employees across the United States, Europe, and Asia. Our products are used by over 1 million professionals worldwide.'
      },
      {
        id: 'job_fe_7',
        title: 'Frontend Architect',
        company: 'Quantum Solutions',
        companyLogo: 'Q',
        location: 'Remote',
        salary: '$160,000 - $200,000',
        jobType: 'Full-time',
        experience: '12+ years',
        matchScore: 91,
        postedDate: '2024-09-20',
        skills: ['JavaScript', 'React', 'TypeScript', 'System Design', 'Micro-frontends', 'Enterprise Architecture', 'Performance'],
        description: 'Quantum Solutions is looking for a Frontend Architect to define the technical vision for our frontend systems. You will design scalable frontend architectures, set technology standards, evaluate new technologies, and ensure our systems can support growing business needs.',
        requirements: [
          '12+ years of experience in frontend development',
          'Extensive experience designing large-scale frontend architectures',
          'Deep expertise in React, TypeScript, and modern JavaScript',
          'Experience with micro-frontend architecture and module federation',
          'Strong understanding of build systems and deployment strategies',
          'Experience with high-traffic, high-performance applications',
          'Excellent communication and leadership skills'
        ],
        benefits: [
          'Top-tier compensation package',
          'Executive-level benefits',
          'Stock options and equity grants',
          'Unlimited PTO',
          'Annual technology conference allowance',
          'Premium health and life insurance',
          'Retirement plan with generous company match'
        ],
        companyInfo: 'Quantum Solutions is a global technology consultancy specializing in digital transformation for enterprise clients. With offices in 12 countries and over 5,000 employees worldwide, we help businesses leverage cutting-edge technology to solve complex business challenges. Our clients include Fortune 100 companies across finance, healthcare, and manufacturing sectors.'
      },
      {
        id: 'job_be_1',
        title: 'Junior Backend Developer',
        company: 'ServerStack',
        companyLogo: 'S',
        location: 'Remote',
        salary: '$65,000 - $85,000',
        jobType: 'Full-time',
        experience: '0-2 years',
        matchScore: 86,
        postedDate: '2024-10-03',
        skills: ['Node.js', 'Express', 'JavaScript', 'SQL', 'REST APIs', 'Git'],
        description: 'ServerStack is seeking a Junior Backend Developer to join our engineering team. You will develop RESTful APIs, integrate with databases, and contribute to server-side application logic. This is an excellent opportunity for a developer early in their career to gain experience with modern backend technologies.',
        requirements: [
          '0-2 years of experience in backend development',
          'Knowledge of Node.js and Express or similar frameworks',
          'Basic understanding of databases and SQL',
          'Familiarity with RESTful API concepts',
          'Understanding of version control systems',
          'Good problem-solving skills and willingness to learn'
        ],
        benefits: [
          'Competitive salary for early-career developers',
          'Health and dental insurance',
          'Flexible working hours',
          'Learning and development budget',
          'Mentorship from senior engineers',
          'Remote work options'
        ],
        companyInfo: 'ServerStack is a cloud infrastructure company that helps businesses build and scale their online services. Founded in 2017, we have a team of 60+ engineers and support over 500 clients ranging from startups to medium-sized businesses.'
      },
      {
        id: 'job_be_2',
        title: 'Backend Developer',
        company: 'DataFlow Systems',
        companyLogo: 'D',
        location: 'Hybrid (Chicago, IL)',
        salary: '$90,000 - $110,000',
        jobType: 'Full-time',
        experience: '2-3 years',
        matchScore: 92,
        postedDate: '2024-09-29',
        skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'API Design', 'Authentication'],
        description: 'DataFlow Systems is looking for a Backend Developer to build scalable and maintainable APIs and services. You will design and implement backend systems, integrate with databases, and collaborate with frontend developers to ensure seamless functionality across our applications.',
        requirements: [
          '2-3 years of professional backend development experience',
          'Strong experience with Node.js and backend frameworks',
          'Knowledge of both SQL and NoSQL databases',
          'Experience with RESTful API design and implementation',
          'Familiarity with Docker and containerization',
          'Understanding of authentication and security best practices',
          'Good communication and teamwork skills'
        ],
        benefits: [
          'Competitive salary',
          'Comprehensive health benefits',
          'Hybrid work model (2 days in office)',
          'Professional growth opportunities',
          'Training and conference budget',
          '401(k) with company match',
          'Casual work environment'
        ],
        companyInfo: 'DataFlow Systems specializes in building data processing and analytics platforms for businesses. Our team of 80 engineers and data scientists helps companies transform raw data into actionable insights. Founded in 2015, we serve clients in finance, healthcare, and e-commerce sectors.'
      },
      {
        id: 'job_be_3',
        title: 'Mid-Level Backend Developer',
        company: 'CloudNative',
        companyLogo: 'C',
        location: 'Remote',
        salary: '$100,000 - $125,000',
        jobType: 'Full-time',
        experience: '3-5 years',
        matchScore: 89,
        postedDate: '2024-10-04',
        skills: ['Node.js', 'Python', 'Go', 'Kubernetes', 'AWS', 'Microservices', 'Event-driven Architecture'],
        description: 'CloudNative is seeking a Mid-Level Backend Developer to help build our cloud-native applications. You will design and implement microservices, work with event-driven architectures, and deploy services to Kubernetes clusters. This role offers the opportunity to work with cutting-edge technologies in a fast-paced environment.',
        requirements: [
          '3-5 years of backend development experience',
          'Proficiency in at least one of: Node.js, Python, or Go',
          'Experience with microservice architecture',
          'Knowledge of AWS or other cloud platforms',
          'Familiarity with Kubernetes and container orchestration',
          'Understanding of event-driven architecture patterns',
          'Experience with CI/CD pipelines'
        ],
        benefits: [
          'Competitive salary package',
          'Comprehensive health coverage',
          'Unlimited PTO policy',
          'Home office allowance',
          'Professional development budget',
          'Monthly wellness stipend',
          'Regular virtual team events'
        ],
        companyInfo: 'CloudNative is a cloud engineering firm that helps companies modernize their infrastructure and adopt cloud-native technologies. With a team of 120+ cloud specialists, we helped over 200 businesses successfully migrate to and thrive in the cloud. Founded in 2018, we are a remote-first company with staff across North America and Europe.'
      },
      {
        id: 'job_be_4',
        title: 'Senior Backend Developer',
        company: 'ScaleTech',
        companyLogo: 'S',
        location: 'Remote',
        salary: '$130,000 - $160,000',
        jobType: 'Full-time',
        experience: '5-7 years',
        matchScore: 94,
        postedDate: '2024-09-26',
        skills: ['Node.js', 'TypeScript', 'AWS', 'Microservices', 'Database Design', 'Serverless', 'System Design'],
        description: 'ScaleTech is looking for a Senior Backend Developer to design and implement highly scalable services. You will architect complex backend systems, optimize performance, mentor junior developers, and collaborate with the product team to create innovative solutions for our enterprise clients.',
        requirements: [
          '5-7 years of backend development experience',
          'Expert knowledge of Node.js and TypeScript',
          'Strong experience with AWS services',
          'Experience designing and building microservices',
          'Advanced database design and optimization skills',
          'Experience with serverless architectures',
          'Strong system design and architecture skills'
        ],
        benefits: [
          'Highly competitive salary',
          'Comprehensive benefits package',
          'Flexible work arrangements',
          'Professional development budget',
          'Stock options',
          '401(k) with employer match',
          'Annual wellness stipend'
        ],
        companyInfo: 'ScaleTech builds scalable backend solutions for enterprise clients. Our platform handles billions of API requests monthly for companies in e-commerce, finance, and media industries. Founded in 2016, we have grown to 150+ employees with offices in San Francisco, New York, and London.'
      },
      {
        id: 'job_be_5',
        title: 'Lead Backend Developer',
        company: 'Infiniti Systems',
        companyLogo: 'I',
        location: 'Hybrid (Seattle, WA)',
        salary: '$140,000 - $170,000',
        jobType: 'Full-time',
        experience: '7-10 years',
        matchScore: 88,
        postedDate: '2024-10-01',
        skills: ['Node.js', 'Python', 'AWS', 'Architecture Design', 'Team Leadership', 'Database Design', 'Security'],
        description: 'Infiniti Systems is seeking a Lead Backend Developer to oversee our backend engineering team. You will lead architecture decisions, establish development standards, mentor team members, and ensure the reliability and scalability of our backend systems.',
        requirements: [
          '7-10 years of backend development experience',
          'Experience leading engineering teams',
          'Expert knowledge of Node.js, Python, or similar languages',
          'Strong AWS or cloud platform experience',
          'Experience with distributed systems architecture',
          'Advanced database knowledge (SQL and NoSQL)',
          'Strong understanding of security best practices'
        ],
        benefits: [
          'Top-tier compensation package',
          'Premium health, dental, and vision coverage',
          'Flexible hybrid work arrangement',
          'Leadership development opportunities',
          'Annual performance bonus',
          'Stock options',
          'Generous vacation policy'
        ],
        companyInfo: 'Infiniti Systems provides enterprise-grade software solutions for businesses in healthcare, finance, and logistics. Our platform processes over $10 billion in transactions annually. Founded in 2012, we have grown to 300+ employees across offices in Seattle, Boston, and Singapore.'
      },
      {
        id: 'job_be_6',
        title: 'Principal Backend Engineer',
        company: 'OmniTech',
        companyLogo: 'O',
        location: 'Remote',
        salary: '$160,000 - $190,000',
        jobType: 'Full-time',
        experience: '10+ years',
        matchScore: 91,
        postedDate: '2024-09-22',
        skills: ['Node.js', 'Go', 'System Architecture', 'Distributed Systems', 'High Availability', 'Scalability', 'Mentorship'],
        description: 'OmniTech is looking for a Principal Backend Engineer to help shape our technical direction. You will design complex distributed systems, set architecture standards, lead technical initiatives across multiple teams, and serve as a technical advisor to executive leadership.',
        requirements: [
          '10+ years of backend development experience',
          'Expert knowledge of backend technologies and languages',
          'Extensive experience designing distributed systems',
          'Experience with high-traffic, high-availability systems',
          'Track record of successful technical leadership',
          'Strong mentoring and communication skills',
          'Experience working with executive stakeholders'
        ],
        benefits: [
          'Industry-leading compensation',
          'Executive-level benefits package',
          'Stock options and equity grants',
          'Discretionary time off policy',
          'Professional development fund',
          'Home office stipend',
          'Annual executive retreat'
        ],
        companyInfo: 'OmniTech is a leader in enterprise software solutions, serving Fortune 500 clients worldwide. Our platforms process over 5 million transactions daily across finance, healthcare, and retail sectors. Founded in 2010, we have grown to 500+ employees with headquarters in San Francisco and offices in six countries.'
      },
      {
        id: 'job_be_7',
        title: 'Backend Architect',
        company: 'GlobalScale Technologies',
        companyLogo: 'G',
        location: 'Remote',
        salary: '$170,000 - $210,000',
        jobType: 'Full-time',
        experience: '12+ years',
        matchScore: 87,
        postedDate: '2024-09-18',
        skills: ['System Design', 'Distributed Systems', 'AWS', 'Microservices', 'Database Architecture', 'Performance Optimization', 'Security'],
        description: 'GlobalScale Technologies is seeking a Backend Architect to define and implement our technical vision. You will design large-scale distributed systems, establish architecture patterns, guide technology selection, and ensure our platform can support global scale and enterprise requirements.',
        requirements: [
          '12+ years of software engineering experience',
          'Extensive experience as a technical architect',
          'Deep expertise in designing distributed systems',
          'Experience building globally scalable platforms',
          'Strong knowledge of cloud architecture (preferably AWS)',
          'Expert-level understanding of database technologies and patterns',
          'Experience with high-volume, mission-critical systems'
        ],
        benefits: [
          'Top-of-market compensation package',
          'Comprehensive executive benefits',
          'Significant equity compensation',
          'Unlimited vacation policy',
          'Annual technology conference budget',
          'Executive coaching and development',
          'Global relocation opportunities'
        ],
        companyInfo: 'GlobalScale Technologies builds infrastructure and platforms that power the digital economy. Our solutions serve billions of users across e-commerce, fintech, and media verticals. With 1,200+ employees across 15 countries, we are a truly global technology leader dedicated to building the next generation of internet infrastructure.'
      },
      {
        id: 'job_ux_1',
        title: 'Junior UI/UX Designer',
        company: 'DesignFirst',
        companyLogo: 'D',
        location: 'Remote',
        salary: '$55,000 - $75,000',
        jobType: 'Full-time',
        experience: '0-2 years',
        matchScore: 89,
        postedDate: '2024-10-01',
        skills: ['UI Design', 'Figma', 'Adobe XD', 'Wireframing', 'Prototyping', 'Visual Design', 'Design Systems'],
        description: 'DesignFirst is seeking a Junior UI/UX Designer to join our creative team. You will create user interfaces for web and mobile applications, collaborate with developers to implement designs, and contribute to our internal design system. This is a great opportunity to grow your design skills in a supportive environment.',
        requirements: [
          '0-2 years of experience in UI/UX design',
          'Portfolio demonstrating strong visual design skills',
          'Proficiency with design tools like Figma or Adobe XD',
          'Basic understanding of user-centered design principles',
          'Knowledge of wireframing and prototyping',
          'Attention to detail and ability to follow design guidelines',
          'Basic understanding of HTML/CSS (bonus)'
        ],
        benefits: [
          'Competitive starting salary',
          'Health and dental coverage',
          'Flexible working hours',
          'Remote work options',
          'Mentorship program',
          'Design conference allowance',
          'Creative workspace stipend'
        ],
        companyInfo: 'DesignFirst is a digital design agency focused on creating beautiful, user-centric experiences for startups and established brands. Our team of 35 designers and developers works with clients in technology, education, and e-commerce sectors. Founded in 2019, we believe in putting design at the forefront of every project.'
      },
      {
        id: 'job_ux_2',
        title: 'UI/UX Designer',
        company: 'Creative Solutions',
        companyLogo: 'C',
        location: 'Hybrid (Portland, OR)',
        salary: '$75,000 - $95,000',
        jobType: 'Full-time',
        experience: '2-3 years',
        matchScore: 85,
        postedDate: '2024-09-27',
        skills: ['User Research', 'UI Design', 'Figma', 'Design Systems', 'Information Architecture', 'Prototyping', 'Usability Testing'],
        description: 'Creative Solutions is looking for a UI/UX Designer to create engaging digital experiences for our clients. You will conduct user research, develop wireframes and prototypes, create visual designs, and collaborate with developers to ensure design integrity throughout implementation.',
        requirements: [
          '2-3 years of professional UI/UX design experience',
          'Strong portfolio showcasing end-to-end design process',
          'Experience with user research and usability testing',
          'Proficiency in Figma and prototyping tools',
          'Knowledge of design systems and component libraries',
          'Understanding of information architecture principles',
          'Good communication and presentation skills'
        ],
        benefits: [
          'Competitive salary',
          'Comprehensive health benefits',
          'Hybrid work model (2 days in office)',
          'Creative development budget',
          'Design conference attendance',
          '401(k) with matching',
          'Collaborative studio environment'
        ],
        companyInfo: 'Creative Solutions is a full-service digital agency specializing in brand strategy, web design, and user experience. Our 60-person team works with clients ranging from startups to Fortune 500 companies. Founded in 2015, we believe in creating meaningful digital experiences that resonate with users and drive business results.'
      },
      {
        id: 'job_ux_3',
        title: 'Mid-Level UX/UI Designer',
        company: 'UserCentric',
        companyLogo: 'U',
        location: 'Remote',
        salary: '$90,000 - $115,000',
        jobType: 'Full-time',
        experience: '3-5 years',
        matchScore: 92,
        postedDate: '2024-10-02',
        skills: ['UX Research', 'UI Design', 'User Testing', 'Figma', 'Interaction Design', 'Design Systems', 'Accessibility'],
        description: 'UserCentric is seeking a Mid-Level UX/UI Designer to create exceptional user experiences for our digital products. You will lead user research efforts, create wireframes and prototypes, design intuitive interfaces, and collaborate with product and engineering teams to deliver user-centered solutions.',
        requirements: [
          '3-5 years of experience in UX/UI design',
          'Strong portfolio demonstrating end-to-end design process',
          'Experience conducting user research and usability testing',
          'Proficiency in Figma and prototyping tools',
          'Experience designing and maintaining design systems',
          'Knowledge of accessibility standards and best practices',
          'Ability to communicate design decisions effectively'
        ],
        benefits: [
          'Competitive salary package',
          'Comprehensive health coverage',
          'Flexible remote work policy',
          'Professional development stipend',
          'Design conference budget',
          'Home office allowance',
          'Unlimited PTO'
        ],
        companyInfo: 'UserCentric designs digital products that put users first. Our team of 45 designers, researchers, and strategists works with companies to create intuitive, accessible, and delightful user experiences. Founded in 2017, we specialize in fintech, healthcare, and e-commerce sectors.'
      },
      {
        id: 'job_ux_4',
        title: 'Senior UX/UI Designer',
        company: 'ExperienceFirst',
        companyLogo: 'E',
        location: 'Remote',
        salary: '$110,000 - $140,000',
        jobType: 'Full-time',
        experience: '5-7 years',
        matchScore: 88,
        postedDate: '2024-09-29',
        skills: ['UX Strategy', 'UI Design', 'User Research', 'Design Systems', 'Design Leadership', 'Figma', 'Cross-functional Collaboration'],
        description: 'ExperienceFirst is looking for a Senior UX/UI Designer to shape our product experience. You will lead the design process from concept to implementation, mentor junior designers, establish UX strategy, and work closely with product managers and engineers to create exceptional digital experiences.',
        requirements: [
          '5-7 years of experience in UX/UI design',
          'Impressive portfolio showing complex design problems',
          'Experience leading design projects end-to-end',
          'Strong user research and testing experience',
          'Experience creating and evolving design systems',
          'Ability to mentor junior designers',
          'Excellent communication and stakeholder management skills'
        ],
        benefits: [
          'Highly competitive salary',
          'Premium health and wellness benefits',
          'Flexible work arrangements',
          'Professional development fund',
          'Annual design conference allowance',
          'Stock options',
          '401(k) with employer match'
        ],
        companyInfo: 'ExperienceFirst creates digital products and experiences that prioritize the user at every step. Our team of 80 designers, researchers, and strategists collaborates with Fortune 500 companies and high-growth startups to deliver intuitive, accessible, and engaging solutions. Founded in 2015, we have offices in New York, San Francisco, and London.'
      },
      {
        id: 'job_ux_5',
        title: 'Lead UX/UI Designer',
        company: 'DesignInnovate',
        companyLogo: 'D',
        location: 'Hybrid (Los Angeles, CA)',
        salary: '$130,000 - $160,000',
        jobType: 'Full-time',
        experience: '7-10 years',
        matchScore: 91,
        postedDate: '2024-09-25',
        skills: ['Design Leadership', 'Design Strategy', 'Design Systems', 'User Research', 'Team Management', 'Stakeholder Communication', 'Product Design'],
        description: 'DesignInnovate is seeking a Lead UX/UI Designer to direct our design department. You will manage a team of designers, establish design processes and standards, lead client presentations, and ensure all our products maintain the highest level of design quality and user experience.',
        requirements: [
          '7-10 years of UX/UI design experience',
          'Experience leading design teams',
          'Strong portfolio demonstrating strategic design thinking',
          'Experience building and scaling design systems',
          'Proven track record of successful product launches',
          'Strong stakeholder management and communication skills',
          'Ability to balance business goals with user needs'
        ],
        benefits: [
          'Industry-leading compensation',
          'Comprehensive benefits package',
          'Hybrid work flexibility',
          'Leadership development opportunities',
          'Annual executive design retreats',
          'Stock options and equity packages',
          'Generous paid time off policy'
        ],
        companyInfo: 'DesignInnovate is a premier design agency working with global brands to create innovative digital experiences. Our team of 100+ creatives serves clients in technology, luxury retail, and entertainment industries. Founded in 2013, we have won numerous awards for our groundbreaking designs and user experiences.'
      },
      {
        id: 'job_ux_6',
        title: 'Principal UX/UI Designer',
        company: 'ExperienTech',
        companyLogo: 'E',
        location: 'Remote',
        salary: '$150,000 - $180,000',
        jobType: 'Full-time',
        experience: '10+ years',
        matchScore: 86,
        postedDate: '2024-10-04',
        skills: ['UX Strategy', 'Design Leadership', 'Product Design', 'Team Direction', 'Executive Communication', 'Design Operations', 'Research Direction'],
        description: 'ExperienTech is looking for a Principal UX/UI Designer to guide our design strategy across multiple product lines. You will set the vision for our user experience, establish design governance, mentor senior designers, and work with executive leadership to align design with business strategy.',
        requirements: [
          '10+ years of UX/UI design experience',
          'Experience in leadership roles within design organizations',
          'Outstanding portfolio demonstrating strategic impact',
          'Experience establishing design operations and governance',
          'Strong understanding of business objectives and metrics',
          'Ability to influence executive stakeholders',
          'Experience leading design in complex organizations'
        ],
        benefits: [
          'Top-tier compensation package',
          'Executive-level benefits',
          'Unlimited PTO policy',
          'Equity and profit-sharing opportunities',
          'Executive coaching program',
          'Conference speaking opportunities',
          'Home office technology allowance'
        ],
        companyInfo: 'ExperienTech creates enterprise software solutions that combine powerful functionality with intuitive user experiences. Our products serve over 2 million users across finance, healthcare, and manufacturing industries. Founded in 2011, we have grown to 350+ employees with headquarters in Boston and offices in five countries.'
      },
      {
        id: 'job_ux_7',
        title: 'UX/UI Design Director',
        company: 'GlobalUser',
        companyLogo: 'G',
        location: 'Hybrid (New York, NY)',
        salary: '$160,000 - $200,000',
        jobType: 'Full-time',
        experience: '12+ years',
        matchScore: 90,
        postedDate: '2024-09-18',
        skills: ['Design Leadership', 'Strategy', 'Team Building', 'Executive Communication', 'Cross-functional Leadership', 'Design Operations', 'Global Design Systems'],
        description: 'GlobalUser is seeking a UX/UI Design Director to lead our global design organization. You will oversee multiple design teams, set the strategic direction for user experience across all products, establish design operations, build a design-driven culture, and represent design at the executive level.',
        requirements: [
          '12+ years of experience in UX/UI design',
          'Minimum 5 years in design leadership roles',
          'Experience leading large design organizations',
          'Track record of building design teams and culture',
          'Experience working with C-level executives',
          'International or global design experience preferred',
          'Strong portfolio showing strategic business impact'
        ],
        benefits: [
          'Executive compensation package',
          'Comprehensive benefits including executive health program',
          'Significant equity compensation',
          'Executive retreat and leadership summits',
          'Flexible work arrangement',
          'International travel opportunities',
          'Executive coaching and leadership development'
        ],
        companyInfo: 'GlobalUser is a leading digital product company creating experiences used by over 100 million people worldwide. Our international team of 500+ employees works across design, engineering, and product to deliver innovative solutions for global brands. Founded in 2010, we have offices in New York, London, Singapore, and Sydney.'
      },
      {
        id: 'job_fs_1',
        title: 'Junior Full Stack Developer',
        company: 'TechStart',
        companyLogo: 'T',
        location: 'Remote',
        salary: '$65,000 - $85,000',
        jobType: 'Full-time',
        experience: '0-2 years',
        matchScore: 87,
        postedDate: '2024-10-03',
        skills: ['JavaScript', 'React', 'Node.js', 'HTML/CSS', 'Git', 'REST APIs', 'MongoDB'],
        description: 'TechStart is looking for a Junior Full Stack Developer to join our growing team. You will work on both frontend and backend aspects of our web applications, collaborating with senior developers to implement features and fix bugs. This is an excellent opportunity to build your skills across the entire development stack.',
        requirements: [
          '0-2 years of development experience',
          'Knowledge of JavaScript and modern frameworks',
          'Understanding of frontend technologies (HTML, CSS, React)',
          'Familiarity with Node.js and Express',
          'Basic database knowledge (SQL or NoSQL)',
          'Understanding of version control with Git',
          'Eagerness to learn and grow as a developer'
        ],
        benefits: [
          'Competitive starting salary',
          'Health and dental coverage',
          'Flexible working hours',
          'Remote work options',
          'Mentorship program',
          'Training and learning budget',
          'Modern equipment stipend'
        ],
        companyInfo: 'TechStart develops web applications for startups and small businesses. Our team of 25 developers helps clients bring their ideas to life through modern, scalable technology solutions. Founded in 2020, we have already delivered over 50 successful projects across various industries.'
      },
      {
        id: 'job_fs_2',
        title: 'Full Stack Developer',
        company: 'InnovateLabs',
        companyLogo: 'I',
        location: 'Hybrid (Denver, CO)',
        salary: '$90,000 - $110,000',
        jobType: 'Full-time',
        experience: '2-3 years',
        matchScore: 91,
        postedDate: '2024-09-30',
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'REST APIs', 'Git', 'Docker'],
        description: 'InnovateLabs is seeking a Full Stack Developer to work on our client projects. You will be responsible for developing and maintaining web applications, implementing features across the stack, and collaborating with designers and product managers to deliver high-quality solutions.',
        requirements: [
          '2-3 years of professional full stack development experience',
          'Strong proficiency in JavaScript, React, and Node.js',
          'Experience with TypeScript in real projects',
          'Knowledge of MongoDB or similar NoSQL databases',
          'Experience with RESTful API design and implementation',
          'Familiarity with Docker and containerization',
          'Good communication and teamwork skills'
        ],
        benefits: [
          'Competitive salary',
          'Comprehensive health benefits',
          'Hybrid work model (2 days in office)',
          'Professional development budget',
          'Regular team events and activities',
          '401(k) matching program',
          'Casual work environment'
        ],
        companyInfo: 'InnovateLabs is a technology consultancy that helps businesses build modern web applications. Our team of 50+ developers, designers, and project managers works with clients ranging from funded startups to established enterprises. Founded in 2018, we specialize in creating custom solutions that solve real business problems.'
      },
      {
        id: 'job_fs_3',
        title: 'Mid-Level Full Stack Developer',
        company: 'OmniStack',
        companyLogo: 'O',
        location: 'Remote',
        salary: '$100,000 - $125,000',
        jobType: 'Full-time',
        experience: '3-5 years',
        matchScore: 93,
        postedDate: '2024-10-01',
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'GraphQL', 'PostgreSQL', 'AWS', 'CI/CD'],
        description: 'OmniStack is looking for a Mid-Level Full Stack Developer to join our product engineering team. You will work across the entire stack to build and improve our SaaS platform, implement new features, optimize performance, and collaborate with other engineers on complex technical challenges.',
        requirements: [
          '3-5 years of full stack development experience',
          'Strong proficiency in JavaScript, React, and Node.js',
          'Experience with TypeScript in production environments',
          'Knowledge of GraphQL and RESTful APIs',
          'Experience with relational databases like PostgreSQL',
          'Familiarity with AWS or other cloud platforms',
          'Understanding of CI/CD pipelines and deployment processes'
        ],
        benefits: [
          'Competitive salary package',
          'Comprehensive health coverage',
          'Unlimited PTO policy',
          'Remote work flexibility',
          'Professional development budget',
          'Stock options',
          'Home office stipend'
        ],
        companyInfo: 'OmniStack builds a leading SaaS platform for project management and team collaboration. Our product serves over 50,000 users at companies of all sizes. Founded in 2019, we are a fully remote company with team members across North America and Europe.'
      },
      {
        id: 'job_fs_4',
        title: 'Senior Full Stack Developer',
        company: 'FullSpectrum',
        companyLogo: 'F',
        location: 'Remote',
        salary: '$125,000 - $155,000',
        jobType: 'Full-time',
        experience: '5-7 years',
        matchScore: 89,
        postedDate: '2024-09-28',
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS', 'System Design', 'PostgreSQL', 'Team Leadership'],
        description: 'FullSpectrum is seeking a Senior Full Stack Developer to help build our next-generation platform. You will architect and implement complex features, lead technical initiatives, mentor junior developers, and collaborate with product managers to define technical requirements and delivery timelines.',
        requirements: [
          '5-7 years of full stack development experience',
          'Expert knowledge of JavaScript, React, and Node.js',
          'Strong TypeScript skills in large applications',
          'Experience with AWS services and cloud architecture',
          'Strong system design and architecture skills',
          'Experience with database design and optimization',
          'Team leadership and mentoring experience'
        ],
        benefits: [
          'Highly competitive salary',
          'Comprehensive health benefits',
          'Flexible work arrangements',
          'Professional development fund',
          'Stock options',
          '401(k) with employer match',
          'Annual team retreats'
        ],
        companyInfo: 'FullSpectrum creates enterprise software solutions used by Fortune 500 companies. Our platform processes millions of transactions daily for clients in finance, healthcare, and e-commerce sectors. Founded in 2016, we have grown to 120+ employees distributed across the United States and Canada.'
      },
      {
        id: 'job_fs_5',
        title: 'Lead Full Stack Developer',
        company: 'StackMasters',
        companyLogo: 'S',
        location: 'Hybrid (Boston, MA)',
        salary: '$140,000 - $170,000',
        jobType: 'Full-time',
        experience: '7-10 years',
        matchScore: 85,
        postedDate: '2024-09-22',
        skills: ['JavaScript', 'React', 'Node.js', 'System Architecture', 'Team Leadership', 'Microservices', 'AWS', 'CI/CD'],
        description: 'StackMasters is looking for a Lead Full Stack Developer to direct our engineering efforts. You will lead a team of developers, make architecture decisions, establish coding standards, implement complex features, and ensure the quality and reliability of our software products.',
        requirements: [
          '7-10 years of full stack development experience',
          'Experience leading development teams',
          'Expert knowledge of JavaScript ecosystem',
          'Strong architecture and system design skills',
          'Experience with microservices architecture',
          'Strong understanding of cloud platforms (preferably AWS)',
          'Excellent communication and leadership abilities'
        ],
        benefits: [
          'Top-tier compensation package',
          'Premium health and wellness benefits',
          'Flexible hybrid work arrangement',
          'Leadership development program',
          'Stock options and equity grants',
          'Annual performance bonus',
          'Generous paid time off policy'
        ],
        companyInfo: 'StackMasters builds custom software solutions for enterprise clients. Our team of 150+ engineers specializes in creating scalable, robust applications that solve complex business problems. Founded in 2015, we have offices in Boston, New York, and Chicago, serving clients across finance, healthcare, and manufacturing sectors.'
      },
      {
        id: 'job_fs_6',
        title: 'Principal Full Stack Engineer',
        company: 'EliteStack',
        companyLogo: 'E',
        location: 'Remote',
        salary: '$160,000 - $190,000',
        jobType: 'Full-time',
        experience: '10+ years',
        matchScore: 92,
        postedDate: '2024-10-04',
        skills: ['JavaScript', 'React', 'Node.js', 'System Architecture', 'Technical Leadership', 'Mentorship', 'Cloud Infrastructure', 'Scalability'],
        description: 'EliteStack is seeking a Principal Full Stack Engineer to serve as a technical leader across our engineering organization. You will define our technical strategy, establish architecture standards, lead complex initiatives, mentor senior developers, and work with executive leadership to align technology with business goals.',
        requirements: [
          '10+ years of software engineering experience',
          'Deep expertise across frontend and backend technologies',
          'Extensive experience leading technical initiatives',
          'Strong architecture and system design skills',
          'Experience mentoring and growing engineering teams',
          'Track record of solving complex technical challenges',
          'Excellent communication and strategic thinking abilities'
        ],
        benefits: [
          'Industry-leading compensation',
          'Executive-level benefits package',
          'Unlimited vacation policy',
          'Stock options and equity grants',
          'Executive coaching and leadership training',
          'Annual technology conference budget',
          'Home office and equipment allowance'
        ],
        companyInfo: 'EliteStack is a leading technology company building next-generation software platforms. Our solutions serve millions of users across finance, healthcare, and enterprise sectors. Founded in 2014, we have grown to 200+ employees with a fully distributed team spanning North America, Europe, and Asia.'
      },
      {
        id: 'job_fs_7',
        title: 'Full Stack Architect',
        company: 'TechArchitects',
        companyLogo: 'T',
        location: 'Remote',
        salary: '$170,000 - $210,000',
        jobType: 'Full-time',
        experience: '12+ years',
        matchScore: 88,
        postedDate: '2024-09-20',
        skills: ['System Design', 'Technical Leadership', 'Cloud Architecture', 'API Design', 'Microservices', 'Performance Optimization', 'Security'],
        description: 'TechArchitects is looking for a Full Stack Architect to define our technical vision and architecture. You will design scalable, resilient systems, set standards for frontend and backend development, evaluate emerging technologies, and ensure our architecture can support rapid growth and changing business requirements.',
        requirements: [
          '12+ years of software engineering experience',
          'Extensive architecture and system design experience',
          'Deep expertise across the full development stack',
          'Experience designing large-scale distributed systems',
          'Strong cloud platform knowledge (AWS, Azure, or GCP)',
          'Experience with high-traffic, high-reliability systems',
          'Excellent leadership and communication skills'
        ],
        benefits: [
          'Top-of-market compensation',
          'Comprehensive executive benefits package',
          'Significant equity compensation',
          'Flexible work arrangements',
          'Technology conference and speaking opportunities',
          'Executive retreat and leadership summits',
          'Annual learning and development allowance'
        ],
        companyInfo: 'TechArchitects specializes in designing and building complex software systems for enterprise clients. Our team of 250+ engineers and architects creates scalable, secure, and performant solutions for businesses across financial services, healthcare, and telecommunications industries. Founded in 2012, we have offices in San Francisco, New York, and London.'
      },
      {
        id: 'job_do_1',
        title: 'Junior DevOps Engineer',
        company: 'CloudOps',
        companyLogo: 'C',
        location: 'Remote',
        salary: '$70,000 - $90,000',
        jobType: 'Full-time',
        experience: '0-2 years',
        matchScore: 84,
        postedDate: '2024-10-01',
        skills: ['Linux', 'Docker', 'CI/CD', 'AWS', 'Bash', 'Git', 'Infrastructure as Code'],
        description: 'CloudOps is seeking a Junior DevOps Engineer to join our infrastructure team. You will help maintain our cloud infrastructure, assist with CI/CD pipelines, automate routine tasks, and support our development teams. This is an excellent opportunity to learn DevOps practices in a supportive environment.',
        requirements: [
          '0-2 years of experience in IT, system administration, or development',
          'Basic knowledge of Linux and command line',
          'Familiarity with containerization (Docker)',
          'Understanding of CI/CD concepts',
          'Basic AWS or cloud platform knowledge',
          'Willingness to learn and problem-solve',
          'Good communication skills'
        ],
        benefits: [
          'Competitive starting salary',
          'Health and dental coverage',
          'Flexible work schedule',
          'Learning and certification budget',
          'Mentorship program',
          'Remote work options',
          'Modern equipment allowance'
        ],
        companyInfo: 'CloudOps specializes in cloud infrastructure management and DevOps services. Our team of 40+ cloud engineers helps companies optimize their infrastructure, automate deployments, and implement best practices. Founded in 2019, we serve clients from startups to enterprises across various industries.'
      },
      {
        id: 'job_do_2',
        title: 'DevOps Engineer',
        company: 'InfraCore',
        companyLogo: 'I',
        location: 'Hybrid (Austin, TX)',
        salary: '$95,000 - $120,000',
        jobType: 'Full-time',
        experience: '2-3 years',
        matchScore: 90,
        postedDate: '2024-09-29',
        skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Python', 'Monitoring', 'Linux'],
        description: 'InfraCore is looking for a DevOps Engineer to help build and maintain our cloud infrastructure. You will implement Infrastructure as Code, maintain Kubernetes clusters, build CI/CD pipelines, and collaborate with development teams to improve deployment processes and system reliability.',
        requirements: [
          '2-3 years of experience in DevOps, SRE, or similar roles',
          'Strong experience with AWS services',
          'Experience with Kubernetes and container orchestration',
          'Knowledge of Infrastructure as Code (Terraform, CloudFormation)',
          'Experience with CI/CD tools and pipelines',
          'Scripting skills in Python, Bash, or similar',
          'Strong Linux administration skills'
        ],
        benefits: [
          'Competitive salary',
          'Comprehensive health benefits',
          'Hybrid work model (2 days in office)',
          'Cloud certification program',
          'Professional development budget',
          '401(k) with employer match',
          'Regular team events'
        ],
        companyInfo: 'InfraCore provides cloud infrastructure and DevOps solutions for technology companies. Our team of 70+ cloud engineers and architects helps businesses build scalable, secure, and resilient cloud environments. Founded in La 2018, we work with clients ranging from startups to large enterprises.'
      },
      {
        id: 'job_do_3',
        title: 'Mid-Level DevOps Engineer',
        company: 'PlatformNow',
        companyLogo: 'P',
        location: 'Remote',
        salary: '$110,000 - $135,000',
        jobType: 'Full-time',
        experience: '3-5 years',
        matchScore: 93,
        postedDate: '2024-10-03',
        skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Docker', 'Infrastructure as Code', 'Monitoring', 'Security'],
        description: 'PlatformNow is seeking a Mid-Level DevOps Engineer to help scale our platform infrastructure. You will design and implement cloud architecture, automate deployment processes, optimize system performance, and collaborate with development teams to improve infrastructure reliability and security.',
        requirements: [
          '3-5 years of DevOps or SRE experience',
          'Strong Kubernetes experience in production environments',
          'Advanced AWS knowledge across multiple services',
          'Experience with Infrastructure as Code (Terraform)',
          'Expertise in CI/CD pipeline implementation',
          'Strong understanding of monitoring and observability',
          'Knowledge of security best practices in cloud environments'
        ],
        benefits: [
          'Competitive salary package',
          'Comprehensive health coverage',
          'Unlimited PTO policy',
          'Remote work flexibility',
          'Cloud certification reimbursement',
          'Professional development budget',
          'Home office allowance'
        ],
        companyInfo: 'PlatformNow provides a cloud-native platform that helps businesses deploy and manage their applications. Our platform serves over 200 companies, handling millions of deployments annually. Founded in 2019, we are a remote-first company with team members across North America and Europe.'
      },
      {
        id: 'job_do_4',
        title: 'Senior DevOps Engineer',
        company: 'CloudScale',
        companyLogo: 'C',
        location: 'Remote',
        salary: '$130,000 - $160,000',
        jobType: 'Full-time',
        experience: '5-7 years',
        matchScore: 87,
        postedDate: '2024-09-27',
        skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Infrastructure Design', 'Automation', 'Security', 'Site Reliability'],
        description: 'CloudScale is looking for a Senior DevOps Engineer to lead our infrastructure and operations efforts. You will design cloud architecture, implement scalable and secure infrastructure, lead automation initiatives, and work with development teams to improve deployment processes and system reliability.',
        requirements: [
          '5-7 years of DevOps or SRE experience',
          'Expert knowledge of Kubernetes and container orchestration',
          'Deep expertise with AWS services and architecture',
          'Advanced experience with Terraform and IaC practices',
          'Strong CI/CD implementation and optimization skills',
          'Experience with monitoring and observability platforms',
          'Knowledge of security best practices and compliance'
        ],
        benefits: [
          'Highly competitive salary',
          'Comprehensive benefits package',
          'Flexible work arrangements',
          'Cloud certification program',
          'Conference and training budget',
          'Stock options',
          'Annual performance bonus'
        ],
        companyInfo: 'CloudScale helps businesses build and manage scalable cloud infrastructure. Our team of 80+ cloud experts provides consulting, implementation, and managed services for companies across e-commerce, fintech, and healthcare sectors. Founded in 2017, we have grown rapidly to serve clients across North America and Europe.'
      },
      {
        id: 'job_do_5',
        title: 'Lead DevOps Engineer',
        company: 'InfrastructureIQ',
        companyLogo: 'I',
        location: 'Hybrid (Seattle, WA)',
        salary: '$145,000 - $175,000',
        jobType: 'Full-time',
        experience: '7-10 years',
        matchScore: 91,
        postedDate: '2024-09-24',
        skills: ['Kubernetes', 'Multi-cloud', 'Infrastructure Architecture', 'Team Leadership', 'CI/CD', 'Security', 'Cost Optimization', 'SRE'],
        description: 'InfrastructureIQ is seeking a Lead DevOps Engineer to direct our cloud infrastructure strategy. You will lead a team of DevOps engineers, architect our multi-cloud environment, establish best practices, mentor team members, and collaborate with leadership to align infrastructure with business goals.',
        requirements: [
          '7-10 years of DevOps, SRE, or infrastructure engineering experience',
          'Experience leading DevOps or infrastructure teams',
          'Expert knowledge of Kubernetes in large-scale environments',
          'Experience with multi-cloud strategies and implementation',
          'Strong architecture and system design skills',
          'Experience implementing security and compliance measures',
          'Excellent communication and leadership abilities'
        ],
        benefits: [
          'Top-tier compensation package',
          'Premium health and wellness benefits',
          'Hybrid work arrangement',
          'Leadership development program',
          'Cloud certification allowance',
          'Stock options',
          'Generous vacation policy'
        ],
        companyInfo: 'InfrastructureIQ provides enterprise-grade cloud infrastructure solutions for large organizations. Our platform helps companies manage complex multi-cloud environments, optimize costs, and ensure security compliance. Founded in 2016, we have grown to 150+ employees with offices in Seattle, New York, and London.'
      },
      {
        id: 'job_do_6',
        title: 'Principal DevOps Engineer',
        company: 'PlatformX',
        companyLogo: 'P',
        location: 'Remote',
        salary: '$160,000 - $190,000',
        jobType: 'Full-time',
        experience: '10+ years',
        matchScore: 86,
        postedDate: '2024-10-02',
        skills: ['Cloud Architecture', 'Kubernetes', 'Multi-cloud', 'Infrastructure Strategy', 'Technical Leadership', 'Security', 'Cost Optimization', 'SRE'],
        description: 'PlatformX is looking for a Principal DevOps Engineer to shape our infrastructure strategy and practices. You will set the technical direction for our cloud platforms, lead architectural decisions, establish engineering standards, mentor senior team members, and work closely with executive leadership on strategic initiatives.',
        requirements: [
          '10+ years of infrastructure, DevOps, or SRE experience',
          'Extensive experience designing cloud architecture for large-scale systems',
          'Deep expertise across multiple cloud platforms',
          'Track record of leading successful infrastructure transformations',
          'Experience establishing DevOps practices and culture',
          'Strong knowledge of security and compliance requirements',
          'Excellent leadership and communication skills'
        ],
        benefits: [
          'Industry-leading compensation',
          'Comprehensive executive benefits package',
          'Flexible work arrangements',
          'Stock options and equity grants',
          'Executive coaching and leadership development',
          'Technology conference budget',
          'Annual cloud certification allowance'
        ],
        companyInfo: 'PlatformX builds cloud infrastructure platforms that power digital transformation for large enterprises. Our solutions help companies deploy and manage applications at scale while maintaining security and compliance. Founded in 2015, we have grown to 200+ employees serving clients across financial services, healthcare, and retail sectors.'
      },
      {
        id: 'job_do_7',
        title: 'DevOps Architect',
        company: 'CloudArch',
        companyLogo: 'C',
        location: 'Remote',
        salary: '$170,000 - $210,000',
        jobType: 'Full-time',
        experience: '12+ years',
        matchScore: 89,
        postedDate: '2024-09-19',
        skills: ['Cloud Architecture', 'Multi-cloud Strategy', 'Kubernetes', 'Infrastructure as Code', 'Security Architecture', 'Disaster Recovery', 'Cost Optimization'],
        description: 'CloudArch is seeking a DevOps Architect to define our technical vision for infrastructure and operations. You will design cloud-native architecture, establish infrastructure standards, lead complex migration projects, oversee security and compliance initiatives, and work with executive leadership to align technology with business strategy.',
        requirements: [
          '12+ years of infrastructure, DevOps, or cloud engineering experience',
          'Extensive architecture experience with large-scale cloud systems',
          'Deep expertise across AWS, Azure, GCP, or similar platforms',
          'Experience designing global, multi-region infrastructure',
          'Strong background in security architecture and compliance',
          'Experience setting technical strategy at an organizational level',
          'Excellent communication skills with technical and non-technical stakeholders'
        ],
        benefits: [
          'Top-of-market compensation',
          'Executive-level benefits',
          'Significant equity compensation',
          'Unlimited vacation policy',
          'Home office and technology allowance',
          'Executive coaching program',
          'Conference speaking opportunities'
        ],
        companyInfo: 'CloudArch specializes in designing and implementing cloud architecture for enterprise clients. Our team of 180+ cloud architects and engineers helps organizations build secure, scalable, and cost-effective infrastructure. Founded in 2014, we serve Fortune 500 clients across financial services, healthcare, and retail industries.'
      },
      {
        id: 'job_ds_1',
        title: 'Junior Data Scientist',
        company: 'DataMinds',
        companyLogo: 'D',
        location: 'Remote',
        salary: '$70,000 - $90,000',
        jobType: 'Full-time',
        experience: '0-2 years',
        matchScore: 85,
        postedDate: '2024-10-01',
        skills: ['Python', 'SQL', 'Statistics', 'Data Analysis', 'Pandas', 'NumPy', 'Data Visualization', 'Machine Learning'],
        description: 'DataMinds is seeking a Junior Data Scientist to join our analytics team. You will analyze data sets, build statistical models, create visualizations, and collaborate with business stakeholders to derive insights. This is an excellent opportunity to start your career in data science with mentorship from experienced professionals.',
        requirements: [
          '0-2 years of experience in data analysis or data science',
          'Bachelor\'s or Master\'s degree in Statistics, Computer Science, or related field',
          'Proficiency in Python and data analysis libraries',
          'Good understanding of statistical concepts',
          'Basic SQL knowledge',
          'Experience with data visualization tools',
          'Strong problem-solving skills and attention to detail'
        ],
        benefits: [
          'Competitive starting salary',
          'Health and dental coverage',
          'Flexible remote work',
          'Learning and development budget',
          'Mentorship program',
          'Regular knowledge sharing sessions',
          'Modern equipment stipend'
        ],
        companyInfo: 'DataMinds helps businesses leverage data to make better decisions. Our team of 45+ data scientists, analysts, and engineers provides analytics solutions across retail, finance, and healthcare industries. Founded in 2020, we specialize in turning complex data into actionable business insights.'
      },
      {
        id: 'job_ds_2',
        title: 'Data Scientist',
        company: 'Analytika',
        companyLogo: 'A',
        location: 'Hybrid (Boston, MA)',
        salary: '$95,000 - $120,000',
        jobType: 'Full-time',
        experience: '2-3 years',
        matchScore: 92,
        postedDate: '2024-09-28',
        skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistical Analysis', 'Data Visualization', 'Deep Learning', 'Feature Engineering'],
        description: 'Analytika is seeking a Data Scientist to join our growing team. You will build machine learning models, analyze complex datasets, develop data-driven solutions, and work with stakeholders to translate business problems into analytical frameworks. This role requires both technical skills and business acumen.',
        requirements: [
          '2-3 years of experience in data science or related field',
          'Master\'s degree in Statistics, Computer Science, or related field',
          'Strong programming skills in Python and/or R',
          'Experience building and deploying machine learning models',
          'Proficiency in SQL and database concepts',
          'Experience with data visualization tools',
          'Excellent communication and problem-solving skills'
        ],
        benefits: [
          'Competitive salary',
          'Comprehensive health benefits',
          'Hybrid work model (2 days in office)',
          'Professional development budget',
          'Conference and training allowance',
          '401(k) with company match',
          'Regular team events'
        ],
        companyInfo: 'Analytika provides advanced analytics and machine learning solutions for Fortune 500 companies. Our team of 75+ data scientists helps businesses unlock the value of their data through predictive modeling, optimization, and AI. Founded in 2018, we specialize in financial services, healthcare, and retail analytics.'
      },
      {
        id: 'job_ds_3',
        title: 'Mid-Level Data Scientist',
        company: 'InsightAI',
        companyLogo: 'I',
        location: 'Remote',
        salary: '$110,000 - $135,000',
        jobType: 'Full-time',
        experience: '3-5 years',
        matchScore: 88,
        postedDate: '2024-10-02',
        skills: ['Python', 'Machine Learning', 'Deep Learning', 'NLP', 'SQL', 'Feature Engineering', 'Model Deployment', 'Cloud Platforms'],
        description: 'InsightAI is looking for a Mid-Level Data Scientist to develop advanced machine learning solutions. You will build and deploy models that solve complex business problems, work with large datasets, collaborate with engineering teams to productionize models, and communicate insights to stakeholders.',
        requirements: [
          '3-5 years of professional data science experience',
          'Advanced degree in Computer Science, Statistics, or related field',
          'Strong Python programming and machine learning experience',
          'Experience with deep learning frameworks (TensorFlow, PyTorch)',
          'Natural language processing (NLP) experience',
          'Knowledge of model deployment and MLOps',
          'Strong communication and stakeholder management skills'
        ],
        benefits: [
          'Competitive salary package',
          'Comprehensive health coverage',
          'Unlimited PTO policy',
          'Remote work flexibility',
          'Professional development budget',
          'Conference attendance allowance',
          'Home office stipend'
        ],
        companyInfo: 'InsightAI develops artificial intelligence solutions that help businesses automate processes and gain insights from unstructured data. Our team of 90+ AI specialists builds custom machine learning models for document processing, sentiment analysis, and predictive analytics. Founded in 2019, we serve clients across financial services, legal, and healthcare sectors.'
      },
      {
        id: 'job_ds_4',
        title: 'Senior Data Scientist',
        company: 'DataNova',
        companyLogo: 'D',
        location: 'Remote',
        salary: '$130,000 - $160,000',
        jobType: 'Full-time',
        experience: '5-7 years',
        matchScore: 90,
        postedDate: '2024-09-27',
        skills: ['Machine Learning', 'Python', 'Statistical Modeling', 'MLOps', 'Deep Learning', 'Experimental Design', 'Big Data', 'Team Leadership'],
        description: 'DataNova is seeking a Senior Data Scientist to lead complex machine learning projects. You will design and implement advanced models, establish data science best practices, mentor junior team members, and work with business stakeholders to identify high-impact opportunities. This role combines technical expertise with leadership responsibilities.',
        requirements: [
          '5-7 years of data science experience',
          'Advanced degree in Statistics, Computer Science, or related field',
          'Expert-level Python programming and ML framework knowledge',
          'Experience leading data science projects end-to-end',
          'Strong background in statistical modeling and experimentation',
          'Experience with MLOps and model deployment',
          'Excellent communication and leadership skills'
        ],
        benefits: [
          'Highly competitive salary',
          'Comprehensive benefits package',
          'Flexible remote work policy',
          'Professional development fund',
          'Conference attendance and speaking opportunities',
          'Stock options',
          'Annual performance bonus'
        ],
        companyInfo: 'DataNova specializes in advanced machine learning solutions for complex business problems. Our team of 120+ data scientists and ML engineers builds custom AI models that drive measurable business impact. Founded in 2017, we work with Fortune 500 clients across financial services, healthcare, and e-commerce sectors.'
      },
      {
        id: 'job_ds_5',
        title: 'Lead Data Scientist',
        company: 'QuantumAnalytics',
        companyLogo: 'Q',
        location: 'Hybrid (San Francisco, CA)',
        salary: '$150,000 - $180,000',
        jobType: 'Full-time',
        experience: '7-10 years',
        matchScore: 94,
        postedDate: '2024-09-30',
        skills: ['Machine Learning', 'Team Leadership', 'Project Management', 'Statistical Modeling', 'MLOps', 'Stakeholder Management', 'Model Governance', 'Python'],
        description: 'QuantumAnalytics is looking for a Lead Data Scientist to direct our data science function. You will lead a team of data scientists, set technical direction for projects, develop ML strategies, establish best practices, and work closely with executive leadership to align data science initiatives with business objectives.',
        requirements: [
          '7-10 years of data science or analytics experience',
          'Experience leading data science teams',
          'Advanced degree in a quantitative field',
          'Deep expertise in machine learning and statistical modeling',
          'Experience managing multiple concurrent data science projects',
          'Strong understanding of ML model governance and ethics',
          'Excellent leadership and communication skills'
        ],
        benefits: [
          'Top-tier compensation package',
          'Premium health and wellness benefits',
          'Hybrid work arrangement',
          'Leadership development program',
          'Annual performance bonus',
          'Stock options and equity grants',
          'Generous vacation policy'
        ],
        companyInfo: 'QuantumAnalytics provides enterprise AI solutions that transform how businesses operate. Our team of 150+ data scientists, engineers, and domain experts develops custom machine learning solutions for Fortune 500 clients. Founded in 2016, we have offices in San Francisco, New York, and London.'
      },
      {
        id: 'job_ds_6',
        title: 'Principal Data Scientist',
        company: 'DataScience Labs',
        companyLogo: 'D',
        location: 'Remote',
        salary: '$170,000 - $200,000',
        jobType: 'Full-time',
        experience: '10+ years',
        matchScore: 86,
        postedDate: '2024-10-04',
        skills: ['Machine Learning Strategy', 'AI Research', 'Team Leadership', 'Algorithm Development', 'Statistical Modeling', 'MLOps', 'Causal Inference', 'Business Strategy'],
        description: 'DataScience Labs is seeking a Principal Data Scientist to serve as a technical leader for our organization. You will define our ML/AI vision, guide research initiatives, establish methodological standards, mentor senior team members, and work with executive leadership to develop data science strategy that drives business impact.',
        requirements: [
          '10+ years of experience in data science or ML/AI research',
          'PhD in Computer Science, Statistics, or related field preferred',
          'Track record of leading successful data science initiatives',
          'Publications or patents in machine learning or AI (preferred)',
          'Experience developing novel algorithms or methodologies',
          'Strong leadership and mentoring abilities',
          'Excellent communication skills with technical and non-technical audiences'
        ],
        benefits: [
          'Industry-leading compensation',
          'Executive-level benefits package',
          'Flexible work arrangements',
          'Research budget and conference sponsorship',
          'Patent and publication support',
          'Stock options and equity grants',
          'Executive coaching program'
        ],
        companyInfo: 'DataScience Labs combines cutting-edge research with practical business applications. Our team of 100+ data scientists, many with PhDs and research backgrounds, develops new AI methodologies and applies them to solve complex business problems. Founded in 2015, we work at the intersection of academic research and commercial application.'
      },
      {
        id: 'job_ds_7',
        title: 'Director of Data Science',
        company: 'AIVertex',
        companyLogo: 'A',
        location: 'Hybrid (New York, NY)',
        salary: '$180,000 - $220,000',
        jobType: 'Full-time',
        experience: '12+ years',
        matchScore: 89,
        postedDate: '2024-09-26',
        skills: ['Data Science Leadership', 'AI Strategy', 'Team Building', 'Machine Learning', 'Executive Communication', 'Organizational Leadership', 'Business Acumen'],
        description: 'AIVertex is looking for a Director of Data Science to lead our entire data science organization. You will build and manage multiple data science teams, develop our AI/ML strategy, establish organizational best practices, collaborate with other department leaders, and represent data science at the executive level.',
        requirements: [
          '12+ years of experience in data science or analytics',
          'Minimum 5 years in leadership roles',
          'Advanced degree in a quantitative field (PhD preferred)',
          'Experience building and scaling data science teams',
          'Strong track record of delivering business impact through AI/ML',
          'Experience working with C-level executives',
          'Outstanding leadership, communication, and strategic thinking skills'
        ],
        benefits: [
          'Executive compensation package',
          'Comprehensive executive benefits',
          'Significant equity compensation',
          'Executive leadership development program',
          'Board and committee participation',
          'Conference speaking opportunities',
          'Flexible work arrangement'
        ],
        companyInfo: 'AIVertex is an AI-first company that builds machine learning platforms and solutions for enterprise clients. Our products are used by over 200 companies worldwide to deploy and manage machine learning models at scale. Founded in 2014, we have grown to 350+ employees with offices in New York, San Francisco, and London.'
      },
      
      // ------------------- MOBILE APP DEVELOPER ROLES -------------------
      {
        id: 'job_ma_1',
        title: 'Junior Mobile App Developer',
        company: 'AppStart',
        companyLogo: 'A',
        location: 'Remote',
        salary: '$65,000 - $85,000',
        jobType: 'Full-time',
        experience: '0-2 years',
        matchScore: 86,
        postedDate: '2024-09-29',
        skills: ['React Native', 'JavaScript', 'Mobile UI Design', 'iOS', 'Android', 'Git', 'API Integration'],
        description: 'AppStart is seeking a Junior Mobile App Developer to join our product team. You will work on cross-platform mobile applications using React Native, implement UI components, integrate with backend APIs, and collaborate with designers and senior developers. This is an excellent opportunity to grow your mobile development skills.',
        requirements: [
          '0-2 years of experience in mobile or web development',
          'Knowledge of JavaScript and React or React Native',
          'Understanding of mobile UI/UX principles',
          'Basic knowledge of iOS and Android platforms',
          'Familiarity with RESTful APIs and data integration',
          'Problem-solving skills and attention to detail',
          'Eagerness to learn and grow as a developer'
        ],
        benefits: [
          'Competitive starting salary',
          'Health and dental coverage',
          'Flexible work schedule',
          'Learning and development budget',
          'Mentorship program',
          'Remote work options',
          'Modern equipment stipend'
        ],
        companyInfo: 'AppStart builds mobile applications for startups and small businesses. Our team of 30 developers specializes in creating user-friendly, cross-platform mobile apps that help businesses engage with their customers. Founded in 2020, we have already delivered over 40 successful mobile projects.'
      },
      {
        id: 'job_ma_2',
        title: 'Mobile App Developer',
        company: 'MobileFusion',
        companyLogo: 'M',
        location: 'Hybrid (Miami, FL)',
        salary: '$85,000 - $110,000',
        jobType: 'Full-time',
        experience: '2-3 years',
        matchScore: 91,
        postedDate: '2024-10-03',
        skills: ['React Native', 'Swift', 'Kotlin', 'JavaScript', 'Mobile UI/UX', 'API Integration', 'Redux', 'Firebase'],
        description: 'MobileFusion is looking for a Mobile App Developer to build high-quality mobile applications. You will work on both cross-platform (React Native) and native (iOS/Android) apps, implement complex features, integrate with backend services, and ensure excellent performance and user experience across devices.',
        requirements: [
          '2-3 years of professional mobile development experience',
          'Strong experience with React Native',
          'Knowledge of either native iOS (Swift) or Android (Kotlin) development',
          'Proficiency in JavaScript and modern JS concepts',
          'Experience with state management (Redux or similar)',
          'Understanding of mobile UI/UX best practices',
          'Experience with mobile app deployment and store submission'
        ],
        benefits: [
          'Competitive salary',
          'Comprehensive health benefits',
          'Hybrid work model (2 days in office)',
          'Professional development opportunities',
          'Mobile device allowance',
          '401(k) with company match',
          'Regular team events'
        ],
        companyInfo: 'MobileFusion creates innovative mobile applications for businesses across various industries. Our team of 50+ mobile developers specializes in building beautiful, performant apps for iOS and Android. Founded in 2018, we have delivered over 100 successful mobile projects for clients ranging from startups to established enterprises.'
      },
      {
        id: 'job_ma_3',
        title: 'Mid-Level Mobile Developer',
        company: 'AppNova',
        companyLogo: 'A',
        location: 'Remote',
        salary: '$100,000 - $125,000',
        jobType: 'Full-time',
        experience: '3-5 years',
        matchScore: 89,
        postedDate: '2024-09-25',
        skills: ['React Native', 'Swift', 'Kotlin', 'TypeScript', 'Mobile Architecture', 'State Management', 'Performance Optimization', 'CI/CD'],
        description: 'AppNova is seeking a Mid-Level Mobile Developer to help build our flagship mobile product. You will implement complex features, optimize app performance, build reusable components, and collaborate with product and design teams to create exceptional mobile experiences.',
        requirements: [
          '3-5 years of mobile app development experience',
          'Strong experience with React Native in production apps',
          'Knowledge of native development (Swift or Kotlin)',
          'Experience with TypeScript in mobile applications',
          'Understanding of mobile architecture patterns',
          'Experience with state management and data flow',
          'Knowledge of mobile CI/CD and deployment processes'
        ],
        benefits: [
          'Competitive salary package',
          'Comprehensive health coverage',
          'Unlimited PTO policy',
          'Remote work flexibility',
          'Professional development budget',
          'Latest mobile devices for testing',
          'Home office stipend'
        ],
        companyInfo: 'AppNova develops innovative mobile products that are used by millions of users worldwide. Our flagship app has over 5 million downloads and is consistently rated 4.7+ stars on app stores. Founded in 2019, we are a remote-first company with team members across North America and Europe.'
      },
      {
        id: 'job_ma_4',
        title: 'Senior Mobile App Developer',
        company: 'MobileFirst',
        companyLogo: 'M',
        location: 'Remote',
        salary: '$125,000 - $155,000',
        jobType: 'Full-time',
        experience: '5-7 years',
        matchScore: 93,
        postedDate: '2024-10-01',
        skills: ['React Native', 'Swift', 'Kotlin', 'Mobile Architecture', 'Performance Optimization', 'Team Leadership', 'CI/CD', 'App Security'],
        description: 'MobileFirst is looking for a Senior Mobile App Developer to lead mobile app development initiatives. You will architect mobile solutions, implement complex features, optimize performance, mentor junior developers, and collaborate with product teams to define technical requirements and delivery timelines.',
        requirements: [
          '5-7 years of mobile app development experience',
          'Expert knowledge of React Native and its ecosystem',
          'Strong experience with either iOS or Android native development',
          'Ability to architect complex mobile applications',
          'Experience with mobile app performance optimization',
          'Understanding of mobile security best practices',
          'Team leadership and mentoring experience'
        ],
        benefits: [
          'Highly competitive salary',
          'Comprehensive benefits package',
          'Flexible work arrangements',
          'Professional development fund',
          'Latest mobile devices and equipment',
          'Stock options',
          'Annual performance bonus'
        ],
        companyInfo: 'MobileFirst specializes in developing high-performance, mission-critical mobile applications for enterprise clients. Our apps are used by Fortune 500 companies in finance, healthcare, and retail sectors. Founded in 2016, we have grown to 100+ mobile developers working remotely across the United States and Canada.'
      },
      {
        id: 'job_ma_5',
        title: 'Lead Mobile Developer',
        company: 'AppMatrix',
        companyLogo: 'A',
        location: 'Hybrid (Chicago, IL)',
        salary: '$140,000 - $170,000',
        jobType: 'Full-time',
        experience: '7-10 years',
        matchScore: 87,
        postedDate: '2024-09-28',
        skills: ['Mobile Architecture', 'Team Leadership', 'React Native', 'Native Development', 'CI/CD', 'App Performance', 'Cross-platform Strategy', 'Mentorship'],
        description: 'AppMatrix is seeking a Lead Mobile Developer to direct our mobile engineering efforts. You will lead a team of mobile developers, make architecture decisions, establish mobile development standards, oversee app quality and performance, and work with product leadership to define and execute our mobile strategy.',
        requirements: [
          '7-10 years of mobile development experience',
          'Experience leading mobile development teams',
          'Expert knowledge of React Native and cross-platform development',
          'Strong understanding of native iOS and Android development',
          'Experience defining mobile architecture and best practices',
          'Strong leadership and communication skills',
          'Experience with the full mobile app lifecycle'
        ],
        benefits: [
          'Top-tier compensation package',
          'Premium health and wellness benefits',
          'Flexible hybrid work arrangement',
          'Leadership development program',
          'Mobile technology allowance',
          'Stock options and equity grants',
          'Generous paid time off policy'
        ],
        companyInfo: 'AppMatrix creates enterprise-grade mobile solutions for large organizations. Our suite of mobile products and frameworks helps companies build, deploy, and manage mobile applications at scale. Founded in 2015, we have offices in Chicago, New York, and San Francisco, serving clients across finance, healthcare, and retail sectors.'
      },
      {
        id: 'job_ma_6',
        title: 'Principal Mobile Engineer',
        company: 'MobileElite',
        companyLogo: 'M',
        location: 'Remote',
        salary: '$160,000 - $190,000',
        jobType: 'Full-time',
        experience: '10+ years',
        matchScore: 90,
        postedDate: '2024-09-26',
        skills: ['Mobile Strategy', 'Cross-platform Architecture', 'Team Leadership', 'Mobile Innovation', 'React Native', 'Native Development', 'Performance', 'Mentorship'],
        description: 'MobileElite is seeking a Principal Mobile Engineer to serve as a technical leader across our engineering organization. You will define our mobile technology strategy, establish architecture standards, lead complex initiatives, mentor senior developers, and work with executive leadership to align mobile technology with business goals.',
        requirements: [
          '10+ years of mobile development experience',
          'Deep expertise across multiple mobile platforms and frameworks',
          'Extensive experience leading technical mobile initiatives',
          'Strong architecture and system design skills',
          'Experience mentoring and growing engineering teams',
          'Track record of solving complex mobile engineering challenges',
          'Excellent communication and strategic thinking abilities'
        ],
        benefits: [
          'Industry-leading compensation',
          'Executive-level benefits package',
          'Unlimited vacation policy',
          'Stock options and equity grants',
          'Executive coaching and leadership training',
          'Annual technology conference budget',
          'Home office and equipment allowance'
        ],
        companyInfo: 'MobileElite is a leading mobile technology company building next-generation apps and frameworks. Our products are used by millions of users across consumer and enterprise markets. Founded in 2014, we have grown to 150+ employees with a fully distributed team spanning North America, Europe, and Asia.'
      },
      {
        id: 'job_ma_7',
        title: 'Mobile Architecture Director',
        company: 'AppFoundry',
        companyLogo: 'A',
        location: 'Remote',
        salary: '$170,000 - $210,000',
        jobType: 'Full-time',
        experience: '12+ years',
        matchScore: 85,
        postedDate: '2024-09-22',
        skills: ['Mobile Architecture', 'Technical Leadership', 'Cross-platform Strategy', 'App Performance', 'Mobile Security', 'Team Building', 'Executive Communication'],
        description: 'AppFoundry is looking for a Mobile Architecture Director to define our technical vision for mobile applications. You will design scalable, maintainable mobile architectures, set standards for mobile development, evaluate emerging technologies, and ensure our mobile strategy can support global scale and changing business requirements.',
        requirements: [
          '12+ years of software engineering experience with 8+ years in mobile',
          'Extensive architecture and system design experience',
          'Deep expertise across iOS, Android, and cross-platform frameworks',
          'Experience designing large-scale, high-performance mobile systems',
          'Strong understanding of mobile security and best practices',
          'Experience setting technical strategy at an organizational level',
          'Excellent leadership and communication skills'
        ],
        benefits: [
          'Top-of-market compensation',
          'Comprehensive executive benefits package',
          'Significant equity compensation',
          'Flexible work arrangements',
          'Technology conference and speaking opportunities',
          'Executive retreat and leadership summits',
          'Annual learning and development allowance'
        ],
        companyInfo: 'AppFoundry specializes in designing and building complex mobile applications for enterprise clients. Our team of 200+ mobile engineers and architects creates scalable, secure, and performant mobile solutions for businesses across financial services, healthcare, and retail industries. Founded in 2012, we have offices in San Francisco, New York, and London.'
      }
    ]
  },

  /**
   * Get jobs based on role category
   * @param {string} role - Role category to filter by
   * @returns {Array} Filtered job listings
   */
  getJobsByRole: function(role) {
    const allJobs = this.getAllJobs();
    
    if (!role) return allJobs;
    
    const roleLower = role.toLowerCase();
    return allJobs.filter(job => {
      return job.title.toLowerCase().includes(roleLower) || 
             job.description.toLowerCase().includes(roleLower) ||
             job.requirements.some(req => req.toLowerCase().includes(roleLower)) ||
             job.skills.some(skill => skill.toLowerCase().includes(roleLower));
    });
  },
  
  /**
   * Get jobs based on experience level
   * @param {string} level - Experience level category
   * @returns {Array} Filtered job listings
   */
  getJobsByExperience: function(level) {
    const allJobs = this.getAllJobs();
    
    if (!level) return allJobs;
    
    // Map experience level strings to year ranges
    const expRanges = {
      'entry': '0-2 years',
      'junior': '0-2 years',
      'mid': '3-5 years',
      'senior': '5-7 years',
      'lead': '7-10 years',
      'principal': '10+ years',
      'architect': '12+ years'
    };
    
    const targetExp = expRanges[level.toLowerCase()] || level;
    
    return allJobs.filter(job => job.experience.includes(targetExp));
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = JobListingsData;
}