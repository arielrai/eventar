package br.furb.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = UsuarioEntity.TABLE_NAME, uniqueConstraints = {
        @UniqueConstraint(columnNames = "ds_login"),
        @UniqueConstraint(columnNames = "ds_email")
})
public class UsuarioEntity implements BaseEntity {

	public static final String TABLE_NAME = "usuario";

	@Id
	@GeneratedValue
	@Column(name = "id_usuario")
	private Long id;

	@NotNull
	@Column(name = "ds_login", length = 400)
	private String login;
	
	@NotNull
	@Column(name = "nm_usuario", length = 500)
	private String nome;

	@NotNull
	@Column(name = "ds_senha", length = 400)
	private String senha;

	@NotNull
	@Column(name = "ds_email", length = 400)
	private String email;

	@Override
	public Long getId() {
		return id;
	}

	@Override
	public void setId(Long id) {
		this.id = id;
	}

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getNome() {
		return nome;
	}
	
	public void setNome(String nome) {
		this.nome = nome;
	}
}
