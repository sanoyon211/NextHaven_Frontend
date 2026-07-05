import api from "@/lib/api";

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  try {
    // Next.js Server Components require absolute URLs for fetch if not using a custom configured axios instance.
    // However, since api is an axios instance with a baseURL, it will work server-side provided the baseURL is absolute.
    const res = await api.get(`/rooms/${id}`);
    const room = res.data?.data;
    
    if (!room) {
      return {
        title: "Room Not Found",
      };
    }
    
    const title = room.roomNumber ? `ROOM ${room.roomNumber} - ${room.title}` : room.title;
    
    return {
      title,
      description: room.description || `Discover the luxury of ${title} at NextHaven.`,
      openGraph: {
        title: `${title} | NextHaven`,
        description: room.description || `Discover the luxury of ${title} at NextHaven.`,
        images: room.images && room.images.length > 0 ? [{ url: room.images[0] }] : [],
      },
    };
  } catch (error) {
    return {
      title: "Room Details",
    };
  }
}

export default function RoomDetailsLayout({ children }) {
  return <>{children}</>;
}
