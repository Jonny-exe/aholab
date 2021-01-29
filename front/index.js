let wavesurfer
let userInfo
const questions = [{
    text: "hi",
    answer1: { text: "answer1", value: 0 },
    answer2: { text: "answer2", value: 0 },
    answer3: { text: "answer3", value: 1 }
}]
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
    wavesurfer = wavesurfer
}

const createQuestions = () => {
    const question = questions[fileIndex - 1]
    console.log(question)
    let finalHTML = `<p class="questionText"> ${question["text"]} </p>`
    let innerHTML = ""
    let i = 0
    for (let answer in question) {
        console.log("answer", answer)
        if (answer == "text") continue
        innerHTML +=
            `<div class="radioButtonWrapper"> <p class="questionParagraph">${question[answer]["text"]}</p> <input type="radio" class="question" checked="checked" value="${i}" name="radio"><span class="checkmark"></span></div>`
        i++
    }
    finalHTML = finalHTML + innerHTML
    $("#questionsWrapper").innerHTML = finalHTML
}
const start = () => {
    $("#startButton").removeEventListener("click", start)
    $("#startButton").classList.add("hide")
    $("#playButton").classList.remove("hide")
    renderQuestion()
}

const nextQuestion = () => {
    $("div.questions").classList.add("hide")
    $("#nextButton").classList.add("waiting")
    $("#playButton").classList.remove("hide")
    const answer = getAnswer()
    console.log(answer)
    renderQuestion()
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
        waveColor: 'violet',
        progressColor: 'purple'
    });
    localWavesurfer.load(`./audios/${fileIndex}.mp3`);
    fileIndex++
    return localWavesurfer
}

const init = () => {
    const getUserInfo = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('name');
        const experience = urlParams.get('experience')
        const equip = urlParams.get('equip')
        const userInfo = {
            name: name,
            experience: experience,
            equip: equip
        }
        return userInfo
    }
    const userInfo = getUserInfo()
    $("#startButton").addEventListener("click", start)
}


init()