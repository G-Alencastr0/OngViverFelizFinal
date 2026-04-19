package com.viverfeliz.sistema.service;

import com.viverfeliz.sistema.model.Doacao;
import com.viverfeliz.sistema.repository.DoacaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoacaoService {

    private final DoacaoRepository doacaoRepository;

    public DoacaoService(DoacaoRepository doacaoRepository) {
        this.doacaoRepository = doacaoRepository;
    }

    public List<Doacao> listarTodas() {
        return doacaoRepository.findAll();
    }

    public Doacao salvar(Doacao doacao) {
        return doacaoRepository.save(doacao);
    }

    public Optional<Doacao> buscarPorId(Long id) {
        return doacaoRepository.findById(id);
    }

    public Doacao atualizar(Long id, Doacao doacaoAtualizada) {
        return doacaoRepository.findById(id)
                .map(doacao -> {
                    doacao.setItem(doacaoAtualizada.getItem());
                    doacao.setCategoria(doacaoAtualizada.getCategoria());
                    doacao.setQuantidade(doacaoAtualizada.getQuantidade());
                    doacao.setDoador(doacaoAtualizada.getDoador());
                    doacao.setData(doacaoAtualizada.getData());
                    return doacaoRepository.save(doacao);
                })
                .orElseThrow(() -> new RuntimeException("Doação não encontrada"));
    }

    public void deletar(Long id) {
        doacaoRepository.deleteById(id);
    }
}
