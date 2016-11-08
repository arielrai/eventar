package br.furb.model;

@Deprecated
public class Usuario {

	private String email;
	private String nome;
	private String senha;
	private boolean termosPoliticas;

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

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}

	public boolean isTermosPoliticas() {
		return termosPoliticas;
	}

	public void setTermosPoliticas(boolean termosPoliticas) {
		this.termosPoliticas = termosPoliticas;
	}

	@Override
	public String toString() {
		return "Usuario [email=" + email + ", nome=" + nome + ", senha=" + senha + ", termosPoliticas="
				+ termosPoliticas + "]";
	}

}
