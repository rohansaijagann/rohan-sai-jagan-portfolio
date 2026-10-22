export interface GlossaryItem {
  term: string;
  definition: string;
  aliases?: string[];
}

export const GLOSSARY: Record<string, GlossaryItem> = {
  api: {
    term: 'API',
    definition: 'A way for two different apps or systems to exchange information.',
    aliases: ['apis', 'rest api', 'rest apis', 'api-first development'],
  },
  backend: {
    term: 'Backend',
    definition: 'The server-side engine that handles databases, business logic, and security.',
    aliases: ['back-end', 'server-side'],
  },
  frontend: {
    term: 'Frontend',
    definition: 'The visual screens and buttons that people see and interact with.',
    aliases: ['front-end', 'client-side'],
  },
  'computer vision': {
    term: 'Computer Vision',
    definition: 'Software that helps computers process and understand images and live camera feeds.',
    aliases: ['vision', 'cv', 'opencv'],
  },
  rag: {
    term: 'RAG',
    definition: 'Retrieval-Augmented Generation: searches real documents first so AI answers stay factual.',
    aliases: ['retrieval-augmented generation', 'retrieval augmented generation'],
  },
  cnn: {
    term: 'CNN',
    definition: 'Convolutional Neural Network: a model inspired by vision, built to examine images.',
    aliases: ['convolutional neural network', 'convolutional neural networks'],
  },
  docker: {
    term: 'Docker',
    definition: 'Packages an app with its dependencies so it runs identically on any machine.',
    aliases: ['containers', 'container'],
  },
  fastapi: {
    term: 'FastAPI',
    definition: 'A modern, high-speed Python framework for building backend web APIs.',
    aliases: [],
  },
  chromadb: {
    term: 'ChromaDB',
    definition: 'An open-source vector database that finds text by conceptual meaning.',
    aliases: ['vector database', 'vector store', 'vector search'],
  },
  typescript: {
    term: 'TypeScript',
    definition: 'JavaScript with type checks that catch typos and bugs before code runs.',
    aliases: ['ts'],
  },
  react: {
    term: 'React',
    definition: 'A component library for building fast, interactive user interfaces.',
    aliases: ['react.js', 'react 19'],
  },
  python: {
    term: 'Python',
    definition: 'A readable programming language widely used in AI, data, and web backends.',
    aliases: [],
  },
  'scikit-learn': {
    term: 'Scikit-learn',
    definition: 'A Python library with algorithms for machine learning and predictive modeling.',
    aliases: ['scikit learn', 'sklearn'],
  },
  'leaflet.js': {
    term: 'Leaflet.js',
    definition: 'A lightweight JavaScript library for interactive, mobile-friendly maps.',
    aliases: ['leaflet'],
  },
  tensorflow: {
    term: 'TensorFlow',
    definition: 'An open-source framework used to build and train deep learning models.',
    aliases: ['tf'],
  },
  keras: {
    term: 'Keras',
    definition: 'A user-friendly neural network library running on top of TensorFlow.',
    aliases: [],
  },
  'gemini api': {
    term: 'Gemini API',
    definition: "Google's AI model API for multimodal reasoning, question answering, and text processing.",
    aliases: ['gemini', 'google gemini api'],
  },
  langgraph: {
    term: 'LangGraph',
    definition: 'A framework for building reliable multi-step, cyclical AI agent workflows.',
    aliases: [],
  },
  postgresql: {
    term: 'PostgreSQL',
    definition: 'A reliable open-source database system for storing structured application data.',
    aliases: ['postgres'],
  },
  mysql: {
    term: 'MySQL',
    definition: 'A popular open-source relational database management system.',
    aliases: [],
  },
  git: {
    term: 'Git',
    definition: 'A version control tool that records code history and facilitates teamwork.',
    aliases: ['github'],
  },
  nextjs: {
    term: 'Next.js',
    definition: 'A full-stack React framework optimized for performance and server rendering.',
    aliases: ['next.js'],
  },
  'tailwind css': {
    term: 'Tailwind CSS',
    definition: 'A utility-first CSS framework for creating custom UI designs quickly.',
    aliases: ['tailwind'],
  },
  vite: {
    term: 'Vite',
    definition: 'A fast frontend build tool and development server for modern web apps.',
    aliases: [],
  },
  aws: {
    term: 'AWS',
    definition: 'Amazon Web Services: cloud computing infrastructure for servers and storage.',
    aliases: ['aws basics', 'aws (ec2, s3, iam)'],
  },
  linux: {
    term: 'Linux',
    definition: 'The open-source operating system kernel that powers most cloud servers.',
    aliases: ['linux (cli)'],
  },
  postman: {
    term: 'Postman',
    definition: 'A tool for testing and debugging HTTP API endpoints interactively.',
    aliases: [],
  },
  vercel: {
    term: 'Vercel',
    definition: 'A cloud platform for automated frontend deployments and hosting.',
    aliases: [],
  },
  sql: {
    term: 'SQL',
    definition: 'Structured Query Language used to query and manage relational databases.',
    aliases: [],
  },
  'html5': {
    term: 'HTML5',
    definition: 'The latest standard of HTML structuring content on the modern web.',
    aliases: ['html', 'html / css'],
  },
  'css3': {
    term: 'CSS3',
    definition: 'The styling language that shapes layout, typography, and motion in browsers.',
    aliases: ['css'],
  },
  java: {
    term: 'Java',
    definition: 'A widely used object-oriented programming language for enterprise software.',
    aliases: [],
  },
  javascript: {
    term: 'JavaScript',
    definition: 'The standard scripting language that powers interactive web experiences.',
    aliases: ['js', 'javascript (es6+)'],
  },
  numpy: {
    term: 'NumPy',
    definition: 'The fundamental library for fast numerical computing and array operations in Python.',
    aliases: [],
  },
  pandas: {
    term: 'Pandas',
    definition: 'A Python library designed for tabular data manipulation, filtering, and analysis.',
    aliases: [],
  },
  pydantic: {
    term: 'Pydantic',
    definition: 'Data validation and settings management using Python type annotations.',
    aliases: [],
  },
  motion: {
    term: 'Motion',
    definition: 'A production-ready animation library for React to create fluid interactive gestures.',
    aliases: ['motion/react', 'framer motion'],
  },
  bash: {
    term: 'Bash',
    definition: 'The standard Unix shell and command language for automation and server scripting.',
    aliases: ['shell'],
  },
  'vs code': {
    term: 'VS Code',
    definition: 'The extensible code editor by Microsoft used for developing software.',
    aliases: ['vscode'],
  },
  'machine learning': {
    term: 'Machine Learning',
    definition: 'Techniques that enable computers to learn patterns from data without explicit rules.',
    aliases: ['ml'],
  },
  'deep learning': {
    term: 'Deep Learning',
    definition: 'Multi-layer neural networks capable of learning complex representations from data.',
    aliases: ['dl'],
  },
  'generative ai': {
    term: 'Generative AI',
    definition: 'Models that generate text, code, or media from user prompts.',
    aliases: ['genai'],
  },
  llms: {
    term: 'LLMs',
    definition: 'Large Language Models trained on vast amounts of text to reason and answer questions.',
    aliases: ['large language models', 'llm'],
  },
  'responsive web design': {
    term: 'Responsive Web Design',
    definition: 'Designing layouts that automatically adapt and look great across phones, tablets, and desktops.',
    aliases: ['responsive design'],
  },
  'component-based architecture': {
    term: 'Component-based architecture',
    definition: 'Building software out of small, self-contained, and reusable modular units.',
    aliases: ['component-based'],
  },
  microservices: {
    term: 'Microservices',
    definition: 'An architectural style structuring an app as a collection of independently deployable services.',
    aliases: [],
  },
  'ui/ux principles': {
    term: 'UI/UX principles',
    definition: 'Design standards focused on clarity, visual hierarchy, ergonomics, and accessibility.',
    aliases: ['ui/ux'],
  },
  'cross-browser compatibility': {
    term: 'Cross-browser compatibility',
    definition: 'Ensuring consistent rendering and behaviour across Chrome, Firefox, Safari, and Edge.',
    aliases: [],
  },
  'performance optimization': {
    term: 'Performance optimization',
    definition: 'Techniques to speed up page loading, minimize bundle sizes, and keep animations smooth.',
    aliases: [],
  },
  sdlc: {
    term: 'SDLC',
    definition: 'Software Development Life Cycle: the process for planning, creating, testing, and deploying software.',
    aliases: ['software development life cycle'],
  },
  'data structures & algorithms': {
    term: 'Data Structures & Algorithms',
    definition: 'Methods for organizing data and step-by-step procedures to solve computational problems efficiently.',
    aliases: ['dsa'],
  },
  oop: {
    term: 'OOP',
    definition: 'Object-Oriented Programming: structuring code around data objects with classes and methods.',
    aliases: ['object oriented programming'],
  },
  dbms: {
    term: 'DBMS',
    definition: 'Database Management Systems: software that manages, queries, and maintains data integrity.',
    aliases: ['database management systems'],
  },
  'operating systems': {
    term: 'Operating Systems',
    definition: 'System software managing hardware resources, memory, processes, and file systems.',
    aliases: ['os'],
  },
  'computer networks': {
    term: 'Computer Networks',
    definition: 'Protocols and architecture that govern data transmission across devices and the internet.',
    aliases: ['networking'],
  },
  'system design (basics)': {
    term: 'System design (basics)',
    definition: 'Defining architecture, components, and interfaces to meet technical requirements.',
    aliases: ['system design'],
  },
};

export function lookupTerm(rawTerm: string): GlossaryItem | undefined {
  if (!rawTerm) return undefined;
  const normalized = rawTerm.toLowerCase().trim();
  if (GLOSSARY[normalized]) return GLOSSARY[normalized];
  for (const item of Object.values(GLOSSARY)) {
    if (item.term.toLowerCase() === normalized) return item;
    if (item.aliases?.some((alias) => alias.toLowerCase() === normalized)) {
      return item;
    }
  }
  return undefined;
}
