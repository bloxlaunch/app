// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest;
use serde::{Deserialize, Serialize};
use tauri::command;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![proxy_request]) // ✅ Register proxy_request
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");

    bloxlaunch_app_lib::run();
}

// Struct for the proxy response
#[derive(Serialize, Deserialize)]
struct ProxyResponse {
    status: u16,
    body: String,
}

// Proxy function that forwards HTTP requests
#[command]
async fn proxy_request(
    url: String,
    method: String,
    body: Option<String>,
) -> Result<ProxyResponse, String> {
    let client = reqwest::Client::new();

    let response = match method.as_str() {
        "GET" => client.get(&url).send().await,
        "POST" => {
            let request = client.post(&url);
            if let Some(data) = body {
                request.body(data).send().await
            } else {
                request.send().await
            }
        }
        _ => return Err("Unsupported HTTP method".to_string()),
    };

    match response {
        Ok(resp) => {
            let status = resp.status().as_u16();
            let body = resp
                .text()
                .await
                .unwrap_or_else(|_| "Failed to read response".to_string());
            Ok(ProxyResponse { status, body })
        }
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}
