<?php
namespace views;
class AtelierView implements IView {
  private \WP_POST $page;
  function __construct(\WP_POST $page) {
    $this -> page = $page;
  }
  function display(): string {
    return '<div class="atelier">
        <div class="zoom-image"></div>
        <ul class="atelier-image-list"></ul>
      </div>';
  }
}
?>