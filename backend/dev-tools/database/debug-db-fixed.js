const pool = require('../../db');

async function testDB() {
    try {
        console.log('Conectando a la base de datos...');
        
        // Ver estructura de la tabla usuarios
        console.log('=== TABLA USUARIOS ===');
        const tableInfoUsuarios = await pool.query(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'usuarios'
            ORDER BY ordinal_position;
        `);
        
        tableInfoUsuarios.rows.forEach(row => {
            console.log(`- ${row.column_name}: ${row.data_type} (${row.is_nullable})`);
        });
        
        // Ver estructura de la tabla artículos
        console.log('\n=== TABLA ARTÍCULOS ===');
        const tableInfoArticulos = await pool.query(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'articulos'
            ORDER BY ordinal_position;
        `);
        
        if (tableInfoArticulos.rows.length === 0) {
            console.log('La tabla artículos no existe o no tiene columnas');
        } else {
            tableInfoArticulos.rows.forEach(row => {
                console.log(`- ${row.column_name}: ${row.data_type} (${row.is_nullable})`);
            });
        }
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
}

testDB();
