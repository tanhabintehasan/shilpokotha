export const getImageUrl = (item) => {
  const BACKEND_URL = "";

  // 1. Unified path search: Looks at cart/wishlist structure AND direct product objects
  const path = 
    item?.productId?.imageURL ||        // Admin Panel/DB structure
    item?.productId?.images?.[0] || 
    item?.productId?.image || 
    item?.imageURL ||                   // Direct product object (from ProductManagement)
    item?.img ||                        // Local state property
    item?.image || 
    (Array.isArray(item?.images) ? item.images[0] : null);

  // 2. Fallback for missing paths
  if (!path || path === "undefined" || path === "null") {
    return "https://placehold.co/300x400?text=No+Image";
  }

  // 3. Handle External URLs
  if (path.startsWith("http")) return path;

  // 4. Standardize local upload paths
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  
  return cleanPath.startsWith("uploads/") 
    ? `${BACKEND_URL}/${cleanPath}` 
    : `${BACKEND_URL}/uploads/${cleanPath}`;
};