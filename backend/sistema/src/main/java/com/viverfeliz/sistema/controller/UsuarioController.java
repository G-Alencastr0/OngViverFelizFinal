package com.viverfeliz.sistema.controller;

import com.viverfeliz.sistema.dto.LoginRequest;
import com.viverfeliz.sistema.dto.LoginResponse;
import com.viverfeliz.sistema.dto.UsuarioResponse;
import com.viverfeliz.sistema.model.Usuario;
import com.viverfeliz.sistema.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    @PostMapping
    public UsuarioResponse criar(@Valid @RequestBody Usuario usuario) {
        Usuario usuarioSalvo = service.salvar(usuario);
        return new UsuarioResponse(
                usuarioSalvo.getId(),
                usuarioSalvo.getNome(),
                usuarioSalvo.getEmail());
    }

    @GetMapping
    public List<UsuarioResponse> listar() {
        return service.listar()
                .stream()
                .map(usuario -> new UsuarioResponse(
                        usuario.getId(),
                        usuario.getNome(),
                        usuario.getEmail()))
                .collect(Collectors.toList());
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        Usuario usuario = service.login(request.getEmail(), request.getSenha());

        if (usuario != null) {
            return new LoginResponse(
                    "Login realizado com sucesso!",
                    usuario.getNome(),
                    usuario.getEmail());
        } else {
            return new LoginResponse(
                    "Email ou senha inválidos",
                    null,
                    null);
        }
    }
}