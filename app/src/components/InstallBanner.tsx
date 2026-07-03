import { useState } from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { ShareIcon, DownloadIcon } from './icons';

const DISMISS_KEY = 'mm-install-dismissed';

export function InstallBanner() {
  const { canPromptInstall, promptInstall, isIos, isStandalone } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1');

  if (isStandalone || dismissed || !(canPromptInstall || isIos)) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  };

  return (
    <div className="mm-install-banner">
      {canPromptInstall ? <DownloadIcon /> : <ShareIcon />}
      <div className="mm-install-text">
        {canPromptInstall
          ? 'Установи как приложение — запускается прямо с экрана'
          : 'Добавь на экран «Домой»: значок «Поделиться» → «На экран Домой»'}
      </div>
      {canPromptInstall && (
        <button className="mm-install-btn" onClick={promptInstall}>
          Установить
        </button>
      )}
      <button className="mm-install-close" onClick={dismiss} aria-label="Закрыть">
        ×
      </button>
    </div>
  );
}
