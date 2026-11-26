interface ProductSkeletonProps {
  count?: number;
}

export function ProductSkeleton({ count = 8 }: ProductSkeletonProps) {
  return (
    <div className="product-grid" aria-busy="true" aria-label="Đang tải sản phẩm">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="product-card skeleton-card">
          <div className="skeleton skeleton-image" />
          <div className="skeleton skeleton-badge" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-title short" />
          <div className="skeleton skeleton-price" />
          <div className="skeleton skeleton-btn" />
        </div>
      ))}
    </div>
  );
}
