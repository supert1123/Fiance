package fa.edu.webApi;

import fa.edu.entities.Staff;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginApi {
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Staff staff, HttpServletResponse response) {
        if (staff.getEmail() != null && !staff.getEmail().isEmpty()) {
            Cookie cookie = new Cookie("userName", staff.getEmail());
            cookie.setMaxAge(7 * 24 * 60 * 60);
            response.addCookie(cookie);

            return ResponseEntity.ok("Đăng nhập thành công");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email không hợp lệ");
        }
    }
}
