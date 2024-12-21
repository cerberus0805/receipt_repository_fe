use std::{env, sync::OnceLock};
use dotenvy::dotenv;
use crate::error::Error;

pub fn app_config() -> &'static AppConfig {
    static INSTANCE: OnceLock<AppConfig> = OnceLock::new();

    INSTANCE.get_or_init(|| {
        AppConfig::load_from_env().unwrap_or_else(|ex| {
            panic!("FATAL ERROR - {ex:?}")
        })
    })
}

pub struct AppConfig {
    host: String,
    port: u16,
    log_filter: String,
    log_to_file: bool, 
    log_directory: String,
    log_prefix: String,
    router_path: String,
    serve_dir_path: String,
    tls_pem_folder_name: String,
    tls_cert_name: String,
    tls_key_name: String
}

impl AppConfig {
    fn load_from_env() -> Result<AppConfig, Error> {
        dotenv().ok();
        Ok(AppConfig {
            host: get_env("BIND_ADDR")?,
            port: get_env("BIND_PORT")?.parse().unwrap(),
            log_filter: get_env("RUST_LOG")?,
            log_to_file: (|| { get_env("LOG_TO_FILE").unwrap() != "0" })(),
            log_directory: get_env("LOG_DIRECTORY")?,
            log_prefix: get_env("LOG_PREFIX")?,
            router_path: get_env("ROUTER_PATH")?,
            serve_dir_path: get_env("SERVE_DIR_PATH")?,
            tls_pem_folder_name: get_env("TLS_PEM_FILES_FOLDER")?,
            tls_cert_name: get_env("TLS_CERT_FILE_NAME")?,
            tls_key_name: get_env("TLS_KEY_FILE_NAME")?
        })
    }

    pub fn get_address(&self) -> String {
        format!("{}:{}", self.host, self.port)
    }

    pub fn get_log_filter(&self) -> &str {
        self.log_filter.as_ref()
    }

    pub fn log_to_file(&self) -> bool {
        self.log_to_file
    }

    pub fn get_log_directory(&self) -> &str {
        self.log_directory.as_ref()
    }

    pub fn get_log_prefix(&self) -> &str {
        self.log_prefix.as_ref()
    }

    pub fn get_router_path(&self) -> &str {
        self.router_path.as_ref()
    }

    pub fn get_serve_dir_path(&self) -> String {
        self.serve_dir_path.to_string()
    }

    pub fn get_tls_pem_folder_name(&self) -> &str {
        self.tls_pem_folder_name.as_ref()
    }

    pub fn get_tls_cert_name(&self) -> &str {
        self.tls_cert_name.as_ref()
    }

    pub fn get_tls_key_name(&self) -> &str {
        self.tls_key_name.as_ref()
    }
}

fn get_env(name: &'static str) -> Result<String, Error> {
    env::var(name).map_err(|_| Error::ConfigMissingEnv(name))
}
