package fa.edu.webApi;

import fa.edu.dto.StaffDTO;
import fa.edu.entities.Staff;
import fa.edu.repository.StaffRepository;
import fa.edu.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class StaffApi {
    @Autowired
    private StaffService staffService;
    @Autowired
    StaffRepository staffRepository;

    @GetMapping("/api/staff/{id}")
    public ResponseEntity<StaffDTO> getStaffById(@PathVariable Integer id) {
        try {
            StaffDTO staffDTO = staffService.getStaff(id);
            return ResponseEntity.ok(staffDTO);
        } catch (ChangeSetPersister.NotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/api/staff/list")
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }
    @GetMapping("/api/staffByEmail/{email}")
    public Staff getStaffByEmail(@PathVariable String email) {
        return staffRepository.findByEmail(email);
    }
    @PostMapping("/loginSuccess")
    public ResponseEntity<String> login(@RequestBody Staff login) {
        String email = login.getEmail();
        String password = login.getPassword();
        Staff staff = staffRepository.findByEmail(email);
        if (staff == null) {
            return ResponseEntity.ok("fail");
        }

        if (!staff.getPassword().equals(password)) {
            return ResponseEntity.ok("fail");
        }
        return ResponseEntity.ok("success");
    }
}
