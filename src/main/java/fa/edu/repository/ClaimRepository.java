package fa.edu.repository;

import fa.edu.entities.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Integer> {
    List<Claim> findByStaffId(Integer staffId);

    @Query("SELECT c FROM Claim c JOIN FETCH c.project WHERE c.staffId = :staffId")
    List<Claim> findClaimsAndProjectsByStaffId(Integer staffId);

    @Query("SELECT c FROM Claim c WHERE c.project.id = :projectId")
    List<Claim> findClaimsByProjectId(@Param("projectId") Integer projectId);
}
