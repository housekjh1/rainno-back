package com.rainno.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rainno.domain.Member;

public interface MemberRepository extends JpaRepository<Member, String> {

}
