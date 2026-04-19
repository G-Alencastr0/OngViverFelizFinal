package com.viverfeliz.sistema.repository;

import com.viverfeliz.sistema.model.Familia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FamiliaRepository extends JpaRepository<Familia, Long> {

    Optional<Familia> findByCpf(String cpf);

    List<Familia> findByNomeContainingIgnoreCaseOrCpfContaining(String nome, String cpf);
}