import * as env from './env.js'
import * as gettype from './gettype.js'
const url = `${env.AHOLAB_SERVER_URL}`
console.log(url)

export const getAudioFileAmount = async () => {
    try {
        const response = await fetch(url + "GetAudioFileAmount", {
		//headers: ["origin", "https://aholab.ehu.eus/users/aitor"]
	})
        const json = await response.json()
        return json
    }
    catch (err) {
        return -1
    }
}

export const insertUserInfo = async (userInfo, fileAmount) => {
    const datatype = gettype.getType(fileAmount)
    const lang = env.LANGUAGE;
    const body = {
        Data: userInfo,
        Type: datatype,
        Lang: lang
    }
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

