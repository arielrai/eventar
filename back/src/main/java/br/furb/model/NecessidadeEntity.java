package br.furb.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = NecessidadeEntity.NECESSIDADE)
public class NecessidadeEntity implements BaseEntity{

	public static final String NECESSIDADE = "necessidade";

	@Id
	@GeneratedValue
	@Column(name = "id_necessidade")
	private Long id;

	@Column(name = "cd_necessidade")
	private Long codigo;

	@Column(name = "ds_necessidade", length = 4000)
	private String descricao;

	@ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, targetEntity = EventoEntity.class)
	@JoinColumn(name="necessidade_evento_id", nullable=true)
	private EventoEntity evento;
	
	@Override
	public Long getId() {
		return id;
	}

	@Override
	public void setId(Long idNecessidade) {
		this.id = idNecessidade;
	}

	public Long getCodigo() {
		return codigo;
	}

	public void setCodigo(Long codigo) {
		this.codigo = codigo;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public EventoEntity getEvento() {
		return evento;
	}
	
	public void setEvento(EventoEntity evento) {
		this.evento = evento;
	}
	
	@Override
	public String toString() {
		return "NecessidadeEntity [idNecessidade=" + id + ", codigo=" + codigo + ", descricao=" + descricao
				+ "]";
	}

}
