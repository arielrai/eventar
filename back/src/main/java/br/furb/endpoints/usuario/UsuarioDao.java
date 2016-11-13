package br.furb.endpoints.usuario;

import org.springframework.stereotype.Service;

import br.furb.model.UsuarioEntity;
import br.furb.persistence.BaseDao;

@Service
public class UsuarioDao extends BaseDao<UsuarioEntity, UsuarioPojo> {

	@Override
	public Class<UsuarioEntity> getEntityClass() {
		return UsuarioEntity.class;
	}

	@Override
	protected UsuarioEntity pojoToEntity(UsuarioPojo pojo, UsuarioEntity entity) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected UsuarioPojo entityToPojo(UsuarioEntity entity, UsuarioPojo pojo) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected UsuarioEntity newEntity(Object... adicionais) {
		return new UsuarioEntity();
	}

	@Override
	protected UsuarioPojo newPojo(Object... adicionais) {
		return new UsuarioPojo();
	}

}
