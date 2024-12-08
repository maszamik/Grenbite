// URL API
const API_URL = "http://localhost:3000/statuspesanan";

// Fungsi untuk menampilkan data status pesanan
async function fetchData() {
  const response = await fetch(API_URL);
  const data = await response.json();

  const tableBody = document.getElementById("statusPesananTable").getElementsByTagName("tbody")[0];
  tableBody.innerHTML = ""; // Kosongkan tabel sebelum menampilkan data baru

  data.data.forEach(item => {
    const row = tableBody.insertRow();

    row.insertCell(0).textContent = item.id_status;
    row.insertCell(1).textContent = item.nama_status;

    const actionsCell = row.insertCell(2);
    // Tombol Update dengan kelas btn-primary
    const updateButton = document.createElement("button");
    updateButton.textContent = "Update";
    updateButton.classList.add("btn", "btn-primary");
    updateButton.onclick = () => openUpdateForm(item);
    actionsCell.appendChild(updateButton);

    // Tombol Delete dengan kelas btn-danger
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.onclick = () => deleteStatus(item.id_status);
    actionsCell.appendChild(deleteButton);
  });
}

// Fungsi untuk membuka form tambah data
function showAddForm() {
  document.getElementById("addForm").style.display = "block";
}

// Fungsi untuk menyembunyikan form tambah data
function hideAddForm() {
  document.getElementById("addForm").style.display = "none";
}

// Fungsi untuk submit tambah data
async function submitAdd() {
  const idStatus = document.getElementById("addIdStatus").value;
  const namaStatus = document.getElementById("addNamaStatus").value;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id_status: Number(idStatus), nama_status: namaStatus })
  });

  if (response.ok) {
    alert("Status pesanan berhasil ditambahkan!");
    hideAddForm();
    fetchData(); // Refresh data
  } else {
    alert("Gagal menambahkan status pesanan.");
  }
}

// Fungsi untuk membuka form update dan mengisi data saat ini
function openUpdateForm(item) {
  document.getElementById("updateForm").style.display = "block";
  document.getElementById("updateIdStatus").value = item.id_status;
  document.getElementById("updateNamaStatus").value = item.nama_status;
}

// Fungsi untuk menyembunyikan form update
function hideUpdateForm() {
  document.getElementById("updateForm").style.display = "none";
}

// Fungsi untuk submit update
async function submitUpdate() {
  const idStatus = document.getElementById("updateIdStatus").value;
  const namaStatus = document.getElementById("updateNamaStatus").value;

  const response = await fetch(`${API_URL}/${idStatus}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nama_status: namaStatus })
  });

  if (response.ok) {
    alert("Status pesanan berhasil diupdate!");
    hideUpdateForm();
    fetchData(); // Refresh data
  } else {
    alert("Gagal mengupdate status pesanan.");
  }
}

// Fungsi untuk menghapus status pesanan
async function deleteStatus(id_status) {
  if (!confirm("Yakin ingin menghapus data ini?")) return;

  const response = await fetch(`${API_URL}/${id_status}`, {
    method: "DELETE"
  });

  if (response.ok) {
    alert("Status pesanan berhasil dihapus!");
    fetchData(); // Refresh data
  } else {
    alert("Gagal menghapus status pesanan.");
  }
}

// Panggil fetchData() saat halaman pertama kali dimuat
window.onload = fetchData;
