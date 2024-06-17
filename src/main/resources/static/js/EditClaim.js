function getCookie(name) {
    var cookieName = name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');
    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return "";
}

let userName = getCookie("userName");
let infoStaff = document.getElementById("infoStaff");
infoStaff.textContent = userName;

let status = document.getElementById("status");
let staffId = document.getElementById("staffId");
let projectId = document.getElementById("projectId");
let dateOutput = document.getElementById("dateOutput");
let fromOutput = document.getElementById("fromOutput");
let toOutput = document.getElementById("toOutput");
let totalOutput = document.getElementById("totalOutput");
let dayOutput = document.getElementById("dayOutput");
let remark = document.getElementById("remark");

document.getElementById("dateInput").addEventListener("change", function() {
    let date = this.value;
    let day = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
    document.getElementById("dayInput").value = day;
});

document.getElementById("submitBtn-modal").addEventListener("click", function() {
    let date = document.getElementById("dateInput").value;
    let day = document.getElementById("dayInput").value;
    let from = document.getElementById("fromInput").value;
    let to = document.getElementById("toInput").value;
    let hours = document.getElementById("hoursInput").value;

    dateOutput.textContent = date;
    dayOutput.textContent = day;
    fromOutput.textContent = from;
    toOutput.textContent = to;
    totalOutput.textContent = hours;

    $('#myModal').modal('hide');
});
let linkBack = document.getElementById("link-back");
function GetClaimToUpdate() {
    $.ajax({
            url: "http://localhost:8080/api/claims/" + sessionStorage.getItem("claimId"),
            method: "GET",
            contentType: "application/json",
            success: function(response) {
                status.textContent = response.status;
                staffId.textContent = response.staffId;
                projectId.textContent = response.projectId;
                let sqlDate = response.claimDate;
                let jsDate = new Date(sqlDate);

                let year = jsDate.getFullYear();
                let month = String(jsDate.getMonth() + 1).padStart(2, '0');
                let day = String(jsDate.getDate()).padStart(2, '0');

                let formattedDate = `${year}-${month}-${day}`;
                dateOutput.textContent = formattedDate;
                dayOutput.textContent = response.day;
                fromOutput.textContent = response.fromDate;
                toOutput.textContent = response.toDate;
                totalOutput.textContent = response.totalHours;
                remark.textContent = response.remarks;
                getInfoProject(response.staffId);
            },
            error: function(xhr, status, error) {
            }
    });
}
GetClaimToUpdate();

function getInfoProject(e) {
    $.ajax({
        url: "/api/staff/" + e,
        type: "GET",
        dataType: "json",
        success: function(response) {
            document.getElementById("staffName").innerText = response.name;
            const selectElement = document.getElementById("projectSelect");
            const roleInproject = document.getElementById("roleInProject");

            response.workingDTOS.forEach(function(workingDTO) {
                const optionElement = document.createElement("option");
                if (workingDTO.roleStaff !== "PM" && workingDTO.roleStaff !== "FINANCE") {
                    optionElement.value = workingDTO.project.id;
                    optionElement.textContent = workingDTO.project.nameProject;
                    selectElement.appendChild(optionElement);
                }
            });

            selectElement.addEventListener("change", function() {
                let selectedProjectId = selectElement.value;

                const selectedWorkingDTO = response.workingDTOS.find(function(workingDTO) {
                    return workingDTO.project.id === parseInt(selectedProjectId);
                });

                if (selectedWorkingDTO) {
                    document.getElementById("projectId").innerText = selectedWorkingDTO.project.id;
                    roleInproject.innerText = selectedWorkingDTO.roleStaff;
                    let sqlDate = selectedWorkingDTO.startDate;
                    let jsDate = new Date(sqlDate);

                    let year = jsDate.getFullYear();
                    let month = String(jsDate.getMonth() + 1).padStart(2, '0');
                    let day = String(jsDate.getDate()).padStart(2, '0');

                    let formattedDate = `${year}-${month}-${day}`;
                    startDate.textContent = formattedDate;
                    let sqlEndDate = selectedWorkingDTO.endDate;
                    let jsEndDate = new Date(sqlEndDate);

                    year = jsEndDate.getFullYear();
                    month = String(jsEndDate.getMonth() + 1).padStart(2, '0');
                    day = String(jsEndDate.getDate()).padStart(2, '0');

                    let formattedEndDate = `${year}-${month}-${day}`;
                    endDate.textContent = formattedEndDate;
                } else {
                    roleInproject.innerText = "";
                }
            });
        },
        error: function(xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}
function UpdateClaim() {
    let claimData = {
        status : status.textContent,
        claimDate: dateOutput.textContent,
        day: dayOutput.textContent,
        fromDate: fromOutput.textContent,
        toDate: toOutput.textContent,
        totalHours: totalOutput.textContent,
        "remarks": remark.value,
        "staffDTO": {
            "id": staffId.textContent
        },
        "projectDTO": {
            "id": projectId.textContent
        }
    };
    $.ajax({
        url: "http://localhost:8080/api/claims/" + sessionStorage.getItem("claimId"),
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(claimData),
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    });
}

function submitUpdateClaim() {
    let claimData = {
        status : "Pending",
        claimDate: dateOutput.textContent,
        day: dayOutput.textContent,
        fromDate: fromOutput.textContent,
        toDate: toOutput.textContent,
        totalHours: totalOutput.textContent,
        remarks: remark.value,
        "staffDTO": {
            "id": staffId.textContent
        },
        "projectDTO": {
            "id": projectId.textContent
        }
    };
    $.ajax({
        url: "http://localhost:8080/api/claims/" + sessionStorage.getItem("claimId"),
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(claimData),
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    });
}
linkBack.addEventListener("click", function () {
    sessionStorage.removeItem("claimId");
    window.location.href = "/claim/draft";
})
document.getElementById("submitDraft").addEventListener("click", function () {
    let formattedStartDate = startDate.textContent;
    let formattedEndDate = endDate.textContent;

    let claimDate = dateOutput.innerText;
    let claimDateFormatted = claimDate.split("/").reverse().join("-");

    if (claimDateFormatted < formattedStartDate || claimDateFormatted > formattedEndDate) {
        alert("Ngày yêu cầu không hợp lệ!");
        return;
    }
    alert("Save thành công!");
    UpdateClaim();

    window.location.href = "/claim/draft";
})
document.getElementById("submitPending").addEventListener("click", function () {
    let formattedStartDate = startDate.textContent;
    let formattedEndDate = endDate.textContent;

    let claimDate = dateOutput.innerText;
    let claimDateFormatted = claimDate.split("/").reverse().join("-");

    if (claimDateFormatted < formattedStartDate || claimDateFormatted > formattedEndDate) {
        alert("Ngày yêu cầu không hợp lệ!");
        return;
    }
    alert("Submit thành công!");
    submitUpdateClaim();
    window.location.href = "/claim/draft";
})