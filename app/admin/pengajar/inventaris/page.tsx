"use client";

import { useState, useEffect } from "react";
import { inventarisService, type Inventaris } from "@/app/services/inventarisService";
import InventarisHeader from "./_features/InventarisHeader";
import InventarisTable from "./_features/InventarisTable";
import InventarisModal from "./_features/InventarisModal";
import InventarisDeleteDialog from "./_features/InventarisDeleteDialog";
import InventarisDetailModal from "./_features/InventarisDetailModal";

export default function InventarisPage() {
  const [data, setData] = useState<Inventaris[]>([]);
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState<string>("all");
  const [filterKondisi, setFilterKondisi] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Inventaris | null>(null);
  const [deleteItem, setDeleteItem] = useState<Inventaris | null>(null);
  const [detailItem, setDetailItem] = useState<Inventaris | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await inventarisService.getAll();
      setData(data);
    };

    loadData();
  }, []);

  const refreshData = async () => {
    const data = await inventarisService.getAll();
    setData(data);
  };

  const handleCreate = async (item: Omit<Inventaris, "id">) => {
    await inventarisService.create(item);
    refreshData();
    setShowModal(false);
  };

  const handleUpdate = async (updates: Partial<Inventaris>) => {
    if (!editingItem) return;
    await inventarisService.update(editingItem.id, updates);
    refreshData();
    setEditingItem(null);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    await inventarisService.delete(deleteItem.id);
    refreshData();
    setDeleteItem(null);
  };

  const filteredData = data.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kode_alat.toLowerCase().includes(search.toLowerCase());
    const matchKategori = filterKategori === "all" || item.kategori === filterKategori;
    const matchKondisi = filterKondisi === "all" || item.kondisi === filterKondisi;
    return matchSearch && matchKategori && matchKondisi;
  });

  return (
    <div className="w-full space-y-6">
      <InventarisHeader
        search={search}
        setSearch={setSearch}
        filterKategori={filterKategori}
        setFilterKategori={setFilterKategori}
        filterKondisi={filterKondisi}
        setFilterKondisi={setFilterKondisi}
        onAdd={() => {
          setEditingItem(null);
          setShowModal(true);
        }}
        total={data.length}
      />

      <InventarisTable
        data={filteredData}
        onEdit={(item) => setEditingItem(item)}
        onDelete={(item) => setDeleteItem(item)}
        onDetail={(item) => setDetailItem(item)}
      />

      {showModal && (
        <InventarisModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreate}
        />
      )}

      {editingItem && (
        <InventarisModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={handleUpdate}
        />
      )}

      {deleteItem && (
        <InventarisDeleteDialog
          item={deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleDelete}
        />
      )}

      {detailItem && (
        <InventarisDetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onEdit={() => {
            setEditingItem(detailItem);
            setDetailItem(null);
          }}
        />
      )}
    </div>
  );
}
