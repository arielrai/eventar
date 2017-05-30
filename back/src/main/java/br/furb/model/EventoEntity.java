package br.furb.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = EventoEntity.TABLE_NAME)
public class EventoEntity implements BaseEntity {

	public static final String TABLE_NAME = "evento";

	@Id
	@GeneratedValue
	@Column(name = "id_evento")
	private Long id;

	@Column(name = "nm_evento", length = 1500)
	private String nomeEvento;

	@Column(name = "ds_evento", length = 4000)
	private String descricao;

	@Column(name = "ct_evento", length = 200)
	private String categoria;
	
	@Column(name = "nm_organizador", length = 1500)
	private String organizador;

	@Column(name = "dt_inicio_evento")
	@Temporal(TemporalType.TIMESTAMP)
	private Date dataInicial;

	@Column(name = "dt_fim_evento")
	@Temporal(TemporalType.TIMESTAMP)
	private Date dataFim;

	@Column(name = "ds_link_facebook", length = 1000)
	private String linkFacebook;

	@Column(name = "url_imagem", length = 200)
	private String urlImagem;
	
	@OneToMany(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, targetEntity = NecessidadeEntity.class, mappedBy = "evento")
	private List<NecessidadeEntity> necesssidas = new ArrayList<>();

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = EventoEnderecoEntity.class, mappedBy = "evento")
	private List<EventoEnderecoEntity> enderecos = new ArrayList<>();

	@ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@JoinColumn(name = "usuario_id")
	private UsuarioEntity usuario;
	
	@Override
	public Long getId() {
		return this.id;
	}

	@Override
	public void setId(Long id) {
		this.id = id;
		;
	}

	public String getNomeEvento() {
		return nomeEvento;
	}

	public void setNomeEvento(String nomeEvento) {
		this.nomeEvento = nomeEvento;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public String getCategoria() {
		return categoria;
	}

	public void setCategoria(String categoria) {
		this.categoria = categoria;
	}

	public Date getDataInicial() {
		return dataInicial;
	}

	public void setDataInicial(Date dataInicial) {
		this.dataInicial = dataInicial;
	}

	public Date getDataFim() {
		return dataFim;
	}

	public void setDataFim(Date dataFim) {
		this.dataFim = dataFim;
	}

	public void setOrganizador(String organizador) {
		this.organizador = organizador;
	}
	
	public String getOrganizador() {
		return organizador;
	}
	
	public String getLinkFacebook() {
		return linkFacebook;
	}

	public void setUrlImagem(String urlImagem) {
		this.urlImagem = urlImagem;
	}
	
	public String getUrlImagem() {
		return urlImagem;
	}
	
	public void setLinkFacebook(String linkFacebook) {
		this.linkFacebook = linkFacebook;
	}

	public List<NecessidadeEntity> getNecesssidas() {
		return necesssidas;
	}

	public void setNecesssidas(List<NecessidadeEntity> necesssidas) {
		this.necesssidas = necesssidas;
	}

	public List<EventoEnderecoEntity> getEnderecos() {
		return enderecos;
	}

	public void setEnderecos(List<EventoEnderecoEntity> enderecos) {
		this.enderecos = enderecos;
	}
	
	public UsuarioEntity getUsuario() {
		return usuario;
	}
	
	public void setUsuario(UsuarioEntity usuario) {
		this.usuario = usuario;
	}

	@Override
	public String toString() {
		return "EventoEntity [nomeEvento=" + nomeEvento + ", descricao=" + descricao + ", categoria=" + categoria
				+ ", dataInicial=" + dataInicial + ", dataFim=" + dataFim + ", linkFacebook=" + linkFacebook + "]";
	}

}
