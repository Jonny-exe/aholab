package main

import (
	"log"
	"net/http"
	"os"

	"github.com/Jonny-exe/aholab/back/mintzai-httpd/handlers"
	"github.com/rs/cors"
)

func handleRequest() error {
	mux := http.NewServeMux()
	mux.HandleFunc("/users/aitor/server/", handlers.Test)
	mux.HandleFunc("/users/aitor/server/InsertUserInfo", handlers.InsertUserInfo)
	mux.HandleFunc("/users/aitor/server/GetAudioFileAmount", handlers.GetAudioFileAmount)

	PORT := os.Getenv("AHOLAB_SERVER_PORT")
	log.Println(PORT)

	if PORT == "" {
		PORT = "8080"
	}
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
	log.Fatal(http.ListenAndServe(":"+PORT, handler))

	return nil
}

func main() {
	err := handleRequest()
	if err != nil {
		log.Fatal(err)
	}
}
