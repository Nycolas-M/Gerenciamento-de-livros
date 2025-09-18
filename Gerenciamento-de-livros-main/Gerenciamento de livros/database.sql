sql
CREATE DATABASE book_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE book_manager;


-- Usuários para login
CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50) UNIQUE NOT NULL,
password_hash VARCHAR(255) NOT NULL,
role ENUM('admin','user') DEFAULT 'user',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Autores e livros
CREATE TABLE authors (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL
);


CREATE TABLE books (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(500) NOT NULL,
author_id INT NOT NULL,
isbn VARCHAR(50),
publisher VARCHAR(255),
year SMALLINT,
copies INT DEFAULT 1,
genre VARCHAR(100),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (author_id) REFERENCES authors(id)
);


-- Seed inicial
INSERT INTO users (username,password_hash,role) VALUES
('admin', SHA2('admin123',256), 'admin'),
('usuario', SHA2('123456',256), 'user');


INSERT INTO authors (name) VALUES ('Machado de Assis'),('J. K. Rowling');
INSERT INTO books (title,author_id,isbn,publisher,year,copies,genre) VALUES
('Dom Casmurro',1,'978-85-01-00000-1','Editora A',1899,3,'Romance'),
('Harry Potter e a Pedra Filosofal',2,'978-85-01-00000-2','Editora B',1997,5,'Fantasia');