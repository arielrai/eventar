package br.furb.persistence;

import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import org.hibernate.Criteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.transaction.annotation.Transactional;

import br.furb.model.BaseEntity;

public abstract class BaseDao<T extends BaseEntity, E> {

	@Autowired protected HibernateTemplate hibernateTemplate;

	public abstract Class<T> getEntityClass();

	@Transactional(rollbackFor = Throwable.class)
	public E save(E pojo, Long id, Object...adicionais) {
		if (id != null) {
			T pojoToEntity = pojoToEntity(pojo, hibernateTemplate.load(getEntityClass(), id));
			T savedEntity = hibernateTemplate.merge(pojoToEntity);
			E newPojo = newPojo(adicionais);
			hibernateTemplate.getSessionFactory().getCurrentSession().flush();
			entityToPojo(savedEntity, newPojo);
			return newPojo;
		} else {
			T pojoToEntity = pojoToEntity(pojo, newEntity(adicionais));
			T savedEntity = hibernateTemplate.merge(pojoToEntity);
			E newPojo = newPojo(adicionais);
			hibernateTemplate.getSessionFactory().getCurrentSession().flush();
			entityToPojo(savedEntity, newPojo);
			return newPojo;
		}
	}

	@Transactional(readOnly = true)
	public E find(Long id) {
		T load = hibernateTemplate.load(getEntityClass(), id);
		E newPojo = newPojo();
		entityToPojo(load, newPojo);
		return newPojo;
	}

	@Transactional(readOnly = true)
	public List<E> findAll() {
		List<T> loadAll = hibernateTemplate.loadAll(getEntityClass());
		return loadAll.parallelStream().map(t -> {
			E newPojo = newPojo();
			entityToPojo(t, newPojo);
			return newPojo;
		}).collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public List<E> findAll(Consumer<Criteria> restrictions) {
		Criteria createCriteria = hibernateTemplate.getSessionFactory().getCurrentSession()
				.createCriteria(getEntityClass());
		restrictions.accept(createCriteria);
		List<T> list = createCriteria.list();
		return list.parallelStream().map(t -> {
			E newPojo = newPojo();
			entityToPojo(t, newPojo);
			return newPojo;
		}).collect(Collectors.toList());
	}

	@Transactional(rollbackFor = Throwable.class)
	public void delete(Long id) {
		hibernateTemplate.delete(hibernateTemplate.load(getEntityClass(), id));
	}

	protected abstract T pojoToEntity(E pojo, T entity);

	protected abstract E entityToPojo(T entity, E pojo);

	protected abstract T newEntity(Object... adicionais);

	protected abstract E newPojo(Object... adicionais);
}
