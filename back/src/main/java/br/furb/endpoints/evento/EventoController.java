package br.furb.endpoints.evento;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.furb.persistence.EventoDao;

@RestController
@RequestMapping("evento")
public class EventoController {

	@Autowired @Lazy private EventoDao eventoDao;

	@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
	public ResponseEntity<EventoListagem> getEventos() {
		List<EventoPojo> findAll = eventoDao.findAll();
		EventoListagem eventoListagem = new EventoListagem();
		
		eventoListagem.setMeusEventos(findAll.stream().filter(e -> e.getUsuario().getNome()
				.equals(SecurityContextHolder.getContext().getAuthentication().getName())).collect(Collectors.toList()));
		eventoListagem.setOutrosEventos(findAll.stream().filter(e -> !e.getUsuario().getNome()
				.equals(SecurityContextHolder.getContext().getAuthentication().getName())).collect(Collectors.toList()));
		return new ResponseEntity<>(eventoListagem, HttpStatus.OK);
	}

	@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET, value = "/{idEvento}")
	public ResponseEntity<EventoPojo> getEvento(@PathVariable("idEvento") Long idEvento) {
		return new ResponseEntity<>(eventoDao.find(idEvento), HttpStatus.OK);
	}

	@RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE,
			method = RequestMethod.POST, value = {"/{idEvento}"})
	public ResponseEntity<EventoPojo> saveEvento(@RequestBody EventoPojo evento,
			@PathVariable("idEvento") Long idEvento) {
		return new ResponseEntity<>(eventoDao.save(evento, idEvento), HttpStatus.OK);
	}
	
	@RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE,
			method = RequestMethod.POST)
	public ResponseEntity<EventoPojo> cadastraEvento(@RequestBody EventoPojo evento) {
		return new ResponseEntity<>(eventoDao.save(evento, null), HttpStatus.OK);
	}
}
