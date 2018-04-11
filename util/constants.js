
'use strict';
module.exports = {
    USER_IMAGES_S3_PATH: '/users/profileImages',
    GOOGLE_MAP_KEY: 'AIzaSyClKkrECS8-iWFyGFjLJ6jum25FrDQAvj4',
    PUBNUB_KEYS: {
        subscribeKey: '',
        publishKey: '',
        secretKey: ''
    },
    CLIENT_ROLES: {
        USER: 'ROLE_USER',
        ADMIN: 'ROLE_ADMIN'
    },
    USER_TYPE: {
        COMMUNITY_USER: 0,
        PREMED: 1,
        MEDICAL_STUDENT: 2,
        RESIDENT: 3,
        FELLOW: 4,
        PROFESSIONAL: 5,
        RESEARCHER: 6,
        ADMINISTRATIVE: 7
    },
    USER_GENDER: {
        FEMALE: 0,
        MALE: 1,
        OTHER: 2
    },
    USER_ONLINE_STATUS: {
        ACTIVE: 0,
        BUSY: 1,
        AWAY: 2
    },
    VALIDATION_STATUS: {
        PENDING: 0,
        APPROVED: 1,
        DENIED: 3,
        NON_EXISTENT: 4
    },
    BLOG_TYPE: {
        ARTICLE: 0,
        PERSONAL: 1,
        JOURNAL: 2,
        MED_CASE: 3
    },
    DEGREE_TYPE:{
        UNDERGRAD: 0,
        GRAD: 1,
        POSTGRAD: 2,
        MD: 3,
        RSN: 4,
        BSN: 5,
        DDS: 6,
        DC: 7,
        DPM: 8,
        PharmD: 9
    },
    EXPERIENCE_TYPE: {
        SHADOW: 0,
        INTERNSHIP: 1,
        ROTATION: 2,
        FULLTIME: 3,
        SPECIALIST: 4,
        PARTTIME: 5,
        SCRIBE: 6
    },
    INSTITUTE_TYPE: {
        PRIVATE_CLINIC: 0,
        HOSPITAL: 1,
        URGENT_CARE: 2,
        CHILDREN_HOSPITAL: 3,
        EMERGENCY_CARE: 4
    },
    MEDSCHOOL_TYPE: {
        MEDICAL: 0,
        DENTAL: 1,
        VETERAN: 2,
        PHARMACY: 3,
        OPTMETRY: 4,
        PODIATRY: 5,
        CHIROPRACTIC: 6
    },
    WAGE_TYPE: {
        HOURLY: 0,
        WEEKLY: 1,
        BI_WEEKLY: 2,
        MONTHLY: 3
    },
    JOB_TYPE: {
        FULLTIME: 0,
        PARTTIME: 1,
        CONSULTANT: 2,
        INTERNSHIP: 3,
        VOLUNTEER: 4
    },
    JOB_SHIFT_TYPE: {
        MORNING: 0,
        EVENING: 1,
        AFTERNOON: 2,
        NIGHT: 3,
        DEPENDS: 4
    },
    JOB_STATUS: {
        NOT_SEEN: 0,
        NOTICED: 1,
        IN_PROCESS: 2,
        REJECTED: 3,
        ACCEPTED: 4
    },
    REPUTATION: {
        MIN: 1,
        MAX: 10
    },
    DURATION_TYPE: {
        HOURS: 0,
        DAYS: 1,
        WEEKS: 2
    },
    OCCURANCE_TYPE: {
        WEEKLY: 0,
        BI_WEEKLY: 1,
        MONTHLY: 2,
        ANNUALLY: 3
    },
    QUESTION_TYPE: {
        INPUT_FIELD: 0,
        MULTIPLE_CHOICE: 1,
        SINGLE_SELECT: 2,
        FIVE_STAR: 3,
        BOOLEAN: 4,
        SINGLE_SELECT_WITH_INPUT: 5
    },
    NETWORK_STATUS: {
        REQUESTED: 0,
        ACCEPTED: 1,
        DENIED: 2
    },
    REPORTED_STATUS: {
        UNSEEN: 0,
        SEEN: 1,
        BANNED: 2
    },
    ACADEMIC_SEASONS:{
        FALL: 0,
        WINTER: 1,
        SUMMER: 2,
        SPRING:3
    },
    DASHBOARD:{
        CC_USER: {
            BLOGS: 8,
            SURVEYS: 5,
            DASHBOARD:5
        },
        QUAL: {
            BLOGS: 6,
            SURVEYS: 4,
            EVENTS: 4,
            VACANCIES: 4,
            RESEARCH: 3,
            NEWS: 1,
            ACTIVITY: 1,
            STATUS: 2,
            DASHBOARD:2
        }
    }
};
