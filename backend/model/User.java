package com.careerpulse.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data // Lombok annotation to generate getters, setters, etc.
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullName;
    @Column(unique = true)
    private String email;
    private String password;
    private String userType;
    // You can add a @OneToOne mapping to a Profile entity here
}