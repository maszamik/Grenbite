const mongoose = require('mongoose');

const statusPesananSchema = new mongoose.Schema({
  id_status: { type: Number, required: true, unique: true },  // Menjaga id_status sebagai unik
  nama_status: { type: String, required: true },
});

// Model name 'StatusPesanan' and collection name 'status_pesanan' for consistency
const StatusPesanan = mongoose.model('StatusPesanan', statusPesananSchema, 'status_pesanan');
module.exports = StatusPesanan;
