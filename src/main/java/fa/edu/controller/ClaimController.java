package fa.edu.controller;

import fa.edu.repository.ClaimRepository;
import fa.edu.repository.StaffRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class ClaimController {
    @Autowired
    StaffRepository staffRepository;
    @Autowired
    ClaimRepository claimRepository;
    @GetMapping({"/","/login"})
    public String login() {
        return "login";
    }
//    @GetMapping("/claim/draft")
//    public String DraftClaim(HttpServletRequest request, HttpSession session) {
//        // Lấy id từ session
//        Integer staffId = (Integer) session.getAttribute("staffId");
//
//        // Chuyển hướng đến URL "/claim/draft/{id}"
//        return "redirect:/claim/draft/" + staffId;
//    }

    @GetMapping("/claim/draft")
    public String DraftClaimWithId(HttpSession session) {
        staffRepository.findById((Integer) session.getAttribute("staffId"));
        return "DraftClaim";
    }
    @GetMapping("/claim/pending/{id}")
    public String pendingClaim(@PathVariable("id") Integer id) {
        staffRepository.findById(id);
        return "PendingClaim";
    }
    @GetMapping("/claim/approve/{id}")
    public String approveClaim(@PathVariable("id") Integer id) {
        claimRepository.findById(id);
        return "ApproverClaim";
    }
    @GetMapping("/claim/finance/{id}")
    public String FinanceClaim(@PathVariable("id") Integer id) {
        staffRepository.findById(id);
        return "Finance";
    }
    @GetMapping("/claim/financePaid/{id}")
    public String FinancePaid(@PathVariable("id") Integer id) {
        staffRepository.findById(id);
        return "FinancePaid";
    }
}

