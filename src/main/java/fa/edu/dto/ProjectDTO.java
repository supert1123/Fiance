package fa.edu.dto;

import fa.edu.entities.Working;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDTO {
    private Integer id;
    private String nameProject;
    private String projectCode;
    private Date startDate;
    private Date endDate;

    private List<Working> workings = new ArrayList<>();
}
