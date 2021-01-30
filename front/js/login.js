const $ = (item) => {
    return document.querySelector(item)
}

const continueTest = () => {
    const createUserInfo = () => {
        let userInfo = []
        const inputs = document.getElementsByClassName("userInfoInput")
        for (let i = 0; i < inputs.length; i++) {
            userInfo.push(inputs[i].value)
        }
        console.log(userInfo)
        return `name=${userInfo[0]}&experience=${userInfo[1]}&equip=${userInfo[2]}`
    }
    let params = createUserInfo()
    redirect(params)
}
const redirect = (params) => {
    window.location.href = "./?" + params
}

$("#continueButton").addEventListener('click', continueTest)
