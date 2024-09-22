use std::env;
use dotenvy::dotenv;

pub struct AppConfig {
    host: String,
    port: u16
}

impl AppConfig {
    pub fn new() -> Self {
        dotenv().ok();
        let host = env::var("BIND_ADDR").unwrap_or("0.0.0.0".to_string()).to_string();
        let port: u16 = env::var("BIND_PORT").unwrap_or("3001".to_string()).to_string().parse().expect("Convert env port to u16 failed");
        Self {
            host,
            port
        }
    }

    pub fn get_address(&self) -> String {
        format!("{}:{}", self.host, self.port)
    }

    pub fn get_log_filter(&self) -> String {
        let log_filter = env::var("RUST_LOG").unwrap_or("receipt_repository_fe=debug,tower_http=debug,axum::rejection=trace".to_string());
        log_filter
    }

    pub fn log_to_file(&self) -> bool {
        let flag_str = env::var("LOG_TO_FILE").unwrap_or("0".to_string());
        flag_str != "0"
    }

    pub fn get_log_directory(&self) -> String {
        let log_directory = env::var("LOG_DIRECTORY").unwrap_or(".".to_string());
        log_directory
    }

    pub fn get_log_prefix(&self) -> String {
        let log_prefix = env::var("LOG_PREFIX").unwrap_or("receipt_repository_fe".to_string());
        log_prefix
    }

    pub fn get_router_path(&self) -> String {
        let router_path = env::var("ROUTER_PATH").unwrap_or("/".to_string());
        router_path
    }

    pub fn get_serve_dir_path(&self) -> String {
        let serve_dir_path = env::var("SERVE_DIR_PATH").unwrap_or("dist".to_string());
        serve_dir_path
    }
}
