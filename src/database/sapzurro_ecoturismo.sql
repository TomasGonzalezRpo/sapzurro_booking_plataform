-- =====================================================
-- Base de Datos: sapzurro_ecoturismo
-- Desarrollado por: Andrés y equipo
-- Fecha: 2025-11-06
-- =====================================================

CREATE DATABASE IF NOT EXISTS sapzurro_ecoturismo;
USE sapzurro_ecoturismo;

-- =====================================================
-- TABLA PERFIL (ROLES)
-- =====================================================
CREATE TABLE perfil (
    id_perfil INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200),
    estado TINYINT DEFAULT 1
);

INSERT INTO perfil (nombre, descripcion) VALUES
('Administrador', 'Acceso total al sistema'),
('Usuario', 'Visualiza productos y servicios, sin modificarlos'),
('Aliado', 'Publica y gestiona sus productos o servicios turísticos');

-- =====================================================
-- TABLA PERSONA
-- =====================================================
CREATE TABLE persona (
    id_persona INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    tipo_documento ENUM('CC', 'CE', 'TI', 'PASAPORTE') NOT NULL,
    numero_documento VARCHAR(20) UNIQUE NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(150),
    estado TINYINT DEFAULT 1
);

-- =====================================================
-- TABLA USUARIO (local y Google)
-- =====================================================
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE,
    contrasena VARCHAR(255),
    id_persona INT NOT NULL,
    id_perfil INT NOT NULL,
    provider ENUM('local', 'google') DEFAULT 'local',
    google_id VARCHAR(100) UNIQUE,
    foto_url VARCHAR(255),
    estado TINYINT DEFAULT 1,
    FOREIGN KEY (id_persona) REFERENCES persona(id_persona),
    FOREIGN KEY (id_perfil) REFERENCES perfil(id_perfil)
);

-- =====================================================
-- TABLA CATEGORIA
-- =====================================================
CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(150)
);

INSERT INTO categoria (nombre, descripcion) VALUES
('Hoteles', 'Alojamientos y hospedajes'),
('Restaurantes', 'Comida típica y establecimientos gastronómicos'),
('Lanchas', 'Transporte marítimo local'),
('Tours', 'Recorridos guiados y actividades ecoturísticas');

-- =====================================================
-- TABLA PRODUCTO (servicios turísticos)
-- =====================================================
CREATE TABLE producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2),
    id_categoria INT,
    imagen_url VARCHAR(255),
    id_usuario INT NOT NULL,
    estado TINYINT DEFAULT 1,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- =====================================================
-- TABLA RESERVA
-- =====================================================
CREATE TABLE reserva (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_reserva DATE NOT NULL,
    cantidad_personas INT DEFAULT 1,
    estado ENUM('Pendiente','Confirmada','Cancelada') DEFAULT 'Pendiente',
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- =====================================================
-- DATOS DE PRUEBA
-- =====================================================

-- Personas
INSERT INTO persona (nombres, apellidos, tipo_documento, numero_documento, correo, telefono, direccion)
VALUES
('Yonier', 'Garcés', 'CC', '123456789', 'yonier@gmail.com', '3000000000', 'Sapzurro, Chocó'),
('Tomas', 'González', 'CC', '987654321', 'tomas@gmail.com', '3100000000', 'Sapzurro'),
('Andrés', 'González', 'CC', '555666777', 'andres@gmail.com', '3200000000', 'Medellín');

-- Usuarios
INSERT INTO usuario (username, contrasena, id_persona, id_perfil, provider) VALUES
('admin', 'admin123', 1, 1, 'local'),
('hotelmar', 'clave123', 2, 3, 'local'),
('usuario1', 'usuario123', 3, 2, 'local');

-- Productos
INSERT INTO producto (nombre, descripcion, precio, id_categoria, imagen_url, id_usuario) VALUES
('Cabañas del Mar', 'Hospedaje frente al mar con desayuno incluido', 150000, 1, '/img/cabanas.jpg', 2),
('Restaurante El Coral', 'Comidas típicas del Pacífico y bebidas naturales', 35000, 2, '/img/coral.jpg', 2),
('Tour a la Cascada del Cielo', 'Recorrido ecológico guiado por senderos naturales', 50000, 4, '/img/cascada.jpg', 2);

-- =====================================================
-- VISTA GENERAL DE USUARIOS
-- =====================================================
CREATE OR REPLACE VIEW vista_usuarios AS
SELECT 
    u.id_usuario,
    p.nombres,
    p.apellidos,
    pe.nombre AS rol,
    p.correo,
    u.username,
    u.provider,
    u.estado
FROM usuario u
INNER JOIN persona p ON u.id_persona = p.id_persona
INNER JOIN perfil pe ON u.id_perfil = pe.id_perfil;
