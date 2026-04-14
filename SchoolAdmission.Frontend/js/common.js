const apiBase = "http://localhost:5263/api";

const categoryApi = apiBase + "/categorymasters";
const casteApi = apiBase + "/castemaster"; 
const schoolApi = apiBase + "/schoolmasters";
const loginApi = apiBase + "/auth/login";
const branchApi = apiBase + "/branchmasters";
const studentApi = apiBase + "/student";
const studentDetailsApi = apiBase + "/student-details";
const studentStatusApi = apiBase + "/users/student-status";
const committeeApi = apiBase + "/commitemasters";
const divisionApi = apiBase + "/divisionmasters";
const documentUploadApi = apiBase + "/student-document";
const guardianApi = apiBase + "/student-parent";
const previousSchoolApi = apiBase + "/student-academic-history";
const religionApi = apiBase + "/religionmasters";
const standardApi = apiBase + "/standardmasters";
const studentAddressApi = apiBase + "/student-address";
const healthApi = apiBase + "/student-health";
const registerCommitteeApi = apiBase + "/CommiteMasters";
const schoolAllSchoolsApi = apiBase + "/schoolmasters/AllSchools";

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
        showToast("Session expired. Please login again.", "info");
        localStorage.clear();
        window.location.href = "../index.html";
    }
}