function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var about_modal_container = document.getElementsByClassName('modal-container')[0];

function about_modal() {
    if (!about_modal_container.style.display || about_modal_container.style.display === 'none')
        about_modal_container.style.display = 'block';
    else
        about_modal_container.style.display = 'none';
}

window.onclick = (ev) => {
    if (ev.target == about_modal_container)
        about_modal_container.style.display = 'none';
};