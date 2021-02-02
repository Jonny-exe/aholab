package main

import (
	"log"
	"net/http"
	"strconv"

	"github.com/Jonny-exe/aholab/back/mintzai-httpd/handlers"
	"github.com/rs/cors"
)

func handleRequest() error {
	// myRouter := mux.NewRouter().StrictSlash(true)
	// myRouter := http.NewServeMux()
	// acceptedOrigins := "https://aholab.ehu.eus/users/aitor"
	// log.Println(acceptedOrigins)
	mux := http.NewServeMux()
	mux.HandleFunc("/", handlers.Test)
	mux.HandleFunc("/InsertUserInfo", handlers.InsertUserInfo)
	mux.HandleFunc("/GetAudioFileAmount", handlers.GetAudioFileAmount)
	// c := cors.New(cors.Options{
	// 	//AllowedOrigins:   []string{acceptedOrigins},
	// 	AllowedOrigins:   []string{"*"},
	// 	AllowCredentials: false,
	// 	AllowedMethods:   []string{"POST", "GET", "OPTIONS"},
	// 	AllowedHeaders:   []string{"*"},

	// 	// Enable Debugging for testing, consider disabling in production
	// 	// To debug turn this to true
	// 	Debug: true,
	// })

	PORT := 8080
	// corsHandler := c.Handler(myRouter)
	handler := cors.Default().Handler(mux)
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: false,
		AllowedHeaders:   []string{"*"},
		// Enable Debugging for testing, consider disabling in production
		Debug: true,
	})
	handler = c.Handler(handler)

	log.Println("Listening on port: ", PORT)
	log.Fatal(http.ListenAndServe(":"+strconv.Itoa(PORT), handler))

	return nil
}

func main() {
	err := handleRequest()
	if err != nil {
		log.Fatal(err)
	}
}
