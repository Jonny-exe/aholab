import * as q from './questions.js'
export const getType = (fileAmount) => {
    const data = q.q
    let result = []
    let index = 1
    for (let key in data) {
        let index2 = 0.1
        if (key >= fileAmount) break
        for (let secondKey in data[key]["audio" + key]) {
            console.log(secondKey)
            result.push(index + index2)
            index2 += 0.1
        }
        // result.push(index)
        index++
    }
    console.log(result)
    return result
}
