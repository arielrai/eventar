package br.furb.file;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.furb.model.Evento;
import br.furb.model.Necessidade;
import br.furb.model.Usuario;

public class FileManager {

	private static final String USUARIO_FILE = "usuario.txt";
	private static final String EVENTO_FILE = "eventos.txt";
	private static final String NECESSIDADES_FILE = "necessidades_%s.txt";
	private static final Logger logger = LoggerFactory.getLogger(FileManager.class);
	private static final ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json().build();

	public static void salvaUsuario(String usuarioJson) {
		File file = new File(USUARIO_FILE);
		try {
			FileWriter fileWriter = new FileWriter(file, true);
			fileWriter.write(usuarioJson);
			fileWriter.write("\n");
			fileWriter.close();
		} catch (IOException e) {
			logger.error("Ocorreu um erro ao salvar o usuário", e);
		}
	}

	public static List<Usuario> carregaUsuarios() {
		File file = new File(USUARIO_FILE);
		List<Usuario> usuarios = new ArrayList<Usuario>();
		try (BufferedReader bufferedReader = new BufferedReader(new FileReader(file))) {
			String linhaUsuario = "";
			while ((linhaUsuario = bufferedReader.readLine()) != null) {
				usuarios.add(objectMapper.readValue(linhaUsuario, Usuario.class));
			}
		} catch (IOException e) {
			logger.error("Ocorreu um erro ao carregar os usuários usuário", e);
		}
		return usuarios;
	}

	public static void salvaEvento(String eventoJson) {
		List<Evento> carregaEventos = carregaEventos();
		File file = new File(EVENTO_FILE);
		try {
			Evento evento = objectMapper.readValue(eventoJson, Evento.class);
			carregaEventos.removeIf(t -> t.getNome().equals(evento.getNome()));
			carregaEventos.add(evento);
			FileWriter fileWriter = new FileWriter(file);
			carregaEventos.forEach(t -> {
				try {
					fileWriter.write(objectMapper.writeValueAsString(t));
					fileWriter.write("\n");
				} catch (IOException e) {
					//ignora
				}
			});
			fileWriter.close();
		} catch (IOException e) {
			logger.error("Ocorreu um erro ao salvar o usuário", e);
		}
	}

	public static List<Evento> carregaEventos() {
		File file = new File(EVENTO_FILE);
		List<Evento> eventos = new ArrayList<Evento>();
		try (BufferedReader bufferedReader = new BufferedReader(new FileReader(file))) {
			String linhaEvento = "";
			while ((linhaEvento = bufferedReader.readLine()) != null) {
				eventos.add(objectMapper.readValue(linhaEvento, Evento.class));
			}
		} catch (IOException e) {
			logger.error("Ocorreu um erro ao carregar os usuários usuário", e);
		}
		return eventos;
	}
	
	public static void salvaNecessidade(String necessidadeJson){
		try {
			int leftBracket = necessidadeJson.indexOf("{");
			int rightBracket = necessidadeJson.indexOf("}")+1;
			List<Necessidade> necessidades = new ArrayList<Necessidade>();
			while(rightBracket != 0){
				necessidades.add(objectMapper.readValue(necessidadeJson.substring(leftBracket, rightBracket), Necessidade.class));
				necessidadeJson = necessidadeJson.substring(rightBracket);
				leftBracket = necessidadeJson.indexOf("{");
				rightBracket = necessidadeJson.indexOf("}")+1;
			}
			Necessidade necessidade = necessidades.get(0);
			if (necessidade.getPrevEventoNome() != null) {
				File file = new File(String.format(NECESSIDADES_FILE, necessidade.getPrevEventoNome()));
				try {
					file.delete();
				} catch (Exception e) {
					// nada faz, apenas limpeza
				}
			}
			File file = new File(String.format(NECESSIDADES_FILE, necessidade.getEventoNome()));
			file.delete();
			FileWriter fileWriter = new FileWriter(file);
			necessidades.forEach(t -> {
				try {
					fileWriter.write(objectMapper.writeValueAsString(t));
					fileWriter.write("\n");
				} catch (IOException e) {
					//ignora
				}
			});
			fileWriter.close();
		} catch (IOException e) {
			logger.error("Ocorreu um erro ao salvar as necessidade", e);
		}
	}
	
	public static List<Necessidade> carregaNecessidades(String eventoNome) {
		File file = new File(String.format(NECESSIDADES_FILE, eventoNome));
		List<Necessidade> necessidades = new ArrayList<Necessidade>();
		if (!file.exists()) {
			return necessidades;
		}
		try (BufferedReader bufferedReader = new BufferedReader(new FileReader(file))) {
			String linhaNecessidade = "";
			while ((linhaNecessidade = bufferedReader.readLine()) != null) {
				necessidades.add(objectMapper.readValue(linhaNecessidade, Necessidade.class));
			}
		} catch (IOException e) {
			logger.error("Ocorreu um erro ao carregar as necessidade", e);
		}
		return necessidades;
	}
	
	public static void excluiNecesssidades(String eventoNome) {
		File file = new File(String.format(NECESSIDADES_FILE, eventoNome));
		file.delete();
	}
}
