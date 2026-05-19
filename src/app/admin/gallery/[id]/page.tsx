import { getCaller } from "@/trpc/server";
import { notFound } from "next/navigation";
import GalleryImageForm from "../gallery-image-form";

export const metadata = { title: "Edit Foto Galeri | Admin" };

type Props = { params: Promise<{ id: string }> };

export default async function EditGalleryImagePage({ params }: Props) {
  const { id } = await params;
  const imageId = parseInt(id, 10);
  if (isNaN(imageId)) notFound();

  const caller = await getCaller();
  const image = await caller.gallery.getById({ id: imageId }).catch(() => null);
  if (!image) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#1a1a1a]">
        Edit Foto Galeri
      </h1>
      <GalleryImageForm initial={image} />
    </div>
  );
}
