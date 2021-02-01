import * as que from './questions.js'
import * as db from './db.js'
let wavesurfer
let audioFilesAmount
const questions = que.q
let userInfo = {}
let finalValue
const $ = (item) => {
    return document.querySelector(item)
}
const renderQuestion = () => {
    let loading
    $("#nextButton").classList.remove("hide")
    $("#playButton").classList.remove("hide")
    $("#playButton").classList.remove("waiting")

    const showQuestions = () => {
        createQuestions()
        $("div.questions").classList.remove("hide")
        $("#nextButton").classList.remove("waiting")
        $("#nextButton").addEventListener("click", nextQuestion)
        $("#playButton").classList.add("hide")
    }

    const play = () => {
        if (!loading) {
            $("#playButton").classList.add("waiting")
            wavesurfer.play()
        }
    }

    const stopLoader = () => {
        $("#loader").classList.remove("activeLoader")
        console.log("stop")
        loading = false
        wavesurfer.setHeight(100)
    }

    wavesurfer = createWaves()
    loading = true
    console.log(wavesurfer)
    wavesurfer.on("ready", stopLoader)
    wavesurfer.setHeight(0)
    $("#loader").classList.add("activeLoader")
    wavesurfer.on("finish", showQuestions)
    $("#playButton").addEventListener("click", play)
}

const createQuestions = () => {
    const question = questions[fileIndex - 1]
    let finalHTML = `<p class="questionText"> ${question["text"]} ${fileIndex} / ${audioFilesAmount} </p>`
    let innerHTML = ""
    let i = 0
    for (let answer in question) {
        console.log("answer", answer)
        if (answer == "text") continue
        innerHTML +=
            `<div class="radioButtonWrapper">  <input type="radio" class="question" checked="checked" value="${i}" name="radio"> <p class="questionParagraph">${question[answer]["text"]}</p><span class="checkmark"></span></div>`
        i++
    }
    finalHTML = finalHTML + innerHTML
    $("#questionsWrapper").innerHTML = finalHTML
}
const start = () => {
    $("#explicationWrapper").classList.add("hide")
    $("#startButton").removeEventListener("click", start)
    $("#startButton").classList.add("hide")
    $("#playButton").classList.remove("hide")
    renderQuestion()
}

const nextQuestion = () => {
    const changeClasses = () => {
        $("div.questions").classList.add("hide")
        $("#nextButton").classList.add("waiting")
        $("#playButton").classList.remove("hide")
    }
    const addAnswerToUserInfo = () => {
        const answer = getAnswer()
        userInfo[`answer${fileIndex}`] = answer
    }

    addAnswerToUserInfo()

    if (fileIndex >= audioFilesAmount - 1) {
        showSendPage()
        return
    }

    changeClasses()
    renderQuestion()
}

const showSendPage = () => {
    $("#sendButton").addEventListener("click", async (event) => {
        event.preventDefault()
        await db.insertUserInfo(userInfo)
        $("div.sendInfo").classList.add("hide")
        $("#finalDiv").classList.remove("hide")
    })
    $("div.sendInfo").classList.remove("hide")
    $("#test").classList.add("hide")
}

const getAnswer = () => {
    const answers = document.querySelectorAll("input.question")
    let value
    for (let answerIndex in answers) {
        const answer = answers[answerIndex]
        if (answer.checked) {
            value = answer.value
            break
        }
    }
    return value
}

let fileIndex = 0

const createWaves = () => {
    if (wavesurfer != undefined) {
        wavesurfer.destroy()
    }
    var localWavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#005599',
        progressColor: '#7FC5FF'
    });
    localWavesurfer.load(`./audios/${fileIndex}.wav`);
    fileIndex++
    return localWavesurfer
}

// LOGIN 
const showAlert = () => {
    $("#alertWrapper").classList.remove("hide")
    $("#alertWrapper").classList.add("show")
}

const getUserInfo = () => {
    let userInfoList = []
    const getInfo = () => {
        const infoList = ["name", "experience", "equip"]
        const inputs = document.getElementsByClassName("userInfoInput")
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value == null || inputs[i].value == undefined || inputs[i].value == "") {
                showAlert()
                return false
            }
            userInfoList.push(inputs[i].value)
        }

        userInfo = {
            name: userInfoList[0],
            experience: userInfoList[1],
            equip: userInfoList[2]
        }
        return true
    }
    const continueLogin = () => {
        $("#loginWrapper").classList.add("hide")
        $("#testWrapper").classList.remove("hide")
    }
    let valid = getInfo()
    if (!valid) return
    continueLogin()

}

const init = async () => {
    $("#startButton").addEventListener("click", start)
    audioFilesAmount = await db.getAudioFileAmount()
    if (audioFilesAmount == -1) showAlert()
    $("#continueButton").addEventListener('click', getUserInfo)
}
init()