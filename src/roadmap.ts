export type RoadmapSkill = {
  name: string
  priority: 'Core' | 'Useful' | 'Stretch'
  explanation: string
}

export type RoadmapPhase = {
  title: string
  objective: string
  topics: string[]
  tools: string[]
  exercise: string
  duration: string
  outcome: string
  prerequisite: string
  resource: { label: string; url: string }
}

export type RoadmapProject = {
  title: string
  problem: string
  stack: string[]
  features: string[]
  skills: string[]
  difficulty: string
  resumeLine: string
}

export type CompanyTextMatch = { skillName: string; phrase: string }

export type CareerRoadmap = {
  company: string
  role: string
  family: string
  overview: string
  responsibilities: string[]
  entryRequirements: string[]
  companyEvidence: CompanyTextMatch[]
  sourceUrl: string
  sourceStatus: string
  roleSkills: RoadmapSkill[]
  phases: RoadmapPhase[]
  projects: RoadmapProject[]
  interviewTopics: string[]
  resumeKeywords: string[]
  existingSkills: string[]
  priorityGaps: string[]
  coverage: number
  coverageLabel: string
  durationMonths: number
  experience: string
}

const companySuggestions = [
  'Capgemini', 'Accenture', 'Deloitte', 'TCS', 'Infosys', 'Wipro', 'Cognizant', 'IBM',
  'Microsoft', 'Google', 'Amazon', 'Adobe', 'Oracle', 'SAP', 'Salesforce', 'NVIDIA',
  'Apple', 'Meta', 'Netflix', 'Atlassian', 'Stripe', 'ServiceNow', 'JPMorgan Chase',
  'Goldman Sachs', 'Siemens', 'Bosch', 'Cisco', 'Uber', 'Airbnb', 'A startup',
]

const roleSuggestions = [
  'Software Development Engineer (SDE)', 'Software Engineer', 'Associate Software Engineer', 'Graduate Software Engineer',
  'Full-Stack Developer', 'Frontend Developer', 'Backend Developer', 'Web Developer', 'Mobile Application Developer',
  'Android Developer', 'iOS Developer', 'Java Developer', 'Python Developer', 'C++ Developer', '.NET Developer',
  'React Developer', 'Node.js Developer', 'Application Developer', 'Systems Engineer', 'Embedded Software Engineer',
  'Firmware Engineer', 'Game Developer', 'API Developer', 'Platform Engineer', 'Software Architect',
  'AI Engineer', 'Machine Learning Engineer', 'AI/ML Engineer', 'Generative AI Engineer', 'Applied AI Engineer',
  'Deep Learning Engineer', 'NLP Engineer', 'Computer Vision Engineer', 'Data Scientist', 'Research Scientist',
  'AI Research Engineer', 'LLM Engineer', 'Prompt Engineer', 'AI Agent Engineer', 'MLOps Engineer',
  'AI Solutions Architect', 'Robotics Software Engineer', 'Reinforcement Learning Engineer', 'Speech Recognition Engineer',
  'AI Product Engineer', 'Data Analyst', 'Business Analyst', 'Business Intelligence Analyst', 'BI Developer',
  'Business Intelligence Engineer', 'Data Engineer', 'Analytics Engineer', 'Big Data Engineer', 'Product Analyst',
  'Marketing Analyst', 'Financial Data Analyst', 'Operations Analyst', 'Risk Analyst', 'Reporting Analyst', 'MIS Executive',
  'Database Developer', 'Database Administrator', 'SQL Developer', 'Quantitative Analyst', 'Decision Scientist',
  'Cloud Engineer', 'Cloud Developer', 'Cloud Architect', 'DevOps Engineer', 'Site Reliability Engineer',
  'Infrastructure Engineer', 'Kubernetes Engineer', 'AWS Engineer', 'Azure Engineer', 'Google Cloud Engineer',
  'Systems Administrator', 'Linux Engineer', 'Network Engineer', 'Network Architect', 'Release Engineer',
  'Build Engineer', 'Infrastructure Automation Engineer', 'Cybersecurity Analyst', 'Security Engineer',
  'Information Security Analyst', 'SOC Analyst', 'Penetration Tester', 'Ethical Hacker', 'Application Security Engineer',
  'Cloud Security Engineer', 'Security Operations Engineer', 'Incident Response Analyst', 'Digital Forensics Analyst',
  'Vulnerability Management Analyst', 'Security Architect', 'Governance, Risk, and Compliance Analyst',
  'Identity and Access Management Engineer', 'QA Engineer', 'Quality Assurance Analyst', 'Software Test Engineer',
  'Manual Tester', 'Automation Test Engineer', 'SDET', 'Performance Test Engineer', 'API Test Engineer',
  'Mobile Application Tester', 'Security Test Engineer', 'Test Automation Architect', 'Quality Engineering Analyst',
  'Embedded Systems Engineer', 'IoT Engineer', 'Firmware Developer', 'Electronics Engineer', 'Hardware Design Engineer',
  'VLSI Engineer', 'RTL Design Engineer', 'Verification Engineer', 'FPGA Engineer', 'Robotics Engineer',
  'Control Systems Engineer', 'Automotive Software Engineer', 'AUTOSAR Developer', 'Semiconductor Engineer',
  'PCB Design Engineer', 'Embedded AI Engineer', 'Product Manager', 'Associate Product Manager',
  'Technical Product Manager', 'Project Manager', 'Technical Project Manager', 'Program Manager', 'Scrum Master',
  'Product Owner', 'Delivery Manager', 'Engineering Manager', 'Technical Program Manager',
  'Product Operations Analyst', 'Project Coordinator', 'Technology Consultant', 'Business Consultant',
  'Management Consultant', 'IT Consultant', 'Strategy Analyst', 'Business Operations Analyst', 'Operations Associate',
  'Process Analyst', 'Supply Chain Analyst', 'ERP Consultant', 'SAP Consultant', 'Salesforce Consultant',
  'Digital Transformation Consultant', 'Functional Consultant', 'Enterprise Solutions Consultant',
  'Implementation Consultant', 'UI Designer', 'UX Designer', 'UI/UX Designer', 'Product Designer', 'UX Researcher',
  'Interaction Designer', 'Visual Designer', 'Graphic Designer', 'Design Systems Designer', 'UX Engineer',
  'Web Designer', 'Motion Designer', 'Financial Analyst', 'Investment Analyst', 'Credit Analyst', 'FinTech Engineer',
  'Quantitative Developer', 'Quantitative Researcher', 'Fraud Analyst', 'Compliance Analyst', 'Payments Engineer',
  'Blockchain Developer', 'Smart Contract Developer', 'Technical Sales Engineer', 'Sales Engineer', 'Solutions Engineer',
  'Solutions Architect', 'Pre-Sales Consultant', 'Customer Success Manager', 'Customer Success Engineer',
  'Technical Account Manager', 'Digital Marketing Analyst', 'SEO Analyst', 'Growth Analyst',
  'Marketing Automation Specialist', 'CRM Specialist', 'Business Development Associate', 'Account Manager',
  'Blockchain Engineer', 'AR/VR Developer', 'Spatial Computing Engineer', 'Quantum Computing Researcher',
  'Research Engineer', 'Technical Writer', 'Developer Advocate', 'Developer Relations Engineer',
  'API Documentation Specialist', 'IT Support Engineer', 'Application Support Engineer', 'Technical Support Engineer',
  'Database Reliability Engineer', 'Data Governance Analyst', 'Responsible AI Specialist', 'AI Safety Engineer',
  'Privacy Engineer', 'Sustainability Data Analyst', 'Geospatial Data Analyst', 'Bioinformatics Engineer',
  'Teacher', 'Nurse', 'Research Assistant', 'Human Resources Specialist', 'Recruiter', 'Accountant', 'Attorney',
  'Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Architect', 'Operations Manager',
]

type DomainProfile = {
  family: string
  overview: string
  responsibilities: string[]
  requirements: string[]
  skills: RoadmapSkill[]
  projects: [string, string, string]
  interview: string[]
  resource: { label: string; url: string }
}

const skill = (name: string, priority: RoadmapSkill['priority'], explanation: string): RoadmapSkill => ({ name, priority, explanation })

const profiles: Record<string, DomainProfile> = {
  ai: {
    family: 'AI and machine learning',
    overview: 'Builds, evaluates, and integrates models or AI-enabled product features. The exact balance of research, software engineering, and deployment varies by team and seniority.',
    responsibilities: ['Prepare data and define measurable problems', 'Train, evaluate, or integrate models', 'Build reliable interfaces and explain trade-offs'],
    requirements: ['Programming fundamentals and quantitative reasoning', 'Evidence of a role-relevant project', 'Clear communication of model limits and results'],
    skills: [skill('Python', 'Core', 'Common language for data work and model tooling.'), skill('Data structures and algorithms', 'Useful', 'A practical foundation for writing efficient, understandable code.'), skill('Statistics and probability', 'Core', 'Supports sound evaluation and interpretation.'), skill('Linear algebra', 'Core', 'Helps explain vectors, matrices, and model operations.'), skill('SQL and data preparation', 'Core', 'Useful for accessing and validating real datasets.'), skill('NumPy and pandas', 'Core', 'Common foundations for practical data workflows.'), skill('Machine learning fundamentals', 'Core', 'Understand baselines, training, validation, and leakage.'), skill('Scikit-learn', 'Useful', 'A practical toolkit for classical ML experiments.'), skill('PyTorch or TensorFlow', 'Useful', 'Choose one deep-learning framework and build depth.'), skill('Model evaluation and testing', 'Core', 'Measure performance, errors, and limitations.'), skill('REST APIs and Git', 'Useful', 'Connect model work to usable software.'), skill('Docker and cloud deployment', 'Useful', 'Package and deploy a model service; choose a provider based on target-role evidence.'), skill('MLOps and monitoring', 'Stretch', 'Monitoring and reproducibility matter in production settings.'), skill('LLMs, retrieval, and vector search', 'Stretch', 'Relevant to some generative-AI roles, not all AI jobs.')],
    projects: ['Build a transparent prediction baseline for a public dataset', 'Create a retrieval-based assistant over a small licensed document set', 'Deploy a model API with tests, monitoring notes, and a model card'],
    interview: ['Python and data structures appropriate to level', 'Statistics, validation, leakage, and evaluation metrics', 'Model and project trade-offs; failure analysis', 'ML system design for experienced roles', 'Behavioral examples using Situation, Task, Action, Result'],
    resource: { label: 'scikit-learn getting started', url: 'https://scikit-learn.org/stable/getting_started.html' },
  },
  software: {
    family: 'software engineering',
    overview: 'Designs, builds, tests, and maintains software. The best language and architecture depend on the product and job description; no employer stack is assumed here.',
    responsibilities: ['Turn requirements into maintainable software', 'Test, debug, review, and document changes', 'Collaborate across a delivery lifecycle'],
    requirements: ['One programming language used with confidence', 'Data structures, debugging, and version control', 'A project that shows tested, explainable decisions'],
    skills: [skill('Programming language for the role', 'Core', 'Choose the language indicated by the target listing; custom roles may vary.'), skill('Data structures and algorithms', 'Core', 'Builds problem-solving fluency for many engineering interviews.'), skill('Git and code review', 'Core', 'Supports collaborative change history.'), skill('Testing and debugging', 'Core', 'Shows reliability beyond a happy-path demo.'), skill('HTTP, APIs, and data formats', 'Useful', 'Connects applications and services.'), skill('SQL and data modeling', 'Useful', 'Common when products persist structured data.'), skill('System design fundamentals', 'Stretch', 'Scale depth to the level and role.'), skill('Accessibility and security basics', 'Useful', 'Important quality dimensions for shipped software.')],
    projects: ['Build a small full-stack workflow tool with tests', 'Integrate a public API and document edge cases', 'Improve an open-source issue or add an accessibility feature'],
    interview: ['Language fundamentals and problem solving', 'Testing, debugging, APIs, and data structures', 'Explain design decisions and project trade-offs', 'System design for experienced roles', 'Behavioral examples using Situation, Task, Action, Result'],
    resource: { label: 'MDN Web Docs', url: 'https://developer.mozilla.org/' },
  },
  data: {
    family: 'data and analytics',
    overview: 'Turns data into reliable analysis, reporting, models, or decisions. Tool choices depend on the employer, datasets, and whether the role is analytics, engineering, or science.',
    responsibilities: ['Query, clean, and validate data', 'Choose metrics and investigate patterns', 'Communicate findings with useful caveats'],
    requirements: ['SQL and data-quality habits', 'Basic statistics and structured reasoning', 'A clear analysis with a reproducible result'],
    skills: [skill('SQL', 'Core', 'A practical foundation for querying relational data.'), skill('Spreadsheets', 'Core', 'Useful for quick inspection and stakeholder workflows.'), skill('Statistics and measurement', 'Core', 'Helps distinguish signal from noise.'), skill('Data visualization', 'Core', 'Makes comparisons and uncertainty legible.'), skill('Python or R', 'Useful', 'Automates repeatable analysis when appropriate.'), skill('Data modeling and quality', 'Useful', 'Keeps definitions and transformations reliable.'), skill('Business communication', 'Core', 'Connects analysis to a decision.'), skill('Cloud data platforms', 'Stretch', 'Learn a platform when a target description names one.')],
    projects: ['Analyze an open dataset and publish a reproducible notebook', 'Create a metric dashboard with definitions and caveats', 'Build a small ETL pipeline with data-quality checks'],
    interview: ['SQL joins, aggregation, window functions, and data quality', 'Statistics, experiments, and metric selection', 'Explain an analysis and its limitations', 'Business case and stakeholder communication', 'Behavioral examples using Situation, Task, Action, Result'],
    resource: { label: 'Kaggle Learn', url: 'https://www.kaggle.com/learn' },
  },
  cloud: {
    family: 'cloud, DevOps, and infrastructure',
    overview: 'Automates and operates dependable systems, platforms, or cloud workloads. Provider-specific tools should be learned only when a relevant listing or project gives a reason.',
    responsibilities: ['Automate infrastructure and delivery workflows', 'Observe system health and respond to incidents', 'Balance reliability, security, and cost'],
    requirements: ['Linux, networking, and scripting basics', 'Version control and automation', 'Hands-on deployment with operational notes'],
    skills: [skill('Linux and shell scripting', 'Core', 'A strong base for operating compute environments.'), skill('Networking and HTTP', 'Core', 'Explains connectivity, routing, and service behavior.'), skill('Git and CI/CD', 'Core', 'Supports repeatable software delivery.'), skill('Containers', 'Useful', 'Package services consistently for deployment.'), skill('Cloud fundamentals', 'Core', 'Choose AWS, Azure, or Google Cloud based on target evidence.'), skill('Infrastructure as code', 'Useful', 'Makes environments reviewable and repeatable.'), skill('Monitoring and incident response', 'Core', 'Reliability depends on observability and learning from failure.'), skill('Kubernetes', 'Stretch', 'Relevant to some platform roles; not a default requirement.')],
    projects: ['Deploy a monitored service with a documented recovery test', 'Automate a repeatable cloud environment with infrastructure as code', 'Create a CI pipeline with tests, security checks, and deployment'],
    interview: ['Linux, networking, processes, and scripting', 'CI/CD, containers, and infrastructure choices', 'Reliability, monitoring, and incident scenarios', 'Cloud architecture scaled to experience', 'Behavioral examples using Situation, Task, Action, Result'],
    resource: { label: 'AWS Cloud Practitioner Essentials', url: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/' },
  },
  security: {
    family: 'cybersecurity',
    overview: 'Reduces security risk through prevention, detection, response, assurance, or secure engineering. Choose a path such as SOC, application security, or GRC based on the actual role.',
    responsibilities: ['Identify and communicate security risks', 'Apply controls or investigate signals within authorization', 'Document findings and remediation clearly'],
    requirements: ['Networking, operating system, and security fundamentals', 'Ethical practice and explicit authorization', 'Clear incident or assessment documentation'],
    skills: [skill('Networking and operating systems', 'Core', 'Foundational context for systems and security signals.'), skill('Security principles and threat modeling', 'Core', 'Helps reason about assets, threats, and controls.'), skill('Scripting and log analysis', 'Useful', 'Automates repeat work and helps investigate events.'), skill('Identity and access management', 'Useful', 'Controls who can access which resources.'), skill('Secure coding and web security', 'Useful', 'Relevant to application security paths.'), skill('Incident response', 'Core', 'Practice a structured, evidence-led response.'), skill('Cloud security', 'Stretch', 'Prioritize when the role or environment points to cloud.'), skill('Governance and risk', 'Stretch', 'Important for assurance and compliance roles.')],
    projects: ['Create a threat model and mitigations for a sample application', 'Analyze a public, sanitized security log dataset', 'Build a secure-by-default service with a documented test plan'],
    interview: ['Networking, operating systems, and security fundamentals', 'Role-specific incident, application, or risk scenarios', 'Ethics, authorization, evidence handling, and communication', 'Explain a finding and prioritize remediation', 'Behavioral examples using Situation, Task, Action, Result'],
    resource: { label: 'OWASP Web Security Testing Guide', url: 'https://owasp.org/www-project-web-security-testing-guide/' },
  },
  quality: {
    family: 'software quality and testing',
    overview: 'Checks that software behaves as intended and helps teams prevent regressions. Automation depth and test layers depend on the role.',
    responsibilities: ['Translate requirements into testable behavior', 'Find and report defects with reproducible steps', 'Automate valuable checks and communicate risk'],
    requirements: ['Structured test thinking and clear writing', 'Basic programming or query skills for automation', 'Evidence of thoughtful test coverage'],
    skills: [skill('Test design and exploratory testing', 'Core', 'Finds edge cases beyond scripted happy paths.'), skill('Programming fundamentals', 'Core', 'Enables maintainable test automation.'), skill('API and HTTP testing', 'Useful', 'Tests service behavior at a stable boundary.'), skill('Automation framework', 'Useful', 'Choose one based on target role evidence.'), skill('SQL and data validation', 'Useful', 'Checks persistence and data correctness.'), skill('CI and test reporting', 'Useful', 'Makes quality feedback repeatable.'), skill('Performance or security testing', 'Stretch', 'Specialize when the job calls for it.')],
    projects: ['Build a test suite for an open-source or sample application', 'Create API tests that cover validation and failure cases', 'Document a risk-based test plan and automate its highest-value checks'],
    interview: ['Test design, boundaries, and risk prioritization', 'Automation and maintainable test structure', 'API, database, and debugging fundamentals', 'Explain a defect report and its impact', 'Behavioral examples using Situation, Task, Action, Result'],
    resource: { label: 'Playwright documentation', url: 'https://playwright.dev/docs/intro' },
  },
  design: {
    family: 'design and user experience',
    overview: 'Improves how people understand and use a product through research, interaction, visual design, or implementation. Portfolio work should show decisions and iteration, not only polished screens.',
    responsibilities: ['Understand user needs and constraints', 'Explore and test interaction or visual solutions', 'Explain decisions and collaborate with delivery teams'],
    requirements: ['A clear process and accessible design fundamentals', 'A portfolio with problem, decisions, and outcomes', 'Communication and collaboration'],
    skills: [skill('User research and synthesis', 'Core', 'Grounds design in observed needs rather than assumptions.'), skill('Interaction and information architecture', 'Core', 'Makes flows and content understandable.'), skill('Visual design and typography', 'Useful', 'Supports hierarchy and clarity.'), skill('Prototyping and usability testing', 'Core', 'Tests assumptions before delivery.'), skill('Accessibility', 'Core', 'Makes experiences usable across abilities.'), skill('Design systems', 'Useful', 'Supports consistency and reuse.'), skill('HTML and CSS', 'Stretch', 'Useful for UX engineering and implementation-heavy roles.')],
    projects: ['Audit and redesign a real flow with accessibility notes', 'Prototype and test a task flow with a small volunteer group', 'Document a reusable component with states and usage guidance'],
    interview: ['Walk through a case study and trade-offs', 'Research methods, synthesis, and uncertainty', 'Accessibility and interaction details', 'Collaboration and handling feedback', 'Behavioral examples using Situation, Task, Action, Result'],
    resource: { label: 'W3C Web Accessibility Initiative', url: 'https://www.w3.org/WAI/fundamentals/' },
  },
  product: {
    family: 'product, project, and program management',
    overview: 'Aligns people around user and business outcomes, prioritizes work, and helps teams deliver. The scope differs across product, project, program, and delivery titles.',
    responsibilities: ['Understand users and define a problem', 'Prioritize outcomes, constraints, and delivery steps', 'Communicate decisions and measure results'],
    requirements: ['Structured problem solving and clear communication', 'Evidence of coordinating work or making trade-offs', 'Comfort with metrics and ambiguity'],
    skills: [skill('Problem framing and discovery', 'Core', 'Clarifies who has a problem and why it matters.'), skill('Prioritization and roadmapping', 'Core', 'Makes trade-offs visible against outcomes.'), skill('Metrics and experimentation', 'Useful', 'Supports learning without overclaiming causality.'), skill('Project planning and risk', 'Core', 'Helps coordinate dependencies and execution.'), skill('Stakeholder communication', 'Core', 'Makes context and decisions understandable.'), skill('Technical fluency', 'Useful', 'Helps collaborate with engineering teams.'), skill('User research', 'Useful', 'Provides evidence for product decisions.')],
    projects: ['Write a concise product brief with assumptions and success measures', 'Map a service workflow and propose a testable improvement', 'Coordinate a small project with scope, risks, and a retrospective'],
    interview: ['Product sense or role-specific case exercises', 'Prioritization, metrics, and trade-offs', 'Execution, dependencies, and stakeholder alignment', 'Project examples with measurable, truthful outcomes', 'Behavioral examples using Situation, Task, Action, Result'],
    resource: { label: 'Atlassian Agile Coach', url: 'https://www.atlassian.com/agile' },
  },
  business: {
    family: 'business, consulting, and operations',
    overview: 'Studies processes or business problems, develops recommendations, and helps implement change. Industry context and analytical tools vary by employer and practice.',
    responsibilities: ['Structure an ambiguous problem', 'Analyze information and validate assumptions', 'Present practical recommendations and next steps'],
    requirements: ['Clear written and verbal communication', 'Evidence-led analysis and spreadsheet fluency', 'A structured approach to a business case'],
    skills: [skill('Structured problem solving', 'Core', 'Breaks broad questions into testable components.'), skill('Excel or spreadsheets', 'Core', 'Supports practical analysis and modeling.'), skill('Data interpretation', 'Core', 'Connects metrics to decisions and caveats.'), skill('Presentation and writing', 'Core', 'Makes recommendations usable by stakeholders.'), skill('Process mapping', 'Useful', 'Surfaces handoffs and improvement opportunities.'), skill('SQL or BI tools', 'Stretch', 'Prioritize when the target description is analytical.'), skill('Industry context', 'Useful', 'Research the specific market and operating model.')],
    projects: ['Map a public service or business process and quantify a bottleneck', 'Analyze a public business dataset and write a decision memo', 'Build a simple operating model with clearly stated assumptions'],
    interview: ['Structured case and estimation practice where relevant', 'Spreadsheet, data, and business fundamentals', 'Recommendation synthesis and presentation', 'Teamwork and handling incomplete information', 'Behavioral examples using Situation, Task, Action, Result'],
    resource: { label: 'Khan Academy statistics', url: 'https://www.khanacademy.org/math/statistics-probability' },
  },
  finance: {
    family: 'finance, banking, and fintech',
    overview: 'Supports financial analysis, risk decisions, transactions, or financial technology. Technical and regulatory requirements depend heavily on the specific job and jurisdiction.',
    responsibilities: ['Analyze financial or operational information', 'Explain assumptions, risk, and uncertainty', 'Maintain accuracy and appropriate controls'],
    requirements: ['Quantitative and spreadsheet fluency', 'Careful documentation and attention to detail', 'Relevant accounting, finance, or software fundamentals'],
    skills: [skill('Excel and financial modeling', 'Core', 'A common tool for structured financial analysis.'), skill('Accounting and finance basics', 'Core', 'Builds fluency in statements and financial concepts.'), skill('Statistics and quantitative reasoning', 'Useful', 'Supports measurement and risk analysis.'), skill('SQL and data quality', 'Useful', 'Relevant to data-heavy finance and fintech work.'), skill('Risk and controls', 'Core', 'Makes assumptions, exposure, and governance explicit.'), skill('Programming', 'Stretch', 'Prioritize Python or another language for quantitative or fintech roles.'), skill('Regulatory context', 'Useful', 'Research the jurisdiction and actual position requirements.')],
    projects: ['Build a transparent financial statement analysis from public filings', 'Create a small risk model with documented assumptions and limits', 'Analyze an open payments or market dataset with reproducible steps'],
    interview: ['Accounting, finance, and quantitative fundamentals', 'Excel/modeling or coding tasks aligned to the role', 'Risk, controls, and assumption checks', 'Explain an analysis and its limitations', 'Behavioral examples using Situation, Task, Action, Result'],
    resource: { label: 'Khan Academy finance and capital markets', url: 'https://www.khanacademy.org/economics-finance-domain/core-finance' },
  },
  marketing: {
    family: 'sales, marketing, and customer success',
    overview: 'Connects a product or service to customer needs through communication, growth, sales, or ongoing support. Goals and tools vary by channel and employer.',
    responsibilities: ['Understand the audience and their needs', 'Plan or support relevant communication and activity', 'Measure outcomes and improve from feedback'],
    requirements: ['Clear communication and customer empathy', 'Evidence of audience-focused work', 'Comfort interpreting goals and feedback'],
    skills: [skill('Audience and customer research', 'Core', 'Helps ground messaging in real needs.'), skill('Written and verbal communication', 'Core', 'Supports content, discovery, and customer conversations.'), skill('Campaign or account planning', 'Useful', 'Organizes activity around audience and goal.'), skill('Analytics and measurement', 'Core', 'Tracks outcomes without confusing correlation and causation.'), skill('CRM and workflow tools', 'Useful', 'Learn a tool when the target description mentions one.'), skill('Presentation and storytelling', 'Core', 'Makes value and recommendations clear.'), skill('Experimentation', 'Stretch', 'Useful for testing messages and channels carefully.')],
    projects: ['Plan a small campaign for a real community need with measurable goals', 'Analyze a public marketing dataset and explain limitations', 'Create customer onboarding content and test it with volunteers'],
    interview: ['Audience understanding and role-specific scenarios', 'Campaign, pipeline, or customer outcome measurement', 'Communication, objection handling, and collaboration', 'A project example with truthful results', 'Behavioral examples using Situation, Task, Action, Result'],
    resource: { label: 'Google Analytics Skillshop', url: 'https://skillshop.withgoogle.com/' },
  },
  hardware: {
    family: 'embedded, hardware, and electronics',
    overview: 'Develops software or hardware that interacts with physical devices. The right languages, tools, and standards depend on the target subfield and safety context.',
    responsibilities: ['Design or test components under real constraints', 'Debug interactions between software and hardware', 'Document performance, reliability, and safety trade-offs'],
    requirements: ['Relevant engineering fundamentals', 'Careful testing and documentation', 'A demonstrable build or simulation project'],
    skills: [skill('C or C++ fundamentals', 'Core', 'Common in constrained or performance-sensitive environments.'), skill('Digital and computer architecture', 'Core', 'Explains how software maps to hardware.'), skill('Electronics and interfaces', 'Useful', 'Prioritize for electronics and IoT roles.'), skill('Debugging and test equipment', 'Core', 'Measure system behavior rather than guess.'), skill('Real-time and safety concepts', 'Useful', 'Important when timing or safety is critical.'), skill('Version control and build tools', 'Useful', 'Makes embedded workflows reproducible.'), skill('Domain standards', 'Stretch', 'Learn only the standards relevant to the target role.')],
    projects: ['Build a sensor logger with documented calibration and error handling', 'Write a small embedded driver with repeatable tests', 'Simulate and document a control or communication subsystem'],
    interview: ['Programming, systems, and hardware fundamentals', 'Debugging from observed symptoms', 'Timing, reliability, and safety trade-offs', 'Walk through a measured project and test results', 'Behavioral examples using Situation, Task, Action, Result'],
    resource: { label: 'Arduino documentation', url: 'https://docs.arduino.cc/' },
  },
  generic: {
    family: 'custom or cross-disciplinary role',
    overview: 'This title is not mapped to a narrow preset. The plan uses the entered title, your supplied job description, and broadly useful role skills; refine it with an actual posting for better relevance.',
    responsibilities: ['Translate the target title into concrete work from a job description', 'Identify tools and outcomes mentioned in the posting', 'Build and explain a small, role-relevant piece of evidence'],
    requirements: ['Understand the core vocabulary of the role', 'Practise one central task from the target job', 'Document decisions, learning, and limitations'],
    skills: [skill('Role fundamentals', 'Core', 'Use the target description to identify the central knowledge area.'), skill('Problem solving', 'Core', 'Break the work into steps and validate assumptions.'), skill('Communication', 'Core', 'Explain decisions and results to another person.'), skill('Digital and data fluency', 'Useful', 'Select tools based on the tasks named in the job description.'), skill('Project execution', 'Useful', 'Complete a small artifact that demonstrates the target work.'), skill('Ethics and domain context', 'Useful', 'Consider the impact and constraints of the field.')],
    projects: ['Recreate a small task or deliverable described in a target listing', 'Solve a real, bounded problem from the relevant field and document your method', 'Interview a practitioner only with consent and turn learning into a short reflection'],
    interview: ['Core concepts named in the actual role description', 'A role-relevant scenario or work sample', 'Explain a project, decisions, and lessons learned', 'Communication and collaboration examples', 'Behavioral examples using Situation, Task, Action, Result'],
    resource: { label: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/' },
  },
}

function profileFor(role: string): DomainProfile {
  const title = role.toLocaleLowerCase()
  if (/machine learning|\bai\b|artificial intelligence|llm|generative ai|nlp|computer vision|data scientist|mlops|prompt engineer|research scientist|bioinformatic/.test(title)) return profiles.ai
  if (/cyber|security|soc analyst|penetration|ethical hacker|forensic|vulnerability|identity and access|privacy engineer|grc/.test(title)) return profiles.security
  if (/cloud|devops|site reliability|infrastructure|kubernetes|network engineer|systems administrator|linux engineer|release engineer|build engineer/.test(title)) return profiles.cloud
  if (/quality|qa |qa engineer|tester|test engineer|sdet|automation test/.test(title)) return profiles.quality
  if (/embedded|firmware|electronics|hardware|vlsi|rtl|fpga|robotics|control systems|autosar|semiconductor|pcb|iot engineer/.test(title)) return profiles.hardware
  if (/data analyst|business analyst|business intelligence|\bbi developer|data engineer|analytics engineer|big data|product analyst|marketing analyst|financial data|operations analyst|risk analyst|reporting analyst|mis executive|database|sql developer|quantitative|decision scientist|data governance|geospatial/.test(title)) return profiles.data
  if (/ux|ui |ui\/ux|designer|design systems|visual designer|graphic designer|motion designer|interaction designer/.test(title)) return profiles.design
  if (/product manager|project manager|program manager|scrum master|product owner|delivery manager|engineering manager|project coordinator|product operations/.test(title)) return profiles.product
  if (/financial|investment analyst|credit analyst|fintech|quantitative developer|fraud analyst|compliance analyst|payments engineer|blockchain|smart contract/.test(title)) return profiles.finance
  if (/marketing|sales|customer success|account manager|business development|seo analyst|growth analyst|crm specialist|sales engineer|solutions engineer|technical account|pre-sales/.test(title)) return profiles.marketing
  if (/consultant|strategy analyst|business operations|operations associate|process analyst|supply chain|implementation consultant|technical writer|developer advocate|support engineer|teacher|nurse|recruiter|human resources|accountant|attorney|civil engineer|mechanical engineer|electrical engineer|architect/.test(title)) return profiles.business
  if (/software|developer|engineer|programmer|architect|application/.test(title)) return profiles.software
  return profiles.generic
}

function normalise(value: string) {
  return value.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
}

function findCompanyTextMatches(description: string, skills: RoadmapSkill[]): CompanyTextMatch[] {
  const aliases: Record<string, string[]> = {
    'Python': ['python'],
    'Data structures and algorithms': ['data structures', 'algorithms', 'dsa'],
    'Statistics and probability': ['statistics', 'probability'],
    'Linear algebra': ['linear algebra'],
    'SQL and data preparation': ['sql', 'data preparation', 'data cleaning'],
    'NumPy and pandas': ['numpy', 'pandas'],
    'Machine learning fundamentals': ['machine learning', 'machine-learning', 'ml algorithms'],
    'Scikit-learn': ['scikit-learn', 'scikit learn'],
    'PyTorch or TensorFlow': ['pytorch', 'tensorflow'],
    'Model evaluation and testing': ['model evaluation', 'evaluation metrics', 'model testing'],
    'REST APIs and Git': ['rest api', 'restful api', 'git', 'github'],
    'Docker and cloud deployment': ['docker', 'aws', 'azure', 'google cloud', 'cloud deployment'],
    'MLOps and monitoring': ['mlops', 'model monitoring'],
    'LLMs, retrieval, and vector search': ['llm', 'large language model', 'retrieval-augmented generation', 'rag', 'vector database', 'vector search'],
  }

  return skills.flatMap((item) => {
    const candidates = aliases[item.name] ?? item.name.split(/\s+and\s+|\s+or\s+|[,/]/i).map((part) => part.trim())
    for (const candidate of candidates) {
      if (!candidate) continue
      const escaped = candidate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const match = new RegExp(`(^|[^\\p{L}\\p{N}_])(${escaped})(?=$|[^\\p{L}\\p{N}_])`, 'iu').exec(description)
      if (match) return [{ skillName: item.name, phrase: match[2] }]
    }
    return []
  })
}

function durationDays(months: number, phaseIndex: number) {
  const distribution = [0.12, 0.1, 0.18, 0.12, 0.2, 0.1, 0.08, 0.1]
  return Math.max(2, Math.round(months * 30 * distribution[phaseIndex]))
}

export function suggestCompanies(query: string) {
  const normalisedQuery = query.trim().toLocaleLowerCase()
  if (!normalisedQuery) return companySuggestions.slice(0, 8)
  return companySuggestions.filter((company) => company.toLocaleLowerCase().includes(normalisedQuery)).slice(0, 8)
}

export function suggestRoles(query: string) {
  const normalisedQuery = query.trim().toLocaleLowerCase()
  if (!normalisedQuery) return roleSuggestions.slice(0, 10)
  return roleSuggestions.filter((role) => role.toLocaleLowerCase().includes(normalisedQuery)).slice(0, 10)
}

export function generateCareerRoadmap(input: {
  company: string
  role: string
  education: string
  currentSkills: string
  experience: string
  durationMonths: number
  jobDescription: string
  sourceUrl: string
}): CareerRoadmap {
  const profile = profileFor(input.role)
  const description = input.jobDescription.trim()
  const companyEvidence = description ? findCompanyTextMatches(description, profile.skills) : []
  const matchedSkillNames = new Set(companyEvidence.map((match) => match.skillName))
  const priorityOrder: Record<RoadmapSkill['priority'], number> = { Core: 0, Useful: 1, Stretch: 2 }
  const roleSkills = [...profile.skills].sort((first, second) => {
    const firstMatched = Number(matchedSkillNames.has(first.name))
    const secondMatched = Number(matchedSkillNames.has(second.name))
    return secondMatched - firstMatched || priorityOrder[first.priority] - priorityOrder[second.priority]
  })
  const userSkills = input.currentSkills.split(',').map((item) => item.trim()).filter(Boolean)
  const normalisedUserSkills = userSkills.map(normalise)
  const recognised = roleSkills.filter((item) => normalisedUserSkills.some((current) => current.includes(normalise(item.name)) || normalise(item.name).includes(current)))
  const missing = roleSkills.filter((item) => !recognised.includes(item))
  const coverage = Math.round(recognised.length / roleSkills.length * 100)
  const durationMonths = Math.max(1, Number(input.durationMonths) || 3)
  const phases: RoadmapPhase[] = [
    { title: 'Map the role and your starting point', objective: `Translate ${input.role} into the tasks named in a real posting.`, topics: ['Role vocabulary', 'Job-posting requirements', 'Baseline skill check'], tools: ['Target job description', 'Simple learning log'], exercise: 'Highlight repeated responsibilities and separate required, preferred, and unclear points.', outcome: 'A one-page skill gap list tied to a real role description.', prerequisite: 'None', resource: profile.resource },
    { title: 'Strengthen the foundations', objective: `Build the foundational knowledge used in ${profile.family}.${companyEvidence.length ? ' Start with technologies whose phrases appeared in the pasted posting.' : ''}`, topics: roleSkills.filter((item) => item.priority === 'Core').slice(0, 3).map((item) => item.name), tools: roleSkills.slice(0, 2).map((item) => item.name), exercise: `Complete a short fundamentals exercise related to ${input.role}.`, outcome: 'A set of worked exercises with notes on mistakes and corrections.', prerequisite: 'Phase 1 role map', resource: profile.resource },
    { title: 'Practise the core workflow', objective: `Repeat a representative task from ${input.role} using a small, realistic example.`, topics: roleSkills.slice(0, 4).map((item) => item.name), tools: roleSkills.slice(0, 3).map((item) => item.name), exercise: profile.projects[0], outcome: 'A first working draft with a short explanation of your approach.', prerequisite: 'Comfort with the foundations', resource: profile.resource },
    { title: 'Add the supporting tools', objective: 'Choose tools from the actual listing and practise only what supports the target work.', topics: roleSkills.slice(3, 7).map((item) => item.name), tools: roleSkills.slice(3, 6).map((item) => item.name), exercise: 'Rebuild one earlier exercise using a tool named in the target description, if supplied.', outcome: 'A documented tool choice with one trade-off.', prerequisite: 'Core workflow practice', resource: profile.resource },
    { title: 'Build a portfolio project', objective: `Create a bounded project that demonstrates work related to ${input.role}.`, topics: ['Scoping', 'Implementation', 'Testing or review', 'Documentation'], tools: roleSkills.filter((item) => item.priority !== 'Stretch').slice(0, 4).map((item) => item.name), exercise: profile.projects[1], outcome: 'A portfolio artifact with setup steps, decisions, and limitations.', prerequisite: 'Foundations and a small exercise', resource: profile.resource },
    { title: 'Improve quality and explain trade-offs', objective: 'Review your work as if another person needed to use or maintain it.', topics: ['Edge cases', 'Accessibility, safety, or data quality as relevant', 'Feedback and revision'], tools: ['Git or version history', 'A short test or review checklist'], exercise: 'Ask a peer to review one artifact, then make and document one improvement.', outcome: 'A revised artifact with a concise change log.', prerequisite: 'A working project draft', resource: profile.resource },
    { title: 'Prepare your story and materials', objective: 'Make your experience easy to understand without overstating it.', topics: ['Project explanation', 'Resume keywords', 'STAR examples'], tools: ['Resume draft', 'Portfolio or repository'], exercise: 'Write one STAR story and a truthful three-line project summary.', outcome: 'A role-focused resume draft and one interview story.', prerequisite: 'At least one completed artifact', resource: profile.resource },
    { title: 'Practise and plan next steps', objective: 'Rehearse role-relevant questions and choose the next gap to address.', topics: profile.interview, tools: ['Timer', 'Question notes', 'Peer or self-review'], exercise: 'Record a short mock answer, review it against clarity and evidence, then revise once.', outcome: 'A practice log and a prioritized next-step list.', prerequisite: 'Draft resume and project story', resource: profile.resource },
  ].map((phase, index) => ({ ...phase, duration: `${durationDays(durationMonths, index)} days` }))

  const projects: RoadmapProject[] = profile.projects.map((title, index) => ({
    title: `${title.split(' ').slice(0, 5).join(' ')}${title.split(' ').length > 5 ? '…' : ''}`,
    problem: title,
    stack: roleSkills.slice(index * 2, index * 2 + 3).map((item) => item.name),
    features: ['A clearly scoped user or business problem', 'A documented approach and key decisions', 'Tests, review notes, or limitations appropriate to the work'],
    skills: roleSkills.slice(index, index + 3).map((item) => item.name),
    difficulty: index === 0 ? 'Beginner' : index === 1 ? 'Intermediate' : 'Intermediate',
    resumeLine: `Built ${title.toLocaleLowerCase()}, demonstrating ${roleSkills.slice(index, index + 2).map((item) => item.name).join(' and ')}; describe only outcomes you actually measured.`,
  }))

  const sourceStatus = description
    ? 'Pasted job-description text is available, but ProofPath has not independently verified the employer, listing, or requirements.'
    : `No company job description was supplied. Company-specific requirements for ${input.company} are not confirmed; the guidance below is role-family guidance.`
  const readinessLabel = coverage < 25 ? 'Starting foundation' : coverage < 55 ? 'Building foundation' : coverage < 80 ? 'Developing foundation' : 'Broad foundation'
  const experienceNote = input.experience === 'Experienced'
    ? 'Use the project phases to demonstrate depth, architecture, and measurable trade-offs rather than repeating introductory material.'
    : input.experience === 'Intermediate'
      ? 'Prioritize applied practice, project quality, and role-specific interview explanations.'
      : 'Start with short fundamentals exercises, then add tools only after the underlying concepts are clear.'
  const educationNote = input.education ? ` Learning exercises are intended for a ${input.education} background and can be adjusted to your coursework.` : ''

  return {
    company: input.company,
    role: input.role,
    family: profile.family,
    overview: `${profile.overview} ${experienceNote}${educationNote}`,
    responsibilities: profile.responsibilities,
    entryRequirements: profile.requirements,
    companyEvidence,
    sourceUrl: input.sourceUrl,
    sourceStatus,
    roleSkills,
    phases,
    projects,
    interviewTopics: profile.interview,
    resumeKeywords: [input.role, ...roleSkills.filter((item) => item.priority !== 'Stretch').slice(0, 5).map((item) => item.name)],
    existingSkills: recognised.map((item) => item.name).concat(userSkills.filter((value) => !recognised.some((item) => normalise(item.name) === normalise(value)))),
    priorityGaps: missing.slice(0, 5).map((item) => item.name),
    coverage,
    coverageLabel: readinessLabel,
    durationMonths,
    experience: input.experience,
  }
}

export function compareRoadmaps(first: CareerRoadmap, second: CareerRoadmap) {
  const firstSkills = first.roleSkills.map((item) => item.name)
  const secondSkills = second.roleSkills.map((item) => item.name)
  return {
    shared: firstSkills.filter((item) => secondSkills.some((candidate) => normalise(candidate) === normalise(item))),
    firstOnly: firstSkills.filter((item) => !secondSkills.some((candidate) => normalise(candidate) === normalise(item))),
    secondOnly: secondSkills.filter((item) => !firstSkills.some((candidate) => normalise(candidate) === normalise(item))),
  }
}