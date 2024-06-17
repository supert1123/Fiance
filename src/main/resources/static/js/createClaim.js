const dateInput = document.getElementById("dateInput");
const dayInput = document.getElementById("dayInput");
const fromInput = document.getElementById("fromInput");
const toInput = document.getElementById("toInput");
const hoursInput = document.getElementById("hoursInput");
const dateOutput = document.getElementById("dateOutput");
const dayOutput = document.getElementById("dayOutput");
const fromOutput = document.getElementById("fromOutput");
const toOutput = document.getElementById("toOutput");
const hourOutput = document.getElementById("totalOutput");
const status = document.getElementById("status");
let remark = document.getElementById("remark");

dateInput.addEventListener("change", function() {
    let date = this.value;
    let day = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
    dayInput.value = day;
});

document.getElementById("submitBtn-modal").addEventListener("click", function() {
    let date = dateInput.value;
    let day = dayInput.value;
    let from = fromInput.value;
    let to = toInput.value;
    let hours = hoursInput.value;

    dateOutput.innerText = date;
    dayOutput.innerText = day;
    fromOutput.innerText = from;
    toOutput.innerText = to;
    hourOutput.innerText = hours;

    $('#myModal').modal('hide');
});

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
function getStaffByEmail() {
    $.ajax({
        url: "/api/staffByEmail/" + userName,
        type: "GET",
        dataType: "json",
        success: function(response) {
            getAllInfoStaff(response.id);
        }
    });
}
function getAllInfoStaff(e) {
    $.ajax({
        url: "/api/staff/" + e,
        type: "GET",
        dataType: "json",
        success: function(response) {
            document.getElementById("staffId").innerText = response.id;
            document.getElementById("staffName").innerText = response.name;
            const selectElement = document.getElementById("projectSelect");
            const roleInproject = document.getElementById("roleInProject");
            let startDate = document.getElementById("startDate");
            let endDate = document.getElementById("endDate");

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
document.getElementById("submitDraft").addEventListener("click", function() {
    let claimData = {
        status: status.innerText,
        claimDate: dateOutput.innerText,
        day: dayOutput.innerText,
        fromDate: fromOutput.innerText,
        toDate: toOutput.innerText,
        totalHours: hourOutput.innerText,
        remarks: remark.value,
        staffDTO: {
            id: parseInt(document.getElementById("staffId").innerText)
        },
        projectDTO: document.getElementById("projectId").innerText ?
            { id: parseInt(document.getElementById("projectId").innerText) } :
            null
    };
    let formattedStartDate = startDate.textContent;
    let formattedEndDate = endDate.textContent;

    let claimDate = dateOutput.innerText;
    let claimDateFormatted = claimDate.split("/").reverse().join("-");

    if (claimDateFormatted < formattedStartDate || claimDateFormatted > formattedEndDate) {
        alert("Ngày yêu cầu không hợp lệ!");
        return;
    }else {
        $.ajax({
            url: "http://localhost:8080/api/createClaim",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(claimData),
            success: function(response) {
                alert("Save thành công!");
                window.location.href = "/claim/draft";
            },
            error: function(xhr, status, error) {
                // Xử lý lỗi từ server
            }
        });
    }


});

document.getElementById("submitPending").addEventListener("click", function() {
    let claimData = {
        status: "Pending",
        claimDate: dateOutput.innerText,
        day: dayOutput.innerText,
        fromDate: fromOutput.innerText,
        toDate: toOutput.innerText,
        totalHours: hourOutput.innerText,
        remarks: remark.value,
        staffDTO: {
            id: parseInt(document.getElementById("staffId").innerText)
        },
        projectDTO: document.getElementById("projectId").innerText ?
            { id: parseInt(document.getElementById("projectId").innerText) } :
            null
    };
    let formattedStartDate = startDate.textContent;
    let formattedEndDate = endDate.textContent;

    let claimDate = dateOutput.innerText;
    let claimDateFormatted = claimDate.split("/").reverse().join("-");

    if (claimDateFormatted < formattedStartDate || claimDateFormatted > formattedEndDate) {
        alert("Ngày yêu cầu không hợp lệ!");
        return;
    }else {
        $.ajax({
            url: "http://localhost:8080/api/createClaim",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(claimData),
            success: function(response) {
                alert("Submit thành công!");
                window.location.href = "/claim/draft";
            },
            error: function(xhr, status, error) {
                // Xử lý lỗi từ server
            }
        });

    }
});

let linkBack = document.getElementById("link-back");
linkBack.setAttribute("href", "/claim/draft");

getStaffByEmail();