package fa.edu.controller;

import fa.edu.repository.StaffRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class pageController {
    @Autowired
    StaffRepository staffRepository;
    @GetMapping("/claim/create")
    public String homePageClaim(HttpSession session) {
        staffRepository.findById((Integer) session.getAttribute("staffId"));
        return "createClaim";
    }
    @GetMapping("/claim/edit/{id}")
    public String EditClaim(@PathVariable Integer id) {
        staffRepository.findById(id);
        return "EditClaim";
    }
    @GetMapping("/index")
    public String homePage() {
        return "index";
    }
}
