let currentStep = 0;
let steps = [];
document.getElementById("userEmail").innerText =
            localStorage.getItem("userEmail");
function showStep(n) {
    if (!steps || steps.length === 0) return;

    steps.forEach((step, index) => {
        step.style.display = (index === n) ? "block" : "none";
    });

    const progressBar = document.getElementById("progressBar");
    if (progressBar) {
        const percent = Math.round(((n + 1) / steps.length) * 100);
        progressBar.style.width = percent + "%";
        progressBar.innerText = percent + "%";   
    }
}

function nextStep() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
}

function initWizard() {
    steps = document.querySelectorAll(".step");

    if (!steps || steps.length === 0) {
        return;
    }
    currentStep = 0;
    showStep(currentStep);
}

window.addEventListener("DOMContentLoaded", function () {
    initWizard();
});

function loadStudentRegistration() {
    setTimeout(() => {
        initWizard();
    }, 50);
}