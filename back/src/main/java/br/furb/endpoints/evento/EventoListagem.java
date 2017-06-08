package br.furb.endpoints.evento;

import java.util.List;

public class EventoListagem {

	private List<EventoPojo> meusEventos;
	private List<EventoPojo> outrosEventos;

	public List<EventoPojo> getMeusEventos() {
		return meusEventos;
	}

	public void setMeusEventos(List<EventoPojo> meusEventos) {
		this.meusEventos = meusEventos;
	}

	public List<EventoPojo> getOutrosEventos() {
		return outrosEventos;
	}

	public void setOutrosEventos(List<EventoPojo> outrosEventos) {
		this.outrosEventos = outrosEventos;
	}
}
