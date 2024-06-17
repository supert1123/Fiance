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
        }
    });
}

function GetInfoStaffPending(e) {
    $.ajax({
        url: "/api/staff/" + e,
        type: "GET",
        dataType: "json",
        success: function (response) {
            let claimTable = $("#claimTable");
            claimTable.empty();
            response.workingDTOS.forEach(content => {
                if (content.roleStaff === "FINANCE") {
                    GetInfoProject(content.project.id, claimTable);
                }
            });
        },
        error: function (xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}

function GetInfoProject(projectId, claimTable) {
    $.ajax({
        url: "/api/claims/project/" + projectId,
        type: "GET",
        dataType: "json",
        success: function (response) {
            response.forEach(content => {
                if (content.status === "Paid") {
                    GetNameProject(content.projectId, function(nameProject) {
                        GetEmailStaff(content.staffId, function(email) {
                            let claimRow = `
                                <tr>
                                    <td>${email}</td>
                                    <td>${nameProject}</td>
                                    <td>${content.totalHours}</td>
                                    <td>${content.remarks}</td>
                                    <td style="color: #0d53e8">${content.status}</td>
                                 
                                </tr>
                            `;
                            claimTable.append(claimRow);
                        });
                    });
                }
            })
        },
        error: function (xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}

function GetNameProject(projectId, callback) {
    $.ajax({
        url: "/api/projects/" + projectId,
        type: "GET",
        dataType: "json",
        success: function (response) {
            callback(response.nameProject);
        },
        error: function (xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}

function GetEmailStaff(staffId, callback) {
    $.ajax({
        url: "/api/staff/" + staffId,
        type: "GET",
        dataType: "json",
        success: function (response) {
            callback(response.email);
        },
        error: function (xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}
function downloadClaimsToExcel() {
    // Get the table headers
    var headers = [];
    document.querySelectorAll("#table thead th").forEach(function (th) {
        headers.push(th.textContent);
    });

    // Get the claims data from the table
    var claims = [];
    document.querySelectorAll("#claimTable tr").forEach(function (row) {
        var rowData = [];
        row.querySelectorAll("td").forEach(function (cell) {
            rowData.push(cell.textContent);
        });
        claims.push(rowData);
    });

    var workbook = XLSX.utils.book_new();

    var worksheet = XLSX.utils.aoa_to_sheet([headers].concat(claims));

    XLSX.utils.book_append_sheet(workbook, worksheet, "Claims");

    var excelFile = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });

    var blob = new Blob([excelFile], {
        type: "application/octet-stream",
    });

    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "claims.xlsx";
    link.click();
}
document.getElementById("btn-download").addEventListener("click", function () {
    downloadClaimsToExcel();
});
let linkHome = document.getElementById("link-home");
linkHome.addEventListener("click",function () {
    window.location.href = "/claim/draft";
})
getStaffByEmail();