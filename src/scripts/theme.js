// theme.js
const toggleButton = document.querySelector('.toggle-button');
toggleButton.addEventListener('change', toggleTheme, false);

const theme = {
  dark: {
    '--primary-color': '#325b97',
    '--secondary-color': '#9cafeb',
    '--font-color': '#e1e1ff',
    '--bg-color': '#000137',
    '--heading-color': '#818cab'
  },
  light: {
    '--primary-color': '#0d0b52',
    '--secondary-color': '#3458b9',
    '--font-color': '#424242',
    '--bg-color': '#E5CCCA',
    '--heading-color': '#292922'
  }
};

function toggleTheme(e) {
  if (e.target.checked) {
    useTheme('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    useTheme('light');
    localStorage.setItem('theme', 'light');
  }
}

function useTheme(themeChoice) {
  document.documentElement.style.setProperty(
    '--primary-color',
    theme[themeChoice]['--primary-color']
  );
  document.documentElement.style.setProperty(
    '--secondary-color',
    theme[themeChoice]['--secondary-color']
  );
  document.documentElement.style.setProperty(
    '--font-color',
    theme[themeChoice]['--font-color']
  );
  document.documentElement.style.setProperty(
    '--bg-color',
    theme[themeChoice]['--bg-color']
  );
  document.documentElement.style.setProperty(
    '--heading-color',
    theme[themeChoice]['--heading-color']
  );
}

const preferredTheme = localStorage.getItem('theme');
if (preferredTheme === 'dark') {
  useTheme('dark');
  toggleButton.checked = true;
} else {
  useTheme('light');
  toggleButton.checked = false;
}