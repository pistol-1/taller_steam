const multer = require('multer');
const path = require('path');
const express = require("express");
const fs = require('fs');
const SqlService = require("../services/sqlService");

const router = express.Router();
const uploadPath = path.join(__dirname, '..', 'public', 'uploads');

// Asegura que la carpeta existe
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log('[INIT] Created uploads folder:', uploadPath);
} else {
  console.log('[INIT] Upload path ready:', uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('[MULTER] Destination callback called');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    console.log('[MULTER] Filename callback called');
    console.log('[MULTER] Original file name:', file.originalname);
    const filename = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '_' + filename);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('image'), async (req, res) => {
  console.log('\n========== [POST /images/upload] ==========');
  console.log('[HEADERS]', req.headers['content-type']);
  console.log('[BODY BEFORE MULTER]', req.body);
  console.log('[FILE OBJ]', req.file);

  try {
    if (!req.file) {
      console.warn('[WARN] req.file está vacío');
      return res.status(400).json({ message: 'There is no file in the request' });
    }

    const { username } = req.body;
    console.log('[USERNAME FIELD]', username);
    if (!username) {
      console.warn('[WARN] Username no recibido');
      return res.status(400).send("Missing fields.");
    }

      const { user_Password } = req.body;
    console.log('[USERNAME FIELD]', user_Password);
    if (!user_Password) {
      console.warn('[WARN] user_Password no recibido');
      return res.status(400).send("Missing fields.");
    }

    
      const { email } = req.body;
    console.log('[USERNAME FIELD]', email);
    if (!email) {
      console.warn('[WARN] email no recibido');
      return res.status(400).send("Missing fields.");
    }

      const { cellphone } = req.body;
    console.log('[USERNAME FIELD]', cellphone);
    if (!cellphone) {
      console.warn('[WARN] cellphone no recibido');
      return res.status(400).send("Missing fields.");
    }


    const filePath = `/uploads/${req.file.filename}`;
    console.log('[SAVED FILE PATH]', filePath);

    const db = new SqlService();
    console.log('[SQL] Connecting to DB...');
    await db.connectToDb();

    console.log('[SQL] Inserting record ->', username, filePath);
    await db.query(
      `INSERT INTO user (username, user_Password, email, cellphone, image) VALUES (?, ?, ?, ?, ?)`,
      [username, user_Password, email, cellphone, filePath]
    );

    await db.closeConnection();
    console.log('[SQL] Entry created successfully.');

    res.status(201).json({
      message: 'Entry created',
      filePath
    });
  } catch (err) {
    console.error('[ERROR]', err);
    res.status(500).json({
      message: 'Error creating entry.',
      error: err.message
    });
  }
});
router.get('/steam_example', async (req, res) => {
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

module.exports = router;
