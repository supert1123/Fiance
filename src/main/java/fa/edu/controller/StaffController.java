package fa.edu.controller;

import fa.edu.dto.StaffDTO;
import fa.edu.entities.Staff;
import fa.edu.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
public class StaffController {

    @Autowired
    StaffService staffService;

    @GetMapping("/admin/staff/list")
    public String getStaffPage() {
        return "staff/list";
    }

    @GetMapping("admin/staff/create")
    public String createStaffPage(Model model) {
        model.addAttribute("staffDTO", new StaffDTO());
        return "staff/create";
    }

    @PostMapping("admin/staff/create")
    public String createNewStaff(@ModelAttribute("staffDTO") StaffDTO staffDTO, BindingResult result) {
        if (result.hasErrors()) {
            return "staff/create";
        }

        staffService.createStaff(staffDTO);
        return "redirect:/admin/staff/list";
    }

    @GetMapping("admin/staff/edit/{id}")
    public String getEditStaffPage(Model model, @PathVariable Integer id) {
        try {
            model.addAttribute("updatingStaff", staffService.getStaffById(id));
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return "staff/edit";
    }

    @PostMapping("admin/staff/edit/{id}")
    public String editStaff(@ModelAttribute("updatingStaff") Staff staff, BindingResult result) {
        if (result.hasErrors()) {
            return "staff/edit";
        }

        staffService.saveStaff(staff);
        return "redirect:/admin/staff/list";
    }

    @GetMapping("admin/staff/delete/{id}")
    public String deleteStaff(@PathVariable Integer id) {
        staffService.deleteStaffById(id);
        return "redirect:/admin/staff/list";
    }
}
