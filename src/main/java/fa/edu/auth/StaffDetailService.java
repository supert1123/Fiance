package fa.edu.auth;

import fa.edu.entities.Staff;
import fa.edu.repository.StaffRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class StaffDetailService implements UserDetailsService {
    @Autowired
    StaffRepository staffRepository;
    @Autowired
    HttpSession session;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Staff staff = staffRepository.findByEmail(username);
        if (staff == null) {
            throw new UsernameNotFoundException("Username is not found");
        }
        StaffDetail staffDetail = new StaffDetail();
        staffDetail.setStaff(staff);
        session.setAttribute("staffId", staff.getId());
        return staffDetail;
    }
}
