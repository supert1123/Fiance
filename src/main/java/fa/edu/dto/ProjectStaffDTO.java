package fa.edu.dto;

import fa.edu.entities.Project;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProjectStaffDTO {
    private Project project;
    private List<StaffWorkingDTO> staffs;
}
