package br.furb.security;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.furb.model.UsuarioEntity;

@Service
public class EventarDetailService extends InMemoryUserDetailsManager implements UserDetailsService{

	public EventarDetailService() {
		super(Collections.emptyList());
	}
	
	public EventarDetailService(Collection<UserDetails> users) {
		super(users);
	}

	@Autowired
	private HibernateTemplate hibernateTemplate;

	@Transactional(readOnly = true)
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Criteria criteria = hibernateTemplate.getSessionFactory().getCurrentSession()
				.createCriteria(UsuarioEntity.class);
		criteria.add(Restrictions.or(Restrictions.eq("login", username), Restrictions.eq("email", username)));
		Object uniqueResult = criteria.uniqueResult();
		if (uniqueResult == null) {
			throw new UsernameNotFoundException(String.format("Usuário %s não encontrado.", username));
		}
		return new User(username, ((UsuarioEntity) uniqueResult).getSenha(),
				Arrays.asList(new SimpleGrantedAuthority("USER")));
	}

}
