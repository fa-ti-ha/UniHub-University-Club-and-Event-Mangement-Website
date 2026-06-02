<?php

require_once "../config/db.php";
require_once "../includes/response.php";

try {
    $query = "SELECT * FROM clubs ORDER BY created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();

    $clubs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    sendResponse(true, "Clubs fetched successfully.", $clubs);

} catch (PDOException $e) {
    sendResponse(false, "Failed to fetch clubs.", $e->getMessage());
}

?>