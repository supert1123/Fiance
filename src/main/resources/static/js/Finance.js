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
            let linkHome = document.getElementById("link-home");
            linkHome.addEventListener("click", function () {
                window.location.href = "/claim/draft";
            })
            let linkDownload = document.getElementById("link-download");
            linkDownload.addEventListener("click", function () {
                window.location.href = "/claim/financePaid/" + response.id;
            })

            document.getElementById("link-back").addEventListener("click", function () {
                window.location.href = "/claim/pending/" + response.id;
            })
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
                if (content.status === "Approved") {
                    console.log(content.id);
                    GetNameProject(content.projectId, function(nameProject) {
                        GetEmailStaff(content.staffId, function(email) {
                            let claimRow = `
                                <tr>
                                    <td><input type="checkbox" id="${content.id}" class="claim-checkbox"></td>
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
            });

            let selectAllCheckbox = document.getElementById("checkboxAll");
            selectAllCheckbox.addEventListener("change", function() {
                let checkboxes = document.querySelectorAll(".claim-checkbox");

                for (let i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = selectAllCheckbox.checked;
                }
            });
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

$("#paid-btn").on("click", function() {
    var selectedClaimIds = $(".claim-checkbox:checked").map(function() {
        return this.id;
    }).get();

    if (selectedClaimIds.length > 0) {

        $(this).prop("disabled", true);

        var updateCount = 0;
        selectedClaimIds.forEach(function(claimId) {
            var updateUrl = "/api/claims/" + claimId + "/status";
            var claimDTO = { status: "Paid" };

            $.ajax({
                url: updateUrl,
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(claimDTO),
                success: function() {
                    updateCount++;

                    if (updateCount === selectedClaimIds.length) {
                        alert("Đã Paid thành công!");
                        location.reload();
                    }
                },
                error: function(xhr, status, error) {
                    console.log(status + ": " + error);
                }
            });
        });
    } else {
        alert("Vui lòng chọn ít nhất một yêu cầu để thực hiện Paid.");
    }
});
getStaffByEmail();