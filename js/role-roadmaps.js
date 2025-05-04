/**
 * Role-specific career roadmaps for TechCareerMatch
 * Contains career paths, timelines, and salary data for each role
 */

const RoleRoadmaps = {
    // Role-specific roadmap data
    roadmapData: {
        "default": {
            careerPath: [
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
                    current: false
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
            ],
            timeline: [
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
            ],
            experienceSalary: [
                { years: 0, salary: 60000 },
                { years: 1, salary: 70000 },
                { years: 2, salary: 80000 },
                { years: 3, salary: 90000 },
                { years: 5, salary: 110000 },
                { years: 7, salary: 130000 },
                { years: 10, salary: 160000 }
            ]
        },

        "frontend": {
            careerPath: [
                {
                    step: 1,
                    title: 'Junior Frontend Developer',
                    description: 'Build UI components and learn core frontend technologies',
                    current: false
                },
                {
                    step: 2,
                    title: 'Mid-Level Frontend Developer',
                    description: 'Create complex UIs and implement advanced frontend patterns',
                    current: false
                },
                {
                    step: 3,
                    title: 'Senior Frontend Developer',
                    description: 'Lead frontend architecture and optimize performance',
                    current: false
                },
                {
                    step: 4,
                    title: 'Frontend Architect',
                    description: 'Design scalable frontend systems and establish best practices',
                    current: false
                }
            ],
            timeline: [
                {
                    date: 'First 3 months',
                    title: 'Master Core Frontend Technologies',
                    description: 'Deepen knowledge of HTML, CSS, JavaScript and frameworks',
                    skills: ['HTML5', 'CSS3', 'JavaScript', 'React Basics', 'Responsive Design']
                },
                {
                    date: 'Months 4-6',
                    title: 'Advanced Frontend Concepts',
                    description: 'Learn state management, testing, and optimization',
                    skills: ['TypeScript', 'Redux/Context API', 'Frontend Testing', 'Web Performance']
                },
                {
                    date: 'Months 7-12',
                    title: 'Frontend Architecture',
                    description: 'Build scalable frontend systems and explore advanced patterns',
                    skills: ['Design Systems', 'Micro-frontends', 'SSR/SSG', 'Web Accessibility', 'Frontend Security']
                }
            ],
            experienceSalary: [
                { years: 0, salary: 65000 },
                { years: 1, salary: 75000 },
                { years: 2, salary: 85000 },
                { years: 3, salary: 95000 },
                { years: 5, salary: 115000 },
                { years: 7, salary: 135000 },
                { years: 10, salary: 165000 }
            ]
        },

        "backend": {
            careerPath: [
                {
                    step: 1,
                    title: 'Junior Backend Developer',
                    description: 'Build APIs and services, learn database fundamentals',
                    current: false
                },
                {
                    step: 2,
                    title: 'Mid-Level Backend Developer',
                    description: 'Design complex backend systems and handle scale',
                    current: false
                },
                {
                    step: 3,
                    title: 'Senior Backend Developer',
                    description: 'Architect high-performance distributed systems',
                    current: false
                },
                {
                    step: 4,
                    title: 'Backend Architect',
                    description: 'Lead technical vision and design enterprise-scale systems',
                    current: false
                }
            ],
            timeline: [
                {
                    date: 'First 3 months',
                    title: 'Backend Fundamentals',
                    description: 'Master core backend technologies and concepts',
                    skills: ['API Design', 'Database Design', 'Authentication', 'Server Management']
                },
                {
                    date: 'Months 4-6',
                    title: 'Advanced Backend Development',
                    description: 'Learn about scaling, performance, and reliability',
                    skills: ['Caching Strategies', 'Message Queues', 'Microservices', 'Performance Testing']
                },
                {
                    date: 'Months 7-12',
                    title: 'Backend Architecture',
                    description: 'Design complex distributed systems',
                    skills: ['Distributed Systems', 'High Availability', 'Database Optimization', 'System Design Patterns']
                }
            ],
            experienceSalary: [
                { years: 0, salary: 70000 },
                { years: 1, salary: 80000 },
                { years: 2, salary: 90000 },
                { years: 3, salary: 105000 },
                { years: 5, salary: 125000 },
                { years: 7, salary: 145000 },
                { years: 10, salary: 175000 }
            ]
        },

        "fullstack": {
            careerPath: [
                {
                    step: 1,
                    title: 'Junior Full Stack Developer',
                    description: 'Build end-to-end features with guidance',
                    current: false
                },
                {
                    step: 2,
                    title: 'Mid-Level Full Stack Developer',
                    description: 'Implement complex features across the stack',
                    current: false
                },
                {
                    step: 3,
                    title: 'Senior Full Stack Developer',
                    description: 'Design and lead full product implementations',
                    current: false
                },
                {
                    step: 4,
                    title: 'Full Stack Architect',
                    description: 'Architect scalable systems and guide technical strategy',
                    current: false
                }
            ],
            timeline: [
                {
                    date: 'First 3 months',
                    title: 'Full Stack Foundations',
                    description: 'Strengthen skills across the entire technology stack',
                    skills: ['Frontend Frameworks', 'Backend APIs', 'Database Design', 'Authentication']
                },
                {
                    date: 'Months 4-6',
                    title: 'End-to-End Implementation',
                    description: 'Build complete features independently',
                    skills: ['State Management', 'Advanced Database', 'API Design', 'UI/UX Implementation']
                },
                {
                    date: 'Months 7-12',
                    title: 'Full Stack Architecture',
                    description: 'Design scalable end-to-end solutions',
                    skills: ['System Design', 'Performance Optimization', 'Security Best Practices', 'DevOps Integration']
                }
            ],
            experienceSalary: [
                { years: 0, salary: 75000 },
                { years: 1, salary: 85000 },
                { years: 2, salary: 95000 },
                { years: 3, salary: 110000 },
                { years: 5, salary: 130000 },
                { years: 7, salary: 150000 },
                { years: 10, salary: 180000 }
            ]
        },

        "devops": {
            careerPath: [
                {
                    step: 1,
                    title: 'Junior DevOps Engineer',
                    description: 'Learn CI/CD and infrastructure automation',
                    current: false
                },
                {
                    step: 2,
                    title: 'DevOps Engineer',
                    description: 'Implement robust pipelines and infrastructure as code',
                    current: false
                },
                {
                    step: 3,
                    title: 'Senior DevOps Engineer',
                    description: 'Design scalable infrastructure and optimize operations',
                    current: false
                },
                {
                    step: 4,
                    title: 'DevOps Architect',
                    description: 'Define cloud strategy and lead organizational transformation',
                    current: false
                }
            ],
            timeline: [
                {
                    date: 'First 3 months',
                    title: 'DevOps Fundamentals',
                    description: 'Master core DevOps tools and practices',
                    skills: ['CI/CD Pipelines', 'Infrastructure as Code', 'Containerization', 'Cloud Platforms']
                },
                {
                    date: 'Months 4-6',
                    title: 'Advanced DevOps',
                    description: 'Implement complex automation and monitoring',
                    skills: ['Kubernetes', 'Cloud Architecture', 'Observability', 'Security Automation']
                },
                {
                    date: 'Months 7-12',
                    title: 'DevOps Leadership',
                    description: 'Optimize infrastructure and guide best practices',
                    skills: ['Multi-cloud Strategy', 'Cost Optimization', 'Disaster Recovery', 'Site Reliability Engineering']
                }
            ],
            experienceSalary: [
                { years: 0, salary: 75000 },
                { years: 1, salary: 85000 },
                { years: 2, salary: 100000 },
                { years: 3, salary: 115000 },
                { years: 5, salary: 135000 },
                { years: 7, salary: 155000 },
                { years: 10, salary: 185000 }
            ]
        },

        "data": {
            careerPath: [
                {
                    step: 1,
                    title: 'Junior Data Scientist',
                    description: 'Apply statistical methods and build basic models',
                    current: false
                },
                {
                    step: 2,
                    title: 'Data Scientist',
                    description: 'Develop sophisticated models and extract actionable insights',
                    current: false
                },
                {
                    step: 3,
                    title: 'Senior Data Scientist',
                    description: 'Lead data initiatives and design complex models',
                    current: false
                },
                {
                    step: 4,
                    title: 'Principal Data Scientist / AI Architect',
                    description: 'Define AI strategy and pioneer innovative solutions',
                    current: false
                }
            ],
            timeline: [
                {
                    date: 'First 3 months',
                    title: 'Data Science Foundations',
                    description: 'Strengthen core statistical and programming skills',
                    skills: ['Python for Data Science', 'Statistical Analysis', 'Data Visualization', 'Data Cleaning']
                },
                {
                    date: 'Months 4-6',
                    title: 'Advanced ML Techniques',
                    description: 'Master machine learning algorithms and model building',
                    skills: ['Machine Learning', 'Deep Learning', 'Feature Engineering', 'Model Evaluation']
                },
                {
                    date: 'Months 7-12',
                    title: 'End-to-End Data Science',
                    description: 'Build production-ready ML systems',
                    skills: ['MLOps', 'Data Engineering', 'Experiment Tracking', 'Model Deployment']
                }
            ],
            experienceSalary: [
                { years: 0, salary: 85000 },
                { years: 1, salary: 95000 },
                { years: 2, salary: 110000 },
                { years: 3, salary: 125000 },
                { years: 5, salary: 145000 },
                { years: 7, salary: 165000 },
                { years: 10, salary: 195000 }
            ]
        },

        "mobile": {
            careerPath: [
                {
                    step: 1,
                    title: 'Junior Mobile Developer',
                    description: 'Build UI components and implement basic features',
                    current: false
                },
                {
                    step: 2,
                    title: 'Mobile Developer',
                    description: 'Create complete apps and optimize mobile performance',
                    current: false
                },
                {
                    step: 3,
                    title: 'Senior Mobile Developer',
                    description: 'Architect complex mobile apps and lead development',
                    current: false
                },
                {
                    step: 4,
                    title: 'Mobile Architect',
                    description: 'Define mobile strategy and platform-wide standards',
                    current: false
                }
            ],
            timeline: [
                {
                    date: 'First 3 months',
                    title: 'Mobile Fundamentals',
                    description: 'Master platform-specific and cross-platform development',
                    skills: ['iOS or Android Fundamentals', 'UI Development', 'Mobile Architecture', 'API Integration']
                },
                {
                    date: 'Months 4-6',
                    title: 'Advanced Mobile Development',
                    description: 'Implement complex features and optimize performance',
                    skills: ['State Management', 'Offline Support', 'Push Notifications', 'Performance Optimization']
                },
                {
                    date: 'Months 7-12',
                    title: 'Mobile Architecture',
                    description: 'Design scalable mobile applications',
                    skills: ['Cross-platform Strategy', 'CI/CD for Mobile', 'App Store Optimization', 'Enterprise Mobile Architecture']
                }
            ],
            experienceSalary: [
                { years: 0, salary: 70000 },
                { years: 1, salary: 80000 },
                { years: 2, salary: 95000 },
                { years: 3, salary: 110000 },
                { years: 5, salary: 130000 },
                { years: 7, salary: 150000 },
                { years: 10, salary: 180000 }
            ]
        },

        "ui/ux": {
            careerPath: [
                {
                    step: 1,
                    title: 'Junior UI/UX Designer',
                    description: 'Create UI components and learn design principles',
                    current: false
                },
                {
                    step: 2,
                    title: 'UI/UX Designer',
                    description: 'Design complete experiences and conduct user research',
                    current: false
                },
                {
                    step: 3,
                    title: 'Senior UI/UX Designer',
                    description: 'Lead design systems and complex product experiences',
                    current: false
                },
                {
                    step: 4,
                    title: 'UX Director / Design Lead',
                    description: 'Define design strategy and direct user experience vision',
                    current: false
                }
            ],
            timeline: [
                {
                    date: 'First 3 months',
                    title: 'Design Fundamentals',
                    description: 'Strengthen core design skills and tools',
                    skills: ['UI Principles', 'Wireframing', 'Prototyping', 'Design Tools (Figma/Sketch)']
                },
                {
                    date: 'Months 4-6',
                    title: 'UX Research & Testing',
                    description: 'Incorporate user-centered design methodologies',
                    skills: ['User Research', 'Usability Testing', 'Information Architecture', 'Interaction Design']
                },
                {
                    date: 'Months 7-12',
                    title: 'Advanced Design Systems',
                    description: 'Create scalable design systems and guide implementation',
                    skills: ['Design Systems', 'Accessibility', 'Design Leadership', 'Design Ops']
                }
            ],
            experienceSalary: [
                { years: 0, salary: 65000 },
                { years: 1, salary: 75000 },
                { years: 2, salary: 90000 },
                { years: 3, salary: 105000 },
                { years: 5, salary: 125000 },
                { years: 7, salary: 145000 },
                { years: 10, salary: 170000 }
            ]
        }
    }
};