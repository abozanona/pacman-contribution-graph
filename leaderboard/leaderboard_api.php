<?php
/**
 * leaderboard_api.php
 * Returns the top-10 players for each leaderboard category,
 * considering only entries submitted in the last 3 days.
 *
 * GET /leaderboard_api.php?game_type=pacman
 * Response: { top_score: [...], fastest: [...], ghost_hunter: [...], game_type: 'pacman' }
 *
 * Each entry has: { rank, username, platform, game_type, value, date }
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dbPath = __DIR__ . '/pacman_stats.sqlite';
$allowedGameTypes = ['pacman', 'breakout', 'galaga', 'puzzle-bobble', 'bomberman', 'minesweeper', 'snake'];
$rawGameType = $_GET['game_type'] ?? $_GET['game'] ?? null;
$gameType = 'pacman';
$isAllGameTypes = false;

if ($rawGameType !== null) {
    $parsedGameType = strtolower(trim((string) $rawGameType));
    if ($parsedGameType === '') {
        $isAllGameTypes = true;
    } elseif (in_array($parsedGameType, $allowedGameTypes, true)) {
        $gameType = $parsedGameType;
    }
}

if (!file_exists($dbPath)) {
    // Return empty leaderboard if no data yet
    echo json_encode([
        'top_score' => [],
        'fastest' => [],
        'ghost_hunter' => [],
        'game_type' => $isAllGameTypes ? '' : $gameType,
        'generated_at' => date('c'),
        'window_days' => 3,
    ], JSON_PRETTY_PRINT);
    exit;
}

try {
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Only look at entries from the last 3 days
    $cutoff = time() - (3 * 24 * 60 * 60);

    // Helper: build a top-10 for a given metric
    // For top_score / ghost_hunter  → MAX is best
    // For fastest                   → MIN steps is best (but only complete runs, steps > 0)
    $buildTop = function (string $metric, string $direction, int $limit = 10) use ($pdo, $cutoff, $gameType, $isAllGameTypes): array {
        $query = '
            SELECT
                username,
                platform,
                game_type,
                ' . $metric . ' AS value,
                timestamp
            FROM stats
            WHERE timestamp >= :cutoff
              ' . ($isAllGameTypes ? '' : 'AND game_type = :game_type') . '
              AND steps > 0
            ORDER BY value ' . $direction . ', timestamp DESC, username ASC
            LIMIT :limit
        ';

        $stmt = $pdo->prepare($query);
        $stmt->bindValue(':cutoff', $cutoff, PDO::PARAM_INT);
        if (!$isAllGameTypes) {
            $stmt->bindValue(':game_type', $gameType, PDO::PARAM_STR);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $result = [];

        foreach ($rows as $index => $row) {
            $result[] = [
                'rank' => $index + 1,
                'username' => $row['username'],
                'platform' => $row['platform'],
                'game_type' => $row['game_type'],
                'value' => (int) $row['value'],
                'date' => date('Y-m-d', (int) $row['timestamp']),
            ];
        }

        return $result;
    };

    $response = [
        'top_score' => $buildTop('score', 'DESC'),
        'fastest' => $buildTop('steps', 'ASC'),
        'ghost_hunter' => $buildTop('ghosts_eaten', 'DESC'),
        'game_type' => $isAllGameTypes ? '' : $gameType,
        'generated_at' => date('c'),
        'window_days' => 3,
    ];

    echo json_encode($response, JSON_PRETTY_PRINT);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}