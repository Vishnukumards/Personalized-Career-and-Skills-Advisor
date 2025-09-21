-- Users table for authentication and basic info
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Hashed password
    userType ENUM('puc', 'engineering', 'graduate') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profiles table for detailed academic and career info
CREATE TABLE profiles (
    userId INT PRIMARY KEY,
    college VARCHAR(255),
    stream VARCHAR(255),
    branch VARCHAR(255),
    yearOfStudy INT,
    degree VARCHAR(255),
    passoutYear INT,
    interestedSkills TEXT, -- Comma-separated list of skills
    suggestedCareerPath VARCHAR(255),
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Stores the multi-stage assessment questions
CREATE TABLE assessment_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stage INT NOT NULL,
    questionText TEXT NOT NULL
);

-- Stores user's answers to the assessment questions
CREATE TABLE assessment_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    questionId INT NOT NULL,
    answer VARCHAR(255) NOT NULL,
    submittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (questionId) REFERENCES assessment_questions(id)
);