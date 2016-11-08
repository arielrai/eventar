package br.furb.persistence;

import org.hibernate.Criteria;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import br.furb.endpoints.necessidade.NecessidadePojo;
import br.furb.model.EventoEntity;
import br.furb.model.NecessidadeEntity;

@Repository
public class NecessidadeDao extends BaseDao<NecessidadeEntity, NecessidadePojo> {

	@Override
	public Class<NecessidadeEntity> getEntityClass() {
		return NecessidadeEntity.class;
	}

	@Override
	protected NecessidadeEntity pojoToEntity(NecessidadePojo pojo, NecessidadeEntity entity) {
		entity.setDescricao(pojo.getDescricao());
//		entity.setCodigo(pojo.getCodigo());
		return entity;
	}

	@Override
	protected NecessidadePojo entityToPojo(NecessidadeEntity entity, NecessidadePojo pojo) {
		pojo.setId(entity.getId());
		pojo.setDescricao(entity.getDescricao());
		pojo.setCodigo(entity.getCodigo());
		return pojo;
	}

	@Override
	protected NecessidadeEntity newEntity(Object...adicionais) {
		NecessidadeEntity necessidadeEntity = new NecessidadeEntity();
		if (adicionais != null && adicionais.length > 0) {
			EventoEntity eventoEntity = hibernateTemplate.load(EventoEntity.class, (Long)adicionais[0]);
			necessidadeEntity.setEvento(eventoEntity);
			necessidadeEntity.setCodigo(getLastCodigo(eventoEntity.getId()));
		}
		return necessidadeEntity;
	}

	@Override
	protected NecessidadePojo newPojo(Object...adicionais) {
		return new NecessidadePojo();
	}

	@Transactional(readOnly = true)
	public Long getLastCodigo(Long eventoCodigo){
		Criteria eventoNecessidadeCriteria = hibernateTemplate
				.getSessionFactory().getCurrentSession().createCriteria(NecessidadeEntity.class);
		eventoNecessidadeCriteria.createAlias("evento", "ev");
		eventoNecessidadeCriteria.add(Restrictions.eq("ev.id", eventoCodigo));
		eventoNecessidadeCriteria.setProjection(Projections.max("codigo"));
		Object uniqueResult = eventoNecessidadeCriteria.uniqueResult();
		if (uniqueResult != null) {
			return (Long)uniqueResult+1L;
		}else{
			return 1L;
		}
	}
}
