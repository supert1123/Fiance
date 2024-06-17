package fa.edu.repository;

import fa.edu.entities.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface StaffRepository extends JpaRepository<Staff,Integer> {
    Staff findByEmail(String email);
}
