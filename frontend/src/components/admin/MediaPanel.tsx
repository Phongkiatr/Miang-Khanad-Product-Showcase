import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Modal, Field, SubmitBtn, Input, Confirm, LIcon } from './AdminUI';
import imageCompression from 'browser-image-compression';

export default function MediaPanel() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadImages = async () => {
    try {
      setLoading(true);
      const res = await api.media.list();
      setImages(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    // Validation: English, numbers, underscores, hyphens only. No spaces.
    if (customName && !/^[a-zA-Z0-9\-_]+$/.test(customName)) {
      alert('ชื่อรูปภาพต้องเป็นภาษาอังกฤษ ตัวเลข และเครื่องหมาย _ หรือ - เท่านั้น (ห้ามมีเว้นวรรค)');
      return;
    }

    // Limit origin file size to 10MB
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('ขนาดไฟล์ต้องไม่เกิน 10MB');
      return;
    }

    try {
      setUploading(true);

      let fileToUpload = selectedFile;
      
      // Auto-compress on the client side if > 1MB to bypass Vercel's 4.5MB Serverless Function limit
      if (selectedFile.type.startsWith('image/') && selectedFile.size > 1 * 1024 * 1024) {
        try {
          const options = {
            maxSizeMB: 1, // Compress to ~1MB
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: selectedFile.type // WebP / JPEG / PNG
          };
          fileToUpload = await imageCompression(selectedFile, options);
          console.log(`Compressed from ${selectedFile.size} to ${fileToUpload.size}`);
        } catch (err) {
          console.error("Compression failed:", err);
          // We can't fallback to original if it's > 4.5MB because Vercel will block it anyway.
          if (selectedFile.size > 4.5 * 1024 * 1024) {
            throw new Error('ไม่สามารถบีบอัดไฟล์ได้ และไฟล์ต้นฉบับใหญ่เกินระบบจะรับได้ (4.5MB)');
          }
        }
      }

      await api.media.upload(fileToUpload, customName);
      await loadImages();
      setShowUploadModal(false);
      setCustomName('');
      setSelectedFile(null);
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await api.media.delete(itemToDelete);
      setImages(images.filter(img => img.name !== itemToDelete));
      setItemToDelete(null);
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('คัดลอก URL เรียบร้อยแล้ว');
  };

  return (
    <div className="space-y-6">
      {/* Header & Upload Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-lg shadow-sm border border-black/5">
        <div>
          <h2 className="text-lg font-bold text-charcoal">คลังรูปภาพ (Gallery)</h2>
          <p className="text-xs text-muted mt-1">อัปโหลดและจัดการรูปภาพสำหรับใช้ในร้านค้า</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCustomName('');
              setSelectedFile(null);
              setShowUploadModal(true);
            }}
            className="px-6 py-2.5 bg-gold text-charcoal text-sm font-bold rounded-md
                       transition-all hover:bg-gold/80 flex items-center gap-2"
          >
            <LIcon name="upload" size="base" />
            อัปโหลดรูปภาพ
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <Modal title="อัปโหลดรูปภาพใหม่" onClose={() => !uploading && setShowUploadModal(false)}>
          <form onSubmit={handleUploadSubmit} className="flex flex-col gap-5">
            <Field label="ชื่อรูปภาพ (Optional)" hint="ต้องเป็นภาษาอังกฤษ ตัวเลข เครื่องหมาย _ หรือ - เท่านั้น (ห้ามมีเว้นวรรค)">
              <Input
                type="text"
                placeholder="เช่น backpack-blue-01"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </Field>

            <Field label="เลือกไฟล์รูปภาพ" required>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-charcoal/10 file:text-charcoal hover:file:bg-charcoal/20"
                />
                {selectedFile && (
                  <p className="text-[10px] text-muted italic">
                    ไฟล์ที่เลือก: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>
            </Field>

            <div className="pt-2">
              <SubmitBtn loading={uploading} label="ยืนยันการอัปโหลด" />
            </div>
          </form>
        </Modal>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Grid Display */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted">
          <LIcon name="spinner" className="animate-spin text-4xl mb-4 text-gold" />
          <p className="text-sm font-light">กำลังโหลดรูปภาพ...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-xl border-2 border-dashed border-black/5 text-muted">
          <LIcon name="image" size="xl" className="mb-4 opacity-20" />
          <p className="text-sm font-light">ยังไม่มีรูปภาพในคลัง</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {images.map((img) => (
            <div key={img.name} className="group relative bg-white rounded-lg overflow-hidden border border-black/5 shadow-sm hover:shadow-md transition-all">
              {/* Image Preview */}
              <div className="aspect-square bg-cream/50 overflow-hidden">
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                <button
                  onClick={() => copyToClipboard(img.url)}
                  className="w-full py-2 bg-white text-charcoal text-[10px] font-bold rounded uppercase tracking-wider 
                             hover:bg-gold transition-colors flex items-center justify-center gap-2"
                >
                  <LIcon name="copy" size="xs" />
                  Copy URL
                </button>
                <button
                  onClick={() => setItemToDelete(img.name)}
                  className="w-full py-2 bg-vermillion text-white text-[10px] font-bold rounded uppercase tracking-wider 
                             hover:bg-vermillion/80 transition-colors flex items-center justify-center gap-2"
                >
                  <LIcon name="trash-can" size="xs" />
                  Delete
                </button>
              </div>

              {/* Info */}
              <div className="p-2 border-t border-black/5">
                <div className="text-[9px] text-muted truncate mb-0.5" title={img.name}>
                  {img.name}
                </div>
                <div className="text-[8px] text-muted/60 font-mono">
                  {new Date(img.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {itemToDelete && (
        <Confirm
          message="ยืนยันการลบรูปภาพนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
          onConfirm={confirmDelete}
          onCancel={() => setItemToDelete(null)}
        />
      )}
    </div>
  );
}
