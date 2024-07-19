document.addEventListener("DOMContentLoaded", function() {
    const albumForm = document.getElementById("albumForm");
    const messageDiv = document.getElementById("message");
    const displayDiv = document.getElementById("display");
    const albumsContainer = document.getElementById("albumsContainer");
    const albumImagesContainer = document.getElementById("albumImagesContainer");
    const albumImagesDisplay = document.getElementById("albumImagesDisplay");
    const currentAlbumInput = document.getElementById("currentAlbum");
    const modalImage = document.getElementById("modalImage");
    const dircreator = document.getElementById("dircreator");
    const backButton = document.getElementById("backButton");
    const deleteImageButton = document.getElementById("deleteImageButton");
    const imageModal = document.getElementById("imageModal");

    function loadAlbums() {
      fetch('albums.php?action=load')
        .then(response => response.text())
        .then(data => displayDiv.innerHTML = data);
    }

    loadAlbums();

    albumForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const formData = new FormData(albumForm);
      formData.append('action', 'create');
      fetch('albums.php', {
        method: 'POST',
        body: formData
      })
      .then(response => response.text())
      .then(data => {
        messageDiv.innerHTML = data;
        loadAlbums();
      });
    });

    displayDiv.addEventListener("click", function(e) {
      if (e.target && e.target.classList.contains('album-folder')) {
        const albumName = e.target.getAttribute('data-album');
        currentAlbumInput.value = albumName;
        loadAlbumImages(albumName);
        dircreator.style.display = 'none';
        albumsContainer.style.display = 'none';
        albumImagesContainer.style.display = 'block';
      }

      if (e.target && e.target.classList.contains('delete-album')) {
        const albumName = e.target.getAttribute('data-album');
        if (confirm(`Are you sure you want to delete the album "${albumName}"?`)) {
          fetch(`albums.php?action=deleteAlbum&album=${encodeURIComponent(albumName)}`)
            .then(response => response.text())
            .then(data => {
              alert(data);
              loadAlbums();
            });
        }
      }
    });

    albumImagesDisplay.addEventListener("click", function(e) {
      if (e.target && e.target.classList.contains('img-thumbnail')) {
        const src = e.target.getAttribute('src');
        modalImage.setAttribute('src', src);
        imageModal.show();
      }

      if (e.target && e.target.classList.contains('delete-image')) {
        const imageToDelete = e.target.getAttribute('data-image');
        if (confirm(`Are you sure you want to delete this image?`)) {
          fetch(`albums.php?action=deleteImage&image=${encodeURIComponent(imageToDelete)}`)
            .then(response => response.text())
            .then(data => {
              alert(data);
              loadAlbumImages(currentAlbumInput.value);
              const imageModalInstance = bootstrap.Modal.getInstance(document.getElementById('imageModal'));
              imageModalInstance.hide();
            });
        }
      }
    });

    const imageUploadForm = document.getElementById("imageUploadForm");
    imageUploadForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const formData = new FormData(imageUploadForm);
      formData.append('action', 'upload');
      fetch('albums.php', {
        method: 'POST',
        body: formData
      })
      .then(response => response.text())
      .then(data => {
        alert(data);
        loadAlbumImages(currentAlbumInput.value);
      });
    });

    backButton.addEventListener("click", function() {
      albumImagesContainer.style.display = 'none';
      albumsContainer.style.display = 'block';
      dircreator.style.display = 'block';
    });

    deleteImageButton.addEventListener("click", function() {
      const imageToDelete = modalImage.getAttribute('src');
      if (confirm(`Are you sure you want to delete this image?`)) {
        fetch(`albums.php?action=deleteImage&image=${encodeURIComponent(imageToDelete)}`)
          .then(response => response.text())
          .then(data => {
            alert(data);
            loadAlbumImages(currentAlbumInput.value);
            const imageModalInstance = bootstrap.Modal.getInstance(document.getElementById('imageModal'));
            imageModalInstance.hide();
          });
      }
    });

    function loadAlbumImages(albumName) {
      fetch('albums.php?action=loadImages&album=' + albumName)
        .then(response => response.text())
        .then(data => albumImagesDisplay.innerHTML = data);
    }
});
