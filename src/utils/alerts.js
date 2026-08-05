export const showAlert = (message, type = 'info') => {
    const modalAlert = document.getElementById('modalAlert');
    if (modalAlert) {
        modalAlert.textContent = message;
        modalAlert.className = `modal-alert ${type}`;
        modalAlert.style.display = 'block';
    }
};

export const hideAlert = () => {
    const modalAlert = document.getElementById('modalAlert');
    if (modalAlert) {
        modalAlert.style.display = 'none';
    }
};
