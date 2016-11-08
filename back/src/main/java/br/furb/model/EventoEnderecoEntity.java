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
@Table(name = EventoEnderecoEntity.TABLE_NAME)
public class EventoEnderecoEntity implements BaseEntity {

	public static final String TABLE_NAME = "evento_endereco";

	@Id
	@GeneratedValue
	@Column(name = "id_evento_endereco")
	private Long id;

	@Column(name = "ds_endereco", length = 4000)
	private String descricao;

	@Column(name = "lg_endereco", length = 100)
	private String lng;

	@Column(name = "lt_endereco", length = 100)
	private String lat;

	@Column(name = "ds_complemento", length = 4000)
	private String complemento;

	@ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, targetEntity = EventoEntity.class)
	@JoinColumn(name = "endereco_evento_id", nullable = true)
	private EventoEntity evento;

	@Override
	public Long getId() {
		return id;
	}

	@Override
	public void setId(Long id) {
		this.id = id;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public String getLng() {
		return lng;
	}

	public void setLng(String lng) {
		this.lng = lng;
	}

	public String getLat() {
		return lat;
	}

	public void setLat(String lat) {
		this.lat = lat;
	}

	public String getComplemento() {
		return complemento;
	}

	public void setComplemento(String complemento) {
		this.complemento = complemento;
	}

	public EventoEntity getEvento() {
		return evento;
	}

	public void setEvento(EventoEntity evento) {
		this.evento = evento;
	}

	@Override
	public String toString() {
		return "EventoEnderecoEntity [id=" + id + ", descricao=" + descricao + ", lng=" + lng + ", lat=" + lat
				+ ", complemento=" + complemento + ", evento=" + evento + "]";
	}

}
