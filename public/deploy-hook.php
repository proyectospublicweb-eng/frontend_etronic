<?php
// Receptor seguro de despliegue automático desde GitHub Actions vía HTTPS (Puerto 443)
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method Not Allowed']);
    exit;
}

// Hash SHA-256 irreversible del secret DEPLOY_TOKEN configurado en GitHub Actions
$expectedHash = '74aa6deba90d4d37b9846ddad2d6a31dccc8047ec919b67179344ee62438fdfb';
$providedToken = isset($_SERVER['HTTP_X_DEPLOY_TOKEN']) ? trim($_SERVER['HTTP_X_DEPLOY_TOKEN']) : '';

if ($providedToken === '' || !hash_equals($expectedHash, hash('sha256', $providedToken))) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Forbidden: Invalid deploy token']);
    exit;
}

$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody, true);

if (!is_array($data) || empty($data['target']) || empty($data['files']) || !is_array($data['files'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid payload']);
    exit;
}

$target = $data['target'];
$baseDir = null;

if ($target === 'frontend') {
    // Document Root exacto de etronic.com.mx donde vive este archivo
    $baseDir = __DIR__;
} elseif ($target === 'backend') {
    // Buscar exclusivamente backend_etronic dentro del home de la cuenta cPanel
    $candidates = [
        dirname(__DIR__, 1) . '/backend_etronic',
        dirname(__DIR__, 2) . '/backend_etronic',
        dirname(__DIR__, 3) . '/backend_etronic',
    ];
    foreach ($candidates as $candidate) {
        if (is_dir($candidate)) {
            $baseDir = $candidate;
            break;
        }
    }
} else {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Unknown target']);
    exit;
}

if ($baseDir === null || !is_dir($baseDir)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Target directory backend_etronic not found']);
    exit;
}

$written = [];
foreach ($data['files'] as $relPath => $b64Content) {
    $cleanPath = ltrim(str_replace('\\', '/', (string) $relPath), '/');
    if (
        $cleanPath === '' ||
        strpos($cleanPath, '..') !== false ||
        $cleanPath === '.htaccess' ||
        (strpos($cleanPath, '.env') === 0 && $cleanPath !== '.env.example') ||
        strpos($cleanPath, 'apietronic/') === 0 ||
        strpos($cleanPath, '.well-known/') === 0 ||
        strpos($cleanPath, 'cgi-bin/') === 0 ||
        strpos($cleanPath, 'node_modules/') === 0 ||
        strpos($cleanPath, 'data/') === 0 ||
        $cleanPath === '.user.ini' ||
        $cleanPath === 'php.ini'
    ) {
        continue;
    }

    $fullPath = $baseDir . '/' . $cleanPath;
    $dirPath = dirname($fullPath);
    if (!is_dir($dirPath)) {
        mkdir($dirPath, 0755, true);
    }

    $decoded = base64_decode((string) $b64Content, true);
    if ($decoded !== false) {
        file_put_contents($fullPath, $decoded);
        $written[] = $cleanPath;
    }
}

if ($target === 'backend') {
    $tmpDir = $baseDir . '/tmp';
    if (!is_dir($tmpDir)) {
        @mkdir($tmpDir, 0755, true);
    }
    $restartFile = $tmpDir . '/restart.txt';
    @file_put_contents($restartFile, gmdate('c') . "\n");
    @touch($restartFile);
}

echo json_encode([
    'ok' => true,
    'target' => $target,
    'updated_files' => count($written),
    'files' => $written,
]);
