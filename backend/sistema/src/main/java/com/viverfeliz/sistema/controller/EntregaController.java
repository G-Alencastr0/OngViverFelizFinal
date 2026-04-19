package com.viverfeliz.sistema.controller;

import com.viverfeliz.sistema.model.Entrega;
import com.viverfeliz.sistema.service.EntregaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/entregas")
public class EntregaController {

    private final EntregaService entregaService;

    public EntregaController(EntregaService entregaService) {
        this.entregaService = entregaService;
    }

    @GetMapping
    public List<Entrega> listarTodas() {
        return entregaService.listarTodas();
    }

    @PostMapping
    public Entrega criar(@RequestBody @Valid Entrega entrega) {
        return entregaService.salvar(entrega);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Entrega> buscarPorId(@PathVariable Long id) {
        return entregaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Entrega> atualizar(@PathVariable Long id, @RequestBody @Valid Entrega entrega) {
        try {
            Entrega entregaAtualizada = entregaService.atualizar(id, entrega);
            return ResponseEntity.ok(entregaAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (entregaService.buscarPorId(id).isPresent()) {
            entregaService.deletar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}