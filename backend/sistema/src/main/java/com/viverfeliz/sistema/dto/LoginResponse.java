package com.viverfeliz.sistema.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private String mensagem;
    private String nome;
    private String email;
}