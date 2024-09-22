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
