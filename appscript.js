let datosBase = []; // Cambiamos const por let

async function cargarDatosDesdeGoogle() {
    // Pega aquí la URL CSV que te dio Google Sheets
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTX8QjDtAKXCfIUI4Uc2FENvOfBh-XCoxjBGWiTxRkqHQ3YjnvY3TnZf7FqJsn2o3yAyhV0ge78nJea/pub?gid=570492353&single=true&output=csv'; 
    
    try {
        const respuesta = await fetch(csvUrl);
        const csvTexto = await respuesta.text();
        
        // Convertir CSV a un Array de Objetos (Asumiendo que la fila 1 son los encabezados)
        const lineas = csvTexto.split('\n');
        const encabezados = lineas[0].split(',').map(h => h.trim().toLowerCase());
        
        datosBase = lineas.slice(1).map(linea => {
            const valores = linea.split(',');
            let objeto = {};
            encabezados.forEach((encabezado, index) => {
                objeto[encabezado] = valores[index] ? valores[index].trim() : '';
            });
            return objeto;
        });

        // Una vez cargados los datos, renderizamos el anual por defecto
        renderizarDashboard('anual');
    } catch (error) {
        console.error("Error al cargar el CSV de Google Sheets:", error);
    }
}

// Reemplazar window.onload con esta nueva función
window.onload = () => cargarDatosDesdeGoogle();