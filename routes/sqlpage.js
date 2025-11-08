const mysql = require('mysql2/promise');

 
async function startServer() {
    const connection = await mysql.createConnection(
        {
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'steam_example'
        }
    );
    app.get('/steam_example', async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.limit) || 5;
            const offset = (page - 1) * pageSize;
 
            const [rows] = await connection.execute(
                'select * FROM user LIMIT ? OFFSET ?',
                [pageSize.toString(), offset.toString()]
            );
            const [countResult] = await connection.execute('SELECT COUNT(*) AS total FROM user')
            const total = countResult[0].total || 0;
 
            res.json({
                current_page: page,
                page_size: pageSize,
                data: rows,
                total: total
            });
 
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error interno' })
        }
 
    });
    app.listen(PORT, () => {
        console.log(`Servidor corriendo http://localhost:${PORT}/steam_example`)
    })
}
 
startServer()
 

 