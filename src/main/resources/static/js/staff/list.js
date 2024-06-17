function getAllStaff() {
    $.ajax({
        url: "/api/staff/list",
        type: "GET",
        dataType: "json",
        success: function (staffList) {
            staffList = staffList.filter(staff => staff.role !== "ROLE_ADMIN");

            let staffTable = $("#staff-table");
            staffTable.empty();
            staffList.forEach(staff => {
                staffTable.append(
                    `
                        <tr>
                            <td>${staff.name}</td>
                            <td>${staff.department}</td>
                            <td>${staff.rank}</td>
                            <td>${staff.salary}</td>
                            <td>
                                <a class="edit" href="/admin/staff/edit/${staff.id}" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
                                <a class="delete" onclick="deleteStaffById(${staff.id})" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
                            </td>
                        </tr>
                    `
                );
            });
        },
        error: function (xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}


getAllStaff();

function deleteStaffById(staffId) {
    if (confirm("You are sure?")===true) {
        window.location.href = "/admin/staff/delete/" + staffId;
    }

}