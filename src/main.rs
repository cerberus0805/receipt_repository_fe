use receipt_repository_fe::{configuration::app_config, router::AppRouter};
use tower_http::trace::TraceLayer;
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
    let listener = tokio::net::TcpListener::bind(app_config.get_address()).await.unwrap();
    tracing::debug!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app_router.router.layer(TraceLayer::new_for_http()))
        .await
        .unwrap();
}
