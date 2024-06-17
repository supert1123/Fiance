package fa.edu.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import java.util.Date;
@Getter
@Setter
@Entity
public class Claim {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String status;
    private Date claimDate;
    private String Day;
    private String fromDate;
    private String toDate;
    private Double totalHours;
    private String remarks;
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "staff_id")
    private Staff staff;
    @Column(name = "staff_id",insertable = false,updatable = false)
    private Integer staffId;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "project_id")
    private Project project;
    @Column(name = "project_id",insertable = false,updatable = false)
    private Integer projectId;

}
