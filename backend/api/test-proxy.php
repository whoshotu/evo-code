<?php
/**
 * Test the Node proxy connection
 * Visit: https://hereisreal.altervista.org/evolve-code/backend/api/test-proxy.php
 */

require_once __DIR__ . '/../config/config.php';

header('Content-Type: application/json');

$nodeProxyUrl = NODE_PROXY_URL ?? 'http://192.9.249.5:3000';

echo json_encode([
    'test' => 'Node Proxy Connection',
    'proxy_url' => $nodeProxyUrl,
    'timestamp' => date('Y-m-d H:i:s')
], JSON_PRETTY_PRINT);

echo "\n\n";

// Test 1: Check if cURL is available
echo "=== Test 1: cURL Extension ===\n";
if (extension_loaded('curl')) {
    echo "✅ cURL is available\n";
} else {
    echo "❌ cURL is NOT available\n";
    exit;
}

// Test 2: Try to reach the proxy with a simple request
echo "\n=== Test 2: Connect to Node Proxy ===\n";
echo "Attempting to reach: $nodeProxyUrl/\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $nodeProxyUrl . '/');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    echo "❌ cURL Error: $curlError\n";
} else {
    echo "✅ Connected! HTTP Code: $httpCode\n";
    echo "Response: $response\n";
}

// Test 3: Try to call /api/validateKey
echo "\n=== Test 3: Call /api/validateKey ===\n";
echo "POST to: $nodeProxyUrl/api/validateKey\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $nodeProxyUrl . '/api/validateKey');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['model' => 'arcee-ai/trinity-large-preview:free']));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
if ($curlError) {
    echo "❌ cURL Error: $curlError\n";
} else {
    echo "✅ Response received:\n";
    echo json_encode(json_decode($response, true), JSON_PRETTY_PRINT) . "\n";
}

echo "\n=== Diagnostics Complete ===\n";
?>
