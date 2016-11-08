package br.furb.model;

@Deprecated
public class Necessidade {

	private transient String prevEventoNome;
	private String eventoNome;
	private String descricao;
	
	public void setEventoNome(String eventoNome) {
		this.eventoNome = eventoNome;
	}
	
	public String getEventoNome() {
		return eventoNome;
	}
	
	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}
	
	public String getDescricao() {
		return descricao;
	}
	
	public String getPrevEventoNome() {
		return prevEventoNome;
	}
	
	public void setPrevEventoNome(String prevEventoNome) {
		this.prevEventoNome = prevEventoNome;
	}
}
