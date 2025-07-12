from flask import Flask, request, jsonify, render_template
from database import init_db, get_connection

app = Flask(__name__)


init_db()

@app.route('/')
def home():
    return render_template('index.html')

# Ruta para registrar un nuevo crédito
@app.route('/creditos', methods=['POST'])
def registrar_credito():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO creditos (cliente, monto, tasa_interes, plazo, fecha_otorgamiento)
        VALUES (?, ?, ?, ?, ?)
    ''', (
        data['cliente'],
        data['monto'],
        data['tasa_interes'],
        data['plazo'],
        data['fecha_otorgamiento']
    ))
    conn.commit()
    id = cursor.lastrowid
    conn.close()
    return jsonify({'mensaje': 'Crédito registrado correctamente', 'id': id}), 201


@app.route('/creditos/<int:id>', methods=['DELETE'])
def eliminar_credito(id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM creditos WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Crédito eliminado correctamente'}), 200


# Ruta para listar todos los créditos
@app.route('/creditos', methods=['GET'])
def listar_creditos():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM creditos')
    creditos = cursor.fetchall()
    conn.close()

    # Convertir a JSON
    resultado = [
        {
            'id': row[0],
            'cliente': row[1],
            'monto': row[2],
            'tasa_interes': row[3],
            'plazo': row[4],
            'fecha_otorgamiento': row[5]
        } for row in creditos
    ]
    return jsonify(resultado)

@app.route('/creditos/<int:id>', methods=['GET'])
def obtener_credito(id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM creditos WHERE id = ?', (id,))
    credito = cursor.fetchone()
    conn.close()

    if credito:
        resultado = {
            'id': credito[0],
            'cliente': credito[1],
            'monto': credito[2],
            'tasa_interes': credito[3],
            'plazo': credito[4],
            'fecha_otorgamiento': credito[5]
        }
        return jsonify(resultado)
    else:
        return jsonify({'mensaje': 'Crédito no encontrado'}), 404
    
@app.route('/creditos/<int:id>', methods=['PUT'])
def actualizar_credito(id):
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE creditos
        SET cliente = ?, monto = ?, tasa_interes = ?, plazo = ?, fecha_otorgamiento = ?
        WHERE id = ?
    ''', (
        data['cliente'],
        data['monto'],
        data['tasa_interes'],
        data['plazo'],
        data['fecha_otorgamiento'],
        id
    ))
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Crédito actualizado correctamente'}), 200
    

if __name__ == '__main__':
    app.run(debug=True)