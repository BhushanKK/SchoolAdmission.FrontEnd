/**
 * Configuration Module
 * Centralized configuration for API endpoints, constants, and environment variables
 */

const CONFIG = {
  // Environment Configuration
  ENV: 'development', // 'development', 'staging', 'production'
  
  // API Base URLs
  API: {
    BASE: (() => {
      const configs = {
        development: 'http://localhost:5263/api',
        staging: 'https://staging-schooladmission.azurewebsites.net/api',
        production: 'https://schooladmission-b2escsaph3gtezbv.centralindia-01.azurewebsites.net/api'
      };
      return configs[CONFIG.ENV] || configs.development;
    })(),
    
    FILE_BASE: (() => {
      const configs = {
        development: 'http://localhost:5263/',
        staging: 'https://staging-schooladmission.azurewebsites.net/',
        production: 'https://schooladmission-b2escsaph3gtezbv.centralindia-01.azurewebsites.net/'
      };
      return configs[CONFIG.ENV] || configs.development;
    })()
  },

  // Validation Constants
  VALIDATION: {
    MAX_NAME_LENGTH: 50,
    MAX_EMAIL_LENGTH: 100,
    MIN_PASSWORD_LENGTH: 7,
    
    // Regex Patterns
    PATTERNS: {
      NAME: /^[a-zA-Z\s]*$/,
      EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      PHONE: /^[0-9]{10}$/,
      AADHAR: /^[0-9]{12}$/,
      NUMBER: /^[0-9]*$/,
      // Enhanced password: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
      PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/
    }
  },

  // API Endpoints
  ENDPOINTS: {
    CATEGORY: '/categorymasters',
    CASTE: '/castemaster',
    SCHOOL: '/schoolmasters',
    SCHOOL_ALL: '/schoolmasters/AllSchools',
    AUTH_LOGIN: '/auth/login',
    BRANCH: '/branchmasters',
    STUDENT: '/student',
    STUDENT_DETAILS: '/student-details',
    STUDENT_STATUS: '/users/student-status',
    COMMITTEE: '/commitemasters',
    DIVISION: '/divisionmasters',
    DOCUMENT: '/student-document',
    GUARDIAN: '/student-parent',
    PREVIOUS_SCHOOL: '/student-academic-history',
    RELIGION: '/religionmasters',
    STANDARD: '/standardmasters',
    ADDRESS: '/student-address',
    HEALTH: '/student-health',
    SUBJECT: '/Subjectmasters',
    SUBJECT_CHOICE: '/StudentSubjectChoices',
    REPORT: '/student-details/'
  },

  // Storage Keys
  STORAGE: {
    TOKEN: 'accessToken',
    USER_EMAIL: 'userEmail',
    USER_ROLE: 'role',
    STUDENT_ID: 'studentId',
    THEME: 'theme'
  },

  // UI Constants
  UI: {
    TOAST_DURATION: 3000,
    MODAL_ANIMATION_DURATION: 300,
    POPUP_WIDTH: 900,
    POPUP_HEIGHT: 700
  },

  // HTTP Status Codes
  HTTP: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500
  },

  // Toast Types
  TOAST_TYPE: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    EXISTS: 'exists'
  },

  // User Roles
  ROLES: {
    ADMIN: 'Admin',
    STUDENT: 'Student'
  }
};

// Helper function to get full API URL
CONFIG.getApiUrl = function(endpoint) {
  return CONFIG.API.BASE + endpoint;
};

// Helper function to get full file URL
CONFIG.getFileUrl = function(filePath) {
  return CONFIG.API.FILE_BASE + filePath;
};
