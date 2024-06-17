package fa.edu.service;

import fa.edu.repository.WorkingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class WorkingService {
    private final WorkingRepository workingRepository;

    @Autowired
    public WorkingService(WorkingRepository workingRepository) {
        this.workingRepository = workingRepository;
    }

}