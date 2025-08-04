export async function downloadFile(linkToFile: string, filename: string) {
      try {
        console.log(linkToFile);
        // 1) Запросить PDF как Blob
        const response = await fetch(linkToFile, {
          method: 'GET',
          // при необходимости авторизационные заголовки
          // headers: { Authorization: 'Bearer ...' }
        });
        if (!response.ok) {
          throw new Error(`Ошибка сети: ${response.status}`);
        }
        const blob = await response.blob();

        // 2) Создать object URL
        const url = window.URL.createObjectURL(blob);

        // 3) Создать невидимую ссылку и кликнуть по ней
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();

        // 4) Очистить
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Не удалось скачать файл:', error);
      }
    }
