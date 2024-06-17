package fa.edu.auth;

import fa.edu.entities.Staff;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
@Setter
public class StaffDetail implements UserDetails {
        Staff staff;
        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            ArrayList<SimpleGrantedAuthority> result = new ArrayList<>();
            String roleStaff = staff.getRole().name();
            result.add(new SimpleGrantedAuthority(roleStaff));
            return result;
        }

        @Override
        public String getPassword() {
            return staff.getPassword();
        }

        @Override
        public String getUsername() {
            return staff.getEmail();
        }
        public Staff getStaff() {
            return staff;
        }

        @Override
        public boolean isAccountNonExpired() {
            return true;
        }

        @Override
        public boolean isAccountNonLocked() {
            return true;
        }

        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }

        @Override
        public boolean isEnabled() {
            return true;
        }
}
