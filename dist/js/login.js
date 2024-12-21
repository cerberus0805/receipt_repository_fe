const API_BASE = "https://api.app.localhost:3000/api/v1";

class LoginPayload {
    constructor(username, pwd) {
        this.username = username;
        this.pwd = pwd;
    }
}

async function getLoginData() {
    let username = document.querySelector("#login-username").value;
    let pwd = document.querySelector("#login-pwd").value;
    let loginPayload = new LoginPayload(username, pwd);

    return loginPayload;
}

async function submit() {
    const postData = await getLoginData();
    const request = new Request(`${API_BASE}/login`, {
        method: "POST",
        credentials: 'include',
        body: JSON.stringify(postData), 
        headers: {
            "Content-Type": "application/json"
        }
    });

    try {
        const response = await fetch(request);
        if (response.ok) {
            alert(`Login success`);
            window.location.replace("/");
        }
        else {
            alert(`Login failed`);
        }
    }
    catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function main() {
    let submitButton = document.getElementById("login");
    submitButton.addEventListener("click", () => submit());
}

main();
