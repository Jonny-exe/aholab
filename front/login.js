const $ = (item) => {
    return document.querySelector(item)
}

const redirect = () => {
    window.location.replace("./")
}
$("#continueButton").addEventListener('click', redirect)
