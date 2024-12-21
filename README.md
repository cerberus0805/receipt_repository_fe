# ReceiptRepositoryFrontend (Work in Progress)
An example of a static file server with Rust axum

## Sample .env file
BIND_ADDR=127.0.0.1  
BIND_PORT=3001  
RUST_LOG=receipt_repository_fe=debug,tower_http=debug,axum::rejection=trace  
LOG_TO_FILE=0  
LOG_DIRECTORY=.  
LOG_PREFIX=receipt_repository_fe  
ROUTER_PATH=/  
SERVE_DIR_PATH=dist  
TLS_PEM_FILES_FOLDER=self_signed_certs  
TLS_CERT_FILE_NAME=app.localhost.crt.pem  
TLS_KEY_FILE_NAME=app.localhost.key.pem  

## Run this webapp
This app is running under https; hence, the certificate is mandatory. It is necessary to add a folder to put certificate and key file in pem format. The folder name, certificate name and key name are defined in the environment variable. We could use openssl to generate self certificate and key in pem format and convert it to pfx format for developing purpose. The pfx format certificate could be imported to Windows if you would like to develop on Windows. The domain name of the self signed certificate is "app.localhost". We could navigate to "https://app.localhost:3001" in the browser to use this app. The corresponding backend app on development environment is "https://api.localhost:3000", and its repository is [backend repository](https://github.com/cerberus0805/receipt_repository_api).

## Build note
To build this on Windows, you may need to install CMake for Windows.