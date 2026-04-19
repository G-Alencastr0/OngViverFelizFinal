package com.viverfeliz.sistema.controller;

import com.viverfeliz.sistema.model.Anotacao;
import com.viverfeliz.sistema.service.AnotacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/anotacoes")
public class AnotacaoController {

    @Autowired
    private AnotacaoService service;

    // LISTAR
    @GetMapping
    public List<Anotacao> listar() {
        return service.listar();
    }

    // CRIAR
    @PostMapping
    public Anotacao criar(@RequestBody Anotacao anotacao) {
        return service.criar(anotacao);
    }

    // EDITAR
    @PutMapping("/{id}")
    public Anotacao editar(@PathVariable Long id, @RequestBody Anotacao anotacao) {
        return service.editar(id, anotacao);
    }

    // EXCLUIR
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}