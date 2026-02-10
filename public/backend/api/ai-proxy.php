<?php
/**
 * AI API Proxy for EvolveCode
 * 
 * This PHP backend securely proxies requests to various AI providers,
 * keeping your API keys safe on the server.
 * 
 * Supported providers: OpenAI, Anthropic, Cohere, HuggingFace, and more
 * 
 * SECURITY: API keys are stored in config.php (NOT in version control)
 */

// Enable error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Set to 0 in production

// CORS headers - configure for production
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (isOriginAllowed($origin)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
} else {
    // Allow all origins in development
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Load configuration (API keys stored here)
require_once __DIR__ . '/../config/config.php';

// Get request body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit();
}

// Validate required fields
$action = $data['action'] ?? null;
$payload = $data['payload'] ?? [];
$provider = $data['provider'] ?? AI_PROVIDER; // From config

if (!$action) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing action']);
    exit();
}

// Rate limiting (simple implementation)
session_start();
$rateLimit = RATE_LIMIT_REQUESTS;
$rateLimitKey = 'api_requests_' . date('YmdH');

if (!isset($_SESSION[$rateLimitKey])) {
    $_SESSION[$rateLimitKey] = 0;
}

$_SESSION[$rateLimitKey]++;

if (RATE_LIMIT_ENABLED && $_SESSION[$rateLimitKey] > $rateLimit) {
    http_response_code(429);
    echo json_encode(['error' => 'Rate limit exceeded. Try again later.']);
    exit();
}

// Route to appropriate handler
try {
    switch ($action) {
        case 'generateText':
            $result = handleGenerateText($payload, $provider);
            break;

        case 'evolveCode':
            $result = handleEvolveCode($payload, $provider);
            break;

        case 'getTutorHelp':
            $result = handleGetTutorHelp($payload, $provider);
            break;

        case 'generateMission':
            $result = handleGenerateMission($payload, $provider);
            break;

        case 'simulateCode':
            $result = handleSimulateCode($payload, $provider);
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Unknown action: ' . $action]);
            exit();
    }

    echo json_encode(['success' => true, 'data' => $result]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

/**
 * Handle text generation request
 */
function handleGenerateText($payload, $provider)
{
    $prompt = $payload['prompt'] ?? '';
    $maxTokens = $payload['maxTokens'] ?? 500;

    if (empty($prompt)) {
        throw new Exception('Prompt is required');
    }

    switch ($provider) {
        case 'openai':
            return callOpenAI($prompt, $maxTokens);
        case 'anthropic':
            return callAnthropic($prompt, $maxTokens);
        case 'cohere':
            return callCohere($prompt, $maxTokens);
        case 'huggingface':
            return callHuggingFace($prompt, $maxTokens);
        case 'openrouter':
            return callOpenRouter($prompt, $maxTokens);
        default:
            throw new Exception('Unsupported AI provider: ' . $provider);
    }
}

/**
 * Handle code evolution request
 */
function handleEvolveCode($payload, $provider)
{
    $currentCode = $payload['currentCode'] ?? '';
    $fromStage = $payload['fromStage'] ?? '';
    $toStage = $payload['toStage'] ?? '';
    $language = $payload['language'] ?? 'en';

    // Build prompt
    $prompt = buildEvolvePrompt($currentCode, $fromStage, $toStage, $language);

    // Call AI provider
    $result = handleGenerateText(['prompt' => $prompt, 'maxTokens' => 1000], $provider);

    // Clean up code blocks
    $code = $result['text'];
    $code = preg_replace('/```python|```javascript|```/', '', $code);

    return ['code' => trim($code)];
}

/**
 * Handle tutor help request
 */
function handleGetTutorHelp($payload, $provider)
{
    $query = $payload['query'] ?? '';
    $code = $payload['code'] ?? '';
    $stage = $payload['stage'] ?? 'KIDS';
    $mission = $payload['mission'] ?? '';
    $language = $payload['language'] ?? 'en';

    // Build tutor prompt
    $prompt = buildTutorPrompt($query, $code, $stage, $mission, $language);

    // Call AI provider
    $result = handleGenerateText(['prompt' => $prompt, 'maxTokens' => 800], $provider);

    return ['response' => $result['text']];
}

/**
 * Handle mission generation request
 */
function handleGenerateMission($payload, $provider)
{
    $stage = $payload['stage'] ?? 'KIDS';
    $lesson = $payload['lesson'] ?? null;
    $language = $payload['language'] ?? 'en';

    $prompt = buildMissionPrompt($stage, $lesson, $language);

    $result = handleGenerateText(['prompt' => $prompt, 'maxTokens' => 300], $provider);

    return ['mission' => $result['text']];
}

/**
 * Handle code simulation request
 */
function handleSimulateCode($payload, $provider)
{
    $code = $payload['code'] ?? '';
    $stage = $payload['stage'] ?? 'KIDS';

    $prompt = "Simulate the execution of this code and describe what it does:\n\n{$code}\n\nProvide a simple explanation suitable for a {$stage} level learner.";

    $result = handleGenerateText(['prompt' => $prompt, 'maxTokens' => 500], $provider);

    return ['simulation' => $result['text']];
}

// ============================================
// AI PROVIDER IMPLEMENTATIONS
// ============================================

/**
 * Call OpenAI API
 */
function callOpenAI($prompt, $maxTokens = 500)
{
    global $OPENAI_API_KEY;

    if (empty($OPENAI_API_KEY)) {
        throw new Exception('OpenAI API key not configured');
    }

    $url = 'https://api.openai.com/v1/chat/completions';

    $data = [
        'model' => 'gpt-4o-mini', // or gpt-3.5-turbo for cheaper option
        'messages' => [
            ['role' => 'user', 'content' => $prompt]
        ],
        'max_tokens' => $maxTokens,
        'temperature' => 0.7
    ];

    $headers = [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $OPENAI_API_KEY
    ];

    $response = makeApiRequest($url, $data, $headers);

    if (isset($response['choices'][0]['message']['content'])) {
        return ['text' => $response['choices'][0]['message']['content']];
    }

    throw new Exception('No response from OpenAI');
}

/**
 * Call Anthropic API (Claude)
 */
function callAnthropic($prompt, $maxTokens = 500)
{
    global $ANTHROPIC_API_KEY;

    if (empty($ANTHROPIC_API_KEY)) {
        throw new Exception('Anthropic API key not configured');
    }

    $url = 'https://api.anthropic.com/v1/messages';

    $data = [
        'model' => 'claude-3-5-sonnet-20241022',
        'max_tokens' => $maxTokens,
        'messages' => [
            ['role' => 'user', 'content' => $prompt]
        ]
    ];

    $headers = [
        'Content-Type: application/json',
        'x-api-key: ' . $ANTHROPIC_API_KEY,
        'anthropic-version: 2023-06-01'
    ];

    $response = makeApiRequest($url, $data, $headers);

    if (isset($response['content'][0]['text'])) {
        return ['text' => $response['content'][0]['text']];
    }

    throw new Exception('No response from Anthropic');
}

/**
 * Call Cohere API
 */
function callCohere($prompt, $maxTokens = 500)
{
    global $COHERE_API_KEY;

    if (empty($COHERE_API_KEY)) {
        throw new Exception('Cohere API key not configured');
    }

    $url = 'https://api.cohere.ai/v1/generate';

    $data = [
        'model' => 'command',
        'prompt' => $prompt,
        'max_tokens' => $maxTokens,
        'temperature' => 0.7
    ];

    $headers = [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $COHERE_API_KEY
    ];

    $response = makeApiRequest($url, $data, $headers);

    if (isset($response['generations'][0]['text'])) {
        return ['text' => $response['generations'][0]['text']];
    }

    throw new Exception('No response from Cohere');
}

/**
 * Call HuggingFace API
 */
function callHuggingFace($prompt, $maxTokens = 500)
{
    global $HUGGINGFACE_API_KEY, $HUGGINGFACE_MODEL;

    if (empty($HUGGINGFACE_API_KEY)) {
        throw new Exception('HuggingFace API key not configured');
    }

    $model = $HUGGINGFACE_MODEL ?? 'mistralai/Mistral-7B-Instruct-v0.2';
    $url = "https://api-inference.huggingface.co/models/{$model}";

    $data = [
        'inputs' => $prompt,
        'parameters' => [
            'max_new_tokens' => $maxTokens,
            'temperature' => 0.7
        ]
    ];

    $headers = [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $HUGGINGFACE_API_KEY
    ];

    $response = makeApiRequest($url, $data, $headers);

    if (isset($response[0]['generated_text'])) {
        return ['text' => $response[0]['generated_text']];
    }

    throw new Exception('No response from HuggingFace');
}

/**
 * Call OpenRouter API
 * OpenRouter provides unified access to multiple AI models
 */
function callOpenRouter($prompt, $maxTokens = 500)
{
    global $OPENROUTER_API_KEY, $OPENROUTER_MODEL;

    if (empty($OPENROUTER_API_KEY)) {
        throw new Exception('OpenRouter API key not configured');
    }

    $url = 'https://openrouter.ai/api/v1/chat/completions';

    $data = [
        'model' => $OPENROUTER_MODEL ?? 'google/gemini-2.5-flash-lite',
        'messages' => [
            ['role' => 'user', 'content' => $prompt]
        ],
        'max_tokens' => $maxTokens,
        'temperature' => 0.7,
        // Optional: Add metadata for OpenRouter rankings
        'extra_headers' => [
            'HTTP-Referer' => $_SERVER['HTTP_REFERER'] ?? 'https://evolvecode.altervista.org',
            'X-Title' => 'EvolveCode'
        ]
    ];

    $headers = [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $OPENROUTER_API_KEY,
        'HTTP-Referer: ' . ($_SERVER['HTTP_REFERER'] ?? 'https://evolvecode.altervista.org'),
        'X-Title: EvolveCode'
    ];

    $response = makeApiRequest($url, $data, $headers);

    if (isset($response['choices'][0]['message']['content'])) {
        return ['text' => $response['choices'][0]['message']['content']];
    }

    // Handle OpenRouter-specific error format
    if (isset($response['error'])) {
        $errorMsg = $response['error']['message'] ?? 'Unknown OpenRouter error';
        throw new Exception('OpenRouter Error: ' . $errorMsg);
    }

    throw new Exception('No response from OpenRouter');
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Make API request
 */
function makeApiRequest($url, $data, $headers = [])
{
    $ch = curl_init($url);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        $error = curl_error($ch);
        curl_close($ch);
        throw new Exception('cURL error: ' . $error);
    }

    curl_close($ch);

    if ($httpCode !== 200) {
        throw new Exception('API returned status code: ' . $httpCode . ' - ' . $response);
    }

    $decoded = json_decode($response, true);

    if (!$decoded) {
        throw new Exception('Invalid JSON response from API');
    }

    return $decoded;
}

/**
 * Build prompt for code evolution
 */
function buildEvolvePrompt($currentCode, $fromStage, $toStage, $language)
{
    $translations = [
        'en' => 'Evolve this code from %s to %s level. Make it more advanced but keep the same functionality.',
        'es' => 'Evoluciona este código de nivel %s a %s. Hazlo más avanzado pero mantén la misma funcionalidad.',
        'fr' => 'Faites évoluer ce code du niveau %s au niveau %s. Rendez-le plus avancé mais gardez la même fonctionnalité.',
        'zh' => '将此代码从 %s 级别演变为 %s 级别。使其更高级但保持相同的功能。'
    ];

    $template = $translations[$language] ?? $translations['en'];
    $instruction = sprintf($template, $fromStage, $toStage);

    return "{$instruction}\n\nCurrent code:\n{$currentCode}\n\nProvide only the evolved code, no explanations.";
}

/**
 * Build prompt for tutor help
 */
function buildTutorPrompt($query, $code, $stage, $mission, $language)
{
    $stageInstructions = [
        'KIDS' => 'You are a friendly coding tutor for young children (ages 6-10). Use simple words, emojis, and encouragement.',
        'TWEEN' => 'You are a coding tutor for preteens (ages 10-13). Be clear and supportive, introduce proper terminology.',
        'TEEN' => 'You are a coding tutor for teenagers (ages 13-17). Be concise and technical, encourage problem-solving.',
        'PRO' => 'You are a senior software engineer mentor. Provide professional insights and best practices.'
    ];

    $instruction = $stageInstructions[$stage] ?? $stageInstructions['KIDS'];

    $prompt = "{$instruction}\n\n";
    $prompt .= "Student's question: {$query}\n\n";

    if (!empty($code)) {
        $prompt .= "Their current code:\n{$code}\n\n";
    }

    if (!empty($mission)) {
        $prompt .= "Current mission: {$mission}\n\n";
    }

    $prompt .= "Provide a helpful, encouraging response in {$language}.";

    return $prompt;
}

/**
 * Build prompt for mission generation
 */
function buildMissionPrompt($stage, $lesson, $language)
{
    $prompt = "Generate a fun coding mission for a {$stage} level student";

    if ($lesson) {
        $prompt .= " learning about: {$lesson}";
    }

    $prompt .= ". Make it engaging and age-appropriate. Respond in {$language}.";

    return $prompt;
}
