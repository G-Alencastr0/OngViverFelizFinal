package com.viverfeliz.sistema.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "familias")
public class Familia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private LocalDate nascimento;

    private String rua;
    private String numero;
    private String bairro;
    private String cidade;
    private String estado;
    private String cep;

    private String telefone;
    private String email;

    @Column(nullable = false, unique = true)
    private String cpf;

    private String rg;

    private String genitor;
    private String genitora;

    private Integer moram;
    private String casa;
    private Integer trabalham;

    private String beneficios;
    private String tratamento;

    private String voluntario;

    @OneToMany(mappedBy = "familia", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<MembroFamilia> membrosFamilia = new ArrayList<>();

    public Familia() {
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public LocalDate getNascimento() {
        return nascimento;
    }

    public void setNascimento(LocalDate nascimento) {
        this.nascimento = nascimento;
    }

    public String getRua() {
        return rua;
    }

    public void setRua(String rua) {
        this.rua = rua;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getGenitor() {
        return genitor;
    }

    public void setGenitor(String genitor) {
        this.genitor = genitor;
    }

    public String getGenitora() {
        return genitora;
    }

    public void setGenitora(String genitora) {
        this.genitora = genitora;
    }

    public Integer getMoram() {
        return moram;
    }

    public void setMoram(Integer moram) {
        this.moram = moram;
    }

    public String getCasa() {
        return casa;
    }

    public void setCasa(String casa) {
        this.casa = casa;
    }

    public Integer getTrabalham() {
        return trabalham;
    }

    public void setTrabalham(Integer trabalham) {
        this.trabalham = trabalham;
    }

    public String getBeneficios() {
        return beneficios;
    }

    public void setBeneficios(String beneficios) {
        this.beneficios = beneficios;
    }

    public String getTratamento() {
        return tratamento;
    }

    public void setTratamento(String tratamento) {
        this.tratamento = tratamento;
    }

    public String getVoluntario() {
        return voluntario;
    }

    public void setVoluntario(String voluntario) {
        this.voluntario = voluntario;
    }

    public List<MembroFamilia> getMembrosFamilia() {
        return membrosFamilia;
    }

    public void setMembrosFamilia(List<MembroFamilia> membrosFamilia) {
        this.membrosFamilia = membrosFamilia;

        if (membrosFamilia != null) {
            for (MembroFamilia membro : membrosFamilia) {
                membro.setFamilia(this);
            }
        }
    }
}