document.addEventListener('DOMContentLoaded', () => {
    const fetchBtn = document.getElementById('fetchBtn');
    const trainerForm = document.getElementById('trainerForm');
    const editBtn = document.getElementById('editBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveBtn');
    const trainerIdInput = document.getElementById('trainerId');
    let initialValues = {};

    fetchBtn.addEventListener('click', () => {
        const trainerId = trainerIdInput.value;

        if (trainerId) {
            // Fetch trainer details from Salesforce API
            fetchTrainerDetails(trainerId).then(details => {
                populateForm(details);
                trainerForm.classList.remove('hidden');
                fetchBtn.classList.add('hidden');
                editBtn.classList.remove('hidden');
            });
        }
    });

    editBtn.addEventListener('click', () => {
        toggleEditable(true);
        storeInitialValues();
        editBtn.classList.add('hidden');
        cancelBtn.classList.remove('hidden');
        saveBtn.classList.remove('hidden');
    });

    cancelBtn.addEventListener('click', () => {
        revertToInitialValues();
        toggleEditable(false);
        cancelBtn.classList.add('hidden');
        saveBtn.classList.add('hidden');
        editBtn.classList.remove('hidden');
    });

    saveBtn.addEventListener('click', () => {
        const updatedDetails = gatherFormData();
        // Save updated details to Salesforce API
        saveTrainerDetails(updatedDetails).then(() => {
            toggleEditable(false);
            cancelBtn.classList.add('hidden');
            saveBtn.classList.add('hidden');
            editBtn.classList.remove('hidden');
        });
    });

    function fetchTrainerDetails(trainerId) {
        // Replace with actual API call
        return fetch(`/api/trainers/${trainerId}`)
            .then(response => response.json());
    }

    function saveTrainerDetails(details) {
        // Replace with actual API call
        return fetch(`/api/trainers/${details.trainerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(details),
        });
    }

    function populateForm(details) {
        document.getElementById('cadetTrainerId').value = details.cadetTrainerId || '';
        document.getElementById('cadetOfficialEmail').value = details.cadetOfficialEmail || '';
        document.getElementById('firstname').value = details.firstname || '';
        document.getElementById('lastname').value = details.lastname || '';
        document.getElementById('contactNumber').value = details.contactNumber || '';
        document.getElementById('email').value = details.email || '';
        document.getElementById('address').value = details.address || '';
        document.getElementById('profession').value = details.profession || '';
        document.getElementById('nccDirectorateUnit').value = details.nccDirectorateUnit || '';
        document.getElementById('nccDirectorate').value = details.nccDirectorate || '';
        document.getElementById('nccWing').value = details.nccWing || '';
        document.getElementById('yepYear').value = details.yepYear || '';
        document.getElementById('yepCountry').value = details.yepCountry || '';
        document.getElementById('nccaaMembershipNumber').value = details.nccaaMembershipNumber || '';
    }

    function gatherFormData() {
        return {
            trainerId: trainerIdInput.value,
            cadetTrainerId: document.getElementById('cadetTrainerId').value,
            cadetOfficialEmail: document.getElementById('cadetOfficialEmail').value,
            firstname: document.getElementById('firstname').value,
            lastname: document.getElementById('lastname').value,
            contactNumber: document.getElementById('contactNumber').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            profession: document.getElementById('profession').value,
            nccDirectorateUnit: document.getElementById('nccDirectorateUnit').value,
            nccDirectorate: document.getElementById('nccDirectorate').value,
            nccWing: document.getElementById('nccWing').value,
            yepYear: document.getElementById('yepYear').value,
            yepCountry: document.getElementById('yepCountry').value,
            nccaaMembershipNumber: document.getElementById('nccaaMembershipNumber').value,
        };
    }

    function toggleEditable(isEditable) {
        const inputs = document.querySelectorAll('#trainerForm input, #trainerForm select');
        inputs.forEach(input => {
            if (isEditable) {
                input.classList.add('editable');
                input.removeAttribute('readonly');
            } else {
                input.classList.remove('editable');
                input.setAttribute('readonly', true);
            }
        });
   
