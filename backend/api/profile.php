<?php

require_once "../config/db.php";
require_once "../includes/response.php";

session_start();

if (!isset($_SESSION["user_id"])) {
    sendResponse(false, "Unauthorized. Please login first.");
}

$userId = $_SESSION["user_id"];

try {
    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        $stmt = $conn->prepare("SELECT user_id, full_name, email, role, phone, department, bio, created_at FROM users WHERE user_id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            sendResponse(false, "User profile not found.");
        }

        sendResponse(true, "Profile fetched successfully.", $user);
    }

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $data = json_decode(file_get_contents("php://input"), true);

        $fullName = trim($data["full_name"] ?? "");
        $phone = trim($data["phone"] ?? "");
        $department = trim($data["department"] ?? "");
        $bio = trim($data["bio"] ?? "");

        if ($fullName === "") {
            sendResponse(false, "Full name is required.");
        }

        $stmt = $conn->prepare("UPDATE users SET full_name = ?, phone = ?, department = ?, bio = ? WHERE user_id = ?");
        $stmt->execute([$fullName, $phone, $department, $bio, $userId]);

        $_SESSION["full_name"] = $fullName;

        sendResponse(true, "Profile updated successfully.");
    }

    sendResponse(false, "Invalid request method.");

} catch (PDOException $e) {
    sendResponse(false, "Profile request failed.", $e->getMessage());
}

?>