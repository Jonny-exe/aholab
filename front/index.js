let wavesurfer
const $ = (item) => {
    return document.querySelector(item)
}
const renderQuestion = () => {
    $("#nextButton").classList.remove("hide")
    $("#playButton").style.display = "inherit"

    const showQuestions = () => {
        wavesurfer.destroy()
        $("div.questions").classList.remove("hide")
        $("#nextButton").classList.remove("waiting")
        $("#nextButton").addEventListener("click", nextQuestion)
        $("#playButton").classList.add("hide")
    }

    wavesurfer = createWaves()
    console.log(wavesurfer)
    $("#playButton").addEventListener("click", () => wavesurfer.play())
    wavesurfer.on("finish", showQuestions)
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
    renderQuestion()
}

let fileIndex = 0

const createWaves = () => {
    var wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'violet',
        progressColor: 'purple'
    });
    try {
        wavesurfer.load(`./audios/${fileIndex}.mp3`);
    }
    catch (err) {
    }
    // fileIndex++
    return wavesurfer
}


$("#startButton").addEventListener("click", start)