package br.furb.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;

@Configuration
@EnableResourceServer
class ResourceServer extends ResourceServerConfigurerAdapter {


    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.httpBasic().disable();

        http.authorizeRequests().antMatchers("/evento/**").authenticated();

        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }
}