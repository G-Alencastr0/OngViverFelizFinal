package com.viverfeliz.sistema.controller;

import com.viverfeliz.sistema.model.Doacao;
import com.viverfeliz.sistema.service.DoacaoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doacoes")
public class DoacaoController {

    private final DoacaoService doacaoService;

    public DoacaoController(DoacaoService doacaoService) {
        this.doacaoService = doacaoService;
    }

    @GetMapping
    public List<Doacao> listarTodas() {
        return doacaoService.listarTodas();
    }

    @PostMapping
    public Doacao criar(@RequestBody @Valid Doacao doacao) {
        return doacaoService.salvar(doacao);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doacao> buscarPorId(@PathVariable Long id) {
        return doacaoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doacao> atualizar(@PathVariable Long id, @RequestBody @Valid Doacao doacao) {
        try {
            Doacao doacaoAtualizada = doacaoService.atualizar(id, doacao);
            return ResponseEntity.ok(doacaoAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (doacaoService.buscarPorId(id).isPresent()) {
            doacaoService.deletar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}