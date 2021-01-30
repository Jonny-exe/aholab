package handlers

import (
	"encoding/csv"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"reflect"
	"strconv"
)

// InsertUserInfo inserts users to excel
func InsertUserInfo(w http.ResponseWriter, r *http.Request) {
	type reqtype struct {
		Name       string `json:"name"`
		Experience string `json:"experience"`
		Equip      string `json:"equip"`
		Answer1    string `json:"answer1"`
	}
	var req reqtype
	json.NewDecoder(r.Body).Decode(&req)

	v := reflect.ValueOf(req)
	values := make([]string, v.NumField())
	for i := 0; i < v.NumField(); i++ {
		values[i] = v.Field(i).String()
	}

	writeToFile(values)
	json.NewEncoder(w).Encode(http.StatusOK)
}

func writeToFile(values []string) {
	filePath := os.Getenv("AHOLAB_CSV_FILE_PATH")
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
		columnNames := []string{"hi", "test", "hi"}
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
	audioFilesDir := os.Getenv("AHOLAB_AUDIO_FILES_DIR")
	for {
		fileName := strconv.Itoa(fileIndex)
		_, err := os.Stat(audioFilesDir + fileName + ".mp3")
		fileIndex++
		if os.IsNotExist(err) {
			// File does not exist
			break
		}
	}
	json.NewEncoder(w).Encode(fileIndex)
}
