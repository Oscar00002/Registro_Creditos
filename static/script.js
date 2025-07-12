document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('formCredito');
    const tablaBody = document.querySelector('#tablaCreditos tbody');
    const cancelEditBtn = document.getElementById('cancelEdit');
    const ctx = document.getElementById('grafica').getContext('2d');
    const ctxMeses = document.getElementById('graficaMeses').getContext('2d');


    let editandoId = null;
    let chart, chartMeses;



    function actualizarGrafica(total) {
        chart.data.datasets[0].data[0] = total;
        chart.update();

    }

    function actualizarMeses(creditos) {
        const mesesMap = {};
        creditos.forEach(c => {
            const mes = c.fecha_otorgamiento.slice(0,7); // formato YYYY-MM
            mesesMap[mes] = (mesesMap[mes] || 0) + c.monto;
        });
        const mesesLabels = Object.keys(mesesMap).sort();
        const mesesData = mesesLabels.map(m => mesesMap[m]);

        chartMeses.data.labels = mesesLabels;
        chartMeses.data.datasets[0].data = mesesData;
        chartMeses.update();
    }






    async function cargarCreditos(){
        const respuesta = await fetch ('/creditos');
        const creditos = await respuesta.json();
        tablaBody.innerHTML = '';
        let total = 0;

        creditos.forEach(credito => {
            total += credito.monto;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${credito.id}</td>
                <td>${credito.cliente}</td>
                <td>${credito.monto.toFixed(2)}</td>
                <td>${credito.tasa_interes.toFixed(2)}%</td>
                <td>${credito.plazo}</td>
                <td>${credito.fecha_otorgamiento}</td>
                <td>
                    <button class="btn-editar" data-id="${credito.id}">Editar</button>
                    <button class="btn-eliminar" data-id="${credito.id}">Eliminar</button>
                </td>
            `;
            tablaBody.appendChild(tr);
        });
        actualizarGrafica(total);
        actualizarMeses(creditos);
        asignarListenersEditar();
        asignarListenersEliminar();
    }



    function asignarListenersEliminar() {
        tablaBody.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            eliminarCredito(id);
            });
        });
    }


    async function eliminarCredito(id) {
        if (confirm('¿Seguro que deseas eliminar este crédito?')) {
            await fetch(`/creditos/${id}`, { method: 'DELETE' });
            cargarCreditos();
        }
    }


    function asignarListenersEditar() {
        tablaBody.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', () => { 
            const id = btn.getAttribute('data-id');
            editarCredito(id);
            });
        });
    }

    async function editarCredito(id) {
        const respuesta = await fetch(`/creditos/${id}`);
        const credito = await respuesta.json();
        editandoId = id;
        form.cliente.value = credito.cliente;
        form.monto.value = credito.monto;
        form.tasa_interes.value = credito.tasa_interes;
        form.plazo.value = credito.plazo;
        form.fecha_otorgamiento.value = credito.fecha_otorgamiento;
        cancelEditBtn.style.display = 'inline';
    }

    cancelEditBtn.addEventListener('click', () => {
    editandoId = null;
    form.reset();
    cancelEditBtn.style.display = 'none';
    });

    form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const credito = {
        cliente: form.cliente.value,
        monto: parseFloat(form.monto.value),
        tasa_interes: parseFloat(form.tasa_interes.value),
        plazo: parseInt(form.plazo.value),
        fecha_otorgamiento: form.fecha_otorgamiento.value
    };

    if (editandoId) {
        await fetch(`/creditos/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credito)
        });
        editandoId = null;
        cancelEditBtn.style.display = 'none';
    } else {
        await fetch('/creditos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credito)
        });
    }

    form.reset();
    cargarCreditos();
    });


    // Inicializar las gráficas

    chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Total Créditos'],
        datasets: [{
        label: 'Monto Total',
        data: [0],
        backgroundColor: 'rgba(54, 162, 235, 0.7)'
        }]
    },
    options: {
        scales: { y: { beginAtZero: true } }
    }
    });


    chartMeses = new Chart(ctxMeses, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Créditos por Mes',
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.7)'
        }]
    },
    options: {
        scales: { y: { beginAtZero: true } }
    }
    });

    cargarCreditos();

}); 