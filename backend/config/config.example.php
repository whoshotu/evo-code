<?php
/**
 * Configuration file for EvolveCode Backend
 * 
 * SECURITY: This file contains sensitive information.
 * DO NOT commit this file to version control!
 * Add config/config.php to .gitignore
 */

// ============================================
// API KEYS (Keep these secret!)
// ============================================

// Default AI Provider
// Options: 'openai', 'anthropic', 'cohere', 'huggingface', 'openrouter'
define('AI_PROVIDER', 'openrouter'); // Change to your preferred provider

// OpenRouter API Key (Recommended - provides access to multiple models)
$OPENROUTER_API_KEY = 'your_openrouter_key_here';
$OPENROUTER_MODEL = 'google/gemini-2.5-flash-lite'; // Default model (fast & cheap)
// Other options: 'anthropic/claude-3.5-sonnet', 'openai/gpt-4o-mini', 'meta-llama/llama-3.1-8b-instruct'

// OpenAI API Key
$OPENAI_API_KEY = 'your_openai_key_here';

// Anthropic API Key (Claude)
$ANTHROPIC_API_KEY = 'your_anthropic_key_here';

// Cohere API Key
$COHERE_API_KEY = 'your_cohere_key_here';

// HuggingFace API Key
$HUGGINGFACE_API_KEY = 'your_huggingface_key_here';
$HUGGINGFACE_MODEL = 'mistralai/Mistral-7B-Instruct-v0.2'; // Default model

// ============================================
// DATABASE CONFIGURATION
// ============================================

// AlterVista MySQL Database
define('DB_HOST', 'localhost');
define('DB_NAME', 'my_database'); // Your AlterVista database name
define('DB_USER', 'your_username'); // Your AlterVista username
define('DB_PASS', 'your_password'); // Your AlterVista database password
define('DB_CHARSET', 'utf8mb4');

// ============================================
// APPLICATION SETTINGS
// ============================================

// Environment
define('ENVIRONMENT', 'production'); // 'development' or 'production'

// Rate Limiting
define('RATE_LIMIT_REQUESTS', 60); // Requests per hour per session
define('RATE_LIMIT_ENABLED', true);

// CORS Settings
define('ALLOWED_ORIGINS', [
    'https://yourusername.altervista.org',
    'http://localhost:3000' // For local development
]);

// Logging
define('LOG_ERRORS', true);
define('LOG_FILE', __DIR__ . '/../logs/error.log');

// ============================================
// SECURITY SETTINGS
// ============================================

// Session settings
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1); // Only over HTTPS
ini_set('session.use_strict_mode', 1);

// Error display (hide in production)
if (ENVIRONMENT === 'production') {
    ini_set('display_errors', 0);
    error_reporting(0);
} else {
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
}

// ============================================
// DATABASE CONNECTION
// ============================================

function getDbConnection()
{
    static $pdo = null;

    if ($pdo === null) {
        try {
            $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log('Database connection failed: ' . $e->getMessage());
            throw new Exception('Database connection failed');
        }
    }

    return $pdo;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Log error to file
 */
function logError($message, $context = [])
{
    if (!LOG_ERRORS)
        return;

    $timestamp = date('Y-m-d H:i:s');
    $contextStr = !empty($context) ? json_encode($context) : '';
    $logMessage = "[{$timestamp}] {$message} {$contextStr}\n";

    error_log($logMessage, 3, LOG_FILE);
}

/**
 * Check if origin is allowed
 */
function isOriginAllowed($origin)
{
    return in_array($origin, ALLOWED_ORIGINS);
}
