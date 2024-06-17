const currentPath = window.location.pathname;
const pathElements = currentPath.split('/');
const lastElement = pathElements[pathElements.length - 1];

let hasPM = false;
let hasQA = false;

let roleList = [
    {
        value: "PM",
        text: "PM"
    },
    {
        value: "QA",
        text: "QA"
    },
    {
        value: "BA",
        text: "BA"
    },
    {
        value: "DEV",
        text: "DEV"
    },
    {
        value: "TESTER",
        text: "TESTER"
    },
    {
        value: "TECH_LEAD",
        text: "TECH LEAD"
    },
    {
        value: "TECH_CONSULTANT",
        text: "TECH CONSULTANT"
    },
    {
        value: "FINANCE",
        text: "FINANCE"
    }
];
function getRoleSelectInput() {
    let roleSelect = roleList;
    //Check if already have pm or qa selected
    hasPM = $('tbody tr:has(.select-role[value="PM"])').length;
    hasQA = $('tbody tr:has(.select-role[value="QA"])').length;

    if (hasPM) {
        roleSelect = roleSelect.filter(role => role.value !== "PM");
    }
    if (hasQA) {
        roleSelect = roleSelect.filter(role => role.value !== "QA");
    }
    let roleSelectHTML = '<select class="form-control select-role">';
    roleSelect.forEach(role => {
        roleSelectHTML += `<option value="${role.value}">${role.text}</option>`
    })
    roleSelectHTML += '</select>';

    return roleSelectHTML;
}

let projectName = $("#project-name");
let projectCode = $("#project-code");
let projectStart = $("#project-start");
let projectEnd = $("#project-end");
let projectId = lastElement;



function addRow(staffList) {
    let row = `
            <tr>
                <td class="select-staff">
                    ${getStaffSelectInput(staffList)}
                </td>

                <td class="select-role">
                    ${getRoleSelectInput()}
                </td>

                <td class="work-start">
                    <input type="date" class="form-control">
                </td>

                <td class="work-end">
                    <input type="date" class="form-control">
                </td>

                <td>
                    <div>
                        <a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>
                        <a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
                        <a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
                    </div>
                </td>
            </tr>
        `;
    $("tbody").append(row);
}
function getStaffSelectInput(staffList) {
    staffList = staffList.filter(staff => staff.role !== "ROLE_ADMIN");

    let selectElement = "<select class='form-control'>"
    staffList.forEach(staff => {
        let option = `
                <option value="${staff.id}">${staff.name}</option>
            `
        selectElement += option;
    })
    return selectElement + "</select>";
}

function getCurrentStaffs(staffList, workingList) {
    workingList.forEach(function(working) {
        let row = `
            <tr>
                <td class="select-staff" id="${working.staff.id}">
                    ${working.staff.name}
                </td>

                <td class="select-role" value="${working.roleStaff}">
                    ${working.roleStaff}
                </td>

                <td class="work-start">
                    ${working.startDate}
                </td>

                <td class="work-end">
                    ${working.endDate}
                </td>

                <td>
                    <div>
                        <a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>
                        <a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
                        <a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
                    </div>
                </td>
            </tr>
        `;
        $("tbody").append(row);

    });
}

function staffTable(staffList, workingList) {
    $('[data-toggle="tooltip"]').tooltip();
    // Append table with add row form on add new button click
    getCurrentStaffs(staffList, workingList)
    $(".add-new").click(function () {
        $(this).attr("disabled", "disabled");
        addRow(staffList);

        let index = $("table tbody tr:last-child").index();
        $("table tbody tr").eq(index).find(".add, .edit").toggle();
        $('[data-toggle="tooltip"]').tooltip();
    });

// Add row on add button click
    $(document).on("click", ".add", function () {
        var empty = false;
        var input = $(this).parents("tr").find('td:not(:last-child) > *');
        input.each(function () {
            if (!$(this).val()) {
                $(this).addClass("error");
                empty = true;
            } else {
                $(this).removeClass("error");
            }
        });
        $(this).parents("tr").find(".error").first().focus();

        if (!empty) {
            input.each(function () {
                let tdElement = $(this).parent("td");
                if (tdElement.attr('class') === 'select-staff') {
                    let selectedOption = $(this).find(':selected').text();
                    tdElement.html(selectedOption);
                    tdElement.attr('id', $(this).val());
                }
                else if (tdElement.attr('class') === 'select-role') {
                    let selectedOption = $(this).find(':selected').text();
                    tdElement.html(selectedOption);
                    tdElement.attr("value", $(this).val());
                }
                else {
                    tdElement.html($(this).val());
                }
            });
            $(this).parents("tr").find(".add, .edit").toggle();
            $(".add-new").removeAttr("disabled");
        }
    });

// Edit row on edit button click
    $(document).on("click", ".edit", function () {
        let tdList = $(this).parents("tr").find("td:not(:last-child)");
        tdList.each(function () {
            let tdClass = $(this).attr('class');
            let tdId = $(this).attr('id');

            if (tdClass === "select-staff") {
                $(this).html(getStaffSelectInput(staffList));
                $(this).find('select').val(tdId);
            } else if (tdClass === "select-role") {
                $(this).html(getRoleSelectInput());
                $(this).find('select').val($(this).attr('value'));
            }  else {
                $(this).html('<input type="date" class="form-control" value="' + $(this).text().trim() + '">');
            }

        });

        $(this).parents("tr").find(".add, .edit").toggle();
        $(".add-new").attr("disabled", "disabled");
    });
// Delete row on delete button click
    $(document).on("click", ".delete", function () {
        $(this).parents("tr").remove();
        $(".add-new").removeAttr("disabled");
    });
}

function getProjectToEdit() {
    $.ajax({
        url: "http://localhost:8080/api/projects/" + lastElement,
        method: "GET",
        contentType: "application/json",
        success: function(project) {
            projectName.val(project.nameProject);
            projectCode.val(project.projectCode);
            projectStart.val(project.startDate);
            projectEnd.val(project.endDate);

            getStaffList(project.workings);
        },
        error: function(xhr, status, error) {
        }
    });
}

function getStaffList(workingList) {
    $.ajax({
        url: "/api/staff/list",
        type: "GET",
        dataType: "json",
        success: function (response) {
            staffTable(response, workingList);
        },
        error: function (xhr, status, error) {
            console.log(status + ": " + error);
        }
    });

}
getProjectToEdit();

$(".save-project button").click(function () {
    let staffsData = [];

    let staffRows = $("tbody tr");
    staffRows.each(function () {
        let id = $(this).find(".select-staff").attr('id');
        let role = $(this).find(".select-role").attr('value');
        let start = $(this).find(".work-start").text();
        let end = $(this).find(".work-end").text();


        let staff = {
            staffId: id,
            roleStaff: role,
            startDate: start,
            endDate: end
        }

        staffsData.push(staff);
    });
    let projectData = {
        project: {
            id: projectId,
            nameProject: projectName.val(),
            projectCode: projectCode.val(),
            startDate: projectStart.val(),
            endDate: projectEnd.val()
        },

        staffs: staffsData
    }

    hasPM = $('tbody tr:has(.select-role[value="PM"])').length;
    hasQA = $('tbody tr:has(.select-role[value="QA"])').length;

    if (hasPM & hasQA) {
        $.ajax({
            url: "http://localhost:8080/api/projects/edit/" + projectId,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(projectData),
            success: function (response) {
                alert("Save thành công!");
                window.location.href = "/admin/projects/list";
            },
            error: function (xhr, status, error) {
                // Xử lý lỗi từ server
            }
        });
    }

    else {
        alert("Project doesnt have PM or QA!!!");
    }
});
