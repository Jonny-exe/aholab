package handlers

import (
	"encoding/csv"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"reflect"
)

// InsertUserInfo inserts users to excel
func InsertUserInfo(w http.ResponseWriter, r *http.Request) {
	type reqtype struct {
		Username string `json:"username"`
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
