package main

import (
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/Jonny-exe/aholab/back/httpd/handlers"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func handleRequest() error {
	// err := sql.Register("mysql", &MySQLDriver{})
	// if err != nil {
	// 	log.Println("Error: Could NOT connect to database.")
	// 	log.Println(err)
	// 	return err
	// }

	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.HandleFunc("/InsertUserInfo", handlers.InsertUserInfo).Methods("POST", "OPTIONS")
	myRouter.HandleFunc("/GetAudioFileAmount", handlers.GetAudioFileAmount).Methods("GET", "OPTIONS")
	acceptedOrigins := os.Getenv("AHOLAB_ACCEPTED_ORIGINS")
	log.Println(acceptedOrigins)
	c := cors.New(cors.Options{
		AllowedOrigins: []string{acceptedOrigins},
		//AllowedOrigins:   []string{"http://localhost:3000", "http://jonny.sytes.net", "http://192.168.0.19"},
		AllowCredentials: false,
		AllowedMethods:   []string{"POST", "GET", "OPTIONS"},
		AllowedHeaders:   []string{"*"},

		// Enable Debugging for testing, consider disabling in production
		// To debug turn this to true
		Debug: false,
	})

	PORT := 5000
	corsHandler := c.Handler(myRouter)
	log.Println("Listening on port: ", PORT)
	log.Fatal(http.ListenAndServe(":"+strconv.Itoa(PORT), corsHandler))

	return nil
}

func main() {
	err := handleRequest()
	if err != nil {
		log.Fatal(err)
	}
}
