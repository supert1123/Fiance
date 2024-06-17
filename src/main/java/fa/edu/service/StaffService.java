package fa.edu.service;

import fa.edu.dto.ProjectDTO;
import fa.edu.dto.StaffDTO;
import fa.edu.dto.WorkingDTO;
import fa.edu.entities.*;
import fa.edu.repository.StaffRepository;
import fa.edu.repository.WorkingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class StaffService {
    private final StaffRepository staffRepository;

    public StaffService(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }
    @Autowired
    WorkingRepository workingRepository;

    public Staff getStaffById(Integer staffId) throws ChangeSetPersister.NotFoundException {
        return staffRepository.findById(staffId).orElseThrow(() -> new ChangeSetPersister.NotFoundException());
    }

    public Staff createStaff(StaffDTO staffDTO) {
        Staff staff = new Staff();

        staff.setName(staffDTO.getName());
        staff.setEmail(staffDTO.getEmail());
        staff.setPassword(staffDTO.getPassword());
        staff.setRePassword(staffDTO.getRePassword());

        staff.setDepartment(staffDTO.getDepartment());
        staff.setRank(staffDTO.getRank());
        staff.setSalary(staffDTO.getSalary());
        staff.setRole(RoleEnum.ROLE_STAFF);

        return saveStaff(staff);
    }

    public Staff saveStaff(Staff staff) {
        return staffRepository.save(staff);
    }

    public void deleteStaffById(Integer staffId) {
        staffRepository.deleteById(staffId);
    }

    public StaffDTO getStaff(Integer id) throws ChangeSetPersister.NotFoundException {
        Optional<Staff> staffOptional = staffRepository.findById(id);
        if (staffOptional.isPresent()) {
            Staff staff = staffOptional.get();

            StaffDTO staffDTO = new StaffDTO();
            staffDTO.setId(staff.getId());
            staffDTO.setName(staff.getName());
            staffDTO.setEmail(staff.getEmail());
            staffDTO.setDepartment(staff.getDepartment());

            List<Working> workingList = workingRepository.findByStaffId(id);
            List<WorkingDTO> workingDTOList = new ArrayList<>();

            for (Working working : workingList) {
                WorkingDTO workingDTO = new WorkingDTO();
                workingDTO.setId(working.getId());
                workingDTO.setRole(working.getRole());
                workingDTO.setRoleStaff(working.getRoleStaff());
                workingDTO.setEndDate(working.getEndDate());
                workingDTO.setStartDate(working.getStartDate());

                Project project = working.getProject();
                ProjectDTO projectDTO = new ProjectDTO();
                projectDTO.setId(project.getId());
                projectDTO.setNameProject(project.getNameProject());
                projectDTO.setProjectCode(project.getProjectCode());
                projectDTO.setEndDate(project.getEndDate());
                projectDTO.setStartDate(project.getStartDate());

                workingDTO.setProject(projectDTO);

                workingDTOList.add(workingDTO);
            }

            staffDTO.setWorkingDTOS(workingDTOList);

            return staffDTO;
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }
}
