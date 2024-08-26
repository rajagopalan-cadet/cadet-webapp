document.addEventListener('DOMContentLoaded', function() {
    const fetchTrainerBtn = document.getElementById('fetchTrainerBtn');
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const trainerDetails = document.getElementById('trainerDetails');

    let initialValues = {};

    // Fetch Trainer Details
    fetchTrainerBtn.addEventListener('click', function() {
        const trainerId = document.getElementById('trainerId').value;
        if (!trainerId) {
            alert('Please enter a Trainer ID');
            return;
        }

        fetch(`/api/trainer/${trainerId}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    // Store initial values
                    initialValues = {
                        firstname: data.firstname,
                        lastname: data.lastname,
                        email: data.email,
                        profession: data.profession,
                        nccDirectorate: data.nccDirectorate,
                        nccWing: data.nccWing
                    };

                    // Populate form fields
                    document.getElementById('firstname').value = data.firstname;
                    document.getElementById('lastname').value = data.lastname;
                    document.getElementById('email').value = data.email;
                    document.getElementById('profession').value = data.profession;
                    document.getElementById('nccDirectorate').value = data.nccDirectorate;
                    document.getElementById('nccWing').value = data.nccWing;

                    // Enable fields
                    trainerDetails.disabled = false;

                    // Show edit button and hide other buttons
                    editBtn.style.display = 'inline';
                    saveBtn.style.display = 'none';
                    cancelBtn.style.display = 'none';
                } else {
                    alert('Trainer not found');
                }
            })
            .catch(error => console.error('Error fetching trainer details:', error));
    });

    // Enter Edit Mode
    editBtn.addEventListener('click', function() {
        // Enable editing
        document.querySelectorAll('#trainerDetails input, #trainerDetails select').forEach(element => {
            element.disabled = false;
        });

        // Show save and cancel buttons
        saveBtn.style.display = 'inline';
        cancelBtn.style.display = 'inline';
        editBtn.style.display = 'none';
    });

    // Save Changes
    saveBtn.addEventListener('click', function() {
        const trainerId = document.getElementById('trainerId').value;
        const updatedData = {
            firstname: document.getElementById('firstname').value,
            lastname: document.getElementById('lastname').value,
            email: document.getElementById('email').value,
            profession: document.getElementById('profession').value,
            nccDirectorate: document.getElementById('nccDirectorate').value,
            nccWing: document.getElementById('nccWing').value
        };

        fetch(`/api/trainer/${trainerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Trainer details updated successfully');

                    // Disable fields and hide buttons
                    document.querySelectorAll('#trainerDetails input, #trainerDetails select').forEach(element => {
                        element.disabled = true;
                    });

                    saveBtn.style.display = 'none';
                    cancelBtn.style.display = 'none';
                    editBtn.style.display = 'inline';
                } else {
                    alert('Error updating trainer details');
                }
            })
            .catch(error => console.error('Error saving trainer details:', error));
    });

    // Cancel Edits
    cancelBtn.addEventListener('click', function() {
        // Revert to initial values
        document.getElementById('firstname').value = initialValues.firstname;
        document.getElementById('lastname').value = initialValues.lastname;
        document.getElementById('email').value = initialValues.email;
        document.getElementById('profession').value = initialValues.profession;
        document.getElementById('nccDirectorate').value = initialValues.nccDirectorate;
        document.getElementById('nccWing').value = initialValues.nccWing;

        // Disable fields and hide buttons
        document.querySelectorAll('#trainerDetails input, #trainerDetails select').forEach(element => {
            element.disabled = true;
        });

        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
        editBtn.style.display = 'inline';
    });

    // Initially disable fields
    document.querySelectorAll('#trainerDetails input, #trainerDetails select').forEach(element => {
        element.disabled = true;
    });
});
