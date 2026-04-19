package com.viverfeliz.sistema.repository;

import com.viverfeliz.sistema.model.Voluntario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoluntarioRepository extends JpaRepository<Voluntario, Long> {
}