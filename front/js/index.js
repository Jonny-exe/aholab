import * as que from './questions.js'
import * as db from './db.js'
import * as env from './env.js'

let wavesurfer
let audioFilesAmount
const questions = que.q
let questionCount
let userInfo = {}
const $ = (item) => {
    return document.querySelector(item)
}
const renderQuestion = () => {
    let loading
    let playCount = 0
    $("#nextButton").classList.remove("hide")
    $("#playButton").classList.remove("hide")
    $("#playButton").classList.remove("waiting")

    const showQuestions = () => {
        if (playCount === 0) {
            $("#playButton").classList.remove("waiting")
            playCount++
            return
        }
        questionCount = createQuestions()
        $("div.questions").classList.remove("hide")
        $("#nextButton").classList.remove("waiting")
        debugger
        $("#nextButton").addEventListener("click", nextQuestion)
        $("#playButton").classList.add("hide")
    }

    const jump = (e) => {
        console.log("JUMP", e.keyCode)
        if (e.keyCode == 74) {
            document.removeEventListener("keydown", jump, false)
            wavesurfer.stop()
            showQuestions()
        }
    }

    const play = () => {
        if (!loading) {
            $("#playButton").classList.add("waiting")
            wavesurfer.play(0)
            if (env.TESTING && env.TESTING != undefined && env.TESTING != null) {
                document.addEventListener("keydown", jump, false)
            }
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

    let innerHTML = `<div class="alert alert-primary pageCounter" id="explicationWrapper"  role="alert"> ${fileIndex} / ${audioFilesAmount}</div>`
    let questionIndex = 0
    for (let audio in question) {
        for (let answer in question[audio]) {

            console.log("answer", answer)
            if (answer == "text") {
                innerHTML += `<div id="explicationWrapper" class="alert alert-primary" role="alert"> ${question[audio]["text"]}</div>`
                continue
            }

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

const nextQuestion = () => {
    console.log(questionCount)
    $("#nextButton").removeEventListener("click", nextQuestion)
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
    console.log("Value: ", value)
    if (value === undefined) {
        value = "Not answered"
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
