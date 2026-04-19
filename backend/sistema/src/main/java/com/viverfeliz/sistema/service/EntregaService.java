package com.viverfeliz.sistema.service;

import com.viverfeliz.sistema.model.Entrega;
import com.viverfeliz.sistema.repository.EntregaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EntregaService {

    private final EntregaRepository entregaRepository;

    public EntregaService(EntregaRepository entregaRepository) {
        this.entregaRepository = entregaRepository;
    }

    public List<Entrega> listarTodas() {
        return entregaRepository.findAll();
    }

    public Entrega salvar(Entrega entrega) {
        return entregaRepository.save(entrega);
    }

    public Optional<Entrega> buscarPorId(Long id) {
        return entregaRepository.findById(id);
    }

    public Entrega atualizar(Long id, Entrega entregaAtualizada) {
        return entregaRepository.findById(id)
                .map(entrega -> {
                    entrega.setItem(entregaAtualizada.getItem());
                    entrega.setCategoria(entregaAtualizada.getCategoria());
                    entrega.setQuantidade(entregaAtualizada.getQuantidade());
                    entrega.setFamilia(entregaAtualizada.getFamilia());
                    entrega.setData(entregaAtualizada.getData());
                    return entregaRepository.save(entrega);
                })
                .orElseThrow(() -> new RuntimeException("Entrega não encontrada"));
    }

    public void deletar(Long id) {
        entregaRepository.deleteById(id);
    }
}