const $ = (item) => {
    return document.querySelector(item)
}

const continueTest = () => {
    const createUserInfo = () => {
        let userInfo = []
        const inputs = document.getElementsByClassName("userInfoInput")
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value == null || inputs[i].value == undefined || inputs[i].value == "") {
                showAlert()
                return 500
            }
            userInfo.push(inputs[i].value)
        }
        return `name=${userInfo[0]}&experience=${userInfo[1]}&equip=${userInfo[2]}`
    }
    let params = createUserInfo()
    if (params == 500) return
    redirect(params) 
}
const redirect = (params) => {
    window.location.href = "./?" + params
}

$("#continueButton").addEventListener('click', continueTest)

const showAlert = () => {
    $("#alertWrapper").classList.remove("hide")
    $("#alertWrapper").classList.add("show")
}
