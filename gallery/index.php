<?php
  /* Script to fetch images from the gallery folder, which can be sent
  the client for showing in the SlideShow
  */
  if (array_key_exists('page', $_GET)) {
    // Gallery dir contains subdir which corresponds to the requested page
    // variable. All image files with the png or jpeg extension are retrieved
    $real_path = realpath('.') . '/' . $_GET['page'] . '/';
    $images = array_filter(scandir($real_path), function($x){
      $file_info = pathinfo($x);
      $extension = strtolower($file_info['extension']);
      return $extension === 'jpg' || $extension === 'png' || $extension === 'jpeg';
    });
    $imagesWithFullPath = array_map(function($file) {
      return "\"" . 'gallery/' . $_GET['page'] . '/' .$file . "\"";
    }, $images );
  }
  echo '{"imageFiles": [' . implode($imagesWithFullPath, ',') . ']}';
 ?>
