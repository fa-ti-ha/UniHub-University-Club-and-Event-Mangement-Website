<?php

require_once "../config/db.php";
require_once "../includes/response.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if ($email === "" || $password === "") {
    sendResponse(false, "Missing email or password.");
}

try {
    $stmt = $conn->prepare("SELECT user_id, full_name, email, password, role FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user["password"])) {
        sendResponse(false, "Invalid email or password.");
    }

    session_start();

    $_SESSION["user_id"] = $user["user_id"];
    $_SESSION["full_name"] = $user["full_name"];
    $_SESSION["email"] = $user["email"];
    $_SESSION["role"] = $user["role"];

    sendResponse(true, "Login successful.", [
        "user" => [
            "user_id" => $user["user_id"],
            "full_name" => $user["full_name"],
            "email" => $user["email"],
            "role" => $user["role"]
        ]
    ]);

} catch (PDOException $e) {
    sendResponse(false, "Login failed.", $e->getMessage());
}

?>