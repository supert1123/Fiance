package fa.edu.webApi;

import fa.edu.dto.ProjectDTO;
import fa.edu.dto.ProjectStaffDTO;
import fa.edu.dto.StaffWorkingDTO;
import fa.edu.entities.*;
import fa.edu.repository.ProjectRepository;
import fa.edu.repository.WorkingRepository;
import fa.edu.service.ProjectService;
import fa.edu.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class ProjectApi {
    @Autowired
    ProjectService projectService;
    @Autowired
    StaffService staffService;
    @Autowired
    ProjectRepository projectRepository;
    @Autowired
    WorkingRepository workingRepository;

    @GetMapping("/api/projects/list")
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @PostMapping("/api/projects/create")
        public ResponseEntity<String> insertProjectAndStaff(@RequestBody ProjectStaffDTO projectStaffDTO) throws ChangeSetPersister.NotFoundException {
        Project project = projectStaffDTO.getProject();
        List<StaffWorkingDTO> staffWorkingDTOS = projectStaffDTO.getStaffs();

        project = projectService.createProject(project);

        for (StaffWorkingDTO staffDTO : staffWorkingDTOS) {
            Staff staff = staffService.getStaffById(staffDTO.getStaffId());

            Working working = new Working();
            working.setProject(project);
            working.setStaff(staff);
            working.setRoleStaff(staffDTO.getRoleStaff());
            working.setStartDate(staffDTO.getStartDate());
            working.setEndDate(staffDTO.getEndDate());

            projectService.createWorking(working);
        }
        return ResponseEntity.ok("Data inserted successfully");
    }
    @GetMapping("/api/projects/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable("id") int id) {
        ProjectDTO projectDTO = projectService.getProjectDTOById(id);
        if (projectDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(projectDTO);
    }

    @PostMapping("/api/projects/edit/{id}")
    public ResponseEntity<Project> editProject(@RequestBody ProjectStaffDTO projectStaffDTO) throws ChangeSetPersister.NotFoundException {
        Project updatedProject = projectStaffDTO.getProject();
        workingRepository.deleteAllByProjectId(updatedProject.getId());
        List<StaffWorkingDTO> staffWorkingDTOS = projectStaffDTO.getStaffs();

        updatedProject = projectService.createProject(updatedProject);

        for (StaffWorkingDTO staffDTO : staffWorkingDTOS) {
            Staff staff = staffService.getStaffById(staffDTO.getStaffId());

            Working working = new Working();
            working.setProject(updatedProject);
            working.setStaff(staff);
            working.setRoleStaff(staffDTO.getRoleStaff());
            working.setStartDate(staffDTO.getStartDate());
            working.setEndDate(staffDTO.getEndDate());

            projectService.createWorking(working);
        }

        return ResponseEntity.ok(updatedProject);
    }

    @DeleteMapping("/api/projects/delete/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Integer id) {
        Optional<Project> optionalProject = projectRepository.findById(id);
        if (optionalProject.isPresent()) {
            projectRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
