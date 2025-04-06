<?php
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES["image"])) {
    $targetDir = "uploads/";
    $imageName = basename($_FILES["image"]["name"]);
    $targetFile = $targetDir . $imageName;

    if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
        $sql = "INSERT INTO images (image_name) VALUES ('$imageName')";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success", "image" => $imageName]);
        } else {
            echo json_encode(["status" => "error"]);
        }
    } else {
        echo json_encode(["status" => "upload_failed"]);
    }
}
?>
