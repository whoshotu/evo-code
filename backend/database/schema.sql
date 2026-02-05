-- ============================================
-- EvolveCode Database Schema
-- ============================================
-- This SQL file creates the necessary tables for
-- storing user progress, analytics, and API usage logs
-- ============================================
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    current_stage ENUM('KIDS', 'TWEEN', 'TEEN', 'PRO') DEFAULT 'KIDS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_id VARCHAR(50) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    attempts INT DEFAULT 0,
    hints_used INT DEFAULT 0,
    time_spent INT DEFAULT 0,
    -- in seconds
    score DECIMAL(5, 2) DEFAULT 0.00,
    -- 0-100
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_lesson (user_id, lesson_id),
    INDEX idx_user_id (user_id),
    INDEX idx_lesson_id (lesson_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Create learner_profiles table (for adaptive learning)
CREATE TABLE IF NOT EXISTS learner_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    difficulty_level ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    learning_pace ENUM('slow', 'moderate', 'fast') DEFAULT 'moderate',
    preferred_style ENUM('visual', 'textual', 'auditory', 'kinesthetic') DEFAULT 'visual',
    streak_days INT DEFAULT 0,
    total_session_time INT DEFAULT 0,
    -- in seconds
    last_streak_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Create error_patterns table (track common mistakes)
CREATE TABLE IF NOT EXISTS error_patterns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_id VARCHAR(50) NOT NULL,
    error_type VARCHAR(100) NOT NULL,
    frequency INT DEFAULT 1,
    last_occurred TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_lesson_error (user_id, lesson_id, error_type),
    INDEX idx_user_id (user_id),
    INDEX idx_lesson_id (lesson_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    achievement_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    xp_reward INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_achievement_id (achievement_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    achievement_id VARCHAR(50) NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_achievement (user_id, achievement_id),
    INDEX idx_user_id (user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Create api_usage_logs table (monitor API calls)
CREATE TABLE IF NOT EXISTS api_usage_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    session_id VARCHAR(100),
    action VARCHAR(50) NOT NULL,
    model_used VARCHAR(100),
    tokens_used INT DEFAULT 0,
    response_time INT DEFAULT 0,
    -- in milliseconds
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE
    SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at),
        INDEX idx_action (action)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Create sessions table (for rate limiting and analytics)
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    user_id INT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    api_requests_count INT DEFAULT 0,
    last_request_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE
    SET NULL,
        INDEX idx_session_id (session_id),
        INDEX idx_user_id (user_id),
        INDEX idx_expires_at (expires_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ============================================
-- Insert default achievements
-- ============================================
INSERT INTO achievements (
        achievement_id,
        title,
        description,
        icon,
        xp_reward
    )
VALUES (
        'first-lesson',
        '🎯 First Steps',
        'Complete your first lesson',
        '🎯',
        50
    ),
    (
        'first-loop',
        '🔁 Loop Master',
        'Complete your first loop lesson',
        '🔁',
        100
    ),
    (
        'no-hints',
        '🧠 Independent Thinker',
        'Complete a lesson without using hints',
        '🧠',
        200
    ),
    (
        'week-streak',
        '🔥 Week Warrior',
        'Practice coding 7 days in a row',
        '🔥',
        500
    ),
    (
        'stage-complete',
        '⭐ Stage Champion',
        'Complete all lessons in a stage',
        '⭐',
        1000
    ),
    (
        'fast-learner',
        '⚡ Speed Demon',
        'Complete a lesson in under 2 minutes',
        '⚡',
        150
    ),
    (
        'helper',
        '🤝 Helping Hand',
        'Help another student (peer review)',
        '🤝',
        300
    ),
    (
        'perfectionist',
        '💯 Perfectionist',
        'Get 100% on 10 lessons',
        '💯',
        750
    ) ON DUPLICATE KEY
UPDATE title =
VALUES(title);
-- ============================================
-- Create views for analytics
-- ============================================
-- View: User progress summary
CREATE OR REPLACE VIEW v_user_progress_summary AS
SELECT u.id AS user_id,
    u.username,
    u.current_stage,
    COUNT(DISTINCT up.lesson_id) AS lessons_completed,
    AVG(up.score) AS average_score,
    SUM(up.time_spent) AS total_time_spent,
    lp.streak_days,
    lp.difficulty_level,
    lp.learning_pace
FROM users u
    LEFT JOIN user_progress up ON u.id = up.user_id
    AND up.completed = TRUE
    LEFT JOIN learner_profiles lp ON u.id = lp.user_id
GROUP BY u.id;
-- View: API usage summary
CREATE OR REPLACE VIEW v_api_usage_summary AS
SELECT DATE(created_at) AS date,
    action,
    COUNT(*) AS request_count,
    SUM(tokens_used) AS total_tokens,
    AVG(response_time) AS avg_response_time,
    SUM(
        CASE
            WHEN success = TRUE THEN 1
            ELSE 0
        END
    ) AS successful_requests,
    SUM(
        CASE
            WHEN success = FALSE THEN 1
            ELSE 0
        END
    ) AS failed_requests
FROM api_usage_logs
GROUP BY DATE(created_at),
    action
ORDER BY date DESC,
    request_count DESC;
-- ============================================
-- Stored procedures
-- ============================================
DELIMITER // -- Procedure: Update user streak
CREATE PROCEDURE update_user_streak(IN p_user_id INT) BEGIN
DECLARE last_date DATE;
DECLARE current_streak INT;
SELECT last_streak_date,
    streak_days INTO last_date,
    current_streak
FROM learner_profiles
WHERE user_id = p_user_id;
IF last_date IS NULL
OR last_date < CURDATE() - INTERVAL 1 DAY THEN -- Streak broken, reset to 1
UPDATE learner_profiles
SET streak_days = 1,
    last_streak_date = CURDATE()
WHERE user_id = p_user_id;
ELSEIF last_date = CURDATE() - INTERVAL 1 DAY THEN -- Continue streak
UPDATE learner_profiles
SET streak_days = streak_days + 1,
    last_streak_date = CURDATE()
WHERE user_id = p_user_id;
END IF;
-- If last_date = CURDATE(), do nothing (already logged today)
END // -- Procedure: Check and award achievements
CREATE PROCEDURE check_achievements(IN p_user_id INT) BEGIN -- First lesson achievement
INSERT IGNORE INTO user_achievements (user_id, achievement_id)
SELECT p_user_id,
    'first-lesson'
FROM user_progress
WHERE user_id = p_user_id
    AND completed = TRUE
LIMIT 1;
-- Week streak achievement
INSERT IGNORE INTO user_achievements (user_id, achievement_id)
SELECT p_user_id,
    'week-streak'
FROM learner_profiles
WHERE user_id = p_user_id
    AND streak_days >= 7;
-- No hints achievement
INSERT IGNORE INTO user_achievements (user_id, achievement_id)
SELECT p_user_id,
    'no-hints'
FROM user_progress
WHERE user_id = p_user_id
    AND completed = TRUE
    AND hints_used = 0
LIMIT 1;
END // DELIMITER;
-- ============================================
-- Indexes for performance
-- ============================================
-- Additional indexes for common queries
CREATE INDEX idx_user_progress_completed ON user_progress(user_id, completed);
CREATE INDEX idx_api_logs_date_action ON api_usage_logs(created_at, action);
-- ============================================
-- Cleanup old data (optional)
-- ============================================
-- Event to clean up expired sessions (runs daily)
CREATE EVENT IF NOT EXISTS cleanup_expired_sessions ON SCHEDULE EVERY 1 DAY DO
DELETE FROM sessions
WHERE expires_at < NOW();
-- Event to clean up old API logs (keep last 90 days)
CREATE EVENT IF NOT EXISTS cleanup_old_api_logs ON SCHEDULE EVERY 1 WEEK DO
DELETE FROM api_usage_logs
WHERE created_at < NOW() - INTERVAL 90 DAY;