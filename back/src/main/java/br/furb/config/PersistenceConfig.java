package br.furb.config;

import java.util.Properties;

import javax.sql.DataSource;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.orm.hibernate5.HibernateTransactionManager;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
public class PersistenceConfig {

	@Bean
	public LocalSessionFactoryBean sessionFactory() {
		LocalSessionFactoryBean sessionFactory = new LocalSessionFactoryBean();
		sessionFactory.setDataSource(dataSource());
		sessionFactory.setPackagesToScan(new String[] { "br.furb" });
		sessionFactory.setHibernateProperties(additionalProperties());

		return sessionFactory;
	}

	@Bean
	public DataSource dataSource() {
		DriverManagerDataSource dataSource = new DriverManagerDataSource();
		dataSource.setDriverClassName("com.mysql.jdbc.Driver");
		dataSource.setUrl("jdbc:mysql://db:3306/eventar");
		dataSource.setUsername("root");
		dataSource.setPassword("example");
		return dataSource;
	}

	@Bean
	@Autowired
	public HibernateTransactionManager transactionManager(SessionFactory sessionFactory) {
		HibernateTransactionManager txManager = new HibernateTransactionManager();
		txManager.setSessionFactory(sessionFactory);

		return txManager;
	}

	@Bean
	public PersistenceExceptionTranslationPostProcessor exceptionTranslation() {
		return new PersistenceExceptionTranslationPostProcessor();
	}
	
	@Bean
	@Autowired
	public HibernateTemplate getTemplate(SessionFactory sessionFactory){
		return new HibernateTemplate(sessionFactory);
	}

	Properties additionalProperties() {
		Properties properties = new Properties();
		properties.setProperty("hibernate.connection.driver_class", "com.mysql.jdbc.Driver");
//		properties.setProperty("hibernate.connection.url", "jdbc:mysql://localhost/admcenterweb");
//		properties.setProperty("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
//		properties.setProperty("hibernate.connection.username", "root");
//		properties.setProperty("hibernate.connection.password", "aluno");
//		properties.setProperty("hibernate.show_sql", "true");
//		properties.setProperty("hibernate.format_sql", "true");
		properties.setProperty("hibernate.hbm2ddl.auto", "update");
		return properties;
	}
}