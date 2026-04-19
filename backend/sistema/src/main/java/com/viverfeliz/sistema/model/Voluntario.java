package com.viverfeliz.sistema.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "voluntarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Voluntario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String nascimento;
    private String cpf;
    private String telefone;
    private String email;

    private String rua;
    private String numero;
    private String bairro;
    private String cidade;
    private String estado;
    private String cep;

    private String area;
    private String disponibilidade;
    private String dias;
    private String experiencia;
    private String habilidades;

    @Column(columnDefinition = "TEXT")
    private String observacoes;
}
