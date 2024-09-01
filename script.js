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


