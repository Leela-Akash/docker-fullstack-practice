package com.apartment.controller;

import com.apartment.entity.Apartment;
import com.apartment.service.ApartmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apartments")
@CrossOrigin(origins = "*") // frontend port for Vite
public class ApartmentController {

    private final ApartmentService service;

    public ApartmentController(ApartmentService service) {
        this.service = service;
    }
    @GetMapping("/health")
    public String healthCheck() {
        return "✅ RentWise Backend is running!";
    }

    @GetMapping
    public List<Apartment> getAll() {
        return service.getAllApartments();
    }

    @GetMapping("/{id}")
    public Apartment getOne(@PathVariable int id) {
        return service.getApartmentById(id);
    }

    @PostMapping
    public Apartment create(@RequestBody Apartment apartment) {
        return service.createApartment(apartment);
    }

    @PutMapping("/{id}")
    public Apartment update(@PathVariable int id, @RequestBody Apartment apartment) {
        return service.updateApartment(id, apartment);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        service.deleteApartment(id);
    }
 // 🔹 Toggle status between Available / Occupied
    @PatchMapping("/{id}/toggle-status")
    public Apartment toggleStatus(@PathVariable int id) {
        Apartment apartment = service.getApartmentById(id);
        if (apartment.getStatus().equalsIgnoreCase("Available")) {
            apartment.setStatus("Occupied");
        } else {
            apartment.setStatus("Available");
        }
        return service.updateApartment(id, apartment);
    }
}