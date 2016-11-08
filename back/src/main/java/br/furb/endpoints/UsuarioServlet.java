package br.furb.endpoints;

import java.io.BufferedReader;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.furb.file.FileManager;
import br.furb.model.Usuario;

@Deprecated
//@WebServlet("/usuario")
public class UsuarioServlet extends HttpServlet {

	private static final ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json().build();

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		StringBuffer jb = new StringBuffer();
		String line = null;
		try {
			BufferedReader reader = req.getReader();
			while ((line = reader.readLine()) != null)
				jb.append(line);
		} catch (Exception e) {
			resp.setStatus(HttpStatus.BAD_REQUEST.value());
		}
		FileManager.salvaUsuario(jb.toString());
		resp.setStatus(HttpStatus.OK.value());
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		StringBuffer jb = new StringBuffer();
		String line = null;
		try {
			BufferedReader reader = req.getReader();
			while ((line = reader.readLine()) != null)
				jb.append(line);
		} catch (Exception e) {
			resp.setStatus(HttpStatus.BAD_REQUEST.value());
		}
		Usuario usuario = objectMapper.readValue(jb.toString(), Usuario.class);
	}

}
