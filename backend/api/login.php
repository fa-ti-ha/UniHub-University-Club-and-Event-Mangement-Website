<?php
require_once "../config/db.php";
require_once "../includes/response.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data['email'] || !$data['password']) {
    sendResponse(false, "Missing email or password.");
}

$email = $data['email'];
$password = $data['password'];

try {
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password'])) {
        sendResponse(false, "Invalid credentials.");
    }

    session_start();
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role'] = $user['role'];

    sendResponse(true, "Login successful.", ["role" => $user['role']]);
} catch (PDOException $e) {
    sendResponse(false, "Login failed: " . $e->getMessage());
}
?>