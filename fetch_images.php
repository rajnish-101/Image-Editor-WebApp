<?php
include 'db.php';

$sql = "SELECT image_name FROM images";
$result = $conn->query($sql);

$images = [];
while ($row = $result->fetch_assoc()) {
    $images[] = $row['image_name'];
}

echo json_encode($images);
?>
