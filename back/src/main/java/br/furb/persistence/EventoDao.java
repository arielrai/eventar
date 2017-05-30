package br.furb.persistence;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import br.furb.endpoints.evento.EventoPojo;
import br.furb.model.EventoEnderecoEntity;
import br.furb.model.EventoEntity;
import br.furb.model.UsuarioEntity;

@Repository
public class EventoDao extends BaseDao<EventoEntity, EventoPojo> {

	private static final SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault());
	
	@Override
	public Class<EventoEntity> getEntityClass() {
		return EventoEntity.class;
	}

	@Override
	protected EventoEntity pojoToEntity(EventoPojo pojo, EventoEntity entity) {
		entity.setCategoria(pojo.getCategoria());
		entity.setOrganizador(pojo.getOrganizador());
		try {
			entity.setDataFim(sdf.parse(pojo.getDtFinal()));
			entity.setDataInicial(sdf.parse(pojo.getDtInicial()));
		} catch (ParseException e) {
			//fu
		}
		entity.setDescricao(pojo.getDescricao());
		entity.setNomeEvento(pojo.getNome());
		entity.setUrlImagem(pojo.getUrlImagem());
		
		entity.getEnderecos().clear();
		if (pojo.getAddress() != null) {
			EventoEnderecoEntity eventoEnderecoEntity = new EventoEnderecoEntity();
			eventoEnderecoEntity.setEvento(entity);
			eventoEnderecoEntity.setComplemento(pojo.getLocalizacaoComplemento());
			eventoEnderecoEntity.setLat(pojo.getLat());
			eventoEnderecoEntity.setLng(pojo.getLng());
			eventoEnderecoEntity.setDescricao(pojo.getAddress());
			entity.getEnderecos().add(eventoEnderecoEntity);
		}
		
		Criteria criteria = hibernateTemplate.getSessionFactory().getCurrentSession()
				.createCriteria(UsuarioEntity.class);
		criteria.add(Restrictions.or(Restrictions.eq("login", SecurityContextHolder.getContext().getAuthentication().getName())));
		Object uniqueResult = criteria.uniqueResult();
		if (uniqueResult != null) {
			entity.setUsuario((UsuarioEntity)uniqueResult);
		}
		return entity;
	}

	@Override
	protected EventoPojo entityToPojo(EventoEntity entity, EventoPojo pojo) {
		pojo.setId(entity.getId());
		pojo.setCategoria(entity.getCategoria());
		pojo.setOrganizador(entity.getOrganizador());
		pojo.setUrlImagem(entity.getUrlImagem());
		pojo.setDtInicial(sdf.format(entity.getDataInicial()));
		pojo.setDtFinal(sdf.format(entity.getDataFim()));
		
		pojo.setDescricao(entity.getDescricao());
		pojo.setNome(entity.getNomeEvento());

		List<EventoEnderecoEntity> enderecos = entity.getEnderecos();
		if (enderecos != null && enderecos.size() > 0) {
			EventoEnderecoEntity eventoEnderecoEntity = enderecos.get(0);
			pojo.setLocalizacaoComplemento(eventoEnderecoEntity.getComplemento());
			pojo.setLat(eventoEnderecoEntity.getLat());
			pojo.setLng(eventoEnderecoEntity.getLng());
			pojo.setAddress(eventoEnderecoEntity.getDescricao());
		}
		pojo.setUsuario(entity.getUsuario());
		return pojo;
	}

	@Override
	protected EventoEntity newEntity(Object...adicionais) {
		return new EventoEntity();
	}

	@Override
	protected EventoPojo newPojo(Object...adicionais) {
		return new EventoPojo();
	}

}
