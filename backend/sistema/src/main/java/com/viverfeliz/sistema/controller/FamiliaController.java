package com.viverfeliz.sistema.controller;

import com.viverfeliz.sistema.model.Familia;
import com.viverfeliz.sistema.service.FamiliaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/familias")
public class FamiliaController {

    private final FamiliaService familiaService;

    public FamiliaController(FamiliaService familiaService) {
        this.familiaService = familiaService;
    }

    @PostMapping
    public ResponseEntity<Familia> cadastrar(@RequestBody Familia familia) {
        Familia novaFamilia = familiaService.cadastrar(familia);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaFamilia);
    }

    @GetMapping
    public ResponseEntity<List<Familia>> listarTodas() {
        return ResponseEntity.ok(familiaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Familia> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(familiaService.buscarPorId(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Familia>> buscar(@RequestParam String termo) {
        return ResponseEntity.ok(familiaService.buscarPorNomeOuCpf(termo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Familia> atualizar(@PathVariable Long id, @RequestBody Familia familia) {
        return ResponseEntity.ok(familiaService.atualizar(id, familia));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        familiaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}