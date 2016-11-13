package br.furb.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.context.SecurityContextHolder;

@WebServlet("/auth")
public class AuthServerServlet extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		try {
			if ("anonymousUser".equals(SecurityContextHolder.getContext().getAuthentication().getName())) {
				resp.sendError(401);
			}else{
				resp.sendError(200);
			}
		} catch (Exception e) {
			resp.sendError(401);
		}
	}
}
