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
define('AI_PROVIDER', 'openrouter'); // Using OpenRouter for access to multiple models

// OpenRouter API Key (Recommended - provides access to multiple models)
$OPENROUTER_API_KEY = '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';
$OPENROUTER_MODEL = 'qwen/qwen3-next-80b-a3b-instruct:free'; // Free model via OpenRouter
// Other good options:
// - 'anthropic/claude-3.5-sonnet' (high quality, more expensive)
// - 'openai/gpt-4o-mini' (balanced)
// - 'google/gemini-2.5-flash' (fast with reasoning)
// - 'meta-llama/llama-3.1-8b-instruct' (open source)

// OpenAI API Key (fallback)
$OPENAI_API_KEY = '';

// Anthropic API Key (Claude) (fallback)
$ANTHROPIC_API_KEY = '';

// Cohere API Key (fallback)
$COHERE_API_KEY = '';

// HuggingFace API Key (fallback)
$HUGGINGFACE_API_KEY = '';
$HUGGINGFACE_MODEL = 'mistralai/Mistral-7B-Instruct-v0.2';

// ============================================
// DATABASE CONFIGURATION
// ============================================

// AlterVista MySQL Database
// Your credentials (already configured!)
define('DB_HOST', 'localhost');
define('DB_NAME', 'my_hereisreal'); // Your database
define('DB_USER', 'hereisreal'); // Your username
define('DB_PASS', ''); // No password needed for localhost
define('DB_CHARSET', 'utf8mb4');

// ============================================
// APPLICATION SETTINGS
// ============================================

// Environment
define('ENVIRONMENT', 'production'); // 'development' or 'production'

// Rate Limiting (60 requests per hour per session)
define('RATE_LIMIT_REQUESTS', 60);
define('RATE_LIMIT_ENABLED', true);

// CORS Settings - YOUR DOMAIN
define('ALLOWED_ORIGINS', [
    'https://hereisreal.altervista.org',
    'https://hereisreal.altervista.org/evolve-code',
    'http://localhost:5173' // For local Vite development
]);

// Base path for subdirectory deployment
define('BASE_PATH', '/evolve-code');

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
