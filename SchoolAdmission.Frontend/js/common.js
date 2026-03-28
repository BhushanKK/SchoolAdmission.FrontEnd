const apiBase = "http://localhost:5263/api";

const categoryApi = apiBase + "/categorymasters";
const casteApi = apiBase + "/castemaster"; 
const schoolApi = apiBase + "/schoolmasters";
document.getElementById("currentYear").innerText = new Date().getFullYear();

function getTokenHeader() {
    const token = localStorage.getItem("accessToken");
    if (!token) return {};
    return {
        "Authorization": "Bearer " + token
    };
}
function showToast(message, type = "success") {
    const toastEl = document.getElementById("toastAlert");
    const toastMsg = document.getElementById("toastMessage");

    if (!toastEl || !toastMsg) return;

    toastMsg.innerText = message;

    toastEl.classList.remove("bg-success", "bg-danger", "bg-warning", "bg-info");

    if (type === "success") toastEl.classList.add("bg-success");
    else if (type === "exists" || type === "warning") toastEl.classList.add("bg-warning");
    else if (type === "info") toastEl.classList.add("bg-info");
    else toastEl.classList.add("bg-danger");

    const toast = new mdb.Toast(toastEl);
    toast.show();
}

function handle401(xhr) {
    if (xhr.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        window.location.href = "../index.html";
    }
}