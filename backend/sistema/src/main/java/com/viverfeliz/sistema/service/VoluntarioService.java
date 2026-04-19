package com.viverfeliz.sistema.service;

import com.viverfeliz.sistema.model.Voluntario;
import com.viverfeliz.sistema.repository.VoluntarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VoluntarioService {

    private final VoluntarioRepository voluntarioRepository;

    public VoluntarioService(VoluntarioRepository voluntarioRepository) {
        this.voluntarioRepository = voluntarioRepository;
    }

    public List<Voluntario> listarTodos() {
        return voluntarioRepository.findAll();
    }

    public Optional<Voluntario> buscarPorId(Long id) {
        return voluntarioRepository.findById(id);
    }

    public Voluntario salvar(Voluntario voluntario) {
        return voluntarioRepository.save(voluntario);
    }

    public Voluntario atualizar(Long id, Voluntario voluntarioAtualizado) {
        return voluntarioRepository.findById(id)
                .map(voluntario -> {
                    voluntario.setNome(voluntarioAtualizado.getNome());
                    voluntario.setNascimento(voluntarioAtualizado.getNascimento());
                    voluntario.setCpf(voluntarioAtualizado.getCpf());
                    voluntario.setTelefone(voluntarioAtualizado.getTelefone());
                    voluntario.setEmail(voluntarioAtualizado.getEmail());

                    voluntario.setRua(voluntarioAtualizado.getRua());
                    voluntario.setNumero(voluntarioAtualizado.getNumero());
                    voluntario.setBairro(voluntarioAtualizado.getBairro());
                    voluntario.setCidade(voluntarioAtualizado.getCidade());
                    voluntario.setEstado(voluntarioAtualizado.getEstado());
                    voluntario.setCep(voluntarioAtualizado.getCep());

                    voluntario.setArea(voluntarioAtualizado.getArea());
                    voluntario.setDisponibilidade(voluntarioAtualizado.getDisponibilidade());
                    voluntario.setDias(voluntarioAtualizado.getDias());
                    voluntario.setExperiencia(voluntarioAtualizado.getExperiencia());
                    voluntario.setHabilidades(voluntarioAtualizado.getHabilidades());
                    voluntario.setObservacoes(voluntarioAtualizado.getObservacoes());

                    return voluntarioRepository.save(voluntario);
                })
                .orElseThrow(() -> new RuntimeException("Voluntário não encontrado"));
    }

    public void deletar(Long id) {
        voluntarioRepository.deleteById(id);
    }
}