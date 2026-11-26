/*
 * From Uiverse.io by RiccardoRapelli - https://uiverse.io/RiccardoRapelli/jolly-chicken-91
 * MIT License, Copyright (c) RiccardoRapelli (Riccardo Rapelli)
 */
import { useTheme } from '../contexts/ThemeContext';
import './ThemeSwitch.css';

export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <label className="uiverse-switch" aria-label="Đổi giao diện sáng/tối">
      <input
        className="uiverse-switch-input"
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
      />
      <div className="uiverse-slider uiverse-round">
        <div className="uiverse-sun-moon">
          <svg
            id="uiverse-moon-dot-1"
            className="uiverse-moon-dot"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg
            id="uiverse-moon-dot-2"
            className="uiverse-moon-dot"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg
            id="uiverse-moon-dot-3"
            className="uiverse-moon-dot"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg
            id="uiverse-light-ray-1"
            className="uiverse-light-ray"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg
            id="uiverse-light-ray-2"
            className="uiverse-light-ray"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg
            id="uiverse-light-ray-3"
            className="uiverse-light-ray"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>

          <svg
            id="uiverse-cloud-1"
            className="uiverse-cloud-dark"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg
            id="uiverse-cloud-2"
            className="uiverse-cloud-dark"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg
            id="uiverse-cloud-3"
            className="uiverse-cloud-dark"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg
            id="uiverse-cloud-4"
            className="uiverse-cloud-light"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg
            id="uiverse-cloud-5"
            className="uiverse-cloud-light"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg
            id="uiverse-cloud-6"
            className="uiverse-cloud-light"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
        </div>
        <div className="uiverse-stars">
          <svg
            id="uiverse-star-1"
            className="uiverse-star"
            viewBox="0 0 20 20"
          >
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
          <svg
            id="uiverse-star-2"
            className="uiverse-star"
            viewBox="0 0 20 20"
          >
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
          <svg
            id="uiverse-star-3"
            className="uiverse-star"
            viewBox="0 0 20 20"
          >
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
          <svg
            id="uiverse-star-4"
            className="uiverse-star"
            viewBox="0 0 20 20"
          >
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
        </div>
      </div>
    </label>
  );
}
