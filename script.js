// Function to load Global Components
function loadGlobalComponents() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'global-components.html', true);
    xhr.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            document.body.insertAdjacentHTML('beforeend', this.responseText);
        } else {
            console.error('Failed to load global components.');
        }
    };
    xhr.send();
}

// Show loader
function showLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'flex';
    } else {
        console.error('Loader element not found.');
    }
}

// Hide loader
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    } else {
        console.error('Loader element not found.');
    }
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
function loadHTML(id, url) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
    });
}

// Load global components content on page load
document.addEventListener('DOMContentLoaded', function() {
    loadGlobalComponents();

    loadHTML('header', 'header.html');
    loadHTML('footer', 'footer.html');
});

