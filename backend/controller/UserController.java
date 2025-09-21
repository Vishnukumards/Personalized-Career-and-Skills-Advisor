package com.careerpulse.backend.controller;

import com.careerpulse.backend.model.User;
import com.careerpulse.backend.repository.UserRepository;
import com.careerpulse.backend.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private PredictionService predictionService;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}/suggestion")
    public ResponseEntity<?> getSuggestion(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        String prediction = predictionService.getCareerPrediction(user.getUserType());
        
        // You would save this prediction to the user's profile here
        
        return ResponseEntity.ok(Map.of("suggestedCareerPath", prediction));
    }
}