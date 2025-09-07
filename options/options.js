// el
const windowSizeSlider = document.getElementById('windowSize');
const sizeDisplay = document.getElementById('sizeDisplay');
const aspectWidthInput = document.getElementById('aspectWidth');
const aspectHeightInput = document.getElementById('aspectHeight');
const modeWindowRadio = document.getElementById('modeWindow');
const modeTabRadio = document.getElementById('modeTab');
const windowSettings = document.getElementById('windowSettings');
const langFrenchRadio = document.getElementById('langFrench');
const langEnglishRadio = document.getElementById('langEnglish');

document.addEventListener('DOMContentLoaded', loadSettings);
windowSizeSlider.addEventListener('input', handleSizeChange);
aspectWidthInput.addEventListener('input', handleRatioChange);
aspectHeightInput.addEventListener('input', handleRatioChange);
modeWindowRadio.addEventListener('change', handleModeChange);
modeTabRadio.addEventListener('change', handleModeChange);
langFrenchRadio.addEventListener('change', handleLanguageChange);
langEnglishRadio.addEventListener('change', handleLanguageChange);

async function loadSettings() {
    try {
        const settings = await browser.storage.sync.get({
            windowSize: 50,
            aspectRatioWidth: 1,
            aspectRatioHeight: 1,
            openMode: 'window',
            language: 'french'
        });

        windowSizeSlider.value = settings.windowSize;
        sizeDisplay.textContent = settings.windowSize + '%';
        aspectWidthInput.value = settings.aspectRatioWidth;
        aspectHeightInput.value = settings.aspectRatioHeight;

        if (settings.openMode === 'tab') {
            modeTabRadio.checked = true;
            modeWindowRadio.checked = false;
        } else {
            modeWindowRadio.checked = true;
            modeTabRadio.checked = false;
        }

        if (settings.language === 'english') {
            langEnglishRadio.checked = true;
            langFrenchRadio.checked = false;
        } else {
            langFrenchRadio.checked = true;
            langEnglishRadio.checked = false;
        }

        updateWindowSettingsVisibility(settings.openMode);
    } catch (error) {
    }
}

function handleLanguageChange() {
    saveSettings();
}

function handleModeChange() {
    const selectedMode = modeWindowRadio.checked ? 'window' : 'tab';
    updateWindowSettingsVisibility(selectedMode);
    saveSettings();
}

function updateWindowSettingsVisibility(mode) {
    if (mode === 'window') {
        windowSettings.classList.remove('hidden');
    } else {
        windowSettings.classList.add('hidden');
    }
}

function handleSizeChange() {
    const size = windowSizeSlider.value;
    sizeDisplay.textContent = size + '%';
    saveSettings();
}

function handleRatioChange() {
    const width = Math.max(0.1, parseFloat(aspectWidthInput.value) || 1);
    const height = Math.max(0.1, parseFloat(aspectHeightInput.value) || 1);

    aspectWidthInput.value = width;
    aspectHeightInput.value = height;

    saveSettings();
}

async function saveSettings() {
    try {
        const selectedMode = modeWindowRadio.checked ? 'window' : 'tab';
        const selectedLanguage = langFrenchRadio.checked ? 'french' : 'english';

        const settings = {
            windowSize: parseInt(windowSizeSlider.value),
            aspectRatioWidth: parseFloat(aspectWidthInput.value),
            aspectRatioHeight: parseFloat(aspectHeightInput.value),
            openMode: selectedMode,
            language: selectedLanguage
        };

        await browser.storage.sync.set(settings);
    } catch (error) {
    }
}