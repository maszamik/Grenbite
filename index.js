const express = require('express');
const cors = require('cors');  // Impor CORS
const connectDB = require('./config/database'); // Menghubungkan ke file database.js
const StatusPesanan = require('./models/statuspesanan'); // Mengimpor model statuspesanan

const app = express();
const PORT = 3000;

// Koneksi ke MongoDB
connectDB();

// Aktifkan CORS dengan opsi origin untuk mengizinkan frontend dari port 3001
app.use(cors({
  origin: 'http://localhost:3001',  // URL frontend React.js
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Metode HTTP yang diizinkan
  allowedHeaders: ['Content-Type'],  // Header yang diizinkan
}));

// Middleware untuk parsing JSON
app.use(express.json());

// Middleware untuk melayani file statis dari folder "public"
app.use(express.static('public'));

// CREATE: Tambahkan data statuspesanan baru melalui API
app.post('/statuspesanan', async (req, res) => {
  try {
    // Validasi input
    const { nama_status } = req.body;
    if (!nama_status) {
      return res.status(400).json({ success: false, message: 'Nama status tidak boleh kosong!' });
    }

    // Ambil id_status terakhir yang ada untuk penambahan berikutnya (atau auto increment)
    const lastStatusPesanan = await StatusPesanan.findOne().sort({ id_status: -1 }); // Ambil data terakhir berdasarkan id_status yang terbesar
    const newId = lastStatusPesanan ? lastStatusPesanan.id_status + 1 : 1; // Atur ID untuk data baru

    // Membuat statusPesanan baru
    const newStatusPesanan = new StatusPesanan({
      id_status: newId,
      nama_status: nama_status
    });

    await newStatusPesanan.save(); // Simpan ke database
    res.status(201).json({ success: true, message: 'Berhasil Menambahkan Data Pesanan Baru!', data: newStatusPesanan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan data!', error });
  }
});


// READ ALL: Dapatkan semua data statuspesanan dengan filter pencarian berdasarkan nama_status
app.get('/statuspesanan', async (req, res) => {
  try {
    const { searchQuery } = req.query;  // Ambil query parameter searchQuery
    let query = {};

    // Jika ada searchQuery, kita akan menambahkannya ke filter
    if (searchQuery) {
      query = { nama_status: { $regex: searchQuery, $options: 'i' } };  // Case-insensitive search
    }

    const statusPesananList = await StatusPesanan.find(query);
    res.status(200).json({ success: true, data: statusPesananList });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data!', error });
  }
});



// READ ONE: Dapatkan data statuspesanan berdasarkan id_status
app.get('/statuspesanan/:id_status', async (req, res) => {
  try {
    const id_status = Number(req.params.id_status);
    if (isNaN(id_status)) {
      return res.status(400).json({ success: false, message: 'id_status harus berupa angka!' });
    }

    const statusPesanan = await StatusPesanan.findOne({ id_status });
    if (!statusPesanan) {
      return res.status(404).json({ success: false, message: 'Data Status Pesanan tidak ditemukan!' });
    }

    res.status(200).json({ success: true, data: statusPesanan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data!', error });
  }
});

// UPDATE: Perbarui data statuspesanan berdasarkan id_status
app.put('/statuspesanan/:id_status', async (req, res) => {
  try {
    const id_status = Number(req.params.id_status);
    if (isNaN(id_status)) {
      return res.status(400).json({ success: false, message: 'id_status harus berupa angka!' });
    }

    const updatedStatusPesanan = await StatusPesanan.findOneAndUpdate(
      { id_status },
      req.body,
      { new: true }
    );
    if (!updatedStatusPesanan) {
      return res.status(404).json({ success: false, message: 'Data Status Pesanan tidak ditemukan!' });
    }

    res.status(200).json({ success: true, message: 'Status Pesanan berhasil diperbarui!', data: updatedStatusPesanan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui data!', error });
  }
});

// DELETE: Hapus data statuspesanan berdasarkan id_status
app.delete('/statuspesanan/:id_status', async (req, res) => {
  try {
    const id_status = Number(req.params.id_status);
    if (isNaN(id_status)) {
      return res.status(400).json({ success: false, message: 'id_status harus berupa angka!' });
    }

    const result = await StatusPesanan.findOneAndDelete({ id_status });
    if (!result) {
      return res.status(404).json({ success: false, message: 'Data Status Pesanan tidak ditemukan!' });
    }

    res.status(200).json({ success: true, message: 'Data Status Pesanan berhasil dihapus!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus data!', error });
  }
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
