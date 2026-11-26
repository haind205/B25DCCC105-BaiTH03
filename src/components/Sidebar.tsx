import type { ReactNode } from 'react';

interface CategoryItem {
  id: string;
  label: string;
  icon: ReactNode;
}

export const SHOP_CATEGORIES: CategoryItem[] = [
  {
    id: 'all',
    label: 'All Products',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: 'electronics',
    label: 'Electronics',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: 'jewelery',
    label: 'Jewelery',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 3h12l4 6-10 13L2 9z" />
        <path d="M11 3 8 9l4 13 4-13-3-6" />
        <path d="M2 9h20" />
      </svg>
    ),
  },
  {
    id: "men's clothing",
    label: "Men's clothing",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
      </svg>
    ),
  },
  {
    id: "women's clothing",
    label: "Women's clothing",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
];

interface SidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function Sidebar({ selectedCategory, onSelectCategory }: SidebarProps) {
  return (
    <aside className="sidebar-col" aria-label="Danh mục sản phẩm">
      <div className="card sidebar-card">
        <h2 className="sidebar-heading">Danh mục</h2>
        <ul className="sidebar-list">
          {SHOP_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <li key={cat.id}>
                <button
                  type="button"
                  className={isActive ? 'sidebar-btn active' : 'sidebar-btn'}
                  onClick={() => onSelectCategory(cat.id)}
                >
                  <span className="sidebar-icon" aria-hidden="true">
                    {cat.icon}
                  </span>
                  <span>{cat.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile / Tablet horizontal chips */}
      <div className="mobile-category-chips">
        {SHOP_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={isActive ? 'chip-btn active' : 'chip-btn'}
              onClick={() => onSelectCategory(cat.id)}
            >
              <span className="sidebar-icon" aria-hidden="true">
                {cat.icon}
              </span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
