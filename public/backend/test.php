<?php
/**
 * Test script for EvolveCode Backend
 * 
 * Run this to verify your backend is working correctly
 */

require_once __DIR__ . '/../config/config.php';

header('Content-Type: text/plain');

echo "=== EvolveCode Backend Test ===\n\n";

// Test 1: Config loaded
echo "✓ Config file loaded\n";
echo "  Provider: " . AI_PROVIDER . "\n";
echo "  Environment: " . ENVIRONMENT . "\n\n";

// Test 2: API Key check
if (!empty($OPENROUTER_API_KEY) && $OPENROUTER_API_KEY !== 'sk-or-v1-YOUR_OPENROUTER_API_KEY_HERE') {
    echo "✓ OpenRouter API Key configured\n";
} else {
    echo "✗ OpenRouter API Key NOT configured\n";
    echo "  Please add your API key to backend/config/config.php\n";
}

// Test 3: Database connection
try {
    $pdo = getDbConnection();
    echo "✓ Database connection successful\n";
    echo "  Database: " . DB_NAME . "\n";
} catch (Exception $e) {
    echo "✗ Database connection failed\n";
    echo "  Error: " . $e->getMessage() . "\n";
    echo "  Please check your database credentials in config.php\n";
}

echo "\n=== Test Complete ===\n";
echo "\nNext steps:\n";
echo "1. Update config.php with your actual API key and database credentials\n";
echo "2. Import database/schema.sql into your MySQL database\n";
echo "3. Test the API endpoint at: backend/api/ai-proxy.php\n";
