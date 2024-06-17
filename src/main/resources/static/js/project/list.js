function getAllProjects() {
    $.ajax({
        url: "/api/projects/list",
        type: "GET",
        dataType: "json",
        success: function (response) {
            let projectTable = $("#project-table");
            projectTable.empty();
            console.log(response);
            response.forEach(project => {
                let pm = project.workings.find(w => w.roleStaff === "PM");
                let qa = project.workings.find(w => w.roleStaff === "QA");

                projectTable.append(
                    `
                        <tr>
                            <td>${pm.staff.name}</td>
                            <td>${qa.staff.name}</td>
                            <td>${project.nameProject}</td>
                            <td>${project.projectCode}</td>
                            <td>
                                <a class="edit" href="/admin/projects/edit/${project.id}" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
                                <a class="delete" onclick="deleteProjectById(${project.id})" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
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


getAllProjects();

function deleteProjectById(projectId) {
    if (confirm("You are sure?")===true) {
        $.ajax({
            url: "/api/projects/delete/" + projectId,
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