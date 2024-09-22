use axum::{
    extract::Request, routing::get, Router,
};
use tower::ServiceExt;
use tower_http::services::ServeDir;

pub struct AppRouter {
    pub router: Router
}

impl AppRouter {
    pub fn new(router_path: String, serve_dir_path: String) -> Self {
        Self {
            router: Router::new().nest_service(
                router_path.as_str(),
                get(|request: Request| async {
                    let service = ServeDir::new(serve_dir_path);
                    let result = service.oneshot(request).await;
                    result
                })
            )
        }
    }
}