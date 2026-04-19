package com.viverfeliz.sistema.controller;

import com.viverfeliz.sistema.model.Voluntario;
import com.viverfeliz.sistema.service.VoluntarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/voluntarios")
public class VoluntarioController {

    private final VoluntarioService voluntarioService;

    public VoluntarioController(VoluntarioService voluntarioService) {
        this.voluntarioService = voluntarioService;
    }

    @GetMapping
    public List<Voluntario> listarTodos() {
        return voluntarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Voluntario> buscarPorId(@PathVariable Long id) {
        return voluntarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Voluntario criar(@RequestBody Voluntario voluntario) {
        return voluntarioService.salvar(voluntario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Voluntario> atualizar(@PathVariable Long id, @RequestBody Voluntario voluntario) {
        try {
            Voluntario atualizado = voluntarioService.atualizar(id, voluntario);
            return ResponseEntity.ok(atualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (voluntarioService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        voluntarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
