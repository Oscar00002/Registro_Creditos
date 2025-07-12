# Registro de Créditos

Este proyecto es una aplicación web para el registro y visualización de créditos otorgados a clientes. Permite:

- Registrar créditos  
- Editar y eliminar créditos  
- Visualizar una tabla con los créditos registrados  
- Mostrar gráficas del monto total y créditos por mes  


## Tecnologías Utilizadas

- Python 3  
- Flask  
- SQLite  
- HTML5, CSS3, JavaScript
- Chart.js 


## Instrucciones para Ejecutar el Proyecto

### 1. Requisitos Previos

- Tener Python 

### 2. Clonar el Repositorio

### 3. Ejecutar la Aplicación  
La aplicación se ejecutara con python app.py

## Endpoints Disponibles
- GET / → Carga la interfaz principal (index.html)

- GET /creditos → Lista todos los créditos en formato JSON

- POST /creditos → Registra un nuevo crédito

- GET /creditos/<id> → Obtiene un crédito específico

- PUT /creditos/<id> → Actualiza un crédito existente

- DELETE /creditos/<id> → Elimina un crédito por ID


## Autor
- Oscar Pérez Rodríguez


