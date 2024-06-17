package fa.edu.dto;

import lombok.*;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClaimDTO {
    private Integer id;
    private String status;
    private Date claimDate;
    private String day;
    private String fromDate;
    private String toDate;
    private Double totalHours;
    private String remarks;
    private StaffDTO staffDTO;
    private ProjectDTO projectDTO;
}
