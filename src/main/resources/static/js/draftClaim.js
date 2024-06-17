
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
                getAllDraftClaim(response.id);
                document.getElementById("createClaim").addEventListener("click", function () {
                    window.location.href = "/claim/create";
                })
                document.getElementById("list-pending").addEventListener("click", function() {
                    loadPendingClaim(response.id);
                });

                document.getElementById("list-approve").addEventListener("click", function() {
                    loadApprovedClaim(response.id);
                });

                document.getElementById("list-reject").addEventListener("click", function() {
                    loadRejectClaim(response.id);
                });
                let linkCreateClaim = document.getElementById("link-createClaim");
                let linkApprove = document.getElementById("link-approve");
                let linkFinance = document.getElementById("link-finance");
                linkCreateClaim.setAttribute("href","/claim/create");
                linkApprove.setAttribute("href","/claim/pending/" + response.id);
                linkFinance.setAttribute("href","/claim/finance/" + response.id);
            }
        });
}
getStaffByEmail();
function getAllDraftClaim(e) {
    $.ajax({
        url: "/api/claims/staff/" + e,
        type: "GET",
        dataType: "json",
        success: function(response) {
            let claimTable = $("#claimTable");
            claimTable.empty();
            response.forEach(content => {
                if (content.status === "Draft" || content.status === "Return") {
                    $.ajax({
                        url: "/api/projects/" + content.projectId,
                        type: "GET",
                        dataType: "json",
                        success: function(project) {
                            claimTable.append(
                                `
                                <tr id="${content.id}">
                                    <td>${project.nameProject}</td>
                                    <td>${content.totalHours}</td>
                                    <td>${content.remarks}</td>
                                    <td>${content.status}</td>
                                    <td><button class="btn btn-primary" onclick="EditClaimById(${content.id})"><i class="fa fa-pen"></i> Edit</button></td>
                                    <td><button class="btn btn-danger" onclick="deleteClaimById(${content.id})"><i class="fa fa-trash-alt"></i> Delete</button></td>
                                </tr>
                                `
                            );
                        },
                        error: function(xhr, status, error) {
                            console.log(status + ": " + error);
                        }
                    });
                }
            });
        },
        error: function(xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}

function deleteClaimById(claimId) {
    if (confirm("You are sure?")===true) {
        $.ajax({
            url: "/api/claims/staff/" + claimId,
            type: "DELETE",
            success: function(response) {
                location.reload();
            },
            error: function(xhr, status, error) {
                console.log("Error deleting claim: " + status + ": " + error);
            }
        });
    }
}
document.getElementById("createClaim").addEventListener("click", function () {
    window.location.href = "/claim/create";
})
function EditClaimById(id) {
    $.ajax({
        url: "/api/claims/" + id,
        type: "GET",
        success: function(response) {
            sessionStorage.setItem("claimId",id);
            window.location.href = "/claim/edit/" + id;
        },
        error: function(xhr, status, error) {
            console.log("Error edit claim: " + status + ": " + error);
        }
    });
}
function loadApprovedClaim(e) {
    $.ajax({
        url: "/api/claims/staff/" + e,
        type: "GET",
        dataType: "json",
        success: function(response) {
            let claimTable = $("#claimTable");
            claimTable.empty();
            response.forEach(content => {
                if (content.status === "Approved") {
                    $.ajax({
                        url: "/api/projects/" + content.projectId,
                        type: "GET",
                        dataType: "json",
                        success: function(project) {
                            claimTable.append(
                                `
                                <tr id="${content.id}">
                                    <td>${project.nameProject}</td>
                                    <td>${content.totalHours}</td>
                                    <td>${content.remarks}</td>
                                    <td>${content.status}</td>
                                </tr>
                                `
                            );
                        },
                        error: function(xhr, status, error) {
                            console.log(status + ": " + error);
                        }
                    });
                }
            });
        },
        error: function(xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}
function loadRejectClaim(e) {
    $.ajax({
        url: "/api/claims/staff/" + e,
        type: "GET",
        dataType: "json",
        success: function(response) {
            let claimTable = $("#claimTable");
            claimTable.empty();
            response.forEach(content => {
                if (content.status === "Reject") {
                    $.ajax({
                        url: "/api/projects/" + content.projectId,
                        type: "GET",
                        dataType: "json",
                        success: function(project) {
                            claimTable.append(
                                `
                                <tr id="${content.id}">
                                    <td>${project.nameProject}</td>
                                    <td>${content.totalHours}</td>
                                    <td>${content.remarks}</td>
                                    <td>${content.status}</td>
                                </tr>
                                `
                            );
                        },
                        error: function(xhr, status, error) {
                            console.log(status + ": " + error);
                        }
                    });
                }
            });
        },
        error: function(xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}
function loadPendingClaim(e) {
    $.ajax({
        url: "/api/claims/staff/" + e,
        type: "GET",
        dataType: "json",
        success: function(response) {
            let claimTable = $("#claimTable");
            claimTable.empty();
            response.forEach(content => {
                if (content.status === "Pending") {
                    $.ajax({
                        url: "/api/projects/" + content.projectId,
                        type: "GET",
                        dataType: "json",
                        success: function(project) {
                            claimTable.append(
                                `
                                <tr id="${content.id}">
                                    <td>${project.nameProject}</td>
                                    <td>${content.totalHours}</td>
                                    <td>${content.remarks}</td>
                                    <td>${content.status}</td>
                                </tr>
                                `
                            );
                        },
                        error: function(xhr, status, error) {
                            console.log(status + ": " + error);
                        }
                    });
                }
            });
        },
        error: function(xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}

jQuery(function ($) {
    $(".sidebar-submenu").hide();

    $(".sidebar-dropdown > a").click(function() {
        $(".sidebar-submenu").slideUp(200);
        if (
            $(this)
                .parent()
                .hasClass("active")
        ) {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .parent()
                .removeClass("active");
        } else {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .next(".sidebar-submenu")
                .slideDown(200);
            $(this)
                .parent()
                .addClass("active");
        }
    });

    $("#close-sidebar").click(function() {
        $(".page-wrapper").removeClass("toggled");
    });
    $("#show-sidebar").click(function() {
        $(".page-wrapper").addClass("toggled");
    });
});
let linkHome = document.getElementById("link-home");
linkHome.addEventListener("click",function () {
    location.reload();
})