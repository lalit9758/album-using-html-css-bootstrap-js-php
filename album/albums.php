<?php
$action = $_REQUEST['action'] ?? '';

if ($action === 'create') {
    $dirname = $_POST['dirname'];
    $dirpath = "albums/" . $dirname;

    if (!file_exists($dirpath)) {
        mkdir($dirpath, 0777, true);
        echo "Album created successfully!";
    } else {
        echo "Album already exists.";
    }
} elseif ($action === 'upload') {
    $album = $_POST['album'];
    $albumPath = "albums/" . $album;

    if (isset($_FILES['file'])) {
        $file = $_FILES['file'];
        $fileName = $file['name'];
        $fileTmpName = $file['tmp_name'];
        $filePath = $albumPath . "/" . $fileName;

        if (file_exists($filePath)) {
            $filePath = $albumPath . "/" . time() . "_" . $fileName; // Rename if file exists
        }

        if (move_uploaded_file($fileTmpName, $filePath)) {
            echo "Image uploaded successfully!";
        } else {
            echo "Failed to upload image.";
        }
    }
} elseif ($action === 'load') {
    $albums = glob('albums/*', GLOB_ONLYDIR);

    if ($albums) {
        foreach ($albums as $album) {
            $albumName = basename($album);
            echo "
              <div class='m-3 col-lg-2 col-md-3 col-sm-4 text-center'>
                <i class='bi bi-folder2-open icon album-folder' data-album='$albumName'></i>
                <h2>$albumName</h2>
                <button class='btn btn-danger btn-sm delete-album' data-album='$albumName'>Delete</button>
              </div>
            ";
        }
    } else {
        echo "No albums found.";
    }
} elseif ($action === 'loadImages') {
    $album = $_GET['album'];
    $albumPath = "albums/" . $album;
    $images = glob("$albumPath/*.{jpg,jpeg,png,gif}", GLOB_BRACE);

    if ($images) {
        foreach ($images as $image) {
            $imageUrl = $image;
            $imageName = basename($image);
            $uploadTime = date("F d Y H:i:s", filemtime($image));
            echo "
                <div class='m-3 col-lg-2 col-md-3 col-sm-4 text-center'>
                    <img src='$imageUrl' class='img-thumbnail' data-image='$imageUrl' data-bs-toggle='modal' data-bs-target='#exampleModal' >
                    <h3 class='text-truncate' style='max-width: 100%;'>$imageName</h3>
                    <p>$uploadTime</p>
                    <button class='btn btn-danger btn-sm delete-image' data-image='$imageUrl'>Delete</button>
                </div>
            ";
        }
    } else {
        echo "No images found in this album.";
    }
} elseif ($action === 'deleteImage') {
    $image = $_GET['image'];
    if (file_exists($image)) {
        unlink($image);
        echo "Image deleted successfully!";
    } else {
        echo "Image not found.";
    }
} elseif ($action === 'deleteAlbum') {
    $album = $_GET['album'];
    $albumPath = "albums/" . $album;
    if (is_dir($albumPath)) {
        array_map('unlink', glob("$albumPath/*.*"));  // Delete all files in the album
        rmdir($albumPath);  // Remove the directory
        echo "Album deleted successfully!";
    } else {
        echo "Album not found.";
    }
}
?>
