import * as que from './questions.js'
import * as db from './db.js'
let wavesurfer
let audioFilesAmount
const questions = que.q
let userInfo = {}
const $ = (item) => {
    return document.querySelector(item)
}
const renderQuestion = () => {
    let loading
    $("#nextButton").classList.remove("hide")
    $("#playButton").classList.remove("hide")
    $("#playButton").classList.remove("waiting")

    const showQuestions = () => {
        const questionCount = createQuestions()
        $("div.questions").classList.remove("hide")
        $("#nextButton").classList.remove("waiting")
        $("#nextButton").addEventListener("click", () => nextQuestion(questionCount))
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
    const question = questions[fileIndex - 1][`audio${fileIndex - 1}`]

    let innerHTML = ""
    let questionIndex = 0
    for (let audio in question) {
        for (let answer in question[audio]) {

            console.log("answer", answer)
            if (answer == "text") {
                innerHTML += `<div id="explicationWrapper" class="alert alert-primary" role="alert"> ${question[audio]["text"]} ${fileIndex} / ${audioFilesAmount} </div>`
                continue
            }
            // innerHTML +=
            //     `<div class="radioButtonWrapper form-check">  <input type="radio" class="question form-check-input" checked="checked" value="${question[answer]["value"]}" name="radio"> <label class="questionParagraph form-check-label" for="flexRadioDefault1">${question[answer]["text"]}</label><span class="checkmark"></span></div>`
            innerHTML +=
                `<div class="form-check questionWrapper">
                    <input class="form-check-input" type="radio" value="${question[audio][answer]["value"]}" name="flexRadioDefault${questionIndex}" id="flexRadioDefault1">
                    <label class="form-check-label" for="flexRadioDefault1">
                    ${question[audio][answer]["text"]}
                    </label>
                </div>`
        }
        questionIndex++
    }
    $("#questionsWrapper").innerHTML = innerHTML
    return questionIndex
}
const start = () => {
    $("#explicationWrapper").classList.add("hide")
    $("#startButton").removeEventListener("click", start)
    $("#startButton").classList.add("hide")
    $("#playButton").classList.remove("hide")
    renderQuestion()
}

const nextQuestion = (questionCount) => {
    console.log(questionCount)
    const changeClasses = () => {
        $("div.questions").classList.add("hide")
        $("#nextButton").classList.add("waiting")
        $("#playButton").classList.remove("hide")
    }
    const addAnswerToUserInfo = () => {
        for (let i = 0; i < questionCount; i++) {
            const answer = getAnswer(i)
            console.log("Answer : ", answer)
            userInfo[`answer${fileIndex}.${i}`] = answer
            console.log(userInfo)
        }
    }

    addAnswerToUserInfo()
    if (fileIndex >= audioFilesAmount) {
        showSendPage()
        return
    }

    changeClasses()
    renderQuestion()
}

const showSendPage = () => {
    $("#sendButton").addEventListener("click", async (event) => {
        event.preventDefault()
        await db.insertUserInfo(userInfo, audioFilesAmount)
        $("div.sendInfo").classList.add("hide")
        $("#finalDiv").classList.remove("hide")
    })
    $("div.sendInfo").classList.remove("hide")
    $("#test").classList.add("hide")
}

const getAnswer = (questionIndex) => {
    const answers = document.querySelectorAll(`input[name="flexRadioDefault${questionIndex}"]`)
    console.log(answers)
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
