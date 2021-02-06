package handlers

import (
	"encoding/csv"
	"encoding/json"
	"log"
	"math"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
)

// Test ..
func Test(w http.ResponseWriter, r *http.Request) {
	log.Println("TESTSETSETSTESTES")
	json.NewEncoder(w).Encode("HEllo")
}

// InsertUserInfo inserts users to excel
func InsertUserInfo(w http.ResponseWriter, r *http.Request) {
	type reqtype struct {
		Type []float64         `json:"type"`
		Data map[string]string `json:"data"`
	}
	var req reqtype
	json.NewDecoder(r.Body).Decode(&req)
	log.Println("Req: ", req)

	// var values []string
	var answers []string
	var rest []string
	for k, _ := range req.Data {
		log.Println(k)
		if strings.Contains(k, "answer") {
			answers = append(answers, k)
		} else {
			rest = append(rest, k)
		}
	}
	sort.Strings(rest)
	log.Println("Rest: ", rest, "Asnwers: ", answers)
	for i := 0; i < len(answers); i++ {
		for n := 0; n < (len(answers) - i - 1); n++ {
			value0, _ := strconv.ParseFloat(answers[n][6:], 64)
			value1, _ := strconv.ParseFloat(answers[n+1][6:], 64)
			// log.Println(value0, value1, answers[n][6:])
			if value0 > value1 {
				temp := answers[n]
				temp1 := answers[n+1]
				answers[n+1] = temp
				answers[n] = temp1
			}
		}
	}

	log.Println("Ordered answers: ", answers)

	datatype := req.Type
	var answerResult []string
	log.Println("Datatype: ", datatype)
	secondIndex := 0
	for i := 0; i < len(datatype); i++ {
		// log.Println("Answewr", answers[secondIndex][6:])
		log.Println(answers[secondIndex][6:])
		answer, _ := strconv.ParseFloat(answers[secondIndex][6:], 64)
		log.Println("Answer: ", answer, "Data -1 : ", (datatype[i] - 1/10))
		areEqual := checkEqual(answer, (datatype[i] - 0.1))
		log.Println(areEqual)
		if areEqual {
			log.Println("SAME")
			answerResult = append(answerResult, answers[i])
			secondIndex++
		} else {
			answerResult = append(answerResult, "-1")
		}
	}

	log.Println("Answer result: ", answerResult)

	for i := 0; i < len(answerResult); i++ {
		rest = append(rest, answerResult[i])
	}

	var values []string
	for i := 0; i < len(rest); i++ {
		if rest[i] == "-1" {
			values = append(values, req.Data[rest[i]])
		} else {
			values = append(values, "undefined")
		}
	}
	log.Println(values)

	log.Println(rest)
	writeToFile(values)
	json.NewDecoder(r.Body).Decode(&rest)

	// v := reflect.ValueOf(req)
	// values := make([]string, v.NumField())
	// var values []string
	// for _, v := range req {
	// 	values = append(values, v)
	// }

	// log.Println(values)
	// json.NewEncoder(w).Encode(http.StatusOK)
}

func checkEqual(a, b float64) bool {
	const float64EqualityThreshold = 1e-9
	return math.Abs(a-b) <= float64EqualityThreshold
}

func writeToFile(values []string) {
	filePath := os.Getenv("AHOLAB_CSV_FILE_PATH")
	log.Println("Aholab csv file path: ", filePath)
	_, err := os.Stat(filePath)
	if err != nil {
		os.Create(filePath)
	}

	f, err := os.OpenFile(filePath, os.O_APPEND|os.O_WRONLY, os.ModeAppend)
	defer f.Close()
	fileSize, err := f.Stat()
	if err != nil {
		log.Fatal(err)
	}
	var records [][]string
	if fileSize.Size() == 0 {
		log.Println("File empty")
		columnNames := []string{"name", "experience", "equip", "answer1", "answer2"}
		records = append(records, columnNames)
	}
	records = append(records, values)

	writer := csv.NewWriter(f)
	err = writer.WriteAll(records)
	if err != nil {
		log.Fatal("Error writing: ", err)
	}

	log.Println("Written")
	return
}

// GetAudioFileAmount ..
func GetAudioFileAmount(w http.ResponseWriter, r *http.Request) {
	fileIndex := 0
	audioFilesDir := os.Getenv("AHOLAB_AUDIO_FILES")
	log.Println("audioFilesDir: ", audioFilesDir)
	for {
		fileName := strconv.Itoa(fileIndex)
		_, err := os.Stat(audioFilesDir + fileName + ".wav")
		if os.IsNotExist(err) {
			// File does not exist
			break
		}
		fileIndex++
	}
	json.NewEncoder(w).Encode(fileIndex)
}
