package fa.edu.webApi;

import fa.edu.dto.ClaimDTO;
import fa.edu.entities.Claim;
import fa.edu.entities.Project;
import fa.edu.entities.Staff;
import fa.edu.repository.ClaimRepository;
import fa.edu.repository.ProjectRepository;
import fa.edu.repository.StaffRepository;
import fa.edu.service.ClaimService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class ClaimApi {

    @Autowired
    private ClaimService claimService;
    @Autowired
    private ClaimRepository claimRepository;
    @Autowired
    private StaffRepository staffRepository;
    @Autowired
    private ProjectRepository projectRepository;

    @PostMapping("/api/createClaim")
    public ResponseEntity<Claim> createClaim(@RequestBody ClaimDTO claimDTO) {
        Claim createdClaim = claimService.createClaim(claimDTO);
        return ResponseEntity.ok(createdClaim);
    }
    @GetMapping("/api/claims/staff/{staffId}")
    public List<Claim> getClaimsAndProjectsByStaffId(@PathVariable Integer staffId) {
        return claimRepository.findClaimsAndProjectsByStaffId(staffId);
    }
    @GetMapping("/api/claims/{id}")
    public Optional<Claim> getClaim(@PathVariable Integer id) {
        return claimRepository.findById(id);
    }

    @PutMapping("/api/claims/{id}")
    public ResponseEntity<Claim> updateClaim(@PathVariable Integer id, @RequestBody ClaimDTO claimDTO) {
        Optional<Claim> optionalClaim = claimRepository.findById(id);
        if (optionalClaim.isPresent()) {
            Claim existingClaim = optionalClaim.get();

            // Cập nhật thông tin từ claimDTO
            existingClaim.setStatus(claimDTO.getStatus());
            existingClaim.setClaimDate(claimDTO.getClaimDate());
            existingClaim.setDay(claimDTO.getDay());
            existingClaim.setFromDate(claimDTO.getFromDate());
            existingClaim.setToDate(claimDTO.getToDate());
            existingClaim.setTotalHours(claimDTO.getTotalHours());
            existingClaim.setRemarks(claimDTO.getRemarks());

            if (claimDTO.getStaffDTO() != null) {
                Staff staff = staffRepository.findById(claimDTO.getStaffDTO().getId())
                        .orElse(null);
                existingClaim.setStaff(staff);
            }

            if (claimDTO.getProjectDTO() != null) {
                Project project = projectRepository.findById(claimDTO.getProjectDTO().getId()).orElse(null);
                existingClaim.setProject(project);
            }

            // Lưu claim đã được cập nhật vào cơ sở dữ liệu
            Claim updatedClaim = claimRepository.save(existingClaim);

            return ResponseEntity.ok(updatedClaim);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/api/claims/staff/{id}")
    public ResponseEntity<?> deleteClaim(@PathVariable Integer id) {
        Optional<Claim> optionalClaim = claimRepository.findById(id);
        if (optionalClaim.isPresent()) {
            claimRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/api/claims/project/{projectId}")
    public List<Claim> getClaimsByProjectId(@PathVariable Integer projectId) {
        return claimRepository.findClaimsByProjectId(projectId);
    }
    @GetMapping("/api/claims")
    public List<Claim> getAll() {
        return claimRepository.findAll();
    }
    @PutMapping("/api/claims/{id}/status")
    public ResponseEntity<Claim> updateClaimStatus(@PathVariable Integer id, @RequestBody ClaimDTO claimDTO) {
        Optional<Claim> optionalClaim = claimRepository.findById(id);
        if (optionalClaim.isPresent()) {
            Claim existingClaim = optionalClaim.get();

            existingClaim.setStatus(claimDTO.getStatus());

            Claim updatedClaim = claimRepository.save(existingClaim);

            return ResponseEntity.ok(updatedClaim);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
