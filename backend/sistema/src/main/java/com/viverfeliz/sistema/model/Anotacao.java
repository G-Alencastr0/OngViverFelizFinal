package com.viverfeliz.sistema.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "anotacoes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Anotacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Título é obrigatório")
    private String titulo;

    @Column(columnDefinition = "TEXT")
    @NotBlank(message = "Texto é obrigatório")
    private String texto;

    private LocalDateTime dataCriacao;

    private LocalDateTime dataEdicao;
}