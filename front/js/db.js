import * as env from './env.js'
const url = `${env.AHOLAB_SERVER_URL}`
console.log(url)

export const getAudioFileAmount = async () => {
    try {

        const response = await fetch(url + "GetAudioFileAmount", {
            method: 'GET'
        })

        const json = await response.json()
        return json
    }
    catch (err) {
        return -1
    }
}

export const insertUserInfo = async (userInfo) => {
    const body = userInfo
    try {

        const options = {
            method: 'POST',
            body: JSON.stringify(body)
        }
        const response = await fetch(url + "InsertUserInfo", options)
        const json = await response.json()
        return json
    }
    catch (err) {
        return 500
    }
}