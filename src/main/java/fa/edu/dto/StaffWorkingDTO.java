package fa.edu.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class StaffWorkingDTO {
    private Integer staffId;
    private String roleStaff;
    private Date startDate;
    private Date endDate;
}
