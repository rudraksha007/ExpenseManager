function closePopup(e, reset){
    const form = e.target.nextElementSibling;
    if (form && form.tagName === 'form') {
        form.reset();
    }
    reset();
}

export { closePopup };