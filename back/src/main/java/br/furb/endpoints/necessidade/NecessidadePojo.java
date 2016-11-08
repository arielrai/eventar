package br.furb.endpoints.necessidade;

public class NecessidadePojo {

	private Long codigo;
	private Long eventoId;
	private String descricao;
	private Long id;
	
	public void setCodigo(Long codigo) {
		this.codigo = codigo;
	}
	
	public Long getCodigo() {
		return codigo;
	}
	
	public void setEventoId(Long eventoId) {
		this.eventoId = eventoId;
	}
	
	public Long getEventoId() {
		return eventoId;
	}
	
	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}
	
	public String getDescricao() {
		return descricao;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public Long getId() {
		return id;
	}
}
