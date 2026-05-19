$(document).ready(function () {

    const studentId = localStorage.getItem("studentId");

    if (!studentId) {
        alert("StudentId missing");
        return;
    }

    $.ajax({
        url: reportApi + studentId,
        type: "GET",
        headers: getTokenHeader(),
        success: function (res) {
            if (res.success) {
                $("#studentName").text(res.data.studentName);
                $("#motherName").text(res.data.motherName);
                $("#EnStudentName").text(res.data.studentName);
                $("#EnMotherName").text(res.data.motherName);
                $("#commiteeName").text(res.data.commiteeName);
                $("#collegeName").text(res.data.schoolName);
                $(".totalMarks").text(res.data.totalMarks);
                $("#casteAndCategory").text(res.data.religion + " - " + res.data.caste);
                $("#category").text(res.data.category);
                $("#permanentAddress").text(res.data.permanentAddress);
                $("#currentAddress").text(res.data.currentAddress);
                $("#mobileNumber").text(res.data.mobileNumber);
                $("#annualIncome").text(res.data.income);
                $("#mobileNumber").text(res.data.parentContactNo);
                $(".previousSchool").text(res.data.previousSchool);
                $("#Standard").text(res.data.standardName + " - " + res.data.branchName);
                $(".StandardAndBranch").text(res.data.standardName + " - " + res.data.branchName);
                $("#PassingYear").text(res.data.passingYear);
                $("#SeatNo").text(res.data.seatNo);
                $("#percentage").text(res.data.percentage);
                $(".formNo").text(res.data.registrationNo);
                $(".applicationDate").text(new Date().toLocaleDateString());
                const date = new Date(res.data.dob);

                const formatted =
                    String(date.getDate()).padStart(2, '0') + '-' +
                    String(date.getMonth() + 1).padStart(2, '0') + '-' +
                    date.getFullYear();

                $("#dob").text(res.data.dob);
                $("#previousSchool").text(res.data.previousSchool);
                $("#permanentAddress").text(res.data.permanentAddress);
                $("#registrationNo").text(res.data.registrationNo);
                $("#parentContactNo").text(res.data.parentContactNo);
                $("#totalMarks").text(res.data.totalMarks);
            }
        },
        error: function () {
            alert("API Error");
        }
    });

    function getStudentIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get("studentId");
    }

    loadStudentSubjects(studentId);
});

async function loadStudentSubjects(studentId) {

    const response = await fetch(
        studentSubjectReportApi + studentId,
        {
            method: "GET",
            headers: getTokenHeader()
        }
    );

    const result = await response.json();

    if (!result.success) {
        return;
    }

    const data = result.data;

    // Get branch name
    const branchName = data[0]?.branchName || "";

    // Group data by groupName
    const grouped = {};

    data.forEach(item => {

        if (!grouped[item.groupName]) {
            grouped[item.groupName] = [];
        }

        grouped[item.groupName].push(item.subjectName);
    });

    let html = "";

    // Header row
    html += `
            <tr>
                <th>शाखा</th>
                <th>${branchName}</th>
            </tr>
        `;

    // Dynamic groups
    Object.keys(grouped).forEach(groupName => {

        const subjects = grouped[groupName];

        subjects.forEach((subject, index) => {

            html += `
                    <tr>
                        ${index === 0
                    ? `<td rowspan="${subjects.length}" style="vertical-align: top;">
                                    ${groupName}
                               </td>`
                    : ""
                }

                        <td>
                            <input type="text"
                                   value="${subject}"
                                   style="border:none; width:100%;">
                        </td>
                    </tr>
                `;
        });

    });

    const tables = document.getElementsByClassName("subject-table");

    document.querySelectorAll(".subject-table").forEach(table => {
        table.innerHTML = html;
    });
}
