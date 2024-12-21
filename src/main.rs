use std::{env, net::SocketAddr, str::FromStr};

use axum_server::tls_rustls::RustlsConfig;
use receipt_repository_fe::{configuration::app_config, router::AppRouter};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    let app_config = app_config();
    let (non_blocking_writer, _guard);

    if app_config.log_to_file() {
        let file_appender = tracing_appender::rolling::hourly(app_config.get_log_directory(), app_config.get_log_prefix());
        (non_blocking_writer, _guard) = tracing_appender::non_blocking(file_appender);
    }
    else {
        (non_blocking_writer, _guard) = tracing_appender::non_blocking(std::io::stdout());
    }

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::new(app_config.get_log_filter())
        )
        .with(
            tracing_subscriber::fmt::layer().with_writer(
                non_blocking_writer
            )
        )
        .init();

    let app_router = AppRouter::new(app_config.get_router_path(), app_config.get_serve_dir_path());
    let cur_path = env::current_dir().unwrap();
    let tls_config = RustlsConfig::from_pem_file(
        cur_path.join(app_config.get_tls_pem_folder_name()).join(app_config.get_tls_cert_name()), 
        cur_path.join(app_config.get_tls_pem_folder_name()).join(app_config.get_tls_key_name())
    ).await.unwrap();


        let addr = SocketAddr::from_str(app_config.get_address().as_str()).unwrap();
        axum_server::bind_rustls(addr, tls_config)
            .serve(app_router.router.into_make_service())
            .await
            .unwrap();
}
