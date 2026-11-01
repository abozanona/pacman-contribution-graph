<?php
/**
 * receive_stats.php
 * Receives game stats from the GitHub Action and stores them in SQLite.
 *
 * Expected POST body (JSON):
 *   { username, platform, game_type, score, steps, ghosts_eaten }
 */

header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// ──────────────────────────────────────────────
// 1. Parse & validate body
// ──────────────────────────────────────────────
$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody, true);
if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON body']);
    exit;
}

$required = ['username', 'platform', 'game_type', 'score', 'steps', 'ghosts_eaten'];
foreach ($required as $field) {
    if (!isset($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing field: $field"]);
        exit;
    }
}

$username = trim((string) $data['username']);
$platform = trim((string) $data['platform']);
$gameType = trim((string) $data['game_type']);
$score = (int) $data['score'];
$steps = (int) $data['steps'];
$ghostsEaten = (int) $data['ghosts_eaten'];
$timestamp = time();

$allowedGameTypes = ['pacman', 'breakout', 'galaga', 'puzzle-bobble', 'bomberman', 'minesweeper', 'snake', 'tetris'];

// Sanity checks
if (strlen($username) < 1 || strlen($username) > 100) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid username']);
    exit;
}
if (!in_array($platform, ['github', 'gitlab'], true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid platform']);
    exit;
}
if (!in_array($gameType, $allowedGameTypes, true)) {
    $gameType = 'pacman';
}
if ($score < 0 || $steps < 0 || $ghostsEaten < 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Stats must be non-negative']);
    exit;
}

// ──────────────────────────────────────────────
// 3. Store in SQLite
// ──────────────────────────────────────────────
$dbPath = __DIR__ . '/pacman_stats.sqlite';
try {
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create table if not exists
    $pdo->exec('
        CREATE TABLE IF NOT EXISTS stats (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            username     TEXT    NOT NULL,
            platform     TEXT    NOT NULL,
            game_type    TEXT    NOT NULL,
            score        INTEGER NOT NULL,
            steps        INTEGER NOT NULL,
            ghosts_eaten INTEGER NOT NULL,
            timestamp    INTEGER NOT NULL,
            UNIQUE(username, platform, game_type)
        );
        CREATE INDEX IF NOT EXISTS idx_timestamp ON stats(timestamp);
        CREATE INDEX IF NOT EXISTS idx_username ON stats(username);
        CREATE INDEX IF NOT EXISTS idx_game_type ON stats(game_type);
        CREATE INDEX IF NOT EXISTS idx_game_type_timestamp ON stats(game_type, timestamp);
    ');

    $stmt = $pdo->prepare('
        INSERT INTO stats (username, platform, game_type, score, steps, ghosts_eaten, timestamp)
        VALUES (:username, :platform, :game_type, :score, :steps, :ghosts_eaten, :timestamp)
        ON CONFLICT(username, platform, game_type) DO UPDATE SET
            score        = excluded.score,
            steps        = excluded.steps,
            ghosts_eaten = excluded.ghosts_eaten,
            timestamp    = excluded.timestamp
    ');
    $stmt->execute([
        ':username' => $username,
        ':platform' => $platform,
        ':game_type' => $gameType,
        ':score' => $score,
        ':steps' => $steps,
        ':ghosts_eaten' => $ghostsEaten,
        ':timestamp' => $timestamp,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    exit;
}

http_response_code(200);
echo json_encode(['success' => true, 'message' => 'Stats recorded']);