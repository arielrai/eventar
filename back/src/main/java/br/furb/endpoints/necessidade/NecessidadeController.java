package br.furb.endpoints.necessidade;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.furb.persistence.NecessidadeDao;

@RestController
@RequestMapping("necessidade/{idEvento}")
public class NecessidadeController {

	@Autowired @Lazy private NecessidadeDao necessidadeDao;

	@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.DELETE, value = "/{idNecessidade}")
	public void removeNecessidade(@PathVariable("idNecessidade") Long idNecessidade) {
		necessidadeDao.delete(idNecessidade);
	}

	@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
	public NecessidadePojo adicionaNecessidade(@PathVariable("idEvento") Long idEvento, Long idNecessidade, @RequestBody NecessidadePojo necessidadePojo) {
		return necessidadeDao.save(necessidadePojo, idNecessidade, idEvento);
	}

	@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
	public List<NecessidadePojo> listarNecessidade(@PathVariable("idEvento") Long idEvento) {
		return necessidadeDao.findAll(crit -> {
			crit.createAlias("evento", "ev");
			crit.add(Restrictions.eq("ev.id", idEvento));
		});
	}
}
