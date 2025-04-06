<?php
$targetDir = "uploads/"; // Folder where images will be saved

if (!is_dir($targetDir)) {
    mkdir($targetDir, 0777, true); // Create folder if not exists
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES["image"])) {
    $fileName = basename($_FILES["image"]["name"]);
    $targetFilePath = $targetDir . $fileName;
    
    if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFilePath)) {
        $conn = new mysqli("localhost", "root", "", "image_editing");
        if ($conn->connect_error) {
            die("Database connection failed: " . $conn->connect_error);
        }

        $sql = "INSERT INTO images (image_name, image_path) VALUES ('$fileName', '$targetFilePath')";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "filePath" => $targetFilePath]);
        } else {
            echo json_encode(["success" => false, "error" => "Database error"]);
        }
        $conn->close();
    } else {
        echo json_encode(["success" => false, "error" => "File upload failed"]);
    }
} else {
    echo json_encode(["success" => false, "error" => "No file uploaded"]);
}
?>
