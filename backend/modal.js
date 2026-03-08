function openModal() {
    document.getElementById('dataModal').style.display = 'block';
    backToForm();
}

function closeModal() {
    document.getElementById('dataModal').style.display = 'none';
}

function showPreview() {
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const major = document.getElementById('major').value;
    const gpa = document.getElementById('gpa').value;

    if (!name || !age || !major || !gpa) {
        alert("Заполните все поля!");
        return;
    }

    document.getElementById('modalContent').innerHTML = `
        <b>Имя:</b> ${name}<br>
        <b>Возраст:</b> ${age}<br>
        <b>Факультет:</b> ${major}<br>
        <b>GPA:</b> ${gpa}
    `;

    document.getElementById('formStep').style.display = 'none';
    document.getElementById('previewStep').style.display = 'block';
}

function backToForm() {
    document.getElementById('formStep').style.display = 'block';
    document.getElementById('previewStep').style.display = 'none';
}

window.onclick = function(event) {
    let modal = document.getElementById('dataModal');
    if (event.target == modal) closeModal();
}
