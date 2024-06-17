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
            GetInfoStaffPending(response.id);
        },
        error: function(xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}

function GetInfoStaffPending(e) {
    $.ajax({
        url: "/api/staff/" + e,
        type: "GET",
        dataType: "json",
        success: function(response) {
            let claimTable = $("#claimTable");
            claimTable.empty();
            response.workingDTOS.forEach(content => {
                if (content.roleStaff === "PM") {
                    GetInfoProject(content.project.id, claimTable, e);
                }
            });
        },
        error: function(xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}

function GetInfoProject(projectId, claimTable, e) {
    $.ajax({
        url: "/api/claims/project/" + projectId,
        type: "GET",
        dataType: "json",
        success: function(response) {
            response.forEach(content => {
                if (content.status === "Pending") {
                    GetNameProject(content.projectId, function(nameProject) {
                        GetEmailStaff(content.staffId, function(email) {
                            let claimRow = `
                                <tr>
                                    <td>${email}</td>
                                    <td>${nameProject}</td>
                                    <td>${content.totalHours}</td>
                                    <td>${content.remarks}</td>
                                    <td style="color: #ffd536">${content.status}</td>
                                    <td>
                                        <button class="btn btn-primary" onclick="changeLink(${e},${content.id})">
                                            <i class="fa fa-pen"></i> Details</button>
                                    </td>
                                </tr>
                            `;
                            claimTable.append(claimRow);
                        });
                    });
                }
            });
        },
        error: function(xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}

function GetNameProject(projectId, callback) {
    $.ajax({
        url: "/api/projects/" + projectId,
        type: "GET",
        dataType: "json",
        success: function(response) {
            callback(response.nameProject);
        },
        error: function(xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}

function GetEmailStaff(staffId, callback) {
    $.ajax({
        url: "/api/staff/" + staffId,
        type: "GET",
        dataType: "json",
        success: function(response) {
            callback(response.email);
        },
        error: function(xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}

function changeLink(staffId, claimId) {
    sessionStorage.setItem("DetailId",claimId);
    window.location.href = "/claim/approve/" + claimId;
}

let linkHome = document.getElementById("link-home");
linkHome.setAttribute("href", "/claim/draft");

getStaffByEmail();