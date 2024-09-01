function loadHTML(id, url) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
    });
}

document.addEventListener('DOMContentLoaded', function() {
  loadHTML('header', 'header.html');
  loadHTML('footer', 'footer.html');
});
// Show loader
function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}

// Hide loader
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

// Show error modal
function showErrorModal(message) {
    const modal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    const closeModal = document.getElementById('closeErrorModal');

    errorMessage.textContent = message;
    modal.style.display = 'block';

    closeModal.onclick = function() {
        modal.style.display = 'none';
    }
}

// Show success modal
function showSuccessModal(message) {
    const modal = document.getElementById('successModal');
    const successMessage = document.getElementById('successMessage');
    const closeModal = document.getElementById('closeSuccessModal');

    successMessage.textContent = message;
    modal.style.display = 'block';

    closeModal.onclick = function() {
        modal.style.display = 'none';
    }
}

// Function to load common HTML content
function loadGlobalComponents() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'common.html', true);
    xhr.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            document.body.insertAdjacentHTML('beforeend', this.responseText);
        } else {
            console.error('Failed to load global components.');
        }
    };
    xhr.send();
}

// Load common content on page load
window.addEventListener('DOMContentLoaded', loadGlobalComponents);


