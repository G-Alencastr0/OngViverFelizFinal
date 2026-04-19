package com.viverfeliz.sistema.service;

import com.viverfeliz.sistema.model.Familia;
import com.viverfeliz.sistema.model.MembroFamilia;
import com.viverfeliz.sistema.repository.FamiliaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FamiliaService {

    private final FamiliaRepository familiaRepository;

    public FamiliaService(FamiliaRepository familiaRepository) {
        this.familiaRepository = familiaRepository;
    }

    public Familia cadastrar(Familia familia) {
        if (familiaRepository.findByCpf(familia.getCpf()).isPresent()) {
            throw new IllegalArgumentException("Já existe uma família cadastrada com este CPF.");
        }

        associarMembrosAFamilia(familia);

        return familiaRepository.save(familia);
    }

    public List<Familia> listarTodas() {
        return familiaRepository.findAll();
    }

    public Familia buscarPorId(Long id) {
        return familiaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Família não encontrada."));
    }

    public List<Familia> buscarPorNomeOuCpf(String termo) {
        return familiaRepository.findByNomeContainingIgnoreCaseOrCpfContaining(termo, termo);
    }

    public Familia atualizar(Long id, Familia familiaAtualizada) {
        Familia familiaExistente = buscarPorId(id);

        if (!familiaExistente.getCpf().equals(familiaAtualizada.getCpf())
                && familiaRepository.findByCpf(familiaAtualizada.getCpf()).isPresent()) {
            throw new IllegalArgumentException("Já existe uma família cadastrada com este CPF.");
        }

        familiaExistente.setNome(familiaAtualizada.getNome());
        familiaExistente.setNascimento(familiaAtualizada.getNascimento());
        familiaExistente.setRua(familiaAtualizada.getRua());
        familiaExistente.setNumero(familiaAtualizada.getNumero());
        familiaExistente.setBairro(familiaAtualizada.getBairro());
        familiaExistente.setCidade(familiaAtualizada.getCidade());
        familiaExistente.setEstado(familiaAtualizada.getEstado());
        familiaExistente.setCep(familiaAtualizada.getCep());
        familiaExistente.setTelefone(familiaAtualizada.getTelefone());
        familiaExistente.setEmail(familiaAtualizada.getEmail());
        familiaExistente.setCpf(familiaAtualizada.getCpf());
        familiaExistente.setRg(familiaAtualizada.getRg());
        familiaExistente.setGenitor(familiaAtualizada.getGenitor());
        familiaExistente.setGenitora(familiaAtualizada.getGenitora());
        familiaExistente.setMoram(familiaAtualizada.getMoram());
        familiaExistente.setCasa(familiaAtualizada.getCasa());
        familiaExistente.setTrabalham(familiaAtualizada.getTrabalham());
        familiaExistente.setBeneficios(familiaAtualizada.getBeneficios());
        familiaExistente.setTratamento(familiaAtualizada.getTratamento());
        familiaExistente.setVoluntario(familiaAtualizada.getVoluntario());

        familiaExistente.getMembrosFamilia().clear();

        if (familiaAtualizada.getMembrosFamilia() != null) {
            for (MembroFamilia membro : familiaAtualizada.getMembrosFamilia()) {
                membro.setFamilia(familiaExistente);
                familiaExistente.getMembrosFamilia().add(membro);
            }
        }

        return familiaRepository.save(familiaExistente);
    }

    public void deletar(Long id) {
        Familia familia = buscarPorId(id);
        familiaRepository.delete(familia);
    }

    private void associarMembrosAFamilia(Familia familia) {
        if (familia.getMembrosFamilia() != null) {
            for (MembroFamilia membro : familia.getMembrosFamilia()) {
                membro.setFamilia(familia);
            }
        }
    }
}
