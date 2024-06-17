
let status = document.getElementById("status");
let staffId = document.getElementById("staffId");
let staffName = document.getElementById("staffName");
let projectId = document.getElementById("projectId");
let nameProject = document.getElementById("nameProject");
let roleInProject = document.getElementById("roleInProject");
let remark = document.getElementById("remark");
let dateOutput = document.getElementById("dateOutput");
let dayOutput = document.getElementById("dayOutput");
let fromOutput = document.getElementById("fromOutput");
let toOutput = document.getElementById("toOutput");
let totalHours = document.getElementById("totalOutput");

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
            document.getElementById("submitApprove").addEventListener("click", function () {
                submitApproveClaim(response.id);
            });
            document.getElementById("submitReject").addEventListener("click", function () {
                submitRejectClaim(response.id);
            });
            document.getElementById("submitReturn").addEventListener("click", function () {
                submitReturnClaim(response.id);
            });
            document.getElementById("link-back").addEventListener("click", function () {
                window.location.href = "/claim/pending/" + response.id;
            })
        }
    });
}

function ApproveStaffPending() {
    $.ajax({
        url: "/api/claims/" + sessionStorage.getItem("DetailId"),
        type: "GET",
        dataType: "json",
        success: function (response) {
            status.textContent = response.status;
            staffId.textContent = response.staffId;
            projectId.textContent =response.projectId;
            remark.textContent = response.remarks;
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
            totalHours.textContent = response.totalHours;
            GetInfoStaffAndProject(response.staffId, function (infoResponse) {
                staffName.textContent = infoResponse.name;
                for (let i = 0; i < infoResponse.workingDTOS.length; i++) {
                    if (infoResponse.workingDTOS[i].project.id === response.projectId) {
                        nameProject.textContent = infoResponse.workingDTOS[i].project.nameProject;
                        roleInProject.textContent =infoResponse.workingDTOS[i].roleStaff;
                        let sqlDate = infoResponse.workingDTOS[i].startDate;
                        let jsDate = new Date(sqlDate);

                        let year = jsDate.getFullYear();
                        let month = String(jsDate.getMonth() + 1).padStart(2, '0');
                        let day = String(jsDate.getDate()).padStart(2, '0');

                        let formattedDate = `${year}-${month}-${day}`;
                        startDate.textContent = formattedDate;
                        let sqlEndDate = infoResponse.workingDTOS[i].endDate;
                        let jsEndDate = new Date(sqlEndDate);

                        year = jsEndDate.getFullYear();
                        month = String(jsEndDate.getMonth() + 1).padStart(2, '0');
                        day = String(jsEndDate.getDate()).padStart(2, '0');

                        let formattedEndDate = `${year}-${month}-${day}`;
                        endDate.textContent = formattedEndDate;
                        break;
                    }
                }
            });
        },
        error: function (xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}

function GetInfoStaffAndProject(e, callback) {
    $.ajax({
        url: "/api/staff/" + e,
        type: "GET",
        dataType: "json",
        success: function (response) {
            if (callback) {
                callback(response);
            }
        },
        error: function (xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}

ApproveStaffPending();

function submitApproveClaim(e) {
    let claimData = {
        status: "Approved",
        claimDate: dateOutput.textContent,
        day: dayOutput.textContent,
        fromDate: fromOutput.textContent,
        toDate: toOutput.textContent,
        totalHours: totalOutput.textContent,
        remarks: remark.value,
        staffDTO: {
            id: staffId.textContent
        },
        projectDTO: {
            id: projectId.textContent
        }
    };
    $.ajax({
        url: "/api/claims/" + sessionStorage.getItem("DetailId"),
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(claimData),
        success: function (response) {
            alert("Approve thành công!");
            window.location.href = "/claim/pending/" + e;
        },
        error: function (xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}
function submitRejectClaim(e) {
    let claimData = {
        status: "Reject",
        claimDate: dateOutput.textContent,
        day: dayOutput.textContent,
        fromDate: fromOutput.textContent,
        toDate: toOutput.textContent,
        totalHours: totalOutput.textContent,
        remarks: remark.value,
        staffDTO: {
            id: staffId.textContent
        },
        projectDTO: {
            id: projectId.textContent
        }
    };
    $.ajax({
        url: "/api/claims/" + sessionStorage.getItem("DetailId"),
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(claimData),
        success: function (response) {
            alert("Reject thành công!");
            window.location.href = "/claim/pending/" + e;
        },
        error: function (xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}
function submitReturnClaim(e) {
    let claimData = {
        status: "Return",
        claimDate: dateOutput.textContent,
        day: dayOutput.textContent,
        fromDate: fromOutput.textContent,
        toDate: toOutput.textContent,
        totalHours: totalOutput.textContent,
        remarks: remark.value,
        staffDTO: {
            id: staffId.textContent
        },
        projectDTO: {
            id: projectId.textContent
        }
    };
    $.ajax({
        url: "/api/claims/" + sessionStorage.getItem("DetailId"),
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(claimData),
        success: function (response) {
            alert("Return thành công!");
            window.location.href = "/claim/pending/" + e;
        },
        error: function (xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}
getStaffByEmail();