package com.viverfeliz.sistema.service;

import com.viverfeliz.sistema.model.Anotacao;
import com.viverfeliz.sistema.repository.AnotacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AnotacaoService {

    @Autowired
    private AnotacaoRepository repository;

    public List<Anotacao> listar() {
        return repository.findAll();
    }

    public Anotacao criar(Anotacao anotacao) {
        anotacao.setDataCriacao(LocalDateTime.now());
        return repository.save(anotacao);
    }

    public Anotacao editar(Long id, Anotacao novaAnotacao) {
        Optional<Anotacao> anotacaoOpt = repository.findById(id);

        if (anotacaoOpt.isPresent()) {
            Anotacao anotacao = anotacaoOpt.get();
            anotacao.setTitulo(novaAnotacao.getTitulo());
            anotacao.setTexto(novaAnotacao.getTexto());
            anotacao.setDataEdicao(LocalDateTime.now());

            return repository.save(anotacao);
        }

        return null;
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}