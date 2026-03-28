(function() {
    // Wizard variables
    let currentStep = 0;
    const steps = document.querySelectorAll(".step");

    // Function to show a specific step
    function showStep(n){
        steps.forEach((s,i)=> s.style.display = i===n ? "block" : "none");
        const progressBar = document.getElementById("progressBar");
        if(progressBar) progressBar.style.width = ((n+1)/steps.length)*100 + "%";
    }

    // Navigate to next step
    window.nextStep = function(){ 
        if(currentStep < steps.length-1){ 
            currentStep++; 
            showStep(currentStep);
        } 
    }

    // Navigate to previous step
    window.prevStep = function(){ 
        if(currentStep > 0){ 
            currentStep--; 
            showStep(currentStep);
        } 
    }

    // Copy permanent address to current address if checkbox checked
    window.copyPermanent = function(){
        if(document.getElementById("sameAddress").checked){
            document.getElementById("current_village").value = document.getElementById("permanent_village").value;
            document.getElementById("current_city").value = document.getElementById("permanent_city").value;
            document.getElementById("current_district").value = document.getElementById("permanent_district").value;
            document.getElementById("current_state").value = document.getElementById("permanent_state").value;
            document.getElementById("current_pincode").value = document.getElementById("permanent_pincode").value;
        }
    }

    // Collect all form data and log final JSON
    window.submitForm = function(){
        const student = {
            registrationNo:null, schoolId:null, academicYearId:null, financialYearId:null,
            firstName:document.getElementById("firstName").value,
            middleName:document.getElementById("middleName").value,
            lastName:document.getElementById("lastName").value,
            gender:document.getElementById("gender").value==="true",
            dob:document.getElementById("dob").value,
            saralId:document.getElementById("saralId") ? document.getElementById("saralId").value : null,
            aadharNo:document.getElementById("aadharNo").value,
            nationality:document.getElementById("nationality").value,
            motherTongue:document.getElementById("motherTongue").value,
            religionId:document.getElementById("religionId").value,
            casteId:document.getElementById("casteId").value,
            categoryId:document.getElementById("categoryId").value,
            isMinority:document.getElementById("isMinority").checked,
            isHandicapped:document.getElementById("isHandicapped").checked,
            isBpl:document.getElementById("isBpl").checked,
            bpL_Type:document.getElementById("bpL_Type").value,
            photo:null, modifyBy:null, branchId:null
        };

        const addresses = [
            { studentId:null, addressType:"PERMANENT", village:document.getElementById("permanent_village").value, city:document.getElementById("permanent_city").value, district:document.getElementById("permanent_district").value, state:document.getElementById("permanent_state").value, country:"India", pincode:document.getElementById("permanent_pincode").value },
            { studentId:null, addressType:"CURRENT", village:document.getElementById("current_village").value, city:document.getElementById("current_city").value, district:document.getElementById("current_district").value, state:document.getElementById("current_state").value, country:"India", pincode:document.getElementById("current_pincode").value }
        ];

        const physical = {
            studentId:"", height:document.getElementById("height").value, weight:document.getElementById("weight").value,
            handicappedTypeId:document.getElementById("handicappedTypeId").value
        };

        const parentInfo = {
            studentId:"", fatherName:document.getElementById("fatherName").value, motherName:document.getElementById("motherName").value,
            grandFatherName:document.getElementById("grandFatherName").value, parentName:document.getElementById("parentName").value,
            contactNo:document.getElementById("contactNo").value, emailId:document.getElementById("emailId").value,
            income:document.getElementById("income").value, occupation:document.getElementById("occupation").value
        };

        const previousSchool = {
            studentId:null,
            previousSchool:document.getElementById("previousSchool").value,
            schoolDOE:document.getElementById("schoolDOE").value,
            progress:document.getElementById("progress").value,
            behaviour:document.getElementById("behaviour").value,
            passingYear:document.getElementById("passingYear").value,
            seatNo:document.getElementById("seatNo").value,
            totalMarks:document.getElementById("totalMarks").value,
            percentage:document.getElementById("percentage").value
        };

        const studentDocument = {
            studentId:null,
            documentType:document.getElementById("documentType").value,
            file:document.getElementById("documentFile").files[0] || null
        };

        const finalData = { student, addresses, physical, parentInfo, previousSchool, studentDocument };
        console.log("FINAL DATA:", finalData);
        alert("Form submitted! Check console for JSON.");
    }

    // Initialize first step
    function initWizard(){
        showStep(currentStep);
    }

    window.addEventListener("DOMContentLoaded", initWizard);
})();