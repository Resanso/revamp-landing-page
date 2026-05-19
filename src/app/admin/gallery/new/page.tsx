import GalleryImageForm from "../gallery-image-form";

export const metadata = { title: "Tambah Foto Galeri | Admin" };

export default function NewGalleryImagePage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#1a1a1a]">
        Tambah Foto Galeri
      </h1>
      <GalleryImageForm />
    </div>
  );
}
