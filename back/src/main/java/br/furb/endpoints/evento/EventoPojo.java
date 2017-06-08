package br.furb.endpoints.evento;

import br.furb.model.UsuarioEntity;

public class EventoPojo {

	private String nome;
	private String descricao;
	private String categoria;
	private String urlFacebook;
	private String urlImagem;
	private String organizador;
	private String dtInicial;
	private String dtFinal;
	private String address;
	private String lng;
	private String lat;
	private String localizacaoComplemento;
	private Long id;
	private UsuarioEntity usuario;

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public String getUrlFacebook() {
		return urlFacebook;
	}

	public void setUrlFacebook(String urlFacebook) {
		this.urlFacebook = urlFacebook;
	}

	public String getOrganizador() {
		return organizador;
	}

	public void setOrganizador(String organizador) {
		this.organizador = organizador;
	}

	public String getDtInicial() {
		return dtInicial;
	}

	public void setDtInicial(String dtInicial) {
		this.dtInicial = dtInicial;
	}

	public String getDtFinal() {
		return dtFinal;
	}

	public void setDtFinal(String dtFinal) {
		this.dtFinal = dtFinal;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
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

	public void setCategoria(String categoria) {
		this.categoria = categoria;
	}
	
	public String getCategoria() {
		return categoria;
	}

	public void setLocalizacaoComplemento(String localizacaoComplemento) {
		this.localizacaoComplemento = localizacaoComplemento;
	}
	
	public String getLocalizacaoComplemento() {
		return localizacaoComplemento;
	}
	
	public void setUrlImagem(String urlImagem) {
		this.urlImagem = urlImagem;
	}
	
	public String getUrlImagem() {
		return urlImagem;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public Long getId() {
		return id;
	}

	public void setUsuario(UsuarioEntity usuario) {
		this.usuario = usuario;
	}
	
	public UsuarioEntity getUsuario() {
		return usuario;
	}
}
