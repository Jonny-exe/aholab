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
        return userInfo
    }
    const userInfo = JSON.stringify(createUserInfo())
    localStorage.setItem("userInfo", userInfo)
    redirect()
}
const redirect = () => {
    window.location.href = "./"
}

$("#continueButton").addEventListener('click', continueTest)
